/* Revision Loop local answer photographs. No uploads or cloud recognition. */
(() => {
 'use strict';
 const DB_NAME='revision-loop-local-answer-photos',STORE='answers',MAX=5;
 let dbPromise=null,currentId='',pages=[],busy=false,sequence=0;
 let ocrText='',ocrApplied=false,ocrBusy=false,ocrConfidence=null,ocrLoadPromise=null,ocrRunNumber=0,appliedText='',lastOCRStatus='none';
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
 async function write(id,values,state,recognized=''){
  const conn=await db();
  return new Promise((resolve,reject)=>{const tx=conn.transaction(STORE,'readwrite');
   tx.objectStore(STORE).put({id,images:values,status:state,recognized,savedAt:Date.now()});
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
  const id=currentId,snapshot=[...pages],recognized=ocrText;
  try{await write(id,snapshot,state,recognized);if(id===currentId)status(snapshot.length+' page(s) stored privately in this browser.')}
  catch(e){if(id===currentId)status('Photos remain available this session but cannot be stored: '+(e.message||'Storage is full.'),true)}
 }
 function hideZoom(){
  const view=byId('scanZoom');if(!view)return;view.hidden=true;view.innerHTML='';
 }
 function resetOCR(){
  ocrText='';ocrConfidence=null;ocrApplied=false;ocrRunNumber++;appliedText='';lastOCRStatus='none';
  const ocr=byId('scanOCR');if(ocr)ocr.hidden=true;
  const transcript=byId('scanTranscript');if(transcript)transcript.value='';
  const hint=byId('scanOCRHint');if(hint)hint.textContent='';
  const button=byId('scanRecognize');if(button)button.disabled=!pages.length;
 }
 function loadOCR(){
  if(window.Tesseract?.createWorker)return Promise.resolve(window.Tesseract);
  if(ocrLoadPromise)return ocrLoadPromise;
  ocrLoadPromise=new Promise((resolve,reject)=>{
   const script=document.createElement('script');
   script.src='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
   script.async=true;script.referrerPolicy='no-referrer';
   script.onload=()=>window.Tesseract?.createWorker?resolve(window.Tesseract):reject(new Error('Handwriting reader did not initialise.'));
   script.onerror=()=>reject(new Error('Cannot load the handwriting reader. An internet connection is needed the first time.'));
   document.head.appendChild(script);
  }).catch(e=>{ocrLoadPromise=null;throw e});
  return ocrLoadPromise;
 }
 function showOCR(text,confidence){
  const panel=byId('scanOCR'),field=byId('scanTranscript'),hint=byId('scanOCRHint');
  if(!panel||!field)return;
  panel.hidden=false;field.value=text;
  if(hint)hint.textContent=confidence===null?'Review and correct the recognised writing before marking.':
   'Estimated recognition confidence: '+Math.round(confidence)+'%. This measures character recognition, not whether your mathematics is correct. Check every equation.';
 }

 function textImageForOCR(src,mode){
  if(mode==='normal')return Promise.resolve(src);
  return new Promise((resolve,reject)=>{
   const image=new Image();
   image.onload=()=>{
    try{
     const limit=2200,upscale=image.naturalWidth<1100?Math.min(2,1100/image.naturalWidth):1;
     const scale=Math.min(upscale,limit/Math.max(image.naturalWidth,image.naturalHeight));
     const canvas=document.createElement('canvas');
     canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));
     canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
     const ctx=canvas.getContext('2d',{willReadFrequently:true});
     if(!ctx)throw new Error('Image processing not supported in this browser.');
     ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
     ctx.drawImage(image,0,0,canvas.width,canvas.height);
     const data=ctx.getImageData(0,0,canvas.width,canvas.height),p=data.data;
     // Detect the global luminance distribution; Otsu's threshold improves
     // pen-on-paper contrast while keeping original photographs untouched.
     const hist=new Uint32Array(256),luma=new Uint8Array(p.length/4);
     for(let i=0,j=0;i<p.length;i+=4,j++){
      const v=Math.round(.299*p[i]+.587*p[i+1]+.114*p[i+2]);
      luma[j]=v;hist[v]++;
     }
     const n=luma.length,mean=luma.reduce((a,b)=>a+b,0)/Math.max(1,n);
     let total=0;for(let i=0;i<256;i++)total+=i*hist[i];
     let bg=0,weight=0,best=-1,threshold=Math.round(mean);
     for(let i=0;i<256;i++){
      weight+=hist[i];if(weight===0||weight===n)continue;
      bg+=i*hist[i];const other=n-weight;
      const diff=bg/weight-(total-bg)/other;
      const between=weight*other*diff*diff;
      if(between>best){best=between;threshold=i}
     }
     // For very bright paper, a small cut-off avoids a grey page.
     if(mean>220&&threshold>205)threshold=205;
     for(let i=0,j=0;i<p.length;i+=4,j++){
      const v=luma[j],final=mode==='binary'?(v<threshold?0:255):
       Math.max(0,Math.min(255,Math.round((v-128)*1.7+140)));
      p[i]=p[i+1]=p[i+2]=final;p[i+3]=255;
     }
     ctx.putImageData(data,0,0);
     resolve(canvas.toDataURL('image/png'));
    }catch(e){reject(e)}
   };
   image.onerror=()=>reject(new Error('Could not enhance the photograph.'));
   image.src=src;
  });
 }
 function imageQuality(src){
  return new Promise(resolve=>{
   const img=new Image();
   img.onload=()=>{
    if(img.naturalWidth<500||img.naturalHeight<500)
     return resolve('This image is fairly small; retake it closer to the writing if OCR struggles.');
    const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    if(!ctx)return resolve('');
    ctx.drawImage(img,0,0,128,128);
    const pix=ctx.getImageData(0,0,128,128).data;
    let sum=0,low=0;
    for(let i=0;i<pix.length;i+=4){
     const v=.299*pix[i]+.587*pix[i+1]+.114*pix[i+2];
     sum+=v;if(v<55)low++;
    }
    const avg=sum/(pix.length/4),dark=low/(pix.length/4);
    if(avg<85||dark>.75)return resolve('The photo looks dark. Brighter, even lighting will help OCR.');
    if(avg>249&&dark<.005)return resolve('The writing looks faint. Try darker pen or the high-contrast option.');
    resolve('');
   };
   img.onerror=()=>resolve('');
   img.src=src;
  });
 }
 function possiblyIncorrectArithmetic(line){
  // Deliberately narrow parser: it only checks one straightforward numeric
  // binary operation, without guessing at symbolic manipulations or units.
  const text=String(line||'').replace(/[−–—]/g,'-').replace(/×/g,'*').replace(/÷/g,'/');
  const re=/([-+]?(?:\d+(?:\.\d*)?|\.\d+))\s*([+*/-])\s*([-+]?(?:\d+(?:\.\d*)?|\.\d+))\s*=\s*([-+]?(?:\d+(?:\.\d*)?|\.\d+))/g;
  let match;
  while((match=re.exec(text))){
   const left=Number(match[1]),right=Number(match[3]),given=Number(match[4]);
   if(!Number.isFinite(left)||!Number.isFinite(right)||!Number.isFinite(given))continue;
   const expected=match[2]==='+'?left+right:match[2]==='-'?left-right:
     match[2]==='*'?left*right:right===0?NaN:left/right;
   if(!Number.isFinite(expected))continue;
   if(Math.abs(given-expected)>Math.max(.025*Math.abs(expected),.03))return true;
  }
  return false;
 }
 function reviewEvidence(q,answer,res){
  if(!hasRecognizedMarking(q.id))return null;
  const lines=String(answer||'').split(/\r?\n|;\s*/).map(x=>x.trim()).filter(x=>x.length>2);
  const terms=x=>[...new Set((String(x).toLowerCase().match(/[a-z]{3,}/g)||[]).filter(w=>!['the','and','are','for','with','from','that','this','into','when'].includes(w)))];
  const numericTokens=x=>(String(x).match(/[-+]?(?:\d+(?:\.\d*)?|\.\d+)/g)||[]).map(Number);
  return q.markPoints.map(point=>{
   let bestScore=0,best='',bestOverlap=0,bestSameNumber=false,bestRank=-1;
   const pt=terms(point),pn=numericTokens(point);
   for(const line of lines){
    if(possiblyIncorrectArithmetic(line))continue;
    const score=typeof markPointPrediction==='function'?markPointPrediction(line,point):0;
    const lt=terms(line),ln=numericTokens(line);
    const overlap=pt.filter(w=>lt.includes(w)).length;
    const finalExpected=pn.length?pn[pn.length-1]:NaN;
    const sameNumber=Number.isFinite(finalExpected)&&ln.some(b=>Number.isFinite(b)&&Math.abs(finalExpected-b)<=Math.max(Math.abs(finalExpected)*.008,.005));
    const rank=score+.07*Math.min(3,overlap)+(sameNumber?.35:0);
    if(rank>bestRank){bestRank=rank;bestScore=score;bestOverlap=overlap;bestSameNumber=sameNumber;best=line}
   }
   const strong=bestScore>=.74||(bestOverlap>=1&&bestSameNumber&&bestScore>=.20)||(bestOverlap>=2&&bestScore>=.55);
   return {line:strong?best:'',similarity:bestScore,strong};
  });
 } function candidateQuality(result,mode){
  const txt=String(result?.data?.text||'').trim();
  const confidence=Number.isFinite(result?.data?.confidence)?result.data.confidence:0;
  const useful=(txt.match(/[a-zA-Z0-9+\-*/=().^]/g)||[]).length;
  const garbage=(txt.match(/[|~_+'{}\[\]]/g)||[]).length;
  return confidence+Math.min(15,Math.log2(1+useful)*2)-Math.min(12,garbage*1.5)+(mode==='normal'?1:0);
 }
 async function readWriting(id){
  if(id!==currentId||!pages.length||ocrBusy)return {ok:false,error:'Already reading a photograph'};
  const version=++ocrRunNumber,snapshot=[...pages];
  const selected=byId('scanOCRMode')?.value||'auto';
  ocrBusy=true;const button=byId('scanRecognize');if(button)button.disabled=true;
  let worker=null;
  try{
   status('Preparing handwriting recognition on this device. Several pages can take a while…');
   const tesseract=await loadOCR();
   if(currentId!==id||version!==ocrRunNumber)return {ok:false,error:'Question changed'};
   worker=await tesseract.createWorker('eng',1,{logger:m=>{
    if(currentId===id&&m?.status==='recognizing text')status('Reading handwriting locally… '+Math.round((m.progress||0)*100)+'%');
   }});
   if(currentId!==id||version!==ocrRunNumber)return {ok:false,error:'Question changed'};
   const chunks=[],confidences=[],modesUsed=[];
   for(let i=0;i<snapshot.length;i++){
    if(currentId!==id||version!==ocrRunNumber)return {ok:false,error:'Question changed'};
    const candidates=selected==='auto'?['contrast','normal']:[selected];
    let best=null;
    for(const mode of candidates){
     status('Page '+(i+1)+'/'+snapshot.length+': trying '+(mode==='normal'?'original photo':mode)+'…');
     await worker.setParameters({tessedit_pageseg_mode:'6',preserve_interword_spaces:'1'});
     const input=await textImageForOCR(snapshot[i],mode);
     if(currentId!==id||version!==ocrRunNumber)return {ok:false,error:'Question changed'};
     const result=await worker.recognize(input);
     if(currentId!==id||version!==ocrRunNumber)return {ok:false,error:'Question changed'};
     const item={result,mode,quality:candidateQuality(result,mode)};
     if(!best||item.quality>best.quality)best=item;
    }
    if(selected==='auto'&&(!best||best.result.data.confidence<57||String(best.result.data.text||'').trim().length<5)){
     status('Page '+(i+1)+'/'+snapshot.length+': trying high-contrast fallback…');
     try{
      await worker.setParameters({tessedit_pageseg_mode:'11',preserve_interword_spaces:'1'});
      const input=await textImageForOCR(snapshot[i],'binary');
      const result=await worker.recognize(input);
      if(currentId!==id||version!==ocrRunNumber)return {ok:false,error:'Question changed'};
      const item={result,mode:'binary',quality:candidateQuality(result,'binary')};
      if(!best||item.quality>best.quality)best=item;
     }catch(error){console.warn('Optional OCR fallback failed',error)}
    }
    if(!best)throw new Error('No recognition result was produced.');
    chunks.push(String(best.result.data.text||'').trim());
    if(Number.isFinite(best.result.data.confidence))confidences.push(best.result.data.confidence);
    modesUsed.push(best.mode);
   }
   const content=chunks.map((x,i)=>'Page '+(i+1)+'\n'+x).join('\n\n').trim();
   if(!chunks.some(x=>x.length>=2))throw new Error('No readable writing detected. Crop closer to the answer or enter your working manually.');
   ocrText=content;ocrApplied=false;lastOCRStatus='success';
   ocrConfidence=confidences.length?confidences.reduce((a,b)=>a+b,0)/confidences.length:null;
   showOCR(content,ocrConfidence);
   status((ocrConfidence!==null&&ocrConfidence<60?'Recognition is uncertain. Check every calculation and sign. ':'Writing extracted. Check the equations before accepting a mark. ')+modesUsed.map((m,i)=>'Page '+(i+1)+': '+m).join('; '));
   await persist();
   return {ok:true,text:content,confidence:ocrConfidence,modes:modesUsed};
  }catch(err){
   lastOCRStatus='failed';
   if(id===currentId)status(err.message||'Photo recognition failed; your photo remains attached.',true);
   return {ok:false,error:err.message||'Handwriting recognition failed'};
  }finally{
   try{await worker?.terminate()}catch{}
   ocrBusy=false;if(button&&id===currentId)button.disabled=pages.length===0;
  }
 }
 function applyRecognized(id,triggerMark=true){
  if(id!==currentId)return;
  const field=byId('scanTranscript'),answer=byId('examAnswer');
  if(!field||!answer)return;
  const text=field.value.trim();
  if(text.length<2){status('No recognised working to mark. Type or correct the text first.',true);return false}
  ocrText=text;ocrApplied=true;
  // Do not overwrite the user's existing typed answer.
  const cleanOCR=text.replace(/^Page\s+\d+\s*$/gm,'').trim();
  // Replace earlier OCR content rather than append stale or duplicated text.
  let prior=answer.value;
  if(appliedText&&prior.includes(appliedText))prior=prior.replace(appliedText,'').trim();
  answer.value=prior?(prior.includes(cleanOCR)?prior:prior+'\n\n'+cleanOCR):cleanOCR;
  appliedText=cleanOCR;
  answer.dispatchEvent(new Event('input',{bubbles:true}));
  persist();
  if(triggerMark)byId('markExam')?.click();
  status('Suggested marks use this transcription. Review every method mark before saving.');
  return true;
 }
 async function prepareForMark(id){
  if(id!==currentId)return {ready:false,message:'The question changed. Please try again.'};
  if(!pages.length)return {ready:true,source:'typed'};
  if(ocrBusy)return {ready:false,message:'The photo is still being read. Wait for it to finish.'};
  const transcript=byId('scanTranscript');
  // If the student has edited a transcription, use that version, not the stale OCR.
  if(transcript&&!byId('scanOCR')?.hidden&&transcript.value.trim().length>1&&!ocrApplied){
   applyRecognized(id,false);
   return {ready:true,source:'photograph',confidence:ocrConfidence};
  }
  if(hasRecognizedMarking(id))return {ready:true,source:'photograph',confidence:ocrConfidence};
  if(ocrText.length>1&&transcript?.value.trim().length>1){
   applyRecognized(id,false);return {ready:true,source:'photograph',confidence:ocrConfidence};
  }
  const result=await readWriting(id);
  if(id!==currentId)return {ready:false,message:'The question changed before recognition finished.'};
  if(!result?.ok){
   return {ready:false,message:'Your photograph could not be read confidently. Retake it, choose another image mode, or tap Enter working manually. No mark has been recorded.'};
  }
  if(!transcript?.value.trim()){
   return {ready:false,message:'The reader did not extract a usable answer. Enter or correct the working before marking.'};
  }
  if(result.confidence!==null&&result.confidence<35){
   status('Recognition confidence is low. Check the transcription first, especially maths symbols, and tap Mark transcribed working.',true);
   return {ready:false,message:'The photo is difficult to read. I have shown the extracted text so you can correct it before marking. No mark has been recorded.'};
  }
  applyRecognized(id,false);
  return {ready:true,source:'photograph',confidence:result.confidence};
 }
 function hasRecognizedMarking(id){return currentId===id&&ocrApplied&&Boolean(ocrText.trim())}

 function render(){
  const holder=byId('scanPages');if(!holder)return;
  const count=byId('scanCount');if(count)count.textContent=pages.length+' / '+MAX+' pages';
  const reader=byId('scanRecognize');if(reader&&!ocrBusy)reader.disabled=pages.length===0;
  holder.innerHTML=pages.map((src,i)=>'<figure class="scan-page"><img src="'+src+'" alt="Your written answer, page '+(i+1)+'"><figcaption><span>Page '+(i+1)+'</span><button type="button" data-turn="'+i+'">Rotate</button><button type="button" data-zoom="'+i+'">Enlarge</button><button type="button" data-remove="'+i+'">Remove</button></figcaption></figure>').join('');
  const id=currentId;
  holder.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{if(id!==currentId)return;pages.splice(+b.dataset.remove,1);resetOCR();render();persist()});
  holder.querySelectorAll('[data-turn]').forEach(b=>b.onclick=async()=>{if(id!==currentId||busy)return;busy=true;
   try{const at=+b.dataset.turn,value=await rotate(pages[at]);if(id!==currentId)return;pages[at]=value;resetOCR();render();await persist()}
   catch(e){status(e.message,true)}finally{busy=false}});
  holder.querySelectorAll('[data-zoom]').forEach(b=>b.onclick=()=>{
   const src=pages[+b.dataset.zoom],view=byId('scanZoom');if(!src||!view)return;
   view.innerHTML='<button type="button" id="scanZoomClose">Close image ✕</button><img alt="Enlarged handwritten working" src="'+src+'">';
   view.hidden=false;byId('scanZoomClose').onclick=hideZoom;
  });
 }
 async function add(files,id){
  if(id!==currentId||busy)return;busy=true;let errors=[],warnings=[];
  try{
   for(const f of Array.from(files).slice(0,Math.max(0,MAX-pages.length))){
    try{const src=await decode(f);if(id!==currentId)return;pages.push(src);
     const warning=await imageQuality(src);if(warning&&id===currentId)warnings.push(warning)}catch(e){errors.push(e.message)}
   }
   if(id!==currentId)return;
   resetOCR();render();await persist();
   if(errors.length)status(errors.join(' '),true);
   else if(warnings.length)status(warnings.join(' '),true);
   else if(pages.length===MAX)status('Five pages attached. Remove one to add another.');
  }finally{busy=false}
 }
 async function restore(id,version){
  let saved;
  try{saved=await read(id)}catch(e){if(currentId===id)status('Browser storage unavailable; photos can still be used until you leave this question.',true);return}
  if(currentId!==id||sequence!==version||!saved?.images?.length)return;
  if(saved.status==='draft'){
   if(pages.length)return; // Never replace a newly scanned page with an older asynchronous draft.
   pages=saved.images.slice(0,MAX);render();if(saved.recognized){ocrText=saved.recognized;showOCR(ocrText,null)}status('Recovered '+pages.length+' unfinished page(s) from this browser.');
  }else{
   const prior=byId('scanPrevious');if(!prior)return;
   prior.hidden=false;prior.innerHTML='<summary>View last saved answer photos ('+saved.images.length+')</summary><div class="scan-history">'+saved.images.map((img,i)=>'<img alt="Previous attempt page '+(i+1)+'" src="'+img+'">').join('')+'</div><small>Older working is for reference only, not a new submission.</small><button type="button" id="scanDeleteHistory">Delete saved photos</button>';
   document.getElementById('scanDeleteHistory').onclick=async()=>{try{await write(id,[],'marked');prior.hidden=true;prior.innerHTML='';status('Saved answer photographs deleted from this browser.')}catch(e){status('Could not delete saved photos: '+e.message,true)}};
  }
 }
 function mount(id){
  const area=byId('examAnswer');if(!area)return;
  currentId=id;pages=[];ocrText='';ocrApplied=false;ocrConfidence=null;const version=++sequence;++ocrRunNumber;
  area.insertAdjacentHTML('afterend',`<section class="scan-control"><div class="scan-heading"><strong>Photograph your working</strong><span id="scanCount">0 / 5 pages</span></div><p>Write on paper, then take a photo or upload pages. Available on every exam question, including Mock.</p><div class="scan-buttons"><button type="button" id="scanTake">Take photo</button><button type="button" id="scanChoose">Upload image(s)</button><button type="button" id="scanRecognize" disabled>Read photo again</button></div><div class="scan-ocr-options"><label for="scanOCRMode">Image reading mode</label><select id="scanOCRMode"><option value="auto">Automatic (recommended)</option><option value="contrast">Enhanced contrast</option><option value="binary">Black and white</option><option value="normal">Original photograph</option></select><button type="button" id="scanManual">Enter working manually</button></div><input id="scanCameraInput" type="file" accept="image/*" capture="environment" hidden><input id="scanChooseInput" type="file" accept="image/*" multiple hidden><div id="scanStatus" role="status" aria-live="polite">Images stay on this browser, not on a server.</div><div id="scanPages" class="scan-pages"></div><section id="scanOCR" class="scan-ocr" hidden><label for="scanTranscript"><strong>Recognised writing — check and correct</strong></label><p>Recognition can misread handwriting, algebra, fractions or signs. Correct the text below before marking, including every method step.</p><textarea id="scanTranscript" rows="8" spellcheck="false" placeholder="Your recognised working will appear here."></textarea><small id="scanOCRHint"></small><button type="button" id="scanApply">Mark transcribed working</button></section><details id="scanPrevious" hidden></details><p class="scan-explainer">Tap <b>Mark my answer</b>. If you have attached a photograph, it will be read automatically before suggesting a mark. You can correct the recognised working and recalculate your marks. Photos that cannot be read are not automatically given zero.</p></section><div id="scanZoom" class="scan-zoom" role="dialog" aria-label="Enlarged answer photo" hidden></div>`);
  byId('scanTake').onclick=()=>byId('scanCameraInput').click();
  byId('scanChoose').onclick=()=>byId('scanChooseInput').click();
  byId('scanRecognize').onclick=()=>readWriting(id);
  byId('scanApply').onclick=()=>applyRecognized(id);
  byId('scanManual').onclick=()=>{
   showOCR(byId('scanTranscript')?.value||'',null);
   status('Type your steps into the transcription box, then tap Mark transcribed working.');
  };
  byId('scanTranscript').oninput=()=>{ocrApplied=false;lastOCRStatus='edited'};
  const take=byId('scanCameraInput'),choose=byId('scanChooseInput');
  take.onchange=()=>{add(take.files,id);take.value=''};
  choose.onchange=()=>{add(choose.files,id);choose.value=''};
  byId('scanZoom').onclick=e=>{if(e.target.id==='scanZoom')hideZoom()};
  render();restore(id,version);
 }
 function commit(id){if(currentId===id&&pages.length)persist('marked')}
 function countFor(id){return currentId===id?pages.length:0}
 function usedOCR(id){return hasRecognizedMarking(id)}
 window.RevisionScan={mount,commit,countFor,usedOCR,reviewEvidence,prepareForMark};
})();