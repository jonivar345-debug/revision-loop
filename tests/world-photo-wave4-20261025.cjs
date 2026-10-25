/* World v93: six recognisable photo galleries and preservation checks.
   CC metadata reviewed; full image-pixel acceptance is separate. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
global.window={RevisionWorldDiscoveryPhotos:require('../world-photo-discovery-data.js'),RevisionWorldPhotoEnrichment:require('../world-photo-enrichment-v85.js')};
const catalog=require('../world-curated-photos.js');
const gallery=require('../world-location-photo-gallery.js');
const tests=[["capetown","Cape Town","Cape Town dawn cityscape with Table Mountain.jpg",["Cape Town (ZA), Waterfront, Kran -- 2024 -- 2907.jpg","Cape Town (ZA), Wale Street -- 2024 -- 3536.jpg","Cape Town (ZA), Wale Street -- 2024 -- 3544.jpg"]],["sanfrancisco","San Francisco","Golden Gate Bridge and San Francisco skyline from Hawk Hill at Blue Hour dllu.jpg",["Zeppelin-ride-020100925-195 (5029394846).jpg"]],["lisbon","Lisbon","City view of Lisbon with Castelo de São Jorge.jpg",["Yellow leaves floating next to water volcano, Alameda dos Oceanos, Parque das Nações, Lisbon, Portugal julesvernex2.jpg"]],["greatbarrier","Great Barrier Reef","Aerial View of Great Barrier Reef (Ank Kumar) 04.jpg",["Chilli Beach, Lockhart QLD Australia - Great Barrier Reef Marine Park.jpg"]],["uyuni","Salar de Uyuni","El salar.jpg",["SAL - Waterbird in a flooded area of Salar de Uyuni, Bolivia, 2013.jpg"]],["chichenitza","Chichén Itzá","Chichen-Itza.jpg",["El Castillo ,Chichen Itza MEXICO - panoramio.jpg"]]];
const file=p=>String(p.file||'').replace(/^File:/,'');
(async()=>{
let checks=0;
for(const [id,name,hero,banned] of tests){
 const records=catalog.get(id);
 assert(records.length>=4,id+' lost photo coverage');checks++;
 assert.equal(file(records[0]),hero,id+' hero not first in catalogue');checks++;
 for(const b of banned){assert(!records.some(x=>file(x)===b),id+' still contains inappropriate photo '+b);checks++;}
 const lead=records[0];
 assert(lead.source==='editorial-source'&&lead.checked===false,id+' must keep live licence verification');checks++;
 assert(lead.author&&lead.licenseUrl&&lead.filePage&&lead.originalUrl&&lead.width>=2000&&lead.height>=1800,id+' cover missing rights or original resolution');checks++;
 const media={verifyNamedFiles:async pics=>pics};
 const location={id,name};
 const cover=await gallery.photosFor(location,{limit:1,media});
 const expanded=await gallery.photosFor(location,{limit:4,media});
 assert.equal(cover.length,1,id+' no cover');checks++;
 assert.equal(expanded.length,4,id+' did not fill 4-gallery');checks++;
 assert.equal(file(cover[0]),hero,id+' shop cover wrong');checks++;
 assert.equal(file(expanded[0]),hero,id+' gallery and shop covers differ');checks++;
 assert.equal(new Set(expanded.map(x=>file(x).toLowerCase())).size,4,id+' repeated image');checks++;
}
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const sw=fs.readFileSync(path.join(__dirname,'../sw.js'),'utf8');
assert(html.includes('world-curated-photos.js?v=93'));checks++;
assert(sw.includes('revision-loop-v93-photo-curation'));checks++;
assert(sw.includes("k.startsWith('revision-loop-')&&k!==CACHE"));checks++;
assert(!sw.includes('caches.match(e.request,{ignoreSearch:true})'));checks++;
console.log('PASS '+checks+' World v93 photo sources, six distinct four-photo galleries, consistent shop covers and private cache scope. Live pixels NOT certified.');
})().catch(err=>{console.error(err);process.exitCode=1});
