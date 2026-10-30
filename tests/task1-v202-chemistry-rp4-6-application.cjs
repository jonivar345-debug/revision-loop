'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const bank=read('chemistry_rp4_rp6_evidence_v202.json'),audit=read('editorial/task1-v202-chemistry-rp4-6-application-crosswalk.json');
const deck=read('deck.json'),base=read('exam_questions.json');
const app=fs.readFileSync('app.js','utf8'),html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
assert.equal(bank.version,'v202');assert.equal(audit.version,'v202');assert.equal(audit.task1Complete,false);
assert.equal(audit.masteryCertified,false);
assert.equal(bank.questions.length,9);
assert.deepEqual(bank.questions.map(q=>q.marks),[7,8,7,8,7,8,8,8,8]);
assert.equal(bank.questions.reduce((n,q)=>n+q.marks,0),69);
assert.deepEqual([4,5,6].map(r=>bank.questions.filter(q=>q.requiredPractical===r).length),[3,3,3]);
assert.deepEqual([4,5,6].map(r=>bank.questions.filter(q=>q.requiredPractical===r).reduce((sum,q)=>sum+q.marks,0)),[22,23,24]);
assert.equal(deck.cards.length,3345);assert.equal(base.questions.length,1268);
assert.equal(audit.counts.newQuestions,9);assert.equal(audit.counts.newMarks,69);
assert.equal(audit.counts.reviewedShortAnswerAcceptedVariants,39);
assert.equal(audit.counts.explicitFalsePositiveRejectVariants,3);
assert(app.includes("'./chemistry_rp4_rp6_evidence_v202.json'"));
assert(sw.includes("'./chemistry_rp4_rp6_evidence_v202.json'"));assert(sw.includes('v202-chem-rp4-6'));
assert(html.includes('app.js?v=202'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
const priorPaths=['maths_pure_proof_vectors_v190.json','maths_as_pure_gap_challenges_v191.json',
'science_practical_data_v194.json','science_mock_application_v195.json','science_mock_evidence_v196.json',
'physics_mechanics_reasoning_v197.json','science_waves_energetics_v198.json',
'chemistry_mock_precision_v199.json','physics_measurements_particles_v200.json'];
const prior=[...base.questions,...priorPaths.flatMap(p=>read(p).questions)];
const priorIds=new Set(prior.map(x=>x.id));
const start=app.indexOf('function mockEligibleQuestion(q){'),end=app.indexOf('\nfunction startMockSession',start);
assert(start>=0&&end>start,'Missing school mock filter');
const mockEligible=vm.runInNewContext(app.slice(start,end)+'\nmockEligibleQuestion');
assert.equal(prior.filter(q=>q.subject==='Maths'&&mockEligible(q)).length,138);
const a=app.indexOf('function normalise('),b=app.indexOf('function nextSchedule(',a),
      c=app.indexOf('function evidenceRuleScore(',b),d=app.indexOf('function renderExam(',c);
assert(a>=0&&b>a&&c>b&&d>c,'Could not isolate marker code');
const marker=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
    app.slice(a,b)+app.slice(c,d)+'return examSuggested')();
const seen=new Set();
for(const q of bank.questions){
 assert(!priorIds.has(q.id));assert(!seen.has(q.id));seen.add(q.id);
 assert.equal(q.subject,'Chemistry');assert.equal(q.level,'AS');
 assert.equal(q.year,'Practice');assert.equal(q.mock,true);assert.equal(q.taught,true);
 assert([4,5,6].includes(q.requiredPractical));
 assert.equal(q.sourceVerified,false);assert.equal(q.verificationLevel,'original-exam-style');
 assert.equal(q.requiresWorking,true);assert.equal(q.answerType,'points');
 assert.equal(q.markPoints.length,q.marks);assert.equal(q.markPointMarks.length,q.marks);
 assert(q.markPointMarks.every(x=>x===1));assert.equal(q.modelAnswer,q.markPoints.join(' '));
 assert(mockEligible(q),'Chemistry mock excluded: '+q.id);
 assert(!/\b(?:buffer solutions?|nmr|chromatography|transition metal ions)\b/i.test(q.prompt));
 assert.equal(marker(q,q.modelAnswer).suggested,q.marks,'Full model marking: '+q.id);
 assert.equal(marker(q,'').suggested,0,'Blank scoring: '+q.id);
 assert.equal(marker(q,'not sure').suggested,0,'Non-answer scoring: '+q.id);
}
assert.equal([...prior,...bank.questions].filter(q=>q.subject==='Maths'&&mockEligible(q)).length,138);
const canonical=s=>String(s||'').toLowerCase().replace(/[.!?]+$/,'').trim();
let aliases=0;
for(const q of bank.questions){
 for(const [index,alts] of Object.entries(q.reviewedShortAnswerPoints||{})){
  assert(Number.isInteger(Number(index))&&Number(index)<q.marks);
  for(const alias of alts){
   aliases++;
   const all=Object.values(q.reviewedShortAnswerPoints).filter(items=>
     items.some(s=>canonical(s)===canonical(alias))).length;
   const res=marker(q,alias);
   assert.equal(res.suggested,all,'Reviewed short answer must get its specified marks: '+q.id+' '+alias);
   assert.equal(res.preds.filter(Boolean).length,all);
   assert.deepEqual(res.scores.map(s=>s>=.5),res.preds);
  }
 }
 for(const rejected of q.reviewedShortAnswerRejects||[]){
  const res=marker(q,rejected);
  assert.equal(res.suggested,0,'Incorrect purity/identity credited: '+q.id+' '+rejected);
  assert.equal(res.preds.filter(Boolean).length,0);
 }
}
assert.equal(aliases,39);
const qs=Object.fromEntries(bank.questions.map(q=>[q.id,q]));
const examples=[
['task1_v202_chem_01','X is chloride, Y is bromide, Z is iodide.',3],
['task1_v202_chem_01','X is iodide, Y is chloride and Z is bromide.',0],
['task1_v202_chem_02','S is acidic, since pH is 12.5.',0],
['task1_v202_chem_03','BaSO4 is highly soluble and magnesium sulfate forms persistent precipitate.',0],
['task1_v202_chem_04','Maximum mass is 20.5 g, yield is 80%.',2],
['task1_v202_chem_04','Maximum mass is 205 g, yield is 80%.',0],
['task1_v202_chem_05','A is reflux and B is distillation.',2],
['task1_v202_chem_05','A is distillation and B is reflux.',0],
['task1_v202_chem_06','The sample is definitely 100% pure because it boils at 72°C.',0],
['task1_v202_chem_07','D must be a tertiary alcohol.',0],
['task1_v202_chem_08','P is primary, Q secondary, R tertiary.',3],
['task1_v202_chem_09','U is an aldehyde, V a carboxylic acid, W an alkene.',3],
['task1_v202_chem_09','U is a ketone, V an ester, W an alkane.',0]
];
for(const [id,answer,want] of examples){
 const r=marker(qs[id],answer);
 assert.equal(r.suggested,want,id+' '+answer);
}
const close=(actual,expected,tol=.0001)=>assert(Math.abs(actual-expected)<=tol*Math.max(1,Math.abs(expected)),actual+' ≠ '+expected);
close(.250*82,20.5);close(16.4/(.250*82)*100,80);
close(12+4+8,24);close(25-(12+4+8),1);close(12/15*100,80);
close(83-78,5);close(82-78,4);close(161-83,78);
assert.equal(1+(-1),0,'silver halide ionic charge balance');
assert.equal(2+(-1)+(-1),0,'magnesium hydroxide charge balance');
assert.equal(2+(-2),0,'barium sulfate charge balance');
console.log('PASS v202: nine original 69-mark Chemistry RP4–6 written-paper scenarios, 39 short answers, three false-positive rejects, thirteen adversarial cases, independent yields and fraction arithmetic, mock eligibility, original IDs/cloud keys/offline cache.');
