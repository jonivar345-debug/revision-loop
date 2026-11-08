'use strict';
// v422: exactly seven previously observed Chemistry bonding-diagram full-credit
// false positives must now score zero on quoted model-answer denials.
// Do not change card phrasing or legitimate accepted alternatives.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js');
assert(sw.includes('-v422-bond-diagram-denials'),'New cache key needed for offline app patch');
const start=app.indexOf('function normalise('),end=app.indexOf('function rateCard(',start);
assert(start>0&&end>start);
const source=app.slice(start,end);
assert(source.includes('function isV422ExplicitBondDiagramDenial(c,input){'));
const {evaluate,denial}=new Function('window',source+
 '\nreturn {evaluate:evaluateCard,denial:isV422ExplicitBondDiagramDenial};')({
 RevisionPhotoelectricCardMarking:{TARGET_ID:'never-this-id',evaluate:()=>null}
});
const b=json('chemistry_bonding_diagram_recall_v237.json');
assert.equal(b.cards.length,7);
const expected=Array.from({length:7},(_,i)=>'task1_v237_chem_bond_diagram_0'+(i+1));
assert.deepEqual(b.cards.map(c=>c.id),expected);
let tested=0;
for(const c of b.cards){
 assert.equal(c.subject,'Chemistry');
 assert.equal(c.mock,true);
 assert.equal(c.taught,true);
 assert.equal(c.kind,'short');
 const valid=[c.back,...c.accept];
 for(const value of valid){
  assert.equal(evaluate(c,value).status,'correct','Correct sourced answer rejected: '+c.id);
  tested++;
  for(const word of ['wrong','false','incorrect','untrue']){
   const sentence='The statement "'+value+'" is '+word+'.';
   assert.equal(denial(c,sentence),true,'Expected exact-source denial recognition: '+c.id);
   const r=evaluate(c,sentence);
   assert.equal(r.status,'wrong','Explicit denial earned credit '+c.id);
   assert.equal(r.score,0,'Explicit denial earned points '+c.id);
   tested++;
  }
 }
 for(const bad of c.reject){
  assert.notEqual(evaluate(c,bad).status,'correct','Explicit wrong variant got full credit '+c.id);
  tested++;
 }
 assert.equal(evaluate(c,'').score,0);
 assert.equal(evaluate(c,c.front).score,0);
 assert.equal(evaluate(c,'I do not know').score,0);
 tested+=3;
 // Contrast prose and negative statements that do not deny an exact sourced
 // answer do NOT trigger this narrow v422 rule; leave them to established scorer.
 for(const other of ['not '+c.back+' but another idea',
  'The statement "'+c.back+'" is wrong, but I can explain why',
  'The statement "unrelated incorrect answer" is wrong.']){
  assert.equal(denial(c,other),false,'Overbroad denial block on '+c.id);
  tested++;
 }
}
const other=json('maths_first_mock_micro_recall_v348.json').cards[0];
assert.equal(denial(other,'The statement "'+other.back+'" is wrong.'),false);
assert.equal(evaluate(other,other.back).status,'correct');
assert.equal(json('deck.json').cards.length,3345);
assert.equal(json('exam_questions.json').questions.length,1268);
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'",
 "PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])
 assert(app.includes(k));
console.log('PASS v422: '+tested+' sourced bonding-diagram marker checks across all seven cards; explicit quoted model and accepted-alternative denials earn zero, legitimate answers retained, all prior profile and question identifiers unchanged.');
