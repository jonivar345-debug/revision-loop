'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),deck=j('deck.json'),manifest=j('editorial/task1-v290-curated-electricity-ref-map.json');
assert.equal(deck.cards.length,3345);assert.equal(j('exam_questions.json').questions.length,1268);
const older=[j('editorial/task1-v287-curated-legacy-spec-map.json'),j('editorial/task1-v288-curated-legacy-bonding-map.json'),j('editorial/task1-v289-curated-energetics-ref-map.json')];
const oldIds=new Set(older.flatMap(m=>m.groups).flatMap(g=>g.ids));assert.equal(oldIds.size,332);
const approval=new Map();
for(const group of manifest.groups){
 assert.equal(group.count,group.ids.length);
 for(const id of group.ids){assert(!approval.has(id));assert(!oldIds.has(id));approval.set(id,group);}
}
assert.equal(approval.size,21);assert.equal(manifest.reviewedCount,21);
assert.deepEqual(manifest.perSubsection,{'3.5.1.1':4,'3.5.1.2':3,'3.5.1.3':3,'3.5.1.4':4,'3.5.1.5':2,'3.5.1.6':5});
const start=app.indexOf('// v290: individually approved AQA AS Physics Electricity 3.5.1 metadata'),end=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards',start);
assert(start>=0&&end>start);
const {applyV290LegacyElectricitySpecRefs,V290_LEGACY_ELECTRICITY_GROUPS}=new Function(app.slice(start,end)+'\nreturn {applyV290LegacyElectricitySpecRefs,V290_LEGACY_ELECTRICITY_GROUPS};')();
assert.deepEqual(V290_LEGACY_ELECTRICITY_GROUPS,manifest.groups.map(g=>({subject:g.subject,stage:g.stage,topic:g.topic,specRef:g.specRef,ids:g.ids})));
assert(app.includes(' applyV289LegacyEnergeticsSpecRefs(cards);\n applyV290LegacyElectricitySpecRefs(cards);'));
const before=JSON.parse(JSON.stringify(deck.cards)),after=JSON.parse(JSON.stringify(deck.cards));
applyV290LegacyElectricitySpecRefs(after);
let touched=0;
for(let i=0;i<before.length;i++){
 const card=before[i],assigned=approval.get(card.id);
 if(assigned){
  assert.equal(card.subject,assigned.subject,card.id);assert.equal(card.stage,assigned.stage,card.id);assert.equal(card.topic,assigned.topic,card.id);
  assert(!String(card.specRef||'').trim());
  assert.deepEqual(after[i],{...card,specRef:assigned.specRef});
  touched++;
 }else assert.deepEqual(after[i],card,'Unapproved core card changed '+card.id);
}
assert.equal(touched,21);assert.equal(deck.cards.length-touched,3324);
assert.deepEqual(applyV290LegacyElectricitySpecRefs(after),after);
const sample=before.find(x=>x.id==='phy_emf');assert(sample);
for(const bad of [{...sample,id:'new_unapproved_emf_card'},{...sample,subject:'Chemistry'},{...sample,stage:'A2'},{...sample,topic:'Electricity revision'},{...sample,specRef:'3.5.1.4'}]){
 const one=[{...bad}];applyV290LegacyElectricitySpecRefs(one);assert.deepEqual(one[0],bad);
}
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v290: 21 exact reviewed Physics AS Electricity card tags across six AQA subsections, 353 distinct v287–v290 tags, all 3,324 unreviewed core records/answer/progress keys preserved.');
