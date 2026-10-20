
const DECK_URL='./deck.json',EXAM_URL='./exam_questions.json',DAY=86400000;
const PIN_HASH='02a80993805958408c14d68623a229c86777980c55403d0c2fecf46904fe367c';
const PROGRESS_KEY='revisionLoopProgress5',PROFILE_KEY='revisionLoopProfile11',SETTINGS_KEY='revisionLoopSettings11';
let cards=[],examQuestions=[],deckMeta={},coverage={},deckVersion=0,bankVersion=0;
let progress=load(PROGRESS_KEY,{});
let profile=load(PROFILE_KEY,{});
let settings=load(SETTINGS_KEY,{});
let studyType='mock',activeSession=null,currentCardId=null,currentEvaluation=null,currentFlashAwarded=false,currentExamScore=0,toastTimer=null;
let flashTopics=new Set(),examTopics=new Set(),examYears=new Set(),examTypes=new Set(),globeLon=0,globeLat=5,dragging=false,lastPointer=null,dragDistance=0,selectedLocation='london',openLocationId=null,locationVisibleLimit=24;

const CHARACTERS=[
 {id:'lelouch',name:'Lelouch',series:'Code Geass',cost:0,skin:'#efd0b5',hair:'#111827',hair2:'#312e81',style:'swept',eye:'#5b21b6'},
 {id:'cc',name:'C.C.',series:'Code Geass',cost:18,skin:'#efccb0',hair:'#65a30d',hair2:'#3f6212',style:'long',eye:'#d4d4d8'},
 {id:'suzaku',name:'Suzaku',series:'Code Geass',cost:22,skin:'#d9a77d',hair:'#5b4636',hair2:'#3f2f25',style:'messy',eye:'#166534'},
 {id:'kallen',name:'Kallen',series:'Code Geass',cost:26,skin:'#efc5a6',hair:'#b91c1c',hair2:'#7f1d1d',style:'messy',eye:'#60a5fa'},
 {id:'jeremiah',name:'Jeremiah',series:'Code Geass',cost:30,skin:'#d8a77f',hair:'#c2410c',hair2:'#7c2d12',style:'short',eye:'#3f6212'},

 {id:'light',name:'Light',series:'Death Note',cost:18,skin:'#e7bd9f',hair:'#7c4a2d',hair2:'#4a2c1a',style:'swept',eye:'#78350f'},
 {id:'l',name:'L',series:'Death Note',cost:22,skin:'#e8d1bf',hair:'#111827',hair2:'#0f172a',style:'messy',eye:'#111827',accessory:'darkeyes'},
 {id:'misa',name:'Misa',series:'Death Note',cost:26,skin:'#efc7aa',hair:'#eab308',hair2:'#a16207',style:'long',eye:'#78350f'},
 {id:'near',name:'Near',series:'Death Note',cost:30,skin:'#ead2bd',hair:'#e5e7eb',hair2:'#cbd5e1',style:'messy',eye:'#64748b'},
 {id:'ryuk',name:'Ryuk',series:'Death Note',cost:36,skin:'#9ca3af',hair:'#0f172a',hair2:'#020617',style:'spiky',eye:'#dc2626',accessory:'darkeyes'},

 {id:'eren',name:'Eren',series:'Attack on Titan',cost:20,skin:'#d7a27b',hair:'#4b3621',hair2:'#2f2418',style:'long',eye:'#16a34a'},
 {id:'mikasa',name:'Mikasa',series:'Attack on Titan',cost:24,skin:'#e0ad87',hair:'#111827',hair2:'#0f172a',style:'bob',eye:'#374151',accessory:'scarf'},
 {id:'levi',name:'Levi',series:'Attack on Titan',cost:28,skin:'#dfb18c',hair:'#111827',hair2:'#020617',style:'short',eye:'#64748b'},
 {id:'armin',name:'Armin',series:'Attack on Titan',cost:32,skin:'#efc9a9',hair:'#f2c94c',hair2:'#b7791f',style:'bob',eye:'#60a5fa'},
 {id:'erwin',name:'Erwin',series:'Attack on Titan',cost:36,skin:'#e3b48f',hair:'#d4a72c',hair2:'#8b6a16',style:'swept',eye:'#60a5fa'},

 {id:'isagi',name:'Isagi',series:'Blue Lock',cost:20,skin:'#e2b08c',hair:'#172554',hair2:'#0f172a',style:'short',eye:'#2563eb'},
 {id:'bachira',name:'Bachira',series:'Blue Lock',cost:24,skin:'#e0af88',hair:'#111827',hair2:'#eab308',style:'messy',eye:'#eab308'},
 {id:'rin_bl',name:'Rin',series:'Blue Lock',cost:28,skin:'#e3b48f',hair:'#164e63',hair2:'#0f172a',style:'swept',eye:'#0891b2'},
 {id:'nagi',name:'Nagi',series:'Blue Lock',cost:32,skin:'#efd0b5',hair:'#f1f5f9',hair2:'#cbd5e1',style:'messy',eye:'#64748b'},
 {id:'barou',name:'Barou',series:'Blue Lock',cost:36,skin:'#ce9067',hair:'#111827',hair2:'#7f1d1d',style:'spiky',eye:'#dc2626'},

 {id:'yuji',name:'Yuji',series:'Jujutsu Kaisen',cost:22,skin:'#e2ad86',hair:'#fb7185',hair2:'#be123c',style:'short',eye:'#78350f'},
 {id:'gojo',name:'Gojo',series:'Jujutsu Kaisen',cost:28,skin:'#efcdb1',hair:'#f8fafc',hair2:'#cbd5e1',style:'spiky',eye:'#38bdf8',accessory:'blindfold'},
 {id:'megumi',name:'Megumi',series:'Jujutsu Kaisen',cost:32,skin:'#ddb08d',hair:'#111827',hair2:'#020617',style:'spiky',eye:'#1f2937'},
 {id:'nobara',name:'Nobara',series:'Jujutsu Kaisen',cost:36,skin:'#e7b794',hair:'#9a3412',hair2:'#7c2d12',style:'bob',eye:'#78350f'},
 {id:'toji',name:'Toji',series:'Jujutsu Kaisen',cost:42,skin:'#b97852',hair:'#111827',hair2:'#020617',style:'short',eye:'#16a34a',accessory:'scar'},

 {id:'subaru',name:'Subaru',series:'Re:Zero',cost:22,skin:'#dca47e',hair:'#111827',hair2:'#020617',style:'short',eye:'#78350f'},
 {id:'emilia',name:'Emilia',series:'Re:Zero',cost:28,skin:'#f0ceb5',hair:'#e5e7eb',hair2:'#c4b5fd',style:'long',eye:'#a855f7'},
 {id:'rem',name:'Rem',series:'Re:Zero',cost:32,skin:'#edc3a6',hair:'#60a5fa',hair2:'#2563eb',style:'bob',eye:'#60a5fa'},
 {id:'beatrice',name:'Beatrice',series:'Re:Zero',cost:36,skin:'#efc9aa',hair:'#facc15',hair2:'#ca8a04',style:'long',eye:'#60a5fa'},
 {id:'echidna',name:'Echidna',series:'Re:Zero',cost:42,skin:'#f0cfb7',hair:'#f8fafc',hair2:'#d1d5db',style:'long',eye:'#111827'},

 {id:'klein',name:'Klein',series:'Lord of the Mysteries',cost:24,skin:'#ddb08b',hair:'#3f2d22',hair2:'#1f2937',style:'swept',eye:'#78350f'},
 {id:'audrey',name:'Audrey',series:'Lord of the Mysteries',cost:30,skin:'#efcaae',hair:'#eab308',hair2:'#a16207',style:'long',eye:'#16a34a'},
 {id:'alger',name:'Alger',series:'Lord of the Mysteries',cost:34,skin:'#b47b56',hair:'#1e3a8a',hair2:'#0f172a',style:'short',eye:'#1d4ed8'},
 {id:'leonard_lotm',name:'Leonard',series:'Lord of the Mysteries',cost:38,skin:'#d7a27d',hair:'#111827',hair2:'#166534',style:'messy',eye:'#16a34a'},
 {id:'azik',name:'Azik',series:'Lord of the Mysteries',cost:44,skin:'#9f6949',hair:'#111827',hair2:'#020617',style:'long',eye:'#78350f'},

 {id:'dokja',name:'Kim Dokja',series:'Omniscient Reader',cost:24,skin:'#e0b08e',hair:'#111827',hair2:'#020617',style:'short',eye:'#111827'},
 {id:'joonghyuk',name:'Yoo Joonghyuk',series:'Omniscient Reader',cost:30,skin:'#d49b74',hair:'#111827',hair2:'#020617',style:'swept',eye:'#111827'},
 {id:'sooyoung',name:'Han Sooyoung',series:'Omniscient Reader',cost:34,skin:'#e6b793',hair:'#111827',hair2:'#312e81',style:'bob',eye:'#5b21b6'},
 {id:'sangah',name:'Yoo Sangah',series:'Omniscient Reader',cost:38,skin:'#e8bc99',hair:'#6b4423',hair2:'#3f2f25',style:'long',eye:'#78350f'},
 {id:'heewon',name:'Jung Heewon',series:'Omniscient Reader',cost:44,skin:'#d79f78',hair:'#2f2418',hair2:'#111827',style:'long',eye:'#78350f'},

 {id:'thorfinn',name:'Thorfinn',series:'Vinland Saga',cost:24,skin:'#d7a27a',hair:'#d4a72c',hair2:'#8b6a16',style:'messy',eye:'#60a5fa'},
 {id:'askeladd',name:'Askeladd',series:'Vinland Saga',cost:30,skin:'#c58b62',hair:'#d1b56f',hair2:'#78716c',style:'swept',eye:'#64748b'},
 {id:'canute',name:'Canute',series:'Vinland Saga',cost:34,skin:'#efc7a6',hair:'#e8c547',hair2:'#a16207',style:'long',eye:'#60a5fa'},
 {id:'thorkell',name:'Thorkell',series:'Vinland Saga',cost:38,skin:'#c28258',hair:'#b45309',hair2:'#7c2d12',style:'spiky',eye:'#78350f'},
 {id:'einar',name:'Einar',series:'Vinland Saga',cost:44,skin:'#b97a53',hair:'#6b4423',hair2:'#3f2f25',style:'short',eye:'#78350f'},

 {id:'kaneki',name:'Kaneki',series:'Tokyo Ghoul',cost:26,skin:'#e4c0a5',hair:'#f1f5f9',hair2:'#cbd5e1',style:'messy',eye:'#dc2626',accessory:'eyepatch'},
 {id:'touka',name:'Touka',series:'Tokyo Ghoul',cost:32,skin:'#e6b794',hair:'#312e81',hair2:'#111827',style:'bob',eye:'#5b21b6'},
 {id:'juuzou',name:'Juuzou',series:'Tokyo Ghoul',cost:36,skin:'#efd0b4',hair:'#f8fafc',hair2:'#d1d5db',style:'messy',eye:'#dc2626',accessory:'stitches'},
 {id:'arima',name:'Arima',series:'Tokyo Ghoul',cost:40,skin:'#e6b996',hair:'#e5e7eb',hair2:'#cbd5e1',style:'short',eye:'#64748b',accessory:'glasses'},
 {id:'hide',name:'Hide',series:'Tokyo Ghoul',cost:46,skin:'#e7b895',hair:'#eab308',hair2:'#a16207',style:'short',eye:'#78350f'},
 {id:'phase2_kenzo_tenma',name:'Kenzo Tenma',series:'Monster',cost:35,skin:'#efd0b5',hair:'#111827',hair2:'#e2e8f0',style:'messy',eye:'#ca8a04',lookup:'Kenzo Tenma'},
 {id:'phase2_johan_liebert',name:'Johan Liebert',series:'Monster',cost:37,skin:'#dca77f',hair:'#7c3aed',hair2:'#b91c1c',style:'long',eye:'#e2e8f0',lookup:'Johan Liebert'},
 {id:'phase2_nina_fortner',name:'Nina Fortner',series:'Monster',cost:39,skin:'#d7a27d',hair:'#ca8a04',hair2:'#64748b',style:'short',eye:'#b91c1c',lookup:'Nina Fortner'},
 {id:'phase2_wolfgang_grimmer',name:'Wolfgang Grimmer',series:'Monster',cost:41,skin:'#efc7a6',hair:'#e2e8f0',hair2:'#075985',style:'swept',eye:'#64748b',lookup:'Wolfgang Grimmer'},
 {id:'phase2_shinichi_izumi',name:'Shinichi Izumi',series:'Parasyte – the Maxim',cost:43,skin:'#bb815d',hair:'#b91c1c',hair2:'#16a34a',style:'bob',eye:'#075985',lookup:'Shinichi Izumi'},
 {id:'phase2_migi',name:'Migi',series:'Parasyte – the Maxim',cost:45,skin:'#efd0b5',hair:'#64748b',hair2:'#111827',style:'spiky',eye:'#16a34a',lookup:'Migi'},
 {id:'phase2_kana_kimishima',name:'Kana Kimishima',series:'Parasyte – the Maxim',cost:47,skin:'#dca77f',hair:'#075985',hair2:'#7c3aed',style:'messy',eye:'#111827',lookup:'Kana Kimishima'},
 {id:'phase2_reiko_tamura',name:'Reiko Tamura',series:'Parasyte – the Maxim',cost:49,skin:'#d7a27d',hair:'#16a34a',hair2:'#ca8a04',style:'long',eye:'#7c3aed',lookup:'Reiko Tamura'},
 {id:'phase2_spike_spiegel',name:'Spike Spiegel',series:'Cowboy Bebop',cost:51,skin:'#efc7a6',hair:'#111827',hair2:'#e2e8f0',style:'short',eye:'#ca8a04',lookup:'Spike Spiegel'},
 {id:'phase2_faye_valentine',name:'Faye Valentine',series:'Cowboy Bebop',cost:53,skin:'#bb815d',hair:'#7c3aed',hair2:'#b91c1c',style:'swept',eye:'#e2e8f0',lookup:'Faye Valentine'},
 {id:'phase2_jet_black',name:'Jet Black',series:'Cowboy Bebop',cost:55,skin:'#efd0b5',hair:'#ca8a04',hair2:'#64748b',style:'bob',eye:'#b91c1c',lookup:'Jet Black'},
 {id:'phase2_edward_wong',name:'Edward Wong',series:'Cowboy Bebop',cost:57,skin:'#dca77f',hair:'#e2e8f0',hair2:'#075985',style:'spiky',eye:'#64748b',lookup:'Edward Wong'},
 {id:'phase2_shinji_ikari',name:'Shinji Ikari',series:'Neon Genesis Evangelion',cost:59,skin:'#d7a27d',hair:'#b91c1c',hair2:'#16a34a',style:'messy',eye:'#075985',lookup:'Shinji Ikari'},
 {id:'phase2_asuka_langley',name:'Asuka Langley',series:'Neon Genesis Evangelion',cost:61,skin:'#efc7a6',hair:'#64748b',hair2:'#111827',style:'long',eye:'#16a34a',lookup:'Asuka Langley'},
 {id:'phase2_rei_ayanami',name:'Rei Ayanami',series:'Neon Genesis Evangelion',cost:63,skin:'#bb815d',hair:'#075985',hair2:'#7c3aed',style:'short',eye:'#111827',lookup:'Rei Ayanami'},
 {id:'phase2_misato_katsuragi',name:'Misato Katsuragi',series:'Neon Genesis Evangelion',cost:65,skin:'#efd0b5',hair:'#16a34a',hair2:'#ca8a04',style:'swept',eye:'#7c3aed',lookup:'Misato Katsuragi'},
 {id:'phase2_kaworu_nagisa',name:'Kaworu Nagisa',series:'Neon Genesis Evangelion',cost:67,skin:'#dca77f',hair:'#111827',hair2:'#e2e8f0',style:'bob',eye:'#ca8a04',lookup:'Kaworu Nagisa'},
 {id:'phase2_edward_elric',name:'Edward Elric',series:'Fullmetal Alchemist',cost:69,skin:'#d7a27d',hair:'#7c3aed',hair2:'#b91c1c',style:'spiky',eye:'#e2e8f0',lookup:'Edward Elric'},
 {id:'phase2_alphonse_elric',name:'Alphonse Elric',series:'Fullmetal Alchemist',cost:71,skin:'#efc7a6',hair:'#ca8a04',hair2:'#64748b',style:'messy',eye:'#b91c1c',lookup:'Alphonse Elric'},
 {id:'phase2_roy_mustang',name:'Roy Mustang',series:'Fullmetal Alchemist',cost:73,skin:'#bb815d',hair:'#e2e8f0',hair2:'#075985',style:'long',eye:'#64748b',lookup:'Roy Mustang'},
 {id:'phase2_riza_hawkeye',name:'Riza Hawkeye',series:'Fullmetal Alchemist',cost:75,skin:'#efd0b5',hair:'#b91c1c',hair2:'#16a34a',style:'short',eye:'#075985',lookup:'Riza Hawkeye'},
 {id:'phase2_scar',name:'Scar',series:'Fullmetal Alchemist',cost:77,skin:'#dca77f',hair:'#64748b',hair2:'#111827',style:'swept',eye:'#16a34a',lookup:'Scar'},
 {id:'phase2_gon_freecss',name:'Gon Freecss',series:'Hunter x Hunter',cost:79,skin:'#d7a27d',hair:'#075985',hair2:'#7c3aed',style:'bob',eye:'#111827',lookup:'Gon Freecss'},
 {id:'phase2_killua_zoldyck',name:'Killua Zoldyck',series:'Hunter x Hunter',cost:81,skin:'#efc7a6',hair:'#16a34a',hair2:'#ca8a04',style:'spiky',eye:'#7c3aed',lookup:'Killua Zoldyck'},
 {id:'phase2_kurapika',name:'Kurapika',series:'Hunter x Hunter',cost:83,skin:'#bb815d',hair:'#111827',hair2:'#e2e8f0',style:'messy',eye:'#ca8a04',lookup:'Kurapika'},
 {id:'phase2_hisoka_morow',name:'Hisoka Morow',series:'Hunter x Hunter',cost:85,skin:'#efd0b5',hair:'#7c3aed',hair2:'#b91c1c',style:'long',eye:'#e2e8f0',lookup:'Hisoka Morow'},
 {id:'phase2_chrollo_lucilfer',name:'Chrollo Lucilfer',series:'Hunter x Hunter',cost:87,skin:'#dca77f',hair:'#ca8a04',hair2:'#64748b',style:'short',eye:'#b91c1c',lookup:'Chrollo Lucilfer'},
 {id:'phase2_denji',name:'Denji',series:'Chainsaw Man',cost:89,skin:'#d7a27d',hair:'#e2e8f0',hair2:'#075985',style:'swept',eye:'#64748b',lookup:'Denji'},
 {id:'phase2_power',name:'Power',series:'Chainsaw Man',cost:91,skin:'#efc7a6',hair:'#b91c1c',hair2:'#16a34a',style:'bob',eye:'#075985',lookup:'Power'},
 {id:'phase2_aki_hayakawa',name:'Aki Hayakawa',series:'Chainsaw Man',cost:93,skin:'#bb815d',hair:'#64748b',hair2:'#111827',style:'spiky',eye:'#16a34a',lookup:'Aki Hayakawa'},
 {id:'phase2_makima',name:'Makima',series:'Chainsaw Man',cost:95,skin:'#efd0b5',hair:'#075985',hair2:'#7c3aed',style:'messy',eye:'#111827',lookup:'Makima'},
 {id:'phase2_kobeni_higashiyama',name:'Kobeni Higashiyama',series:'Chainsaw Man',cost:97,skin:'#dca77f',hair:'#16a34a',hair2:'#ca8a04',style:'long',eye:'#7c3aed',lookup:'Kobeni Higashiyama'},
 {id:'phase2_kafka_hibino',name:'Kafka Hibino',series:'Kaiju No. 8',cost:99,skin:'#d7a27d',hair:'#111827',hair2:'#e2e8f0',style:'short',eye:'#ca8a04',lookup:'Kafka Hibino'},
 {id:'phase2_mina_ashiro',name:'Mina Ashiro',series:'Kaiju No. 8',cost:101,skin:'#efc7a6',hair:'#7c3aed',hair2:'#b91c1c',style:'swept',eye:'#e2e8f0',lookup:'Mina Ashiro'},
 {id:'phase2_kikoru_shinomiya',name:'Kikoru Shinomiya',series:'Kaiju No. 8',cost:103,skin:'#bb815d',hair:'#ca8a04',hair2:'#64748b',style:'bob',eye:'#b91c1c',lookup:'Kikoru Shinomiya'},
 {id:'phase2_reno_ichikawa',name:'Reno Ichikawa',series:'Kaiju No. 8',cost:105,skin:'#efd0b5',hair:'#e2e8f0',hair2:'#075985',style:'spiky',eye:'#64748b',lookup:'Reno Ichikawa'},
 {id:'phase2_soshiro_hoshina',name:'Soshiro Hoshina',series:'Kaiju No. 8',cost:107,skin:'#dca77f',hair:'#b91c1c',hair2:'#16a34a',style:'messy',eye:'#075985',lookup:'Soshiro Hoshina'},
 {id:'phase2_loid_forger',name:'Loid Forger',series:'Spy x Family',cost:109,skin:'#d7a27d',hair:'#64748b',hair2:'#111827',style:'long',eye:'#16a34a',lookup:'Loid Forger'},
 {id:'phase2_yor_forger',name:'Yor Forger',series:'Spy x Family',cost:111,skin:'#efc7a6',hair:'#075985',hair2:'#7c3aed',style:'short',eye:'#111827',lookup:'Yor Forger'},
 {id:'phase2_anya_forger',name:'Anya Forger',series:'Spy x Family',cost:113,skin:'#bb815d',hair:'#16a34a',hair2:'#ca8a04',style:'swept',eye:'#7c3aed',lookup:'Anya Forger'},
 {id:'phase2_fiona_frost',name:'Fiona Frost',series:'Spy x Family',cost:115,skin:'#efd0b5',hair:'#111827',hair2:'#e2e8f0',style:'bob',eye:'#ca8a04',lookup:'Fiona Frost'},
 {id:'phase2_kiyotaka_ayanokoji',name:'Kiyotaka Ayanokoji',series:'Classroom of the Elite',cost:117,skin:'#dca77f',hair:'#7c3aed',hair2:'#b91c1c',style:'spiky',eye:'#e2e8f0',lookup:'Kiyotaka Ayanokoji'},
 {id:'phase2_suzune_horikita',name:'Suzune Horikita',series:'Classroom of the Elite',cost:119,skin:'#d7a27d',hair:'#ca8a04',hair2:'#64748b',style:'messy',eye:'#b91c1c',lookup:'Suzune Horikita'},
 {id:'phase2_kei_karuizawa',name:'Kei Karuizawa',series:'Classroom of the Elite',cost:121,skin:'#efc7a6',hair:'#e2e8f0',hair2:'#075985',style:'long',eye:'#64748b',lookup:'Kei Karuizawa'},
 {id:'phase2_kakeru_ryuen',name:'Kakeru Ryuen',series:'Classroom of the Elite',cost:123,skin:'#bb815d',hair:'#b91c1c',hair2:'#16a34a',style:'short',eye:'#075985',lookup:'Kakeru Ryuen'},
 {id:'phase2_honami_ichinose',name:'Honami Ichinose',series:'Classroom of the Elite',cost:125,skin:'#efd0b5',hair:'#64748b',hair2:'#111827',style:'swept',eye:'#16a34a',lookup:'Honami Ichinose'},
 {id:'phase2_aqua_hoshino',name:'Aqua Hoshino',series:'Oshi no Ko',cost:127,skin:'#dca77f',hair:'#075985',hair2:'#7c3aed',style:'bob',eye:'#111827',lookup:'Aqua Hoshino'},
 {id:'phase2_ruby_hoshino',name:'Ruby Hoshino',series:'Oshi no Ko',cost:129,skin:'#d7a27d',hair:'#16a34a',hair2:'#ca8a04',style:'spiky',eye:'#7c3aed',lookup:'Ruby Hoshino'},
 {id:'phase2_kana_arima',name:'Kana Arima',series:'Oshi no Ko',cost:131,skin:'#efc7a6',hair:'#111827',hair2:'#e2e8f0',style:'messy',eye:'#ca8a04',lookup:'Kana Arima'},
 {id:'phase2_akane_kurokawa',name:'Akane Kurokawa',series:'Oshi no Ko',cost:133,skin:'#bb815d',hair:'#7c3aed',hair2:'#b91c1c',style:'long',eye:'#e2e8f0',lookup:'Akane Kurokawa'},
 {id:'phase2_ai_hoshino',name:'Ai Hoshino',series:'Oshi no Ko',cost:135,skin:'#efd0b5',hair:'#ca8a04',hair2:'#64748b',style:'short',eye:'#b91c1c',lookup:'Ai Hoshino'},
 {id:'phase2_takemichi_hanagaki',name:'Takemichi Hanagaki',series:'Tokyo Revengers',cost:137,skin:'#dca77f',hair:'#e2e8f0',hair2:'#075985',style:'swept',eye:'#64748b',lookup:'Takemichi Hanagaki'},
 {id:'phase2_manjiro_sano',name:'Manjiro Sano',series:'Tokyo Revengers',cost:139,skin:'#d7a27d',hair:'#b91c1c',hair2:'#16a34a',style:'bob',eye:'#075985',lookup:'Manjiro Sano'},
 {id:'phase2_ken_ryuguji',name:'Ken Ryuguji',series:'Tokyo Revengers',cost:141,skin:'#efc7a6',hair:'#64748b',hair2:'#111827',style:'spiky',eye:'#16a34a',lookup:'Ken Ryuguji'},
 {id:'phase2_chifuyu_matsuno',name:'Chifuyu Matsuno',series:'Tokyo Revengers',cost:143,skin:'#bb815d',hair:'#075985',hair2:'#7c3aed',style:'messy',eye:'#111827',lookup:'Chifuyu Matsuno'},
 {id:'phase2_keisuke_baji',name:'Keisuke Baji',series:'Tokyo Revengers',cost:145,skin:'#efd0b5',hair:'#16a34a',hair2:'#ca8a04',style:'long',eye:'#7c3aed',lookup:'Keisuke Baji'},
 {id:'phase2_haruka_sakura',name:'Haruka Sakura',series:'Wind Breaker',cost:147,skin:'#dca77f',hair:'#111827',hair2:'#e2e8f0',style:'short',eye:'#ca8a04',lookup:'Haruka Sakura'},
 {id:'phase2_hayato_suo',name:'Hayato Suo',series:'Wind Breaker',cost:149,skin:'#d7a27d',hair:'#7c3aed',hair2:'#b91c1c',style:'swept',eye:'#e2e8f0',lookup:'Hayato Suo'},
 {id:'phase2_akihiko_nirei',name:'Akihiko Nirei',series:'Wind Breaker',cost:151,skin:'#efc7a6',hair:'#ca8a04',hair2:'#64748b',style:'bob',eye:'#b91c1c',lookup:'Akihiko Nirei'},
 {id:'phase2_hajime_umemiya',name:'Hajime Umemiya',series:'Wind Breaker',cost:153,skin:'#bb815d',hair:'#e2e8f0',hair2:'#075985',style:'spiky',eye:'#64748b',lookup:'Hajime Umemiya'},
 {id:'phase2_jo_togame',name:'Jo Togame',series:'Wind Breaker',cost:155,skin:'#efd0b5',hair:'#b91c1c',hair2:'#16a34a',style:'messy',eye:'#075985',lookup:'Jo Togame'},
 {id:'phase2_sung_jinwoo',name:'Sung Jinwoo',series:'Solo Leveling',cost:155,skin:'#dca77f',hair:'#64748b',hair2:'#111827',style:'long',eye:'#16a34a',lookup:'Sung Jinwoo'},
 {id:'phase2_cha_hae_in',name:'Cha Hae-In',series:'Solo Leveling',cost:155,skin:'#d7a27d',hair:'#075985',hair2:'#7c3aed',style:'short',eye:'#111827',lookup:'Cha Hae-In'},
 {id:'phase2_igris',name:'Igris',series:'Solo Leveling',cost:155,skin:'#efc7a6',hair:'#16a34a',hair2:'#ca8a04',style:'swept',eye:'#7c3aed',lookup:'Igris'},
 {id:'phase2_beru',name:'Beru',series:'Solo Leveling',cost:155,skin:'#bb815d',hair:'#111827',hair2:'#e2e8f0',style:'bob',eye:'#ca8a04',lookup:'Beru'},
 {id:'phase2_yoo_jinho',name:'Yoo Jinho',series:'Solo Leveling',cost:155,skin:'#efd0b5',hair:'#7c3aed',hair2:'#b91c1c',style:'spiky',eye:'#e2e8f0',lookup:'Yoo Jinho'}
];
const OUTFIT_STYLES=[
 {id:'default',name:'Default',cost:0,top:'#2563eb',accent:'#dbeafe'},
 {id:'hoodie',name:'Hoodie',cost:12,top:'#0f172a',accent:'#64748b'},
 {id:'casual',name:'Casual',cost:16,top:'#16a34a',accent:'#dcfce7'},
 {id:'winter',name:'Winter',cost:20,top:'#7c3aed',accent:'#ede9fe'},
 {id:'smart',name:'Smart',cost:24,top:'#334155',accent:'#e2e8f0'},
 {id:'traveller',name:'Traveller',cost:28,top:'#b45309',accent:'#fef3c7'},
 {id:'sport',name:'Sport',cost:32,top:'#dc2626',accent:'#fee2e2'},
 {id:'festival',name:'Festival',cost:38,top:'#db2777',accent:'#fce7f3'}
];
const CHARACTER_OUTFIT_NAMES={
 lelouch:['Academy Uniform','Black Knight Cloak','Ashford Casual','Royal Uniform','Zero-Inspired Costume','Winter Coat','Ceremonial Jacket','Midnight Regalia'],
 light:['School Uniform','Smart Suit','Casual Jacket','Dark Overcoat','Formal Shirt','Winter Coat','Student Casual','Detective Look'],
 eren:['Cadet Uniform','Scout Cloak','Casual Shirt','Long Coat','Field Jacket','Winter Cloak','Formal Jacket','Survey Expedition'],
 isagi:['Training Kit','Blue Match Kit','Tracksuit','Casual Jacket','Winter Training','Streetwear','Away Kit','Final-Match Kit'],
 gojo:['High-Collar Uniform','Travel Coat','Casual T-shirt','Dark Overcoat','Winter Coat','Ceremonial Jacket','City Clothes','Battle Outfit'],
 subaru:['Tracksuit','Traveller Coat','Casual Jacket','Winter Cloak','Smart Look','Training Clothes','Summer Outfit','Knight-Inspired Attire'],
 klein:['Formal Suit','Seer Attire','Long Trench Coat','Gentleman Outfit','Black Overcoat','Traveller Clothes','Mystic Robes','Ceremonial Dress'],
 dokja:['Office Attire','Dark Coat','Casual Jumper','Scenario Outfit','Winter Jacket','Formal Outfit','Traveller Gear','Starlit Cloak'],
 thorfinn:['Traveller Tunic','Explorer Cloak','Casual Linen','Cold-Weather Cloak','Workwear','Warrior Garb','Farm Outfit','Long Voyage'],
 kaneki:['Casual Shirt','Black Coat','White-Hair Outfit','Student Look','Winter Jacket','Long Overcoat','Battle Gear','Midnight Mask']
};
const SERIES_OUTFIT_NAMES={
 'Code Geass':['Academy Look','Black Knights Outfit','Casual Jacket','Military Uniform','Royal Attire','Winter Coat','Formal Uniform','Ceremonial Style'],
 'Death Note':['School Clothes','Investigation Outfit','Casual Jacket','Smart Suit','Dark Overcoat','Winter Wear','Formal Shirt','Late-Night Outfit'],
 'Attack on Titan':['Cadet Clothes','Scout Cloak','Everyday Clothes','Training Uniform','Cold-Weather Cloak','Survey Jacket','Formal Clothes','Expedition Gear'],
 'Blue Lock':['Training Kit','Match Kit','Tracksuit','Casual Clothes','Winter Training','Streetwear','Away Kit','Tournament Kit'],
 'Jujutsu Kaisen':['Sorcerer Uniform','Mission Attire','Casual Clothes','Dark Overcoat','Cold-Weather Outfit','Ceremonial Jacket','City Clothes','Battle Gear'],
 'Re:Zero':['Everyday Outfit','Traveller Clothing','Casual Jacket','Winter Cloak','Court Clothes','Adventurer Outfit','Summer Clothes','Knight-Inspired Gear'],
 'Lord of the Mysteries':['Formal Clothes','Mystic Outfit','Long Trench Coat','Gentleman Outfit','Black Overcoat','Traveller Suit','Ritual Robes','Ceremonial Dress'],
 'Omniscient Reader':['Everyday Outfit','Scenario Outfit','Office Attire','Dark Overcoat','Winter Jacket','Formal Wear','Traveller Gear','Starlit Cloak'],
 'Vinland Saga':['Traveller Tunic','Seafarer Outfit','Casual Linen','Cold-Weather Cloak','Workwear','Warrior Garb','Farm Clothes','Long-Voyage Cloak'],
 'Tokyo Ghoul':['Everyday Clothes','Investigator-Inspired Look','Dark Coat','Student Clothes','Winter Jacket','Long Overcoat','Night Gear','Midnight Disguise']
};
const OUTFITS=CHARACTERS.flatMap(ch=>OUTFIT_STYLES.map((o,i)=>({
 id:ch.id+'-'+o.id,character:ch.id,name:(CHARACTER_OUTFIT_NAMES[ch.id]||SERIES_OUTFIT_NAMES[ch.series]||[])[i]||o.name,
 cost:i===0?0:o.cost+Math.max(0,CHARACTERS.findIndex(x=>x.id===ch.id))*2,
 top:o.top,accent:o.accent,styleId:o.id
})));

