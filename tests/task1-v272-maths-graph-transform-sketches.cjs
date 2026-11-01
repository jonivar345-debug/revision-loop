'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const qbank=j('maths_as_graph_transform_sketches_v272.json'),cbank=j('maths_as_graph_transform_recall_v272.json'),deck=j('deck.json');
const app=read('app.js'),sw=read('sw.js');
assert.equal(qbank.version,'v272');assert.equal(qbank.questions.length,6);
assert.equal(cbank.version,'v272');assert.equal(cbank.cards.length,16);
assert.equal(deck.cards.length,3345);
const practice=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const flash=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert(practice.length>=35,'v272 transformations source remains at its original append-only index');assert.equal(practice[34],'maths_as_graph_transform_sketches_v272.json');
assert.equal(flash.length,46);assert.equal(flash[45],'maths_as_graph_transform_recall_v272.json');
for(const p of ['maths_as_graph_transform_sketches_v272.json','maths_as_graph_transform_recall_v272.json'])assert(sw.includes("'./"+p+"'"));
assert(sw.includes('-v272-graph-sketch'));
const priorQ=new Set([...j('exam_questions.json').questions,...practice.slice(0,34).flatMap(p=>j(p).questions||[])].map(q=>q.id));
let marks=0,manual=0;const ids=new Set();
for(const q of qbank.questions){
 assert(!priorQ.has(q.id),'Old question reused: '+q.id);assert(!ids.has(q.id));ids.add(q.id);
 assert.equal(q.subject,'Maths');assert.equal(q.level,'AS');assert.equal(q.specRef,'3.3');
 assert.equal(q.courseTopic,'Year 1 Pure');assert.equal(q.revisionTopic,'Year 1 Pure');
 assert.equal(q.taught,true);assert.equal(q.mock,true);assert.equal(q.standalone,true);
 assert.equal(q.manualDiagramReview,true);assert.equal(q.sourceVerified,false);assert.equal(q.verificationLevel,'original-exam-style');
 assert.equal(q.requiresWorking,true);assert.equal(q.markPoints.length,q.marks);assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 assert(q.prompt.includes('['+q.marks+' marks]'));assert(q.modelAnswer.length>140);
 marks+=q.marks;manual++;
}
assert.equal(marks,36);assert.equal(manual,6);
const a=app.indexOf('function examSuggested(q,answer){'),b=app.indexOf(' // v213:',a);
assert(a>=0&&b>a);const suggest=new Function('window',app.slice(a,b)+'\n}\nreturn examSuggested;')({});
for(const q of qbank.questions){const s=suggest(q,'all coordinates and sketch correctly described in text but no actual sketch');
 assert.equal(s.manualRequired,true);assert.equal(s.suggested,0);
 assert.deepEqual(s.preds,Array(q.marks).fill(false));
 assert.deepEqual(s.scores,Array(q.marks).fill(0));
}
const oldCards=[...deck.cards,...flash.slice(0,45).flatMap(p=>j(p).cards||[])];
const knownIds=new Set(oldCards.map(c=>c.id));
const knownFronts=new Set(oldCards.filter(c=>c.subject==='Maths').map(c=>String(c.front||'').trim().toLowerCase()));
const ns=app.indexOf('function normalise('),ne=app.indexOf('function importantTokens(',ns);
assert(ns>=0&&ne>ns);
const evaluate=new Function('window',app.slice(ns,ne)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let correct=0,wrong=0;
for(const card of cbank.cards){
 assert(!knownIds.has(card.id),'Duplicate card ID '+card.id);knownIds.add(card.id);
 assert(!knownFronts.has(card.front.trim().toLowerCase()),'Duplicate Maths front: '+card.front);knownFronts.add(card.front.trim().toLowerCase());
 assert.equal(card.subject,'Maths');assert.equal(card.stage,'AS');assert.equal(card.courseTopic,'Year 1 Pure');assert.equal(card.specRef,'3.3');
 assert.equal(card.mock,true);assert.equal(card.taught,true);assert.equal(card.scope,'mock');assert.equal(card.active,true);assert.equal(card.strictRecall,true);
 assert.equal(card.accept.length,2);assert.equal(card.reject.length,2);
 assert(card.accept.includes(card.back),'Expected back in accepted variants '+card.id);
 for(const ans of card.accept){assert.equal(evaluate(card,ans).status,'correct','Correct '+card.id+' '+ans);correct++;}
 for(const ans of card.reject){assert.equal(evaluate(card,ans).status,'wrong','Wrong '+card.id+' '+ans);wrong++;}
}
assert.equal(correct,32);assert.equal(wrong,32);
const ls=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),le=app.indexOf(' const added=[',ls);
assert(ls>0&&le>ls&&app.slice(ls,le).includes('else if(index===45)'));
const load=new Function('cards','extraFlashBanks',app.slice(ls,le)+'\nreturn cards;');
const valid=Array.from({length:46},()=>({cards:[]}));valid[45]=cbank;
assert.equal(load([...deck.cards],valid).length,3361);
const invalid=Array.from({length:46},()=>({cards:[]}));invalid[45]={cards:cbank.cards.slice(0,7).map((c,i)=>({...c,...[
 {subject:'Chemistry'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'},{active:false},{specRef:'3.17'}
][i]}))};assert.equal(load([...deck.cards],invalid).length,3345);
const close=(x,y)=>Math.abs(x-y)<1e-9;
const g1=x=>(x-3)**2-2;
assert(close(g1(3),-2));assert(close(g1(1),2));assert(close(g1(5),2));
assert(close(g1(3-Math.sqrt(2)),0));assert(close(g1(3+Math.sqrt(2)),0));assert(close(g1(0),7));
const g2=x=>-8*(x+2)**2+1;
assert(close(g2(-2),1));assert(close(g2(-2.5),-1));assert(close(g2(-1.5),-1));
assert(close(g2(-2-Math.SQRT2/4),0));assert(close(g2(-2+Math.SQRT2/4),0));
const g3=x=>1/(x-2)+3;
assert(close(g3(3),4));assert(close(g3(1),2));assert(close(g3(5/3),0));assert(close(g3(0),2.5));
const h=x=>(x+1)**2-2;
assert(close(h(-1),-2));assert(close(h(0),-1));assert(close(h(-1+Math.SQRT2),0));assert(close(h(-1-Math.SQRT2),0));
const g5=x=>-8*x**3+6*x;
assert(close(g5(.5),2));assert(close(g5(-.5),-2));
for(const x of [-Math.sqrt(3)/2,0,Math.sqrt(3)/2])assert(close(g5(x),0));
const g6=x=>3/(x+1)**2-2;
assert(close(g6(-2),1));assert(close(g6(0),1));
assert(close(g6(-1+Math.sqrt(3/2)),0));assert(close(g6(-1-Math.sqrt(3/2)),0));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v272: six original AS Pure graph sketches, 36 manually judged points, 16 flashcards, 32 valid and 32 invalid answers, 6 independently calculated graph models, strict scope, preserved original IDs/progress.');
