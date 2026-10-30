'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const get=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const chem=get('chemistry_mock_precision_v199.json'),physics=get('physics_measurements_particles_v200.json'),audit=get('editorial/task1-v201-science-concise-marking-crosswalk.json');
const deck=get('deck.json'),exam=get('exam_questions.json');
const app=fs.readFileSync('app.js','utf8'),html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
assert.equal(audit.version,'v201');assert.equal(audit.task1Complete,false);
assert.equal(deck.cards.length,3345);assert.equal(exam.questions.length,1268);
assert.equal(chem.questions.length,8);assert.equal(physics.questions.length,10);
assert.equal(chem.questions.reduce((s,q)=>s+q.marks,0),60);
assert.equal(physics.questions.reduce((s,q)=>s+q.marks,0),79);
assert(html.includes('app.js?v=202'));assert(sw.includes('v201-science-short-marking'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
const a=app.indexOf('function normalise('),b=app.indexOf('function nextSchedule(',a),c=app.indexOf('function evidenceRuleScore(',b),d=app.indexOf('function renderExam(',c);
assert(a>=0&&b>a&&c>b&&d>c);
const mark=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+app.slice(a,b)+app.slice(c,d)+'return examSuggested')();
const qs=[...chem.questions,...physics.questions],byId=new Map(qs.map(q=>[q.id,q]));
const canon=s=>String(s||'').toLowerCase().replace(/[.!?]+$/,'').trim();
let count=0;
for(const q of qs){
 assert.equal(mark(q,q.modelAnswer).suggested,q.marks,'Model was downgraded: '+q.id);
 assert.equal(mark(q,'').suggested,0,'Blank credited: '+q.id);
 assert.equal(mark(q,'not sure').suggested,0,'Nonanswer credited: '+q.id);
 if(!q.reviewedShortAnswerPoints)continue;
 const entries=Object.entries(q.reviewedShortAnswerPoints);
 for(const [index,alts] of entries){
  assert(+index>=0&&+index<q.marks&&Array.isArray(alts)&&alts.length>=2);
  for(const alt of alts){
   const expected=entries.filter(([,v])=>v.some(candidate=>canon(candidate)===canon(alt))).length;
   const result=mark(q,alt);
   assert.equal(result.suggested,expected,'Reviewed alias rejected: '+q.id+' '+alt);
   assert.equal(result.preds.filter(Boolean).length,expected,'Mark indicators mismatch: '+q.id+' '+alt);
   assert.deepEqual(result.scores.map(x=>x>=.5),result.preds,'Score flags mismatch: '+q.id+' '+alt);
   count++;
  }
 }
}
assert.equal(count,44);
const cases=[
 ['task1_v199_exam_01','X is an aldehyde. Y is a ketone.',2,[0,1]],
 ['task1_v199_exam_01','X is not an aldehyde.',0,[]],
 ['task1_v199_exam_01','Y is not a ketone.',0,[]],
 ['task1_v199_exam_04','The pH is 2.87.',1,[4]],
 ['task1_v199_exam_04','The pH is 2.87; The acid is 1.34% dissociated.',2,[4,5]],
 ['task1_v199_exam_04','The pH is not 2.87.',0,[]],
 ['task1_v199_exam_04','The pH is 0.87.',0,[]],
 ['task1_v199_exam_06','Kp is 67.5 kPa.',2,[5,6]],
 ['task1_v199_exam_06','Kp is 67.5 kPa^-1.',0,[]],
 ['task1_v200_phy_01','The uncertainty is 7.92%.',1,[6]],
 ['task1_v200_phy_01','The uncertainty is not 7.92%.',0,[]],
 ['task1_v200_phy_01','E = 5.09 x 10^10 Pa.',1,[3]],
 ['task1_v200_phy_01','E = 50.9 Pa.',0,[]],
 ['task1_v200_phy_01',"Young's modulus is 51 Pa.",0,[]],
 ['task1_v200_phy_01','E = 50.9 MPa.',0,[]],
 ['task1_v200_phy_02','EMF = 1.60 V.',1,[3]],
 ['task1_v200_phy_02','EMF = 1.60 V. The uncertainty in emf is 0.12 V.',2,[3,6]],
 ['task1_v200_phy_08','The excess kinetic energy is 0.478 MeV.',1,[6]],
 ['task1_v200_phy_08','The excess kinetic energy is 0.0478 MeV.',0,[]]
];
for(const [id,answer,want,indices] of cases){
 const q=byId.get(id);assert(q,id+' unavailable');
 const marked=mark(q,answer);
 assert.equal(marked.suggested,want,id+' '+answer);
 const got=marked.preds.map((on,i)=>on?i:null).filter(i=>i!==null);
 assert.deepEqual(got,indices,id+' flagged wrong points for '+answer);
 assert.deepEqual(marked.scores.map(x=>x>=.5),marked.preds,id+' score vector out of sync');
}
const appMockStart=app.indexOf('function mockEligibleQuestion(q){'),appMockStop=app.indexOf('\nfunction startMockSession',appMockStart);
const eligible=vm.runInNewContext(app.slice(appMockStart,appMockStop)+'\nmockEligibleQuestion');
const prior=['maths_pure_proof_vectors_v190.json','maths_as_pure_gap_challenges_v191.json','science_practical_data_v194.json','science_mock_application_v195.json','science_mock_evidence_v196.json','physics_mechanics_reasoning_v197.json','science_waves_energetics_v198.json','chemistry_mock_precision_v199.json','physics_measurements_particles_v200.json'];
const oldQuestions=[...exam.questions,...prior.flatMap(path=>get(path).questions)];
assert.equal(oldQuestions.filter(q=>q.subject==='Maths'&&eligible(q)).length,138);
console.log('PASS v201: 44 reviewed Chemistry/Physics aliases + 19 independent positive/negative examples; correct marked-point vectors; all 18 original questions score full, blank=0; preserved 138 AS Pure Maths questions, core banks and saved keys.');
