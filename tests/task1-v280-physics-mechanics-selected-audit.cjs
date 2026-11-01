'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),cards=j('physics_mechanics_signed_area_couples_recall_v280.json'),bank=j('physics_mechanics_signed_area_couples_practice_v280.json'),audit=j('editorial/task1-v280-physics-mechanics-selected-crosswalk.json'),core=j('deck.json');
assert.equal(cards.version,'v280');assert.equal(bank.version,'v280');
assert.equal(cards.cards.length,16);assert.equal(bank.questions.length,4);
assert.equal(core.cards.length,3345);assert.equal(j('exam_questions.json').questions.length,1268);
const qUrls=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const cUrls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert(qUrls.length>=43,'v280 practice remains at index 42 after append-only future practice');assert.equal(qUrls[42],'physics_mechanics_signed_area_couples_practice_v280.json');
assert.equal(cUrls.length,53);assert.equal(cUrls[52],'physics_mechanics_signed_area_couples_recall_v280.json');
for(const x of ['physics_mechanics_signed_area_couples_practice_v280.json','physics_mechanics_signed_area_couples_recall_v280.json'])assert(sw.includes("'./"+x+"'"));
assert(sw.includes('-v280-mechanics-materials'));
const prior=[...core.cards,...cUrls.slice(0,52).flatMap(p=>j(p).cards||[])];
const ids=new Set(prior.map(c=>c.id)),fronts=new Set(prior.filter(c=>c.subject==='Physics').map(c=>String(c.front||'').trim().toLowerCase()));
const nStart=app.indexOf('function normalise('),nEnd=app.indexOf('function importantTokens(',nStart);assert(nStart>=0&&nEnd>nStart);
const judge=new Function('window',app.slice(nStart,nEnd)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const allowed=new Set(['3.4.1.1','3.4.1.2','3.4.1.3','3.4.1.6','3.4.1.7','3.4.2.1','3.4.2.2']);
let correct=0,wrong=0;
for(const c of cards.cards){
 assert(!ids.has(c.id),'Duplicate '+c.id);ids.add(c.id);
 assert(!fronts.has(c.front.trim().toLowerCase()),'Duplicate front '+c.front);fronts.add(c.front.trim().toLowerCase());
 assert.equal(c.subject,'Physics');assert.equal(c.stage,'AS');assert.equal(c.courseTopic,'Mechanics and materials');assert(allowed.has(c.specRef));
 assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.scope,'mock');assert.equal(c.active,true);assert.equal(c.strictRecall,true);
 assert.equal(c.accept.length,2);assert.equal(c.reject.length,2);assert(c.accept.includes(c.back));
 for(const answer of c.accept){assert.equal(judge(c,answer).status,'correct','Valid '+c.id+' '+answer);correct++;}
 for(const answer of c.reject){assert.equal(judge(c,answer).status,'wrong','Invalid '+c.id+' '+answer);wrong++;}
}
assert.equal(correct,32);assert.equal(wrong,32);
const ls=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),le=app.indexOf(' const added=[',ls);assert(ls>0&&le>ls&&app.slice(ls,le).includes('else if(index===52)'));
const load=new Function('cards','extraFlashBanks',app.slice(ls,le)+'\nreturn cards;');
const valid=Array.from({length:53},()=>({cards:[]}));valid[52]=cards;
assert.equal(load([...core.cards],valid).length,3361);
const invalid=Array.from({length:53},()=>({cards:[]}));
invalid[52]={cards:cards.cards.slice(0,7).map((c,i)=>({...c,...[{subject:'Maths'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'},{active:false},{specRef:'3.6.1'}][i]}))};
assert.equal(load([...core.cards],invalid).length,3345);
const oldQ=new Set([...j('exam_questions.json').questions,...qUrls.slice(0,42).flatMap(p=>j(p).questions||[])].map(q=>q.id));
let marks=0,manual=0;const newIds=new Set();
for(const q of bank.questions){
 assert(!oldQ.has(q.id),'Existing question '+q.id);assert(!newIds.has(q.id));newIds.add(q.id);
 assert.equal(q.subject,'Physics');assert.equal(q.level,'AS');assert.equal(q.topic,'Mechanics and materials');
 assert(['3.4.1.2','3.4.1.3','3.4.2.1','3.4.2.2'].includes(q.specRef));
 assert.equal(q.mock,true);assert.equal(q.taught,true);assert.equal(q.standalone,true);assert.equal(q.requiresWorking,true);
 assert.equal(q.sourceVerified,false);assert.equal(q.verificationLevel,'original-exam-style');
 assert.equal(q.markPoints.length,q.marks);assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 assert(q.prompt.includes('['+q.marks+' marks]'));assert(q.modelAnswer.length>150);
 if(q.manualDiagramReview)manual++;marks+=q.marks;
}
assert.equal(marks,32);assert.equal(manual,2);
const es=app.indexOf('function examSuggested(q,answer){'),ee=app.indexOf(' // v213:',es);assert(es>=0&&ee>es);
const suggest=new Function('window',app.slice(es,ee)+'\n}\nreturn examSuggested;')({});
for(const q of bank.questions.filter(q=>q.manualDiagramReview)){
 const s=suggest(q,'correct graph and stress strain description typed but no actual drawing');
 assert.equal(s.manualRequired,true);assert.equal(s.suggested,0);
 assert.deepEqual(s.preds,Array(q.marks).fill(false));
}
const near=(a,b,t=1e-9)=>Math.abs(a-b)<t;
const weight=12*9.8,P=(50*1.5-weight*.5-8)/2.5;
assert(near(weight,117.6));assert(near(P,3.28));assert(near(50+weight+P,170.88));
const a1=(6-0)/3,a2=(-2-6)/(5-3),zero=3+6/Math.abs(a2);
assert(near(a1,2));assert(near(a2,-4));assert(near(zero,4.5));
const firstArea=.5*3*6,secondSigned=(6-2)/2*2,positiveArea=.5*(zero-3)*6,negativeMagnitude=.5*(5-zero)*2;
assert(near(firstArea,9));assert(near(secondSigned,4));assert(near(positiveArea,4.5));assert(near(negativeMagnitude,.5));
assert(near(firstArea+secondSigned,13));assert(near(firstArea+positiveArea+negativeMagnitude,14));
const d=.300/1000,ext=1.20/1000,A=Math.PI*d*d/4,E=12*1.5/(A*ext);
assert(near(A,7.068583470577035e-8,1e-15));
assert(near(E/1e11,2.122065907891938,.00001));
const areaPercent=2*(.010/.300)*100,extPercent=(.02/1.20)*100;
assert(near(areaPercent,6.666666666666667));assert(near(extPercent,1.6666666666666667));assert(near(areaPercent+extPercent,8.333333333333334));
assert.equal(audit.selectedRequirementCount,25);assert.equal(audit.selectedRequirements.length,25);
const map=new Map([...core.cards,...cUrls.flatMap(p=>j(p).cards||[]),...j('exam_questions.json').questions,...qUrls.flatMap(p=>j(p).questions||[])].map(x=>[x.id,x]));
const srefs=new Set();
for(const row of audit.selectedRequirements){assert(row.evidenceIds.length>0);srefs.add(row.specRef);
 for(const id of row.evidenceIds){assert(map.has(id),'Missing evidence '+id);assert.equal(map.get(id).specRef,row.specRef,'Wrong subsection '+id);}
}
assert.deepEqual([...srefs].sort(),['3.4.1.1','3.4.1.2','3.4.1.3','3.4.1.4','3.4.1.5','3.4.1.6','3.4.1.7','3.4.1.8','3.4.2.1','3.4.2.2']);
assert.equal(audit.completion.allTenMechanicsMaterialsNumberedSubsectionsHaveSelectedEvidence,true);
for(const [k,v] of Object.entries(audit.completion))if(k!=='allTenMechanicsMaterialsNumberedSubsectionsHaveSelectedEvidence')assert.equal(v,false,'Uncertified '+k);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v280: 16 AS Mechanics recall cards (32 correct/32 incorrect), four original problems (32 marks), two manual graphs, independent beam/kinematics/Young modulus calculations and 25 mapped references.');
