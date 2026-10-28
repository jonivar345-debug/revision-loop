'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ledger=JSON.parse(fs.readFileSync('editorial/task1-v166-legacy-mock-card-map.json','utf8'));
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const legacy=deck.cards.filter(c=>c.active!==false&&c.mock===true&&!c.specRef&&['Physics','Chemistry'].includes(c.subject));
const rows=ledger.records;
assert.equal(ledger.version,'v166');
assert.equal(rows.length,971);
assert.equal(ledger.totals.legacyMockCards,legacy.length);
assert.equal(ledger.totals.physics,311);
assert.equal(ledger.totals.chemistry,660);
assert.equal(ledger.totals.chemistryA2,194);
assert.equal(ledger.totals.blankAnswers,0);
assert.equal(ledger.totals.cardsWithNoSectionCandidate,0);
assert.equal(new Set(rows.map(x=>x.id)).size,rows.length);
const byId=new Map(legacy.map(x=>[x.id,x]));
for(const row of rows){
 const c=byId.get(row.id);assert(c,'missing card '+row.id);
 assert.equal(row.subject,c.subject);assert.equal(row.stage,c.stage);
 assert.equal(row.topic,c.topic);assert.equal(row.courseTopic,c.courseTopic);
 assert.match(row.candidateSpecSection,/^(?:3\.\d+(?:\.\d+)?|7\.2)$/);
 assert(c.front&&c.back,'missing front/back');
 assert(c.accept?.length>0||!Array.isArray(c.accept),'empty explicit accept');
 assert.equal(c.mock,true);assert.equal(c.active,true);
 assert.equal(c.specRef,undefined);
 const expected=(ledger.groupingMaps[c.subject]||{})[c.courseTopic];
 if(expected!==null)assert.equal(row.candidateSpecSection,expected);
}
const reviewed=['phy_graph_weakness_v36_force_distance_vs_time','phy_graph_weakness_v36_iv_axes_resistance'];
assert.deepEqual(ledger.manualContentReviewed.map(x=>x.id),reviewed);
assert.equal(rows.filter(x=>x.requiresIndividualAnswerReview===false).length,2);
assert.equal(ledger.reviewQueue.length,1);
assert.equal(ledger.reviewQueue[0].id,'phy_spectra_photo_v32_below_threshold_graph');
for(const s of ['Physics','Chemistry']){
 const arr=rows.filter(x=>x.subject===s);
 assert.equal(arr.length,ledger.bySubject[s].legacyMockCount);
 assert.equal(arr.filter(x=>x.stage==='A2').length,ledger.bySubject[s].a2StageCount);
}
assert.equal(ledger.signoff.all971CardsIndividuallyAnswerChecked,false);
assert.equal(ledger.signoff.mockContentComplete,false);
assert.equal(ledger.signoff.flashcardDeckModified,false);
console.log('PASS v166: all 971 legacy mock-only science cards have provisional section candidates; two graph cards individually reviewed; no card content changed.');
