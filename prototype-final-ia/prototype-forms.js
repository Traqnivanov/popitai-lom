'use strict';

const listingCategories=['Електроника','Дом и градина','Дрехи и обувки','Деца и бебета','Спорт и хоби','Автомобили и МПС','Животни','Работа','Имоти','Услуги','Друго'];
const firmCategories=['Майстори и ремонти','Здраве и лекари','Автомобили','Магазини и покупки','Заведения','Работа и услуги'];
const questionCategories=['Майстори и ремонти','Здраве и лекари','Автомобили','Магазини и покупки','Заведения','Работа и услуги','Обяви','Събития и град'];

const formConfig={
  listing:{title:'Добави обява',subtitle:'Публикувай продажба, търсене, работа, имот или услуга.',fields:[['Заглавие','text'],['Категория','select'],['Подкатегория / вид','select'],['Тип обява','select'],['Описание','textarea'],['Цена в евро','number'],['Телефон','tel'],['Град / район','text'],['Улица (по желание)','text']]},
  firm:{title:'Добави фирма',subtitle:'Създай постоянен профил на местна фирма или доставчик.',fields:[['Име на фирмата','text'],['Категория','select'],['Телефон','tel'],['Град (по желание)','text'],['Адрес (по желание)','text'],['Работно време (по желание)','text'],['Описание','textarea']]},
  shop:{title:'Добави магазин',subtitle:'Предложи местен магазин за преглед и публикуване.',fields:[['Име на магазина','text'],['Категория','select'],['Телефон','tel'],['Адрес в Лом','text'],['Работно време','text'],['Какво предлага','textarea'],['Източник на информацията','select'],['Уточнение за източника (по желание)','text']]},
  health:{title:'Добави лекар / здравна услуга',subtitle:'Предложи лекар, специалист, стоматолог или ветеринар.',fields:[['Тип','select'],['Име на лекар / практика','text'],['Специалност / основна услуга','text'],['Телефон','tel'],['Адрес в Лом','text'],['Кратко описание','textarea']]},
  question:{title:'Задай въпрос',subtitle:'Опиши ясно какво търсиш, за да получиш полезни отговори.',fields:[['Заглавие на въпроса','text'],['Категория','select'],['Описание','textarea']]}
};

function selectOptions(values,current=''){
  return '<option value="">Избери</option>'+values.map(v=>`<option value="${esc(v)}" ${String(v)===String(current)?'selected':''}>${esc(v)}</option>`).join('');
}

function listingCategory(query){
  return query.get('state')==='edit' ? editValue('listing','Категория') : (query.get('category')||'');
}

function optionsFor(kind,label,query){
  if(kind==='listing'&&label==='Категория') return listingCategories;
  if(kind==='listing'&&label==='Подкатегория / вид'){
    return listingCategory(query)==='Услуги' ? serviceFamilies.flatMap(x=>x.slice(1)) : [];
  }
  if(kind==='listing'&&label==='Тип обява'){
    const cat=listingCategory(query);
    if(cat==='Работа') return ['Предлага работа','Търси работа'];
    if(cat==='Имоти') return ['Продава имот','Отдава под наем','Търси под наем','Търси за купуване'];
    if(cat==='Животни') return ['Осиновяване','Изгубено','Намерено','Стоки за животни'];
    return ['Продава','Купува','Търси','Дава'];
  }
  if(kind==='firm'&&label==='Категория') return firmCategories;
  if(kind==='question'&&label==='Категория') return questionCategories;
  if(kind==='shop'&&label==='Категория') return shopGroups;
  if(kind==='shop'&&label==='Източник на информацията') return ['Собственик / управител','Служител','Клиент / посетител','Публичен източник','Друго'];
  if(kind==='health'&&label==='Тип') return healthGroups;
  return ['Примерна стойност','Друго'];
}

function editFieldValue(kind,label){
  const value=editValue(kind,label);
  if(kind==='question'&&label==='Категория'&&value==='Услуги') return 'Работа и услуги';
  return value;
}

function currentForField(kind,label,query){
  if(query.get('state')==='edit') return editFieldValue(kind,label);
  if(kind!=='listing') return label==='Категория'?(query.get('category')||''):'';
  if(label==='Категория') return query.get('category')||'';
  if(label==='Подкатегория / вид') return listingCategory(query)==='Услуги'?(query.get('subcategory')||''):'';
  if(label==='Тип обява') return query.get('type')||'';
  return '';
}

