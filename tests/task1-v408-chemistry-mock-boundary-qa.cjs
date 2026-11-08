'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js');
const deck=json('deck.json'),original=json('exam_questions.json');
assert.equal(deck.cards.length,3345);
assert.equal(original.questions.length,1268);
assert.equal(new Set(deck.cards.map(c=>c.id)).size,3345);
assert.equal(new Set(original.questions.map(q=>q.id)).size,1268);
const start=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS=');
const end=app.indexOf('function startMockSession(){',start);
assert(start>0&&end>start,'Find exact deployed school-mock selectors');
const live=new Function(app.slice(start,end)+
 '\nreturn {card:mockEligibleCard,question:mockEligibleQuestion,buffer:chemistryMockBufferExcluded};')();
const card=(front,changes={})=>({
 subject:'Chemistry',id:'v408_synthetic_card',stage:'AS',
 mock:true,active:true,topic:'Acids and bases',
 front,back:'Correct AQA answer.',...changes});
const question=(prompt,changes={})=>({
 subject:'Chemistry',id:'v408_synthetic_question',level:'AS',
 mock:true,taught:true,standalone:true,topic:'Acids and bases',
 prompt,modelAnswer:'Correct AQA answer.',...changes});
const excludedCards=[
 card('Define a buffer solution.'),
 card('How is a buffered solution defined?'),
 card('What is buffering?'),
 card('Explain Henderson-Hasselbalch.'),
 card('What is half neutralisation?'),
 card('What is Ka?',{subtopic:'Preparing buffer solutions'}),
 card('Define pH.',{topic:'Buffers'}),
 card('What is pH?',{question:'Buffer calculations'})
];
const excludedQuestions=[
 question('Explain how a buffer resists changes in pH.'),
 question('How is a buffer solution prepared?'),
 question('Explain half-neutralization.'),
 question('Interpret a Henderson Hasselbalch plot.'),
 question('Calculate Ka.',{subtopic:'Acid buffer capacity'}),
 question('Calculate pH.',{question:'Buffer solution calculation'})
];
for(const c of excludedCards)assert.equal(live.card(c),false,'Buffer flashcard reached mock '+c.front);
for(const q of excludedQuestions)assert.equal(live.question(q),false,'Buffer exam question reached mock '+q.prompt);
const validCards=[
 card('Calculate the pH of a strong monoprotic acid.',{subtopic:'Strong acids'}),
 card('Write an expression for Ka for a weak acid.'),
 card('Calculate Kw from given concentrations.',{subtopic:'Ionic product of water'}),
 card('State why the concentration of H+ is not always the initial concentration of a weak acid.'),
 card('Calculate Kp for a gaseous equilibrium.',{topic:'Equilibria'}),
 card('Define Ka.',{back:'It is not a buffer equation; Ka is [H+][A−]/[HA].'})
];
const validQuestions=[
 question('A weak monoprotic acid has a Ka value. Calculate pH.'),
 question('Calculate Ka from equilibrium data for a weak acid.'),
 question('State the ionic product of water Kw.'),
 question('Calculate Kp in kPa for a gaseous equilibrium.',{topic:'Equilibria'}),
 question('Calculate the pH of the solution.',{modelAnswer:'Unlike a buffer, this is an unbuffered strong acid.'})
];
for(const c of validCards)assert.equal(live.card(c),true,'Valid Chemistry card wrongly excluded '+c.front);
for(const q of validQuestions)assert.equal(live.question(q),true,'Valid Chemistry question wrongly excluded '+q.prompt);
assert.equal(live.card(card('What is a buffer?',{subject:'Physics'})),true,'Do not alter Physics mock selection');
assert.equal(live.question(question('What is a buffer?',{subject:'Physics'})),true,'Do not alter Physics exam selection');
assert.equal(live.card(card('A', {mock:false})),false);
assert.equal(live.question(question('A', {mock:false})),false);
assert.equal(live.question({id:'v408_synthetic_maths',subject:'Maths',level:'AS',
 mock:true,topic:'Pure',prompt:'Solve x² = 4.'}),true);
assert.equal(live.question({id:'v408_synthetic_maths',subject:'Maths',level:'A2',
 mock:true,topic:'Pure',prompt:'Solve x² = 4.'}),false);
assert.equal(live.question({id:'v408_synthetic_maths',subject:'Maths',level:'AS',
 mock:true,topic:'Pure',prompt:'Express angle in radians.'}),false);
