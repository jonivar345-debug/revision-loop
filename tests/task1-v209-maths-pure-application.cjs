'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=x=>JSON.parse(fs.readFileSync(x,'utf8'));
const bank=read('maths_pure_proof_vector_applications_v209.json'),main=read('exam_questions.json');
const app=fs.readFileSync('app.js','utf8'),html=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8'),moduleText=fs.readFileSync('maths-as-pure-marking-v209.js','utf8');
assert.equal(bank.version,'v209');assert.equal(bank.schemaVersion,1);
assert.equal(bank.questions.length,5);
assert.deepEqual(bank.questions.map(q=>q.marks),[7,6,8,8,9]);
assert.equal(bank.questions.reduce((n,q)=>n+q.marks,0),38);
assert.equal(main.questions.length,1268);
assert(app.includes("'./maths_pure_proof_vector_applications_v209.json'"));
assert(sw.includes("'./maths_pure_proof_vector_applications_v209.json'"));
assert(sw.includes("'./maths-as-pure-marking-v209.js'"));
assert(sw.includes('v209-maths-original-challenges'));
assert(html.includes('maths-as-pure-marking-v209.js?v=209'));
assert(html.indexOf('maths-as-pure-marking-v209.js')<html.indexOf('app.js?v=203'));
assert(app.includes('window.RevisionPureMathsV209?.evaluate(q,answer)'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
const predicate=app.match(/function mockEligibleQuestion\(q\)\{[\s\S]*?\n\}/);
assert(predicate);const eligible=vm.runInNewContext(predicate[0]+'\nmockEligibleQuestion');
const known=new Set(main.questions.map(q=>q.id));
const windowObj={};vm.runInNewContext(moduleText,{window:windowObj});
const direct=windowObj.RevisionPureMathsV209?.evaluate;
assert.equal(typeof direct,'function');
const a=app.indexOf('function normalise('),b=app.indexOf('function nextSchedule(',a);
const c=app.indexOf('function evidenceRuleScore(',b),d=app.indexOf('function renderExam(',c);
assert(a>=0&&b>a&&c>b&&d>c);
const mark=new Function('window','function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
 app.slice(a,b)+app.slice(c,d)+'return examSuggested')(windowObj);
let shortCount=0,negativeCount=0;
for(const q of bank.questions){
 assert(!known.has(q.id),'Duplicate id: '+q.id);known.add(q.id);
 assert(q.subject==='Maths'&&q.level==='AS'&&q.mock===true&&q.taught===true);
 assert(q.year==='Practice'&&q.sourceVerified===false&&q.verificationLevel==='original-exam-style');
 assert(q.requiresWorking===true&&q.standalone===true&&q.difficulty==='hard');
 assert(['3.2','3.3','3.10'].includes(q.specRef));
 assert(['Proof','Vectors','Transformations'].includes(q.topic));
 assert.equal(q.markPoints.length,q.marks);
 assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 assert.equal(q.modelAnswer,q.markPoints.join(' '));
 assert(eligible(q),'A Year 1 Pure question incorrectly excluded');
 assert.equal(direct(q,q.modelAnswer).suggested,q.marks,'Direct model missed: '+q.id);
 const model=mark(q,q.modelAnswer);
 assert.equal(model.suggested,q.marks,'App integration missed model: '+q.id);
 assert(model.preds.every(Boolean));
 for(const wrong of ['', 'not sure','I have no idea']){
  assert.equal(mark(q,wrong).suggested,0,'Unknown answer credited: '+q.id);
 }
 for(const [key,list] of Object.entries(q.reviewedShortAnswerPoints||{})){
  assert(Number.isInteger(+key)&&+key>=0&&+key<q.marks);
  for(const alternative of list){
   shortCount++;
   assert.equal(mark(q,alternative).suggested,1,'Correct short response missed: '+q.id+' '+alternative);
  }
 }
}
const rejected={
 task1_v209_maths_001:['n⁵−n is always divisible by 31.','n=0 makes n⁵−n equal 11.'],
 task1_v209_maths_002:['n=5 gives 47, which is prime.','n²+n+17 is always even.'],
 task1_v209_maths_003:['k=8','AB:BC=3:1'],
 task1_v209_maths_004:['P=(8,-1)','|PQ|=2√26'],
 task1_v209_maths_005:['The turning point is (-2,11).','The y-intercept is (0,3).']
};
for(const q of bank.questions){
 for(const wrong of rejected[q.id]){
  negativeCount++;
  assert.equal(mark(q,wrong).suggested,0,'Incorrect AS Pure result credited: '+q.id+' '+wrong);
 }
}
assert.equal(shortCount,6);assert.equal(negativeCount,10);
assert.equal(direct({id:'other_question',markPoints:['x'],marks:1},'x'),null);
console.log('PASS v209: 5 original first-mock AS Pure hard questions (38 marks), all 38 model marks, 6 reviewed short variants, 10 bad answers rejected, original bank and progress untouched');
