/* Check that every accepted new local gallery matches its explicitly picked sources. */
'use strict';
const assert=require('node:assert/strict');
const manifest=require('../editorial/world-local-photo-pilot.json');
const batch=require('../editorial/world-v107-batch-targets.json');
const local=require('../world-local-photos.js');
const ids=batch.targets.filter(id=>manifest.locations[id]);
assert(ids.length>=batch.minimumGalleries,'Too few confirmed v107 local destinations: '+ids.length);
assert(ids.length<=batch.maxGalleries);
for(const id of ids){
 const expected=batch.approvedSelections[id];
 const actual=manifest.locations[id];
 assert.deepEqual(actual,expected,id+' source list silently substituted');
 const pictures=local.get(id);
 assert.equal(pictures.length,4,id+' not fully local');
 for(let i=0;i<4;i++){
  assert.equal(pictures[i].file,'File:'+expected[i],id+' wrong image');
  assert(pictures[i].url.includes('/assets/world/'+id+'/')||pictures[i].url.includes('./assets/world/'+id+'/'),id+' not locally served');
  assert(pictures[i].author&&pictures[i].licenseUrl&&pictures[i].filePage,id+' lost original image credits');
 }
}
console.log('PASS World v107: '+ids.length+' fully local, file-name-locked four-photo destination galleries.');
