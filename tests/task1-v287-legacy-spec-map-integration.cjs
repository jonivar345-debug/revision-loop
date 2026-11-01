'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const manifest=j('editorial/task1-v287-curated-legacy-spec-map.json'),deck=j('deck.json'),app=read('app.js');
assert.equal(deck.cards.length,3345);
assert.equal(manifest.version,'v287');
assert.equal(manifest.groups.length,4);
const expected=new Map();
for(const group of manifest.groups){
 assert(group.ids.length===group.cardCount);
 assert(/^3\.[1-5]\.\d+(?:\.\d+)?$/.test(group.specRef));
 for(const id of group.ids){assert(!expected.has(id),'Duplicate manifest ID '+id);expected.set(id,group);}
}
assert.equal(expected.size,110);
const start=app.indexOf('// v287: exact-ID AQA AS subsection metadata'),end=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards',start);
assert(start>=0&&end>start);
const program=app.slice(start,end);
const {applyV287LegacySpecRefs,V287_LEGACY_SPEC_GROUPS}=new Function(program+'\nreturn {applyV287LegacySpecRefs,V287_LEGACY_SPEC_GROUPS};')();
assert.deepEqual(V287_LEGACY_SPEC_GROUPS,manifest.groups.map(g=>({subject:g.subject,topic:g.topic,stage:g.stage,specRef:g.specRef,ids:g.ids})));
assert(app.includes(' applyV287LegacySpecRefs(cards);'),'Runtime loader must apply selected AS subsection metadata');
const orig=JSON.parse(JSON.stringify(deck.cards)),edited=JSON.parse(JSON.stringify(deck.cards));
assert.equal(applyV287LegacySpecRefs(edited),edited);
let changed=0;
for(let i=0;i<orig.length;i++){
 const before=orig[i],after=edited[i],group=expected.get(before.id);
 if(group){
  assert.equal(before.subject,group.subject,'Wrong subject '+before.id);
  assert.equal(before.topic,group.topic,'Wrong topic '+before.id);
  assert.equal(before.stage,group.stage,'Wrong stage '+before.id);
  assert(!String(before.specRef||'').trim(),'Pre-existing ref should not be overwritten '+before.id);
  assert.deepEqual(after,{...before,specRef:group.specRef},'Unexpected card mutation '+before.id);
  changed++;
 }else assert.deepEqual(after,before,'Non-selected card changed '+before.id);
}
assert.equal(changed,110);
assert.deepEqual(applyV287LegacySpecRefs(edited),edited);
const first=manifest.groups[0],good=first.ids[0],pick=orig.find(x=>x.id===good);
assert(pick);
for(const mismatch of [{...pick,subject:'Chemistry'},{...pick,stage:'A2'},{...pick,topic:'Waves'}]){
 const test=[{...mismatch}];applyV287LegacySpecRefs(test);
 assert(!String(test[0].specRef||'').trim(),'Wrong subject/stage/topic granted specRef');
}
const tagged=[{...pick,specRef:'3.4.1.1'}];applyV287LegacySpecRefs(tagged);
assert.equal(tagged[0].specRef,'3.4.1.1','Existing refs must not be overwritten');
const noId=[{...pick,id:'unreviewed_new_graph_card'}];applyV287LegacySpecRefs(noId);
assert(!String(noId[0].specRef||'').trim(),'Do not silently tag new cards with matching topic');
assert.equal(j('exam_questions.json').questions.length,1268);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v287: 110 manually selected legacy IDs get verified AQA subsection metadata, all other 3,235 original cards and answer/progress fields untouched; no implicit topic-based tagging or overwrite.');
