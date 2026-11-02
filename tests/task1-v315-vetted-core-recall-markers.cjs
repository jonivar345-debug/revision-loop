'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const text=p=>fs.readFileSync(p,'utf8'),data=p=>JSON.parse(text(p));
const app=text('app.js'),deck=data('deck.json'),audit=data('editorial/task1-v315-core-answer-calibration.json');
const rows=audit.records;
assert.equal(rows.length,36);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(subject=>[subject,rows.filter(r=>r.subject===subject).length])),{Physics:12,Chemistry:12,Maths:12});
const a=app.indexOf('const V287_LEGACY_SPEC_GROUPS=');
const b=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards in memory.',a);
assert(a>=0&&b>a,'Production original-core patch functions present');
const build=new Function(app.slice(a,b)+
'\nreturn function(cards,withV315){applyV287LegacySpecRefs(cards);applyV288LegacyChemBondingSpecRefs(cards);applyV289LegacyEnergeticsSpecRefs(cards);applyV290LegacyElectricitySpecRefs(cards);applyV314CoreMockQuality(cards);if(withV315)applyV315CoreRecallCalibration(cards);return cards;};')();
const original=deck.cards;
const baseline=build(structuredClone(original),false);
const patched=build(structuredClone(original),true);
const srcMap=new Map(original.map(x=>[x.id,x]));
const baseMap=new Map(baseline.map(x=>[x.id,x]));
const patchedMap=new Map(patched.map(x=>[x.id,x]));
assert.equal(original.length,3345);
assert.deepEqual(patched.map(x=>x.id),original.map(x=>x.id),'No historical progress IDs moved');
const idSet=new Set(rows.map(r=>r.id));
assert.equal(idSet.size,36,'No duplicate calibration target');
for(const c of patched){
 const before=baseMap.get(c.id);
 if(!idSet.has(c.id))assert.deepEqual(c,before,'Non-target original card changed: '+c.id);
}
const eStart=app.indexOf('function normalise('),eEnd=app.indexOf('function importantTokens(',eStart);
assert(eStart>0&&eEnd>eStart);
const judge=new Function('window',app.slice(eStart,eEnd)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let oldAccepted=0,accepted=0,rejected=0;
for(const row of rows){
 const before=baseMap.get(row.id),card=patchedMap.get(row.id),source=srcMap.get(row.id);
 assert(source&&before&&card,'Missing original core card '+row.id);
 assert.equal(card.subject,row.subject);
 assert.equal(card.stage,'AS');assert.equal(card.mock,true);
 assert.equal(card.front,row.front,'Question text guard '+row.id);
 assert.equal(card.back,row.back,'Model answer guard '+row.id);
 assert.equal(card.front,before.front,'No prompt changes');
 assert.equal(card.back,before.back,'No answer changes');
 assert.deepEqual(card.accept,[...new Set([before.back,...(before.accept||[]),...row.accept])],row.id+' accepted choices should be appended only');
 assert.deepEqual(card.reject,[...new Set([...(before.reject||[]),...row.reject])],row.id+' rejects appended only');
 assert.equal(row.accept.length,2);
 assert.equal(row.reject.length,2);
 for(const answer of before.accept||[]){assert.equal(judge(card,answer).status,'correct',row.id+' old valid '+answer);oldAccepted++;}
 assert.equal(judge(card,card.back).status,'correct',row.id+' model answer');
 for(const answer of row.accept){const r=judge(card,answer);assert.equal(r.status,'correct',row.id+' valid '+answer+' -> '+JSON.stringify(r));accepted++;}
 for(const answer of row.reject){const r=judge(card,answer);assert.equal(r.status,'wrong',row.id+' wrong '+answer+' -> '+JSON.stringify(r));rejected++;}
}
assert.equal(accepted,72);assert.equal(rejected,72);
for(const [id,ans] of [
 ['phy_rp6','Gradient is +r and intercept equals emf.'],
 ['phy_top_projectile','Both vertical velocity and acceleration are zero at the top.'],
 ['phy_pandr_v29_photo_eq','hf = φ − KEmax'],
 ['chem_rp2','ΔH = +q/n for solution warming in an exothermic reaction.'],
 ['chem_ionisation_def','Energy required to remove a second electron from gaseous 1+ ions.'],
 ['chem_hess','The enthalpy change depends on which intermediate reactions are chosen.'],
 ['math_second_deriv','Positive second derivative implies a local maximum; negative implies minimum.'],
 ['math_trig_period','All three functions have period 360°.'],
 ['task1_maths_002','Translate the graph a units to the left.']
])assert.equal(judge(patchedMap.get(id),ans).status,'wrong','Do not award misleading common mistakes: '+id);
const urls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert.equal(urls.length,56);
const ldStart=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),ldEnd=app.indexOf(' const added=[',ldStart);
const loaded=new Function('cards','extraFlashBanks',app.slice(ldStart,ldEnd)+'\nreturn cards;')(patched,urls.map(data));
assert.equal(loaded.length,4344);
const sStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),sEnd=app.indexOf('function startMockSession(){',sStart);
const eligible=new Function(app.slice(sStart,sEnd)+'\nreturn mockEligibleCard;')();
const mock=loaded.filter(eligible);
assert.equal(mock.length,3372);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,mock.filter(c=>c.subject===s).length])),{Physics:1125,Chemistry:1916,Maths:331});
for(const row of rows)assert(mock.some(c=>c.id===row.id),'Calibrated card omitted from school mock: '+row.id);
assert(app.includes(' applyV315CoreRecallCalibration(cards);'),'Actual sync path must apply the calibration');
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v315: 36 original short mock cards (12 Physics, 12 Chemistry, 12 Year 1 Pure Maths); 72 added accepted and 72 incorrect responses checked by actual marker; '+oldAccepted+' existing alternatives retained; 4344 loaded cards and 3372 mock cards; progress IDs unchanged.');
