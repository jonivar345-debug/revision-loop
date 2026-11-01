'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const bank=json('maths_year1_pure_breadth_v260.json'),app=read('app.js');
const begin=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',begin);assert(begin>=0&&end>begin);
const mark=new Function('window',app.slice(begin,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const cases=[[6,9],[15,51],[16,348],[17,240],[18,24],[19,36],[23,10],[25,-3],[26,6.25],[33,-9],[35,13]];
let yes=0,no=0;
for(const [i,value] of cases){
 const c=bank.cards.find(c=>c.id==='task1_v260_maths_year1_'+String(i).padStart(2,'0'));
 assert(c&&c.numericRecall,'Missing numeric metadata card '+i);
 assert.equal(c.numericRecall.tolerance,1e-8);
 const notation=[value.toFixed(4),value.toExponential(3)];
 for(const ans of notation){assert.equal(mark(c,ans).status,'correct','Equivalent form not credited '+c.id+': '+ans);yes++;}
 for(const ans of [(value+0.01).toFixed(4),value+' Hz']){
  assert.equal(mark(c,ans).status,'wrong','Wrong magnitude or unit credited '+c.id+': '+ans);no++;
 }
 for(const ans of c.accept)assert.equal(mark(c,ans).status,'correct','Prior valid answer rejected '+c.id+': '+ans);
 for(const ans of c.reject)assert.equal(mark(c,ans).status,'wrong','Prior invalid answer credited '+c.id+': '+ans);
}
assert.equal(yes,22);assert.equal(no,22);
const unconfigured=bank.cards.find(c=>!c.numericRecall);assert(unconfigured);assert.equal(mark(unconfigured,unconfigured.back).status,'correct');
assert.equal(mark(unconfigured,'12.000').status,'wrong');
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v262: 11 first-mock Pure Maths numerical cards accept 22 equivalent numeric formats, reject 22 wrong values/units, old variants intact.');
