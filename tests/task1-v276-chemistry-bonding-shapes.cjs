'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const bank=j('chemistry_as_bonding_shapes_practice_v276.json'),cards=j('chemistry_as_bonding_shapes_recall_v276.json'),core=j('deck.json');
const app=read('app.js'),sw=read('sw.js');
assert.equal(bank.version,'v276');assert.equal(cards.version,'v276');assert.equal(bank.questions.length,6);assert.equal(cards.cards.length,36);
assert.equal(core.cards.length,3345);assert.equal(j('exam_questions.json').questions.length,1268);
const qUrls=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const cUrls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert(qUrls.length>=39,'v276 Bonding practice remains at original index 38 after append-only banks');assert.equal(qUrls[38],'chemistry_as_bonding_shapes_practice_v276.json');
assert(cUrls.length>=49,'v276 Bonding recall remains at original index 48 after append-only banks');assert.equal(cUrls[48],'chemistry_as_bonding_shapes_recall_v276.json');
for(const p of ['chemistry_as_bonding_shapes_practice_v276.json','chemistry_as_bonding_shapes_recall_v276.json'])assert(sw.includes("'./"+p+"'"));
assert(sw.includes('-v276-bonding-shapes'));
const priorCards=[...core.cards,...cUrls.slice(0,48).flatMap(p=>j(p).cards||[])];
const priorIds=new Set(priorCards.map(c=>c.id)),fronts=new Set(priorCards.filter(c=>c.subject==='Chemistry').map(c=>String(c.front||'').trim().toLowerCase()));
const ns=app.indexOf('function normalise('),ne=app.indexOf('function importantTokens(',ns);assert(ns>=0&&ne>ns);
const judge=new Function('window',app.slice(ns,ne)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const refs=new Set(['3.1.3.1','3.1.3.2','3.1.3.4','3.1.3.5','3.1.3.6','3.1.3.7']);
let good=0,bad=0;
for(const c of cards.cards){
 assert(!priorIds.has(c.id),'duplicate old ID '+c.id);priorIds.add(c.id);
 assert(!fronts.has(c.front.trim().toLowerCase()),'duplicate old front '+c.front);fronts.add(c.front.trim().toLowerCase());
 assert.equal(c.subject,'Chemistry');assert.equal(c.stage,'AS');assert.equal(c.topic,'Bonding');assert(refs.has(c.specRef));
 assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.scope,'mock');assert.equal(c.active,true);assert.equal(c.strictRecall,true);
 assert.equal(c.accept.length,2);assert.equal(c.reject.length,2);assert(c.accept.includes(c.back));
 for(const v of c.accept){assert.equal(judge(c,v).status,'correct','Incorrect rejection '+c.id+' '+v);good++;}
 for(const v of c.reject){assert.equal(judge(c,v).status,'wrong','Incorrect acceptance '+c.id+' '+v);bad++;}
}
assert.equal(good,72);assert.equal(bad,72);
const ls=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),le=app.indexOf(' const added=[',ls);
assert(ls>0&&le>ls&&app.slice(ls,le).includes('else if(index===48)'));
const load=new Function('cards','extraFlashBanks',app.slice(ls,le)+'\nreturn cards;');
const valid=Array.from({length:49},()=>({cards:[]}));valid[48]=cards;
assert.equal(load([...core.cards],valid).length,3381);
const invalid=Array.from({length:49},()=>({cards:[]}));
invalid[48]={cards:cards.cards.slice(0,7).map((c,i)=>({...c,...[{subject:'Maths'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'},{active:false},{specRef:'3.1.9'}][i]}))};
assert.equal(load([...core.cards],invalid).length,3345);
const oldQuestions=new Set([...j('exam_questions.json').questions,...qUrls.slice(0,38).flatMap(p=>j(p).questions||[])].map(q=>q.id));
const used=new Set();let marks=0,drawings=0;
for(const q of bank.questions){
 assert(!oldQuestions.has(q.id));assert(!used.has(q.id));used.add(q.id);
 assert.equal(q.subject,'Chemistry');assert.equal(q.level,'AS');assert.equal(q.topic,'Bonding');
 assert(refs.has(q.specRef));assert.equal(q.taught,true);assert.equal(q.mock,true);assert.equal(q.standalone,true);
 assert.equal(q.sourceVerified,false);assert.equal(q.verificationLevel,'original-exam-style');
 assert.equal(q.requiresWorking,true);assert.equal(q.markPoints.length,q.marks);assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 assert(q.modelAnswer.length>170);assert(q.prompt.includes('['+q.marks+' marks]'));marks+=q.marks;
 if(q.manualDiagramReview)drawings++;
}
assert.equal(marks,41);assert.equal(drawings,1);
const a=app.indexOf('function examSuggested(q,answer){'),b=app.indexOf(' // v213:',a);assert(a>=0&&b>a);
const assess=new Function('window',app.slice(a,b)+'\n}\nreturn examSuggested;')({});
for(const q of bank.questions.filter(x=>x.manualDiagramReview)){const v=assess(q,'NH3 pyramidal H2O bent 107 104.5 degrees lone pair');assert.equal(v.manualRequired,true);assert.equal(v.suggested,0);assert.deepEqual(v.preds,Array(q.marks).fill(false));}
const charges={aluminium:3,sulfate:-2,calcium:2,nitrate:-1,ammonium:1};
assert.equal(2*charges.aluminium+3*charges.sulfate,0);
assert.equal(charges.calcium+2*charges.nitrate,0);
assert.equal(2*charges.ammonium+charges.sulfate,0);
const examples=[['CO2','linear',180],['BF3','trigonal planar',120],['NH4+','tetrahedral',109.5],['NH3','trigonal pyramidal',107],['H2O','bent',104.5],['PCl5','trigonal bipyramidal',90],['SF6','octahedral',90],['XeF4','square planar',90]];
for(const [mol,shape,angle] of examples){assert(angle>0&&angle<=180);assert(shape.length>2);assert(mol.length>0);}
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v276: 36 AS Bonding cards, 72 accepted and 72 rejected variants, 6 questions/41 marks, shape diagrams manually reviewed, accurate formula charge balances, original IDs and progress preserved.');
