'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),deck=json('deck.json'),
 bank=json('exam_questions.json'),corrections=json('exam_answer_corrections.json'),
 audit=json('editorial/task1-v405-short-semantic-qa.json');
assert.equal(deck.cards.length,3345);
assert.equal(bank.questions.length,1268);
assert.equal(new Set(bank.questions.map(q=>q.id)).size,1268);
assert.equal(audit.version,'v405');
assert.equal(audit.rows.length,9);
assert.equal(audit.counts.newManualMarks,17);
assert.equal(audit.counts.wrongNonZero,9);
assert.equal(audit.counts.wrongFull,5);
assert(sw.includes('-v405-semantic-short17-manual'));
const hash=v=>{
 let h=2166136261,s=String(v||'');
 for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
 return(h>>>0).toString(16);
};
const ps=app.indexOf('const V372_YEAR1_PURE_MANUAL='),pe=app.indexOf('const V287_LEGACY_SPEC_GROUPS=',ps);
const ms=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),me=app.indexOf('function startMockSession(){',ms);
assert(ps>0&&pe>ps&&ms>0&&me>ms);
const prior=app.slice(ps,pe),names=[...prior.matchAll(/function (applyV\d+[A-Za-z0-9_]+)\(questions\)/g)].map(m=>m[1]);
assert.equal(names.length,18);
const replay=new Function(prior+'\n'+app.slice(ms,me)+
 '\nreturn {guards:['+names.join(',')+'],eligible:mockEligibleQuestion};')();
const start=app.indexOf('const V405_SHORT_SEMANTIC_MANUAL='),end=app.indexOf('function examSuggested(q,answer){',start);
assert(start>0&&end>start);
const manual=new Function('mockEligibleQuestion','v403OriginalHash',
 app.slice(start,end)+'\nreturn {rows:V405_SHORT_SEMANTIC_MANUAL,apply:applyV405ShortSemanticManualReview};')(replay.eligible,hash);
assert.deepEqual(manual.rows,audit.rows.map(({
 wrongSuggested,wrongAnswer,originalPrompt,originalModelAnswer,
 originalMarkPoints,originalMarkPointMarks,...row})=>row));
assert(app.includes('applyV405ShortSemanticManualReview(examQuestions);'));
const originals=bank.questions.map(q=>({...q,markPoints:[...(q.markPoints||[])],
 markPointMarks:[...(q.markPointMarks||[])]}));
for(const q of originals){
 if(Object.hasOwn(corrections.modelAnswers||{},q.id))
  q.modelAnswer=corrections.modelAnswers[q.id];
 const corrected=corrections.questionCorrections?.[q.id];
 if(corrected&&typeof corrected==='object')for(const key of [
  'prompt','modelAnswer','markPoints','markPointMarks','markingMode',
  'markEvidenceRules','numericAnswer','tolerance']){
   if(Object.hasOwn(corrected,key))q[key]=corrected[key];
  }
}
for(const apply of replay.guards)apply(originals);
const byId=new Map(originals.map(q=>[q.id,q]));
const selected=audit.rows.map(r=>{
 const q=byId.get(r.id);
 assert(q,'Missing original '+r.id);
 for(const key of ['subject','level','topic','marks'])assert.equal(q[key],r[key],r.id+' '+key);
 for(const key of ['subtopic','courseTopic','specRef','questionType','requiresWorking'])
  assert.equal(q[key]??null,r[key],r.id+' '+key);
 assert.equal(q.mock,true);assert.equal(q.standalone,true);assert.notEqual(q.taught,false);
 assert.equal(q.answerType,'points');
 assert.notEqual(q.manualWorkingReview,true,'Already had working guard '+r.id);
 assert.notEqual(q.manualDiagramReview,true,'Already had diagram guard '+r.id);
 assert(replay.eligible(q),'First mock should include '+r.id);
 assert.equal(hash(q.prompt),r.promptHash);
 assert.equal(hash(q.modelAnswer),r.answerHash);
 assert.equal(hash(JSON.stringify(q.markPoints)),r.pointsHash);
 assert.equal(hash(JSON.stringify(q.markPointMarks)),r.weightsHash);
 assert.equal(q.prompt,r.originalPrompt);
 assert.equal(q.modelAnswer,r.originalModelAnswer);
 assert.deepEqual(q.markPoints,r.originalMarkPoints);
 assert.deepEqual(q.markPointMarks,r.originalMarkPointMarks);
 return q;
});
const needed=['clamp','normalise','tokens','compact','contradicts','importantTokens',
 'markPointPrediction','parseNumber','numericMatch','formulaScore','phraseScore',
 'evidenceRuleScore','totalMarkingPoints','acceptedMarkPointAlternative',
 'singleClaimEvidenceCap','reviewedShortAnswerFlags','hasMeaning','synonymSet',
 'stemToken','close','oppositeDirectionWords','lev'];
