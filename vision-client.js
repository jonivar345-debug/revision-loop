/* Opt-in image-based marking: photographs are sent only when the student
   explicitly chooses AI marking. The OpenAI API key never reaches this page. */
(function(){
 'use strict';
 let question=null,visionResult=null,inFlight=false;
 const $=id=>document.getElementById(id);
 const STORAGE='revisionloop-vision-session';
 const DEVICE_STORAGE='revisionloop-vision-device-v1';
 const DAY=24*60*60*1000;
 const YEAR=365*DAY;
 const RENEW_WHEN_LESS_THAN=90*DAY;
 let renewalPromise=null,accessGeneration=0;
 const DEFAULT_API='https://revision-loop-jonivar345-5189.vercel.app/api/vision-mark';
 function forgetDevice(){
  accessGeneration++;
  try{localStorage.removeItem(DEVICE_STORAGE)}catch{}
 }
 function readDevice(){
  try{
   const data=JSON.parse(localStorage.getItem(DEVICE_STORAGE)||'null');
   const now=Date.now(),maxExpiry=now+YEAR+60_000;
   if(data&&typeof data.token==='string'&&/^rl1\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(data.token)&&
      Number.isSafeInteger(data.expiresAt)&&data.expiresAt>now&&data.expiresAt<=maxExpiry)return data;
   if(data)forgetDevice();
  }catch{}
  return null;
 }
 async function renewRememberedDevice(){
  const device=readDevice();
  if(!device||device.expiresAt-Date.now()>RENEW_WHEN_LESS_THAN)return false;
  if(renewalPromise)return renewalPromise;
  const generation=accessGeneration;
  renewalPromise=(async()=>{
   try{
    // No photos or questions are sent, and this never invokes the paid AI.
    const response=await fetch(DEFAULT_API,{
     method:'POST',mode:'cors',cache:'no-store',credentials:'omit',
     headers:{'Content-Type':'application/json','Authorization':'Bearer '+device.token},
     body:JSON.stringify({action:'renew-device'})
    });
    if(response.status===401||response.status===403){
     if(generation===accessGeneration)forgetDevice();
     return false;
    }
    if(!response.ok)return false;
    const data=await response.json().catch(()=>({}));
    if(typeof data.token!=='string'||!/^rl1\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(data.token)||
       !Number.isSafeInteger(data.expiresAt)||data.expiresAt<=Date.now()||
       data.expiresAt>Date.now()+YEAR+60_000)return false;
    if(generation!==accessGeneration)return false;
    // A second tab might have refreshed already: do not overwrite its newer token.
    const latest=readDevice();
    if(!latest||latest.token!==device.token)return false;
    try{localStorage.setItem(DEVICE_STORAGE,JSON.stringify({token:data.token,expiresAt:data.expiresAt}));return true}
    catch{return false}
   }catch{return false}
  })();
  try{return await renewalPromise}finally{renewalPromise=null}
 }
  function readConfig(){
  // Only an expiring, scoped session is saved between browser restarts.
  // The long-lived master passphrase stays in tab-specific storage.
  let session={};
  try{session=JSON.parse(sessionStorage.getItem(STORAGE)||'null')||{}}catch{}
  const device=readDevice();
  return {url:DEFAULT_API,passphrase:session.passphrase||device?.token||'',
   remembered:!!device,expiresAt:device?.expiresAt||null};
 }
 function saveTab(data){
  try{sessionStorage.setItem(STORAGE,JSON.stringify(data));return true}catch{return false}
 }
 function clearTab(){
  try{sessionStorage.removeItem(STORAGE)}catch{}
 }
 async function rememberDevice(master){
  const reply=await fetch(DEFAULT_API,{
   method:'POST',mode:'cors',cache:'no-store',credentials:'omit',
   headers:{'Content-Type':'application/json','Authorization':'Bearer '+master},
   body:JSON.stringify({action:'remember-device'})
  });
  const data=await reply.json().catch(()=>({}));
  if(!reply.ok)throw Error(data.error||'Could not remember this device.');
  if(typeof data.token!=='string'||!/^rl1\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(data.token)||
     !Number.isSafeInteger(data.expiresAt)||data.expiresAt<=Date.now())
    throw Error('The server did not return a valid device session.');
  try{
   localStorage.setItem(DEVICE_STORAGE,JSON.stringify({token:data.token,expiresAt:data.expiresAt}));
   if(!readDevice())throw Error('Saved device session could not be read.');
  }catch{forgetDevice();throw Error('This browser cannot remember the device. Try ordinary tab-only access.')}
  clearTab();
  return data.expiresAt;
 }

 function allowedEndpoint(text){
  try{
   const u=new URL(String(text||'').trim());
   return u.href===DEFAULT_API;
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
 async function testPrivateConnection(){
  await renewRememberedDevice();
  const config=readConfig();
  if(!config.passphrase||config.passphrase.length<24){
   const details=$('scanVisionConfig');if(details)details.open=true;
   status('Save your private access passphrase first, then test the connection.',true);
   return;
  }
  const button=$('scanVisionTest');if(button){button.disabled=true;button.textContent='Checking connection…'}
  try{
   status('Checking your private backend credentials. No photograph is sent and no AI call is made.');
   const response=await fetch(DEFAULT_API,{
    method:'POST',mode:'cors',cache:'no-store',credentials:'omit',
    headers:{'Content-Type':'application/json','Authorization':'Bearer '+config.passphrase},
    // Valid authentication, deliberately invalid question: fails before any billed AI request.
    body:'{}'
   });
   const data=await response.json().catch(()=>({}));
   if(response.status===400&&data.error==='Question information is required.'){
    status('Private passphrase accepted. Checking the AI account and model without submitting a photograph…');
    const provider=await fetch(DEFAULT_API,{
     method:'POST',mode:'cors',cache:'no-store',credentials:'omit',
     headers:{'Content-Type':'application/json','Authorization':'Bearer '+config.passphrase},
     body:JSON.stringify({action:'check-provider'})
    });
    const checked=await provider.json().catch(()=>({}));
    if(provider.ok&&checked.providerReady){
     status('AI account and model access verified. This test is free. You can now try marking a photograph (which may incur an API charge).');
    }else{
     status('Private passphrase works, but the AI account check failed: '+String(checked.error||'Please review the server API configuration.').slice(0,240)+
      (checked.providerCode?' (Code: '+checked.providerCode+')':''),true);
    }
   } else if(response.status===401){
    if(config.remembered){forgetDevice();clearTab()}
    status('The private access has expired or was changed. Enter your original passphrase once to reconnect this device.',true);
   }
   else if(response.status===503)status('The backend is missing API credentials; check Vercel Production environment variables and redeploy.',true);
   else status('Connection check did not finish: HTTP '+response.status+'. '+String(data.error||'Try again later.').slice(0,120),true);
  }catch(e){
   status('Could not contact the private service: '+(e.message||'Network error'),true);
  }finally{
   if(button){button.disabled=false;button.textContent='Check AI account (no charge)'}
  }
 }
 async function markFromPhotos(){
  if(inFlight||!question)return;
  await renewRememberedDevice();
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
      markPoints:q.markPoints,markPointMarks:q.markPointMarks||q.markPoints.map(()=>1),markingMode:q.markingMode||null
     },images}),signal:abort.signal
    });
   }finally{clearTimeout(timeout)}
   const reply=await response.json().catch(()=>({error:'The service did not return valid JSON.'}));
   if(response.status===401&&config.remembered){
    forgetDevice();clearTab();
    throw Error('Remembered access expired or was revoked. Enter your original passphrase again to reconnect.');
   }
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
   '<div id="scanVisionStatus" role="status" aria-live="polite">The private AI backend is deployed. Save your separate access passphrase and test the connection before marking. Local photo marking still works.</div>'+
   '<details id="scanVisionConfig"><summary>Connect private AI marking service</summary>'+
   '<p>Your backend address is filled in automatically. Enter only the separate private passphrase you saved as VISION_ACCESS_TOKEN in Vercel. Never enter or share your OpenAI API key here, and do not use the four-digit website PIN.</p>'+
   '<label for="scanVisionUrl">Private backend (connected automatically)</label>'+
   '<input id="scanVisionUrl" type="url" autocomplete="off" readonly spellcheck="false">'+
   '<label for="scanVisionPass">Private access passphrase (24+ characters)</label>'+
   '<input id="scanVisionPass" type="password" autocomplete="off" minlength="24" placeholder="Separate private passphrase">'+
   '<label class="scan-vision-remember"><input type="checkbox" id="scanVisionRemember"> Remember until I sign out</label>'+
   '<small>Only enable this on your own phone or computer. A private session is renewed automatically while you use the site, without storing your original passphrase. If unused for over a year, or you clear browser data or rotate your Vercel passphrase, you will need to sign in again.</small>'+
   '<div class="scan-vision-actions"><button type="button" id="scanVisionSave">Save private connection</button><button type="button" id="scanVisionTest">Test connection (no AI charge)</button>'+
   '<button type="button" id="scanVisionForget">Forget this device</button></div>'+
   '<small>Without Remember, access lasts for this tab only. AI requests may incur charges; photos are sent only when you press Mark photographed working with AI.</small>'+
   '</details>';
  host.insertAdjacentElement('beforebegin',outer);
  const saved=readConfig();
  $('scanVisionUrl').value=saved.url||'';
  $('scanVisionPass').value=saved.remembered?'':(saved.passphrase||'');
  $('scanVisionRemember').checked=saved.remembered;
  $('scanVisionSave').onclick=async()=>{
   const passphrase=$('scanVisionPass').value.trim(),remember=$('scanVisionRemember').checked;
   const button=$('scanVisionSave');
   if(remember&&!passphrase&&readDevice()){
    $('scanVisionConfig').open=false;
    status('This device is remembered and renews access automatically when you return.');
    return;
   }
   if(passphrase.length<24){
    status('Enter your separate private passphrase (at least 24 characters).',true);return
   }
   button.disabled=true;button.textContent='Saving private access…';
   try{
    if(remember){
     const expires=await rememberDevice(passphrase);
     $('scanVisionPass').value='';
     $('scanVisionConfig').open=false;
     status('This device is remembered. Access renews automatically while you keep using Revision Loop. Use Forget this device whenever you wish.');
    }else{
     forgetDevice();
     if(!saveTab({url:DEFAULT_API,passphrase}))
      throw Error('This browser cannot store the tab-only access.');
     $('scanVisionPass').value='';
     $('scanVisionConfig').open=false;
     status('Private access saved for this tab. Press Check AI account to verify access without an AI charge.');
    }
   }catch(err){status(err.message||'Could not save private access.',true)}
   finally{button.disabled=false;button.textContent='Save private connection'}
  };
  $('scanVisionForget').onclick=()=>{
   forgetDevice();clearTab();
   $('scanVisionRemember').checked=false;
   $('scanVisionUrl').value=DEFAULT_API;$('scanVisionPass').value='';invalidate();
   status('This device has been forgotten. Your passphrase will be needed to reconnect.');
  };
  $('scanVisionTest').onclick=testPrivateConnection;
  $('scanVisionMark').onclick=markFromPhotos;
  if(saved.remembered)
   status('Device remembered. Access renews automatically while you use Revision Loop. No password needed for AI marking.');
  else if(allowedEndpoint(saved.url)&&saved.passphrase?.length>=24)
   status('Private AI access is saved for this tab. Tick Remember on this device if you want to stay connected.');
  if(saved.remembered){
   // Existing 30-day sessions are silently upgraded to rolling one-year sessions.
   void renewRememberedDevice().then(refreshed=>{
    if(refreshed&&question?.id===q.id)
     status('Remembered access renewed automatically. You remain signed in on this device.');
   });
  }
 }
 window.RevisionVision={mount,resultFor,invalidate,markFromPhotos,allowedEndpoint,testPrivateConnection};
})();