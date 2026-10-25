/* v91 photo-quality source audit and deterministic cover selection.
   Commons metadata is not a full-resolution visual inspection. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const discovery=require('../world-photo-discovery-data.js');
const enrichment=require('../world-photo-enrichment-v85.js');
global.window={RevisionWorldDiscoveryPhotos:discovery,RevisionWorldPhotoEnrichment:enrichment};
const curated=require('../world-curated-photos.js'),gallery=require('../world-location-photo-gallery.js');
const pairs={
'country-md':{added:['Orheiul Vechi panorama.jpg','Arco del triunfo, Chisináu, Moldavia, 2023-11-03, DD 27.jpg'],bad:['Romania Mănăstirea Sfântul Mina din Roșiori View of Moldova River.jpg','Moldova - landscape in Hîncești District 02.jpg'],cover:'Orheiul Vechi panorama.jpg'},
'country-er':{added:['Asmara Eritrea Fiat Tagliero Building (30476150040).jpg'],bad:['Cast iron utility cover in Asmara, Eritrea (30142134424).jpg'],cover:'Asmara Eritrea Fiat Tagliero Building (30476150040).jpg'},
'country-pw':{added:['Jellyfish Lake aerial (March 2008).jpg'],bad:['Palau fantail (Rhipidura lepida) Rock Islands 3.jpg'],cover:'Jellyfish Lake aerial (March 2008).jpg'},
'country-gm':{added:['Gambia, Banjul, Arch 22.jpg','The river of the Gambia.JPG'],bad:['River Crab, Gambia (12561151994).jpg','Coco Ocean Resort & Spa (The Gambia) (23707583812).jpg'],cover:'The river of the Gambia.JPG'},
'country-ng':{added:['ZUMA ROCK.jpg','Lagos skyline.jpg'],bad:['National Church of Nigeria in Abuja 03.jpg','National Church of Nigeria in Abuja 22.jpg'],cover:'Lagos skyline.jpg'},
'country-be':{added:['Ghent from Graslei.jpg'],bad:['De Molen (windmill) and the nuclear power plant cooling tower in Doel, Belgium (DSCF3859).jpg'],cover:'The Grand Place, Brussels.jpg'},
'country-bn':{added:['Kampong Ayer, Water Village, Mosque. Brunei, Southeast Asia.jpg'],bad:['Jasra Harrisons building in Kuala Belait, Brunei (DSCF1391).jpg'],cover:'Omar Ali Saifuddien Mosque Brunei.jpg'},
'country-cm':{added:['Parc Waza.jpg'],bad:['Spinach farming in Cameroon (Water leave gardening) 01.jpg'],cover:'Mount Cameroon.jpg'}
};
const norm=s=>String(s).replace(/^File:/i,'').replace(/_/g,' ').toLowerCase();
const file=path.join(__dirname,'../editorial/world_photo_collection_template_376.csv');
const places=fs.readFileSync(file,'utf8').split(/\r?\n/).slice(1).filter(Boolean).map(row=>{
 const m=[...row.matchAll(/"([^"]*)"/g)].map(x=>x[1]);return{id:m[3],name:m[0],kind:m[1]};
});
assert.equal(places.length,376);
let complete=0,added=0;const gapIds=[];
for(const loc of places){
 const found=curated.get(loc.id).filter(p=>p.file&&p.author&&p.licenseUrl&&p.filePage&&gallery.allowed(p,{id:loc.id,name:loc.name,worldKind:loc.kind}));
 const set=new Map(found.map(x=>[norm(x.file),x]));
 if(set.size>=4)complete++;else gapIds.push(loc.id);
 const pair=pairs[loc.id];if(!pair)continue;
 for(const name of pair.bad)assert(!set.has(norm(name)),loc.id+' has known poor image '+name);
 for(const name of pair.added){
  const item=set.get(norm(name));assert(item,loc.id+' missing '+name);
  assert.equal(item.qualityPriority,900);
  assert.equal(item.source,'editorial-source');
  assert.equal(item.checked,false,'Source-page review is not pixel-level approval');
  assert(item.width>=2048&&item.height>=900,'Original is smaller than quality threshold '+name);
  assert(item.url.includes('width=2048')&&item.originalUrl.includes('Special:FilePath'));
  assert(item.licenseUrl.startsWith('https://creativecommons.org/'));
  assert(item.reviewStatus.includes('NOT visually pixel-reviewed'));
  added++;
 }
}
assert.deepEqual(gapIds.sort(),require('../editorial/world-v107-catalogue-eligibility-gaps.json').gaps.map(x=>x.id).sort(),'Unexpected photo-source eligibility gap');
assert.equal(complete,365,'Do not count disqualified image name collisions as source-complete');
assert.equal(added,11);
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
for(const x of ['world-photo-discovery-data.js','world-photo-enrichment-v85.js','world-curated-photos.js','world-location-photo-gallery.js'])
 assert(html.includes(x+'?v='+(x==='world-curated-photos.js'?'109':x==='world-location-photo-gallery.js'?'111':'91')),'Missing revised browser script: '+x);
assert(sw.includes('revision-loop-v113-complete-partial-world-galleries'));
(async()=>{
 const media={verifyNamedFiles:async candidates=>candidates};
 for(const [id,info] of Object.entries(pairs)){
  const loc={id,name:id,worldKind:'country'};
  const cover=await gallery.photosFor(loc,{limit:1,media});
  const photos=await gallery.photosFor(loc,{limit:4,media});
  assert.equal(photos.length,4,id+' lacks four image choices');
  assert.equal(cover[0].file,photos[0].file,id+' cover does not match gallery lead');
  assert.equal(norm(cover[0].file),norm(info.cover),id+' priority cover regressed');
  assert.equal(new Set(photos.map(x=>norm(x.file))).size,4,id+' has duplicate images');
 }
 console.log('PASS v91: 8 improved countries, 11 preserved high-resolution originals, 376 source-complete galleries, cover/gallery alignment; visual inspection still pending');
})().catch(e=>{console.error(e);process.exitCode=1;});
