'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v185-maths-as-pure-outcome-crosswalk.json','utf8'));
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
const byId=new Map(deck.cards.map(c=>[c.id,c]));
assert.equal(audit.version,'v185');assert.equal(audit.completeSpecificationCertified,false);
assert.equal(audit.counts.allCards,3345);assert.equal(audit.counts.mockEligible,2379);
assert.equal(deck.cards.length,3345);
assert.equal(deck.cards.filter(c=>c.active!==false&&c.mock===true&&c.subject==='Maths').length,116);
assert.equal(audit.outcomes.length,audit.counts.reviewedMemoryOutcomes);
assert.equal(audit.outcomes.filter(r=>r.kind==='candidate_recall_gap').length,audit.counts.candidateRecallGaps);
assert(audit.counts.reviewedMemoryOutcomes>=70,'Coverage must actually sample many AS Pure outcomes');
assert(audit.counts.candidateRecallGaps>=6,'Do not claim every AS recall item is already covered');
assert(audit.outcomes.some(r=>r.section==='3.10 J2'));
for(const row of audit.outcomes){
 assert(/^3\.(?:2|3|4|5|6|7|8|9|10)\b/.test(row.section),'Non-Pure or wrong ref '+row.section);
 for(const id of row.cardIds){
  const c=byId.get(id);assert(c&&c.subject==='Maths'&&c.active!==false&&c.mock===true&&c.stage==='AS',id);
  assert(row.existingAnswerSamples.some(x=>x.id===id&&x.answer===c.back),'Stale answer '+id);
 }
}
const corrected=byId.get('maths_transform_003');
assert.equal(corrected.front,audit.cardCorrection.newFront);
assert.equal(corrected.back,audit.cardCorrection.newBack);
assert.match(corrected.front,/a > 0/);
assert(corrected.accept.includes('1/a'));assert(!corrected.concepts);
assert.match(html,/app\.js\?v=185/);assert.match(sw,/v185-as-pure-transform-marking/);
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(');
assert(start>=0&&end>start,'Cannot isolate flashcard marker');
const evaluate=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const good=[
 ['maths_transform_001','right'],['maths_transform_001','move a units right'],
 ['task1_maths_002','shift by a to the right'],['maths_transform_002','up'],
 ['task1_v162_003','left'],['task1_maths_004','reflection in the y-axis'],
 ['task1_v162_002','reflection in the x-axis'],
 ['task1_v162_001','vertical stretch by scale factor a'],
 ['maths_transform_003','1/a'],['maths_transform_003','x coordinates divided by a'],
 ['maths_transform_003','horizontal scale factor 1/a']
];
const bad=[
 ['maths_transform_001','left'],['task1_maths_002','translate a units left'],
 ['maths_transform_002','down'],['task1_v162_003','right'],
 ['task1_maths_004','reflection in the x-axis'],
 ['task1_v162_002','reflection in the y-axis'],
 ['task1_v162_001','horizontal stretch by scale factor a'],
 ['maths_transform_003','multiply x coordinates by a'],
 ['maths_transform_003','horizontal scale factor a'],
 ['maths_transform_001','left and right'],['task1_v162_002','x-axis and y-axis']
];
for(const [id,input] of good)assert.equal(evaluate(byId.get(id),input).status,'correct','Under-marked '+id+': '+input);
for(const [id,input] of bad)assert.equal(evaluate(byId.get(id),input).status,'wrong','Incorrect full/partial credit '+id+': '+input);
for(const id of audit.markingTargets){
 const c=byId.get(id);assert.equal(evaluate(c,c.back).status,'correct','Rejects model answer '+id);
 assert.equal(evaluate(c,'').status,'neutral','Blank review must remain neutral '+id);
}
assert(audit.limits.noNewCardsAdded&&audit.limits.allExistingCardIdsUnchanged&&audit.limits.allExamQuestionsUnchanged);
console.log('v185: AS Pure crosswalk '+audit.outcomes.length+' sampled outcomes, '+audit.counts.candidateRecallGaps+' candidates; eight transformations calibrated');
