/**
 * One-time Commons FILE-TITLE photo enrichment for every destination with fewer
 * than 4 DISTINCT sourced photos. No source is a visual/pixel-level approval.
 * Authors/licences/dimensions come from Commons CURRENT live imageinfo;
 * RevisionWorldCommonsMedia revalidates them on display.
 *
 * node scripts/enrich-world-photos-v85.mjs --write [--limit=285]
 */
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const manifest=require('../world-photo-discovery-data.js');
global.window={RevisionWorldDiscoveryPhotos:manifest};
const catalog=require('../world-curated-photos.js');
const limit=Math.max(1,Math.min(376,Number(process.argv.find(x=>x.startsWith('--limit='))?.slice(8)||376)));
const write=process.argv.includes('--write');
const csv=await fs.readFile('editorial/world_photo_collection_template_376.csv','utf8');
const rows=csv.split(/\r?\n/).slice(1).filter(Boolean).map(l=>{
 const v=[...l.matchAll(/"([^"]*)"/g)].map(m=>m[1]);return{id:v[3],name:v[0],type:v[1],region:v[2]};
});
const raw=await fs.readFile('world-photo-enrichment-v85.js','utf8').catch(()=> '');
const prior=(()=>{try{return JSON.parse(raw.match(/const data=(\{[\s\S]*?\});/)[1])}catch{return {}}})();
const norm=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[_-]/g,' ').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const strip=s=>String(s||'').replace(/<[^>]*>/g,' ').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim().slice(0,230);
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const bad=/\b(?:map|locator|emblem|seal|coat.of.arms|banner|logo|diagram|graph|chart|national flag|drawing|illustration|museum specimen|pinned|moth|butterfly specimen|tshirt|shirt|politician|president|minister|party leader|political|protest|protesters|military|army|navy|soldier|warship|aircraft|airline|airport|cockpit|train station|traffic sign|road sign|police|ambulance|hospital|doctor|medicine|soccer|football|basketball|sporting|racing|rally racing|marathon|commercial|advert|company logo|theme park ride|trophy|postcard|festival poster|movie poster|film festival|climate stripes|covid|population pyramid|political boundaries|administrative divisions|ethnographic|passport|stamp|banknote|coins|diplomatic meeting|ceremony|newspaper|book cover|portrait|selfie|wikipedia)\b/i;
const scenery=/panoram|skyline|landscape|cityscape|waterfront|harbour|harbor|aerial|view|coast|beach|valley|mountain|lake|sea|river|village|old town|streets?|sunset|sunrise|castle|palace|temple|monastery|cathedral|mosque|church|fort|island|shore|reef|waterfall|forest|cliffs?|glacier|marina|square|market|volcano|bay|lagoon|atoll|bridge|ruins|historic|museum building|national park|desert|buildings?|gardens?|water|dunes?|natural|tower|castle|architecture|fortress|heritage|ocean|iceberg|coral/i;
const contextual={
 'sea-red':['red sea'], 'sea-north':['north sea'], 'sea-bering':['bering sea'],
 'country-ne':['niger'], 'country-lr':['liberia'], 'country-ge':['georgia country','georgia caucasus'],
 'country-gn':['guinea'], 'country-ag':['antigua barbuda','antigua and barbuda'],
 'country-us':['united states','united states of america','usa'],
 'country-nr':['nauru'], 'country-jm':['jamaica island','jamaica caribbean','jamaica'],
 'country-ba':['bosnia and herzegovina','bosnia'],
 'country-ci':['cote d ivoire','ivory coast'],
 'country-tl':['timor leste','east timor'],
 'country-kp':['north korea'],
 'country-ps':['palestine','west bank'],
 'country-st':['sao tome','são tomé'],
 'country-cv':['cabo verde','cape verde'],
 'country-mm':['myanmar','burma'],
 'country-mh':['marshall islands'],
 'country-nz':['new zealand'],
 'country-va':['vatican'],
 'country-bn':['brunei'],
 'country-kn':['saint kitts','st kitts'],
 'country-dm':['dominica island','dominica'],
 'sanjosecr':['san jose costa rica'],
 'mahe':['mahe seychelles','mahé seychelles'],
 'lagos':['lagos nigeria','lagos lagos state','lagos'],
 'portlouis':['port louis mauritius'],
 'nadi':['nadi fiji'],
 'queenstown':['queenstown new zealand'],
 'country-do':['dominican republic']
};
function aliases(loc){
 const name=norm(loc.name.replace(/^Country:\s*/,'')),other=contextual[loc.id]||[];
 const a=[name,...other.map(norm)];
 return [...new Set(a.filter(x=>x.length>=3))];
}
let last=0,requests=0,rateLimited=0;const errors=[];
async function getCommons(loc,term){
 const url=new URL('https://commons.wikimedia.org/w/api.php');
 const params={action:'query',generator:'search',gsrsearch:'intitle:"'+String(term||'').replace(/"/g,'')+'"',
  gsrnamespace:'6',gsrlimit:'50',prop:'imageinfo',
  iiprop:'url|size|extmetadata',iiurlwidth:'2048',
  format:'json',formatversion:'2'};
 for(const [k,v]of Object.entries(params))url.searchParams.set(k,v);
 for(let retry=0;retry<3;retry++){
  await delay(Math.max(0,1350-(Date.now()-last)));last=Date.now();requests++;
  let response;
  try{response=await fetch(url,{
   headers:{'User-Agent':'RevisionLoopWorldPhotographAudit/1.5 (https://github.com/jonivar345-debug/revision-loop; educational, noncommercial)','Accept':'application/json'},
   signal:AbortSignal.timeout(17000)
  })}catch(e){if(retry===2){errors.push([loc.id,'connection: '+String(e).slice(0,80)]);return []}await delay((retry+1)*3500);continue}
  if(response.ok){try{return (await response.json()).query?.pages||[]}catch{return []}}
  if([429,503].includes(response.status)){rateLimited++;await delay(Math.max(6000,Number(response.headers.get('retry-after')||8)*1000)*(retry+1));continue}
  errors.push([loc.id,'HTTP '+response.status]);return [];
 }
 errors.push([loc.id,'limit retries']);return [];
}
function scoreCandidate(page,loc,aliases){
 const i=page.imageinfo?.[0],meta=i?.extmetadata||{},file=String(page.title||'').replace(/^File:/,'');
 if(!i||!/\.(?:jpe?g|png|webp)$/i.test(file)||bad.test(file))return null;
 const fn=norm(file),desc=norm(strip(meta.ImageDescription?.value)),artist=strip(meta.Artist?.value),lc=String(meta.LicenseShortName?.value||'').trim(),lu=String(meta.LicenseUrl?.value||'').trim();
 if(!Number.isFinite(Number(i.width))||i.width<2048||i.height<900)return null;
 if(!String(i.url||'').startsWith('https://upload.wikimedia.org/'))return null;
 if(!/^(?:CC BY(?:-SA)? (?:2\.0|2\.5|3\.0|4\.0)|CC0 1\.0|CC 0 1\.0)$/i.test(lc)||!lu.startsWith('https://creativecommons.org/')||!artist)return null;
 const exact=aliases.some(t=>fn.includes(t)),sub=aliases.some(t=>desc.includes(t));
 if(!exact)return null; // Only exact named File: titles; descriptions cannot establish location.
 // Reject known name collisions. A lone 'Lagos' can mean Lagos Portugal, and
 // 'Niger' can be a species epithet; inspect broader filename for specificity.
 if(loc.id==='lagos'&&/\bportugal\b|\balgarve\b|\bvistonida\b|\bgreece\b/.test(fn))return null;
 if(loc.id==='country-ne'&&/\bbird\b|\bnigerian\b|\bnigeria\b|\blasius niger\b|\bcordylus niger\b|\bvenice\b/.test(fn))return null;
 if(loc.id==='country-lr'&&/\bfrance\b|\bfort liberia\b|\bprades\b/.test(fn))return null;
 if(loc.id==='country-ge'&&/\bgeorgia usa\b|\bgeorgia state\b|\batlanta\b/.test(fn))return null;
 if(loc.id==='country-jm'&&/\bnew york\b|\bqueens\b|\bbristol\b|\busa\b|\bflorida\b/.test(fn))return null;
 if(loc.id==='nadi'&&/\brajasthan\b|\bnepal\b|\bindia\b/.test(fn))return null;
 if(loc.id==='portlouis'&&/\bguadeloupe\b|\bbrittany\b|\bfrance\b/.test(fn))return null;
 const natural=scenery.test(fn)||scenery.test(desc);
 if(!natural)return null;
 if(['Sea','Ocean'].includes(loc.type)&&!/(sea|ocean|water|coast|waves|iceberg|ice floe|shore|coral|reef|bay|island|beach|lagoon|glacier|ship at sea)/.test(fn+' '+desc))return null;
 const score=(exact?40:0)+(sub?9:0)+(scenery.test(fn)?14:0)+Math.min(12,Math.floor(i.width/900))-(bad.test(desc)?25:0)-(/interior|vehicle|window|fountain detail|close-up|detail of|school|college|statue of person|airport|hotel room|apartment room/.test(fn)?18:0);
 if(score<40)return null;
 return {score,entry:{file,author:artist,license:lc,licenseUrl:lu,subject:strip(meta.ImageDescription?.value)||file,
  width:Number(i.width),height:Number(i.height),editorialMetadata:true,
  reviewStatus:'Automatic exact Commons filename source match; current CC author/licence and pixel dimensions confirmed; NOT visually pixel-reviewed or manually composition-approved',
  locationText:loc.name,photoSource:'Commons exact File-title search'}};
}
function nearDup(a,b){
 const toks=x=>new Set(norm(x).split(' ').filter(w=>w.length>3&&!/^(jpg|jpeg|png|file|image|view|photo|from|with|near|city|panorama|landscape|sunset|sunrise)$/.test(w)));
 const aa=toks(a),bb=toks(b);
 let shared=0;for(const word of aa)if(bb.has(word))shared++;
 return shared/Math.max(1,new Set([...aa,...bb]).size)>.75;
}
const targets=rows.map(loc=>{
 const existing=catalog.get(loc.id),files=[...new Set(existing.map(x=>norm(x.file)))];
 return {...loc,existingFiles:existing.map(x=>x.file.replace(/^File:/,'')),existingCount:files.length,needed:Math.max(0,4-files.length)};
}).filter(x=>x.needed>0).sort((a,b)=>a.type===b.type?b.needed-a.needed
 :a.type.startsWith('City')?-1:b.type.startsWith('City')?1
 :a.type==='Country'?-1:1).slice(0,limit);
const found={},noResult=[],attempted=[];
for(const loc of targets){
 const valid=[],seen=new Set(loc.existingFiles.map(norm));
 const names=aliases(loc);
 // Base search first; the exact place name is always preferred. Only
 // use a second search if the first returned too few permitted photographs.
 const queries=[names[0],...names.slice(1,3)].filter(Boolean);
 for(const term of queries){
  const pages=await getCommons(loc,term);
  for(const page of pages){
   const candidate=scoreCandidate(page,loc,names);
   if(!candidate)continue;
   const k=norm(candidate.entry.file);
   if(seen.has(k))continue;
   if(valid.some(x=>nearDup(x.entry.file,candidate.entry.file)))continue;
   valid.push(candidate);
   seen.add(k);
  }
  if(valid.length>=loc.needed+3)break;
 }
 valid.sort((a,b)=>b.score-a.score||b.entry.width-a.entry.width);
 const selected=valid.slice(0,loc.needed).map(x=>x.entry);
 if(selected.length)found[loc.id]=selected;else noResult.push(loc.id);
 attempted.push({id:loc.id,needed:loc.needed,added:selected.length});
 if(attempted.length%30===0)console.log('ENRICH PROGRESS '+JSON.stringify({
  attempted:attempted.length,newRecords:Object.values(found).flat().length,improved:Object.keys(found).length,
  fullyFilled:attempted.filter(x=>x.added>=x.needed).length,calls:requests,rateLimited}));
}
const combined=Object.fromEntries(Object.entries({...prior,...found}).sort(([a],[b])=>a.localeCompare(b)));
const report={created:new Date().toISOString(),targetCount:targets.length,
 improvedDestinations:Object.keys(found).length,newlySourcedPhotos:Object.values(found).flat().length,
 filledToFour:attempted.filter(x=>x.added>=x.needed).length,stillIncomplete:attempted.filter(x=>x.added<x.needed).length,
 addedByDestination:attempted.filter(x=>x.added).map(x=>({...x,name:targets.find(t=>t.id===x.id)?.name})),
 noResult,apiCalls:requests,rateLimitResponses:rateLimited,errors:errors.slice(0,80),
 method:'Serial Commons exact File-title candidates, current photo CC author/licence and >=2048x900 resolution, with broad negative filtering; NOT human visual inspection'};
console.log('WORLD ENRICH REPORT '+JSON.stringify({...report,addedByDestination:undefined}));
if(write){
 const data="/* Commons file-title-source-check enrichment. These are NOT visually reviewed. */\n"+
  "(function(root){'use strict';const data="+JSON.stringify(combined,null,2)+";\n"+
  "if(typeof module==='object'&&module.exports)module.exports=data;\n"+
  "if(root)root.RevisionWorldPhotoEnrichment=Object.freeze(data);\n})(typeof window==='object'?window:null);\n";
 await fs.writeFile('world-photo-enrichment-v85.js',data);
 await fs.writeFile('editorial/world-photo-enrichment-report-v85.json',JSON.stringify(report,null,2)+'\n');
}
