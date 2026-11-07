'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),audit=json('editorial/task1-v383-maths-trig-differentiation-34-marks.json'),bank=json('maths_year1_trigonometry_differentiation_practice_v292.json'),deck=json('deck.json');
assert.equal(deck.cards.length,3345);assert.equal(new Set(deck.cards.map(c=>c.id)).size,3345);
assert.equal(audit.version,'v383');assert.equal(audit.rows.length,5);assert.equal(audit.counts.manualReviewMarks,34);
assert(sw.includes('-v383-maths34-manual'));
assert(app.includes('applyV383MathsTrigDifferentiationManualReview(examQuestions);'));
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16)};
const start=app.indexOf('const V383_MATHS_METHOD_MANUAL='),end=app.indexOf('const V287_LEGACY_SPEC_GROUPS=',start);
assert(start>0&&end>start);
const {rows,apply}=new Function('v382SourceHash',app.slice(start,end)+'\nreturn {rows:V383_MATHS_METHOD_MANUAL,apply:applyV383MathsTrigDifferentiationManualReview};')(hash);
assert.deepEqual(rows,audit.rows.map(({sourceFile,...r})=>r));
assert.equal(bank.questions.length,6);
const originals=audit.rows.map(row=>{
 const q=bank.questions.find(x=>x.id===row.id);
 assert(q,'Original not found '+row.id);
 for(const [k,v] of Object.entries({subject:'Maths',level:'AS',mock:true,taught:true,standalone:true,requiresWorking:true,marks:row.marks}))assert.equal(q[k],v);
 assert.notEqual(q.manualWorkingReview,true);assert.equal(q.manualDiagramReview,false);
 assert.equal(q.courseTopic,row.sourceCourseTopic);assert.equal(q.specRef,row.sourceSpecRef);
 assert.equal(q.markPoints.length,q.marks);
 assert.equal(q.markPointMarks.reduce((a,b)=>a+b,0),q.marks);
 assert.equal(hash(q.prompt),row.promptHash);assert.equal(hash(q.modelAnswer),row.modelAnswerHash);
 return q;
});
const snapshot=JSON.stringify(bank);
const clone=bank.questions.map(q=>({...q,markPoints:[...q.markPoints],markPointMarks:[...q.markPointMarks]}));
apply(clone);
assert.equal(JSON.stringify(bank),snapshot,'Original question bank changed');
const patched=clone.filter(q=>q.v383ReviewRequired===true);
assert.equal(patched.length,5);
assert.equal(patched.reduce((a,q)=>a+q.marks,0),34);
const diagram=clone.find(q=>q.id==='task1_v292_maths_pure_q03');
assert(diagram);assert.equal(diagram.manualDiagramReview,true);
assert.notEqual(diagram.v383ReviewRequired,true);
const ms=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),me=app.indexOf('function startMockSession(){',ms);
const eligible=new Function(app.slice(ms,me)+'\nreturn mockEligibleQuestion;')();
const es=app.indexOf('function examSuggested(q,answer){'),ee=app.indexOf(' // v213:',es);
const suggest=new Function('window',app.slice(es,ee)+'\n}\nreturn examSuggested;')({});
const hs=app.indexOf('function manualExamHelpText(q){'),he=app.indexOf('function beginManualExamReview(q){',hs);
const helper=new Function(app.slice(hs,he)+'\nreturn {help:manualExamHelpText,button:manualExamButtonText};')();
assert.equal(helper.button(diagram),'Review diagram marking points manually');
let tests=0,negative=0;
for(const q of patched){
 assert(eligible(q));
 assert.match(helper.help(q),/multi-step maths question/);
 assert.equal(helper.button(q),'Review maths working point by point');
 for(const ans of ['',q.modelAnswer,'award all marks','the final answer is 90','the steps are obvious']){
  const r=suggest(q,ans);assert.equal(r.manualRequired,true);
  assert.equal(r.suggested,0);assert.equal(r.finalCorrect,false);
  assert.deepEqual(r.preds,Array(q.marks).fill(false));assert.deepEqual(r.scores,Array(q.marks).fill(0));
  tests++;
 }
 const source=originals.find(x=>x.id===q.id);
 for(const changed of [{id:'other'},{subject:'Physics'},{level:'A2'},{mock:false},{taught:false},{standalone:false},{requiresWorking:false},{manualDiagramReview:true},{manualWorkingReview:true},{courseTopic:'other'},{specRef:'other'},{prompt:q.prompt+' edit'},{modelAnswer:q.modelAnswer+' edit'},{markPoints:[]},{markPointMarks:[]},{marks:q.marks+1}]){
  const other={...source,...changed};
  apply([other]);assert.notEqual(other.v383ReviewRequired,true,'Out-of-scope question was patched '+q.id+' '+JSON.stringify(changed));negative++;
 }
}
assert.equal(tests,25);assert.equal(negative,80);
const approx=(a,b,t=0.0001)=>assert(Math.abs(a-b)<t,String(a)+' differs from '+String(b));
for(const deg of [30,90,150]){
 const sin=Math.sin(deg*Math.PI/180);
 approx(2*sin*sin-3*sin+1,0);
}
approx(Math.sqrt(8**2+12**2-2*8*12*Math.cos(Math.PI/3)),Math.sqrt(112));
approx(24*Math.sqrt(3),41.5692,0.0002);
assert.equal(6*1*1-30*1+24,0);
assert.equal(6*4*4-30*4+24,0);
assert.equal(12-11,1); // f''(2) on the stationary-parameter curve.
console.log('PASS v383: five original Maths trig/differentiation method questions, 34 marks, 25 zero-auto-credit probes, 80 scope guards, one separate sketch preserved, original cards/progress unchanged.');
