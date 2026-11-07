'use strict';
// v373: precise marking of 18 original Chemistry first-school-mock core short cards.
// Do not change the 3345 source IDs, printed model answers, stage or saved progress.
const fs=require('node:fs'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),core=json('deck.json').cards;
const report=json('editorial/task1-v373-chemistry-eighteen-original-core-marker-review.json');
const prev=json('editorial/task1-v323-balanced-48-topic-evidence.json');
assert.equal(core.length,3345);assert.equal(new Set(core.map(c=>c.id)).size,3345);
assert.equal(report.version,'v373');
assert.equal(report.rows.length,18);
assert.equal(report.counts.originalCoreIDsPreserved,3345);
assert.equal(report.counts.originalCardsReviewed,18);
assert(sw.includes('-v373-chem18-markers'));
assert(app.includes('applyV373ChemistryCoreMarkers(cards);'));
const first=app.indexOf('// v373: calibrate existing short AQA Chemistry mock recall');
const last=app.indexOf('// v344:',first);
assert(first>0&&last>first);
const patch=new Function(app.slice(first,last)+'\nreturn applyV373ChemistryCoreMarkers;')();
const compiledRows=new Function(app.slice(first,last)+'\nreturn V373_CHEMISTRY_CORE_MARKERS;')();
assert.deepEqual(compiledRows,report.rows.map(({sourceGroup,...row})=>row),'Live app-reviewed Chemistry variants must equal the editorial evidence');
const normal=app.indexOf('function normalise(');
const next=app.indexOf('function importantTokens(',normal);
assert(normal>0&&next>normal);
const evaluate=new Function('window',app.slice(normal,next)+'\nreturn evaluateCard;')({
 RevisionPhotoelectricCardMarking:{TARGET_ID:'__none__',evaluate:()=>null}
});
const scopeStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS=');
const scopeEnd=app.indexOf('function startMockSession(){',scopeStart);
assert(scopeStart>0&&scopeEnd>scopeStart);
const eligible=new Function(app.slice(scopeStart,scopeEnd)+'\nreturn mockEligibleCard;')();
const old=new Map(core.map(c=>[c.id,c]));
const samples=new Map(prev.topicGroups.flatMap(g=>g.reviewedSample.map(c=>[c.id,c])));
let originalModels=0,extraAccepted=0,extraRejected=0,previousAccepted=0,previousRejected=0;
const enthalpyDefs=new Set([
 'chem_bh_defs_20261024_atomisation_def','chem_bh_defs_20261024_hydration_def',
 'chem_bh_defs_20261024_latt_formation_def','chem_bh_defs_20261024_solution_def',
 'chem_bh_defs_20261024_standard_formation_def','chem_bh_defs_20261024_second_ea_def'
]);
const seen=new Set();
for(const row of report.rows){
 assert(!seen.has(row.id),'Repeated card '+row.id);seen.add(row.id);
 const source=old.get(row.id),sample=samples.get(row.id);
 assert(source,'Original core flashcard missing '+row.id);
 assert(sample,'Reviewed card is missing from previous sample '+row.id);
 assert.equal(source.subject,'Chemistry');
 assert(['AS','A2'].includes(source.stage));
 assert.equal(source.mock,true);
 assert.notEqual(source.active,false);
 assert(eligible(source),'Card not part of first school mock '+row.id);
 assert.equal(source.front,row.originalFront,'Original front unexpectedly changed: '+row.id);
 assert.equal(source.back,row.originalBack,'Original model answer unexpectedly changed: '+row.id);
 assert.equal(row.originalFront,sample.front);assert.equal(row.originalBack,sample.back);
 assert.equal(row.accept.length,1);assert.equal(row.reject.length,2);
 if(enthalpyDefs.has(row.id))assert(/enthalpy change/i.test(row.accept[0]),'The vetted enthalpy definition must explicitly describe an enthalpy change: '+row.id);
 if(row.id==='chem_bh_defs_20261024_first_ionisation_bh')assert(/energy (?:required|needed)/i.test(row.accept[0]),'Ionisation energy definition must say energy needed');
 assert(source.front.length<=145&&source.back.length<=190,'Short recall required '+row.id);
 const copy={...source,accept:[...(source.accept||[])],reject:[...(source.reject||[])]};
 patch([copy]);
 assert.equal(copy.v373ExactReviewed,true,'Exact mock card did not receive reviewed variants '+row.id);
 assert.equal(copy.id,source.id);assert.equal(copy.front,source.front);assert.equal(copy.back,source.back);
 assert(eligible(copy));
 assert.equal(evaluate(copy,source.back).status,'correct','Original answer regressed '+row.id);
 originalModels++;
 for(const a of source.accept||[]){
  assert.equal(evaluate(copy,a).status,'correct','Existing accepted variant regressed '+row.id+' '+a);previousAccepted++;
 }
 for(const a of source.reject||[]){
  const r=evaluate(copy,a);
  assert.equal(r.status,'wrong','Existing rejected variant regressed '+row.id+' '+a);previousRejected++;
 }
 for(const a of row.accept){
  assert.equal(evaluate(copy,a).status,'correct','New valid paraphrase rejected '+row.id+' '+a);extraAccepted++;
 }
 for(const wrong of row.reject){
  const r=evaluate(copy,wrong);
  assert.equal(r.status,'wrong','New wrong concept credited '+row.id+' '+wrong);
  assert.equal(r.score,0,'Wrong answer received points '+row.id);extraRejected++;
 }
 for(const patchValue of [
  {id:'not-original-id'},{subject:'Maths'},{stage:'Other'},{mock:false},
  {active:false},{front:'changed question wording'},{back:'changed model answer'}
 ]){
  const corrupted={...source,...patchValue,accept:[],reject:[]};
  patch([corrupted]);
  assert.notEqual(corrupted.v373ExactReviewed,true,'Unsafe guard '+row.id+' '+JSON.stringify(patchValue));
  assert.equal(corrupted.accept.length,0);
  assert.equal(corrupted.reject.length,0);
 }
}
assert.equal(originalModels,18);assert.equal(extraAccepted,18);assert.equal(extraRejected,36);
assert.equal(report.rows.reduce((n,x)=>n+x.reject.length,0),36);
for(const key of [
 "PROGRESS_KEY='revisionLoopProgress5'",
 "PROFILE_KEY='revisionLoopProfile11'",
 "SETTINGS_KEY='revisionLoopSettings11'"
])assert(app.includes(key),'Saved progress key changed');
console.log('PASS v373: 18 original Chemistry school-mock model answers, '+previousAccepted+' existing accepts, '+previousRejected+' existing rejects, 18 vetted new answers and 36 wrong misconceptions; no changed IDs, questions, progress, or scope.');
