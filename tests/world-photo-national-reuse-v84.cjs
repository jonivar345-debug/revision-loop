/* Exact country/place reuse never bypasses current Commons rights checks. */
'use strict';
const assert=require('node:assert/strict');
const photos=require('../world-photo-discovery-data.js');
global.window={RevisionWorldDiscoveryPhotos:photos};
const registry=require('../world-curated-photos.js');
const places={
 'country-au':['Sydney skyline','Uluru Australia','Great barrière reef','City Skyline of Melbourne'],
 'country-br':['Christ-Redeemer-Rio'],
 'country-co':['Bogota, Colombia','Centro de Medellín'],
 'country-dk':['Christiansborg','Copenhagen Lakes'],
 'country-ge':['Narikala, Tbilisi'],
 'country-jm':['Montego Bay Photo'],
 'country-kh':['Angkor Wat Cambodia'],
 'country-me':['Kotor Bay Montenegro'],
 'country-mx':['Chichen Itzá','Panorama of Mexico City'],
 'country-my':['Downtown Kuala Lumpur'],
 'country-nl':['Amsterdam Cityscape'],
 'country-nz':['AucklandCBD2026','Government Gardens in Rotorua'],
 'country-ph':['Cityscape of Manila','Panglao Island Beach','Coron - Kayangan Lake'],
 'country-se':['Royal Dramatic Theatre Stockholm'],
 'country-us':['New York City, Skyline','Grand Canyon, Arizona','Yellowstone Grand Prismatic'],
 'country-za':['Table mountain in Cape Town']
};
let count=0;
for(const [country,names] of Object.entries(places)){
 const pics=registry.get(country);
 for(const fragment of names){
  const item=pics.find(p=>p.file.includes(fragment));
  assert(item, 'Missing correctly located '+country+' source '+fragment);
  assert(item.author&&item.licenseUrl&&item.filePage);
  assert.equal(item.checked,false, 'Even the pixel-reviewed source must be live licence-checked in new national placement');
  assert.equal(item.source,'editorial-source');
  count++;
 }
}
for(const city of ['london','busan']){
 const originals=registry.get(city).filter(p=>p.checked);
 assert.equal(originals.length,4, city+' historic four pixel-reviewed sources changed');
}
for(const [id] of Object.entries(places))
 assert(!registry.get(id).some(p=>/Antigua Guatemala|Dominican Republic .*Congo|Georgia USA/.test(p.file)),
 'Cross-country name collision detected for '+id);
console.log('PASS national photos: '+Object.keys(places).length+' accurately mapped country galleries, '+count+' direct Commons sources, all require live CC revalidation');
