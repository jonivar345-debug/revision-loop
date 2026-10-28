'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const bank=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v159-waves-mock-audit.json','utf8'));
assert.equal(deck.deckVersion,159);assert.equal(bank.bankVersion,67);
assert.equal(deck.cards.length,3306);
assert.equal(deck.cards.filter(c=>c.active!==false).length,3302);
const eligible=deck.cards.filter(c=>c.active!==false&&c.mock===true);
assert.equal(eligible.length,2334);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,eligible.filter(c=>c.subject===s).length])),{Physics:724,Chemistry:1533,Maths:77});
assert.equal(bank.questions.length,1256);
assert.equal(new Set(deck.cards.map(c=>c.id)).size,deck.cards.length);
assert.equal(new Set(bank.questions.map(q=>q.id)).size,bank.questions.length);
const olderCards=deck.cards.filter(c=>!c.id.startsWith('task1_v159_'));
const olderQ=bank.questions.filter(q=>!q.id.startsWith('mock_v159_'));
assert.equal(olderCards.length,3302);
assert.equal(olderQ.length,1253);
const added=deck.cards.filter(c=>c.id.startsWith('task1_v159_'));
assert.deepEqual(added.map(c=>c.id),['task1_v159_001','task1_v159_002','task1_v159_003','task1_v159_004']);
const frontKey=s=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
const oldFronts=new Set(olderCards.filter(c=>c.subject==='Physics'&&c.active!==false).map(c=>frontKey(c.front)));
for(const c of added){
 assert.equal(c.subject,'Physics');assert.equal(c.stage,'AS');assert.equal(c.active,true);
 assert.equal(c.taught,true);assert.equal(c.mock,true);assert.equal(c.scope,'mock');
 assert.equal(c.kind,'content');assert.equal(c.strictRecall,true);
 assert(/^3\.3\./.test(c.specRef));
 assert(c.front.length<=125&&c.back.length<=130);
 assert.deepEqual(c.accept,[c.back]);assert(!oldFronts.has(frontKey(c.front)));
}
const addedQ=bank.questions.filter(q=>q.id.startsWith('mock_v159_'));
assert.deepEqual(addedQ.map(q=>q.id),['mock_v159_01','mock_v159_02','mock_v159_03']);
assert.equal(addedQ.reduce((n,q)=>n+q.marks,0),20);
for(const q of addedQ){
 assert.equal(q.subject,'Physics');assert.equal(q.level,'AS');assert.equal(q.mock,true);
 assert.equal(q.year,'Practice');assert.equal(q.sourceVerified,false);
 assert.equal(q.verificationLevel,'original-exam-style');
 assert.equal(q.standalone,true);assert.equal(q.requiresWorking,true);
 assert.equal(q.markPoints.length,q.marks);
 assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 assert.equal(q.modelAnswer,q.markPoints.join(' '));
 assert(!q.qpUrl&&!q.msUrl);
}
assert.equal(audit.rows.length,45);assert.equal(audit.counts.newCards,4);
assert.equal(audit.counts.newQuestions,3);assert.equal(audit.counts.newMarks,20);
assert.equal(audit.limitations.completePhysicsSpecificationCertified,false);
assert.equal(audit.limitations.studentMasteryCertified,false);
const cm=new Map(deck.cards.map(c=>[c.id,c])),qm=new Map(bank.questions.map(q=>[q.id,q]));
const seen=new Set();
for(const row of audit.rows){
 assert(!seen.has(row.id));seen.add(row.id);assert(/^3\.3\./.test(row.specRef));
 const c=cm.get(row.card.id);assert(c&&c.subject==='Physics'&&c.mock===true&&c.active!==false);
 assert.equal(c.front,row.card.front);assert.equal(c.back,row.card.back);
 assert.equal(c.specRef||null,row.card.specRef);
 if(row.question){
  const q=qm.get(row.question.id);
  assert(q&&q.subject==='Physics'&&q.mock===true);
  assert.equal(q.prompt,row.question.prompt);assert.equal(q.marks,row.question.marks);
  assert.deepEqual(q.markPoints,row.question.markPoints);
 }
}
const app=fs.readFileSync('app.js','utf8');
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
console.log('PASS v159: 45 Waves evidence checks, four concise new mock recall cards, three original exam questions worth 20 marks; saved progress preserved.');
