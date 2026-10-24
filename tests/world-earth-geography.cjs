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
assert(html.indexOf('world-earth-renderer.js?v=68')<html.indexOf('app.js?v=71'),'Earth renderer should load before app');
assert(app.includes("const EARTH_TEXTURE_URL="),'Legacy source anchor missing');
assert(app.includes('NASA')&&app.includes('RevisionWorldEarth.load()'),'NASA image + geographic fallback not configured');
assert(app.includes('const queue=all.sort((a,b)=>score(b)-score(a))'),'No owned-first map declutter');
assert(app.includes("owned?'#22c55e'"),'Unlocked pins should turn green');
assert(app.includes("if(expanded)return all.sort"),'Missing all-pins inspection mode');
assert(app.includes('drawGlobe();')&&app.includes('renderAll();drawGlobe();'),'Buying should redraw owned pins immediately');
assert(html.includes('id="showAllGlobePins"'),'Pin density toggle not accessible');
assert(style.includes('.destination-photo-gallery'),'Unlocked locations must provide a photographic gallery');
assert(!app.includes("images.search(l.name+' landscape'"),'Unrelated second photo API still in location details');
// Guard the coordinates of the locations visible in the reported screenshots
// and major cities on nearby parts of the globe. Coordinates are WGS84 degrees.
const referenceCities=[
 ['nairobi',-1.2921,36.8219],['tbilisi',41.7151,44.8271],['london',51.5072,-.1276],
 ['newyork',40.7128,-74.006],['cusco',-13.5319,-71.9675],['sydney',-33.8688,151.2093],
 ['capetown',-33.9249,18.4241],['tokyo',35.6762,139.6503],['reykjavik',64.1466,-21.9426],
 ['busan',35.1796,129.0756],['hongkong',22.3193,114.1694],['seoul',37.5665,126.978],
 ['shanghai',31.2304,121.4737],['istanbul',41.0082,28.9784],['paris',48.8566,2.3522],
 ['beijing',39.9042,116.4074]
];
for(const [id,latitude,longitude] of referenceCities){
 const match=app.match(new RegExp("\\{id:'"+id+"'[^}]*lat:([\\d.-]+),lon:([\\d.-]+)"));
 assert(match,'City lost historical position '+id);
 assert(Math.abs(Number(match[1])-latitude)<.06,'Incorrect north/south position '+id);
 assert(Math.abs(Number(match[2])-longitude)<.06,'Incorrect east/west position '+id);
}
// Map-image fallbacks must preserve the same WGS84 transform as globe pins.
const preview=require('../world-location-map-preview.js');
assert(Math.abs(preview.locate(-.1276,51.5072).x-(180-.1276)/360)<1e-8);
assert(Math.abs(preview.locate(139.65,35.67).y-(90-35.67)/180)<1e-8);
assert(preview.locate(181,0).x<.01,'Dateline wrap should use the same location on both sides');
assert(html.includes('world-location-map-preview.js?v=69'),'No offline geographic preview in the main app');
assert(style.includes('.location-accurate-map'),'Place map thumbnails missing from card styles');
assert(app.includes('gallery.render(el,location,{card:!!el.closest'),'Location photos must use the place-specific photo gallery');
assert(app.includes('if(c.width!==1400||c.height!==720)'),'Globe needs high-resolution canvas pixels for zoom');
console.log('PASS geographic Earth: '+geo.rings.length+' public-domain WGS84 rings; clean dateline, new country/marine pins, ownership colours and uncluttered click targets.');
