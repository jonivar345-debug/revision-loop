'use strict';
// v346: one-way chemistry equation direction matters, even if every species
// in a reversed equation matches the model. Keep positive AQA variants.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const audit=j('editorial/task1-v346-chem-equation-direction-audit.json');
const deck=j('deck.json').cards,app=read('app.js'),sw=read('sw.js');
assert.equal(audit.version,'v346');assert.equal(deck.length,3345);
assert.deepEqual(audit.counts,{total:33,priorFullCredit:31,priorPartial:0,priorWrong:2});
assert.equal(audit.cases.length,33);assert.equal(new Set(audit.cases.map(c=>c.id)).size,33);
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);
assert(start>0&&end>start);
const evaluate=new Function('window',app.slice(start,end)+'\nreturn {evaluateCard,isReversedChemistryEquation,chemistryEquationSides};')({RevisionPhotoelectricCardMarking:null});
const mockStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),mockEnd=app.indexOf('function startMockSession(){',mockStart);
assert(mockStart>0&&mockEnd>mockStart);
const eligible=new Function(app.slice(mockStart,mockEnd)+'\nreturn mockEligibleCard;')();
const byId=new Map(deck.map(c=>[c.id,c]));
let originals=0,arrowRight=0,asciiRight=0,priorAccepted=0;
for(const testCase of audit.cases){
 const c=byId.get(testCase.id);
 assert(c,'Missing original Chemistry card '+testCase.id);
 assert.equal(c.front,testCase.front);assert.equal(c.back,testCase.model);
 assert.equal(c.subject,'Chemistry');assert.equal(c.mock,true);assert(eligible(c));
 assert(!evaluate.isReversedChemistryEquation(c,c.back),'Model cannot be its own reversal');
 assert.equal(evaluate.evaluateCard(c,c.back).status,'correct','Model answer rejected '+c.id);
 originals++;
 for(const variant of c.accept||[]){
  assert.equal(evaluate.evaluateCard(c,variant).status,'correct','Existing correct response broken '+c.id+': '+variant);
  priorAccepted++;
 }
 assert.equal(evaluate.isReversedChemistryEquation(c,testCase.reverseProbe),true,'Exact reversal not identified '+c.id);
 const wrong=evaluate.evaluateCard(c,testCase.reverseProbe);
 assert.equal(wrong.status,'wrong','Backward equation got full marks '+c.id);
 assert.equal(wrong.score,0);
 arrowRight++;
 const ascii=testCase.reverseProbe.replace(/→/g,'->');
 assert.equal(evaluate.isReversedChemistryEquation(c,ascii),true,'Typed ASCII arrow not recognised '+c.id);
 assert.equal(evaluate.evaluateCard(c,ascii).status,'wrong','ASCII backward equation credited '+c.id);
 asciiRight++;
}
// Preserve direction if student writes reactants in a different order.
const nacl=byId.get('chem_bh_defs_20261024_latt_formation_eq');
assert.equal(evaluate.isReversedChemistryEquation(nacl,'Cl-(g) + Na+(g) -> NaCl(s)'),false);
assert.equal(evaluate.isReversedChemistryEquation(nacl,'Na+(g) + Cl-(g) -> NaCl(s)'),false);
assert.equal(evaluate.isReversedChemistryEquation(nacl,'Na+(g) + Cl-(g) → NaCl(s)'),false);
assert.equal(evaluate.isReversedChemistryEquation(nacl,'NaCl(s) -> Na+(g) + Cl-(g)'),true);
assert.equal(evaluate.evaluateCard(nacl,'NaCl(s) -> Na+(g) + Cl-(g)').status,'wrong');
// Do not intercept legitimate non-Chemistry arrows or reversible equations.
const other={...nacl,subject:'Maths'};
assert.equal(evaluate.isReversedChemistryEquation(other,'NaCl(s) -> Na+(g) + Cl-(g)'),false);
assert.equal(evaluate.isReversedChemistryEquation({...nacl,mock:false},'NaCl(s) -> Na+(g) + Cl-(g)'),false);
assert.equal(evaluate.isReversedChemistryEquation({...nacl,back:'A(g) ⇌ B(g)'},'B(g) ⇌ A(g)'),false);
assert.equal(evaluate.isReversedChemistryEquation({...nacl,front:'Explain entropy change'},'NaCl(s) -> Na+(g) + Cl-(g)'),false);
assert.equal(evaluate.isReversedChemistryEquation(nacl,'I do not know'),false);
assert.equal(originals,33);assert.equal(arrowRight,33);assert.equal(asciiRight,33);
assert(sw.includes('v346-chemistry-equation-direction'),'Offline cache must include new scorer');
for(const id of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(id));
console.log('PASS v346: 33 original Chemistry equation models and '+priorAccepted+' old accepted variants remain correct; 66 reversed Unicode/ASCII equations rejected with 0 marks, all other subjects/scope untouched.');
