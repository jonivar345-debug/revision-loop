'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),core=json('deck.json').cards;
const audit=json('editorial/task1-v381-maths-twenty-one-core-marker-review.json');
const base=json('editorial/task1-v323-balanced-48-topic-evidence.json');
assert.equal(core.length,3345);assert.equal(new Set(core.map(c=>c.id)).size,3345);
assert.equal(audit.version,'v381');assert.equal(audit.rows.length,21);
assert.equal(audit.counts.originalCoreIdsProtected,3345);
assert.equal(audit.counts.newValidParaphrases,21);
assert.equal(audit.counts.newIncorrectConcepts,42);assert.equal(audit.counts.distinctTopicGroups,7);
assert(sw.includes('-v381-maths21-core-markers'));
assert(app.includes('applyV381MathsYear1CoreMarkers(cards);'));
const st=app.indexOf('// v381: exact original Year 1 Pure Maths short-card calibration');
const en=app.indexOf('// v344:',st);
assert(st>0&&en>st);
const patch=new Function(app.slice(st,en)+'\nreturn applyV381MathsYear1CoreMarkers;')();
const prod=new Function(app.slice(st,en)+'\nreturn V381_MATHS_YEAR1_CORE_MARKERS;')();
assert.deepEqual(prod,audit.rows.map(({sourceTopic,...r})=>r));
const normal=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',normal);
assert(normal>0&&end>normal);
const evaluate=new Function('window',app.slice(normal,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:{TARGET_ID:'__none__',evaluate:()=>null}});
const firstScope=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),lastScope=app.indexOf('function startMockSession(){',firstScope);
assert(firstScope>0&&lastScope>firstScope);
const eligible=new Function(app.slice(firstScope,lastScope)+'\nreturn mockEligibleCard;')();
const byId=new Map(core.map(c=>[c.id,c]));
const sample=new Map(base.topicGroups.flatMap(g=>g.reviewedSample.map(x=>[x.id,{...x,sourceTopic:g.topic}])));
const groups=new Set(),seen=new Set();
let accepted=0,rejected=0,priorAccepted=0,priorRejected=0,scopeGuards=0;
for(const row of audit.rows){
 assert(!seen.has(row.id),'Repeated original Maths card');seen.add(row.id);groups.add(row.sourceTopic);
 const orig=byId.get(row.id),baseline=sample.get(row.id);
 assert(orig&&baseline,'Original card/baseline missing '+row.id);
 assert.equal(row.sourceTopic,baseline.sourceTopic);
 assert.equal(baseline.front,row.originalFront);assert.equal(baseline.back,row.originalBack);
 assert.equal(orig.front,row.originalFront);assert.equal(orig.back,row.originalBack);
 assert.equal(orig.subject,'Maths');assert.equal(orig.stage,'AS');
 assert.equal(orig.mock,true);assert.notEqual(orig.active,false);
 assert(eligible(orig),'Not Year 1 Pure mock eligible '+row.id);
 assert(orig.front.length<=180&&orig.back.length<=200,'Keep concise '+row.id);
 assert.equal(row.accept.length,1);assert.equal(row.reject.length,2);
 const c={...orig,accept:[...(orig.accept||[])],reject:[...(orig.reject||[])]};
 patch([c]);assert.equal(c.v381ExactReviewed,true);
 assert.equal(c.id,orig.id);assert.equal(c.front,orig.front);assert.equal(c.back,orig.back);
 assert(eligible(c));
 assert.equal(evaluate(c,c.back).status,'correct','Original answer regressed '+c.id);
 for(const value of orig.accept||[]){assert.equal(evaluate(c,value).status,'correct','Previous valid answer rejected '+c.id+' '+value);priorAccepted++;}
 for(const value of orig.reject||[]){const v=evaluate(c,value);assert.equal(v.status,'wrong','Previous wrong answer credited '+c.id+' '+value);assert.equal(v.score,0);priorRejected++;}
 for(const value of row.accept){assert.equal(evaluate(c,value).status,'correct','Valid Maths variant rejected '+c.id+' '+value);accepted++;}
 for(const value of row.reject){const v=evaluate(c,value);assert.equal(v.status,'wrong','Incorrect Maths claim credited '+c.id+' '+value);assert.equal(v.score,0);rejected++;}
 for(const diff of [{id:'other-id'},{front:'Edited Maths question'},{back:'Edited model answer'},{subject:'Physics'},{stage:'A2'},{mock:false},{active:false}]){
   const altered={...orig,...diff,accept:[],reject:[]};
   patch([altered]);assert.notEqual(altered.v381ExactReviewed,true,'Unsafe eligibility '+c.id+' '+JSON.stringify(diff));
   assert.deepEqual(altered.accept,[]);assert.deepEqual(altered.reject,[]);scopeGuards++;
 }
}
assert.equal(groups.size,7);assert.equal(accepted,21);assert.equal(rejected,42);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v381: 21 existing Year 1 Pure Maths short cards, 21 correct rewordings, 42 wrong concepts rejected, '+scopeGuards+' negative scope guards; '+priorAccepted+' earlier good and '+priorRejected+' earlier bad responses preserved; original 3345 core cards and user progress untouched.');
