'use strict';
// Live loader v412: guard only supplementary mock multi-mark questions.
// A marked point still requires learner verification; no auto-credit is awarded.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=path=>fs.readFileSync(path,'utf8');
const json=path=>JSON.parse(read(path));
const app=read('app.js'),sw=read('sw.js');
const original=json('exam_questions.json'),deck=json('deck.json'),
 corrections=json('exam_answer_corrections.json');
assert.equal(deck.cards.length,3345);
assert.equal(original.questions.length,1268);
assert.equal(new Set(deck.cards.map(q=>q.id)).size,3345);
assert.equal(new Set(original.questions.map(q=>q.id)).size,1268);
assert(sw.includes('-v409-negated-markpoints-v412-supplement-manual'),
 'Offline marker cache must refresh while preserving v409 release checks');
const matches=app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/);
assert(matches,'Extra bank manifest missing');
const paths=[...matches[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
assert.equal(paths.length,52);
const allSources=['exam_questions.json','paper_supplement_2016_2017.json',...paths];
const records=allSources.flatMap(p=>{
 assert(fs.existsSync(p),'Missing loaded source: '+p);
 return (json(p).questions||[]).map(q=>({...q,__source:p}));
});
const seen=new Set();
const questions=records.filter(q=>{
 if(seen.has(q.id))return false;
 seen.add(q.id);return true;
});
assert.equal(questions.length,1670);
for(const q of questions){
 if(Object.hasOwn(corrections.modelAnswers||{},q.id))
  q.modelAnswer=corrections.modelAnswers[q.id];
 const changed=corrections.questionCorrections?.[q.id];
 if(changed&&typeof changed==='object'){
  for(const k of ['prompt','modelAnswer','markPoints','markPointMarks',
    'markingMode','markEvidenceRules','numericAnswer','tolerance']){
   if(Object.hasOwn(changed,k))q[k]=changed[k];
  }
 }
}
const gs=app.indexOf('const V372_YEAR1_PURE_MANUAL=');
const ge=app.indexOf('const V287_LEGACY_SPEC_GROUPS=',gs);
const ms=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS=');
const me=app.indexOf('function startMockSession(){',ms);
const gsrc=app.slice(gs,ge);
const guards=[...gsrc.matchAll(/function (applyV\d+[A-Za-z0-9_]+)\(questions\)/g)]
 .map(m=>m[1]);
assert.equal(guards.length,18);
const r=new Function(gsrc+'\n'+app.slice(ms,me)+
 '\nreturn {guards:['+guards.join(',')+'],eligible:mockEligibleQuestion};')();
for(const guard of r.guards)guard(questions);
const hash=value=>{
 const s=String(value||'');let h=2166136261;
 for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
 return (h>>>0).toString(16);
};
const v405=app.indexOf('const V405_SHORT_SEMANTIC_MANUAL=');
const scorer=app.indexOf('function examSuggested(q,answer){');
const apply405=new Function('mockEligibleQuestion','v403OriginalHash',
 app.slice(v405,scorer)+'\nreturn applyV405ShortSemanticManualReview;')(r.eligible,hash);
apply405(questions);
const mock=questions.filter(q=>q.standalone!==false&&r.eligible(q));
const supplemental=q=>q.__source!=='exam_questions.json';
const multi=mock.filter(q=>q.marks>=3);
const originalMulti=multi.filter(q=>!supplemental(q));
const extraMulti=multi.filter(supplemental);
const initiallyUnguarded=extraMulti.filter(q=>!q.manualWorkingReview&&!q.manualDiagramReview);
assert.equal(mock.length,898);
assert.equal(originalMulti.length,208);
assert.equal(extraMulti.length,292);
assert.equal(initiallyUnguarded.length,118);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,
 initiallyUnguarded.filter(q=>q.subject===s).length])),{
 Physics:23,Chemistry:95,Maths:0
});
assert.equal(initiallyUnguarded.reduce((n,q)=>n+q.marks,0),800);
const originalSnapshot=JSON.stringify(questions.filter(q=>!supplemental(q)));
const protectedBefore=extraMulti.filter(q=>q.manualWorkingReview||q.manualDiagramReview)
 .map(q=>q.id);
const guardStart=app.indexOf(' const originalQuestionIds=new Set((e.questions||[]).map(q=>q.id));');
const guardEnd=app.indexOf(' deckMeta=d.meta||{}',guardStart);
assert(guardStart>0&&guardEnd>guardStart,'v412 supplement safety not used in live loader');
const source=app.slice(guardStart,guardEnd);
const protect=new Function('examQuestions','e','mockEligibleQuestion',
 source+'\nreturn examQuestions;');
protect(questions,original,r.eligible);
assert.equal(JSON.stringify(questions.filter(q=>!supplemental(q))),originalSnapshot,
 'v412 changed original-bank metadata');
assert.deepEqual(extraMulti.filter(q=>q.manualWorkingReview||q.manualDiagramReview)
 .map(q=>q.id).filter(id=>protectedBefore.includes(id)),protectedBefore,
 'Previously guarded supplemental questions changed');
const changed=extraMulti.filter(q=>q.v412SupplementManualRequired===true);
assert.equal(changed.length,118);
assert(changed.every(q=>q.manualWorkingReview===true&&!q.manualDiagramReview),
 'Supplement newly protected should use existing manual point route');
assert(extraMulti.every(q=>q.manualWorkingReview===true||q.manualDiagramReview===true),
 'A supplementary multi-mark mock item still uses speculative text marks');
assert(originalMulti.every(q=>!q.v412SupplementManualRequired),
 'Original guard source must remain untouched');
const start=app.indexOf('function examSuggested(q,answer){');
const end=app.indexOf(' // v213:',start);
const early=new Function('window',app.slice(start,end)+'\n}\nreturn examSuggested;')({});
let probes=0;
for(const q of extraMulti){
 for(const a of ['',q.modelAnswer,q.prompt,
   'The model answer is incorrect. '+q.modelAnswer]){
  const suggestion=early(q,a);
  assert(suggestion&&suggestion.manualRequired===true&&suggestion.suggested===0,
   'Supplement reached generic marking '+q.id);
  assert.equal(suggestion.finalCorrect,false);
  assert.deepEqual(suggestion.preds,Array(q.markPoints.length).fill(false));
  probes++;
 }
}
const click=app.indexOf("document.getElementById('markExam').onclick=async()=>{");
const manual=app.indexOf('function beginManualExamReview(q){',click);
assert(click>0&&manual>click);
assert(app.slice(click,manual).includes(
 'if(q.manualDiagramReview===true||q.manualWorkingReview===true){beginManualExamReview(q);return;}'));
assert(app.slice(manual,app.indexOf('function renderScoreEditor(',manual)).includes('currentExamScore=0'));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'",
 "PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"]){
 assert(app.includes(key));
}
console.log('PASS v412: all 292 supplementary multi-mark mock parts now manually routed; '+
 changed.length+' newly protected (23 Physics, 95 Chemistry, 800 marks), '+
 (extraMulti.length-changed.length)+' existing manual guards retained, '+
 probes+' original-question-independent zero-auto-score probes, '+
 originalMulti.length+' original multi-mark routes unchanged; 898 mock parts, stable cards and progress keys.');
