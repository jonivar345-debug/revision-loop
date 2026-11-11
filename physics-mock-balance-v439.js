/* v439 Physics mock: select across the five AQA AS 7407 content areas.
   This is only a selection aid. It never excludes a card/question or changes
   saved progress, difficulty, marking, specimen wording or official sources. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.RevisionPhysicsMockBalance=api;
})(typeof window!=='undefined'?window:globalThis,function(){
 'use strict';
 const STRANDS=Object.freeze([
  'Measurements and errors',
  'Particles and radiation',
  'Waves',
  'Mechanics and materials',
  'Electricity'
 ]);
 const REF=Object.freeze({
  '1':STRANDS[0],'2':STRANDS[1],'3':STRANDS[2],
  '4':STRANDS[3],'5':STRANDS[4]
 });
 function strand(item){
  if(!item)return null;
  const spec=String(item.specRef||'').match(/(?:^|\s)3\.([1-5])(?:\.|$|\s)/);
  if(spec)return REF[spec[1]];
  const text=[item.courseTopic,item.topic,item.revisionTopic,item.subtopic]
   .filter(Boolean).join(' ').toLowerCase();
  // Order matters: "internal resistance" belongs to electricity, while
  // "energy levels" is particle physics, not the mechanics work-energy unit.
  if(/electric|current|resistan|resistivity|circuit|diode|thermistor|potential div|emf|superconduct|ldr|sensor|i.v characteristics|i-v characteristics/.test(text))return STRANDS[4];
  if(/particle|radiation|photoelectric|quantum|spectrum|spectra|pion|kaon|strange|baryon|meson|lepton|interaction|energy levels?|muon|antimatter|pair production|nuclear/.test(text))return STRANDS[1];
  if(/wave|sound|optical|light|interferen|diffract|refraction|fibre|stationary|polaris|superposition|young.s slit|total internal/.test(text))return STRANDS[2];
  if(/measur|uncertain|error|precision|accuracy|practical skills|data definitions|graph interpretation|estimation/.test(text))return STRANDS[0];
  if(/mechanic|material|force|projectile|motion|moment|couple|energy|power|elastic|work|momentum|newton|kinematic|vector|equilibrium|stress|strain|young modulus|free.body|slope|free fall/.test(text))return STRANDS[3];
  return null;
 }
 function practical(item){
  const text=[item?.topic,item?.revisionTopic,item?.courseTopic,item?.specRef]
   .filter(Boolean).join(' ');
  const match=text.match(/(?:^|[^\w])RP\s*([1-6])(?:[^\d]|$)/i);
  return match?Number(match[1]):null;
 }
 // picker(pool,number,weightFn) is the existing memory-aware card selector
 // or weighted exam-group selector. It must not mutate the original pool.
 function pickBalanced(pool,count,weightFn,picker,{practicalFirst=false}={}){
  const limit=Math.min(Math.max(0,Number(count)||0),pool.length);
  if(!limit)return [];
  const picked=[],used=new Set();
  const itemOf=x=>Array.isArray(x)?x[0]:x;
  const selectFrom=eligible=>{
   const available=eligible.filter(x=>!used.has(x));
   if(!available.length||picked.length>=limit)return false;
   const result=picker(available,1,weightFn);
   const chosen=Array.isArray(result)?result[0]:result;
   if(!chosen||used.has(chosen)||!available.includes(chosen))return false;
   used.add(chosen);picked.push(chosen);return true;
  };
  // Keep one practical/data group in a substantial exam-only or mixed batch
  // where a tagged required-practical group exists.
  if(practicalFirst&&limit>=4){
   const practicals=pool.filter(x=>practical(itemOf(x))!==null);
   selectFrom(practicals);
  }
  // Rotate all five strands, rather than allowing the largest Mechanics pool
  // to dominate every short mock session. Unclassified entries stay eligible.
  const order=[...STRANDS].sort(()=>Math.random()-.5);
  let advanced=true;
  while(picked.length<limit&&advanced){
   advanced=false;
   for(const name of order){
    if(picked.length>=limit)break;
    if(selectFrom(pool.filter(x=>strand(itemOf(x))===name)))advanced=true;
   }
  }
  if(picked.length<limit){
   const remaining=pool.filter(x=>!used.has(x));
   const rest=picker(remaining,limit-picked.length,weightFn)||[];
   for(const x of rest)if(remaining.includes(x)&&!used.has(x)&&picked.length<limit){used.add(x);picked.push(x)}
  }
  return picked;
 }
 return Object.freeze({STRANDS,strand,practical,pickBalanced});
});
