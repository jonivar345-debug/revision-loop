'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const app=fs.readFileSync('app.js','utf8');
const start=app.indexOf('function parseNumber(s){'),end=app.indexOf('function nextSchedule(',start);
assert(start>=0&&end>start,'The real app parser and unit marker should be tested, not a test implementation.');
const {parseNumber,numericMatch}=new Function(app.slice(start,end)+'\nreturn {parseNumber,numericMatch};')();
const model=(numericAnswer,unit)=>({answerType:'numeric',numericAnswer,unit,tolerance:0});
const checks=[
 [{numericAnswer:.0025,unit:'m'},[
 ['2.5 × 10⁻³ m',true],['2.5 × 10^-3 m',true],['2.5 x 10^(-3) m',true],
 ['2.5e-3 m',true],['0.25 cm',true],['2.5 mm',true],['2500 µm',true],
 ['2500 μm',true],['2.5 × 10⁻³ cm',false],['2.5 x 10^-3 mm',false],
 ['2.5 × 10^(-3) km',false],['2.5e-3 cm',false],['2.5 mm',true],
 ['2.5e-3 s',false],['2.5 × 10⁻³ s',false],['2.5 µs',false],['5 m',false]
 ]],
 [{numericAnswer:.0025,unit:'s'},[
 ['2.5 × 10⁻³ s',true],['2.5 ms',true],['2500 µs',true],['2500 μs',true],
 ['2500000 ns',true],['0.0025 seconds',true],['2.5 x 10^-3 m',false],
 ['2.5 × 10⁻³ ms',false],['2.5 × 10⁻³ ns',false],['2.5 m',false]
 ]],
 [{numericAnswer:2.5,unit:'MJ'},[
 ['2.5 MJ',true],['2500 kJ',true],['2.5 mJ',false],['2.5 J',false],
 ['2.5 × 10⁰ MJ',true],['2.5 × 10⁰ mJ',false]
 ]],
 [{numericAnswer:25,unit:'m'},[
 ['25 m',true],['2500 cm',true],['25000 mm',true],
 ['25 km',false],['25 ms',false]
 ]]
];
let total=0;for(const [q,samples] of checks)for(const [answer,expected] of samples){
 const actual=numericMatch(model(q.numericAnswer,q.unit),answer);
 assert.equal(actual,expected,`${q.numericAnswer} ${q.unit}; response: ${answer}`);
 total++;
}
for(const [s,v] of [['2.5 × 10⁻³',.0025],['2.5 x 10^(-3)',.0025],['2.5e-3',.0025],
 ['-4 × 10⁻²',-.04],['0.25',.25]]){
 assert(Math.abs(parseNumber(s)-v)<1e-12,'parseNumber '+s);
}
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
console.log('PASS v281: '+total+' real numericMatch cases, superscript/exponent unit conversion, milli/micro/nano prefixes, wrong dimension/magnitude rejection and unchanged cloud keys.');
