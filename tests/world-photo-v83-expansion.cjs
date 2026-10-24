/* Strict release gate: broad, source-first CC photos without changing any user data. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const photos=require('../world-photo-discovery-data.js');
const world=require('../world-curated-photos.js');
global.window={RevisionWorldDiscoveryPhotos:photos};
const base=path.join(__dirname,'..');
const csv=fs.readFileSync(path.join(base,'editorial/world_photo_collection_template_376.csv'),'utf8');
const rows=csv.split(/\r?\n/).slice(1).filter(Boolean).map(line=>{
 const fields=[...line.matchAll(/"([^"]*)"/g)].map(m=>m[1]);
 return{id:fields[3],name:fields[0],region:fields[2]};
});
assert.equal(rows.length,376,'Original destination IDs must never be changed');
const names=new Set(rows.map(r=>r.id));
const ids=Object.keys(photos);
const compiled=rows.filter(x=>world.get(x.id).length>0);
const sum=compiled.reduce((n,x)=>n+world.get(x.id).length,0);
assert(compiled.length>=260,'Large-batch launch requires at least 260 destinations');
assert(sum>=530,'Large-batch launch requires 530 sourced records');
assert(ids.length>=100,'Batched Commons trial must source at least 100 distinct places');
assert(new Set(ids).size===ids.length&&ids.every(x=>names.has(x)),'Discovery has an unknown destination or duplicate ID');
const regions=new Set(compiled.map(x=>x.region));
assert(regions.size===7,'Photo source coverage must include city and marine destinations');
let candidateCount=0,photoCount=0,wrongCount=0;
const qualityBlocked=/\b(?:population[ _-]*pyramid|ethnographic[ _-]*map|street[ _-]*circuit|police[ _-]*interceptor|airport[ _-]*terminal|political[ _-]*crisis|olympic[ _-]*handball|presidential[ _-]*address)\b/i;
for(const [id,items] of Object.entries(photos)){
 assert(Array.isArray(items)&&items.length>=1&&items.length<=4, id+' must have between one and four sources');
 const local=new Set();
 for(const p of items){
  photoCount++;
  const key=p.file.toLowerCase();
  assert(!local.has(key),'Duplicate auto photo '+id);local.add(key);
  assert(p.author&&p.license&&p.licenseUrl&&p.subject&&p.sourceArticle,'Incomplete Commons metadata '+id);
  assert(/^(?:CC BY(?:-SA)? (?:2\.0|2\.5|3\.0|4\.0)|CC0 1\.0|CC 0 1\.0)$/i.test(p.license));
  assert(/^https:\/\/creativecommons.org\/(?:licenses\/|publicdomain\/zero\/)/.test(p.licenseUrl));
  assert(p.width>=2048&&p.height>=900,'Not high-resolution '+id);
  assert(p.editorialMetadata===true);
  assert(/NOT (?:visually approved|individually visually inspected)/.test(p.reviewStatus),'Machine photo must never masquerade as personally inspected');
  assert(!qualityBlocked.test(p.file),'Poor, unrelated gallery photo remains '+id+': '+p.file);
 }
 const display=world.get(id);
 assert(display.some(x=>x.source==='editorial-source'&&x.checked===false),'Unreviewed file bypasses live Commons verification '+id);
 candidateCount+=display.length;
}
for(const photo of photos['country-jm']||[])
 assert(!/Jamaica Bay Wildlife|Jamaica Street|plane Photo Don Ramey Logan/i.test(photo.file),'Reject off-island, aircraft and London road images for Jamaica');
for(const photo of photos['ocean-atlantic']||[])
 assert(!/Nesocichla eremita|Show Your Stripes/i.test(photo.file),'Reject island-bird and climate chart images in Atlantic scenery');
assert(world.get('bergen').some(p=>p.file.includes('Bryggen')),'Exact old country photo not reused in Bergen');
assert(world.get('granada').some(p=>p.file.includes('Alhambra')),'Exact Granada landmark reuse missing');
assert(world.get('vilnius').some(p=>p.file.includes('Vilnius Old Town')),'Vilnius landmark reuse missing');
assert(world.get('chicago').every(p=>!p.file.includes('Police Interceptor')),'Wrong Chicago photo not removed');
assert(world.get('country-az').every(p=>!p.file.includes('population pyramid')),'Population charts cannot count as country pictures');
for(const id of ['london','busan'])assert.equal(world.get(id).filter(p=>p.checked).length,4,'Original individually pixel-reviewed gallery must remain');
assert(fs.readFileSync(path.join(base,'sw.js'),'utf8').includes("revision-loop-v90-stronger-covers"));
console.log('PASS v83 extensive coverage: '+compiled.length+' source-backed locations, '+sum+' source records, '+ids.length+' discovery groups, '+photoCount+' provisional CC photographs; existing London/Busan unchanged, rejects scenery mismatches, current Commons validation remains required.');
