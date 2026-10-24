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
      {file:'Panorama London 2012.jpg',author:'FiatLUX',license:'CC BY-SA 4.0',subject:'Westminster and Big Ben',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/'},
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
  function filesFor(id){
    return verified[id]||[];
  }
  function image(entry){
    const file=entry.file.replace(/ /g,'_');
    const encoded=encodeURIComponent(file);
    return Object.freeze({
      ...entry,
      checked:true,
      file:'File:'+entry.file,
      filePage:'https://commons.wikimedia.org/wiki/File:'+encoded,
      url:'https://commons.wikimedia.org/wiki/Special:FilePath/'+encoded+'?width=2048',
      originalPage:'https://commons.wikimedia.org/wiki/File:'+encoded,
      description:entry.subject,
      source:'curated'
    });
  }
  return Object.freeze({filesFor,get:id=>filesFor(id).map(image)});
});
