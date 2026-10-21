/* Audit original AQA mark totals across every indexed source-linked part.
   Mark verification does not certify adapted wording or examiner-level AI. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const main=read('exam_questions.json').questions,supp=read('paper_supplement_2016_2017.json').questions;
const registry=read('original_mark_audit_2026_10_21.json');
const all=[...main,...supp].filter(q=>q.sourceVerified===true);
const map=new Map(registry.entries.map(e=>[e.id,e]));
assert.equal(all.length,231);assert.equal(map.size,231);
assert.equal(registry.counts.independentlyOriginalMarkChecked,231);
assert.equal(registry.counts.awaitingOriginalMarkCheck,0);
const byPaper=new Map();let checks=0;
for(const q of all){
 const r=map.get(q.id);
 assert(r,'Question missing in audit: '+q.id);checks++;
 assert(q.originalMarkVerified===true,'Unchecked original mark total: '+q.id);checks++;
 assert.equal(r.originalMarkVerified,true);checks++;
 assert.equal(r.marksInApp,q.marks);checks++;
 assert.equal(r.originalMarkVerifiedSource,q.originalMarkVerifiedSource);checks++;
 assert(q.msUrl&&q.msUrl.startsWith('https://'),'No mark scheme '+q.id);checks++;
 if(q.answerType==='levels')assert.equal(q.markSchemeType,'level-of-response');checks++;
 const k=[q.subject,q.level,q.year,q.paper].join('|');byPaper.set(k,(byPaper.get(k)||0)+1);
}
assert(byPaper.size>=25,'Audit must cover enough distinct examination paper groups');
const batchSum=registry.completedBatches.reduce((n,b)=>n+b.questionPartsChecked,0);
assert.equal(batchSum,231,'No double count or missing verification batches');
assert.equal(registry.completedBatches.length,32);
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const mark=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
 app.slice(app.indexOf('function normalise('),app.indexOf('function nextSchedule('))+
 app.slice(app.indexOf('function evidenceRuleScore('),app.indexOf('function renderExam(',app.indexOf('function evidenceRuleScore(')))+
 'return examSuggested')();
const eligible=all.filter(q=>q.standalone!==false&&!q.sourceFirst);
for(const q of eligible){
 assert(q.modelAnswer,'Standalone reference answer missing for '+q.id);checks++;
 assert.equal(mark(q,q.modelAnswer).suggested,q.marks,'Reference answer loses marks: '+q.id);checks++;
 assert.equal(mark(q,'I do not know').suggested,0,'Incorrect answer credited: '+q.id);checks++;
}
const get=id=>{const q=all.find(x=>x.id===id);assert(q,id+' disappeared');return q};
function score(id,answer,value){
 const q=get(id),r=mark(q,answer);
 assert.equal(r.suggested,value,id+' with '+answer+' received '+r.suggested+', expected '+value);checks++;
}
score('aschem19p2_02_3','31.6',2);
score('aschem19p2_02_3','32',1);
score('aschem19p2_02_3','21',0);
score('aschem19p2_03_3','-160',3);
score('aschem19p2_03_3','+160',2);
score('aschem19p2_03_3','-8000',2);
score('aschem19p2_03_3','+8000',1);
score('aschem19p2_03_3','-1876',2);
score('aschem19p2_03_3','+1876',1);
score('aschem19p2_04_3','5680000000',1);
score('aschem19p2_04_3','5.68e9',2);
score('aschem19p2_04_3','5.68 × 10⁹ kg',2);
score('aschem19p2_04_3','3',0);
const curve=get('aqa_math_as22_p1_q8c');
assert(/y\s*=\s*x³/.test(curve.prompt),'Stationary-point question missing its curve');checks++;
assert(!curve.sourceFirst,'Standalone question unnecessarily source-dependent');checks++;
console.log('PASS '+checks+' original-mark, cross-paper, method-credit and context tests: '+byPaper.size+' paper groups');
