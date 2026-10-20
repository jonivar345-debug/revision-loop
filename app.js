
const DECK_URL='./deck.json',EXAM_URL='./exam_questions.json',DAY=86400000;
const PROGRESS_KEY='revisionLoopProgress5',PROFILE_KEY='revisionLoopProfile8',SETTINGS_KEY='revisionLoopSettings8';
let cards=[],examQuestions=[],deckVersion=0,bankVersion=0,deckMeta={};
let progress=load(PROGRESS_KEY,{});
let profile=load(PROFILE_KEY,{xp:0,reviews:0,daily:{},examResults:{},topicWeakness:{},topicStats:{},errorLog:[],dailyChallenges:{},challengeStreak:0,lastChallengeDate:''});
let settings=load(SETTINGS_KEY,{dailyNew:18,physicsUnits:{}});
let studyMode='mock',subject='',queueMode='normal',currentId=null,lastEvaluation=null,examIndex=0,toastTimer=null,activeSession=null;

function load(k,f){try{const x=JSON.parse(localStorage.getItem(k));return x??f}catch{return f}}
function ensureProfile(){
 profile.xp=profile.xp||0;profile.reviews=profile.reviews||0;profile.daily=profile.daily||{};profile.examResults=profile.examResults||{};
 profile.topicWeakness=profile.topicWeakness||{};profile.topicStats=profile.topicStats||{};profile.errorLog=profile.errorLog||[];profile.dailyChallenges=profile.dailyChallenges||{};
 profile.challengeStreak=profile.challengeStreak||0;profile.lastChallengeDate=profile.lastChallengeDate||'';
 settings.dailyNew=settings.dailyNew||18;settings.physicsUnits=settings.physicsUnits||{};
}
function save(){localStorage.setItem(PROGRESS_KEY,JSON.stringify(progress));localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings))}
function now(){return Date.now()} function dateKey(t=Date.now()){return new Date(t).toISOString().slice(0,10)}
function daily(){const k=dateKey();if(!profile.daily[k])profile.daily[k]={reviews:0,newCards:0,xp:0,examMarks:0,examMax:0};return profile.daily[k]}
function state(id){
 const x=progress[id]||{};const defaults={stage:-1,due:0,mastered:false,again:0,hard:0,good:0,last:0,firstSeen:'',stability:0,difficulty:5,history:[]};
 const s={...defaults,...x};if(!s.stability&&s.stage>=0){const legacy=[3,7,14,30,60,120,240,365];s.stability=legacy[Math.min(s.stage,legacy.length-1)]}
 return s;
}
function setState(id,s){progress[id]=s}
function levelThreshold(l){return Math.round(75*(l-1)*l/2)} function level(){let l=1;while(profile.xp>=levelThreshold(l+1))l++;return l}
function isNew(c){return state(c.id).stage<0} function isDue(c){const s=state(c.id);return s.stage>=0&&(s.due||0)<=now()}
function clamp(x,a,b){return Math.max(a,Math.min(b,x))}
function memoryHealthFromState(s){
 if(s.stage<0)return 0;if(!s.last)return .5;
 const stability=Math.max(.25,s.stability||3),elapsed=Math.max(0,(now()-s.last)/DAY);
 return clamp(Math.exp(-0.1053605*elapsed/stability),0,1);
}
function memoryHealth(c){return memoryHealthFromState(state(c.id))}
function topicKey(s,t){return s+'|'+t}
function topicStat(subject,topic){const k=topicKey(subject,topic);if(!profile.topicStats[k])profile.topicStats[k]={attempts:0,success:0,examMarks:0,examMax:0,last:0,lastMiss:0};return profile.topicStats[k]}
function examAccuracy(subject,topic){const t=topicStat(subject,topic);return t.examMax?t.examMarks/t.examMax:null}
function weakness(c){
 const s=state(c.id),tw=profile.topicWeakness[topicKey(c.subject,c.topic)]||0,health=memoryHealthFromState(s);
 return (c.priority||1)*3+(s.again||0)*2.8+(s.hard||0)*1.6+tw*2+(1-health)*7-(s.good||0)*.25;
}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function showToast(m){const e=document.getElementById('toast');e.textContent=m;e.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove('show'),1800)}
function addError(entry){profile.errorLog.unshift({...entry,date:now()});if(profile.errorLog.length>250)profile.errorLog.length=250}
function updateTopicFromCard(c,rating){
 const t=topicStat(c.subject,c.topic);t.attempts++;t.last=now();
 if(rating==='good'||rating==='easy')t.success++;else t.lastMiss=now();
}
function initPhysicsUnits(){(deckMeta.physicsUnits||[]).forEach(u=>{if(settings.physicsUnits[u.id]===undefined)settings.physicsUnits[u.id]=!!u.defaultUnlocked})}
function physicsUnitUnlocked(c){if(c.subject!=='Physics'||!c.unit)return true;const u=(deckMeta.physicsUnits||[]).find(x=>x.id===c.unit);return settings.physicsUnits[c.unit]!==undefined?settings.physicsUnits[c.unit]!==false:(u?!!u.defaultUnlocked:true)}
function resetPhysicsUnits(){settings.physicsUnits={};(deckMeta.physicsUnits||[]).forEach(u=>settings.physicsUnits[u.id]=!!u.defaultUnlocked);save();currentId=null;updateTopicOptions();renderAll();showToast('Physics topics reset')}

