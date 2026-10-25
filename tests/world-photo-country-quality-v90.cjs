/* v90: source-verified country covers, real selection ordering and no photo-quality regression. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const discovery=require('../world-photo-discovery-data.js');
const enrichment=require('../world-photo-enrichment-v85.js');
global.window={RevisionWorldDiscoveryPhotos:discovery,RevisionWorldPhotoEnrichment:enrichment};
const catalog=require('../world-curated-photos.js'),gallery=require('../world-location-photo-gallery.js');
const groups={
 'country-at':{expected:['Schloß Schönbrunn.jpg'],banned:['Maria Carolina of Austria in the Palace of Caserta.jpg'],lead:'Schloß Schönbrunn.jpg'},
 'country-be':{expected:['The Grand Place, Brussels.jpg','Brujas, canal.jpg'],banned:['Sainte-Elisabeth church in Binche, Belgium (DSCF7800).jpg','Liberation monument in Tielt, Belgium (DSCF0068).jpg'],lead:'The Grand Place, Brussels.jpg'},
 'country-bj':{expected:['Benin village on water Ganvié.jpg'],banned:['Benignus of Dijon church in St-Benin-des-Bois (3).jpg'],lead:'Benin village on water Ganvié.jpg'},
 'country-bn':{expected:['Omar Ali Saifuddien Mosque Brunei.jpg'],banned:['Anduki Airfield main terminal building, Brunei (DSCF1450).jpg'],lead:'Omar Ali Saifuddien Mosque Brunei.jpg'},
 'country-bh':{expected:['Manama Manama Skyline 01.jpg'],banned:['Scenes from Sakhir Palace in Bahrain, as U.S. Secretary of Defense James Mattis visits Bahrain King Hamad bin Isa Al Khalifa, south of Manama, Bahrain on October 27, 2018 - 6.jpg'],lead:'Manama Manama Skyline 01.jpg'},
 'country-bf':{expected:['Bobo-Dioulasso Mosque.jpg'],banned:['EU Humanitarian Air Bridge to Burkina Faso (1).jpg'],lead:'Bobo-Dioulasso Mosque.jpg'},
 'country-dk':{expected:['Nyhavn, Copenhague.jpg'],banned:[],lead:'Nyhavn, Copenhague.jpg'},
 'country-bb':{expected:['Bridgetown, Barbados..JPG'],banned:['066a Britannia in Port of Bridgetown at night - Barbados - 3 1 - V-P.jpg'],lead:'Bridgetown, Barbados..JPG'},
 'country-ec':{expected:['Cotopaxi Volcano.jpg','Quito Panorama of the historic center from Casa Bella Vista 15.jpg'],banned:['Iguana marina (Amblyrhynchus cristatus), Las Bachas, isla Santa Cruz, islas Galápagos, Ecuador, 2015-07-23, DD 23.jpg','Iguana marina (Amblyrhynchus cristatus), isla Lobos, islas Galápagos, Ecuador, 2015-07-25, DD 47.JPG'],lead:'Quito Panorama of the historic center from Casa Bella Vista 15.jpg'},
 'country-cm':{expected:['Mount Cameroon.jpg'],banned:['Rothmannia lateriflora (Rubiaceae) from the Dja Faunal Reserve.jpg'],lead:'Mount Cameroon.jpg'}
};
const normal=x=>String(x||'').replace(/^File:/i,'').replace(/_/g,' ').toLowerCase();
const registry=fs.readFileSync(path.join(__dirname,'../editorial/world_photo_collection_template_376.csv'),'utf8')
 .split(/\r?\n/).slice(1).filter(Boolean).map(line=>{const a=[...line.matchAll(/"([^"]*)"/g)].map(x=>x[1]);return{id:a[3],name:a[0],kind:a[1]}});
assert.equal(registry.length,376);
let complete=0,approved=0;
for(const loc of registry){
 const arr=catalog.get(loc.id).filter(p=>p.file&&p.author&&p.licenseUrl&&p.filePage&&gallery.allowed(p,{id:loc.id,name:loc.name,worldKind:loc.kind}));
 const names=new Set(arr.map(x=>normal(x.file)));
 if(names.size>=4)complete++;
 if(!groups[loc.id])continue;
 const cfg=groups[loc.id];
 for(const file of cfg.expected){
  const p=arr.find(p=>normal(p.file)===normal(file));
  assert(p,'Missing country v90 photo '+loc.id+'/'+file);
  assert(p.qualityPriority===1000&&p.source==='editorial-source'&&p.checked===false,'Source metadata cannot be confused with pixel-level approval');
  assert(p.width>1500&&p.height>1200&&p.author&&p.licenseUrl.startsWith('https://creativecommons.org/'));
  assert(p.originalUrl.endsWith(encodeURIComponent(file.replace(/ /g,'_'))),'Original pixels must remain accessible');
  approved++;
 }
 for(const file of cfg.banned)assert(!names.has(normal(file)),'Known weak or wrong photo returned for '+loc.id+'/'+file);
}
assert.equal(complete,376,'Preserve 376 complete four-photo galleries');
assert.equal(approved,12);
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const sw=fs.readFileSync(path.join(__dirname,'../sw.js'),'utf8');
for(const source of ['world-curated-photos.js','world-location-photo-gallery.js'])assert(html.includes(source+'?v=91'));
assert(sw.includes('revision-loop-v92-photo-curation'));
(async()=>{
 const media={verifyNamedFiles:async photos=>photos};
 for(const [id,cfg] of Object.entries(groups)){
  const loc={id,name:id,worldKind:'country'};
  const cover=await gallery.photosFor(loc,{limit:1,media});
  const all=await gallery.photosFor(loc,{limit:4,media});
  assert.equal(all.length,4,id+' must have four selected images');
  assert.equal(cover[0]?.file,all[0]?.file,id+' shop must use gallery first image');
  assert.equal(normal(all[0]?.file),normal(cfg.lead),id+' featured lead photo changed');
  assert.equal(new Set(all.map(x=>normal(x.file))).size,4,id+' repeat photo');
 }
 console.log('PASS v90: 12 improved licensed originals across 10 countries, 376 complete source sets, consistent shop/gallery covers');
})().catch(e=>{console.error(e);process.exitCode=1;});
