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
function listingDiscovery(query){return query.get('discovery')||'';}
function listingSubcategory(query){
  const cat=listingCategory(query);
  if(cat!=='Услуги') return '';
  if(query.get('state')==='edit') return editValue('listing','Подкатегория / вид')||'';
  const raw=query.get('subcategory')||listingDiscovery(query)||'';
  return stage2?.serviceCanonical(raw)||raw;
}
function listingSubcategoryOptions(query){return stage2?.listingSubcategories(listingCategory(query))||[];}
function listingSubcategoryRequired(query){return listingCategory(query)==='Услуги';}
function healthVisibleType(raw){
  if(['Лични лекари','Специалисти','Лекари','doctor'].includes(raw)) return 'Лекар';
  if(['Стоматолози','dentist'].includes(raw)) return 'Стоматолог';
  if(['Ветеринари','vet'].includes(raw)) return 'Ветеринар';
  return healthOwnerTypes.includes(raw)?raw:'';
}
function optionsFor(kind,label,query){
  if(kind==='listing'&&label==='Категория') return listingCategories;
  if(kind==='listing'&&label==='Подкатегория / вид') return listingSubcategoryOptions(query);
  if(kind==='listing'&&label==='Тип обява') return stage2?.listingTypes(listingCategory(query))||['Продава','Купува','Търси','Дава'];
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
  if(label==='Тип обява') return query.get('type')||'';
  return '';
}

function fieldKey(kind,index){return `${kind}-field-${index}`;}
function fieldError(id){return `<p class="field-error" id="${id}-error" aria-live="polite"></p>`;}

