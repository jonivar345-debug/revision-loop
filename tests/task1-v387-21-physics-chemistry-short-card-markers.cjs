'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),core=json('deck.json').cards;
const audit=json('editorial/task1-v387-21-physics-chemistry-short-card-markers.json');
const baseline=json('editorial/task1-v323-balanced-48-topic-evidence.json');
assert.equal(core.length,3345);
assert.equal(new Set(core.map(c=>c.id)).size,3345);
assert.equal(audit.version,'v387');
assert.equal(audit.rows.length,21);
assert.equal(audit.counts.Physics,12);
assert.equal(audit.counts.Chemistry,9);
assert.equal(audit.counts.newCorrectParaphrases,21);
assert.equal(audit.counts.newIncorrectMisconceptions,42);
assert(sw.includes('-v387-short21-markers'));
assert(app.includes('applyV387MockShortCardMarkers(cards);'));
const start=app.indexOf('// v387: 21 exact original Physics/Chemistry short mock flashcards');
const end=app.indexOf('// v344:',start);
assert(start>0&&end>start,'New marker scope not found');
const {selected,patch}=new Function(app.slice(start,end)+'\nreturn {selected:V387_MOCK_SHORT_CARD_ROWS,patch:applyV387MockShortCardMarkers};')();
assert.deepEqual(selected,audit.rows.map(({sourceTopic,...row})=>row));
const normal=app.indexOf('function normalise('),evaluatorEnd=app.indexOf('function importantTokens(',normal);
assert(normal>0&&evaluatorEnd>normal);
const evaluate=new Function('window',app.slice(normal,evaluatorEnd)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:{TARGET_ID:'__none__',evaluate:()=>null}});
const firstScope=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),lastScope=app.indexOf('function startMockSession(){',firstScope);
assert(firstScope>0&&lastScope>firstScope);
const eligible=new Function(app.slice(firstScope,lastScope)+'\nreturn mockEligibleCard;')();
const byId=new Map(core.map(c=>[c.id,c]));
const sample=new Map(baseline.topicGroups.flatMap(g=>g.reviewedSample.map(c=>[c.id,{...c,sourceTopic:g.topic,subject:g.subject}])));
let good=0,bad=0,oldGood=0,oldBad=0,negative=0;
const seen=new Set(),groups=new Set();
for(const row of audit.rows){
 assert(!seen.has(row.id));seen.add(row.id);
 const orig=byId.get(row.id),source=sample.get(row.id);
 assert(orig&&source,'Missing original core/source card '+row.id);
 assert.equal(source.sourceTopic,row.sourceTopic);
 assert.equal(source.subject,row.subject);
 assert.equal(source.front,row.originalFront);
 assert.equal(source.back,row.originalBack);
 assert.equal(orig.front,row.originalFront);
 assert.equal(orig.back,row.originalBack);
 assert.equal(orig.subject,row.subject);
 assert.equal(orig.mock,true);
 assert.notEqual(orig.active,false);
 if(row.subject==='Physics')assert.equal(orig.stage,'AS');
 else assert(['AS','A2'].includes(orig.stage));
 assert(eligible(orig),'Excluded from actual first school mock '+row.id);
 assert(orig.front.length<=180&&orig.back.length<=200,'Avoid long-answer disguised as flashcard '+row.id);
 assert.equal(row.accept.length,1);
 assert.equal(row.reject.length,2);
 groups.add(row.sourceTopic);
 const changed={...orig,accept:[...(orig.accept||[])],reject:[...(orig.reject||[])]};
 const oldSnapshot=JSON.stringify(orig);
 patch([changed]);
 assert.equal(JSON.stringify(orig),oldSnapshot,'Original source mutated');
 assert.equal(changed.v387ExactReviewed,true);
 assert.equal(changed.id,orig.id);assert.equal(changed.front,orig.front);assert.equal(changed.back,orig.back);
 assert(eligible(changed));
 assert.equal(evaluate(changed,changed.back).status,'correct','Original answer rejected '+changed.id);
 for(const answer of orig.accept||[]){
   assert.equal(evaluate(changed,answer).status,'correct','Prior valid answer lost '+changed.id+' '+answer);oldGood++;
 }
 for(const answer of orig.reject||[]){
   const result=evaluate(changed,answer);
   assert.equal(result.status,'wrong','Prior wrong answer accepted '+changed.id+' '+answer);
   assert.equal(result.score,0);oldBad++;
 }
 for(const answer of row.accept){
   const result=evaluate(changed,answer);
   assert.equal(result.status,'correct','Good rephrasing not credited '+changed.id+' '+answer);good++;
 }
 for(const answer of row.reject){
   const result=evaluate(changed,answer);
   assert.equal(result.status,'wrong','Misconception credited '+changed.id+' '+answer);
   assert.equal(result.score,0);
   bad++;
 }
 for(const diff of [
   {id:'other-id'},{subject:orig.subject==='Physics'?'Chemistry':'Physics'},
   {front:'This is a modified question'},{back:'This is a modified model answer'},
   {stage:'Year 3'},{mock:false},{active:false}
 ]){
   const altered={...orig,...diff,accept:[],reject:[]};
   patch([altered]);
   assert.notEqual(altered.v387ExactReviewed,true,'Guard should not select '+changed.id+' '+JSON.stringify(diff));
   assert.deepEqual(altered.accept,[]);assert.deepEqual(altered.reject,[]);
   negative++;
 }
}
assert.equal(good,21);assert.equal(bad,42);assert.equal(negative,147);
assert(groups.size>=7,'Insufficient independent short-card topics');
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v387: '+good+' accepted Physics/Chemistry short mock rephrasings, '+bad+' wrong misconceptions, '+negative+' negative source guards, '+oldGood+' old good and '+oldBad+' old wrong answers preserved; 21 short cards / '+groups.size+' topic groups, 3,345 unchanged original IDs and preserved progress keys.');
