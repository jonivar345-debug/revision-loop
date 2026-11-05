'use strict';
// v345: individually reviewed taught A2 Chemistry one-skill mock recall.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const editorial=j('editorial/task1-v345-40-a2-chemistry-precision.json');
const original=j('deck.json').cards,app=read('app.js'),sw=read('sw.js');
assert.equal(editorial.version,'v345');assert.equal(original.length,3345);
assert.equal(editorial.rows.length,40);
assert.deepEqual(editorial.counts,{cards:40,Physics:0,Chemistry:40,correctVariants:40,incorrectVariants:80,originalCore:3345});
assert(editorial.preflight.badPreviouslyFullCredit>=24);
assert(editorial.preflight.goodRejected>=12);
const selected=new Map(editorial.rows.map(x=>[x.id,x]));assert.equal(selected.size,40);
const copy=original.map(c=>({...c,accept:[...(c.accept||[])],reject:[...(c.reject||[])]}));
const before=new Map(copy.map(c=>[c.id,JSON.stringify(c)]));
const start=app.indexOf('const V345_REVIEWED_CORE_VARIANTS='),end=app.indexOf('// v332:',start);
assert(start>0&&end>start,'Production v345 patch missing');
const runtime=new Function('existing',app.slice(start,end)+'\nreturn {rows:V345_REVIEWED_CORE_VARIANTS,cards:applyV345TaughtChemistryCorePrecision(existing)};')(copy);
assert.deepEqual(runtime.rows,editorial.rows,'Actual runtime mapping must match approved editorial data');
assert.strictEqual(runtime.cards,copy);
const i=app.indexOf('function normalise('),k=app.indexOf('function importantTokens(',i);
assert(i>0&&k>i);
const judge=new Function('window',app.slice(i,k)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const a=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),b=app.indexOf('function startMockSession(){',a);
assert(a>0&&b>a);
const eligible=new Function(app.slice(a,b)+'\nreturn mockEligibleCard;')();
let reviewed=0,models=0,good=0,bad=0,oldGood=0;
for(const c of copy){
 const r=selected.get(c.id);
 if(!r){assert.equal(JSON.stringify(c),before.get(c.id),'Other core card changed '+c.id);continue;}
 reviewed++;
 assert.equal(c.subject,'Chemistry');assert.equal(c.stage,'A2');
 assert.equal(c.front,r.originalFront);assert.equal(c.back,r.originalBack);
 assert.equal(c.v345ExactReviewed,true);assert.equal(c.mock,true);assert(eligible(c));
 assert(c.front.length<=150&&c.back.length<=170);
 assert.equal(judge(c,c.back).status,'correct','Model answer rejected '+c.id);models++;
 for(const ans of r.accept){
  assert.equal(judge(c,ans).status,'correct','Valid alternative rejected '+c.id+': '+ans);good++;
  assert.notEqual(judge(c,'not '+ans).status,'correct','Explicit denial accepted '+c.id);
 }
 for(const ans of r.reject){
  const marked=judge(c,ans);
  assert.equal(marked.status,'wrong','Known reversed chemistry or wrong concept credited '+c.id+': '+ans);
  assert.equal(marked.score,0);bad++;
 }
 const originalCard=original.find(x=>x.id===c.id);
 for(const ans of originalCard.accept||[]){assert.equal(judge(c,ans).status,'correct','Historical accepted answer regressed '+c.id);oldGood++;}
}
assert.equal(reviewed,40);assert.equal(models,40);assert.equal(good,40);assert.equal(bad,80);
assert.deepEqual(copy.map(c=>c.id),original.map(c=>c.id));
assert(app.includes('applyV345TaughtChemistryCorePrecision(cards);'));
assert(app.includes('v345ExactReviewed===true'));
assert(sw.includes('v345-taught-a2-chemistry-precision'));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v345: 40 taught A2 Chemistry short recall cards, 40 model answers, 40 new valid variants, 80 known incorrect variants and '+oldGood+' original equivalent answers; unchanged 3345 original IDs, no new flashcards or progress-key changes.');
