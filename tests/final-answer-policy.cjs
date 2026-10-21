/* A correct numerical result normally earns full marks when no workings,
   explanation, second quantity, or demonstration is explicitly required. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),a=fs.readFileSync(path.join(root,'app.js'),'utf8');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const qs=[...read('exam_questions.json').questions,...read('paper_supplement_2016_2017.json').questions];
const calc=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
 a.slice(a.indexOf('function normalise('),a.indexOf('function nextSchedule('))+
 a.slice(a.indexOf('function examSuggested('),a.indexOf('function renderExam(',a.indexOf('function examSuggested(')))+
 'return {examSuggested}')().examSuggested;
let checks=0,ordinary=0;
for(const q of qs){
 if(q.standalone===false||q.answerType!=='numeric'||!Number.isFinite(q.numericAnswer))continue;
 const answer=String(q.numericAnswer),result=calc(q,answer);
 assert.equal(result.finalCorrect,true,'Stored final value not accepted '+q.id);checks++;
 assert(result.suggested>=0&&result.suggested<=q.marks);checks++;
 const prompt=q.prompt||'',type=String(q.questionType||'').toLowerCase();
 const requiresMethod=/\b(?:show(?:\s+all)?\s+(?:your\s+)?working|justify\s+(?:your\s+)?answer|explain\s+(?:your\s+)?method|explain\s+why|show\s+that|prove\s+that)\b/i.test(prompt);
 const other=/\b(?:draw|sketch|explain|describe|justify|prove|derive|discuss|compare|state why|give a reason|show that|show your working)\b|\band\s+(?:state|give|explain|describe|justify|draw|sketch|identify|determine|calculate|find)\b/i.test(prompt);
 const simple=!/proof|show|explain|justify|derive|practical|evaluation/.test(type)&&
   q.requiresWorking!==true&&!requiresMethod&&!other;
 if(simple){
  assert.equal(result.suggested,q.marks,'Ordinary calculation full-credit failure: '+q.id);checks++;ordinary++;
 }
}
function check(id,answer,expected){
 const q=qs.find(q=>q.id===id);assert(q,'Missing '+id);
 assert.equal(calc(q,answer).suggested,expected,id);checks++;
}
check('aqa_phy_as23_p1_q1_5','1.59e-11',2);
check('aqa_phy_as23_p1_q1_5','5',0);
check('aqa_chem_as23_p1_q2_6','74',6);
check('aqa_math_as23_p1_q8b','9',1); // Must fully justify, not merely state the final value.
check('original_v31_phys_measurements_3','15.79',1); // An explanation of zero error is separately asked.
check('orig_v31_maths_logs_3','8.389056',1); // Domain condition separately asked.
check('aqa_chem_as16_p1_q5_1','0.696',1); // Unit conversion working expressly requested.
console.log('PASS '+checks+' final-answer policy checks across '+ordinary+' ordinary numerical calculations');
