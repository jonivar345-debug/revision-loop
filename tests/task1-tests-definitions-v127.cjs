'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const app=fs.readFileSync('app.js','utf8');
const cards=deck.cards;
const newCards=cards.filter(c=>c.id.startsWith('task1_v127_'));
const oldCards=cards.filter(c=>!c.id.startsWith('task1_v127_')&&!c.id.startsWith('task1_v128_')&&!c.id.startsWith('task1_v129_')&&!c.id.startsWith('task1_v130_')&&!c.id.startsWith('task1_v131_')&&!c.id.startsWith('task1_v132_')&&!c.id.startsWith('task1_v133_')&&!c.id.startsWith('task1_v134_')&&!c.id.startsWith('task1_v136_')&&!c.id.startsWith('task1_v138_')&&!c.id.startsWith('task1_v142_')&&!c.id.startsWith('task1_v144_'));
assert(deck.deckVersion>=127);
assert(cards.length>=2603);
assert(cards.filter(c=>c.active!==false).length>=2599);
assert.equal(oldCards.length,2514,'Retain every pre-v127 card and its progress ID');
assert.equal(oldCards.filter(c=>c.id.startsWith('chem_y1_chat_v126_')).length,100,'Keep all independent Year 1 Chemistry v126 additions');
assert.equal(newCards.length,89);
assert.equal(newCards.filter(c=>c.subject==='Chemistry').length,76);
assert.equal(newCards.filter(c=>c.subject==='Physics').length,13);
assert.equal(newCards.filter(c=>c.subject==='Maths').length,0);
const ids=new Set(),questions=new Set();
const norm=s=>String(s).normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
for(const c of cards){
 assert(!ids.has(c.id),'Duplicate ID: '+c.id);ids.add(c.id);
 const key=c.subject+':'+norm(c.front);
 if(c.id.startsWith('task1_v127_'))assert(!questions.has(key),'Repeated question '+c.id);
 questions.add(key);
}
for(const c of newCards){
 assert(c.active===true&&c.kind==='content','Inactive or wrong kind '+c.id);
 assert(c.front.length<=150&&c.back.length<=180,'Flashcard too long '+c.id);
 assert(/^(?:3\.\d|7\.[12])/.test(c.specRef),'Not AQA-tagged '+c.id);
 assert(c.accept.length>=1,'No answer variants '+c.id);
 assert(!/^(calculate|work out|show how to|how to make|how to prepare)\b/i.test(c.front),'Not a short recall prompt '+c.id);
 if(c.subject==='Physics')assert(c.stage==='AS'&&c.mock&&c.taught,'Year 1 Physics mock scope '+c.id);
 if(c.stage==='A2'&&c.taught===false)assert(c.mock===false,'Untaught A2 leaked into mock '+c.id);
 if(c.stage==='A2'&&c.taught===true)assert(c.subject==='Chemistry'&&c.mock,'Taught Chemistry mock scope '+c.id);
}
for(const id of ['phy_motion_d','chem_ar_def','math_modulus','task1_v123_phy_001','task1_v124_phy_001','task1_v125_001','chem_y1_chat_v126_001'])assert(ids.has(id),'Prior progress card missing '+id);
const audit=deck.meta.task1FlashcardAudit.v127;
assert.equal(audit.totalAdded,89);
assert.equal(audit.chemistryAdded,76);
assert.equal(audit.physicsAdded,13);
assert.equal(audit.baseCount,2514);
assert.equal(audit.chargeSensitiveExactCards,4);
assert.equal(deck.meta.task1FlashcardAudit.chemistryNew,cards.filter(c=>c.subject==='Chemistry'&&c.id.startsWith('task1_')).length);
assert.equal(deck.meta.task1FlashcardAudit.physicsNew,cards.filter(c=>c.subject==='Physics'&&c.id.startsWith('task1_')).length);
const b=app.indexOf('function normalise('),e=app.indexOf('function importantTokens(');
assert(b>=0&&e>b,'Current site marker missing');
const evaluate=new Function('window',app.slice(b,e)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const c of newCards){
 assert.equal(evaluate(c,c.back).status,'correct','Model answer not credited '+c.id);
 for(const accepted of c.accept)assert.equal(evaluate(c,accepted).status,'correct','Alternative rejected '+c.id+' / '+accepted);
}
const c=id=>{const card=newCards.find(x=>x.id===id);assert(card,'Missing '+id);return card};
for(const [id,answer] of [
 ['task1_v127_001','iodide'],
 ['task1_v127_002','chloride'],
 ['task1_v127_003','bromide'],
 ['task1_v127_006','oxygen'],
 ['task1_v127_007','nitrate'],
 ['task1_v127_028','aldehyde'],
 ['task1_v127_029','ketone'],
 ['task1_v127_048','iron(III)'],
 ['task1_v127_048','Fe3+'],
 ['task1_v127_049','iron(II)'],
 ['task1_v127_050','Fe3+'],
 ['task1_v127_051','Fe2+'],
 ['task1_v127_058','stoichiometric equivalence'],
 ['task1_v127_096','energy per kilogram']
])assert.notEqual(evaluate(c(id),answer).status,'correct','Wrong concept given full credit: '+id+' / '+answer);
for(const id of ['task1_v127_048','task1_v127_049','task1_v127_050','task1_v127_051']){
 assert.equal(c(id).strictRecall,true,'Oxidation-state label must use exact curated variants');
}
assert(!newCards.some(x=>['task1_v127_013','task1_v127_014','task1_v127_017','task1_v127_047','task1_v127_075','task1_v127_079','task1_v127_088','task1_v127_089','task1_v127_093'].includes(x.id)),'Pruned duplicates must stay excluded');
console.log('PASS v127: 89 concise test and definition cards, all model/accepted variants, 14 wrong-answer checks, and 2,514 previous IDs retained.');
