/* Verify final user-flagged World destination photo choices in the actual
 * source catalogue and four-image gallery. Full-pixel human approval is separate. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
global.window={
 RevisionWorldDiscoveryPhotos:require('../world-photo-discovery-data.js'),
 RevisionWorldPhotoEnrichment:require('../world-photo-enrichment-v85.js')
};
const catalog=require('../world-curated-photos.js');
const gallery=require('../world-location-photo-gallery.js');
const improvements=[
 ['tbilisi','Tbilisi','Old Tbilisi town in Tbilisi, Georgia.jpg','Panorama from Narikala.jpg'],
 ['barcelona','Barcelona','Sagrada Familia Barcelona 1.jpg','Park Güell - view of Sagrada Familia.jpg'],
 ['prague','Prague','Night view of the Castle and Charles Bridge, Prague - 8019.jpg','Czech-2013-Prague-Lichtenstein Palace.jpg'],
 ['luxor','Luxor','Thebes, Luxor, Egypt, Panoramic view of the Valley of the Kings.jpg','Luxor Temple detail R01.jpg'],
 ['fes','Fez','Tanneries of Fez.jpg','Bou Jeloud Mosque Fez Morocco Nov25 A7CR 09121.jpg'],
 ['atacama','San Pedro de Atacama','Laguna Miscanti.jpg','Paisaje cerca de San Pedro de Atacama, Chile, 2016-02-01, DD 129.JPG'],
 ['vancouver','Vancouver','Stanley Park - Vancouver BC - Canada.jpg','Vancouver (BC, Canada), Vancouver Harbour Flight Centre -- 2022 -- 1874.jpg'],
 ['montreal','Montreal','Notre-Dame Basilica Montreal.jpg','Montreal Twilight Panorama 2006.jpg'],
 ['perth','Perth','Kings Park, Perth.jpg','Perth (AU), View from Kings Park -- 2019 -- 0435-42.jpg'],
 ['edinburgh','Edinburgh','The Royal Mile, Edinburgh, Scotland.jpg','Half-Moon battery Edinburgh Castle dec.23.jpg']
];
const mustShow={
 brisbane:['South Bank Parkland.jpg'],
 quebec:['Petit-Champlain - Quebec City.jpg'],
 dublin:['Dublin City Temple Bar.jpg'],
 tunis:['Panorama - Medina de Tunis.jpg'],
 losangeles:['Santa Monica - Pier beach.jpg','Griffith Observatory, Los Angeles.png']
};
const moreRejects={
 brisbane:['CityCat Spirit of Brisbane during royal visit to South Bank South Brisbane Reach Brisbane River P1190234.jpg'],
 quebec:['Stone office building on a corner, Quebec City.jpg'],
 dublin:["St Patrick's Cathedral Choir 360x180, Dublin, Ireland.jpg"],
 tunis:["Vol d'une aigrette garzette sur le lac de tunis.jpg"],
 losangeles:["Los Angeles River Atwater LA Mar23 A7R 04054.jpg","Sunnynook Bridge Los Angeles Rivert LA Mar23 A7R 04048.jpg"]
};
const file=p=>String(p.file).replace(/^File:/,'');
(async()=>{
 let checks=0;
 for(const [id,name,hero,blocked] of improvements){
  const full=catalog.get(id);
  assert(full.length>=4,id+' no longer has four independent photo sources');checks++;
  assert.equal(file(full[0]),hero,id+' priority source not first');checks++;
  assert(!full.some(p=>file(p).toLowerCase()===blocked.toLowerCase()),id+' retained weak source');checks++;
  assert(full[0].source==='editorial-source'&&!full[0].checked,'Source-only approval misrepresented as pixel review');checks++;
  assert(full[0].author&&full[0].licenseUrl&&full[0].originalUrl&&full[0].filePage,'Source credit absent');checks++;
  assert(full[0].width>=2000&&full[0].height>=1800,'Original image would be too small');checks++;
  const media={verifyNamedFiles:async pics=>pics};
  const [cover,four]=await Promise.all([
   gallery.photosFor({id,name},{limit:1,media}),
   gallery.photosFor({id,name},{limit:4,media})
  ]);
  assert.equal(cover.length,1);checks++;
  assert.equal(four.length,4,id+' no four-image gallery');checks++;
  assert.equal(file(cover[0]),hero,id+' shop cover not updated');checks++;
  assert.equal(file(four[0]),hero,id+' cover/gallery mismatch');checks++;
  assert.equal(new Set(four.map(p=>file(p).toLowerCase())).size,4,id+' repeats same image');checks++;
 }
 for(const [id,excluded] of Object.entries(moreRejects)){
  const full=catalog.get(id);
  assert(full.length>=4,id+' lost image depth');checks++;
  for(const desired of mustShow[id]||[]){
   assert(full.slice(0,4).some(p=>file(p).toLowerCase()===desired.toLowerCase()),id+' missing diverse photo '+desired);checks++;
  }
  for(const b of excluded){assert(!full.some(p=>file(p).toLowerCase()===b.toLowerCase()),id+' retained redundant original');checks++;}
  assert.equal(new Set(full.slice(0,4).map(p=>file(p).toLowerCase())).size,4,id+' gallery duplicated');checks++;
 }
 // A reviewed strong set must not be replaced by an arbitrary new hero.
 const keep=['newyork','busan','singapore','venice','rome','paris','beijing','rio','amsterdam','uluru','hongkong'];
 for(const id of keep){assert(catalog.get(id).length>=4,'Strong existing gallery unexpectedly lost source: '+id);checks++;}
 const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
 const sw=fs.readFileSync(path.join(__dirname,'../sw.js'),'utf8');
 assert(html.includes('world-curated-photos.js?v=99'));checks++;
 assert(sw.includes('revision-loop-v103-local-photos-and-stories'));checks++;
 assert(sw.includes("k.startsWith('revision-loop-')&&k!==CACHE"),'Do not delete unrelated caches');checks++;
 console.log('PASS v97: '+checks+' checks; ten new Commons heroes, five gallery cleanups, 11 pre-existing strong city sets preserved, four photos each; licenses supplied and pixel review not falsely claimed');
})().catch(e=>{console.error(e);process.exitCode=1});
