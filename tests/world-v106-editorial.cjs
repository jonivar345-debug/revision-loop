/* Place accuracy regression for v106. No pixel approval implied. */
'use strict';
const assert=require('node:assert/strict');
const manifest=require('../editorial/world-local-photo-pilot.json');
global.window={RevisionWorldDiscoveryPhotos:require('../world-photo-discovery-data.js'),
 RevisionWorldPhotoEnrichment:require('../world-photo-enrichment-v85.js'),
 RevisionWorldV104Photos:require('../world-photo-editorial-v104.js')};
const curated=require('../world-curated-photos.js');
const changes=[["florence",3,"Santa Croce (Florence) - Facade.jpg","Dramatic Views of Hurricane Florence from the International Space Station From 9 12 (42828603210).jpg"],["porto",1,"View of Ribeira (Porto).jpg","Isola di Pianosa Vecchio Porto panoramic01 2018-05-30.jpg"],["porto",2,"Porto, São Bento station (4).jpg","20101016 Agios Nikolaos Metoxi Batopediou Porto Lagos Vistonida Lake Rhodope Greece.jpg"],["porto",3,"Porto view from Clerigos Church.jpg","Porto Alegre - Brazil Landscape-Night.jpg"],["gyeongju",2,"Bulguksa IMG 20161004 153040.jpg","Two bees absorbing pollen from an Iceland poppy in the flower garden of Gyeongju South Korea.jpg"],["gyeongju",3,"Gyeongju donggung palace and wolji pond.jpg","Red Geranium in the flower garden of the Tumuli Park at sunset in Gyeongju South Korea.jpg"],["krakow",2,"Wawel Castle Krakow.jpg","Former “Energoprojekt Kraków” administration building,, 1968 design. Antoni Mazur,, demolition, 21 Mazowiecka Street,,, Kraków, Poland.jpg"],["stockholm",3,"Gamla stan, Stockholm.jpg","SS Stockholm August 2015 01.jpg"],["bergen",3,"Panorama Bergen Fløyen.jpg","Bridge of KV Bergen W341.jpg"],["shenzhen",0,"Dameisha.jpg","Coco park.jpg"],["bohol",2,"Chocolate Hills - Bohol.jpg","Forest road in Bohol 2, Philippines.jpg"],["petra",3,"The Siq in Petra.jpg","Mosaic of the Petra Church, Petra, Jordan1.jpg"],["angkor",3,"Ta Prohm.jpg","2016 Angkor, Angkor Wat, Główna świątynia, Zewnętrzna galeria, Devata (02).jpg"]];
for(const [id,slot,name,removed] of changes){
 const slots=manifest.locations[id];
 assert.equal(slots?.length,4,id+' should keep four local photograph slots');
 assert.equal(slots[slot],name,id+' replacement missing at slot '+slot);
 assert(!slots.includes(removed),id+' still uses an inaccurate or weak source');
 assert.equal(new Set(slots.map(x=>x.toLowerCase())).size,4,id+' repeated file');
 const record=curated.get(id).find(p=>p.file==='File:'+name);
 assert(record,'Missing Commons editorial record for '+id+' '+name);
 assert(record.author&&record.licenseUrl&&record.filePage,'Missing creator/licence/source for '+id);
 assert(record.width>=1800&&record.height>=800,'Insufficient original dimensions for '+id);
 assert(record.editorialMetadata===true,'Do not confuse source research with pixel review');
}
console.log('PASS World v106: 13 replacement slots matched geographically distinct Commons sources, without losing four-photo coverage.');
