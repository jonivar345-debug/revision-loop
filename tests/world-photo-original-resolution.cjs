/* Source image resolution guard: fail safely rather than serving a downgraded file. */
'use strict';
const assert=require('node:assert/strict');
const media=require('../world-commons-media.js');
const curated=require('../world-curated-photos.js');
const example=curated.get('hongkong')[0];
assert(example.width>=2048&&example.height>=900&&example.source==='editorial-source');
function metadata(width,height,license='CC BY-SA 4.0'){
 return {query:{pages:[{title:example.file,imageinfo:[{
  url:'https://upload.wikimedia.org/wikipedia/commons/1/1a/genuine.jpg',
  thumburl:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/genuine.jpg/2048px-genuine.jpg',
  width,height,
  extmetadata:{
   LicenseShortName:{value:license},
   LicenseUrl:{value:'https://creativecommons.org/licenses/by-sa/4.0/'},
   Artist:{value:'Photographer from current Commons file'},
   ImageDescription:{value:'Victoria Peak'}
  }
 }]}]}};
}
const fetcher=(width,height,license)=>async()=>({ok:true,json:async()=>metadata(width,height,license)});
(async()=>{
 const high=await media.verifyNamedFiles([example],{fetcher:fetcher(5384,3589,'CC BY-SA 4.0')});
 assert.equal(high.length,1,'Genuinely high-resolution Commons source must be displayed');
 assert.equal(high[0].author,'Photographer from current Commons file','Attribution must come from live metadata');
 assert.equal(high[0].width,5384);
 const low=await media.verifyNamedFiles([example],{fetcher:fetcher(1600,720,'CC BY-SA 4.0')});
 assert.equal(low.length,0,'Downgraded file must not be accepted');
 const narrow=await media.verifyNamedFiles([example],{fetcher:fetcher(2500,800,'CC BY-SA 4.0')});
 assert.equal(narrow.length,0,'Below-recorded source height must be rejected');
 const denied=await media.verifyNamedFiles([example],{fetcher:fetcher(5384,3589,'All rights reserved')});
 assert.equal(denied.length,0,'Current licence cannot be overridden by old records');
 console.log('PASS source image dimensions and licence validation: current author preferred; degraded and unlicensed Commons files rejected');
})().catch(e=>{console.error(e);process.exitCode=1});
