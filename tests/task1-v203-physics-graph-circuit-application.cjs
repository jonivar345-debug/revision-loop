'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const bank=read('physics_graphs_circuits_v203.json'),audit=read('editorial/task1-v203-physics-graphs-circuits-crosswalk.json');
const deck=read('deck.json'),main=read('exam_questions.json');
const app=fs.readFileSync('app.js','utf8'),html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
assert.equal(bank.version,'v203');assert.equal(audit.version,'v203');
assert.equal(audit.task1Complete,false);assert.equal(audit.masteryCertified,false);
assert.equal(bank.questions.length,8);assert.deepEqual(bank.questions.map(q=>q.marks),[8,8,8,9,9,8,8,9]);
assert.equal(bank.questions.reduce((s,q)=>s+q.marks,0),67);
assert.equal(audit.counts.newMarks,67);
assert.equal(audit.counts.graphDiagrams,6);
assert.equal(deck.cards.length,3345);assert.equal(main.questions.length,1268);
assert(app.includes("'./physics_graphs_circuits_v203.json'"));
assert(sw.includes("'./physics_graphs_circuits_v203.json'"));
assert(sw.includes('v203-physics-graphs-circuits'));
assert(html.includes('app.js?v=203'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
const paths=['maths_pure_proof_vectors_v190.json','maths_as_pure_gap_challenges_v191.json',
'science_practical_data_v194.json','science_mock_application_v195.json','science_mock_evidence_v196.json',
'physics_mechanics_reasoning_v197.json','science_waves_energetics_v198.json',
'chemistry_mock_precision_v199.json','physics_measurements_particles_v200.json','chemistry_rp4_rp6_evidence_v202.json'];
const prior=[...main.questions,...paths.flatMap(path=>read(path).questions)];
const known=new Set(prior.map(q=>q.id));
const start=app.indexOf('function mockEligibleQuestion(q){'),end=app.indexOf('\nfunction startMockSession',start);
assert(start>=0&&end>start);
const eligible=vm.runInNewContext(app.slice(start,end)+'\nmockEligibleQuestion');
assert.equal(prior.filter(q=>q.subject==='Maths'&&eligible(q)).length,138);
const a=app.indexOf('function normalise('),b=app.indexOf('function nextSchedule(',a),
c=app.indexOf('function evidenceRuleScore(',b),d=app.indexOf('function renderExam(',c);
assert(a>=0&&b>a&&c>b&&d>c);
const mark=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+app.slice(a,b)+app.slice(c,d)+'return examSuggested')();
let graphs=0,variants=0,badVariants=0;
const canonical=s=>String(s||'').toLowerCase().replace(/[.!?]+$/,'').trim();
for(const q of bank.questions){
 assert(!known.has(q.id),'Duplicate question ID: '+q.id);known.add(q.id);
 assert.equal(q.subject,'Physics');assert.equal(q.level,'AS');assert.equal(q.mock,true);assert.equal(q.taught,true);
 assert.equal(q.year,'Practice');assert.equal(q.verificationLevel,'original-exam-style');
 assert.equal(q.sourceVerified,false);assert(q.specRef.startsWith('3.4.')||q.specRef.startsWith('3.5.'));
 assert.equal(q.markPoints.length,q.marks);assert.equal(q.markPointMarks.length,q.marks);
 assert(q.markPointMarks.every(v=>v===1));assert.equal(q.modelAnswer,q.markPoints.join(' '));
 assert.equal(q.requiresWorking,true);assert.equal(eligible(q),true,'AS Physics incorrectly excluded');
 assert.equal(mark(q,q.modelAnswer).suggested,q.marks,'Model full marks: '+q.id);
 assert.equal(mark(q,'').suggested,0);assert.equal(mark(q,'not sure').suggested,0);
 assert(!/buffer|circular motion|simple harmonic motion|capacitors/.test(q.prompt.toLowerCase()));
 if(q.graphSpec){
  graphs++;
  const g=q.graphSpec;
  assert(g.xMax>g.xMin&&g.yMax>g.yMin);assert(g.xStep>0&&g.yStep>0);
  assert(Array.isArray(g.points)&&g.points.length>=4);assert(g.xLabel&&g.yLabel);
  for(const p of g.points){
   assert(p.length===2&&p.every(Number.isFinite),'Non-finite plotted point');
   assert(p[0]>=g.xMin&&p[0]<=g.xMax&&p[1]>=g.yMin&&p[1]<=g.yMax,'Out of range graph point');
  }
 }
 const lists=Object.entries(q.reviewedShortAnswerPoints||{});
 for(const [key,alts] of lists){
  assert(Number.isInteger(Number(key))&&+key>=0&&+key<q.markPoints.length);
  assert(Array.isArray(alts)&&alts.length>=2);
  for(const response of alts){
   variants++;
   const expected=lists.filter(([,list])=>list.some(item=>canonical(item)===canonical(response))).length;
   const result=mark(q,response);
   assert.equal(result.suggested,expected,'Correct short answer missing marks: '+q.id+' '+response);
   assert.equal(result.preds.filter(Boolean).length,expected);
   assert.deepEqual(result.scores.map(s=>s>=.5),result.preds,'Visible marking indicators disagree');
  }
 }
 for(const answer of q.reviewedShortAnswerRejects||[]){
  badVariants++;
  const actual=mark(q,answer);
  assert.equal(actual.suggested,0,'Explicitly wrong result credited: '+q.id+' '+answer);
  assert.deepEqual(actual.scores.map(s=>s>=.5),actual.preds);
 }
}
assert.equal(graphs,6);assert.equal(variants,62);assert.equal(badVariants,7);
assert.equal([...prior,...bank.questions].filter(q=>q.subject==='Maths'&&eligible(q)).length,138);
const near=(a,b)=>assert(Math.abs(a-b)<=Math.max(1e-10,Math.abs(b)*.00001),a+' != '+b);
near((11-1)/(3-1),5);near((20-0)/4,5);near((7-3)/(3-1),2);
near(((2+6)/2)*2,8);near(((6-2)/2)*2,4);near((8+12+4-4),20);
near((8+12+4.5+.5+4),29);near((0-6)/(5.5-4),-4);
near(2*3,6);near(-3*(5-3),-6);near((2+8)/2*3+(8+2)/2*2+2,27);
near(20/.01,2000);near(.5*.02*40,.4);near((40+50)/2*.01,.45);
near(.01*50,.5);near(.4+.45+.5,1.35);
near(200e6/.001,2e11);near(200e6*1.5e-6,300);
near(.001*1.4,.0014);near(.5*200e6*.001,1e5);
near(1.5e-6*1.4,2.1e-6);near(1e5*2.1e-6,.21);
near(12*6/(3+6),8);near((6*6)/(6+6),3);near(12*3/(3+3),6);
near(12/6000,.002);near(6/6000,.001);
near(10*4/(4+4),5);near(10*1/(4+1),2);
near(10*10/(5+10),6.6666666667);near(10*2/(5+2),2.857142857);
near((1.1-1.4)/(.8-.2),-.5);near(1.4+.5*.2,1.5);
near(1.5/(2+.5),.6);near(.6*2,1.2);near(.6*.5,.3);
near(.6*.6*2,.72);near(.6*.6*.5,.18);near(1.5*.6,.9);
console.log('PASS v203: eight original 67-mark AQA AS graph/circuit questions, six coordinate graphs, 62 reviewed alternatives, seven wrong-answer rejects, 28+ independent numerical checks, model/blank scoring, original IDs and maths-only school mock boundary.');
