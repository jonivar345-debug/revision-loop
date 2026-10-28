'use strict';
const fs=require('node:fs'), assert=require('node:assert/strict');
const deck=require('./task1-v162-historical-snapshot.cjs')(JSON.parse(fs.readFileSync('deck.json','utf8')));
const cards=deck.cards, newCards=cards.filter(c=>c.id.startsWith('task1_v130_'));
const prior=cards.filter(c=>!c.id.startsWith('task1_v130_')&&!c.id.startsWith('task1_v131_')&&!c.id.startsWith('task1_v132_')&&!c.id.startsWith('task1_v133_')&&!c.id.startsWith('task1_v134_')&&!c.id.startsWith('task1_v136_')&&!c.id.startsWith('task1_v138_')&&!c.id.startsWith('task1_v142_')&&!c.id.startsWith('task1_v144_')&&!c.id.startsWith('task1_v145_')&&!c.id.startsWith('task1_v146_')&&!c.id.startsWith('task1_v150_')&&!c.id.startsWith('task1_v152_')&&!c.id.startsWith('task1_v154_')&&!c.id.startsWith('task1_v155_')&&!c.id.startsWith('task1_v156_')&&!c.id.startsWith('task1_v157_')&&!c.id.startsWith('task1_v158_')&&!c.id.startsWith('task1_v159_')&&!c.id.startsWith('task1_v160_'));
assert(deck.deckVersion>=130);
assert.equal(prior.length,2686,'Every previous card ID must be retained');
assert.equal(prior.filter(c=>c.active!==false).length,2682);
assert.equal(newCards.length,160);
assert.equal(newCards.filter(c=>c.subject==='Physics').length,72);
assert.equal(newCards.filter(c=>c.subject==='Chemistry').length,84);
assert.equal(newCards.filter(c=>c.subject==='Maths').length,4);
const v155Excluded=new Set(require('../editorial/task1-v155-mock-scope-recall.json').changes.removedFromMock.map(x=>x.id));
assert.equal(newCards.filter(c=>c.mock||v155Excluded.has(c.id)).length,105,'Historical mock eligibility before v155 exclusions');
const ids=new Set(), fronts=new Set();
const key=s=>String(s).normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
for(const c of cards){
 assert(!ids.has(c.id),'Duplicate progress ID: '+c.id);ids.add(c.id);
 const k=c.subject+':'+key(c.front);
 if(c.id.startsWith('task1_v130_'))assert(!fronts.has(k),'Duplicate v130 question: '+c.id);
 fronts.add(k);
}
for(const id of ['phy_motion_d','chem_ar_def','math_modulus','task1_v124_phy_001','task1_v125_001','chem_y1_chat_v126_001','task1_v127_048','task1_v128_075','task1_v129_009'])assert(ids.has(id),'Prior ID missing: '+id);
const m=deck.meta.task1FlashcardAudit.v130;
assert.equal(m.startingCards,2686);assert.equal(m.added,160);
assert.deepEqual(m.bySubject,{Physics:72,Chemistry:84,Maths:4});
assert.equal(m.mockEligible,105);
assert.equal(deck.meta.task1FlashcardAudit.physicsNew,cards.filter(c=>c.subject==='Physics'&&c.id.startsWith('task1_')&&!c.id.startsWith('task1_v150_')&&!c.id.startsWith('task1_v152_')&&!c.id.startsWith('task1_v154_')&&!c.id.startsWith('task1_v155_')&&!c.id.startsWith('task1_v156_')&&!c.id.startsWith('task1_v157_')&&!c.id.startsWith('task1_v158_')&&!c.id.startsWith('task1_v159_')&&!c.id.startsWith('task1_v160_')).length);
assert.equal(deck.meta.task1FlashcardAudit.chemistryNew,cards.filter(c=>c.subject==='Chemistry'&&c.id.startsWith('task1_')&&!c.id.startsWith('task1_v150_')&&!c.id.startsWith('task1_v152_')&&!c.id.startsWith('task1_v154_')&&!c.id.startsWith('task1_v155_')&&!c.id.startsWith('task1_v156_')&&!c.id.startsWith('task1_v157_')&&!c.id.startsWith('task1_v158_')&&!c.id.startsWith('task1_v159_')&&!c.id.startsWith('task1_v160_')).length);
const app=fs.readFileSync('app.js','utf8');const a=app.indexOf('function normalise('),b=app.indexOf('function importantTokens(');
assert(a>=0&&b>a,'Missing current flashcard grader');
const evaluate=new Function('window',app.slice(a,b)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const c of newCards){
 assert(c.active===true&&c.kind==='content');
 assert(c.front.length<=165&&c.back.length<=205,'Excessive recall text '+c.id);
 assert(Array.isArray(c.accept)&&c.accept.length>=2,'Need alternative answers '+c.id);
 if(c.reject)for(const bad of c.reject)assert(!c.accept.includes(bad),'Contradictory accepted/rejected answer '+c.id);
 assert(/^(3\.\d+)(?:\.\d+)?$/.test(c.specRef),'Wrong AQA tag '+c.id);
 assert.equal(c.courseTopic,c.revisionTopic,'Inconsistent topic group '+c.id);
 assert(!/^(calculate|work out|show how to|prepare|mix|heat|use the following reagents)/i.test(c.front),'Not factual recall '+c.id);
 if(c.subject==='Physics'&&c.stage==='A2')assert.equal(c.mock,false,'Future Physics content in AS mock '+c.id);
 if(c.subject==='Chemistry'&&c.stage==='A2'&&!c.taught)assert.equal(c.mock,false,'Untaught A2 Chemistry in mock '+c.id);
 assert.equal(evaluate(c,c.back).status,'correct','Model answer not credited '+c.id);
 for(const ans of c.accept) assert.equal(evaluate(c,ans).status,'correct','Curated short answer rejected '+c.id+' / '+ans);
}
const bad=[
 ['Which prefix represents 10⁻¹⁵?','tera'],['What does the strong nuclear force do at very short separations below about 0.5 fm?','attractive'],
 ['What is the signed area under a velocity–time graph?','distance'],
 ['Where is kinetic energy zero in ideal SHM?','at equilibrium'],
 ['What happens to mean translational kinetic energy if absolute temperature doubles?','it halves'],
 ['What does decay constant represent?','time for half the nuclei to decay'],
 ['What does Ka quantify for a weak acid?','base dissociation'],['What is the nature of sulfur dioxide as an oxide?','basic'],
 ['What makes two molecules structural isomers?','different molecular formula'],
 ['What stereochemical arrangement is Z?','opposite sides'],['On an E-alkene, where are the two higher-priority substituents?','same side'],
 ['Which carbocation is normally most stable: primary, secondary or tertiary?','primary'],
 ['Which bond type distinguishes a polyester repeating link?','amide'],
 ['How many adjacent equivalent H atoms normally give a quartet in ¹H NMR?','two'],
 ['Why is phenylamine a weaker base than methylamine?','lone pair more available']
];
for(const [front,answer] of bad){
 const c=newCards.find(x=>x.front===front);assert(c,'Missing negative-answer case '+front);
 assert.notEqual(evaluate(c,answer).status,'correct','Wrong-answer false credit '+front+' / '+answer);
}
console.log('PASS v130: 160 concise recall cards; 2,686 earlier cards retained; alternatives, contradictions and mock scope tested.');
