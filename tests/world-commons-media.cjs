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
 const empty=new E('div');media.append(empty,[],{doc:dom});
 assert(empty.textContent.includes('No openly licensed photograph'));
 assert(!app.includes("gsrsearch='+encodeURIComponent(q)+'&gsrlimit=15"),'Old uncredited gallery search still present');
 assert(!app.includes("if(url){wikiPhotoCache[location.id]=url;placeImage"),'Old uncredited image path still active');
 assert(html.indexOf('world-commons-media.js?v=64')>=0&&html.indexOf('world-commons-media.js?v=64')<html.indexOf('app.js?v=65'),'Media validation must load before app');
 assert(sw.includes("'./world-commons-media.js'"),'Photo validator not cached offline');
 for(const marker of ['locationPhoto(location,el)','images.search(query,{limit:1})','images.append(el,results)','images.search(l.name+\' landscape\',{limit:2})'])assert(app.includes(marker),'Actual app lacks Commons attribution use: '+marker);
 console.log('PASS world gallery CC validation: no unlicensed/unknown-author/third-party image; photographer, licence and source rendered; real app and offline shell wired.');
})().catch(e=>{console.error(e);process.exitCode=1});
