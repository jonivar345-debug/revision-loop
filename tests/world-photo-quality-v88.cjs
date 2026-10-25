/* World photo quality regression: source checks are NOT visual approval. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const discovery=require('../world-photo-discovery-data.js'),enrichment=require('../world-photo-enrichment-v85.js');
global.window={RevisionWorldDiscoveryPhotos:discovery,RevisionWorldPhotoEnrichment:enrichment};
const catalog=require('../world-curated-photos.js'),gallery=require('../world-location-photo-gallery.js');
const root=path.join(__dirname,'..');
const rows=fs.readFileSync(path.join(root,'editorial/world_photo_collection_template_376.csv'),'utf8')
.split(/\r?\n/).slice(1).filter(Boolean).map(line=>{
 const a=[...line.matchAll(/"([^"]*)"/g)].map(x=>x[1]);
 return {id:a[3],name:a[0],kind:a[1],region:a[2]};
});
assert.equal(rows.length,376,'All historical locations must remain');
const bad={
 'ocean-indian':['Cscl indian ocean 07022016 Bagger.jpg','Cscl indian ocean 07022016 Steuerbord.jpg'],
 'sea-coral':['Coral Sea 8A Coral Sea Ferry Sam Ka Tsuen to Tsim Sha Tsui and Central Central Ferry Pier 10 aboarding place 24-06-2025.jpg','Coral Sea 18 Coral Sea Ferry Sai Wan Ho to Lei Yue Mun(Sam Ka Tsuen) cabin 29-06-2025(1).jpg','Coral Sea 1 Coral Sea Ferry Sam Ka Tsuen to Tsim Sha Tsui and Central 18-01-2025.jpg'],
 'sea-mediterranean':['Area of the Mediterranean.jpg'],
 'sea-east-china':['East China Sea 2017 02 25 (33105952485).jpg'],
 'sea-weddell':['Weddell Sea, Antartica.jpg'],
 'sea-okhotsk':['Raikoke Volcano ash cloud, Kuril Islands, Sea of Okhotsk, Russia - June 23rd, 2019 (48122331232).jpg'],
 'country-ws':['Samoa Beach near Eureka, California.jpg','Buoy at the Humboldt Bay Maritime Museum in Samoa, California.jpg'],
 'country-td':['102nd Chad Ministerial Review (4291102482).jpg','102nd Chad Ministerial Review (4290363065).jpg','102nd Chad Ministerial Review (4290343863).jpg'],
 'country-jm':['Jamaica Bay Wildlife Refuge East Pond (61277p).jpg','Jamaica Bay Wildlife Refuge East Pond (61289p).jpg','Jamaica Bay Wildlife Refuge (41031).jpg'],
 'country-pt':['Cabruza (Parablennius gattorugine), Parque natural de la Arrábida, Portugal, 2022-07-22, DD 48.jpg','Ascidia bombillo (Clavelina lepadiformis), Parque natural de la Arrábida, Portugal, 2022-07-20, DD 52.jpg']
};
const newFiles={
 'ocean-indian':['Aerial shot of a small island on a coral reef in the Maldives.jpg','Indian Ocean,Kenya Coastline.jpg'],
 'sea-coral':['Arlington-Reef-2018-aerial-view-Luka-Peternel.jpg','Vue aérienne raprochée du grand récif de Gatope et son trou bleu.jpg','Mar de Coral 3.jpg'],
 'sea-mediterranean':['Coastal aerial of Barcelona with Port-Nou in foreground.jpg'],
 'sea-east-china':['View of the East China Sea from Kunigami Forest Park 2018.JPG'],
 'sea-weddell':['Emperor-iceberg hg.jpg'],
 'sea-okhotsk':['Ryuhyo abashiri oki.JPG'],
 'country-ws':['Beach fales at Lalomanu beach, Upolu, Samoa - August 2016.jpg',"Blowholes Savai'i 2009.jpg"],
 'country-td':['Girl walking within the Ennedi sandstone, Chad (26726395628).jpg',"Place de la Nation - N'djamena.jpg","Une vue de près du fleuve Chari de N'Djamena à son coucher.jpg"],
 'country-jm':["Dunn's River Falls.jpg",'Negril.jpg','Blue and John Crow Mountains.jpg'],
 'country-pt':['A panoramic view of the Dom Luís I Bridge spanning the Douro River in Porto, Portugal, with a yellow tram crossing and the historic city skyline in the background. (55246746406).jpg','View over the river Tagus, Lisbon, Portugal.jpg']
};
let complete=0,checked=0,distinctTotal=0;
for(const loc of rows){
 const all=catalog.get(loc.id),norm=x=>x.replace(/^File:/i,'').replace(/_/g,' ').toLowerCase();
 const named=new Map(all.filter(p=>p.file&&p.author&&p.filePage&&p.licenseUrl&&gallery.allowed(p,{id:loc.id,name:loc.name,worldKind:loc.kind})).map(p=>[norm(p.file),p]));
 if(named.size>=4)complete++;
 distinctTotal+=named.size;
 for(const badFile of bad[loc.id]||[])
  assert(!all.some(p=>norm(p.file)===norm(badFile)),loc.id+' still contains wrong-place/nonphoto '+badFile);
 for(const accepted of newFiles[loc.id]||[]){
  const p=named.get(norm(accepted));
  assert(p,loc.id+' missing source-checked correction '+accepted);
  assert(p.source==='editorial-source'&&!p.checked,'Commons photo must retain runtime licence re-verification');
  assert(p.author&&p.licenseUrl.startsWith('https://creativecommons.org/')&&p.width>=2048&&p.height>=1000,'Original source resolution / credits required');
  checked++;
 }
}
assert.equal(complete,376,'All 376 galleries must retain four distinct source candidates');
assert.equal(checked,19,'Nineteen replacement photographs must stay present');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
assert(index.includes('world-photo-discovery-data.js?v=91'));
assert(index.includes('world-photo-enrichment-v85.js?v=91'));
assert(sw.includes('revision-loop-v96-character-art'));
console.log('PASS world-photo-quality v88: '+complete+'/376 source-complete, '+checked+' place-correct replacement photos, '+distinctTotal+' distinct location-file pairs. Not image-pixel review.');