function formPage(kind,query){
  const c=formConfig[kind]||formConfig.listing;
  const state=query.get('state');
  const edit=state==='edit';
  if(state==='pending') return `<div class="page">${pageHead(c.title,'Изпратено е за преглед.')}<div class="shell form-wrap"><div class="notice"><strong>Чака преглед.</strong> Ще стане публично след одобрение според правилата за този тип съдържание.</div></div></div>`;
  if(state==='success') return `<div class="page">${pageHead(c.title,'Успешно изпращане.')}<div class="shell form-wrap"><div class="notice ok"><strong>Успешно изпратено.</strong> Това е прототип и не е създаден реален запис.</div><a class="btn" href="#home" style="margin-top:14px">Към началото</a></div></div>`;

  const listingCat=kind==='listing'?listingCategory(query):'';
  const fields=c.fields.map(([label,type])=>{
    const current=currentForField(kind,label,query);
    const isListingSubcategory=kind==='listing'&&label==='Подкатегория / вид';
    const serviceSubcategory=isListingSubcategory&&listingCat==='Услуги';
    const required=(fieldRequired(kind,label)||serviceSubcategory)?'required':'';
    const editText=edit?editFieldValue(kind,label):'';
    const limits=kind==='question'&&label==='Заглавие на въпроса'?'minlength="10" maxlength="120"':kind==='listing'&&label==='Заглавие'?'minlength="5" maxlength="120"':(kind==='question'||kind==='listing')&&label==='Описание'?'minlength="20"':'';
    if(type==='textarea') return `<div class="field"><label>${esc(label)}</label><textarea rows="5" ${required} ${limits} placeholder="Опиши най-важното ясно и конкретно">${esc(editText)}</textarea></div>`;
    if(type==='select') {
      const wrapperId=isListingSubcategory?'id="listing-subcategory-field"':'';
      const hidden=isListingSubcategory&&!serviceSubcategory?'hidden':'';
      const disabled=isListingSubcategory&&!serviceSubcategory?'disabled':'';
      return `<div class="field" ${wrapperId} ${hidden}><label>${esc(label)}</label><select ${required} ${disabled} ${kind==='listing'&&label==='Категория'?'id="listing-category"':''} ${isListingSubcategory?'id="listing-subcategory"':''} ${kind==='listing'&&label==='Тип обява'?'id="listing-type"':''}>${selectOptions(optionsFor(kind,label,query),current)}</select></div>`;
    }

    const cat=edit&&kind==='listing'?editFieldValue(kind,'Категория'):(query.get('category')||'');
    const examples={'Животни':'Напр. Котка търси дом в Лом','Услуги':'Напр. Предлагам ВиК услуги в Лом','Работа':'Напр. Търсим шофьор за доставки','Имоти':'Напр. Продавам двустаен апартамент в Лом','Автомобили и МПС':'Напр. Продавам автомобил в Лом'};
    const isTitle=['Заглавие','Заглавие на въпроса'].includes(label);
    const placeholder=type==='tel'?'Напр. 0876 123 456':isTitle?(examples[cat]||(kind==='question'?'Напр. Кой препоръчва добър електротехник?':'Напр. Продавам запазен велосипед в Лом')):label.includes('Град')?'Лом':label.includes('Улица')?'Напр. ул. Дунавска 12':label.includes('Адрес')?'Напр. ул. Дунавска 12':label.includes('Работно време')?'Напр. Пон–Пет: 8:00–18:00':'';
    const numeric=type==='number'?'min="0" step="0.01"':'';
    const phone=type==='tel'?'pattern="[0-9+ ()-]{6,20}"':'';
    const field=`<div class="field"><label>${esc(label)}</label><input type="${type}" ${required} ${limits} ${numeric} ${phone} value="${esc(editText)}" placeholder="${esc(placeholder)}"></div>`;
    const priceOptions=kind==='listing'&&label==='Цена в евро'?'<div class="form-inline-options"><label><input type="checkbox"> Договаряне</label><label><input type="checkbox"> Подарява (безплатно)</label></div>':'';
    return field+priceOptions;
  }).join('');

  const animalVisible=kind==='listing'&&currentForField(kind,'Категория',query)==='Животни';
  const animalWarning=kind==='listing'?`<div class="notice danger" id="animal-warning" ${animalVisible?'':'hidden'}><strong>За живи животни:</strong> платена продажба не се предлага. Достъпни са осиновяване, изгубени/намерени и стоки.</div>`:'';
  const listingExtras=kind==='listing'?`<section class="upload-demo"><div><strong>Снимки</strong><span data-upload-count>0 / 6</span></div><p>Първата снимка е главна. До 6 снимки · JPG, PNG или WebP.</p><label class="btn upload-button">Избери снимки<input type="file" accept="image/jpeg,image/png,image/webp" multiple data-demo-upload data-max-files="6" hidden></label></section>`:'';
  const firmExtras=kind==='firm'?`<section class="upload-demo"><div><strong>Лого (по желание)</strong><span data-upload-count>0 / 1</span></div><p>JPG, PNG или WebP · до 10 MB.</p><label class="btn upload-button">Избери лого<input type="file" accept="image/jpeg,image/png,image/webp" data-demo-upload data-max-files="1" hidden></label></section><section class="upload-demo"><div><strong>Снимки на обекти и услуги</strong><span data-upload-count>0 / 6</span></div><p>До 6 снимки в основния профил.</p><label class="btn upload-button">Избери снимки<input type="file" accept="image/jpeg,image/png,image/webp" multiple data-demo-upload data-max-files="6" hidden></label></section>`:'';
  const terms=['listing','question'].includes(kind)?'<div class="field check-field"><label><input type="checkbox" required> Прочетох и приемам правилата на общността</label></div>':'';
  const editNote=edit?'<div class="notice"><strong>Редакция на примерен запазен запис.</strong> Запазените стойности имат приоритет пред параметрите за нова публикация.</div>':'';
  return `<div class="page">${pageHead(edit?`Редактирай — ${c.title}`:c.title,c.subtitle)}<div class="shell form-wrap">${animalWarning}${editNote}<form class="proto-form" data-proto-form data-form-kind="${kind}" novalidate>${fields}${listingExtras}${firmExtras}${terms}<div class="form-actions"><button class="btn primary" type="submit">${edit?'Изпрати редакцията':kind==='health'?'Изпрати за одобрение':'Изпрати за преглед'}</button><a class="btn" href="#home">Отказ</a></div><div class="form-message" aria-live="polite"></div></form></div></div>`;
}

function staticPage(title,text){return `<div class="page">${pageHead(title,text)}<div class="shell"><div class="content-card"><p>${esc(text)}</p><p>Съдържанието тук ще използва действащите текстове и правила при реалната интеграция.</p></div></div></div>`;}
