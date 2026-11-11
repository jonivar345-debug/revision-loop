'use strict';
/* v446: audit completeness of the 2024 AS Physics Paper 2 Section C source
   technique matrix, never a duplicate of the copyrighted questions/key. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const matrix=JSON.parse(fs.readFileSync('editorial/physics-paper2-mcq-2024-skill-matrix-v446.json','utf8'));
const bank=JSON.parse(fs.readFileSync('physics_as_paper2_guided_v430.json','utf8'));
assert.equal(matrix.assessment,'AQA AS Physics 7407/2 Section C, June 2024');
assert.equal(matrix.claims.sourceQuestionsAudited,30);
assert.equal(matrix.claims.examMarks,30);
assert.equal(matrix.claims.originalQuestionReproduction,false);
assert.equal(matrix.claims.markSchemeKeyReproduced,false);
assert.equal(matrix.claims.cardByCardEquivalenceCertified,false);
assert.equal(matrix.claims.fullPaperIndexed,false);
assert.equal(matrix.questionFamilies.length,30);
const ids=matrix.questionFamilies.map(q=>q.question);
assert.deepEqual(ids,Array.from({length:30},(_,i)=>String(i+5).padStart(2,'0')),'Every original 2024 Section C question 05 to 34 has a single family row');
const unique=new Set();
for(const q of matrix.questionFamilies){
 assert.equal(q.section,'C');
 assert(!unique.has(q.question));unique.add(q.question);
 assert(q.specRef.startsWith('3.'));
 assert(q.skill.length>=12&&q.examTechnique.length>=15);
 assert(q.skill.length<=120&&q.examTechnique.length<=140);
 assert(q.reviewStatus.includes('NOT certified'),'No fake full mark-scheme-to-card certification');
 assert.equal(typeof q.diagramDependent,'boolean');
 if(q.diagramDependent)assert(q.followUp.includes('visual'),'Diagram-heavy techniques require actual visual editorial review');
}
assert.equal(matrix.questionFamilies.filter(q=>q.diagramDependent).length,8);
const subjects=['3.1','3.2','3.3','3.4','3.5'];
for(const prefix of subjects)assert(matrix.questionFamilies.some(q=>q.specRef.startsWith(prefix)),'Missed assessed AS strand '+prefix);
assert(bank.cards.length===190);
assert(matrix.sources.originalQuestionPaper.includes('June%202024%20QP.pdf'));
assert(matrix.sources.officialMarkScheme.includes('June%202024%20MS.pdf'));
const recent=JSON.parse(fs.readFileSync('editorial/physics-paper2-recent-sources-v446.json'));
assert.equal(recent.sourceConfidence['2025'].markScheme,null,'Provisional 2025 remains unverified');
console.log('PASS v446 source-matrix: all 30 2024 Paper 2 MCQ styles, eight diagram-sensitive cases, five strands, verified source references and explicitly unfinished card equivalence');
