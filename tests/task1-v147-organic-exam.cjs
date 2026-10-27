'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const exam=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v147-organic-exam-audit.json','utf8'));
const all=exam.questions,added=all.filter(q=>q.id.startsWith('organic_v147_'));
assert.equal(exam.bankVersion,60);
assert.equal(all.length,1200);
assert.equal(all.length-added.length,1182);
assert.equal(added.length,18);
assert.equal(deck.deckVersion,146,'Exam-only release must not rewrite flashcards');
assert.equal(deck.cards.length,3263);
assert.equal(deck.cards.filter(c=>c.active!==false).length,3259);
assert.equal(audit.new.flashcardsAdded,0);
assert.equal(audit.new.questions,18);
assert.equal(audit.new.questionCount,1200);
assert.equal(audit.questionEvidence.length,18);
const allIds=new Set(all.map(q=>q.id));
assert.equal(allIds.size,all.length,'Duplicate question ID');
const pointsum=added.reduce((n,q)=>n+q.marks,0);
assert.equal(pointsum,97);
let drawings=0;
for(let i=0;i<added.length;i++){
 const q=added[i],a=audit.questionEvidence[i];
 assert.equal(q.id,'organic_v147_'+String(i+1).padStart(2,'0'));
 assert.equal(a.id,q.id);
 assert.equal(q.subject,'Chemistry');
 assert.equal(q.level,'AS');
 assert.equal(q.year,'Practice');
 assert.equal(q.paper,'Original');
 assert.equal(q.sourceVerified,false);
 assert.equal(q.verificationLevel,'original-exam-style');
 assert.equal(q.mock,true);
 assert.equal(q.answerType,'points');
 assert.equal(q.questionType,'multi-step problem');
 assert.equal(q.standalone,true);
 assert.equal(q.requiresWorking,true);
 assert(q.prompt.length>=75);
 assert.equal(q.groupId,q.id);
 assert(q.revisionTopic.length>=5);
 assert.equal(q.markPoints.length,q.marks);
 assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 assert.equal(q.markPointMarks.reduce((s,m)=>s+m,0),q.marks);
 assert(q.markPoints.every(p=>p.length>=18),'Blank or tiny mark point '+q.id);
 assert.equal(q.modelAnswer,q.markPoints.join(' '));
 assert(!q.qpUrl&&!q.msUrl,'Must not imply official AQA provenance');
 if(/draw|on paper|diagram/i.test(q.prompt))drawings++;
}
assert(drawings>=9,'Missing diagram/mechanism tasks');
for(const topic of ['Electrophilic addition','Nucleophilic substitution','Elimination','Free-radical mechanism','RP5 Distillation','RP6 Functional-group tests','Organic analysis','Addition polymers'])
 assert(added.some(q=>q.subtopic===topic),'Missing subtopic '+topic);
const deckTopics=new Set(deck.cards.filter(c=>c.subject==='Chemistry').map(c=>c.revisionTopic||c.topic));
for(const q of added)assert(deckTopics.has(q.revisionTopic),'Question topic missing from flashcard filters '+q.id);
const cards=new Map(deck.cards.map(c=>[c.id,c]));
assert.equal(audit.separateChatReviewCards.length,10);
for(const row of audit.separateChatReviewCards){
 assert(row.evidence.length>0);
 for(const e of row.evidence){
  const c=cards.get(e.id);assert(c,'Missing existing memory card '+e.id);
  assert.equal(c.front,e.front);assert.equal(c.back,e.back);
 }
}
assert(audit.separateChatReviewCards.some(c=>c.status==='supported_concept_but_not_exact_corner_prompt'),'No explicit semantic-only coverage qualification');
assert.equal(audit.coverage,'Selected applied tasks only, not full spec or mastery certification.');
assert(exam.copyrightNote.includes('Practice'),'Keep original practice provenance distinction');
const app=fs.readFileSync('app.js','utf8');
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])
 assert(app.includes(key),'Historical progress identity changed');
console.log('PASS v147: 18 original applied Chemistry exam questions, 97 marks, full mark points, 10 prior flashcard concepts mapped and all 3263 card IDs untouched');
