/* Offline map thumbnail from public-domain Natural Earth geographic data.
   Used only when a city photograph cannot be verified or loaded. */
(function(root,factory){
'use strict';
const api=factory();
if(typeof module==='object'&&module.exports)module.exports=api;
if(root)root.RevisionWorldMapPreview=api;
})(typeof window==='object'?window:null,function(){
'use strict';
let rasterPromise=null;
let rasterCanvas=null;
const locate=(lon,lat)=>({
 x:((((lon+180)%360)+360)%360)/360,
 y:Math.max(0,Math.min(1,(90-lat)/180))
});
async function source(doc){
 if(rasterCanvas)return rasterCanvas;
 if(!rasterPromise){
  rasterPromise=(async()=>{
   if(typeof window==='undefined'||!window.RevisionWorldEarth)throw Error('Offline globe data is unavailable');
   const earth=await window.RevisionWorldEarth.load();
   const canvas=doc.createElement('canvas');
   canvas.width=earth.width;canvas.height=earth.height;
   const context=canvas.getContext('2d');
   const pixels=context.createImageData(earth.width,earth.height);
   pixels.data.set(earth.pixels);context.putImageData(pixels,0,0);
   rasterCanvas=canvas;return canvas;
  })().catch(error=>{rasterPromise=null;throw error});
 }
 return rasterPromise;
}
async function render(target,location,{doc}={}){
 const dom=doc||(typeof document!=='undefined'?document:null);
 if(!dom||!target||!location||!Number.isFinite(location.lat)||!Number.isFinite(location.lon))return false;
 const originalId=location.id;
 try{
  const map=await source(dom);
  if(!target.isConnected||(target.dataset.locationPhoto&&target.dataset.locationPhoto!==originalId))return false;
  const canvas=dom.createElement('canvas');canvas.width=520;canvas.height=248;
  canvas.className='location-accurate-map';
  canvas.setAttribute('role','img');
  canvas.setAttribute('aria-label','Geographic map preview for '+location.name+', centred on '+location.lat.toFixed(2)+' degrees latitude and '+location.lon.toFixed(2)+' degrees longitude');
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#113d66';ctx.fillRect(0,0,canvas.width,canvas.height);
  const center=locate(location.lon,location.lat);
  const width=canvas.width*360/84;
  const height=width*map.height/map.width;
  const baseX=canvas.width/2-center.x*width,baseY=canvas.height/2-center.y*height;
  for(const offset of [-1,0,1])ctx.drawImage(map,baseX+offset*width,baseY,width,height);
  const vignette=ctx.createLinearGradient(0,0,0,canvas.height);
  vignette.addColorStop(0,'rgba(6,18,35,.02)');vignette.addColorStop(1,'rgba(4,22,42,.35)');
  ctx.fillStyle=vignette;ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.beginPath();ctx.arc(canvas.width/2,canvas.height/2,12,0,Math.PI*2);
  ctx.fillStyle='rgba(250,204,21,.22)';ctx.fill();
  ctx.beginPath();ctx.arc(canvas.width/2,canvas.height/2,5,0,Math.PI*2);
  ctx.fillStyle='#fef08a';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='#0f172a';ctx.stroke();
  const caption=dom.createElement('span');
  caption.className='location-map-caption';
  caption.textContent='MAP VIEW · '+location.name;
  target.classList.add('location-image-map-fallback');
  target.replaceChildren(canvas,caption);
  return true;
 }catch{return false}
}
return Object.freeze({locate,render});
});
