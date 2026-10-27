'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const cards=deck.cards;
const added=cards.filter(c=>c.id.startsWith('task1_v142_'));
const prior=cards.filter(c=>!c.id.startsWith('task1_v142_'));
assert.equal(deck.deckVersion,142);
assert.equal(cards.length,3144);
assert.equal(cards.filter(c=>c.active!==false).length,3140);
assert.equal(prior.length,3128);
assert.equal(prior.filter(c=>c.active!==false).length,3124);
assert.equal(added.length,16);
assert.deepEqual(added.reduce((x,c)=>(x[c.subject]=(x[c.subject]||0)+1,x),{}),{Physics:8,Chemistry:8});
const seen=new Set(), fronts=new Set();
for(const c of prior){
 assert(!seen.has(c.id),'Duplicate prior ID '+c.id);
 seen.add(c.id);
 if(c.active!==false)fronts.add(c.subject+':'+c.front.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,''));
}
for(let i=0;i<added.length;i++){
 const c=added[i],id='task1_v142_'+String(i+1).padStart(3,'0');
 assert.equal(c.id,id);
 assert(!seen.has(c.id),'Reused progress ID '+c.id);seen.add(c.id);
 assert(c.active===true&&c.kind==='content'&&c.strictRecall===true);
 assert(['Physics','Chemistry'].includes(c.subject));
 assert(c.specRef.startsWith('3.'));
 assert(c.front.length<=145 && c.back.length<=150,'Not concise retrieval '+c.id);
 assert(c.accept.length>0&&c.accept.includes(c.back));
 assert(Array.isArray(c.reject));
 assert(!c.front.toLowerCase().includes('marks]'));
 assert.equal(c.courseTopic,c.topic);assert.equal(c.revisionTopic,c.topic);
 assert.equal(c.scope,c.mock?'mock':'full');
 const n=c.subject+':'+c.front.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
 assert(!fronts.has(n),'Duplicate active subject prompt '+c.id);fronts.add(n);
 if(c.stage==='AS')assert(c.taught&&c.mock,'AS card missing from Year 1 study '+c.id);
 else assert(c.stage==='A2','Invalid stage '+c.id);
}
for(const id of ['task1_v142_013','task1_v142_014','task1_v142_015']){
 const c=added.find(x=>x.id===id);
 assert(c.stage==='A2'&&!c.taught&&!c.mock,'Untaught advanced chemistry must be out of mock');
}
const bio=added.find(c=>c.id==='task1_v142_016');
assert.equal(bio.stage,'A2');
assert(bio.taught&&bio.mock,'Previously taught biodiesel recall should stay in taught mock mode');
const app=fs.readFileSync('app.js','utf8');
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(');
assert(start>=0&&end>start);
const evaluate=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const c of added)for(const answer of [c.back,...c.accept]){
 assert.equal(evaluate(c,answer).status,'correct','Website must accept its own model answer '+c.id);
}
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"]){
 assert(app.includes(key),'Progress storage key changed unexpectedly');
}
assert.equal(deck.meta.task1FlashcardAudit.v142.added,16);
assert.equal(deck.meta.task1FlashcardAudit.v142.fullSpecCoverageCertified,false);
console.log('PASS v142: 16 short cards, old 3128/3124 preserved, new total 3144/3140, taught/mock and grading safe');
