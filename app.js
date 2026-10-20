const DECK_URL = './deck.json';
const PROGRESS_KEY = 'revisionLoopProgress5';
const PROFILE_KEY = 'revisionLoopProfile7';
const SETTINGS_KEY = 'revisionLoopSettings7';
const GOOD_INTERVALS = [7,14,30,60,120,240];

let cards = [];
let deckVersion = 0;
let progress = safeLoad(PROGRESS_KEY,{});
let profile = safeLoad(PROFILE_KEY,{xp:0,reviews:0,masteryBonus:{},daily:{}});
let settings = safeLoad(SETTINGS_KEY,{dailyNew:18});
let activePanel = 'review';
let subject = '';
let mode = 'normal';
let currentId = null;
let lastEvaluation = null;
let toastTimer = null;

function safeLoad(key,fallback){try{const x=JSON.parse(localStorage.getItem(key));return x??fallback}catch{return fallback}}
function save(){localStorage.setItem(PROGRESS_KEY,JSON.stringify(progress));localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings))}
function now(){return Date.now()}
function dayKey(ts=Date.now()){return new Date(ts).toISOString().slice(0,10)}
function state(id){return progress[id]||{stage:-1,due:0,mastered:false,again:0,hard:0,good:0,last:0,firstSeen:''}}
function isDue(c){const s=state(c.id);return !s.mastered && s.stage>=0 && (s.due||0)<=now()}
function isNew(c){return state(c.id).stage<0 && !state(c.id).mastered}
function weaknessScore(c){const s=state(c.id);return (c.priority||1)*3+(s.again||0)*3+(s.hard||0)*2+(s.mastered?-8:0)-(s.good||0)*0.35}
function todayProfile(){const k=dayKey();if(!profile.daily[k])profile.daily[k]={reviews:0,newCards:0,xp:0};return profile.daily[k]}
function levelThreshold(level){return Math.round(75*(level-1)*level/2)}
function currentLevel(){let l=1;while(profile.xp>=levelThreshold(l+1))l++;return l}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function showToast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),1800)}

function reviewCandidates(){
  let base=cards.filter(c=>c.active!==false);
  if(subject)base=base.filter(c=>c.subject===subject);
  if(mode==='insurance')return base.filter(c=>c.kind==='insurance'&&(isDue(c)||isNew(c))).sort((a,b)=>weaknessScore(b)-weaknessScore(a));
  if(mode==='practical')return base.filter(c=>c.kind==='practical'&&(isDue(c)||isNew(c))).sort((a,b)=>weaknessScore(b)-weaknessScore(a));
  if(mode==='weak'){
    const w=base.filter(c=>c.kind==='weak'&&!state(c.id).mastered).sort((a,b)=>weaknessScore(b)-weaknessScore(a)).slice(0,20);
    const due=w.filter(isDue);return due.length?due:w;
  }

  base=base.filter(c=>c.scope!=='insurance');
  const learnedDue=base.filter(isDue).sort((a,b)=>weaknessScore(b)-weaknessScore(a)||(state(a.id).due-state(b.id).due));
  const daily=todayProfile();
  const newAllowance=Math.max(0,(settings.dailyNew||18)-daily.newCards);
  let fresh=base.filter(isNew).sort((a,b)=>{
    if((b.priority||1)!==(a.priority||1))return (b.priority||1)-(a.priority||1);
    if(a.kind==='weak'&&b.kind!=='weak')return -1;
    if(b.kind==='weak'&&a.kind!=='weak')return 1;
    return a.subject.localeCompare(b.subject);
  }).slice(0,newAllowance);

  const content=[...learnedDue,...fresh].filter(c=>c.scope==='mock');
  const practical=[...learnedDue,...fresh].filter(c=>c.scope==='secondary'||c.kind==='practical');
  const seen=new Set();const out=[];let i=0,j=0;
  while(i<content.length||j<practical.length){
    for(let n=0;n<5&&i<content.length;n++){const c=content[i++];if(!seen.has(c.id)){out.push(c);seen.add(c.id)}}
    if(j<practical.length){const c=practical[j++];if(!seen.has(c.id)){out.push(c);seen.add(c.id)}}
    if(i>=content.length&&j<practical.length){while(j<practical.length){const c=practical[j++];if(!seen.has(c.id)){out.push(c);seen.add(c.id)}}}
  }
  return out;
}

