'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),audit=json('editorial/task1-v384-physics-electricity-mechanics-six-manual.json'),deck=json('deck.json');
assert.equal(deck.cards.length,3345);
assert.equal(new Set(deck.cards.map(c=>c.id)).size,3345);
assert.equal(audit.version,'v384');
assert.equal(audit.rows.length,6);
assert.equal(audit.counts.marksRequiringManualWorking,46);
assert.equal(audit.counts.sourceBanks,2);
assert(sw.includes('-v384-physics6-manual'));
assert(app.includes('applyV384PhysicsSixWorkingReview(examQuestions);'));
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16)};
const start=app.indexOf('const V384_PHYSICS_SIX_MANUAL='),end=app.indexOf('const V287_LEGACY_SPEC_GROUPS=',start);
assert(start>0&&end>start);
const {selected,apply}=new Function(app.slice(start,end)+'\nreturn {selected:V384_PHYSICS_SIX_MANUAL,apply:applyV384PhysicsSixWorkingReview};')();
assert.deepEqual(selected,audit.rows.map(({sourceFile,...row})=>row));
const banks=new Map(),original=[];
for(const row of audit.rows){
 if(!banks.has(row.sourceFile))banks.set(row.sourceFile,json(row.sourceFile));
 const q=banks.get(row.sourceFile).questions.find(x=>x.id===row.id);
 assert(q,'Missing original '+row.id);
 for(const [k,v] of Object.entries({subject:'Physics',level:'AS',mock:true,standalone:true,requiresWorking:true,specRef:row.specRef,marks:row.marks}))assert.equal(q[k],v);
 assert.notEqual(q.taught,false);
 assert.notEqual(q.manualDiagramReview,true);assert.notEqual(q.manualWorkingReview,true);
 assert.equal(q.markPoints.length,q.marks);
 assert.equal(q.markPointMarks.reduce((a,b)=>a+b,0),q.marks);
 assert.equal(hash(q.prompt),row.promptHash);
 assert.equal(hash(q.modelAnswer),row.modelAnswerHash);
 original.push(q);
}
assert.equal(banks.size,2);
assert.equal(new Set(original.map(q=>q.id)).size,6);
const sourceSnapshot=JSON.stringify(original);
const updated=original.map(q=>({...q,markPoints:[...q.markPoints],markPointMarks:[...q.markPointMarks]}));
apply(updated);
assert.equal(JSON.stringify(original),sourceSnapshot,'Source bank unexpectedly modified');
assert.equal(updated.filter(q=>q.manualWorkingReview===true).length,6);
assert.equal(updated.reduce((n,q)=>n+(q.manualWorkingReview?q.marks:0),0),46);
const ms=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),me=app.indexOf('function startMockSession(){',ms);
const eligible=new Function(app.slice(ms,me)+'\nreturn mockEligibleQuestion;')();
const es=app.indexOf('function examSuggested(q,answer){'),ee=app.indexOf(' // v213:',es);
assert(es>0&&ee>es);
const suggested=new Function('window',app.slice(es,ee)+'\n}\nreturn examSuggested;')({});
const hs=app.indexOf('function manualExamHelpText(q){'),he=app.indexOf('function beginManualExamReview(q){',hs);
const helper=new Function(app.slice(hs,he)+'\nreturn {help:manualExamHelpText,button:manualExamButtonText};')();
let answers=0,mutations=0;
for(let i=0;i<original.length;i++){
 const src=original[i],q=updated[i];
 assert.equal(q.v384ReviewRequired,true);
 assert(eligible(q),'Physics school-mock question excluded '+q.id);
 assert.match(helper.help(q),/multi-step science question/);
 assert.equal(helper.button(q),'Review science working point by point');
 for(const answer of ['',q.modelAnswer,'all marks for keywords','V = IR','1.00 A']){
  const result=suggested(q,answer);
  assert.equal(result.manualRequired,true);
  assert.equal(result.suggested,0);
  assert.equal(result.finalCorrect,false);
  assert.deepEqual(result.preds,Array(q.marks).fill(false));
  assert.deepEqual(result.scores,Array(q.marks).fill(0));
  answers++;
 }
 for(const change of [
  {id:'different-id'},{subject:'Chemistry'},{level:'A2'},{mock:false},{taught:false},
  {standalone:false},{requiresWorking:false},{manualDiagramReview:true},{manualWorkingReview:true},
  {specRef:'other'},{marks:q.marks+1},{prompt:q.prompt+' edited'},
  {modelAnswer:q.modelAnswer+' edited'},{markPoints:[]},{markPointMarks:[]},
  {markPointMarks:[3]}
 ]){
  const altered={...src,...change};
  apply([altered]);
  assert.notEqual(altered.v384ReviewRequired,true,'Incorrect source guard '+q.id+' '+JSON.stringify(change));
  mutations++;
 }
}
assert.equal(answers,30);
assert.equal(mutations,96);
for(const id of ['task1_v280_phy_mech_q02','task1_v280_phy_mech_q03']){
 const originalDiagram=json('physics_mechanics_signed_area_couples_practice_v280.json').questions.find(q=>q.id===id);
 assert.equal(originalDiagram.manualDiagramReview,true);
 const diagram={...originalDiagram};apply([diagram]);
 assert.notEqual(diagram.v384ReviewRequired,true);
 assert.equal(helper.button(diagram),'Review diagram marking points manually');
}
const close=(value,expected,eps=1e-8)=>assert(Math.abs(value-expected)<=eps,'Independent science check failed: '+value+' vs '+expected);
// Potential divider: NTC thermistor initially 6 kΩ then 2 kΩ, bottom resistor 3 kΩ.
close(12/(6000+3000),0.00133333333333,1e-12);
close(12*3000/(6000+3000),4);
close(12/(2000+3000),0.0024);
close(12*3000/(2000+3000),7.2);
// Two identical cells in series vs parallel with internal resistance.
close(3/(2.4+0.6),1);
close(1.5/(2.4+0.15),0.5882352941,1e-8);
close((1.5/(2.4+0.15))*2.4,1.4117647059,1e-8);
// Operating point filament resistances; not the tangent gradient of I against V.
assert.deepEqual([1/0.2,3/0.4,6/0.6],[5,7.5,10]);
// Divider after parallel load, and moments with an added pure couple.
close(1/(1/6000+1/6000),3000);
close(9*3000/(3000+3000),4.5);
close(9/(3000+3000),0.0015);
close((75-58.8-8)/2.5,3.28);
close(50+117.6+3.28,170.88);
// Circular cross-section Young modulus and first-order percentage uncertainty.
const area=Math.PI*(0.0003**2)/4;
close(area,7.0685834706e-8,1e-17);
close(12*1.5/(area*0.0012),2.1220659079e11,2e7);
close(2*(0.010/0.300)*100+(0.02/1.2)*100,8.3333333333,1e-8);
console.log('PASS v384: six original Physics AS multi-step questions; 46 marks safely routed to working review, 30 zero-auto-credit responses, 96 source-guard mutations, two preserved diagrams and independent calculations.');
