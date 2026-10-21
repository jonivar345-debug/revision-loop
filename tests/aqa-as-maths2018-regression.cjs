/* AQA June 2018 AS Maths Paper 1: six adapted parts checked against the
 * AQA-73561-W-MS-JUN18.PDF mark scheme. No paper text reproduced.
 */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const bank=JSON.parse(fs.readFileSync(path.join(root,'exam_questions.json'),'utf8')).questions;
const registry=JSON.parse(fs.readFileSync(path.join(root,'original_mark_audit_2026_10_21.json'),'utf8'));
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const mark=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
 app.slice(app.indexOf('function normalise('),app.indexOf('function nextSchedule('))+
 app.slice(app.indexOf('function evidenceRuleScore('),app.indexOf('function renderExam(',app.indexOf('function evidenceRuleScore(')))+
 'return examSuggested')();
const expectations={
 aqa_math_as18_p1_q1:1,aqa_math_as18_p1_q2:1,aqa_math_as18_p1_q3:2,
 aqa_math_as18_p1_q4a:3,aqa_math_as18_p1_q4b:2,aqa_math_as18_p1_q5:5
};
let n=0;
function trial(id,answer,want){
 const q=bank.find(x=>x.id===id);
 assert(q,'Missing '+id);
 const result=mark(q,answer);
 assert.equal(result.suggested,want,id+' returned '+result.suggested+' for '+answer+' rather than '+want);
 n++;
}
for(const [id,marks] of Object.entries(expectations)){
 const q=bank.find(x=>x.id===id),entry=registry.entries.find(v=>v.id===id);
 assert(q);assert(entry);
 assert.equal(q.marks,marks);n++;
 assert.equal(q.originalMarkVerified,true);n++;
 assert.equal(q.originalMarkVerifiedSource,'AQA-73561-W-MS-JUN18.PDF');n++;
 assert.equal(entry.originalMarkVerified,true);n++;
 assert.equal(entry.marksInApp,marks);n++;
}
trial('aqa_math_as18_p1_q1','B',1);
trial('aqa_math_as18_p1_q1','A',0);
trial('aqa_math_as18_p1_q2','2/3',1);
trial('aqa_math_as18_p1_q2','-3/2',0);
trial('aqa_math_as18_p1_q3','90<x<270',2);
trial('aqa_math_as18_p1_q3','(90,270)',2);
trial('aqa_math_as18_p1_q3','π/2 < x < 3π/2',2);
trial('aqa_math_as18_p1_q3','90 and 270',1);
trial('aqa_math_as18_p1_q3','90<=x<=270',1);
trial('aqa_math_as18_p1_q3','70<x<270',0);
trial('aqa_math_as18_p1_q3','90<x<260',0);
trial('aqa_math_as18_p1_q4a','1-12x+54x²',3);
trial('aqa_math_as18_p1_q4a','1-12x+54x^2',3);
trial('aqa_math_as18_p1_q4a','1+4(-3x)+6(-3x)^2',2);
trial('aqa_math_as18_p1_q4a','54x²',1);
trial('aqa_math_as18_p1_q4b','0.976216',1);
trial('aqa_math_as18_p1_q4b','1-12(0.002)+54(0.002)^2=0.976216',2);
trial('aqa_math_as18_p1_q5','c=-2,d=4',1);
assert(bank.find(x=>x.id==='aqa_math_as18_p1_q4b').prompt.includes('1−12x+54x²'),'4b must be standalone');n++;
assert.equal(registry.counts.independentlyOriginalMarkChecked,231);n++;
assert.equal(registry.counts.awaitingOriginalMarkCheck,0);n++;
assert(registry.completedBatches.some(x=>x.paper==='AS Maths 7356/1 June 2018'&&x.questionPartsChecked===6));n++;
console.log('PASS '+n+' source-verified AQA Maths 2018 mark/answer checks');
