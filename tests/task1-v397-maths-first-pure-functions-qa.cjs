'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),deck=json('deck.json'),exam=json('exam_questions.json');
const audit=json('editorial/task1-v397-maths-first-pure-functions-qa.json');
assert.equal(deck.cards.length,3345);
assert.equal(new Set(deck.cards.map(x=>x.id)).size,3345);
assert.equal(exam.questions.length,1268);
assert.equal(new Set(exam.questions.map(x=>x.id)).size,1268);
assert.equal(audit.rows.length,11);
assert.equal(audit.counts.marks,32);
assert(sw.includes('-v397-firstpure-maths11'));
assert(app.includes('if(MOCK_MATHS_EXCLUDED_FUNCTION_Q_IDS.has(q.id))return false;'));
const hash=s=>{let h=2166136261;const v=String(s||'');for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16)};
const start=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),end=app.indexOf('function startMockSession(){',start);
assert(start>=0&&end>start);
const {eligible,excluded,eligibleCard}=new Function(app.slice(start,end)+'\nreturn {eligible:mockEligibleQuestion,excluded:MOCK_MATHS_EXCLUDED_FUNCTION_Q_IDS,eligibleCard:mockEligibleCard};')();
assert.deepEqual([...excluded],audit.rows.map(x=>x.id));
const originalSelector=q=>{
 if(q.mock!==true)return false;
 if(q.subject!=='Maths')return true;
 if(q.level!=='AS')return false;
 const topic=String(q.topic||'').trim().toLowerCase();
 if(topic==='statistics'||topic==='mechanics')return false;
 return !/(?:\bradians?\b|π)/i.test(String(q.prompt||''));
};
const eligibleBefore=exam.questions.filter(q=>q.subject==='Maths'&&originalSelector(q));
const eligibleAfter=exam.questions.filter(q=>q.subject==='Maths'&&eligible(q));
assert.equal(eligibleBefore.length,128);
assert.equal(eligibleAfter.length,117);
assert.equal(eligibleBefore.length-eligibleAfter.length,11);
const groupIds=new Set();
for(const row of audit.rows){
 const q=exam.questions.find(x=>x.id===row.id);
 assert(q,'Missing '+row.id);
 for(const key of ['id','subject','level','topic','courseTopic','marks','groupId'])assert.equal(q[key],row[key]);
 assert.equal(q.mock,true);
 assert.equal(q.standalone,true);
 assert.equal(hash(q.prompt),row.promptHash);
 assert.equal(hash(q.modelAnswer),row.answerHash);
 assert(originalSelector(q),'Was already out of mock: '+q.id);
 assert(!eligible(q),'Still inside mock: '+q.id);
 assert(!groupIds.has(q.groupId),'Question parts grouped with another excluded item');
 groupIds.add(q.groupId);
}
assert.equal(audit.rows.reduce((sum,x)=>sum+x.marks,0),32);
for(const q of exam.questions){
 if(!excluded.has(q.id))assert.equal(eligible(q),originalSelector(q),'Changed unrelated eligibility: '+q.id);
}
for(const id of audit.notExcluded){
 const q=exam.questions.find(x=>x.id===id);
 assert(q&&q.subject==='Maths'&&q.topic==='Proof');
 assert.match(q.prompt,/composite counterexample/);
 assert(eligible(q),'A legitimate proof counterexample was accidentally removed');
}
for(const id of ['math_function_composite','math_inverse_condition']){
 const c=deck.cards.find(x=>x.id===id);
 assert(c);
 assert(!eligibleCard(c),'Previously excluded later function card suddenly leaked');
}
for(const id of ['orig_v33_math_2_0','orig_v31_maths_transformations_1']){
 const q=exam.questions.find(x=>x.id===id);assert(q);assert(eligible(q),'Year 1 functions/transformations wrongly excluded');
}
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
assert(app.includes('function examGroups(){'));
console.log('PASS v397: 11 original inverse/composite Maths exam questions (32 marks) now excluded only from school first mock; 117 of original 128 previously eligible Maths questions remain; legitimate proofs/functions and existing 3345 cards preserved.');
