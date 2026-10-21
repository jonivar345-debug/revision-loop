/* Regression checks for Revision Loop's local text/scanned-working marker.
   Run with: node tests/scanner-regression.cjs
   This exercises the marking logic but does not claim real-camera OCR accuracy. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const scanner=fs.readFileSync(path.join(root,'scanner.js'),'utf8');
const bank=JSON.parse(fs.readFileSync(path.join(root,'exam_questions.json'),'utf8')).questions;
const supplement=JSON.parse(fs.readFileSync(path.join(root,'paper_supplement_2016_2017.json'),'utf8')).questions;
const fixes=JSON.parse(fs.readFileSync(path.join(root,'exam_answer_corrections.json'),'utf8')).modelAnswers;
bank.push(...supplement);
for(const q of bank)if(Object.prototype.hasOwnProperty.call(fixes,q.id))q.modelAnswer=fixes[q.id];
const usable=bank.filter(q=>q.standalone!==false);
const begin=app.indexOf('function normalise(');
const middle=app.indexOf('function nextSchedule(',begin);
const scoreStart=app.indexOf('function examSuggested(',middle);
const scoreEnd=app.indexOf('function renderExam(',scoreStart);
assert(begin>=0&&middle>begin&&scoreStart>middle&&scoreEnd>scoreStart,'Scorer anchors exist');
const scorer=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'
  +app.slice(begin,middle)+app.slice(scoreStart,scoreEnd)
  +'return {examSuggested,markPointPrediction}')();
const binding='window.RevisionScan={mount,commit,countFor,getPages,useVisionText,usedOCR,reviewEvidence,prepareForMark,hasArithmeticMistakes};';
assert(scanner.includes(binding),'Scanner export anchor exists');
const injected=scanner.replace(binding,
 'window.__regression={set:(id,text)=>{currentId=id;ocrText=text;ocrApplied=true},reviewEvidence,possiblyIncorrectArithmetic,ocrMathSignature};'+binding);
const browser={};
new Function('window','document','markPointPrediction',injected)(
 browser,{getElementById:()=>null},scorer.markPointPrediction);
const judge=(id,answer)=>{
 const question=bank.find(q=>q.id===id);
 assert(question,'Known question ID: '+id);
 browser.__regression.set(id,answer);
 const result=scorer.examSuggested(question,answer);
 const evidence=browser.__regression.reviewEvidence(question,answer,result);
 assert(Array.isArray(evidence),'Photo marking evidence exists');
 const flags=evidence.map(e=>Boolean(e.strong));
 return {score:flags.reduce((n,marked,i)=>n+(marked?(question.markPointMarks?.[i]??1):0),0),flags};
};
let checks=0;
const expect=(id,answer,marks,flagIndex=null,flagValue=null)=>{
 const marked=judge(id,answer);
 assert.equal(marked.score,marks,id+' / '+answer.substring(0,80));
 if(flagIndex!==null)assert.equal(marked.flags[flagIndex],flagValue);
 checks++;
};
const M='orig_v33_math_28_3',I='stretch_v34_maths_integration',
 P='stretch_v34_physics_internal_resistance',
 C='stretch_v34_chemistry_back_titrations';
expect(M,'(5+7+8+12)/4=8',2);
expect(M,'(5+7+8+12)/4=7',1);
expect(M,'5+7+8+12=32\n32/4=7',1);
expect(M,'5+7+8+12=31\n31/4=8',1);
expect(M,'mean=8',1);
expect(M,'5,7,8,12',0);
expect(M,'5+7+8+12',0);
expect(I,'(x-3)(x+1)=0',1);
expect(I,'x²−2x−3=0',1);
expect(I,'area=32/3',1,3,false);
expect(I,'A=integral from -1 to 3 of (2x+3-x²)',1,3,true);
expect(I,'x²=2x+3\nx²-2x-3=0\n(x-3)(x+1)=0\nAt x=0 line y=3 above parabola y=0\nA=∫ -1 to 3 (2x+3-x²) dx\nIntegrate to x²+3x-x³/3\nArea=32/3',6);
expect(P,'Rparallel=2Ω\nRtotal=3Ω\nI=12/3=4A\nV=12-4=8V\nI6=8/6=1.33A\nI3=8/3=2.67A\nPower I^2r=16W\nE=16*90=1440J',7);
expect(P,'Rparallel=2Ω\nRtotal=3Ω\nI=12/3=9A\nV=7V',2);
expect(P,'12 1 6 3 90 8 4 2',0);
expect(P,'I=4A',1);
expect(P,'I=12/3=9A',0);
expect(C,'0.0400*0.500=0.0200 mol\n0.0180*0.400=0.00720 mol\nacid used=0.01280 mol\nCaCO3:HCl=1:2\nn(CaCO3)=0.00640 mol\nmass=0.64064g\npurity=75.4%',7);
expect(C,'0.85 40 0.5 18 0.4 100.1',0);
const arithmetic=[
 ['(5+7+8+12)/4=8',false],['(5+7+8+12)/4=7',true],
 ['1.5e-3*2=0.003',false],['1.5e-3*2=0.004',true],
 ['I=12/3=4',false],['I=12/3=9',true],
 ['x^2-2x-3=0',false]
];
for(const [line,expected] of arithmetic){
 assert.equal(browser.__regression.possiblyIncorrectArithmetic(line),expected,line);checks++;
}
// Ordinary numerical calculation: AQA-style correct-answer shortcut.
const chemBack=bank.find(q=>q.id==='aqa_chem_as23_p1_q2_6');
const physicsVector=bank.find(q=>q.id==='aqa_phy_as23_p1_q4_1');
assert(chemBack&&physicsVector,'Reference tests exist');
assert.equal(scorer.examSuggested(chemBack,'74%').suggested,chemBack.marks,'Correct complete calculation result can earn full marks');checks++;
assert.equal(scorer.examSuggested(chemBack,'74').suggested,chemBack.marks,'Correct unlabelled result can earn full marks');checks++;
assert.equal(scorer.examSuggested({...chemBack,prompt:chemBack.prompt+' Show your working.'},'74%').suggested<chemBack.marks,true,'Explicit show-working instruction requires demonstrated working');checks++;
assert.equal(scorer.examSuggested(chemBack,'74 g').suggested<chemBack.marks,true,'Incorrect explicit units cannot earn full marks');checks++;
assert.equal(scorer.examSuggested(physicsVector,'310 V').suggested<physicsVector.marks,true,'Wrong physical dimensions cannot earn full marks');checks++;
assert.equal(scorer.examSuggested(physicsVector,'310 N').suggested,physicsVector.marks,'Correct physical units earn full credit');checks++;
// Correct result can imply routine method, but not an additionally required diagram.
const forceDiagram=bank.find(q=>q.id==='orig_v25_physics_free_body_diagrams_1');
const idealGas=bank.find(q=>q.id==='orig_v25_physics_gas_laws_1');
assert(forceDiagram&&idealGas,'Combined instruction and routine questions exist');
assert(scorer.examSuggested(forceDiagram,'3.5').suggested<forceDiagram.marks,'A diagram plus calculation needs both parts');checks++;
assert.equal(scorer.examSuggested(idealGas,'120').suggested,idealGas.marks,'Ordinary numerical answer earns all available marks');checks++;
const previousWindow=global.window;
try{
 global.window=browser;
 const contradictory='initial acid = 1+1=3\nfinal = 74%';
 assert(browser.RevisionScan.hasArithmeticMistakes(contradictory),'Contradictory numerical step recognised');checks++;
 assert(scorer.examSuggested(chemBack,contradictory).suggested<chemBack.marks,'Right final number after demonstrably invalid calculation requires review');checks++;
}finally{
 if(previousWindow===undefined)delete global.window;else global.window=previousWindow;
}
for(const q of usable){
 const model=q.modelAnswer||q.markPoints.join('. ');
 const score=scorer.examSuggested(q,model).suggested;
 assert.equal(score,q.marks,'Full model answer for '+q.id);
 checks++;
}
const ids=usable.map(q=>q.id);
assert.equal(new Set(ids).size,ids.length,'No duplicate usable question IDs');
console.log('PASS '+checks+' scoring regressions; '+usable.length+' usable question model answers accepted.');
