'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),bank=j('chemistry_amount_sigfig_formula_recall_v278.json');
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);
assert(start>=0&&end>start);
const evaluate=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const cards=new Map(bank.cards.map(c=>[c.id.slice(-2),c]));
const accepted={
 '02':['164.1','164.1.','1.641e2','1.641 × 10²','1.641 x 10^2'],
 '04':['0.00644 mol','6.44e-3 mol','6.44 × 10⁻³ mol','6.44 x 10^(-3) mol','6.44e-3','0.00644'],
 '09':['0.0200 mol','2.00 × 10⁻² mol','2.00e-2 mol','0.0200'],
 '10':['0.0250 mol','2.50 × 10⁻² mol','2.50e-2 mol','0.0250'],
 '14':['0.0200 mol','2.00 x 10^(-2) mol','2.00e-2 mol','0.0200']
};
const rejected={
 '02':['1.64 × 10²','1.641 × 10³','164.0','164.1 mol','1641'],
 '04':['6.4 × 10⁻³ mol','6.44 × 10⁻² mol','6.44 × 10⁻³ g','6.45e-3 mol','0.006440 mol','it is 6.44 × 10⁻³ mol'],
 '09':['2.0 × 10⁻² mol','2.00 × 10⁻³ mol','2.00 × 10⁻² mm','0.0100 mol','0.020 mol'],
 '10':['2.5 × 10⁻² mol','2.50 × 10⁻¹ mol','2.50 × 10⁻² g','0.250 mol','0.025 mol'],
 '14':['2.0 × 10⁻² mol','2.00 × 10⁻³ mol','2.00 × 10⁻² cm','0.0100 mol']
};
let yes=0,no=0;
for(const [key,examples] of Object.entries(accepted)){
 const card=cards.get(key);assert(card&&card.strictRecall===true&&card.numericRecall);
 assert(card.numericRecall.significantFigures>0);assert(card.numericRecall.allowUnitless===true);
 for(const input of examples){
   const result=evaluate(card,input);
   assert.equal(result.status,'correct',card.id+' failed known equivalent '+input+' '+JSON.stringify(result));
   yes++;
 }
 for(const input of rejected[key]){
   const result=evaluate(card,input);
   assert.equal(result.status,'wrong',card.id+' accepted wrong magnitude/precision/unit '+input+' '+JSON.stringify(result));
   no++;
 }
}
for(const card of bank.cards){
 assert.equal(evaluate(card,card.back).status,'correct','Existing model answer '+card.id);
 for(const a of card.accept||[])assert.equal(evaluate(card,a).status,'correct','Existing accepted '+card.id+' '+a);
 for(const r of card.reject||[])assert.equal(evaluate(card,r).status,'wrong','Existing rejected '+card.id+' '+r);
}
const nonNumeric=cards.get('03');
assert.equal(nonNumeric.numericRecall,undefined);assert.equal(nonNumeric.strictRecall,true);
assert.equal(evaluate(nonNumeric,'6.44 x 10^-3 mol').status,'wrong');
const oldCard={id:'independent_old_numeric',back:'2.5 m',numericRecall:{value:2.5,expected:'2.5 m',units:[{symbol:'m',toBase:1},{symbol:'mm',toBase:.001}],tolerance:1e-10,allowUnitless:false},subject:'Physics'};
assert.equal(evaluate(oldCard,'2.5 m').status,'correct');
assert.equal(evaluate(oldCard,'2500 mm').status,'correct');
assert.equal(evaluate(oldCard,'2.5 mm').status,'wrong');
assert.equal(evaluate(oldCard,'2.5').status,'wrong');
const required=["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"];
for(const k of required)assert(app.includes(k));
console.log('PASS v283: '+yes+' unseen correct numerical forms; '+no+' deliberately wrong examples; all 14 previous v278 cards and legacy opt-in strict numerical checks preserved.');
