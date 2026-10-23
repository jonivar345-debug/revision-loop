/* Validate the complete world reader is shipped in the service worker shell. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const files=fs.readdirSync(path.join(root,'editorial')).filter(x=>
 /^full_country_stories_|^sea_stories_|^ocean_stories_|^commons_verified_photos_|^country_gateway_(?:inclusion_policy|release_index)|^world_destination_coordinates_218/.test(x));
assert.equal(files.length,27,'Offline world research asset inventory changed');
for(const filename of files){
 assert(sw.includes("'./editorial/"+filename+"'"),'Missing offline article source '+filename);
}
for(const required of ['world-geographic-destinations.js','world-globe-article-bridge.js','world-profile-preservation.js','world-commons-media.js','world-library-preview.html','world-library-preview.js','world-zoom-helpers.js']){
 assert(sw.includes("'./"+required+"'"),'World app shell missing '+required);
}
assert(sw.includes("c.addAll(SHELL)"),'Offline install does not precache the editorial library');
assert(sw.includes("caches.match(e.request)"),'Missing cache read on network loss');
assert(sw.includes("revision-loop-v66-offline-world-library"),'Cache version not advanced');
console.log('PASS offline world assets: 27 editorial source files and seven world runtime files precached on service worker install.');
