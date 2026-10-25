/* World v92: regression on real catalogue ordering and eight wrong/weak files.
   Real Wikimedia image delivery is checked separately, not forged here. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
global.window={
 RevisionWorldDiscoveryPhotos:require('../world-photo-discovery-data.js'),
 RevisionWorldPhotoEnrichment:require('../world-photo-enrichment-v85.js')
};
const catalog=require('../world-curated-photos.js');
const gallery=require('../world-location-photo-gallery.js');
const tests=[
 {id:'cairns',name:'Cairns',hero:'Esplanade Lagoon, Cairns, 2025, 12.jpg',reject:'Rock cairns on Kuikkapää in Urho Kekkonen national park, Sodankylä (July 2018).jpg'},
 {id:'losangeles',name:'Los Angeles',hero:'Skyline from Griffith Observatory.jpg',reject:'Ceiling at the entrance to Saint Vincent de Paul Roman Catholic Church, Los Angeles, California, US.jpg'},
 {id:'quebec',name:'Québec City',hero:'Chateau Frontenac seen from the ramparts of Quebec City.jpg',reject:'Glass office building on Avenue Honoré-Mercier, Quebec City.jpg'},
 {id:'dublin',name:'Dublin',hero:"Ha'penny Bridge, Dublin, at night.jpg",reject:"St Patrick's Cathedral Nave 3, Dublin, Ireland - Diliff.jpg"},
 {id:'tunis',name:'Tunis',hero:'La medina, Tunis, Tunisia.JPG',reject:'Aigrette garzette sur le lac de Tunis.jpg'},
 {id:'oaxaca',name:'Oaxaca',hero:'Church of Santo Domingo Oaxaca.jpg',reject:'Sculpture of Sea Turtle - Santo Domingo Cultural Center - Oaxaca City - Oaxaca - Mexico (6492533875).jpg'},
 {id:'dakar',name:'Dakar',hero:'African Renaissance Monument Dakar 2025.jpg',reject:'Dakar vue de haut 04.jpg'},
 {id:'brisbane',name:'Brisbane',hero:'Story Bridge, Brisbane City views, 2021, 04.jpg',reject:'Intellagama lesueurii lesueurii , Eastern Water Dragon, Brisbane.jpg'}
];
const bare=file=>String(file).replace(/^File:/,'');
(async()=>{
 let checks=0;
 for(const t of tests){
  const sources=catalog.get(t.id);
  assert(sources.length>=4,t.id+' source coverage fell below 4');checks++;
  assert.equal(bare(sources[0].file),t.hero,t.id+' has wrong priority cover');checks++;
  assert(!sources.some(x=>bare(x.file)===t.reject),t.id+' retained rejected source');checks++;
  assert(sources[0].author&&sources[0].licenseUrl&&sources[0].originalUrl&&sources[0].filePage);checks++;
  assert(sources[0].width>=2000&&sources[0].height>=1800,t.id+' image lacks sufficient original resolution');checks++;
  assert.equal(sources[0].checked,false,'Editorial metadata must not masquerade as pixel inspection');checks++;
  const api={verifyNamedFiles:async records=>records};
  const location={id:t.id,name:t.name};
  const one=await gallery.photosFor(location,{limit:1,media:api});
  const four=await gallery.photosFor(location,{limit:4,media:api});
  assert.equal(one.length,1);checks++;
  assert.equal(four.length,4);checks++;
  assert.equal(bare(one[0].file),t.hero,'Shop cover not promoted: '+t.id);checks++;
  assert.equal(bare(four[0].file),t.hero,'Shop and gallery cover differ: '+t.id);checks++;
  assert.equal(new Set(four.map(p=>bare(p.file).toLowerCase())).size,4,'Duplicate sources: '+t.id);checks++;
 }
 const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
 const sw=fs.readFileSync(path.join(__dirname,'../sw.js'),'utf8');
 assert(html.includes('world-curated-photos.js?v=108'),'Browser would load stale photo catalogue');checks++;
 assert(sw.includes('revision-loop-v108-six-source-galleries-and-photo-quality'),'Offline cache version stale');checks++;
 assert(sw.includes("k.startsWith('revision-loop-')&&k!==CACHE"),'App deletes unrelated caches');checks++;
 assert(!sw.includes('caches.match(e.request,{ignoreSearch:true})'),'Global cache lookup not scoped to app');checks++;
 console.log('PASS '+checks+' v92 source, cover, catalogue and scoped-cache checks; 8 galleries. Pixel inspection and live image loads remain separate.');
})().catch(error=>{console.error(error);process.exitCode=1});
