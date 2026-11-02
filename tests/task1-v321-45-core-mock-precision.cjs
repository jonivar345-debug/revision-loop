'use strict';
// v321: verify real site-in-memory calibration of 45 original model flashcards.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),deck=j('deck.json'),audit=j('editorial/task1-v321-45-core-precision-variants.json');
assert.equal(audit.records.length,45);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,audit.records.filter(x=>x.subject===s).length])),{Physics:15,Chemistry:15,Maths:15});
const patchA=app.indexOf('const V287_LEGACY_SPEC_GROUPS=');
const patchB=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards in memory.',patchA);
const patch=new Function(app.slice(patchA,patchB)+
 '\nreturn function(cards,withV321){applyV287LegacySpecRefs(cards);applyV288LegacyChemBondingSpecRefs(cards);applyV289LegacyEnergeticsSpecRefs(cards);applyV290LegacyElectricitySpecRefs(cards);applyV314CoreMockQuality(cards);applyV315CoreRecallCalibration(cards);applyV316CoreRecallCalibration(cards);if(withV321)applyV321CoreRecallCalibration(cards);return cards;}')();
const original=deck.cards;assert.equal(original.length,3345);
const before=patch(structuredClone(original),false),after=patch(structuredClone(original),true);
assert.deepEqual(before.map(x=>x.id),after.map(x=>x.id),'All old progress IDs must stay the same');
const mapBefore=new Map(before.map(c=>[c.id,c])),mapAfter=new Map(after.map(c=>[c.id,c]));
const ids=new Set(audit.records.map(c=>c.id));assert.equal(ids.size,45);
const mA=app.indexOf('function normalise('),mB=app.indexOf('function importantTokens(',mA);
const evaluate=new Function('window',app.slice(mA,mB)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const sA=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),sB=app.indexOf('function startMockSession(){',sA);
const mockEligible=new Function(app.slice(sA,sB)+'\nreturn mockEligibleCard;')();
let model=0,right=0,wrong=0,preserved=0;
for(const row of audit.records){
 const c=mapAfter.get(row.id),prev=mapBefore.get(row.id);
 assert(c&&prev,'Original core card not found '+row.id);
 assert.equal(c.subject,row.subject);
 assert.equal(c.front,row.front,'Prompt changed '+row.id);
 assert.equal(c.back,row.back,'Model answer changed '+row.id);
 assert.equal(c.v321ExactReviewed,true,'Guarded runtime patch missing '+row.id);
 assert(mockEligible(c),'Reviewed card omitted from real first-mock selector '+row.id);
 assert(c.stage==='AS'||(c.subject==='Chemistry'&&c.stage==='A2'),'Out-of-scope A2 Physics/Maths '+row.id);
 assert.deepEqual(c.accept,[...new Set([prev.back,...(prev.accept||[]),...row.accept])],'Preserve existing accepted answers '+row.id);
 assert.deepEqual(c.reject,[...new Set([...(prev.reject||[]),...row.reject])],'Preserve existing incorrect examples '+row.id);
 assert.equal(row.accept.length,2);assert.equal(row.reject.length,2);
 assert.equal(evaluate(c,c.back).status,'correct','Original model not accepted '+row.id);model++;
 for(const ans of c.accept){assert.equal(evaluate(c,ans).status,'correct','Accepted '+row.id+' '+ans);right++;}
 for(const ans of c.reject){assert.equal(evaluate(c,ans).status,'wrong','Rejected '+row.id+' '+ans);wrong++;}
 for(const ans of prev.accept||[]){assert.equal(evaluate(c,ans).status,'correct','Previously accepted answer broken '+row.id);preserved++;}
 for(const bad of row.accept)assert.equal(evaluate(c,'not '+bad).status,'wrong','Negated answer wrongly credited '+row.id);
}
for(const c of after.filter(c=>!ids.has(c.id)))assert.deepEqual(c,mapBefore.get(c.id),'Unreviewed original core card changed: '+c.id);
const paths=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(z=>z[1]);
const loadStart=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),loadEnd=app.indexOf(' const added=[',loadStart);
const all=new Function('cards','extraFlashBanks',app.slice(loadStart,loadEnd)+'\nreturn cards;')(after,paths.map(j));
assert.equal(all.length,4344);
const mock=all.filter(mockEligible);
assert.equal(mock.length,3372);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,mock.filter(c=>c.subject===s).length])),{Physics:1125,Chemistry:1916,Maths:331});
assert.equal(new Set(all.map(c=>c.id)).size,all.length);
for(const row of audit.records)assert(mock.some(c=>c.id===row.id),'Card missing from live mock: '+row.id);
assert(app.includes(' applyV321CoreRecallCalibration(cards);'),'Site must actually apply patch before loading supplements');
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v321: 45 individually curated original mock cards (15/subject), '+model+' model answers, '+right+' accepted and '+wrong+' explicit wrong production marker checks; '+preserved+' earlier correct variants preserved; 4344/3372 unchanged, saved learner progress IDs unchanged.');
