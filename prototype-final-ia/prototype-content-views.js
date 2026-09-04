'use strict';

function info(){return `<div class="page">${pageHead('Инфо Лом','Проверена местна информация с източник и дата на последна проверка.')}<div class="shell"><div class="grid cols-3">${['Здраве','Транспорт','Институции','Образование','Комунални услуги','Полезни телефони'].map((x,i)=>`<a class="info-card" href="#detail/info"><h3>${['⚕️','🚌','🏛️','🎓','💡','☎️'][i]} ${x}</h3><p>Контакти, работно време, услуги, източник и последна проверка.</p></a>`).join('')}</div></div></div>`;}

function firms(query){return `<div class="page">${pageHead('Фирми','Постоянни местни профили. Фирмата не е обява.')}<div class="shell"><div class="page-tools"><a class="btn primary" href="#add/firm">＋ Добави фирма</a></div><div class="section-head" style="margin-top:24px"><div><h2>Фирмени профили</h2><p>Показват постоянна фирмена информация и реалните налични канали за контакт.</p></div></div>${stateContent(query,`<div class="result-list">${demoRow('Фирма за ремонти — демо','Постоянен профил с услуги, район и контакти.','Фирма','#detail/firm','Майстори')}${demoRow('Местен сервиз — демо','Постоянен фирмен профил, който може да се открива и през „Автомобили“.','Фирма','#detail/firm','Автомобили')}</div>`)}</div></div>`;}
function current(){return `<div class="page">${pageHead('Актуално','Кратки местни публикации и предстоящи събития на едно място.')}<div class="shell"><div class="grid cols-2"><a class="content-card" href="#detail/publication"><span class="demo-label">ПРИМЕР</span><h3><span class="badge gold">Публикация</span> Кратка местна актуализация</h3><p>Една конкретна промяна, полезно съобщение или местна тема — кратко и ясно.</p><small class="card-link">Прочети →</small></a><a class="content-card" href="#detail/event"><span class="demo-label">ПРИМЕР</span><h3><span class="badge green">Събитие</span> Предстоящо местно събитие</h3><p>При реален запис тук се виждат най-важните дата, час и място.</p><small class="card-link">Виж събитието →</small></a></div></div></div>`;}

function articles(){return `<div class="page">${pageHead('Статии','Пълни практични ръководства с местната информация на първо място.')}<div class="shell"><div class="result-list">${demoRow('Как да решиш конкретна местна задача','Пълно ръководство: какво се прави в Лом, подготовка, изключения и проверени източници.','Статия','#detail/article','Ръководство')}${demoRow('Практично ръководство за местна услуга','Демонстрира дългосрочно полезно съдържание за търсачки, не кратка публикация.','Статия','#detail/article','Местната информация първо')}</div></div></div>`;}
function questions(){return `<div class="page">${pageHead('Въпроси','Помощ от общността, когато няма готов отговор.')}<div class="shell"><div class="page-tools"><a class="btn primary" href="#add/question">＋ Задай въпрос</a></div><div class="result-list" style="margin-top:18px">${demoRow('Къде мога да намеря…?','Примерен въпрос. Отговорът от общността не се представя като проверена информация.','Въпрос','#detail/question','Общност')}</div></div></div>`;}

