/* Adversarial typed-answer marking checks for the extended practice bank. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const mark=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
  app.slice(app.indexOf('function normalise('),app.indexOf('function nextSchedule(')))+
  app.slice(app.indexOf('function evidenceRuleScore('),app.indexOf('function renderExam(',app.indexOf('function evidenceRuleScore(')))+
  'return examSuggested')();
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
console.log('PASS '+checks+' adversarial and alternative-wording marking checks across '+qs.length+' questions');
