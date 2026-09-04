'use strict';

const main = document.getElementById('app-main');
const addLayer = document.getElementById('add-layer');

function normalizeHomeComposition(){
  const sections=Array.from(main.children).filter(el=>el.matches?.('section.section'));
  const marketSection=sections.find(section=>section.querySelector('.section-head h2')?.textContent.trim()==='Обяви и услуги');
  const specialistSection=sections.find(section=>section.querySelector('.section-head h2')?.textContent.trim()==='Местни специализирани раздели');
  if(!marketSection||!specialistSection) return;
  const shell=marketSection.querySelector('.shell');
  const specialGrid=specialistSection.querySelector('.special-grid');
  if(!shell||!specialGrid) return;
  const head=document.createElement('div');
  head.className='section-head compact-head';
  head.innerHTML='<div><h2>Местни специализирани раздели</h2><p>Магазини, заведения и здравни услуги.</p></div>';
  shell.append(head,specialGrid);
  specialistSection.remove();
}
function render(){
  const {path,query}=parseHash();
  let html='';
  if(path==='home') html=home(); else if(path==='obyavi') html=hub(query); else if(path==='uslugi') html=services(); else if(path==='service-group') html=serviceGroup(query); else if(path==='rabota') html=work(); else if(path==='imoti') html=properties(); else if(path==='stoki') html=goods(); else if(path==='avtomobili') html=auto(); else if(path==='zhivotni') html=animals(); else if(path==='magazini') html=shops(); else if(path==='zavedenia') html=restaurants(); else if(path==='zdrave') html=health(); else if(path==='firmi') html=firms(query); else if(path==='info') html=info(); else if(path==='aktualno') html=current(); else if(path==='statii') html=articles(); else if(path==='vaprosi') html=questions(); else if(path==='results') html=results(query); else if(path.startsWith('detail/')) html=detail(path.split('/')[1]); else if(path.startsWith('add/')) html=formPage(path.split('/')[1],query); else if(path==='about') html=staticPage('За сайта','Попитай.Лом е местен портал за намиране, публикуване и помощ от общността.'); else if(path==='rules') html=staticPage('Правила','Правилата на общността определят какво съдържание може да се публикува и как се преглежда.'); else if(path==='contacts') html=staticPage('Контакти','Свържи се с екипа на Попитай.Лом по въпроси за сайта или съдържанието.'); else if(path==='profile') html=staticPage('Профил','Тук се намират собственото съдържание, редакциите и статусите му.'); else html=staticPage('Страницата не е намерена','Този адрес не съществува.');
  main.innerHTML=html;
  if(path==='home') normalizeHomeComposition();
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
function shopPhoneValidationMessage(value){
  const normalized=String(value||'').trim();
  if(!normalized) return '';
  if(/\p{L}/u.test(normalized)) return 'Телефонът не може да съдържа букви.';
  if(!/^[+\d\s().-]+$/.test(normalized)) return 'Използвай само цифри, интервали, +, тирета или скоби.';
  if((normalized.match(/\+/g)||[]).length>1 || (normalized.includes('+')&&!normalized.startsWith('+'))) return 'Знакът + може да бъде само веднъж и в началото.';
  const digits=normalized.replace(/\D/g,'');
  if(/^(\d)\1+$/.test(digits)) return 'Въведи реален телефонен номер.';
  if(normalized.startsWith('+')){
    if(!normalized.startsWith('+359')) return 'Международният български номер трябва да започва с +359.';
    if(![11,12].includes(digits.length)) return 'След +359 трябва да има 8 или 9 цифри.';
    if(digits.charAt(3)==='0') return 'След +359 не се изписва началната нула.';
    return '';
  }
  if(!digits.startsWith('0')) return 'Българският номер трябва да започва с 0 или +359.';
  if(![9,10].includes(digits.length)) return 'Телефонът трябва да съдържа общо 9 или 10 цифри.';
  return '';
}
function validateShopPhone(input=document.querySelector('[data-shop-phone]')){
  if(!input) return true;
  const message=shopPhoneValidationMessage(input.value);
  input.setCustomValidity(message);
  input.setAttribute('aria-invalid',String(Boolean(message)));
  const error=document.getElementById('shop-phone-error');
  if(error){error.textContent=message;error.style.color=message?'#b42318':'';error.style.fontWeight=message?'800':'';}
  return !message;
}

document.addEventListener('click',e=>{
  if(e.target.closest('[data-open-add]')) openAdd();
  if(e.target.closest('[data-close-add]')) closeAdd();
  if(e.target===addLayer) closeAdd();
  const propertyTab=e.target.closest('[data-property-type]');
  if(propertyTab){propertyType=propertyTab.dataset.propertyType||propertyType;propertyTab.parentElement.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===propertyTab));document.querySelectorAll('[data-property-kind]').forEach(card=>{card.href=propertyResultsHref(card.dataset.propertyKind||'');});const add=document.querySelector('[data-property-add]');if(add) add.href=listingAddUrl('Имоти','',propertyType);}
  const contact=e.target.closest('[data-demo-contact]');
  if(contact){const msg=contact.parentElement.querySelector('.contact-demo-message');if(msg) msg.textContent='Прототипът не съдържа реален телефон или лични данни.';}
});
document.addEventListener('input',e=>{if(e.target.matches('[data-shop-phone]')) validateShopPhone(e.target);});
document.addEventListener('blur',e=>{if(e.target.matches('[data-shop-phone]')) validateShopPhone(e.target);},true);
document.addEventListener('change',e=>{
  if(e.target.matches('[data-demo-upload]')){const max=Number(e.target.dataset.maxFiles||1);const selected=Math.min(e.target.files?.length||0,max);const section=e.target.closest('.upload-demo');const count=section?.querySelector('[data-upload-count]');if(count) count.textContent=`${selected} / ${max}`;}
  if(e.target.id==='listing-category'){
    const cat=e.target.value;const warn=document.getElementById('animal-warning');if(warn) warn.hidden=cat!=='Животни';const sub=document.getElementById('listing-subcategory');const subField=document.getElementById('listing-subcategory-field');const type=document.getElementById('listing-type');
    if(sub){const isServices=cat==='Услуги';const vals=isServices?serviceFamilies.flatMap(x=>x.slice(1)):[];sub.innerHTML=selectOptions(vals,'');sub.required=isServices;sub.disabled=!isServices;if(subField) subField.hidden=!isServices;}
    const title=e.target.closest('form')?.querySelector('input[type="text"]');if(title){const examples={'Животни':'Напр. Котка търси дом в Лом','Услуги':'Напр. Предлагам ВиК услуги в Лом','Работа':'Напр. Търсим шофьор за доставки','Имоти':'Напр. Продавам двустаен апартамент в Лом','Автомобили и МПС':'Напр. Продавам автомобил в Лом'};title.placeholder=examples[cat]||'Напр. Продавам запазен велосипед в Лом';}
    if(type){const vals=cat==='Работа'?['Предлага работа','Търси работа']:cat==='Имоти'?['Продава имот','Отдава под наем','Търси под наем','Търси за купуване']:['Продава','Купува','Търси','Дава'];type.innerHTML=selectOptions(vals,'');}
  }
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!addLayer.hidden)closeAdd();});
document.addEventListener('submit',e=>{
  if(e.target.matches('[data-global-search],[data-page-search]')){e.preventDefault();const q=new FormData(e.target).get('q')?.toString().toLocaleLowerCase('bg-BG').trim()||'';const serviceMatch=serviceSearchMatch(q);if(serviceMatch){location.hash=serviceResultsHref(serviceMatch);return;}const route=/работ|шофьор|продавач/.test(q)?'rabota':/апартамент|къща|имот|парцел|наем/.test(q)?'imoti':/кола|автомоб|част/.test(q)?'avtomobili':/кот|куче|живот/.test(q)?'zhivotni':q?'obyavi':'obyavi';location.hash=`#${route}`;return;}
  if(e.target.matches('[data-proto-form]')){
    e.preventDefault();const form=e.target;const msg=form.querySelector('.form-message');if(form.dataset.submitted==='true') return;
    if(form.dataset.formKind==='shop'&&!validateShopPhone(form.querySelector('[data-shop-phone]'))){msg.innerHTML='<div class="notice danger"><strong>Провери телефона.</strong> Въведеното остава във формата.</div>';form.querySelector('[data-shop-phone]')?.reportValidity();return;}
    if(!form.checkValidity()){msg.innerHTML='<div class="notice danger"><strong>Провери задължителните полета.</strong> Въведеното остава във формата.</div>';form.reportValidity();return;}
    form.dataset.submitted='true';const submit=form.querySelector('button[type="submit"]');if(submit){submit.disabled=true;submit.textContent='Изпратено';}msg.innerHTML='<div class="notice ok"><strong>Успешно прототипно изпращане:</strong> няма реален запис в системата. Формата демонстрира успешно състояние.</div>';
  }
});
window.addEventListener('hashchange',()=>{closeAdd();render();});
if(!location.hash) location.hash='#home'; else render();
