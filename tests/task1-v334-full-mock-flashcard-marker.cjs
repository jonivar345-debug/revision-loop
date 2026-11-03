'use strict';
// Task 1 v334: evaluate every school-mock flashcard's model, explicit accepted
// paraphrases and explicit rejected misconceptions against the production marker.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),raw=j('deck.json').cards;
const banks=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert.equal(raw.length,3345,'Keep original deck and saved card IDs');
assert.equal(banks.length,56,'Keep all 56 actual supplemental flashcard banks');
const patchBegin=app.indexOf('const V287_LEGACY_SPEC_GROUPS=');
const patchEnd=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards in memory.',patchBegin);
assert(patchBegin>=0&&patchEnd>patchBegin,'Exact versioned runtime patch functions must remain testable');
const calibrate=new Function(app.slice(patchBegin,patchEnd)+
 '\nreturn cards=>{applyV287LegacySpecRefs(cards);applyV288LegacyChemBondingSpecRefs(cards);applyV289LegacyEnergeticsSpecRefs(cards);applyV290LegacyElectricitySpecRefs(cards);applyV314CoreMockQuality(cards);applyV315CoreRecallCalibration(cards);applyV316CoreRecallCalibration(cards);applyV321CoreRecallCalibration(cards);applyV322CoreRecallCalibration(cards);applyV324CoreRecallCalibration(cards);applyV326CoreClarityFixes(cards);applyV327CoreRecallCalibration(cards);applyV328ScienceCoreCalibration(cards);applyV329MathsCorePrecision(cards);applyV330ScienceCoreCalibration(cards);applyV331CoreAnswerCalibration(cards);applyV332GibbsBoundaryCorrection(cards);return cards;}')();
const core=calibrate(JSON.parse(JSON.stringify(raw)));
assert.deepEqual(core.map(c=>c.id),raw.map(c=>c.id),'Existing flashcard IDs must not change across patches');
const supplements=banks.flatMap(p=>(j(p).cards||[]).map(c=>({...c,__bank:p})));
assert.equal(supplements.length,999,'Keep all original supplemental mock cards');
const loaderStart=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));');
const loaderEnd=app.indexOf(' const added=[',loaderStart);
assert(loaderStart>=0&&loaderEnd>loaderStart,'Real runtime bank loader must still be available');
const loaded=new Function('cards','extraFlashBanks',app.slice(loaderStart,loaderEnd)+'\nreturn cards;')(core,banks.map(j));
assert.equal(loaded.length,4344);
assert.equal(new Set(loaded.map(c=>c.id)).size,loaded.length,'No duplicate progress IDs after load');
const mockFlaggedCore=core.filter(c=>c.mock===true);
const mockFlaggedExtra=supplements.filter(c=>c.mock===true);
assert.equal(mockFlaggedCore.length,2383);
assert.equal(mockFlaggedExtra.length,999);
const mockEligibleStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS=');
const mockEligibleEnd=app.indexOf('function startMockSession(){',mockEligibleStart);
assert(mockEligibleStart>=0&&mockEligibleEnd>mockEligibleStart);
const mockEligible=new Function(app.slice(mockEligibleStart,mockEligibleEnd)+'\nreturn mockEligibleCard;')();
const eligible=loaded.filter(c=>mockEligible(c));
assert.equal(eligible.length,3372,'Keep first school mock Year 1 Pure Maths and taught Chemistry/Physics only');
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,eligible.filter(c=>c.subject===s).length])),{Physics:1125,Chemistry:1916,Maths:331});
const markerStart=app.indexOf('function normalise('),markerEnd=app.indexOf('function importantTokens(',markerStart);
assert(markerStart>=0&&markerEnd>markerStart,'Production marker functions must remain present');
const marker=new Function('window',app.slice(markerStart,markerEnd)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let models=0,accepted=0,rejected=0,negations=0,checked=0;
const issues=[];
for(const c of [...mockFlaggedCore,...mockFlaggedExtra]){
 const source=c.__bank||'deck.json',isCore=!c.__bank;
 assert(c.front&&c.back,'All mock flashcards must have a meaningful front and back '+c.id);
 assert(c.front.length<=(isCore?240:220),'Prompt too long for short mock flashcard: '+c.id);
 assert(c.back.length<=(isCore?180:170),'Answer too long for short mock flashcard: '+c.id);
 for(const [type,answers,expected] of [
  ['model',[c.back],'correct'],
  ['accepted',c.accept||[],'correct'],
  ['rejected',c.reject||[],'wrong'],
  ['negated',['not '+c.back],'wrong']
 ]){
  for(const answer of answers){
   let actual;
   try{actual=marker(c,answer).status;}catch(error){actual='exception: '+String(error);}
   checked++;
   if(actual!==expected&&issues.length<30)issues.push({id:c.id,source,type,answer,expected,actual});
   if(type==='model')models++;
   if(type==='accepted')accepted++;
   if(type==='rejected')rejected++;
   if(type==='negated')negations++;
  }
 }
}
assert.equal(models,3382,'Check all 2383 original and all 999 supplemental mock-tagged model answers');
assert(accepted>=4300,'Keep accepted-paraphrase marking coverage');
assert(rejected>=836,'Keep misconception rejection coverage');
assert.equal(negations,3382,'Explicitly negating every mock flashcard answer must never score correct');
assert(checked>=17842,'All model, accepted, wrong and reversed answers must be checked');
assert.deepEqual(issues,[],'Production marker regression failed for an actual authored answer');
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key),'Keep existing saved progress storage keys');
console.log('PASS v334: '+models+' full mock-tagged original and supplemental model answers, '+accepted+' accepted alternatives, '+rejected+' rejected misconceptions, '+negations+' explicit answer negations; '+checked+' individual production-marker checks, all short-card length guards, all 4,344 unique loaded IDs and 3,372 eligible school-mock cards preserved.');
