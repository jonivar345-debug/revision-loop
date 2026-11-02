'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js');
const doc=json('editorial/task1-v318-138-precision-review.json');
const core=json('deck.json');
const markerStart=app.indexOf('function normalise('),markerEnd=app.indexOf('function importantTokens(',markerStart);
assert(markerStart>=0&&markerEnd>markerStart);
const evaluate=new Function('window',app.slice(markerStart,markerEnd)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
assert.equal(doc.banks.length,12);
let selected=0,accepted=0,rejected=0,bySubject={Physics:0,Chemistry:0,Maths:0};
const targetIds=new Set();
const candidateIds=new Map();
for(const bank of doc.banks){
 assert.equal(bank.pairs.length,bank.n);
 const cards=json(bank.path).cards;
 assert(cards.length>=bank.n,bank.path+' bank changed length');
 for(let i=0;i<bank.n;i++){
  const c=cards[i],[right,wrong]=bank.pairs[i];
  assert(!targetIds.has(c.id),'Duplicate reviewed ID '+c.id);
  targetIds.add(c.id);
  assert.equal(c.subject,bank.subject);
  assert.equal(c.mock,true,'Must be in school mock: '+c.id);
  assert.equal(c.taught,true,'Must be taught: '+c.id);
  assert(c.stage==='AS'||(c.subject==='Chemistry'&&c.stage==='A2'),'Maths Year 2/other scope leaked: '+c.id);
  assert.equal(c.strictRecall,true,'Use short exact recall rather than essay marking');
  assert(c.front&&c.back&&c.front.length<=170&&c.back.length<=180,'Invalid concise flashcard');
  assert(c.accept.includes(right),'Vetted answer missing: '+c.id);
  assert(c.reject.includes(wrong),'Vetted mistake missing: '+c.id);
  assert.equal(c.accept.filter(x=>x===right).length,1);
  assert.equal(c.reject.filter(x=>x===wrong).length,1);
  for(const value of [c.back,...c.accept]){
   const prediction=evaluate(c,value);
   assert.equal(prediction.status,'correct',c.id+' correct '+value);
   accepted++;
  }
  for(const value of c.reject){
   const prediction=evaluate(c,value);
   assert.equal(prediction.status,'wrong',c.id+' incorrect '+value);
   rejected++;
  }
  candidateIds.set(c.id,{right,wrong});
  selected++;bySubject[bank.subject]++;
 }
}
assert.equal(selected,138);
assert.deepEqual(bySubject,{Physics:46,Chemistry:46,Maths:46});
assert.equal(accepted,672);
assert.equal(rejected,429);
const flashUrls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
for(const b of doc.banks)assert(flashUrls.includes(b.path),'Card bank omitted from production loader '+b.path);
const coreIds=core.cards.map(c=>c.id);
const patchStart=app.indexOf('const V287_LEGACY_SPEC_GROUPS='),patchEnd=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards in memory.',patchStart);
assert(patchStart>0&&patchEnd>patchStart);
const patch=new Function(app.slice(patchStart,patchEnd)+
 '\nreturn function(cards){applyV287LegacySpecRefs(cards);applyV288LegacyChemBondingSpecRefs(cards);applyV289LegacyEnergeticsSpecRefs(cards);applyV290LegacyElectricitySpecRefs(cards);applyV314CoreMockQuality(cards);applyV315CoreRecallCalibration(cards);applyV316CoreRecallCalibration(cards);return cards;}')();
const corrected=patch(structuredClone(core.cards));
assert.deepEqual(coreIds,corrected.map(c=>c.id),'Original progress keys must remain unchanged');
const loadStart=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),loadEnd=app.indexOf(' const added=[',loadStart);
assert(loadStart>0&&loadEnd>loadStart);
const loader=new Function('cards','extraFlashBanks',app.slice(loadStart,loadEnd)+'\nreturn cards;');
const loaded=loader(corrected,flashUrls.map(json));
assert.equal(loaded.length,4344,'Do not alter bank population');
assert.equal(new Set(loaded.map(c=>c.id)).size,loaded.length,'Never duplicate user progress keys');
const sStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),sEnd=app.indexOf('function startMockSession(){',sStart);
const mockEligible=new Function(app.slice(sStart,sEnd)+'\nreturn mockEligibleCard;')();
const mock=loaded.filter(mockEligible);
assert.equal(mock.length,3372);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,mock.filter(c=>c.subject===s).length])),{Physics:1125,Chemistry:1916,Maths:331});
const index=new Map(mock.map(c=>[c.id,c]));
for(const [id,{right,wrong}] of candidateIds){
 const card=index.get(id);
 assert(card,'Reviewed card must be in real mock pool '+id);
 assert.equal(evaluate(card,right).status,'correct','Loader must credit '+id);
 assert.equal(evaluate(card,wrong).status,'wrong','Loader must reject '+id);
}
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])
 assert(app.includes(key),'Saved progress key unexpectedly modified');
console.log('PASS v318: 138 existing short mock flashcards (46 per subject), 138 individually vetted accepted and rejected additions, '+accepted+' correct and '+rejected+' incorrect production marker checks, 3372 mock/4344 total unchanged, IDs and progress preserved.');
