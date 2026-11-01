'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const bank=j('maths_year1_circle_vector_gaps_v273.json'),audit=j('editorial/task1-v273-maths-selected-gaps-evidence.json'),prior=j('editorial/task1-v244-maths-year1-pure-crosswalk.json');
const app=read('app.js'),sw=read('sw.js');
const urls=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert(urls.length>=36,'v273 circle/vector bank remains at index 35 when later banks append');assert.equal(urls[35],'maths_year1_circle_vector_gaps_v273.json');
assert(sw.includes("'./maths_year1_circle_vector_gaps_v273.json'"));assert(sw.includes('-v273-circle-vectors'));
assert.equal(j('deck.json').cards.length,3345);assert.equal(j('exam_questions.json').questions.length,1268);
assert.equal(bank.version,'v273');assert.equal(bank.questions.length,3);
const oldQ=new Set([...j('exam_questions.json').questions,...urls.slice(0,35).flatMap(p=>j(p).questions||[])].map(x=>x.id));
const ids=new Set(),sections=new Set();let marks=0;
for(const q of bank.questions){
 assert(!oldQ.has(q.id),'Duplicate prior question '+q.id);
 assert(!ids.has(q.id));ids.add(q.id);
 assert.equal(q.subject,'Maths');assert.equal(q.level,'AS');
 assert(['3.4','3.11'].includes(q.specRef));sections.add(q.specRef);
 assert.equal(q.courseTopic,'Year 1 Pure');assert.equal(q.revisionTopic,'Year 1 Pure');
 assert.equal(q.mock,true);assert.equal(q.taught,true);assert.equal(q.standalone,true);
 assert.equal(q.sourceVerified,false);assert.equal(q.verificationLevel,'original-exam-style');
 assert.equal(q.requiresWorking,true);
 assert.equal(q.markPoints.length,q.marks);assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 assert(q.prompt.includes('['+q.marks+' marks]'));assert(q.modelAnswer.length>150);
 marks+=q.marks;
}
assert.equal(marks,23);assert.deepEqual([...sections].sort(),['3.11','3.4']);
assert.equal(prior.requirements.length,50);assert.equal(audit.selectedRequirementRows,50);
const missing=prior.requirements.flatMap((r,i)=>r.coreEvidenceIds?.length?[]:[i+1]);
assert.deepEqual(missing,[4,5,17,22,28,45,50]);
assert.equal(audit.selectedRowsWithoutDirectCoreEvidenceAtV244,missing.length);
assert.equal(audit.selectedRowsWithSomeCoreEvidenceAtV244,43);
assert.equal(audit.selectedPreviouslyCoreUnmappedRowsNowWithPracticeExample,7);
const audits=audit.missingCoreOnlyRowsNowWithExamples;
assert.equal(audits.length,7);assert.deepEqual(audits.map(x=>x.requirementNumber),missing);
const idToQuestion=new Map([...urls.flatMap(p=>(j(p).questions||[])),...j('exam_questions.json').questions].map(q=>[q.id,q]));
const idToCard=new Map([...j('deck.json').cards,...[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]).flatMap(p=>j(p).cards||[])].map(c=>[c.id,c]));
for(const row of audits){
 assert.equal(row.description,prior.requirements[row.requirementNumber-1].assessableSkill);
 assert(row.examples.length>0);
 for(const id of row.examples)assert(idToQuestion.has(id)||idToCard.has(id),'Referenced nonexistent practice '+id);
}
for(const [k,v] of Object.entries(audit.completion)){
 if(k!=='allSelectedCoreGapsHaveRepresentativePractice')assert.equal(v,false,'Unverified Task 1 gate must remain open: '+k);
}
assert.equal(audit.completion.allSelectedCoreGapsHaveRepresentativePractice,true);
const near=(a,b)=>Math.abs(a-b)<1e-9;
const c1=(x,y)=>(x-1)**2+(y-2)**2-25;
for(const [x,y] of [[-3,-1],[5,5]]){assert(near(c1(x,y),0));assert(near(4*y,3*x+5));}
assert(near(4*5+3*5,35));
const A=[-2,1],B=[6,5],C=[4,-1];
const ctr=[(A[0]+B[0])/2,(A[1]+B[1])/2];
assert.deepEqual(ctr,[2,3]);assert(near((C[0]-2)**2+(C[1]-3)**2,20));
const gradCA=(A[1]-C[1])/(A[0]-C[0]),gradCB=(B[1]-C[1])/(B[0]-C[0]);
assert(near(gradCA*gradCB,-1));assert(near(C[0]-2*C[1]-6,0));
const k=3,V=[k,2*k-6],VA=[-1,4],VB=[5,-2];
assert.deepEqual(V,[3,0]);
const AB=[VB[0]-VA[0],VB[1]-VA[1]],AC=[V[0]-VA[0],V[1]-VA[1]],CB=[VB[0]-V[0],VB[1]-V[1]];
assert.deepEqual(AB,[6,-6]);assert.deepEqual(AC,[4,-4]);assert.deepEqual(CB,[2,-2]);
assert(near(AC[0]/CB[0],2));assert(near(Math.hypot(...AC),4*Math.SQRT2));
assert(near(AB[0]/Math.hypot(...AB),1/Math.SQRT2));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v273: 3 AS Pure circle/vector applications, 23 independently checked criteria; all 7 previously unmapped selected core skill rows have named practice evidence without false full mock certification.');
