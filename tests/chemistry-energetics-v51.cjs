'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const load=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const deck=load('deck.json'),prior=load('energetics_focus_v50.json'),followups=load('energetics_worked_followups_v51.json');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const oldCards=deck.cards.filter(c=>c.id.startsWith('chem_energetics_v49_'));
const newCards=deck.cards.filter(c=>c.id.startsWith('chem_energetics_v51_'));
assert.equal(oldCards.length,65,'The original 65 flashcards must remain intact');
assert.equal(newCards.length,5,'Expected 5 new targeted cards');
assert.equal(prior.questions.length,11,'The original 11 questions must remain intact');
assert.equal(prior.questions.reduce((n,q)=>n+q.marks,0),78,'Original 78 marks must remain');
assert.equal(followups.questions.length,3);
assert.equal(followups.questions.reduce((n,q)=>n+q.marks,0),17);
assert(deck.deckVersion>=51);
assert(app.includes("'./energetics_worked_followups_v51.json'"),'New question bank must be loaded');
assert(sw.includes("'./energetics_worked_followups_v51.json'"),'New question bank should work offline');
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"),'Existing saved progress ID changed');
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"),'Existing profile ID changed');
const cardIds=new Set();
for(const c of deck.cards){assert(!cardIds.has(c.id),'Duplicate card ID '+c.id);cardIds.add(c.id);}
const topics=new Set(deck.cards.filter(c=>c.subject==='Chemistry').map(c=>c.revisionTopic||c.topic));
for(const c of newCards){
 assert(c.subject==='Chemistry'&&c.stage==='AS'&&c.active&&c.taught&&c.mock&&c.scope==='mock');
 assert(c.front&&c.back);
}
const qids=new Set([...prior.questions.map(q=>q.id)]);
const p1=app.slice(app.indexOf('function normalise('),app.indexOf('function nextSchedule('));
const p2=app.slice(app.indexOf('function evidenceRuleScore('),app.indexOf('function renderExam(',app.indexOf('function evidenceRuleScore(')));
const score=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+p1+p2+'return examSuggested')();
for(const q of followups.questions){
 assert(!qids.has(q.id),'Duplicate question ID '+q.id);qids.add(q.id);
 assert(q.subject==='Chemistry'&&q.level==='AS'&&q.mock&&q.standalone);
 assert(q.year==='Practice'&&q.sourceVerified===false&&q.verificationLevel==='original-exam-style');
 assert(topics.has(q.revisionTopic),'Exam topic not selectable: '+q.revisionTopic);
 assert.equal(q.markPoints.length,q.marks);
 assert.equal(q.markPointMarks.reduce((n,m)=>n+m,0),q.marks);
 assert.equal(score(q,q.modelAnswer).suggested,q.marks,'Full answer must earn full credit: '+q.id);
 assert.equal(score(q,'I have no idea.').suggested,0,'Nonanswer should earn zero: '+q.id);
}
assert.equal(50.0*4.18*13.4,2800.6);
assert.equal(Math.round((-(2800.6/1000)/0.05)*10)/10,-56.0);
assert.equal(436+243-2*431,-183);
new Function(app);
console.log('PASS Energetics v51: 70 cards, 14 original problems, 95 marks, no lost progress keys');
