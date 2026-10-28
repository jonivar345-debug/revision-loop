/* Free-first marking bridge: no paid API calls, no uploaded photos.
   Optional local handwriting experiment downloads model weights only on request. */
(function(){
 'use strict';
 const $=id=>document.getElementById(id);
 let activeQuestion=null,handwritingPipePromise=null;
 const CHATGPT_URL='https://chatgpt.com/';
 const HANDWRITING_MODEL='Xenova/trocr-small-handwritten';
 const TRANSFORMERS_URL='https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1';
 function markingPrompt(q){
  if(!q||!Array.isArray(q.markPoints))return '';
  const list=q.markPoints.map((point,i)=>{
   const weight=q.markingMode==='anyN'?1:(q.markPointMarks?.[i]??1);
   const accepted=q.markPointAcceptedAlternatives?.[i];
   return (i+1)+'. ['+weight+' mark'+(weight===1?'':'s')+'] '+point+
    (Array.isArray(accepted)&&accepted.length?'\n   Also accept: '+accepted.join(' OR '):'');
  }).join('\n');
  return [
   'Please act as a careful AQA '+(q.level||'AS/A-level')+' '+q.subject+' examiner for REVISION ONLY.',
   'I will attach a PHOTO of my handwritten answer in this chat. Do not claim you can see a photograph unless one is attached.',
   'Question: '+q.prompt,
   'Maximum marks: '+q.marks+'.',
   'Mark-scheme criteria (numbered in order):',
   list,
   q.markingMode==='anyN'?'Any '+q.marks+' distinct accepted points can score, capped at '+q.marks+'.':'Award each criterion its given marks when supported.',
   'Read all steps, including calculations, equations and sketches. Accept equivalent correct reasoning, error carried forward where appropriate, and alternative wording. Do not reward a result that was not actually written.',
   q.ecfGuidance?'Carry forward method-review guidance: '+q.ecfGuidance:'',
   'The listed alternatives are examples, not an exhaustive list. Award different valid reasoning only where supported by visible working.',
   'Award full credit when the correct answer is sufficient for that criterion. For distinct requested explanations or demonstrations, look for evidence.',
   'If handwriting is ambiguous, tell me and do not invent working. Do not assume a machine OCR transcript is accurate.',
   'First give a SHORT reason for each awarded or missed marking point. Then end with exactly this format:',
   'POINTS: '+q.markPoints.map(()=> '0').join(','),
   'Replace each 0 with 1 if that numbered marking point was earned, otherwise leave 0. There must be exactly '+q.markPoints.length+' entries.',
   'I will copy that POINTS line into Revision Loop to review it before saving any marks.'
  ].join('\n\n');
 }
 function parsePoints(raw,n){
  const text=String(raw||'').trim();
  const match=text.match(/(?:^|\n)\s*POINTS\s*:\s*([01\s,;\[\]]+)(?=\n|$)/i);
  const body=match?match[1]:/^[\s,;\[\]01]+$/.test(text)?text:'';
  if(!body)throw Error('Paste the POINTS: 1,0,1… line ChatGPT gives you.');
  const clean=body.replace(/[\[\]\s]/g,'').replace(/;/g,',');
  const items=clean.split(',');
  if(items.length!==n||items.some(v=>v!=='0'&&v!=='1'))
   throw Error('Expected '+n+' separate 0 or 1 entries, in the same order as the marking criteria.');
  return items.map(v=>v==='1');
 }
 function freeStatus(message,error=false){
  const e=$('freeMarkStatus');if(!e)return;
  e.textContent=message;e.classList.toggle('scan-error',error);
 }
 async function copyPrompt(){
  if(!activeQuestion)return;
  const text=markingPrompt(activeQuestion),area=$('freeMarkPrompt');
  if(area){area.hidden=false;area.value=text}
  try{
   if(!navigator.clipboard?.writeText)throw Error('Clipboard permission unavailable');
   await navigator.clipboard.writeText(text);
   freeStatus('Marking instructions copied. Open ChatGPT, attach your answer photo yourself, and paste these instructions.');
  }catch{
   if(area?.select)area.select();
   freeStatus('Select and copy the instructions in the box, then open ChatGPT and attach the photo there.');
  }
 }
 function applyChatGPTResult(){
  const q=activeQuestion;if(!q)return;
  const note=$('freeMarkReport');
  try{
   const awarded=parsePoints(note?.value,q.markPoints.length);
   if(!window.RevisionVision?.importReviewedPoints(q,awarded))
    throw Error('Unable to prepare the suggested marks for review.');
   freeStatus('Suggested marks imported locally. Review each tick against your working before saving.');
   const result=$('markExam');
   if(result)result.click();
  }catch(e){freeStatus(e.message||'Could not read the points.',true)}
 }
 function localAiStatus(message,error=false){
  const node=$('freeHandwritingStatus');if(!node)return;
  node.textContent=message;node.classList.toggle('scan-error',error);
 }
 async function tryLocalHandwriting(){
  const q=activeQuestion;
  if(!q)return;
  const photos=window.RevisionScan?.getPages(q.id)||[];
  if(!photos.length){localAiStatus('Attach a photo, then crop it to ONE short line of handwriting first.',true);return}
  if(photos.length!==1){localAiStatus('This experiment handles only one cropped image. Remove additional pages first.',true);return}
  const consent=$('freeHandwritingConsent');
  if(!consent?.checked){
   localAiStatus('First agree to download a large model to this device. It does not upload the photograph.',true);return;
  }
  const button=$('freeHandwritingTry');
  if(button){button.disabled=true;button.textContent='Reading on this device…'}
  try{
   localAiStatus('Loading a large experimental handwriting model. It can be slow or unavailable on older devices; your photo remains in this browser.');
   if(!handwritingPipePromise){
    handwritingPipePromise=import(TRANSFORMERS_URL).then(async module=>{
     if(typeof module.pipeline!=='function')throw Error('Browser model library was not available.');
     return module.pipeline('image-to-text',HANDWRITING_MODEL,{device:'wasm',dtype:'q8'});
    }).catch(error=>{handwritingPipePromise=null;throw error});
   }
   const pipe=await handwritingPipePromise;
   if(q!==activeQuestion)return;
   // Cropped data URLs are passed directly to the ONNX runtime in this browser,
   // not to a remote inference endpoint.
   const outputs=await pipe(photos[0],{max_new_tokens:120});
   if(q!==activeQuestion)return;
   const guess=String(outputs?.[0]?.generated_text||'').trim();
   if(!guess)throw Error('No text was recognised. Use the normal scanner or enter the answer manually.');
   if(!window.RevisionScan?.proposeLocalText(q.id,guess))
    throw Error('Could not load the text into the photo-review editor.');
   localAiStatus('Experimental reading added below. Check every character and press Confirm transcription and suggest marks. No marks have been awarded yet.');
  }catch(err){
   localAiStatus('This experimental reader could not run: '+String(err?.message||'unsupported device').slice(0,180)+'. The normal local checker still works.',true);
  }finally{
   if(button){button.disabled=false;button.textContent='Try local handwriting AI (experimental)'}
  }
 }
 function mount(q){
  activeQuestion=q;
  const host=$('scanOCR');if(!host)return;
  const wrap=document.createElement('section');wrap.className='free-marking-panel';
  wrap.innerHTML=
   '<div class="free-marking-head"><strong>Free marking (default)</strong><span>£0 API cost</span></div>'+
   '<p>Use <b>Mark my answer</b> below. Photos and local OCR stay on your device. Correct any misread working before accepting suggested marks.</p>'+
   '<details id="freeChatGPT"><summary>Mark with ChatGPT Plus — free hand-off</summary>'+
   '<p>1. Copy the question and marking criteria. 2. Open ChatGPT in another tab. 3. <b>Attach the answer photograph yourself</b> and paste the instructions. 4. Copy the final POINTS line back here. Revision Loop does not send images to ChatGPT automatically.</p>'+
   '<div class="free-mark-actions"><button type="button" id="freeCopyPrompt">Copy marking instructions</button>'+
   '<a id="freeOpenChatGPT" target="_blank" rel="noopener noreferrer" href="https://chatgpt.com/">Open ChatGPT</a></div>'+
   '<textarea id="freeMarkPrompt" rows="7" hidden readonly aria-label="Prepared ChatGPT marking instructions"></textarea>'+
   '<label for="freeMarkReport">Paste the ChatGPT result (for example POINTS: 1,0,1)</label>'+
   '<textarea id="freeMarkReport" rows="3" placeholder="POINTS: 1,0,1" spellcheck="false"></textarea>'+
   '<button type="button" id="freeApplyReport">Import suggested marks for review</button>'+
   '<small>The imported suggestions are not automatically final. Check each mark against your answer and press Save only when satisfied.</small></details>'+
   '<details id="freeHandwritingLab"><summary>Experimental on-device handwriting AI</summary>'+
   '<p>Optional research preview for <b>one cropped line</b>, not an entire A-level paper. Downloads a large model and may be slow, inaccurate with mathematical notation, or unsupported. It is free of API charges; the photo is processed locally, but model files download from Hugging Face via a public CDN.</p>'+
   '<label class="free-local-consent"><input type="checkbox" id="freeHandwritingConsent"> I want to download the large model on this device</label>'+
   '<button type="button" id="freeHandwritingTry">Try local handwriting AI (experimental)</button>'+
   '<div id="freeHandwritingStatus" role="status" aria-live="polite"></div></details>'+
   '<p id="freeMarkStatus" role="status" aria-live="polite">Local marking is available without signing in or paying for API credit.</p>';
  host.insertAdjacentElement('beforebegin',wrap);
  $('freeCopyPrompt').onclick=copyPrompt;
  $('freeApplyReport').onclick=applyChatGPTResult;
  $('freeHandwritingTry').onclick=tryLocalHandwriting;
 }
 window.RevisionFree={mount,markingPrompt,parsePoints};
})();
