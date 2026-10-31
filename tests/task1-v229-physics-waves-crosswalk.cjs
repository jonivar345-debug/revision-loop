'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const bank=json('physics_waves_crosswalk_recall_v229.json');
const audit=json('editorial/task1-v229-physics-waves-firstpass.json');
const deck=json('deck.json');
const app=read('app.js'),sw=read('sw.js');
assert.equal(bank.version,'v229');assert.equal(bank.cards.length,14);
assert.equal(audit.version,'v229');
assert.deepEqual(audit.counts,{coreWavesTopicCards:118,coreScopeMock:111,coreScopeSecondary:7,supplementV225:7,supplementV226:13,newMockFlashcards:14,examQuestionsAdded:0});
assert.equal(audit.coreReviewedSnapshots.length,118);
assert.equal(audit.supplementReviewedSnapshots.length,20);
for(const flag of Object.values(audit.completionGate))assert.equal(flag,false);
assert.equal(deck.cards.length,3345);
const fingerprint=c=>{
 const s=[c.id,c.front,c.back,c.stage,c.mock,c.active].join('\\n');let h=2166136261;
 for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);
 return(h>>>0).toString(16).padStart(8,'0');
};
const sources={'deck.json':deck,'physics_optical_fibre_precision_recall_v225.json':json('physics_optical_fibre_precision_recall_v225.json'),'physics_waves_reasoning_recall_v226.json':json('physics_waves_reasoning_recall_v226.json')};
for(const snap of [...audit.coreReviewedSnapshots,...audit.supplementReviewedSnapshots]){
 const source=sources[snap.source];assert(source,'unknown source '+snap.source);
 const c=source.cards.find(x=>x.id===snap.id);assert(c,'snapshot card disappeared: '+snap.id);
 assert.equal(fingerprint(c),snap.stamp,'card changed after first pass, re-review: '+snap.id);
}
const names=[...app.match(/const EXTRA_FLASHCARD_URLS=\\[([^\\]]+)\\];/)[1].matchAll(/'\\.\\/([^']+\\.json)'/g)].map(x=>x[1]);
assert.equal(names[23],'physics_waves_crosswalk_recall_v229.json');
assert(sw.includes("'./physics_waves_crosswalk_recall_v229.json'"));
assert(sw.includes('v229-waves-firstpass'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
const old=[...deck.cards,...names.slice(0,23).flatMap(n=>json(n).cards||[])];
const oldIds=new Set(old.map(x=>x.id));
const fronts=new Set(old.filter(x=>x.subject==='Physics').map(x=>String(x.front||'').trim().toLowerCase()));
for(let i=0;i<bank.cards.length;i++){
 const c=bank.cards[i];
 assert.equal(c.id,'task1_v229_phy_waves_'+String(i+1).padStart(2,'0'));
 assert(!oldIds.has(c.id),'duplicate ID '+c.id);
 const f=c.front.trim().toLowerCase();assert(!fronts.has(f),'duplicate front '+c.id);fronts.add(f);
 assert.equal(c.subject,'Physics');assert.equal(c.stage,'AS');assert.equal(c.mock,true);
 assert.equal(c.taught,true);assert.equal(c.active,true);assert.equal(c.scope,'mock');
 assert.equal(c.strictRecall,true);assert(c.specRef.startsWith('3.3.'));
 assert.equal(c.accept.length,3);assert.equal(c.reject.length,2);assert(c.accept.includes(c.back));
}
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);
assert(start>0&&end>start);
const judge=new Function('window',app.slice(start,end)+'\\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let accept=0,reject=0;
for(const c of bank.cards){
 for(const a of c.accept){assert.equal(judge(c,a).status,'correct','correct alternative rejected '+c.id+': '+a);accept++;}
 for(const a of c.reject){assert.notEqual(judge(c,a).status,'correct','wrong answer credited '+c.id+': '+a);reject++;}
 assert.equal(judge(c,'').status,'neutral');
}
assert.equal(accept,42);assert.equal(reject,28);
const lstart=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));');
const lend=app.indexOf(' const added=[',lstart);assert(lstart>=0&&lend>lstart);
const loader=app.slice(lstart,lend);assert(loader.includes('else if(index===23)'));
const load=new Function('cards','extraFlashBanks',loader+'\\nreturn cards;');
const blanks=Array.from({length:24},()=>({cards:[]}));blanks[23]=bank;
const loaded=load([...deck.cards],blanks);
assert.equal(loaded.length,3359);assert.equal(new Set(loaded.map(x=>x.id)).size,3359);
const bad=Array.from({length:24},()=>({cards:[]}));
bad[23]={cards:bank.cards.slice(0,5).map((x,i)=>({...x,...[
 {subject:'Chemistry'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'}
][i]}))};
const blocked=load([...deck.cards],bad);
for(let i=0;i<5;i++)assert(!blocked.some(c=>c.id===bank.cards[i].id),'out-of-scope card added: '+i);
const eligible=app.match(/function mockEligibleCard\\(c\\)\\{[\\s\\S]*?\\n\\}/);
assert(eligible);
const mockEligible=vm.runInNewContext("const MOCK_MATHS_YEAR2_EXCLUDED_IDS = new Set(['math_function_composite','math_inverse_condition','task1_v136_063']);\\n"+eligible[0]+"\\nmockEligibleCard");
for(const c of bank.cards)assert(mockEligible(c),'new card not in mock: '+c.id);
assert.equal(loaded.filter(x=>x.subject==='Maths').length,deck.cards.filter(x=>x.subject==='Maths').length);
console.log('PASS v229: 138 source Waves cards fingerprinted, 14 new AS mock cards, 42 accepted and 28 rejected answers, index 23 loader/eligibility/offline, prior deck and progress preserved, no full-spec certification.');
