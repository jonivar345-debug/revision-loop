'use strict';
// v374: 15 existing AQA Chemistry mock flashcards — preserve original prompts
// and model answers; calibrate scientifically accepted and rejected concepts.
const fs=require('node:fs'),assert=require('node:assert/strict');
const txt=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(txt(p));
const app=txt('app.js'),sw=txt('sw.js'),core=j('deck.json').cards;
const audit=j('editorial/task1-v374-chem-kinetics-hess-fifteen-core-marker-review.json');
const baseline=j('editorial/task1-v323-balanced-48-topic-evidence.json');
assert.equal(audit.version,'v374');
assert.equal(audit.rows.length,15);
assert.equal(audit.counts.originalCoreIdsPreserved,3345);
assert.equal(audit.counts.newCorrectParaphrases,15);
assert.equal(audit.counts.newWrongConcepts,30);
assert.equal(core.length,3345);
assert.equal(new Set(core.map(c=>c.id)).size,3345);
assert(sw.includes('-v374-hess-rates15'));
assert(app.includes('applyV374ChemHessRatesMarkers(cards);'));
assert(app.includes('applyV373ChemistryCoreMarkers(cards);'));
const st=app.indexOf('// v374: preserve and calibrate fifteen short Chemistry Hess');
const en=app.indexOf('// v344:',st);
assert(st>0&&en>st);
const js=app.slice(st,en);
const patch=new Function(js+'\nreturn applyV374ChemHessRatesMarkers;')();
const compiled=new Function(js+'\nreturn V374_CHEMISTRY_HESS_RATES_MARKERS;')();
assert.deepEqual(compiled,audit.rows.map(({sourceTopic,...row})=>row),'Production app must have exact reviewed variants');
const normal=app.indexOf('function normalise('),next=app.indexOf('function importantTokens(',normal);
assert(normal>0&&next>normal);
const evaluate=new Function('window',app.slice(normal,next)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:{TARGET_ID:'__none__',evaluate:()=>null}});
const scopeStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),scopeEnd=app.indexOf('function startMockSession(){',scopeStart);
assert(scopeStart>0&&scopeEnd>scopeStart);
const eligible=new Function(app.slice(scopeStart,scopeEnd)+'\nreturn mockEligibleCard;')();
const indexed=new Map(core.map(c=>[c.id,c]));
const sampled=new Map(baseline.topicGroups.flatMap(g=>g.reviewedSample.map(x=>[x.id,{...x,group:g.topic}])));
const ids=new Set(),groups=new Set();
let sourceAccepted=0,sourceRejected=0;
for(const row of audit.rows){
 assert(!ids.has(row.id));ids.add(row.id);
 const source=indexed.get(row.id),old=sampled.get(row.id);
 assert(source&&old,'Original core ID/audit sample missing '+row.id);
 assert.equal(old.front,row.originalFront);
 assert.equal(old.back,row.originalBack);
 assert.equal(source.front,row.originalFront);
 assert.equal(source.back,row.originalBack);
 assert.equal(old.group,row.sourceTopic);groups.add(row.sourceTopic);
 assert.equal(source.subject,'Chemistry');
 assert(['AS','A2'].includes(source.stage));
 assert.equal(source.mock,true);
 assert.notEqual(source.active,false);
 assert(eligible(source),'Must remain in taught mock '+row.id);
 assert.equal(row.accept.length,1);assert.equal(row.reject.length,2);
 assert(source.front.length<=145&&source.back.length<=190);
 const card={...source,accept:[...(source.accept||[])],reject:[...(source.reject||[])]};
 patch([card]);
 assert.equal(card.v374ExactReviewed,true);
 assert.equal(card.front,source.front);assert.equal(card.back,source.back);
 assert(eligible(card));
 assert.equal(evaluate(card,card.back).status,'correct','Original answer regressed '+card.id);
 for(const answer of source.accept||[]){
  assert.equal(evaluate(card,answer).status,'correct','Existing correct answer rejected '+card.id);
  sourceAccepted++;
 }
 for(const answer of source.reject||[]){
  const result=evaluate(card,answer);
  assert.equal(result.status,'wrong','Existing misconception not rejected '+card.id);
  assert.equal(result.score,0);
  sourceRejected++;
 }
 for(const answer of row.accept){
  assert.equal(evaluate(card,answer).status,'correct','Reviewed paraphrase rejected '+card.id);
 }
 for(const answer of row.reject){
  const result=evaluate(card,answer);
  assert.equal(result.status,'wrong','Misconception accepted '+card.id+' '+answer);
  assert.equal(result.score,0);
 }
 for(const bad of [
  {id:'unknown-card-id'},{subject:'Physics'},{stage:'Neither'},
  {mock:false},{active:false},{front:'Wrong prompt'},{back:'Wrong model answer'}
 ]){
  const mutated={...source,...bad,accept:[],reject:[]};
  patch([mutated]);
  assert.equal(mutated.v374ExactReviewed,undefined);
  assert.deepEqual(mutated.accept,[]);assert.deepEqual(mutated.reject,[]);
 }
}
assert.equal(groups.size,3);
assert.deepEqual([...groups].sort(),['Arrhenius activation energy','Hess cycles and bond enthalpy','Rates and initial rates'].sort());
for(const key of [
 "PROGRESS_KEY='revisionLoopProgress5'",
 "PROFILE_KEY='revisionLoopProfile11'",
 "SETTINGS_KEY='revisionLoopSettings11'"
])assert(app.includes(key),'Saved progress key changed '+key);
console.log('PASS v374: all 15 original Chemistry mock cards retain IDs/models; 15 vetted paraphrases + 30 misconceptions pass the real marker; '+sourceAccepted+' prior accepted and '+sourceRejected+' prior rejected variants preserved; no cross-scope injection.');
