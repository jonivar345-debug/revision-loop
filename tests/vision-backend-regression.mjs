import assert from 'node:assert/strict';
import { normaliseInput, checkedMarking, buildModelRequest, createDeviceSession, validDeviceSession, providerFailure, default as server } from '../api/vision-mark.mjs';

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
const anyInput=normaliseInput({
 question:{...question,id:'any_three_practical',
  markPoints:['Wash apparatus','Set the meniscus correctly','Record mass accurately','Invert to mix'],
  markPointMarks:[1,1,1,0],marks:3,markingMode:'anyN'},
 images:[image]});
assert.equal(anyInput.markingMode,'anyN');checks++;
const anyResponse={
 transcription:'Washed, adjusted bottom meniscus and inverted flask',
 uncertain:false,reviewNotes:'',
 marking:[0,1,2,3].map(i=>({index:i,earned:i!==2,evidence:i===2?'':'Step '+i,reason:'Valid improvement',confidence:'high'}))
};
const anyMarks=checkedMarking(anyResponse,anyInput);
assert.equal(anyMarks.score,3,'Any three recognised improvements score full marks');checks++;
assert.equal(anyMarks.marking[3].weight,1,'Fourth recognised point is not unfairly zero-weighted');checks++;
assert.equal(buildModelRequest(anyInput).input[0].content[0].text.includes('"weight":1'),true);checks++;

