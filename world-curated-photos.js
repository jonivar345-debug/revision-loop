/* Individually checked Wikimedia Commons file pages.
   Stable photographs load by Special:FilePath even when Commons API/CORS fails.
   Author and licence are shown in the location's collapsible photo credits.
   No local downsampling or recompression; thumbnail URL requests display-size
   derivatives and source pages link to their full-resolution originals. */
(function(root,factory){
  'use strict';
  const data=factory();
  if(typeof module==='object'&&module.exports)module.exports=data;
  if(root)root.RevisionWorldCuratedPhotos=data;
})(typeof window==='object'?window:null,function(){
  'use strict';
  const verified=Object.freeze({
    london:[
      {file:'The Tower Bridge, London, UK.jpg',author:'Maksim Sokolov (maxergon.com)',license:'CC BY-SA 4.0',subject:'Tower Bridge',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/'},
      {file:'Panorama London 2012.jpg',author:'FiatLUX',license:'CC BY-SA 3.0',subject:'Westminster and Big Ben',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/'},
      {file:'At London 2024 019.jpg',author:'Mike Peel',license:'CC BY-SA 4.0',subject:'Millennium Bridge and the City',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/'},
      {file:'St Pauls Cathedral in London.jpg',author:'Chitrapa',license:'CC BY-SA 4.0',subject:'St Paul’s Cathedral',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/'}
    ],
    busan:[
      {file:'Haeundae District and Beach.jpg',author:'Masterhatch',license:'CC BY-SA 4.0',subject:'Haeundae beachfront and skyline',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/'},
      {file:'Gwangalli bridge at sunset.jpg',author:'Horizonjumpers',license:'CC BY 4.0',subject:'Gwangalli Bridge at sunset',licenseUrl:'https://creativecommons.org/licenses/by/4.0/'},
      {file:'Gamcheon Culture Village in Busan, South Korea.jpg',author:'VN.NguyenDucDuy',license:'CC BY-SA 4.0',subject:'Gamcheon Culture Village',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/'},
      {file:'Haedong Yonggungsa, Busan.jpg',author:'midnight.here',license:'CC BY-SA 2.0',subject:'Haedong Yonggungsa Temple',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/'}
    ]
  });
  // Individually checked Commons *file descriptions* from the existing editorial
  // research archive. Their metadata/depiction claims have not all been
  // confirmed by viewing full-size image pixels. Keep this status distinct
  // from London and Busan's deliberately selected live gallery photographs.
  const editorial=Object.freeze({
    "country-al": [
      {
        "file": "Butrint. theatre.jpg",
        "author": "Zysko serhii",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Butrint ancient theatre seen from the site",
        "editorialMetadata": true
      },
      {
        "file": "Butrint theatre.jpg",
        "author": "Valerie M",
        "license": "CC BY 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
        "subject": "Ancient theatre at Butrint",
        "editorialMetadata": true
      }
    ],
    "country-am": [
      {
        "file": "Geghard Monastery, Armenia.jpg",
        "author": "Vyacheslav Argenberg",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "subject": "Geghard monastery buildings against valley cliffs",
        "editorialMetadata": true
      },
      {
        "file": "Geghard Monastery, Church, Armenia.jpg",
        "author": "Vyacheslav Argenberg",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "subject": "Geghard church photographed in 2014",
        "editorialMetadata": true
      },
      {
        "file": "Geghard Monastery, Entrance, Armenia.jpg",
        "author": "Vyacheslav Argenberg",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "subject": "Entrance to Geghard monastery",
        "editorialMetadata": true
      }
    ],
    "country-id": [
      {
        "file": "Stupa in Borobudur Temple, Indonesia.jpg",
        "author": "PL 03 galih",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Stupa at Borobudur",
        "editorialMetadata": true
      },
      {
        "file": "Borobudur temple.jpg",
        "author": "Syselpunk",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Borobudur temple view in Java",
        "editorialMetadata": true
      },
      {
        "file": "Stupa Candi Borobudur.jpg",
        "author": "Istiadiningdyah",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Borobudur temple stupa",
        "editorialMetadata": true
      }
    ],
    "country-ca": [
      {
        "file": "Banff National Park landscape.jpg",
        "author": "Eggbones",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Landscape within Banff National Park",
        "editorialMetadata": true
      }
    ],
    "country-tr": [
      {
        "file": "Gobekli Tepe 4.jpg",
        "author": "Immanuelle",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Archaeological remains at Göbekli Tepe",
        "editorialMetadata": true
      },
      {
        "file": "Göbeklitepe.jpg",
        "author": "Beytullah eles",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Stone remains at Göbekli Tepe",
        "editorialMetadata": true
      }
    ],
    "country-sg": [
      {
        "file": "Singapore Botanic Gardens.jpg",
        "author": "Songpyeon",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Landscaped gardens and pond in Singapore",
        "editorialMetadata": true
      },
      {
        "file": "Singapore Botanic Gardens (1).jpg",
        "author": "Rojypala",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "View of Singapore Botanic Gardens",
        "editorialMetadata": true
      }
    ],
    "singapore": [
      {
        "file": "Singapore Botanic Gardens.jpg",
        "author": "Songpyeon",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Landscaped gardens and pond in Singapore",
        "editorialMetadata": true
      },
      {
        "file": "Singapore Botanic Gardens (1).jpg",
        "author": "Rojypala",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "View of Singapore Botanic Gardens",
        "editorialMetadata": true
      }
    ],
    "country-cf": [
      {
        "file": "Dzanga Bai forest clearing with African forest elephants, Central African Republic.jpg",
        "author": "JosepMGracia",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Wide view of Dzanga Bai, a forest clearing in the Dzanga-Sangha Special Reserve, with African forest elephants",
        "editorialMetadata": true
      },
      {
        "file": "African forest elephant drinking at Dzanga Bai.jpg",
        "author": "JosepMGracia",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "African forest elephant drinking at Dzanga Bai in the Dzanga-Sangha Special Reserve",
        "editorialMetadata": true
      },
      {
        "file": "African forest elephant emerging from rainforest at Dzanga Bai.jpg",
        "author": "JosepMGracia",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "African forest elephant emerging from rainforest near Dzanga Bai",
        "editorialMetadata": true
      },
      {
        "file": "RCA Rainforest.jpg",
        "author": "JMGRACIA100",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Rainforest in the Dzanga-Sangha area of the Central African Republic",
        "editorialMetadata": true
      }
    ],
    "country-cd": [
      {
        "file": "Virunga National Park Gorilla.jpg",
        "author": "LuAnne Cadd",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Mountain gorilla photographed in Virunga National Park, Democratic Republic of the Congo",
        "editorialMetadata": true
      },
      {
        "file": "Ruwenzori Mountains Virunga National Park.jpg",
        "author": "Cai Tjeenk Willink",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Rwenzori Mountains photographed within Virunga National Park in eastern DR Congo",
        "editorialMetadata": true
      }
    ],
    "country-cm": [
      {
        "file": "Dja River and pirogue.JPG",
        "author": "Amcaja",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Dugout pirogue on the Dja River, south of Lomié and north of Ngoila in eastern Cameroon",
        "editorialMetadata": true
      },
      {
        "file": "Rothmannia lateriflora (Rubiaceae) from the Dja Faunal Reserve.jpg",
        "author": "B. Sonké (photograph; source publication co-authored with T. Couvreur)",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "subject": "Rothmannia lateriflora plant photographed in the Dja Faunal Reserve, Cameroon",
        "editorialMetadata": true
      }
    ]
  });
  // Provisional source-linked records from the first ten independent editorial audits.
  const additionalEditorialA=Object.freeze({
    "country-cz": [
      {
        "file": "Charles Bridge-Prague-4.jpg",
        "author": "Yair Haklai",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Charles Bridge, Prague, Czechia.",
        "editorialMetadata": true
      },
      {
        "file": "Astronomical Clock Prague (20190520 120955).jpg",
        "author": "Simon Legner (User:simon04)",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Prague Astronomical Clock, Czechia.",
        "editorialMetadata": true
      }
    ],
    "country-sk": [
      {
        "file": "Bratislava - Burg (b).JPG",
        "author": "C.Stadler/Bwag",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Southeast view of Bratislava Castle, Slovakia.",
        "editorialMetadata": true
      },
      {
        "file": "Lomnický štít High Tatras 04.jpg",
        "author": "Pavol Svetoň",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Lomnický štít peak in the High Tatras, Slovakia.",
        "editorialMetadata": true
      }
    ],
    "country-hu": [
      {
        "file": "Hungarian Parliament Building, Budapest, Hungary.jpg",
        "author": "CivArmy",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Hungarian Parliament Building in Budapest, Hungary.",
        "editorialMetadata": true
      },
      {
        "file": "Buda Castle the BHM IMG 1043.jpg",
        "author": "Bjoertvedt",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Building in the Buda Castle complex, Budapest, Hungary.",
        "editorialMetadata": true
      }
    ],
    "country-si": [
      {
        "file": "Triple Bridge, Ljubljana.jpg",
        "author": "Thomas Ledl",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Triple Bridge in Ljubljana, Slovenia.",
        "editorialMetadata": true
      },
      {
        "file": "Lake Bled (9).jpg",
        "author": "Krzysztof Golik (Tournasol7)",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Lake Bled in Upper Carniola, Slovenia.",
        "editorialMetadata": true
      }
    ],
    "country-hr": [
      {
        "file": "Dubrovnik Old Town 1.jpg",
        "author": "kallerna",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Morning view of Dubrovnik Old Town and its city walls, Croatia.",
        "editorialMetadata": true
      },
      {
        "file": "Plitvice Lakes National Park, Croatia.jpg",
        "author": "Epistola8",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Plitvice Lakes National Park, Croatia.",
        "editorialMetadata": true
      }
    ],
    "country-ao": [
      {
        "file": "Kalandula Falls C.jpg",
        "author": "Zorglub",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Kalandula Falls, photographed from the gorge in Malanje Province, Angola",
        "editorialMetadata": true
      },
      {
        "file": "Kalandula waterfalls of the Lucala-River in Malange, Angola.JPG",
        "author": "Paulo César Santos",
        "license": "CC0 1.0",
        "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
        "subject": "Water falling over the broad Kalandula escarpment on the Lucala River, Angola",
        "editorialMetadata": true
      }
    ],
    "country-bj": [
      {
        "file": "Palais royaux d'Abomey 04.jpg",
        "author": "Gildaskiki",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Photograph taken at the Royal Palaces of Abomey, Benin",
        "editorialMetadata": true
      },
      {
        "file": "Héritage, Palais royaux d'Abomey.jpg",
        "author": "Azogbonon",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Heritage detail at the Royal Palaces of Abomey, Benin",
        "editorialMetadata": true
      }
    ],
    "country-bw": [
      {
        "file": "Okavango Delta.jpg",
        "author": "DoctorJoeE",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Aerial view of the Okavango Delta floodplain, Botswana",
        "editorialMetadata": true
      },
      {
        "file": "Okavango Delta, Botswana (2674373339).jpg",
        "author": "Joachim Huber",
        "license": "CC BY-SA 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
        "subject": "Landscape photographed in the Okavango Delta, Botswana",
        "editorialMetadata": true
      }
    ],
    "country-na": [
      {
        "file": "Sossusvlei namib desert.jpg",
        "author": "Hein waschefort",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Red dune and sparse vegetation near Sossusvlei in Namibia's Namib Desert",
        "editorialMetadata": true
      },
      {
        "file": "Landscape Sossusvlei, Namibia.jpg",
        "author": "Olga Ernst & Hp.Baumeler",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Desert landscape near Sossusvlei, Namibia, photographed in April 2017",
        "editorialMetadata": true
      }
    ],
    "country-sn": [
      {
        "file": "Gorée Island, Senegal, fort and harbor.jpg",
        "author": "T.K. Naliaka",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Aerial view of the northern part of Gorée Island, showing its harbour and fort",
        "editorialMetadata": true
      },
      {
        "file": "Ile de Gorée Sénégal.jpg",
        "author": "Focale Emotions",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Photograph of Gorée Island, Senegal",
        "editorialMetadata": true
      }
    ],
    "country-bi": [
      {
        "file": "La rivière Rusizi, Burundi.jpg",
        "author": "Grâce Aurore",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "The Rusizi River in Burundi's Rusizi National Park.",
        "editorialMetadata": true
      },
      {
        "file": "Rusizi NP.jpg",
        "author": "d_proffer",
        "license": "CC BY 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
        "subject": "A landscape within Rusizi National Park in Burundi.",
        "editorialMetadata": true
      },
      {
        "file": "Lac Tanganyika au Burundi 6.jpg",
        "author": "Edouard mhg",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "A view of Lake Tanganyika in Burundi's Bujumbura province.",
        "editorialMetadata": true
      }
    ],
    "country-rw": [
      {
        "file": "Akagera National Park in Rwanda.jpg",
        "author": "Emery045",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Grassland landscape in Rwanda's Akagera National Park.",
        "editorialMetadata": true
      },
      {
        "file": "Nyungwe NP.jpg",
        "author": "Nkunda102",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Forest habitat photographed in Rwanda, filed under Nyungwe National Park.",
        "editorialMetadata": true
      },
      {
        "file": "Volcanoes National Park Rwanda.jpg",
        "author": "Nina R",
        "license": "CC BY 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
        "subject": "Landscape associated with Volcanoes National Park, Rwanda.",
        "editorialMetadata": true
      }
    ],
    "country-zm": [
      {
        "file": "Victoria falls, zambia.jpg",
        "author": "Someone35",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Victoria Falls viewed from the Zambian side.",
        "editorialMetadata": true
      },
      {
        "file": "VicFalls.jpg",
        "author": "Hans Hillewaert",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Victoria Falls at Livingstone, Zambia.",
        "editorialMetadata": true
      }
    ],
    "country-zw": [
      {
        "file": "Great Zimbabwe Ruins.jpg",
        "author": "Trinapee",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Stone structures at the Great Zimbabwe archaeological ruins.",
        "editorialMetadata": true
      },
      {
        "file": "Victoria Falls, Zimbabwe 04.jpg",
        "author": "Bernard Gagnon",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Victoria Falls from the Zimbabwe side.",
        "editorialMetadata": true
      }
    ],
    "country-bs": [
      {
        "file": "Goat Cay, Exuma, The Bahamas.jpg",
        "author": "DrGvago",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Goat Cay in the Exuma islands, Bahamas, photographed from a boat.",
        "editorialMetadata": true
      },
      {
        "file": "BHA Nassau, Paradise Island, Cove Beach 001.jpg",
        "author": "Der-wuppertaler",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Cove Beach on Paradise Island, near Nassau, Bahamas.",
        "editorialMetadata": true
      }
    ],
    "country-ht": [
      {
        "file": "Sans-Souci Palace, National History Park, Haiti.jpg",
        "author": "Didier Moïse",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "The historic Sans-Souci Palace at Milot in northern Haiti.",
        "editorialMetadata": true
      },
      {
        "file": "Citadelle Laferrière.jpg",
        "author": "Rémi Kaupp",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Citadelle Laferrière near Milot, Haiti, viewed from the approach path.",
        "editorialMetadata": true
      }
    ],
    "country-lc": [
      {
        "file": "The Pitons, St. Lucia3.jpg",
        "author": "XeresNelro",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "The Pitons volcanic peaks in Saint Lucia.",
        "editorialMetadata": true
      },
      {
        "file": "Soufrière, St Lucia, 2007.jpg",
        "author": "Gzdavidwong",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Soufrière and its volcanic landscape in Saint Lucia.",
        "editorialMetadata": true
      }
    ],
    "country-gd": [
      {
        "file": "Grand Anse beach, Grenada.jpg",
        "author": "Rein Ketelaars",
        "license": "CC BY-SA 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
        "subject": "Sunset at Grand Anse Beach, Grenada.",
        "editorialMetadata": true
      },
      {
        "file": "St. George's Wharf, Grenada.jpg",
        "author": "Larry Syverson",
        "license": "CC BY-SA 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
        "subject": "Wharf Road curving around the harbour in St George's, Grenada.",
        "editorialMetadata": true
      }
    ],
    "country-tt": [
      {
        "file": "Pitch Lake.JPG",
        "author": "Martina Jackson",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Pitch Lake near La Brea in Trinidad and Tobago.",
        "editorialMetadata": true
      },
      {
        "file": "Caroni Swamp Trinidad.jpg",
        "author": "Bas Leenders",
        "license": "CC BY-SA 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
        "subject": "Aerial view of Caroni Swamp on Trinidad's Gulf of Paria coast.",
        "editorialMetadata": true
      }
    ],
    "country-gt": [
      {
        "file": "Tikal Guatemala 5.jpg",
        "author": "MongeNajera",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Tikal Temple I in the Maya city of Tikal, Petén, Guatemala",
        "editorialMetadata": true
      },
      {
        "file": "Tikal Temple II, 2022 02.jpg",
        "author": "Simon Burchell",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Tikal Temple II at the archaeological site in Petén, Guatemala",
        "editorialMetadata": true
      },
      {
        "file": "Arco de Santa Catalina.jpg",
        "author": "Gashbel",
        "license": "CC0 1.0",
        "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
        "subject": "Santa Catalina Arch in Antigua Guatemala",
        "editorialMetadata": true
      }
    ],
    "country-bz": [
      {
        "file": "Belize Caye Caulker-226.jpg",
        "author": "Dronepicr",
        "license": "CC BY 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
        "subject": "Aerial view of Caye Caulker island and surrounding water, Belize",
        "editorialMetadata": true
      },
      {
        "file": "Great Blue Hole Belize.jpg",
        "author": "Axelspace Corporation",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Satellite view of the Great Blue Hole at Lighthouse Reef, Belize",
        "editorialMetadata": true
      }
    ],
    "country-cr": [
      {
        "file": "Arenal Volcano National Park.jpg",
        "author": "BNP-CR506",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Clear view of Arenal Volcano National Park in northern Costa Rica",
        "editorialMetadata": true
      },
      {
        "file": "Monteverde Costa Rica 04.jpg",
        "author": "Cephas",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Tropical forest seen from a suspension bridge in Monteverde, Costa Rica",
        "editorialMetadata": true
      }
    ],
    "country-pa": [
      {
        "file": "Miraflores Locks Panama Canal.jpg",
        "author": "John23Ms",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "subject": "Miraflores Locks on the Panama Canal",
        "editorialMetadata": true
      },
      {
        "file": "Casco Viejo, Panamá.jpg",
        "author": "Esteban Folch",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Panama City's historic Casco Viejo photographed at night",
        "editorialMetadata": true
      }
    ],
    "country-kg": [
      {
        "file": "Song-Kul, Kyrgyzstan (43670021735).jpg",
        "author": "Ninara",
        "license": "CC BY 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
        "subject": "Yurt-camp landscape beside Song-Köl, an alpine lake in Kyrgyzstan's Naryn Region.",
        "editorialMetadata": true
      },
      {
        "file": "Song Köl lake, Kyrgyzstan (29775175450).jpg",
        "author": "Thomas Depenbusch (Depi)",
        "license": "CC BY 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
        "subject": "Yurts photographed by moonlight beside Song-Köl in Kyrgyzstan.",
        "editorialMetadata": true
      }
    ],
    "country-tj": [
      {
        "file": "Karakul lake Tajikistan.jpg",
        "author": "Ekrem Canli",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Karakul Lake in Tajikistan's Pamir Mountains, viewed from the Pamir Highway.",
        "editorialMetadata": true
      },
      {
        "file": "Kulikalon Lake and Fann Mountains, Tajikistan.jpg",
        "author": "Adam Harangozó",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Kulikalon Lake beneath the Fann Mountains in Tajikistan.",
        "editorialMetadata": true
      }
    ],
    "country-kz": [
      {
        "file": "Charyn Canyon, Kazakhstan 04.jpg",
        "author": "Bgag",
        "license": "CC0 1.0",
        "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
        "subject": "The Charyn Canyon rock formations in south-eastern Kazakhstan.",
        "editorialMetadata": true
      },
      {
        "file": "Charyn canyon.jpg",
        "author": "EkaterinaK42",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Rocky landscape in Charyn National Park, Almaty Region, Kazakhstan.",
        "editorialMetadata": true
      }
    ],
    "country-mn": [
      {
        "file": "Gobi, krajobraz pustyni (02).jpg",
        "author": "Marcin Konsek",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Gobi Desert landscape in Dornogovi Province, Mongolia.",
        "editorialMetadata": true
      },
      {
        "file": "Khongoryn Els, Gurvansaikhan NP, Gobi desert, Mongolia.jpg",
        "author": "Severin.stalder",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Bactrian camels beside the dunes of Khongoryn Els in Mongolia's Gobi Desert.",
        "editorialMetadata": true
      }
    ],
    "country-np": [
      {
        "file": "Annapurna IV.jpg",
        "author": "Dinesh Kazi",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Annapurna IV mountain in Nepal, photographed in the Annapurna region.",
        "editorialMetadata": true
      }
    ],
    "country-bt": [
      {
        "file": "The Tiger's nest.jpg",
        "author": "Soham Banerjee",
        "license": "CC BY 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
        "subject": "Paro Taktsang, the cliffside Tiger's Nest monastery in Bhutan.",
        "editorialMetadata": true
      }
    ],
    "country-cl": [
      {
        "file": "National park Torres del Paine, Chile.jpg",
        "author": "Tetraigofotos",
        "license": "CC BY-SA 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
        "subject": "Landscape in Torres del Paine National Park, Chile.",
        "editorialMetadata": true
      },
      {
        "file": "Torres del Paine. Chile..JPG",
        "author": "Chaparroandrea",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Mountain landscape in Torres del Paine National Park, Chile.",
        "editorialMetadata": true
      }
    ],
    "country-pe": [
      {
        "file": "Machu Picchu, Peru - Laslovarga (107).jpg",
        "author": "Laslovarga",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Machu Picchu archaeological site, Peru.",
        "editorialMetadata": true
      },
      {
        "file": "Winikunka.jpg",
        "author": "Jhonatan David Reategui Sifuentes",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Vinicunca, the multicoloured mountain in the Cusco region of Peru.",
        "editorialMetadata": true
      }
    ],
    "country-ve": [
      {
        "file": "Angel Falls Venezuela.jpg",
        "author": "Mr.Angelfish",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Angel Falls in Canaima National Park, Venezuela.",
        "editorialMetadata": true
      },
      {
        "file": "Salto Ángel (2004) 04.jpg",
        "author": "LBM1948",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Angel Falls descending from Auyán-tepui in Canaima National Park, Venezuela.",
        "editorialMetadata": true
      }
    ],
    "country-ar": [
      {
        "file": "Argentina - Perito Moreno Glacier 02.jpg",
        "author": "P. Hughes",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "subject": "Perito Moreno Glacier viewed from Lago Argentino, Argentina.",
        "editorialMetadata": true
      },
      {
        "file": "Trekking at Perito Moreno Glacier.jpg",
        "author": "Fernando",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "People trekking on Perito Moreno Glacier in Los Glaciares National Park, Argentina.",
        "editorialMetadata": true
      }
    ],
    "country-bo": [
      {
        "file": "Bolivia - Salar de Uyuni - Wiki Commons.jpg",
        "author": "Mario Falcetti",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Sunset across the Salar de Uyuni salt flat in Bolivia.",
        "editorialMetadata": true
      },
      {
        "file": "SAL - Salt piles on Salar de Uyuni, Bolivia, 2013.jpg",
        "author": "Josep M. Gracia",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Salt piles on Salar de Uyuni, Bolivia.",
        "editorialMetadata": true
      }
    ],
    "country-jp": [
      {
        "file": "Kyoto Fushimi Inari Shrine.jpg",
        "author": "Pkos079",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Fushimi Inari shrine torii in Kyoto, Japan.",
        "editorialMetadata": true
      },
      {
        "file": "Japan 040416 Himeji Castle 001.jpg",
        "author": "Oren Rozen",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Himeji Castle in Hyōgo Prefecture, Japan.",
        "editorialMetadata": true
      }
    ],
    "country-kr": [
      {
        "file": "Korea Gyeongbokgung Palace.jpg",
        "author": "Yunzin0115",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Gyeongbokgung Palace in Seoul, South Korea.",
        "editorialMetadata": true
      },
      {
        "file": "Seongsan Ilchulbong 01.jpg",
        "author": "Bernard Gagnon",
        "license": "CC0 1.0",
        "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
        "subject": "Seongsan Ilchulbong volcanic tuff cone on Jeju Island, South Korea.",
        "editorialMetadata": true
      }
    ],
    "country-cn": [
      {
        "file": "Forbidden City, Beijing.jpg",
        "author": "World3000",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "The Forbidden City palace complex in Beijing, China.",
        "editorialMetadata": true
      },
      {
        "file": "Mutianyu Great Wall (6222519140).jpg",
        "author": "Arian Zwegers",
        "license": "CC BY 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
        "subject": "Mutianyu section of the Great Wall north of Beijing, China.",
        "editorialMetadata": true
      }
    ],
    "country-th": [
      {
        "file": "Wat Arun in Bangkok (1).jpg",
        "author": "Krzysztof Golik",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Wat Arun temple in Bangkok, Thailand.",
        "editorialMetadata": true
      },
      {
        "file": "Ayutthaya historical park.jpg",
        "author": "Ranjithkr",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Ruins in Ayutthaya Historical Park, Thailand.",
        "editorialMetadata": true
      }
    ],
    "country-vn": [
      {
        "file": "Hạ Long Bay 07.jpg",
        "author": "Christophe95",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Hạ Long Bay's limestone scenery photographed from a kayak, Vietnam.",
        "editorialMetadata": true
      },
      {
        "file": "Phố cổ Hội An.jpg",
        "author": "Hcxtd",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "The historic old town of Hội An, Vietnam.",
        "editorialMetadata": true
      }
    ],
    "country-ke": [
      {
        "file": "Alyssa K. Barry Lamu, Kenya.jpg",
        "author": "Kalyss",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "A photographed scene in Lamu, Kenya.",
        "editorialMetadata": true
      },
      {
        "file": "Cheetah, Maasai Mara.jpg",
        "author": "Michelle Juma",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Cheetah in the Maasai Mara National Reserve, Kenya.",
        "editorialMetadata": true
      }
    ],
    "country-tz": [
      {
        "file": "Kilimanjaro Tanzania.jpg",
        "author": "Wvuijk",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Mount Kilimanjaro in northern Tanzania.",
        "editorialMetadata": true
      },
      {
        "file": "Stone town -Zanzibar.jpg",
        "author": "Ally.Nachuli (Tx)",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Waterfront scene in Stone Town, Zanzibar, Tanzania.",
        "editorialMetadata": true
      }
    ],
    "country-ug": [
      {
        "file": "Bwindi Impenetrable National Park 01.jpg",
        "author": "Thomas Fuhrmann",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Landscape in Bwindi Impenetrable National Park, Uganda.",
        "editorialMetadata": true
      },
      {
        "file": "Murchison Falls, Uganda.jpg",
        "author": "Lichrully",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Murchison Falls on the Nile in Uganda, with waterfall mist and rainbow.",
        "editorialMetadata": true
      }
    ],
    "country-et": [
      {
        "file": "Biete Qeddus Mercoreus.jpg",
        "author": "Geichhorn2000",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Rock-hewn Biete Qeddus Mercoreus church in Lalibela, Ethiopia.",
        "editorialMetadata": true
      },
      {
        "file": "Simien Mountains National Park 07.jpg",
        "author": "Bernard Gagnon",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Landscape in Simien Mountains National Park, Ethiopia.",
        "editorialMetadata": true
      }
    ],
    "country-gh": [
      {
        "file": "Cape Coast castle.jpg",
        "author": "Kodex",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Front of Cape Coast Castle, Ghana.",
        "editorialMetadata": true
      },
      {
        "file": "Kakum National Park, Ghana.jpg",
        "author": "ZSM",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Rainforest canopy walkway in Kakum National Park, Ghana.",
        "editorialMetadata": true
      }
    ],
    "country-eg": [
      {
        "file": "The great Sphinx and Pyramids 01.jpg",
        "author": "Emadlxr1",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "The Great Sphinx and pyramids on the Giza Plateau, Egypt.",
        "editorialMetadata": true
      },
      {
        "file": "Karnak Hypostyle Hall R02.jpg",
        "author": "Marc Ryckaert",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Columns of the Great Hypostyle Hall at Karnak, Luxor, Egypt.",
        "editorialMetadata": true
      }
    ],
    "country-ma": [
      {
        "file": "Chefchaouen.JPG",
        "author": "Anass Sedrati",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "View of Chefchaouen, Morocco.",
        "editorialMetadata": true
      },
      {
        "file": "Fes-Morocco 38.jpg",
        "author": "Werner100359",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Street or architectural scene in Fes, Morocco.",
        "editorialMetadata": true
      }
    ],
    "country-tn": [
      {
        "file": "Amphithéâtre d'El Jem 2024 20.jpg",
        "author": "Ivan25",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Amphitheatre of El Jem, Tunisia.",
        "editorialMetadata": true
      },
      {
        "file": "Sidi Bou Said 01.jpg",
        "author": "Rene Cortin",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Sidi Bou Said, Tunisia.",
        "editorialMetadata": true
      }
    ],
    "country-ly": [
      {
        "file": "Leptis Magna, Al-Khums, Libya.jpg",
        "author": "Syed Wali Peeran",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Archaeological remains at Leptis Magna near Al Khums, Libya.",
        "editorialMetadata": true
      },
      {
        "file": "Ancient Theatre - Sabratha - Libya 04.jpg",
        "author": "Houss 2020",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Ancient theatre at Sabratha, Libya.",
        "editorialMetadata": true
      }
    ],
    "country-dz": [
      {
        "file": "Casbah of Algiers, the heart of the city.jpg",
        "author": "Nour Abdelatif",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Historic Casbah of Algiers, Algeria.",
        "editorialMetadata": true
      },
      {
        "file": "Timgad- A Roman Colonial City and UNESCO World Heritage Site in the Aurès Mountains 395.jpg",
        "author": "Rachid Hamatou",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Roman city ruins at Timgad in the Aurès Mountains, Algeria.",
        "editorialMetadata": true
      }
    ]
  });
  function filesFor(id){
    return [...(verified[id]||[]),...(editorial[id]||[]),...(additionalEditorialA[id]||[])];
  }
  function image(entry){
    const file=entry.file.replace(/ /g,'_');
    const encoded=encodeURIComponent(file);
    return Object.freeze({
      ...entry,
      checked:!entry.editorialMetadata,
      locationVerified:true,
      file:'File:'+entry.file,
      filePage:'https://commons.wikimedia.org/wiki/File:'+encoded,
      url:'https://commons.wikimedia.org/wiki/Special:FilePath/'+encoded+'?width=2048',
      originalUrl:'https://commons.wikimedia.org/wiki/Special:FilePath/'+encoded,
      originalPage:'https://commons.wikimedia.org/wiki/File:'+encoded,
      description:entry.subject,
      source:entry.editorialMetadata?'editorial-source':'curated'
    });
  }
  return Object.freeze({filesFor,get:id=>filesFor(id).map(image)});
});
