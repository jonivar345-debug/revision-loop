'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),j=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const app=fs.readFileSync('app.js','utf8');
const names=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const a=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),b=app.indexOf(' const added=[',a);
const cards=new Function('cards','extraFlashBanks',app.slice(a,b)+'\nreturn cards;')([...j('deck.json').cards],names.map(j));
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);
const evaluate=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const bySubject={Physics:0,Chemistry:0,Maths:0};
let checked=0,aliases=0;
for(const c of cards){
 const back=String(c.back||'').trim();
 if(back.length<=4)continue;
 assert.equal(evaluate(c,back).status,'correct',c.id+' model still correct');
 const denied=evaluate(c,'Not '+back.replace(/[.!?]+$/,''));
 assert.equal(denied.status,'wrong',c.id+' entire correct answer negated');
 bySubject[c.subject]++;checked++;
 if(Array.isArray(c.accept) && c.accept.length){
  assert.equal(evaluate(c,'Not '+c.accept[0].replace(/[.!?]+$/,'')).status,'wrong',c.id+' accepted equivalent negated');
  aliases++;
 }
}
assert(checked>2500,'Expected thousands of genuine cards to be checked');
for(const s of ['Physics','Chemistry','Maths'])assert(bySubject[s]>100,'Expected '+s);
const examples=[
 ['task1_v293_physics_card_06','Zero.'],
 ['task1_v293_chemistry_card_02','A silver mirror forms.'],
 ['task1_v293_maths_card_10','f′(a)=0.']
];
for(const [id,back] of examples){
 const c=cards.find(x=>x.id===id);assert(c);
 assert.equal(evaluate(c,back).status,'correct',id);
 assert.equal(evaluate(c,'Not '+back).status,'wrong',id);
}
console.log('PASS v297: model answers remain correct and exact negations rejected across '+checked+' cards ('+JSON.stringify(bySubject)+'); '+aliases+' first accepted variants also negation checked');
