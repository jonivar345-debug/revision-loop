/* Independently checked sample of AQA 2018 Maths original mark totals.
   The rest of the source-linked archive remains expressly unverified. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const bank=JSON.parse(fs.readFileSync(path.join(root,'exam_questions.json'),'utf8')).questions;
const sample={aqa_2018_M_1:1,aqa_2018_M_2:1,aqa_2018_M_4:3,aqa_2018_M_7a:3,aqa_2018_M_7bi:1};
const source='AQA-73571-W-MS-JUN18.PDF';
let checks=0;
for(const [id,expected] of Object.entries(sample)){
 const q=bank.find(x=>x.id===id);assert(q,'Missing original source entry '+id);
 assert.equal(q.marks,expected,'Mark total differs from official AQA scheme: '+id);checks++;
 assert(q.originalMarkVerified,'No source verification flag '+id);checks++;
 assert(q.originalMarkVerifiedSource.includes(source),'Wrong original source '+id);checks++;
}
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const marker=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
 app.slice(app.indexOf('function normalise('),app.indexOf('function nextSchedule('))+
 app.slice(app.indexOf('function evidenceRuleScore('),app.indexOf('function renderExam(',app.indexOf('function evidenceRuleScore(')))+
 'return examSuggested')();
const q=bank.find(x=>x.id==='aqa_2018_M_7a');
const answers=[
 'AB squared is 98, BC squared is 578, AC squared is 676. 98+578=676, so by Pythagoras triangle ABC is right angled.',
 'Gradients of AB and BC are -1 and 1 so their product is -1 and the lines are perpendicular.'
];
for(const solution of answers){
 assert.equal(marker(q,solution).suggested,3,'Valid alternate AQA argument rejected');checks++;
}
assert.equal(marker(q,'1').suggested,0);checks++;
console.log('PASS '+checks+' independently source-verified original AQA mark totals and two accepted proof methods');
