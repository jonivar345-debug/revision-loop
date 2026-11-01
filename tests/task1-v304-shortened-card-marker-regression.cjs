'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),core=j('deck.json'),paths=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
const begin=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),end=app.indexOf(' const added=[',begin);
const loaded=new Function('cards','extraFlashBanks',app.slice(begin,end)+'\nreturn cards;')([...core.cards],paths.map(j));
const by=new Map(loaded.map(c=>[c.id,c]));
const selected=app.slice(app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),app.indexOf('function startMockSession(){',app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS=')));
const eligible=new Function(selected+'\nreturn mockEligibleCard;')();
const start=app.indexOf('function normalise('),stop=app.indexOf('function importantTokens(',start);
const mark=new Function('window',app.slice(start,stop)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const ids='task1_v193_phy_001 task1_v193_phy_002 task1_v193_phy_003 task1_v195_phy_003 task1_v196_phy_001 task1_v196_phy_002 task1_v196_chem_003 task1_v215_chem_rp4_02 task1_v229_phy_waves_01 task1_v229_phy_waves_02 task1_v229_phy_waves_04 task1_v229_phy_waves_13 task1_v229_phy_waves_14 task1_v230_phy_mech_02 task1_v230_phy_mech_08 task1_v230_phy_mech_10 task1_v230_phy_mech_18 task1_v231_phy_elec_06 task1_v231_phy_elec_13 task1_v231_phy_elec_15 task1_v231_phy_elec_16 task1_v238_chem_atomic_04 task1_v238_chem_atomic_06 task1_v243_phy_particles_app_10 task1_v247_chem_energetics_08 task1_v247_chem_energetics_14 task1_v250_physics_electricity_19 task1_v253_physics_waves_14 task1_v253_physics_waves_15 task1_v254_chem_atomic_tof_21 task1_v256_chem_thermo_01 task1_v256_chem_thermo_06 task1_v256_chem_thermo_07 task1_v256_chem_thermo_13 task1_v256_chem_thermo_14 task1_v275_phy_fibre_card_20 task1_v279_phy_waves_card_09 phy_mechanics_focus_v37_18'.split(' ');
assert.equal(ids.length,37);
let correct=0,aliases=0,rejected=0;const tally={Physics:0,Chemistry:0,Maths:0};
for(const id of ids){
 const c=by.get(id);assert(c,'Missing loaded card '+id);
 assert(eligible(c),'Card must stay in same mock '+id);
 assert(c.front.length<=125,'Prompt still long '+id);
 assert(c.back.length<=180,'Model answer still long '+id);
 tally[c.subject]++;
 const got=mark(c,c.back);assert.equal(got.status,'correct',id+' own model answer '+JSON.stringify(got));correct++;
 if(c.accept?.length){for(const x of c.accept){
  const r=mark(c,x);assert.equal(r.status,'correct',id+' accepted model '+JSON.stringify(x)+' '+JSON.stringify(r));aliases++;
 }}
 if(c.reject?.length){for(const x of c.reject){
  const r=mark(c,x);assert.notEqual(r.status,'correct',id+' wrong example got full mark '+JSON.stringify(x));rejected++;
 }}
}
assert.equal(tally.Physics,25);assert.equal(tally.Chemistry,12);
console.log('PASS v304: '+ids.length+' original mock IDs retained; '+correct+' models correct, '+aliases+' accepted aliases correct and '+rejected+' rejected options not fully credited; subjects '+JSON.stringify(tally));


// Wider safety calibration: every short card in the 17 reviewed source banks,
// not just the 37 rewritten fronts, retains its original marker behaviour.
const banks='physics_mock_recall_v193.json physics_mock_recall_v195.json physics_mock_recall_v196.json chemistry_mock_recall_v196.json chemistry_rp4_recall_v215.json physics_waves_crosswalk_recall_v229.json physics_mechanics_cross_spec_recall_v230.json physics_electricity_cross_spec_recall_v231.json chemistry_atomic_tof_applications_v238.json physics_particles_applications_v243.json chemistry_energetics_applications_v247.json physics_electricity_applications_v250.json physics_waves_applications_v253.json chemistry_atomic_tof_applications_v254.json chemistry_thermodynamics_applications_v256.json physics_refraction_fibres_recall_v275.json physics_waves_polarisation_stationary_recall_v279.json'.split(' ');
let reviewed=0,aliasesChecked=0,distractorsChecked=0;
for(const bank of banks){
 for(const c of j(bank).cards||[]){
  if(c.front.length>125||!/^task1_(?:v193|v195|v196|v215|v229|v230|v231|v238|v243|v247|v250|v253|v254|v256|v275|v279)_/.test(c.id))continue;
  reviewed++;
  assert.equal(mark(c,c.back).status,'correct',c.id+' model answer');
  for(const x of c.accept||[]){
   assert.equal(mark(c,x).status,'correct',c.id+' accepted '+x);
   aliasesChecked++;
  }
  for(const x of c.reject||[]){
   assert.notEqual(mark(c,x).status,'correct',c.id+' forbidden '+x);
   distractorsChecked++;
  }
 }
}
assert.equal(reviewed,262,'262 short recall cards across 17 original source banks');
assert.equal(aliasesChecked,792);
assert.equal(distractorsChecked,548);
console.log('PASS v304 wider: '+reviewed+' cards, '+aliasesChecked+' accepted and '+distractorsChecked+' wrong examples checked against real marker');
