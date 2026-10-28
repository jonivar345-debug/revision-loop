'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const app=fs.readFileSync('app.js','utf8');
const bank=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const ledger=JSON.parse(fs.readFileSync('editorial/task1-v170-practical-method-marking-audit.json','utf8'));
const begin=app.indexOf('function normalise('),middle=app.indexOf('function nextSchedule(',begin);
const start=app.indexOf('function evidenceRuleScore(',middle),end=app.indexOf('function renderExam(',start);
assert(begin>=0&&middle>begin&&start>middle&&end>start);
const judge=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
 app.slice(begin,middle)+app.slice(start,end)+
 'return {examSuggested,acceptedMarkPointAlternative};')();
const ids=['stretch_v34_physics_rp2_interference','mock_v154_05','mock_v157_02','mock_v160_04',
 'stretch_v34_chemistry_back_titrations','organic_v147_13','organic_v147_14','organic_v147_16'];
assert.equal(bank.questions.length,1268);
assert.equal(ledger.additions.questionCount,8);
assert.equal(ledger.additions.physicsQuestions,4);
assert.equal(ledger.additions.chemistryQuestions,4);
let alternativesChecked=0;
for(const id of ids){
 const q=bank.questions.find(q=>q.id===id);
 assert(q,'missing '+id);
 assert.equal(q.requiresWorking,true);
 assert.equal(q.markPointAcceptedAlternatives?.length,q.markPoints.length);
 assert(q.ecfGuidance?.length>=85,id+' ECF note missing');
 assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 const copy=ledger.questions.find(x=>x.id===id);
 assert(copy&&copy.subject===q.subject&&copy.marks===q.marks);
 assert.deepEqual(copy.acceptedPhrases,q.markPointAcceptedAlternatives.flat());
 for(let i=0;i<q.markPoints.length;i++){
  const variants=q.markPointAcceptedAlternatives[i];
  assert(Array.isArray(variants));
  for(const alt of variants){
   alternativesChecked++;
   assert(alt.length>=28);
   assert.equal(judge.acceptedMarkPointAlternative(alt,variants,q.markPoints[i]),true);
   assert.equal(judge.acceptedMarkPointAlternative('not '+alt,variants,q.markPoints[i]),false);
   const yes=judge.examSuggested(q,alt),no=judge.examSuggested(q,'not '+alt);
   assert.equal(yes.suggested,1,id+' alternative must only earn its own mark');
   assert.equal(yes.preds.filter(Boolean).length,1,id+' unrelated rubric point awarded');
   assert.equal(yes.preds[i],true,id+' target mark omitted');
   assert.equal(no.suggested,0,id+' negated evidence awarded');
   assert(no.preds.every(x=>!x));
  }
 }
 assert.equal(judge.examSuggested(q,q.modelAnswer).suggested,q.marks);
 assert.equal(judge.examSuggested(q,'I do not know').suggested,0);
}
assert.equal(alternativesChecked,24);
let checkedModels=0;
for(const q of bank.questions){
 assert(q.modelAnswer&&Array.isArray(q.markPoints));
 assert.equal(judge.examSuggested(q,q.modelAnswer).suggested,q.marks,q.id+' full model self-consistency');
 checkedModels++;
}
assert.equal(checkedModels,1268);
const fringe=bank.questions.find(q=>q.id==='stretch_v34_physics_rp2_interference');
const formulaOnly=judge.examSuggested(fringe,'use fringe width multiplied by slit separation divided by screen distance');
assert.equal(formulaOnly.suggested,1,'formula alone must not imply correct answer and uncertainty marks');
const chem=bank.questions.find(q=>q.id==='stretch_v34_chemistry_back_titrations');
const ratioOnly=judge.examSuggested(chem,'each mole of calcium carbonate consumes two moles of hydrochloric acid');
assert.equal(ratioOnly.suggested,1,'stoichiometric ratio is not proof of titration arithmetic');
assert.equal(ledger.totals.curatedQuestions,26);
assert.equal(ledger.totals.curatedPhrases,74);
assert.equal(ledger.additions.addedPhrases,24);
assert.equal(ledger.limitations.officialPastPaperMarkSchemeCertified,false);
assert.equal(ledger.limitations.automaticErrorCarriedForwardAward,false);
assert.equal(ledger.limitations.task1SignedOff,false);
console.log('PASS v170: 24 practical marking alternatives and denials, 1268 intact model scores, no unsupported ECF full credit.');
