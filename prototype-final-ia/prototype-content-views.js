'use strict';

(() => {
  const records=window.PopitaiPrototypeRecords;

  function info(){
    const items=[
      ['⚕️','Здраве','info-health'],
      ['🏛️','Институции','info-institutions'],
      ['🚌','Транспорт','info-transport'],
      ['🎓','Образование и култура','info-education'],
      ['🏦','Банки и банкомати','info-banks'],
      ['⚡','Комунални услуги','info-utilities']
    ];
    return `<div class="page">${pageHead('Инфо Лом','Проверена местна информация с източник и дата на последна проверка.')}<div class="shell"><div class="grid cols-3">${items.map(([icon,title,id])=>`<a class="info-card" href="#detail/info?record=${id}"><h3>${icon} ${title}</h3><p>Проверени записи с източник и дата на последна проверка.</p></a>`).join('')}</div></div></div>`;
  }

  function firms(query){
    const row=demoRow('Фирма за ремонти — демо','Постоянен профил с услуги, район и контакти.','Фирма','#detail/firm?record=firm-repairs','Майстори');
    return `<div class="page">${pageHead('Фирми','Постоянни местни профили. Фирмата не е обява.')}<div class="shell"><div class="page-tools"><a class="btn primary" href="#add/firm">＋ Добави фирма</a></div><div class="section-head" style="margin-top:24px"><div><h2>Фирмени профили</h2><p>Услуги, район и директни контакти.</p></div></div>${stateContent(query,`<div class="result-list">${row}</div>`)}</div></div>`;
  }

  function current(){
    return `<div class="page">${pageHead('Актуално','Местни публикации и предстоящи събития на едно място.')}<div class="shell"><div class="grid cols-2"><a class="content-card" href="#detail/publication?record=publication-update"><span class="demo-label">ПРИМЕР</span><h3><span class="badge gold">Публикация</span> Местна актуализация</h3><p>Местна актуализация с конкретна цел и най-важното на едно място.</p></a><a class="content-card" href="#detail/event?record=event-local"><span class="demo-label">ПРИМЕР</span><h3><span class="badge green">Събитие</span> Предстоящо местно събитие</h3><p>Дата, час и място са водещи.</p></a></div></div></div>`;
  }

  function articles(){
    return `<div class="page">${pageHead('Статии','Пълни практични ръководства с местната информация на първо място.')}<div class="shell"><div class="result-list">${demoRow('Как да решиш конкретна местна задача','Пълно ръководство с местен процес и проверени източници.','Статия','#detail/article?record=article-guide','Ръководство')}</div></div></div>`;
  }

  function questions(){
    return `<div class="page">${pageHead('Въпроси','Помощ от общността, когато няма готов отговор.')}<div class="shell"><div class="page-tools"><a class="btn primary" href="#add/question">＋ Задай въпрос</a></div><div class="result-list" style="margin-top:18px">${demoRow('Къде в Лом мога да намеря добър ВиК майстор?','Примерен въпрос от общността.','Въпрос','#detail/question?record=question-community','Общност')}</div></div></div>`;
  }

  function shareMenu(){
    return `<details class="share-menu"><summary class="btn soft">Сподели</summary><div class="share-options"><button class="btn" type="button" data-demo-share="native">Споделяне от телефона</button><button class="btn" type="button" data-demo-share="facebook">Facebook</button><button class="btn" type="button" data-demo-share="copy">Копирай линк</button><p class="share-demo-message help" aria-live="polite"></p></div></details>`;
  }
  function correctionButton(label='Сигнализирай грешка'){return `<button class="btn soft" type="button" data-demo-correction>${esc(label)}</button>`;}
  function reportButton(){return `<button class="btn soft" type="button" data-demo-report>Подай сигнал</button>`;}

  function actionBar(record){
    const a=record.actions||{};
    const parts=[];
    if(a.phone) parts.push('<button class="btn primary" type="button" data-demo-contact>Обади се</button>');
    if(a.inquiry) parts.push('<button class="btn" type="button" data-demo-inquiry>Запитване</button>');
    if(a.site) parts.push('<button class="btn soft" type="button" data-demo-site>Сайт</button>');
    if(a.answer) parts.push('<button class="btn primary" type="button" data-demo-answer>Добави отговор</button>');
    if(a.official) parts.push('<button class="btn" type="button" data-demo-official>Официална страница</button>');
    if(record.addUrl) parts.push(`<a class="btn primary" href="${record.addUrl}">＋ Добави в същия контекст</a>`);
    if(a.share&&record.social.shareEligible) parts.push(shareMenu());
    if(a.report) parts.push(reportButton());
    if(a.correction) parts.push(correctionButton(a.correctionLabel||'Сигнализирай грешка'));
    return parts.length?`<div class="detail-action">${parts.join('')}<p class="contact-demo-message" aria-live="polite"></p><p class="action-demo-message help" aria-live="polite"></p></div>`:'';
  }

  function detailHrefFor(record,{context,group,owner,type,detailType}){
    if(records.get(record.id)) return `#detail/${record.contentType}?record=${encodeURIComponent(record.id)}`;
    const q=new URLSearchParams({context,group,owner,detail:detailType});
    if(type) q.set('type',type);
    return `#detail/${record.contentType}?${q}`;
  }

  function results(query){
    const context=query.get('context')||'Обяви и услуги';
    const group=query.get('group')||'Всички';
    const detailType=query.get('detail')||'listing';
    const owner=query.get('owner')||'Listings';
    const type=query.get('type')||'';
    const record=records.resultRecord({context,group,owner,type,detailType});
    const detailHref=detailHrefFor(record,{context,group,owner,type,detailType});
    const addTarget=PopitaiStage2Contracts.contextualAddUrl({context,group,owner,type});
    const noun=owner==='Shops'?'магазини':owner==='Firms'?'профили':owner==='Health/Info'?'здравни профили':'обяви';
    const label=PopitaiSocialCardComposer.titleFor(record.social);
    const row=demoRow(label,`Примерен резултат за „${group}“.`,context,detailHref,'Пример');
    const second=demoRow(`${label} — пример 2`,`Още един примерен резултат в същата категория.`,context,detailHref,'Пример');
    const primaryLabel=owner==='Shops'?'＋ Добави магазин':owner==='Health/Info'?'＋ Добави лекар / практика':'＋ Публикувай в тази категория';
    return `<div class="page">${pageHead(group,`Разгледай ${noun} в „${context}“.`,'Обяви и услуги')}<div class="shell"><div class="discovery-context"><span>Избран контекст</span><strong>${esc(group)}</strong>${type?`<p>Тип: ${esc(type)}</p>`:''}</div><div class="result-list">${row}${second}</div><div class="page-tools"><a class="btn primary" href="${addTarget}">${primaryLabel}</a><a class="btn" href="#add/question">Не намираш? Задай въпрос</a></div></div></div>`;
  }

  function detail(kind,query=new URLSearchParams()){
    const record=records.resolve(kind,query);
    const title=PopitaiSocialCardComposer.titleFor(record.social);
    const technicalRowKeys=new Set(['Canonical подкатегория']);
    const visibleRows=record.rows.filter(([key])=>!technicalRowKeys.has(key)).map(([key,value])=>`<div class="kv"><strong>${esc(key==='Suggested тип'?'Тип':key)}</strong><span>${esc(value)}</span></div>`).join('');
    const technicalRows=record.rows.filter(([key])=>technicalRowKeys.has(key));
    const publicBody=record.body;
    const pageTitle=record.pageTitle;
    const gallery=['listing','firm'].includes(record.contentType)?`<div class="gallery-demo"><div>Основна снимка</div><div>Снимка</div><div>Снимка</div></div>`:'';
    const qaNotes=Array.isArray(record.qaNotes)?record.qaNotes:[];
    const rawTechnical=(qaNotes.length||technicalRows.length)?`<details class="qa-adapter"><summary>QA: технически данни на примера</summary>${qaNotes.map(note=>`<p>${esc(note)}</p>`).join('')}${technicalRows.map(([key,value])=>`<p><strong>${esc(key)}:</strong> ${esc(value)}</p>`).join('')}</details>`:'';
    const special=record.special?`<div class="notice">${esc(record.special)}</div>`:record.contentType==='info'?'<div class="notice ok">Всеки реален Info Lom запис показва източник и дата на последна проверка.</div>':'';
    const social=record.social.shareEligible
      ? PopitaiSocialCardComposer.render(record.social)
      : '<details class="qa-adapter"><summary>QA: споделяне</summary><p>Този пример е shareEligible=false и не показва действие за споделяне.</p></details>';
    return `<div class="page">${pageHead(pageTitle,record.pageDescription)}<div class="shell detail"><article class="detail-main"><span class="demo-label">ПРИМЕР — НЕ Е РЕАЛНО СЪДЪРЖАНИЕ</span><h2>${esc(title)}</h2>${record.social.discovery?`<div class="discovery-context"><span>Избрано</span><strong>${esc(record.social.discovery)}</strong><p>${esc(record.social.category)}</p></div>`:''}${gallery}<h3>Описание</h3><p>${esc(publicBody)}</p>${social}${rawTechnical}</article><aside class="detail-side">${visibleRows}${actionBar(record)}${special}</aside></div></div>`;
  }

  function iconCheckpoint(){
    const candidates=[
      ['Услуги','briefcase-duotone.svg','services'],
      ['Ремонти','wrench-duotone.svg','repairs'],
      ['Животни','paw-print-duotone.svg','animals'],
      ['Автомобили','car-duotone.svg','cars'],
      ['Здраве','first-aid-kit-duotone.svg','health'],
      ['Комунални услуги','plug-duotone.svg','utilities'],
      ['Статии','article-duotone.svg','articles'],
      ['Публикации','newspaper-duotone.svg','publications']
    ];
    return `<div class="page">${pageHead('Visual checkpoint — Phosphor Duotone','Ограничен кандидат за owner visual approval. Не е масова подмяна на иконите.')}<div class="shell"><div class="notice"><strong>Само checkpoint.</strong> Това са реални SVG assets от Phosphor Icons Core (MIT), запазени локално в прототипа. Геометрията не е AI-генерирана и не е рисувана специално за този проект.</div><div class="icon-checkpoint-grid">${candidates.map(([label,file,key])=>`<article class="icon-checkpoint-card" data-icon-key="${key}"><div class="icon-large"><img src="icons/${file}" alt=""></div><h3>${label}</h3><div class="icon-real-size"><img src="icons/${file}" alt=""><span>${label}</span></div><p>Увеличено + реален малък размер.</p></article>`).join('')}</div><p class="help">Owner approval е задължителен преди обща подмяна в прототипа или production.</p></div></div>`;
  }

  Object.assign(window,{info,firms,current,articles,questions,results,detail,iconCheckpoint});
})();