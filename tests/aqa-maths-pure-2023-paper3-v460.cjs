'use strict';
// 2023 AQA 7357/3 Pure Section A method review and independently authored practice.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const pack=JSON.parse(fs.readFileSync('maths_pure_2023_p3_v460.json','utf8'));
const older=['maths_year13_pure_v450.json','maths_pure_past_methods_v451.json',
 'maths_pure_2024_p1_v452.json','maths_pure_2024_p2p3_v457.json',
 'maths_pure_2023_p1_v458.json','maths_pure_2023_p2_v459.json']
 .flatMap(p=>JSON.parse(fs.readFileSync(p,'utf8')).questions);
const app=fs.readFileSync('app.js','utf8'),html=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
assert.equal(pack.version,'v460');
assert.equal(pack.paperId,'7357-2023-3');
assert.equal(pack.paper,'7357/3');
assert.equal(pack.pureSection,'Section A, Questions 1–9');
assert.equal(pack.appliedSection,'Section B, Questions 10–17 (Statistics)');
assert.equal(pack.pureQuestionCount,9);
assert.equal(pack.pureMarks,50);
assert.equal(pack.fullVisualAuditComplete,false);
assert(pack.sourceQuestionPaper.includes('aqa.org.uk'));
assert(pack.sourceMarkScheme.includes('aqa.org.uk'));
assert.equal(pack.inventory.length,9);
assert.deepEqual(pack.inventory.map(row=>row.question),Array.from({length:9},(_,i)=>i+1));
assert.deepEqual(pack.inventory.map(row=>row.marks),[1,1,1,2,3,9,14,7,12]);
assert.equal(pack.inventory.reduce((sum,row)=>sum+row.marks,0),50);
assert(pack.inventory.every(row=>row.classification==='pure'&&row.questionPaperChecked&&
 row.markSchemeChecked&&!row.textQuoted));
assert(pack.inventory.filter(row=>row.diagramVisualCheck==='pending_manual_visual_comparison').length>=5);
assert.equal(pack.questions.length,9);
assert.equal(pack.questions.filter(q=>q.mock).length,6);
assert.equal(pack.questions.filter(q=>!q.mock).length,3);
assert.equal(older.length,133);
const all=[...older,...pack.questions];
assert.equal(all.length,142);
assert.equal(new Set(all.map(q=>q.id)).size,142);
const scope={};
const st=app.indexOf('function currentYear13PureMockCard('),
 ed=app.indexOf('// Build a bounded batch.',st);
assert(st>=0&&ed>st);
vm.runInNewContext(app.slice(st,ed)+'\nthis.isQuestion=currentYear13PureMockQuestion;',scope);
assert.equal(older.filter(scope.isQuestion).length,108);
assert.equal(pack.questions.filter(scope.isQuestion).length,6);
assert.equal(all.filter(scope.isQuestion).length,114);
for(const [i,q] of pack.questions.entries()){
 assert.equal(q.id,'y13_v460_q_'+String(i+1).padStart(3,'0'));
 assert.equal(q.subject,'Maths');
 assert.equal(q.level,'A-level');
 assert.equal(q.stage,'A2');
 assert.equal(q.year,'Practice');
 assert.equal(q.sourceVerified,false);
 assert.equal(q.verificationLevel,'original-exam-style');
 assert(q.requiresWorking&&q.manualWorkingReview&&q.standalone);
 assert(q.marks>=3&&q.marks<=9);
 assert.equal(q.markPoints.length,q.marks);
 assert.equal(q.markPointMarks.length,q.marks);
 assert(q.markPointMarks.every(n=>n===1));
 assert.equal(q.modelAnswer,q.markPoints.join(' '));
 assert(q.prompt.endsWith('['+q.marks+' marks]'));
 assert.equal(q.year13PureMock,q.mock);
 assert.equal(q.year13Optional,!q.mock);
 assert.equal(q.taught,q.mock);
 assert.equal(q.courseTopic,q.mock?'Year 13 Pure · taught mock':'Year 13 Pure · additional practice');
 assert.equal(q.sourceStyle.methodYear,2023);
 assert.equal(q.sourceStyle.methodPaper,3);
 assert.equal(q.sourceStyle.questionPaper,pack.sourceQuestionPaper);
 assert.equal(q.sourceStyle.markScheme,pack.sourceMarkScheme);
 const inventoryRow=pack.inventory.find(row=>row.question===q.sourceStyle.methodQuestion);
 assert(inventoryRow&&inventoryRow.classification==='pure');
 assert.equal(inventoryRow.currentMockRecommended,q.mock);
 assert.equal(scope.isQuestion(q),q.mock,'Wrong taught status '+q.id);
 assert(q.sourceStyle.methodQuestion<=9,'Statistics method in Pure practice');
}
const q=i=>pack.questions[i-1];
assert(q(1).modelAnswer.includes('vertex is (3,2)'));
assert(q(2).modelAnswer.includes('2.78024'));
assert(Math.abs((1+2*Math.SQRT2+Math.sqrt(3))/2-2.7802389661575337)<1e-10);
assert(q(3).modelAnswer.includes('x=2'));
assert(q(4).modelAnswer.includes('q=−1/2'));
assert(q(5).modelAnswer.includes('105'));
assert(q(6).modelAnswer.includes('−19<0'));
assert(q(7).modelAnswer.includes('25 cm²'));
assert(q(8).modelAnswer.includes('(√2−1)/2'));
assert(q(9).modelAnswer.includes('2/3'));
assert(app.includes("const V460_2023_P3_URL='./maths_pure_2023_p3_v460.json'"));
assert(app.includes('aqaPure2023P3Audit=v460Pack.version'));
assert(app.includes('...validatedV460Questions'));
assert(app.includes('2023 Paper 3 · Pure Section A Q1–9'));
assert(html.includes('papers=v465'));
assert(sw.includes("'./maths_pure_2023_p3_v460.json'"));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])
 assert(app.includes(key));
console.log('PASS v460: 2023 Paper 3 Pure Q1–9/50 marks; 9 original worked; 142 originals/114 taught/28 optional, no Statistics, stable progress');
