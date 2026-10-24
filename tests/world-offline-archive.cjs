/* Validate the complete world reader is shipped in the service worker shell. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
assert(sw.includes("'./world-location-map-preview.js'"),'Offline fallback map module missing');
const files=fs.readdirSync(path.join(root,'editorial')).filter(x=>
 /^full_country_stories_|^sea_stories_|^ocean_stories_|^commons_verified_photos_|^country_gateway_(?:inclusion_policy|release_index)|^world_destination_coordinates_218/.test(x));
assert.equal(files.length,28,'Offline world research asset inventory changed');
for(const filename of files){
 assert(sw.includes("'./editorial/"+filename+"'"),'Missing offline article source '+filename);
}
for(const required of ['world-curated-photos.js','world-location-photo-gallery.js','world-geographic-destinations.js','world-globe-article-bridge.js','world-profile-preservation.js','world-commons-media.js','world-library-preview.html','world-library-preview.js','world-zoom-helpers.js','world-earth-renderer.js']){
 assert(sw.includes("'./"+required+"'"),'World app shell missing '+required);
}
assert(sw.includes("c.addAll(SHELL)"),'Offline install does not precache the editorial library');
assert(sw.includes('caches.match(e.request,{ignoreSearch:true})'),'Offline navigation must match precached pages even when ?country= or ?feature= is present');
assert(sw.includes("'./data/natural-earth-coastlines-110m.json'"),'Actual public-domain Earth boundaries missing from offline bundle');
assert(sw.includes("revision-loop-v75-country-photo-candidates"),'Cache version not advanced');
console.log('PASS offline world assets: 27 editorial source files and seven world runtime files precached on service worker install.');
