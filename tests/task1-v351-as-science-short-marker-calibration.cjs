'use strict';
// v351: regression test against the real Revision Loop answer evaluator, with fixed old card IDs.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const deck=json('deck.json').cards,ledger=json('editorial/task1-v351-as-science-short-marker-calibration.json');
const app=read('app.js'),sw=read('sw.js');
assert.equal(deck.length,3345,'Must preserve every original card ID and save record');
assert.equal(ledger.version,'v351');
assert.equal(ledger.rows.length,12);
assert.equal(ledger.counts.originalCore,3345);
assert.equal(ledger.counts.physics,6);
assert.equal(ledger.counts.chemistry,6);
assert.equal(new Set(ledger.rows.map(r=>r.id)).size,12);
assert(sw.includes('-v351-as-science-short-marker'),'Existing offline cache must invalidate for updated marker');
assert(app.includes('applyV351ASScienceCoreCalibration(cards);'),'Existing core cards must be calibrated in actual app load');
const pos=app.indexOf('const V351_REVIEWED_CORE_VARIANTS='),end=app.indexOf('// v344:',pos);
assert(pos>0&&end>pos,'Cannot identify exact audit/patch function');
const apply=new Function(app.slice(pos,end)+'\nreturn applyV351ASScienceCoreCalibration;')();
const begin=app.indexOf('function normalise('),finish=app.indexOf('function importantTokens(',begin);
assert(begin>0&&finish>begin);
const evaluate=new Function('window',app.slice(begin,finish)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const set=new Map(deck.map(x=>[x.id,x]));
const originals=ledger.rows.map(r=>{
 const c=set.get(r.id);
 assert(c,'Missing original ID '+r.id);
 assert.equal(c.subject,r.subject);
 assert.equal(c.stage,'AS');
 assert.equal(c.mock,true);
 assert.equal(c.front,r.originalFront,'Original question changed '+r.id);
 assert.equal(c.back,r.originalBack,'Original correct answer changed '+r.id);
 assert(c.front.length<=145&&c.back.length<=170,'Do not turn a recall card into an exam essay');
 assert.equal((c.accept||[]).length,0,'Do not duplicate already calibrated accepted variants');
 assert.equal((c.reject||[]).length,0,'Do not duplicate existing wrong-answer calibration');
 assert.equal(r.accept.length,2);
 assert.equal(r.reject.length,2);
 return {...c,accept:[...(c.accept||[])],reject:[...(c.reject||[])]};
});
const reviewed=apply(originals);
let valid=0,invalid=0;
for(let i=0;i<reviewed.length;i++){
 const c=reviewed[i],row=ledger.rows[i];
 assert.equal(c.id,row.id);
 assert.equal(c.front,row.originalFront);
 assert.equal(c.back,row.originalBack);
 assert.equal(c.v351ExactReviewed,true);
 assert.equal(evaluate(c,c.back).status,'correct','Model must still earn full credit: '+c.id);
 for(const answer of row.accept){
  const actual=evaluate(c,answer);
  assert.equal(actual.status,'correct','Valid short paraphrase rejected: '+c.id+' / '+answer+' / '+JSON.stringify(actual));
  valid++;
 }
 for(const answer of row.reject){
  const actual=evaluate(c,answer);
  assert.equal(actual.status,'wrong','Wrong concept wrongly credited: '+c.id+' / '+answer+' / '+JSON.stringify(actual));
  assert.equal(actual.score,0,'Wrong concept gained partial marks: '+c.id+' / '+answer);
  invalid++;
 }
}
// Exact-ID/scoped guard: a changed original answer or mock scope must never be silently overridden.
const invalidCopies=ledger.rows.map(row=>({...set.get(row.id),front:'Changed question '+row.originalFront,mock:false,accept:[],reject:[]}));
apply(invalidCopies);
assert(invalidCopies.every(c=>!c.v351ExactReviewed&&c.accept.length===0&&c.reject.length===0));
assert.equal(valid,24);
assert.equal(invalid,24);
console.log('PASS v351: 12 unchanged short AS science originals, 24 valid answers accepted and 24 scientifically wrong answers rejected by actual production evaluator; stable original IDs.');
