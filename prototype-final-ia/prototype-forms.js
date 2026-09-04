'use strict';

const listingCategories=['Електроника','Дом и градина','Дрехи и обувки','Деца и бебета','Спорт и хоби','Автомобили и МПС','Животни','Работа','Имоти','Услуги','Друго'];
const firmCategories=['Майстори и ремонти','Здраве и лекари','Автомобили','Магазини и покупки','Заведения','Работа и услуги'];
const questionCategories=['Майстори и ремонти','Здраве и лекари','Автомобили','Магазини и покупки','Заведения','Работа и услуги','Обяви','Събития и град'];
const healthOwnerTypes=['Лекар','Стоматолог','Ветеринар'];
const stage2=window.PopitaiStage2Contracts;

const formConfig={
  listing:{title:'Добави обява',subtitle:'Публикувай продажба, търсене, работа, имот или услуга.',fields:[['Заглавие','text'],['Категория','select'],['Подкатегория / вид','select'],['Тип обява','select'],['Описание','textarea'],['Цена в евро','number'],['Телефон','tel'],['Град / район','text'],['Улица (по желание)','text']]},
  firm:{title:'Добави фирма',subtitle:'Създай постоянен профил на местна фирма или доставчик.',fields:[['Име на фирмата','text'],['Категория','select'],['Телефон','tel'],['Град (по желание)','text'],['Адрес (по желание)','text'],['Работно време (по желание)','text'],['Описание','textarea']]},
  shop:{title:'Добави магазин',subtitle:'Предложи местен магазин за преглед и публикуване.',fields:[['Име на магазина','text'],['Категория','select'],['Телефон','tel'],['Адрес в Лом','text'],['Работно време','text'],['Какво предлага','textarea'],['Източник на информацията','select'],['Уточнение за източника (по желание)','text']]},
  health:{title:'Добави лекар / здравна услуга',subtitle:'Предложи лекар, стоматолог или ветеринар в специализирания здравен раздел.',fields:[['Тип','select'],['Име на лекар / практика','text'],['Специалност / основна услуга','text'],['Телефон','tel'],['Адрес в Лом','text'],['Кратко описание','textarea']]},
  question:{title:'Задай въпрос',subtitle:'Опиши ясно какво търсиш, за да получиш полезни отговори.',fields:[['Заглавие на въпроса','text'],['Категория','select'],['Описание','textarea']]}
};

function selectOptions(values,current=''){return '<option value="">Избери</option>'+values.map(v=>`<option value="${esc(v)}" ${String(v)===String(current)?'selected':''}>${esc(v)}</option>`).join('');}
function listingCategory(query){return query.get('state')==='edit'?editValue('listing','Категория'):(query.get('category')||'');}
function listingSubcategory(query){
  if(query.get('state')==='edit') return editValue('listing','Подкатегория / вид')||'';
  const cat=listingCategory(query);const raw=query.get('subcategory')||'';
  if(cat==='Услуги'&&raw) return stage2?.serviceCanonical(raw)||raw;
  return raw;
}
function listingSubcategoryOptions(query){return stage2?.listingSubcategories(listingCategory(query))||[];}
function listingSubcategoryRequired(query){return listingSubcategoryOptions(query).length>0;}
function healthVisibleType(raw){
  if(['Лични лекари','Специалисти','Лекари','doctor'].includes(raw)) return 'Лекар';
  if(['Стоматолози','dentist'].includes(raw)) return 'Стоматолог';
  if(['Ветеринари','vet'].includes(raw)) return 'Ветеринар';
  return healthOwnerTypes.includes(raw)?raw:'';
}
function optionsFor(kind,label,query){
  if(kind==='listing'&&label==='Категория') return listingCategories;
  if(kind==='listing'&&label==='Подкатегория / вид') return listingSubcategoryOptions(query);
  if(kind==='listing'&&label==='Тип обява') return stage2?.listingTypes(listingCategory(query),listingSubcategory(query))||['Продава','Купува','Търси','Дава'];
  if(kind==='firm'&&label==='Категория') return firmCategories;
  if(kind==='question'&&label==='Категория') return questionCategories;
  if(kind==='shop'&&label==='Категория') return shopGroups;
  if(kind==='shop'&&label==='Източник на информацията') return ['Собственик / управител','Служител','Клиент / посетител','Публичен източник','Друго'];
  if(kind==='health'&&label==='Тип') return healthOwnerTypes;
  return ['Примерна стойност','Друго'];
}
function editFieldValue(kind,label){const value=editValue(kind,label);if(kind==='question'&&label==='Категория'&&value==='Услуги') return 'Работа и услуги';if(kind==='health'&&label==='Тип') return healthVisibleType(value);return value;}
function currentForField(kind,label,query){
  if(query.get('state')==='edit') return editFieldValue(kind,label);
  if(kind==='health'&&label==='Тип') return healthVisibleType(query.get('type')||'');
  if(kind==='health'&&label==='Специалност / основна услуга'&&query.get('type')==='Лични лекари') return 'Личен лекар / общопрактикуващ лекар';
  if(kind!=='listing') return label==='Категория'?(query.get('category')||''):'';
  if(label==='Категория') return query.get('category')||'';
  if(label==='Подкатегория / вид') return listingSubcategory(query);
  if(label==='Тип обява') {
    const sub=listingSubcategory(query);const forced=stage2?.animalTypeBySubcategory?.[sub]||'';
    return forced||query.get('type')||'';
  }
  return '';
}

