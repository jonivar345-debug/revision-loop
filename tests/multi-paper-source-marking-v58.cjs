/* AQA source-guided answer checks covering multiple papers and subjects.
   The examples are minimal independent test responses, not a reproduction of papers.
   See in-repository qpUrl / msUrl on each question. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const a=fs.readFileSync(path.join(root,'app.js'),'utf8');
const mark=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
 a.slice(a.indexOf('function normalise('),a.indexOf('function nextSchedule('))+
 a.slice(a.indexOf('function evidenceRuleScore('),a.indexOf('function renderExam(',a.indexOf('function evidenceRuleScore(')))+
 'return examSuggested')();
const questions=[...read('exam_questions.json').questions,...read('paper_supplement_2016_2017.json').questions];
const byId=new Map(questions.map(x=>[x.id,x]));
const cases=[
 ['aqa_2018_C_2_3','23.90, 24.00; mean 23.95',2],
 ['aqa_2018_C_2_3','23.86',1],
 ['aqa_2018_C_2_3','23.80',0],
 ['aqa_2018_C_2_5','766 mg',3],
 ['aqa_2018_C_2_5','0.766 g',2],
 ['aqa_2018_C_2_5','76.6 mg',2],
 ['aqa_2018_C_2_5','0.0766 g',1],
 ['aqa_2018_C_2_5','800 mg',2],
 ['aqa_2018_C_3_1','13.4',4],
 ['aqa_2018_C_3_1','26.8',3],
 ['aqa_2018_C_3_1','0.0134',3],
 ['aqa_2018_C_3_1','0.0268',2],
 ['aqa_2018_phyA_01_4','37 m',2],
 ['aqa_2018_phyA_01_4','37 m is less than the 85 m lane, so it is sufficient.',3],
 ['aqa_2018_phyA_01_4','37 m but the lane is insufficient.',2],
 ['aqa_2018_phyA_01_4','4.15',1],
 ['aqa_2018_phyA_01_4','0',0],
 ['aschem19p2_02_3','31.6',2],
 ['aschem19p2_02_3','32',1],
 ['aschem19p2_02_3','21',0],
 ['aschem19p2_03_1','62.7',4],
 ['aschem19p2_03_1','0',0],
 ['aqa_math_as20_p1_q5_link','8x+1',0],
 ['aqa_math_as20_p1_q5_link','f(x+h)=4(x+h)^2+x+h; [f(x+h)-f(x)]/h; (8xh+4h²+h)/h=8x+4h+1; h→0 gives 8x+1',4],
 ['aqa_math_as24_p1_q3_src','9+√60',1],
 ['aqa_math_as24_p1_q3_src','(√3+3√5)(√5+√3)/(5-3)=(18+4√15)/2=9+√60',4],
 ['aqa_math_as24_p1_q3_src','18+4√15',1]
];
let checks=0;const papers=new Set();
for(const [id,reply,want] of cases){
 const q=byId.get(id);assert(q,'Missing source-linked question '+id);
 papers.add([q.subject,q.level,q.year,q.paper].join('|'));
 assert(q.sourceVerified,'Not source-linked '+id);checks++;
 const result=mark(q,reply);
 assert.equal(result.suggested,want,id+' gave '+result.suggested+' rather than '+want+' for '+reply);checks++;
 assert.equal(result.preds.reduce((n,yes,i)=>n+(yes?(q.markPointMarks?.[i]||1):0),0),
   result.suggested,'Mark flags disagree for '+id);checks++;
}
assert(papers.size>=5,'Check at least five different original papers');checks++;
// Audit invariant: repaired independently usable questions must stay indexed.
for(const id of ['aqa_math_as20_p1_q5_link','aqa_math_as24_p1_q3_src']){
 const q=byId.get(id);assert(q.standalone&&!q.sourceFirst,'Corrected question hidden '+id);checks++;
 assert.equal(mark(q,q.modelAnswer).suggested,q.marks,'Incomplete model solution '+id);checks++;
}
const inventory=read('paper_inventory_2015_2025.json');
for(const p of inventory.papers){
 const matching=questions.filter(q=>q.sourceVerified&&q.standalone!==false&&
 q.subject===p.subject&&q.level===p.level&&q.year===p.year&&
 (q.paper===p.paper||(p.paper==='7408/3'&&q.paper.startsWith('7408/3'))));
 assert.equal(matching.length,p.indexedQuestionParts,'Outdated paper tally '+p.subject+' '+p.year+' '+p.paper);checks++;
}
console.log('PASS '+checks+' source-guided marking and inventory checks across '+papers.size+' AQA papers');
