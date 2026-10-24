/* Report four-image source DEPTH, not photo visual approval.
 * A record only counts when it has an original Commons filename, author, CC
 * licence and original source page; duplicates never count twice.
 * node scripts/audit-world-photo-depth.cjs [--save]
 */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const data=require('../world-photo-discovery-data.js');
const enrichment=require('../world-photo-enrichment-v85.js');
global.window={RevisionWorldDiscoveryPhotos:data,RevisionWorldPhotoEnrichment:enrichment};
const catalog=require('../world-curated-photos.js');
const raw=fs.readFileSync(path.join(root,'editorial/world_photo_collection_template_376.csv'),'utf8');
const rows=raw.split(/\r?\n/).slice(1).filter(Boolean).map(line=>{
 const a=[...line.matchAll(/"([^"]*)"/g)].map(x=>x[1]);return{id:a[3],name:a[0],kind:a[1],region:a[2]};
});
const result={date:'2026-10-24',totalDestinations:rows.length,completeFourSources:0,incompleteDestinations:0,missingSourceDestinations:0,
 totalDistinctSourcedPhotos:0,unfilledPhotoSlots:0,byPhotoCount:{'0':0,'1':0,'2':0,'3':0,'4+':0},byRegion:{},destinations:[]};
for(const loc of rows){
 const files=catalog.get(loc.id),unique=new Map();
 for(const item of files){
  if(!item.file||!item.author||!item.licenseUrl||!item.filePage)continue;
  const normalized=item.file.replace(/^File:/i,'').replace(/_/g,' ').toLowerCase().trim();
  if(!unique.has(normalized))unique.set(normalized,item);
 }
 const count=unique.size;
 const capped=Math.min(count,4),bucket=count>=4?'4+':String(count);
 result.byPhotoCount[bucket]++;result.totalDistinctSourcedPhotos+=count;
 result.unfilledPhotoSlots+=4-capped;
 if(count>=4)result.completeFourSources++;
 else result.incompleteDestinations++;
 if(count===0)result.missingSourceDestinations++;
 const r=result.byRegion[loc.region]||{four:0,incomplete:0,missingSlots:0,locations:0};
 r.locations++;if(count>=4)r.four++;else r.incomplete++;r.missingSlots+=4-capped;result.byRegion[loc.region]=r;
 result.destinations.push({...loc,sourcedCount:count,neededToReachFour:Math.max(0,4-count),
  fourVerifiedOnScreen:false});
}
if(rows.length!==376||new Set(rows.map(r=>r.id)).size!==376)throw Error('376 historic destination IDs lost');
if(process.argv.includes('--save')){
 fs.writeFileSync(path.join(root,'editorial/world-photo-four-depth-v85.json'),JSON.stringify(result,null,2)+'\n');
}
console.log('WORLD FOUR-PHOTO DEPTH '+JSON.stringify(Object.fromEntries(Object.entries(result).filter(([k])=>k!=='destinations'))));
