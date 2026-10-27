'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const old=JSON.parse(fs.readFileSync('editorial/task1-atomic-spec-first-pass-v135.json','utf8'));
const evidence=JSON.parse(fs.readFileSync('editorial/task1-v143-v135-106-answer-evidence.json','utf8'));
const byId=new Map(deck.cards.map(x=>[x.id,x]));
const requirements=new Map(old.requirements.map(x=>[x.id,x]));
const pending=old.requirements.filter(x=>x.status==='candidate_evidence_unverified');
assert(deck.deckVersion>=142);
assert(deck.cards.length>=3144);
assert(deck.cards.filter(x=>x.active!==false).length>=3140);
assert.equal(evidence.sourceDeckVersion,142);
assert.equal(evidence.sourceDeckCardCount,3144);
assert.equal(pending.length,106);
assert.equal(evidence.reviewedCount,106);
assert.deepEqual(evidence.bySubject,{Chemistry:71,Physics:35});
assert.deepEqual(evidence.statuses,{answer_checked_for_narrow_recall:90,partially_supported_or_needs_application:16});
assert(evidence.scope.includes('Not whole-syllabus certification'));
assert.equal(evidence.reviewed.length,106);
const seen=new Set();
for(const item of evidence.reviewed){
  assert(!seen.has(item.requirementId),'Repeated requirement '+item.requirementId);
  seen.add(item.requirementId);
  const row=requirements.get(item.requirementId);
  assert(row&&row.status==='candidate_evidence_unverified','Not one of the 106 '+item.requirementId);
  assert.equal(item.subject,row.subject);
  assert.equal(item.specRef,row.specRef);
  assert.equal(item.sourceUrl,row.sourceUrl);
  assert.equal(item.requirement,row.requirement);
  assert(item.status==='answer_checked_for_narrow_recall'||item.status==='partially_supported_or_needs_application');
  assert(item.support.length>0,'Missing actual card evidence '+item.requirementId);
  assert(item.limitation.length>60,'Missing qualification '+item.requirementId);
  for(const snap of item.support){
    const card=byId.get(snap.id);
    assert(card&&card.active!==false&&card.subject===item.subject,'Card missing '+snap.id);
    assert.equal(card.front,snap.front,'Front changed '+snap.id);
    assert.equal(card.back,snap.back,'Answer changed '+snap.id);
  }
}
assert.deepEqual(new Set(pending.map(r=>r.id)),seen);
const partial=evidence.reviewed.filter(x=>x.status==='partially_supported_or_needs_application').map(x=>x.requirementId);
assert.deepEqual(partial,evidence.partialRequirementIds);
console.log('PASS v143: 106 original AQA candidate requirements have exact model-answer snapshots; 90 narrow supported and 16 partial, with no changed card IDs');
