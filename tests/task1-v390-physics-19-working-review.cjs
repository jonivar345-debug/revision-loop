'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),deck=json('deck.json');
const audit=json('editorial/task1-v390-physics-19-working-review.json');
assert.equal(deck.cards.length,3345);
assert.equal(new Set(deck.cards.map(c=>c.id)).size,3345);
assert.equal(audit.version,'v390');
assert.equal(audit.rows.length,19);
assert.equal(audit.counts.methodMarksToHumanRubric,146);
assert.equal(audit.counts.sourceBanks,3);
assert(sw.includes('-v390-physics146-manual'));
assert(app.includes('applyV390Physics19WorkingReview(examQuestions);'));
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16)};
const st=app.indexOf('const V390_PHYSICS_19_MANUAL='),en=app.indexOf('const V287_LEGACY_SPEC_GROUPS=',st);
assert(st>0&&en>st);
const {selected,patch}=new Function(app.slice(st,en)+'\nreturn {selected:V390_PHYSICS_19_MANUAL,patch:applyV390Physics19WorkingReview};')();
assert.deepEqual(selected,audit.rows.map(({sourceFile,...r})=>r));
const banks=new Map(),source=[];
for(const row of audit.rows){
 if(!banks.has(row.sourceFile))banks.set(row.sourceFile,json(row.sourceFile));
 const q=banks.get(row.sourceFile).questions.find(x=>x.id===row.id);
 assert(q,'Source missing '+row.id);
 for(const [key,value] of Object.entries({subject:'Physics',level:'AS',mock:true,standalone:true,requiresWorking:true,marks:row.marks,specRef:row.specRef}))assert.equal(q[key],value);
 assert.notEqual(q.taught,false);
 assert.notEqual(q.manualWorkingReview,true);
 assert.notEqual(q.manualDiagramReview,true);
 assert.equal(q.markPoints.length,q.marks);
 assert.equal(q.markPointMarks.reduce((a,b)=>a+b,0),q.marks);
 assert.equal(hash(q.prompt),row.promptHash);
 assert.equal(hash(q.modelAnswer),row.modelAnswerHash);
 source.push(q);
}
assert.equal(banks.size,3);
assert.equal(new Set(source.map(q=>q.id)).size,19);
const snapshot=JSON.stringify(source);
const updated=source.map(q=>({...q,markPoints:[...q.markPoints],markPointMarks:[...q.markPointMarks]}));
patch(updated);
assert.equal(JSON.stringify(source),snapshot);
assert.equal(updated.filter(q=>q.manualWorkingReview===true).length,19);
assert.equal(updated.reduce((sum,q)=>sum+(q.manualWorkingReview?q.marks:0),0),146);
const ms=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),me=app.indexOf('function startMockSession(){',ms);
assert(ms>0&&me>ms);
const eligible=new Function(app.slice(ms,me)+'\nreturn mockEligibleQuestion;')();
const es=app.indexOf('function examSuggested(q,answer){'),ee=app.indexOf(' // v213:',es);
assert(es>0&&ee>es);
const suggested=new Function('window',app.slice(es,ee)+'\n}\nreturn examSuggested;')({});
const hs=app.indexOf('function manualExamHelpText(q){'),he=app.indexOf('function beginManualExamReview(q){',hs);
assert(hs>0&&he>hs);
const helper=new Function(app.slice(hs,he)+'\nreturn {help:manualExamHelpText,button:manualExamButtonText};')();
let noAutomatic=0,negativeScope=0;
for(let i=0;i<source.length;i++){
 const original=source[i],q=updated[i];
 assert.equal(q.v390ReviewRequired,true);
 assert(eligible(q),'School mock eligibility lost '+q.id);
 assert.match(helper.help(q),/multi-step science question/);
 assert.equal(helper.button(q),'Review science working point by point');
 for(const answer of ['',q.modelAnswer,'I think all marks should be given','3.78 m/s2','the graph is a straight line']){
  const outcome=suggested(q,answer);
  assert.equal(outcome.manualRequired,true);
  assert.equal(outcome.suggested,0);
  assert.equal(outcome.finalCorrect,false);
  assert.deepEqual(outcome.preds,Array(q.marks).fill(false));
  assert.deepEqual(outcome.scores,Array(q.marks).fill(0));
  noAutomatic++;
 }
 for(const change of [
  {id:'not-an-original'},{subject:'Chemistry'},{level:'A2'},
  {mock:false},{taught:false},{standalone:false},{requiresWorking:false},
  {manualDiagramReview:true},{manualWorkingReview:true},
  {specRef:'not-this-section'},{marks:q.marks+1},
  {prompt:q.prompt+' changed'},{modelAnswer:q.modelAnswer+' changed'},
  {markPoints:[]},{markPointMarks:[]},{markPointMarks:[3]}
 ]){
  const altered={...original,...change};
  patch([altered]);
  assert.notEqual(altered.v390ReviewRequired,true,'Invalid question matched '+q.id+' '+JSON.stringify(change));
  negativeScope++;
 }
}
assert.equal(noAutomatic,95);
assert.equal(negativeScope,304);
const prior=json('science_application_gaps_v333.json').questions.find(x=>x.id==='task1_v333_chem_03');
assert.equal(prior.manualWorkingReview,true);
const already={...prior};patch([already]);
assert.equal(already.manualWorkingReview,true);assert.notEqual(already.v390ReviewRequired,true);
const near=(actual,expected,tol=1e-8)=>assert(Math.abs(actual-expected)<=tol,'Numeric method discrepancy '+actual+' vs '+expected);
// RP3 g gradient and percentage uncertainty.
near(2*4.88,9.76);
near((2*Math.max(5.06-4.88,4.88-4.72))/(2*4.88)*100,3.68852459,1e-6);
// Young modulus diameter, area, strain and maximum relative uncertainties.
const A=Math.PI*(0.320e-3)**2/4;
near(A,8.042477e-8,1e-13);
near(12/A/(1.40e-3/1.40),1.492e11,2e8);
near(2*(0.010/0.320)*100+(0.05/1.40)*100,9.82142857,1e-6);
// Resistivity and EMF negative slope, not wrong-sign resistance.
near((2.8-1.4)/(.700-.350),4);
near(4*Math.PI*(.500e-3)**2/4,7.85398163e-7,1e-13);
near((1.18-1.42)/(.75-.25),-.48);
near(1.42+.25*.48,1.54);
// Motion graphs: signed net distance differs from unsigned total distance.
near(8+12+4-4,20);
near(8+12+4.5+.5+4,29);
near(6-(-2),8);
near(15+10+2,27);
// Loading curves and Young modulus from stress/strain.
near(.5*40*.02+.5*(40+50)*.01+50*.01,1.35);
near(200e6/.001,2e11,1);
near((.5*200e6*.001)*(1.5e-6*1.4),.21);
// Loaded potential divider: a real load changes lower parallel resistance.
near(12*6/(3+6),8);
near(12*3/(3+3),6);
near(12/6000,0.002);
// Sensor potential dividers, lower-branch output decreases when R_sensor falls.
near(10*4/(4+4),5);near(10*1/(4+1),2);
near(10*10/(5+10),20/3);
near(10*2/(5+2),20/7);
// Emf, lost voltage and energy conservation.
near((1.10-1.40)/(.8-.2),-.5);
near(1.40+.2*.5,1.5);
near(1.5/(2+.5),.6);
near(.6**2*2+.6**2*.5,1.5*.6);
// Angled force on slope and impulse collisions.
near((35*Math.cos(25*Math.PI/180)-4*9.81*Math.sin(25*Math.PI/180))/4,3.78,.01);
near(.5*.1*100-.2*20,1);
near((.3*4+.5*(-2))/.8,.25);
near(.5*.3*16+.5*.5*4,3.4);
near(70*9.8-440,246);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v390: 19 original Physics AS multi-step mock questions, 146 manual rubric marks, 95 no-auto-credit probes, 304 rejected source mutations, old manual routes preserved and independent mechanics/electricity calculations.');
