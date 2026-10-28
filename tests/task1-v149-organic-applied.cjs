'use strict';
const assert=require('node:assert/strict');const fs=require('node:fs');
const bank=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v149-organic-applied-questions.json','utf8'));
const all=bank.questions.filter(q=>!q.id.startsWith('organic_v152_')&&!q.id.startsWith('organic_v153_')&&!q.id.startsWith('mock_v154_')), added=all.filter(q=>q.id.startsWith('organic_v149_'));
assert(bank.bankVersion>=61);assert.equal(all.length,1212);
assert.equal(added.length,12);assert.equal(all.length-added.length,1200);
assert(deck.deckVersion>=146);assert.equal(deck.cards.filter(c=>!c.id.startsWith('task1_v150_')&&!c.id.startsWith('task1_v152_')&&!c.id.startsWith('task1_v154_')&&!c.id.startsWith('task1_v155_')&&!c.id.startsWith('task1_v156_')).length,3263);
assert.equal(deck.cards.filter(c=>c.active!==false&&!c.id.startsWith('task1_v150_')&&!c.id.startsWith('task1_v152_')&&!c.id.startsWith('task1_v154_')&&!c.id.startsWith('task1_v155_')&&!c.id.startsWith('task1_v156_')).length,3259);
assert.equal(new Set(all.map(q=>q.id)).size,all.length);
assert.equal(audit.addedQuestions,12);
assert.equal(added.reduce((n,q)=>n+q.marks,0),audit.addedMarks);
assert.equal(audit.questions.length,12);
const knownTopics=new Set(deck.cards.filter(c=>c.subject==='Chemistry').map(c=>c.revisionTopic||c.topic));
for (let i=0;i<added.length;i++){
 const q=added[i], evidence=audit.questions[i];
 assert.equal(q.id,'organic_v149_'+String(i+1).padStart(2,'0'));
 assert.equal(evidence.id,q.id);assert(evidence.specRef.startsWith('3.3.'));
 assert(knownTopics.has(q.revisionTopic));assert.equal(q.revisionTopic,evidence.revisionTopic);
 assert.equal(q.subject,'Chemistry');assert.equal(q.level,'AS');assert.equal(q.mock,true);
 assert.equal(q.year,'Practice');assert.equal(q.paper,'Original');assert.equal(q.sourceVerified,false);
 assert.equal(q.verificationLevel,'original-exam-style');
 assert.equal(q.groupId,q.id);assert.equal(q.standalone,true);
 assert.equal(q.answerType,'points');assert.equal(q.requiresWorking,true);
 assert.equal(q.marks,q.markPoints.length);assert(q.marks>=5 && q.marks<=6);
 assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 assert.deepEqual(q.markPoints,evidence.markPoints);assert.equal(q.prompt,evidence.prompt);
 assert.equal(q.modelAnswer,q.markPoints.join(' '));
 assert(!q.qpUrl&&!q.msUrl);
}
for(const ref of ['3.3.6.2','3.3.1.1','3.3.1.3','3.3.2.2','3.3.2.3','3.3.3.3','3.3.4.3','3.3.6.3'])
 assert(audit.questions.some(x=>x.specRef===ref),'Missing v148 applied gap '+ref);
assert(audit.questions.find(x=>x.specRef==='3.3.6.2').markPoints.some(x=>x.includes('46.041865')));
const app=fs.readFileSync('app.js','utf8');
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])
 assert(app.includes(key),'Progress storage key changed');
console.log('PASS v149: 12 original AS organic applied questions; '+audit.addedMarks+' marks; previous 1200 questions, 3263 cards and save keys preserved');
