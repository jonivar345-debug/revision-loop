/* Attribution and use-readiness checklist for the 13 hand-reviewed Commons files.
   This is a metadata and integration guard, not a replacement for periodic licence rechecks. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),directory=path.join(root,'editorial');
const sources=['commons_verified_photos_batch3_20261023.json','commons_verified_photos_batch4_20261023.json'];
const files=sources.flatMap(name=>JSON.parse(fs.readFileSync(path.join(directory,name),'utf8')).files);
const countries=new Set(),names=new Set(),byCountry={};
const library=fs.readFileSync(path.join(root,'world-library-preview.js'),'utf8');
const gallery=fs.readFileSync(path.join(root,'world-location-photo-gallery.js'),'utf8');
const archive=JSON.parse(fs.readFileSync(path.join(directory,'country_gateway_release_index_20261023.json'),'utf8'));
const countryIds=new Set(archive.entries.map(x=>x.iso2));
let checks=0;
assert.equal(files.length,13,'Photo source audit no longer covers 13 individual records');checks++;
for(const entry of files){
 for(const field of ['countryCode','file','caption','author','license','filePage','licenseUrl']){
   assert(typeof entry[field]==='string'&&entry[field].trim(),'Missing photo attribution '+field);checks++;
 }
 assert(countryIds.has(entry.countryCode),'Image country absent from release index');checks++;
 assert(!names.has(entry.file),'Duplicated image attribution file '+entry.file);names.add(entry.file);checks++;
 countries.add(entry.countryCode);
 byCountry[entry.countryCode]=(byCountry[entry.countryCode]||0)+1;
 const sourcePage=new URL(entry.filePage),licensePage=new URL(entry.licenseUrl);
 assert.equal(sourcePage.protocol,'https:');checks++;
 assert.equal(sourcePage.hostname,'commons.wikimedia.org');checks++;
 assert(sourcePage.pathname.startsWith('/wiki/File:'),'Image not sourced from Commons file page');checks++;
 assert.equal(licensePage.hostname,'creativecommons.org');checks++;
 assert(['CC BY 2.0','CC BY 4.0','CC BY-SA 3.0','CC BY-SA 4.0'].includes(entry.license),'Unexpected licence: '+entry.license);checks++;
 assert(library.includes("'"+entry.file+"'"),'Preview image whitelist excludes '+entry.file);checks++;
 assert(gallery.includes('destination-photo-credits'),'Location gallery must retain image attribution disclosure');checks++;
}
assert.deepEqual([...countries].sort(),['AL','AM','CA','ID','SG','TR']);checks++;
assert.equal(files.length,Object.values(byCountry).reduce((a,b)=>a+b,0));checks++;
for(const ui of [library]){
 assert(ui.includes('Special:FilePath'),'Source image not rendered in interface');checks++;
 assert(ui.includes('photo.author')||ui.includes('image.author'),'No photographer attribution in interface');checks++;
 assert(ui.includes('licenseUrl'),'Licence hyperlink omitted');checks++;
 assert(ui.includes('filePage'),'Original Commons file link omitted');checks++;
}
assert(gallery.includes('p.filePage')&&gallery.includes('p.licenseUrl')&&gallery.includes('destination-photo-credits'),'Photo credits or source links missing from new gallery');checks++;
console.log('PASS '+checks+' image source, CC metadata, whitelist and attribution assertions: 13 reviewed photos across '+countries.size+' countries. 190 countries still need verified photos.');
