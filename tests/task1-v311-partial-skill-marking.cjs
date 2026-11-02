'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),core=j('deck.json');
const bankUrls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
const start=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),end=app.indexOf(' const added=[',start);
assert(start>0&&end>start,'Must exercise the actual live loader');
const all=new Function('cards','extraFlashBanks',app.slice(start,end)+'\nreturn cards;')([...core.cards],bankUrls.map(j));
const a=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),b=app.indexOf('function startMockSession(){',a);
const eligible=new Function(app.slice(a,b)+'\nreturn mockEligibleCard;')();
const mStart=app.indexOf('function normalise('),mEnd=app.indexOf('function importantTokens(',mStart);
const mark=new Function('window',app.slice(mStart,mEnd)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const selected=all.filter(eligible),byId=new Map(selected.map(c=>[c.id,c]));
assert.equal(all.length,4344,'No card IDs or loader entries changed');
assert.equal(selected.length,3372,'No mock selection changed');

const targeted={
 'task1_v227_phy_02': ['Acceleration at that instant.','Average acceleration over the whole journey.'],
 'task1_v227_phy_09': ['Young modulus E.','Stress multiplied by strain.'],
 'task1_v227_phy_10': ['Residual plastic strain remains.','It recovers fully on unloading.'],
 'task1_v280_phy_mech_card_01': ['No resultant force.','A non-zero net driving force is necessary.'],
 'task1_v280_phy_mech_card_08': ['Impulse.','Change in kinetic energy.'],
 'task1_v280_phy_mech_card_10': ['It keeps a permanent extension.','It returns to exactly its original length.'],
 'task1_v280_phy_mech_card_11': ["A material can remain elastic after Hooke's law stops applying.",'The two limits are always identical.'],
 'task1_v280_phy_mech_card_15': ["Young's modulus.",'Breaking strain.'],
 'task1_v230_phy_mech_12': ['No; third-law force pairs act on different objects.','Yes: both forces act on the same body.'],
 'task1_v230_phy_mech_20': ['The micrometer may have a fixed offset, making the calculated area inaccurate.','A zero error cancels when the measurements are averaged.'],
 'task1_v247_chem_energetics_06': ['A negative enthalpy change.','ΔH is positive because the solution warms.'],
 'task1_v247_chem_energetics_09': ['2.5 %','2.0%.'],
 'task1_v256_chem_thermo_23': ['−1.20 × 10² J K⁻¹ mol⁻¹.','−120 kJ K⁻¹ mol⁻¹.']
};
assert.equal(Object.keys(targeted).length,13);
let ac=0,rej=0;
for(const [id,[good,bad]] of Object.entries(targeted)){
 const card=byId.get(id);
 assert(card,'Card must be in real school mock deck: '+id);
 assert.equal(card.strictRecall,true,'Keep exact/vetted recall semantics '+id);
 assert(card.front.length<=125&&card.back.length<=180,'No disguised essay prompt or long model answer '+id);
 assert(card.accept.includes(good),'Protect new correct answer '+id);
 assert(card.reject.includes(bad),'Protect new common mistake '+id);
 assert.equal(mark(card,card.back).status,'correct','Model answer '+id);
 for(const variant of card.accept){
  assert.equal(mark(card,variant).status,'correct','Vetted alternative not credited: '+id+' '+variant);
  ac++;
 }
 for(const variant of card.reject){
  assert.notEqual(mark(card,variant).status,'correct','Known wrong answer credited: '+id+' '+variant);
  rej++;
 }
}
const led=j('editorial/task1-v309-science-individual-skill-crosswalk.json');
assert.equal(led.summary.sample,65);
assert.equal(led.summary.partial,7);
assert.equal(led.completion.task1Complete,false);
console.log('PASS v311: '+Object.keys(targeted).length+' real short school-mock cards; '+ac+' accepted and '+rej+' rejected variants; unchanged loader, scope and IDs; 11 partial specification skills still open.');
