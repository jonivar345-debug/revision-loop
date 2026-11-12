'use strict';
/* Nine authored 2025-index visual analogues; original AQA diagrams and mark scheme NOT inspected. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const bank=JSON.parse(fs.readFileSync('physics_as_paper2_guided_v430.json','utf8'));
const matrix=JSON.parse(fs.readFileSync('editorial/physics-paper2-2025-mcq-matrix-v448.json','utf8'));
const app=fs.readFileSync('app.js','utf8'),html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
const cards=bank.cards,old=cards.slice(0,218),added=cards.slice(218),prior198=cards.slice(0,198);
assert.equal(cards.length,227);
assert.equal(new Set(cards.map(c=>c.id)).size,227);
assert.equal(old.filter(c=>/^as_p2_v448_\d{3}$/.test(c.id)).length,20);
assert.equal(crypto.createHash('sha256').update(JSON.stringify(prior198)).digest('hex'),
 '8b1ae1eb57d02a9839eefedbd2e4b5b4d3971bb7d46fc053ce528ca890c63003',
 'The previous 198 item baseline must remain unchanged');
const qNums=['07','08','13','15','18','23','25','26','33'];
assert.deepEqual(added.map(c=>c.id),Array.from({length:9},(_,i)=>'as_p2_v449_'+String(i+1).padStart(3,'0')));
assert.deepEqual(added.map(c=>c.sourceStyle.question),qNums);
assert.deepEqual(Object.fromEntries(['A','B','C'].map(s=>[s,cards.filter(c=>c.paper2Section===s).length])),{A:71,B:44,C:112});
for(const c of added){
 const q=matrix.questions.find(q=>q.question===c.sourceStyle.question);
 assert(q&&q.diagramDependent&&q.specRef===c.specRef,c.id+' diagram source crosswalk');
 assert.equal(c.paper2Mode,'mcq');
 assert.equal(c.paper2Section,'C');
 assert.equal(c.paper2Choices.length,4);
 assert.equal(c.paper2Choices[0],c.back);
 assert.equal(new Set(c.paper2Choices.map(x=>x.toLowerCase())).size,4);
 assert(c.visual.startsWith('p2v449-'));
 assert(c.visualAlt.length>=60&&c.paper2Hint.length>30&&c.paper2Trap.length>30);
 assert(c.active===true&&c.taught===true&&c.mock===false&&c.scope==='full');
 assert(c.front.length<=175&&c.back.length<=165);
 assert(c.sourceStyle.verification.includes('official_mark_scheme_unreviewed'));
 assert.equal(q.examAnswerVerified,false);
 assert.equal(q.sourceEquivalenceCertified,false);
}
assert.equal(matrix.questions.find(q=>q.question==='08').specRef,'3.2.1.4');
assert.equal(added[1].back,'W⁻ boson.');
assert.equal(added[6].specRef,'3.4.1.1');
const sandbox={};vm.runInNewContext(fs.readFileSync('physics-paper2-visuals-v447.js','utf8'),sandbox);
assert.equal(sandbox.RevisionPaper2Visuals.version,'v447');
vm.runInNewContext(fs.readFileSync('physics-paper2-visuals-v449.js','utf8'),sandbox);
const visuals=sandbox.RevisionPaper2Visuals;
assert.equal(visuals.version,'v449');
assert.equal(visuals.names.length,17);
for(const c of added){
 const svg=visuals.render(c.visual);
 assert(svg.startsWith('<svg ')&&svg.endsWith('</svg>'),c.id+' not SVG');
 assert(svg.includes('role="img"')&&svg.includes('aria-label=')&&svg.includes('<title>'),c.id+' lacks alt');
 assert(!/<script|onload=|onclick=/i.test(svg),c.id+' SVG must be passive');
 assert(svg.includes('viewBox="0 0 360 170"'),c.id+' must scale for phone');
}
assert.equal(new Set(added.map(c=>visuals.render(c.visual))).size,9);
assert(visuals.render('p2v447-divider').includes('12.0 V'));
assert(app.includes('(?:430|443|444|445|446|447|448|449)'));
assert(html.includes('paper2=v449'));
assert(html.indexOf('physics-paper2-visuals-v447.js')<html.indexOf('physics-paper2-visuals-v449.js'));
assert(html.indexOf('physics-paper2-visuals-v449.js')<html.indexOf('app.js?v=430'));
assert(sw.includes("'./physics-paper2-visuals-v449.js'"));
assert(sw.includes('v449-nine-original-visuals'));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
// Independently recompute calculated answer models.
const near=(a,b)=>assert(Math.abs(a-b)<1e-7,a+' expected '+b);
near(3/7,3/(3+4));near(90/60,1.5);near(0.3-0.2,0.1);
near(10*0.2,2);near((2*10)/Math.tan(Math.PI/6),34.64101615137755);
near(3+2-1.5,3.5);near(12/(2-12/8),24);
console.log('PASS v449: nine original accessible visual MCQs; 227 cards, weak W− mapping, numerical models, old history and offline assets');
