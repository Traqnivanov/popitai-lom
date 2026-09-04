'use strict';

function info(){return `<div class="page">${pageHead('Инфо Лом','Проверена местна информация с източник и дата на последна проверка.')}<div class="shell"><div class="grid cols-3">${['Здраве','Институции','Транспорт','Образование и култура','Банки и банкомати','Комунални услуги'].map((x,i)=>`<a class="info-card" href="#detail/info"><h3>${['⚕️','🏛️','🚌','🎓','🏦','⚡'][i]} ${x}</h3><p>Контакти, работно време, услуги, източник и последна проверка.</p></a>`).join('')}</div></div></div>`;}

function firms(query){return `<div class="page">${pageHead('Фирми','Постоянни местни профили. Фирмата не е обява.')}<div class="shell"><div class="page-tools"><a class="btn primary" href="#add/firm">＋ Добави фирма</a></div><div class="section-head" style="margin-top:24px"><div><h2>Фирмени профили</h2><p>Услуги, район и директни контакти.</p></div></div>${stateContent(query,`<div class="result-list">${demoRow('Фирма за ремонти — демо','Постоянен профил с услуги, район и контакти.','Фирма','#detail/firm','Майстори')}${demoRow('Местен сервиз — демо','Постоянен фирмен профил, който може да се открива и през „Автомобили“.','Фирма','#detail/firm','Автомобили')}</div>`)}</div></div>`;}
function current(){return `<div class="page">${pageHead('Актуално','Кратки местни публикации и предстоящи събития на едно място.')}<div class="shell"><div class="grid cols-2"><a class="content-card" href="#detail/publication"><span class="demo-label">ПРИМЕР</span><h3><span class="badge gold">Публикация</span> Кратка местна актуализация</h3><p>Една конкретна промяна, полезно съобщение или местна тема — кратко и ясно.</p><small class="card-link">Прочети →</small></a><a class="content-card" href="#detail/event"><span class="demo-label">ПРИМЕР</span><h3><span class="badge green">Събитие</span> Предстоящо местно събитие</h3><p>Дата, час и място са водещи още преди отваряне.</p><small class="card-link">Виж събитието →</small></a></div></div></div>`;}

function articles(){return `<div class="page">${pageHead('Статии','Пълни практични ръководства с местната информация на първо място.')}<div class="shell"><div class="result-list">${demoRow('Как да решиш конкретна местна задача','Пълно ръководство: какво се прави в Лом, подготовка, изключения и проверени източници.','Статия','#detail/article','Ръководство')}${demoRow('Практично ръководство за местна услуга','Дългосрочно полезно съдържание, различно от кратка публикация.','Статия','#detail/article','Местната информация първо')}</div></div></div>`;}
function questions(){return `<div class="page">${pageHead('Въпроси','Помощ от общността, когато няма готов отговор.')}<div class="shell"><div class="page-tools"><a class="btn primary" href="#add/question">＋ Задай въпрос</a></div><div class="result-list" style="margin-top:18px">${demoRow('Къде мога да намеря…?','Примерен въпрос. Отговорът от общността не се представя като проверена информация.','Въпрос','#detail/question','Общност')}</div></div></div>`;}

