'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const app=fs.readFileSync('app.js','utf8'),data=JSON.parse(fs.readFileSync('mock_short_recall_and_cloze_v298.json','utf8'));
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);
assert(start>0&&end>start);
const mark=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const bank=data.cards.filter(c=>c.method==='fill gaps');
assert.equal(bank.length,6);
const spec={physics_31:2,physics_32:2,chemistry_31:3,chemistry_32:2,maths_32:1,maths_33:2};
let checked=0;
function test(c,answer,want,score){
 const r=mark(c,answer);
 assert.equal(r.status,want,c.id+' input='+JSON.stringify(answer)+' expected '+want+', got '+JSON.stringify(r));
 if(score!==undefined)assert(Math.abs(r.score-score)<.00001,c.id+' '+answer+' score '+r.score+' expected '+score);
 checked++;
}
for(const c of bank){
 const key=c.id.replace('task1_v298_','');
 assert.equal(c.clozeParts?.length,spec[key]);
 for(const p of c.clozeParts){assert(p.length>0);assert.equal(new Set(p).size,p.length);}
 for(const answer of c.accept)test(c,answer,'correct',1);
 test(c,'','neutral',0);
 for(let i=0;i<c.clozeParts.length;i++)for(const synonym of c.clozeParts[i]){
  const a=c.clozeParts.map((part,j)=>j===i?synonym:part[0]);
  test(c,a.join('; '),'correct',1);
 }
 if(c.clozeParts.length>=2){
  test(c,c.clozeParts.map((p,i)=>i===0?'not '+p[0]:p[0]).join('; '),'partial',(c.clozeParts.length-1)/c.clozeParts.length);
  test(c,c.clozeParts.map(p=>'not '+p[0]).join('; '),'wrong',0);
  test(c,c.clozeParts.map(p=>p[0]).join(', '),'correct',1);
  test(c,c.clozeParts.map(p=>p[0]).join(' and '),'correct',1);
 }
 for(const r of c.reject){
  assert.notEqual(mark(c,r).status,'correct',c.id+' reject awarded full credit: '+r);
  checked++;
 }
}
const by=Object.fromEntries(bank.map(c=>[c.id,c]));
test(by.task1_v298_chemistry_31,'white;yellow;cream','partial',1/3);
test(by.task1_v298_chemistry_31,'yellow;cream;white','partial',1/3);
test(by.task1_v298_chemistry_32,'positive;negative','wrong',0);
test(by.task1_v298_chemistry_32,'exothermic;positive','correct',1);
test(by.task1_v298_maths_33,'3 left;2 down','wrong',0);
test(by.task1_v298_maths_33,'3 right;2 down','partial',.5);
test(by.task1_v298_maths_33,'3 to the right, two units up','correct',1);
test(by.task1_v298_physics_32,'lower; exceed','partial',.5);
test(by.task1_v298_physics_31,'displacement; signed','partial',.5);
test(by.task1_v298_physics_31,'displacement; magnitudes','correct',1);
test(by.task1_v298_maths_32,'2k','wrong',0);
test(by.task1_v298_maths_32,'2*k+1','correct',1);
test(by.task1_v298_chemistry_31,'white,cream','wrong',0);
test(by.task1_v298_chemistry_31,'white;cream;yellow;white','wrong',0);
for(const [id,right,wrong] of [
 ['task1_v298_maths_25',"f'(a)=0",'f(a)=0'],
 ['task1_v298_chemistry_15','q = n × |ΔH|','q = n × ΔH']
]){
 const c=data.cards.find(x=>x.id===id);
 test(c,right,'correct',1);test(c,wrong,'wrong',0);
}
console.log('PASS v302 '+bank.length+' cloze cards with '+checked+' real-marker checks, independent partial credit, ordered synonyms, explicit rejects and symbol guards.');
