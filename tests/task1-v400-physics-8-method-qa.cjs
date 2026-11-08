'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),deck=json('deck.json'),exam=json('exam_questions.json'),corr=json('exam_answer_corrections.json');
const audit=json('editorial/task1-v400-physics-8-method-qa.json');
assert.equal(deck.cards.length,3345);assert.equal(new Set(deck.cards.map(c=>c.id)).size,3345);
assert.equal(exam.questions.length,1268);assert.equal(new Set(exam.questions.map(q=>q.id)).size,1268);
assert.equal(audit.rows.length,8);assert.equal(audit.counts.protectedMarks,24);
assert(sw.includes('-v400-phy24-manual'));
assert(app.includes('applyV400Physics8MethodManual(examQuestions);'));
const hash=s=>{let h=2166136261;const v=String(s||'');for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16)};
const start=app.indexOf('const V400_PHYSICS_8_MANUAL='),end=app.indexOf('// v396: 18 exact, already-existing AS Physics worked exam questions',start);
assert(start>0&&end>start);
const {rows,patch}=new Function(app.slice(start,end)+'\nreturn {rows:V400_PHYSICS_8_MANUAL,patch:applyV400Physics8MethodManual};')();
assert.deepEqual(rows,audit.rows);
const src=rows.map(r=>{
 const q=exam.questions.find(q=>q.id===r.id);assert(q,'Missing '+r.id);
 assert.equal(q.subject,'Physics');assert.equal(q.level,'AS');assert.equal(q.mock,true);assert.equal(q.standalone,true);
 assert.notEqual(q.taught,false);assert.notEqual(q.requiresWorking,true);assert.notEqual(q.manualWorkingReview,true);assert.notEqual(q.manualDiagramReview,true);
 for(const key of ['topic','subtopic','courseTopic','specRef','questionType','requiresWorking'])assert.equal(q[key]??null,r[key]??null);
 assert.equal(q.marks,3);assert.equal(q.markPoints.length,3);assert.equal(q.markPointMarks.reduce((a,b)=>a+b,0),3);
 assert.equal(hash(q.prompt),r.promptHash);assert.equal(hash(q.modelAnswer),r.answerHash);
 assert.equal(hash(JSON.stringify(q.markPoints)),r.pointsHash);assert.equal(hash(JSON.stringify(q.markPointMarks)),r.weightsHash);
 assert(!corr.modelAnswers?.[q.id]&&!corr.questionCorrections?.[q.id]);
 return q;
});
const original=JSON.stringify(src),patched=src.map(q=>({...q,markPoints:[...q.markPoints],markPointMarks:[...q.markPointMarks]}));
patch(patched);
assert.equal(JSON.stringify(src),original);
assert.equal(patched.filter(q=>q.v400ReviewRequired===true).length,8);
const es=app.indexOf('function examSuggested(q,answer){'),ee=app.indexOf(' // v213:',es);
assert(es>0&&ee>es);
const suggested=new Function('window',app.slice(es,ee)+'\n}\nreturn examSuggested;')({});
const hs=app.indexOf('function manualExamHelpText(q){'),he=app.indexOf('function beginManualExamReview(q){',hs);
assert(hs>0&&he>hs);
const help=new Function(app.slice(hs,he)+'\nreturn {info:manualExamHelpText,button:manualExamButtonText};')();
const ms=app.indexOf('function mockEligibleQuestion(q){'),me=app.indexOf('function startMockSession(){',ms);
assert(ms>0&&me>ms);
const mock=new Function(app.slice(ms,me)+'\nreturn mockEligibleQuestion;')();
let probes=0,mutations=0;
for(let i=0;i<src.length;i++){
 const q=patched[i],originalQuestion=src[i];
 assert(mock(q));assert.match(help.info(q),/multi-step science question/);
 assert.equal(help.button(q),'Review science working point by point');
 for(const answer of ['',q.modelAnswer,'I copied the model answer','all marks please','2.1 × 10^5 J']){
  const r=suggested(q,answer);assert.equal(r.manualRequired,true);assert.equal(r.suggested,0);
  assert.equal(r.finalCorrect,false);assert.deepEqual(r.preds,[false,false,false]);assert.deepEqual(r.scores,[0,0,0]);probes++;
 }
 for(const changes of [
  {id:'other'},{subject:'Chemistry'},{level:'A-level'},{mock:false},{taught:false},{standalone:false},
  {requiresWorking:true},{manualWorkingReview:true},{manualDiagramReview:true},
  {topic:'changed'},{subtopic:'changed'},{courseTopic:'changed'},{specRef:'changed'},
  {questionType:'changed'},{marks:4},{prompt:q.prompt+' changed'},{modelAnswer:q.modelAnswer+' changed'},
  {markPoints:[...q.markPoints.slice(0,-1),'changed']},{markPointMarks:[1,1,2]}
 ]){
  const bad={...originalQuestion,...changes};patch([bad]);
  assert.notEqual(bad.v400ReviewRequired,true,'False original match '+q.id+' '+JSON.stringify(changes));mutations++;
 }
}
assert.equal(probes,40);assert.equal(mutations,152);
const near=(a,b,tol=1e-9)=>assert(Math.abs(a-b)<tol);
near(7.4*2*(240*60),213120);near(12*4/(2+4),8);near(9*3/(6+3),3);
const slope=(1.10-1.40)/(1.50-.50);near(slope,-.30);near(1.40-slope*.50,1.55);
near(Math.asin(500e-9/2e-6)*180/Math.PI,14.477512185929925,1e-7);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
assert(app.includes('applyV399MathsOriginal15Manual(examQuestions);'));
console.log('PASS v400: 8 original Physics practical/worked questions (24 marks), 40 zero-auto-credit probes, 152 mutated-source exclusions, independent Physics arithmetic and unchanged source IDs.');
