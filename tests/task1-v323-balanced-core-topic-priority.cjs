'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),core=j('deck.json');
const patchStart=app.indexOf('const V287_LEGACY_SPEC_GROUPS='),patchEnd=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards in memory.',patchStart);
assert(patchStart>=0&&patchEnd>patchStart);
const patch=new Function(app.slice(patchStart,patchEnd)+
 '\nreturn (cards)=>{applyV287LegacySpecRefs(cards);applyV288LegacyChemBondingSpecRefs(cards);applyV289LegacyEnergeticsSpecRefs(cards);applyV290LegacyElectricitySpecRefs(cards);applyV314CoreMockQuality(cards);applyV315CoreRecallCalibration(cards);applyV316CoreRecallCalibration(cards);applyV321CoreRecallCalibration(cards);applyV322CoreRecallCalibration(cards);return cards;}')();
assert.equal(core.cards.length,3345);
const oldIds=core.cards.map(c=>c.id),cards=patch(structuredClone(core.cards));
assert.deepEqual(cards.map(c=>c.id),oldIds,'Saved learner IDs must remain unchanged');
const extras=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(z=>z[1]);
assert.equal(extras.length,56);
const loadStart=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),loadEnd=app.indexOf(' const added=[',loadStart);
const loaded=new Function('cards','extraFlashBanks',app.slice(loadStart,loadEnd)+'\nreturn cards;')(cards,extras.map(j));
assert.equal(loaded.length,4344);
const selA=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),selB=app.indexOf('function startMockSession(){',selA);
const eligible=new Function(app.slice(selA,selB)+'\nreturn mockEligibleCard;')();
const mock=loaded.filter(eligible);assert.equal(mock.length,3372);
const coreSet=new Set(oldIds);
const mockCore=mock.filter(c=>coreSet.has(c.id));
assert.equal(mockCore.length,2373);
const preReviewed=new Set([...j('editorial/task1-v321-45-core-precision-variants.json').records,...j('editorial/task1-v322-60-legacy-core-variants.json').records].map(c=>c.id));
assert.equal(preReviewed.size,105);
for(const id of preReviewed)assert(mock.some(c=>c.id===id),'Reviewed core card missing from mock '+id);
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
  ['Rates and initial rates',/initial rate|rate equation|order of reaction|\brate constant\b|\breaction kinetics\b|\bkinetics\b/i],
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
  ['Amines amides and acylation',/\bamines?\b|\bamides?\b|\bamino\b|\bacyl(?:ation)?\b/i],
  ['Biodiesel triglycerides saponification',/biodiesel|triglyceride|saponif|soap|transesterific/i],
  ['Chemistry required practical accuracy',/required practical|\brp[0-9]+\b|distill|reflux|wash|drying agent|uncertainty/i]
 ],
 Maths:[
  ['Proof including divisibility counterexample',/proof|divisib|counterexample|odd integer|even integer|induction|exhaustion/i],
  ['Functions inequalities transformations',/functions?|transformat|inequalit|quadratic|modulus|surds?|binomial/i],
  ['Coordinate geometry and circles',/circle|tangent|line equation|perpendicular|coordinate geometry/i],
  ['Sequences and series',/sequence|arithmetic|geometric series|common ratio|sum to infinity/i],
  ['Trigonometry degrees and identities',/trigonomet|\bsin\b|\bcos\b|\btan\b|\bdegrees?\b|\bsine rule\b|\bcosine rule\b/i],
  ['Exponentials and logarithms',/exponential|logarithm|\bln\b|\blog\b/i],
  ['Differentiation and stationary points',/differentiat|derivative|stationary|turning point|gradient/i],
  ['Integration and signed area',/integrat|antiderivative|definite integral|area beneath|signed area/i],
  ['Vectors collinearity and division',/vector|collinear|position vectors?|magnitude of|ratio of segments/i]
 ]
};
assert.equal(Object.values(subjects).reduce((a,v)=>a+v.length,0),48);
const taken=new Set(),groups=[],zero=[],thin=[],remaining={Physics:{},Chemistry:{},Maths:{}};
let legacyNoRejected=0,legacyNoAccepted=0,legacyUnderspecified=0;
for(const subject of ['Physics','Chemistry','Maths']){
 const pool=mock.filter(c=>c.subject===subject);
 const corePool=mockCore.filter(c=>c.subject===subject);
 remaining[subject]={
  coreMock:corePool.length,
  noCuratedWrong:corePool.filter(c=>!c.reject?.length).length,
  noCuratedAccept:corePool.filter(c=>!c.accept?.length).length,
  noSpecRef:corePool.filter(c=>!c.specRef).length,
  reviewedV321V322:corePool.filter(c=>preReviewed.has(c.id)).length
 };
 legacyNoRejected+=remaining[subject].noCuratedWrong;
 legacyNoAccepted+=remaining[subject].noCuratedAccept;
 legacyUnderspecified+=remaining[subject].noSpecRef;
 for(const [label,rx] of subjects[subject]){
  const hits=pool.filter(c=>rx.test([c.front,c.back,c.topic,c.revisionTopic].join(' ')));
  const coreHits=hits.filter(c=>coreSet.has(c.id));
  const candidates=coreHits.filter(c=>rx.test([c.front,c.topic,c.revisionTopic].join(' '))&&
   !(label==='Energy power efficiency'&&/powers? of ten|prefix/i.test(c.front||''))&&
   !preReviewed.has(c.id)&&
   (!c.accept?.length||!c.reject?.length)&&c.front?.length<=120&&c.back?.length<=160);
  candidates.sort((a,b)=>
   ((b.reject?.length?0:8)+(b.accept?.length?0:3))-((a.reject?.length?0:8)+(a.accept?.length?0:3))||
   Number(rx.test(b.front||''))-Number(rx.test(a.front||''))||
   String(a.id).localeCompare(String(b.id)));
  const sample=[];
  for(const c of candidates){
   if(taken.has(c.id))continue;
   sample.push({id:c.id,topic:c.topic||c.revisionTopic||'',specRef:c.specRef||'',
    front:c.front,back:c.back,accepted:c.accept?.length||0,rejected:c.reject?.length||0});
   taken.add(c.id);
   if(sample.length>=5)break;
  }
  const row={subject,topic:label,allMockEvidence:hits.length,originalCoreEvidence:coreHits.length,
   remainingUncalibratedCore:candidates.length,reviewedSample:sample};
  groups.push(row);
  if(hits.length===0)zero.push({subject,topic:label});
  if(hits.length<5)thin.push({subject,topic:label,count:hits.length});
 }
}
assert.equal(groups.length,48);
const chosen=groups.flatMap(g=>g.reviewedSample);
assert.equal(new Set(chosen.map(c=>c.id)).size,chosen.length);
assert(chosen.length>=100,'Expected ample varied unreviewed core candidates across mock subjects');
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,mock.filter(c=>c.subject===s).length])),{Physics:1125,Chemistry:1916,Maths:331});
const summary={version:'v323',date:'2026-11-02',source:'Actual patched core + supplemental app loader + real school mock selector',counts:{
 loaded:loaded.length,mock:mock.length,coreMock:mockCore.length,previouslyReviewedCore:preReviewed.size,
 noRejectedExamples:legacyNoRejected,noAcceptedExamples:legacyNoAccepted,noSpecRef:legacyUnderspecified,
 distinctCandidateIds:chosen.length,zeroEvidenceGroups:zero.length,thinEvidenceGroups:thin.length},
 bySubject:remaining,zero,thin,topicGroups:groups,
 limitations:['A keyword match can be incidental and is not a signed-off AQA bullet-to-card mapping.',
 'A missing reject array is an editorial priority, not proof that an existing model answer is incorrect.',
 'The selected sample needs independent scientific/mathematical review before marking variants are added.',
 'Diagram drawing and full exam question marks require separate manual assessment.',
 'This does not declare Task 1 finished.']};
console.log('V323_BALANCED_MOCK_PRIORITY_BEGIN');
console.log(JSON.stringify(summary));
console.log('V323_BALANCED_MOCK_PRIORITY_END');
console.log('PASS v323: 48 cross-subject topic-family evidence rows; '+chosen.length+' unique core cards awaiting individual editorial checks; 4344 loaded / 3372 school mock / 2373 core; model answer preservation and scope maintained.');
