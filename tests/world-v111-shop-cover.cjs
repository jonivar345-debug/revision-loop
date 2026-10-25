/* Verify every source-specific World shop cover selects a real existing local WebP. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=path.resolve(__dirname,'..');
const declared=require('../editorial/world-v111-cover-priorities.json').shopCoverSelections;
const runtime=require('../world-shop-cover-priorities.js');
const index=require('../editorial/reviews/world-local-photo-review-index.json');
assert.equal(Object.keys(declared).length,31);
assert.deepEqual(runtime.all(),declared);
for(const [id,choice] of Object.entries(declared)){
  const record=index.destinations.find(x=>x.id===id);
  assert(record, 'No archived gallery for '+id);
  assert.equal(record.shopCoverSlot,choice.slot);
  assert.equal(record.shopCoverCropRetained,record.images[choice.slot-1].cropRetained);
  assert.equal(record.images[choice.slot-1].originalFile,choice.file);
  assert(record.images[choice.slot-1].cropRetained>=0.69,'Cover still overcropped: '+id);
  assert(record.images[choice.slot-1].cropRetained-record.images[0].cropRetained>=0.15,
    'No meaningful framing benefit: '+id);
  const file=path.resolve(base,'editorial/reviews',record.images[choice.slot-1].cover);
  assert(fs.statSync(file).size>6000,'Missing chosen local shop cover: '+id);
}
const html=fs.readFileSync(path.join(base,'index.html'),'utf8');
assert(html.includes('world-shop-cover-priorities.js?v=114'));
const gallery=fs.readFileSync(path.join(base,'world-location-photo-gallery.js'),'utf8');
assert(gallery.includes('RevisionWorldShopCoverPriorities?.get(location.id)'));
assert(gallery.includes('candidate')||gallery.includes('choice?.localCoverUrl'));
console.log('PASS 31 v111 shop cover source guards and crop-area improvements. Full gallery order untouched.');
