'use strict';
// Read-only full runtime bank audit. It exposes supplementary-paper marking
// gaps without guessing that passing a core-bank test signs off all content.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=path=>fs.readFileSync(path,'utf8');
const json=path=>JSON.parse(read(path));
const app=read('app.js');
const deck=json('deck.json');
const original=json('exam_questions.json');
const corrections=json('exam_answer_corrections.json');
assert.equal(original.questions.length,1268);
assert.equal(deck.cards.length,3345);

const match=app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/);
assert(match,'Missing live supplementary practice file manifest');
const supplements=[...match[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
assert.equal(supplements.length,52,'Supplement loader changed; investigate new files');
const sources=['exam_questions.json','paper_supplement_2016_2017.json',...supplements];
const raw=sources.flatMap(path=>{
 assert(fs.existsSync(path),'Source absent from runtime: '+path);
 const bank=json(path);
 assert(Array.isArray(bank.questions),'No question array: '+path);
 return bank.questions.map(q=>({...q,__auditSource:path}));
});
const seen=new Set();
const questions=raw.filter(q=>{
 if(seen.has(q.id))return false;
 seen.add(q.id);return true;
});
assert.equal(questions.filter(q=>q.__auditSource==='exam_questions.json').length,1268,
 'Core question source was silently overridden');
for(const q of questions){
 if(Object.hasOwn(corrections.modelAnswers||{},q.id)){
  q.modelAnswer=corrections.modelAnswers[q.id];
 }
 const changes=corrections.questionCorrections?.[q.id];
 if(changes&&typeof changes==='object'){
  for(const k of ['prompt','modelAnswer','markPoints','markPointMarks',
   'markingMode','markEvidenceRules','numericAnswer','tolerance']){
   if(Object.hasOwn(changes,k))q[k]=changes[k];
  }
 }
}
const gs=app.indexOf('const V372_YEAR1_PURE_MANUAL=');
const ge=app.indexOf('const V287_LEGACY_SPEC_GROUPS=',gs);
const ms=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS=');
const me=app.indexOf('function startMockSession(){',ms);
assert(gs>0&&ge>gs&&ms>0&&me>ms);
const guardBlock=app.slice(gs,ge);
const names=[...guardBlock.matchAll(/function (applyV\d+[A-Za-z0-9_]+)\(questions\)/g)]
 .map(x=>x[1]);
assert.equal(names.length,18);
const runtime=new Function(guardBlock+'\n'+app.slice(ms,me)+
 '\nreturn {guards:['+names.join(',')+'],eligible:mockEligibleQuestion};')();
for(const guard of runtime.guards)guard(questions);
const hash=value=>{
 let h=2166136261,s=String(value||'');
 for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
 return (h>>>0).toString(16);
};
const v405s=app.indexOf('const V405_SHORT_SEMANTIC_MANUAL=');
const ess=app.indexOf('function examSuggested(q,answer){');
assert(v405s>0&&ess>v405s);
const v405=new Function('mockEligibleQuestion','v403OriginalHash',
 app.slice(v405s,ess)+'\nreturn applyV405ShortSemanticManualReview;')(runtime.eligible,hash);
v405(questions);
// v412: repeat the *actual later supplement manual-review guard* rather than
// interpreting the pre-v412 source-only baseline as the currently displayed UI.
const guardStart=app.indexOf(' const originalQuestionIds=new Set((e.questions||[]).map(q=>q.id));');
const guardEnd=app.indexOf(' deckMeta=d.meta||{}',guardStart);
assert(guardStart>0&&guardEnd>guardStart,'Missing live supplemental mark-safety guard');
new Function('examQuestions','e','mockEligibleQuestion',
 app.slice(guardStart,guardEnd)+'\nreturn examQuestions;')(questions,original,runtime.eligible);
const mock=questions.filter(q=>q.standalone!==false&&runtime.eligible(q));
const core=mock.filter(q=>q.__auditSource==='exam_questions.json');
const supplement=mock.filter(q=>q.__auditSource!=='exam_questions.json');
const bySubject=(arr)=>Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>{
 const data=arr.filter(q=>q.subject===s);
 const multi=data.filter(q=>q.marks>=3);
 const unguarded=multi.filter(q=>q.manualWorkingReview!==true&&q.manualDiagramReview!==true);
 return [s,{all:data.length,multimark:multi.length,
  manualMultimark:multi.length-unguarded.length,unguardedMultimark:unguarded.length,
  unguardedMarks:unguarded.reduce((n,q)=>n+(Number(q.marks)||0),0)}];
}));
assert.equal(core.length,606,'Original school mock inventory drift');
assert.equal(core.filter(q=>q.marks>=3).length,208);
assert.equal(core.filter(q=>q.marks>=3&&!q.manualWorkingReview&&!q.manualDiagramReview).length,0);
const malformed=mock.filter(q=>!String(q.prompt||'').trim()||
 !Array.isArray(q.markPoints)||!q.markPoints.length||
 !Number.isInteger(q.marks)||q.marks<=0);
