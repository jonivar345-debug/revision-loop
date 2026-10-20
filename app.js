
const DECK_URL='./deck.json',EXAM_URL='./exam_questions.json',DAY=86400000;
const PIN_HASH='02a80993805958408c14d68623a229c86777980c55403d0c2fecf46904fe367c';
const PROGRESS_KEY='revisionLoopProgress5',PROFILE_KEY='revisionLoopProfile11',SETTINGS_KEY='revisionLoopSettings11';
let cards=[],examQuestions=[],deckMeta={},coverage={},deckVersion=0,bankVersion=0;
let progress=load(PROGRESS_KEY,{});
let profile=load(PROFILE_KEY,{});
let settings=load(SETTINGS_KEY,{});
let studyType='flashcards',activeSession=null,currentCardId=null,currentEvaluation=null,currentFlashAwarded=false,currentExamScore=0,toastTimer=null;
let flashTopics=new Set(),examTopics=new Set(),examYears=new Set(),examTypes=new Set(),globeLon=0,globeLat=5,dragging=false,lastPointer=null,selectedLocation='home';

const OUTFITS=[
 {id:'starter',name:'Starter Scholar',icon:'🧑‍🎓',cost:0,desc:'The original revision outfit.'},
 {id:'seer',name:'Arcane Seer',icon:'🔮',cost:20,desc:'Mystic coat, cards and constellations.'},
 {id:'strategist',name:'Silent Strategist',icon:'♟️',cost:30,desc:'Calm, analytical and impossible to rush.'},
 {id:'striker',name:'Goal Hunter',icon:'⚽',cost:35,desc:'Fast decisions and competitive focus.'},
 {id:'detective',name:'Night Detective',icon:'🕵️',cost:45,desc:'Dark coat and clue-board energy.'},
 {id:'voyager',name:'Northern Voyager',icon:'🛡️',cost:55,desc:'A travelling scholar from colder seas.'},
 {id:'idol',name:'Stage Star',icon:'🎤',cost:60,desc:'Bright lights and confident recall.'},
 {id:'wanderer',name:'Tower Wanderer',icon:'🗝️',cost:70,desc:'Explorer of strange libraries and towers.'},
 {id:'sorcerer',name:'Cursed Scholar',icon:'🌀',cost:80,desc:'High-risk exam technique, zero panic.'},
 {id:'captain',name:'Street Captain',icon:'🏍️',cost:90,desc:'Bold jacket and relentless momentum.'},
 {id:'architect',name:'City Architect',icon:'🏙️',cost:110,desc:'Plans systems, cities and revision routes.'},
 {id:'monarch',name:'Midnight Monarch',icon:'👑',cost:140,desc:'A late-game prestige outfit.'},
 {id:'chemist',name:'Glasswork Alchemist',icon:'⚗️',cost:150,desc:'Built for mechanisms and calculations.'},
 {id:'physicist',name:'Field Researcher',icon:'🧲',cost:160,desc:'Experiments, fields and graphs.'},
 {id:'mathematician',name:'Proof Master',icon:'∑',cost:170,desc:'Minimal style, maximum method.'},
 {id:'traveller',name:'World Traveller',icon:'🎒',cost:200,desc:'Unlocked after a lot of revision miles.'}
];
const LOCATIONS=[
 {id:'home',name:'Home Desk',lat:52.5,lon:1.0,cost:0,icon:'🏠'},
 {id:'london',name:'London Library',lat:51.5,lon:-0.12,cost:25,icon:'📚'},
 {id:'tbilisi',name:'Tbilisi Old Town',lat:41.72,lon:44.79,cost:40,icon:'🏔️'},
 {id:'tokyo',name:'Tokyo Rooftop',lat:35.68,lon:139.65,cost:55,icon:'🗼'},
 {id:'seoul',name:'Seoul Night Study',lat:37.57,lon:126.98,cost:60,icon:'🌃'},
 {id:'hongkong',name:'Hong Kong Harbour',lat:22.32,lon:114.17,cost:65,icon:'🌉'},
 {id:'singapore',name:'Singapore Skyline',lat:1.35,lon:103.82,cost:70,icon:'🌆'},
 {id:'manila',name:'Manila Bay',lat:14.6,lon:120.98,cost:75,icon:'🌅'},
 {id:'busan',name:'Busan Coast',lat:35.18,lon:129.08,cost:80,icon:'🌊'},
 {id:'almaty',name:'Almaty Mountains',lat:43.24,lon:76.89,cost:90,icon:'⛰️'},
 {id:'reykjavik',name:'Arctic Observatory',lat:64.15,lon:-21.94,cost:110,icon:'🔭'},
 {id:'santiago',name:'Andes Base',lat:-33.45,lon:-70.67,cost:120,icon:'🏔️'},
 {id:'sydney',name:'Sydney Harbour',lat:-33.87,lon:151.21,cost:130,icon:'🌏'},
 {id:'cape',name:'Cape Town Lookout',lat:-33.92,lon:18.42,cost:140,icon:'🌍'}
];

function load(k,f){try{const x=JSON.parse(localStorage.getItem(k));return x??f}catch{return f}}
function save(){localStorage.setItem(PROGRESS_KEY,JSON.stringify(progress));localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings))}
function ensureProfile(){
 profile.daily=profile.daily||{};profile.examResults=profile.examResults||{};profile.topicWeakness=profile.topicWeakness||{};profile.topicStats=profile.topicStats||{};
 profile.errorLog=profile.errorLog||[];profile.dailyChallenges=profile.dailyChallenges||{};profile.challengeStreak=profile.challengeStreak||0;profile.lastChallengeDate=profile.lastChallengeDate||'';
 profile.shopOwned=profile.shopOwned||{};profile.shopOwned.outfits=profile.shopOwned.outfits||['starter'];profile.shopOwned.locations=profile.shopOwned.locations||['home'];if(!profile.shopOwned.outfits.includes('starter'))profile.shopOwned.outfits.unshift('starter');if(!profile.shopOwned.locations.includes('home'))profile.shopOwned.locations.unshift('home');profile.equippedOutfit=profile.equippedOutfit||'starter';profile.equippedLocation=profile.equippedLocation||'home';
 if(profile.economyVersion!==2){profile.lifetimeXp=0;profile.points=0;profile.economyVersion=2}
 profile.lifetimeXp=profile.lifetimeXp||0;profile.points=profile.points||0;profile.reviews=profile.reviews||0;
 settings.dailyNew=settings.dailyNew||18;settings.physicsUnits=settings.physicsUnits||{};
}
function now(){return Date.now()} function dateKey(t=Date.now()){return new Date(t).toISOString().slice(0,10)}
function clamp(x,a,b){return Math.max(a,Math.min(b,x))} function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function daily(){const k=dateKey();if(!profile.daily[k])profile.daily[k]={reviews:0,newCards:0,flashCorrect:0,examMarks:0};return profile.daily[k]}
function state(id){const x=progress[id]||{};return {stage:-1,due:0,mastered:false,again:0,hard:0,good:0,last:0,firstSeen:'',stability:0,difficulty:5,history:[],...x}}
function setState(id,s){progress[id]=s}
function showToast(m){const e=document.getElementById('toast');e.textContent=m;e.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove('show'),1700)}
function award(points,reason=''){points=Math.max(0,Math.floor(points));if(!points)return;profile.lifetimeXp+=points;profile.points+=points;daily().examMarks+=reason==='exam'?points:0;save();showToast('+'+points+' point'+(points===1?'':'s')+' · +'+points+' XP')}
function levelInfo(xp){
 let level=1,into=xp;
 while(level<500){const req=10+5*(level-1);if(into<req)return {level,into,req};into-=req;level++}
 return {level:500,into:0,req:0};
}
function memoryHealth(c){const s=state(c.id);if(s.stage<0)return 0;if(!s.last)return .5;const stability=Math.max(.25,s.stability||3),elapsed=Math.max(0,(now()-s.last)/DAY);return clamp(Math.exp(-0.1053605*elapsed/stability),0,1)}
function topicKey(s,t){return s+'|'+t}
function topicStat(s,t){const k=topicKey(s,t);if(!profile.topicStats[k])profile.topicStats[k]={attempts:0,success:0,examMarks:0,examMax:0,last:0,lastMiss:0};return profile.topicStats[k]}
function weakness(c){const s=state(c.id),tw=profile.topicWeakness[topicKey(c.subject,c.topic)]||0;return (c.priority||1)*3+(s.again||0)*2.6+(s.hard||0)*1.6+tw*2+(1-memoryHealth(c))*8-(s.good||0)*.2}
function isDue(c){const s=state(c.id);return s.stage>=0&&(s.due||0)<=now()} function isNew(c){return state(c.id).stage<0}
function addError(e){profile.errorLog.unshift({...e,date:now()});if(profile.errorLog.length>400)profile.errorLog.length=400}