function taughtCard(c){
 if(c.subject==='Physics')return physicsUnitUnlocked(c);
 return c.mock===true;
}
function modeCards(mode=studyMode){
 let a=cards.filter(c=>c.active!==false);
 if(mode==='mock')a=a.filter(c=>c.mock===true);
 else if(mode==='full')a=a.filter(c=>c.kind!=='insurance'&&(c.subject!=='Physics'||physicsUnitUnlocked(c)));
 else if(mode==='topic'){const s=document.getElementById('topicSubject').value,t=document.getElementById('topicSelect').value;a=a.filter(c=>c.subject===s&&c.topic===t&&(s!=='Physics'||physicsUnitUnlocked(c)))}
 if(subject&&mode!=='topic')a=a.filter(c=>c.subject===subject);
 return a;
}
function reviewQueue(){
 let base=modeCards();
 if(queueMode==='mistakes'){
   const ids=[...new Set(profile.errorLog.filter(e=>e.type==='card').map(e=>e.id))];
   return ids.map(id=>cards.find(c=>c.id===id)).filter(Boolean).sort((a,b)=>weakness(b)-weakness(a));
 }
 if(queueMode==='weak'){const w=base.filter(c=>!state(c.id).mastered||memoryHealth(c)<.9).sort((a,b)=>weakness(b)-weakness(a)).slice(0,30),d=w.filter(isDue);return d.length?d:w}
 if(queueMode==='practical')base=base.filter(c=>c.kind==='practical');
 const due=base.filter(isDue).sort((a,b)=>weakness(b)-weakness(a)||(state(a.id).due-state(b.id).due));
 const allowance=Math.max(0,settings.dailyNew-daily().newCards);
 const fresh=base.filter(isNew).sort((a,b)=>weakness(b)-weakness(a)).slice(0,allowance);
 const seen=new Set(),all=[...due,...fresh],content=all.filter(c=>c.kind!=='practical'),pr=all.filter(c=>c.kind==='practical'),out=[];
 let i=0,j=0;while(i<content.length||j<pr.length){for(let n=0;n<5&&i<content.length;n++){const c=content[i++];if(!seen.has(c.id)){out.push(c);seen.add(c.id)}}if(j<pr.length){const c=pr[j++];if(!seen.has(c.id)){out.push(c);seen.add(c.id)}}if(i>=content.length)while(j<pr.length){const c=pr[j++];if(!seen.has(c.id)){out.push(c);seen.add(c.id)}}}
 return out;
}

