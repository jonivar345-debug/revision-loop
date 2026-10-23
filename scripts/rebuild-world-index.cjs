/* Deterministic one-country-one-source index builder: editorial only. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..','editorial');
const batchFiles=fs.readdirSync(root).filter(name=>
 /^full_country_stories_batch\d+_\d+_\d{8}\.json$/.test(name)).sort((a,b)=>{
 const n=f=>Number(f.match(/batch(\d+)_/)[1]);return n(a)-n(b);
});
const primary=[...batchFiles,'full_country_stories_existing7_enriched_20261023.json'];
const alternatives='country_stories_africa_10_source_only_20261023.json';
const load=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8')).records;
const selected=new Map();const extra=new Map();let total=0;
const toEntry=(item,file)=>({
 iso2:item.iso2,
 country:item.country||null,
 gatewayId:'country-'+item.iso2.toLowerCase(),
 sourceFile:'editorial/'+file,
 focus:item.focus||null,
 wordCount:(item.sections?.map(x=>x.body).join(' ')||item.article||'').trim().split(/\s+/).length,
 sourceLinks:item.sources||[item.source],
 editorialStatus:'needs-human-review',
 mediaStatus:'photos-not-attached',
 live:false
});
for(const filename of primary){
 const rows=load(filename);
 const m=filename.match(/^full_country_stories_batch\d+_(\d+)_\d{8}\.json$/);
 if(m)assert.equal(rows.length,Number(m[1]),'Article batch count mismatch in '+filename);
 for(const item of rows){
   assert(!selected.has(item.iso2),'Duplicate primary country code: '+item.iso2);
   selected.set(item.iso2,toEntry(item,filename));total++;
 }
}
for(const item of load(alternatives)){
 const itemEntry=toEntry(item,alternatives);total++;
 if(!selected.has(item.iso2))selected.set(item.iso2,itemEntry);
 else {
   if(!extra.has(item.iso2))extra.set(item.iso2,[]);
   extra.get(item.iso2).push({file:itemEntry.sourceFile,wordCount:itemEntry.wordCount});
 }
}
const entries=[...selected.values()].sort((a,b)=>a.iso2.localeCompare(b.iso2))
 .map(x=>({...x,alternateSources:extra.get(x.iso2)||[]}));
const data={
 schema:'country-gateway-editorial-index-v3',
 generated:'2026-10-23',
 publicationStatus:'NON-RUNTIME PREVIEW ONLY: no shop unlocks, no profile writes or migration',
 description:'One source-backed country story per country code, with Africa alternatives retained and historic shop IDs unchanged.',
 totals:{distinctCountries:entries.length,totalVersionCount:total,alternates:total-entries.length,countryGoal:196,missingCountryDrafts:196-entries.length},
 preservation:{oldLocationIdsRemain:161,oldCharactersRemain:116,oldOutfitStyleCount:8,legacyPurchaseIdRemovalAllowed:false},
 entries
};
const location=path.join(root,'country_gateway_release_index_20261023.json');
const result=JSON.stringify(data,null,2)+'\n';
if(process.argv.includes('--check')){
 const existing=fs.readFileSync(location,'utf8');
 assert.deepEqual(JSON.parse(existing),data,'Country release index stale: run node scripts/rebuild-world-index.cjs');
 console.log('PASS '+data.totals.distinctCountries+' unique country gateway index, '+data.totals.totalVersionCount+' versions');
}else if(process.argv.includes('--write')){
 fs.writeFileSync(location,result);
 console.log('Updated '+location);
}else{
 console.log(JSON.stringify(data.totals,null,2));
}
