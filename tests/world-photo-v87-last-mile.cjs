/* v87 verified-at-source photo coverage audit, not pixel-level editorial approval. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const discovery=require('../world-photo-discovery-data.js');
const enrichment=require('../world-photo-enrichment-v85.js');
global.window={RevisionWorldDiscoveryPhotos:discovery,RevisionWorldPhotoEnrichment:enrichment};
const catalog=require('../world-curated-photos.js');
const gallery=require('../world-location-photo-gallery.js');
const rows=fs.readFileSync(path.join(root,'editorial/world_photo_collection_template_376.csv'),'utf8')
 .split(/\r?\n/).slice(1).filter(Boolean).map(line=>{
  const a=[...line.matchAll(/"([^"]*)"/g)].map(x=>x[1]);return{id:a[3],name:a[0],kind:a[1]};
 });
assert.equal(rows.length,376,'Preserve all 376 historic destination IDs');
let complete=0,total=0,unsourced=0;const unfinished=[];
for(const loc of rows){
 const photos=catalog.get(loc.id).filter(p=>p.file&&p.author&&p.licenseUrl&&p.filePage&&gallery.allowed(p,{id:loc.id,name:loc.name,worldKind:loc.kind}));
 const distinct=new Map(photos.map(p=>[p.file.replace(/^File:/i,'').replace(/_/g,' ').toLowerCase(),p]));
 const n=distinct.size;total+=n;
 if(n>=4)complete++;else unfinished.push({id:loc.id,missing:4-n});
 if(n===0)unsourced++;
}
assert.equal(unsourced,0,'Each destination must have a source-checked candidate');
assert.equal(complete,376,'Every destination must have at least four distinct source-checked photographs');
assert.equal(unfinished.reduce((n,x)=>n+x.missing,0),0,'All four-photo source slots must be filled');
const checked={
 'country-ao':['Sunset over Luanda 1.JPG'],
 'country-gn':['Magnifique vue de la nature.jpg','Village de Mali.jpg','On the road between Base Vie and Siguiri - panoramio.jpg'],
 'country-fm':['Chuuk coral reef.jpg','Inside the lagoon of Ant Atoll, southwest of Pohnpei (Federated States of Micronesia).jpg'],
 'country-cg':['Déplacement sur le fleuve Congo.jpg','Rive nord du Pool Malebo.JPG'],
 'sea-bering':['Bering Sea Sunset In Alaska.jpg'],
 'sea-weddell':['Tabular-iceberg weddellsea hg.jpg'],
 'sea-south-china':['Da Nang - coastal view from Marble Mountains Mar 2024 01.jpg'],
 'sea-philippine':['Batanes waters and cliffs.jpg','Dark clouds on the sea of Hualien.jpg','Divilacan Isabela.jpg'],
 'sea-labrador':['Coast of Labrador.jpg','Labrador coast islands - panoramio.jpg'],
 'sea-okhotsk':['140828 Otoko-no-namida Shiretoko Peninsula Hokkaido Japan01s5.jpg'],
 'ocean-arctic':['North Pole, Arctic Ocean, sea ice 04.jpg','Arctic Ice (4370262641).jpg'],
 'country-cd':['Congo River from Kinshasa in Democratic Republic of the Congo (DRC).jpg','Virunga National Park - Lake Edward January 2015.jpg']
};
for(const [id,files] of Object.entries(checked)){
 const photos=catalog.get(id);
 for(const file of files){
  const p=photos.find(x=>x.file.toLowerCase()==='file:'+file.toLowerCase());
  assert(p,'Missing Commons original: '+id+' / '+file);
  assert.equal(p.source,'editorial-source','Do not mislabel source metadata as visual approval');
  assert.equal(p.checked,false,'Source checks must still undergo current licence validation');
  assert(p.width>=2048&&p.height>=900&&p.author&&p.licenseUrl);
  assert(gallery.allowed(p,{id,name:id,worldKind:id.startsWith('sea-')?'sea':'country'}));
 }
}
for(const [id,notPhoto] of Object.entries({
 'sea-philippine':'USS Philippine Sea in Plymouth Sound.jpg',
 'ocean-arctic':'CSCL Arctic Ocean (ship, 2015) 001.jpg',
 'country-cd':'Congo River CBERS4 MUX satellite image at Democratic Republic of the Congo, Africa.jpg'
})){assert(!catalog.get(id).some(p=>p.file==='File:'+notPhoto),'Reject unrelated place or satellite image '+id);}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
assert(html.includes('world-photo-enrichment-v85.js?v=91'),'Browser must fetch refreshed photo manifest');
assert(sw.includes('revision-loop-v94-streak-points-only'),'Service worker cache must be versioned');
assert(sw.includes("'./world-photo-enrichment-v85.js'"),'Offline source data must remain cached');
console.log('PASS v87: '+complete+'/376 sourced four-photo galleries; '+total+' unique destination-photo pairs; '+JSON.stringify(unfinished)+' incomplete; source metadata only, not pixel approved');