function shareMenu(kind){
  return `<details class="share-menu"><summary class="btn soft">Сподели</summary><div class="content-card" style="margin-top:8px;display:grid;gap:8px;min-width:220px"><button class="btn" type="button" data-demo-share="native">Споделяне от телефона</button><button class="btn" type="button" data-demo-share="facebook">Facebook</button><button class="btn" type="button" data-demo-share="copy">Копирай линк</button><p class="share-demo-message help" aria-live="polite"></p></div></details>`;
}
function correctionButton(label='Сигнализирай грешка'){return `<button class="btn soft" type="button" data-demo-correction>${esc(label)}</button>`;}
function reportButton(){return `<button class="btn soft" type="button" data-demo-report>Подай сигнал</button>`;}
function actionBar(kind){
  if(kind==='listing') return `<div class="detail-action"><button class="btn primary" type="button" data-demo-contact>Обади се</button>${shareMenu(kind)}${reportButton()}<p class="contact-demo-message" aria-live="polite"></p><p class="action-demo-message help" aria-live="polite"></p></div>`;
  if(kind==='firm') return `<div class="detail-action"><button class="btn primary" type="button" data-demo-contact>Обади се</button><button class="btn" type="button" data-demo-inquiry>Запитване</button><button class="btn soft" type="button" data-demo-site>Сайт</button>${shareMenu(kind)}${reportButton()}<p class="contact-demo-message" aria-live="polite"></p><p class="action-demo-message help" aria-live="polite"></p></div>`;
  if(kind==='shop') return `<div class="detail-action"><button class="btn primary" type="button" data-demo-contact>Обади се</button>${shareMenu(kind)}${correctionButton('Предложи корекция')}<p class="contact-demo-message" aria-live="polite"></p><p class="action-demo-message help" aria-live="polite"></p></div>`;
  if(kind==='health') return `<div class="detail-action"><button class="btn primary" type="button" data-demo-contact>Обади се</button>${shareMenu(kind)}${correctionButton()}<p class="contact-demo-message" aria-live="polite"></p><p class="action-demo-message help" aria-live="polite"></p></div>`;
  if(kind==='info') return `<div class="detail-action"><button class="btn primary" type="button" data-demo-contact>Обади се</button><button class="btn" type="button" data-demo-official>Официална страница</button>${shareMenu(kind)}${correctionButton()}<p class="contact-demo-message" aria-live="polite"></p><p class="action-demo-message help" aria-live="polite"></p></div>`;
  if(kind==='question') return `<div class="detail-action"><button class="btn primary" type="button" data-demo-answer>Добави отговор</button>${shareMenu(kind)}${reportButton()}<p class="action-demo-message help" aria-live="polite"></p></div>`;
  if(kind==='article') return `<div class="detail-action"><a class="btn primary" href="#obyavi">Намери услуга</a>${shareMenu(kind)}<p class="action-demo-message help" aria-live="polite"></p></div>`;
  if(kind==='publication') return `<div class="detail-action"><a class="btn primary" href="#aktualno">Към свързаното съдържание</a>${shareMenu(kind)}<p class="action-demo-message help" aria-live="polite"></p></div>`;
  if(kind==='event') return `<div class="detail-action"><button class="btn primary" type="button" data-demo-event-info>Виж дата и място</button>${shareMenu(kind)}<p class="action-demo-message help" aria-live="polite"></p></div>`;
  return '';
}

function socialPreview(kind,c){
  const config={
    listing:{title:c.heading,desc:'Тип, категория, район и кратък откъс от одобрената обява.',image:'Първа одобрена снимка → категория → Попитай.Лом'},
    firm:{title:'Име на фирма — основна услуга в Лом',desc:'Услуги, район и кратко представяне.',image:'Одобрена основна снимка → лого → категория'},
    shop:{title:'Име на магазин — вид магазин в Лом',desc:'Кратко описание и публичен адрес.',image:'Брандирана визуализация за категорията'},
    health:{title:'Име — специалност в Лом',desc:'Специалност и публичен адрес или практика.',image:'Брандирана визуализация за здравния раздел'},
    article:{title:c.heading,desc:'Редакционен откъс от статията.',image:'Основна илюстрация → Попитай.Лом'},
    publication:{title:c.heading,desc:'Собствен кратък текст само когато публикацията има собствен постоянен адрес.',image:'Собствена или свързана одобрена визуализация'},
    event:{title:'Име на събитие + дата',desc:'Място, час и кратко описание.',image:'Афиш или снимка при наличност → брандирана резервна визуализация'},
    question:{title:c.heading,desc:'Категория + „Виж отговорите в Попитай.Лом“',image:'Брандирана визуализация за въпрос'},
    info:{title:c.heading,desc:'Проверена информация за Лом + вид контакт.',image:'Брандирана визуализация за Инфо Лом'}
  }[kind];
  if(!config) return '';
  return `<details class="content-card" style="margin-top:18px"><summary><strong>Преглед при споделяне</strong></summary><div style="margin-top:12px"><div class="demo-label">ПРИМЕРЕН ПРЕГЛЕД ПРИ СПОДЕЛЯНЕ</div><h3>${esc(config.title)}</h3><p>${esc(config.desc)}</p><p class="help"><strong>Снимка:</strong> ${esc(config.image)}</p><p class="help">Използват се само публичната одобрена версия и одобрени изображения. Чакащо одобрение или скрито съдържание не участва.</p></div></details>`;
}

