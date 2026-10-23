/* Read-only world article integration for unlocked globe details.
   Does not read or change user profiles, purchases, points, XP or payment logic.
   A country's gateway text is a researched feature, not necessarily about this exact city. */
(() => {
  'use strict';
  const LOCATION_COUNTRIES=Object.freeze({
  "london": "GB",
  "edinburgh": "GB",
  "tbilisi": "GE",
  "tokyo": "JP",
  "kyoto": "JP",
  "seoul": "KR",
  "busan": "KR",
  "gyeongju": "KR",
  "hongkong": "CN",
  "shanghai": "CN",
  "shenzhen": "CN",
  "beijing": "CN",
  "singapore": "SG",
  "manila": "PH",
  "bohol": "PH",
  "coron": "PH",
  "bali": "ID",
  "hanoi": "VN",
  "hochiminh": "VN",
  "bangkok": "TH",
  "kualalumpur": "MY",
  "almaty": "KZ",
  "bishkek": "KG",
  "samarkand": "UZ",
  "petra": "JO",
  "nairobi": "KE",
  "mombasa": "KE",
  "capetown": "ZA",
  "cape_town": "ZA",
  "stellenbosch": "ZA",
  "cusco": "PE",
  "machupicchu": "PE",
  "lima": "PE",
  "rio": "BR",
  "manaus": "BR",
  "newyork": "US",
  "chicago": "US",
  "washingtondc": "US",
  "sanfrancisco": "US",
  "losangeles": "US",
  "yellowstone": "US",
  "grandcanyon": "US",
  "anchorage": "US",
  "vancouver": "CA",
  "toronto": "CA",
  "montreal": "CA",
  "quebec": "CA",
  "banff": "CA",
  "reykjavik": "IS",
  "sydney": "AU",
  "melbourne": "AU",
  "canberra": "AU",
  "brisbane": "AU",
  "perth": "AU",
  "cairns": "AU",
  "adelaide": "AU",
  "hobart": "AU",
  "uluru": "AU",
  "greatbarrier": "AU",
  "whitsundays": "AU",
  "angkor": "KH",
  "dubai": "AE",
  "istanbul": "TR",
  "venice": "IT",
  "rome": "IT",
  "florence": "IT",
  "paris": "FR",
  "dublin": "IE",
  "barcelona": "ES",
  "granada": "ES",
  "seville": "ES",
  "valencia": "ES",
  "lisbon": "PT",
  "porto": "PT",
  "amsterdam": "NL",
  "prague": "CZ",
  "vienna": "AT",
  "salzburg": "AT",
  "athens": "GR",
  "zurich": "CH",
  "stockholm": "SE",
  "dubrovnik": "HR",
  "budapest": "HU",
  "marrakech": "MA",
  "fes": "MA",
  "chefchaouen": "MA",
  "casablanca": "MA",
  "essaouira": "MA",
  "cairo": "EG",
  "luxor": "EG",
  "alexandria": "EG",
  "aswan": "EG",
  "tunis": "TN",
  "sidi_bou_said": "TN",
  "dakar": "SN",
  "accra": "GH",
  "cape_coast": "GH",
  "lagos": "NG",
  "addis": "ET",
  "addis_ababa": "ET",
  "zanzibar": "TZ",
  "stone_town": "TZ",
  "arusha": "TZ",
  "victoriafalls": "ZW",
  "victoria_falls": "ZW",
  "sossusvlei": "NA",
  "windhoek": "NA",
  "swakopmund": "NA",
  "mahe": "SC",
  "antananarivo": "MG",
  "nosy_be": "MG",
  "portlouis": "MU",
  "mexicocity": "MX",
  "oaxaca": "MX",
  "chichenitza": "MX",
  "havana": "CU",
  "antiguaguatemala": "GT",
  "sanjosecr": "CR",
  "panamacity": "PA",
  "buenosaires": "AR",
  "iguazu": "AR",
  "peritomoreno": "AR",
  "santiago": "CL",
  "atacama": "CL",
  "torres": "CL",
  "easterisland": "CL",
  "valparaiso": "CL",
  "lapaz": "BO",
  "uyuni": "BO",
  "bogota": "CO",
  "cartagena": "CO",
  "medellin": "CO",
  "quito": "EC",
  "galapagos": "EC",
  "montevideo": "UY",
  "auckland": "NZ",
  "wellington": "NZ",
  "queenstown": "NZ",
  "rotorua": "NZ",
  "milfordsound": "NZ",
  "mount_cook": "NZ",
  "nadi": "FJ",
  "bergen": "NO",
  "ljubljana": "SI",
  "okavango": "BW",
  "kigali": "RW",
  "montegobay": "JM",
  "apia": "WS",
  "portvila": "VU",
  "sarajevo": "BA",
  "mostar": "BA",
  "kotor": "ME",
  "krakow": "PL",
  "tallinn": "EE",
  "riga": "LV",
  "vilnius": "LT",
  "kampala": "UG",
  "taipei": "TW",
  "borabora": "PF",
  "papeete": "PF",
  "copenhagen": "DK"
});
  const target=document.getElementById('globeLocationInfo');
  const worldArea=document.getElementById('locationShop');
  if(!target || !worldArea)return;
  const status=document.createElement('p');
  status.className='world-encyclopedia-access';
  const allLink=document.createElement('a');
  allLink.href='./world-library-preview.html';
  allLink.target='_blank';
  allLink.rel='noopener noreferrer';
  allLink.textContent='Browse the World Library — 196 countries, five oceans, 17 seas';
  status.append(allLink);
  worldArea.parentNode.insertBefore(status,worldArea);
  let indexJob=null;
  const loadIndex=()=>indexJob||(indexJob=fetch('./editorial/country_gateway_release_index_20261023.json',{cache:'force-cache'})
    .then(r=>{if(!r.ok)throw Error('Country index unavailable');return r.json()})
    .catch(e=>{indexJob=null;throw e}));
  const text=(tag,value)=>{const el=document.createElement(tag);el.textContent=String(value??'');return el};
  const verifiedFile=path=>/^editorial\\/full_country_stories_(?:batch\\d+_\\d+_\\d{8}|existing7_enriched_\\d{8})\\.json$/.test(path);
  let lastLocationId='',token=0;
  async function addArticle(container,iso,label){
    const current=++token;
    container.replaceChildren(text('p','Loading the researched country guide…'));
    try {
      const data=await loadIndex();
      const chosen=(data.entries||[]).find(e=>e.iso2===iso);
      if(!chosen||!verifiedFile(chosen.sourceFile))throw Error('No article for this geographic region');
      const res=await fetch('./'+chosen.sourceFile,{cache:'force-cache'});
      if(!res.ok)throw Error('Country story is not available offline');
      const pack=await res.json();
      const story=(pack.records||[]).find(e=>e.iso2===iso);
      if(!story)throw Error('Selected country story not found');
      if(current!==token||!container.isConnected)return;
      const section=document.createDocumentFragment();
      section.append(text('h4',story.country||label));
      section.append(text('p','Country feature: '+(story.focus||'geography and cultural heritage')+'. This is background about the country, not necessarily about the selected city.'));
      for(const part of story.sections||[]){
        section.append(text('h5',part.title));
        section.append(text('p',part.body));
      }
      if(!story.sections && story.article)section.append(text('p',story.article));
      if(story.quickFact){
        section.append(text('h5','Remember'));
        section.append(text('p',story.quickFact));
      }
      const sourceList=document.createElement('ul');
      for(const source of story.sources||[]){
        try{
          const url=new URL(source);
          if(url.protocol!=='https:')continue;
          const li=document.createElement('li'),a=text('a','Read original source');
          a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';
          li.append(a);sourceList.append(li);
        }catch{}
      }
      section.append(text('h5','Research sources'));
      section.append(sourceList);
      container.replaceChildren(section);
    } catch(err){
      if(current===token&&container.isConnected){
        container.replaceChildren(text('p','Guide unavailable here. The original unlocked location details remain available.'));
        const a=text('a','Open the World Library');
        a.href='./world-library-preview.html';a.target='_blank';a.rel='noopener noreferrer';
        container.append(a);
      }
    }
  }
  function detectLocationId(){
    try {
      // app.js uses a classic script; its top-level lexical binding is shared.
      if(typeof openLocationId==='string'&&LOCATION_COUNTRIES[openLocationId])return openLocationId;
    }catch{}
    const title=target.querySelector('.globe-info-top h3')?.textContent?.trim();
    try{
      if(typeof LOCATIONS!=='undefined')return LOCATIONS.find(x=>x.name===title)?.id||null;
    }catch{}
    return null;
  }
  function attach(){
    if(target.classList.contains('hidden')||!target.querySelector('.globe-info-top'))return;
    const id=detectLocationId(),existing=target.querySelector('[data-world-article-bridge]');
    if(!id||!LOCATION_COUNTRIES[id])return;
    if(existing?.dataset.locationId===id)return;
    if(existing)existing.remove();
    lastLocationId=id;
    ++token;
    const iso=LOCATION_COUNTRIES[id],host=document.createElement('section');
    host.className='world-guide-panel';
    host.dataset.worldArticleBridge='1';
    host.dataset.locationId=id;
    const heading=text('h4','Go deeper: country story');
    const intro=text('p','Read one researched country feature connected with this unlocked globe location. Your existing purchase and points are unchanged.');
    const link=text('a','Open the World Library');
    link.href='./world-library-preview.html?country='+encodeURIComponent(iso);
    link.target='_blank';link.rel='noopener noreferrer';
    const button=text('button','Read country story here');
    button.type='button';button.className='mini-btn';
    const content=document.createElement('div');content.className='world-guide-article';
    if(iso==='TW'||iso==='PF'){
      button.disabled=true;
      intro.textContent='This geographical area is not in the defined 196-country archive. The existing location still works normally; additional regional stories may be added later.';
    } else {
      button.addEventListener('click',()=>{button.disabled=true;button.textContent='Country story opened';addArticle(content,iso,id)});
    }
    host.append(heading,intro,button,link,content);
    target.append(host);
  }
  const observer=new MutationObserver(()=>{
    if(target.classList.contains('hidden')){++token;lastLocationId='';return}
    attach();
  });
  observer.observe(target,{childList:true,subtree:false,attributes:true,attributeFilter:['class']});
  attach();
  window.RevisionWorldArticleBridge=Object.freeze({countryForLocation:id=>LOCATION_COUNTRIES[id]||null,locationCount:Object.keys(LOCATION_COUNTRIES).length});
})();
