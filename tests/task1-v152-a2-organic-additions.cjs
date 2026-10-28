'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const d=JSON.parse(fs.readFileSync('deck.json','utf8'));
const b=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const a=JSON.parse(fs.readFileSync('editorial/task1-v152-a2-organic-additions.json','utf8'));
const previousAudit=JSON.parse(fs.readFileSync('editorial/task1-v151-a2-organic-crosswalk.json','utf8'));
const app=fs.readFileSync('app.js','utf8');

assert.equal(d.deckVersion,152);
assert(b.bankVersion>=62);
assert.equal(d.cards.length,3276);
assert.equal(d.cards.filter(c=>c.active!==false).length,3272);
assert.equal(b.questions.filter(q=>!q.id.startsWith('organic_v153_')).length,1226);
assert.equal(d.cards[3269].id,'task1_v150_007');
assert.equal(b.questions[1211].id,'organic_v149_12');
assert.equal(new Set(d.cards.map(c=>c.id)).size,d.cards.length);
assert.equal(new Set(b.questions.map(q=>q.id)).size,b.questions.length);
assert.equal(d.meta.task1FlashcardAudit.v152.added,6);
assert.equal(d.meta.task1FlashcardAudit.v152.originalIdsPreserved,true);
assert.equal(a.policy.fullSpecCoverageCertified,false);
assert.equal(a.policy.originalQuestionsOnly,true);
assert.equal(a.additions.questions,14);
assert.equal(a.additions.flashcards,6);
assert.equal(a.additions.marks,84);

const oldCards=d.cards.filter(c=>!c.id.startsWith('task1_v152_'));
const oldQuestions=b.questions.filter(q=>!q.id.startsWith('organic_v152_')&&!q.id.startsWith('organic_v153_'));
assert.equal(oldCards.length,3270);
assert.equal(oldCards.filter(c=>c.active!==false).length,3266);
assert.equal(oldQuestions.length,1212);
const newCards=d.cards.filter(c=>c.id.startsWith('task1_v152_'));
const newQuestions=b.questions.filter(q=>q.id.startsWith('organic_v152_'));
assert.equal(newCards.length,6);
assert.equal(newQuestions.length,14);

const normalise=s=>s.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
const fronts=new Set(oldCards.filter(c=>c.active!==false&&c.subject==='Chemistry').map(c=>normalise(c.front)));
const knownTopics=new Set(oldCards.filter(c=>c.subject==='Chemistry').map(c=>c.revisionTopic||c.topic));
const rowIds=new Map(previousAudit.rows.map(row=>[row.id,row]));
for(let i=0;i<newCards.length;i++){
 const c=newCards[i],ev=a.cards[i];
 assert.equal(c.id,'task1_v152_'+String(i+1).padStart(3,'0'));
 assert.equal(c.id,ev.id);
 assert.equal(c.front,ev.front);assert.equal(c.back,ev.back);assert.equal(c.specRef,ev.specRef);
 assert.equal(c.subject,'Chemistry');assert.equal(c.stage,'A2');
 assert.equal(c.mock,false);assert.equal(c.taught,false);assert.equal(c.scope,'full');
 assert.equal(c.kind,'content');assert.equal(c.active,true);assert.equal(c.strictRecall,true);
 assert(c.front.length<=130&&c.back.length<=120);
 assert(c.accept.includes(c.back));
 assert(knownTopics.has(c.revisionTopic));
 assert(!fronts.has(normalise(c.front)),'Duplicate active front '+c.id);
 fronts.add(normalise(c.front));
}
let marks=0;
for(let i=0;i<newQuestions.length;i++){
 const q=newQuestions[i],ev=a.questions[i];
 assert.equal(q.id,'organic_v152_'+String(i+1).padStart(2,'0'));
 assert.equal(q.id,ev.id);assert.equal(q.prompt,ev.prompt);
 assert.equal(q.revisionTopic,ev.revisionTopic);assert.equal(q.subtopic,ev.subtopic);
 assert.equal(q.subject,'Chemistry');assert.equal(q.level,'A-level');assert.equal(q.mock,false);
 assert.equal(q.year,'Practice');assert.equal(q.paper,'Original');assert.equal(q.sourceVerified,false);
 assert.equal(q.verificationLevel,'original-exam-style');
 assert(!q.qpUrl&&!q.msUrl);
 assert(knownTopics.has(q.revisionTopic),'No topic available in revision filters: '+q.revisionTopic);
 assert.equal(q.groupId,q.id);assert.equal(q.standalone,true);assert.equal(q.requiresWorking,true);
 assert.equal(q.answerType,'points');assert.equal(q.questionType,'multi-step problem');
 assert.equal(q.marks,ev.marks);assert.equal(q.marks,q.markPoints.length);
 assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 assert.deepEqual(q.markPoints,ev.markPoints);
 assert.equal(q.modelAnswer,q.markPoints.join(' '));
 assert(q.marks>=5&&q.marks<=7);
 assert(q.prompt.length>80);
 assert(ev.auditIds.length>0);
 for(const id of ev.auditIds)assert(rowIds.has(id),'Unknown v151 gap id '+id);
 marks+=q.marks;
}
assert.equal(marks,84);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])
 assert(app.includes(key),'Progress keys changed');
console.log('PASS v152: 6 short A2-only cards + 14 original exam questions ('+marks+' marks), old ID counts and mock filters preserved');
