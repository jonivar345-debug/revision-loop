'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const bank=j('chemistry_organic_drawing_practice_v267.json'),app=read('app.js'),sw=read('sw.js'),physics=j('physics_particle_exchange_diagram_practice_v265.json');
assert.equal(bank.version,'v267');assert.equal(bank.questions.length,4);
assert.equal(j('deck.json').cards.length,3345);
const urls=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert(urls.length>=30,'v267 must retain all first 30 original practice banks');
assert.equal(urls[28],'physics_particle_exchange_diagram_practice_v265.json');
assert.equal(urls[29],'chemistry_organic_drawing_practice_v267.json');
assert(sw.includes("'./chemistry_organic_drawing_practice_v267.json'"));assert(sw.includes('-v267-chemistry'));
const ids=new Set(physics.questions.map(q=>q.id)),seenSections=new Set(),expectedMarks=[4,4,4,4];
for(const [i,q] of bank.questions.entries()){
 assert(!ids.has(q.id));ids.add(q.id);seenSections.add(q.specRef);
 assert.equal(q.subject,'Chemistry');assert.equal(q.level,'A2');assert.equal(q.mock,true);assert.equal(q.taught,true);
 assert.equal(q.verificationLevel,'original-exam-style');assert.equal(q.manualDiagramReview,true);
 assert.equal(q.marks,expectedMarks[i]);assert.equal(q.markPoints.length,q.marks);
 assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));assert.equal(q.standalone,true);
 assert(/draw/i.test(q.prompt));assert(q.modelAnswer.length>100);
}
assert.deepEqual([...seenSections].sort(),['3.3.1.3','3.3.7','3.3.8','3.3.9.1']);
const start=app.indexOf('function examSuggested(q,answer){'),end=app.indexOf(' // v213:',start);
assert(start>0&&end>start);
const evalManual=new Function('window',app.slice(start,end)+'\n}\nreturn examSuggested;')({});
for(const q of bank.questions){
 const outcome=evalManual(q,'curly arrows, oxygen and ester words but no drawing');
 assert.equal(outcome.manualRequired,true);assert.equal(outcome.suggested,0);
 assert.equal(outcome.preds.length,q.marks);assert(outcome.preds.every(v=>v===false));
}
assert(app.includes("if(q.manualDiagramReview===true){beginManualExamReview(q);return;}"));
assert(app.includes("window.RevisionSketch?.mount(q)"));assert(app.includes("window.RevisionScan?.mount(q.id)"));
assert(!bank.questions.some(q=>q.prompt.toLowerCase().includes('how to prepare')||q.prompt.toLowerCase().includes('laboratory method')));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v267: four Chemistry drawings (16 total original marks), all require manual rubric review; no false automatic mechanism marks.');
