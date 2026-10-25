/* Verify physical first-party files, no silently swapped v114 photographs. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const batch=require('../editorial/world-v114-batch-targets.json');
const manifest=require('../editorial/world-local-photo-pilot.json');
const local=require('../world-local-photos.js');
const accepted=batch.targets.filter(id=>manifest.locations[id]?.length===4&&JSON.stringify(manifest.locations[id])===JSON.stringify(batch.approvedSelections[id]));
assert(accepted.length>=batch.minimumGalleries&&accepted.length<=batch.maxGalleries,
 'Only '+accepted.length+' accepted galleries (minimum '+batch.minimumGalleries+')');
assert(Object.keys(manifest.locations).length>=158,'Some earlier locally hosted destinations disappeared');
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
console.log('PASS v114: '+accepted.length+' additional complete first-party galleries, previous v113 assets and attribution preserved.');
