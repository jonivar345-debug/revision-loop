'use strict';
// v367: recheck 11 previously-unmapped AS organic requirements; verify one new supporting short card.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),deck=json('deck.json').cards;
const old=json('editorial/task1-v155-chemistry-as-organic-mock-crosswalk.json');
const audit=json('editorial/task1-v367-chem-as-organic-eleven-gap-recheck.json');
const bank=json('chemistry_alkane_trend_recall_v367.json');
assert.equal(deck.length,3345);assert.equal(new Set(deck.map(c=>c.id)).size,3345);
assert.equal(audit.version,'v367');assert.equal(audit.rows.length,11);assert.equal(bank.cards.length,1);
const legacy=old.checks.filter(r=>r.status==='not_yet_directly_mapped');assert.equal(legacy.length,11);
assert.deepEqual(audit.rows.map(r=>r.id).sort(),legacy.map(r=>r.id).sort());
assert.equal(audit.rows.filter(r=>r.currentStatus==='existing_direct_mock_recall').length,9);
assert.equal(audit.rows.filter(r=>r.currentStatus==='one_new_concise_supporting_card').length,1);
assert.equal(audit.rows.filter(r=>r.currentStatus==='partial_relevant_concept_not_exact_solvent_contrast').length,1);
assert.equal(audit.completion.allElevenNowDirectlyMapped,false);assert.equal(audit.completion.threeSubjectTaskComplete,false);
const byId=new Map(deck.map(c=>[c.id,c]));
for(const row of audit.rows){
 const original=legacy.find(x=>x.id===row.id);assert(original);assert.equal(row.requirement,original.requirement);assert.equal(row.legacyStatus,original.status);
 for(const e of row.coreEvidence){const card=byId.get(e.id);assert(card,'Core evidence missing: '+e.id);
  assert.equal(e.path,'deck.json');assert.equal(card.subject,'Chemistry');assert.equal(card.stage,e.stage);
  assert.equal(card.mock,true);assert.notEqual(card.active,false);assert.equal(card.front,e.front);assert.equal(card.back,e.back);
 }
}
const card=bank.cards[0];assert.equal(card.id,'task1_v367_chem_01');assert(!byId.has(card.id));
assert.equal(card.subject,'Chemistry');assert.equal(card.stage,'AS');assert.equal(card.mock,true);
assert.equal(card.active,true);assert.equal(card.taught,true);assert.equal(card.scope,'mock');
assert.equal(card.kind,'short');assert.equal(card.strictRecall,true);assert.equal(card.specRef,'3.3.2.1');
assert(card.front.length<=145&&card.back.length<=130);assert.equal(card.accept.length,3);assert.equal(card.reject.length,3);
assert(app.includes('isV367ChemAlkaneTrendCard(c)'));assert(app.includes('V367_CHEM_ALKANE_TREND_URL'));
assert(app.includes('if(!isV367ChemAlkaneTrendCard(c)||cards.some(old=>old.id===c.id))continue;'));
assert(sw.includes('-v367-as-organic-trend'));assert(sw.includes('./chemistry_alkane_trend_recall_v367.json'));
const s=app.indexOf('function normalise('),e=app.indexOf('function importantTokens(',s);assert(s>0&&e>s);
const evaluate=new Function('window',app.slice(s,e)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
assert.equal(evaluate(card,card.back).status,'correct');
for(const response of card.accept)assert.equal(evaluate(card,response).status,'correct','Accept valid variant: '+response);
for(const response of card.reject){const result=evaluate(card,response);assert.equal(result.status,'wrong','Reject misconception: '+response);assert.equal(result.score,0)}
const g=app.indexOf('function isV367ChemAlkaneTrendCard(c){'),h=app.indexOf('function isV354ChemCrackingCard(c){',g);
assert(g>0&&h>g);const guard=new Function(app.slice(g,h)+'\nreturn isV367ChemAlkaneTrendCard;')();
assert(guard(card));assert(!guard({...card,stage:'A2'}));assert(!guard({...card,mock:false}));assert(!guard({...card,id:'other'}));assert(!guard({...card,front:'x'.repeat(150)}));
console.log('PASS v367: 9 previously unmapped organic skills linked to existing exact mock recall, 1 partial held open, 1 concise new AS alkane card with 4 valid and 3 rejected response probes.');
