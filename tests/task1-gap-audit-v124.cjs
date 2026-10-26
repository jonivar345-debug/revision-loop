'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const source=fs.readFileSync('app.js','utf8');
const cards=deck.cards;
const v124=cards.filter(c=>c.id.startsWith('task1_v124_'));
const old=cards.filter(c=>!c.id.startsWith('task1_v124_'));
assert.equal(deck.deckVersion,124);
assert.equal(cards.length,2251);
assert.equal(cards.filter(c=>c.active!==false).length,2247);
assert.equal(old.length,1826,'All previously live cards retained');
assert.equal(v124.length,425);
for(const [subject,n] of Object.entries({Physics:152,Chemistry:264,Maths:9})){
 assert.equal(v124.filter(c=>c.subject===subject).length,n,subject+' v124 count mismatch');
 assert.equal(deck.meta.task1FlashcardAudit[subject.toLowerCase()+'New'],cards.filter(c=>c.subject===subject&&c.id.startsWith('task1_')).length,'Audit metadata mismatch');
}
const norm=s=>String(s).normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
const fronts=new Set(),ids=new Set();
const visualNames=new Set([...source.matchAll(/if\(t==='([^']+)'\)/g)].map(x=>x[1]));
for(const c of cards){
 assert(!ids.has(c.id),'Duplicate ID '+c.id);ids.add(c.id);
 const f=c.subject+':'+norm(c.front);
 if(c.id.startsWith('task1_v124_'))assert(!fronts.has(f),'Duplicate new prompt '+c.id);
 fronts.add(f);
}
for(const c of v124){
 assert(c.active===true,'New card inactive '+c.id);
 assert(c.front.length<=170&&c.back.length<=205,'Flashcard too long '+c.id);
 assert(/^3\.\d/.test(c.specRef),'No AQA subsection tag '+c.id);
 assert(Array.isArray(c.accept)&&c.accept.length>=1,'Missing answer alternatives '+c.id);
 assert(!/^(calculate|work out)\b/i.test(c.front),'Long calculation belongs in practice '+c.id);
 if(c.stage==='A2'||c.stage==='Option')assert(c.mock===false,'Future/Year 2 must be outside AS mock '+c.id);
 if(c.visual||c.visualBack)assert(visualNames.has(c.visual||c.visualBack),'Unknown diagram '+c.id);
}
for(const id of ['phy_motion_d','chem_ar_def','math_modulus','task1_v123_phy_001','task1_v123_chem_071'])assert(ids.has(id),'Progress ID missing: '+id);
assert(!cards.some(c=>c.subject==='Physics'&&c.specRef==='3.7.6'),'No nonexistent Physics 3.7.6 section');
assert.equal(deck.meta.physicsUnits.find(x=>x.id==='a2-gravity').label,'3.7.2 Gravitational fields');
const back=cards.find(c=>c.front==='Which ion forms when ethanoic acid donates a proton?');
assert(back&&/ethanoate/i.test(back.back),'Conjugate-base accuracy');
const b=source.indexOf('function normalise('),e=source.indexOf('function importantTokens(');
assert(b>0&&e>b,'Existing evaluator located');
const evaluate=new Function('window',source.slice(b,e)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const card=front=>{const c=cards.find(x=>x.front===front);assert(c,'Missing test card: '+front);return c};
const cases=[
 ['What is the charge of an up quark?','+2/3','correct'],
 ['What is the charge of an up quark?','-2/3','wrong'],
 ['What is the charge of a down quark?','-1/3','correct'],
 ['What is the SI unit of impulse?','N s','correct'],
 ['How is impulse related to momentum?','change in momentum','correct'],
 ['What does the gradient of ln activity against time equal?','-lambda','correct'],
 ['What is the conjugate base of ethanoic acid?','ethanoate','correct'],
 ['Which ion forms when ethanoic acid donates a proton?','CH3COO-','correct'],
 ['What is the domain of f(x) = √x over the real numbers?','x>=0','correct'],
 ['What does the y-intercept of terminal p.d. against current show?','emf','correct'],
 ['Fill the gap: for a monatomic ideal gas, mean KE per atom = ____.','3kT/2','correct'],
 ['Why can graphite conduct electricity parallel to its layers?','delocalised electrons','correct'],
 ['What does f″(x) > 0 at a stationary point usually indicate?','maximum','wrong'],
 ['How does increasing temperature change Kp for an endothermic forward reaction?','decreases','wrong'],
 ['What colour is silver iodide precipitate?','white','wrong']
];
for(const [front,answer,status] of cases)assert.equal(evaluate(card(front),answer).status,status,'Marking error: '+front+' / '+answer);
assert.notEqual(evaluate(card('Why do ionic solids not conduct electricity?'),'ions are free to move').status,'correct','Opposite physical statement must not be credited as fully correct');
const stats=deck.meta.task1FlashcardAudit.v124;
assert.equal(stats.illustratedAnswerSide,21);
assert.equal(stats.additionalCloze,17);
assert.equal(stats.currentProposedCount,2251);
console.log('PASS: v124 425 short AQA recall cards; 1,826 existing IDs retained, chapter/mocks safe, marking alternatives and diagrams checked');
