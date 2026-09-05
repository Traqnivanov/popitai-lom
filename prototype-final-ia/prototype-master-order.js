'use strict';

(() => {
  const marketplaceEntries = Object.freeze([
    {id:'uslugi', icon:'🛠️', title:'Услуги', desc:'Майстори, ремонти, почистване, транспорт и още.'},
    {id:'stoki', icon:'🛍️', title:'Купува и продава', desc:'Стоки за дома, техника, дрехи, хоби и оборудване.'},
    {id:'rabota', icon:'💼', title:'Работа', desc:'Предлага и търси работа по местни направления.'},
    {id:'imoti', icon:'🏠', title:'Имоти', desc:'Продажба, наем, покупка и търсене на имот.'},
    {id:'avtomobili', icon:'🚗', title:'Автомобили', desc:'МПС, части и автомобилни услуги.'},
    {id:'zdrave', icon:'⚕️', title:'Здраве и частни лекари', desc:'Частни лекарски, дентални и ветеринарни профили.'},
    {id:'magazini', icon:'🏪', title:'Магазини', desc:'Хранителни, строителни, техника и други.'},
    {id:'zavedenia', icon:'🍽️', title:'Заведения', desc:'Ресторанти, кафенета, бързо хранене и доставка.'},
    {id:'zhivotni', icon:'🐾', title:'Животни', desc:'Осиновяване, изгубени/намерени и стоки за любимци.'}
  ]);

  const infoEntries = Object.freeze([
    ['⚕️','Здравна информация','info-health'],
    ['🏛️','Институции','info-institutions'],
    ['🚌','Транспорт','info-transport'],
    ['🎓','Образование и култура','info-education'],
    ['🏦','Банки и банкомати','info-banks'],
    ['⚡','Комунални услуги','info-utilities']
  ]);

  function approved(){
    return window.PopitaiApprovedContent || Object.freeze({});
  }

  function publicRow(item){
    if(!item) return '';
    const title=esc(item.title||'');
    const desc=esc(item.description||'');
    const type=esc(item.type||'');
    const meta=esc(item.meta||'Лом');
    const href=esc(item.href||'#home');
    return `<article class="result-row stage2-public-row"><div><h3>${title}</h3>${desc?`<p>${desc}</p>`:''}<div class="result-meta">${type?`<span class="badge">${type}</span>`:''}${meta?`<span class="badge gold">${meta}</span>`:''}</div></div><a class="btn soft" href="${href}">Отвори</a></article>`;
  }

  function categoryCard(item, extraClass=''){
    const inner=`<div class="icon" aria-hidden="true">${item.icon}</div><div class="category-copy"><h3>${esc(item.title)}</h3><p>${esc(item.desc)}</p><small>Разгледай →</small></div>`;
    return `<a class="category-card unified-entry ${extraClass}" href="#${item.id}">${inner}</a>`;
  }

  function compactCategory(item){
    return `<a class="home-more-link" href="#${item.id}"><span class="home-more-icon" aria-hidden="true">${item.icon}</span><span><strong>${esc(item.title)}</strong><small>${esc(item.desc)}</small></span><b aria-hidden="true">→</b></a>`;
  }

  function renderContentSection(items, title, desc, allHref, limit=4){
    const clean=(Array.isArray(items)?items:[]).filter(Boolean).slice(0,limit);
    if(!clean.length) return '';
    return `<section class="section"><div class="shell"><div class="section-head"><div><h2>${esc(title)}</h2><p>${esc(desc)}</p></div>${allHref?`<a href="${allHref}">Виж всички →</a>`:''}</div><div class="result-list">${clean.map(publicRow).join('')}</div></div></section>`;
  }

  function renderFirmsAndCurrent(data){
    const firms=(Array.isArray(data.firms)?data.firms:[]).filter(Boolean).slice(0,2);
    const publication=(Array.isArray(data.publications)?data.publications:[]).filter(Boolean).slice(0,1);
    const event=(Array.isArray(data.events)?data.events:[]).filter(Boolean).slice(0,1);
    if(!firms.length && !publication.length && !event.length) return '';
    const firmBlock=firms.length?`<section class="home-split-block"><div class="section-head compact-head"><div><h2>Местни фирми</h2><p>Постоянни профили на местни фирми и доставчици.</p></div><a href="#firmi">Фирми →</a></div><div class="result-list">${firms.map(publicRow).join('')}</div></section>`:'';
    const currentItems=[...publication,...event];
    const currentBlock=currentItems.length?`<section class="home-split-block"><div class="section-head compact-head"><div><h2>Актуално в Лом</h2><p>Една местна публикация и едно предстоящо събитие.</p></div><a href="#aktualno">Актуално →</a></div><div class="result-list">${currentItems.map(publicRow).join('')}</div></section>`:'';
    return `<section class="section"><div class="shell home-split-grid">${firmBlock}${currentBlock}</div></section>`;
  }

  function home(){
    const data=approved();
    const mainSix=marketplaceEntries.slice(0,6).map((item,i)=>categoryCard(item,`home-main-card home-main-card-${i+1}`)).join('');
    const secondary=marketplaceEntries.slice(6).map(item=>compactCategory(item)).join('');
    const mobileShortcuts=marketplaceEntries.slice(4,6).map(item=>compactCategory(item)).join('');
    const latest=renderContentSection(data.latest,'Последни обяви и услуги','Последните одобрени местни предложения.','#obyavi',4);
    const firmsCurrent=renderFirmsAndCurrent(data);
    const articles=renderContentSection(data.articles,'Полезни статии','Практични ръководства с местната информация на първо място.','#statii',2);

    return `<section class="hero hero-compact stage2-home-hero"><div class="shell hero-grid"><div><span class="eyebrow">Лом и региона</span><h1>Намери каквото ти трябва в Лом</h1><p>Услуги, работа, имоти, обяви, местни фирми и проверена полезна информация — на едно разбираемо място.</p><form class="search-box" data-global-search><input name="q" aria-label="Търсене" placeholder="Напр. ВиК, работа, апартамент, автосервиз…"><button>Търси</button></form><div class="hero-actions"><button class="btn primary" type="button" data-open-add>＋ Публикувай</button></div></div></div></section>
      <section class="section home-marketplace"><div class="shell"><div class="section-head"><div><h2>Обяви и услуги</h2><p>Започни от това, което искаш да намериш или публикуваш.</p></div><a href="#obyavi">Всички категории →</a></div><div class="home-main-grid">${mainSix}</div><div class="home-priority-shortcuts">${mobileShortcuts}</div><div class="home-secondary-row">${secondary}</div><details class="home-more-categories"><summary>Всички категории</summary><div>${secondary}</div></details></div></section>
      ${latest}
      <section class="section home-info"><div class="shell"><div class="section-head"><div><h2>Инфо Лом</h2><p>Проверена местна информация — отделно от частните профили и обявите.</p></div><a href="#info">Отвори Инфо Лом →</a></div><div class="home-info-grid">${infoEntries.map(([icon,title,id])=>`<a class="info-card home-info-card" href="#detail/info?record=${id}"><span aria-hidden="true">${icon}</span><strong>${esc(title)}</strong><small>Отвори →</small></a>`).join('')}</div></div></section>
      ${firmsCurrent}
      ${articles}
      <section class="section home-question-fallback"><div class="shell"><div class="question-fallback-card"><div><h2>Не намери отговор? Попитай</h2><p>Въпросите са последната стъпка, когато търсенето, обявите, услугите и местната информация не дават готов отговор.</p></div><a class="btn soft" href="#add/question">Задай въпрос</a></div></div></section>`;
  }

  function hub(query){
    const cards=marketplaceEntries.map((item,i)=>categoryCard(item,`hub-entry hub-entry-${i+1}`)).join('');
    const data=approved();
    const latest=(Array.isArray(data.latest)?data.latest:[]).filter(Boolean).slice(0,4);
    return `<div class="page stage2-marketplace-hub">${pageHead('Обяви и услуги','Девет входа към обяви, услуги и специализирани местни профили.')}<div class="shell"><div class="hub-all-grid">${cards}</div>${latest.length?`<div class="section-head compact-head"><div><h2>Последни</h2><p>Последните одобрени записи от основните раздели.</p></div></div>${stateContent(query,`<div class="result-list">${latest.map(publicRow).join('')}</div>`)}`:''}</div></div>`;
  }

  window.PopitaiStage2MasterOrder=Object.freeze({marketplaceEntries,infoEntries,publicRow});
  window.home=home;
  window.hub=hub;
})();
