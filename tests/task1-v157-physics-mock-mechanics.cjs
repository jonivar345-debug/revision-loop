'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const bank=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v157-physics-mechanics-mock-audit.json','utf8'));
const beforeDeck=deck.cards.filter(c=>!c.id.startsWith('task1_v157_')&&!c.id.startsWith('task1_v158_')&&!c.id.startsWith('task1_v159_')&&!c.id.startsWith('task1_v160_'));
const v157Deck=deck.cards.filter(c=>!c.id.startsWith('task1_v158_')&&!c.id.startsWith('task1_v159_')&&!c.id.startsWith('task1_v160_'));
const v157Bank=bank.questions.filter(q=>!q.id.startsWith('mock_v158_')&&!q.id.startsWith('mock_v159_')&&!q.id.startsWith('mock_v160_'));
const beforeBank=bank.questions.filter(q=>!q.id.startsWith('mock_v157_')&&!q.id.startsWith('mock_v158_')&&!q.id.startsWith('mock_v159_')&&!q.id.startsWith('mock_v160_'));
assert(deck.deckVersion>=157);assert(bank.bankVersion>=65);
assert.equal(v157Deck.length,3299);assert.equal(v157Deck.filter(c=>c.active!==false).length,3295);
assert.equal(v157Deck.filter(c=>c.active!==false&&c.mock===true).length,2327);
assert.equal(v157Bank.length,1250);
assert.equal(beforeDeck.length,3295);assert.equal(beforeBank.length,1247);
assert.equal(new Set(deck.cards.map(c=>c.id)).size,deck.cards.length);
assert.equal(new Set(bank.questions.map(q=>q.id)).size,bank.questions.length);
const mock=v157Deck.filter(c=>c.active!==false&&c.mock===true);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(subject=>[subject,mock.filter(c=>c.subject===subject).length])),{Physics:717,Chemistry:1533,Maths:77});
const added=deck.cards.filter(c=>c.id.startsWith('task1_v157_'));
assert.deepEqual(added.map(x=>x.id),['task1_v157_001','task1_v157_002','task1_v157_003','task1_v157_004']);
const n=s=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
const oldFronts=new Set(beforeDeck.filter(c=>c.subject==='Physics'&&c.active!==false).map(c=>n(c.front)));
for(const c of added){
 assert.equal(c.subject,'Physics');assert.equal(c.stage,'AS');assert.equal(c.mock,true);
 assert.equal(c.scope,'mock');assert.equal(c.taught,true);assert.equal(c.active,true);assert.equal(c.strictRecall,true);
 assert(c.front.length<=110&&c.back.length<=140);assert.deepEqual(c.accept,[c.back]);
 assert(!oldFronts.has(n(c.front)),'Duplicated Physics recall front '+c.id);
 assert(/^3\.4\./.test(c.specRef)); 
}
const newQ=bank.questions.filter(q=>q.id.startsWith('mock_v157_'));
assert.equal(newQ.length,3);assert.equal(newQ.reduce((s,q)=>s+q.marks,0),20);
for(const [i,q] of newQ.entries()){
 assert.equal(q.id,'mock_v157_'+String(i+1).padStart(2,'0'));
 assert.equal(q.subject,'Physics');assert.equal(q.mock,true);assert.equal(q.level,'AS');
 assert.equal(q.year,'Practice');assert.equal(q.sourceVerified,false);
 assert.equal(q.verificationLevel,'original-exam-style');assert.equal(q.questionType,'multi-step problem');
 assert.equal(q.standalone,true);assert.equal(q.requiresWorking,true);
 assert(q.marks>=5&&q.marks<=7);assert.equal(q.markPoints.length,q.marks);
 assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 assert.equal(q.modelAnswer,q.markPoints.join(' '));
 assert(!q.qpUrl&&!q.msUrl);
}
assert.equal(audit.rows.length,33);assert.equal(audit.counts.newRecallCards,4);
assert.equal(audit.counts.newPracticeQuestions,3);assert.equal(audit.counts.newPracticeMarks,20);
assert.equal(audit.limitations.fullSpecificationCoverageCertified,false);
assert.equal(audit.limitations.studentRecallIndependentlyTested,false);
const cm=new Map(deck.cards.map(c=>[c.id,c])),qm=new Map(bank.questions.map(q=>[q.id,q]));
const seen=new Set();
for(const row of audit.rows){
 assert(!seen.has(row.id));seen.add(row.id);assert(row.specRef.startsWith('3.4.'));
 const c=cm.get(row.card.id);assert(c&&c.active!==false&&c.mock===true&&c.subject==='Physics');
 assert.equal(c.front,row.card.front);assert.equal(c.back,row.card.back);
 assert.equal(c.specRef||null,row.card.specRef);
 if(row.question){const q=qm.get(row.question.id);assert(q&&q.mock===true&&q.subject==='Physics');assert.equal(q.prompt,row.question.prompt);assert.equal(q.marks,row.question.marks);assert.deepEqual(q.markPoints,row.question.markPoints);}
}
const app=fs.readFileSync('app.js','utf8');
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
console.log('PASS v157: four concise AS Physics cards, three applied mock questions / 20 marks, 33 exact Mechanics evidence checks, preserved IDs.');
