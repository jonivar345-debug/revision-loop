'use strict';
// v372 regression: exact five original Maths Pure applications use manual working,
// because a keyword score cannot establish a valid mathematical method.
const fs=require('node:fs'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),bank=json('maths_year1_pure_reasoning_v271.json');
const audit=json('editorial/task1-v372-year1-pure-five-manual-working-qa.json');
const core=json('deck.json');
assert.equal(core.cards.length,3345);
assert.equal(new Set(core.cards.map(c=>c.id)).size,3345);
assert.equal(audit.version,'v372');
assert.equal(bank.questions.length,7);
assert.equal(audit.selected.length,5);
assert.equal(audit.counts.additionalMarksRequiringReviewedWork,39);
assert.equal(audit.counts.totalManualWorkingMarksAfterGate,49);
assert(sw.includes('-v372-year1-manual-working'));
assert(app.includes('applyV372Year1PureManualReview(examQuestions);'));
assert(app.includes('Review maths working point by point'));
assert(app.includes('The automatic keyword checker cannot reliably verify the method'));
assert(app.includes('This is a full mathematical proof.'));
assert(app.includes('Review proof marking points manually'));
assert(app.includes('if(q.manualDiagramReview===true||q.manualWorkingReview===true){beginManualExamReview(q);return;}'));
assert(app.includes('No marks are suggested or awarded automatically here.'));
assert(app.includes('manualRequired:true'));
const p=app.indexOf('const V372_YEAR1_PURE_MANUAL=');
const end=app.indexOf('// Never alter question wording',p);
assert(p>0&&end>p);
const apply=new Function(app.slice(p,end)+'\nreturn applyV372Year1PureManualReview;')();
const src=new Map(bank.questions.map(q=>[q.id,q]));
const exact=audit.selected.map(row=>{
 const q=src.get(row.id);
 assert(q,'Missing original question');
 assert.equal(q.prompt,row.prompt);assert.equal(q.modelAnswer,row.modelAnswer);
 assert.equal(q.marks,row.marks);assert.equal(q.specRef,row.specRef);
 assert.equal(q.requiresWorking,true);assert.equal(q.manualWorkingReview,false);
 assert.deepEqual(q.markPoints,row.markPoints);assert.deepEqual(q.markPointMarks,row.markPointMarks);
 return q;
});
assert.deepEqual(exact.map(q=>q.id),[
 'task1_v271_maths_pure_q03','task1_v271_maths_pure_q04','task1_v271_maths_pure_q05',
 'task1_v271_maths_pure_q06','task1_v271_maths_pure_q07'
]);
const originalSnapshot=JSON.stringify(bank);
const questions=bank.questions.map(q=>({...q,markPoints:[...q.markPoints],markPointMarks:[...q.markPointMarks]}));
const before=new Map(questions.map(q=>[q.id,JSON.stringify(q)]));
apply(questions);
assert.equal(questions.filter(q=>q.manualWorkingReview===true).length,7);
assert.equal(questions.reduce((a,q)=>a+(q.manualWorkingReview?q.marks:0),0),49);
for(const q of questions){
 const previous=JSON.parse(before.get(q.id));
 assert.equal(q.prompt,previous.prompt);
 assert.equal(q.modelAnswer,previous.modelAnswer);
 assert.deepEqual(q.markPoints,previous.markPoints);
 assert.deepEqual(q.markPointMarks,previous.markPointMarks);
 assert.equal(q.id,previous.id);
 assert.equal(q.marks,previous.marks);
 assert.equal(q.mock,true);
 assert.equal(q.level,'AS');
 assert.equal(q.courseTopic,'Year 1 Pure');
 if(q.id.endsWith('q01')||q.id.endsWith('q02'))assert.equal(q.v372ReviewRequired,undefined);
 else assert.equal(q.v372ReviewRequired,true);
}
assert.equal(JSON.stringify(bank),originalSnapshot,'Underlying source question bank must remain unchanged');
const eligibleStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS=');
const eligibleEnd=app.indexOf('function startMockSession(){',eligibleStart);
assert(eligibleStart>0&&eligibleEnd>eligibleStart);
const eligible=new Function(app.slice(eligibleStart,eligibleEnd)+'\nreturn mockEligibleQuestion;')();
const markStart=app.indexOf('function examSuggested(q,answer){'),markEnd=app.indexOf(' // v213:',markStart);
assert(markStart>=0&&markEnd>markStart);
const suggest=new Function('window',app.slice(markStart,markEnd)+'\n}\nreturn examSuggested;')({});
let checks=0;
for(const q of questions){
 assert(eligible(q),'Still belongs to first-school-mock AS Pure: '+q.id);
 for(const answer of ['',q.modelAnswer,'5','nothing here: all the steps are wrong','x=3 so every mark is earned']){
  const result=suggest(q,answer);
  assert.equal(result.manualRequired,true);
  assert.equal(result.suggested,0);
  assert.deepEqual(result.preds,Array(q.marks).fill(false));
  assert.deepEqual(result.scores,Array(q.marks).fill(0));
  checks++;
 }
}
// Exact guards must never turn different questions or untaught/Year 2 papers into manual-marked copies.
for(const row of audit.selected){
 const original=src.get(row.id);
 for(const override of [{prompt:'Modified problem statement'},{mock:false},{taught:false},{subject:'Physics'},{level:'A2'},{courseTopic:'Statistics'},{specRef:'3.4.1'},{requiresWorking:false},{marks:original.marks-1},{markPoints:[]}]) {
  const q={...original,...override};
  apply([q]);
  assert.equal(q.manualWorkingReview,false,'Changed/out-of-scope question passed the exact guard: '+row.id+' '+JSON.stringify(override));
 }
}
const unrelated={...src.get('task1_v271_maths_pure_q03'),id:'some_other_question'};
apply([unrelated]);assert.equal(unrelated.manualWorkingReview,false);
console.log('PASS v372: 5 original difficult Maths applications/39 marks now require reviewed working; all 7 Year 1 Pure questions/49 marks protected; '+checks+' manual marker probes award zero automatic marks; existing 3345 core flashcards and scope intact.');
