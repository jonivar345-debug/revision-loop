'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const app=fs.readFileSync('app.js','utf8');
const cards=deck.cards;
const newCards=cards.filter(c=>c.id.startsWith('task1_v125_'));
const previous=cards.filter(c=>!c.id.startsWith('task1_v125_')&&!c.id.startsWith('task1_v150_')&&!c.id.startsWith('task1_v152_')&&!c.id.startsWith('task1_v154_')&&!c.id.startsWith('task1_v155_'));
assert.ok(deck.deckVersion>=125);
assert.ok(cards.length>=2414);
assert.ok(cards.filter(c=>c.active!==false).length>=2410);
assert.ok(previous.length>=2251,'Original 2,251 cards retained before v125 and later additive releases');
assert.equal(newCards.length,163);
assert.equal(newCards.filter(c=>c.subject==='Physics').length,85);
assert.equal(newCards.filter(c=>c.subject==='Chemistry').length,78);
assert.equal(newCards.filter(c=>c.subject==='Maths').length,0);
const canonical=s=>String(s).normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
const ids=new Set(),fronts=new Set();
for(const c of cards){
 assert(!ids.has(c.id),'Duplicate card ID '+c.id);ids.add(c.id);
 const k=c.subject+':'+canonical(c.front);
 if(c.id.startsWith('task1_v125_'))assert(!fronts.has(k),'Repeated v125 question '+c.id);
 fronts.add(k);
}
for(const c of newCards){
 assert(c.active===true);
 assert(c.front.length<=170&&c.back.length<=205,'Long card '+c.id);
 assert(/^3\.\d|^7\.2 RP[1-6]$/.test(c.specRef),'Bad spec ref '+c.id);
 assert(c.kind==='content');
 assert(Array.isArray(c.accept)&&c.accept.length>=1);
 assert(c.stage==='AS'||c.stage==='A2');
 if(c.subject==='Physics')assert(c.stage==='AS'&&c.mock&&c.taught,'AS Physics availability '+c.id);
 if(c.subject==='Chemistry'&&c.stage==='A2'){const excluded=new Set(require('../editorial/task1-v155-mock-scope-recall.json').changes.removedFromMock.map(x=>x.id));assert(c.taught===true&&c.mock===!excluded.has(c.id),'Taught A2 cards retain taught status; mock reflects confirmed school scope '+c.id);}
 assert(!/^(calculate|work out)\b/i.test(c.front),'Worked question not flashcard');
}
for(const id of ['phy_motion_d','chem_ar_def','math_modulus','task1_v123_phy_001','task1_v124_phy_001','task1_v124_chem_001','task1_v124_bulk_math_001'])assert(ids.has(id),'Preserved ID missing '+id);
for(const excluded of ['task1_v125_086','task1_v125_116','task1_v125_137','task1_v125_162'])assert(!ids.has(excluded),'Excluded draft reappeared: '+excluded);
const audit=deck.meta.task1FlashcardAudit;
assert.equal(audit.v125.added,163);
assert.equal(audit.v125.physicsAdded,85);
assert.equal(audit.v125.chemistryAdded,78);
assert.equal(audit.v125.curatedVariantsOnCards,78);
assert.equal(audit.physicsNew,cards.filter(c=>c.subject==='Physics'&&c.id.startsWith('task1_')&&!c.id.startsWith('task1_v150_')&&!c.id.startsWith('task1_v152_')&&!c.id.startsWith('task1_v154_')&&!c.id.startsWith('task1_v155_')).length);
assert.equal(audit.chemistryNew,cards.filter(c=>c.subject==='Chemistry'&&c.id.startsWith('task1_')&&!c.id.startsWith('task1_v150_')&&!c.id.startsWith('task1_v152_')&&!c.id.startsWith('task1_v154_')&&!c.id.startsWith('task1_v155_')).length);
const b=app.indexOf('function normalise('),e=app.indexOf('function importantTokens(');
assert(b>0&&e>b,'Current marker not found');
const evaluate=new Function('window',app.slice(b,e)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const c of newCards){
 assert.equal(evaluate(c,c.back).status,'correct','Model answer wrongly rejected: '+c.id);
 for(const alt of c.accept)assert.equal(evaluate(c,alt).status,'correct','Curated alternative wrongly rejected: '+c.id+' / '+alt);
}
function card(front){const c=newCards.find(x=>x.front===front);assert(c,'Missing test card '+front);return c}
const examples=[
 ['What is a closed vector triangle used to represent?','three-force equilibrium','correct'],
 ['On an s–t graph, what does zero gradient mean?','zero velocity','correct'],
 ['Why can a longer collision time reduce the mean impact force?','same impulse over longer time','correct'],
 ['What does the gradient of an I–V graph give for an ohmic resistor?','conductance','correct'],
 ['What is the rate of flow of charge?','current','correct'],
 ['Which Period 3 element forms a giant covalent lattice?','silicon','correct'],
 ['What are k units for overall first order, with rate in mol dm⁻³ s⁻¹?','s^-1','correct'],
 ['What are k units for overall second order?','dm3 mol-1 s-1','correct'],
 ['Why does a weak-acid buffer resist added acid?','conjugate base takes H+','correct'],
 ['What does nucleophilic addition to propanone first create?','alkoxide','correct'],
 ['Why do carboxylic acids often boil above similar-sized esters?','hydrogen bonding','correct'],
 ['At the highest point of a projectile, is acceleration zero?','yes','wrong'],
 ['Which silver halide needs concentrated aqueous ammonia to dissolve?','AgI','wrong'],
 ['What is the oxidation number of Group 2 metals in their common compounds?','-2','wrong'],
 ['What colour is the 2,4-DNPH precipitate for carbonyl compounds?','blue','wrong'],
 ['If forward reaction is exothermic, how does warming affect Kc?','increases','wrong']
];
for(const [front,answer,status] of examples)assert.equal(evaluate(card(front),answer).status,status,'Marking error: '+front+' / '+answer);
console.log('PASS v125: 163 short AQA prompts; 2,251 existing IDs kept; all curated answers plus 16 marking checks');
