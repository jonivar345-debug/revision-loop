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
const ids='task1_v193_phy_001 task1_v193_phy_002 task1_v193_phy_003 task1_v195_phy_003 task1_v196_phy_001 task1_v196_phy_002 task1_v196_chem_003 task1_v215_chem_rp4_02 task1_v229_phy_waves_01 task1_v229_phy_waves_02 task1_v229_phy_waves_04 task1_v229_phy_waves_13 task1_v229_phy_waves_14 task1_v230_phy_mech_02 task1_v230_phy_mech_08 task1_v230_phy_mech_10 task1_v230_phy_mech_18 task1_v231_phy_elec_06 task1_v231_phy_elec_13 task1_v231_phy_elec_15 task1_v231_phy_elec_16 task1_v238_chem_atomic_04 task1_v238_chem_atomic_06 task1_v243_phy_particles_app_10 task1_v247_chem_energetics_08 task1_v247_chem_energetics_14 task1_v250_physics_electricity_19 task1_v253_physics_waves_14 task1_v253_physics_waves_15 task1_v254_chem_atomic_tof_21 task1_v256_chem_thermo_01 task1_v256_chem_thermo_06 task1_v256_chem_thermo_07 task1_v256_chem_thermo_13 task1_v256_chem_thermo_14 task1_v275_phy_fibre_card_20 task1_v279_phy_waves_card_09'.split(' ');
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
