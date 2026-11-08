'use strict';
// Read-only audit of all 398 original first-school-mock 1–2 mark exam parts.
// It uses the real automatic scorer and every source-locked runtime guard.
// This is distinct from 208 original + 292 supplementary multi-mark items,
// already routed to manual review by the pending combined v418 release.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),bank=json('exam_questions.json'),deck=json('deck.json'),
 corrections=json('exam_answer_corrections.json');
assert.equal(bank.questions.length,1268);
assert.equal(deck.cards.length,3345);
const gs=app.indexOf('const V372_YEAR1_PURE_MANUAL=');
const ge=app.indexOf('const V287_LEGACY_SPEC_GROUPS=',gs);
const ss=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS=');
const se=app.indexOf('function startMockSession(){',ss);
assert(gs>0&&ge>gs&&ss>0&&se>ss);
const guarded=app.slice(gs,ge);
const guardNames=[...guarded.matchAll(/function (applyV\d+[A-Za-z0-9_]+)\(questions\)/g)]
 .map(m=>m[1]);
assert.equal(guardNames.length,18);
const runtime=new Function(guarded+'\n'+app.slice(ss,se)+
 '\nreturn {guards:['+guardNames.join(',')+'],eligible:mockEligibleQuestion};')();
const original=bank.questions.map(q=>({...q,markPoints:[...(q.markPoints||[])],
 markPointMarks:[...(q.markPointMarks||[])]}));
for(const q of original){
 if(Object.hasOwn(corrections.modelAnswers||{},q.id))
  q.modelAnswer=corrections.modelAnswers[q.id];
 const x=corrections.questionCorrections?.[q.id];
 if(x&&typeof x==='object')
  for(const k of ['prompt','modelAnswer','markPoints','markPointMarks',
  'markingMode','markEvidenceRules','numericAnswer','tolerance'])
   if(Object.hasOwn(x,k))q[k]=x[k];
}
for(const fn of runtime.guards)fn(original);
const hash=value=>{
 let h=2166136261,s=String(value||'');
 for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
 return(h>>>0).toString(16);
};
const v405=app.indexOf('const V405_SHORT_SEMANTIC_MANUAL=');
const es=app.indexOf('function examSuggested(q,answer){');
const ee=app.indexOf('function examGraphDiagram(',es);
const shortGuard=new Function('mockEligibleQuestion','v403OriginalHash',
 app.slice(v405,es)+'\nreturn applyV405ShortSemanticManualReview;')(runtime.eligible,hash);
shortGuard(original);
const pool=original.filter(q=>q.standalone===true&&q.taught!==false&&runtime.eligible(q));
assert.equal(pool.length,606);
const short=pool.filter(q=>q.marks>0&&q.marks<=2);
const multi=pool.filter(q=>q.marks>=3);
assert.equal(short.length,398);
assert.equal(multi.length,208);
assert.equal(short.filter(q=>q.manualWorkingReview||q.manualDiagramReview).length,11);
const helperNames=['clamp','normalise','tokens','compact','contradicts','importantTokens',
 'markPointPrediction','parseNumber','numericMatch','formulaScore','phraseScore',
 'evidenceRuleScore','totalMarkingPoints','acceptedMarkPointAlternative',
 'singleClaimEvidenceCap','reviewedShortAnswerFlags','hasMeaning','synonymSet',
 'stemToken','close','oppositeDirectionWords','lev'];
const functions=[...app.matchAll(/^function ([\w]+)\(/gm)].map(m=>({name:m[1],at:m.index}));
const get=name=>{
 const f=functions.find(x=>x.name===name);
 assert(f,'Missing real evaluator helper '+name);
 return app.slice(f.at,functions.find(x=>x.at>f.at)?.at||app.length);
};
assert(es>0&&ee>es);
const score=new Function('window',helperNames.map(get).join('\n')+
 '\n'+app.slice(es,ee)+'\nreturn examSuggested;')({});
const results={
 total:short.length,realShortProbes:0,manualShort:0,autoShort:0,
 bySubject:Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,{
  total:0,manual:0,auto:0,modelFull:0,wrongFull:0,modelUnder:0,examScorerErrors:0
 }])),
 modelUnder:[],questionEchoFull:[],blankFull:[],idkFull:[],
 modelDenialFull:[],pointDenialFull:[],wrongSignedNumericFull:[],
 manualNotZero:[],evaluatorErrors:[],
 allExamQuestionIDsStillUnique:new Set(original.map(q=>q.id)).size===1268,
 limitations:[
 'This tests original 1–2 mark question parts, not entire unobserved handwritten responses.',
 'Question-echo false positives need actual question text reviewed: an exam question can legitimately include phrases from the answer.',
 'A full-credit denial is a concrete false positive only when the reply truly rejects a correct model point; records need independent verification.',
 'Negative numerical controls are only probed for bare signed numeric source answers; some physical quantities allow negative values.',
 'All probe results are risk leads rather than proof every live question is correctly assessed.'
 ]
};
const add=(kind,q,input,result)=>results[kind].push({id:q.id,subject:q.subject,
 marks:q.marks,mode:q.markingMode,answerType:q.answerType,
 input:String(input).slice(0,270),model:String(q.modelAnswer||'').slice(0,270),
 suggested:result.suggested,
 manualRequired:result.manualRequired===true});
