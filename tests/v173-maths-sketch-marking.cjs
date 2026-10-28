'use strict';
/* v173: the school's AS Pure-only mock, answer sketches and human-reviewed marks. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const scanner=fs.readFileSync('scanner.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const css=fs.readFileSync('styles.css','utf8');
const sketch=fs.readFileSync('exam-sketch-v173.js','utf8');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const bank=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/v173-maths-school-mock-and-sketch.json','utf8'));
const filter=app.match(/function mockEligibleQuestion\(q\)\{[\s\S]*?\n\}/);
assert(filter,'Mock eligibility function missing');
const eligible=vm.runInNewContext(filter[0]+'\nmockEligibleQuestion');
const m=deck.cards.filter(c=>c.subject==='Maths'&&c.active!==false&&c.mock===true);
assert.equal(m.length,116);
assert(m.every(c=>c.stage==='AS'&&!['Statistics','Mechanics'].includes(c.topic)));
const selected=bank.questions.filter(q=>q.subject==='Maths'&&eligible(q));
assert.equal(selected.length,129);
assert(selected.every(q=>q.level==='AS'));
assert(!selected.some(q=>/(\bradians?\b|π)/i.test(q.prompt)));
assert(!selected.some(q=>['statistics','mechanics'].includes(String(q.topic).toLowerCase())));
assert(!eligible({subject:'Maths',mock:true,level:'A-level',topic:'Integration',prompt:'Integrate x²'}));
assert(!eligible({subject:'Maths',mock:true,level:'A2',topic:'Functions',prompt:'Find fg'}));
assert(!eligible({subject:'Maths',mock:true,level:'AS',topic:'Mechanics',prompt:'Find the force'}));
assert(!eligible({subject:'Maths',mock:true,level:'AS',topic:'Statistics',prompt:'Find mean'}));
assert(!eligible({subject:'Maths',mock:true,level:'AS',topic:'Trigonometry',prompt:'Use 2π radians'}));
assert(eligible({subject:'Maths',mock:true,level:'AS',topic:'Algebra & functions',prompt:'Find the remainder'}));
assert.equal(eligible({subject:'Chemistry',mock:true,level:'A2',topic:'Kp',prompt:'Find Kp'}),true);
assert(app.includes("const cardPool=cards.filter(c=>c.active!==false&&c.subject===sub&&c.mock===true).filter(c=>sub!=='Maths'||(c.stage==='AS'"));
assert(html.includes('Maths first mock: Year 12/AS Pure only.'));
assert(html.includes('The separate Year 13 class paper is after the other mocks'));
assert(html.indexOf('exam-sketch-v173.js?v=173')<html.indexOf('app.js?v=173'));
assert(html.indexOf('scanner.js?v=173')>html.indexOf('app.js?v=173'));
assert(sw.includes("'./exam-sketch-v173.js'"));
assert(css.includes('.exam-sketch canvas'));
assert(app.includes('window.RevisionSketch?.mount(q);'));
assert(scanner.includes('async function attachDrawing(id,imageData)'));
assert(scanner.includes('window.RevisionScan={mount,commit,countFor,getPages,useVisionText,proposeLocalText,usedOCR,reviewEvidence,prepareForMark,hasArithmeticMistakes,attachDrawing};'));
assert(scanner.includes('pages.length>=MAX'));
assert(scanner.includes("pages.push(imageData);resetOCR()"));
assert(app.includes('Suggested marks are not final'));
assert(app.includes('Your typed answer: '));
assert(app.includes('Currently ticked criteria: '));
assert(app.includes('Save your reviewed score.'));
new Function(sketch);
new Function(scanner);
new Function(app);
// Browser-like canvas test: create a pen stroke, attach it to the existing scanner,
// then check that the sketch pad cannot automatically award marks.
const nodes=new Map();
function node(id){
 const listeners={};
 const ctx={
  clearRect(){},fillRect(){},stroke(){},moveTo(){},lineTo(){},
  beginPath(){},arc(){},fill(){},drawImage(){}
 };
 const obj={id,hidden:false,disabled:false,
  classList:{toggle(){}},setAttribute(k,v){this[k]=v},
  innerHTML:'',getContext(){return ctx},
  getBoundingClientRect(){return {left:0,top:0,width:480,height:270}},
  setPointerCapture(){},hasPointerCapture(){return false},releasePointerCapture(){},
  toDataURL(){return 'data:image/png;base64,AAAA'},
  insertAdjacentHTML(where,markup){
   const found=[...markup.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
   for(const key of found)nodes.set(key,node(key));
  },
  addEventListener(name,fn){listeners[name]=fn},
  fire(name,event){listeners[name]?.(event)}
 };
 return obj;
}
nodes.set('examAnswer',node('examAnswer'));
const doc={getElementById:key=>nodes.get(key)||null,createElement:tag=>node(tag),
 querySelector(){return null}};
let submitted=null;
const w={RevisionScan:{async attachDrawing(id,src){submitted={id,src};return true}}};
vm.runInNewContext(sketch,{document:doc,window:w,Math,Image:function(){},console});
assert(w.RevisionSketch&&typeof w.RevisionSketch.mount==='function');
w.RevisionSketch.mount({id:'diagram-test',subject:'Maths',prompt:'Sketch the graph'});
const canvas=nodes.get('examSketchCanvas');
assert(canvas,'The drawing canvas was not mounted');
const event=(x,y)=>({button:0,clientX:x,clientY:y,pointerId:1,preventDefault(){}});
canvas.fire('pointerdown',event(10,10));
canvas.fire('pointermove',event(120,95));
canvas.fire('pointerup',event(120,95));
(async()=>{
 await nodes.get('sketchAttach').onclick();
 assert.deepEqual(JSON.parse(JSON.stringify(submitted)),{id:'diagram-test',src:'data:image/png;base64,AAAA'});
 assert.equal(audit.limits.pureMockLevelASOnly,true);
 assert.equal(audit.limits.autoSketchMarking,false);
 console.log('PASS v173: 116 AS Pure flashcards, 129 AS Pure questions, safe sketch attachment and manual marking.');
})().catch(e=>{console.error(e);process.exitCode=1});