const paths=kind=>{
 const re=new RegExp('const EXTRA_'+kind+'_URLS=\\[([^\\]]+)\\];');
 const match=app.match(re);
 assert(match,'Missing '+kind+' source list');
 return [...match[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
};
const flashFiles=paths('FLASHCARD'),questionFiles=paths('PRACTICE');
assert.equal(flashFiles.length,56,'Historical flashcard loader changed');
assert.equal(questionFiles.length,52,'v407 practice loader changed');
const focused=[
 'maths_first_mock_micro_recall_v348.json',
 'chemistry_cracking_pressure_recall_v354.json',
 'chemistry_alkane_trend_recall_v367.json',
 'physics_light_history_recall_v370.json',
 'chemistry_kp_catalyst_recall_v375.json'];
const allCards=[...deck.cards,...[...flashFiles,...focused].flatMap(f=>
 (json(f).cards||[]).map(c=>({...c,__file:f})))];
const allQuestions=[...original.questions,...questionFiles.flatMap(f=>
 (json(f).questions||[]).map(q=>({...q,__file:f})))];
const scoped=/(?:\bbuffers?\b|\bbuffered\b|\bbuffering\b|\bhenderson[\s-]*hasselbalch\b|\bhalf[\s-]*neutralis(?:ation|ation)\b)/i;
const relevant=c=>[c.topic,c.subtopic,c.courseTopic,c.revisionTopic,c.question,c.front??c.prompt]
 .map(s=>String(s||'')).join(' ');
let bad=0,excludedCardsFound=0,excludedQsFound=0,answerOnlyCards=0,answerOnlyQs=0;
for(const c of allCards){
 if(c.subject!=='Chemistry'||c.mock!==true||c.active===false)continue;
 const candidate=scoped.test(relevant(c));
 if(candidate){
  excludedCardsFound++;
  if(live.card(c)){console.error('LEAKED CARD',c.id,c.__file);bad++;}
 }
 if(!candidate&&scoped.test(String(c.back||'')))answerOnlyCards++;
}
for(const q of allQuestions){
 if(q.subject!=='Chemistry'||q.mock!==true)continue;
 const candidate=scoped.test(relevant(q));
 if(candidate){
  excludedQsFound++;
  if(live.question(q)){console.error('LEAKED QUESTION',q.id,q.__file);bad++;}
 }
 if(!candidate&&scoped.test(String(q.modelAnswer||'')))answerOnlyQs++;
}
assert.equal(bad,0,'Chemistry buffer content leaked into actual school mock selector');
const electricity=json('physics_electricity_manual_sketch_practice_v407.json');
assert.equal(electricity.questions.length,4);
for(const q of electricity.questions)assert.equal(live.question(q),true,'v407 Electricity question lost');
const es=app.indexOf('function examSuggested(q,answer){'),
 manualStop=app.indexOf(' // v404:',es);
assert(es>0&&manualStop>es);
const suggestion=new Function(app.slice(es,manualStop)+'\n}\nreturn examSuggested;')();
let manualProbes=0;
for(const q of electricity.questions)for(const answer of [
 q.modelAnswer,'wrong signs, graph slopes the other way',
 'The model answer is wrong; the circuit is reversed.',q.prompt,''
]){
 const s=suggestion(q,answer);
 assert.equal(s.manualRequired,true);
 assert.equal(s.suggested,0);
 assert.deepEqual(s.preds,Array(q.marks).fill(false));
 manualProbes++;
}
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'",
 "PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])
 assert(app.includes(k));
assert(sw.includes('v407-electricity-practice'),'Preserve last production cache');
console.log('PASS v408: synthetic Chemistry buffer exclusions '+excludedCards.length+' cards and '+excludedQuestions.length+
 ' exam questions; valid Ka/Kw/pH/Kp controls '+(validCards.length+validQuestions.length)+
 '; scanned '+allCards.length+' core+supplement cards and '+allQuestions.length+' exam questions; explicitly scoped Chemistry buffers '+
 excludedCardsFound+' cards and '+excludedQsFound+' questions now filtered; answer-only term flags '+
 answerOnlyCards+' cards and '+answerOnlyQs+' questions (editorial follow-up only); '+manualProbes+
 ' v407 manual drawing/proof marking control probes; saved progress, XP and 3,345 core IDs unchanged.');
