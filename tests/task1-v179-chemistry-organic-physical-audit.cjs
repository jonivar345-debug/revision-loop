'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v179-chemistry-organic-physical-audit.json','utf8'));
const original=JSON.parse(fs.readFileSync('editorial/task1-v166-legacy-mock-card-map.json','utf8'));
const v176=JSON.parse(fs.readFileSync('editorial/task1-v176-mechanics-manual-spec-audit.json','utf8'));
const v177=JSON.parse(fs.readFileSync('editorial/task1-v177-chemistry-legacy-tests-definitions.json','utf8'));
const v178=JSON.parse(fs.readFileSync('editorial/task1-v178-chemistry-core-definitions.json','utf8'));
const historical=require('./task1-v154-legacy-evidence.cjs');
assert.equal(audit.version,'v179');assert.equal(audit.task1Complete,false);
assert.equal(audit.reviewed.length,48);assert.equal(audit.corrections.length,5);
assert.deepEqual([deck.cards.length,deck.cards.filter(c=>c.active!==false).length,deck.cards.filter(c=>c.active!==false&&c.mock===true).length],[3345,3341,2379]);
assert.deepEqual([audit.baseline.reviewedScienceTotal,audit.baseline.remainingScience,audit.baseline.remainingChemistry,audit.baseline.remainingPhysics],[231,740,514,226]);
const legacy=new Set(original.records.map(c=>c.id));
const prior=new Set([...v176.reviewed,...v177.reviewed,...v178.reviewed].map(c=>c.id));
const byId=new Map(deck.cards.map(c=>[c.id,c]));
assert.equal(new Set(audit.reviewed.map(r=>r.id)).size,48);
for(const r of audit.reviewed){
 const c=byId.get(r.id);assert(c,'Missing '+r.id);
 assert(legacy.has(r.id)&&!prior.has(r.id),'Wrong legacy review candidate '+r.id);
 assert(c.active!==false&&c.mock===true&&c.subject==='Chemistry','Lost school mock '+r.id);
 assert.equal(c.front,r.front);assert.equal(c.back,r.back);
 assert(/^(3\\.[123](?:\\.|$)|7\\.2$)/.test(r.aqaSection),'Bad AQA reference '+r.id);
}
for(const row of audit.corrections){
 const c=byId.get(row.id);assert(c&&c.mock===true);
 assert.equal(c.front,row.newFront);assert.equal(c.back,row.newBack);
 assert.equal(historical(row.id,'front',row.previousFront),row.newFront);
 assert.equal(historical(row.id,'back',row.previousBack),row.newBack);
 assert(c.accept&&c.accept.length>=3,'Correct answer alternatives absent '+row.id);
}
assert.equal(audit.limits.originalProgressIdsUnchanged,true);
assert.equal(audit.limits.noQuestionBankChanges,true);
assert.equal(audit.limits.fullSpecBulletCoverageNotCertified,true);
console.log('v179: 48 legacy Chemistry mock cards audited, five concise corrections, counts and IDs preserved');
