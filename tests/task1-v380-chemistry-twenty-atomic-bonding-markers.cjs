'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const text=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(text(p));
const app=text('app.js'),sw=text('sw.js'),deck=json('deck.json').cards;
const audit=json('editorial/task1-v380-chemistry-twenty-atomic-bonding-ion-test-markers.json');
const baseline=json('editorial/task1-v323-balanced-48-topic-evidence.json');
assert.equal(deck.length,3345);assert.equal(new Set(deck.map(c=>c.id)).size,3345);
assert.equal(audit.version,'v380');assert.equal(audit.rows.length,20);
assert.equal(audit.counts.originalCoreCardsPreserved,3345);
assert.equal(audit.counts.correctParaphrasesAdded,20);assert.equal(audit.counts.incorrectMisconceptionsAdded,40);
assert(sw.includes('-v380-chem20-inorganic-markers'));
assert(app.includes('applyV380ChemistryCoreMarkerCalibration(cards);'));
const start=app.indexOf('// v380: calibrate twenty original AS Chemistry atomic');
const end=app.indexOf('// v344:',start);
assert(start>0&&end>start);
const patch=new Function(app.slice(start,end)+'\nreturn applyV380ChemistryCoreMarkerCalibration;')();
const rows=new Function(app.slice(start,end)+'\nreturn V380_CHEMISTRY_CORE_MARKER_ROWS;')();
assert.deepEqual(rows,audit.rows.map(({sourceTopic,...x})=>x));
const normal=app.indexOf('function normalise('),next=app.indexOf('function importantTokens(',normal);
assert(normal>0&&next>normal);
const evaluate=new Function('window',app.slice(normal,next)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:{TARGET_ID:'__none__',evaluate:()=>null}});
const firstScope=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),lastScope=app.indexOf('function startMockSession(){',firstScope);
assert(firstScope>0&&lastScope>firstScope);
const eligible=new Function(app.slice(firstScope,lastScope)+'\nreturn mockEligibleCard;')();
const byId=new Map(deck.map(c=>[c.id,c]));
const sample=new Map(baseline.topicGroups.flatMap(g=>g.reviewedSample.map(x=>[x.id,{...x,sourceTopic:g.topic}])));
let newGood=0,newWrong=0,oldGood=0,oldWrong=0,guards=0;
const topics=new Set(),ids=new Set();
for(const row of audit.rows){
 assert(!ids.has(row.id));ids.add(row.id);topics.add(row.sourceTopic);
 const src=byId.get(row.id),old=sample.get(row.id);
 assert(src&&old,'Missing original card '+row.id);
 assert.equal(src.front,row.originalFront);assert.equal(src.back,row.originalBack);
 assert.equal(old.front,row.originalFront);assert.equal(old.back,row.originalBack);
 assert.equal(old.sourceTopic,row.sourceTopic);
 assert.equal(src.subject,'Chemistry');assert.equal(src.stage,'AS');
 assert.equal(src.mock,true);assert.notEqual(src.active,false);assert(eligible(src));
 assert(src.front.length<=190&&src.back.length<=200);
 assert.equal(row.accept.length,1);assert.equal(row.reject.length,2);
 const c={...src,accept:[...(src.accept||[])],reject:[...(src.reject||[])]};
 patch([c]);assert.equal(c.v380ExactReviewed,true);assert(eligible(c));
 assert.equal(c.id,src.id);assert.equal(c.front,src.front);assert.equal(c.back,src.back);
 assert.equal(evaluate(c,c.back).status,'correct','Original model mismatch '+c.id);
 for(const v of src.accept||[]){assert.equal(evaluate(c,v).status,'correct','Previously accepted '+c.id);oldGood++;}
 for(const v of src.reject||[]){const r=evaluate(c,v);assert.equal(r.status,'wrong','Previously rejected '+c.id);assert.equal(r.score,0);oldWrong++;}
 for(const v of row.accept){assert.equal(evaluate(c,v).status,'correct','New accepted '+c.id+' '+v);newGood++;}
 for(const v of row.reject){const r=evaluate(c,v);assert.equal(r.status,'wrong','New misconception '+c.id+' '+v);assert.equal(r.score,0);newWrong++;}
 for(const change of [{id:'unknown'},{front:'Different prompt'},{back:'Different answer'},{subject:'Physics'},{stage:'A2'},{mock:false},{active:false}]){
  const c={...src,...change,accept:[],reject:[]};patch([c]);
  assert.notEqual(c.v380ExactReviewed,true);assert.deepEqual(c.accept,[]);assert.deepEqual(c.reject,[]);guards++;
 }
}
assert.equal(topics.size,5);assert.equal(newGood,20);assert.equal(newWrong,40);
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
console.log('PASS v380: 20 original AS Chemistry mock cards, 20 valid answers, 40 rejected misconceptions, '+guards+' scope exclusions; unchanged 3345 core cards, login and progress. Prior '+oldGood+' accepted and '+oldWrong+' rejected examples preserved.');
