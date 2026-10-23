/* Historic purchase and XP regression suite. Does not read or write a real browser profile. */
'use strict';
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const safety=require('../world-profile-preservation.js');
const baseline=JSON.parse(fs.readFileSync(path.join(__dirname,'../editorial/shop_historical_identity_baseline_20261023.json'),'utf8'));
const original={
  economyVersion:1,
  lifetimeXp:16798,points:786,reviews:402,
  shopOwned:{
    characters:['lelouch','cc','future_character'],
    outfits:['lelouch-default','cc-winter','future_character-neon'],
    locations:['london','cape_town','addis_ababa','victoria_falls','future-moon-city']
  },
  equippedCharacter:'cc',
  equippedOutfit:'cc-winter',
  equippedLocation:'cape_town',
  daily:{"2026-10-20":{reviews:12}},
  errorLog:[{id:'physics-error',score:1}],
  examResults:{"maths-paper":{score:55}},
  settingsNotToDelete:{label:'retained'}
};
let count=0;
const before=JSON.stringify(original);
const migrated=safety.migrateProfile(original);
assert.equal(JSON.stringify(original),before,'Migration mutated its input');count++;
assert.equal(migrated.economyVersion,2);count++;
for(const field of ['points','lifetimeXp','reviews']){assert.equal(migrated[field],original[field],'Reset economic quantity '+field);count++}
for(const key of ['daily','errorLog','examResults','settingsNotToDelete']){assert.deepEqual(migrated[key],original[key],'Lost unrelated progress field '+key);count++}
for(const type of ['characters','outfits','locations'])for(const id of original.shopOwned[type]){assert(migrated.shopOwned[type].includes(id),'Lost historic item ID '+id);count++}
assert.equal(migrated.equippedLocation,'cape_town');count++;
assert.equal(migrated.equippedCharacter,'cc');count++;
assert.equal(migrated.equippedOutfit,'cc-winter');count++;
assert.deepEqual(safety.migrateProfile(migrated),migrated,'Migration was not idempotent');count++;
for(const old of baseline.characters){
 const x=safety.migrateProfile({economyVersion:0,points:1000,lifetimeXp:2500,shopOwned:{characters:[old],outfits:['lelouch-default'],locations:['london']}});
 assert(x.shopOwned.characters.includes(old),'Deleted historically released character '+old);count++;
}
for(const old of baseline.locations){
 const x=safety.migrateProfile({economyVersion:0,points:1000,lifetimeXp:2500,shopOwned:{characters:['lelouch'],outfits:['lelouch-default'],locations:[old]}});
 assert(x.shopOwned.locations.includes(old),'Deleted historically released place '+old);count++;
}
for(const char of baseline.characters){
 const outfit=char+'-festival';
 const x=safety.migrateProfile({shopOwned:{characters:[char],outfits:[outfit],locations:['london']}});
 assert(x.shopOwned.outfits.includes(outfit),'Lost released outfit '+outfit);count++;
}
for(const [canonical,aliases] of Object.entries(safety.GROUPS)){
 assert.equal(aliases.length,2);count++;
 const alternate=aliases.find(x=>x!==canonical);
 assert(safety.isOwnedLocation(migrated,canonical)===true,'Historical '+canonical+' alias ownership not seen');count++;
 let profile={...migrated,points:500,shopOwned:{...migrated.shopOwned,locations:['london',alternate]}};
 const first=safety.purchaseLocation(profile,{id:canonical,cost:150});
 assert.equal(first.deducted,0,'Duplicate purchase charged points: '+canonical);count++;
 assert.equal(first.profile.points,500);count++;
 assert.equal(first.profile.equippedLocation,alternate,'Previously bought ID not retained as equipped');count++;
 assert(first.profile.shopOwned.locations.includes(alternate));count++;
 const both=safety.purchaseLocation({...profile,shopOwned:{...profile.shopOwned,locations:['london',alternate,canonical]}},{id:canonical,cost:150});
 assert.equal(both.deducted,0);count++;
 assert(both.profile.shopOwned.locations.includes(alternate)&&both.profile.shopOwned.locations.includes(canonical));count++;
 profile={...migrated,points:500,shopOwned:{...migrated.shopOwned,locations:['london']}};
 const paid=safety.purchaseLocation(profile,{id:canonical,cost:100});
 assert.equal(paid.deducted,100);count++;
 assert.equal(paid.profile.points,400);count++;
 const again=safety.purchaseLocation(paid.profile,{id:alternate,cost:200});
 assert.equal(again.deducted,0);count++;
 assert.equal(again.profile.points,400);count++;
 assert.equal(again.profile.equippedLocation,canonical);count++;
}
const short=safety.purchaseLocation({points:5,lifetimeXp:30,shopOwned:{locations:['london']}},{id:'tbilisi',cost:25});
assert(short.insufficientPoints);count++;
assert.equal(short.profile.points,5);count++;
assert.equal(short.profile.lifetimeXp,30);count++;
assert(!short.profile.shopOwned.locations.includes('tbilisi'));count++;
const unknown=safety.migrateProfile({points:72,lifetimeXp:81,economyVersion:0,shopOwned:{characters:['unknown'],outfits:['unknown-outfit'],locations:['unknown-place']},equippedLocation:'unknown-place'});
assert(unknown.shopOwned.locations.includes('unknown-place'));count++;
assert.equal(unknown.equippedLocation,'unknown-place');count++;
assert.equal(unknown.points,72);count++;
assert.equal(unknown.lifetimeXp,81);count++;
const locations=baseline.locations.map(id=>({id}));
const distinct=safety.distinctLocations(locations);
assert.equal(locations.length,161);count++;
assert.equal(distinct.length,158,'Three duplicate visible destinations should be hidden, without changing persisted IDs');count++;
assert.equal(new Set(distinct.map(x=>x.id)).size,distinct.length);count++;
console.log('PASS '+count+' pure migration/legacy item/XP/double-purchase assertions; source profile untouched.');
