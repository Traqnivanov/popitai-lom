'use strict';

const main = document.getElementById('app-main');
const addLayer = document.getElementById('add-layer');

function render(){
  const {path,query}=parseHash();
  let html='';
  if(path==='home') html=home();
  else if(path==='obyavi') html=hub(query);
  else if(path==='uslugi') html=services();
  else if(path==='service-group') html=serviceGroup(query);
  else if(path==='rabota') html=work();
  else if(path==='imoti') html=properties();
  else if(path==='stoki') html=goods();
  else if(path==='avtomobili') html=auto();
  else if(path==='zhivotni') html=animals();
  else if(path==='magazini') html=shops();
  else if(path==='zavedenia') html=restaurants();
  else if(path==='zdrave') html=health();
  else if(path==='firmi') html=firms(query);
  else if(path==='info') html=info();
  else if(path==='aktualno') html=current();
  else if(path==='statii') html=articles();
  else if(path==='vaprosi') html=questions();
  else if(path==='results') html=results(query);
  else if(path.startsWith('detail/')) html=detail(path.split('/')[1]);
  else if(path.startsWith('add/')) html=formPage(path.split('/')[1],query);
  else if(path==='about') html=staticPage('За сайта','Попитай.Лом е местен портал за намиране, публикуване и помощ от общността.');
  else if(path==='rules') html=staticPage('Правила','Прототипът показва правилната крайна страница, без да копира целия документ с действащите правила.');
  else if(path==='contacts') html=staticPage('Контакти','Контактният екран е отделен и не се смесва със системите за обяви и услуги.');
  else if(path==='profile') html=staticPage('Профил','Профилът е естественото място за собствено съдържание, редакции и статуси.');
  else html=staticPage('Страницата не е намерена','Този прототипен адрес не съществува.');
  main.innerHTML=html;
  main.focus({preventScroll:true});
  updateNav(path);
  window.scrollTo({top:0,behavior:'instant'});
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
    const add=document.querySelector('[data-property-add]');
    if(add) add.href=listingAddUrl('Имоти','',propertyType);
  }
  const contact=e.target.closest('[data-demo-contact]');
  if(contact){const msg=contact.parentElement.querySelector('.contact-demo-message');if(msg) msg.textContent='Прототипът не съдържа реален телефон или лични данни.';}
});
document.addEventListener('change',e=>{
  if(e.target.matches('[data-demo-upload]')){
    const max=Number(e.target.dataset.maxFiles||1);
    const selected=Math.min(e.target.files?.length||0,max);
    const section=e.target.closest('.upload-demo');
    const count=section?.querySelector('[data-upload-count]');
    if(count) count.textContent=`${selected} / ${max}`;
  }
  if(e.target.id==='listing-category'){
    const cat=e.target.value;
    const warn=document.getElementById('animal-warning');
    if(warn) warn.hidden=cat!=='Животни';
    const sub=document.getElementById('listing-subcategory');
    const type=document.getElementById('listing-type');
    if(sub){
      const vals=cat==='Услуги'?serviceFamilies.flatMap(x=>x.slice(1)):cat==='Работа'?workGroups:cat==='Имоти'?propertyKinds:cat==='Животни'?animalGroups:cat==='Автомобили и МПС'?autoListingGroups:['Друго'];
      sub.innerHTML=selectOptions(vals,'');
      sub.required=cat==='Услуги';
    }
    const title=e.target.closest('form')?.querySelector('input[type="text"]');
    if(title){
      const examples={'Животни':'Напр. Котка търси дом в Лом','Услуги':'Напр. Предлагам ВиК услуги в Лом','Работа':'Напр. Търсим шофьор за доставки','Имоти':'Напр. Продавам двустаен апартамент в Лом','Автомобили и МПС':'Напр. Продавам автомобил в Лом'};
      title.placeholder=examples[cat]||'Напр. Продавам запазен велосипед в Лом';
    }
    if(type){
      const vals=cat==='Работа'?['Предлага работа','Търси работа']:cat==='Имоти'?['Продава имот','Отдава под наем','Търси под наем','Търси за купуване']:cat==='Животни'?['Осиновяване','Изгубено','Намерено','Стоки за животни']:['Продава','Купува','Търси','Дава'];
      type.innerHTML=selectOptions(vals,'');
    }
  }
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!addLayer.hidden)closeAdd();});
document.addEventListener('submit',e=>{
  if(e.target.matches('[data-global-search],[data-page-search]')){
    e.preventDefault();
    const q=new FormData(e.target).get('q')?.toString().toLocaleLowerCase('bg-BG').trim()||'';
    const serviceMatch=serviceSearchMatch(q);
    if(serviceMatch){location.hash=serviceResultsHref(serviceMatch);return;}
    const route=/работ|шофьор|продавач/.test(q)?'rabota':/апартамент|къща|имот|парцел|наем/.test(q)?'imoti':/кола|автомоб|част/.test(q)?'avtomobili':/кот|куче|живот/.test(q)?'zhivotni':q?'obyavi':'obyavi';
    location.hash=`#${route}`;
    return;
  }
  if(e.target.matches('[data-proto-form]')){
    e.preventDefault();
    const form=e.target;
    const msg=form.querySelector('.form-message');
    if(form.dataset.submitted==='true') return;
    if(!form.checkValidity()){
      msg.innerHTML='<div class="notice danger"><strong>Провери задължителните полета.</strong> Въведеното остава във формата.</div>';
      form.reportValidity();
      return;
    }
    form.dataset.submitted='true';
    const submit=form.querySelector('button[type="submit"]');
    if(submit){submit.disabled=true;submit.textContent='Изпратено';}
    msg.innerHTML='<div class="notice ok"><strong>Успешно прототипно изпращане:</strong> няма реален запис в системата. Формата демонстрира успешно състояние.</div>';
  }
});
window.addEventListener('hashchange',()=>{closeAdd();render();});
if(!location.hash) location.hash='#home'; else render();
