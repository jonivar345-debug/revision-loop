/* Free-first OCR and ChatGPT hand-off tests: no network, model, or paid APIs. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'..','free-marking.js'),'utf8');
const nodes=new Map(),ids=[];
function element(id){
 const e={id,textContent:'',value:'',checked:false,disabled:false,hidden:false,onclick:null,
  classList:{toggle(){},add(){},remove(){}},
  insertAdjacentElement(where,child){
   const all=[...child.innerHTML.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
   all.forEach(element);ids.push(...all);
  },click(){return this.onclick?.()},select(){this.selected=true}};
 nodes.set(id,e);return e;
}
element('scanOCR');
let savedPrompt='',opened=0,networkCalls=0,imported=null;
element('markExam').click=()=>opened++;
const navigator={clipboard:{writeText:async s=>{savedPrompt=s}}};
const document={getElementById:id=>nodes.get(id)||null,
 createElement:()=>({className:'',innerHTML:'',insertAdjacentElement(){}})};
const window={
 RevisionScan:{getPages:()=>['data:image/jpeg;base64,dGVzdA=='],proposeLocalText:()=>true},
 RevisionVision:{importReviewedPoints:(q,points)=>{imported={q,points};return true}}
};
new Function('window','document','navigator',source)(window,document,navigator);
const bridge=window.RevisionFree;let checks=0;
assert(bridge);checks++;
const q={id:'aqa-sample',subject:'Chemistry',level:'A-level',prompt:'Explain the observed colour change.',marks:3,markPoints:['State the initial colour','Name a relevant ion','Explain electron transfer'],markPointMarks:[1,1,1]};
const prompt=bridge.markingPrompt(q);
assert(prompt.includes(q.prompt));checks++;
assert(prompt.includes('Explain electron transfer'));checks++;
assert(prompt.includes('attach a PHOTO'));checks++;
assert(prompt.includes('POINTS: 0,0,0'));checks++;
assert.deepEqual(bridge.parsePoints('POINTS: [1, 0, 1]',3),[true,false,true]);checks++;
assert.deepEqual(bridge.parsePoints('1;0;1',3),[true,false,true]);checks++;
assert.throws(()=>bridge.parsePoints('POINTS: 1,0',3),/Expected 3/);checks++;
assert.throws(()=>bridge.parsePoints('POINTS: 1,1,1,1',3),/Expected 3/);checks++;
assert.throws(()=>bridge.parsePoints('SCORE: 3/3',3),/POINTS/);checks++;
bridge.mount(q);
assert(ids.includes('freeCopyPrompt'));checks++;
assert(ids.includes('freeHandwritingTry'));checks++;
assert(ids.includes('freeApplyReport'));checks++;
async function main(){
 await nodes.get('freeCopyPrompt').click();
 assert.equal(savedPrompt,prompt);checks++;
 assert.equal(networkCalls,0);checks++;
 nodes.get('freeMarkReport').value='My explanation\nPOINTS: 1,0,1\nDone';
 nodes.get('freeApplyReport').click();
 assert.deepEqual(imported.points,[true,false,true]);checks++;
 assert.equal(imported.q.id,'aqa-sample');checks++;
 assert.equal(opened,1,'Imported flags open existing mark review');checks++;
 assert.equal(networkCalls,0,'Import never calls the API');checks++;
 nodes.get('freeHandwritingTry').click();
 assert.match(nodes.get('freeHandwritingStatus').textContent,/agree to download/i);checks++;
 assert.equal(networkCalls,0,'Optional heavy AI download requires explicit consent');checks++;
 console.log('PASS '+checks+' free ChatGPT hand-off, review and local-model consent checks');
}
main().catch(error=>{console.error(error);process.exitCode=1});
