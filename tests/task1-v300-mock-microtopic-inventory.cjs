'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),core=j('deck.json');
const files=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
const start=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),end=app.indexOf(' const added=[',start);
assert(start>=0&&end>start);
const all=new Function('cards','extraFlashBanks',app.slice(start,end)+'\nreturn cards;')([...core.cards],files.map(j));
const a=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),b=app.indexOf('function startMockSession(){',a);
assert(a>=0&&b>a);
const eligible=new Function(app.slice(a,b)+'\nreturn mockEligibleCard;')();
const selected=all.filter(eligible);
const subjectCounts=Object.fromEntries(['Physics','Chemistry','Maths'].map(sub=>[sub,selected.filter(c=>c.subject===sub).length]));
assert.equal(all.length,4313);assert.deepEqual(subjectCounts,{Physics:1100,Chemistry:1910,Maths:331});
const subjects={
 Physics:[
  ['Measurement errors and uncertainty',/uncertaint|systematic error|random error|measurement|precision|accuracy/i],
  ['Resolving vectors and forces',/resolv|components? of|vector|resultant force/i],
  ['Motion and its graphs',/velocity.time|acceleration.time|displacement.time|motion graph|velocity gradient/i],
  ['Forces and slopes',/slope|incline|normal reaction|friction|newton.s law/i],
  ['Projectile motion',/projectile|horizontal range|flight time/i],
  ['Moments and couples',/moment|couple|pivot/i],
  ['Momentum and impulse',/momentum|impulse|collision|recoil/i],
  ['Energy power efficiency',/work done|power|efficiency|kinetic energy|potential energy/i],
  ['Materials stress strain Young modulus',/young.s modulus|tensile|stress|strain|wire extension/i],
  ['Progressive waves and phase',/phase|wavelength|amplitude|wave speed|waveform/i],
  ['Diffraction interference and gratings',/diffraction|diffract|interfer|grating|double.slit|fringe/i],
  ['Stationary waves and harmonics',/stationary|node|antinode|harmonic/i],
  ['Refraction and optical fibres',/refract|critical angle|total internal|cladding|optical fibre/i],
  ['Photoelectric effect',/photoelectric|threshold frequency|work function|photoelectron/i],
  ['Particles quarks and interactions',/quark|lepton|baryon|meson|antiparticle|exchange particle/i],
  ['Electricity and potential dividers',/potential divider|internal resistance|emf|thermistor|ldr|resistivity|terminal p\.d/i]
 ],
 Chemistry:[
  ['Atomic structure isotopes mass spectra',/isotope|mass spectromet|time.of.flight|tof|m.z/i],
  ['Electron configuration and ionisation',/ionisation|electron configuration|subshell|orbital/i],
  ['Amount calculations and titration',/titration|moles?|empirical formula|molar mass|percentage yield|limiting reagent/i],
  ['Shapes covalent and ionic bonding',/bond angle|lone pair|trigonal|tetrahedr|ionic bond|covalent bond/i],
  ['Intermolecular forces and structure',/hydrogen bond|permanent dipole|induced dipole|van der waals|giant covalent|graphite|diamond/i],
  ['Calorimetry and enthalpy',/calorimet|enthalpy|heat released|exothermic|endothermic/i],
  ['Hess cycles and bond enthalpy',/hess|bond enthalp|enthalpy cycle/i],
  ['Group 2 and group 7',/group 2|group 7|halogen|alkaline earth|silver halide|agcl|agbr|agi/i],
  ['Inorganic tests and observations',/precipitat|test for|flame test|sodium hydroxide|ammonia solution/i],
  ['Rates and initial rates',/initial rate|rate equation|order of|rate.constant|kinetic/i],
  ['Arrhenius activation energy',/arrhenius|activation energy|ln k|1\/t/i],
  ['Kp gaseous equilibrium',/partial pressure|k_p|kp\b|equilibrium constant/i],
  ['Born Haber and lattice enthalpy',/born.haber|lattice enthalp|lattice formation|lattice dissociation/i],
  ['Entropy and Gibbs free energy',/entropy|gibbs|Δg|delta g|feasib/i],
  ['Strong weak acids pH Ka Kw',/acid dissociation|strong acid|weak acid|\bka\b|\bkw\b|\bph\b|hydrogen ion concentration/i],
  ['Halogenoalkane substitution elimination',/halogenoalkane|nucleophilic substitution|s_n1|s_n2|elimination/i],
  ['Alcohol oxidation and dehydration',/oxidis|oxidiz|alcohol|dehydrat/i],
  ['Optical isomerism and chirality',/chirality|chiral|enantiomer|optical isomer|racemic/i],
  ['Aldehydes ketones carbonyl tests',/aldehyde|ketone|carbonyl|tollens|fehlings|2,4.dnph/i],
  ['Carboxylic acids esters and acyl',/carboxylic acid|ester|acyl chloride|acylation|acid anhydride/i],
  ['Amines amides and acylation',/amine|amide|ammonia|amino/i],
  ['Biodiesel triglycerides saponification',/biodiesel|triglyceride|saponif|soap|transesterific/i],
  ['Chemistry required practical accuracy',/required practical|\brp[0-9]+\b|distill|reflux|wash|drying agent|uncertainty/i]
 ],
 Maths:[
  ['Proof including divisibility counterexample',/proof|divisib|counterexample|odd integer|even integer|induction|exhaustion/i],
  ['Functions inequalities transformations',/functions?|transformat|inequalit|quadratic|modulus|surds?|binomial/i],
  ['Coordinate geometry and circles',/circle|tangent|line equation|perpendicular|coordinate geometry/i],
  ['Sequences and series',/sequence|arithmetic|geometric series|common ratio|sum to infinity/i],
  ['Trigonometry degrees and identities',/trigonomet|sin|cos|tan|degrees|sine rule|cosine rule/i],
  ['Exponentials and logarithms',/exponential|logarithm|\bln\b|\blog\b/i],
  ['Differentiation and stationary points',/differentiat|derivative|stationary|turning point|gradient/i],
  ['Integration and signed area',/integrat|antiderivative|definite integral|area beneath|signed area/i],
  ['Vectors collinearity and division',/vector|collinear|position vectors?|magnitude of|ratio of segments/i]
 ]
};
const result={version:'v300',date:'2026-11-01',source:'Actual app.js loader and mockEligibleCard',allCards:all.length,eligibleCards:selected.length,subjects:subjectCounts,coverage:[],thin:[],zero:[],notes:['A keyword hit is evidence, not proof that every AQA assessable bullet was tested or marked fairly.','Some topic families overlap and contain legacy broad wording. Inspect the returned samples and individual mark schemes before claiming complete coverage.','Maths school mock is Year 1 Pure only; do not add Year 2, radians, Mechanics or Statistics.','Buffers are excluded from taught Chemistry mock.']};
for(const [subject,groups] of Object.entries(subjects)){
 const pool=selected.filter(c=>c.subject===subject);
 for(const [name,rx] of groups){
  const hits=pool.filter(c=>rx.test([c.front,c.back,c.topic,c.revisionTopic].join(' ')));
  const row={subject,topic:name,count:hits.length,exampleIds:hits.slice(0,5).map(c=>c.id),exampleFronts:hits.slice(0,3).map(c=>c.front)};
  result.coverage.push(row);
  if(hits.length===0)result.zero.push(row);
  else if(hits.length<5)result.thin.push(row);
 }
}
console.log('V300_MOCK_MICROTOPICS_BEGIN');
console.log(JSON.stringify(result,null,2));
console.log('V300_MOCK_MICROTOPICS_END');
assert.equal(result.coverage.length,48);
console.log('PASS v300 read-only topic evidence inventory, '+result.coverage.length+' curriculum families; '+result.zero.length+' zero-hit and '+result.thin.length+' thin-hit groups require editorial judgement.');
