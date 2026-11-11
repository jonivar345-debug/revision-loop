'use strict';
/* v439: no AQA AS content strand should disappear from Physics mock sampling. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const balance=require('../physics-mock-balance-v439.js');
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const cards=JSON.parse(fs.readFileSync('deck.json','utf8')).cards.filter(c=>c.subject==='Physics'&&c.mock===true&&c.active!==false);
const questions=JSON.parse(fs.readFileSync('exam_questions.json','utf8')).questions.filter(q=>q.subject==='Physics'&&q.mock===true);
assert.deepEqual([...balance.STRANDS],[
 'Measurements and errors','Particles and radiation','Waves','Mechanics and materials','Electricity']);
assert(cards.length>=700,'Retain Physics mock flashcards');
assert(questions.length>=235,'Retain AS Physics mock exam questions');
const byStrand=(items)=>Object.fromEntries([...balance.STRANDS].map(name=>[name,items.filter(c=>balance.strand(c)===name).length]));
const cardCount=byStrand(cards),examCount=byStrand(questions);
for(const label of balance.STRANDS){
 assert(cardCount[label]>=25,'Missing AS flashcard coverage '+label);
 assert(examCount[label]>=10,'Missing AS exam question coverage '+label);
}
assert(cards.filter(c=>!balance.strand(c)).length<=10,'Unclassified original mock cards require manual review');
assert.equal(questions.filter(q=>!balance.strand(q)).length,0);
// Older AQA AS Physics imports omitted mock=true on 30 entries.
// Promote only the 27 with checked official papers/mark schemes.
const allPhysicsExam=JSON.parse(fs.readFileSync('exam_questions.json','utf8')).questions
 .filter(q=>q.subject==='Physics'&&q.level==='AS');
const missingFlag=allPhysicsExam.filter(q=>q.mock!==true);
assert.equal(missingFlag.length,30);
const eligibleStart=app.indexOf('function mockEligibleQuestion('),
 eligibleEnd=app.indexOf('function buildMockSessionItems(',eligibleStart);
assert(eligibleStart>=0&&eligibleEnd>eligibleStart);
const eligibility={};
vm.runInNewContext(app.slice(eligibleStart,eligibleEnd)+'\nthis.eligible=mockEligibleQuestion;',eligibility);
const newlyEligible=missingFlag.filter(eligibility.eligible);
assert.equal(newlyEligible.length,27,'Include officially source-verified AQA AS Physics entries');
assert(newlyEligible.every(q=>q.sourceVerified===true&&q.originalMarkVerified===true));
assert.equal(missingFlag.filter(q=>!eligibility.eligible(q)).length,3,'Do not promote secondary-indexed 2025 entries');

const requiredPracticals=new Set(questions.map(balance.practical).filter(Boolean));
assert.deepEqual([...requiredPracticals].sort(),[1,2,3,4,5,6],'All six required practicals need at least one eligible exam entry');
assert.equal(balance.strand({courseTopic:'Mechanics & materials',topic:'Motion graphs'}),'Mechanics and materials');
assert.equal(balance.strand({courseTopic:'Waves',topic:'Polarisation'}),'Waves');
assert.equal(balance.strand({courseTopic:'Electricity',topic:'Potential dividers'}),'Electricity');
assert.equal(balance.strand({specRef:'3.2.2.1'}),'Particles and radiation');
assert.equal(balance.strand({courseTopic:'Particles & radiation',topic:'Photoelectric effect'}),'Particles and radiation','Photoelectric must not leak into Electricity');
assert.equal(balance.practical({revisionTopic:'RP6 EMF/internal resistance'}),6);

// Real bank and weighted selection: each five-area sample must represent
// every AS strand, without dropping cards or repeating group references.
const picker=(pool,n)=>pool.slice(0,n);
const selectedCards=balance.pickBalanced(cards,15,()=>1,picker);
assert.equal(selectedCards.length,15);
assert.equal(new Set(selectedCards.map(c=>c.id)).size,15);
for(const domain of balance.STRANDS)assert(selectedCards.some(c=>balance.strand(c)===domain),'Short Physics mock skipped '+domain);
const groups=new Map();
for(const q of questions){if(!groups.has(q.groupId))groups.set(q.groupId,[]);groups.get(q.groupId).push(q)}
const grouped=[...groups.values()];
const chosen=balance.pickBalanced(grouped,10,()=>1,picker,{practicalFirst:true});
assert.equal(chosen.length,10);
assert(chosen.some(g=>balance.practical(g[0])),'Prioritise a required practical in substantial exam batch');
for(const domain of balance.STRANDS)assert(chosen.some(g=>balance.strand(g[0])===domain),'Exam-only Physics mock skipped '+domain);

// The Mock tab must not inherit the separate Exam tab's level selection.
// Force that other helper to throw if it is inadvertently used.
const begin=app.indexOf('function buildMockSessionItems('),end=app.indexOf('function startMockSession(){',begin);
assert(begin>=0&&end>begin);
const context={
 cards,examQuestions:allPhysicsExam,window:{RevisionPhysicsMockBalance:balance},
 settings:{recallMustKnowFirst:true},pickRecallCards:(pool,n)=>pool.slice(0,n),
 weightedPick:(pool,n)=>pool.slice(0,n),subjectExam:()=>{throw Error('Mock must ignore exam tab filter')},
 mockEligibleQuestion:eligibility.eligible,mockEligibleCard:c=>c.mock===true,
 weakness:()=>0,isDue:()=>false,memoryHealth:()=>1,groupWeakness:()=>0,urgentRecallMustKnow:()=>false,
};
vm.runInNewContext(app.slice(begin,end)+'\nthis.make=buildMockSessionItems;',context);
const exhaustive=context.make('Physics','exam',500).filter(x=>x.type==='exam');
assert.equal(new Set(exhaustive.map(x=>x.id)).size,267,
 'Exhaustive mock practice should contain all 240 originally tagged and 27 newly promoted verified AS questions');
for(const q of newlyEligible)assert(exhaustive.some(x=>x.id===q.id),'Verified AS past-paper part omitted '+q.id);
for(const q of missingFlag.filter(q=>!eligibility.eligible(q)))assert(!exhaustive.some(x=>x.id===q.id),
 'Do not accidentally promote secondary-indexed part '+q.id);
for(const mode of ['flash','exam','mixed']){
 const batch=context.make('Physics',mode,15);
 assert(batch.length>0,'Mock session should not be empty '+mode);
 if(mode!=='flash')assert(batch.some(x=>x.type==='exam'),'Physics exam questions are not filtered out by unrelated controls');
 if(mode!=='exam')assert(batch.some(x=>x.type==='card'));
 if(mode==='exam'){
  const ids=new Set(batch.filter(x=>x.type==='exam').map(x=>questions.find(q=>q.id===x.id)).map(balance.strand));
  for(const domain of balance.STRANDS)assert(ids.has(domain),'AS Physics strand missing in exam-only practice '+domain);
 }
}
assert(html.includes('id="physicsMockBreadthNote"'));
assert(html.includes('physics-mock-balance-v439.js?v=439'));
assert(sw.includes("'./physics-mock-balance-v439.js'"));
assert(sw.includes('v439-physics-mock-breadth'));
console.log('PASS v439: five AS topic strands, six required practicals, balanced flash/exam mocks, unrelated filter isolation and offline helper.');
