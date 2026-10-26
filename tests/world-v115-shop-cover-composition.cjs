/* World v115: the best photo should survive a bad 16:9 card crop. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const src=read('world-location-photo-gallery.js');
const css=read('styles.css');
const html=read('index.html');
const sw=read('sw.js');
const index=JSON.parse(read('editorial/reviews/world-local-photo-review-index.json'));
const assets=JSON.parse(read('assets/world/ATTRIBUTION.json'));
const ids=['oaxaca','portlouis','sanfrancisco','sea-red'];
assert(src.includes("FULL_FRAME_CARD_IDS=new Set(['oaxaca','portlouis','sanfrancisco','sea-red'])"));
assert(src.includes("card&&Boolean(photo.localCoverUrl)&&FULL_FRAME_CARD_IDS.has(location.id)"));
assert(src.includes("backdrop.setAttribute('aria-hidden','true')"));
assert(src.includes('if(backdrop)backdrop.src=image.src'));
assert(src.includes("image.classList.add('card-cover-full-image')"));
assert(css.includes('.full-frame-card-cover img.card-cover-backdrop'));
assert(css.includes('.full-frame-card-cover img.card-cover-full-image'));
assert(css.includes('object-fit:contain!important'));
assert(html.includes('styles.css?v=120')||html.includes('styles.css?v=77'));
assert(html.includes('world-location-photo-gallery.js?v=117'));
assert(sw.includes('revision-loop-v114-catalogue-sourced-world-galleries-energetics-v51-v115-full-frame-covers'));
for(const id of ids){
  const rec=index.destinations.find(x=>x.id===id);
  assert(rec,id+' needs an existing local gallery');
  assert.equal(rec.images.length,4,id+' original gallery must have four images');
  assert.equal(rec.shopCoverSlot,1,id+' original first image must remain the shop selection');
  assert(rec.shopCoverCropRetained<.67,id+' previously affected by aggressive cropping');
  const original=rec.images[0];
  assert(assets.some(x=>x.destination===id&&x.originalFile===original.originalFile),
    id+' original licensed source must be retained');
  for(const image of rec.images){
    assert(fs.existsSync(path.resolve(root,'editorial/reviews',image.gallery)),id+' gallery source lost');
    assert(fs.existsSync(path.resolve(root,'editorial/reviews',image.cover)),id+' local cover lost');
  }
}
assert(index.photoCount>=980,'No photograph may disappear from v114 baseline');
assert(index.fullyLocal>=245,'No full gallery may disappear from v114 baseline');
console.log('PASS v115: four iconic local cover photographs retained, full-frame CSS available, no photo/progress changes.');
