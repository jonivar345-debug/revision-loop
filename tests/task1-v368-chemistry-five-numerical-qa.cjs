'use strict';
// v368: independent numerical QA for five existing original 42-mark Chemistry mock application questions.
// This test does not purport to mark handwritten answers or certify complete AQA content.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const read = p => JSON.parse(fs.readFileSync(p,'utf8'));
const audit = read('editorial/task1-v368-chemistry-five-numerical-qa.json');
const bank = read('chemistry_rates_rp7_kp_v210.json');
const deck = read('deck.json');
const app = fs.readFileSync('app.js','utf8');
assert.equal(audit.version,'v368');
assert.equal(bank.questions.length,5);
assert.equal(audit.entries.length,5);
assert.equal(audit.counts.independentlyGradedStudentAnswers,0);
assert.equal(audit.counts.independentComputedValues,28);
assert.equal(deck.cards.length,3345);
assert.equal(new Set(deck.cards.map(c=>c.id)).size,3345);
assert(app.includes('chemistry_rates_rp7_kp_v210.json'),'Five-question source must load in the live website');
const original = new Map(bank.questions.map(q=>[q.id,q]));
let marks = 0;
for(const entry of audit.entries){
  const q = original.get(entry.id);
  assert(q,'Missing original Chemistry question '+entry.id);
  assert.equal(q.subject,'Chemistry');
  assert.equal(q.level,'A2');
  assert.equal(q.mock,true);
  assert.equal(q.taught,true);
  assert.equal(q.requiresWorking,true);
  assert.equal(q.answerType,'points');
  assert.equal(q.specRef,entry.specRef);
  assert.equal(q.prompt,entry.prompt);
  assert.equal(q.modelAnswer,entry.modelAnswer);
  assert.deepEqual(q.markPoints,entry.markPoints);
  assert.deepEqual(q.markPointMarks,entry.markPointMarks);
  assert.equal(q.marks,entry.marks);
  assert.equal(q.markPointMarks.reduce((a,b)=>a+b,0),q.marks);
  assert.equal(q.markPoints.length,q.marks);
  assert(q.markPointMarks.every(n=>n===1));
  marks+=q.marks;
}
assert.equal(marks,42);
const expected=new Map(audit.expectedNumericValues.map(x=>[x.id+'::'+x.quantity,x]));
assert.equal(expected.size,28);
function check(id,name,computed){
  const e=expected.get(id+'::'+name);
  assert(e,'Missing approved expected result '+id+' / '+name);
  assert(Number.isFinite(computed));
  assert(Math.abs(computed-e.expected) <= Math.max(1e-12,Math.abs(e.expected)*1e-9),
    id+' '+name+': calculated '+computed+' but audit expects '+e.expected);
}
// Original question numbers are fixed by the full exact prompt snapshot above.
// Q1: independently infer reaction orders from experiments, then verify k and prediction.
const q1='task1_v210_chem_01';
const orderA=Math.log(8e-4/2e-4)/Math.log(.200/.100);
const orderB=Math.log(4e-4/2e-4)/Math.log(.400/.200);
const k=2e-4/(.100**orderA*.200**orderB);
check(q1,'orderA',orderA);check(q1,'orderB',orderB);
check(q1,'totalOrder',orderA+orderB);
check(q1,'rateConstant',k);
check(q1,'predictedRate',k*.300**orderA*.100**orderB);
check(q1,'exp4Consistency',k*.200**orderA*.400**orderB);
// Q2: the negative slope is not the same sign as a positive disappearance rate.
const q2='task1_v210_chem_02';
const dc=.081-.099,dt=50-30,tangent=dc/dt;
check(q2,'tangentChange',dc);
check(q2,'tangentTime',dt);
check(q2,'signedTangentGradient',tangent);
check(q2,'positiveDisappearanceRate',-tangent);
check(q2,'averageRate',(.140-.064)/80);
assert(tangent<0);
// Q3: constant concentration drop for zero order; constant half-life for first order.
const q3='task1_v210_chem_03';
const kZero=(.080-.060)/20,halfLife=20;
check(q3,'zeroOrderRateConstant',kZero);
check(q3,'halfLife',halfLife);
check(q3,'firstOrderRateConstant',Math.log(2)/halfLife);
check(q3,'predictedYAt60',.080*(.5**(60/halfLife)));
// Q4: correct use of negative Arrhenius gradient, e^intercept and e^ln(k).
const q4='task1_v210_chem_04';
const R=8.31,gradient=-9000,intercept=25,T=300;
const Ea=-gradient*R;
check(q4,'activationEnergyJ',Ea);
check(q4,'activationEnergyKJ',Ea/1000);
check(q4,'preExponentialA',Math.exp(intercept));
check(q4,'lnKAt300',gradient/T+intercept);
check(q4,'kAt300',Math.exp(gradient/T+intercept));
// Q5: both equilibrium amounts, the correct stoichiometry, partial pressures and Kp units.
const q5='task1_v210_chem_05';
const initialN2O4=1.00,disso=.400,totalP=140;
const nN2O4=initialN2O4-disso,nNO2=2*disso,total=nN2O4+nNO2;
const xN2O4=nN2O4/total,xNO2=nNO2/total;
const pN2O4=xN2O4*totalP,pNO2=xNO2*totalP;
check(q5,'nN2O4',nN2O4);
check(q5,'nNO2',nNO2);
check(q5,'totalMoles',total);
check(q5,'fractionN2O4',xN2O4);
check(q5,'fractionNO2',xNO2);
check(q5,'pN2O4',pN2O4);
check(q5,'pNO2',pNO2);
check(q5,'Kp',pNO2*pNO2/pN2O4);
assert.equal(xNO2+xN2O4,1);
// The displayed model solutions must actually contain the recomputed rounded values and appropriate units.
const solutionTokens={
  [q1]:['second order in A','first order in B','rate = k[A]²[B]','k = 0.100','dm⁶ mol⁻² s⁻¹','9.00×10⁻⁴ mol dm⁻³ s⁻¹'],
  [q2]:['−9.00×10⁻⁴ mol dm⁻³ s⁻¹','+9.00×10⁻⁴ mol dm⁻³ s⁻¹','9.50×10⁻⁴ mol dm⁻³ s⁻¹','instantaneous rate'],
  [q3]:['1.00×10⁻³','mol dm⁻³ s⁻¹','20 s','0.0347 s⁻¹','First-order k has units s⁻¹'],
  [q4]:['74,790 J mol⁻¹','74.8 kJ mol⁻¹','7.20×10¹⁰ s⁻¹','−5.00','6.74×10⁻³ s⁻¹'],
  [q5]:['0.600 mol','0.800 mol','1.40 mol','60.0 kPa','80.0 kPa','Kp = p(NO₂)²/p(N₂O₄)','107 kPa','Kp remains unchanged']
};
for(const [id,tokens] of Object.entries(solutionTokens)){
  for(const token of tokens) assert(original.get(id).modelAnswer.includes(token),
    'Original solution missing independently checked token '+id+' / '+token);
}
assert.equal(audit.explicitLimitations.length,6);
console.log('PASS v368: 28 independently calculated numerical checks and 42 unchanged mark points across 5 original, loaded Chemistry mock questions; methods and student answers remain ungraded.');
