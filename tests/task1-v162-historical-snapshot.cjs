'use strict';
// Preserve historical release snapshots while v162 tests verify today's exact flags.
const recovered=new Set(["task1_v136_007","task1_v136_008","task1_v136_009","task1_v136_063","task1_v136_064","task1_v136_066","task1_v136_067","math_a2_stationary_class"]);
const removed=new Set(["task1_v136_068","task1_v136_069"]);
module.exports=function projectV160Snapshot(d){
 if(d.deckVersion<162)return d;
 d.cards=d.cards.filter(c=>!c.id.startsWith('task1_v162_')).map(c=>{
  if(recovered.has(c.id))return {...c,stage:'A2',mock:false,scope:'full',taught:c.id==='math_a2_stationary_class'};
  if(removed.has(c.id))return {...c,stage:'AS',mock:true,scope:'mock',taught:true};
  return c;
 });
 d.deckVersion=160;
 return d;
};
