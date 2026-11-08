'use strict';
// Full source-bank candidate audit: the 3,345 original flashcards, 56 older
// supplementary sources and five later guarded add-ons. Read-only.
// This does NOT claim that every raw source entry survives every live
// source-specific loader guard, or that all unseen student replies were marked.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=path=>fs.readFileSync(path,'utf8'),json=path=>JSON.parse(read(path));
const app=read('app.js'),deck=json('deck.json');
assert.equal(deck.cards.length,3345);
assert.equal(new Set(deck.cards.map(c=>c.id)).size,3345);
const match=app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/);
assert(match,'Historical card loader manifest missing');
const historical=[...match[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
assert.equal(historical.length,56);
const focused=[
 'maths_first_mock_micro_recall_v348.json',
 'chemistry_cracking_pressure_recall_v354.json',
 'chemistry_alkane_trend_recall_v367.json',
 'physics_light_history_recall_v370.json',
 'chemistry_kp_catalyst_recall_v375.json'
];
for(const path of focused)
 assert(app.includes("'./"+path+"'"),'Focused source no longer referenced '+path);
const sources=[...focused,...historical];
const raw=sources.flatMap(path=>{
 assert(fs.existsSync(path),'A flashcard source file is missing: '+path);
 const b=json(path);
 assert(Array.isArray(b.cards),'No flashcard array in '+path);
 return b.cards.map((c,index)=>({...c,__source:path,__sourceIndex:index}));
});
const key=value=>String(value??'').trim().toLowerCase().replace(/\s+/g,' ')
 .replace(/[.!?]+$/g,'').trim();
const validSubjects=new Set(['Physics','Chemistry','Maths']);
const cards=deck.cards.filter(c=>c.active!==false).map(c=>({...c,__source:'deck.json'}));
const seen=new Set(cards.map(c=>c.id));
let skippedDuplicate=0,skippedInactive=0;
for(const c of raw){
 if(!c||typeof c.id!=='string'||!c.id.trim())continue;
 if(c.active===false){skippedInactive++;continue}
 if(seen.has(c.id)){skippedDuplicate++;continue}
 // This is a potential source-pool candidate, NOT a reimplementation of the
 // live supplementary-source guard conditions in app.js.
 cards.push(c);seen.add(c.id);
}
assert.equal(new Set(cards.map(c=>c.id)).size,cards.length);
const ms=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS=');
const me=app.indexOf('function startMockSession(){',ms);
assert(ms>0&&me>ms);
const eligible=new Function(app.slice(ms,me)+'\nreturn mockEligibleCard;')();
const firstMock=cards.filter(c=>c.active!==false&&c.taught!==false&&eligible(c));
const originalMock=firstMock.filter(c=>c.__source==='deck.json');
assert.equal(originalMock.length,2379,'Original school mock card cohort changed');
const extraMock=firstMock.filter(c=>c.__source!=='deck.json');
const bySubject=Object.fromEntries(['Physics','Chemistry','Maths'].map(subject=>[
 subject,{original:originalMock.filter(c=>c.subject===subject).length,
  supplementCandidate:extraMock.filter(c=>c.subject===subject).length}
]));
const empty=firstMock.filter(c=>!key(c.front)||!key(c.back));
const unknownSubject=firstMock.filter(c=>!validSubjects.has(c.subject));
const long=firstMock.filter(c=>String(c.front||'').length>185||String(c.back||'').length>350);
const verbose=firstMock.filter(c=>String(c.front||'').length>145||String(c.back||'').length>170);
const multipart=firstMock.filter(c=>/(?:\([a-d]\)|\b[4-9]\s*marks?\b)/i.test(String(c.front||'')));
const specMissing=firstMock.filter(c=>!String(c.specRef||'').trim());
const noAccept=firstMock.filter(c=>!Array.isArray(c.accept)||c.accept.length===0);
const noReject=firstMock.filter(c=>!Array.isArray(c.reject)||c.reject.length===0);
const exactConflicts=[],sameFrontBack=[],duplicateAccepted=[],badTypes=[];
const prohibited=new Set(['idk','i dont know','i do not know','no idea','not sure','unsure','skip']);
const nonanswersAccepted=[];
for(const c of firstMock){
 if(!Array.isArray(c.accept)&&c.accept!==undefined||
    !Array.isArray(c.reject)&&c.reject!==undefined)badTypes.push({id:c.id,source:c.__source});
 const accepted=[c.back,...(Array.isArray(c.accept)?c.accept:[])].map(key).filter(Boolean);
 const rejected=(Array.isArray(c.reject)?c.reject:[]).map(key).filter(Boolean);
 const wrong=new Set(rejected);
 for(const a of new Set(accepted)){
  if(wrong.has(a))exactConflicts.push({id:c.id,subject:c.subject,source:c.__source,example:a});
  if(prohibited.has(a))nonanswersAccepted.push({id:c.id,source:c.__source,example:a});
 }
 if(key(c.front)===key(c.back))sameFrontBack.push({id:c.id,source:c.__source});
 const valid=(Array.isArray(c.accept)?c.accept:[]).map(key).filter(Boolean);
 if(new Set(valid).size!==valid.length)
  duplicateAccepted.push({id:c.id,source:c.__source,count:valid.length-new Set(valid).size});
}
const summary={
 run:'v419',readOnly:true,
 coreDeckCards:deck.cards.length,historicalCardSourceFiles:historical.length,
 focusedSourceFiles:focused.length,rawSupplementRecords:raw.length,
 rawSourceDuplicateIdSkipped:skippedDuplicate,rawInactiveSkipped:skippedInactive,
 candidateCardsAfterCoreDedup:cards.length,
 firstMockCandidateCount:firstMock.length,
 originalFirstMockCount:originalMock.length,
 extraFirstMockCandidates:extraMock.length,
 bySubject,
 blankCount:empty.length,blankSample:empty.slice(0,24).map(c=>({id:c.id,source:c.__source})),
 unknownSubjectCount:unknownSubject.length,
 longCount:long.length,longSample:long.slice(0,30).map(c=>({
  id:c.id,subject:c.subject,source:c.__source,
  frontLength:String(c.front||'').length,backLength:String(c.back||'').length
 })),
 verboseCount:verbose.length,verboseSample:verbose.slice(0,25).map(c=>({id:c.id,source:c.__source,frontLength:String(c.front||'').length,backLength:String(c.back||'').length})),
 multipartCount:multipart.length,multipartSample:multipart.slice(0,25).map(c=>({id:c.id,source:c.__source})),
 noAcceptCount:noAccept.length,noRejectCount:noReject.length,
 specMissingCount:specMissing.length,
 specMissingBySubject:Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,specMissing.filter(c=>c.subject===s).length])),
 specMissingSample:specMissing.slice(0,20).map(c=>({id:c.id,source:c.__source})),
 exactAcceptRejectConflictCount:exactConflicts.length,
 exactAcceptRejectConflictExamples:exactConflicts.slice(0,100),
 samePromptAndAnswerCount:sameFrontBack.length,
 samePromptAndAnswerSample:sameFrontBack.slice(0,30),
 duplicatedAcceptedVariantCount:duplicateAccepted.length,
 duplicatedAcceptedVariantSample:duplicateAccepted.slice(0,25),
 nonanswerAcceptedCount:nonanswersAccepted.length,
 nonanswerAcceptedExamples:nonanswersAccepted.slice(0,20),
 invalidAcceptRejectTypeCount:badTypes.length,
 limitations:[
 'Candidate count includes raw supplementary records which may be rejected by source-index loader rules; original core count is exact.',
 'Counts of long cards and missing accepted/rejected examples are audit leads, not proof of poor teaching or incorrect automatic marks.',
 'Exact answer/reject overlap is a genuine marking-data conflict only when both entries reach the same live card; evaluate source and loader guard before editing.',
 'This audit does not certify AQA complete syllabus coverage, independently score hand-drawn evidence or modify learner records.'
 ]};
assert.equal(empty.length,0,'A blank mock candidate card needs investigation');
assert.equal(unknownSubject.length,0,'Unknown mock candidate subject');
assert.equal(nonanswersAccepted.length,0,'A raw nonanswer is explicitly accepted');
console.log('PASS v419 baseline loaded-source shapes and original school mock count; editorial potential conflicts reported below.');
console.log('V419_MOCK_CARD_REPORT_START');
console.log(JSON.stringify(summary,null,2));
console.log('V419_MOCK_CARD_REPORT_END');
