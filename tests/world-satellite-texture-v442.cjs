'use strict';
/* v442: regression for the World globe's satellite preview dimensions.
   Uses the real onload code with a deterministic mock canvas. No network,
   purchases, XP, profile data or scan permissions are involved. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const src=fs.readFileSync('app.js','utf8');
const begin=src.indexOf('const nasaEarth=new Image();');
const last='nasaEarth.src=EARTH_TEXTURE_URL;';
const end=src.indexOf(last,begin)+last.length;
assert(begin>=0&&end>begin,'World satellite image setup found in real app');
const script=src.slice(begin,end);
assert(script.includes('getImageData(0,0,canvas.width,canvas.height)'),
  'Read full canvas; half-size image data cannot back a full-size globe texture');
assert(!script.includes('getImageData(0,0,1024,512)'));
assert(script.includes('canvas.width*canvas.height*4'));

function run(options={}){
 const calls={image:0,drawImage:0,getImageData:0,drawGlobe:0,requested:null};
 const canvas={width:0,height:0,
  getContext(name){
   assert.equal(name,'2d');
   return {
    drawImage(img,x,y,w,h){
     assert.equal(x,0);assert.equal(y,0);
     assert.equal(w,canvas.width);assert.equal(h,canvas.height);
     calls.drawImage++;
    },
    getImageData(x,y,w,h){
     calls.getImageData++;calls.requested={x,y,w,h};
     if(options.failRead)throw new Error('CORS-tainted canvas');
     return {data:{length:w*h*4}};
    }
   }
  }
 };
 class FakeImage{
  set src(value){assert(value.includes('Blue_Marble'));this.onload();}
 }
 const context={Image:FakeImage,document:{createElement:tag=>{
   assert.equal(tag,'canvas');calls.image++;return canvas;
 }},earthPixels:options.existingPixels??null,earthW:100,earthH:50,
  earthTextureReady:Boolean(options.existingPixels),satelliteReady:false,
  EARTH_TEXTURE_URL:'https://commons.wikimedia.org/wiki/Special:FilePath/Blue_Marble_2002.jpg?width=2048',
  drawGlobe(){calls.drawGlobe++},console:{warn:()=>{}}};
 vm.runInNewContext(script,context);
 return {calls,context};
}
const loaded=run();
assert.equal(loaded.calls.drawImage,1);
assert.equal(loaded.calls.getImageData,1);
assert.deepEqual(JSON.parse(JSON.stringify(loaded.calls.requested)),{x:0,y:0,w:2048,h:1024});
assert.equal(loaded.context.earthPixels.length,2048*1024*4);
assert.equal(loaded.context.earthW,2048);
assert.equal(loaded.context.earthH,1024);
assert.equal(loaded.context.satelliteReady,true);
assert.equal(loaded.context.earthTextureReady,true);
assert.equal(loaded.calls.drawGlobe,1);
const fallback={length:100*50*4};
const blocked=run({failRead:true,existingPixels:fallback});
assert.equal(blocked.context.earthPixels,fallback,'Offline Natural Earth pixels stay intact if remote image is tainted');
assert.equal(blocked.context.satelliteReady,false);
assert.equal(blocked.context.earthTextureReady,true);
assert.equal(blocked.calls.drawGlobe,0);
const saveFunctions=src.slice(src.indexOf('function load(k,f){'),src.indexOf('function ensureProfile(){'));
assert(!script.includes('localStorage')&&!script.includes('profile.')&&!script.includes('save()'));
assert(saveFunctions.includes('localStorage.setItem(PROGRESS_KEY'));
console.log('PASS v442: satellite uses full 2048x1024 pixel buffer, activates globe, preserves CORS fallback and saved study profile');
