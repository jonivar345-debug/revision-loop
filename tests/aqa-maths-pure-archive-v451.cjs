'use strict';
// v451: audited paper-catalogue honesty and original worked-question integration.
const fs=require('node:fs'), assert=require('node:assert/strict'),vm=require('node:vm');
const bank=JSON.parse(fs.readFileSync('maths_pure_past_methods_v451.json','utf8'));
const index=JSON.parse(fs.readFileSync('editorial/aqa-maths-pure-7357-paper-index-v451.json','utf8'));
const baseline=JSON.parse(fs.readFileSync('maths_year13_pure_v450.json','utf8'));
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
assert.equal(bank.version,'v451');assert.equal(index.version,'v451');
assert.equal(index.papers.length,24);assert.equal(index.topics2025.length,41);
assert.equal(index.topics2025.filter(q=>q.classification==='pure').length,40);
assert.equal(index.topics2025.filter(q=>q.classification==='mixed_mechanics').length,1);
const yearList=[2018,2019,2020,2021,2022,2023,2024,2025];
for(const year of yearList){
 const papers=index.papers.filter(p=>p.year===year);
 assert.deepEqual(papers.map(p=>p.paper),[1,2,3]);
 assert(papers.every(p=>p.code==='7357/'+p.paper&&p.sourceIndex.startsWith('https://')));
 assert(papers.every(p=>p.indexStatus!=='fully_source_verified'));
}
assert(index.papers.every(p=>p.year!==2026));
assert.deepEqual([1,2,3].map(p=>index.topics2025.filter(q=>q.paper===p&&q.classification==='pure').length),[17,11,12]);
assert(index.topics2025.some(q=>q.paper===2&&q.question===19&&q.classification==='mixed_mechanics'&&!q.currentMockRecommended));
assert(index.topics2025.some(q=>q.paper===1&&q.question===13&&!q.currentMockRecommended));
assert(index.topics2025.some(q=>q.paper===1&&q.question===15&&!q.currentMockRecommended));
assert(index.topics2025.some(q=>q.paper===2&&q.question===17&&!q.currentMockRecommended));
assert.equal(baseline.cards.length,123);assert.equal(baseline.questions.length,62);
assert.equal(bank.questions.length,21);
assert.equal(bank.questions.filter(q=>q.mock).length,17);
assert.equal(bank.questions.filter(q=>!q.mock).length,4);
assert.equal(new Set(bank.questions.map(q=>q.id)).size,21);
assert.equal(new Set([...bank.questions,...baseline.questions].map(q=>q.id)).size,83);
for(const [i,q] of bank.questions.entries()){
 assert.equal(q.id,'y13_v451_q_'+String(i+1).padStart(3,'0'));
 assert(q.sourceVerified===false&&q.verificationLevel==='original-exam-style');
 assert(q.manualWorkingReview===true&&q.requiresWorking===true&&q.standalone===true);
 assert(q.markPoints.length===q.marks&&q.markPointMarks.length===q.marks);
 assert(q.markPointMarks.every(x=>x===1));
 assert(q.modelAnswer===q.markPoints.join(' '));
 assert(q.prompt.endsWith('['+q.marks+' marks]'));
 assert(q.sourceStyle.provenance.includes('secondary'));
 const source=index.topics2025.find(x=>x.paper===q.sourceStyle.methodPaper&&x.question===q.sourceStyle.methodQuestion);
 assert(source&&source.classification==='pure',q.id+' must link a real 2025 Pure question-topic method');
 assert.equal(q.mock,source.currentMockRecommended,q.id+' taught boundary differs from topic audit');
 assert.equal(q.year13PureMock,q.mock);
 assert.equal(q.year13Optional,!q.mock);
 if(q.mock){assert.equal(q.courseTopic,'Year 13 Pure · taught mock');assert(q.taught===true)}
 else {assert.equal(q.courseTopic,'Year 13 Pure · additional practice');assert(q.taught===false)}
}
const a=app.indexOf('function currentYear13PureMockCard('),b=app.indexOf('// Build a bounded batch.',a);
assert(a>=0&&b>a);
const context={};vm.runInNewContext(app.slice(a,b)+'\nthis.card=currentYear13PureMockCard;this.question=currentYear13PureMockQuestion;',context);
assert.equal(baseline.cards.filter(context.card).length,110);
assert.equal(baseline.questions.filter(context.question).length,56);
assert.equal(bank.questions.filter(context.question).length,17);
assert.equal([...baseline.questions,...bank.questions].filter(context.question).length,73);
assert(bank.questions.filter(x=>!x.mock).every(x=>!context.question(x)));
assert(!context.question({id:'legacy_aqa_pure',subject:'Maths',mock:true,level:'A-level'}));
assert(!context.question({id:'y13_v451_q_999',subject:'Maths',mock:true,level:'A-level'}));
for(const value of [
 "const V451_PURE_METHODS_URL='./maths_pure_past_methods_v451.json'",
 "const V451_AQA_PAPER_INDEX_URL='./editorial/aqa-maths-pure-7357-paper-index-v451.json'",
 "const validatedV451Questions",
 "aqaPurePaperArchive=v451Index?.version==='v451'",
 "function renderAqaPureArchive()"
])assert(app.includes(value),value);
assert(html.includes('id="mathsPureArchiveV451"'));
assert(/papers=v45[12789]/.test(html),'The archive must use a current Pure source-audit app version');
assert(sw.includes('maths_pure_past_methods_v451.json'));
assert(sw.includes('aqa-maths-pure-7357-paper-index-v451.json'));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v451: 24 public AQA 7357 paper links, 40 indexed June 2025 Pure topics plus one mixed, 21 original methods, 73 taught mock questions total, v450 and cloud IDs retained.');
