'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),deck=json('deck.json'),
 bank=json('exam_questions.json'),corrections=json('exam_answer_corrections.json');
assert(sw.includes('-v404-exam-nonanswer'),'Service worker must refresh the release');
assert.equal(deck.cards.length,3345,'Keep stable core flashcard IDs');
assert.equal(bank.questions.length,1268,'Keep stable original exam IDs');
assert.equal(new Set(bank.questions.map(x=>x.id)).size,1268);
const start=app.indexOf('const V372_YEAR1_PURE_MANUAL=');
const end=app.indexOf('const V287_LEGACY_SPEC_GROUPS=',start);
const ms=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS=');
const me=app.indexOf('function startMockSession(){',ms);
assert(start>=0&&end>start&&ms>start&&me>ms);
const guardBlock=app.slice(start,end);
const names=[...guardBlock.matchAll(/function (applyV\d+[A-Za-z0-9_]+)\(questions\)/g)].map(m=>m[1]);
assert.equal(names.length,18,'Keep all prior v372–v403 manual guards');
const replay=new Function(guardBlock+'\n'+app.slice(ms,me)+
 '\nreturn {guards:['+names.join(',')+'],eligible:mockEligibleQuestion};')();
const es=app.indexOf('function examSuggested(q,answer){');
const ef=app.indexOf(' // v213:',es);
assert(es>0&&ef>es);
const prefix=app.slice(es,ef);
assert(prefix.includes('v404RejectedNonAnswer'));
const suggestion=new Function('window',prefix+'\n}\nreturn examSuggested;')({});
const originals=bank.questions.map(q=>({...q,
 markPoints:[...(q.markPoints||[])],markPointMarks:[...(q.markPointMarks||[])]}));
for(const q of originals){
 if(Object.hasOwn(corrections.modelAnswers||{},q.id))q.modelAnswer=corrections.modelAnswers[q.id];
 const corrected=corrections.questionCorrections?.[q.id];
 if(corrected&&typeof corrected==='object')for(const key of [
  'prompt','modelAnswer','markPoints','markPointMarks','markingMode',
  'markEvidenceRules','numericAnswer','tolerance']){
  if(Object.hasOwn(corrected,key))q[key]=corrected[key];
 }
}
for(const apply of replay.guards)apply(originals);
const mock=originals.filter(q=>replay.eligible(q)&&q.standalone===true&&q.taught!==false);
const short=mock.filter(q=>q.marks<=2);
const multi=mock.filter(q=>q.marks>=3);
assert.equal(mock.length,606);
assert.equal(short.length,398);
assert.equal(short.reduce((n,q)=>n+q.marks,0),766);
assert.equal(multi.length,208);
assert.equal(multi.filter(q=>q.manualWorkingReview===true||q.manualDiagramReview===true).length,208);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(subject=>[
 subject,short.filter(q=>q.subject===subject).length])),
 {Physics:171,Chemistry:142,Maths:85});
let wrongResponses=0,existingManualResponses=0,correctModelsUnblocked=0,validContrasts=0;
for(const q of originals){
 assert(q.prompt&&q.modelAnswer,'Original source must contain question and answer '+q.id);
 const hasManual=q.manualWorkingReview===true||q.manualDiagramReview===true;
 for(const answer of [
  q.prompt,
  'The model answer is incorrect. '+q.modelAnswer,
  'The model answer is wrong: '+q.modelAnswer,
  'The correct answer is not '+q.modelAnswer,
  'The answer is not '+q.modelAnswer,
  'My answer is not '+q.modelAnswer,
  'not '+q.modelAnswer
 ]){
  const result=suggestion(q,answer);
  assert(result,'Missing negative-response guard '+q.id);
  assert.equal(result.suggested,0,'Wrong answer earned suggested credit '+q.id);
  assert.equal(result.finalCorrect,false);
  assert.deepEqual(result.preds,Array(q.markPoints.length).fill(false));
  if(hasManual){
   assert.equal(result.manualRequired,true,'Older manual route was lost '+q.id);
   existingManualResponses++;
  }else assert.equal(result.v404RejectedNonAnswer,true,'New guard missed '+q.id);
  wrongResponses++;
 }
 const valid=suggestion(q,q.modelAnswer);
 if(hasManual){
  assert(valid&&valid.manualRequired===true&&valid.suggested===0,'Manual review was bypassed '+q.id);
 }else{
  assert.equal(valid,undefined,'Valid model answer rejected early '+q.id);
  correctModelsUnblocked++;
 }
 // Do not mistake a correction of an incorrect proposed answer for a denial
 // of the *complete* official model: the genuine response continues to the
 // existing scorer for further checking.
 if(!hasManual){
  assert.equal(suggestion(q,'The answer is not an unrelated claim; '+q.modelAnswer),
   undefined,'Valid contrast blocked '+q.id);
  validContrasts++;
 }
}
assert.equal(wrongResponses,8876);
const synthetic={
 id:'v404_synthetic',marks:2,subject:'Chemistry',prompt:'State the colour observed.',
 modelAnswer:'blue',markPoints:['Blue colour observed','A blue precipitate is seen'],
 markPointMarks:[1,1]
};
assert.equal(suggestion(synthetic,'state the colour observed.').suggested,0);
assert.equal(suggestion(synthetic,'The model answer is incorrect: blue').suggested,0);
assert.equal(suggestion(synthetic,'The answer is not red; it is blue'),undefined);
assert.equal(suggestion(synthetic,'blue'),undefined);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'",
 "PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v404: 1,268 corrected original questions, 8,876 exact non-answer probes all zero, '+
 correctModelsUnblocked+' model answers allowed through and '+validContrasts+
 ' valid contrasts not blocked; real mock has 606 eligible original parts, '+
 short.length+' short parts (766 marks), 208 multi-mark manual routes; saved keys retained.');
