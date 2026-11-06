'use strict';
// v371: production-marker regression for 14 unchanged original mock Physics cards.
const fs=require('node:fs'),assert=require('node:assert/strict');
const txt=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(txt(p));
const app=txt('app.js'),sw=txt('sw.js'),deck=json('deck.json').cards;
const report=json('editorial/task1-v371-physics-mechanics-measurements-core-markers.json');
assert.equal(report.version,'v371');assert.equal(report.rows.length,14);
assert.equal(report.counts.existingCardsReviewed,14);
assert.equal(report.counts.incorrectNewMisconceptions,28);
assert.equal(deck.length,3345);
assert.equal(new Set(deck.map(c=>c.id)).size,3345);
assert(sw.includes('-v371-mechanics-markers'));
assert(app.includes('applyV371MechanicsMeasurementsMarkers(cards);'));
const prev=json('editorial/task1-v323-balanced-48-topic-evidence.json');
const samples=new Map(prev.topicGroups.flatMap(g=>g.reviewedSample.map(c=>[c.id,c])));
const start=app.indexOf('// v371: exact-original Physics Mechanics/Measurements short-recall marker calibration.');
const end=app.indexOf('// v344:',start);
assert(start>0&&end>start);
const patch=new Function(app.slice(start,end)+'\nreturn applyV371MechanicsMeasurementsMarkers;')();
const s=app.indexOf('function normalise('),e=app.indexOf('function importantTokens(',s);
assert(s>0&&e>s);
const evaluate=new Function('window',app.slice(s,e)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const eligibleStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),eligibleEnd=app.indexOf('function startMockSession(){',eligibleStart);
assert(eligibleStart>0&&eligibleEnd>eligibleStart);
const eligible=new Function(app.slice(eligibleStart,eligibleEnd)+'\nreturn mockEligibleCard;')();
const coreById=new Map(deck.map(c=>[c.id,c]));
let oldAccepted=0,newAccepted=0,rejected=0;
const uniqueIds=new Set();
for(const row of report.rows){
 assert(!uniqueIds.has(row.id));uniqueIds.add(row.id);
 const sampled=samples.get(row.id);
 assert(sampled,'Not present in older real mock evidence '+row.id);
 assert.equal(sampled.front,row.originalFront);
 assert.equal(sampled.back,row.originalBack);
 const c=coreById.get(row.id);
 assert(c,'Original source flashcard disappeared '+row.id);
 assert.equal(c.subject,'Physics');assert.equal(c.stage,'AS');
 assert.equal(c.mock,true);assert.notEqual(c.active,false);
 assert.equal(c.front,row.originalFront);assert.equal(c.back,row.originalBack);
 assert(eligible(c),'Out of Physics first-mock scope '+row.id);
 assert(c.front.length<=155&&c.back.length<=180,'Too much text for short recall '+row.id);
 assert.equal(row.accept.length,1);assert.equal(row.reject.length,2);
 const current={...c,accept:[...(c.accept||[])],reject:[...(c.reject||[])]};
 patch([current]);
 assert.equal(current.v371ExactReviewed,true);
 assert.equal(current.front,c.front);assert.equal(current.back,c.back);
 assert.equal(evaluate(current,c.back).status,'correct','Original model answer marked wrong '+c.id);
 for(const a of c.accept||[]){
  assert.equal(evaluate(current,a).status,'correct','Existing valid answer stopped working: '+c.id+' '+a);oldAccepted++;
 }
 for(const a of row.accept){
  assert.equal(evaluate(current,a).status,'correct','Reviewed correct answer rejected: '+c.id+' '+a);newAccepted++;
 }
 for(const wrong of row.reject){
  const result=evaluate(current,wrong);
  assert.equal(result.status,'wrong','Misconception was accepted: '+c.id+' '+wrong);
  assert.equal(result.score,0,'Wrong idea earned credit: '+c.id);rejected++;
 }
 const altered={...c,front:'Unrecognised front',accept:[],reject:[]};
 const outOfScope={...c,mock:false,accept:[],reject:[]};
 patch([altered,outOfScope]);
 assert(!altered.v371ExactReviewed&&!outOfScope.v371ExactReviewed);
 assert.equal(altered.accept.length,0);assert.equal(outOfScope.reject.length,0);
}
assert.equal(newAccepted,14);assert.equal(rejected,28);
console.log('PASS v371: 14 original mock Physics core model answers, '+oldAccepted+' existing variants, 14 vetted alternatives and 28 rejected misconceptions. All IDs, prompts, saved progress and scope intact.');
