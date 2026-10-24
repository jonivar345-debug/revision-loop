/**
 * RESPONSIBLE source-first batch discovery, not a picture-quality approval.
 * Wikipedia page image associations -> Commons live imageinfo -> CC-only data.
 * Use 1 request at a time, compliant User-Agent, Retry-After and backoff;
 * no parallel requests. Unlike an article-per-request crawler, this collects
 * up to 18 exact Wikipedia pages per API call.
 * Run: node scripts/discover-world-photos-batched.mjs --write [--limit=211]
 */
import fs from 'node:fs/promises';
const cli=k=>process.argv.find(x=>x.startsWith('--'+k+'='))?.split('=').slice(1).join('=');
const cap=Math.max(1,Math.min(376,Number(cli('limit')||376)));
const writing=process.argv.includes('--write');
const stamp=new Date().toISOString(), out='world-photo-discovery-data.js';
const [csv,app,geo,curated,prev]=await Promise.all([
 'editorial/world_photo_collection_template_376.csv','app.js',
 'world-geographic-destinations.js','world-curated-photos.js',out
].map(p=>fs.readFile(p,'utf8')));
const loadData=s=>{const m=s.match(/const data=(\{[\s\S]*?\});/);try{return m?JSON.parse(m[1]):{}}catch{return {}};};
const previous=loadData(prev);
const registered=new Set(['london','busan',...Object.keys(previous)]);
const re=/(?:const\s+)(featuredCities[A-Z]?|editorial|additionalEditorial[A-Z]|independentlySourced|exactDestinationReuse)=Object\.freeze\((\{[\s\S]*?\})\);/g;
for(const m of curated.matchAll(re)){try{for(const key of Object.keys(JSON.parse(m[2])))registered.add(key)}catch{}}
const wiki=new Map();
for(const m of app.matchAll(/\{id:'([^']+)',name:'[^']*',wiki:'([^']+)'/g))wiki.set(m[1],m[2]);
for(const m of geo.matchAll(/"id":"([^"]+)","name":"[^"]+","wiki":"([^"]+)"/g))wiki.set(m[1],m[2]);
const all=csv.split(/\r?\n/).slice(1).filter(Boolean).map(l=>{
 const a=[...l.matchAll(/"([^"]*)"/g)].map(x=>x[1]);return{id:a[3],name:a[0],type:a[1],region:a[2]};
});
const missing=all.filter(x=>!registered.has(x.id)).slice(0,cap).map(x=>{
 const article=wiki.get(x.id)||x.name.replace(/^Country: /,'');
 return {...x,article:article.replaceAll('_',' ')};
});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const host='RevisionLoopLocationResearch/1.2 (https://github.com/jonivar345-debug/revision-loop; noncommercial student revision)';
let lastCall=0,requestCount=0,throttles=0,failures=[];
async function query(domain,params){
 const u=new URL('https://'+domain+'/w/api.php');
 for(const [key,val]of Object.entries({...params,action:'query',format:'json',formatversion:'2'}))u.searchParams.set(key,val);
 for(let n=0;n<4;n++){
  await wait(Math.max(0,1650-(Date.now()-lastCall)));
  lastCall=Date.now();requestCount++;
  let response;
  try{response=await fetch(u,{headers:{'User-Agent':host,'Accept':'application/json'},signal:AbortSignal.timeout(24000)});}
  catch(e){if(n===3){failures.push('Network '+domain+' '+String(e).slice(0,90));return null;}await wait(3000*(n+1));continue;}
  if(response.ok){try{return await response.json()}catch{return null}}
  if(response.status===429||response.status===503){
   throttles++;
   const retry=Number(response.headers.get('retry-after'))||6;
   await wait(Math.min(60000,Math.max(6000,retry*1000))*(n+1));
   continue;
  }
  failures.push('HTTP '+response.status+' '+domain);return null;
 }
 failures.push('Exhausted retries '+domain);return null;
}
const BAD=/\b(?:locator|flag|emblem|coat[\s_-]*of[\s_-]*arms|seal|logo|outline|drawing|svg|diagram|graph|map|district[\s_-]*map|passport|badge|montage|collage|icon|poster|video|chart|political[\s_-]*parties|physical[\s_-]*map|screenshot|coatofarms|police|airport|aircraft|hospital|ceremony|football|cricket|basketball|motorsport|circuit|election|prime[\s_-]*minister|military|anthem|award|official[\s_-]*portrait|official[\s_-]*visit)\b/i;
const SCENIC=/panoram|skyline|sunset|sunrise|coast|beach|river|lake|mountain|landscape|town|city|square|temple|bridge|cathedral|harbour|harbor|historic|fort|palace|street|park|garden|valley|waterfall|forest|cliff|castle|aerial|island|monument|basilica|bay|village|coast|gorge|reef|desert|canyon|waterfront|national\s+park|sea|ocean|waves|clouds|church|mosque|tower|pagoda|port|glacier/i;
const norm=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/_/g,' ').replace(/\s+/g,' ').trim();
const author=v=>String(v||'').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim().slice(0,160);
function parseImage(p,owner,lead){
 const info=p.imageinfo?.[0],meta=info?.extmetadata||{};
 const file=String(p.title||'').replace(/^File:/,'');
 if(!/\.(?:jpg|jpeg|png|webp)$/i.test(file)||BAD.test(file)||!info)return null;
 if(!(Number(info.width)>=2048&&Number(info.height)>=900))return null;
 if(!String(info.url||'').startsWith('https://upload.wikimedia.org/'))return null;
 const license=String(meta.LicenseShortName?.value||'').trim();
 const licenseUrl=String(meta.LicenseUrl?.value||'').trim();
 if(!/^(?:CC BY(?:-SA)? (?:2\.0|2\.5|3\.0|4\.0)|CC0 1\.0|CC 0 1\.0)$/i.test(license))return null;
 if(!/^https:\/\/creativecommons.org\/(?:licenses\/|publicdomain\/zero\/)/.test(licenseUrl))return null;
 const creator=author(meta.Artist?.value);if(!creator)return null;
 const desc=author(meta.ImageDescription?.value);
 const name=norm(owner.name.replace(/^Country: /,'')),filename=norm(file);
 const names=name.split(/\W+/g).filter(x=>x.length>=5&&!['country','national','island','islands','ocean','united','republic','south','north','east','west'].includes(x));
 const named=filename.includes(name)||names.some(x=>filename.includes(x));
 // A country's Wikipedia article may include local landmarks without naming the
 // country; for a specific city/landmark, insist on named or unmistakable lead.
 const scenic=SCENIC.test(file);
 if(!lead&&!named&&!scenic)return null;
 // City gallery covers are place/streetscape photos, not generic article images.
 // Country galleries can legitimately include scenic pictures of national
 // landmarks whose file names omit the country name.
 if((owner.type||'').includes('City')&&!lead&&!named&&!scenic)return null;
 const score=(lead?100:0)+(named?40:0)+(scenic?15:0)+Math.min(15,Math.floor(info.width/500));
 return {file,author:creator,license,licenseUrl,subject:desc||file.replaceAll('_',' '),width:Number(info.width),height:Number(info.height),
  editorialMetadata:true,reviewStatus:'Batch-discovered image from exact Wikipedia article; current Commons CC metadata checked at source; image NOT individually visually inspected',sourceArticle:owner.article,wasArticleLead:!!lead,score};
}
function chunks(a,n){const out=[];for(let i=0;i<a.length;i+=n)out.push(a.slice(i,i+n));return out;}
const found={};const diagnostics={attempted:0,sourcePhotos:0,articlePages:0,noImages:[],queries:[],across:[],failed:[]};
// Deeper second pass: smaller groups allow more photographs per Wikipedia
// article, especially for countries with several distinct regions.
for(const group of chunks(missing,8)){
 diagnostics.attempted+=group.length;
 // Query 18 exact encyclopaedia article titles in ONE API call. Responses may
 // contain redirects; use MediaWiki's normalized and redirected title mapping.
 const titles=[...new Set(group.map(x=>x.article))];
 const api=await query('en.wikipedia.org',{titles:titles.join('|'),prop:'pageimages|images',piprop:'name',imlimit:'120',redirects:'1'});
 if(!api?.query?.pages){diagnostics.failed.push(...group.map(x=>x.id));console.log('BATCH FAILED '+group[0].id+' through '+group.at(-1).id);continue}
 const resolved={};for(const t of titles)resolved[t]=t;
 for(const n of (api.query.normalized||[]))for(const [k,v]of Object.entries(resolved))if(norm(v)===norm(n.from))resolved[k]=n.to;
 for(const n of (api.query.redirects||[]))for(const [k,v]of Object.entries(resolved))if(norm(v)===norm(n.from))resolved[k]=n.to;
 const pages=api.query.pages||[];
 const byTitle=new Map(pages.map(p=>[norm(p.title),p]));
 const indexes=new Map(),requested=new Set();
 for(const row of group){
  const page=byTitle.get(norm(resolved[row.article]))||byTitle.get(norm(row.article));
  if(!page||page.missing){diagnostics.noImages.push(row.id);continue}
  diagnostics.articlePages++;
  const lead=page.pageimage&&('File:'+page.pageimage.replace(/^File:/,''));
  const names=[lead,...(page.images||[]).map(x=>x.title)].filter(Boolean)
   .filter(x=>/^File:.+\.(?:jpg|jpeg|png|webp)$/i.test(x)&&!BAD.test(x));
  const unique=[...new Set(names)].slice(0,65);
  indexes.set(row.id,{row,lead,names:unique});
  for(const f of unique)requested.add(f);
 }
 const files=[...requested],infoPages=[];
 for(const imageGroup of chunks(files,38)){
  const res=await query('commons.wikimedia.org',{titles:imageGroup.join('|'),prop:'imageinfo',iiprop:'url|size|extmetadata',iiurlwidth:'2048'});
  if(res?.query?.pages)infoPages.push(...res.query.pages);
 }
 const fileMap=new Map(infoPages.map(p=>[norm(p.title),p]));
 for(const [id,{row,lead,names}]of indexes){
  const candidates=[];
  for(const f of names){
   const p=fileMap.get(norm(f));if(!p)continue;
   const record=parseImage(p,row,!!lead&&norm(f)===norm(lead));
   if(record)candidates.push(record);
  }
  candidates.sort((a,b)=>b.score-a.score||b.width-a.width);
  const chosen=[],unique=new Set();
  for(const c of candidates){if(unique.has(norm(c.file)))continue;unique.add(norm(c.file));delete c.score;chosen.push(c);if(chosen.length>=4)break}
  if(chosen.length){found[id]=chosen;diagnostics.sourcePhotos+=chosen.length;}
  else diagnostics.noImages.push(id);
 }
 console.log('BATCH '+JSON.stringify({processed:diagnostics.attempted,newDestinations:Object.keys(found).length,newPhotos:diagnostics.sourcePhotos,apiCalls:requestCount,throttles,failed:diagnostics.failed.length}));
}
const combined=Object.fromEntries(Object.entries({...previous,...found}).sort(([a],[b])=>a.localeCompare(b)));
const report={created:stamp,attempted:missing.length,addedDestinationIds:Object.keys(found),addedDestinations:Object.keys(found).length,newSourcePhotos:diagnostics.sourcePhotos,
 totalDestinations:Object.keys(combined).length,totalSourcePhotos:Object.values(combined).reduce((n,a)=>n+a.length,0),
 apiRequests:requestCount,rateLimitResponses:throttles,errors:failures.slice(0,16),failedArticleIds:diagnostics.failed.slice(0,80),noMatchCount:diagnostics.noImages.length,
 methodology:'Batched exact Wikipedia pages with live Commons CC author/license/size check; no pixels visually checked. Sources rechecked in browser.'};
console.log('SOURCE AUDIT '+JSON.stringify(report));
if(writing){
 const data='/* Source-reviewed Wikipedia/Commons photo candidates, not visually hand-curated. */\n'+
  '(function(root){ "use strict";const data='+JSON.stringify(combined,null,2)+';\n'+
  'if(typeof module==="object"&&module.exports)module.exports=data;\n'+
  'if(root)root.RevisionWorldDiscoveryPhotos=Object.freeze(data);\n})(typeof window==="object"?window:null);\n';
 await fs.writeFile(out,data);
 await fs.writeFile('editorial/world-photo-batch-audit-v83.json',JSON.stringify(report,null,2)+'\n');
}
if(Object.keys(found).length===0)process.exitCode=2;
