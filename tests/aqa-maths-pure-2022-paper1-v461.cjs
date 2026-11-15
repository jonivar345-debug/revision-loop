'use strict';
// June 2022 AQA Maths 7357/1: source method inventory and independently authored practices.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const pack=JSON.parse(fs.readFileSync('maths_pure_2022_p1_v461.json','utf8'));
const older=['maths_year13_pure_v450.json','maths_pure_past_methods_v451.json',
 'maths_pure_2024_p1_v452.json','maths_pure_2024_p2p3_v457.json',
 'maths_pure_2023_p1_v458.json','maths_pure_2023_p2_v459.json','maths_pure_2023_p3_v460.json']
 .flatMap(p=>JSON.parse(fs.readFileSync(p,'utf8')).questions);
const app=fs.readFileSync('app.js','utf8'),html=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
assert.equal(pack.version,'v461');
assert.equal(pack.paperId,'7357-2022-1');
assert.equal(pack.paper,'7357/1');
assert.equal(pack.totalPaperQuestions,15);
assert.equal(pack.totalPaperMarks,100);
assert.equal(pack.fullVisualAuditComplete,false);
assert(pack.sourceQuestionPaper.includes('aqa.org.uk'));
assert(pack.sourceMarkScheme.includes('aqa.org.uk'));
assert.equal(pack.inventory.length,15);
assert.deepEqual(pack.inventory.map(q=>q.question),Array.from({length:15},(_,i)=>i+1));
assert.deepEqual(pack.inventory.map(q=>q.marks),[1,1,1,1,3,6,3,11,9,12,10,8,9,9,16]);
assert.equal(pack.inventory.reduce((sum,q)=>sum+q.marks,0),100);
assert(pack.inventory.every(q=>q.classification==='pure'&&q.questionPaperChecked&&
 q.markSchemeTextReviewed&&q.textQuoted===false));
assert.equal(pack.inventory.filter(q=>q.diagramVisualCheck==='pending_manual_visual_comparison').length,7);
assert.equal(pack.questions.length,14);
assert.equal(pack.questions.filter(q=>q.mock).length,12);
assert.equal(pack.questions.filter(q=>!q.mock).length,2);
assert.equal(older.length,142);
const all=[...older,...pack.questions];
assert.equal(all.length,156);
assert.equal(new Set(all.map(q=>q.id)).size,156);
const ctx={},start=app.indexOf('function currentYear13PureMockCard('),
 end=app.indexOf('// Build a bounded batch.',start);
assert(start>=0&&end>start);
vm.runInNewContext(app.slice(start,end)+'\nthis.isQuestion=currentYear13PureMockQuestion;',ctx);
assert.equal(older.filter(ctx.isQuestion).length,114);
assert.equal(pack.questions.filter(ctx.isQuestion).length,12);
assert.equal(all.filter(ctx.isQuestion).length,126);
for(const [i,q] of pack.questions.entries()){
 assert.equal(q.id,'y13_v461_q_'+String(i+1).padStart(3,'0'));
 assert.equal(q.subject,'Maths');
 assert.equal(q.stage,'A2');
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
 assert.equal(q.sourceStyle.methodYear,2022);
 assert.equal(q.sourceStyle.methodPaper,1);
 assert.equal(q.sourceStyle.questionPaper,pack.sourceQuestionPaper);
 assert.equal(q.sourceStyle.markScheme,pack.sourceMarkScheme);
 const row=pack.inventory.find(r=>r.question===q.sourceStyle.methodQuestion);
 assert(row&&row.classification==='pure');
 assert.equal(row.currentMockRecommended,q.mock);
 assert.equal(ctx.isQuestion(q),q.mock);
}
for(const n of [8,10])assert(!ctx.isQuestion(pack.questions[n-2])); // Q8/10 optional practice
assert(pack.questions[4].sourceStyle.methodScope.includes('fractional-binomial-subpart-only'));
assert(pack.questions[12].sourceStyle.methodScope.includes('integration-by-parts-subpart-only'));
assert(pack.questions[2].modelAnswer.includes('f′(x)=2x−4'));
assert(pack.questions[7].modelAnswer.includes('1100'));
assert(pack.questions[9].modelAnswer.includes('P(2)=8−16+8=0'));
assert(pack.questions[11].modelAnswer.includes('x+y=4'));
assert(pack.questions[12].modelAnswer.includes('(e²+1)/4'));
assert(pack.questions[13].modelAnswer.includes('−cosec x'));
assert(app.includes("const V461_2022_P1_URL='./maths_pure_2022_p1_v461.json'"));
assert(app.includes('aqaPure2022P1Audit=v461Pack.version'));
assert(app.includes('...validatedV461Questions'));
assert(app.includes('2022 Paper 1 · 15 questions'));
assert(html.includes('papers=v466'));
assert(sw.includes("'./maths_pure_2022_p1_v461.json'"));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v461: June 2022 AQA Pure Paper 1 all 15 Qs/100 marks method audit, 14 original worked, 156 total / 126 taught / 30 optional; preserved IDs, progress keys and no copied AQA text');
