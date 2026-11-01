'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),core=j('deck.json'),original=j('exam_questions.json');
const flash=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const qfiles=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const a=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),b=app.indexOf(' const added=[',a);
assert(a>=0&&b>a);
const allCards=new Function('cards','extraFlashBanks',app.slice(a,b)+'\nreturn cards;')([...core.cards],flash.map(j));
const allQuestions=[...original.questions,...qfiles.flatMap(f=>j(f).questions||[])];
const start=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),end=app.indexOf('function startMockSession(){',start);
assert(start>=0&&end>start);
const {mockEligibleCard,mockEligibleQuestion}=new Function(app.slice(start,end)+'\nreturn {mockEligibleCard,mockEligibleQuestion};')();
const counts=items=>{const map={};for(const x of items){const ref=String(x.specRef||'not specified');map[ref]=(map[ref]||0)+1;}return Object.entries(map).sort((a,b)=>b[1]-a[1]).map(([ref,count])=>({ref,count}));};
const distribution=items=>{const map={};for(const x of items){const stage=String(x.stage||x.level||'not specified');map[stage]=(map[stage]||0)+1;}return map;};
const review={version:'v285',allLoadedCards:allCards.length,allExamQuestions:allQuestions.length};
for(const subject of ['Physics','Chemistry']){
 const cards=allCards.filter(c=>c.subject===subject&&c.active!==false&&mockEligibleCard(c));
 const qs=allQuestions.filter(q=>q.subject===subject&&mockEligibleQuestion(q));
 const explicitlyUntaughtCards=cards.filter(c=>c.taught===false);
 const explicitlyUntaughtQuestions=qs.filter(q=>q.taught===false);
 const cardsWithoutTaughtFlag=cards.filter(c=>c.taught===undefined);
 const questionsWithoutTaughtFlag=qs.filter(q=>q.taught===undefined);
 const a2Cards=cards.filter(c=>c.stage==='A2');
 const a2Questions=qs.filter(q=>q.level==='A2');
 const examples=arr=>arr.slice(0,70).map(x=>({id:x.id,topic:x.topic,specRef:x.specRef,stage:x.stage||x.level,front:String(x.front||x.question||x.prompt||'').slice(0,170)}));
 review[subject]={cards:cards.length,questions:qs.length,cardStageBreakdown:distribution(cards),questionLevelBreakdown:distribution(qs),
  cardSpecRefs:counts(cards),questionSpecRefs:counts(qs),untaughtCardCount:explicitlyUntaughtCards.length,
  untaughtQuestionCount:explicitlyUntaughtQuestions.length,missingTaughtFlagOnCards:cardsWithoutTaughtFlag.length,missingTaughtFlagOnQuestions:questionsWithoutTaughtFlag.length,
  explicitUntaughtCardExamples:examples(explicitlyUntaughtCards),
  explicitUntaughtQuestionExamples:examples(explicitlyUntaughtQuestions),
  A2CardCount:a2Cards.length,A2QuestionCount:a2Questions.length,
  A2CardExamples:examples(a2Cards),A2QuestionExamples:examples(a2Questions)};
 if(subject==='Physics'){assert.equal(a2Cards.length,0,'A2 Physics card unexpectedly in AS mock');assert.equal(a2Questions.length,0,'A2 Physics question unexpectedly in AS mock');}
}
console.log('AUDIT_V285_JSON_BEGIN');console.log(JSON.stringify(review,null,2));console.log('AUDIT_V285_JSON_END');
console.log('PASS v285: enumerated actual Science mock selection; untaught/unknown flags and taught Year 2 content require teacher-scope review before any automatic exclusions.');
