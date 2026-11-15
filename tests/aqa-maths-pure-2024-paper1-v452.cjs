'use strict';
// v452: June 2024 Paper 1 primary-paper and official mark-scheme method inventory.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const pack=JSON.parse(fs.readFileSync('maths_pure_2024_p1_v452.json','utf8'));
const v450=JSON.parse(fs.readFileSync('maths_year13_pure_v450.json','utf8'));
const v451=JSON.parse(fs.readFileSync('maths_pure_past_methods_v451.json','utf8'));
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
assert.equal(pack.version,'v452');
assert.equal(pack.paperId,'7357-2024-1');
assert.equal(pack.paper,'7357/1');
assert(pack.sourceQuestionPaper.startsWith('https://'));
assert(pack.sourceMarkScheme.startsWith('https://www.aqa.org.uk/'));
assert.equal(pack.inventory.length,20);
assert.deepEqual(pack.inventory.map(q=>q.question),Array.from({length:20},(_,i)=>i+1));
assert.equal(pack.inventory.reduce((sum,q)=>sum+q.marks,0),100);
assert(pack.inventory.every(q=>q.classification==='pure'&&q.questionPaperChecked&&q.markSchemeChecked&&!q.textQuoted));
assert(pack.inventory.filter(q=>q.diagramVisualCheck==='pending_manual_visual_comparison').length>=4);
for(const n of [4,9,14,16,20])assert.equal(pack.inventory[n-1].currentMockRecommended,false,'unconfirmed topic entered mock: Q'+n);
assert.equal(pack.questions.length,11);
assert.equal(pack.questions.filter(q=>q.mock).length,9);
assert.equal(pack.questions.filter(q=>!q.mock).length,2);
const ids=[...v450.questions,...v451.questions,...pack.questions].map(q=>q.id);
assert.equal(new Set(ids).size,94);
const context={};
const a=app.indexOf('function currentYear13PureMockCard(');
const b=app.indexOf('// Build a bounded batch.',a);
assert(a>=0&&b>a);
vm.runInNewContext(app.slice(a,b)+'\nthis.isCard=currentYear13PureMockCard;this.isQuestion=currentYear13PureMockQuestion;',context);
assert.equal(v450.cards.filter(context.isCard).length,110);
assert.equal(v450.questions.filter(context.isQuestion).length,56);
assert.equal(v451.questions.filter(context.isQuestion).length,17);
assert.equal(pack.questions.filter(context.isQuestion).length,9);
assert.equal([...v450.questions,...v451.questions,...pack.questions].filter(context.isQuestion).length,82);
for(const [i,q] of pack.questions.entries()){
 assert.equal(q.id,'y13_v452_q_'+String(i+1).padStart(3,'0'));
 assert.equal(q.sourceVerified,false);
 assert.equal(q.verificationLevel,'original-exam-style');
 assert(q.requiresWorking===true&&q.manualWorkingReview===true&&q.standalone===true);
 assert(q.marks>=3&&q.marks<=9);
 assert(q.markPoints.length===q.marks&&q.markPointMarks.length===q.marks);
 assert(q.markPointMarks.every(m=>m===1));
 assert.equal(q.modelAnswer,q.markPoints.join(' '));
 assert(q.prompt.endsWith('['+q.marks+' marks]'));
 assert(q.sourceStyle.provenance.includes('independently'));
 assert(q.sourceStyle.questionPaper===pack.sourceQuestionPaper);
 assert(q.sourceStyle.markScheme===pack.sourceMarkScheme);
 const row=pack.inventory.find(x=>x.question===q.sourceStyle.methodQuestion);
 assert(row&&row.classification==='pure');
 assert.equal(q.mock,row.currentMockRecommended);
 assert.equal(q.year13PureMock,q.mock);
 assert.equal(q.year13Optional,!q.mock);
 if(q.mock){
  assert(context.isQuestion(q),'Taught question must be eligible: '+q.id);
  assert(q.taught===true&&q.courseTopic==='Year 13 Pure · taught mock');
 }else{
  assert(!context.isQuestion(q),'Optional question excluded: '+q.id);
  assert(q.taught===false&&q.courseTopic==='Year 13 Pure · additional practice');
 }
}
const q=n=>pack.questions[n-1];
assert(q(4).modelAnswer.includes('107'));
assert(q(5).modelAnswer.includes('(x+2)(2x²+x+3)'));
assert(Math.abs(360-2*Math.acos(-1/6)*180/Math.PI-160.811862)<0.01);
assert(q(6).modelAnswer.includes('99.6°')&&q(6).modelAnswer.includes('260.4°'));
assert(q(8).modelAnswer.includes('92/9'));
assert(q(9).modelAnswer.includes('k=27+12=39'));
assert(q(10).modelAnswer.includes('1.0328'));
let x=1;for(let i=0;i<3;i++)x=Math.cbrt(3*x+1);
assert(Math.abs(x-1.8545416778)<0.000001);
for(const s of [
 "const V452_2024_P1_URL='./maths_pure_2024_p1_v452.json'",
 'aqaPure2024P1Audit=v452Pack.version',
 'validatedV452Questions',
 'function renderAqaPureArchive()',
 'Show 20 June 2024 Paper 1 methods',
 '...validatedV452Questions'
])assert(app.includes(s),s);
assert(html.includes('papers=v452'));
assert(sw.includes("'./maths_pure_2024_p1_v452.json'"));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v452: primary June 2024 P1 20Q/100 marks, 11 original method questions, 82 taught mock questions total, separate optional topics, existing progress and subjects preserved');
