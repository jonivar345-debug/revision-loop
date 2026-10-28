'use strict';
const {expectedCardField,expectedCardMock}=require('./task1-v154-historical-normalisation.cjs');
const fs=require('node:fs'),assert=require('node:assert/strict');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const oldAudit=JSON.parse(fs.readFileSync('editorial/task1-legacy-card-content-audit-v133.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-legacy-card-content-audit-v134.json','utf8'));
const a=deck.cards, prior=a.filter(c=>!c.id.startsWith('task1_v134_')&&!c.id.startsWith('task1_v136_')&&!c.id.startsWith('task1_v138_')&&!c.id.startsWith('task1_v142_')&&!c.id.startsWith('task1_v144_')&&!c.id.startsWith('task1_v145_')&&!c.id.startsWith('task1_v146_')&&!c.id.startsWith('task1_v150_')&&!c.id.startsWith('task1_v152_')&&!c.id.startsWith('task1_v154_')), fresh=a.filter(c=>c.id.startsWith('task1_v134_'));
assert(deck.deckVersion>=134);
assert.equal(prior.length,2994,'All older card records must survive');
assert.equal(prior.filter(c=>c.active!==false).length,2990);
assert.equal(fresh.length,14);assert.equal(fresh.filter(c=>c.subject==='Physics').length,8);
assert.equal(fresh.filter(c=>c.subject==='Chemistry').length,6);
assert(a.length>=3008);assert(a.filter(c=>c.active!==false).length>=3004);
assert.equal(audit.records.length,1113);assert.equal(audit.coverage.reviewed,1113);
assert.equal(audit.coverage.physicsReviewed,408);assert.equal(audit.coverage.chemistryReviewed,705);
assert.equal(audit.coverage.scienceLegacyRemaining,0);assert.equal(audit.coverage.mathsRemaining,103);
assert.equal(oldAudit.records.length,796);
assert.equal(audit.records.filter(c=>c.optionalModule).length,40);
assert.equal(audit.status.includes('NOT EXHAUSTIVE'),true);
const ids=new Set(),mapped=new Set(),priorIds=new Set(prior.map(c=>c.id));
for(const c of a){assert(!ids.has(c.id),'Duplicate progress ID '+c.id);ids.add(c.id);}
for(const c of audit.records){
 assert(!mapped.has(c.id),'Double legacy mapping '+c.id);mapped.add(c.id);
 const o=prior.find(x=>x.id===c.id);
 assert(o,'Audit ID must refer to existing earlier card: '+c.id);
 assert.equal(o.subject,c.subject,'Audit subject mismatch '+c.id);
 assert.equal(o.topic,c.originalTopic,'Audit topic mismatch '+c.id);
 assert.equal(o.front,expectedCardField(c.id,'front',c.front),'Audit front mismatch outside v154 '+c.id);
 assert(!o.specRef,'Only original untagged cards can be counted as legacy '+c.id);
 if(c.answer!==undefined)assert.equal(o.back,c.answer,'Audited model answer changed '+c.id);
 assert(c.contentChecked===true);
 assert(/^(3\.\d+(?:\.\d+){0,2}|7\.3)$/.test(c.candidateSpecSection),'Bad AQA section '+c.id);
}
for(const original of oldAudit.records)assert(mapped.has(original.id),'v133 audit entry deleted '+original.id);
for(const c of prior.filter(c=>c.active!==false&&!c.specRef&&['Physics','Chemistry'].includes(c.subject))){
 assert(mapped.has(c.id),'An active original science flashcard was not audited: '+c.id);
}
for(const c of audit.records.filter(c=>c.optionalModule)){
 assert.equal(c.candidateSpecSection,'3.10','Optional Medical Physics incorrectly classified');
 assert.equal(c.subject,'Physics');
}
const app=fs.readFileSync('app.js','utf8');
const begin=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(');
assert(begin>=0&&end>begin,'Website grader not available');
const evaluate=new Function('window',app.slice(begin,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const c of fresh){
 assert.equal(c.active,true);
 assert.equal(c.strictRecall,true);
 assert(c.front.length<=120&&c.back.length<=120,'Not short flashcard '+c.id);
 assert.equal(c.courseTopic,c.topic);assert.equal(c.revisionTopic,c.topic);
 assert.equal(c.taught,c.mock,'Scope mismatch '+c.id);
 assert.equal(c.mock,expectedCardMock(c.id,c.stage==='AS'),'Mock scope after v154 '+c.id);
 assert(c.accept.length>=3&&c.reject.length>=2,'Insufficient answer variants '+c.id);
 for(const v of c.accept)assert.equal(evaluate(c,v).status,'correct','Rejects correct alternative '+c.id+' '+v);
 for(const v of c.reject)assert.notEqual(evaluate(c,v).status,'correct','False credit for wrong answer '+c.id+' '+v);
}
const metadata=deck.meta.task1FlashcardAudit.v134;
assert.equal(metadata.added,14);
assert.equal(metadata.startingCards,2994);
assert.equal(metadata.scienceLegacyMapped,1113);
assert.equal(metadata.fullSpecCoverageCertified,false);
assert.equal(deck.meta.task1FlashcardAudit.physicsNew,a.filter(c=>c.subject==='Physics'&&c.id.startsWith('task1_')&&!c.id.startsWith('task1_v150_')&&!c.id.startsWith('task1_v152_')&&!c.id.startsWith('task1_v154_')).length);
assert.equal(deck.meta.task1FlashcardAudit.chemistryNew,a.filter(c=>c.subject==='Chemistry'&&c.id.startsWith('task1_')&&!c.id.startsWith('task1_v150_')&&!c.id.startsWith('task1_v152_')&&!c.id.startsWith('task1_v154_')).length);
console.log('PASS v134: all 1,113 original Physics/Chemistry card sections mapped; 103 maths pending; 14 short science additions tested; all 2,994 prior IDs preserved.');
