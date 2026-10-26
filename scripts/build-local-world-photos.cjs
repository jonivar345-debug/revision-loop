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
global.window={RevisionWorldDiscoveryPhotos:require('../world-photo-discovery-data.js'),RevisionWorldPhotoEnrichment:require('../world-photo-enrichment-v85.js'),RevisionWorldV104Photos:require('../world-photo-editorial-v104.js')};
const {get}=require('../world-curated-photos.js');
const manifest=require('../editorial/world-local-photo-pilot.json');
const v114Batch=require('../editorial/world-v114-batch-targets.json');
const v114Targets=new Set(v114Batch.targets);
const v116Batch=require('../editorial/world-v116-batch-targets.json');
const v116Repaired=new Set(Object.keys(v116Batch.replacements));
const v116New=new Set(v116Batch.newDestinations);
// Preserve partial galleries if a new four-photo set fails live validation.
const partialFallbacks=Object.fromEntries(Object.entries(manifest.locations).filter(([id,photos])=>v114Targets.has(id)&&photos.length<4).map(([id,photos])=>[id,[...photos]]));
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
  return canonical===lic&&/^CC BY(?:-SA)? (?:2\.0|2\.5|3\.0|4\.0)$/.test(lic);
}
const metadataMemo=new Map();
async function metadata(filename){
  if(metadataMemo.has(filename))return metadataMemo.get(filename);
  const api=new URL('https://commons.wikimedia.org/w/api.php');
  for(const [k,v] of Object.entries({action:'query',prop:'imageinfo',titles:'File:'+filename,
    iiprop:'url|size|extmetadata',iiurlwidth:'1800',format:'json',formatversion:'2'}))api.searchParams.set(k,v);
  const data=await (await request(api.href)).json();
  const image=(data.query?.pages||[]).find(p=>normalise(p.title)===normalise('File:'+filename));
  const info=image?.imageinfo?.[0];
  if(!info?.thumburl||!info?.url)throw new Error('Missing Commons file: '+filename);
  const answer={info,meta:info.extmetadata||{}};
  metadataMemo.set(filename,answer);
  return answer;
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
  let acceptedV114=0;
  const skippedV114=[];
  for(const [id,selection] of Object.entries(v116Batch.approvedSelections)){
    if(JSON.stringify(manifest.locations[id])!==JSON.stringify(selection))
      throw new Error('v116 unapproved manifest mutation: '+id);
  }
  for(const id of v116New){if(v114Targets.has(id)||partialFallbacks[id])throw new Error('Existing gallery cannot be a new v116 destination: '+id)}
  // Preserve optimization provenance for assets already present in the archive.
  // Do not clear size-budget status when a later batch revalidates the source.
  let pastAttribution=[];
  try{pastAttribution=JSON.parse(await fsp.readFile(path.join(base,'ATTRIBUTION.json'),'utf8'))}catch{}
  const pastBySource=new Map(pastAttribution.map(p=>[p.destination+'|'+p.originalFile,p]));

  // On later batches, reuse downloaded JPEG bytes after checking their signatures.
  // Previously imported assets retain their original checked attribution; new files get live Commons licence checks.
  async function savedJpeg(name){
    try{const bytes=await fsp.readFile(name);return bytes.length>=16000&&bytes[0]===255&&bytes[1]===216&&bytes.at(-2)===255&&bytes.at(-1)===217?bytes.length:0;}catch{return 0;}
  }
  async function savedWebp(name){
    try{const bytes=await fsp.readFile(name);
      return bytes.length>=6000&&bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP'?bytes.length:0;
    }catch{return 0;}
  }
  for(const [id,names] of Object.entries(manifest.locations)){
    const known=get(id);
    // New v114 galleries must pass live Commons resolution/rights checks before
    // acceptance. Earlier locally accepted selections must never be auto-replaced.
    if(v114Targets.has(id)&&!v116Repaired.has(id)){
      if(acceptedV114>=v114Batch.maxGalleries){
        delete manifest.locations[id];
        continue;
      }
      const good=[];
      const approved=v114Batch.approvedSelections[id]||[];
      if(approved.length!==4)throw new Error('Missing explicit four-photo source set: '+id);
      for(const candidateName of approved){
        const candidate=known.find(p=>normalise(p.file)===normalise('File:'+candidateName));
        if(!candidate||!/\.jpe?g$/i.test(candidateName)||
          !candidate.author||!candidate.licenseUrl||!candidate.filePage){
          console.log('Missing approved source: '+id+' '+candidateName);
          continue;
        }
        try{
          const {info,meta}=await metadata(candidateName);
          const licence=meta.LicenseShortName?.value||'';
          if(!licenseAllowed(candidate.license,licence))throw new Error('licence mismatch: '+licence);
          if(!String(meta.Artist?.value||'').trim())throw new Error('missing credited author');
          if(Number(info.width)<1800||Number(info.height)<800)throw new Error('insufficient source resolution');
          good.push(candidateName);
        }catch(error){
          console.log('Deferring v114 candidate '+id+': '+candidateName+' ('+error.message+')');
        }
      }
      if(good.length<4 || new Set(good.map(normalise)).size!==4){
        skippedV114.push({id,found:good.length});
        if(partialFallbacks[id]){
          names.splice(0,names.length,...partialFallbacks[id]);
          console.log('Keeping existing partial local gallery for '+id+' after '+good.length+' validated new photographs');
        }else{
          delete manifest.locations[id];
          console.log('Deferring v114 destination '+id+': only '+good.length+' validated photographs');
          continue;
        }
      }else{
        names.splice(0,names.length,...good);
        acceptedV114++;
        console.log('Accepted v114 destination '+id+' ('+acceptedV114+'/'+v114Batch.maxGalleries+')');
      }
    }
    const selected=[];const seen=new Set();
    await fsp.mkdir(path.join(base,id),{recursive:true});
    for(let i=0;i<names.length;i++){
      const name=names[i];
      const entry=known.find(p=>normalise(p.file)===normalise('File:'+name));
      if(!entry||!entry.author||!entry.licenseUrl||!entry.filePage)throw new Error('Not in existing curated archive: '+id+' '+name);
      if(seen.has(normalise(name)))throw new Error('Repeated source: '+id+' '+name);
      seen.add(normalise(name));
      const index=String(i+1).padStart(2,'0');
      const gallery=id+'/'+index+'-gallery.webp';
      const cover=id+'/'+index+'-cover.webp';
      const galleryWebp=await savedWebp(path.join(base,gallery));
      const coverWebp=await savedWebp(path.join(base,cover));
      const prior=pastBySource.get(id+'|'+name);
      // CC licences for previously downloaded, correctly attributed versions
      // remain valid. Don't hammer Commons on every archive rerun: it rate-limits
      // large requests, and our actual JPEG/WebP assets are already local.
      // A slot is numbered, not keyed by Commons title. If a curated source
      // was replaced or reordered, never mistake the previous photo bytes for
      // the new source (even though its local path has the same number).
      const priorMatchesSlot=!!(prior&&prior.displayedGallery==='./assets/world/'+gallery&&prior.displayedCover==='./assets/world/'+cover);
      if(!priorMatchesSlot){
        await Promise.all([gallery,cover].map(f=>fsp.rm(path.join(base,f),{force:true})));
      }
      const usableGallery=priorMatchesSlot?galleryWebp:0;
      const usableCover=priorMatchesSlot?coverWebp:0;
      const reuse=!!(priorMatchesSlot&&prior&&usableGallery&&usableCover&&
        prior.author===entry.author&&prior.license===entry.license&&
        prior.licenseUrl===entry.licenseUrl&&
        Number(prior.originalWidth)>=1800&&Number(prior.originalHeight)>=800&&prior.originalUrl);
      const {info,meta}=reuse?
        {info:{url:prior.originalUrl,width:prior.originalWidth,height:prior.originalHeight},meta:null}:
        await metadata(name);
      if(!reuse){
        const actualLicense=meta.LicenseShortName?.value||'';
        if(!licenseAllowed(entry.license,actualLicense))
          throw new Error('Licence changed or not allowed: '+name+' ('+actualLicense+')');
        if(!String(meta.Artist?.value||'').trim())throw new Error('Missing current Commons author: '+name);
      }
      if(Number(info.width)<1800||Number(info.height)<800)
        throw new Error('Original resolution below accepted minimum: '+name);
      // Existing optimized copies remain first-party assets and are never
      // downloaded from Commons again; new sources stage JPEGs for Pillow.
      const gallerySize=usableGallery||((await savedJpeg(path.join(base,id+'/'+index+'-gallery.jpg')))||await download(name,1800,path.join(base,id+'/'+index+'-gallery.jpg'),info.thumburl));
      const coverSize=usableCover||((await savedJpeg(path.join(base,id+'/'+index+'-cover.jpg')))||await download(name,880,path.join(base,id+'/'+index+'-cover.jpg')));
      totalBytes+=gallerySize+coverSize;
      const result={...entry,source:'local-library',checked:true,locationVerified:true,
        url:'./assets/world/'+gallery,localCoverUrl:'./assets/world/'+cover};
      selected.push(result);
      attribution.push({destination:id,originalFile:name,author:entry.author,license:entry.license,
        licenseUrl:entry.licenseUrl,sourcePage:entry.filePage,
        originalUrl:info.url,originalWidth:info.width,originalHeight:info.height,
        displayedGallery:result.url,displayedCover:result.localCoverUrl,
        newSizeBudgeted:!!pastBySource.get(id+'|'+name)?.newSizeBudgeted,
        changes:'Display-sized Commons derivative converted to WebP for local hosting; no upscaling',
        galleryBytes:gallerySize,coverBytes:coverSize});
      process.stdout.write(id+' '+(i+1)+'/'+names.length+': '+name+'\n');
    }
    output[id]=selected;
  }
  for(const id of [...v116New,...v116Repaired]){
    if(!output[id]||output[id].length!==4)
      throw new Error('v116 exact four-photo local import incomplete: '+id);
  }
  for(const required of v114Batch.requiredGalleries||[])
    if(!manifest.locations[required] || !output[required] || output[required].length!==4)
      throw new Error('Essential v114 approved gallery unavailable: '+required);
  if(acceptedV114+v116Repaired.size<v114Batch.minimumGalleries)
    throw new Error('Only '+acceptedV114+' validated v114 galleries, below minimum '+v114Batch.minimumGalleries+'; deferred '+JSON.stringify(skippedV114));
  await fsp.writeFile(path.resolve(__dirname,'../editorial/world-local-photo-pilot.json'),JSON.stringify(manifest,null,2)+'\n');
  console.log('v114 accepted '+acceptedV114+' additional four-photo galleries, deferred '+skippedV114.length+'.');
  const js='/* Generated by scripts/build-local-world-photos.cjs; keep original author/licence details. */\n'+
    '(function(root){ "use strict"; const data='+JSON.stringify(output,null,2)+
    ';\nconst api=Object.freeze({get:id=>(data[id]||[]).map(photo=>({...photo}))});'+
    'if(root)root.RevisionWorldLocalPhotos=api;'+
    'if(typeof module==="object"&&module.exports)module.exports=api;\n'+
    '})(typeof window==="object"?window:null);\n';
  await fsp.writeFile(path.resolve(__dirname,'../world-local-photos.js'),js);
  await fsp.writeFile(path.join(base,'ATTRIBUTION.json'),JSON.stringify(attribution,null,2)+'\n');
  console.log('Verified '+attribution.length+' Commons photo sources; staging/optimized assets ('+(totalBytes/1048576).toFixed(1)+' MiB before conversion)');
}
main().catch(err=>{console.error(err.stack||String(err));process.exitCode=1;});