function normalise(x){let s=String(x||'').normalize('NFKD').toLowerCase();const r=[[/θ/g,' theta '],[/λ/g,' lambda '],[/ρ/g,' rho '],[/δ|Δ/g,' delta '],[/φ/g,' phi '],[/ε/g,' epsilon '],[/²/g,'^2'],[/³/g,'^3'],[/−/g,'-'],[/×/g,' x '],[/÷/g,' / '],[/\bcosine\b/g,'cos'],[/\bsine\b/g,'sin'],[/\bperp\b/g,'perpendicular']];r.forEach(a=>s=s.replace(a[0],a[1]));return s.replace(/[^a-z0-9+\-*/=<>^.[\] ]+/g,' ').replace(/\s+/g,' ').trim()}
const STOP=new Set(['the','a','an','of','to','and','in','is','are','with','at','on','for','from','by','it','be','as','or','that','this']);
function tokens(s){return normalise(s).split(' ').filter(x=>x&&!STOP.has(x))}
function lev(a,b){const n=b.length;let p=Array.from({length:n+1},(_,i)=>i),c=new Array(n+1);for(let i=1;i<=a.length;i++){c[0]=i;for(let j=1;j<=n;j++)c[j]=Math.min(c[j-1]+1,p[j]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));[p,c]=[c,p]}return p[n]}
function close(a,b){if(a===b)return true;const m=Math.max(a.length,b.length),d=lev(a,b);return (m>=8&&d<=2)||(m>=4&&d<=1)}
function phraseScore(input,p){const a=tokens(input),b=tokens(p);if(!b.length)return 0;let h=0;b.forEach(t=>{if(a.some(x=>close(x,t)))h++});return h/b.length}
function compact(s){return normalise(s).replace(/\s+/g,'').replace(/epsilon/g,'e').replace(/lambda/g,'l').replace(/theta/g,'t').replace(/delta/g,'d')}
function evaluate(c,input){
 if(!String(input||'').trim())return {status:'neutral',text:'Model answer shown. Compare it with yours, then rate yourself.'};
 let best=0;(c.accept||[]).forEach(a=>{const x=compact(input),y=compact(a);best=Math.max(best,x===y?1:phraseScore(input,a))});
 if(c.concepts?.length){let hit=0;c.concepts.forEach(g=>{let gb=0;(Array.isArray(g)?g:[g]).forEach(o=>gb=Math.max(gb,phraseScore(input,o)));if(gb>=.72)hit++});best=Math.max(best,hit/c.concepts.length)}
 if(best>=.8)return {status:'correct',text:'Looks correct. Equivalent wording and ordinary spelling mistakes are accepted.'};
 if(best>=.48)return {status:'partial',text:'Mostly there. Check the model answer for the missing key idea.'};
 return {status:'wrong',text:'Not enough key ideas matched. Compare with the model answer and rate yourself honestly.'};
}
function nextSchedule(s,rating){
 const old=Math.max(.25,s.stability||0),elapsed=s.last?Math.max(0,(now()-s.last)/DAY):0,overdue=old?clamp(elapsed/old,0,2):0;
 let stability=old,difficulty=clamp(s.difficulty||5,1,10),intervalDays;
 if(rating==='again'){difficulty=clamp(difficulty+.7,1,10);stability=Math.max(.25,old*.35);intervalDays=10/1440}
 else if(rating==='hard'){difficulty=clamp(difficulty+.2,1,10);stability=Math.max(1,old?old*1.12:1);intervalDays=Math.min(stability,1)}
 else if(rating==='good'){difficulty=clamp(difficulty-.08,1,10);if(s.stage<0)stability=3;else stability=clamp(old*(1.72+.12*overdue-.035*(difficulty-5)),2,365);intervalDays=stability}
 else{difficulty=clamp(difficulty-.3,1,10);if(s.stage<0)stability=7;else stability=clamp(old*(2.3+.12*overdue-.025*(difficulty-5)),4,365);intervalDays=stability}
 return {stability,difficulty,intervalDays};
}
function rateCard(c,rating,typed=''){
 const s=state(c.id),wasNew=s.stage<0,sch=nextSchedule(s,rating);s.last=now();s.stability=sch.stability;s.difficulty=sch.difficulty;s.due=now()+sch.intervalDays*DAY;s.stage=Math.max(0,s.stage)+(rating==='good'?1:rating==='easy'?2:0);s.mastered=s.stability>=60&&(s.good||0)>=2;
 if(wasNew&&!s.firstSeen){s.firstSeen=dateKey();daily().newCards++}
 if(rating==='again')s.again++;else if(rating==='hard')s.hard++;else s.good++;
 s.history=s.history||[];s.history.push({t:now(),rating,stability:s.stability,answer:String(typed||'').slice(0,250)});if(s.history.length>30)s.history=s.history.slice(-30);
 setState(c.id,s);updateTopicFromCard(c,rating);
 if(rating==='again'||rating==='hard')addError({type:'card',id:c.id,subject:c.subject,topic:c.topic,result:rating,answer:String(typed||'').slice(0,250),longGap:s.last&&((now()-s.last)/DAY>30)});
 let xp={again:2,hard:5,good:10,easy:12}[rating]||0;if(lastEvaluation?.status==='correct')xp+=3;if(s.mastered&&s.stability>=60)xp+=3;profile.xp+=xp;profile.reviews++;daily().reviews++;daily().xp+=xp;save();showToast('+'+xp+' XP');
 if(activeSession)completeSessionItem();else{currentId=null;lastEvaluation=null;renderAll()}
}

function parseNumber(s){let x=String(s||'').toLowerCase().replace(/,/g,'').replace(/×/g,'x').replace(/\s+/g,'');const sci=x.match(/([-+]?\d*\.?\d+)x10\^?([-+]?\d+)/);if(sci)return Number(sci[1])*Math.pow(10,Number(sci[2]));const m=x.match(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/);return m?Number(m[0]):NaN}
function filteredExamQuestions(){
 const s=document.getElementById('examSubject').value,l=document.getElementById('examLevel').value,t=document.getElementById('examTopic').value,qt=document.getElementById('examType').value;
 return examQuestions.filter(q=>q.subject===s&&(!l||q.level===l)&&(!t||q.topic===t)&&(!qt||q.questionType===qt));
}
function awardExam(q,marks,answer=''){
 const pct=marks/q.marks,t=topicStat(q.subject,q.topic);t.examMarks+=marks;t.examMax+=q.marks;t.attempts++;t.last=now();if(pct<1)t.lastMiss=now();
 if(!profile.examResults[q.id])profile.examResults[q.id]={attempts:[]};if(!profile.examResults[q.id].attempts)profile.examResults[q.id].attempts=[];
 profile.examResults[q.id].attempts.push({marks,max:q.marks,date:now(),answer:String(answer||'').slice(0,600)});profile.examResults[q.id].last={marks,max:q.marks,date:now()};
 let w=profile.topicWeakness[topicKey(q.subject,q.topic)]||0;if(pct<.5)w=Math.min(8,w+2);else if(pct<1)w=Math.min(8,w+1);else w=Math.max(0,w-1);profile.topicWeakness[topicKey(q.subject,q.topic)]=w;
 if(marks<q.marks)addError({type:'exam',id:q.id,subject:q.subject,topic:q.topic,result:marks+'/'+q.marks,answer:String(answer||'').slice(0,600)});
 const xp=marks*4+(marks===q.marks?5:0);profile.xp+=xp;daily().examMarks+=marks;daily().examMax+=q.marks;save();showToast('+'+xp+' XP · '+marks+'/'+q.marks);
 if(activeSession)completeSessionItem();else{examIndex++;renderAll()}
}