async function sha256(s){const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('')}
async function unlock(pin,remember){
 const h=await sha256('revision-loop|'+pin);if(h!==PIN_HASH)return false;
 if(remember)localStorage.setItem('rl_auth','1');else sessionStorage.setItem('rl_auth','1');
 document.getElementById('authGate').classList.add('hidden');document.getElementById('app').classList.remove('app-locked');return true;
}
function lockApp(){localStorage.removeItem('rl_auth');sessionStorage.removeItem('rl_auth');document.getElementById('authGate').classList.remove('hidden');document.getElementById('app').classList.add('app-locked');document.getElementById('pinInput').value='';document.getElementById('pinInput').focus()}

function initPhysicsUnits(){(deckMeta.physicsUnits||[]).forEach(u=>{if(settings.physicsUnits[u.id]===undefined)settings.physicsUnits[u.id]=!!u.defaultUnlocked})}
function physicsUnlocked(c){if(c.subject!=='Physics'||!c.unit)return true;const u=(deckMeta.physicsUnits||[]).find(x=>x.id===c.unit);return settings.physicsUnits[c.unit]!==undefined?settings.physicsUnits[c.unit]!==false:(u?!!u.defaultUnlocked:true)}
function taughtCard(c){if(c.subject==='Physics')return physicsUnlocked(c)&&c.taught!==false;return c.taught===true}
function subjectCards(sub){return cards.filter(c=>c.active!==false&&c.subject===sub&&(sub!=='Physics'||physicsUnlocked(c)))}
function subjectExam(sub){return examQuestions.filter(q=>q.subject===sub&&(!(q.unit&&sub==='Physics')||physicsUnlocked({subject:'Physics',unit:q.unit})))}

function normalise(x){let s=String(x||'').normalize('NFKD').toLowerCase();const r=[[/θ/g,' theta '],[/λ/g,' lambda '],[/ρ/g,' rho '],[/δ|Δ/g,' delta '],[/φ/g,' phi '],[/ε/g,' epsilon '],[/²/g,'^2'],[/³/g,'^3'],[/−/g,'-'],[/×/g,' x '],[/÷/g,' / '],[/\bcosine\b/g,'cos'],[/\bsine\b/g,'sin'],[/\bperp\b/g,'perpendicular'],[/\bdegrees?\b/g,'']];r.forEach(a=>s=s.replace(a[0],a[1]));return s.replace(/[^a-z0-9+\-*/=<>^.[\] ]+/g,' ').replace(/\s+/g,' ').trim()}
const STOP=new Set(['the','a','an','of','to','and','in','is','are','with','at','on','for','from','by','it','be','as','or','that','this','using','use','one','each','then','so']);
function tokens(s){return normalise(s).split(' ').filter(x=>x&&!STOP.has(x))}
function lev(a,b){const n=b.length;let p=Array.from({length:n+1},(_,i)=>i),c=new Array(n+1);for(let i=1;i<=a.length;i++){c[0]=i;for(let j=1;j<=n;j++)c[j]=Math.min(c[j-1]+1,p[j]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));[p,c]=[c,p]}return p[n]}
function close(a,b){if(a===b)return true;const m=Math.max(a.length,b.length),d=lev(a,b);return (m>=8&&d<=2)||(m>=4&&d<=1)}
function phraseScore(input,p){const a=tokens(input),b=tokens(p);if(!b.length)return 0;let h=0;b.forEach(t=>{if(a.some(x=>close(x,t)))h++});return h/b.length}
function compact(s){return normalise(s).replace(/\s+/g,'').replace(/epsilon/g,'e').replace(/lambda/g,'l').replace(/theta/g,'t').replace(/delta/g,'d')}
function evaluateCard(c,input){
 if(!String(input||'').trim())return {status:'neutral',score:0,text:'Model answer shown. Compare it honestly.',missing:[]};
 let best=0,missing=[];
 for(const alt of (c.accept||[])){const x=compact(input),y=compact(alt);best=Math.max(best,x===y?1:phraseScore(input,alt))}
 if(c.concepts?.length){
   let hit=0;missing=[];for(const g of c.concepts){const opts=Array.isArray(g)?g:[g];let gb=0;for(const o of opts)gb=Math.max(gb,phraseScore(input,o));if(gb>=.7)hit++;else missing.push(opts[0])}
   best=Math.max(best,hit/c.concepts.length);
 }
 if(!c.accept&&!c.concepts){best=phraseScore(input,c.back)}
 if(best>=.8)return {status:'correct',score:best,text:'Correct. Equivalent wording and ordinary spelling mistakes are accepted.',missing:[]};
 if(best>=.48)return {status:'partial',score:best,text:'Nearly there. You missed at least one key idea.',missing};
 return {status:'wrong',score:best,text:'Not enough of the required answer matched yet.',missing};
}
function markPointPrediction(answer,point){
 if(!String(answer||'').trim())return 0;
 const p=tokens(point).filter(x=>x.length>=3),a=tokens(answer);if(!p.length)return 0;
 let hits=0;for(const target of p){if(a.some(x=>close(x,target)))hits++}
 let score=hits/p.length;
 const nums=(normalise(point).match(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/g)||[]);if(nums.length){const ans=normalise(answer);const nHits=nums.filter(n=>ans.includes(n)).length;score=Math.max(score,nHits/nums.length)}
 return score;
}
function parseNumber(s){let x=String(s||'').toLowerCase().replace(/,/g,'').replace(/×/g,'x').replace(/\s+/g,'');const sci=x.match(/([-+]?\d*\.?\d+)x10\^?([-+]?\d+)/);if(sci)return Number(sci[1])*Math.pow(10,Number(sci[2]));const m=x.match(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/);return m?Number(m[0]):NaN}

function nextSchedule(s,rating){const old=Math.max(.25,s.stability||0),elapsed=s.last?Math.max(0,(now()-s.last)/DAY):0,over=old?clamp(elapsed/old,0,2):0;let stability=old,difficulty=clamp(s.difficulty||5,1,10),days;if(rating==='again'){difficulty=clamp(difficulty+.7,1,10);stability=Math.max(.25,old*.35);days=10/1440}else if(rating==='hard'){difficulty=clamp(difficulty+.2,1,10);stability=Math.max(1,old?old*1.12:1);days=Math.min(stability,1)}else if(rating==='good'){difficulty=clamp(difficulty-.08,1,10);stability=s.stage<0?3:clamp(old*(1.72+.12*over-.035*(difficulty-5)),2,365);days=stability}else{difficulty=clamp(difficulty-.3,1,10);stability=s.stage<0?7:clamp(old*(2.3+.12*over-.025*(difficulty-5)),4,365);days=stability}return {stability,difficulty,days}}
function rateCard(c,rating,answer){
 const s=state(c.id),prev=s.last||0,wasNew=s.stage<0,sch=nextSchedule(s,rating);s.last=now();s.stability=sch.stability;s.difficulty=sch.difficulty;s.due=now()+sch.days*DAY;s.stage=Math.max(0,s.stage)+(rating==='good'?1:rating==='easy'?2:0);s.mastered=s.stability>=60&&(s.good||0)>=2;if(wasNew&&!s.firstSeen){s.firstSeen=dateKey();daily().newCards++}if(rating==='again')s.again++;else if(rating==='hard')s.hard++;else s.good++;s.history=s.history||[];s.history.push({t:now(),rating,answer:String(answer||'').slice(0,250),stability:s.stability});if(s.history.length>40)s.history=s.history.slice(-40);setState(c.id,s);
 const ts=topicStat(c.subject,c.topic);ts.attempts++;ts.last=now();if(currentEvaluation?.status==='correct')ts.success++;else if(rating==='again'||rating==='hard')ts.lastMiss=now();
 if((rating==='again'||rating==='hard')&&currentEvaluation?.status!=='correct')addError({type:'card',id:c.id,subject:c.subject,topic:c.topic,result:rating,answer:String(answer||'').slice(0,300),missing:currentEvaluation?.missing||[],longGap:prev&&((now()-prev)/DAY>30)});
 profile.reviews++;daily().reviews++;save();advanceSession();
}
function awardFlashIfCorrect(){
 if(currentFlashAwarded||currentEvaluation?.status!=='correct')return;currentFlashAwarded=true;award(1,'flash');daily().flashCorrect++;
}
function overrideFlashCorrect(){
 if(currentEvaluation?.status==='correct')return;currentEvaluation={status:'correct',score:1,text:'Marked correct by you.',missing:[]};awardFlashIfCorrect();const f=document.getElementById('feedback');f.className='feedback show correct';f.textContent='Marked correct by you. +1 point / +1 XP.';document.getElementById('overrideBtn').classList.remove('show')
}

