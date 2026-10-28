'use strict';
/* v175: photos and diagrams must be assessable without unreliable OCR.
   These tests do not claim that a drawn answer was automatically understood. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const app=fs.readFileSync('app.js','utf8');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const bank=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const report=JSON.parse(fs.readFileSync('editorial/task1-v175-manual-diagram-mark-review.json','utf8'));
assert.equal(deck.cards.length,3345);
assert.equal(bank.questions.length,1268);
assert.equal(report.task1Complete,false);
assert.equal(report.unverifiedLegacyScienceMockCards,971);
assert(app.includes('id="reviewExamManually"'));
assert(app.includes("document.getElementById('reviewExamManually').onclick=()=>beginManualExamReview(q);"));
assert(app.includes("markingRoute:currentExamMarkingRoute==='manual'?'self-reviewed':'local-suggestion-reviewed'"));
assert(app.includes("'Marking route: '+(currentExamMarkingRoute==='manual'"));
const depStart=app.indexOf('function enforceMarkDependencies(');
const depEnd=app.indexOf('function totalMarkingPoints(',depStart);
const manualStart=app.indexOf('function beginManualExamReview(');
const manualEnd=app.indexOf('function renderScoreEditor(',manualStart);
assert(depStart>=0&&depEnd>depStart&&manualStart>depEnd&&manualEnd>manualStart);
const dependencies=new Function(app.slice(depStart,depEnd)+'return enforceMarkDependencies')();
assert.deepEqual(dependencies({markPointDependencies:{1:[2],2:[0]}},[false,true,true]),[false,false,false]);
assert.deepEqual(dependencies({markPointDependencies:{2:[1],1:[0]}},[false,true,true]),[false,false,false]);
assert.deepEqual(dependencies({markPointDependencies:{1:[0],2:[1]}},[true,true,true]),[true,true,true]);
assert.deepEqual(dependencies({markPointDependencies:{2:[1],1:[0]}},[true,false,true]),[true,false,false]);
assert.deepEqual(dependencies({markPointDependencies:{1:[0],2:[1]}},[true,false,true]),[true,false,false]);
assert.deepEqual(dependencies({markPointDependencies:{1:[0]}},[true,true]),[true,true]);
assert.deepEqual(dependencies({},[true,false,true]),[true,false,true]);
const records=bank.questions.filter(q=>q.markPointDependencies&&Object.keys(q.markPointDependencies).length);
assert(records.length>=3);
for(const q of records)assert(dependencies(q,Array(q.markPoints.length).fill(true)).every(Boolean),q.id);
// Simulated DOM: verify an image-only answer starts with ZERO checked marks and
// requires explicit review. This bypasses OCR but never awards free marks.
let boxes=[];
const classes={add(){},remove(){},contains(){return true}};
const marking={classList:classes,get innerHTML(){return this._html||''},set innerHTML(value){
 this._html=value;
 boxes=[...value.matchAll(/data-mp="(\d+)"/g)].map(m=>({dataset:{mp:m[1]},checked:false,onchange:null}));
}};
const feedback={className:'',textContent:''};
const answer={value:''};
const elements={examMarking:marking,examFeedback:feedback,examAnswer:answer};
const document={getElementById(id){return elements[id]||null},querySelectorAll(q){return q==='[data-mp]'?boxes:[]}};
let editorCalls=[];
const esc=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const total=(q,flags)=>q.markingMode==='anyN'?Math.min(q.marks,flags.filter(Boolean).length):Math.min(q.marks,flags.reduce((v,on,i)=>v+(on?(q.markPointMarks?.[i]??1):0),0));
const run=new Function('document','esc','renderScoreEditor','totalMarkingPoints',
 "let currentExamMarkingRoute='suggested',currentExamScore=99,manualScoreOverride=true;\n"+
 app.slice(manualStart,manualEnd)+
 'return {open:beginManualExamReview,getState:()=>({route:currentExamMarkingRoute,score:currentExamScore,override:manualScoreOverride})};'
)(document,esc,(q,text)=>{editorCalls.push({id:q.id,answer:text})},total);
const q={id:'visual-q',year:'Practice',marks:3,markPoints:['A diagram with labelled forces','Resolve correct component','Use the values'],
 markPointMarks:[1,1,1],markPointAcceptedAlternatives:[['A free-body diagram labelled properly'],[],[]],markPointDependencies:{2:[1]},
 modelAnswer:'An accurately labelled free-body diagram, Fcosθ etc.',ecfGuidance:'Correct subsequent method after earlier arithmetic slip.'};
run.open(q);
assert.equal(run.getState().route,'manual');
assert.equal(run.getState().score,0);
assert.equal(run.getState().override,false);
assert.equal(boxes.length,3);
assert(boxes.every(x=>!x.checked),'No automatic marks from an image-only answer');
assert.match(marking.innerHTML,/Self-assessment, not automated verification/);
assert.match(marking.innerHTML,/Error carried forward/);
assert.match(marking.innerHTML,/Normally depends on point/);
assert.match(feedback.textContent,/No handwriting or diagram has been automatically read or credited/);
boxes[0].checked=true;boxes[0].onchange();
assert.equal(run.getState().score,1);
boxes[1].checked=true;boxes[1].onchange();
assert.equal(run.getState().score,2);
boxes[2].checked=true;boxes[2].onchange();
assert.equal(run.getState().score,3);
assert.equal(editorCalls.length,4);
const any={id:'anyN',year:'Practice',marks:2,markingMode:'anyN',markPoints:['one','two','three']};
run.open(any);
boxes[0].checked=true;boxes[1].checked=true;boxes[2].checked=true;boxes[2].onchange();
assert.equal(run.getState().score,2);
const levels={id:'levels',year:2022,marks:4,answerType:'levels',markPoints:['point one','point two'],modelAnswer:'A complete explanation'};
run.open(levels);
assert.match(marking.innerHTML,/not necessarily the official AQA level descriptor/);
assert.equal(run.getState().score,0);
console.log('PASS v175: manual image/diagram marking begins with zero marks, allows reviewed self-marking and respects any-N caps; chained dependencies resolved.');
