'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v181-science-210-legacy-answer-audit.json','utf8'));
const ledger=JSON.parse(fs.readFileSync('editorial/task1-v166-legacy-mock-card-map.json','utf8'));
const previous=[
 'task1-v176-mechanics-manual-spec-audit',
 'task1-v177-chemistry-legacy-tests-definitions',
 'task1-v178-chemistry-core-definitions',
 'task1-v179-chemistry-organic-physical-audit',
 'task1-v180-born-haber-gibbs-short-recall'
].map(path=>JSON.parse(fs.readFileSync('editorial/'+path+'.json','utf8')));
const historical=require('./task1-v154-legacy-evidence.cjs');
const app=fs.readFileSync('app.js','utf8');
const byId=new Map(deck.cards.map(c=>[c.id,c]));
const originals=new Set(ledger.records.map(c=>c.id)),prior=new Set(previous.flatMap(a=>a.reviewed.map(x=>x.id)));
assert.equal(audit.version,'v181');assert.equal(audit.task1Complete,false);
assert.deepEqual([audit.baseline.chemistryReviewedHere,audit.baseline.physicsReviewedHere,audit.baseline.totalReviewed,audit.baseline.remainingScience,audit.baseline.remainingChemistry,audit.baseline.remainingPhysics],[150,60,493,478,312,166]);
assert.deepEqual([deck.cards.length,deck.cards.filter(c=>c.active!==false).length,deck.cards.filter(c=>c.active!==false&&c.mock===true).length],[3345,3341,2379]);
assert.equal(audit.reviewed.length,210);assert.equal(audit.corrections.length,24);
assert.equal(new Set(audit.reviewed.map(c=>c.id)).size,210);
for(const row of audit.reviewed){
 const c=byId.get(row.id);assert(c,'Reviewed card missing '+row.id);
 assert(originals.has(row.id)&&!prior.has(row.id),'Duplicate or ungrounded legacy candidate '+row.id);
 assert(c.active!==false&&c.mock===true,'Changed mock membership '+row.id);
 assert.equal(c.subject,row.subject);assert.equal(c.front,row.front);assert.equal(c.back,row.back);
 assert(row.section.startsWith('3.'),'Non-AQA section candidate '+row.id);
}
for(const patch of audit.corrections){
 const c=byId.get(patch.id);assert(c&&c.accept?.length>=3,'Missing variants '+patch.id);
 assert.equal(historical(patch.id,'front',patch.previousFront),patch.newFront);
 assert.equal(historical(patch.id,'back',patch.previousBack),patch.newBack);
 assert(c.accept.includes(c.back),'Own model answer not accepted '+patch.id);
}
const i=app.indexOf('function normalise('),j=app.indexOf('function importantTokens(');
assert(i>=0&&j>i);
const evaluate=new Function('window',app.slice(i,j)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const row of audit.reviewed){
 const c=byId.get(row.id);
 assert.equal(evaluate(c,c.back).status,'correct','Own model not accepted '+c.id);
}
for(const x of audit.corrections){
 const c=byId.get(x.id);
 for(const a of c.accept)assert.equal(evaluate(c,a).status,'correct','Explicit accepted variant rejected '+c.id+': '+a);
}
const rejects=[
 ['chem_rate_recap_20261024_k_unit_first','dm3 mol-1 s-1'],
 ['chem_rate_recap_20261024_k_unit_second','s^-1'],
 ['chem_rate_recap_20261024_k_unit_third','dm3 mol-1 s-1'],
 ['chem_kp_recap_20261024_kp_units_ammonia','kPa^2'],
 ['chem_kc_recap_20261024_kc_units_ammonia','mol^2 dm^-6'],
 ['chem_kp_recap_20261024_temp_exothermic','increases'],
 ['chem_kp_recap_20261024_temp_endothermic','decreases'],
 ['chem_kc_recap_20261024_temp_exothermic','increases'],
 ['chem_kc_recap_20261024_temp_endothermic','decreases']
];
for(const [id,answer] of rejects)assert.equal(evaluate(byId.get(id),answer).status,'wrong','Incorrect unit/trend must be wrong '+id);
assert.equal(audit.limitations.notFullSpecCertification,true);
assert.equal(audit.limitations.originalQuestionBankUnchanged,true);
console.log('PASS v181: 210 original science mock cards checked; 24 targeted edits; correct answers accepted and wrong units/trends rejected; all saved IDs retained');
