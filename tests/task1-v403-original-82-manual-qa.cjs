'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),bank=json('exam_questions.json'),
 corrections=json('exam_answer_corrections.json'),deck=json('deck.json'),
 audit=json('editorial/task1-v403-original-82-manual-qa.json');
assert.equal(bank.questions.length,1268);
assert.equal(new Set(bank.questions.map(q=>q.id)).size,1268);
assert.equal(deck.cards.length,3345);
assert.equal(new Set(deck.cards.map(q=>q.id)).size,3345);
assert.deepEqual(audit.counts.bySubject,{Physics:{questions:25,marks:78},Chemistry:{questions:41,marks:127},Maths:{questions:16,marks:48}});
assert.equal(audit.rows.length,82);assert.equal(audit.counts.newManualMarks,253);
assert(sw.includes('-v403-253-original-manual'));
assert(app.includes('applyV403Original82ManualReview(examQuestions);'));
const start=app.indexOf('const V372_YEAR1_PURE_MANUAL='),end=app.indexOf('const V287_LEGACY_SPEC_GROUPS=',start);
const ms=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),me=app.indexOf('function startMockSession(){',ms);
assert(start>=0&&end>start&&ms>0&&me>ms);
const before=app.slice(start,end),names=[...before.matchAll(/function (applyV\d+[A-Za-z0-9_]+)\(questions\)/g)].map(m=>m[1]).filter(n=>n!=='applyV403Original82ManualReview');
assert.equal(names.length,17);assert(names.includes('applyV402Original21ManualReview'));
const replay=new Function(before+'\n'+app.slice(ms,me)+
 '\nreturn {guards:['+names.join(',')+'],newGuard:applyV403Original82ManualReview,rows:V403_ORIGINAL_82_MANUAL,eligible:mockEligibleQuestion};')();
assert.deepEqual(replay.rows,audit.rows);
const originals=bank.questions.map(q=>({...q,markPoints:[...q.markPoints],markPointMarks:[...q.markPointMarks]}));
for(const q of originals){
 if(Object.hasOwn(corrections.modelAnswers||{},q.id))q.modelAnswer=corrections.modelAnswers[q.id];
 const ch=corrections.questionCorrections?.[q.id];
 if(ch&&typeof ch==='object')for(const key of ['prompt','modelAnswer','markPoints','markPointMarks','markingMode','markEvidenceRules','numericAnswer','tolerance']){
  if(Object.hasOwn(ch,key))q[key]=ch[key];
 }
}
for(const guard of replay.guards)guard(originals);
const eligible=originals.filter(q=>replay.eligible(q)&&q.standalone===true&&q.taught!==false&&q.marks>=3);
const previously=eligible.filter(q=>q.manualWorkingReview===true||q.manualDiagramReview===true);
const unguarded=eligible.filter(q=>q.manualWorkingReview!==true&&q.manualDiagramReview!==true);
assert.equal(eligible.length,208);assert.equal(eligible.reduce((n,q)=>n+q.marks,0),854);
assert.equal(previously.length,126);assert.equal(previously.reduce((n,q)=>n+q.marks,0),601);
assert.equal(unguarded.length,82);assert.equal(unguarded.reduce((n,q)=>n+q.marks,0),253);
assert.deepEqual(unguarded.map(q=>q.id),audit.rows.map(r=>r.id));
const hash=v=>{let h=2166136261;const s=String(v||'');for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(16)};
for(let i=0;i<unguarded.length;i++){
 const q=unguarded[i],r=audit.rows[i];
 for(const k of ['subject','level','topic','subtopic','courseTopic','specRef','questionType','requiresWorking','marks'])assert.equal(q[k]??null,r[k]??null,q.id+' '+k);
 assert.equal(hash(q.prompt),r.promptHash);assert.equal(hash(q.modelAnswer),r.answerHash);
 assert.equal(hash(JSON.stringify(q.markPoints)),r.pointsHash);assert.equal(hash(JSON.stringify(q.markPointMarks)),r.weightsHash);
 assert.equal(Boolean(Object.hasOwn(corrections.modelAnswers||{},q.id)||Object.hasOwn(corrections.questionCorrections||{},q.id)),r.correction);
}
const snapshot=JSON.stringify(originals),synthetic=structuredClone(originals);
replay.newGuard(synthetic);
assert.equal(JSON.stringify(originals),snapshot,'Mutated original before comparing saved state');
const protectedSet=synthetic.filter(q=>replay.eligible(q)&&q.standalone===true&&q.taught!==false&&q.marks>=3);
assert.equal(protectedSet.length,208);
assert.equal(protectedSet.filter(q=>q.manualWorkingReview===true||q.manualDiagramReview===true).length,208);
assert.equal(protectedSet.filter(q=>q.v403ReviewRequired===true).length,82);
assert.equal(protectedSet.filter(q=>q.v403SourceMismatch===true).length,0);
assert.equal(protectedSet.reduce((n,q)=>n+q.marks,0),854);
const ee=app.indexOf('function examSuggested(q,answer){'),ef=app.indexOf(' // v213:',ee);
const suggested=new Function('window',app.slice(ee,ef)+'\n}\nreturn examSuggested;')({});
assert(ee>0&&ef>ee);
let noCredit=0;
for(const q of protectedSet)for(const answer of ['',q.modelAnswer,q.prompt,'The model answer is incorrect. '+q.modelAnswer]){
 const r=suggested(q,answer);
 assert.equal(r.suggested,0,'Accidental unearned mark '+q.id);
 assert.equal(r.manualRequired,true);assert.equal(r.finalCorrect,false);
 assert.deepEqual(r.preds,Array(q.marks).fill(false));noCredit++;
}
assert.equal(noCredit,832);
// Known changed questions should fail closed, not silently regain fuzzy auto-credit.
let mutations=0;
for(const q of unguarded){
 for(const change of [
  {prompt:q.prompt+' changed'},{modelAnswer:q.modelAnswer+' changed'},
  {markPoints:[...q.markPoints.slice(0,-1),'changed']},
  {markPointMarks:[...q.markPointMarks.slice(0,-1),2]},
  {topic:'altered topic'},{courseTopic:'altered course'},{questionType:'altered type'},
  {marks:q.marks+1}
 ]){
  const altered={...q,...change};replay.newGuard([altered]);
  assert.equal(altered.v403ReviewRequired,true);
  assert.equal(altered.manualWorkingReview,true);
  assert.equal(altered.v403SourceMismatch,true);
  assert.equal(suggested(altered,altered.modelAnswer).suggested,0);
  mutations++;
 }
}
assert.equal(mutations,656);
const unrelated={...unguarded[0],id:'supplementary-different-source'};
replay.newGuard([unrelated]);assert.notEqual(unrelated.v403ReviewRequired,true);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
const pure=bank.questions.filter(q=>q.subject==='Maths'&&replay.eligible(q));assert.equal(pure.length,117);
console.log('PASS v403: all 208 original school-mock questions with at least 3 marks now require manual point review; 82 newly guarded / 253 marks, 832 zero-credit probes, 656 altered-source fail-closed probes; saved keys and scope preserved.');
