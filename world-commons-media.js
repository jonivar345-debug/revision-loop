/* Wikimedia Commons media viewer: checks current file-level licensing before showing an image.
   Automated search is NOT a human verification of what a photo depicts. No trackers or profile storage. */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.RevisionWorldCommonsMedia=Object.freeze(api);
})(typeof window==='object'?window:null,function(){
 'use strict';
 const ALLOWED=/^CC (?:BY(?:-SA)? (?:2\.0|3\.0|4\.0)|0 (?:1\.0))$/i;
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
 async function search(query,{fetcher,doc,limit=2}={}){
  const fetchFn=fetcher||(typeof fetch==='function'?fetch:null);
  const trimmed=String(query||'').trim().slice(0,150);
  if(!fetchFn||trimmed.length<3)return [];
  const u=new URL('https://commons.wikimedia.org/w/api.php');
  const params={action:'query',generator:'search',gsrnamespace:'6',gsrsearch:trimmed+' filetype:bitmap',gsrlimit:'12',prop:'imageinfo',
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
   caption.append(dom.createTextNode('Automatically selected Commons image — check depiction. '+data.author+' · '));
   for(const [href,title] of [[data.filePage,'Original file'],[data.licenseUrl,data.license]]){
    const a=dom.createElement('a');a.href=href;a.textContent=title;a.target='_blank';a.rel='noopener noreferrer';
    caption.append(a,dom.createTextNode(' · '));
   }
   caption.append(dom.createTextNode('Display-sized copy, otherwise unchanged.'));
   figure.append(img,caption);el.append(figure);
  }
 }
 return Object.freeze({inspect,search,append});
});
