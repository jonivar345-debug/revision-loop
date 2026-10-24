/* Photo coverage release: provisional source records cannot bypass live CC checks. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const curated=require('../world-curated-photos.js');
const media=require('../world-commons-media.js');
const gallery=require('../world-location-photo-gallery.js');
const root=path.join(__dirname,'..');
const rows=fs.readFileSync(path.join(root,'editorial/world_photo_collection_template_376.csv'),'utf8')
  .trim().split(/\r?\n/).slice(1);
const ids=rows.map(row=>{
  const fields=[...row.matchAll(/"([^"]*)"/g)].map(m=>m[1]);
  return fields[3];
}).filter(Boolean);
assert.equal(ids.length,376,'The stable canonical photo-location inventory must remain at 376');
let checked=0,sourceReviewed=0,editorial=0,destinations=0;
for(const id of ids){
  const photos=curated.get(id);
  if(photos.length)destinations++;
  const files=new Set();
  for(const photo of photos){
    assert(!files.has(photo.file),'Duplicate selected file within '+id);files.add(photo.file);
    assert.equal(photo.source==='curated'||photo.source==='editorial-source',true);
    assert(photo.url.includes('width=2048'),'Do not reduce Commons gallery size');
    assert(photo.originalUrl.startsWith('https://commons.wikimedia.org/wiki/Special:FilePath/'));
    assert(photo.filePage.startsWith('https://commons.wikimedia.org/wiki/File:'));
    assert(photo.licenseUrl.startsWith('https://creativecommons.org/'));
    assert(photo.author&&photo.subject&&/File:.+\.(?:jpe?g|png|webp)$/i.test(photo.file));
    if(photo.source==='curated'){checked++;assert.equal(photo.checked,true)}
    else{editorial++;assert.equal(photo.checked,false);assert.equal(photo.locationVerified,true)}
    sourceReviewed++;
  }
}
assert.equal(curated.get('london').length,4);
assert.equal(curated.get('busan').length,4);
assert.equal(curated.get('country-cf').length,4,'Central African Republic must have four distinct source references');
assert.equal(checked,8,'Only London and Busan are fully hand-curated');
assert(editorial>=200,'The sourced editorial archive did not reach the live candidate registry');
assert(destinations>=90,'Expected improved country-gateway photo coverage');
const source=fs.readFileSync(path.join(root,'world-location-photo-gallery.js'),'utf8');
assert(source.includes("source==='editorial-source'")&&source.includes('api.verifyNamedFiles(proposed)'),
  'Editorial candidates must not bypass live file-level rights validation');
assert(source.includes('searchArticleImages'),'Destination article images missing');
assert(source.includes('i===0?')||source.includes("image.loading=card?'lazy':i===0?'eager':'lazy'"),
  'Photos should retain good mobile image-loading behaviour');

const validFile=title=>({title,imageinfo:[{
  thumburl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/image.jpg/2048px-image.jpg',
  url:'https://upload.wikimedia.org/wikipedia/commons/a/aa/image.jpg',
  width:4200,height:2800,
  extmetadata:{
    LicenseShortName:{value:'CC BY-SA 4.0'},
    LicenseUrl:{value:'https://creativecommons.org/licenses/by-sa/4.0/'},
    Artist:{value:'Current Commons photographer'},
    ImageDescription:{value:'Landmark photograph'}
  }
}]});
(async()=>{
  const bad=validFile('File:Unlicensed Paris.jpg');
  bad.imageinfo[0].extmetadata.LicenseShortName.value='All rights reserved';
  const calls=[];
  const fetcher=async url=>{
    const address=new URL(url);calls.push(address);
    if(address.hostname==='en.wikipedia.org')return {ok:true,json:async()=>({query:{pages:[{
      title:'Paris',images:[{title:'File:Paris Eiffel Tower.jpg'},{title:'File:Unlicensed Paris.jpg'},
        {title:'File:Paris locator map.svg'}]
    }]}})};
    return {ok:true,json:async()=>({query:{pages:[validFile('File:Paris Eiffel Tower.jpg'),bad]}})};
  };
  const related=await media.searchArticleImages('Paris',{fetcher});
  assert.equal(related.length,1);
  assert.equal(related[0].file,'File:Paris Eiffel Tower.jpg');
  assert(calls[0].searchParams.get('prop')==='images'&&calls[1].searchParams.get('iiurlwidth')==='2048');
  assert(!calls[1].searchParams.get('titles').includes('locator map'));
  const hints=[
    {file:'File:Paris Eiffel Tower.jpg',subject:'Eiffel Tower',source:'editorial-source'},
    {file:'File:Unlicensed Paris.jpg',subject:'Unknown Paris',source:'editorial-source'}
  ];
  const now=await media.verifyNamedFiles(hints,{fetcher:async url=>{
    assert.equal(new URL(url).searchParams.get('iiurlwidth'),'2048');
    return {ok:true,json:async()=>({query:{pages:[validFile('File:Paris Eiffel Tower.jpg'),bad]}})};
  }});
  assert.equal(now.length,1,'Unlicensed editorial record must not be published');
  assert.equal(now[0].author,'Current Commons photographer','Live Commons credit must replace research metadata');
  assert.equal(now[0].description,'Eiffel Tower');
  assert.equal(now[0].source,'editorial-live-checked');
  const approved=gallery.allowed(now[0],{id:'country-fr',name:'Country: France',worldKind:'country'});
  assert.equal(approved,true,'Current rights-checked country photographs should enter the gallery');
  assert.equal(gallery.allowed(validFile('File:Paris locator map.jpg'),{id:'country-fr',name:'Country: France'}),false);
  const noRights=await media.verifyNamedFiles(hints,{fetcher:async()=>({ok:false})});
  assert.deepEqual(noRights,[],'API failure should not silently publish unverified candidates');
  console.log('PASS destination photo sources:',destinations,'places have',sourceReviewed,
    'sourced image records;',checked,'curated,',editorial,
    'metadata-reviewed candidates; live licence validation and 2048px quality checks passed.');
})().catch(e=>{console.error(e);process.exitCode=1});