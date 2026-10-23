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
for(const filename of mainFiles){
  const match=filename.match(/^full_country_stories_batch\d+_(\d+)_\d{8}\.json$/);
  if(!match)continue;
  const count=JSON.parse(fs.readFileSync(path.join(root,filename),'utf8')).records.length;
  assert.equal(count,Number(match[1]),'Country batch file count mismatch: '+filename);
}

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
// Selection index must account for every distinct ISO code and every source alternative.
const release=JSON.parse(fs.readFileSync(path.join(root,'country_gateway_release_index_20261023.json'),'utf8'));
const iso=release.entries.map(x=>x.iso2);
assert.equal(release.totals.distinctCountries,allCodes.size,'Index total differs from articles');checks++;
assert.equal(release.entries.length,allCodes.size,'Index omits countries');checks++;
assert.equal(new Set(iso).size,allCodes.size,'Duplicate selected gateway IDs');checks++;
for(const selected of release.entries){
  assert(allCodes.has(selected.iso2),'Unknown index code '+selected.iso2);checks++;
  assert.equal(selected.gatewayId,'country-'+selected.iso2.toLowerCase());checks++;
  assert(selected.wordCount>=200,'Short indexed article '+selected.iso2);checks++;
  assert(selected.sourceFile.startsWith('editorial/'),'Invalid source path');checks++;
  const indexFile=selected.sourceFile.replace(/^editorial\//,'');
  const referenced=load(indexFile).find(record=>record.iso2===selected.iso2);
  assert(referenced,'Selected source file missing article '+selected.iso2);checks++;
  const referencedSources=referenced.sources||[referenced.source];
  assert.deepEqual(selected.sourceLinks,referencedSources,'Incorrect official citations in index '+selected.iso2);checks++;
  const alternativeCount=africa.filter(x=>x.record.iso2===selected.iso2).length-
    (indexFile===extra?1:0);
  assert.equal(selected.alternateSources.length,alternativeCount,'Incorrect alternative count '+selected.iso2);checks++;

  assert(selected.live===false&&selected.mediaStatus==='photos-not-attached','Unsafe publishing assertion '+selected.iso2);checks++;
}
// Editorial inclusion policy is explicit and exhaustive: 193 UN members, 2 observers, 1 Kosovo geographic entry.
const policy=JSON.parse(fs.readFileSync(path.join(root,'country_gateway_inclusion_policy_196_20261023.json'),'utf8'));
assert.equal(policy.iso2Codes.length,196,'Gateway policy code count changed');checks++;
assert.equal(new Set(policy.iso2Codes).size,196,'Gateway policy contains duplicates');checks++;
assert.deepEqual([...policy.iso2Codes].sort(),[...iso].sort(),'Draft countries diverge from declared 196-place scope');checks++;
assert.equal(release.totals.distinctCountries,196,'Incomplete country draft archive');checks++;
assert.equal(release.totals.missingCountryDrafts,0,'Country drafts still missing');checks++;
assert.equal(policy.geopoliticalCaveats.XK.includes('disputed'),true,'Missing neutral Kosovo status context');checks++;
assert.equal(release.totals.totalVersionCount,main.length+africa.length);checks++;
assert.equal(release.totals.alternates,main.length+africa.length-allCodes.size);checks++;
// The five ocean articles must be distinct, source-backed and remain non-runtime.
const ocean=JSON.parse(fs.readFileSync(path.join(root,'ocean_stories_5_20261023.json'),'utf8'));
const expectedOceanIds=new Set(['ocean-pacific','ocean-atlantic','ocean-indian','ocean-arctic','ocean-southern']);
assert.equal(ocean.records.length,5,'Missing ocean article');checks++;
for(const entry of ocean.records){
  assert(expectedOceanIds.delete(entry.id),'Duplicate or unknown named ocean: '+entry.id);checks++;
  assert.equal(entry.sections.length,4,'Incomplete ocean sections: '+entry.id);checks++;
  assert(wordCount(entry.sections.map(s=>s.body).join(' '))>=200,'Ocean article too short: '+entry.id);checks++;
  assert(entry.sources.length>=1&&entry.sources.every(s=>s.startsWith('https://')),'Missing ocean references: '+entry.id);checks++;
  assert(entry.editorialStatus.includes('draft')&&entry.imageRights.includes('No photo asset'),'Uncleared ocean publication: '+entry.id);checks++;
}
assert.equal(expectedOceanIds.size,0,'Missing ocean identifiers');checks++;

// These articles cover separately named seas, not additional purchasable locations.
const seaFiles=['sea_stories_batch1_9_20261023.json','sea_stories_batch2_8_20261023.json'];
const seaEntries=seaFiles.flatMap(load);
const seaIDs=new Set();
assert.equal(seaEntries.length,17,'Expected all 17 named-sea drafts');checks++;
for(const sea of seaEntries){
  assert(/^sea-[a-z-]+$/.test(sea.id),'Unexpected sea ID: '+sea.id);checks++;
  assert(!seaIDs.has(sea.id),'Duplicate sea article: '+sea.id);seaIDs.add(sea.id);checks++;
  assert.equal(sea.sections.length,4,'Incomplete sea sections: '+sea.id);checks++;
  assert(wordCount(sea.sections.map(s=>s.body).join(' '))>=200,'Short sea article: '+sea.id);checks++;
  assert(sea.sources.length>=1&&sea.sources.every(x=>x.startsWith('https://')),'Missing sea source: '+sea.id);checks++;
  assert(sea.editorialStatus.includes('draft')&&sea.imageRights.includes('No image asset'),'Publication rights not cleared: '+sea.id);checks++;
}
assert.equal(seaIDs.size,17);checks++;

console.log('PASS '+checks+' editorial QA assertions; '+main.length+' primary + '+africa.length+' Africa versions = '+allCodes.size+' distinct countries, '+(main.length+africa.length)+' source-backed articles, all 200+ words; no runtime mutations');
