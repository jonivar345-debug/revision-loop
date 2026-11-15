'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ui=require('../ui-refresh-v453.js');
const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('ui-refresh-v453.css','utf8');
const cloud=fs.readFileSync('cloud-sync.js','utf8');
const app=fs.readFileSync('app.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');
assert.equal(ui.normaliseTheme('light'),'light');
assert.equal(ui.normaliseTheme('dark'),'dark');
assert.equal(ui.normaliseTheme('surprise'),'light');
assert.equal(ui.getTheme({getItem:()=>{throw Error('denied')}}),'light');
const vals=new Map(),storage={getItem:key=>vals.get(key)||null,setItem:(key,value)=>vals.set(key,value)};
const attrs=new Map(),button={
 textContent:'',setAttribute:(k,v)=>attrs.set(k,v)
};
const meta={setAttribute:(k,v)=>attrs.set('meta-'+k,v)};
const doc={
 documentElement:{dataset:{}},
 getElementById:id=>id==='themeToggle'?button:null,
 querySelector:sel=>sel==='meta[name="theme-color"]'?meta:null
};
assert.equal(ui.applyTheme(doc,storage,'dark'),'dark');
assert.equal(doc.documentElement.dataset.theme,'dark');
assert.equal(ui.getTheme(storage),'dark');
assert.equal(button.textContent,'☀');
assert.equal(attrs.get('aria-label'),'Switch to light mode');
assert.equal(attrs.get('meta-content'),'#0b1223');
assert.equal(ui.applyTheme(doc,storage,'light'),'light');
assert.equal(attrs.get('meta-content'),'#f3f6fc');
assert.equal(button.textContent,'☾');
assert.equal(vals.size,1,'Theme uses only one local-only preference key');
const destinations=['mock','flashcards','exam','weaknesses','progress','shop'];
for(const place of destinations)assert(html.includes('data-jump="'+place+'"'),'Missing direct navigation '+place);
assert(html.includes('id="themeToggle"'));
assert(html.includes('id="cloudQuickAccess"')&&html.includes('id="cloudQuickDetails"'));
assert(html.includes('id="cloudManageToggle"')&&html.includes('aria-controls="cloudQuickDetails"'));
assert(html.includes('ui-refresh-v453.css?v=453')&&html.includes('ui-refresh-v453.js?v=453'));
assert(css.includes(':root[data-theme="dark"]'));
assert(css.includes('.tabs{')&&css.includes('position:sticky'));
assert(css.includes('.sync-quick-access[data-connected="true"]:not(.expanded) .cloud-quick-details{display:none}'));
assert(cloud.includes("const connected=!!user&&phase==='active'"));
assert(cloud.includes("quick.dataset.connected=String(connected)"));
assert(cloud.includes("if(!connected||!wasConnected)quick.classList.remove('expanded')"));
assert(cloud.includes("manage.hidden=!connected"));
assert(cloud.includes("Never invite an already connected private-key account"));
for(const id of ['cloudPrivateSignIn','cloudCreatePrivateKey','cloudGeneratePrivateKey','cloudCopyPrivateKey'])assert(cloud.includes(id));
assert(sw.includes("'./ui-refresh-v453.js'")&&sw.includes("'./ui-refresh-v453.css'"));
assert(sw.includes('v453-ui-navigation-theme'));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
assert(app.includes("document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>switchPanel(b.dataset.panel))"));
assert(app.includes("document.querySelectorAll('.study-type-btn').forEach(b=>b.onclick="));
console.log('PASS v453: local light/dark theme persistence, direct navigation, connected-only key collapse, offline assets and original progress keys intact');
