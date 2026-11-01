'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),core=j('deck.json'),baseQuestions=j('exam_questions.json');
const flashNames=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const questionNames=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const start=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),end=app.indexOf(' const added=[',start);
assert(start>0&&end>start);
const loader=new Function('cards','extraFlashBanks',app.slice(start,end)+'\nreturn cards;');
const cards=loader([...core.cards],flashNames.map(x=>j(x)));
const questions=[...baseQuestions.questions,...questionNames.flatMap(x=>j(x).questions||[])];
const bs=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),be=app.indexOf('function startMockSession(){',bs);
assert(bs>0&&be>bs);
const {mockEligibleCard,mockEligibleQuestion,excluded}=new Function(app.slice(bs,be)+'\nreturn {mockEligibleCard,mockEligibleQuestion,excluded:MOCK_MATHS_YEAR2_EXCLUDED_IDS};')();
const mathCards=cards.filter(x=>x.subject==='Maths'),mathQuestions=questions.filter(x=>x.subject==='Maths');
const c=mathCards.filter(mockEligibleCard),q=mathQuestions.filter(mockEligibleQuestion);
assert(c.length>20&&q.length>20,'The school first mock must remain populated.');
for(const card of c){
 assert.equal(card.stage,'AS','Year 2 card leaked '+card.id);
 assert.equal(card.mock,true,'Non-mock card leaked '+card.id);
 assert(!['Statistics','Mechanics'].includes(card.topic),'Non-Pure card leaked '+card.id);
 assert(!excluded.has(card.id),'Explicit excluded card leaked '+card.id);
}
for(const item of q){
 assert.equal(item.level,'AS','Year 2 exam question leaked '+item.id);
 assert.equal(item.mock,true,'Non-mock exam leaked '+item.id);
 assert(!['statistics','mechanics'].includes(String(item.topic||'').toLowerCase()),'Non-pure exam leaked '+item.id);
}
const suspect=/\b(?:radians?|secant|cosecant|cotangent|partial fractions?|proof by contradiction|product rule|quotient rule|chain rule|integration by parts|integration by substitution|implicit differentiation|parametric equations?|differential equations?|binomial expansion with negative index|binomial expansion with fractional index)\b/i;
const waves=(a,fields)=>a.filter(x=>fields.some(key=>suspect.test(String(x[key]||'')))).map(x=>({id:x.id,topic:x.topic,text:fields.map(k=>x[k]).filter(Boolean).join(' | ').slice(0,190)}));
const semanticCardFlags=waves(c,['front','back','courseTopic','topic']);
const semanticQuestionFlags=waves(q,['prompt','question','courseTopic','topic']);
const qExcludedPi=mathQuestions.filter(x=>x.mock===true&&x.level==='AS'&&!mockEligibleQuestion(x)&&/π/.test(String(x.prompt||''))).map(x=>({id:x.id,topic:x.topic,prompt:String(x.prompt||'').slice(0,140)}));
const year2MockFlagged=mathQuestions.filter(x=>x.mock===true&&x.level==='A2').length;
const samples={year1PureCardPool:c.length,year1PurePracticePool:q.length,allMathCards:mathCards.length,allMathQuestions:mathQuestions.length,
  explicitExcludedIds:excluded.size,year2QuestionsFlaggedMockButFiltered:year2MockFlagged,
  semanticCardCandidateCount:semanticCardFlags.length,semanticQuestionCandidateCount:semanticQuestionFlags.length,
  semanticCardCandidates:semanticCardFlags.slice(0,35),semanticQuestionCandidates:semanticQuestionFlags.slice(0,35),
  ASQuestionsExcludedBecauseOfPi:qExcludedPi.slice(0,40),ASQuestionsExcludedBecauseOfPiCount:qExcludedPi.length,
  confirmedLeakageFromHardScopeChecks:0};
console.log('AUDIT_V284_JSON_BEGIN');console.log(JSON.stringify(samples,null,2));console.log('AUDIT_V284_JSON_END');
console.log('PASS v284: Year 1 Pure hard eligibility boundaries checked against all actual loaded cards and practice questions; semantic flags are review-only, not automatic removals.');
