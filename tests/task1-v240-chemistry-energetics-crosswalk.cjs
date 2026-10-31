'use strict';
// AQA Energetics evidence audit, intentionally not a full scientific or examiner-marking certification.
const assert=require('node:assert/strict'),fs=require('node:fs');
const report=JSON.parse(fs.readFileSync('editorial/task1-v240-chemistry-energetics-crosswalk.json','utf8'));
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
assert.equal(report.version,'v240');assert.equal(deck.cards.length,3345);
assert.equal(report.requirements.length,28);
const source='https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content/physical-chemistry';
assert.equal(report.officialSpecification,source);
const topics=['Energetics','Calorimetry',"Hess's law",'Bond enthalpies','RP2 Enthalpy'];
const core=deck.cards.filter(c=>c.subject==='Chemistry'&&c.stage==='AS'&&c.mock===true&&c.active!==false&&topics.includes(c.topic));
assert.equal(core.length,144);assert.equal(report.coreInventory.total,144);
for(const name of topics)assert.equal(core.filter(c=>c.topic===name).length,report.coreInventory[name],name);
const snapshot=new Map(report.coreCardInventoryFirstPass.map(c=>[c.id,c]));
assert.equal(snapshot.size,144);
for(const c of core){const old=snapshot.get(c.id);assert(old,'Missing card '+c.id);assert.equal(old.topic,c.topic);assert.equal(old.originalFront,c.front,'Front changed '+c.id);assert.equal(old.originalBack,c.back,'Back changed '+c.id);}
const refs=new Set(),ids=new Set(core.map(c=>c.id)),chosen=new Set();
for(const r of report.requirements){assert(/^3\.1\.4\.[1-4]$/.test(r.specRef),'Bad spec ref');refs.add(r.specRef);assert(r.coreEvidenceIds.length,'Missing evidence '+r.assessableRecallOrSkill);for(const id of r.coreEvidenceIds){assert(ids.has(id),'Unverified AQA evidence '+id);chosen.add(id);}}
assert.equal(refs.size,4);assert(chosen.size>=45);
assert.equal(report.completion.fourEnergeticsSubsectionsMapped,true);
for(const [k,v] of Object.entries(report.completion))if(k!=='fourEnergeticsSubsectionsMapped')assert.equal(v,false,'Premature completion '+k);
assert.equal(report.changes.newCards,0);assert.equal(report.changes.appRuntimeChanged,false);
console.log('PASS v240: 144 mock Energetics/RP2/Hess/bond enthalpy core cards inventoried, 28 AQA skill rows mapped; unseen calculations, practical diagrams and marking remain unverified.');
