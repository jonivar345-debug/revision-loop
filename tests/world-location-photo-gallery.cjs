/* Destination gallery: exact place matches, four images, hidden-at-rest legal credits. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const gallery=require('../world-location-photo-gallery.js');
const source=fs.readFileSync(path.join(root,'app.js'),'utf8');
const bridge=fs.readFileSync(path.join(root,'world-globe-article-bridge.js'),'utf8');
const style=fs.readFileSync(path.join(root,'styles.css'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const mediaFile=(name)=>({file:'File:'+name,url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a.jpg',filePage:'https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(name),author:'Named photographer',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/'});
const busan={id:'busan',name:'Busan',wiki:'Busan'};
const curated=require('../world-curated-photos.js');
for(const id of ['london','busan']){
 const list=curated.get(id);
 assert.equal(list.length,4,'Four fully sourced curated photographs required for '+id);
 for(const photo of list){
  assert(photo.url.includes('width=2048'),'Curated image is too small to be a sharp gallery source');
  assert(photo.filePage.startsWith('https://commons.wikimedia.org/wiki/File:'));
  assert(photo.licenseUrl.startsWith('https://creativecommons.org/licenses/'));
 }
}

const wanted=[
 mediaFile('Busan skyline.jpg'),mediaFile('Busan Gwangalli Bridge.jpg'),
 mediaFile('Haeundae Beach Busan.jpg'),mediaFile('Gamcheon Culture Village.jpg'),mediaFile('Busan Jagalchi Market.jpg')
];
const unwanted=[mediaFile('Seoul fireworks.jpg'),mediaFile('Korean restaurant.jpg'),mediaFile('Busan locator map.jpg'),mediaFile('Busan photo collage.jpg')];
const api={
 verifyApproved:async()=>mediaFile('Seomyeon Skyline.jpg'),
 searchPage:async()=>[wanted[0]],
 search:async()=>[...unwanted,...wanted.slice(1)]
};
class E{
 constructor(tag,doc){this.tagName=tag;this.ownerDocument=doc;this.children=[];this.dataset={};this.textContent='';this.className='';this.isConnected=true;this.classList={add:v=>{this.className+=' '+v},remove:()=>{}};this.src='';}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=[...nodes]}
 remove(){}
 setAttribute(key,value){this[key]=value}
 querySelector(tag){return this.children.find(x=>x.tagName===tag)||null}
}
const doc={createElement:tag=>new E(tag,doc),createTextNode:text=>({tagName:'text',textContent:String(text)})};
(async()=>{
 const chosen=await gallery.photosFor(busan,{media:api,limit:4});
 assert.equal(chosen.length,4,'Need four place-specific pictures');
 assert(chosen.every(x=>!x.file.includes('Seoul')&&!x.file.includes('Seomyeon')&&!x.file.includes('collage')&&!x.file.includes('map')));
 const host=new E('div',doc);
 await gallery.render(host,busan,{media:api});
 const tiles=host.children.find(x=>x.className.startsWith('destination-photo-grid'));
 assert.equal(tiles.children.length,4,'Four photographs should appear together');
 const credits=host.children.find(x=>x.className==='destination-photo-credits');
 assert.equal(credits.tagName,'details','Credits should be available, not displayed over pictures');
 assert.equal(credits.children[1].children.length,4);
 for(const entry of credits.children[1].children)assert(entry.children.filter(x=>x.tagName==='a').length===2,'Must retain original and licence URLs');
 const card=new E('div',doc);
 await gallery.render(card,busan,{card:true,media:api});
 assert.equal(card.children.find(x=>x.className.startsWith('destination-photo-grid')).children.length,1);
 assert(card.children.some(x=>x.className.includes('card-photo-credit')),'Shop photographs must retain accessible CC attribution without a large caption');
 assert(!source.slice(source.indexOf('async function setLocationInfo(id){'),source.indexOf('function renderShop(){')).includes('Research sources'));
 assert(!source.slice(source.indexOf('async function setLocationInfo(id){'),source.indexOf('function renderShop(){')).includes('Wikimedia Commons</a>'));
 assert(!bridge.includes('Open the World Library'));
 assert(!bridge.includes('Go deeper'));
 assert(!source.includes("locationImageFallback(el,location);"),'Location photo must not fall back to map thumbnails');
 assert(style.includes('.destination-photo-gallery .destination-photo-grid'));
 assert(html.includes('world-location-photo-gallery.js?v=101'));
 assert(html.includes('world-local-photos.js?v=108'),'Local photo library script not loaded');
 console.log('PASS location galleries: four valid Busan photos, matching rejects unrelated imagery, credits are collapsible, shop cards are photo-only.');
})().catch(e=>{console.error(e);process.exitCode=1});
