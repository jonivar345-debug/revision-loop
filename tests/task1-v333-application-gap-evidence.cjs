'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const j=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const core=j('deck.json').cards,source=new Map(core.map(c=>[c.id,c]));
const v332=j('editorial/task1-v332-measurements-rates-kp-crosswalk.json');
const evidence=j('editorial/task1-v333-six-partial-skills-practice-evidence.json');
const oldCards=j('physics_measurements_applications_v248.json').cards;
const oldQs=j('chemistry_rates_rp7_kp_v210.json').questions;
const newQs=j('science_application_gaps_v333.json').questions;
const review=new Map([...oldCards,...oldQs,...newQs].map(q=>[q.id,q]));
assert.equal(new Set([...oldCards,...oldQs,...newQs].map(q=>q.id)).size,oldCards.length+oldQs.length+newQs.length);
assert.equal(evidence.rows.length,6);
assert.deepEqual(evidence.rows.map(x=>x.id),['P24','C10','C14','C22','K07','K12']);
for(const r of evidence.rows){
 const spec=v332.rows.find(x=>x.id===r.id);
 assert(spec,'Missing mapped evidence requirement '+r.id);
 assert.equal(spec.status,'partial_application','Do not certify mastery just from a question '+r.id);
 assert.equal(spec.subject,r.subject);
 assert.equal(r.independentlyExaminerMarked,false);
 assert.equal(r.applicationAvailability,'sample practice available; manual work required');
 assert(r.newPracticeIds.length>=1);
 for(const cid of r.recallIds){
  const c=source.get(cid);
  assert(c&&c.mock===true&&c.subject===r.subject,'Existing core recall missing: '+cid);
 }
 for(const pid of [...r.samplePracticeIds,...r.newPracticeIds]){
  const q=review.get(pid);
  assert(q&&q.mock===true&&q.subject===r.subject,'Practice item missing or not school-mock eligible: '+pid);
 }
 for(const pid of r.newPracticeIds){
  const q=newQs.find(x=>x.id===pid);
  assert(q&&q.manualWorkingReview===true&&q.requiresWorking===true,'New numerical/practical answer must be manually graded: '+pid);
 }
}
assert.equal(newQs.length,5);
console.log('PASS v333: all 6 v332 unsigned application skills linked to real previous and newly written Physics/Chemistry practice; no skill signed off merely by question presence.');
