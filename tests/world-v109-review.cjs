/* Real archive metadata, four-photo coverage and crop-preview infrastructure. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const records=require('../editorial/reviews/world-local-photo-review-index.json');
const manifest=require('../editorial/world-local-photo-pilot.json');
assert.equal(records.galleryCount,Object.keys(manifest.locations).length);
assert.equal(records.photoCount,Object.values(manifest.locations).reduce((n,a)=>n+a.length,0));
assert.equal(records.fullyLocal,Object.values(manifest.locations).filter(x=>x.length===4).length);
assert(records.galleryCount>=158,'Review page must include all new and previous local photos');
assert.equal(records.destinations.length,records.galleryCount);
const ids=new Set();
for(const destination of records.destinations){
 const id=destination.id;
 assert(!ids.has(id),'Repeated review destination '+id);ids.add(id);
 assert.equal(destination.images.length,manifest.locations[id].length);
 assert.equal(destination.reviewStatus,'needs-human-visual-approval');
 for(const [i,photo] of destination.images.entries()){
  assert.equal(photo.originalFile,manifest.locations[id][i]);
  assert(photo.gallery.startsWith('../../assets/world/'+id+'/'));
  assert(photo.cover.startsWith('../../assets/world/'+id+'/'));
  for(const file of [photo.gallery,photo.cover]){
   const p=path.resolve(root,'editorial/reviews',file);
   assert(p.startsWith(path.join(root,'assets/world/')),'No external photo dependency in review');
   assert(fs.statSync(p).size>6000,'Missing actual local image '+p);
  }
  assert(photo.cropRetained>0&&photo.cropRetained<=1,'Invalid crop metric '+id);
  assert(photo.author&&photo.licenseUrl&&photo.sourcePage,id+' original attribution missing');
 }
}
const page=fs.readFileSync(path.join(root,'editorial/reviews/world-photo-review.html'),'utf8');
for(const text of ['world-local-photo-review-index.json','img.loading','Copy feedback text','Full gallery photographs'])
 assert(page.includes(text),'Review browser page missing '+text);
const batch=require('../editorial/world-v109-batch-targets.json');
const updated=records.destinations.filter(x=>x.newInV109);
assert(updated.length>=batch.minimumGalleries,'New destinations not shown in review page');
console.log('PASS v109: all '+records.photoCount+' genuine local WebPs indexed with cover crop metrics, photo URLs and attribution.');
