'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),bank=json('chemistry_thermodynamics_applications_v256.json');
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);
assert(start>0&&end>start);
const judge=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const numberIds=[1,2,3,4,5,6,7,8,9,10,11,17,18,28];
const get=n=>bank.cards.find(x=>x.id==='task1_v256_chem_thermo_'+String(n).padStart(2,'0'));
let accepted=0,rejected=0;
for(const n of numberIds){
 const c=get(n);assert(c&&c.numericRecall,'Missing configuration '+n);
 const value=c.numericRecall.value;
 for(const input of [value.toFixed(2)+' kJ/mol',(value*1000).toFixed(0)+' J mol^-1']){
  assert.equal(judge(c,input).status,'correct','Should credit '+n+': '+input);accepted++;
 }
 for(const input of [(value+1).toFixed(2)+' kJ/mol',value.toFixed(2)+' kJ']){
  assert.equal(judge(c,input).status,'wrong','Should reject '+n+': '+input);rejected++;
 }
 for(const a of c.accept){assert.equal(judge(c,a).status,'correct','Old correct answer regressed '+n+': '+a);}
 for(const a of c.reject){assert.equal(judge(c,a).status,'wrong','Old wrong answer credited '+n+': '+a);}
}
assert.equal(accepted,28);assert.equal(rejected,28);
// Explicit sign and near-miss protection, especially lattice formation/dissociation.
assert.equal(judge(get(1),'+787 kJ/mol').status,'wrong');
assert.equal(judge(get(1),'-786.9 kJ/mol').status,'wrong');
assert.equal(judge(get(1),'-787000 J/mol').status,'correct');
assert.equal(judge(get(17),'-90.20 kJ mol⁻¹').status,'correct');
assert.equal(judge(get(17),'-90.3 kJ/mol').status,'wrong');
// The original 24 v255 scientific-notation cases must still be run in CI.
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
console.log('PASS v258: 14 Gibbs/Born-Haber flashcards, 28 additional accepted unit equivalents and 28 rejected near-misses, original marking/progress preserved.');
