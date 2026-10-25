/* Guard v105 editorial replacements before importing new Commons assets.
 * Source metadata approval is NOT full-resolution or rendered-photo approval. */
'use strict';
const assert=require('node:assert/strict');
const manifest=require('../editorial/world-local-photo-pilot.json');
global.window={
 RevisionWorldDiscoveryPhotos:require('../world-photo-discovery-data.js'),
 RevisionWorldPhotoEnrichment:require('../world-photo-enrichment-v85.js'),
 RevisionWorldV104Photos:require('../world-photo-editorial-v104.js')
};
const curated=require('../world-curated-photos.js');
const replacements={
 manila:{slot:0,file:'Jones Bridge, Manila.jpg',removed:'Cityscape of Manila, 2025 (01).jpg'},
 adelaide:{slot:1,file:'The Jetty. Glenelg, SA.jpg',removed:'Adelaide 2022 Skyline.jpg'},
 'country-tm':{slot:1,file:'Turkmenistan - Yangykala Canyon.jpg',removed:'Monument to the Constitution, Ashgabat, Turkmenistan (closeup).jpg'},
 'country-sm':{slot:3,file:'La Cesta, San Marino (2).jpg',removed:'Guaita Fortress and San Marino (2023).jpg'},
 'country-ni':{slot:1,file:'Calles de Granada en Nicaragua.JPG',removed:'Aboard the Bus - En Route to Altagracia - Ometepe Island - Nicaragua 2016.jpg'},
 'country-ro':{slot:2,file:'Bucegi Mountains, Romania.jpg',removed:'Lutheran church in Alma (Almen), Romania.jpg'},
 coron:{slot:3,file:'Twin Lagoon Coron Palawan.jpg',removed:'Coron church(코론 시내의 교회) - panoramio.jpg'}
};
for(const [id,{slot,file,removed}] of Object.entries(replacements)){
 const names=manifest.locations[id];
 assert.equal(names?.length,4,id+' four-photo manifest required');
 assert.equal(names[slot],file,id+' incorrect replacement position');
 assert(!names.includes(removed),id+' weaker photograph was retained');
 assert.equal(new Set(names.map(x=>x.toLowerCase())).size,4,id+' duplicate file source');
 const entry=curated.get(id).find(photo=>photo.file==='File:'+file);
 assert(entry,id+' new source absent from production catalogue');
 assert(entry.author&&entry.licenseUrl&&entry.originalPage,id+' missing attribution');
 assert(entry.width>=1800&&entry.height>=800,id+' insufficient original resolution');
 assert.equal(entry.editorialMetadata,true,id+' must not claim pixel-level approval');
}
console.log('PASS v105: seven source-attributed location corrections ready for real image archive and browser QA.');
