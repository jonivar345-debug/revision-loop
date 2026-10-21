/* Browser-only synthetic regression for optional vision integration.
   No live model calls and no private API credentials. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'..','vision-client.js'),'utf8');
const components=new Map();let next=0;
function createNode(id){
 const n={id,value:'',innerHTML:'',textContent:'',disabled:false,open:false,
   children:[],className:'',classList:{toggle(){},add(){},remove(){}},
   appendChild(el){this.children.push(el)},setAttribute(){},
   insertAdjacentElement(where,el){
    const ids=[...el.innerHTML.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
    ids.forEach(createNode);
    this.inserted=el;
   },click(){if(typeof this.onclick==='function')return this.onclick()}};
 components.set(id,n);return n;
}
createNode('scanOCR');createNode('markExam');
const document={getElementById:id=>components.get(id)||null,
  createElement:tag=>createNode(tag+'-'+(++next))};
let store=new Map();
const sessionStorage={getItem:key=>store.get(key)||null,setItem:(key,v)=>store.set(key,v),
  removeItem:key=>store.delete(key)};
const localStore=new Map();
const localStorage={getItem:k=>localStore.get(k)||null,setItem:(k,v)=>localStore.set(k,v),removeItem:k=>localStore.delete(k)};
const shortToken='rl1.'+'A'.repeat(45)+'.'+'b'.repeat(43);
const renewedToken='rl1.'+'C'.repeat(45)+'.'+'d'.repeat(43);
const YEAR=365*24*60*60*1000;
const mockSource='data:image/jpeg;base64,'+Buffer.alloc(170,123).toString('base64');
let photoSent=null,called=0,usedVision='';
const visionMark={
 questionId:'mean-test',score:2,maxMarks:2,
 transcription:'(5+7+8+12)/4=8',uncertain:false,
 marking:[{index:0,earned:true,evidence:'(5+7+8+12)/4',confidence:'high',reason:'Method'},
 {index:1,earned:true,evidence:'8',confidence:'high',reason:'Answer'}]
};
const Image=class{
 constructor(){this.naturalWidth=900;this.naturalHeight=500}
 set src(url){if(this.onload)this.onload()}
};
const window={RevisionScan:{
 getPages:()=>[mockSource],
 useVisionText:(id,text)=>{usedVision=text}
}};
const fetch=async(url,options)=>{
 called++;photoSent=JSON.parse(options.body);
 assert.equal(url,'https://revision-loop-jonivar345-5189.vercel.app/api/vision-mark');
 assert(['Bearer a-strong-private-test-passphrase-1234','Bearer '+shortToken,'Bearer '+renewedToken].includes(options.headers.Authorization));
 if(photoSent.action==='remember-device')return {ok:true,status:200,json:async()=>({token:shortToken,expiresAt:Date.now()+YEAR})};
 if(photoSent.action==='renew-device')return {ok:true,status:200,json:async()=>({token:renewedToken,expiresAt:Date.now()+YEAR})};
 if(photoSent.action==='check-provider')return {ok:true,status:200,json:async()=>({providerReady:true,model:'gpt-4.1-mini'})};
 if(options.body==='{}')return {ok:false,status:400,json:async()=>({error:'Question information is required.'})};
 assert.equal(photoSent.images.length,1);
 return {ok:true,status:200,json:async()=>visionMark};
};
let clickCount=0;
components.get('markExam').click=()=>{clickCount++};
const canvas=()=>({width:0,height:0,getContext:()=>({fillRect(){},drawImage(){}}),
 toDataURL:()=>mockSource});
document.createElement=(tag)=>tag==='canvas'?canvas():createNode(tag+'-'+(++next));
const mockURL=URL;
const AbortCtrl=AbortController;
new Function('window','document','sessionStorage','localStorage','Image','fetch','URL','AbortController','setTimeout','clearTimeout',
 source)(window,document,sessionStorage,localStorage,Image,fetch,mockURL,AbortCtrl,setTimeout,clearTimeout);
let checks=0;const vision=window.RevisionVision;
assert(vision);checks++;
assert(vision.allowedEndpoint('https://revision-loop-jonivar345-5189.vercel.app/api/vision-mark'));checks++;
assert(!vision.allowedEndpoint('https://attacker.vercel.app/api/vision-mark'));checks++;
assert(!vision.allowedEndpoint('http://student-vision.vercel.app/api/vision-mark'));checks++;
assert(!vision.allowedEndpoint('https://evil.example/api/vision-mark'));checks++;
const q={id:'mean-test',subject:'Maths',prompt:'Find the mean of 5,7,8,12',marks:2,
 markPoints:['Mean is total divided by number of values.','Mean=8.'],markPointMarks:[1,1]};
vision.mount(q);
assert.equal(called,0);checks++;
async function run(){
 await vision.markFromPhotos();
 assert.equal(called,0,'Paid marking makes no requests by default');checks++;
 assert.match(components.get('scanVisionStatus').textContent,/off by default/);checks++;
 assert.match(components.get('scanOCR').inserted.innerHTML,/id="scanVisionMark"[^>]*disabled/);checks++;
 components.get('scanVisionMark').disabled=true;
 components.get('scanVisionPaidOptIn').checked=true;
 components.get('scanVisionPaidOptIn').onchange();
 assert.equal(components.get('scanVisionMark').disabled,false);checks++;
 await vision.markFromPhotos();
 assert.equal(called,0,'Paid opt-in alone must never start a request');checks++;
 assert.equal(components.get('scanVisionConfig').open,true);checks++;
 components.get('scanVisionUrl').value='https://revision-loop-jonivar345-5189.vercel.app/api/vision-mark';
 components.get('scanVisionPass').value='a-strong-private-test-passphrase-1234';
 await components.get('scanVisionSave').click();
 assert(sessionStorage.getItem('revisionloop-vision-session'));checks++;
 await vision.testPrivateConnection();
 assert.equal(called,2,'Authentication and provider access checks do not invoke AI');checks++;
 assert.match(components.get('scanVisionStatus').textContent,/AI account and model access verified/);checks++;
 await vision.markFromPhotos();
 assert.equal(called,3);checks++;
 assert.equal(photoSent.question.id,'mean-test');checks++;
 assert.equal(vision.resultFor('mean-test').score,2);checks++;
 assert.equal(usedVision,'(5+7+8+12)/4=8');checks++;
 assert.equal(clickCount,1);checks++;
 vision.invalidate();
 assert.equal(vision.resultFor('mean-test'),null);checks++;
 components.get('scanVisionRemember').checked=true;
 components.get('scanVisionPass').value='a-strong-private-test-passphrase-1234';
 await components.get('scanVisionSave').click();
 assert.equal(called,4,'Remembering uses one free backend request');checks++;
 const remembered=JSON.parse(localStorage.getItem('revisionloop-vision-device-v1'));
 assert.equal(remembered.token,shortToken);checks++;
 assert(!JSON.stringify(remembered).includes('a-strong-private-test-passphrase-1234'));checks++;
 assert.equal(sessionStorage.getItem('revisionloop-vision-session'),null);checks++;
 store.clear();
 vision.mount(q);
 components.get('scanVisionPaidOptIn').checked=true;
 assert.equal(components.get('scanVisionRemember').checked,true);checks++;
 assert.equal(components.get('scanVisionPass').value,'');checks++;
 await vision.testPrivateConnection();
 assert.equal(called,6);checks++;
 await vision.markFromPhotos();
 assert.equal(called,7);checks++;
 components.get('scanVisionForget').click();
 assert.equal(localStorage.getItem('revisionloop-vision-device-v1'),null);checks++;
 await vision.markFromPhotos();
 assert.equal(called,7);checks++;
 localStore.set('revisionloop-vision-device-v1',JSON.stringify({token:shortToken,expiresAt:Date.now()-1000}));
 vision.mount(q);
 assert.equal(localStorage.getItem('revisionloop-vision-device-v1'),null);checks++;
 // A previously issued 30-day session is silently upgraded to one year.
 localStore.set('revisionloop-vision-device-v1',JSON.stringify({token:shortToken,expiresAt:Date.now()+15*24*60*60*1000}));
 vision.mount(q);
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(called,8,'Legacy 30-day session renews without another passphrase');checks++;
 const updated=JSON.parse(localStorage.getItem('revisionloop-vision-device-v1'));
 assert.equal(updated.token,renewedToken);checks++;
 assert(updated.expiresAt>Date.now()+300*24*60*60*1000,'Device stays signed in for another year');checks++;
 vision.mount(q);
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(called,8,'Fresh annual session is not renewed excessively');checks++;
 components.get('scanVisionPaidOptIn').checked=true;
 await vision.markFromPhotos();
 assert.equal(called,9,'Renewed session still permits AI marking');checks++;
 components.get('scanVisionForget').click();
 assert.equal(localStorage.getItem('revisionloop-vision-device-v1'),null);checks++;

 // Manual import can propose mark points without uploading the photo or calling the API.
 const beforeImport=called;
 assert.equal(vision.importReviewedPoints(q,[true,false]),true);checks++;
 assert.equal(vision.resultFor('mean-test').source,'chatgpt-manual-import');checks++;
 assert.equal(vision.resultFor('mean-test').score,1);checks++;
 assert.equal(called,beforeImport,'Imported marking cannot make paid requests');checks++;
 console.log('PASS '+checks+' optional vision browser and privacy checks');
}
run().catch(e=>{console.error(e);process.exitCode=1});
