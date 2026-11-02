'use strict';
// Task 1 v317: the actual website's marker, mock selector and bank loader.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),core=json('deck.json');
const sources=[
 ['maths_mock_recall_v186.json','Maths',9,9],
 ['maths_mock_recall_v187.json','Maths',15,15],
 ['physics_refraction_fibres_recall_v275.json','Physics',20,12],
 ['chemistry_as_inorganic_tests_recall_v274.json','Chemistry',30,12]
];
const markerStart=app.indexOf('function normalise(');
const markerEnd=app.indexOf('function importantTokens(',markerStart);
assert(markerStart>=0&&markerEnd>markerStart,'Website marker must be present');
const evaluate=new Function('window',app.slice(markerStart,markerEnd)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let total=0,accepted=0,rejected=0,maths=0,physics=0,chemistry=0;
for(const [path,subject,bankSize,count] of sources){
 const cards=json(path).cards;
 assert.equal(cards.length,bankSize,'Unexpected bank length: '+path);
 const target=cards.slice(0,count);
 for(const card of target){
  assert.equal(card.subject,subject,card.id+' subject');
  assert.equal(card.stage,'AS',card.id+' AS only');
  assert.equal(card.mock,true,card.id+' school mock');
  assert.equal(card.strictRecall,true,card.id+' precise recall');
  assert(card.front&&card.back,'Question and answer must be present');
  assert((card.reject||[]).length>=2,card.id+' needs checked wrong answers');
  if(subject==='Maths')assert.equal(card.reject.length,2,card.id+' two wrong examples');
  const right=[card.back,...(card.accept||[])];
  for(const answer of right){
   const result=evaluate(card,answer);
   assert.equal(result.status,'correct',card.id+' must credit '+answer);
   accepted++;
  }
  for(const answer of card.reject){
   const result=evaluate(card,answer);
   assert.equal(result.status,'wrong',card.id+' must reject '+answer);
   rejected++;
  }
  total++;if(subject==='Maths')maths++;else if(subject==='Physics')physics++;else chemistry++;
 }
}
assert.deepEqual({total,maths,physics,chemistry},{total:48,maths:24,physics:12,chemistry:12});
assert.equal(accepted,232,'Keep all model and approved variants on reviewed cards');
assert.equal(rejected,120,'Keep all explicit wrong examples on reviewed cards');
// Regression: the old normaliser removes prime marks. This card must preserve them.
const f=json('maths_mock_recall_v186.json').cards.find(c=>c.id==='task1_v186_maths_009');
assert.equal(f.strictSymbolRecall,true,'Prime operator must remain meaningful');
for(const answer of ['f(b)-f(a)','f(b) − f(a)','the value at b minus the value at a'])
 assert.equal(evaluate(f,answer).status,'correct','Fundamental theorem: '+answer);
for(const wrong of ["f'(b)-f'(a)","f′(b)-f′(a)","f(a)-f(b)"])
 assert.equal(evaluate(f,wrong).status,'wrong','Derivative notation/direction: '+wrong);
// Actual production flashcard manifest, patched core and school mock selector.
const links=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
for(const [path] of sources)assert(links.includes(path),'Bank must load on website: '+path);
const start=app.indexOf('const V287_LEGACY_SPEC_GROUPS='),end=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards in memory.',start);
assert(start>=0&&end>start);
const patch=new Function(app.slice(start,end)+
 '\nreturn function(cards){applyV287LegacySpecRefs(cards);applyV288LegacyChemBondingSpecRefs(cards);applyV289LegacyEnergeticsSpecRefs(cards);applyV290LegacyElectricitySpecRefs(cards);applyV314CoreMockQuality(cards);applyV315CoreRecallCalibration(cards);applyV316CoreRecallCalibration(cards);return cards;}')();
const originalIds=core.cards.map(c=>c.id),patched=patch(structuredClone(core.cards));
assert.deepEqual(patched.map(c=>c.id),originalIds,'No core progress IDs changed');
const loaderStart=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),loaderEnd=app.indexOf(' const added=[',loaderStart);
assert(loaderStart>=0&&loaderEnd>loaderStart);
const loaded=new Function('cards','extraFlashBanks',app.slice(loaderStart,loaderEnd)+'\nreturn cards;')(patched,links.map(json));
assert.equal(loaded.length,4344,'Original card count must remain unchanged');
assert.equal(new Set(loaded.map(c=>c.id)).size,loaded.length,'No duplicate card progress IDs');
const selStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),selEnd=app.indexOf('function startMockSession(){',selStart);
const eligible=new Function(app.slice(selStart,selEnd)+'\nreturn mockEligibleCard;')();
const mock=loaded.filter(eligible);
assert.equal(mock.length,3372);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,mock.filter(c=>c.subject===s).length])),{Physics:1125,Chemistry:1916,Maths:331});
for(const [path,, ,count] of sources)for(const c of json(path).cards.slice(0,count)){
 const actual=mock.find(m=>m.id===c.id);
 assert(actual,'Revised flashcard must really appear in school mock: '+c.id);
 assert.deepEqual(actual.accept,c.accept,'Loader must preserve accepted alternatives: '+c.id);
 assert.deepEqual(actual.reject,c.reject,'Loader must preserve rejected alternatives: '+c.id);
}
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])
 assert(app.includes(key),'Persisted learner progress key changed unexpectedly');
console.log('PASS v317: 48 reviewed cards, '+accepted+' real-marker correct variants, '+rejected+' real-marker rejected variants, corrected prime notation, unchanged 4344 loaded / 3372 school-mock eligible cards and stable progress IDs.');
