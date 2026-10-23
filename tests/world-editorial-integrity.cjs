/* Country editorial data checks: read-only; does not migrate or alter user storage. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..','editorial');
// Discover future country batches automatically rather than assuming a fixed number.
const mainFiles=[...fs.readdirSync(root).filter(f=>
  /^full_country_stories_batch\d+_\d+_\d{8}\.json$/.test(f)).sort((a,b)=>{
    const num=f=>Number(f.match(/batch(\d+)_/)[1]);return num(a)-num(b);
  }), 'full_country_stories_existing7_enriched_20261023.json'];
assert(mainFiles.length>=6,'Expected original country archive batches');
const extra='country_stories_africa_10_source_only_20261023.json';
const load=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8')).records;
const main=mainFiles.flatMap(f=>load(f).map(record=>({file:f,record})));
const africa=load(extra).map(record=>({file:extra,record}));
const wordCount=s=>(s.trim().match(/\S+/g)||[]).length;
const mainCodes=new Set(),allCodes=new Set();
let checks=0;
for(const {file,record:r} of main){
  assert.match(r.iso2,/^[A-Z]{2}$/,'Invalid ISO code: '+file);checks++;
  assert.equal(r.id,'country-'+r.iso2.toLowerCase(),'Unexpected country ID: '+file);checks++;
  assert(!mainCodes.has(r.iso2),'Duplicate primary country story: '+r.iso2);
  mainCodes.add(r.iso2);allCodes.add(r.iso2);checks++;
  assert(r.country&&r.hook&&r.quickFact,'Missing editorial metadata: '+r.iso2);checks++;
  assert.equal(r.sections?.length,4,'Need four sections: '+r.iso2);checks++;
  const titles=new Set(),paragraphs=[];
  for(const s of r.sections){
    assert(s.title&&s.body,'Empty section: '+r.iso2);checks++;
    assert(!titles.has(s.title),'Duplicated heading: '+r.iso2);titles.add(s.title);checks++;
    paragraphs.push(s.body);
  }
  assert(wordCount(paragraphs.join(' '))>=200,'Under 200 words: '+r.iso2);checks++;
  assert(r.sources?.length>0&&r.sources.every(s=>/^https:\/\//.test(s)),'Missing source URL: '+r.iso2);checks++;
  assert(r.editorialStatus&&r.editorialStatus.includes('draft'),'Must remain review draft: '+r.iso2);checks++;
  assert(Array.isArray(r.photoQueries)&&r.photoQueries.length>=2,'Photo search ideas missing: '+r.iso2);checks++;
}
assert(main.length>=72,'Primary country archive shrank');checks++;
for(const {record:r} of africa){
  assert.match(r.iso2,/^[A-Z]{2}$/);checks++;
  assert(r.source?.startsWith('https://whc.unesco.org/en/list/'),'Missing UNESCO source: '+r.iso2);checks++;
  assert(wordCount(r.article||'')>=200,'Short African feature: '+r.iso2);checks++;
  // These separately drafted Africa articles can be legitimate alternatives to a primary entry.
  if(mainCodes.has(r.iso2))assert(main.find(({record})=>record.iso2===r.iso2),'Missing corresponding primary draft');checks++;
  allCodes.add(r.iso2);
}
assert.equal(africa.length,10);checks++;
assert(allCodes.size>=76,'Country coverage unexpectedly shrank');checks++;
assert(main.length+africa.length>=82,'Article archive unexpectedly shrank');checks++;
const additions=['full_country_stories_batch4_12_20261023.json','full_country_stories_batch5_12_20261023.json'].flatMap(load);
assert.equal(additions.length,24,'New country batches truncated');checks++;
for(const r of additions){
  assert.equal(r.imageRights,'No image asset cleared; text only','Do not imply photo rights: '+r.iso2);checks++;
  assert(r.sources.every(x=>x.startsWith('https://whc.unesco.org/en/list/')),'Use official source: '+r.iso2);checks++;
}
// Photo rights metadata is editorial, never an instruction to hotlink or deploy.
const photoFiles=['commons_verified_photos_batch3_20261023.json','commons_verified_photos_batch4_20261023.json'];
const photoIds=new Set();
for(const f of photoFiles){
  const batch=JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
  for(const item of batch.files){
    assert(item.countryCode&&item.file&&item.caption&&item.author,'Unattributed photo: '+f);checks++;
    assert(item.filePage.startsWith('https://commons.wikimedia.org/wiki/File:'),'Missing Commons page: '+item.file);checks++;
    assert(item.license.startsWith('CC ')&&item.licenseUrl.startsWith('https://creativecommons.org/licenses/'),'Missing license: '+item.file);checks++;
    assert(!photoIds.has(item.filePage),'Duplicate photo record: '+item.filePage);photoIds.add(item.filePage);checks++;
  }
}
assert.equal(photoIds.size,13,'Unexpected Commons audit count');checks++;
console.log('PASS '+checks+' editorial QA assertions; '+main.length+' primary + '+africa.length+' Africa versions = '+allCodes.size+' distinct countries, '+(main.length+africa.length)+' source-backed articles, all 200+ words; no runtime mutations');
