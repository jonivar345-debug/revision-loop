/* Wikimedia Commons media viewer: checks current file-level licensing before showing an image.
   Automated search is NOT a human verification of what a photo depicts. No trackers or profile storage. */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.RevisionWorldCommonsMedia=Object.freeze(api);
})(typeof window==='object'?window:null,function(){
 'use strict';
 const CHECKED_LOCATION_PHOTOS=Object.freeze({
  nairobi:{file:'Nairobi skyline P1000021.jpg',description:'Nairobi skyline from Upper Hill',author:'Lmwangi',license:'CC BY-SA 3.0'},
  newyork:{file:'New York City, Skyline.jpg',description:'Skyline of Lower Manhattan, New York City',author:'Davidswiki',license:'CC BY-SA 4.0'},
  cusco:{file:'Plaza de Armas Cusco.jpg',description:'Historic Plaza de Armas in Cusco, Peru',author:'Yanela Sharumi Ccalluco Vargas',license:'CC BY-SA 4.0'},
  sydney:{file:'Sydney Opera House.jpg',description:'Sydney Opera House beside the harbour',author:'Michael elwazer',license:'CC BY-SA 4.0'},
  tokyo:{file:'Tokyo skyline seen from Tokyo Skytree.jpg',description:'Tokyo skyline seen from the Tokyo Skytree',author:'Ruthsic',license:'CC BY-SA 4.0'},
  reykjavik:{file:'Reykjavik from Hallgrimskikrja.jpg',description:'Reykjavik cityscape seen from Hallgrímskirkja',author:'Wa17gs',license:'CC BY-SA 4.0'},
  london:{file:'The Tower Bridge, London, UK.jpg',description:'Tower Bridge over the Thames in London',author:'Maksim Sokolov (maxergon.com)',license:'CC BY-SA 4.0'},
  busan:{file:'Seomyeon Skyline.jpg',description:'Skyline of Seomyeon district, Busan',author:'Minseong Kim',license:'CC BY-SA 4.0'},
  tbilisi:{file:'Old Tbilisi skyline.jpg',description:'Old Tbilisi skyline and Holy Trinity Cathedral',author:'Ishai Parasol',license:'CC BY-SA 2.0'},
  capetown:{file:'Cape Town Table Mountain.jpg',description:'Cape Town Table Mountain from the V&A Waterfront',author:'Matthiasmullie',license:'CC BY-SA 4.0'},
  cape_town:{file:'Cape Town Table Mountain.jpg',description:'Cape Town Table Mountain from the V&A Waterfront',author:'Matthiasmullie',license:'CC BY-SA 4.0'}
 });
 function approvedFor(locationId){
  const entry=CHECKED_LOCATION_PHOTOS[locationId];
  if(!entry)return null;
  const file=entry.file.replaceAll(' ','_');
  const licenseVersion=entry.license.match(/([0-9]\.[0-9])$/)?.[1]||'4.0';
  return {...entry,checked:true,filePage:'https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(file),
   licenseUrl:'https://creativecommons.org/licenses/by-sa/'+licenseVersion+'/',
   url:'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(file)+'?width=780'};
 }

 const ALLOWED=/^CC (?:BY(?:-SA)? (?:2\.0|3\.0|4\.0)|0 (?:1\.0))$/i;
 const UNSUITABLE=/\b(?:flag|coat.of.arms|emblem|locator|location.map|route.map|logo|seal|diagram|chart|icon|poster|screenshot|administrative.map|blank.map)\b/i;
 const badFileName=name=>UNSUITABLE.test(String(name||'').replace(/[_-]/g,' '));

 function cleanHTML(html,doc){
  if(typeof html!=='string')return '';
  if(doc?.implementation?.createHTMLDocument){
   const parsed=doc.implementation.createHTMLDocument('');
   parsed.body.innerHTML=html;
   return (parsed.body.textContent||'').replace(/\s+/g,' ').trim().slice(0,240);
  }
  return html.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim().slice(0,240);
 }
 function inspect(page,doc){
  const info=page?.imageinfo?.[0],meta=info?.extmetadata||{};
  const value=(key)=>String(meta[key]?.value||'').trim();
  const licence=value('LicenseShortName');
  const url=value('LicenseUrl');
  const author=cleanHTML(value('Artist'),doc);
  const file=String(page?.title||'');
  const imageURL=info?.thumburl||info?.url;
  if(!ALLOWED.test(licence)||!author||!file.startsWith('File:')||!imageURL)return null;
  if(badFileName(file))return null;
  let licenseURL,sourceURL,photoURL;
  try {
   licenseURL=new URL(url);
   sourceURL=new URL('https://commons.wikimedia.org/wiki/'+encodeURIComponent(file).replace('%3A',':'));
   photoURL=new URL(imageURL);
   if(licenseURL.protocol!=='https:'||licenseURL.hostname!=='creativecommons.org')return null;
   if(sourceURL.protocol!=='https:'||photoURL.protocol!=='https:')return null;
   if(!/^(?:upload\.wikimedia\.org|commons\.wikimedia\.org)$/.test(photoURL.hostname))return null;
  }catch{return null}
  return {file,author,license:licence,licenseUrl:licenseURL.href,filePage:sourceURL.href,url:photoURL.href,
    description:cleanHTML(value('ImageDescription'),doc)||file.replace(/^File:/,'')};
 }
 async function searchUncached(query,{fetcher,doc,limit=2}={}){
  const fetchFn=fetcher||(typeof fetch==='function'?fetch:null);
  const trimmed=String(query||'').trim().slice(0,150);
  if(!fetchFn||trimmed.length<3)return [];
  const u=new URL('https://commons.wikimedia.org/w/api.php');
  const params={action:'query',generator:'search',gsrnamespace:'6',gsrsearch:trimmed,gsrlimit:'12',prop:'imageinfo',
   iiprop:'url|extmetadata',iiurlwidth:'780',format:'json',formatversion:'2',origin:'*'};
  Object.entries(params).forEach(([key,value])=>u.searchParams.set(key,value));
  try {
   const response=await fetchFn(u.href,{cache:'force-cache',credentials:'omit'});
   if(!response?.ok)return [];
   const data=await response.json();
   const banned=/logo|flag|map|icon|diagram|illustration|poster|coat.of.arms|seal|screenshot/i;
   const pages=(data.query?.pages||[]).filter(p=>!banned.test(p.title||''));
   const output=[];
   for(const page of pages){
    const entry=inspect(page,doc||(typeof document!=='undefined'?document:null));
    if(entry&&!output.some(e=>e.file===entry.file))output.push(entry);
    if(output.length>=limit)break;
   }
   return output;
  }catch{return []}
 }
 const jobs=new Map();
 // Prefer the lead photograph of the EXACT encyclopedia article to random
 // search results. The Commons file itself must still pass our rights checks.
 async function searchPageUncached(wiki,{fetcher,doc}={}){
   const get=fetcher||(typeof fetch==='function'?fetch:null);
   const title=String(wiki||'').replace(/_/g,' ').trim().slice(0,120);
   if(!get||!title)return [];
   try{
     const pageUrl=new URL('https://en.wikipedia.org/w/api.php');
     for(const [k,v] of Object.entries({action:'query',prop:'pageimages',piprop:'name',
       titles:title,format:'json',formatversion:'2',origin:'*'}))pageUrl.searchParams.set(k,v);
     const pageResponse=await get(pageUrl.href,{cache:'force-cache',credentials:'omit'});
     if(!pageResponse.ok)return [];
     const pages=(await pageResponse.json()).query?.pages||[];
     const name=pages.find(p=>p.pageimage)?.pageimage;
     if(!name)return [];
     const commonsUrl=new URL('https://commons.wikimedia.org/w/api.php');
     for(const [k,v] of Object.entries({action:'query',prop:'imageinfo',titles:'File:'+name.replace(/^File:/,''),
       iiprop:'url|extmetadata',iiurlwidth:'780',format:'json',formatversion:'2',origin:'*'}))commonsUrl.searchParams.set(k,v);
     const rightsResponse=await get(commonsUrl.href,{cache:'force-cache',credentials:'omit'});
     if(!rightsResponse.ok)return [];
     const rights=(await rightsResponse.json()).query?.pages||[];
     const verified=rights.map(page=>inspect(page,doc||(typeof document!=='undefined'?document:null))).find(Boolean);
     return verified?[verified]:[];
   }catch{return []}
 }
 // Curated file names are *hints*, never permission or proof. Recheck the
 // Commons file's current licence, artist and actual thumbnail before display.
 async function verifyApproved(locationId,{fetcher,doc}={}){
   const hint=approvedFor(locationId);
   const get=fetcher||(typeof fetch==='function'?fetch:null);
   if(!hint||!get)return null;
   try{
     const req=new URL('https://commons.wikimedia.org/w/api.php');
     for(const [k,v] of Object.entries({action:'query',prop:'imageinfo',titles:'File:'+hint.file,
       iiprop:'url|extmetadata',iiurlwidth:'780',format:'json',formatversion:'2',origin:'*'}))req.searchParams.set(k,v);
     const response=await get(req.href,{cache:'force-cache',credentials:'omit'});
     if(!response.ok)return null;
     const records=(await response.json()).query?.pages||[];
     const actual=records.map(p=>inspect(p,doc||(typeof document!=='undefined'?document:null))).find(Boolean);
     if(!actual||actual.file.replaceAll('_',' ').toLowerCase()!==('File:'+hint.file).replaceAll('_',' ').toLowerCase())return null;
     return {...actual,checked:true,description:hint.description+' — '+actual.description};
   }catch{return null}
 }
 const pageJobs=new Map();
 function searchPage(wiki,options={}){
   if(options.fetcher)return searchPageUncached(wiki,options);
   const key=String(wiki||'').trim().toLowerCase();
   if(!pageJobs.has(key)){
     const promise=new Promise(resolve=>{
       queue.push({work:()=>searchPageUncached(wiki,options),resolve});
       drain();
     });
     pageJobs.set(key,promise);
   }
   return pageJobs.get(key);
 }

 const queue=[];
 let active=0;
 function drain(){
  while(active<4&&queue.length){
   const job=queue.shift();active++;
   Promise.resolve().then(job.work).then(job.resolve,()=>job.resolve([])).finally(()=>{active--;drain()});
  }
 }
 function search(query,options={}){
  // Real browser searches share results across card rerenders; tests with
  // injected fetcher are deliberately uncached and deterministic.
  if(options.fetcher)return searchUncached(query,options);
  const key=String(query||'').trim().toLowerCase()+'|'+String(options.limit||2);
  if(jobs.has(key))return jobs.get(key);
  const task=new Promise(resolve=>{queue.push({work:()=>searchUncached(query,options),resolve});drain()});
  jobs.set(key,task);
  return task;
 }
 function append(el,images,{doc,emptyText='No openly licensed photograph could be confirmed.'}={}){
  const dom=doc||(typeof document!=='undefined'?document:null);
  if(!el||!dom)return;
  el.replaceChildren();
  if(!images.length){el.textContent=emptyText;return}
  for(const data of images){
   const figure=dom.createElement('figure');figure.className='commons-credited-photo';
   const img=dom.createElement('img');img.loading='lazy';img.decoding='async';img.alt='Wikimedia Commons search result: '+data.description;
   img.referrerPolicy='no-referrer';img.src=data.url;
   img.onerror=()=>{img.remove();figure.prepend(dom.createTextNode('Image could not load. '))};
   const caption=dom.createElement('figcaption');
   caption.append(dom.createTextNode((data.checked?'Location photograph — ':'Automatically selected Commons image — check depiction. ')+data.author+' · '));
   for(const [href,title] of [[data.filePage,'Original file'],[data.licenseUrl,data.license]]){
    const a=dom.createElement('a');a.href=href;a.textContent=title;a.target='_blank';a.rel='noopener noreferrer';
    caption.append(a,dom.createTextNode(' · '));
   }
   caption.append(dom.createTextNode('Display-sized copy, otherwise unchanged.'));
   figure.append(img,caption);el.append(figure);
  }
 }
 return Object.freeze({inspect,search,searchPage,approvedFor,verifyApproved,append});
});
