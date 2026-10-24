/* Execute the actual app.js migration, purchase and rendering functions.
   No user browser storage is accessed. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const safety=require('../world-profile-preservation.js');
const baseline=JSON.parse(fs.readFileSync(path.join(root,'editorial/shop_historical_identity_baseline_20261023.json'),'utf8'));
const cut=(from,to)=>{const x=app.indexOf(from),y=app.indexOf(to,x+1);assert(x>=0&&y>x,'Source boundaries '+from);return app.slice(x,y)};
const inventory=new Function(cut('const LOCATIONS=[','const EARTH_TEXTURE_URL=')+'return LOCATIONS')();
assert.equal(inventory.length,161);
const old={
 economyVersion:1,points:762,lifetimeXp:12345,reviews:412,
 shopOwned:{characters:['lelouch','future_character'],outfits:['lelouch-default','future_character-holiday'],locations:['london','cape_town','addis_ababa','victoria_falls','future_mystery']},
 equippedCharacter:'future_character',equippedOutfit:'future_character-holiday',equippedLocation:'cape_town',
 examResults:{physics:{score:50}},daily:{'2026-10-22':{reviews:12}},errorLog:[{question:'q1'}]
};
const backup=new Map([['revisionLoopProfile11',JSON.stringify(old)]]);
const store={getItem:k=>backup.get(k)||null,setItem:(k,v)=>backup.set(k,String(v))};
let appRender=0,notifications=[];
const context={
 window:{RevisionWorldProfileSafety:safety},localStorage:store,PROFILE_KEY:'revisionLoopProfile11',
 profile:JSON.parse(JSON.stringify(old)),settings:{},progress:{physics:{due:65}},PROGRESS_KEY:'progress',SETTINGS_KEY:'settings',
 LOCATIONS:inventory,
 CHARACTERS:[{id:'lelouch'},{id:'future_character'}],OUTFITS:[{id:'lelouch-default',character:'lelouch'},{id:'future_character-holiday',character:'future_character'}],
 showToast:x=>notifications.push(x),focusOnGlobeLocation:()=>true,renderAll:()=>{appRender++},drawGlobe:()=>{}
};
vm.createContext(context);
const migration=cut('function ensureProfile(){','function now(){');
vm.runInContext(migration+'\nensureProfile();',context);
assert.equal(context.profile.points,762,'Old points were wiped');
assert.equal(context.profile.lifetimeXp,12345,'Old XP was wiped');
assert.equal(context.profile.economyVersion,2);
assert.deepEqual(Array.from(context.profile.shopOwned.locations),old.shopOwned.locations);
assert(context.profile.shopOwned.characters.includes('future_character'));
assert(context.profile.shopOwned.outfits.includes('future_character-holiday'));
assert.equal(context.profile.equippedLocation,'cape_town');
assert.deepEqual(JSON.parse(backup.get('revisionLoopProfile-pre-world-v62')),old,'Profile backup lost original JSON');
assert.deepEqual(JSON.parse(JSON.stringify(context.profile.examResults)),old.examResults);
assert.deepEqual(JSON.parse(JSON.stringify(context.profile.errorLog)),old.errorLog);
vm.runInContext(migration+'\nensureProfile();',context);
assert.equal(context.profile.points,762,'Second migration altered balance');
const savedBackup=backup.get('revisionLoopProfile-pre-world-v62');
assert.equal(savedBackup,JSON.stringify(old),'Original backup was replaced');
vm.runInContext(cut('function save(){','function ensureProfile(){')+cut('function buy(kind,id){','function placeImage('),context);
vm.runInContext("buy('location','capetown')",context);
assert.equal(context.profile.points,762,'Cape Town alias double charged');
assert.equal(context.profile.equippedLocation,'cape_town','Prior bought alias should remain equipped');
vm.runInContext("buy('location','addis')",context);
vm.runInContext("buy('location','victoriafalls')",context);
assert.equal(context.profile.points,762,'Alias families charged unexpectedly');
assert.equal(appRender,3,'Purchases did not rerender');
assert.deepEqual(JSON.parse(backup.get('revisionLoopProfile11')).shopOwned.locations,context.profile.shopOwned.locations);
vm.runInContext("buy('location','tbilisi')",context);
const correctTbilisiBalance=762-inventory.find(x=>x.id==='tbilisi').cost;
assert.equal(context.profile.points,correctTbilisiBalance,'New place must deduct the configured cost exactly once');
vm.runInContext("buy('location','tbilisi')",context);
assert.equal(context.profile.points,correctTbilisiBalance,'Second purchase was charged');
assert(context.profile.shopOwned.locations.includes('tbilisi'));
vm.runInContext("buy('location','cape_town')",context);
assert.equal(context.profile.points,correctTbilisiBalance,'Already owned legacy purchase charged');
assert.equal(context.profile.lifetimeXp,12345,'Purchases modified accumulated XP');
const shop={innerHTML:'',dataset:{}},count={textContent:''},more={classList:{toggle(){}},textContent:''};
const elements={locationRegion:{value:''},regionCount:count,locationShop:shop,moreLocations:more};
context.document={
 getElementById:id=>elements[id],
 querySelectorAll:()=>[]
};
context.esc=value=>String(value);
context.evenlySpacedLocations=xs=>xs;
context.locationVisibleLimit=200;
context.locationPhoto=()=>{};
vm.runInContext(cut('function renderLocationGallery(){','const REGION_CULTURE=')+'\nrenderLocationGallery();',context);
assert.equal(count.textContent,'158 worldwide','Duplicate destinations still counted in gallery');
assert.equal((shop.innerHTML.match(/class="shop-item location-card"/g)||[]).length,158,'Shop shows duplicate location cards');
assert(shop.innerHTML.includes('data-location="capetown"')&&!shop.innerHTML.includes('data-location="cape_town"'));
assert(shop.innerHTML.includes('data-location="addis"')&&!shop.innerHTML.includes('data-location="addis_ababa"'));
assert(shop.innerHTML.includes('data-location="victoriafalls"')&&!shop.innerHTML.includes('data-location="victoria_falls"'));
const globe={profile:context.profile,window:context.window,LOCATIONS:inventory,project:()=>({x:0,y:0,z:1}),document:{getElementById:()=>({checked:true})}};
vm.createContext(globe);
vm.runInContext(cut('function visibleGlobePins(','function drawGlobe()')+'\nthis.pins=visibleGlobePins(700,360);',globe);
assert.equal(globe.pins.length,158,'Globe has duplicate pin');
for(const id of ['capetown','addis','victoriafalls'])assert.equal(globe.pins.find(x=>x.location.id===id).owned,true,'Legacy purchase not respected on globe');
const firstHtml=html.indexOf('world-profile-preservation.js'),appHtml=html.indexOf('app.js?v=');
assert(firstHtml>=0&&appHtml>firstHtml,'Migration script must load before app');
for(const id of baseline.locations)assert(inventory.some(x=>x.id===id),'Historical location missing: '+id);
console.log('PASS real app profile migration, old data backup, preserved XP and owned IDs, alias buying, first purchase and double purchase, 158 shop cards and 158 globe pins.');
