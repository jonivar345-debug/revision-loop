/* Synthetic photo-review tests; never store the user's actual handwriting in GitHub. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const scanner=fs.readFileSync(path.join(__dirname,'..','scanner.js'),'utf8');
let checks=0,seq=0;const dom=new Map();
function element(id){
 const e={id,value:'',innerHTML:'',textContent:'',hidden:false,disabled:false,selectionStart:0,selectionEnd:0,children:[],
 classList:{add(){},remove(){},toggle(){}},setAttribute(){},addEventListener(){},dispatchEvent(){},focus(){},
 appendChild(child){this.children.push(child);return child},
 setRangeText(v,a,b){this.value=this.value.slice(0,a)+v+this.value.slice(b);this.selectionStart=this.selectionEnd=a+v.length},
 querySelectorAll(){return[]}};dom.set(id,e);return e;
}
['scanOCR','scanTranscript','scanOCRHint','scanOCRAlternatives','scanAlternativesList','scanOCRSourcePhotos','scanMathKeyboard','examAnswer','scanStatus','markExam'].forEach(element);
const document={getElementById:id=>dom.get(id)||null,createElement:tag=>element(tag+'-'+(++seq))},window={};
const exportLine='window.RevisionScan={mount,commit,countFor,usedOCR,reviewEvidence,prepareForMark};';
assert(scanner.includes(exportLine));
const injected=scanner.replace(exportLine,
 "window.__photoTest={set:(id,photos,recognized)=>{currentId=id;pages=photos;ocrText=recognized;ocrApplied=false;},scanLooksLikeCalculating,prepareForMark,applyRecognized,showOCR,attachMathKeyboard,ocrMathSignature,usedOCR};"+exportLine);
new Function('window','document','Event',injected)(window,document,globalThis.Event||function Event(){});
const t=window.__photoTest;assert(t);checks++;
assert.equal(t.scanLooksLikeCalculating({subject:'Maths'},'nothing readable'),false);checks++;
assert.equal(t.scanLooksLikeCalculating({subject:'Maths'},'(5+7+8+12)/4=8'),true);checks++;
assert.notEqual(t.ocrMathSignature('5+7=12'),t.ocrMathSignature('5+7=13'));checks++;
async function run(){
 t.set('mean-question',['data:image/png;base64,ZGF0YQ=='],'(5+7+8+12)/4=8');
 dom.get('scanTranscript').value='(5+7+8+12)/4=8';dom.get('scanOCR').hidden=false;
 let result=await t.prepareForMark('mean-question',{subject:'Maths',requiresWorking:true});
 assert.equal(result.ready,false);checks++;assert.match(result.message,/not been confirmed/);checks++;
 t.showOCR('(5+7+8+12)/4=8',42);
 assert.equal(dom.get('scanOCRSourcePhotos').children.length,1);checks++;
 assert.equal(dom.get('scanTranscript').value,'(5+7+8+12)/4=8');checks++;
 t.attachMathKeyboard();const keys=dom.get('scanMathKeyboard').children;assert(keys.length>=12);checks++;
 const minus=keys.find(x=>x.textContent==='−');assert(minus);checks++;
 dom.get('scanTranscript').value='x';dom.get('scanTranscript').selectionStart=1;dom.get('scanTranscript').selectionEnd=1;minus.onclick();
 assert.equal(dom.get('scanTranscript').value,'x-');checks++;
 dom.get('scanTranscript').value='(5+7+8+12)/4=8';dom.get('examAnswer').value='';
 t.applyRecognized('mean-question',false);
 assert.equal(t.usedOCR('mean-question'),true);checks++;
 result=await t.prepareForMark('mean-question',{subject:'Maths',requiresWorking:true});
 assert.equal(result.ready,true);checks++;
 console.log('PASS '+checks+' OCR confirmation, mobile symbol correction and photograph preview checks');
}
run().catch(err=>{console.error(err);process.exitCode=1});
