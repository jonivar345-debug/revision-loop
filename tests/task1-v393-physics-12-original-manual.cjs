'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),data=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),deck=data('deck.json');
const audit=data('editorial/task1-v393-physics-12-original-manual-qa.json');
const source=data('exam_questions.json').questions;
assert.equal(deck.cards.length,3345);
assert.equal(new Set(deck.cards.map(c=>c.id)).size,3345);
assert.equal(audit.version,'v393');
assert.equal(audit.rows.length,12);
assert.equal(audit.counts.marksManual,77);
assert(sw.includes('-v393-physics77-manual'));
assert(app.includes('applyV393PhysicsOriginal12Manual(examQuestions);'));
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16)};
const start=app.indexOf('const V393_PHYSICS_ORIGINAL_12='),end=app.indexOf('const V287_LEGACY_SPEC_GROUPS=',start);
assert(start>=0&&end>start);
const {rows,apply}=new Function(app.slice(start,end)+'\nreturn {rows:V393_PHYSICS_ORIGINAL_12,apply:applyV393PhysicsOriginal12Manual};')();
assert.deepEqual(rows,audit.rows);
const originals=audit.rows.map(row=>{
 const q=source.find(q=>q.id===row.id);
 assert(q,'Missing original exam source '+row.id);
 assert.equal(q.subject,'Physics');
 assert.equal(q.level,'AS');
 assert.equal(q.mock,true);
 assert.equal(q.standalone,true);
 assert.equal(q.requiresWorking,true);
 assert.notEqual(q.taught,false);
 assert.notEqual(q.manualDiagramReview,true);
 assert.notEqual(q.manualWorkingReview,true);
 assert.equal(q.topic,row.topic);
 assert.equal(q.courseTopic??null,row.courseTopic);
 assert.equal(q.specRef??null,row.specRef);
 assert.equal(q.marks,row.marks);
 assert.equal(q.markPoints.length,q.marks);
 assert.equal(q.markPointMarks.reduce((s,v)=>s+v,0),q.marks);
 assert.equal(hash(q.prompt),row.promptHash);
 assert.equal(hash(q.modelAnswer),row.modelAnswerHash);
 return q;
});
assert.equal(new Set(originals.map(q=>q.id)).size,12);
const immutableOriginalSnapshot=JSON.stringify(originals);
const patched=originals.map(q=>({...q,markPoints:[...q.markPoints],markPointMarks:[...q.markPointMarks]}));
apply(patched);
assert.equal(JSON.stringify(originals),immutableOriginalSnapshot);
assert.equal(patched.filter(q=>q.v393ReviewRequired).length,12);
assert.equal(patched.reduce((s,q)=>s+(q.manualWorkingReview?q.marks:0),0),77);
const es=app.indexOf('function examSuggested(q,answer){'),ee=app.indexOf(' // v213:',es);
assert(es>=0&&ee>es);
const suggested=new Function('window',app.slice(es,ee)+'\n}\nreturn examSuggested;')({});
const hs=app.indexOf('function manualExamHelpText(q){'),he=app.indexOf('function beginManualExamReview(q){',hs);
assert(hs>=0&&he>hs);
const helper=new Function(app.slice(hs,he)+'\nreturn {help:manualExamHelpText,button:manualExamButtonText};')();
const ms=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),me=app.indexOf('function startMockSession(){',ms);
assert(ms>=0&&me>ms);
const mockEligible=new Function(app.slice(ms,me)+'\nreturn mockEligibleQuestion;')();
let noAuto=0,guardNegative=0;
for(let i=0;i<originals.length;i++){
 const q=patched[i],src=originals[i];
 assert(mockEligible(q),'Excluded original Physics mock application '+q.id);
 assert.match(helper.help(q),/multi-step science question/);
 assert.equal(helper.button(q),'Review science working point by point');
 for(const answer of ['',q.modelAnswer,'I used all the correct formulae','4.0 m/s','give all the marks']){
  const result=suggested(q,answer);
  assert.equal(result.manualRequired,true);
  assert.equal(result.suggested,0);
  assert.equal(result.finalCorrect,false);
  assert.deepEqual(result.preds,Array(q.marks).fill(false));
  assert.deepEqual(result.scores,Array(q.marks).fill(0));
  noAuto++;
 }
 const changes=[
  {id:'not-original'},{subject:'Chemistry'},{level:'A2'},{mock:false},
  {taught:false},{standalone:false},{requiresWorking:false},
  {manualDiagramReview:true},{manualWorkingReview:true},
  {topic:'Other topic'},{courseTopic:'Other course'},{specRef:'3.5.1'},
  {marks:q.marks+1},{prompt:q.prompt+' altered'},
  {modelAnswer:q.modelAnswer+' altered'},{markPoints:[]},
  {markPointMarks:[]}
 ];
 for(const change of changes){
  const fake={...src,...change};apply([fake]);
  assert.notEqual(fake.v393ReviewRequired,true,'Unsafe matching original '+q.id+' '+JSON.stringify(change));
  guardNegative++;
 }
}
assert.equal(noAuto,60);
assert.equal(guardNegative,204);
const near=(x,y,tol=1e-6)=>assert(Math.abs(x-y)<=tol,'Wrong physical result '+x+' vs '+y);
// Velocity-time signed areas; displacement is not unsigned distance.
near(24+6-1.5-6,22.5);
near(24+6+1.5+6,37.5);
near((20-4)/(5-1),4);
// Projectile and work under non-linear force-extension graph.
near(16*Math.sqrt(90/9.81),48.46,0.1);
near(0.5*80*0.040+0.5*(80+110)*0.040,5.4);
near((1.20-1.60)/(1-0),-0.4);
// Loaded potential divider.
near(12*4/(2+4),8);
near(12*2/(2+2),6);
// Stationary waves and slit interference.
near(Math.sqrt(80/(5e-4)),400);
near(Math.sqrt(80/(5e-4))/(2*0.8),250);
near(3*Math.sqrt(80/(5e-4))/(2*0.8),750);
near(600e-9*2/(0.30e-3),0.004);
near(8*600e-9*2/(0.30e-3),0.032);
near(Math.asin(1.46/1.5)*180/Math.PI,76.7,0.1);
// Photoelectric threshold and uncertainty.
near(6.63e-34*8e14,5.304e-19,1e-22);
near((5.304e-19/1.6e-19)-2.20,1.115);
near(2.64e-3*0.320e-3/1.80,4.693333e-7,1e-11);
near(0.5/26.4*100+0.010/0.320*100+0.02/1.80*100,6.13,0.1);
// Internal-resistance and branch-current checks.
near(1/(1/6+1/3),2);
near(12/(2+1),4);
near(8/6+8/3,4);
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
console.log('PASS v393: 12 original Physics AS multi-step mock questions, 77 method marks manual; 60 no-auto-credit probes, 204 negative metadata/source guards and independent mechanics, electricity, waves, optics and uncertainty calculation checks.');