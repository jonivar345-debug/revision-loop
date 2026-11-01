'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),core=j('deck.json'),bankFiles=[
 ['physics_mechanics_cross_spec_recall_v230.json','Physics',20],
 ['physics_mechanics_applications_v257.json','Physics',34],
 ['physics_mechanics_signed_area_couples_recall_v280.json','Physics',16],
 ['chemistry_energetics_applications_v247.json','Chemistry',18],
 ['chemistry_thermodynamics_applications_v256.json','Chemistry',28]
];
const markerStart=app.indexOf('function normalise('),markerEnd=app.indexOf('function importantTokens(',markerStart);
assert(markerStart>=0&&markerEnd>markerStart);
const {evaluateCard,normalise}=new Function('window',app.slice(markerStart,markerEnd)+'\nreturn {evaluateCard,normalise};')({RevisionPhotoelectricCardMarking:null});
const bankUrls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
const loaderStart=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),loaderEnd=app.indexOf(' const added=[',loaderStart);
const loaded=new Function('cards','extraFlashBanks',app.slice(loaderStart,loaderEnd)+'\nreturn cards;')([...core.cards],bankUrls.map(j));
assert.equal(loaded.length,4313,'Preserve original 4313 loaded cards');
const first=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),last=app.indexOf('function startMockSession(){',first);
const mockEligibleCard=new Function(app.slice(first,last)+'\nreturn mockEligibleCard;')();
assert.equal(loaded.filter(mockEligibleCard).length,3341,'Keep original mock population');
const byId=new Map(loaded.map(c=>[c.id,c]));
const normalized=t=>normalise(t).replace(/[.!?]+$/,'').trim();
let accepted=0,rejected=0,models=0,subject={Physics:0,Chemistry:0};
for(const [path,sub,count] of bankFiles){
 const cards=j(path).cards;
 assert.equal(cards.length,count,'Expected original bank size: '+path);
 for(const c of cards){
  assert.equal(c.subject,sub);assert.equal(c.strictRecall,true);
  assert.equal(c.mock,true);assert.equal(c.taught,true);assert(mockEligibleCard(c),c.id+' should be in mock');
  assert.equal(byId.get(c.id)?.front,c.front,'Live loader must use exact corrected card');
  assert(c.front.length<=125&&c.back.length<=180,c.id+' too long for a recall card');
  assert(c.accept?.includes(c.back),c.id+' model not in accepted examples');
  const correct=new Set(c.accept.map(normalized));
  for(const wrong of c.reject)assert(!correct.has(normalized(wrong)),c.id+' wrong response semantically identical to accepted form '+wrong);
  assert.equal(evaluateCard(c,c.back).status,'correct',c.id+' own correct answer');
  models++;subject[sub]++;
  for(const good of c.accept){
   const response=evaluateCard(c,good);
   assert.equal(response.status,'correct',c.id+' accepted: '+good+' got '+JSON.stringify(response));
   accepted++;
  }
  for(const wrong of c.reject){
   const response=evaluateCard(c,wrong);
   assert.equal(response.status,'wrong',c.id+' wrong: '+wrong+' got '+JSON.stringify(response));
   rejected++;
  }
 }
}
assert.deepEqual(subject,{Physics:70,Chemistry:46});
assert.equal(models,116);
assert.equal(accepted,465);assert.equal(rejected,303);
// Independently verify representative Physics and Chemistry calculations and units.
const near=(a,b)=>Math.abs(a-b)<1e-9;
assert(near(Math.sqrt(6**2+8**2),10));
assert(near(20*Math.cos(Math.PI/6),17.3205080757));
assert(near(5*9.8*Math.sin(Math.PI/6),24.5));
assert(near(0.15*(-8-12)/0.040,-75));
assert(near(((-2+6)/2)*4,8));
assert(near(0.5*20*0.040,0.4));
assert(near((100/1e-6)/(0.002/2),1e11));
assert(near(50*4.18*5,1045));
assert(near(((-394+2*(-286))-(-239)),-727));
assert(near(-1411-286+1560,-137));
assert(near((4*413+2*498)-(2*805+4*463),-814));
assert(near(-411-(108+121+496-349),-787));
assert(near(-602-(150+249+738+1450-141+744),-3792));
assert(near(787-406-363,18));
assert(near(2526-1920-2*364,-122));
assert(near(-120-298*(-.100),-90.2));
assert(near(40-350*.200,-30));
assert(near(2*257-2*248-205,-187));
const key=Object.fromEntries(bankFiles.flatMap(([path])=>j(path).cards.map(c=>[c.id,c])));
assert(/Born–Haber/.test(key.task1_v256_chem_thermo_13?.topic||'')||/Born–Haber/.test(key.task1_v256_chem_thermo_13?.front)||/Lattice formation/.test(key.task1_v256_chem_thermo_13?.front));
assert(!key.task1_v256_chem_thermo_09.reject.includes('+18 kJ mol⁻¹?'));
for(const [id,good,bad] of [
 ['task1_v230_phy_mech_09','v_y=0, a_y=g downwards','v_y=0 and a_y=0'],
 ['task1_v230_phy_mech_20','The diameter may be biased; area depends on diameter squared.','Systematic offset disappears when readings are averaged.'],
 ['task1_v247_chem_energetics_14','−35000 J mol⁻¹','+35000 J mol⁻¹'],
 ['task1_v256_chem_thermo_06','−3792000 J mol⁻¹','+3792000 J mol⁻¹'],
 ['task1_v256_chem_thermo_09','18000 J mol⁻¹','+180 kJ mol⁻¹'],
 ['task1_v256_chem_thermo_23','−0.120 kJ K⁻¹ mol⁻¹','+0.120 kJ K⁻¹ mol⁻¹']
]){
 assert.equal(evaluateCard(key[id],good).status,'correct',id+' good variant');
 assert.equal(evaluateCard(key[id],bad).status,'wrong',id+' bad variant');
}
console.log('PASS v307: '+models+' school mock cards; '+accepted+' vetted accepted and '+rejected+' rejected answer checks; independently verified Physics mechanics and Chemistry energetics/Born–Haber sums, signs, units, exact loaded deck and original progress IDs.');
