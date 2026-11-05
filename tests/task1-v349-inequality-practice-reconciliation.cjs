'use strict';
// Additive v349 audit: keep the v334 historical snapshot intact and recognise subsequent v335 practice.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const snapshot=json('editorial/task1-v334-year1-pure-skill-crosswalk.json');
const update=json('editorial/task1-v349-inequality-practice-reconciliation.json');
const bank=json('maths_inequality_sign_reasoning_v335.json');
const app=read('app.js'),sw=read('sw.js');
assert.equal(update.version,'v349');
assert.equal(update.historicalSnapshot,'editorial/task1-v334-year1-pure-skill-crosswalk.json');
assert.equal(update.subsequentBank,'maths_inequality_sign_reasoning_v335.json');
assert.equal(snapshot.counts.total,43);
assert.equal(snapshot.counts.needsExamReview,7);
assert.equal(snapshot.counts.partialWithPractice,6,'Keep the dated v334 position intact');
assert.equal(snapshot.counts.partialWithoutPractice,1,'Keep the dated v334 position intact');
const rows=snapshot.rows.filter(r=>r.status==='short_recall_plus_exam_work_required');
assert.equal(rows.length,7);
const originalUnlinked=rows.filter(r=>!(r.practiceQuestionEvidence||[]).length);
assert.deepEqual(originalUnlinked.map(r=>r.id),['M11']);
assert.equal(update.latestSampledEvidence.sampledSkillRows,43);
assert.equal(update.latestSampledEvidence.reasoningHeavyRows,7);
assert.equal(update.latestSampledEvidence.practiceLinkedRows,7);
assert.equal(update.latestSampledEvidence.practiceUnlinkedRows,0);
assert.equal(update.latestSampledEvidence.allAqaBulletsCertified,false);
assert.equal(update.latestSampledEvidence.manualWorkingStillRequired,true);
const p=app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/);
assert(p,'Cannot find actual exam-practice loader');
const loaded=[...p[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert(loaded.includes(update.subsequentBank),'Both problems must be included in site exam-practice loader');
assert(sw.includes("'./maths_inequality_sign_reasoning_v335.json'"),'Bank must be cached for offline revision');
assert.equal(update.newLinks.length,2);
assert.deepEqual(update.newLinks.map(e=>e.questionId),['task1_v335_maths_01','task1_v335_maths_02']);
assert.equal(new Set(update.newLinks.map(e=>e.questionId)).size,2);
for(const e of update.newLinks){
 assert.equal(e.skillId,'M11');
 assert.equal(e.path,update.subsequentBank);
 assert.equal(e.marks,7);
 const q=bank.questions.find(c=>c.id===e.questionId);
 assert(q,'Missing cited inequality problem '+e.questionId);
 assert(q.subject==='Maths'&&q.level==='AS'&&q.mock===true&&q.taught===true);
 assert(q.specRef==='3.3'&&q.skillId==='v334_M11');
 assert(q.marks===7&&q.requiresWorking===true&&q.manualWorkingReview===true);
 assert.equal(q.markPoints.length,q.marks);
}
const linked=rows.map(row=>({
 id:row.id,
 paths:[...(row.practiceQuestionEvidence||[]).map(e=>e.path),
          ...update.newLinks.filter(e=>e.skillId===row.id).map(e=>e.path)]
}));
assert.equal(linked.filter(r=>r.paths.length).length,7,'All seven sampled reasoning rows now have practice evidence');
assert.equal(linked.filter(r=>!r.paths.length).length,0);
console.log('PASS v349: historical v334 snapshot intact; two real v335 7-mark inequality problems now linked for M11; all seven sampled reasoning skills have exam practice; no claim of mastery or full AQA bullet coverage.');
