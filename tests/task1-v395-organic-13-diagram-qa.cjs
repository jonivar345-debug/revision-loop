'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),deck=json('deck.json');
const audit=json('editorial/task1-v395-organic-13-diagram-qa.json');
const source=json('exam_questions.json').questions;
assert.equal(deck.cards.length,3345);
assert.equal(new Set(deck.cards.map(c=>c.id)).size,3345);
assert.equal(audit.version,'v395');
assert.equal(audit.rows.length,13);
assert.equal(audit.counts.protectedMarks,72);
assert(sw.includes('-v395-organic72-diagrams'));
assert(app.includes('applyV395Organic13ManualDiagramReview(examQuestions);'));
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16)};
const start=app.indexOf('const V395_ORGANIC_DIAGRAM_13='),end=app.indexOf('const V394_CHEMISTRY_ORIGINAL_17=',start);
assert(start>=0&&end>start);
const {rows,apply}=new Function(app.slice(start,end)+'\nreturn {rows:V395_ORGANIC_DIAGRAM_13,apply:applyV395Organic13ManualDiagramReview};')();
assert.deepEqual(rows,audit.rows);
const original=audit.rows.map(row=>{
 const q=source.find(q=>q.id===row.id);
 assert(q,'Missing original '+row.id);
 assert.equal(q.subject,'Chemistry');
 assert.equal(q.level,'AS');
 assert.equal(q.mock,true);
 assert.equal(q.standalone,true);
 assert.equal(q.requiresWorking,true);
 assert.notEqual(q.taught,false);
 assert.notEqual(q.manualDiagramReview,true);
 assert.notEqual(q.manualWorkingReview,true);
 assert.equal(q.topic,row.topic);
 assert.equal(q.courseTopic??null,row.courseTopic);
 assert.equal(q.specRef??null,row.specRef);
 assert.equal(q.marks,row.marks);
 assert.equal(q.markPoints.length,q.marks);
 assert.equal(q.markPointMarks.reduce((s,n)=>s+n,0),q.marks);
 assert(/\bdraw\b|\bcurly.?arrow\b|\bbracketed\b/i.test(q.prompt),'Not a drawing prompt '+row.id);
 assert.equal(hash(q.prompt),row.promptHash);
 assert.equal(hash(q.modelAnswer),row.answerHash);
 assert.equal(hash(JSON.stringify(q.markPoints)),row.pointsHash);
 return q;
});
const frozenSnapshot=JSON.stringify(original);
const patched=original.map(q=>({...q,markPoints:[...q.markPoints],markPointMarks:[...q.markPointMarks]}));
apply(patched);
assert.equal(JSON.stringify(original),frozenSnapshot);
assert.equal(patched.filter(q=>q.v395DiagramRubricRequired===true).length,13);
assert.equal(patched.reduce((s,q)=>s+(q.manualDiagramReview?q.marks:0),0),72);
const es=app.indexOf('function examSuggested(q,answer){'),ee=app.indexOf(' // v213:',es);
assert(es>0&&ee>es);
const suggested=new Function('window',app.slice(es,ee)+'\n}\nreturn examSuggested;')({});
const hs=app.indexOf('function manualExamHelpText(q){'),he=app.indexOf('function beginManualExamReview(q){',hs);
assert(hs>0&&he>hs);
const helper=new Function(app.slice(hs,he)+'\nreturn {help:manualExamHelpText,button:manualExamButtonText};')();
const ms=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),me=app.indexOf('function startMockSession(){',ms);
assert(ms>0&&me>ms);
const eligible=new Function(app.slice(ms,me)+'\nreturn mockEligibleQuestion;')();
let noCredit=0,negative=0;
for(let i=0;i<patched.length;i++){
 const q=patched[i],src=original[i];
 assert(eligible(q),'Excluded mock drawing '+q.id);
 assert.match(helper.help(q),/text checker cannot verify this drawing or graph/);
 assert.equal(helper.button(q),'Review diagram marking points manually');
 for(const answer of ['',q.modelAnswer,'I drew the correct arrows','I copied the question', 'All diagrams correct']){
  const result=suggested(q,answer);
  assert.equal(result.manualRequired,true);
  assert.equal(result.suggested,0);
  assert.equal(result.finalCorrect,false);
  assert.deepEqual(result.preds,Array(q.marks).fill(false));
  assert.deepEqual(result.scores,Array(q.marks).fill(0));
  noCredit++;
 }
 const changes=[
  {id:'other'}, {subject:'Physics'}, {level:'A-level'}, {mock:false},
  {taught:false}, {standalone:false}, {requiresWorking:false},
  {manualWorkingReview:true}, {manualDiagramReview:true},
  {topic:'Other'}, {courseTopic:'Other'}, {specRef:'3.1.999'},
  {marks:q.marks+1}, {prompt:q.prompt+' changed'}, {modelAnswer:q.modelAnswer+' changed'},
  {markPoints:[...q.markPoints.slice(0,-1),'changed point']},
  {markPointMarks:[2,...q.markPointMarks.slice(1)]}
 ];
 for(const change of changes){
  const bad={...src,...change};apply([bad]);
  assert.notEqual(bad.v395DiagramRubricRequired,true,'Unsafe source '+q.id+' '+JSON.stringify(change));
  negative++;
 }
}
assert.equal(noCredit,65);
assert.equal(negative,221);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v395: 13 original AS organic drawing questions / 72 marks manually reviewed, 65 no-credit probes, 221 exact-source negative guards; original deck and saved progress keys unchanged.');
