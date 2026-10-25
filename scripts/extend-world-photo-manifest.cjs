#!/usr/bin/env node
/* Advance first-party World photography using the existing curated, licensed catalog.
 * Do not scrape keyword-search results or select by filename alone.
 * The resulting plan is deterministic, checked-in, and reviewable.
 * Metadata verification & actual image retrieval occur in build-local-world-photos.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const discovered=require('../world-photo-discovery-data.js');
const enrichment=require('../world-photo-enrichment-v85.js');
// The browser supplies these registries via window globals. Replicate the
// complete runtime registry in Node; otherwise ~75% of eligible photos vanish.
global.window={RevisionWorldDiscoveryPhotos:discovered,RevisionWorldPhotoEnrichment:enrichment,RevisionWorldV104Photos:require('../world-photo-editorial-v104.js')};
const catalogue=require('../world-curated-photos.js');
const targetPath=path.resolve(__dirname,'../editorial/world-local-photo-pilot.json');
// IDs from the site's existing World destination catalog. Previously prioritized
// scenic/cultural cities, then major landscape and marine destinations.
const batch=require('../editorial/world-v114-batch-targets.json');
const targets=batch.targets;
const manifest=JSON.parse(fs.readFileSync(targetPath,'utf8'));
const selected=[];const skipped=[];
const valid=p=>p&&typeof p.file==='string'&&/\.(?:jpe?g)$/i.test(p.file)&&
 typeof p.author==='string'&&p.author.trim()&&
 /^(?:CC (?:BY|BY-SA)|CC0)/i.test(p.license||'')&&
 p.licenseUrl&&p.filePage?.startsWith('https://commons.wikimedia.org/wiki/File:');
for(const id of targets){
  // Existing incomplete galleries are finished by the archive builder after live licence validation.
  if(manifest.locations[id]){if(manifest.locations[id].length<4)selected.push({id,names:batch.approvedSelections[id],existingPartial:manifest.locations[id]});continue;}
  // Unlike earlier automated imports, accept exactly these reviewed file names.
  // A loose place-name keyword may refer to a flower, ship, palace or another city.
  const names=batch.approvedSelections[id];
  assert(Array.isArray(names)&&names.length===4,'Four explicitly selected sources needed: '+id);
  assert.equal(new Set(names.map(x=>x.toLowerCase())).size,4);
  const eligible=new Set(catalogue.get(id).filter(valid).map(p=>p.file.replace(/^File:/,'').toLowerCase()));
  if(!names.every(name=>eligible.has(name.toLowerCase()))){
    skipped.push({id,reason:'Selected source missing or rejected by place-accuracy catalogue'});
    continue;
  }
  manifest.locations[id]=names;selected.push({id,names});
}
// This threshold ensures we don't silently pretend a batch succeeded.
console.log('Selection candidates: '+selected.length+'; skipped: '+JSON.stringify(skipped));
assert(targets.filter(id=>(Array.isArray(manifest.locations[id])&&manifest.locations[id].length===4)||selected.some(v=>v.id===id)).length  >=batch.minimumGalleries,'Insufficient source-checked v114 galleries');
manifest.description='World v114: extend the locally hosted World archive with ten source-verified destination photo galleries while protecting previously hosted photographs.';
manifest.quality='Earlier high-quality local WebPs retained; new galleries and covers use progressive size-budgeted WebP with 1600px/760px long-edge limits and minimum readable detail, never upscaled.';
fs.writeFileSync(targetPath,JSON.stringify(manifest,null,2)+'\n');
console.log('New four-photo locations:',selected.length,'('+(selected.length*4)+' photos)');
console.log('Selected IDs:',selected.map(x=>x.id).join(', '));
console.log('Deferred - fewer than four verified JPEG candidates:',JSON.stringify(skipped));
