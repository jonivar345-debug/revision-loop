'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),deck=json('deck.json'),bank=json('exam_questions.json'),corrections=json('exam_answer_corrections.json');
const audit=json('editorial/task1-v399-maths-15-working-qa.json');
assert.equal(deck.cards.length,3345);assert.equal(new Set(deck.cards.map(q=>q.id)).size,3345);
assert.equal(bank.questions.length,1268);assert.equal(new Set(bank.questions.map(q=>q.id)).size,1268);
assert.equal(audit.rows.length,15);assert.equal(audit.counts.manualMarks,84);
assert(sw.includes('-v399-maths84-working'));
assert(app.includes('applyV399MathsOriginal15Manual(examQuestions);'));
const hash=s=>{let h=2166136261;const v=String(s||'');for(let i=0;i<v.length;i++){h^=v.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16)};
const start=app.indexOf('const V399_MATHS_ORIGINAL_15='),end=app.indexOf('// v396: 18 exact, already-existing AS Physics worked exam questions',start);
assert(start>0&&end>start);
const {rows,apply}=new Function(app.slice(start,end)+'\\nreturn {rows:V399_MATHS_ORIGINAL_15,apply:applyV399MathsOriginal15Manual};'.replace('\\n','\n'))();
assert.deepEqual(rows,audit.rows);
const originals=rows.map(row=>{
 const q=bank.questions.find(x=>x.id===row.id);assert(q,'Missing source '+row.id);
 for(const [key,val] of Object.entries({subject:'Maths',level:'AS',mock:true,standalone:true,requiresWorking:true,topic:row.topic,marks:row.marks}))assert.equal(q[key],val);
 assert.notEqual(q.taught,false);assert.notEqual(q.manualWorkingReview,true);assert.notEqual(q.manualDiagramReview,true);
 assert.equal(q.courseTopic??null,row.courseTopic);assert.equal(q.specRef??null,row.specRef);assert.equal(q.questionType??null,row.questionType);
 assert.equal(q.markPoints.length,q.marks);assert.equal(q.markPointMarks.reduce((a,b)=>a+b,0),q.marks);
 assert.equal(hash(q.prompt),row.promptHash);assert.equal(hash(q.modelAnswer),row.answerHash);
 assert.equal(hash(JSON.stringify(q.markPoints)),row.pointsHash);assert.equal(hash(JSON.stringify(q.markPointMarks)),row.weightsHash);
 assert(!corrections.modelAnswers?.[q.id]&&!corrections.questionCorrections?.[q.id],'Unexpected effective correction '+q.id);
 return q;
});
assert.equal(originals.reduce((a,q)=>a+q.marks,0),84);
const snapshot=JSON.stringify(originals);
const patched=originals.map(q=>({...q,markPoints:[...q.markPoints],markPointMarks:[...q.markPointMarks]}));
apply(patched);
assert.equal(JSON.stringify(originals),snapshot,'Source bank mutated');
assert.equal(patched.filter(q=>q.v399ReviewRequired===true).length,15);
assert.equal(patched.reduce((a,q)=>a+(q.manualWorkingReview?q.marks:0),0),84);
const es=app.indexOf('function examSuggested(q,answer){'),ee=app.indexOf(' // v213:',es);
assert(es>0&&ee>es);
const suggested=new Function('window',app.slice(es,ee)+'\\n}\\nreturn examSuggested;'.replaceAll('\\n','\n'))({});
const hs=app.indexOf('function manualExamHelpText(q){'),he=app.indexOf('function beginManualExamReview(q){',hs);
assert(hs>0&&he>hs);
const helper=new Function(app.slice(hs,he)+'\\nreturn {help:manualExamHelpText,button:manualExamButtonText};'.replace('\\n','\n'))();
const ms=app.indexOf('function mockEligibleQuestion(q){'),me=app.indexOf('function startMockSession(){',ms);
assert(ms>0&&me>ms);
const eligible=new Function(app.slice(ms,me)+'\\nreturn mockEligibleQuestion;'.replace('\\n','\n'))();
let probes=0,mutations=0;
for(let i=0;i<originals.length;i++){
 const src=originals[i],q=patched[i];
 assert(eligible(q),'Question unexpectedly excluded from school Pure mock: '+q.id);
 assert.match(helper.help(q),/multi-step maths question/);
 assert.equal(helper.button(q),'Review maths working point by point');
 for(const answer of ['',q.modelAnswer,'I copied the model answer','I used a good method','please give me full marks']){
  const result=suggested(q,answer);assert.equal(result.manualRequired,true);assert.equal(result.suggested,0);
  assert.equal(result.finalCorrect,false);assert.deepEqual(result.preds,Array(q.marks).fill(false));
  assert.deepEqual(result.scores,Array(q.marks).fill(0));probes++;
 }
 for(const changes of [
  {id:'wrong id'},{subject:'Physics'},{level:'A-level'},{mock:false},{taught:false},
  {standalone:false},{requiresWorking:false},{manualDiagramReview:true},{manualWorkingReview:true},
  {topic:'Altered topic'},{courseTopic:'Altered course topic'},{specRef:'altered'},
  {questionType:'altered'},{marks:q.marks+1},{prompt:q.prompt+' edited'},{modelAnswer:q.modelAnswer+' edited'},
  {markPoints:[...q.markPoints.slice(0,-1),'altered point']},
  {markPointMarks:[...q.markPointMarks.slice(0,-1),2]}
 ]){
  const bad={...src,...changes};apply([bad]);
  assert.notEqual(bad.v399ReviewRequired,true,'Loose guard '+q.id+' '+JSON.stringify(changes));mutations++;
 }
}
assert.equal(probes,75);assert.equal(mutations,270);
// v397 school-mock exclusions must survive this independent marking change.
for(const id of ['orig_v33_math_7_0','orig_v33_math_8_0','original_v34_maths_18','stretch_v34_maths_functions','mock_v163_06']){
 const q=bank.questions.find(x=>x.id===id);assert(q&& !eligible(q),'Reintroduced later functions '+id);
}
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
// Independent maths checks against actual selected question data.
const src=id=>originals.find(q=>q.id===id);
assert(src('aqa_math_as18_p1_q5').modelAnswer.includes('c=−2'));
const c=-2,d=4;assert.equal((d-2)/(6-c),1/4);assert.equal((d+2)/2+4*(c+6)/2,11);
assert.equal(12/(1-0.5),24);assert.equal(2*3**5,486);
assert.equal(81/(1-2/3),243);assert.equal(243*(1-(2/3)**5),211);
assert(243*(2/3)**7>10&&243*(2/3)**8<10);
assert.equal((3**3/3+3**2)-((-1)**3/3+(-1)**2),32/3);
assert.equal(20*40,800);
const F=x=>x**3/3-4*x;
assert.equal(F(3)-F(-3),-6);assert.equal(32/3+2*(7/3),46/3);
for(const theta of [30,90,150]){const r=theta*Math.PI/180;assert(Math.abs(2*Math.cos(r)**2+3*Math.sin(r)-3)<1e-10)}
for(const x of [-2,0,1,4]){const v=(x-3)*(2*x-1)*(x+1);assert.equal(v<0,x===-2||x===1)}
assert.equal(32-240*.01+720*.01**2-1080*.01**3,29.67092);
console.log('PASS v399: 15 original Year 1 Pure worked questions; 84 manual marks; 75 zero-suggested-mark probes, 270 source guard mutations, v397 mock exclusion and independent maths calculations.');
