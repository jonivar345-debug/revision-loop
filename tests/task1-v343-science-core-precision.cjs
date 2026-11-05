'use strict';
// v343: 52 selected exact-ID original science mock cards. Scientifically reviewed
// wrong answers must not receive fuzzy credit. No change to original IDs or prompts.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const editorial=j('editorial/task1-v343-52-original-core-science-marking.json');
const deck=j('deck.json'),app=read('app.js'),sw=read('sw.js');
assert.equal(editorial.version,'v343');
assert.equal(editorial.rows.length,52);
assert.equal(editorial.counts.Physics,22);assert.equal(editorial.counts.Chemistry,30);
assert.equal(deck.cards.length,3345);
const originalIds=deck.cards.map(c=>c.id);
assert.equal(new Set(originalIds).size,originalIds.length);
const base=deck.cards.map(c=>({...c,accept:[...(c.accept||[])],reject:[...(c.reject||[])]}));
const before=new Map(base.map(c=>[c.id,JSON.stringify(c)]));
const start=app.indexOf('const V343_REVIEWED_CORE_VARIANTS='),end=app.indexOf('// v332:',start);
assert(start>0&&end>start,'v343 runtime calibrator missing');
const runtime=new Function('existing',app.slice(start,end)+'\nreturn {rows:V343_REVIEWED_CORE_VARIANTS,cards:applyV343ScienceCorePrecision(existing)};')(base);
assert.deepEqual(runtime.rows,editorial.rows,'Production calibrated IDs and edited entries must match the reviewed evidence');
assert.strictEqual(runtime.cards,base,'Keep existing array and review state');
const markerStart=app.indexOf('function normalise('),markerEnd=app.indexOf('function importantTokens(',markerStart);
assert(markerStart>0&&markerEnd>markerStart);
const judge=new Function('window',app.slice(markerStart,markerEnd)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const first=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),last=app.indexOf('function startMockSession(){',first);
assert(first>=0&&last>first);
const mock=new Function(app.slice(first,last)+'\nreturn mockEligibleCard;')();
const expected=new Map(editorial.rows.map(r=>[r.id,r]));
assert.equal(expected.size,52);
let model=0,valid=0,wrong=0,existing=0,changed=0;
const subject={Physics:0,Chemistry:0};
for(const c of base){
 const row=expected.get(c.id);
 if(!row){assert.equal(JSON.stringify(c),before.get(c.id),'Unreviewed card unexpectedly changed '+c.id);continue;}
 changed++;subject[c.subject]++;
 assert.equal(c.subject,row.subject);assert.equal(c.front,row.originalFront);assert.equal(c.back,row.originalBack);
 assert.equal(c.mock,true);assert(mock(c),'Selected card no longer in mock '+c.id);
 assert.equal(c.v343ExactReviewed,true,'Exact wrong-answer precedence missing '+c.id);
 assert(c.front.length<160&&c.back.length<170,'Never use a long exam question as a flashcard '+c.id);
 assert.equal(judge(c,c.back).status,'correct','Model answer must be accepted '+c.id);model++;
 for(const ans of row.accept){
  const result=judge(c,ans);
  assert.equal(result.status,'correct','Vetted correct answer rejected '+c.id+': '+ans);valid++;
  assert.notEqual(judge(c,'not '+ans).status,'correct','Explicitly denied right answer credited '+c.id);
 }
 for(const ans of row.reject){
  const result=judge(c,ans);
  assert.equal(result.status,'wrong','Known misconception credited '+c.id+': '+ans);wrong++;
 }
 const original=j('deck.json').cards.find(x=>x.id===c.id);
 for(const ans of (original.accept||[])){
  assert.equal(judge(c,ans).status,'correct','Original historically accepted answer broken '+c.id+': '+ans);existing++;
 }
}
assert.equal(changed,52);assert.deepEqual(subject,{Physics:22,Chemistry:30});
assert.equal(model,52);assert.equal(valid,52);assert.equal(wrong,104);
assert.deepEqual(base.map(c=>c.id),originalIds);
assert(editorial.historicalMarkerPreflight.incorrectCorrect>=11,'Preflight must record prior known false full marks');
assert(editorial.historicalMarkerPreflight.validWrong>=5,'Preflight must record prior rejected valid alternatives');
assert(sw.includes('v343-science-core-precision'),'Refresh offline cache for runtime marking patch');
assert(app.includes('applyV343ScienceCorePrecision(cards);'),'Loader must run the patch');
assert(app.includes('v343ExactReviewed===true'),'Reviewer branch must guard rejected distractors before fuzzy scoring');
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])
 assert(app.includes(k),'Progress storage key altered');
console.log('PASS v343: 52 science core flashcards, 52 models, 52 vetted paraphrases, 104 known wrong variants and '+existing+' previously accepted answers checked in the actual marker. All 3345 original IDs and progress keys retained.');
