'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const load=path=>JSON.parse(fs.readFileSync(path,'utf8'));
const bank=load('physics_graphs_circuits_v203.json'),app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
const source=fs.readFileSync('physics-concise-marking-v211.js','utf8');
assert.equal(bank.questions.length,8);
assert.equal(bank.questions.reduce((n,q)=>n+q.marks,0),67);
assert(app.includes('window.RevisionPhysicsConciseV211?.evaluate(q,answer)'));
assert(html.includes('physics-concise-marking-v211.js?v=211'));
assert(html.indexOf('physics-concise-marking-v211.js')<html.indexOf('app.js?v=203'));
assert(sw.includes("'./physics-concise-marking-v211.js'"));
assert(sw.includes('v211-physics-concise-calibration'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
const window={};vm.runInNewContext(source,{window});
const calibrated=window.RevisionPhysicsConciseV211?.evaluate;
assert.equal(typeof calibrated,'function');
const p=app.indexOf('function normalise('),q=app.indexOf('function nextSchedule(',p),
 r=app.indexOf('function evidenceRuleScore(',q),s=app.indexOf('function renderExam(',r);
assert(p>=0&&q>p&&r>q&&s>r);
const suggested=new Function('window','function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+app.slice(p,q)+app.slice(r,s)+'return examSuggested')(window);
for(const question of bank.questions){
 const result=suggested(question,question.modelAnswer);
 assert.equal(result.suggested,question.marks,'Lost model marks '+question.id);
 assert.equal(result.preds.filter(Boolean).length,question.marks);
}
const questions=Object.fromEntries(bank.questions.map(item=>[item.id,item]));
const cases={
 task1_v203_phy_01:{
  accept:[
   ['Displacement at 2 s is 6 m',0],
   ['The displacement at 4s is 20m',1],
   ['The average velocity is 5 m/s',2],
   ['Average velocity = 5 m/s',2],
   ['The tangent gradient is 5 m/s',3],
   ['Tangent slope is 5 m/s',3],
   ['The instantaneous velocity at 2s is 5 m/s',4],
   ['The instantaneous velocity is 5 m/s',4],
   ['The acceleration is 2 m/s^2',5],
   ['Acceleration is 2 m/s^2',5]
  ],
  reject:[
   'Acceleration is -2 m/s^2',
   'The acceleration is -2 m/s^2',
   'The acceleration is 2 m/s',
   'The tangent gradient is 5 m/s^2',
   'The instantaneous velocity is 5 m/s^2',
   'The average velocity is not 5 m/s'
  ]
 },
 task1_v203_phy_03:{
  accept:[
   ['The velocity at 3s is 8 m/s',1],
   ['The velocity at 5s is 2 m/s',3],
   ['Overall change in velocity is 0 m/s',5],
   ['The total displacement is 27 m',6],
   ['Displacement is 27 m',6],
   ['Area under an acceleration-time graph gives change in velocity, not displacement',7],
   ['Acceleration-time graph area is the change in velocity',7]
  ],
  reject:[
   'Area under acceleration time is displacement',
   'Area under acceleration-time graph is displacement',
   'Acceleration-time graph area is displacement',
   'The total displacement is -27 m',
   'The velocity at 3s is -8 m/s',
   'The velocity at 5s is -2 m/s'
  ]
 },
 task1_v203_phy_08:{
  accept:[
   ['The gradient is -0.5 V/A',0],
   ['The internal resistance is 0.5 ohm',1],
   ['Internal resistance is 0.5 Ω',1],
   ['The emf is 1.5 V',2],
   ['The cell emf is 1.5 volts',2],
   ['The circuit current is 0.6 A',3],
   ['Terminal voltage is 1.2 V',4],
   ['The lost volts are 0.3 V',5],
   ['The lost voltage is 0.3 V',5],
   ['External power is 0.72 W',6],
   ['Internal heating power is 0.18 W',7],
   ['Total chemical power is 0.9 W',8]
  ],
  reject:[
   'The lost volts are 2.0 J',
   'The lost volts are 0.3 J',
   'The internal resistance is -0.5 ohm',
   'The emf is 6 V',
   'Internal heating power is 0.18 J',
   'The gradient is +0.5 V/A'
  ]
 }
};
let accepted=0,rejected=0;
for(const [id,cs] of Object.entries(cases)){
 const question=questions[id];assert(question,'Missing question '+id);
 for(const [answer,index] of cs.accept){
  const marks=suggested(question,answer);
  accepted++;
  assert.equal(marks.suggested,1,'Correct short Physics answer missed: '+id+' '+answer);
  assert.equal(marks.preds[index],true,'Wrong mark point for: '+id+' '+answer);
  assert.equal(marks.preds.filter(Boolean).length,1);
 }
 for(const answer of cs.reject){
  const marks=suggested(question,answer);
  rejected++;
  assert.equal(marks.suggested,0,'Wrong sign, unit or concept credited: '+id+' '+answer);
 }
 assert.equal(calibrated(question,question.modelAnswer),null,'Long model should use existing marker');
}
assert.equal(accepted,29);assert.equal(rejected,18);
assert.equal(calibrated(bank.questions[1],'The displacement is 5 m'),null);
console.log('PASS v211: 67 existing model marks, 29 valid short forms, 18 incorrect signs/units/concepts rejected; existing progress untouched');
