/* 63 original AQA-style exam question extensions: ensure complete and coherent
   answers, correct topic mapping, no duplicate prompts and no false paper claims. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const main=read('exam_questions.json').questions;
const older=read('paper_supplement_2016_2017.json').questions;
const files=['gap_questions_physics_v48.json','gap_questions_chemistry_v48.json','gap_questions_maths_v48.json'];
const additions=files.flatMap(f=>read(f).questions);
const all=[...main,...older,...additions];
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const score=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
 app.slice(app.indexOf('function normalise('),app.indexOf('function nextSchedule('))+
 app.slice(app.indexOf('function examSuggested('),app.indexOf('function renderExam(',app.indexOf('function examSuggested(')))+
 'return examSuggested')();
const normalized=t=>String(t).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const topics=Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,new Set(main.filter(q=>q.subject===s).map(q=>q.revisionTopic))]));
const ids=new Set(),prompts=new Set(),tallies={Physics:0,Chemistry:0,Maths:0};
for(const q of all){
 assert(!ids.has(q.id),'Duplicate ID '+q.id);ids.add(q.id);
}
let checks=0;
for(const q of additions){
 assert(topics[q.subject].has(q.revisionTopic),'Invalid topic '+q.id);checks++;
 assert.equal(q.marks,4,'Each new question includes four independent marking points '+q.id);checks++;
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
 const swapped={...q,markPoints:[...q.markPoints].reverse()};assert(swapped.markPoints.length===4);checks++;
 tallies[q.subject]++;
}
assert.deepEqual(tallies,{Physics:20,Chemistry:20,Maths:23},'Question batch size');
assert.equal(additions.length,63);
const numeric=[
 ['Young modulus',32*1.5/(Math.PI*(0.0002**2)*0.0019),2.01e11,0.02],
 ['Energy efficiency',(360*9.81*7.5/45)/950,0.620,0.01],
 ['Thermistor divider',12*4/(8+4),4,0.001],
 ['Half life',Math.log(2)/.18,3.85,.01],
 ['Newton Raphson',1.5-.875/5.75,1.3478,.0001],
 ['Binomial probability',190*.08**2*.92**18,.271,.006],
 ['Normal 90th percentile',510+1.282*9,521.5,.05],
 ['Centripetal force',.75*(2*Math.PI*2.4)**2*.65,111,.02],
 ['Weak acid pH',-Math.log10(Math.sqrt(1.8e-5*.08)),2.92,.01]
];
for(const [name,got,want,relative] of numeric){
 assert(Math.abs(got-want)<=Math.max(Math.abs(want)*relative,.0001),name+' incorrect model value '+got);checks++;
}
console.log('PASS '+checks+' original question structure, teacher-style marking, topic mapping and independent calculations');
