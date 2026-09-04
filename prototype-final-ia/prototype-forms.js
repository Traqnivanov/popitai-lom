'use strict';

const listingCategories=['Електроника','Дом и градина','Дрехи и обувки','Деца и бебета','Спорт и хоби','Автомобили и МПС','Животни','Работа','Имоти','Услуги','Друго'];
const firmCategories=['Майстори и ремонти','Здраве и лекари','Автомобили','Магазини и покупки','Заведения','Работа и услуги'];
const questionCategories=['Майстори и ремонти','Здраве и лекари','Автомобили','Магазини и покупки','Заведения','Работа и услуги','Обяви','Събития и град'];
const stage2=window.PopitaiPrototypeStage2||{};
const formConfig={
  listing:{title:'Добави обява',subtitle:'Публикувай продажба, търсене, работа, имот или услуга.',fields:[['Заглавие','text'],['Категория','select'],['Подкатегория / вид','select'],['Тип обява','select'],['Описание','textarea'],['Цена в евро','number'],['Телефон','tel'],['Град / район','text'],['Улица (по желание)','text']]},
  firm:{title:'Добави фирма',subtitle:'Създай постоянен профил на местна фирма или доставчик.',fields:[['Име на фирмата','text'],['Категория','select'],['Телефон','tel'],['Град (по желание)','text'],['Адрес (по желание)','text'],['Работно време (по желание)','text'],['Описание','textarea']]},
  shop:{title:'Добави магазин',subtitle:'Предложи местен магазин за преглед и публикуване.',fields:[['Име на магазина','text'],['Категория','select'],['Телефон','tel'],['Адрес в Лом','text'],['Работно време','text'],['Кратко описание на магазина','textarea'],['Източник на информацията','select'],['Уточнение за източника (по желание)','text']]},
  health:{title:'Добави лекар / здравна услуга',subtitle:'Предложи лекар, стоматолог или ветеринар през специализирания здравен поток.',fields:[['Тип','select'],['Име на лекар / практика','text'],['Специалност / основна услуга','text'],['Телефон','tel'],['Адрес в Лом','text'],['Кратко описание','textarea']]},
  question:{title:'Задай въпрос',subtitle:'Опиши ясно какво търсиш, за да получиш полезни отговори.',fields:[['Заглавие на въпроса','text'],['Категория','select'],['Описание','textarea']]}
};

