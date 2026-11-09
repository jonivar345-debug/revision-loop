'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const recall=require('../flashcard-priority-v429.js');
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const css=fs.readFileSync('styles.css','utf8');

const make=(subject,front,back,other={})=>({subject,front,back,active:true,...other});
const cases=[
 [make('Physics','Define the principle of superposition.','Resultant displacement is the sum of individual displacements.'),'definition'],
 [make('Physics','What is a lepton?','A fundamental particle not affected by the strong interaction.'),'definition'],
 [make('Chemistry','State Hess\'s law.','Enthalpy change depends only on initial and final states.'),'definition'],
 [make('Chemistry','What is meant by lattice formation enthalpy?','Enthalpy change when one mole of solid ionic lattice forms from gaseous ions.'),'definition'],
 [make('Physics','What is the formula for percentage uncertainty?','percentage uncertainty = absolute uncertainty / reading × 100'),'equation'],
 [make('Physics','What formula relates phase difference from path difference?','Δφ = 2π Δx/λ'),'equation'],
 [make('Physics','What is the relationship between intensity and amplitude?','I ∝ A²'),'equation'],
 [make('Chemistry','What formula gives heat transferred?','q = mcΔT'),'equation'],
 [make('Chemistry','What formula gives the magnitude of heat transferred for n mol at molar ΔH?','q = n × |ΔH|'),'equation'],
 [make('Maths','State the cosine rule equation.','a² = b²+c²-2bc cos A'),'equation'],
 [make('Maths','What is the derivative of e^(kx)?','k e^(kx)'),'equation'],
 [make('Maths','What is the sine rule equation?','a/sin A = b/sin B'),'equation'],
 [make('Physics','What is the formula for Newton’s second law?','F = ma'),null],
 [make('Physics','What is the wave equation?','v = fλ'),null],
 [make('Physics','What formula gives Young double-slit fringe spacing?','w = λD/s'),null],
 [make('Physics','What is the equation for power dissipated in a resistor?','P = I²R'),null],
 [make('Physics','What is the formula for ideal gas?','pV = nRT'),null],
 [make('Physics','What is the equation for SHM acceleration?','a = −ω²x'),null],
 [make('Maths','State the arithmetic series sum formula.','Sₙ = n/2(2a+(n−1)d)'),null],
 [make('Maths','What is the quotient rule for differentiation?','(fg′−f′g)/g²'),null],
 [make('Maths','What is the derivative of tan x?','sec²x'),null],
 [make('Maths','What is the exact value of tan 60°?','√3'),null],
 [make('Maths','For y=a/x², what is the sign of y if a>0?','Positive'),null],
 [make('Chemistry','What is the effect of a catalyst on activation energy?','It decreases activation energy.'),null],
 [make('Chemistry','What formula gives heat transferred?','q = mcΔT',{formulaBooklet:'provided'}),null],
 [make('Chemistry','What formula gives heat transferred?','q = mcΔT',{active:false}),null],
 [make('Chemistry','What is a lepton?','The answer',{memoryPriority:'definition'}),'definition'],
 [make('Chemistry','What is the route from masses to an empirical formula?','Mass → moles → divide by smallest.'),null],
 [make('Chemistry','If 2 mol of A react per equation, what is n_reaction from 0.10 mol A?','0.10 ÷ 2 = 0.050 mol'),null],
 [make('Chemistry','How do you check Hess arrows if the formula is forgotten?','Start → finish through cycle.'),null],
 [make('Chemistry','What equation relates heat, mass, specific heat and temperature rise?','q = mcΔT'),'equation'],
 [make('Chemistry','Write the atomisation equation for chlorine.','½Cl₂(g) → Cl(g)'),'equation'],
 [make('Chemistry','State the complete definition of ionic bonding.','Electrostatic attraction between opposite ions.'),'definition'],
 [make('Chemistry','State the complete definition of metallic bonding.','Attraction between positive ions and delocalised electrons.'),'definition'],
 [make('Physics','What is the meaning of decay constant λ?','Probability of decay per unit time.'),'definition'],
 [make('Physics','What is the meaning of mass defect?','Difference between free and bound nucleon masses.'),'definition'],
 [make('Maths','State the first-principles definition of f′(x).','lim(h→0) [f(x+h)−f(x)]/h'),'definition'],
 [make('Maths','What is the area formula using two sides a,b and included angle C?','A = ½ab sin C'),'equation'],
 [make('Maths','What form can a vector equation of a line take?','r = a + λb'),'equation']
];
let passed=0;
for(const [card,want] of cases){
 const got=recall.classify(card)?.kind||null;
 assert.equal(got,want,card.subject+' '+card.front);
 passed++;
}
const real=JSON.parse(fs.readFileSync('chemistry_mock_recall_v189.json','utf8'));
assert.equal(real.cards.length,1);
assert.equal(recall.classify(real.cards[0])?.kind,'equation');
assert.equal(recall.isMustKnow(real.cards[0]),true);
passed+=2;

