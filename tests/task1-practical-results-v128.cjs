'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const app=fs.readFileSync('app.js','utf8');
const cards=deck.cards;
const fresh=cards.filter(c=>c.id.startsWith('task1_v128_'));
const prior=cards.filter(c=>!c.id.startsWith('task1_v128_')&&!c.id.startsWith('task1_v129_')&&!c.id.startsWith('task1_v130_'));
assert(deck.deckVersion>=128);
assert(cards.length>=2659);
assert(cards.filter(c=>c.active!==false).length>=2655);
assert.equal(prior.length,2603,'No existing v127 and older progress card may be removed');
assert.equal(prior.filter(c=>c.id.startsWith('task1_v127_')).length,89);
assert.equal(prior.filter(c=>c.id.startsWith('chem_y1_chat_v126_')).length,100);
assert.equal(fresh.length,56);
assert.equal(fresh.filter(c=>c.subject==='Chemistry').length,49);
assert.equal(fresh.filter(c=>c.subject==='Physics').length,7);
assert.equal(fresh.filter(c=>c.mock).length,32);
assert.equal(fresh.filter(c=>!c.taught).length,24);
const ids=new Set(),questions=new Set();
const norm=s=>String(s).normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
for(const c of cards){
 assert(!ids.has(c.id),'Duplicate ID: '+c.id);ids.add(c.id);
 const q=c.subject+':'+norm(c.front);
 if(c.id.startsWith('task1_v128_'))assert(!questions.has(q),'Duplicated v128 prompt: '+c.id);
 questions.add(q);
}
for(const id of ['phy_motion_d','chem_ar_def','math_modulus','task1_v124_phy_001','task1_v125_001','task1_v127_048','chem_y1_chat_v126_001'])assert(ids.has(id),'Previously saved card ID removed: '+id);
for(const c of fresh){
 assert(c.active===true&&c.kind==='content');
 assert(c.front.length<=165&&c.back.length<=205,'Too long for recall '+c.id);
 assert(/^(3\.\d|7\.2 RP(?:5|6|7|8|9|10|11|12)$)/.test(c.specRef),'Unknown AQA spec tag '+c.id);
 assert(Array.isArray(c.accept)&&c.accept.length>=1,'No curated answer variants '+c.id);
 assert(!/^(calculate|work out|show how to|how to make|how to prepare)\b/i.test(c.front),'Procedural/long question '+c.id);
 if(c.subject==='Physics')assert(c.stage==='AS'&&c.taught&&c.mock,'Physics mock scope '+c.id);
 if(c.stage==='A2'&&!c.taught)assert(!c.mock,'Untaught A2 leaked into mock '+c.id);
 if(c.stage==='A2'&&c.mock)assert(c.subject==='Chemistry'&&c.taught,'Only taught A2 Chemistry appears in mock '+c.id);
}
const meta=deck.meta.task1FlashcardAudit.v128;
assert.equal(meta.startingCards,2603);
assert.equal(meta.newCards,56);
assert.equal(meta.physicsNew,7);
assert.equal(meta.chemistryNew,49);
assert.equal(meta.currentProposedTotal,2659);
assert.equal(deck.meta.task1FlashcardAudit.chemistryNew,cards.filter(c=>c.subject==='Chemistry'&&c.id.startsWith('task1_')).length);
assert.equal(deck.meta.task1FlashcardAudit.physicsNew,cards.filter(c=>c.subject==='Physics'&&c.id.startsWith('task1_')).length);
const a=app.indexOf('function normalise('),b=app.indexOf('function importantTokens(');
assert(a>=0&&b>a,'Existing answer-marking function not found');
const evaluate=new Function('window',app.slice(a,b)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const c of fresh){
 assert.equal(evaluate(c,c.back).status,'correct','Model answer marked incorrectly: '+c.id);
 for(const accepted of c.accept)assert.equal(evaluate(c,accepted).status,'correct','Valid alternative rejected: '+c.id+' / '+accepted);
}
const examples=[
 ['task1_v128_005','slower reaction rate'],
 ['task1_v128_011','pH'],
 ['task1_v128_012','volume'],
 ['task1_v128_014','after equivalence'],
 ['task1_v128_021','the reverse direction is feasible'],
 ['task1_v128_023','electrons pass through salt bridge'],
 ['task1_v128_026','cathode'],
 ['task1_v128_027','anode'],
 ['task1_v128_029','less purity'],
 ['task1_v128_030','raises and narrows melting range'],
 ['task1_v128_039','it proves unique identity'],
 ['task1_v128_040','one component'],
 ['task1_v128_041','it proves pure'],
 ['task1_v128_043','mobile phase'],
 ['task1_v128_044','stationary phase'],
 ['task1_v128_051','the ligand has no effect'],
 ['task1_v128_054','measures concentration precisely'],
 ['task1_v128_065','relative reaction rates'],
 ['task1_v128_067','systematic is scatter and random is bias'],
 ['task1_v128_075','emf is smaller than terminal pd']
];
for(const [id,answer] of examples){
 const c=fresh.find(x=>x.id===id);
 assert(c,'Missing wrong-answer test '+id);
 assert.notEqual(evaluate(c,answer).status,'correct','False full mark: '+id+' / '+answer);
}
for(const id of meta.removedCardIds)assert(!ids.has(id),'A pruned duplicate reappeared: '+id);
console.log('PASS v128: 56 concise AQA practical/definition cards, 2,603 unchanged prior IDs, all curated correct responses, 20 misconception tests.');
