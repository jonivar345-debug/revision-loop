'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const bank=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v155-mock-scope-recall.json','utf8'));
const cross=JSON.parse(fs.readFileSync('editorial/task1-v155-chemistry-as-organic-mock-crosswalk.json','utf8'));
const app=fs.readFileSync('app.js','utf8');
assert(deck.deckVersion>=155);
const v155Cards=deck.cards.filter(c=>!c.id.startsWith('task1_v156_')&&!c.id.startsWith('task1_v157_')&&!c.id.startsWith('task1_v158_')&&!c.id.startsWith('task1_v159_')&&!c.id.startsWith('task1_v160_'));
assert.equal(v155Cards.length,3293);
assert.equal(v155Cards.filter(c=>c.active!==false).length,3289);
assert.equal(v155Cards.filter(c=>c.active!==false&&c.mock===true).length,2321);
assert(bank.bankVersion>=64);
assert.equal(bank.questions.filter(q=>!q.id.startsWith('mock_v157_')&&!q.id.startsWith('mock_v158_')&&!q.id.startsWith('mock_v159_')&&!q.id.startsWith('mock_v160_')).length,1247);
assert.equal(audit.baseline.cards,3280);
assert.equal(audit.baseline.mockEligible,2343);
assert.deepEqual(audit.updated.bySubject,{Physics:713,Chemistry:1531,Maths:77});
assert.equal(audit.changes.addedCards.length,13);
assert.equal(audit.changes.removedFromMock.length,35);
assert.equal(audit.policy.fullSpecCertification,false);
assert.equal(audit.policy.noCardIdsRemoved,true);
assert.equal(audit.policy.allAddedCardsOneFact,true);
assert.equal(new Set(deck.cards.map(c=>c.id)).size,deck.cards.length);
assert.equal(new Set(bank.questions.map(q=>q.id)).size,bank.questions.length);
const byId=new Map(deck.cards.map(c=>[c.id,c]));
const excluded=new Set();
for(const ch of audit.changes.removedFromMock){
 const card=byId.get(ch.id);
 assert(card&&card.active!==false,'Card removed, not only unmarked: '+ch.id);
 assert.equal(card.mock,false);assert.equal(ch.mockBefore,true);assert.equal(ch.mockAfter,false);
 assert.equal(card.front,ch.front);assert.equal(card.specRef||null,ch.specRef);
 assert.equal(card.subject,ch.subject);
 assert(!excluded.has(ch.id),'Duplicate scope exclusion: '+ch.id);excluded.add(ch.id);
}
assert.equal(audit.changes.removedFromMock.filter(x=>x.subject==='Physics').length,18);
assert.equal(audit.changes.removedFromMock.filter(x=>x.subject==='Chemistry').length,8);
assert.equal(audit.changes.removedFromMock.filter(x=>x.subject==='Maths').length,9);
for(const [i,rec] of audit.changes.addedCards.entries()){
 const c=byId.get(rec.id);
 assert(c);
 assert.equal(c.id,'task1_v155_'+String(i+1).padStart(3,'0'));
 assert.equal(c.front,rec.front);assert.equal(c.back,rec.back);
 assert.equal(c.subject,rec.subject);assert.equal(c.specRef,rec.specRef);
 assert.equal(c.active,true);assert.equal(c.mock,true);assert.equal(c.taught,true);
 assert.equal(c.scope,'mock');assert.equal(c.stage,'AS');assert.equal(c.strictRecall,true);
 assert(c.front.length<=110&&c.back.length<=120);
 assert.deepEqual(c.accept,[c.back]);
}
assert.equal(v155Cards.filter(c=>!c.id.startsWith('task1_v155_')).length,3280);
const historicalMock=v155Cards.filter(c=>c.active!==false&&!c.id.startsWith('task1_v155_')&&(c.mock===true||excluded.has(c.id)));
assert.equal(historicalMock.length,2343);
const badChem=deck.cards.filter(c=>c.subject==='Chemistry'&&c.active!==false&&(/\b(?:sigma|pi)\s+(?:bond|electron|orbital)s?\b/i.test(c.front+' '+c.back)||/π|σ/.test(c.front+' '+c.back)));
assert.deepEqual(badChem.map(c=>c.id),[],'Optional orbital-bond terminology should not be in Chemistry flashcards');
assert.equal(cross.count,67);
assert.equal(cross.checks.length,67);
assert.equal(cross.fullSpecCoverageCertified,false);
const statuses=cross.checks.reduce((a,x)=>(a[x.status]=(a[x.status]||0)+1,a),{});
assert.deepEqual(statuses,cross.statusCounts);
assert.equal(statuses.direct_matching_recall_prompt,56);
assert.equal(statuses.not_yet_directly_mapped,11);
for(const row of cross.checks){
 assert(/^3\.3\.[2345]\./.test(row.specRef));
 assert(row.requirement&&row.topic);
 for(const ev of row.evidence){
  const c=byId.get(ev.id);
  assert(c&&c.subject==='Chemistry'&&c.mock===true&&c.active!==false,'Not in mock pool: '+ev.id);
  assert.equal(c.front,ev.front);assert.equal(c.back,ev.back);assert.equal(c.specRef||null,ev.specRef);
 }
}
const physicsA2=deck.cards.filter(c=>c.subject==='Physics'&&c.active!==false&&c.mock===true&&/^3\.6\./.test(c.specRef||''));
assert.deepEqual(physicsA2.map(c=>c.id),[],'Physics Year 2 should not be included by explicit A2 spec tags');
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
console.log('PASS v155: 35 syllabus scope corrections, 13 single-fact cards, 67 Year 1 organic recall checks; progress IDs intact.');