function challengePool(scope,sub){
 let a=cards.filter(c=>c.active!==false&&(!sub||c.subject===sub));
 if(scope==='mock')a=a.filter(c=>c.mock===true);
 else a=a.filter(c=>taughtCard(c));
 return a;
}
function challengeExamPool(scope,sub){
 return examQuestions.filter(q=>{
  if(sub&&q.subject!==sub)return false;
  if(scope==='mock')return q.level==='AS';
  if(q.subject==='Physics'&&q.unit){const fake={subject:'Physics',unit:q.unit};return physicsUnitUnlocked(fake)}
  return q.level==='AS'||q.subject!=='Physics';
 });
}
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function makeDailyChallenge(sub,scope){
 const key=dateKey()+'|'+(sub||'All')+'|'+scope;if(profile.dailyChallenges[key])return {key,...profile.dailyChallenges[key]};
 const pool=challengePool(scope,sub),errors=new Set(profile.errorLog.slice(0,80).map(e=>e.id));
 const ranked=[...pool].sort((a,b)=>(weakness(b)+(errors.has(b.id)?5:0)+(1-memoryHealth(b))*5)-(weakness(a)+(errors.has(a.id)?5:0)+(1-memoryHealth(a))*5));
 const picked=[],topics=new Set();
 for(const c of ranked){if(picked.length>=5)break;if(!topics.has(c.topic)||picked.length>=3){picked.push({type:'card',id:c.id});topics.add(c.topic)}}
 const qpool=challengeExamPool(scope,sub).sort((a,b)=>{
   const ea=errors.has(a.id)?8:0,eb=errors.has(b.id)?8:0,sa=profile.examResults[a.id]?.last?.marks/profile.examResults[a.id]?.last?.max||0,sb=profile.examResults[b.id]?.last?.marks/profile.examResults[b.id]?.last?.max||0;
   return (eb+(1-sb)*4+(hash(dateKey()+b.id)%100)/100)-(ea+(1-sa)*4+(hash(dateKey()+a.id)%100)/100);
 });
 const usedTypes=new Set();for(const q of qpool){if(picked.filter(x=>x.type==='exam').length>=2)break;if(!usedTypes.has(q.questionType)||usedTypes.size===0){picked.push({type:'exam',id:q.id});usedTypes.add(q.questionType)}}
 const session={items:picked,index:0,done:false,bonus:false,subject:sub||'',scope};profile.dailyChallenges[key]=session;save();return {key,...session};
}
function startDailyChallenge(){
 const sub=document.getElementById('challengeSubject').value,scope=document.getElementById('challengeScope').value,s=makeDailyChallenge(sub,scope);activeSession={kind:'daily',key:s.key,...profile.dailyChallenges[s.key]};switchPanel('study');currentId=null;renderAll();
}
function startMistakeSession(){
 const latest=[],seen=new Set();for(const e of profile.errorLog){const k=e.type+'|'+e.id;if(!seen.has(k)){latest.push({type:e.type==='exam'?'exam':'card',id:e.id});seen.add(k)}if(latest.length>=12)break}
 if(!latest.length){showToast('No recorded mistakes yet');return}activeSession={kind:'mistakes',key:'mistakes',items:latest,index:0,done:false};switchPanel('study');renderAll();
}
function completeSessionItem(){
 if(!activeSession)return;activeSession.index++;
 if(activeSession.kind==='daily'){const s=profile.dailyChallenges[activeSession.key];s.index=activeSession.index;if(s.index>=s.items.length){s.done=true;if(!s.bonus){s.bonus=true;profile.xp+=40;const today=dateKey(),y=new Date(Date.now()-DAY).toISOString().slice(0,10);profile.challengeStreak=profile.lastChallengeDate===y?profile.challengeStreak+1:(profile.lastChallengeDate===today?profile.challengeStreak:1);profile.lastChallengeDate=today;showToast('Daily challenge complete · +40 XP')}save();activeSession=null}else{save();activeSession={kind:'daily',key:activeSession.key,...s}}}
 else if(activeSession.index>=activeSession.items.length)activeSession=null;
 currentId=null;lastEvaluation=null;renderAll();
}

