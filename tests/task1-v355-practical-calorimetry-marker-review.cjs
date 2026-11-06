'use strict';
// v355: actual production answer checker against twenty AS practical/thermochemistry recall cards.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const deck=json('deck.json').cards,review=json('editorial/task1-v355-practical-calorimetry-marker-review.json');
const app=read('app.js'),sw=read('sw.js');
assert.equal(deck.length,3345,'Original core count and saved IDs must be unchanged');
assert.equal(new Set(deck.map(c=>c.id)).size,3345);
assert.equal(review.version,'v355');
assert.equal(review.counts.cards,20);
assert.equal(review.counts.physics,10);
assert.equal(review.counts.chemistry,10);
assert.equal(review.counts.acceptedAlternatives,40);
assert.equal(review.counts.incorrectProbeVariants,40);
assert.equal(review.rows.length,20);
assert.equal(new Set(review.rows.map(x=>x.id)).size,20);
assert(sw.includes('-v355-practicals-calorimetry'),'Offline cache must refresh');
assert(app.includes('applyV355PracticalCalorimetryCalibration(cards);'),'The app must actually apply the reviewed markers');
assert(app.includes('applyV354MathsFunctionsCoreCalibration(cards);'),'Previous Maths review must remain active');
assert(app.includes('await fetch(V354_CHEM_CRACKING_URL'),'Previous guarded Chemistry gap card must still load');
const patchStart=app.indexOf('const V355_PRACTICAL_MARKER_VARIANTS='),patchEnd=app.indexOf('// v344:',patchStart);
assert(patchStart>0&&patchEnd>patchStart);
const patch=new Function(app.slice(patchStart,patchEnd)+'\nreturn applyV355PracticalCalorimetryCalibration;')();
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);
assert(start>0&&end>start,'Must use exact real-site evaluator, not a simplified test substitute');
const evaluate=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const id=new Map(deck.map(c=>[c.id,c]));
const originals=review.rows.map(row=>{
 const c=id.get(row.id);
 assert(c,'Original missing '+row.id);
 assert.equal(c.subject,row.subject);
 assert.equal(c.stage,'AS');
 assert.equal(c.mock,true);
 assert.equal(c.front,row.originalFront);
 assert.equal(c.back,row.originalBack);
 assert(c.front.length<=145&&c.back.length<=170,'Keep genuine concise recall questions');
 assert.equal((c.accept||[]).length,0,'Reviewed card already had accepted alternatives');
 assert.equal((c.reject||[]).length,0,'Reviewed card already had rejected probes');
 assert.equal(row.accept.length,2);
 assert.equal(row.reject.length,2);
 return {...c,accept:[],reject:[]};
});
const cards=patch(originals);
let accepted=0,rejected=0;
for(let i=0;i<cards.length;i++){
 const c=cards[i],row=review.rows[i];
 assert.equal(c.id,row.id);
 assert.equal(c.back,row.originalBack);
 assert.equal(c.v355ExactReviewed,true,'Only exact card ID+front+back+scope may be patched');
 assert.equal(evaluate(c,c.back).status,'correct','Original model answer no longer credited: '+c.id);
 for(const answer of row.accept){
  const v=evaluate(c,answer);
  assert.equal(v.status,'correct','Scientifically correct response rejected: '+c.id+' / '+answer+' / '+JSON.stringify(v));
  accepted++;
 }
 for(const answer of row.reject){
  const v=evaluate(c,answer);
  assert.equal(v.status,'wrong','Known mistake wrongly credited: '+c.id+' / '+answer+' / '+JSON.stringify(v));
  assert.equal(v.score,0,'Known mistake received partial marks: '+c.id);
  rejected++;
 }
}
const changed=review.rows.map(row=>({...id.get(row.id),front:'Changed original: '+row.originalFront,mock:false,accept:[],reject:[]}));
patch(changed);
assert(changed.every(x=>!x.v355ExactReviewed&&x.accept.length===0&&x.reject.length===0));
assert.equal(accepted,40);
assert.equal(rejected,40);
console.log('PASS v355: 20 original concise AS Physics measurement/practicals and Chemistry calorimetry cards, 40 valid and 40 specifically wrong answers checked with production marking; original student progress and all earlier banks retained.');
