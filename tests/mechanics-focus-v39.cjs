'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const bank=read('mechanics_focus_v39.json');
const deck=read('deck.json');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
assert.equal(bank.questions.length,16,'The 16 independently authored questions must remain present');
assert.equal(bank.questions.reduce((n,q)=>n+q.marks,0),118,'The questions must total 118 marks');
assert(deck.deckVersion>=39,'The mechanics-focused deck must be version 39 or newer');
assert(deck.cards.length>=767,'Do not remove existing revision cards');
assert.equal(deck.cards.filter(c=>c.id.startsWith('phy_focus_v39_')).length,10,'Ten targeted conceptual flashcards');
assert(app.includes("'./mechanics_focus_v39.json'"),'Website must fetch the new bank');
assert(app.includes('q.graphSpec?examGraphDiagram(q.graphSpec)'), 'Exam graphs must be rendered');
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"),'Do not silently reset existing study progress');
new Function(app); // Compile only: never run the browser application in Node.
const eligibleTopics=new Set(deck.cards.filter(c=>c.subject==='Physics').map(c=>c.revisionTopic||c.topic));
const ids=new Set();
const scoreStart=app.indexOf('function evidenceRuleScore(');
const scoreEnd=app.indexOf('function renderExam(',scoreStart);
assert(scoreStart>=0&&scoreEnd>scoreStart,'Scoring function locations must still be present');
const scoreSource='function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
 app.slice(app.indexOf('function normalise('),app.indexOf('function nextSchedule('))+
 app.slice(scoreStart,scoreEnd)+'\nreturn examSuggested;';
const score=new Function(scoreSource)();
let chartCount=0,checks=0;
for(const q of bank.questions){
 assert(!ids.has(q.id),'Duplicate ID: '+q.id);ids.add(q.id);
 assert.equal(q.subject,'Physics');
 assert.equal(q.level,'AS');
 assert.equal(q.year,'Practice','Do not claim original questions are real AQA past-paper items');
 assert.equal(q.sourceVerified,false);
 assert.equal(q.verificationLevel,'original-exam-style');
 assert.equal(q.standalone,true);
 assert.equal(q.difficulty,'stretch');
 assert(q.marks>=5 && q.marks<=10,'Extended questions must carry a realistic number of marks');
 assert(eligibleTopics.has(q.revisionTopic),'Exam topic must be selectable: '+q.revisionTopic);
 assert.equal(q.markPoints.length,q.marks);
 assert.equal(q.markPointMarks.reduce((a,b)=>a+b,0),q.marks);
 assert(q.prompt.length>200 && q.modelAnswer.length>60,'Question and solution must be self-contained');
 assert.equal(score(q,q.modelAnswer).suggested,q.marks,'Full model answer must receive full marks: '+q.id);
 assert.equal(score(q,'I have no idea.').suggested,0,'Empty knowledge must not earn marks: '+q.id);
 if(q.graphSpec){
  chartCount++;
  const g=q.graphSpec;
  assert(g.xStep>0&&g.yStep>0 && g.xMax>g.xMin && g.yMax>g.yMin,'Invalid graph axes '+q.id);
  assert(g.points.length>=2,'Graph must have data '+q.id);
  assert(g.points.every(p=>p.length===2 && p.every(Number.isFinite)&&p[0]>=g.xMin&&p[0]<=g.xMax&&p[1]>=g.yMin&&p[1]<=g.yMax),'Graph points outside axes '+q.id);
 }
 checks+=17;
}
assert.equal(chartCount,7);
const close=(a,b,tolerance)=>assert(Math.abs(a-b)<tolerance,a+' ≠ '+b);
close((10-(-6))/4,4,1e-9); // Q1 signed gradient
close(0.5*1.5*6+0.5*2.5*10+30+2*(0.5*2.5*10),72,1e-9); // Q1 distance
const g=9.81,theta=35*Math.PI/180,uy=20*Math.sin(theta),t=(uy+Math.sqrt(uy**2+2*g*18))/g;
close(t,3.41373,0.0001); // Q6 projectile positive root
close(20*Math.cos(theta)*t,55.9273,0.001); // Q6 horizontal range
const normal=8*g*Math.cos(25*Math.PI/180)-70*Math.sin(20*Math.PI/180);
close(normal,47.1856,0.001); // Q4 reaction with angled pull
close((70*Math.cos(20*Math.PI/180)-8*g*Math.sin(25*Math.PI/180)-.15*normal)/8,3.19169,0.001);
console.log('PASS Mechanics v39: '+checks+' structure/marking checks, 7 labelled graphs, 10 flashcards, numeric answers');
