
const DECK_URL='./deck.json',EXAM_URL='./exam_questions.json',DAY=86400000;
const PIN_HASH='02a80993805958408c14d68623a229c86777980c55403d0c2fecf46904fe367c';
const PROGRESS_KEY='revisionLoopProgress5',PROFILE_KEY='revisionLoopProfile11',SETTINGS_KEY='revisionLoopSettings11';
let cards=[],examQuestions=[],deckMeta={},coverage={},deckVersion=0,bankVersion=0;
let progress=load(PROGRESS_KEY,{});
let profile=load(PROFILE_KEY,{});
let settings=load(SETTINGS_KEY,{});
let studyType='mock',activeSession=null,currentCardId=null,currentEvaluation=null,currentFlashAwarded=false,currentExamScore=0,toastTimer=null;
let flashTopics=new Set(),examTopics=new Set(),examYears=new Set(),examTypes=new Set(),globeLon=0,globeLat=5,dragging=false,lastPointer=null,selectedLocation='home';

const CHARACTERS=[
 {id:'lelouch',name:'Lelouch',series:'Code Geass',cost:0,skin:'#efd0b5',hair:'#111827',hair2:'#312e81',style:'swept',eye:'#5b21b6'},
 {id:'cc',name:'C.C.',series:'Code Geass',cost:18,skin:'#efccb0',hair:'#65a30d',hair2:'#3f6212',style:'long',eye:'#d4d4d8'},
 {id:'suzaku',name:'Suzaku',series:'Code Geass',cost:22,skin:'#d9a77d',hair:'#5b4636',hair2:'#3f2f25',style:'messy',eye:'#166534'},
 {id:'kallen',name:'Kallen',series:'Code Geass',cost:26,skin:'#efc5a6',hair:'#b91c1c',hair2:'#7f1d1d',style:'messy',eye:'#60a5fa'},
 {id:'jeremiah',name:'Jeremiah',series:'Code Geass',cost:30,skin:'#d8a77f',hair:'#c2410c',hair2:'#7c2d12',style:'short',eye:'#3f6212'},

 {id:'light',name:'Light',series:'Death Note',cost:18,skin:'#e7bd9f',hair:'#7c4a2d',hair2:'#4a2c1a',style:'swept',eye:'#78350f'},
 {id:'l',name:'L',series:'Death Note',cost:22,skin:'#e8d1bf',hair:'#111827',hair2:'#0f172a',style:'messy',eye:'#111827',accessory:'darkeyes'},
 {id:'misa',name:'Misa',series:'Death Note',cost:26,skin:'#efc7aa',hair:'#eab308',hair2:'#a16207',style:'long',eye:'#78350f'},
 {id:'near',name:'Near',series:'Death Note',cost:30,skin:'#ead2bd',hair:'#e5e7eb',hair2:'#cbd5e1',style:'messy',eye:'#64748b'},
 {id:'ryuk',name:'Ryuk',series:'Death Note',cost:36,skin:'#9ca3af',hair:'#0f172a',hair2:'#020617',style:'spiky',eye:'#dc2626',accessory:'darkeyes'},

 {id:'eren',name:'Eren',series:'Attack on Titan',cost:20,skin:'#d7a27b',hair:'#4b3621',hair2:'#2f2418',style:'long',eye:'#16a34a'},
 {id:'mikasa',name:'Mikasa',series:'Attack on Titan',cost:24,skin:'#e0ad87',hair:'#111827',hair2:'#0f172a',style:'bob',eye:'#374151',accessory:'scarf'},
 {id:'levi',name:'Levi',series:'Attack on Titan',cost:28,skin:'#dfb18c',hair:'#111827',hair2:'#020617',style:'short',eye:'#64748b'},
 {id:'armin',name:'Armin',series:'Attack on Titan',cost:32,skin:'#efc9a9',hair:'#f2c94c',hair2:'#b7791f',style:'bob',eye:'#60a5fa'},
 {id:'erwin',name:'Erwin',series:'Attack on Titan',cost:36,skin:'#e3b48f',hair:'#d4a72c',hair2:'#8b6a16',style:'swept',eye:'#60a5fa'},

 {id:'isagi',name:'Isagi',series:'Blue Lock',cost:20,skin:'#e2b08c',hair:'#172554',hair2:'#0f172a',style:'short',eye:'#2563eb'},
 {id:'bachira',name:'Bachira',series:'Blue Lock',cost:24,skin:'#e0af88',hair:'#111827',hair2:'#eab308',style:'messy',eye:'#eab308'},
 {id:'rin_bl',name:'Rin',series:'Blue Lock',cost:28,skin:'#e3b48f',hair:'#164e63',hair2:'#0f172a',style:'swept',eye:'#0891b2'},
 {id:'nagi',name:'Nagi',series:'Blue Lock',cost:32,skin:'#efd0b5',hair:'#f1f5f9',hair2:'#cbd5e1',style:'messy',eye:'#64748b'},
 {id:'barou',name:'Barou',series:'Blue Lock',cost:36,skin:'#ce9067',hair:'#111827',hair2:'#7f1d1d',style:'spiky',eye:'#dc2626'},

 {id:'yuji',name:'Yuji',series:'Jujutsu Kaisen',cost:22,skin:'#e2ad86',hair:'#fb7185',hair2:'#be123c',style:'short',eye:'#78350f'},
 {id:'gojo',name:'Gojo',series:'Jujutsu Kaisen',cost:28,skin:'#efcdb1',hair:'#f8fafc',hair2:'#cbd5e1',style:'spiky',eye:'#38bdf8',accessory:'blindfold'},
 {id:'megumi',name:'Megumi',series:'Jujutsu Kaisen',cost:32,skin:'#ddb08d',hair:'#111827',hair2:'#020617',style:'spiky',eye:'#1f2937'},
 {id:'nobara',name:'Nobara',series:'Jujutsu Kaisen',cost:36,skin:'#e7b794',hair:'#9a3412',hair2:'#7c2d12',style:'bob',eye:'#78350f'},
 {id:'toji',name:'Toji',series:'Jujutsu Kaisen',cost:42,skin:'#b97852',hair:'#111827',hair2:'#020617',style:'short',eye:'#16a34a',accessory:'scar'},

 {id:'subaru',name:'Subaru',series:'Re:Zero',cost:22,skin:'#dca47e',hair:'#111827',hair2:'#020617',style:'short',eye:'#78350f'},
 {id:'emilia',name:'Emilia',series:'Re:Zero',cost:28,skin:'#f0ceb5',hair:'#e5e7eb',hair2:'#c4b5fd',style:'long',eye:'#a855f7'},
 {id:'rem',name:'Rem',series:'Re:Zero',cost:32,skin:'#edc3a6',hair:'#60a5fa',hair2:'#2563eb',style:'bob',eye:'#60a5fa'},
 {id:'beatrice',name:'Beatrice',series:'Re:Zero',cost:36,skin:'#efc9aa',hair:'#facc15',hair2:'#ca8a04',style:'long',eye:'#60a5fa'},
 {id:'echidna',name:'Echidna',series:'Re:Zero',cost:42,skin:'#f0cfb7',hair:'#f8fafc',hair2:'#d1d5db',style:'long',eye:'#111827'},

 {id:'klein',name:'Klein',series:'Lord of the Mysteries',cost:24,skin:'#ddb08b',hair:'#3f2d22',hair2:'#1f2937',style:'swept',eye:'#78350f'},
 {id:'audrey',name:'Audrey',series:'Lord of the Mysteries',cost:30,skin:'#efcaae',hair:'#eab308',hair2:'#a16207',style:'long',eye:'#16a34a'},
 {id:'alger',name:'Alger',series:'Lord of the Mysteries',cost:34,skin:'#b47b56',hair:'#1e3a8a',hair2:'#0f172a',style:'short',eye:'#1d4ed8'},
 {id:'leonard_lotm',name:'Leonard',series:'Lord of the Mysteries',cost:38,skin:'#d7a27d',hair:'#111827',hair2:'#166534',style:'messy',eye:'#16a34a'},
 {id:'azik',name:'Azik',series:'Lord of the Mysteries',cost:44,skin:'#9f6949',hair:'#111827',hair2:'#020617',style:'long',eye:'#78350f'},

 {id:'dokja',name:'Kim Dokja',series:'Omniscient Reader',cost:24,skin:'#e0b08e',hair:'#111827',hair2:'#020617',style:'short',eye:'#111827'},
 {id:'joonghyuk',name:'Yoo Joonghyuk',series:'Omniscient Reader',cost:30,skin:'#d49b74',hair:'#111827',hair2:'#020617',style:'swept',eye:'#111827'},
 {id:'sooyoung',name:'Han Sooyoung',series:'Omniscient Reader',cost:34,skin:'#e6b793',hair:'#111827',hair2:'#312e81',style:'bob',eye:'#5b21b6'},
 {id:'sangah',name:'Yoo Sangah',series:'Omniscient Reader',cost:38,skin:'#e8bc99',hair:'#6b4423',hair2:'#3f2f25',style:'long',eye:'#78350f'},
 {id:'heewon',name:'Jung Heewon',series:'Omniscient Reader',cost:44,skin:'#d79f78',hair:'#2f2418',hair2:'#111827',style:'long',eye:'#78350f'},

 {id:'thorfinn',name:'Thorfinn',series:'Vinland Saga',cost:24,skin:'#d7a27a',hair:'#d4a72c',hair2:'#8b6a16',style:'messy',eye:'#60a5fa'},
 {id:'askeladd',name:'Askeladd',series:'Vinland Saga',cost:30,skin:'#c58b62',hair:'#d1b56f',hair2:'#78716c',style:'swept',eye:'#64748b'},
 {id:'canute',name:'Canute',series:'Vinland Saga',cost:34,skin:'#efc7a6',hair:'#e8c547',hair2:'#a16207',style:'long',eye:'#60a5fa'},
 {id:'thorkell',name:'Thorkell',series:'Vinland Saga',cost:38,skin:'#c28258',hair:'#b45309',hair2:'#7c2d12',style:'spiky',eye:'#78350f'},
 {id:'einar',name:'Einar',series:'Vinland Saga',cost:44,skin:'#b97a53',hair:'#6b4423',hair2:'#3f2f25',style:'short',eye:'#78350f'},

 {id:'kaneki',name:'Kaneki',series:'Tokyo Ghoul',cost:26,skin:'#e4c0a5',hair:'#f1f5f9',hair2:'#cbd5e1',style:'messy',eye:'#dc2626',accessory:'eyepatch'},
 {id:'touka',name:'Touka',series:'Tokyo Ghoul',cost:32,skin:'#e6b794',hair:'#312e81',hair2:'#111827',style:'bob',eye:'#5b21b6'},
 {id:'juuzou',name:'Juuzou',series:'Tokyo Ghoul',cost:36,skin:'#efd0b4',hair:'#f8fafc',hair2:'#d1d5db',style:'messy',eye:'#dc2626',accessory:'stitches'},
 {id:'arima',name:'Arima',series:'Tokyo Ghoul',cost:40,skin:'#e6b996',hair:'#e5e7eb',hair2:'#cbd5e1',style:'short',eye:'#64748b',accessory:'glasses'},
 {id:'hide',name:'Hide',series:'Tokyo Ghoul',cost:46,skin:'#e7b895',hair:'#eab308',hair2:'#a16207',style:'short',eye:'#78350f'}
];
const OUTFIT_STYLES=[
 {id:'default',name:'Default',cost:0,top:'#2563eb',accent:'#dbeafe'},
 {id:'hoodie',name:'Hoodie',cost:12,top:'#0f172a',accent:'#64748b'},
 {id:'casual',name:'Casual',cost:16,top:'#16a34a',accent:'#dcfce7'},
 {id:'winter',name:'Winter',cost:20,top:'#7c3aed',accent:'#ede9fe'},
 {id:'smart',name:'Smart',cost:24,top:'#334155',accent:'#e2e8f0'},
 {id:'traveller',name:'Traveller',cost:28,top:'#b45309',accent:'#fef3c7'},
 {id:'sport',name:'Sport',cost:32,top:'#dc2626',accent:'#fee2e2'},
 {id:'festival',name:'Festival',cost:38,top:'#db2777',accent:'#fce7f3'}
];
const OUTFITS=CHARACTERS.flatMap(ch=>OUTFIT_STYLES.map((o,i)=>({id:ch.id+'-'+o.id,character:ch.id,name:o.name,cost:i===0?0:o.cost+Math.max(0,CHARACTERS.findIndex(x=>x.id===ch.id))*2,top:o.top,accent:o.accent})));
const LOCATIONS=[
 {id:'home',name:'Home Desk',wiki:'Desk',lat:52.5,lon:1.0,cost:0},
 {id:'london',name:'London',wiki:'London',lat:51.5072,lon:-0.1276,cost:20},
 {id:'tbilisi',name:'Tbilisi',wiki:'Tbilisi',lat:41.7151,lon:44.8271,cost:25},
 {id:'tokyo',name:'Tokyo',wiki:'Tokyo',lat:35.6762,lon:139.6503,cost:30},
 {id:'seoul',name:'Seoul',wiki:'Seoul',lat:37.5665,lon:126.9780,cost:35},
 {id:'busan',name:'Busan',wiki:'Busan',lat:35.1796,lon:129.0756,cost:40},
 {id:'hongkong',name:'Hong Kong',wiki:'Hong_Kong',lat:22.3193,lon:114.1694,cost:45},
 {id:'singapore',name:'Singapore',wiki:'Singapore',lat:1.3521,lon:103.8198,cost:50},
 {id:'shanghai',name:'Shanghai',wiki:'Shanghai',lat:31.2304,lon:121.4737,cost:55},
 {id:'shenzhen',name:'Shenzhen',wiki:'Shenzhen',lat:22.5431,lon:114.0579,cost:60},
 {id:'beijing',name:'Beijing',wiki:'Beijing',lat:39.9042,lon:116.4074,cost:65},
 {id:'manila',name:'Manila',wiki:'Manila',lat:14.5995,lon:120.9842,cost:70},
 {id:'bohol',name:'Bohol',wiki:'Bohol',lat:9.8500,lon:124.1435,cost:75},
 {id:'coron',name:'Coron',wiki:'Coron,_Palawan',lat:12.0,lon:120.2,cost:80},
 {id:'bali',name:'Bali',wiki:'Bali',lat:-8.3405,lon:115.0920,cost:85},
 {id:'hanoi',name:'Hanoi',wiki:'Hanoi',lat:21.0278,lon:105.8342,cost:90},
 {id:'hochiminh',name:'Ho Chi Minh City',wiki:'Ho_Chi_Minh_City',lat:10.8231,lon:106.6297,cost:95},
 {id:'bangkok',name:'Bangkok',wiki:'Bangkok',lat:13.7563,lon:100.5018,cost:100},
 {id:'kualalumpur',name:'Kuala Lumpur',wiki:'Kuala_Lumpur',lat:3.1390,lon:101.6869,cost:105},
 {id:'almaty',name:'Almaty',wiki:'Almaty',lat:43.2389,lon:76.8897,cost:110},
 {id:'bishkek',name:'Bishkek',wiki:'Bishkek',lat:42.8746,lon:74.5698,cost:115},
 {id:'samarkand',name:'Samarkand',wiki:'Samarkand',lat:39.6542,lon:66.9597,cost:120},
 {id:'petra',name:'Petra',wiki:'Petra',lat:30.3285,lon:35.4444,cost:125},
 {id:'nairobi',name:'Nairobi',wiki:'Nairobi',lat:-1.2921,lon:36.8219,cost:130},
 {id:'capetown',name:'Cape Town',wiki:'Cape_Town',lat:-33.9249,lon:18.4241,cost:135},
 {id:'cusco',name:'Cusco',wiki:'Cusco',lat:-13.5319,lon:-71.9675,cost:140},
 {id:'machupicchu',name:'Machu Picchu',wiki:'Machu_Picchu',lat:-13.1631,lon:-72.5450,cost:150},
 {id:'rio',name:'Rio de Janeiro',wiki:'Rio_de_Janeiro',lat:-22.9068,lon:-43.1729,cost:155},
 {id:'newyork',name:'New York City',wiki:'New_York_City',lat:40.7128,lon:-74.0060,cost:160},
 {id:'vancouver',name:'Vancouver',wiki:'Vancouver',lat:49.2827,lon:-123.1207,cost:165},
 {id:'reykjavik',name:'Reykjavík',wiki:'Reykjavík',lat:64.1466,lon:-21.9426,cost:170},
 {id:'sydney',name:'Sydney',wiki:'Sydney',lat:-33.8688,lon:151.2093,cost:175},
 {id:'kyoto',name:'Kyoto',wiki:'Kyoto',lat:35.0116,lon:135.7681,cost:180},
 {id:'gyeongju',name:'Gyeongju',wiki:'Gyeongju',lat:35.8562,lon:129.2247,cost:185},
 {id:'taipei',name:'Taipei',wiki:'Taipei',lat:25.0330,lon:121.5654,cost:190},
 {id:'angkor',name:'Angkor Wat',wiki:'Angkor_Wat',lat:13.4125,lon:103.8670,cost:195},
 {id:'dubai',name:'Dubai',wiki:'Dubai',lat:25.2048,lon:55.2708,cost:200},
 {id:'istanbul',name:'Istanbul',wiki:'Istanbul',lat:41.0082,lon:28.9784,cost:205},
 {id:'venice',name:'Venice',wiki:'Venice',lat:45.4408,lon:12.3155,cost:210},
 {id:'paris',name:'Paris',wiki:'Paris',lat:48.8566,lon:2.3522,cost:215}
];
const EARTH_TEXTURE_URL='https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Blue_Marble_2002.jpg/1280px-Blue_Marble_2002.jpg';
const earthTexture=new Image();earthTexture.crossOrigin='anonymous';let earthTextureReady=false,earthPixels=null,earthW=0,earthH=0;earthTexture.onload=()=>{try{const t=document.createElement('canvas');t.width=720;t.height=360;const x=t.getContext('2d',{willReadFrequently:true});x.drawImage(earthTexture,0,0,t.width,t.height);earthPixels=x.getImageData(0,0,t.width,t.height).data;earthW=t.width;earthH=t.height;earthTextureReady=true}catch{earthTextureReady=false}drawGlobe()};earthTexture.src=EARTH_TEXTURE_URL;
const wikiPhotoCache={};