function canonical(text){
  let s=String(text||'').normalize('NFKD').toLowerCase();
  const repl=[
    [/θ/g,' theta '],[/λ/g,' lambda '],[/ρ/g,' rho '],[/δ/g,' delta '],[/Δ/g,' delta '],[/φ/g,' phi '],[/ε/g,' epsilon '],
    [/²/g,'^2'],[/³/g,'^3'],[/⁻/g,'-'],[/−/g,'-'],[/×/g,' x '],[/÷/g,' / '],[/≥/g,' >= '],[/≤/g,' <= '],
    [/\bcosine\b/g,'cos'],[/\bsine\b/g,'sin'],[/\btangent\b/g,'tan'],[/\bperp\b/g,'perpendicular'],
    [/\bdegrees?\b/g,''],[/\bapproximately\b/g,''],[/\babout\b/g,'']
  ];
  repl.forEach(x=>s=s.replace(x[0],x[1]));
  return s.replace(/[^a-z0-9+\-*/=<>^.[\] ]+/g,' ').replace(/\s+/g,' ').trim();
}
const STOP=new Set(['the','a','an','of','to','and','in','is','are','with','at','on','for','from','by','it','be','as','or','that','this']);
function tokens(s){return canonical(s).split(' ').filter(x=>x&&!STOP.has(x))}
function lev(a,b){const m=a.length,n=b.length;let prev=Array.from({length:n+1},(_,i)=>i),cur=new Array(n+1);for(let i=1;i<=m;i++){cur[0]=i;for(let j=1;j<=n;j++)cur[j]=Math.min(cur[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));[prev,cur]=[cur,prev]}return prev[n]}
function closeWord(a,b){if(a===b)return true;if(!a||!b)return false;const max=Math.max(a.length,b.length),d=lev(a,b);return (max>=8&&d<=2)||(max>=4&&d<=1)}
function phraseScore(input,phrase){
  const a=tokens(input),b=tokens(phrase);if(!b.length)return 0;
  let hits=0;for(const target of b){if(a.some(x=>closeWord(x,target)))hits++}
  return hits/b.length;
}
function compactEquation(s){return canonical(s).replace(/\s+/g,'').replace(/epsilon/g,'e').replace(/lambda/g,'l').replace(/theta/g,'t').replace(/delta/g,'d')}
function evaluate(card,input){
  const raw=String(input||'').trim();
  if(!raw)return {status:'neutral',score:null,text:'Answer revealed. Compare yours with the model answer, then rate yourself.'};

  let best=0;
  if(Array.isArray(card.accept)){
    for(const alt of card.accept){
      const a=compactEquation(raw),b=compactEquation(alt);
      if(a===b)best=1;else best=Math.max(best,phraseScore(raw,alt));
    }
  }
  if(Array.isArray(card.concepts)&&card.concepts.length){
    let hit=0;
    for(const group of card.concepts){
      const opts=Array.isArray(group)?group:[group];
      let groupBest=0;for(const opt of opts)groupBest=Math.max(groupBest,phraseScore(raw,opt));
      if(groupBest>=0.74)hit++;
    }
    best=Math.max(best,hit/card.concepts.length);
  }
  if(!card.accept&&!card.concepts){
    const model=tokens(card.back).filter(x=>x.length>3).slice(0,8);
    if(model.length){let hits=0;const ans=tokens(raw);model.forEach(t=>{if(ans.some(x=>closeWord(x,t)))hits++});best=hits/model.length}
  }

  if(best>=0.82)return {status:'correct',score:best,text:'Looks correct. Small spelling mistakes and equivalent wording are accepted.'};
  if(best>=0.5)return {status:'partial',score:best,text:'Mostly there. Check the model answer for the missing key idea.'};
  return {status:'wrong',score:best,text:'Not enough key ideas matched yet. Compare with the model answer, then rate it honestly.'};
}

