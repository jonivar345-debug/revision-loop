'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const load=x=>JSON.parse(fs.readFileSync(x,'utf8'));
const bank=load('physics_graphs_circuits_v203.json'),app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
const script=fs.readFileSync('physics-materials-divider-marking-v213.js','utf8');
assert.equal(bank.questions.length,8);
assert.equal(bank.questions.reduce((n,q)=>n+q.marks,0),67);
assert(app.includes('window.RevisionPhysicsMaterialsV213?.evaluate(q,answer)'));
assert(html.includes('physics-materials-divider-marking-v213.js?v=213'));
assert(html.indexOf('physics-materials-divider-marking-v213.js')<html.indexOf('app.js?v=203'));
assert(sw.includes("'./physics-materials-divider-marking-v213.js'"));
assert(sw.includes('v213-materials-divider-marking'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
const window={};vm.runInNewContext(script,{window});
const direct=window.RevisionPhysicsMaterialsV213?.evaluate;
assert.equal(typeof direct,'function');
const a=app.indexOf('function normalise('),b=app.indexOf('function nextSchedule(',a),
 c=app.indexOf('function evidenceRuleScore(',b),d=app.indexOf('function renderExam(',c);
assert(a>=0&&b>a&&c>b&&d>c);
const suggested=new Function('window','function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
 app.slice(a,b)+app.slice(c,d)+'return examSuggested')(window);
const ids=['task1_v203_phy_04','task1_v203_phy_05','task1_v203_phy_06','task1_v203_phy_07'];
const byId=Object.fromEntries(bank.questions.map(q=>[q.id,q]));
for(const q of bank.questions){
 assert.equal(suggested(q,q.modelAnswer).suggested,q.marks,'Model mark lost: '+q.id);
 assert.equal(direct(q,q.modelAnswer),null,'Whole model answer must keep existing marker');
}
const start=script.indexOf('const cases=')+'const cases='.length;
const end=script.indexOf(';\nfunction evaluate(',start);
assert(start>=12&&end>start);
const cases=JSON.parse(script.slice(start,end));
assert.deepEqual(Object.keys(cases),ids);
let accepted=0,rejected=0;
for(const id of ids){
 const q=byId[id];assert(q);
 for(const [index,answers] of Object.entries(cases[id].accept)){
  assert(+index>=0&&+index<q.marks);
  for(const answer of answers){
   accepted++;
   const score=suggested(q,answer);
   assert.equal(score.suggested,1,'Correct Physics answer missed: '+id+' '+answer);
   assert.equal(score.preds[+index],true,'Incorrect independent mark point: '+id+' '+answer);
   assert.equal(score.preds.filter(Boolean).length,1);
  }
 }
 for(const answer of cases[id].reject){
  rejected++;
  assert.equal(suggested(q,answer).suggested,0,'Incorrect unit/result credited: '+id+' '+answer);
 }
}
assert.equal(accepted,40);assert.equal(rejected,26);
const selectedCorrect=[
 ['task1_v203_phy_04','Total work done is 1.35 J',5],
 ['task1_v203_phy_05','Young modulus is 2.00 x 10^11 Pa',1],
 ['task1_v203_phy_06','Loaded output = 6.0 V',3],
 ['task1_v203_phy_07','LDR output in bright light is 2.86 V',5],
 ['task1_v203_phy_07','NTC resistance decreases as temperature increases',2]
];
const selectedWrong=[
 ['task1_v203_phy_04','Total work done is 1.35 N'],
 ['task1_v203_phy_05','Young modulus is 2.00 x 10^11 J'],
 ['task1_v203_phy_05','The volume is 2.10×10^-6 m'],
 ['task1_v203_phy_06','Loaded output = 6.0 A'],
 ['task1_v203_phy_07','Cool NTC output is 5.0 A'],
 ['task1_v203_phy_07','LDR resistance increases as light intensity increases']
];
for(const [id,answer,idx] of selectedCorrect){
 const r=suggested(byId[id],answer);assert.equal(r.suggested,1);assert.equal(r.preds[idx],true);
}
for(const [id,answer] of selectedWrong)
 assert.equal(suggested(byId[id],answer).suggested,0);
assert.equal(direct(bank.questions[0],'Velocity is 5 m/s'),null,'Not supposed to modify other questions');
console.log('PASS v213: 67 prior Physics model marks, 40 correct short materials/divider answers, 26 wrong units/concepts rejected, ID/progress/offline invariants');
