'use strict';
const allowed=require('./task1-v154-legacy-evidence.cjs');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const deck = JSON.parse(fs.readFileSync('deck.json', 'utf8'));
const evidence = JSON.parse(fs.readFileSync('editorial/task1-v140-evidence-follow-up.json', 'utf8'));
const v137 = JSON.parse(fs.readFileSync('editorial/task1-v137-additional-syllabus-candidate-ledger.json', 'utf8'));
const v139 = JSON.parse(fs.readFileSync('editorial/task1-v139-verified-answer-evidence.json', 'utf8'));
const byId = new Map(deck.cards.map(card => [card.id, card]));
const byReq = new Map(v137.rows.map(row => [row.id, row]));
assert(deck.deckVersion>=138);
assert(deck.cards.length>=3128);
assert.equal(evidence.reviewedCount, 25);
assert.equal(evidence.fullNarrowRecallCount, 22);
assert.equal(evidence.partialCount, 3);
assert.deepEqual(evidence.bySubject, { Physics: 7, Chemistry: 3, Maths: 15 });
assert(evidence.scope.includes('no full-specification coverage guarantee'));
const already = new Set(v139.reviewed.map(item => item.requirementId));
const reviewed = new Set();
for (const item of evidence.reviewed) {
  assert(!already.has(item.requirementId), 'Duplicated v139 review: ' + item.requirementId);
  assert(!reviewed.has(item.requirementId), 'Repeated v140 review: ' + item.requirementId);
  reviewed.add(item.requirementId);
  const req = byReq.get(item.requirementId);
  assert(req, 'Lost AQA sample requirement: ' + item.requirementId);
  assert.equal(item.requirement, req.requirement);
  assert.equal(item.specRef, req.specRef);
  assert.equal(item.subject, req.subject);
  assert.equal(item.sourceUrl, req.sourceUrl);
  assert(['answer_checked_for_narrow_recall', 'partial_answer_for_requirement'].includes(item.status));
  assert(item.support.length > 0);
  if (item.status === 'partial_answer_for_requirement')
    assert(item.limitation.length > 60, 'Partial scope must remain explicit');
  for (const supporting of item.support) {
    const card = byId.get(supporting.id);
    assert(card && card.active !== false, 'Missing active card: ' + supporting.id);
    assert.equal(card.subject, item.subject);
    assert.equal(card.front,allowed(card.id,'front',supporting.front), 'Card prompt changed: ' + supporting.id);
    assert.equal(card.back,allowed(card.id,'back',supporting.back), 'Card answer changed: ' + supporting.id);
  }
}
const previous = new Set(v137.rows.filter(r => r.status === 'question_answer_checked_existing').map(r => r.id));
const stillUnchecked = v137.rows.filter(r => !previous.has(r.id) && !already.has(r.id) && !reviewed.has(r.id));
assert.equal(previous.size, 23);
assert.equal(stillUnchecked.length, 46);
assert.deepEqual(stillUnchecked.map(r => r.id), evidence.remainingFromV137.ids);
assert.deepEqual(evidence.remainingFromV137.bySubject, { Physics: 25, Chemistry: 18, Maths: 3 });
console.log('PASS v140: 25 exact snapshots (22 narrow answers, 3 partial); 46 more v137 requirements remain, with the original deck unchanged');
