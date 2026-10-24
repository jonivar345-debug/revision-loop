/**
 * Last-mile photo SOURCE recovery for the World shop.
 * A Commons File: title match + current CC author/size/metadata is NOT pixel
 * inspection. A file remains provisional and must pass the browser's Commons
 * verification again before display.
 *
 * One-time action only, not scheduled. Serial requests and Retry-After.
 * Run: node scripts/recover-remaining-world-photos.mjs --write
 */
import fs from 'node:fs/promises';
const [csv,curated,existing]=await Promise.all([
 'editorial/world_photo_collection_template_376.csv',
 'world-curated-photos.js','world-photo-discovery-data.js'
].map(p=>fs.readFile(p,'utf8')));
function dataObject(s){const m=s.match(/const data=(\{[\s\S]*?\});/);return m?JSON.parse(m[1]):{};}
const prior=dataObject(existing);
const known=new Set(['london','busan',...Object.keys(prior)]);
for(const m of curated.matchAll(/const (?:featuredCities[A-Z]?|editorial|additionalEditorial[A-Z]|exactDestinationReuse|independentlySourced)=Object\.freeze\((\{[\s\S]*?\})\);/g)){
 for(const id of Object.keys(JSON.parse(m[1])))known.add(id);
}
const all=csv.split(/\r?\n/).slice(1).filter(Boolean).map(s=>{
 const f=[...s.matchAll(/"([^"]*)"/g)].map(x=>x[1]);
 return{id:f[3],name:f[0],type:f[1],region:f[2]};
});
const missing=all.filter(x=>!known.has(x.id));
const normalize=x=>String(x||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[_-]/g,' ').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const BAD=/\b(?:map|locator|flag|coat\s*of\s*arms|emblem|seal|logo|diagram|graph|chart|population|demograph|satellite|infographic|districts|provinces|municipalities|icon|poster|illustration|painting|drawing|politic|president|minister|parliament|election|riot|protest|crisis|military|soldier|army|warship|aircraft|airplane|aeroplane|airline|airport|police|ambulance|hospital|doctor|football|soccer|basketball|racing|motorbike|circuit|sport|olympic|games|race|diplomatic|conference|meeting|ceremony|monarchy|coronation|robot|shirt|tshirt|merchandise|ticket|company|festival\s*poster|mug|stamp|coins|selfie|zoo|aquarium|caged|news|2010\s*opening|human\s*rights\s*report|covid|vaccin|gif|svg|\.webp\.png)\b/i;
const SCENIC=/view|skyline|panoram|aerial|coast|beach|water|sea|ocean|landscape|valley|mountain|forest|island|lake|river|bridge|sunset|sunrise|heritage|street|old\s*town|city|village|fort|temple|church|mosque|garden|palace|castle|coastal|harbour|harbor|boat|town|building|cathedral|national\s*park|falls|market|port|bay|cliff|desert|monument|reef|mount|mountain|square|promenade|architecture|tower|historic|glacier|dune|park|capital|fortress|volcano|waterfall|atoll|lagoon/i;
const HTML=x=>String(x||'').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&nbsp;/g,' ').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim().slice(0,200);
const aliases={
 'country-us':['united states','usa','u s a','america'],
 'country-gb':['united kingdom','great britain','england','wales','scotland'],
 'country-za':['south africa','south african'],
 'country-kp':['north korea','democratic people s republic of korea'],
 'country-ps':['palestine','palestinian'],
 'country-ci':['cote d ivoire','ivory coast'],
 'country-st':['sao tome','são tomé'],
 'country-tl':['timor leste','east timor'],
 'country-mh':['marshall islands'],
 'country-va':['vatican','holy see'],
 'country-cv':['cabo verde','cape verde'],
 'country-bn':['brunei','brunei darussalam'],
 'country-kn':['saint kitts','st kitts'],
 'country-nz':['new zealand','aotearoa'],
 'mahe':['mahe','mahé','seychelles'],
 'oaxaca':['oaxaca','oaxaca de juarez'],
 'sanjosecr':['san jose costa rica','san jose'],
 'borabora':['bora bora','borabora'],
 'country-ge':['georgia country','georgia caucasus'],
 'country-lk':['sri lanka','ceylon'],
 'country-mm':['myanmar','burma'],
 'country-la':['laos','lao'],
 'country-nl':['netherlands','holland'],
 'country-in':['india','indian'],
 'country-mx':['mexico','mexican'],
 'country-ir':['iran','persia'],
 'country-sy':['syria','syrian'],
 'country-dj':['djibouti','djibuti'],
 'country-bd':['bangladesh','bangladeshi'],
 'country-pk':['pakistan','pakistani']
};
function terms(loc){
 const name=normalize(loc.name.replace(/^Country: /,''));
 return [...new Set([name,...(aliases[loc.id]||[]).map(normalize)])].filter(Boolean);
}
let last=0,calls=0,rateLimits=0;
const errors=[],found={},misses=[];
async function request(place,term){
 const u=new URL('https://commons.wikimedia.org/w/api.php');
 const args={action:'query',format:'json',formatversion:'2',generator:'search',
  gsrsearch:'intitle:"'+term.replace(/"/g,'')+'"',gsrnamespace:'6',
  gsrlimit:'45',prop:'imageinfo',iiprop:'url|size|extmetadata',iiurlwidth:'2048'};
 for(const [k,v]of Object.entries(args))u.searchParams.set(k,v);
 for(let attempt=0;attempt<3;attempt++){
  await sleep(Math.max(0,1750-(Date.now()-last)));last=Date.now();calls++;
  let r;
  try{
   r=await fetch(u,{headers:{'User-Agent':'RevisionLoopPhotographSourceAudit/1.4 (https://github.com/jonivar345-debug/revision-loop; educational student project)','Accept':'application/json'},signal:AbortSignal.timeout(18000)});
  }catch(e){if(attempt===2){errors.push([place.id,'network '+String(e).slice(0,70)]);return null;}await sleep(3500*(attempt+1));continue;}
  if(r.ok){try{return await r.json()}catch{return null}}
  if(r.status===429||r.status===503){
   rateLimits++;const retry=Number(r.headers.get('retry-after'))||6;
   await sleep(Math.min(60000,Math.max(6000,1000*retry))*(attempt+1));continue;
  }
  errors.push([place.id,'HTTP '+r.status]);return null;
 }
 errors.push([place.id,'failed after retries']);return null;
}
function scored(p,loc,aliases){
 const ii=p.imageinfo?.[0],meta=ii?.extmetadata||{},file=p.title?.replace(/^File:/,'');
 if(!file||!ii||!/\.(?:jpg|jpeg|png|webp)$/i.test(file)||BAD.test(file))return null;
 if(Number(ii.width)<2048||Number(ii.height)<900||!/upload.wikimedia.org/.test(ii.url||''))return null;
 const license=String(meta.LicenseShortName?.value||'').trim(),
  licenseUrl=String(meta.LicenseUrl?.value||'').trim(),creator=HTML(meta.Artist?.value),subject=HTML(meta.ImageDescription?.value);
 if(!/^(?:CC BY(?:-SA)? (?:2\.0|2\.5|3\.0|4\.0)|CC0 1\.0|CC 0 1\.0)$/i.test(license))return null;
 if(!/^https:\/\/creativecommons.org\/(?:licenses\/|publicdomain\/zero\/)/.test(licenseUrl)||!creator)return null;
 const fn=normalize(file),name=normalize(loc.name);
 const exact=aliases.some(x=>fn.includes(x));
 const partial=aliases.some(x=>x.split(' ').filter(w=>w.length>=5).some(w=>fn.split(' ').includes(w)));
 // Commons filename must name this destination. Bare scenic descriptions from
 // other places may not substitute for a named location.
 if(!exact&&!partial)return null;
 const scenic=SCENIC.test(fn+' '+normalize(subject));
 // Exclude encyclopedia media depicting politicians, adverts, diagrams etc.
 if(!scenic&&!/^(country-)/.test(loc.id))return null;
 if(loc.id.startsWith('ocean-')||loc.id.startsWith('sea-')){
  if(!/(sea|ocean|coast|bay|beach|water|wave|atoll|reef|lagoon|shore|ice|boat)/i.test(fn+' '+subject))return null;
 }
 const score=(exact?90:35)+(SCENIC.test(fn)?28:0)+(scenic?10:0)
  +Math.min(15,Math.round(Number(ii.width)/550))-((/interior|house|vehicle|portrait|parking|hotel|market stall|school/i.test(fn))?32:0);
 return {record:{
  file,author:creator,license,licenseUrl,subject:subject||file.replaceAll('_',' '),
  width:Number(ii.width),height:Number(ii.height),editorialMetadata:true,
  reviewStatus:'Wikimedia Commons File: title matched to destination and live CC author/licence/size verified; image pixels NOT individually visually inspected',
  sourceArticle:'Commons exact-title file search: '+loc.name
 },score};
}
for(const loc of missing){
 let images=[];
 const lterms=terms(loc);
 const queryTerms=lterms.length>1?lterms.slice(0,2):lterms;
 for(const term of queryTerms){
  const answer=await request(loc,term);
  const hits=(answer?.query?.pages||[]).map(x=>scored(x,loc,lterms)).filter(Boolean);
  images.push(...hits);
  // If many decent files with matching location names already exist, avoid
  // extra traffic. Never force four results when real sources are fewer.
  if(images.length>=6)break;
 }
 const uniq=new Map();for(const image of images){const k=normalize(image.record.file);if(!uniq.has(k)||uniq.get(k).score<image.score)uniq.set(k,image)}
 const picked=[...uniq.values()].sort((a,b)=>b.score-a.score||b.record.width-a.record.width).slice(0,4).map(x=>x.record);
 if(picked.length)found[loc.id]=picked;else misses.push(loc.id);
 if((Object.keys(found).length+misses.length)%15===0){
  console.log('RECOVERY '+JSON.stringify({checked:Object.keys(found).length+misses.length,found:Object.keys(found).length,photos:Object.values(found).flat().length,calls,rateLimits,errors:errors.length}));
 }
}
const merged={...prior,...found};
const ordered=Object.fromEntries(Object.entries(merged).sort(([a],[b])=>a.localeCompare(b)));
const report={
 created:new Date().toISOString(),attempted:missing.length,
 newlyRecoveredDestinations:Object.keys(found).length,newlySourcedPhotos:Object.values(found).flat().length,
 totalDiscoveryDestinations:Object.keys(ordered).length,totalDiscoveryPhotos:Object.values(ordered).flat().length,
 rateLimitedRequests:rateLimits,apiCalls:calls,misses,errors,
 sourceStandard:'Exact named Commons File titles; CC license, author and original dimensions validated via imageinfo. Machine-ranked candidate; not manually inspected pixels. Each file reverified at gallery display.'
};
console.log('RECOVERY REPORT '+JSON.stringify(report));
if(process.argv.includes('--write')){
 const js='/* Commons title-matched CC source candidates, NOT full visual approval. */\n'+
 '(function(root){ "use strict";const data='+JSON.stringify(ordered,null,2)+';\n'+
 'if(typeof module==="object"&&module.exports)module.exports=data;\n'+
 'if(root)root.RevisionWorldDiscoveryPhotos=Object.freeze(data);\n})(typeof window==="object"?window:null);\n';
 await fs.writeFile('world-photo-discovery-data.js',js);
 await fs.writeFile('editorial/world-photo-recovery-v84.json',JSON.stringify(report,null,2)+'\n');
}
if(!Object.keys(found).length)process.exitCode=2;
