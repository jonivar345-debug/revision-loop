/* Check actual optimized, locally hosted WebPs after the v117 import. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const base=require('../editorial/world-v116-protected-source-baseline.json');
const batch=require('../editorial/world-v117-batch-targets.json');
const now=require('../editorial/world-local-photo-pilot.json').locations;
const audit=require('../editorial/world-local-photo-audit-v117.json');
const index=require('../editorial/reviews/world-local-photo-review-index.json');
const attribution=require('../assets/world/ATTRIBUTION.json');
const local=require('../world-local-photos.js');
assert.equal(Object.keys(now).length,266);
assert.equal(attribution.length,1064);
assert.equal(audit.localPhotographs,1064);assert.equal(audit.fourPhotoLocalGalleries,266);
assert.equal(audit.release,'v117');
assert.equal(index.photoCount,1064);assert.equal(index.fullyLocal,266);
assert.equal(index.galleryCount,266);
assert.deepEqual(batch.newDestinations,batch.targets);
for(const [id,prior] of Object.entries(base.locations)){
 assert.deepEqual(now[id],prior,'Preserved v116 photo set changed: '+id);
 const images=local.get(id);assert.equal(images.length,4);
 for(let i=0;i<4;i++)assert.equal(images[i].file,'File:'+prior[i]);
}
for(const id of batch.targets){
 const names=batch.approvedSelections[id],images=local.get(id);
 assert.deepEqual(now[id],names);assert.equal(images.length,4);
 const record=index.destinations.find(d=>d.id===id);
 assert(record&&record.images.length===4,'Missing visual review gallery: '+id);
 for(let i=0;i<4;i++){
  const entry=images[i],source=attribution.find(a=>a.destination===id&&a.originalFile===names[i]);
  assert(source&&source.author&&source.licenseUrl&&source.sourcePage,'Missing licensed source '+id+'/'+names[i]);
  assert.equal(entry.file,'File:'+names[i]);
  for(const file of [entry.url,entry.localCoverUrl]){
   const bytes=fs.readFileSync(path.join(root,file));
   assert(bytes.length>=6000&&bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP','Not a WebP: '+file);
  }
 }
}
assert.equal(audit.suspectedVisualDuplicates.length,0,'Photo near-duplicates need review');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const worker=fs.readFileSync(path.join(root,'sw.js'),'utf8');
assert(html.includes('progress-backup.js?v=1')&&worker.includes("'./progress-backup.js'"),'Do not lose backup feature');
assert(html.includes('world-local-photos.js?v=117'),'Browser must load current gallery JS');
assert(html.includes('world-photo-editorial-v104.js?v=117'),'Browser must load current editorial source');
console.log('PASS v117: 1064 locally hosted photographs, 266 complete galleries, all older sources and backup features safe.');
