'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),cards=j('chemistry_as_bonding_structures_recall_v277.json'),bank=j('chemistry_as_bonding_structures_practice_v277.json'),audit=j('editorial/task1-v277-chemistry-bonding-selected-crosswalk.json'),core=j('deck.json');
assert.equal(cards.version,'v277');assert.equal(bank.version,'v277');assert.equal(cards.cards.length,20);assert.equal(bank.questions.length,4);
assert.equal(core.cards.length,3345);assert.equal(j('exam_questions.json').questions.length,1268);
const qUrls=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const cUrls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert.equal(qUrls.length,40);assert.equal(qUrls[39],'chemistry_as_bonding_structures_practice_v277.json');
assert.equal(cUrls.length,50);assert.equal(cUrls[49],'chemistry_as_bonding_structures_recall_v277.json');
for(const s of ['chemistry_as_bonding_structures_practice_v277.json','chemistry_as_bonding_structures_recall_v277.json'])assert(sw.includes("'./"+s+"'"));
assert(sw.includes('-v277-bonding-structures'));
const prior=[...core.cards,...cUrls.slice(0,49).flatMap(p=>j(p).cards||[])];
const ids=new Set(prior.map(c=>c.id)),fronts=new Set(prior.filter(c=>c.subject==='Chemistry').map(c=>String(c.front||'').trim().toLowerCase()));
const a=app.indexOf('function normalise('),b=app.indexOf('function importantTokens(',a);assert(a>=0&&b>a);
const evaluate=new Function('window',app.slice(a,b)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const refs=new Set(['3.1.3.1','3.1.3.2','3.1.3.3','3.1.3.4','3.1.3.7']);
let accept=0,reject=0;
for(const c of cards.cards){
 assert(!ids.has(c.id));ids.add(c.id);
 assert(!fronts.has(c.front.trim().toLowerCase()),'Duplicate Chemistry front '+c.front);fronts.add(c.front.trim().toLowerCase());
 assert.equal(c.subject,'Chemistry');assert.equal(c.stage,'AS');assert.equal(c.topic,'Bonding');assert(refs.has(c.specRef));
 assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.scope,'mock');assert.equal(c.active,true);assert.equal(c.strictRecall,true);
 assert.equal(c.accept.length,2);assert.equal(c.reject.length,2);assert(c.accept.includes(c.back));
 for(const answer of c.accept){assert.equal(evaluate(c,answer).status,'correct','Valid '+c.id+' '+answer);accept++;}
 for(const answer of c.reject){assert.equal(evaluate(c,answer).status,'wrong','Invalid '+c.id+' '+answer);reject++;}
}
assert.equal(accept,40);assert.equal(reject,40);
const ls=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),le=app.indexOf(' const added=[',ls);
assert(ls>=0&&le>ls&&app.slice(ls,le).includes('else if(index===49)'));
const load=new Function('cards','extraFlashBanks',app.slice(ls,le)+'\nreturn cards;');
const good=Array.from({length:50},()=>({cards:[]}));good[49]=cards;
assert.equal(load([...core.cards],good).length,3365);
const bad=Array.from({length:50},()=>({cards:[]}));
bad[49]={cards:cards.cards.slice(0,7).map((c,i)=>({...c,...[{subject:'Physics'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'},{active:false},{specRef:'3.2.4'}][i]}))};
assert.equal(load([...core.cards],bad).length,3345);
const oldQ=new Set([...j('exam_questions.json').questions,...qUrls.slice(0,39).flatMap(p=>j(p).questions||[])].map(q=>q.id));
let marks=0;const qids=new Set();
for(const q of bank.questions){
 assert(!oldQ.has(q.id));assert(!qids.has(q.id));qids.add(q.id);
 assert.equal(q.subject,'Chemistry');assert.equal(q.level,'AS');assert.equal(q.topic,'Bonding');assert(refs.has(q.specRef));
 assert.equal(q.mock,true);assert.equal(q.taught,true);assert.equal(q.standalone,true);
 assert.equal(q.manualDiagramReview,true);assert.equal(q.requiresWorking,true);
 assert.equal(q.sourceVerified,false);assert.equal(q.verificationLevel,'original-exam-style');
 assert.equal(q.markPoints.length,q.marks);assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 assert(q.modelAnswer.length>150);assert(q.prompt.includes('['+q.marks+' marks]'));marks+=q.marks;
}
assert.equal(marks,26);
const x=app.indexOf('function examSuggested(q,answer){'),y=app.indexOf(' // v213:',x);
assert(x>0&&y>x);const suggest=new Function('window',app.slice(x,y)+'\n}\nreturn examSuggested;')({});
for(const q of bank.questions){const result=suggest(q,'all labelled metal ions delocalised electrons donor arrow graphite layers words no drawing');
 assert.equal(result.manualRequired,true);assert.equal(result.suggested,0);
 assert.deepEqual(result.preds,Array(q.marks).fill(false));
}
assert.equal(audit.version,'v277');assert.equal(audit.selectedRequirementCount,17);
assert.equal(audit.selectedRequirements.length,17);assert.equal(audit.allSevenNumberedSectionsRepresented,true);
const allRef=new Set(audit.selectedRequirements.map(r=>r.specRef));
assert.deepEqual([...allRef].sort(),['3.1.3.1','3.1.3.2','3.1.3.3','3.1.3.4','3.1.3.5','3.1.3.6','3.1.3.7']);
const allItems=new Map([...prior,...cards.cards,...j('exam_questions.json').questions,...qUrls.flatMap(p=>j(p).questions||[])].map(x=>[x.id,x]));
for(const row of audit.selectedRequirements){
 assert(row.evidenceIds.length>0,row.id);for(const id of row.evidenceIds){
 assert(allItems.has(id),'Non-existent evidence '+id);
 assert.equal(allItems.get(id).specRef,row.specRef,'Wrong spec ref '+id);
 }
}
for(const [k,v] of Object.entries(audit.completion))if(k!=='allSevenNumberedBondingSubsectionsHaveSelectedEvidence')assert.equal(v,false,'Not independently certified: '+k);
assert.equal(audit.completion.allSevenNumberedBondingSubsectionsHaveSelectedEvidence,true);
assert.equal(2*3+3*(-2),0); // aluminium sulfate charge neutral
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v277: 20 concise Bonding cards 40 valid/40 rejected variants, four manual drawings with 26 marks, 17 selected requirements map to real matched-spec evidence, all full-certification gates remain open.');
