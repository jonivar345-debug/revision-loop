'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),core=json('deck.json').cards;
const audit=json('editorial/task1-v388-forty-original-core-short-markers.json');
const baseline=json('editorial/task1-v323-balanced-48-topic-evidence.json');
assert.equal(core.length,3345);
assert.equal(new Set(core.map(c=>c.id)).size,3345);
assert.equal(audit.version,'v388');
assert.equal(audit.rows.length,40);
assert.equal(audit.counts.Physics,20);
assert.equal(audit.counts.Chemistry,20);
assert.equal(audit.counts.correctVariants,40);
assert.equal(audit.counts.wrongVariants,80);
assert(sw.includes('-v388-short40-markers'));
assert(app.includes('applyV388Core40ShortMarkers(cards);'));
const st=app.indexOf('const V388_CORE40_SHORT_MARKERS='),en=app.indexOf('// v344:',st);
assert(st>0&&en>st);
const {rows,patch}=new Function(app.slice(st,en)+'\nreturn {rows:V388_CORE40_SHORT_MARKERS,patch:applyV388Core40ShortMarkers};')();
assert.deepEqual(rows,audit.rows.map(({sourceTopic,...r})=>r));
const at=app.indexOf('function normalise('),ed=app.indexOf('function importantTokens(',at);
assert(at>0&&ed>at);
const evaluate=new Function('window',app.slice(at,ed)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:{TARGET_ID:'__none__',evaluate:()=>null}});
const ft=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),lt=app.indexOf('function startMockSession(){',ft);
assert(ft>0&&lt>ft);
const eligible=new Function(app.slice(ft,lt)+'\nreturn mockEligibleCard;')();
const source=new Map(baseline.topicGroups.flatMap(g=>g.reviewedSample.map(c=>[c.id,{...c,sourceTopic:g.topic,subject:g.subject}])));
const byId=new Map(core.map(c=>[c.id,c]));
const ids=new Set(),topics=new Set();
let accepted=0,rejected=0,previousAccepted=0,previousRejected=0,guarded=0;
for(const row of audit.rows){
 assert(!ids.has(row.id),'Duplicate original ID '+row.id);ids.add(row.id);
 const orig=byId.get(row.id),sourceCard=source.get(row.id);
 assert(orig&&sourceCard,'Original core/source missing '+row.id);
 assert.equal(orig.front,row.originalFront);
 assert.equal(orig.back,row.originalBack);
 assert.equal(orig.subject,row.subject);
 assert.equal(sourceCard.front,row.originalFront);
 assert.equal(sourceCard.back,row.originalBack);
 assert.equal(sourceCard.subject,row.subject);
 assert.equal(sourceCard.sourceTopic,row.sourceTopic);
 assert.equal(orig.mock,true);assert.notEqual(orig.active,false);
 assert(row.subject==='Physics'?orig.stage==='AS':['AS','A2'].includes(orig.stage));
 assert(eligible(orig),'School mock filter excludes '+row.id);
 assert(orig.front.length<=180&&orig.back.length<=200,'Not a concise recall card '+row.id);
 assert.equal(row.accept.length,1);
 assert.equal(row.reject.length,2);
 topics.add(row.sourceTopic);
 const clone={...orig,accept:[...(orig.accept||[])],reject:[...(orig.reject||[])]};
 const originalSnapshot=JSON.stringify(orig);
 patch([clone]);
 assert.equal(JSON.stringify(orig),originalSnapshot,'Changed original core card');
 assert.equal(clone.v388ExactReviewed,true);
 assert.equal(clone.id,orig.id);assert.equal(clone.front,orig.front);assert.equal(clone.back,orig.back);
 assert(eligible(clone));
 assert.equal(evaluate(clone,orig.back).status,'correct','Original answer failed '+row.id);
 for(const phrase of orig.accept||[]){
  assert.equal(evaluate(clone,phrase).status,'correct','Older correct response regressed '+row.id+' '+phrase);
  previousAccepted++;
 }
 for(const phrase of orig.reject||[]){
  const v=evaluate(clone,phrase);
  assert.equal(v.status,'wrong','Older incorrect response credited '+row.id+' '+phrase);
  assert.equal(v.score,0);previousRejected++;
 }
 for(const phrase of row.accept){
  assert.equal(evaluate(clone,phrase).status,'correct','New valid equivalent rejected '+row.id+' '+phrase);
  accepted++;
 }
 for(const phrase of row.reject){
  const v=evaluate(clone,phrase);
  assert.equal(v.status,'wrong','False concept credited '+row.id+' '+phrase);
  assert.equal(v.score,0);rejected++;
 }
 for(const diff of [
  {id:'other-id'},{front:'Changed prompt'},{back:'Changed model answer'},
  {subject:row.subject==='Physics'?'Chemistry':'Physics'},
  {stage:'Year 3'},{mock:false},{active:false}
 ]){
  const altered={...orig,...diff,accept:[],reject:[]};
  patch([altered]);
  assert.notEqual(altered.v388ExactReviewed,true,'Bad match '+row.id+' '+JSON.stringify(diff));
  assert.deepEqual(altered.accept,[]);
  assert.deepEqual(altered.reject,[]);
  guarded++;
 }
}
assert.equal(accepted,40);
assert.equal(rejected,80);
assert.equal(guarded,280);
assert.equal(topics.size,audit.counts.sourceTopicGroups);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v388: 40 exact original short mock cards across '+topics.size+' source groups, 40 valid equivalent answers, 80 rejected misconceptions, 280 negative source guards, '+previousAccepted+' prior valid and '+previousRejected+' prior wrong preserved; stable 3345 core IDs and progress keys.');
