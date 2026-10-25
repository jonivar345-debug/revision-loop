#!/usr/bin/env node
/* Advance first-party World photography using the existing curated, licensed catalog.
 * Do not scrape keyword-search results or select by filename alone.
 * The resulting plan is deterministic, checked-in, and reviewable.
 * Metadata verification & actual image retrieval occur in build-local-world-photos.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const catalogue=require('../world-curated-photos.js');
const targetPath=path.resolve(__dirname,'../editorial/world-local-photo-pilot.json');
// IDs from the site's existing World destination catalog. Previously prioritized
// scenic/cultural cities, then major landscape and marine destinations.
const targets=[
  'prague','lisbon','capetown','sanfrancisco','cairo','luxor',
  'fes','atacama','vancouver','montreal','perth','edinburgh',
  'brisbane','quebec','dublin','tunis','losangeles','oaxaca',
  'dakar','cairns','greatbarrier','uyuni','chichenitza',
  'hanoi','manila','bali','almaty','dubai','marrakech',
  'sea-red','country-jp','country-ge','country-kr','country-nz'
];
const manifest=JSON.parse(fs.readFileSync(targetPath,'utf8'));
const selected=[];const skipped=[];
const valid=p=>p&&typeof p.file==='string'&&/\.(?:jpe?g)$/i.test(p.file)&&
 typeof p.author==='string'&&p.author.trim()&&
 /^CC (?:BY|BY-SA|0)/i.test(p.license||'')&&
 p.licenseUrl&&p.filePage?.startsWith('https://commons.wikimedia.org/wiki/File:');
for(const id of targets){
  if(manifest.locations[id])continue;
  const unique=new Set();
  const candidates=catalogue.get(id).filter(valid).filter(p=>{
    const name=p.file.replace(/^File:/,'').replace(/_/g,' ').toLowerCase();
    if(unique.has(name))return false;
    unique.add(name);return true;
  });
  if(candidates.length<4){skipped.push({id,usable:candidates.length});continue}
  const names=candidates.slice(0,4).map(x=>x.file.replace(/^File:/,''));
  assert.equal(new Set(names.map(x=>x.toLowerCase())).size,4);
  manifest.locations[id]=names;selected.push({id,names});
}
// This threshold ensures we don't silently pretend a batch succeeded.
assert(selected.length>=20,'Not enough source-backed complete galleries for this World batch');
manifest.description='World v103: local-first curated photo expansion, prioritizing 4 distinct subject-matched photographs per destination; preserve artist, Commons page and licence, with an ongoing visual audit.';
manifest.quality='Earlier high-quality local WebPs retained; new galleries and covers use progressive size-budgeted WebP with 1600px/760px long-edge limits and minimum readable detail, never upscaled.';
fs.writeFileSync(targetPath,JSON.stringify(manifest,null,2)+'\n');
console.log('New four-photo locations:',selected.length,'('+(selected.length*4)+' photos)');
console.log('Selected IDs:',selected.map(x=>x.id).join(', '));
console.log('Deferred - fewer than four verified JPEG candidates:',JSON.stringify(skipped));
