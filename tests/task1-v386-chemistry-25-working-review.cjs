'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),deck=json('deck.json');
const audit=json('editorial/task1-v386-chemistry-25-working-review.json');
assert.equal(deck.cards.length,3345);
assert.equal(new Set(deck.cards.map(c=>c.id)).size,3345);
assert.equal(audit.version,'v386');assert.equal(audit.rows.length,25);
assert.equal(audit.counts.marksRequiringManualWorking,166);
assert.equal(audit.counts.sourceBanks,4);
assert(sw.includes('-v386-chemistry166-manual'));
assert(app.includes('applyV386Chemistry25WorkingReview(examQuestions);'));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16)};
const first=app.indexOf('const V386_CHEMISTRY_25_MANUAL='),last=app.indexOf('const V287_LEGACY_SPEC_GROUPS=',first);
assert(first>0&&last>first);
const {selected,apply}=new Function(app.slice(first,last)+'\nreturn {selected:V386_CHEMISTRY_25_MANUAL,apply:applyV386Chemistry25WorkingReview};')();
assert.deepEqual(selected,audit.rows.map(({sourceFile,...row})=>row));
const banks=new Map(),sources=[];
for(const row of audit.rows){
 if(!banks.has(row.sourceFile))banks.set(row.sourceFile,json(row.sourceFile));
 const q=banks.get(row.sourceFile).questions.find(x=>x.id===row.id);
 assert(q,'Missing source '+row.id);
 for(const [k,v] of Object.entries({subject:'Chemistry',level:'AS',mock:true,standalone:true,requiresWorking:true,specRef:row.specRef,marks:row.marks}))assert.equal(q[k],v);
 assert.notEqual(q.taught,false);assert.notEqual(q.manualDiagramReview,true);assert.notEqual(q.manualWorkingReview,true);
 assert.equal(q.markPoints.length,q.marks);
 assert.equal(q.markPointMarks.reduce((s,v)=>s+v,0),q.marks);
 assert.equal(hash(q.prompt),row.promptHash);assert.equal(hash(q.modelAnswer),row.modelAnswerHash);
 sources.push(q);
}
assert.equal(banks.size,4);assert.equal(new Set(sources.map(q=>q.id)).size,25);
const snapshot=JSON.stringify(sources);
const updated=sources.map(q=>({...q,markPoints:[...q.markPoints],markPointMarks:[...q.markPointMarks]}));
apply(updated);
assert.equal(JSON.stringify(sources),snapshot);
assert.equal(updated.filter(q=>q.manualWorkingReview===true).length,25);
assert.equal(updated.reduce((s,q)=>s+(q.manualWorkingReview?q.marks:0),0),166);
const ms=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),me=app.indexOf('function startMockSession(){',ms);
assert(ms>0&&me>ms);
const eligible=new Function(app.slice(ms,me)+'\nreturn mockEligibleQuestion;')();
const es=app.indexOf('function examSuggested(q,answer){'),ee=app.indexOf(' // v213:',es);
assert(es>0&&ee>es);
const suggested=new Function('window',app.slice(es,ee)+'\n}\nreturn examSuggested;')({});
const hs=app.indexOf('function manualExamHelpText(q){'),he=app.indexOf('function beginManualExamReview(q){',hs);
const helper=new Function(app.slice(hs,he)+'\nreturn {help:manualExamHelpText,button:manualExamButtonText};')();
let responses=0,scopeChanges=0;
for(let i=0;i<sources.length;i++){
 const q=updated[i],original=sources[i];
 assert.equal(q.v386ReviewRequired,true);
 assert(eligible(q),'School mock filter incorrectly excludes '+q.id);
 assert.match(helper.help(q),/multi-step science question/);
 assert.equal(helper.button(q),'Review science working point by point');
 for(const answer of ['',q.modelAnswer,'I used the right method','full marks','1:2 and 100%']){
  const r=suggested(q,answer);
  assert.equal(r.manualRequired,true);assert.equal(r.suggested,0);
  assert.equal(r.finalCorrect,false);
  assert.deepEqual(r.preds,Array(q.marks).fill(false));
  assert.deepEqual(r.scores,Array(q.marks).fill(0));
  responses++;
 }
 for(const change of [
  {id:'not-an-existing-question'},{subject:'Physics'},{level:'A2'},{mock:false},{taught:false},
  {standalone:false},{requiresWorking:false},{manualDiagramReview:true},
  {manualWorkingReview:true},{specRef:'incorrect'},{marks:q.marks+1},
  {prompt:q.prompt+' changed'},{modelAnswer:q.modelAnswer+' changed'},
  {markPoints:[]},{markPointMarks:[]},{markPointMarks:[3]}
 ]){
  const altered={...original,...change};
  apply([altered]);
  assert.notEqual(altered.v386ReviewRequired,true,'False selection '+q.id+' '+JSON.stringify(change));
  scopeChanges++;
 }
}
assert.equal(responses,125);assert.equal(scopeChanges,400);
const previous=json('science_application_gaps_v333.json').questions.find(q=>q.id==='task1_v333_chem_03');
assert(previous.manualWorkingReview===true);
const old={...previous};apply([old]);assert.equal(old.manualWorkingReview,true);
assert.notEqual(old.v386ReviewRequired,true);
const near=(a,b,t=1e-9)=>assert(Math.abs(a-b)<=t,'Calculation mismatch '+a+' != '+b);
// Amount of substance: ions and number of entities.
near(0.125*6.02e23,7.525e22,1e12);
near(0.25*6.02e23,1.505e23,1e12);
// Ideal gas pV=nRT, volume cm3 to m3, molar mass g/mol.
const nGas=(1.2e5*250e-6)/(8.31*298);
near(nGas,0.0121144541,5e-7);near(nGas*44,0.5330,0.001);
// Titration, atom economy, and empirical/molecular formula.
near((0.1*0.0234/2)/0.025,0.0468);
near(106/(2*84)*100,63.095238095,1e-7);
near(0.72/12,0.06);near(0.12/1,0.12);near(0.96/16,0.06);
near(60/(12+2+16),2);
near(0.00375/0.05,0.075);
// Precision bank: nitrate formula mass, limiting reagent, hydrated salt.
near(40.1+2*(14+3*16),164.1);
near(0.02*164.1,3.282);
near(0.04*6.02e23,2.408e22,1e12);
near((0.683/106)/0.025,0.257735849,1e-7);
near(0.3*40.3,12.09);
near(0.18-0.3/2,0.03);
near((3.15/18)/(3/120.4),7.0233333,0.01);
// Back-titration: HCl left in 100 cm3, CaCO3 mass and percentage.
const hclLeft=(0.1*0.02)*(0.1/0.025);
const carbonate=(0.5*0.05-hclLeft)/2;
near(hclLeft,0.008);near(carbonate,0.0085);
near(carbonate*100.1,0.85085,1e-7);
near(carbonate*100.1/1.2*100,70.90416667,0.001);
// Supplied organic reports: cyclohexene theoretical mass and yield,
// plus early/late fraction mass accounting and recovery.
near(0.25*82,20.5);
near(16.4/(0.25*82)*100,80);
near(12+4+8,24);near(25-(12+4+8),1);
near(12/15*100,80);
// Verify non-numerical concept comparisons remain in original model answers.
for(const [id,terms] of [
 ['task1_v196_exam_05',['AgCl','AgBr','ammonia']],
 ['task1_v196_exam_06',['BaCO₃','BaSO₄','carbonate']],
 ['task1_v196_exam_07',['hydroxide','sulfate']],
 ['task1_v196_exam_08',['Cl₂','Br₂','I₂']],
 ['task1_v202_chem_05',['reflux','distillation','condenser']],
 ['task1_v202_chem_07',['alkene','aldehyde','alcohol']],
 ['task1_v202_chem_08',['primary','secondary','tertiary']],
 ['task1_v202_chem_09',['Butanal','2-Methylpropanal','Propanoic acid']]
]){
 const q=sources.find(q=>q.id===id);assert(q,id);
 for(const word of terms)assert(q.modelAnswer.toLowerCase().includes(word.toLowerCase()),'Lost original teaching point '+word+' '+id);
}
console.log('PASS v386: 25 exact original Chemistry AS school-mock questions and 166 rubric marks routed to manual review; 125 no-auto-credit answer probes; 400 false-scope cases, unchanged 3,345 core cards, saved-progress keys, existing manual questions, and independent numerical/concept checks.');
