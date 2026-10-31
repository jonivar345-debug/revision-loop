'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const json=p=>JSON.parse(fs.readFileSync(p,'utf8')),read=p=>fs.readFileSync(p,'utf8');
const audit=json('editorial/task1-v233-chemistry-semantic-marking-audit.json');
const deck=json('deck.json'),app=read('app.js'),sw=read('sw.js');
assert.equal(audit.version,'v233');assert.equal(deck.cards.length,3345);
assert.equal(audit.coreChemistryMockActive,1533);assert.equal(audit.reviewedExamples.length,7);
assert.equal(audit.tests.correctParaphrasesAccepted,14);assert.equal(audit.tests.conceptuallyWrongAlternativesRejected,14);
assert.equal(audit.schoolScope.explicitActiveCoreBufferCards,0);
assert.equal(audit.schoolScope.rp9PHCurveCardsUnconfirmed.length,8);
for(const f of Object.values(audit.limits))assert.equal(f,false);
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
assert(sw.includes('v233-chem-marking'));
const from=app.indexOf('function normalise('),to=app.indexOf('function importantTokens(',from);
assert(from>0&&to>from);const judge=new Function('window',app.slice(from,to)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const checks={
chem_lattice_diss:{wrong:['The enthalpy change when gaseous ions form one mole of an ionic solid.','Gaseous ions combine into a solid ionic lattice.'],right:['Ionic solid breaks into gaseous ions.','One mole of ionic lattice is separated into its gaseous ions.']},
chem_lattice_form:{wrong:['They have the same sign and magnitude.','Both enthalpies have the same sign.'],right:['Equal magnitude and opposite signs.','The negative of lattice dissociation enthalpy.']},
chem_ea1:{wrong:['The enthalpy change when gaseous atoms lose one electron.','One mole of gaseous atoms removes one electron each.'],right:['Gaseous atoms each gain an electron to make anions.','One mole of gas atoms accepts one mole of electrons.']},
task1_chem_182:{wrong:['Kw is [H+]/[OH-].','The ratio of hydrogen to hydroxide ion concentration.'],right:['Kw is [H+][OH-].','The product of hydrogen ion and hydroxide ion concentrations.']},
chem_energetics_v49_08:{wrong:['101 kPa.','101325 Pa.'],right:['100 kPa.','The standard pressure is one hundred kilopascals.']},
chem_energetics_v49_11:{wrong:['It is not zero.','The standard enthalpy of formation of an element is non-zero.'],right:['It is zero by definition.','Zero.']},
task1_chem_179:{wrong:["The rate constant for the acid's dissociation.",'Ka is an acid rate constant.'],right:['The acid dissociation equilibrium constant.','The equilibrium constant for HA ionising in water.']}
};
let positives=0,negatives=0;
for(const [id,tests] of Object.entries(checks)){
 const c=deck.cards.find(x=>x.id===id);assert(c,'original card ID removed: '+id);
 assert.equal(judge(c,c.back).status,'correct','model answer not credited '+id);
 for(const s of tests.right){assert.equal(judge(c,s).status,'correct','correct paraphrase denied '+id+' '+s);positives++;}
 for(const s of tests.wrong){assert.equal(judge(c,s).status,'wrong','wrong chemistry credited '+id+' '+s);negatives++;}
}
assert.equal(positives,14);assert.equal(negatives,14);
const active=deck.cards.filter(x=>x.subject==='Chemistry'&&x.mock===true&&x.active!==false);
assert.equal(active.length,1533);
assert.equal(active.filter(x=>!x.specRef).length,660);
assert.equal(active.filter(x=>!Array.isArray(x.accept)||x.accept.length===0).length,666);
assert.equal(active.filter(x=>!Array.isArray(x.reject)||x.reject.length===0).length,1523);
assert(!active.some(x=>/\bbuffers?\b|henderson/i.test([x.topic,x.front,x.back].join(' '))));
console.log('PASS v233: 7 historic Chemistry flashcards retain IDs and answer meaning, 14 correct paraphrases accepted and 14 scientifically wrong reversals rejected, existing progress unaffected, 1533-card full audit still open.');
