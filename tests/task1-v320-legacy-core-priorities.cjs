'use strict';
// Legacy core-deck priority inventory. Does not edit a flashcard or certify full AQA coverage.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),raw=j('deck.json');
assert.equal(raw.cards.length,3345);
const patchA=app.indexOf('const V287_LEGACY_SPEC_GROUPS=');
const patchB=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards in memory.',patchA);
assert(patchA>=0&&patchB>patchA);
const patch=new Function(app.slice(patchA,patchB)+
 '\nreturn function(cards){applyV287LegacySpecRefs(cards);applyV288LegacyChemBondingSpecRefs(cards);applyV289LegacyEnergeticsSpecRefs(cards);applyV290LegacyElectricitySpecRefs(cards);applyV314CoreMockQuality(cards);applyV315CoreRecallCalibration(cards);applyV316CoreRecallCalibration(cards);return cards;}')();
const patched=patch(structuredClone(raw.cards));
assert.deepEqual(patched.map(c=>c.id),raw.cards.map(c=>c.id),'Core progress IDs retained');
const mA=app.indexOf('function normalise('),mB=app.indexOf('function importantTokens(',mA);
const mark=new Function('window',app.slice(mA,mB)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const sA=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),sB=app.indexOf('function startMockSession(){',sA);
const mockEligible=new Function(app.slice(sA,sB)+'\nreturn mockEligibleCard;')();
const eligible=patched.filter(mockEligible);
const focus={
 Physics:/projectile|velocity|acceleration|moment|couple|stress|strain|force|motion|refraction|cladding|diffraction|photoelectric|emf|internal resistance|potential divider|uncertainty|resolving|graph|young/i,
 Chemistry:/born.haber|lattice|hess|enthalpy|ionisation|electron configuration|mass spec|time of flight|ka|kw|kp\b|equilibrium|amine|acyl|ester|halogenoalkane|oxidation|carboxylic|calorimetry|entropy|gibbs|organic test|reagent/i,
 Maths:/proof|integer|vector|collinear|counterexample|transform|inequal|integration|differentiat|graph|circle|quadratic|binomial|sequence|trigonomet/i
};
const report={version:'v320',source:'original 3345 core, full website in-memory spec/answer calibration and real mock selector',totalCore:patched.length,eligibleCore:eligible.length,subjects:{},priorities:[],modelsNotAccepted:[],candidateLength:[],limit:'Sampled priorities only, not proof all 3345 original core flashcards have been individually edited.'};
for(const subject of ['Physics','Chemistry','Maths']){
 const cards=eligible.filter(c=>c.subject===subject);
 const noAccept=cards.filter(c=>!c.accept?.length);
 const noReject=cards.filter(c=>!c.reject?.length);
 const both=cards.filter(c=>!c.accept?.length&&!c.reject?.length);
 const selected=cards.filter(c=>focus[subject].test([c.front,c.back,c.topic,c.revisionTopic].join(' '))&&(!c.accept?.length||!c.reject?.length));
 const sorted=selected.sort((a,b)=>{
   const priority=c=>(!c.accept?.length?4:0)+(!c.reject?.length?2:0)+(c.front.length<=110&&c.back.length<=180?1:0);
   return priority(b)-priority(a)||a.id.localeCompare(b.id);
 });
 const picks=sorted.slice(0,35).map(c=>({
  id:c.id,specRef:c.specRef||'',topic:c.topic||c.revisionTopic||'',
  front:c.front,back:c.back,
  existingAccepted:c.accept?.length||0,existingRejected:c.reject?.length||0,
  reason:!c.accept?.length&&!c.reject?.length?'No curated correct or wrong variants':
   !c.reject?.length?'No curated incorrect variants':'No explicit accepted variants'
 }));
 report.subjects[subject]={eligibleCore:cards.length,noAccept:noAccept.length,noReject:noReject.length,bothMissing:both.length,selectedHighPriority:sorted.length,longFront:cards.filter(c=>String(c.front||'').length>125).length,longBack:cards.filter(c=>String(c.back||'').length>180).length};
 report.priorities.push(...picks.map(c=>({subject,...c})));
 for(const c of cards){
  if(mark(c,c.back).status!=='correct')report.modelsNotAccepted.push({id:c.id,subject,front:c.front,back:c.back});
  if(c.front.length>125||c.back.length>180)report.candidateLength.push({id:c.id,subject,front:c.front,frontLength:c.front.length,backLength:c.back.length});
 }
}
assert.equal(report.modelsNotAccepted.length,0,'All eligible original core model answers must be accepted');
console.log('V320_LEGACY_CORE_PRIORITIES_BEGIN');
console.log(JSON.stringify(report));
console.log('V320_LEGACY_CORE_PRIORITIES_END');
console.log('PASS v320 legacy-core read-only priority inventory with real corrected core marker and first-mock selector; '+report.priorities.length+' ranked samples, no progress-key changes, manual content review still necessary.');
