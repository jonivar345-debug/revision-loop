'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const app=fs.readFileSync('app.js','utf8');
const bank=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v169-marking-calibration.json','utf8'));
const begin=app.indexOf('function normalise('),middle=app.indexOf('function nextSchedule(',begin);
const start=app.indexOf('function evidenceRuleScore(',middle),end=app.indexOf('function renderExam(',start);
assert(begin>=0&&middle>begin&&start>middle&&end>start);
const {examSuggested,singleClaimEvidenceCap,acceptedMarkPointAlternative}=new Function(
 'function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+app.slice(begin,middle)+app.slice(start,end)+
 'return {examSuggested,singleClaimEvidenceCap,acceptedMarkPointAlternative};')();
assert.equal(bank.questions.length,1268);
let fullModelChecks=0;
for(const q of bank.questions){
 if(!q.modelAnswer||!Array.isArray(q.markPoints))continue;
 const result=examSuggested(q,q.modelAnswer);
 assert.equal(result.suggested,q.marks,q.id+' stored model answer should receive full marks');
 fullModelChecks++;
}
assert.equal(fullModelChecks,1268,'complete question-bank model-answer self-consistency');
assert.equal(deck.cards.length,3335);
const find=id=>{const q=bank.questions.find(q=>q.id===id);assert(q,id+' missing');return q;};
const examples=[
 ['mock_v163_03','The second derivative is positive at x=3 so it is a minimum.',2],
 ['mock_v163_08','The factor theorem proves that x-3 divides f(x).',1],
 ['organic_v153_10','Overall yield is 32.4%.',1],
 ['mock_v157_03','Work done is area under force-displacement graph.',1],
 ['mock_v163_07','The tangent is y=-2x+13 and its gradient is -2.',2]
];
for(const [id,answer,expected] of examples){
 const q=find(id),result=examSuggested(q,answer);
 assert.equal(result.suggested,expected,id+' single-claim score');
 assert(singleClaimEvidenceCap(q,answer)!==null);
 assert(result.preds.filter(Boolean).length>=result.suggested,'original tentative ticks preserved');
}
for(const id of ['mock_v163_03','mock_v163_08','organic_v153_10']){
 const q=find(id),full=examSuggested(q,q.modelAnswer);
 assert.equal(full.suggested,q.marks,id+' full rubric still earns full marks');
 assert.equal(singleClaimEvidenceCap(q,q.modelAnswer),null);
}
const multiline=find('mock_v160_02');
assert.equal(singleClaimEvidenceCap(multiline,'5.304×10^-19 J; 3.315 eV; 1.115 eV; 1.115 V; 5.31×10^14 Hz.'),null);
assert.equal(singleClaimEvidenceCap({...multiline,answerType:'numeric'},'The result is 1.12 V.'),null);
const ids=['mock_v157_03','mock_v160_03','organic_v153_10','mock_v154_07','mock_v163_02','mock_v163_08'];
let variants=0;
for(const id of ids){
 const q=find(id);assert.equal(q.subject,audit.addedQuestions.find(x=>x.id===id).subject);
 assert(q.requiresWorking&&q.markPointAcceptedAlternatives?.length===q.markPoints.length);
 assert(q.ecfGuidance?.length>80);
 for(let i=0;i<q.markPoints.length;i++){
  const alts=q.markPointAcceptedAlternatives[i];assert(Array.isArray(alts));
  for(const alt of alts){
   variants++;
   assert(alt.length>=25);
   assert(acceptedMarkPointAlternative(alt,alts,q.markPoints[i]));
   assert(!acceptedMarkPointAlternative('not '+alt,alts,q.markPoints[i]));
   const yes=examSuggested(q,alt),no=examSuggested(q,'not '+alt);
   assert(yes.preds[i],id+' accepts its own valid phrasing');
   assert.equal(yes.suggested,q.markPointMarks?.[i]??1,id+' cannot award unrelated marks');
   assert.equal(yes.preds.filter(Boolean).length,1,id+' only marks its own criterion');
   assert.equal(no.suggested,0,id+' rejects negated phrase');
   assert(no.preds.every(v=>!v));
  }
 }
}
assert.equal(variants,18);
assert.equal(bank.questions.filter(q=>q.markPointAcceptedAlternatives?.some(x=>x.length) && !['stretch_v34_physics_rp2_interference','mock_v154_05','mock_v157_02','mock_v160_04','stretch_v34_chemistry_back_titrations','organic_v147_13','organic_v147_14','organic_v147_16'].includes(q.id)).length,18);
assert.equal(audit.newAlternativePhrases,18);
assert.equal(audit.totalCuratedPhrases,50);
assert.equal(audit.questionBankTotal,1268);
assert.equal(audit.fullAqaMarkSchemeCoverage,false);
assert.equal(audit.automaticEcFCertified,false);
assert(app.includes("const singleClaimCap=typeof singleClaimEvidenceCap==='function'?singleClaimEvidenceCap(q,answer):null;"));
console.log('PASS v169: single-claim guard, 18 new verified phrases, strict negation and untouched full-model marks.');
