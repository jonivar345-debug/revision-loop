/* v191: independent, cautiously suggested method marks for six ORIGINAL AS Pure questions.
   No OCR claim: typed/scanned working is always reviewable by the student. */
(function(root){
 'use strict';
 function evaluate(q,input){
  const mode=String(q?.markingMode||'');
  if(!/^originalAs191(?:Exhaust|Trig|Circle|Transform|Binomial|Area)$/.test(mode))return null;
  const raw=String(input||'').trim();
  if(!raw)return response(q,[]);
  if(/^(?:idk|no idea|not sure|i don'?t know|unsure)[.!]?$/i.test(raw))return response(q,[]);
  const t=raw.toLowerCase().replace(/[−–—]/g,'-').replace(/θ/g,'theta')
    .replace(/[²]/g,'^2').replace(/[³]/g,'^3').replace(/[⁴]/g,'^4').replace(/×/g,'*').replace(/÷/g,'/');
  const compact=t.replace(/\s+/g,'');
  const has=(r)=>r.test(t),flat=(r)=>r.test(compact);
  let marks=[];
  switch(mode){
   case 'originalAs191Exhaust':{
    const all=has(/n\s*=\s*-3\s*,\s*-2\s*,\s*-1\s*,\s*0\s*,\s*1\s*,\s*2\s*,\s*3/);
    const neg=has(/(?:n\s*\^?\s*3\s*-\s*n\s*(?:equals?|=)\s*)?-24\s*,\s*-6\s*,\s*0/)&&has(/(?:n\s*=|-3\s*,\s*-2)|n\s*\^?\s*3|\b(?:results?|values?)\b/i);
    const pos=has(/(?:n\s*\^?\s*3\s*-\s*n\s*(?:equals?|=)\s*)?0\s*,\s*0\s*,\s*6\s*,\s*24/);
    const done=has(/(?:all|every|each|seven).{0,90}(?:divisible\s+by\s+6|multiples?\s+of\s+6)|(?:divisible\s+by\s+6|multiples?\s+of\s+6).{0,80}(?:all|every|each|case)/i);
    marks=[all,neg,pos,done&&neg&&pos];
    break;
   }
   case 'originalAs191Trig':{
    // Equivalent textbook notations for sin²θ, cos²θ and cos(θ) must
    // not lose method marks because of brackets or input style.
    const tf=compact.replace(/(sin|cos)\^2\(theta\)/g,'$1^2theta')
      .replace(/(sin|cos)\(theta\)\^2/g,'$1^2theta')
      .replace(/(sin|cos)\(theta\)/g,'$1theta');
    const disputed=has(/\b(?:is|are|was|were)\s+(?:not\s+correct|wrong|incorrect|false)\b|\b(?:wrong|incorrect)\s+(?:answer|result|solutions?|factorisation|identity)\b/);
    const identity=(
      /sin\^2theta=1-cos\^2theta|sin\^2theta\+cos\^2theta=1|cos\^2theta\+sin\^2theta=1|2\(1-cos\^2theta\)\+costheta-1=0/.test(tf)
    )&&!disputed;
    const quadratic=(
      /2cos\^2theta-costheta-1=0|-2cos\^2theta\+costheta\+1=0|2cos\^2theta=costheta\+1/.test(tf)
    )&&!disputed;
    const factor=(
      /\(2costheta\+1\)\(costheta-1\)=0|\(costheta-1\)\(2costheta\+1\)=0/.test(tf)
    )&&!disputed;
    const cosPair=(
      /costheta=1(?:or|and|,|;)?(?:costheta=)?(?:-1\/2|-0\.5)/.test(tf)||
      /costheta=(?:-1\/2|-0\.5)(?:or|and|,|;)?(?:costheta=)?1(?!\d)/.test(tf)
    )&&!disputed;
    // A full answer must give exactly the three distinct values in the stated
    // half-open interval; explicitly rejected answers earn no solution mark.
    const angleStatement=t.match(/(?:\btheta\s*(?:=|∈\s*\{)|\bsolutions?\s*(?:are|:|=)\s*)([^.;\n]+)/i);
    const angles=angleStatement?[...angleStatement[1].matchAll(/[-+]?\d+(?:\.\d+)?/g)].map(m=>Number(m[0])):[];
    const deniedAngles=disputed||/\b(?:not|never)\s+(?:the\s+)?(?:correct\s+)?(?:solutions?\s*(?:are|is)\s+)?theta\s*(?:=|∈)/.test(t);
    const solutions=angles.length===3&&angles.every(v=>[0,120,240].includes(v))&&
      new Set(angles).size===3&&!deniedAngles;
    marks=[identity,quadratic,factor,cosPair,solutions];
    break;
   }
   case 'originalAs191Circle':{
    // Equivalent rearrangements are one tangent mark, never extra marks.
    const square=flat(/\(x-3\)\^2\+\(y\+2\)\^2=25|\(y\+2\)\^2\+\(x-3\)\^2=25/);
    const centre=has(/(?:centre|center)\s*(?:(?:is|at)\s*|[=:]\s*)?\(?\s*3\s*,\s*-2\s*\)?/)&&
      has(/(?:radius\s*(?:(?:is)\s*|[=:]\s*)?|r\s*=\s*)5\b/);
    const point=flat(/9\+16=25|3\^2\+4\^2=25|\(6-3\)\^2\+\(2\+2\)\^2=25|\(2\+2\)\^2\+\(6-3\)\^2=25/)&&
      has(/\b(?:lies|on|verified|satisfies|substitut)\b|\bat\s*p\b/);
    const gradient=(flat(/4\/3/)||flat(/1\.333(?:3)*/))&&(flat(/-3\/4/)||flat(/-0\.75/));
    const sameTangent=flat(/3x\+4y-26=0|3x\+4y=26|4y=-3x\+26|y=-3x\/4\+13\/2|y=-0\.75x\+6\.5|y-2=-3\(x-6\)\/4|y-2=-3\/4\(x-6\)/);
    // Do not award a point for an equation explicitly disowned as wrong.
    const deniesTangent=has(/\b(?:not\s+(?:a\s+|the\s+)?tangent|tangent\s+(?:is|was)\s+(?:not|wrong|incorrect)|tangent\s+equation\s+(?:is|was)\s+not|26\s*(?:=\s*0)?\s+is\s+(?:not|wrong|incorrect))\b/);
    const tangent=sameTangent&&!deniesTangent;
    marks=[square,centre,point,gradient,tangent];
    break;
   }
   case 'originalAs191Transform':{
    const square=flat(/f\(x\)=\(x\+1\)\^2-4/);
    const rejectRight=has(/\b(?:not|never)\s+(?:translate|shift|move)[^.;]{0,35}\bright\b|(?:translate|shift|move)[^.;]{0,40}\bright\b[^.;]{0,18}\b(?:incorrect|wrong|false)\b/);
    const right=has(/(?:right|positive\s+x).{0,22}\b3\b|\b3\b.{0,22}\bright\b/)&&!rejectRight;
    const rejectReflect=has(/\b(?:not|never)\s+(?:reflect|reflection)[^.;]{0,26}x[\s-]*axis|\breflect[^.;]{0,26}x[\s-]*axis[^.;]{0,18}\b(?:wrong|incorrect|false)\b/);
    const reflect=has(/reflect.{0,20}x[\s-]*axis|reflection.{0,20}x[\s-]*axis/)&&!rejectReflect;
    const rejectStretch=has(/\b(?:not|never)\s+(?:a\s+)?(?:vertical(?:ly)?\s+)?(?:stretch|scale)[^.;]{0,25}\b2\b|\b(?:stretch|scale)[^.;]{0,40}\b2\b[^.;]{0,18}\b(?:wrong|incorrect|false)\b/);
    const stretch=has(/(?:vertical(?:ly)?|y[\s-]*axis).{0,35}(?:stretch|scale)|(?:stretch|scale).{0,35}vertical(?:ly)?/)&&has(/(?:factor|by)(?:\s+of)?\s*2\b/)&&!rejectStretch;
    const rejectUp=has(/\b(?:not|never)\s+(?:translate|shift|move)[^.;]{0,35}\bup\b|(?:translate|shift|move)[^.;]{0,40}\bup\b[^.;]{0,18}\b(?:incorrect|wrong|false)\b/);
    const up=has(/(?:up|upwards|positive\s+y).{0,20}\b1\b|\b1\b.{0,20}\bup\b/)&&!rejectUp;
    const vertex=flat(/g\(x\)=-2\(x-2\)\^2\+9/)&&has(/(?:turning\s+point|vertex).{0,24}\(\s*2\s*,\s*9\s*\)/);
    // Equal exact forms of the same pair of roots each earn one result mark.
    // A worked pair must include both roots, rather than an isolated one.
    const exactRoots=flat(/x=2(?:\+\/-|±)3\/(?:sqrt\(2\)|√2)|x=2±3√2\/2|x=2±3\/√2|x=2±\(3√2\)\/2|x=2±\(3sqrt\(2\)\)\/2|x=\(4±3√2\)\/2|x=\(4±3sqrt\(2\)\)\/2|x=2±sqrt\(9\/2\)|x=2±sqrt\(4\.5\)/)||
      flat(/x=2\+3√2\/2(?:or|and|,)x=2-3√2\/2|x=2-3√2\/2(?:or|and|,)x=2\+3√2\/2/)||
      (has(/x\s*=\s*2\s*[-+]\s*3\s*\/\s*(?:√2|sqrt\(2\))/)&&has(/(?:and|,|±)/));
    const rejectRoots=has(/\b(?:not|never)\s+(?:the\s+)?(?:roots?\s+(?:are|is)\s*|solutions?\s+(?:are|is)\s*)?x\s*=|x\s*=[^;\n]{0,60}\b(?:wrong|incorrect|false)\b/);
    const roots=exactRoots&&!rejectRoots;
    marks=[square,right,reflect,stretch,up,vertex,roots];
    break;
   }
   case 'originalAs191Binomial':{
    const x2=flat(/80a\^2|10\*2\^3\*a\^2/);
    const two=flat(/a\^2=9/)&&flat(/a=±3|a=\+\/-3|a=\+-3|a=\+3.*a=-3/);
    const x3=flat(/40a\^3|10\*2\^2\*a\^3/);
    const plus=flat(/a=3(?!\d)/)&&has(/positiv|x\s*\^?\s*3.{0,36}coefficien|coefficient.{0,36}x\s*\^?\s*3/);
    const x4=flat(/10\*81=810|5\*2\*a\^4=10\*81=810/)||has(/(?:coefficient\s+of\s*x\s*\^?\s*4|x\s*\^?\s*4\s+coefficient).{0,22}(?:=|is)\s*\+?810\b/);
    marks=[x2,two,x3,plus,x4];
    break;
   }
   case 'originalAs191Area':{
    const factor=flat(/\(x-1\)\(x-3\)/)&&has(/(?:root|x\s*=\s*1.{0,15}3|x\s*=\s*3.{0,15}1)/);
    const primitive=flat(/x\^3\/3-2x\^2\+3x/);
    const first=has(/(?:from\s*x\s*=\s*0\s*to\s*1|0\s*to\s*1|0.{0,6}1).{0,75}4\/3/);
    const middle=has(/(?:from\s*x\s*=\s*1\s*to\s*3|1\s*to\s*3|1.{0,6}3).{0,90}-4\/3/)&&has(/(?:area\s+is|area\s+of|its\s+area|magnitude).{0,25}4\/3/);
    const last=has(/(?:from\s*x\s*=\s*3\s*to\s*4|3\s*to\s*4|3.{0,6}4).{0,80}4\/3/);
    const total=has(/\b(?:total|combined)\s+area\s*(?:=|is|of)\s*\+?4\b|\barea\s+total\s*(?:=|is)\s*\+?4\b/);
    marks=[factor,primitive,first,middle,last,total];
    break;
   }
  }
  return response(q,marks);
 }
 function response(q,marks){
  const flags=Array.from({length:q.markPoints?.length||0},(_,i)=>marks[i]===true);
  const suggested=flags.filter(Boolean).length;
  return {preds:flags,scores:flags.map(x=>x?1:0),suggested,
    finalCorrect:suggested===q.marks,confidence:suggested===q.marks?'high':'medium'};
 }
 root.RevisionPureMathsV191={evaluate};
})(typeof window!=='undefined'?window:globalThis);
