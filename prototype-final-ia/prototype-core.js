'use strict';

const marketplace = [
  {id:'uslugi', icon:'🛠️', title:'Услуги', desc:'Майстори, почистване, транспорт, техника, грижи и още.'},
  {id:'stoki', icon:'🛍️', title:'Купува и продава', desc:'Стоки за дома, техника, дрехи, хоби и оборудване.'},
  {id:'rabota', icon:'💼', title:'Работа', desc:'Предлага и търси работа по ясни местни направления.'},
  {id:'imoti', icon:'🏠', title:'Имоти', desc:'Продажба, наем, покупка и търсене на имот.'},
  {id:'avtomobili', icon:'🚗', title:'Автомобили', desc:'МПС, части и автомобилни услуги на едно място.'},
  {id:'zhivotni', icon:'🐾', title:'Животни', desc:'Осиновяване, изгубени/намерени и стоки за животни.'}
];

const specialist = [
  {id:'magazini',icon:'🏪',title:'Магазини'},
  {id:'zavedenia',icon:'🍽️',title:'Заведения'},
  {id:'zdrave',icon:'⚕️',title:'Здраве и лекари'}
];

const serviceFamilies = [
  ['Майстори, ремонти и дом','Цялостни ремонти','Бани и плочки','ВиК','Електро','Покриви','Шпакловка и боядисване','Дограма и врати','Климатици','Монтажи и мебели','Къртене и извозване'],
  ['Почистване и поддръжка','Почистване на дом','Офиси и входове','Мека мебел и килими','Двор и градина','Озеленяване','Борба с вредители','Домашна помощ'],
  ['Автомобилни услуги','Автосервиз','Диагностика','Гуми','Автоелектро и автоклиматици','Автомивка и детайлинг','Пътна помощ'],
  ['Транспорт, преместване и доставки','Товарен транспорт','Хамали','Преместване','Доставки','Бус и камион'],
  ['Красота и лична грижа','Фризьор и бръснар','Маникюр и педикюр','Козметични услуги','Грим','Немедицински масаж'],
  ['Грижа за хора и животни','Детегледачки','Грижа за възрастни','Домашни помощници','Гледане на любимци','Разходка на кучета','Груминг'],
  ['Обучение, уроци и спорт','Частни уроци','Езици','Шофьорски курсове','Професионално обучение','Компютърни курсове','Спорт и танци'],
  ['Техника, дигитални и професионални услуги','Компютри и лаптопи','Телефони и електроника','IT и сайтове','Дизайн','Счетоводство','Правни услуги','Преводи'],
  ['Събития и творчески услуги','Фото','Видео','DJ и музика','Декорация','Кетъринг','Организация на събития']
];

