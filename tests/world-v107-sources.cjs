/* V107 protects the World against image-name false positives and automatic filler. */
'use strict';
const assert=require('node:assert/strict');
const batch=require('../editorial/world-v107-batch-targets.json');
global.window={
 RevisionWorldDiscoveryPhotos:require('../world-photo-discovery-data.js'),
 RevisionWorldPhotoEnrichment:require('../world-photo-enrichment-v85.js'),
 RevisionWorldV104Photos:require('../world-photo-editorial-v104.js')
};
const curated=require('../world-curated-photos.js');
assert.equal(batch.targets.length,20);
assert.equal(new Set(batch.targets).size,20);
for(const id of batch.targets){
 const chosen=batch.approvedSelections[id];
 assert.equal(chosen?.length,4,'Four human-selected sources expected for '+id);
 assert.equal(new Set(chosen.map(x=>x.toLowerCase())).size,4,id+' repeated source');
 const photos=curated.get(id);
 for(const file of chosen){
  const p=photos.find(x=>x.file==='File:'+file);
  assert(p,id+' selected image missing from allowed source archive: '+file);
  assert(p.author&&p.licenseUrl&&p.originalPage,'Creator or licence absent for '+id);
  assert(Number(p.width)>=1800&&Number(p.height)>=800,id+' source image is too small: '+file);
 }
}
const rejected={
 'country-is':['Two bees absorbing pollen from an Iceland poppy in the flower garden of Gyeongju South Korea.jpg','Field of Iceland poppies in the flower garden near Cheomseongdae Observatory in Gyeongju South Korea.jpg','Icelandic landscapes.jpg'],
 'country-li':['Liechtenstein Palace gardens - Vienna.jpg','Liechtenstein Palace - Vienna.jpg','Liechtenstein Palace Gate - Vienna.jpg'],
 'country-lu':['Palais du Luxembourg, South View 140116 1.jpg','Palais Luxembourg Sunset Edit.JPG'],
 'country-qa':["Tulpe 'Qatar' im botanischen Garten in München 01.jpg"],
 'cartagena':['Agricultural landscape around Rambla de la Mina in Campo Nubla, Cartagena, Murcia, Spain, 2022 January.jpg','La Manga cityscape from Mirador de Monte Blanco, Cartagena, Murcia, Spain, 2022 January.jpg'],
 'porto':['Isola di Pianosa Vecchio Porto panoramic01 2018-05-30.jpg','20101016 Agios Nikolaos Metoxi Batopediou Porto Lagos Vistonida Lake Rhodope Greece.jpg','Porto Alegre - Brazil Landscape-Night.jpg']
};
for(const [id,files] of Object.entries(rejected)){
 const allowed=new Set(curated.get(id).map(p=>p.file.toLowerCase()));
 for(const bad of files)assert(!allowed.has(('File:'+bad).toLowerCase()),id+' still offers misleading photo: '+bad);
}
console.log('PASS World v107: 20 explicit destination sets and misleading cross-place source candidates excluded.');
