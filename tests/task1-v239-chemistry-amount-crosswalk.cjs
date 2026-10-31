'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const audit=json('editorial/task1-v239-chemistry-amount-crosswalk.json');
const bank=json('chemistry_amount_applications_v239.json');
const deck=json('deck.json'),app=read('app.js'),sw=read('sw.js');
assert.equal(audit.version,'v239');assert.equal(bank.version,'v239');
assert.equal(deck.cards.length,3345);
assert.equal(bank.cards.length,19);
assert.equal(audit.requirements.length,39);
const selected=deck.cards.filter(c=>c.subject==='Chemistry'&&c.stage==='AS'&&c.mock===true&&c.active!==false&&Object.keys(audit.coreMockTopicInventory).includes(c.topic));
assert.equal(selected.length,96);
assert.equal(audit.coreMockTopicInventory.total,96);
assert.equal(audit.coreCardsFirstPass.length,96);
for(const [topic,count] of Object.entries(audit.coreMockTopicInventory)){
 if(topic==='total')continue;
 assert.equal(selected.filter(c=>c.topic===topic).length,count,'Core inventory changed: '+topic);
}
for(const old of audit.coreCardsFirstPass){
 const card=deck.cards.find(c=>c.id===old.id);
 assert(card&&card.subject==='Chemistry'&&card.stage==='AS'&&card.mock===true,'Missing historical card '+old.id);
 assert.equal(card.front,old.originalFront);assert.equal(card.back,old.originalBack);
}
const knownIds=new Set(deck.cards.map(c=>c.id)),suppIds=new Set(bank.cards.map(c=>c.id));
assert.equal(suppIds.size,19);
for(const point of audit.requirements){
 assert(/^3\\.1\\.2\\.[1-5]$/.test(point.specRef));
 for(const id of point.coreEvidenceIds)assert(knownIds.has(id),'Unverified core ID: '+id);
 for(const id of point.supplementEvidenceIds)assert(suppIds.has(id),'Unverified supplement ID: '+id);
 if(point.coreEvidenceIds.length===0&&point.supplementEvidenceIds.length===0)
  assert.equal(point.reviewLevel,'application_unverified');
}
assert.equal(audit.requirements.filter(x=>x.reviewLevel==='application_unverified').length,2);
assert.equal(audit.releaseGate.amountSubstanceFiveSubsectionsMapped,true);
for(const [key,value] of Object.entries(audit.releaseGate))
 if(key!=='amountSubstanceFiveSubsectionsMapped')assert.equal(value,false,'Uncertified completion: '+key);
const files=[...app.match(/const EXTRA_FLASHCARD_URLS=\\[([^\\]]+)\\];/)[1].matchAll(/'\\.\\/([^']+\\.json)'/g)].map(x=>x[1]);
assert.equal(files.length,30);
assert.equal(files[27],'chemistry_bonding_diagram_recall_v237.json');
assert.equal(files[28],'chemistry_atomic_tof_applications_v238.json');
assert.equal(files[29],'chemistry_amount_applications_v239.json');
assert(sw.includes("'./chemistry_amount_applications_v239.json'"));
assert(sw.includes('v239-amount-aqa-crosswalk'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
const prior=files.slice(0,29).flatMap(p=>json(p).cards||[]);
const oldIds=new Set([...deck.cards,...prior].map(c=>c.id));
const oldFronts=new Set([...deck.cards,...prior].filter(c=>c.subject==='Chemistry').map(c=>c.front.trim().toLowerCase()));
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);
assert(start>0&&end>start);
const judge=new Function('window',app.slice(start,end)+'\\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let nAccept=0,nReject=0;
for(const c of bank.cards){
 assert(!oldIds.has(c.id),'ID already exists '+c.id);
 assert(!oldFronts.has(c.front.trim().toLowerCase()),'Duplicate prompt '+c.id);
 oldFronts.add(c.front.trim().toLowerCase());
 assert.equal(c.subject,'Chemistry');assert.equal(c.stage,'AS');assert.equal(c.mock,true);
 assert.equal(c.taught,true);assert.equal(c.scope,'mock');assert.equal(c.active,true);assert.equal(c.strictRecall,true);
 assert(/^3\\.1\\.2\\.[1-5]$/.test(c.specRef));
 assert.equal(judge(c,c.back).status,'correct','Model rejected: '+c.id);
 for(const x of c.accept){assert.equal(judge(c,x).status,'correct','Correct variant rejected '+c.id+': '+x);nAccept++;}
 for(const x of c.reject){assert.equal(judge(c,x).status,'wrong','Incorrect variant accepted '+c.id+': '+x);nReject++;}
}
assert(nAccept>=36);assert(nReject>=38);
const lstart=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));');
const lend=app.indexOf(' const added=[',lstart);
assert(lstart>0&&lend>lstart);assert(app.slice(lstart,lend).includes('else if(index===29)'));
const loader=new Function('cards','extraFlashBanks',app.slice(lstart,lend)+'\\nreturn cards;');
const blanks=Array.from({length:30},()=>({cards:[]}));
blanks[29]=bank;
const loaded=loader([...deck.cards],blanks);
assert.equal(loaded.length,3345+19);
for(const c of bank.cards)assert(loaded.some(x=>x.id===c.id));
const invalid=Array.from({length:30},()=>({cards:[]}));
invalid[29]={cards:bank.cards.slice(0,6).map((c,i)=>({...c,...[
 {subject:'Physics'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'},{specRef:'3.2.2.1'}
][i]}))};
const blocked=loader([...deck.cards],invalid);
for(const c of invalid[29].cards)assert(!blocked.some(x=>x.id===c.id),'Invalid scope loaded');
console.log('PASS v239: 96 AS amount core cards first-pass inventoried, 39 specification checks, 19 original applied cards; old IDs, mock scope and offline cache retained. Task 1 is NOT finished.');
