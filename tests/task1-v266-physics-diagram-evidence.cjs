'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const j=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const a=j('editorial/task1-v266-physics-core-gaps-evidence.json'),old=j('editorial/task1-v242-physics-particles-crosswalk.json'),bank=j('physics_particle_exchange_diagram_practice_v265.json');
const app=fs.readFileSync('app.js','utf8');
assert.equal(a.version,'v266');assert.equal(a.rows.length,9);
const r=a.rows.find(x=>x.crosswalk==='editorial/task1-v242-physics-particles-crosswalk.json'&&x.requirementNumber===19);
assert(r&&r.status==='manual_drawing_practice_only');
assert.equal(old.requirements[18].coreEvidenceIds.length,0);
assert.equal(old.requirements[18].specRef,'3.2.1.4');
assert.equal(r.specRef,'3.2.1.4');assert.deepEqual(r.cardIds,[]);
assert.equal(r.originalDrawingQuestionIds.length,4);
assert.equal(a.finding.withRelevantSupplementExamples,8);assert.equal(a.finding.withOriginalManualDrawingPractice,1);
assert.equal(a.finding.withNoDirectExample,0);
for(const id of r.originalDrawingQuestionIds){
 const q=bank.questions.find(q=>q.id===id);assert(q,'Missing physical drawing question '+id);
 assert.equal(q.manualDiagramReview,true);assert.equal(q.subject,'Physics');
 assert.equal(q.specRef,'3.2.1.4');assert.equal(q.level,'AS');
 assert.equal(q.marks,4);assert.equal(q.markPoints.length,4);
 assert.equal(q.mock,true);assert.equal(q.taught,true);
}
assert(app.includes('if(q.manualDiagramReview===true){beginManualExamReview(q);return;}'));
assert.equal(a.completion.particleExchangeDrawingPracticeAvailable,true);
assert.equal(a.completion.particleExchangeDrawingAndMarkingVerified,false);
assert.equal(a.completion.task1Complete,false);
assert.equal(j('deck.json').cards.length,3345);
console.log('PASS v266: Physics interaction gap now has 4 manually assessed diagram prompts, but actual diagram-marking certification remains false.');
