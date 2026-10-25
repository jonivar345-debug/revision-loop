'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const load=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const deck=load('deck.json'),bank=load('bonding_focus_v49.json');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
assert(deck.deckVersion>=48);
const cards=deck.cards.filter(c=>/^chem_bonding_v4[78]_/.test(c.id));
assert.equal(cards.length,89,'Preserve 89 new bonding cards');
assert.equal(bank.questions.length,11,'Preserve 11 original exam questions');
assert.equal(bank.questions.reduce((n,q)=>n+q.marks,0),80,'Preserve 80 marks');
const required=['Bonding','Crystal structures','Shapes','Bond polarity','Intermolecular forces'];
const topics=new Set(deck.cards.filter(c=>c.subject==='Chemistry').map(c=>c.revisionTopic||c.topic));
for(const t of required){assert(cards.some(c=>c.topic===t),'Flashcard topic missing: '+t);assert(topics.has(t),'Exam filter missing topic: '+t);}
const ids=new Set();
for(const c of deck.cards){assert(!ids.has(c.id),'Duplicate card id: '+c.id);ids.add(c.id);}
for(const c of cards){
 assert.equal(c.subject,'Chemistry');
 assert.equal(c.mock,true);
 assert.equal(c.active,true);
 assert.equal(c.taught,true);
 assert.equal(c.scope,'mock');
 assert.equal(c.stage,'AS');
 assert(c.front&&c.back,'Missing flashcard side '+c.id);
}
assert(app.includes("'./bonding_focus_v49.json'"),'Bonding bank not linked in app');
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"),'Existing progress key changed');
const start1=app.indexOf('function normalise('),end1=app.indexOf('function nextSchedule(');
const start2=app.indexOf('function evidenceRuleScore('),end2=app.indexOf('function renderExam(',start2);
const p1=app.slice(start1,end1),p2=app.slice(start2,end2);
const score=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+p1+p2+'return examSuggested')();
const qids=new Set();
for(const q of bank.questions){
 assert(!qids.has(q.id),'Duplicate question: '+q.id);qids.add(q.id);
 assert(q.subject==='Chemistry'&&q.level==='AS'&&q.mock===true&&q.standalone===true);
 assert(q.year==='Practice'&&q.sourceVerified===false&&q.verificationLevel==='original-exam-style','Originality metadata');
 assert(topics.has(q.revisionTopic),'Unselectable topic: '+q.revisionTopic);
 assert.equal(q.markPoints.length,q.marks);
 assert.equal(q.markPointMarks.reduce((n,m)=>n+m,0),q.marks);
 assert.equal(score(q,q.modelAnswer).suggested,q.marks,'Model answer rejected '+q.id);
 assert.equal(score(q,'I have no idea.').suggested,0,'Blank answer incorrectly credited '+q.id);
}
new Function(app);
console.log('PASS AQA Bonding: 89 cards + 11 exam problems / 80 marks, valid mock modes');
