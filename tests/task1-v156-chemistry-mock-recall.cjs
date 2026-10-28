'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const bank=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v156-chemistry-mock-recall-resolution.json','utf8'));
const previous=JSON.parse(fs.readFileSync('editorial/task1-v155-chemistry-as-organic-mock-crosswalk.json','utf8'));
const app=fs.readFileSync('app.js','utf8');
const cards=new Map(deck.cards.map(c=>[c.id,c]));
assert(deck.deckVersion>=156);
assert.equal(deck.cards.length,3295);
assert.equal(deck.cards.filter(c=>c.active!==false).length,3291);
assert.equal(deck.cards.filter(c=>c.mock===true&&c.active!==false).length,2323);
assert.equal(bank.bankVersion,64);assert.equal(bank.questions.length,1247);
assert.equal(new Set(deck.cards.map(c=>c.id)).size,deck.cards.length);
assert.equal(new Set(bank.questions.map(q=>q.id)).size,bank.questions.length);
const older=deck.cards.filter(c=>!c.id.startsWith('task1_v156_'));
assert.equal(older.length,3293);
assert.equal(older.filter(c=>c.active!==false&&c.mock===true).length,2321);
assert.deepEqual(audit.counts,{reviewed:11,existingRecallCoverage:9,newRecallCards:2,remainingUnmatchedAmongThese11:0,deckCards:3295,activeCards:3291,mockEligibleCards:2323,mockBySubject:{Physics:713,Chemistry:1533,Maths:77},examQuestionsUnchanged:1247});
const unmatched=new Set(previous.checks.filter(c=>c.status==='not_yet_directly_mapped').map(c=>c.id));
assert.equal(unmatched.size,11);
const seen=new Set(),added=[];
for(const check of audit.checks){
 assert(unmatched.has(check.id));assert(!seen.has(check.id));seen.add(check.id);
 assert(check.evidence.length>0);
 for(const ev of check.evidence){
  const c=cards.get(ev.id);
  assert(c&&c.subject==='Chemistry'&&c.active!==false&&c.mock===true);
  assert.equal(c.front,ev.front);assert.equal(c.back,ev.back);
  assert.equal(c.specRef||null,ev.specRef);
  assert.equal(ev.mock,true);assert.equal(ev.active,true);
  if(c.id.startsWith('task1_v156_'))added.push(c);
 }
 if(check.resolution==='new_concise_recall_card')assert(check.evidence.some(x=>x.id.startsWith('task1_v156_')));
 else assert.equal(check.resolution,'already_covered_by_existing_mock_cards');
}
assert.equal(seen.size,11);
assert.deepEqual(added.map(c=>c.id),['task1_v156_001','task1_v156_002']);
const n=s=>s.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
const earlierFronts=new Set(older.filter(c=>c.subject==='Chemistry'&&c.active!==false).map(c=>n(c.front)));
for(const c of added){
 assert.equal(c.subject,'Chemistry');assert.equal(c.stage,'AS');
 assert.equal(c.scope,'mock');assert.equal(c.taught,true);
 assert.equal(c.strictRecall,true);assert.equal(c.kind,'content');
 assert(c.specRef==='3.3.2.3'||c.specRef==='3.3.3.2');
 assert(c.front.length<=110&&c.back.length<=120);
 assert.deepEqual(c.accept,[c.back]);
 assert(!earlierFronts.has(n(c.front)));
 assert(!/[σπ]/.test(c.front+' '+c.back));
}
assert.equal(audit.limitations.isFullAqaSpecAudit,false);
assert.equal(audit.limitations.isWholeMockCoverageCertified,false);
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
console.log('PASS v156: 11 earlier false/partial negatives resolved, nine existing matches plus two short cards; full coverage still unclaimed.');
