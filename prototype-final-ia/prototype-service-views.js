'use strict';

(() => {
  const contracts=window.PopitaiStage2Contracts;
  const masterGroups=Object.freeze(['Цялостни ремонти','Бани и плочки','ВиК','Електро','Покриви','Шпакловка / гипсокартон / боядисване','Дограма и врати','Отопление и климатици','Монтажи и мебели','Къртене и извозване']);
  const familySource=Object.freeze({
    'Майстори, ремонти и дом':masterGroups,
    'Почистване и поддръжка':['Почистване','Пране на мека мебел и килими','Двор, градина и озеленяване','Борба с вредители'],
    'Автомобилни услуги':['Автосервиз','Диагностика','Гуми','Автоелектро и автоклиматици','Автомивка и детайлинг','Пътна помощ'],
    'Транспорт, преместване и доставки':['Товарен транспорт','Хамали и преместване','Доставки'],
    'Красота и лична грижа':['Фризьор и бръснар','Маникюр и педикюр','Козметика и грим','Немедицински масаж'],
    'Грижа за хора и животни':['Детегледачки','Грижа за възрастни','Помощ в дома','Гледане и разхождане на домашни любимци','Грижа и подстригване на домашни любимци'],
    'Обучение, уроци и спорт':['Уроци и курсове','Шофьорски курсове','Спорт и танци'],
    'Техника, дигитални и професионални услуги':['Ремонт на техника','ИТ, сайтове и дизайн','Счетоводство','Правни услуги','Преводи'],
    'Събития и творчески услуги':['Фото и видео','DJ и музика','Декорация','Кетъринг','Организация на събития']
  });
  const structuredFamilies=Object.freeze(contracts.serviceFamilyNames.map(name=>Object.freeze([name,...(familySource[name]||[])])));
  const familyNames=Object.freeze([...contracts.serviceFamilyNames]);

  window.serviceFamilies=structuredFamilies.map(row=>[...row]);

  function searchMatch(value=''){
    const q=String(value||'').toLocaleLowerCase('bg-BG').trim();
    if(!q) return '';
    const visible=structuredFamilies.flatMap(f=>f.slice(1));
    const aliases=contracts.serviceSearchAliases;
    const concrete=[...aliases,...visible];
    return concrete.find(name=>{
      const n=name.toLocaleLowerCase('bg-BG');
      return n.includes(q)||q.includes(n)||q.split(/\s+/).some(part=>part.length>3&&n.includes(part));
    })||'';
  }
  window.serviceSearchMatch=searchMatch;

  function familySubs(name){
    const source=structuredFamilies.find(row=>row[0]===name);
    return source?source.slice(1):[];
  }
  function familyHref(name){
    if(name==='Майстори, ремонти и дом') return '#maistori';
    return `#service-group?group=${encodeURIComponent(name)}`;
  }
  function familyDesktopCard(name){
    const subs=familySubs(name).slice(0,4);
    return `<a class="service-family-card" href="${familyHref(name)}"><h3>${esc(name)}</h3>${subs.length?`<p>${subs.map(esc).join(' · ')}</p>`:'<p>Избери конкретната услуга в тази група.</p>'}<small>Разгледай →</small></a>`;
  }
  function familyMobileRow(name,index){
    const subs=familySubs(name);
    const content=name==='Майстори, ремонти и дом'
      ? `<a class="service-family-direct" href="#maistori">Отвори „Майстори и ремонти“ →</a>`
      : subs.length
        ? `<div class="service-family-subchips">${subs.slice(0,8).map(item=>`<a href="${serviceResultsHref(item)}">${esc(item)}</a>`).join('')}</div><a class="service-family-direct" href="${familyHref(name)}">Всички в групата →</a>`
        : `<a class="service-family-direct" href="${familyHref(name)}">Избери конкретна услуга →</a>`;
    return `<details class="service-family-accordion"${index===0?' open':''}><summary>${esc(name)}</summary><div>${content}</div></details>`;
  }

  function services(){
    return `<div class="page stage2-services">${pageHead('Услуги','Избери конкретна група услуги и продължи към подходящите резултати.','Обяви и услуги')}<div class="shell"><form class="search-box service-search" data-page-search><input name="q" aria-label="Търсене на услуга" placeholder="Каква услуга търсиш?"><button>Търси</button></form><div class="service-family-grid">${familyNames.map(familyDesktopCard).join('')}</div><div class="service-family-accordions">${familyNames.map(familyMobileRow).join('')}</div><div class="question-fallback-inline"><span>Не намираш подходяща услуга?</span><a href="#add/question">Задай въпрос</a></div></div></div>`;
  }

  function masters(){
    const data=window.PopitaiApprovedContent||{};
    const chips=masterGroups.map(name=>name==='Друга ремонтна услуга'
      ? `<a class="master-chip" href="${contracts.contextualAddUrl({context:'Услуги',group:name,owner:'Listings',type:'Дава'})}">${esc(name)}</a>`
      : `<a class="master-chip" href="${serviceResultsHref(name)}">${esc(name)}</a>`).join('');
    const active=(Array.isArray(data.masterActivity)?data.masterActivity:[]).filter(Boolean).slice(0,3);
    const firms=(Array.isArray(data.masterFirms)?data.masterFirms:[]).filter(Boolean).slice(0,3);
    const publicRow=window.PopitaiHomeViews?.publicRow||(()=> '');
    const activityContent=active.length?`<div class="result-list">${active.map(publicRow).join('')}</div>`:`<article class="empty-card"><h3>Няма активни предложения за ремонтни услуги</h3><p>В момента няма публикувани активни предложения в този раздел.</p></article>`;
    const firmsContent=firms.length?`<div class="result-list">${firms.map(publicRow).join('')}</div>`:`<article class="empty-card"><p>Разгледай публикуваните местни фирми и майстори.</p><a class="btn soft" href="#firmi">Всички фирми →</a></article>`;
    const offer=contracts.contextualAddUrl({context:'Услуги',group:'Майстори, ремонти и дом',owner:'Listings',type:'Дава'});
    return `<div class="page stage2-masters">${pageHead('Майстори и ремонти','Намери конкретна ремонтна услуга или публикувай какво предлагаш.','Услуги')}<div class="shell"><form class="search-box masters-search" data-page-search><input name="q" aria-label="Търсене на майстор или ремонт" placeholder="Напр. ВиК, баня, покрив, боядисване…"><button>Търси</button></form><div class="master-chip-grid" aria-label="Подкатегории">${chips}</div><div class="masters-actions"><a class="btn primary" href="${offer}">Предлагам услуга</a></div><section class="masters-content-block"><div class="section-head compact-head"><div><h2>Активни предложения</h2><p>Текущи предложения за ремонтни услуги.</p></div><a href="#obyavi">Виж всички →</a></div>${activityContent}</section><section class="masters-content-block"><div class="section-head compact-head"><div><h2>Местни фирми и майстори</h2><p>Публични местни профили с директен достъп до подробности.</p></div><a href="#firmi">Виж всички →</a></div>${firmsContent}</section><div class="question-fallback-inline masters-question"><span>Не намираш подходящ отговор?</span><a href="#add/question">Задай въпрос</a></div></div></div>`;
  }

  function serviceGroup(query){
    const name=query.get('group')||'';
    const family=structuredFamilies.find(f=>f[0]===name);
    if(!family) return staticPage('Услугата не е намерена','Избери друга група услуги.');
    const addMode=query.get('mode')==='add';
    const requestedEntry=query.get('entry')||'';
    const sourceItems=requestedEntry?family.slice(1).filter(item=>item===requestedEntry):family.slice(1);
    const items=sourceItems.map((item,i)=>{
      const variants=contracts.serviceVariants(item);
      if(addMode&&variants.length){
        return `<article class="family-card family-card-with-variants"><h3>${esc(item)}</h3><p>Избери точната услуга, за да запазим правилния контекст.</p><div class="service-variant-links">${variants.map(variant=>`<a href="${contracts.contextualAddUrl({context:'Услуги',group:variant,owner:'Listings',type:'Дава'})}">${esc(variant)}</a>`).join('')}</div></article>`;
      }
      const href=addMode?contracts.contextualAddUrl({context:'Услуги',group:item,owner:'Listings',type:'Дава'}):serviceResultsHref(item);
      return `<a class="family-card" href="${href}"><div class="icon">${icons[i%icons.length]}</div><h3>${esc(item)}</h3><p>${addMode?'Избери тази конкретна услуга.':'Разгледай подходящите предложения.'}</p><small>${addMode?'Избери →':'Виж резултатите →'}</small></a>`;
    }).join('');
    const modeNotice=addMode?`<div class="notice ok"><strong>Избери конкретна услуга</strong><p>След избора ще продължиш като „Предлагам услуга“.</p></div>`:'';
    const footer=addMode
      ? `<a class="btn" href="#service-group?group=${encodeURIComponent(name)}">← Към групата</a>`
      : `<a class="btn primary" href="#service-group?group=${encodeURIComponent(name)}&mode=add&type=${encodeURIComponent('Дава')}">Предлагам услуга</a><a class="btn soft" href="#uslugi">← Всички услуги</a>`;
    const pageTitle=requestedEntry||name;
    return `<div class="page">${pageHead(pageTitle,addMode?'Избери точния вид услуга за публикуване.':'Избери конкретната услуга, която търсиш.','Услуги')}<div class="shell">${modeNotice}<div class="grid cols-3">${items}</div><div class="page-tools">${footer}</div></div></div>`;
  }

  function serviceEntry(query){
    const entry=query.get('group')||'';
    const visible=contracts.serviceVisibleEntry(entry);
    const family=structuredFamilies.find(row=>row.slice(1).includes(visible));
    if(!family||!contracts.serviceVariants(visible).length) return staticPage('Услугата не е намерена','Избери друга група услуги.');
    return serviceGroup(new URLSearchParams({group:family[0],mode:'add',entry:visible,type:'Дава'}));
  }

  Object.assign(window,{services,masters,serviceGroup,serviceEntry});
  window.PopitaiServiceViews=Object.freeze({structuredFamilies,familyNames,masterGroups,searchMatch,services,masters,serviceGroup,serviceEntry});
})();