function selectOptions(values,current=''){
  return '<option value="">Избери</option>'+values.map(v=>`<option value="${esc(v)}" ${String(v)===String(current)?'selected':''}>${esc(v)}</option>`).join('');
}
function listingCategory(query){return query.get('state')==='edit'?editValue('listing','Категория'):(query.get('category')||'');}
function listingSubcategories(category){return [...(stage2.listingSubcategories?.[category]||[])];}
function listingSubcategoryRequired(category){return listingSubcategories(category).length>0;}
function listingTypes(category,subcategory=''){
  if(category==='Работа') return ['Предлага работа','Търси работа'];
  if(category==='Имоти') return ['Продава имот','Отдава под наем','Търси под наем','Търси за купуване'];
  if(category==='Животни') return subcategory?(stage2.animalTypes?.[subcategory]||[]):[];
  return ['Продава','Купува','Търси','Дава'];
}
function healthOwnerTypeFromQuery(query){
  const raw=query.get('type')||'';
  return stage2.healthDiscoveryToOwner?.[raw]||raw;
}
function optionsFor(kind,label,query){
  if(kind==='listing'&&label==='Категория') return listingCategories;
  if(kind==='listing'&&label==='Подкатегория / вид') return listingSubcategories(listingCategory(query));
  if(kind==='listing'&&label==='Тип обява') return listingTypes(listingCategory(query),currentForField(kind,'Подкатегория / вид',query));
  if(kind==='firm'&&label==='Категория') return firmCategories;
  if(kind==='question'&&label==='Категория') return questionCategories;
  if(kind==='shop'&&label==='Категория') return shopGroups;
  if(kind==='shop'&&label==='Източник на информацията') return ['Собственик / управител','Служител','Клиент / посетител','Публичен източник','Друго'];
  if(kind==='health'&&label==='Тип') return stage2.healthOwnerTypes||['Лекар','Стоматолог','Ветеринар'];
  return ['Примерна стойност','Друго'];
}
function editFieldValue(kind,label){
  if(kind==='shop'&&label==='Кратко описание на магазина') return editValue('shop','Какво предлага');
  const value=editValue(kind,label);
  if(kind==='question'&&label==='Категория'&&value==='Услуги') return 'Работа и услуги';
  if(kind==='health'&&label==='Тип'&&value==='Специалисти') return 'Лекар';
  return value;
}
function currentForField(kind,label,query){
  if(query.get('state')==='edit') return editFieldValue(kind,label);
  if(kind==='health'&&label==='Тип') return healthOwnerTypeFromQuery(query);
  if(kind!=='listing') return label==='Категория'?(query.get('category')||''):'';
  if(label==='Категория') return query.get('category')||'';
  if(label==='Подкатегория / вид') return query.get('subcategory')||'';
  if(label==='Тип обява') return query.get('type')||'';
  return '';
}
function shopClassification(){
  const groups=stage2.shopTagGroups||[];
  const options=groups.map(group=>`<div class="shop-tag-group"><strong>${esc(group.label)}</strong><div class="shop-tag-options">${group.tags.map(tag=>`<label><input type="checkbox" name="shop_tags" value="${esc(tag)}"> ${esc(tag)}</label>`).join('')}</div></div>`).join('');
  return `<fieldset class="field shop-classification"><legend>Какво ще намерят клиентите? — по желание</legend><p class="help">Избери едно или повече подходящи уточнения. Основната категория остава една.</p>${options}<label for="shop-custom-tag">Друго</label><input id="shop-custom-tag" name="custom_tag" maxlength="80" placeholder="Добави уточнение само ако подходящ таг липсва"></fieldset>`;
}
function listingTitlePlaceholder(category,subcategory,type){
  if(category==='Услуги') return type==='Търси'?`Напр. Търся ${subcategory||'услуга'} в Лом`:`Напр. Предлагам ${subcategory||'услуги'} в Лом`;
  if(category==='Работа') return type==='Търси работа'?'Напр. Търся работа като шофьор в Лом':'Напр. Търсим шофьор за доставки в Лом';
  if(category==='Имоти'){
    if(type==='Търси под наем') return `Напр. Търся ${subcategory||'имот'} под наем в Лом`;
    if(type==='Търси за купуване') return `Напр. Търся ${subcategory||'имот'} за покупка в Лом`;
    if(type==='Отдава под наем') return `Напр. Отдавам ${subcategory||'имот'} под наем в Лом`;
    return `Напр. Продавам ${subcategory||'имот'} в Лом`;
  }
  if(category==='Автомобили и МПС') return subcategory==='Части, гуми и аксесоари'?'Напр. Продавам комплект зимни гуми':'Напр. Продавам автомобил в Лом';
  if(category==='Животни'){
    if(subcategory==='Осиновяване / търси дом') return 'Напр. Котка търси дом в Лом';
    if(subcategory==='Изгубени') return 'Напр. Изгубено куче в Лом';
    if(subcategory==='Намерени') return 'Напр. Намерено куче в Лом';
    if(subcategory==='Стоки за животни') return 'Напр. Продавам клетка за домашен любимец';
  }
  return stage2.listingTitleHints?.[category]||'Напр. Продавам запазен велосипед в Лом';
}
function textareaPlaceholder(kind,label,query){
  if(kind==='question'&&label==='Описание') return 'Добави подробности, за да получиш по-точен отговор';
  if(kind==='listing'&&label==='Описание'){
    const category=listingCategory(query);
    const subcategory=currentForField(kind,'Подкатегория / вид',query);
    const type=currentForField(kind,'Тип обява',query);
    return stage2.listingDescriptionHint?.(category,subcategory,type)||'Опиши най-важното ясно и конкретно.';
  }
  if(kind==='shop'&&label==='Кратко описание на магазина') return 'Опиши накратко магазина и какво основно предлага.';
  if(kind==='firm'&&label==='Описание') return 'Опиши услугите, дейността и най-важното за клиентите.';
  if(kind==='health'&&label==='Кратко описание') return 'Кратка публична информация за практиката или услугата.';
  return 'Опиши най-важното ясно и конкретно';
}
function fieldHelp(kind,label,query){
  if(kind==='health'&&label==='Тип'&&(query.get('type')==='Лични лекари'||query.get('type')==='Специалисти')) return '<p class="help">„Лични лекари“ и „Специалисти“ са начини за откриване. Записът остава тип „Лекар“, а конкретиката се попълва в специалността.</p>';
  if(kind==='listing'&&label==='Подкатегория / вид'){
    const cat=listingCategory(query);
    if(cat==='Услуги') return '<p class="help">Показва се каноничната категория, към която се записва избраната конкретна услуга.</p>';
  }
  return '';
}
function formPage(kind,query){
  const c=formConfig[kind]||formConfig.listing;const state=query.get('state');const edit=state==='edit';
  if(state==='pending') return `<div class="page">${pageHead(c.title,'Изпратено е за преглед.')}<div class="shell form-wrap"><div class="notice"><strong>Чака преглед.</strong> Ще стане публично след одобрение според правилата за този тип съдържание.</div></div></div>`;
  if(state==='success') return `<div class="page">${pageHead(c.title,'Успешно изпращане.')}<div class="shell form-wrap"><div class="notice ok"><strong>Успешно изпратено.</strong> Това е прототип и не е създаден реален запис.</div><a class="btn" href="#home" style="margin-top:14px">Към началото</a></div></div>`;
  const listingCat=kind==='listing'?listingCategory(query):'';
  const fields=c.fields.map(([label,type])=>{
    const prefix=kind==='shop'&&label==='Източник на информацията'?shopClassification():'';
    const current=currentForField(kind,label,query);
    const isListingSubcategory=kind==='listing'&&label==='Подкатегория / вид';
    const hasSubcategories=isListingSubcategory&&listingSubcategoryRequired(listingCat);
    const required=(fieldRequired(kind,label)||hasSubcategories)?'required':'';
    const editText=edit?editFieldValue(kind,label):'';
    const limits=kind==='question'&&label==='Заглавие на въпроса'?'minlength="10" maxlength="120"':kind==='listing'&&label==='Заглавие'?'minlength="5" maxlength="120"':(kind==='question'||kind==='listing')&&label==='Описание'?'minlength="20"':'';
    const help=fieldHelp(kind,label,query);
    if(type==='textarea') return prefix+`<div class="field"><label>${esc(label)}</label><textarea rows="5" ${required} ${limits} placeholder="${esc(textareaPlaceholder(kind,label,query))}">${esc(editText)}</textarea>${help}</div>`;
    if(type==='select'){
      const wrapperId=isListingSubcategory?'id="listing-subcategory-field"':'';
      const hidden=isListingSubcategory&&!hasSubcategories?'hidden':'';
      const disabled=isListingSubcategory&&!hasSubcategories?'disabled':'';
      const shopCat=kind==='shop'&&label==='Категория'?'id="shop-category"':'';
      return prefix+`<div class="field" ${wrapperId} ${hidden}><label>${esc(label)}</label><select ${required} ${disabled} ${shopCat} ${kind==='listing'&&label==='Категория'?'id="listing-category"':''} ${isListingSubcategory?'id="listing-subcategory"':''} ${kind==='listing'&&label==='Тип обява'?'id="listing-type"':''}>${selectOptions(optionsFor(kind,label,query),current)}</select>${help}</div>`;
    }
    const category=kind==='listing'?listingCat:(query.get('category')||'');
    const subcategory=kind==='listing'?currentForField(kind,'Подкатегория / вид',query):'';
    const listingType=kind==='listing'?currentForField(kind,'Тип обява',query):'';
    const isTitle=['Заглавие','Заглавие на въпроса'].includes(label);
    let placeholder='';
    if(type==='tel') placeholder='Напр. 0876 123 456';
    else if(kind==='question'&&label==='Заглавие на въпроса') placeholder='Например: Кой препоръчва добър електротехник?';
    else if(isTitle&&kind==='listing') placeholder=listingTitlePlaceholder(category,subcategory,listingType);
    else if(label.includes('Град')) placeholder='Лом';
    else if(label.includes('Улица')) placeholder='Напр. ул. Дунавска 12';
    else if(label.includes('Адрес')) placeholder='Напр. ул. Дунавска 12';
    else if(label.includes('Работно време')) placeholder='Напр. Пон–Пет: 8:00–18:00';
    else if(kind==='health'&&label==='Специалност / основна услуга') placeholder='Въведи специалност или основна услуга';
    const numeric=type==='number'?'min="0" step="0.01"':'';
    const phone=type==='tel'?'pattern="[0-9+ ()-]{6,20}"':'';
    const shopPhone=kind==='shop'&&label==='Телефон'?'id="shop-phone" data-shop-phone aria-describedby="shop-phone-error"':'';
    const field=`<div class="field"><label>${esc(label)}</label><input type="${type}" ${required} ${limits} ${numeric} ${phone} ${shopPhone} value="${esc(editText)}" placeholder="${esc(placeholder)}">${shopPhone?'<p class="help" id="shop-phone-error" aria-live="polite"></p>':''}${help}</div>`;
    const priceOptions=kind==='listing'&&label==='Цена в евро'?'<div class="form-inline-options"><label><input type="checkbox"> Договаряне</label><label><input type="checkbox"> Подарява (безплатно)</label></div>':'';
    return prefix+field+priceOptions;
  }).join('');
  const animalVisible=kind==='listing'&&currentForField(kind,'Категория',query)==='Животни';
  const animalWarning=kind==='listing'?`<div class="notice danger" id="animal-warning" ${animalVisible?'':'hidden'}><strong>За живи животни:</strong> платена продажба не се предлага. „Продава“ е допустимо само при „Стоки за животни“.</div>`:'';
  const listingExtras=kind==='listing'?`<section class="upload-demo"><div><strong>Снимки</strong><span data-upload-count>0 / 6</span></div><p>Първата снимка е главна. До 6 снимки · JPG, PNG или WebP.</p><label class="btn upload-button">Избери снимки<input type="file" accept="image/jpeg,image/png,image/webp" multiple data-demo-upload data-max-files="6" hidden></label></section>`:'';
  const firmExtras=kind==='firm'?`<section class="upload-demo"><div><strong>Лого (по желание)</strong><span data-upload-count>0 / 1</span></div><p>JPG, PNG или WebP · до 10 MB.</p><label class="btn upload-button">Избери лого<input type="file" accept="image/jpeg,image/png,image/webp" data-demo-upload data-max-files="1" hidden></label></section><section class="upload-demo"><div><strong>Снимки на обекти и услуги</strong><span data-upload-count>0 / 6</span></div><p>До 6 снимки в основния профил.</p><label class="btn upload-button">Избери снимки<input type="file" accept="image/jpeg,image/png,image/webp" multiple data-demo-upload data-max-files="6" hidden></label></section>`:'';
  const terms=['listing','question'].includes(kind)?'<div class="field check-field"><label><input type="checkbox" required> Прочетох и приемам правилата на общността</label></div>':'';
  const editNote=edit?'<div class="notice"><strong>Редакция на примерен запазен запис.</strong> Запазените стойности имат приоритет пред параметрите за нова публикация.</div>':'';
  return `<div class="page">${pageHead(edit?`Редактирай — ${c.title}`:c.title,c.subtitle)}<div class="shell form-wrap">${animalWarning}${editNote}<form class="proto-form" data-proto-form data-form-kind="${kind}" novalidate>${fields}${listingExtras}${firmExtras}${terms}<div class="form-actions"><button class="btn primary" type="submit">${edit?'Изпрати редакцията':kind==='health'?'Изпрати за одобрение':'Изпрати за преглед'}</button><a class="btn" href="#home">Отказ</a></div><div class="form-message" aria-live="polite"></div></form></div></div>`;
}
function staticPage(title,text){return `<div class="page">${pageHead(title,text)}<div class="shell"><div class="content-card"><p>${esc(text)}</p></div></div></div>`;}
