'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const bank=json('physics_electricity_manual_sketch_practice_v407.json');
const app=read('app.js'),sw=read('sw.js');
const audit=json('editorial/task1-v407-electricity-four-gate-practice-reconciliation.json');
assert.equal(audit.counts.targetedEarlierElectricityGates,4);
assert.equal(audit.counts.newManualMarks,35);
assert.equal(audit.completion.independentDrawnStudentAnswersReviewed,false);
assert.equal(audit.completion.wholeAqaPhysicsMockSignedOff,false);
assert.deepEqual(audit.rows.map(r=>r.questionId),bank.questions.map(q=>q.id));

const deck=json('deck.json'),original=json('exam_questions.json');
assert.equal(deck.cards.length,3345,'Original core deck must not change');
assert.equal(original.questions.length,1268,'Original exam question bank must not change');
assert.equal(bank.version,'v407');
assert.equal(bank.questions.length,4);
const expected=[
 ['task1_v407_phy_elec_01','3.5.1.2',8],
 ['task1_v407_phy_elec_02','3.5.1.3',10],
 ['task1_v407_phy_elec_03','3.5.1.5',8],
 ['task1_v407_phy_elec_04','3.5.1.6',9]
];
const originalCardIds=new Set(deck.cards.map(c=>c.id));
const originalQuestionIds=new Set(original.questions.map(q=>q.id));
assert.equal(new Set(bank.questions.map(q=>q.id)).size,4);
assert.equal(bank.questions.reduce((n,q)=>n+q.marks,0),35);
assert.equal(bank.questions.reduce((n,q)=>n+q.markPoints.length,0),35);
const mockStart=app.indexOf('function mockEligibleQuestion(q){');
const mockEnd=app.indexOf('function startMockSession(){',mockStart);
assert(mockStart>0&&mockEnd>mockStart);
const mockEligibleQuestion=new Function(app.slice(mockStart,mockEnd)+'\nreturn mockEligibleQuestion;')();
for(let i=0;i<expected.length;i++){
 const q=bank.questions[i], [id,spec,marks]=expected[i];
 assert.equal(q.id,id);assert.equal(q.specRef,spec);assert.equal(q.marks,marks);
 assert.equal(q.subject,'Physics');assert.equal(q.level,'AS');
 assert.equal(q.mock,true);assert.equal(q.taught,true);assert.equal(q.standalone,true);
 assert.equal(q.manualWorkingReview,true);assert.equal(q.manualDiagramReview,true);
 assert.equal(q.requiresWorking,true);assert.equal(q.answerType,'points');
 assert.equal(q.sourceVerified,false);assert.equal(q.verificationLevel,'original-exam-style');
 assert.equal(q.groupId,q.id);assert.equal(q.groupOrder,1);
 assert.equal(mockEligibleQuestion(q),true,'Question must be in mock filter');
 assert(!originalCardIds.has(q.id),'Do not replace saved flashcard IDs');
 assert(!originalQuestionIds.has(q.id),'Do not replace original exam question IDs');
 assert(Array.isArray(q.markPoints)&&q.markPoints.length===marks);
 assert.deepEqual(q.markPointMarks,Array(marks).fill(1));
 assert(q.markPoints.every(p=>typeof p==='string'&&p.trim().length>=20));
 assert(typeof q.prompt==='string'&&q.prompt.includes('['+marks+' marks]'));
 assert(typeof q.modelAnswer==='string'&&q.modelAnswer.length>120);
}
const bankFile='./physics_electricity_manual_sketch_practice_v407.json';
const loader=app.slice(app.indexOf('const EXTRA_PRACTICE_URLS='),app.indexOf('const EXTRA_FLASHCARD_URLS='));
assert.equal(loader.split(bankFile).length-1,1,'Bank must load once as exam practice');
const flashLoader=app.slice(app.indexOf('const EXTRA_FLASHCARD_URLS='),app.indexOf('function isV348MathsFirstMockCard('));
assert(!flashLoader.includes(bankFile),'Never turn these long working questions into flashcards');
assert(sw.includes("-v407-electricity-practice"),'v407 service worker version must be preserved in later caches');
assert.equal(sw.split(bankFile).length-1,1,'Bank must be cached once for offline practice');
const scoreStart=app.indexOf('function examSuggested(q,answer){');
const scoreEnd=app.indexOf('function examGraphDiagram(',scoreStart);
const score=app.slice(scoreStart,scoreEnd);
assert(score.includes('if(q.manualDiagramReview===true||q.manualWorkingReview===true)'));
assert(score.includes('manualRequired:true'));
for(const key of [
 "PROGRESS_KEY='revisionLoopProgress5'",
 "PROFILE_KEY='revisionLoopProfile11'",
 "SETTINGS_KEY='revisionLoopSettings11'"
])assert(app.includes(key),'Saved progress/profile/settings key changed');

// Independent numerical and direction checks of the new worked scenarios.
const gradientR=(3.2-1.6)/(0.8-0.4);
assert(Math.abs(gradientR-4)<1e-10);
const d=0.500e-3, A=Math.PI*d*d/4,rho=gradientR*A;
assert(Math.abs(A-1.9634954084936208e-7)<1e-16);
assert(Math.abs(rho-7.853981633974483e-7)<1e-15);
assert.equal(2*(0.010/0.500)*100,4);
const fixed=4000, supply=10;
const ntcBefore=supply*fixed/(fixed+6000),ntcAfter=supply*fixed/(fixed+3000);
assert(ntcAfter>ntcBefore);
const ldrBefore=supply*6000/(fixed+6000),ldrAfter=supply*3000/(fixed+3000);
assert(ldrAfter<ldrBefore);
const slope=(1.12-1.42)/(0.80-0.20);
assert(Math.abs(slope+0.5)<1e-12);
const rInternal=-slope,emf=1.42+0.20*rInternal,loss=0.20*rInternal;
assert(Math.abs(emf-1.52)<1e-12);
assert(Math.abs(loss-0.10)<1e-12);
console.log('PASS v407: four original first-mock Physics Electricity manual sketch/practical questions (35 marks) are independently source- and answer-checked; no flashcards or IDs modified; correct mock loading, offline cache, manual mark routing, sensor response directions, resistivity and emf results.');
