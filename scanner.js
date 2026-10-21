/* Revision Loop local answer photographs. No uploads or cloud recognition. */
(() => {
 'use strict';
 const DB_NAME='revision-loop-local-answer-photos',STORE='answers',MAX=5;
 let dbPromise=null,currentId='',pages=[],busy=false,sequence=0;
 let ocrText='',ocrApplied=false,ocrBusy=false,ocrConfidence=null,ocrLoadPromise=null,ocrRunNumber=0,appliedText='',lastOCRStatus='none',ocrNeedsReview=false,ocrReviewReason='';
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
 async function persist(state='draft',silent=false){
  if(!currentId)return;
  const id=currentId,snapshot=[...pages],recognized=ocrText;
  try{await write(id,snapshot,state,recognized);if(id===currentId&&!silent)status(snapshot.length+' page(s) stored privately in this browser.')}
  catch(e){if(id===currentId)status('Photos remain available this session but cannot be stored: '+(e.message||'Storage is full.'),true)}
 }
 function hideZoom(){
  const view=byId('scanZoom');if(!view)return;view.hidden=true;view.innerHTML='';
 }
 function resetOCR(){
  ocrText='';ocrConfidence=null;ocrApplied=false;ocrRunNumber++;appliedText='';lastOCRStatus='none';ocrNeedsReview=false;ocrReviewReason='';
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
     if(mode==='adaptive'){
      // Local brightness normalisation avoids a single dark shadow forcing
      // the entire worksheet into an unsuitable global threshold.
      const w=canvas.width,h=canvas.height,stride=w+1;
      const sums=new Uint32Array((w+1)*(h+1));
      for(let y=0;y<h;y++){
       let row=0;
       for(let x=0;x<w;x++){row+=luma[y*w+x];const k=(y+1)*stride+x+1;sums[k]=sums[k-stride]+row}
      }
      const radius=28;
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
       const x0=Math.max(0,x-radius),x1=Math.min(w,x+radius+1);
       const y0=Math.max(0,y-radius),y1=Math.min(h,y+radius+1);
       const total=sums[y1*stride+x1]-sums[y0*stride+x1]-sums[y1*stride+x0]+sums[y0*stride+x0];
       const localMean=total/((x1-x0)*(y1-y0));
       const value=Math.max(0,Math.min(255,Math.round(239+2.2*(luma[y*w+x]-localMean))));
       const i=(y*w+x)*4;p[i]=p[i+1]=p[i+2]=value;p[i+3]=255;
      }
      ctx.putImageData(data,0,0);
      resolve(canvas.toDataURL('image/png'));
      return;
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
 function calculateSimpleExpression(raw){
 const source=String(raw||'').replace(/[−–—]/g,'-').replace(/[×·]/g,'*').replace(/÷/g,'/')
 .replace(/(\d)\s*[xX]\s*(?=\d)/g,'$1*').replace(/\s+/g,'');
 if(!source||!/^[0-9eE.+*/()^\-]+$/.test(source))return NaN;
 const parts=source.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?|[()+*/^\-]/gi)||[];
 if(parts.join('')!==source)return NaN;
 let p=0;const peek=()=>parts[p],next=()=>parts[p++];
 function atom(){const x=peek();if(x==='+'||x==='-'){next();const y=atom();return x==='-'?-y:y}
  if(x==='('){next();const v=sum();if(next()!==')')throw Error('brackets');return v}
  if(!x||!/^(?:\d|\.)/.test(x))throw Error('number');next();return Number(x)}
 function power(){let v=atom();if(peek()==='^'){next();v=v**power()}return v}
 function prod(){let v=power();while(peek()==='*'||peek()==='/'){const op=next(),y=power();v=op==='*'?v*y:v/y}return v}
 function sum(){let v=prod();while(peek()==='+'||peek()==='-'){const op=next(),y=prod();v=op==='+'?v+y:v-y}return v}
 try{const val=sum();return p===parts.length&&Number.isFinite(val)?val:NaN}catch{return NaN}
}
function possiblyIncorrectArithmetic(line){
 const parts=String(line||'').replace(/[−–—]/g,'-').replace(/[≈≃]/g,'=').split('=').map(x=>x.trim());
 for(let i=0;i<parts.length-1;i++){
  const left=calculateSimpleExpression(parts[i]),right=calculateSimpleExpression(parts[i+1]);
  if(Number.isFinite(left)&&Number.isFinite(right)&&Math.abs(left-right)>Math.max(1e-10,Math.max(Math.abs(left),Math.abs(right))*.025))return true;
 }
 return false;
}
 function scanNumbers(text){
  let x=String(text||'').replace(/[−–—]/g,'-').replace(/[×·]/g,'*');
  const supers={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-','⁺':'+'};
  x=x.replace(/10([⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+)/g,(_,v)=>'10^'+[...v].map(c=>supers[c]).join(''));
  const token=/[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:\s*(?:\*|x)\s*10\s*\^\s*[-+]?\d+|[eE][-+]?\d+)?/g;
  const results=[];
  for(const match of x.matchAll(token)){
   const raw=match[0].replace(/\s+/g,'');
   const sci=raw.match(/^([-+]?(?:\d+(?:\.\d*)?|\.\d+))[*x]10\^([-+]?\d+)$/i);
   const value=sci?Number(sci[1])*10**Number(sci[2]):Number(raw);
   if(Number.isFinite(value))results.push({value,start:match.index,end:match.index+match[0].length,raw:match[0]});
  }
  return {text:x,results};
 }
 function scanMathConclusion(text,target){
  if(!Number.isFinite(target))return null;
  const source=String(text||'').replace(/^Page\s+\d+.*$/gm,'');
  const info=scanNumbers(source),cleaned=info.text;
  const near=v=>Number.isFinite(v)&&Math.abs(v-target)<=Math.max(1e-14,Math.abs(target)*.009);
  for(const token of info.results){
   if(!near(token.value))continue;
   const before=cleaned.slice(Math.max(0,token.start-24),token.start);
   const after=cleaned.slice(token.end,Math.min(cleaned.length,token.end+24));
   // Require an explicit final-answer cue, never a raw intermediate or input number.
   const prefix=/(?:=|≈|:)\s*$|(?:answer|result|mean|average|therefore|hence|so)\s*(?:is|=|:)?\s*$/i.test(before);
   const suffix=/^\s*(?:=|is)?\s*(?:mean|average|answer|result)\b/i.test(after);
   const line=cleaned.slice(cleaned.lastIndexOf('\n',token.start-1)+1,cleaned.indexOf('\n',token.end)>-1?cleaned.indexOf('\n',token.end):cleaned.length).trim();
   const standalone=line===token.raw.trim()||line===token.raw.trim()+' J'||line===token.raw.trim()+' W'||line===token.raw.trim()+' mol';
   if(prefix||suffix||standalone)return line.slice(0,200);
  }
  return null;
 }
 function scanMeanMethod(q,answer){
  if(!/\bmean\b|\baverage\b/i.test(String(q.prompt||'')+' '+(q.markPoints||[]).join(' ')))return null;
  const input=String(q.prompt||'').match(/(?:data|values|observations)\s*:?\s*((?:\d+(?:\.\d+)?\s*[,;]\s*){2,}\d+(?:\.\d+)?)/i);
  if(!input)return null;
  const values=(input[1].match(/\d+(?:\.\d+)?/g)||[]).map(Number);
  if(values.length<3||values.length>15)return null;
  const count=values.length,sum=values.reduce((a,b)=>a+b,0);
  const normalized=String(answer||'').replace(/^Page\s+\d+.*$/gm,'')
   .replace(/[−–]/g,'-').replace(/[×]/g,'*').replace(/[÷]/g,'/')
   .replace(/(\d)\s*:\s*(\d)/g,'$1/$2');
  const lines=normalized.split('\n').map(x=>x.trim()).filter(Boolean);
  const tolerance=Math.max(.001,Math.abs(sum)*.0001);
  const includesAllValues=(line)=>{
   // Compare the multiset of numbers, including repeated observations.
   const before=line.split(/(?:\/|over|divided\s+by|=)/i)[0];
   const nums=(before.match(/\d+(?:\.\d+)?/g)||[]).map(Number);
   const remaining=[...nums];
   for(const v of values){
    const i=remaining.findIndex(x=>Math.abs(x-v)<1e-8);
    if(i<0)return false;remaining.splice(i,1);
   }
   return (before.match(/\+/g)||[]).length>=values.length-2;
  };
  const hasCount=(text)=>new RegExp('(?:/|over|divided\\s+by)\\s*'+count+'(?:\\b|$)','i').test(text);
  for(let i=0;i<lines.length;i++){
   const line=lines[i],next=lines[i+1]||'',near=line+' '+next;
   const hasDenominator=hasCount(near)||new RegExp('^'+count+'(?:\\s*[=≈]|\\s*$)').test(next);
   if(!hasDenominator)continue;
   if(includesAllValues(line))return near.trim().slice(0,220);
   // Summing the observations first is a valid two-stage method:
   // 5+7+8+12=32; then 32/4 = 8.
   if(new RegExp('(?:^|[^0-9.])'+sum+'(?:\\s*(?:/|over|divided\\s+by)\\s*'+count+')','i').test(line))
     return line.slice(0,220);
   if(i>0&&includesAllValues(lines[i-1])&&new RegExp('(?:^|[^0-9.])'+sum+'(?:\\b|[^0-9.])').test(line))
     return (lines[i-1]+' '+line).slice(0,220);
  }
  // An explicitly correct general mean method also earns a method mark.
  const verbal=normalized.match(/(?:mean|average)\s*(?:=|is|:)\s*(?:sum|total)\s*(?:of\s+(?:all\s+)?(?:the\s+)?(?:values|observations))?\s*(?:\/|over|divided\s+by)\s*(?:number\s+of\s+(?:values|observations)|\d+)/i);
  if(verbal&&(!/\d+\s*$/.test(verbal[0])||hasCount(verbal[0])))return verbal[0].slice(0,220);
  return null;
 }
 function scanFormulaEvidence(point,answer){
  const normal=x=>String(x||'').toLowerCase().replace(/λ/g,'lambda').replace(/θ/g,'theta').replace(/Δ/g,'delta')
   .replace(/²/g,'^2').replace(/³/g,'^3').replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/\s+/g,'');
  const ref=String(point||'');
  const re=/\b([a-zA-Z][a-zA-Z0-9]*)\s*=\s*([a-zA-Z0-9πλθΔρµ²³^()*/×·÷+\-]{2,})/g;
  let m;
  const a=normal(answer);
  // Do not award credit when the student expressly labels the formula wrong.
  if(/\b(?:wrong|incorrect|invalid|false|not\s+correct)\b/i.test(String(answer||'')))return null;
  while((m=re.exec(ref))){
   const formula=normal(m[1]+'='+m[2]);
   if(formula.length>=4&&a.includes(formula))return String(answer).split(/\r?\n|;/).find(line=>normal(line).includes(formula))?.trim().slice(0,200)||null;
  }
  return null;
 }
 function scanEquationResults(text){
 const t=String(text||'').replace(/[−–—]/g,'-').replace(/×/g,'*');
 const out=[];
 for(const match of t.matchAll(/=\s*([-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?)/gi)){
  if(/^\s*[/+*^]/.test(t.slice(match.index+match[0].length)))continue;
  const v=Number(match[1]);if(Number.isFinite(v))out.push(v);
 }
 return out;
}
function scanLabelledStep(q,point,lines){
 if(!['Physics','Chemistry'].includes(q.subject))return null;
 const expected=scanEquationResults(point);
 if(!expected.length)return null;
 const rules=[
 [/parallel.*resistance|external.*resistance/i,/(?:parallel|r_?parallel|r_?ext)/i],
 [/total.*resistance|circuit resistance/i,/(?:total.*resistan|r_?total|rtotal)/i],
 [/\bbranch\s+currents?\b/i,/(?:branch|\bi[36]\s*=|\bi_[36]\b)/i],
 [/terminal.*(?:p\.?d\.?|potential|voltage)/i,/(?:terminal|voltage|\bV\s*=)/i],
 [/\b(?:total|electric|initial)\s+current\b|\bcurrent\s*=/i,/(?:current|\bI\s*=)/i],
 [/\bpower\b/i,/(?:power|\bP\s*=|i(?:\^2|²)r)/i],
 [/\benergy\b|\bwork\b/i,/(?:energy|work|\bE\s*=|\bW\s*=)/i],
 [/\bmass\b/i,/(?:mass|\bm\s*=)/i],
 [/\bpurity\b|\bpercentage\b|\bpercent\b/i,/(?:purity|percentage|percent|%)/i],
 [/\bmol(?:es)?\b|\bn\([^)]+\)/i,/(?:mol|\bn(?:\([^)]*\)|[_a-z0-9]*)\s*=)/i],
 [/\bpressure\b/i,/(?:pressure|\bp\s*=)/i],
 [/\bforce\b/i,/(?:force|\bF\s*=)/i]
 ];
 const context=rules.find(([match])=>match.test(point));
 if(!context)return null;
 const found=[];
 for(const line of lines){
  if(possiblyIncorrectArithmetic(line)||!context[1].test(line))continue;
  const actual=scanEquationResults(line);
  if(actual.some(v=>expected.some(t=>Math.abs(v-t)<=Math.max(1e-11,Math.abs(t)*.015))))found.push({line,actual});
 }
 if(!found.length)return null;
 // A single branch current is not evidence for both branches when the
 // question requires two independent currents.
 const required=expected.filter(v=>v!==0);
 if(required.length>1&&!required.every(t=>found.some(o=>o.actual.some(v=>Math.abs(t-v)<=Math.max(1e-11,Math.abs(t)*.015)))))return null;
 return found.map(x=>x.line).join(' ; ').slice(0,220);
}
function reviewEvidence(q,answer,res){
  if(!hasRecognizedMarking(q.id))return null;
  const lines=String(answer||'').split(/\r?\n|;\s*/).map(x=>x.trim()).filter(x=>x.length>2);
  const terms=x=>[...new Set((String(x).toLowerCase().match(/[a-z]{3,}/g)||[]).filter(w=>!['the','and','are','for','with','from','that','this','into','when'].includes(w)))];
  const numericTokens=x=>(String(x).match(/[-+]?(?:\d+(?:\.\d*)?|\.\d+)/g)||[]).map(Number);
  return q.markPoints.map(point=>{
   if(/mean\s+is\s+total\s+divided|mean\s*=\s*total|mean\s*=\s*sum/i.test(point)){
    const method=scanMeanMethod(q,answer);
    return {line:method||'',similarity:method?1:0,strong:Boolean(method)};
   }
   const expected=q.answerType==='numeric'&&Number.isFinite(q.numericAnswer)?q.numericAnswer:NaN;
   if(Number.isFinite(expected)&&/mean\s*[=:]|answer\s*[=:]|result\s*[=:]/i.test(point)){
    const outcome=scanMathConclusion(answer,expected);
    return {line:outcome||'',similarity:outcome?1:0,strong:Boolean(outcome)};
   }
   const labelled=scanLabelledStep(q,point,lines);
   if(labelled)return {line:labelled,similarity:1,strong:true};
   const formula=scanFormulaEvidence(point,answer);
   if(formula)return {line:formula,similarity:1,strong:true};
   const expectedFinal=q.answerType==='numeric'&&Number.isFinite(q.numericAnswer)?q.numericAnswer:NaN;
   if(Number.isFinite(expectedFinal)&&/(?:obtain|calculate|find|result|answer|therefore|hence|equals|approximately|≈)/i.test(point)){
    const explicit=scanMathConclusion(answer,expectedFinal);
    // Only the marking point containing the correct result can receive this credit.
    const finalVisible=scanNumbers(point).results.some(({value})=>
     Number.isFinite(value)&&Math.abs(value-expectedFinal)<=Math.max(1e-14,Math.abs(expectedFinal)*.025)
    );
    if(explicit&&finalVisible)return {line:explicit,similarity:1,strong:true};
   }
   let bestScore=0,best='',bestOverlap=0,bestSameNumber=false,bestRank=-1;
   const pt=terms(point),pn=numericTokens(point);
   for(const line of lines){
    if(/\b(?:wrong|incorrect|invalid|false|not\s+correct)\b/i.test(line))continue;
    if(possiblyIncorrectArithmetic(line))continue;
    const figures=(line.match(/[-+]?(?:\d+(?:\.\d*)?|\.\d+)/g)||[]);
    // Raw copied data or OCR garbage must not get a method mark just
    // because some individual numbers happen to match a mark scheme.
    if(figures.length>=3&&!/[=+*/×÷^<>]|\b(?:mean|total|sum|area|mass|gradient|pressure|current|force|energy|power|result|answer|therefore|hence|mol|voltage|rate|velocity)\b/i.test(line))continue;
    if(figures.length>=2&&/^\s*[-+]?\d[\d.\s,;\-]+$/.test(line))continue;
    const score=typeof markPointPrediction==='function'?markPointPrediction(line,point):0;
    if(q.subject==='Maths'&&q.marks>=4){
     const norm=x=>String(x).toLowerCase().replace(/[−–—]/g,'-').replace(/²/g,'^2').replace(/³/g,'^3')
      .replace(/×/g,'*').replace(/÷/g,'/').replace(/\s+/g,'');
     const ln=norm(line);
     const equations=[...String(point).matchAll(/([a-zA-Z\d()^²³+\-−*/]+)\s*=\s*([a-zA-Z\d()^²³+\-−*/∫[\]₋₁³]+)/g)]
      .map(m=>norm(m[1]+'='+m[2])).filter(k=>k.length>=4);
     const exact=equations.some(k=>ln.includes(k));
     const words=terms(point),given=terms(line);
     const structural={
      factor:/\([^)]{1,30}\)\s*\([^)]{1,30}\)|factor/i.test(line),
      integrat:/∫|integrat/i.test(line),
      differentiat:/d\/dx|dy\/dx|f'|derivat|differentiat/i.test(line),
      area:/\barea\b|\bA\s*=/i.test(line),
      tangent:/tangent|gradient|dy\/dx|f'/i.test(line)
     };
     const needs=Object.keys(structural).filter(k=>new RegExp(k,'i').test(point));
     const matchingStep=needs.some(k=>structural[k]);
     const explanatory=words.filter(t=>given.includes(t)).length>=2;
     // Correct factorisation must not also earn marks for an unrelated
     // equation rearrangement, differentiation or integration step.
     if(equations.length&&!exact&&!matchingStep)continue;
     if(needs.length&&!matchingStep&&!exact&&!explanatory)continue;
     if(!exact&&!matchingStep&&!explanatory&&!/(?:^|[\s])(?:x|y|a|p)\s*=/i.test(line))continue;
    }
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
 } function ocrMathSignature(text){
  // Only compare mathematical tokens; differences in English spacing
  // should not block recognition. We never assume a correct-looking
  // calculation is more likely than a student's actual incorrect one.
  const t=String(text||'').replace(/[−–—]/g,'-').replace(/[×·]/g,'*').replace(/÷/g,'/');
  return (t.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?|[=+*/()^]/gi)||[]).join(' ');
 }
 function candidateQuality(result,mode){
  const txt=String(result?.data?.text||'').trim();
  const confidence=Number.isFinite(result?.data?.confidence)?result.data.confidence:0;
  const useful=(txt.match(/[a-zA-Z0-9+\-*/=().^]/g)||[]).length;
  const garbage=(txt.match(/[|~_+'{}\[\]]/g)||[]).length;
  return confidence+Math.min(15,Math.log2(1+useful)*2)-Math.min(12,garbage*1.5)+(mode==='normal'?1:0);
 }
 async function readWriting(id){
  if(id!==currentId||!pages.length||ocrBusy)return {ok:false,error:'Already reading a photograph'};
  const version=++ocrRunNumber,snapshot=[...pages];
  ocrNeedsReview=false;ocrReviewReason='';
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
    let best=null;const attempts=[];
    for(const mode of candidates){
     status('Page '+(i+1)+'/'+snapshot.length+': trying '+(mode==='normal'?'original photo':mode)+'…');
     await worker.setParameters({tessedit_pageseg_mode:'6',preserve_interword_spaces:'1'});
     const input=await textImageForOCR(snapshot[i],mode);
     if(currentId!==id||version!==ocrRunNumber)return {ok:false,error:'Question changed'};
     const result=await worker.recognize(input);
     if(currentId!==id||version!==ocrRunNumber)return {ok:false,error:'Question changed'};
     const item={result,mode,quality:candidateQuality(result,mode)};
     attempts.push(item);
     if(!best||item.quality>best.quality)best=item;
    }
    if(selected==='auto'&&(!best||best.result.data.confidence<67||String(best.result.data.text||'').trim().length<5)){
     status('Page '+(i+1)+'/'+snapshot.length+': correcting uneven lighting…');
     try{
      await worker.setParameters({tessedit_pageseg_mode:'11',preserve_interword_spaces:'1'});
      const input=await textImageForOCR(snapshot[i],'adaptive');
      const result=await worker.recognize(input);
      if(currentId!==id||version!==ocrRunNumber)return {ok:false,error:'Question changed'};
      const item={result,mode:'adaptive',quality:candidateQuality(result,'adaptive')};
      attempts.push(item);
      if(!best||item.quality>best.quality)best=item;
     }catch(error){console.warn('Optional OCR fallback failed',error)}
    }
    if(!best)throw new Error('No recognition result was produced.');
    const differentMath=new Set(attempts.map(a=>ocrMathSignature(a.result.data?.text)).filter(Boolean)).size>1;
    if(differentMath){
     ocrNeedsReview=true;ocrReviewReason='Different image treatments read different numbers or mathematical operators.';
    }
    chunks.push(String(best.result.data.text||'').trim());
    if(Number.isFinite(best.result.data.confidence))confidences.push(best.result.data.confidence);
    modesUsed.push(best.mode);
   }
   const content=chunks.map((x,i)=>'Page '+(i+1)+'\n'+x).join('\n\n').trim();
   if(!chunks.some(x=>x.length>=2))throw new Error('No readable writing detected. Crop closer to the answer or enter your working manually.');
   ocrText=content;ocrApplied=false;lastOCRStatus='success';
   ocrConfidence=confidences.length?confidences.reduce((a,b)=>a+b,0)/confidences.length:null;
   showOCR(content,ocrConfidence);
   if(ocrConfidence!==null&&ocrConfidence<70){
    ocrNeedsReview=true;
    ocrReviewReason=(ocrReviewReason?ocrReviewReason+' ':'')+'Text recognition confidence is below 70%.';
   }
   status((ocrNeedsReview?'Check transcription before marking: '+ocrReviewReason:'Writing extracted; review the equations and proposed method marks. ')+modesUsed.map((m,i)=>'Page '+(i+1)+': '+m).join('; '),ocrNeedsReview);
   await persist('draft',true);
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
  persist('draft',true);
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
  if(ocrNeedsReview||result.confidence!==null&&result.confidence<70){
   status('Please verify the recognised working. '+(ocrReviewReason||'Recognition confidence is low.')+' Edit any symbols, then press Mark transcribed working.',true);
   return {ready:false,message:'The image readings disagree or have uncertain characters. Check the transcription, then press Mark transcribed working. No mark has been recorded.'};
  }
  applyRecognized(id,false);
  return {ready:true,source:'photograph',confidence:result.confidence};
 }
 function hasRecognizedMarking(id){return currentId===id&&ocrApplied&&Boolean(ocrText.trim())}


 function cropScan(index,id){
  if(currentId!==id||!pages[index])return;
  const photo=new Image(),overlay=byId('scanZoom');
  if(!overlay)return;
  photo.onload=()=>{
   if(id!==currentId)return;
   overlay.hidden=false;
   overlay.innerHTML='<div class="scan-crop-bar"><strong>Crop to your written working</strong><p>Drag around the handwriting to remove blank areas.</p><div><button type="button" id="cropCancel">Cancel</button><button type="button" id="cropUse" disabled>Use selected area</button></div></div><canvas id="scanCropCanvas" class="scan-crop-canvas" aria-label="Drag to select handwriting"></canvas>';
   const canvas=byId('scanCropCanvas'),save=byId('cropUse'),ctx=canvas.getContext('2d');
   canvas.width=photo.naturalWidth;canvas.height=photo.naturalHeight;
   const bound=(v,lo,hi)=>Math.min(hi,Math.max(lo,v));
   let first=null,last=null,selection=null;
   const redraw=()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(photo,0,0);
    if(!first||!last)return;
    const x=Math.min(first.x,last.x),y=Math.min(first.y,last.y),w=Math.abs(first.x-last.x),h=Math.abs(first.y-last.y);
    ctx.fillStyle='rgba(37,99,235,.13)';ctx.fillRect(x,y,w,h);
    ctx.strokeStyle='#2563eb';ctx.lineWidth=Math.max(3,canvas.width/250);ctx.strokeRect(x,y,w,h);
   };
   redraw();
   const where=ev=>{const r=canvas.getBoundingClientRect();return {x:bound((ev.clientX-r.left)*canvas.width/r.width,0,canvas.width),y:bound((ev.clientY-r.top)*canvas.height/r.height,0,canvas.height)}};
   canvas.onpointerdown=ev=>{ev.preventDefault();first=last=where(ev);selection=null;save.disabled=true;canvas.setPointerCapture?.(ev.pointerId);redraw()};
   canvas.onpointermove=ev=>{if(!first)return;ev.preventDefault();last=where(ev);redraw()};
   canvas.onpointerup=ev=>{
    if(!first)return;last=where(ev);redraw();
    selection={x:Math.floor(Math.min(first.x,last.x)),y:Math.floor(Math.min(first.y,last.y)),w:Math.floor(Math.abs(first.x-last.x)),h:Math.floor(Math.abs(first.y-last.y))};
    save.disabled=selection.w<40||selection.h<25;first=null;last=null;
   };
   const close=()=>{overlay.hidden=true;overlay.innerHTML=''};
   byId('cropCancel').onclick=close;
   save.onclick=async()=>{
    if(!selection||id!==currentId)return;
    const out=document.createElement('canvas');out.width=selection.w;out.height=selection.h;
    const dest=out.getContext('2d');dest.fillStyle='#fff';dest.fillRect(0,0,out.width,out.height);
    dest.drawImage(photo,selection.x,selection.y,selection.w,selection.h,0,0,out.width,out.height);
    pages[index]=out.toDataURL('image/jpeg',.87);
    close();resetOCR();render();await persist();
    status('Cropped to the working. Press Mark my answer to read and assess it.');
   };
  };
  photo.onerror=()=>status('Could not open photograph for cropping.',true);
  photo.src=pages[index];
 }
 function render(){
  const holder=byId('scanPages');if(!holder)return;
  const count=byId('scanCount');if(count)count.textContent=pages.length+' / '+MAX+' pages';
  const reader=byId('scanRecognize');if(reader&&!ocrBusy)reader.disabled=pages.length===0;
  holder.innerHTML=pages.map((src,i)=>'<figure class="scan-page"><img src="'+src+'" alt="Your written answer, page '+(i+1)+'"><figcaption><span>Page '+(i+1)+'</span><button type="button" data-crop="'+i+'">Crop writing</button><button type="button" data-turn="'+i+'">Rotate</button><button type="button" data-zoom="'+i+'">Enlarge</button><button type="button" data-remove="'+i+'">Remove</button></figcaption></figure>').join('');
  const id=currentId;
  holder.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{if(id!==currentId)return;pages.splice(+b.dataset.remove,1);resetOCR();render();persist()});
  holder.querySelectorAll('[data-crop]').forEach(b=>b.onclick=()=>cropScan(Number(b.dataset.crop),id));
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
  currentId=id;pages=[];ocrText='';ocrApplied=false;ocrConfidence=null;ocrNeedsReview=false;ocrReviewReason='';const version=++sequence;++ocrRunNumber;
  area.insertAdjacentHTML('afterend',`<section class="scan-control"><div class="scan-heading"><strong>Photograph your working</strong><span id="scanCount">0 / 5 pages</span></div><p>Write on paper, then take a photo or upload pages. Available on every exam question, including Mock.</p><div class="scan-buttons"><button type="button" id="scanTake">Take photo</button><button type="button" id="scanChoose">Upload image(s)</button><button type="button" id="scanRecognize" disabled>Read photo again</button></div><div class="scan-ocr-options"><label for="scanOCRMode">Image reading mode</label><select id="scanOCRMode"><option value="auto">Automatic (recommended)</option><option value="contrast">Enhanced contrast</option><option value="binary">Black and white</option><option value="adaptive">Remove shadows (local contrast)</option><option value="normal">Original photograph</option></select><button type="button" id="scanManual">Enter working manually</button></div><input id="scanCameraInput" type="file" accept="image/*" capture="environment" hidden><input id="scanChooseInput" type="file" accept="image/*" multiple hidden><div id="scanStatus" role="status" aria-live="polite">Images stay on this browser, not on a server.</div><div id="scanPages" class="scan-pages"></div><section id="scanOCR" class="scan-ocr" hidden><label for="scanTranscript"><strong>Recognised writing — check and correct</strong></label><p>Recognition can misread handwriting, algebra, fractions or signs. Correct the text below before marking, including every method step.</p><textarea id="scanTranscript" rows="8" spellcheck="false" placeholder="Your recognised working will appear here."></textarea><small id="scanOCRHint"></small><button type="button" id="scanApply">Mark transcribed working</button></section><details id="scanPrevious" hidden></details><p class="scan-explainer">Tap <b>Mark my answer</b>. If you have attached a photograph, it will be read automatically before suggesting a mark. You can correct the recognised working and recalculate your marks. Photos that cannot be read are not automatically given zero.</p></section><div id="scanZoom" class="scan-zoom" role="dialog" aria-label="Enlarged answer photo" hidden></div>`);
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