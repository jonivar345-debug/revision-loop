/**
 * Bounded second source-research pass for genuinely underfilled galleries.
 * The specific place synonyms below are geographically verified names, not
 * fuzzy country searches. Each returned file must also have current Commons
 * CC licence/author/size metadata. Still NOT visual pixel approval.
 *
 * node scripts/enrich-hard-world-photos-v85.mjs --write
 */
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const discovery=require('../world-photo-discovery-data.js');
const extras=require('../world-photo-enrichment-v85.js');
global.window={RevisionWorldDiscoveryPhotos:discovery,RevisionWorldPhotoEnrichment:extras};
const catalog=require('../world-curated-photos.js');
const gallery=require('../world-location-photo-gallery.js');
const csv=await fs.readFile('editorial/world_photo_collection_template_376.csv','utf8');
const rows=csv.split(/\r?\n/).slice(1).filter(Boolean).map(l=>{
 const p=[...l.matchAll(/"([^"]*)"/g)].map(x=>x[1]);return{id:p[3],name:p[0],type:p[1]};
});
const queryMap={
 dakar:['Dakar Gorée Island','Dakar Monument Renaissance Africaine','Dakar Corniche'],
 'country-ao':['Kalandula Falls Angola','Luanda waterfront','Tundavala Angola'],
 'country-bi':['Bujumbura Lake Tanganyika','Karera Waterfalls Burundi','Gitega Burundi'],
 'country-cd':['Kinshasa city skyline','Virunga National Park Congo','Kisangani Congo'],
 'country-cg':['Brazzaville city skyline','Odzala National Park','Brazzaville Congo River'],
 'country-er':['Asmara Eritrea','Massawa Eritrea','Dahlak Islands Eritrea'],
 'country-fm':['Nan Madol Pohnpei Micronesia','Chuuk Lagoon Micronesia','Yap island Micronesia'],
 'country-ga':['Libreville Gabon','Loango National Park Gabon','Lopé Gabon'],
 'country-km':['Anjouan Comoros','Mount Karthala Comoros','Moheli Comoros'],
 'country-mk':['Matka Canyon North Macedonia','Skopje Stone Bridge','Ohrid Macedonia'],
 'country-pg':['Papua New Guinea Highland','Kokoda Track Papua New Guinea','Rabaul Papua New Guinea'],
 'country-so':['Mogadishu Somalia coast','Berbera Somalia coast','Hargeisa Somaliland'],
 'country-tm':['Darvaza Turkmenistan','Ashgabat Turkmenistan','Yangykala Turkmenistan'],
 'country-tt':['Pigeon Point Tobago','Port of Spain Trinidad','Tobago Cays'], // last term filtered to keep only Trinidad and Tobago
 'country-uy':['Rambla Montevideo Uruguay','Punta del Este Uruguay','Colonia del Sacramento Uruguay'],
 'country-vc':['Bequia Saint Vincent Grenadines','Kingstown Saint Vincent','Tobago Cays Grenadines'],
 'ocean-pacific':['Pacific Ocean waves','Pacific Ocean coastline','Pacific Ocean aerial'],
 'sea-weddell':['Weddell Sea icebergs','Weddell Sea Antarctica','Weddell Sea ice'],
 'sea-philippine':['Philippine Sea Okinawa','Philippine Sea aerial','Philippine Sea waves'],
 'sea-labrador':['Labrador Sea Greenland','Labrador Sea icebergs','Labrador Sea coast'],
 sarajevo:['Sarajevo Baščaršija','Sarajevo City Hall','Sarajevo skyline'],
 kigali:['Kigali city skyline','Kigali Convention Centre','Kigali Rwanda'],
 'country-ba':['Mostar Bridge Bosnia','Sarajevo Bosnia panoramic','Blagaj Bosnia'],
 'country-jm':['Blue Mountains Jamaica','Negril Jamaica beach','Port Antonio Jamaica']
};
queryMap['country-tt'].pop(); // Tobago Cays is in St Vincent; never mislabel it Trinidad.
const norm=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[_-]/g,' ').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const strip=x=>String(x||'').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim().slice(0,220);
const bad=/\b(?:map|chart|graph|diagram|logo|flag|coat.of.arms|military|soldier|political|minister|president|meeting|portrait|selfie|advert|museum specimen|airplane|aircraft|airport|hospital|conference|sports team|film festival|shirt|climate stripes|banknote|crisis|police|poster|location diagram|zoo|train station|ticket|collage)\b/i;
const scenic=/panoram|skyline|lake|landscape|waterfall|beach|sunset|water|sea|river|mountain|coast|view|garden|temple|cathedral|town|city|village|island|bay|reef|glacier|valley|canyon|monument|historic|fort|church|mosque|street|desert|ocean|iceberg|ice|forest|palace|aerial|bridge|tower|waves|atoll|lagoon|mountain|park|dune/i;
const wait=ms=>new Promise(r=>setTimeout(r,ms));let last=0,calls=0,limits=0;const errs=[];
async function search(loc,phrase){
 const u=new URL('https://commons.wikimedia.org/w/api.php');
 for(const [k,v] of Object.entries({action:'query',generator:'search',gsrsearch:'intitle:"'+phrase.replace(/"/g,'')+'"',
  gsrnamespace:'6',gsrlimit:'55',prop:'imageinfo',iiprop:'url|size|extmetadata',
  iiurlwidth:'2048',format:'json',formatversion:'2'}))u.searchParams.set(k,v);
 for(let retry=0;retry<3;retry++){
  await wait(Math.max(0,1400-(Date.now()-last)));last=Date.now();calls++;
  let r;try{r=await fetch(u,{headers:{'User-Agent':'RevisionLoopLandmarkPhotoAudit/1.5 (https://github.com/jonivar345-debug/revision-loop; educational)','Accept':'application/json'},signal:AbortSignal.timeout(17000)})}
  catch(e){if(retry===2){errs.push([loc.id,String(e).slice(0,70)]);return []}await wait(3500);continue}
  if(r.ok){try{return (await r.json()).query?.pages||[]}catch{return []}}
  if([429,503].includes(r.status)){limits++;await wait(9000*(retry+1));continue}
  errs.push([loc.id,'HTTP '+r.status]);return [];
 }
 return [];
}
function candidate(page,phrase,loc){
 const i=page.imageinfo?.[0],meta=i?.extmetadata||{},file=String(page.title||'').replace(/^File:/,'');
 if(!i||!/\.(?:jpg|jpeg|png|webp)$/i.test(file)||bad.test(file)||i.width<2048||i.height<900)return null;
 if(!String(i.url||'').startsWith('https://upload.wikimedia.org/'))return null;
 const lc=String(meta.LicenseShortName?.value||'').trim(),lu=String(meta.LicenseUrl?.value||'').trim(),artist=strip(meta.Artist?.value),subject=strip(meta.ImageDescription?.value);
 if(!/^(?:CC BY(?:-SA)? (?:2\.0|2\.5|3\.0|4\.0)|CC0 1\.0|CC 0 1\.0)$/i.test(lc)||!lu.startsWith('https://creativecommons.org/')||!artist)return null;
 const fn=norm(file),q=norm(phrase);
 const allWords=q.split(' ').filter(w=>w.length>=4);
 if(!fn.includes(q)&&!allWords.some(w=>fn.split(' ').includes(w)))return null;
 if(!scenic.test(fn+' '+norm(subject)))return null;
 // Guard named-country traps: Congo Republic vs DRC, distant Tobago Cays vs
 // Trinidad/Tobago, generic Pacific vs unrelated weather maps.
 if(loc.id==='country-cg'&&/\bkinshasa\b|\bdemocratic\b/.test(fn))return null;
 if(loc.id==='country-cd'&&/\bbrazzaville\b|\brepublic of the congo\b/.test(fn))return null;
 if(loc.id==='country-tt'&&/tobago cays|saint vincent|st vincent/.test(fn))return null;
 if(loc.id==='country-mk'&&/\bgreece\b|\balbania\b/.test(fn))return null;
 if(loc.id==='country-tm'&&/\buzbekistan\b|\bkazakhstan\b/.test(fn))return null;
 if(loc.id==='country-pg'&&/\bindonesia\b|\baustralia\b/.test(fn))return null;
 if(loc.type==='Sea'||loc.type==='Ocean'){
  if(!/\bsea\b|\bocean\b|coast|shore|iceberg|wave|water|reef/.test(fn+' '+norm(subject)))return null;
 }
 return {entry:{file,author:artist,license:lc,licenseUrl:lu,subject:subject||file,width:i.width,height:i.height,
  editorialMetadata:true,reviewStatus:'Human-specified geographic landmark search, current Commons author/CC licence/size checked; NOT individual pixel-level visual approval',
  locationText:loc.name,photoSource:'Commons curated place-query, source metadata checked'},
  score:(fn.includes(q)?80:30)+(scenic.test(fn)?20:0)+Math.min(12,Math.floor(i.width/900))-(bad.test(subject)?25:0)};
}
const refreshed=require('../world-photo-enrichment-v85.js'),additions={},short=[];
let reused=0;
for(const loc of rows){
 const present=catalog.get(loc.id),known=new Set(present.map(x=>norm(String(x.file||'').replace(/^File:/i,''))));
 const need=4-known.size;if(need<=0)continue;
 const phrases=queryMap[loc.id]||[];
 if(!phrases.length){short.push({id:loc.id,needed:need,noQueries:true});continue}
 const ranked=[];
 for(const q of phrases){
  const results=await search(loc,q);
  for(const page of results){
   const c=candidate(page,q,loc);if(!c||known.has(norm(c.entry.file)))continue;
   if(ranked.some(x=>norm(x.entry.file)===norm(c.entry.file)))continue;
   ranked.push(c);
  }
  if(ranked.length>=need+2)break;
 }
 ranked.sort((a,b)=>b.score-a.score);
 const picked=ranked.slice(0,need).map(x=>x.entry);
 if(picked.length){additions[loc.id]=picked;reused+=picked.length}
 if(picked.length<need)short.push({id:loc.id,needed:need,added:picked.length});
}
const merged=Object.fromEntries(Object.entries(refreshed).map(([id,v])=>[id,[...v,...(additions[id]||[])]]));
for(const [id,v] of Object.entries(additions))if(!merged[id])merged[id]=v;
const ordered=Object.fromEntries(Object.entries(merged).sort(([a],[b])=>a.localeCompare(b)));
const report={created:new Date().toISOString(),sourcedDestinations:Object.keys(additions).length,addedRecords:reused,
 remainingUnderFour:short,apiCalls:calls,rateLimitResponses:limits,errors:errs.slice(0,30),
 caveat:'Human-specified geographic landmark names; current Commons source metadata and CC checked, not image-pixel verified'};
console.log('LAST-MILE PHOTO AUDIT '+JSON.stringify(report));
if(process.argv.includes('--write')){
 await fs.writeFile('world-photo-enrichment-v85.js',"/* Commons photo candidates, NOT pixel-level editorial review. */\n(function(root){'use strict';const data="+JSON.stringify(ordered,null,2)+";\nif(typeof module==='object'&&module.exports)module.exports=data;\nif(root)root.RevisionWorldPhotoEnrichment=Object.freeze(data);\n})(typeof window==='object'?window:null);\n");
 await fs.writeFile('editorial/world-photo-hard-location-v85.json',JSON.stringify(report,null,2)+'\n');
}
