'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),deck=j('deck.json'),manifest=j('editorial/task1-v288-curated-legacy-bonding-map.json');
const old=j('editorial/task1-v287-curated-legacy-spec-map.json');
assert.equal(deck.cards.length,3345);assert.equal(manifest.groups.length,4);
const groups=manifest.groups,approved=new Map();
for(const g of groups){assert.equal(g.cardCount,g.ids.length);
 for(const id of g.ids){assert(!approved.has(id));approved.set(id,g);}
}
assert.equal(approved.size,113);
assert.deepEqual(groups.map(g=>g.cardCount),[44,30,22,17]);
assert.equal(old.groups.reduce((n,g)=>n+g.ids.length,0),110);
for(const id of old.groups.flatMap(g=>g.ids))assert(!approved.has(id),'Overlapping v287 and v288 id '+id);
const start=app.indexOf('// v288: reviewed AS Chemistry Bonding core cards'),end=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards',start);
assert(start>=0&&end>start);
const {applyV288LegacyChemBondingSpecRefs,V288_LEGACY_CHEM_BONDING_GROUPS}=new Function(app.slice(start,end)+'\nreturn {applyV288LegacyChemBondingSpecRefs,V288_LEGACY_CHEM_BONDING_GROUPS};')();
assert.deepEqual(V288_LEGACY_CHEM_BONDING_GROUPS,groups.map(g=>({subject:g.subject,topic:g.topic,stage:g.stage,specRef:g.specRef,ids:g.ids})));
assert(app.includes(' applyV287LegacySpecRefs(cards);\n applyV288LegacyChemBondingSpecRefs(cards);'),'Runtime must apply both independent exact-ID maps');
const before=JSON.parse(JSON.stringify(deck.cards)),after=JSON.parse(JSON.stringify(deck.cards));
applyV288LegacyChemBondingSpecRefs(after);
let count=0;
for(let i=0;i<before.length;i++){
 const c=before[i],d=after[i],g=approved.get(c.id);
 if(g){
  assert.equal(c.subject,g.subject,'Unexpected subject '+c.id);
  assert.equal(c.topic,g.topic,'Unexpected topic '+c.id);
  assert.equal(c.stage,g.stage,'Unexpected stage '+c.id);
  assert(!String(c.specRef||'').trim(),'Pre-existing reference '+c.id);
  assert.deepEqual(d,{...c,specRef:g.specRef},'Unexpected card change '+c.id);
  count++;
 }else assert.deepEqual(d,c,'Unapproved card modified '+c.id);
}
assert.equal(count,113);assert.equal(before.length-count,3232);
const sample=before.find(c=>c.id===groups[0].ids[0]);assert(sample);
for(const variant of [{...sample,topic:'Bonding'},{...sample,subject:'Physics'},{...sample,stage:'A2'},{...sample,id:'some_new_unreviewed_card'}]){
 const arr=[variant];applyV288LegacyChemBondingSpecRefs(arr);
 assert(!String(arr[0].specRef||'').trim(),'Unapproved variant tagged');
}
const tagged=[{...sample,specRef:'3.1.3.2'}];applyV288LegacyChemBondingSpecRefs(tagged);
assert.equal(tagged[0].specRef,'3.1.3.2');
const expectedRefs=['3.1.3.5','3.1.3.7','3.1.3.4','3.1.3.6'];assert.deepEqual(groups.map(g=>g.specRef),expectedRefs);
assert.equal(j('exam_questions.json').questions.length,1268);
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
console.log('PASS v288: 113 exact-ID Chemistry Bonding cards tag 3.1.3.4/.5/.6/.7; other 3,232 core cards unchanged; combined v287+v288 maps 223 nonoverlapping IDs, no answer, mock or progress changes.');
