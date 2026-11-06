'use strict';
// v352 checks exact IDs, correct and wrong variants using the production Revision Loop marker.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const deck=json('deck.json').cards,ledger=json('editorial/task1-v352-mixed-science-core-precision.json');
const app=read('app.js'),sw=read('sw.js');
assert.equal(deck.length,3345,'Original progress identities remain stable');
assert.equal(ledger.version,'v352');
assert.equal(ledger.rows.length,20);
assert.equal(ledger.counts.physics,10);
assert.equal(ledger.counts.chemistry,10);
assert.equal(ledger.counts.addedValid,40);
assert.equal(ledger.counts.addedWrong,40);
assert.equal(new Set(ledger.rows.map(x=>x.id)).size,20);
assert(sw.includes('-v352-mixed-science-core-marker'),'Versioned offline cache not refreshed');
assert(app.includes('applyV352MixedScienceCoreCalibration(cards);'),'Calibration must be used by production core loader');
const start=app.indexOf('const V352_REVIEWED_CORE_VARIANTS='),stop=app.indexOf('// v344:',start);
assert(start>=0&&stop>start,'Scoped calibration function missing');
const patch=new Function(app.slice(start,stop)+'\nreturn applyV352MixedScienceCoreCalibration;')();
const begin=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',begin);
assert(begin>=0&&end>begin);
const evaluate=new Function('window',app.slice(begin,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const byId=new Map(deck.map(c=>[c.id,c]));
const orig=ledger.rows.map(row=>{
 const c=byId.get(row.id);
 assert(c,'Missing original '+row.id);
 assert.equal(c.subject,row.subject);
 assert.equal(c.stage,row.stage);
 assert.equal(c.mock,true);
 assert.equal(c.front,row.originalFront);
 assert.equal(c.back,row.originalBack);
 assert(c.front.length<=145&&c.back.length<=170,'Do not add long-answer disguised flashcard');
 assert.equal((c.accept||[]).length,0,'Original was already patched with accepted options');
 assert.equal((c.reject||[]).length,0,'Original was already patched with reject options');
 assert.equal(row.accept.length,2);
 assert.equal(row.reject.length,2);
 return {...c,accept:[],reject:[]};
});
const reviewed=patch(orig.map(c=>({...c})));
let correct=0,wrong=0;
for(let i=0;i<reviewed.length;i++){
 const c=reviewed[i],row=ledger.rows[i];
 assert.equal(c.id,row.id);
 assert.equal(c.front,row.originalFront);
 assert.equal(c.back,row.originalBack);
 assert.equal(c.v352ExactReviewed,true);
 assert.equal(evaluate(c,c.back).status,'correct','Original answer wrongly rejected: '+c.id);
 for(const answer of row.accept){
  const result=evaluate(c,answer);
  assert.equal(result.status,'correct','Valid paraphrase rejected: '+c.id+' / '+answer+' / '+JSON.stringify(result));
  correct++;
 }
 for(const answer of row.reject){
  const result=evaluate(c,answer);
  assert.equal(result.status,'wrong','Incorrect concept gained credit: '+c.id+' / '+answer+' / '+JSON.stringify(result));
  assert.equal(result.score,0);
  wrong++;
 }
}
const wrongScope=orig.map(c=>({...c,front:'Modified '+c.front,mock:false,accept:[],reject:[]}));
patch(wrongScope);
assert(wrongScope.every(c=>!c.v352ExactReviewed&&c.accept.length===0&&c.reject.length===0),'Patch must not affect other card identities or scopes');
assert.equal(correct,40);
assert.equal(wrong,40);
console.log('PASS v352: 20 original short first-mock science cards (10 Physics, 10 Chemistry), 40 accepted paraphrases and 40 known wrong answers checked against real production evaluator with no changed progress IDs.');
