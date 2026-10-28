'use strict';
const allowed=require('./task1-v154-legacy-evidence.cjs');
const fs=require('node:fs'), assert=require('node:assert/strict');
const deck=require('./task1-v162-historical-snapshot.cjs')(JSON.parse(fs.readFileSync('deck.json','utf8')));
const d=deck.cards,old=d.filter(x=>!x.id.startsWith('task1_v133_')&&!x.id.startsWith('task1_v134_')&&!x.id.startsWith('task1_v136_')&&!x.id.startsWith('task1_v138_')&&!x.id.startsWith('task1_v142_')&&!x.id.startsWith('task1_v144_')&&!x.id.startsWith('task1_v145_')&&!x.id.startsWith('task1_v146_')&&!x.id.startsWith('task1_v150_')&&!x.id.startsWith('task1_v152_')&&!x.id.startsWith('task1_v154_')&&!x.id.startsWith('task1_v155_')&&!x.id.startsWith('task1_v156_')&&!x.id.startsWith('task1_v157_')&&!x.id.startsWith('task1_v158_')&&!x.id.startsWith('task1_v159_')&&!x.id.startsWith('task1_v160_')),newCards=d.filter(x=>x.id.startsWith('task1_v133_'));
const history=JSON.parse(fs.readFileSync('editorial/task1-legacy-card-content-audit-v132.json','utf8'));
const ledger=JSON.parse(fs.readFileSync('editorial/task1-required-practicals-ledger-v133.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-legacy-card-content-audit-v133.json','utf8'));
assert(deck.deckVersion>=133);
assert.equal(ledger.activities.length,24);
for(const rp of ledger.activities){
 assert(rp.cardCountByTaggedOrTopicMatch>0,'Missing representation for '+rp.subject+' RP'+rp.requiredPractical);
 assert(rp.linkedCardIds.length>0);
 for(const id of rp.linkedCardIds)assert(d.some(c=>c.id===id),'Practical ledger ID missing '+id);
}
assert.equal(old.length,2981);assert.equal(old.filter(c=>c.active!==false).length,2977);
assert.equal(newCards.length,13);assert.equal(newCards.filter(c=>c.subject==='Physics').length,5);
assert.equal(newCards.filter(c=>c.subject==='Chemistry').length,8);
assert.equal(d.length>=2994,true);assert.equal(d.filter(c=>c.active!==false).length>=2990,true);
assert.equal(audit.coverage.reviewed,796);assert.equal(audit.coverage.notYetReviewed,420);
assert.equal(audit.coverage.physicsReviewed,232);assert.equal(audit.coverage.chemistryReviewed,564);
assert.equal(audit.records.length,796);assert.equal(history.records.length,354);
const ids=new Set(d.map(c=>c.id));assert.equal(ids.size,d.length,'duplicate progress IDs');
const previouslyAudited=new Map(history.records.map(c=>[c.id,c]));
for(const prev of history.records){
 const preserved=audit.records.find(c=>c.id===prev.id);
 assert(preserved,'Previous reviewed card missing '+prev.id);
 assert.equal(preserved.front,prev.front,'Previous audit prompt changed '+prev.id);
}
const checked=new Set();
for(const c of audit.records){
 assert(!checked.has(c.id),'Repeated audit ID '+c.id);checked.add(c.id);
 const source=old.find(o=>o.id===c.id);
 assert(source,'Missing original card '+c.id);
 assert.equal(source.front,allowed(c.id,'front',c.front),'Prompt no longer same '+c.id);
 assert.equal(source.topic,c.originalTopic,'Topic no longer same '+c.id);
 assert.equal(source.subject,c.subject,'Subject no longer same '+c.id);
 assert(!source.specRef,'Legacy entries only '+c.id);
 assert(c.contentChecked===true);
 assert(/^(3\.\d+(?:\.\d+){0,2}|7\.3)$/.test(c.candidateSpecSection),'Section reference invalid '+c.id);
 assert(['concise-recall','worked-example-candidate','multi-point-recall-review','advanced-shape-example','diagram-practice-candidate','exam-question-candidate','method-context-card-review'].includes(c.reviewKind));
}
const app=fs.readFileSync('app.js','utf8');const a=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(');
assert(a>=0&&end>a,'Flashcard grading evaluator not found');
const evaluate=new Function('window',app.slice(a,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const c of newCards){
 assert(c.active===true&&c.strictRecall===true);
 assert(c.front.length<=120&&c.back.length<=120);
 assert(c.specRef&&c.courseTopic===c.revisionTopic);
 assert(c.accept.length>=3&&c.reject.length>=2);
 assert.equal(c.mock,c.stage==='AS','Future content leaked into mocks');
 assert.equal(c.taught,c.mock);
 for(const ok of c.accept)assert.equal(evaluate(c,ok).status,'correct','Valid short response not accepted '+c.id+' / '+ok);
 for(const bad of c.reject)assert.notEqual(evaluate(c,bad).status,'correct','Wrong alternative received full credit '+c.id+' / '+bad);
}
const meta=deck.meta.task1FlashcardAudit.v133;
assert.equal(meta.startingCards,2981);assert.equal(meta.added,13);
assert.equal(meta.physicsAdded,5);assert.equal(meta.chemistryAdded,8);
assert.equal(meta.legacyReviewedCumulative,796);assert.equal(meta.legacyStillPending,420);
assert.equal(meta.completeSpecClaim,false);
assert.equal(deck.meta.task1FlashcardAudit.physicsNew,d.filter(c=>c.subject==='Physics'&&c.id.startsWith('task1_')&&!c.id.startsWith('task1_v150_')&&!c.id.startsWith('task1_v152_')&&!c.id.startsWith('task1_v154_')&&!c.id.startsWith('task1_v155_')&&!c.id.startsWith('task1_v156_')&&!c.id.startsWith('task1_v157_')&&!c.id.startsWith('task1_v158_')&&!c.id.startsWith('task1_v159_')&&!c.id.startsWith('task1_v160_')).length);
assert.equal(deck.meta.task1FlashcardAudit.chemistryNew,d.filter(c=>c.subject==='Chemistry'&&c.id.startsWith('task1_')&&!c.id.startsWith('task1_v150_')&&!c.id.startsWith('task1_v152_')&&!c.id.startsWith('task1_v154_')&&!c.id.startsWith('task1_v155_')&&!c.id.startsWith('task1_v156_')&&!c.id.startsWith('task1_v157_')&&!c.id.startsWith('task1_v158_')&&!c.id.startsWith('task1_v159_')&&!c.id.startsWith('task1_v160_')).length);
console.log('PASS v133: 442 newly reviewed legacy cards; 796 total. 13 concise practical recall cards; all 2,981 prior IDs preserved.');
