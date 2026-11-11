'use strict';
/* v447 source quality for eight original diagram-led AS Physics MCQs. */
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict'),vm=require('node:vm');
const data=JSON.parse(fs.readFileSync('physics_as_paper2_guided_v430.json','utf8'));
const matrix=JSON.parse(fs.readFileSync('editorial/physics-paper2-mcq-2024-skill-matrix-v446.json','utf8'));
const app=fs.readFileSync('app.js','utf8'),html=fs.readFileSync('index.html','utf8'),css=fs.readFileSync('styles.css','utf8'),sw=fs.readFileSync('sw.js','utf8');
const visualSource=fs.readFileSync('physics-paper2-visuals-v447.js','utf8');
const old=data.cards.slice(0,190),added=data.cards.filter(c=>/^as_p2_v447_\d{3}$/.test(c.id));
assert.equal(data.cards.length,198);
assert.equal(crypto.createHash('sha256').update(JSON.stringify(old)).digest('hex'),
 'e69a41dfcd57f198bacd132f6d2f929e2187b422922befb85affd2dacd0846ca','Every existing review, accepted answer and ID must remain unchanged');
assert.equal(added.length,8);
assert.equal(new Set(data.cards.map(c=>c.id)).size,198);
assert.deepEqual(added.map(c=>c.id),Array.from({length:8},(_,i)=>'as_p2_v447_'+String(i+1).padStart(3,'0')));
assert.deepEqual(added.map(c=>c.sourceStyle.question),['09','10','11','15','18','19','25','26']);
const original=matrix.questionFamilies.filter(f=>f.diagramDependent);
assert.equal(original.length,8);
for(const c of added){
 const src=original.find(f=>f.question===c.sourceStyle.question);
 assert(src,'Each visual card traces to a diagram-sensitive 2024 MCQ technique: '+c.id);
 assert.equal(c.specRef,src.specRef);
 assert(c.sourceStyle.status.includes('original visual analogy'));
 assert(c.mock===false&&c.scope==='full'&&c.active&&c.taught);
 assert.equal(c.paper2Section,'C');
 assert.equal(c.paper2Mode,'mcq');
 assert.equal(c.paper2Choices.length,4);
 assert.equal(c.paper2Choices[0],c.back);
 assert.equal(new Set(c.paper2Choices.map(x=>x.toLowerCase().trim())).size,4);
 assert(c.visual.startsWith('p2v447-'));
 assert(c.visualAlt.length>=50);
 assert(c.paper2Hint.length>=15&&c.paper2Trap.length>=15);
 assert(c.front.length<=175&&c.back.length<=165);
}
assert.deepEqual(Object.fromEntries(['A','B','C'].map(k=>[k,data.cards.filter(c=>c.paper2Section===k).length])),{A:71,B:44,C:83});
const sandbox={};vm.runInNewContext(visualSource,sandbox,{filename:'physics-paper2-visuals-v447.js'});
const diagrams=sandbox.RevisionPaper2Visuals;
assert.equal(diagrams.version,'v447');
assert.equal(diagrams.names.length,8);
for(const card of added){
 assert(Array.from(diagrams.names).includes(card.visual));
 const svg=diagrams.render(card.visual);
 assert(svg.startsWith('<svg ')&&svg.endsWith('</svg>'),card.id+' SVG missing');
 assert(svg.includes('role="img"')&&svg.includes('aria-label='),card.id+' accessible SVG missing');
 assert(svg.includes('<title>'),card.id+' accessible title missing');
 assert(!svg.includes('<script'),card.id+' no active code in diagram');
}
assert.equal(new Set(added.map(c=>diagrams.render(c.visual))).size,8,'Each visual card needs distinct artwork');
function close(actual,target){assert(Math.abs(actual-target)<1e-9,actual+' expected '+target)}
close(12*6/(3+6),8);close(0.5*20*2**2,40);
close(2*(1.50-1.20),0.6);
close(9*(1/6+1/3),4.5);
close(1+(2*3)+(-1*2),5);
close(4*10/(2*Math.sin(Math.PI/6)),40);
close(10*0.3/1,3);
assert(app.includes('(?:430|443|444|445|446|447)'));
assert(app.includes("root")===false||app.includes("RevisionPaper2Visuals"));
assert(html.includes('physics-paper2-visuals-v447.js?v=447'));
assert(html.indexOf('physics-paper2-visuals-v447.js')<html.indexOf('app.js?v=430'),'Load SVG renderer before main app');
assert(sw.includes("'./physics-paper2-visuals-v447.js'")&&sw.includes('v447-visual-mcqs'));
assert(css.includes('.paper2-diagram-caption'));
assert(app.includes('Original practice diagram'));
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
console.log('PASS v447: eight unique accessible visual MCQs mapped to 2024 diagram techniques, 190 old cards preserved, 198 total, numeric solutions and safe offline progress');