function shopClassification(){
  const tags=stage2?.shopTags||[];
  return `<fieldset class="field shop-classification"><legend>Какво ще намерят клиентите?</legend><p class="help">Избери едно или повече подходящи уточнения. Те не променят основната категория на магазина.</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:7px">${tags.map(tag=>`<label style="display:flex;align-items:center;gap:8px;font-weight:650"><input type="checkbox" name="shop_tags" value="${esc(tag)}" style="width:auto"> <span>${esc(tag)}</span></label>`).join('')}</div><label for="shop-custom-tag" style="margin-top:8px">Друго</label><input id="shop-custom-tag" name="custom_tag" maxlength="80" placeholder="Само ако подходящо уточнение липсва"></fieldset>`;
}

const questionExamples={
  'Майстори и ремонти':['Напр. Кой препоръчва добър ВиК майстор в Лом?','Опиши какъв ремонт или майстор търсиш, къде е обектът и какво е важно за теб.'],
  'Здраве и лекари':['Напр. Кой кардиолог в Лом бихте препоръчали?','Опиши какъв лекар или здравна информация търсиш. Не публикувай чувствителни лични медицински данни.'],
  'Автомобили':['Напр. Кой автосервиз в Лом препоръчвате?','Опиши автомобила, проблема или услугата, която търсиш.'],
  'Магазини и покупки':['Напр. Къде в Лом мога да намеря този продукт?','Опиши какво търсиш и какви условия са важни.'],
  'Заведения':['Напр. Къде в Лом има добра храна за вкъщи?','Опиши какъв тип заведение или услуга търсиш.'],
  'Работа и услуги':['Напр. Кой предлага почистване на апартамент в Лом?','Опиши конкретната услуга, срок и район.'],
  'Обяви':['Напр. Някой предлага ли това в Лом?','Опиши какво търсиш или искаш да намериш.'],
  'Събития и град':['Напр. Какво се случва в Лом този уикенд?','Опиши каква местна информация или събитие търсиш.']
};
function questionPlaceholder(label,query){const pair=questionExamples[query.get('category')||'']||['Напр. Кой може да помогне с това в Лом?','Опиши ясно какво търсиш и какъв отговор би ти бил полезен.'];return label==='Заглавие на въпроса'?pair[0]:pair[1];}
function listingTextHints(cat,type,sub){
  if(cat==='Услуги') return type==='Търси'?['Напр. Търся изпълнител за конкретна услуга в Лом','Опиши какво трябва да се направи, район, срок и важни условия.']:['Напр. Предлагам конкретна услуга в Лом','Опиши какво извършваш, район, срокове и важни условия.'];
  if(cat==='Работа') return type==='Търси работа'?['Напр. Търся работа като шофьор в Лом','Опиши опит, квалификация, наличност и каква работа търсиш.']:['Напр. Търсим шофьор за доставки в Лом','Опиши длъжност, график, изисквания и условия.'];
  if(cat==='Имоти') return ['Напр. Двустаен апартамент в Лом','Опиши вида на имота, район, състояние и важни условия за сделката.'];
  if(cat==='Автомобили и МПС') return sub==='Части, гуми и аксесоари'?['Напр. Комплект зимни гуми за автомобил','Опиши състояние, размер/съвместимост и важни детайли.']:['Напр. Автомобил в Лом','Опиши марка, модел, година, състояние и важни подробности.'];
  if(cat==='Животни') return sub==='Осиновяване / търси дом'?['Напр. Котка търси дом в Лом','Опиши животното, възраст, характер и условията за осиновяване.']:sub==='Изгубени'?['Напр. Изгубено куче в Лом','Опиши кога и къде е изгубено, отличителни белези и контакт.']:sub==='Намерени'?['Напр. Намерено куче в Лом','Опиши кога и къде е намерено и отличителните белези.']:['Напр. Храна или аксесоар за домашен любимец','Опиши стоката, състоянието и важните подробности.'];
  return ['Напр. Продавам запазен велосипед в Лом','Опиши състояние, размери, важни особености и условия.'];
}

