/* Standalone editorial preview smoke test. No browser profile or real purchases touched. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'world-library-preview.html'),'utf8');
const script=fs.readFileSync(path.join(root,'world-library-preview.js'),'utf8');
new vm.Script(script,{filename:'world-library-preview.js'});
assert(html.includes('<script src="world-library-preview.js" defer></script>'));
for(const id of ['worldSearch','worldType','worldCount','entryList','articlePanel'])assert(html.includes('id="'+id+'"'));
for(const token of ['localStorage','sessionStorage','indexedDB','document.cookie','app.js','PIN']) {
  if(token==='PIN')continue;
  assert(!script.includes(token),'Preview is not allowed to access profile systems: '+token);
}
class Element {
  constructor(tag,id){this.tagName=tag;this.id=id||null;this.children=[];this.listeners={};this.dataset={};this.attrs={};this.value='';this.textContent='';this.className='';this.type='';this.style={};}
  append(...elements){for(const e of elements){if(e.tagName==='fragment')this.children.push(...e.children);else this.children.push(e)}}
  appendChild(e){this.append(e);return e}
  replaceChildren(...elements){this.children=[];this.append(...elements)}
  setAttribute(name,value){this.attrs[name]=value}
  addEventListener(name,cb){this.listeners[name]=cb}
  focus(){}
}
const el={};for(const id of ['worldSearch','worldType','worldCount','entryList','articlePanel'])el[id]=new Element('div',id);
el.worldType.value='all';
const document={
  getElementById:id=>el[id]||null,
  createElement:tag=>new Element(tag),
  createDocumentFragment:()=>new Element('fragment')
};
const fetched=[];
const fakeFetch=async(input)=>{
  assert(/^editorial\/[a-z0-9_]+\.json$/.test(input),'Unexpected fetch '+input);
  fetched.push(input);
  return {ok:true,json:async()=>JSON.parse(fs.readFileSync(path.join(root,input),'utf8'))};
};
const context={document,URL,fetch:fakeFetch,console};
vm.runInNewContext(script,context,{timeout:2000});
const poll=async (fn)=>{
  for(let i=0;i<100;i++){if(fn())return;await new Promise(resolve=>setTimeout(resolve,10));}
  throw Error('Preview did not reach expected state');
};
(async()=>{
  await poll(()=>el.worldCount.textContent==='218 of 218 articles');
  assert.equal(el.entryList.children.length,218);
  const all=el.entryList.children.map(li=>li.children[0]);
  assert(all.every(x=>x.attrs['aria-current']==='true'||x.attrs['aria-current']==='false'));
  await poll(()=>el.articlePanel.children.map(x=>x.textContent).join(' ').length>350);
  const firstArticle=el.articlePanel.children.map(x=>x.textContent).join(' ');
  assert(firstArticle.length>350,'First article was not rendered');
  el.worldSearch.value='Georgia';el.worldSearch.listeners.input();
  assert.equal(el.entryList.children.length,1);
  const button=el.entryList.children[0].children[0];
  button.listeners.click();
  await poll(()=>el.articlePanel.children.some(x=>x.textContent==='Upper Svaneti'));
  assert(el.articlePanel.children.some(x=>x.tagName==='details'),'Source details not rendered');
  el.worldSearch.value='Albania';el.worldSearch.listeners.input();
  assert.equal(el.entryList.children.length,1);
  el.entryList.children[0].children[0].listeners.click();
  await poll(()=>el.articlePanel.children.some(x=>x.tagName==='details'&&x.children[0]?.textContent?.includes('Checked image references')));
  const photoDetails=el.articlePanel.children.find(x=>x.tagName==='details'&&x.children[0]?.textContent?.includes('Checked image references'));
  assert.equal(photoDetails.children.find(x=>x.tagName==='ul').children.length,2,'Albania verified source-photo count');
  el.worldSearch.value='Bhutan';el.worldSearch.listeners.input();
  assert.equal(el.entryList.children.length,1);
  el.entryList.children[0].children[0].listeners.click();
  await poll(()=>el.articlePanel.children.some(x=>x.textContent==='Dzongs: religious and civic fortresses'));
  const rendered=el.articlePanel.children.flatMap(x=>[x.textContent,...x.children.map(y=>y.textContent)]).join(' ');
  assert(rendered.includes('UNESCO Tentative List (not inscribed)'),'Tentative status not labelled in article');
  el.worldSearch.value='';
  el.worldType.value='sea';el.worldType.listeners.change();
  assert.equal(el.entryList.children.length,17);
  el.worldType.value='ocean';el.worldType.listeners.change();
  assert.equal(el.entryList.children.length,5);
  el.worldType.value='country';el.worldType.listeners.change();
  assert.equal(el.entryList.children.length,196);
  assert(fetched.includes('editorial/country_gateway_release_index_20261023.json'));
  assert(fetched.includes('editorial/full_country_stories_batch10_12_20261023.json'));
  console.log('PASS read-only explorer: 196 countries, 17 seas, 5 oceans, search, article opening, HTTPS source links and no profile access');
})().catch(error=>{console.error(error);process.exitCode=1});