function xpForRating(rating,wasMastered,isMastered){
  let xp={again:2,hard:5,good:10,easy:12}[rating]||0;
  if(lastEvaluation&&lastEvaluation.status==='correct')xp+=3;
  if(!wasMastered&&isMastered)xp+=25;
  return xp;
}
function rateCard(card,rating){
  const s=state(card.id),wasNew=s.stage<0,wasMastered=s.mastered;
  s.last=now();
  if(wasNew&&!s.firstSeen){s.firstSeen=dayKey();todayProfile().newCards++}
  if(rating==='again'){s.stage=Math.max(0,s.stage);s.due=now()+10*60*1000;s.mastered=false;s.again=(s.again||0)+1}
  else if(rating==='hard'){s.stage=Math.max(0,s.stage);s.due=now()+86400000;s.mastered=false;s.hard=(s.hard||0)+1}
  else{
    const jump=rating==='easy'?2:1;
    s.stage=s.stage<0?jump-1:s.stage+jump;s.good=(s.good||0)+1;
    if(s.stage>=GOOD_INTERVALS.length){s.mastered=true;s.due=0}
    else{s.mastered=false;s.due=now()+GOOD_INTERVALS[s.stage]*86400000}
  }
  progress[card.id]=s;
  const gained=xpForRating(rating,wasMastered,s.mastered);
  profile.xp=(profile.xp||0)+gained;profile.reviews=(profile.reviews||0)+1;todayProfile().reviews++;todayProfile().xp+=gained;
  save();showToast('+'+gained+' XP');currentId=null;lastEvaluation=null;renderAll();
}