function formPage(kind,query){
  const c=formConfig[kind]||formConfig.listing;const state=query.get('state');const edit=state==='edit';
  if(state==='pending') return `<div class="page">${pageHead(c.title,'Изпратено е за преглед.')}<div class="shell form-wrap"><div class="notice"><strong>Чака преглед.</strong> Ще стане публично след одобрение според правилата за този тип съдържание.</div></div></div>`;
  if(state==='success') return `<div class="page">${pageHead(c.title,'Успешно изпращане.')}<div class="shell form-wrap"><div class="notice ok"><strong>Успешно изпратено.</strong> Това е прототип и не е създаден реален запис.</div><a class="btn" href="#home" style="margin-top:14px">Към началото</a></div></div>`;
  const listingCat=kind==='listing'?listingCategory(query):'';const listingSub=kind==='listing'?listingSubcategory(query):'';const listingType=kind==='listing'?currentForField(kind,'Тип обява',query):'';
  const fields=c.fields.map(([label,type])=>{
    const prefix=kind==='shop'&&label==='Източник на информацията'?shopClassification():'';
    const current=currentForField(kind,label,query);const isListingSubcategory=kind==='listing'&&label==='Подкатегория / вид';const subRequired=isListingSubcategory&&listingSubcategoryRequired(query);const required=(fieldRequired(kind,label)||subRequired)?'required':'';const editText=edit?editFieldValue(kind,label):'';const limits=kind==='question'&&label==='Заглавие на въпроса'?'minlength="10" maxlength="120"':kind==='listing'&&label==='Заглавие'?'minlength="5" maxlength="120"':(kind==='question'||kind==='listing')&&label==='Описание'?'minlength="20"':'';
    const displayLabel=kind==='shop'&&label==='Какво предлага'?'Кратко описание на магазина':label;
    if(type==='textarea'){
      const hint=kind==='question'?questionPlaceholder('Описание',query):kind==='listing'?listingTextHints(listingCat,listingType,listingSub)[1]:'Опиши най-важното ясно и конкретно';
      const textValue=edit?editText:current;
      return prefix+`<div class="field"><label>${esc(displayLabel)}</label><textarea rows="5" ${required} ${limits} placeholder="${esc(hint)}">${esc(textValue)}</textarea></div>`;
    }
    if(type==='select'){
      const wrapperId=isListingSubcategory?'id="listing-subcategory-field"':'';const hidden=isListingSubcategory&&!subRequired?'hidden':'';const disabled=isListingSubcategory&&!subRequired?'disabled':'';const shopCat=kind==='shop'&&label==='Категория'?'id="shop-category"':'';
      return prefix+`<div class="field" ${wrapperId} ${hidden}><label>${esc(displayLabel)}</label><select ${required} ${disabled} ${shopCat} ${kind==='listing'&&label==='Категория'?'id="listing-category"':''} ${isListingSubcategory?'id="listing-subcategory"':''} ${kind==='listing'&&label==='Тип обява'?'id="listing-type"':''}>${selectOptions(optionsFor(kind,label,query),current)}</select></div>`;
    }
    const isTitle=['Заглавие','Заглавие на въпроса'].includes(label);let placeholder='';
    if(type==='tel') placeholder='Напр. 0876 123 456';
    else if(kind==='question'&&isTitle) placeholder=questionPlaceholder('Заглавие на въпроса',query);
    else if(kind==='listing'&&isTitle) placeholder=listingTextHints(listingCat,listingType,listingSub)[0];
    else if(label.includes('Град')) placeholder='Лом';
    else if(label.includes('Улица')||label.includes('Адрес')) placeholder='Напр. ул. Дунавска 12';
    else if(label.includes('Работно време')) placeholder='Напр. Пон–Пет: 8:00–18:00';
    const numeric=type==='number'?'min="0" step="0.01"':'';const phone=type==='tel'?'pattern="[0-9+ ()-]{6,20}"':'';const shopPhone=kind==='shop'&&label==='Телефон'?'id="shop-phone" data-shop-phone aria-describedby="shop-phone-error"':'';
    const inputValue=edit?editText:current;
    const field=`<div class="field"><label>${esc(displayLabel)}</label><input type="${type}" ${required} ${limits} ${numeric} ${phone} ${shopPhone} value="${esc(inputValue)}" placeholder="${esc(placeholder)}">${shopPhone?'<p class="help" id="shop-phone-error" aria-live="polite"></p>':''}</div>`;
    const priceOptions=kind==='listing'&&label==='Цена в евро'?'<div class="form-inline-options"><label><input type="checkbox"> Договаряне</label><label><input type="checkbox"> Подарява (безплатно)</label></div>':'';
    return prefix+field+priceOptions;
  }).join('');
  const animalVisible=kind==='listing'&&listingCat==='Животни';const animalWarning=kind==='listing'?`<div class="notice danger" id="animal-warning" ${animalVisible?'':'hidden'}><strong>За живи животни:</strong> платена продажба не се предлага. „Продава“ е допустимо само при „Стоки за животни“.</div>`:'';
  const mappingNote=kind==='listing'&&listingCat==='Услуги'&&query.get('subcategory')&&query.get('subcategory')!==listingSub?`<div class="notice"><strong>Избрана услуга:</strong> ${esc(query.get('subcategory'))}. Ще бъде публикувана в група <strong>${esc(listingSub)}</strong>.</div>`:'';
  const listingExtras=kind==='listing'?`<section class="upload-demo"><div><strong>Снимки</strong><span data-upload-count>0 / 6</span></div><p>Първата снимка е главна. До 6 снимки · JPG, PNG или WebP.</p><label class="btn upload-button">Избери снимки<input type="file" accept="image/jpeg,image/png,image/webp" multiple data-demo-upload data-max-files="6" hidden></label></section>`:'';
  const firmExtras=kind==='firm'?`<section class="upload-demo"><div><strong>Лого (по желание)</strong><span data-upload-count>0 / 1</span></div><p>JPG, PNG или WebP · до 10 MB.</p><label class="btn upload-button">Избери лого<input type="file" accept="image/jpeg,image/png,image/webp" data-demo-upload data-max-files="1" hidden></label></section><section class="upload-demo"><div><strong>Снимки на обекти и услуги</strong><span data-upload-count>0 / 6</span></div><p>До 6 снимки в основния профил.</p><label class="btn upload-button">Избери снимки<input type="file" accept="image/jpeg,image/png,image/webp" multiple data-demo-upload data-max-files="6" hidden></label></section>`:'';
  const terms=['listing','question'].includes(kind)?'<div class="field check-field"><label><input type="checkbox" required> Прочетох и приемам правилата на общността</label></div>':'';
  const editNote=edit?`<div class="notice">${kind==='firm'?'<strong>Редакция на запазен фирмен профил.</strong> Запазените стойности са попълнени във формата. Ако изчистиш незадължително поле, промяната ще бъде изпратена за одобрение.':'<strong>Редакция на примерен запазен запис.</strong> Запазените стойности имат приоритет пред параметрите за нова публикация.'}</div>`:'';
  return `<div class="page">${pageHead(edit?`Редактирай — ${c.title}`:c.title,c.subtitle)}<div class="shell form-wrap">${animalWarning}${mappingNote}${editNote}<form class="proto-form" data-proto-form data-form-kind="${kind}" novalidate>${fields}${listingExtras}${firmExtras}${terms}<div class="form-actions"><button class="btn primary" type="submit">${edit?'Изпрати редакцията':kind==='health'?'Изпрати за одобрение':'Изпрати за преглед'}</button><a class="btn" href="#home">Отказ</a></div><div class="form-message" aria-live="polite"></div></form></div></div>`;
}
function staticPage(title,text){return `<div class="page">${pageHead(title,text)}<div class="shell"><div class="content-card"><p>${esc(text)}</p></div></div></div>`;}
