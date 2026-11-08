'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),bank=json('exam_questions.json'),
 corrections=json('exam_answer_corrections.json'),deck=json('deck.json');
assert.equal(bank.questions.length,1268);
assert.equal(deck.cards.length,3345);
assert(sw.includes('-v406-markpoint-denials'));
const hash=v=>{
 let h=2166136261,s=String(v||'');
 for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
 return(h>>>0).toString(16);
};
const gs=app.indexOf('const V372_YEAR1_PURE_MANUAL='),ge=app.indexOf('const V287_LEGACY_SPEC_GROUPS=',gs);
const ms=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),me=app.indexOf('function startMockSession(){',ms);
assert(gs>0&&ge>gs&&ms>0&&me>ms);
const old=app.slice(gs,ge),names=[...old.matchAll(/function (applyV\d+[A-Za-z0-9_]+)\(questions\)/g)].map(m=>m[1]);
assert.equal(names.length,18);
const previous=new Function(old+'\n'+app.slice(ms,me)+
 '\nreturn {guards:['+names.join(',')+'],eligible:mockEligibleQuestion};')();
const originals=bank.questions.map(q=>({...q,markPoints:[...(q.markPoints||[])],markPointMarks:[...(q.markPointMarks||[])]}));
for(const q of originals){
 if(Object.hasOwn(corrections.modelAnswers||{},q.id))
  q.modelAnswer=corrections.modelAnswers[q.id];
 const corrected=corrections.questionCorrections?.[q.id];
 if(corrected&&typeof corrected==='object')for(const key of [
  'prompt','modelAnswer','markPoints','markPointMarks','markingMode',
  'markEvidenceRules','numericAnswer','tolerance'
 ])if(Object.hasOwn(corrected,key))q[key]=corrected[key];
}
for(const guard of previous.guards)guard(originals);
const beforeV405=originals.filter(q=>previous.eligible(q)&&q.standalone===true&&q.taught!==false&&q.marks<=2);
assert.equal(beforeV405.length,398);
assert.equal(beforeV405.filter(q=>q.answerType==='numeric').length,279);
const conceptual=beforeV405.filter(q=>q.answerType==='points');
assert.equal(conceptual.length,119);
const es=app.indexOf('function examSuggested(q,answer){'),
 marker=app.indexOf(' // v406: Reject an answer',es),
 endGuard=app.indexOf(' // v213:',marker),
 ee=app.indexOf('function examGraphDiagram(',es);
assert(es>0&&marker>es&&endGuard>marker&&ee>endGuard);
const helperNames=['clamp','normalise','tokens','compact','contradicts','importantTokens',
 'markPointPrediction','parseNumber','numericMatch','formulaScore','phraseScore',
 'evidenceRuleScore','totalMarkingPoints','acceptedMarkPointAlternative',
 'singleClaimEvidenceCap','reviewedShortAnswerFlags','hasMeaning','synonymSet',
 'stemToken','close','oppositeDirectionWords','lev'];
