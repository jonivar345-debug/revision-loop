'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const app=fs.readFileSync('app.js','utf8');
const bank=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v174-formula-evidence-review.json','utf8'));
const begin=app.indexOf('function normalise('),middle=app.indexOf('function nextSchedule(',begin);
const start=app.indexOf('function evidenceRuleScore(',middle),end=app.indexOf('function renderExam(',start);
assert(begin>=0&&middle>begin&&start>middle&&end>start);
const scoring=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
 app.slice(begin,middle)+app.slice(start,end)+'return {examSuggested};')();
const {examSuggested}=scoring;
const qid=id=>{const q=bank.questions.find(x=>x.id===id);assert(q,'Missing question '+id);return q};
const checks=[
 ['verified2019_P_4_2','n=c/v',1,[true,false,false]],
 ['verified2019_P_4_2','using n = c / v',1,[true,false,false]],
 ['verified2019_P_4_2','n=c/vx',0,[false,false,false]],
 ['verified2019_P_4_2','not n=c/v',0,[false,false,false]],
 ['verified2019_P_4_2','v=c/n',1,[false,true,false]],
 ['verified2019_P_4_2','using v = c / n',1,[false,true,false]],
 ['verified2019_P_4_2','not v=c/n',0,[false,false,false]],
 ['verified2019_P_4_2','v=c/n but wrong',0,[false,false,false]],
 ['verified2019_P_4_2','v=c/nx',0,[false,false,false]],
 ['verified2019_P_4_2','n = c / v, hence v = c / n',2,[true,true,false]],
 ['verified2019_P_4_2','2.26e8',1,[false,false,true]],
 ['verified2019_P_4_2','2.26e80',0,[false,false,false]],
 ['verified2019_P_4_2','12.26e8',0,[false,false,false]],
 ['verified2019_P_2_2','L=RA/rho',1,[true,false]],
 ['verified2019_P_2_2','using L = R * A / rho',1,[true,false]],
 ['verified2019_P_2_2','not L=RA/rho',0,[false,false]],
 ['verified2019_P_2_2','L=RA/rho2',0,[false,false]]
];
for(const [id,answer,marks,flags] of checks){
 const outcome=examSuggested(qid(id),answer);
 assert.equal(outcome.suggested,marks,id+': '+answer);
 assert.deepEqual(outcome.preds,flags,id+': '+answer);
}
assert.equal(bank.questions.length,1268);
for(const q of bank.questions){
 const model=String(q.modelAnswer||'');
 assert(model.trim().length>0,'Missing model answer '+q.id);
 assert.equal(examSuggested(q,model).suggested,q.marks,'Model answer lost credit: '+q.id);
}
assert.equal(audit.overallTask1,'NOT YET COMPLETE');
assert.equal(audit.checked.originalPracticeQuestions,1268);
assert.equal(audit.limits.manualMarkCorrectionsRemain,true);
console.log('PASS v174: 17 targeted math-expression checks, 1268 complete model answers, negation/boundary guards, no student progress changes.');
