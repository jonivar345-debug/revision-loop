'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),audit=json('editorial/task1-v377-waves-seventeen-manual-marking.json'),deck=json('deck.json');
assert.equal(deck.cards.length,3345);assert.equal(new Set(deck.cards.map(c=>c.id)).size,3345);
assert.equal(audit.rows.length,17);assert.equal(audit.counts.reviewedMarks,118);
assert(sw.includes('-v377-waves-manual-review'));
assert(app.includes('applyV377PhysicsWavesManualReview(examQuestions);'));
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16)};
const start=app.indexOf('const V377_WAVES_MANUAL='),end=app.indexOf('const V287_LEGACY_SPEC_GROUPS=',start);
assert(start>0&&end>start);
const {selected,apply}=new Function(app.slice(start,end)+'\nreturn {selected:V377_WAVES_MANUAL,apply:applyV377PhysicsWavesManualReview};')();
assert.deepEqual(selected,audit.rows.map(({id,specRef,marks,promptHash,modelAnswerHash})=>({id,specRef,marks,promptHash,modelAnswerHash})));
const banks=new Map(),original=[];
for(const row of audit.rows){
 if(!banks.has(row.sourceFile))banks.set(row.sourceFile,json(row.sourceFile));
 const q=banks.get(row.sourceFile).questions.find(x=>x.id===row.id);
 assert(q,'Missing source '+row.id);
 for(const [k,v] of Object.entries({subject:'Physics',level:'AS',mock:true,standalone:true,requiresWorking:true,specRef:row.specRef,marks:row.marks}))assert.equal(q[k],v);
 assert.notEqual(q.taught,false);assert.notEqual(q.manualDiagramReview,true);assert.notEqual(q.manualWorkingReview,true);
 assert.equal(q.markPoints.length,q.marks);
 assert.equal(q.markPointMarks.reduce((a,b)=>a+b,0),q.marks);
 assert.equal(hash(q.prompt),row.promptHash);assert.equal(hash(q.modelAnswer),row.modelAnswerHash);
 original.push(q);
}
assert.equal(new Set(original.map(q=>q.id)).size,17);
const before=JSON.stringify(original),updated=original.map(q=>({...q,markPoints:[...q.markPoints],markPointMarks:[...q.markPointMarks]}));
apply(updated);
assert.equal(JSON.stringify(original),before);
assert.equal(updated.filter(q=>q.manualWorkingReview===true).length,17);
assert.equal(updated.reduce((a,q)=>a+(q.manualWorkingReview?q.marks:0),0),118);
const ms=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),me=app.indexOf('function startMockSession(){',ms);
const eligible=new Function(app.slice(ms,me)+'\nreturn mockEligibleQuestion;')();
const es=app.indexOf('function examSuggested(q,answer){'),ee=app.indexOf(' // v213:',es);
const suggested=new Function('window',app.slice(es,ee)+'\n}\nreturn examSuggested;')({});
const hs=app.indexOf('function manualExamHelpText(q){'),he=app.indexOf('function beginManualExamReview(q){',hs);
const helper=new Function(app.slice(hs,he)+'\nreturn {help:manualExamHelpText,button:manualExamButtonText};')();
let probes=0,negative=0;
for(let i=0;i<original.length;i++){
 const q=updated[i],src=original[i];
 assert.equal(q.v377ReviewRequired,true);assert(eligible(q));
 assert.match(helper.help(q),/multi-step science question/);
 assert.equal(helper.button(q),'Review science working point by point');
 for(const answer of ['',q.modelAnswer,'every mark for this','10^13','formula only']){
  const r=suggested(q,answer);assert.equal(r.manualRequired,true);assert.equal(r.suggested,0);
  assert.deepEqual(r.preds,Array(q.marks).fill(false));
  assert.deepEqual(r.scores,Array(q.marks).fill(0));probes++;
 }
 for(const change of [{id:'other'},{subject:'Maths'},{level:'A2'},{mock:false},{taught:false},{standalone:false},{requiresWorking:false},{specRef:'different'},{marks:q.marks+1},{prompt:q.prompt+' edited'},{modelAnswer:q.modelAnswer+' edited'},{markPoints:[]}]){
  const altered={...src,...change};apply([altered]);assert.notEqual(altered.v377ReviewRequired,true);negative++;
 }
}
for(const [file,id] of [
 ['physics_waves_polarisation_stationary_practice_v279.json','task1_v279_phy_waves_q01'],
 ['physics_waves_polarisation_stationary_practice_v279.json','task1_v279_phy_waves_q03'],
 ['physics_waves_polarisation_stationary_practice_v279.json','task1_v279_phy_waves_q05'],
 ['physics_refraction_fibres_practice_v275.json','task1_v275_phy_fibre_q05']]){
 const q={...json(file).questions.find(x=>x.id===id)};
 assert.equal(q.manualDiagramReview,true);apply([q]);assert.notEqual(q.v377ReviewRequired,true);
 assert.equal(helper.button(q),'Review diagram marking points manually');
}
const near=(a,b,t)=>assert(Math.abs(a-b)<=t,'Independent result mismatch '+a+' vs '+b);
near(Math.asin(1.47/1.50)*180/Math.PI,78.52,0.02);
near(Math.asin(Math.sin(Math.PI/6)/1.5)*180/Math.PI,19.47,0.02);
near((1200*(1.467-1.459)/3e8),32e-9,1e-12);
near(Math.sqrt(16/0.000640)/(2*0.8),98.82,0.02);
near(Math.sqrt(18/0.0080)/(2*0.75),31.62,0.02);
near(0.002*0.000350/1.4,5e-7,1e-14);
near(Math.asin(2*500e-9/(1/600000))*180/Math.PI,36.87,0.02);
assert.equal(Math.floor((1/600000)/(500e-9)),3);
console.log('PASS v377: '+updated.length+' Waves science questions, 118 marks, '+probes+' manual marks probes, '+negative+' false-scope probes, four preserved diagrams and independent numerical checks.');