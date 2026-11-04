'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const j=p=>JSON.parse(fs.readFileSync(p,'utf8')),app=fs.readFileSync('app.js','utf8');
const cross=j('editorial/task1-v334-year1-pure-skill-crosswalk.json');
assert.equal(cross.rows.length,43);
assert.equal(cross.counts.total,43);
assert.equal(cross.counts.sampleRecall,36);
assert.equal(cross.counts.needsExamReview,7);
assert.equal(cross.counts.partialWithPractice,6);
assert.equal(cross.counts.partialWithoutPractice,1);
assert(!cross.rows.some(r=>/inverse and composite functions/i.test(r.skill)),'Do not count deliberately excluded Year 2 function topic');
assert.deepEqual(cross.rows.filter(r=>r.status==='short_recall_plus_exam_work_required'&&!(r.practiceQuestionEvidence||[]).length).map(r=>r.id),['M11'],'Do not conceal the full rational-inequality practice gap');
assert.equal(new Set(cross.rows.map(r=>r.id)).size,43);
const extraPaths=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const practisePaths=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert.equal(extraPaths.length,56,'No changes to 56 mock flashcard banks');
assert(practisePaths.length>=45,'Keep the 45 original exam-practice banks when later versions append new banks');
assert.equal(practisePaths[44],'science_practical_diagram_applications_v313.json','Preserve original practice-bank order');
if(practisePaths.length>=46)assert.equal(practisePaths[45],'science_application_gaps_v333.json','Only append later practice banks after the original 45');
const base=j('deck.json').cards;
const cardBanks=new Map([['deck.json',base],...extraPaths.map(path=>[path,j(path).cards||[]])]);
const eligibleStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),eligibleEnd=app.indexOf('function mockEligibleQuestion(',eligibleStart);
assert(eligibleStart>=0&&eligibleEnd>eligibleStart);
const eligible=new Function(app.slice(eligibleStart,eligibleEnd)+'\nreturn mockEligibleCard;')();
let cardRefs=0,practiceRefs=0;
for(const row of cross.rows){
 assert(/^3\.(2|3|4|5|6|7|8|9|11)$/.test(row.specRef),'Only relevant AQA Pure headings');
 assert(row.evidence.length>0,'Real named flashcards required');
 assert(['sample_recall_verified','short_recall_plus_exam_work_required'].includes(row.status));
 for(const e of row.evidence){
  assert(cardBanks.has(e.path),'Evidence source not in actual runtime loader '+e.path);
  const c=cardBanks.get(e.path).find(x=>x.id===e.id);
  assert(c,'Missing original or loaded supplemental card '+e.id);
  assert.equal(c.subject,'Maths');
  assert.equal(c.mock,true,'No unrelated Year 2 or full-spec cards '+e.id);
  assert(eligible(c),'Card excluded by first-mock selector '+e.id);
  cardRefs++;
 }
 for(const e of row.practiceQuestionEvidence||[]){
  assert(practisePaths.includes(e.path),'Practice source not in loader '+e.path);
  const q=(j(e.path).questions||[]).find(x=>x.id===e.id);
  assert(q,'Missing cited Maths exam question '+e.id);
  assert.equal(q.subject,'Maths');
  assert.equal(q.level,'AS');
  assert.equal(q.mock,true);
  practiceRefs++;
 }
}
assert(cardRefs>=88&&practiceRefs>=11);
const combined=[...base,...extraPaths.flatMap(path=>j(path).cards||[])];
assert.equal(combined.length,4344,'Preserve whole flashcard bank');
assert.equal(new Set(combined.map(c=>c.id)).size,combined.length,'Preserve unique progress IDs');
const mockMaths=combined.filter(c=>c.subject==='Maths'&&eligible(c));
assert.equal(mockMaths.length,331,'Preserve exactly 331 first-mock Maths flashcards');
console.log('PASS v334: 43 AQA first-mock Pure skills across 9 specification sections, '+cardRefs+' real flashcard source refs, '+practiceRefs+' original multi-mark exam question refs, 6 application rows with linked practice, one unverified inequality-worked-answer gap, all 331 mock Maths cards preserved.');
