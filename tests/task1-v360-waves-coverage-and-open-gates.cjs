'use strict';
// v360: selected AQA Year 1 Waves evidence, not full specification certification.
const assert=require('node:assert/strict'),fs=require('node:fs');
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const app=fs.readFileSync('app.js','utf8');
const data=json('editorial/task1-v360-waves-coverage-and-open-gates.json');
const sourcePaths=["physics_waves_crosswalk_recall_v229.json","physics_waves_reasoning_recall_v226.json","physics_waves_applications_v253.json","physics_waves_polarisation_stationary_recall_v279.json","physics_refraction_fibres_recall_v275.json","physics_optical_fibre_precision_recall_v225.json","science_practical_data_v194.json","physics_waves_polarisation_stationary_practice_v279.json","physics_refraction_fibres_practice_v275.json","physics_waves_interference_application_v226.json","science_waves_energetics_v198.json","deck.json"];
const sourceMaps=Object.fromEntries(sourcePaths.map(p=>[p,new Map((json(p).cards||json(p).questions||[]).map(c=>[c.id,c]))]));
assert.equal(json('deck.json').cards.length,3345);
assert.equal(data.version,'v360');assert.equal(data.rows.length,57);
assert.equal(data.linkedOriginalExamPractice.length,13);
assert.equal(data.remainingGates.length,7);
assert.equal(data.counts.sections,6);
assert.deepEqual([...new Set(data.rows.map(r=>r.specRef))].sort(),['3.3.1.1','3.3.1.2','3.3.1.3','3.3.2.1','3.3.2.2','3.3.2.3']);
assert.equal(data.completion.task1Complete,false);
assert.equal(data.completion.allLeftColumnAssessableStatementsIndependentlySignedOff,false);
assert.equal(data.completion.allDiagramsAndRequiredPracticalMethodsIndependentlyGraded,false);
let ids=new Set();
for(const r of data.rows){
 const e=r.evidence,c=sourceMaps[e.path]?.get(e.cardId);
 assert(c,'Missing source card '+e.cardId);
 assert.equal(c.subject,'Physics');assert.equal(c.stage,'AS');assert.equal(c.mock,true);
 assert.notEqual(c.active,false);assert.equal(c.front,e.front);assert.equal(c.back,e.back);
 assert(app.includes(e.path),'Evidence file must load on website: '+e.path);
 assert(e.front.length>6&&e.back.length>1);
 ids.add(e.cardId);
}
assert.equal(ids.size,data.counts.distinctSampledMockCards);
const questions=new Set();
for(const e of data.linkedOriginalExamPractice){
 const q=sourceMaps[e.path]?.get(e.id);
 assert(q,'Missing real exam practice '+e.id);
 assert.equal(q.subject,'Physics');assert.equal(q.level,'AS');assert.equal(q.mock,true);
 assert(q.marks>=4);assert.equal(q.marks,e.marks);assert.equal(q.prompt,e.prompt);
 assert(app.includes(e.path),'Practice file must load on website: '+e.path);
 questions.add(e.id);
}
assert.equal(questions.size,data.counts.linkedExamQuestions);
assert(data.remainingGates.every(g=>g.status.includes('pending')||g.status.includes('not_independently_mapped')));
console.log('PASS v360: '+data.rows.length+' exact first-mock Physics Waves recall evidence rows, '+data.counts.sections+' subsections, '+questions.size+' original multi-mark practice questions and '+data.remainingGates.length+' open gates; no app/progress edits.');
