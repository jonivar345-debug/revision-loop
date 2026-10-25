/* v108 six corrected source galleries, exact manual subject selections and legal attribution */
'use strict';
const assert=require('node:assert/strict');
const batch=require('../editorial/world-v108-batch-targets.json');
global.window={RevisionWorldDiscoveryPhotos:require('../world-photo-discovery-data.js'),
 RevisionWorldPhotoEnrichment:require('../world-photo-enrichment-v85.js'),
 RevisionWorldV104Photos:require('../world-photo-editorial-v104.js')};
const curated=require('../world-curated-photos.js');
assert.equal(batch.targets.length,14);
assert.equal(batch.requiredGalleries.length,6);
for(const id of batch.targets){
 const names=batch.approvedSelections[id];
 assert.equal(names?.length,4,id+' needs exactly four manually selected sources');
 assert.equal(new Set(names.map(v=>v.toLowerCase())).size,4,id+' duplicate selected source');
 for(const file of names){
  const p=curated.get(id).find(p=>p.file==='File:'+file);
  assert(p,'Wrong place, banned or absent: '+id+' / '+file);
  assert(p.author&&p.licenseUrl&&p.originalPage&&p.subject,'Missing attribution for '+id+'/'+file);
  assert(p.width>=1800&&p.height>=800,'Under-resolution source '+id+'/'+file);
 }
}
const catalogRejected={
 'country-is':['Two bees absorbing pollen from an Iceland poppy in the flower garden of Gyeongju South Korea.jpg'],
 'country-li':['Liechtenstein Palace - Vienna.jpg'],
 'country-lu':['Palais Luxembourg Sunset Edit.JPG'],
 'country-qa':["Tulpe 'Qatar' im botanischen Garten in München 01.jpg"],
 'cartagena':['La Manga cityscape from Mirador de Monte Blanco, Cartagena, Murcia, Spain, 2022 January.jpg']
};
for(const [id,bad] of Object.entries(catalogRejected)){
 const allowed=new Set(curated.get(id).map(p=>p.file.toLowerCase()));
 for(const file of bad)assert(!allowed.has(('File:'+file).toLowerCase()),id+' wrong-place file revived: '+file);
}
console.log('PASS v108: six corrected galleries plus eight new galleries have 56 credited distinct source records.');
