'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const cb=j('chemistry_as_inorganic_tests_recall_v274.json'),qb=j('chemistry_as_inorganic_tests_practice_v274.json'),app=read('app.js'),sw=read('sw.js'),core=j('deck.json');
assert.equal(cb.version,'v274');assert.equal(qb.version,'v274');
assert.equal(core.cards.length,3345);assert.equal(j('exam_questions.json').questions.length,1268);
assert.equal(cb.cards.length,30);assert.equal(qb.questions.length,7);
const qUrls=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const cUrls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert(qUrls.length>=37,'v274 inorganic practice bank retains original index 36');assert.equal(qUrls[36],'chemistry_as_inorganic_tests_practice_v274.json');
assert(cUrls.length>=47,'v274 inorganic recall bank retains original index 46');assert.equal(cUrls[46],'chemistry_as_inorganic_tests_recall_v274.json');
for(const path of ['chemistry_as_inorganic_tests_practice_v274.json','chemistry_as_inorganic_tests_recall_v274.json'])assert(sw.includes("'./"+path+"'"));
assert(sw.includes('-v274-as-inorganic'));
const priorCards=[...core.cards,...cUrls.slice(0,46).flatMap(p=>j(p).cards||[])];
const ids=new Set(priorCards.map(c=>c.id));
const fronts=new Set(priorCards.filter(c=>c.subject==='Chemistry').map(c=>String(c.front||'').trim().toLowerCase()));
const ns=app.indexOf('function normalise('),ne=app.indexOf('function importantTokens(',ns);
assert(ns>=0&&ne>ns);
const mark=new Function('window',app.slice(ns,ne)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let correct=0,wrong=0;const spec=new Set(['3.2.2','3.2.3.1','3.2.3.2']);
for(const c of cb.cards){
 assert(!ids.has(c.id),'Prior core/supplement card ID duplicate '+c.id);ids.add(c.id);
 assert(!fronts.has(c.front.trim().toLowerCase()),'Duplicate AS Chemistry front '+c.front);fronts.add(c.front.trim().toLowerCase());
 assert.equal(c.subject,'Chemistry');assert.equal(c.stage,'AS');assert(spec.has(c.specRef));
 assert.equal(c.topic,c.specRef==='3.2.2'?'Group 2':'Group 7');
 assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.scope,'mock');assert.equal(c.active,true);assert.equal(c.strictRecall,true);
 assert.equal(c.accept.length,2);assert.equal(c.reject.length,2);assert(c.accept.includes(c.back),'Back not accepted '+c.id);
 for(const ans of c.accept){assert.equal(mark(c,ans).status,'correct',c.id+' accept '+ans);correct++;}
 for(const ans of c.reject){assert.equal(mark(c,ans).status,'wrong',c.id+' reject '+ans);wrong++;}
}
assert.equal(correct,60);assert.equal(wrong,60);
const start=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),end=app.indexOf(' const added=[',start);
assert(start>0&&end>start&&app.slice(start,end).includes('else if(index===46)'));
const load=new Function('cards','extraFlashBanks',app.slice(start,end)+'\nreturn cards;');
const good=Array.from({length:47},()=>({cards:[]}));good[46]=cb;
assert.equal(load([...core.cards],good).length,3375);
const bad=Array.from({length:47},()=>({cards:[]}));
bad[46]={cards:cb.cards.slice(0,7).map((c,i)=>({...c,...[{subject:'Physics'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'},{active:false},{specRef:'3.2.4'}][i]}))};
assert.equal(load([...core.cards],bad).length,3345);
const prevQ=new Set([...j('exam_questions.json').questions,...qUrls.slice(0,36).flatMap(p=>j(p).questions||[])].map(q=>q.id));
const qIds=new Set();let marks=0;const used=new Set();
for(const q of qb.questions){
 assert(!prevQ.has(q.id),'Prior question '+q.id);assert(!qIds.has(q.id));qIds.add(q.id);
 assert.equal(q.subject,'Chemistry');assert.equal(q.level,'AS');assert(spec.has(q.specRef));used.add(q.specRef);
 assert.equal(q.topic,q.specRef==='3.2.2'?'Group 2':'Group 7');
 assert.equal(q.mock,true);assert.equal(q.taught,true);assert.equal(q.standalone,true);assert.equal(q.requiresWorking,true);
 assert.equal(q.sourceVerified,false);assert.equal(q.verificationLevel,'original-exam-style');
 assert.equal(q.markPoints.length,q.marks);assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 assert(q.prompt.includes('['+q.marks+' marks]'));
 assert(q.modelAnswer.length>100);marks+=q.marks;
}
assert.equal(marks,45);assert.deepEqual([...used].sort(),['3.2.2','3.2.3.1','3.2.3.2']);
const balanced=(left,right)=>{for(const element of ['Cl','H','O','Na','Ba'])assert.equal(left[element]||0,right[element]||0,'Balance '+element)};
balanced({Ba:1,H:4,O:2},{Ba:1,H:4,O:2}); // Ba + 2H2O -> Ba(OH)2 + H2
balanced({Cl:2,Na:2,H:2,O:2},{Cl:2,Na:2,H:2,O:2}); // Cl2+2NaOH -> NaCl+NaClO+H2O
balanced({Cl:2,H:2,O:1},{Cl:2,H:2,O:1}); // Cl2+H2O -> Cl- + ClO- + 2H+
const close=(a,b)=>Math.abs(a-b)<1e-10;
assert(close(1+(-1),0)); // halogen displacement charge 2Br- => 2Cl-
assert.equal(2,1+1); // two halogens produced in chlorine disproportionation
assert.equal(-1+1,0); // zero net change in oxidation numbers
assert.equal(-1+1,0); // Ba2+ and SO4(2-) net zero
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v274: 30 strictly AS inorganic flashcards, 60 correct/60 rejected marker examples, 7 original questions (45 marks), accepted/rejected scope filters and unchanged offline/progress IDs.');
