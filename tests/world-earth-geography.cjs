/* Geographic integrity of the offline 110m coastline layer and marker handling. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const geo=JSON.parse(fs.readFileSync(path.join(root,'data/natural-earth-coastlines-110m.json'),'utf8'));
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const style=fs.readFileSync(path.join(root,'styles.css'),'utf8');
const renderer=fs.readFileSync(path.join(root,'world-earth-renderer.js'),'utf8');
const globe=fs.readFileSync(path.join(root,'world-geographic-destinations.js'),'utf8');
const registry={window:{}};
vm.runInNewContext(renderer,registry);
assert(geo.rings.length>280&&geo.rings.length<350,'Natural Earth polygons unexpectedly changed');
assert(geo.rings.reduce((n,ring)=>n+ring.length,0)>10000,'Coastline detail missing');
for(const ring of geo.rings)for(const [lon,lat] of ring){
 assert(Number.isFinite(lon)&&Math.abs(lon)<=180);
 assert(Number.isFinite(lat)&&Math.abs(lat)<=90);
}
const unwrap=registry.window.RevisionWorldEarth.unwrapped;
const crossings=unwrap([[179.7,12],[-179.8,12.2],[-179.4,12.5]]);
assert(Math.abs(crossings[1][0]-crossings[0][0])<2,'Dateline bridge crosses entire Earth');
assert(Math.abs(crossings[2][0]-crossings[1][0])<2,'Dateline continuity broken');
vm.runInNewContext(globe,registry);
const items=registry.window.RevisionWorldDestinations;
for(const id of ['country-gb','country-kr','country-cn','country-us','ocean-pacific','sea-mediterranean'])
 assert(items.some(place=>place.id===id&&Number.isFinite(place.lat)&&Number.isFinite(place.lon)));
assert(html.indexOf('world-earth-renderer.js?v=68')<html.indexOf('app.js?v=68'),'Earth renderer should load before app');
assert(app.includes("const EARTH_TEXTURE_URL="),'Legacy source anchor missing');
assert(app.includes('NASA')&&app.includes('RevisionWorldEarth.load()'),'NASA image + geographic fallback not configured');
assert(app.includes('const queue=all.sort((a,b)=>score(b)-score(a))'),'No owned-first map declutter');
assert(app.includes("owned?'#22c55e'"),'Unlocked pins should turn green');
assert(app.includes("if(expanded)return all.sort"),'Missing all-pins inspection mode');
assert(app.includes('drawGlobe();')&&app.includes('renderAll();drawGlobe();'),'Buying should redraw owned pins immediately');
assert(html.includes('id="showAllGlobePins"'),'Pin density toggle not accessible');
assert(style.includes('.location-image-map-fallback'),'Photo fallbacks should use descriptive map art');
assert(!app.includes("images.search(l.name+' landscape'"),'Unrelated second photo API still in location details');
console.log('PASS geographic Earth: '+geo.rings.length+' public-domain WGS84 rings; clean dateline, new country/marine pins, ownership colours and uncluttered click targets.');
