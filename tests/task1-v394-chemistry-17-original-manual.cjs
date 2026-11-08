'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),data=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),deck=data('deck.json');
const audit=data('editorial/task1-v394-chemistry-17-original-manual-qa.json');
const originals=data('exam_questions.json').questions;
const correction=data('exam_answer_corrections.json');
assert.equal(deck.cards.length,3345);
assert.equal(new Set(deck.cards.map(x=>x.id)).size,3345);
assert.equal(audit.version,'v394');
assert.equal(audit.rows.length,17);
assert.equal(audit.counts.manualMethodMarks,66);
assert(sw.includes('-v394-chem66-manual'));
assert(app.includes('applyV394ChemistryOriginal17Manual(examQuestions);'));
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16)};
const effective=orig=>({
 ...orig,
 ...(correction.modelAnswers?.[orig.id]?{modelAnswer:correction.modelAnswers[orig.id]}:{}),
 ...(correction.questionCorrections?.[orig.id]||{})
});
const start=app.indexOf('const V394_CHEMISTRY_ORIGINAL_17='),end=app.indexOf('const V393_PHYSICS_ORIGINAL_12=',start);
assert(start>=0&&end>start);
const {rows,apply}=new Function(app.slice(start,end)+'\nreturn {rows:V394_CHEMISTRY_ORIGINAL_17,apply:applyV394ChemistryOriginal17Manual};')();
assert.deepEqual(rows,audit.rows);
const questions=audit.rows.map(row=>{
 const raw=originals.find(q=>q.id===row.id);
 assert(raw,'Missing original question '+row.id);
 const q=effective(raw);
 assert.equal(q.subject,'Chemistry');
 assert(['AS','A-level'].includes(q.level));
 assert.equal(q.level,row.level);
 assert.equal(q.mock,true);
 assert.notEqual(q.taught,false);
 assert.equal(q.standalone,true);
 assert.equal(q.requiresWorking,true);
 assert.notEqual(q.manualDiagramReview,true);
 assert.notEqual(q.manualWorkingReview,true);
 assert.equal(q.topic,row.topic);
 assert.equal(q.courseTopic??null,row.courseTopic);
 assert.equal(q.specRef??null,row.specRef);
 assert.equal(q.marks,row.marks);
 assert.equal(q.markPoints.length,q.marks);
 assert.equal(q.markPointMarks.reduce((s,v)=>s+v,0),q.marks);
 assert.equal(hash(q.prompt),row.promptHash);
 assert.equal(hash(q.modelAnswer),row.modelAnswerHash);
 assert.equal(hash(JSON.stringify(q.markPoints)),row.markPointsHash);
 return q;
});
assert.equal(new Set(questions.map(q=>q.id)).size,17);
const untouchedSnapshot=JSON.stringify(questions);
const patched=questions.map(q=>({...q,markPoints:[...q.markPoints],markPointMarks:[...q.markPointMarks]}));
apply(patched);
assert.equal(JSON.stringify(questions),untouchedSnapshot);
assert.equal(patched.filter(q=>q.v394ReviewRequired).length,17);
assert.equal(patched.reduce((s,q)=>s+(q.manualWorkingReview?q.marks:0),0),66);
const es=app.indexOf('function examSuggested(q,answer){'),ee=app.indexOf(' // v213:',es);
assert(es>=0&&ee>es);
const suggested=new Function('window',app.slice(es,ee)+'\n}\nreturn examSuggested;')({});
const hs=app.indexOf('function manualExamHelpText(q){'),he=app.indexOf('function beginManualExamReview(q){',hs);
assert(hs>=0&&he>hs);
const helper=new Function(app.slice(hs,he)+'\nreturn {help:manualExamHelpText,button:manualExamButtonText};')();
const ms=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),me=app.indexOf('function startMockSession(){',ms);
assert(ms>=0&&me>ms);
const mockEligible=new Function(app.slice(ms,me)+'\nreturn mockEligibleQuestion;')();
let noAuto=0,negativeGuards=0;
for(let i=0;i<questions.length;i++){
 const q=patched[i],src=questions[i];
 assert(mockEligible(q),'Taught chemistry mock item excluded '+q.id);
 assert.match(helper.help(q),/multi-step science question/);
 assert.equal(helper.button(q),'Review science working point by point');
 for(const answer of ['',q.modelAnswer,'I have shown all the calculations','All answers are correct','give me full marks']){
  const m=suggested(q,answer);
  assert.equal(m.manualRequired,true);
  assert.equal(m.suggested,0);
  assert.equal(m.finalCorrect,false);
  assert.deepEqual(m.preds,Array(q.marks).fill(false));
  assert.deepEqual(m.scores,Array(q.marks).fill(0));
  noAuto++;
 }
 const changes=[
  {id:'not-this-source'}, {subject:'Physics'}, {level:q.level==='AS'?'A-level':'AS'}, {mock:false}, {taught:false},
  {standalone:false}, {requiresWorking:false},{manualDiagramReview:true},{manualWorkingReview:true},
  {topic:'other'}, {courseTopic:'other'}, {specRef:'3.1.999'}, {marks:q.marks+1},
  {prompt:q.prompt+' changed'}, {modelAnswer:q.modelAnswer+' changed'},
  {markPoints:[...q.markPoints.slice(0,-1),'wrong']}, {markPointMarks:[2,...q.markPointMarks.slice(1)]}
 ];
 for(const change of changes){
  const fake={...src,...change};apply([fake]);
  assert.notEqual(fake.v394ReviewRequired,true,'Loose source match '+q.id+' '+JSON.stringify(change));
  negativeGuards++;
 }
}
assert.equal(noAuto,85);
assert.equal(negativeGuards,289);
const titration=questions.find(q=>q.id==='aqa_chem_as16_p1_q3_2');
assert(titration);
assert(!titration.markPoints.some(x=>/1464 mg|convert.*mg/i.test(x)));
assert(titration.markPoints.some(x=>/1:1/.test(x)));
assert(titration.markPoints.some(x=>/250\/25\.0/.test(x)));
assert(titration.modelAnswer.includes('148 (3 significant figures)'));
const gas=questions.find(q=>q.id==='aqa_chem_as16_p1_q5_2');
assert(gas);
assert(gas.modelAnswer.includes('337.3 cm³'));
assert(gas.markPoints.some(x=>/337 cm³/.test(x)));
assert.equal(gas.numericAnswer,337.3333333333);
const near=(actual,expected,tol=1e-7)=>assert(Math.abs(actual-expected)<=tol,'Unexpected result '+actual+' vs '+expected);
// Chemistry numerical examples verified separately from string matching to stored answers.
near(0.102*9.70/1000,9.894e-4,1e-9);
near(1.464/(9.89e-4*10),148.0283,0.001);
near((102000*1e-3/(8.31*300))*17,0.696,0.001);
near(((102/75)*(295/300)*1000)-1000,337.3333333333,1e-8);
near(0.00500*0.250*104*1000,130);
near((23.90+24.00)/2,23.95);
near((0.0400*0.500 - 0.0180*0.400)/2*100.1/0.850*100,75.4,0.1);
near(0.20*134+0.28*129+0.25*131+0.27*132,131.31);
const speed=0.960/4.654e-6; const mass=2*2.438e-15/(speed*speed);
near(mass*6.022e23*1000,69.0,0.2);
near(3**2*0.5,4.5);
near((612+436)-(347+2*413),-125);
near((36.6-38)/(180-120),-1.4/60,1e-9);
near((38+1.4)-20,19.4,1e-10);
near(-(50*4.18*19.4/1000)/0.100,-40.5,0.1);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v394: 17 original Chemistry mock applications / 66 marks manual, 85 no-auto-credit probes, 289 source-negative probes, titration mark correction, existing 337 cm3 gas correction, independent numerical calculations and stable 3345 IDs/progress.');