function load(k,f){try{const x=JSON.parse(localStorage.getItem(k));return x??f}catch{return f}}
function save(){localStorage.setItem(PROGRESS_KEY,JSON.stringify(progress));localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings))}
function ensureProfile(){
 profile.daily=profile.daily||{};profile.examResults=profile.examResults||{};profile.topicWeakness=profile.topicWeakness||{};profile.topicStats=profile.topicStats||{};
 profile.errorLog=profile.errorLog||[];profile.dailyChallenges=profile.dailyChallenges||{};profile.challengeStreak=profile.challengeStreak||0;profile.lastChallengeDate=profile.lastChallengeDate||'';
 profile.shopOwned=profile.shopOwned||{};profile.shopOwned.characters=(profile.shopOwned.characters||[]).filter(id=>CHARACTERS.some(c=>c.id===id));profile.shopOwned.outfits=(profile.shopOwned.outfits||[]).filter(id=>OUTFITS.some(o=>o.id===id));profile.shopOwned.locations=(profile.shopOwned.locations||[]).filter(id=>LOCATIONS.some(l=>l.id===id));if(!profile.shopOwned.characters.length)profile.shopOwned.characters=['lelouch'];if(!profile.shopOwned.outfits.length)profile.shopOwned.outfits=['lelouch-default'];if(!profile.shopOwned.locations.includes('home'))profile.shopOwned.locations.unshift('home');if(!CHARACTERS.some(c=>c.id===profile.equippedCharacter))profile.equippedCharacter=profile.shopOwned.characters[0]||'lelouch';if(!OUTFITS.some(o=>o.id===profile.equippedOutfit&&o.character===profile.equippedCharacter))profile.equippedOutfit=profile.equippedCharacter+'-default';profile.equippedLocation=LOCATIONS.some(l=>l.id===profile.equippedLocation)?profile.equippedLocation:'home';
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
function weakness(c){const s=state(c.id),tw=profile.topicWeakness[topicKey(c.subject,c.courseTopic||c.topic)]||0;return (c.priority||1)*3+(s.again||0)*2.6+(s.hard||0)*1.6+tw*2+(1-memoryHealth(c))*8-(s.good||0)*.2}
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
function taughtCard(c){return c.taught===true}
function subjectCards(sub){return cards.filter(c=>c.active!==false&&c.subject===sub)}
function subjectExam(sub){return examQuestions.filter(q=>q.subject===sub)}

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
 const ts=topicStat(c.subject,c.courseTopic||c.topic);ts.attempts++;ts.last=now();if(currentEvaluation?.status==='correct')ts.success++;else if(rating==='again'||rating==='hard')ts.lastMiss=now();
 if((rating==='again'||rating==='hard')&&currentEvaluation?.status!=='correct')addError({type:'card',id:c.id,subject:c.subject,topic:c.courseTopic||c.topic,result:rating,answer:String(answer||'').slice(0,300),missing:currentEvaluation?.missing||[],longGap:prev&&((now()-prev)/DAY>30)});
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

function startMockSession(){
 const sub=document.getElementById('mockSubject').value,mode=document.getElementById('mockMode').value,count=Number(document.getElementById('mockCount').value);
 const cardPool=cards.filter(c=>c.active!==false&&c.subject===sub&&c.mock===true);
 const qAll=examQuestions.filter(q=>q.subject===sub&&(q.mock===true||q.level==='AS'));
 const groups=new Map();for(const q of qAll){if(!groups.has(q.groupId))groups.set(q.groupId,[]);groups.get(q.groupId).push(q)}
 for(const g of groups.values())g.sort((x,y)=>String(x.groupOrder).localeCompare(String(y.groupOrder),undefined,{numeric:true}));
 const items=[];
 if(mode!=='exam'){
   const want=mode==='flash'?count:Math.max(1,Math.ceil(count*.6));
   const picked=weightedPick(cardPool,Math.min(want,cardPool.length),c=>1+weakness(c)/5+(isDue(c)?4:0)+(1-memoryHealth(c))*3);
   picked.forEach(c=>items.push({type:'card',id:c.id}));
 }
 if(mode!=='flash'){
   const target=Math.max(1,count-items.length),pickedGroups=weightedPick([...groups.values()],Math.min(target,groups.size),g=>1+groupWeakness(g));
   for(const g of pickedGroups){for(const q of g){if(items.length>=count&&mode==='mixed')break;items.push({type:'exam',id:q.id,groupId:q.groupId})}}
 }
 if(!items.length){showToast('No mock material is available for that selection yet');return}
 if(mode==='mixed')items.sort(()=>Math.random()-.5);
 activeSession={kind:'mock',items,index:0,title:sub+' mock revision'};currentCardId=null;renderAll();
}
function selectedFlashCards(){const sub=document.getElementById('flashSubject').value,base=subjectCards(sub);return flashTopics.size?base.filter(c=>flashTopics.has(c.courseTopic||c.topic)):base}
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
   if(examTopics.has(q.courseTopic||q.topic)&&examTypes.has(q.questionType))eligibleGroupIds.add(q.groupId);
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
function groupWeakness(group){let s=0;for(const q of group){const t=profile.topicWeakness[topicKey(q.subject,q.courseTopic||q.topic)]||0,last=profile.examResults[q.id]?.last,acc=last?last.marks/last.max:0;s+=1+t*2+(1-acc)*4+(profile.errorLog.some(e=>e.type==='exam'&&e.id===q.id)?4:0)}return s/group.length}
function startExamSession(){
 const groups=examGroups(),count=Number(document.getElementById('examCount').value);if(!groups.length){showToast('No questions match those filters');return}
 let chosen;if(document.getElementById('examOrder').value==='random')chosen=[...groups].sort(()=>Math.random()-.5).slice(0,count);else chosen=weightedPick(groups,Math.min(count,groups.length),g=>1+groupWeakness(g));
 const items=[];for(const g of chosen)for(const q of g)items.push({type:'exam',id:q.id,groupId:q.groupId});
 activeSession={kind:'exam',items,index:0,title:'Random AQA exam questions'};renderAll();
}
function awardExam(q,marks,answer,missedPoints){
 const ts=topicStat(q.subject,q.courseTopic||q.topic);ts.examMarks+=marks;ts.examMax+=q.marks;ts.attempts++;ts.last=now();if(marks<q.marks)ts.lastMiss=now();
 if(!profile.examResults[q.id])profile.examResults[q.id]={attempts:[]};const rec={marks,max:q.marks,date:now(),answer:String(answer||'').slice(0,1000),missedPoints};profile.examResults[q.id].attempts.push(rec);profile.examResults[q.id].last=rec;
 let w=profile.topicWeakness[topicKey(q.subject,q.courseTopic||q.topic)]||0;if(marks/q.marks<.5)w=Math.min(10,w+2);else if(marks<q.marks)w=Math.min(10,w+1);else w=Math.max(0,w-1);profile.topicWeakness[topicKey(q.subject,q.courseTopic||q.topic)]=w;
 if(marks<q.marks)addError({type:'exam',id:q.id,subject:q.subject,topic:q.courseTopic||q.topic,result:marks+'/'+q.marks,answer:String(answer||'').slice(0,1000),missedPoints});
 award(marks,'exam');save();advanceSession();
}

function challengeCards(sub,scope){let a=cards.filter(c=>c.active!==false&&(!sub||c.subject===sub));return scope==='mock'?a.filter(c=>c.mock===true):a.filter(taughtCard)}
function challengeQuestions(sub,scope){let q=examQuestions.filter(x=>(!sub||x.subject===sub));if(scope==='mock')q=q.filter(x=>x.mock===true||x.level==='AS');return q}
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

 if(t==='fibre')return S+'<rect x="45" y="56" width="270" height="58" rx="28" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/><path d="M55 96 L105 72 L155 98 L205 72 L255 98 L305 72" fill="none" stroke="#f59e0b" stroke-width="4"/><text x="95" y="145" font-size="13">total internal reflection</text></svg>';
 if(t==='circle')return S+'<circle cx="180" cy="88" r="62" fill="none" stroke="#2563eb" stroke-width="4"/><circle cx="180" cy="88" r="4" fill="#0f172a"/><line x1="180" y1="88" x2="235" y2="58" stroke="#94a3b8" stroke-width="3"/><text x="205" y="76" font-size="14">r</text><line x1="58" y1="138" x2="310" y2="138" stroke="#0f172a" stroke-width="2"/></svg>';
 if(t==='titration')return S+'<rect x="82" y="24" width="20" height="91" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><line x1="92" y1="115" x2="92" y2="137" stroke="#0f172a" stroke-width="2"/><path d="M185 140 L265 140 L248 96 L202 96 Z" fill="#fef3c7" stroke="#64748b" stroke-width="2"/><path d="M92 137 Q92 148 103 148" fill="none" stroke="#2563eb" stroke-width="2"/><text x="55" y="20" font-size="12">burette</text><text x="198" y="160" font-size="12">conical flask</text></svg>';
 if(t==='medical')return S+'<circle cx="180" cy="84" r="45" fill="#e0f2fe" stroke="#0284c7" stroke-width="3"/><path d="M90 84 H270" stroke="#64748b" stroke-width="2"/><path d="M180 39 V129" stroke="#64748b" stroke-width="2"/><path d="M55 84 Q90 40 125 84 Q90 128 55 84Z" fill="#dbeafe" stroke="#2563eb"/><text x="210" y="150" font-size="13">medical imaging</text></svg>';

 if(t==='energy-levels')return S+'<line x1="70" y1="130" x2="290" y2="130" stroke="#64748b" stroke-width="3"/><line x1="90" y1="92" x2="270" y2="92" stroke="#64748b" stroke-width="3"/><line x1="115" y1="52" x2="245" y2="52" stroke="#64748b" stroke-width="3"/><path d="M150 124 V61" stroke="#2563eb" stroke-width="4"/><polygon points="150,52 144,64 156,64" fill="#2563eb"/><path d="M210 58 V121" stroke="#f59e0b" stroke-width="4"/><polygon points="210,130 204,118 216,118" fill="#f59e0b"/><text x="56" y="145" font-size="12">lower E</text><text x="242" y="44" font-size="12">higher E</text></svg>';
 if(t==='gas-particles')return S+'<rect x="55" y="35" width="250" height="100" rx="8" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>'+[[85,60],[125,95],[160,55],[205,80],[260,58],[278,112],[95,120],[215,118]].map(p=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="6" fill="#2563eb"/>').join('')+'<path d="M86 60 l18 -8 M162 55 l15 12 M206 80 l22 -9" stroke="#b45309" stroke-width="2"/><text x="102" y="155" font-size="13">random molecular motion → pressure</text></svg>';
 if(t==='grating')return S+'<line x1="96" y1="30" x2="96" y2="140" stroke="#0f172a" stroke-width="4"/><line x1="104" y1="30" x2="104" y2="140" stroke="#0f172a" stroke-width="1"/><line x1="112" y1="30" x2="112" y2="140" stroke="#0f172a" stroke-width="1"/><line x1="30" y1="85" x2="95" y2="85" stroke="#2563eb" stroke-width="4"/><path d="M113 85 L295 42 M113 85 L295 85 M113 85 L295 128" stroke="#f59e0b" stroke-width="3"/><text x="190" y="25" font-size="13">d sin θ = nλ</text></svg>';
 if(t==='refraction')return S+'<line x1="40" y1="85" x2="320" y2="85" stroke="#64748b" stroke-width="2"/><line x1="180" y1="25" x2="180" y2="145" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5 5"/><path d="M105 30 L180 85 L228 145" fill="none" stroke="#2563eb" stroke-width="4"/><text x="78" y="74" font-size="13">i</text><text x="194" y="108" font-size="13">r</text></svg>';
 if(t==='force-time')return S+'<line x1="55" y1="135" x2="310" y2="135" stroke="#0f172a" stroke-width="2"/><line x1="55" y1="135" x2="55" y2="25" stroke="#0f172a" stroke-width="2"/><path d="M58 135 L118 52 L210 52 L280 135 Z" fill="#dbeafe" stroke="#2563eb" stroke-width="4"/><text x="115" y="155" font-size="13">area = impulse = Δp</text></svg>';
 if(t==='divider')return S+'<line x1="65" y1="48" x2="295" y2="48" stroke="#0f172a" stroke-width="2"/><line x1="65" y1="48" x2="65" y2="135" stroke="#0f172a" stroke-width="2"/><line x1="295" y1="48" x2="295" y2="135" stroke="#0f172a" stroke-width="2"/><polyline points="110,48 120,58 130,38 140,58 150,38 160,58 170,48" fill="none" stroke="#2563eb" stroke-width="3"/><polyline points="190,48 200,58 210,38 220,58 230,38 240,58 250,48" fill="none" stroke="#b45309" stroke-width="3"/><line x1="180" y1="48" x2="180" y2="120" stroke="#64748b" stroke-width="2"/><text x="92" y="83" font-size="12">R₁</text><text x="226" y="83" font-size="12">R₂</text><text x="160" y="140" font-size="12">Vout</text></svg>';
 if(t==='wire')return S+'<line x1="55" y1="85" x2="305" y2="85" stroke="#b45309" stroke-width="8"/><line x1="55" y1="112" x2="305" y2="112" stroke="#64748b" stroke-width="1"/><line x1="55" y1="105" x2="55" y2="120" stroke="#64748b"/><line x1="305" y1="105" x2="305" y2="120" stroke="#64748b"/><text x="169" y="133" font-size="13">L</text><text x="97" y="58" font-size="13">ρ = RA/L</text></svg>';
 if(t==='field-lines')return S+'<circle cx="180" cy="85" r="16" fill="#2563eb"/>'+[0,45,90,135,180,225,270,315].map(a=>{const r=a*Math.PI/180,x1=180+24*Math.cos(r),y1=85+24*Math.sin(r),x2=180+72*Math.cos(r),y2=85+72*Math.sin(r);return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#64748b" stroke-width="2"/>'}).join('')+'<text x="132" y="164" font-size="13">radial field</text></svg>';
 if(t==='capacitor')return S+'<line x1="50" y1="85" x2="145" y2="85" stroke="#0f172a" stroke-width="3"/><line x1="145" y1="45" x2="145" y2="125" stroke="#2563eb" stroke-width="6"/><line x1="165" y1="45" x2="165" y2="125" stroke="#2563eb" stroke-width="6"/><line x1="165" y1="85" x2="310" y2="85" stroke="#0f172a" stroke-width="3"/><text x="120" y="151" font-size="13">C = Q/V</text></svg>';
 if(t==='magnetic')return S+'<line x1="180" y1="30" x2="180" y2="140" stroke="#b45309" stroke-width="6"/><circle cx="180" cy="85" r="35" fill="none" stroke="#2563eb" stroke-width="2"/><circle cx="180" cy="85" r="62" fill="none" stroke="#2563eb" stroke-width="2"/><text x="214" y="45" font-size="13">B field around current</text></svg>';
 if(t==='induction')return S+'<rect x="52" y="64" width="72" height="42" rx="5" fill="#fee2e2" stroke="#b91c1c"/><text x="73" y="90" font-size="16">N S</text><path d="M150 48 q25 18 0 36 q25 18 0 36 q25 18 0 36" fill="none" stroke="#2563eb" stroke-width="5"/><path d="M120 85 H146" stroke="#0f172a" stroke-width="3"/><polygon points="146,85 136,79 136,91" fill="#0f172a"/><text x="215" y="90" font-size="13">change in flux → emf</text></svg>';
 if(t==='decay')return S+'<line x1="55" y1="135" x2="310" y2="135" stroke="#0f172a" stroke-width="2"/><line x1="55" y1="135" x2="55" y2="25" stroke="#0f172a" stroke-width="2"/><path d="M58 36 C105 68 148 94 205 111 C245 122 275 128 307 131" fill="none" stroke="#2563eb" stroke-width="4"/><line x1="55" y1="84" x2="300" y2="84" stroke="#94a3b8" stroke-dasharray="5 5"/><text x="220" y="76" font-size="12">half-life</text></svg>';
 if(t==='quark')return S+'<circle cx="130" cy="85" r="38" fill="#dbeafe" stroke="#2563eb"/><circle cx="115" cy="75" r="10" fill="#dc2626"/><circle cx="145" cy="75" r="10" fill="#dc2626"/><circle cx="130" cy="102" r="10" fill="#16a34a"/><text x="111" y="79" font-size="10" fill="#fff">u</text><text x="141" y="79" font-size="10" fill="#fff">u</text><text x="126" y="106" font-size="10" fill="#fff">d</text><text x="190" y="90" font-size="13">example baryon</text></svg>';
 if(t==='molecule-shape')return S+'<circle cx="180" cy="85" r="14" fill="#2563eb"/><circle cx="105" cy="55" r="11" fill="#94a3b8"/><circle cx="255" cy="55" r="11" fill="#94a3b8"/><circle cx="180" cy="145" r="11" fill="#94a3b8"/><line x1="168" y1="78" x2="116" y2="59" stroke="#0f172a" stroke-width="3"/><line x1="192" y1="78" x2="244" y2="59" stroke="#0f172a" stroke-width="3"/><line x1="180" y1="99" x2="180" y2="134" stroke="#0f172a" stroke-width="3"/><text x="138" y="25" font-size="13">electron pairs repel</text></svg>';
 if(t==='hess')return S+'<rect x="48" y="30" width="75" height="30" rx="5" fill="#dbeafe"/><rect x="238" y="30" width="75" height="30" rx="5" fill="#dcfce7"/><rect x="142" y="118" width="78" height="30" rx="5" fill="#fef3c7"/><path d="M123 45 H236" stroke="#2563eb" stroke-width="3"/><path d="M90 61 L153 118 M275 61 L208 118" stroke="#64748b" stroke-width="3"/><text x="144" y="82" font-size="13">Hess cycle</text></svg>';
 if(t==='born-haber')return S+'<line x1="65" y1="140" x2="285" y2="140" stroke="#64748b" stroke-width="3"/><line x1="85" y1="110" x2="270" y2="110" stroke="#64748b" stroke-width="3"/><line x1="105" y1="78" x2="255" y2="78" stroke="#64748b" stroke-width="3"/><line x1="125" y1="45" x2="240" y2="45" stroke="#64748b" stroke-width="3"/><path d="M70 137 L88 113 L108 81 L128 48" fill="none" stroke="#2563eb" stroke-width="3"/><text x="188" y="164" font-size="12">enthalpy levels</text></svg>';
 if(t==='nmr')return S+'<line x1="45" y1="135" x2="315" y2="135" stroke="#0f172a" stroke-width="2"/><line x1="80" y1="135" x2="80" y2="78" stroke="#2563eb" stroke-width="4"/><line x1="145" y1="135" x2="145" y2="45" stroke="#2563eb" stroke-width="4"/><line x1="225" y1="135" x2="225" y2="92" stroke="#2563eb" stroke-width="4"/><line x1="292" y1="135" x2="292" y2="115" stroke="#2563eb" stroke-width="4"/><text x="205" y="158" font-size="12">chemical shift δ / ppm</text></svg>';
 if(t==='chromatography')return S+'<rect x="115" y="25" width="130" height="120" fill="#f8fafc" stroke="#64748b" stroke-width="2"/><line x1="125" y1="126" x2="235" y2="126" stroke="#0f172a" stroke-width="2"/><line x1="125" y1="46" x2="235" y2="46" stroke="#2563eb" stroke-width="2" stroke-dasharray="4 4"/><circle cx="160" cy="82" r="7" fill="#dc2626"/><circle cx="202" cy="64" r="7" fill="#16a34a"/><text x="145" y="163" font-size="12">Rf = solute / solvent</text></svg>';
 if(t==='organic-reaction')return S+'<rect x="42" y="60" width="95" height="48" rx="8" fill="#dbeafe"/><text x="70" y="90" font-size="13">reactant</text><path d="M145 84 H218" stroke="#0f172a" stroke-width="3"/><polygon points="218,84 207,78 207,90" fill="#0f172a"/><text x="155" y="68" font-size="11">reagent / conditions</text><rect x="225" y="60" width="95" height="48" rx="8" fill="#dcfce7"/><text x="252" y="90" font-size="13">product</text></svg>';
 if(t==='unit-circle')return S+'<circle cx="180" cy="85" r="62" fill="none" stroke="#2563eb" stroke-width="3"/><line x1="80" y1="85" x2="280" y2="85" stroke="#64748b"/><line x1="180" y1="15" x2="180" y2="155" stroke="#64748b"/><line x1="180" y1="85" x2="230" y2="48" stroke="#b45309" stroke-width="3"/><text x="199" y="78" font-size="13">θ</text></svg>';
 if(t==='tangent')return S+'<line x1="45" y1="138" x2="315" y2="138" stroke="#0f172a"/><line x1="75" y1="150" x2="75" y2="25" stroke="#0f172a"/><path d="M82 125 Q165 20 295 112" fill="none" stroke="#2563eb" stroke-width="4"/><line x1="115" y1="100" x2="255" y2="46" stroke="#b45309" stroke-width="3"/><text x="187" y="40" font-size="12">gradient = dy/dx</text></svg>';
 if(t==='area-curve')return S+'<line x1="45" y1="135" x2="315" y2="135" stroke="#0f172a"/><line x1="70" y1="150" x2="70" y2="30" stroke="#0f172a"/><path d="M75 125 Q145 35 250 70 Q285 83 305 110" fill="none" stroke="#2563eb" stroke-width="4"/><path d="M105 117 Q155 48 225 65 L225 135 L105 135 Z" fill="#dbeafe" opacity=".8"/><text x="137" y="158" font-size="12">∫ f(x) dx</text></svg>';
 if(t==='vector')return S+'<line x1="70" y1="130" x2="265" y2="55" stroke="#2563eb" stroke-width="4"/><polygon points="265,55 249,54 256,67" fill="#2563eb"/><line x1="70" y1="130" x2="265" y2="130" stroke="#94a3b8" stroke-width="2"/><line x1="265" y1="130" x2="265" y2="55" stroke="#94a3b8" stroke-width="2"/><text x="148" y="151" font-size="12">components</text></svg>';
 return '';
}

function renderLevel(){const li=levelInfo(profile.lifetimeXp);document.getElementById('levelNum').textContent=li.level;document.getElementById('xpTotal').textContent=profile.lifetimeXp+' XP';document.getElementById('pointBalance').textContent=profile.points;document.getElementById('xpNext').textContent=li.level>=500?'Maximum level reached':(li.req-li.into)+' XP to level '+(li.level+1);document.getElementById('xpBar').style.width=(li.level>=500?100:clamp(li.into/li.req*100,0,100))+'%'}
function renderStats(){document.getElementById('dueCount').textContent=cards.filter(c=>c.active!==false&&isDue(c)).length;document.getElementById('newCount').textContent=daily().newCards;document.getElementById('reviewedCount').textContent=daily().reviews;document.getElementById('masteredCount').textContent=cards.filter(c=>state(c.id).mastered).length}
function avatarSVG(character,outfit,small=false){
 const c=character||CHARACTERS[0],o=outfit||OUTFITS.find(x=>x.id===c.id+'-default')||OUTFITS[0],eye=c.eye||'#111827';
 const hairBack=c.style==='long'?'<path d="M34 62 Q37 23 80 22 Q123 24 126 64 L120 138 Q103 153 80 154 Q55 153 39 137Z" fill="'+c.hair2+'"/>':'';
 let hair='';
 if(c.style==='spiky')hair='<path d="M38 63 L46 27 L56 41 L67 18 L78 38 L92 16 L103 41 L118 27 L123 66 Q82 47 38 63Z" fill="'+c.hair+'"/>';
 else if(c.style==='bob')hair='<path d="M39 61 Q42 24 80 23 Q119 25 122 63 L117 100 Q104 79 101 48 Q72 62 40 55 L45 101 Q34 83 39 61Z" fill="'+c.hair+'"/>';
 else if(c.style==='messy')hair='<path d="M39 63 Q41 31 61 25 L66 13 L75 26 L88 13 L95 27 L113 20 L109 37 Q124 45 121 68 Q83 47 39 63Z" fill="'+c.hair+'"/>';
 else if(c.style==='long')hair='<path d="M40 61 Q42 24 80 23 Q119 25 122 65 Q101 50 82 45 Q63 59 40 60Z" fill="'+c.hair+'"/>';
 else hair='<path d="M40 61 Q44 25 80 23 Q114 25 121 60 Q97 46 78 44 Q61 55 40 61Z" fill="'+c.hair+'"/>';
 let accessory='';
 if(c.accessory==='blindfold')accessory='<rect x="54" y="69" width="52" height="16" rx="7" fill="#111827"/>';
 else if(c.accessory==='glasses')accessory='<circle cx="66" cy="77" r="10" fill="none" stroke="#334155" stroke-width="2"/><circle cx="94" cy="77" r="10" fill="none" stroke="#334155" stroke-width="2"/><line x1="76" y1="77" x2="84" y2="77" stroke="#334155" stroke-width="2"/>';
 else if(c.accessory==='eyepatch')accessory='<path d="M52 69 Q66 63 79 72 L77 87 Q63 92 52 82Z" fill="#111827"/><line x1="48" y1="64" x2="87" y2="83" stroke="#111827" stroke-width="2"/>';
 else if(c.accessory==='scar')accessory='<path d="M96 83 l8 8 M99 81 l7 7" stroke="#7f1d1d" stroke-width="1.8"/>';
 else if(c.accessory==='stitches')accessory='<path d="M49 92 L62 98 M52 88 L57 101 M58 92 L63 102" stroke="#7f1d1d" stroke-width="1.4"/>';
 else if(c.accessory==='scarf')accessory='<path d="M48 122 Q80 143 112 122 L109 143 Q80 158 51 143Z" fill="#991b1b"/>';
 else if(c.accessory==='darkeyes')accessory='<ellipse cx="66" cy="82" rx="10" ry="7" fill="rgba(15,23,42,.18)"/><ellipse cx="94" cy="82" rx="10" ry="7" fill="rgba(15,23,42,.18)"/>';
 return '<svg viewBox="0 0 160 190" role="img" aria-label="'+esc(c.name)+'"><defs><linearGradient id="bg-'+c.id+'" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+o.accent+'"/><stop offset="1" stop-color="#f8fafc"/></linearGradient></defs><rect width="160" height="190" rx="18" fill="url(#bg-'+c.id+')"/>'+hairBack+'<circle cx="80" cy="77" r="38" fill="'+c.skin+'"/>'+hair+'<circle cx="66" cy="77" r="3.6" fill="'+eye+'"/><circle cx="94" cy="77" r="3.6" fill="'+eye+'"/>'+accessory+'<path d="M72 95 Q80 101 88 95" fill="none" stroke="#7c2d12" stroke-width="2.3" stroke-linecap="round"/><path d="M43 190 L47 132 Q80 113 113 132 L117 190Z" fill="'+o.top+'"/><path d="M62 128 Q80 143 98 128 L102 144 Q80 159 58 144Z" fill="'+o.accent+'"/><circle cx="80" cy="125" r="6" fill="'+c.skin+'"/></svg>';
}
function renderAvatar(){
 const c=CHARACTERS.find(x=>x.id===profile.equippedCharacter)||CHARACTERS[0];
 let o=OUTFITS.find(x=>x.id===profile.equippedOutfit&&x.character===c.id);
 if(!o){o=OUTFITS.find(x=>x.id===c.id+'-default');profile.equippedOutfit=o.id}
 const l=LOCATIONS.find(x=>x.id===profile.equippedLocation)||LOCATIONS[0];
 document.getElementById('miniAvatar').innerHTML=avatarSVG(c,o,true);
 document.getElementById('characterPreview').innerHTML=avatarSVG(c,o);
 document.getElementById('equippedName').textContent=c.name;
 document.getElementById('equippedOutfitName').textContent=o.name+' outfit';
 document.getElementById('equippedLocation').textContent=l.name;
 document.getElementById('shopPoints').textContent=profile.points;
 selectedLocation=l.id;
}
function renderChallenge(){document.getElementById('challengeStreak').textContent=profile.challengeStreak+' day'+(profile.challengeStreak===1?'':'s')+' streak';const sub=document.getElementById('challengeSubject').value,scope=document.getElementById('challengeScope').value,key=dateKey()+'|'+(sub||'All')+'|'+scope,s=profile.dailyChallenges[key];document.getElementById('challengeStatus').textContent=s?(s.done?'Completed today':(s.index||0)+' / '+s.items.length+' completed'):'Not started yet';document.getElementById('startChallenge').textContent=s&&!s.done?'Resume challenge':s?.done?'Review challenge':'Start today’s challenge'}
function refreshFlashTopics(defaultIfEmpty=false){
 const sub=document.getElementById('flashSubject').value,topics=[...new Set(subjectCards(sub).map(c=>c.courseTopic||c.topic))].sort();flashTopics=new Set([...flashTopics].filter(t=>topics.includes(t)));if(defaultIfEmpty&&!flashTopics.size)topics.filter(t=>subjectCards(sub).some(c=>(c.courseTopic||c.topic)===t&&c.taught)).forEach(t=>flashTopics.add(t));
 document.getElementById('flashTopics').innerHTML=topics.map(t=>'<label class="check-item"><input type="checkbox" data-flash-topic="'+esc(t)+'" '+(flashTopics.has(t)?'checked':'')+'><span>'+esc(t)+'</span></label>').join('');document.querySelectorAll('[data-flash-topic]').forEach(el=>el.onchange=()=>{el.checked?flashTopics.add(el.dataset.flashTopic):flashTopics.delete(el.dataset.flashTopic);renderTopicCounts()});renderTopicCounts()
}
function applyFlashPreset(p){const sub=document.getElementById('flashSubject').value,base=subjectCards(sub);flashTopics.clear();if(p!=='clear'){let pick=base;if(p==='mock')pick=base.filter(c=>c.mock===true);if(p==='taught')pick=base.filter(taughtCard);for(const c of pick)flashTopics.add(c.courseTopic||c.topic)}refreshFlashTopics(false)}
function refreshExamFilters(defaultIfEmpty=false){
 const sub=document.getElementById('examSubject').value,base=subjectExam(sub),years=[...new Set(base.map(q=>q.year))].sort((a,b)=>b-a),topics=[...new Set(base.map(q=>q.courseTopic||q.topic))].sort(),types=[...new Set(base.map(q=>q.questionType).filter(Boolean))].sort();
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
function renderStudyType(){document.querySelectorAll('.study-type-btn').forEach(b=>b.classList.toggle('active',b.dataset.study===studyType));document.getElementById('mockControls').classList.toggle('hidden',studyType!=='mock');document.getElementById('flashControls').classList.toggle('hidden',studyType!=='flashcards');document.getElementById('examControls').classList.toggle('hidden',studyType!=='exam')}
function renderSessionBanner(){const e=document.getElementById('sessionBanner');if(!activeSession||activeSession.done){e.classList.add('hidden');return}e.classList.remove('hidden');e.textContent=activeSession.title+' · '+Math.min(activeSession.index+1,activeSession.items.length)+' / '+activeSession.items.length}
function renderCard(c){
 currentCardId=c.id;currentEvaluation=null;currentFlashAwarded=false;const s=state(c.id),health=Math.round(memoryHealth(c)*100),diag=c.visual?diagram(c.visual):'';
 document.getElementById('studyHost').innerHTML='<article class="review-card"><div class="card-meta"><div class="meta-left"><span class="badge">'+esc(c.subject)+' · '+esc(c.courseTopic||c.topic)+'</span><span class="badge">'+esc(c.kind==='content'?'knowledge':c.kind)+'</span></div><span class="queue-pos">memory '+health+'%</span></div><div class="card-body">'+(diag?'<div class="diagram">'+diag+'</div>':'')+'<div class="question">'+esc(c.front)+'</div><textarea id="answerInput" class="answer-input" placeholder="Type your answer from memory…"></textarea><div class="answer-actions"><button id="checkCard" class="check-btn">Check answer</button><button id="revealCard" class="show-btn">Just reveal</button></div><div id="feedback" class="feedback"></div><div id="modelAnswer" class="model-answer"><b>Model answer:</b> '+esc(c.back)+'<div id="missingIdeas"></div></div><button id="overrideBtn" class="override-btn">My answer was actually correct</button><div id="ratings" class="ratings"><button class="rating again" data-rating="again">Again<small>~10 min</small></button><button class="rating hard" data-rating="hard">Hard<small>~1 day</small></button><button class="rating good" data-rating="good">Good<small>longer gap</small></button><button class="rating easy" data-rating="easy">Easy<small>much longer</small></button></div></div></article>';
 const reveal=(check)=>{const input=document.getElementById('answerInput').value;currentEvaluation=check?evaluateCard(c,input):{status:'neutral',score:0,text:'Model answer shown. Compare it honestly.',missing:[]};if(currentEvaluation.status==='correct')awardFlashIfCorrect();const f=document.getElementById('feedback');f.className='feedback show '+currentEvaluation.status;f.textContent=currentEvaluation.text;document.getElementById('modelAnswer').classList.add('show');if(currentEvaluation.missing?.length)document.getElementById('missingIdeas').innerHTML='<ul class="missing-list">'+currentEvaluation.missing.map(x=>'<li>Missing: '+esc(x)+'</li>').join('')+'</ul>';document.getElementById('ratings').classList.add('show');if(currentEvaluation.status!=='correct')document.getElementById('overrideBtn').classList.add('show')};
 document.getElementById('checkCard').onclick=()=>reveal(true);document.getElementById('revealCard').onclick=()=>reveal(false);document.getElementById('overrideBtn').onclick=overrideFlashCorrect;document.querySelectorAll('[data-rating]').forEach(b=>b.onclick=()=>rateCard(c,b.dataset.rating,document.getElementById('answerInput').value))
}
function examSuggested(q,answer){
 const preds=q.markPoints.map(p=>markPointPrediction(answer,p)>=.42);let suggested=Math.round(preds.filter(Boolean).length/Math.max(1,q.markPoints.length)*q.marks);
 if(q.answerType==='numeric'&&Number.isFinite(q.numericAnswer)){const n=parseNumber(answer);if(Number.isFinite(n)&&Math.abs(n-q.numericAnswer)<=q.tolerance)suggested=Math.max(suggested,Math.min(q.marks,1+(q.marks>1?Math.floor(q.marks/2):0)))}
 return {preds,suggested:clamp(suggested,0,q.marks)};
}
function renderExam(q){
 const prev=profile.examResults[q.id]?.last,diag=q.visual?diagram(q.visual):'';
 document.getElementById('studyHost').innerHTML='<article class="exam-card"><div class="card-meta"><div class="meta-left"><span class="badge real">Real AQA source</span><span class="badge">'+esc(q.subject)+' · '+esc(q.level)+'</span><span class="badge">'+esc(q.courseTopic||q.topic)+'</span></div><span class="queue-pos">'+esc(q.year+' '+q.paper+' Q'+q.question)+' · '+q.marks+' marks</span></div><div class="card-body"><div class="copyright-note">The in-app wording is a faithful paraphrase. Use the official AQA PDF for the exact copyrighted wording.</div><div class="question-type">'+esc(q.questionType||'exam question')+'</div><div class="question">'+esc(q.prompt)+'</div><textarea id="examAnswer" class="answer-input" placeholder="Write your full working / answer here…"></textarea><div class="exam-source"><a class="source-link" target="_blank" rel="noopener" href="'+esc(q.qpUrl)+'">Original AQA question</a><a class="source-link" target="_blank" rel="noopener" href="'+esc(q.msUrl)+'">Official mark scheme</a></div>'+(prev?'<div class="question-type">Previous score: '+prev.marks+'/'+prev.max+'</div>':'')+'<button id="markExam" class="check-btn">Mark my answer</button><div id="examFeedback" class="feedback"></div><div id="examMarking" class="markscheme"></div><div id="scoreEditor" class="score-editor"></div></div></article>';
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
 const a=cards.filter(c=>c.active!==false).sort((x,y)=>weakness(y)-weakness(x)).slice(0,50);document.getElementById('weakList').innerHTML=a.map(c=>{const ct=c.courseTopic||c.topic,h=Math.round(memoryHealth(c)*100),ts=topicStat(c.subject,ct),acc=ts.examMax?Math.round(ts.examMarks/ts.examMax*100):null,cls=h>=85?'memory-good':h>=60?'memory-mid':'memory-low';return '<div class="list-row"><div><strong>'+esc(ct)+'</strong><small>'+esc(c.subject)+' · memory '+h+'%'+(acc!==null?' · exam '+acc+'%':'')+'</small></div><span class="memory-pill '+cls+'">'+Math.round(weakness(c))+'</span></div>'}).join('');
 const r=profile.errorLog.slice(0,30);document.getElementById('mistakeList').innerHTML=r.length?r.map(e=>'<div class="list-row"><div><strong>'+esc(e.topic)+'</strong><small>'+esc(e.subject)+' · '+esc(e.type==='exam'?'exam '+e.result:e.result)+(e.missedPoints?.length?' · missed: '+esc(e.missedPoints.slice(0,2).join(' / ')):'')+'</small></div><span class="score-pill">'+new Date(e.date).toLocaleDateString(undefined,{day:'numeric',month:'short'})+'</span></div>').join(''):'<div class="empty-card">No recorded mistakes yet.</div>'
}
function renderProgress(){
 document.getElementById('subjectProgress').innerHTML=['Physics','Chemistry','Maths'].map(sub=>{const a=cards.filter(c=>c.active!==false&&c.subject===sub),started=a.filter(c=>state(c.id).stage>=0),mature=a.filter(c=>state(c.id).mastered).length,avg=started.length?Math.round(started.map(memoryHealth).reduce((x,y)=>x+y,0)/started.length*100):0,ts=Object.entries(profile.topicStats).filter(([k])=>k.startsWith(sub+'|')).map(([,v])=>v),em=ts.reduce((x,v)=>x+(v.examMarks||0),0),ex=ts.reduce((x,v)=>x+(v.examMax||0),0);return '<div class="progress-card"><div class="subject-progress-head"><span>'+sub+'</span><span>'+mature+' mature / '+a.length+'</span></div><div class="bar-track"><div class="bar-fill" style="width:'+(a.length?mature/a.length*100:0)+'%"></div></div><div class="progress-note">'+started.length+' started · predicted recall '+avg+'%'+(ex?' · exam '+em+'/'+ex:'')+'</div></div>'}).join('');
 const started=cards.filter(c=>state(c.id).stage>=0),avg=started.length?Math.round(started.map(memoryHealth).reduce((a,b)=>a+b,0)/started.length*100):0,long=started.filter(c=>state(c.id).stability>=90).length;document.getElementById('retentionCard').innerHTML='<h3>Retention model</h3><div class="schedule-row"><span>Average predicted recall</span><b>'+avg+'%</b></div><div class="schedule-row"><span>Cards stable for 3+ months</span><b>'+long+'</b></div><div class="schedule-row"><span>Recorded mistakes</span><b>'+profile.errorLog.length+'</b></div>'
}

function buy(kind,id){
 let item,owned;
 if(kind==='character'){item=CHARACTERS.find(x=>x.id===id);owned=profile.shopOwned.characters}
 else if(kind==='outfit'){item=OUTFITS.find(x=>x.id===id);owned=profile.shopOwned.outfits}
 else {item=LOCATIONS.find(x=>x.id===id);owned=profile.shopOwned.locations}
 if(!item)return;
 if(owned.includes(id)){
   if(kind==='character'){profile.equippedCharacter=id;const ownFor=profile.shopOwned.outfits.find(x=>x.startsWith(id+'-'));profile.equippedOutfit=ownFor||id+'-default'}
   else if(kind==='outfit'){profile.equippedOutfit=id;profile.equippedCharacter=item.character}
   else profile.equippedLocation=id;
   save();renderAll();return;
 }
 if(profile.points<item.cost){showToast('Not enough points yet');return}
 profile.points-=item.cost;owned.push(id);
 if(kind==='character'){profile.equippedCharacter=id;const def=id+'-default';if(!profile.shopOwned.outfits.includes(def))profile.shopOwned.outfits.push(def);profile.equippedOutfit=def}
 else if(kind==='outfit'){profile.equippedOutfit=id;profile.equippedCharacter=item.character}
 else profile.equippedLocation=id;
 save();showToast('Unlocked '+item.name);renderAll();
}
async function locationPhoto(location,el){
 if(!location||!el)return;
 if(wikiPhotoCache[location.wiki]){el.innerHTML='<img src="'+esc(wikiPhotoCache[location.wiki])+'" alt="'+esc(location.name)+'">';return}
 try{
   const r=await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(location.wiki),{cache:'force-cache'});
   const j=await r.json(),url=j.thumbnail?.source||j.originalimage?.source;
   if(url){wikiPhotoCache[location.wiki]=url;el.innerHTML='<img src="'+esc(url)+'" alt="'+esc(location.name)+'">'}
 }catch{}
}
function renderShop(){
 const oc=profile.shopOwned.characters,oo=profile.shopOwned.outfits,ol=profile.shopOwned.locations,curr=profile.equippedCharacter;
 const seriesSel=document.getElementById('characterSeries'),ownedSel=document.getElementById('characterOwnedFilter');
 const series=[...new Set(CHARACTERS.map(c=>c.series))];
 const oldSeries=seriesSel.value;
 seriesSel.innerHTML='<option value="">All series</option>'+series.map(x=>'<option>'+esc(x)+'</option>').join('');
 if(series.includes(oldSeries))seriesSel.value=oldSeries;
 const seriesFilter=seriesSel.value,ownedFilter=ownedSel.value;
 const visibleChars=CHARACTERS.filter(c=>(!seriesFilter||c.series===seriesFilter)&&(ownedFilter==='all'||(ownedFilter==='owned'&&oc.includes(c.id))||(ownedFilter==='locked'&&!oc.includes(c.id))));
 document.getElementById('characterCount').textContent=oc.length+' / '+CHARACTERS.length+' unlocked';
 document.getElementById('outfitCount').textContent=oo.length+' / '+OUTFITS.length+' unlocked';
 document.getElementById('locationCount').textContent=ol.length+' / '+LOCATIONS.length+' unlocked';
 document.getElementById('characterShop').innerHTML=visibleChars.map(c=>{const def=OUTFITS.find(o=>o.id===c.id+'-default');return '<div class="shop-item character-card"><div class="shop-icon">'+avatarSVG(c,def)+'</div><b>'+esc(c.name)+'</b><small>'+esc(c.series)+'</small><button class="'+(!oc.includes(c.id)?'buy':'')+'" data-character="'+c.id+'" '+(!oc.includes(c.id)&&profile.points<c.cost?'disabled':'')+'>'+(oc.includes(c.id)?(curr===c.id?'Selected':'Select'):c.cost+' points')+'</button></div>'}).join('');
 const outfits=OUTFITS.filter(o=>o.character===curr),ch=CHARACTERS.find(c=>c.id===curr)||CHARACTERS[0];
 document.getElementById('outfitShop').innerHTML=outfits.map(o=>'<div class="shop-item outfit-card"><div class="shop-icon">'+avatarSVG(ch,o)+'</div><b>'+esc(o.name)+'</b><small>'+esc(ch.name)+' · '+esc(ch.series)+'</small><button class="'+(!oo.includes(o.id)?'buy':'')+'" data-outfit="'+o.id+'" '+(!oo.includes(o.id)&&profile.points<o.cost?'disabled':'')+'>'+(oo.includes(o.id)?(profile.equippedOutfit===o.id?'Equipped':'Equip'):o.cost+' points')+'</button></div>').join('');
 document.getElementById('locationShop').innerHTML=LOCATIONS.map(l=>'<div class="shop-item location-card"><div class="location-photo" data-location-photo="'+esc(l.id)+'"></div><div class="location-body"><b>'+esc(l.name)+'</b><small>'+l.lat.toFixed(1)+'°, '+l.lon.toFixed(1)+'°</small><button class="'+(!ol.includes(l.id)?'buy':'')+'" data-location="'+l.id+'" '+(!ol.includes(l.id)&&profile.points<l.cost?'disabled':'')+'>'+(ol.includes(l.id)?(profile.equippedLocation===l.id?'Active location':'Use location'):l.cost+' points')+'</button></div></div>').join('');
 document.querySelectorAll('[data-character]').forEach(b=>b.onclick=()=>buy('character',b.dataset.character));
 document.querySelectorAll('[data-outfit]').forEach(b=>b.onclick=()=>buy('outfit',b.dataset.outfit));
 document.querySelectorAll('[data-location]').forEach(b=>b.onclick=()=>buy('location',b.dataset.location));
 document.querySelectorAll('[data-location-photo]').forEach(el=>locationPhoto(LOCATIONS.find(l=>l.id===el.dataset.locationPhoto),el));
 drawGlobe();
}
function project(lat,lon,w,h){const la=lat*Math.PI/180,lo=(lon-globeLon)*Math.PI/180,cl=globeLat*Math.PI/180,x=Math.cos(la)*Math.sin(lo),y=Math.sin(la)*Math.cos(cl)-Math.cos(la)*Math.cos(lo)*Math.sin(cl),z=Math.sin(la)*Math.sin(cl)+Math.cos(la)*Math.cos(lo)*Math.cos(cl);const R=Math.min(w,h)*.4;return {x:w/2+x*R,y:h/2-y*R,z}}
function drawGlobe(){
 const c=document.getElementById('globe');if(!c)return;
 const ctx=c.getContext('2d'),w=c.width,h=c.height,R=Math.min(w,h)*.4,cx=w/2,cy=h/2;
 ctx.clearRect(0,0,w,h);ctx.fillStyle='#020617';ctx.fillRect(0,0,w,h);
 if(earthTextureReady&&earthPixels){
   const img=ctx.createImageData(w,h),out=img.data,lon0=globeLon*Math.PI/180,lat0=globeLat*Math.PI/180;
   const cosLat0=Math.cos(lat0),sinLat0=Math.sin(lat0);
   const minX=Math.max(0,Math.floor(cx-R)),maxX=Math.min(w-1,Math.ceil(cx+R)),minY=Math.max(0,Math.floor(cy-R)),maxY=Math.min(h-1,Math.ceil(cy+R));
   for(let py=minY;py<=maxY;py+=1){
     const yy=-(py-cy)/R;
     for(let px=minX;px<=maxX;px+=1){
       const xx=(px-cx)/R,r2=xx*xx+yy*yy;if(r2>1)continue;
       const z=Math.sqrt(1-r2);
       const lat=Math.asin(yy*cosLat0+z*sinLat0);
       const lon=lon0+Math.atan2(xx,z*cosLat0-yy*sinLat0);
       let u=((lon/(2*Math.PI)+.5)%1+1)%1,v=.5-lat/Math.PI;
       const tx=Math.min(earthW-1,Math.max(0,Math.floor(u*earthW))),ty=Math.min(earthH-1,Math.max(0,Math.floor(v*earthH))),si=(ty*earthW+tx)*4,di=(py*w+px)*4;
       const light=.58+.42*Math.max(0,z+.15*xx-.15*yy);
       out[di]=earthPixels[si]*light;out[di+1]=earthPixels[si+1]*light;out[di+2]=earthPixels[si+2]*light;out[di+3]=255;
     }
   }
   ctx.putImageData(img,0,0);
 }else{
   const g=ctx.createRadialGradient(cx-R*.3,cy-R*.3,R*.08,cx,cy,R);g.addColorStop(0,'#60a5fa');g.addColorStop(.55,'#2563eb');g.addColorStop(1,'#0f172a');ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.fill();
 }
 ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.stroke();
 for(const l of LOCATIONS){const p=project(l.lat,l.lon,w,h);if(p.z<=0)continue;const owned=profile.shopOwned.locations.includes(l.id);ctx.beginPath();ctx.arc(p.x,p.y,l.id===profile.equippedLocation?7:5,0,Math.PI*2);ctx.fillStyle=l.id===profile.equippedLocation?'#fbbf24':owned?'#ffffff':'rgba(255,255,255,.5)';ctx.fill();if(l.id===selectedLocation){ctx.strokeStyle='#fbbf24';ctx.lineWidth=2;ctx.stroke()}}
 const sel=LOCATIONS.find(x=>x.id===selectedLocation);if(sel)document.getElementById('globeLabel').textContent=sel.name+' · '+(profile.shopOwned.locations.includes(sel.id)?'unlocked':sel.cost+' points')+' · drag to rotate';
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
document.getElementById('startMock').onclick=startMockSession;document.getElementById('startFlashcards').onclick=startFlashSession;
document.getElementById('examSubject').onchange=()=>{examYears.clear();examTopics.clear();examTypes.clear();refreshExamFilters(true);renderAll()};
document.getElementById('yearsAll').onclick=()=>{examYears=new Set(subjectExam(document.getElementById('examSubject').value).map(q=>q.year));refreshExamFilters(false)};
document.getElementById('yearsRecent').onclick=()=>{const ys=[...new Set(subjectExam(document.getElementById('examSubject').value).map(q=>q.year))].sort((a,b)=>b-a);examYears=new Set(ys.slice(0,2));refreshExamFilters(false)};
document.getElementById('yearsClear').onclick=()=>{examYears.clear();refreshExamFilters(false)};
document.getElementById('examTopicsAll').onclick=()=>{examTopics=new Set(subjectExam(document.getElementById('examSubject').value).map(q=>q.courseTopic||q.topic));refreshExamFilters(false)};
document.getElementById('examTopicsWeak').onclick=()=>{const sub=document.getElementById('examSubject').value,ts=[...new Set(subjectExam(sub).map(q=>q.courseTopic||q.topic))].sort((a,b)=>(profile.topicWeakness[topicKey(sub,b)]||0)-(profile.topicWeakness[topicKey(sub,a)]||0));examTopics=new Set(ts.slice(0,Math.max(1,Math.ceil(ts.length/3))));refreshExamFilters(false)};
document.getElementById('examTopicsClear').onclick=()=>{examTopics.clear();refreshExamFilters(false)};
document.getElementById('startExam').onclick=startExamSession;
document.getElementById('startChallenge').onclick=startChallenge;document.getElementById('challengeSubject').onchange=renderChallenge;document.getElementById('challengeScope').onchange=renderChallenge;
document.getElementById('reviewWeakBtn').onclick=buildWeakSession;document.getElementById('redoMistakesBtn').onclick=startMistakes;
document.getElementById('characterSeries').onchange=renderShop;document.getElementById('characterOwnedFilter').onchange=renderShop;document.getElementById('syncBtn').onclick=()=>sync(true);document.getElementById('lockBtn').onclick=lockApp;

const globe=document.getElementById('globe');
globe.addEventListener('pointerdown',e=>{dragging=true;lastPointer={x:e.clientX,y:e.clientY};globe.setPointerCapture(e.pointerId)});
globe.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastPointer.x,dy=e.clientY-lastPointer.y;globeLon=(globeLon-dx*.45+540)%360-180;globeLat=clamp(globeLat+dy*.3,-65,65);lastPointer={x:e.clientX,y:e.clientY};drawGlobe()});
globe.addEventListener('pointerup',e=>{if(dragging){const p=globePointer(e),l=nearestPin(p.x,p.y);if(l){selectedLocation=l.id;if(profile.shopOwned.locations.includes(l.id)){profile.equippedLocation=l.id;save();renderAvatar()}drawGlobe()}}dragging=false});

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
