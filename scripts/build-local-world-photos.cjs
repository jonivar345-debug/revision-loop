#!/usr/bin/env node
/* Generate real, locally hosted Wikimedia Commons photographs for the World shop.
 * The curated metadata is reused, NEVER replaced with blind search hits.
 * This script checks today's Commons licence and original dimensions, and
 * rejects failed/non-JPEG or tiny image responses instead of committing them.
 * Outputs stay on a development branch until review and passing tests.
 */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {promises:fsp}=fs;
const {get}=require('../world-curated-photos.js');
const manifest=require('../editorial/world-local-photo-pilot.json');
const base=path.resolve(__dirname,'../assets/world');
const headers={'User-Agent':'RevisionLoopPhotoArchive/1.0 (https://github.com/jonivar345-debug/revision-loop; educational static site)','Accept':'application/json,image/jpeg;q=0.9,*/*;q=0.1'};
const sleep=ms=>new Promise(done=>setTimeout(done,ms));
async function request(url){
  let error;
  for(let attempt=0;attempt<4;attempt++){
    try{
      const reply=await fetch(url,{headers,signal:AbortSignal.timeout(30000)});
      if(reply.ok)return reply;
      error=new Error('HTTP '+reply.status+' for '+new URL(url).host);
      if(![429,500,502,503,504].includes(reply.status))throw error;
    }catch(e){error=e;}
    if(attempt<3)await sleep((attempt+1)*2500);
  }
  throw error;
}
function normalise(s){return String(s||'').replace(/_/g,' ').trim().toLowerCase();}
function licenseAllowed(expected,current){
  const lic=String(current||'').replace(/\s+/g,' ').trim().toUpperCase();
  const canonical=String(expected||'').replace(/\s+/g,' ').trim().toUpperCase();
  if(canonical==='CC0 1.0')return /^CC\s?0(?:\s1\.0)?$/.test(lic);
  return canonical===lic&&/^CC BY(?:-SA)? (?:2\.0|3\.0|4\.0)$/.test(lic);
}
async function metadata(filename){
  const api=new URL('https://commons.wikimedia.org/w/api.php');
  for(const [k,v] of Object.entries({action:'query',prop:'imageinfo',titles:'File:'+filename,
    iiprop:'url|size|extmetadata',iiurlwidth:'1800',format:'json',formatversion:'2'}))api.searchParams.set(k,v);
  const data=await (await request(api.href)).json();
  const image=(data.query?.pages||[]).find(p=>normalise(p.title)===normalise('File:'+filename));
  const info=image?.imageinfo?.[0];
  if(!info?.thumburl||!info?.url)throw new Error('Missing Commons file: '+filename);
  return {info,meta:info.extmetadata||{}};
}
function derivativeUrl(filename,width){
  return 'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(filename.replace(/ /g,'_'))+'?width='+width;
}
async function download(filename,width,destination,preferred){
  const response=await request(preferred||derivativeUrl(filename,width));
  const bytes=Buffer.from(await response.arrayBuffer());
  // Reject HTML redirects, Wikimedia rate-limit/error pages and broken files.
  if(bytes.length<16000||bytes[0]!==0xff||bytes[1]!==0xd8||bytes[bytes.length-2]!==0xff||bytes[bytes.length-1]!==0xd9)
    throw new Error('Not a complete JPEG: '+filename+' '+width+'px, '+bytes.length+' bytes');
  if(bytes.length>7*1024*1024)throw new Error('Unusually large derivative: '+filename);
  await fsp.writeFile(destination,bytes);
  return bytes.length;
}
async function main(){
  const output={};const attribution=[];let totalBytes=0;
  for(const [id,names] of Object.entries(manifest.locations)){
    const known=get(id);const selected=[];const seen=new Set();
    await fsp.mkdir(path.join(base,id),{recursive:true});
    for(let i=0;i<names.length;i++){
      const name=names[i];
      const entry=known.find(p=>normalise(p.file)===normalise('File:'+name));
      if(!entry||!entry.author||!entry.licenseUrl||!entry.filePage)throw new Error('Not in existing curated archive: '+id+' '+name);
      if(seen.has(normalise(name)))throw new Error('Repeated source: '+id+' '+name);
      seen.add(normalise(name));
      const {info,meta}=await metadata(name);
      const actualLicense=meta.LicenseShortName?.value||'';
      if(!licenseAllowed(entry.license,actualLicense))
        throw new Error('Licence changed or not allowed: '+name+' ('+actualLicense+')');
      if(!String(meta.Artist?.value||'').trim())throw new Error('Missing current Commons author: '+name);
      if(Number(info.width)<1800||Number(info.height)<800)
        throw new Error('Original resolution below accepted minimum: '+name);
      const index=String(i+1).padStart(2,'0');
      const gallery=id+'/'+index+'-gallery.jpg';
      const cover=id+'/'+index+'-cover.jpg';
      const gallerySize=await download(name,1800,path.join(base,gallery),info.thumburl);
      const coverSize=await download(name,880,path.join(base,cover));
      totalBytes+=gallerySize+coverSize;
      const result={...entry,source:'local-library',checked:true,locationVerified:true,
        url:'./assets/world/'+gallery,localCoverUrl:'./assets/world/'+cover};
      selected.push(result);
      attribution.push({destination:id,originalFile:name,author:entry.author,license:entry.license,
        licenseUrl:entry.licenseUrl,sourcePage:entry.filePage,
        originalUrl:info.url,originalWidth:info.width,originalHeight:info.height,
        displayedGallery:result.url,displayedCover:result.localCoverUrl,
        changes:'Resized/display-sized JPEG derivatives supplied by Wikimedia Commons',
        galleryBytes:gallerySize,coverBytes:coverSize});
      process.stdout.write(id+' '+(i+1)+'/'+names.length+': '+name+'\n');
    }
    output[id]=selected;
  }
  const js='/* Generated by scripts/build-local-world-photos.cjs; keep original author/licence details. */\n'+
    '(function(root){ "use strict"; const data='+JSON.stringify(output,null,2)+
    ';\nconst api=Object.freeze({get:id=>(data[id]||[]).map(photo=>({...photo}))});'+
    'if(root)root.RevisionWorldLocalPhotos=api;'+
    'if(typeof module==="object"&&module.exports)module.exports=api;\n'+
    '})(typeof window==="object"?window:null);\n';
  await fsp.writeFile(path.resolve(__dirname,'../world-local-photos.js'),js);
  await fsp.writeFile(path.join(base,'ATTRIBUTION.json'),JSON.stringify(attribution,null,2)+'\n');
  console.log('Saved '+attribution.length+' photographs × 2 sizes ('+(totalBytes/1048576).toFixed(1)+' MiB)');
}
main().catch(err=>{console.error(err.stack||String(err));process.exitCode=1;});
