/* v84 World photograph coverage and licensing release gate. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const src=require('../world-photo-discovery-data.js');
global.window={RevisionWorldDiscoveryPhotos:src};
const catalog=require('../world-curated-photos.js');
const root=path.join(__dirname,'..');
const rows=fs.readFileSync(path.join(root,'editorial/world_photo_collection_template_376.csv'),'utf8')
 .split(/\r?\n/).slice(1).filter(Boolean)
 .map(l=>{const f=[...l.matchAll(/"([^"]*)"/g)].map(m=>m[1]);return{id:f[3],name:f[0],region:f[2]};});
assert.equal(rows.length,376);
const unique=new Set(rows.map(x=>x.id));
assert.equal(unique.size,376,'Source coverage must not alter any shop destination ID');
const expanded=rows.filter(x=>catalog.get(x.id).length>0);
const total=expanded.reduce((sum,x)=>sum+catalog.get(x.id).length,0);
assert(expanded.length>=350,'Broad Commons audit must increase coverage to at least 350 places');
assert(total>=800,'Broad Commons audit must add hundreds of actual image records');
assert(Object.keys(src).length>=185,'Insufficient sourced exact Commons destination files');
let licenses=0;
for(const [id,photos] of Object.entries(src)){
 assert(unique.has(id),'Unknown destination: '+id);
 assert(photos.length>0&&photos.length<=4,'No more than 4 exact records per place '+id);
 const keys=new Set();
 for(const photo of photos){
  assert(photo.author&&photo.file&&photo.license&&photo.licenseUrl&&photo.subject, 'Missing Commons attribution: '+id);
  assert(photo.width>=2048&&photo.height>=900,'Low-resolution Commons photo: '+id);
  assert(/^CC (?:BY(?:-SA)? (?:2\.0|2\.5|3\.0|4\.0)|0 1\.0)$/i.test(photo.license)||/^CC0 1\.0$/i.test(photo.license));
  assert(/^https:\/\/creativecommons.org\/(?:licenses\/|publicdomain\/zero\/)/.test(photo.licenseUrl));
  assert.equal(photo.editorialMetadata,true);
  assert(/NOT individually visually inspected|NOT visually approved/.test(photo.reviewStatus),
   'Metadata candidate cannot be advertised as hand-checked photograph');
  assert(!keys.has(photo.file.toLowerCase()),'Duplicate photo within location '+id);keys.add(photo.file.toLowerCase());
  licenses++;
 }
 const presented=catalog.get(id);
 assert(presented.some(p=>p.source==='editorial-source'&&p.checked===false),
  'Uninspected records may not bypass runtime Commons verification');
}
for(const id of ['london','busan'])
 assert.equal(catalog.get(id).filter(p=>p.checked).length,4,'Original hand-inspected gallery changed: '+id);
const cache=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(cache.includes('revision-loop-v85-photo-depth-and-cover'),'Missing updated offline cache');
assert(html.includes('world-photo-discovery-data.js?v=84')&&html.includes('world-curated-photos.js?v=85'),
 'New photo sources might not load through existing browser cache');
const coveredRegions=new Set(expanded.map(x=>x.region));
assert.equal(coveredRegions.size,7,'Missing an entire geographical region');
console.log('PASS v84 Commons photo source expansion: '+expanded.length+'/376 destinations, '+total+' source records, '+Object.keys(src).length+' discovery groups, '+licenses+' licence-checked source records, seven world regions; all prior ownership and curated galleries preserved.');
