/* v85 four-photo source-depth and attribution QA. Does NOT certify pixels. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=require('node:path').join(__dirname,'..');
const discover=require('../world-photo-discovery-data.js');
const enrichment=require('../world-photo-enrichment-v85.js');
global.window={RevisionWorldDiscoveryPhotos:discover,RevisionWorldPhotoEnrichment:enrichment};
const curated=require('../world-curated-photos.js');
const gallery=require('../world-location-photo-gallery.js');
const rows=fs.readFileSync(require('node:path').join(base,'editorial/world_photo_collection_template_376.csv'),'utf8')
 .split(/\r?\n/).slice(1).filter(Boolean).map(line=>{
  const p=[...line.matchAll(/"([^"]*)"/g)].map(x=>x[1]);return{id:p[3],region:p[2],name:p[0]};
 });
assert.equal(rows.length,376,'World must still include the same 376 locations');
const ids=new Set(rows.map(x=>x.id));assert.equal(ids.size,376,'World must not duplicate IDs');
const entries=Object.entries(enrichment);
const newCount=entries.reduce((n,[,ps])=>n+ps.length,0);
assert(entries.length>=60,'Release should improve at least 60 incomplete locations with new Commons sources');
assert(newCount>=120,'Release needs at least 120 independently sourced additional photographs');
let four=0,zero=0,short=0,allFiles=0;const regions=new Set();
for(const loc of rows){
 const files=curated.get(loc.id);
 const distinct=new Set(files.filter(f=>f.file&&f.author&&f.licenseUrl&&f.filePage&&gallery.allowed(f,{id:loc.id,name:loc.name,worldKind:'city'})).map(p=>p.file.replace(/^File:/,'').replace(/_/g,' ').toLowerCase()));
 if(distinct.size>=4)four++;else short++;
 if(!distinct.size)zero++;
 allFiles+=distinct.size;
}
assert.equal(zero,0,'Every destination still requires at least one verified-at-source candidate');
assert(four>=120,'Too few destinations now have four distinct Commons photo sources');
for(const [id,records] of entries){
 assert(ids.has(id),'Unrecognized historic destination id '+id);
 regions.add(rows.find(x=>x.id===id).region);
 assert(records.length>0&&records.length<=4,id+' must have 1-4 newly selected images');
 const unique=new Set();
 for(const p of records){
  assert(!unique.has(p.file.toLowerCase()),id+' contains repeated image');
  unique.add(p.file.toLowerCase());
  assert(p.author&&p.licenseUrl&&p.file&&p.subject,id+' must retain author and location evidence');
  assert(/^https:\/\/creativecommons.org\/(?:licenses\/|publicdomain\/zero\/)/.test(p.licenseUrl));
  assert(p.width>=2048&&p.height>=900,'Original file must be high-resolution '+id);
  assert.equal(p.editorialMetadata,true);
  assert(/NOT (?:visually pixel-reviewed|individual pixel-level visual approval)/.test(p.reviewStatus),'Machine-sourced != fully visual inspected');
 }
 const enriched=curated.get(id).filter(p=>String(p.photoSource||'').startsWith('Commons'));
 const qualityReplacements=new Set(['country-at','country-be','country-bj','country-bn','country-bh','country-bf','country-dk','country-bb','country-ec','country-cm']);
 const omitted=records.filter(p=>!enriched.some(e=>e.file.toLowerCase()==='file:'+p.file.toLowerCase()));
 assert.equal(records.length-enriched.length,omitted.length,'Unexpected enrichment duplicate or provenance loss '+id);
 if(omitted.length){
  assert(qualityReplacements.has(id),'Unapproved removal of an enriched image '+id);
  assert(curated.get(id).some(p=>p.qualityPriority===1000),'An omitted candidate must have a verified quality replacement '+id);
  assert(curated.get(id).filter(p=>p.file&&p.author&&p.licenseUrl).length>=4,'Do not remove a photo without preserving four options '+id);
 }
 assert(enriched.every(p=>p.checked===false&&p.source==='editorial-source'),'New candidates must pass browser current-licence validation');
}
assert(regions.size>=4,'Photo enrichment must span at least four World regions');
for(const id of ['london','busan'])assert.equal(curated.get(id).filter(x=>x.checked).length,4,'Do not change original four pixel-reviewed gallery pictures');
const shell=fs.readFileSync(require('node:path').join(base,'index.html'),'utf8');
const worker=fs.readFileSync(require('node:path').join(base,'sw.js'),'utf8');
assert(shell.indexOf('world-photo-enrichment-v85.js?v=91')<shell.indexOf('world-curated-photos.js?v=91'),'Enrichment manifest must load before curated registry');
assert(worker.includes("revision-loop-v91-place-matching"),'Offline cache must pick up source changes');
assert(worker.includes("'./world-photo-enrichment-v85.js'"),'Offline preload must include source manifest');
console.log('PASS v85: '+four+'/376 locations with >=4 distinct Commons sources, '+allFiles+' distinct location-file pairs; '+entries.length+' enriched galleries with '+newCount+' live-CC-sourced extras, '+short+' still under four, none unsourced');
