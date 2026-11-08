'use strict';
// Recalculate 18 *already existing* multi-step Physics/Chemistry/Maths
// practice results independently; do not confuse source correctness
// with human assessment of diagrams or alternative student methods.
const assert=require('node:assert/strict'),fs=require('node:fs');
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const app=fs.readFileSync('app.js','utf8');
const expected={
 'science_waves_energetics_v198.json':{
  task1_v198_phy_01:['Physics',7,'faf2de01'],
  task1_v198_phy_03:['Physics',9,'dd28e92c'],
  task1_v198_phy_04:['Physics',8,'7c691473'],
  task1_v198_phy_07:['Physics',8,'3a91ecd4'],
  task1_v198_chem_08:['Chemistry',9,'b42b048e'],
  task1_v198_chem_09:['Chemistry',8,'3acaf6b4'],
  task1_v198_chem_10:['Chemistry',7,'4f4ee500']
 },
 'physics_electricity_manual_sketch_practice_v407.json':{
  task1_v407_phy_elec_02:['Physics',10,'8a51efe'],
  task1_v407_phy_elec_04:['Physics',9,'3903dba8']
 },
 'chemistry_rates_rp7_kp_v210.json':{
  task1_v210_chem_01:['Chemistry',9,'faaa7f96'],
  task1_v210_chem_04:['Chemistry',8,'39a2df68'],
  task1_v210_chem_05:['Chemistry',9,'3ed47cb']
 },
 'chemistry_mock_precision_v199.json':{
  task1_v199_exam_04:['Chemistry',8,'75e4fee2'],
  task1_v199_exam_06:['Chemistry',8,'bafcec3b']
 },
 'maths_year1_pure_targeted_practice_v340.json':{
  task1_v340_maths_01:['Maths',8,'f3fafa2'],
  task1_v340_maths_02:['Maths',8,'54331057'],
  task1_v340_maths_03:['Maths',7,'4e8ddf98']
 },
 'maths_pure_proof_vector_applications_v209.json':{
  task1_v209_maths_003:['Maths',8,'ac4be3a5']
 }
};
const hash=v=>{
 let h=2166136261,s=String(v||'');
 for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
 return (h>>>0).toString(16);
};
const manifest=app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/);
assert(manifest,'No practice manifest');
const all={};
for(const [file,records] of Object.entries(expected)){
 assert(manifest[1].includes("'./"+file+"'"),'Practice no longer loads '+file);
 const source=json(file);
 for(const [id,[subject,marks,fingerprint]] of Object.entries(records)){
  const q=(source.questions||[]).find(q=>q.id===id);
  assert(q,'Source question removed '+id);
  assert.equal(q.subject,subject);
  assert.equal(q.marks,marks);
  assert.equal(q.mock,true);
  assert.equal(q.standalone,true);
  assert.equal(hash(JSON.stringify({prompt:q.prompt,modelAnswer:q.modelAnswer,
   markPoints:q.markPoints,markPointMarks:q.markPointMarks,marks:q.marks})),
   fingerprint,'Question or rubric changed; rederive numeric evidence for '+id);
  all[id]=q;
 }
}
const rad=degrees=>degrees*Math.PI/180;
const deg=radians=>radians*180/Math.PI;
let calculations=0;
const near=(actual,expected,tolerance,label)=>{
 assert(Number.isFinite(actual),'Nonfinite independent calculation '+label);
 assert(Math.abs(actual-expected)<=tolerance,
  label+': '+actual+' differs from independently expected '+expected);
 calculations++;
};
const contain=(id,pattern)=>{
 assert(pattern.test(all[id].modelAnswer),
  'Source model lacks verified numerical result: '+id+' / '+pattern);
};
// PHYSICS: phase, string-gradient uncertainty, diffraction, refraction and
// Electricity RP5 / RP6 supplied-report calculations.
near(1/125,.008,1e-10,'wave period');
near(60/125,.480,1e-10,'wave wavelength');
near((.090/(60/125))*360,67.5,1e-10,'wave phase degrees');
near((.090/60)*1000,1.50,1e-10,'wave time lag ms');
near((4000-1000)/(32-8),125,1e-10,'RP1 f squared slope');
near(1/(4*1.00**2*125),.00200,1e-12,'RP1 mass per length kg/m');
near(Math.sqrt(125*18),47.4,.05,'RP1 first harmonic');
near((2*.01/1+5/125)*100,6,1e-10,'RP1 combined gradient/length uncertainty %');
const spacing=1/(500*1000);
near(spacing,2e-6,1e-12,'grating spacing');
near(deg(Math.asin(3*600e-9/spacing)),64.2,.07,'red third order');
near(deg(Math.asin(3*450e-9/spacing)),42.5,.08,'blue third order');
assert.equal(Math.floor(spacing/600e-9),3);
assert.equal(Math.floor(spacing/450e-9),4);
near(deg(Math.asin(Math.sin(rad(45))/1.5)),28.1,.07,'Snell refraction');
near(3e8/1.5/(5e14),4e-7,1e-14,'glass wavelength');
near(deg(Math.asin(1/1.5)),41.8,.07,'glass critical angle');
const Rgradient=(3.2-1.6)/(.8-.4);
const wireArea=Math.PI*(.5e-3)**2/4;
near(Rgradient,4,1e-10,'RP5 R-L gradient');
near(wireArea,1.9635e-7,1e-11,'RP5 area');
near(Rgradient*wireArea,7.85e-7,1e-9,'RP5 resistivity');
near(2*(.010/.500)*100,4,1e-10,'RP5 area uncertainty %');
const eSlope=(1.12-1.42)/(.8-.2),eR=-eSlope,eEmf=1.42+.20*eR;
near(eSlope,-.5,1e-10,'RP6 V-I slope');
near(eR,.5,1e-10,'RP6 internal R');
near(eEmf,1.52,1e-10,'RP6 emf');
near(.20*eR,.10,1e-10,'RP6 lost volts');
contain('task1_v198_phy_01',/67\.5°/);
contain('task1_v198_phy_03',/0\.00200 kg/);
contain('task1_v198_phy_04',/64\.2°/);
contain('task1_v198_phy_07',/41\.8°/);
contain('task1_v407_phy_elec_02',/7\.85×10⁻⁷/);
contain('task1_v407_phy_elec_04',/1\.52 V/);
// CHEMISTRY: initial rates, Arrhenius, gas Kp, enthalpy, Born-Haber,
// Gibbs, weak-acid pH and equilibrium total mole pressure.
const rateK=2e-4/(.1**2*.2);
near(rateK,.1,1e-10,'rate constant k');
near(rateK*.3**2*.1,9e-4,1e-10,'rate prediction');
near(9000*8.31/1000,74.8,.05,'Arrhenius Ea kJ/mol');
near(Math.exp(25),7.20e10,1e8,'Arrhenius A');
near(Math.exp(-9000/300+25),6.74e-3,.00001,'Arrhenius k at 300 K');
near(80**2/60,107,.5,'Kp nitrogen dioxide kPa');
const neutralisationQ=70*4.18*7;
near(neutralisationQ,2048.2,.001,'calorimetry q');
near(-neutralisationQ/1000/.04,-51.2,.05,'neutralisation delta H');
near(-393-(89+112+419-325),-688,1e-10,'Born Haber lattice formation');
const gibbs=T=>-20-T*(-.080);
near(gibbs(200),-4,1e-10,'Gibbs at 200 K');
near(gibbs(298),3.84,1e-10,'Gibbs at 298 K');
near(20/.080,250,1e-10,'Gibbs feasibility boundary');
const H=Math.sqrt(1.8e-5*.1);
near(H,1.34e-3,0.00001,'weak acid [H+]');
near(-Math.log10(H),2.87,.01,'weak acid pH');
near(60**2*30/40**2,67.5,1e-10,'SO3 equilibrium Kp kPa');
contain('task1_v210_chem_01',/9\.00×10⁻⁴/);
contain('task1_v210_chem_04',/74\.8 kJ/);
contain('task1_v210_chem_05',/107 kPa/);
contain('task1_v198_chem_08',/−51\.2 kJ/);
contain('task1_v198_chem_09',/−688 kJ/);
contain('task1_v198_chem_10',/250 K/);
contain('task1_v199_exam_04',/pH = .*2\.87/);
contain('task1_v199_exam_06',/67\.5/);
// MATHS: exponential straight-line model, ambiguous sine rule, box
// optimisation and two-dimensional vector collinearity.
near((.5-1.5)/(7-2),-.2,1e-10,'log graph gradient');
near(1.5+.2*2,1.9,1e-10,'log model ln A');
near(Math.exp(1.9),6.69,.01,'log model A');
near((1.9-Math.log(3))/.2,4.007,.0005,'time to P=3');
near(Math.log(2)/.2,3.466,.0005,'halving time');
const B1=deg(Math.asin(.7)),B2=180-B1,C1=150-B1,C2=150-B2;
near(B1,44.427,.001,'acute sine rule B');
near(B2,135.573,.001,'obtuse sine rule B');
near(C1,105.573,.001,'first possible C');
near(C2,14.427,.001,'second possible C');
near(20*Math.sin(rad(C1)),19.3,.05,'first c length cm');
near(20*Math.sin(rad(C2)),4.98,.01,'second c length cm');
const x=(16-2*Math.sqrt(19))/3;
const volume=x*(20-2*x)*(12-2*x);
near(x,2.427,.001,'volume optimum x');
near(volume,263,.5,'maximum box volume');
assert(24*x-128<0,'Box stationary point not shown maximum');
near((8*(7+2)-6*(7+5)),0,1e-10,'vector AB AC determinant');
near(3/5,.6,1e-10,'unit vector east component');
near(4/5,.8,1e-10,'unit vector north component');
contain('task1_v340_maths_01',/4\.007/);
contain('task1_v340_maths_02',/135\.573/);
contain('task1_v340_maths_03',/263 cm/);
contain('task1_v209_maths_003',/k=7/);
// No source modification, no mark inferred from handwriting or graphs.
const subjectTotals=Object.fromEntries(['Physics','Chemistry','Maths']
 .map(subject=>[subject,Object.values(all).filter(q=>q.subject===subject).length]));
assert.deepEqual(subjectTotals,{Physics:6,Chemistry:8,Maths:4});
assert.equal(Object.keys(all).length,18);
assert.equal(json('deck.json').cards.length,3345);
assert.equal(json('exam_questions.json').questions.length,1268);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'",
 "PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])
 assert(app.includes(key));
console.log('PASS v416: '+Object.keys(all).length+' source-locked worked exam questions '+
 JSON.stringify(subjectTotals)+', '+calculations+
 ' independently derived numerical checks; model outputs, original 3345 flashcard IDs, '+
 '1268 original exam questions, saved profile and grading keys preserved. '+
 'This does not certify paper drawings, alternative written methods or complete AQA mock scope.');
