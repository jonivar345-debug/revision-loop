'use strict';
// v370: ensure exactly two short historical light-evidence flashcards are mock scoped,
// loaded offline, unique by ID/front, and validated against the real production evaluator.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),core=json('deck.json').cards;
const bank=json('physics_light_history_recall_v370.json'),audit=json('editorial/task1-v370-light-history-two-concise-cards.json');
assert.equal(core.length,3345);assert.equal(new Set(core.map(c=>c.id)).size,3345);
assert.equal(bank.version,'v370');assert.equal(bank.cards.length,2);assert.equal(audit.version,'v370');
assert.equal(audit.completion.wholeThreeSubjectMockComplete,false);
assert.equal(audit.completion.allAqaWavesStatementsSignedOff,false);
assert.equal(audit.counts.originalCoreIdsUnchanged,3345);
assert(app.includes("const V370_PHYSICS_HISTORY_URL='./physics_light_history_recall_v370.json';"));
assert(app.includes('isV370PhysicsHistoryCard(c)'));
assert(app.includes('if(!isV370PhysicsHistoryCard(c)||cards.some(old=>old.id===c.id))continue;'));
assert(sw.includes('-v370-light-history'));
assert(sw.includes("'./physics_light_history_recall_v370.json'"));
// Scan all original cards and all 56 untouched supplemental banks for exact front/ID repeats.
const start=app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/);assert(start,'Original bank loader missing');
const paths=[...start[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert.equal(paths.length,56);
const old=[...core,...paths.flatMap(p=>json(p).cards||[]),...json('maths_first_mock_micro_recall_v348.json').cards,...json('chemistry_cracking_pressure_recall_v354.json').cards,...json('chemistry_alkane_trend_recall_v367.json').cards];
const ids=new Set(old.map(c=>c.id)),fronts=new Set(old.filter(c=>c.subject==='Physics').map(c=>String(c.front||'').trim().toLowerCase()));
const normal=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',normal);
assert(normal>0&&end>normal);
const mark=new Function('window',app.slice(normal,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const guardStart=app.indexOf('function isV370PhysicsHistoryCard(c){'),guardEnd=app.indexOf('function isV354ChemCrackingCard(c){',guardStart);
assert(guardStart>=0&&guardEnd>guardStart);
const guard=new Function(app.slice(guardStart,guardEnd)+'\nreturn isV370PhysicsHistoryCard;')();
for(const [i,c] of bank.cards.entries()){
 assert.equal(c.id,'task1_v370_phy_history_0'+(i+1));
 assert(!ids.has(c.id),'Duplicate original or supplemental ID');
 assert(!fronts.has(c.front.trim().toLowerCase()),'Duplicate existing Physics question wording');
 assert.equal(c.subject,'Physics');assert.equal(c.stage,'AS');assert.equal(c.specRef,'3.3.2.1');
 assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.active,true);
 assert.equal(c.scope,'mock');assert.equal(c.kind,'short');assert.equal(c.strictRecall,true);
 assert(c.front.length<=145&&c.back.length<=130);
 assert.equal(c.accept.length,3);assert.equal(c.reject.length,3);
 assert(guard(c),'Valid Physics first-mock card rejected by loader');
 for(const response of [c.back,...c.accept]){
  const outcome=mark(c,response);
  assert.equal(outcome.status,'correct','Legitimate correct answer rejected: '+c.id+' / '+response);
 }
 for(const response of c.reject){
  const outcome=mark(c,response);
  assert.equal(outcome.status,'wrong','Misconception accepted: '+c.id+' / '+response);
  assert.equal(outcome.score,0,'Incorrect history answer got credit: '+c.id);
 }
 assert(!guard({...c,stage:'A2'}));
 assert(!guard({...c,subject:'Maths'}));
 assert(!guard({...c,mock:false}));
 assert(!guard({...c,taught:false}));
 assert(!guard({...c,scope:'full'}));
 assert(!guard({...c,front:'x'.repeat(150)}));
 ids.add(c.id);fronts.add(c.front.toLowerCase().trim());
}
assert.deepEqual(audit.addition.map(a=>a.id),bank.cards.map(c=>c.id));
console.log('PASS v370: 2 nonduplicate, short AQA Waves 3.3.2.1 cards; 8 valid answer probes and 6 wrong misconception probes; original 3345 IDs, 56 supplement indices, scope, and offline cache preserved.');
