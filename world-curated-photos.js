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
        "file": "Lake Sevan and Sevan National Park.jpg",
        "author": "Մարի Ավետիսյան",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Lake Sevan and surrounding national park scenery in Armenia",
        "editorialMetadata": true
      },
      {
        "file": "Noravank D 01.jpg",
        "author": "Dav Sargsyan",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Noravank monastery and landscape in Armenia",
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
        "file": "Xunantunich Belize 1 16.jpg",
        "author": "Denis Barthel",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Archaeological plazas and El Castillo at the Xunantunich Maya site, Belize",
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
  // Provisional source-linked records from the remaining nine editorial audits.
  const additionalEditorialB=Object.freeze({
    "country-er": [
      {
        "file": "2006-11-01 13-58-33 Eritrea - Asmara.jpg",
        "author": "Hansueli Krapf",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Asmara city centre, Eritrea.",
        "editorialMetadata": true
      },
      {
        "file": "Massawa , Eritrea (30129478664).jpg",
        "author": "Clay Gilliland",
        "license": "CC BY-SA 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
        "subject": "Historic streetscape in Massawa, Eritrea.",
        "editorialMetadata": true
      }
    ],
    "country-so": [
      {
        "file": "Mogadishu Liido beach.JPG",
        "author": "Khadija Isse",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Liido Beach on the coast of Mogadishu, Somalia.",
        "editorialMetadata": true
      },
      {
        "file": "Laas Geel alcove.jpg",
        "author": "najeeb",
        "license": "CC BY-SA 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
        "subject": "An alcove with ancient rock paintings at Laas Geel near Hargeisa, Somaliland.",
        "editorialMetadata": true
      }
    ],
    "country-sd": [
      {
        "file": "Sudan Meroe Pyramids 15jan2005.jpg",
        "author": "Steve Evans",
        "license": "CC BY-SA 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
        "subject": "Pyramids at Meroë in Sudan.",
        "editorialMetadata": true
      },
      {
        "file": "Suakin,national bank.jpg",
        "author": "Bertramz",
        "license": "CC BY 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
        "subject": "Ruins of the former National Bank building at Suakin, Sudan.",
        "editorialMetadata": true
      }
    ],
    "country-ss": [
      {
        "file": "Juba Bridge.jpg",
        "author": "Zamwan",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Juba Bridge crossing the White Nile in South Sudan.",
        "editorialMetadata": true
      },
      {
        "file": "Nimule South Sudan.jpg",
        "author": "Guwo Josephine",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "A scene photographed at Nimule in South Sudan.",
        "editorialMetadata": true
      }
    ],
    "country-ml": [
      {
        "file": "Moschee von Djenné.jpg",
        "author": "qiv",
        "license": "CC BY-SA 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
        "subject": "Great Mosque of Djenné and its surrounding Monday market in Mali.",
        "editorialMetadata": true
      },
      {
        "file": "Bandiagara, Mali.jpg",
        "author": "Dr. Ondřej Havelka (cestovatel)",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Dogon-country landscape and architecture around Bandiagara, Mali.",
        "editorialMetadata": true
      }
    ],
    "country-fr": [
      {
        "file": "2017-04 Mont Saint-Michel 02.jpg",
        "author": "Antoine Lamielle",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Mont Saint-Michel viewed from the surrounding salt meadows in Normandy.",
        "editorialMetadata": true
      },
      {
        "file": "Mont-Saint-Michel at sunset.jpg",
        "author": "Giladtop",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Mont Saint-Michel village and abbey photographed at sunset.",
        "editorialMetadata": true
      }
    ],
    "country-de": [
      {
        "file": "Neuschwanstein Castle.jpg",
        "author": "Cezary Piwowarski",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Neuschwanstein Castle in Schwangau, Bavaria.",
        "editorialMetadata": true
      },
      {
        "file": "Neuschwanstein Castle at sunrise.jpg",
        "author": "Giladtop",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Neuschwanstein Castle in Schwangau at sunrise.",
        "editorialMetadata": true
      }
    ],
    "country-es": [
      {
        "file": "Alhambra from Generalife (2017).jpg",
        "author": "Martinvl",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "View of Granada's Alhambra complex from the Generalife.",
        "editorialMetadata": true
      },
      {
        "file": "-Alhambra-.jpg",
        "author": "Cgbpict",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Alhambra and Generalife monument complex in Granada.",
        "editorialMetadata": true
      }
    ],
    "country-it": [
      {
        "file": "Rome Colosseum 2017.jpg",
        "author": "Helloworld314",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "The Colosseum in Rome, photographed in 2017.",
        "editorialMetadata": true
      },
      {
        "file": "Pompeii, Italy 121.jpg",
        "author": "Simon Burchell",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Ancient Roman ruins at Pompeii, Italy.",
        "editorialMetadata": true
      }
    ],
    "country-gr": [
      {
        "file": "Meteora, 45.jpg",
        "author": "LBM1948",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "View from Meteora towards Kalabaka, the Pineios valley and the Pindus range.",
        "editorialMetadata": true
      },
      {
        "file": "Erechtheion Acropolis Athens.jpg",
        "author": "Andrzej Barabasz (Chepry)",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Erechtheion temple on the Acropolis of Athens.",
        "editorialMetadata": true
      }
    ],
    "country-ga": [
      {
        "file": "La-lopé-gabon.jpg",
        "author": "Vincent.vaquin",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "View identified by the uploader as Lopé National Park, Gabon",
        "editorialMetadata": true
      },
      {
        "file": "Elephants in Lopé National Park.JPG",
        "author": "Ngangorica",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Elephants on the savannah in Lopé National Park, Gabon",
        "editorialMetadata": true
      },
      {
        "file": "La lopé-rupestre3.jpg",
        "author": "Vincent.vaquin",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Rock engraving identified on Commons as being in Lopé National Park, Gabon",
        "editorialMetadata": true
      }
    ],
    "country-td": [
      {
        "file": "Ounianga Serir.jpg",
        "author": "Jacques Taberlet",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Ounianga Sérir lake in northern Chad, photographed in 1998",
        "editorialMetadata": true
      }
    ],
    "country-gq": [
      {
        "file": "Lago Biaó.jpg",
        "author": "Churlos",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Lago Biaó on Bioko island, Equatorial Guinea",
        "editorialMetadata": true
      },
      {
        "file": "Begonia prismatocarpa Bioko 2013.jpg",
        "author": "Denis Barthel",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Begonia prismatocarpa in montane cloud forest near Moka on Bioko island",
        "editorialMetadata": true
      },
      {
        "file": "Ureca, Bioko Island Equatorial Guinea.jpg",
        "author": "Bioko Islander",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Scene identified as Ureca on Bioko island, Equatorial Guinea",
        "editorialMetadata": true
      }
    ],
    "country-cg": [
      {
        "file": "Les Gorilles du Parc National d'odzala Kokoua.jpg",
        "author": "Ekassa",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Gorillas in a forest clearing, described as being in Odzala-Kokoua National Park, Republic of the Congo",
        "editorialMetadata": true
      },
      {
        "file": "Loxodonta cyclotis, Odzala-Kokoua National Park, Republic of the Congo 53146541.jpg",
        "author": "John P Friel",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "subject": "African forest elephant in Odzala-Kokoua National Park, Republic of the Congo",
        "editorialMetadata": true
      }
    ],
    "country-gy": [
      {
        "file": "Kaieteur Falls, Guyana (23580581821).jpg",
        "author": "Dan Sloan",
        "license": "CC BY-SA 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
        "subject": "Kaieteur Falls on the Potaro River in Guyana.",
        "editorialMetadata": true
      },
      {
        "file": "Kaieteur Falls, Guyana1.jpg",
        "author": "Ian Mackenzie (madmack66)",
        "license": "CC BY 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
        "subject": "A second photographer's view of Kaieteur Falls in Guyana.",
        "editorialMetadata": true
      }
    ],
    "country-sr": [
      {
        "file": "Fort Zeelandia, Paramaribo, Suriname.jpg",
        "author": "Medimir",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "The front of Fort Zeelandia, a historic fort in Paramaribo, Suriname.",
        "editorialMetadata": true
      },
      {
        "file": "Palmentuin Paramaribo- Suriname.jpg",
        "author": "Pinkgirl Didi",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "subject": "Palmentuin palm garden in the historic centre of Paramaribo, Suriname.",
        "editorialMetadata": true
      }
    ],
    "country-py": [
      {
        "file": "PMa 000004 PY Trinidad.jpg",
        "author": "PMRMaeyaert (Paul M. R. Maeyaert)",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Architectural remains of the Jesuit mission at Trinidad, Paraguay.",
        "editorialMetadata": true
      },
      {
        "file": "Paraguay - Church ruins, Jesuit Mission of Jesús de Tavarangüé.jpg",
        "author": "P. Hughes",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "subject": "Church ruins at the Jesuit Mission of Jesús de Tavarangüé in Paraguay.",
        "editorialMetadata": true
      }
    ],
    "country-uy": [
      {
        "file": "Colonia del Sacramento 2016 004.jpg",
        "author": "Mike Peel",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "The lighthouse at Colonia del Sacramento, Uruguay, built on the ruins of the San Francisco Convent.",
        "editorialMetadata": true
      },
      {
        "file": "Uruguay - Colonia del Sacramento 05.jpg",
        "author": "P. Hughes",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "subject": "Basílica del Santísimo Sacramento in Colonia del Sacramento, Uruguay.",
        "editorialMetadata": true
      }
    ],
    "country-ec": [
      {
        "file": "Galápagos Islands Aerial photograph.JPG",
        "author": "David Adam Kess",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "An aerial view of the Galápagos Islands, Ecuador.",
        "editorialMetadata": true
      },
      {
        "file": "Marine iguana.jpg",
        "author": "Tim Krieger",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Marine iguanas resting on a beach on Isabela Island in the Galápagos, Ecuador.",
        "editorialMetadata": true
      }
    ],
    "country-mg": [
      {
        "file": "The Avenue of the Baobabs in Madagascar near the city of Morondava at sunrise (22).jpg",
        "author": "Hanay",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "The Avenue of the Baobabs near Morondava at sunrise, Madagascar.",
        "editorialMetadata": true
      },
      {
        "file": "Walking the Avenue of the Baobabs.jpg",
        "author": "Gavinevans",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "A walking-level view of the Avenue of the Baobabs, Madagascar.",
        "editorialMetadata": true
      }
    ],
    "country-mu": [
      {
        "file": "Le Morne Brabant.jpg",
        "author": "LisanneD",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Le Morne Brabant mountain in south-west Mauritius.",
        "editorialMetadata": true
      },
      {
        "file": "Le Morne Brabant, Maurizio.jpg",
        "author": "Jolaus",
        "license": "CC0 1.0",
        "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
        "subject": "A separate photograph identified as Le Morne Brabant, Mauritius.",
        "editorialMetadata": true
      }
    ],
    "country-sc": [
      {
        "file": "Coco-fesse de la vallée de Mai (île de Praslin, Seychelles).jpg",
        "author": "Lmulud",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Coco-de-mer fruit in the Vallée de Mai on Praslin, Seychelles.",
        "editorialMetadata": true
      },
      {
        "file": "Valleé de mai at Praslin.jpg",
        "author": "Brocken Inaglory",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Coco-de-mer palms inside Vallée de Mai Nature Reserve, Praslin, Seychelles.",
        "editorialMetadata": true
      }
    ],
    "country-sz": [
      {
        "file": "Mlilwane Wildlife Sanctuary in Eswatini 01.jpg",
        "author": "Bernard Gagnon",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Landscape in Mlilwane Wildlife Sanctuary, Eswatini.",
        "editorialMetadata": true
      },
      {
        "file": "Impala, Mlilwane Wildlife Sanctuary.jpg",
        "author": "Bernard Gagnon",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "A male impala photographed in Mlilwane Wildlife Sanctuary, Eswatini.",
        "editorialMetadata": true
      }
    ],
    "country-ie": [
      {
        "file": "Cliffs of Moher, Ireland 06.jpg",
        "author": "Holger Uwe Schmitt",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Cliffs of Moher in County Clare",
        "editorialMetadata": true
      },
      {
        "file": "Round Tower, Glendalough.jpg",
        "author": "Knocko",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Round tower of the Glendalough monastic settlement, County Wicklow",
        "editorialMetadata": true
      }
    ],
    "country-gb": [
      {
        "file": "20120830 Giant's Causeway.jpg",
        "author": "JoachimKohler-HB",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Basalt formations at Giant's Causeway, Northern Ireland",
        "editorialMetadata": true
      },
      {
        "file": "Snowdonia - Wales.jpg",
        "author": "Sunsetsareawesome",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Snowdonia (Eryri) mountain scenery, Wales",
        "editorialMetadata": true
      }
    ],
    "country-pl": [
      {
        "file": "02021 0762 Main Market Square in Kraków.jpg",
        "author": "Silar",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Main Market Square in Kraków",
        "editorialMetadata": true
      },
      {
        "file": "Poland 2025 594 Tatra National Park.jpg",
        "author": "Scotch Mist",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Małe Ciche village and ski resort near the Tatra Mountains, southern Poland",
        "editorialMetadata": true
      }
    ],
    "country-at": [
      {
        "file": "Hallstatt - Zentrum .JPG",
        "author": "C.Stadler/Bwag",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Hallstatt village centre with Vordere Hirlatz mountain, Upper Austria",
        "editorialMetadata": true
      },
      {
        "file": "Wachau 8432.JPG",
        "author": "Karl Gruber",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Villages and river scenery viewed on a boat journey through the Wachau valley",
        "editorialMetadata": true
      }
    ],
    "country-ch": [
      {
        "file": "Matterhorn 4.jpg",
        "author": "Mike Peel",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "The Matterhorn, Switzerland",
        "editorialMetadata": true
      },
      {
        "file": "Lauterbrunnen 2.jpg",
        "author": "Nashwini",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Lauterbrunnen valley and village, Switzerland",
        "editorialMetadata": true
      }
    ],
    "country-sb": [
      {
        "file": "Solomon Shoreline.jpg",
        "author": "Alex DeCiccio",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Eroding shoreline on Nggatokae Island, Western Province, Solomon Islands",
        "editorialMetadata": true
      },
      {
        "file": "US WWII War Memorial, Honiara, Solomon Islands - 515992409.jpg",
        "author": "David Jones",
        "license": "CC BY 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
        "subject": "US war memorial on Skyline Ridge, Honiara, commemorating the Guadalcanal Campaign",
        "editorialMetadata": true
      }
    ],
    "country-pg": [
      {
        "file": "Mount Hagen Cultural Show, Papua New Guinea, 2009.jpg",
        "author": "Yves Picq",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Performer at the Mount Hagen Cultural Show, Papua New Guinea",
        "editorialMetadata": true
      },
      {
        "file": "Naduri Village 2009.jpg",
        "author": "Arthur Chapman",
        "license": "CC BY 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
        "subject": "Naduri village on the Kokoda Track, Papua New Guinea",
        "editorialMetadata": true
      }
    ],
    "country-ki": [
      {
        "file": "South Tarawa from the air.jpg",
        "author": "Government of Kiribati (employee photographer)",
        "license": "CC BY 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
        "subject": "Aerial view of South Tarawa, a narrow strip between lagoon and ocean, Kiribati",
        "editorialMetadata": true
      },
      {
        "file": "Abaiang, Kiribati (10664706744).jpg",
        "author": "AusAID (Australian Aid Photolibrary)",
        "license": "CC BY 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
        "subject": "Abaiang, Kiribati, in an AusAID climate-adaptation photo",
        "editorialMetadata": true
      }
    ],
    "country-tv": [
      {
        "file": "Tuvalu Funafuti Atoll.JPG",
        "author": "Gabriella Jacobi",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Funafuti Atoll, Tuvalu, photographed in June 2006",
        "editorialMetadata": true
      },
      {
        "file": "Tuvalu - Funafuti - Beach.jpg",
        "author": "Stefan Lins (mrlins)",
        "license": "CC BY 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
        "subject": "Beach on Funafuti Atoll, Tuvalu",
        "editorialMetadata": true
      }
    ],
    "country-fm": [
      {
        "file": "Nan Madol (Pohnpei, Federated States of Micronesia) (9462733000).jpg",
        "author": "Scot Nelson",
        "license": "CC0 1.0",
        "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
        "subject": "Nan Madol archaeological site on Pohnpei, Federated States of Micronesia",
        "editorialMetadata": true
      },
      {
        "file": "Nan Madol megalithic site, Pohnpei (Federated States of Micronesia).jpg",
        "author": "Patrick Nunn",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Stone structures of the Nan Madol megalithic site on Pohnpei",
        "editorialMetadata": true
      }
    ],
    "country-no": [
      {
        "file": "View of the Geirangerfjord from Ørnesvingen.jpg",
        "author": "Yair-haklai",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "View of Geirangerfjord from the Ørnesvingen viewpoint.",
        "editorialMetadata": true
      },
      {
        "file": "Bryggen, Bergen, Norway.jpg",
        "author": "Iain MacFadzean",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Historic Bryggen waterfront buildings in Bergen, Norway, on a misty morning.",
        "editorialMetadata": true
      }
    ],
    "country-fi": [
      {
        "file": "Fortress of Suomenlinna, 2019 (02).jpg",
        "author": "Bahnfrend",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Historic Suomenlinna sea-fortress fortifications near Helsinki.",
        "editorialMetadata": true
      },
      {
        "file": "Koli, Autiovaara ja Pieni Honkavaara.jpg",
        "author": "Tuohirulla",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "The Koli, Autiovaara and Pieni Honkavaara hills in North Karelia, Finland.",
        "editorialMetadata": true
      }
    ],
    "country-ee": [
      {
        "file": "Tallinna vanalinn, Tallinn Old Town.jpg",
        "author": "Hei1972",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Historic Old Town of Tallinn, Estonia.",
        "editorialMetadata": true
      },
      {
        "file": "Wooden walkway in Lahemaa National Park, Estonia.jpg",
        "author": "Hartmut Schmidt Heidelberg",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Wooden boardwalk through Lahemaa National Park in Estonia.",
        "editorialMetadata": true
      }
    ],
    "country-lv": [
      {
        "file": "Riga Castle seen across the river Daugava .jpg",
        "author": "Bjørn Erik Pedersen",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Riga Castle seen from across the Daugava River, Latvia.",
        "editorialMetadata": true
      },
      {
        "file": "Gauja National Park Latvia.jpg",
        "author": "Raul Cortez999",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Landscape in Gauja National Park, Latvia.",
        "editorialMetadata": true
      }
    ],
    "country-lt": [
      {
        "file": "Vilnius Old Town 2024-07-02.jpg",
        "author": "Renata3",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "View of Vilnius Old Town in Lithuania.",
        "editorialMetadata": true
      },
      {
        "file": "The Curonian spit, Lithuania.jpg",
        "author": "Baltictrails",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Coastal landscape of the Curonian Spit in Lithuania.",
        "editorialMetadata": true
      }
    ],
    "country-fj": [
      {
        "file": "Yasawa Islands, Fiji - August 2016.jpg",
        "author": "Rickard Törnblad (Rt26)",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Yasawa Islands seen from a boat in August 2016, Fiji",
        "editorialMetadata": true
      },
      {
        "file": "Bounty Island beach Fiji.jpg",
        "author": "JaredWiltshire",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Beach at Bounty Island in Fiji's Mamanuca Islands",
        "editorialMetadata": true
      }
    ],
    "country-ws": [
      {
        "file": "To Sua Ocean Trench.jpg",
        "author": "Gelu Purcelu",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "To Sua Ocean Trench in Samoa",
        "editorialMetadata": true
      },
      {
        "file": "To Sua Ocean Trench - Lotofaga village - Samoa.jpg",
        "author": "Neil",
        "license": "CC BY 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
        "subject": "To Sua coastal lava-tube swimming hole near Lotofaga, Upolu, Samoa",
        "editorialMetadata": true
      }
    ],
    "country-to": [
      {
        "file": "Haamonga-A-Maui.jpg",
        "author": "Tony Bowden",
        "license": "CC BY-SA 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
        "subject": "Haʻamonga ʻa Maui stone monument in Tonga",
        "editorialMetadata": true
      }
    ],
    "country-vu": [
      {
        "file": "Mt Yasur volcano, Tanna, Vanuatu.JPG",
        "author": "Jocy H",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "View into the active Mount Yasur volcanic crater on Tanna, Vanuatu",
        "editorialMetadata": true
      }
    ],
    "country-pw": [
      {
        "file": "Rock Islands, Palau.jpg",
        "author": "Charles J. Sharp",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Rock Islands of Palau, photographed in March 2026",
        "editorialMetadata": true
      }
    ]
  });
  // Fixed landmark selections from individually read Commons file-description
  // pages. These remain CURRENT-LICENCE-VERIFIED candidates, NOT pixel-reviewed
  // approvals, until the live Commons check succeeds at display time.
  const featuredCities=Object.freeze({
    "tokyo": [
      {
        "file": "2025 Shibuya Crossing at night.jpg",
        "author": "Kakidai",
        "license": "CC BY-SA 4.0",
        "subject": "Shibuya Crossing at night",
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
      },
      {
        "file": "Tokyo Tower 2020.jpg",
        "author": "Jordy Meow",
        "license": "CC BY-SA 3.0",
        "subject": "Illuminated Tokyo Tower",
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
      },
      {
        "file": "Senso-ji.jpg",
        "author": "Felix Filnkössl",
        "license": "CC BY-SA 3.0",
        "subject": "Kaminarimon gate at Sensō-ji in Asakusa",
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
      },
      {
        "file": "Tokyo Skytree 20250831 105130.jpg",
        "author": "Taufik",
        "license": "CC0 1.0",
        "subject": "Tokyo Skytree",
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/"
      }
    ],
    "seoul": [
      {
        "file": "Seoul from Namsan.jpg",
        "author": "kallerna",
        "license": "CC BY-SA 4.0",
        "subject": "Wide view across Seoul from Namsan",
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
      },
      {
        "file": "Panoramic view of Hyangwonjeong Pavilion in its pond at Gyeongbokgung Palace with blue sky in Seoul.jpg",
        "author": "Basile Morin",
        "license": "CC BY-SA 4.0",
        "subject": "Hyangwonjeong Pavilion at Gyeongbokgung Palace",
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
      },
      {
        "file": "Traditional hanok houses at golden hour in Bukchon Hanok Village in Seoul.jpg",
        "author": "Basile Morin",
        "license": "CC BY-SA 4.0",
        "subject": "Traditional hanok houses in Bukchon",
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
      },
      {
        "file": "Myeongdong Cathedral 2.jpg",
        "author": "kallerna",
        "license": "CC BY-SA 4.0",
        "subject": "Myeongdong Cathedral",
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
      }
    ],
    "tbilisi": [
      {
        "file": "Old Town and Narikala, Tbilisi.jpg",
        "author": "Saskia Heijltjes",
        "license": "CC BY-SA 2.0",
        "subject": "Old Tbilisi and Narikala at dusk",
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/"
      },
      {
        "file": "Tbilisi - Holy Trinity Cathedral (Sameba) (9458174189).jpg",
        "author": "Andrzej Wójtowicz",
        "license": "CC BY-SA 2.0",
        "subject": "Holy Trinity Cathedral of Tbilisi",
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/"
      },
      {
        "file": "Roofs of the sulfur baths in Tbilisi.jpg",
        "author": "Wowan1978",
        "license": "CC BY-SA 4.0",
        "subject": "Abanotubani sulphur bathhouse rooftops",
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
      },
      {
        "file": "Panorama from Narikala.jpg",
        "author": "Gaeser",
        "license": "CC BY-SA 3.0",
        "subject": "Panorama of Tbilisi from Narikala",
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
      }
    ],
    "singapore": [
      {
        "file": "Marina Bay Sands.jpeg",
        "author": "Misaochan",
        "license": "CC BY-SA 3.0",
        "subject": "Marina Bay Sands",
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/"
      },
      {
        "file": "Gardens-by-the-bay.jpg",
        "author": "Nightcrafter",
        "license": "CC BY-SA 4.0",
        "subject": "Supertree Grove at Gardens by the Bay",
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
      },
      {
        "file": "Chinatown Singapore.jpg",
        "author": "Supersusage",
        "license": "CC BY-SA 4.0",
        "subject": "A street in Singapore's Chinatown",
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
      },
      {
        "file": "The Jewel, Singapore (IMG 20230827 155118).jpg",
        "author": "Matti Blume",
        "license": "CC BY-SA 4.0",
        "subject": "Jewel Changi Airport",
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
      }
    ]
  });
  // Paris and New York: further exact Commons source-checked landmark sets.
  // The runtime revalidates each file's current licence and author.
  const featuredCitiesB=Object.freeze({
    "paris": [
      {
        "file": "Eiffel Tower from Trocadero-2026-07-msu--.jpg",
        "author": "Matthias Süßen",
        "license": "CC BY-SA 4.0",
        "subject": "Eiffel Tower viewed from the Trocadéro",
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
      },
      {
        "file": "Panorama of the Musée du Louvre.jpg",
        "author": "DiscoA340",
        "license": "CC BY-SA 4.0",
        "subject": "Panorama of the Louvre from the Tuileries",
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
      },
      {
        "file": "Montmartre - Paris1.jpg",
        "author": "Stavros Argyropoulos",
        "license": "CC BY-SA 2.0",
        "subject": "Montmartre in Paris",
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/"
      },
      {
        "file": "Notre Dame Cathedral, Paris.jpg",
        "author": "Feramasa55",
        "license": "CC BY-SA 4.0",
        "subject": "Notre-Dame cathedral in Paris",
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
      }
    ],
    "newyork": [
      {
        "file": "New York City, Skyline.jpg",
        "author": "Davidswiki",
        "license": "CC BY-SA 4.0",
        "subject": "New York skyline and Lower Manhattan",
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
      },
      {
        "file": "Brooklyn Bridge at Night taken from Brooklyn Bridge Park.jpg",
        "author": "John Rakis",
        "license": "CC BY-SA 4.0",
        "subject": "Brooklyn Bridge illuminated at night",
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
      },
      {
        "file": "Central Park New York.jpg",
        "author": "Juan Francisco Contreras Fernández",
        "license": "CC BY-SA 4.0",
        "subject": "Central Park in New York",
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/"
      },
      {
        "file": "Times Square at night 2014.jpg",
        "author": "Andrés Nieto Porras",
        "license": "CC BY-SA 2.0",
        "subject": "Times Square at night",
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/"
      }
    ]
  });
  // Hong Kong and Sydney: eight exact Wikimedia Commons file pages checked
  // against current page descriptions, original source sizes and CC authors.
  // These are metadata-verified candidates, not full pixel-review approvals.
  const featuredCitiesC=Object.freeze({
    "hongkong": [
      {
        "file": "Hong Kong as seen from Victoria Peak.jpg",
        "author": "Choinowski",
        "license": "CC BY-SA 4.0",
        "subject": "Hong Kong skyline from Victoria Peak",
        "width": 5384,
        "height": 3589,
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "reviewStatus": "exact Commons file page verified 2026-10-24; live Commons imageinfo checks before display; image pixels not independently accepted"
      },
      {
        "file": "Star Ferry ships at Hong Kong.jpg",
        "author": "Dudva",
        "license": "CC BY-SA 4.0",
        "subject": "Star Ferry boats crossing Victoria Harbour",
        "width": 3033,
        "height": 1926,
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "reviewStatus": "exact Commons file page verified 2026-10-24; live Commons imageinfo checks before display; image pixels not independently accepted"
      },
      {
        "file": "Hong Kong tram 110.jpg",
        "author": "Mike Peel (www.mikepeel.net)",
        "license": "CC BY-SA 4.0",
        "subject": "Traditional double-decker Hong Kong tram",
        "width": 3456,
        "height": 5184,
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "reviewStatus": "exact Commons file page verified 2026-10-24; live Commons imageinfo checks before display; image pixels not independently accepted"
      },
      {
        "file": "Tian Tan Buddha, Hong Kong.jpg",
        "author": "DestinationFearFan",
        "license": "CC BY-SA 4.0",
        "subject": "Tian Tan Buddha on Lantau Island",
        "width": 2448,
        "height": 3264,
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "reviewStatus": "exact Commons file page verified 2026-10-24; live Commons imageinfo checks before display; image pixels not independently accepted"
      }
    ],
    "sydney": [
      {
        "file": "Sydney skyline at dusk - Dec 2008.jpg",
        "author": "David Iliff (Diliff)",
        "license": "CC BY-SA 3.0",
        "subject": "Sydney Harbour and Opera House skyline at dusk",
        "width": 2500,
        "height": 990,
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "reviewStatus": "exact Commons file page verified 2026-10-24; live Commons imageinfo checks before display; image pixels not independently accepted"
      },
      {
        "file": "Sydney Opera House from ferry.jpg",
        "author": "Chris Mitchell (LeicesterChris)",
        "license": "CC BY-SA 4.0",
        "subject": "Sydney Opera House seen from the ferry",
        "width": 3508,
        "height": 2367,
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "reviewStatus": "exact Commons file page verified 2026-10-24; live Commons imageinfo checks before display; image pixels not independently accepted"
      },
      {
        "file": "Sydney - Harbour Bridge.jpg",
        "author": "Codex",
        "license": "CC BY-SA 4.0",
        "subject": "Sydney Harbour Bridge from the Opera House",
        "width": 3264,
        "height": 1836,
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "reviewStatus": "exact Commons file page verified 2026-10-24; live Commons imageinfo checks before display; image pixels not independently accepted"
      },
      {
        "file": "Bondi Beach - 2009.JPG",
        "author": "Dr-Victor-von-Doom",
        "license": "CC BY-SA 4.0",
        "subject": "Bondi Beach and Sydney's Pacific coastline",
        "width": 4752,
        "height": 3168,
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "reviewStatus": "exact Commons file page verified 2026-10-24; live Commons imageinfo checks before display; image pixels not independently accepted"
      }
    ]
  });
  // Shanghai and Beijing photo pages checked against current Commons source,
  // authors, CC licence and >=2048px original widths. Do not confuse source
  // verification with visual pixel-by-pixel approval.
  const featuredCitiesD=Object.freeze({
    "shanghai": [
      {
        "file": "The Bund Shanghai.jpg",
        "author": "Mattias Hill",
        "license": "CC BY-SA 4.0",
        "subject": "The Bund and Shanghai night skyline",
        "width": 6000,
        "height": 4000,
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "reviewStatus": "exact Commons file description checked 2026-10-24; source resolution and licence recorded; current Commons metadata required at display time; pixel-level approval pending"
      },
      {
        "file": "Shanghai Yu Garden.jpg",
        "author": "钉钉",
        "license": "CC BY-SA 4.0",
        "subject": "Yu Garden traditional architecture in Shanghai",
        "width": 4000,
        "height": 3000,
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "reviewStatus": "exact Commons file description checked 2026-10-24; source resolution and licence recorded; current Commons metadata required at display time; pixel-level approval pending"
      },
      {
        "file": "Oriental Pearl Tower Shanghai 1.jpg",
        "author": "kallerna",
        "license": "CC BY-SA 4.0",
        "subject": "Oriental Pearl Tower in Pudong",
        "width": 3980,
        "height": 5500,
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "reviewStatus": "exact Commons file description checked 2026-10-24; source resolution and licence recorded; current Commons metadata required at display time; pixel-level approval pending"
      },
      {
        "file": "East Nanjing road Shanghai.jpg",
        "author": "kallerna",
        "license": "CC BY-SA 4.0",
        "subject": "East Nanjing Road shopping street",
        "width": 4300,
        "height": 2420,
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "reviewStatus": "exact Commons file description checked 2026-10-24; source resolution and licence recorded; current Commons metadata required at display time; pixel-level approval pending"
      }
    ],
    "beijing": [
      {
        "file": "Forbidden City, Beijing.jpg",
        "author": "World3000",
        "license": "CC BY-SA 3.0",
        "subject": "The Forbidden City imperial palace in Beijing",
        "width": 4000,
        "height": 3000,
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "reviewStatus": "exact Commons file description checked 2026-10-24; source resolution and licence recorded; current Commons metadata required at display time; pixel-level approval pending"
      },
      {
        "file": "Temple-of-heaven.jpg",
        "author": "Khushwant8693",
        "license": "CC BY-SA 4.0",
        "subject": "Temple of Heaven in Beijing",
        "width": 4032,
        "height": 3024,
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "reviewStatus": "exact Commons file description checked 2026-10-24; source resolution and licence recorded; current Commons metadata required at display time; pixel-level approval pending"
      },
      {
        "file": "Summer Palace, Beijing.jpg",
        "author": "Lettucecup",
        "license": "CC BY-SA 4.0",
        "subject": "Beijing Summer Palace gardens and lake",
        "width": 4000,
        "height": 3000,
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "reviewStatus": "exact Commons file description checked 2026-10-24; source resolution and licence recorded; current Commons metadata required at display time; pixel-level approval pending"
      },
      {
        "file": "Old districts 'hutong' in Beijing.jpg",
        "author": "Ekaterina Kvelidze",
        "license": "CC BY-SA 4.0",
        "subject": "Historic Beijing hutong streets",
        "width": 4032,
        "height": 3024,
        "editorialMetadata": true,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "reviewStatus": "exact Commons file description checked 2026-10-24; source resolution and licence recorded; current Commons metadata required at display time; pixel-level approval pending"
      }
    ]
  });
  // Independently checked file-page metadata for six additional cities.
  // These source records remain subject to current Commons licence validation;
  // a reviewed description is not the same as human-reviewed image pixels.
  const featuredCitiesE=Object.freeze({
    "kyoto": [
      {
        "file": "Kyoto Fushimi Inari-taisha 1.jpg",
        "author": "Zairon",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Fushimi Inari shrine",
        "width": 4364,
        "height": 2888,
        "editorialMetadata": true,
        "reviewStatus": "Commons exact-file page, creator, CC licence, subject and original pixel dimensions checked on 2026-10-24; current metadata verified again in browser; image pixels not visually approved"
      },
      {
        "file": "JAP Kyoto Kiyomizu-dera.jpg",
        "author": "Grueslayer",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Kiyomizu-dera temple hall",
        "width": 4320,
        "height": 3240,
        "editorialMetadata": true,
        "reviewStatus": "Commons exact-file page, creator, CC licence, subject and original pixel dimensions checked on 2026-10-24; current metadata verified again in browser; image pixels not visually approved"
      },
      {
        "file": "Kyoto Gion 01.jpg",
        "author": "Zairon",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Traditional Gion quarter",
        "width": 4592,
        "height": 2965,
        "editorialMetadata": true,
        "reviewStatus": "Commons exact-file page, creator, CC licence, subject and original pixel dimensions checked on 2026-10-24; current metadata verified again in browser; image pixels not visually approved"
      },
      {
        "file": "Bamboo forest arashiyama.jpg",
        "author": "Helito",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Arashiyama bamboo forest",
        "width": 3264,
        "height": 2448,
        "editorialMetadata": true,
        "reviewStatus": "Commons exact-file page, creator, CC licence, subject and original pixel dimensions checked on 2026-10-24; current metadata verified again in browser; image pixels not visually approved"
      }
    ],
    "rome": [
      {
        "file": "Rome colosseum.jpg",
        "author": "Alexander Popkov (engineerontour.com)",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Colosseum in Rome",
        "width": 5472,
        "height": 3648,
        "editorialMetadata": true,
        "reviewStatus": "Commons exact-file page, creator, CC licence, subject and original pixel dimensions checked on 2026-10-24; current metadata verified again in browser; image pixels not visually approved"
      },
      {
        "file": "Trevi Fountain 1 - Rome.jpg",
        "author": "NikonZ7II",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Trevi Fountain",
        "width": 8792,
        "height": 5752,
        "editorialMetadata": true,
        "reviewStatus": "Commons exact-file page, creator, CC licence, subject and original pixel dimensions checked on 2026-10-24; current metadata verified again in browser; image pixels not visually approved"
      },
      {
        "file": "The Pantheon, Rome.jpg",
        "author": "Sanjib Chaudhary",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Pantheon in Rome",
        "width": 4000,
        "height": 3000,
        "editorialMetadata": true,
        "reviewStatus": "Commons exact-file page, creator, CC licence, subject and original pixel dimensions checked on 2026-10-24; current metadata verified again in browser; image pixels not visually approved"
      },
      {
        "file": "Roman Forum in Rome.jpg",
        "author": "Stefano Costantini",
        "license": "CC BY-SA 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
        "subject": "Roman Forum archaeological site",
        "width": 3264,
        "height": 2456,
        "editorialMetadata": true,
        "reviewStatus": "Commons exact-file page, creator, CC licence, subject and original pixel dimensions checked on 2026-10-24; current metadata verified again in browser; image pixels not visually approved"
      }
    ],
    "istanbul": [
      {
        "file": "Hagia Sophia and Blue Mosque.jpg",
        "author": "Husain007",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Hagia Sophia and Blue Mosque panorama",
        "width": 8022,
        "height": 1736,
        "editorialMetadata": true,
        "reviewStatus": "Commons exact-file page, creator, CC licence, subject and original pixel dimensions checked on 2026-10-24; current metadata verified again in browser; image pixels not visually approved"
      },
      {
        "file": "İstanbul Galata Kulesi.jpg",
        "author": "OkanKeskin",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Galata Tower",
        "width": 6016,
        "height": 4000,
        "editorialMetadata": true,
        "reviewStatus": "Commons exact-file page, creator, CC licence, subject and original pixel dimensions checked on 2026-10-24; current metadata verified again in browser; image pixels not visually approved"
      },
      {
        "file": "Bosphorus Bridge at night.jpg",
        "author": "Andrey Filippov 安德烈",
        "license": "CC BY 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
        "subject": "Bosphorus Bridge at night",
        "width": 5760,
        "height": 3840,
        "editorialMetadata": true,
        "reviewStatus": "Commons exact-file page, creator, CC licence, subject and original pixel dimensions checked on 2026-10-24; current metadata verified again in browser; image pixels not visually approved"
      },
      {
        "file": "Grand Bazaar, Istanbul.jpg",
        "author": "Gah341",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Lanterns in the Grand Bazaar",
        "width": 3024,
        "height": 4032,
        "editorialMetadata": true,
        "reviewStatus": "Commons exact-file page, creator, CC licence, subject and original pixel dimensions checked on 2026-10-24; current metadata verified again in browser; image pixels not visually approved"
      }
    ],
    "barcelona": [
      {
        "file": "Park Güell - view of Sagrada Familia.jpg",
        "author": "Joe Mabel",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Sagrada Família from Parc Güell",
        "width": 6000,
        "height": 4000,
        "editorialMetadata": true,
        "reviewStatus": "Commons exact-file page, creator, CC licence, subject and original pixel dimensions checked on 2026-10-24; current metadata verified again in browser; image pixels not visually approved"
      },
      {
        "file": "Parc Güell Barcelona.JPG",
        "author": "Steven Lek",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Mosaic architecture at Parc Güell",
        "width": 4608,
        "height": 3072,
        "editorialMetadata": true,
        "reviewStatus": "Commons exact-file page, creator, CC licence, subject and original pixel dimensions checked on 2026-10-24; current metadata verified again in browser; image pixels not visually approved"
      },
      {
        "file": "Casa Batlló, Barcelona.jpg",
        "author": "Teodoir",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Casa Batlló facade",
        "width": 4032,
        "height": 3024,
        "editorialMetadata": true,
        "reviewStatus": "Commons exact-file page, creator, CC licence, subject and original pixel dimensions checked on 2026-10-24; current metadata verified again in browser; image pixels not visually approved"
      },
      {
        "file": "Gothic Quarter, Barcelona (1) (30884069420).jpg",
        "author": "Richard Mortel",
        "license": "CC BY 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
        "subject": "Barcelona Gothic Quarter",
        "width": 6000,
        "height": 4000,
        "editorialMetadata": true,
        "reviewStatus": "Commons exact-file page, creator, CC licence, subject and original pixel dimensions checked on 2026-10-24; current metadata verified again in browser; image pixels not visually approved"
      }
    ],
    "venice": [
      {
        "file": "Grand Canal from Rialto Bridge.jpg",
        "author": "aconcagua",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Grand Canal viewed from Rialto Bridge",
        "width": 4000,
        "height": 2664,
        "editorialMetadata": true,
        "reviewStatus": "Commons exact-file page, creator, CC licence, subject and original pixel dimensions checked on 2026-10-24; current metadata verified again in browser; image pixels not visually approved"
      },
      {
        "file": "St. Mark's Basilica, St Mark's Square, Venice, Italy.jpg",
        "author": "Vyacheslav Argenberg",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "subject": "St Mark's Basilica and Piazza San Marco",
        "width": 3072,
        "height": 2048,
        "editorialMetadata": true,
        "reviewStatus": "Commons exact-file page, creator, CC licence, subject and original pixel dimensions checked on 2026-10-24; current metadata verified again in browser; image pixels not visually approved"
      },
      {
        "file": "Bridge of Sighs Venice.jpg",
        "author": "Ahmer Jamil Khan",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Bridge of Sighs",
        "width": 3024,
        "height": 4032,
        "editorialMetadata": true,
        "reviewStatus": "Commons exact-file page, creator, CC licence, subject and original pixel dimensions checked on 2026-10-24; current metadata verified again in browser; image pixels not visually approved"
      },
      {
        "file": "Gondolas, Venice, Italy.jpg",
        "author": "Vyacheslav Argenberg",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "subject": "Traditional gondolas at the waterfront",
        "width": 3072,
        "height": 2048,
        "editorialMetadata": true,
        "reviewStatus": "Commons exact-file page, creator, CC licence, subject and original pixel dimensions checked on 2026-10-24; current metadata verified again in browser; image pixels not visually approved"
      }
    ],
    "dubrovnik": [
      {
        "file": "Dubrovnik Old Town 1.jpg",
        "author": "kallerna",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Dubrovnik Old Town panoramic view",
        "width": 5100,
        "height": 3140,
        "editorialMetadata": true,
        "reviewStatus": "Commons exact-file page, creator, CC licence, subject and original pixel dimensions checked on 2026-10-24; current metadata verified again in browser; image pixels not visually approved"
      },
      {
        "file": "Dubrovnik City Walls.jpg",
        "author": "Sumitsurai",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Dubrovnik city walls",
        "width": 5704,
        "height": 3064,
        "editorialMetadata": true,
        "reviewStatus": "Commons exact-file page, creator, CC licence, subject and original pixel dimensions checked on 2026-10-24; current metadata verified again in browser; image pixels not visually approved"
      },
      {
        "file": "Dubrovnik - Stradun.jpg",
        "author": "Jean-Christophe BENOIST",
        "license": "CC BY 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
        "subject": "Stradun historic pedestrian street",
        "width": 3461,
        "height": 4711,
        "editorialMetadata": true,
        "reviewStatus": "Commons exact-file page, creator, CC licence, subject and original pixel dimensions checked on 2026-10-24; current metadata verified again in browser; image pixels not visually approved"
      },
      {
        "file": "Dubrovnik Old Town From Minčeta Tower.jpg",
        "author": "Sumitsurai",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Dubrovnik Old Town from Minčeta Tower",
        "width": 4000,
        "height": 5648,
        "editorialMetadata": true,
        "reviewStatus": "Commons exact-file page, creator, CC licence, subject and original pixel dimensions checked on 2026-10-24; current metadata verified again in browser; image pixels not visually approved"
      }
    ]
  });
  // Bangkok's four contrasting source-reviewed Commons photographs.
  const featuredCitiesF=Object.freeze({
    "bangkok": [
      {
        "file": "Grand Palace Bangkok, Thailand.jpg",
        "author": "Andy Marchand",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Grand Palace complex in Bangkok",
        "width": 6158,
        "height": 3464,
        "editorialMetadata": true,
        "reviewStatus": "Exact Commons file page, author, declared licence, subject and original resolution checked 2026-10-24; current metadata verified again when displayed, pixel-level acceptance pending"
      },
      {
        "file": "Wat Arun Bangkok ,Thailand.jpg",
        "author": "SupawatR",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Wat Arun temple near sunset",
        "width": 5472,
        "height": 3648,
        "editorialMetadata": true,
        "reviewStatus": "Exact Commons file page, author, declared licence, subject and original resolution checked 2026-10-24; current metadata verified again when displayed, pixel-level acceptance pending"
      },
      {
        "file": "Chao Phraya River in Bangkok 01.jpg",
        "author": "Krzysztof Golik",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Chao Phraya River through Bangkok",
        "width": 3964,
        "height": 2643,
        "editorialMetadata": true,
        "reviewStatus": "Exact Commons file page, author, declared licence, subject and original resolution checked 2026-10-24; current metadata verified again when displayed, pixel-level acceptance pending"
      },
      {
        "file": "Bangkok-Chinatown-14-Einkaufstrasse-1976-gje.jpg",
        "author": "Gerd Eichmann",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Historic shopping street in Bangkok Chinatown, 1976",
        "width": 2311,
        "height": 2379,
        "editorialMetadata": true,
        "reviewStatus": "Exact Commons file page, author, declared licence, subject and original resolution checked 2026-10-24; current metadata verified again when displayed, pixel-level acceptance pending"
      }
    ]
  });
  // Machine-discovered Wikipedia-article-associated Commons files, never
  // marked as visually reviewed. Runtime validation checks current CC rights.
  function discoveredFor(id){
    const index=typeof window==='object'?window.RevisionWorldDiscoveryPhotos:null;
    return Array.isArray(index?.[id])?index[id]:[];
  }
  // Country photographs may also depict a separately purchaseable exact
  // landmark. Reuse ONLY explicitly inspected matches, never nearby towns
  // or similarly named sites. Each file keeps the original Commons credits.
  const exactDestinationReuse=Object.freeze({
    "machupicchu": [
      [
        "country-pe",
        "Machu Picchu, Peru - Laslovarga (107).jpg"
      ]
    ],
    "prague": [
      [
        "country-cz",
        "Charles Bridge-Prague-4.jpg"
      ],
      [
        "country-cz",
        "Astronomical Clock Prague (20190520 120955).jpg"
      ]
    ],
    "athens": [
      [
        "country-gr",
        "Erechtheion Acropolis Athens.jpg"
      ]
    ],
    "budapest": [
      [
        "country-hu",
        "Hungarian Parliament Building, Budapest, Hungary.jpg"
      ],
      [
        "country-hu",
        "Buda Castle the BHM IMG 1043.jpg"
      ]
    ],
    "luxor": [
      [
        "country-eg",
        "Karnak Hypostyle Hall R02.jpg"
      ]
    ],
    "zanzibar": [
      [
        "country-tz",
        "Stone town -Zanzibar.jpg"
      ]
    ],
    "victoriafalls": [
      [
        "country-zm",
        "Victoria falls, zambia.jpg"
      ],
      [
        "country-zm",
        "VicFalls.jpg"
      ],
      [
        "country-zw",
        "Victoria Falls, Zimbabwe 04.jpg"
      ]
    ],
    "sossusvlei": [
      [
        "country-na",
        "Sossusvlei namib desert.jpg"
      ],
      [
        "country-na",
        "Landscape Sossusvlei, Namibia.jpg"
      ]
    ],
    "antiguaguatemala": [
      [
        "country-gt",
        "Arco de Santa Catalina.jpg"
      ]
    ],
    "panamacity": [
      [
        "country-pa",
        "Miraflores Locks Panama Canal.jpg"
      ],
      [
        "country-pa",
        "Casco Viejo, Panamá.jpg"
      ]
    ],
    "banff": [
      [
        "country-ca",
        "Banff National Park landscape.jpg"
      ]
    ],
    "torres": [
      [
        "country-cl",
        "National park Torres del Paine, Chile.jpg"
      ],
      [
        "country-cl",
        "Torres del Paine. Chile..JPG"
      ]
    ],
    "peritomoreno": [
      [
        "country-ar",
        "Argentina - Perito Moreno Glacier 02.jpg"
      ],
      [
        "country-ar",
        "Trekking at Perito Moreno Glacier.jpg"
      ]
    ],
    "okavango": [
      [
        "country-bw",
        "Okavango Delta.jpg"
      ],
      [
        "country-bw",
        "Okavango Delta, Botswana (2674373339).jpg"
      ]
    ],
    "uyuni": [
      [
        "country-bo",
        "Bolivia - Salar de Uyuni - Wiki Commons.jpg"
      ],
      [
        "country-bo",
        "SAL - Salt piles on Salar de Uyuni, Bolivia, 2013.jpg"
      ]
    ],
    "bergen": [
      [
        "country-no",
        "Bryggen, Bergen, Norway.jpg"
      ]
    ],
    "ljubljana": [
      [
        "country-si",
        "Triple Bridge, Ljubljana.jpg"
      ]
    ],
    "chefchaouen": [
      [
        "country-ma",
        "Chefchaouen.JPG"
      ]
    ],
    "granada": [
      [
        "country-es",
        "Alhambra from Generalife (2017).jpg"
      ],
      [
        "country-es",
        "-Alhambra-.jpg"
      ]
    ],
    "krakow": [
      [
        "country-pl",
        "02021 0762 Main Market Square in Kraków.jpg"
      ]
    ],
    "tallinn": [
      [
        "country-ee",
        "Tallinna vanalinn, Tallinn Old Town.jpg"
      ]
    ],
    "vilnius": [
      [
        "country-lt",
        "Vilnius Old Town 2024-07-02.jpg"
      ]
    ]
  });
  function reusedFor(id){
    return (exactDestinationReuse[id]||[]).flatMap(([sourceId,file])=>
      [...(editorial[sourceId]||[]),...(additionalEditorialA[sourceId]||[]),...(additionalEditorialB[sourceId]||[])]
      .filter(item=>item.file===file));
  }
  // Directly read Commons File: pages across all six inhabited continents.
  // These are source/metadata-checked, NOT pixel-level visual approvals.
  const independentlySourced=Object.freeze({
    "hanoi": [
      {
        "file": "Hanoi Panoramic.jpg",
        "author": "Ilovemcribs",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "subject": "Panorama of Hanoi",
        "width": 9332,
        "height": 3862,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ],
    "vancouver": [
      {
        "file": "Skyline of Vancouver, BC.jpg",
        "author": "Quintin Soloviev",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "subject": "Vancouver downtown skyline",
        "width": 6662,
        "height": 4442,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      },
      {
        "file": "Skyline of Vancouver, Canada.jpg",
        "author": "Quintin Soloviev",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "subject": "Aerial Vancouver skyline",
        "width": 7302,
        "height": 4381,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ],
    "petra": [
      {
        "file": "Petra, Jordan -The Treasury.JPG",
        "author": "Davidchocron",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Al-Khazneh Treasury at Petra",
        "width": 5184,
        "height": 3456,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ],
    "rio": [
      {
        "file": "Christ-Redeemer-Rio-de-Janeiro.jpg",
        "author": "acediscovery",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "subject": "Christ the Redeemer in Rio de Janeiro",
        "width": 3200,
        "height": 2400,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ],
    "capetown": [
      {
        "file": "Table mountain in Cape Town.jpg",
        "author": "Shoodho",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Table Mountain above Cape Town",
        "width": 3468,
        "height": 4624,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ],
    "cusco": [
      {
        "file": "Plaza de Armas Cusco.jpg",
        "author": "Yanela Sharumi Ccalluco Vargas",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Plaza de Armas in central Cusco",
        "width": 4080,
        "height": 3060,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ],
    "uluru": [
      {
        "file": "Uluru Australia.jpg",
        "author": "Kate Branch",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Uluru sandstone monolith",
        "width": 3092,
        "height": 3100,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ],
    "iguazu": [
      {
        "file": "Iguazu Falls, Argentina.JPG",
        "author": "Flauta",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Iguazu Falls from Argentina",
        "width": 3648,
        "height": 2736,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ],
    "marrakech": [
      {
        "file": "Djemaa el Fna Marrakesch.jpg",
        "author": "Herbert wie",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Jemaa el-Fnaa square Marrakesh",
        "width": 3089,
        "height": 2048,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      },
      {
        "file": "Marrakesh, Djemaa el Fna in the evening (js).jpg",
        "author": "Jerzy Strzelecki",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Jemaa el-Fnaa in the evening",
        "width": 5610,
        "height": 3658,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ],
    "yellowstone": [
      {
        "file": "Yellowstone Grand Prismatic.jpg",
        "author": "David L. Sifry",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Grand Prismatic Spring, Yellowstone",
        "width": 4368,
        "height": 2056,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ],
    "grandcanyon": [
      {
        "file": "The Grand Canyon, Arizona.jpg",
        "author": "Paxson Woelber",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "South Rim panorama of the Grand Canyon",
        "width": 5256,
        "height": 2253,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ],
    "edinburgh": [
      {
        "file": "Edinburgh Castle seen from The Vennel steps.jpg",
        "author": "Aneza Palaiou",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Edinburgh Castle seen from the Vennel",
        "width": 3967,
        "height": 5950,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ],
    "chichenitza": [
      {
        "file": "Chichen Itzá Pyramide.jpg",
        "author": "Genius9423",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Temple of Kukulcan at Chichen Itza",
        "width": 2448,
        "height": 3264,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      },
      {
        "file": "Chichen-Itza.jpg",
        "author": "Berenice Lara Ramírez",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "El Castillo pyramid at Chichen Itza",
        "width": 3956,
        "height": 2967,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ],
    "melbourne": [
      {
        "file": "City Skyline of Melbourne.jpg",
        "author": "李沛钊",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Melbourne modern skyline",
        "width": 4030,
        "height": 2267,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      },
      {
        "file": "Skylinemelbourne2026.jpg",
        "author": "Celco85",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Melbourne skyline in 2026",
        "width": 3487,
        "height": 1898,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ],
    "toronto": [
      {
        "file": "Toronto-skyline.jpg",
        "author": "Daynarama",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Toronto skyline with CN Tower",
        "width": 3198,
        "height": 2116,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ],
    "auckland": [
      {
        "file": "AucklandCBD2026.jpg",
        "author": "ThomasNiuNiu",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Auckland skyline from Mount Victoria",
        "width": 4096,
        "height": 1864,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ],
    "galapagos": [
      {
        "file": "Galápagos giant tortoise.jpg",
        "author": "Mary Farnkoff",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Giant tortoise photographed on the Galápagos Islands",
        "width": 6736,
        "height": 5389,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      },
      {
        "file": "Giant tortoise of the galapagos islands.jpg",
        "author": "FelixReyesPhotography",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Galápagos giant tortoise in its habitat",
        "width": 4259,
        "height": 2989,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ],
    "lisbon": [
      {
        "file": "Lisboa, tranvía 28.jpg",
        "author": "LBM1948",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Historic Lisbon tram 28",
        "width": 2765,
        "height": 4223,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ],
    "dublin": [
      {
        "file": "Dublin - Trinity College Dublin.jpeg",
        "author": "Thoslee",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Trinity College Dublin historic buildings",
        "width": 4096,
        "height": 3072,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ],
    "angkor": [
      {
        "file": "Sunrise at Angkor Wat Cambodia.jpg",
        "author": "Vladimir Pankratov",
        "license": "CC BY-SA 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
        "subject": "Sunrise at Angkor Wat",
        "width": 4896,
        "height": 3264,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ],
    "greatbarrier": [
      {
        "file": "Great barrière reef.jpg",
        "author": "Mohesa83",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Coral and tropical reef fish in the Great Barrier Reef",
        "width": 3264,
        "height": 2448,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ],
    "dubai": [
      {
        "file": "Dubai Burj Khalifa.jpg",
        "author": "Bahaa aldien",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Burj Khalifa viewed from Dubai marina water",
        "width": 3000,
        "height": 4000,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ],
    "cairo": [
      {
        "file": "Cairo skyline, Nile River, Egypt.jpg",
        "author": "Vyacheslav Argenberg",
        "license": "CC BY 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
        "subject": "Cairo skyline beside the Nile River",
        "width": 3072,
        "height": 2048,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ],
    "nairobi": [
      {
        "file": "Nairobi skyline P1000021.jpg",
        "author": "Lmwangi",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Nairobi city skyline",
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ],
    "reykjavik": [
      {
        "file": "Reykjavik from Hallgrimskikrja.jpg",
        "author": "Wa17gs",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Reykjavík city skyline viewed from Hallgrímskirkja",
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons file page reviewed for depicted subject, photographer, CC licence and original resolution on 2026-10-24; actual rendered image awaits independent visual review and current file-level licence verification"
      }
    ]
  });
  // Explicit cross-linking only where a photograph depicts a landmark that
  // IS in the corresponding country. Never perform country-name fuzzy matching.
  // Copies are provisional and MUST pass CURRENT Commons CC validation even if
  // the source city had a pixel-reviewed featured selection.
  const nationalLandmarks=Object.freeze({
    "country-au": [
      [
        "sydney",
        "Sydney skyline at dusk - Dec 2008.jpg"
      ],
      [
        "uluru",
        "Uluru Australia.jpg"
      ],
      [
        "greatbarrier",
        "Great barrière reef.jpg"
      ],
      [
        "melbourne",
        "City Skyline of Melbourne.jpg"
      ]
    ],
    "country-br": [
      [
        "rio",
        "Christ-Redeemer-Rio-de-Janeiro.jpg"
      ]
    ],
    "country-co": [
      [
        "bogota",
        "Bogota, Colombia (36668708290).jpg"
      ],
      [
        "medellin",
        "Centro de Medellín en dron 04.jpg"
      ],
      [
        "cartagena",
        "Museo Naval del Caribe.JPG"
      ]
    ],
    "country-dk": [
      [
        "copenhagen",
        "2018 - Christiansborg from the Marble Bridge.jpg"
      ],
      [
        "copenhagen",
        "Cityscape and skyline by the Copenhagen Lakes, Denmark - (36018109956).jpg"
      ]
    ],
    "country-ge": [
      [
        "tbilisi",
        "Old Town and Narikala, Tbilisi.jpg"
      ],
      [
        "tbilisi",
        "Tbilisi - Holy Trinity Cathedral (Sameba) (9458174189).jpg"
      ]
    ],
    "country-jm": [
      [
        "montegobay",
        "Montego Bay Photo Don Ramey Logan.jpg"
      ]
    ],
    "country-kh": [
      [
        "angkor",
        "Sunrise at Angkor Wat Cambodia.jpg"
      ]
    ],
    "country-me": [
      [
        "kotor",
        "20090719 Crkva Gospa od Zdravlja Kotor Bay Montenegro.jpg"
      ]
    ],
    "country-mx": [
      [
        "chichenitza",
        "Chichen Itzá Pyramide.jpg"
      ],
      [
        "mexicocity",
        "Panorama of Mexico City from Torre Latinoamericana.jpg"
      ]
    ],
    "country-my": [
      [
        "kualalumpur",
        "Downtown Kuala Lumpur at Night (49125936143).jpg"
      ],
      [
        "kualalumpur",
        "2016 Kuala Lumpur, Park KLCC i Suria KLCC.jpg"
      ]
    ],
    "country-nl": [
      [
        "amsterdam",
        "Amsterdam Cityscape.jpg"
      ],
      [
        "amsterdam",
        "Amsterdam (NL), Begijnhof -- 2015 -- 7215-8.jpg"
      ]
    ],
    "country-nz": [
      [
        "auckland",
        "AucklandCBD2026.jpg"
      ],
      [
        "rotorua",
        "Government Gardens in Rotorua 01.jpg"
      ]
    ],
    "country-ph": [
      [
        "manila",
        "Cityscape of Manila, 2025 (01).jpg"
      ],
      [
        "bohol",
        "Panglao Island Beach.jpg"
      ],
      [
        "coron",
        "Coron - Kayangan Lake.jpg"
      ]
    ],
    "country-se": [
      [
        "stockholm",
        "Royal Dramatic Theatre Stockholm.jpg"
      ]
    ],
    "country-us": [
      [
        "newyork",
        "New York City, Skyline.jpg"
      ],
      [
        "grandcanyon",
        "The Grand Canyon, Arizona.jpg"
      ],
      [
        "yellowstone",
        "Yellowstone Grand Prismatic.jpg"
      ],
      [
        "newyork",
        "Brooklyn Bridge at Night taken from Brooklyn Bridge Park.jpg"
      ]
    ],
    "country-za": [
      [
        "capetown",
        "Table mountain in Cape Town.jpg"
      ]
    ],
    "country-uz": [
      [
        "samarkand",
        "Registan Samarkand.jpg"
      ]
    ],
    "country-cu": [
      [
        "havana",
        "Havana aerial.jpg"
      ],
      [
        "havana",
        "Havana street view.jpg"
      ]
    ],
    "country-ba": [
      [
        "mostar",
        "Stari Most viewed from North.jpg"
      ],
      [
        "sarajevo",
        "Sarajevo City Panorama.JPG"
      ]
    ]
  });
  function nationalSources(id){
    return (nationalLandmarks[id]||[]).flatMap(([placeId,file])=>{
      const direct=[...(verified[placeId]||[]),...(featuredCities[placeId]||[]),...(featuredCitiesB[placeId]||[]),...(featuredCitiesC[placeId]||[]),...(featuredCitiesD[placeId]||[]),...(featuredCitiesE[placeId]||[]),...(featuredCitiesF[placeId]||[]),...(editorial[placeId]||[]),...(additionalEditorialA[placeId]||[]),...(additionalEditorialB[placeId]||[]),...(independentlySourced[placeId]||[]),...reusedFor(placeId),...discoveredFor(placeId)];
      const image=direct.find(photo=>photo.file===file);
      return image?[{...image,editorialMetadata:true,reviewStatus:'Exact nationally located place source, Commons licence rechecked on display; pixels for this national placement not individually inspected'}]:[];
    });
  }
  // File pages individually checked for the final three gaps that search
  // titles did not recover (including genuine sea photographs rather than maps).
  const lastThreePlaceSources=Object.freeze({
    "dakar": [
      {
        "file": "Dakar from above.jpg",
        "author": "Hichammohsen",
        "license": "CC BY-SA 4.0",
        "subject": "Aerial photograph of Dakar's Atlantic coastline and skyline",
        "width": 5184,
        "height": 3456,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons File page checked 2026-10-24 for depicted subject, credited photographer, declared CC licence and original pixel dimensions. Current file rights still rechecked in browser; full image-pixel inspection pending."
      },
      {
        "file": "Dakar vue de haut 04.jpg",
        "author": "Ourytima",
        "license": "CC BY-SA 4.0",
        "subject": "Cityscape of Dakar photographed from above",
        "width": 4080,
        "height": 3060,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons File page checked 2026-10-24 for depicted subject, credited photographer, declared CC licence and original pixel dimensions. Current file rights still rechecked in browser; full image-pixel inspection pending."
      },
      {
        "file": "Dakar, la corniche.jpg",
        "author": "Tbo47",
        "license": "CC0 1.0",
        "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
        "subject": "Dakar's Atlantic coastal Corniche, Senegal",
        "width": 4080,
        "height": 3072,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons File page inspected 2026-10-24 for author, Creative Commons licence, physical destination and original image dimensions. Still subject to live Commons verification and human image-quality review."
      }
    ],
    "country-ag": [
      {
        "file": "Beach in Old Road, Antigua and Barbuda.jpg",
        "author": "AntiguaAndBarbudaMedia",
        "license": "CC BY-SA 4.0",
        "subject": "Carlisle Beach at Old Road in Saint Mary, Antigua and Barbuda",
        "width": 4032,
        "height": 3024,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons File page checked 2026-10-24 for depicted subject, credited photographer, declared CC licence and original pixel dimensions. Current file rights still rechecked in browser; full image-pixel inspection pending."
      }
    ],
    "sea-bering": [
      {
        "file": "Nome Alaska bering sea.jpg",
        "author": "ra64 from Nome, USA",
        "license": "CC BY-SA 2.0",
        "subject": "Open Bering Sea water seen from Nome, Alaska",
        "width": 2256,
        "height": 1496,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons File page checked 2026-10-24 for depicted subject, credited photographer, declared CC licence and original pixel dimensions. Current file rights still rechecked in browser; full image-pixel inspection pending."
      },
      {
        "file": "Bering sea...mar de bering ,alaska - panoramio.jpg",
        "author": "Leo Macias",
        "license": "CC BY-SA 3.0",
        "subject": "Photograph of the Bering Sea coast near Unalaska, Alaska",
        "width": 2576,
        "height": 1932,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons File page checked 2026-10-24 for depicted subject, credited photographer, declared CC licence and original pixel dimensions. Current file rights still rechecked in browser; full image-pixel inspection pending."
      },
      {
        "file": "Bering Sea Ice 2 (8683679273).jpg",
        "author": "Joseph / The Cabin On The Road",
        "license": "CC BY-SA 2.0",
        "subject": "Sea ice near Nome on the Bering Sea coast",
        "width": 2614,
        "height": 1894,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons File page checked 2026-10-24 for depicted subject, credited photographer, declared CC licence and original pixel dimensions. Current file rights still rechecked in browser; full image-pixel inspection pending."
      }
    ],
    "country-iq": [
      {
        "file": "View of Erbil skyline from the Citadel in the Kurdistan Region of Iraq 01.jpg",
        "author": "Levi Clancy",
        "license": "CC BY-SA 4.0",
        "subject": "Erbil city skyline from the ancient Citadel in Iraq",
        "width": 6016,
        "height": 4000,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "editorialMetadata": true,
        "reviewStatus": "Exact Commons file page checked 2026-10-24 for location, author, current CC licence and full-resolution image. Gallery rechecks current metadata; no blanket pixel-level approval."
      },
      {
        "file": "View of the Erbil skyline from the Cristal Hotel in Erbil.jpg",
        "author": "Levi Clancy",
        "license": "CC0 1.0",
        "subject": "Erbil cityscape and skyline in Iraq",
        "width": 5876,
        "height": 3917,
        "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
        "editorialMetadata": true,
        "reviewStatus": "Exact Commons file page checked 2026-10-24 for location, author, current CC licence and full-resolution image. Gallery rechecks current metadata; no blanket pixel-level approval."
      }
    ],
    "country-lr": [
      {
        "file": "Central Monrovia.jpg",
        "author": "Jefferson Krua",
        "license": "CC BY-SA 4.0",
        "subject": "Central Monrovia, Liberia",
        "width": 6000,
        "height": 4000,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "editorialMetadata": true,
        "reviewStatus": "Exact Commons file page checked 2026-10-24 for location, author, current CC licence and full-resolution image. Gallery rechecks current metadata; no blanket pixel-level approval."
      },
      {
        "file": "Monrovia, Liberia - panoramio (65).jpg",
        "author": "blk24ga",
        "license": "CC BY 3.0",
        "subject": "Monrovia city scene in Liberia",
        "width": 4000,
        "height": 3000,
        "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
        "editorialMetadata": true,
        "reviewStatus": "Exact Commons file page checked 2026-10-24 for location, author, current CC licence and full-resolution image. Gallery rechecks current metadata; no blanket pixel-level approval."
      }
    ],
    "country-ne": [
      {
        "file": "Niger, Niamey, Dunes (1), landscape.jpg",
        "author": "Vincent van Zeijst",
        "license": "CC BY-SA 4.0",
        "subject": "Dunes near Niamey in Niger, with Niamey and Niger River in the distance",
        "width": 4288,
        "height": 2848,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "editorialMetadata": true,
        "reviewStatus": "Exact Commons file page checked 2026-10-24 for location, author, current CC licence and full-resolution image. Gallery rechecks current metadata; no blanket pixel-level approval."
      },
      {
        "file": "Niger, Agadez (43), Grand Mosque.jpg",
        "author": "Vincent van Zeijst",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Grand Mosque in historic Agadez, Niger",
        "width": 3264,
        "height": 2448,
        "editorialMetadata": true,
        "reviewStatus": "Commons source page author, exact historic Niger location, licence and resolution checked; no pixel-level inspection claimed"
      },
      {
        "file": "Niger, Agadez (14), scene in the old city.jpg",
        "author": "Vincent van Zeijst",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Historic streets of Agadez in Niger, with the Grand Mosque minaret",
        "width": 3264,
        "height": 2448,
        "editorialMetadata": true,
        "reviewStatus": "Commons source page author, exact historic Niger location, licence and resolution checked; no pixel-level inspection claimed"
      }
    ],
    "sea-red": [
      {
        "file": "Coral Reef, Red Sea.jpg",
        "author": "Menna.Hassan100",
        "license": "CC BY-SA 4.0",
        "subject": "A colourful underwater coral reef in the Red Sea",
        "width": 3000,
        "height": 4000,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "editorialMetadata": true,
        "reviewStatus": "Exact Commons file page checked 2026-10-24 for location, author, current CC licence and full-resolution image. Gallery rechecks current metadata; no blanket pixel-level approval."
      },
      {
        "file": "Red sea underwater coral.jpg",
        "author": "Andrey Korman",
        "license": "CC BY-SA 4.0",
        "subject": "Red Sea underwater coral formations",
        "width": 2304,
        "height": 3072,
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "editorialMetadata": true,
        "reviewStatus": "Exact Commons file page checked 2026-10-24 for location, author, current CC licence and full-resolution image. Gallery rechecks current metadata; no blanket pixel-level approval."
      },
      {
        "file": "Al-Qusayr beach, Red Sea.jpg",
        "author": "Summering2018",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "The Red Sea coastline at Al-Qusayr, Egypt",
        "width": 6197,
        "height": 4426,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons File page inspected 2026-10-24 for author, Creative Commons licence, physical destination and original image dimensions. Still subject to live Commons verification and human image-quality review."
      },
      {
        "file": "Sunset-at redsea shore.jpg",
        "author": "Neurotologist",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Sunset over Egypt's Red Sea shore beneath the Etaka mountains",
        "width": 3264,
        "height": 2448,
        "editorialMetadata": true,
        "reviewStatus": "Exact Wikimedia Commons File page inspected 2026-10-24 for author, Creative Commons licence, physical destination and original image dimensions. Still subject to live Commons verification and human image-quality review."
      }
    ],
    "country-bb": [
      {
        "file": "Bathsheba, Barbados 39.jpg",
        "author": "Postdlf",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Rugged Atlantic coastline at Bathsheba, Barbados",
        "width": 4272,
        "height": 2848,
        "editorialMetadata": true,
        "reviewStatus": "Specific place, author, CC licence and original resolution checked on Commons File page 2026-10-24; current licence reverified at display; not claimed to be image-pixel inspected."
      },
      {
        "file": "Bathsheba, Barbados 45.jpg",
        "author": "Postdlf",
        "license": "CC BY-SA 3.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
        "subject": "Coastal rock formations at Bathsheba on Barbados",
        "width": 4272,
        "height": 2848,
        "editorialMetadata": true,
        "reviewStatus": "Specific place, author, CC licence and original resolution checked on Commons File page 2026-10-24; current licence reverified at display; not claimed to be image-pixel inspected."
      }
    ],
    "lagos": [
      {
        "file": "Lagos skyline.jpg",
        "author": "Clara Sanchiz",
        "license": "CC BY-SA 2.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
        "subject": "Skyline of Lagos, Nigeria, viewed from Victoria Island",
        "width": 3726,
        "height": 1970,
        "editorialMetadata": true,
        "reviewStatus": "Specific place, author, CC licence and original resolution checked on Commons File page 2026-10-24; current licence reverified at display; not claimed to be image-pixel inspected."
      },
      {
        "file": "Mafoluku Oshodi Lagos skyline.jpg",
        "author": "Canih28",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Neighbourhood and urban skyline at Oshodi in Lagos, Nigeria",
        "width": 2560,
        "height": 1920,
        "editorialMetadata": true,
        "reviewStatus": "Specific place, author, CC licence and original resolution checked on Commons File page 2026-10-24; current licence reverified at display; not claimed to be image-pixel inspected."
      }
    ],
    "country-mk": [
      {
        "file": "Ohrid lake, North Macedonia.jpg",
        "author": "MiroJP",
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "subject": "Lake Ohrid and the city of Ohrid in North Macedonia",
        "width": 6000,
        "height": 4000,
        "editorialMetadata": true,
        "reviewStatus": "Specific place, author, CC licence and original resolution checked on Commons File page 2026-10-24; current licence reverified at display; not claimed to be image-pixel inspected."
      },
      {
        "file": "Lake Ohrid.jpg",
        "author": "Markus Bernet",
        "license": "CC BY-SA 2.5",
        "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5/",
        "subject": "Lake Ohrid landscape in North Macedonia",
        "width": 2048,
        "height": 1536,
        "editorialMetadata": true,
        "reviewStatus": "Specific place, author, CC licence and original resolution checked on Commons File page 2026-10-24; current licence reverified at display; not claimed to be image-pixel inspected."
      }
    ]
  });
  // v90: source-checked priority additions. These remain editorial-source entries
  // and REQUIRE current Commons licence verification before any image is displayed.
  const priorityPhotoV90=Object.freeze({
  "country-at": [
    {
      "file": "Schloß Schönbrunn.jpg",
      "author": "Philipp Mayer",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
      "subject": "Schönbrunn Palace in Vienna, Austria",
      "width": 4428,
      "height": 2079,
      "editorialMetadata": true,
      "qualityPriority": 1000,
      "reviewStatus": "Wikimedia Commons File page verified for named location, author, CC licence and source resolution on 2026-10-24; not a full-resolution pixel/composition sign-off."
    }
  ],
  "country-be": [
    {
      "file": "The Grand Place, Brussels.jpg",
      "author": "Silva.1994",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
      "subject": "Grand Place square in Brussels at night",
      "width": 4160,
      "height": 3120,
      "editorialMetadata": true,
      "qualityPriority": 1000,
      "reviewStatus": "Wikimedia Commons File page verified for named location, author, CC licence and source resolution on 2026-10-24; not a full-resolution pixel/composition sign-off."
    },
    {
      "file": "Brujas, canal.jpg",
      "author": "LBM1948",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
      "subject": "Bruges canal, Belgium",
      "width": 4104,
      "height": 2764,
      "editorialMetadata": true,
      "qualityPriority": 1000,
      "reviewStatus": "Wikimedia Commons File page verified for named location, author, CC licence and source resolution on 2026-10-24; not a full-resolution pixel/composition sign-off."
    }
  ],
  "country-bj": [
    {
      "file": "Benin village on water Ganvié.jpg",
      "author": "Dr. Ondřej Havelka (cestovatel)",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
      "subject": "Stilt village of Ganvié on Lake Nokoué, Benin",
      "width": 2448,
      "height": 1244,
      "editorialMetadata": true,
      "qualityPriority": 1000,
      "reviewStatus": "Wikimedia Commons File page verified for named location, author, CC licence and source resolution on 2026-10-24; not a full-resolution pixel/composition sign-off."
    }
  ],
  "country-bn": [
    {
      "file": "Omar Ali Saifuddien Mosque Brunei.jpg",
      "author": "Philip Nalangan",
      "license": "CC BY 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
      "subject": "Omar Ali Saifuddien Mosque in Bandar Seri Begawan, Brunei, at night",
      "width": 6016,
      "height": 4000,
      "editorialMetadata": true,
      "qualityPriority": 1000,
      "reviewStatus": "Wikimedia Commons File page verified for named location, author, CC licence and source resolution on 2026-10-24; not a full-resolution pixel/composition sign-off."
    }
  ],
  "country-bh": [
    {
      "file": "Manama Manama Skyline 01.jpg",
      "author": "Zairon",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
      "subject": "Manama skyline, Bahrain",
      "width": 4529,
      "height": 1623,
      "editorialMetadata": true,
      "qualityPriority": 1000,
      "reviewStatus": "Wikimedia Commons File page verified for named location, author, CC licence and source resolution on 2026-10-24; not a full-resolution pixel/composition sign-off."
    }
  ],
  "country-bf": [
    {
      "file": "Bobo-Dioulasso Mosque.jpg",
      "author": "Jurgen",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
      "subject": "Grand Mosque of Bobo-Dioulasso, Burkina Faso",
      "width": 3072,
      "height": 2304,
      "editorialMetadata": true,
      "qualityPriority": 1000,
      "reviewStatus": "Wikimedia Commons File page verified for named location, author, CC licence and source resolution on 2026-10-24; not a full-resolution pixel/composition sign-off."
    }
  ],
  "country-dk": [
    {
      "file": "Nyhavn, Copenhague.jpg",
      "author": "Bene Riobó",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
      "subject": "Colourful Nyhavn waterfront in Copenhagen, Denmark",
      "width": 4800,
      "height": 3200,
      "editorialMetadata": true,
      "qualityPriority": 1000,
      "reviewStatus": "Wikimedia Commons File page verified for named location, author, CC licence and source resolution on 2026-10-24; not a full-resolution pixel/composition sign-off."
    }
  ],
  "country-bb": [
    {
      "file": "Bridgetown, Barbados..JPG",
      "author": "Pgbk1987",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
      "subject": "City of Bridgetown, Barbados",
      "width": 4912,
      "height": 3264,
      "editorialMetadata": true,
      "qualityPriority": 1000,
      "reviewStatus": "Wikimedia Commons File page verified for named location, author, CC licence and source resolution on 2026-10-24; not a full-resolution pixel/composition sign-off."
    }
  ],
  "country-ec": [
    {
      "file": "Cotopaxi Volcano.jpg",
      "author": "J. Miers (Wikivoyage user Jtesla16)",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
      "subject": "Cotopaxi volcano with Tambopaxi in the foreground, Ecuador",
      "width": 3072,
      "height": 2304,
      "editorialMetadata": true,
      "qualityPriority": 1000,
      "reviewStatus": "Wikimedia Commons File page verified for named location, author, CC licence and source resolution on 2026-10-24; not a full-resolution pixel/composition sign-off."
    },
    {
      "file": "Quito Panorama of the historic center from Casa Bella Vista 15.jpg",
      "author": "Ymblanter",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
      "subject": "Historic centre of Quito seen from Casa Bella Vista, Ecuador",
      "width": 6000,
      "height": 4000,
      "editorialMetadata": true,
      "qualityPriority": 1000,
      "reviewStatus": "Wikimedia Commons File page verified for named location, author, CC licence and source resolution on 2026-10-24; not a full-resolution pixel/composition sign-off."
    }
  ],
  "country-cm": [
    {
      "file": "Mount Cameroon.jpg",
      "author": "Daina",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
      "subject": "Mount Cameroon viewed from the Molyko district of Buea",
      "width": 1944,
      "height": 2592,
      "editorialMetadata": true,
      "qualityPriority": 1000,
      "reviewStatus": "Wikimedia Commons File page verified for named location, author, CC licence and source resolution on 2026-10-24; not a full-resolution pixel/composition sign-off."
    }
  ]
});
  const rejectedPhotoV90=Object.freeze({
  "country-at": [
    "Maria Carolina of Austria in the Palace of Caserta.jpg"
  ],
  "country-be": [
    "Sainte-Elisabeth church in Binche, Belgium (DSCF7800).jpg",
    "Liberation monument in Tielt, Belgium (DSCF0068).jpg"
  ],
  "country-bj": [
    "Benignus of Dijon church in St-Benin-des-Bois (3).jpg"
  ],
  "country-bn": [
    "Anduki Airfield main terminal building, Brunei (DSCF1450).jpg"
  ],
  "country-bh": [
    "Scenes from Sakhir Palace in Bahrain, as U.S. Secretary of Defense James Mattis visits Bahrain King Hamad bin Isa Al Khalifa, south of Manama, Bahrain on October 27, 2018 - 6.jpg"
  ],
  "country-bf": [
    "EU Humanitarian Air Bridge to Burkina Faso (1).jpg"
  ],

  "country-bb": [
    "066a Britannia in Port of Bridgetown at night - Barbados - 3 1 - V-P.jpg"
  ],
  "country-ec": [
    "Iguana marina (Amblyrhynchus cristatus), Las Bachas, isla Santa Cruz, islas Galápagos, Ecuador, 2015-07-23, DD 23.jpg",
    "Iguana marina (Amblyrhynchus cristatus), isla Lobos, islas Galápagos, Ecuador, 2015-07-25, DD 47.JPG"
  ],
  "country-cm": [
    "Rothmannia lateriflora (Rubiaceae) from the Dja Faunal Reserve.jpg"
  ]
});
  function acceptedPhotoV90(id,item){
    return !(rejectedPhotoV90[id]||[]).some(file=>file.toLowerCase()===item.file.toLowerCase());
  }
  // Source-verified candidate additions to reach four where Wikimedia has
  // enough distinct photos. Never label machine selection as visual approval.
  function enrichmentFor(id){
    const records=typeof window==='object'?window.RevisionWorldPhotoEnrichment:null;
    return Array.isArray(records?.[id])?records[id]:[];
  }
  function filesFor(id){
    const rest=[...(verified[id]||[]),...(featuredCities[id]||[]),...(featuredCitiesB[id]||[]),...(featuredCitiesC[id]||[]),...(featuredCitiesD[id]||[]),...(featuredCitiesE[id]||[]),...(featuredCitiesF[id]||[]),...(editorial[id]||[]),...(additionalEditorialA[id]||[]),...(additionalEditorialB[id]||[]),...(independentlySourced[id]||[]),...reusedFor(id),...nationalSources(id),...(lastThreePlaceSources[id]||[]),...discoveredFor(id),...enrichmentFor(id)];
    const seen=new Set();
    return [...(priorityPhotoV90[id]||[]),...rest]
      .filter(photo=>acceptedPhotoV90(id,photo))
      .filter(photo=>{const k=photo.file.replace(/_/g,' ').trim().toLowerCase();if(seen.has(k))return false;seen.add(k);return true;});
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
