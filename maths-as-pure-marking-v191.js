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
    .replace(/[²]/g,'^2').replace(/[³]/g,'^3').replace(/×/g,'*').replace(/÷/g,'/');
  const compact=t.replace(/\s+/g,'');
  const has=(r)=>r.test(t),flat=(r)=>r.test(compact);
  let marks=[];
  switch(mode){
   case 'originalAs191Exhaust':{
    const all=has(/n\s*=\s*-3\s*,\s*-2\s*,\s*-1\s*,\s*0\s*,\s*1\s*,\s*2\s*,\s*3/);
    const neg=has(/(?:n\s*\^?\s*3\s*-\s*n\s*(?:equals?|=)\s*)?-24\s*,\s*-6\s*,\s*0/)&&has(/(?:n\s*=|-3\s*,\s*-2)|n\s*\^?\s*3/i);
    const pos=has(/(?:n\s*\^?\s*3\s*-\s*n\s*(?:equals?|=)\s*)?0\s*,\s*0\s*,\s*6\s*,\s*24/);
    const done=has(/(?:all|every|each|seven).{0,90}(?:divisible\s+by\s+6|multiples?\s+of\s+6)|(?:divisible\s+by\s+6|multiples?\s+of\s+6).{0,80}(?:all|every|each|case)/i);
    marks=[all,neg,pos,done&&neg&&pos];
    break;
   }
   case 'originalAs191Trig':{
    const identity=flat(/sin\^2theta=1-cos\^2theta|2\(1-cos\^2theta\)\+costheta-1=0/);
    const quadratic=flat(/2cos\^2theta-costheta-1=0/);
    const factor=flat(/\(2costheta\+1\)\(costheta-1\)=0|\(costheta-1\)\(2costheta\+1\)=0/);
    const values=flat(/costheta=1/)&&flat(/costheta=-1\/2|costheta=-0\.5/);
    const solutions=has(/(?:theta\s*=\s*)?0\s*°?\s*,\s*120\s*°?\s*,\s*240\s*°?/);
    marks=[identity,quadratic,factor,values,solutions];
    break;
   }
   case 'originalAs191Circle':{
    const square=flat(/\(x-3\)\^2\+\(y\+2\)\^2=25/);
    const centre=has(/(?:centre|center)\s*\(?\s*3\s*,\s*-2\s*\)?/)&&has(/(?:radius|r\s*=)\s*5\b/);
    const point=flat(/9\+16=25|3\^2\+4\^2=25/)&&has(/\b(?:lies|on|verified|satisfies|substitut)/);
    const gradient=flat(/4\/3/)&&flat(/-3\/4/);
    const tangent=flat(/3x\+4y-26=0|y-2=-3\(x-6\)\/4/);
    marks=[square,centre,point,gradient,tangent];
    break;
   }
   case 'originalAs191Transform':{
    const square=flat(/f\(x\)=\(x\+1\)\^2-4/);
    const right=has(/(?:right|positive\s+x).{0,22}\b3\b|\b3\b.{0,22}\bright\b/);
    const reflect=has(/reflect.{0,20}x[\s-]*axis|reflection.{0,20}x[\s-]*axis/);
    const stretch=has(/(?:vertical|y[\s-]*axis).{0,35}(?:stretch|scale)|(?:stretch|scale).{0,35}vertical/)&&has(/(?:factor|by)\s*2\b/);
    const up=has(/(?:up|upwards|positive\s+y).{0,20}\b1\b|\b1\b.{0,20}\bup\b/);
    const vertex=flat(/g\(x\)=-2\(x-2\)\^2\+9/)&&has(/(?:turning\s+point|vertex).{0,24}\(\s*2\s*,\s*9\s*\)/);
    const roots=flat(/x=2(?:\+\/-|±)3\/(?:sqrt\(2\)|√2)|x=2±3√2\/2|x=2±3\/√2/)||
      (has(/x\s*=\s*2\s*[-+]\s*3\s*\/\s*(?:√2|sqrt\(2\))/)&&has(/(?:and|,|±)/));
    marks=[square,right,reflect,stretch,up,vertex,roots];
    break;
   }
   case 'originalAs191Binomial':{
    const x2=flat(/80a\^2|10\*2\^3\*a\^2/);
    const two=flat(/a\^2=9/)&&flat(/a=±3|a=\+\/-3|a=\+-3|a=\+3.*a=-3/);
    const x3=flat(/40a\^3|10\*2\^2\*a\^3/);
    const plus=flat(/a=3/)&&has(/positiv|x\s*\^?\s*3.{0,36}coefficien|coefficient.{0,36}x\s*\^?\s*3/);
    const x4=flat(/(?:coefficient|x\^4).{0,40}810|10\*81=810|5\*2\*a\^4=10\*81=810/);
    marks=[x2,two,x3,plus,x4];
    break;
   }
   case 'originalAs191Area':{
    const factor=flat(/\(x-1\)\(x-3\)/)&&has(/(?:root|x\s*=\s*1.{0,15}3|x\s*=\s*3.{0,15}1)/);
    const primitive=flat(/x\^3\/3-2x\^2\+3x/);
    const first=has(/(?:from\s*x\s*=\s*0\s*to\s*1|0\s*to\s*1|0.{0,6}1).{0,75}4\/3/);
    const middle=has(/(?:from\s*x\s*=\s*1\s*to\s*3|1\s*to\s*3|1.{0,6}3).{0,90}-4\/3/)&&has(/(?:area\s+is|area\s+of|its\s+area|magnitude).{0,25}4\/3/);
    const last=has(/(?:from\s*x\s*=\s*3\s*to\s*4|3\s*to\s*4|3.{0,6}4).{0,80}4\/3/);
    const total=has(/(?:total\s+area|area\s+total|combined\s+area).{0,35}(?:=\s*)?4(?:\s+square\s+units?)?/);
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
