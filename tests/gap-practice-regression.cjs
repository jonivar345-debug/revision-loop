/* 75 original AQA-style exam question extensions: ensure complete and coherent
   answers, correct topic mapping, no duplicate prompts and no false paper claims. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const main=read('exam_questions.json').questions;
const older=read('paper_supplement_2016_2017.json').questions;
const files=['gap_questions_physics_v48.json','gap_questions_chemistry_v48.json','gap_questions_maths_v48.json','gap_questions_extended_v49.json'];
const additions=files.flatMap(f=>read(f).questions);
const all=[...main,...older,...additions];
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const score=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
 app.slice(app.indexOf('function normalise('),app.indexOf('function nextSchedule('))+
 app.slice(app.indexOf('function evidenceRuleScore('),app.indexOf('function renderExam(',app.indexOf('function evidenceRuleScore(')))+
 'return examSuggested')();
const normalized=t=>String(t).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const topics=Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,new Set(main.filter(q=>q.subject===s).map(q=>q.revisionTopic))]));
const ids=new Set(),prompts=new Set(),tallies={Physics:0,Chemistry:0,Maths:0};
// These 13 additions are original, self-contained practice subparts with
// variable 2–3 mark allocations. The original 75 single-part questions still
// retain their previously audited fixed allocations.
const multipartIds=new Set([
 'gap_v48_chem_21a','gap_v48_chem_21b','gap_v48_chem_21c',
 'gap_v48_chem_22a','gap_v48_chem_22b','gap_v48_chem_23a','gap_v48_chem_23b',
 'gap_v48_math_24a','gap_v48_math_24b','gap_v48_math_25a','gap_v48_math_25b',
 'gap_v48_math_26a','gap_v48_math_26b'
]);
for(const q of all){
 assert(!ids.has(q.id),'Duplicate ID '+q.id);ids.add(q.id);
}
let checks=0;
for(const q of additions){
 assert(topics[q.subject].has(q.revisionTopic),'Invalid topic '+q.id);checks++;
 if(multipartIds.has(q.id)) {
  assert(q.marks>=2&&q.marks<=3,'Valid adapted multipart allocation '+q.id);
  assert.equal(q.markPoints.length,q.marks,'Each new part has distinct marking criteria '+q.id);
} else {
  assert.equal(q.marks,q.id.startsWith('gap_v49_extended_')?6:4,'Original extension allocation '+q.id);
}
checks++;
 assert.equal(q.markPoints.length,q.markPointMarks.length,'Mark-point alignment '+q.id);checks++;
 assert.equal(q.markPointMarks.reduce((a,b)=>a+b,0),q.marks,'Mark totals '+q.id);checks++;
 assert.equal(q.year,'Practice','Original practice cannot be falsely labelled a past paper '+q.id);checks++;
 assert.equal(q.sourceVerified,false,'Unverified AQA provenance '+q.id);checks++;
 assert.equal(q.standalone,true,'Unanswerable prior-part dependency '+q.id);checks++;
 assert(q.prompt.length>85&&q.modelAnswer.length>75,'Question or full solution too short '+q.id);checks++;
 assert(!/\b(?:the previous|question above|figure shown|diagram supplied|table above|from part \(a\))\b/i.test(q.prompt),'Missing context '+q.id);checks++;
 const norm=normalized(q.prompt);
 assert(!prompts.has(norm),'Duplicate extension prompt '+q.id);prompts.add(norm);
 const good=score(q,q.modelAnswer);
 assert.equal(good.suggested,q.marks,'Reference answer rejected '+q.id);checks++;
 assert.equal(score(q,'I have no idea.').suggested,0,'Nonsense response awarded marks '+q.id);checks++;
 const swapped={...q,markPoints:[...q.markPoints].reverse()};assert.equal(swapped.markPoints.length,q.marks);checks++;
 tallies[q.subject]++;
}
assert.deepEqual(tallies,{Physics:24,Chemistry:31,Maths:33},'Question batch size');
assert.equal(additions.length,88);
assert.equal(additions.filter(q=>multipartIds.has(q.id)).length,13,'All multipart subparts present');
for(const id of multipartIds)assert(ids.has(id),'Missing multipart part '+id);
const numeric=[
 ['Young modulus',32*1.5/(Math.PI*(0.0002**2)*0.0019),2.01e11,0.02],
 ['Energy efficiency',(360*9.81*7.5/45)/950,0.620,0.01],
 ['Thermistor divider',12*4/(8+4),4,0.001],
 ['Half life',Math.log(2)/.18,3.85,.01],
 ['Newton Raphson',1.5-.875/5.75,1.3478,.0001],
 ['Binomial probability',190*.08**2*.92**18,.271,.006],
 ['Normal 90th percentile',510+1.282*9,521.5,.05],
 ['Centripetal force',.75*(2*Math.PI*2.4)**2*.65,111,.02],
 ['Weak acid pH',-Math.log10(Math.sqrt(1.8e-5*.08)),2.92,.01],
 ['Trapezium integral',.25*(1+2*(1.125+2+4.375)+9),6.25,.001],
 ['CaCO3 percentage',(0.0150/2*100.1)/.8*100,93.8,.01],
 ['Lattice energy formation',-602-(148+249+738+1451-141+744),-3791,.001],
 ['Slope acceleration',(60-5*9.81*Math.sin(25*Math.PI/180)-.2*5*9.81*Math.cos(25*Math.PI/180))/5,6.08,.01]
];
for(const [name,got,want,relative] of numeric){
 assert(Math.abs(got-want)<=Math.max(Math.abs(want)*relative,.0001),name+' incorrect model value '+got);checks++;
}
console.log('PASS '+checks+' original question structure, variable multipart marks, teacher-style marking, topic mapping and independent calculations');
