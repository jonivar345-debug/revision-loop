'use strict';
// Exact first-mock Physics Electricity evidence, not completion certification.
const fs=require('node:fs'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const report=j('editorial/task1-v359-electricity-45-evidence-review.json');
const core=j('deck.json').cards,supp=j('physics_electricity_cross_spec_recall_v231.json').cards;
const app=read('app.js');
assert.equal(core.length,3345);assert.equal(new Set(core.map(c=>c.id)).size,3345);
assert.equal(report.version,'v359');assert.equal(report.rows.length,45);assert.equal(report.gates.length,4);
const refs=['3.5.1.1','3.5.1.2','3.5.1.3','3.5.1.4','3.5.1.5','3.5.1.6'];
assert.deepEqual([...new Set(report.rows.map(r=>r.specRef))].sort(),refs);
assert(!report.certification.wholeAqaElectricityLeftColumnIndividuallySignedOff);
assert(!report.certification.studentPracticalAndDiagramAnswersIndependentlyMarked);
assert(!report.certification.wholeMockProjectComplete);
assert(app.includes('physics_electricity_cross_spec_recall_v231.json'),'Evidence supplement must load in production');
const maps={'deck.json':new Map(core.map(c=>[c.id,c])),'physics_electricity_cross_spec_recall_v231.json':new Map(supp.map(c=>[c.id,c]))};
let ids=new Set(),reviewed=0;
for(const row of report.rows){
 assert(refs.includes(row.specRef)&&row.skill.length>10);
 assert(row.status==='sample_short_recall_verified'||row.status==='short_recall_available_manual_application_pending');
 assert(row.evidence.length>0);
 for(const e of row.evidence){
  const c=maps[e.path]?.get(e.id);
  assert(c,'Missing actual eligible source card: '+e.id);
  assert.equal(c.subject,'Physics');assert.equal(c.stage,'AS');assert.equal(c.mock,true);
  assert.notEqual(c.active,false);
  assert.equal(c.front,e.front,'Changed question: '+e.id);
  assert.equal(c.back,e.back,'Changed model answer: '+e.id);
  ids.add(e.id);reviewed++;
 }
}
assert.equal(ids.size,report.counts.uniqueEvidenceCards);
assert.equal(report.counts.uniqueEvidenceCards,46);
assert.equal(report.counts.manualApplicationRows,12);

const workedBanks={'science_practical_data_v194.json':new Map(j('science_practical_data_v194.json').questions.map(q=>[q.id,q])), 'physics_graphs_circuits_v203.json':new Map(j('physics_graphs_circuits_v203.json').questions.map(q=>[q.id,q]))};
let questionIds=new Set();
for(const gate of report.gates){
 assert.equal(gate.independentStudentWorkingReviewed,false);
 assert.equal(gate.fullMethodOrDrawingSignoff,false);
 assert(gate.evidenceLimitation.length>30);
 for(const e of gate.representativeWorkedQuestionEvidence){
  const q=workedBanks[e.path]?.get(e.id);
  assert(q,'Linked exam practice does not load: '+e.id);
  assert.equal(q.level,'AS');assert.equal(q.subject,'Physics');assert.equal(q.mock,true);
  assert.equal(q.requiresWorking,true);
  assert.equal(q.marks,e.marks);assert.equal(q.prompt,e.prompt);
  assert(q.marks>=6);
  questionIds.add(e.id);
 }
}
assert.equal(report.counts.representativeExistingWorkedQuestions,5);
assert.equal(questionIds.size,5);
console.log('PASS v359: all six AQA Electricity subsections have '+report.rows.length+' selected exact-card evidence rows ('+ids.size+' distinct cards, '+reviewed+' links), with four unresolved manual/diagram gates.');
