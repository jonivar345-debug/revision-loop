'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const p=JSON.parse(fs.readFileSync('physics_mock_recall_v195.json','utf8'));
const c=JSON.parse(fs.readFileSync('chemistry_mock_recall_v195.json','utf8'));
const q=JSON.parse(fs.readFileSync('science_mock_application_v195.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v195-physics-chem-application-crosswalk.json','utf8'));
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const exam=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const maths190=JSON.parse(fs.readFileSync('maths_pure_proof_vectors_v190.json','utf8'));
const maths191=JSON.parse(fs.readFileSync('maths_as_pure_gap_challenges_v191.json','utf8'));
const oldMaths=JSON.parse(fs.readFileSync('maths_mock_recall_v192.json','utf8'));
const app=fs.readFileSync('app.js','utf8'),sw=fs.readFileSync('sw.js','utf8'),html=fs.readFileSync('index.html','utf8');
assert.equal(p.version,'v195');assert.equal(c.version,'v195');assert.equal(q.version,'v195');
assert.equal(p.cards.length,6);assert.equal(c.cards.length,7);assert.equal(q.questions.length,5);
assert.deepEqual(q.questions.map(x=>x.marks),[8,7,8,7,6]);
assert.equal(q.questions.reduce((a,x)=>a+x.marks,0),36);
assert.equal(deck.cards.length,3345);assert.equal(exam.questions.length,1268);
assert.equal(audit.previouslyReviewed.length,19);assert.equal(audit.newOriginalExamMarks,undefined);
assert.equal(audit.totals.expectedPhysicsMockFlashcards,740);
assert.equal(audit.totals.expectedChemistryMockFlashcards,1545);
assert.equal(audit.totals.mathsFirstMockFlashcards,147);
assert.equal(audit.totals.mathsFirstMockQuestions,138);
assert.equal(audit.task1Complete,false);assert.equal(audit.studentMasteryCertified,false);
const ids=new Set(deck.cards.map(z=>z.id));
for(const f of ['maths_mock_recall_v186.json','maths_mock_recall_v187.json','maths_mock_recall_v192.json','chemistry_mock_recall_v189.json','physics_mock_recall_v193.json','chemistry_mock_recall_v193.json']){
 for(const z of JSON.parse(fs.readFileSync(f,'utf8')).cards)ids.add(z.id);
}
const from=app.indexOf('function normalise('),to=app.indexOf('function importantTokens(');
assert(from>=0&&to>from);
const evaluate=new Function('window',app.slice(from,to)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const [bank,subject] of [[p,'Physics'],[c,'Chemistry']]){
 for(const z of bank.cards){
  assert(!ids.has(z.id),'Duplicate card '+z.id);ids.add(z.id);
  assert(z.subject===subject&&z.mock===true&&z.taught===true&&z.scope==='mock'&&z.active===true);
  assert(z.strictRecall===true&&z.front.length<200&&z.back.length<170);
  assert(z.accept.includes(z.back)&&z.accept.length>=3&&z.reject.length>=2);
  assert(z.specRef.startsWith('3.'));
  if(subject==='Physics')assert.equal(z.stage,'AS');
  else assert.equal(z.specRef==='3.2.1.2'?z.stage:'A2','AS'===z.stage?'AS':'A2');
  for(const answer of z.accept)assert.equal(evaluate(z,answer).status,'correct',z.id+' accept '+answer);
  for(const wrong of z.reject)assert.notEqual(evaluate(z,wrong).status,'correct',z.id+' reject '+wrong);
  assert.equal(evaluate(z,'').status,'neutral');
 }
}
assert.equal(new Set(ids).size,3345+9+15+10+1+4+4+6+7);
assert(app.includes("'./physics_mock_recall_v195.json','./chemistry_mock_recall_v195.json'"));
assert(app.includes('else if(index===6)')&&app.includes('else if(index===7)'));
assert(app.includes("!['AS','A2'].includes(c.stage)"));
assert(app.includes("'./science_mock_application_v195.json'"));
for(const file of ['physics_mock_recall_v195.json','chemistry_mock_recall_v195.json','science_mock_application_v195.json'])assert(sw.includes("'./"+file+"'"));
assert(sw.includes('v195-physics-chem-application'));assert(html.includes('app.js?v=197'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
const gate=app.match(/function mockEligibleQuestion\(q\)\{[\s\S]*?\n\}/);assert(gate);
const eligible=vm.runInNewContext(gate[0]+'\nmockEligibleQuestion');
const qids=new Set([...exam.questions,...maths190.questions,...maths191.questions,...JSON.parse(fs.readFileSync('science_practical_data_v194.json','utf8')).questions].map(z=>z.id));
for(const z of q.questions){
 assert(!qids.has(z.id));qids.add(z.id);
 assert(eligible(z),'New school mock question excluded '+z.id);
 assert(z.mock===true&&z.sourceVerified===false&&z.year==='Practice'&&z.verificationLevel==='original-exam-style');
 assert(z.requiresWorking===true&&z.standalone===true);
 assert(z.markPoints.length===z.marks&&z.markPointMarks.length===z.marks&&z.markPointMarks.every(m=>m===1));
 assert.equal(z.modelAnswer,z.markPoints.join(' '));
}
assert.equal([...exam.questions,...maths190.questions,...maths191.questions,...q.questions].filter(z=>z.subject==='Maths'&&eligible(z)).length,138);
const begin=app.indexOf('function normalise('),mid=app.indexOf('function nextSchedule(',begin);
const scorer=app.indexOf('function evidenceRuleScore(',mid),end=app.indexOf('function renderExam(',scorer);
assert(begin>=0&&mid>begin&&scorer>mid&&end>scorer);
const mark=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+app.slice(begin,mid)+app.slice(scorer,end)+'return examSuggested')();
for(const z of q.questions){
 assert.equal(mark(z,z.modelAnswer).suggested,z.marks,'model not awarded full marks '+z.id);
 assert.equal(mark(z,'').suggested,0);
 assert.equal(mark(z,'not sure').suggested,0);
}
const near=(a,b,rel=.015)=>assert(Math.abs(a-b)<=Math.abs(b)*rel,'Numerical discrepancy '+a+' vs '+b);
const gradient=(1.74-.5)/(3e14),h=1.6e-19*gradient;
near(gradient,4.1333333333e-15);near(h,6.613333333333e-34);
near(6e14-.5/gradient,4.79032258065e14);near(h*(6e14-.5/gradient),3.168e-19);
const Ek=150*1.6e-19,m=9.11e-31,pElectron=Math.sqrt(2*m*Ek),lambda=6.63e-34/pElectron;
near(pElectron,6.6127e-24);near(lambda,1.0027e-10);near(lambda/2,5.0135e-11);
assert.equal(148+738+1451+249-141+844,3289);assert.equal(-602-3289,-3891);
assert.equal((60*60)/90,40);
console.log('PASS v195: 13 scoped science cards/strict accepted and rejected recall, five original 36-mark full-worked questions, AQA evidence crosswalk, maths scope and legacy data unchanged');
