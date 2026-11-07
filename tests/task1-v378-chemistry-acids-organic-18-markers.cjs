'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const txt=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(txt(p));
const app=txt('app.js'),sw=txt('sw.js'),core=json('deck.json').cards;
const audit=json('editorial/task1-v378-chemistry-eighteen-acids-organic-markers.json');
const baseline=json('editorial/task1-v323-balanced-48-topic-evidence.json');
assert.equal(core.length,3345);assert.equal(new Set(core.map(c=>c.id)).size,3345);
assert.equal(audit.version,'v378');assert.equal(audit.rows.length,18);
assert.equal(audit.counts.originalCoreIdsPreserved,3345);
assert.equal(audit.counts.newAcceptedParaphrases,18);
assert.equal(audit.counts.newWrongMisconceptions,36);
assert.equal(audit.counts.subjectGroups,5);
assert(sw.includes('-v378-chem-acids-organic18'));
assert(app.includes('applyV378ChemAcidsOrganicMarkers(cards);'));
const first=app.indexOf('// v378: calibrate eighteen short Chemistry acids');
const last=app.indexOf('// v344:',first);
assert(first>0&&last>first);
const js=app.slice(first,last);
const patch=new Function(js+'\nreturn applyV378ChemAcidsOrganicMarkers;')();
const rows=new Function(js+'\nreturn V378_CHEM_ACIDS_ORGANIC_MARKERS;')();
assert.deepEqual(rows,audit.rows.map(({sourceTopic,...r})=>r));
const normal=app.indexOf('function normalise('),next=app.indexOf('function importantTokens(',normal);
assert(normal>0&&next>normal);
const evaluate=new Function('window',app.slice(normal,next)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:{TARGET_ID:'__none__',evaluate:()=>null}});
const scopeStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),scopeEnd=app.indexOf('function startMockSession(){',scopeStart);
assert(scopeStart>0&&scopeEnd>scopeStart);
const eligible=new Function(app.slice(scopeStart,scopeEnd)+'\nreturn mockEligibleCard;')();
const sourceById=new Map(core.map(c=>[c.id,c]));
const sampled=new Map(baseline.topicGroups.flatMap(g=>g.reviewedSample.map(c=>[c.id,{...c,sourceTopic:g.topic}])));
const seen=new Set(),groups=new Set();let priorAccepts=0,priorRejects=0,extraAccepts=0,extraRejects=0;
for(const row of audit.rows){
 assert(!seen.has(row.id),'Duplicate core ID');seen.add(row.id);
 const orig=sourceById.get(row.id),sample=sampled.get(row.id);
 assert(orig&&sample,'Core source or baseline missing '+row.id);
 assert.equal(sample.front,row.originalFront);assert.equal(sample.back,row.originalBack);
 assert.equal(sample.sourceTopic,row.sourceTopic);groups.add(row.sourceTopic);
 assert.equal(orig.front,row.originalFront);assert.equal(orig.back,row.originalBack);
 assert.equal(orig.subject,'Chemistry');assert(['AS','A2'].includes(orig.stage));
 assert.equal(orig.mock,true);assert.notEqual(orig.active,false);
 assert(eligible(orig),'Outside taught school mock '+row.id);
 assert(orig.front.length<=150&&orig.back.length<=200,'Card should remain concise');
 assert.equal(row.accept.length,1);assert.equal(row.reject.length,2);
 const card={...orig,accept:[...(orig.accept||[])],reject:[...(orig.reject||[])]};
 patch([card]);assert.equal(card.v378ExactReviewed,true);
 assert.equal(card.id,orig.id);assert.equal(card.front,orig.front);assert.equal(card.back,orig.back);
 assert(eligible(card));
 assert.equal(evaluate(card,card.back).status,'correct','Original model regressed '+card.id);
 for(const ans of orig.accept||[]){assert.equal(evaluate(card,ans).status,'correct','Prior good variant rejected '+card.id+' '+ans);priorAccepts++;}
 for(const ans of orig.reject||[]){const v=evaluate(card,ans);assert.equal(v.status,'wrong','Prior bad variant credited '+card.id+' '+ans);assert.equal(v.score,0);priorRejects++;}
 for(const ans of row.accept){assert.equal(evaluate(card,ans).status,'correct','New good variant rejected '+card.id+' '+ans);extraAccepts++;}
 for(const ans of row.reject){const v=evaluate(card,ans);assert.equal(v.status,'wrong','New misconception credited '+card.id+' '+ans);assert.equal(v.score,0);extraRejects++;}
 for(const change of [{id:'not-the-id'},{front:'Changed question'},{back:'Changed original answer'},{subject:'Physics'},{stage:'Other'},{mock:false},{active:false}]){
   const alt={...orig,...change,accept:[],reject:[]};patch([alt]);
   assert.notEqual(alt.v378ExactReviewed,true,'Out-of-scope variant added: '+card.id+' '+JSON.stringify(change));
   assert.deepEqual(alt.accept,[]);assert.deepEqual(alt.reject,[]);
 }
}
assert.equal(groups.size,5);
assert.equal(extraAccepts,18);assert.equal(extraRejects,36);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v378: 18 original Chemistry acids/organic cards, 18 new correct paraphrases, 36 rejected misconceptions, '+priorAccepts+' existing correct and '+priorRejects+' existing wrong variants preserved; full exact-scope guards and core/progress IDs unchanged.');