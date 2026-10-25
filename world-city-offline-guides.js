/* Offline-written destination guides: no Wikipedia fetch is required for listed places. */
(function(root){'use strict';const data={
  "prague": {
    "overview": "Prague lies on the Vltava River and is the capital of Czechia. Its Old Town, bridges, hilltop castle complex and winding streets preserve layers of medieval and later architecture.",
    "culture": "The historic centre includes Charles Bridge, Old Town Square and the Astronomical Clock. Prague became an important cultural centre under the Holy Roman Empire and is known for its Gothic and Baroque buildings.",
    "fact": "Prague Castle forms a prominent landmark above the Vltava and overlooks the city centre."
  },
  "lisbon": {
    "overview": "Lisbon occupies steep hills around the Tagus estuary on Portugal's Atlantic coast. Its viewpoints, tiled buildings, waterfront squares and trams connect neighbourhoods with very different characters.",
    "culture": "Belém is associated with Portugal's maritime history, while Alfama retains a network of narrow streets. The city was extensively rebuilt after the destructive 1755 earthquake.",
    "fact": "The Tagus reaches the Atlantic Ocean just west of Lisbon."
  },
  "capetown": {
    "overview": "Cape Town sits between Table Mountain and Table Bay, where the Atlantic Ocean meets South Africa's south-western coast. Its setting combines a working harbour, beaches and dramatic mountain scenery.",
    "culture": "Bo-Kaap is recognised for its colourful streets and Cape Malay heritage. The city also has a complex history of colonial settlement, apartheid and political change.",
    "fact": "Table Mountain is a flat-topped landmark within Table Mountain National Park."
  },
  "sanfrancisco": {
    "overview": "San Francisco occupies a peninsula between the Pacific Ocean and San Francisco Bay. Its hills, waterfront and famous suspension bridge give the city a distinctive landscape.",
    "culture": "The Gold Rush drove rapid growth in the nineteenth century. Cable cars, Victorian housing and neighbourhoods such as Chinatown and the Mission reflect different periods of the city's history.",
    "fact": "The Golden Gate Bridge spans the strait connecting San Francisco Bay with the Pacific."
  },
  "cairo": {
    "overview": "Cairo is Egypt's capital, a large metropolitan centre spreading along the River Nile. Modern districts sit close to historic Islamic architecture and older neighbourhoods.",
    "culture": "Historic Cairo contains centuries-old mosques, markets and streets. Across the metropolitan area, the Giza pyramid complex preserves monuments from ancient Egypt.",
    "fact": "The River Nile flows north through Cairo towards the Mediterranean Sea."
  },
  "luxor": {
    "overview": "Luxor stands beside the Nile in southern Egypt, on and around the site of ancient Thebes. Its archaeological landscapes include vast temple complexes and tombs in the nearby western hills.",
    "culture": "Karnak and Luxor Temple are major sites on the eastern side of the Nile. Across the river, the Valley of the Kings contains burial places associated with New Kingdom rulers.",
    "fact": "The Valley of the Kings is on the west bank of the Nile near Luxor."
  },
  "fes": {
    "overview": "Fes is an important historic city in northern Morocco. Its old medina is known for tightly packed lanes, traditional workshops and monumental gateways.",
    "culture": "Fes el-Bali is one of the country's best-known medieval urban centres. Its religious schools, historic buildings and tanneries reflect a long tradition of scholarship and craft.",
    "fact": "The medina of Fes is a UNESCO World Heritage Site."
  },
  "atacama": {
    "overview": "San Pedro de Atacama is a small settlement in northern Chile's high desert, surrounded by salt flats, mountains and volcanic landscapes. It is a base for visiting dramatic desert viewpoints and lagoons.",
    "culture": "The region has a long history of Indigenous communities adapting to an arid, high-altitude environment. Visitors encounter salt-crusted basins, the Valle de la Luna and high Andean scenery.",
    "fact": "The Atacama is among the driest non-polar desert regions on Earth."
  },
  "vancouver": {
    "overview": "Vancouver lies between the Pacific coast and the Coast Mountains in British Columbia, Canada. Its harbour, parks, waterways and dense urban core sit close to forested mountain slopes.",
    "culture": "The city occupies the traditional territories of several First Nations. Stanley Park, historic neighbourhoods and its maritime setting are important parts of its identity.",
    "fact": "Stanley Park sits beside Burrard Inlet near central Vancouver."
  },
  "montreal": {
    "overview": "Montréal is a large Canadian city on an island in the Saint Lawrence River. Mount Royal rises near its centre, while older districts meet a modern downtown.",
    "culture": "French is the city's main public language. Montréal has a strong artistic and festival culture, with prominent religious architecture and a historic port area.",
    "fact": "The city takes its name from Mount Royal, the hill overlooking central Montréal."
  },
  "perth": {
    "overview": "Perth is the capital of Western Australia, on the Swan River near the Indian Ocean. Long sunny seasons, riverfront spaces and the nearby coast define its setting.",
    "culture": "The area has deep Noongar Aboriginal heritage. Kings Park, the river, and a growing modern city centre are important features of Perth.",
    "fact": "Kings Park overlooks the city centre and Swan River."
  },
  "edinburgh": {
    "overview": "Edinburgh is Scotland's capital, set on hills and rocky ridges near the Firth of Forth. The castle and Old Town overlook a planned New Town of Georgian streets.",
    "culture": "Its historic centre contains the Royal Mile, Edinburgh Castle and Holyrood Palace. The city is associated with the Scottish Enlightenment and major annual arts festivals.",
    "fact": "Arthur's Seat is an ancient volcanic feature rising above the city."
  },
  "brisbane": {
    "overview": "Brisbane is Queensland's capital, spread along bends in the Brisbane River in subtropical eastern Australia. Parklands, bridges and riverside neighbourhoods shape its cityscape.",
    "culture": "South Bank combines gardens, cultural venues and public gathering spaces. The city has developed around the river and its connections to inland Queensland and the coast.",
    "fact": "The Brisbane River winds through the city before reaching Moreton Bay."
  },
  "quebec": {
    "overview": "Québec City stands high above the Saint Lawrence River in eastern Canada. Its fortified historic core, narrow streets and distinctive Château Frontenac are central landmarks.",
    "culture": "Old Québec preserves French-colonial urban heritage alongside later Canadian history. The Upper Town and Lower Town are connected by steep streets and walkways.",
    "fact": "Old Québec is the only surviving fortified city centre north of Mexico in the Americas."
  },
  "dublin": {
    "overview": "Dublin, the capital of Ireland, grew around the River Liffey near the Irish Sea. Bridges join the city centre, where Georgian streets sit beside contemporary districts.",
    "culture": "Trinity College, Dublin Castle and the city's literary heritage reflect different periods of Irish history. Music, theatre and neighbourhood street life are strong parts of its culture.",
    "fact": "The Ha'penny Bridge is a pedestrian crossing over the River Liffey."
  },
  "tunis": {
    "overview": "Tunis is Tunisia's capital, beside the Lake of Tunis near the Mediterranean. Its historic medina and more recent avenues reveal contrasting stages of the city's growth.",
    "culture": "The old medina contains souks, mosques and traditional buildings. The ruins of ancient Carthage lie in the wider urban area near the Gulf of Tunis.",
    "fact": "The Medina of Tunis is a UNESCO World Heritage Site."
  },
  "losangeles": {
    "overview": "Los Angeles spreads across a large basin and neighbouring valleys beside California's Pacific coast. Its neighbourhoods connect inland mountains, busy streets and coastal communities.",
    "culture": "The city is closely associated with film and entertainment, but also has deep Mexican and Indigenous histories. Griffith Observatory and Santa Monica are familiar landmarks.",
    "fact": "Griffith Observatory overlooks central Los Angeles from Griffith Park."
  },
  "oaxaca": {
    "overview": "Oaxaca City lies in a valley in southern Mexico, surrounded by mountains. Its historic centre contains churches, markets, colourful streets and traditional craft workshops.",
    "culture": "The region has strong Zapotec and Mixtec cultural traditions, visible in food, textiles, celebrations and archaeology. Monte Albán is an ancient archaeological site close to the city.",
    "fact": "Monte Albán occupies a hilltop overlooking the Oaxaca Valley."
  },
  "dakar": {
    "overview": "Dakar is Senegal's capital, on the Cape Verde Peninsula projecting into the Atlantic. Its markets, coastal roads and dense urban districts face the ocean on several sides.",
    "culture": "The city is an important cultural, commercial and transport centre in West Africa. Nearby Gorée Island is associated with the history of the Atlantic slave trade.",
    "fact": "The African Renaissance Monument stands on a hill overlooking Dakar."
  },
  "cairns": {
    "overview": "Cairns is a tropical city on the north-east coast of Queensland, Australia. Its waterfront sits close to rainforest-covered mountains and routes out to the Great Barrier Reef.",
    "culture": "The surrounding region has longstanding Aboriginal cultural connections and includes the Wet Tropics rainforest. The Esplanade, marina and reef trips shape much of the visitor experience.",
    "fact": "Cairns is a major departure point for trips to the Great Barrier Reef."
  },
  "hanoi": {
    "overview": "Hanoi is Vietnam's capital in the Red River delta, where lakes and tree-lined streets break up a busy urban landscape. Its Old Quarter contains a dense network of traditional trading streets.",
    "culture": "The city's long history is visible in temples, colonial-era buildings and public squares. The Temple of Literature and Hoàn Kiếm Lake are well-known landmarks.",
    "fact": "The Temple of Literature was established in the eleventh century."
  },
  "manila": {
    "overview": "Manila is the Philippines' capital on the eastern shore of Manila Bay. The historic city is part of a much larger, densely populated metropolitan area.",
    "culture": "Intramuros preserves streets and structures from the Spanish colonial period. Binondo, one of the city's longstanding commercial districts, is associated with Chinese-Filipino history.",
    "fact": "Intramuros means 'within the walls' and refers to Manila's old fortified district."
  },
  "almaty": {
    "overview": "Almaty lies near the foothills of the Trans-Ili Alatau mountains in south-eastern Kazakhstan. Broad streets, parks and mountain views distinguish it from the surrounding steppe.",
    "culture": "The city served as Kazakhstan's capital until 1997. Its cultural institutions, markets and historic buildings remain important to the country's public life.",
    "fact": "Almaty is close to the northern slopes of the Tian Shan mountain system."
  },
  "dubai": {
    "overview": "Dubai occupies a stretch of the Persian Gulf coast in the United Arab Emirates. The city combines tall modern buildings, a historic creek trading area and desert beyond its urban edge.",
    "culture": "Dubai Creek supported commercial activity before the city's rapid modern expansion. Markets, older neighbourhoods and large infrastructure projects reflect its changing economy.",
    "fact": "Burj Khalifa is a landmark skyscraper in central Dubai."
  },
  "marrakech": {
    "overview": "Marrakech stands on the plain north of Morocco's High Atlas Mountains. Red-toned buildings, gardens and the busy medina give its historic centre a distinct character.",
    "culture": "Jemaa el-Fnaa square, souks and palaces form important parts of the old city. Marrakesh has long been connected to trading routes through and around the Atlas region.",
    "fact": "The Medina of Marrakesh is a UNESCO World Heritage Site."
  },
  "bali": {
    "overview": "Bali is an Indonesian island with volcanic mountains, rice terraces and coastal settlements. Landscapes range from upland forests and temples to busy southern beaches.",
    "culture": "Balinese Hindu traditions influence ceremonies, art and temple architecture. Farming landscapes, dance and craftsmanship remain culturally important alongside tourism.",
    "fact": "Mount Agung is a volcano and one of Bali's most prominent natural landmarks."
  }
};
const api=Object.freeze(data);if(root)root.RevisionWorldOfflineCityGuides=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window==='object'?window:null);
