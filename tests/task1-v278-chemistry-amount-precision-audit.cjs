'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js');
const bank=j('chemistry_amount_precision_applications_v278.json'),recall=j('chemistry_amount_sigfig_formula_recall_v278.json'),audit=j('editorial/task1-v278-chemistry-amount-selected-gap-evidence.json'),core=j('deck.json');
assert.equal(core.cards.length,3345);assert.equal(j('exam_questions.json').questions.length,1268);
assert.equal(bank.questions.length,5);assert.equal(recall.cards.length,14);
const qUrls=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const cUrls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert(qUrls.length>=41,'v278 Amount practice must retain source index 40 after newer supplements');assert.equal(qUrls[40],'chemistry_amount_precision_applications_v278.json');
assert(cUrls.length>=51,'v278 Amount recall must retain source index 50 after newer supplements');assert.equal(cUrls[50],'chemistry_amount_sigfig_formula_recall_v278.json');
for(const x of ['chemistry_amount_precision_applications_v278.json','chemistry_amount_sigfig_formula_recall_v278.json'])assert(sw.includes("'./"+x+"'"));
assert(sw.includes('-v278-amount-precision'));
const prior=[...core.cards,...cUrls.slice(0,50).flatMap(p=>j(p).cards||[])];
const existingId=new Set(prior.map(x=>x.id)),existingFront=new Set(prior.filter(x=>x.subject==='Chemistry').map(x=>String(x.front||'').trim().toLowerCase()));
const mstart=app.indexOf('function normalise('),mend=app.indexOf('function importantTokens(',mstart);assert(mstart>=0&&mend>mstart);
const judge=new Function('window',app.slice(mstart,mend)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let accepted=0,rejected=0;
for(const c of recall.cards){
 assert(!existingId.has(c.id),'Duplicate id '+c.id);existingId.add(c.id);
 assert(!existingFront.has(c.front.trim().toLowerCase()),'Duplicate card front '+c.front);existingFront.add(c.front.trim().toLowerCase());
 assert.equal(c.subject,'Chemistry');assert.equal(c.stage,'AS');assert.equal(c.topic,'Amount of substance');assert(['3.1.2.1','3.1.2.2','3.1.2.5'].includes(c.specRef));
 assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.scope,'mock');assert.equal(c.active,true);assert.equal(c.strictRecall,true);
 assert.equal(c.accept.length,2);assert.equal(c.reject.length,2);assert(c.accept.includes(c.back));
 for(const ans of c.accept){assert.equal(judge(c,ans).status,'correct','Valid answer '+c.id+' '+ans);accepted++;}
 for(const ans of c.reject){assert.equal(judge(c,ans).status,'wrong','Invalid answer '+c.id+' '+ans);rejected++;}
}
assert.equal(accepted,28);assert.equal(rejected,28);
const ls=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),le=app.indexOf(' const added=[',ls);assert(ls>0&&le>ls);
assert(app.slice(ls,le).includes('else if(index===50)'));
const load=new Function('cards','extraFlashBanks',app.slice(ls,le)+'\nreturn cards;');
const valid=Array.from({length:51},()=>({cards:[]}));valid[50]=recall;
assert.equal(load([...core.cards],valid).length,3359);
const invalid=Array.from({length:51},()=>({cards:[]}));
invalid[50]={cards:recall.cards.slice(0,7).map((x,i)=>({...x,...[{subject:'Physics'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'},{active:false},{specRef:'3.2.1'}][i]}))};
assert.equal(load([...core.cards],invalid).length,3345);
const beforeQ=new Set([...j('exam_questions.json').questions,...qUrls.slice(0,40).flatMap(p=>j(p).questions||[])].map(q=>q.id));
let marks=0;const newQ=new Set();
for(const q of bank.questions){
 assert(!beforeQ.has(q.id),'Collision '+q.id);assert(!newQ.has(q.id));newQ.add(q.id);
 assert.equal(q.subject,'Chemistry');assert.equal(q.level,'AS');assert.equal(q.topic,'Amount of substance');
 assert(['3.1.2.1','3.1.2.2','3.1.2.5'].includes(q.specRef));assert.equal(q.mock,true);assert.equal(q.taught,true);assert.equal(q.standalone,true);
 assert.equal(q.sourceVerified,false);assert.equal(q.verificationLevel,'original-exam-style');assert.equal(q.requiresWorking,true);
 assert.equal(q.markPoints.length,q.marks);assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 assert(q.prompt.includes('['+q.marks+' marks]'));assert(q.modelAnswer.length>170);marks+=q.marks;
}
assert.equal(marks,31);
const near=(a,b,t=1e-9)=>Math.abs(a-b)<=t;
const Mr=40.1+2*(14+3*16);
assert(near(Mr,164.1));
assert(near(.02*Mr,3.282));assert(near(.04*6.02e23,2.408e22,1e12));
const n=.683/106,concentration=n/(25/1000);
assert(near(n,.006443396226415094));assert(near(concentration,.2577358490566038));
assert(near(.3/2,.15));assert(near(.3*(24.3+16),12.09));assert(near(.18-.15,.03));
const mag=24.3+32.1+4*16,hydrateRatio=((6.15-3)/18)/(3/mag);
assert(near(mag,120.4));assert(near(hydrateRatio,7.02,.01));
const initial=.500*(50/1000),base=.100*(20/1000),left=base*(100/25),consumed=initial-left,carbonate=consumed/2,calciumMass=carbonate*100.1;
assert(near(initial,.025));assert(near(left,.008));assert(near(carbonate,.0085));
assert(near(calciumMass,.85085));assert(near(calciumMass/1.20*100,70.90416666666667));
assert.equal(audit.selectedRowCount,31);assert.equal(audit.selectedRows.length,31);
assert.deepEqual(audit.coreOnlyUnmappedRowsAtV239,['AOS-03','AOS-11']);
const evidence=[...core.cards,...cUrls.flatMap(p=>j(p).cards||[]),...j('exam_questions.json').questions,...qUrls.flatMap(p=>j(p).questions||[])];
const evidenceMap=new Map(evidence.map(x=>[x.id,x]));assert(evidenceMap.size>0);
for(const r of audit.selectedRows){assert(r.assessablePoint&&r.ref);for(const id of r.supplementEvidenceIds){assert(evidenceMap.has(id),'Missing evidence '+id);assert.equal(evidenceMap.get(id).specRef,r.ref,'Wrong spec subsection '+id);}}
for(const id of audit.coreOnlyUnmappedRowsAtV239){const row=audit.selectedRows.find(x=>x.id===id);assert.equal(row.coreEvidenceIds.length,0);assert(row.supplementEvidenceIds.length>=2);}
assert.equal(audit.supplementalEvidenceForBothCoreOnlyUnmappedRows,true);
for(const key of ['fullCoreDeckAnswersReviewed','allActiveSupplementAnswersIndependentlyVerified','allUnfamiliarApplicationMarkingVerified','allOfficialPaperSourcesCertified','fullChemistryMockSpecCertified','task1Complete'])assert.equal(audit[key],false);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v278: 14 strict AS Amount cards (28 accepted/28 rejected), 5 new original questions (31 marks), numerical models independently checked, all selected source IDs verified, missing CORE evidence clearly disclosed.');