function tagCheckbox(tag,selected=[]){return `<label class="tag-choice"><input type="checkbox" name="shop_tags" value="${esc(tag)}" ${selected.includes(tag)?'checked':''}> <span>${esc(tag)}</span></label>`;}
function shopClassification(category='',selected=[]){
  if(!category) return `<fieldset class="field shop-classification" id="shop-tags-fieldset"><legend>Какво ще намерят клиентите?</legend><p class="help">Първо избери основна категория. След това ще покажем най-подходящите уточнения.</p><label for="shop-custom-tag">Друго</label><input id="shop-custom-tag" name="custom_tag" maxlength="80" placeholder="Само ако подходящо уточнение липсва"></fieldset>`;
  const {primary,other}=stage2?.shopTagsForCategory(category)||{primary:[],other:[]};
  return `<fieldset class="field shop-classification" id="shop-tags-fieldset"><legend>Какво ще намерят клиентите?</legend><p class="help">Най-подходящите за „${esc(category)}“ са първи. Смесен магазин може да избере и от „Други предложения“.</p><div class="tag-grid">${primary.map(tag=>tagCheckbox(tag,selected)).join('')}</div><details class="other-tags"><summary>Други предложения</summary><div class="tag-grid">${other.map(tag=>tagCheckbox(tag,selected)).join('')}</div></details><label for="shop-custom-tag">Друго</label><input id="shop-custom-tag" name="custom_tag" maxlength="80" placeholder="Само ако подходящо уточнение липсва"></fieldset>`;
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
function listingTextHints(cat,type,discovery,canonical){
  const exact=discovery||canonical||'';
  if(cat==='Услуги') return type==='Търси'?[`Напр. Търся ${exact?exact.toLocaleLowerCase('bg-BG'):'услуга'} в Лом`,`Опиши какво точно ти трябва за „${exact||'услугата'}“, район, срок и важни условия.`]:[`Напр. Предлагам ${exact?exact.toLocaleLowerCase('bg-BG'):'услуга'} в Лом`,`Опиши какво включва „${exact||'услугата'}“, район, срокове и важни условия.`];
  if(cat==='Работа') return type==='Търси работа'?[`Напр. Търся работа${exact?` — ${exact}`:''} в Лом`,'Опиши опит, квалификация, наличност и каква работа търсиш.']:[`Напр. Предлагаме работа${exact?` — ${exact}`:''} в Лом`,'Опиши длъжност, график, изисквания и условия.'];
  if(cat==='Имоти') return [`Напр. ${exact||'Имот'} в Лом`,'Опиши вида на имота, район, състояние и важни условия за сделката.'];
  if(cat==='Автомобили и МПС') return exact==='Части, гуми и аксесоари'?['Напр. Комплект зимни гуми за автомобил','Опиши състояние, размер/съвместимост и важни детайли.']:[`Напр. ${exact||'Автомобил'} в Лом`,'Опиши марка, модел, година, състояние и важни подробности.'];
  if(cat==='Животни') return exact==='Осиновяване / търси дом'?['Напр. Котка търси дом в Лом','Опиши животното, възраст, характер и условията за осиновяване.']:exact==='Изгубени'?['Напр. Изгубено куче в Лом','Опиши кога и къде е изгубено, отличителни белези и контакт.']:exact==='Намерени'?['Напр. Намерено куче в Лом','Опиши кога и къде е намерено и отличителните белези.']:['Напр. Обява за животни или стоки за животни','Опиши ясно какво публикуваш и важните подробности.'];
  return ['Напр. Продавам запазен велосипед в Лом','Опиши състояние, размери, важни особености и условия.'];
}

function discoveryContext(kind,query){
  if(kind!=='listing') return '';
  const discovery=listingDiscovery(query);
  if(!discovery) return '';
  return `<section class="discovery-context" aria-label="Избран контекст"><span>Избрано</span><strong>${esc(discovery)}</strong><p>Този избор остава видим по целия път до формата.</p></section>`;
}
function adapterPreview(kind,query){
  if(kind!=='listing') return '';
  const category=listingCategory(query);const discovery=listingDiscovery(query);const subcategory=listingSubcategory(query);const type=currentForField('listing','Тип обява',query);
  if(!category) return '';
  const payload=stage2?.compatibilityAdapter({category,discovery,type,subcategory})||{category,subcategory:'',listing_type:type};
  return `<details class="qa-adapter"><summary>Техническа проверка на съвместимостта</summary><p>Това не е потребителско поле и не променя базата.</p><code>category=${esc(payload.category||'—')} · subcategory=${esc(payload.subcategory||'—')} · listing_type=${esc(payload.listing_type||'—')}</code>${category!=='Услуги'&&discovery?`<p>„${esc(discovery)}“ остава discovery контекст и не се представя като записана подкатегория.</p>`:''}</details>`;
}

function formPage(kind,query){
  const c=formConfig[kind]||formConfig.listing;const state=query.get('state');const edit=state==='edit';
  if(state==='pending') return `<div class="page">${pageHead(c.title,'Изпратено е за преглед.')}<div class="shell form-wrap"><div class="notice"><strong>Чака преглед.</strong> Ще стане публично след одобрение според правилата за този тип съдържание.</div></div></div>`;
  if(state==='success') return `<div class="page">${pageHead(c.title,'Успешно изпращане.')}<div class="shell form-wrap"><div class="notice ok"><strong>Успешно изпратено.</strong> Това е прототип и не е създаден реален запис.</div><a class="btn" href="#home" style="margin-top:14px">Към началото</a></div></div>`;
  const listingCat=kind==='listing'?listingCategory(query):'';const listingSub=kind==='listing'?listingSubcategory(query):'';const discovery=kind==='listing'?listingDiscovery(query):'';const listingType=kind==='listing'?currentForField(kind,'Тип обява',query):'';
  let fieldIndex=0;
  const fields=c.fields.map(([label,type])=>{
    const index=fieldIndex++;const id=fieldKey(kind,index);const errorId=`${id}-error`;
    const prefix=kind==='shop'&&label==='Източник на информацията'?`<div id="shop-classification-slot">${shopClassification(currentForField('shop','Категория',query))}</div>`:'';
    const current=currentForField(kind,label,query);const isListingSubcategory=kind==='listing'&&label==='Подкатегория / вид';const subRequired=isListingSubcategory&&listingSubcategoryRequired(query);const required=(fieldRequired(kind,label)||subRequired)?'required':'';const editText=edit?editFieldValue(kind,label):'';const limits=kind==='question'&&label==='Заглавие на въпроса'?'minlength="10" maxlength="120"':kind==='listing'&&label==='Заглавие'?'minlength="5" maxlength="120"':(kind==='question'||kind==='listing')&&label==='Описание'?'minlength="20"':'';
    const displayLabel=kind==='shop'&&label==='Какво предлага'?'Кратко описание на магазина':label;
    if(type==='textarea'){
      const hint=kind==='question'?questionPlaceholder('Описание',query):kind==='listing'?listingTextHints(listingCat,listingType,discovery,listingSub)[1]:'Опиши най-важното ясно и конкретно';
      const textValue=edit?editText:current;
      return prefix+`<div class="field"><label for="${id}">${esc(displayLabel)}</label><textarea id="${id}" name="${esc(label)}" rows="5" ${required} ${limits} aria-describedby="${errorId}" placeholder="${esc(hint)}">${esc(textValue)}</textarea>${fieldError(id)}</div>`;
    }
    if(type==='select'){
      const hidden=isListingSubcategory&&!subRequired?'hidden':'';const disabled=isListingSubcategory&&!subRequired?'disabled':'';
      return prefix+`<div class="field" ${isListingSubcategory?'id="listing-subcategory-field"':''} ${hidden}><label for="${id}">${esc(displayLabel)}</label><select id="${isListingSubcategory?'listing-subcategory':kind==='listing'&&label==='Категория'?'listing-category':kind==='listing'&&label==='Тип обява'?'listing-type':kind==='shop'&&label==='Категория'?'shop-category':id}" data-field-id="${id}" name="${esc(label)}" ${required} ${disabled} aria-describedby="${errorId}">${selectOptions(optionsFor(kind,label,query),current)}</select>${fieldError(id)}</div>`;
    }
    const isTitle=['Заглавие','Заглавие на въпроса'].includes(label);let placeholder='';
    if(type==='tel') placeholder='Напр. 0876 123 456';
    else if(kind==='question'&&isTitle) placeholder=questionPlaceholder('Заглавие на въпроса',query);
    else if(kind==='listing'&&isTitle) placeholder=listingTextHints(listingCat,listingType,discovery,listingSub)[0];
    else if(label.includes('Град')) placeholder='Лом';
    else if(label.includes('Улица')||label.includes('Адрес')) placeholder='Напр. ул. Дунавска 12';
    else if(label.includes('Работно време')) placeholder='Напр. Пон–Пет: 8:00–18:00';
    const numeric=type==='number'?'min="0" step="0.01"':'';const phone=type==='tel'?'inputmode="tel"':'';const shopPhone=kind==='shop'&&label==='Телефон'?'data-shop-phone':'';
    const inputValue=edit?editText:current;
    const field=`<div class="field"><label for="${id}">${esc(displayLabel)}</label><input id="${id}" name="${esc(label)}" type="${type}" ${required} ${limits} ${numeric} ${phone} ${shopPhone} value="${esc(inputValue)}" aria-describedby="${errorId}" placeholder="${esc(placeholder)}">${fieldError(id)}</div>`;
    const priceOptions=kind==='listing'&&label==='Цена в евро'?'<div class="form-inline-options"><label><input type="checkbox" name="negotiable"> Договаряне</label><label><input type="checkbox" name="free"> Подарява (безплатно)</label></div>':'';
    return prefix+field+priceOptions;
  }).join('');
  const animalVisible=kind==='listing'&&listingCat==='Животни';const animalWarning=kind==='listing'?`<div class="notice" id="animal-warning" ${animalVisible?'':'hidden'}><strong>Обяви за животни:</strong> следвай избрания контекст и правилата на сайта. Този прототип не променя действащия backend договор.</div>`:'';
  const listingExtras=kind==='listing'?`<section class="upload-demo"><div><strong>Снимки</strong><span data-upload-count>0 / 6</span></div><p>Първата снимка е главна. До 6 снимки · JPG, PNG или WebP.</p><label class="btn upload-button">Избери снимки<input type="file" accept="image/jpeg,image/png,image/webp" multiple data-demo-upload data-max-files="6" hidden></label></section>`:'';
  const firmExtras=kind==='firm'?`<section class="upload-demo"><div><strong>Лого (по желание)</strong><span data-upload-count>0 / 1</span></div><p>JPG, PNG или WebP · до 10 MB.</p><label class="btn upload-button">Избери лого<input type="file" accept="image/jpeg,image/png,image/webp" data-demo-upload data-max-files="1" hidden></label></section><section class="upload-demo"><div><strong>Снимки на обекти и услуги</strong><span data-upload-count>0 / 6</span></div><p>До 6 снимки в основния профил.</p><label class="btn upload-button">Избери снимки<input type="file" accept="image/jpeg,image/png,image/webp" multiple data-demo-upload data-max-files="6" hidden></label></section>`:'';
  const terms=['listing','question'].includes(kind)?'<div class="field check-field"><label for="community-terms"><input id="community-terms" name="community_terms" type="checkbox" required aria-describedby="community-terms-error"> Прочетох и приемам правилата на общността</label><p class="field-error" id="community-terms-error" aria-live="polite"></p></div>':'';
  const editNote=edit?`<div class="notice">${kind==='firm'?'<strong>Редакция на запазен фирмен профил.</strong> Запазените стойности са попълнени във формата. Ако изчистиш незадължително поле, промяната ще бъде изпратена за одобрение.':'<strong>Редакция на примерен запазен запис.</strong> Запазените стойности имат приоритет пред параметрите за нова публикация.'}</div>`:'';
  return `<div class="page">${pageHead(edit?`Редактирай — ${c.title}`:c.title,c.subtitle)}<div class="shell form-wrap">${discoveryContext(kind,query)}${animalWarning}${editNote}<form class="proto-form" data-proto-form data-form-kind="${kind}" data-discovery-context="${esc(discovery)}" novalidate>${fields}${listingExtras}${firmExtras}${terms}<div class="form-actions"><button class="btn primary" type="submit">${edit?'Изпрати редакцията':kind==='health'?'Изпрати за одобрение':'Изпрати за преглед'}</button><a class="btn" href="#home">Отказ</a></div><div class="form-message" role="status" aria-live="polite"></div></form>${adapterPreview(kind,query)}</div></div>`;
}
function staticPage(title,text){return `<div class="page">${pageHead(title,text)}<div class="shell"><div class="content-card"><p>${esc(text)}</p></div></div></div>`;}