function shopResultCard(group,index){
  return `<article class="result-row"><div><span class="demo-label">ПРОТОТИПЕН ЗАПИС</span><h3><a href="#detail/shop">${esc(group)} — пример ${index}</a></h3><p>Основната информация за магазина се вижда директно в каталога.</p><div class="result-meta"><span class="badge">Магазин</span><span class="badge gold">Лом</span></div></div><button class="btn primary" type="button" data-demo-contact>Обади се</button><p class="contact-demo-message" aria-live="polite"></p></article>`;
}

function results(query){
  const context=query.get('context')||'Обяви и услуги';
  const group=query.get('group')||'Всички';
  const detailType=query.get('detail')||'listing';
  const owner=query.get('owner')||'Listings';
  const type=query.get('type')||'';
  let addTarget=resultsAddTarget(context,group,owner,type);
  if(owner==='Shops') addTarget=`#add/shop?category=${encodeURIComponent(group)}`;
  if(owner==='Health/Info') addTarget=`#add/health?type=${encodeURIComponent(group)}`;
  if(context==='Животни') {
    const animalType={'Осиновяване / търси дом':'Дава','Изгубени':'Търси','Намерени':'Търси','Стоки за животни':'Продава'}[group]||'';
    addTarget=`#add/listing?category=${encodeURIComponent('Животни')}&subcategory=${encodeURIComponent(group)}${animalType?`&type=${encodeURIComponent(animalType)}`:''}`;
  }
  const noun = owner==='Shops'?'магазини':owner==='Firms'?'профили':owner==='Health/Info'?'здравни профили':'обяви';
  const rows=owner==='Shops'
    ? `${shopResultCard(group,1)}${shopResultCard(group,2)}`
    : `${demoRow(`${group} — пример 1`,`Най-важната информация се вижда още в списъка.`,context,`#detail/${detailType}`,'Пример')}${demoRow(`${group} — пример 2`,`Още един примерен запис в същия контекст.`,context,`#detail/${detailType}`,'Пример')}`;
  const primaryLabel=owner==='Shops'?'＋ Добави магазин':owner==='Health/Info'?'＋ Добави лекар / здравна услуга':'＋ Публикувай в тази категория';
  return `<div class="page">${pageHead(group,`Разгледай ${noun} в „${context}“.`,'Обяви и услуги')}<div class="shell"><div class="result-list">${rows}</div><div class="page-tools"><a class="btn primary" href="${addTarget}">${primaryLabel}</a><a class="btn" href="#add/question">Не намираш? Задай въпрос</a></div></div></div>`;
}

