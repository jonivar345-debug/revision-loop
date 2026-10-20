/* Revision Loop local answer photographs. No uploads or cloud recognition. */
(() => {
 'use strict';
 const DB_NAME='revision-loop-local-answer-photos',STORE='answers',MAX=5;
 let dbPromise=null,currentId='',pages=[],busy=false,sequence=0;
 const byId=(id)=>document.getElementById(id);
 function status(msg,error=false){const e=byId('scanStatus');if(e){e.textContent=msg;e.classList.toggle('scan-error',error)}}
 function db(){
  if(!window.indexedDB)return Promise.reject(new Error('Local browser storage is unavailable.'));
  if(dbPromise)return dbPromise;
  dbPromise=new Promise((resolve,reject)=>{
   const r=indexedDB.open(DB_NAME,1);
   r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE,{keyPath:'id'})};
   r.onsuccess=()=>resolve(r.result);
   r.onerror=()=>reject(r.error||new Error('Cannot open image storage.'));
   r.onblocked=()=>reject(new Error('Close other Revision Loop tabs to enable photo saving.'));
  }).catch(e=>{dbPromise=null;throw e});
  return dbPromise;
 }
 async function read(id){
  const conn=await db();
  return new Promise((resolve,reject)=>{const r=conn.transaction(STORE,'readonly').objectStore(STORE).get(id);
   r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error)});
 }
 async function write(id,values,state){
  const conn=await db();
  return new Promise((resolve,reject)=>{const tx=conn.transaction(STORE,'readwrite');
   tx.objectStore(STORE).put({id,images:values,status:state,savedAt:Date.now()});
   tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)});
 }
 function decode(file){
  return new Promise((resolve,reject)=>{
   if(!file.type.startsWith('image/'))return reject(new Error('Choose an image file.'));
   if(file.size>20000000)return reject(new Error('Each image must be under 20 MB.'));
   const url=URL.createObjectURL(file),img=new Image();
   img.onload=()=>{try{
    const max=1800,r=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));
    const canvas=document.createElement('canvas');canvas.width=Math.round(img.naturalWidth*r)||1;canvas.height=Math.round(img.naturalHeight*r)||1;
    const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas unavailable.');
    ctx.fillStyle='white';ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
    resolve(canvas.toDataURL('image/jpeg',.83));
   }catch(e){reject(e)}finally{URL.revokeObjectURL(url)}};
   img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Cannot decode this image. Try JPG or PNG.'))};
   img.src=url;
  });
 }
 function rotate(data){
  return new Promise((resolve,reject)=>{
   const im=new Image();
   im.onload=()=>{const canvas=document.createElement('canvas');canvas.width=im.naturalHeight;canvas.height=im.naturalWidth;
    const ctx=canvas.getContext('2d');ctx.translate(canvas.width,0);ctx.rotate(Math.PI/2);ctx.drawImage(im,0,0);
    resolve(canvas.toDataURL('image/jpeg',.83))};
   im.onerror=()=>reject(new Error('Image rotation failed'));im.src=data;
  });
 }
 async function persist(state='draft'){
  if(!currentId)return;
  const id=currentId,snapshot=[...pages];
  try{await write(id,snapshot,state);if(id===currentId)status(snapshot.length+' page(s) stored privately in this browser.')}
  catch(e){if(id===currentId)status('Photos remain available this session but cannot be stored: '+(e.message||'Storage is full.'),true)}
 }
 function hideZoom(){
  const view=byId('scanZoom');if(!view)return;view.hidden=true;view.innerHTML='';
 }
 function render(){
  const holder=byId('scanPages');if(!holder)return;
  const count=byId('scanCount');if(count)count.textContent=pages.length+' / '+MAX+' pages';
  holder.innerHTML=pages.map((src,i)=>'<figure class="scan-page"><img src="'+src+'" alt="Your written answer, page '+(i+1)+'"><figcaption><span>Page '+(i+1)+'</span><button type="button" data-turn="'+i+'">Rotate</button><button type="button" data-zoom="'+i+'">Enlarge</button><button type="button" data-remove="'+i+'">Remove</button></figcaption></figure>').join('');
  const id=currentId;
  holder.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{if(id!==currentId)return;pages.splice(+b.dataset.remove,1);render();persist()});
  holder.querySelectorAll('[data-turn]').forEach(b=>b.onclick=async()=>{if(id!==currentId||busy)return;busy=true;
   try{const at=+b.dataset.turn,value=await rotate(pages[at]);if(id!==currentId)return;pages[at]=value;render();await persist()}
   catch(e){status(e.message,true)}finally{busy=false}});
  holder.querySelectorAll('[data-zoom]').forEach(b=>b.onclick=()=>{
   const src=pages[+b.dataset.zoom],view=byId('scanZoom');if(!src||!view)return;
   view.innerHTML='<button type="button" id="scanZoomClose">Close image ✕</button><img alt="Enlarged handwritten working" src="'+src+'">';
   view.hidden=false;byId('scanZoomClose').onclick=hideZoom;
  });
 }
 async function add(files,id){
  if(id!==currentId||busy)return;busy=true;let errors=[];
  try{
   for(const f of Array.from(files).slice(0,Math.max(0,MAX-pages.length))){
    try{const src=await decode(f);if(id!==currentId)return;pages.push(src)}catch(e){errors.push(e.message)}
   }
   if(id!==currentId)return;
   render();await persist();
   if(errors.length)status(errors.join(' '),true);
   else if(pages.length===MAX)status('Five pages attached. Remove one to add another.');
  }finally{busy=false}
 }
 async function restore(id,version){
  let saved;
  try{saved=await read(id)}catch(e){if(currentId===id)status('Browser storage unavailable; photos can still be used until you leave this question.',true);return}
  if(currentId!==id||sequence!==version||!saved?.images?.length)return;
  if(saved.status==='draft'){
   pages=saved.images.slice(0,MAX);render();status('Recovered '+pages.length+' unfinished page(s) from this browser.');
  }else{
   const prior=byId('scanPrevious');if(!prior)return;
   prior.hidden=false;prior.innerHTML='<summary>View last saved answer photos ('+saved.images.length+')</summary><div class="scan-history">'+saved.images.map((img,i)=>'<img alt="Previous attempt page '+(i+1)+'" src="'+img+'">').join('')+'</div><small>Older working is for reference only, not a new submission.</small>';
  }
 }
 function mount(id){
  const area=byId('examAnswer');if(!area)return;
  currentId=id;pages=[];const version=++sequence;
  area.insertAdjacentHTML('afterend',`<section class="scan-control"><div class="scan-heading"><strong>Photograph your working</strong><span id="scanCount">0 / 5 pages</span></div><p>Write on paper, then take a photo or upload pages. Available on every exam question, including Mock.</p><div class="scan-buttons"><button type="button" id="scanTake">Take photo</button><button type="button" id="scanChoose">Upload image(s)</button></div><input id="scanCameraInput" type="file" accept="image/*" capture="environment" hidden><input id="scanChooseInput" type="file" accept="image/*" multiple hidden><div id="scanStatus" role="status" aria-live="polite">Images stay on this browser, not on a server.</div><div id="scanPages" class="scan-pages"></div><details id="scanPrevious" hidden></details><p class="scan-explainer">Handwriting is not automatically read. After photographing, tap <b>Mark my answer</b> and tick the marks your working earns. You can still type answers for automatic checking.</p></section><div id="scanZoom" class="scan-zoom" role="dialog" aria-label="Enlarged answer photo" hidden></div>`);
  byId('scanTake').onclick=()=>byId('scanCameraInput').click();
  byId('scanChoose').onclick=()=>byId('scanChooseInput').click();
  const take=byId('scanCameraInput'),choose=byId('scanChooseInput');
  take.onchange=()=>{add(take.files,id);take.value=''};
  choose.onchange=()=>{add(choose.files,id);choose.value=''};
  byId('scanZoom').onclick=e=>{if(e.target.id==='scanZoom')hideZoom()};
  byId('markExam').addEventListener('click',()=>{
   if(!pages.length||currentId!==id)return;
   queueMicrotask(()=>{
    if(currentId!==id)return;
    const feedback=byId('examFeedback');
    if(feedback){feedback.textContent='Scanned working has NOT been read or automatically marked. '+(byId('examAnswer')?.value.trim()?'Only the typed text was assessed automatically. ':'')+'Compare each marking point with your photographed work, tick the points earned and save your chosen mark.';feedback.className='feedback show neutral'}
   });
  });
  render();restore(id,version);
 }
 function commit(id){if(currentId===id&&pages.length)persist('marked')}
 function countFor(id){return currentId===id?pages.length:0}
 window.RevisionScan={mount,commit,countFor};
})();