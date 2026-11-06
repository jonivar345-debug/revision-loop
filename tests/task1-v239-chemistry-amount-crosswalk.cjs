'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const audit=JSON.parse(fs.readFileSync('editorial/task1-v239-chemistry-amount-spec-crosswalk.json','utf8'));
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
assert.equal(audit.version,'v239');
assert.equal(audit.requirementCount,31);
assert.equal(audit.requirements.length,31);
assert.equal(deck.cards.length,3345);
const seen=new Set();
for(const r of audit.requirements){
 assert(/^3\.1\.2\.[1-5]$/.test(r.ref));
 assert(r.coreEvidenceIds.length>0 || r.reviewStatus==='gap_no_direct_card','Missing evidence must be an explicit gap');
 assert(['recall_evidenced','application_unverified','gap_no_direct_card'].includes(r.reviewStatus));
 for(const id of r.coreEvidenceIds){
  const c=deck.cards.find(c=>c.id===id);
  assert(c&&c.subject==='Chemistry'&&c.stage==='AS'&&c.mock===true&&c.active!==false,'Invalid core evidence '+id);
  seen.add(id);
 }
}
assert.equal(seen.size,audit.uniqueEvidenceCoreCount);
assert.equal(audit.requirements.filter(r=>r.reviewStatus==='gap_no_direct_card').length,2);
assert.equal(audit.requirementRowsWithoutDirectEvidence,2);
const inv=audit.coreTopicInventory;
for(const [topic,count] of Object.entries(inv)){
 if(topic==='total')continue;
 assert.equal(deck.cards.filter(c=>c.subject==='Chemistry'&&c.stage==='AS'&&c.mock===true&&c.active!==false&&c.topic===topic).length,count);
}
assert.equal(inv.total,Object.entries(inv).filter(([k])=>k!=='total').reduce((n,[,v])=>n+v,0));
assert(audit.requirements.some(r=>r.assessablePoint.includes('unfamiliar')));
assert(audit.examBoundaryNotes.some(s=>s.includes('does not require recall')));
for(const [name,value] of Object.entries(audit.completionGates))
 assert.equal(value,name==='requirementsCrosswalkRecorded','Do not declare unverified mock completion: '+name);
console.log('PASS v239: 31 Amount of Substance specification point records, '+seen.size+' distinct existing AS/mock core evidence cards, application work explicitly not certified.');
