'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const audit=json('editorial/task1-v232-maths-year1-pure-scope.json');
const bank=json('maths_first_mock_pure_precision_v232.json');
const deck=json('deck.json'),app=read('app.js'),sw=read('sw.js');
assert.equal(deck.cards.length,3345);
assert.equal(audit.version,'v232');
assert.equal(bank.version,'v232');
assert.equal(bank.cards.length,24);
assert.equal(audit.exclusions.previousCoreEligible,113);
assert.equal(audit.exclusions.currentCoreEligible,106);
assert.equal(audit.inventoried.stamps.length,155);
assert.equal(audit.inventoried.coreCount,106);
assert.equal(audit.inventoried.supplementCount,49);
assert.equal(audit.inventoried.postNewCards,179);
assert.equal(audit.specCrosswalk.length,9);
for(const v of Object.values(audit.completionGates))assert.equal(v,false);
const names=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
assert.equal(names.length,27);assert.equal(names[26],'maths_first_mock_pure_precision_v232.json');
assert(sw.includes("'./maths_first_mock_pure_precision_v232.json'"));assert(sw.includes('v232-pure-mock'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
const excl=app.match(/const MOCK_MATHS_YEAR2_EXCLUDED_IDS=new Set\(\[[^\]]+\]\);/);
const eligibility=app.match(/function mockEligibleCard\(c\)\{[\s\S]*?\n\}/);
assert(excl&&eligibility);
const isEligible=vm.runInNewContext(excl[0]+'\n'+eligibility[0]+'\nmockEligibleCard');
for(const id of [...audit.exclusions.previouslyExcludedCore,...audit.exclusions.newlyExcludedCore]){
 const card=deck.cards.find(x=>x.id===id);assert(card,'excluded source card missing '+id);
 assert.equal(isEligible(card),false,'Year 2 function card in mock: '+id);
 assert.equal(card.active!==false,true,'excluded source card deleted/deactivated: '+id);
}
assert.equal(deck.cards.filter(c=>c.subject==='Maths'&&c.active!==false&&isEligible(c)).length,106);
const seen=new Set(deck.cards.map(x=>x.id));
for(const name of names.slice(0,26)){for(const c of json(name).cards||[])seen.add(c.id);}
const oldFronts=new Set([...deck.cards,...names.slice(0,26).flatMap(name=>json(name).cards||[])]
.filter(x=>x.subject==='Maths').map(x=>String(x.front||'').trim().toLowerCase()));
for(let i=0;i<bank.cards.length;i++){
 const c=bank.cards[i];
 assert.equal(c.id,'task1_v232_math_pure_'+String(i+1).padStart(2,'0'));
 assert(!seen.has(c.id),'duplicate id '+c.id);
 const f=c.front.trim().toLowerCase();assert(!oldFronts.has(f),'duplicate prompt '+c.id);oldFronts.add(f);
 assert.equal(c.subject,'Maths');assert.equal(c.stage,'AS');assert.equal(c.mock,true);
 assert.equal(c.scope,'mock');assert.equal(c.taught,true);assert.equal(c.active,true);
 assert.equal(c.strictRecall,true);assert.equal(isEligible(c),true);
 assert.equal(c.accept.length,3);assert.equal(c.reject.length,2);assert(c.accept.includes(c.back));
 assert(!/\b(radians?|statistics|mechanics|chain rule|contradiction)\b/i.test(c.topic+' '+c.front+' '+c.back));
}
const hash=c=>{const s=[c.id,c.front,c.back,c.stage,c.mock,c.active].join('\n');let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return(h>>>0).toString(16).padStart(8,'0');};
for(const snap of audit.inventoried.stamps){
 const file=snap.source==='deck.json'?deck:json(snap.source);
 const c=file.cards.find(x=>x.id===snap.id);assert(c,'inventory entry missing '+snap.id);
 assert.equal(snap.level,'scope_and_identity_inventory');assert.equal(snap.stamp,hash(c),'historical card changed '+snap.id);
}
const p=app.indexOf('function normalise('),q=app.indexOf('function importantTokens(',p);assert(p>0&&q>p);
const judge=new Function('window',app.slice(p,q)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let accepted=0,rejected=0;
for(const c of bank.cards){
 for(const a of c.accept){assert.equal(judge(c,a).status,'correct','correct answer rejected '+c.id+': '+a);accepted++;}
 for(const a of c.reject){assert.notEqual(judge(c,a).status,'correct','incorrect answer accepted '+c.id+': '+a);rejected++;}
 assert.equal(judge(c,'').status,'neutral');
}
assert.equal(accepted,72);assert.equal(rejected,48);
const lstart=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),lend=app.indexOf(' const added=[',lstart);
assert(lstart>0&&lend>lstart);
const loader=app.slice(lstart,lend);assert(loader.includes('else if(index===26)'));
const load=new Function('cards','extraFlashBanks',loader+'\nreturn cards;');
const banks=Array.from({length:27},()=>({cards:[]}));banks[26]=bank;
const loaded=load([...deck.cards],banks);
assert.equal(loaded.length,3369);assert.equal(new Set(loaded.map(x=>x.id)).size,3369);
const invalid=Array.from({length:27},()=>({cards:[]}));
invalid[26]={cards:bank.cards.slice(0,5).map((c,i)=>({...c,...[
 {subject:'Physics'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'}
][i]}))};
const blocked=load([...deck.cards],invalid);
for(let i=0;i<5;i++)assert(!blocked.some(x=>x.id===bank.cards[i].id),'out-of-scope supplement card leaked');
const legacy=json('editorial/task1-v228-mock-review-ledger.json');
assert.equal(legacy.counts.MathsFirstPassFirstMock,162,'history was rewritten');
assert.equal(legacy.completionGates.task1Complete,false);
console.log('PASS v232: filtered seven additional Year 2 inverse/composite cards without deleting them, 106 eligible core and 49 supplements inventoried, 24 mock-only AS Pure cards, 72 positive + 48 negative evaluator cases, offline/progress unchanged, completion gate open.');
