'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const load=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const deck=load('deck.json'),bank=load('energetics_focus_v50.json');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const cards=deck.cards.filter(c=>c.id.startsWith('chem_energetics_v49_'));
assert(deck.deckVersion>=49,'Expected Energetics deck');
assert.equal(cards.length,65,'Preserve 65 Energetics flashcards');
assert.equal(bank.questions.length,11,'Preserve 11 Energetics exam problems');
assert.equal(bank.questions.reduce((x,q)=>x+q.marks,0),78,'Preserve 78-mark practice bank');
const topics=['Energetics','Calorimetry',"Hess's law",'Bond enthalpies','RP2 Enthalpy'];
const selectable=new Set(deck.cards.filter(c=>c.subject==='Chemistry').map(c=>c.revisionTopic||c.topic));
for(const t of topics){assert(cards.some(c=>c.topic===t),'Missing Energetics flashcard topic: '+t);assert(selectable.has(t),'Missing question selection topic: '+t);}
const ids=new Set();
for(const c of deck.cards){assert(!ids.has(c.id),'Duplicate card id: '+c.id);ids.add(c.id);}
for(const c of cards){assert(c.subject==='Chemistry'&&c.stage==='AS'&&c.active===true&&c.taught===true&&c.mock===true&&c.scope==='mock','Not eligible for Chemistry mock '+c.id);assert(c.front&&c.back,'Missing side '+c.id);}
assert(app.includes("'./energetics_focus_v50.json'"),'Bank not loaded');
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"),'Saved progress key changed');
assert(app.includes("const qAll=subjectExam(sub).filter(mockEligibleQuestion)") && app.includes("if(q.mock!==true)return false;"),'Mock questions ineligible');
const p1=app.slice(app.indexOf('function normalise('),app.indexOf('function nextSchedule('));
const p2=app.slice(app.indexOf('function evidenceRuleScore('),app.indexOf('function renderExam(',app.indexOf('function evidenceRuleScore(')));
const score=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+p1+p2+'return examSuggested')();
for(const q of bank.questions){
 assert(q.subject==='Chemistry'&&q.level==='AS'&&q.mock===true&&q.standalone===true,'Question not eligible '+q.id);
 assert(q.year==='Practice'&&!q.sourceVerified&&q.verificationLevel==='original-exam-style','Incorrect question source metadata '+q.id);
 assert(selectable.has(q.revisionTopic),'Unselectable practice question '+q.id);
 assert.equal(q.marks,q.markPoints.length,'Incorrect marks '+q.id);
 assert.equal(q.marks,q.markPointMarks.reduce((x,m)=>x+m,0),'Incorrect mark points '+q.id);
 assert.equal(score(q,q.modelAnswer).suggested,q.marks,'Model answer not full credit '+q.id);
 assert.equal(score(q,'I have no idea.').suggested,0,'Nonanswer credited '+q.id);
}
const near=(actual,expect,tol=0.02)=>assert(Math.abs(actual-expect)<tol,'Expected '+expect+' got '+actual);
near(-(50*4.18*6.8/1000)/0.025,-56.848);
near((100*4.18*3.5/1000)/(5/74.6),21.829);
near((4*413+2*498)-(2*805+4*463),-814,0.01);
near(-84.7-(52.3+0),-137,0.01);
near((-1411-286)-(-1560),-137,0.01);
near(-66-(+12),-78,0.01);
near(-(50*4.18*7/1000)/0.025,-58.52);
new Function(app);
console.log('PASS Energetics v49/v50: 65 mock cards, 11 original questions, 78 marks, calculations verified');
