/* Public research list retired: guides now appear only in the main owned-location UI.
   The original 218 source articles stay on disk and remain available offline. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
const preview=fs.readFileSync(path.join(root,'world-library-preview.html'),'utf8');
const main=fs.readFileSync(path.join(root,'index.html'),'utf8');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const bridge=fs.readFileSync(path.join(root,'world-globe-article-bridge.js'),'utf8');
const archive=JSON.parse(fs.readFileSync(path.join(root,'editorial/country_gateway_release_index_20261023.json'),'utf8'));
const sea1=JSON.parse(fs.readFileSync(path.join(root,'editorial/sea_stories_batch1_9_20261023.json'),'utf8'));
const sea2=JSON.parse(fs.readFileSync(path.join(root,'editorial/sea_stories_batch2_8_20261023.json'),'utf8'));
const ocean=JSON.parse(fs.readFileSync(path.join(root,'editorial/ocean_stories_5_20261023.json'),'utf8'));
assert(preview.includes("window.location.replace('./index.html#shop')"),'Old research preview does not redirect to main shop');
assert(preview.includes('http-equiv="refresh"'),'Redirect needs a no-script fallback');
assert(!preview.includes('id="articlePanel"'),'Unlocked research still exposed through old public preview UI');
assert(!preview.includes('world-library-preview.js'),'Retired preview must not load the research browser');
assert(app.includes("window.location.hash==='#shop'"),'Main site must honour World shop direct links');
assert(main.includes('id="globeLocationInfo"'),'Location information container absent on main site');
assert(bridge.includes("target.classList.contains('hidden')"),'Long articles must require visible unlocked location info');
assert(bridge.includes("activeId()!==id"),'Long article cannot appear after user switches locations');
assert(archive.entries.length===196);
assert(sea1.records.length+sea2.records.length===17);
assert(ocean.records.length===5);
for(const e of archive.entries){
 assert(typeof e.sourceFile==='string'&&e.sourceFile.startsWith('editorial/'));
 const pack=JSON.parse(fs.readFileSync(path.join(root,e.sourceFile),'utf8'));
 assert(pack.records.some(x=>x.iso2===e.iso2),'Country article missing '+e.iso2);
}
console.log('PASS unlock-only world articles: old preview redirects to main shop, 196 country and 22 marine articles remain available via unlocked pin panels.');