const issued=createDeviceSession(passphrase,Date.now());
assert.match(issued.token,/^rl1\./);checks++;
assert(validDeviceSession(passphrase,issued.token));checks++;
const idleWindow=365*24*60*60*1000;
assert.equal(issued.expiresAt-Date.now()>=idleWindow-10_000,true,'One-year device session');checks++;
assert(validDeviceSession(passphrase,issued.token,issued.expiresAt-1),'Session remains valid up to one year');checks++;
assert(!validDeviceSession(passphrase,issued.token,issued.expiresAt+1));checks++;
assert(!validDeviceSession(passphrase+'changed',issued.token));checks++;
assert(!validDeviceSession(passphrase,issued.token.slice(0,-1)+(issued.token.endsWith('x')?'y':'x')));checks++;
const savedEnv={...process.env};
const priorFetch=globalThis.fetch;
process.env.FRONTEND_ORIGIN=origin;
process.env.VISION_ACCESS_TOKEN=passphrase;
process.env.OPENAI_API_KEY='fake-server-test-only';
process.env.ENABLE_PAID_VISION_MARKING='true';
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
  body:JSON.stringify(extra.body||{question,images:[image]})
 });
}
try{
 let res=await server.fetch(req());assert.equal(res.status,200);checks++;
 let body=await res.json();assert.equal(body.score,2);checks++;
 assert.equal(upstreamRequests,1);checks++;
 res=await server.fetch(req({body:{action:'remember-device'}}));
 assert.equal(res.status,200,'Master secret authorises remembered device');checks++;
 const remembered=await res.json();
 assert(validDeviceSession(passphrase,remembered.token));checks++;
 assert.equal(upstreamRequests,1,'Session issuance never calls the AI');checks++;
 res=await server.fetch(req({pass:remembered.token}));
 assert.equal(res.status,200,'A remembered device can mark questions');checks++;
 assert.equal(upstreamRequests,2);checks++;
 res=await server.fetch(req({pass:remembered.token,body:{action:'renew-device'}}));
 assert.equal(res.status,200,'Remembered device can renew while valid');checks++;
 const renewed=await res.json();
 assert(validDeviceSession(passphrase,renewed.token));checks++;
 assert.equal(upstreamRequests,2,'No paid AI call for session renewal');checks++;
 res=await server.fetch(req({pass:renewed.token}));
 assert.equal(res.status,200,'Renewed device can continue marking');checks++;
 assert.equal(upstreamRequests,3);checks++;
 res=await server.fetch(req({pass:renewed.token,body:{action:'remember-device'}}));
 assert.equal(res.status,403,'Device session cannot mint from master-only endpoint');checks++;
 res=await server.fetch(req({pass:remembered.token,body:{action:'remember-device'}}));
 assert.equal(res.status,403,'A device session cannot mint further sessions');checks++;
 res=await server.fetch(req({pass:'invalid'}));assert.equal(res.status,401);checks++;
 assert.equal(upstreamRequests,3);checks++;
 res=await server.fetch(req({origin:'https://evil.example.com'}));assert.equal(res.status,403);checks++;
 assert.equal(upstreamRequests,3);checks++;
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
 if(savedEnv.ENABLE_PAID_VISION_MARKING===undefined)delete process.env.ENABLE_PAID_VISION_MARKING;
 else process.env.ENABLE_PAID_VISION_MARKING=savedEnv.ENABLE_PAID_VISION_MARKING;
}
// Provider diagnostics must be specific without forwarding arbitrary
// provider messages (which can contain prompts or secrets).
assert.match(providerFailure(401,{error:{code:'invalid_api_key'}}).error,/API_KEY/);checks++;
assert.match(providerFailure(429,{error:{code:'insufficient_quota'}}).error,/quota/i);checks++;
assert.match(providerFailure(429,{error:{code:'credit_balance_exhausted'}}).error,/no available credit/i);checks++;
assert.doesNotMatch(providerFailure(429,{error:{code:'credit_balance_exhausted'}}).error,/temporary rate limit/i);checks++;
assert.match(providerFailure(400,{error:{code:'invalid_request_error',param:'text.format'}}).error,/request/i);checks++;
assert.equal(providerFailure(400,{error:{code:'x',param:'unsafe secret content!'}}).providerParam,undefined);checks++;
{
 const prior=globalThis.fetch;
 const before={OPENAI_API_KEY:process.env.OPENAI_API_KEY,VISION_ACCESS_TOKEN:process.env.VISION_ACCESS_TOKEN,FRONTEND_ORIGIN:process.env.FRONTEND_ORIGIN};
 try{
  process.env.OPENAI_API_KEY='provider-check-test-key';process.env.VISION_ACCESS_TOKEN=passphrase;process.env.FRONTEND_ORIGIN=origin;
  let modelsCalled=0,modelsPostCalled=0;
  globalThis.fetch=async(url,options)=>{
   if(options.method!=='GET')modelsPostCalled++;
   assert.equal(url,'https://api.openai.com/v1/models/gpt-4.1-mini');checks++;
   modelsCalled++;return Response.json({id:'gpt-4.1-mini'});
  };
  const health=await server.fetch(req({body:{action:'check-provider'}}));
  assert.equal(health.status,200);checks++;
  assert.equal((await health.json()).providerReady,true);checks++;
  assert.equal(modelsCalled,1);checks++;
  assert.equal(modelsPostCalled,0,'Account check never starts a billed model response');checks++;
  globalThis.fetch=async()=>Response.json({error:{code:'invalid_api_key',message:'MUST NOT FORWARD SECRET STRING'}},{status:401});
  const invalid=await server.fetch(req({body:{action:'check-provider'}}));
  assert.equal(invalid.status,502);checks++;
  const diagnostic=await invalid.json();
  assert.equal(diagnostic.providerCode,'invalid_api_key');checks++;
  assert(!JSON.stringify(diagnostic).includes('MUST NOT FORWARD'));checks++;
 }finally{
  globalThis.fetch=prior;
  for(const [key,value] of Object.entries(before)){if(value===undefined)delete process.env[key];else process.env[key]=value}
 }
}
// Even a valid saved token must not cause a paid model request unless
// the account owner explicitly activates it in Vercel.
{
 const lastKey=process.env.OPENAI_API_KEY,lastSecret=process.env.VISION_ACCESS_TOKEN,lastOrigin=process.env.FRONTEND_ORIGIN,lastSwitch=process.env.ENABLE_PAID_VISION_MARKING;
 const originalFetch=globalThis.fetch;
 try{
  process.env.OPENAI_API_KEY='test-only';process.env.VISION_ACCESS_TOKEN=passphrase;
  process.env.FRONTEND_ORIGIN=origin;delete process.env.ENABLE_PAID_VISION_MARKING;
  globalThis.fetch=async()=>{throw Error('Paid API must not be called')};
  const result=await server.fetch(req());
  assert.equal(result.status,403,'Paid marking is blocked by default');checks++;
  assert.match((await result.json()).error,/disabled/i);checks++;
 }finally{
  globalThis.fetch=originalFetch;
  for(const [key,value] of Object.entries({OPENAI_API_KEY:lastKey,VISION_ACCESS_TOKEN:lastSecret,FRONTEND_ORIGIN:lastOrigin,ENABLE_PAID_VISION_MARKING:lastSwitch})){
   if(value===undefined)delete process.env[key];else process.env[key]=value;
  }
 }
}
console.log('PASS '+checks+' secure vision API validation, authorisation and method-mark checks');
