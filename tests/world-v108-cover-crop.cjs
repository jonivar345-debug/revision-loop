/* Regression for real v108 shop-card crops; human aesthetics remain pending. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const review=require('../editorial/world-v108-visual-review.json');
const batch=require('../editorial/world-v108-batch-targets.json');
assert.equal(review.destinations.length,14);
const sheet=path.join(__dirname,'../editorial/reviews/world-v108-cover-contact-sheet.jpg');
assert(fs.statSync(sheet).size>50000,'Cover contact sheet has not been generated');
for(const destination of review.destinations){
 const id=destination.destination;
 assert(batch.targets.includes(id),'Unexpected visual review destination '+id);
 assert.equal(destination.photos.length,4,id+' review must show all four gallery views');
 assert.equal(destination.photos[0].file,batch.approvedSelections[id][0],id+' shop cover does not match intended lead');
 assert(destination.photos[0].coverCropFractionOfArea>=0.67,
   id+' shop-cover aspect ratio would crop too much of the lead photograph');
 for(const pic of destination.photos){
  assert(pic.galleryDimensions[0]>=180&&pic.galleryDimensions[1]>=50);
  assert(pic.coverDimensions[0]>=180&&pic.coverDimensions[1]>=50);
  assert.equal(pic.needsHumanCompositionApproval,true,'Automated crop checks cannot certify visual composition');
 }
}
console.log('PASS v108: all 14 lead covers avoid extreme centre crops; real local image contact sheet recorded for human review.');
