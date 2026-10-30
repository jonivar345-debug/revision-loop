/* v210: conservative evidence marking for five original Chemistry mock data questions.
   These scores are suggestions, not a replacement for examiner or student review. */
(function(root){
 'use strict';
 function norm(input){
  return String(input||'').toLowerCase().replace(/[−–—]/g,'-')
   .replace(/⁻/g,'-').replace(/⁰/g,'0').replace(/¹/g,'1').replace(/²/g,'2')
   .replace(/³/g,'3').replace(/⁴/g,'4').replace(/⁶/g,'6')
   .replace(/[ₐ]/g,'a').replace(/×/g,'*').replace(/\s+/g,' ').trim();
 }
 const tidy=s=>norm(s).replace(/\s+/g,'');
 function score(q,ans){
  const flags=Array.from({length:q.markPoints?.length||0},(_,i)=>ans.has(i));
  const suggested=flags.filter(Boolean).length;
  return {preds:flags,scores:flags.map(x=>x?1:0),suggested,
   finalCorrect:suggested===q.marks,confidence:suggested===q.marks?'high':'low'};
 }
 function evaluate(q,answer){
  const id=String(q&&q.id||'');
  if(!/^task1_v210_chem_0[1-5]$/.test(id))return null;
  const raw=String(answer||'').trim(),t=norm(raw),c=tidy(raw);
  const earned=new Set();
  if(!raw||/^(?:idk|no idea|not sure|i don't know|unsure)[.!]?$/i.test(raw))return score(q,earned);
  if(t===norm(q.modelAnswer))return score(q,new Set(q.markPoints.map((_,i)=>i)));
  const claims=raw.split(/(?:[;\n]+|[.!?]\s+(?=[A-Za-z]))/).map(x=>norm(x)).filter(Boolean);
  const repudiated=x=>/^\s*(?:not|never|incorrect|wrong)\b|\b(?:is|are|was|were)\s+(?:wrong|incorrect|false|not\s+correct)\b|\b(?:isn't|is\s+not)\s+(?:true|valid|correct)\b/.test(x);
  const validClaims=claims.filter(x=>!repudiated(x));
  const find=(re)=>validClaims.some(x=>re.test(x));
  const flat=(re)=>validClaims.some(x=>re.test(tidy(x)));
  // Whole reviewed mark-point sentences are allowed as independent evidence;
  // fragments and shared numbers are never sufficient by themselves.
  for(let i=0;i<(q.markPoints||[]).length;i++){
   const expected=norm(q.markPoints[i]).replace(/[.!?]+$/,'');
   if(validClaims.some(x=>x===expected||x.includes(expected)))earned.add(i);
  }
  const put=(i,yes)=>{if(yes)earned.add(i)};
  switch(id){
   case 'task1_v210_chem_01':{
    put(0,find(/(?:second\s*order|order\s*(?:of\s*)?2).{0,45}\ba\b|\ba\b.{0,45}(?:second\s*order|order\s*(?:of\s*)?2)|doubl.{0,65}quadrupl/));
    put(1,find(/(?:first\s*order|order\s*(?:of\s*)?1).{0,45}\bb\b|\bb\b.{0,45}(?:first\s*order|order\s*(?:of\s*)?1)|doubl.{0,65}(?:rate\s*doubl|rate\s*x\s*2)/));
    put(2,flat(/rate=k\[a\](?:\^?2)\[b\]/));
    put(3,find(/overall\s+(?:reaction\s+)?order\s*(?:is|=|of)?\s*(?:3|three|third)/));
    put(4,flat(/k=\(?2(?:\.00)?\*(?:10\^-4|10\*\*-4|e-4)\)?\/\(?(?:0\.100|0\.10)\^?2\*0\.200/));
    put(5,find(/\bk\s*=\s*(?:0\.100|0\.1)(?!\d)/));
    put(6,find(/dm\s*(?:\^?6|6)\s*mol\s*(?:\^-?2|-2)\s*s\s*(?:\^-?1|-1)/));
    put(7,flat(/0\.1(?:00)?\*0\.3(?:00)?\^?2\*0\.1(?:00)?/));
    put(8,find(/(?:predicted\s+(?:initial\s+)?rate\s*(?:is|=)?\s*|rate\s*=\s*)(?:9(?:\.00)?\s*[*×]\s*10\s*\^\s*-4|9(?:\.00)?e-4|0\.0009(?:00)?)(?!\d)/));
    break;
   }
   case 'task1_v210_chem_02':{
    put(0,find(/concentration[^.;]{0,55}\bdecreas|concentration[^.;]{0,55}\bfalls/));
    put(1,find(/gradient[^.;]{0,75}\bnegative\b|negative[^.;]{0,45}\bgradient\b/));
    put(2,flat(/0\.081-0\.099=-0\.018/));
    put(3,flat(/50-30=20s?/));
    put(4,find(/(?:gradient|slope)[^.;]{0,35}(?:-9(?:\.00)?\s*\*\s*10\^-4|-9(?:\.00)?e-4|-0\.0009(?:00)?)(?!\d)/));
    put(5,find(/(?:rate\s+of\s+(?:disappearance|reaction)|instantaneous\s+rate)[^.;]{0,45}(?:\+?9(?:\.00)?\s*\*\s*10\^-4|\+?9(?:\.00)?e-4|\+?0\.0009(?:00)?)(?!\d)/));
    put(6,find(/(?:average\s+rate)[^.;]{0,55}(?:9\.5(?:0)?\s*\*\s*10\^-4|9\.5(?:0)?e-4|0\.00095(?:0)?)(?!\d)/)&&
      !find(/average\s+rate[^.;]{0,50}(?:=|is)\s*-\s*(?:9\.5|0\.00095)/));
    put(7,find(/\btangent\b[^.;]{0,100}\binstantaneous\b[^.;]{0,100}\baverage\b|\binstantaneous\b[^.;]{0,100}\btangent\b[^.;]{0,100}\baverage\b/));
    break;
   }
   case 'task1_v210_chem_03':{
    put(0,find(/\b(?:dataset\s+)?x\b\s*(?:is|shows|has|:)?\s*zero[\s-]*order\b|\bzero[\s-]*order\s+(?:for|in|of)\s+(?:dataset\s+)?x\b/));
    put(1,find(/(?:\bk\s*=\s*|rate[^.;]{0,15})(?:1(?:\.00)?\s*\*\s*10\^-3|1(?:\.00)?e-3|0\.001(?:00)?)(?!\d)/));
    put(2,find(/mol\s+dm\s*(?:\^-?3|-3)\s*s\s*(?:\^-?1|-1)/));
    put(3,find(/\b(?:dataset\s+)?y\b\s*(?:is|shows|has|:)?\s*first[\s-]*order\b|\bfirst[\s-]*order\s+(?:for|in|of)\s+(?:dataset\s+)?y\b/));
    put(4,find(/(?:half[\s-]*life|t\s*(?:1\/2|½))[^.;]{0,30}\b20\s*s\b/));
    put(5,find(/\bk\s*=\s*(?:0\.0347|3\.47\s*\*\s*10\^-2|3\.47e-2)(?!\d)/));
    put(6,find(/\bk\b[^.;]{0,40}\bs\s*(?:\^-?1|-1)\b|\bunits\s+(?:are|of)\s+s\s*(?:\^-?1|-1)\b/));
    put(7,find(/\b(?:x|dataset x)\b[^.;]{0,110}\b(?:constant|unchanged)\b[^.;]{0,130}\b(?:y|dataset y)\b[^.;]{0,110}\b(?:decreas|fall|slows)/));
    break;
   }
   case 'task1_v210_chem_04':{
    put(0,find(/(?:gradient|slope)\s*(?:is|=)?\s*-\s*e\s*a\s*\/\s*r|(?:gradient|slope)\s*(?:is|=)?\s*-ea\/r/));
    put(1,find(/(?:74,?790|74790)\s*j\s*mol|(?:9(?:\.00)?\s*\*\s*10\^3|9000)\s*\*\s*8\.31/));
    put(2,find(/(?:e\s*a|activation\s+energy)[^.;]{0,35}\b74\.8\s*kj\s*mol/));
    put(3,find(/(?:intercept|ln\s*a)\s*(?:is|=)?\s*(?:ln\s*a\s*=\s*)?25(?:\.0)?\b|(?:intercept)\s*(?:is|=)\s*ln\s*a/));
    put(4,find(/(?:arrhenius\s+constant|prefactor|\ba\s*=)[^.;]{0,55}(?:7\.2(?:0)?\s*\*\s*10\^10|7\.2(?:0)?e10|72000000000)(?!\d)/));
    put(5,find(/ln\s*k[^.;]{0,80}(?:=|is)\s*-5(?:\.0+)?(?:\b|$)/));
    put(6,find(/(?:\bk\b|rate\s+constant)[^.;]{0,40}(?:6\.74\s*\*\s*10\^-3|6\.74e-3|0\.00674)(?!\d)/));
    put(7,find(/(?:increas(?:ing|ed)?|higher)\s+temperature[^.;]{0,130}\b(?:k|rate\s+constant)\b[^.;]{0,65}\bincreas|\bk\b[^.;]{0,80}\bincreas[^.;]{0,95}\btemperature\b/));
    break;
   }
   case 'task1_v210_chem_05':{
    put(0,find(/n\s*\(?n2o4\)?\s*=\s*0\.600\b|(?:n2o4|reactant)[^.;]{0,35}\b0\.600\s*mol/));
    put(1,find(/n\s*\(?no2\)?\s*=\s*0\.800\b|(?:no2|product)[^.;]{0,35}\b0\.800\s*mol/));
    put(2,find(/(?:total|sum)[^.;]{0,45}\b1\.40\s*mol\b/));
    put(3,find(/(?:mole\s+fractions?)[^.;]{0,110}(?:0\.600\s*\/\s*1\.40|0\.6\s*\/\s*1\.4)[^.;]{0,80}(?:0\.800\s*\/\s*1\.40|0\.8\s*\/\s*1\.4)/));
    put(4,find(/(?:partial\s+pressure|pressure)[^.;]{0,55}\bn2o4\b[^.;]{0,45}\b60(?:\.0)?\s*kpa\b|\bn2o4\b[^.;]{0,55}\b60(?:\.0)?\s*kpa\b/));
    put(5,find(/(?:partial\s+pressure|pressure)[^.;]{0,55}\bno2\b[^.;]{0,45}\b80(?:\.0)?\s*kpa\b|\bno2\b[^.;]{0,55}\b80(?:\.0)?\s*kpa\b/));
    put(6,flat(/kp=p\(no2\)\^?2\/p\(n2o4\)|kp=pno2\^?2\/pn2o4/));
    put(7,find(/(?:\bkp\b)[^.;]{0,50}(?:107|106\.7|106\.67)\s*kpa\b/));
    put(8,find(/(?:increas(?:ing|ed)?\s+(?:total\s+)?pressure)[^.;]{0,95}(?:n2o4|left|fewer)[^.;]{0,130}\b(?:kp|unchanged|constant)\b|(?:\bkp\b[^.;]{0,50}\bunchanged\b)[^.;]{0,130}\bpressure\b/));
    break;
   }
  }
  return score(q,earned);
 }
 root.RevisionChemRatesV210={evaluate};
})(typeof window!=='undefined'?window:globalThis);
