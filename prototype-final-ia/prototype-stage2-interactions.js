'use strict';

(() => {
  const contract=window.PopitaiStage2Contracts;
  if(!contract) return;

  function escapeOption(value=''){
    return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
  }
  function optionHtml(values,current=''){
    return '<option value="">Избери</option>'+values.map(value=>`<option value="${escapeOption(value)}" ${value===current?'selected':''}>${escapeOption(value)}</option>`).join('');
  }
  function activeDirtyForm(){return document.querySelector('[data-proto-form][data-dirty="true"]:not([data-submitted="true"])');}
  function clearDirty(form=activeDirtyForm()){if(form) form.dataset.dirty='false';}
  function confirmLeave(){
    const form=activeDirtyForm();
    if(!form) return true;
    const ok=window.confirm('Има непубликувани промени. Ако напуснеш, въведеното ще се загуби. Да продължа ли?');
    if(ok) clearDirty(form);
    return ok;
  }
  window.confirmPrototypeNavigation=()=>confirmLeave();

  function setFieldError(control,message=''){
    if(!control) return;
    control.setCustomValidity(message);
    control.setAttribute('aria-invalid',message?'true':'false');
    const ids=(control.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean);
    const error=ids.map(id=>document.getElementById(id)).find(el=>el?.classList.contains('field-error'));
    if(error) error.textContent=message;
  }
  function labelText(control){
    const id=control.id;const label=id?document.querySelector(`label[for="${CSS.escape(id)}"]`):null;
    return label?.textContent?.trim()||control.name||'полето';
  }
  function phoneMessage(value){
    const normalized=String(value||'').trim();
    if(!normalized) return '';
    if(/\p{L}/u.test(normalized)) return 'Телефонът не може да съдържа букви.';
    if(!/^[+\d\s().-]+$/.test(normalized)) return 'Използвай само цифри, интервали, +, тирета или скоби.';
    if((normalized.match(/\+/g)||[]).length>1||(normalized.includes('+')&&!normalized.startsWith('+'))) return 'Знакът + може да бъде само веднъж и в началото.';
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

  function validateControl(control){
    if(control.disabled||control.type==='file') return '';
    const value=control.type==='checkbox'?(control.checked?'1':''):String(control.value||'').trim();
    if(control.required&&!value) return control.type==='checkbox'?'Потвърди, че приемаш правилата.':`Попълни „${labelText(control)}“.`;
    if(value&&control.minLength>0&&value.length<control.minLength) return `„${labelText(control)}“ трябва да е поне ${control.minLength} знака.`;
    if(value&&control.type==='number'&&Number(value)<0) return 'Стойността не може да е отрицателна.';
    if(value&&control.type==='tel') return phoneMessage(value);
    return '';
  }

  function validatePrototypeForm(form){
    let firstInvalid=null;
    form.querySelectorAll('input,select,textarea').forEach(control=>{
      const message=validateControl(control);setFieldError(control,message);if(message&&!firstInvalid) firstInvalid=control;
    });
    if(form.dataset.formKind==='health'){
      const phone=form.querySelector('[name="Телефон"]');const address=form.querySelector('[name="Адрес в Лом"]');
      if(phone&&address&&!phone.value.trim()&&!address.value.trim()){
        const message='Въведи поне телефон или адрес.';setFieldError(phone,message);setFieldError(address,message);firstInvalid=firstInvalid||phone;
      }
    }
    const msg=form.querySelector('.form-message');
    if(firstInvalid){
      if(msg) msg.innerHTML='<div class="notice danger"><strong>Провери отбелязаните полета.</strong> Въведеното остава във формата.</div>';
      firstInvalid.focus({preventScroll:false});firstInvalid.scrollIntoView({block:'center',behavior:'smooth'});return false;
    }
    if(msg) msg.textContent='';
    return true;
  }
  window.validatePrototypeForm=validatePrototypeForm;

  function clearDiscoveryContext(form){
    if(!form) return;
    form.dataset.discoveryContext='';
    const visible=form.closest('.form-wrap')?.querySelector('.discovery-context');
    if(visible) visible.hidden=true;
  }
  function syncAdapter(form){
    if(!form) return;
    const wrap=form.closest('.form-wrap');const adapter=wrap?.querySelector('.qa-adapter');
    if(!adapter) return;
    const category=form.querySelector('#listing-category')?.value||'';
    const subcategory=category==='Услуги'?(form.querySelector('#listing-subcategory')?.value||''):'';
    const type=form.querySelector('#listing-type')?.value||'';
    const discovery=form.dataset.discoveryContext||'';
    const payload=contract.compatibilityAdapter({category,subcategory,type,discovery});
    const code=adapter.querySelector('code');
    if(code) code.textContent=`category=${payload.category||'—'} · subcategory=${payload.subcategory||'—'} · listing_type=${payload.listing_type||'—'}`;
    const paragraphs=[...adapter.querySelectorAll('p')];paragraphs.slice(1).forEach(p=>p.remove());
    if(category==='Услуги'&&discovery&&payload.subcategory&&discovery!==payload.subcategory){
      const note=document.createElement('p');note.dataset.adapterLiveNote='true';note.textContent=`Нерешена LOCKED граница: точният discovery избор „${discovery}“ не се persist-ва отделно. Текущият договор записва canonical subcategory „${payload.subcategory}“, затова след submit точният leaf не може надеждно да бъде възстановен само от записа.`;adapter.append(note);
    }else if(category!=='Услуги'&&discovery){
      const note=document.createElement('p');note.dataset.adapterLiveNote='true';note.textContent=`„${discovery}“ остава discovery контекст и не се представя като записана подкатегория.`;adapter.append(note);
    }
  }
  function listingHints(category,type,discovery,canonical){return listingTextHints(category,type,discovery,canonical);}
  function syncListingForm({preserve=true,resetDiscovery=false}={}){
    const category=document.getElementById('listing-category');const subcategory=document.getElementById('listing-subcategory');const subcategoryField=document.getElementById('listing-subcategory-field');const type=document.getElementById('listing-type');
    if(!category||!subcategory||!subcategoryField||!type) return;
    const form=category.closest('form');
    if(resetDiscovery) clearDiscoveryContext(form);
    const discovery=form?.dataset.discoveryContext||'';const categoryValue=category.value;
    const previousSubcategory=preserve?subcategory.value:'';const subcategories=contract.listingSubcategories(categoryValue);const nextSubcategory=subcategories.includes(previousSubcategory)?previousSubcategory:'';
    subcategory.innerHTML=optionHtml(subcategories,nextSubcategory);subcategory.value=nextSubcategory;subcategoryField.hidden=categoryValue!=='Услуги';subcategory.disabled=categoryValue!=='Услуги';subcategory.required=categoryValue==='Услуги';
    const previousType=preserve?type.value:'';const allowedTypes=contract.listingTypes(categoryValue);const nextType=allowedTypes.includes(previousType)?previousType:'';
    type.innerHTML=optionHtml(allowedTypes,nextType);type.value=nextType;
    const animalWarning=document.getElementById('animal-warning');if(animalWarning) animalWarning.hidden=categoryValue!=='Животни';
    const title=form?.querySelector('[name="Заглавие"]');const description=form?.querySelector('[name="Описание"]');const hints=listingHints(categoryValue,type.value,discovery,nextSubcategory);
    if(title&&!title.value) title.placeholder=hints[0];if(description&&!description.value) description.placeholder=hints[1];
    syncAdapter(form);
  }
  window.syncPrototypeListingForm=syncListingForm;

  function syncShopTags(){
    const category=document.getElementById('shop-category');const slot=document.getElementById('shop-classification-slot');if(!category||!slot) return;
    const selected=[...slot.querySelectorAll('input[name="shop_tags"]:checked')].map(x=>x.value);const custom=slot.querySelector('#shop-custom-tag')?.value||'';
    slot.innerHTML=shopClassification(category.value,selected);
    const nextCustom=slot.querySelector('#shop-custom-tag');if(nextCustom) nextCustom.value=custom;
  }

  function syncQuestionHints(){
    const form=document.querySelector('[data-proto-form][data-form-kind="question"]');if(!form) return;
    const category=form.querySelector('select');const title=form.querySelector('input[type="text"]');const description=form.querySelector('textarea');if(!category||!title||!description) return;
    const pair=questionExamples[category.value]||['Напр. Кой може да помогне с това в Лом?','Опиши ясно какво търсиш и какъв отговор би ти бил полезен.'];if(!title.value) title.placeholder=pair[0];if(!description.value) description.placeholder=pair[1];
  }

  document.addEventListener('click',event=>{
    const link=event.target.closest?.('a[href^="#"]');
    if(link&&activeDirtyForm()){
      if(!confirmLeave()){event.preventDefault();event.stopImmediatePropagation();return;}
    }
    const share=event.target.closest?.('[data-demo-share]');
    if(share){const message=share.closest('.share-menu')?.querySelector('.share-demo-message');const messages={native:'На телефон ще се отвори системното меню за споделяне.',facebook:'Facebook ще използва постоянния адрес и неговата social карта.',copy:'Постоянният линк е копиран. (Прототип — няма реално копиране.)'};if(message) message.textContent=messages[share.dataset.demoShare]||'Готово за споделяне.';}
    const action=event.target.closest?.('[data-demo-report],[data-demo-correction],[data-demo-inquiry],[data-demo-site],[data-demo-answer],[data-demo-official]');
    if(action){const message=action.closest('.detail-action')?.querySelector('.action-demo-message');let text='';if(action.matches('[data-demo-report]')) text='Сигналът се изпраща за преглед според правилата за този тип съдържание.';if(action.matches('[data-demo-correction]')) text='Корекцията е за фактическа грешка и се изпраща за проверка.';if(action.matches('[data-demo-inquiry]')) text='Запитването е налично, защото този примерен профил има такъв канал.';if(action.matches('[data-demo-site]')) text='Сайтът се показва само когато записът има публичен уеб адрес.';if(action.matches('[data-demo-answer]')) text='Формата за отговор е водещото действие при въпрос.';if(action.matches('[data-demo-official]')) text='Отваря се официалният публичен източник на конкретния запис.';if(message) message.textContent=text;}
  },true);

  document.addEventListener('change',event=>{
    if(event.target.id==='listing-category') syncListingForm({preserve:false,resetDiscovery:true});
    if(event.target.id==='listing-subcategory'||event.target.id==='listing-type') syncListingForm({preserve:true});
    if(event.target.id==='shop-category') syncShopTags();
    if(event.target.closest?.('[data-proto-form][data-form-kind="question"]')) syncQuestionHints();
    const form=event.target.closest?.('[data-proto-form]');if(form) form.dataset.dirty='true';
  });
  document.addEventListener('input',event=>{
    const form=event.target.closest?.('[data-proto-form]');if(form) form.dataset.dirty='true';
    if(event.target.matches('input,textarea,select')) setFieldError(event.target,'');
  });
  document.addEventListener('blur',event=>{
    const control=event.target.closest?.('[data-proto-form] input,[data-proto-form] textarea,[data-proto-form] select');if(control) setFieldError(control,validateControl(control));
  },true);
  window.addEventListener('beforeunload',event=>{if(activeDirtyForm()){event.preventDefault();event.returnValue='';}});

  const initialListingForm=document.querySelector('[data-proto-form][data-form-kind="listing"]');
  if(initialListingForm) syncAdapter(initialListingForm);
})();
