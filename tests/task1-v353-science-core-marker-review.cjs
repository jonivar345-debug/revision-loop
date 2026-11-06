'use strict';
// v353: test 27 original AQA school-mock science cards with production answer evaluator.
// No new progress IDs, no long-answer cards, no widened Maths scope.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js');
const deck=json('deck.json').cards,ledger=json('editorial/task1-v353-science-core-marker-review.json');
assert.equal(deck.length,3345);
assert.equal(new Set(deck.map(x=>x.id)).size,3345,'Do not change any original user-progress identities');
assert.equal(ledger.version,'v353');
assert.equal(ledger.rows.length,27);
assert.equal(ledger.counts.physics,12);
assert.equal(ledger.counts.chemistry,15);
assert.equal(ledger.counts.correctAlternatives,54);
assert.equal(ledger.counts.wrongProbes,54);
assert.equal(new Set(ledger.rows.map(r=>r.id)).size,27);
assert(sw.includes('-v353-targeted-science-marker'),'Offline cache version must be refreshed');
assert(app.includes('applyV353SchoolMockScienceCalibration(cards);'),'Production loader must apply the reviewed card calibration');
const begin=app.indexOf('const V353_REVIEWED_CORE_VARIANTS=');
const finish=app.indexOf('// v344:',begin);
assert(begin>0&&finish>begin,'Cannot find scoped calibration implementation');
const apply=new Function(app.slice(begin,finish)+'\nreturn applyV353SchoolMockScienceCalibration;')();
const m1=app.indexOf('function normalise('),m2=app.indexOf('function importantTokens(',m1);
assert(m1>0&&m2>m1,'Cannot find production flashcard evaluator');
const evaluate=new Function('window',app.slice(m1,m2)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const byId=new Map(deck.map(c=>[c.id,c]));
const originals=ledger.rows.map(row=>{
 const c=byId.get(row.id);
 assert(c,'Missing original card '+row.id);
 assert.equal(c.subject,row.subject);
 assert.equal(c.stage,row.stage);
 assert.equal(c.mock,true);
 assert.equal(c.front,row.originalFront,'Original front changed '+row.id);
 assert.equal(c.back,row.originalBack,'Original back changed '+row.id);
 assert(c.front.length<=145&&c.back.length<=170,'Reject long-answer disguised recall');
 assert.equal((c.accept||[]).length,0,'Card already has curated accepted responses '+row.id);
 assert.equal((c.reject||[]).length,0,'Card already has curated wrong-answer probes '+row.id);
 assert.equal(row.accept.length,2);
 assert.equal(row.reject.length,2);
 return {...c,accept:[],reject:[]};
});
const calibrated=apply(originals);
let good=0,bad=0;
for(let i=0;i<calibrated.length;i++){
 const c=calibrated[i],row=ledger.rows[i];
 assert.equal(c.id,row.id);
 assert.equal(c.front,row.originalFront);
 assert.equal(c.back,row.originalBack);
 assert.equal(c.v353ExactReviewed,true,'Guarded calibration must mark only exact original cards');
 assert.equal(evaluate(c,c.back).status,'correct','Model answer must still receive full credit: '+c.id);
 for(const answer of row.accept){
  const output=evaluate(c,answer);
  assert.equal(output.status,'correct','Correct answer not recognised: '+c.id+' / '+answer+' / '+JSON.stringify(output));
  good++;
 }
 for(const answer of row.reject){
  const output=evaluate(c,answer);
  assert.equal(output.status,'wrong','Wrong concept was credited: '+c.id+' / '+answer+' / '+JSON.stringify(output));
  assert.equal(output.score,0,'Known wrong answer must get zero marks: '+c.id);
  bad++;
 }
}
// Scope safety: no card with altered wording or non-mock eligibility may be patched.
const wrongScope=ledger.rows.map(r=>({...byId.get(r.id),front:'Different original front: '+r.originalFront,mock:false,accept:[],reject:[]}));
apply(wrongScope);
assert(wrongScope.every(c=>!c.v353ExactReviewed&&c.accept.length===0&&c.reject.length===0));
assert.equal(good,54);
assert.equal(bad,54);
console.log('PASS v353: 27 existing short Physics/Chemistry school mock cards, 54 accepted answers and 54 targeted mistakes validated against the production answer checker; core IDs and mock scope unchanged.');
