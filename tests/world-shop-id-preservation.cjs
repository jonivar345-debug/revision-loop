/* Read-only guard for historical shop IDs: does not touch localStorage, prices or XP. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const baseline=JSON.parse(fs.readFileSync(path.join(root,'editorial/shop_historical_identity_baseline_20261023.json'),'utf8'));
const between=(from,to)=>{
 const start=app.indexOf(from),end=app.indexOf(to,start+1);
 assert(start>=0&&end>start,'Missing roster anchor: '+from);
 return app.slice(start,end);
};
const chars=between('const CHARACTERS=[','// Read-only official character-profile previews.');
const places=between('const LOCATIONS=[','const EARTH_TEXTURE_URL=');
const styleMatch=app.match(/const OUTFIT_STYLES=\[([\s\S]*?)\];/);
assert(styleMatch,'Outfit style roster missing');
const ids=(text,re)=>[...text.matchAll(re)].map(x=>x[1]);
const actual={
 characters:ids(chars,/\{id:'([^']+)',name:'[^']*',series:/g),
 locations:ids(places,/\{id:'([^']+)',name:'[^']+',wiki:/g),
 outfitStyles:ids(styleMatch[1],/\{id:'([^']+)'/g)
};
let checks=0;
for(const [kind,snapshot] of Object.entries({characters:baseline.characters,locations:baseline.locations,outfitStyles:baseline.outfitStyles})){
 const now=new Set(actual[kind]);
 assert.equal(now.size,actual[kind].length,'Duplicated '+kind+' ID');checks++;
 for(const id of snapshot){assert(now.has(id),'Historic '+kind+' ID removed: '+id);checks++;}
}
assert.equal(baseline.characters.length,116);checks++;
assert.equal(baseline.locations.length,161);checks++;
assert.equal(baseline.outfitStyles.length,8);checks++;
// The roster derives outfits by joining unchanged character IDs to unchanged style IDs.
assert(app.includes("id:ch.id+'-'+o.id"),'Outfit ID generation changed without explicit migration');checks++;
for(const pair of baseline.knownEquivalentLocations){
 assert.equal(pair.length,2);checks++;
 for(const id of pair){assert(actual.locations.includes(id),'Legacy alias removed: '+id);checks++;}
}
console.log('PASS '+checks+' historical shop-ID preservation assertions; '+actual.characters.length+' characters, '+actual.outfitStyles.length+' outfit styles, '+actual.locations.length+' location IDs. No user data changed.');
