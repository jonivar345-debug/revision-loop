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
  function filesFor(id){
    return [...(verified[id]||[]),...(editorial[id]||[])];
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