const fns=[...app.matchAll(/^function ([\w]+)\(/gm)].map(m=>({name:m[1],index:m.index}));
const get=name=>{
 const item=fns.find(x=>x.name===name);
 assert(item,'Missing evaluator helper '+name);
 const next=fns.find(x=>x.index>item.index);
 return app.slice(item.index,next?.index||app.length);
};
const es=app.indexOf('function examSuggested(q,answer){'),ee=app.indexOf('function examGraphDiagram(',es);
assert(es>0&&ee>es);
const score=new Function('window',needed.map(get).join('\n')+'\n'+app.slice(es,ee)+
 '\nreturn examSuggested;')({});
let falseMarks=0,wrongFull=0;
for(let i=0;i<selected.length;i++){
 const q=selected[i],row=audit.rows[i],actual=score(q,row.wrongAnswer);
 assert.equal(actual.suggested,row.wrongSuggested,'Baseline semantic error changed '+q.id);
 assert(actual.suggested>0);
 falseMarks+=actual.suggested;
 if(actual.suggested===q.marks)wrongFull++;
 assert.equal(score(q,q.modelAnswer).suggested,q.marks,'Valid model was undercredited before safeguard '+q.id);
}
assert.equal(falseMarks,13);
assert.equal(wrongFull,5);
const eligible=originals.filter(q=>replay.eligible(q)&&q.standalone===true&&q.taught!==false);
const short=eligible.filter(q=>q.marks<=2);
assert.equal(eligible.length,606);
assert.equal(short.length,398);
assert.equal(short.filter(q=>q.manualWorkingReview===true||q.manualDiagramReview===true).length,2);
const before=JSON.stringify(originals);
const patched=structuredClone(originals);
manual.apply(patched);
assert.equal(JSON.stringify(originals),before,'Source records mutated');
const changed=patched.filter(q=>q.v405ReviewRequired===true);
assert.deepEqual(changed.map(q=>q.id).sort(),audit.rows.map(r=>r.id).sort());
assert.equal(changed.length,9);
assert.equal(changed.reduce((n,q)=>n+q.marks,0),17);
assert(changed.every(q=>q.manualWorkingReview===true&&!q.v405SourceMismatch));
const shortAfter=patched.filter(q=>replay.eligible(q)&&q.standalone===true&&q.taught!==false&&q.marks<=2);
assert.equal(shortAfter.filter(q=>q.manualWorkingReview===true||q.manualDiagramReview===true).length,11);
for(let i=0;i<changed.length;i++){
 const q=changed[i],row=audit.rows.find(r=>r.id===q.id);
 for(const answer of [row.wrongAnswer,q.modelAnswer,q.prompt,'The answer is not '+q.modelAnswer]){
  const r=score(q,answer);
  assert.equal(r.manualRequired,true);
  assert.equal(r.suggested,0);
  assert.equal(r.finalCorrect,false);
  assert.deepEqual(r.preds,Array(q.markPoints.length).fill(false));
 }
}
let failClosed=0,outOfScope=0;
for(let i=0;i<selected.length;i++){
 const source=selected[i];
 for(const altered of [
  {prompt:source.prompt+' modified'},{modelAnswer:source.modelAnswer+' changed'},
  {topic:'changed topic'},
  {markPoints:[...source.markPoints,'new point']},
  {markPointMarks:[...source.markPointMarks,1]},
  {marks:source.marks+1}
 ]){
  const q={...source,...altered};
  manual.apply([q]);
  assert.equal(q.manualWorkingReview,true);
  assert.equal(q.v405ReviewRequired,true);
  assert.equal(q.v405SourceMismatch,true);
  assert.equal(score(q,source.modelAnswer).suggested,0);
  failClosed++;
 }
 for(const altered of [{id:source.id+'-other'},{mock:false},{taught:false},{standalone:false}]){
  const q={...source,...altered};
  manual.apply([q]);
  assert.notEqual(q.v405ReviewRequired,true);
  outOfScope++;
 }
}
assert.equal(failClosed,54);assert.equal(outOfScope,36);
const hs=app.indexOf('function manualExamHelpText(q){'),
 he=app.indexOf('function beginManualExamReview(q){',hs);
assert(hs>0&&he>hs);
const labels=new Function(app.slice(hs,he)+
 '\nreturn {help:manualExamHelpText,button:manualExamButtonText};')();
for(const q of changed){
 assert.match(labels.help(q),/short science explanation needs its meaning checked/);
 assert.equal(labels.button(q),'Review science explanation point by point');
}
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'",
 "PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])
 assert(app.includes(key));
console.log('PASS v405: nine original short science explanations/17 marks protected; five wrong full-mark and four wrong partial-mark probes replayed; '+
 failClosed+' source mutations fail closed, '+outOfScope+' out-of-scope cases excluded; 398 short first-mock parts retained, 11 manual short parts, all saved IDs/keys unchanged.');
