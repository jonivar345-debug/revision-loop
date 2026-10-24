/* All Commons photos in the world UI must have current file-level licence metadata. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const media=require('../world-commons-media.js');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const good={
 title:'File:Example landscape.jpg',
 imageinfo:[{thumburl:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Example.jpg/780px-Example.jpg',extmetadata:{
  LicenseShortName:{value:'CC BY-SA 4.0'},LicenseUrl:{value:'https://creativecommons.org/licenses/by-sa/4.0/'},
  Artist:{value:'A. Photographer'},ImageDescription:{value:'Landscape at the site'}
 }}]
};
const unknown={...good,title:'File:Unlicensed.jpg',imageinfo:[{...good.imageinfo[0],extmetadata:{...good.imageinfo[0].extmetadata,LicenseShortName:{value:'All rights reserved'}}}]};
const noArtist={...good,title:'File:Anonymous.jpg',imageinfo:[{...good.imageinfo[0],extmetadata:{...good.imageinfo[0].extmetadata,Artist:{value:''}}}]};
const fraud={...good,title:'File:Fake.jpg',imageinfo:[{...good.imageinfo[0],thumburl:'https://malicious.example.com/not-commons.jpg'}]};
const nonCC={...good,title:'File:Other.jpg',imageinfo:[{...good.imageinfo[0],extmetadata:{...good.imageinfo[0].extmetadata,LicenseUrl:{value:'https://untrusted.example.com/license'}}}]};
assert(media.inspect(good));
for(const p of [unknown,noArtist,fraud,nonCC])assert.equal(media.inspect(p),null,'Disallowed or unattributed photo displayed');
const checked=media.inspect(good);
assert.equal(checked.author,'A. Photographer');
assert.equal(checked.license,'CC BY-SA 4.0');
assert(checked.filePage.startsWith('https://commons.wikimedia.org/wiki/File:'));
assert.equal(checked.licenseUrl,'https://creativecommons.org/licenses/by-sa/4.0/');

for(const [city,landmark] of [['london','Tower Bridge'],['busan','Seomyeon'],['tbilisi','Tbilisi'],['capetown','Table Mountain'],['nairobi','Nairobi'],['newyork','New York'],['cusco','Cusco'],['sydney','Sydney'],['tokyo','Tokyo'],['reykjavik','Reykjavik']]){
 const photo=media.approvedFor(city);
 assert(photo?.checked===true,'Missing manually reviewed city photograph '+city);
 assert(photo.description.includes(landmark),'Incorrect reviewed landmark '+city);
 assert(photo.url.startsWith('https://commons.wikimedia.org/wiki/Special:FilePath/'));
 assert(photo.filePage.startsWith('https://commons.wikimedia.org/wiki/File:'));
 assert(photo.licenseUrl.startsWith('https://creativecommons.org/licenses/by-sa/'));
 assert(photo.author.length>3,'Missing artist for reviewed photo '+city);
}
assert.equal(media.approvedFor('not_an_actual_city'),null);

let requests=0,asked='';
const fetcher=async url=>{requests++;asked=url;return {ok:true,json:async()=>({query:{pages:[good,unknown,noArtist]}})}};
class E {
 constructor(tag){this.tagName=tag;this.textContent='';this.children=[];this.listeners={};this.className='';this.src='';this.alt=''}
 append(...items){this.children.push(...items)}
 prepend(...items){this.children.unshift(...items)}
 remove(){}
 replaceChildren(...items){this.children=[...items]}
}
const dom={createElement:t=>new E(t),createTextNode:t=>({tagName:'text',textContent:t})};
(async()=>{
 const results=await media.search('Example landscape',{fetcher,doc:dom,limit:2});
 assert.equal(results.length,1,'Unlicensed image should be filtered out');
 assert(asked.includes('extmetadata')&&asked.includes('origin='),'Commons API request missing licence metadata or CORS');
 assert.equal(requests,1);
 const host=new E('div');media.append(host,results,{doc:dom});
 const figure=host.children[0],caption=figure.children.find(x=>x.tagName==='figcaption');
 assert.equal(figure.children.filter(x=>x.tagName==='img').length,1);
 assert(caption.children.some(x=>x.tagName==='a'&&x.textContent==='Original file'));
 assert(caption.children.some(x=>x.tagName==='a'&&x.textContent==='CC BY-SA 4.0'));
 assert(caption.children.some(x=>x.tagName==='text'&&x.textContent.includes('A. Photographer')));
 const pageRequests=[];
 const exactFetcher=async url=>{
  pageRequests.push(String(url));
  const host=new URL(url).hostname;
  if(host==='en.wikipedia.org')return {ok:true,json:async()=>({query:{pages:[{title:'Busan',pageimage:'Example landscape.jpg'}]}})};
  if(host==='commons.wikimedia.org')return {ok:true,json:async()=>({query:{pages:[good]}})};
  throw Error('Unexpected image host');
 };
 const exact=await media.searchPage('Busan',{fetcher:exactFetcher,doc:dom});
 assert.equal(exact.length,1,'Busan page image was not verified');
 assert.equal(pageRequests.length,2,'Wikipedia page and Commons rights must both be queried');
 const londonHint=media.approvedFor('london');
 const acceptedPhoto={...good,title:'File:'+londonHint.file};
 const trusted=await media.verifyApproved('london',{fetcher:async()=>({ok:true,json:async()=>({query:{pages:[acceptedPhoto]}})}),doc:dom});
 assert(trusted?.checked===true,'Curated file not independently rechecked');
 assert.equal(trusted.author,'A. Photographer','Current Commons artist must override stale hard-coded credits');
 assert.equal(trusted.file,'File:'+londonHint.file);
 const wrongPhoto=await media.verifyApproved('london',{fetcher:async()=>({ok:true,json:async()=>({query:{pages:[good]}})}),doc:dom});
 assert.equal(wrongPhoto,null,'Different Commons file must never be substituted as a curated landmark');
 const unlicensed=await media.verifyApproved('london',{fetcher:async()=>({ok:true,json:async()=>({query:{pages:[{...unknown,title:'File:'+londonHint.file}]}})}}),doc:dom});
 assert.equal(unlicensed,null,'Stored curated image must still satisfy live Commons CC licence');
 assert.equal(media.inspect({...good,title:'File:London locator map.png'},dom),null,'Maps must not be used as purported photos');

 assert(pageRequests[0].includes('titles=Busan'));
 assert(pageRequests[1].includes('File%3AExample'));
 assert(!app.includes("images.search(l.name+' landscape'"),'Incorrect loosely matched second image still queried');
  const empty=new E('div');media.append(empty,[],{doc:dom});
 assert(empty.textContent.includes('No openly licensed photograph'));
 assert(!app.includes("gsrsearch='+encodeURIComponent(q)+'&gsrlimit=15"),'Old uncredited gallery search still present');
 assert(!app.includes("if(url){wikiPhotoCache[location.id]=url;placeImage"),'Old uncredited image path still active');
 assert(html.indexOf('world-commons-media.js?v=69')>=0&&html.indexOf('world-commons-media.js?v=69')<html.indexOf('app.js?v=70'),'Media validator must load before the app');
 assert(sw.includes("'./world-commons-media.js'"),'Photo validator not cached offline');
 for(const marker of ['locationPhoto(location,el)','images.searchPage(location.wiki)','images.append(el,matches)','locationImageFallback(el,location)'])assert(app.includes(marker),'Actual app lacks Commons attribution use: '+marker);
 console.log('PASS world gallery CC validation: no unlicensed/unknown-author/third-party image; photographer, licence and source rendered; real app and offline shell wired.');
})().catch(e=>{console.error(e);process.exitCode=1});
