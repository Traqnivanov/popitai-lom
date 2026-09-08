'use strict';

(() => {
  const contracts=window.PopitaiStage2Contracts;
  const validators=window.PopitaiValidators;
  const formOwners=window.PopitaiFormOwners;
  const addLayer=document.getElementById('add-layer');
  const backgroundSelectors=['.site-header','.prototype-strip','#app-main','.site-footer','.mobile-bottom'];
  const uploadState=new WeakMap();
  let modalOpener=null, previousBodyOverflow='', shareReturnFocus=null;

  const favoriteEligible=new Set(['listing','firm','shop','restaurant','health','event','publication','article','info']);
  const favoriteSaved=new Map();
  const favoriteLabels={listing:'Обяви и услуги',firm:'Фирми',shop:'Магазини',restaurant:'Заведения',health:'Health профили',event:'Събития',publication:'Публикации',article:'Статии',info:'Инфо Лом'};
  let favoriteLoggedIn=false;

  function closeMoreMenu(){document.querySelectorAll('.desktop-nav details[open]').forEach(details=>{details.open=false;});}
  function setBackgroundInert(value){backgroundSelectors.forEach(selector=>{const el=document.querySelector(selector);if(!el)return;el.inert=value;if(value)el.setAttribute('aria-hidden','true');else el.removeAttribute('aria-hidden');});}
  function focusables(root){return [...root.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el=>!el.hidden&&el.getClientRects().length>0);}
  function openAdd(opener){
    if(!addLayer||!addLayer.hidden)return;
    modalOpener=opener instanceof HTMLElement?opener:document.activeElement;
    previousBodyOverflow=document.body.style.overflow;addLayer.hidden=false;document.body.style.overflow='hidden';setBackgroundInert(true);
    (focusables(addLayer)[0]||addLayer.querySelector('.modal-card'))?.focus();
  }
  function closeAdd({restoreFocus=true}={}){
    if(!addLayer||addLayer.hidden)return;
    addLayer.hidden=true;setBackgroundInert(false);document.body.style.overflow=previousBodyOverflow;
    if(restoreFocus&&modalOpener instanceof HTMLElement&&document.contains(modalOpener))modalOpener.focus({preventScroll:true});
    modalOpener=null;
  }
  function trapFocus(event,root){
    if(event.key!=='Tab')return false;
    const items=focusables(root);if(!items.length){event.preventDefault();root.focus?.();return true;}
    const first=items[0],last=items.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();return true;}
    if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();return true;}
    return false;
  }

  function activeDirtyForm(){return document.querySelector('[data-proto-form][data-dirty="true"]:not([data-submitted="true"])');}
  function confirmLeave(){const form=activeDirtyForm();if(!form)return true;const ok=window.confirm('Има непубликувани промени. Ако напуснеш, въведеното ще се загуби. Да продължа ли?');if(ok)form.dataset.dirty='false';return ok;}
  function beforeRouteChange(){return confirmLeave();}
  function routeTo(target){return window.PopitaiRouter?.navigate?.(target)??false;}

  function escapeOption(value=''){return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');}
  function optionHtml(values,current=''){return '<option value="">Избери</option>'+values.map(item=>{const pair=typeof item==='object'?item:{value:item,label:item};return `<option value="${escapeOption(pair.value)}" ${String(pair.value)===String(current)?'selected':''}>${escapeOption(pair.label)}</option>`;}).join('');}
  function clearDiscoveryContext(form){if(!form)return;form.dataset.discoveryContext='';const visible=form.closest('.form-wrap')?.querySelector('.discovery-context,.service-context-summary');if(visible)visible.hidden=true;}
  function syncAdapter(form){
    if(!form)return;const adapter=form.closest('.form-wrap')?.querySelector('.qa-adapter');if(!adapter)return;
    const category=form.querySelector('#listing-category')?.value||'',subcategory=category==='Услуги'?(form.querySelector('#listing-subcategory')?.value||''):'',type=form.querySelector('#listing-type')?.value||'',discovery=form.dataset.discoveryContext||'';
    const payload=contracts.compatibilityAdapter({category,subcategory,type,discovery});const code=adapter.querySelector('code');if(code)code.textContent=`category=${payload.category||'—'} · subcategory=${payload.subcategory||'—'} · listing_type=${payload.listing_type||'—'}`;
  }
  function syncListingForm({preserve=true,resetDiscovery=false}={}){
    const category=document.getElementById('listing-category'),subcategory=document.getElementById('listing-subcategory'),subcategoryField=document.getElementById('listing-subcategory-field'),type=document.getElementById('listing-type');
    if(!category||!subcategory||!subcategoryField||!type)return;
    const form=category.closest('form');if(resetDiscovery)clearDiscoveryContext(form);
    const categoryValue=category.value,previousSub=preserve?subcategory.value:'',subs=categoryValue==='Работа'?workGroups:contracts.listingSubcategories(categoryValue),nextSub=subs.includes(previousSub)?previousSub:'';
    subcategory.innerHTML=optionHtml(subs,nextSub);subcategory.value=nextSub;
    const showClassification=categoryValue==='Услуги'||categoryValue==='Работа';
    subcategoryField.hidden=!showClassification;subcategory.disabled=!showClassification;subcategory.required=categoryValue==='Услуги';
    const subcategoryLabel=subcategoryField.querySelector('label');if(subcategoryLabel)subcategoryLabel.textContent=categoryValue==='Работа'?'Професионално направление':'Подкатегория / вид';
    if(type.tagName==='SELECT'){
      const field=type.closest('.field'),previous=preserve?type.value:'';
      if(categoryValue==='Услуги'&&form?.dataset.formMode!=='edit'){
        type.innerHTML=optionHtml([{value:'Дава',label:'Предлагам услуга'}],'Дава');type.value='Дава';if(field){field.hidden=true;field.setAttribute('aria-hidden','true');}
      }else{
        const allowed=categoryValue==='Услуги'?[{value:'Дава',label:'Предлагам услуга'},...(form?.dataset.formMode==='edit'&&previous==='Търси'?[{value:'Търси',label:'Търся изпълнител (стар запис)'}]:[])]:contracts.listingTypes(categoryValue);
        const values=allowed.map(x=>typeof x==='object'?x.value:x);const next=values.includes(previous)?previous:'';type.innerHTML=optionHtml(allowed,next);type.value=next;if(field){field.hidden=false;field.removeAttribute('aria-hidden');}
      }
    }
    const animal=document.getElementById('animal-warning');if(animal)animal.hidden=categoryValue!=='Животни';
    syncPriceContext(form,{reset:!preserve});
    const discovery=form?.dataset.discoveryContext||'',title=form?.querySelector('[name="Заглавие"]'),description=form?.querySelector('[name="Описание"]'),hints=listingTextHints(categoryValue,type.value,discovery,nextSub);
    if(title&&!title.value)title.placeholder=hints[0];if(description&&!description.value)description.placeholder=hints[1];syncAdapter(form);
  }
  function syncShopTags(){const category=document.getElementById('shop-category'),slot=document.getElementById('shop-classification-slot');if(!category||!slot)return;const selected=[...slot.querySelectorAll('input[name="shop_tags"]:checked')].map(x=>x.value),custom=slot.querySelector('#shop-custom-tag')?.value||'';slot.innerHTML=shopClassification(category.value,selected);const next=slot.querySelector('#shop-custom-tag');if(next)next.value=custom;}
  function syncQuestionHints(){const form=document.querySelector('[data-proto-form][data-form-kind="question"]');if(!form)return;const category=form.querySelector('select'),title=form.querySelector('input[type="text"]'),description=form.querySelector('textarea');if(!category||!title||!description)return;const pair=questionExamples[category.value]||['Напр. Кой може да помогне с това в Лом?','Опиши ясно какво търсиш и какъв отговор би ти бил полезен.'];if(!title.value)title.placeholder=pair[0];if(!description.value)description.placeholder=pair[1];}
  function syncPriceContext(form,{reset=false}={}){
    const category=form?.querySelector('#listing-category')?.value||'',price=form?.querySelector('#listing-price'),label=form?.querySelector('[data-price-label]'),fieldset=form?.querySelector('[data-price-options]');
    if(!price||!label||!fieldset)return;const context=formOwners.listingPriceContext(category);
    if(reset){price.value='';price.disabled=false;}
    label.textContent=context.label;fieldset.dataset.priceContext=context.key;fieldset.hidden=!context.options.length;
    const items=fieldset.querySelector('[data-price-option-items]');if(items)items.innerHTML=context.options.map(option=>`<label><input id="${option.id}" type="checkbox" name="${option.name}"> ${escapeOption(option.label)}</label>`).join('');
    const error=fieldset.querySelector('#price-state-error');if(error)error.textContent='';
  }
  function syncPriceState(form,target=null){
    const price=form?.querySelector('#listing-price'),neg=form?.querySelector('#price-negotiable'),free=form?.querySelector('#price-free'),onRequest=form?.querySelector('#price-on-request');if(!price)return;
    const blockers=[free,onRequest].filter(Boolean);
    if(target&&blockers.includes(target)&&target.checked){if(neg)neg.checked=false;blockers.forEach(control=>{if(control!==target)control.checked=false;});price.value='';price.disabled=true;return;}
    if(target===neg&&neg?.checked){blockers.forEach(control=>{control.checked=false;});price.disabled=false;return;}
    if(target===price&&price.value.trim()){blockers.forEach(control=>{control.checked=false;});price.disabled=false;return;}
    price.disabled=blockers.some(control=>control.checked);
  }

  function uploadConfig(input){return {maxFiles:Number(input.dataset.maxFiles||1),maxBytes:Number(input.dataset.maxBytes||10485760),allowed:new Set((input.dataset.allowedMime||'').split(',').filter(Boolean))};}
  function validateFiles(input,files){const cfg=uploadConfig(input);if(files.length>cfg.maxFiles)return `Можеш да избереш най-много ${cfg.maxFiles} ${cfg.maxFiles===1?'файл':'файла'}.`;for(const file of files){if(!file||file.size===0)return `Файлът „${file?.name||'без име'}“ е празен или невалиден.`;if(file.size>cfg.maxBytes)return `Файлът „${file.name}“ е над 10 MB.`;if(!cfg.allowed.has(file.type))return `Файлът „${file.name}“ не е JPG, PNG или WebP.`;}return '';}
  function renderUpload(input){const section=input.closest('[data-upload-section]'),state=uploadState.get(input)||{files:[],error:''},count=section?.querySelector('[data-upload-count]');if(count)count.textContent=`${state.files.length} / ${Number(input.dataset.maxFiles||1)}`;const error=section?.querySelector('[data-upload-error]');if(error)error.textContent=state.error||'';const selected=section?.querySelector('[data-upload-selected]');if(selected)selected.innerHTML=state.files.map((file,index)=>`<div class="upload-file-chip"><span>${escapeOption(file.name)} · ${Math.max(1,Math.round(file.size/1024))} KB</span><button type="button" class="btn soft" data-remove-upload="${index}">Премахни</button></div>`).join('');}
  function acceptUpload(input){const files=[...(input.files||[])],error=validateFiles(input,files);uploadState.set(input,error?{files:[],error}:{files:[...files],error:''});if(error)input.value='';renderUpload(input);}
  function validateUploads(form){let first=null;form.querySelectorAll('[data-demo-upload]').forEach(input=>{const state=uploadState.get(input)||{files:[],error:''},error=state.error||validateFiles(input,state.files);if(error){uploadState.set(input,{...state,error});renderUpload(input);if(!first)first=input.closest('[data-upload-section]');}});return first;}

  function closeShareOverlay(overlay,{restoreFocus=true}={}){if(!overlay)return;overlay.hidden=true;document.body.classList.remove('share-open');if(restoreFocus)shareReturnFocus?.focus?.();shareReturnFocus=null;}
  function openShare(button){const overlay=button.parentElement?.querySelector('[data-share-overlay]');if(!overlay)return;shareReturnFocus=button;overlay.hidden=false;document.body.classList.add('share-open');overlay.querySelector('[data-close-share]')?.focus();}

  function inferFavorite(href=''){const value=String(href);if(/detail\/question|vapros\.html/i.test(value))return{type:'question',key:value};if(/detail\/firm|firma\.html/i.test(value))return{type:'firm',key:value};if(/detail\/shop|magazini\.html/i.test(value))return{type:'shop',key:value};if(/detail\/health|zdrave-i-lekari\.html/i.test(value))return{type:'health',key:value};if(/detail\/event|sabitiya\.html/i.test(value))return{type:'event',key:value};if(/detail\/publication/i.test(value))return{type:'publication',key:value};if(/detail\/article|statia\.html/i.test(value))return{type:'article',key:value};if(/detail\/info|info\.html/i.test(value))return{type:'info',key:value};return{type:'listing',key:value||location.hash};}
  function titleFor(node){return node?.querySelector?.('h1,h2,h3,strong')?.textContent?.trim()||'Запазен запис';}
  function favoriteButton({type,key,title}){const button=document.createElement('button');button.type='button';button.className='favorite-heart';button.dataset.favoriteToggle='true';button.dataset.favoriteType=type;button.dataset.favoriteKey=key;button.dataset.favoriteTitle=title;button.setAttribute('aria-label',favoriteSaved.has(key)?'Премахни от любими':'Добави в любими');button.setAttribute('aria-pressed',String(favoriteSaved.has(key)));button.textContent=favoriteSaved.has(key)?'♥':'♡';return button;}
  function augmentFavorites(){
    const route=parseHash();
    document.querySelectorAll('#app-main .result-row').forEach((row,index)=>{if(row.querySelector('[data-favorite-toggle]'))return;const link=row.querySelector('a[href]');let info=inferFavorite(link?.getAttribute('href')||'');if(route.path==='magazini'&&!link?.getAttribute('href')?.startsWith('#detail'))info={type:'shop',key:`shop:${titleFor(row)}:${index}`};if(route.path==='zavedenia')info={type:'restaurant',key:link?.getAttribute('href')||`restaurant:${titleFor(row)}:${index}`};if(!favoriteEligible.has(info.type))return;row.classList.add('favorite-card-host');row.append(favoriteButton({type:info.type,key:info.key,title:titleFor(row)}));});
    document.querySelectorAll('#app-main a.info-card[href*="#detail/info"]').forEach(anchor=>{if(anchor.parentElement?.classList.contains('favorite-info-wrap'))return;const wrap=document.createElement('div');wrap.className='favorite-info-wrap';anchor.before(wrap);wrap.append(anchor);wrap.append(favoriteButton({type:'info',key:anchor.getAttribute('href')||'',title:titleFor(anchor)}));});
    const page=document.querySelector('#app-main .detail-page,#app-main .article-detail-page');if(page){const type=parseHash().path.split('/')[1]||'listing';if(favoriteEligible.has(type)){let button=page.querySelector('[data-favorite-toggle],.favorite-pending');const host=page.querySelector('.detail-action')||page.querySelector('.detail-side');if(!button&&host){button=document.createElement('button');button.type='button';button.className='btn soft';host.append(button);}if(button){const key=location.hash||`${type}:${titleFor(page)}`;button.classList.remove('favorite-pending');button.removeAttribute('aria-disabled');button.removeAttribute('title');button.dataset.favoriteToggle='true';button.dataset.favoriteType=type;button.dataset.favoriteKey=key;button.dataset.favoriteTitle=titleFor(page);button.setAttribute('aria-pressed',String(favoriteSaved.has(key)));button.textContent=favoriteSaved.has(key)?'Премахни от любими':'Добави в любими';}}}
  }
  function favoriteGroups(){if(!favoriteSaved.size)return '<article class="empty-card"><h2>Нямаш запазени записи</h2><p>Когато добавиш нещо в любими, ще се появи тук по вид съдържание.</p></article>';const groups=new Map();favoriteSaved.forEach(item=>{if(!groups.has(item.type))groups.set(item.type,[]);groups.get(item.type).push(item);});return [...groups.entries()].map(([type,items])=>`<section class="saved-group"><h2>${esc(favoriteLabels[type]||type)}</h2><div class="result-list">${items.map(item=>`<article class="result-row"><div><h3>${esc(item.title)}</h3><p>${esc(favoriteLabels[item.type]||item.type)}</p></div><button class="btn soft" type="button" data-favorite-remove="${esc(item.key)}">Премахни</button></article>`).join('')}</div></section>`).join('');}
  function profileMarkup(){return !favoriteLoggedIn?`<div class="page favorites-profile" data-favorites-profile>${pageHead('Профил','Влез, за да виждаш собственото съдържание и запазените записи.')}<div class="shell"><article class="profile-card"><h2>Не си влязъл в профила си</h2><p>За да използваш „Любими“, е необходим профил.</p><button class="btn primary" type="button" data-favorite-demo-login>Вход</button></article><section class="saved-section"><h2>Запазени</h2><p>След вход тук се показват запазените записи, групирани по вид.</p></section><p class="favorite-session-note">В този прототип няма реален вход и няма постоянно съхранение.</p></div></div>`:`<div class="page favorites-profile" data-favorites-profile>${pageHead('Профил','Твоето съдържание и запазените записи.')}<div class="shell"><article class="profile-card"><h2>Профил</h2><p>Демонстрационно състояние след вход.</p><button class="btn soft" type="button" data-favorite-demo-logout>Изход</button></article><section class="saved-section"><div class="section-head"><div><h2>Запазени</h2><p>Групирани по вид съдържание.</p></div></div>${favoriteGroups()}</section><p class="favorite-session-note">Запазването е само за текущата отворена сесия на прототипа и не се записва в Supabase.</p></div></div>`;}
  function rerenderProfile(){const main=document.getElementById('app-main');if(main&&parseHash().path==='profile')main.innerHTML=profileMarkup();}

  function handleClick(event){
    const moreDetails=event.target.closest('.desktop-nav details');if(!moreDetails||event.target.closest('.more-menu a'))closeMoreMenu();
    const opener=event.target.closest('[data-open-add]');if(opener){event.preventDefault();openAdd(opener);return;}
    if(event.target.closest('[data-close-add]')){closeAdd();return;}if(event.target===addLayer){closeAdd();return;}
    const retry=event.target.closest('[data-retry-state]');if(retry){routeTo((location.hash||'#home').replace(/([?&])state=error(&|$)/,'$1').replace(/[?&]$/,''));return;}
    const property=event.target.closest('[data-property-type]');if(property){window.propertyType=property.dataset.propertyType||window.propertyType;property.parentElement.querySelectorAll('.tab').forEach(tab=>tab.classList.toggle('active',tab===property));document.querySelectorAll('[data-property-kind]').forEach(card=>{card.href=propertyResultsHref(card.dataset.propertyKind||'');});const add=document.querySelector('[data-property-add]');if(add)add.href=contracts.listingAddUrl({category:'Имоти',type:window.propertyType});}
    const openShareButton=event.target.closest('[data-open-share]');if(openShareButton){openShare(openShareButton);return;}const closeShare=event.target.closest('[data-close-share]');if(closeShare){closeShareOverlay(closeShare.closest('[data-share-overlay]'));return;}
    const removeUpload=event.target.closest('[data-remove-upload]');if(removeUpload){const input=removeUpload.closest('[data-upload-section]')?.querySelector('[data-demo-upload]');if(input){const state=uploadState.get(input)||{files:[],error:''};uploadState.set(input,{files:state.files.filter((_,i)=>i!==Number(removeUpload.dataset.removeUpload)),error:''});input.value='';renderUpload(input);const form=input.closest('[data-proto-form]');if(form)form.dataset.dirty='true';}return;}
    const favoriteRemove=event.target.closest('[data-favorite-remove]');if(favoriteRemove){favoriteSaved.delete(favoriteRemove.dataset.favoriteRemove);rerenderProfile();return;}
    if(event.target.closest('[data-favorite-demo-login]')){favoriteLoggedIn=true;rerenderProfile();return;}if(event.target.closest('[data-favorite-demo-logout]')){favoriteLoggedIn=false;favoriteSaved.clear();rerenderProfile();return;}
    const favorite=event.target.closest('[data-favorite-toggle]');if(favorite){if(!favoriteLoggedIn){let note=document.querySelector('.favorite-login-note');if(!note){note=document.createElement('div');note.className='favorite-login-note';document.body.append(note);}note.innerHTML='<span>Влез в профила си, за да добавяш в любими.</span><a href="#profile">Към профила</a>';return;}document.querySelector('.favorite-login-note')?.remove();const key=favorite.dataset.favoriteKey;if(favoriteSaved.has(key))favoriteSaved.delete(key);else favoriteSaved.set(key,{key,type:favorite.dataset.favoriteType,title:favorite.dataset.favoriteTitle});augmentFavorites();return;}
    const contact=event.target.closest('[data-demo-contact]');if(contact){const msg=contact.parentElement.querySelector('.contact-demo-message');if(msg)msg.textContent='Този пример не съдържа публикуван телефон или лични данни.';}
    const share=event.target.closest('[data-demo-share]');if(share){const msg=share.closest('.share-drawer')?.querySelector('.share-demo-message');const messages={native:'На телефон ще се отвори системното меню за споделяне.',facebook:'Facebook ще използва линка към тази страница.',copy:'Линкът към страницата е готов за копиране.'};if(msg)msg.textContent=messages[share.dataset.demoShare]||'Готово за споделяне.';}
    const action=event.target.closest('[data-demo-report],[data-demo-correction],[data-demo-inquiry],[data-demo-site],[data-demo-answer],[data-demo-official]');if(action){const msg=action.closest('.detail-action')?.querySelector('.action-demo-message');if(msg){if(action.matches('[data-demo-report]'))msg.textContent='Сигналът се изпраща за преглед според правилата за този тип съдържание.';if(action.matches('[data-demo-correction]'))msg.textContent='Корекцията е за фактическа грешка и се изпраща за проверка.';if(action.matches('[data-demo-inquiry]'))msg.textContent='Запитването е налично, защото примерният профил има такъв канал.';if(action.matches('[data-demo-site]'))msg.textContent='Сайтът се показва само когато записът има публичен уеб адрес.';if(action.matches('[data-demo-answer]'))msg.textContent='Формата за отговор е водещото действие при въпрос.';if(action.matches('[data-demo-official]'))msg.textContent='Официалният публичен източник ще се отвори от този бутон.';}}
  }
  function handleChange(event){const target=event.target,form=target.closest?.('[data-proto-form]');if(target.matches('[data-demo-upload]')){acceptUpload(target);if(form)form.dataset.dirty='true';return;}if(target.id==='listing-category')syncListingForm({preserve:false,resetDiscovery:true});if(target.id==='listing-subcategory'){if(form?.querySelector('#listing-category')?.value==='Работа')form.dataset.discoveryContext=target.value||'';syncListingForm({preserve:true});}if(target.id==='listing-type')syncListingForm({preserve:true});if(target.id==='shop-category')syncShopTags();if(target.closest?.('[data-proto-form][data-form-kind="question"]'))syncQuestionHints();if(form){form.dataset.dirty='true';if(['price-free','price-negotiable','price-on-request'].includes(target.id))syncPriceState(form,target);validators.validateControl(form,target);}}
  function handleInput(event){const target=event.target,form=target.closest?.('[data-proto-form]');if(form)form.dataset.dirty='true';if(form&&target.matches('input,textarea,select'))validators.setError(target,'');if(form?.dataset.formKind==='listing'&&target.matches('[data-other-service-text]')){const exact=target.value.trim(),title=form.querySelector('[name="Заглавие"]'),description=form.querySelector('[name="Описание"]');if(exact&&title&&!title.value)title.placeholder=`Предлагам ${exact} в Лом`;if(exact&&description&&!description.value)description.placeholder=`Опиши „${exact}“, район, срок и важни условия.`;}if(form?.dataset.formKind==='listing'&&target.id==='listing-price')syncPriceState(form,target);}
  function handleFocusOut(event){const control=event.target.closest?.('[data-proto-form] input,[data-proto-form] textarea,[data-proto-form] select');if(control)validators.validateControl(control.closest('[data-proto-form]'),control);}
  function handleKeydown(event){
    if(event.key==='Escape')closeMoreMenu();
    if(addLayer&&!addLayer.hidden){if(event.key==='Escape'){event.preventDefault();closeAdd();return;}trapFocus(event,addLayer);return;}
    const overlay=document.querySelector('[data-share-overlay]:not([hidden])');if(overlay){if(event.key==='Escape'){event.preventDefault();closeShareOverlay(overlay);return;}trapFocus(event,overlay.querySelector('.share-drawer')||overlay);}
  }
  function handleSubmit(event){
    if(event.target.matches('[data-global-search],[data-page-search]')){event.preventDefault();const q=new FormData(event.target).get('q')?.toString().toLocaleLowerCase('bg-BG').trim()||'',serviceMatch=serviceSearchMatch(q);if(serviceMatch){routeTo(serviceResultsHref(serviceMatch));return;}const route=/работ|шофьор|продавач/.test(q)?'rabota':/апартамент|къща|имот|парцел|наем/.test(q)?'imoti':/кола|автомоб|част/.test(q)?'avtomobili':/кот|куче|живот/.test(q)?'zhivotni':'obyavi';routeTo(`#${route}`);return;}
    if(!event.target.matches('[data-proto-form]'))return;event.preventDefault();const form=event.target;if(form.dataset.submitted==='true')return;if(!validators.validateForm(form,{uploadValidator:validateUploads}))return;form.dataset.submitted='true';form.dataset.dirty='false';const submit=form.querySelector('button[type="submit"]');if(submit)submit.disabled=true;const title=form.dataset.formKind==='health'?'Изпратено за одобрение.':'Успешно изпратено за преглед.';form.innerHTML=`<div class="notice ok" tabindex="-1" data-success-card><strong>${title}</strong><p>Формата е приключена и не може да бъде изпратена повторно.</p><a class="btn" href="#home">Към началото</a></div>`;form.querySelector('[data-success-card]')?.focus();
  }

  function afterRender(){document.querySelector('.favorite-login-note')?.remove();document.querySelectorAll('[data-proto-form]').forEach(form=>{if(!form.dataset.dirty)form.dataset.dirty='false';if(!form.dataset.submitted)form.dataset.submitted='false';});document.querySelectorAll('[data-demo-upload]').forEach(input=>{uploadState.set(input,{files:[],error:''});renderUpload(input);});const listing=document.querySelector('[data-proto-form][data-form-kind="listing"]');if(listing){const title=listing.querySelector('[name="Заглавие"]'),category=listing.querySelector('#listing-category')?.value||'',subcategory=listing.querySelector('#listing-subcategory')?.value||'';if(title&&!title.value&&category==='Услуги'&&subcategory==='ВиК')title.placeholder='Напр. Предлагам ВиК в Лом';syncPriceContext(listing);syncPriceState(listing);syncAdapter(listing);}augmentFavorites();}
  function closeTransient(){closeMoreMenu();closeAdd({restoreFocus:false});closeShareOverlay(document.querySelector('[data-share-overlay]:not([hidden])'),{restoreFocus:false});}

  document.addEventListener('click',handleClick);
  document.addEventListener('change',handleChange);
  document.addEventListener('input',handleInput);
  document.addEventListener('focusout',handleFocusOut);
  document.addEventListener('keydown',handleKeydown);
  document.addEventListener('submit',handleSubmit);
  window.addEventListener('beforeunload',event=>{if(activeDirtyForm()){event.preventDefault();event.returnValue='';}});
  document.body?.classList.toggle('qa-mode',new URLSearchParams(location.search).get('qa')==='1');

  window.PopitaiInteractions=Object.freeze({beforeRouteChange,afterRender,closeTransient,profileMarkup,openAdd,closeAdd,activeDirtyForm});
})();
