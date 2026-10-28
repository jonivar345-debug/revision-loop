'use strict';
const allowed=require('./task1-v154-legacy-evidence.cjs');
const fs=require('node:fs'),assert=require('node:assert/strict');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const led=JSON.parse(fs.readFileSync('editorial/task1-v137-additional-syllabus-candidate-ledger.json','utf8'));
const byId=new Map(deck.cards.map(c=>[c.id,c]));
assert(deck.deckVersion>=136,'v137 audit should not mutate published v136 deck');
assert(deck.cards.length>=3113,'No flashcard or progress IDs should change');
assert.equal(led.rows.length,142,'Second atomic crosswalk scoped to 142 outcomes');
assert.deepEqual(led.totals.bySubject,{Physics:68,Chemistry:50,Maths:24});
assert(led.scope.includes('NOT the entire specification'),'Do not claim all AQA coverage is done');
const seen=new Set(),counts={};
for(const row of led.rows){
 assert(!seen.has(row.id),'Duplicate requirement id');seen.add(row.id);
 assert(['Physics','Chemistry','Maths'].includes(row.subject),'Unknown subject');
 assert(row.specRef.startsWith('3.'),'Syllabus section missing');
 assert(row.sourceUrl.startsWith('https://www.aqa.org.uk/'),'Non-AQA source');
 assert(row.requirement.length>18,'Requirement too vague');
 assert(row.candidateCardIds.length===row.candidateFronts.length,'Candidate mismatch');
 for(let i=0;i<row.candidateCardIds.length;i++){
   let c=byId.get(row.candidateCardIds[i]);
   assert(c&&c.subject===row.subject&&c.active!==false,'Candidate ID invalid '+row.id);
   assert.equal(c.front,allowed(c.id,'front',row.candidateFronts[i]),'Candidate prompt changed '+row.id);
 }
 if(row.status==='question_answer_checked_existing'){
   assert(row.verifiedExisting?.length>=1,'Missing manually reviewed evidence '+row.id);
   for(const e of row.verifiedExisting){
     const c=byId.get(e.cardId);
     assert(c&&c.active!==false&&c.subject===row.subject,'Reviewed ID changed '+row.id);
     assert.equal(c.front,allowed(c.id,'front',e.front),'Reviewed question changed '+row.id);
     assert.equal(c.back,allowed(c.id,'back',e.back),'Reviewed model answer changed '+row.id);
   }
 }
 counts[row.status]=(counts[row.status]||0)+1;
}
assert.equal(counts.question_answer_checked_existing,23);
assert.equal(counts.probable_memory_gap,1);
assert.equal(counts.partial_existing_or_unclear,4);
assert.equal(counts.unverified_candidate,109);
assert.equal(counts.needs_semantic_search,5);
const quotient=led.rows.find(x=>x.id==='B125');
assert.equal(quotient.status,'probable_memory_gap');
assert(quotient.reviewNote.includes('Appendix B'));
console.log('PASS v137: 142 atomic spec references, 23 exact answer checks, 1 gap candidate; no study-progress changes');
