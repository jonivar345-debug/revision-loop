/* v89 source-verified country photos, catalogue integrity and deterministic cover behaviour.
 * This does not establish manual pixel review or actual CDN availability. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const data=require('../world-photo-discovery-data.js');
const extras=require('../world-photo-enrichment-v85.js');
global.window={RevisionWorldDiscoveryPhotos:data,RevisionWorldPhotoEnrichment:extras};
const catalog=require('../world-curated-photos.js'),gallery=require('../world-location-photo-gallery.js');
const dir=path.join(__dirname,'..');
const rows=fs.readFileSync(path.join(dir,'editorial/world_photo_collection_template_376.csv'),'utf8')
.split(/\r?\n/).slice(1).filter(Boolean).map(line=>{
  const a=[...line.matchAll(/"([^"]*)"/g)].map(x=>x[1]);
  return {id:a[3],name:a[0],kind:a[1],region:a[2]};
});
assert.equal(rows.length,376);
const changes={
 'country-bz':{
  added:['Xunantunich Belize 1 16.jpg','Big Rock Falls Belize.jpg'],
  removed:['Great Blue Hole Belize.jpg','Hirtella racemosa Mountain Pine Ridge Belize.jpg']},
 'country-iq':{
  added:['Marshes in southern Iraq.jpeg','مأذنة الملوية في سامراء Malwiya Minaret Samarra.jpg'],
  removed:["Sumerian scene, milking cows and making dairy products. From the facade of the Temple of Ninhursag at Tell al-'Ubaid, Iraq, 2800-2600 BCE. Iraq Museum.jpg",'Inscribed wall slab from the Great Mosque of al-Nuri in Mosul, Iraq, 6th century AH. Iraq Museum.jpg']},
 'country-sz':{
  added:['Mantenga Falls.jpg'],
  removed:['ESwatini Road Sunrise with road works.jpg']},
 'country-do':{
  added:['Santo Domingo - Fortaleza Ozama 0891.jpg'],
  removed:['Dominican Day Parade 2019 (50335870922).jpg']},
 'country-om':{
  added:['Nizwa Fort - Oman.jpg','Wahiba Sands, Oman.jpg'],
  removed:['Aflaj Gallery in The National Museum Oman,.jpg','Traditional Omani Food.jpg']},
 'country-am':{
  added:['Lake Sevan and Sevan National Park.jpg','Noravank D 01.jpg'],
  removed:['Geghard Monastery, Church, Armenia.jpg','Geghard Monastery, Entrance, Armenia.jpg']}
};
const normal=file=>String(file).replace(/^File:/i,'').replace(/_/g,' ').toLowerCase();
let complete=0,sourcePairs=0,removed=0,added=0;const gapIds=[];
for(const loc of rows){
 const known=new Map();
 for(const photo of catalog.get(loc.id)){
  if(!gallery.allowed(photo,{id:loc.id,name:loc.name,worldKind:loc.kind})||!photo.author||!photo.licenseUrl||!photo.filePage)continue;
  known.set(normal(photo.file),photo);
 }
 sourcePairs+=known.size;
 if(known.size>=4)complete++;else gapIds.push(loc.id);
 const c=changes[loc.id];if(!c)continue;
 for(const file of c.removed){assert(!known.has(normal(file)),'Old weak/wrong photo is back '+loc.id+'/'+file);removed++}
 for(const file of c.added){
  const photo=known.get(normal(file));
  assert(photo,'Expected location-source record missing: '+loc.id+'/'+file);
  assert.equal(photo.checked,false,'Source-page research must not claim full pixel approval');
  assert.equal(photo.source,'editorial-source','New photos must be reverified against live Commons rights');
  assert(photo.author&&photo.licenseUrl.startsWith('https://creativecommons.org/'));
  assert(photo.filePage.startsWith('https://commons.wikimedia.org/wiki/File:'));
  assert(photo.originalUrl.startsWith('https://commons.wikimedia.org/wiki/Special:FilePath/'));
  if(photo.width)assert(photo.width>=2048&&photo.height>=1000);
  added++;
 }
}
assert.deepEqual(gapIds.sort(),require('../editorial/world-v107-catalogue-eligibility-gaps.json').gaps.map(x=>x.id).sort(),'Unreviewed catalogue gap appeared');
assert.equal(complete,365,'Only vetted remote-file matches count towards four-source coverage');
assert.equal(removed,10);
assert.equal(added,10);
const html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(dir,'sw.js'),'utf8');
for(const part of ['world-photo-discovery-data.js?v=91','world-photo-enrichment-v85.js?v=91','world-curated-photos.js?v=109'])assert(html.includes(part),'Browser must use latest photo registry: '+part);
assert(sw.includes('revision-loop-v114-catalogue-sourced-world-galleries'),'New image sources require new service-worker cache');
(async()=>{
 const fakeMedia={verifyNamedFiles:async photos=>photos,searchPage:async()=>[],searchArticleImages:async()=>[],searchNearby:async()=>[],search:async()=>[],verifyApproved:async()=>null};
 for(const id of Object.keys(changes)){
  const loc=rows.find(x=>x.id===id);
  const all=await gallery.photosFor(loc,{limit:4,media:fakeMedia});
  const cover=await gallery.photosFor(loc,{limit:1,media:fakeMedia});
  assert.equal(all.length,4,id+' incomplete unlocked gallery');
  assert.equal(cover.length,1,id+' incomplete shop cover');
  assert.equal(cover[0].file,all[0].file,id+' shop photo differs from gallery first photo');
  assert.equal(new Set(all.map(x=>normal(x.file))).size,4,id+' repeated picture');
  assert(all.every(x=>x.url.includes('width=2048')),'Full gallery should retain the 2048px Commons derivative');
 }
 console.log('PASS v89: '+complete+'/376 four-source galleries, '+sourcePairs+' location/photo pairs, '+added+' source-checked replacements and '+removed+' blocked false matches; shop/gallery source order consistent for six priority destinations.');
})().catch(e=>{console.error(e);process.exitCode=1});