function weightedPick(items,n,weightFn){
 const pool=[...items],out=[];while(pool.length&&out.length<n){let total=0,ws=pool.map(x=>{const w=Math.max(.05,weightFn(x));total+=w;return w});let r=Math.random()*total,idx=0;for(;idx<ws.length;idx++){r-=ws[idx];if(r<=0)break}out.push(pool.splice(Math.min(idx,pool.length-1),1)[0])}return out;
}
function selectedFlashCards(){const sub=document.getElementById('flashSubject').value,base=subjectCards(sub);return flashTopics.size?base.filter(c=>flashTopics.has(c.topic)):base}
function startFlashSession(){
 const count=Number(document.getElementById('flashCount').value),pool=selectedFlashCards();if(!pool.length){showToast('Pick at least one topic');return}
 const picked=weightedPick(pool,Math.min(count,pool.length),c=>1+weakness(c)/6+(isDue(c)?4:0)+(isNew(c)?1:0));
 activeSession={kind:'flash',items:picked.map(c=>({type:'card',id:c.id})),index:0,title:'Random flashcards'};currentCardId=null;renderAll();
}
function examGroups(){
 const sub=document.getElementById('examSubject').value,all=subjectExam(sub);
 if(!examYears.size||!examTopics.size||!examTypes.size)return [];
 const eligibleGroupIds=new Set();
 for(const q of all){
   if(!examYears.has(q.year))continue;
   if(examTopics.has(q.topic)&&examTypes.has(q.questionType))eligibleGroupIds.add(q.groupId);
 }
 const map=new Map();
 for(const q of all){
   if(!eligibleGroupIds.has(q.groupId)||!examYears.has(q.year))continue;
   if(!map.has(q.groupId))map.set(q.groupId,[]);
   map.get(q.groupId).push(q);
 }
 for(const arr of map.values())arr.sort((a,b)=>String(a.groupOrder).localeCompare(String(b.groupOrder),undefined,{numeric:true}));
 return [...map.values()];
}
function groupWeakness(group){let s=0;for(const q of group){const t=profile.topicWeakness[topicKey(q.subject,q.topic)]||0,last=profile.examResults[q.id]?.last,acc=last?last.marks/last.max:0;s+=1+t*2+(1-acc)*4+(profile.errorLog.some(e=>e.type==='exam'&&e.id===q.id)?4:0)}return s/group.length}
function startExamSession(){
 const groups=examGroups(),count=Number(document.getElementById('examCount').value);if(!groups.length){showToast('No questions match those filters');return}
 let chosen;if(document.getElementById('examOrder').value==='random')chosen=[...groups].sort(()=>Math.random()-.5).slice(0,count);else chosen=weightedPick(groups,Math.min(count,groups.length),g=>1+groupWeakness(g));
 const items=[];for(const g of chosen)for(const q of g)items.push({type:'exam',id:q.id,groupId:q.groupId});
 activeSession={kind:'exam',items,index:0,title:'Random AQA exam questions'};renderAll();
}
function awardExam(q,marks,answer,missedPoints){
 const ts=topicStat(q.subject,q.topic);ts.examMarks+=marks;ts.examMax+=q.marks;ts.attempts++;ts.last=now();if(marks<q.marks)ts.lastMiss=now();
 if(!profile.examResults[q.id])profile.examResults[q.id]={attempts:[]};const rec={marks,max:q.marks,date:now(),answer:String(answer||'').slice(0,1000),missedPoints};profile.examResults[q.id].attempts.push(rec);profile.examResults[q.id].last=rec;
 let w=profile.topicWeakness[topicKey(q.subject,q.topic)]||0;if(marks/q.marks<.5)w=Math.min(10,w+2);else if(marks<q.marks)w=Math.min(10,w+1);else w=Math.max(0,w-1);profile.topicWeakness[topicKey(q.subject,q.topic)]=w;
 if(marks<q.marks)addError({type:'exam',id:q.id,subject:q.subject,topic:q.topic,result:marks+'/'+q.marks,answer:String(answer||'').slice(0,1000),missedPoints});
 award(marks,'exam');save();advanceSession();
}

function challengeCards(sub,scope){let a=cards.filter(c=>c.active!==false&&(!sub||c.subject===sub));return scope==='mock'?a.filter(c=>c.mock===true):a.filter(taughtCard)}
function challengeQuestions(sub,scope){let q=examQuestions.filter(x=>(!sub||x.subject===sub));if(scope==='mock')q=q.filter(x=>x.level==='AS');return q.filter(x=>x.subject!=='Physics'||!x.unit||physicsUnlocked({subject:'Physics',unit:x.unit}))}
function makeChallenge(sub,scope){
 const key=dateKey()+'|'+(sub||'All')+'|'+scope;if(profile.dailyChallenges[key])return {key,...profile.dailyChallenges[key]};
 const cpool=challengeCards(sub,scope),weak=[...cpool].sort((a,b)=>weakness(b)-weakness(a)),items=[],used=new Set();
 for(const c of weak){if(items.length>=3)break;if(!used.has(c.topic)){items.push({type:'card',id:c.id});used.add(c.topic)}}
 const old=[...cpool].filter(c=>state(c.id).stage>=0&&!items.some(i=>i.id===c.id)).sort((a,b)=>(state(a.id).last||0)-(state(b.id).last||0));if(old[0])items.push({type:'card',id:old[0].id});
 const random=[...cpool].filter(c=>!items.some(i=>i.id===c.id)).sort(()=>Math.random()-.5);if(random[0])items.push({type:'card',id:random[0].id});
 const qgroups=new Map();for(const q of challengeQuestions(sub,scope)){if(!qgroups.has(q.groupId))qgroups.set(q.groupId,[]);qgroups.get(q.groupId).push(q)}
 const chosen=weightedPick([...qgroups.values()],2,g=>1+groupWeakness(g));for(const g of chosen){g.sort((a,b)=>String(a.groupOrder).localeCompare(String(b.groupOrder),undefined,{numeric:true}));for(const q of g)items.push({type:'exam',id:q.id,groupId:q.groupId})}
 const s={items,index:0,done:false,subject:sub||'',scope};profile.dailyChallenges[key]=s;save();return {key,...s};
}
function startChallenge(){const sub=document.getElementById('challengeSubject').value,scope=document.getElementById('challengeScope').value,s=makeChallenge(sub,scope);const stored=profile.dailyChallenges[s.key];if(stored.done)stored.index=0;activeSession={kind:'daily',key:s.key,...stored,title:'Daily starter'};switchPanel('study');renderAll()}
function startMistakes(){const items=[],seen=new Set();for(const e of profile.errorLog){const k=e.type+'|'+e.id;if(seen.has(k))continue;seen.add(k);items.push({type:e.type==='exam'?'exam':'card',id:e.id});if(items.length>=15)break}if(!items.length){showToast('No mistakes recorded yet');return}activeSession={kind:'mistakes',items,index:0,title:'Mistake bank'};switchPanel('study');renderAll()}
function advanceSession(){
 currentCardId=null;currentEvaluation=null;currentFlashAwarded=false;currentExamScore=0;
 if(!activeSession){renderAll();return}activeSession.index++;
 if(activeSession.kind==='daily'){const s=profile.dailyChallenges[activeSession.key];s.index=activeSession.index;if(activeSession.index>=activeSession.items.length){s.done=true;const today=dateKey(),y=new Date(Date.now()-DAY).toISOString().slice(0,10);if(profile.lastChallengeDate!==today){profile.challengeStreak=profile.lastChallengeDate===y?profile.challengeStreak+1:1;profile.lastChallengeDate=today}activeSession=null}else activeSession={...activeSession,index:s.index};save()}
 else if(activeSession.index>=activeSession.items.length)activeSession={...activeSession,done:true};
 renderAll();
}

