'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const deck=JSON.parse(fs.readFileSync(path.join(root,'deck.json'),'utf8'));
const bank=JSON.parse(fs.readFileSync(path.join(root,'amount_of_substance_focus_v44.json'),'utf8'));
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
assert(deck.deckVersion>=44);
const newCards=deck.cards.filter(c=>c.id.startsWith('chem_amount_v44_'));
assert.equal(newCards.length,48,'48 Amount of Substance mock cards');
const topics=new Set(deck.cards.filter(c=>c.subject==='Chemistry').map(c=>c.revisionTopic||c.topic));
for(const c of newCards){assert(c.subject==='Chemistry'&&c.active&&c.mock&&c.taught&&c.scope==='mock','Mock eligible: '+c.id);}
assert.equal(bank.questions.length,9);
assert.equal(bank.questions.reduce((sum,q)=>sum+q.marks,0),63);
assert(app.includes("'./amount_of_substance_focus_v44.json'"));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
const p1=app.slice(app.indexOf('function normalise('),app.indexOf('function nextSchedule('));
const p2=app.slice(app.indexOf('function evidenceRuleScore('),app.indexOf('function renderExam(',app.indexOf('function evidenceRuleScore(')));
const score=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+p1+p2+'return examSuggested')();
for(const q of bank.questions){
 assert.equal(q.year,'Practice');assert.equal(q.level,'AS');assert.equal(q.sourceVerified,false);
 assert.equal(q.verificationLevel,'original-exam-style');assert(q.mock&&q.standalone);
 assert(topics.has(q.revisionTopic),'Selectable topic: '+q.revisionTopic);
 assert.equal(q.markPoints.length,q.marks);
 assert.equal(q.markPointMarks.reduce((a,b)=>a+b,0),q.marks);
 assert.equal(score(q,q.modelAnswer).suggested,q.marks,'model answer rejected: '+q.id);
 assert.equal(score(q,'I have no idea.').suggested,0,'non-answer accepted: '+q.id);
}
assert.equal((63*69+65*31)/100,63.62);
assert(Math.abs(2.52/18/(2.4/120.4)-7)<0.05,'Hydrate x=7');
assert(Math.abs(((0.05-0.0186)/2*100.1/2)*100-78.5785)<0.1,'Back titration purity');
new Function(app);
console.log('PASS Amount of Substance v44: 48 mock flashcards and 9 exam problems (63 marks)');
