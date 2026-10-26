'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const load=n=>JSON.parse(fs.readFileSync(path.join(root,n),'utf8'));
const deck=load('deck.json'),oldBank=load('bonding_focus_v49.json'),extra=load('bonding_weakness_focus_v52.json');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const existing=deck.cards.filter(c=>/^chem_bonding_v4[78]_/.test(c.id));
const focused=deck.cards.filter(c=>c.id.startsWith('chem_bonding_v52_'));
assert.equal(existing.length,89,'Preserve the 89 earlier Bonding cards');
assert.equal(focused.length,48,'Add 48 targeted Bonding cards');
assert.equal(oldBank.questions.length,11,'Preserve 11 original bonding questions');
assert.equal(oldBank.questions.reduce((s,q)=>s+q.marks,0),80,'Preserve 80 original bonding marks');
assert.equal(extra.questions.length,12);
assert.equal(extra.questions.reduce((s,q)=>s+q.marks,0),57);
assert(deck.deckVersion>=52);
assert(app.includes("'./bonding_focus_v49.json'")&&app.includes("'./bonding_weakness_focus_v52.json'"),'Banks must be loaded');
assert(sw.includes("'./bonding_weakness_focus_v52.json'"),'New bank should be available offline');
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"),'Do not change progress key');
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"),'Do not change profile key');
const ids=new Set();
for(const c of deck.cards){assert(!ids.has(c.id),'Duplicate card '+c.id);ids.add(c.id);}
const five=['sulfate','hydroxide','nitrate','carbonate','ammonium'];
for(const name of five){assert(focused.some(c=>c.front.toLowerCase().includes(name)&&c.back),'Missing single-ion recall card '+name);}
assert(focused.filter(c=>c.topic==='Shapes').length>=15);
assert(focused.filter(c=>c.topic==='Bond polarity').length>=8);
assert(focused.filter(c=>c.topic==='Intermolecular forces').length>=8);
for(const c of focused){
 assert(c.subject==='Chemistry'&&c.stage==='AS'&&c.active&&c.taught&&c.mock&&c.scope==='mock','Card not mock eligible '+c.id);
 assert(c.priority===9&&c.userWeakness,'Weakness priority missing '+c.id);
 assert(c.front&&c.back,'Missing card side '+c.id);
}
for(const c of existing.filter(c=>['Shapes','Bond polarity','Intermolecular forces'].includes(c.topic)))assert(c.priority===9&&c.userWeakness,'Earlier hard topics must be high priority '+c.id);
for(const c of deck.cards.filter(c=>/^chem_bonding_v/.test(c.id))){
 if(c.id==='chem_bonding_v52_35')assert(c.back.includes("van der Waals"));
 else assert(!/\bLondon\b/.test(c.front+' '+c.back),'Use classroom terminology on Bonding cards '+c.id);
}
const p1=app.slice(app.indexOf('function normalise('),app.indexOf('function nextSchedule('));
const p2=app.slice(app.indexOf('function evidenceRuleScore('),app.indexOf('function renderExam(',app.indexOf('function evidenceRuleScore(')));
const score=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+p1+p2+'return examSuggested')();
const qids=new Set(oldBank.questions.map(q=>q.id));
const allowed=new Set(deck.cards.filter(c=>c.subject==='Chemistry').map(c=>c.revisionTopic||c.topic));
for(const q of [...oldBank.questions,...extra.questions]){
 assert(q.subject==='Chemistry'&&q.level==='AS'&&q.mock&&q.standalone,'Bad eligibility '+q.id);
 assert(q.year==='Practice'&&q.sourceVerified===false&&q.verificationLevel==='original-exam-style','Bad sourcing '+q.id);
 assert(allowed.has(q.revisionTopic),'Topic filter cannot select '+q.id);
 assert(q.marks===q.markPoints.length&&q.marks===q.markPointMarks.reduce((s,v)=>s+v,0),'Mark mismatch '+q.id);
 assert.equal(score(q,q.modelAnswer).suggested,q.marks,'Model answer should obtain full credit '+q.id);
 assert.equal(score(q,'I have no idea.').suggested,0,'Nonanswer should earn zero '+q.id);
}
for(const q of extra.questions){assert(!qids.has(q.id),'Duplicate exam question id '+q.id);qids.add(q.id);}
assert(extra.questions.some(q=>q.prompt.includes('Iodine I₂')&&q.marks===6),'Six-mark halogens+water question missing');
assert(extra.questions.filter(q=>q.marks===4).length>=6,'Include ample 4-mark explanation practice');
new Function(app);
console.log('PASS AQA Bonding v52: 137 targeted flashcards, 23 original questions / 137 marks, preserved saved IDs');
