'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const ledger=j('editorial/task1-v309-science-individual-skill-crosswalk.json');
const app=read('app.js'),core=j('deck.json');
const bankUrls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
const start=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),end=app.indexOf(' const added=[',start);
assert(start>0&&end>start);
const all=new Function('cards','extraFlashBanks',app.slice(start,end)+'\nreturn cards;')([...core.cards],bankUrls.map(j));
const a=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),b=app.indexOf('function startMockSession(){',a);
const eligible=new Function(app.slice(a,b)+'\nreturn mockEligibleCard;')();
const selected=all.filter(eligible);
assert.equal(all.length,4313);assert.equal(selected.length,3341);
assert.equal(new Set(all.map(c=>c.id)).size,4313);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(n=>[n,selected.filter(c=>c.subject===n).length])),{Physics:1100,Chemistry:1910,Maths:331});
const mStart=app.indexOf('function normalise('),mEnd=app.indexOf('function importantTokens(',mStart);
const mark=new Function('window',app.slice(mStart,mEnd)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const idToCard=new Map(selected.map(c=>[c.id,c]));
const evidenceBankIds=new Set(ledger.auditedBanks.flatMap(path=>j(path).cards.map(c=>c.id)));
assert.equal(ledger.rows.length,72);
assert.equal(ledger.summary.rows,72);
assert.equal(ledger.completion.fullAqaCoverageCertified,false);
assert.equal(ledger.completion.task1Complete,false);
assert(ledger.sources.Physics.includes('aqa.org.uk'));
assert(ledger.sources.Chemistry.includes('aqa.org.uk'));
const allowedPhysics=new Set(['3.4.1.1','3.4.1.2','3.4.1.3','3.4.1.4','3.4.1.5','3.4.1.6','3.4.1.7','3.4.1.8','3.4.2.1','3.4.2.2']);
const allowedChem=new Set(['3.1.4.1','3.1.4.2','3.1.4.3','3.1.4.4','3.1.8.1','3.1.8.2']);
const ids=new Set(),sc={Physics:{sample:0,partial:0,unverified:0},Chemistry:{sample:0,partial:0,unverified:0}},linked=new Set();
let checks=0,accepted=0,rejected=0,crossSection=0,legacyBroad=0;
for(const row of ledger.rows){
 assert(!ids.has(row.id),'Unique row id '+row.id);ids.add(row.id);
 assert(['sample','partial','unverified'].includes(row.status));
 assert(typeof row.skill==='string'&&row.skill.length>20);
 assert((row.subject==='Physics'?allowedPhysics:allowedChem).has(row.specRef),'Unknown subsection '+row.id+' '+row.specRef);
 sc[row.subject][row.status]++;
 if(row.status==='unverified')assert.equal(row.evidenceIds.length,0,'Do not claim direct evidence for unverified skill '+row.id);
 else assert(row.evidenceIds.length>0,'Related or direct sample required '+row.id);
 const crosses=new Set(row.crossSectionEvidenceIds||[]);
 const broad=new Set(row.legacyBroadSpecEvidenceIds||[]);
 for(const cross of crosses)assert(row.evidenceIds.includes(cross),'Cross-section ID missing from evidence '+row.id);
 for(const old of broad)assert(row.evidenceIds.includes(old),'Legacy broad tag must cite selected card '+row.id);
 for(const cross of crosses)assert(!broad.has(cross),'Cross-section and broad tag categories overlap '+row.id);
 if(crosses.size)assert(row.notes.includes('different but related'),'Cross-section link must be explained '+row.id);
 if(broad.size)assert(row.notes.includes('Core deck')||row.notes.includes('core deck'),'Explain old or broad metadata '+row.id);
 for(const id of row.evidenceIds){
  assert(evidenceBankIds.has(id),'Citation must originate in actually reviewed source banks '+row.id+': '+id);
  const c=idToCard.get(id);assert(c,'Evidence card not loaded and mock eligible '+row.id+': '+id);
  assert.equal(c.subject,row.subject,'Wrong subject '+row.id+': '+id);
  if(c.specRef!==row.specRef){
   assert(crosses.has(id)||broad.has(id),'Metadata mismatch not explicitly declared '+row.id+': '+id+' '+c.specRef+' != '+row.specRef);
   if(crosses.has(id))crossSection++;else legacyBroad++;
  }else assert(!crosses.has(id)&&!broad.has(id),'Unnecessary specRef exception '+row.id+': '+id);
  assert(c.front.length>12&&c.back.trim().length>0,'No meaningful front/back '+id);
  assert.equal(mark(c,c.back).status,'correct','Model answer not accepted '+id);
  checks++;linked.add(id);
 }
}
// Verify the known non-existent Chemistry subsection has been removed from the
// formerly incorrect Gibbs free-energy flashcard, without altering its ID/answer.
for(const id of ['task1_v298_chemistry_20','task1_v298_chemistry_21']){
 const gibbs=idToCard.get(id);
 assert(gibbs&&gibbs.subject==='Chemistry');assert.equal(gibbs.specRef,'3.1.8.2');
}
assert(!j('mock_short_recall_and_cloze_v298.json').cards.some(c=>c.specRef==='3.1.8.3'),
 'AQA Thermodynamics only has 3.1.8.1 and 3.1.8.2; do not label Gibbs 3.1.8.3');
for(const id of linked){
 const c=idToCard.get(id);
 for(const ans of c.accept||[]){assert.equal(mark(c,ans).status,'correct',id+' correct variant '+ans);accepted++;}
 for(const ans of c.reject||[]){assert.notEqual(mark(c,ans).status,'correct',id+' must not credit known bad variant '+ans);rejected++;}
}
assert.deepEqual(sc,{Physics:{sample:36,partial:10,unverified:0},Chemistry:{sample:23,partial:3,unverified:0}});
assert.equal(ledger.summary.sample,59);assert.equal(ledger.summary.partial,13);assert.equal(ledger.summary.unverified,0);
assert(ledger.sourceFileSamplingNotes.includes('Only linked cards'),'Large core deck must not be claimed fully audited');
assert.equal(ledger.summary.rows,72);
assert.equal(crossSection,6,'Six explicitly explained near-section specimen examples');
assert.equal(legacyBroad,15,'Fifteen explicitly explained original-deck legacy/broad labels');
// Diagnostic only: discover older mock cards with non-existent AQA 3.1.8.3 metadata.
const otherWrongThermoRefs=selected.filter(c=>c.subject==='Chemistry'&&c.specRef==='3.1.8.3');
console.log('V309_OTHER_THERMODYNAMICS_3_1_8_3_COUNT '+otherWrongThermoRefs.length);
console.log('V309_OTHER_THERMODYNAMICS_3_1_8_3_IDS '+JSON.stringify(otherWrongThermoRefs.slice(0,30).map(c=>c.id)));
console.log('PASS v310: '+ledger.rows.length+' provisional fine-grained AQA skills ('+JSON.stringify(sc)+'); '+checks+' evidence links from '+linked.size+' distinct real mock cards; '+accepted+' accepted and '+rejected+' rejected marker examples; '+crossSection+' cross-section and '+legacyBroad+' legacy broad metadata links.');
console.log('V309_NEXT_REVIEW_GAPS_BEGIN');
console.log(JSON.stringify(ledger.rows.filter(r=>r.status!=='sample').map(({id,subject,specRef,skill,status,notes})=>({id,subject,specRef,skill,status,notes})),null,2));
console.log('V309_NEXT_REVIEW_GAPS_END');
