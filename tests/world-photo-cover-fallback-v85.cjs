/* v85: cheap Commons shop covers, verified same-place fallback, live credits. */
'use strict';
const assert=require('node:assert/strict');
const src=require('../world-photo-discovery-data.js');
global.window={RevisionWorldDiscoveryPhotos:src};
const gallery=require('../world-location-photo-gallery.js');
const catalog=require('../world-curated-photos.js');
class E{
 constructor(tagName,doc){this.tagName=tagName;this.ownerDocument=doc;this.children=[];this.dataset={};this.isConnected=true;this.textContent='';this.className='';this.src='';this.alt='';this.classList={add:s=>this.className+=' '+s,remove:()=>{}};}
 append(...s){this.children.push(...s)}
 replaceChildren(...s){this.children=s}
 remove(){this.isConnected=false}
 setAttribute(name,value){this[name]=value}
 querySelector(tag){return this.children.find(x=>x.tagName===tag)||null}
 querySelectorAll(tag){return this.children.filter(x=>x.tagName===tag)}
}
const doc={createElement:tag=>new E(tag,doc),createTextNode:text=>({tagName:'text',textContent:String(text)})};
const loc={id:'busan',name:'Busan',wiki:'Busan'};
(async()=>{
 const full=catalog.get('busan');assert.equal(full.length,4);
 const fakeMedia={verifyNamedFiles:async()=>[],searchPage:async()=>[],search:async()=>[],searchNearby:async()=>[],searchArticleImages:async()=>[],verifyApproved:async()=>null};
 const host=new E('div',doc);
 await gallery.render(host,loc,{card:true,media:fakeMedia});
 const grid=host.children.find(x=>x.className.includes('destination-photo-grid'));
 const figure=grid.children[0],img=figure.children[0];
 const detail=host.children.find(x=>x.className.includes('destination-photo-credits'));
 const lis=detail.children.find(x=>x.tagName==='ul');
 const first=full[0],next=full[1];
 assert(img.src.includes('width=960'),'Shop cover must load a real smaller Commons derivative');
 assert(img.alt.includes('Haeundae'),'First cover must be the featured gallery lead');
 assert(lis.children[0].children[0].textContent.includes(first.author),'Cover photo credits not displayed');
 await img.onerror();
 assert.equal(img.src,first.url,'Failed small derivative must retry source-verified 2048px gallery thumbnail');
 await img.onerror();
 assert.equal(img.src,first.originalUrl,'Failed thumbnail must try current full source');
 await img.onerror();
 assert(img.src.includes(encodeURIComponent(next.file.replace(/^File:/,'').replace(/ /g,'_'))),'Failed main cover must select a different, already trusted same-place source');
 assert(img.src.includes('width=960'),'Alternative cover should stay download-light');
 assert(img.alt.includes('Gwangalli'),'Alternative must update meaningful image description');
 assert(lis.children[0].children[0].textContent.includes(next.author),'Credits must follow actual rendered alternative');
 const open=new E('div',doc);
 await gallery.render(open,loc,{media:fakeMedia});
 const loaded=open.children.find(x=>x.className.includes('destination-photo-grid'));
 assert.equal(loaded.children.length,4);
 assert(loaded.children[0].children[0].src.includes('width=2048'),'Unlocked gallery keeps full-resolution Commons derivative');
 const motel={...full[0],file:'File:Example destination hotel room.jpg',description:'Generic indoor hotel room',source:'editorial-source'};
 const skyline={...full[1],file:'File:Example destination scenic skyline panorama.jpg',description:'Scenic skyline panorama of Example Destination',source:'editorial-source'};
 global.window.RevisionWorldCuratedPhotos={get:id=>id==='scenic-v85'?[motel,skyline]:catalog.get(id)};
 const echo={...fakeMedia,verifyNamedFiles:async sources=>sources};
 const ranked=await gallery.photosFor({id:'scenic-v85',name:'Example Destination',wiki:'Example Destination'},{limit:1,media:echo});
 assert(ranked[0]?.file.includes('scenic skyline'),'A recognisable city skyline should be chosen before generic interior cover source');
 global.window.RevisionWorldCuratedPhotos=catalog;
 let attempts=0;
 global.window.RevisionWorldCommonsMedia={
  verifyNamedFiles:async()=>[],searchPage:async()=>{attempts++;return []},
  searchArticleImages:async()=>[],searchNearby:async()=>[],search:async()=>[],verifyApproved:async()=>null
 };
 const missing={id:'not-a-real-world-destination-v85',name:'Unknown Destination',wiki:'Unknown Destination'};
 await gallery.photosFor(missing);
 await gallery.photosFor(missing);
 assert(attempts>=2,'A transient Commons failure may not permanently cache a blank cover');
 console.log('PASS v85 covers: 960px Commons source derivative, 2048px gallery, real failed-cover alternate and matching photographer/licence credits');
})().catch(e=>{console.error(e);process.exitCode=1});
