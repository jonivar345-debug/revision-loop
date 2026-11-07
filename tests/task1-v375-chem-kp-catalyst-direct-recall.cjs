'use strict';
// v375: one direct AQA 7405 3.1.10 Kp-catalyst short recall card with
// production marking and scope tests, preserving all original progress IDs.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js');
const core=json('deck.json').cards,oldAudit=json('editorial/task1-v363-rates-kp-five-application-reconciliation.json');
const report=json('editorial/task1-v375-chem-kp-catalyst-direct-recall.json');
const bank=json('chemistry_kp_catalyst_recall_v375.json');
assert.equal(core.length,3345);
assert.equal(new Set(core.map(c=>c.id)).size,3345);
assert.equal(bank.version,'v375');assert.equal(bank.cards.length,1);
assert.equal(report.version,'v375');
assert.equal(report.gapId,'K12');
assert.equal(report.counts.originalCoreIdsProtected,3345);
assert.equal(report.completion.KpCatalystDirectShortRecallAdded,true);
assert.equal(report.completion.wholeThreeSubjectMockComplete,false);
assert.equal(oldAudit.rows.find(row=>row.id==='K12').evidenceStatus,
 'generic_equilibrium_catalyst_recall_only_specific_kp_not_signed_off');
assert(app.includes("const V375_CHEM_KP_CATALYST_URL='./chemistry_kp_catalyst_recall_v375.json';"));
assert(app.includes('if(!isV375ChemKpCatalystCard(c)||cards.some(old=>old.id===c.id))continue;'));
assert(app.includes('cards.push(c);'));
assert(sw.includes('-v375-kp-catalyst'));
assert(sw.includes("'./chemistry_kp_catalyst_recall_v375.json'"));
// Check ID and question wording against all original + previously loaded cards.
const match=app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/);
assert(match,'Existing supplement list must not disappear');
const existingPaths=[...match[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
assert.equal(existingPaths.length,56);
const allOld=[...core,...existingPaths.flatMap(path=>json(path).cards||[]),
 ...json('maths_first_mock_micro_recall_v348.json').cards,
 ...json('chemistry_cracking_pressure_recall_v354.json').cards,
 ...json('chemistry_alkane_trend_recall_v367.json').cards,
 ...json('physics_light_history_recall_v370.json').cards];
const oldIds=new Set(allOld.map(c=>c.id));
const oldQuestions=new Set(allOld.filter(c=>c.subject==='Chemistry').map(c=>String(c.front||'').trim().toLowerCase()));
const c=bank.cards[0];
assert.equal(c.id,'task1_v375_chem_kp_catalyst_01');
assert(!oldIds.has(c.id),'Duplicate original or supplemental card ID');
assert(!oldQuestions.has(c.front.trim().toLowerCase()),'Existing Chemistry question duplicated');
assert.equal(c.subject,'Chemistry');assert.equal(c.stage,'A2');
assert.equal(c.topic,'Kp');assert.equal(c.specRef,'3.1.10');
assert.equal(c.courseTopic,'Year 2 Physical Chemistry');
assert.equal(c.revisionTopic,'Kp');
assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.scope,'mock');
assert.equal(c.active,true);assert.equal(c.kind,'short');assert.equal(c.strictRecall,true);
assert(c.front.length<=140&&c.back.length<=140);
assert.equal(c.accept.length,3);assert.equal(c.reject.length,3);
assert(report.newCard.id===c.id);
// Verify the exact loader's card whitelist and first-mock eligibility.
const gs=app.indexOf('function isV375ChemKpCatalystCard(c){');
const ge=app.indexOf('// v370: two short first-mock Physics',gs);
assert(gs>0&&ge>gs);
const guard=new Function(app.slice(gs,ge)+'\nreturn isV375ChemKpCatalystCard;')();
assert(guard(c),'Valid card not eligible for the v375 loader');
for(const patch of [
 {id:'another-id'},{subject:'Physics'},{stage:'AS'},{topic:'Organic chemistry'},
 {courseTopic:'Year 1'}, {revisionTopic:'Thermodynamics'}, {specRef:'3.1.9.1'},
 {mock:false},{taught:false},{scope:'full'},{active:false},{kind:'exam'},
 {strictRecall:false},{accept:[...c.accept.slice(0,2)]},
 {reject:[...c.reject.slice(0,2)]},{front:'x'.repeat(150)},{back:'x'.repeat(150)}
])assert(!guard({...c,...patch}),'Bad or untaught data passed scoped loader: '+JSON.stringify(patch));
const scopeStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS=');
const scopeEnd=app.indexOf('function startMockSession(){',scopeStart);
assert(scopeStart>0&&scopeEnd>scopeStart);
const eligible=new Function(app.slice(scopeStart,scopeEnd)+'\nreturn mockEligibleCard;')();
assert(eligible(c),'Added chemistry question is not mock-eligible');
// Validate true production card evaluator, not a separate simplified checker.
const markStart=app.indexOf('function normalise(');
const markEnd=app.indexOf('function importantTokens(',markStart);
assert(markStart>0&&markEnd>markStart);
const evaluate=new Function('window',app.slice(markStart,markEnd)+'\nreturn evaluateCard;')({
 RevisionPhotoelectricCardMarking:{TARGET_ID:'__none__',evaluate:()=>null}
});
let right=0,wrong=0;
for(const a of [c.back,...c.accept]){
 const result=evaluate(c,a);
 assert.equal(result.status,'correct','Correct Kp explanation rejected: '+a);right++;
}
for(const a of c.reject){
 const result=evaluate(c,a);
 assert.equal(result.status,'wrong','False Kp-catalyst claim credited: '+a);
 assert.equal(result.score,0);wrong++;
}
for(const key of [
 "PROGRESS_KEY='revisionLoopProgress5'",
 "PROFILE_KEY='revisionLoopProfile11'",
 "SETTINGS_KEY='revisionLoopSettings11'"
])assert(app.includes(key),'Progress key changed');
console.log('PASS v375: one AQA Kp-specific catalyst mock card; '+right+' valid and '+wrong+' incorrect production-marker responses; 56 original supplements, all 3345 core IDs and offline progress retained.');
