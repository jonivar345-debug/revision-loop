'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const deck=read('deck.json'),bank=read('atomic_structure_focus_v43.json');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const cards=deck.cards.filter(c=>c.id.startsWith('chem_atomic_v43_'));
assert(deck.deckVersion>=43,'Atomic structure flashcards missing');
assert.equal(cards.length,51,'51 AQA Atomic Structure cards must remain');
assert.equal(cards.filter(c=>c.topic==='Mass spectrometry').length,26,'26 TOF cards required');
assert.equal(bank.questions.length,15);
assert.equal(bank.questions.reduce((n,q)=>n+q.marks,0),88);
const period3Ids=['chem_ie_focus_v46_01','chem_ie_focus_v46_02','chem_ie_focus_v46_03'];
for(const id of period3Ids){
 const c=deck.cards.find(c=>c.id===id);
 assert(c,'Missing focused Period 3 card '+id);
 assert(c.mock&&c.active&&c.taught&&c.scope==='mock'&&c.priority===9&&c.kind==='weak',
  'Focused Period 3 card must be prioritised for mock: '+id);
}
const qPeriod=bank.questions.find(q=>q.id==='atomic_period3_focus_v46_01');
assert(qPeriod&&qPeriod.marks===5,'Dedicated five-mark Period 3 question must exist');
const topics=new Set(deck.cards.filter(c=>c.subject==='Chemistry').map(c=>c.revisionTopic||c.topic));
const ids=new Set();
for(const c of deck.cards){assert(!ids.has(c.id),'duplicate card '+c.id);ids.add(c.id);}
for(const c of cards){
 assert.equal(c.subject,'Chemistry');
 assert.equal(c.stage,'AS');
 assert.equal(c.mock,true);
 assert.equal(c.active,true);
 assert.equal(c.taught,true);
 assert.equal(c.scope,'mock');
 assert(c.front && c.back,'missing side '+c.id);
}
assert(app.includes("'./atomic_structure_focus_v43.json'"),'Bank must load in app');
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"),'Progress data key must not change');
assert(app.includes("const cardPool=cards.filter(c=>c.active!==false&&c.subject===sub&&c.mock===true)"),'Mock flashcards no longer include new cards');
assert(app.includes("const qAll=subjectExam(sub).filter(mockEligibleQuestion)") && app.includes("if(q.mock!==true)return false;"),'Mock exam questions must select explicitly eligible Chemistry questions');
const p1=app.slice(app.indexOf('function normalise('),app.indexOf('function nextSchedule('));
const p2=app.slice(app.indexOf('function evidenceRuleScore('),app.indexOf('function renderExam(',app.indexOf('function evidenceRuleScore(')));
const score=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+p1+p2+'return examSuggested')();
const qIds=new Set();
for(const q of bank.questions){
 assert(!qIds.has(q.id),'duplicate question '+q.id);qIds.add(q.id);
 assert.equal(q.subject,'Chemistry');
 assert.equal(q.level,'AS');
 assert.equal(q.year,'Practice','Original problems should never masquerade as published AQA questions');
 assert.equal(q.mock,true);
 assert.equal(q.sourceVerified,false);
 assert.equal(q.verificationLevel,'original-exam-style');
 assert.equal(q.standalone,true);
 assert(topics.has(q.revisionTopic),'Topic not available in filters: '+q.revisionTopic);
 assert.equal(q.marks,q.markPoints.length);
 assert.equal(q.marks,q.markPointMarks.reduce((a,b)=>a+b,0));
 assert.equal(score(q,q.modelAnswer).suggested,q.marks,'Reference answer failed: '+q.id);
 assert.equal(score(q,'I have no idea.').suggested,0,'A blank answer earned credit: '+q.id);
}
const copper=(63*69+65*31)/100;
assert.equal(copper,63.62,'Copper isotope weighted mean');
const iron=(54*5.8+56*91.7+57*2.5)/100;
assert(Math.abs(iron-55.909)<0.00001,'Three isotope weighted mean');
const speed=Math.sqrt(2*1.99e-16/3.98e-26),time=1.2/speed;
assert(Math.abs(speed-1e5)<1,'TOF speed');
assert(Math.abs(time-1.2e-5)<1e-12,'TOF time');
new Function(app);
console.log('PASS atomic v43 + Period 3 v46: 51 cards, 26 TOF, 3 high-priority exceptions cards, 15 questions, 88 marks');
