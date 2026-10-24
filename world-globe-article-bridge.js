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

  // City-specific long guides appear only inside the actual unlocked pin panel.
  // They must not be replaced with unrelated country highlights (e.g. Jodrell Bank under London).
  const CITY_GUIDES=Object.freeze({
    london:[
      {title:'From Londinium to a capital',body:'Roman London grew around a crossing of the Thames and the settlement of Londinium. The medieval city developed within and beyond the old walls, while Westminster became a separate centre of royal government. After the Great Fire of 1666, streets and buildings were rebuilt, and London expanded rapidly during the industrial period. Its history remains visible in the contrast between the City, Westminster and later neighbourhoods.'},
      {title:'The river and the changing city',body:'The Thames shaped London’s trade, food supply and transport. For centuries, ships carried goods through its docks and warehouses; container shipping later moved much of that activity downstream. Former docklands have become housing and office districts, although working river traffic continues. Bridges, railway terminals and Underground lines connect areas whose growth was once constrained by the river and its tributaries.'},
      {title:'Neighbourhoods, museums and culture',body:'London’s cultural life extends far beyond its famous landmarks. Markets, theatres, libraries, music venues and places of worship reflect generations of migration and local change. The British Museum, National Gallery and other major institutions sit alongside smaller community museums and arts organisations. The West End is known for theatre, while areas such as Southall, Brixton and Brick Lane have particularly distinctive cultural histories.'},
      {title:'Parks, planning and modern challenges',body:'Large parks, squares and riverside paths give London important green space within a dense urban region. The Green Belt has influenced where development takes place, while housing demand, air quality and public transport continue to shape planning decisions. Flood protection, including the Thames Barrier downstream, is another part of the city’s infrastructure. London’s story is therefore also about how an old city adapts to environmental and social pressures.'}
    ],
    busan:[
      {title:'A port between mountains and sea',body:'Busan sits on South Korea’s south-eastern coast, where mountains meet sheltered inlets and beaches. Its geography has shaped neighbourhoods, road and rail routes, and the concentration of port facilities along the waterfront. The city became a major gateway for international shipping and still has a close relationship with the sea, from container terminals and fishing markets to ferry connections and coastal recreation.'},
      {title:'History and the Korean War',body:'During the Korean War, Busan served as the temporary capital of South Korea and received large numbers of people displaced by fighting. Steep hillside settlements developed as residents sought places to live, leaving a distinctive pattern of narrow lanes and closely packed homes. Gamcheon Culture Village, now known for murals and tourism, is connected with this wider history of migration and adaptation, although it remains a residential neighbourhood.'},
      {title:'Districts, food and waterfront life',body:'Haeundae and Gwangalli are among Busan’s best-known beaches, with Gwangandaegyo Bridge forming a prominent part of the evening waterfront view. Jagalchi Market reflects the city’s long fishing and seafood trade, while Nampo-dong and Seomyeon offer different shopping and entertainment districts. Local food is shaped by coastal ingredients and the region’s culinary traditions, and the annual Busan International Film Festival brings attention to cinema from South Korea and elsewhere.'},
      {title:'Landscape and getting around',body:'The city’s hills and coastline provide varied viewpoints, but they also make routes less direct than a flat street map suggests. The metro, buses and regional railways connect major districts; walking routes and cable cars offer different ways to experience the coast. Temples and parks, including the coastal Haedong Yonggungsa temple and parts of Geumjeongsan, show that Busan combines dense urban areas with significant natural and cultural landscapes.'}
    ]
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
    if(!id||!((/^(?:country|sea|ocean)-[a-z-]+$/.test(id))||CITY_GUIDES[id])||target.classList.contains('hidden'))return;
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
    Promise.resolve(CITY_GUIDES[id]?{sections:CITY_GUIDES[id]}:readStory(id)).then(story=>{
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
