'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const app=fs.readFileSync('app.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');
assert(sw.includes('-v422-diagram-denial'));
const start=app.indexOf('function normalise('),end=app.indexOf('function rateCard(',start);
const evalCard=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({
 RevisionPhotoelectricCardMarking:{TARGET_ID:'unknown',evaluate:()=>null}
});
const cards=JSON.parse(fs.readFileSync('chemistry_bonding_diagram_recall_v237.json','utf8')).cards;
assert.equal(cards.length,7);
let checked=0;
for(const c of cards){
 assert.equal(evalCard(c,c.back).status,'correct',c.id+' model');
 checked++;
 for(const accept of c.accept||[]){
  assert.equal(evalCard(c,accept).status,'correct',c.id+' accepted');
  checked++;
  for(const form of [
   'The statement "'+accept+'" is wrong.',
   'The statement "'+accept+'" is false.',
   'The statement "'+accept+'" is incorrect.',
   'The statement “'+accept+'” is untrue.'
  ]){
   const result=evalCard(c,form);
   assert.equal(result.status,'wrong',c.id+' falsely accepted denial: '+form);
   assert.equal(result.score,0);
   checked++;
  }
 }
 for(const s of c.reject||[]){
  assert.notEqual(evalCard(c,s).status,'correct',c.id+' explicitly rejected incorrect');
  checked++;
 }
 assert.notEqual(evalCard(c,c.front).status,'correct',c.id+' question echo');
 checked++;
 assert.notEqual(evalCard(c,'I do not know').status,'correct',c.id+' nonanswer');
 checked++;
}
console.log('PASS v422: '+checked+' source-locked bonding-diagram answer checks; exact model/variants accepted, explicit model denials rejected with 0, rejected examples, question echos and nonanswers stay uncredited.');