function diagram(t){
 const S='<svg viewBox="0 0 360 170" aria-hidden="true">';
 if(t==='resolve')return S+'<line x1="55" y1="135" x2="275" y2="50" stroke="#2563eb" stroke-width="5"/><line x1="55" y1="135" x2="275" y2="135" stroke="#94a3b8" stroke-width="3"/><line x1="275" y1="135" x2="275" y2="50" stroke="#94a3b8" stroke-width="3"/><text x="112" y="119" font-size="17">θ</text><text x="145" y="158" font-size="14">adjacent → cos</text><text x="280" y="96" font-size="14">opposite → sin</text></svg>';
 if(t==='slope')return S+'<polygon points="40,145 310,145 310,55" fill="#e2e8f0"/><rect x="185" y="79" width="56" height="34" rx="5" transform="rotate(-18 213 96)" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><line x1="213" y1="96" x2="213" y2="154" stroke="#0f172a" stroke-width="3"/><text x="220" y="151" font-size="14">mg</text><line x1="213" y1="96" x2="155" y2="115" stroke="#b45309" stroke-width="4"/><text x="75" y="112" font-size="13">mg sin θ</text><line x1="213" y1="96" x2="233" y2="42" stroke="#15803d" stroke-width="4"/><text x="239" y="43" font-size="14">R</text><text x="241" y="124" font-size="13">mg cos θ</text></svg>';
 if(t==='couple')return S+'<rect x="78" y="66" width="204" height="44" rx="8" fill="#f1f5f9" stroke="#64748b"/><line x1="112" y1="140" x2="112" y2="38" stroke="#2563eb" stroke-width="5"/><line x1="248" y1="35" x2="248" y2="138" stroke="#2563eb" stroke-width="5"/><line x1="112" y1="22" x2="248" y2="22" stroke="#0f172a"/><text x="177" y="16" font-size="15">d</text><text x="127" y="94" font-size="16">moment = Fd</text></svg>';
 if(t==='displacement-time')return S+'<line x1="48" y1="140" x2="320" y2="140" stroke="#0f172a" stroke-width="2"/><line x1="48" y1="140" x2="48" y2="24" stroke="#0f172a" stroke-width="2"/><path d="M55 128 C105 123 130 102 165 76 S238 42 308 36" fill="none" stroke="#2563eb" stroke-width="5"/><line x1="150" y1="94" x2="235" y2="48" stroke="#b45309" stroke-width="2" stroke-dasharray="6 5"/><text x="118" y="158" font-size="13">gradient = velocity</text></svg>';
 if(t==='velocity-time')return S+'<line x1="48" y1="88" x2="320" y2="88" stroke="#0f172a" stroke-width="2"/><line x1="48" y1="145" x2="48" y2="24" stroke="#0f172a" stroke-width="2"/><path d="M55 128 L135 42 L220 42 L308 108" fill="none" stroke="#2563eb" stroke-width="5"/><text x="95" y="160" font-size="13">gradient = a • area = displacement</text></svg>';
 if(t==='acceleration-time')return S+'<line x1="48" y1="92" x2="320" y2="92" stroke="#0f172a" stroke-width="2"/><line x1="48" y1="145" x2="48" y2="24" stroke="#0f172a" stroke-width="2"/><path d="M55 50 L145 50 L145 123 L230 123 L230 68 L308 68" fill="none" stroke="#2563eb" stroke-width="5"/><text x="128" y="158" font-size="13">signed area = Δv</text></svg>';
 if(t==='projectile')return S+'<path d="M48 130 Q178 18 315 130" fill="none" stroke="#2563eb" stroke-width="5"/><line x1="48" y1="130" x2="310" y2="130" stroke="#94a3b8" stroke-width="2"/><text x="54" y="60" font-size="13">vertical a = −g</text><text x="175" y="148" font-size="13">horizontal v constant</text></svg>';
 if(t==='moment')return S+'<line x1="48" y1="105" x2="318" y2="105" stroke="#64748b" stroke-width="7"/><polygon points="175,105 160,135 190,135" fill="#0f172a"/><line x1="270" y1="36" x2="270" y2="105" stroke="#2563eb" stroke-width="5"/><line x1="175" y1="45" x2="270" y2="45" stroke="#b45309" stroke-width="2" stroke-dasharray="5 4"/><text x="207" y="38" font-size="14">d⊥</text><text x="256" y="28" font-size="14">F</text></svg>';
 if(t==='internal-resistance')return S+'<line x1="48" y1="132" x2="320" y2="132" stroke="#0f172a" stroke-width="2"/><line x1="48" y1="145" x2="48" y2="25" stroke="#0f172a" stroke-width="2"/><line x1="67" y1="43" x2="300" y2="121" stroke="#2563eb" stroke-width="5"/><text x="75" y="35" font-size="14">intercept = ε</text><text x="155" y="90" font-size="14">gradient = −r</text></svg>';
 if(t==='photoelectric')return S+'<rect x="176" y="86" width="125" height="38" rx="5" fill="#94a3b8"/><line x1="67" y1="45" x2="177" y2="95" stroke="#f59e0b" stroke-width="5"/><circle cx="201" cy="102" r="7" fill="#2563eb"/><path d="M205 98 Q238 62 281 48" fill="none" stroke="#2563eb" stroke-width="4"/><text x="50" y="35" font-size="14">photon E = hf</text><text x="222" y="42" font-size="14">hf ≥ φ</text></svg>';
 if(t==='stationary')return S+'<line x1="40" y1="90" x2="320" y2="90" stroke="#64748b" stroke-width="2"/><path d="M45 90 Q80 32 115 90 T185 90 T255 90 T315 90" fill="none" stroke="#2563eb" stroke-width="5"/><circle cx="45" cy="90" r="4"/><circle cx="115" cy="90" r="4"/><circle cx="185" cy="90" r="4"/><text x="130" y="150" font-size="14">node spacing = λ/2</text></svg>';
 if(t==='young')return S+'<line x1="55" y1="46" x2="305" y2="46" stroke="#0f172a" stroke-width="4"/><line x1="82" y1="46" x2="82" y2="144" stroke="#2563eb" stroke-width="3"/><line x1="278" y1="46" x2="278" y2="144" stroke="#2563eb" stroke-width="3"/><circle cx="278" cy="145" r="12" fill="#64748b"/><text x="112" y="121" font-size="14">E = FL/(AΔL)</text></svg>';
 if(t==='back-titration')return S+'<rect x="80" y="39" width="34" height="95" fill="#dbeafe" stroke="#2563eb"/><path d="M190 138 L270 138 L252 96 L208 96 Z" fill="#fef3c7" stroke="#64748b"/><text x="118" y="159" font-size="13">initial − leftover = reacted</text></svg>';
 if(t==='arrhenius')return S+'<line x1="52" y1="138" x2="318" y2="138" stroke="#0f172a" stroke-width="2"/><line x1="52" y1="138" x2="52" y2="25" stroke="#0f172a" stroke-width="2"/><line x1="72" y1="48" x2="296" y2="126" stroke="#2563eb" stroke-width="5"/><text x="98" y="52" font-size="14">gradient = −Ea/R</text><text x="25" y="25" font-size="13">ln k</text><text x="292" y="157" font-size="13">1/T</text></svg>';
 if(t==='circular')return S+'<circle cx="180" cy="88" r="58" fill="none" stroke="#cbd5e1" stroke-width="3"/><circle cx="238" cy="88" r="7" fill="#2563eb"/><line x1="238" y1="88" x2="183" y2="88" stroke="#b91c1c" stroke-width="4"/><line x1="238" y1="88" x2="238" y2="36" stroke="#15803d" stroke-width="4"/><text x="190" y="80" font-size="13">a, F inward</text><text x="246" y="50" font-size="13">v tangent</text></svg>';
 if(t==='shm')return S+'<line x1="45" y1="92" x2="315" y2="92" stroke="#94a3b8" stroke-width="2"/><path d="M48 92 C82 30 115 30 148 92 S215 154 248 92 S282 30 315 92" fill="none" stroke="#2563eb" stroke-width="5"/><text x="112" y="162" font-size="14">a = −ω²x</text></svg>';
 return '';
}

