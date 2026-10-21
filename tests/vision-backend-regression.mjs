import assert from 'node:assert/strict';
import { normaliseInput, checkedMarking, buildModelRequest, default as server } from '../api/vision-mark.mjs';

// Synthetic 120-byte image fixture: no personal photographs stored in GitHub.
const image='data:image/jpeg;base64,'+Buffer.alloc(120,125).toString('base64');
const origin='https://jonivar345-debug.github.io';
const passphrase='integration-test-secret-phrase-long-000000';
const question={id:'test_mean_photo',subject:'Maths',
 prompt:'Calculate the mean of 5, 7, 8 and 12. Show working.',
 markPoints:['Mean is total divided by number of values.','Mean = 8.'],
 markPointMarks:[1,1],marks:2};
let checks=0;
const input=normaliseInput({question,images:[image]});
assert.equal(input.marks,2);checks++;
assert.equal(input.images.length,1);checks++;
assert.throws(()=>normaliseInput({question:{...question,marks:3},images:[image]}),/total/);checks++;
assert.throws(()=>normaliseInput({question,images:['data:image/svg+xml;base64,aGVsbG8=']}),/format/);checks++;
assert.throws(()=>normaliseInput({question,images:[image,image,image,image]}),/three/);checks++;
const ai={
 transcription:'(5+7+8+12)/4=8',uncertain:false,reviewNotes:'Readable',
 marking:[
  {index:0,earned:true,evidence:'(5+7+8+12)/4',reason:'Correct method',confidence:'high'},
  {index:1,earned:true,evidence:'=8',reason:'Correct answer',confidence:'high'}
 ]
};
let marked=checkedMarking(ai,input);
assert.equal(marked.score,2);checks++;
assert.equal(marked.maxMarks,2);checks++;
assert.equal(marked.marking[0].weight,1);checks++;
assert.throws(()=>checkedMarking({...ai,marking:[ai.marking[0],ai.marking[0]]},input),/Duplicate/);checks++;
marked=checkedMarking({...ai,marking:[{...ai.marking[0],evidence:''},ai.marking[1]]},input);
assert.equal(marked.score,1,'No evidence means no automatic method mark');checks++;
assert.equal(buildModelRequest(input).store,false);checks++;
assert.equal(buildModelRequest(input).input[0].content[1].type,'input_image');checks++;

const savedEnv={...process.env};
const priorFetch=globalThis.fetch;
process.env.FRONTEND_ORIGIN=origin;
process.env.VISION_ACCESS_TOKEN=passphrase;
process.env.OPENAI_API_KEY='fake-server-test-only';
let upstreamRequests=0;
globalThis.fetch=async (url,options)=>{
 upstreamRequests++;
 assert.equal(url,'https://api.openai.com/v1/responses');
 assert.equal(options.headers.Authorization,'Bearer fake-server-test-only');
 const sent=JSON.parse(options.body);
 assert.equal(sent.store,false);
 return Response.json({output:[{content:[{type:'output_text',text:JSON.stringify(ai)}]}]});
};
function req(extra={}){
 return new Request('https://private-example.vercel.app/api/vision-mark',{
  method:'POST',headers:{
   'Origin':extra.origin||origin,'Content-Type':'application/json',
   'Authorization':'Bearer '+(extra.pass||passphrase)},
  body:JSON.stringify({question,images:[image]})
 });
}
try{
 let res=await server.fetch(req());assert.equal(res.status,200);checks++;
 let body=await res.json();assert.equal(body.score,2);checks++;
 assert.equal(upstreamRequests,1);checks++;
 res=await server.fetch(req({pass:'invalid'}));assert.equal(res.status,401);checks++;
 assert.equal(upstreamRequests,1);checks++;
 res=await server.fetch(req({origin:'https://evil.example.com'}));assert.equal(res.status,403);checks++;
 assert.equal(upstreamRequests,1);checks++;
 delete process.env.OPENAI_API_KEY;
 res=await server.fetch(req());assert.equal(res.status,503);checks++;
}finally{
 globalThis.fetch=priorFetch;
 process.env.FRONTEND_ORIGIN=savedEnv.FRONTEND_ORIGIN;
 process.env.VISION_ACCESS_TOKEN=savedEnv.VISION_ACCESS_TOKEN;
 process.env.OPENAI_API_KEY=savedEnv.OPENAI_API_KEY;
 if(!savedEnv.FRONTEND_ORIGIN)delete process.env.FRONTEND_ORIGIN;
 if(!savedEnv.VISION_ACCESS_TOKEN)delete process.env.VISION_ACCESS_TOKEN;
 if(!savedEnv.OPENAI_API_KEY)delete process.env.OPENAI_API_KEY;
}
console.log('PASS '+checks+' secure vision API validation, authorisation and method-mark checks');
