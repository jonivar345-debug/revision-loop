/* v95 shop price and purchase regression. Runs actual application source against
 * synthetic saved profiles. Never accesses real user's localStorage. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const geo=fs.readFileSync(path.join(root,'world-geographic-destinations.js'),'utf8');
const safety=require('../world-profile-preservation.js');
const cut=(a,b)=>{const i=app.indexOf(a),j=app.indexOf(b,i+a.length);assert(i>=0&&j>i,'Source anchor missing: '+a);return app.slice(i,j)};
const world={};vm.runInNewContext(geo,{window:world});
const extra=world.RevisionWorldDestinations;
assert.equal(extra.length,218,'Historic world additions lost');
const previous={
 economyVersion:1,points:625,lifetimeXp:17823,reviews:412,
 shopOwned:{
   characters:['lelouch','future_character','cc'],
   outfits:['lelouch-default','future_character-rare','cc-default'],
   locations:['london','cape_town','future_location','country-nz']
 },
 equippedCharacter:'future_character',equippedOutfit:'future_character-rare',equippedLocation:'cape_town',
 dailyChallenges:{old:{done:true}},challengeStreak:19,
 lastChallengeDate:'2026-10-24',challengeBonusDate:'2026-10-24',
 errorLog:[{id:'q-original'}],examResults:{maths:{score:22}}
};
const original=JSON.parse(JSON.stringify(previous));
const map=new Map([['revisionLoopProfile11',JSON.stringify(previous)]]);
const storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,String(v))};
const notification=[];let rendered=0,focused=0;
const ctx={
 window:{RevisionWorldDestinations:extra,RevisionWorldProfileSafety:safety},
 profile:JSON.parse(JSON.stringify(previous)),
 settings:{dailyNew:18,physicsUnits:{}},progress:{saved_card:{due:271}},
 localStorage:storage,PROFILE_KEY:'revisionLoopProfile11',
 PROGRESS_KEY:'revisionLoopProgress5',SETTINGS_KEY:'revisionLoopSettings11',
 showToast:s=>notification.push(s),renderAll:()=>rendered++,
 focusOnGlobeLocation:()=>{focused++;return true},drawGlobe:()=>{}
};
vm.createContext(ctx);
vm.runInContext(
 cut('const CHARACTERS=[','// Read-only official character-profile previews.')+
 cut('const LOCATIONS=[','const EARTH_TEXTURE_URL=')+
 cut('function save(){','function now(){')+
 cut('function buy(kind,id){','function placeImage('),ctx);
const read=expr=>JSON.parse(vm.runInContext('JSON.stringify('+expr+')',ctx));
assert.equal(read('CHARACTERS.length'),116);
assert.equal(read('OUTFITS.length'),928);
assert.equal(read('LOCATIONS.length'),379);
assert.equal(new Set(read('CHARACTERS.map(x=>x.id)')).size,116);
assert.equal(new Set(read('OUTFITS.map(x=>x.id)')).size,928);
assert.equal(new Set(read('LOCATIONS.map(x=>x.id)')).size,379);
const chars=read('CHARACTERS.map(({id,cost})=>({id,cost,expected:id===\'lelouch\'?0:POPULAR_LEAD_IDS.has(id)?20:MAIN_CHARACTER_IDS.has(id)?15:10}))');
for(const {id,cost,expected} of chars)assert.equal(cost,expected,'Character tier: '+id);
const outfits=read('OUTFITS.map(({id,cost,styleId})=>({id,cost,styleId}))');
for(const o of outfits)assert.equal(o.cost,o.styleId==='default'?0:5,'Outfit cost: '+o.id);
const locations=read('LOCATIONS.map(({id,cost,worldKind})=>({id,cost,worldKind,iconic:ICONIC_LOCATION_IDS.has(id),major:MAJOR_LOCATION_IDS.has(id)}))');
for(const p of locations){
 const desired=p.worldKind==='country'?75:p.worldKind==='ocean'?70:p.worldKind==='sea'?60:
 p.id==='london'?0:p.iconic?100:p.major?75:50;
 assert.equal(p.cost,desired,'Wrong destination price: '+p.id);
}
assert.equal(locations.filter(x=>x.worldKind==='country').length,196);
assert.equal(locations.filter(x=>x.worldKind==='ocean').length,5);
assert.equal(locations.filter(x=>x.worldKind==='sea').length,17);
vm.runInContext('ensureProfile()',ctx);
assert.equal(ctx.profile.points,625,'Migration reset existing points');
assert.equal(ctx.profile.lifetimeXp,17823,'Migration changed already earned XP');
assert(ctx.profile.shopOwned.locations.includes('future_location'));
assert(ctx.profile.shopOwned.characters.includes('future_character'));
assert(ctx.profile.shopOwned.outfits.includes('future_character-rare'));
assert.deepEqual(JSON.parse(map.get('revisionLoopProfile-pre-world-v62')),original,'Historic profile backup damaged');
assert.equal(ctx.profile.challengeStreak,19);
const initialIds=JSON.parse(JSON.stringify(ctx.profile.shopOwned));
const buy=(type,id)=>vm.runInContext('buy('+JSON.stringify(type)+','+JSON.stringify(id)+')',ctx);
let before=ctx.profile.points;
buy('location','capetown');assert.equal(ctx.profile.points,before,'Alias cape_town charged again');
assert.equal(ctx.profile.equippedLocation,'cape_town');
buy('character','cc');assert.equal(ctx.profile.points,before,'Existing character charged again');
buy('outfit','cc-default');assert.equal(ctx.profile.points,before,'Owned costume charged again');
buy('location','country-nz');assert.equal(ctx.profile.points,before,'Owned country charged again');
buy('location','dublin');before-=50;assert.equal(ctx.profile.points,before,'Regular location wrong');
buy('location','seoul');before-=75;assert.equal(ctx.profile.points,before,'Major location wrong');
buy('location','tokyo');before-=100;assert.equal(ctx.profile.points,before,'Iconic location wrong');
buy('location','country-jp');before-=75;assert.equal(ctx.profile.points,before,'Country wrong');
buy('location','ocean-atlantic');before-=70;assert.equal(ctx.profile.points,before,'Ocean wrong');
buy('location','sea-baltic');before-=60;assert.equal(ctx.profile.points,before,'Sea wrong');
buy('character','gojo');before-=20;assert.equal(ctx.profile.points,before,'Featured character wrong');
assert(ctx.profile.shopOwned.outfits.includes('gojo-default'),'Buying character must unlock free default');
buy('outfit','gojo-hoodie');before-=5;assert.equal(ctx.profile.points,before,'Outfit wrong');
buy('outfit','gojo-hoodie');assert.equal(ctx.profile.points,before,'Repeat outfit charged');
buy('character','gojo');assert.equal(ctx.profile.points,before,'Repeat character charged');
buy('location','dublin');assert.equal(ctx.profile.points,before,'Repeat location charged');
buy('character','l');before-=10;assert.equal(ctx.profile.points,before,'Supporting character wrong');
buy('character','subaru');before-=15;assert.equal(ctx.profile.points,before,'Main character wrong');
assert(ctx.profile.points>=0&&Number.isFinite(ctx.profile.points),'Points underflow');
assert.equal(ctx.profile.lifetimeXp,17823,'Any shop action must not modify XP');
for(const category of ['characters','outfits','locations'])
 for(const id of initialIds[category])assert(ctx.profile.shopOwned[category].includes(id),'Previously owned '+category+' discarded: '+id);
assert.equal(ctx.profile.challengeStreak,19);
assert.deepEqual(JSON.parse(JSON.stringify(ctx.profile.examResults)),original.examResults);
assert.deepEqual(JSON.parse(JSON.stringify(ctx.profile.errorLog)),original.errorLog);
assert.equal(ctx.progress.saved_card.due,271);
// Test insufficient funds on an independent low-balance synthetic state.
ctx.profile.points=49;
vm.runInContext('save()',ctx);
const prevBalance=ctx.profile.points;
buy('location','reykjavik');
assert.equal(ctx.profile.points,prevBalance,'Insufficient points purchase charged');
assert(!ctx.profile.shopOwned.locations.includes('reykjavik'),'Insufficient purchase incorrectly granted');
assert(notification.at(-1).includes('Not enough points'));
const persisted=JSON.parse(map.get('revisionLoopProfile11'));
assert.equal(persisted.points,prevBalance,'Stored points do not match');
assert.equal(persisted.lifetimeXp,17823,'Stored XP was altered');
assert(persisted.shopOwned.outfits.includes('gojo-hoodie'));
assert.deepEqual(JSON.parse(map.get('revisionLoopProgress5')),{saved_card:{due:271}});
assert.equal(ctx.profile.economyVersion,2,'Existing migration version unexpectedly changed');
assert(rendered>10&&focused>4);
console.log('PASS v95: 379 destination prices, 116 character prices, 928 outfit prices, purchase and repeat-purchase costs, old IDs, balances, XP, offline-compatible storage.');
