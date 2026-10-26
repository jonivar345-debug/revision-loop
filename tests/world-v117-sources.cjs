/* Source and preservation checks for the last pre-pause photo batch. */
'use strict';
const assert=require('node:assert/strict');
const existing=require('../editorial/world-v116-protected-source-baseline.json');
const latest=require('../editorial/world-local-photo-pilot.json').locations;
const batch=require('../editorial/world-v117-batch-targets.json');
global.window={RevisionWorldDiscoveryPhotos:require('../world-photo-discovery-data.js'),RevisionWorldPhotoEnrichment:require('../world-photo-enrichment-v85.js'),RevisionWorldV104Photos:require('../world-photo-editorial-v104.js')};
const curated=require('../world-curated-photos.js');
assert.equal(existing.localDestinations,252);assert.equal(existing.localPhotographs,1008);
assert.equal(Object.keys(existing.locations).length,252);
assert.equal(batch.targets.length,14);assert.equal(new Set(batch.targets).size,14);
assert.equal(Object.keys(latest).length,266);
for(const [id,old] of Object.entries(existing.locations))
 assert.deepEqual(latest[id],old,'Historical locally hosted images changed: '+id);
for(const id of batch.targets){
 assert(!existing.locations[id],'Proposed photo location already hosted: '+id);
 assert.deepEqual(latest[id],batch.approvedSelections[id]);
 const names=latest[id];assert.equal(names.length,4);
 assert.equal(new Set(names.map(s=>s.toLowerCase())).size,4,'Repeated source in '+id);
 const photos=curated.get(id);
 for(const name of names){
   const p=photos.find(p=>p.file==='File:'+name);
   assert(p&&p.author&&p.subject&&p.filePage&&p.licenseUrl,'No accepted credited source '+id+'/'+name);
   assert(/\.jpe?g$/i.test(name),'Non-JPEG source '+id+'/'+name);
   assert(p.width>=1800&&p.height>=800,'Low-resolution source '+id+'/'+name);
   assert(/^CC0 1\.0$|^CC BY(?:-SA)? (?:2\.0|2\.5|3\.0|4\.0)$/.test(p.license),'Wrong licence '+id+'/'+name+': '+p.license);
 }
}
console.log('PASS v117: 14 distinctive, permitted four-photo sets and all 1008 earlier selections preserved.');
