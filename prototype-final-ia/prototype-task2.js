'use strict';

(() => {
  const familyNames=Object.freeze([
    'Майстори, ремонти и дом',
    'Почистване и поддръжка',
    'Автомобилни услуги',
    'Транспорт, преместване и доставки',
    'Красота и лична грижа',
    'Грижа за хора и животни',
    'Обучение, уроци и спорт',
    'Техника, дигитални и професионални услуги',
    'Събития и творчески услуги',
    'Друга услуга'
  ]);

  const masterGroups=Object.freeze([
    'Цялостни ремонти',
    'Бани и плочки',
    'ВиК',
    'Електро',
    'Покриви',
    'Шпакловка и боядисване',
    'Дограма и врати',
    'Климатици',
    'Друга ремонтна услуга'
  ]);

  function familySubs(name){
    const source=(window.serviceFamilies||[]).find(row=>row[0]===name);
    return source?source.slice(1):[];
  }

  function familyHref(name){
    return name==='Майстори, ремонти и дом'?'#maistori':`#service-group?group=${encodeURIComponent(name)}`;
  }

  function familyDesktopCard(name){
    const subs=familySubs(name).slice(0,4);
    return `<a class="service-family-card" href="${familyHref(name)}"><h3>${esc(name)}</h3>${subs.length?`<p>${subs.map(esc).join(' · ')}</p>`:'<p>Избери конкретната услуга в тази група.</p>'}<small>Разгледай →</small></a>`;
  }

  function familyMobileRow(name,index){
    const subs=familySubs(name);
    const open=index===0?' open':'';
    const content=name==='Майстори, ремонти и дом'
      ? `<a class="service-family-direct" href="#maistori">Отвори „Майстори и ремонти“ →</a>`
      : subs.length
        ? `<div class="service-family-subchips">${subs.slice(0,8).map(item=>`<a href="${serviceResultsHref(item)}">${esc(item)}</a>`).join('')}</div><a class="service-family-direct" href="${familyHref(name)}">Всички в групата →</a>`
        : `<a class="service-family-direct" href="${familyHref(name)}">Избери конкретна услуга →</a>`;
    return `<details class="service-family-accordion"${open}><summary>${esc(name)}</summary><div>${content}</div></details>`;
  }

  function services(){
    const desktop=familyNames.map(familyDesktopCard).join('');
    const mobile=familyNames.map(familyMobileRow).join('');
    return `<div class="page stage2-services">${pageHead('Услуги','Избери конкретна група услуги и продължи към подходящите резултати.','Обяви и услуги')}<div class="shell"><form class="search-box service-search" data-page-search><input name="q" aria-label="Търсене на услуга" placeholder="Каква услуга търсиш?"><button>Търси</button></form><div class="service-family-grid">${desktop}</div><div class="service-family-accordions">${mobile}</div><div class="question-fallback-inline"><span>Не намираш подходяща услуга?</span><a href="#add/question">Задай въпрос</a></div></div></div>`;
  }

  function masters(){
    const data=window.PopitaiApprovedContent||{};
    const chips=masterGroups.map(name=>name==='Друга ремонтна услуга'
      ? `<a class="master-chip" href="#add/listing?category=${encodeURIComponent('Услуги')}&other=1&family=${encodeURIComponent('Майстори, ремонти и дом')}">${esc(name)}</a>`
      : `<a class="master-chip" href="${serviceResultsHref(name)}">${esc(name)}</a>`).join('');
    const active=(Array.isArray(data.masterActivity)?data.masterActivity:[]).filter(Boolean).slice(0,3);
    const firms=(Array.isArray(data.masterFirms)?data.masterFirms:[]).filter(Boolean).slice(0,3);
    const publicRow=window.PopitaiStage2MasterOrder?.publicRow||(()=> '');
    const activityContent=active.length
      ? `<div class="result-list">${active.map(publicRow).join('')}</div>`
      : `<article class="empty-card"><h3>Няма активни предложения за ремонтни услуги</h3><p>В момента няма публикувани активни предложения или търсения в този раздел.</p></article>`;
    const firmsContent=firms.length
      ? `<div class="result-list">${firms.map(publicRow).join('')}</div>`
      : `<article class="empty-card"><p>Разгледай публикуваните местни фирми и майстори.</p><a class="btn soft" href="#firmi">Всички фирми →</a></article>`;
    const activityBlock=`<section class="masters-content-block"><div class="section-head compact-head"><div><h2>Активни предложения и търсения</h2><p>Текущи предложения и заявки за ремонтни услуги.</p></div><a href="#obyavi">Виж всички →</a></div>${activityContent}</section>`;
    const firmsBlock=`<section class="masters-content-block"><div class="section-head compact-head"><div><h2>Местни фирми и майстори</h2><p>Публични местни профили с директен достъп до подробности.</p></div><a href="#firmi">Виж всички →</a></div>${firmsContent}</section>`;
    const seek=`#service-group?group=${encodeURIComponent('Майстори, ремонти и дом')}&mode=add&type=${encodeURIComponent('Търси')}`;
    const offer=`#service-group?group=${encodeURIComponent('Майстори, ремонти и дом')}&mode=add&type=${encodeURIComponent('Дава')}`;
    return `<div class="page stage2-masters">${pageHead('Майстори и ремонти','Намери конкретна ремонтна услуга или публикувай какво предлагаш или търсиш.','Услуги')}<div class="shell"><form class="search-box masters-search" data-page-search><input name="q" aria-label="Търсене на майстор или ремонт" placeholder="Напр. ВиК, баня, покрив, боядисване…"><button>Търси</button></form><div class="master-chip-grid" aria-label="Подкатегории">${chips}</div><div class="masters-actions"><a class="btn primary" href="${seek}">Търся изпълнител</a><a class="btn" href="${offer}">Предлагам услуга</a></div>${activityBlock}${firmsBlock}<div class="question-fallback-inline masters-question"><span>Не намираш подходящ отговор?</span><a href="#add/question">Задай въпрос</a></div></div></div>`;
  }

  window.PopitaiStage2ServiceFamilies=familyNames;
  window.PopitaiStage2MasterGroups=masterGroups;
  window.services=services;
  window.masters=masters;
})();
