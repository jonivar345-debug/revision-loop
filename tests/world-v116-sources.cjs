/* v116 selected source guard: locations and photo credits are checked before import. */
'use strict';
const assert=require('node:assert/strict');
const batch=require('../editorial/world-v116-batch-targets.json');
const before=require('../editorial/world-v114-protected-source-baseline.json');
const after=require('../editorial/world-local-photo-pilot.json');
global.window={RevisionWorldDiscoveryPhotos:require('../world-photo-discovery-data.js'),RevisionWorldPhotoEnrichment:require('../world-photo-enrichment-v85.js'),RevisionWorldV104Photos:require('../world-photo-editorial-v104.js')};
const curated=require('../world-curated-photos.js');
assert.equal(before.galleries,245);assert.equal(before.photos,980);
assert.equal(batch.newDestinations.length,7);
assert.equal(Object.keys(batch.replacements).length,3);
const all=[...batch.newDestinations,...Object.keys(batch.replacements)];
assert.equal(new Set(all).size,all.length);
const unchanged=Object.keys(before.locations).filter(id=>!batch.replacements[id]);
for(const id of unchanged)assert.deepEqual(after.locations[id],before.locations[id],'Protected v114 gallery changed: '+id);
for(const id of batch.newDestinations)assert(!before.locations[id],'New destination already local: '+id);
for(const [id,repair] of Object.entries(batch.replacements)){
 const old=before.locations[id],now=after.locations[id];
 assert.equal(now.length,4);
 for(const slot of repair.keep)assert.equal(now[slot-1],old[slot-1],'Protected slot changed: '+id+' '+slot);
 assert.notDeepEqual(old,now,'Replacement did not change '+id);
}
assert.equal(Object.keys(after.locations).length,252);
for(const id of all){
 const names=after.locations[id];
 assert.equal(names.length,4,id+' needs 4 photos');
 assert.deepEqual(names,batch.approvedSelections[id]);
 assert.equal(new Set(names.map(x=>x.toLowerCase())).size,4,'Repeated file '+id);
 const approved=curated.get(id);
 for(const name of names){
  const p=approved.find(x=>x.file==='File:'+name);
  assert(p&&p.author&&p.subject&&p.licenseUrl&&p.filePage,'Missing exact credited source '+id+'/'+name);
  assert(/^CC (?:BY|BY-SA)|^CC0/.test(p.license),'Unapproved licence '+id+'/'+name);
  assert(p.width>=1800&&p.height>=800,'Insufficient original '+id+'/'+name);
  assert(!/\.png$/i.test(name),'JPEG only for importer');
 }
}
console.log('PASS v116: 7 distinct 4-image additions, 3 controlled gallery repairs and 242 protected older galleries.');
