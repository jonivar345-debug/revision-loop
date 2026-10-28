'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const app=fs.readFileSync('app.js','utf8');
const bank=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const ledger=JSON.parse(fs.readFileSync('editorial/task1-v168-physics-model-answer-audit.json','utf8'));
const start=app.indexOf('function normalise('),middle=app.indexOf('function nextSchedule(',start);
const b=app.indexOf('function evidenceRuleScore(',middle),e=app.indexOf('function renderExam(',b);
assert(start>=0&&middle>start&&b>middle&&e>b);
const mark=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
 app.slice(start,middle)+app.slice(b,e)+'return examSuggested')();
assert.equal(bank.questions.length,1268);
assert.equal(bank.bankVersion,69);
const ids=['orig_v25_physics_free_body_diagrams_1','orig_v25_physics_free_body_diagrams_4',
 'orig_v25_physics_gas_laws_2','orig_v25_physics_electric_fields_2'];
assert.deepEqual(ledger.questionIds,ids);
assert.equal(ledger.correctedModelAnswers,4);
assert.equal(ledger.acceptedAlternativePhrases,12);
for(const id of ids){
 const q=bank.questions.find(x=>x.id===id);
 assert(q,'missing '+id);
 assert.equal(q.subject,'Physics');
 assert.equal(q.year,'Practice');
 assert.equal(q.marks,3);
 assert.equal(q.requiresWorking,true);
 assert(q.modelAnswer.length>85,'full solution missing '+id);
 assert.deepEqual(q.markPointMarks,[1,1,1]);
 assert.deepEqual(q.markPointAcceptedAlternatives.map(x=>x.length),[1,1,1]);
 assert(q.ecfGuidance.length>=70);
 const full=mark(q,q.modelAnswer);
 assert.equal(full.suggested,3,'model answer does not earn all three marks '+id);
 assert.deepEqual(full.preds,[true,true,true],id+' every criterion demonstrated');
 assert.equal(mark(q,'I do not know').suggested,0,id);
 assert.equal(mark(q,'').suggested,0,id);
 for(let i=0;i<3;i++){
  const variant=q.markPointAcceptedAlternatives[i][0];
  const awarded=mark(q,variant);
  assert.equal(awarded.suggested,1,id+' alternative '+i+' must earn exactly one mark');
  assert.equal(awarded.preds[i],true,id+' intended point missing '+i);
  assert.equal(awarded.preds.filter(Boolean).length,1,id+' accidental extra point');
  const denial=mark(q,'not '+variant);
  assert.equal(denial.suggested,0,id+' denied alternative incorrectly accepted');
  assert(denial.preds.every(x=>!x),id+' denied alternative credited');
 }
 const original=ledger.corrections.find(x=>x.id===id);
 assert(original&&original.originalModelAnswer&&original.originalModelAnswer!==q.modelAnswer);
 const bare=mark(q,original.originalModelAnswer);
 assert(bare.suggested<q.marks,id+' bare old model should not receive full credit');
}
assert.equal(ledger.questionIds.length,new Set(ledger.questionIds).size);
assert.equal(ledger.notOfficialAqaMarkSchemes,true);
assert.equal(ledger.allOtherQuestionIdsPreserved,true);
console.log('PASS v168: four complete Physics worked model answers, 12 accepted equivalents, zero false awards for denials, bare-answer safeguards.');
