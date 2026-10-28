'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const cards=deck.cards, added=cards.filter(c=>c.id.startsWith('task1_v138_'));
const old=cards.filter(c=>!c.id.startsWith('task1_v138_')&&!c.id.startsWith('task1_v142_')&&!c.id.startsWith('task1_v144_')&&!c.id.startsWith('task1_v145_')&&!c.id.startsWith('task1_v146_')&&!c.id.startsWith('task1_v150_')&&!c.id.startsWith('task1_v152_'));
assert(deck.deckVersion>=138);
assert(cards.length>=3128);
assert(cards.filter(c=>c.active!==false).length>=3124);
assert.equal(old.length,3113);
assert.equal(old.filter(c=>c.active!==false).length,3109);
assert.equal(added.length,15);
assert.deepEqual(added.reduce((o,c)=>(o[c.subject]=(o[c.subject]||0)+1,o),{}),{Maths:1,Physics:9,Chemistry:5});
const idSet=new Set(), oldFronts=new Set(old.map(c=>c.subject+':'+c.front.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'')));
for(const c of cards){assert(!idSet.has(c.id),'duplicate ID '+c.id);idSet.add(c.id);}
for(let i=0;i<added.length;i++){
 const c=added[i];assert.equal(c.id,'task1_v138_'+String(i+1).padStart(3,'0'));
 assert(!oldFronts.has(c.subject+':'+c.front.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'')),'duplicate front '+c.id);
 assert(c.front.length<=145&&c.back.length<=140,'Overlong flashcard '+c.id);
 assert(c.active===true&&c.kind==='content'&&c.strictRecall===true);
 assert(c.specRef.startsWith('3.'));
 assert(c.stage==='AS'||c.stage==='A2');
 assert(c.taught===c.mock&&c.mock===(c.stage==='AS'),'Mock filter mismatch '+c.id);
 assert.equal(c.scope,c.mock?'mock':'full');
 assert.equal(c.courseTopic,c.topic);assert.equal(c.revisionTopic,c.topic);
 assert(c.accept.includes(c.back),'Own answer missing '+c.id);
 assert(!c.front.includes('marks]'),'This must be a flashcard, not an exam question');
}
const math=added[0];assert.equal(math.subject,'Maths');
assert(math.front.includes('quotient'));assert(math.back.includes('logₐx − logₐy'));
const sensors=added.filter(c=>c.front.includes('Vout'));assert.equal(sensors.length,3);
const pv=added.find(c=>c.id==='task1_v138_009'),iv=added.find(c=>c.id==='task1_v138_010');
assert(pv.back.includes('Resistance'));assert(iv.back.includes('Conductance'));
const app=fs.readFileSync('app.js','utf8');
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(');
assert(start>=0&&end>start,'Typed grader not found');
const evaluate=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const c of added){
 assert.equal(evaluate(c,c.back).status,'correct','Website rejects v138 model answer '+c.id);
 for(const x of c.accept)assert.equal(evaluate(c,x).status,'correct','Website rejects explicit alias '+c.id);
}
assert.equal(deck.meta.task1FlashcardAudit.v138.added,15);
assert.equal(deck.meta.task1FlashcardAudit.v138.fullSpecCoverageCertified,false);
for(const id of ['math_logs_product','task1_v136_105','phy_resistance','task1_chem_121'])
 assert(idSet.has(id),'Existing stable review ID lost: '+id);
console.log('PASS v138: 15 targeted memory recall cards, stable history, Year 1 mock filters and typed answers');
