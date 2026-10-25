/* Explicit World v109 photo source guard; never trust destination name alone. */
'use strict';
const assert=require('node:assert/strict');
const batch=require('../editorial/world-v109-batch-targets.json');
global.window={
 RevisionWorldDiscoveryPhotos:require('../world-photo-discovery-data.js'),
 RevisionWorldPhotoEnrichment:require('../world-photo-enrichment-v85.js'),
 RevisionWorldV104Photos:require('../world-photo-editorial-v104.js')
};
const curated=require('../world-curated-photos.js');
assert.equal(batch.targets.length,25,'Expected 25 destination review selections');
assert.equal(new Set(batch.targets).size,25);
for(const id of batch.targets){
 const chosen=batch.approvedSelections[id];
 assert.equal(chosen?.length,4,id+' requires exactly four reviewed source file names');
 assert.equal(new Set(chosen.map(p=>p.toLowerCase())).size,4,id+' duplicated a photo file');
 const photos=curated.get(id);
 for(const file of chosen){
  const photo=photos.find(p=>p.file==='File:'+file);
  assert(photo,id+' missing source-approved file: '+file);
  assert(photo.author&&photo.licenseUrl&&photo.filePage&&photo.subject,'Missing source attribution '+id+'/'+file);
  assert(photo.width>=1800&&photo.height>=800,'Too small original: '+id+'/'+file);
  assert(photo.licenseUrl.startsWith('https://creativecommons.org/'),'No redistributable CC licence for '+file);
 }
}
console.log('PASS v109: 25 explicit four-file photo sets, licensed authors, source descriptions and originals.');
