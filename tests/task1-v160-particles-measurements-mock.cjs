'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const deck=require('./task1-v162-historical-snapshot.cjs')(JSON.parse(fs.readFileSync('deck.json','utf8')));
const bank=require('./task1-v163-historical-bank.cjs')(JSON.parse(fs.readFileSync('exam_questions.json','utf8')));
const particle=JSON.parse(fs.readFileSync('editorial/task1-v160-particles-mock-audit.json','utf8'));
const measure=JSON.parse(fs.readFileSync('editorial/task1-v160-measurements-mock-audit.json','utf8'));
const reviewedExpected=require('./task1-v154-legacy-evidence.cjs');
assert.equal(deck.deckVersion,160);assert.equal(bank.bankVersion,68);
assert.equal(deck.cards.length,3312);assert.equal(deck.cards.filter(c=>c.active!==false).length,3308);
const eligible=deck.cards.filter(c=>c.active!==false&&c.mock===true);
assert.equal(eligible.length,2340);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,eligible.filter(c=>c.subject===s).length])),{Physics:730,Chemistry:1533,Maths:77});
assert.equal(bank.questions.length,1260);
assert.equal(new Set(deck.cards.map(c=>c.id)).size,deck.cards.length);
assert.equal(new Set(bank.questions.map(q=>q.id)).size,bank.questions.length);
const earlierCards=deck.cards.filter(c=>!c.id.startsWith('task1_v160_'));
const earlierQuestions=bank.questions.filter(q=>!q.id.startsWith('mock_v160_'));
assert.equal(earlierCards.length,3306);assert.equal(earlierQuestions.length,1256);
const added=deck.cards.filter(c=>c.id.startsWith('task1_v160_'));
assert.deepEqual(added.map(c=>c.id),Array.from({length:6},(_,i)=>'task1_v160_'+String(i+1).padStart(3,'0')));
const key=s=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
const oldFronts=new Set(earlierCards.filter(c=>c.subject==='Physics'&&c.active!==false).map(c=>key(c.front)));
for(const c of added){
 assert.equal(c.subject,'Physics');assert.equal(c.stage,'AS');assert.equal(c.taught,true);
 assert.equal(c.active,true);assert.equal(c.mock,true);assert.equal(c.scope,'mock');
 assert.equal(c.kind,'content');assert.equal(c.strictRecall,true);
 assert(/^3\.[12]\./.test(c.specRef));
 assert(c.front.length<=130&&c.back.length<=135);
 assert.deepEqual(c.accept,[c.back]);assert(!oldFronts.has(key(c.front)));
}
const qadd=bank.questions.filter(q=>q.id.startsWith('mock_v160_'));
assert.deepEqual(qadd.map(q=>q.id),Array.from({length:4},(_,i)=>'mock_v160_'+String(i+1).padStart(2,'0')));
assert.equal(qadd.reduce((s,q)=>s+q.marks,0),27);
for(const q of qadd){
 assert.equal(q.subject,'Physics');assert.equal(q.level,'AS');assert.equal(q.mock,true);
 assert.equal(q.year,'Practice');assert.equal(q.sourceVerified,false);
 assert.equal(q.verificationLevel,'original-exam-style');assert.equal(q.standalone,true);
 assert.equal(q.requiresWorking,true);assert.equal(q.markPoints.length,q.marks);
 assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 assert.equal(q.modelAnswer,q.markPoints.join(' '));
 assert(!q.qpUrl&&!q.msUrl);
}
const C=new Map(deck.cards.map(c=>[c.id,c])),Q=new Map(bank.questions.map(q=>[q.id,q]));
for(const [a,expectedN,code,newN,newQ,newMarks] of [[particle,46,'3.2',3,2,14],[measure,32,'3.1',3,2,13]]){
 assert.equal(a.rows.length,expectedN);assert.equal(a.counts.checked,expectedN);
 assert.equal(a.counts.newCards,newN);assert.equal(a.counts.newQuestions,newQ);
 assert.equal(a.counts.newMarks,newMarks);
 assert.equal(a.limitations.completeSpecificationCertified,false);
 assert.equal(a.limitations.independentStudentMastery,false);
 const seen=new Set();
 for(const row of a.rows){
  assert(row.specRef.startsWith(code));
  assert(!seen.has(row.id));seen.add(row.id);
  const c=C.get(row.card.id);assert(c&&c.subject==='Physics'&&c.active!==false&&c.mock===true);
  assert.equal(c.front,reviewedExpected(row.card.id,'front',row.card.front));assert.equal(c.back,reviewedExpected(row.card.id,'back',row.card.back));
  assert.equal(c.specRef||null,row.card.specRef);
  if(row.question){const q=Q.get(row.question.id);
   assert(q&&q.subject==='Physics'&&q.mock===true);
   assert.equal(q.prompt,row.question.prompt);assert.equal(q.marks,row.question.marks);
   assert.deepEqual(q.markPoints,row.question.markPoints);
  }
 }
}
const app=fs.readFileSync('app.js','utf8');
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
console.log('PASS v160: 46 Particles and 32 Measurements exact-evidence checks, six concise mock cards, four original questions / 27 marks, preserved IDs.');
