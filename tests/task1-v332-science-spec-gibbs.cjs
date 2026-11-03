'use strict';
// v332: 59 AQA mock skill-evidence rows and one real Gibbs boundary accuracy correction.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const ledger=j('editorial/task1-v332-measurements-rates-kp-crosswalk.json'),app=read('app.js'),deck=j('deck.json');
assert.equal(deck.cards.length,3345);
assert.equal(ledger.rows.length,59);
assert.equal(ledger.rows.filter(r=>r.subject==='Physics').length,24);
assert.equal(ledger.rows.filter(r=>r.subject==='Chemistry').length,35);
assert.equal(ledger.rows.filter(r=>r.status==='recall').length,53);
assert.equal(ledger.rows.filter(r=>r.status==='partial_application').length,6);
assert.equal(new Set(ledger.rows.map(r=>r.id)).size,59,'Unique audited requirement IDs');
const byId=new Map(deck.cards.map(c=>[c.id,c]));
for(const r of ledger.rows){
 assert(['recall','partial_application'].includes(r.status));
 assert(r.evidenceIds.length>=1,'Specific evidence IDs required '+r.id);
 assert((r.subject==='Physics'&&r.specRef.startsWith('3.1.'))||(r.subject==='Chemistry'&&['3.1.9.1','3.1.9.2','3.1.10'].includes(r.specRef)),r.id+' specification map');
 for(const id of r.evidenceIds){
  const card=byId.get(id);
  assert(card,'Missing original-core evidence '+r.id+' '+id);
  assert.equal(card.subject,r.subject,r.id+' subject must match '+id);
  assert.equal(card.mock,true,r.id+' evidence must be in school mock '+id);
 }
}
assert.deepEqual(ledger.rows.filter(r=>r.status==='partial_application').map(r=>r.id),['P24','C10','C14','C22','K07','K12'],'Do not falsely certify application skills from one recall card');
const s=app.indexOf('const V287_LEGACY_SPEC_GROUPS='),e=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards in memory.',s);
assert(s>=0&&e>s);
const patch=new Function(app.slice(s,e)+
 '\nreturn (cards,newFix)=>{applyV287LegacySpecRefs(cards);applyV288LegacyChemBondingSpecRefs(cards);applyV289LegacyEnergeticsSpecRefs(cards);applyV290LegacyElectricitySpecRefs(cards);applyV314CoreMockQuality(cards);applyV315CoreRecallCalibration(cards);applyV316CoreRecallCalibration(cards);applyV321CoreRecallCalibration(cards);applyV322CoreRecallCalibration(cards);applyV324CoreRecallCalibration(cards);applyV326CoreClarityFixes(cards);applyV327CoreRecallCalibration(cards);applyV328ScienceCoreCalibration(cards);applyV329MathsCorePrecision(cards);applyV330ScienceCoreCalibration(cards);applyV331CoreAnswerCalibration(cards);if(newFix)applyV332GibbsBoundaryCorrection(cards);return cards;}')();
const before=patch(structuredClone(deck.cards),false),after=patch(structuredClone(deck.cards),true);
assert.deepEqual(before.map(c=>c.id),after.map(c=>c.id),'Preserve every historic flashcard progress ID');
const old=new Map(before.map(c=>[c.id,c])),now=new Map(after.map(c=>[c.id,c]));
const id='task1_chem_164',c=now.get(id);
assert.equal(old.get(id).back,'ΔG < 0 at the stated temperature.');
assert.equal(c.front,old.get(id).front);
assert.equal(c.back,'ΔG ≤ 0 at the stated temperature; ΔG = 0 marks equilibrium.');
assert.equal(c.v332ExactReviewed,true);
assert(c.accept.includes(old.get(id).back),'Negative free energy remains an accepted sufficient example');
for(const a of ['ΔG is negative or zero.','ΔG is zero or negative.','ΔG <= 0.','ΔG ≤ 0.'])assert(c.accept.includes(a),'Must cover boundary explicitly');
for(const a of ['ΔG > 0 is thermodynamically feasible.','Only a positive ΔG indicates thermodynamic feasibility.'])assert(c.reject.includes(a),'Must reject positive ΔG');
for(const q of after.filter(x=>x.id!==id))assert.deepEqual(q,old.get(q.id),'No unintended source core change '+q.id);
const m1=app.indexOf('function normalise('),m2=app.indexOf('function importantTokens(',m1);
const evaluate=new Function('window',app.slice(m1,m2)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const answer of [c.back,...c.accept])assert.equal(evaluate(c,answer).status,'correct','Approved Gibbs answer: '+answer);
for(const answer of c.reject)assert.equal(evaluate(c,answer).status,'wrong','Wrong Gibbs answer: '+answer);
for(const answer of ['not ΔG ≤ 0.','not ΔG is zero or negative.'])assert.equal(evaluate(c,answer).status,'wrong','Negation should fail '+answer);
assert(app.includes(' applyV332GibbsBoundaryCorrection(cards);'));
assert(app.includes('||c?.v332ExactReviewed===true){'));
assert(read('sw.js').includes('-v332-gibbs-accuracy-spec-audit'));
const q1=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),q2=app.indexOf('function startMockSession(){',q1);
const eligible=new Function(app.slice(q1,q2)+'\nreturn mockEligibleCard;')();
assert(eligible(c),'Gibbs card still mock eligible');
const paths=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
assert.equal(paths.length,56);
const l1=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),l2=app.indexOf(' const added=[',l1);
const all=new Function('cards','extraFlashBanks',app.slice(l1,l2)+'\nreturn cards;')(after,paths.map(j));
assert.equal(all.length,4344);
assert.equal(new Set(all.map(c=>c.id)).size,4344);
const mock=all.filter(eligible);
assert.equal(mock.length,3372);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,mock.filter(c=>c.subject===s).length])),{Physics:1125,Chemistry:1916,Maths:331});
for(const r of ledger.rows)assert(mock.some(c=>r.evidenceIds.some(id=>c.id===id)),'Subskill lacks eligible evidence '+r.id);
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k),'Keep saved progress');
console.log('PASS v332: 59 specific AQA original-core evidence rows (53 sampled recall, 6 application gaps); Gibbs boundary corrected with production marker and historic valid answers; full 4344/3372 bank and IDs unchanged.');
