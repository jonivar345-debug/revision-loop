'use strict';
// v413: source-identity check for the *existing* seven Waves and four
// Electricity unresolved evidence gates. No exercise/grading record changes.
const assert=require('node:assert/strict'),fs=require('node:fs');
const json=path=>JSON.parse(fs.readFileSync(path,'utf8'));
const app=fs.readFileSync('app.js','utf8');
const map=json('editorial/task1-v413-physics-eleven-gate-evidence-map.json');
const oldWaves=json('editorial/task1-v360-waves-coverage-and-open-gates.json');
const oldElectricity=json('editorial/task1-v359-electricity-45-evidence-review.json');
assert.equal(map.version,'v413');
assert.equal(oldWaves.remainingGates.length,7);
assert.equal(oldElectricity.gates.length,4);
assert.equal(map.gates.length,11);
assert.deepEqual(map.gates.map(r=>r.gate),
 ['W1','W2','W3','W4','W5','W6','W7','E1','E2','E3','E4']);
assert.deepEqual(map.summary,{
 wavesGates:7,electricityGates:4,
 electricityGatesWithPractice:4,wavesGatesWithPractice:6,
 wavesHistoryGateRecallOnly:1,
 independentStudentMethodOrDrawingGatesSignedOff:0,
 wholePhysicsMockSignedOff:false
});
const flashcardSources=[...app.matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const liveExtraSources=new Set(flashcardSources);
let evidence=0;
for(const g of map.gates){
 assert.equal(g.independentStudentDrawingReviewed,false,
  'Do not claim human-validated student evidence based on a source entry');
 assert(g.remaining&&g.remaining.length>30,'Missing concrete sign-off gate '+g.gate);
 const sources=[...(g.practice||[]),...(g.recall||[])];
 assert(sources.length>0,'No source evidence for '+g.gate);
 assert.equal(new Set(sources.map(x=>x.kind+'|'+x.file+'|'+x.id)).size,sources.length);
 assert(sources.some(x=>x.kind==='exam_practice')||(g.gate==='W7'&&
  sources.every(x=>x.kind==='short_recall')),'Unsupported exercise mapping');
 let containsCorrectSpec=false;
 for(const s of sources){
  assert(liveExtraSources.has(s.file),'Mapped source not loaded: '+s.file);
  assert(fs.existsSync(s.file),'Mapped file not committed '+s.file);
  const record=json(s.file);
  const items=s.kind==='exam_practice'?record.questions:record.cards;
  assert(Array.isArray(items),'Missing mapped record array '+s.file);
  const q=items.find(x=>x.id===s.id);
  assert(q,'Missing mapped record '+s.id);
  assert.equal(q.subject,'Physics');
  assert.equal(q.mock,true);
  assert.notEqual(q.taught,false);
  assert.notEqual(q.standalone,false);
  if(s.kind==='exam_practice'){
   assert(Number(q.marks)>0);
   assert(Array.isArray(q.markPoints)&&q.markPoints.length>0);
   assert(String(q.prompt||'').trim().length>30);
   assert(String(q.modelAnswer||'').trim().length>20);
  }else{
   assert(String(q.front||'').length>10);
   assert(String(q.back||'').length>10);
  }
  if(String(q.specRef||'')===g.specRef)containsCorrectSpec=true;
  evidence++;
 }
 assert(containsCorrectSpec,'Gate has no directly spec-aligned evidence '+g.gate);
}
for(let i=0;i<7;i++)assert.equal(map.gates[i].specRef,oldWaves.remainingGates[i].specRef);
for(let i=0;i<4;i++)assert.equal(map.gates[i+7].specRef,oldElectricity.gates[i].specRef);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'",
 "PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"]){
 assert(app.includes(key));
}
console.log('PASS v413: '+map.gates.length+
 ' independently unresolved Physics Waves/Electricity gates traced to '+evidence+
 ' exact already-loaded practice/short-card records; source metadata and mock scope valid. '+
 'Seven Waves and four Electricity human drawing/practical sign-off gates remain open; no question, flashcard or saved result changed.');
