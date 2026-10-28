'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const bank=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v162-maths-year1-recall-audit.json','utf8'));
assert.equal(deck.deckVersion,162);
assert.equal(deck.cards.length,3335);
assert.equal(deck.cards.filter(c=>c.active!==false).length,3331);
assert.equal(bank.questions.length,1260);
const mocks=deck.cards.filter(c=>c.active!==false&&c.mock===true);
assert.equal(mocks.length,2369);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,mocks.filter(c=>c.subject===s).length])),{Physics:730,Chemistry:1533,Maths:106});
assert.equal(new Set(deck.cards.map(c=>c.id)).size,deck.cards.length);
const add=deck.cards.filter(c=>c.id.startsWith('task1_v162_'));
assert.equal(add.length,23);
assert.deepEqual(add.map(c=>c.id),Array.from({length:23},(_,i)=>'task1_v162_'+String(i+1).padStart(3,'0')));
const old=deck.cards.filter(c=>!c.id.startsWith('task1_v162_'));
assert.equal(old.length,3312);
assert.deepEqual(audit.added.map(c=>c.id),add.map(c=>c.id));
const existingFronts=new Set(old.filter(c=>c.subject==='Maths'&&c.active!==false).map(c=>c.front.toLowerCase().replace(/[^a-z0-9]/g,'')));
for(const c of add){
 assert.equal(c.subject,'Maths');assert.equal(c.stage,'AS');
 assert(c.mock&&c.taught&&c.active&&c.scope==='mock'&&c.strictRecall);
 assert(c.front.length<=125&&c.back.length<=135);
 assert.equal(c.accept[0],c.back);
 assert(/^3\.(?:3|4|5|6|7|8|10)$/.test(c.specRef));
 assert(!existingFronts.has(c.front.toLowerCase().replace(/[^a-z0-9]/g,'')));
 const a=audit.added.find(x=>x.id===c.id);
 assert(a&&a.front===c.front&&a.back===c.back&&a.specRef===c.specRef);
}
for(const row of audit.restoredYear1){const c=old.find(x=>x.id===row.id);
 assert(c&&c.mock===true&&c.taught===true&&c.stage==='AS'&&c.scope==='mock');
 assert.equal(c.front,row.front);assert.equal(c.back,row.back);
}
for(const row of audit.removedFromSchoolMock){const c=old.find(x=>x.id===row.id);
 assert(c&&c.mock===false&&c.scope==='full'&&c.stage==='A2');
 assert.equal(c.front,row.front);assert.equal(c.back,row.back);
}
const legacy=require('./task1-v162-historical-snapshot.cjs')({deckVersion:162,cards:deck.cards});
assert.equal(legacy.cards.length,3312);
assert.equal(legacy.cards.filter(c=>c.active!==false&&c.mock===true).length,2340);
assert.equal(legacy.deckVersion,160);
assert.equal(audit.limitations.completeSpecificationCoverage,false);
assert.equal(audit.limitations.independentStudentMastery,false);
console.log('PASS v162: 23 concise Maths cards, eight restored Year 1 facts, two radian cards excluded from school mock, original 3312 IDs and 1260 questions preserved.');
