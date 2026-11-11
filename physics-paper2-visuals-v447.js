'use strict';
/* Revision Loop v447 — eight original, self-contained visual AQA AS Physics
   Paper 2 technique prompts. These are NOT reproductions of exam diagrams.
   All labels/data are intentionally authored for fresh examples. */
(function(root){
  const common='font-family="Arial,sans-serif" fill="#172554"';
  const axes='<path d="M46 22 V139 H317" stroke="#334155" fill="none" stroke-width="2"/>';
  const L=(x,y,value,size=13)=>'<text x="'+x+'" y="'+y+'" '+common+' font-size="'+size+'">'+value+'</text>';
  const C=(x,y,r=5,fill='#1d4ed8')=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'"/>';
  const line=(x1,y1,x2,y2,color='#2563eb',weight=3,dash='')=>
   '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+color+'" stroke-width="'+weight+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>';
  const cases={
   'p2v447-divider':{
     title:'Potential divider: voltmeter across the lower resistor',
     svg:L(110,18,'12.0 V supply')+
       line(100,28,240,28,'#64748b',2)+line(100,28,100,152,'#64748b',2)+line(240,28,240,152,'#64748b',2)+
       line(100,152,240,152,'#64748b',2)+L(156,149,'0 V',11)+
       line(170,28,170,52,'#2563eb',3)+
       '<rect x="151" y="52" width="38" height="34" rx="3" fill="#dbeafe" stroke="#1d4ed8" stroke-width="2"/>'+
       L(198,74,'3 kΩ')+line(170,86,170,96)+
       '<rect x="151" y="96" width="38" height="34" rx="3" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>'+
       L(198,115,'6 kΩ')+line(170,130,170,152)+
       line(170,90,78,90,'#64748b',2)+line(78,90,78,145,'#64748b',2)+
       '<circle cx="78" cy="116" r="17" fill="#fff" stroke="#334155" stroke-width="2"/>'+L(72,122,'V',15)+
       line(78,145,100,145,'#64748b',2)+L(15,163,'Across lower 6 kΩ',11)
   },
   'p2v447-elastic':{
     title:'Spring force against extension: straight line through the origin',
     svg:axes+line(46,139,268,35,'#2563eb',4)+L(71,35,'Force, F',13)+L(195,161,'Extension, x',13)+
       L(88,113,'F = kx',14)+C(46,139,3,'#334155')+
       L(280,45,'linear',12)
   },
   'p2v447-drag':{
     title:'Speed-time graph rising then approaching a constant terminal speed',
     svg:axes+'<path d="M46 139 C72 62 119 54 163 53 S252 53 308 53" fill="none" stroke="#2563eb" stroke-width="4"/>'+
       L(48,17,'speed',13)+L(272,159,'time',13)+
       line(46,53,312,53,'#d97706',1.5,'6 4')+L(208,44,'terminal speed',12)
   },
   'p2v447-interference':{
     title:'Two coherent sources with different measured path lengths to P',
     svg:C(54,38,8)+C(54,129,8)+C(290,63,7,'#b45309')+
       line(63,38,282,61,'#2563eb',3)+line(61,126,283,66,'#10b981',3)+
       L(14,27,'S1',13)+L(14,152,'S2',13)+L(302,68,'P',13)+
       L(142,35,'1.20 m',13)+L(154,125,'1.50 m',13)+
       L(203,157,'not to scale',11)
   },
   'p2v447-network':{
     title:'Parallel resistor branches with 9.0 V across the pair',
     svg:L(112,20,'9.0 V across both rails',13)+line(70,38,298,38,'#334155',2)+
       line(70,142,298,142,'#334155',2)+
       line(124,38,124,68,'#2563eb',3)+'<rect x="105" y="68" width="38" height="41" rx="3" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>'+
       line(124,109,124,142,'#2563eb',3)+L(105,91,'6 Ω',14)+
       line(245,38,245,68,'#d97706',3)+'<rect x="226" y="68" width="38" height="41" rx="3" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>'+
       line(245,109,245,142,'#d97706',3)+L(226,91,'3 Ω',14)+
       L(155,164,'parallel branches',12)
   },
   'p2v447-accel':{
     title:'Acceleration-time graph: plus 2 from 0 to 3 seconds, minus 1 from 3 to 5 seconds',
     svg:line(48,20,48,149,'#334155',2)+line(48,93,324,93,'#334155',2)+
       '<path d="M49 40 H191 V119 H286" fill="none" stroke="#2563eb" stroke-width="4"/>'+
       line(191,39,191,93,'#94a3b8',1.5,'5 4')+line(286,93,286,119,'#94a3b8',1.5,'5 4')+
       L(6,15,'a (m/s²)',12)+L(301,109,'t/s',12)+L(22,43,'+2',12)+L(22,124,'−1',12)+
       L(46,109,'0',12)+L(181,109,'3',12)+L(278,109,'5',12)
   },
   'p2v447-tensions':{
     title:'Mass suspended symmetrically from two cables, both 30 degrees above the horizontal',
     svg:line(50,30,310,30,'#64748b',3)+line(50,30,180,111,'#2563eb',3)+line(310,30,180,111,'#2563eb',3)+
       '<rect x="152" y="111" width="56" height="34" rx="5" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>'+
       L(157,132,'4.0 kg',12)+L(90,50,'30°',14)+L(240,50,'30°',14)+
       line(180,111,180,159,'#b45309',3)+
       '<polygon points="180,159 173,146 187,146" fill="#b45309"/>'+L(188,155,'mg',12)+
       L(124,16,'Equal cables',12)
   },
   'p2v447-wire':{
     title:'Uniform 1.00 metre resistance wire: C is 0.30 metres from A, ends at 10 V and 0 V',
     svg:L(106,18,'Uniform wire AB, 1.00 m',12)+
       line(40,74,320,74,'#2563eb',7)+C(40,74,6,'#334155')+C(124,74,6,'#b45309')+C(320,74,6,'#334155')+
       L(29,59,'A',15)+L(119,59,'C',15)+L(313,59,'B',15)+
       L(24,104,'0 V',12)+L(294,104,'10 V',12)+
       line(40,115,124,115,'#64748b',2)+
       line(40,110,40,121,'#64748b',2)+line(124,110,124,121,'#64748b',2)+
       L(53,135,'0.30 m',12)+
       L(184,145,'Voltmeter reads A to C',11)
   }
  };
  function render(name){
   const entry=cases[name];
   if(!entry)return '';
   return '<svg viewBox="0 0 360 170" role="img" aria-label="'+entry.title+'" xmlns="http://www.w3.org/2000/svg">'+
    '<title>'+entry.title+'</title>'+entry.svg+'</svg>';
  }
  root.RevisionPaper2Visuals=Object.freeze({render,names:Object.freeze(Object.keys(cases)),version:'v447'});
})(typeof window!=='undefined'?window:globalThis);
