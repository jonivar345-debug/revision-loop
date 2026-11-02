'use strict';
/* AQA school-mock factual/marker triage: read-only, never certifies spec completeness. */
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),core=j('deck.json');
const urls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
const banks=urls.map(j),provenance=new Map(core.cards.map(c=>[c.id,'deck.json']));
for(const [i,bank] of banks.entries())for(const c of bank.cards||[])if(!provenance.has(c.id))provenance.set(c.id,urls[i]);
const loaderStart=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));');
const loaderEnd=app.indexOf(' const added=[',loaderStart);
assert(loaderStart>0&&loaderEnd>loaderStart);
// The site patches individually reviewed historical core metadata before it loads
// supplementary banks. Audit those same runtime cards, not the unpatched deck file.
const patchStart=app.indexOf('const V287_LEGACY_SPEC_GROUPS=');
const patchEnd=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards in memory.',patchStart);
assert(patchStart>0&&patchEnd>patchStart);
const patchCore=new Function(app.slice(patchStart,patchEnd)+
 '\nreturn function(existing){applyV287LegacySpecRefs(existing);applyV288LegacyChemBondingSpecRefs(existing);applyV289LegacyEnergeticsSpecRefs(existing);applyV290LegacyElectricitySpecRefs(existing);return applyV314CoreMockQuality(existing);};')();
