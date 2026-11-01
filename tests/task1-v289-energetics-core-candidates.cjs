'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),j=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const deck=j('deck.json');
const topics=[
 {topic:'Energetics',possibleRefs:['3.1.4.1','3.1.4.2','3.1.4.3','3.1.4.4'],needsIndividualClassification:true},
 {topic:'Calorimetry',possibleRefs:['3.1.4.2'],needsIndividualClassification:false},
 {topic:"Hess's law",possibleRefs:['3.1.4.3'],needsIndividualClassification:false},
 {topic:'Bond enthalpies',possibleRefs:['3.1.4.4'],needsIndividualClassification:false},
 {topic:'RP2 Enthalpy',possibleRefs:['3.1.4.2'],needsIndividualClassification:false}
];
const groups=topics.map(g=>{
 const cards=deck.cards.filter(x=>x.subject==='Chemistry'&&x.topic===g.topic&&!String(x.specRef||'').trim());
 return {...g,count:cards.length,cards:cards.map(x=>({id:x.id,stage:x.stage,mock:x.mock,taught:x.taught,front:x.front,back:x.back}))};
});
assert.equal(deck.cards.length,3345);
const report={version:'v289',date:'2026-11-01',scope:'Read-only first pass for legacy AQA AS Chemistry 3.1.4 Energetics and RP2',officialSpecification:'https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/physical-chemistry',total:groups.reduce((n,g)=>n+g.count,0),groups};
console.log('AUDIT_V289_JSON_BEGIN');console.log(JSON.stringify(report,null,2));console.log('AUDIT_V289_JSON_END');
console.log('PASS v289: no legacy content/progress modified. Precise subsection map awaits individual scientific review.');
