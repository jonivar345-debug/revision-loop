/**
 * Exact-source exclusions for obviously wrong Wikimedia filename associations.
 * Commons CC validity is NOT proof of geographic or visual relevance.
 * This is a reversible, documented list; do not use broad location-name fuzzy
 * filtering that could discard useful cultural or heritage photos.
 */
'use strict';
const fs=require('node:fs');
const file='world-photo-enrichment-v85.js',txt=fs.readFileSync(file,'utf8');
const m=txt.match(/const data=(\{[\s\S]*?\});/);
if(!m)throw Error('Photo source manifest not parseable');
const data=JSON.parse(m[1]);
const rules={
 'country-eg':[/Landscape with the Flight into Egypt/i],
 'country-gn':[/Helmeted guinea fowl/i,/Gallina de Guinea/i,/Columba guinea/i],
 'country-ps':[/Palestine sunbird/i],
 'country-ki':[/Humboldt Forum Ethnological Museum Object/i],
 'country-ci':[/Show Your Stripes/i],
 'country-tm':[/Parthian ivory rhyton/i],
 'sea-red':[/Red Sea Aquarium/i,/Red Sea Film Festival/i],
 'sea-weddell':[/Dropstone manganese-crust/i],
 'sea-bering':[/superstorm track/i,/bomb cyclone track/i],
 'sea-okhotsk':[/Show Your Stripes/i],
 'sea-south-china':[/South China Sea Museum/i],
 'ocean-atlantic':[/Show Your Stripes/i],
 'ocean-pacific':[/Show Your Stripes/i],
 'ocean-arctic':[/Show Your Stripes/i],
 'country-bb':[/2017-04-08 02 PELICAN II/i]
};
const removed=[];
for(const [id,patterns] of Object.entries(rules)){
 const rows=data[id]||[];
 const kept=rows.filter(photo=>{
  if(patterns.some(regex=>regex.test(photo.file))){
   removed.push({destinationId:id,file:photo.file,reason:'Country/sea name used in museum painting, specimen taxon, aquarium, movie event, climate map, unrelated location or low-quality object closeup'});
   return false;
  }
  return true;
 });
 if(kept.length)data[id]=kept;else delete data[id];
}
const newData=Object.fromEntries(Object.entries(data).sort(([a],[b])=>a.localeCompare(b)));
const out=txt.replace(m[0],'const data='+JSON.stringify(newData,null,2)+';');
fs.writeFileSync(file,out);
fs.writeFileSync('editorial/world-photo-enrichment-exclusions-v85.json',JSON.stringify({created:new Date().toISOString(),count:removed.length,removed,
 note:'All still-selected photos are live CC source candidates, not human visual approvals.'},null,2)+'\n');
console.log('PASS photo subject exclusions: removed '+removed.length+' off-location or non-destination images; remaining '+Object.values(newData).flat().length+' source records');
