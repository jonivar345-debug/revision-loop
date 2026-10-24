/**
 * Broad, conservative Wiki/Commons image candidate discovery for World shop.
 * Auto-selected article-associated files are NOT hand-verified photographs.
 * Keeps Commons' current CC author/licence and links; browser revalidates each.
 * Usage: node scripts/discover-world-photos.mjs [--limit=12] [--write]
 * Never uses the user's profile, costs, questions, purchases, or cookies.
 */
import fs from 'node:fs/promises';
const root=process.cwd();
const arg=k=>process.argv.find(x=>x.startsWith('--'+k+'='))?.split('=').slice(1).join('=');
const limit=Math.max(1,Math.min(376,Number(arg('limit')||376)));
const offset=Math.max(0,Math.min(375,Number(arg('offset')||0)));
const writing=process.argv.includes('--write');
const dest='world-photo-discovery-data.js';
const csv=await fs.readFile('editorial/world_photo_collection_template_376.csv','utf8');
const app=await fs.readFile('app.js','utf8');
const geography=await fs.readFile('world-geographic-destinations.js','utf8');
const source=await fs.readFile('world-curated-photos.js','utf8');
const covered=new Set(['london','busan']);
for(const m of source.matchAll(/const (?:featuredCities[A-Z]?|editorial|additionalEditorial[A-Z])=Object\.freeze\((\{[\s\S]*?\})\);/g)){
 try{for(const id of Object.keys(JSON.parse(m[1])))covered.add(id);}catch{}
}
const wiki=new Map();
for(const m of app.matchAll(/\{id:'([^']+)',name:'[^']*',wiki:'([^']+)'/g))wiki.set(m[1],m[2]);
for(const m of geography.matchAll(/"id":"([^"]+)","name":"[^"]+","wiki":"([^"]+)"/g))wiki.set(m[1],m[2]);
const rows=csv.split(/\r?\n/).slice(1).filter(Boolean).map(l=>{
 const p=[...l.matchAll(/"([^"]*)"/g)].map(m=>m[1]);
 return {name:p[0],type:p[1],region:p[2],id:p[3]};
}).filter(x=>x.id&&!covered.has(x.id)).slice(offset,offset+limit);
const rejected=/\b(?:map|flag|locator|diagram|graph|chart|logo|coat.of.arms|drawing|montage|collage|seal|emblem|illustration|poster|route|infographic|seal|icon|coat of arms|satellite map|covid|mask|selfie|portrait of|panorama map)\b/i;
const scenic=/panoram|skyline|sunset|sunrise|coast|beach|river|lake|mountain|landscape|town|city|square|temple|bridge|cathedral|harbour|harbor|historic|fort|palace|street|park|garden|valley|waterfall|forest|cliff|castle|aerial|island|monument|basilica|bay|village/i;
function matchTerm(name,place){
 const text=String(name||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[_-]/g,' ');
 const p=String(place||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const terms=p.replace(/^country:/,'').replace(/[^a-z0-9 ]/g,' ').split(' ').filter(t=>t.length>=4&&!['country','island','islands','north','south','east','west','city','ocean','national','park','united','republic'].includes(t));
 return terms.some(t=>text.includes(t));
}
function apiUrl(host,params){const u=new URL('https://'+host+'/w/api.php');for(const [k,v] of Object.entries(params))u.searchParams.set(k,v);return u;}
async function getJson(url){
 let last='unavailable';
 for(let i=0;i<3;i++){
  try{
   const resp=await fetch(url,{headers:{'User-Agent':'RevisionLoopPhotoAudit/1.0 (noncommercial revision website; github.com/jonivar345-debug/revision-loop)','Accept':'application/json'},signal:AbortSignal.timeout(9000)});
   if(!resp.ok){last='HTTP '+resp.status+' at '+url.hostname;if(resp.status===429||resp.status>=500){await new Promise(resolve=>setTimeout(resolve,700*(i+1)));continue;}return {error:last};}
   const raw=await resp.json();
   return raw;
  }catch(e){last=String(e).slice(0,100)+' at '+url.hostname;await new Promise(resolve=>setTimeout(resolve,450*(i+1)));}
 }
 return {error:last};
}
function decodeAuthor(v){return String(v||'').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim().slice(0,160);}
function parseImage(page,lead,loc){
 const info=page.imageinfo?.[0],meta=info?.extmetadata||{};
 const file=String(page.title||'').replace(/^File:/,'');
 if(!/\.(?:jpg|jpeg|png|webp)$/i.test(file)||rejected.test(file))return null;
 const license=String(meta.LicenseShortName?.value||'').trim();
 const licenseUrl=String(meta.LicenseUrl?.value||'').trim();
 const author=decodeAuthor(meta.Artist?.value);
 if(!/^(?:CC BY(?:-SA)? (?:2\.0|3\.0|4\.0)|CC0 1\.0|CC 0 1\.0)$/i.test(license))return null;
 if(!licenseUrl.startsWith('https://creativecommons.org/'))return null;
 if(!author||!info?.url?.startsWith('https://upload.wikimedia.org/'))return null;
 if(!(Number(info.width)>=2048&&Number(info.height)>=900))return null;
 const description=decodeAuthor(meta.ImageDescription?.value).slice(0,170);
 const locationSignal=matchTerm(file+' '+description,loc.name);
 const relevance=(lead?30:0)+(locationSignal?24:0)+(scenic.test(file)?14:0)+(scenic.test(description)?4:0)+Math.min(6,Math.floor(Number(info.width)/1500));
 if(!lead&&!locationSignal&&!scenic.test(file))return null;
 return {file,author,license,licenseUrl,subject:description||file.replace(/[_-]/g,' '),width:Number(info.width),height:Number(info.height),
  editorialMetadata:true,reviewStatus:'Automated Wikipedia article-associated candidate; original Commons licence checked during sourcing; pixels NOT visually approved',sourceArticle:loc.wiki,score:relevance,wasArticleLead:lead};
}
const stats={attempted:0,articleResults:0,records:0,failures:[],noMatch:[],byRegion:{},discovered:{}};
let cursor=0;
async function one(loc){
 const title=loc.wiki;
 const page=await getJson(apiUrl('en.wikipedia.org',{action:'query',prop:'pageimages|images',piprop:'name',imlimit:'50',redirects:'1',titles:title,format:'json',formatversion:'2'}));
 if(page.error){stats.failures.push([loc.id,page.error]);return}
 const pages=page.query?.pages||[];
 const main=pages.find(x=>x.pageimage||x.images?.length);
 if(!main){stats.noMatch.push(loc.id);return}
 const lead=main.pageimage?('File:'+main.pageimage.replace(/^File:/,'')):null;
 const imageNames=[lead,...(main.images||[]).map(x=>x.title)].filter(Boolean);
 const names=[...new Set(imageNames.filter(x=>/^File:.+\.(?:jpg|jpeg|png|webp)$/i.test(x)&&!rejected.test(x)))].slice(0,45);
 if(!names.length){stats.noMatch.push(loc.id);return}
 const candidates=[];
 for(let n=0;n<names.length;n+=20){
  const chunk=names.slice(n,n+20);
  const metadata=await getJson(apiUrl('commons.wikimedia.org',{action:'query',prop:'imageinfo',titles:chunk.join('|'),
    iiprop:'url|size|extmetadata',iiurlwidth:'2048',format:'json',formatversion:'2'}));
  if(metadata.error){stats.failures.push([loc.id,metadata.error]);continue}
  for(const p of metadata.query?.pages||[]){
   const m=parseImage(p,('File:'+String(p.title||'').replace(/^File:/,''))===lead,loc);
   if(m)candidates.push(m);
  }
  if(candidates.length>=9)break;
 }
 candidates.sort((a,b)=>b.score-a.score||b.width-a.width);
 const unique=new Set(),chosen=[];
 for(const item of candidates){const key=item.file.toLowerCase().replace(/[^a-z0-9]/g,'');if(unique.has(key))continue;unique.add(key);delete item.score;
  if(chosen.length<4)chosen.push(item);else break;
 }
 if(!chosen.length){stats.noMatch.push(loc.id);return}
 stats.discovered[loc.id]=chosen;
 stats.articleResults++;
 stats.records+=chosen.length;
 stats.byRegion[loc.region]=(stats.byRegion[loc.region]||0)+1;
}
async function worker(){
 while(cursor<rows.length){const loc=rows[cursor++];await one({...loc,wiki:wiki.get(loc.id)||loc.name});stats.attempted++;
  if(stats.attempted%25===0)console.log('DISCOVERY PROGRESS '+JSON.stringify({attempted:stats.attempted,candidates:stats.articleResults,photos:stats.records,failures:stats.failures.length}));}
}
await Promise.all(Array.from({length:2},()=>worker()));
const details={created:new Date().toISOString(),candidateDestinations:stats.articleResults,sourcePhotos:stats.records,
 considered:stats.attempted,failedRequests:stats.failures.length,missingPhotoCount:stats.noMatch.length,byRegion:stats.byRegion,
 warning:'Machine-selected article-associated photos, not personally reviewed; exact Commons author/licence checked during discovery and rechecked at display time'};
console.log('DISCOVERY RESULT '+JSON.stringify({...details,sampleFailures:stats.failures.slice(0,8),sampleNoMatch:stats.noMatch.slice(0,12)}));
if(writing&&stats.articleResults>=1){
 const existing=await fs.readFile(dest,'utf8').catch(()=> '');
 const match=existing.match(/const data=(\{[\s\S]*?\});/);
 let previous={};
 try{previous=match?JSON.parse(match[1]):{}}catch{}
 const data=Object.fromEntries(Object.entries({...previous,...stats.discovered}).sort(([a],[b])=>a.localeCompare(b)));
 details.cumulativeDestinationCount=Object.keys(data).length;
 details.cumulativeSourcePhotos=Object.values(data).reduce((n,v)=>n+v.length,0);
 const js='/* Automated source-backed Wikipedia/Commons photo candidates; NOT visual approval.\n'+
  '   Commons author/licence and original bytes are checked again before display. */\n'+
  '(function(root){ "use strict";\n  const data='+JSON.stringify(data,null,2)+';\n'+
  '  if(typeof module==="object"&&module.exports)module.exports=data;\n'+
  '  if(root)root.RevisionWorldDiscoveryPhotos=Object.freeze(data);\n})(typeof window==="object"?window:null);\n';
 await fs.writeFile(dest,js);
 await fs.writeFile('editorial/world-photo-discovery-report.json',JSON.stringify(details,null,2)+'\n');
 console.log('DISCOVERY WRITTEN '+dest+' bytes='+js.length);
}
if(stats.articleResults===0){console.error('No Wikimedia results; leave gallery unchanged');process.exitCode=2;}
