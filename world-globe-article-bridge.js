/* Single-panel unlocked destination stories. No store links or duplicate country articles
   beneath city guides. This module never reads or writes profile data. */
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
  if(!target)return;
  let version=0;
  let indexPromise=null;
  const node=(tag,value)=>{const el=document.createElement(tag);el.textContent=String(value??'');return el};
  const countryIndex=()=>indexPromise||(indexPromise=fetch('./editorial/country_gateway_release_index_20261023.json')
   .then(r=>{if(!r.ok)throw Error('Country archive unavailable');return r.json()})
   .catch(err=>{indexPromise=null;throw err}));
  function activeId(){
    try{return typeof openLocationId==='string'?openLocationId:null}catch{return null}
  }
  function validFile(name){
    return typeof name==='string' && /^editorial\/full_country_stories_(?:batch\d+_\d+_\d{8}|existing7_enriched_\d{8})\.json$/.test(name);
  }
  async function readStory(id){
    if(id.startsWith('country-')){
      const iso=id.slice(8).toUpperCase();
      const index=await countryIndex();
      const row=(index.entries||[]).find(entry=>entry.iso2===iso);
      if(!row||!validFile(row.sourceFile))throw Error('Country entry unavailable');
      const response=await fetch('./'+row.sourceFile);
      if(!response.ok)throw Error('Country article unavailable');
      return (await response.json()).records.find(entry=>entry.iso2===iso);
    }
    const paths=id.startsWith('ocean-')?['editorial/ocean_stories_5_20261023.json']:
      ['editorial/sea_stories_batch1_9_20261023.json','editorial/sea_stories_batch2_8_20261023.json'];
    for(const path of paths){
      const res=await fetch('./'+path);
      if(!res.ok)continue;
      const record=(await res.json()).records.find(entry=>entry.id===id);
      if(record)return record;
    }
    return null;
  }
  function attach(){
    const id=activeId();
    if(!id||!(/^(?:country|sea|ocean)-[a-z-]+$/.test(id))||target.classList.contains('hidden'))return;
    const intro=target.querySelector('[data-world-long-story]');
    if(intro?.dataset.locationId===id)return;
    if(intro)intro.remove();
    const thisVersion=++version;
    const section=document.createElement('section');
    section.className='location-full-story';
    section.dataset.worldLongStory='true';
    section.dataset.locationId=id;
    section.append(node('p','Loading location information…'));
    target.append(section);
    readStory(id).then(story=>{
      if(version!==thisVersion||!section.isConnected||activeId()!==id)return;
      if(!story)throw Error('No entry for this location');
      const parts=document.createDocumentFragment();
      for(const block of story.sections||[]){
        const group=document.createElement('div');group.className='location-background';
        group.append(node('h4',block.title),node('p',block.body));parts.append(group);
      }
      if(!story.sections&&story.article){
        const group=document.createElement('div');group.className='location-background';
        group.append(node('h4','About this place'),node('p',story.article));parts.append(group);
      }
      section.replaceChildren(parts);
    }).catch(()=>{
      if(version===thisVersion&&section.isConnected)section.replaceChildren(node('p','Location information is temporarily unavailable.'));
    });
  }
  const observer=new MutationObserver(()=>{
    if(target.classList.contains('hidden')){version++;return}
    attach();
  });
  observer.observe(target,{childList:true,attributes:true,attributeFilter:['class']});
  attach();
  window.RevisionWorldArticleBridge=Object.freeze({
    countryForLocation:id=>id?.startsWith('country-')?id.slice(8).toUpperCase():LOCATION_COUNTRIES[id]||null,
    historicalLocationCount:Object.keys(LOCATION_COUNTRIES).length,
    locationCount:Object.keys(LOCATION_COUNTRIES).length+218
  });
})();