function diagram(t){
 const S='<svg viewBox="0 0 360 170" width="360" height="170" aria-hidden="true">';
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

function renderLevel(){const l=level(),lo=levelThreshold(l),hi=levelThreshold(l+1),pct=clamp((profile.xp-lo)/(hi-lo)*100,0,100);document.getElementById('levelNum').textContent=l;document.getElementById('xpTotal').textContent=profile.xp+' XP';document.getElementById('xpNext').textContent=(hi-profile.xp)+' XP to level '+(l+1);document.getElementById('xpBar').style.width=pct+'%'}
function renderStats(){const q=activeSession?[]:(studyMode==='exam'?[]:reviewQueue());document.getElementById('dueCount').textContent=studyMode==='exam'?filteredExamQuestions().length:q.filter(c=>isDue(c)).length;document.getElementById('newCount').textContent=daily().newCards+' / '+settings.dailyNew;document.getElementById('reviewedCount').textContent=daily().reviews;document.getElementById('masteredCount').textContent=cards.filter(c=>state(c.id).mastered).length}
function renderChallengeHeader(){document.getElementById('challengeStreak').textContent=profile.challengeStreak+' day'+(profile.challengeStreak===1?'':'s')+' streak';const sub=document.getElementById('challengeSubject').value,scope=document.getElementById('challengeScope').value,key=dateKey()+'|'+(sub||'All')+'|'+scope,s=profile.dailyChallenges[key];document.getElementById('challengeStatus').textContent=s?(s.done?'Completed today · '+s.items.length+'/'+s.items.length:(s.index||0)+'/'+s.items.length+' completed'):'Not started yet';document.getElementById('startChallenge').textContent=s&&!s.done?'Resume today’s challenge':s?.done?'Review today’s challenge':'Start today’s challenge'}
function renderPhysicsUnitManager(){const box=document.getElementById('physicsUnitManager'),list=document.getElementById('physicsUnitList'),topicPhys=studyMode==='topic'&&document.getElementById('topicSubject').value==='Physics',show=studyMode==='full'||topicPhys;box.classList.toggle('hidden',!show);if(!show)return;list.innerHTML=(deckMeta.physicsUnits||[]).map(u=>{const checked=settings.physicsUnits[u.id]!==false,count=cards.filter(c=>c.active!==false&&c.subject==='Physics'&&c.unit===u.id).length;return '<label class="unit-toggle '+(checked?'':'locked')+'"><input type="checkbox" data-unit="'+esc(u.id)+'" '+(checked?'checked':'')+'><span><strong>'+(checked?'🔓 ':'🔒 ')+esc(u.label)+'</strong><small>'+esc(u.stage)+' · '+count+' cards</small></span></label>'}).join('');list.querySelectorAll('[data-unit]').forEach(el=>el.onchange=()=>{settings.physicsUnits[el.dataset.unit]=el.checked;save();currentId=null;updateTopicOptions();renderAll()})}
function renderModeControls(){
 document.querySelectorAll('.mode-btn').forEach(b=>b.classList.toggle('active',!activeSession&&b.dataset.mode===studyMode));
 const topic=studyMode==='topic'&&!activeSession,exam=studyMode==='exam'&&!activeSession;
 document.getElementById('topicControls').classList.toggle('hidden',!topic);document.getElementById('examControls').classList.toggle('hidden',!exam);
 document.querySelector('.subject-chips').classList.toggle('hidden',topic||exam||!!activeSession);document.getElementById('queueTools').classList.toggle('hidden',exam||!!activeSession);
 let note='';if(activeSession)note=activeSession.kind==='daily'?'Daily challenge in progress.':'Mistake review in progress.';
 else if(studyMode==='mock')note='Current mocks only: Physics AS/Year 1, Chemistry Year 1 plus taught Year 2, Maths Year 1 Pure.';
 else if(studyMode==='full')note='Whole A-level course, but Physics only serves sections you have unlocked.';
 else if(studyMode==='topic')note='Choose one topic. Locked Physics sections remain hidden.';
 else note='Real AQA past-paper sources with official question-paper and mark-scheme links.';
 document.getElementById('modeNote').textContent=note;renderPhysicsUnitManager();
}
function updateTopicOptions(){const s=document.getElementById('topicSubject').value,sel=document.getElementById('topicSelect'),old=sel.value,ts=[...new Set(cards.filter(c=>c.active!==false&&c.subject===s&&c.kind!=='insurance'&&(s!=='Physics'||physicsUnitUnlocked(c))).map(c=>c.topic))].sort();sel.innerHTML=ts.map(t=>'<option>'+esc(t)+'</option>').join('');if(ts.includes(old))sel.value=old}
function updateExamControls(){const s=document.getElementById('examSubject').value,l=document.getElementById('examLevel').value,topic=document.getElementById('examTopic'),type=document.getElementById('examType'),oldT=topic.value,oldType=type.value,base=examQuestions.filter(q=>q.subject===s&&(!l||q.level===l)),topics=[...new Set(base.map(q=>q.topic))].sort(),types=[...new Set(base.map(q=>q.questionType).filter(Boolean))].sort();topic.innerHTML='<option value="">All topics</option>'+topics.map(t=>'<option>'+esc(t)+'</option>').join('');type.innerHTML='<option value="">All question types</option>'+types.map(t=>'<option>'+esc(t)+'</option>').join('');if(topics.includes(oldT))topic.value=oldT;if(types.includes(oldType))type.value=oldType;examIndex=0}
function showSessionBanner(){const e=document.getElementById('sessionBanner');if(!activeSession){e.classList.add('hidden');return}e.classList.remove('hidden');e.textContent=(activeSession.kind==='daily'?'Daily starter':'Mistake review')+' · item '+Math.min(activeSession.index+1,activeSession.items.length)+' of '+activeSession.items.length}

function revealCard(c){const input=document.getElementById('answerInput').value;lastEvaluation=evaluate(c,input);const f=document.getElementById('feedback');f.className='feedback show '+lastEvaluation.status;f.textContent=lastEvaluation.text;document.getElementById('modelAnswer').classList.add('show');document.getElementById('ratings').classList.add('show');document.getElementById('checkBtn').disabled=true;document.getElementById('showBtn').disabled=true}
function renderCard(c,queueLength=1){const s=state(c.id),miss=(s.again||0)+(s.hard||0),diag=c.visual?diagram(c.visual):'',health=Math.round(memoryHealth(c)*100);document.getElementById('studyHost').innerHTML='<article class="review-card"><div class="card-meta"><div class="meta-left"><span class="badge">'+esc(c.subject)+' · '+esc(c.topic)+'</span><span class="badge '+(c.kind==='practical'?'practical':c.kind==='insurance'?'insurance':'')+'">'+esc(c.kind==='content'?'knowledge':c.kind)+'</span>'+(miss>=4?'<span class="badge reteach">Needs reteach</span>':'')+'</div><span class="queue-pos">Memory '+health+'%</span></div><div class="card-body">'+(diag?'<div class="diagram">'+diag+'</div>':'')+'<div class="question">'+esc(c.front)+'</div><textarea id="answerInput" class="answer-input" placeholder="Type your answer from memory…"></textarea><div class="answer-actions"><button id="checkBtn" class="check-btn">Check answer</button><button id="showBtn" class="show-btn">Just reveal</button></div><div id="feedback" class="feedback"></div><div id="modelAnswer" class="model-answer"><b>Model answer:</b> '+esc(c.back)+'</div><div id="ratings" class="ratings"><button class="rating again" data-rating="again">Again<small>~10 min</small></button><button class="rating hard" data-rating="hard">Hard<small>~1 day</small></button><button class="rating good" data-rating="good">Good<small>adaptive</small></button><button class="rating easy" data-rating="easy">Easy<small>longer gap</small></button></div></div></article>';document.getElementById('checkBtn').onclick=()=>revealCard(c);document.getElementById('showBtn').onclick=()=>{lastEvaluation={status:'neutral',text:'Model answer shown. Compare it honestly.'};const f=document.getElementById('feedback');f.className='feedback show neutral';f.textContent=lastEvaluation.text;document.getElementById('modelAnswer').classList.add('show');document.getElementById('ratings').classList.add('show')};document.querySelectorAll('[data-rating]').forEach(b=>b.onclick=()=>rateCard(c,b.dataset.rating,document.getElementById('answerInput').value))}
function revealExam(q){const input=document.getElementById('examAnswer').value,fb=document.getElementById('examFeedback');let msg='Use the official mark-scheme checklist below to award your marks.';if(q.answerType==='numeric'&&Number.isFinite(q.numericAnswer)){const n=parseNumber(input);if(Number.isFinite(n)){const ok=Math.abs(n-q.numericAnswer)<=q.tolerance;msg=ok?'Your final numerical answer matches the official answer. Check method marks too.':'Your final numerical answer does not match yet. Use the mark points to locate the error.'}}fb.className='feedback show '+(msg.startsWith('Your final numerical answer matches')?'correct':'neutral');fb.textContent=msg;document.getElementById('examMS').classList.add('show');document.getElementById('markButtons').classList.add('show');document.getElementById('revealExamBtn').disabled=true}
function renderExamQuestion(q){const prev=profile.examResults[q.id]?.last;document.getElementById('studyHost').innerHTML='<article class="exam-card"><div class="card-meta"><div class="meta-left"><span class="badge real">Real AQA source</span><span class="badge">'+esc(q.subject)+' · '+esc(q.level)+'</span><span class="badge">'+esc(q.topic)+'</span></div><span class="queue-pos">'+esc(q.year+' '+q.paper+' Q'+q.question)+' · '+q.marks+' marks</span></div><div class="card-body"><div class="copyright-note">Paraphrased from the named AQA paper. Open the official PDF for the exact copyrighted wording.</div><div class="question-type">'+esc(q.questionType||'exam question')+'</div><div class="question">'+esc(q.prompt)+'</div><textarea id="examAnswer" class="answer-input" placeholder="Write your working / answer here…"></textarea><div class="exam-source"><a class="source-link" target="_blank" rel="noopener" href="'+esc(q.qpUrl)+'">Original AQA question</a><a class="source-link" target="_blank" rel="noopener" href="'+esc(q.msUrl)+'">Official mark scheme</a></div>'+(prev?'<div class="exam-result">Last score: '+prev.marks+'/'+prev.max+'</div>':'')+'<button id="revealExamBtn" class="check-btn">Reveal marking points</button><div id="examFeedback" class="feedback"></div><div id="examMS" class="markscheme"><b>Mark-scheme points (summarised):</b><ul>'+q.markPoints.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>'+(q.modelAnswer?'<p><b>Model outcome:</b> '+esc(q.modelAnswer)+'</p>':'')+(q.answerType==='numeric'?'<p><b>Official final answer:</b> '+q.numericAnswer+(q.unit?' '+esc(q.unit):'')+'</p>':'')+'</div><div id="markButtons" class="mark-buttons">'+Array.from({length:q.marks+1},(_,i)=>'<button class="mark-btn" data-mark="'+i+'">'+i+'</button>').join('')+'</div></div></article>';document.getElementById('revealExamBtn').onclick=()=>revealExam(q);document.querySelectorAll('[data-mark]').forEach(b=>b.onclick=()=>awardExam(q,Number(b.dataset.mark),document.getElementById('examAnswer').value))}
function renderStudy(){
 renderModeControls();showSessionBanner();
 if(activeSession){if(activeSession.index>=activeSession.items.length){activeSession=null;renderAll();return}const item=activeSession.items[activeSession.index],obj=item.type==='card'?cards.find(c=>c.id===item.id):examQuestions.find(q=>q.id===item.id);if(!obj){activeSession.index++;renderStudy();return}return item.type==='card'?renderCard(obj):renderExamQuestion(obj)}
 if(studyMode==='exam'){const q=filteredExamQuestions();if(!q.length){document.getElementById('studyHost').innerHTML='<div class="empty-card"><h3>No questions in this filter yet</h3><p>The bank is growing continuously.</p></div>';return}return renderExamQuestion(q[examIndex%q.length])}
 const q=reviewQueue();document.getElementById('normalQueue').classList.toggle('hidden',queueMode==='normal');if(!q.length){document.getElementById('studyHost').innerHTML='<div class="empty-card"><h3>You’re caught up</h3><p>No cards are due in this selection.</p><button id="moreNew" class="primary-small">Add 10 new cards today</button></div>';document.getElementById('moreNew').onclick=()=>{settings.dailyNew+=10;save();renderAll()};return}const c=q.find(x=>x.id===currentId)||q[0];currentId=c.id;renderCard(c,q.length)
}
function renderWeak(){
 const a=cards.filter(c=>c.active!==false).sort((x,y)=>weakness(y)-weakness(x)).slice(0,45);
 document.getElementById('weakList').innerHTML=a.map(c=>{const h=Math.round(memoryHealth(c)*100),acc=examAccuracy(c.subject,c.topic),cls=h>=85?'memory-good':h>=60?'memory-mid':'memory-low';return '<div class="list-row"><div><strong>'+esc(c.topic)+'</strong><small>'+esc(c.subject)+' · memory '+h+'%'+(acc!==null?' · exam '+Math.round(acc*100)+'%':'')+'</small></div><span class="memory-pill '+cls+'">'+Math.round(weakness(c))+'</span></div>'}).join('');
 const recent=profile.errorLog.slice(0,20);document.getElementById('mistakeList').innerHTML=recent.length?recent.map(e=>{const when=new Date(e.date).toLocaleDateString(undefined,{day:'numeric',month:'short'});return '<div class="list-row"><div><strong>'+esc(e.topic)+'</strong><small>'+esc(e.subject)+' · '+esc(e.type==='exam'?'Exam '+e.result:e.result)+' · '+when+(e.longGap?' · long-gap lapse':'')+'</small></div><span class="score-pill">saved</span></div>'}).join(''):'<div class="empty-card">No mistakes recorded yet.</div>'
}
function renderProgress(){
 document.getElementById('subjectProgress').innerHTML=['Physics','Chemistry','Maths'].map(sub=>{const a=cards.filter(c=>c.active!==false&&c.subject===sub&&c.kind!=='insurance'),started=a.filter(c=>state(c.id).stage>=0).length,mature=a.filter(c=>state(c.id).mastered).length,health=a.filter(c=>state(c.id).stage>=0).map(memoryHealth),avg=health.length?Math.round(health.reduce((x,y)=>x+y,0)/health.length*100):0;const eq=Object.entries(profile.examResults).filter(([id])=>examQuestions.find(q=>q.id===id)?.subject===sub);let got=0,max=0;eq.forEach(([,r])=>(r.attempts||[]).forEach(at=>{got+=at.marks;max+=at.max}));return '<div class="progress-card"><div class="subject-progress-head"><span>'+sub+'</span><span>'+mature+' mature / '+a.length+'</span></div><div class="bar-track"><div class="bar-fill" style="width:'+(a.length?mature/a.length*100:0)+'%"></div></div><div class="progress-note">'+started+' started · average memory '+avg+'%'+(max?' · exam '+got+'/'+max:'')+'</div></div>'}).join('');
 const started=cards.filter(c=>state(c.id).stage>=0),avg=started.length?Math.round(started.map(memoryHealth).reduce((a,b)=>a+b,0)/started.length*100):0,long=started.filter(c=>state(c.id).stability>=90).length;
 document.getElementById('retentionCard').innerHTML='<h3>Retention model</h3><div class="schedule-row"><span>Average predicted recall</span><b>'+avg+'%</b></div><div class="schedule-row"><span>Cards stable for 3+ months</span><b>'+long+'</b></div><div class="schedule-row"><span>Recorded mistakes</span><b>'+profile.errorLog.length+'</b></div>';
}
function renderBrowse(){const term=document.getElementById('search').value.toLowerCase().trim(),sub=document.getElementById('subjectFilter').value,k=document.getElementById('kindFilter').value,a=cards.filter(c=>c.active!==false&&(!sub||c.subject===sub)&&(!k||c.kind===k)&&(!term||(c.topic+' '+c.front+' '+c.back).toLowerCase().includes(term)));document.getElementById('deckList').innerHTML=a.map(c=>'<div class="list-row"><div><strong>'+esc(c.topic)+'</strong><small>'+esc(c.subject)+' · '+esc(c.stage||'')+' · '+esc(c.front)+'</small></div><span class="score-pill">'+(isNew(c)?'new':isDue(c)?'due':state(c.id).mastered?'mature':Math.round(memoryHealth(c)*100)+'%')+'</span></div>').join('')}
function renderAll(){renderLevel();renderStats();renderChallengeHeader();renderStudy();renderWeak();renderProgress();renderBrowse()}

async function sync(manual=false){
 try{const [dr,er]=await Promise.all([fetch(DECK_URL+'?v='+Date.now(),{cache:'no-store'}),fetch(EXAM_URL+'?v='+Date.now(),{cache:'no-store'})]);if(!dr.ok||!er.ok)throw new Error();const d=await dr.json(),e=await er.json(),old=deckVersion;cards=(d.cards||[]).filter(c=>c.active!==false);examQuestions=e.questions||[];deckMeta=d.meta||{};deckVersion=d.deckVersion||0;bankVersion=e.bankVersion||0;initPhysicsUnits();updateTopicOptions();updateExamControls();document.getElementById('syncState').textContent='Deck v'+deckVersion+' · '+cards.length+' active cards · '+examQuestions.length+' verified AQA questions';if(manual)showToast(old&&deckVersion>old?'New content loaded':'Already up to date');renderAll()}catch{document.getElementById('syncState').textContent='Could not sync right now';if(manual)showToast('Sync failed')}
}
function switchPanel(id){document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.panel===id));document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id===id))}
ensureProfile();
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>switchPanel(b.dataset.panel));
document.querySelectorAll('.mode-btn').forEach(b=>b.onclick=()=>{activeSession=null;studyMode=b.dataset.mode;queueMode='normal';currentId=null;examIndex=0;subject='';document.querySelectorAll('[data-subject]').forEach(x=>x.classList.toggle('active',x.dataset.subject===''));renderAll()});
document.querySelectorAll('[data-subject]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-subject]').forEach(x=>x.classList.toggle('active',x===b));subject=b.dataset.subject;queueMode='normal';currentId=null;renderAll()});
document.getElementById('topicSubject').onchange=()=>{updateTopicOptions();currentId=null;renderAll()};document.getElementById('topicSelect').onchange=()=>{currentId=null;renderAll()};
document.getElementById('examSubject').onchange=()=>{updateExamControls();renderAll()};document.getElementById('examLevel').onchange=()=>{updateExamControls();renderAll()};document.getElementById('examTopic').onchange=()=>{examIndex=0;renderAll()};document.getElementById('examType').onchange=()=>{examIndex=0;renderAll()};
document.getElementById('weakQuick').onclick=()=>{queueMode='weak';currentId=null;renderAll()};document.getElementById('practicalQuick').onclick=()=>{queueMode='practical';currentId=null;renderAll()};document.getElementById('normalQueue').onclick=()=>{queueMode='normal';currentId=null;renderAll()};
document.getElementById('reviewWeakBtn').onclick=()=>{activeSession=null;studyMode='full';queueMode='weak';subject='';switchPanel('study');renderAll()};document.getElementById('redoMistakesBtn').onclick=startMistakeSession;
document.getElementById('startChallenge').onclick=startDailyChallenge;document.getElementById('challengeSubject').onchange=renderChallengeHeader;document.getElementById('challengeScope').onchange=renderChallengeHeader;
document.getElementById('resetPhysicsUnits').onclick=resetPhysicsUnits;
document.getElementById('search').oninput=renderBrowse;document.getElementById('subjectFilter').onchange=renderBrowse;document.getElementById('kindFilter').onchange=renderBrowse;document.getElementById('syncBtn').onclick=()=>sync(true);
sync();setInterval(()=>sync(false),5*60*1000);
