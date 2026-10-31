'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const d=read('deck.json'),a=read('editorial/task1-v241-physics-measurements-crosswalk.json');
assert.equal(a.version,'v241');assert.equal(d.cards.length,3345);
assert.equal(a.coreCardsInventoried,75);assert.equal(a.coreFirstPass.length,75);
const core=d.cards.filter(c=>c.subject==='Physics'&&c.stage==='AS'&&c.mock===true&&c.active!==false&&['Measurements','Measurements & errors'].includes(c.topic));
assert.equal(core.length,75);
assert.equal(a.inventoryByTopic.Measurements,72);
assert.equal(a.inventoryByTopic['Measurements & errors'],3);
const orig=new Map(a.coreFirstPass.map(c=>[c.id,c]));assert.equal(orig.size,75);
for(const c of core){const old=orig.get(c.id);assert(old,'Missing original ID '+c.id);assert.equal(old.topic,c.topic);assert.equal(old.originalFront,c.front);assert.equal(old.originalBack,c.back);}
const refs=new Set(),selected=new Set();
for(const row of a.requirements){assert(/^3\.1\.[123]$/.test(row.specRef),'Unsupported section '+row.specRef);refs.add(row.specRef);for(const id of row.coreEvidenceIds){assert(orig.has(id),'Unknown evidence '+id);selected.add(id);}if(!row.coreEvidenceIds.length)assert.equal(row.reviewLevel,'application_unverified_in_selected_75_core_cards');}
assert.equal(a.requirements.length,27);assert.equal(refs.size,3);assert(selected.size>=35);
assert.equal(a.requirements.filter(x=>!x.coreEvidenceIds.length).length,3);
assert.equal(a.completion.threeMeasurementsSubsectionsMapped,true);
for(const [k,v] of Object.entries(a.completion))if(k!=='threeMeasurementsSubsectionsMapped')assert.equal(v,false,'False certification '+k);
assert.equal(a.changes.newFlashcards,0);assert.equal(a.changes.runtimeChanged,false);
console.log('PASS v241: 75 existing AS Physics Measurement cards inventoried; 27 AQA requirements mapped, 3 application gaps remain, no original cards changed.');