// Read-only official character-profile previews. The artwork is linked from MyAnimeList via Jikan;
// nothing is downloaded or redistributed into this public repository.
const ANIME_ART_QUERY={
 lelouch:'Lelouch Lamperouge',cc:'C.C.',light:'Light Yagami',l:'L Lawliet',eren:'Eren Yeager',
 rin_bl:'Rin Itoshi',isagi:'Yoichi Isagi',yuji:'Yuji Itadori',gojo:'Satoru Gojou',
 megumi:'Megumi Fushiguro',nobara:'Nobara Kugisaki',subaru:'Subaru Natsuki',
 klein:'Klein Moretti',dokja:'Kim Dokja',joonghyuk:'Yoo Joonghyuk',thorfinn:'Thorfinn',
 kaneki:'Ken Kaneki',touka:'Touka Kirishima',juuzou:'Juuzou Suzuya',
 phase2_sung_jinwoo:'Sung Jinwoo',phase2_kafka_hibino:'Kafka Hibino',phase2_shinichi_izumi:'Shinichi Izumi',
 phase2_kenzo_tenma:'Kenzo Tenma',phase2_johan_liebert:'Johan Liebert',
 phase2_kiyotaka_ayanokoji:'Kiyotaka Ayanokouji',phase2_manjiro_sano:'Manjiro Sano',
 phase2_aqua_hoshino:'Aqua Hoshino'
};
const VERIFIED_CHARACTER_IMAGE_URLS={
  "lelouch": "https://cdn.myanimelist.net/images/characters/8/406163.jpg",
  "light": "https://cdn.myanimelist.net/images/characters/6/63870.jpg",
  "l": "https://cdn.myanimelist.net/images/characters/10/249647.jpg",
  "eren": "https://cdn.myanimelist.net/images/characters/10/216895.jpg",
  "mikasa": "https://cdn.myanimelist.net/images/characters/9/215563.jpg",
  "levi": "https://cdn.myanimelist.net/images/characters/2/241413.jpg",
  "erwin": "https://cdn.myanimelist.net/images/characters/14/559023.jpg",
  "gojo": "https://cdn.myanimelist.net/images/characters/15/422168.jpg",
  "subaru": "https://cdn.myanimelist.net/images/characters/15/315153.jpg",
  "emilia": "https://cdn.myanimelist.net/images/characters/16/551926.jpg",
  "rem": "https://cdn.myanimelist.net/images/characters/9/311327.jpg",
  "thorfinn": "https://cdn.myanimelist.net/images/characters/9/309871.jpg",
  "askeladd": "https://cdn.myanimelist.net/images/characters/14/401940.jpg",
  "kaneki": "https://cdn.myanimelist.net/images/characters/15/307255.jpg",
  "phase2_johan_liebert": "https://cdn.myanimelist.net/images/characters/4/316522.jpg",
  "phase2_spike_spiegel": "https://cdn.myanimelist.net/images/characters/11/516853.jpg",
  "phase2_edward_elric": "https://cdn.myanimelist.net/images/characters/9/72533.jpg",
  "phase2_roy_mustang": "https://cdn.myanimelist.net/images/characters/11/510227.jpg",
  "phase2_killua_zoldyck": "https://cdn.myanimelist.net/images/characters/2/327920.jpg",
  "phase2_kurapika": "https://cdn.myanimelist.net/images/characters/3/549312.jpg",
  "phase2_hisoka_morow": "https://cdn.myanimelist.net/images/characters/3/174561.jpg"
};
const characterArtCache=new Map(),characterArtJobs=new Map();
let characterVisibleLimit=16;
function characterArtQuery(c){return ANIME_ART_QUERY[c.id]||c.lookup||c.name}
function matchName(name,target){
 const clean=x=>String(x||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,' ').trim();
 const a=clean(name),b=clean(target),words=b.split(' ').filter(x=>x.length>1);
 return a===b||words.filter(w=>a.includes(w)).length>=Math.max(1,Math.ceil(words.length*.66));
}
async function findAniListArt(query){
 const payload={query:'query ($search:String){Character(search:$search){name{full native alternative}image{large medium}}}',variables:{search:query}};
 const response=await fetch('https://graphql.anilist.co',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)});
 if(!response.ok)throw Error('AniList response '+response.status);
 const data=await response.json(),character=data.data?.Character;
 if(!character||!matchName([character.name.full,...(character.name.alternative||[])].join(' '),query))throw Error('AniList name mismatch');
 return character.image?.large||character.image?.medium||null;
}
async function findJikanArt(query){
 const response=await fetch('https://api.jikan.moe/v4/characters?q='+encodeURIComponent(query)+'&limit=8');
 if(!response.ok)throw Error('Jikan response '+response.status);
 const data=await response.json();
 const match=(data.data||[]).find(p=>matchName(p.name,query)||matchName((p.name_kanji||'')+' '+(p.nicknames||[]).join(' '),query));
 return match?.images?.webp?.image_url||match?.images?.jpg?.image_url||null;
}
async function getCharacterArt(c,skipVerified=false){
 if(!skipVerified&&VERIFIED_CHARACTER_IMAGE_URLS[c.id])return VERIFIED_CHARACTER_IMAGE_URLS[c.id];
 const old=characterArtCache.get(c.id);
 if(old&&old.exp>Date.now())return old.url;
 if(characterArtJobs.has(c.id))return characterArtJobs.get(c.id);
 const job=(async()=>{
  const query=characterArtQuery(c);
  let url=null;
  try{url=await findAniListArt(query)}catch{}
  if(!url)try{url=await findJikanArt(query)}catch{}
  if(url){characterArtCache.set(c.id,{url,exp:Date.now()+86400000*7});return url}
  characterArtCache.set(c.id,{url:null,exp:Date.now()+120000});
  return null;
 })().finally(()=>characterArtJobs.delete(c.id));
 characterArtJobs.set(c.id,job);
 return job;
}
function loadCharacterArt(root=document){
 const nodes=[...root.querySelectorAll('[data-character-art]')];
 const load=async el=>{
  const id=el.dataset.characterArt,c=CHARACTERS.find(x=>x.id===id);
  if(!c||el.dataset.loading==='1'||el.classList.contains('has-portrait'))return;
  el.dataset.loading='1';
  const display=(url,tryBackup)=>{
   if(!url||!el.isConnected)return false;
   const img=new Image();img.loading='lazy';img.decoding='async';
   img.alt=c.name+' character portrait';img.referrerPolicy='no-referrer';
   img.onload=()=>{
    if(!el.isConnected)return;
    el.querySelectorAll('img').forEach(node=>node.remove());
    el.prepend(img);el.classList.add('has-portrait');el.classList.remove('art-unavailable');
    el.dataset.loading='0';
   };
   img.onerror=async()=>{
    if(!el.isConnected)return;
    if(tryBackup){
     const fallback=await getCharacterArt(c,true);
     if(fallback&&fallback!==url){display(fallback,false);return}
    }
    el.dataset.loading='0';el.classList.add('art-unavailable');
    const note=el.querySelector('.character-loading small');
    if(note)note.textContent='Portrait unavailable';
   };
   img.src=url;return true;
  };
  const first=await getCharacterArt(c);
  if(!display(first,true)){
   el.dataset.loading='0';el.classList.add('art-unavailable');
   const note=el.querySelector('.character-loading small');
   if(note)note.textContent='Portrait unavailable';
  }
 };
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries)if(entry.isIntersecting){observer.unobserve(entry.target);load(entry.target)}
  },{rootMargin:'280px'});
  nodes.forEach(el=>observer.observe(el));
 }else nodes.forEach(load);
}
function characterArtwork(c,o){
 const outfit=o?.name||'';
 return '<div class="character-art" data-character-art="'+esc(c.id)+'" title="'+esc(c.name)+(outfit?' · '+esc(outfit):'')+'">'+
  '<div class="character-loading"><span>'+esc(c.name)+'</span><small>Loading anime portrait…</small></div>'+
  (o&&o.id!==c.id+'-default'?'<div class="outfit-overlay">'+esc(outfit)+'</div>':'')+
  '</div>';
}

