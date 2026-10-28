'use strict';
const allowed=require('./task1-v154-legacy-evidence.cjs');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const deck = JSON.parse(fs.readFileSync('deck.json','utf8'));
const ledger = JSON.parse(fs.readFileSync('editorial/task1-atomic-spec-first-pass-v135.json','utf8'));
const cards = new Map(deck.cards.map(c => [c.id,c]));
assert(deck.deckVersion>=134,'v135 audits v134; it does not alter any live cards');
assert(deck.cards.length>=3008,'No cards may be lost during this editorial audit');
assert(deck.cards.filter(c=>c.active!==false).length>=3004);
assert.equal(ledger.requirements.length,113,'First-pass scope must remain explicitly quantified');
assert.equal(ledger.totals.bySubject.Physics,37);
assert.equal(ledger.totals.bySubject.Chemistry,76);
assert(ledger.scope.includes('NOT the entire'),'Scope must disclaim complete spec certification');
const ids = new Set(), counted = {};
for(const e of ledger.requirements) {
  assert(!ids.has(e.id),'Repeated bullet id '+e.id); ids.add(e.id);
  assert(['Physics','Chemistry'].includes(e.subject),'Unexpected subject '+e.id);
  assert(e.stage==='AS','Only Year 1 content in first atomic pass '+e.id);
  assert(e.specRef.startsWith('3.') && e.specRef.split('.').slice(1).every(x=>/^[0-9]+$/.test(x)),'Invalid section id '+e.id);
  assert(e.sourceUrl.startsWith('https://www.aqa.org.uk/'),'Official source missing '+e.id);
  assert(e.requirement.length>=18,'Requirement too vague '+e.id);
  assert(e.candidateCardIds.length===e.candidatePrompts.length,'Mismatched prompts '+e.id);
  if(e.status==='candidate_evidence_unverified')assert(e.candidateCardIds.length>0,'Search candidate lost '+e.id);
  if(e.status==='answer_checked_existing'||e.status==='partially_supported_needs_card')
    assert(e.answerChecked?.length===e.candidateCardIds.length,'Answer review missing '+e.id);
  for(let i=0;i<e.candidateCardIds.length;i++) {
    const c=cards.get(e.candidateCardIds[i]);
    assert(c,'Referenced card no longer exists '+e.id);
    assert.equal(c.subject,e.subject,'Card subject does not match '+e.id);
    assert(c.active!==false,'Inactive card used for candidate '+e.id);
    assert.equal(c.front,allowed(c.id,'front',e.candidatePrompts[i]),'Question changed since audit '+e.id);
    if(e.answerChecked) {
      assert.equal(c.front,allowed(c.id,'front',e.answerChecked[i].front),'Reviewed question changed '+e.id);
      assert.equal(c.back,allowed(c.id,'back',e.answerChecked[i].back),'Reviewed answer changed '+e.id);
    }
  }
  counted[e.status]=(counted[e.status]||0)+1;
}
assert.equal(counted.answer_checked_existing,6);
assert.equal(counted.partially_supported_needs_card,1);
assert.equal(counted.candidate_evidence_unverified,106);
assert.equal(counted.manual_search_required||0,0);
for(const e of ledger.nextPrecisionCandidates) {
  assert(e.front.length<=150&&e.back.length<=180,'Suggested card too long');
  assert(e.status==='candidate_addition_not_released','Do not label draft as live');
}
const newton=ledger.requirements.find(e=>e.requirement==='Apply Newton second law force and acceleration');
const projectile=ledger.requirements.find(e=>e.requirement==='Treat independent vertical and horizontal projectile motion');
assert.equal(newton.specRef,'3.4.1.5');
assert.equal(projectile.specRef,'3.4.1.4');
console.log('v135 atomic coverage audit: 113 narrow outcomes, 7 manual answer reviews, no deck or progress edits');
