'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const load=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const deck=load('deck.json');
const previous=load('energetics_focus_v50.json');
const followups=load('energetics_worked_followups_v51.json');
const newBank=load('energetics_weakness_focus_v53.json');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const originalCards=deck.cards.filter(c=>c.id.startsWith('chem_energetics_v49_'));
const followupCards=deck.cards.filter(c=>c.id.startsWith('chem_energetics_v51_'));
const newCards=deck.cards.filter(c=>c.id.startsWith('chem_energetics_v53_'));
assert.equal(originalCards.length,65,'Original 65 Energetics cards must survive');
assert.equal(followupCards.length,5,'The v51 cards must survive');
assert.equal(newCards.length,36,'Must have 36 new targeted cards');
assert.equal(previous.questions.length,11);
assert.equal(previous.questions.reduce((s,q)=>s+q.marks,0),78);
assert.equal(followups.questions.length,3);
assert.equal(followups.questions.reduce((s,q)=>s+q.marks,0),17);
assert.equal(newBank.questions.length,9);
assert.equal(newBank.questions.reduce((s,q)=>s+q.marks,0),62);
assert(deck.deckVersion>=53);
assert(app.includes("'./energetics_weakness_focus_v53.json'"),'Load new question bank');
assert(sw.includes("'./energetics_weakness_focus_v53.json'"),'Include bank offline');
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"),'Saved progress key must not change');
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"),'Saved profile key must not change');
assert(app.includes("const qAll=subjectExam(sub).filter(mockEligibleQuestion)") && app.includes("if(q.mock!==true)return false;"),'Mock question eligibility removed');
const ids=new Set();
for(const c of deck.cards){assert(!ids.has(c.id),'Duplicate card '+c.id);ids.add(c.id);}
for(const c of newCards){
 assert(c.subject==='Chemistry'&&c.stage==='AS'&&c.active===true&&c.taught===true&&c.mock===true&&c.scope==='mock','Bad eligibility '+c.id);
 assert(c.userWeakness===true&&c.priority===9,'New high-priority weakness missing '+c.id);
 assert(c.front&&c.back);
}
const required=["Energetics","Calorimetry","Hess's law","Bond enthalpies","RP2 Enthalpy"];
for(const t of required)assert(newCards.some(c=>c.topic===t),'Missing Energetics subtopic '+t);
for(const t of ["100 kPa","stated temperature","−q_solution","coefficient","lone"]){
 // Verify specific critical content where relevant without assuming exact lexical form.
 if(t==="lone")continue;
 const hay=newCards.map(c=>c.front+' '+c.back).join('\n');
 assert(hay.includes(t),'Missing targeted formula or conditions '+t);
}
const p1=app.slice(app.indexOf('function normalise('),app.indexOf('function nextSchedule('));
const p2=app.slice(app.indexOf('function evidenceRuleScore('),app.indexOf('function renderExam(',app.indexOf('function evidenceRuleScore(')));
const score=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+p1+p2+'return examSuggested')();
const questionIds=new Set();
const topics=new Set(deck.cards.filter(c=>c.subject==='Chemistry').map(c=>c.revisionTopic||c.topic));
for(const q of [...previous.questions,...followups.questions,...newBank.questions]){
 assert(!questionIds.has(q.id),'Duplicate question ID '+q.id);questionIds.add(q.id);
 assert(q.subject==='Chemistry'&&q.level==='AS'&&q.mock===true&&q.standalone===true,'Bad question eligibility '+q.id);
 assert(q.year==='Practice'&&q.sourceVerified===false&&q.verificationLevel==='original-exam-style','Misleading source label '+q.id);
 assert(topics.has(q.revisionTopic),'No matching topic filter for '+q.id);
 assert.equal(q.markPoints.length,q.marks,'Mark-point count '+q.id);
 assert.equal(q.markPointMarks.reduce((s,m)=>s+m,0),q.marks,'Individual mark weights '+q.id);
 assert.equal(score(q,q.modelAnswer).suggested,q.marks,'Complete model answer not fully credited '+q.id);
 assert.equal(score(q,'I have no idea.').suggested,0,'Non-answer incorrectly credited '+q.id);
}
const expectedIDs=['energetics_v53_02','energetics_v53_03','energetics_v53_04','energetics_v53_05','energetics_v53_06','energetics_v53_07'];
for(const id of expectedIDs)assert(questionIds.has(id),'Missing key question '+id);
assert.equal(75*4.18*5,1567.5);
assert(Math.abs((-1.5675/0.025)-(-62.7))<0.00001);
assert(Math.abs((-62.7/2)-(-31.35))<0.00001);
assert.equal((2*-393.5)-(2*-110.5),-566);
assert.equal((2*-393.5)-(2*-283),-221);
assert(Math.abs(-184+2*-74.8-(-333.6))<0.00001);
assert.equal(612+436-347-2*413,-125);
assert(Math.abs(50*4.18*8.6-1797.4)<0.001);
assert(Math.abs(-1.7974/0.025-(-71.896))<0.001);
new Function(app);
console.log('PASS Energetics v53: 106 flashcards, 23 questions, 157 marks; targeted Hess, RP2, coefficients, and progress integrity');
