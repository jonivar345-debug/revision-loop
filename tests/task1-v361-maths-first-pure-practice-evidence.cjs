'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const report=json('editorial/task1-v361-maths-first-pure-practice-evidence.json');
const old=json('editorial/task1-v334-year1-pure-skill-crosswalk.json');
const app=read('app.js');
assert.equal(report.version,'v361');assert.equal(report.rows.length,14);
assert(report.certification.wholeTask1Complete===false);
assert(report.certification.fullYear1PureAqaLeftColumnCertified===false);
assert.equal(json('deck.json').cards.length,3345);
const byOld=new Map(old.rows.map(x=>[x.id,x]));
const files=["maths_pure_proof_vectors_v190.json","maths_year1_pure_reasoning_v271.json","maths_inequality_sign_reasoning_v335.json","maths_as_graph_transform_sketches_v272.json","maths_year1_pure_targeted_practice_v340.json"];
const byFile=Object.fromEntries(files.map(p=>[p,new Map(json(p).questions.map(x=>[x.id,x]))]));
let linked=0,unique=new Set();
for(const row of report.rows){
 const oldRow=byOld.get(row.skillId);
 assert(oldRow,'Missing original crosswalk skill '+row.skillId);
 assert.equal(row.originalSkill,oldRow.skill);
 assert.equal(row.officialSpecRef,oldRow.specRef);
 assert.equal(row.previousAuditStatus,oldRow.status);
 assert.equal(row.previousLinkedPracticeCount,(oldRow.practiceQuestionEvidence||[]).length);
 assert(row.linkedPractice.length>0);
 for(const item of row.linkedPractice){
  const q=byFile[item.path]?.get(item.id);
  assert(q,'Missing original exam question '+item.id);
  assert.equal(q.subject,'Maths');assert.equal(q.level,'AS');assert.equal(q.mock,true);
  assert(q.marks>=4);assert.equal(item.marks,q.marks);assert.equal(item.prompt,q.prompt);
  assert(app.includes(item.path),'Practice bank must be loaded by website: '+item.path);
  linked++;unique.add(item.id);
 }
}
assert.equal(linked,report.counts.linkedQuestionOccurrences);
assert.equal(unique.size,report.counts.distinctExistingMultiMarkQuestions);
const inequality=report.rows.find(x=>x.skillId==='M11');assert(inequality);
assert.equal(inequality.previousLinkedPracticeCount,0);
assert.equal(inequality.linkedPractice.length,2);
console.log('PASS v361: '+report.rows.length+' difficult Year 1 Pure skills linked to '+unique.size+' actual original multi-mark mock questions; older inequality link gap reconciled.');
