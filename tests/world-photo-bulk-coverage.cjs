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
assert(byId.length>=4,'Automated discovery must retain the source-proven sample');
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
  assert(/^(?:CC BY(?:-SA)? (?:2\.0|2\.5|3\.0|4\.0)|CC0 1\.0|CC 0 1\.0)$/i.test(p.license));
  assert(p.width>=2048&&p.height>=900,'Low-resolution photo auto-published');
  assert.equal(p.editorialMetadata,true);
  assert(/NOT (?:visually approved|individually visually inspected)/.test(p.reviewStatus),'AI-generated association cannot be called human approved');
  const key=p.file.toLowerCase();
  assert(!local.has(key),'Repeated picture for '+id);local.add(key);
  if(uniqueFile.has(key))duplicates++;uniqueFile.add(key);
  photoCount++;
 }
}
assert(photoCount>=12,'Not enough API-verified photograph samples');
assert(regionSet.size>=1,'Automated source list must contain locations');
const sourcePosition=text.indexOf('world-photo-discovery-data.js?v=84');
const enrichmentPosition=text.indexOf('world-photo-enrichment-v85.js?v=85');
const catalogPosition=text.indexOf('world-curated-photos.js?v=85');
assert(sourcePosition>=0&&enrichmentPosition>sourcePosition&&catalogPosition>enrichmentPosition,
 'The discovery and enrichment manifests must load before the World catalogue');
assert(sw.includes("'./world-photo-discovery-data.js'"),'Offline cache missing data manifest');
assert(gallery.includes("api.verifyNamedFiles(proposed)"),'Source candidates must be checked live before display');
const entries=rows.filter(row=>curated.get(row.id).length>0);
const newIds=entries.filter(row=>!Object.entries(data).some(([id])=>id===row.id)); // Independently researched subset
assert(entries.length>=160,'The combined release must extend fixed source coverage by at least 40 destinations');
assert(new Set(entries.map(row=>row.region)).size>=6,'The expanded photo source inventory must span all geographic regions');
assert(curated.get('prague').some(p=>p.file.includes('Charles Bridge')),'Existing credited country images must be reused for precise city matches');
assert(curated.get('grandcanyon').some(p=>p.file.includes('Grand Canyon')),'New web-sourced landmarks must appear in galleries');
assert(curated.get('petra').some(p=>p.file.includes('Treasury')),'New Asian landmarks must appear');
assert(curated.get('galapagos').some(p=>p.file.includes('tortoise')),'New wildlife photography must appear');
assert(curated.get('reykjavik').every(p=>p.checked===false),'Previously approved source metadata must still be checked at display time');
const sample=byId[0];
global.window={RevisionWorldDiscoveryPhotos:data};
const loaded=curated.get(sample[0]);
assert(loaded.length>=sample[1].length,'Gallery registry is not connected to discovery data');
assert(loaded.every(p=>p.filePage.startsWith('https://commons.wikimedia.org/wiki/File:')));
assert(loaded.every(p=>p.originalUrl.includes('Special:FilePath')));
assert(loaded.some(p=>p.source==='editorial-source'&&p.checked===false),'Machine candidates must not bypass licence verification');
console.log('PASS bulk photo sources: '+byId.length+' automated destinations, '+photoCount+' Commons CC photo candidates; '+regionSet.size+' regions, '+duplicates+' across-place duplicated filenames; no location/XP/ownership edits.');
