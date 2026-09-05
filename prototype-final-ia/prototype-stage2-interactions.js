'use strict';

(() => {
  const contracts=window.PopitaiStage2Contracts;
  if(!contracts) return;

  const uploadState=new WeakMap();

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
  window.confirmPrototypeNavigation=confirmLeave;

  function errorElement(control){
    const ids=(control?.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean);
    return ids.map(id=>document.getElementById(id)).find(el=>el?.classList.contains('field-error'))||null;
  }
  function setFieldError(control,message=''){
    if(!control) return;
    if(typeof control.setCustomValidity==='function') control.setCustomValidity(message);
    if(message) control.setAttribute('aria-invalid','true');
    else control.removeAttribute('aria-invalid');
    const error=errorElement(control);
    if(error) error.textContent=message;
  }
  function labelText(control){
    const id=control?.id;
    const label=id?document.querySelector(`label[for="${CSS.escape(id)}"]`):null;
    return label?.textContent?.trim()||control?.name||'полето';
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

  function numberStepInvalid(control,value){
    if(!value) return false;
    const n=Number(value);
    if(!Number.isFinite(n)) return true;
    const min=control.min!==''?Number(control.min):0;
    const step=control.step&&control.step!=='any'?Number(control.step):0;
    if(!step||!Number.isFinite(step)) return false;
    const ratio=(n-min)/step;
    return Math.abs(ratio-Math.round(ratio))>1e-8;
  }

  function validateControl(control){
    if(!control||control.disabled||control.type==='file') return '';
    const raw=control.type==='checkbox'?(control.checked?'1':''):String(control.value||'');
    const value=raw.trim();
    if(control.required&&!value) return control.type==='checkbox'?'Потвърди, че приемаш правилата.':`Попълни „${labelText(control)}“.`;
    if(value&&control.minLength>0&&value.length<control.minLength) return `„${labelText(control)}“ трябва да е поне ${control.minLength} знака.`;
    if(value&&control.maxLength>0&&value.length>control.maxLength) return `„${labelText(control)}“ може да е най-много ${control.maxLength} знака.`;
    if(value&&control.type==='number'){
      const n=Number(value);
      if(!Number.isFinite(n)) return 'Въведи валидно число.';
      if(control.min!==''&&n<Number(control.min)) return `Стойността не може да е под ${control.min}.`;
      if(control.max!==''&&n>Number(control.max)) return `Стойността не може да е над ${control.max}.`;
      if(numberStepInvalid(control,value)) return `Използвай стъпка ${control.step}.`;
    }
    if(value&&control.type==='tel') return phoneMessage(value);
    return '';
  }

  function validateHealthPair(form,force=false){
    if(form?.dataset.formKind!=='health') return null;
    const phone=form.querySelector('#health-phone');
    const address=form.querySelector('#health-address');
    if(!phone||!address) return null;
    const missing=!phone.value.trim()&&!address.value.trim();
    if(missing&&force){
      const message='Въведи поне телефон или адрес.';
      setFieldError(phone,message);
      setFieldError(address,message);
      return phone;
    }
    if(!missing){
      if(errorElement(phone)?.textContent==='Въведи поне телефон или адрес.') setFieldError(phone,'');
      if(errorElement(address)?.textContent==='Въведи поне телефон или адрес.') setFieldError(address,'');
    }
    return null;
  }

  function syncPriceState(form,eventTarget=null){
    if(form?.dataset.formKind!=='listing') return;
    const price=form.querySelector('#listing-price');
    const negotiable=form.querySelector('#price-negotiable');
    const free=form.querySelector('#price-free');
    if(!price||!negotiable||!free) return;

    if(eventTarget===free&&free.checked){
      negotiable.checked=false;
      price.value='';
      price.disabled=true;
      setFieldError(price,'');
    }else if(eventTarget===negotiable&&negotiable.checked){
      free.checked=false;
      price.disabled=false;
    }else if(eventTarget===price&&price.value.trim()){
      free.checked=false;
      price.disabled=false;
    }else if(!free.checked){
      price.disabled=false;
    }
    const stateError=document.getElementById('price-state-error');
    if(stateError) stateError.textContent='';
  }

  function validatePriceState(form){
    if(form?.dataset.formKind!=='listing') return null;
    const price=form.querySelector('#listing-price');
    const negotiable=form.querySelector('#price-negotiable');
    const free=form.querySelector('#price-free');
    const error=document.getElementById('price-state-error');
    let message='';
    if(free?.checked&&negotiable?.checked) message='„Подарява“ и „Договаряне“ не могат да са активни едновременно.';
    else if(free?.checked&&price?.value.trim()) message='При „Подарява“ цената трябва да е празна.';
    if(error) error.textContent=message;
    if(message){
      free?.setAttribute('aria-invalid','true');
      negotiable?.setAttribute('aria-invalid','true');
      return free||negotiable;
    }
    free?.removeAttribute('aria-invalid');
    negotiable?.removeAttribute('aria-invalid');
    return null;
  }

  function uploadConfig(input){
    return {
      maxFiles:Number(input.dataset.maxFiles||1),
      maxBytes:Number(input.dataset.maxBytes||10485760),
      allowed:new Set((input.dataset.allowedMime||'').split(',').filter(Boolean))
    };
  }
  function validateFiles(input,files){
    const cfg=uploadConfig(input);
    if(files.length>cfg.maxFiles) return `Можеш да избереш най-много ${cfg.maxFiles} ${cfg.maxFiles===1?'файл':'файла'}.`;
    for(const file of files){
      if(!file||file.size===0) return `Файлът „${file?.name||'без име'}“ е празен или невалиден.`;
      if(file.size>cfg.maxBytes) return `Файлът „${file.name}“ е над 10 MB.`;
      if(!cfg.allowed.has(file.type)) return `Файлът „${file.name}“ не е JPG, PNG или WebP.`;
    }
    return '';
  }
  function renderUpload(input){
    const section=input.closest('[data-upload-section]');
    const state=uploadState.get(input)||{files:[],error:''};
    const count=section?.querySelector('[data-upload-count]');
    const max=Number(input.dataset.maxFiles||1);
    if(count) count.textContent=`${state.files.length} / ${max}`;
    const error=section?.querySelector('[data-upload-error]');
    if(error) error.textContent=state.error||'';
    if(state.error) section?.setAttribute('aria-invalid','true'); else section?.removeAttribute('aria-invalid');
    const selected=section?.querySelector('[data-upload-selected]');
    if(selected){
      selected.innerHTML=state.files.map((file,index)=>`<div class="upload-file-chip"><span>${escapeOption(file.name)} · ${Math.max(1,Math.round(file.size/1024))} KB</span><button type="button" class="btn soft" data-remove-upload="${index}">Премахни</button></div>`).join('');
    }
  }
  function acceptUploadSelection(input){
    const files=[...(input.files||[])];
    const error=validateFiles(input,files);
    if(error){
      uploadState.set(input,{files:[],error});
      input.value='';
    }else{
      uploadState.set(input,{files:[...files],error:''});
    }
    renderUpload(input);
    return !error;
  }
  function validateUploads(form){
    let first=null;
    form.querySelectorAll('[data-demo-upload]').forEach(input=>{
      const state=uploadState.get(input)||{files:[],error:''};
      const error=state.error||validateFiles(input,state.files);
      if(error){
        uploadState.set(input,{...state,error});
        renderUpload(input);
        if(!first) first=input.closest('[data-upload-section]');
      }
    });
    return first;
  }

  function validatePrototypeForm(form){
    let firstInvalid=null;
    form.querySelectorAll('input,select,textarea').forEach(control=>{
      const message=validateControl(control);
      setFieldError(control,message);
      if(message&&!firstInvalid) firstInvalid=control;
    });
    firstInvalid=firstInvalid||validateHealthPair(form,true);
    firstInvalid=firstInvalid||validatePriceState(form);
    firstInvalid=firstInvalid||validateUploads(form);

    const msg=form.querySelector('.form-message');
    if(firstInvalid){
      if(msg) msg.innerHTML='<div class="notice danger"><strong>Провери отбелязаните полета.</strong> Въведеното остава във формата.</div>';
      firstInvalid.focus({preventScroll:false});
      firstInvalid.scrollIntoView({block:'center',behavior:'smooth'});
      return false;
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
    const adapter=form.closest('.form-wrap')?.querySelector('.qa-adapter');
    if(!adapter) return;
    const category=form.querySelector('#listing-category')?.value||'';
    const subcategory=category==='Услуги'?(form.querySelector('#listing-subcategory')?.value||''):'';
    const type=form.querySelector('#listing-type')?.value||'';
    const discovery=form.dataset.discoveryContext||'';
    const payload=contracts.compatibilityAdapter({category,subcategory,type,discovery});
    const code=adapter.querySelector('code');
    if(code) code.textContent=`category=${payload.category||'—'} · subcategory=${payload.subcategory||'—'} · listing_type=${payload.listing_type||'—'}`;
    adapter.querySelectorAll('[data-adapter-live-note]').forEach(node=>node.remove());
    if(category==='Услуги'&&discovery&&payload.subcategory&&discovery!==payload.subcategory){
      const note=document.createElement('p');
      note.dataset.adapterLiveNote='true';
      note.textContent=`OPEN / FAIL / LOCKED: exact discovery „${discovery}“ не се persist-ва отделно. Текущият договор записва canonical „${payload.subcategory}“.`;
      adapter.append(note);
    }else if(category!=='Услуги'&&discovery){
      const note=document.createElement('p');
      note.dataset.adapterLiveNote='true';
      note.textContent=`„${discovery}“ остава discovery контекст и не се представя като записана подкатегория.`;
      adapter.append(note);
    }
  }

  function syncListingForm({preserve=true,resetDiscovery=false}={}){
    const category=document.getElementById('listing-category');
    const subcategory=document.getElementById('listing-subcategory');
    const subcategoryField=document.getElementById('listing-subcategory-field');
    const type=document.getElementById('listing-type');
    if(!category||!subcategory||!subcategoryField||!type) return;
    const form=category.closest('form');
    if(resetDiscovery) clearDiscoveryContext(form);
    const discovery=form?.dataset.discoveryContext||'';
    const categoryValue=category.value;
    const previousSubcategory=preserve?subcategory.value:'';
    const subcategories=contracts.listingSubcategories(categoryValue);
    const nextSubcategory=subcategories.includes(previousSubcategory)?previousSubcategory:'';
    subcategory.innerHTML=optionHtml(subcategories,nextSubcategory);
    subcategory.value=nextSubcategory;
    subcategoryField.hidden=categoryValue!=='Услуги';
    subcategory.disabled=categoryValue!=='Услуги';
    subcategory.required=categoryValue==='Услуги';
    const previousType=preserve?type.value:'';
    const allowedTypes=contracts.listingTypes(categoryValue);
    const nextType=allowedTypes.includes(previousType)?previousType:'';
    type.innerHTML=optionHtml(allowedTypes,nextType);
    type.value=nextType;
    const animalWarning=document.getElementById('animal-warning');
    if(animalWarning) animalWarning.hidden=categoryValue!=='Животни';
    const title=form?.querySelector('[name="Заглавие"]');
    const description=form?.querySelector('[name="Описание"]');
    const hints=listingTextHints(categoryValue,type.value,discovery,nextSubcategory);
    if(title&&!title.value) title.placeholder=hints[0];
    if(description&&!description.value) description.placeholder=hints[1];
    syncAdapter(form);
  }
  window.syncPrototypeListingForm=syncListingForm;

  function syncShopTags(){
    const category=document.getElementById('shop-category');
    const slot=document.getElementById('shop-classification-slot');
    if(!category||!slot) return;
    const selected=[...slot.querySelectorAll('input[name="shop_tags"]:checked')].map(x=>x.value);
    const custom=slot.querySelector('#shop-custom-tag')?.value||'';
    slot.innerHTML=shopClassification(category.value,selected);
    const nextCustom=slot.querySelector('#shop-custom-tag');
    if(nextCustom) nextCustom.value=custom;
  }

  function syncQuestionHints(){
    const form=document.querySelector('[data-proto-form][data-form-kind="question"]');
    if(!form) return;
    const category=form.querySelector('select');
    const title=form.querySelector('input[type="text"]');
    const description=form.querySelector('textarea');
    if(!category||!title||!description) return;
    const pair=questionExamples[category.value]||['Напр. Кой може да помогне с това в Лом?','Опиши ясно какво търсиш и какъв отговор би ти бил полезен.'];
    if(!title.value) title.placeholder=pair[0];
    if(!description.value) description.placeholder=pair[1];
  }

  document.addEventListener('click',event=>{
    const link=event.target.closest?.('a[href^="#"]');
    if(link&&activeDirtyForm()){
      if(!confirmLeave()){
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
    }

    const remove=event.target.closest?.('[data-remove-upload]');
    if(remove){
      const section=remove.closest('[data-upload-section]');
      const input=section?.querySelector('[data-demo-upload]');
      const form=input?.closest('[data-proto-form]');
      if(input){
        const state=uploadState.get(input)||{files:[],error:''};
        const index=Number(remove.dataset.removeUpload);
        const files=state.files.filter((_,i)=>i!==index);
        uploadState.set(input,{files,error:''});
        input.value='';
        renderUpload(input);
        if(form) form.dataset.dirty='true';
      }
      return;
    }

    const qa=event.target.closest?.('[data-qa-image]');
    if(qa){
      const card=qa.closest('.social-card-preview');
      const actual=card?.querySelector('.social-card-image')?.dataset.imageLevel||'unknown';
      const requested=qa.dataset.qaImage;
      const output=card?.querySelector('[data-qa-image-output]');
      if(output){
        output.textContent=requested==='real'&&actual!=='real'
          ? `QA SIMULATION ONLY: поискан е real, но действителният record остава „${actual}“. Не е създадена реална медия.`
          : `QA SIMULATION ONLY: визуално се проверява сценарий „${requested}“. Действителният production-like избор остава „${actual}“.`;
      }
      return;
    }

    const share=event.target.closest?.('[data-demo-share]');
    if(share){
      const message=share.closest('.share-menu')?.querySelector('.share-demo-message');
      const messages={native:'На телефон ще се отвори системното меню за споделяне.',facebook:'Facebook използва canonical URL и неговите crawler-visible metadata в production; тук е само UX пример.',copy:'Постоянният линк е копиран. (Прототип — няма реално копиране.)'};
      if(message) message.textContent=messages[share.dataset.demoShare]||'Готово за споделяне.';
    }

    const action=event.target.closest?.('[data-demo-report],[data-demo-correction],[data-demo-inquiry],[data-demo-site],[data-demo-answer],[data-demo-official]');
    if(action){
      const message=action.closest('.detail-action')?.querySelector('.action-demo-message');
      let text='';
      if(action.matches('[data-demo-report]')) text='Сигналът се изпраща за преглед според правилата за този тип съдържание.';
      if(action.matches('[data-demo-correction]')) text='Корекцията е за фактическа грешка и се изпраща за проверка.';
      if(action.matches('[data-demo-inquiry]')) text='Запитването е налично, защото примерният профил има такъв канал.';
      if(action.matches('[data-demo-site]')) text='Сайтът се показва само когато записът има публичен уеб адрес.';
      if(action.matches('[data-demo-answer]')) text='Формата за отговор е водещото действие при въпрос.';
      if(action.matches('[data-demo-official]')) text='В production се отваря официалният публичен източник на конкретния запис.';
      if(message) message.textContent=text;
    }
  },true);

  document.addEventListener('change',event=>{
    const target=event.target;
    if(target.matches('[data-demo-upload]')){
      const form=target.closest('[data-proto-form]');
      acceptUploadSelection(target);
      if(form) form.dataset.dirty='true';
      return;
    }
    if(target.id==='listing-category') syncListingForm({preserve:false,resetDiscovery:true});
    if(target.id==='listing-subcategory'||target.id==='listing-type') syncListingForm({preserve:true});
    if(target.id==='shop-category') syncShopTags();
    if(target.closest?.('[data-proto-form][data-form-kind="question"]')) syncQuestionHints();
    const form=target.closest?.('[data-proto-form]');
    if(form){
      form.dataset.dirty='true';
      if(target.id==='price-free'||target.id==='price-negotiable') syncPriceState(form,target);
      if(form.dataset.formKind==='health'&&(target.id==='health-phone'||target.id==='health-address')) validateHealthPair(form,false);
    }
  });

  document.addEventListener('input',event=>{
    const target=event.target;
    const form=target.closest?.('[data-proto-form]');
    if(form) form.dataset.dirty='true';
    if(target.matches('input,textarea,select')) setFieldError(target,'');
    if(form?.dataset.formKind==='listing'&&target.id==='listing-price') syncPriceState(form,target);
    if(form?.dataset.formKind==='health'&&(target.id==='health-phone'||target.id==='health-address')){
      validateHealthPair(form,false);
      if(target.id==='health-phone') setFieldError(target,phoneMessage(target.value));
    }
  });

  document.addEventListener('blur',event=>{
    const control=event.target.closest?.('[data-proto-form] input,[data-proto-form] textarea,[data-proto-form] select');
    if(control) setFieldError(control,validateControl(control));
  },true);

  window.addEventListener('beforeunload',event=>{
    if(activeDirtyForm()){
      event.preventDefault();
      event.returnValue='';
    }
  });

  document.querySelectorAll('[data-demo-upload]').forEach(input=>{
    uploadState.set(input,{files:[],error:''});
    renderUpload(input);
  });
  const initialListingForm=document.querySelector('[data-proto-form][data-form-kind="listing"]');
  if(initialListingForm) syncAdapter(initialListingForm);
})();