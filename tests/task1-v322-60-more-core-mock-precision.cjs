'use strict';
// Task 1 v322: 60 individually vetted existing core cards and real production marking.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),core=json('deck.json'),ledger=json('editorial/task1-v322-60-legacy-core-variants.json');
assert.equal(core.cards.length,3345);assert.equal(ledger.records.length,60);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,ledger.records.filter(c=>c.subject===s).length])),{Physics:20,Chemistry:20,Maths:20});
const begin=app.indexOf('const V287_LEGACY_SPEC_GROUPS='),end=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards in memory.',begin);
assert(begin>=0&&end>begin);
const patch=new Function(app.slice(begin,end)+
 '\nreturn (cards,includeNew)=>{applyV287LegacySpecRefs(cards);applyV288LegacyChemBondingSpecRefs(cards);applyV289LegacyEnergeticsSpecRefs(cards);applyV290LegacyElectricitySpecRefs(cards);applyV314CoreMockQuality(cards);applyV315CoreRecallCalibration(cards);applyV316CoreRecallCalibration(cards);applyV321CoreRecallCalibration(cards);if(includeNew)applyV322CoreRecallCalibration(cards);return cards;}')();
const old=patch(structuredClone(core.cards),false),next=patch(structuredClone(core.cards),true);
assert.deepEqual(old.map(x=>x.id),next.map(x=>x.id),'Preserve original progress IDs');
const mA=app.indexOf('function normalise('),mB=app.indexOf('function importantTokens(',mA);
const evaluate=new Function('window',app.slice(mA,mB)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const sA=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),sB=app.indexOf('function startMockSession(){',sA);
const eligible=new Function(app.slice(sA,sB)+'\nreturn mockEligibleCard;')();
const prev=new Map(old.map(c=>[c.id,c])),now=new Map(next.map(c=>[c.id,c]));
const selectedIds=new Set();
let accepted=0,rejected=0,negations=0,models=0,existing=0;
for(const row of ledger.records){
 assert(!selectedIds.has(row.id),'Duplicate review ID '+row.id);selectedIds.add(row.id);
 const before=prev.get(row.id),after=now.get(row.id);
 assert(before&&after,'Original card must exist '+row.id);
 assert.equal(after.subject,row.subject);
 assert.equal(after.front,row.front,'Preserve original short question '+row.id);
 assert.equal(after.back,row.back,'Preserve source correct answer '+row.id);
 assert.equal(after.v322ExactReviewed,true,'Production exact calibration not set '+row.id);
 assert(eligible(after),'School-mock filter must retain '+row.id);
 assert(after.stage==='AS'||(after.subject==='Chemistry'&&after.stage==='A2'),'No untaught A2 Physics/Maths');
 assert.equal(row.accept.length,1);assert.equal(row.reject.length,1);
 assert.deepEqual(after.accept,[...new Set([before.back,...(before.accept||[]),...row.accept])],'Earlier accepted answers must be retained '+row.id);
 assert.deepEqual(after.reject,[...new Set([...(before.reject||[]),...row.reject])],'Earlier wrong answers must be retained '+row.id);
 assert.equal(evaluate(after,after.back).status,'correct','Model '+row.id);models++;
 for(const a of after.accept){assert.equal(evaluate(after,a).status,'correct','Must credit '+row.id+' '+a);accepted++;}
 for(const a of after.reject){assert.equal(evaluate(after,a).status,'wrong','Must reject '+row.id+' '+a);rejected++;}
 for(const a of before.accept||[]){assert.equal(evaluate(after,a).status,'correct','Historic approved answer '+row.id);existing++;}
 // New explicit answers remain wrong if the student negates them.
 for(const a of row.accept){assert.equal(evaluate(after,'not '+a).status,'wrong','Negated wording '+row.id);negations++;}
}
for(const c of next.filter(c=>!selectedIds.has(c.id)))assert.deepEqual(c,prev.get(c.id),'No unreviewed core card changed '+c.id);
assert.equal(models,60);
assert.equal(negations,60);
const files=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(z=>z[1]);
const loadStart=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),loadEnd=app.indexOf(' const added=[',loadStart);
const loaded=new Function('cards','extraFlashBanks',app.slice(loadStart,loadEnd)+'\nreturn cards;')(next,files.map(json));
assert.equal(loaded.length,4344);assert.equal(new Set(loaded.map(x=>x.id)).size,loaded.length);
const mock=loaded.filter(eligible);
assert.equal(mock.length,3372);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,mock.filter(c=>c.subject===s).length])),{Physics:1125,Chemistry:1916,Maths:331});
for(const row of ledger.records)assert(mock.some(c=>c.id===row.id),'Missing from school mock '+row.id);
assert(app.includes(' applyV322CoreRecallCalibration(cards);'),'New patch must be applied in production before app loads mock');
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key),'Progress schema must be untouched');
console.log('PASS v322: 60 more original core cards (20 Physics, 20 taught Chemistry, 20 Year 1 Pure Maths), '+accepted+' accepted and '+rejected+' incorrect production marker examples, 60 models and 60 negations, preserved '+existing+' prior accepted variants, 4344 loaded, 3372 school-mock, unchanged progress keys.');
