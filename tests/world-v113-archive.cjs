/* Verify physical first-party files, no silently swapped v113 photographs. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const batch=require('../editorial/world-v113-batch-targets.json');
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
const previous=require('../editorial/world-v112-batch-targets.json');
for(const id of previous.targets)assert.deepEqual(manifest.locations[id],previous.approvedSelections[id],'Regression in previously accepted v112 gallery '+id);
const oldParts={
 'country-bz':['Belize Blue Hole.jpg','Cockscomb Basin waterfall.jpg'],
 'country-kz':['ПОЮЩИЙ БАРХАН.jpg'],
 'country-sz':['Mlilwane Wildlife Sanctuary in Eswatini 01.jpg','Mantenga Falls.jpg']
};
for(const [id,old] of Object.entries(oldParts)){
 assert.deepEqual(manifest.locations[id].slice(0,old.length),old,'Old partial gallery first slots were replaced: '+id);
 assert.equal(local.get(id).length,4,'Previously incomplete gallery not finished: '+id);
}
assert.equal(Object.values(manifest.locations).filter(p=>p.length!==4).length,0,'One or more previously incomplete galleries remain');
console.log('PASS v113: '+accepted.length+' additional complete first-party galleries, previous v112 assets and attribution preserved.');
