'use strict';
// Source and regression checks for independently authored June 2023 Paper 1 methods.
// These are method practice variants, not AQA paper questions.
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const pack=JSON.parse(fs.readFileSync('maths_pure_2023_p1_v458.json','utf8'));
const older=['maths_year13_pure_v450.json','maths_pure_past_methods_v451.json',
 'maths_pure_2024_p1_v452.json','maths_pure_2024_p2p3_v457.json']
 .flatMap(p=>JSON.parse(fs.readFileSync(p,'utf8')).questions);
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
assert.equal(pack.version,'v458');
assert.equal(pack.paperId,'7357-2023-1');
assert.equal(pack.paper,'7357/1');
assert.equal(pack.totalPaperQuestions,16);
assert.equal(pack.totalPaperMarks,100);
assert.equal(pack.inventory.length,16);
assert.equal(pack.inventory.reduce((sum,row)=>sum+row.marks,0),100);
assert.deepEqual(pack.inventory.map(row=>row.question),Array.from({length:16},(_,i)=>i+1));
assert(pack.sourceQuestionPaper.includes('aqa.org.uk'));
assert(pack.sourceMarkScheme.includes('aqa.org.uk'));
assert.equal(pack.fullVisualAuditComplete,false);
assert(pack.inventory.every(row=>row.classification==='pure'&&row.questionPaperChecked&&
 row.markSchemeChecked&&row.textQuoted===false));
for(const n of [4,5,13,16])assert.equal(pack.inventory[n-1].currentMockRecommended,false,
 'Unconfirmed method entered mock Q'+n);
assert(pack.inventory.filter(row=>row.diagramVisualCheck==='pending_manual_visual_comparison').length>=8);
assert.equal(pack.questions.length,11);
assert.equal(pack.questions.filter(q=>q.mock).length,7);
assert.equal(pack.questions.filter(q=>!q.mock).length,4);
const all=[...older,...pack.questions];
assert.equal(new Set(all.map(q=>q.id)).size,123);
assert.equal(older.length,112);
const context={};
const start=app.indexOf('function currentYear13PureMockCard(');
const end=app.indexOf('// Build a bounded batch.',start);
assert(start>=0&&end>start);
vm.runInNewContext(app.slice(start,end)+'\nthis.isQuestion=currentYear13PureMockQuestion;',context);
assert.equal(older.filter(context.isQuestion).length,95);
assert.equal(pack.questions.filter(context.isQuestion).length,7);
assert.equal(all.filter(context.isQuestion).length,102);
for(const [i,q] of pack.questions.entries()){
 assert.equal(q.id,'y13_v458_q_'+String(i+1).padStart(3,'0'));
 assert.equal(q.subject,'Maths');
 assert.equal(q.level,'A-level');
 assert.equal(q.year,'Practice');
 assert.equal(q.sourceVerified,false);
 assert.equal(q.verificationLevel,'original-exam-style');
 assert(q.standalone&&q.requiresWorking&&q.manualWorkingReview);
 assert(q.marks>=3&&q.marks<=9);
 assert.equal(q.markPoints.length,q.marks);
 assert.equal(q.markPointMarks.length,q.marks);
 assert(q.markPointMarks.every(m=>m===1));
 assert.equal(q.modelAnswer,q.markPoints.join(' '));
 assert(q.prompt.endsWith('['+q.marks+' marks]'));
 assert.equal(q.year13PureMock,q.mock);
 assert.equal(q.year13Optional,!q.mock);
 assert.equal(q.taught,q.mock);
 assert.equal(q.courseTopic,q.mock?'Year 13 Pure · taught mock':'Year 13 Pure · additional practice');
 assert.equal(q.sourceStyle.methodYear,2023);
 assert.equal(q.sourceStyle.methodPaper,1);
 assert.equal(q.sourceStyle.questionPaper,pack.sourceQuestionPaper);
 assert.equal(q.sourceStyle.markScheme,pack.sourceMarkScheme);
 const item=pack.inventory.find(row=>row.question===q.sourceStyle.methodQuestion);
 assert(item&&item.classification==='pure');
 assert.equal(item.currentMockRecommended,q.mock);
 assert.equal(context.isQuestion(q),q.mock,'Incorrect mock flag '+q.id);
}
const Q=i=>pack.questions[i-1];
assert(Q(1).modelAnswer.includes('ln(x/3)'));
assert(Math.abs(17/24-0.7083333333333333)<1e-12);
assert(Q(3).modelAnswer.includes('17/24'));
assert(Q(4).modelAnswer.includes('x=5'));
assert(Q(5).modelAnswer.includes('−2/9'));
assert(Q(6).modelAnswer.includes('L=50'));
assert(Math.abs(Math.atan(4/3)-0.9272952180016122)<1e-12);
assert(Q(7).modelAnswer.includes('minimum'));
assert(Math.abs(577/408-Math.SQRT2)<0.000003);
assert(Q(8).modelAnswer.includes('577/408'));
assert(Math.abs(3*(1+Math.SQRT2)/4-1.8106601717798212)<1e-10);
assert(Q(9).modelAnswer.includes('3/ln4'));
assert(Q(10).modelAnswer.includes('−4/5'));
assert(Q(11).modelAnswer.includes('A=1/6'));
assert(app.includes("const V458_2023_P1_URL='./maths_pure_2023_p1_v458.json'"));
assert(app.includes('validatedV458Questions'));
assert(app.includes('...validatedV458Questions'));
assert(app.includes('aqaPure2023P1Audit=v458Pack.version'));
assert(app.includes('2023 Paper 1 · 16 questions'));
assert(html.includes('papers=v465'));
assert(sw.includes("'./maths_pure_2023_p1_v458.json'"));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'",
 "PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])
 assert(app.includes(key));
console.log('PASS v458: 2023 Paper 1 16 questions/100 marks, 11 original worked variants, 102 current mock questions and 21 optional');
