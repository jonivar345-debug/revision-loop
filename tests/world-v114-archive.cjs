/* Verify physical first-party files, no silently swapped v114 photographs. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const batch=require('../editorial/world-v114-batch-targets.json');
const manifest=require('../editorial/world-local-photo-pilot.json');
const local=require('../world-local-photos.js');
const repairs=require('../editorial/world-v116-batch-targets.json').replacements;
const allowedReplacementCount=Object.keys(repairs).filter(id=>batch.targets.includes(id)).length;
const accepted=batch.targets.filter(id=>manifest.locations[id]?.length===4&&JSON.stringify(manifest.locations[id])===JSON.stringify(batch.approvedSelections[id]));
assert(accepted.length>=batch.minimumGalleries-allowedReplacementCount&&accepted.length<=batch.maxGalleries,
 'Only '+accepted.length+' accepted galleries (minimum '+batch.minimumGalleries+')');
assert(Object.keys(manifest.locations).length>=158,'Some earlier locally hosted destinations disappeared');
for(const [id,repair] of Object.entries(repairs)){
 if(!batch.targets.includes(id))continue;
 const previous=batch.approvedSelections[id], current=manifest.locations[id];
 assert.equal(current.length,4);
 for(const slot of repair.keep){assert.equal(current[slot-1],previous[slot-1],id+' protected original photo lost');}
}
for(const id of accepted){
 assert.deepEqual(manifest.locations[id],batch.approvedSelections[id],id+' got unexpected photo replacements');
 const photos=local.get(id);
 assert.equal(photos.length,4,id+' was not fully archived');
 for(const [i,p] of photos.entries()){
  const pad=String(i+1).padStart(2,'0');
  assert.equal(p.file,'File:'+batch.approvedSelections[id][i]);
  assert.equal(p.url,'./assets/world/'+id+'/'+pad+'-gallery.webp');
  assert.equal(p.localCoverUrl,'./assets/world/'+id+'/'+pad+'-cover.webp');
  assert(fs.statSync(path.join(root,p.url)).size>6000,id+' missing gallery WebP');
  assert(fs.statSync(path.join(root,p.localCoverUrl)).size>6000,id+' missing shop cover WebP');
  assert(p.author&&p.licenseUrl&&p.filePage,'Lost photographer or licence credits '+id);
 }
}
const previous=require('../editorial/world-v113-batch-targets.json');
for(const id of previous.targets)assert.deepEqual(manifest.locations[id],previous.approvedSelections[id],'Regression in previously accepted v113 gallery '+id);
const previousAudit=require('../editorial/world-local-photo-audit-v113.json');
const currentAudit=require('../editorial/world-local-photo-audit-v114.json');
const review=require('../editorial/reviews/world-local-photo-review-index.json');
assert(currentAudit.localPhotographs>=previousAudit.localPhotographs+4*batch.minimumGalleries,
 'Existing photo archive shrank during v114');
assert(currentAudit.fourPhotoLocalGalleries>=previousAudit.fourPhotoLocalGalleries+batch.minimumGalleries,
 'Existing full galleries vanished during v114');
assert.equal(currentAudit.localPhotographs,review.photoCount,'v114 photo review count is stale');
assert.equal(currentAudit.fourPhotoLocalGalleries,review.fullyLocal,'v114 gallery review count is stale');
assert.equal(review.destinations.filter(x=>x.images.length!==4).length,0,
 'A previously complete World destination is now missing photos');
console.log('PASS v114 historical sources protected: '+accepted.length+' unmodified galleries and '+allowedReplacementCount+' explicit later editorial repairs; v113 assets intact.');
