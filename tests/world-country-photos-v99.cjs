/* World v99: five country photo selections, four-source preservation and
 * identity/licence checks; source-page metadata != per-pixel approval. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
global.window={RevisionWorldDiscoveryPhotos:require('../world-photo-discovery-data.js'),RevisionWorldPhotoEnrichment:require('../world-photo-enrichment-v85.js')};
const catalog=require('../world-curated-photos.js'),gallery=require('../world-location-photo-gallery.js');
const places=[
 ['country-bz','Belize','Belize Blue Hole.jpg',
  ['Great Blue Hole Belize.jpg','Hirtella racemosa Mountain Pine Ridge Belize.jpg','St Johns Cathedral Belize City DB2015 1.jpg'],
  ['Belize Blue Hole.jpg','Cockscomb Basin waterfall.jpg','Xunantunich Belize 1 16.jpg','Belize Caye Caulker-226.jpg']],
 ['country-al','Albania','Thethi landscape.jpg',['Butrint theatre.jpg'],['Thethi landscape.jpg','Butrint. theatre.jpg']],
 ['country-kz','Kazakhstan','ПОЮЩИЙ БАРХАН.jpg',['Charyn canyon.jpg'],['ПОЮЩИЙ БАРХАН.jpg','Charyn Canyon, Kazakhstan 04.jpg']],
 ['country-iq','Iraq','View of Erbil skyline from the Citadel in the Kurdistan Region of Iraq 01.jpg',
  ['View of the Erbil skyline from the Cristal Hotel in Erbil.jpg'],
  ['View of Erbil skyline from the Citadel in the Kurdistan Region of Iraq 01.jpg','Samrraa 01.jpg']],
 ['country-sz','Eswatini','Mlilwane Wildlife Sanctuary in Eswatini 01.jpg',
  ['ESwatini Road Sunrise with road works.jpg'],
  ['Mlilwane Wildlife Sanctuary in Eswatini 01.jpg','Mantenga Falls.jpg']]
];
const bare=x=>String(x.file||'').replace(/^File:/,'');
(async()=>{
 let checks=0;
 for(const [id,name,hero,excluded,expected] of places){
  const all=catalog.get(id);
  assert(all.length>=4,id+' lost four source candidates');checks++;
  for(const b of excluded){assert(!all.some(x=>bare(x)===b),id+' still includes removed irrelevant or redundant image: '+b);checks++;}
  for(const p of expected){assert(all.some(x=>bare(x)===p),id+' missing important subject: '+p);checks++;}
  assert.equal(bare(all[0]),hero,id+' is not represented by its chosen cover');checks++;
  assert.equal(new Set(all.map(x=>bare(x).toLowerCase())).size,all.length,id+' contains a duplicate file source');checks++;
  const media={verifyNamedFiles:async proposed=>proposed};
  const cover=await gallery.photosFor({id,name,worldKind:'country'},{limit:1,media});
  const four=await gallery.photosFor({id,name,worldKind:'country'},{limit:4,media});
  assert.equal(cover.length,1,id+' no shop cover');checks++;
  assert.equal(four.length,4,id+' no four-scene gallery');checks++;
  assert.equal(bare(cover[0]),bare(four[0]),id+' shop cover differs from unlocked photo 1');checks++;
  assert.equal(new Set(four.map(x=>bare(x).toLowerCase())).size,4,id+' duplicates gallery photos');checks++;
  for(const x of four){
   assert(x.author&&x.licenseUrl&&x.originalUrl&&x.filePage,id+' missing Commons author/licence/original link');checks++;
   assert(x.licenseUrl.startsWith('https://creativecommons.org/'),id+' unsupported copyright or licence');checks++;
  }
 }
 const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
 const worker=fs.readFileSync(path.join(__dirname,'../sw.js'),'utf8');
 assert(html.includes('world-curated-photos.js?v=99'));checks++;
 assert(worker.includes('revision-loop-v103-local-photos-and-stories'));checks++;
 assert(worker.includes("k.startsWith('revision-loop-')&&k!==CACHE"));checks++;
 console.log('PASS v99 '+checks+' country-source, four-photo gallery, portrait-versus-cover, author, copyright and cache checks. Full 376 pixel-review remains pending.');
})().catch(err=>{console.error(err);process.exitCode=1});
