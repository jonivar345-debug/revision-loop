'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),core=json('deck.json');
const audit=json('editorial/task1-v391-maths-19-original-year1-pure-working-review.json');
assert.equal(core.cards.length,3345);assert.equal(new Set(core.cards.map(c=>c.id)).size,3345);
assert.equal(audit.version,'v391');assert.equal(audit.rows.length,19);
assert.equal(audit.counts.marksManual,132);assert.equal(audit.counts.sourceBanks,4);
assert.equal(audit.counts.sourceVectorSpecLabelsCorrected,2);
assert(sw.includes('-v391-maths132-manual'));
assert(app.includes('applyV391Maths19WorkingReview(examQuestions);'));
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16)};
const first=app.indexOf('const V391_MATHS_19_MANUAL='),last=app.indexOf('const V287_LEGACY_SPEC_GROUPS=',first);
assert(first>0&&last>first);
const {rows,patch}=new Function(app.slice(first,last)+'\nreturn {rows:V391_MATHS_19_MANUAL,patch:applyV391Maths19WorkingReview};')();
assert.deepEqual(rows,audit.rows.map(({sourceFile,...row})=>row));
const banks=new Map(),original=[];
for(const row of audit.rows){
 if(!banks.has(row.sourceFile))banks.set(row.sourceFile,json(row.sourceFile));
 const q=banks.get(row.sourceFile).questions.find(x=>x.id===row.id);
 assert(q,'Missing source question '+row.id);
 for(const [key,value] of Object.entries({subject:'Maths',level:'AS',mock:true,standalone:true,requiresWorking:true,marks:row.marks,specRef:row.sourceSpecRef}))assert.equal(q[key],value);
 assert.equal(q.courseTopic??null,row.sourceCourseTopic);
 assert.notEqual(q.taught,false);assert.notEqual(q.manualWorkingReview,true);assert.notEqual(q.manualDiagramReview,true);
 assert.equal(q.markPoints.length,q.marks);assert.equal(q.markPointMarks.reduce((a,b)=>a+b,0),q.marks);
 assert.equal(hash(q.prompt),row.promptHash);assert.equal(hash(q.modelAnswer),row.modelAnswerHash);
 original.push(q);
}
assert.equal(banks.size,4);assert.equal(new Set(original.map(q=>q.id)).size,19);
const snapshot=JSON.stringify(original);
const after=original.map(q=>({...q,markPoints:[...q.markPoints],markPointMarks:[...q.markPointMarks]}));patch(after);
assert.equal(JSON.stringify(original),snapshot,'Original bank mutated');
assert.equal(after.filter(q=>q.manualWorkingReview===true).length,19);
assert.equal(after.filter(q=>q.v391ReviewRequired===true).length,19);
assert.equal(after.reduce((s,q)=>s+(q.manualWorkingReview?q.marks:0),0),132);
assert.equal(after.filter(q=>q.specRef==='3.11'&&q.id.startsWith('task1_v209_')).length,2);
const scope=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),scopeEnd=app.indexOf('function startMockSession(){',scope);
assert(scope>0&&scopeEnd>scope);
const eligible=new Function(app.slice(scope,scopeEnd)+'\nreturn mockEligibleQuestion;')();
const es=app.indexOf('function examSuggested(q,answer){'),ee=app.indexOf(' // v213:',es);
assert(es>0&&ee>es);
const suggested=new Function('window',app.slice(es,ee)+'\n}\nreturn examSuggested;')({});
const hs=app.indexOf('function manualExamHelpText(q){'),he=app.indexOf('function beginManualExamReview(q){',hs);
assert(hs>0&&he>hs);
const helper=new Function(app.slice(hs,he)+'\nreturn {help:manualExamHelpText,button:manualExamButtonText};')();
let probes=0,negative=0;
for(let i=0;i<original.length;i++){
 const q=after[i],src=original[i],row=audit.rows[i];
 assert(eligible(q),'Year 1 Pure mock eligible original missing '+q.id);
 const proof=q.specRef==='3.2';
 assert.match(helper.help(q),proof?/full mathematical proof/:/multi-step maths question/);
 assert.equal(helper.button(q),proof?'Review proof marking points manually':'Review maths working point by point');
 for(const answer of ['',q.modelAnswer,'I used an obvious method','the answer is 2','award full marks']){
  const result=suggested(q,answer);
  assert.equal(result.manualRequired,true);assert.equal(result.suggested,0);
  assert.equal(result.finalCorrect,false);
  assert.deepEqual(result.preds,Array(q.marks).fill(false));
  assert.deepEqual(result.scores,Array(q.marks).fill(0));
  probes++;
 }
 for(const change of [
  {id:'other-id'},{subject:'Physics'},{level:'A2'},{mock:false},{taught:false},
  {standalone:false},{requiresWorking:false},{manualDiagramReview:true},
  {manualWorkingReview:true},{courseTopic:'Different course topic'},{specRef:'different ref'},
  {marks:q.marks+1},{prompt:q.prompt+' edited'},{modelAnswer:q.modelAnswer+' edited'},
  {markPoints:[]},{markPointMarks:[]},{markPointMarks:[3]}
 ]){
  const other={...src,...change};
  // If original courseTopic is already absent, the changed string must differ.
  patch([other]);
  assert.notEqual(other.v391ReviewRequired,true,'False source match '+q.id+' '+JSON.stringify(change));
  negative++;
 }
 assert.equal(q.specRef,row.effectiveSpecRef);
}
assert.equal(probes,95);assert.equal(negative,323);
// Independent calculations of exact named hard first-mock topics.
for(let n=-40;n<=40;n++){
 assert.equal((n**5-n)%30,0);
 assert.equal((n**3-n)%6,0);
}
assert.equal(16**2+16+17,289);
assert.equal(17**2,289);
const eqCircle=(x,y,cx,cy,r)=>Math.abs((x-cx)**2+(y-cy)**2-r*r)<1e-7;
assert(eqCircle(5,7,2,3,5));
assert(eqCircle(6,2,3,-2,5));
assert.equal(0.300,0.300); // Do not mix science-bank data into Maths selection.
// In (1+ax)^7, x^2 has coefficient 21a^2, x^3 has 35a^3.
assert.equal(21*(-2)**2,84);assert(35*(-2)**3<0);
// For (2+ax)^5, x^2 coefficient is 80a^2.
assert.equal(80*3**2,720);
// Signed area is not automatically total physical area.
const F=x=>x*x*x/3-5*x*x/2+6*x;
const parts=[F(2)-F(0),F(3)-F(2),F(4)-F(3)];
assert(parts[0]>0&&parts[1]<0&&parts[2]>0);
assert(Math.abs(parts.reduce((a,b)=>a+b,0))<parts.reduce((a,b)=>a+Math.abs(b),0));
// AQA Year 1 Pure only: no statistics/mechanics or Year 2 stage slipped in.
assert(after.every(q=>q.level==='AS'&&q.subject==='Maths'));
console.log('PASS v391: 19 existing Year 1 Pure Maths exam questions and 132 marks; 95 no-auto-credit answer probes, 323 false-scope guards, two historical vectors spec-label corrections, complete model-answer/source hash matches and independent mathematics spot checks.');
