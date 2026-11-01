'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const j=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const app=fs.readFileSync('app.js','utf8');
const core=j('deck.json');
const groups=[
 {subject:'Physics',topic:'Motion graphs',candidateRef:'3.4.1.3',source:'https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/mechanics-and-materials'},
 {subject:'Physics',topic:'Photoelectric effect',candidateRef:'3.2.2.1',source:'https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/particles-and-radiation'},
 {subject:'Chemistry',topic:'Mass spectrometry',candidateRef:'3.1.1.2',source:'https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/physical-chemistry'},
 {subject:'Chemistry',topic:'Ionisation energy',candidateRef:'3.1.1.3',source:'https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/physical-chemistry'}
];
const report={version:'v287',date:'2026-11-01',coreCardCount:core.cards.length,candidates:[]};
assert.equal(core.cards.length,3345);
for(const g of groups){
 const cards=core.cards.filter(c=>c.subject===g.subject&&c.topic===g.topic&&!String(c.specRef||'').trim());
 const mocks=cards.filter(c=>c.mock===true);
 assert(cards.length>0,'No candidate cards for '+g.topic);
 const samples=cards.map(c=>({id:c.id,front:String(c.front||'').slice(0,260),back:String(c.back||'').slice(0,260),stage:c.stage,mock:c.mock,taught:c.taught,courseTopic:c.courseTopic,topic:c.topic,existingSpecRef:c.specRef||null}));
 report.candidates.push({subject:g.subject,topic:g.topic,candidateRef:g.candidateRef,officialSpec:g.source,count:cards.length,mockEligible:mocks.length,cards:samples});
}
console.log('AUDIT_V287_JSON_BEGIN');
console.log(JSON.stringify(report,null,2));
console.log('AUDIT_V287_JSON_END');
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v287: inspected legacy core cards with absent AQA refs in four selected topics. Candidate refs are unapproved until each individual card is reviewed.');
