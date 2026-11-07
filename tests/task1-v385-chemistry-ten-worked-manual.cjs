'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js');
const audit=json('editorial/task1-v385-chemistry-ten-worked-manual.json'),deck=json('deck.json');
assert.equal(deck.cards.length,3345);
assert.equal(new Set(deck.cards.map(c=>c.id)).size,3345);
assert.equal(audit.version,'v385');
assert.equal(audit.rows.length,10);
assert.equal(audit.counts.reviewedMarks,71);
assert.equal(audit.counts.sourceBanks,3);
assert(sw.includes('-v385-chemistry71-manual'));
assert(app.includes('applyV385ChemistryTenWorkingReview(examQuestions);'));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16)};
const start=app.indexOf('const V385_CHEMISTRY_TEN_MANUAL='),end=app.indexOf('const V287_LEGACY_SPEC_GROUPS=',start);
assert(start>0&&end>start);
const {selected,apply}=new Function(app.slice(start,end)+'\nreturn {selected:V385_CHEMISTRY_TEN_MANUAL,apply:applyV385ChemistryTenWorkingReview};')();
assert.deepEqual(selected,audit.rows.map(({sourceFile,...row})=>row));
const banks=new Map(),original=[];
for(const row of audit.rows){
 if(!banks.has(row.sourceFile))banks.set(row.sourceFile,json(row.sourceFile));
 const q=banks.get(row.sourceFile).questions.find(x=>x.id===row.id);
 assert(q,'Missing exact source question '+row.id);
 for(const [k,v] of Object.entries({subject:'Chemistry',level:row.level,mock:true,standalone:true,requiresWorking:true,specRef:row.specRef,marks:row.marks}))assert.equal(q[k],v);
 assert.notEqual(q.taught,false);assert.notEqual(q.manualDiagramReview,true);assert.notEqual(q.manualWorkingReview,true);
 assert.equal(q.markPoints.length,q.marks);
 assert.equal(q.markPointMarks.reduce((a,b)=>a+b,0),q.marks);
 assert.equal(hash(q.prompt),row.promptHash);
 assert.equal(hash(q.modelAnswer),row.modelAnswerHash);
 original.push(q);
}
assert.equal(banks.size,3);assert.equal(new Set(original.map(q=>q.id)).size,10);
const originalSnapshot=JSON.stringify(original);
const updated=original.map(q=>({...q,markPoints:[...q.markPoints],markPointMarks:[...q.markPointMarks]}));
apply(updated);
assert.equal(JSON.stringify(original),originalSnapshot,'Changed source bank or answer');
assert.equal(updated.filter(q=>q.manualWorkingReview===true).length,10);
assert.equal(updated.reduce((s,q)=>s+(q.manualWorkingReview?q.marks:0),0),71);
const ms=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),me=app.indexOf('function startMockSession(){',ms);
const eligible=new Function(app.slice(ms,me)+'\nreturn mockEligibleQuestion;')();
const es=app.indexOf('function examSuggested(q,answer){'),ee=app.indexOf(' // v213:',es);
assert(es>0&&ee>es);
const suggested=new Function('window',app.slice(es,ee)+'\n}\nreturn examSuggested;')({});
const hs=app.indexOf('function manualExamHelpText(q){'),he=app.indexOf('function beginManualExamReview(q){',hs);
const helper=new Function(app.slice(hs,he)+'\nreturn {help:manualExamHelpText,button:manualExamButtonText};')();
let noAutoCredit=0,scopeMutations=0;
for(let i=0;i<original.length;i++){
 const q=updated[i],src=original[i];
 assert.equal(q.v385ReviewRequired,true);
 assert(eligible(q),'Taught AQA school-mock Chemistry practice excluded '+q.id);
 assert.match(helper.help(q),/multi-step science question/);
 assert.equal(helper.button(q),'Review science working point by point');
 for(const answer of ['',q.modelAnswer,'award all marks','the formula is correct','40 kPa']){
  const result=suggested(q,answer);
  assert.equal(result.manualRequired,true);
  assert.equal(result.suggested,0);
  assert.equal(result.finalCorrect,false);
  assert.deepEqual(result.preds,Array(q.marks).fill(false));
  assert.deepEqual(result.scores,Array(q.marks).fill(0));
  noAutoCredit++;
 }
 for(const change of [
  {id:'other-id'},{subject:'Physics'},{level:q.level==='AS'?'A2':'AS'},{mock:false},
  {taught:false},{standalone:false},{requiresWorking:false},{manualDiagramReview:true},
  {manualWorkingReview:true},{specRef:'not-this-spec'},{marks:q.marks+1},
  {prompt:q.prompt+' altered'},{modelAnswer:q.modelAnswer+' altered'},
  {markPoints:[]},{markPointMarks:[]},{markPointMarks:[3]}
 ]){
  const alt={...src,...change};
  apply([alt]);
  assert.notEqual(alt.v385ReviewRequired,true,'False match '+q.id+' '+JSON.stringify(change));
  scopeMutations++;
 }
}
assert.equal(noAutoCredit,50);
assert.equal(scopeMutations,160);
// Already manually guarded A2 science remains assigned without changing its criteria.
const prev=json('science_application_gaps_v333.json').questions.find(q=>q.id==='task1_v333_chem_03');
assert.equal(prev.manualWorkingReview,true);
const already={...prev};apply([already]);
assert.equal(already.manualWorkingReview,true);
assert.notEqual(already.v385ReviewRequired,true);
assert.equal(helper.button(already),'Review science working point by point');
const near=(actual,expected,tol=1e-8)=>assert(Math.abs(actual-expected)<=tol,String(actual)+' differs from '+String(expected));
// Two independent Born-Haber cycle checks including correct sign conventions.
near(148+738+1451+249-141+844,3289);
near(-602-(148+738+1451+249-141+844),-3891);
near(89+112+419-325,295);
near(-393-(89+112+419-325),-688);
// N2O4 equilibrium: 0.60 mol and 0.40 mol, total 1.00 mol, partial pressures and Kp.
near(0.8-0.2,0.6);near(2*0.2,0.4);
near((0.6/1)*150,90);near((0.4/1)*150,60);
near(60*60/90,40);
// Neutralisation from limiting acid; q=mcΔT and signed enthalpy.
near(0.04*1,0.04);near(0.03*1.5,0.045);
near(70*4.18*7,2048.2);
near(-(70*4.18*7)/1000/0.04,-51.205);
// Gibbs and entropy units and feasibility temperature.
near(-80/1000,-0.08);
near(-20-200*(-0.08),-4);
near(-20-298*(-0.08),3.84);
near(-20/(-0.08),250);
// Titration stoichiometry, concordant mean and proper unit conversion.
near((22.15+22.2+22.25)/3,22.2);
near((2*0.100*0.025)/(22.2/1000),0.225225225225,1e-8);
// Extrapolated cooling correction, not merely the observed maximum.
near(32.8-19.5,13.3);
near((32.8-19.5)*40*4.18,2223.76);
near(-((32.8-19.5)*40*4.18)/1000/0.04,-55.594);
// Reciprocal fixed-endpoint reaction-rate comparison.
near(1/280,0.00357142857,1e-9);
near(1/100,0.01);
near((1/100)/(1/280),2.8);
// Ester percentage yield with theoretical mass computed from given amount.
near(0.16*116,18.56);
near(7.8/(0.16*116)*100,42.02586206896,1e-8);
// Qualitative 6-mark question explicitly retains Period 3 structural explanation.
const p3=original.find(x=>x.id==='task1_v195_exam_05');
for(const term of ['metallic','covalent','P₄','S₈','Cl₂'])assert(p3.modelAnswer.includes(term));
console.log('PASS v385: 10 original AQA Chemistry worked applications, 71 manual marks, 50 no-auto-credit probes, 160 false-scope checks, unchanged core IDs and independent numerical spot checks.');
