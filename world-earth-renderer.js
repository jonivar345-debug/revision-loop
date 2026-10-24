/* Offline Earth texture from Natural Earth 110m (public domain).
   Equirectangular canvas uses the same WGS84 longitude/latitude transform as globe pins. */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.RevisionWorldEarth=Object.freeze(api);
})(typeof window==='object'?window:null,function(){
 'use strict';
 const DATA_URL='./data/natural-earth-coastlines-110m.json';
 const TAU=Math.PI*2;
 function unwrapped(points){
   let previous=null;
   return points.map(([lon,lat])=>{
     let value=lon;
     if(previous!==null){
       while(value-previous>180)value-=360;
       while(value-previous<-180)value+=360;
     }
     previous=value;return [value,lat];
   });
 }
 function paths(ctx,rings,w,h){
   for(const source of rings){
     if(!source||source.length<3)continue;
     const vertices=unwrapped(source);
     for(const shift of [-w,0,w]){
       ctx.beginPath();
       for(let i=0;i<vertices.length;i++){
         const [lon,lat]=vertices[i];
         const x=(lon+180)/360*w+shift,y=(90-lat)/180*h;
         if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
       }
       ctx.closePath();
       ctx.fill();
       ctx.stroke();
     }
   }
 }
 function rasterise(doc,world,{width=2048,height=1024}={}){
   if(!doc||!Array.isArray(world?.rings)||world.rings.length<150)throw Error('Natural Earth geometry missing');
   const canvas=doc.createElement('canvas');canvas.width=width;canvas.height=height;
   const ctx=canvas.getContext('2d',{willReadFrequently:true});
   const ocean=ctx.createLinearGradient(0,0,0,height);
   ocean.addColorStop(0,'#123b65');
   ocean.addColorStop(.18,'#145c88');
   ocean.addColorStop(.48,'#0b5682');
   ocean.addColorStop(.78,'#145c88');
   ocean.addColorStop(1,'#153959');
   ctx.fillStyle=ocean;ctx.fillRect(0,0,width,height);
   // Land and ocean colours are cartographic (not a photographic elevation model).
   const land=ctx.createLinearGradient(0,0,0,height);
   land.addColorStop(0,'#f1f6f7');
   land.addColorStop(.13,'#a1b39a');
   land.addColorStop(.27,'#9d9a69');
   land.addColorStop(.39,'#498364');
   land.addColorStop(.52,'#477f56');
   land.addColorStop(.67,'#96986d');
   land.addColorStop(.85,'#b7c4a4');
   land.addColorStop(1,'#eef4f7');
   ctx.fillStyle=land;ctx.strokeStyle='rgba(198,220,183,.42)';ctx.lineWidth=.45;
   paths(ctx,world.rings,width,height);
   // Light longitudinal shading keeps the globe recognisable without false geography.
   const sheen=ctx.createLinearGradient(0,0,width,0);
   sheen.addColorStop(0,'rgba(0,15,40,.13)');
   sheen.addColorStop(.5,'rgba(255,255,255,.045)');
   sheen.addColorStop(1,'rgba(0,15,40,.13)');
   ctx.fillStyle=sheen;ctx.fillRect(0,0,width,height);
   return {pixels:ctx.getImageData(0,0,width,height).data,width,height};
 }
 let loading;
 function load({fetcher,doc}={}){
   if(!loading||fetcher||doc){
     const get=fetcher||(typeof fetch==='function'?fetch:null);
     const documentRef=doc||(typeof document!=='undefined'?document:null);
     const task=(async()=>{
       if(!get||!documentRef)throw Error('Map loader not supported');
       const response=await get(DATA_URL,{cache:'force-cache'});
       if(!response.ok)throw Error('Natural Earth file not available');
       return rasterise(documentRef,await response.json());
     })();
     if(!fetcher&&!doc)loading=task;
     return task;
   }
   return loading;
 }
 return {rasterise,load,unwrapped,DATA_URL};
});
