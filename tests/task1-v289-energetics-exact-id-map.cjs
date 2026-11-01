'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const core=j('deck.json'),manifest=j('editorial/task1-v289-curated-energetics-ref-map.json'),app=read('app.js');
assert.equal(core.cards.length,3345);assert.equal(j('exam_questions.json').questions.length,1268);
assert.equal(manifest.cardTotal,109);assert.equal(manifest.groups.length,8);
assert.deepEqual(manifest.totalsBySection,{'3.1.4.1':23,'3.1.4.2':44,'3.1.4.3':26,'3.1.4.4':16});
const mapping=new Map();
for(const g of manifest.groups){
 assert.equal(g.ids.length,g.count);
 for(const id of g.ids){assert(!mapping.has(id),'Duplicate manifest id '+id);mapping.set(id,g);}
}
assert.equal(mapping.size,109);
const v287=j('editorial/task1-v287-curated-legacy-spec-map.json'),v288=j('editorial/task1-v288-curated-legacy-bonding-map.json');
const earlierIds=new Set([...v287.groups,...v288.groups].flatMap(g=>g.ids));
assert.equal(earlierIds.size,223);
for(const id of mapping.keys())assert(!earlierIds.has(id),'Overlapping earlier card '+id);
const start=app.indexOf('// v289: AQA 3.1.4 Energetics source subsection mapping'),end=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards',start);
assert(start>=0&&end>start);
const {applyV289LegacyEnergeticsSpecRefs,V289_LEGACY_ENERGETICS_GROUPS}=new Function(app.slice(start,end)+'\nreturn {applyV289LegacyEnergeticsSpecRefs,V289_LEGACY_ENERGETICS_GROUPS};')();
assert.deepEqual(V289_LEGACY_ENERGETICS_GROUPS,manifest.groups.map(g=>({subject:g.subject,stage:g.stage,topic:g.topic,specRef:g.specRef,ids:g.ids})));
assert(app.includes(' applyV287LegacySpecRefs(cards);\n applyV288LegacyChemBondingSpecRefs(cards);\n applyV289LegacyEnergeticsSpecRefs(cards);'));
const original=JSON.parse(JSON.stringify(core.cards)),after=JSON.parse(JSON.stringify(core.cards));
applyV289LegacyEnergeticsSpecRefs(after);
let changed=0;
for(let i=0;i<original.length;i++){
 const before=original[i],current=after[i],expected=mapping.get(before.id);
 if(expected){
  assert.equal(before.subject,expected.subject,before.id);
  assert.equal(before.stage,expected.stage,before.id);
  assert.equal(before.topic,expected.topic,before.id);
  assert(!String(before.specRef||'').trim(),before.id+' already tagged');
  assert.deepEqual(current,{...before,specRef:expected.specRef},before.id+' unexpected change');
  changed++;
 }else assert.deepEqual(current,before,'Unreviewed card edited '+before.id);
}
assert.equal(changed,109);assert.equal(original.length-changed,3236);
for(const id of manifest.deferredForIndividualKineticsReview.map(x=>x.id)){
 assert(!mapping.has(id));const p=after.find(x=>x.id===id);assert(p);assert(!String(p.specRef||'').trim(),'Unverified kinetic card should remain untagged');
}
assert.equal(manifest.deferredForIndividualKineticsReview.length,2);
assert.deepEqual(applyV289LegacyEnergeticsSpecRefs(after),after,'Idempotence');
const target=original.find(x=>x.id==='chem_enthalpy_def');assert(target);
for(const variant of [{...target,subject:'Physics'},{...target,stage:'A2'},{...target,topic:'Calorimetry'},{...target,id:'unreviewed_energetics_new_card'},{...target,specRef:'3.1.4.4'}]){
 const b=[{...variant}];applyV289LegacyEnergeticsSpecRefs(b);
 assert.deepEqual(b[0],variant,'Ineligible card was changed');
}
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
console.log('PASS v289: 109 exact AQA Energetics subsection tags, 332 non-overlapping v287-v289 maps, two correctly deferred kinetics cards, 3,236 other original card records identical, and all progress keys unchanged.');
