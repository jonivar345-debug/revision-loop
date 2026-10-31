'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=path=>fs.readFileSync(path,'utf8'),json=path=>JSON.parse(read(path));
const audit=json('editorial/task1-v238-chemistry-atomic-spec-crosswalk.json');
const bank=json('chemistry_atomic_tof_applications_v238.json');
const deck=json('deck.json'),app=read('app.js'),sw=read('sw.js');
assert.equal(audit.version,'v238');assert.equal(bank.version,'v238');assert.equal(deck.cards.length,3345);
assert.equal(bank.cards.length,11);
assert.equal(audit.requirements.length,29);
assert.equal(audit.coreMockTopicInventory.total,88);
for(const [topic,count] of Object.entries(audit.coreMockTopicInventory)){
 if(topic==='total')continue;
 assert.equal(deck.cards.filter(c=>c.subject==='Chemistry'&&c.stage==='AS'&&c.mock===true&&c.active!==false&&c.topic===topic).length,count);
}
assert.equal(audit.coreCardsFirstPass.length,88);
const evidence=new Set();
for(const x of audit.coreCardsFirstPass){
 const c=deck.cards.find(card=>card.id===x.id);
 assert(c&&c.subject==='Chemistry'&&c.stage==='AS'&&c.mock===true&&c.active!==false,'Invalid old card '+x.id);
 assert.equal(c.front,x.originalFront);assert.equal(c.back,x.originalBack);
}
const supplemental=new Set(bank.cards.map(c=>c.id));
for(const x of audit.requirements){
 assert(/^3\.1\.1\.[1-3]$/.test(x.ref));
 assert(x.coreEvidenceIds.length>0);
 for(const id of x.coreEvidenceIds){const c=deck.cards.find(c=>c.id===id);assert(c&&c.subject==='Chemistry'&&c.mock===true&&c.active!==false,'Unverified AQA card evidence '+id);evidence.add(id);}
 for(const id of x.supplementEvidenceIds)assert(supplemental.has(id),'Unverified v238 card evidence '+id);
}
assert.equal(evidence.size,53);
assert.equal(audit.releaseGate.atomicThreeSubsectionsMapped,true);
for(const [k,v] of Object.entries(audit.releaseGate))if(k!=='atomicThreeSubsectionsMapped')assert.equal(v,false,'Unverified completion '+k);
assert.equal(audit.knownRuntimeCorrections.length,4);
assert(app.includes('cards=applyV238MolecularIonClarity('));
const clarityStart=app.indexOf('const V238_MOLECULAR_ION_PRECISION=');
const clarityEnd=app.indexOf('/* v238 molecular ion clarity end */',clarityStart);
assert(clarityStart>0&&clarityEnd>clarityStart);
const applyCorrection=new Function('core',app.slice(clarityStart,clarityEnd)+'\nreturn applyV238MolecularIonClarity(core);');
const before=deck.cards.find(c=>c.id==='task1_chem_009');
const corrected=applyCorrection([{...before}])[0];
assert.equal(corrected.id,before.id);assert.equal(corrected.mock,before.mock);
assert(/singly charged/.test(corrected.front));
assert(/1\+ molecular ion/.test(corrected.back));
assert.equal(before.back,'The relative molecular mass of the molecular ion.');
assert.equal(app.includes("PROGRESS_KEY='revisionLoopProgress5'"),true);
assert.equal(app.includes("PROFILE_KEY='revisionLoopProfile11'"),true);
assert.equal(app.includes("SETTINGS_KEY='revisionLoopSettings11'"),true);
assert(sw.includes("'./chemistry_atomic_tof_applications_v238.json'"));
assert(sw.includes('v238-atomic-tof-crosswalk'));
const names=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
assert.equal(names.length,29);assert.equal(names[28],'chemistry_atomic_tof_applications_v238.json');
const known=new Set([...deck.cards,...names.slice(0,28).flatMap(n=>json(n).cards||[])].map(c=>c.id));
const frontSet=new Set([...deck.cards,...names.slice(0,28).flatMap(n=>json(n).cards||[])].filter(c=>c.subject==='Chemistry').map(c=>c.front.trim().toLowerCase()));
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);
const judge=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let accepted=0,rejected=0;
for(const c of bank.cards){
 assert(!known.has(c.id),'Reused ID '+c.id);
 assert(!frontSet.has(c.front.trim().toLowerCase()),'Exact duplicate old prompt '+c.id);
 frontSet.add(c.front.trim().toLowerCase());
 assert.equal(c.subject,'Chemistry');assert.equal(c.stage,'AS');
 assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.active,true);assert.equal(c.scope,'mock');
 assert(/^3\.1\.1\.[23]$/.test(c.specRef));assert.equal(c.strictRecall,true);
 assert.equal(judge(c,c.back).status,'correct');
 for(const x of c.accept){assert.equal(judge(c,x).status,'correct','Valid rejected '+c.id+': '+x);accepted++;}
 for(const x of c.reject){assert.equal(judge(c,x).status,'wrong','Invalid accepted '+c.id+': '+x);rejected++;}
}
assert.equal(accepted,33);assert.equal(rejected,23);
assert.equal(judge(corrected,corrected.back).status,'correct');
for(const x of corrected.accept)assert.equal(judge(corrected,x).status,'correct');
for(const x of corrected.reject)assert.equal(judge(corrected,x).status,'wrong');
const lstart=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));');
const lend=app.indexOf(' const added=[',lstart);
assert(lstart>0&&lend>lstart);assert(app.slice(lstart,lend).includes('else if(index===28)'));
const loader=new Function('cards','extraFlashBanks',app.slice(lstart,lend)+'\nreturn cards;');
const blanks=Array.from({length:29},()=>({cards:[]}));blanks[28]=bank;
const loaded=loader([...deck.cards],blanks);
assert.equal(loaded.length,3356);
for(const c of bank.cards)assert(loaded.some(q=>q.id===c.id));
const invalid=Array.from({length:29},()=>({cards:[]}));
invalid[28]={cards:bank.cards.slice(0,5).map((c,i)=>({...c,...[
 {subject:'Physics'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'}
][i]}))};
const blocked=loader([...deck.cards],invalid);
for(const c of invalid[28].cards)assert(!blocked.some(x=>x.id===c.id));
console.log('PASS v238: 88 AS atomic core cards first-pass reviewed, 29 AQA evidence rows, 53 distinct core IDs, 11 new cards, 33 accepts and 23 rejects, old molecular-ion qualification corrected, saved IDs retained. Full Task 1 audit remains incomplete.');
