'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const cards=deck.cards, fresh=cards.filter(c=>c.id.startsWith('task1_v131_'));
const prior=cards.filter(c=>!c.id.startsWith('task1_v131_')&&!c.id.startsWith('task1_v132_')&&!c.id.startsWith('task1_v133_')&&!c.id.startsWith('task1_v134_')&&!c.id.startsWith('task1_v136_')&&!c.id.startsWith('task1_v138_')&&!c.id.startsWith('task1_v142_')&&!c.id.startsWith('task1_v144_')&&!c.id.startsWith('task1_v145_')&&!c.id.startsWith('task1_v146_'));
assert(deck.deckVersion>=131);
assert.equal(prior.length,2846,'All previous review IDs must remain');
assert.equal(prior.filter(c=>c.active!==false).length,2842);
assert.equal(fresh.length,129);
assert.equal(fresh.filter(c=>c.subject==='Physics').length,70);
assert.equal(fresh.filter(c=>c.subject==='Chemistry').length,59);
assert.equal(fresh.filter(c=>c.mock).length,38);
const ids=new Set(),oldIds=new Set(prior.map(c=>c.id));
for(const c of cards){assert(!ids.has(c.id),'Repeated progress ID '+c.id);ids.add(c.id)}
for(const id of ['phy_motion_d','chem_ar_def','math_modulus','task1_v124_phy_001','task1_v125_001','chem_y1_chat_v126_001','task1_v127_048','task1_v128_075','task1_v129_009','task1_v130_160'])assert(oldIds.has(id),'Old ID vanished '+id);
const app=fs.readFileSync('app.js','utf8');const a=app.indexOf('function normalise('),b=app.indexOf('function importantTokens(');
assert(a>=0&&b>a,'Need website grader');
const evaluate=new Function('window',app.slice(a,b)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const normalize=s=>String(s).normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
const qset=new Set(prior.map(c=>c.subject+':'+normalize(c.front)));
for(const c of fresh){
 assert(c.active===true&&c.kind==='content');
 assert(c.front.length<=120&&c.back.length<=120,'Card exceeds concise length '+c.id);
 assert(Array.isArray(c.accept)&&c.accept.length>=2);
 assert(c.specRef&&c.topic&&c.courseTopic===c.topic,'Missing AQA/topic metadata '+c.id);
 assert.equal(c.mock,c.subject==='Chemistry'&&c.stage==='AS','Untaught scope or AS mock mismatch '+c.id);
 assert(!qset.has(c.subject+':'+normalize(c.front)),'Exact duplicate question: '+c.id);
 qset.add(c.subject+':'+normalize(c.front));
 assert.equal(evaluate(c,c.back).status,'correct','Rejects own model answer '+c.id);
 for(const ans of c.accept)assert.equal(evaluate(c,ans).status,'correct','Rejects accepted alternative '+c.id+' / '+ans);
}
const errors=[
['What observation from alpha scattering showed atoms are mostly empty space?','all alpha particles were reflected'],
['How does gravitational force vary with separation of two point masses?','directly proportional to distance squared'],
['What is the electric field direction between parallel plates?','negative to positive'],
['What is the sign of electric potential near an isolated negative charge?','positive'],
['How does parallel-plate capacitance change if plate area doubles?','halves'],
['What does the negative sign in Faraday\'s law represent?','amplifies the change'],
['What is the SI unit of magnetic flux?','tesla'],
['How does gamma intensity change when distance from a point source doubles?','twice'],
['How does an alpha emission change nucleon number?','decreases by two'],
['How does beta-minus emission change proton number?','decreases by one'],
['How does halogen oxidising ability change down Group 7?','increases'],
['What observation indicates iodide in the silver-ion halide test?','white precipitate'],
['What is the oxidation state of chlorine in ClO⁻?','-1'],
['Which Period 3 oxide is amphoteric?','sodium oxide'],
['What is the characteristic smell of many small esters?','odourless'],
['What do curly arrows show in an ionic organic mechanism?','movement of a single electron']
];
for(const [front,answer] of errors){const c=fresh.find(z=>z.front===front);if(!c)continue; assert.notEqual(evaluate(c,answer).status,'correct','Incorrect answer accepted '+front);}
const audit=deck.meta.task1FlashcardAudit.v131;
assert.equal(audit.added,129);assert.equal(audit.fullSpecCoverageCertified,false);
assert.equal(deck.meta.task1FlashcardAudit.physicsNew,cards.filter(c=>c.subject==='Physics'&&c.id.startsWith('task1_')).length);
assert.equal(deck.meta.task1FlashcardAudit.chemistryNew,cards.filter(c=>c.subject==='Chemistry'&&c.id.startsWith('task1_')).length);
console.log('PASS v131: 129 Physics and Chemistry AQA cards; 2,846 prior records intact; accepts and misconceptions tested.');
