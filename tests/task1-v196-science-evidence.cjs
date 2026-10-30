'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const phy=JSON.parse(fs.readFileSync('physics_mock_recall_v196.json','utf8'));
const chem=JSON.parse(fs.readFileSync('chemistry_mock_recall_v196.json','utf8'));
const qBank=JSON.parse(fs.readFileSync('science_mock_evidence_v196.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v196-science-evidence-crosswalk.json','utf8'));
const deck=JSON.parse(fs.readFileSync('deck.json','utf8')),base=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const previous=[...['maths_mock_recall_v186.json','maths_mock_recall_v187.json','maths_mock_recall_v192.json','chemistry_mock_recall_v189.json','physics_mock_recall_v193.json','chemistry_mock_recall_v193.json','physics_mock_recall_v195.json','chemistry_mock_recall_v195.json'].map(f=>JSON.parse(fs.readFileSync(f,'utf8')).cards)];
const oldPractice=[...['maths_pure_proof_vectors_v190.json','maths_as_pure_gap_challenges_v191.json','science_practical_data_v194.json','science_mock_application_v195.json'].map(f=>JSON.parse(fs.readFileSync(f,'utf8')).questions)];
const app=fs.readFileSync('app.js','utf8'),sw=fs.readFileSync('sw.js','utf8'),html=fs.readFileSync('index.html','utf8');
assert.equal(phy.version,'v196');assert.equal(chem.version,'v196');assert.equal(qBank.version,'v196');
assert.equal(phy.cards.length,2);assert.equal(chem.cards.length,3);assert.equal(qBank.questions.length,8);
assert.deepEqual(qBank.questions.map(q=>q.marks),[7,8,7,7,7,7,7,7]);
assert.equal(qBank.questions.reduce((s,q)=>s+q.marks,0),57);
assert.equal(qBank.questions.filter(q=>q.subject==='Physics').length,4);
assert.equal(qBank.questions.filter(q=>q.subject==='Chemistry').length,4);
assert.equal(deck.cards.length,3345);assert.equal(base.questions.length,1268);
assert.equal(audit.task1Complete,false);assert.equal(audit.masteryCertified,false);
assert.equal(audit.physicsPriorEvidence.count,33);
assert.equal(audit.physicsPriorEvidence.items.length,33);
assert.equal(audit.newOriginalQuestions.length,8);
assert.equal(audit.newFlashcards.length,5);
assert.equal(audit.counts.expectedMockPhysicsCards,742);
assert.equal(audit.counts.expectedMockChemistryCards,1548);
assert.equal(audit.counts.expectedMathsFirstMockCards,147);
assert.equal(audit.counts.expectedMathsFirstMockQuestions,138);
const seen=new Set([...deck.cards,...previous.flat()].map(c=>c.id));
const from=app.indexOf('function normalise('),to=app.indexOf('function importantTokens(');
assert(from>=0&&to>from);
const evaluate=new Function('window',app.slice(from,to)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const [bank,subject] of [[phy,'Physics'],[chem,'Chemistry']]){
 for(const c of bank.cards){
  assert(!seen.has(c.id),'Card ID duplicate: '+c.id);seen.add(c.id);
  assert(c.subject===subject&&c.stage==='AS'&&c.mock===true&&c.taught===true&&c.active===true&&c.scope==='mock');
  assert(c.front.length<180&&c.back.length<160);
  assert(c.strictRecall===true&&c.accept.includes(c.back)&&c.accept.length>=3&&c.reject.length>=2);
  for(const a of c.accept)assert.equal(evaluate(c,a).status,'correct','Not accepted: '+c.id+' '+a);
  for(const a of c.reject)assert.notEqual(evaluate(c,a).status,'correct','Bad answer credited: '+c.id+' '+a);
  assert.equal(evaluate(c,'').status,'neutral');
 }
}
assert.equal(seen.size,new Set([...deck.cards,...previous.flat()].map(c=>c.id)).size+5);
assert(app.includes("'./physics_mock_recall_v196.json','./chemistry_mock_recall_v196.json'"));
assert(app.includes("'./science_mock_evidence_v196.json'"));
assert(app.includes('else if(index===8)')&&app.includes('else if(index===9)'));
for(const file of ['physics_mock_recall_v196.json','chemistry_mock_recall_v196.json','science_mock_evidence_v196.json'])assert(sw.includes("'./"+file+"'"));
assert(sw.includes('v196-science-evidence'));
assert(html.includes('app.js?v=203'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'")&&app.includes("PROFILE_KEY='revisionLoopProfile11'"));
const meth=app.match(/function mockEligibleQuestion\(q\)\{[\s\S]*?\n\}/);
assert(meth);
const eligible=vm.runInNewContext(meth[0]+'\nmockEligibleQuestion');
const questionIDs=new Set([...base.questions,...oldPractice.flat()].map(q=>q.id));
for(const q of qBank.questions){
 assert(!questionIDs.has(q.id),'Question ID duplicate: '+q.id);questionIDs.add(q.id);
 assert(q.subject==='Physics'||q.subject==='Chemistry');
 assert(q.level==='AS'&&q.mock===true&&eligible(q));
 assert(q.sourceVerified===false&&q.year==='Practice'&&q.verificationLevel==='original-exam-style');
 assert(q.requiresWorking===true&&q.standalone===true&&q.difficulty==='hard');
 assert.equal(q.markPoints.length,q.marks);assert.equal(q.markPointMarks.length,q.marks);
 assert(q.markPointMarks.every(x=>x===1));
 assert.equal(q.modelAnswer,q.markPoints.join(' '));
}
assert.equal([...base.questions,...oldPractice.flat(),...qBank.questions].filter(q=>q.subject==='Maths'&&eligible(q)).length,138);
const start=app.indexOf('function normalise('),middle=app.indexOf('function nextSchedule(',start),b=app.indexOf('function evidenceRuleScore(',middle),end=app.indexOf('function renderExam(',b);
assert(start>=0&&middle>start&&b>middle&&end>b);
const mark=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+app.slice(start,middle)+app.slice(b,end)+'return examSuggested')();
for(const q of qBank.questions){
 assert.equal(mark(q,q.modelAnswer).suggested,q.marks,'Full model not awarded full marks: '+q.id);
 assert.equal(mark(q,'').suggested,0);
 assert.equal(mark(q,'not sure').suggested,0);
}
const near=(actual,want,tol=.006)=>assert(Math.abs(actual-want)<=Math.abs(want)*tol,actual+' vs '+want);
near(12/(6000+3000)*1000,1.33333333333);
near(12*3000/(6000+3000),4.0);
near(12*3000/(2000+3000),7.2);
near(3/(2.4+.6),1.0);
near(1.5/(2.4+.15),.5882352941);
near(2.4*(1.5/(2.4+.15)),1.4117647);
near(9*6000/(3000+6000),6.0);
near(9*3000/(3000+3000),4.5);
near(9/6000*1000,1.5);
console.log('PASS v196: 33 audited prior Electricity facts, 5 new science cards accepted/rejected, 8 original 57-mark mock questions with correct model credit, Maths AS mock unchanged');
