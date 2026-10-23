/* Country editorial data checks: read-only; does not migrate or alter user storage. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..','editorial');
const mainFiles=[
  'full_country_stories_batch1_19_20261023.json',
  'full_country_stories_batch2_10_20261023.json',
  'full_country_stories_batch3_12_20261023.json',
  'full_country_stories_existing7_enriched_20261023.json',
  'full_country_stories_batch4_12_20261023.json',
  'full_country_stories_batch5_12_20261023.json'
];
const extra='country_stories_africa_10_source_only_20261023.json';
const load=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8')).records;
const main=mainFiles.flatMap(f=>load(f).map(record=>({file:f,record})));
const africa=load(extra).map(record=>({file:extra,record}));
const wordCount=s=>(s.trim().match(/\S+/g)||[]).length;
const mainCodes=new Set(),allCodes=new Set(),allowedAlternatives=new Set(['GA','CF','CM','CD','CG']);
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
assert.equal(main.length,72,'Unexpected primary article count');checks++;
for(const {record:r} of africa){
  assert.match(r.iso2,/^[A-Z]{2}$/);checks++;
  assert(r.source?.startsWith('https://whc.unesco.org/en/list/'),'Missing UNESCO source: '+r.iso2);checks++;
  assert(wordCount(r.article||'')>=200,'Short African feature: '+r.iso2);checks++;
  if(mainCodes.has(r.iso2))assert(allowedAlternatives.has(r.iso2),'Unexpected competing article: '+r.iso2);checks++;
  allCodes.add(r.iso2);
}
assert.equal(africa.length,10);checks++;
assert.equal(allCodes.size,77,'Country coverage needs reconciliation');checks++;
assert.equal(main.length+africa.length,82,'Unexpected total article variants');checks++;
const additions=[...load(mainFiles[4]),...load(mainFiles[5])];
assert.equal(additions.length,24,'New country batches truncated');checks++;
for(const r of additions){
  assert.equal(r.imageRights,'No image asset cleared; text only','Do not imply photo rights: '+r.iso2);checks++;
  assert(r.sources.every(x=>x.startsWith('https://whc.unesco.org/en/list/')),'Use official source: '+r.iso2);checks++;
}
console.log('PASS '+checks+' editorial QA assertions; 72 primary + 10 Africa versions = 77 distinct countries, 82 source-backed articles, all 200+ words; no runtime mutations');