const LOCATIONS=[
 {id:'london',name:'London',wiki:'London',lat:51.5072,lon:-0.1276,cost:0,region:'Europe'},
 {id:'tbilisi',name:'Tbilisi',wiki:'Tbilisi',lat:41.7151,lon:44.8271,cost:25,region:'Asia'},
 {id:'tokyo',name:'Tokyo',wiki:'Tokyo',lat:35.6762,lon:139.6503,cost:30,region:'Asia'},
 {id:'seoul',name:'Seoul',wiki:'Seoul',lat:37.5665,lon:126.9780,cost:35,region:'Asia'},
 {id:'busan',name:'Busan',wiki:'Busan',lat:35.1796,lon:129.0756,cost:40,region:'Asia'},
 {id:'hongkong',name:'Hong Kong',wiki:'Hong_Kong',lat:22.3193,lon:114.1694,cost:45,region:'Asia'},
 {id:'singapore',name:'Singapore',wiki:'Singapore',lat:1.3521,lon:103.8198,cost:50,region:'Asia'},
 {id:'shanghai',name:'Shanghai',wiki:'Shanghai',lat:31.2304,lon:121.4737,cost:55,region:'Asia'},
 {id:'shenzhen',name:'Shenzhen',wiki:'Shenzhen',lat:22.5431,lon:114.0579,cost:60,region:'Asia'},
 {id:'beijing',name:'Beijing',wiki:'Beijing',lat:39.9042,lon:116.4074,cost:65,region:'Asia'},
 {id:'manila',name:'Manila',wiki:'Manila',lat:14.5995,lon:120.9842,cost:70,region:'Asia'},
 {id:'bohol',name:'Bohol',wiki:'Bohol',lat:9.8500,lon:124.1435,cost:75,region:'Asia'},
 {id:'coron',name:'Coron',wiki:'Coron,_Palawan',lat:12.0,lon:120.2,cost:80,region:'Asia'},
 {id:'bali',name:'Bali',wiki:'Bali',lat:-8.3405,lon:115.0920,cost:85,region:'Asia'},
 {id:'hanoi',name:'Hanoi',wiki:'Hanoi',lat:21.0278,lon:105.8342,cost:90,region:'Asia'},
 {id:'hochiminh',name:'Ho Chi Minh City',wiki:'Ho_Chi_Minh_City',lat:10.8231,lon:106.6297,cost:95,region:'Asia'},
 {id:'bangkok',name:'Bangkok',wiki:'Bangkok',lat:13.7563,lon:100.5018,cost:100,region:'Asia'},
 {id:'kualalumpur',name:'Kuala Lumpur',wiki:'Kuala_Lumpur',lat:3.1390,lon:101.6869,cost:105,region:'Asia'},
 {id:'almaty',name:'Almaty',wiki:'Almaty',lat:43.2389,lon:76.8897,cost:110,region:'Asia'},
 {id:'bishkek',name:'Bishkek',wiki:'Bishkek',lat:42.8746,lon:74.5698,cost:115,region:'Asia'},
 {id:'samarkand',name:'Samarkand',wiki:'Samarkand',lat:39.6542,lon:66.9597,cost:120,region:'Asia'},
 {id:'petra',name:'Petra',wiki:'Petra',lat:30.3285,lon:35.4444,cost:125,region:'Asia'},
 {id:'nairobi',name:'Nairobi',wiki:'Nairobi',lat:-1.2921,lon:36.8219,cost:130,region:'Africa'},
 {id:'capetown',name:'Cape Town',wiki:'Cape_Town',lat:-33.9249,lon:18.4241,cost:135,region:'Africa'},
 {id:'cusco',name:'Cusco',wiki:'Cusco',lat:-13.5319,lon:-71.9675,cost:140,region:'South America'},
 {id:'machupicchu',name:'Machu Picchu',wiki:'Machu_Picchu',lat:-13.1631,lon:-72.5450,cost:150,region:'South America'},
 {id:'rio',name:'Rio de Janeiro',wiki:'Rio_de_Janeiro',lat:-22.9068,lon:-43.1729,cost:155,region:'South America'},
 {id:'newyork',name:'New York City',wiki:'New_York_City',lat:40.7128,lon:-74.0060,cost:160,region:'North America'},
 {id:'vancouver',name:'Vancouver',wiki:'Vancouver',lat:49.2827,lon:-123.1207,cost:165,region:'North America'},
 {id:'reykjavik',name:'Reykjavík',wiki:'Reykjavík',lat:64.1466,lon:-21.9426,cost:170,region:'Europe'},
 {id:'sydney',name:'Sydney',wiki:'Sydney',lat:-33.8688,lon:151.2093,cost:175,region:'Oceania'},
 {id:'kyoto',name:'Kyoto',wiki:'Kyoto',lat:35.0116,lon:135.7681,cost:180,region:'Asia'},
 {id:'gyeongju',name:'Gyeongju',wiki:'Gyeongju',lat:35.8562,lon:129.2247,cost:185,region:'Asia'},
 {id:'taipei',name:'Taipei',wiki:'Taipei',lat:25.0330,lon:121.5654,cost:190,region:'Asia'},
 {id:'angkor',name:'Angkor Wat',wiki:'Angkor_Wat',lat:13.4125,lon:103.8670,cost:195,region:'Asia'},
 {id:'dubai',name:'Dubai',wiki:'Dubai',lat:25.2048,lon:55.2708,cost:200,region:'Asia'},
 {id:'istanbul',name:'Istanbul',wiki:'Istanbul',lat:41.0082,lon:28.9784,cost:205,region:'Europe'},
 {id:'venice',name:'Venice',wiki:'Venice',lat:45.4408,lon:12.3155,cost:210,region:'Europe'},
 {id:'paris',name:'Paris',wiki:'Paris',lat:48.8566,lon:2.3522,cost:215,region:'Europe'},
 {id:'edinburgh',name:'Edinburgh',wiki:'Edinburgh',lat:55.9533,lon:-3.1883,cost:220,region:'Europe'},
 {id:'dublin',name:'Dublin',wiki:'Dublin',lat:53.3498,lon:-6.2603,cost:225,region:'Europe'},
 {id:'rome',name:'Rome',wiki:'Rome',lat:41.9028,lon:12.4964,cost:230,region:'Europe'},
 {id:'barcelona',name:'Barcelona',wiki:'Barcelona',lat:41.3874,lon:2.1686,cost:235,region:'Europe'},
 {id:'lisbon',name:'Lisbon',wiki:'Lisbon',lat:38.7223,lon:-9.1393,cost:240,region:'Europe'},
 {id:'amsterdam',name:'Amsterdam',wiki:'Amsterdam',lat:52.3676,lon:4.9041,cost:245,region:'Europe'},
 {id:'prague',name:'Prague',wiki:'Prague',lat:50.0755,lon:14.4378,cost:250,region:'Europe'},
 {id:'vienna',name:'Vienna',wiki:'Vienna',lat:48.2082,lon:16.3738,cost:255,region:'Europe'},
 {id:'athens',name:'Athens',wiki:'Athens',lat:37.9838,lon:23.7275,cost:260,region:'Europe'},
 {id:'zurich',name:'Zürich',wiki:'Zürich',lat:47.3769,lon:8.5417,cost:265,region:'Europe'},
 {id:'stockholm',name:'Stockholm',wiki:'Stockholm',lat:59.3293,lon:18.0686,cost:270,region:'Europe'},
 {id:'dubrovnik',name:'Dubrovnik',wiki:'Dubrovnik',lat:42.6507,lon:18.0944,cost:275,region:'Europe'},
 {id:'budapest',name:'Budapest',wiki:'Budapest',lat:47.4979,lon:19.0402,cost:280,region:'Europe'},
 {id:'marrakech',name:'Marrakesh',wiki:'Marrakesh',lat:31.6295,lon:-7.9811,cost:285,region:'Africa'},
 {id:'fes',name:'Fez',wiki:'Fez,_Morocco',lat:34.0646,lon:-5,cost:290,region:'Africa'},
 {id:'cairo',name:'Cairo',wiki:'Cairo',lat:30.0444,lon:31.2357,cost:295,region:'Africa'},
 {id:'luxor',name:'Luxor',wiki:'Luxor',lat:25.6872,lon:32.6396,cost:300,region:'Africa'},
 {id:'alexandria',name:'Alexandria',wiki:'Alexandria',lat:31.2001,lon:29.9187,cost:305,region:'Africa'},
 {id:'tunis',name:'Tunis',wiki:'Tunis',lat:36.8065,lon:10.1815,cost:310,region:'Africa'},
 {id:'dakar',name:'Dakar',wiki:'Dakar',lat:14.6928,lon:-17.4467,cost:315,region:'Africa'},
 {id:'accra',name:'Accra',wiki:'Accra',lat:5.6037,lon:-0.187,cost:320,region:'Africa'},
 {id:'lagos',name:'Lagos',wiki:'Lagos',lat:6.5244,lon:3.3792,cost:325,region:'Africa'},
 {id:'addis',name:'Addis Ababa',wiki:'Addis_Ababa',lat:9.03,lon:38.74,cost:330,region:'Africa'},
 {id:'zanzibar',name:'Stone Town, Zanzibar',wiki:'Stone_Town',lat:-6.1639,lon:39.1931,cost:335,region:'Africa'},
 {id:'victoriafalls',name:'Victoria Falls',wiki:'Victoria_Falls',lat:-17.9243,lon:25.8572,cost:340,region:'Africa'},
 {id:'sossusvlei',name:'Sossusvlei',wiki:'Sossusvlei',lat:-24.7269,lon:15.2935,cost:345,region:'Africa'},
 {id:'mahe',name:'Mahé',wiki:'Mahé,_Seychelles',lat:-4.6796,lon:55.492,cost:350,region:'Africa'},
 {id:'antananarivo',name:'Antananarivo',wiki:'Antananarivo',lat:-18.8792,lon:47.5079,cost:355,region:'Africa'},
 {id:'portlouis',name:'Port Louis',wiki:'Port_Louis',lat:-20.1609,lon:57.5012,cost:360,region:'Africa'},
 {id:'toronto',name:'Toronto',wiki:'Toronto',lat:43.6532,lon:-79.3832,cost:365,region:'North America'},
 {id:'montreal',name:'Montréal',wiki:'Montreal',lat:45.5017,lon:-73.5673,cost:370,region:'North America'},
 {id:'quebec',name:'Québec City',wiki:'Quebec_City',lat:46.8139,lon:-71.208,cost:375,region:'North America'},
 {id:'chicago',name:'Chicago',wiki:'Chicago',lat:41.8781,lon:-87.6298,cost:380,region:'North America'},
 {id:'washingtondc',name:'Washington, DC',wiki:'Washington,_D.C.',lat:38.9072,lon:-77.0369,cost:385,region:'North America'},
 {id:'sanfrancisco',name:'San Francisco',wiki:'San_Francisco',lat:37.7749,lon:-122.4194,cost:390,region:'North America'},
 {id:'losangeles',name:'Los Angeles',wiki:'Los_Angeles',lat:34.0522,lon:-118.2437,cost:395,region:'North America'},
 {id:'mexicocity',name:'Mexico City',wiki:'Mexico_City',lat:19.4326,lon:-99.1332,cost:400,region:'North America'},
 {id:'oaxaca',name:'Oaxaca',wiki:'Oaxaca_City',lat:17.0732,lon:-96.7266,cost:405,region:'North America'},
 {id:'chichenitza',name:'Chichén Itzá',wiki:'Chichen_Itza',lat:20.6843,lon:-88.5678,cost:410,region:'North America'},
 {id:'havana',name:'Havana',wiki:'Havana',lat:23.1136,lon:-82.3666,cost:415,region:'North America'},
 {id:'antiguaguatemala',name:'Antigua Guatemala',wiki:'Antigua_Guatemala',lat:14.5586,lon:-90.7333,cost:420,region:'North America'},
 {id:'sanjosecr',name:'San José, Costa Rica',wiki:'San_José,_Costa_Rica',lat:9.9281,lon:-84.0907,cost:425,region:'North America'},
 {id:'panamacity',name:'Panama City',wiki:'Panama_City',lat:8.9824,lon:-79.5199,cost:430,region:'North America'},
 {id:'banff',name:'Banff National Park',wiki:'Banff_National_Park',lat:51.4968,lon:-115.9281,cost:435,region:'North America'},
 {id:'yellowstone',name:'Yellowstone National Park',wiki:'Yellowstone_National_Park',lat:44.428,lon:-110.5885,cost:440,region:'North America'},
 {id:'buenosaires',name:'Buenos Aires',wiki:'Buenos_Aires',lat:-34.6037,lon:-58.3816,cost:445,region:'South America'},
 {id:'iguazu',name:'Iguazú Falls',wiki:'Iguazu_Falls',lat:-25.6953,lon:-54.4367,cost:450,region:'South America'},
 {id:'santiago',name:'Santiago',wiki:'Santiago',lat:-33.4489,lon:-70.6693,cost:455,region:'South America'},
 {id:'atacama',name:'San Pedro de Atacama',wiki:'San_Pedro_de_Atacama',lat:-22.9087,lon:-68.1997,cost:460,region:'South America'},
 {id:'torres',name:'Torres del Paine',wiki:'Torres_del_Paine_National_Park',lat:-50.9423,lon:-73.4068,cost:465,region:'South America'},
 {id:'lapaz',name:'La Paz',wiki:'La_Paz',lat:-16.4897,lon:-68.1193,cost:470,region:'South America'},
 {id:'uyuni',name:'Salar de Uyuni',wiki:'Salar_de_Uyuni',lat:-20.1338,lon:-67.4891,cost:475,region:'South America'},
 {id:'lima',name:'Lima',wiki:'Lima',lat:-12.0464,lon:-77.0428,cost:480,region:'South America'},
 {id:'bogota',name:'Bogotá',wiki:'Bogotá',lat:4.711,lon:-74.0721,cost:485,region:'South America'},
 {id:'cartagena',name:'Cartagena',wiki:'Cartagena,_Colombia',lat:10.391,lon:-75.4794,cost:490,region:'South America'},
 {id:'medellin',name:'Medellín',wiki:'Medellín',lat:6.2442,lon:-75.5812,cost:495,region:'South America'},
 {id:'quito',name:'Quito',wiki:'Quito',lat:-0.1807,lon:-78.4678,cost:500,region:'South America'},
 {id:'galapagos',name:'Galápagos Islands',wiki:'Galápagos_Islands',lat:-0.9538,lon:-90.9656,cost:505,region:'South America'},
 {id:'manaus',name:'Manaus',wiki:'Manaus',lat:-3.119,lon:-60.0217,cost:510,region:'South America'},
 {id:'montevideo',name:'Montevideo',wiki:'Montevideo',lat:-34.9011,lon:-56.1645,cost:515,region:'South America'},
 {id:'melbourne',name:'Melbourne',wiki:'Melbourne',lat:-37.8136,lon:144.9631,cost:520,region:'Oceania'},
 {id:'canberra',name:'Canberra',wiki:'Canberra',lat:-35.2809,lon:149.13,cost:525,region:'Oceania'},
 {id:'brisbane',name:'Brisbane',wiki:'Brisbane',lat:-27.4698,lon:153.0251,cost:530,region:'Oceania'},
 {id:'perth',name:'Perth',wiki:'Perth',lat:-31.9505,lon:115.8605,cost:535,region:'Oceania'},
 {id:'cairns',name:'Cairns',wiki:'Cairns',lat:-16.9186,lon:145.7781,cost:540,region:'Oceania'},
 {id:'adelaide',name:'Adelaide',wiki:'Adelaide',lat:-34.9285,lon:138.6007,cost:545,region:'Oceania'},
 {id:'hobart',name:'Hobart',wiki:'Hobart',lat:-42.8821,lon:147.3272,cost:550,region:'Oceania'},
 {id:'uluru',name:'Uluru',wiki:'Uluru',lat:-25.3444,lon:131.0369,cost:555,region:'Oceania'},
 {id:'greatbarrier',name:'Great Barrier Reef',wiki:'Great_Barrier_Reef',lat:-18.2871,lon:147.6992,cost:560,region:'Oceania'},
 {id:'whitsundays',name:'Whitsunday Islands',wiki:'Whitsunday_Islands',lat:-20.269,lon:148.9462,cost:565,region:'Oceania'},
 {id:'auckland',name:'Auckland',wiki:'Auckland',lat:-36.8485,lon:174.7633,cost:570,region:'Oceania'},
 {id:'wellington',name:'Wellington',wiki:'Wellington',lat:-41.2865,lon:174.7762,cost:575,region:'Oceania'},
 {id:'queenstown',name:'Queenstown',wiki:'Queenstown,_New_Zealand',lat:-45.0312,lon:168.6626,cost:580,region:'Oceania'},
 {id:'rotorua',name:'Rotorua',wiki:'Rotorua',lat:-38.1368,lon:176.2497,cost:585,region:'Oceania'},
 {id:'milfordsound',name:'Milford Sound',wiki:'Milford_Sound',lat:-44.6414,lon:167.8973,cost:590,region:'Oceania'},
 {id:'nadi',name:'Nadi',wiki:'Nadi',lat:-17.7765,lon:177.4356,cost:595,region:'Oceania'},
 {id:'borabora',name:'Bora Bora',wiki:'Bora_Bora',lat:-16.5004,lon:-151.7415,cost:600,region:'Oceania'},
 {id:'copenhagen',name:'Copenhagen',wiki:'Copenhagen',lat:55.6761,lon:12.5683,cost:605,region:'Europe'},
 {id:'bergen',name:'Bergen',wiki:'Bergen',lat:60.3913,lon:5.3221,cost:610,region:'Europe'},
 {id:'ljubljana',name:'Ljubljana',wiki:'Ljubljana',lat:46.0569,lon:14.5058,cost:615,region:'Europe'},
 {id:'chefchaouen',name:'Chefchaouen',wiki:'Chefchaouen',lat:35.1688,lon:-5.2697,cost:620,region:'Africa'},
 {id:'okavango',name:'Okavango Delta',wiki:'Okavango_Delta',lat:-19.3,lon:22.9,cost:625,region:'Africa'},
 {id:'kigali',name:'Kigali',wiki:'Kigali',lat:-1.9441,lon:30.0619,cost:630,region:'Africa'},
 {id:'grandcanyon',name:'Grand Canyon',wiki:'Grand_Canyon',lat:36.0566,lon:-112.1251,cost:635,region:'North America'},
 {id:'montegobay',name:'Montego Bay',wiki:'Montego_Bay',lat:18.4762,lon:-77.8939,cost:640,region:'North America'},
 {id:'anchorage',name:'Anchorage',wiki:'Anchorage,_Alaska',lat:61.2181,lon:-149.9003,cost:645,region:'North America'},
 {id:'peritomoreno',name:'Perito Moreno Glacier',wiki:'Perito_Moreno_Glacier',lat:-50.4967,lon:-73.1379,cost:650,region:'South America'},
 {id:'easterisland',name:'Rapa Nui',wiki:'Easter_Island',lat:-27.1479,lon:-109.427,cost:655,region:'South America'},
 {id:'valparaiso',name:'Valparaíso',wiki:'Valparaíso',lat:-33.0472,lon:-71.6127,cost:660,region:'South America'},
 {id:'apia',name:'Apia',wiki:'Apia',lat:-13.8333,lon:-171.7667,cost:665,region:'Oceania'},
 {id:'portvila',name:'Port Vila',wiki:'Port_Vila',lat:-17.7333,lon:168.3273,cost:670,region:'Oceania'},
 {id:'papeete',name:'Papeete',wiki:'Papeete',lat:-17.5516,lon:-149.5585,cost:675,region:'Oceania'}
];

const EARTH_TEXTURE_URL='https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Blue_Marble_2002.jpg/1280px-Blue_Marble_2002.jpg';
const earthTexture=new Image();earthTexture.crossOrigin='anonymous';let earthTextureReady=false,earthPixels=null,earthW=0,earthH=0;earthTexture.onload=()=>{try{const t=document.createElement('canvas');t.width=720;t.height=360;const x=t.getContext('2d',{willReadFrequently:true});x.drawImage(earthTexture,0,0,t.width,t.height);earthPixels=x.getImageData(0,0,t.width,t.height).data;earthW=t.width;earthH=t.height;earthTextureReady=true}catch{earthTextureReady=false}drawGlobe()};earthTexture.src=EARTH_TEXTURE_URL;
const wikiPhotoCache={};

function load(k,f){try{const x=JSON.parse(localStorage.getItem(k));return x??f}catch{return f}}
function save(){localStorage.setItem(PROGRESS_KEY,JSON.stringify(progress));localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings))}
function ensureProfile(){
 profile.daily=profile.daily||{};profile.examResults=profile.examResults||{};profile.topicWeakness=profile.topicWeakness||{};profile.topicStats=profile.topicStats||{};
 profile.errorLog=profile.errorLog||[];profile.dailyChallenges=profile.dailyChallenges||{};profile.challengeStreak=profile.challengeStreak||0;profile.lastChallengeDate=profile.lastChallengeDate||'';
 profile.shopOwned=profile.shopOwned||{};profile.shopOwned.characters=(profile.shopOwned.characters||[]).filter(id=>CHARACTERS.some(c=>c.id===id));profile.shopOwned.outfits=(profile.shopOwned.outfits||[]).filter(id=>OUTFITS.some(o=>o.id===id));profile.shopOwned.locations=(profile.shopOwned.locations||[]).filter(id=>LOCATIONS.some(l=>l.id===id));if(!profile.shopOwned.characters.length)profile.shopOwned.characters=['lelouch'];if(!profile.shopOwned.outfits.length)profile.shopOwned.outfits=['lelouch-default'];if(!profile.shopOwned.locations.includes('london'))profile.shopOwned.locations.unshift('london');if(!CHARACTERS.some(c=>c.id===profile.equippedCharacter))profile.equippedCharacter=profile.shopOwned.characters[0]||'lelouch';if(!OUTFITS.some(o=>o.id===profile.equippedOutfit&&o.character===profile.equippedCharacter))profile.equippedOutfit=profile.equippedCharacter+'-default';profile.equippedLocation=LOCATIONS.some(l=>l.id===profile.equippedLocation)?profile.equippedLocation:'london';
 if(profile.economyVersion!==2){profile.lifetimeXp=0;profile.points=0;profile.economyVersion=2}
 profile.lifetimeXp=profile.lifetimeXp||0;profile.points=profile.points||0;profile.reviews=profile.reviews||0;
 settings.dailyNew=settings.dailyNew||18;settings.physicsUnits=settings.physicsUnits||{};
}
function now(){return Date.now()} function dateKey(t=Date.now()){return new Date(t).toISOString().slice(0,10)}
function clamp(x,a,b){return Math.max(a,Math.min(b,x))} function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function daily(){const k=dateKey();if(!profile.daily[k])profile.daily[k]={reviews:0,newCards:0,flashCorrect:0,examMarks:0};return profile.daily[k]}
function state(id){const x=progress[id]||{};return {stage:-1,due:0,mastered:false,again:0,hard:0,good:0,last:0,firstSeen:'',stability:0,difficulty:5,history:[],...x}}
function setState(id,s){progress[id]=s}
function showToast(m){const e=document.getElementById('toast');e.textContent=m;e.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove('show'),1700)}
function award(points,reason=''){points=Math.max(0,Math.floor(points));if(!points)return;profile.lifetimeXp+=points;profile.points+=points;daily().examMarks+=reason==='exam'?points:0;save();showToast('+'+points+' point'+(points===1?'':'s')+' · +'+points+' XP')}
function levelInfo(xp){
 let level=1,into=xp;
 while(level<500){const req=10+5*(level-1);if(into<req)return {level,into,req};into-=req;level++}
 return {level:500,into:0,req:0};
}
function memoryHealth(c){const s=state(c.id);if(s.stage<0)return 0;if(!s.last)return .5;const stability=Math.max(.25,s.stability||3),elapsed=Math.max(0,(now()-s.last)/DAY);return clamp(Math.exp(-0.1053605*elapsed/stability),0,1)}
function topicKey(s,t){return s+'|'+t}
function topicStat(s,t){const k=topicKey(s,t);if(!profile.topicStats[k])profile.topicStats[k]={attempts:0,success:0,examMarks:0,examMax:0,last:0,lastMiss:0};return profile.topicStats[k]}
function weakness(c){const s=state(c.id),specific=profile.topicWeakness[topicKey(c.subject,c.revisionTopic||c.topic)]||0,legacy=profile.topicWeakness[topicKey(c.subject,c.courseTopic||c.topic)]||0;return (c.priority||1)*3+(s.again||0)*2.6+(s.hard||0)*1.6+specific*2+legacy*.4+(1-memoryHealth(c))*8-(s.good||0)*.2}
function isDue(c){const s=state(c.id);return s.stage>=0&&(s.due||0)<=now()} function isNew(c){return state(c.id).stage<0}
function addError(e){profile.errorLog.unshift({...e,date:now()});if(profile.errorLog.length>400)profile.errorLog.length=400}

async function sha256(s){const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('')}
async function unlock(pin,remember){
 const h=await sha256('revision-loop|'+pin);if(h!==PIN_HASH)return false;
 if(remember)localStorage.setItem('rl_auth','1');else sessionStorage.setItem('rl_auth','1');
 document.getElementById('authGate').classList.add('hidden');document.getElementById('app').classList.remove('app-locked');return true;
}
function lockApp(){localStorage.removeItem('rl_auth');sessionStorage.removeItem('rl_auth');document.getElementById('authGate').classList.remove('hidden');document.getElementById('app').classList.add('app-locked');document.getElementById('pinInput').value='';document.getElementById('pinInput').focus()}

function initPhysicsUnits(){(deckMeta.physicsUnits||[]).forEach(u=>{if(settings.physicsUnits[u.id]===undefined)settings.physicsUnits[u.id]=!!u.defaultUnlocked})}
function physicsUnlocked(c){if(c.subject!=='Physics'||!c.unit)return true;const u=(deckMeta.physicsUnits||[]).find(x=>x.id===c.unit);return settings.physicsUnits[c.unit]!==undefined?settings.physicsUnits[c.unit]!==false:(u?!!u.defaultUnlocked:true)}
function taughtCard(c){return c.taught===true}
function subjectCards(sub){return cards.filter(c=>c.active!==false&&c.subject===sub)}
function subjectExam(sub){
 const level=document.getElementById('examLevel')?.value||'both';
 return examQuestions.filter(q=>q.subject===sub&&q.standalone!==false&&(level==='both'||q.level===level));
}

