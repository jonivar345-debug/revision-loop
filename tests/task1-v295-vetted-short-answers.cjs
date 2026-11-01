'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const app=fs.readFileSync('app.js','utf8');
const cards=JSON.parse(fs.readFileSync('mock_short_varied_recall_v293.json','utf8')).cards;
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);
assert(start>=0 && end>start);
const evaluate=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
assert.equal(cards.length,36);
const map=new Map(cards.map(c=>[c.id.replace('task1_v293_',''),c]));
let right=0,wrong=0;
for(const c of cards){
 assert.equal(c.kind,'short');assert.equal(c.strictRecall,true);
 assert(c.front.length<=115 && c.back.length<=95,'Short flashcard limits: '+c.id);
 assert(c.accept.length>=4,'Too few vetted equivalent forms: '+c.id);
 for(const input of c.accept){
  const result=evaluate(c,input);
  assert.equal(result.status,'correct',c.id+' must credit '+JSON.stringify(input));
  right++;
 }
 for(const input of c.reject){
  const result=evaluate(c,input);
  assert.equal(result.status,'wrong',c.id+' must reject '+JSON.stringify(input));
  wrong++;
 }
}
const scenarios=[
 ['physics_card_06','0','correct'],
 ['physics_card_03','6 N','correct'],
 ['physics_card_03','6','wrong'],
 ['physics_card_03','6 V','wrong'],
 ['physics_card_11','−r','correct'],
 ['physics_card_11','r','wrong'],
 ['physics_card_08','π radians apart.','correct'],
 ['physics_card_08','In phase.','wrong'],
 ['chemistry_card_01',"Brady's reagent.",'correct'],
 ['chemistry_card_01',"Tollens' reagent.",'wrong'],
 ['chemistry_card_02','Silver mirror.','correct'],
 ['chemistry_card_02','No visible change occurs.','wrong'],
 ['chemistry_card_04','No.','correct'],
 ['chemistry_card_04','Yes, a silver mirror.','wrong'],
 ['chemistry_card_09','An alcohol and carboxylate ions.','correct'],
 ['chemistry_card_09','An alkene and water.','wrong'],
 ['maths_card_01','n=2k+1 for integer k.','correct'],
 ['maths_card_01','n=2k only.','wrong'],
 ['maths_card_06','(-1, 5)','correct'],
 ['maths_card_06','x < -1 or x > 5.','wrong'],
 ['maths_card_08','b² > 4ac.','correct'],
 ['maths_card_08','b²−4ac < 0.','wrong'],
 ['maths_card_10','The gradient of f at a is zero.','correct'],
 ['maths_card_10','f(a)=0.','wrong'],
 ['maths_card_10',"f''(a)=0",'wrong'],
 ['maths_card_12','150° and 30°.','correct'],
 ['maths_card_12','30° and 330°.','wrong']
];
for(const [id,input,expected] of scenarios){
 const c=map.get(id);assert(c,'Missing '+id);
 assert.equal(evaluate(c,input).status,expected,id+' '+input);
}
assert.equal(cards.filter(c=>c.subject==='Physics').length,12);
assert.equal(cards.filter(c=>c.subject==='Chemistry').length,12);
assert.equal(cards.filter(c=>c.subject==='Maths').length,12);
console.log('PASS v295: '+right+' vetted accepted forms; '+wrong+' explicit wrong forms; '+scenarios.length+' independent real-marker scenarios');
