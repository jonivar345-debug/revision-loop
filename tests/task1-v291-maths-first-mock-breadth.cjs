'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),deck=j('deck.json'),base=j('exam_questions.json');
const flash=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const practice=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const a=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),b=app.indexOf(' const added=[',a);
assert(a>0&&b>a);
const loaded=new Function('cards','extraFlashBanks',app.slice(a,b)+'\nreturn cards;')([...deck.cards],flash.map(j));
const questions=[...base.questions,...practice.flatMap(f=>j(f).questions||[])];
const ls=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),le=app.indexOf('function startMockSession(){',ls);
assert(ls>=0&&le>ls);
const {mockEligibleCard,mockEligibleQuestion}=new Function(app.slice(ls,le)+'\nreturn {mockEligibleCard,mockEligibleQuestion};')();
const cards=loaded.filter(c=>c.subject==='Maths'&&mockEligibleCard(c)),qs=questions.filter(q=>q.subject==='Maths'&&mockEligibleQuestion(q));
assert(cards.length>=286,'Year 1 Pure card pool must not shrink');assert(qs.length>=159,'Year 1 Pure question pool must not shrink after v292');
const categories=[
 {id:'A',name:'Proof',keywords:/\bproof\b|contradiction|counterexamples?|deduction|exhaustion|divisibility|reasoning/i},
 {id:'B',name:'Algebra and functions',keywords:/algebra|function|transform|inequalit|binomial|surds?|indices|factor|polynomial|partial fractions?|modulus|quadratic|discriminant|roots?/i},
 {id:'C',name:'Coordinate geometry',keywords:/coordinate|circles?|straight lines?|tangent|normal to|perpendicular|midpoint|gradient of a line/i},
 {id:'D',name:'Sequences and series',keywords:/sequences?|series|arithmet|geometric progression|summation|sigma notation/i},
 {id:'E',name:'Trigonometry',keywords:/trigonometry|sin\b|cos\b|tan\b|degrees?|sine|cosine|trig|radian/i},
 {id:'F',name:'Exponentials and logarithms',keywords:/exponential|logarithm|logarith|\blogs?\b|\bln\b/i},
 {id:'G',name:'Differentiation',keywords:/differentiat|derivative|stationary points?|turning points?|optimis|rate of change/i},
 {id:'H',name:'Integration',keywords:/integrat|antiderivative|area under|area between/i},
 {id:'J',name:'Vectors',keywords:/vectors?|collinear|position vector|resultant vector|magnitude and direction/i}
];
const getFields=(x,card)=>[String(x.topic||''),String(x.courseTopic||''),String(x.revisionTopic||''),...(card?[]:[String(x.subtopic||'')])].filter(Boolean);
const byLabel=xs=>{const map=new Map();for(const x of xs){const label=String(x.topic||x.courseTopic||'untagged');if(!map.has(label))map.set(label,[]);map.get(label).push(x);}return [...map.entries()].sort((a,b)=>b[1].length-a[1].length).map(([topic,rows])=>({topic,count:rows.length,sampleIds:rows.slice(0,5).map(x=>x.id),examples:rows.slice(0,2).map(x=>String(x.front||x.question||x.prompt||'').slice(0,200))}))};
const results=categories.map(c=>{
 const cm=cards.filter(x=>getFields(x,true).some(f=>c.keywords.test(f)));
 const qm=qs.filter(x=>getFields(x,false).some(f=>c.keywords.test(f)));
 return {section:c.id,name:c.name,mappedCardCount:cm.length,mappedQuestionCount:qm.length,cardSamples:cm.slice(0,6).map(x=>({id:x.id,topic:x.topic,front:String(x.front||'').slice(0,100)})),questionSamples:qm.slice(0,6).map(x=>({id:x.id,topic:x.topic,prompt:String(x.question||x.prompt||'').slice(0,100)}))};
});
const cardTagged=new Set(categories.flatMap(c=>cards.filter(x=>getFields(x,true).some(f=>c.keywords.test(f))).map(x=>x.id)));
const questionTagged=new Set(categories.flatMap(c=>qs.filter(x=>getFields(x,false).some(f=>c.keywords.test(f))).map(x=>x.id)));
const unmatchedCards=cards.filter(x=>!cardTagged.has(x.id));
const unmatchedQuestions=qs.filter(x=>!questionTagged.has(x.id));
const report={version:'v291',date:'2026-11-01',scope:'School first mock AQA Year 1 Pure maths only',officialSpecification:'https://www.aqa.org.uk/subjects/mathematics/a-level/mathematics-7357/specification/subject-content',eligibleCards:cards.length,eligibleQuestions:qs.length,categories:results,rawCardTopics:byLabel(cards),rawQuestionTopics:byLabel(qs),unclassifiedCardCount:unmatchedCards.length,unclassifiedQuestionCount:unmatchedQuestions.length,unclassifiedCardExamples:unmatchedCards.slice(0,60).map(x=>({id:x.id,topic:x.topic,front:String(x.front||'').slice(0,130)})),unclassifiedQuestionExamples:unmatchedQuestions.slice(0,50).map(x=>({id:x.id,topic:x.topic,question:String(x.question||x.prompt||'').slice(0,130)})),notes:['One item may match multiple AQA areas by its legacy topic name; category counts cannot simply be summed.','A year-1 topic evidenced by at least one item is not sufficient to certify all assessable bullets, hard applications or marking.','AQA whole-A-level section I Numerical methods and applied subjects are excluded from this school first mock.']};
console.log('AUDIT_V291_JSON_BEGIN');console.log(JSON.stringify(report,null,2));console.log('AUDIT_V291_JSON_END');
console.log('PASS v291: 286 eligible Year 1 Pure cards and 159 eligible questions grouped by actual topic tags; unclassified items retained for manual review.');
