'use strict';
// v347: do not grant marks for an unbalanced Chemistry reaction with one
// altered stoichiometric coefficient; test the real browser answer evaluator.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');
const json=p=>JSON.parse(read(p));
const audit=json('editorial/task1-v347-equation-balance-precision-audit.json');
const deck=json('deck.json').cards;
const app=read('app.js'),sw=read('sw.js');
assert.equal(audit.version,'v347');
assert.equal(deck.length,3345);
assert.deepEqual(audit.counts,{
 equations:48,newDirectionCases:15,originalV346EquationCases:33,
 coefficientPreviouslyFull:43,coefficientPreviouslyPartial:3,coefficientPreviouslyWrong:2
});
assert.equal(audit.cases.length,48);
assert.equal(new Set(audit.cases.map(c=>c.id)).size,48);
const begin=app.indexOf('function normalise(');
const finish=app.indexOf('function importantTokens(',begin);
assert(begin>0&&finish>begin,'Actual flashcard evaluator not found');
const grader=new Function('window',app.slice(begin,finish)+
 '\nreturn {evaluateCard,isReversedChemistryEquation,isSingleChemistryCoefficientError,isMockChemistryEquationRecall};'
)({RevisionPhotoelectricCardMarking:null});
const first=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS=');
const last=app.indexOf('function startMockSession(){',first);
assert(first>0&&last>first);
const mockEligibleCard=new Function(app.slice(first,last)+'\nreturn mockEligibleCard;')();
const byId=new Map(deck.map(c=>[c.id,c]));
let verifiedModels=0,accepted=0,reversals=0,badCoefficients=0;
for(const row of audit.cases){
 const c=byId.get(row.id);
 assert(c,'Missing card '+row.id);
 assert.equal(c.front,row.front,'Original prompt changed '+row.id);
 assert.equal(c.back,row.model,'Original model changed '+row.id);
 assert(c.subject==='Chemistry'&&c.mock===true&&mockEligibleCard(c),'Wrong eligibility '+row.id);
 assert(grader.isMockChemistryEquationRecall(c),'Missing equation prompt '+row.id);
 assert.equal(grader.evaluateCard(c,c.back).status,'correct','Model answer rejected '+row.id);
 verifiedModels++;
 for(const variant of c.accept||[]){
  assert.equal(grader.evaluateCard(c,variant).status,'correct','Accepted variant rejected '+row.id+': '+variant);
  accepted++;
 }
 assert(grader.isSingleChemistryCoefficientError(c,row.singleWrongCoefficient),'Wrong coefficient unrecognised '+row.id);
 const bad=grader.evaluateCard(c,row.singleWrongCoefficient);
 assert.equal(bad.status,'wrong','Incorrect coefficient credited '+row.id);
 assert.equal(bad.score,0,'Incorrect coefficient awarded points '+row.id);
 badCoefficients++;
 const parts=c.back.split('→');
 assert.equal(parts.length,2,'Expected one reaction arrow '+row.id);
 const reverse=parts[1].replace(/[.;\s]+$/,'')+' -> '+parts[0].trim();
 assert(grader.isReversedChemistryEquation(c,reverse),'Reverse ignored '+row.id);
 const scored=grader.evaluateCard(c,reverse);
 assert.equal(scored.status,'wrong','Reverse equation credited '+row.id);
 assert.equal(scored.score,0);
 reversals++;
}
const nacl=byId.get('chem_bh_defs_20261024_latt_formation_eq');
assert(nacl);
const scaled='2Na⁺(g) + 2Cl⁻(g) → 2NaCl(s)';
assert.equal(grader.isSingleChemistryCoefficientError(nacl,scaled),false,
 'A uniformly scaled balanced equation must not be rejected by the single-error guard');
assert.equal(grader.isSingleChemistryCoefficientError({...nacl,subject:'Maths'},'2Na⁺(g) + Cl⁻(g) → NaCl(s)'),false);
assert.equal(grader.isSingleChemistryCoefficientError({...nacl,mock:false},'2Na⁺(g) + Cl⁻(g) → NaCl(s)'),false);
assert.equal(grader.isSingleChemistryCoefficientError({...nacl,back:'A(g) ⇌ B(g)'},'2A(g) ⇌ B(g)'),false);
assert.equal(grader.isSingleChemistryCoefficientError({...nacl,front:'Describe enthalpy'},'2Na⁺(g) + Cl⁻(g) → NaCl(s)'),false);
assert.equal(grader.isSingleChemistryCoefficientError(nacl,'not sure'),false);
for(const id of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])
 assert(app.includes(id),'Local/cloud progress storage must remain stable');
assert(sw.includes('v347-chemistry-equation-balance'),'New code must invalidate the offline cache');
console.log('PASS v347: '+verifiedModels+' original model equations, '+accepted+
 ' existing accepted answers, '+reversals+' reverse equations and '+
 badCoefficients+' single incorrect coefficients assessed; core IDs unchanged.');
