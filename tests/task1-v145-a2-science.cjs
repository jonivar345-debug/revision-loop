'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const ledger=JSON.parse(fs.readFileSync('editorial/task1-v145-a2-science-evidence.json','utf8'));
const cards=deck.cards.filter(c=>!c.id.startsWith('task1_v146_')&&!c.id.startsWith('task1_v150_'));
const added=cards.filter(c=>c.id.startsWith('task1_v145_'));
const old=cards.filter(c=>!c.id.startsWith('task1_v145_')&&!c.id.startsWith('task1_v146_')&&!c.id.startsWith('task1_v150_'));
assert(deck.deckVersion>=145);
assert.equal(cards.length,3179);
assert.equal(cards.filter(c=>c.active!==false).length,3175);
assert.equal(old.length,3152);
assert.equal(old.filter(c=>c.active!==false).length,3148);
assert.equal(added.length,27);
assert.equal(added.filter(c=>c.subject==='Physics').length,8);
assert.equal(added.filter(c=>c.subject==='Chemistry').length,19);
const norm=x=>x.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
const oldPrompts=new Set(old.map(c=>c.subject+':'+norm(c.front)));
const ids=new Set(old.map(c=>c.id));
assert.equal(ids.size,old.length,'Historical IDs must be unique');
for(let i=0;i<added.length;i++){
 const c=added[i],id='task1_v145_'+String(i+1).padStart(3,'0');
 assert.equal(c.id,id);assert(!ids.has(id),'Old progress ID reused '+id);ids.add(id);
 assert.equal(c.active,true);assert.equal(c.kind,'content');assert.equal(c.strictRecall,true);
 assert.equal(c.stage,'A2');assert.equal(c.taught,false);assert.equal(c.mock,false);assert.equal(c.scope,'full');
 assert(c.specRef.startsWith('3.'),'Missing AQA section '+id);
 assert(c.front.length<=145&&c.back.length<=150,'Overlong recall card '+id);
 assert(c.accept.includes(c.back),'Model answer not accepted '+id);
 assert(Array.isArray(c.reject));assert(c.courseTopic===c.topic&&c.revisionTopic===c.topic);
 const key=c.subject+':'+norm(c.front);
 assert(!oldPrompts.has(key),'Duplicate prompt '+id);oldPrompts.add(key);
}
assert.equal(ledger.release,'v145');
assert.equal(ledger.completeSpecCertification,false);
assert.deepEqual(ledger.counts,{existingAnswerChecked:24,newCards:27,examQuestionNeeded:8,total:59});
assert.equal(ledger.records.length,59);
const lookup=new Map(cards.map(c=>[c.id,c]));
const statuses={};
for(const row of ledger.records){
 statuses[row.status]=(statuses[row.status]||0)+1;
 assert(/^https:\/\/www\.aqa\.org\.uk\//.test(row.sourceUrl),'Missing official specification source '+row.id);
 assert(row.requirement.length>20,'Vague requirement '+row.id);
 if(row.evidence){
  const c=lookup.get(row.evidence.cardId);assert(c,'Evidence ID missing '+row.id);
  assert.equal(c.subject,row.subject);assert.equal(c.front,row.evidence.front);assert.equal(c.back,row.evidence.back);
 }else assert.equal(row.status,'exam_question_needed');
}
assert.deepEqual(statuses,{answer_checked_narrow_recall:24,new_card_added:27,exam_question_needed:8});
const app=fs.readFileSync('app.js','utf8');
const i=app.indexOf('function normalise('),j=app.indexOf('function importantTokens(');
assert(i>=0&&j>i);
const evaluate=new Function('window',app.slice(i,j)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const c of added)for(const answer of [c.back,...c.accept]){
 assert.equal(evaluate(c,answer).status,'correct','Website rejects its own model answer '+c.id);
}
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])
 assert(app.includes(key),'Saved-progress identity changed');
assert.equal(deck.meta.task1FlashcardAudit.v145.added,27);
assert.equal(deck.meta.task1FlashcardAudit.v145.fullSpecCoverageCertified,false);
for(const id of ['chem_ionisation_def','task1_v131_001','task1_v142_001','task1_v144_008'])
 assert(lookup.has(id),'Historical review item removed '+id);
console.log('PASS v145: 27 concise A2 cards, 59 checked requirements, 3,152 old review IDs retained; answer grader and mock scope safe');
