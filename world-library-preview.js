/* Standalone public editorial preview. No application profile access or mutations. */
(() => {
'use strict';
const list = document.getElementById('entryList');
const panel = document.getElementById('articlePanel');
const count = document.getElementById('worldCount');
const search = document.getElementById('worldSearch');
const type = document.getElementById('worldType');
const cache = new Map();
const photoMetadata = new Map();
const entries = [];
let activeId = null;
let renderVersion = 0;
const text = (tag, content, className) => {
  const node = document.createElement(tag);
  node.textContent = String(content ?? '');
  if (className) node.className = className;
  return node;
};
const safeSource = raw => {
  try {const url = new URL(raw);return url.protocol === 'https:' ? url.href : null}
  catch {return null}
};
const loadJson = async path => {
  if (!/^editorial\/[a-z0-9_]+\.json$/.test(path)) throw Error('Invalid article path');
  if (!cache.has(path)) {
    const task = fetch(path, { credentials:'omit' }).then(r => {
      if (!r.ok) throw Error('HTTP '+r.status+' for '+path);
      return r.json();
    }).catch(error => {cache.delete(path);throw error});
    cache.set(path, task);
  }
  return cache.get(path);
};
const normal = value => String(value ?? '').toLocaleLowerCase('en-GB');
const displayName = item => item.country || item.name;
const designationLabels={
  inscribed:'UNESCO World Heritage',
  tentative:'UNESCO Tentative List (not inscribed)',
  biosphere:'UNESCO Biosphere Reserve',
  ramsar:'Ramsar Wetland',
  national:'National protected area',
  museum:'Museum and marine science',
  environmental:'Environmental case study',
  'geographic-special':'Geographic entry: disputed status'
};

const filtered = () => entries.filter(x =>
  (type.value === 'all' || x.kind === type.value) &&
  normal(displayName(x)+' '+(x.focus||x.subtitle||'')).includes(normal(search.value.trim()))
);
const renderList = () => {
  const shown=filtered();
  count.textContent=shown.length+' of '+entries.length+' articles';
  list.replaceChildren();
  if (!shown.length) {
    list.append(text('li','No matches. Try another search.','empty'));
    return;
  }
  const frag=document.createDocumentFragment();
  shown.forEach(item => {
    const li=document.createElement('li');
    const button=text('button','','item');
    button.type='button';
    button.dataset.articleId=item.id;
    button.setAttribute('aria-current',String(item.id===activeId));
    button.append(text('strong',displayName(item)));
    button.append(text('small',item.kind+' · '+(item.focus||item.subtitle||'Research article')));
    button.addEventListener('click',() => showArticle(item));
    li.append(button);
    frag.append(li);
  });
  list.append(frag);
};
const openExternal = href => {
  const url=safeSource(href);
  if (!url) return null;
  const anchor=text('a',href);
  anchor.href=url;
  anchor.rel='noopener noreferrer';
  anchor.target='_blank';
  return anchor;
};
const showArticle = async item => {
  activeId=item.id;
  const version=++renderVersion;
  renderList();
  panel.replaceChildren(text('p','Loading article…','subtle'));
  try {
    const dataset=await loadJson(item.sourceFile);
    const article=(dataset.records||[]).find(x => (x.iso2 ? 'country-'+x.iso2.toLowerCase() : x.id)===item.id);
    if (!article) throw Error('Article missing from '+item.sourceFile);
    if (version!==renderVersion) return;
    const frag=document.createDocumentFragment();
    frag.append(text('div',item.kind.toUpperCase()+' / RESEARCH DRAFT','eyebrow'));
    frag.append(text('h2',displayName(item)));
    frag.append(text('p',article.focus||article.subtitle||item.focus||'','subtle'));
    const tags=document.createElement('div');tags.className='tags';
    tags.append(text('span',item.kind,'tag'));
    tags.append(text('span','200+ word draft','tag'));
    tags.append(text('span','No unlocked items changed','tag'));
    if(article.designation && designationLabels[article.designation]) tags.append(text('span',designationLabels[article.designation],'tag'));
    frag.append(tags);
    if (Array.isArray(article.sections)) {
      article.sections.forEach(section=>{
        frag.append(text('h3',section.title));
        frag.append(text('p',section.body));
      });
    } else if (typeof article.article==='string') {
      article.article.split(/\n\s*\n/).filter(Boolean).forEach(paragraph=>frag.append(text('p',paragraph)));
    } else {
      throw Error('No article sections found');
    }
    if (article.quickFact) {
      frag.append(text('h3','One thing to remember'));
      frag.append(text('p',article.quickFact));
    }
    const vetted=item.kind==='country' ? (photoMetadata.get(item.iso2)||[]) : [];
    // Render reviewed files only, with immediate visible attribution and original Commons links.
    const approvedImages=new Set([
      'Butrint. theatre.jpg','Butrint theatre.jpg',
      'Geghard Monastery, Armenia.jpg','Geghard Monastery, Church, Armenia.jpg','Geghard Monastery, Entrance, Armenia.jpg',
      'Stupa in Borobudur Temple, Indonesia.jpg','Borobudur temple.jpg','Stupa Candi Borobudur.jpg',
      'Banff National Park landscape.jpg','Gobekli Tepe 4.jpg','Göbeklitepe.jpg',
      'Singapore Botanic Gardens.jpg','Singapore Botanic Gardens (1).jpg'
    ]);
    const pictures=vetted.filter(p=>approvedImages.has(p.file)&&p.countryCode===item.iso2);
    if(pictures.length){
      const gallery=document.createElement('div');
      gallery.className='licensed-world-photo-gallery';
      for(const image of pictures){
        const figure=document.createElement('figure');
        figure.className='licensed-world-photo';
        const img=document.createElement('img');
        img.loading='lazy';
        img.decoding='async';
        img.alt=image.caption;
        img.referrerPolicy='no-referrer';
        img.src='https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(image.file)+'?width=800';
        img.onerror=()=>{
          img.remove();
          figure.prepend(text('p','Photograph unavailable — see its original Commons file page.','subtle'));
        };
        figure.append(img);
        const caption=document.createElement('figcaption');
        caption.append(text('span',image.caption+' — photo by '+image.author+'. '));
        const fileLink=openExternal(image.filePage);
        if(fileLink){fileLink.textContent='Original photograph';caption.append(fileLink)}
        const licenseLink=openExternal(image.licenseUrl);
        if(licenseLink){caption.append(text('span',' · '));licenseLink.textContent=image.license;caption.append(licenseLink)}
        caption.append(text('span',' · Display-size reduction only; no other edits.'));
        figure.append(caption);
        gallery.append(figure);
      }
      frag.append(gallery);
    }
    if(vetted.length){
      const photoDetails=document.createElement('details');
      photoDetails.append(text('summary','Checked image references ('+vetted.length+')'));
      photoDetails.append(text('p','These links lead to original Wikimedia Commons file pages. Pictures are not embedded in this draft.','subtle'));
      const photoList=document.createElement('ul');
      for(const photo of vetted){
        const li=document.createElement('li');
        li.append(text('span',photo.caption+' — '+photo.author+' ('+photo.license+'). '));
        const fileLink=openExternal(photo.filePage);
        if(fileLink){fileLink.textContent='Original photo and attribution';li.append(fileLink)}
        const licenceLink=openExternal(photo.licenseUrl);
        if(licenceLink){li.append(text('span',' · '));licenceLink.textContent='Licence';li.append(licenceLink)}
        photoList.append(li);
      }
      photoDetails.append(photoList);
      frag.append(photoDetails);
    }
    const details=document.createElement('details');
    const summary=text('summary','Sources and editorial notes');
    details.append(summary);
    details.append(text('p','These are factual references, not licences to reproduce their photos.','subtle'));
    const ul=document.createElement('ul');ul.id='sourceLinks';
    for(const source of (article.sources||[article.source]).filter(Boolean)){
      const a=openExternal(source);if(!a) continue;
      const li=document.createElement('li');li.append(a);ul.append(li);
    }
    details.append(ul);
    details.append(text('small','Photographs are not yet cleared for inclusion. This page does not award or deduct points.'));
    frag.append(details);
    panel.replaceChildren(frag);
    panel.focus({preventScroll:true});
  } catch(error) {
    if (version!==renderVersion) return;
    panel.replaceChildren(text('p','Unable to load this draft: '+error.message,'empty'));
  }
};
const initialise = async () => {
  try {
    const [country,oceans,seas1,seas2,photos3,photos4]=await Promise.all([
      loadJson('editorial/country_gateway_release_index_20261023.json'),
      loadJson('editorial/ocean_stories_5_20261023.json'),
      loadJson('editorial/sea_stories_batch1_9_20261023.json'),
      loadJson('editorial/sea_stories_batch2_8_20261023.json'),
      loadJson('editorial/commons_verified_photos_batch3_20261023.json'),
      loadJson('editorial/commons_verified_photos_batch4_20261023.json')
    ]);
    for(const photo of [...photos3.files,...photos4.files]){
      if(!photoMetadata.has(photo.countryCode))photoMetadata.set(photo.countryCode,[]);
      photoMetadata.get(photo.countryCode).push(photo);
    }
    for(const e of country.entries){
      entries.push({id:e.gatewayId,kind:'country',iso2:e.iso2,country:e.country,focus:e.focus,sourceFile:e.sourceFile});
    }
    for(const [dataset,kind,path] of [
      [oceans,'ocean','editorial/ocean_stories_5_20261023.json'],
      [seas1,'sea','editorial/sea_stories_batch1_9_20261023.json'],
      [seas2,'sea','editorial/sea_stories_batch2_8_20261023.json']
    ]){
      for(const e of dataset.records){
        entries.push({id:e.id,kind,name:e.name,subtitle:e.subtitle,sourceFile:path});
      }
    }
    if(new Set(entries.map(e=>e.id)).size!==entries.length) throw Error('Duplicate article identifier');
    entries.sort((a,b)=>displayName(a).localeCompare(displayName(b),'en-GB'));
    renderList();
    let requested=null;
    try {
      if(typeof window!=='undefined' && window.location?.search){
        requested=new URLSearchParams(window.location.search).get('country')?.trim().toUpperCase()||null;
      }
    }catch{}
    if(entries.length) await showArticle(entries.find(x=>x.kind==='country'&&x.iso2===requested)||entries[0]);
  } catch(error) {
    count.textContent='Preview unavailable';
    list.replaceChildren(text('li','The editorial files could not be loaded. Open this page through a web server, not directly as a file.','empty'));
    panel.replaceChildren(text('p','Source loading failed: '+error.message,'empty'));
  }
};
search.addEventListener('input',renderList);
type.addEventListener('change',renderList);
initialise();
})();
