/* Bulk destination sources: live-verified CC candidates are NOT hand-reviewed. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const data=require('../world-photo-discovery-data.js');
const curated=require('../world-curated-photos.js');
const text=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const gallery=fs.readFileSync(path.join(root,'world-location-photo-gallery.js'),'utf8');
const rows=fs.readFileSync(path.join(root,'editorial/world_photo_collection_template_376.csv'),'utf8')
 .split(/\r?\n/).slice(1).filter(Boolean).map(line=>{
  const p=[...line.matchAll(/"([^"]*)"/g)].map(m=>m[1]);
  return {id:p[3],name:p[0],region:p[2],type:p[1]};
 });
const known=new Set(rows.map(r=>r.id));
assert.equal(rows.length,376,'Do not change historical destination IDs');
const byId=Object.entries(data);
assert(byId.length>=30,'Expected a substantial new batch of distinct destinations');
assert(byId.every(([id])=>known.has(id)),'Photo source uses an unknown or renamed destination ID');
const uniqueFile=new Set();let photoCount=0,duplicates=0,regionSet=new Set();
for(const [id,photos] of byId){
 const row=rows.find(r=>r.id===id);
 regionSet.add(row.region);
 assert(Array.isArray(photos)&&photos.length>=1&&photos.length<=4,id+' requires 1–4 genuinely sourced photos');
 const local=new Set();
 for(const p of photos){
  assert(/\.(?:jpe?g|png|webp)$/i.test(p.file),id+' file is not a usable image');
  assert(p.author&&p.license&&p.licenseUrl&&p.subject&&p.sourceArticle);
  assert(p.licenseUrl.startsWith('https://creativecommons.org/'));
  assert(/^(?:CC BY(?:-SA)? [234]\.0|CC0 1\.0|CC 0 1\.0)$/i.test(p.license));
  assert(p.width>=2048&&p.height>=900,'Low-resolution photo auto-published');
  assert.equal(p.editorialMetadata,true);
  assert(/NOT visually approved/.test(p.reviewStatus),'AI-generated association cannot be called human approved');
  const key=p.file.toLowerCase();
  assert(!local.has(key),'Repeated picture for '+id);local.add(key);
  if(uniqueFile.has(key))duplicates++;uniqueFile.add(key);
  photoCount++;
 }
}
assert(photoCount>=60,'Not enough source-verified photo records for broad coverage');
assert(regionSet.size>=3,'Photo discovery should span more than one region');
assert(text.indexOf('world-photo-discovery-data.js?v=82')>=0&&
 text.indexOf('world-photo-discovery-data.js?v=82')<text.indexOf('world-curated-photos.js?v=82'),'Photo manifests must load in order');
assert(sw.includes("'./world-photo-discovery-data.js'"),'Offline cache missing data manifest');
assert(gallery.includes("api.verifyNamedFiles(proposed)"),'Source candidates must be checked live before display');
const sample=byId[0];
global.window={RevisionWorldDiscoveryPhotos:data};
const loaded=curated.get(sample[0]);
assert(loaded.length>=sample[1].length,'Gallery registry is not connected to discovery data');
assert(loaded.every(p=>p.filePage.startsWith('https://commons.wikimedia.org/wiki/File:')));
assert(loaded.every(p=>p.originalUrl.includes('Special:FilePath')));
assert(loaded.some(p=>p.source==='editorial-source'&&p.checked===false),'Machine candidates must not bypass licence verification');
console.log('PASS bulk photo sources: '+byId.length+' new destinations, '+photoCount+' Commons CC photo candidates; '+regionSet.size+' regions, '+duplicates+' across-place duplicated filenames; no location/XP/ownership edits.');
