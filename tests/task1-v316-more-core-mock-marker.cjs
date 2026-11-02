'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),orig=json('deck.json'),audit=json('editorial/task1-v316-more-core-answer-calibration.json');
assert.equal(audit.records.length,60,'Second batch should contain 60 vetted cards');
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,audit.records.filter(c=>c.subject===s).length])),{Physics:20,Chemistry:20,Maths:20});
const a=app.indexOf('const V287_LEGACY_SPEC_GROUPS='),b=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards in memory.',a);
assert(a>=0&&b>a);
const patch=new Function(app.slice(a,b)+
'\nreturn function(cards,useV316){applyV287LegacySpecRefs(cards);applyV288LegacyChemBondingSpecRefs(cards);applyV289LegacyEnergeticsSpecRefs(cards);applyV290LegacyElectricitySpecRefs(cards);applyV314CoreMockQuality(cards);applyV315CoreRecallCalibration(cards);if(useV316)applyV316CoreRecallCalibration(cards);return cards;}')();
const base=patch(structuredClone(orig.cards),false),cards=patch(structuredClone(orig.cards),true);
assert.equal(cards.length,3345);
assert.deepEqual(cards.map(c=>c.id),orig.cards.map(c=>c.id),'All original progress IDs unchanged');
const baseById=new Map(base.map(c=>[c.id,c])),byId=new Map(cards.map(c=>[c.id,c]));
const audited=new Set(audit.records.map(c=>c.id));
assert.equal(audited.size,60);
let accept=0,reject=0,preserved=0;
const mStart=app.indexOf('function normalise('),mEnd=app.indexOf('function importantTokens(',mStart);
const evaluate=new Function('window',app.slice(mStart,mEnd)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const c of cards){
 const prev=baseById.get(c.id);
 if(!audited.has(c.id))assert.deepEqual(c,prev,'Unreviewed card mutated: '+c.id);
}
for(const x of audit.records){
 const before=baseById.get(x.id),c=byId.get(x.id);
 assert(c&&before,'Missing v316 core card: '+x.id);
 assert.equal(c.v316ExactReviewed,true,'Production patch guard failed: '+x.id);
 assert.equal(c.subject,x.subject);
 assert.equal(c.stage,'AS');assert.equal(c.mock,true);
 assert.equal(c.front,x.front);assert.equal(c.back,x.back);
 assert.equal(c.front,before.front);assert.equal(c.back,before.back);
 assert.deepEqual(c.accept,[...new Set([before.back,...(before.accept||[]),...x.accept])]);
 assert.deepEqual(c.reject,[...new Set([...(before.reject||[]),...x.reject])]);
 assert.equal(x.accept.length,2);assert.equal(x.reject.length,2);
 for(const v of before.accept||[]){assert.equal(evaluate(c,v).status,'correct',x.id+' old answer '+v);preserved++;}
 for(const v of c.accept){assert.equal(evaluate(c,v).status,'correct',x.id+' good answer '+v);accept++;}
 for(const v of c.reject){assert.equal(evaluate(c,v).status,'wrong',x.id+' bad answer '+v);reject++;}
}
assert(accept>=259,'Keep all reviewed and older good examples');
assert.equal(reject,120,'Two wrong examples per card');
for(const [id,right,wrong] of [
 ['phy_motion_v','Gradient is acceleration and signed area is displacement.','Gradient is displacement and area is acceleration.'],
 ['phy_photoelectric_001','Emission requires hf≥work function.','hf<φ produces photoelectron emission.'],
 ['phy_spectra_photo_v32_intensity_stopping','Stopping potential remains constant at fixed frequency.','Stopping potential doubles if light intensity doubles at fixed frequency.'],
 ['chem_rp4','Cl− white AgCl; Br− cream AgBr; I− yellow AgI.','Cl− yellow, Br− cream, I− white.'],
 ['chem_group2_sulfate','Less soluble lower down Group 2.','Group 2 sulfates become more soluble towards barium.'],
 ['chem_bondenthalpy','Sum bonds broken minus sum bonds formed.','ΔH≈Σformed−Σbroken for mean bond enthalpies.'],
 ['maths_transform_001','x-coordinates increase by a for f(x−a).','Translate left by a.'],
 ['maths_transform_003','Horizontal scale factor 1/a.','Horizontal stretch by factor a for a>1.'],
 ['task1_maths_004','Replacing x by −x mirrors horizontally across the vertical axis.','Reflection in the x-axis.'],
 ['task1_v162_003','Replacing x with x+a moves the graph left.','Vertical shift a units upwards.']
]){
 const c=byId.get(id);
 assert.equal(evaluate(c,right).status,'correct',id+' correct should not be wrong');
 assert.equal(evaluate(c,wrong).status,'wrong',id+' wrong should not receive partial credit');
}
const links=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
assert.equal(links.length,56);
const lStart=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),lEnd=app.indexOf(' const added=[',lStart);
const loaded=new Function('cards','extraFlashBanks',app.slice(lStart,lEnd)+'\nreturn cards;')(cards,links.map(json));
assert.equal(loaded.length,4344);
const sStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),sEnd=app.indexOf('function startMockSession(){',sStart);
const mockEligible=new Function(app.slice(sStart,sEnd)+'\nreturn mockEligibleCard;')();
const mock=loaded.filter(mockEligible);
assert.equal(mock.length,3372);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,mock.filter(c=>c.subject===s).length])),{Physics:1125,Chemistry:1916,Maths:331});
for(const row of audit.records)assert(mock.some(c=>c.id===row.id),'Vetted card omitted from mock '+row.id);
assert(app.includes(' applyV316CoreRecallCalibration(cards);'),'V316 patch must be called on real website sync');
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v316: 60 vetted existing core recall cards (20 per mock subject), '+accept+' true and '+reject+' false production-evaluator checks, '+preserved+' earlier accepted variants retained, 4344 loaded and 3372 mock cards, stable historical IDs, Maths transform correct-vs-wrong precision.');
