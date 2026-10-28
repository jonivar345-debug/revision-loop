'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const d=JSON.parse(fs.readFileSync('deck.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-legacy-card-content-audit-v132.json','utf8'));
const a=d.cards,old=a.filter(c=>!c.id.startsWith('task1_v132_')&&!c.id.startsWith('task1_v133_')&&!c.id.startsWith('task1_v134_')&&!c.id.startsWith('task1_v136_')&&!c.id.startsWith('task1_v138_')&&!c.id.startsWith('task1_v142_')&&!c.id.startsWith('task1_v144_')&&!c.id.startsWith('task1_v145_')&&!c.id.startsWith('task1_v146_')&&!c.id.startsWith('task1_v150_')),fresh=a.filter(c=>c.id.startsWith('task1_v132_')),historic=a.filter(c=>!c.id.startsWith('task1_v133_')&&!c.id.startsWith('task1_v134_')&&!c.id.startsWith('task1_v136_')&&!c.id.startsWith('task1_v138_')&&!c.id.startsWith('task1_v142_')&&!c.id.startsWith('task1_v144_')&&!c.id.startsWith('task1_v145_')&&!c.id.startsWith('task1_v146_')&&!c.id.startsWith('task1_v150_'));
assert(d.deckVersion>=132);assert.equal(old.length,2975);assert.equal(old.filter(c=>c.active!==false).length,2971);
assert.equal(fresh.length,6);assert.equal(fresh.filter(c=>c.subject==='Physics').length,3);
assert.equal(fresh.filter(c=>c.subject==='Chemistry').length,3);
assert.equal(historic.length,2981);assert.equal(historic.filter(c=>c.active!==false).length,2977);
assert.equal(audit.coverage.activeLegacyCards,1216);
assert.equal(audit.coverage.reviewed,354);assert.equal(audit.coverage.notYetReviewed,862);
assert.equal(audit.records.length,354);
assert.equal(audit.coverage.physicsReviewed,audit.records.filter(c=>c.subject==='Physics').length);
assert.equal(audit.coverage.chemistryReviewed,audit.records.filter(c=>c.subject==='Chemistry').length);
const ids=new Set(a.map(c=>c.id)),visited=new Set();
assert.equal(ids.size,a.length,'duplicate progress ID');
for(const c of audit.records){
 assert(!visited.has(c.id),'duplicate reviewed ID '+c.id);visited.add(c.id);
 const original=old.find(x=>x.id===c.id);
 assert(original,'reviewed card missing '+c.id);
 assert.equal(original.front,c.front,'edited question invalidates audit '+c.id);
 assert.equal(original.subject,c.subject);assert.equal(original.topic,c.originalTopic);
 assert(!original.specRef,'audit must cover only untagged earlier cards '+c.id);
 assert(/^3\.\d+(?:\.\d+){0,2}$/.test(c.candidateSpecSection),'bad proposed AQA section '+c.id);
 assert(['concise-recall','worked-example-candidate','multi-point-recall-review','advanced-shape-example'].includes(c.reviewKind));
}
const app=fs.readFileSync('app.js','utf8');
const i=app.indexOf('function normalise('),j=app.indexOf('function importantTokens(');
assert(i>=0&&j>i);
const grade=new Function('window',app.slice(i,j)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const c of fresh){
 assert(c.strictRecall===true&&c.mock===true&&c.taught===true);
 assert(c.front.length<=120&&c.back.length<=120);
 assert(c.accept.length>=2&&c.reject.length>=2);
 for(const accepted of c.accept)assert.equal(grade(c,accepted).status,'correct','rejected valid answer '+c.id+': '+accepted);
 for(const rejected of c.reject)assert.notEqual(grade(c,rejected).status,'correct','accepted wrong alternative '+c.id+': '+rejected);
}
assert.equal(d.meta.task1FlashcardAudit.v132.legacyCardsContentReviewed,354);
assert.equal(d.meta.task1FlashcardAudit.v132.claimAllSpecificationCovered,false);
console.log('PASS v132: 354 legacy cards cross-checked against unchanged prompt IDs; 6 new gap cards and wrong-answer tests.');
