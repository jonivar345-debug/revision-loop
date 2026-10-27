'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const all=deck.cards.filter(c=>!c.id.startsWith('task1_v145_')&&!c.id.startsWith('task1_v146_'));
const added=all.filter(c=>c.id.startsWith('task1_v144_'));
const old=all.filter(c=>!c.id.startsWith('task1_v144_')&&!c.id.startsWith('task1_v145_')&&!c.id.startsWith('task1_v146_'));
assert(deck.deckVersion>=144);
assert.equal(all.length,3152);
assert.equal(all.filter(c=>c.active!==false).length,3148);
assert.equal(old.length,3144);
assert.equal(old.filter(c=>c.active!==false).length,3140);
assert.equal(added.length,8);
const norm=x=>x.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
const existing=new Set(old.map(c=>c.subject+':'+norm(c.front)));
const ids=new Set(old.map(c=>c.id));
for(let i=0;i<added.length;i++){
 const c=added[i];
 assert.equal(c.id,'task1_v144_'+String(i+1).padStart(3,'0'));
 assert(!ids.has(c.id),'Old review ID reused '+c.id);ids.add(c.id);
 assert(c.subject==='Chemistry'&&c.stage==='AS'&&c.taught===true&&c.mock===true&&c.scope==='mock'&&c.active===true&&c.strictRecall===true&&c.kind==='content');
 assert(c.front.length<=135&&c.back.length<=145,'Card too long '+c.id);
 assert(c.specRef.startsWith('3.'));
 assert(c.revisionTopic===c.topic&&c.courseTopic===c.topic);
 assert(c.accept.includes(c.back));
 assert(!existing.has(c.subject+':'+norm(c.front)),'Existing prompt duplicated '+c.id);
 existing.add(c.subject+':'+norm(c.front));
}
assert.equal(added.find(x=>x.id==='task1_v144_001').specRef,'3.1.2.2');
assert.equal(added.find(x=>x.id==='task1_v144_005').specRef,'3.1.3.4');
const app=fs.readFileSync('app.js','utf8');
const a=app.indexOf('function normalise('),b=app.indexOf('function importantTokens(');
assert(a>=0&&b>a);
const evaluate=new Function('window',app.slice(a,b)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const c of added)for(const answer of [c.back,...c.accept]){
 assert.equal(evaluate(c,answer).status,'correct','Stored model answer rejected '+c.id);
}
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])
 assert(app.includes(key),'Progress key changed unexpectedly');
assert.equal(deck.meta.task1FlashcardAudit.v144.added,8);
assert.equal(deck.meta.task1FlashcardAudit.v144.fullSpecCoverageCertified,false);
for(const id of ['task1_v142_001','task1_v138_015','chem_ionisation_def','phy_motion_d'])
 assert(ids.has(id),'Historic flashcard identity lost '+id);
console.log('PASS v144: 8 concise Year 1 Chemistry cards, 3,144 historical records intact, model answers accepted, mocks safe');
