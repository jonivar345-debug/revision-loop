/* Adversarial typed-answer marking checks for the extended practice bank. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const begin=app.indexOf('function normalise('),middle=app.indexOf('function nextSchedule(',begin);
const start=app.indexOf('function evidenceRuleScore(',middle),end=app.indexOf('function renderExam(',start);
assert(begin>=0&&middle>begin&&start>middle&&end>start,'Source marking functions exist');
const mark=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
  app.slice(begin,middle)+app.slice(start,end)+'return examSuggested')();
const qs=['gap_questions_physics_v48.json','gap_questions_chemistry_v48.json',
  'gap_questions_maths_v48.json','gap_questions_extended_v49.json'].flatMap(f=>read(f).questions);
const byId=new Map(qs.map(q=>[q.id,q]));let checks=0;
const test=(q,answer,expected,label)=>{
 const result=mark(q,answer);
 assert.equal(result.suggested,expected,(label||q.id)+' / '+String(answer).slice(0,75));checks++;
 const flagged=result.preds.reduce((n,yes,i)=>n+(yes?(q.markPointMarks?.[i]||1):0),0);
 assert.equal(flagged,expected,'Individual marks must match total: '+q.id);checks++;
};
for(const q of qs){
 test(q,q.modelAnswer,q.marks,'Complete model answer');
 test(q,'I have no idea.',0,'Empty knowledge');
 for(let i=0;i<q.markPoints.length;i++)test(q,q.markPoints[i],q.markPointMarks?.[i]||1,'One marking point only');
 for(const isolated of ['1','2','3','0','0.08','cos','sin']){
  const r=mark(q,isolated);
  assert(r.suggested<=1,q.id+' gave '+r.suggested+' for isolated '+isolated);checks++;
  assert(r.preds.filter(Boolean).length<=1,'Multiple criteria claimed for '+isolated+' on '+q.id);checks++;
 }
}
const proof=byId.get('gap_v48_math_12');
test(proof,'1',0,'A digit is not a proof');
test(proof,'Let n be an integer, so the next one is n+1. (n+1)^2-n^2=2n+1, which is odd since 2n is even.',4,'Equivalent proof');
const slope=byId.get('gap_v48_phy_03');
test(slope,'Gravity vertically down; normal contact force perpendicular to incline; friction uphill. Steady speed gives zero acceleration and balanced forces along the ramp. R = 6*9.81cos28 = 52.0 N; friction = 6*9.81sin28 = 27.6 N.',4,'Equivalent slope solution');
const distillation=byId.get('gap_v48_chem_06');
test(distillation,'Distill propanal straight away to stop oxidation. Prolonged heating under reflux with excess dichromate forms propanoic acid instead. The colour changes orange to green because Cr(VI) is reduced to Cr(III). The aldehyde vapour escapes through a condenser in distillation but stays in the flask under reflux.',4,'Equivalent organic chemistry');
test(distillation,'reflux forms propanoic acid',1,'One valid outcome');
test(distillation,'orange to green due to dichromate',1,'One valid observation');
test(distillation,'propanoic acid',0,'Isolated chemical noun is insufficient');
const ordinary=read('exam_questions.json').questions.find(q=>q.id==='aqa_phy_as23_p1_q1_5');
assert(ordinary,'Existing normal calculation retained');
test(ordinary,String(ordinary.numericAnswer),ordinary.marks,'Full credit for correct ordinary numerical answer');
// Plain arithmetic must be evaluated; incidental operands and contradictory
// equality chains must not receive final-answer marks.
const numberMark=new Function(app.slice(begin,middle)+'return numericMatch')();
for(const [expectedNumber,answer,accepted] of [
 [2,'1+2',false],[3,'1+2',true],[6,'2*3',true],[3,'2*3',false],
 [3,'2*3=3',false],[3,'1+2=3',true],[3,'1+2=3=4',false],
 [0,'1/0',false],[.5,'1/2',true],[2/3,'2/3',true],
 [100,'100=101',false],[99,'100=99',false],
 [2000,'2×10^3',true],[2000,'2*10^3=2000',true],
 [1.23,'1.234=1.23',true],[0.001,'1e-3',true],
 [6,'2*3=6',true],[4,'1+2+3',false]
]){
 const q={answerType:'numeric',numericAnswer:expectedNumber,
  tolerance:expectedNumber===0?1e-9:Math.max(Math.abs(expectedNumber)*0.01,1e-10)};
 assert.equal(numberMark(q,answer),accepted,'Numeric expression check: '+answer+' vs '+expectedNumber);
 checks++;
}
// An explanatory suffix must not hide inconsistent numerical equalities.
for(const [expectedNumber,answer,accepted] of [[3,"1+2=4 approximately 3",false],[3,"1/0=3, approximately",false],[3,"1=2; 3",false],[3,"1=2, answer 3",false],[3,"2*2=3 answer",false],[3,"3.2=3.0 approx",false],[3,"1+2=3, approximately 3",true],[4,"2*2=4 answer 4",true]]){
 const q={answerType:'numeric',numericAnswer:expectedNumber,tolerance:Math.abs(expectedNumber)*.01};
 assert.equal(numberMark(q,answer),accepted,'Annotated equality: '+answer);
 checks++;
}
console.log('PASS '+checks+' adversarial and alternative-wording marking checks across '+qs.length+' questions');
