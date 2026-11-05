'use strict';
// v342 original worked AS Physics particle questions; never long-form flashcards.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),bank=j('physics_particles_three_application_gaps_v342.json');
assert.equal(bank.version,'v342');assert.equal(bank.questions.length,3);
const paths=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
assert(paths.length>=50,'Original 49 practice banks cannot be removed');
assert.equal(paths[47],'chemistry_atom_economy_sustainability_practice_v338.json');
assert.equal(paths[48],'maths_year1_pure_targeted_practice_v340.json');
assert.equal(paths[49],'physics_particles_three_application_gaps_v342.json');
assert(sw.includes("'./physics_particles_three_application_gaps_v342.json'"));
assert(sw.includes('-v342-three-physics-particles-applications'));
const oldQuestions=[...j('exam_questions.json').questions,...paths.slice(0,49).flatMap(path=>j(path).questions||[])];
const oldIds=new Set(oldQuestions.map(q=>q.id));
const start=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),end=app.indexOf('function startMockSession(){',start);
assert(start>=0&&end>start);
const eligible=new Function(app.slice(start,end)+'\nreturn mockEligibleQuestion;')();
const ms=app.indexOf('function examSuggested(q,answer){'),me=app.indexOf(' // v213:',ms);
assert(ms>=0&&me>ms);
const scoring=new Function('window',app.slice(ms,me)+'\n}\nreturn examSuggested;')({});
const ids=new Set(),specs=[],skills=[],marks=[];
for(const q of bank.questions){
 assert(!oldIds.has(q.id)&&!ids.has(q.id),'Old user progress ID reused '+q.id);ids.add(q.id);
 assert.equal(q.subject,'Physics');assert.equal(q.level,'AS');assert.equal(q.mock,true);assert.equal(q.taught,true);
 assert.equal(q.standalone,true);assert.equal(q.requiresWorking,true);
 assert.equal(q.manualWorkingReview,true);assert.equal(q.manualDiagramReview,false);
 assert.equal(q.sourceVerified,false);assert.equal(q.verificationLevel,'original-exam-style');
 assert(q.prompt.endsWith('['+q.marks+' marks]'));
 assert(q.modelAnswer.length>=400);assert.equal(q.markPoints.length,q.marks);
 assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 assert(q.markPoints.every(s=>s.length>=40),'Mark scheme needs independent clear points '+q.id);
 assert(eligible(q),'Physics AS question excluded from first school mock '+q.id);
 for(const answer of ['',q.modelAnswer,'not '+q.modelAnswer,'the answer is 0.100 nm','I do not know']){
  const m=scoring(q,answer);
  assert.equal(m.manualRequired,true,'Must require actual marking of written working '+q.id);
  assert.equal(m.suggested,0,'No automatic keyword marks '+q.id);
  assert.deepEqual(m.scores,Array(q.marks).fill(0));
  assert.deepEqual(m.preds,Array(q.marks).fill(false));
 }
 specs.push(q.specRef);skills.push(q.skillId);marks.push(q.marks);
}
assert.deepEqual(specs,['3.2.1.1','3.2.2.3','3.2.2.4']);
assert.deepEqual(marks,[6,7,7]);assert.equal(marks.reduce((a,b)=>a+b),20);
assert.deepEqual(skills,['v263_ParticlesRequirement06','v263_ParticlesRequirement44','v263_ParticlesRequirement48']);
const near=(v,expected,rel=1e-9)=>assert(Math.abs(v-expected)<=Math.abs(expected)*rel,'Calculation mismatch: '+v+' != '+expected);
const mass=24*1.66e-27,ionQ=2*1.60e-19,nucQ=12*1.60e-19;
near(mass,3.984e-26);near(ionQ/mass,8.032128514056225e6);near(nucQ/mass,4.819277108433735e7);
const h=6.63e-34,e=1.60e-19,c=3.00e8,dE=(3.40-1.51)*e;
near(dE,3.024e-19);near(dE/h,4.561085972850679e14);near(h*c/dE,6.577380952380952e-7);
const electronMass=9.11e-31,V=150,p=Math.sqrt(2*electronMass*e*V),lambda=h/p;
near(p,6.612715024859305e-24);near(lambda,1.0026138998997712e-10);near(lambda/2,5.013069499498856e-11);
assert(bank.questions[0].modelAnswer.includes('8.03×10⁶')&&bank.questions[0].modelAnswer.includes('4.82×10⁷'));
assert(bank.questions[1].modelAnswer.includes('658 nm'));
assert(bank.questions[2].modelAnswer.includes('0.0501 nm'));
assert.equal(j('deck.json').cards.length,3345,'No long written answers in original flashcard deck');
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k),'User progress key changed');
console.log('PASS v342: 3 original 20-mark AQA Physics applications in selected first mock, three numerical derivations verified, 49 prior banks and progress IDs unchanged, actual marker always demands human review.');
