'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const app=fs.readFileSync('app.js','utf8');
const deck=require('./task1-v162-historical-snapshot.cjs')(JSON.parse(fs.readFileSync('deck.json','utf8')));
const bank=require('./task1-v163-historical-bank.cjs')(JSON.parse(fs.readFileSync('exam_questions.json','utf8')));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v161-maths-mock-question-eligibility.json','utf8'));

const match=app.match(/function mockEligibleQuestion\(q\)\{[\s\S]*?\n\}/);
assert(match,'Central mock scope predicate is missing');
const eligible=vm.runInNewContext(match[0]+'\nmockEligibleQuestion');
assert.match(app,/const qAll=subjectExam\(sub\)\.filter\(mockEligibleQuestion\)/);
assert.match(app,/if\(scope==='mock'\)q=q\.filter\(mockEligibleQuestion\)/);
assert(!app.includes("q.mock===true||q.level==='AS'"));
assert(!app.includes("x.mock===true||x.level==='AS'"));

assert.equal(deck.cards.length,3312);
assert.equal(bank.questions.length,1260);
assert.equal(deck.cards.filter(c=>c.subject==='Maths'&&c.active!==false&&c.mock===true).length,77);
const maths=bank.questions.filter(q=>q.subject==='Maths');
assert.equal(maths.filter(q=>q.mock===true||q.level==='AS').length,224);
const before=maths.filter(q=>q.mock===true);
assert.equal(before.length,173);
const selected=maths.filter(eligible);
// Preserve v161's historical 121-question snapshot, while checking the current
// school-specific inverse/composite function exclusions added in v397.
const historicalYear1Pure=q=>q.mock===true&&q.level==='AS'&&
 !['statistics','mechanics'].includes(String(q.topic||'').toLowerCase())&&
 !/(?:\bradians?\b|π)/i.test(String(q.prompt||''));
const historicalSelected=maths.filter(historicalYear1Pure);
assert.equal(historicalSelected.length,121);
assert.equal(selected.length,111);
assert.equal(historicalSelected.filter(q=>!eligible(q)).length,10);
assert(selected.every(q=>q.mock===true&&q.level==='AS'));
assert(selected.every(q=>!['statistics','mechanics'].includes(String(q.topic||'').toLowerCase())));
assert(selected.every(q=>!/(?:\bradians?\b|π)/i.test(q.prompt||'')));
assert.equal(bank.questions.filter(q=>q.subject==='Physics'&&eligible(q)).length,240);
assert.equal(bank.questions.filter(q=>q.subject==='Chemistry'&&eligible(q)).length,249);

for(const id of audit.exclusionEvidence.asWithoutExplicitMockFlag.ids){
 const q=maths.find(x=>x.id===id);assert(q&&q.level==='AS'&&q.mock!==true&&!eligible(q));
}
for(const id of audit.exclusionEvidence.statisticsOrMechanicsMockTagged.ids){
 const q=maths.find(x=>x.id===id);assert(q&&q.mock===true&&!eligible(q));
}
for(const id of audit.exclusionEvidence.schoolExcludedRadiansAfterAppliedFilter.ids){
 const q=maths.find(x=>x.id===id);assert(q&&q.mock===true&&!eligible(q));
}
assert.equal(audit.exclusionEvidence.asWithoutExplicitMockFlag.count,51);
assert.equal(audit.exclusionEvidence.statisticsOrMechanicsMockTagged.count,49);
assert.equal(audit.exclusionEvidence.schoolExcludedRadiansAfterAppliedFilter.count,3);
assert.equal(audit.corrected.mathsMockQuestions,historicalSelected.length);
assert(!eligible({subject:'Maths',topic:'Algebra & functions',level:'AS',mock:false,prompt:'Solve x=2'}));
assert(eligible({subject:'Maths',topic:'Algebra & functions',level:'AS',mock:true,prompt:'Solve x=2'}));
assert(!eligible({subject:'Maths',topic:'Mechanics',level:'AS',mock:true,prompt:'Find the displacement'}));
assert(!eligible({subject:'Maths',topic:'Trigonometry',level:'AS',mock:true,prompt:'Find the arc length in radians'}));
assert.equal(audit.limits.completeSpecificationAudit,false);
console.log('PASS v161/v397: historical 121 Year 1 Pure questions preserved; current school mock filters 10 later-taught inverse/composite questions from this snapshot, leaving 111.');
