'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const manifest=require('../editorial/world-local-photo-pilot.json');
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
      assert(bytes.length>=16000,file+' too small');
      assert.equal(bytes[0],0xff,file+' not JPEG');
      assert.equal(bytes[1],0xd8,file+' not JPEG');
      assert.equal(bytes.at(-2),0xff,file+' incomplete JPEG');
      assert.equal(bytes.at(-1),0xd9,file+' incomplete JPEG');
    }
    count++;
  }
}
const attributions=JSON.parse(fs.readFileSync(path.resolve(directory,'assets/world/ATTRIBUTION.json')));
assert.equal(attributions.length,count);
console.log('Local photo archive validated: '+count+' credited photographs and '+count*2+' real JPEG files.');
