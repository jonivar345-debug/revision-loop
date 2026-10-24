/**
 * SAMPLE ONLY: check actual delivered bytes for 640px Commons covers across
 * seven regions. Does NOT establish all 376x4 are available/visually correct.
 * Run as a one-off GH Action after v85 source manifest is populated.
 * node scripts/audit-world-photo-delivery-v85.mjs [--write]
 */
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const discovered=require('../world-photo-discovery-data.js');
const extras=require('../world-photo-enrichment-v85.js');
global.window={RevisionWorldDiscoveryPhotos:discovered,RevisionWorldPhotoEnrichment:extras};
const photos=require('../world-curated-photos.js');
const sample=['london','busan','tokyo','newyork','tbilisi','beijing','hanoi','lagos','capetown','mexicocity','manila',
 'country-us','country-in','country-za','country-nr','country-ne','country-lr','country-iq','country-ag','country-ge',
 'country-ph','country-mx','country-au','country-nz','country-gm','sea-red','sea-bering','sea-mediterranean',
 'ocean-atlantic','ocean-pacific'];
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const records=[];let transient=0;
function recognizedBytes(buffer,type){
 if(buffer.length<16)return false;
 const bytes=new Uint8Array(buffer);
 return (/image\/jpeg/.test(type)&&bytes[0]===0xff&&bytes[1]===0xd8)||
  (/image\/png/.test(type)&&bytes[0]===0x89&&bytes[1]===0x50)||
  (/image\/webp/.test(type)&&String.fromCharCode(...bytes.slice(0,4))==='RIFF');
}
for(const id of sample){
 const p=photos.get(id).find(x=>x.file&&x.author&&x.licenseUrl&&x.filePage);
 if(!p){records.push({id,status:'missing-sourced-image'});continue}
 const file=p.file.replace(/^File:/,'').replace(/ /g,'_');
 const url='https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(file)+'?width=640';
 let outcome={id,file,source:p.filePage,status:'not-loaded'};
 for(let attempt=0;attempt<2;attempt++){
  try{
   const r=await fetch(url,{headers:{'User-Agent':'RevisionLoopWorldPhotoDeliveryAudit/1.0 (https://github.com/jonivar345-debug/revision-loop)','Accept':'image/jpeg,image/png,image/webp,*/*'},signal:AbortSignal.timeout(18000)});
   if([429,502,503,504].includes(r.status)){transient++;await pause(3000);continue}
   if(!r.ok){outcome={...outcome,status:'http-error',httpStatus:r.status};break}
   const mime=String(r.headers.get('content-type')||'');
   const buffer=Buffer.from(await r.arrayBuffer());
   outcome={...outcome,httpStatus:r.status,mime,bytes:buffer.length,status:recognizedBytes(buffer,mime)?'ok':'unexpected-payload'};
   break;
  }catch(e){outcome={...outcome,status:'network-error',detail:String(e).slice(0,140)};await pause(2500)}
 }
 records.push(outcome);
 await pause(550);
 if(records.length%10===0)console.log('DELIVERY '+JSON.stringify({tested:records.length,ok:records.filter(r=>r.status==='ok').length,failed:records.filter(r=>r.status!=='ok').length}));
}
const report={created:new Date().toISOString(),sampled:records.length,delivered:records.filter(r=>r.status==='ok').length,failed:records.filter(r=>r.status!=='ok').length,transientRateLimitsOrGatewayErrors:transient,
 caveat:'Small sample of actual Commons 640px cover images, NOT a full 376x4 pixel-quality or CDN uptime audit',records};
console.log('DELIVERY REPORT '+JSON.stringify({...report,records:undefined}));
if(process.argv.includes('--write'))await fs.writeFile('editorial/world-photo-live-delivery-v85.json',JSON.stringify(report,null,2)+'\n');
if(report.delivered===0)process.exitCode=2;
