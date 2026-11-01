'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const bank=j('physics_particle_exchange_diagram_practice_v265.json'),app=read('app.js'),sw=read('sw.js');
assert.equal(bank.version,'v265');assert.equal(bank.questions.length,4);
assert.equal(j('deck.json').cards.length,3345);
const urls=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert.equal(urls.length,29);assert.equal(urls[28],'physics_particle_exchange_diagram_practice_v265.json');
assert(sw.includes("'./physics_particle_exchange_diagram_practice_v265.json'"));assert(sw.includes('-v265-physics-drawing'));
const old=[...j('exam_questions.json').questions,...urls.slice(0,28).flatMap(f=>j(f).questions||[])];
const existingIds=new Set(old.map(x=>x.id));const fronts=new Set(old.filter(x=>x.subject==='Physics').map(x=>String(x.prompt).trim().toLowerCase()));
for(const q of bank.questions){
 assert(!existingIds.has(q.id),'Question ID collision '+q.id);existingIds.add(q.id);
 assert(!fronts.has(q.prompt.trim().toLowerCase()),'Exact duplicate prompt '+q.id);
 fronts.add(q.prompt.trim().toLowerCase());
 assert.equal(q.subject,'Physics');assert.equal(q.level,'AS');assert.equal(q.specRef,'3.2.1.4');
 assert.equal(q.mock,true);assert.equal(q.taught,true);assert.equal(q.manualDiagramReview,true);
 assert.equal(q.answerType,'points');assert.equal(q.marks,4);
 assert.equal(q.markPoints.length,4);assert.deepEqual(q.markPointMarks,[1,1,1,1]);
 assert.equal(q.standalone,true);assert.equal(q.verificationLevel,'original-exam-style');
 assert(/draw|sketch/i.test(q.prompt));assert(q.modelAnswer.length>70);
}
const modeStart=app.indexOf('function examSuggested(q,answer){');
assert(modeStart>=0);const modeEnd=app.indexOf('function reviewedExpressionEvidence(',modeStart);assert(modeEnd>modeStart);
const source=app.slice(modeStart,modeEnd);
// With manualDiagramReview true we deliberately never attempt unknown keyword scoring.
const evaluator=new Function('window',source+'\nreturn examSuggested;')({});
for(const q of bank.questions){
 for(const input of ['', 'W- e- antineutrino neutron proton', 'A complete photo of a correct drawing']){
  const outcome=evaluator(q,input);
  assert.equal(outcome.suggested,0);assert.equal(outcome.manualRequired,true);
  assert.equal(outcome.preds.length,4);assert(outcome.preds.every(x=>x===false));
 }
}
const render=app.slice(app.indexOf('function renderExam(q){'),app.indexOf('function beginManualExamReview(q){'));
assert(render.includes("q.manualDiagramReview?'Review diagram marking points manually'"));
assert(render.includes("if(q.manualDiagramReview===true){beginManualExamReview(q);return;}"));
assert(app.includes("window.RevisionSketch?.mount(q)"));
assert(app.includes("window.RevisionScan?.mount(q.id)"));
const manual=app.slice(app.indexOf('function beginManualExamReview(q){'),app.indexOf('function renderScoreEditor('));
assert(manual.includes("map((p,i)=>"));assert(manual.includes('data-mp'));assert(manual.includes("currentExamScore=0"));
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
console.log('PASS v265: 4 AS particle exchange diagram problems, manually checked all four points, no invented OCR marks, no original ID/progress changes.');
