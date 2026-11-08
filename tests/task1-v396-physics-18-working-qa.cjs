'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),deck=json('deck.json'),exam=json('exam_questions.json');
const audit=json('editorial/task1-v396-physics-18-working-qa.json');
assert.equal(deck.cards.length,3345);
assert.equal(new Set(deck.cards.map(c=>c.id)).size,3345);
assert.equal(exam.questions.length,1268);
assert.equal(audit.rows.length,18);
assert.equal(audit.counts.marks,93);
assert(sw.includes('-v396-physics93-working'));
assert(app.includes('applyV396PhysicsOriginal18Manual(examQuestions);'));
const hash=s=>{let h=2166136261;const v=String(s||'');for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16)};
const start=app.indexOf('const V396_PHYSICS_ORIGINAL_18='),end=app.indexOf('// v395: 13 source-locked Chemistry AS exam questions',start);
assert(start>=0&&end>start);
const {rows,apply}=new Function(app.slice(start,end)+'\nreturn {rows:V396_PHYSICS_ORIGINAL_18,apply:applyV396PhysicsOriginal18Manual};')();
assert.deepEqual(rows,audit.rows);
const originals=rows.map(r=>{
 const q=exam.questions.find(x=>x.id===r.id);
 assert(q,'Missing '+r.id);
 assert.equal(q.subject,'Physics');
 assert.equal(q.level,'AS');
 assert.equal(q.mock,true);
 assert.equal(q.standalone,true);
 assert.equal(q.requiresWorking,true);
 assert.notEqual(q.taught,false);
 assert.notEqual(q.manualWorkingReview,true);
 assert.notEqual(q.manualDiagramReview,true);
 assert.equal(q.topic,r.topic);
 assert.equal(q.courseTopic??null,r.courseTopic);
 assert.equal(q.specRef??null,r.specRef);
 assert.equal(q.questionType??null,r.questionType);
 assert.equal(q.marks,r.marks);
 assert.equal(q.markPoints.length,r.marks);
 assert.equal(q.markPointMarks.reduce((s,n)=>s+n,0),r.marks);
 assert.equal(hash(q.prompt),r.promptHash);
 assert.equal(hash(q.modelAnswer),r.answerHash);
 assert.equal(hash(JSON.stringify(q.markPoints)),r.pointsHash);
 assert.equal(hash(JSON.stringify(q.markPointMarks)),r.pointMarksHash);
 return q;
});
assert.equal(originals.reduce((s,q)=>s+q.marks,0),93);
const snapshot=JSON.stringify(originals);
const patched=originals.map(q=>({...q,markPoints:[...q.markPoints],markPointMarks:[...q.markPointMarks]}));
apply(patched);
assert.equal(JSON.stringify(originals),snapshot,'Source bank mutated');
assert.equal(patched.filter(q=>q.v396ReviewRequired===true).length,18);
const es=app.indexOf('function examSuggested(q,answer){'),ee=app.indexOf(' // v213:',es);
assert(es>=0&&ee>es);
const suggested=new Function('window',app.slice(es,ee)+'\n}\nreturn examSuggested;')({});
const hs=app.indexOf('function manualExamHelpText(q){'),he=app.indexOf('function beginManualExamReview(q){',hs);
assert(hs>=0&&he>hs);
const helper=new Function(app.slice(hs,he)+'\nreturn {help:manualExamHelpText,button:manualExamButtonText};')();
const ms=app.indexOf('function mockEligibleQuestion(q){'),me=app.indexOf('function startMockSession(){',ms);
assert(ms>=0&&me>ms);
const eligible=new Function(app.slice(ms,me)+'\nreturn mockEligibleQuestion;')();
let probes=0,negative=0;
for(let i=0;i<patched.length;i++){
 const q=patched[i],src=originals[i];
 assert(eligible(q),'Original mock excluded '+q.id);
 assert.match(helper.help(q),/multi-step science question/);
 assert.equal(helper.button(q),'Review science working point by point');
 for(const answer of ['',q.modelAnswer,'I copied the method', 'all steps correct','the answer is not '+q.modelAnswer]){
  const result=suggested(q,answer);
  assert.equal(result.manualRequired,true);
  assert.equal(result.suggested,0);
  assert.equal(result.finalCorrect,false);
  assert.deepEqual(result.preds,Array(q.marks).fill(false));
  assert.deepEqual(result.scores,Array(q.marks).fill(0));probes++;
 }
 const changes=[
  {id:'other'}, {subject:'Chemistry'}, {level:'A-level'}, {mock:false}, {taught:false},
  {standalone:false},{requiresWorking:false},{manualWorkingReview:true},{manualDiagramReview:true},
  {topic:'Other'}, {courseTopic:'Other'}, {specRef:'3.1.999'}, {questionType:'Other'},
  {marks:q.marks+1}, {prompt:q.prompt+' changed'}, {modelAnswer:q.modelAnswer+' changed'},
  {markPoints:[...q.markPoints.slice(0,-1),'changed']},
  {markPointMarks:[...q.markPointMarks.slice(0,-1),2]}
 ];
 for(const mutation of changes){
  const bad={...src,...mutation};
  apply([bad]);
  assert.notEqual(bad.v396ReviewRequired,true,'Unsafe source '+q.id+' '+JSON.stringify(mutation));
  negative++;
 }
}
assert.equal(probes,90);
assert.equal(negative,324);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
const near=(actual,expected,tol=1e-8)=>assert(Math.abs(actual-expected)<=tol,actual+' differs from '+expected);
near(3e8/1.33,2.25563909774436e8,3);
near((19-4)/(6-1),3);
near((60-18)/12,3.5);
near(2.5*(9.81+1.2),27.525);
near(9-2*1,7);
near(3*4-2*5,2);
near((.3*4)/(.3+.5),1.5);
near(.5*.3*4**2-.5*.8*1.5**2,1.5);
near((.8*9.8-3)/.8,6.05);
near(100/2e-6/(.001/1),5e10,1);
near((10+30)*4/2+30*2,140);
near(4.5/5.1,0.8823529411764706);
near(1.5/6.3,0.23809523809523808);
near(3/7.2,0.4166666666666667);
near(12*(2/6),4);
near(12*(1/5),2.4);
near(Math.PI*(.000320)**2/4*4.8/1.25,3.088614958611155e-7,1e-10);
near((.1/4.8+.01/1.25+2*.01/.320)*100,9.133333333333333,1e-6);
near((1.28+1.32+1.35+1.31+1.34)/5,1.32);
near(Math.max(2.65-2.4,2.4-2.10)/2.4*100,12.5,1e-8);
console.log('PASS v396: 18 source-locked AS Physics worked questions, 93 manual marks, 90 zero-credit probes, 324 source-guard mutations and independent calculations; 3345 core flashcards and saved keys intact.');
