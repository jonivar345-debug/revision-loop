'use strict';
// v327: 60 original-core cards cross all three first-mock subjects, selected from real audited topic evidence.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),core=json('deck.json'),review=json('editorial/task1-v327-60-more-balanced-core-answers.json');
assert.equal(core.cards.length,3345);
assert.equal(review.records.length,60);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,review.records.filter(c=>c.subject===s).length])),{Physics:20,Chemistry:29,Maths:11});
assert.equal(new Set(review.records.map(c=>c.id)).size,60,'No duplicated original core IDs');
assert.equal(new Set(review.records.map(c=>c.section)).size,34);
const rangeStart=app.indexOf('const V287_LEGACY_SPEC_GROUPS=');
const rangeEnd=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards in memory.',rangeStart);
assert(rangeStart>0&&rangeEnd>rangeStart);
const apply=new Function(app.slice(rangeStart,rangeEnd)+
 '\nreturn (cards,includeV327)=>{applyV287LegacySpecRefs(cards);applyV288LegacyChemBondingSpecRefs(cards);applyV289LegacyEnergeticsSpecRefs(cards);applyV290LegacyElectricitySpecRefs(cards);applyV314CoreMockQuality(cards);applyV315CoreRecallCalibration(cards);applyV316CoreRecallCalibration(cards);applyV321CoreRecallCalibration(cards);applyV322CoreRecallCalibration(cards);applyV324CoreRecallCalibration(cards);applyV326CoreClarityFixes(cards);if(includeV327)applyV327CoreRecallCalibration(cards);return cards;}')();
const old=apply(structuredClone(core.cards),false),updated=apply(structuredClone(core.cards),true);
assert.deepEqual(old.map(c=>c.id),updated.map(c=>c.id),'Saved progress keys must not change');
const byOld=new Map(old.map(c=>[c.id,c])),byNew=new Map(updated.map(c=>[c.id,c]));
const markerStart=app.indexOf('function normalise('),markerEnd=app.indexOf('function importantTokens(',markerStart);
const evalAnswer=new Function('window',app.slice(markerStart,markerEnd)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const filterStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),filterEnd=app.indexOf('function startMockSession(){',filterStart);
const eligible=new Function(app.slice(filterStart,filterEnd)+'\nreturn mockEligibleCard;')();
const selected=new Set();let modelChecks=0,acceptedChecks=0,rejectedChecks=0,negationChecks=0,historicAccepted=0;
for(const r of review.records){
 assert(!selected.has(r.id),'Reviewed ID duplicated '+r.id);selected.add(r.id);
 const before=byOld.get(r.id),after=byNew.get(r.id);
 assert(before&&after,'Missing original core ID '+r.id);
 assert.equal(before.front,r.front,'Incorrect prior question pairing '+r.id);
 assert.equal(before.back,r.originalBack,'Incorrect prior original answer pairing '+r.id);
 assert.equal(after.front,r.front,'No changes to prompts '+r.id);
 assert.equal(after.back,r.originalBack,'No changes to original correct answers '+r.id);
 assert.equal(after.subject,r.subject);
 assert.equal(after.v327ExactReviewed,true,'Exact ID calibration must apply '+r.id);
 assert(eligible(after),'Must stay in the first school mock '+r.id);
 assert(after.stage==='AS'||(after.subject==='Chemistry'&&after.stage==='A2'),'A2 Maths or Physics out of first mock '+r.id);
 assert(after.front.length<=120&&after.back.length<=180,'Card unexpectedly became a long-answer question '+r.id);
 assert.equal(r.accept.length,1);assert.equal(r.reject.length,1);
 assert.deepEqual(after.accept,[...new Set([before.back,...(before.accept||[]),...r.accept])],'Earlier valid alternatives must remain '+r.id);
 assert.deepEqual(after.reject,[...new Set([...(before.reject||[]),...r.reject])],'Earlier misconceptions must remain '+r.id);
 assert.equal(evalAnswer(after,after.back).status,'correct','Model answer rejected '+r.id);modelChecks++;
 for(const a of after.accept){assert.equal(evalAnswer(after,a).status,'correct','Correct '+r.id+' '+a);acceptedChecks++;}
 for(const wrong of after.reject){assert.equal(evalAnswer(after,wrong).status,'wrong','Wrong answer wrongly credited '+r.id+' '+wrong);rejectedChecks++;}
 for(const original of before.accept||[]){assert.equal(evalAnswer(after,original).status,'correct','Previous correct answer lost '+r.id);historicAccepted++;}
 for(const good of r.accept){assert.equal(evalAnswer(after,'not '+good).status,'wrong','Negated response credited '+r.id);negationChecks++;}
}
for(const c of updated.filter(c=>!selected.has(c.id)))assert.deepEqual(c,byOld.get(c.id),'A previously unreviewed core card changed '+c.id);
const extraPaths=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(z=>z[1]);
assert.equal(extraPaths.length,56);
const loaderA=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),loaderB=app.indexOf(' const added=[',loaderA);
const all=new Function('cards','extraFlashBanks',app.slice(loaderA,loaderB)+'\nreturn cards;')(updated,extraPaths.map(json));
assert.equal(all.length,4344);
assert.equal(new Set(all.map(c=>c.id)).size,4344);
const mock=all.filter(eligible);
assert.equal(mock.length,3372);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,mock.filter(c=>c.subject===s).length])),{Physics:1125,Chemistry:1916,Maths:331});
for(const c of review.records)assert(mock.some(x=>x.id===c.id),'Reviewed card missing from mock '+c.id);
assert(app.includes(' applyV327CoreRecallCalibration(cards);'),'Production app must apply this before adding extras');
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key),'Progress keys changed');
console.log('PASS v327: 60 additional core mock cards (20 Physics, 29 Chemistry, 11 Year 1 Pure Maths) across 34 topic groups. '+modelChecks+' models, '+acceptedChecks+' correct, '+rejectedChecks+' wrong and '+negationChecks+' negated answers; '+historicAccepted+' old valid answers preserved, 4344 total and 3372 first mock, stable progress.');
