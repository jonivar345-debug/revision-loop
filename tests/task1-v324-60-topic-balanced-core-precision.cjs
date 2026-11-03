'use strict';
// AQA first-mock 60 original core flashcard evidence and one corrected TIR model.
const assert=require('node:assert/strict'),fs=require('node:fs');
const txt=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(txt(p));
const app=txt('app.js'),core=j('deck.json'),audit=j('editorial/task1-v324-60-cross-topic-core-precision.json');
assert.equal(core.cards.length,3345);
assert.equal(audit.records.length,60);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,audit.records.filter(x=>x.subject===s).length])),{Physics:20,Chemistry:23,Maths:17});
assert.equal(new Set(audit.records.map(r=>r.id)).size,60);
assert.equal(new Set(audit.records.map(r=>r.section)).size,47);
const a=app.indexOf('const V287_LEGACY_SPEC_GROUPS='),b=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards in memory.',a);
assert(a>=0&&b>a);
const patch=new Function(app.slice(a,b)+
 '\nreturn function(cards,newVersion){applyV287LegacySpecRefs(cards);applyV288LegacyChemBondingSpecRefs(cards);applyV289LegacyEnergeticsSpecRefs(cards);applyV290LegacyElectricitySpecRefs(cards);applyV314CoreMockQuality(cards);applyV315CoreRecallCalibration(cards);applyV316CoreRecallCalibration(cards);applyV321CoreRecallCalibration(cards);applyV322CoreRecallCalibration(cards);if(newVersion)applyV324CoreRecallCalibration(cards);return cards;}')();
const before=patch(structuredClone(core.cards),false),after=patch(structuredClone(core.cards),true);
assert.deepEqual(before.map(x=>x.id),after.map(x=>x.id),'Never break progress IDs');
const prev=new Map(before.map(c=>[c.id,c])),current=new Map(after.map(c=>[c.id,c]));
const m1=app.indexOf('function normalise('),m2=app.indexOf('function importantTokens(',m1);
assert(m1>=0&&m2>m1);
const evaluate=new Function('window',app.slice(m1,m2)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const f1=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),f2=app.indexOf('function startMockSession(){',f1);
const mockEligible=new Function(app.slice(f1,f2)+'\nreturn mockEligibleCard;')();
let model=0,accepted=0,rejected=0,negations=0,preserved=0,modelFixed=0;
const ids=new Set();
for(const record of audit.records){
 assert(!ids.has(record.id),'Duplicate curated ID '+record.id);ids.add(record.id);
 const old=prev.get(record.id),card=current.get(record.id);
 assert(old&&card,'Missing previously present core flashcard '+record.id);
 assert.equal(old.subject,record.subject);
 assert.equal(old.front,record.front);
 assert.equal(old.back,record.originalBack,'Guard original model text '+record.id);
 assert.equal(card.front,record.front);
 assert.equal(card.subject,record.subject);
 assert.equal(card.v324ExactReviewed,true,'Production exact marker flag '+record.id);
 assert(mockEligible(card),'Must stay in mock-only selector '+record.id);
 assert(card.front.length<=120,'Recall prompt too long '+record.id);
 assert(card.back.length<=180,'Recall answer too long '+record.id);
 assert(card.stage==='AS'||(card.subject==='Chemistry'&&card.stage==='A2'),'No A2 Maths/Physics in first mock');
 if(record.revisedBack){
  modelFixed++;
  assert.equal(card.back,record.revisedBack,'Corrected scientific answer '+record.id);
  assert(!card.accept.includes(record.originalBack),'Incomplete model must not be approved '+record.id);
  assert(card.reject.includes(record.originalBack),'Incomplete model must be actively rejected '+record.id);
  assert.equal(evaluate(card,record.originalBack).status,'wrong','One-condition TIR answer must lose credit');
  assert.equal(evaluate(card,'The angle of incidence exceeds the critical angle.').status,'wrong','Second standalone TIR condition is insufficient');
 }else assert.equal(card.back,old.back,'Original model answer preserved '+record.id);
 assert.deepEqual(card.accept,[...new Set([card.back,...(old.accept||[]).filter(x=>x!==record.originalBack||!record.revisedBack),...record.accept])],'Previously accepted valid wording retained '+record.id);
 assert.deepEqual(card.reject,[...new Set([...(old.reject||[]),...(record.revisedBack?[record.originalBack]:[]),...record.reject])],'Previously rejected answer variants retained '+record.id);
 assert.equal(evaluate(card,card.back).status,'correct','Correct model answer rejected '+record.id);model++;
 for(const correct of card.accept){assert.equal(evaluate(card,correct).status,'correct','Valid paraphrase rejected '+record.id+' '+correct);accepted++;}
 for(const wrong of card.reject){assert.equal(evaluate(card,wrong).status,'wrong','Wrong misconception credited '+record.id+' '+wrong);rejected++;}
 for(const valid of old.accept||[]){if(record.revisedBack&&valid===record.originalBack)continue;assert.equal(evaluate(card,valid).status,'correct','Historical correct alternative lost '+record.id);preserved++;}
 for(const valid of record.accept){assert.equal(evaluate(card,'not '+valid).status,'wrong','Negated answer credited '+record.id);negations++;}
}
assert.equal(model,60);assert.equal(modelFixed,1);assert.equal(negations,60);
for(const card of after.filter(c=>!ids.has(c.id)))assert.deepEqual(card,prev.get(card.id),'A core flashcard outside the review changed '+card.id);
const extraPaths=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(z=>z[1]);
assert.equal(extraPaths.length,56);
const loaderA=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),loaderB=app.indexOf(' const added=[',loaderA);
const all=new Function('cards','extraFlashBanks',app.slice(loaderA,loaderB)+'\nreturn cards;')(after,extraPaths.map(j));
assert.equal(all.length,4344);assert.equal(new Set(all.map(x=>x.id)).size,4344);
const mock=all.filter(mockEligible);
assert.equal(mock.length,3372);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,mock.filter(x=>x.subject===s).length])),{Physics:1125,Chemistry:1916,Maths:331});
for(const record of audit.records)assert(mock.some(c=>c.id===record.id),'Vetted card not included in live mock '+record.id);
assert(app.includes(' applyV324CoreRecallCalibration(cards);'),'Production app must run v324 calibration before loader');
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v324: 60 audited core flashcards (20 Physics, 23 Chemistry, 17 Year 1 Pure Maths) across 47 topic groups; '+model+' models, '+accepted+' accepted, '+rejected+' incorrect and '+negations+' negated responses with production evaluator. Corrected BOTH conditions for TIR. '+preserved+' historical valid variants preserved, 4344 total, 3372 mock, IDs unchanged.');
