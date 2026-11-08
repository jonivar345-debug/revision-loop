'use strict';
// v410: replay the full first-school-mock routing, not a truncated subset
// of the original manual-review guards. Read-only: no score/progress writes.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=path=>fs.readFileSync(path,'utf8');
const json=path=>JSON.parse(read(path));
const app=read('app.js');
const deck=json('deck.json');
const original=json('exam_questions.json');
const corrections=json('exam_answer_corrections.json');
assert.equal(deck.cards.length,3345,'Stable original flashcard IDs changed');
assert.equal(original.questions.length,1268,'Stable original question IDs changed');
assert.equal(new Set(original.questions.map(q=>q.id)).size,1268);

const start=app.indexOf('const V372_YEAR1_PURE_MANUAL=');
const end=app.indexOf('const V287_LEGACY_SPEC_GROUPS=',start);
const selectorStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS=');
const selectorEnd=app.indexOf('function startMockSession(){',selectorStart);
assert(start>0&&end>start&&selectorStart>0&&selectorEnd>selectorStart);
const guardsSource=app.slice(start,end);
const names=[...guardsSource.matchAll(/function (applyV\d+[A-Za-z0-9_]+)\(questions\)/g)]
 .map(match=>match[1]);
for(const name of ['applyV402Original21ManualReview','applyV403Original82ManualReview']){
 assert(names.includes(name),'Missing later guard: '+name);
}
assert.equal(names.length,18,'The total manual-guard sequence changed; audit it before sign-off');
const runtime=new Function(guardsSource+'\n'+app.slice(selectorStart,selectorEnd)+
 '\nreturn {guards:['+names.join(',')+'],eligible:mockEligibleQuestion};')();

const questions=original.questions.map(q=>({...q,
 markPoints:[...(q.markPoints||[])],
 markPointMarks:[...(q.markPointMarks||[])]}));
for(const q of questions){
 if(Object.hasOwn(corrections.modelAnswers||{},q.id)){
  q.modelAnswer=corrections.modelAnswers[q.id];
 }
 const corrected=corrections.questionCorrections?.[q.id];
 if(corrected&&typeof corrected==='object'){
  for(const key of ['prompt','modelAnswer','markPoints','markPointMarks',
   'markingMode','markEvidenceRules','numericAnswer','tolerance']){
   if(Object.hasOwn(corrected,key))q[key]=corrected[key];
  }
 }
}
for(const guard of runtime.guards)guard(questions);

// Also replay the separately declared v405 semantic short-answer review.
const hash=value=>{
 let h=2166136261;
 const valueString=String(value||'');
 for(let i=0;i<valueString.length;i++){
  h^=valueString.charCodeAt(i);
  h=Math.imul(h,16777619);
 }
 return (h>>>0).toString(16);
};
const v405Start=app.indexOf('const V405_SHORT_SEMANTIC_MANUAL=');
const scorerStart=app.indexOf('function examSuggested(q,answer){');
assert(v405Start>0&&scorerStart>v405Start);
const shortGuard=new Function('mockEligibleQuestion','v403OriginalHash',
 app.slice(v405Start,scorerStart)+
 '\nreturn applyV405ShortSemanticManualReview;')(runtime.eligible,hash);
shortGuard(questions);

// Actual application initialisation must call these guards on the live bank,
// not merely contain their unused function declarations or source rows.
const initialise=app.lastIndexOf('applyV372Year1PureManualReview(examQuestions);');
const v402=app.lastIndexOf('applyV402Original21ManualReview(examQuestions);');
const v403=app.lastIndexOf('applyV403Original82ManualReview(examQuestions);');
const v405=app.lastIndexOf('applyV405ShortSemanticManualReview(examQuestions);');
assert(initialise>0&&v402>initialise&&v403>v402&&v405>v403,
 'Live initialisation skipped or reordered the later manual guards');
const liveRender=app.indexOf('deckMeta=d.meta',v405);
assert(liveRender>v405,'Manual guards must finish before displaying questions');

const eligible=questions.filter(q=>runtime.eligible(q)&&q.standalone===true&&q.taught!==false);
const multi=eligible.filter(q=>q.marks>=3);
const short=eligible.filter(q=>q.marks<=2);
const multiUngarded=multi.filter(q=>q.manualWorkingReview!==true&&q.manualDiagramReview!==true);
assert.equal(eligible.length,606,'Original first-mock selector changed; reconcile scope');
assert.equal(multi.length,208,'Original multi-mark inventory changed; reconcile before sign-off');
assert.equal(short.length,398,'Original short-answer inventory changed; reconcile before sign-off');
assert.equal(multiUngarded.length,0,'Multi-mark originals escaped manual review: '+
 multiUngarded.map(q=>q.id).join(', '));
assert.equal(multi.reduce((n,q)=>n+q.marks,0),854);
assert.equal(multi.filter(q=>q.v403ReviewRequired===true).length,82,
 'v403 must protect the remaining 82 cases');
assert.equal(multi.filter(q=>q.v403SourceMismatch===true).length,0,
 'Source drift in v403 protected originals');
assert.equal(short.filter(q=>q.manualWorkingReview===true||q.manualDiagramReview===true).length,11,
 'Review existing short-answer manual protections');

const earlyEnd=app.indexOf(' // v213:',scorerStart);
assert(earlyEnd>scorerStart,'Could not isolate the real automatic marking entry');
const suggest=new Function('window',app.slice(scorerStart,earlyEnd)+
 '\n}\nreturn examSuggested;')({});
let probes=0;
for(const q of multi){
 for(const answer of ['',q.modelAnswer,q.prompt,
  'The model answer is incorrect. '+q.modelAnswer]){
  const result=suggest(q,answer);
  assert(result&&result.manualRequired===true,
   'Long original reached generic scorer: '+q.id);
  assert.equal(result.suggested,0,'Unexpected suggested mark for '+q.id);
  assert.equal(result.finalCorrect,false);
  assert.deepEqual(result.preds,Array(q.markPoints.length).fill(false));
  probes++;
 }
}

// The *UI* must route guarded answers to an unticked manual scoring screen.
const markAction=app.indexOf("document.getElementById('markExam').onclick=async()=>{");
const manualScreen=app.indexOf('function beginManualExamReview(q){',markAction);
assert(markAction>0&&manualScreen>markAction);
const clickHandler=app.slice(markAction,manualScreen);
assert(clickHandler.includes('if(q.manualDiagramReview===true||q.manualWorkingReview===true){beginManualExamReview(q);return;}'),
 'Mark button bypasses source-guarded manual path');
const manualBody=app.slice(manualScreen,app.indexOf('function renderScoreEditor(',manualScreen));
assert(manualBody.includes('currentExamScore=0')&&
 manualBody.includes("currentExamMarkingRoute='manual'")&&
 manualBody.includes('No boxes start ticked.'),
 'Manual review must start with zero suggested ticks');
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'",
 "PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"]){
 assert(app.includes(key),'Saved progress/XP/cloud key changed: '+key);
}
console.log('PASS v410: '+eligible.length+' original first-school-mock questions; '+
 multi.length+' multi-mark originals / 854 marks all manually routed; '+
 multi.filter(q=>q.v403ReviewRequired===true).length+
 ' protected by v403, with '+probes+' model/denial/echo/blank zero-mark probes. '+
 short.length+' short items remain separately reviewable ('+
 short.filter(q=>q.manualWorkingReview===true||q.manualDiagramReview===true).length+
 ' manually guarded); live UI starts manual score at zero; saved IDs unchanged.');
