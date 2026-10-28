'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const deck=require('./task1-v162-historical-snapshot.cjs')(JSON.parse(fs.readFileSync('deck.json','utf8')));
const bank=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v158-physics-electricity-mock-audit.json','utf8'));
const v158Cards=deck.cards.filter(c=>!c.id.startsWith('task1_v159_')&&!c.id.startsWith('task1_v160_'));
const v158Q=bank.questions.filter(q=>!q.id.startsWith('mock_v159_')&&!q.id.startsWith('mock_v160_'));
assert(deck.deckVersion>=158);assert(bank.bankVersion>=66);
assert.equal(v158Cards.length,3302);assert.equal(v158Cards.filter(c=>c.active!==false).length,3298);
assert.equal(v158Cards.filter(c=>c.active!==false&&c.mock===true).length,2330);
assert.equal(v158Q.length,1253);
const olderCards=deck.cards.filter(c=>!c.id.startsWith('task1_v158_')&&!c.id.startsWith('task1_v159_')&&!c.id.startsWith('task1_v160_'));
const olderQ=bank.questions.filter(q=>!q.id.startsWith('mock_v158_')&&!q.id.startsWith('mock_v159_')&&!q.id.startsWith('mock_v160_'));
assert.equal(olderCards.length,3299);assert.equal(olderQ.length,1250);
assert.equal(new Set(deck.cards.map(c=>c.id)).size,deck.cards.length);
assert.equal(new Set(bank.questions.map(q=>q.id)).size,bank.questions.length);
const eligible=v158Cards.filter(c=>c.active!==false&&c.mock===true);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,eligible.filter(c=>c.subject===s).length])),{Physics:720,Chemistry:1533,Maths:77});
const added=deck.cards.filter(c=>c.id.startsWith('task1_v158_'));
assert.deepEqual(added.map(c=>c.id),['task1_v158_001','task1_v158_002','task1_v158_003']);
const key=s=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
const existing=new Set(olderCards.filter(c=>c.subject==='Physics'&&c.active!==false).map(c=>key(c.front)));
for(const c of added){
 assert.equal(c.subject,'Physics');assert.equal(c.stage,'AS');
 assert.equal(c.active,true);assert.equal(c.mock,true);assert.equal(c.taught,true);
 assert.equal(c.scope,'mock');assert.equal(c.strictRecall,true);
 assert(c.specRef==='3.5.1.4'||c.specRef==='3.5.1.6');
 assert(c.front.length<=120&&c.back.length<=130);
 assert.deepEqual(c.accept,[c.back]);assert(!existing.has(key(c.front)));
}
const addedQ=bank.questions.filter(q=>q.id.startsWith('mock_v158_'));
assert.deepEqual(addedQ.map(q=>q.id),['mock_v158_01','mock_v158_02','mock_v158_03']);
assert.equal(addedQ.reduce((s,q)=>s+q.marks,0),19);
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
const cm=new Map(deck.cards.map(c=>[c.id,c])),qm=new Map(bank.questions.map(q=>[q.id,q]));
assert.equal(audit.rows.length,33);assert.equal(audit.counts.newCards,3);
assert.equal(audit.counts.newQuestions,3);assert.equal(audit.counts.newMarks,19);
assert.equal(audit.limits.completePhysicsSpecificationCertified,false);
assert.equal(audit.limits.studentMasteryCertified,false);
const seen=new Set();
for(const row of audit.rows){
 assert(!seen.has(row.id));seen.add(row.id);assert(/^3\.5\.1\.[1-6]$/.test(row.specRef));
 const c=cm.get(row.card.id);assert(c&&c.active!==false&&c.mock===true&&c.subject==='Physics');
 assert.equal(c.front,row.card.front);assert.equal(c.back,row.card.back);
 assert.equal(c.specRef||null,row.card.specRef);
 if(row.question){const q=qm.get(row.question.id);assert(q&&q.mock&&q.subject==='Physics');assert.equal(q.prompt,row.question.prompt);assert.equal(q.marks,row.question.marks);assert.deepEqual(q.markPoints,row.question.markPoints);}
}
const app=fs.readFileSync('app.js','utf8');
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
console.log('PASS v158: 33 Electricity evidence checks, three concise cell/EMF cards, three original exam questions (19 marks), old IDs preserved.');
