'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const app=fs.readFileSync('app.js','utf8');
const cards=deck.cards;
const fresh=cards.filter(c=>c.id.startsWith('task1_v129_'));
const prior=cards.filter(c=>!c.id.startsWith('task1_v129_')&&!c.id.startsWith('task1_v130_')&&!c.id.startsWith('task1_v131_')&&!c.id.startsWith('task1_v132_')&&!c.id.startsWith('task1_v133_')&&!c.id.startsWith('task1_v134_')&&!c.id.startsWith('task1_v136_')&&!c.id.startsWith('task1_v138_')&&!c.id.startsWith('task1_v142_')&&!c.id.startsWith('task1_v144_')&&!c.id.startsWith('task1_v145_')&&!c.id.startsWith('task1_v146_')&&!c.id.startsWith('task1_v150_'));
assert(deck.deckVersion>=129);
assert.equal(prior.length,2659,'Preserve every pre-v129 record and review ID');
assert.equal(prior.filter(c=>c.active!==false).length,2655);
assert.equal(fresh.length,27);
assert.equal(fresh.filter(c=>c.subject==='Physics').length,7);
assert.equal(fresh.filter(c=>c.subject==='Chemistry').length,20);
assert.equal(fresh.filter(c=>c.mock).length,7);
assert.equal(fresh.filter(c=>c.subject==='Chemistry'&&c.taught).length,0,'Future material must not leak into mocks');
const ids=new Set(),prompts=new Set();
const norm=s=>String(s).normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
for(const c of cards){
 assert(!ids.has(c.id),'Repeated saved-card ID: '+c.id); ids.add(c.id);
 const key=c.subject+':'+norm(c.front);
 if(c.id.startsWith('task1_v129_')) assert(!prompts.has(key),'Repeated new question: '+c.id);
 prompts.add(key);
}
for(const id of ['phy_motion_d','chem_ar_def','math_modulus','task1_v124_phy_001','chem_y1_chat_v126_001','task1_v127_048','task1_v128_075'])assert(ids.has(id),'Historical card removed '+id);
for(const c of fresh){
 assert(c.active===true&&c.kind==='content');
 assert(c.front.length<=165&&c.back.length<=205,'Not a concise recall card '+c.id);
 assert(/^(3\.3\.2\.3|3\.3\.13|3\.2\.5|3\.3\.16)$/.test(c.specRef),'Wrong AQA section '+c.id);
 assert(Array.isArray(c.accept)&&c.accept.length>=2,'Missing short-answer alternatives '+c.id);
 assert(!/^(calculate|work out|show how to|how to prepare)\b/i.test(c.front),'Worked or procedural question '+c.id);
 if(c.subject==='Physics')assert(c.stage==='AS'&&c.mock&&c.taught,'Physics November mock scope '+c.id);
 if(c.subject==='Chemistry')assert(c.stage==='A2'&&!c.mock&&!c.taught,'Untaught Chemistry leaked into mock '+c.id);
}
const audit=deck.meta.task1FlashcardAudit.v129;
assert.equal(audit.startingCards,2659);
assert.equal(audit.added,27);
assert.equal(audit.physicsAdded,7);
assert.equal(audit.chemistryAdded,20);
assert.equal(deck.meta.task1FlashcardAudit.physicsNew,cards.filter(c=>c.subject==='Physics'&&c.id.startsWith('task1_')&&!c.id.startsWith('task1_v150_')).length);
assert.equal(deck.meta.task1FlashcardAudit.chemistryNew,cards.filter(c=>c.subject==='Chemistry'&&c.id.startsWith('task1_')&&!c.id.startsWith('task1_v150_')).length);
const a=app.indexOf('function normalise('),b=app.indexOf('function importantTokens(');
assert(a>=0&&b>a,'Current flashcard grader not found');
const evaluate=new Function('window',app.slice(a,b)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const c of fresh){
 assert.equal(evaluate(c,c.back).status,'correct','Model answer rejected '+c.id);
 for(const accepted of c.accept)assert.equal(evaluate(c,accepted).status,'correct','Accepted short answer rejected '+c.id+' / '+accepted);
}
for(const [id,answer] of [
 ['task1_v129_002','different path lengths'],
 ['task1_v129_003','different wavelengths have different speeds'],
 ['task1_v129_005','pulse widening'],
 ['task1_v129_007','multimode fibre'],
 ['task1_v129_009','NH2 and COO-'],
 ['task1_v129_010','NH3+ and COOH'],
 ['task1_v129_015','three'],
 ['task1_v129_016','two'],
 ['task1_v129_020','wavelength gets longer'],
 ['task1_v129_023','MnO4-'],
 ['task1_v129_024','liquid'],
 ['task1_v129_026','the speed of the gas'],
 ['task1_v129_027','gas']
]){
 const c=fresh.find(x=>x.id===id);assert(c,'Misidentified negative test '+id);
 assert.notEqual(evaluate(c,answer).status,'correct','Incorrect alternative got full credit: '+id+' '+answer);
}
console.log('PASS v129: 27 targeted AQA cards; 2,659 earlier records unchanged; correct/incorrect answers and mock filters checked.');