const functions=[...app.matchAll(/^function ([\w]+)\(/gm)].map(m=>({name:m[1],offset:m.index}));
const source=name=>{
 const item=functions.find(x=>x.name===name);
 assert(item,'Missing scorer helper '+name);
 return app.slice(item.offset,functions.find(x=>x.offset>item.offset)?.offset||app.length);
};
const helpers=helperNames.map(source).join('\n');
const beforeScorer=new Function('window',helpers+'\n'+
 app.slice(es,marker)+app.slice(endGuard,ee)+'\nreturn examSuggested;')({});
let falsePositive=0,quotedPositive=0,falseFull=0,quotedFull=0,baseProbes=0;
for(const q of conceptual)for(const point of q.markPoints||[]){
 if(!point||String(point).length<9)continue;
 const a=beforeScorer(q,'This statement is false: '+point);
 const b=beforeScorer(q,'The statement "'+point+'" is incorrect.');
 if(a.suggested>0)falsePositive++;
 if(b.suggested>0)quotedPositive++;
 if(a.suggested===q.marks)falseFull++;
 if(b.suggested===q.marks)quotedFull++;
 baseProbes++;
}
assert.equal(baseProbes,212);
assert.equal(falsePositive,211);
assert.equal(quotedPositive,211);
assert.equal(falseFull,61);
assert.equal(quotedFull,61);
const v405s=app.indexOf('const V405_SHORT_SEMANTIC_MANUAL='),v405e=app.indexOf('function examSuggested(q,answer){',v405s);
assert(v405s>0&&v405e>v405s);
const applyV405=new Function('mockEligibleQuestion','v403OriginalHash',app.slice(v405s,v405e)+
 '\nreturn applyV405ShortSemanticManualReview;')(previous.eligible,hash);
const cloned=structuredClone(originals);
applyV405(cloned);
const short=cloned.filter(q=>previous.eligible(q)&&q.standalone===true&&q.taught!==false&&q.marks<=2);
assert.equal(short.length,398);
assert.equal(short.reduce((n,q)=>n+q.marks,0),766);
assert.equal(short.reduce((n,q)=>n+(q.markPoints||[]).length,0),766);
assert.equal(short.filter(q=>q.manualWorkingReview===true||q.manualDiagramReview===true).length,11);
const suggestion=new Function('window',app.slice(es,endGuard)+'\n}\nreturn examSuggested;')({});
let denied=0,manual=0,validModels=0,contrasts=0,alts=0;
for(const q of short){
 const hasManual=q.manualWorkingReview===true||q.manualDiagramReview===true;
 for(const point of q.markPoints||[]){
  for(const answer of ['This statement is false: '+point,
    'The statement "'+point+'" is incorrect.']){
   const result=suggestion(q,answer);
   assert(result,'Missing early reject for '+q.id);
   assert.equal(result.suggested,0,'Denied mark point suggested credit '+q.id);
   assert.equal(result.finalCorrect,false);
   assert.deepEqual(result.preds,Array(q.markPoints.length).fill(false));
   if(hasManual){
    assert.equal(result.manualRequired,true);
    manual++;
   }else assert(result.v406RejectedPointDenial===true||result.v425QuotedModelDenial===true,'Not rejected '+q.id);
   denied++;
  }
 }
 const valid=suggestion(q,q.modelAnswer);
 if(hasManual)assert(valid&&valid.manualRequired===true);
 else{
  assert.equal(valid,undefined,'Model answer incorrectly rejected '+q.id);
  validModels++;
 }
 for(const answer of [
  'The statement "an unrelated incorrect claim" is false.',
  'This statement is false: unrelated claim; '+q.modelAnswer
 ]){
  const result=suggestion(q,answer);
  if(hasManual)assert(result&&result.manualRequired===true);
  else assert.equal(result,undefined,'Longer contrast incorrectly rejected '+q.id);
  contrasts++;
 }
 const alternatives=(q.markPointAcceptedAlternatives||[]).flatMap(x=>Array.isArray(x)?x:[]);
 for(const alt of alternatives.slice(0,2)){
  const response='This statement is false: '+alt;
  const result=suggestion(q,response);
  assert(result&&result.suggested===0);
  if(!hasManual)assert(result.v406RejectedPointDenial===true||result.v425QuotedModelDenial===true,'Explicit denied source answer must be rejected');
  alts++;
 }
}
assert.equal(denied,1532);
assert.equal(validModels,387);
assert.equal(contrasts,796);
const unchangedKeys=["PROGRESS_KEY='revisionLoopProgress5'",
 "PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"];
for(const k of unchangedKeys)assert(app.includes(k));
assert(app.includes('applyV405ShortSemanticManualReview(examQuestions);'));
assert(app.includes('applyV403Original82ManualReview(examQuestions);'));
console.log('PASS v406: baseline 211/212 explicit false-markpoint statements and 211/212 quoted denials were wrongly credited; now 1532/1532 first-mock short mark-point denials score zero; '+
 validModels+' model answers, '+contrasts+' legitimate contrast paths unaffected; '+alts+
 ' alternative denials tested, existing 11 manual short routes retained.');
