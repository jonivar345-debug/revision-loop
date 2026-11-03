'use strict';
// Task 1 v328: precise science core recall definitions and misconceptions.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),core=j('deck.json'),audit=j('editorial/task1-v328-science-60-vetted-core.json');
assert.equal(core.cards.length,3345);
assert.equal(audit.records.length,60);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry'].map(s=>[s,audit.records.filter(x=>x.subject===s).length])),{Physics:30,Chemistry:30});
assert.equal(new Set(audit.records.map(x=>x.id)).size,60);
assert.equal(new Set(audit.records.map(x=>x.section)).size,32);
const s=app.indexOf('const V287_LEGACY_SPEC_GROUPS='),e=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards in memory.',s);
assert(s>=0&&e>s);
const patch=new Function(app.slice(s,e)+
 '\nreturn (cards,withNew)=>{applyV287LegacySpecRefs(cards);applyV288LegacyChemBondingSpecRefs(cards);applyV289LegacyEnergeticsSpecRefs(cards);applyV290LegacyElectricitySpecRefs(cards);applyV314CoreMockQuality(cards);applyV315CoreRecallCalibration(cards);applyV316CoreRecallCalibration(cards);applyV321CoreRecallCalibration(cards);applyV322CoreRecallCalibration(cards);applyV324CoreRecallCalibration(cards);applyV326CoreClarityFixes(cards);applyV327CoreRecallCalibration(cards);if(withNew)applyV328ScienceCoreCalibration(cards);return cards;}')();
const before=patch(structuredClone(core.cards),false),after=patch(structuredClone(core.cards),true);
assert.deepEqual(before.map(x=>x.id),after.map(x=>x.id),'Progress IDs must stay unchanged');
const prev=new Map(before.map(c=>[c.id,c])),current=new Map(after.map(c=>[c.id,c]));
const m1=app.indexOf('function normalise('),m2=app.indexOf('function importantTokens(',m1);
assert(m1>=0&&m2>m1);
const evaluate=new Function('window',app.slice(m1,m2)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const f1=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),f2=app.indexOf('function startMockSession(){',f1);
const eligible=new Function(app.slice(f1,f2)+'\nreturn mockEligibleCard;')();
const selected=new Set();
let models=0,oldModels=0,correct=0,wrong=0,negative=0,previousAccept=0,updatedModels=0;
for(const row of audit.records){
 assert(!selected.has(row.id));selected.add(row.id);
 const old=prev.get(row.id),card=current.get(row.id);
 assert(old&&card,'Existing original mock card required '+row.id);
 assert.equal(old.id,card.id);assert.equal(old.front,row.originalFront);
 assert.equal(old.back,row.originalBack);
 assert.equal(card.front,row.originalFront,'Never change prompt '+row.id);
 assert.equal(card.subject,row.subject);
 assert.equal(card.v328ExactReviewed,true,'Core exact-review gate missing '+row.id);
 assert(eligible(card),'First mock membership lost '+row.id);
 assert.equal(card.stage,'AS','Physics/Chemistry first-year eligibility expected '+row.id);
 assert(card.front.length<=120&&card.back.length<=180,'No long-answer flashcards '+row.id);
 assert.deepEqual(card.accept,[...new Set([card.back,row.originalBack,...(old.accept||[]),...row.accept])],'Previously correct variants must remain '+row.id);
 assert.deepEqual(card.reject,[...new Set([...(old.reject||[]),...row.reject])],'Previously wrong variants must remain '+row.id);
 if(row.revisedBack){updatedModels++;assert.equal(card.back,row.revisedBack,'Exact science definition revised '+row.id);}
 else assert.equal(card.back,old.back,'Unrequested original answer changed '+row.id);
 assert.equal(evaluate(card,card.back).status,'correct','Correct model rejected '+row.id);models++;
 assert.equal(evaluate(card,row.originalBack).status,'correct','Prior model lost credit '+row.id);oldModels++;
 for(const a of card.accept){assert.equal(evaluate(card,a).status,'correct','Accepted variant '+row.id+' '+a);correct++;}
 for(const a of card.reject){assert.equal(evaluate(card,a).status,'wrong','Incorrect response wrongly credited '+row.id+' '+a);wrong++;}
 for(const a of old.accept||[]){assert.equal(evaluate(card,a).status,'correct','Previously accepted answer broken '+row.id);previousAccept++;}
 for(const a of row.accept){assert.equal(evaluate(card,'not '+a).status,'wrong','Incorrect negation accepted '+row.id);negative++;}
}
assert.equal(models,60);assert.equal(oldModels,60);assert.equal(negative,60);assert.equal(updatedModels,1);
for(const c of after.filter(c=>!selected.has(c.id)))assert.deepEqual(c,prev.get(c.id),'Unreviewed original card changed '+c.id);
const fibre=after.find(c=>c.id==='task1_phy_064');
assert(fibre&&fibre.v324ExactReviewed===true);
assert.equal(evaluate(fibre,'Light travels from higher to lower refractive index.').status,'wrong','Do not regress two-condition TIR rule');
const fb=after.find(c=>c.id==='phy_fbd_common_forces');
assert(fb&&fb.v326ExactReviewed===true&&fb.method==='fill gaps');
assert.equal(evaluate(fb,'down; perpendicular; along rope; opposes sliding').status,'correct','True relative friction must be accepted');
assert.equal(evaluate(fb,'down; perpendicular; along rope; opposite direction of motion').status,'wrong','Inaccurate absolute friction must stay wrong');
const extra=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
assert.equal(extra.length,56);
const l1=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),l2=app.indexOf(' const added=[',l1);
const all=new Function('cards','extraFlashBanks',app.slice(l1,l2)+'\nreturn cards;')(after,extra.map(j));
assert.equal(all.length,4344);assert.equal(new Set(all.map(c=>c.id)).size,4344);
const mock=all.filter(eligible);assert.equal(mock.length,3372);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,mock.filter(c=>c.subject===s).length])),{Physics:1125,Chemistry:1916,Maths:331});
assert(app.includes(' applyV328ScienceCoreCalibration(cards);'),'v328 patch must run in actual site');
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v328: 60 existing Physics and Chemistry core school mock cards across 32 topics; '+models+' corrected models, '+oldModels+' prior models, '+correct+' accepted and '+wrong+' incorrect examples, '+negative+' negations and '+previousAccept+' older accepted variants; one clearer phase definition, prior TIR/friction preserved. 4344 total and 3372 mock IDs unchanged.');
