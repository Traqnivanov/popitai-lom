'use strict';

function info(){
  const items=[
    ['⚕️','Здраве'],['🏛️','Институции'],['🚌','Транспорт'],['🎓','Образование и култура'],['🏦','Банки и банкомати'],['⚡','Комунални услуги']
  ];
  return `<div class="page">${pageHead('Инфо Лом','Проверена местна информация с източник и дата на последна проверка.')}<div class="shell"><div class="grid cols-3">${items.map(([icon,title])=>`<a class="info-card" href="#detail/info"><h3>${icon} ${title}</h3><p>Контакти, работно време, услуги, източник и последна проверка.</p></a>`).join('')}</div></div></div>`;
}

function firms(query){return `<div class="page">${pageHead('Фирми','Постоянни местни профили. Фирмата не е обява.')}<div class="shell"><div class="page-tools"><a class="btn primary" href="#add/firm">＋ Добави фирма</a></div><div class="section-head" style="margin-top:24px"><div><h2>Фирмени профили</h2><p>Услуги, район и директни контакти.</p></div></div>${stateContent(query,`<div class="result-list">${demoRow('Фирма за ремонти — демо','Постоянен профил с услуги, район и контакти.','Фирма','#detail/firm','Майстори')}${demoRow('Местен сервиз — демо','Постоянен фирмен профил, който може да се открива и през „Автомобили“.','Фирма','#detail/firm','Автомобили')}</div>`)}</div></div>`;}
function current(){return `<div class="page">${pageHead('Актуално','Кратки местни публикации и предстоящи събития на едно място.')}<div class="shell"><div class="grid cols-2"><a class="content-card" href="#detail/publication"><span class="demo-label">ПРИМЕР</span><h3><span class="badge gold">Публикация</span> Кратка местна актуализация</h3><p>Една конкретна промяна, полезно съобщение или местна тема — кратко и ясно.</p><small class="card-link">Прочети →</small></a><a class="content-card" href="#detail/event"><span class="demo-label">ПРИМЕР</span><h3><span class="badge green">Събитие</span> Предстоящо местно събитие</h3><p>Дата, час и място са водещи още преди отваряне.</p><small class="card-link">Виж събитието →</small></a></div></div></div>`;}
function articles(){return `<div class="page">${pageHead('Статии','Пълни практични ръководства с местната информация на първо място.')}<div class="shell"><div class="result-list">${demoRow('Как да решиш конкретна местна задача','Пълно ръководство: какво се прави в Лом, подготовка, изключения и проверени източници.','Статия','#detail/article','Ръководство')}${demoRow('Практично ръководство за местна услуга','Дългосрочно полезно съдържание, различно от кратка публикация.','Статия','#detail/article','Местната информация първо')}</div></div></div>`;}
function questions(){return `<div class="page">${pageHead('Въпроси','Помощ от общността, когато няма готов отговор.')}<div class="shell"><div class="page-tools"><a class="btn primary" href="#add/question">＋ Задай въпрос</a></div><div class="result-list" style="margin-top:18px">${demoRow('Къде мога да намеря…?','Примерен въпрос. Отговорът от общността не се представя като проверена информация.','Въпрос','#detail/question','Общност')}</div></div></div>`;}

function listingAddWithDiscovery(category='',subcategory='',type='',discovery=''){
  const q=new URLSearchParams();
  if(category) q.set('category',category);
  if(subcategory) q.set('subcategory',subcategory);
  if(type) q.set('type',type);
  if(discovery) q.set('discovery',discovery);
  return `#add/listing${q.size?`?${q}`:''}`;
}
function stage2AddTarget(context,group,owner,type=''){
  if(owner==='Shops') return `#add/shop?category=${encodeURIComponent(group)}`;
  if(owner==='Health/Info') return `#add/health?type=${encodeURIComponent(group)}`;
  if(context==='Заведения') return '#add/firm?category=Заведения';
  if(owner==='Firms') return '#add/firm';
  if(context==='Услуги') return listingAddWithDiscovery('Услуги',stage2?.serviceCanonical(group)||'',type,group);
  if(context==='Работа') return listingAddWithDiscovery('Работа','',type||'Предлага работа',group);
  if(context==='Имоти') return listingAddWithDiscovery('Имоти','',type||'Продава имот',group);
  if(context==='Купува и продава'){
    const [category]=goodsPrefillMap[group]||['Друго'];
    return listingAddWithDiscovery(category,'','',group);
  }
  if(context==='Автомобили'){
    if(group==='Автомобилни услуги') return '#uslugi';
    return listingAddWithDiscovery('Автомобили и МПС','','',group);
  }
  if(context==='Животни'){
    const suggested=stage2?.animalSuggestedTypeByDiscovery?.[group]||'';
    return listingAddWithDiscovery('Животни','',suggested,group);
  }
  return listingAddWithDiscovery(context,'','',group);
}

