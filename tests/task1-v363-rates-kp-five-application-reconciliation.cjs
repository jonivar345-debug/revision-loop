'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const j=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const app=fs.readFileSync('app.js','utf8');
const report=j('editorial/task1-v363-rates-kp-five-application-reconciliation.json');
const old=j('editorial/task1-v332-measurements-rates-kp-crosswalk.json').rows;
const core=j('deck.json').cards,q=j('chemistry_rates_rp7_kp_v210.json').questions;
assert.equal(core.length,3345);assert.equal(new Set(core.map(x=>x.id)).size,3345);
assert.equal(report.version,'v363');assert.equal(report.rows.length,5);
assert(app.includes('chemistry_rates_rp7_kp_v210.json'),'Linked practice bank must be actually loaded');
assert.deepEqual(report.rows.map(x=>x.id).sort(),['C10','C14','C22','K07','K12']);
assert(report.rows.every(x=>x.independentMarkingComplete===false));
const cById=new Map(core.map(x=>[x.id,x])),qById=new Map(q.map(x=>[x.id,x]));
const found=new Set();let links=0;
for(const row of report.rows){
 const prev=old.find(x=>x.id===row.id);
 assert(prev,'Missing legacy row '+row.id);
 assert.equal(prev.subject,'Chemistry');assert.equal(prev.status,'partial_application');
 assert.equal(row.legacyStatus,prev.status);assert.equal(row.aqa,prev.specRef);
 assert.deepEqual(row.existingCoreRecallIds,prev.evidenceIds);
 assert(row.note.length>45);
 for(const r of row.foundExamPractice){
  const original=qById.get(r.id);assert(original,'Exam question ID absent '+r.id);
  assert.equal(r.path,'chemistry_rates_rp7_kp_v210.json');
  assert.equal(original.subject,'Chemistry');assert.equal(original.level,'A2');
  assert.equal(original.mock,true);assert.equal(original.requiresWorking,true);
  assert.equal(original.marks,r.marks);assert.equal(original.prompt,r.prompt);
  assert(r.marks>=8);
  links++;found.add(r.id);
 }
 for(const r of row.generalRecall){
  const original=cById.get(r.id);assert(original,'Core ID absent '+r.id);
  assert.equal(r.path,'deck.json');assert.equal(original.subject,'Chemistry');
  assert.equal(original.mock,true);assert.equal(original.front,r.front);assert.equal(original.back,r.back);
 }
}
assert.equal(links,report.counts.questionLinks);assert.equal(found.size,report.counts.uniqueExamQuestions);
assert.equal(report.counts.uniqueExamQuestions,4);assert.equal(report.counts.uniqueCoreCatalystRecallCards,2);
assert.equal(report.counts.fullMethodsAndNewAnswersIndependentlySignedOff,0);
assert(report.stillOpen.length>=4);
console.log('PASS v363: five v332 rate/Kp partials reconciled with four exact loaded multi-mark practice questions and two existing catalyst recall cards; manual gates retained.');
