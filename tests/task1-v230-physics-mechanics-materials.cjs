'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const bank=json('physics_mechanics_cross_spec_recall_v230.json');
const audit=json('editorial/task1-v230-mechanics-materials-inventory.json');
const deck=json('deck.json');
const app=read('app.js'),sw=read('sw.js');
assert.equal(bank.version,'v230');assert.equal(bank.cards.length,20);assert.equal(audit.version,'v230');
assert.equal(audit.inventory.coreRelevantTopicLabelCount,254);
assert.equal(audit.inventory.coreMarkedMockScope,248);
assert.equal(audit.inventory.coreAdditionalSecondary,6);
assert.equal(audit.inventory.cardStamps.length,254);
assert.equal(audit.specCrosswalk.length,10);
assert.equal(audit.answersCheckedInNewBank.acceptedVariants,60);
assert.equal(audit.answersCheckedInNewBank.rejectedVariants,40);
for(const flag of Object.values(audit.fullCertification))assert.equal(flag,false);
for(const x of audit.specCrosswalk){assert.equal(x.fullLeftColumnCoverageVerified,false);assert.equal(x.allAnswersIndividuallyExaminerReviewed,false);}
assert.equal(deck.cards.length,3345);
const hash=c=>{const s=[c.id,c.front,c.back,c.stage,c.mock,c.active].join('\n');let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return(h>>>0).toString(16).padStart(8,'0')};
for(const snap of audit.inventory.cardStamps){const c=deck.cards.find(x=>x.id===snap.id);assert(c,'missing old card '+snap.id);assert.equal(snap.level,'inventory_only');assert.equal(hash(c),snap.stamp,'old card changed '+snap.id);}
const names=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
assert.equal(names[24],'physics_mechanics_cross_spec_recall_v230.json');
assert(sw.includes("'./physics_mechanics_cross_spec_recall_v230.json'"));
assert(sw.includes('v230-mechanics-materials'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
const old=[...deck.cards,...names.slice(0,24).flatMap(n=>json(n).cards||[])];
const oldIds=new Set(old.map(x=>x.id));
const oldFronts=new Set(old.filter(x=>x.subject==='Physics').map(x=>String(x.front||'').trim().toLowerCase()));
for(let i=0;i<bank.cards.length;i++){
 const c=bank.cards[i];assert.equal(c.id,'task1_v230_phy_mech_'+String(i+1).padStart(2,'0'));
 assert(!oldIds.has(c.id),'duplicate ID '+c.id);
 const f=c.front.trim().toLowerCase();assert(!oldFronts.has(f),'exact duplicate prompt '+c.id);oldFronts.add(f);
 assert.equal(c.subject,'Physics');assert.equal(c.stage,'AS');assert.equal(c.active,true);
 assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.scope,'mock');assert.equal(c.strictRecall,true);
 assert(/^3\.4\.(1|2)\./.test(c.specRef));
 assert.equal(c.accept.length,3);assert.equal(c.reject.length,2);assert(c.accept.includes(c.back));
}
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);assert(start>0&&end>start);
const judge=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let accept=0,reject=0;
for(const c of bank.cards){
 for(const ans of c.accept){assert.equal(judge(c,ans).status,'correct','rejected valid '+c.id+' '+ans);accept++;}
 for(const ans of c.reject){assert.notEqual(judge(c,ans).status,'correct','credited invalid '+c.id+' '+ans);reject++;}
 assert.equal(judge(c,'').status,'neutral');
}
assert.equal(accept,60);assert.equal(reject,40);
const lstart=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));');
const lend=app.indexOf(' const added=[',lstart);assert(lstart>=0&&lend>lstart);
const loader=app.slice(lstart,lend);assert(loader.includes('else if(index===24)'));
const load=new Function('cards','extraFlashBanks',loader+'\nreturn cards;');
const blanks=Array.from({length:25},()=>({cards:[]}));blanks[24]=bank;
const loaded=load([...deck.cards],blanks);
assert.equal(loaded.length,3365);assert.equal(new Set(loaded.map(x=>x.id)).size,3365);
const bad=Array.from({length:25},()=>({cards:[]}));
bad[24]={cards:bank.cards.slice(0,5).map((x,i)=>({...x,...[
 {subject:'Chemistry'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'}
][i]}))};
const blocked=load([...deck.cards],bad);
for(let i=0;i<5;i++)assert(!blocked.some(x=>x.id===bank.cards[i].id),'out-of-scope card added '+i);
const eligible=app.match(/function mockEligibleCard\(c\)\{[\s\S]*?\n\}/);assert(eligible);
const mockEligible=vm.runInNewContext("const MOCK_MATHS_YEAR2_EXCLUDED_IDS = new Set(['math_function_composite','math_inverse_condition','task1_v136_063']);\n"+eligible[0]+"\nmockEligibleCard");
for(const c of bank.cards)assert(mockEligible(c),'new card absent from mock '+c.id);
assert.equal(loaded.filter(x=>x.subject==='Maths').length,deck.cards.filter(x=>x.subject==='Maths').length);
console.log('PASS v230: 254 previously labelled Mechanics/Materials cards inventoried, 20 new AS mock recall cards, 60 accepted and 40 rejected variants, strict index 24 loader, offline caching, unchanged old IDs/progress, full sign-off still open.');
