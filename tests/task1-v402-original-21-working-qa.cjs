'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),deck=json('deck.json');
const bank=json('exam_questions.json'),corrections=json('exam_answer_corrections.json');
const audit=json('editorial/task1-v402-original-21-working-qa.json');
assert.equal(deck.cards.length,3345);assert.equal(new Set(deck.cards.map(q=>q.id)).size,3345);
assert.equal(bank.questions.length,1268);assert.equal(new Set(bank.questions.map(q=>q.id)).size,1268);
assert.equal(audit.rows.length,21);assert.equal(audit.counts.protectedMarks,75);
assert.deepEqual(audit.counts.bySubject,{Physics:{questions:6,marks:19},Chemistry:{questions:14,marks:53},Maths:{questions:1,marks:3}});
assert(sw.includes('-v402-75-original-manual'));
assert(app.includes('applyV402Original21ManualReview(examQuestions);'));
assert(app.indexOf('applyV402Original21ManualReview(examQuestions);')>app.indexOf('applyV400Physics8MethodManual(examQuestions);'));
const hash=s=>{let h=2166136261;const v=String(s||'');for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16)};
const start=app.indexOf('const V402_ORIGINAL_21_MANUAL='),end=app.indexOf('// v396: 18 exact, already-existing AS Physics worked exam questions',start);
assert(start>=0&&end>start);
const {rows,patch}=new Function(app.slice(start,end)+'\nreturn {rows:V402_ORIGINAL_21_MANUAL,patch:applyV402Original21ManualReview};'.replace('\n','\n'))();
assert.deepEqual(rows,audit.rows);
const source=rows.map(row=>{
 const q=bank.questions.find(q=>q.id===row.id);assert(q,'Missing original question '+row.id);
 const adjusted={...q,markPoints:[...q.markPoints],markPointMarks:[...q.markPointMarks]};
 const hasCorrection=Object.hasOwn(corrections.modelAnswers||{},q.id)||Object.hasOwn(corrections.questionCorrections||{},q.id);
 assert.equal(hasCorrection,row.correction,'Unexpected corrections '+row.id);
 if(Object.hasOwn(corrections.modelAnswers||{},q.id))adjusted.modelAnswer=corrections.modelAnswers[q.id];
 const changes=corrections.questionCorrections?.[q.id];
 if(changes&&typeof changes==='object')for(const key of ['prompt','modelAnswer','markPoints','markPointMarks','markingMode','markEvidenceRules','numericAnswer','tolerance']){
  if(Object.hasOwn(changes,key))adjusted[key]=changes[key];
 }
 assert.equal(adjusted.subject,row.subject);assert.equal(adjusted.level,row.level);
 assert.equal(adjusted.mock,true);assert.equal(adjusted.standalone,true);assert.notEqual(adjusted.taught,false);
 assert.notEqual(adjusted.manualWorkingReview,true);assert.notEqual(adjusted.manualDiagramReview,true);
 for(const key of ['topic','subtopic','courseTopic','specRef','questionType','requiresWorking'])assert.equal(adjusted[key]??null,row[key]??null,row.id+' '+key);
 assert.equal(adjusted.marks,row.marks);assert.equal(adjusted.markPoints.length,row.marks);
 assert.equal(adjusted.markPointMarks.reduce((s,n)=>s+n,0),row.marks);
 assert.equal(hash(adjusted.prompt),row.promptHash,row.id+' prompt');assert.equal(hash(adjusted.modelAnswer),row.answerHash,row.id+' model');
 assert.equal(hash(JSON.stringify(adjusted.markPoints)),row.pointsHash,row.id+' points');
 assert.equal(hash(JSON.stringify(adjusted.markPointMarks)),row.weightsHash,row.id+' weights');
 return adjusted;
});
assert.equal(source.reduce((s,q)=>s+q.marks,0),75);
const frozen=JSON.stringify(source);
const guarded=source.map(q=>({...q,markPoints:[...q.markPoints],markPointMarks:[...q.markPointMarks]}));
patch(guarded);assert.equal(JSON.stringify(source),frozen,'Source bank mutated');
assert.equal(guarded.filter(q=>q.v402ReviewRequired===true).length,21);
assert.equal(guarded.filter(q=>q.manualDiagramReview===true).length,1);
assert.equal(guarded.filter(q=>q.manualWorkingReview===true).length,20);
assert.equal(guarded.reduce((s,q)=>s+(q.v402ReviewRequired?q.marks:0),0),75);
const es=app.indexOf('function examSuggested(q,answer){'),ee=app.indexOf(' // v213:',es);
assert(es>0&&ee>es);
const suggest=new Function('window',app.slice(es,ee)+'\n}\nreturn examSuggested;'.replaceAll('\n','\n'))({});
const hs=app.indexOf('function manualExamHelpText(q){'),he=app.indexOf('function beginManualExamReview(q){',hs);
assert(hs>0&&he>hs);
const helper=new Function(app.slice(hs,he)+'\nreturn {help:manualExamHelpText,button:manualExamButtonText};'.replace('\n','\n'))();
const ms=app.indexOf('function mockEligibleQuestion(q){'),me=app.indexOf('function startMockSession(){',ms);
assert(ms>0&&me>ms);
const eligible=new Function(app.slice(ms,me)+'\nreturn mockEligibleQuestion;'.replace('\n','\n'))();
let probes=0,mutations=0;
for(let i=0;i<source.length;i++){
 const src=source[i],q=guarded[i],row=rows[i];assert(eligible(q),'Mock unexpectedly excluded '+q.id);
 if(row.mode==='diagram'){
  assert.match(helper.help(q),/cannot verify this drawing or graph/);
  assert.equal(helper.button(q),'Review diagram marking points manually');
 }else{
  assert.match(helper.help(q),row.subject==='Maths'?/multi-step maths question/:/multi-step science question/);
  assert.equal(helper.button(q),row.subject==='Maths'?'Review maths working point by point':'Review science working point by point');
 }
 for(const answer of ['',q.modelAnswer,'I copied the model answer','Please give full marks','All steps are correct']){
  const r=suggest(q,answer);assert.equal(r.manualRequired,true);assert.equal(r.suggested,0);assert.equal(r.finalCorrect,false);
  assert.deepEqual(r.preds,Array(q.marks).fill(false));assert.deepEqual(r.scores,Array(q.marks).fill(0));probes++;
 }
 for(const changes of [
  {id:'other'},{subject:'Other'},{level:'Other'},{mock:false},{taught:false},{standalone:false},
  {requiresWorking:true},{manualWorkingReview:true},{manualDiagramReview:true},
  {topic:'changed'},{subtopic:'changed'},{courseTopic:'changed'},{specRef:'changed'},
  {questionType:'changed'},{marks:q.marks+1},{prompt:q.prompt+' changed'},
  {modelAnswer:q.modelAnswer+' changed'},{markPoints:[...q.markPoints.slice(0,-1),'changed']},
  {markPointMarks:[...q.markPointMarks.slice(0,-1),2]}
 ]){
  const bad={...src,...changes};patch([bad]);assert.notEqual(bad.v402ReviewRequired,true,'Guard matched altered question '+q.id+' '+JSON.stringify(changes));mutations++;
 }
}
assert.equal(probes,105);assert.equal(mutations,399);
// No adjacent question can accidentally be protected by this exact source-locked fix.
const controls=bank.questions.filter(q=>!rows.some(row=>row.id===q.id)).slice(0,30).map(q=>({...q}));
patch(controls);assert.equal(controls.filter(q=>q.v402ReviewRequired===true).length,0);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v402: 21 original questions, 75 marks protected, 105 zero-credit probes, 399 altered-source exclusions, mock routing, prior IDs and saved keys unchanged.');