function shareMenu(){
  return `<details class="share-menu"><summary class="btn soft">Сподели</summary><div class="share-options"><button class="btn" type="button" data-demo-share="native">Споделяне от телефона</button><button class="btn" type="button" data-demo-share="facebook">Facebook</button><button class="btn" type="button" data-demo-share="copy">Копирай линк</button><p class="share-demo-message help" aria-live="polite"></p></div></details>`;
}
function correctionButton(label='Сигнализирай грешка'){return `<button class="btn soft" type="button" data-demo-correction>${esc(label)}</button>`;}
function reportButton(){return `<button class="btn soft" type="button" data-demo-report>Подай сигнал</button>`;}
function actionBar(c){
  const a=c.actions||{};const parts=[];
  if(a.phone) parts.push('<button class="btn primary" type="button" data-demo-contact>Обади се</button>');
  if(a.inquiry) parts.push('<button class="btn" type="button" data-demo-inquiry>Запитване</button>');
  if(a.site) parts.push('<button class="btn soft" type="button" data-demo-site>Сайт</button>');
  if(a.answer) parts.push('<button class="btn primary" type="button" data-demo-answer>Добави отговор</button>');
  if(a.official) parts.push('<button class="btn" type="button" data-demo-official>Официална страница</button>');
  if(a.relatedHref&&a.relatedLabel) parts.push(`<a class="btn primary" href="${esc(a.relatedHref)}">${esc(a.relatedLabel)}</a>`);
  if(a.share) parts.push(shareMenu());
  if(a.report) parts.push(reportButton());
  if(a.correction) parts.push(correctionButton(a.correctionLabel||'Сигнализирай грешка'));
  if(!parts.length) return '';
  return `<div class="detail-action">${parts.join('')}<p class="contact-demo-message" aria-live="polite"></p><p class="action-demo-message help" aria-live="polite"></p></div>`;
}

function socialPreview(kind,c){
  const config={
    listing:{title:c.heading,desc:'Услуга в Лом и региона. Виж подробности и се свържи с публикувалия.'},
    firm:{title:c.heading,desc:'Местен фирмен профил с услуги, район и директни контакти.'},
    shop:{title:c.heading,desc:'Местен магазин в Лом с адрес и основно предлагане.'},
    health:{title:c.heading,desc:'Здравен профил в Лом със специалност и публичен контакт.'},
    article:{title:c.heading,desc:'Практично ръководство от Попитай.Лом.'},
    publication:{title:c.heading,desc:'Кратка местна актуализация от Попитай.Лом.'},
    event:{title:c.heading,desc:'Дата, място и най-важното за местното събитие.'},
    question:{title:c.heading,desc:'Виж отговорите от общността в Попитай.Лом.'},
    info:{title:c.heading,desc:'Проверена информация за Лом с източник и последна проверка.'}
  }[kind];
  if(!config) return '';
  return `<section class="social-preview-section" aria-label="Пример при споделяне"><h3>Как ще изглежда при споделяне</h3><div class="social-card"><div class="social-card-image" role="img" aria-label="Брандирана резервна снимка за Попитай.Лом"></div><div class="social-card-copy"><small>popitai-lom.bg</small><strong>${esc(config.title)}</strong><p>${esc(config.desc)}</p></div></div><details class="qa-social-note"><summary>Правила за този пример</summary><p>Картата е отделена от QA текста. В реална интеграция се използват само публичната одобрена версия и допустимо одобрено изображение.</p></details></section>`;
}

function shopResultCard(group,index){return `<article class="result-row"><div><span class="demo-label">ПРОТОТИПЕН ЗАПИС</span><h3><a href="#detail/shop">${esc(group)} — пример ${index}</a></h3><p>Основната информация за магазина се вижда директно в каталога.</p><div class="result-meta"><span class="badge">Магазин</span><span class="badge gold">Лом</span></div></div><button class="btn primary" type="button" data-demo-contact>Обади се</button><p class="contact-demo-message" aria-live="polite"></p></article>`;}

function results(query){
  const context=query.get('context')||'Обяви и услуги';const group=query.get('group')||'Всички';const detailType=query.get('detail')||'listing';const owner=query.get('owner')||'Listings';const type=query.get('type')||'';
  const addTarget=stage2AddTarget(context,group,owner,type);
  const noun=owner==='Shops'?'магазини':owner==='Firms'?'профили':owner==='Health/Info'?'здравни профили':'обяви';
  const rows=owner==='Shops'?`${shopResultCard(group,1)}${shopResultCard(group,2)}`:`${demoRow(`${group} — пример 1`,`Резултатът запазва точния избран контекст „${group}“.`,context,`#detail/${detailType}`,'Пример')}${demoRow(`${group} — пример 2`,`Още един примерен запис за „${group}“.`,context,`#detail/${detailType}`,'Пример')}`;
  const primaryLabel=owner==='Shops'?'＋ Добави магазин':owner==='Health/Info'?'＋ Добави лекар / здравна услуга':'＋ Публикувай в тази категория';
  return `<div class="page">${pageHead(group,`Разгледай ${noun} в „${context}“.`,'Обяви и услуги')}<div class="shell"><div class="discovery-context"><span>Избран контекст</span><strong>${esc(group)}</strong></div><div class="result-list">${rows}</div><div class="page-tools"><a class="btn primary" href="${addTarget}">${primaryLabel}</a><a class="btn" href="#add/question">Не намираш? Задай въпрос</a></div></div></div>`;
}

