'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),recall=j('physics_waves_polarisation_stationary_recall_v279.json'),bank=j('physics_waves_polarisation_stationary_practice_v279.json'),audit=j('editorial/task1-v279-physics-waves-selected-crosswalk.json'),core=j('deck.json');
assert.equal(recall.version,'v279');assert.equal(bank.version,'v279');assert.equal(recall.cards.length,13);assert.equal(bank.questions.length,5);
assert.equal(core.cards.length,3345);assert.equal(j('exam_questions.json').questions.length,1268);
const qUrls=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const cUrls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert.equal(qUrls.length,42);assert.equal(qUrls[41],'physics_waves_polarisation_stationary_practice_v279.json');
assert.equal(cUrls.length,52);assert.equal(cUrls[51],'physics_waves_polarisation_stationary_recall_v279.json');
for(const s of ['physics_waves_polarisation_stationary_practice_v279.json','physics_waves_polarisation_stationary_recall_v279.json'])assert(sw.includes("'./"+s+"'"));
assert(sw.includes('-v279-waves-audit'));
const prior=[...core.cards,...cUrls.slice(0,51).flatMap(p=>j(p).cards||[])];
const ids=new Set(prior.map(c=>c.id)),fronts=new Set(prior.filter(c=>c.subject==='Physics').map(c=>String(c.front||'').trim().toLowerCase()));
const nStart=app.indexOf('function normalise('),nEnd=app.indexOf('function importantTokens(',nStart);assert(nStart>=0&&nEnd>nStart);
const mark=new Function('window',app.slice(nStart,nEnd)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const allowed=new Set(['3.3.1.2','3.3.1.3','3.3.2.2']);
let accepted=0,rejected=0;
for(const c of recall.cards){
 assert(!ids.has(c.id),'Duplicate ID '+c.id);ids.add(c.id);
 assert(!fronts.has(c.front.trim().toLowerCase()),'Duplicate Physics prompt '+c.front);fronts.add(c.front.trim().toLowerCase());
 assert.equal(c.subject,'Physics');assert.equal(c.stage,'AS');assert.equal(c.courseTopic,'Waves');assert(allowed.has(c.specRef));
 assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.scope,'mock');assert.equal(c.active,true);assert.equal(c.strictRecall,true);
 assert.equal(c.accept.length,2);assert.equal(c.reject.length,2);assert(c.accept.includes(c.back));
 for(const x of c.accept){assert.equal(mark(c,x).status,'correct','Valid '+c.id+' '+x);accepted++;}
 for(const x of c.reject){assert.equal(mark(c,x).status,'wrong','Invalid '+c.id+' '+x);rejected++;}
}
assert.equal(accepted,26);assert.equal(rejected,26);
const ls=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),le=app.indexOf(' const added=[',ls);
assert(ls>=0&&le>ls&&app.slice(ls,le).includes('else if(index===51)'));
const load=new Function('cards','extraFlashBanks',app.slice(ls,le)+'\nreturn cards;');
const good=Array.from({length:52},()=>({cards:[]}));good[51]=recall;
assert.equal(load([...core.cards],good).length,3358);
const bad=Array.from({length:52},()=>({cards:[]}));
bad[51]={cards:recall.cards.slice(0,7).map((c,i)=>({...c,...[{subject:'Chemistry'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'},{active:false},{specRef:'3.6.2'}][i]}))};
assert.equal(load([...core.cards],bad).length,3345);
const oldQ=new Set([...j('exam_questions.json').questions,...qUrls.slice(0,41).flatMap(p=>j(p).questions||[])].map(q=>q.id));
const newQ=new Set();let marks=0,drawings=0;
for(const q of bank.questions){
 assert(!oldQ.has(q.id),'Duplicate prior question '+q.id);assert(!newQ.has(q.id));newQ.add(q.id);
 assert.equal(q.subject,'Physics');assert.equal(q.level,'AS');assert.equal(q.topic,'Waves');assert(allowed.has(q.specRef));
 assert.equal(q.mock,true);assert.equal(q.taught,true);assert.equal(q.standalone,true);assert.equal(q.requiresWorking,true);
 assert.equal(q.sourceVerified,false);assert.equal(q.verificationLevel,'original-exam-style');
 assert.equal(q.markPoints.length,q.marks);assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 assert(q.prompt.includes('['+q.marks+' marks]'));assert(q.modelAnswer.length>190);
 if(q.manualDiagramReview)drawings++;marks+=q.marks;
}
assert.equal(marks,33);assert.equal(drawings,3);
const es=app.indexOf('function examSuggested(q,answer){'),ee=app.indexOf(' // v213:',es);assert(es>=0&&ee>es);
const suggest=new Function('window',app.slice(es,ee)+'\n}\nreturn examSuggested;')({});
for(const q of bank.questions.filter(x=>x.manualDiagramReview)){
 const s=suggest(q,'correct stationary nodes third harmonic light diffraction sketch in words only');
 assert.equal(s.manualRequired,true);assert.equal(s.suggested,0);assert.deepEqual(s.preds,Array(q.marks).fill(false));
}
const near=(a,b,eps=1e-9)=>Math.abs(a-b)<=eps;
const L=.90,v=120,n=3;assert(near(n*v/(2*L),200));
assert.deepEqual([0,L/3,2*L/3,L].map(x=>+x.toFixed(2)),[0,.30,.60,.90]);
assert.deepEqual([L/6,L/2,5*L/6].map(x=>+x.toFixed(2)),[.15,.45,.75]);
const ell=.800,mu=.640/1000,t1=16.0,t2=36.0;
const f=t=>Math.sqrt(t/mu)/(2*ell),gradient=1/(4*ell*ell*mu);
assert(near(mu,.000640));assert(near(f(t1),98.82117688,.00001));assert(near(gradient,610.3515625,.00001));
assert(near(f(t2)/f(t1),1.5));assert(near(f(t1)**2/t1,gradient));
assert(!bank.questions[2].prompt.includes('intensity-versus-angle graph. [6 marks]')||bank.questions[2].prompt.includes('Do not plot')); // AQA excludes required quantitative intensity graph
assert(!bank.questions.some(q=>/Malus.*(?:calculate|law in use)/i.test(q.prompt)));
assert.equal(audit.selectedRequirementCount,25);assert.equal(audit.selectedRequirements.length,25);
const all=new Map([...core.cards,...cUrls.flatMap(p=>j(p).cards||[]),...j('exam_questions.json').questions,...qUrls.flatMap(p=>j(p).questions||[])].map(q=>[q.id,q]));
const evidenceSpecs=new Set();
for(const row of audit.selectedRequirements){
 assert(row.evidenceIds.length>0,row.id);
 evidenceSpecs.add(row.specRef);
 for(const id of row.evidenceIds){assert(all.has(id),'Unknown Waves evidence '+id);assert.equal(all.get(id).specRef,row.specRef,'Spec mismatch '+id);}
}
assert.deepEqual([...evidenceSpecs].sort(),['3.3.1.1','3.3.1.2','3.3.1.3','3.3.2.1','3.3.2.2','3.3.2.3']);
assert.equal(audit.completion.allSixWavesNumberedSubsectionsHaveSelectedEvidence,true);
for(const [key,val] of Object.entries(audit.completion))if(key!=='allSixWavesNumberedSubsectionsHaveSelectedEvidence')assert.equal(val,false,'Certification not finished '+key);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v279: 13 focused AS Waves recall cards (26 valid/26 invalid), 5 original exercises with 33 marks, 3 manually reviewed sketches, first-harmonic numeric models and 25 selected source-mapped rows. No full-spec sign-off.');