const wrongWeights=mock.filter(q=>Array.isArray(q.markPointMarks)&&
 q.markPointMarks.length>0&&q.markPointMarks.reduce((s,n)=>s+Number(n||0),0)!==q.marks);
const denied=mock.filter(q=>q.subject==='Chemistry'&&
 /\bbuffers?\b|\bbuffering\b|\bbuffered\b|henderson[\s-]*hasselbalch/i.test(
 [q.prompt,q.topic,q.subtopic,q.courseTopic,q.revisionTopic,q.question].join(' ')));
const outOfScopeMaths=mock.filter(q=>q.subject==='Maths'&&
 (q.level!=='AS'||/^(?:statistics|mechanics)$/i.test(String(q.topic||''))||
 /(?:\bradians?\b|π)/i.test(String(q.prompt||''))));
const unguardedSupplement=supplement.filter(q=>q.marks>=3&&!q.manualDiagramReview&&!q.manualWorkingReview);
const drawingPattern=/\b(?:draw|sketch|diagram|plot|curly.arrow|mechanism|show your working|prove|proof)\b/i;
const drawingUnguarded=supplement.filter(q=>drawingPattern.test(q.prompt||'')&&
 !q.manualDiagramReview&&!q.manualWorkingReview);
const sourceCounts=Object.fromEntries(sources.map(s=>[s,{
  loaded:questions.filter(q=>q.__auditSource===s).length,
  mock:mock.filter(q=>q.__auditSource===s).length
}]));
const report={
 code:'v411',version:'2026-11-08',readOnly:true,
 rawRecords:raw.length,uniqueRuntimeQuestions:questions.length,
 duplicateIdsDropped:raw.length-questions.length,
 totalLiveMockParts:mock.length,
 bySubject:bySubject(mock),original:bySubject(core),supplement:bySubject(supplement),
 sources:sources.length,
 countMalformed:malformed.length,malformedSample:malformed.slice(0,20).map(q=>q.id),
 countRubricWeightMismatch:wrongWeights.length,
 rubricMismatchSample:wrongWeights.slice(0,20).map(q=>({id:q.id,marks:q.marks,weights:q.markPointMarks})),
 bufferLeak:denied.map(q=>q.id),
 outOfScopeMaths:outOfScopeMaths.map(q=>q.id),
 unguardedSupplementCount:unguardedSupplement.length,
 unguardedSupplementByTopic:Object.fromEntries([...new Set(unguardedSupplement.map(q=>q.subject+' | '+(q.topic||'unknown')))]
  .map(key=>[key,unguardedSupplement.filter(q=>q.subject+' | '+(q.topic||'unknown')===key).length]).sort((a,b)=>b[1]-a[1])),
 unguardedSupplementSample:unguardedSupplement.slice(0,80).map(q=>({
  id:q.id,subject:q.subject,marks:q.marks,type:q.questionType||null,requiresWorking:q.requiresWorking||false,
  source:q.__auditSource,topic:q.topic})),
 drawingUnguardedCount:drawingUnguarded.length,
 drawingUnguardedSample:drawingUnguarded.slice(0,40).map(q=>({id:q.id,subject:q.subject,source:q.__auditSource,marks:q.marks})),
 noClaims:['The audit does not automatically determine that a missing manual flag is a scoring error.',
  'The source bank may contain answer variants, specialist checked marking modes, and short simple calculations.',
  'No student handwriting, diagram, underlying practical, or individual answer was marked.']
};
assert.equal(denied.length,0,'Buffers leaked into Chemistry mock session');
assert.equal(outOfScopeMaths.length,0,'A2, Statistics, Mechanics or radians leaked into Maths mock');
assert.equal(unguardedSupplement.length,0,'v412 supplementary multi-mark still reaches generic marking');
console.log('PASS v411 updated live mock eligibility and v412 supplementary manual routing; independent student-working sign-off remains open.');
console.log('V411_AUDIT_JSON_START');
console.log(JSON.stringify(report,null,2));
console.log('V411_AUDIT_JSON_END');
