'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const audit=json('editorial/task1-v237-chemistry-bonding-crosswalk.json');
const bank=json('chemistry_bonding_diagram_recall_v237.json');
const deck=json('deck.json'),app=read('app.js'),sw=read('sw.js');
assert.equal(deck.cards.length,3345);assert.equal(audit.version,'v237');assert.equal(bank.version,'v237');
assert.equal(bank.cards.length,7);assert.equal(audit.requirements.length,29);
const all=deck.cards.filter(c=>c.subject==='Chemistry'&&c.mock===true&&c.active!==false);
const topics=audit.coreTopicLabelInventory;
for(const [topic,count] of Object.entries(topics)){
 if(topic==='total')continue;
 assert.equal(all.filter(c=>c.topic===topic).length,count,'Topic inventory changed: '+topic);
}
assert.equal(topics.total,180);assert.equal(Object.entries(topics).filter(([k])=>k!=='total').reduce((sum,[,v])=>sum+v,0),180);
const historicIds=new Set(),newIds=new Set(bank.cards.map(c=>c.id));
for(const point of audit.requirements){
 assert(/^3\.1\.3\.[1-7]$/.test(point.specRef));
 if(point.coreEvidenceIds.length===0)assert.equal(point.reviewLevel,'application_unverified');
 for(const id of point.coreEvidenceIds){
  const c=deck.cards.find(c=>c.id===id);
  assert(c&&c.subject==='Chemistry'&&c.mock===true&&c.active!==false&&c.front&&c.back,'Unverified evidence ID: '+id);
  historicIds.add(id);
 }
 for(const id of (point.supplementEvidenceIds||[]))assert(newIds.has(id),'Bad supplement evidence '+id);
}
assert.equal(historicIds.size,60);
assert.equal(audit.requirements.filter(x=>!x.coreEvidenceIds.length).length,1);
const gap=audit.requirements.find(x=>!x.coreEvidenceIds.length);
assert(/draw crystal diagrams/.test(gap.assessableRecallOrSkill));
assert.equal(gap.supplementEvidenceIds.length,6);
const startFix=app.indexOf('const V237_BOND_ANGLE_FRONT=');
const endFix=app.indexOf('/* v237 chemistry bond-angle prompt clarification end */',startFix);
assert(startFix>0&&endFix>startFix);
const apply=new Function('cardsToFix',app.slice(startFix,endFix)+'\nreturn applyV237ChemBondAngleClarity(cardsToFix);');
const ids=new Set(audit.clarifiedOldCards.map(x=>x.id));
assert.equal(ids.size,3);
const originals=audit.clarifiedOldCards.map(x=>({...deck.cards.find(c=>c.id===x.id)}));
const fixed=apply(originals);
for(const c of audit.clarifiedOldCards){
 const before=deck.cards.find(x=>x.id===c.id),after=fixed.find(x=>x.id===c.id);
 assert.equal(before.front,c.originalFront);assert.equal(before.back,c.back);
 assert.equal(after.front,c.newFront);assert.equal(after.back,before.back);
 assert(/no lone pairs/.test(after.front));
}
assert(app.includes('cards=applyV237ChemBondAngleClarity('));
assert(app.includes('else if(index===27)'));
assert(sw.includes("'./chemistry_bonding_diagram_recall_v237.json'"));
assert(sw.includes('v237-bonding-aqa-crosswalk'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
const files=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
assert.equal(files.length,28);assert.equal(files[27],'chemistry_bonding_diagram_recall_v237.json');
const prior=files.slice(0,27).flatMap(name=>json(name).cards||[]);
const known=new Set([...deck.cards,...prior].map(c=>c.id));
const oldFronts=new Set([...deck.cards,...prior].filter(c=>c.subject==='Chemistry').map(c=>c.front.trim().toLowerCase()));
let right=0,wrong=0;
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);
const judge=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const c of bank.cards){
 assert(!known.has(c.id),'Reused ID '+c.id);
 const front=c.front.trim().toLowerCase();
 assert(!oldFronts.has(front),'Duplicate prompt '+c.id);oldFronts.add(front);
 assert.equal(c.subject,'Chemistry');assert.equal(c.stage,'AS');assert.equal(c.mock,true);
 assert.equal(c.taught,true);assert.equal(c.active,true);assert.equal(c.scope,'mock');
 assert(['3.1.3.2','3.1.3.4'].includes(c.specRef));
 assert.equal(c.accept.length,4);assert.equal(c.reject.length,2);
 assert.equal(judge(c,c.back).status,'correct');
 for(const x of c.accept){assert.equal(judge(c,x).status,'correct','Valid '+c.id+': '+x);right++;}
 for(const x of c.reject){assert.equal(judge(c,x).status,'wrong','Invalid '+c.id+': '+x);wrong++;}
}
assert.equal(right,28);assert.equal(wrong,14);
const lstart=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));');
const lend=app.indexOf(' const added=[',lstart);
const load=new Function('cards','extraFlashBanks',app.slice(lstart,lend)+'\nreturn cards;');
const banks=Array.from({length:28},()=>({cards:[]}));banks[27]=bank;
const out=load([...deck.cards],banks);
assert.equal(out.length,3352);
for(const c of bank.cards)assert(out.some(x=>x.id===c.id));
const invalid=Array.from({length:28},()=>({cards:[]}));
invalid[27]={cards:bank.cards.slice(0,5).map((c,i)=>({...c,...[
 {subject:'Maths'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'}
][i]}))};
const blocked=load([...deck.cards],invalid);
for(const c of invalid[27].cards)assert(!blocked.some(x=>x.id===c.id));
assert.equal(audit.completion.actualStructureDiagramCompetenceVerified,false);
assert.equal(audit.completion.fullThreeSubjectMockVerified,false);
console.log('PASS v237: 29 AQA bonding points mapped, 60 core evidence cards, 7 diagram recall additions, 3 ambiguous legacy shape fronts clarified, 28 valid and 14 invalid variants; drawing skill still requires examination.');