function diagram(type){
  const start='<svg viewBox="0 0 360 170" width="360" height="170" role="img" aria-hidden="true">';
  if(type==='resolve')return start+'<line x1="55" y1="135" x2="275" y2="50" stroke="#2563eb" stroke-width="5"/><line x1="55" y1="135" x2="275" y2="135" stroke="#94a3b8" stroke-width="3"/><line x1="275" y1="135" x2="275" y2="50" stroke="#94a3b8" stroke-width="3"/><text x="112" y="119" font-size="17">θ</text><text x="145" y="158" font-size="14">adjacent → cos</text><text x="280" y="96" font-size="14">opposite → sin</text></svg>';
  if(type==='slope')return start+'<polygon points="40,145 310,145 310,55" fill="#e2e8f0"/><rect x="185" y="79" width="56" height="34" rx="5" transform="rotate(-18 213 96)" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><line x1="213" y1="96" x2="213" y2="154" stroke="#0f172a" stroke-width="3"/><text x="220" y="151" font-size="14">mg</text><line x1="213" y1="96" x2="155" y2="115" stroke="#b45309" stroke-width="4"/><text x="75" y="112" font-size="13">mg sin θ</text><line x1="213" y1="96" x2="233" y2="42" stroke="#15803d" stroke-width="4"/><text x="239" y="43" font-size="14">R</text><text x="241" y="124" font-size="13">mg cos θ</text></svg>';
  if(type==='couple')return start+'<rect x="78" y="66" width="204" height="44" rx="8" fill="#f1f5f9" stroke="#64748b"/><line x1="112" y1="140" x2="112" y2="38" stroke="#2563eb" stroke-width="5"/><line x1="248" y1="35" x2="248" y2="138" stroke="#2563eb" stroke-width="5"/><line x1="112" y1="22" x2="248" y2="22" stroke="#0f172a"/><text x="177" y="16" font-size="15">d</text><text x="127" y="94" font-size="16">moment = Fd</text></svg>';
  if(type==='displacement-time')return start+'<line x1="48" y1="140" x2="320" y2="140" stroke="#0f172a" stroke-width="2"/><line x1="48" y1="140" x2="48" y2="24" stroke="#0f172a" stroke-width="2"/><path d="M55 128 C105 123 130 102 165 76 S238 42 308 36" fill="none" stroke="#2563eb" stroke-width="5"/><line x1="150" y1="94" x2="235" y2="48" stroke="#b45309" stroke-width="2" stroke-dasharray="6 5"/><text x="118" y="158" font-size="13">gradient = velocity</text></svg>';
  if(type==='velocity-time')return start+'<line x1="48" y1="88" x2="320" y2="88" stroke="#0f172a" stroke-width="2"/><line x1="48" y1="145" x2="48" y2="24" stroke="#0f172a" stroke-width="2"/><path d="M55 128 L135 42 L220 42 L308 108" fill="none" stroke="#2563eb" stroke-width="5"/><path d="M55 88 L55 128 L135 42 L220 42 L281 88 Z" fill="#dbeafe"/><text x="95" y="160" font-size="13">gradient = a • area = displacement</text></svg>';
  if(type==='acceleration-time')return start+'<line x1="48" y1="92" x2="320" y2="92" stroke="#0f172a" stroke-width="2"/><line x1="48" y1="145" x2="48" y2="24" stroke="#0f172a" stroke-width="2"/><path d="M55 50 L145 50 L145 123 L230 123 L230 68 L308 68" fill="none" stroke="#2563eb" stroke-width="5"/><text x="128" y="158" font-size="13">signed area = Δv</text></svg>';
  if(type==='projectile')return start+'<path d="M48 130 Q178 18 315 130" fill="none" stroke="#2563eb" stroke-width="5"/><line x1="48" y1="130" x2="310" y2="130" stroke="#94a3b8" stroke-width="2"/><line x1="48" y1="130" x2="48" y2="58" stroke="#15803d" stroke-width="3"/><line x1="48" y1="130" x2="120" y2="130" stroke="#b45309" stroke-width="3"/><text x="56" y="71" font-size="13">vertical: a = −g</text><text x="122" y="146" font-size="13">horizontal: constant v</text></svg>';
  if(type==='moment')return start+'<line x1="48" y1="105" x2="318" y2="105" stroke="#64748b" stroke-width="7"/><polygon points="175,105 160,135 190,135" fill="#0f172a"/><line x1="270" y1="36" x2="270" y2="105" stroke="#2563eb" stroke-width="5"/><line x1="175" y1="45" x2="270" y2="45" stroke="#b45309" stroke-width="2" stroke-dasharray="5 4"/><text x="207" y="38" font-size="14">d⊥</text><text x="256" y="28" font-size="14">F</text></svg>';
  if(type==='internal-resistance')return start+'<line x1="48" y1="132" x2="320" y2="132" stroke="#0f172a" stroke-width="2"/><line x1="48" y1="145" x2="48" y2="25" stroke="#0f172a" stroke-width="2"/><line x1="67" y1="43" x2="300" y2="121" stroke="#2563eb" stroke-width="5"/><text x="75" y="35" font-size="14">intercept = ε</text><text x="155" y="90" font-size="14">gradient = −r</text></svg>';
  if(type==='photoelectric')return start+'<rect x="176" y="86" width="125" height="38" rx="5" fill="#94a3b8"/><line x1="67" y1="45" x2="177" y2="95" stroke="#f59e0b" stroke-width="5"/><circle cx="201" cy="102" r="7" fill="#2563eb"/><path d="M205 98 Q238 62 281 48" fill="none" stroke="#2563eb" stroke-width="4"/><text x="50" y="35" font-size="14">photon E = hf</text><text x="222" y="42" font-size="14">electron escapes if hf ≥ φ</text></svg>';
  if(type==='stationary')return start+'<line x1="40" y1="90" x2="320" y2="90" stroke="#64748b" stroke-width="2"/><path d="M45 90 Q80 32 115 90 T185 90 T255 90 T315 90" fill="none" stroke="#2563eb" stroke-width="5"/><circle cx="45" cy="90" r="4"/><circle cx="115" cy="90" r="4"/><circle cx="185" cy="90" r="4"/><circle cx="255" cy="90" r="4"/><circle cx="315" cy="90" r="4"/><text x="130" y="150" font-size="14">node spacing = λ/2</text></svg>';
  if(type==='young')return start+'<line x1="55" y1="46" x2="305" y2="46" stroke="#0f172a" stroke-width="4"/><line x1="82" y1="46" x2="82" y2="144" stroke="#2563eb" stroke-width="3"/><line x1="278" y1="46" x2="278" y2="144" stroke="#2563eb" stroke-width="3"/><circle cx="278" cy="145" r="12" fill="#64748b"/><text x="114" y="95" font-size="14">measure L, ΔL, d</text><text x="112" y="121" font-size="14">E = FL/(AΔL)</text></svg>';
  if(type==='divider')return start+'<line x1="75" y1="34" x2="75" y2="138" stroke="#0f172a" stroke-width="3"/><rect x="66" y="54" width="18" height="34" fill="#dbeafe" stroke="#2563eb"/><rect x="66" y="101" width="18" height="34" fill="#dbeafe" stroke="#2563eb"/><line x1="75" y1="95" x2="245" y2="95" stroke="#b45309" stroke-width="3"/><text x="93" y="74" font-size="14">R₁</text><text x="93" y="124" font-size="14">R₂</text><text x="186" y="85" font-size="14">Vout</text></svg>';
  if(type==='back-titration')return start+'<rect x="80" y="39" width="34" height="95" fill="#dbeafe" stroke="#2563eb"/><path d="M190 138 L270 138 L252 96 L208 96 Z" fill="#fef3c7" stroke="#64748b"/><line x1="97" y1="134" x2="97" y2="153" stroke="#2563eb" stroke-width="3"/><text x="132" y="61" font-size="14">measure leftover excess</text><text x="118" y="159" font-size="13">initial − leftover = reacted</text></svg>';
  if(type==='arrhenius')return start+'<line x1="52" y1="138" x2="318" y2="138" stroke="#0f172a" stroke-width="2"/><line x1="52" y1="138" x2="52" y2="25" stroke="#0f172a" stroke-width="2"/><line x1="72" y1="48" x2="296" y2="126" stroke="#2563eb" stroke-width="5"/><text x="98" y="52" font-size="14">gradient = −Ea/R</text><text x="25" y="25" font-size="13">ln k</text><text x="292" y="157" font-size="13">1/T</text></svg>';
  if(type==='transform-right')return start+'<line x1="40" y1="138" x2="320" y2="138" stroke="#0f172a"/><line x1="92" y1="150" x2="92" y2="25" stroke="#0f172a"/><path d="M66 127 Q92 45 118 127" fill="none" stroke="#94a3b8" stroke-width="4"/><path d="M168 127 Q194 45 220 127" fill="none" stroke="#2563eb" stroke-width="4"/><text x="130" y="77" font-size="14">shift right by a</text></svg>';
  return '';
}

