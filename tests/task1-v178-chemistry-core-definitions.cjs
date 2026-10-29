'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v178-chemistry-core-definitions.json','utf8'));
const original=JSON.parse(fs.readFileSync('editorial/task1-v166-legacy-mock-card-map.json','utf8'));
const v176=JSON.parse(fs.readFileSync('editorial/task1-v176-mechanics-manual-spec-audit.json','utf8'));
const v177=JSON.parse(fs.readFileSync('editorial/task1-v177-chemistry-legacy-tests-definitions.json','utf8'));
const expected=require('./task1-v154-legacy-evidence.cjs');
assert.equal(audit.version,'v178');assert.equal(audit.task1Complete,false);
assert.equal(audit.reviewed.length,44);assert.equal(audit.corrections.length,4);
assert.deepEqual([deck.cards.length,deck.cards.filter(c=>c.active!==false).length,deck.cards.filter(c=>c.active!==false&&c.mock===true).length],[3345,3341,2379]);
assert.equal(audit.baseline.remainingScience,788);assert.equal(audit.baseline.remainingChemistry,562);assert.equal(audit.baseline.remainingPhysics,226);
const old=new Set(original.records.map(x=>x.id)),done=new Set([...v176.reviewed,...v177.reviewed].map(x=>x.id)),byId=new Map(deck.cards.map(c=>[c.id,c]));
assert.equal(new Set(audit.reviewed.map(x=>x.id)).size,44);
for(const row of audit.reviewed){
 const c=byId.get(row.id);assert(c,'Missing '+row.id);
 assert(old.has(row.id)&&!done.has(row.id),'Already reviewed or missing historical '+row.id);
 assert(c.active!==false&&c.mock===true&&c.subject==='Chemistry','Not Chemistry mock '+row.id);
 assert.equal(c.front,row.front);assert.equal(c.back,row.back);
 assert(row.aqaSection&&(/^3\.1\./.test(row.aqaSection)||row.aqaSection==='7.2'),'Unexpected AQA section '+row.id);
}
for(const row of audit.corrections){
 const c=byId.get(row.id);assert(c&&c.active!==false&&c.mock===true);
 assert.equal(c.front,row.newFront);assert.equal(c.back,row.newBack);
 assert.equal(expected(row.id,'front',row.previousFront),row.newFront);
 assert.equal(expected(row.id,'back',row.previousBack),row.newBack);
 assert(c.accept&&c.accept.length>=3,'Correct-answer variants absent '+row.id);
}
assert.equal(audit.limits.notFullSyllabusCertification,true);assert.equal(audit.limits.noChangesToExamQuestionBank,true);
console.log('v178: audited 44 original Chemistry flashcards, four concise corrections; original IDs and mock counts preserved');
