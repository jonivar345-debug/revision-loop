'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const previous=JSON.parse(fs.readFileSync('editorial/task1-v166-legacy-mock-card-map.json','utf8'));
const mech=JSON.parse(fs.readFileSync('editorial/task1-v176-mechanics-manual-spec-audit.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v177-chemistry-legacy-tests-definitions.json','utf8'));
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
assert.equal(audit.version,'v177');
assert.equal(audit.task1Complete,false);
assert.equal(deck.cards.length,3345);
assert.equal(deck.cards.filter(c=>c.active!==false).length,3341);
assert.equal(deck.cards.filter(c=>c.active!==false&&c.mock===true).length,2379);
assert.equal(audit.reviewed.length,54);
assert.equal(audit.baseline.remainingScience,832);
assert.equal(audit.baseline.remainingPhysics,226);
assert.equal(audit.baseline.remainingChemistry,606);
assert.equal(new Set(audit.reviewed.map(c=>c.id)).size,54);
assert.equal(new Set(mech.reviewed.map(c=>c.id)).size,85);
const oldIds=new Set(previous.records.map(r=>r.id));
const mechIds=new Set(mech.reviewed.map(r=>r.id));
const byId=new Map(deck.cards.map(c=>[c.id,c]));
for(const row of audit.reviewed){
 const c=byId.get(row.id);assert(c,'Missing reviewed card: '+row.id);
 assert(oldIds.has(row.id),'Not a verified legacy candidate '+row.id);
 assert(!mechIds.has(row.id),'Already reviewed in v176 '+row.id);
 assert.equal(c.subject,'Chemistry');
 assert.equal(c.active,true);assert.equal(c.mock,true);
 assert.equal(c.specRef,undefined,'Keep legacy direct-tag counts stable');
 assert.equal(c.front,row.front,'Card question changed without re-audit '+row.id);
 assert.equal(c.back,row.back,'Card answer changed without re-audit '+row.id);
 assert(/^3\.\d|^7\.2 RP[46]$/.test(row.aqaSection),'Bad AQA candidate section '+row.id);
}
const actual={};
for(const row of audit.reviewed)actual[row.aqaSection]=(actual[row.aqaSection]||0)+1;
assert.deepEqual(actual,audit.bySubsection);
assert.equal(audit.reviewed.find(r=>r.id==='chem_cip').aqaSection,'3.3.1.3','CIP prioritisation is taught in E/Z isomerism section');
assert.equal(audit.corrections.length,2);
for(const fix of audit.corrections){const c=byId.get(fix.id);assert.equal(c.front,fix.newFront);assert.equal(c.back,fix.newBack);assert(!c.concepts,'Single-fact card must not require several concepts');}
assert.match(html,/app\.js\?v=177/);
assert.match(sw,/v177-chemistry-test-pair-marking/);
assert.match(app,/function evaluateHalideColours/);
assert.match(app,/function evaluateTollensObservation/);
const b=app.indexOf('function normalise('),e=app.indexOf('function importantTokens(');
assert(b>=0&&e>b);
const evaluate=new Function('window',app.slice(b,e)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let accepted=0;
for(const row of audit.reviewed){const c=byId.get(row.id);for(const answer of [c.back,...(c.accept||[])]){accepted++;assert.equal(evaluate(c,answer).status,'correct','Accepted phrase wrongly rejected: '+c.id+' / '+answer)}}
assert(accepted>=130,'Check all reviewed model answers and accepted variants, not just examples');
const pairs=[
 ['AgCl white, AgBr cream, AgI yellow','correct'],
 ['chloride white bromide cream iodide yellow','correct'],
 ['white chloride cream bromide yellow iodide','correct'],
 ['silver chloride gives white, silver bromide cream and silver iodide yellow','correct'],
 ['chloride white; bromide cream','partial'],
 ['chloride white bromide yellow iodide cream','wrong'],
 ['AgCl yellow, AgBr cream, AgI white','wrong'],
 ['silver chloride yellow bromide cream iodide white','wrong'],
 ['white cream yellow','wrong'],
 ['', 'neutral']
];
for(const [answer,status] of pairs)assert.equal(evaluate(byId.get('chem_rp4'),answer).status,status,'Incorrect halide association marking: '+answer);
const tollens=[
 ['A silver mirror or grey silver deposit.','correct'],
 ['silver mirror','correct'],
 ['grey silver deposit','correct'],
 ['Aldehydes give a silver mirror; ketones do not.','correct'],
 ['Ketones do not give a silver mirror, but aldehydes do.','correct'],
 ['Aldehydes give a silver mirror whereas ketones give no silver deposit.','correct'],
 ['Ketones give no silver mirror whereas aldehydes give a silver mirror.','correct'],
 ['Aldehydes give no silver mirror whereas ketones give silver.','wrong'],
 ['No silver mirror for aldehydes.','wrong'],
 ['Ketones give a silver mirror','wrong'],
 ['Aldehydes give no silver mirror','wrong'],
 ['silver mirror from ketones','wrong'],
 ['Silver','partial'],
 ['','neutral']
];
for(const [answer,status] of tollens)assert.equal(evaluate(byId.get('chem_aldehyde_tollens'),answer).status,status,'Incorrect Tollens observation credit: '+answer);
const otherWrong=[
 ['chem_aldehyde_tollens','nothing happens'],
 ['chem_aldehyde_tollens','blue precipitate'],
 ['chem_group2_reactivity','decreases'],
 ['chem_rp6','bromine water stays orange'],
 ['chem_carboxy_acid','completely dissociates']
];
for(const [id,answer] of otherWrong)assert.notEqual(evaluate(byId.get(id),answer).status,'correct','Incorrect full credit: '+id+' / '+answer);
assert.equal(deck.cards.filter(c=>c.subject==='Physics'&&c.mock&&c.active!==false).length,730);
assert.equal(deck.cards.filter(c=>c.subject==='Chemistry'&&c.mock&&c.active!==false).length,1533);
assert.equal(audit.limitations.officialFullSyllabusCertified,false);
console.log('PASS v177: 54 legacy Chemistry test/definition cards checked; '+accepted+' accepted answers, swapped halide colours rejected, 832 legacy science cards still pending.');
