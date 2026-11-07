'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),rawCore=json('deck.json').cards;
// The production loader applies v314 editorial corrections before v379 marker
// calibration. In particular, the couple-distance front was shortened in
// memory while the original stored card and progress ID were preserved.
const start314=app.indexOf('function applyV314CoreMockQuality(existing){');
const end314=app.indexOf('// v315:',start314);
assert(start314>0&&end314>start314);
const applyV314=new Function(app.slice(start314,end314)+'\nreturn applyV314CoreMockQuality;')();
const core=rawCore.map(c=>({...c,accept:[...(c.accept||[])],reject:[...(c.reject||[])]}));
applyV314(core);
assert.equal(rawCore.length,core.length);
const audit=json('editorial/task1-v379-physics-twenty-core-markers.json');
const baseline=json('editorial/task1-v323-balanced-48-topic-evidence.json');
assert.equal(audit.version,'v379');assert.equal(audit.rows.length,20);
assert.equal(audit.counts.originalCoreIdsPreserved,3345);
assert.equal(audit.counts.newCorrectParaphrases,20);
assert.equal(audit.counts.newWrongMisconceptions,40);
assert.equal(audit.counts.distinctTopicGroups,5);
assert.equal(core.length,3345);assert.equal(new Set(core.map(x=>x.id)).size,3345);
assert(sw.includes('-v379-physics20-markers'));
assert(app.includes('applyV379PhysicsCoreMarkerCalibration(cards);'));
const start=app.indexOf('// v379: calibrate twenty original Physics AS mock short cards');
const end=app.indexOf('// v344:',start);
assert(start>0&&end>start);
const patch=new Function(app.slice(start,end)+'\nreturn applyV379PhysicsCoreMarkerCalibration;')();
const compiled=new Function(app.slice(start,end)+'\nreturn V379_PHYSICS_CORE_MARKER_ROWS;')();
assert.deepEqual(compiled,audit.rows.map(({sourceTopic,...r})=>r));
const normalizeStart=app.indexOf('function normalise('),normalizeEnd=app.indexOf('function importantTokens(',normalizeStart);
assert(normalizeStart>0&&normalizeEnd>normalizeStart);
const evaluate=new Function('window',app.slice(normalizeStart,normalizeEnd)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:{TARGET_ID:'__none__',evaluate:()=>null}});
const scopeStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),scopeEnd=app.indexOf('function startMockSession(){',scopeStart);
const eligible=new Function(app.slice(scopeStart,scopeEnd)+'\nreturn mockEligibleCard;')();
const byId=new Map(core.map(c=>[c.id,c]));
const old=new Map(baseline.topicGroups.flatMap(g=>g.reviewedSample.map(c=>[c.id,{...c,sourceTopic:g.topic}])));
let previousGood=0,previousWrong=0,newGood=0,newWrong=0,negGuards=0;
const ids=new Set(),topics=new Set();
for(const row of audit.rows){
 assert(!ids.has(row.id));ids.add(row.id);topics.add(row.sourceTopic);
 const src=byId.get(row.id),sample=old.get(row.id);
 assert(src&&sample,'Missing real original Physics card '+row.id);
 assert.equal(row.originalFront,sample.front);assert.equal(row.originalBack,sample.back);
 assert.equal(row.sourceTopic,sample.sourceTopic);
 assert.equal(src.front,row.originalFront);assert.equal(src.back,row.originalBack);
 assert.equal(src.subject,'Physics');assert.equal(src.stage,'AS');
 assert.equal(src.mock,true);assert.notEqual(src.active,false);
 assert(eligible(src),'Not in the Physics mock: '+row.id);
 assert(src.front.length<=180&&src.back.length<=200,'Not concise: '+row.id);
 assert.equal(row.accept.length,1);assert.equal(row.reject.length,2);
 const c={...src,accept:[...(src.accept||[])],reject:[...(src.reject||[])]};
 patch([c]);assert.equal(c.v379ExactReviewed,true);
 assert.equal(c.id,src.id);assert.equal(c.front,src.front);assert.equal(c.back,src.back);
 assert(eligible(c));assert.equal(evaluate(c,c.back).status,'correct','Original model regressed '+c.id);
 for(const v of src.accept||[]){assert.equal(evaluate(c,v).status,'correct','Previous correct failed '+c.id+' '+v);previousGood++;}
 for(const v of src.reject||[]){const r=evaluate(c,v);assert.equal(r.status,'wrong','Previous misconception failed '+c.id+' '+v);assert.equal(r.score,0);previousWrong++;}
 for(const v of row.accept){assert.equal(evaluate(c,v).status,'correct','New answer rejected '+c.id+' '+v);newGood++;}
 for(const v of row.reject){const r=evaluate(c,v);assert.equal(r.status,'wrong','New misconception credited '+c.id+' '+v);assert.equal(r.score,0);newWrong++;}
 for(const change of [{id:'no-such-card'},{front:'Changed question'},{back:'Changed model'},{subject:'Chemistry'},{stage:'A2'},{mock:false},{active:false}]){
  const wrong={...src,...change,accept:[],reject:[]};patch([wrong]);
  assert.notEqual(wrong.v379ExactReviewed,true,'Guard failed: '+c.id+' '+JSON.stringify(change));
  assert.deepEqual(wrong.accept,[]);assert.deepEqual(wrong.reject,[]);negGuards++;
 }
}
assert.equal(topics.size,5);assert.equal(newGood,20);assert.equal(newWrong,40);
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
console.log('PASS v379: '+ids.size+' Physics short mock cards, 20 accepted alternatives and 40 rejected misconceptions with live marker, '+negGuards+' exact-source guards, original 3345 card IDs and progress unchanged. Prior accepts '+previousGood+', rejects '+previousWrong+'.');