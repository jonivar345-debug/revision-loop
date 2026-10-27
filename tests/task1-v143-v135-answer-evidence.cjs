'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-atomic-spec-first-pass-v135.json','utf8'));
const evidence=JSON.parse(fs.readFileSync('editorial/task1-v143-v135-answer-evidence.json','utf8'));
const byId=new Map(deck.cards.map(c=>[c.id,c]));
const byReq=new Map(audit.requirements.map(r=>[r.id,r]));
assert.equal(deck.deckVersion,142);
assert.equal(deck.cards.length,3144);
assert.equal(deck.cards.filter(c=>c.active!==false).length,3140);
assert.equal(evidence.sourceDeckVersion,142);
assert.equal(evidence.reviewedCount,106);
assert.deepEqual(evidence.bySubject,{Chemistry:71,Physics:35});
assert.deepEqual(evidence.counts,{answer_checked_for_narrow_recall:94,partial_or_application_needs_followup:12});
assert.equal(audit.requirements.length,113);
assert.equal(audit.totals.answer_checked_existing,6);
assert.equal(audit.totals.partially_supported_needs_card,1);
assert(evidence.scope.includes('not exhaustive AQA syllabus'));
const seen=new Set();
for(const item of evidence.reviewed){
 assert(!seen.has(item.requirementId),'Duplicate review ID '+item.requirementId);seen.add(item.requirementId);
 const req=byReq.get(item.requirementId);
 assert(req,'Unknown original spec row '+item.requirementId);
 assert.equal(req.status,'candidate_evidence_unverified');
 for(const k of ['requirement','subject','specRef','sourceUrl'])assert.equal(item[k],req[k],'Wrong source requirement '+item.requirementId);
 assert(['answer_checked_for_narrow_recall','partial_or_application_needs_followup'].includes(item.status));
 assert(item.limitation.length>50,'No qualification of review scope');
 assert(item.support.length>=1,'No answer evidence '+item.requirementId);
 for(const snap of item.support){
  const c=byId.get(snap.id);
  assert(c&&c.active!==false&&c.subject===item.subject,'Missing active card '+snap.id);
  assert.equal(c.front,snap.front,'Question changed '+snap.id);
  assert.equal(c.back,snap.back,'Answer changed '+snap.id);
 }
}
assert.equal(seen.size,106);
assert.deepEqual([...seen].sort(),audit.requirements.filter(r=>r.status==='candidate_evidence_unverified').map(r=>r.id).sort());
assert.deepEqual(evidence.unresolvedIds,evidence.reviewed.filter(r=>r.status!=='answer_checked_for_narrow_recall').map(r=>r.requirementId));
assert.equal(evidence.unresolvedIds.length,12);
assert.equal(evidence.formulaBookletReview.requirementId,'A090');
assert(evidence.formulaBookletReview.suppliedInAqaBooklet===true);
console.log('PASS v143: 106 exact active front/back checks, 94 narrowly supported, 12 partial/application, unchanged v142 deck');
