/* Check v116 archive AFTER all real WebPs and audit/review index have been regenerated. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
const before=require('../editorial/world-v114-protected-source-baseline.json');
const manifest=require('../editorial/world-local-photo-pilot.json').locations;
const batch=require('../editorial/world-v116-batch-targets.json');
const local=require('../world-local-photos.js');
const attribution=require('../assets/world/ATTRIBUTION.json');
const audit=require('../editorial/world-local-photo-audit-v116.json');
const index=require('../editorial/reviews/world-local-photo-review-index.json');
assert.equal(Object.keys(manifest).length,252);
assert.equal(audit.localPhotographs,1008);assert.equal(audit.fourPhotoLocalGalleries,252);
assert.equal(index.photoCount,1008);assert.equal(index.fullyLocal,252);
assert.equal(attribution.length,1008);assert.equal(audit.release,'v116');
for(const [id,old] of Object.entries(before.locations)){
 const repaired=batch.replacements[id]; const now=manifest[id];
 if(!repaired)assert.deepEqual(now,old,'Original gallery changed outside v116 repairs: '+id);
 else for(const slot of repaired.keep)assert.equal(now[slot-1],old[slot-1],'Original slot changed: '+id+'/'+slot);
}
for(const [id,names] of Object.entries(batch.approvedSelections)){
 assert.deepEqual(manifest[id],names);
 const photos=local.get(id);
 assert.equal(photos.length,4);
 for(let i=0;i<4;i++){
   const p=photos[i],asset=attribution.find(x=>x.destination===id&&x.originalFile===names[i]);
   assert.equal(p.file,'File:'+names[i]);
   assert(asset&&asset.author&&asset.license&&asset.licenseUrl&&asset.sourcePage);
   for(const file of [p.url,p.localCoverUrl]){
     const loc=path.join(root,file);
     const buf=fs.readFileSync(loc);
     assert(buf.length>6000&&buf.toString('ascii',0,4)==='RIFF'&&buf.toString('ascii',8,12)==='WEBP','Not committed WebP: '+file);
   }
 }
}
assert(!audit.suspectedVisualDuplicates.length,'Near-duplicate pair requires human review');
console.log('PASS v116: 1008 real local photos; 252 complete galleries; all untouched historical images protected.');
