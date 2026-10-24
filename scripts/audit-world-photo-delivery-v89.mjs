/* Optional real-CDN smoke test for changed v89 countries.
 * Verifies image bytes and live deployed version, not photograph quality.
 * Does not log in, spend points, or touch users' browser storage.
 * Run: node scripts/audit-world-photo-delivery-v89.mjs --write
 */
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const d=require('../world-photo-discovery-data.js'),e=require('../world-photo-enrichment-v85.js');
global.window={RevisionWorldDiscoveryPhotos:d,RevisionWorldPhotoEnrichment:e};
const catalog=require('../world-curated-photos.js'),gallery=require('../world-location-photo-gallery.js');
const ids=['country-bz','country-iq','country-sz','country-do','country-om','country-am'];
const names={'country-bz':'Belize','country-iq':'Iraq','country-sz':'Eswatini','country-do':'Dominican Republic','country-om':'Oman','country-am':'Armenia'};
const sample=[],sleep=ms=>new Promise(r=>setTimeout(r,ms));
const media={verifyNamedFiles:async f=>f,searchPage:async()=>[],searchArticleImages:async()=>[],searchNearby:async()=>[],search:async()=>[],verifyApproved:async()=>null};
function imageBytes(buf,contentType){
 if(buf.length<20)return false;
 return (contentType.includes('image/jpeg')&&buf[0]===255&&buf[1]===216)
   ||(contentType.includes('image/png')&&buf[0]===137&&buf[1]===80)
   ||(contentType.includes('image/webp')&&buf.toString('ascii',0,4)==='RIFF');
}
async function checkImage(url,id,file,kind){
 let result={id,file,kind,status:'not_checked'};
 for(let attempt=1;attempt<=2;attempt++){
  try{
   const res=await fetch(url,{headers:{'User-Agent':'RevisionLoopPhotoQA/1.0 (+https://github.com/jonivar345-debug/revision-loop)','Accept':'image/avif,image/webp,image/png,image/jpeg,*/*'},signal:AbortSignal.timeout(15000)});
   if([429,502,503,504].includes(res.status)&&attempt===1){await sleep(1700);continue}
   if(!res.ok)return {...result,status:'http_error',httpStatus:res.status};
   const type=String(res.headers.get('content-type')||'');
   const buf=Buffer.from(await res.arrayBuffer());
   return {...result,status:imageBytes(buf,type)?'ok':'unexpected_payload',httpStatus:res.status,contentType:type,bytes:buf.length};
  }catch(err){result={...result,status:'network_error',error:String(err).slice(0,140)};if(attempt===1)await sleep(1600);}
 }
 return result;
}
for(const id of ids){
 const loc={id,name:names[id],worldKind:'country'},photos=await gallery.photosFor(loc,{limit:4,media});
 if(photos.length!==4){sample.push({id,status:'fewer_than_four_sources',count:photos.length});continue}
 for(let index=0;index<4;index++){
  const p=photos[index],photoURL=p.originalUrl+'?width='+(index===0?2048:960);
  sample.push(await checkImage(photoURL,id,p.file,index===0?'lead_gallery_2048':'gallery_960'));
  await sleep(400);
 }
}
let live={status:'unavailable',expectedVersion:'v89'};
try{
 const page=await fetch('https://jonivar345-debug.github.io/revision-loop/',{signal:AbortSignal.timeout(15000),headers:{'Cache-Control':'no-cache'}});
 const html=await page.text();
 live={status:page.ok?'available':'http_error',httpStatus:page.status,usesNewManifest:html.includes('world-curated-photos.js?v=89')&&html.includes('world-photo-discovery-data.js?v=89')&&html.includes('world-photo-enrichment-v85.js?v=89')};
}catch(err){live={status:'network_error',detail:String(err).slice(0,140)}}
const report={created:new Date().toISOString(),checked:sample.length,imagesDelivered:sample.filter(x=>x.status==='ok').length,
 imageFailures:sample.filter(x=>x.status!=='ok').length,
 publicPage:live,disclaimer:'Sample only. Successful CDN bytes are not full-resolution visual approval or a guarantee that every destination image will load.',
 results:sample};
console.log('WORLD V89 LIVE PHOTO DELIVERY '+JSON.stringify({checked:report.checked,imagesDelivered:report.imagesDelivered,imageFailures:report.imageFailures,publicPage:live}));
for(const r of sample.filter(x=>x.status!=='ok'))console.log('UNAVAILABLE '+JSON.stringify(r));
if(process.argv.includes('--write'))await fs.writeFile('world-photo-delivery-v89-results.json',JSON.stringify(report,null,2)+'\n');
// Diagnostics only. Temporary Wikimedia/CDN failures should not block safe source/rights regressions.