function renderLevel(){const li=levelInfo(profile.lifetimeXp);document.getElementById('levelNum').textContent=li.level;document.getElementById('xpTotal').textContent=profile.lifetimeXp+' XP';document.getElementById('pointBalance').textContent=profile.points;document.getElementById('xpNext').textContent=li.level>=500?'Maximum level reached':(li.req-li.into)+' XP to level '+(li.level+1);document.getElementById('xpBar').style.width=(li.level>=500?100:clamp(li.into/li.req*100,0,100))+'%'}
function renderStats(){document.getElementById('dueCount').textContent=cards.filter(c=>c.active!==false&&isDue(c)).length;document.getElementById('newCount').textContent=daily().newCards;document.getElementById('reviewedCount').textContent=daily().reviews;document.getElementById('masteredCount').textContent=cards.filter(c=>state(c.id).mastered).length}
function renderAvatar(){const o=OUTFITS.find(x=>x.id===profile.equippedOutfit)||OUTFITS[0],l=LOCATIONS.find(x=>x.id===profile.equippedLocation)||LOCATIONS[0];document.getElementById('miniAvatar').textContent=o.icon;document.getElementById('characterPreview').textContent=o.icon;document.getElementById('equippedName').textContent=o.name;document.getElementById('equippedLocation').textContent=l.name;document.getElementById('shopPoints').textContent=profile.points;selectedLocation=l.id}
function renderChallenge(){document.getElementById('challengeStreak').textContent=profile.challengeStreak+' day'+(profile.challengeStreak===1?'':'s')+' streak';const sub=document.getElementById('challengeSubject').value,scope=document.getElementById('challengeScope').value,key=dateKey()+'|'+(sub||'All')+'|'+scope,s=profile.dailyChallenges[key];document.getElementById('challengeStatus').textContent=s?(s.done?'Completed today':(s.index||0)+' / '+s.items.length+' completed'):'Not started yet';document.getElementById('startChallenge').textContent=s&&!s.done?'Resume challenge':s?.done?'Review challenge':'Start today’s challenge'}
function renderPhysicsManager(){const sub=document.getElementById('flashSubject').value,box=document.getElementById('physicsUnitManager');box.classList.toggle('hidden',sub!=='Physics');if(sub!=='Physics')return;document.getElementById('physicsUnitList').innerHTML=(deckMeta.physicsUnits||[]).map(u=>{const checked=settings.physicsUnits[u.id]!==false,count=cards.filter(c=>c.active!==false&&c.subject==='Physics'&&c.unit===u.id).length;return '<label class="unit-toggle '+(checked?'':'locked')+'"><input type="checkbox" data-unit="'+esc(u.id)+'" '+(checked?'checked':'')+'><span><strong>'+(checked?'🔓 ':'🔒 ')+esc(u.label)+'</strong><small>'+count+' flashcards</small></span></label>'}).join('');document.querySelectorAll('[data-unit]').forEach(el=>el.onchange=()=>{settings.physicsUnits[el.dataset.unit]=el.checked;save();refreshFlashTopics(false);refreshExamFilters(false);renderPhysicsManager()})}
function refreshFlashTopics(defaultIfEmpty=false){
 const sub=document.getElementById('flashSubject').value,topics=[...new Set(subjectCards(sub).map(c=>c.topic))].sort();flashTopics=new Set([...flashTopics].filter(t=>topics.includes(t)));if(defaultIfEmpty&&!flashTopics.size)topics.filter(t=>subjectCards(sub).some(c=>c.topic===t&&c.taught)).forEach(t=>flashTopics.add(t));
 document.getElementById('flashTopics').innerHTML=topics.map(t=>'<label class="check-item"><input type="checkbox" data-flash-topic="'+esc(t)+'" '+(flashTopics.has(t)?'checked':'')+'><span>'+esc(t)+'</span></label>').join('');document.querySelectorAll('[data-flash-topic]').forEach(el=>el.onchange=()=>{el.checked?flashTopics.add(el.dataset.flashTopic):flashTopics.delete(el.dataset.flashTopic);renderTopicCounts()});renderTopicCounts();renderPhysicsManager()
}
function applyFlashPreset(p){const sub=document.getElementById('flashSubject').value,base=subjectCards(sub);flashTopics.clear();if(p!=='clear'){let pick=base;if(p==='mock')pick=base.filter(c=>c.mock===true);if(p==='taught')pick=base.filter(taughtCard);for(const c of pick)flashTopics.add(c.topic)}refreshFlashTopics(false)}
function refreshExamFilters(defaultIfEmpty=false){
 const sub=document.getElementById('examSubject').value,base=subjectExam(sub),years=[...new Set(base.map(q=>q.year))].sort((a,b)=>b-a),topics=[...new Set(base.map(q=>q.topic))].sort(),types=[...new Set(base.map(q=>q.questionType).filter(Boolean))].sort();
 examYears=new Set([...examYears].filter(y=>years.includes(y)));examTopics=new Set([...examTopics].filter(t=>topics.includes(t)));examTypes=new Set([...examTypes].filter(t=>types.includes(t)));
 if(defaultIfEmpty&&!examYears.size)years.forEach(y=>examYears.add(y));if(defaultIfEmpty&&!examTopics.size)topics.forEach(t=>examTopics.add(t));if(defaultIfEmpty&&!examTypes.size)types.forEach(t=>examTypes.add(t));
 document.getElementById('examYears').innerHTML=years.map(y=>'<label class="check-item"><input type="checkbox" data-exam-year="'+y+'" '+(examYears.has(y)?'checked':'')+'><span>'+y+'</span></label>').join('');
 document.getElementById('examTopics').innerHTML=topics.map(t=>'<label class="check-item"><input type="checkbox" data-exam-topic="'+esc(t)+'" '+(examTopics.has(t)?'checked':'')+'><span>'+esc(t)+'</span></label>').join('');
 document.getElementById('examTypes').innerHTML=types.map(t=>'<label class="check-item"><input type="checkbox" data-exam-type="'+esc(t)+'" '+(examTypes.has(t)?'checked':'')+'><span>'+esc(t)+'</span></label>').join('');
 document.querySelectorAll('[data-exam-year]').forEach(el=>el.onchange=()=>{el.checked?examYears.add(Number(el.dataset.examYear)):examYears.delete(Number(el.dataset.examYear));renderTopicCounts()});
 document.querySelectorAll('[data-exam-topic]').forEach(el=>el.onchange=()=>{el.checked?examTopics.add(el.dataset.examTopic):examTopics.delete(el.dataset.examTopic);renderTopicCounts()});
 document.querySelectorAll('[data-exam-type]').forEach(el=>el.onchange=()=>{el.checked?examTypes.add(el.dataset.examType):examTypes.delete(el.dataset.examType)});
 renderTopicCounts();
 const yearsText=years.length?years.slice().sort((a,b)=>a-b).join(', '):'none';
 document.getElementById('examCoverage').textContent='Verified bank: '+base.length+' question parts from '+yearsText+'. Linked parts from the same original question stay together. Older papers are added only when an official AQA source can be verified.';
}
function renderTopicCounts(){document.getElementById('flashTopicCount').textContent=flashTopics.size+' selected';document.getElementById('examTopicCount').textContent=examTopics.size+' selected';document.getElementById('examYearCount').textContent=examYears.size+' selected'}
function renderStudyType(){document.querySelectorAll('.study-type-btn').forEach(b=>b.classList.toggle('active',b.dataset.study===studyType));document.getElementById('flashControls').classList.toggle('hidden',studyType!=='flashcards');document.getElementById('examControls').classList.toggle('hidden',studyType!=='exam')}
function renderSessionBanner(){const e=document.getElementById('sessionBanner');if(!activeSession||activeSession.done){e.classList.add('hidden');return}e.classList.remove('hidden');e.textContent=activeSession.title+' · '+Math.min(activeSession.index+1,activeSession.items.length)+' / '+activeSession.items.length}
function renderCard(c){
 currentCardId=c.id;currentEvaluation=null;currentFlashAwarded=false;const s=state(c.id),health=Math.round(memoryHealth(c)*100),diag=c.visual?diagram(c.visual):'';
 document.getElementById('studyHost').innerHTML='<article class="review-card"><div class="card-meta"><div class="meta-left"><span class="badge">'+esc(c.subject)+' · '+esc(c.topic)+'</span><span class="badge">'+esc(c.kind==='content'?'knowledge':c.kind)+'</span></div><span class="queue-pos">memory '+health+'%</span></div><div class="card-body">'+(diag?'<div class="diagram">'+diag+'</div>':'')+'<div class="question">'+esc(c.front)+'</div><textarea id="answerInput" class="answer-input" placeholder="Type your answer from memory…"></textarea><div class="answer-actions"><button id="checkCard" class="check-btn">Check answer</button><button id="revealCard" class="show-btn">Just reveal</button></div><div id="feedback" class="feedback"></div><div id="modelAnswer" class="model-answer"><b>Model answer:</b> '+esc(c.back)+'<div id="missingIdeas"></div></div><button id="overrideBtn" class="override-btn">My answer was actually correct</button><div id="ratings" class="ratings"><button class="rating again" data-rating="again">Again<small>~10 min</small></button><button class="rating hard" data-rating="hard">Hard<small>~1 day</small></button><button class="rating good" data-rating="good">Good<small>longer gap</small></button><button class="rating easy" data-rating="easy">Easy<small>much longer</small></button></div></div></article>';
 const reveal=(check)=>{const input=document.getElementById('answerInput').value;currentEvaluation=check?evaluateCard(c,input):{status:'neutral',score:0,text:'Model answer shown. Compare it honestly.',missing:[]};if(currentEvaluation.status==='correct')awardFlashIfCorrect();const f=document.getElementById('feedback');f.className='feedback show '+currentEvaluation.status;f.textContent=currentEvaluation.text;document.getElementById('modelAnswer').classList.add('show');if(currentEvaluation.missing?.length)document.getElementById('missingIdeas').innerHTML='<ul class="missing-list">'+currentEvaluation.missing.map(x=>'<li>Missing: '+esc(x)+'</li>').join('')+'</ul>';document.getElementById('ratings').classList.add('show');if(currentEvaluation.status!=='correct')document.getElementById('overrideBtn').classList.add('show')};
 document.getElementById('checkCard').onclick=()=>reveal(true);document.getElementById('revealCard').onclick=()=>reveal(false);document.getElementById('overrideBtn').onclick=overrideFlashCorrect;document.querySelectorAll('[data-rating]').forEach(b=>b.onclick=()=>rateCard(c,b.dataset.rating,document.getElementById('answerInput').value))
}
function examSuggested(q,answer){
 const preds=q.markPoints.map(p=>markPointPrediction(answer,p)>=.42);let suggested=Math.round(preds.filter(Boolean).length/Math.max(1,q.markPoints.length)*q.marks);
 if(q.answerType==='numeric'&&Number.isFinite(q.numericAnswer)){const n=parseNumber(answer);if(Number.isFinite(n)&&Math.abs(n-q.numericAnswer)<=q.tolerance)suggested=Math.max(suggested,Math.min(q.marks,1+(q.marks>1?Math.floor(q.marks/2):0)))}
 return {preds,suggested:clamp(suggested,0,q.marks)};
}
function renderExam(q){
 const prev=profile.examResults[q.id]?.last;
 document.getElementById('studyHost').innerHTML='<article class="exam-card"><div class="card-meta"><div class="meta-left"><span class="badge real">Real AQA source</span><span class="badge">'+esc(q.subject)+' · '+esc(q.level)+'</span><span class="badge">'+esc(q.topic)+'</span></div><span class="queue-pos">'+esc(q.year+' '+q.paper+' Q'+q.question)+' · '+q.marks+' marks</span></div><div class="card-body"><div class="copyright-note">The in-app wording is a faithful paraphrase. Use the official AQA PDF for the exact copyrighted wording.</div><div class="question-type">'+esc(q.questionType||'exam question')+'</div><div class="question">'+esc(q.prompt)+'</div><textarea id="examAnswer" class="answer-input" placeholder="Write your full working / answer here…"></textarea><div class="exam-source"><a class="source-link" target="_blank" rel="noopener" href="'+esc(q.qpUrl)+'">Original AQA question</a><a class="source-link" target="_blank" rel="noopener" href="'+esc(q.msUrl)+'">Official mark scheme</a></div>'+(prev?'<div class="question-type">Previous score: '+prev.marks+'/'+prev.max+'</div>':'')+'<button id="markExam" class="check-btn">Mark my answer</button><div id="examFeedback" class="feedback"></div><div id="examMarking" class="markscheme"></div><div id="scoreEditor" class="score-editor"></div></div></article>';
 document.getElementById('markExam').onclick=()=>{const answer=document.getElementById('examAnswer').value,res=examSuggested(q,answer),marking=document.getElementById('examMarking');marking.classList.add('show');marking.innerHTML='<b>Mark-scheme points:</b><div class="markpoint-grid">'+q.markPoints.map((p,i)=>'<label class="markpoint '+(res.preds[i]?'predicted':'')+'"><input type="checkbox" data-mp="'+i+'" '+(res.preds[i]?'checked':'')+'><span>'+esc(p)+'</span></label>').join('')+'</div>'+(q.modelAnswer?'<p><b>Model outcome:</b> '+esc(q.modelAnswer)+'</p>':'')+(q.answerType==='numeric'?'<p><b>Official final answer:</b> '+q.numericAnswer+(q.unit?' '+esc(q.unit):'')+'</p>':'');
   currentExamScore=res.suggested;renderScoreEditor(q,answer);
   document.querySelectorAll('[data-mp]').forEach(el=>el.onchange=()=>{const checked=[...document.querySelectorAll('[data-mp]')].filter(x=>x.checked).length;currentExamScore=clamp(Math.round(checked/Math.max(1,q.markPoints.length)*q.marks),0,q.marks);renderScoreEditor(q,answer)});
 };
}
function renderScoreEditor(q,answer){const ed=document.getElementById('scoreEditor');ed.classList.add('show');const missed=q.markPoints.filter((_,i)=>!document.querySelector('[data-mp="'+i+'"]')?.checked);ed.innerHTML='<div class="score-line"><strong>Suggested mark: '+currentExamScore+'/'+q.marks+'</strong><span>Tap a mark to correct it</span></div><div class="mark-buttons">'+Array.from({length:q.marks+1},(_,i)=>'<button class="mark-btn '+(i===currentExamScore?'selected':'')+'" data-score="'+i+'">'+i+'</button>').join('')+'</div>'+(missed.length?'<div class="missed-summary"><b>Likely missing:</b> '+missed.map(esc).join(' • ')+'</div>':'<div class="feedback show correct">No mark-scheme point is currently flagged as missing.</div>')+'<button id="saveExamScore" class="primary-btn save-score">Save '+currentExamScore+'/'+q.marks+'</button>';document.querySelectorAll('[data-score]').forEach(b=>b.onclick=()=>{currentExamScore=Number(b.dataset.score);renderScoreEditor(q,answer)});document.getElementById('saveExamScore').onclick=()=>{const mp=q.markPoints.filter((_,i)=>!document.querySelector('[data-mp="'+i+'"]')?.checked);awardExam(q,currentExamScore,answer,mp)}}
function renderStudy(){
 renderStudyType();renderSessionBanner();
 if(activeSession?.done){document.getElementById('studyHost').innerHTML='<div class="empty-card"><h3>Session complete</h3><p>Your results have been saved into the memory and weakness model.</p><button id="endSession" class="primary-small">Finish</button></div>';document.getElementById('endSession').onclick=()=>{activeSession=null;renderAll()};return}
 if(!activeSession){document.getElementById('studyHost').innerHTML='<div class="empty-card"><h3>Choose what you want to revise</h3><p>Select multiple topics above, then start a random session. Weak areas are more likely to appear without making the order predictable.</p></div>';return}
 const item=activeSession.items[activeSession.index];if(!item){activeSession.done=true;renderStudy();return}const obj=item.type==='card'?cards.find(c=>c.id===item.id):examQuestions.find(q=>q.id===item.id);if(!obj){activeSession.index++;renderStudy();return}item.type==='card'?renderCard(obj):renderExam(obj)
}
function renderWeak(){
 const a=cards.filter(c=>c.active!==false).sort((x,y)=>weakness(y)-weakness(x)).slice(0,50);document.getElementById('weakList').innerHTML=a.map(c=>{const h=Math.round(memoryHealth(c)*100),ts=topicStat(c.subject,c.topic),acc=ts.examMax?Math.round(ts.examMarks/ts.examMax*100):null,cls=h>=85?'memory-good':h>=60?'memory-mid':'memory-low';return '<div class="list-row"><div><strong>'+esc(c.topic)+'</strong><small>'+esc(c.subject)+' · memory '+h+'%'+(acc!==null?' · exam '+acc+'%':'')+'</small></div><span class="memory-pill '+cls+'">'+Math.round(weakness(c))+'</span></div>'}).join('');
 const r=profile.errorLog.slice(0,30);document.getElementById('mistakeList').innerHTML=r.length?r.map(e=>'<div class="list-row"><div><strong>'+esc(e.topic)+'</strong><small>'+esc(e.subject)+' · '+esc(e.type==='exam'?'exam '+e.result:e.result)+(e.missedPoints?.length?' · missed: '+esc(e.missedPoints.slice(0,2).join(' / ')):'')+'</small></div><span class="score-pill">'+new Date(e.date).toLocaleDateString(undefined,{day:'numeric',month:'short'})+'</span></div>').join(''):'<div class="empty-card">No recorded mistakes yet.</div>'
}
function renderProgress(){
 document.getElementById('subjectProgress').innerHTML=['Physics','Chemistry','Maths'].map(sub=>{const a=cards.filter(c=>c.active!==false&&c.subject===sub),started=a.filter(c=>state(c.id).stage>=0),mature=a.filter(c=>state(c.id).mastered).length,avg=started.length?Math.round(started.map(memoryHealth).reduce((x,y)=>x+y,0)/started.length*100):0,ts=Object.entries(profile.topicStats).filter(([k])=>k.startsWith(sub+'|')).map(([,v])=>v),em=ts.reduce((x,v)=>x+(v.examMarks||0),0),ex=ts.reduce((x,v)=>x+(v.examMax||0),0);return '<div class="progress-card"><div class="subject-progress-head"><span>'+sub+'</span><span>'+mature+' mature / '+a.length+'</span></div><div class="bar-track"><div class="bar-fill" style="width:'+(a.length?mature/a.length*100:0)+'%"></div></div><div class="progress-note">'+started.length+' started · predicted recall '+avg+'%'+(ex?' · exam '+em+'/'+ex:'')+'</div></div>'}).join('');
 const started=cards.filter(c=>state(c.id).stage>=0),avg=started.length?Math.round(started.map(memoryHealth).reduce((a,b)=>a+b,0)/started.length*100):0,long=started.filter(c=>state(c.id).stability>=90).length;document.getElementById('retentionCard').innerHTML='<h3>Retention model</h3><div class="schedule-row"><span>Average predicted recall</span><b>'+avg+'%</b></div><div class="schedule-row"><span>Cards stable for 3+ months</span><b>'+long+'</b></div><div class="schedule-row"><span>Recorded mistakes</span><b>'+profile.errorLog.length+'</b></div>'
}

