'use strict';
// v344: 70 individually reviewed original AQA Physics/Chemistry AS mock cards.
// Specifically wrong concept reversals, notation and unit errors must not earn
// fuzzy keyword marks; keep original saved progress, questions and all other cards.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const audit=j('editorial/task1-v344-70-science-core-variants.json'),original=j('deck.json').cards,app=read('app.js'),sw=read('sw.js');
assert.equal(audit.version,'v344');assert.equal(original.length,3345);
assert.equal(audit.rows.length,70);
assert.deepEqual(audit.counts,{cards:70,Physics:30,Chemistry:40,correctVariants:70,targetedWrongVariants:140,originalCore:3345});
assert(audit.preflight.wrongFullCredit>=21,'Before/after comparison of 21 false full marks must be retained');
assert(audit.preflight.validWrong>=12,'Previously rejected correct paraphrases must be retained');
const rows=new Map(audit.rows.map(r=>[r.id,r]));
assert.equal(rows.size,70);
const copied=original.map(c=>({...c,accept:[...(c.accept||[])],reject:[...(c.reject||[])]}));
const unchanged=new Map(copied.map(c=>[c.id,JSON.stringify(c)]));
const start=app.indexOf('const V344_REVIEWED_CORE_VARIANTS='),end=app.indexOf('// v332:',start);
assert(start>=0&&end>start);
const production=new Function('existing',app.slice(start,end)+'\nreturn {rows:V344_REVIEWED_CORE_VARIANTS,cards:applyV344ScienceCorePrecision(existing)};')(copied);
assert.deepEqual(production.rows,audit.rows,'Test and actual runtime mapping must be identical');
assert.strictEqual(production.cards,copied);
const mstart=app.indexOf('function normalise('),mend=app.indexOf('function importantTokens(',mstart);
assert(mstart>=0&&mend>mstart);
const evaluate=new Function('window',app.slice(mstart,mend)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const qstart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),qend=app.indexOf('function startMockSession(){',qstart);
assert(qstart>=0&&qend>qstart);
const eligible=new Function(app.slice(qstart,qend)+'\nreturn mockEligibleCard;')();
const counts={Physics:0,Chemistry:0};let reviewed=0,models=0,correct=0,wrong=0,oldAccepts=0;
for(const c of copied){
 const r=rows.get(c.id);
 if(!r){assert.equal(JSON.stringify(c),unchanged.get(c.id),'Unreviewed card changed '+c.id);continue;}
 reviewed++;counts[c.subject]++;
 assert.equal(c.subject,r.subject);assert.equal(c.front,r.originalFront);assert.equal(c.back,r.originalBack);
 assert.equal(c.stage,'AS');assert.equal(c.mock,true);assert(eligible(c));
 assert.equal(c.v344ExactReviewed,true);
 assert(c.front.length<150&&c.back.length<170,'Long exam question must not be a flashcard '+c.id);
 assert.equal(evaluate(c,c.back).status,'correct','Original back rejected '+c.id);models++;
 for(const a of r.accept){
  assert.equal(evaluate(c,a).status,'correct','Reviewed good answer incorrectly marked '+c.id+': '+a);correct++;
  assert.notEqual(evaluate(c,'not '+a).status,'correct','Explicit denial incorrectly marked '+c.id+': '+a);
 }
 for(const bad of r.reject){
  const result=evaluate(c,bad);
  assert.equal(result.status,'wrong','Reviewed misconception credited '+c.id+': '+bad);
  assert.equal(result.score,0,'Wrong answer received a non-zero fractional score '+c.id);wrong++;
 }
 const old=original.find(x=>x.id===c.id);
 for(const a of old.accept||[]){assert.equal(evaluate(c,a).status,'correct','Previously accepted correct answer broken '+c.id+': '+a);oldAccepts++;}
}
assert.equal(reviewed,70);assert.deepEqual(counts,{Physics:30,Chemistry:40});
assert.equal(models,70);assert.equal(correct,70);assert.equal(wrong,140);
assert.deepEqual(copied.map(c=>c.id),original.map(c=>c.id),'No original flashcard IDs removed');
assert(app.includes('applyV344ScienceCorePrecision(cards);'));
assert(app.includes('v344ExactReviewed===true'),'Reject known wrong before fuzzy scoring');
assert(sw.includes('v344-science-core-precision'),'Offline users must fetch updated answer checker');
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key),'User progress key changed');
console.log('PASS v344: 70 original one-skill Physics/Chemistry mock cards, 70 model answers, 70 alternative correct answers, 140 known wrong responses and '+oldAccepts+' existing equivalents verified; all 3345 original IDs and storage keys retained.');
