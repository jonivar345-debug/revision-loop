'use strict';
// v450: Year 13 Pure source/boundary regression, independent of prior mock baselines.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const pack=JSON.parse(fs.readFileSync('maths_year13_pure_v450.json','utf8'));
const app=fs.readFileSync('app.js','utf8'),html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
assert.equal(pack.version,'v450');
assert.equal(pack.cards.length,123);
assert.equal(pack.questions.length,62);
assert.equal(new Set(pack.cards.map(x=>x.id)).size,123);
assert.equal(new Set(pack.questions.map(x=>x.id)).size,62);
assert.deepEqual(pack.cards.map(x=>x.id),Array.from({length:123},(_,i)=>'y13_v450_card_'+String(i+1).padStart(3,'0')));
assert.deepEqual(pack.questions.map(x=>x.id),Array.from({length:62},(_,i)=>'y13_v450_q_'+String(i+1).padStart(3,'0')));
assert.equal(pack.cards.filter(c=>c.mock).length,110);
assert.equal(pack.cards.filter(c=>!c.mock).length,13);
assert.equal(pack.questions.filter(q=>q.mock).length,56);
assert.equal(pack.questions.filter(q=>!q.mock).length,6);
assert.equal(pack.questions.reduce((n,q)=>n+q.marks,0),245);
const topicMin=['Radians','Trigonometric identities','Trigonometric equations',
 'Differentiation rules','Implicit and trigonometric differentiation',
 'Functions and inverses','Transformations and modulus','Algebra and partial fractions',
 'Proof','Sequences and series','Binomial (fractional and negative)',
 'Year 2 integration','Exponentials and logarithms'];
for(const topic of topicMin){
 assert(pack.cards.some(x=>x.revisionTopic===topic&&x.mock===true),'Missing recall '+topic);
 assert(pack.questions.some(x=>x.revisionTopic===topic&&x.mock===true),'Missing worked question '+topic);
}
for(const c of pack.cards){
 assert.equal(c.subject,'Maths');assert.equal(c.stage,'A2');
 assert(c.front.trim().length>=10&&c.front.length<=170&&c.back.trim().length>=1&&c.back.length<=180,c.id);
 assert(Array.isArray(c.accept)&&c.accept.length>=1);
 assert.equal(c.year13PureMock===true,c.mock===true);
 assert.equal(c.year13Optional===true,c.mock===false);
 if(c.mock)assert(c.taught===true&&c.scope==='mock'&&c.courseTopic==='Year 13 Pure · taught mock');
 else assert(c.taught===false&&c.scope==='full'&&c.courseTopic==='Year 13 Pure · additional practice');
}
for(const q of pack.questions){
 assert.equal(q.subject,'Maths');assert.equal(q.level,'A-level');assert.equal(q.year,'Practice');
 assert(q.verificationLevel==='original-exam-style'&&q.sourceVerified===false);
 assert(q.markPoints.length===q.marks&&q.markPointMarks.length===q.marks);
 assert(q.markPointMarks.every(x=>x===1));
 assert(q.requiresWorking===true&&q.manualWorkingReview===true&&q.answerType==='points');
 assert(q.modelAnswer.length>50&&q.markPoints.every(p=>q.modelAnswer.includes(p)));
 assert.equal(q.year13PureMock===true,q.mock===true);
 assert.equal(q.year13Optional===true,q.mock===false);
 if(q.mock)assert(q.taught===true&&q.courseTopic==='Year 13 Pure · taught mock');
 else assert(q.taught===false&&q.courseTopic==='Year 13 Pure · additional practice');
 assert(q.prompt.endsWith('['+q.marks+' marks]'),q.id);
}
for(const id of ['y13_v450_card_001','y13_v450_q_001','y13_v450_card_123','y13_v450_q_062'])
 assert(id.startsWith('y13_v450_'));
const i=app.indexOf('function currentYear13PureMockCard('),j=app.indexOf('// Build a bounded batch.',i);
assert(i>=0&&j>i);
const ctx={};vm.runInNewContext(app.slice(i,j)+'\nthis.isCard=currentYear13PureMockCard;this.isQuestion=currentYear13PureMockQuestion;',ctx);
assert.equal(pack.cards.filter(ctx.isCard).length,110);
assert.equal(pack.questions.filter(ctx.isQuestion).length,56);
for(const c of pack.cards.filter(x=>!x.mock))assert(!ctx.isCard(c),'Optional card wrongly in mock '+c.id);
for(const q of pack.questions.filter(x=>!x.mock))assert(!ctx.isQuestion(q),'Optional exam in mock '+q.id);
for(const fake of [
 {id:'old_as_pure',subject:'Maths',stage:'AS',mock:true},
 {id:'old_chemistry',subject:'Chemistry',stage:'A2',mock:true},
 {id:'old_physics',subject:'Physics',stage:'AS',mock:true},
 {id:'y13_v450_card_999',subject:'Maths',stage:'A2',mock:true}
])assert(!ctx.isCard(fake));
assert(!ctx.isQuestion({id:'old_as_question',subject:'Maths',level:'AS',mock:true}));
assert(app.includes("const mustOnly=sub==='Maths'&&settings.recallMustKnowFirst!==false;"));
assert(app.includes("const effectiveMode=mustOnly?'flash':mode;"));
assert(app.includes("const cardPool=sub==='Maths'?cards.filter(c=>currentYear13PureMockCard(c)&&(!mustOnly||isRecallMustKnow(c))):[]"));
assert(app.includes("const qAll=sub==='Maths'&&!mustOnly?examQuestions.filter(currentYear13PureMockQuestion):[]"));
// v462's dedicated tests also execute the real selector in mixed, exam and unlimited modes.
assert(app.includes("function flashEligible(c){return flashScopeFilter==='mock'?currentYear13PureMockCard(c)"));
assert(app.includes("function challengeCards(sub,scope)")&&app.includes("a.filter(currentYear13PureMockCard)"));
assert(app.includes("function challengeQuestions(sub,scope)")&&app.includes("q.filter(currentYear13PureMockQuestion)"));
assert(app.includes('validatedV450Questions')&&app.includes('V450_YEAR13_PURE_URL'));
assert(html.includes('<select id="mockSubject"><option value="Maths" selected>Year 13 AQA Pure Maths'));
assert(html.includes('id="examYear13Preset"'));
assert(html.includes('year13=v450'));
assert(html.includes('id="mathsMockScopeNote"')&&!html.includes('Maths first mock: Year 12/AS Pure only.'));
assert(sw.includes("'./maths_year13_pure_v450.json'"));
assert(sw.includes('v450-year13-pure-mock'));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
const byId=id=>pack.questions.find(q=>q.id===id);
assert(byId('y13_v450_q_004').modelAnswer.includes('2π/3'));
assert(byId('y13_v450_q_030').modelAnswer.includes('320/9'));
assert(byId('y13_v450_q_035').modelAnswer.includes('−9/8'));
assert(byId('y13_v450_q_050').modelAnswer.includes('x=3'));
console.log('PASS v450: 123 cards (110 current mock), 62 original worked questions (56 current mock), 245 marks, 13 taught-topic groups, hard exclusion of old AS/Physics/Chemistry/optional material; cloud keys and offline preserved');
