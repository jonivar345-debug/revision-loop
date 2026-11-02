'use strict';
// Reproducible production-app review for all 56 supplementary mock flashcard banks.
// This is a structural and known-answer audit, not full AQA specification certification.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),core=j('deck.json');
const paths=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
assert.equal(paths.length,56,'Production supplementary manifest should retain all 56 existing files');
assert.equal(new Set(paths).size,paths.length,'Duplicate supplementary file path');
const banks=paths.map(j),original=core.cards.map(c=>c.id);
const markerBegin=app.indexOf('function normalise('),markerEnd=app.indexOf('function importantTokens(',markerBegin);
assert(markerBegin>0&&markerEnd>markerBegin);
const mark=new Function('window',app.slice(markerBegin,markerEnd)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const warnings={longFront:[],longBack:[],twoQuestions:[],broadSpec:[],nonStrict:[],notWrong:[]};
const cMap=new Map(),fronts=new Map(),breakdown={Physics:{},Chemistry:{},Maths:{}};
let checked=0,modelChecks=0,acceptedChecks=0,rejectedChecks=0,rejectedPartial=0;
for(const [bankIndex,bank] of banks.entries()){
 assert(Array.isArray(bank.cards),'Expected card array in '+paths[bankIndex]);
 for(const c of bank.cards){
  checked++;
  assert(c.id&&c.subject&&c.stage&&c.front&&c.back&&c.specRef,'Missing required flashcard metadata on '+c.id);
  assert(['Physics','Chemistry','Maths'].includes(c.subject),'Unexpected subject '+c.id);
  assert.equal(c.mock,true,'Extra banks must remain deliberate mock content: '+c.id);
  assert.equal(c.taught,true,'Never silently include untaught extras: '+c.id);
  assert.equal(c.scope,'mock','Prevent unrestricted supplement leaking into mock: '+c.id);
  assert.equal(c.active,true,'Inactive supplement in active mock bank: '+c.id);
  if(c.subject==='Maths')assert.equal(c.stage,'AS','Year 2 Maths cannot enter first mock '+c.id);
  else if(c.subject==='Physics')assert.equal(c.stage,'AS','Year 2 Physics cannot enter first mock '+c.id);
  else assert(['AS','A2'].includes(c.stage),'Unexpected Chemistry stage '+c.id);
  assert(Array.isArray(c.accept)&&c.accept.length>0,'No accepted answer variants '+c.id);
  assert(Array.isArray(c.reject)&&c.reject.length>0,'No explicitly rejected mistakes '+c.id);
  assert(!cMap.has(c.id),'Duplicate progress key '+c.id);
  cMap.set(c.id,{card:c,path:paths[bankIndex]});
  if(c.front.length>125)warnings.longFront.push(c.id);
  if(c.back.length>180)warnings.longBack.push(c.id);
  if((c.front.match(/\?/g)||[]).length>1)warnings.twoQuestions.push(c.id);
  if(!c.strictRecall)warnings.nonStrict.push(c.id);
  const q=c.subject+'|'+c.front.toLowerCase().replace(/\s+/g,' ').trim();
  if(fronts.has(q))throw Error('Duplicate exact question between '+fronts.get(q)+' and '+c.id);
  fronts.set(q,c.id);
  breakdown[c.subject][c.specRef]=(breakdown[c.subject][c.specRef]||0)+1;
  assert.equal(mark(c,c.back).status,'correct','Model answer must be accepted '+c.id);modelChecks++;
  for(const a of c.accept){
   const result=mark(c,a);
   assert.equal(result.status,'correct',c.id+' accepted paraphrase should be correct: '+a);
   acceptedChecks++;
  }
  for(const a of c.reject){
   const result=mark(c,a);
   assert.notEqual(result.status,'correct',c.id+' known false answer received full marks: '+a);
   if(result.status==='partial'){rejectedPartial++;warnings.notWrong.push(c.id)}
   rejectedChecks++;
  }
 }
}
assert.equal(checked,999,'No new/silent missing supplementary flashcards');
assert.deepEqual([warnings.longFront.length,warnings.longBack.length,warnings.twoQuestions.length],[0,0,0],'No overlong or multiple-question supplementary prompts allowed');
const patchStart=app.indexOf('const V287_LEGACY_SPEC_GROUPS='),patchEnd=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards in memory.',patchStart);
const patch=new Function(app.slice(patchStart,patchEnd)+
 '\nreturn function(cards){applyV287LegacySpecRefs(cards);applyV288LegacyChemBondingSpecRefs(cards);applyV289LegacyEnergeticsSpecRefs(cards);applyV290LegacyElectricitySpecRefs(cards);applyV314CoreMockQuality(cards);applyV315CoreRecallCalibration(cards);applyV316CoreRecallCalibration(cards);return cards;}')();
const coreUpdated=patch(structuredClone(core.cards));
assert.deepEqual(coreUpdated.map(c=>c.id),original,'Core progress IDs must remain stable');
const loadStart=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),loadEnd=app.indexOf(' const added=[',loadStart);
assert(loadStart>=0&&loadEnd>loadStart);
const load=new Function('cards','extraFlashBanks',app.slice(loadStart,loadEnd)+'\nreturn cards;');
const loaded=load(coreUpdated,banks);
assert.equal(loaded.length,4344,'Expected original 3345 + 999 supplement cards');
assert.equal(new Set(loaded.map(c=>c.id)).size,loaded.length,'Duplicate loaded progress key');
for(const id of cMap.keys())assert(loaded.some(x=>x.id===id),'Supplement missing after real loader '+id);
const mStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),mEnd=app.indexOf('function startMockSession(){',mStart);
const eligible=new Function(app.slice(mStart,mEnd)+'\nreturn mockEligibleCard;')();
const mock=loaded.filter(eligible);
assert.equal(mock.length,3372,'Existing three-subject mock total changed');
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,mock.filter(c=>c.subject===s).length])),{Physics:1125,Chemistry:1916,Maths:331});
for(const c of mock.filter(c=>c.subject==='Maths'))assert.equal(c.stage,'AS','Year 2 Maths in first mock');
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])
 assert(app.includes(key),'Learner-progress storage key changed');
const sectionSummary=Object.fromEntries(Object.entries(breakdown).map(([subject,refs])=>[subject,{supplementCards:Object.values(refs).reduce((a,b)=>a+b,0),distinctSpecRefs:Object.keys(refs).length,topRefs:Object.entries(refs).sort((a,b)=>b[1]-a[1]).slice(0,12)}]));
console.log('V319_SUPPLEMENT_AUDIT '+JSON.stringify({banks:paths.length,cards:checked,models:modelChecks,accepted:acceptedChecks,rejected:rejectedChecks,rejectedPartials:rejectedPartial,warningCounts:Object.fromEntries(Object.entries(warnings).map(([k,v])=>[k,v.length])),warningSample:Object.fromEntries(Object.entries(warnings).map(([k,v])=>[k,[...new Set(v)].slice(0,12)])),sections:sectionSummary}));
console.log('PASS v319: production marker on all 999 extra cards, all original answer variants, 56 manifest files, 4344 total / 3372 mock loaded, preserved IDs, no malformed short cards. This does not certify full AQA spec coverage or unseen answer paraphrases.');
