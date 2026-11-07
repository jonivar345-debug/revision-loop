'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js');
const audit=json('editorial/task1-v382-maths-eighteen-worked-exam-manual-marking.json'),core=json('deck.json');
assert.equal(core.cards.length,3345);
assert.equal(new Set(core.cards.map(c=>c.id)).size,3345);
assert.equal(audit.version,'v382');
assert.equal(audit.rows.length,18);
assert.equal(audit.counts.marksRequiringManualWorking,112);
assert.equal(audit.counts.sourceBanks,4);
assert.equal(audit.counts.vectorSourceSpecLabelsCorrectedFrom310To311,2);
assert(sw.includes('-v382-maths112-manual'));
assert(app.includes('applyV382MathsWorkedExamManualReview(examQuestions);'));
assert(app.includes('if(q.manualDiagramReview===true||q.manualWorkingReview===true){beginManualExamReview(q);return;}'));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(16)};
const first=app.indexOf('const V382_MATHS_WORKED_MANUAL='),last=app.indexOf('const V287_LEGACY_SPEC_GROUPS=',first);
assert(first>0&&last>first);
const {selected,apply}=new Function(app.slice(first,last)+'\nreturn {selected:V382_MATHS_WORKED_MANUAL,apply:applyV382MathsWorkedExamManualReview};')();
assert.deepEqual(selected,audit.rows.map(({sourceFile,...row})=>row));
const banks=new Map(),orig=[];
for(const row of audit.rows){
 if(!banks.has(row.sourceFile))banks.set(row.sourceFile,json(row.sourceFile));
 const q=banks.get(row.sourceFile).questions.find(x=>x.id===row.id);
 assert(q,'Missing original '+row.id);
 for(const [k,v] of Object.entries({subject:'Maths',level:'AS',mock:true,standalone:true,requiresWorking:true,marks:row.marks}))assert.equal(q[k],v);
 assert.equal(q.courseTopic??null,row.sourceCourseTopic);
 assert.equal(q.specRef??null,row.sourceSpecRef);
 assert.notEqual(q.taught,false);assert.notEqual(q.manualDiagramReview,true);assert.notEqual(q.manualWorkingReview,true);
 assert.equal(q.markPoints.length,q.marks);
 assert.equal(q.markPointMarks.reduce((a,b)=>a+b,0),q.marks);
 assert.equal(hash(q.prompt),row.promptHash);
 assert.equal(hash(q.modelAnswer),row.modelAnswerHash);
 orig.push(q);
}
assert.equal(banks.size,4);assert.equal(new Set(orig.map(q=>q.id)).size,18);
const originalSnapshot=JSON.stringify(orig);
const modified=orig.map(q=>({...q,markPoints:[...q.markPoints],markPointMarks:[...q.markPointMarks]}));
apply(modified);
assert.equal(JSON.stringify(orig),originalSnapshot,'Original source bank was modified');
assert.equal(modified.filter(q=>q.manualWorkingReview===true).length,18);
assert.equal(modified.reduce((sum,q)=>sum+(q.manualWorkingReview?q.marks:0),0),112);
assert.equal(modified.filter(q=>q.specRef==='3.11').length,3);
const ms=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),me=app.indexOf('function startMockSession(){',ms);
const eligible=new Function(app.slice(ms,me)+'\nreturn mockEligibleQuestion;')();
const es=app.indexOf('function examSuggested(q,answer){'),ee=app.indexOf(' // v213:',es);
assert(es>0&&ee>es);
const suggested=new Function('window',app.slice(es,ee)+'\n}\nreturn examSuggested;')({});
const hs=app.indexOf('function manualExamHelpText(q){'),he=app.indexOf('function beginManualExamReview(q){',hs);
const helper=new Function(app.slice(hs,he)+'\nreturn {help:manualExamHelpText,button:manualExamButtonText};')();
let probes=0,negative=0;
for(let i=0;i<orig.length;i++){
 const src=orig[i],q=modified[i],row=audit.rows[i];
 assert.equal(q.v382ReviewRequired,true);
 assert.equal(q.specRef??null,row.effectiveSpecRef);
 assert(eligible(q),'Source Year 1 Pure question excluded from first mock '+q.id);
 assert.match(helper.help(q),q.specRef==='3.2'?/full mathematical proof/:/multi-step maths question/);
 assert.equal(helper.button(q),q.specRef==='3.2'?'Review proof marking points manually':'Review maths working point by point');
 for(const answer of ['',q.modelAnswer,'all marks please','just my final answer','2:1']){
  const result=suggested(q,answer);
  assert.equal(result.manualRequired,true);
  assert.equal(result.suggested,0);
  assert.equal(result.finalCorrect,false);
  assert.deepEqual(result.preds,Array(q.marks).fill(false));
  assert.deepEqual(result.scores,Array(q.marks).fill(0));
  probes++;
 }
 for(const change of [
  {id:'different-id'},{subject:'Chemistry'},{level:'A2'},{mock:false},{taught:false},
  {standalone:false},{requiresWorking:false},{courseTopic:'Different topic'},
  {specRef:'wrong spec'},{marks:q.marks+1},{prompt:q.prompt+' altered'},
  {modelAnswer:q.modelAnswer+' altered'},{markPoints:[]},{markPointMarks:[]},
  {manualDiagramReview:true},{manualWorkingReview:true}
 ]){
  const altered={...src,...change};
  apply([altered]);
  assert.notEqual(altered.v382ReviewRequired,true,'Scope guard failed '+q.id+' '+JSON.stringify(change));
  negative++;
 }
}
assert.equal(probes,90);assert.equal(negative,288);
const approx=(a,b,t=1e-8)=>assert(Math.abs(a-b)<t,String(a)+' does not match '+String(b));
for(let n=-25;n<=25;n++){
 assert.equal(((n**5-n)%30+30)%30,0,'Divisibility 30');
 assert.equal(((2*n+1)**2-1)%8,0,'Odd squares mod 8');
}
for(let n=-3;n<=3;n++)assert((n**3-n)%6===0,'Consecutive-integers proof, including negative zero');
assert.equal((8-(-1)),9);
assert.equal(10*2**3*3**2,720);
assert.equal(5*2*3**4,810);
const integral=x=>x**3/3-2*x*x+3*x;
approx(integral(1)-integral(0),4/3);
approx(integral(1)-integral(3),4/3);
approx(integral(4)-integral(3),4/3);
approx(3*(5)+4*(5),35);
approx(Math.hypot(-7.5,1.5),3*Math.sqrt(26)/2);
console.log('PASS v382: 18 exact original AQA Year 1 Pure worked questions and 112 marks routed to manual review; 90 no-auto-credit responses, 288 false-scope guards, two vectors section corrections and numerical spot checks.');