function detail(kind){
  const map={
    listing:{title:'Примерна обява',type:'Обява',desc:'Публичната обява показва най-важното без излишни технически подробности.',heading:'Предлагам ВиК услуги в Лом',body:'ВиК ремонти и аварийни услуги в Лом и региона. Реалният запис показва само данните, които потребителят е публикувал и които са одобрени.',rows:[['Категория','Услуги'],['Подкатегория','ВиК'],['Район','Лом'],['Цена','По договаряне']]},
    firm:{title:'Примерен фирмен профил',type:'Фирма',desc:'Постоянен профил с услуги, район, контакти и работно време.',heading:'Примерен местен фирмен профил',body:'Профилът представя фирмата постоянно, а конкретните обяви остават отделни.',rows:[['Категория','Майстори и ремонти'],['Район','Лом'],['Работно време','Показва се при реален запис']]},
    shop:{title:'Примерен магазин',type:'Магазин',desc:'Постоянен профил на местен магазин с основната полезна информация.',heading:'Примерен местен магазин',body:'Основната категория, краткото описание, публичният адрес, работното време и уточненията идват от самия магазин.',rows:[['Категория','Хранителни'],['Адрес','Лом'],['Какво ще намерят клиентите','Хранителни стоки · Напитки']]},
    article:{title:'Примерна статия',type:'Статия',desc:'Пълно практично ръководство с местната информация на първо място.',heading:'Как да решиш конкретна задача в Лом',body:'Статията започва с практичната местна стъпка, след това дава подготовка, важни изключения и проверени източници.',rows:[['Вид','Ръководство'],['Фокус','Лом и региона'],['Източници','Посочват се в реалната статия']]},
    publication:{title:'Примерна публикация',type:'Публикация',desc:'Кратка конкретна местна актуализация.',heading:'Кратка местна актуализация',body:'Публикацията има една ясна причина да съществува и може да води към статия, Инфо Лом, обява, фирма, събитие или въпрос.',rows:[['Вид','Публикация'],['Тема','Местна актуализация']]},
    event:{title:'Примерно събитие',type:'Събитие',desc:'Подробности за предстоящо местно събитие.',heading:'Предстоящо местно събитие',body:'При реален запис тук се показват описанието, организаторът и само актуалната публична информация.',rows:[['Дата и час','12 септември · 18:00'],['Място','Лом']]},
    question:{title:'Примерен въпрос',type:'Въпрос',desc:'Помощ от общността, когато няма готов отговор.',heading:'Къде в Лом мога да намеря добър ВиК майстор?',body:'Отговорите от общността са ясно различени от проверената информация в Инфо Лом.',rows:[['Категория','Майстори и ремонти'],['Отговори','Показват се само реалните']]},
    health:{title:'Примерен здравен профил',type:'Здраве',desc:'Лекар, стоматолог или ветеринар в специализирания здравен раздел.',heading:'Примерен лекар — специалност',body:'При реален запис тук се виждат типът, специалността, кабинетът, публичният контакт и последно потвърдената информация.',rows:[['Тип','Лекар'],['Специалност','Примерна специалност'],['Район','Лом'],['Последно потвърдено','Показва се при реален запис']]},
    info:{title:'Примерен запис в Инфо Лом',type:'Инфо',desc:'Проверена местна справочна информация с източник и последна проверка.',heading:'Примерен справочен запис',body:'При реален запис тук се показват точният контакт, работното време, услугите, източникът и датата на последна проверка.',rows:[['Източник','Показва се при реален запис'],['Последно проверено','Показва се при реален запис']]}
  };
  const c=map[kind]||map.listing;
  const gallery = ['listing','firm'].includes(kind)?`<div class="gallery-demo"><div>Основна снимка</div><div>Снимка</div><div>Снимка</div></div>`:'';
  const rows=c.rows.map(([k,v])=>`<div class="kv"><strong>${esc(k)}</strong><span>${esc(v)}</span></div>`).join('');
  const special=kind==='event'?'<div class="notice">Публично се показват само текущи и предстоящи събития.</div>':kind==='publication'?'<div class="admin-note">Публична форма за добавяне на публикация няма.</div>':kind==='info'?'<div class="notice ok">Всеки реален запис показва източник и дата на последна проверка.</div>':'';
  return `<div class="page">${pageHead(c.title,c.desc)}<div class="shell detail"><article class="detail-main"><span class="demo-label">ПРИМЕР — НЕ Е РЕАЛНО СЪДЪРЖАНИЕ</span><h2>${esc(c.heading)}</h2>${gallery}<h3>Описание</h3><p>${esc(c.body)}</p>${socialPreview(kind,c)}</article><aside class="detail-side">${rows}${actionBar(kind)}${special}</aside></div></div>`;
}
