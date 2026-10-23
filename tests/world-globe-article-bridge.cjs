/* Exercise the real globe-to-country bridge without user storage or checkout. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const script=fs.readFileSync(path.join(root,'world-globe-article-bridge.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const baseline=JSON.parse(fs.readFileSync(path.join(root,'editorial/shop_historical_identity_baseline_20261023.json'),'utf8'));
new vm.Script(script);
assert(html.includes('<script src="world-globe-article-bridge.js?v=62" defer></script>'),'Bridge not loaded by live globe');
assert(sw.includes("'./world-globe-article-bridge.js'"),'Bridge not cached by service worker');
for(const secret of ['localStorage','sessionStorage','indexedDB','shopOwned','profile.points','profile.lifetimeXp','buy('])
 assert(!script.includes(secret),'Bridge should not access shopping or persistent data: '+secret);
class E {
 constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.attrs={};this.textContent='';this.isConnected=true;this.disabled=false;this.listeners={};this.className='';this.classList={contains:()=>false}}
 append(...items){for(const item of items){if(item.tagName==='fragment')this.children.push(...item.children);else this.children.push(item)}}
 prepend(...items){this.children.unshift(...items)}
 replaceChildren(...items){this.children=[];this.append(...items)}
 setAttribute(k,v){this.attrs[k]=v}
 addEventListener(k,fn){this.listeners[k]=fn}
 querySelector(q){
   if(q==='.globe-info-top')return new E('div');
   if(q==='.globe-info-top h3'){const h=new E('h3');h.textContent='Tbilisi';return h;}
   if(q==='[data-world-article-bridge]')return this.children.find(x=>x.dataset.worldArticleBridge)||null;
   return null;
 }
}
const info=new E('section'),shop=new E('div');
let intro=null;
shop.parentNode={insertBefore:(e)=>{intro=e}};
const document={
 getElementById:id=>id==='globeLocationInfo'?info:id==='locationShop'?shop:null,
 createElement:tag=>new E(tag),
 createDocumentFragment:()=>new E('fragment')
};
let fetches=[];
const fetch=async url=>{
  const relative=String(url).replace(/^\.\//,'');
  assert(/^editorial\/[a-z0-9_]+\.json$/.test(relative),'Unsafe source request: '+relative);
  fetches.push(relative);
  return {ok:true,json:async()=>JSON.parse(fs.readFileSync(path.join(root,relative),'utf8'))};
};
class MutationObserver{constructor(callback){this.callback=callback} observe(){}}
const window={};
const context={document,window,MutationObserver,fetch,openLocationId:'tbilisi',URL};
vm.runInNewContext(script,context,{timeout:2500});
assert(intro?.children?.[0].href.endsWith('world-library-preview.html'),'All-article navigation missing');
assert.equal(window.RevisionWorldArticleBridge.historicalLocationCount,161);
assert.equal(window.RevisionWorldArticleBridge.locationCount,379);
assert.equal(window.RevisionWorldArticleBridge.countryForLocation('country-fr'),'FR');
assert.equal(window.RevisionWorldArticleBridge.countryForLocation('country-xk'),'XK');
for(const id of baseline.locations){assert(window.RevisionWorldArticleBridge.countryForLocation(id),'Missing geographic mapping '+id)}
assert.equal(window.RevisionWorldArticleBridge.countryForLocation('capetown'),'ZA');
assert.equal(window.RevisionWorldArticleBridge.countryForLocation('cape_town'),'ZA');
assert.equal(window.RevisionWorldArticleBridge.countryForLocation('addis'),'ET');
assert.equal(window.RevisionWorldArticleBridge.countryForLocation('addis_ababa'),'ET');
assert.equal(window.RevisionWorldArticleBridge.countryForLocation('victoriafalls'),'ZW');
assert.equal(window.RevisionWorldArticleBridge.countryForLocation('victoria_falls'),'ZW');
assert.equal(info.children.length,1,'Unlocked location should expose exactly one country guide');
const guide=info.children[0];
assert.equal(guide.dataset.locationId,'tbilisi');
const button=guide.children.find(x=>x.tagName==='button');
assert(button&&button.textContent==='Read country story here','Country guide activation missing');
button.listeners.click();
const content=guide.children[guide.children.length-1];
(async()=>{
 for(let i=0;i<100;i++){
  if(content.children.some(x=>x.tagName==='h5'))break;
  await new Promise(ok=>setTimeout(ok,10));
 }
 assert(content.children.some(x=>x.tagName==='h4'&&x.textContent==='Georgia'),'Georgia story was not loaded');
 assert(content.children.some(x=>x.tagName==='h5'),'No article sections loaded');
 assert(fetches.includes('editorial/country_gateway_release_index_20261023.json'));
 assert(fetches.includes('editorial/full_country_stories_batch10_12_20261023.json'));
 assert.equal(button.disabled,true,'Button must not double-load');
 // A newly purchasable sea pin must expose its actual research article.
 const marineInfo=new E('section'),marineShop=new E('div');
 marineShop.parentNode={insertBefore:()=>{}};
 const marineDoc={
   getElementById:id=>id==='globeLocationInfo'?marineInfo:id==='locationShop'?marineShop:null,
   createElement:tag=>new E(tag),
   createDocumentFragment:()=>new E('fragment')
 };
 const marineWindow={};
 vm.runInNewContext(script,{document:marineDoc,window:marineWindow,MutationObserver,fetch,openLocationId:'sea-mediterranean',URL},{timeout:2500});
 assert.equal(marineInfo.children.length,1,'Marine globe pin did not receive a story panel');
 const marineButton=marineInfo.children[0].children.find(x=>x.tagName==='button');
 assert(marineButton&&marineButton.textContent.includes('sea or ocean'),'Wrong marine reader label');
 marineButton.listeners.click();
 const marineArticle=marineInfo.children[0].children.at(-1);
 for(let i=0;i<100&&!marineArticle.children.some(x=>x.tagName==='h4'&&x.textContent==='Mediterranean Sea');i++)
   await new Promise(ok=>setTimeout(ok,10));
 assert(marineArticle.children.some(x=>x.tagName==='h4'&&x.textContent==='Mediterranean Sea'),'Mediterranean article missing from new pin');
 assert(fetches.includes('editorial/sea_stories_batch1_9_20261023.json'));
 console.log('PASS world globe: 161 historical locations plus 218 new map features; country and marine pin research open correctly.');

})().catch(e=>{console.error(e);process.exitCode=1});
