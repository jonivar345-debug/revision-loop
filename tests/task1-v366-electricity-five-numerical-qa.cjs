'use strict';
// v366: independently computed numerical checks for 5 previously linked Physics Electricity original questions.
const fs=require('node:fs'),assert=require('node:assert/strict');
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const audit=json('editorial/task1-v366-electricity-five-numerical-qa.json');
const deck=json('deck.json').cards;
assert.equal(deck.length,3345);assert.equal(new Set(deck.map(x=>x.id)).size,3345);
assert.equal(audit.version,'v366');assert.equal(audit.entries.length,5);
assert.equal(new Set(audit.entries.map(x=>x.id)).size,5);
assert.equal(audit.counts.studentAnswersMarked,0);
const a=new Map(json('science_practical_data_v194.json').questions.map(q=>[q.id,q]));
const b=new Map(json('physics_graphs_circuits_v203.json').questions.map(q=>[q.id,q]));
let marks=0;
for(const e of audit.entries){
 const src=e.source==='science_practical_data_v194.json'?a:e.source==='physics_graphs_circuits_v203.json'?b:null;
 assert(src,'Unknown question source');const q=src.get(e.id);assert(q,'Question missing '+e.id);
 assert.equal(q.subject,'Physics');assert.equal(q.level,'AS');assert.equal(q.mock,true);assert.equal(q.requiresWorking,true);
 assert.equal(q.prompt,e.prompt);assert.equal(q.modelAnswer,e.modelAnswer);
 assert.deepEqual(q.markPoints,e.markPoints);assert.deepEqual(q.markPointMarks,e.markPointMarks);
 assert.equal(q.marks,e.marks);assert.equal(q.markPointMarks.reduce((x,y)=>x+y,0),q.marks);
 assert.equal(q.markPoints.length,q.marks);marks+=q.marks;
}
assert.equal(marks,37);
function close(actual,want,description){assert(Math.abs(actual-want)<=Math.max(1e-11,Math.abs(want)*1e-7),description+': '+actual+' vs '+want);}
const expected=new Map(audit.independentExpectedCalculations.map(e=>[e.id+'::'+e.quantity,e.expected]));
const assertNum=(id,label,result)=>close(result,expected.get(id+'::'+label),id+' '+label);
const [q1,q2,q3,q4,q5]=audit.entries.map(e=>e.id);
const gradientR=(2.80-1.40)/(0.700-0.350);const area=Math.PI*(0.000500**2)/4;
assertNum(q1,'gradient ΔR/ΔL',gradientR);assertNum(q1,'area πd²/4',area);assertNum(q1,'resistivity',gradientR*area);
const r=-(1.18-1.42)/(0.75-0.25),emf=1.42+r*0.25;
assertNum(q2,'V vs I gradient',-r);assertNum(q2,'cell emf',emf);assertNum(q2,'V at 1 A',emf-r*1);
const unloaded=12*6/(3+6),equiv=6*6/(6+6),loaded=12*equiv/(3+equiv);
assertNum(q3,'unloaded output',unloaded);assertNum(q3,'loaded equivalent lower resistor',equiv);assertNum(q3,'loaded output',loaded);assertNum(q3,'supply current',12/(3+equiv));assertNum(q3,'load current',loaded/6);
assertNum(q4,'NTC output cool',10*4/(4+4));assertNum(q4,'NTC output hot',10*1/(4+1));assertNum(q4,'LDR output dark',10*10/(5+10));assertNum(q4,'LDR output bright',10*2/(5+2));
const rr=-(1.10-1.40)/(0.80-0.20),eps=1.40+rr*0.20,current=eps/(2+rr);
assertNum(q5,'internal resistance',rr);assertNum(q5,'cell emf',eps);assertNum(q5,'circuit current',current);assertNum(q5,'terminal voltage',current*2);assertNum(q5,'internal lost volts',current*rr);
assertNum(q5,'external power',current**2*2);assertNum(q5,'internal heating',current**2*rr);assertNum(q5,'chemical power',eps*current);
close(eps*current,current**2*(2+rr),'Power conservation');
const expectedModelTokens={
 'task1_v194_practical_05':['4.00 Ω m⁻¹','1.96×10⁻⁷ m²','7.85×10⁻⁷ Ω m'],
 'task1_v194_practical_06':['−0.48 V A⁻¹','1.54 V','1.06 V'],
 'task1_v203_phy_06':['8.0 V','3.0 kΩ','6.0 V','2.00 mA','1.00 mA'],
 'task1_v203_phy_07':['5.00 V','2.00 V','6.67 V','2.86 V'],
 'task1_v203_phy_08':['0.50 Ω','1.50 V','0.600 A','1.20 V','0.300 V','0.720 W','0.180 W','0.900 W']
};
for(const item of audit.entries){
 for(const token of expectedModelTokens[item.id]||[]){
  assert(item.modelAnswer.includes(token),'Expected verified computed result missing from model answer: '+item.id+' / '+token);
 }
}
assert.equal(audit.manualChecksStillOpen.length,4);
console.log('PASS v366: 37 original mark points and 23 independently recomputed numerical quantities across 5 loaded AS Electricity multi-mark problems; practical/drawing sign-off still open.');
