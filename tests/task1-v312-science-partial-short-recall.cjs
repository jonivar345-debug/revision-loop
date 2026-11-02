'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),core=j('deck.json');
const newBank=j('science_partial_skill_short_recall_v312.json');
const urls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
assert.equal(urls.length,56);
assert.equal(urls[55],'science_partial_skill_short_recall_v312.json');
assert(sw.includes("'./science_partial_skill_short_recall_v312.json'"),'New flashcards must work offline');
assert.equal(newBank.cards.length,31);
const oldCards=[...core.cards,...urls.slice(0,55).flatMap(path=>j(path).cards||[])];
assert.equal(oldCards.length,4313);
const oldIDs=new Set(oldCards.map(c=>c.id));
const oldFronts=new Set(oldCards.map(c=>String(c.front||'').toLowerCase().trim()));
const start=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));');
const end=app.indexOf(' const added=[',start);
assert(start>0&&end>start,'Use production loader');
const loader=new Function('cards','extraFlashBanks',app.slice(start,end)+'\nreturn cards;');
const all=loader([...core.cards],urls.map(j));
assert.equal(all.length,4344,'Original 4313 plus 31 vetted short cards');
assert.equal(new Set(all.map(c=>c.id)).size,4344);
const a=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),b=app.indexOf('function startMockSession(){',a);
assert(a>=0&&b>a);
const eligible=new Function(app.slice(a,b)+'\nreturn mockEligibleCard;')();
const mock=all.filter(eligible);
assert.equal(mock.length,3372,'Original 3341 mock cards plus 31');
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(k=>[k,mock.filter(c=>c.subject===k).length])),{Physics:1125,Chemistry:1916,Maths:331});
const mStart=app.indexOf('function normalise('),mEnd=app.indexOf('function importantTokens(',mStart);
const mark=new Function('window',app.slice(mStart,mEnd)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const linked=new Set(),skills=new Map(),seenFronts=new Set();
let accepted=0,rejected=0,physics=0,chem=0;
for(const c of newBank.cards){
 assert(!oldIDs.has(c.id),'No historical card IDs changed '+c.id);
 assert(c.id.startsWith('task1_v312_'),'Exact new ID prefix '+c.id);
 assert(!oldFronts.has(c.front.toLowerCase().trim()),'New question duplicates an existing exact front '+c.id);
 assert(!seenFronts.has(c.front.toLowerCase().trim()),'Duplicate new front '+c.id);seenFronts.add(c.front.toLowerCase().trim());
 assert(c.front.length<=125&&c.back.length<=180,'Not a long-answer disguised flashcard '+c.id);
 assert(c.strictRecall&&c.mock&&c.taught&&c.active&&c.scope==='mock'&&c.kind==='short');
 assert(eligible(c),'Must appear in the school mock '+c.id);
 assert(c.accept.includes(c.back),'Model answer in accepted list '+c.id);
 assert(c.accept.length>=3&&c.reject.length>=2,'Vetted variants supplied '+c.id);
 assert(!linked.has(c.id));linked.add(c.id);
 skills.set(c.skillId,(skills.get(c.skillId)||0)+1);
 if(c.subject==='Physics'){physics++;assert.equal(c.stage,'AS');assert(/^3\.4\./.test(c.specRef));}
 else{chem++;assert.equal(c.subject,'Chemistry');assert(['3.1.4.2','3.1.8.2'].includes(c.specRef));}
 assert.equal(mark(c,c.back).status,'correct','Model answer must grade '+c.id);
 for(const ans of c.accept){const result=mark(c,ans);assert.equal(result.status,'correct',c.id+' accepted '+ans+' got '+JSON.stringify(result));accepted++;}
 for(const ans of c.reject){const result=mark(c,ans);assert.equal(result.status,'wrong',c.id+' rejected '+ans+' got '+JSON.stringify(result));rejected++;}
}
assert.equal(physics,25);assert.equal(chem,6);
assert.deepEqual(Object.fromEntries([...skills].sort()),{C053:4,C067:2,P003:2,P014:1,P017:4,P019:3,P024:3,P026:3,P031:3,P043:3,P046:3});
const special=Object.fromEntries(newBank.cards.map(c=>[c.front,c.back]));
assert.equal(special['For a drop from rest, what is the gradient of displacement s against t²?'],'g/2.');
assert.equal(special['What are the units of standard molar entropy S°?'],'J K⁻¹ mol⁻¹.');
// Scope mutations must be rejected by the production loader, not just our proposed selector.
const empty=Array.from({length:56},()=>({cards:[]}));
empty[55]={cards:newBank.cards.map((c,i)=>({...c,...[
 {subject:'Maths'},{stage:'A2',subject:'Physics'},{stage:'A2',specRef:'3.4.1.1'},
 {mock:false},{taught:false},{scope:'full'},{active:false},
 {specRef:'3.1.10'},{kind:'essay'},{strictRecall:false},{skillId:'BAD'}
][i%10]}))};
const invalid=loader([...core.cards],empty);
assert.equal(invalid.length,3345,'Unapproved substituted cards must be discarded');
console.log('PASS v312: '+all.length+' loaded and '+mock.length+' mock cards; 31 concise new cards ('+physics+' Physics, '+chem+' Chemistry) across 11 skill gaps; '+accepted+' valid and '+rejected+' wrong responses tested against actual website marker; no prior IDs overwritten; scope and offline manifest checked.');
