/* v209: independent evidence rules for five original first-mock AS Pure challenges.
   These are conservative mark suggestions, not official AQA exam marking.
   Students retain manual mark adjustment and review of uploaded working. */
(function(root){
 'use strict';
 const canonical=s=>String(s||'').toLowerCase().replace(/[−–—]/g,'-')
   .replace(/²/g,'^2').replace(/³/g,'^3').replace(/⁵/g,'^5')
   .replace(/×/g,'*').replace(/[.!?]+$/,'').trim().replace(/\s+/g,' ');
 const compact=s=>canonical(s).replace(/\s+/g,'');
 function evaluate(q,input){
  const id=String(q&&q.id||'');
  if(!/^task1_v209_maths_00[1-5]$/.test(id))return null;
  const source=String(input||'').trim();
  const points=Array.isArray(q.markPoints)?q.markPoints:[];
  const zero=()=>result(points.map(()=>false),q);
  if(!source||/^(?:idk|not sure|no idea|i don't know|unsure)[.!]?$/i.test(source))return zero();
  if(canonical(source)===canonical(q.modelAnswer))return result(points.map(()=>true),q);
  const segments=source.split(/(?:[;\n]+|(?<=[.!?])\s+(?=[A-Z]))/)
   .map(canonical).filter(Boolean);
  const denied=s=>/^\s*(?:not|never)\b|\b(?:is|was|are)\s+(?:wrong|incorrect|false|not\s+correct)\b/.test(s);
  // Compare complete, labelled evidence within a claim, not loose numbers
  // appearing somewhere else in a long response.
  const seen=(regex,exclude)=>segments.some(s=>!denied(s)&&
   !(exclude&&exclude.test(s))&&regex.test(s));
  const mat=(regex,exclude)=>segments.some(s=>!denied(s)&&
   !(exclude&&exclude.test(s))&&regex.test(compact(s)));
  let marks=[];
  switch(id){
   case 'task1_v209_maths_001':{
    const factor=mat(/n\^5-n=n\(n-1\)\(n\+1\)\(n\^2\+1\)|n\(n-1\)\(n\+1\)\(n\^2\+1\)/);
    const even=seen(/(?:three\s+consecutive|consecutive\s+integers?)[^.;]{0,110}\beven\b|\beven\b[^.;]{0,95}\bconsecutive\b/);
    const three=seen(/\bconsecutive\b[^.;]{0,120}\b(?:divisible\s+by\s+3|multiple\s+of\s+3)\b|\b(?:divisible\s+by\s+3|multiple\s+of\s+3)\b[^.;]{0,120}\bconsecutive\b/);
    const residues=seen(/\bn\s*=\s*5k\s*\+\s*r\b[^.;]{0,100}\b0[^.;]{0,40}\b1[^.;]{0,40}\b2[^.;]{0,40}\b3[^.;]{0,40}\b4\b/);
    const first=seen(/\br\s*=\s*0[^.;]{0,15}\b1[^.;]{0,15}\b2\b[^.;]{0,90}\b30\b/);
    const last=seen(/\br\s*=\s*3[^.;]{0,15}\b4\b[^.;]{0,90}\b240\b[^.;]{0,35}\b1020\b/);
    const conclusion=seen(/\bdivisible\s+by\s+30\b[^.;]{0,45}\b(?:every|all)\b|\b(?:every|all)\b[^.;]{0,90}\bdivisible\s+by\s+30\b/);
    marks=[factor,even,three,residues,first,last,conclusion];
    break;
   }
   case 'task1_v209_maths_002':{
    const case16=seen(/\bn\s*=\s*16\b/);
    const value=seen(/\b(?:289|256\s*\+\s*16\s*\+\s*17)\b/,/\b(?:288|290)\b/)&&
      seen(/(?:16|n\^2\s*\+\s*n\s*\+\s*17)/);
    const composite=mat(/289=17\^2|289=17\*17/);
    const disproof=seen(/\b(?:counterexample|disprov(?:e|es|ed|ing))\b[^.;]{0,100}\b(?:every|all|claim|statement)\b|\b(?:every|all|claim|statement)\b[^.;]{0,100}\b(?:counterexample|false)\b/);
    const even=mat(/n\^2\+n=n\(n\+1\)/)&&seen(/\beven\b/);
    const odd=seen(/\bodd\b[^.;]{0,100}\b(?:not\s+(?:necessarily\s+)?prime|does\s+not\s+(?:guarantee|mean)[^.;]{0,30}\bprime|doesn't\s+(?:guarantee|mean)[^.;]{0,30}\bprime)\b/);
    marks=[case16,value,composite,disproof,even,odd];
    break;
   }
   case 'task1_v209_maths_003':{
    const ab=mat(/\bab=\(6,8\)/);
    const ac=mat(/\bac=\(k\+2,k\+5\)/);
    const relation=seen(/\b(?:scalar\s+multiple|parallel)\b/,/\bnot\s+parallel\b/)&&
       seen(/\b(?:ab|ac|collinear)\b/);
    const equation=mat(/8\(k\+2\)=6\(k\+5\)|6\(k\+5\)=8\(k\+2\)/);
    const k=seen(/\bk\s*=\s*7\b/,/\bk\s*=\s*7\b[^.;]{0,30}\b(?:not|wrong|incorrect)\b/);
    const bc=mat(/\bbc=\(3,4\)/);
    const ratio=mat(/\bab:bc=2:1|\bab=2bc\b/);
    const unit=mat(/\(3\/5,4\/5\)/)&&
      seen(/\b(?:unit|direction|ab)\b/);
    marks=[ab,ac,relation,equation,k,bc,ratio,unit];
    break;
   }
   case 'task1_v209_maths_004':{
    const ab=mat(/\bab=\(12,8\)/);
    const ac=mat(/\bac=\(-3,11\)/);
    const p=mat(/\bp=\(8,1\)/);
    const mid=mat(/\bq=\(1\/2,5\/2\)|\bq=\(0\.5,2\.5\)/);
    const pq=mat(/\bpq=\(-15\/2,3\/2\)|\bpq=\(-7\.5,1\.5\)/);
    const bc=mat(/\bbc=\(-15,3\)/);
    const parallel=mat(/\bpq=1\/2bc|\bpq=bc\/2/)&&seen(/\bparallel\b/,/\bnot\s+parallel\b/);
    const mag=mat(/(?:\|pq\||lengthpq|magnitude[^=]*)=3√26\/2|(?:\|pq\||lengthpq|magnitude[^=]*)=3sqrt\(26\)\/2/);
    marks=[ab,ac,p,mid,pq,bc,parallel,mag];
    break;
   }
   case 'task1_v209_maths_005':{
    const square=mat(/f\(x\)=\(x-3\)\^2-4/);
    const reflect=seen(/\breflect[^.;]{0,45}\by[\s-]*axis\b|\breflection[^.;]{0,45}\by[\s-]*axis\b/,/\bnot\s+reflect\b/);
    const right=seen(/\b(?:translate|shift|move)[^.;]{0,40}\bright\b[^.;]{0,30}\b1\b|\b(?:translate|shift|move)[^.;]{0,40}\b1\b[^.;]{0,30}\bright\b/,/\bnot\s+(?:translate|shift|move)\b/);
    const stretch=seen(/\b(?:vertical(?:ly)?)[^.;]{0,35}\b(?:stretch|scale)\b[^.;]{0,32}\b(?:factor\s+(?:of\s+)?)?2\b|\b(?:stretch|scale)\b[^.;]{0,35}\bvertical(?:ly)?\b[^.;]{0,32}\b(?:factor\s+(?:of\s+)?)?2\b/);
    const down=seen(/\b(?:translate|shift|move)[^.;]{0,40}\bdown\b[^.;]{0,30}\b3\b|\b(?:translate|shift|move)[^.;]{0,40}\b3\b[^.;]{0,30}\bdown\b/);
    const equation=mat(/g\(x\)=2\(x\+2\)\^2-11/);
    const turning=mat(/\(-2,-11\)/)&&seen(/\b(?:turning\s+point|vertex|minimum)\b/);
    const roots=mat(/x=-2±√\(11\/2\)|x=-2±sqrt\(11\/2\)|x=-2\+-√\(11\/2\)/);
    const intercept=mat(/\(0,-3\)/)&&seen(/\b(?:y[\s-]*intercept|intercept|g\(0\))\b/);
    marks=[square,reflect,right,stretch,down,equation,turning,roots,intercept];
    break;
   }
  }
  // One isolated editor-reviewed alternative can earn its own single point;
  // do not treat a quoted negative or a string of unrelated numbers as proof.
  const accepted=q.reviewedShortAnswerPoints||{};
  if(segments.length===1&&!denied(segments[0])){
   for(const [index,alts] of Object.entries(accepted)){
    if(Array.isArray(alts)&&alts.some(x=>canonical(x)===segments[0]))marks[+index]=true;
   }
  }
  return result(marks,q);
 }
 function result(marks,q){
  const flags=Array.from({length:q.markPoints?.length||0},(_,i)=>marks[i]===true);
  const suggested=flags.filter(Boolean).length;
  return {preds:flags,scores:flags.map(v=>v?1:0),suggested,
   finalCorrect:suggested===q.marks,confidence:'medium'};
 }
 root.RevisionPureMathsV209={evaluate};
})(typeof window!=='undefined'?window:globalThis);
