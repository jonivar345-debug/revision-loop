'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),deck=json('deck.json'),exam=json('exam_questions.json'),corrections=json('exam_answer_corrections.json');
const audit=json('editorial/task1-v398-chemistry-24-working-qa.json');
assert.equal(deck.cards.length,3345);
assert.equal(new Set(deck.cards.map(c=>c.id)).size,3345);
assert.equal(exam.questions.length,1268);
assert.equal(new Set(exam.questions.map(q=>q.id)).size,1268);
assert.equal(audit.rows.length,24);
assert.equal(audit.counts.protectedMarks,114);
assert(sw.includes('-v398-chemistry114-working'));
assert(app.includes('applyV398ChemistryOriginal24Manual(examQuestions);'));
const hash=s=>{let h=2166136261;const v=String(s||'');for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16)};
const start=app.indexOf('const V398_CHEMISTRY_ORIGINAL_24='),end=app.indexOf('// v396: 18 exact, already-existing AS Physics worked exam questions',start);
assert(start>=0&&end>start);
const {rows,apply}=new Function(app.slice(start,end)+'\nreturn {rows:V398_CHEMISTRY_ORIGINAL_24,apply:applyV398ChemistryOriginal24Manual};')();
assert.deepEqual(rows,audit.rows);
const originals=rows.map(row=>{
 const q=exam.questions.find(x=>x.id===row.id);assert(q,'Missing '+row.id);
 assert.equal(q.subject,'Chemistry');assert.equal(q.level,row.level);assert.equal(q.mock,true);assert.equal(q.standalone,true);
 assert.equal(q.requiresWorking,true);assert.notEqual(q.taught,false);
 assert.notEqual(q.manualWorkingReview,true);assert.notEqual(q.manualDiagramReview,true);
 assert.equal(q.topic,row.topic);assert.equal(q.courseTopic??null,row.courseTopic);assert.equal(q.specRef??null,row.specRef);
 assert.equal(q.questionType??null,row.questionType);assert.equal(q.marks,row.marks);
 assert.equal(q.markPoints.length,row.marks);assert.equal(q.markPointMarks.reduce((s,n)=>s+n,0),row.marks);
 assert.equal(hash(q.prompt),row.promptHash);assert.equal(hash(q.modelAnswer),row.answerHash);
 assert.equal(hash(JSON.stringify(q.markPoints)),row.pointsHash);assert.equal(hash(JSON.stringify(q.markPointMarks)),row.pointMarksHash);
 assert(!corrections.modelAnswers?.[q.id]&&!corrections.questionCorrections?.[q.id],'Unexpected correction '+q.id);
 return q;
});
assert.equal(originals.reduce((s,q)=>s+q.marks,0),114);
const frozen=JSON.stringify(originals);
const patched=originals.map(q=>({...q,markPoints:[...q.markPoints],markPointMarks:[...q.markPointMarks]}));
apply(patched);
assert.equal(JSON.stringify(originals),frozen,'Original bank mutated');
assert.equal(patched.filter(q=>q.v398ReviewRequired===true).length,24);
assert.equal(patched.reduce((s,q)=>s+(q.manualWorkingReview?q.marks:0),0),114);
const es=app.indexOf('function examSuggested(q,answer){'),ee=app.indexOf(' // v213:',es);
assert(es>0&&ee>es);
const suggested=new Function('window',app.slice(es,ee)+'\n}\nreturn examSuggested;')({});
const hs=app.indexOf('function manualExamHelpText(q){'),he=app.indexOf('function beginManualExamReview(q){',hs);
assert(hs>0&&he>hs);
const helper=new Function(app.slice(hs,he)+'\nreturn {help:manualExamHelpText,button:manualExamButtonText};')();
const ms=app.indexOf('function mockEligibleQuestion(q){'),me=app.indexOf('function startMockSession(){',ms);
assert(ms>0&&me>ms);
const eligible=new Function(app.slice(ms,me)+'\nreturn mockEligibleQuestion;')();
let probes=0,mutations=0;
for(let i=0;i<patched.length;i++){
 const q=patched[i],src=originals[i];
 assert(eligible(q),'Chemistry mock not eligible '+q.id);
 assert.match(helper.help(q),/multi-step science question/);
 assert.equal(helper.button(q),'Review science working point by point');
 for(const answer of ['',q.modelAnswer,'I copied the model answer','All working correct','I do not know']){
  const actual=suggested(q,answer);
  assert.equal(actual.manualRequired,true);assert.equal(actual.suggested,0);
  assert.equal(actual.finalCorrect,false);
  assert.deepEqual(actual.preds,Array(q.marks).fill(false));
  assert.deepEqual(actual.scores,Array(q.marks).fill(0));probes++;
 }
 for(const changes of [
  {id:'different'},{subject:'Physics'},{level:'Unknown'},{mock:false},{taught:false},
  {standalone:false},{requiresWorking:false},{manualWorkingReview:true},{manualDiagramReview:true},
  {topic:'Changed'},{courseTopic:'Changed'},{specRef:'3.9.99'},{questionType:'Changed'},
  {marks:q.marks+1},{prompt:q.prompt+' changed'},{modelAnswer:q.modelAnswer+' changed'},
  {markPoints:[...q.markPoints.slice(0,-1),'changed']},{markPointMarks:[...q.markPointMarks.slice(0,-1),2]}
 ]){
  const bad={...src,...changes};apply([bad]);
  assert.notEqual(bad.v398ReviewRequired,true,'Loose source guard '+q.id+' '+JSON.stringify(changes));mutations++;
 }
}
assert.equal(probes,120);
assert.equal(mutations,432);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v398: 24 original Chemistry mock worked questions, 114 manual marks, 120 no-auto-credit probes, 432 negative source mutations; original IDs, saved keys and bank preserved.');