function renderLevel(){
  const l=currentLevel(),low=levelThreshold(l),high=levelThreshold(l+1),span=Math.max(1,high-low),pct=Math.max(0,Math.min(100,(profile.xp-low)/span*100));
  document.getElementById('levelNum').textContent=l;document.getElementById('xpTotal').textContent=(profile.xp||0)+' XP';document.getElementById('xpNext').textContent=(high-profile.xp)+' XP to level '+(l+1);document.getElementById('xpBar').style.width=pct+'%';
}
function renderStats(){
  const q=reviewCandidates(),daily=todayProfile();
  document.getElementById('dueCount').textContent=q.filter(c=>state(c.id).stage>=0).length;
  document.getElementById('newCount').textContent=daily.newCards+'/'+settings.dailyNew;
  document.getElementById('reviewedCount').textContent=daily.reviews;
  document.getElementById('masteredCount').textContent=cards.filter(c=>state(c.id).mastered).length;
}
function revealAndCheck(card,check){
  const input=document.getElementById('answerInput').value;
  lastEvaluation=check?evaluate(card,input):{status:'neutral',score:null,text:'Model answer shown. Compare it with your answer, then rate yourself.'};
  const fb=document.getElementById('feedback');fb.className='feedback show '+lastEvaluation.status;fb.textContent=lastEvaluation.text;
  document.getElementById('modelAnswer').classList.add('show');document.getElementById('ratings').classList.add('show');document.getElementById('checkBtn').disabled=true;document.getElementById('showBtn').disabled=true;
}
function renderReview(){
  const host=document.getElementById('reviewHost'),q=reviewCandidates();
  document.getElementById('normalQueue').classList.toggle('hidden',mode==='normal');
  if(!q.length){
    const daily=todayProfile(),newLeft=Math.max(0,settings.dailyNew-daily.newCards);
    host.innerHTML='<div class="empty-card"><h3>You’re caught up</h3><p>'+(newLeft?'No reviews are due in this queue right now.':'You have also reached today’s new-card limit.')+'</p><button id="moreNew" class="primary-small">Add 10 new cards today</button></div>';
    document.getElementById('moreNew').onclick=()=>{settings.dailyNew+=10;save();renderAll()};
    return;
  }
  const card=q.find(c=>c.id===currentId)||q[0];currentId=card.id;lastEvaluation=null;
  const s=state(card.id),misses=(s.again||0)+(s.hard||0),kindClass=card.kind==='practical'?' practical':card.kind==='insurance'?' insurance':'';
  const diag=card.visual?diagram(card.visual):'';
  host.innerHTML='<article class="review-card"><div class="card-meta"><div class="meta-left"><span class="badge">'+esc(card.subject)+' · '+esc(card.topic)+'</span><span class="badge'+kindClass+'">'+esc(card.kind==='content'?'mock content':card.kind)+'</span>'+(misses>=4?'<span class="badge reteach">Needs reteach</span>':'')+'</div><span class="queue-pos">1 / '+q.length+'</span></div><div class="card-body">'+(diag?'<div class="diagram">'+diag+'</div>':'')+'<div class="question">'+esc(card.front)+'</div><textarea id="answerInput" class="answer-input" placeholder="Type your answer from memory…"></textarea><div class="answer-actions"><button id="checkBtn" class="check-btn">Check answer</button><button id="showBtn" class="show-btn">Just reveal</button></div><div id="feedback" class="feedback"></div><div id="modelAnswer" class="model-answer"><b>Model answer:</b> '+esc(card.back)+'</div><div id="ratings" class="ratings"><button class="rating again" data-rating="again">Again<small>10 min · +2 XP</small></button><button class="rating hard" data-rating="hard">Hard<small>1 day · +5 XP</small></button><button class="rating good" data-rating="good">Good<small>+10 XP</small></button><button class="rating easy" data-rating="easy">Easy<small>+12 XP</small></button></div></div></article>';
  document.getElementById('checkBtn').onclick=()=>revealAndCheck(card,true);
  document.getElementById('showBtn').onclick=()=>revealAndCheck(card,false);
  document.getElementById('answerInput').addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter')revealAndCheck(card,true)});
  document.querySelectorAll('[data-rating]').forEach(b=>b.onclick=()=>rateCard(card,b.dataset.rating));
}
function renderWeak(){
  const list=cards.filter(c=>c.kind==='weak'&&!state(c.id).mastered).sort((a,b)=>weaknessScore(b)-weaknessScore(a));
  document.getElementById('weakList').innerHTML=list.map(c=>{const s=state(c.id),miss=(s.again||0)+(s.hard||0);return '<div class="list-row"><div><strong>'+esc(c.topic)+'</strong><small>'+esc(c.subject)+' · '+esc(c.front)+'</small></div><span class="score-pill">'+(miss>=4?'RETEACH · ':'')+Math.round(weaknessScore(c))+'</span></div>'}).join('')||'<div class="empty-card">No active weaknesses.</div>';
}
function renderProgress(){
  const host=document.getElementById('subjectProgress');
  host.innerHTML=['Physics','Chemistry','Maths'].map(sub=>{const all=cards.filter(c=>c.subject===sub&&c.scope!=='insurance'),studied=all.filter(c=>state(c.id).stage>=0||state(c.id).mastered).length,mastered=all.filter(c=>state(c.id).mastered).length,pct=all.length?mastered/all.length*100:0;return '<div class="progress-card"><div class="subject-progress-head"><span>'+sub+'</span><span>'+mastered+' mastered / '+all.length+'</span></div><div class="bar-track"><div class="bar-fill" style="width:'+pct+'%"></div></div><div class="progress-note">'+studied+' cards started</div></div>'}).join('');
}
function renderBrowse(){
  const term=document.getElementById('search').value.toLowerCase().trim(),sub=document.getElementById('subjectFilter').value,kind=document.getElementById('kindFilter').value;
  const filtered=cards.filter(c=>(!sub||c.subject===sub)&&(!kind||c.kind===kind)&&(!term||(c.topic+' '+c.front+' '+c.back).toLowerCase().includes(term)));
  document.getElementById('deckList').innerHTML=filtered.map(c=>'<div class="list-row"><div><strong>'+esc(c.topic)+'</strong><small>'+esc(c.subject)+' · '+esc(c.front)+'</small></div><span class="score-pill">'+(state(c.id).mastered?'mastered':isNew(c)?'new':isDue(c)?'due':'later')+'</span></div>').join('')||'<div class="empty-card">No matching cards.</div>';
}
function renderAll(){renderLevel();renderStats();renderReview();renderWeak();renderProgress();renderBrowse()}