const workGroups = ['Строителство, ремонти и техници','Производство, склад и общи работници','Транспорт, шофьори и доставки','Търговия и продажби','Заведения, хотели и туризъм','Почистване, домашна помощ и грижи','Здраве, красота и социални дейности','Офис, администрация, IT и специалисти','Друга / сезонна работа'];
const propertyKinds = ['Апартамент','Къща / етаж','Парцел','Земеделска земя','Гараж / паркомясто','Бизнес имот','Склад / производствен имот','Друго'];
const goodsGroups = ['Електроника и телефони','Дом и градина','Дрехи, обувки и аксесоари','Деца и бебета','Спорт, хоби и книги','Инструменти и оборудване','Друго'];
const autoGroups = ['Автомобили и джипове','Мотоциклети и ATV','Бусове и камиони','Агро/строителна техника','Ремаркета, каравани и други','Части, гуми и аксесоари','Автомобилни услуги'];
const animalGroups = ['Осиновяване / търси дом','Изгубени','Намерени','Стоки за животни'];
const shopGroups = ['Хранителни','Строителни','Техника','Мебели','Дрехи','Дом'];
const restaurantGroups = ['Ресторанти','Кафенета','Пицарии','Бързо хранене','Сладкарници','Доставка / за вкъщи'];
const healthGroups = ['Лекари','Лични лекари','Специалисти','Стоматолози','Ветеринари'];
const autoListingGroups = autoGroups.filter(x=>x!=='Автомобилни услуги');
const goodsPrefillMap = {
  'Електроника и телефони':['Електроника',''],
  'Дом и градина':['Дом и градина',''],
  'Дрехи, обувки и аксесоари':['Дрехи и обувки',''],
  'Деца и бебета':['Деца и бебета',''],
  'Спорт, хоби и книги':['Спорт и хоби',''],
  'Инструменти и оборудване':['Дом и градина',''],
  'Друго':['Друго','']
};
const servicePrefillMap = {
  'Цялостни ремонти':'Цялостни ремонти','Бани и плочки':'Бани и плочки','ВиК':'ВиК','Електро':'Електро','Покриви':'Покриви','Климатици':'Климатици',
  'Домашна помощ':'Домашна помощ','Красота и лична грижа':'Красота и грижа','Автосервиз':'Автосервизи','Диагностика':'Диагностика','Гуми':'Гуми','Авточасти':'Авточасти','Пътна помощ':'Пътна помощ','Транспорт, преместване и доставки':'Транспорт, преместване и доставки'
};
let propertyType='Продава имот';
const requiredFields={
  listing:new Set(['Заглавие','Категория','Тип обява','Описание','Телефон']),
  firm:new Set(['Име на фирмата','Категория','Телефон','Описание']),
  shop:new Set(['Име на магазина','Категория','Адрес в Лом','Какво предлага','Източник на информацията']),
  health:new Set(['Тип','Име на лекар / практика','Специалност / основна услуга']),
  question:new Set(['Заглавие на въпроса','Категория','Описание'])
};
const icons = ['🔧','🧹','🚘','🚚','✂️','🤝','🎓','💻','📷'];

