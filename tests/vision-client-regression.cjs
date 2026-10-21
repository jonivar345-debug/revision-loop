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
 assert.equal(options.headers.Authorization,'Bearer a-strong-private-test-passphrase-1234');
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
new Function('window','document','sessionStorage','Image','fetch','URL','AbortController','setTimeout','clearTimeout',
 source)(window,document,sessionStorage,Image,fetch,mockURL,AbortCtrl,setTimeout,clearTimeout);
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
 assert.equal(called,0,'No network access before service configuration');checks++;
 assert.equal(components.get('scanVisionConfig').open,true);checks++;
 components.get('scanVisionUrl').value='https://revision-loop-jonivar345-5189.vercel.app/api/vision-mark';
 components.get('scanVisionPass').value='a-strong-private-test-passphrase-1234';
 components.get('scanVisionSave').click();
 assert(sessionStorage.getItem('revisionloop-vision-session'));checks++;
 await vision.testPrivateConnection();
 assert.equal(called,1,'One free authentication check performed');checks++;
 assert.match(components.get('scanVisionStatus').textContent,/Connection verified/);checks++;
 await vision.markFromPhotos();
 assert.equal(called,2);checks++;
 assert.equal(photoSent.question.id,'mean-test');checks++;
 assert.equal(vision.resultFor('mean-test').score,2);checks++;
 assert.equal(usedVision,'(5+7+8+12)/4=8');checks++;
 assert.equal(clickCount,1);checks++;
 vision.invalidate();
 assert.equal(vision.resultFor('mean-test'),null);checks++;
 console.log('PASS '+checks+' optional vision browser and privacy checks');
}
run().catch(e=>{console.error(e);process.exitCode=1});
