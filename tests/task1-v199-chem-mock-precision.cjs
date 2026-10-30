'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const get=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const cards=get('chemistry_mock_recall_v199.json'),bank=get('chemistry_mock_precision_v199.json'),audit=get('editorial/task1-v199-chemistry-mock-tests-crosswalk.json');
const mainDeck=get('deck.json'),mainQuestions=get('exam_questions.json');
const cardFiles=['maths_mock_recall_v186.json','maths_mock_recall_v187.json','chemistry_mock_recall_v189.json','maths_mock_recall_v192.json','physics_mock_recall_v193.json','chemistry_mock_recall_v193.json','physics_mock_recall_v195.json','chemistry_mock_recall_v195.json','physics_mock_recall_v196.json','chemistry_mock_recall_v196.json'];
const questionFiles=['maths_pure_proof_vectors_v190.json','maths_as_pure_gap_challenges_v191.json','science_practical_data_v194.json','science_mock_application_v195.json','science_mock_evidence_v196.json','physics_mechanics_reasoning_v197.json','science_waves_energetics_v198.json'];
const app=fs.readFileSync('app.js','utf8'),html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
assert.equal(cards.version,'v199');assert.equal(bank.version,'v199');assert.equal(audit.version,'v199');
assert.equal(cards.cards.length,13);assert.equal(bank.questions.length,8);
assert.deepEqual(bank.questions.map(q=>q.marks),[8,8,7,8,7,8,7,7]);
assert.equal(bank.questions.reduce((a,q)=>a+q.marks,0),60);
assert.equal(audit.counts.newCards,13);assert.equal(audit.counts.newOriginalQuestions,8);assert.equal(audit.counts.newMarks,60);
assert.equal(audit.task1Complete,false);assert.equal(audit.masteryCertified,false);
assert.equal(mainDeck.cards.length,3345);assert.equal(mainQuestions.questions.length,1268);
const prevCards=new Set([...mainDeck.cards,...cardFiles.flatMap(f=>get(f).cards)].map(c=>c.id));
const prevQuestions=[...mainQuestions.questions,...questionFiles.flatMap(f=>get(f).questions)];
const prevQIDs=new Set(prevQuestions.map(q=>q.id));
const start=app.indexOf('function normalise('),stop=app.indexOf('function importantTokens(',start);
assert(start>=0&&stop>start);
const evaluate=new Function('window',app.slice(start,stop)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const c of cards.cards){
 assert(!prevCards.has(c.id),'Duplicate Chemistry flashcard ID: '+c.id);prevCards.add(c.id);
 assert(c.subject==='Chemistry'&&['AS','A2'].includes(c.stage)&&c.mock===true&&c.taught===true&&c.active===true&&c.scope==='mock');
 assert(c.strictRecall===true&&c.accept.includes(c.back)&&c.accept.length>=4&&c.reject.length>=3);
 assert(c.front.length<185&&c.back.length<160);
 assert(!/buffer/i.test(c.front+' '+c.back));
 for(const a of c.accept)assert.equal(evaluate(c,a).status,'correct','False rejection: '+c.id+' '+a);
 for(const a of c.reject)assert.notEqual(evaluate(c,a).status,'correct','False credit: '+c.id+' '+a);
 assert.equal(evaluate(c,'').status,'neutral');
}
// Independent chemical facts: self-consistent accept/reject arrays alone are not enough.
const cardBy=id=>cards.cards.find(c=>c.id===id);
assert.equal(evaluate(cardBy('task1_v199_chem_001'),'brick-red copper(I) oxide precipitate').status,'correct');
assert.notEqual(evaluate(cardBy('task1_v199_chem_001'),'remains blue').status,'correct');
assert.equal(evaluate(cardBy('task1_v199_chem_004'),'carboxylic acid').status,'correct');
assert.notEqual(evaluate(cardBy('task1_v199_chem_004'),'carboxylate salt').status,'correct');
assert.equal(evaluate(cardBy('task1_v199_chem_005'),'carboxylate salt').status,'correct');
assert.equal(evaluate(cardBy('task1_v199_chem_008'),'kPa^1').status,'correct');
assert.notEqual(evaluate(cardBy('task1_v199_chem_008'),'kPa^-1').status,'correct');
assert.equal(evaluate(cardBy('task1_v199_chem_009'),'kPa^-1').status,'correct');
assert.notEqual(evaluate(cardBy('task1_v199_chem_009'),'kPa').status,'correct');
assert.notEqual(evaluate(cardBy('task1_v199_chem_005'),'free carboxylic acid').status,'correct');
// Reject lists must not collide with an independently accepted wording.
for(const card of cards.cards){
 const canonical=s=>String(s).toLowerCase().replace(/[‐‑−–—⁻]/g,'-').replace(/[^a-z0-9-]/g,'');
 const accept=new Set(card.accept.map(canonical));
 for(const bad of card.reject)assert(!accept.has(canonical(bad)),'Cross-labelled Chemistry response: '+card.id+' '+bad);
}
assert(app.includes("'./chemistry_mock_recall_v196.json','./chemistry_mock_recall_v199.json'"));
assert(app.includes('else if(index===10)'));
assert(app.includes("'./science_waves_energetics_v198.json','./chemistry_mock_precision_v199.json'"));
for(const p of ['chemistry_mock_recall_v199.json','chemistry_mock_precision_v199.json'])assert(sw.includes("'./"+p+"'"));
assert(sw.includes('v199-chem-tests'));assert(html.includes('app.js?v=202'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'")&&app.includes("PROFILE_KEY='revisionLoopProfile11'"));
const qStart=app.indexOf('function mockEligibleQuestion(q){'),qEnd=app.indexOf('\nfunction startMockSession',qStart);
assert(qStart>=0&&qEnd>qStart);
const eligible=vm.runInNewContext(app.slice(qStart,qEnd)+'\nmockEligibleQuestion');
assert.equal(prevQuestions.filter(q=>q.subject==='Maths'&&eligible(q)).length,138);
for(const q of bank.questions){
 assert(!prevQIDs.has(q.id),'Duplicate original question: '+q.id);prevQIDs.add(q.id);
 assert(q.subject==='Chemistry'&&['AS','A2'].includes(q.level)&&q.mock===true&&q.taught===true&&eligible(q));
 assert(q.sourceVerified===false&&q.year==='Practice'&&q.verificationLevel==='original-exam-style');
 assert(q.standalone===true&&q.requiresWorking===true&&q.difficulty==='hard');
 assert(q.markPoints.length===q.marks&&q.markPointMarks.length===q.marks&&q.markPointMarks.every(n=>n===1));
 assert.equal(q.modelAnswer,q.markPoints.join(' '));
 assert(!/buffer/i.test(q.prompt));
}
assert.equal([...prevQuestions,...bank.questions].filter(q=>q.subject==='Maths'&&eligible(q)).length,138);
const a=app.indexOf('function normalise('),b=app.indexOf('function nextSchedule(',a),c=app.indexOf('function evidenceRuleScore(',b),d=app.indexOf('function renderExam(',c);
assert(a>=0&&b>a&&c>b&&d>c);
const mark=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+app.slice(a,b)+app.slice(c,d)+'return examSuggested')();
for(const q of bank.questions){
 assert.equal(mark(q,q.modelAnswer).suggested,q.marks,'Model full credit: '+q.id);
 assert.equal(mark(q,'').suggested,0,'Blank credit: '+q.id);
 assert.equal(mark(q,'not sure').suggested,0,'Nonanswer credit: '+q.id);
}
const near=(x,y,tol=.005)=>assert(Math.abs(x-y)<=tol*Math.max(1,Math.abs(y)),x+' != '+y);
near(1.77/885,.002);near(.002*3,.006);near(.006*304,1.824);near(1.5/1.824*100,82.236842);
const ka=1.8e-5,acid=.1,h=Math.sqrt(ka*acid);
near(h,.00134164);near(-Math.log10(h),2.87236);near(h/acid*100,1.34164);
near(2*.015,.030);near(1e-14/.03,3.33333333e-13);near(-Math.log10(1e-14/.03),12.47712);
near(.4/1.3*130,40);near(.6/1.3*130,60);near(.3/1.3*130,30);
near(60*60*30/(40*40),67.5);
const slope=(-1.10-(-3.10))/(0.00300-0.00320);
near(slope,-10000);near(-slope*8.31/1000,83.1);
near(-3.10-slope*.00320,28.9);
near((63*.692+65*.308),63.616);near(63/2,31.5);near(65/2,32.5);
console.log('PASS v199: 13 Chemistry single-fact cards with correct/incorrect aliases; 8 original 60-mark applications, model/blank marking, independently checked numerical answers, AS Pure Maths filter, legacy stability and offline cache.');
