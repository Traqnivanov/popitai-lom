'use strict';

const main = document.getElementById('app-main');
const addLayer = document.getElementById('add-layer');
let lastRenderedHash = location.hash || '#home';

function normalizeHomeComposition(){
  const sections=Array.from(main.children).filter(el=>el.matches?.('section.section'));
  const marketSection=sections.find(section=>section.querySelector('.section-head h2')?.textContent.trim()==='Обяви и услуги');
  const specialistSection=sections.find(section=>section.querySelector('.section-head h2')?.textContent.trim()==='Местни специализирани раздели');
  if(marketSection&&specialistSection){
    const shell=marketSection.querySelector('.shell');const specialGrid=specialistSection.querySelector('.special-grid');
    if(shell&&specialGrid){const head=document.createElement('div');head.className='section-head compact-head';head.innerHTML='<div><h2>Местни специализирани раздели</h2><p>Магазини, заведения и здравни услуги.</p></div>';shell.append(head,specialGrid);specialistSection.remove();}
  }
}
function render(){
  const {path,query}=parseHash();let html='';
  if(path==='home') html=home(); else if(path==='obyavi') html=hub(query); else if(path==='uslugi') html=services(); else if(path==='service-group') html=serviceGroup(query); else if(path==='rabota') html=work(); else if(path==='imoti') html=properties(); else if(path==='stoki') html=goods(); else if(path==='avtomobili') html=auto(); else if(path==='zhivotni') html=animals(); else if(path==='magazini') html=shops(); else if(path==='zavedenia') html=restaurants(); else if(path==='zdrave') html=health(); else if(path==='firmi') html=firms(query); else if(path==='info') html=info(); else if(path==='aktualno') html=current(); else if(path==='statii') html=articles(); else if(path==='vaprosi') html=questions(); else if(path==='results') html=results(query); else if(path.startsWith('detail/')) html=detail(path.split('/')[1]); else if(path.startsWith('add/')) html=formPage(path.split('/')[1],query); else if(path==='about') html=staticPage('За сайта','Попитай.Лом е местен портал за намиране, публикуване и помощ от общността.'); else if(path==='rules') html=staticPage('Правила','Правилата на общността определят какво съдържание може да се публикува и как се преглежда.'); else if(path==='contacts') html=staticPage('Контакти','Свържи се с екипа на Попитай.Лом по въпроси за сайта или съдържанието.'); else if(path==='profile') html=staticPage('Профил','Тук се намират собственото съдържание, редакциите и статусите му.'); else html=staticPage('Страницата не е намерена','Този адрес не съществува.');
  main.innerHTML=html;if(path==='home') normalizeHomeComposition();main.focus({preventScroll:true});updateNav(path);window.scrollTo({top:0,behavior:'instant'});
}
function updateNav(path){
  const top=path.split('/')[0];
  document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('active',a.dataset.nav===top || (a.dataset.nav==='obyavi' && ['uslugi','service-group','rabota','imoti','stoki','avtomobili','zhivotni','magazini','zavedenia','zdrave'].includes(top))));
}
function openAdd(){addLayer.hidden=false;document.body.style.overflow='hidden';addLayer.querySelector('button')?.focus();}
function closeAdd(){addLayer.hidden=true;document.body.style.overflow='';}

document.addEventListener('click',e=>{
  if(e.target.closest('[data-open-add]')) openAdd();
  if(e.target.closest('[data-close-add]')) closeAdd();
  if(e.target===addLayer) closeAdd();
  const propertyTab=e.target.closest('[data-property-type]');
  if(propertyTab){
    propertyType=propertyTab.dataset.propertyType||propertyType;
    propertyTab.parentElement.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===propertyTab));
    document.querySelectorAll('[data-property-kind]').forEach(card=>{card.href=propertyResultsHref(card.dataset.propertyKind||'');});
    const add=document.querySelector('[data-property-add]');if(add) add.href=listingAddUrl('Имоти','',propertyType);
  }
  const contact=e.target.closest('[data-demo-contact]');
  if(contact){const msg=contact.parentElement.querySelector('.contact-demo-message');if(msg) msg.textContent='Прототипът не съдържа реален телефон или лични данни.';}
});
document.addEventListener('change',e=>{
  if(e.target.matches('[data-demo-upload]')){
    const max=Number(e.target.dataset.maxFiles||1);const selected=Math.min(e.target.files?.length||0,max);const section=e.target.closest('.upload-demo');const count=section?.querySelector('[data-upload-count]');if(count) count.textContent=`${selected} / ${max}`;
  }
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!addLayer.hidden)closeAdd();});
document.addEventListener('submit',e=>{
  if(e.target.matches('[data-global-search],[data-page-search]')){
    e.preventDefault();const q=new FormData(e.target).get('q')?.toString().toLocaleLowerCase('bg-BG').trim()||'';const serviceMatch=serviceSearchMatch(q);if(serviceMatch){location.hash=serviceResultsHref(serviceMatch);return;}
    const route=/работ|шофьор|продавач/.test(q)?'rabota':/апартамент|къща|имот|парцел|наем/.test(q)?'imoti':/кола|автомоб|част/.test(q)?'avtomobili':/кот|куче|живот/.test(q)?'zhivotni':'obyavi';location.hash=`#${route}`;return;
  }
  if(e.target.matches('[data-proto-form]')){
    e.preventDefault();const form=e.target;if(form.dataset.submitted==='true') return;
    const valid=window.validatePrototypeForm?window.validatePrototypeForm(form):form.checkValidity();if(!valid) return;
    form.dataset.submitted='true';form.dataset.dirty='false';
    const kind=form.dataset.formKind;const title=kind==='health'?'Изпратено за одобрение.':'Успешно изпратено за преглед.';
    form.innerHTML=`<div class="notice ok" tabindex="-1" data-success-card><strong>${title}</strong><p>Това е прототип и не е създаден реален запис.</p><a class="btn" href="#home">Към началото</a></div>`;
    form.querySelector('[data-success-card]')?.focus();
  }
});

function handleHashChange(){
  const nextHash=location.hash||'#home';
  if(window.confirmPrototypeNavigation&&!window.confirmPrototypeNavigation(nextHash,lastRenderedHash)){
    history.replaceState(null,'',lastRenderedHash);return;
  }
  closeAdd();render();lastRenderedHash=location.hash||'#home';
}
window.addEventListener('hashchange',handleHashChange);
if(!location.hash){location.hash='#home';}else{render();lastRenderedHash=location.hash;}
