'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const sample=JSON.parse(fs.readFileSync('editorial/task1-v137-additional-syllabus-candidate-ledger.json','utf8'));
const v139=JSON.parse(fs.readFileSync('editorial/task1-v139-verified-answer-evidence.json','utf8'));
const v140=JSON.parse(fs.readFileSync('editorial/task1-v140-evidence-follow-up.json','utf8'));
const review=JSON.parse(fs.readFileSync('editorial/task1-v141-full-v137-answer-review.json','utf8'));
const statuses=new Set(['answer_checked_for_narrow_recall','partial_answer_needs_targeted_follow_up','no_direct_recall_card_found']);
const cards=new Map(deck.cards.map(c=>[c.id,c]));
const requirements=new Map(sample.rows.map(r=>[r.id,r]));
assert(deck.deckVersion>=138);
assert(deck.cards.length>=3128);
assert.equal(review.sourceDeckVersion,138);
assert.equal(review.reviewed.length,46);
assert.deepEqual(review.bySubject,{Physics:25,Chemistry:18,Maths:3});
assert.deepEqual(review.counts,{answer_checked_for_narrow_recall:33,partial_answer_needs_targeted_follow_up:12,no_direct_recall_card_found:1});
assert(review.scope.includes('NOT a full syllabus'));
const checked=new Set(sample.rows.filter(r=>r.status==='question_answer_checked_existing').map(r=>r.id));
for(const item of [...v139.reviewed,...v140.reviewed]) {
 assert(!checked.has(item.requirementId),'Duplicate prior evidence '+item.requirementId);
 checked.add(item.requirementId);
}
for(const item of review.reviewed){
 assert(!checked.has(item.requirementId),'Duplicate audit '+item.requirementId);
 checked.add(item.requirementId);
 const target=requirements.get(item.requirementId);
 assert(target,'Missing v137 requirement '+item.requirementId);
 assert.equal(item.subject,target.subject);
 assert.equal(item.specRef,target.specRef);
 assert.equal(item.sourceUrl,target.sourceUrl);
 assert.equal(item.requirement,target.requirement);
 assert(statuses.has(item.status));
 if(item.status==='no_direct_recall_card_found')assert.equal(item.support.length,0);
 else assert(item.support.length>0);
 if(item.status!=='answer_checked_for_narrow_recall')assert(item.limitation.length>50);
 for(const evidence of item.support){
  const card=cards.get(evidence.id);
  assert(card&&card.active!==false,'Supporting card missing '+evidence.id);
  assert.equal(card.subject,item.subject);
  assert.equal(card.front,evidence.front,'Question changed '+evidence.id);
  assert.equal(card.back,evidence.back,'Answer changed '+evidence.id);
 }
}
assert.equal(checked.size,142,'v137 sample not reconciled');
assert.equal(sample.rows.length,142);
assert.equal(review.remainingInV137Sample,0);
assert.deepEqual(review.remainingIncompleteOrMissingHere,
 review.reviewed.filter(item=>item.status!=='answer_checked_for_narrow_recall').map(item=>item.requirementId));
console.log('PASS v141: all 142 sampled v137 items triaged; 46 new exact answer reviews, 13 unresolved narrow items, original card IDs stable');