function shareOptions(title,description){
  return `<div class="share-demo-options page-tools" hidden><button class="btn soft" type="button" data-demo-facebook data-share-title="${esc(title)}" data-share-description="${esc(description)}">Facebook</button><button class="btn soft" type="button" data-demo-copy>Копирай линк</button></div>`;
}
function contentActions(kind,title,description){
  const share=`<button class="btn" type="button" data-demo-share data-share-title="${esc(title)}" data-share-description="${esc(description)}">Сподели</button>${shareOptions(title,description)}`;
  if(kind==='listing') return `<div class="content-actions"><button class="btn primary" type="button" data-demo-contact>Обади се</button>${share}<button class="btn soft" type="button" data-demo-report>Подай сигнал</button><p class="action-demo-message" aria-live="polite"></p></div>`;
  if(kind==='firm') return `<div class="content-actions"><button class="btn primary" type="button" data-demo-contact>Обади се</button><button class="btn" type="button" data-demo-contact>Запитване</button>${share}<button class="btn soft" type="button" data-demo-report>Подай сигнал</button><p class="action-demo-message" aria-live="polite"></p></div>`;
  if(kind==='shop') return `<div class="content-actions"><button class="btn primary" type="button" data-demo-contact>Обади се</button>${share}<p class="action-demo-message" aria-live="polite"></p></div>`;
  if(kind==='health') return `<div class="content-actions"><button class="btn primary" type="button" data-demo-contact>Обади се</button>${share}<button class="btn soft" type="button" data-demo-correction>Сигнализирай грешка</button><p class="action-demo-message" aria-live="polite"></p></div>`;
  if(kind==='info') return `<div class="content-actions"><button class="btn primary" type="button" data-demo-contact>Официална страница / услуга</button>${share}<button class="btn soft" type="button" data-demo-correction>Сигнализирай за грешка</button><p class="action-demo-message" aria-live="polite"></p></div>`;
  if(kind==='question') return `<div class="content-actions"><button class="btn primary" type="button" data-demo-answer>Добави отговор</button>${share}<button class="btn soft" type="button" data-demo-report>Докладвай</button><p class="action-demo-message" aria-live="polite"></p></div>`;
  if(kind==='article') return `<div class="content-actions"><a class="btn primary" href="#info">Към свързаната полезна информация</a>${share}<p class="action-demo-message" aria-live="polite"></p></div>`;
  if(kind==='publication') return `<div class="content-actions">${share}<p class="action-demo-message" aria-live="polite"></p></div>`;
  if(kind==='event') return `<div class="content-actions">${share}<p class="action-demo-message" aria-live="polite"></p></div>`;
  return '';
}

function shopResultCard(group,index){
  return `<article class="result-row"><div><span class="demo-label">ПРОТОТИПЕН ЗАПИС</span><h3>${esc(group)} — пример ${index}</h3><p>Основната информация за магазина се вижда директно в каталога.</p><div class="result-meta"><span class="badge">Магазин</span><span class="badge gold">Лом</span></div></div><div class="page-tools"><button class="btn primary" type="button" data-demo-contact>Покажи контакт</button><a class="btn soft" href="#detail/shop">Отвори</a></div><p class="contact-demo-message" aria-live="polite"></p></article>`;
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
    : `${demoRow(`${group} — пример 1`,`Най-важната информация се вижда още в списъка.`,context,`#detail/${detailType}`,'Пример')}${demoRow(`${group} — пример 2`,`Втори примерен запис с различни примерни данни.`,context,`#detail/${detailType}`,'Пример')}`;
  const primaryLabel=owner==='Shops'?'＋ Добави магазин':owner==='Health/Info'?'＋ Добави лекар / здравна услуга':'＋ Публикувай в тази категория';
  return `<div class="page">${pageHead(group,`Разгледай ${noun} в „${context}“.`,'Обяви и услуги')}<div class="shell"><div class="result-list">${rows}</div><div class="page-tools"><a class="btn primary" href="${addTarget}">${primaryLabel}</a><a class="btn" href="#add/question">Не намираш? Задай въпрос</a></div></div></div>`;
}