const correctedCore=patchCore([...core.cards]);
const cards=new Function('cards','extraFlashBanks',app.slice(loaderStart,loaderEnd)+'\nreturn cards;')(correctedCore,banks);
const selStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),selEnd=app.indexOf('function startMockSession(){',selStart);
const selected=new Function(app.slice(selStart,selEnd)+'\nreturn mockEligibleCard;')();
const selectedCards=cards.filter(selected),bySub=Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,selectedCards.filter(c=>c.subject===s)]));
const mkStart=app.indexOf('function normalise('),mkEnd=app.indexOf('function importantTokens(',mkStart);
const mark=new Function('window',app.slice(mkStart,mkEnd)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
assert.equal(cards.length,4344);
assert.deepEqual(Object.fromEntries(Object.entries(bySub).map(([s,v])=>[s,v.length])),{Physics:1125,Chemistry:1916,Maths:331});
const types={Physics:[['3.1','Measurement / errors'],['3.2','Particles / radiation'],['3.3','Waves'],['3.4','Mechanics / materials'],['3.5','Electricity']],Chemistry:[['3.1','Physical'],['3.2','Inorganic'],['3.3','Organic']],Maths:[['3.1','Overarching themes'],['3.2','Proof'],['3.3','Algebra / functions'],['3.4','Coordinate geometry'],['3.5','Sequences / series'],['3.6','Trigonometry'],['3.7','Exponentials / logs'],['3.8','Differentiation'],['3.9','Integration'],['3.11','Vectors']]};
const report={version:'v314',scope:'Actual loaded, school-mock eligible flashcards only, with real website answer marker; candidates NOT an exhaustive editorial review',loaded:cards.length,eligible:selectedCards.length,subjects:{},total:{},examples:{}};
const issues={modelNotCorrect:[],acceptedNotCorrect:[],rejectedCorrect:[],sameFrontSameBack:[],sameFrontDifferentBack:[],longFront:[],longBack:[],missingExactSpecRef:[],noAccept:[],noReject:[],multiQuestion:[],clozeMissingParts:[],blanksWithoutCloze:[]};
const frontMap=new Map(),quant={checks:0,accepted:0,rejected:0,models:0},counts={};
const add=(name,c,extra={})=>{issues[name].push({id:c.id,subject:c.subject,bank:provenance.get(c.id),front:String(c.front||'').slice(0,160),...extra})};
for(const c of selectedCards){
 const sub=c.subject,ref=String(c.specRef||'').trim(),text=String(c.front||''),back=String(c.back||'');
 if(!counts[sub])counts[sub]={spec:{},top:{},unknown:0};
 counts[sub].spec[ref||'(missing)']=(counts[sub].spec[ref||'(missing)']||0)+1;
 const matching=types[sub].find(([code])=>ref===code||ref.startsWith(code+'.'));
 if(matching)counts[sub].top[matching[1]]=(counts[sub].top[matching[1]]||0)+1;
 else if(sub==='Maths'&&/^AQA 7356 [A-HJ]$/.test(ref))counts[sub].top['AS 7356 topic cross-reference']=(counts[sub].top['AS 7356 topic cross-reference']||0)+1;
 else if(!(sub==='Maths'&&/^AQA 7356 [A-HJ]$/.test(ref)))counts[sub].unknown++;
 if(!ref||(!matching&&!(sub==='Maths'&&/^AQA 7356 [A-HJ]$/.test(ref))))add('missingExactSpecRef',c,{specRef:ref,reason:'missing or not a directly recognised subsection'}); // historic broad refs also logged
 if(text.length>125)add('longFront',c,{length:text.length});
 if(back.length>180)add('longBack',c,{length:back.length});
 const questionCount=(text.match(/\?/g)||[]).length;
 if(questionCount>1)add('multiQuestion',c,{count:questionCount});
 if(!Array.isArray(c.accept)||c.accept.length===0)add('noAccept',c);
 if(!Array.isArray(c.reject)||c.reject.length===0)add('noReject',c);
 if(c.method==='fill gaps'&&!Array.isArray(c.clozeParts))add('clozeMissingParts',c);
 if(/[_{]{3,}|\.{4,}/.test(text)&&!c.clozeParts)add('blanksWithoutCloze',c);
 const key=sub+'|'+text.trim().toLowerCase().replace(/\s+/g,' ').replace(/[.?]+$/,'');
 if(frontMap.has(key)){const prior=frontMap.get(key);add(back.trim().toLowerCase()===String(prior.back||'').trim().toLowerCase()?'sameFrontSameBack':'sameFrontDifferentBack',c,{previous:prior.id,previousBank:provenance.get(prior.id),oldBack:String(prior.back||'').slice(0,110),newBack:back.slice(0,110)});}
 else frontMap.set(key,c);
 const m=mark(c,back);quant.models++;quant.checks++;if(m.status!=='correct')add('modelNotCorrect',c,{result:m.status,back:back.slice(0,130)});
 for(const a of c.accept||[]){quant.accepted++;quant.checks++;const m=mark(c,a);if(m.status!=='correct')add('acceptedNotCorrect',c,{answer:a.slice(0,130),result:m.status});}
 for(const a of c.reject||[]){quant.rejected++;quant.checks++;const m=mark(c,a);if(m.status==='correct')add('rejectedCorrect',c,{answer:a.slice(0,130),result:m.status});}
}
for(const [name,cards] of Object.entries(bySub))report.subjects[name]={eligible:cards.length,top:counts[name].top,unmatchedSpecPrefix:counts[name].unknown,refCounts:Object.entries(counts[name].spec).sort((a,b)=>b[1]-a[1]).slice(0,28)};
for(const [kind,items] of Object.entries(issues)){report.total[kind]=items.length;report.examples[kind]=items.slice(0,kind==='sameFrontDifferentBack'?40:25);}
report.markerChecks=quant;
report.mathsNumericalMethodsReview=bySub.Maths.filter(c=>String(c.specRef||'')==='3.10').map(c=>({id:c.id,front:c.front,back:c.back,topic:c.topic,stage:c.stage,bank:provenance.get(c.id)}));
report.mathsASReferenceReview=bySub.Maths.filter(c=>String(c.specRef||'').startsWith('AQA 7356')).map(c=>({id:c.id,front:c.front,specRef:c.specRef}));
console.log('V314_MOCK_FULL_DECK_TRIAGE_BEGIN');
console.log(JSON.stringify(report,null,2));
console.log('V314_MOCK_FULL_DECK_TRIAGE_END');
// Definite loader, scope and stored-marker regressions. Editorial candidates are
// emitted for review, not auto-deleted or automatically declared defects.
assert.equal(selectedCards.length,3372);
const vectors=selectedCards.filter(c=>c.subject==='Maths'&&
 (['task1_v162_023','task1_v171_003','task1_v171_004','task1_v171_005'].includes(c.id)||
  c.id.startsWith('task1_v187_maths_')||['task1_v227_math_04','task1_v227_math_05','task1_v227_math_06'].includes(c.id)));
assert.equal(vectors.length,16,'All sixteen historical vector cards still reach the Year 1 Pure mock');
assert(vectors.every(c=>c.specRef==='3.11'&&c.topic==='Vectors'),'All mislabelled vector cards must now use AQA 3.11');
assert.equal(selectedCards.filter(c=>c.subject==='Maths'&&c.specRef==='3.10').length,0,'Do not present numerical-methods metadata as vectors');
for(const id of ['phy_mechanics_focus_v37_18','phy_mechanics_weakness_v35_couple_distance','chem_bonding_v52_32']){
 const c=selectedCards.find(c=>c.id===id);
 assert(c&&c.front.length<=125&&(c.front.match(/\?/g)||[]).length===1,'One concise request per verified card: '+id);
}

assert.equal(quant.models,3372);
const vetted=new Set(['phy_vectors_001','phy_slope_001','phy_motion_a','phy_moments_001',
 'phy_internal_001','phy_photoelectric_002','chem_gas_001','chem_empirical_001']);
for(const id of vetted){
 const c=selectedCards.find(c=>c.id===id);
 assert(c&&Array.isArray(c.accept)&&c.accept.length>=3,'Vetted accepted answers loaded '+id);
 assert(Array.isArray(c.reject)&&c.reject.length>=2,'Vetted wrong examples loaded '+id);
 for(const x of c.accept)assert.equal(mark(c,x).status,'correct',id+' accepted '+x);
 for(const x of c.reject)assert.equal(mark(c,x).status,'wrong',id+' rejected '+x);
}
assert.equal(mark(selectedCards.find(c=>c.id==='phy_internal_001'),'V = ε + Ir').status,'wrong',
 'Do not credit emf PLUS lost volts');
assert.equal(mark(selectedCards.find(c=>c.id==='phy_vectors_001'),'adjacent = F sin θ and opposite = F cos θ').status,'wrong',
 'Do not credit swapped vector components');
assert.equal(mark(selectedCards.find(c=>c.id==='phy_motion_a'),'Δv').status,'correct',
 'Correct delta-v should not receive partial credit');

assert.equal(issues.modelNotCorrect.length,0,'Every selected model answer must mark correct');
assert.equal(issues.acceptedNotCorrect.length,0,'Every selected explicit accept must mark correct');
assert.equal(issues.rejectedCorrect.length,0,'No selected explicit reject may mark correct');
console.log('PASS v314: checked '+quant.checks+' actual-marker responses across '+selectedCards.length+' school-mock flashcards; potential metadata, wording and duplicates require individual review, not auto-certification.');
