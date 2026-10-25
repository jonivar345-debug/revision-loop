/* v86 source-page reviewed additions for Dakar and Red Sea: genuine coast/sea variety. */
'use strict';
const assert=require('node:assert/strict');
const src=require('../world-photo-discovery-data.js');
const extra=require('../world-photo-enrichment-v85.js');
global.window={RevisionWorldDiscoveryPhotos:src,RevisionWorldPhotoEnrichment:extra};
const gallery=require('../world-location-photo-gallery.js');
const registry=require('../world-curated-photos.js');
const expected={
 dakar:['Dakar, la corniche.jpg'],
 'sea-red':['Al-Qusayr beach, Red Sea.jpg','Sunset-at redsea shore.jpg']
};
for(const [place,files]of Object.entries(expected)){
 const photos=registry.get(place),distinct=new Set(photos.map(p=>p.file.toLowerCase()));
 assert(distinct.size>=4,'Four different authentic Commons sources needed for '+place);
 for(const filename of files){
  const photo=photos.find(p=>p.file.endsWith(filename));
  assert(photo,'Source missing '+filename);
  assert(gallery.allowed(photo,{id:place,name:place,worldKind:place==='sea-red'?'sea':'city'}));
  assert(photo.source==='editorial-source'&&!photo.checked,'New photos must require current live Commons licence verification');
  assert(photo.filePage.startsWith('https://commons.wikimedia.org/wiki/File:')&&photo.originalUrl.startsWith('https://commons.wikimedia.org/wiki/Special:FilePath/'));
  assert(photo.width>=2048&&photo.height>=900&&photo.author&&photo.licenseUrl.startsWith('https://creativecommons.org/'));
 }
}
const html=require('node:fs').readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const sw=require('node:fs').readFileSync(require('node:path').join(__dirname,'../sw.js'),'utf8');
assert(html.includes('world-curated-photos.js?v=99'));
assert(sw.includes('revision-loop-v102-optimized-local-photos'));
console.log('PASS v86: four distinct sourced photos each for Dakar and Red Sea, 3 new high-resolution licensed sources, original links and safe Commons rights checks');