function buy(kind,id){
 const arr=kind==='outfit'?OUTFITS:LOCATIONS,item=arr.find(x=>x.id===id),owned=kind==='outfit'?profile.shopOwned.outfits:profile.shopOwned.locations;if(!item)return;
 if(owned.includes(id)){if(kind==='outfit')profile.equippedOutfit=id;else profile.equippedLocation=id;save();renderAll();return}
 if(profile.points<item.cost){showToast('Not enough points yet');return}profile.points-=item.cost;owned.push(id);if(kind==='outfit')profile.equippedOutfit=id;else profile.equippedLocation=id;save();showToast('Unlocked '+item.name);renderAll()
}
function renderShop(){
 const oo=profile.shopOwned.outfits,ol=profile.shopOwned.locations;document.getElementById('outfitShop').innerHTML=OUTFITS.map(x=>'<div class="shop-item"><div class="shop-icon">'+x.icon+'</div><b>'+esc(x.name)+'</b><small>'+esc(x.desc)+'</small><button class="'+(!oo.includes(x.id)?'buy':'')+'" data-outfit="'+x.id+'" '+(!oo.includes(x.id)&&profile.points<x.cost?'disabled':'')+'>'+(oo.includes(x.id)?(profile.equippedOutfit===x.id?'Equipped':'Equip'):x.cost+' points')+'</button></div>').join('');
 document.getElementById('locationShop').innerHTML=LOCATIONS.map(x=>'<div class="shop-item"><div class="shop-icon">'+x.icon+'</div><b>'+esc(x.name)+'</b><small>'+x.lat.toFixed(1)+'°, '+x.lon.toFixed(1)+'°</small><button class="'+(!ol.includes(x.id)?'buy':'')+'" data-location="'+x.id+'" '+(!ol.includes(x.id)&&profile.points<x.cost?'disabled':'')+'>'+(ol.includes(x.id)?(profile.equippedLocation===x.id?'Equipped':'Use location'):x.cost+' points')+'</button></div>').join('');
 document.querySelectorAll('[data-outfit]').forEach(b=>b.onclick=()=>buy('outfit',b.dataset.outfit));document.querySelectorAll('[data-location]').forEach(b=>b.onclick=()=>buy('location',b.dataset.location));drawGlobe()
}
function project(lat,lon,w,h){const la=lat*Math.PI/180,lo=(lon-globeLon)*Math.PI/180,cl=globeLat*Math.PI/180,x=Math.cos(la)*Math.sin(lo),y=Math.sin(la)*Math.cos(cl)-Math.cos(la)*Math.cos(lo)*Math.sin(cl),z=Math.sin(la)*Math.sin(cl)+Math.cos(la)*Math.cos(lo)*Math.cos(cl);const R=Math.min(w,h)*.4;return {x:w/2+x*R,y:h/2-y*R,z}}
function drawGlobe(){
 const c=document.getElementById('globe');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height,R=Math.min(w,h)*.4;ctx.clearRect(0,0,w,h);const g=ctx.createRadialGradient(w*.42,h*.35,R*.05,w/2,h/2,R);g.addColorStop(0,'#bfdbfe');g.addColorStop(.55,'#2563eb');g.addColorStop(1,'#0f172a');ctx.fillStyle=g;ctx.beginPath();ctx.arc(w/2,h/2,R,0,Math.PI*2);ctx.fill();ctx.save();ctx.beginPath();ctx.arc(w/2,h/2,R,0,Math.PI*2);ctx.clip();ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=1;
 for(let lat=-60;lat<=60;lat+=30){ctx.beginPath();let first=true;for(let lon=-180;lon<=180;lon+=4){const p=project(lat,lon,w,h);if(p.z<0)continue;if(first){ctx.moveTo(p.x,p.y);first=false}else ctx.lineTo(p.x,p.y)}ctx.stroke()}
 for(let lon=-150;lon<=180;lon+=30){ctx.beginPath();let first=true;for(let lat=-85;lat<=85;lat+=3){const p=project(lat,lon,w,h);if(p.z<0)continue;if(first){ctx.moveTo(p.x,p.y);first=false}else ctx.lineTo(p.x,p.y)}ctx.stroke()}ctx.restore();
 for(const l of LOCATIONS){const p=project(l.lat,l.lon,w,h);if(p.z<=0)continue;const owned=profile.shopOwned.locations.includes(l.id);ctx.beginPath();ctx.arc(p.x,p.y,l.id===profile.equippedLocation?7:5,0,Math.PI*2);ctx.fillStyle=l.id===profile.equippedLocation?'#fbbf24':owned?'#ffffff':'rgba(255,255,255,.28)';ctx.fill();if(l.id===selectedLocation){ctx.strokeStyle='#fbbf24';ctx.lineWidth=2;ctx.stroke()}}
 const sel=LOCATIONS.find(x=>x.id===selectedLocation);if(sel)document.getElementById('globeLabel').textContent=sel.name+' · '+(profile.shopOwned.locations.includes(sel.id)?'unlocked':sel.cost+' points')+' · drag to rotate'
}
function globePointer(e){const c=document.getElementById('globe'),r=c.getBoundingClientRect(),x=(e.clientX-r.left)*c.width/r.width,y=(e.clientY-r.top)*c.height/r.height;return {x,y}}
function nearestPin(x,y){let best=null,dist=18;for(const l of LOCATIONS){const p=project(l.lat,l.lon,700,360);if(p.z<=0)continue;const d=Math.hypot(p.x-x,p.y-y);if(d<dist){dist=d;best=l}}return best}

