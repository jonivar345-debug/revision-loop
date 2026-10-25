/* v108 checks the browser's full source registry, not only legacy v85 records. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
global.window={
 RevisionWorldDiscoveryPhotos:require('../world-photo-discovery-data.js'),
 RevisionWorldPhotoEnrichment:require('../world-photo-enrichment-v85.js'),
 RevisionWorldV104Photos:require('../world-photo-editorial-v104.js')
};
const catalog=require('../world-curated-photos.js');
const gallery=require('../world-location-photo-gallery.js');
const rows=fs.readFileSync(path.join(__dirname,'../editorial/world_photo_collection_template_376.csv'),'utf8')
 .split(/\r?\n/).slice(1).filter(Boolean).map(line=>{
  const matches=[...line.matchAll(/"([^"]*)"/g)].map(v=>v[1]);
  return {id:matches[3],name:matches[0],kind:matches[1]};
 });
assert.equal(rows.length,376);
const short=[];
for(const row of rows){
 const records=catalog.get(row.id).filter(p=>p.file&&p.author&&p.licenseUrl&&p.filePage&&gallery.allowed(p,{id:row.id,name:row.name,worldKind:row.kind}));
 const unique=new Set(records.map(p=>p.file.toLowerCase().replace(/_/g,' ')));
 if(unique.size<4)short.push({id:row.id,available:unique.size});
}
assert.deepEqual(short,[],'v108 must repair the six missed sources and include earlier v106 locally sourced replacements');
const required=require('../editorial/world-v108-batch-targets.json').requiredGalleries;
for(const id of required)assert.equal(catalog.get(id).filter(p=>p.author&&p.licenseUrl).length>=4,true,id+' still lacks trustworthy sources');
console.log('PASS v108: 376/376 source-complete destination registries using real browser metadata, no filename-only foreign hits.');
