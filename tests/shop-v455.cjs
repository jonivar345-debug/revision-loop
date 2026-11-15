'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ui=require('../ui-refresh-v453.js');
const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('shop-refresh-v455.css','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const app=fs.readFileSync('app.js','utf8');
const cloud=fs.readFileSync('cloud-sync.js','utf8');

assert(html.includes('<button class="tab" data-panel="shop">Shop</button>'));
assert(!html.includes('<button class="tab" data-panel="shop">World</button>'));
assert.equal((html.match(/<nav class="tabs">/g)||[]).length,1);
assert.equal((html.match(/class="shop-category/g)||[]).length,4,'Three shop categories and one navigation container');
assert.equal((html.match(/class="quick-nav"/g)||[]).length,0,'No duplicated navigation');
for(const view of ['characters','outfits','places'])
 assert(html.includes('data-shop-view="'+view+'"'),'Missing Shop view '+view);
for(const id of ['characterPreview','shopPoints','characterCount','outfitCount','locationCount','characterShop','outfitShop','globe','locationShop','cloudQuickAccess'])
 assert(html.includes('id="'+id+'"'),'Do not remove core shop or cloud ID: '+id);
for(const id of ['shopCharactersSection','shopOutfitsSection','shopLocationsSection'])
 assert(html.includes('id="'+id+'"'));
assert(html.includes('id="shopViewOutfits"'));
assert(html.includes('shop-refresh-v455.css?v=455'));
assert(html.includes('ui-refresh-v453.js?v=455'));
assert(css.includes('.shop-section[hidden]{display:none!important}'));
assert(css.includes(':root[data-theme="dark"]'));
assert(css.includes('@media(max-width:610px)'));
assert(sw.includes("'./shop-refresh-v455.css'"));
assert(sw.includes('v455-shop-categories'));
assert(app.includes("function renderShop()"));
assert(app.includes("function buy("));
assert(app.includes("document.getElementById('characterSeries').onchange"));
assert(cloud.includes('createPrivateAccount()'));
assert(ui.normaliseShopView('outfits')==='outfits');
assert(ui.normaliseShopView('places')==='places');
assert(ui.normaliseShopView('bad')==='characters');
assert(ui.getShopView({getItem:()=>{throw Error('storage blocked')}})==='characters');

const map=new Map(),storage={getItem:key=>map.get(key)||null,setItem:(key,v)=>map.set(key,v)};
const views=['characters','outfits','places'],ids=['shopCharactersSection','shopOutfitsSection','shopLocationsSection'];
const sections=Object.fromEntries(ids.map(id=>[id,{hidden:false}]));
const buttons=views.map(shopView=>{
 const attrs={},classes=new Set();
 return {
  dataset:{shopView},
  attrs,classes,
  classList:{toggle:(name,on)=>on?classes.add(name):classes.delete(name)},
  setAttribute:(name,value)=>{attrs[name]=value}
 };
});
const doc={getElementById:id=>sections[id],querySelectorAll:q=>q==='[data-shop-view]'?buttons:[]};
assert.equal(ui.applyShopView(doc,storage,'places'),'places');
assert.equal(sections.shopLocationsSection.hidden,false);
assert.equal(sections.shopCharactersSection.hidden,true);
assert.equal(sections.shopOutfitsSection.hidden,true);
assert.equal(buttons[2].attrs['aria-pressed'],'true');
assert.equal(buttons[0].attrs['aria-pressed'],'false');
assert.equal(ui.getShopView(storage),'places');
ui.applyShopView(doc,storage,'outfits');
assert.equal(sections.shopOutfitsSection.hidden,false);
assert.equal(buttons[1].classes.has('active'),true);
assert.equal(map.size,1,'Only a device-local view preference is written');
console.log('PASS v455: Shop naming, 3 exclusive collection views, dark/mobile styling, preserved cloud/collectable IDs and preference persistence');
