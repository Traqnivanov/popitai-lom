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
  syncRenderedListingForm({preserve:true});
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
function syncRenderedListingForm({categoryChanged=false,preserve=false}={}){
  const category=document.getElementById('listing-category');
  const sub=document.getElementById('listing-subcategory');
  const subField=document.getElementById('listing-subcategory-field');
  const type=document.getElementById('listing-type');
  if(!category||!sub||!subField||!type) return;
  const cat=category.value;
  const subValues=listingSubcategories(cat);
  const previousSub=preserve?sub.value:'';
  sub.innerHTML=selectOptions(subValues,subValues.includes(previousSub)?previousSub:'');
  const hasSubs=subValues.length>0;
  subField.hidden=!hasSubs;
  sub.disabled=!hasSubs;
  sub.required=hasSubs;
  const activeSub=hasSubs?sub.value:'';
  const typeValues=listingTypes(cat,activeSub);
  const previousType=preserve?type.value:'';
  type.innerHTML=selectOptions(typeValues,typeValues.includes(previousType)?previousType:'');
  type.disabled=cat==='Животни'&&hasSubs&&!activeSub;
  const warning=document.getElementById('animal-warning');
  if(warning) warning.hidden=cat!=='Животни';
  const form=category.closest('form');
  const title=form?.querySelector('.field input[type="text"]');
  const description=form?.querySelector('textarea');
  if(title) title.placeholder=listingTitlePlaceholder(cat,activeSub,type.value);
  if(description) description.placeholder=window.PopitaiPrototypeStage2?.listingDescriptionHint?.(cat,activeSub,type.value)||'Опиши най-важното ясно и конкретно.';
  if(categoryChanged){sub.dataset.userTouched='false';type.dataset.userTouched='false';}
}
function invalidFieldMessage(field,formKind){
  const label=field.closest('.field')?.querySelector('label')?.textContent?.trim()||'полето';
  if(field.validity?.valueMissing) return `Попълни „${label}“.`;
  if(field.validity?.tooShort) return `„${label}“ е твърде кратко.`;
  if(field.validity?.tooLong) return `„${label}“ е твърде дълго.`;
  if(field.validity?.rangeUnderflow) return `Провери стойността в „${label}“.`;
  if(field.validity?.patternMismatch) return formKind==='shop'&&field.matches('[data-shop-phone]')?'Провери телефона.':`Провери формата на „${label}“.`;
  return `Провери „${label}“.`;
}
function markFormDirty(target){
  const form=target.closest?.('[data-proto-form]');
  if(form&&form.dataset.submitted!=='true') form.dataset.dirty='true';
}
function currentDirtyForm(){return document.querySelector('[data-proto-form][data-dirty="true"]');}
function allowDirtyNavigation(){
  const form=currentDirtyForm();
  if(!form) return true;
  return window.confirm('Има неизпратени данни. Ако напуснеш страницата, въведеното ще се загуби.');
}
function actionMessage(button,text){
  const root=button.closest('.detail-action,.result-row,.content-actions')||button.parentElement;
  const message=root?.querySelector('.action-demo-message,.contact-demo-message');
  if(message) message.textContent=text;
}
function toggleShareOptions(button){
  const root=button.closest('.detail-action,.content-actions')||button.parentElement;
  const options=root?.querySelector('.share-demo-options');
  if(options){options.hidden=!options.hidden;if(!options.hidden) options.querySelector('button')?.focus();}
}
async function copyPrototypeLink(button){
  try{
    await navigator.clipboard.writeText(location.href);
    actionMessage(button,'Линкът към този прототипен екран е копиран.');
  }catch(_){
    actionMessage(button,'Копирай адреса от адресната лента.');
  }
}

