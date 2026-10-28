'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const deck=require('./task1-v162-historical-snapshot.cjs')(JSON.parse(fs.readFileSync('deck.json','utf8')));
const bank=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v156-chemistry-mock-recall-resolution.json','utf8'));
const previous=JSON.parse(fs.readFileSync('editorial/task1-v155-chemistry-as-organic-mock-crosswalk.json','utf8'));
const app=fs.readFileSync('app.js','utf8');
const cards=new Map(deck.cards.map(c=>[c.id,c]));
const v156Cards=deck.cards.filter(c=>!c.id.startsWith('task1_v157_')&&!c.id.startsWith('task1_v158_')&&!c.id.startsWith('task1_v159_')&&!c.id.startsWith('task1_v160_'));
assert(deck.deckVersion>=156);
assert.equal(v156Cards.length,3295);
assert.equal(v156Cards.filter(c=>c.active!==false).length,3291);
assert.equal(v156Cards.filter(c=>c.mock===true&&c.active!==false).length,2323);
assert(bank.bankVersion>=64);assert.equal(bank.questions.filter(q=>!q.id.startsWith('mock_v157_')&&!q.id.startsWith('mock_v158_')&&!q.id.startsWith('mock_v159_')&&!q.id.startsWith('mock_v160_')).length,1247);
assert.equal(new Set(deck.cards.map(c=>c.id)).size,deck.cards.length);
assert.equal(new Set(bank.questions.map(q=>q.id)).size,bank.questions.length);
const older=v156Cards.filter(c=>!c.id.startsWith('task1_v156_'));
assert.equal(older.length,3293);
assert.equal(older.filter(c=>c.active!==false&&c.mock===true).length,2321);
assert.deepEqual(audit.counts,{reviewed:11,existingRecallCoverage:9,newlyCoveredFrom11:1,partiallyCoveredAmong11:1,additionalPollutionRecallCards:1,newRecallCardsTotal:2,deckCards:3295,activeCards:3291,mockEligibleCards:2323,mockBySubject:{Physics:713,Chemistry:1533,Maths:77},examQuestionsUnchanged:1247});
const unmatched=new Set(previous.checks.filter(c=>c.status==='not_yet_directly_mapped').map(c=>c.id));
assert.equal(unmatched.size,11);
const seen=new Set(),counts={};
for(const check of audit.checks){
 assert(unmatched.has(check.id));assert(!seen.has(check.id));seen.add(check.id);
 counts[check.resolution]=(counts[check.resolution]||0)+1;
 assert(check.evidence.length>0);
 for(const ev of check.evidence){
  const c=cards.get(ev.id);
  assert(c&&c.subject==='Chemistry'&&c.active!==false&&c.mock===true);
  assert.equal(c.front,ev.front);assert.equal(c.back,ev.back);
  assert.equal(c.specRef||null,ev.specRef);
  assert.equal(ev.mock,true);assert.equal(ev.active,true);
 }
 if(check.resolution==='new_concise_recall_card')assert(check.evidence.some(x=>x.id==='task1_v156_001'));
 if(check.resolution==='partially_covered_existing_mock_card')assert(check.note&&check.id==='ASORG-155-038');
}
assert.equal(seen.size,11);
assert.deepEqual(counts,{already_covered_by_existing_mock_cards:9,new_concise_recall_card:1,partially_covered_existing_mock_card:1});
const added=deck.cards.filter(c=>c.id.startsWith('task1_v156_'));
assert.deepEqual(added.map(c=>c.id),['task1_v156_001','task1_v156_002']);
assert.equal(audit.additionalCard.id,'task1_v156_002');
assert.equal(audit.additionalCard.front,added[1].front);
assert.equal(audit.additionalCard.back,added[1].back);
const n=s=>s.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
const earlierFronts=new Set(older.filter(c=>c.subject==='Chemistry'&&c.active!==false).map(c=>n(c.front)));
for(const c of added){
 assert.equal(c.subject,'Chemistry');assert.equal(c.stage,'AS');
 assert.equal(c.scope,'mock');assert.equal(c.taught,true);
 assert.equal(c.strictRecall,true);assert.equal(c.kind,'content');
 assert.equal(c.specRef,'3.3.2.3');
 assert(c.front.length<=110&&c.back.length<=120);
 assert.deepEqual(c.accept,[c.back]);
 assert(!earlierFronts.has(n(c.front)));
 assert(!/[σπ]/.test(c.front+' '+c.back));
}
assert.equal(audit.limitations.isFullAqaSpecAudit,false);
assert.equal(audit.limitations.isWholeMockCoverageCertified,false);
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
console.log('PASS v156: 11 previously unmatched organic checks audited; nine existing matches, one new, one partial; two short mock cards and stable history.');
