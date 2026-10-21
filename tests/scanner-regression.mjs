// Run with: node tests/scanner-regression.mjs
// No third-party packages or server credentials needed.
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const scanner=readFileSync(new URL('../scanner.js',import.meta.url),'utf8');
const bank=JSON.parse(readFileSync(new URL('../exam_questions.json',import.meta.url),'utf8'));
const questions=bank.questions.filter(q=>q.standalone!==false);

new Function(app);
new Function(scanner);
const scorer=new Function(
 'function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
 app.slice(app.indexOf('function normalise('),app.indexOf('function nextSchedule('))+
 app.slice(app.indexOf('function examSuggested('),app.indexOf('function renderExam(',app.indexOf('function examSuggested(')))+
 'return {examSuggested,markPointPrediction}'
)();
const markedScanner=scanner.replace(
 'window.RevisionScan={mount,commit,countFor,usedOCR,reviewEvidence,prepareForMark};',
 'window.__test={set:(id,t)=>{currentId=id;ocrText=t;ocrApplied=true},reviewEvidence,possiblyIncorrectArithmetic,ocrMathSignature};window.RevisionScan={mount,commit,countFor,usedOCR,reviewEvidence,prepareForMark};'
);
const win={};
new Function('window','document','markPointPrediction',markedScanner)(
 win,{getElementById:()=>null},scorer.markPointPrediction
);
assert.ok(win.__test,'Scanner test hook was not injected');

let count=0;
function check(id,answer,expected){
 const question=questions.find(q=>q.id===id);
 assert.ok(question,'Missing question '+id);
 win.__test.set(id,answer);
 const result=scorer.examSuggested(question,answer);
 const evidence=win.__test.reviewEvidence(question,answer,result);
 const score=evidence.reduce((n,e,i)=>n+(e.strong?(question.markPointMarks?.[i]??1):0),0);
 assert.equal(score,expected,id+' produced '+score+'/'+question.marks+'\nAnswer: '+answer);
 count++;
}
check('orig_v33_math_28_3','(5+7+8+12)/4=8',2);
check('orig_v33_math_28_3','(5+7+8+12)/4=7',1);
check('orig_v33_math_28_3','mean=8',1);
check('orig_v33_math_28_3','5,7,8,12',0);
check('stretch_v34_maths_integration','(x-3)(x+1)=0',1);
check('stretch_v34_maths_integration','x²−2x−3=0',1);
check('stretch_v34_physics_internal_resistance',
 'Rparallel=2Ω\nRtotal=3Ω\nI=12/3=4A\nV=12-4=8V\nI6=8/6=1.33A\nI3=8/3=2.67A\nPower I^2r=16W\nE=16*90=1440J',7);
check('stretch_v34_physics_internal_resistance',
 'Rparallel=2Ω\nRtotal=3Ω\nI=12/3=9A\nV=4V',2);
check('stretch_v34_chemistry_back_titrations',
 '0.0400*0.500=0.0200 mol\n0.0180*0.400=0.00720 mol\nacid used=0.01280 mol\nCaCO3:HCl=1:2\nn(CaCO3)=0.00640 mol\nmass=0.64064g\npurity=75.4%',7);

for(const [line,wrong] of [
 ['(5+7+8+12)/4=8',false],['(5+7+8+12)/4=7',true],
 ['1.5e-3*2=0.003',false],['1.5e-3*2=0.004',true],
 ['12/3=4',false],['12/3=9',true],
 ['x²−2x−3=0',false]
]){
 assert.equal(win.__test.possiblyIncorrectArithmetic(line),wrong,'Arithmetic '+line);
 count++;
}
assert.equal(win.__test.ocrMathSignature('(5+7+8+12)/4=8')!==
 win.__test.ocrMathSignature('(5+7+8+2)/4=8'),true);
count++;

for(const q of questions){
 const answer=q.modelAnswer||q.markPoints.join('. ');
 const got=scorer.examSuggested(q,answer).suggested;
 assert.equal(got,q.marks,'Model-answer regression '+q.id);
 assert.equal(scorer.examSuggested(q,"I don't know").suggested,0,'Unknown answer '+q.id);
 assert.equal(scorer.examSuggested(q,'12345 XYZ').suggested,0,'Nonsense answer '+q.id);
}
console.log('PASS: '+count+' scanner cases and '+questions.length+' complete-bank marking regressions.');
