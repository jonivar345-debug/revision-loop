/* Independent-context and mark-allocation regression for nine previously hidden AQA-linked parts. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),read=n=>JSON.parse(fs.readFileSync(path.join(root,n),'utf8'));
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const scorer=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
 app.slice(app.indexOf('function normalise('),app.indexOf('function nextSchedule('))+
 app.slice(app.indexOf('function evidenceRuleScore('),app.indexOf('function renderExam(',app.indexOf('function evidenceRuleScore(')))+
 'return examSuggested')();
const all=[...read('exam_questions.json').questions,...read('paper_supplement_2016_2017.json').questions];
const ids=["aqa_math_as20_p1_q3a_link","aqa_math_as20_p1_q3b_link","aqa_math_as21_p1_q3a_link","aqa_math_as21_p1_q3b_link","aqa_chem_as21_p1_q7_1_link","aqa_chem_as21_p1_q7_3_link","aqa_math_as24_p1_q5a_src","aqa_math_as24_p1_q5b_src","aqa_math_as24_p1_q6_src"];
let checks=0;
for(const id of ids){
 const q=all.find(q=>q.id===id);
 assert(q&&q.sourceVerified,'AQA reference missing: '+id);checks++;
 assert(q.standalone===true&&!q.sourceFirst,'Question remains dependent on outside material: '+id);checks++;
 assert(q.contextRebuiltFrom,'Source context not reviewed: '+id);checks++;
 assert(q.prompt.length>=75,'Prompt lacks sufficient context: '+id);checks++;
 assert(q.modelAnswer,'No worked reference outcome: '+id);checks++;
 assert.equal(scorer(q,q.modelAnswer).suggested,q.marks,'Reference answer rejected: '+id);checks++;
}
const cases=[
  [
    "aqa_math_as20_p1_q3a_link",
    "The division by cos y drops cos y=0; cos y=0.5 also admits -60 degrees.",
    2
  ],
  [
    "aqa_math_as20_p1_q3a_link",
    "The division by cos y ignores the zero case.",
    1
  ],
  [
    "aqa_math_as20_p1_q3a_link",
    "y=60°",
    0
  ],
  [
    "aqa_math_as20_p1_q3b_link",
    "±60°, ±90°",
    2
  ],
  [
    "aqa_math_as20_p1_q3b_link",
    "-90, -60, 60, 90",
    2
  ],
  [
    "aqa_math_as20_p1_q3b_link",
    "60, 90",
    1
  ],
  [
    "aqa_math_as20_p1_q3b_link",
    "60",
    0
  ],
  [
    "aqa_math_as20_p1_q3b_link",
    "-90, -60, 60, 90, 180",
    1
  ],
  [
    "aqa_math_as21_p1_q3a_link",
    "1/(x-3)",
    1
  ],
  [
    "aqa_math_as21_p1_q3a_link",
    "y=(x-3)^-1",
    1
  ],
  [
    "aqa_math_as21_p1_q3a_link",
    "y=1/(x+3)",
    0
  ],
  [
    "aqa_math_as21_p1_q3b_link",
    "x=3; y=0",
    2
  ],
  [
    "aqa_math_as21_p1_q3b_link",
    "y=0",
    1
  ],
  [
    "aqa_math_as21_p1_q3b_link",
    "x=-3; y=0",
    1
  ],
  [
    "aqa_chem_as21_p1_q7_1_link",
    "For 1 mole completely combusted in oxygen, all substances in their standard states at 100 kPa.",
    2
  ],
  [
    "aqa_chem_as21_p1_q7_1_link",
    "One mole burns completely with oxygen.",
    1
  ],
  [
    "aqa_chem_as21_p1_q7_1_link",
    "In standard states at standard conditions.",
    1
  ],
  [
    "aqa_chem_as21_p1_q7_1_link",
    "Enthalpy of combustion.",
    0
  ],
  [
    "aqa_chem_as21_p1_q7_3_link",
    "The sample evaporates.",
    1
  ],
  [
    "aqa_chem_as21_p1_q7_3_link",
    "Incomplete combustion.",
    1
  ],
  [
    "aqa_chem_as21_p1_q7_3_link",
    "The fuel does not burn completely.",
    1
  ],
  [
    "aqa_chem_as21_p1_q7_3_link",
    "Heat loss",
    0
  ],
  [
    "aqa_math_as24_p1_q5a_src",
    "The factor theorem needs f(2), not f(-2).",
    1
  ],
  [
    "aqa_math_as24_p1_q5a_src",
    "Evaluating f(-2) is the right way.",
    0
  ],
  [
    "aqa_math_as24_p1_q5b_src",
    "(x+2) is definitely a factor.",
    1
  ],
  [
    "aqa_math_as24_p1_q5b_src",
    "We cannot establish whether (x-2) is a factor.",
    1
  ],
  [
    "aqa_math_as24_p1_q5b_src",
    "(x+2) is a factor, but (x-2) may or may not be a factor.",
    2
  ],
  [
    "aqa_math_as24_p1_q5b_src",
    "(x-2) cannot be a factor.",
    0
  ],
  [
    "aqa_math_as24_p1_q6_src",
    "3x^2+2x-6>0",
    1
  ],
  [
    "aqa_math_as24_p1_q6_src",
    "roots x=(-1±√19)/3",
    1
  ],
  [
    "aqa_math_as24_p1_q6_src",
    "3x^2+2x-6>0; roots x=(-1±√19)/3; outside the roots; {x:x<(-1-√19)/3}∪{x:x>(-1+√19)/3}",
    4
  ],
  [
    "aqa_math_as24_p1_q6_src",
    "x=3",
    0
  ]
];
for(const [id,answer,want] of cases){
 const q=all.find(q=>q.id===id);
 const r=scorer(q,answer);
 assert.equal(r.suggested,want,id+' / '+answer);checks++;
 assert.equal(r.preds.reduce((s,ok,i)=>s+(ok?(q.markPointMarks?.[i]||1):0),0),want,
  'Scoring flags disagree with suggested marks '+id);checks++;
}
const covered=all.filter(q=>q.sourceVerified&&(q.sourceFirst||q.standalone===false));
assert.equal(covered.length,0,'Source-first entries still lack independent context');checks++;
const inventory=read('paper_inventory_2015_2025.json'),audit=read('paper_coverage_audit_2015_2025.json');
assert.equal(audit.summary.withSomeIndexed,inventory.papers.filter(p=>p.indexedQuestionParts>0).length);checks++;
for(const p of inventory.papers){
 const indexed=all.filter(q=>q.sourceVerified&&q.standalone!==false&&q.subject===p.subject&&
 q.level===p.level&&q.year===p.year&&(q.paper===p.paper||
 (p.paper==='7408/3'&&String(q.paper).startsWith('7408/3'))));
 assert.equal(p.indexedQuestionParts,indexed.length,'Inventory mismatch '+p.paper+'/'+p.year);checks++;
}
const originalMarkAudit=read('original_mark_audit_2026_10_21.json');
assert.equal(originalMarkAudit.counts.sourceFirstQuestionParts,0);checks++;
console.log('PASS '+checks+' source-first context, AQA-style partial marks and archive reconciliation checks');
