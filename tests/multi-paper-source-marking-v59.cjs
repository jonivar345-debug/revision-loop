/* Source-guided v59 regression: independent reasoning, alternative methods,
   and specific error-carried-forward cases across AQA Physics, Chemistry and Maths.
   Paraphrased examples; see the linked original schemes on each question. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const a=fs.readFileSync(path.join(root,'app.js'),'utf8');
const mark=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
 a.slice(a.indexOf('function normalise('),a.indexOf('function nextSchedule('))+
 a.slice(a.indexOf('function evidenceRuleScore('),a.indexOf('function renderExam(',a.indexOf('function evidenceRuleScore(')))+
 'return examSuggested')();
const questions=[...read('exam_questions.json').questions,...read('paper_supplement_2016_2017.json').questions];
const byId=new Map(questions.map(q=>[q.id,q]));let checks=0;
const cases=[
 // Physics, 2016 AS, 7407/1: AQA explicitly allows 22.5–24 N,
 // plus particular incorrect geometry methods for partial marks.
 ['aqa_phys_2016_74071_3_3_v45','22.5 N',3],
 ['aqa_phys_2016_74071_3_3_v45','23.8',3],
 ['aqa_phys_2016_74071_3_3_v45','24 N',3],
 ['aqa_phys_2016_74071_3_3_v45','25',0],
 ['aqa_phys_2016_74071_3_3_v45','92',2],
 ['aqa_phys_2016_74071_3_3_v45','7.3',1],
 ['aqa_phys_2016_74071_3_3_v45','610000',1],
 // AS Maths June 2022, 7356/1 Q7: a = 3 is an AG/argument result,
 // and the six M/A/B/R marks need real derivation.
 ['aqa_math_as22_p1_q7','3',0],
 ['aqa_math_as22_p1_q7','a=3',0],
 ['aqa_math_as22_p1_q7','a=3.2',0],
 ['aqa_math_as22_p1_q7','a³=27, so a=3',0],
 ['aqa_math_as22_p1_q7','x=-a and x=a',1],
 ['aqa_math_as22_p1_q7','∫_-a^a (a²−x²) dx',2],
 ['aqa_math_as22_p1_q7','x=-a and x=a. ∫_-a^a(a^2-x^2)dx = [a^2x−x^3/3]_-a^a =4a^3/3=36 so a=3.',6],
 ['aqa_math_as22_p1_q7','The intercepts are x=-a and x=a. 2∫0^a(a^2-x^2)dx=[2a^2x-2x^3/3]0^a=4a^3/3=36 so a^3=27 and a=3.',6],
 ['aqa_math_as22_p1_q7','x=±a; 2∫_0^a (a²−x²)dx; antiderivative a²x−x³/3; 2(2a³/3)=36; 4a³/3=36; a³=27; a=3',6],
 // 2020 Chemistry 7404/1 Q02.2 and Q02.3, made fully contextual.
 ['aqa_chem_as20_p1_q2_2_link','Drops of acid could drip from the funnel into the burette after the first reading.',1],
 ['aqa_chem_as20_p1_q2_2_link','Remove the funnel to avoid contamination.',0],
 ['aqa_chem_as20_p1_q2_2_link','Funnel is made of glass',0],
 ['aqa_chem_as20_p1_q2_3_link','It is easier to swirl the conical flask.',1],
 ['aqa_chem_as20_p1_q2_3_link','The flask has a narrow neck so you can mix by swirling without losing liquid.',1],
 ['aqa_chem_as20_p1_q2_3_link','It is made of glass.',0],
 // Previously verified cross-paper cases retained against regressions.
 ['aqa_2018_C_2_3','23.90, 24.00; mean 23.95',2],
 ['aqa_2018_C_2_3','23.86',1],
 ['aqa_2018_phyA_01_4','37 m',2],
 ['aqa_2018_phyA_01_4','37 m is less than the 85 m lane, so it is sufficient.',3],
 ['aqa_math_as24_p1_q3_src','(√3+3√5)(√5+√3)/(5-3)=(18+4√15)/2=9+√60',4]
];
const paperGroups=new Set();
for(const [id,answer,want] of cases){
 const q=byId.get(id);
 assert(q&&q.sourceVerified,'No source-linked question: '+id);checks++;
 assert(q.standalone!==false,'Source question still blocked: '+id);checks++;
 paperGroups.add([q.subject,q.level,q.year,q.paper].join('|'));
 const result=mark(q,answer);
 assert.equal(result.suggested,want,id+' awarded '+result.suggested+' not '+want+' for '+answer);checks++;
 const flags=result.preds.reduce((s,p,i)=>s+(p?(q.markPointMarks?.[i]??1):0),0);
 assert.equal(result.suggested,flags,'Displayed point-level flags disagree for '+id);checks++;
}
assert(paperGroups.size>=6,'Cross-paper testing must span six different AQA paper groups');checks++;
for(const id of ['aqa_math_as22_p1_q7','aqa_chem_as20_p1_q2_2_link','aqa_chem_as20_p1_q2_3_link']){
 const q=byId.get(id);assert(q.standalone&&!q.sourceFirst,'Recovered question no longer standalone '+id);checks++;
 assert.equal(mark(q,q.modelAnswer).suggested,q.marks,'Stored solution not fully credited '+id);checks++;
}
const audit=read('original_mark_audit_2026_10_21.json');
assert.equal(audit.counts.sourceFirstQuestionParts,0);checks++;
const inv=read('paper_inventory_2015_2025.json');
for(const paper of inv.papers){
 const all=questions.filter(q=>q.standalone!==false&&q.sourceVerified&&
 q.subject===paper.subject&&q.level===paper.level&&q.year===paper.year&&
 (q.paper===paper.paper||(paper.paper==='7408/3'&&q.paper.startsWith('7408/3'))));
 assert.equal(paper.indexedQuestionParts,all.length,
  'Paper inventory inconsistent: '+paper.subject+' '+paper.year+' '+paper.paper);checks++;
}
const chem2020=inv.papers.find(x=>x.subject==='Chemistry'&&x.level==='AS'&&x.year===2020&&x.paper==='7404/1');
assert(chem2020.indexedQuestionParts>=3,'2020 Chemistry questions not indexed');checks++;
const old=read('paper_coverage_audit_2015_2025.json');
const oldChem=old.rows.find(x=>x.subject==='Chemistry'&&x.level==='AS'&&x.year===2020);
assert.equal(oldChem.parts,inv.rows.find(x=>x.subject==='Chemistry'&&x.level==='AS'&&x.year===2020).parts);checks++;
console.log('PASS '+checks+' source-guided checks across '+paperGroups.size+' paper groups; '+cases.length+' alternative and partial responses');
