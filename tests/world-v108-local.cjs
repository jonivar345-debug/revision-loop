/* Check actual downloaded v108 galleries correspond to the approved file selection. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const batch=require('../editorial/world-v108-batch-targets.json');
const manifest=require('../editorial/world-local-photo-pilot.json');
const local=require('../world-local-photos.js');
const completed=batch.targets.filter(id=>manifest.locations[id]);
assert(completed.length>=batch.minimumGalleries,'Too few accepted complete v108 galleries');
for(const id of batch.requiredGalleries)assert(completed.includes(id),'Essential source-correction missing '+id);
for(const id of completed){
 assert.deepEqual(manifest.locations[id],batch.approvedSelections[id],id+' import selected unreviewed source substitutions');
 const photos=local.get(id);assert.equal(photos.length,4,id+' not a four-photo local gallery');
 for(let i=0;i<4;i++){
  const p=photos[i];assert.equal(p.file,'File:'+manifest.locations[id][i]);
  assert(p.url==='./assets/world/'+id+'/'+String(i+1).padStart(2,'0')+'-gallery.webp');
  assert(p.localCoverUrl==='./assets/world/'+id+'/'+String(i+1).padStart(2,'0')+'-cover.webp');
  assert(p.author&&p.licenseUrl&&p.originalPage,id+' lost licensing or source data');
  assert(fs.statSync(p.url).size>6000,id+' missing real gallery file');
  assert(fs.statSync(p.localCoverUrl).size>6000,id+' missing real cover file');
 }
}
console.log('PASS v108: '+completed.length+' new actual four-image local galleries; all six missing source galleries repaired.');
