'use strict';

(() => {
  const records=window.PopitaiPrototypeRecords;

  function info(){
    const items=[
      ['⚕️','Здравна информация','info-health'],
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

  function sharePanel(record){
    if(!record?.actions?.share||!record.social?.shareEligible) return '';
    return `<button class="btn soft" type="button" data-open-share>Сподели</button><div class="share-overlay" data-share-overlay hidden><button class="share-backdrop" type="button" data-close-share aria-label="Затвори споделянето"></button><section class="share-drawer" role="dialog" aria-modal="true" aria-label="Сподели"><div class="share-drawer-head"><h2>Сподели</h2><button class="share-close" type="button" data-close-share aria-label="Затвори">×</button></div><div class="share-actions"><button class="btn" type="button" data-demo-share="facebook">Facebook</button><button class="btn" type="button" data-demo-share="native">Споделяне от устройството</button><button class="btn" type="button" data-demo-share="copy">Копирай линк</button></div><p class="share-demo-message help" aria-live="polite"></p>${PopitaiSocialCardComposer.render(record.social)}</section></div>`;
  }
  function correctionButton(label='Сигнализирай грешка'){return `<button class="btn soft" type="button" data-demo-correction>${esc(label)}</button>`;}
  function reportButton(){return `<button class="btn soft" type="button" data-demo-report>Подай сигнал</button>`;}

  function actionBar(record){
    const a=record.actions||{};
    const parts=[];
    let primaryUsed=false;
    const addAction=(html,primary=false)=>{parts.push(html);if(primary) primaryUsed=true;};
    if(a.phone) addAction(`<button class="btn ${primaryUsed?'soft':'primary'}" type="button" data-demo-contact>Обади се</button>`,!primaryUsed);
    if(a.inquiry) addAction(`<button class="btn ${primaryUsed?'soft':'primary'}" type="button" data-demo-inquiry>Запитване</button>`,!primaryUsed);
    if(a.answer) addAction(`<button class="btn ${primaryUsed?'soft':'primary'}" type="button" data-demo-answer>Добави отговор</button>`,!primaryUsed);
    if(a.official) addAction(`<button class="btn ${primaryUsed?'soft':'primary'}" type="button" data-demo-official>Официална страница</button>`,!primaryUsed);
    if(a.site) addAction('<button class="btn soft" type="button" data-demo-site>Сайт</button>');
    if(record.addUrl) addAction(`<a class="btn soft" href="${record.addUrl}">＋ Добави в същия контекст</a>`);
    parts.push(sharePanel(record));
    if(['listing','firm','shop','health'].includes(record.contentType)) parts.push('<button class="btn soft favorite-pending" type="button" aria-disabled="true" title="Любими ще се активира след отделния login/storage checkpoint">Добави в любими</button>');
    if(a.report) addAction(reportButton());
    if(a.correction) addAction(correctionButton(a.correctionLabel||'Сигнализирай грешка'));
    const clean=parts.filter(Boolean);
    return clean.length?`<div class="detail-action">${clean.join('')}<p class="contact-demo-message" aria-live="polite"></p><p class="action-demo-message help" aria-live="polite"></p></div>`:'';
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
    const serviceFamily=context==='Услуги'?serviceFamilies.find(f=>f.slice(1).includes(group)||f[0]===group):null;
    const isService=context==='Услуги';
    const otherService=group==='Друга ремонтна услуга'||group==='Друга услуга';
    const offerTarget=otherService?`#add/listing?category=${encodeURIComponent('Услуги')}&other=1${group==='Друга ремонтна услуга'?`&family=${encodeURIComponent('Майстори, ремонти и дом')}`:''}`:PopitaiStage2Contracts.contextualAddUrl({context,group,owner,type:isService?'Дава':type});
    const seekTarget=otherService?`${offerTarget}&type=${encodeURIComponent('Търси')}`:PopitaiStage2Contracts.contextualAddUrl({context,group,owner,type:isService?'Търси':type});
    const label=PopitaiSocialCardComposer.titleFor(record.social);
    const row=demoRow(label,`Местно предложение за „${group}“.`,context,detailHref,group);
    const seekDetail=`#detail/listing?context=${encodeURIComponent(context)}&group=${encodeURIComponent(group)}&owner=${encodeURIComponent(owner)}&detail=listing&type=${encodeURIComponent('Търси')}`;
    const second=isService?demoRow(`Търся ${group.toLocaleLowerCase('bg-BG')} изпълнител в Лом`,`Заявка от човек, който търси изпълнител за „${group}“.`,'Търся изпълнител',seekDetail,'Лом'):'';
    const breadcrumb=isService?`<div class="breadcrumbs"><a href="#uslugi">Услуги</a> · ${serviceFamily?.[0]==='Майстори, ремонти и дом'?'<a href="#maistori">Майстори</a>':serviceFamily?`<a href="#service-group?group=${encodeURIComponent(serviceFamily[0])}">${esc(serviceFamily[0])}</a>`:''} · ${esc(group)}</div>`:'';
    const head=isService?`<div class="shell page-head">${breadcrumb}<h1>${esc(group)} услуги в Лом</h1><p>Разгледай местните предложения и избери подходящото.</p></div>`:pageHead(group,`Разгледай резултатите в „${context}“.`,'Обяви и услуги');
    const controls=`<div class="results-toolbar"><details><summary class="btn soft">Филтри</summary><div class="results-filter-panel"><label>Район<select><option>Лом и региона</option></select></label><label>Тип<select><option>Всички</option><option>Предлагам</option><option>Търся</option></select></label></div></details><label class="results-sort">Сортиране<select><option>Най-нови</option><option>Най-подходящи</option></select></label></div>`;
    const actions=isService?`<div class="page-tools"><a class="btn primary" href="${offerTarget}">Предлагам ${esc(group)} услуга</a><a class="btn" href="${seekTarget}">Търся ${esc(group)} изпълнител</a></div><div class="results-question-fallback"><span>Не намираш необходимото?</span><a href="#add/question">Задай въпрос</a></div>`:`<div class="page-tools"><a class="btn primary" href="${offerTarget}">${owner==='Shops'?'＋ Добави магазин':owner==='Health/Info'?'＋ Добави лекар / практика':'＋ Публикувай'}</a><a class="btn" href="#add/question">Не намираш? Задай въпрос</a></div>`;
    return `<div class="page results-page">${head}<div class="shell">${controls}<div class="result-list">${row}${second}</div>${actions}</div></div>`;
  }

  function detail(kind,query=new URLSearchParams()){
    const record=records.resolve(kind,query);
    const title=PopitaiSocialCardComposer.titleFor(record.social);
    const technicalRowKeys=new Set(['Canonical подкатегория','Избран контекст']);
    const visibleRows=record.rows.filter(([key])=>!technicalRowKeys.has(key)).map(([key,value])=>`<div class="kv"><strong>${esc(key==='Suggested тип'?'Тип':key)}</strong><span>${esc(value)}</span></div>`).join('');
    const technicalRows=record.rows.filter(([key])=>technicalRowKeys.has(key));
    const qaNotes=Array.isArray(record.qaNotes)?record.qaNotes:[];
    const rawTechnical=(qaNotes.length||technicalRows.length)?`<details class="qa-adapter qa-only"><summary>Технически данни</summary>${qaNotes.map(note=>`<p>${esc(note)}</p>`).join('')}${technicalRows.map(([key,value])=>`<p><strong>${esc(key)}:</strong> ${esc(value)}</p>`).join('')}</details>`:'';
    const gallery=record.social.mediaAvailable&&['listing','firm'].includes(record.contentType)?`<div class="gallery-demo"><div>Основна снимка</div><div>Снимка</div><div>Снимка</div></div>`:'';
    const special=record.special?`<div class="notice">${esc(record.special)}</div>`:record.contentType==='info'?'<div class="notice ok">Всеки запис показва източник и дата на последна проверка.</div>':'';
    return `<div class="page detail-page">${pageHead(title,record.pageDescription)}<div class="shell detail"><article class="detail-main">${gallery}<h2 class="detail-section-title">Описание</h2><p>${esc(record.body)}</p>${rawTechnical}</article><aside class="detail-side">${visibleRows}${actionBar(record)}${special}</aside></div></div>`;
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