// Exercise actual selection function with deterministic urgency and mixed facts.
// Don't reimplement selection logic in the test.
const start=app.indexOf('function isRecallMustKnow(card){');
const end=app.indexOf('// Mock-only exam questions',start);
assert(start>0&&end>start,'Real app priority selection functions are present.');
const selectorSource=app.slice(start,end);
const settings={recallMustKnowFirst:true};
const pick=new Function('window','settings','isNew','isDue','memoryHealth',selectorSource+';return pickRecallCards')(
 {RevisionFlashPriority:recall},settings,c=>c.unknown===true,c=>c.due===true,c=>c.memory??0.95);
const a=make('Chemistry','Define activation energy.','Minimum energy for a successful collision.',{id:'a',unknown:true});
const b=make('Physics','What is the formula for percentage uncertainty?','% = Δx / x × 100',{id:'b',due:true});
const c=make('Physics','What equation gives force from mass and acceleration?','F=ma',{id:'c',unknown:true});
const d=make('Chemistry','What happens if a catalyst is added?','Rate increases.',{id:'d',unknown:true});
const e=make('Physics','What is the formula for wave speed?','v = fλ',{id:'e',due:true});
const full=pick([c,d,a,e,b],5,()=>1);
assert.equal(full.length,5);
assert(full.slice(0,2).every(recall.isMustKnow),'Urgent must-memorise cards should lead.');
assert.deepEqual(new Set(full.map(x=>x.id)),new Set(['a','b','c','d','e']));
const short=pick([c,d,a,e,b],2,()=>1);
assert(short.every(recall.isMustKnow),'If more priority cards than capacity, prioritise only those.');
settings.recallMustKnowFirst=false;
const normal=pick([a],1,()=>1);
assert.equal(normal[0].id,'a');
passed+=6;

// UI, source scope, stable saved identity and offline readiness.
for(const id of ['mockMustKnowFirst','flashMustKnowFirst','flashMustKnowOnly','flashMustKnowCount']){
 assert(html.includes('id="'+id+'"'),id);
 assert(app.includes("'"+id+"'")||app.includes('"'+id+'"'),id+' not wired into app');
}
assert(html.indexOf('flashcard-priority-v429.js?v=429')<html.indexOf('app.js?v=429'),
  'Classifier must load before the app.');
assert(sw.includes("'./flashcard-priority-v429.js'"));
assert(sw.includes('v429-key-recall-priority'));
assert(css.includes('.recall-priority-option'));
assert(css.includes('.recall-priority-pill'));
assert(app.includes('settings.recallMustKnowOnly')&&app.includes('settings.recallMustKnowFirst'));
assert(app.includes('pickRecallCards(cardPool')&&app.includes('pickRecallCards(pool'));
assert(app.includes('urgentRecallMustKnow(b)')&&app.includes("const recallBadge="));
assert(app.includes('revisionLoopProgress5')&&app.includes('revisionLoopProfile11')&&app.includes('revisionLoopSettings11'));
assert(!app.includes('revisionLoopProgress6'),'Progress key must not be renamed.');
console.log('PASS v429: '+passed+' booklet-aware classifications and real weighted selection checks; UI, mock and cloud-progress identity unchanged.');
