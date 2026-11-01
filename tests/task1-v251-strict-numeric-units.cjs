'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const cards=json('physics_electricity_applications_v250.json').cards, app=read('app.js');
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);
assert(start>0&&end>start);
const judge=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const byId=n=>cards.find(c=>c.id==='task1_v250_physics_electricity_'+String(n).padStart(2,'0'));
const numbers=[1,2,3,4,15,16,17,18,21,22,23,24];
for(const n of numbers){const c=byId(n);assert(c,'Configured card '+n+' absent');assert(c.numericRecall);assert.equal(c.numericRecall.units.length>=2,true);}
const cases=[
 [1,['0.03000 A','30.0 mA','3e-2 A'],['0.03 mA','0.03 V','-0.03 A']],
 [2,['4.00 V','4000 mV'],['4.0 mV','4 A','-4 V']],
 [3,['12.00 Ω','0.012 kΩ','12ohms'],['12 kΩ','12 V','-12 Ω']],
 [4,['2.000 Ω','0.002 kΩ'],['2 kΩ','2 V']],
 [15,['8.00 V','8000 mV'],['8.00 mV','8 A']],
 [16,['2.000 kΩ','2000 ohms','2e3 Ω'],['2 Ω','2000 kΩ','2000 V']],
 [17,['6.00 V','6000 mV'],['6 mV','6 A']],
 [18,['4.500 V','4500 mV'],['4.5 A','4.5 mV']],
 [21,['0.4000 Ω','0.0004 kΩ'],['0.4 kΩ','0.4 V']],
 [22,['0.500 Ω','0.0005 kΩ'],['0.5 kΩ','0.5 A']],
 [23,['1.000 W','1000 mW'],['1 mW','1 V']],
 [24,['1.000 A','1000 mA'],['1 mA','1 V']]
];
let accepted=0,rejected=0;
for(const [n,valid,wrong] of cases){const c=byId(n);
 for(const answer of valid){assert.equal(judge(c,answer).status,'correct','Should credit '+n+': '+answer);accepted++;}
 for(const answer of wrong){assert.equal(judge(c,answer).status,'wrong','Should reject '+n+': '+answer);rejected++;}
}
assert.equal(accepted,27);assert.equal(rejected,28);
for(const c of cards)if(c.numericRecall){
 for(const answer of c.accept)assert.equal(judge(c,answer).status,'correct','Previously accepted variant regressed '+c.id+': '+answer);
 for(const answer of c.reject)assert.equal(judge(c,answer).status,'wrong','Previously wrong example now credited '+c.id+': '+answer);
}
// Other strict recall cards MUST NOT inherit the new numeric behaviour.
const other=cards.find(c=>!c.numericRecall);assert(other);
assert.equal(judge(other,other.back).status,'correct');
assert.equal(judge(other,'123 Ω').status,'wrong');
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v251: 12 numerical cards safely accept 27 new correct notations and reject 28 incorrect values/units; old markers and progress IDs remain intact.');
