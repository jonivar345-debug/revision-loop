'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const app=fs.readFileSync('app.js','utf8'),bank=JSON.parse(fs.readFileSync('mock_short_recall_and_cloze_v298.json','utf8')).cards;
const a=app.indexOf('function normalise('),b=app.indexOf('function importantTokens(',a);
const api=new Function('window',app.slice(a,b)+'\nreturn {evaluateCard,normalise};')({RevisionPhotoelectricCardMarking:null});
assert.equal(bank.length,97);
let ok=0,no=0,cards=0;
for(const c of bank){
 assert(c.front.length<=115&&c.back.length<=95,c.id+' must be short');
 assert(c.method==='fill gaps'||!c.clozeParts,c.id+' unexpected cloze');
 const normalizedAccept=new Set(c.accept.map(api.normalise));
 const normalizedReject=new Set(c.reject.map(api.normalise));
 // The two symbol-strict cards distinguish |ΔH| from signed ΔH using the exact-symbol guard,
 // even though the ordinary prose normaliser deliberately strips vertical bars.
 if(!c.strictSymbolRecall)for(const x of normalizedReject)assert(!normalizedAccept.has(x),c.id+' contradiction: '+x);
 for(const x of c.accept){
  const result=api.evaluateCard(c,x);
  assert.equal(result.status,'correct',c.id+' valid input '+JSON.stringify(x)+' marked '+JSON.stringify(result));
  ok++;
 }
 for(const x of c.reject){
  const result=api.evaluateCard(c,x);
  assert.equal(result.status,'wrong',c.id+' rejected input '+JSON.stringify(x)+' marked '+JSON.stringify(result));
  no++;
 }
 if(c.accept.length>2)cards++;
}
assert.equal(ok,386);assert.equal(no,213);
assert(cards>=80);
const by=Object.fromEntries(bank.map(c=>[c.id,c]));
for(const [id,good,bad] of [
 ['task1_v298_maths_24','dy/dx = 12x² - 2','12x-2'],
 ['task1_v298_maths_27','∫6x² dx=2x³+C','2x³'],
 ['task1_v298_maths_11','x > -2 and x < 6','−2≤x≤6'],
 ['task1_v298_physics_08','9.8 m s⁻² downwards','0 m s⁻²'],
 ['task1_v298_physics_23','A quarter wavelength.','λ/2'],
 ['task1_v298_chemistry_04','[Ar] 3d⁵ 4s¹','3d⁴ 4s²'],
 ['task1_v298_chemistry_05','[Ar] 3d¹⁰ 4s¹','3d⁹ 4s²'],
 ['task1_v298_chemistry_12','20000 J','−20 kJ'],
 ['task1_v298_chemistry_23','49860 J/mol','−49.86 kJ mol⁻¹'],
 ['task1_v298_chemistry_26','1.0e-9 mol dm⁻³','1 × 10⁻⁵ mol dm⁻³'],
 ['task1_v298_maths_25','dy/dx=0 at x=a','f(a)=0'],
 ['task1_v298_chemistry_15','q=n|ΔH|','q = n × ΔH']
]){
 assert.equal(api.evaluateCard(by[id],good).status,'correct',id+' correct sample');
 assert.equal(api.evaluateCard(by[id],bad).status,'wrong',id+' incorrect sample');
}
console.log('PASS v303 '+bank.length+' short cards, '+ok+' vetted accepted and '+no+' explicitly rejected real-marker examples. Precise symbols, units, signs and constant of integration protected.');
