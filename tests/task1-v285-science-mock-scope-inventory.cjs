'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),core=j('deck.json'),original=j('exam_questions.json');
const flash=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const qfiles=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const a=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),b=app.indexOf(' const added=[',a);
assert(a>=0&&b>a);
// Mirror the site's runtime-only legacy metadata tags before measuring missing specRefs.
// The original deck.json stays untouched, and this does not change eligibility.
const mappedCore=JSON.parse(JSON.stringify(core.cards));
const mapStart=app.indexOf('// v287: exact-ID AQA AS subsection metadata'),mapEnd=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards',mapStart);
assert(mapStart>=0&&mapEnd>mapStart,'The current deck mapping functions must be present');
const maps=new Function(app.slice(mapStart,mapEnd)+'\nreturn {applyV287LegacySpecRefs,applyV288LegacyChemBondingSpecRefs,applyV289LegacyEnergeticsSpecRefs,applyV290LegacyElectricitySpecRefs};')();
for(const fn of Object.values(maps))fn(mappedCore);
const runtimeMetadataUpdates=mappedCore.filter((c,i)=>String(c.specRef||'')!==String(core.cards[i].specRef||'')).length;
assert.equal(runtimeMetadataUpdates,353,'The four independently verified exact-ID maps should attach 353 new AQA references');
const allCards=new Function('cards','extraFlashBanks',app.slice(a,b)+'\nreturn cards;')(mappedCore,flash.map(j));
const allQuestions=[...original.questions,...qfiles.flatMap(f=>j(f).questions||[])];
const start=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),end=app.indexOf('function startMockSession(){',start);
assert(start>=0&&end>start);
const {mockEligibleCard,mockEligibleQuestion}=new Function(app.slice(start,end)+'\nreturn {mockEligibleCard,mockEligibleQuestion};')();
const counts=items=>{const map={};for(const x of items){const ref=String(x.specRef||'not specified');map[ref]=(map[ref]||0)+1;}return Object.entries(map).sort((a,b)=>b[1]-a[1]).map(([ref,count])=>({ref,count}));};
const distribution=items=>{const map={};for(const x of items){const stage=String(x.stage||x.level||'not specified');map[stage]=(map[stage]||0)+1;}return map;};
const review={version:'v285/v291',runtimeLegacySpecTagsApplied:runtimeMetadataUpdates,allLoadedCards:allCards.length,allExamQuestions:allQuestions.length};
for(const subject of ['Physics','Chemistry']){
 const cards=allCards.filter(c=>c.subject===subject&&c.active!==false&&mockEligibleCard(c));
 const qs=allQuestions.filter(q=>q.subject===subject&&mockEligibleQuestion(q));
 const explicitlyUntaughtCards=cards.filter(c=>c.taught===false);
 const explicitlyUntaughtQuestions=qs.filter(q=>q.taught===false);
 const cardsWithoutTaughtFlag=cards.filter(c=>c.taught===undefined);
 const questionsWithoutTaughtFlag=qs.filter(q=>q.taught===undefined);
 const a2Cards=cards.filter(c=>c.stage==='A2');
 const a2Questions=qs.filter(q=>q.level==='A2');
 const mentionsBuffers=x=>/\bbuffers?\b/i.test([x.topic,x.front,x.back,x.prompt,x.question].filter(Boolean).join(' '));
 const bufferCardCandidates=subject==='Chemistry'?cards.filter(mentionsBuffers):[];
 const bufferQuestionCandidates=subject==='Chemistry'?qs.filter(mentionsBuffers):[];
 const rp9PHCurveCards=subject==='Chemistry'?cards.filter(x=>/RP9 pH curves/i.test(String(x.topic||''))):[];
 const noRefCards=cards.filter(c=>!String(c.specRef||'').trim());
 const noRefQuestions=qs.filter(q=>!String(q.specRef||'').trim());
 const topicCounts=arr=>Object.entries(arr.reduce((map,x)=>{const topic=String(x.topic||x.courseTopic||'not specified');map[topic]=(map[topic]||0)+1;return map;},{})).sort((a,b)=>b[1]-a[1]).map(([topic,count])=>({topic,count}));
 const examples=arr=>arr.slice(0,70).map(x=>({id:x.id,topic:x.topic,specRef:x.specRef,stage:x.stage||x.level,front:String(x.front||x.question||x.prompt||'').slice(0,170)}));
 review[subject]={cards:cards.length,questions:qs.length,cardStageBreakdown:distribution(cards),questionLevelBreakdown:distribution(qs),
  cardSpecRefs:counts(cards),questionSpecRefs:counts(qs),untaughtCardCount:explicitlyUntaughtCards.length,
  untaughtQuestionCount:explicitlyUntaughtQuestions.length,missingTaughtFlagOnCards:cardsWithoutTaughtFlag.length,missingTaughtFlagOnQuestions:questionsWithoutTaughtFlag.length,
  explicitUntaughtCardExamples:examples(explicitlyUntaughtCards),
  explicitUntaughtQuestionExamples:examples(explicitlyUntaughtQuestions),
  missingSpecRefCards:noRefCards.length,missingSpecRefQuestions:noRefQuestions.length,
  missingSpecRefCardTopics:topicCounts(noRefCards).slice(0,35),missingSpecRefQuestionTopics:topicCounts(noRefQuestions).slice(0,35),
  missingSpecRefCardExamples:examples(noRefCards).slice(0,20),missingSpecRefQuestionExamples:examples(noRefQuestions).slice(0,20),
  A2CardCount:a2Cards.length,A2QuestionCount:a2Questions.length,
  A2CardTopics:topicCounts(a2Cards),A2QuestionTopics:topicCounts(a2Questions),
  bufferCardCandidateCount:bufferCardCandidates.length,bufferQuestionCandidateCount:bufferQuestionCandidates.length,
  bufferCardCandidateExamples:examples(bufferCardCandidates),bufferQuestionCandidateExamples:examples(bufferQuestionCandidates),
  rp9PHCurveCardCount:rp9PHCurveCards.length,rp9PHCurveCardExamples:examples(rp9PHCurveCards),
  A2CardExamples:examples(a2Cards),A2QuestionExamples:examples(a2Questions)};
 if(subject==='Physics'){assert.equal(a2Cards.length,0,'A2 Physics card unexpectedly in AS mock');assert.equal(a2Questions.length,0,'A2 Physics question unexpectedly in AS mock');}
}
console.log('AUDIT_V285_JSON_BEGIN');console.log(JSON.stringify(review,null,2));console.log('AUDIT_V285_JSON_END');
console.log('PASS v285: enumerated actual Science mock selection; untaught/unknown flags and taught Year 2 content require teacher-scope review before any automatic exclusions.');
