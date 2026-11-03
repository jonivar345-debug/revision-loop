'use strict';
// Complete explicit core Maths first-mock accepted/rejected calibration, no Year 2 leak.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),deck=j('deck.json'),ledger=j('editorial/task1-v329-15-maths-core-precision.json');
assert.equal(deck.cards.length,3345);
assert.equal(ledger.records.length,15);
assert.equal(new Set(ledger.records.map(c=>c.id)).size,15);
const s=app.indexOf('const V287_LEGACY_SPEC_GROUPS='),e=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards in memory.',s);
assert(s>=0&&e>s);
const apply=new Function(app.slice(s,e)+
 '\nreturn (cards,newVersion)=>{applyV287LegacySpecRefs(cards);applyV288LegacyChemBondingSpecRefs(cards);applyV289LegacyEnergeticsSpecRefs(cards);applyV290LegacyElectricitySpecRefs(cards);applyV314CoreMockQuality(cards);applyV315CoreRecallCalibration(cards);applyV316CoreRecallCalibration(cards);applyV321CoreRecallCalibration(cards);applyV322CoreRecallCalibration(cards);applyV324CoreRecallCalibration(cards);applyV326CoreClarityFixes(cards);applyV327CoreRecallCalibration(cards);applyV328ScienceCoreCalibration(cards);if(newVersion)applyV329MathsCorePrecision(cards);return cards;}')();
const before=apply(structuredClone(deck.cards),false),after=apply(structuredClone(deck.cards),true);
assert.deepEqual(before.map(c=>c.id),after.map(c=>c.id),'Every existing saved progress ID remains the same');
const prior=new Map(before.map(c=>[c.id,c])),now=new Map(after.map(c=>[c.id,c]));
const m1=app.indexOf('function normalise('),m2=app.indexOf('function importantTokens(',m1);
assert(m1>=0&&m2>m1);
const mark=new Function('window',app.slice(m1,m2)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const filterStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),filterEnd=app.indexOf('function startMockSession(){',filterStart);
const eligible=new Function(app.slice(filterStart,filterEnd)+'\nreturn mockEligibleCard;')();
const oldMaths=before.filter(c=>c.subject==='Maths'&&eligible(c));
const maths=after.filter(c=>c.subject==='Maths'&&eligible(c));
assert.equal(maths.length,110,'Core Year 1 Pure Maths eligible count must remain 110');
assert.equal(oldMaths.filter(c=>!(c.reject||[]).length).length,15,'Confirm precise baseline 15 remaining');
assert.equal(oldMaths.filter(c=>!(c.accept||[]).length).length,1,'Confirm single missing accepted list at baseline');
assert.equal(maths.filter(c=>!(c.reject||[]).length).length,0,'All original core mock Maths need explicit wrong examples');
assert.equal(maths.filter(c=>!(c.accept||[]).length).length,0,'All original core mock Maths need accepted examples');
assert(maths.every(c=>c.stage==='AS'),'No Year 2, mechanics or statistics in first mock');
const selected=new Set();
let models=0,good=0,bad=0,negated=0,banned=0,oldGood=0;
for(const row of ledger.records){
 assert(!selected.has(row.id));selected.add(row.id);
 const old=prior.get(row.id),c=now.get(row.id);
 assert(old&&c);
 assert.equal(old.front,row.front);assert.equal(old.back,row.back);
 assert.equal(c.front,row.front);assert.equal(c.back,row.back);
 assert.equal(c.subject,'Maths');assert.equal(c.stage,'AS');
 assert.equal(c.v329ExactReviewed,true,'Each selected answer must use exact approved/rejected correction '+row.id);
 assert(eligible(c),'Must remain in Year 1 Pure first mock '+row.id);
 assert(c.front.length<=125&&c.back.length<=180,'No disguised long-form recall '+row.id);
 assert.equal(row.addedAccepted.length,1);assert.equal(row.addedRejected.length,2);
 const removed=new Set(row.invalidLegacyAccepted);
 for(const b of removed)assert(old.accept?.includes(b),'Original false accepted variant not present '+row.id);
 assert.deepEqual(c.accept,[...new Set([c.back,...(old.accept||[]).filter(a=>!removed.has(a)),...row.addedAccepted])],'Keep valid historic accepted responses '+row.id);
 assert.deepEqual(c.reject,[...new Set([...(old.reject||[]),...row.invalidLegacyAccepted,...row.addedRejected])],'Retain old mistakes and new known wrong answers '+row.id);
 assert.equal(mark(c,c.back).status,'correct','Correct model rejected '+row.id);models++;
 for(const x of c.accept){assert.equal(mark(c,x).status,'correct','Approved expression wrongly marked '+row.id+' '+x);good++;}
 for(const x of c.reject){assert.equal(mark(c,x).status,'wrong','Known incorrect expression given credit '+row.id+' '+x);bad++;}
 for(const x of row.invalidLegacyAccepted){assert.equal(mark(c,x).status,'wrong','Known false positive still credited '+row.id+' '+x);banned++;}
 for(const x of old.accept||[]){if(removed.has(x))continue;assert.equal(mark(c,x).status,'correct','Historical valid response lost '+row.id+' '+x);oldGood++;}
 for(const x of row.addedAccepted){assert.equal(mark(c,'not '+x).status,'wrong','Negated valid answer must be wrong '+row.id);negated++;}
}
assert.equal(models,15);assert.equal(banned,3);assert.equal(negated,15);
for(const c of after.filter(c=>!selected.has(c.id)))assert.deepEqual(c,prior.get(c.id),'No other original core card modified '+c.id);
const paths=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(z=>z[1]);
assert.equal(paths.length,56);
const l1=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),l2=app.indexOf(' const added=[',l1);
const all=new Function('cards','extraFlashBanks',app.slice(l1,l2)+'\nreturn cards;')(after,paths.map(j));
assert.equal(all.length,4344);
assert.equal(new Set(all.map(c=>c.id)).size,4344);
const mock=all.filter(eligible);
assert.equal(mock.length,3372);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,mock.filter(c=>c.subject===s).length])),{Physics:1125,Chemistry:1916,Maths:331});
for(const c of ledger.records)assert(mock.some(z=>z.id===c.id),'Corrected Maths card omitted from real mock selector '+c.id);
assert(app.includes(' applyV329MathsCorePrecision(cards);'),'Runtime patch must run before flashcard loader');
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key),'Existing saved progress storage must remain unchanged');
console.log('PASS v329: all 110 original Year 1 Pure Maths mock cards now have explicit accepted and incorrect-answer lists; last 15 reviewed, 3 historical false-positive responses removed. '+models+' models, '+good+' valid, '+bad+' invalid, '+banned+' previous false positives, '+negated+' negated examples, '+oldGood+' old valid answers preserved. 4344 total/3372 mock, stable IDs.');