function parseHash(){
  const raw=(location.hash||'#home').slice(1);const [pathRaw,queryRaw='']=raw.split('?');return {path:pathRaw||'home',query:new URLSearchParams(queryRaw)};
}
function routeLink(id){return `#${id}`;}
function listingAddUrl(category='',subcategory='',type='',discovery=''){
  const q=new URLSearchParams();if(category) q.set('category',category);if(category==='Услуги'&&subcategory) q.set('subcategory',subcategory);if(type) q.set('type',type);if(discovery) q.set('discovery',discovery);return `#add/listing${q.size?`?${q}`:''}`;
}
function resultsAddTarget(context,group,owner,type=''){
  if(owner==='Shops') return `#add/shop?category=${encodeURIComponent(group)}`;
  if(owner==='Health/Info') return `#add/health?type=${encodeURIComponent(group)}`;
  if(context==='Заведения') return '#add/firm?category=Заведения';
  if(owner==='Firms') return '#add/firm';
  if(context==='Услуги') return listingAddUrl('Услуги',window.PopitaiStage2Contracts?.serviceCanonical(group)||servicePrefillMap[group]||'',type,group);
  if(context==='Работа') return listingAddUrl('Работа','',type||'Предлага работа',group);
  if(context==='Имоти') return listingAddUrl('Имоти','',type||'Продава имот',group);
  if(context==='Купува и продава') {const [category]=goodsPrefillMap[group]||['Друго'];return listingAddUrl(category,'','',group);}
  if(context==='Автомобили'){if(group==='Автомобилни услуги') return '#uslugi';return listingAddUrl('Автомобили и МПС','','',group);}
  if(context==='Животни'){const suggested=window.PopitaiStage2Contracts?.animalSuggestedTypeByDiscovery?.[group]||'';return listingAddUrl('Животни','',suggested,group);}
  return listingAddUrl(context,'','',group);
}
function propertyResultsHref(kind){
  const q=new URLSearchParams({context:'Имоти',group:kind,detail:'listing',owner:'Listings',type:propertyType});return `#results?${q}`;
}
function serviceResultsHref(name){
  const q=new URLSearchParams({context:'Услуги',group:name,detail:'listing',owner:'Listings'});return `#results?${q}`;
}
function serviceSearchMatch(text=''){
  const q=text.toLocaleLowerCase('bg-BG').trim();if(!q) return '';const concrete=serviceFamilies.flatMap(f=>f.slice(1));
  return concrete.find(name=>{const n=name.toLocaleLowerCase('bg-BG');return n.includes(q)||q.includes(n)||q.split(/\s+/).some(part=>part.length>3&&n.includes(part));})||'';
}
function fieldRequired(kind,label){return requiredFields[kind]?.has(label)||false;}
function editValue(kind,label){
  const data={
    listing:{'Заглавие':'ПРОТОТИП — запазена обява','Категория':'Дом и градина','Подкатегория / вид':'','Тип обява':'Продава','Описание':'Примерен запазен текст за проверка на редакция без загуба на въведени данни.','Цена в евро':'25','Телефон':'0876 123 456','Град / район':'Лом','Улица (по желание)':'Примерна улица 1'},
    firm:{'Име на фирмата':'ПРОТОТИП — местна фирма','Категория':'Майстори и ремонти','Телефон':'0876 123 456','Град (по желание)':'Лом','Адрес (по желание)':'Примерен адрес','Работно време (по желание)':'Пон–Пет: 8:00–18:00','Описание':'Примерно запазено описание на фирмен профил.'},
    shop:{'Име на магазина':'ПРОТОТИП — местен магазин','Категория':'Хранителни','Телефон':'','Адрес в Лом':'Примерен адрес','Работно време':'','Какво предлага':'Примерно описание на предлаганите стоки.','Източник на информацията':'Клиент / посетител','Уточнение за източника (по желание)':'Информация на място'},
    health:{'Тип':'Специалисти','Име на лекар / практика':'ПРОТОТИП — здравен профил','Специалност / основна услуга':'Примерна специалност','Телефон':'','Адрес в Лом':'','Кратко описание':'Примерен запазен текст.'},
    question:{'Заглавие на въпроса':'ПРОТОТИП — примерен запазен въпрос','Категория':'Услуги','Описание':'Примерно запазено описание на въпрос към общността.'}
  };return data[kind]?.[label]??'';
}
function ownerLabel(value){return ({Listings:'Обяви',Firms:'Фирми',Shops:'Магазини','Health/Info':'Здраве / Инфо Лом',Events:'Събития',Publications:'Публикации',Questions:'Въпроси','Info Lom':'Инфо Лом','Editorial/Articles':'Статии'})[value]||value;}
function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function card(item){return `<a class="category-card" href="${routeLink(item.id)}"><div class="icon">${item.icon}</div><h3>${item.title}</h3><p>${item.desc}</p><small>Разгледай →</small></a>`;}
function pageHead(title,desc,crumbs='Начало'){return `<div class="shell page-head"><div class="breadcrumbs"><a href="#home">Начало</a> · ${crumbs==='Начало'?esc(title):`${esc(crumbs)} · ${esc(title)}`}</div><h1>${esc(title)}</h1><p>${esc(desc)}</p></div>`;}
function demoRow(title,desc,type='Обява',href='#detail/listing',extra='Лом'){return `<article class="result-row"><div><span class="demo-label">ПРОТОТИПЕН ЗАПИС</span><h3>${esc(title)}</h3><p>${esc(desc)}</p><div class="result-meta"><span class="badge">${esc(type)}</span><span class="badge gold">${esc(extra)}</span></div></div><a class="btn soft" href="${href}">Отвори</a></article>`;}
function stateContent(query,normal){
  const state=query.get('state');
  if(state==='loading') return `<div class="state-box"><strong>Зареждане…</strong>Показва се стабилно състояние за зареждане без стар интерфейс под него.</div>`;
  if(state==='empty') return `<div class="state-box"><strong>Няма резултати</strong>Промени филтъра или публикувай, ако имаш подходящо съдържание.</div>`;
  if(state==='error') return `<div class="state-box"><strong>Не успяхме да заредим съдържанието</strong><p>Данните не се заменят с фалшиви записи.</p><button class="btn" type="button" onclick="location.hash=location.hash.replace('?state=error','')">Опитай отново</button></div>`;
  return normal;
}
