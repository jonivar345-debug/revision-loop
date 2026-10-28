'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const bank=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const patch=JSON.parse(fs.readFileSync('editorial/task1-v154-mock-precision.json','utf8'));
const sample=JSON.parse(fs.readFileSync('editorial/task1-v154-mock-evidence-sample.json','utf8'));
const app=fs.readFileSync('app.js','utf8');
assert.equal(deck.deckVersion,154);
assert.equal(bank.bankVersion,64);
assert.equal(deck.cards.length,3283);
assert.equal(deck.cards.filter(c=>c.active!==false).length,3279);
assert.equal(bank.questions.length,1238);
assert.equal(deck.cards.filter(c=>c.active!==false&&c.mock===true).length,2311);
assert.equal(new Set(deck.cards.map(c=>c.id)).size,deck.cards.length);
assert.equal(new Set(bank.questions.map(q=>q.id)).size,bank.questions.length);
assert.equal(deck.cards[3275].id,'task1_v152_006');
assert.equal(bank.questions[1237].id,'organic_v153_12');
const live=deck.cards.filter(c=>c.active!==false&&c.mock===true);
const countBySubject=Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,live.filter(c=>c.subject===s).length]));
assert.deepEqual(countBySubject,{Physics:709,Chemistry:1525,Maths:77});
assert.equal(patch.baseline.cards,3276);
assert.equal(patch.baseline.mock,2339);
assert.equal(Object.keys(patch.corrections.aqaBondWording).length,21);
assert.equal(patch.corrections.mockScope.physicsYear2.length,18);
assert.equal(patch.corrections.mockScope.chemistryBufferOutsideMock.length,8);
assert.equal(patch.corrections.mockScope.mathsA2Pure.length,9);
assert.equal(deck.meta.task1FlashcardAudit.v154.changedMockFlags,35);
for(const id of [...patch.corrections.mockScope.physicsYear2,...patch.corrections.mockScope.chemistryBufferOutsideMock,...patch.corrections.mockScope.mathsA2Pure]){
 const c=deck.cards.find(c=>c.id===id);
 assert(c&&c.mock===false&&c.scope==='full'&&c.active!==false,'Excluded from mock but retained for full revision: '+id);
}
const byId=new Map(deck.cards.map(c=>[c.id,c]));
const fronts=new Set();
for(const c of patch.additions){
 const got=byId.get(c.id);assert(got,'Missing v154 card '+c.id);
 assert.equal(got.mock,true);assert.equal(got.taught,true);assert.equal(got.active,true);assert.equal(got.stage,'AS');assert.equal(got.scope,'mock');
 assert.equal(got.front,c.front);assert.equal(got.back,c.back);assert.equal(got.specRef,c.specRef);
 assert(got.front.length<=120&&got.back.length<=120,'Too long '+c.id);
 assert(!fronts.has(got.subject+'|'+got.front),'Duplicate new front');
 fronts.add(got.subject+'|'+got.front);
}
const forbidden=/(?:\b(?:sigma|Sigma|pi|Pi)\s*(?:bonds?|electrons?)|[πσ]\s*[- ]?(?:bonds?|electrons?))/u;
for(const c of deck.cards.filter(c=>c.subject==='Chemistry'))assert(!forbidden.test(c.front+' '+c.back),'Unsupported specialist bond terminology on card '+c.id);
for(const q of bank.questions.filter(q=>q.subject==='Chemistry')){
 assert(!/[πσ]/.test([q.prompt,q.modelAnswer,...q.markPoints].join(' ')),'Unexpected specialist bond terminology in '+q.id);
}
for(const [id,patchText] of Object.entries(patch.corrections.aqaBondWording)){
 const c=byId.get(id);assert(c);
 for(const [field,value] of Object.entries(patchText))assert.equal(c[field],value);
}
assert.equal(sample.rows.length,50);
assert.deepEqual(sample.counts.bySubject,countBySubject);
const sampleSubs={Physics:0,Chemistry:0,Maths:0};
for(const row of sample.rows){
 const c=byId.get(row.id);assert(c&&c.active!==false&&c.mock===true,'Sample not in live mock pool '+row.id);
 assert.equal(row.front,c.front);assert.equal(row.back,c.back);assert.equal(row.subject,c.subject);
 sampleSubs[c.subject]++;
}
assert.deepEqual(sampleSubs,sample.counts.sampledBySubject);
assert(sample.limitations.length>=3);
assert.equal(deck.meta.task1FlashcardAudit.v154.added,7);
assert(app.includes("function flashEligible(c){return flashScopeFilter==='mock'?c.mock===true:"));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v154: AQA-only wording, seven short cards, 35 scope flag fixes, 2311 mock cards, 50 evidenced examples and stable IDs');
