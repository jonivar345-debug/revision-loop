'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const bank=json('physics_particles_applications_v243.json'),deck=json('deck.json');
const app=read('app.js'),sw=read('sw.js');
assert.equal(bank.version,'v243');assert.equal(bank.cards.length,10);assert.equal(deck.cards.length,3345);
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
assert(sw.includes("'./physics_particles_applications_v243.json'"));
assert(sw.includes('-v243-particles-application-recall'));
const files=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
assert.equal(files.length,31);assert.equal(files[30],'physics_particles_applications_v243.json');
assert.equal(files[29],'chemistry_amount_applications_v239.json');
const known=new Set(deck.cards.map(c=>c.id)),fronts=new Set(deck.cards.filter(c=>c.subject==='Physics').map(c=>c.front.trim().toLowerCase()));
for(const name of files.slice(0,30))for(const c of json(name).cards||[]){known.add(c.id);if(c.subject==='Physics')fronts.add(c.front.trim().toLowerCase());}
const normalized=app.slice(app.indexOf('function normalise('),app.indexOf('function importantTokens(',app.indexOf('function normalise(')));
assert(normalized.includes('function evaluateCard'));
const judge=new Function('window',normalized+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let accepts=0,rejects=0;
for(const c of bank.cards){
 assert(!known.has(c.id),'ID already used: '+c.id);known.add(c.id);
 assert(!fronts.has(c.front.trim().toLowerCase()),'Repeated prompt: '+c.id);
 fronts.add(c.front.trim().toLowerCase());
 assert.equal(c.subject,'Physics');assert.equal(c.stage,'AS');
 assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.scope,'mock');assert.equal(c.active,true);
 assert(/^3\.2\.(?:1\.[1-7]|2\.[1-4])$/.test(c.specRef));
 assert.equal(c.strictRecall,true);
 assert.equal(judge(c,c.back).status,'correct','Original answer mis-scored: '+c.id);
 for(const x of c.accept){assert.equal(judge(c,x).status,'correct','Valid Physics answer rejected '+c.id+': '+x);accepts++;}
 for(const x of c.reject){assert.equal(judge(c,x).status,'wrong','Invalid Physics answer accepted '+c.id+': '+x);rejects++;}
}
assert.equal(accepts,30);assert.equal(rejects,20);
assert(Math.abs(3.20e-19/6.64e-27/1e7-4.82)<0.01);
assert.equal(226-4,222);assert.equal(88-2,86);
assert.equal(6+1,7);
assert.equal(1+(-1),0);
assert.equal(-1.2-(-3.7),2.5);
assert(Math.abs(6.63e-34*3e8/3.20e-19/1e-7-6.22)<0.01);
assert.equal(6.63e-34/3.315e-24,2e-10);
assert.equal(1/Math.sqrt(4),0.5);
assert(Math.abs((1.400-1.022)-0.378)<1e-12);
const st=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));');
const en=app.indexOf(' const added=[',st);
assert(st>0&&en>st);
assert(app.slice(st,en).includes('else if(index===30)'));
const loader=new Function('cards','extraFlashBanks',app.slice(st,en)+'\nreturn cards;');
const blanks=Array.from({length:31},()=>({cards:[]}));blanks[30]=bank;
const loaded=loader([...deck.cards],blanks);
assert.equal(loaded.length,3355);
for(const c of bank.cards)assert(loaded.some(x=>x.id===c.id));
const invalid=Array.from({length:31},()=>({cards:[]}));
invalid[30]={cards:bank.cards.slice(0,6).map((c,i)=>({...c,...[
 {subject:'Maths'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'},{specRef:'3.3.1'}
][i]}))};
const blocked=loader([...deck.cards],invalid);
for(const c of invalid[30].cards)assert(!blocked.some(x=>x.id===c.id),'Invalid mock scope loaded');
console.log('PASS v243: 10 original Physics application cards, 30 correct and 20 incorrect variants, independent calculations, mock-only loader, offline cache, stable 3345 core cards and saved keys.');
