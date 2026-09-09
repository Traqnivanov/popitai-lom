'use strict';

(() => {
  const marketplaceEntries=Object.freeze([
    {id:'uslugi',icon:'🛠️',title:'Услуги',desc:'Майстори, ремонти, почистване, транспорт и още.'},
    {id:'stoki',icon:'🛍️',title:'Купува и продава',desc:'Стоки за дома, техника, дрехи, хоби и оборудване.'},
    {id:'rabota',icon:'💼',title:'Работа',desc:'Предлага и търси работа по местни направления.'},
    {id:'imoti',icon:'🏠',title:'Имоти',desc:'Продажба, наем, покупка и търсене на имот.'},
    {id:'avtomobili',icon:'🚗',title:'Автомобили',desc:'МПС, части и автомобилни услуги.'},
    {id:'zdrave',icon:'⚕️',title:'Здраве и частни лекари',desc:'Частни лекарски, дентални и ветеринарни профили.'},
    {id:'magazini',icon:'🏪',title:'Магазини',desc:'Хранителни, строителни, техника и други.'},
    {id:'zavedenia',icon:'🍽️',title:'Заведения',desc:'Ресторанти, кафенета, бързо хранене и доставка.'},
    {id:'zhivotni',icon:'🐾',title:'Животни',desc:'Осиновяване, изгубени/намерени и стоки за любимци.'}
  ]);
  const infoEntries=Object.freeze([
    ['⚕️','Здравна информация','info-health'],['🏛️','Институции','info-institutions'],['🚌','Транспорт','info-transport'],
    ['🎓','Образование и култура','info-education'],['🏦','Банки и банкомати','info-banks'],['⚡','Комунални услуги','info-utilities']
  ]);

  function approved(){return window.PopitaiApprovedContent||Object.freeze({});}
  const ACTIVITY_TIME_ZONE='Europe/Sofia';
  const activityFallback=Object.freeze([
    Object.freeze({label:'Обяви и услуги',href:'#obyavi'}),
    Object.freeze({label:'Полезни статии',href:'#statii'}),
    Object.freeze({label:'Инфо Лом',href:'#info'})
  ]);
  function validDate(value){
    if(typeof value!=='string'||!value.trim())return null;
    const date=new Date(value);
    return Number.isNaN(date.getTime())?null:date;
  }
  function sofiaDay(date){
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:ACTIVITY_TIME_ZONE,year:'numeric',month:'2-digit',day:'2-digit',weekday:'short'}).formatToParts(date);
    const part=type=>parts.find(item=>item.type===type)?.value||'';
    return {key:`${part('year')}-${part('month')}-${part('day')}`,year:Number(part('year')),month:Number(part('month')),day:Number(part('day')),weekday:part('weekday')};
  }
  function localDayNumber(day){return Date.UTC(day.year,day.month-1,day.day)/86400000;}
  function weekBounds(day){
    const weekdayIndex={Mon:0,Tue:1,Wed:2,Thu:3,Fri:4,Sat:5,Sun:6}[day.weekday];
    const current=localDayNumber(day);
    return {start:current-(Number.isInteger(weekdayIndex)?weekdayIndex:0),end:current+(6-(Number.isInteger(weekdayIndex)?weekdayIndex:0))};
  }
  function isPublicApproved(item){
    if(!item||typeof item!=='object')return false;
    if(item.status&&item.status!=='approved')return false;
    if(item.visibility&&item.visibility!=='public')return false;
    return true;
  }
  function datedUnique(items,contentType,dateField,now){
    const seen=new Set();
    return (Array.isArray(items)?items:[]).filter(item=>{
      if(!isPublicApproved(item))return false;
      const id=String(item.id||'').trim();
      const itemType=String(item.contentType||contentType).trim();
      if(!id||!itemType)return false;
      const date=validDate(item[dateField]||(dateField!=='startsAt'?(item.publishedAt||item.approvedAt):''));
      if(!date)return false;
      if(dateField!=='startsAt'&&date.getTime()>now.getTime())return false;
      const key=`${itemType}:${id}`;
      if(seen.has(key))return false;
      seen.add(key);
      return true;
    }).map(item=>({item,date:validDate(item[dateField]||(dateField!=='startsAt'?(item.publishedAt||item.approvedAt):''))}));
  }
  function activityModel(data=approved(),now=new Date()){
    const today=sofiaDay(now);
    const week=weekBounds(today);
    const groups=[
      {key:'listings',label:'Нови обяви и услуги',href:'#obyavi',rows:datedUnique(data.latest,'listing','publishedAt',now)},
      {key:'publications',label:'Нови публикации',href:'#aktualno',rows:datedUnique(data.publications,'publication','publishedAt',now)},
      {key:'articles',label:'Нови статии',href:'#statii',rows:datedUnique(data.articles,'article','publishedAt',now)},
      {key:'events',label:'Събития',href:'#aktualno',rows:datedUnique(data.events,'event','startsAt',now)}
    ];
    const metricsFor=period=>groups.map(group=>{
      const count=group.rows.filter(({date})=>{
        const day=sofiaDay(date);
        if(period==='today')return day.key===today.key;
        const number=localDayNumber(day);
        return number>=week.start&&number<=week.end;
      }).length;
      return {...group,count};
    }).filter(group=>group.count>0).slice(0,3);
    const todayMetrics=metricsFor('today');
    if(todayMetrics.length)return Object.freeze({mode:'today',title:'Днес в Лом',metrics:Object.freeze(todayMetrics)});
    const weekMetrics=metricsFor('week');
    if(weekMetrics.length)return Object.freeze({mode:'week',title:'Тази седмица',metrics:Object.freeze(weekMetrics)});
    return Object.freeze({mode:'useful',title:'Полезно сега',metrics:activityFallback});
  }
  function activityMarkup(model=activityModel()){
    const numbered=model.mode!=='useful';
    return `<section class="home-activity" aria-labelledby="home-activity-title" data-activity-mode="${esc(model.mode)}"><div class="shell home-activity-inner"><h2 id="home-activity-title">${esc(model.title)}</h2><div class="home-activity-links">${model.metrics.map(metric=>`<a href="${esc(metric.href)}">${numbered?`<strong>${esc(metric.count)}</strong>`:''}<span>${esc(metric.label)}</span></a>`).join('')}</div></div></section>`;
  }
  function publicRow(item){
    if(!item) return '';
    const href=esc(item.href||'#home');
    return `<article class="result-row stage2-public-row"><div><h3>${esc(item.title||'')}</h3>${item.description?`<p>${esc(item.description)}</p>`:''}<div class="result-meta">${item.type?`<span class="badge">${esc(item.type)}</span>`:''}${item.meta?`<span class="badge gold">${esc(item.meta)}</span>`:''}</div></div><a class="btn soft" href="${href}">Отвори</a></article>`;
  }
  function categoryCard(item,extraClass=''){
    return `<a class="category-card unified-entry ${extraClass}" href="#${item.id}"><div class="icon" aria-hidden="true">${item.icon}</div><div class="category-copy"><h3>${esc(item.title)}</h3><p>${esc(item.desc)}</p><small>Разгледай →</small></div></a>`;
  }
  function compactCategory(item){
    return `<a class="home-more-link" href="#${item.id}"><span class="home-more-icon" aria-hidden="true">${item.icon}</span><span><strong>${esc(item.title)}</strong><small>${esc(item.desc)}</small></span><b aria-hidden="true">→</b></a>`;
  }
  function renderContentSection(items,title,desc,allHref,limit=4){
    const clean=(Array.isArray(items)?items:[]).filter(Boolean).slice(0,limit);
    if(!clean.length) return '';
    return `<section class="section"><div class="shell"><div class="section-head"><div><h2>${esc(title)}</h2><p>${esc(desc)}</p></div>${allHref?`<a href="${allHref}">Виж всички →</a>`:''}</div><div class="result-list">${clean.map(publicRow).join('')}</div></div></section>`;
  }
  function renderFirmsAndCurrent(data){
    const firms=(Array.isArray(data.firms)?data.firms:[]).filter(Boolean).slice(0,2);
    const current=[...(Array.isArray(data.publications)?data.publications:[]).slice(0,1),...(Array.isArray(data.events)?data.events:[]).slice(0,1)];
    if(!firms.length&&!current.length) return '';
    const firmBlock=firms.length?`<section class="home-split-block"><div class="section-head compact-head"><div><h2>Местни фирми</h2><p>Постоянни профили на местни фирми и доставчици.</p></div><a href="#firmi">Фирми →</a></div><div class="result-list">${firms.map(publicRow).join('')}</div></section>`:'';
    const currentBlock=current.length?`<section class="home-split-block"><div class="section-head compact-head"><div><h2>Актуално в Лом</h2><p>Една местна публикация и едно предстоящо събитие.</p></div><a href="#aktualno">Актуално →</a></div><div class="result-list">${current.map(publicRow).join('')}</div></section>`:'';
    return `<section class="section"><div class="shell home-split-grid">${firmBlock}${currentBlock}</div></section>`;
  }

  function home(){
    const data=approved();
    const mainSix=marketplaceEntries.slice(0,6).map((item,i)=>categoryCard(item,`home-main-card home-main-card-${i+1}${i>=4?' home-main-card--secondary':''}`)).join('');
    const secondary=marketplaceEntries.slice(6).map(compactCategory).join('');
    const mobileShortcuts=marketplaceEntries.slice(4,6).map(compactCategory).join('');
    const latest=renderContentSection(data.latest,'Последни обяви и услуги','Последните одобрени местни предложения.','#obyavi',4);
    const firmsCurrent=renderFirmsAndCurrent(data);
    const articles=renderContentSection(data.articles,'Полезни статии','Практични ръководства с местната информация на първо място.','#statii',2);
    return `<section class="hero hero-compact stage2-home-hero"><div class="shell hero-grid"><div><span class="eyebrow">Лом и региона</span><h1>Намери каквото ти трябва в Лом</h1><p>Услуги, работа, имоти, обяви, местни фирми и проверена полезна информация — на едно разбираемо място.</p><form class="search-box" data-global-search><input name="q" aria-label="Търсене" placeholder="Напр. ВиК, работа, апартамент, автосервиз…"><button>Търси</button></form><div class="home-task-actions" aria-label="Други действия"><button class="home-task-card home-task-card--publish" type="button" data-open-add><strong>Публикувай</strong><span>Добави обява, предложи услуга или представи фирма, магазин или практика.</span></button><a class="home-task-card home-task-card--ask" href="#add/question"><strong>Попитай</strong><span>Задай местен въпрос, когато не намериш готов отговор.</span></a></div></div></div></section>
      ${activityMarkup(activityModel(data))}
      <section class="section home-marketplace"><div class="shell"><div class="section-head"><div><h2>Обяви и услуги</h2><p>Започни от това, което искаш да намериш или публикуваш.</p></div><a href="#obyavi">Всички категории →</a></div><div class="home-main-grid">${mainSix}</div><div class="home-priority-shortcuts">${mobileShortcuts}</div><div class="home-secondary-row">${secondary}</div><details class="home-more-categories"><summary>Всички категории</summary><div>${secondary}</div></details></div></section>
      ${latest}
      <section class="section home-info"><div class="shell"><div class="section-head"><div><h2>Инфо Лом</h2><p>Проверена местна информация — отделно от частните профили и обявите.</p></div><a href="#info">Отвори Инфо Лом →</a></div><div class="home-info-grid">${infoEntries.map(([icon,title,id])=>`<a class="info-card home-info-card" href="#detail/info?record=${id}"><span aria-hidden="true">${icon}</span><strong>${esc(title)}</strong><small>Отвори →</small></a>`).join('')}</div></div></section>
      ${firmsCurrent}${articles}
      <section class="section home-question-fallback"><div class="shell"><div class="question-fallback-card"><div><h2>Не намери отговор? Попитай</h2><p>Въпросите са последната стъпка, когато търсенето, обявите, услугите и местната информация не дават готов отговор.</p></div><a class="btn soft" href="#add/question">Задай въпрос</a></div></div></section>`;
  }
  function hub(query){
    const cards=marketplaceEntries.map((item,i)=>categoryCard(item,`hub-entry hub-entry-${i+1}`)).join('');
    const latest=(Array.isArray(approved().latest)?approved().latest:[]).filter(Boolean).slice(0,4);
    return `<div class="page stage2-marketplace-hub">${pageHead('Обяви и услуги','Девет входа към обяви, услуги и специализирани местни профили.')}<div class="shell"><div class="hub-all-grid">${cards}</div>${latest.length?`<div class="section-head compact-head"><div><h2>Последни</h2><p>Последните одобрени записи от основните раздели.</p></div></div>${stateContent(query,`<div class="result-list">${latest.map(publicRow).join('')}</div>`)}`:''}</div></div>`;
  }

  Object.assign(window,{home,hub});
  window.PopitaiHomeViews=Object.freeze({marketplaceEntries,infoEntries,publicRow,activityModel,activityMarkup,home,hub});
})();
