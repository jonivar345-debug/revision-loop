/* Four source-checked landmark candidates for four high-use cities, safely validated at runtime. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const curated=require('../world-curated-photos.js');
const gallery=require('../world-location-photo-gallery.js');
// Simulate the browser global used by the source registry; Node has no window.
global.window={RevisionWorldCuratedPhotos:curated};
const base=path.join(__dirname,'..');
const list={tokyo:['Shibuya Crossing','Tokyo Tower','Sensō-ji','Tokyo Skytree'],
 seoul:['Seoul from Namsan','Gyeongbokgung','Bukchon','Myeongdong Cathedral'],
 tbilisi:['Narikala','Holy Trinity Cathedral','sulphur','Panorama'],
 singapore:['Marina Bay Sands','Gardens by the Bay','Chinatown','Jewel Changi'],
 paris:['Eiffel Tower','Louvre','Montmartre','Notre-Dame'],
 newyork:['New York skyline','Brooklyn Bridge','Central Park','Times Square'],
 hongkong:['Victoria Peak','Star Ferry','Hong Kong tram','Tian Tan Buddha'],
 sydney:['Sydney Harbour','Sydney Opera House','Sydney Harbour Bridge','Bondi Beach'],
 shanghai:['The Bund','Yu Garden','Oriental Pearl Tower','East Nanjing Road'],
 beijing:['Forbidden City','Temple of Heaven','Summer Palace','hutong'],
 kyoto:['Fushimi Inari','Kiyomizu','Gion','Arashiyama'],
 rome:['Colosseum','Trevi Fountain','Pantheon','Roman Forum'],
 istanbul:['Hagia Sophia','Galata Tower','Bosphorus Bridge','Grand Bazaar'],
 barcelona:['Sagrada Família','Parc Güell','Casa Batlló','Gothic Quarter'],
 venice:['Grand Canal','St Mark','Bridge of Sighs','gondolas'],
 dubrovnik:['Old Town','city walls','Stradun','Minčeta Tower'],
 bangkok:['Grand Palace','Wat Arun','Chao Phraya','Chinatown']};
let total=0;
for(const [city,subjects] of Object.entries(list)){
 const records=curated.get(city);
 assert(records.length>=4,city+' must offer four source-checked landmark candidates');
 const first=records.slice(0,4);
 assert.equal(new Set(first.map(p=>p.file)).size,4,city+' has duplicate curated file names');
 for(let i=0;i<4;i++){
  const p=first[i];
  assert(p.description.toLowerCase().includes(subjects[i].toLowerCase()),city+' image '+i+' has unexpected subject');
  assert.equal(p.source,'editorial-source','Source-researched != hand-reviewed images');
  assert.equal(p.checked,false,'Source candidates must not bypass live Commons verification');
  assert(p.locationVerified);
  assert(p.author&&p.license&&p.filePage&&p.licenseUrl);
  if(['hongkong','sydney','shanghai','beijing','kyoto','rome','istanbul','barcelona','venice','dubrovnik','bangkok'].includes(city)){
   assert(p.width>=2048&&p.height>=900,city+' original source is too small');
   assert(p.reviewStatus.includes('2026-10-24'),'Exact Commons source check missing');
  }
  assert(p.url.includes('width=2048'),'Gallery resolution silently decreased');
  assert(p.originalUrl.startsWith('https://commons.wikimedia.org/wiki/Special:FilePath/'));
  total++;
 }
}
const html=fs.readFileSync(path.join(base,'index.html'),'utf8');
const worker=fs.readFileSync(path.join(base,'sw.js'),'utf8');
assert(html.includes('world-curated-photos.js?v=92'),'Latest photo selection script must bypass stale URL caches');
assert(worker.includes('revision-loop-v92-photo-curation'),'Offline shell version must be advanced');
const fakeMedia={
 verifyNamedFiles:async proposals=>proposals.map((p,i)=>({
  ...p,url:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/example-'+i+'.jpg/2048px-example.jpg',
  source:'editorial-live-checked',
  width:4000,height:3000,locationVerified:true
 })),
 searchPage:async()=>[],
 searchArticleImages:async()=>[],
 searchNearby:async()=>[],
 verifyApproved:async()=>null,
 search:async()=>[]
};
(async()=>{
 for(const city of Object.keys(list)){
  const loc={id:city,name:city,wiki:city};
  const all=await gallery.photosFor(loc,{limit:4,media:fakeMedia});
  const cover=await gallery.photosFor(loc,{limit:1,media:fakeMedia});
  assert.equal(all.length,4,city+' missing four verified images in the browser picker');
  assert.equal(cover.length,1);
  assert.equal(cover[0].filePage,all[0].filePage,
   city+' cover must be identical to first unlocked gallery photo');
 }
 const failed={
  verifyNamedFiles:async()=>[],searchPage:async()=>[],searchArticleImages:async()=>[],
  searchNearby:async()=>[],verifyApproved:async()=>null,search:async()=>[]
 };
 const none=await gallery.photosFor({id:'seoul',name:'Seoul'},{media:failed});
 assert.equal(none.length,0,'Outdated unverified images may not bypass source verification');
 console.log('PASS featured cities: '+total+' source-checked photo candidates across 17 places, high-resolution delivery, four-image selection and safe Commons failure handling');
})().catch(e=>{console.error(e);process.exitCode=1});