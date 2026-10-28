'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const deck = JSON.parse(fs.readFileSync('deck.json', 'utf8'));
const previous = JSON.parse(fs.readFileSync('editorial/task1-v166-legacy-mock-card-map.json', 'utf8'));
const audit = JSON.parse(fs.readFileSync('editorial/task1-v176-mechanics-manual-spec-audit.json', 'utf8'));

assert.equal(audit.version, 'v176');
assert.equal(audit.task1Complete, false);
assert.equal(deck.cards.length, 3345);
assert.equal(deck.cards.filter(c => c.active !== false).length, 3341);
assert.equal(deck.cards.filter(c => c.active !== false && c.mock === true).length, 2379);
assert.equal(audit.reviewCount, 85);
assert.equal(audit.reviewed.length, 85);
assert.equal(new Set(audit.reviewed.map(row => row.id)).size, 85);
assert.equal(audit.previouslyUnreviewedRemaining, 971 - 85);
assert.equal(audit.physicsLegacyRemainingToReview, 311 - 85);
assert.equal(audit.chemistryLegacyStillPending, 660);

const byId = new Map(deck.cards.map(c => [c.id, c]));
const legacyIds = new Set(previous.records.map(c => c.id));
const expectedSections = ['3.4.1.1','3.4.1.2','3.4.1.3','3.4.1.4','3.4.1.5','3.4.1.6','3.4.1.7','3.4.2.1','3.4.2.2'];
assert.deepEqual(Object.keys(audit.bySubsection).sort(), expectedSections);
for (const row of audit.reviewed) {
  const card = byId.get(row.id);
  assert(card, 'Missing audited card: ' + row.id);
  assert(legacyIds.has(row.id), 'Not in original 971 legacy candidates: ' + row.id);
  assert.equal(card.subject, 'Physics');
  assert.equal(card.stage, 'AS');
  assert.equal(card.mock, true);
  assert.equal(card.active, true);
  assert.equal(card.courseTopic, 'Mechanics & materials');
  assert(!card.specRef, 'Historical direct-tag counts should not change in v176');
  assert.equal(card.front, row.front, 'Edited reviewed question without re-audit: ' + row.id);
  assert.equal(card.back, row.back, 'Edited reviewed answer without re-audit: ' + row.id);
  assert(expectedSections.includes(row.aqaSubsection), 'Unexpected AQA subsection: ' + row.id);
}
for (const subsection of expectedSections) {
  assert.equal(audit.reviewed.filter(c => c.aqaSubsection === subsection).length, audit.bySubsection[subsection]);
}
assert.deepEqual(audit.corrections.map(c => c.id), ['phy_impulse', 'phy_hooke']);
assert.equal(byId.get('phy_impulse').back, 'Impulse = Δp. For constant (or mean) force, FΔt = Δp.');
assert.equal(byId.get('phy_hooke').back, 'F = kΔL, valid up to the limit of proportionality.');
assert(byId.get('phy_impulse').accept.includes('impulse=change in momentum'));
assert(byId.get('phy_hooke').accept.includes('f=kx'));
assert.equal(deck.cards.filter(c => c.subject === 'Physics' && c.mock && c.active !== false).length, 730);
assert.equal(deck.cards.filter(c => c.subject === 'Chemistry' && c.mock && c.active !== false).length, 1533);
assert.equal(audit.limitations.noDirectSpecRefAddedToCardMetadata, true);
assert.equal(audit.limitations.nineSubsectionsRepresentedNotFullyCovered, true);
console.log('PASS v176: 85 individually checked Mechanics cards mapped to nine AQA subsections; two wording corrections; 886 legacy science mock cards still pending.');
