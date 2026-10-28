'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const app=fs.readFileSync('app.js','utf8');
const handoff=fs.readFileSync('free-marking.js','utf8');
const css=fs.readFileSync('styles.css','utf8');
const bank=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const begin=app.indexOf('function normalise(');
const middle=app.indexOf('function nextSchedule(',begin);
const start=app.indexOf('function evidenceRuleScore(',middle);
const end=app.indexOf('function renderExam(',start);
assert(begin>=0&&middle>begin&&start>middle&&end>start,'marking source boundaries');
const funcs=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+app.slice(begin,middle)+app.slice(start,end)+'return {examSuggested,acceptedMarkPointAlternative};')();
assert.equal(bank.questions.length,1268);
const curated=bank.questions.filter(q=>Array.isArray(q.markPointAcceptedAlternatives));
assert.equal(curated.length,8);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,curated.filter(q=>q.subject===s).length])),{Physics:2,Chemistry:2,Maths:4});
let variants=0,checked=0;
for(const q of curated){
 assert.equal(q.markPointAcceptedAlternatives.length,q.markPoints.length,q.id);
 assert(q.ecfGuidance.length>70,q.id+' ECF explanation');
 assert(q.requiresWorking,q.id+' should not auto-give full credit for answer only');
 for(let i=0;i<q.markPointAcceptedAlternatives.length;i++){
  const alts=q.markPointAcceptedAlternatives[i];
  assert(Array.isArray(alts));
  for(const variant of alts){
   variants++;
   assert(variant.length>=22);
   assert.equal(funcs.acceptedMarkPointAlternative(variant,alts,q.markPoints[i]),true,
     q.id+' should accept its vetted alternative '+variant);
   assert.equal(funcs.acceptedMarkPointAlternative('not '+variant,alts,q.markPoints[i]),false,
     q.id+' should reject a negated alternative');
   const result=funcs.examSuggested(q,variant);
   assert.equal(result.preds[i],true,q.id+' should recognise alternative evidence at point '+(i+1));
   assert.equal(result.suggested,q.markPointMarks?.[i]??1,q.id+' standalone alternative awards only its own mark');
   assert.equal(result.preds.filter(Boolean).length,1,q.id+' standalone explanation must not trigger unrelated criteria');
   checked++;
  }
 }
 assert.equal(funcs.examSuggested(q,'I have no idea.').suggested,0);
 assert.equal(funcs.examSuggested(q,'').suggested,0);
}
assert.equal(variants,20);
assert(app.includes('function acceptedMarkPointAlternative('));
assert(app.includes('const strictEvidence=Array.isArray(q.markEvidenceRules?.[i]);'));
assert(app.includes('markPointAcceptedAlternatives?.[i]'));
assert(app.includes('Error carried forward:'));
assert(app.includes("manualScoreOverride?'Manual total override':'Conservative automatic estimate'"));
assert(app.includes('manualScoreOverride=true;renderScoreEditor(q,answer)'));
assert(app.includes('currentExamScore=res.suggested;manualScoreOverride=false;'));
assert(app.includes('const checkboxTotal=totalMarkingPoints(q,checks);'));
assert(app.includes("if(scannedText&&!vision&&Array.isArray(evidence)&&Array.isArray(q.markPointAcceptedAlternatives))"));
assert(app.includes("acceptedMarkPointAlternative(answer,alternatives,q.markPoints[i])"));
assert(app.includes("!arithmeticConcern&&!Array.isArray(q.markEvidenceRules?.[i])"));
assert(handoff.includes('markPointAcceptedAlternatives?.[i]'));
assert(handoff.includes('q.ecfGuidance?'));
assert(css.includes('.markpoint .mark-alternatives'));
assert(css.includes('.markpoint .point-weight'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v167-marking-quality-audit.json','utf8'));
assert.equal(audit.curatedQuestionCount,8);
assert.equal(audit.alternativePhrases,20);
assert.equal(audit.existingQuestionCount,1268);
assert.equal(audit.existingCardCount,3335);
assert.equal(audit.officialAqaMarkSchemeCertification,false);
assert.equal(audit.independentHandwritingAccuracyCertification,false);
console.log('PASS v167: '+checked+' vetted answer alternatives recognised, negation blocked, original point rubrics and score-editor caveats preserved.');
