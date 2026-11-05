'use strict';
// v337: current loaded AQA Amount-of-Substance evidence, not a mastery certificate.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');
const json=p=>JSON.parse(read(p));
const audit=json('editorial/task1-v337-amount-substance-live-evidence.json');
const app=read('app.js');
const base=json('deck.json').cards;
assert.equal(audit.version,'v337');
assert.equal(audit.counts.total,31);
assert.equal(audit.rows.length,31);
assert.equal(new Set(audit.rows.map(x=>x.id)).size,31);
assert.equal(audit.counts.originalCoreRecallSample,12);
assert.equal(audit.counts.previousCoreOnlyGapsNowWithRealSupplementCards,2);
assert.equal(audit.counts.applicationRowsStillRequiringManualExamReview,17);
const flashPaths=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const practicePaths=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert.equal(flashPaths.length,56);
assert(practicePaths.length>=47,'Preserve the existing 47 practice banks when later banks are appended');
assert.equal(practicePaths[45],'science_application_gaps_v333.json');
assert.equal(practicePaths[46],'maths_inequality_sign_reasoning_v335.json');
const flash=new Map([['deck.json',base],...flashPaths.map(p=>[p,json(p).cards||[]])]);
const practice=new Map(practicePaths.map(p=>[p,json(p).questions||[]]));
const st=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS=');
const en=app.indexOf('function startMockSession(){',st);
assert(st>=0&&en>st);
const eligible=new Function(app.slice(st,en)+'\nreturn {card:mockEligibleCard,question:mockEligibleQuestion};')();
let coreCount=0,flashCount=0,practiceCount=0;
const practiceIds=new Set();
for(const row of audit.rows){
 assert(/^AOS-(?:0[1-9]|[12][0-9]|3[01])$/.test(row.id));
 assert(/^3\.1\.2\.[1-5]$/.test(row.specRef));
 assert(row.originalCoreCardIds.length+row.additionalLoadedShortCards.length>0,'Unverified flashcard gap '+row.id);
 for(const id of row.originalCoreCardIds){
  const c=base.find(c=>c.id===id);
  assert(c&&c.subject==='Chemistry'&&c.mock===true&&eligible.card(c),'Core card not truly in mock: '+row.id+'/'+id);
  coreCount++;
 }
 for(const e of row.additionalLoadedShortCards){
  assert(flashPaths.includes(e.path),'Supplement not in live loader: '+e.path);
  const c=flash.get(e.path).find(c=>c.id===e.id);
  assert(c&&c.subject==='Chemistry'&&c.mock===true&&eligible.card(c),'Supplement not in mock: '+row.id+'/'+e.id);
  assert(c.front.length<=220&&c.back.length<=170,'Not a short flashcard: '+e.id);
  flashCount++;
 }
 for(const e of row.linkedExamPractice){
  assert(practicePaths.includes(e.path),'Practice bank not in live loader: '+e.path);
  const q=practice.get(e.path).find(q=>q.id===e.id);
  assert(q&&q.subject==='Chemistry'&&q.mock===true&&q.level==='AS'&&eligible.question(q),'Practice not in mock: '+row.id+'/'+e.id);
  assert(Number.isInteger(q.marks)&&q.marks>=4&&q.modelAnswer,'Must remain an actual written exam-practice question: '+e.id);
  practiceCount++;practiceIds.add(e.id);
 }
 if(row.priorCoreFinding==='application_unverified')
  assert.equal(row.reviewStatus,'short_evidence_plus_exam_work_required','Never imply application mastery: '+row.id);
}
assert.equal(audit.rows.filter(r=>r.reviewStatus==='original_core_recall_sample_evidenced').length,12);
const recovered=audit.rows.filter(r=>r.reviewStatus==='supplemental_recall_verified');
assert.deepEqual(recovered.map(r=>r.id),['AOS-03','AOS-11']);
assert.equal(audit.rows.filter(r=>r.reviewStatus==='short_evidence_plus_exam_work_required').length,17);
assert.equal(audit.rows.filter(r=>r.reviewStatus==='short_evidence_plus_exam_work_required'&&r.linkedExamPractice.length).length,16);
assert.deepEqual(audit.rows.filter(r=>r.reviewStatus==='short_evidence_plus_exam_work_required'&&!r.linkedExamPractice.length).map(r=>r.id),['AOS-27']);
assert.equal(practiceIds.size,14);
assert.equal(base.length,3345,'No original flashcard IDs removed');
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])
 assert(app.includes(key),'No changed progress storage scheme');
console.log('PASS v337: '+audit.rows.length+' AQA Chemistry amount skills, '+coreCount+' core and '+flashCount+' loaded supplementary short-card refs, '+practiceCount+' linked practice refs ('+practiceIds.size+' distinct questions), two resolved core-only apparent gaps, 17 applications expressly remain manual-review tasks.');