function detail(kind){
  const map={
    listing:{title:'Примерна обява',desc:'Публичната обява показва най-важното без излишни технически подробности.',heading:'Предлагам ВиК услуги в Лом',body:'ВиК ремонти и аварийни услуги в Лом и региона.',rows:[['Категория','Услуги'],['Подкатегория','ВиК'],['Район','Лом'],['Цена','По договаряне']],actions:{phone:true,share:true,report:true}},
    firm:{title:'Примерен фирмен профил',desc:'Постоянен профил с услуги, район, контакти и работно време.',heading:'Примерен местен фирмен профил',body:'Профилът представя фирмата постоянно, а конкретните обяви остават отделни.',rows:[['Категория','Майстори и ремонти'],['Район','Лом'],['Работно време','Показва се при реален запис']],actions:{phone:true,inquiry:true,site:false,share:true,report:true}},
    shop:{title:'Примерен магазин',desc:'Постоянен профил на местен магазин с основната полезна информация.',heading:'Примерен местен магазин',body:'Основната категория, краткото описание, публичният адрес, работното време и уточненията идват от самия магазин.',rows:[['Категория','Хранителни'],['Адрес','Лом'],['Какво ще намерят клиентите','Хранителни стоки · Напитки']],actions:{phone:true,correction:true,share:false}},
    article:{title:'Примерна статия',desc:'Пълно практично ръководство с местната информация на първо място.',heading:'Как да решиш конкретна задача в Лом',body:'Статията започва с практичната местна стъпка, след това дава подготовка, важни изключения и проверени източници.',rows:[['Вид','Ръководство'],['Фокус','Лом и региона'],['Източници','Посочват се в реалната статия']],actions:{share:true}},
    publication:{title:'Примерна публикация',desc:'Кратка конкретна местна актуализация.',heading:'Кратка местна актуализация',body:'Този пример няма зададено свързано съдържание, затова няма бутон „Към свързаното съдържание“.',rows:[['Вид','Публикация'],['Тема','Местна актуализация']],actions:{}},
    event:{title:'Примерно събитие',desc:'Подробности за предстоящо местно събитие.',heading:'Предстоящо местно събитие',body:'При реален запис тук се показват описанието, организаторът и само актуалната публична информация.',rows:[['Дата и час','12 септември · 18:00'],['Място','Лом']],actions:{}},
    question:{title:'Примерен въпрос',desc:'Помощ от общността, когато няма готов отговор.',heading:'Къде в Лом мога да намеря добър ВиК майстор?',body:'Отговорите от общността са ясно различени от проверената информация в Инфо Лом.',rows:[['Категория','Майстори и ремонти'],['Отговори','Показват се само реалните']],actions:{answer:true,share:true,report:true}},
    health:{title:'Примерен здравен профил',desc:'Лекар, стоматолог или ветеринар в специализирания здравен раздел.',heading:'Примерен лекар — специалност',body:'При реален запис тук се виждат типът, специалността, кабинетът, публичният контакт и последно потвърдената информация.',rows:[['Тип','Лекар'],['Специалност','Примерна специалност'],['Район','Лом'],['Последно потвърдено','Показва се при реален запис']],actions:{phone:true,correction:true,share:false}},
    info:{title:'Примерен запис в Инфо Лом',desc:'Проверена местна справочна информация с източник и последна проверка.',heading:'Примерен справочен запис',body:'При реален запис тук се показват точният контакт, работното време, услугите, източникът и датата на последна проверка.',rows:[['Източник','Показва се при реален запис'],['Последно проверено','Показва се при реален запис']],actions:{phone:true,official:true,correction:true,share:true}}
  };
  const c=map[kind]||map.listing;
  const gallery=['listing','firm'].includes(kind)?`<div class="gallery-demo"><div>Основна снимка</div><div>Снимка</div><div>Снимка</div></div>`:'';
  const rows=c.rows.map(([k,v])=>`<div class="kv"><strong>${esc(k)}</strong><span>${esc(v)}</span></div>`).join('');
  const special=kind==='event'?'<div class="notice">Публично се показват само текущи и предстоящи събития.</div>':kind==='publication'?'<div class="admin-note">Публична форма за добавяне на публикация няма.</div>':kind==='info'?'<div class="notice ok">Всеки реален запис показва източник и дата на последна проверка.</div>':'';
  return `<div class="page">${pageHead(c.title,c.desc)}<div class="shell detail"><article class="detail-main"><span class="demo-label">ПРИМЕР — НЕ Е РЕАЛНО СЪДЪРЖАНИЕ</span><h2>${esc(c.heading)}</h2>${gallery}<h3>Описание</h3><p>${esc(c.body)}</p>${socialPreview(kind,c)}</article><aside class="detail-side">${rows}${actionBar(c)}${special}</aside></div></div>`;
}