function renderAll(){renderLevel();renderStats();renderAvatar();renderChallenge();renderStudyType();renderSessionBanner();renderStudy();renderWeak();renderProgress();renderShop()}
async function sync(manual=false){
 try{const [dr,er]=await Promise.all([fetch(DECK_URL+'?v='+Date.now(),{cache:'no-store'}),fetch(EXAM_URL+'?v='+Date.now(),{cache:'no-store'})]);if(!dr.ok||!er.ok)throw new Error();const d=await dr.json(),e=await er.json(),old=deckVersion;cards=(d.cards||[]).filter(c=>c.active!==false);examQuestions=e.questions||[];deckMeta=d.meta||{};coverage=e.coverage||{};deckVersion=d.deckVersion||0;bankVersion=e.bankVersion||0;initPhysicsUnits();refreshFlashTopics(true);refreshExamFilters(true);document.getElementById('syncState').textContent='Deck v'+deckVersion+' · '+cards.length+' flashcards · '+examQuestions.length+' verified AQA question parts';if(manual)showToast(old&&deckVersion>old?'New revision content loaded':'Already up to date');renderAll()}catch{document.getElementById('syncState').textContent='Could not sync right now';if(manual)showToast('Sync failed')}
}
function switchPanel(id){document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.panel===id));document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id===id));if(id==='shop')setTimeout(drawGlobe,0)}
function buildWeakSession(){const top=cards.filter(c=>c.active!==false).sort((a,b)=>weakness(b)-weakness(a)).slice(0,20);activeSession={kind:'flash',items:top.map(c=>({type:'card',id:c.id})),index:0,title:'Weak-topic flashcards'};switchPanel('study');renderAll()}

