/* Optional local exam drawing pad: no external services and no automatic mark awards. */
(() => {
 'use strict';
 const WIDTH=960,HEIGHT=540,INK='#1d4ed8';
 let activeQuestion=null,activeCanvas=null,inkCanvas=null,strokes=[],current=null,tool='pen',baseImage=null,baseLabel='';
 function el(id){return document.getElementById(id)}
 function point(event,canvas){
  const rect=canvas.getBoundingClientRect();
  if(!rect.width||!rect.height)return null;
  return {x:Math.max(0,Math.min(WIDTH,(event.clientX-rect.left)*WIDTH/rect.width)),
   y:Math.max(0,Math.min(HEIGHT,(event.clientY-rect.top)*HEIGHT/rect.height))};
 }
 function paintStroke(ctx,stroke){
  if(!stroke.points.length)return;
  ctx.globalCompositeOperation=stroke.tool==='eraser'?'destination-out':'source-over';
  ctx.strokeStyle=INK;ctx.fillStyle=INK;ctx.lineWidth=stroke.tool==='eraser'?26:3.4;
  ctx.lineCap='round';ctx.lineJoin='round';
  const pts=stroke.points;
  if(pts.length===1){
   ctx.beginPath();ctx.arc(pts[0].x,pts[0].y,ctx.lineWidth/2,0,2*Math.PI);ctx.fill();
   return;
  }
  ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);
  for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i].x,pts[i].y);
  ctx.stroke();
 }
 function redraw(){
  if(!activeCanvas||!inkCanvas)return;
  const ink=inkCanvas.getContext('2d');
  if(!ink)return;
  ink.clearRect(0,0,WIDTH,HEIGHT);
  for(const stroke of strokes)paintStroke(ink,stroke);
  if(current)paintStroke(ink,current);
  ink.globalCompositeOperation='source-over';
  const ctx=activeCanvas.getContext('2d');
  ctx.fillStyle='#ffffff';ctx.fillRect(0,0,WIDTH,HEIGHT);
  if(baseImage){
   const ratio=Math.min((WIDTH-32)/baseImage.width,(HEIGHT-32)/baseImage.height);
   const w=baseImage.width*ratio,h=baseImage.height*ratio;
   ctx.drawImage(baseImage,(WIDTH-w)/2,(HEIGHT-h)/2,w,h);
  }else{
   ctx.strokeStyle='#dbe3ef';ctx.lineWidth=1;
   for(let x=48;x<WIDTH;x+=48){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,HEIGHT);ctx.stroke()}
   for(let y=48;y<HEIGHT;y+=48){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(WIDTH,y);ctx.stroke()}
  }
  ctx.drawImage(inkCanvas,0,0);
 }
 function inform(message,warning=false){
  const n=el('sketchStatus');if(n){n.textContent=message;n.classList.toggle('sketch-warning',warning)}
 }
 function loadReference(questionId){
  const svg=document.querySelector('.exam-visual svg');
  if(!svg){baseLabel='Blank grid for working';redraw();return}
  // Render a snapshot of the provided inline SVG; the source figure is never modified.
  let url=null;
  try{
   const node=svg.cloneNode(true);
   node.setAttribute('xmlns','http://www.w3.org/2000/svg');
   if(!node.getAttribute('width'))node.setAttribute('width','960');
   if(!node.getAttribute('height'))node.setAttribute('height','540');
   const xml=new XMLSerializer().serializeToString(node);
   url=URL.createObjectURL(new Blob([xml],{type:'image/svg+xml;charset=utf-8'}));
   const img=new Image();
   img.onload=()=>{
    URL.revokeObjectURL(url);
    if(activeQuestion!==questionId)return;
    baseImage=img;baseLabel='Annotated question diagram';redraw();
   };
   img.onerror=()=>{
    URL.revokeObjectURL(url);
    if(activeQuestion===questionId){baseLabel='Blank grid (diagram copy unavailable)';inform('Diagram could not be copied; use the blank pad or a photograph.',true);redraw()}
   };
   img.src=url;
  }catch(e){
   if(url)URL.revokeObjectURL(url);
   baseLabel='Blank grid';inform('Diagram copy is unavailable; you can still draw on the blank pad.',true);
  }
 }
 function mount(q){
  if(!q||!el('examAnswer'))return;
  activeQuestion=q.id;strokes=[];current=null;tool='pen';baseImage=null;baseLabel='Blank grid';
  const area=el('examAnswer');
  area.insertAdjacentHTML('afterend',
   '<details class="exam-sketch" id="examSketch"><summary>Draw working or annotate a diagram (optional)</summary>'+
   '<p>Use your mouse, pen or finger. If a question has an inline diagram, it is copied onto this pad. Diagrams need manual checking: a picture alone cannot be reliably marked by the text checker.</p>'+
   '<div class="sketch-actions"><button type="button" id="sketchPen" aria-pressed="true">Pen</button>'+
   '<button type="button" id="sketchEraser" aria-pressed="false">Eraser</button>'+
   '<button type="button" id="sketchUndo">Undo</button><button type="button" id="sketchClear">Clear ink</button></div>'+
   '<canvas id="examSketchCanvas" width="960" height="540" aria-label="Working canvas for annotating or drawing this exam question"></canvas>'+
   '<div class="sketch-actions"><button type="button" id="sketchAttach">Attach drawing as answer image</button></div>'+
   '<div id="sketchStatus" class="sketch-status" role="status" aria-live="polite">Draw first, then attach. You can also type your steps or upload a photo.</div>'+
   '</details>');
  activeCanvas=el('examSketchCanvas');
  inkCanvas=document.createElement('canvas');inkCanvas.width=WIDTH;inkCanvas.height=HEIGHT;
  const canvas=activeCanvas;
  function setTool(which){
   tool=which;el('sketchPen').setAttribute('aria-pressed',String(which==='pen'));
   el('sketchEraser').setAttribute('aria-pressed',String(which==='eraser'));
  }
  el('sketchPen').onclick=()=>setTool('pen');
  el('sketchEraser').onclick=()=>setTool('eraser');
  el('sketchUndo').onclick=()=>{if(strokes.length)strokes.pop();redraw()};
  el('sketchClear').onclick=()=>{strokes=[];current=null;redraw();inform('Ink cleared; the source diagram remains.')};
  canvas.addEventListener('pointerdown',e=>{
   if(activeQuestion!==q.id||e.button>0)return;
   const p=point(e,canvas);if(!p)return;
   current={tool,points:[p]};
   canvas.setPointerCapture?.(e.pointerId);redraw();e.preventDefault();
  });
  canvas.addEventListener('pointermove',e=>{
   if(!current||activeQuestion!==q.id)return;
   const p=point(e,canvas);if(!p)return;
   current.points.push(p);redraw();e.preventDefault();
  });
  function finish(e){
   if(!current)return;
   strokes.push(current);current=null;redraw();
   if(canvas.hasPointerCapture?.(e.pointerId))canvas.releasePointerCapture(e.pointerId);
  }
  canvas.addEventListener('pointerup',finish);
  canvas.addEventListener('pointercancel',finish);
  el('sketchAttach').onclick=async()=>{
   if(activeQuestion!==q.id)return;
   if(!strokes.some(s=>s.tool==='pen')){inform('Draw something first. The unannotated diagram is already visible above.',true);return}
   const button=el('sketchAttach');button.disabled=true;
   try{
    const ok=await window.RevisionScan?.attachDrawing?.(q.id,canvas.toDataURL('image/png'));
    if(ok){inform('Drawing attached as an answer image. Explain or transcribe key steps, then review marks manually.');}
    else inform('Could not attach: check the maximum of five answer images.',true);
   }catch(e){inform('Could not attach the drawing; keep your sketch and try again.',true)}
   finally{button.disabled=false}
  };
  el('examSketch').addEventListener('toggle',()=>redraw());
  loadReference(q.id);redraw();
 }
 window.RevisionSketch={mount};
})();