function detail(kind){
  const map={
    listing:{title:'Примерна обява',type:'Обява',desc:'Публичната обява показва най-важното без излишни технически подробности.',heading:'Предлагам ВиК услуги в Лом',body:'ВиК ремонти и аварийни услуги в Лом и региона. При реален запис тук се виждат само публикуваните и одобрени данни.',rows:[['Категория','Услуги'],['Подкатегория','ВиК'],['Район','Лом'],['Цена','По договаряне']]},
    firm:{title:'Примерен фирмен профил',type:'Фирма',desc:'Постоянен профил с услуги, район, контакти и работно време.',heading:'Примерен местен фирмен профил',body:'Профилът представя фирмата постоянно, а конкретните обяви остават отделни.',rows:[['Категория','Майстори и ремонти'],['Район','Лом'],['Работно време','Показва се при реален запис']]},
    shop:{title:'Примерен магазин',type:'Магазин',desc:'Постоянна публична страница на магазин с основна категория, уточнения и контакт.',heading:'Примерен местен магазин',body:'Основната категория е една, а контролирани тагове помагат да се разбере какво ще намерят клиентите.',rows:[['Категория','Хранителни'],['Какво ще намерят клиентите','Хранителни стоки · Напитки'],['Адрес','Показва се при реален запис']]},
    article:{title:'Примерна статия',type:'Статия',desc:'Пълно практично ръководство с местната информация на първо място.',heading:'Как да решиш конкретна задача в Лом',body:'Статията започва с практичната местна стъпка, след това дава подготовка, важни изключения и проверени източници.',rows:[['Вид','Ръководство'],['Фокус','Лом и региона'],['Източници','Посочват се в реалната статия']]},
    publication:{title:'Примерна публикация',type:'Публикация',desc:'Кратка конкретна местна актуализация.',heading:'Кратка местна актуализация',body:'Публикацията има една ясна причина да съществува. Когато само представя съществуваща статия, за външно споделяне се използва URL на оригиналната статия.',rows:[['Вид','Публикация'],['Тема','Местна актуализация']]},
    event:{title:'Примерно събитие',type:'Събитие',desc:'Предстоящо местно събитие с ясни дата, час и място.',heading:'Предстоящо местно събитие',body:'При реален запис тук се показват описанието, организаторът и само актуалната публична информация.',rows:[['Дата и час','Показват се при реален запис'],['Място','Показва се при реален запис'],['Официален линк','Само ако реално съществува']]},
    question:{title:'Примерен въпрос',type:'Въпрос',desc:'Помощ от общността, когато няма готов отговор.',heading:'Къде в Лом мога да намеря…?',body:'Отговорите от общността са ясно различени от проверената информация в Инфо Лом.',rows:[['Категория','Общност'],['Отговори','Показват се само реалните']]},
    health:{title:'Примерен здравен профил',type:'Здраве',desc:'Лекар, стоматолог или ветеринар в специализирания здравен раздел.',heading:'Примерен здравен профил',body:'При реален запис тук се виждат специалност, кабинет, публичен контакт и последно потвърдена информация.',rows:[['Тип','Лекар'],['Специалност','Показва се при реален запис'],['Последно потвърдено','Показва се при реален запис']]},
    info:{title:'Примерен запис в Инфо Лом',type:'Инфо',desc:'Проверена местна справочна информация с източник и последна проверка.',heading:'Примерен справочен запис',body:'При реален запис тук се показват точният контакт, работното време, услугите, източникът и датата на последна проверка.',rows:[['Източник','Показва се при реален запис'],['Последно проверено','Показва се при реален запис']]}
  };
  const c=map[kind]||map.listing;
  const gallery = ['listing','firm'].includes(kind)?`<div class="gallery-demo"><div>Основна снимка</div><div>Снимка</div><div>Снимка</div></div>`:'';
  const rows=c.rows.map(([k,v])=>`<div class="kv"><strong>${esc(k)}</strong><span>${esc(v)}</span></div>`).join('');
  const actions=contentActions(kind,c.heading,c.desc);
  const special=kind==='event'?'<div class="notice">Публично се показват само текущи и предстоящи събития.</div>':kind==='publication'?'<div class="admin-note">Публична форма за добавяне на публикация няма.</div>':kind==='info'?'<div class="notice ok">Всеки реален запис показва източник и дата на последна проверка.</div>':'';
  return `<div class="page">${pageHead(c.title,c.desc)}<div class="shell detail"><article class="detail-main"><span class="demo-label">ПРИМЕР — НЕ Е РЕАЛНО СЪДЪРЖАНИЕ</span><h2>${esc(c.heading)}</h2>${gallery}<h3>Описание</h3><p>${esc(c.body)}</p></article><aside class="detail-side">${rows}<div class="detail-action">${actions}${special}</div></aside></div></div>`;
}