async function sync(manual=false){
  try{
    const r=await fetch(DECK_URL+'?v='+Date.now(),{cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status);
    const d=await r.json(),old=deckVersion;cards=(d.cards||[]).filter(c=>c.active!==false);deckVersion=d.deckVersion||0;
    document.getElementById('syncState').textContent='Live deck v'+deckVersion+' · '+cards.length+' cards';
    if(manual)showToast(old&&deckVersion>old?'New cards loaded':'Already up to date');
    else if(old&&deckVersion>old)showToast('Revision deck updated automatically');
    renderAll();
  }catch(e){document.getElementById('syncState').textContent='Offline — using the last loaded version if available';if(manual)showToast('Could not sync right now')}
}
function switchPanel(id){
  activePanel=id;document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.panel===id));document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id===id));
}
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>switchPanel(b.dataset.panel));
document.querySelectorAll('[data-subject]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-subject]').forEach(x=>x.classList.remove('active'));b.classList.add('active');subject=b.dataset.subject;mode='normal';currentId=null;renderAll()});
document.getElementById('weakQuick').onclick=()=>{mode='weak';currentId=null;renderAll()};
document.getElementById('practicalQuick').onclick=()=>{mode='practical';currentId=null;renderAll()};
document.getElementById('insuranceQuick').onclick=()=>{mode='insurance';subject='Physics';currentId=null;renderAll()};
document.getElementById('normalQueue').onclick=()=>{mode='normal';subject='';document.querySelectorAll('[data-subject]').forEach(x=>x.classList.toggle('active',x.dataset.subject===''));currentId=null;renderAll()};
document.getElementById('reviewWeakBtn').onclick=()=>{switchPanel('review');mode='weak';subject='';currentId=null;renderAll()};
document.getElementById('search').oninput=renderBrowse;document.getElementById('subjectFilter').onchange=renderBrowse;document.getElementById('kindFilter').onchange=renderBrowse;
document.getElementById('syncBtn').onclick=()=>sync(true);
sync(false);setInterval(()=>sync(false),5*60*1000);
