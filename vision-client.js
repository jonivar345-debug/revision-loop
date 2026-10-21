/* Opt-in image-based marking: photographs are sent only when the student
   explicitly chooses AI marking. The OpenAI API key never reaches this page. */
(function(){
 'use strict';
 let question=null,visionResult=null,inFlight=false;
 const $=id=>document.getElementById(id);
 const STORAGE='revisionloop-vision-session';
 function readConfig(){
  try{return JSON.parse(sessionStorage.getItem(STORAGE)||'null')||{}}catch{return {}}
 }
 function saveConfig(data){
  try{sessionStorage.setItem(STORAGE,JSON.stringify(data));return true}catch{return false}
 }
 function allowedEndpoint(text){
  try{
   const u=new URL(String(text||'').trim());
   return u.protocol==='https:'&&u.hostname.endsWith('.vercel.app')&&
    u.pathname==='/api/vision-mark'&&!u.username&&!u.password&&!u.search&&!u.hash&&!u.port;
  }catch{return false}
 }
 function invalidate(){visionResult=null}
 function resultFor(id){return question?.id===id?visionResult:null}
 function status(message,error=false){
  const box=$('scanVisionStatus');if(!box)return;
  box.textContent=message;box.classList.toggle('scan-error',error);
 }
 function photoForAI(src){
  // Smaller data URL for a personal, capped serverless API.
  return new Promise((resolve,reject)=>{
   const img=new Image();
   img.onload=()=>{
    try{
     const limit=1900,scale=Math.min(1,limit/Math.max(img.naturalWidth,img.naturalHeight));
     const cv=document.createElement('canvas');
     cv.width=Math.max(1,Math.round(img.naturalWidth*scale));
     cv.height=Math.max(1,Math.round(img.naturalHeight*scale));
     const ctx=cv.getContext('2d');
     if(!ctx)throw Error('Photo processing is unavailable.');
     ctx.fillStyle='#fff';ctx.fillRect(0,0,cv.width,cv.height);
     ctx.drawImage(img,0,0,cv.width,cv.height);
     let data=cv.toDataURL('image/jpeg',.83);
     if(data.length>2_400_000)data=cv.toDataURL('image/jpeg',.66);
     if(data.length>2_500_000)throw Error('This image is too large. Crop around the writing first.');
     resolve(data);
    }catch(e){reject(e)}
   };
   img.onerror=()=>reject(new Error('Could not read the photograph.'));
   img.src=src;
  });
 }
 async function markFromPhotos(){
  if(inFlight||!question)return;
  const q=question,config=readConfig();
  if(!allowedEndpoint(config.url)||!config.passphrase||config.passphrase.length<24){
   $('scanVisionConfig').open=true;
   status('AI is not connected. Add your private Vercel endpoint and access passphrase first.',true);
   return;
  }
  const photos=window.RevisionScan?.getPages(q.id)||[];
  if(!photos.length){status('Take a photo of your working first.',true);return}
  if(photos.length>3){status('For AI marking, keep at most three pages. Remove or combine the others first.',true);return}
  inFlight=true;invalidate();
  const btn=$('scanVisionMark');if(btn){btn.disabled=true;btn.textContent='Analysing working…'}
  try{
   status('Sending photos securely to your configured vision service for provisional marking…');
   const images=await Promise.all(photos.map(photoForAI));
   if(question?.id!==q.id)return;
   const abort=new AbortController(),timeout=setTimeout(()=>abort.abort(),43000);
   let response;
   try{
    response=await fetch(config.url,{
     method:'POST',mode:'cors',cache:'no-store',credentials:'omit',
     headers:{'Content-Type':'application/json','Authorization':'Bearer '+config.passphrase},
     body:JSON.stringify({question:{
      id:q.id,subject:q.subject,prompt:q.prompt,marks:q.marks,
      markPoints:q.markPoints,markPointMarks:q.markPointMarks||q.markPoints.map(()=>1)
     },images}),signal:abort.signal
    });
   }finally{clearTimeout(timeout)}
   const reply=await response.json().catch(()=>({error:'The service did not return valid JSON.'}));
   if(!response.ok)throw Error(reply.error||'The vision service could not mark this answer.');
   if(!Array.isArray(reply.marking)||reply.marking.length!==q.markPoints.length ||
      reply.questionId!==q.id)throw Error('Incomplete marking response. Nothing has been saved.');
   if(question?.id!==q.id)return;
   visionResult=reply;
   window.RevisionScan?.useVisionText(q.id,reply.transcription||'');
   status('Vision produced a provisional '+reply.score+'/'+reply.maxMarks+
    ' suggestion. Review the photograph, transcription and every marking point before saving.'+
    (reply.uncertain?' Some handwriting was uncertain.':''));
   $('markExam')?.click();
  }catch(err){
   if(question?.id===q.id)status(err.name==='AbortError'?'Vision service timed out. Try fewer pages or local OCR.':err.message,true);
  }finally{
   inFlight=false;const current=$('scanVisionMark');
   if(current){current.disabled=false;current.textContent='Mark photographed working with AI'}
  }
 }
 function mount(q){
  question=q;visionResult=null;inFlight=false;
  const host=$('scanOCR');if(!host)return;
  const outer=document.createElement('section');
  outer.className='scan-vision';
  outer.innerHTML=
   '<div class="scan-vision-title"><strong>AI handwriting & method marking</strong><span>Optional</span></div>'+
   '<p>AI can interpret your photograph directly, including calculations and diagrams. You must check the suggested marks. Photos go to your configured private service and its AI provider only when you press the AI button.</p>'+
   '<button type="button" id="scanVisionMark" class="scan-vision-action">Mark photographed working with AI</button>'+
   '<div id="scanVisionStatus" role="status" aria-live="polite">Not connected yet. Local photo marking still works.</div>'+
   '<details id="scanVisionConfig"><summary>Connect private AI marking service</summary>'+
   '<p>Keep your AI provider key on the server. Enter only your private Vercel function address and separate access passphrase here. Do not use the public four-digit website PIN.</p>'+
   '<label for="scanVisionUrl">Vercel API URL</label>'+
   '<input id="scanVisionUrl" type="url" autocomplete="url" spellcheck="false" placeholder="https://your-project.vercel.app/api/vision-mark">'+
   '<label for="scanVisionPass">Private access passphrase (24+ characters)</label>'+
   '<input id="scanVisionPass" type="password" autocomplete="off" minlength="24" placeholder="Separate private passphrase">'+
   '<div class="scan-vision-actions"><button type="button" id="scanVisionSave">Use these settings in this tab</button>'+
   '<button type="button" id="scanVisionForget">Forget saved settings</button></div>'+
   '<small>Stored only for this browser tab. The AI provider may charge per image request. No request is made until you press Mark photographed working with AI.</small>'+
   '</details>';
  host.insertAdjacentElement('beforebegin',outer);
  const saved=readConfig();
  $('scanVisionUrl').value=saved.url||'';
  $('scanVisionPass').value=saved.passphrase||'';
  $('scanVisionSave').onclick=()=>{
   const url=$('scanVisionUrl').value.trim(),passphrase=$('scanVisionPass').value;
   if(!allowedEndpoint(url)){status('Use a full HTTPS *.vercel.app/api/vision-mark address.',true);return}
   if(passphrase.length<24){status('Use a separate strong passphrase of at least 24 characters.',true);return}
   if(!saveConfig({url,passphrase})){status('This browser does not allow session storage. AI connection will not persist.',true);return}
   $('scanVisionConfig').open=false;
   status('Private connection details saved for this tab. Photos have not been sent.');
  };
  $('scanVisionForget').onclick=()=>{
   try{sessionStorage.removeItem(STORAGE)}catch{}
   $('scanVisionUrl').value='';$('scanVisionPass').value='';invalidate();
   status('Private AI connection details cleared.');
  };
  $('scanVisionMark').onclick=markFromPhotos;
  if(allowedEndpoint(saved.url)&&saved.passphrase?.length>=24)
   status('Private AI settings available. Nothing is transmitted until you request AI marking.');
 }
 window.RevisionVision={mount,resultFor,invalidate,markFromPhotos,allowedEndpoint};
})();