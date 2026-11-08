'use strict';
// v418: correcting official AQA 7357 topic metadata must not disable v382
// source-fingerprinted manual marking for any of the six legacy maths tasks.
const assert=require('node:assert/strict'),fs=require('node:fs');
const json=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const app=fs.readFileSync('app.js','utf8');
const refs={
 task1_v190_maths_001:'3.2',task1_v190_maths_002:'3.2',
 task1_v190_maths_003:'3.11',task1_v190_maths_004:'3.11',
 task1_v209_maths_003:'3.11',task1_v209_maths_004:'3.11'
};
const qs=[...json('maths_pure_proof_vectors_v190.json').questions,
 ...json('maths_pure_proof_vector_applications_v209.json').questions]
 .filter(q=>Object.hasOwn(refs,q.id));
assert.equal(qs.length,6);
const start=app.indexOf('const V382_MATHS_WORKED_MANUAL=Object.freeze(');
const stop=app.indexOf('// v383:',start);
assert(start>0&&stop>start,'Source-identity guard moved without updating test');
const guard=app.slice(start,stop);
const apply=new Function(guard+'\nreturn applyV382MathsWorkedExamManualReview;')();
for(const q of qs){
 assert.equal(q.specRef,refs[q.id]);
 assert(!q.manualWorkingReview&&!q.manualDiagramReview,
  'Check true guard baseline, not a pre-marked question: '+q.id);
}
apply(qs);
for(const q of qs){
 assert.equal(q.specRef,refs[q.id]);
 assert.equal(q.manualWorkingReview,true,'A correct AQA metadata update disabled v382 review '+q.id);
 assert.equal(q.v382ReviewRequired,true,'Source-locked marker no longer recognises '+q.id);
 assert.equal(q.marks,q.markPoints.length);
}
// A tampered prompt or model must still fail the exact-source guard.
// No fallback can be mistaken for v382 source-level validation.
for(const source of qs){
 const changedPrompt={...source,manualWorkingReview:false,v382ReviewRequired:false,
  prompt:source.prompt+' INJECTED WRONG SOURCE'};
 const changedAnswer={...source,manualWorkingReview:false,v382ReviewRequired:false,
  modelAnswer:source.modelAnswer+' INJECTED WRONG ANSWER'};
 apply([changedPrompt,changedAnswer]);
 assert.notEqual(changedPrompt.v382ReviewRequired,true,
  'v382 accepted changed prompt '+source.id);
 assert.notEqual(changedAnswer.v382ReviewRequired,true,
  'v382 accepted changed model answer '+source.id);
}
console.log('PASS v418 v382/metadata integration: all six original Year 1 Pure Proof/Vectors source-locked manual-review guards remain operative with correct AQA references, and 12 mutated prompt/answer controls are rejected.');
