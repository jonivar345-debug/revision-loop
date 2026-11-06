'use strict';
// v369 read-only numerical validation of six existing original Physics Waves mock applications.
const fs=require('node:fs'),assert=require('node:assert/strict');
const data=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const audit=data('editorial/task1-v369-waves-six-calculation-qa.json');
const core=data('deck.json').cards,app=fs.readFileSync('app.js','utf8');
assert.equal(audit.version,'v369');assert.equal(core.length,3345);
assert.equal(new Set(core.map(c=>c.id)).size,3345);
assert.equal(audit.counts.studentAnswersIndependentlyMarked,0);
assert.equal(audit.noUserDataEdits,true);
const sourceMap=new Map();
for(const file of ['science_practical_data_v194.json','physics_waves_polarisation_stationary_practice_v279.json','physics_waves_interference_application_v226.json','science_waves_energetics_v198.json']){
 assert(app.includes(file),'Original Waves question bank missing from website loader: '+file);
 const m=new Map(data(file).questions.map(q=>[q.id,q]));
 sourceMap.set(file,m);
}
let marks=0;const ids=new Set();
for(const entry of audit.entries){
 const q=sourceMap.get(entry.source)?.get(entry.id);
 assert(q,'Missing saved original question '+entry.id);
 assert(!ids.has(entry.id));ids.add(entry.id);
 assert.equal(q.subject,'Physics');assert.equal(q.level,'AS');assert.equal(q.mock,true);
 assert.equal(q.requiresWorking,true);assert.equal(q.marks,entry.marks);
 assert.equal(q.prompt,entry.prompt);assert.equal(q.modelAnswer,entry.modelAnswer);
 assert.deepEqual(q.markPoints,entry.markPoints);assert.deepEqual(q.markPointMarks,entry.markPointMarks);
 assert.equal(q.markPointMarks.reduce((a,b)=>a+b,0),q.marks);
 assert.equal(q.markPoints.length,q.marks);
 marks+=q.marks;
}
assert.equal(audit.entries.length,6);assert.equal(marks,45);
const values=new Map(audit.expectedNumericValues.map(v=>[v.id+'|'+v.quantity,v]));
assert.equal(values.size,32);
function check(id,label,result){
 const e=values.get(id+'|'+label);
 assert(e,'Missing independent expected value for '+id+' '+label);
 assert(Number.isFinite(result));
 const tol=Math.max(1e-11,Math.abs(e.expected)*1e-7);
 assert(Math.abs(result-e.expected)<=tol,id+' / '+label+' = '+result+' expected '+e.expected);
}
// Physics RP1: string frequency; relevant fractional uncertainties enter with correct powers.
const q1='task1_v194_practical_01';
const L=.750,dL=.008,T=18,dT=.7,mu=.0080,dmu=.0002;
const f=Math.sqrt(T/mu)/(2*L);
check(q1,'frequencyOriginal',f);
check(q1,'frequencyQuadrupleTension',Math.sqrt(4*T/mu)/(2*L));
check(q1,'lengthPercentageUncertainty',100*dL/L);
check(q1,'tensionHalfContribution',50*dT/T);
check(q1,'muHalfContribution',50*dmu/mu);
check(q1,'totalMaximumPercentageUncertainty',100*(dL/L+.5*dT/T+.5*dmu/mu));
// Physics RP2: eight gaps, not eight fringes; wavelength and max fractional uncertainty.
const q2='task1_v194_practical_02';
const span=.016,dSpan=.0005,intervals=8,slit=.000350,dSlit=.000010,D=1.40,dD=.02;
const w=span/intervals,lambda=w*slit/D;
check(q2,'fringeWidthMetres',w);
check(q2,'slitSpacingMetres',slit);
check(q2,'wavelengthMetres',lambda);
check(q2,'wavelengthNm',lambda*1e9);
check(q2,'spanPercentageUncertainty',100*dSpan/span);
check(q2,'totalMaximumPercentageUncertainty',100*(dSpan/span+dSlit/slit+dD/D));
// Third harmonic/squared frequency: original linked question is FIRST harmonic f^2 vs T.
const q3='task1_v279_phy_waves_q04';
const mu3=.640/1000,L3=.800,T3=16,T3new=36;
const f3=Math.sqrt(T3/mu3)/(2*L3);
check(q3,'massPerLengthSI',mu3);
check(q3,'initialFundamentalFrequency',f3);
check(q3,'squaredFrequencyGraphGradient',1/(4*L3**2*mu3));
check(q3,'tensionChangeFrequencyFactor',Math.sqrt(T3new/T3));
check(q3,'revisedFundamentalFrequency',Math.sqrt(T3new/mu3)/(2*L3));
// Plane grating lines/mm -> lines/m, order n=2 and max whole order.
const q4='task1_v226_phy_01';
const linesPerMetre=600*1000,slitGap=1/linesPerMetre,lam4=500e-9;
const sine=2*lam4/slitGap;
check(q4,'slitSpacing',slitGap);
check(q4,'secondOrderSine',sine);
check(q4,'secondOrderAngle',Math.asin(sine)*180/Math.PI);
check(q4,'highestOrder',Math.floor(slitGap/lam4));
// Progressive wave: phase in fractions/degrees/radians and equivalent delay.
const q5='task1_v198_phy_01';
const velocity=60,frequency=125,distance=.090;
const period=1/frequency,wavelength=velocity/frequency,cycles=distance/wavelength;
check(q5,'period',period);
check(q5,'wavelength',wavelength);
check(q5,'separationCycles',cycles);
check(q5,'phaseDegrees',cycles*360);
check(q5,'phaseRadians',cycles*2*Math.PI);
check(q5,'equivalentTimeDelay',cycles*period);
// Two-source interference: path differences in actual wavelength units at A and B.
const q6='task1_v198_phy_02';
const lambdaSound=340/680,deltaA=4.75-4.00,deltaB=5.00-4.00;
check(q6,'wavelength',lambdaSound);
check(q6,'pathDifferenceA',deltaA);
check(q6,'pathDifferenceACycles',deltaA/lambdaSound);
check(q6,'pathDifferenceB',deltaB);
check(q6,'pathDifferenceBCycles',deltaB/lambdaSound);
// The numbers recomputed above must actually be present in the published model answers.
const tokens={
 [q1]:['31.6 Hz','63.2 Hz','1.07%','4.26%'],
 [q2]:['2.00 mm','5.00×10⁻⁷ m = 500 nm','3.13%','7.41%'],
 [q3]:['0.000640 kg m⁻¹','98.82 Hz','610.35 Hz² N⁻¹','1.50'],
 [q4]:['1.67 × 10⁻⁶ m','0.600','36.9°','whole diffraction order is 3'],
 [q5]:['0.00800 s','0.480 m','0.1875 cycles','67.5°','1.18 rad','1.50 ms'],
 [q6]:['0.500 m','0.750 m','1.50 wavelengths','destructive-interference','2.00 wavelengths','constructive interference']
};
const originals=new Map(audit.entries.map(e=>[e.id,e]));
for(const [id,phrases] of Object.entries(tokens)){
 for(const phrase of phrases)assert(originals.get(id).modelAnswer.includes(phrase),'Model answer omits recomputed result '+id+': '+phrase);
}
assert.equal(audit.remainingGates.length,4);
console.log('PASS v369: 32 independently recalculated quantities and all 45 published mark points in six existing Physics Waves school-mock applications; no user-facing changes.');