ensureProfile();
document.getElementById('pinForm').onsubmit=async e=>{e.preventDefault();const ok=await unlock(document.getElementById('pinInput').value,document.getElementById('rememberPin').checked);document.getElementById('pinError').textContent=ok?'':'Incorrect code';if(ok)sync()};
document.getElementById('pinInput').oninput=e=>{e.target.value=e.target.value.replace(/\D/g,'').slice(0,4)};
if(localStorage.getItem('rl_auth')==='1'||sessionStorage.getItem('rl_auth')==='1'){document.getElementById('authGate').classList.add('hidden');document.getElementById('app').classList.remove('app-locked');sync()}else document.getElementById('pinInput').focus();

document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>switchPanel(b.dataset.panel));
document.querySelectorAll('.study-type-btn').forEach(b=>b.onclick=()=>{studyType=b.dataset.study;activeSession=null;renderAll()});
document.getElementById('flashSubject').onchange=()=>{flashTopics.clear();refreshFlashTopics(true);renderAll()};
document.querySelectorAll('[data-flash-preset]').forEach(b=>b.onclick=()=>applyFlashPreset(b.dataset.flashPreset));
document.getElementById('startFlashcards').onclick=startFlashSession;
document.getElementById('examSubject').onchange=()=>{examYears.clear();examTopics.clear();examTypes.clear();refreshExamFilters(true);renderAll()};
document.getElementById('yearsAll').onclick=()=>{examYears=new Set(subjectExam(document.getElementById('examSubject').value).map(q=>q.year));refreshExamFilters(false)};
document.getElementById('yearsRecent').onclick=()=>{const ys=[...new Set(subjectExam(document.getElementById('examSubject').value).map(q=>q.year))].sort((a,b)=>b-a);examYears=new Set(ys.slice(0,2));refreshExamFilters(false)};
document.getElementById('yearsClear').onclick=()=>{examYears.clear();refreshExamFilters(false)};
document.getElementById('examTopicsAll').onclick=()=>{examTopics=new Set(subjectExam(document.getElementById('examSubject').value).map(q=>q.topic));refreshExamFilters(false)};
document.getElementById('examTopicsWeak').onclick=()=>{const sub=document.getElementById('examSubject').value,ts=[...new Set(subjectExam(sub).map(q=>q.topic))].sort((a,b)=>(profile.topicWeakness[topicKey(sub,b)]||0)-(profile.topicWeakness[topicKey(sub,a)]||0));examTopics=new Set(ts.slice(0,Math.max(1,Math.ceil(ts.length/3))));refreshExamFilters(false)};
document.getElementById('examTopicsClear').onclick=()=>{examTopics.clear();refreshExamFilters(false)};
document.getElementById('startExam').onclick=startExamSession;
document.getElementById('startChallenge').onclick=startChallenge;document.getElementById('challengeSubject').onchange=renderChallenge;document.getElementById('challengeScope').onchange=renderChallenge;
document.getElementById('reviewWeakBtn').onclick=buildWeakSession;document.getElementById('redoMistakesBtn').onclick=startMistakes;document.getElementById('resetPhysicsUnits').onclick=()=>{settings.physicsUnits={};initPhysicsUnits();save();refreshFlashTopics(true);refreshExamFilters(true);renderAll()};
document.getElementById('syncBtn').onclick=()=>sync(true);document.getElementById('lockBtn').onclick=lockApp;

const globe=document.getElementById('globe');
globe.addEventListener('pointerdown',e=>{dragging=true;lastPointer={x:e.clientX,y:e.clientY};globe.setPointerCapture(e.pointerId)});
globe.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastPointer.x,dy=e.clientY-lastPointer.y;globeLon=(globeLon-dx*.45+540)%360-180;globeLat=clamp(globeLat+dy*.3,-65,65);lastPointer={x:e.clientX,y:e.clientY};drawGlobe()});
globe.addEventListener('pointerup',e=>{if(dragging){const p=globePointer(e),l=nearestPin(p.x,p.y);if(l){selectedLocation=l.id;if(profile.shopOwned.locations.includes(l.id)){profile.equippedLocation=l.id;save();renderAvatar()}drawGlobe()}}dragging=false});