const run=(q,input,kind)=>{
 results.realShortProbes++;
 try{
  const result=score(q,input);
  if(!result||!Number.isFinite(result.suggested))throw Error('Bad scorer result');
  if(kind==='model'){
   if(result.suggested===q.marks)results.bySubject[q.subject].modelFull++;
   else{results.bySubject[q.subject].modelUnder++;add('modelUnder',q,input,result);}
  }else if(kind==='manual'){
   if(result.suggested!==0||result.manualRequired!==true)
    add('manualNotZero',q,input,result);
  }else if(result.suggested===q.marks){
   if(kind==='blank')add('blankFull',q,input,result);
   else if(kind==='idk')add('idkFull',q,input,result);
   else if(kind==='echo')add('questionEchoFull',q,input,result);
   else if(kind==='denial')add('modelDenialFull',q,input,result);
   else if(kind==='pointDenial')add('pointDenialFull',q,input,result);
   else if(kind==='wrongSign')add('wrongSignedNumericFull',q,input,result);
  }
 }catch(e){
  results.bySubject[q.subject].examScorerErrors++;
  results.evaluatorErrors.push({id:q.id,subject:q.subject,kind,error:String(e).slice(0,170)});
 }
};
for(const q of short){
 results.bySubject[q.subject].total++;
 if(q.manualWorkingReview===true||q.manualDiagramReview===true){
  results.manualShort++;
  results.bySubject[q.subject].manual++;
  for(const input of ['',q.modelAnswer,q.prompt,
   'The model answer is incorrect. '+q.modelAnswer])run(q,input,'manual');
  continue;
 }
 results.autoShort++;
 results.bySubject[q.subject].auto++;
 run(q,q.modelAnswer,'model');
 run(q,'','blank');
 run(q,'I do not know','idk');
 run(q,q.prompt,'echo');
 if(q.modelAnswer)for(const verdict of ['wrong','false','incorrect','untrue'])
  run(q,'The statement "'+q.modelAnswer+'" is '+verdict+'.','denial');
 if(q.markPoints?.length)
  run(q,'The statement "'+q.markPoints[0]+'" is wrong.','pointDenial');
 const m=String(q.modelAnswer||'').trim().replace(/[−–]/g,'-')
  .match(/^\+?(\d+(?:\.\d+)?)(\s*[\w°%^\-]*)?\.?$/);
 if(m&&Number(m[1])>0)
  run(q,'-'+m[1]+(m[2]||''),'wrongSign');
}
assert.equal(results.autoShort,387);
assert.equal(results.manualShort,11);
assert.equal(results.blankFull.length,0,'A blank first-mock short answer got full credit');
assert.equal(results.idkFull.length,0,'IDK first-mock short answer got full credit');
assert.equal(results.manualNotZero.length,0,'Manual short answer got nonzero automatic marks');
assert.equal(results.modelDenialFull.length,0,'A fully quoted correct model was explicitly denied yet credited');
assert.equal(results.pointDenialFull.length,0,'An explicitly denied mark point got full marks');
assert.equal(Object.values(results.bySubject).reduce((sum,v)=>sum+v.modelFull,0),387,'Correct source model undergraded');
const count=Object.fromEntries(['modelUnder','questionEchoFull','blankFull','idkFull',
 'modelDenialFull','pointDenialFull','wrongSignedNumericFull','manualNotZero','evaluatorErrors']
 .map(k=>[k,results[k].length]));
const report={
 run:'v423',readOnly:true,
 originalShortParts:results.total,automaticShortParts:results.autoShort,
 manualShortParts:results.manualShort,
 probes:results.realShortProbes,bySubject:results.bySubject,
 counts:count,
 examples:Object.fromEntries(Object.keys(count).map(k=>[k,results[k].slice(0,65)])),
 limitations:results.limitations
};
console.log('PASS v423 original short exam bank scorer source integrity; full-credit risk findings below need targeted review.');
console.log('V423_SHORT_EXAM_REPORT_START');
console.log(JSON.stringify(report,null,2));
console.log('V423_SHORT_EXAM_REPORT_END');
