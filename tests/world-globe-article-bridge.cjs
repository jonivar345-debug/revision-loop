/* Unlocked locations get a single page; only new country and marine pins attach a long article. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const script=fs.readFileSync(path.join(root,'world-globe-article-bridge.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const baseline=JSON.parse(fs.readFileSync(path.join(root,'editorial/shop_historical_identity_baseline_20261023.json'),'utf8'));
new vm.Script(script);
assert(html.includes('world-globe-article-bridge.js?v=73'));
assert(sw.includes("'./world-globe-article-bridge.js'"));
for(const unwanted of ['localStorage','sessionStorage','indexedDB','World Library','Research sources','Open the World Library','Go deeper: country story'])
 assert(!script.includes(unwanted),'Unwanted duplicate research panel or profile access: '+unwanted);
class E{
 constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.className='';this.isConnected=true;this.textContent='';this.classList={contains:()=>false}}
 append(...items){for(const item of items){if(item?.tagName==='fragment')this.children.push(...item.children);else this.children.push(item)}}
 replaceChildren(...items){this.children=[];this.append(...items)}
 remove(){this.isConnected=false}
 querySelector(selector){if(selector==='[data-world-long-story]')return this.children.find(x=>x.dataset.worldLongStory)||null;return null}
}
class MutationObserver{constructor(cb){this.cb=cb}observe(){}}
const requests=[];
const fetch=async input=>{
 const filename=String(input).replace(/^\.\//,'');
 assert(/^editorial\/[\w]+\.json$/.test(filename),'Unsafe article path '+filename);
 requests.push(filename);
 const data=JSON.parse(fs.readFileSync(path.join(root,filename),'utf8'));
 return {ok:true,json:async()=>data};
};
const open=(id)=>{
 const host=new E('section');
 const doc={getElementById:n=>n==='globeLocationInfo'?host:null,createElement:t=>new E(t),createDocumentFragment:()=>new E('fragment')};
 const window={};
 vm.runInNewContext(script,{document:doc,window,MutationObserver,fetch,openLocationId:id},{timeout:2000});
 return {host,window};
};
const london=open('london');
assert.equal(london.host.children.length,1,'Owned London should have one local long guide under its main panel');
assert.equal(london.window.RevisionWorldArticleBridge.historicalLocationCount,161);
assert.equal(london.window.RevisionWorldArticleBridge.locationCount,379);
for(const id of baseline.locations)assert(london.window.RevisionWorldArticleBridge.countryForLocation(id),'Lost location country mapping '+id);
(async()=>{
 for(let i=0;i<100&&!london.host.children[0]?.children.some(x=>x.className==='location-background');i++)await new Promise(resolve=>setTimeout(resolve,5));
 assert.equal(london.host.children[0].children.length,4,'London should have four place-specific long sections');
 const londonText=london.host.children[0].children.flatMap(x=>x.children.map(y=>y.textContent)).join(' ');
 assert(londonText.includes('Thames')&&londonText.includes('Westminster'),'London history missing');
 assert(!londonText.includes('Jodrell'),'Unrelated country article displayed beneath London');
 const busan=open('busan');
 for(let i=0;i<100&&!busan.host.children[0]?.children.some(x=>x.className==='location-background');i++)await new Promise(resolve=>setTimeout(resolve,5));
 assert.equal(busan.host.children[0].children.length,4,'Busan should have four place-specific long sections');
 assert(busan.host.children[0].children.some(x=>x.children.some(y=>y.textContent.includes('Gwangalli'))),'Busan long guide does not cover local waterfront');
 const country=open('country-gb');
 for(let i=0;i<100&&!country.host.children[0]?.children.some(x=>x.className==='location-background');i++)await new Promise(resolve=>setTimeout(resolve,5));
 assert.equal(country.host.children.length,1,'Country should have one article block');
 const sections=country.host.children[0].children;
 assert.equal(sections.length,4,'Country article should have four researched sections');
 assert(sections.every(x=>x.className==='location-background'),'Article sections not integrated into destination panel');
 assert(sections.every(x=>x.children[0]?.tagName==='h4'&&x.children[1]?.tagName==='p'));
 const sea=open('sea-mediterranean');
 for(let i=0;i<100&&!sea.host.children[0]?.children.some(x=>x.className==='location-background');i++)await new Promise(resolve=>setTimeout(resolve,5));
 assert.equal(sea.host.children[0].children.length,4,'Marine pin should load four detailed sections');
 assert(requests.includes('editorial/country_gateway_release_index_20261023.json'));
 assert(requests.includes('editorial/sea_stories_batch1_9_20261023.json'));
 assert.equal(requests.filter(x=>x.includes('full_country_stories_')).length,1,'Cities must not fetch unrelated country articles');
 console.log('PASS unified location pages: no London duplication, four sections for unlocked country and sea pins, no research links or profile access.');
})().catch(e=>{console.error(e);process.exitCode=1});