function normalise(x){
 let s=String(x||'').normalize('NFKD').toLowerCase();
 const r=[
  [/θ/g,' theta '],[/λ/g,' lambda '],[/ρ/g,' rho '],[/δ|Δ/g,' delta '],[/φ/g,' phi '],[/ε/g,' epsilon '],
  [/²/g,'^2'],[/³/g,'^3'],[/−|–|—/g,'-'],[/×|·/g,' * '],[/÷/g,' / '],
  [/\bcosine\b/g,'cos'],[/\bsine\b/g,'sin'],[/\btangent\b/g,'tan'],[/\bperp\b/g,'perpendicular'],
  [/\bdegrees?\b/g,' degree '],[/\bnewtons?\b/g,' n '],[/\bjoules?\b/g,' j '],[/\bvolts?\b/g,' v ']
 ];
 r.forEach(a=>s=s.replace(a[0],a[1]));
 s=s.replace(/([a-z0-9])(cos|sin|tan)(?=\s*theta\b)/g,'$1 $2');
 return s.replace(/[^a-z0-9+\-*/=<>^.[\] ]+/g,' ').replace(/\s+/g,' ').trim();
}
const STOP=new Set(['the','a','an','of','to','and','in','is','are','with','at','on','for','from','by','it','be','as','or','that','this','using','use','one','each','then','so','a','an']);
const SYN=[
 ['resultant','net'],
 ['equal','same','identical'],
 ['opposite','reverse'],
 ['increase','increases','greater','larger','higher','rise','rises'],
 ['decrease','decreases','smaller','lower','fall','falls','reduce','reduced'],
 ['velocity','velocities'],
 ['acceleration','accelerate','accelerates','accelerating'],
 ['force','forces'],
 ['collision','collisions','collide','collides'],
 ['momentum','momenta'],
 ['resistance','resistor'],
 ['current','charge flow'],
 ['potential difference','pd','voltage'],
 ['electromotive force','emf'],
 ['amount','moles','mole'],
 ['concentration','molarity'],
 ['perpendicular','normal'],
 ['parallel','same direction'],
 ['different objects','different bodies','separate objects'],
 ['same type','same interaction'],
 ['mass times acceleration','ma','m*a'],
 ['rate of change','change per second'],
 ['random','unpredictable'],
 ['systematic','consistent'],
 ['uncertainty','error range'],
 ['gradient','slope'],
 ['intercept','axis intercept']
];
const OPPOSITES=[
 ['increase','decrease'],['higher','lower'],['greater','smaller'],['positive','negative'],
 ['attract','repel'],['attractive','repulsive'],['parallel','perpendicular'],
 ['clockwise','anticlockwise'],['gain','lose'],['gains','loses'],['absorbed','emitted'],
 ['constructive','destructive'],['maximum','minimum']
];
function hasMeaning(text,word){
 const nt=' '+normalise(text)+' ',nw=' '+normalise(word)+' ';
 return nt.includes(nw)||normalise(text).split(' ').includes(normalise(word));
}
function contradicts(answer,point){
 for(const [a,b] of OPPOSITES){
   const pa=hasMeaning(point,a),pb=hasMeaning(point,b),aa=hasMeaning(answer,a),ab=hasMeaning(answer,b);
   if((pa&&ab&&!aa)||(pb&&aa&&!ab))return true;
 }
 return false;
}
function stemToken(t){
 if(t.length>6&&t.endsWith('ing'))return t.slice(0,-3);
 if(t.length>5&&t.endsWith('ied'))return t.slice(0,-3)+'y';
 if(t.length>5&&t.endsWith('ed'))return t.slice(0,-2);
 if(t.length>5&&t.endsWith('es'))return t.slice(0,-2);
 if(t.length>4&&t.endsWith('s'))return t.slice(0,-1);
 return t;
}
function synonymSet(t){
 const n=normalise(t);
 for(const g of SYN) if(g.some(x=>normalise(x)===n)) return g.map(normalise);
 return [n];
}
function tokens(x){return normalise(x).split(' ').filter(t=>t&&!STOP.has(t)).map(stemToken)}
function lev(a,b){const n=b.length;let p=Array.from({length:n+1},(_,i)=>i),c=new Array(n+1);for(let i=1;i<=a.length;i++){c[0]=i;for(let j=1;j<=n;j++)c[j]=Math.min(c[j-1]+1,p[j]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));[p,c]=[c,p]}return p[n]}
function close(a,b){
 a=stemToken(a);b=stemToken(b);
 if(a===b)return true;
 for(const x of synonymSet(a))for(const y of synonymSet(b))if(stemToken(x)===stemToken(y))return true;
 const m=Math.max(a.length,b.length),d=lev(a,b);
 return (m>=9&&d<=2)||(m>=5&&d<=1);
}
function phraseScore(input,p){
 const a=tokens(input),b=tokens(p);if(!b.length)return 0;
 let hits=0;for(const t of b)if(a.some(x=>close(x,t)))hits++;
 let score=hits/b.length;
 const ni=normalise(input),np=normalise(p);
 if(np.length>=5&&ni.includes(np))score=1;
 return score;
}
function compact(x){
 return normalise(x).replace(/\bwork\b/g,'w').replace(/\bforce\b/g,'f').replace(/\bdisplacement\b|\bdistance\b/g,'s')
 .replace(/\btheta\b/g,'t').replace(/\bepsilon\b/g,'e').replace(/\blambda\b/g,'l').replace(/\bdelta\b/g,'d')
 .replace(/\bcos\b/g,'c').replace(/\bsin\b/g,'s').replace(/\btan\b/g,'t')
 .replace(/\*/g,'').replace(/\s+/g,'');
}
function formulaScore(input,expected){
 const a=compact(input),b=compact(expected);
 if(!a||!b)return 0;
 if(a===b)return 1;
 if(a.replace(/=/g,'')===b.replace(/=/g,''))return .95;
 return phraseScore(input,expected);
}
function evaluateCard(c,input){
 if(!String(input||'').trim())return {status:'neutral',score:0,text:'Model answer shown. Compare it honestly.',missing:[]};
 let best=0,missing=[];
 for(const alt of (c.accept||[]))best=Math.max(best,formulaScore(input,alt),phraseScore(input,alt));
 if(c.concepts?.length){
   let hit=0;missing=[];
   for(const g of c.concepts){
     const opts=Array.isArray(g)?g:[g];let gb=0;
     for(const o of opts)gb=Math.max(gb,formulaScore(input,o),phraseScore(input,o));
     if(gb>=.6)hit++;else missing.push(opts[0]);
   }
   best=Math.max(best,hit/c.concepts.length);
 }
 if(!c.accept&&!c.concepts)best=Math.max(phraseScore(input,c.back),formulaScore(input,c.back));
 if(contradicts(input,c.back))best=Math.min(best,.25);
 if(best>=.78)return {status:'correct',score:best,text:'Correct. Equivalent wording, common notation and ordinary spelling mistakes are accepted.',missing:[]};
 if(best>=.45)return {status:'partial',score:best,text:'Partly correct. Check the missing key idea(s) below.',missing};
 return {status:'wrong',score:best,text:'Not enough of the required physics/chemistry/maths content matched yet.',missing};
}
function importantTokens(s){
 return tokens(s).filter(x=>x.length>=3&&!['mark','obtain','calculate','state','give','identify','use','correct','answer','approximately','about'].includes(x));
}
function markPointPrediction(answer,point){
 if(!String(answer||'').trim())return 0;
 if(contradicts(answer,point))return 0;
 const p=importantTokens(point),a=tokens(answer);if(!p.length)return 0;
 let hits=0;for(const target of p)if(a.some(x=>close(x,target)))hits++;
 let score=hits/p.length;
 // Compare complete numerical tokens, never substring digits: "12345" cannot
 // match "2", "3" and "4" or win multiple marks on its own.
 const pnums=(normalise(point).match(/(?<![\w.])[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?(?![\w.])/g)||[]);
 const anums=(normalise(answer).match(/(?<![\w.])[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?(?![\w.])/g)||[]);
 if(pnums.length&&anums.length){
  const nHits=pnums.filter(v=>anums.some(w=>{
    if(v===w)return true;
    const x=Number(v),y=Number(w);
    return Number.isFinite(x)&&Number.isFinite(y)&&Math.abs(x-y)<=Math.max(Math.abs(x)*.002,1e-12);
  })).length;
  if(nHits>0)score=Math.max(score,nHits/pnums.length);
 }
 const phrases=String(point).split(/\/|;|\bor\b/i).map(x=>x.trim()).filter(x=>x.length>4);
 for(const ph of phrases)score=Math.max(score,phraseScore(answer,ph));
 return clamp(score,0,1);
}

function parseNumber(s){
 let x=String(s||'').replace(/[−–—]/g,'-').replace(/×|·/g,'x').replace(/,/g,'');
 const supmap={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-','⁺':'+'};
 // Typed scientific notation also arrives with true superscript exponents.
 x=x.replace(/10([⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+)/g,(_,sup)=>'10^'+[...sup].map(ch=>supmap[ch]).join(''));
 x=x.replace(/10\s*\^\s*\(\s*([-+]?\d+)\s*\)/g,'10^$1');

 // Remove trailing dimensional indices: mol-1, cm3, kg m-2 and s^-1 are units, not final answers.
 x=x.replace(/\b(?:mol|kg|cm|mm|dm|km|ms|hz|m|s)\s*(?:\^\s*)?[-+]?\d+\b/gi,' ');
 // Also recognise standalone fractions such as 2/3, without misreading the denominator as the final answer.
 const fraction=x.trim().match(/^(?:(?:[a-zA-Z]\w*|[a-zA-Z]\([^)]*\))\s*=\s*)?([-+]?\d+(?:\.\d+)?)\s*\/\s*([-+]?\d+(?:\.\d+)?)\s*(?:[a-zA-ZµμΩ%°\s]+)?$/);
 if(fraction&&Number(fraction[2])!==0)return Number(fraction[1])/Number(fraction[2]);
 const pat=/[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:\s*(?:x|\*)\s*10\s*\^\s*[-+]?\d+|e[-+]?\d+)?/gi;
 const values=[...x.matchAll(pat)].map(m=>{
  const z=m[0].replace(/\s/g,'');
  const sci=z.match(/^([-+]?(?:\d+(?:\.\d*)?|\.\d+))(?:x|\*)10\^([-+]?\d+)$/i);
  return sci?Number(sci[1])*10**Number(sci[2]):Number(z);
 }).filter(Number.isFinite);
 return values.length?values[values.length-1]:NaN;
}
function numericMatch(q,answer){
 if(q.answerType!=='numeric'||!Number.isFinite(q.numericAnswer))return false;
 let text=String(answer||'').trim();
 if(!text)return false;
 // Remove final presentation notes which are not numerical answers.
 text=text.replace(/\(\s*\d+\s*(?:s\.?f\.?|significant\s+figures?)\s*\)\s*$/i,'').trim();
 text=text.replace(/(?:\s*,?\s*valid\s+(?:since|because)\s+[a-z]+\s*[><]\s*\d+(?:\.\d+)?)\s*$/i,'').trim();
 let n=parseNumber(text);
 const expected=q.numericAnswer,tol=Number.isFinite(q.tolerance)?q.tolerance:Math.max(Math.abs(expected)*.01,1e-9);
 if(Number.isFinite(n)&&Math.abs(n-expected)<=tol)return true;
 // SI-unit equivalence: 2.94 kW and 2940 W may represent the same power.
 const unit=text.match(/([-+]?(?:\d+(?:\.\d*)?|\.\d+))\s*(kW|kJ|km|cm|mm|mW|mJ|mA|ms|µs|μs|nm|kPa|MPa)\s*$/i);
 if(unit){
  const scale={kw:1e3,kj:1e3,km:1e3,cm:1e-2,mm:1e-3,mw:1e-3,mj:1e-3,ma:1e-3,ms:1e-3,'µs':1e-6,'μs':1e-6,nm:1e-9,kpa:1e3,mpa:1e6}[unit[2].toLowerCase()];
  if(scale&&Math.abs(Number(unit[1])*scale-expected)<=tol)return true;
 }
 // A ratio and its percentage increase can both be correct: 1.6 times = 60% greater.
 const ratio=text.match(/([-+]?(?:\d+(?:\.\d*)?|\.\d+)).*?\(\s*([-+]?\d+(?:\.\d+)?)\s*%\s*(?:increase|greater|more)?\s*\)\s*$/i);
 if(ratio&&Math.abs(Number(ratio[1])-expected)<=tol&&Math.abs(Number(ratio[2])-(expected-1)*100)<.3)return true;
 // Accept simple exact mathematical forms such as 4π or π/2.
 const exact=text.replace(/\s/g,'').match(/(?:^|=)([-+]?(?:\d+(?:\.\d*)?)?)\*?(?:π|pi)(?:\/(\d+(?:\.\d+)?))?(?:[a-zA-Z]*)$/i);
 if(exact){
  const m=(exact[1]===''||exact[1]==='+')?1:exact[1]==='-'?-1:Number(exact[1]);
  const value=m*Math.PI/(exact[2]?Number(exact[2]):1);
  if(Number.isFinite(value)&&Math.abs(value-expected)<=tol)return true;
 }
 return false;
}

function nextSchedule(s,rating){const old=Math.max(.25,s.stability||0),elapsed=s.last?Math.max(0,(now()-s.last)/DAY):0,over=old?clamp(elapsed/old,0,2):0;let stability=old,difficulty=clamp(s.difficulty||5,1,10),days;if(rating==='again'){difficulty=clamp(difficulty+.7,1,10);stability=Math.max(.25,old*.35);days=10/1440}else if(rating==='hard'){difficulty=clamp(difficulty+.2,1,10);stability=Math.max(1,old?old*1.12:1);days=Math.min(stability,1)}else if(rating==='good'){difficulty=clamp(difficulty-.08,1,10);stability=s.stage<0?3:clamp(old*(1.72+.12*over-.035*(difficulty-5)),2,365);days=stability}else{difficulty=clamp(difficulty-.3,1,10);stability=s.stage<0?7:clamp(old*(2.3+.12*over-.025*(difficulty-5)),4,365);days=stability}return {stability,difficulty,days}}
function rateCard(c,rating,answer){
 const s=state(c.id),prev=s.last||0,wasNew=s.stage<0,sch=nextSchedule(s,rating);s.last=now();s.stability=sch.stability;s.difficulty=sch.difficulty;s.due=now()+sch.days*DAY;s.stage=Math.max(0,s.stage)+(rating==='good'?1:rating==='easy'?2:0);s.mastered=s.stability>=60&&(s.good||0)>=2;if(wasNew&&!s.firstSeen){s.firstSeen=dateKey();daily().newCards++}if(rating==='again')s.again++;else if(rating==='hard')s.hard++;else s.good++;s.history=s.history||[];s.history.push({t:now(),rating,answer:String(answer||'').slice(0,250),stability:s.stability});if(s.history.length>40)s.history=s.history.slice(-40);setState(c.id,s);
 const ts=topicStat(c.subject,c.revisionTopic||c.topic);ts.attempts++;ts.last=now();if(currentEvaluation?.status==='correct')ts.success++;else if(rating==='again'||rating==='hard')ts.lastMiss=now();
 if((rating==='again'||rating==='hard')&&currentEvaluation?.status!=='correct')addError({type:'card',id:c.id,subject:c.subject,topic:c.revisionTopic||c.topic,result:rating,answer:String(answer||'').slice(0,300),missing:currentEvaluation?.missing||[],longGap:prev&&((now()-prev)/DAY>30)});
 profile.reviews++;daily().reviews++;save();advanceSession();
}
function awardFlashIfCorrect(){
 if(currentFlashAwarded||currentEvaluation?.status!=='correct')return;currentFlashAwarded=true;award(1,'flash');daily().flashCorrect++;
}
function overrideFlashCorrect(){
 if(currentEvaluation?.status==='correct')return;currentEvaluation={status:'correct',score:1,text:'Marked correct by you.',missing:[]};awardFlashIfCorrect();const f=document.getElementById('feedback');f.className='feedback show correct';f.textContent='Marked correct by you. +1 point / +1 XP.';document.getElementById('overrideBtn').classList.remove('show')
}

function weightedPick(items,n,weightFn){
 const pool=[...items],out=[];while(pool.length&&out.length<n){let total=0,ws=pool.map(x=>{const w=Math.max(.05,weightFn(x));total+=w;return w});let r=Math.random()*total,idx=0;for(;idx<ws.length;idx++){r-=ws[idx];if(r<=0)break}out.push(pool.splice(Math.min(idx,pool.length-1),1)[0])}return out;
}

function startMockSession(){
 const sub=document.getElementById('mockSubject').value,mode=document.getElementById('mockMode').value,count=Number(document.getElementById('mockCount').value);
 const cardPool=cards.filter(c=>c.active!==false&&c.subject===sub&&c.mock===true);
 const qAll=subjectExam(sub).filter(q=>q.mock===true||q.level==='AS');
 const groups=new Map();for(const q of qAll){if(!groups.has(q.groupId))groups.set(q.groupId,[]);groups.get(q.groupId).push(q)}
 for(const g of groups.values())g.sort((x,y)=>String(x.groupOrder).localeCompare(String(y.groupOrder),undefined,{numeric:true}));
 const items=[];
 if(mode!=='exam'){
   const want=mode==='flash'?count:Math.max(1,Math.ceil(count*.6));
   const picked=weightedPick(cardPool,Math.min(want,cardPool.length),c=>1+weakness(c)/5+(isDue(c)?4:0)+(1-memoryHealth(c))*3);
   picked.forEach(c=>items.push({type:'card',id:c.id}));
 }
 if(mode!=='flash'){
   const target=Math.max(1,count-items.length),pickedGroups=weightedPick([...groups.values()],Math.min(target,groups.size),g=>1+groupWeakness(g));
   for(const g of pickedGroups){for(const q of g){items.push({type:'exam',id:q.id,groupId:q.groupId})}}
 }
 if(!items.length){showToast('No mock material is available for that selection yet');return}
 if(mode==='mixed'){
   const blocks=[],seenGroups=new Set();
   for(const item of items){
     if(item.type==='exam'&&item.groupId){
       if(seenGroups.has(item.groupId))continue;
       seenGroups.add(item.groupId);
       blocks.push(items.filter(x=>x.type==='exam'&&x.groupId===item.groupId));
     }else blocks.push([item]);
   }
   blocks.sort(()=>Math.random()-.5);
   items.splice(0,items.length,...blocks.flat());
 }
 activeSession={kind:'mock',items,index:0,title:sub+' mock revision'};currentCardId=null;renderAll();
}
function selectedFlashCards(){const sub=document.getElementById('flashSubject').value,base=subjectCards(sub);return base.filter(c=>flashTopics.has(flashTopicLabel(c)))}
function startFlashSession(){
 const count=Number(document.getElementById('flashCount').value),pool=selectedFlashCards();if(!pool.length){showToast('Pick at least one topic');return}
 const picked=weightedPick(pool,Math.min(count,pool.length),c=>1+weakness(c)/6+(isDue(c)?4:0)+(isNew(c)?1:0));
 activeSession={kind:'flash',items:picked.map(c=>({type:'card',id:c.id})),index:0,title:'Random flashcards'};currentCardId=null;renderAll();
}
function examGroups(){
 const sub=document.getElementById('examSubject').value,level=document.getElementById('examLevel').value,all=subjectExam(sub).filter(q=>level==='both'||q.level===level);
 if(!examYears.size||!examTopics.size||!examTypes.size)return [];
 const eligibleGroupIds=new Set();
 for(const q of all){
   if(!examYears.has(q.year))continue;
   if(examTopics.has(examTopicLabel(q))&&examTypes.has(q.questionType))eligibleGroupIds.add(q.groupId);
 }
 const map=new Map();
 for(const q of all){
   if(!eligibleGroupIds.has(q.groupId)||!examYears.has(q.year))continue;
   if(!map.has(q.groupId))map.set(q.groupId,[]);
   map.get(q.groupId).push(q);
 }
 for(const arr of map.values())arr.sort((a,b)=>String(a.groupOrder).localeCompare(String(b.groupOrder),undefined,{numeric:true}));
 return [...map.values()];
}
function groupWeakness(group){let s=0;for(const q of group){const t=profile.topicWeakness[topicKey(q.subject,q.revisionTopic||q.topic)]||0,last=profile.examResults[q.id]?.last,acc=last?last.marks/last.max:0;s+=1+t*2+(1-acc)*4+(profile.errorLog.some(e=>e.type==='exam'&&e.id===q.id)?4:0)}return s/group.length}
function startExamSession(){
 const groups=examGroups(),count=Number(document.getElementById('examCount').value);if(!groups.length){showToast('No questions match those filters');return}
 let chosen;if(document.getElementById('examOrder').value==='random')chosen=[...groups].sort(()=>Math.random()-.5).slice(0,count);else chosen=weightedPick(groups,Math.min(count,groups.length),g=>1+groupWeakness(g));
 const items=[];for(const g of chosen)for(const q of g)items.push({type:'exam',id:q.id,groupId:q.groupId});
 activeSession={kind:'exam',items,index:0,title:'Random AQA exam questions'};renderAll();
}
function awardExam(q,marks,answer,missedPoints){
 const ts=topicStat(q.subject,q.revisionTopic||q.topic);ts.examMarks+=marks;ts.examMax+=q.marks;ts.attempts++;ts.last=now();if(marks<q.marks)ts.lastMiss=now();
 if(!profile.examResults[q.id])profile.examResults[q.id]={attempts:[]};const rec={marks,max:q.marks,date:now(),answer:String(answer||'').slice(0,1000),missedPoints};profile.examResults[q.id].attempts.push(rec);profile.examResults[q.id].last=rec;
 let w=profile.topicWeakness[topicKey(q.subject,q.revisionTopic||q.topic)]||0;if(marks/q.marks<.5)w=Math.min(10,w+2);else if(marks<q.marks)w=Math.min(10,w+1);else w=Math.max(0,w-1);profile.topicWeakness[topicKey(q.subject,q.revisionTopic||q.topic)]=w;
 if(marks<q.marks)addError({type:'exam',id:q.id,subject:q.subject,topic:q.revisionTopic||q.topic,result:marks+'/'+q.marks,answer:String(answer||'').slice(0,1000),missedPoints});
 award(marks,'exam');save();advanceSession();
}

function challengeCards(sub,scope){let a=cards.filter(c=>c.active!==false&&(!sub||c.subject===sub));return scope==='mock'?a.filter(c=>c.mock===true):a.filter(taughtCard)}
function challengeQuestions(sub,scope){let q=examQuestions.filter(x=>x.standalone!==false&&(!sub||x.subject===sub));if(scope==='mock')q=q.filter(x=>x.mock===true||x.level==='AS');return q}
function makeChallenge(sub,scope){
 const key=dateKey()+'|'+(sub||'All')+'|'+scope;if(profile.dailyChallenges[key])return {key,...profile.dailyChallenges[key]};
 const cpool=challengeCards(sub,scope),weak=[...cpool].sort((a,b)=>weakness(b)-weakness(a)),items=[],used=new Set();
 for(const c of weak){if(items.length>=3)break;const ct=c.courseTopic||c.topic;if(!used.has(ct)){items.push({type:'card',id:c.id});used.add(ct)}}
 const old=[...cpool].filter(c=>state(c.id).stage>=0&&!items.some(i=>i.id===c.id)).sort((a,b)=>(state(a.id).last||0)-(state(b.id).last||0));if(old[0])items.push({type:'card',id:old[0].id});
 const random=[...cpool].filter(c=>!items.some(i=>i.id===c.id)).sort(()=>Math.random()-.5);if(random[0])items.push({type:'card',id:random[0].id});
 const qgroups=new Map();for(const q of challengeQuestions(sub,scope)){if(!qgroups.has(q.groupId))qgroups.set(q.groupId,[]);qgroups.get(q.groupId).push(q)}
 const chosen=weightedPick([...qgroups.values()],2,g=>1+groupWeakness(g));for(const g of chosen){g.sort((a,b)=>String(a.groupOrder).localeCompare(String(b.groupOrder),undefined,{numeric:true}));for(const q of g)items.push({type:'exam',id:q.id,groupId:q.groupId})}
 const s={items,index:0,done:false,subject:sub||'',scope};profile.dailyChallenges[key]=s;save();return {key,...s};
}
function startChallenge(){const sub=document.getElementById('challengeSubject').value,scope=document.getElementById('challengeScope').value,s=makeChallenge(sub,scope);const stored=profile.dailyChallenges[s.key];if(stored.done)stored.index=0;activeSession={kind:'daily',key:s.key,...stored,title:'Daily starter'};switchPanel('study');renderAll()}
function startMistakes(){
 const items=[],seen=new Set();
 for(const e of profile.errorLog){
   if(items.length>=15)break;
   if(e.type==='exam'){
     const q=examQuestions.find(x=>x.id===e.id);if(!q)continue;
     const k='examgroup|'+q.groupId;if(seen.has(k))continue;seen.add(k);
     const group=examQuestions.filter(x=>x.groupId===q.groupId).sort((a,b)=>String(a.groupOrder).localeCompare(String(b.groupOrder),undefined,{numeric:true}));
     for(const part of group){if(items.length>=15)break;items.push({type:'exam',id:part.id,groupId:part.groupId})}
   }else{
     const k='card|'+e.id;if(seen.has(k))continue;seen.add(k);items.push({type:'card',id:e.id});
   }
 }
 if(!items.length){showToast('No mistakes recorded yet');return}
 activeSession={kind:'mistakes',items,index:0,title:'Mistake bank'};switchPanel('study');renderAll();
}
function advanceSession(){
 currentCardId=null;currentEvaluation=null;currentFlashAwarded=false;currentExamScore=0;
 if(!activeSession){renderAll();return}activeSession.index++;
 if(activeSession.kind==='daily'){const s=profile.dailyChallenges[activeSession.key];s.index=activeSession.index;if(activeSession.index>=activeSession.items.length){s.done=true;const today=dateKey(),y=new Date(Date.now()-DAY).toISOString().slice(0,10);if(profile.lastChallengeDate!==today){profile.challengeStreak=profile.lastChallengeDate===y?profile.challengeStreak+1:1;profile.lastChallengeDate=today}activeSession=null}else activeSession={...activeSession,index:s.index};save()}
 else if(activeSession.index>=activeSession.items.length)activeSession={...activeSession,done:true};
 renderAll();
}

function diagram(t){
 const S='<svg viewBox="0 0 360 170" aria-hidden="true">';
 if(t==='resolve')return S+'<line x1="55" y1="135" x2="275" y2="50" stroke="#2563eb" stroke-width="5"/><line x1="55" y1="135" x2="275" y2="135" stroke="#94a3b8" stroke-width="3"/><line x1="275" y1="135" x2="275" y2="50" stroke="#94a3b8" stroke-width="3"/><text x="112" y="119" font-size="17">θ</text><text x="145" y="158" font-size="14">adjacent → cos</text><text x="280" y="96" font-size="14">opposite → sin</text></svg>';
 if(t==='slope')return S+'<polygon points="40,145 310,145 310,55" fill="#e2e8f0"/><rect x="185" y="79" width="56" height="34" rx="5" transform="rotate(-18 213 96)" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><line x1="213" y1="96" x2="213" y2="154" stroke="#0f172a" stroke-width="3"/><text x="220" y="151" font-size="14">mg</text><line x1="213" y1="96" x2="155" y2="115" stroke="#b45309" stroke-width="4"/><text x="75" y="112" font-size="13">mg sin θ</text><line x1="213" y1="96" x2="233" y2="42" stroke="#15803d" stroke-width="4"/><text x="239" y="43" font-size="14">R</text><text x="241" y="124" font-size="13">mg cos θ</text></svg>';
 if(t==='couple')return S+'<rect x="78" y="66" width="204" height="44" rx="8" fill="#f1f5f9" stroke="#64748b"/><line x1="112" y1="140" x2="112" y2="38" stroke="#2563eb" stroke-width="5"/><line x1="248" y1="35" x2="248" y2="138" stroke="#2563eb" stroke-width="5"/><line x1="112" y1="22" x2="248" y2="22" stroke="#0f172a"/><text x="177" y="16" font-size="15">d</text><text x="127" y="94" font-size="16">moment = Fd</text></svg>';
 if(t==='displacement-time')return S+'<line x1="48" y1="140" x2="320" y2="140" stroke="#0f172a" stroke-width="2"/><line x1="48" y1="140" x2="48" y2="24" stroke="#0f172a" stroke-width="2"/><path d="M55 128 C105 123 130 102 165 76 S238 42 308 36" fill="none" stroke="#2563eb" stroke-width="5"/><line x1="150" y1="94" x2="235" y2="48" stroke="#b45309" stroke-width="2" stroke-dasharray="6 5"/><text x="118" y="158" font-size="13">gradient = velocity</text></svg>';
 if(t==='velocity-time')return S+'<line x1="48" y1="88" x2="320" y2="88" stroke="#0f172a" stroke-width="2"/><line x1="48" y1="145" x2="48" y2="24" stroke="#0f172a" stroke-width="2"/><path d="M55 128 L135 42 L220 42 L308 108" fill="none" stroke="#2563eb" stroke-width="5"/><text x="95" y="160" font-size="13">gradient = a • area = displacement</text></svg>';
 if(t==='acceleration-time')return S+'<line x1="48" y1="92" x2="320" y2="92" stroke="#0f172a" stroke-width="2"/><line x1="48" y1="145" x2="48" y2="24" stroke="#0f172a" stroke-width="2"/><path d="M55 50 L145 50 L145 123 L230 123 L230 68 L308 68" fill="none" stroke="#2563eb" stroke-width="5"/><text x="128" y="158" font-size="13">signed area = Δv</text></svg>';
 if(t==='projectile')return S+'<path d="M48 130 Q178 18 315 130" fill="none" stroke="#2563eb" stroke-width="5"/><line x1="48" y1="130" x2="310" y2="130" stroke="#94a3b8" stroke-width="2"/><text x="54" y="60" font-size="13">vertical a = −g</text><text x="175" y="148" font-size="13">horizontal v constant</text></svg>';
 if(t==='moment')return S+'<line x1="48" y1="105" x2="318" y2="105" stroke="#64748b" stroke-width="7"/><polygon points="175,105 160,135 190,135" fill="#0f172a"/><line x1="270" y1="36" x2="270" y2="105" stroke="#2563eb" stroke-width="5"/><line x1="175" y1="45" x2="270" y2="45" stroke="#b45309" stroke-width="2" stroke-dasharray="5 4"/><text x="207" y="38" font-size="14">d⊥</text><text x="256" y="28" font-size="14">F</text></svg>';
 if(t==='internal-resistance')return S+'<line x1="48" y1="132" x2="320" y2="132" stroke="#0f172a" stroke-width="2"/><line x1="48" y1="145" x2="48" y2="25" stroke="#0f172a" stroke-width="2"/><line x1="67" y1="43" x2="300" y2="121" stroke="#2563eb" stroke-width="5"/><text x="75" y="35" font-size="14">intercept = ε</text><text x="155" y="90" font-size="14">gradient = −r</text></svg>';
 if(t==='photoelectric')return S+'<rect x="176" y="86" width="125" height="38" rx="5" fill="#94a3b8"/><line x1="67" y1="45" x2="177" y2="95" stroke="#f59e0b" stroke-width="5"/><circle cx="201" cy="102" r="7" fill="#2563eb"/><path d="M205 98 Q238 62 281 48" fill="none" stroke="#2563eb" stroke-width="4"/><text x="50" y="35" font-size="14">photon E = hf</text><text x="222" y="42" font-size="14">hf ≥ φ</text></svg>';
 if(t==='stationary')return S+'<line x1="40" y1="90" x2="320" y2="90" stroke="#64748b" stroke-width="2"/><path d="M45 90 Q80 32 115 90 T185 90 T255 90 T315 90" fill="none" stroke="#2563eb" stroke-width="5"/><circle cx="45" cy="90" r="4"/><circle cx="115" cy="90" r="4"/><circle cx="185" cy="90" r="4"/><text x="130" y="150" font-size="14">node spacing = λ/2</text></svg>';
 if(t==='young')return S+'<line x1="55" y1="46" x2="305" y2="46" stroke="#0f172a" stroke-width="4"/><line x1="82" y1="46" x2="82" y2="144" stroke="#2563eb" stroke-width="3"/><line x1="278" y1="46" x2="278" y2="144" stroke="#2563eb" stroke-width="3"/><circle cx="278" cy="145" r="12" fill="#64748b"/><text x="112" y="121" font-size="14">E = FL/(AΔL)</text></svg>';
 if(t==='back-titration')return S+'<rect x="80" y="39" width="34" height="95" fill="#dbeafe" stroke="#2563eb"/><path d="M190 138 L270 138 L252 96 L208 96 Z" fill="#fef3c7" stroke="#64748b"/><text x="118" y="159" font-size="13">initial − leftover = reacted</text></svg>';
 if(t==='arrhenius')return S+'<line x1="52" y1="138" x2="318" y2="138" stroke="#0f172a" stroke-width="2"/><line x1="52" y1="138" x2="52" y2="25" stroke="#0f172a" stroke-width="2"/><line x1="72" y1="48" x2="296" y2="126" stroke="#2563eb" stroke-width="5"/><text x="98" y="52" font-size="14">gradient = −Ea/R</text><text x="25" y="25" font-size="13">ln k</text><text x="292" y="157" font-size="13">1/T</text></svg>';
 if(t==='circular')return S+'<circle cx="180" cy="88" r="58" fill="none" stroke="#cbd5e1" stroke-width="3"/><circle cx="238" cy="88" r="7" fill="#2563eb"/><line x1="238" y1="88" x2="183" y2="88" stroke="#b91c1c" stroke-width="4"/><line x1="238" y1="88" x2="238" y2="36" stroke="#15803d" stroke-width="4"/><text x="190" y="80" font-size="13">a, F inward</text><text x="246" y="50" font-size="13">v tangent</text></svg>';
 if(t==='shm')return S+'<line x1="45" y1="92" x2="315" y2="92" stroke="#94a3b8" stroke-width="2"/><path d="M48 92 C82 30 115 30 148 92 S215 154 248 92 S282 30 315 92" fill="none" stroke="#2563eb" stroke-width="5"/><text x="112" y="162" font-size="14">a = −ω²x</text></svg>';

 if(t==='fibre')return S+'<rect x="45" y="56" width="270" height="58" rx="28" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/><path d="M55 96 L105 72 L155 98 L205 72 L255 98 L305 72" fill="none" stroke="#f59e0b" stroke-width="4"/><text x="95" y="145" font-size="13">total internal reflection</text></svg>';
 if(t==='circle')return S+'<circle cx="180" cy="88" r="62" fill="none" stroke="#2563eb" stroke-width="4"/><circle cx="180" cy="88" r="4" fill="#0f172a"/><line x1="180" y1="88" x2="235" y2="58" stroke="#94a3b8" stroke-width="3"/><text x="205" y="76" font-size="14">r</text><line x1="58" y1="138" x2="310" y2="138" stroke="#0f172a" stroke-width="2"/></svg>';
 if(t==='titration')return S+'<rect x="82" y="24" width="20" height="91" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><line x1="92" y1="115" x2="92" y2="137" stroke="#0f172a" stroke-width="2"/><path d="M185 140 L265 140 L248 96 L202 96 Z" fill="#fef3c7" stroke="#64748b" stroke-width="2"/><path d="M92 137 Q92 148 103 148" fill="none" stroke="#2563eb" stroke-width="2"/><text x="55" y="20" font-size="12">burette</text><text x="198" y="160" font-size="12">conical flask</text></svg>';
 if(t==='medical')return S+'<circle cx="180" cy="84" r="45" fill="#e0f2fe" stroke="#0284c7" stroke-width="3"/><path d="M90 84 H270" stroke="#64748b" stroke-width="2"/><path d="M180 39 V129" stroke="#64748b" stroke-width="2"/><path d="M55 84 Q90 40 125 84 Q90 128 55 84Z" fill="#dbeafe" stroke="#2563eb"/><text x="210" y="150" font-size="13">medical imaging</text></svg>';

 if(t==='energy-levels')return S+'<line x1="70" y1="130" x2="290" y2="130" stroke="#64748b" stroke-width="3"/><line x1="90" y1="92" x2="270" y2="92" stroke="#64748b" stroke-width="3"/><line x1="115" y1="52" x2="245" y2="52" stroke="#64748b" stroke-width="3"/><path d="M150 124 V61" stroke="#2563eb" stroke-width="4"/><polygon points="150,52 144,64 156,64" fill="#2563eb"/><path d="M210 58 V121" stroke="#f59e0b" stroke-width="4"/><polygon points="210,130 204,118 216,118" fill="#f59e0b"/><text x="56" y="145" font-size="12">lower E</text><text x="242" y="44" font-size="12">higher E</text></svg>';
 if(t==='gas-particles')return S+'<rect x="55" y="35" width="250" height="100" rx="8" fill="#eff6ff" stroke="#64748b" stroke-width="2"/>'+[[85,60],[125,95],[160,55],[205,80],[260,58],[278,112],[95,120],[215,118]].map(p=>'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="6" fill="#2563eb"/>').join('')+'<path d="M86 60 l18 -8 M162 55 l15 12 M206 80 l22 -9" stroke="#b45309" stroke-width="2"/><text x="102" y="155" font-size="13">random molecular motion → pressure</text></svg>';
 if(t==='grating')return S+'<line x1="96" y1="30" x2="96" y2="140" stroke="#0f172a" stroke-width="4"/><line x1="104" y1="30" x2="104" y2="140" stroke="#0f172a" stroke-width="1"/><line x1="112" y1="30" x2="112" y2="140" stroke="#0f172a" stroke-width="1"/><line x1="30" y1="85" x2="95" y2="85" stroke="#2563eb" stroke-width="4"/><path d="M113 85 L295 42 M113 85 L295 85 M113 85 L295 128" stroke="#f59e0b" stroke-width="3"/><text x="190" y="25" font-size="13">d sin θ = nλ</text></svg>';
 if(t==='refraction')return S+'<line x1="40" y1="85" x2="320" y2="85" stroke="#64748b" stroke-width="2"/><line x1="180" y1="25" x2="180" y2="145" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5 5"/><path d="M105 30 L180 85 L228 145" fill="none" stroke="#2563eb" stroke-width="4"/><text x="78" y="74" font-size="13">i</text><text x="194" y="108" font-size="13">r</text></svg>';
 if(t==='force-time')return S+'<line x1="55" y1="135" x2="310" y2="135" stroke="#0f172a" stroke-width="2"/><line x1="55" y1="135" x2="55" y2="25" stroke="#0f172a" stroke-width="2"/><path d="M58 135 L118 52 L210 52 L280 135 Z" fill="#dbeafe" stroke="#2563eb" stroke-width="4"/><text x="115" y="155" font-size="13">area = impulse = Δp</text></svg>';
 if(t==='divider')return S+'<line x1="65" y1="48" x2="295" y2="48" stroke="#0f172a" stroke-width="2"/><line x1="65" y1="48" x2="65" y2="135" stroke="#0f172a" stroke-width="2"/><line x1="295" y1="48" x2="295" y2="135" stroke="#0f172a" stroke-width="2"/><polyline points="110,48 120,58 130,38 140,58 150,38 160,58 170,48" fill="none" stroke="#2563eb" stroke-width="3"/><polyline points="190,48 200,58 210,38 220,58 230,38 240,58 250,48" fill="none" stroke="#b45309" stroke-width="3"/><line x1="180" y1="48" x2="180" y2="120" stroke="#64748b" stroke-width="2"/><text x="92" y="83" font-size="12">R₁</text><text x="226" y="83" font-size="12">R₂</text><text x="160" y="140" font-size="12">Vout</text></svg>';
 if(t==='wire')return S+'<line x1="55" y1="85" x2="305" y2="85" stroke="#b45309" stroke-width="8"/><line x1="55" y1="112" x2="305" y2="112" stroke="#64748b" stroke-width="1"/><line x1="55" y1="105" x2="55" y2="120" stroke="#64748b"/><line x1="305" y1="105" x2="305" y2="120" stroke="#64748b"/><text x="169" y="133" font-size="13">L</text><text x="97" y="58" font-size="13">ρ = RA/L</text></svg>';
 if(t==='field-lines')return S+'<circle cx="180" cy="85" r="16" fill="#2563eb"/>'+[0,45,90,135,180,225,270,315].map(a=>{const r=a*Math.PI/180,x1=180+24*Math.cos(r),y1=85+24*Math.sin(r),x2=180+72*Math.cos(r),y2=85+72*Math.sin(r);return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#64748b" stroke-width="2"/>'}).join('')+'<text x="132" y="164" font-size="13">radial field</text></svg>';
 if(t==='capacitor')return S+'<line x1="50" y1="85" x2="145" y2="85" stroke="#0f172a" stroke-width="3"/><line x1="145" y1="45" x2="145" y2="125" stroke="#2563eb" stroke-width="6"/><line x1="165" y1="45" x2="165" y2="125" stroke="#2563eb" stroke-width="6"/><line x1="165" y1="85" x2="310" y2="85" stroke="#0f172a" stroke-width="3"/><text x="120" y="151" font-size="13">C = Q/V</text></svg>';
 if(t==='magnetic')return S+'<line x1="180" y1="30" x2="180" y2="140" stroke="#b45309" stroke-width="6"/><circle cx="180" cy="85" r="35" fill="none" stroke="#2563eb" stroke-width="2"/><circle cx="180" cy="85" r="62" fill="none" stroke="#2563eb" stroke-width="2"/><text x="214" y="45" font-size="13">B field around current</text></svg>';
 if(t==='induction')return S+'<rect x="52" y="64" width="72" height="42" rx="5" fill="#fee2e2" stroke="#b91c1c"/><text x="73" y="90" font-size="16">N S</text><path d="M150 48 q25 18 0 36 q25 18 0 36 q25 18 0 36" fill="none" stroke="#2563eb" stroke-width="5"/><path d="M120 85 H146" stroke="#0f172a" stroke-width="3"/><polygon points="146,85 136,79 136,91" fill="#0f172a"/><text x="215" y="90" font-size="13">change in flux → emf</text></svg>';
 if(t==='decay')return S+'<line x1="55" y1="135" x2="310" y2="135" stroke="#0f172a" stroke-width="2"/><line x1="55" y1="135" x2="55" y2="25" stroke="#0f172a" stroke-width="2"/><path d="M58 36 C105 68 148 94 205 111 C245 122 275 128 307 131" fill="none" stroke="#2563eb" stroke-width="4"/><line x1="55" y1="84" x2="300" y2="84" stroke="#94a3b8" stroke-dasharray="5 5"/><text x="220" y="76" font-size="12">half-life</text></svg>';
 if(t==='quark')return S+'<circle cx="130" cy="85" r="38" fill="#dbeafe" stroke="#2563eb"/><circle cx="115" cy="75" r="10" fill="#dc2626"/><circle cx="145" cy="75" r="10" fill="#dc2626"/><circle cx="130" cy="102" r="10" fill="#16a34a"/><text x="111" y="79" font-size="10" fill="#fff">u</text><text x="141" y="79" font-size="10" fill="#fff">u</text><text x="126" y="106" font-size="10" fill="#fff">d</text><text x="190" y="90" font-size="13">example baryon</text></svg>';
 if(t==='molecule-shape')return S+'<circle cx="180" cy="85" r="14" fill="#2563eb"/><circle cx="105" cy="55" r="11" fill="#94a3b8"/><circle cx="255" cy="55" r="11" fill="#94a3b8"/><circle cx="180" cy="145" r="11" fill="#94a3b8"/><line x1="168" y1="78" x2="116" y2="59" stroke="#0f172a" stroke-width="3"/><line x1="192" y1="78" x2="244" y2="59" stroke="#0f172a" stroke-width="3"/><line x1="180" y1="99" x2="180" y2="134" stroke="#0f172a" stroke-width="3"/><text x="138" y="25" font-size="13">electron pairs repel</text></svg>';
 if(t==='hess')return S+'<rect x="48" y="30" width="75" height="30" rx="5" fill="#dbeafe"/><rect x="238" y="30" width="75" height="30" rx="5" fill="#dcfce7"/><rect x="142" y="118" width="78" height="30" rx="5" fill="#fef3c7"/><path d="M123 45 H236" stroke="#2563eb" stroke-width="3"/><path d="M90 61 L153 118 M275 61 L208 118" stroke="#64748b" stroke-width="3"/><text x="144" y="82" font-size="13">Hess cycle</text></svg>';
 if(t==='born-haber')return S+'<line x1="65" y1="140" x2="285" y2="140" stroke="#64748b" stroke-width="3"/><line x1="85" y1="110" x2="270" y2="110" stroke="#64748b" stroke-width="3"/><line x1="105" y1="78" x2="255" y2="78" stroke="#64748b" stroke-width="3"/><line x1="125" y1="45" x2="240" y2="45" stroke="#64748b" stroke-width="3"/><path d="M70 137 L88 113 L108 81 L128 48" fill="none" stroke="#2563eb" stroke-width="3"/><text x="188" y="164" font-size="12">enthalpy levels</text></svg>';
 if(t==='nmr')return S+'<line x1="45" y1="135" x2="315" y2="135" stroke="#0f172a" stroke-width="2"/><line x1="80" y1="135" x2="80" y2="78" stroke="#2563eb" stroke-width="4"/><line x1="145" y1="135" x2="145" y2="45" stroke="#2563eb" stroke-width="4"/><line x1="225" y1="135" x2="225" y2="92" stroke="#2563eb" stroke-width="4"/><line x1="292" y1="135" x2="292" y2="115" stroke="#2563eb" stroke-width="4"/><text x="205" y="158" font-size="12">chemical shift δ / ppm</text></svg>';
 if(t==='chromatography')return S+'<rect x="115" y="25" width="130" height="120" fill="#f8fafc" stroke="#64748b" stroke-width="2"/><line x1="125" y1="126" x2="235" y2="126" stroke="#0f172a" stroke-width="2"/><line x1="125" y1="46" x2="235" y2="46" stroke="#2563eb" stroke-width="2" stroke-dasharray="4 4"/><circle cx="160" cy="82" r="7" fill="#dc2626"/><circle cx="202" cy="64" r="7" fill="#16a34a"/><text x="145" y="163" font-size="12">Rf = solute / solvent</text></svg>';
 if(t==='organic-reaction')return S+'<rect x="42" y="60" width="95" height="48" rx="8" fill="#dbeafe"/><text x="70" y="90" font-size="13">reactant</text><path d="M145 84 H218" stroke="#0f172a" stroke-width="3"/><polygon points="218,84 207,78 207,90" fill="#0f172a"/><text x="155" y="68" font-size="11">reagent / conditions</text><rect x="225" y="60" width="95" height="48" rx="8" fill="#dcfce7"/><text x="252" y="90" font-size="13">product</text></svg>';
 if(t==='unit-circle')return S+'<circle cx="180" cy="85" r="62" fill="none" stroke="#2563eb" stroke-width="3"/><line x1="80" y1="85" x2="280" y2="85" stroke="#64748b"/><line x1="180" y1="15" x2="180" y2="155" stroke="#64748b"/><line x1="180" y1="85" x2="230" y2="48" stroke="#b45309" stroke-width="3"/><text x="199" y="78" font-size="13">θ</text></svg>';
 if(t==='tangent')return S+'<line x1="45" y1="138" x2="315" y2="138" stroke="#0f172a"/><line x1="75" y1="150" x2="75" y2="25" stroke="#0f172a"/><path d="M82 125 Q165 20 295 112" fill="none" stroke="#2563eb" stroke-width="4"/><line x1="115" y1="100" x2="255" y2="46" stroke="#b45309" stroke-width="3"/><text x="187" y="40" font-size="12">gradient = dy/dx</text></svg>';
 if(t==='area-curve')return S+'<line x1="45" y1="135" x2="315" y2="135" stroke="#0f172a"/><line x1="70" y1="150" x2="70" y2="30" stroke="#0f172a"/><path d="M75 125 Q145 35 250 70 Q285 83 305 110" fill="none" stroke="#2563eb" stroke-width="4"/><path d="M105 117 Q155 48 225 65 L225 135 L105 135 Z" fill="#dbeafe" opacity=".8"/><text x="137" y="158" font-size="12">∫ f(x) dx</text></svg>';
 if(t==='vector')return S+'<line x1="70" y1="130" x2="265" y2="55" stroke="#2563eb" stroke-width="4"/><polygon points="265,55 249,54 256,67" fill="#2563eb"/><line x1="70" y1="130" x2="265" y2="130" stroke="#94a3b8" stroke-width="2"/><line x1="265" y1="130" x2="265" y2="55" stroke="#94a3b8" stroke-width="2"/><text x="148" y="151" font-size="12">components</text></svg>';
 if(t==='newton')return S+'<rect x="142" y="62" width="76" height="48" rx="8" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/><line x1="142" y1="86" x2="72" y2="86" stroke="#b45309" stroke-width="4"/><polygon points="72,86 86,79 86,93" fill="#b45309"/><line x1="218" y1="86" x2="292" y2="86" stroke="#16a34a" stroke-width="4"/><polygon points="292,86 278,79 278,93" fill="#16a34a"/><line x1="180" y1="62" x2="180" y2="28" stroke="#64748b" stroke-width="4"/><polygon points="180,28 173,42 187,42" fill="#64748b"/><line x1="180" y1="110" x2="180" y2="148" stroke="#dc2626" stroke-width="4"/><polygon points="180,148 173,134 187,134" fill="#dc2626"/><text x="122" y="165" font-size="13">label forces on the object</text></svg>';
 if(t==='work-angle')return S+'<line x1="64" y1="132" x2="310" y2="132" stroke="#64748b" stroke-width="3"/><line x1="92" y1="122" x2="250" y2="50" stroke="#2563eb" stroke-width="5"/><polygon points="250,50 234,51 241,64" fill="#2563eb"/><path d="M125 132 A48 48 0 0 1 164 103" fill="none" stroke="#b45309" stroke-width="2"/><text x="142" y="122" font-size="16">θ</text><text x="111" y="160" font-size="13">W = Fs cos θ</text></svg>';
 return '';
}

function renderLevel(){const li=levelInfo(profile.lifetimeXp);document.getElementById('levelNum').textContent=li.level;document.getElementById('xpTotal').textContent=profile.lifetimeXp+' XP';document.getElementById('pointBalance').textContent=profile.points;document.getElementById('xpNext').textContent=li.level>=500?'Maximum level reached':(li.req-li.into)+' XP to level '+(li.level+1);document.getElementById('xpBar').style.width=(li.level>=500?100:clamp(li.into/li.req*100,0,100))+'%'}
function renderStats(){document.getElementById('dueCount').textContent=cards.filter(c=>c.active!==false&&isDue(c)).length;document.getElementById('newCount').textContent=daily().newCards;document.getElementById('reviewedCount').textContent=daily().reviews;document.getElementById('masteredCount').textContent=cards.filter(c=>state(c.id).mastered).length}
function avatarSVG(character,outfit,small=false){
 const c=character||CHARACTERS[0],o=outfit||OUTFITS.find(x=>x.id===c.id+'-default')||OUTFITS[0];
 const id=('art-'+c.id+'-'+o.id).replace(/[^a-zA-Z0-9-]/g,''),eye=c.eye||'#1e293b';
 const backHair=c.style==='long'||c.style==='bob'?'<path d="M34 64 Q35 19 80 19 Q124 21 128 72 L124 161 Q104 182 85 163 Q54 178 36 154Z" fill="url(#'+id+'-hair)"/>':'';
 const hairShapes={
 spiky:'M34 66 L38 33 L48 41 L53 15 L65 28 L77 7 L88 26 L103 12 L108 30 L125 23 L121 54 L129 68 Q85 47 34 66Z',
 messy:'M34 70 Q33 41 49 29 L53 13 L67 23 L77 11 L90 23 L105 12 L108 28 L121 26 L116 45 L126 65 Q93 49 75 53 L62 45 Q52 67 34 70Z',
 swept:'M37 69 Q30 41 45 25 Q68 11 95 20 Q121 26 124 56 L119 68 Q101 55 76 49 Q57 65 37 69Z',
 long:'M36 68 Q39 27 78 20 Q117 20 125 66 L115 66 Q95 46 78 45 Q60 64 36 68Z',
 bob:'M37 69 Q36 25 78 22 Q117 22 125 69 L112 93 L108 54 Q78 59 58 53 L48 94 Q34 82 37 69Z',
 short:'M40 66 Q37 30 65 22 Q96 10 116 37 L121 59 L111 67 Q94 50 78 48 Q57 65 40 66Z'
 };
 const hair=hairShapes[c.style]||hairShapes.short;
 let accessory='';
 if(c.accessory==='blindfold')accessory='<path d="M51 69 Q79 62 110 68 L107 86 Q79 90 52 84Z" fill="#111827" stroke="#334155" stroke-width="1.5"/><path d="M56 72 Q79 65 105 72" stroke="#475569" opacity=".65" fill="none"/>';
 else if(c.accessory==='glasses')accessory='<circle cx="67" cy="81" r="12" fill="rgba(219,234,254,.16)" stroke="#334155" stroke-width="2"/><circle cx="94" cy="81" r="12" fill="rgba(219,234,254,.16)" stroke="#334155" stroke-width="2"/><path d="M79 79 H82" stroke="#334155" stroke-width="2"/>';
 else if(c.accessory==='eyepatch')accessory='<path d="M52 73 Q64 67 79 74 L77 91 Q63 93 52 85Z" fill="#111827" stroke="#334155"/><path d="M42 62 L93 83" stroke="#111827" stroke-width="3"/>';
 else if(c.accessory==='scar')accessory='<path d="M98 88 l8 10 M101 85 l9 12" stroke="#7f1d1d" stroke-width="1.4"/>';
 else if(c.accessory==='stitches')accessory='<path d="M51 99 L65 104 M53 96 L58 110 M61 99 L65 108" stroke="#7f1d1d" stroke-width="1.2"/>';
 else if(c.accessory==='darkeyes')accessory='<ellipse cx="67" cy="86" rx="12" ry="6" fill="#0f172a" opacity=".22"/><ellipse cx="94" cy="86" rx="12" ry="6" fill="#0f172a" opacity=".22"/>';
 const style=o.styleId||'default';
 const hoodie=style==='hoodie'||style==='winter'?'<path d="M42 131 Q56 113 80 119 Q104 113 118 131 L114 148 Q101 130 80 137 Q59 130 46 148Z" fill="'+o.accent+'" stroke="rgba(15,23,42,.2)" stroke-width="1.5"/>':'';
 const lapels=style==='smart'||style==='traveller'?'<path d="M56 127 L78 149 L68 167 L51 137 Z M104 127 L82 149 L92 167 L109 137 Z" fill="'+o.accent+'" opacity=".96"/>':'';
 const gym=style==='sport'?'<path d="M52 138 L64 140 M96 140 L108 138" stroke="#f8fafc" stroke-width="5"/><path d="M80 150 V190" stroke="#f8fafc" stroke-width="3" opacity=".7"/>':'';
 const emblem=style==='festival'?'<path d="M80 157 L85 167 L98 169 L88 177 L91 190 L80 183 L69 190 L72 177 L62 169 L75 167Z" fill="'+o.accent+'"/>':'';
 const scarf=c.accessory==='scarf'?'<path d="M46 124 Q80 147 114 123 L114 145 Q81 161 47 144 L48 173 L34 180Z" fill="#991b1b" stroke="#7f1d1d"/>':'';
 return '<svg viewBox="0 0 160 190" role="img" aria-label="'+esc(c.name)+' in '+esc(o.name)+'">'+
 '<defs>'+
 '<linearGradient id="'+id+'-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+o.accent+'"/><stop offset=".55" stop-color="#dbeafe"/><stop offset="1" stop-color="#64748b"/></linearGradient>'+
 '<radialGradient id="'+id+'-skin" cx="34%" cy="26%" r="80%"><stop stop-color="#fff2de"/><stop offset=".35" stop-color="'+c.skin+'"/><stop offset="1" stop-color="#a16246"/></radialGradient>'+
 '<linearGradient id="'+id+'-hair" x1="0" y1="0" x2=".9" y2="1"><stop stop-color="'+c.hair2+'"/><stop offset=".55" stop-color="'+c.hair+'"/><stop offset="1" stop-color="'+c.hair2+'"/></linearGradient>'+
 '<linearGradient id="'+id+'-cloth" x1="0" y1="0" x2="1" y2=".85"><stop stop-color="'+o.accent+'"/><stop offset=".38" stop-color="'+o.top+'"/><stop offset="1" stop-color="#101827"/></linearGradient>'+
 '<filter id="'+id+'-glow"><feGaussianBlur stdDeviation="11"/></filter>'+
 '</defs>'+
 '<rect width="160" height="190" rx="18" fill="url(#'+id+'-bg)"/>'+
 '<circle cx="126" cy="40" r="48" fill="#fff" opacity=".25" filter="url(#'+id+'-glow)"/>'+
 '<path d="M0 152 Q80 100 160 145 L160 190 H0Z" fill="#0f172a" opacity=".12"/>'+
 backHair+
 '<ellipse cx="79" cy="80" rx="40" ry="47" fill="url(#'+id+'-skin)" stroke="rgba(94,50,38,.25)" stroke-width=".7"/>'+
 '<ellipse cx="42" cy="88" rx="6" ry="12" fill="'+c.skin+'"/><ellipse cx="118" cy="88" rx="6" ry="12" fill="'+c.skin+'"/>'+
 '<path d="'+hair+'" fill="url(#'+id+'-hair)" stroke="'+c.hair2+'" stroke-width="1.4"/>'+
 '<path d="M44 51 Q76 21 108 43" stroke="#fff" opacity=".15" stroke-width="5" fill="none"/>'+
 '<path d="M54 72 Q65 66 74 71 M86 71 Q95 66 107 71" fill="none" stroke="'+c.hair2+'" stroke-width="2.6" stroke-linecap="round"/>'+
 '<path d="M53 80 Q67 72 77 80 Q67 88 53 80 M83 80 Q95 72 108 80 Q95 88 83 80" fill="#f8fafc" stroke="#334155" stroke-width="1.5"/>'+
 '<ellipse cx="66" cy="80" rx="5.2" ry="6.2" fill="'+eye+'"/><ellipse cx="95" cy="80" rx="5.2" ry="6.2" fill="'+eye+'"/>'+
 '<circle cx="64" cy="78" r="2" fill="#fff" opacity=".92"/><circle cx="93" cy="78" r="2" fill="#fff" opacity=".92"/>'+
 '<path d="M80 86 L76 101 L82 102" stroke="#965943" stroke-width="1.3" fill="none" opacity=".6"/>'+
 '<path d="M71 109 Q80 113 89 109" stroke="#884c43" stroke-width="1.8" fill="none" stroke-linecap="round"/>'+
 '<path d="M59 113 Q80 132 102 113" fill="none" stroke="#8b5545" opacity=".15"/>'+
 accessory+
 '<path d="M71 116 L71 134 Q79 144 90 134 L89 116" fill="url(#'+id+'-skin)"/>'+
 '<path d="M30 190 Q35 139 49 133 L65 126 Q80 147 96 126 L112 133 Q126 142 130 190Z" fill="url(#'+id+'-cloth)" stroke="#1e293b" stroke-width="1.4"/>'+
 '<path d="M63 128 Q80 145 97 128 L98 143 L80 159 L62 143Z" fill="'+o.accent+'" opacity=".82"/>'+
 hoodie+lapels+gym+emblem+scarf+
 '<path d="M52 154 L45 190 M108 154 L117 190" stroke="#fff" stroke-width="2" opacity=".17"/>'+
 '</svg>';
}
function renderAvatar(){
 const c=CHARACTERS.find(x=>x.id===profile.equippedCharacter)||CHARACTERS[0];
 let o=OUTFITS.find(x=>x.id===profile.equippedOutfit&&x.character===c.id);
 if(!o){o=OUTFITS.find(x=>x.id===c.id+'-default');profile.equippedOutfit=o.id}
 const l=LOCATIONS.find(x=>x.id===profile.equippedLocation)||LOCATIONS[0];
 document.getElementById('miniAvatar').innerHTML=characterArtwork(c,o);
 document.getElementById('characterPreview').innerHTML=characterArtwork(c,o);
 document.getElementById('equippedName').textContent=c.name;
 document.getElementById('equippedOutfitName').textContent=o.name+' outfit';
 document.getElementById('equippedLocation').textContent=l.name;
 document.getElementById('shopPoints').textContent=profile.points;
 selectedLocation=l.id;loadCharacterArt(document.getElementById('miniAvatar'));loadCharacterArt(document.getElementById('characterPreview'));
}
function renderChallenge(){document.getElementById('challengeStreak').textContent=profile.challengeStreak+' day'+(profile.challengeStreak===1?'':'s')+' streak';const sub=document.getElementById('challengeSubject').value,scope=document.getElementById('challengeScope').value,key=dateKey()+'|'+(sub||'All')+'|'+scope,s=profile.dailyChallenges[key];document.getElementById('challengeStatus').textContent=s?(s.done?'Completed today':(s.index||0)+' / '+s.items.length+' completed'):'Not started yet';document.getElementById('startChallenge').textContent=s&&!s.done?'Resume challenge':s?.done?'Review challenge':'Start today’s challenge'}
function flashTopicLabel(c){return c.revisionTopic||c.topic||c.courseTopic||'Unclassified'}
function examTopicLabel(q){return q.revisionTopic||q.subtopic||q.topic||q.courseTopic||'Unclassified'}
function revisionTopicIndex(subject,qualification='both'){
 const groups=new Map();
 for(const c of subjectCards(subject)){
  const group=c.courseTopic||'Other',topic=flashTopicLabel(c);
  if(!groups.has(group))groups.set(group,new Map());
  if(!groups.get(group).has(topic))groups.get(group).set(topic,{cards:0,questions:0});
  groups.get(group).get(topic).cards++;
 }
 for(const q of subjectExam(subject).filter(q=>qualification==='both'||q.level===qualification)){
  const group=q.courseTopic||'Other',topic=examTopicLabel(q);
  if(!groups.has(group))groups.set(group,new Map());
  if(!groups.get(group).has(topic))groups.get(group).set(topic,{cards:0,questions:0});
  groups.get(group).get(topic).questions++;
 }
 return groups;
}
function groupedTopicPicker(subject,kind,selected){
 const groups=revisionTopicIndex(subject,kind==='exam'?(document.getElementById('examLevel')?.value||'both'):'both');
 return [...groups].sort((a,b)=>a[0].localeCompare(b[0])).map(([group,topics])=>{
  const count=[...topics.values()].reduce((n,c)=>n+(kind==='flash'?c.cards:c.questions),0);
  const groupId=group.replace(/[^a-zA-Z0-9]/g,'-').toLowerCase();
  return '<details class="topic-family" open><summary><b>'+esc(group)+'</b><span>'+count+' '+(kind==='flash'?'cards':'questions')+'</span></summary>'+
  '<div class="topic-family-actions"><button type="button" data-topic-group-action="select" data-topic-group="'+esc(group)+'" data-topic-kind="'+kind+'">Select section</button>'+
  '<button type="button" data-topic-group-action="clear" data-topic-group="'+esc(group)+'" data-topic-kind="'+kind+'">Clear section</button></div>'+
  '<div class="topic-family-choices">'+[...topics].sort((a,b)=>a[0].localeCompare(b[0])).map(([topic,c])=>{
    const available=kind==='flash'?c.cards:c.questions;
    return '<label class="check-item '+(available?'':'empty-topic')+'"><input type="checkbox" data-'+kind+'-topic="'+esc(topic)+'" '+
      (selected.has(topic)?'checked ':'')+'><span>'+esc(topic)+'</span><small>'+(kind==='exam'?available+' / 4':available)+'</small></label>';
  }).join('')+'</div></details>';
 }).join('');
}
function bindTopicGroupControls(kind){
 const container=document.getElementById(kind==='flash'?'flashTopics':'examTopics');
 const groupMap=revisionTopicIndex(document.getElementById(kind==='flash'?'flashSubject':'examSubject').value,kind==='exam'?document.getElementById('examLevel').value:'both');
 container.querySelectorAll('[data-topic-group-action]').forEach(btn=>btn.onclick=()=>{
  const group=btn.dataset.topicGroup,choices=groupMap.get(group),selected=kind==='flash'?flashTopics:examTopics;
  if(!choices)return;
  for(const [topic,count] of choices){
    if(btn.dataset.topicGroupAction==='clear')selected.delete(topic);
    else if((kind==='flash'?count.cards:count.questions)>0)selected.add(topic);
  }
  for(const input of container.querySelectorAll('[data-'+kind+'-topic]'))input.checked=selected.has(input.dataset[kind+'Topic']);
  renderTopicCounts();
 });
}
function refreshFlashTopics(defaultIfEmpty=false){
 const sub=document.getElementById('flashSubject').value,base=subjectCards(sub);
 const topics=[...new Set(base.map(flashTopicLabel))];
 flashTopics=new Set([...flashTopics].filter(t=>topics.includes(t)));
 if(defaultIfEmpty&&!flashTopics.size)base.filter(c=>c.taught).forEach(c=>flashTopics.add(flashTopicLabel(c)));
 document.getElementById('flashTopics').innerHTML=groupedTopicPicker(sub,'flash',flashTopics);
 document.querySelectorAll('[data-flash-topic]').forEach(el=>el.onchange=()=>{el.checked?flashTopics.add(el.dataset.flashTopic):flashTopics.delete(el.dataset.flashTopic);renderTopicCounts()});bindTopicGroupControls('flash');
 renderTopicCounts();
}
function applyFlashPreset(p){
 const base=subjectCards(document.getElementById('flashSubject').value);flashTopics.clear();
 if(p!=='clear'){const filtered=p==='mock'?base.filter(c=>c.mock===true):p==='taught'?base.filter(taughtCard):base;filtered.forEach(c=>flashTopics.add(flashTopicLabel(c)))}
 refreshFlashTopics(false);
}
const PMT_PAPER_INDEX={
 Physics:{
 'AS Paper 1':'https://www.physicsandmathstutor.com/past-papers/a-level-physics/aqa-paper-1-as/',
 'AS Paper 2':'https://www.physicsandmathstutor.com/past-papers/a-level-physics/aqa-paper-2-as/',
 'A-level Paper 1':'https://www.physicsandmathstutor.com/past-papers/a-level-physics/aqa-paper-1/',
 'A-level Paper 2':'https://www.physicsandmathstutor.com/past-papers/a-level-physics/aqa-paper-2/',
 'A-level Paper 3':'https://www.physicsandmathstutor.com/past-papers/a-level-physics/aqa-paper-3/'
 },
 Chemistry:{
 'AS Paper 1':'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/aqa-paper-1-as/',
 'AS Paper 2':'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/aqa-paper-2-as/',
 'A-level Paper 1':'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/aqa-paper-1/',
 'A-level Paper 2':'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/aqa-paper-2/',
 'A-level Paper 3':'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/aqa-paper-3/'
 },
 Maths:{
 'AS Papers 1 & 2':'https://www.physicsandmathstutor.com/maths-revision/a-level-aqa/papers-as/',
 'A-level Papers 1, 2 & 3':'https://www.physicsandmathstutor.com/maths-revision/a-level-aqa/papers/'
 }
};
const PMT_BY_TOPIC={
 Physics:'https://www.physicsandmathstutor.com/physics-revision/a-level-aqa/',
 Chemistry:'https://www.physicsandmathstutor.com/chemistry-revision/a-level-aqa/',
 Maths:'https://www.physicsandmathstutor.com/maths-revision/a-level-aqa/'
};
function renderPaperArchive(){
 const target=document.getElementById('paperArchiveLinks'),subject=document.getElementById('examSubject').value,years=subject==='Maths'?[2018,2019,2020]:[2016,2017,2018,2019,2020];
 if(!target)return;
 const items=Object.entries(PMT_PAPER_INDEX[subject]||{});
 target.innerHTML='<p class="archive-label">'+esc(subject)+' · all papers and mark schemes by year</p>'+
 '<div class="archive-years">'+years.map(y=>'<span>'+y+(y===2020?' *':'')+'</span>').join('')+'</div>'+
 '<div class="archive-links">'+items.map(([title,url])=>'<a href="'+url+'" rel="noopener noreferrer" target="_blank">'+esc(title)+' ↗</a>').join('')+'</div>'+
 '<p class="archive-label">For 2015 papers use the older specification: <a target="_blank" rel="noopener noreferrer" href="'+
 (subject==='Maths'?'https://www.physicsandmathstutor.com/a-level-maths-papers/':PMT_BY_TOPIC[subject])+'">old-specification topic and paper resources ↗</a>.</p>';
 const all=revisionTopicIndex(subject),gaps=[];
 for(const [group,topics] of all)for(const [topic,n] of topics)if(n.cards>0&&n.questions===0)gaps.push(topic);
 const sourced=new Map();
 for(const q of examQuestions.filter(x=>x.subject===subject&&x.standalone!==false&&x.year!=='Practice'))sourced.set(q.revisionTopic,true);
 const notSourced=[];
 for(const [group,topics] of all)for(const [topic,n] of topics)if(n.cards>0&&!sourced.get(topic))notSourced.push(topic);
 document.getElementById('topicOutsideResources').innerHTML='<p class="archive-label">Question minimum: '+(gaps.length?'some gaps remain':'4+ per topic across both levels')+
 '. Topics without a source-linked past-paper item: '+notSourced.length+'. These currently use independent AQA-style practice instead. <a href="'+PMT_BY_TOPIC[subject]+'" target="_blank" rel="noopener noreferrer">Explore original AQA questions on PMT ↗</a></p>';
}
function refreshExamFilters(defaultIfEmpty=false){
 const sub=document.getElementById('examSubject').value,level=document.getElementById('examLevel').value,base=subjectExam(sub).filter(q=>level==='both'||q.level===level),
 years=[...new Set(base.map(q=>q.year))].sort((a,b)=>a==='Practice'?1:b==='Practice'?-1:b-a),topics=[...new Set(subjectCards(sub).map(flashTopicLabel))],
 types=[...new Set(base.map(q=>q.questionType).filter(Boolean))].sort();
 examYears=new Set([...examYears].filter(y=>years.includes(y)));examTopics=new Set([...examTopics].filter(t=>topics.includes(t)));examTypes=new Set([...examTypes].filter(t=>types.includes(t)));
 if(defaultIfEmpty&&!examYears.size)years.forEach(y=>examYears.add(y));
 if(defaultIfEmpty&&!examTopics.size)base.forEach(q=>examTopics.add(examTopicLabel(q)));
 if(defaultIfEmpty&&!examTypes.size)types.forEach(t=>examTypes.add(t));
 document.getElementById('examYears').innerHTML=years.map(y=>'<label class="check-item"><input type="checkbox" data-exam-year="'+y+'" '+(examYears.has(y)?'checked':'')+'><span>'+y+'</span></label>').join('');
 document.getElementById('examTopics').innerHTML=groupedTopicPicker(sub,'exam',examTopics);
 document.getElementById('examTypes').innerHTML=types.map(t=>'<label class="check-item"><input type="checkbox" data-exam-type="'+esc(t)+'" '+(examTypes.has(t)?'checked':'')+'><span>'+esc(t)+'</span></label>').join('');
 document.querySelectorAll('[data-exam-year]').forEach(el=>el.onchange=()=>{el.checked?examYears.add(el.dataset.examYear==='Practice'?'Practice':Number(el.dataset.examYear)):examYears.delete(el.dataset.examYear==='Practice'?'Practice':Number(el.dataset.examYear));renderTopicCounts()});
 document.querySelectorAll('[data-exam-topic]').forEach(el=>el.onchange=()=>{if(el.checked)examTopics.add(el.dataset.examTopic);else examTopics.delete(el.dataset.examTopic);renderTopicCounts()});
 bindTopicGroupControls('exam');document.querySelectorAll('[data-exam-type]').forEach(el=>el.onchange=()=>{el.checked?examTypes.add(el.dataset.examType):examTypes.delete(el.dataset.examType)});
 renderTopicCounts();
 renderPaperArchive();
 const yearCounts=years.map(y=>y+': '+base.filter(q=>q.year===y).length).join(' · ');
 document.getElementById('examCoverage').textContent='Self-contained bank: '+base.length+' question parts (including separately labelled practice)'+(yearCounts?' · '+yearCounts:'')+'. Related subparts are grouped; missing-context questions are excluded. Coverage counts refer to app topic categories, not every individual specification requirement. Official past-paper coverage remains incomplete.';
}
function renderTopicCounts(){document.getElementById('flashTopicCount').textContent=flashTopics.size+' selected';document.getElementById('examTopicCount').textContent=examTopics.size+' selected';document.getElementById('examYearCount').textContent=examYears.size+' selected'}
function renderStudyType(){document.querySelectorAll('.study-type-btn').forEach(b=>b.classList.toggle('active',b.dataset.study===studyType));document.getElementById('mockControls').classList.toggle('hidden',studyType!=='mock');document.getElementById('flashControls').classList.toggle('hidden',studyType!=='flashcards');document.getElementById('examControls').classList.toggle('hidden',studyType!=='exam')}
function renderSessionBanner(){const e=document.getElementById('sessionBanner');if(!activeSession||activeSession.done){e.classList.add('hidden');return}e.classList.remove('hidden');e.textContent=activeSession.title+' · '+Math.min(activeSession.index+1,activeSession.items.length)+' / '+activeSession.items.length}
function renderCard(c){
 currentCardId=c.id;currentEvaluation=null;currentFlashAwarded=false;const s=state(c.id),health=Math.round(memoryHealth(c)*100),diag=c.visual?diagram(c.visual):'';
 document.getElementById('studyHost').innerHTML='<article class="review-card"><div class="card-meta"><div class="meta-left"><span class="badge">'+esc(c.subject)+' · '+esc(c.courseTopic||c.topic)+'</span><span class="badge">'+esc(c.kind==='content'?'knowledge':c.kind)+'</span></div><span class="queue-pos">memory '+health+'%</span></div><div class="card-body">'+(diag?'<div class="diagram">'+diag+'</div>':'')+'<div class="question">'+esc(c.front)+'</div><textarea id="answerInput" class="answer-input" placeholder="Type your answer from memory…"></textarea><div class="answer-actions"><button id="checkCard" class="check-btn">Check answer</button><button id="revealCard" class="show-btn">Just reveal</button></div><div id="feedback" class="feedback"></div><div id="modelAnswer" class="model-answer"><b>Model answer:</b> '+esc(c.back)+'<div id="missingIdeas"></div></div><button id="overrideBtn" class="override-btn">My answer was actually correct</button><div id="ratings" class="ratings"><button class="rating again" data-rating="again">Again<small>~10 min</small></button><button class="rating hard" data-rating="hard">Hard<small>~1 day</small></button><button class="rating good" data-rating="good">Good<small>longer gap</small></button><button class="rating easy" data-rating="easy">Easy<small>much longer</small></button></div></div></article>';
 const reveal=(check)=>{const input=document.getElementById('answerInput').value;currentEvaluation=check?evaluateCard(c,input):{status:'neutral',score:0,text:'Model answer shown. Compare it honestly.',missing:[]};if(currentEvaluation.status==='correct')awardFlashIfCorrect();const f=document.getElementById('feedback');f.className='feedback show '+currentEvaluation.status;f.textContent=currentEvaluation.text;document.getElementById('modelAnswer').classList.add('show');if(currentEvaluation.missing?.length)document.getElementById('missingIdeas').innerHTML='<ul class="missing-list">'+currentEvaluation.missing.map(x=>'<li>Missing: '+esc(x)+'</li>').join('')+'</ul>';document.getElementById('ratings').classList.add('show');if(currentEvaluation.status!=='correct')document.getElementById('overrideBtn').classList.add('show')};
 document.getElementById('checkCard').onclick=()=>reveal(true);document.getElementById('revealCard').onclick=()=>reveal(false);document.getElementById('overrideBtn').onclick=overrideFlashCorrect;document.querySelectorAll('[data-rating]').forEach(b=>b.onclick=()=>rateCard(c,b.dataset.rating,document.getElementById('answerInput').value))
}
function examSuggested(q,answer){
 if(/^\s*(?:i (?:do not|don't|dont) know|idk|no idea|not sure|unsure)\s*[.!]?\s*$/i.test(String(answer||'')))return {preds:q.markPoints.map(()=>false),scores:q.markPoints.map(()=>0),finalCorrect:false,confidence:'high',suggested:0};
 const scores=q.markPoints.map(p=>markPointPrediction(answer,p));
 let preds=scores.map(v=>v>=.5);
 const variants=(q.answerVariants||[]).map(x=>compact(x)).filter(Boolean);
 const exactVerbal=variants.length>0&&variants.includes(compact(answer));
 const finalCorrect=numericMatch(q,answer);
 const qt=String(q.questionType||'').toLowerCase();
 const ordinaryCalculation=q.answerType==='numeric'&&!/proof|show|explain|justify|derive|practical|evaluation/.test(qt)&&q.requiresWorking!==true;
 if(finalCorrect&&ordinaryCalculation){
   // For an ordinary calculation where working is not compulsory, the correct result may imply method marks. The user reviews the suggestion.
   preds=preds.map(()=>true);
 }
 let suggested;
 if(Array.isArray(q.markPointMarks)&&q.markPointMarks.length===q.markPoints.length){
   suggested=preds.reduce((sum,on,i)=>sum+(on?(Number(q.markPointMarks[i])||0):0),0);
 }else{
   suggested=Math.round(preds.filter(Boolean).length/Math.max(1,q.markPoints.length)*q.marks);
 }
 if(finalCorrect&&ordinaryCalculation)suggested=q.marks;
 else if(finalCorrect){
  // When working is essential, numerical correctness gives final-answer credit,
  // but calculation-method points still need to be demonstrated.
  suggested=Math.max(suggested,Math.min(q.marks,1));
 }
 if(exactVerbal&&q.requiresWorking!==true){suggested=q.marks;preds=preds.map(()=>true);}
 // Text/model answers get an extra equivalence check so algebraically or verbally equivalent forms are not rejected just for wording.
 if(q.modelAnswer&&String(answer||'').trim()){
   const modelMatch=Math.max(formulaScore(answer,q.modelAnswer),phraseScore(answer,q.modelAnswer));
   // Only give shortcut full credit when the model response is effectively complete.
   // A merely similar answer must be reviewed marking point by marking point.
   if(modelMatch>=.97&&q.marks<=2&&!contradicts(answer,q.modelAnswer)){suggested=Math.max(suggested,q.marks);preds=preds.map(()=>true)}
 }
 if(q.answerType==='levels'&&q.marks>=4)suggested=Math.min(suggested,Math.max(1,Math.ceil(q.marks*.66)));
 const matched=preds.filter(Boolean).length,confidence=finalCorrect||exactVerbal?'high':q.answerType==='levels'?'low':matched===q.markPoints.length?'medium':matched>=Math.ceil(q.markPoints.length/2)?'medium':'low';
 return {preds,scores,finalCorrect,confidence,suggested:clamp(suggested,0,q.marks)};
}

function renderExam(q){
 const prev=profile.examResults[q.id]?.last,diag=q.visual?diagram(q.visual):'',secondary=q.verificationLevel==='secondary-indexed',original=q.verificationLevel==='original-exam-style'||q.year==='Practice';
 const linked=examQuestions.filter(x=>x.groupId===q.groupId).sort((a,b)=>String(a.groupOrder).localeCompare(String(b.groupOrder),undefined,{numeric:true}));
 const linkedIndex=linked.findIndex(x=>x.id===q.id);
 const linkedNote=linked.length>1?'<div class="copyright-note">Linked original question · part '+(linkedIndex+1)+' of '+linked.length+'. Related parts are kept together in sessions.</div>':'';
 const sourceNote=original?'<div class="copyright-note">Original exam-style practice question, not an AQA past-paper question or official mark scheme.</div>':q.sourceFirst?'<div class="copyright-note">This bank entry is source-linked: open the source first because its original figure/table/context is needed.</div>':secondary?'<div class="copyright-note">2025 AQA paper entry cross-checked against independent paper/mark-scheme indexes. The direct public AQA PDF was not available through the current web index, so provenance is shown explicitly.</div>':'<div class="copyright-note">In-app wording is a faithful self-contained paraphrase of the verified AQA task.</div>';
 document.getElementById('studyHost').innerHTML='<article class="exam-card"><div class="card-meta"><div class="meta-left"><span class="badge real">'+(original?'Original practice':secondary?'AQA 2025 · cross-checked':'AQA source-linked')+'</span><span class="badge">'+esc(q.subject)+' · '+esc(q.level)+'</span><span class="badge">'+esc(q.courseTopic||q.topic)+'</span></div><span class="queue-pos">'+esc(original?'Practice Q'+q.question:q.year+' '+q.paper+' Q'+q.question)+' · '+q.marks+' marks</span></div><div class="card-body">'+sourceNote+linkedNote+'<div class="question-type">'+esc(q.questionType||'exam question')+'</div>'+(diag?'<div class="exam-visual">'+diag+'</div>':'')+'<div class="question">'+esc(q.prompt)+'</div>'+(original?'':'<div class="exam-source"><a class="source-link" target="_blank" rel="noopener" href="'+esc(q.qpUrl)+'">'+(secondary?'Question source/index':'Open official AQA question')+'</a><a class="source-link" target="_blank" rel="noopener" href="'+esc(q.msUrl)+'">'+(secondary?'Marking source/index':'Official mark scheme')+'</a></div>')+'<textarea id="examAnswer" class="answer-input" placeholder="Write your full working / answer here…"></textarea>'+(prev?'<div class="question-type">Previous score: '+prev.marks+'/'+prev.max+'</div>':'')+'<button id="markExam" class="check-btn">Mark my answer</button><div id="examFeedback" class="feedback"></div><div id="examMarking" class="markscheme"></div><div id="scoreEditor" class="score-editor"></div></div></article>';
 document.getElementById('markExam').onclick=()=>{
   const answer=document.getElementById('examAnswer').value,res=examSuggested(q,answer),marking=document.getElementById('examMarking');
   marking.classList.add('show');
   marking.innerHTML='<b>Mark-scheme points:</b><div class="markpoint-grid">'+q.markPoints.map((p,i)=>'<label class="markpoint '+(res.preds[i]?'predicted':'')+'"><input type="checkbox" data-mp="'+i+'" '+(res.preds[i]?'checked':'')+'><span>'+esc(p)+'</span></label>').join('')+'</div>'+(q.modelAnswer?'<p><b>Model outcome:</b> '+esc(q.modelAnswer)+'</p>':'')+(q.answerType==='numeric'?'<p><b>Official final answer:</b> '+q.numericAnswer+(q.unit?' '+esc(q.unit):'')+'</p>':'');
   currentExamScore=res.suggested;
   const ef=document.getElementById('examFeedback');ef.className='feedback show '+(res.finalCorrect?'correct':'neutral');
   ef.textContent=res.finalCorrect?'High-confidence check: final numerical answer matches. Method marks are checked below.':'Auto-check confidence: '+res.confidence+'. It checks equivalent wording, ordinary spelling errors, formulas and direct contradictions. Review highlighted marking points before saving.';
   renderScoreEditor(q,answer);
   document.querySelectorAll('[data-mp]').forEach(el=>el.onchange=()=>{
     const checked=[...document.querySelectorAll('[data-mp]')].filter(x=>x.checked).length;
     currentExamScore=clamp(Math.round(checked/Math.max(1,q.markPoints.length)*q.marks),0,q.marks);
     renderScoreEditor(q,answer);
   });
 };
}

function renderScoreEditor(q,answer){const ed=document.getElementById('scoreEditor');ed.classList.add('show');const missed=q.markPoints.filter((_,i)=>!document.querySelector('[data-mp="'+i+'"]')?.checked);ed.innerHTML='<div class="score-line"><strong>Suggested mark: '+currentExamScore+'/'+q.marks+'</strong><span>Tap a mark to correct it</span></div><div class="mark-buttons">'+Array.from({length:q.marks+1},(_,i)=>'<button class="mark-btn '+(i===currentExamScore?'selected':'')+'" data-score="'+i+'">'+i+'</button>').join('')+'</div>'+(missed.length?'<div class="missed-summary"><b>Likely missing:</b> '+missed.map(esc).join(' • ')+'</div>':'<div class="feedback show correct">No mark-scheme point is currently flagged as missing.</div>')+'<button id="saveExamScore" class="primary-btn save-score">Save '+currentExamScore+'/'+q.marks+'</button>';document.querySelectorAll('[data-score]').forEach(b=>b.onclick=()=>{currentExamScore=Number(b.dataset.score);renderScoreEditor(q,answer)});document.getElementById('saveExamScore').onclick=()=>{const mp=q.markPoints.filter((_,i)=>!document.querySelector('[data-mp="'+i+'"]')?.checked);awardExam(q,currentExamScore,answer,mp)}}
function renderStudy(){
 renderStudyType();renderSessionBanner();
 if(activeSession?.done){document.getElementById('studyHost').innerHTML='<div class="empty-card"><h3>Session complete</h3><p>Your results have been saved into the memory and weakness model.</p><button id="endSession" class="primary-small">Finish</button></div>';document.getElementById('endSession').onclick=()=>{activeSession=null;renderAll()};return}
 if(!activeSession){document.getElementById('studyHost').innerHTML='<div class="empty-card"><h3>Choose what you want to revise</h3><p>Select multiple topics above, then start a random session. Weak areas are more likely to appear without making the order predictable.</p></div>';return}
 const item=activeSession.items[activeSession.index];if(!item){activeSession.done=true;renderStudy();return}const obj=item.type==='card'?cards.find(c=>c.id===item.id):examQuestions.find(q=>q.id===item.id);if(!obj){activeSession.index++;renderStudy();return}item.type==='card'?renderCard(obj):renderExam(obj)
}
function renderWeak(){
 const byTopic=new Map();
 for(const c of cards.filter(x=>x.active!==false)){
  const topic=c.revisionTopic||c.topic,key=c.subject+'|'+topic;
  let row=byTopic.get(key);if(!row){row={subject:c.subject,topic,cardCount:0,worstMemory:100,totalMemory:0,maxWeakness:0};byTopic.set(key,row)}
  const memory=Math.round(memoryHealth(c)*100);
  row.cardCount++;row.totalMemory+=memory;row.worstMemory=Math.min(row.worstMemory,memory);row.maxWeakness=Math.max(row.maxWeakness,weakness(c));
 }
 const entries=[...byTopic.values()].map(x=>({...x,memory:Math.round(x.totalMemory/x.cardCount)})).sort((a,b)=>b.maxWeakness-a.maxWeakness).slice(0,45);
 document.getElementById('weakList').innerHTML=entries.map(x=>{
  const ts=topicStat(x.subject,x.topic),acc=ts.examMax?Math.round(ts.examMarks/ts.examMax*100):null;
  const cls=x.memory>=85?'memory-good':x.memory>=60?'memory-mid':'memory-low';
  return '<div class="list-row"><div><strong>'+esc(x.topic)+'</strong><small>'+
    esc(x.subject)+' · '+x.cardCount+' cards · average memory '+x.memory+'% · lowest '+x.worstMemory+'%'+
    (acc!==null?' · exam '+acc+'%':'')+'</small></div><span class="memory-pill '+cls+'">'+Math.round(x.maxWeakness)+'</span></div>';
 }).join('')||'<div class="empty-card">No weaknesses recorded yet.</div>';
 const r=profile.errorLog.slice(0,30);document.getElementById('mistakeList').innerHTML=r.length?r.map(e=>'<div class="list-row"><div><strong>'+esc(e.topic)+'</strong><small>'+esc(e.subject)+' · '+esc(e.type==='exam'?'exam '+e.result:e.result)+(e.missedPoints?.length?' · missed: '+esc(e.missedPoints.slice(0,2).join(' / ')):'')+'</small></div><span class="score-pill">'+new Date(e.date).toLocaleDateString(undefined,{day:'numeric',month:'short'})+'</span></div>').join(''):'<div class="empty-card">No recorded mistakes yet.</div>';
}

const AQA_SYLLABUS={
 Physics:[
  ['Measurements and their errors',/Measurements & practical skills|Measurements|Practical skills/i],
  ['Particles and radiation',/Particles & radiation|Particle physics|Photon|Photoelectric|Energy levels/i],
  ['Waves',/^Waves$|Interference|Diffraction|Polarisation|Refraction|Stationary waves/i],
  ['Mechanics and materials',/Mechanics & materials|Newton|Couples|Free-body|Energy|Materials|Vectors|Forces on a slope/i],
  ['Electricity',/^Electricity$|EMF|Resistivity|Potential dividers/i],
  ['Further mechanics',/Circular motion|SHM|Resonance/i],
  ['Thermal physics',/Thermal physics|Kinetic theory|Gas laws/i],
  ['Fields and their consequences',/Gravitational fields|Electric fields|Magnetic fields|Capacitance|Electromagnetic induction/i],
  ['Nuclear physics',/Nuclear physics|Radioactivity/i],
  ['Medical physics (chosen option)',/Medical physics/i]
 ],
 Chemistry:[
  ['Atomic structure',/Atomic structure|Ionisation energy/i],
  ['Amount of substance',/Amount of substance|Titration calculations|Back titrations|Empirical formula/i],
  ['Bonding',/Bonding|Shapes|Intermolecular forces/i],
  ['Energetics',/^Energetics$/i],
  ['Kinetics',/^Kinetics$/i],
  ['Equilibria and Kc',/Equilibria|Kc/i],
  ['Redox',/^Redox$/i],
  ['Thermodynamics',/Thermodynamics|Born.Haber|Entropy|Gibbs/i],
  ['Rate equations',/Rate equations|Arrhenius/i],
  ['Kp',/^Kp$/i],
  ['Electrode potentials',/Electrode potentials/i],
  ['Acids and bases',/Acids & bases|Weak acids|Buffers|Kw/i],
  ['Periodicity',/^Periodicity$/i],
  ['Group 2',/^Group 2$/i],
  ['Group 7',/^Group 7$/i],
  ['Period 3 elements and oxides',/Period 3/i],
  ['Transition metals',/Transition metals/i],
  ['Aqueous ions',/Aqueous ions/i],
  ['Introduction to organic chemistry',/^Organic chemistry$/i],
  ['Alkanes',/^Alkanes$/i],
  ['Halogenoalkanes',/^Halogenoalkanes$/i],
  ['Alkenes',/^Alkenes$/i],
  ['Alcohols',/^Alcohols$/i],
  ['Organic analysis',/^Organic analysis$|Organic analysis & synthesis/i],
  ['Optical isomerism',/Optical isomerism/i],
  ['Aldehydes and ketones',/Aldehydes and ketones/i],
  ['Carboxylic acids and derivatives',/Carboxylic acids|Esters|Acyl chlorides/i],
  ['Aromatic chemistry',/Aromatic chemistry/i],
  ['Amines',/^Amines$/i],
  ['Polymers',/Polymers/i],
  ['Amino acids, proteins and DNA',/Amino acids|DNA/i],
  ['Organic synthesis',/Organic synthesis/i],
  ['NMR',/^NMR$/i],
  ['Chromatography',/Chromatography/i]
 ],
 Maths:[
  ['Proof',/^Proof$/i],
  ['Algebra and functions',/Algebra|Functions|Quadratics|Binomial|Transformations/i],
  ['Coordinate geometry',/Coordinate geometry/i],
  ['Sequences and series',/Sequences/i],
  ['Trigonometry',/Trigonometry/i],
  ['Exponentials and logarithms',/Logarithms|Logs|Exponentials/i],
  ['Differentiation',/Differentiation/i],
  ['Integration',/Integration/i],
  ['Numerical methods',/Numerical methods/i],
  ['Vectors',/Vectors/i],
  ['Statistical sampling',/Sampling/i],
  ['Data presentation and interpretation',/Data presentation|Data interpretation/i],
  ['Probability',/Probability/i],
  ['Statistical distributions',/Statistical distributions|Binomial distribution|Normal distribution/i],
  ['Statistical hypothesis testing',/Hypothesis testing/i],
  ['Quantities and units in mechanics',/Quantities and units/i],
  ['Kinematics',/Kinematics/i],
  ["Forces and Newton's laws",/Forces|Newton/i],
  ['Moments',/Moments/i]
 ]
};
function renderSyllabusCoverage(){
 const el=document.getElementById('syllabusCoverage'),select=document.getElementById('specSubject');
 if(!el||!select)return;const sub=select.value;
 el.innerHTML=(AQA_SYLLABUS[sub]||[]).map(([name,re])=>{
  const nc=cards.filter(c=>c.subject===sub&&re.test(c.topic+' | '+(c.courseTopic||''))).length;
  const nq=examQuestions.filter(q=>q.subject===sub&&q.standalone!==false&&re.test(q.topic+' | '+(q.courseTopic||'')+' | '+(q.subtopic||''))).length;
  return '<div class="syllabus-row '+(!nc&&!nq?'missing':'')+'"><strong>'+esc(name)+'</strong><small>'+(nc||nq?nc+' cards · '+nq+' questions':'Not yet indexed')+'</small></div>';
 }).join('');
}
function renderProgress(){
 renderSyllabusCoverage();
 document.getElementById('subjectProgress').innerHTML=['Physics','Chemistry','Maths'].map(sub=>{const a=cards.filter(c=>c.active!==false&&c.subject===sub),started=a.filter(c=>state(c.id).stage>=0),mature=a.filter(c=>state(c.id).mastered).length,avg=started.length?Math.round(started.map(memoryHealth).reduce((x,y)=>x+y,0)/started.length*100):0,ts=Object.entries(profile.topicStats).filter(([k])=>k.startsWith(sub+'|')).map(([,v])=>v),em=ts.reduce((x,v)=>x+(v.examMarks||0),0),ex=ts.reduce((x,v)=>x+(v.examMax||0),0);return '<div class="progress-card"><div class="subject-progress-head"><span>'+sub+'</span><span>'+mature+' mature / '+a.length+'</span></div><div class="bar-track"><div class="bar-fill" style="width:'+(a.length?mature/a.length*100:0)+'%"></div></div><div class="progress-note">'+started.length+' started · predicted recall '+avg+'%'+(ex?' · exam '+em+'/'+ex:'')+'</div></div>'}).join('');
 const started=cards.filter(c=>state(c.id).stage>=0),avg=started.length?Math.round(started.map(memoryHealth).reduce((a,b)=>a+b,0)/started.length*100):0,long=started.filter(c=>state(c.id).stability>=90).length;document.getElementById('retentionCard').innerHTML='<h3>Retention model</h3><div class="schedule-row"><span>Average predicted recall</span><b>'+avg+'%</b></div><div class="schedule-row"><span>Cards stable for 3+ months</span><b>'+long+'</b></div><div class="schedule-row"><span>Recorded mistakes</span><b>'+profile.errorLog.length+'</b></div>'
}

function buy(kind,id){
 let item,owned;
 if(kind==='character'){item=CHARACTERS.find(x=>x.id===id);owned=profile.shopOwned.characters}
 else if(kind==='outfit'){item=OUTFITS.find(x=>x.id===id);owned=profile.shopOwned.outfits}
 else {item=LOCATIONS.find(x=>x.id===id);owned=profile.shopOwned.locations}
 if(!item)return;
 if(owned.includes(id)){
   if(kind==='character'){profile.equippedCharacter=id;const ownFor=profile.shopOwned.outfits.find(x=>x.startsWith(id+'-'));profile.equippedOutfit=ownFor||id+'-default'}
   else if(kind==='outfit'){profile.equippedOutfit=id;profile.equippedCharacter=item.character}
   else profile.equippedLocation=id;
   save();renderAll();return;
 }
 if(profile.points<item.cost){showToast('Not enough points yet');return}
 profile.points-=item.cost;owned.push(id);
 if(kind==='character'){profile.equippedCharacter=id;const def=id+'-default';if(!profile.shopOwned.outfits.includes(def))profile.shopOwned.outfits.push(def);profile.equippedOutfit=def}
 else if(kind==='outfit'){profile.equippedOutfit=id;profile.equippedCharacter=item.character}
 else profile.equippedLocation=id;
 save();showToast('Unlocked '+item.name);renderAll();
}

function placeImage(el,url,location){
 if(!url||!el?.isConnected)return;
 const img=document.createElement('img');img.loading='lazy';img.alt='Photograph of '+location.name;img.referrerPolicy='no-referrer';
 el.replaceChildren(img);
 img.onerror=()=>{if(el.isConnected)el.textContent='Photo unavailable'};
 img.src=url;
}
const LOCATION_PHOTO_SEARCH={
 hongkong:'Hong Kong Victoria Harbour skyline panorama',
 singapore:'Singapore Marina Bay skyline photograph',
 bali:'Bali Indonesia rice terrace landscape',
 bohol:'Bohol Chocolate Hills landscape',coron:'Coron Palawan lagoon Philippines',
 peritomoreno:'Perito Moreno Glacier panorama',chefchaouen:'Chefchaouen Morocco blue city',
 papeete:'Papeete Tahiti harbour',apia:'Apia Samoa town',grandcanyon:'Grand Canyon South Rim panorama'
};
async function locationPhoto(location,el){
 if(!location||!el?.isConnected)return;
 if(wikiPhotoCache[location.id]){placeImage(el,wikiPhotoCache[location.id],location);return}
 let url=null;
 if(LOCATION_PHOTO_SEARCH[location.id]){
  try{
   const q=LOCATION_PHOTO_SEARCH[location.id];
   const api='https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch='+encodeURIComponent(q)+'&gsrlimit=15&prop=imageinfo&iiprop=url&iiurlwidth=640&format=json&formatversion=2&origin=*';
   const res=await fetch(api,{cache:'force-cache'});if(res.ok){
    const data=await res.json();
    const pages=(data.query?.pages||[]).filter(p=>/\.(?:jpg|jpeg|png|webp)$/i.test(p.title||'')&&!/logo|map|flag|coat of arms|diagram/i.test(p.title||''));
    const found=pages.find(p=>p.imageinfo?.[0]?.thumburl);
    if(found)url=found.imageinfo[0].thumburl;
   }
  }catch{}
 }
 if(!url){
  try{
   const endpoint='https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&formatversion=2&pithumbsize=640&origin=*&titles='+encodeURIComponent(location.wiki.replace(/_/g,' '));
   const res=await fetch(endpoint,{cache:'force-cache'});
   if(res.ok){const d=await res.json();url=d.query?.pages?.[0]?.thumbnail?.source||null}
  }catch{}
 }
 if(url){wikiPhotoCache[location.id]=url;placeImage(el,url,location)}
 else el.textContent='Photograph unavailable';
}
function evenlySpacedLocations(locations){
 const regions=['Africa','Asia','Europe','North America','South America','Oceania'];
 const buckets=Object.fromEntries(regions.map(r=>[r,locations.filter(x=>x.region===r)]));
 const arr=[];
 let changed=true;
 while(changed){changed=false;for(const region of regions){if(buckets[region].length){arr.push(buckets[region].shift());changed=true}}}
 return arr.concat(locations.filter(x=>!regions.includes(x.region)));
}
function renderLocationGallery(){
 const selected=document.getElementById('locationRegion').value;
 const pool=selected?LOCATIONS.filter(l=>l.region===selected):evenlySpacedLocations(LOCATIONS);
 const visible=pool.slice(0,locationVisibleLimit);
 document.getElementById('regionCount').textContent=selected?pool.length+' places':LOCATIONS.length+' worldwide';
 document.getElementById('locationShop').innerHTML=visible.map(l=>{
  const owned=profile.shopOwned.locations.includes(l.id);
  return '<div class="shop-item location-card"><div class="location-photo" data-location-photo="'+esc(l.id)+'">Loading photograph…</div>'+
   '<div class="location-body"><b>'+esc(l.name)+'</b><small class="region-tag">'+esc(l.region||'Global')+'</small>'+
   '<button class="'+(!owned?'buy':'')+'" data-location="'+esc(l.id)+'" '+(!owned&&profile.points<l.cost?'disabled':'')+'>'+
   (owned?(profile.equippedLocation===l.id?'Active location':'Use location'):l.cost+' points')+'</button></div></div>';
 }).join('');
 document.querySelectorAll('[data-location]').forEach(b=>b.onclick=()=>buy('location',b.dataset.location));
 document.querySelectorAll('[data-location-photo]').forEach(el=>locationPhoto(LOCATIONS.find(l=>l.id===el.dataset.locationPhoto),el));
 const more=document.getElementById('moreLocations');
 more.classList.toggle('hidden',visible.length>=pool.length);
 more.textContent='Show more places ('+visible.length+' / '+pool.length+')';
}
const REGION_CULTURE={
 'Asia':'Local traditions, food and languages vary greatly across this region, from ancient cities to modern centres.',
 'Europe':'The cityscape, cuisine and festivals reflect different European languages and regional histories.',
 'Africa':'Regional languages, cuisines, arts and traditions differ greatly between communities and countries.',
 'North America':'Explore the local mix of histories, food, music and cultural traditions in the surrounding area.',
 'South America':'Local food, music and architecture reflect varied Indigenous and other historical influences.',
 'Oceania':'Explore the distinctive Indigenous, Pacific Island and contemporary cultures of the region.'
};
const LOCATION_FACTS={
 london:'The River Thames passes through the centre of London.',
 singapore:'Singapore is both a city and an independent country.',
 hongkong:'Victoria Harbour separates Hong Kong Island from the Kowloon Peninsula.',
 bali:'Bali is an Indonesian island with a distinctive Hindu cultural heritage.',
 tokyo:'Tokyo is the capital of Japan.',
 sydney:'Sydney Harbour contains the Sydney Opera House and the Harbour Bridge.',
 capetown:'Table Mountain overlooks Cape Town.',
 rio:'Rio de Janeiro is famous for its Carnival celebrations.',
 nairobi:'Nairobi is the capital of Kenya.',
 cusco:'Cusco was an important capital of the Inca Empire.',
 machupicchu:'Machu Picchu is an Inca archaeological site high in the Andes.',
 paris:'The Eiffel Tower was constructed for the 1889 Exposition Universelle.',
 rome:'The Colosseum dates from the Roman Empire.',
 edinburgh:'Edinburgh hosts an internationally known annual arts festival.',
 newyork:'New York City contains five boroughs.',
 queenstown:'Queenstown sits beside Lake Wakatipu on New Zealand’s South Island.',
 petra:'Petra is known for architecture carved into sandstone cliffs.',
 reykjavik:'Reykjavík is the capital of Iceland.'
};
async function setLocationInfo(id){
 if(openLocationId===id){openLocationId=null;document.getElementById('globeLocationInfo').classList.add('hidden');drawGlobe();return}
 const l=LOCATIONS.find(x=>x.id===id),host=document.getElementById('globeLocationInfo');
 if(!l)return;
 if(!profile.shopOwned.locations.includes(id)){showToast('Unlock '+l.name+' to explore its details');return}
 openLocationId=id;selectedLocation=id;
 host.classList.remove('hidden');
 host.innerHTML='<div class="globe-info-top"><h3>'+esc(l.name)+'</h3><button id="closeLocationInfo" aria-label="Close location information">Close</button></div>'+
 '<div class="detail-media"><div id="detailPhotoOne" class="image-fallback">Loading location photo…</div><div id="detailPhotoTwo" class="image-fallback">Finding another view…</div></div>'+
 '<p id="locationOverview">Loading a short introduction…</p><p><b>Culture:</b> '+esc(REGION_CULTURE[l.region]||'Explore local traditions and heritage.')+'</p>'+
 '<p><b>Quick fact:</b> '+esc(LOCATION_FACTS[id]||'See the destination overview for a distinctive feature of this place.')+'</p>'+
 '<div class="detail-links">Photographs and introductory text: <a href="https://en.wikipedia.org/wiki/'+encodeURIComponent(l.wiki)+'" target="_blank" rel="noopener noreferrer">Wikipedia</a> / <a href="https://commons.wikimedia.org/wiki/Special:MediaSearch?type=image&search='+encodeURIComponent(l.name)+'" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a></div>';
 document.getElementById('closeLocationInfo').onclick=()=>setLocationInfo(id);
 locationPhoto(l,document.getElementById('detailPhotoOne'));
 try{
  const endpoint='https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&exintro=1&exsentences=2&format=json&formatversion=2&origin=*&titles='+encodeURIComponent(l.wiki.replace(/_/g,' '));
  const response=await fetch(endpoint);const data=await response.json();
  if(openLocationId===id&&host.isConnected)document.getElementById('locationOverview').textContent=(data.query?.pages?.[0]?.extract||l.name+' is a destination in '+l.region+'.').slice(0,380);
 }catch{if(openLocationId===id&&host.isConnected)document.getElementById('locationOverview').textContent='Explore '+l.name+' in '+l.region+'.'}
 try{
  const endpoint='https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch='+encodeURIComponent(l.name+' panorama photograph')+'&gsrlimit=5&prop=imageinfo&iiprop=url&iiurlwidth=640&format=json&formatversion=2&origin=*';
  const response=await fetch(endpoint);const data=await response.json();
  const imgs=(data.query?.pages||[]).flatMap(p=>p.imageinfo||[]).map(i=>i.thumburl||i.url).filter(x=>/\.(jpg|jpeg|png|webp)(?:\?|$)/i.test(x));
  if(openLocationId===id&&host.isConnected&&imgs.length)placeImage(document.getElementById('detailPhotoTwo'),imgs[0],l);
  else if(openLocationId===id&&host.isConnected)document.getElementById('detailPhotoTwo').textContent='Second photo unavailable';
 }catch{if(openLocationId===id&&host.isConnected)document.getElementById('detailPhotoTwo').textContent='Second photo unavailable'}
 drawGlobe();
}
function renderShop(){
 const oc=profile.shopOwned.characters,oo=profile.shopOwned.outfits,ol=profile.shopOwned.locations,curr=profile.equippedCharacter;
 const seriesSel=document.getElementById('characterSeries'),ownedSel=document.getElementById('characterOwnedFilter');
 const series=[...new Set(CHARACTERS.map(c=>c.series))];
 const oldSeries=seriesSel.value;
 seriesSel.innerHTML='<option value="">All series</option>'+series.map(x=>'<option>'+esc(x)+'</option>').join('');
 if(series.includes(oldSeries))seriesSel.value=oldSeries;
 const seriesFilter=seriesSel.value,ownedFilter=ownedSel.value;
 const allVisibleChars=CHARACTERS.filter(c=>(!seriesFilter||c.series===seriesFilter)&&(ownedFilter==='all'||(ownedFilter==='owned'&&oc.includes(c.id))||(ownedFilter==='locked'&&!oc.includes(c.id))));const visibleChars=allVisibleChars.slice(0,characterVisibleLimit);
 document.getElementById('characterCount').textContent=oc.length+' / '+CHARACTERS.length+' unlocked';
 document.getElementById('outfitCount').textContent=oo.length+' / '+OUTFITS.length+' unlocked';
 document.getElementById('locationCount').textContent=ol.length+' / '+LOCATIONS.length+' unlocked';
 document.getElementById('characterShop').innerHTML=visibleChars.map(c=>{const def=OUTFITS.find(o=>o.id===c.id+'-default');return '<div class="shop-item character-card '+(curr===c.id?'active-character':'')+'"><div class="shop-icon">'+characterArtwork(c,def)+'</div><b>'+esc(c.name)+'</b><small>'+esc(c.series)+'</small><button class="'+(!oc.includes(c.id)?'buy':'')+'" data-character="'+c.id+'" '+(!oc.includes(c.id)&&profile.points<c.cost?'disabled':'')+'>'+(oc.includes(c.id)?(curr===c.id?'Selected':'Select'):c.cost+' points')+'</button></div>'}).join('');
 const outfits=OUTFITS.filter(o=>o.character===curr),ch=CHARACTERS.find(c=>c.id===curr)||CHARACTERS[0];
 document.getElementById('outfitHeading').textContent='Outfits for '+ch.name;
 document.getElementById('outfitCount').textContent=outfits.filter(o=>oo.includes(o.id)).length+' / '+outfits.length+' for '+ch.name;
 document.getElementById('outfitShop').innerHTML=outfits.map(o=>'<div class="shop-item outfit-card"><div class="shop-icon">'+characterArtwork(ch,o)+'</div><b>'+esc(o.name)+'</b><small>'+esc(ch.name)+' · '+esc(ch.series)+'</small><button class="'+(!oo.includes(o.id)?'buy':'')+'" data-outfit="'+o.id+'" '+(!oo.includes(o.id)&&profile.points<o.cost?'disabled':'')+'>'+(oo.includes(o.id)?(profile.equippedOutfit===o.id?'Equipped':'Equip'):o.cost+' points')+'</button></div>').join('');
 document.querySelectorAll('[data-character]').forEach(b=>b.onclick=()=>buy('character',b.dataset.character));
 document.querySelectorAll('[data-outfit]').forEach(b=>b.onclick=()=>buy('outfit',b.dataset.outfit));
 loadCharacterArt(document.getElementById('characterShop'));
 loadCharacterArt(document.getElementById('outfitShop'));
 const more=document.getElementById('moreCharacters');more.classList.toggle('hidden',visibleChars.length>=allVisibleChars.length);
 more.textContent='Show more characters ('+visibleChars.length+' of '+allVisibleChars.length+')';loadCharacterArt(document.getElementById('characterShop'));loadCharacterArt(document.getElementById('outfitShop'));
 renderLocationGallery();
 drawGlobe();
}
function project(lat,lon,w,h){const la=lat*Math.PI/180,lo=(lon-globeLon)*Math.PI/180,cl=globeLat*Math.PI/180,x=Math.cos(la)*Math.sin(lo),y=Math.sin(la)*Math.cos(cl)-Math.cos(la)*Math.cos(lo)*Math.sin(cl),z=Math.sin(la)*Math.sin(cl)+Math.cos(la)*Math.cos(lo)*Math.cos(cl);const R=Math.min(w,h)*.4;return {x:w/2+x*R,y:h/2-y*R,z}}
function visibleGlobePins(w,h,region=''){
 const projected=LOCATIONS.filter(l=>!region||l.region===region)
  .map(l=>({location:l,p:project(l.lat,l.lon,w,h),owned:profile.shopOwned.locations.includes(l.id)}))
  .filter(x=>x.p.z>0).sort((a,b)=>Number(b.owned)-Number(a.owned));
 const shown=[];
 for(const item of projected){if(shown.some(x=>Math.hypot(x.p.x-item.p.x,x.p.y-item.p.y)<10))continue;shown.push(item)}
 return shown;
}
function drawGlobe(){
 const c=document.getElementById('globe');if(!c)return;
 const ctx=c.getContext('2d'),w=c.width,h=c.height,R=Math.min(w,h)*.4,cx=w/2,cy=h/2;
 ctx.clearRect(0,0,w,h);ctx.fillStyle='#020617';ctx.fillRect(0,0,w,h);
 if(earthTextureReady&&earthPixels){
   const img=ctx.createImageData(w,h),out=img.data,lon0=globeLon*Math.PI/180,lat0=globeLat*Math.PI/180;
   const cosLat0=Math.cos(lat0),sinLat0=Math.sin(lat0);
   const minX=Math.max(0,Math.floor(cx-R)),maxX=Math.min(w-1,Math.ceil(cx+R)),minY=Math.max(0,Math.floor(cy-R)),maxY=Math.min(h-1,Math.ceil(cy+R));
   for(let py=minY;py<=maxY;py+=1){
     const yy=-(py-cy)/R;
     for(let px=minX;px<=maxX;px+=1){
       const xx=(px-cx)/R,r2=xx*xx+yy*yy;if(r2>1)continue;
       const z=Math.sqrt(1-r2);
       const lat=Math.asin(yy*cosLat0+z*sinLat0);
       const lon=lon0+Math.atan2(xx,z*cosLat0-yy*sinLat0);
       let u=((lon/(2*Math.PI)+.5)%1+1)%1,v=.5-lat/Math.PI;
       const tx=Math.min(earthW-1,Math.max(0,Math.floor(u*earthW))),ty=Math.min(earthH-1,Math.max(0,Math.floor(v*earthH))),si=(ty*earthW+tx)*4,di=(py*w+px)*4;
       const light=.58+.42*Math.max(0,z+.15*xx-.15*yy);
       out[di]=earthPixels[si]*light;out[di+1]=earthPixels[si+1]*light;out[di+2]=earthPixels[si+2]*light;out[di+3]=255;
     }
   }
   ctx.putImageData(img,0,0);
 }else{
   const g=ctx.createRadialGradient(cx-R*.3,cy-R*.3,R*.08,cx,cy,R);g.addColorStop(0,'#60a5fa');g.addColorStop(.55,'#2563eb');g.addColorStop(1,'#0f172a');ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.fill();
 }
 ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.stroke();
 const regionFilter=document.getElementById('locationRegion')?.value||'';
 for(const {location:l,p,owned} of visibleGlobePins(w,h,regionFilter)){
 ctx.beginPath();ctx.arc(p.x,p.y,owned?6:4.5,0,Math.PI*2);
 ctx.fillStyle=owned?'#111827':'#ffffff';ctx.fill();ctx.lineWidth=owned?2:1.2;ctx.strokeStyle=owned?'#f8fafc':'#334155';ctx.stroke();
 if(l.id===openLocationId){ctx.beginPath();ctx.arc(p.x,p.y,9,0,Math.PI*2);ctx.strokeStyle='#fbbf24';ctx.lineWidth=2.2;ctx.stroke()}
 }
 document.getElementById('globeLabel').textContent='Drag to rotate · white = locked · black = unlocked · tap an unlocked pin for details';
}
function globePointer(e){const c=document.getElementById('globe'),r=c.getBoundingClientRect(),x=(e.clientX-r.left)*c.width/r.width,y=(e.clientY-r.top)*c.height/r.height;return {x,y}}
function nearestPin(x,y){let best=null,dist=14;const region=document.getElementById('locationRegion').value;for(const item of visibleGlobePins(700,360,region)){const d=Math.hypot(item.p.x-x,item.p.y-y);if(d<dist){dist=d;best=item.location}}return best}

function renderAll(){renderLevel();renderStats();renderAvatar();renderChallenge();renderStudyType();renderSessionBanner();renderStudy();renderWeak();renderProgress();if(document.getElementById('shop').classList.contains('active'))renderShop()}
async function sync(manual=false){
 try{const [dr,er]=await Promise.all([fetch(DECK_URL+'?v='+Date.now(),{cache:'no-store'}),fetch(EXAM_URL+'?v='+Date.now(),{cache:'no-store'})]);if(!dr.ok||!er.ok)throw new Error();const d=await dr.json(),e=await er.json(),old=deckVersion;cards=(d.cards||[]).filter(c=>c.active!==false);examQuestions=e.questions||[];deckMeta=d.meta||{};coverage=e.coverage||{};deckVersion=d.deckVersion||0;bankVersion=e.bankVersion||0;initPhysicsUnits();refreshFlashTopics(!flashTopics.size);refreshExamFilters(!examYears.size&&!examTopics.size);document.getElementById('syncState').textContent='Deck v'+deckVersion+' · '+cards.length+' flashcards · '+examQuestions.filter(q=>q.standalone!==false).length+' usable AQA question parts';if(manual)showToast(old&&deckVersion>old?'New revision content loaded':'Already up to date');renderAll()}catch{document.getElementById('syncState').textContent='Could not sync right now';if(manual)showToast('Sync failed')}
}
function switchPanel(id){document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.panel===id));document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id===id));if(id==='shop')setTimeout(renderShop,0)}
function buildWeakSession(){const top=cards.filter(c=>c.active!==false).sort((a,b)=>weakness(b)-weakness(a)).slice(0,20);activeSession={kind:'flash',items:top.map(c=>({type:'card',id:c.id})),index:0,title:'Weak-topic flashcards'};switchPanel('study');renderAll()}

ensureProfile();
document.getElementById('pinForm').onsubmit=async e=>{e.preventDefault();const ok=await unlock(document.getElementById('pinInput').value,document.getElementById('rememberPin').checked);document.getElementById('pinError').textContent=ok?'':'Incorrect code';if(ok)sync()};
document.getElementById('pinInput').oninput=e=>{e.target.value=e.target.value.replace(/\D/g,'').slice(0,4)};
if(localStorage.getItem('rl_auth')==='1'||sessionStorage.getItem('rl_auth')==='1'){document.getElementById('authGate').classList.add('hidden');document.getElementById('app').classList.remove('app-locked');sync()}else document.getElementById('pinInput').focus();

document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>switchPanel(b.dataset.panel));
document.querySelectorAll('.study-type-btn').forEach(b=>b.onclick=()=>{studyType=b.dataset.study;activeSession=null;renderAll()});
document.getElementById('flashSubject').onchange=()=>{flashTopics.clear();refreshFlashTopics(true);renderAll()};
document.querySelectorAll('[data-flash-preset]').forEach(b=>b.onclick=()=>applyFlashPreset(b.dataset.flashPreset));
document.getElementById('startMock').onclick=startMockSession;document.getElementById('startFlashcards').onclick=startFlashSession;
document.getElementById('examLevel').onchange=()=>{examTopics.clear();examYears.clear();examTypes.clear();refreshExamFilters(true);renderTopicCounts()};
document.getElementById('examSubject').onchange=()=>{examYears.clear();examTopics.clear();examTypes.clear();refreshExamFilters(true);renderAll()};
document.getElementById('yearsAll').onclick=()=>{examYears=new Set(subjectExam(document.getElementById('examSubject').value).map(q=>q.year));refreshExamFilters(false)};
document.getElementById('yearsRecent').onclick=()=>{const ys=[...new Set(subjectExam(document.getElementById('examSubject').value).map(q=>q.year))].sort((a,b)=>b-a);examYears=new Set(ys.slice(0,2));refreshExamFilters(false)};
document.getElementById('yearsClear').onclick=()=>{examYears.clear();refreshExamFilters(false)};
document.getElementById('examTopicsAll').onclick=()=>{examTopics=new Set(subjectExam(document.getElementById('examSubject').value).map(examTopicLabel));refreshExamFilters(false)};
document.getElementById('examTopicsWeak').onclick=()=>{const sub=document.getElementById('examSubject').value,exam=subjectExam(sub),ts=[...new Set(exam.map(examTopicLabel))].sort((a,b)=>{const strength=t=>exam.filter(q=>examTopicLabel(q)===t).reduce((n,q)=>n+(profile.topicWeakness[topicKey(sub,q.revisionTopic||q.topic)]||0)+(profile.errorLog.some(z=>z.id===q.id)?2:0),0);return strength(b)-strength(a)});examTopics=new Set(ts.slice(0,Math.max(1,Math.ceil(ts.length/3))));refreshExamFilters(false)};
document.getElementById('examTopicsClear').onclick=()=>{examTopics.clear();refreshExamFilters(false)};
document.getElementById('startExam').onclick=startExamSession;
document.getElementById('startChallenge').onclick=startChallenge;document.getElementById('challengeSubject').onchange=renderChallenge;document.getElementById('challengeScope').onchange=renderChallenge;
document.getElementById('reviewWeakBtn').onclick=buildWeakSession;document.getElementById('redoMistakesBtn').onclick=startMistakes;
document.getElementById('locationRegion').onchange=()=>{locationVisibleLimit=24;renderLocationGallery();drawGlobe()};document.getElementById('moreLocations').onclick=()=>{locationVisibleLimit+=24;renderLocationGallery()};document.getElementById('moreCharacters').onclick=()=>{characterVisibleLimit+=16;renderShop()};document.getElementById('characterSeries').onchange=()=>{characterVisibleLimit=16;renderShop()};document.getElementById('characterOwnedFilter').onchange=()=>{characterVisibleLimit=16;renderShop()};document.getElementById('specSubject').onchange=renderSyllabusCoverage;document.getElementById('syncBtn').onclick=()=>sync(true);document.getElementById('lockBtn').onclick=lockApp;

const globe=document.getElementById('globe');
globe.addEventListener('pointerdown',e=>{dragging=true;dragDistance=0;lastPointer={x:e.clientX,y:e.clientY};globe.setPointerCapture(e.pointerId)});
globe.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastPointer.x,dy=e.clientY-lastPointer.y;dragDistance+=Math.hypot(dx,dy);globeLon=(globeLon-dx*.45+540)%360-180;globeLat=clamp(globeLat+dy*.3,-65,65);lastPointer={x:e.clientX,y:e.clientY};drawGlobe()});
globe.addEventListener('pointerup',e=>{if(dragging&&dragDistance<10){const p=globePointer(e),l=nearestPin(p.x,p.y);if(l)setLocationInfo(l.id)}dragging=false});

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
