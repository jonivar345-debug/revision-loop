'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const cards=j('physics_refraction_fibres_recall_v275.json'),bank=j('physics_refraction_fibres_practice_v275.json'),core=j('deck.json');
const app=read('app.js'),sw=read('sw.js');
assert.equal(cards.version,'v275');assert.equal(bank.version,'v275');
assert.equal(core.cards.length,3345);assert.equal(j('exam_questions.json').questions.length,1268);
assert.equal(cards.cards.length,20);assert.equal(bank.questions.length,6);
const qUrls=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const cUrls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert(qUrls.length>=38,'v275 optical-fibre practice remains at index 37 after append-only newer banks');assert.equal(qUrls[37],'physics_refraction_fibres_practice_v275.json');
assert(cUrls.length>=48,'v275 optical-fibre recall remains at index 47 after append-only newer banks');assert.equal(cUrls[47],'physics_refraction_fibres_recall_v275.json');
for(const p of ['physics_refraction_fibres_practice_v275.json','physics_refraction_fibres_recall_v275.json'])assert(sw.includes("'./"+p+"'"));
assert(sw.includes('-v275-optical-fibres'));
const prevCards=[...core.cards,...cUrls.slice(0,47).flatMap(p=>j(p).cards||[])];
const ids=new Set(prevCards.map(x=>x.id)),fronts=new Set(prevCards.filter(x=>x.subject==='Physics').map(x=>String(x.front||'').trim().toLowerCase()));
const ns=app.indexOf('function normalise('),ne=app.indexOf('function importantTokens(',ns);
assert(ns>=0&&ne>ns);
const mark=new Function('window',app.slice(ns,ne)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let right=0,wrong=0;
for(const c of cards.cards){
 assert(!ids.has(c.id),'Duplicate ID '+c.id);ids.add(c.id);
 assert(!fronts.has(c.front.trim().toLowerCase()),'Duplicate Physics card '+c.front);fronts.add(c.front.trim().toLowerCase());
 assert.equal(c.subject,'Physics');assert.equal(c.stage,'AS');assert.equal(c.topic,'Waves');assert.equal(c.specRef,'3.3.2.3');
 assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.scope,'mock');assert.equal(c.active,true);assert.equal(c.strictRecall,true);
 assert.equal(c.accept.length,2);assert.equal(c.reject.length,2);assert(c.accept.includes(c.back));
 for(const v of c.accept){assert.equal(mark(c,v).status,'correct','Accepted '+c.id+' '+v);right++;}
 for(const v of c.reject){assert.equal(mark(c,v).status,'wrong','Rejected '+c.id+' '+v);wrong++;}
}
assert.equal(right,40);assert.equal(wrong,40);
const start=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),end=app.indexOf(' const added=[',start);
assert(start>0&&end>start&&app.slice(start,end).includes('else if(index===47)'));
const load=new Function('cards','extraFlashBanks',app.slice(start,end)+'\nreturn cards;');
const good=Array.from({length:48},()=>({cards:[]}));good[47]=cards;
assert.equal(load([...core.cards],good).length,3365);
const wrongBanks=Array.from({length:48},()=>({cards:[]}));
wrongBanks[47]={cards:cards.cards.slice(0,7).map((c,i)=>({...c,...[{subject:'Maths'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'},{active:false},{specRef:'3.6.2'}][i]}))};
assert.equal(load([...core.cards],wrongBanks).length,3345);
const priorQuestions=new Set([...j('exam_questions.json').questions,...qUrls.slice(0,37).flatMap(p=>j(p).questions||[])].map(x=>x.id));
let marks=0,drawings=0;const qids=new Set();
for(const q of bank.questions){
 assert(!priorQuestions.has(q.id),'Question ID already used '+q.id);
 assert(!qids.has(q.id));qids.add(q.id);
 assert.equal(q.subject,'Physics');assert.equal(q.level,'AS');assert.equal(q.specRef,'3.3.2.3');
 assert.equal(q.topic,'Waves');assert.equal(q.mock,true);assert.equal(q.taught,true);assert.equal(q.standalone,true);
 assert.equal(q.sourceVerified,false);assert.equal(q.verificationLevel,'original-exam-style');
 assert.equal(q.requiresWorking,true);assert.equal(q.markPoints.length,q.marks);assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 assert(q.modelAnswer.length>140);assert(q.prompt.includes('['+q.marks+' marks]'));
 marks+=q.marks;if(q.manualDiagramReview)drawings++;
}
assert.equal(marks,37);assert.equal(drawings,1);
const a=app.indexOf('function examSuggested(q,answer){'),b=app.indexOf(' // v213:',a);
assert(a>=0&&b>a);
const suggestion=new Function('window',app.slice(a,b)+'\n}\nreturn examSuggested;')({});
for(const q of bank.questions.filter(q=>q.manualDiagramReview)){
 const s=suggestion(q,'correct labels core cladding normal incident reflected words only');
 assert.equal(s.manualRequired,true);assert.equal(s.suggested,0);
 assert.deepEqual(s.preds,Array(q.marks).fill(false));
}
const close=(x,y,t=.005)=>Math.abs(x-y)<=t;
const crit=(nCore,nClad)=>Math.asin(nClad/nCore)*180/Math.PI;
assert(close(crit(1.5,1.47),78.521659,.0001));
assert(80>crit(1.5,1.47));
assert(close(Math.asin(Math.sin(30*Math.PI/180)/1.5)*180/Math.PI,19.471221,.0001));
assert.equal(3e8/1.5,2e8);
const blue=1200*1.467/3e8,red=1200*1.459/3e8;
assert(close(blue,5.868e-6,1e-12));assert(close(red,5.836e-6,1e-12));
assert(close(blue-red,3.2e-8,1e-12));assert(blue>red);
assert(close(crit(1.51,1.48),78.559857,.0001));assert(82>crit(1.51,1.48));
assert(close(crit(1.5,1.45),75.164888,.0001));assert(close(crit(1.5,1.49),83.380372,.0001));
assert(80>crit(1.5,1.45));assert(80<crit(1.5,1.49));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v275: 20 AS refraction/fibre cards, 40 accepted/40 rejected variants, 6 original questions (37 marks), exact angle/dispersion calculations and no auto-credit for ray drawing; original progress preserved.');
