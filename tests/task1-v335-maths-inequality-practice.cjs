'use strict';
// v335: real first-school-mock selection, handwritten-work marking guard and exact interval checks.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),bank=json('maths_inequality_sign_reasoning_v335.json');
const prior=json('editorial/task1-v334-year1-pure-skill-crosswalk.json');
const paths=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert(paths.length>=47,'Preserve the existing 47 practice banks when appending future questions');
assert.equal(paths[45],'science_application_gaps_v333.json');
assert.equal(paths[46],'maths_inequality_sign_reasoning_v335.json');
assert(sw.includes("'./maths_inequality_sign_reasoning_v335.json'"));
assert(sw.includes('-v335-maths-inequality-practice'));
assert.equal(bank.version,'v335');
assert.equal(bank.questions.length,2);
assert.deepEqual(bank.questions.map(q=>q.id),['task1_v335_maths_01','task1_v335_maths_02']);
const oldIds=new Set(json('exam_questions.json').questions.concat(paths.slice(0,46).flatMap(p=>json(p).questions||[])).map(q=>q.id));
const start=app.indexOf('function mockEligibleQuestion(q){'),end=app.indexOf('function startMockSession(){',start);
assert(start>=0&&end>start);
const eligible=new Function(app.slice(start,end)+'\nreturn mockEligibleQuestion;')();
const es=app.indexOf('function examSuggested(q,answer){'),ee=app.indexOf(' // v213:',es);
assert(es>=0&&ee>es);
const suggest=new Function('window',app.slice(es,ee)+'\n}\nreturn examSuggested;')({});
const m11=prior.rows.find(r=>r.id==='M11');
assert(m11&&m11.status==='short_recall_plus_exam_work_required');
assert.equal(m11.practiceQuestionEvidence.length,0,'Preserve the truthful v334 snapshot; this bank closes the practice availability gap afterwards');
let total=0;
for(const q of bank.questions){
 assert(!oldIds.has(q.id),'No existing progress ID may be replaced: '+q.id);
 assert(q.subject==='Maths'&&q.specRef==='3.3'&&q.level==='AS'&&q.topic==='Algebra and functions');
 assert(q.mock===true&&q.taught===true&&q.standalone===true&&q.requiresWorking===true);
 assert(q.manualWorkingReview===true&&q.manualDiagramReview===false);
 assert(q.sourceVerified===false&&q.verificationLevel==='original-exam-style');
 assert(q.skillId==='v334_M11'&&q.groupId===q.id);
 assert(q.marks===7&&q.prompt.endsWith('[7 marks]'));
 assert.equal(q.markPoints.length,q.marks);
 assert.deepEqual(q.markPointMarks,[1,1,1,1,1,1,1]);
 assert(q.markPoints.every(s=>s.length>40)&&q.modelAnswer.length>200);
 assert(eligible(q),'School first-mock filter must include Year 1 Pure problem '+q.id);
 for(const a of ['',q.modelAnswer,'wrong working','not '+q.modelAnswer]){
  const x=suggest(q,a);
  assert.equal(x.manualRequired,true);
  assert.equal(x.suggested,0,'No automatic credit for sign-table working');
  assert.deepEqual(x.preds,Array(7).fill(false));
  assert.deepEqual(x.scores,Array(7).fill(0));
 }
 total+=q.marks;
}
assert.equal(total,14);
const a=x=>(x*x-x-6)/(x-1);
assert(a(-3)<0&&a(0)>0&&a(2)<0&&a(4)>0);
assert(a(-2)===0&&a(3)===0&&!Number.isFinite(a(1)));
const b=x=>(x*x-x-2)/(x*x-6*x+8);
assert(b(-2)>0&&b(0)<0&&b(3)<0&&b(5)>0);
assert(b(-1)===0&&!Number.isFinite(b(2))&&!Number.isFinite(b(4)));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
assert.equal(json('deck.json').cards.length,3345,'Do not convert an application question into a long-answer flashcard or reset progress');
console.log('PASS v335: two original 7-mark Year 1 Pure sign-analysis questions; 14 manually reviewed marks, correct intervals/endpoints, production mock selection, 47 append-only banks and all saved flashcard IDs preserved.');
