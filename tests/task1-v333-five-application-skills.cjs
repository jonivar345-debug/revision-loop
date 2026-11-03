'use strict';
// Five manually marked original exam-style applications added after the existing v313 bank.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),bank=j('science_application_gaps_v333.json');
const practicePaths=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert.equal(bank.version,'v333');
assert.equal(practicePaths.length,46);
assert.equal(practicePaths[44],'science_practical_diagram_applications_v313.json');
assert.equal(practicePaths[45],'science_application_gaps_v333.json');
assert(sw.includes("'./science_application_gaps_v333.json'"),'Offline installation must preload new practice bank');
assert(sw.includes('-v333-36-mark-application-practice'));
const oldBank=j('science_practical_diagram_applications_v313.json');
assert.equal(oldBank.questions.length,8,'Never rewrite original v313 practice questions');
assert.equal(bank.questions.length,5);
assert.equal(new Set(bank.questions.map(q=>q.id)).size,5);
const existing=j('exam_questions.json').questions.concat(practicePaths.slice(0,45).flatMap(p=>j(p).questions||[]));
const oldIds=new Set(existing.map(q=>q.id));
assert.equal(existing.length,new Set(existing.map(q=>q.id)).size,'No previously duplicated exam-question progress IDs');
const all=existing.concat(bank.questions);
assert.equal(all.length,existing.length+5);
assert.equal(new Set(all.map(q=>q.id)).size,all.length,'Every previous exam-question ID remains stable');
const eligibleStart=app.indexOf('function mockEligibleQuestion(q){');
const eligibleEnd=app.indexOf('function startMockSession(){',eligibleStart);
assert(eligibleStart>=0&&eligibleEnd>eligibleStart);
const eligible=new Function(app.slice(eligibleStart,eligibleEnd)+'\nreturn mockEligibleQuestion;')();
const es=app.indexOf('function examSuggested(q,answer){'),ee=app.indexOf(' // v213:',es);
assert(es>=0&&ee>es);
const suggest=new Function('window',app.slice(es,ee)+'\n}\nreturn examSuggested;')({});
const expectedIds=['task1_v333_phy_01','task1_v333_chem_01','task1_v333_chem_02','task1_v333_chem_03','task1_v333_chem_04'];
assert.deepEqual(bank.questions.map(q=>q.id),expectedIds);
const expectedSkills=['v332_P24','v332_C10_C14','v332_C22','v332_K07','v332_K12'];
assert.deepEqual(bank.questions.map(q=>q.skillId),expectedSkills);
let marks=0,phy=0,chem=0;
for(const q of bank.questions){
 assert(!oldIds.has(q.id),'Never overwrite existing question '+q.id);
 assert.equal(q.mock,true);
 assert.equal(q.taught,true);
 assert.equal(q.standalone,true);
 assert.equal(q.requiresWorking,true);
 assert.equal(q.manualWorkingReview,true,'Complex calculations and experimental design must be manually checked');
 assert.equal(q.sourceVerified,false,'Original, not copied from official exam');
 assert.equal(q.verificationLevel,'original-exam-style');
 assert.equal(q.groupId,q.id);
 assert(q.prompt.endsWith('['+q.marks+' marks]'));
 assert.equal(q.markPoints.length,q.marks,'Exactly one independently marked criterion for each mark');
 assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 assert(q.markPoints.every(s=>s.length>=20));
 assert(q.modelAnswer.length>150,'A full worked model belongs on an exam practice question, never a flashcard');
 assert(eligible(q),'Question must be selectable in the actual school mock '+q.id);
 if(q.subject==='Physics'){phy++;assert.equal(q.level,'AS');assert.equal(q.specRef,'3.1.3');}
 else {chem++;assert.equal(q.level,'A2');assert(['3.1.9.1','3.1.9.2','3.1.10'].includes(q.specRef));}
 for(const answer of [q.modelAnswer,'wrong sentence','not '+q.modelAnswer,'']){
  const result=suggest(q,answer);
  assert.equal(result.manualRequired,true,'Must not imply full automatic confidence');
  assert.equal(result.suggested,0,'Never award automatic keywords for manual application '+q.id);
  assert.deepEqual(result.preds,Array(q.marks).fill(false));
  assert.deepEqual(result.scores,Array(q.marks).fill(0));
 }
 marks+=q.marks;
}
assert.equal(marks,36);
assert.equal(phy,1);assert.equal(chem,4);
const near=(a,b,eps=1e-6)=>Math.abs(a-b)<eps;
assert(near(20*.150,3));
assert(near(60*9.8*3,1764));
assert(near(1764/12,147));
const Ea=74000,R=8.31,A=1.20e11,k320=A*Math.exp(-Ea/(R*320)),k340=A*Math.exp(-Ea/(R*340));
assert(near(k320,.0985530210));
assert(near(k340,.5065034073));
assert(near(k340/k320,5.13940011));
const x=1/Math.sqrt(17),pA=200*(1-x)/(1+x),pB=400*x/(1+x);
assert(near(x,.2425356250));
assert(near(pA,121.9223594));
assert(near(pB,78.0776406));
assert(near(pB*pB/pA,50.0));
const v332=j('editorial/task1-v332-measurements-rates-kp-crosswalk.json');
assert.equal(v332.rows.length,59);
assert.equal(v332.rows.filter(r=>r.status==='partial_application').length,6,'Practice exists but skill mastery remains unverified');
for(const s of expectedSkills){
 const ids=s==='v332_C10_C14'?['C10','C14']:[s.replace('v332_','')];
 for(const id of ids)assert(v332.rows.some(r=>r.id===id&&r.status==='partial_application'),'Target application requirement must remain honest '+id);
}
assert(app.includes("science_application_gaps_v333.json"));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key),'No changes to saved flashcard progress');
console.log('PASS v333: 5 original multi-mark Physics/Chemistry mock applications, '+marks+' independently checked manual mark points, 46 practice banks, original 8 v313 tasks untouched, 5 production manual-marker guard checks and numerical solutions independently verified.');