document.addEventListener('click',e=>{
  const navLink=e.target.closest('a[href^="#"]');
  if(navLink&&currentDirtyForm()&&!navLink.closest('.share-demo-options')){
    if(!allowDirtyNavigation()){e.preventDefault();return;}
    const dirty=currentDirtyForm();if(dirty) dirty.dataset.dirty='false';
  }
  if(e.target.closest('[data-open-add]')) openAdd();
  if(e.target.closest('[data-close-add]')) closeAdd();
  if(e.target===addLayer) closeAdd();
  const propertyTab=e.target.closest('[data-property-type]');
  if(propertyTab){propertyType=propertyTab.dataset.propertyType||propertyType;propertyTab.parentElement.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===propertyTab));document.querySelectorAll('[data-property-kind]').forEach(card=>{card.href=propertyResultsHref(card.dataset.propertyKind||'');});const add=document.querySelector('[data-property-add]');if(add) add.href=listingAddUrl('Имоти','',propertyType);}
  const contact=e.target.closest('[data-demo-contact]');
  if(contact){actionMessage(contact,'При реален запис се показват само наличните публични канали за контакт.');}
  const share=e.target.closest('[data-demo-share]');
  if(share){toggleShareOptions(share);}
  const copy=e.target.closest('[data-demo-copy]');
  if(copy){copyPrototypeLink(copy);}
  const facebook=e.target.closest('[data-demo-facebook]');
  if(facebook){actionMessage(facebook,'Facebook ще получи постоянния публичен URL и неговия одобрен social preview. Прототипът не публикува реално.');}
  const report=e.target.closest('[data-demo-report]');
  if(report){actionMessage(report,'Сигналът е вторично действие и в реалния сайт използва съответния доказан moderation owner.');}
  const correction=e.target.closest('[data-demo-correction]');
  if(correction){actionMessage(correction,'Корекцията е за фактическа грешка и използва специализирания Health/Info correction flow.');}
  const answer=e.target.closest('[data-demo-answer]');
  if(answer){actionMessage(answer,'При реален въпрос тук се отваря съществуващият поток за отговор.');}
});
document.addEventListener('input',e=>{markFormDirty(e.target);if(e.target.matches('[data-shop-phone]')) validateShopPhone(e.target);});
document.addEventListener('blur',e=>{if(e.target.matches('[data-shop-phone]')) validateShopPhone(e.target);},true);
document.addEventListener('change',e=>{
  markFormDirty(e.target);
  if(e.target.matches('[data-demo-upload]')){const max=Number(e.target.dataset.maxFiles||1);const selected=Math.min(e.target.files?.length||0,max);const section=e.target.closest('.upload-demo');const count=section?.querySelector('[data-upload-count]');if(count) count.textContent=`${selected} / ${max}`;}
  if(e.target.id==='listing-category') syncRenderedListingForm({categoryChanged:true});
  if(e.target.id==='listing-subcategory'){
    const type=document.getElementById('listing-type');
    if(type) type.value='';
    syncRenderedListingForm({preserve:true});
  }
  if(e.target.id==='listing-type'){
    const category=document.getElementById('listing-category');
    const sub=document.getElementById('listing-subcategory');
    const form=e.target.closest('form');
    const title=form?.querySelector('.field input[type="text"]');
    const description=form?.querySelector('textarea');
    if(title) title.placeholder=listingTitlePlaceholder(category?.value||'',sub?.value||'',e.target.value);
    if(description) description.placeholder=window.PopitaiPrototypeStage2?.listingDescriptionHint?.(category?.value||'',sub?.value||'',e.target.value)||description.placeholder;
  }
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!addLayer.hidden)closeAdd();});
document.addEventListener('submit',e=>{
  if(e.target.matches('[data-global-search],[data-page-search]')){e.preventDefault();const q=new FormData(e.target).get('q')?.toString().toLocaleLowerCase('bg-BG').trim()||'';const serviceMatch=serviceSearchMatch(q);if(serviceMatch){location.hash=serviceResultsHref(serviceMatch);return;}const route=/работ|шофьор|продавач/.test(q)?'rabota':/апартамент|къща|имот|парцел|наем/.test(q)?'imoti':/кола|автомоб|част/.test(q)?'avtomobili':/кот|куче|живот/.test(q)?'zhivotni':q?'obyavi':'obyavi';location.hash=`#${route}`;return;}
  if(e.target.matches('[data-proto-form]')){
    e.preventDefault();const form=e.target;const msg=form.querySelector('.form-message');if(form.dataset.submitted==='true') return;
    if(form.dataset.formKind==='shop'&&!validateShopPhone(form.querySelector('[data-shop-phone]'))){msg.innerHTML='<div class="notice danger"><strong>Провери телефона.</strong> Въведеното остава във формата.</div>';form.querySelector('[data-shop-phone]')?.reportValidity();return;}
    if(!form.checkValidity()){
      const invalid=form.querySelector(':invalid');
      const detail=invalid?invalidFieldMessage(invalid,form.dataset.formKind):'Провери задължителните полета.';
      msg.innerHTML=`<div class="notice danger"><strong>${detail}</strong> Въведеното остава във формата.</div>`;
      invalid?.focus();invalid?.reportValidity();return;
    }
    form.dataset.submitted='true';form.dataset.dirty='false';
    const submit=form.querySelector('button[type="submit"]');if(submit){submit.disabled=true;submit.textContent='Изпращане…';}
    const kind=form.dataset.formKind||'listing';
    location.hash=`#add/${kind}?state=pending`;
  }
});
window.addEventListener('beforeunload',e=>{if(currentDirtyForm()){e.preventDefault();e.returnValue='';}});
window.addEventListener('hashchange',()=>{closeAdd();render();});
if(!location.hash) location.hash='#home'; else render();