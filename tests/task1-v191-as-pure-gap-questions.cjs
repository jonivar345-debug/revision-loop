'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const extra=JSON.parse(fs.readFileSync('maths_as_pure_gap_challenges_v191.json','utf8'));
const bank=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const v190=JSON.parse(fs.readFileSync('maths_pure_proof_vectors_v190.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v191-school-maths-question-coverage.json','utf8'));
const script=fs.readFileSync('maths-as-pure-marking-v191.js','utf8');
const app=fs.readFileSync('app.js','utf8'),html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
assert.equal(extra.version,'v191');assert.equal(extra.questions.length,6);assert.equal(bank.questions.length,1268);
assert.equal(v190.questions.length,4);
assert.deepEqual(extra.questions.map(q=>q.marks),[4,5,5,7,5,6]);
assert.equal(extra.questions.reduce((t,q)=>t+q.marks,0),32);
assert.equal(audit.expectedMathsMockQuestionPool,138);
const known=new Set([...bank.questions,...v190.questions].map(q=>q.id));
for(const q of extra.questions){
 assert(!known.has(q.id),'Collision '+q.id);known.add(q.id);
 assert(q.subject==='Maths'&&q.level==='AS'&&q.mock===true&&q.year==='Practice');
 assert(q.sourceVerified===false&&q.verificationLevel==='original-exam-style');
 assert(q.requiresWorking===true&&q.standalone===true&&q.difficulty==='hard');
 assert(q.marks===q.markPoints.length&&q.markPointMarks.length===q.marks);
 assert(q.markPointMarks.every(n=>n===1));assert.equal(q.modelAnswer,q.markPoints.join(' '));
 assert(!/statistics|mechanics|contradiction|radians?\b|π/i.test(q.topic+' '+q.prompt));
}
assert.equal(new Set(known).size,1268+4+6);
const m=app.match(/function mockEligibleQuestion\(q\)\{[\s\S]*?\n\}/);
assert(m);
const eligible=vm.runInNewContext(m[0]+'\nmockEligibleQuestion');
assert(extra.questions.every(eligible),'All six must be first-school-mock eligible');
assert.equal([...bank.questions,...v190.questions,...extra.questions].filter(q=>q.subject==='Maths'&&eligible(q)).length,138);
assert(app.includes("'./maths_pure_proof_vectors_v190.json','./maths_as_pure_gap_challenges_v191.json'"));
assert(app.includes("window.RevisionPureMathsV191?.evaluate(q,answer)"));
assert(sw.includes("'./maths_as_pure_gap_challenges_v191.json'"));
assert(sw.includes("'./maths-as-pure-marking-v191.js'"));
assert(sw.includes('v191-as-pure-gap-bank'));
assert.match(html,/maths-as-pure-marking-v191\.js\?v=191/);
assert.match(html,/app\.js\?v=196/);
assert(html.indexOf('maths-as-pure-marking-v191.js')<html.indexOf('app.js?v=196'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
const w={};
vm.runInNewContext(script,{window:w});
assert.equal(typeof w.RevisionPureMathsV191?.evaluate,'function');
const direct=w.RevisionPureMathsV191.evaluate;
const a=app.indexOf('function normalise('),mid=app.indexOf('function nextSchedule(',a);
const b=app.indexOf('function evidenceRuleScore(',mid),e=app.indexOf('function renderExam(',b);
assert(a>=0&&mid>a&&b>mid&&e>b);
const suggested=new Function('window','function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
 app.slice(a,mid)+app.slice(b,e)+'return examSuggested')(w);
for(const q of extra.questions){
 assert.equal(direct(q,q.modelAnswer).suggested,q.marks,'Direct full-solution mark '+q.id);
 assert.equal(suggested(q,q.modelAnswer).suggested,q.marks,'App full-solution mark '+q.id);
 assert.equal(suggested(q,'').suggested,0);
 assert.equal(suggested(q,'not sure').suggested,0);
 assert.equal(suggested(q,'hello').suggested,0);
}
const [proof,trig,circle,transform,binomial,area]=extra.questions;
const singleMarks=[
 [proof,'n = -3, -2, -1, 0, 1, 2, 3'],
 [proof,'The results are -24, -6, 0'],
 [trig,'sin²θ=1−cos²θ'],
 [trig,'theta=240°,120°,0°'],
 [circle,'3x+4y−26=0'],
 [transform,'reflect in the x-axis'],
 [transform,'up 1'],
 [binomial,'80a²'],
 [binomial,'a²=9 and a=±3'],
 [area,'total area =4']
];
for(const [q,ans] of singleMarks)
 assert.equal(suggested(q,ans).suggested,1,'Single justified mark '+q.id+': '+ans);
assert.equal(suggested(trig,'theta=0°,120°,240°,90°').suggested,0);
assert.equal(suggested(trig,'theta=0°,120°').suggested,0);
assert.equal(suggested(transform,'shift 3 left').suggested,0);
assert.equal(suggested(circle,'3x+4y−24=0').suggested,0);
assert.equal(suggested(binomial,'x⁴ coefficient 800').suggested,0);
assert.equal(suggested(area,'total area = -4').suggested,0);
assert.equal(suggested(area,'total area =4').suggested,1);
console.log('PASS v191: six AS Pure original questions (32 marks), 138-question mock pool, accurate individual method marking, unchanged core bank');
