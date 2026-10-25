'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const manifest=require('../editorial/world-local-photo-pilot.json');
global.window={RevisionWorldDiscoveryPhotos:require('../world-photo-discovery-data.js'),RevisionWorldPhotoEnrichment:require('../world-photo-enrichment-v85.js'),RevisionWorldV104Photos:require('../world-photo-editorial-v104.js')};
const curated=require('../world-curated-photos.js');
const local=require('../world-local-photos.js');
const directory=path.resolve(__dirname,'../');
let count=0;
for(const [id,names] of Object.entries(manifest.locations)){
  const pictures=local.get(id);
  assert.equal(pictures.length,names.length,id+' local photograph count');
  for(let i=0;i<names.length;i++){
    const p=pictures[i];
    assert.equal(p.file,'File:'+names[i]);
    assert(p.url.startsWith('./assets/world/'+id+'/'));
    assert(p.localCoverUrl.startsWith('./assets/world/'+id+'/'));
    const saved=curated.get(id).find(item=>item.file===p.file);
    assert(saved,'original source metadata absent');
    assert.equal(p.author,saved.author);
    assert.equal(p.licenseUrl,saved.licenseUrl);
    for(const file of [p.url,p.localCoverUrl]){
      const pathname=path.join(directory,file);
      const bytes=fs.readFileSync(pathname);
      assert(bytes.length>=6000,file+' too small');
      assert.equal(bytes.toString('ascii',0,4),'RIFF',file+' not RIFF');
      assert.equal(bytes.toString('ascii',8,12),'WEBP',file+' not WebP');
      assert(file.endsWith('.webp'),'JPEG delivery path reintroduced');
    }
    count++;
  }
}
const attributions=JSON.parse(fs.readFileSync(path.resolve(directory,'assets/world/ATTRIBUTION.json')));
assert.equal(attributions.length,count);
assert(attributions.every(p=>p.format==='image/webp'&&p.galleryBytes>=6000&&p.coverBytes>=6000));
const report=JSON.parse(fs.readFileSync(path.resolve(directory,'editorial/world-local-photo-audit-v112.json'),'utf8'));
assert.equal(report.localPhotographs,count);
assert.equal(report.localDestinations,Object.keys(manifest.locations).length);
assert.equal(report.fourPhotoLocalGalleries,Object.values(manifest.locations).filter(x=>x.length===4).length);
const newAssetRecords=attributions.filter(photo=>photo.newSizeBudgeted);
assert(newAssetRecords.every(photo=>photo.galleryBytes<=720*1024&&photo.coverBytes<=170*1024),
  'A newly archived photo exceeded its image-size budget');
assert.equal(report.newBudgetedPhotographs,newAssetRecords.length,'Image optimization audit missing records');
assert(report.combinedImageBytes<520*1024*1024,'Photo library too large for the current staged release');
assert.equal(report.selectionIssuesAddressed.length,17);
assert.equal(report.excludedCrossPlaceSourceCandidates,20,'Cross-place exclusion audit missing');
assert.equal(report.correctedSixSourceGalleries.length,6,'The six source-gallery fixes are not recorded');
assert.equal(report.suspectedVisualDuplicates.length,0,
  'Near-duplicate photos require review before calling all four images distinct');
assert.equal(report.visualReviewStatus.startsWith('Unreviewed'),true,'Cannot claim full visual approval');
console.log('Local photo archive validated: '+count+' licensed photographs and '+count*2+' real WebP files.');
