'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const qs=JSON.parse(fs.readFileSync('maths_pure_proof_vector_applications_v209.json','utf8')).questions;
const moduleText=fs.readFileSync('maths-as-pure-marking-v209.js','utf8');
const app=fs.readFileSync('app.js','utf8'),sw=fs.readFileSync('sw.js','utf8'),html=fs.readFileSync('index.html','utf8');
const window={};vm.runInNewContext(moduleText,{window});
const direct=window.RevisionPureMathsV209.evaluate;
const a=app.indexOf('function normalise('),b=app.indexOf('function nextSchedule(',a);
const c=app.indexOf('function evidenceRuleScore(',b),d=app.indexOf('function renderExam(',c);
assert(a>=0&&b>a&&c>b&&d>c);
const marker=new Function('window','function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
 app.slice(a,b)+app.slice(c,d)+'return examSuggested')(window);
assert(html.includes('maths-as-pure-marking-v209.js?v=212'));
assert(sw.includes('v212-pure-proof-vectors-equivalent-marking'));
assert(app.includes("'./maths_pure_proof_vector_applications_v209.json'"));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
for(const q of qs){
 assert.equal(direct(q,q.modelAnswer).suggested,q.marks,'Full model lost marks: '+q.id);
 assert.equal(marker(q,q.modelAnswer).suggested,q.marks,'App full model lost marks: '+q.id);
}
const positive=[
 [0,'n(n−1)(n+1) includes an even integer',1],
 [0,'n(n−1)(n+1) includes a multiple of 3',1],
 [0,'n⁵−n=n(n−1)(n+1)(n²+1)',1],
 [1,'17²=289',1],
 [1,'n=16 gives 289=17²',3],
 [1,'n=16',1],
 [1,'n²+n=n(n+1) is even',1],
 [2,'The unit vector is (0.6,0.8)',1],
 [2,'The unit vector is (3/5,4/5)',1],
 [2,'k=7',1],
 [3,'|PQ|=√(58.5)',1],
 [3,'|PQ|=sqrt(117/2)',1],
 [3,'|PQ|=3√26/2',1],
 [4,'x=-2±√5.5',1],
 [4,'x=-2±√(5.5)',1],
 [4,'x=-2±sqrt(5.5)',1],
 [4,'x=-2±√22/2',1],
 [4,'The x intercepts are -2+√5.5 and -2-√5.5',1],
 [4,'g(0)=-3',1],
 [4,'Stretch vertically by a factor of 2',1]
];
const negative=[
 [1,'The counterexample is not n=16'],
 [1,'n=16 is not a counterexample'],
 [2,'The unit vector is not (3/5,4/5)'],
 [2,'The unit vector is not (0.6,0.8)'],
 [2,'k=7 is wrong'],
 [3,'|PQ|=2√26'],
 [3,'The length PQ is not √(58.5)'],
 [4,'Do not stretch vertically by factor 2'],
 [4,'Turning point is not (-2,-11)'],
 [4,'The x intercepts are not -2+√5.5 and -2-√5.5'],
 [4,'x=-2±√5.6']
];
for(const [index,answer,score] of positive){
 const actual=marker(qs[index],answer);
 assert.equal(actual.suggested,score,'Equivalent Maths result not credited: '+answer);
 assert.equal(actual.preds.filter(Boolean).length,score);
}
for(const [index,answer] of negative){
 const actual=marker(qs[index],answer);
 assert.equal(actual.suggested,0,'Negated or wrong Maths statement credited: '+answer);
}
assert.equal(positive.length,20);assert.equal(negative.length,11);
assert.equal(direct({id:'some_other_question',markPoints:['x'],marks:1},'x'),null);
console.log('PASS v212: 5 AS Pure models retain 38/38; 20 equivalent answer cases and 11 negation/wrong-answer cases; school mock/progress preserved');
