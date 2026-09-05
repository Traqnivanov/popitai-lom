'use strict';

(() => {
  const infoCards=[
    ['⚕️','Здраве','info-health'],
    ['🏛️','Институции','info-institutions'],
    ['🚌','Транспорт','info-transport'],
    ['🎓','Образование и култура','info-education'],
    ['🏦','Банки и банкомати','info-banks'],
    ['⚡','Комунални услуги','info-utilities']
  ];

  const unifiedMarketplace = [
    {id:'uslugi',icon:'🛠️',title:'Услуги',desc:'Майстори, ремонти, почистване, транспорт и още.'},
    {id:'stoki',icon:'🛍️',title:'Купува и продава',desc:'Стоки за дома, техника, дрехи, хоби и оборудване.'},
    {id:'rabota',icon:'💼',title:'Работа',desc:'Предлага и търси работа по местни направления.'},
    {id:'imoti',icon:'🏠',title:'Имоти',desc:'Продажба, наем, покупка и търсене на имот.'},
    {id:'avtomobili',icon:'🚗',title:'Автомобили',desc:'МПС, части и автомобилни услуги.'},
    {id:'zdrave',icon:'⚕️',title:'Здраве и частни лекари',desc:'Частни лекарски, дентални и ветеринарни профили.'},
    {id:'magazini',icon:'🏪',title:'Магазини',desc:'Местни магазини по вид и предлагани стоки.'},
    {id:'zavedenia',icon:'🍽️',title:'Заведения',desc:'Ресторанти, кафенета и храна за вкъщи.'},
    {id:'zhivotni',icon:'🐾',title:'Животни',desc:'Осиновяване, изгубени/намерени и стоки за животни.'}
  ];

  function unifiedEntry(item,extraClass=''){
    if(item.id==='uslugi') return `<article class="category-card unified-entry ${extraClass}"><a class="category-card-main" href="#uslugi"><div class="icon">${item.icon}</div><h3>${item.title}</h3><p>${item.desc}</p><small>Разгледай →</small></a><a class="category-inline-link" href="#maistori">Майстори и ремонти →</a></article>`;
    return `<a class="category-card unified-entry ${extraClass}" href="#${item.id}"><div class="icon">${item.icon}</div><h3>${item.title}</h3><p>${item.desc}</p><small>Разгледай →</small></a>`;
  }

  function home(){
    const mainSix=unifiedMarketplace.slice(0,6).map((item,i)=>unifiedEntry(item,i>=4?'home-main-card--secondary':'')).join('');
    const secondary=unifiedMarketplace.slice(6).map(item=>`<a class="special-card" href="#${item.id}"><span>${item.icon}</span>${item.title}</a>`).join('');
    const mobileShortcuts=unifiedMarketplace.slice(4,6).map(item=>`<a class="home-shortcut" href="#${item.id}">${item.icon} ${item.title}</a>`).join('');
    const mobileMore=unifiedMarketplace.slice(6).map(item=>`<a class="home-more-link" href="#${item.id}">${item.icon} ${item.title}</a>`).join('');
    return `<section class="hero hero-compact"><div class="shell hero-grid"><div><span class="eyebrow">Лом и региона</span><h1>Намери каквото ти трябва в Лом</h1><p>Услуги, работа, имоти, обяви, местни фирми и проверена полезна информация — на едно разбираемо място.</p><form class="search-box" data-global-search><input name="q" aria-label="Търсене" placeholder="Напр. ВиК, работа, апартамент, автосервиз…"><button>Търси</button></form><div class="hero-actions"><button class="btn primary" type="button" data-open-add>＋ Публикувай</button><a class="btn ghost" href="#add/question">Не намираш? Задай въпрос</a></div></div></div></section>
      <section class="section home-marketplace"><div class="shell"><div class="section-head"><div><h2>Обяви и услуги</h2><p>Започни от задачата, която искаш да решиш.</p></div><a href="#obyavi">Всички категории →</a></div><div class="home-main-grid">${mainSix}</div><div class="home-priority-shortcuts">${mobileShortcuts}</div><div class="home-secondary-row">${secondary}</div><details class="home-more-categories"><summary>Всички категории</summary><div>${mobileMore}</div></details></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Нови обяви и услуги</h2><p>Разгледай последните местни предложения.</p></div><a href="#obyavi">Виж всички →</a></div><div class="result-list">${demoRow('ВиК услуги в Лом','Ремонти и аварийни ВиК услуги.','Услуга','#detail/listing?record=listing-vik','ВиК')}${demoRow('Работа в строителството и техническите дейности','Местно предложение за работа с ясна област.','Работа','#detail/listing?record=listing-work','Лом')}</div></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Местни фирми</h2><p>Постоянни профили на местни фирми и доставчици.</p></div><a href="#firmi">Фирми →</a></div>${demoRow('Местна фирма за ремонти','Услуги за дома, район и директни контакти.','Фирма','#detail/firm?record=firm-repairs','Лом')}</div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Инфо Лом</h2><p>Проверена местна информация — отделно от частните профили и обявите.</p></div><a href="#info">Отвори Инфо Лом →</a></div><div class="grid cols-3">${infoCards.map(([icon,title,id],i)=>`<a class="info-card" href="#detail/info?record=${id}"><h3>${icon} ${i===0?'Здравна информация':title}</h3><p>Проверени записи с източник и дата на последна проверка.</p></a>`).join('')}</div></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Актуално в Лом</h2><p>Публикациите и събитията имат различни роли.</p></div><a href="#aktualno">Всичко актуално →</a></div><div class="grid cols-2"><a class="content-card" href="#detail/publication?record=publication-update"><h3><span class="badge gold">Публикация</span> Местна актуализация</h3><p>Местна актуализация с конкретна цел и най-важното на едно място.</p></a><a class="content-card" href="#detail/event?record=event-local"><h3><span class="badge green">Събитие</span> Предстоящо местно събитие</h3><p>Дата, час и място за конкретно предстоящо събитие.</p></a></div></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Полезни статии</h2><p>Пълни практични ръководства с местната информация на първо място.</p></div><a href="#statii">Статии →</a></div>${demoRow('Как да решиш конкретна местна задача','Пълно ръководство с проверени източници.','Статия','#detail/article?record=article-guide','Ръководство')}</div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Въпроси от общността</h2><p>Попитай хората в Лом само когато не намираш готов отговор.</p></div><a href="#vaprosi">Всички въпроси →</a></div>${demoRow('Къде в Лом мога да намеря добър ВиК майстор?','Въпрос към местната общност.','Въпрос','#detail/question?record=question-community','Общност')}</div></section>`;
  }

  function hub(query){
    const mainSix=unifiedMarketplace.slice(0,6).map(item=>unifiedEntry(item)).join('');
    const secondary=unifiedMarketplace.slice(6).map(item=>unifiedEntry(item,'hub-secondary-entry')).join('');
    const rows=`${demoRow('ВиК услуги в Лом','Ремонти и аварийни услуги.','Услуга','#detail/listing?record=listing-vik','ВиК')}${demoRow('Кетъринг за събития в Лом','Кетъринг за семейни и фирмени поводи.','Услуга','#detail/listing?record=listing-catering','Кетъринг')}${demoRow('Работа в строителството и техническите дейности','Местно предложение за работа.','Работа','#detail/listing?record=listing-work','Лом')}`;
    return `<div class="page">${pageHead('Обяви и услуги','Намери обява, услуга, работа, имот, автомобил, частен здравен профил, магазин, заведение или съдържание за животни.')}<div class="shell"><div class="hub-main-grid">${mainSix}</div><div class="hub-secondary-grid">${secondary}</div><div class="section-head compact-head"><div><h2>Последни</h2><p>Последни примерни записи от основните раздели.</p></div></div>${stateContent(query,`<div class="result-list">${rows}</div>`)}</div></div>`;
  }

  function resultHref(context,name,resultDetail='listing',owner='Listings',type=''){
    const q=new URLSearchParams({context,group:name,detail:resultDetail,owner});
    if(type) q.set('type',type);
    return `#results?${q}`;
  }

  function familyPage(title,desc,groups,opts={}){
    const context=opts.context||title;
    const resultDetail=opts.resultDetail||'listing';
    const owner=opts.owner||'Listings';
    const resultFor=name=>opts.hrefBuilder?opts.hrefBuilder(name):resultHref(context,name,resultDetail,owner,opts.type||'');
    const quick=(opts.quick||groups.slice(0,6)).map(item=>{
      const label=typeof item==='string'?item:item.label;
      const href=typeof item==='string'?resultFor(item):item.href;
      return `<a class="chip" href="${href}">${esc(label)}</a>`;
    }).join('');
    const cards=groups.map((g,i)=>{
      const name=Array.isArray(g)?g[0]:g;
      const subs=Array.isArray(g)?g.slice(1):[];
      return `<a class="family-card" href="${resultFor(name)}"><div class="icon">${opts.icons?.[i]||icons[i%icons.length]}</div><h3>${esc(name)}</h3>${subs.length?`<div class="sublist">${subs.slice(0,4).map(s=>`<span>${esc(s)}</span>`).join('')}</div><small>Всички ${subs.length} →</small>`:`<p>Разгледай релевантните резултати.</p><small>Отвори →</small>`}</a>`;
    }).join('');
    return `<div class="page">${pageHead(title,desc,'Обяви и услуги')}<div class="shell">${opts.notice||''}<form class="search-box" data-page-search style="max-width:760px"><input name="q" aria-label="Търсене" placeholder="${esc(opts.placeholder||'Какво търсиш?')}"><button>Търси</button></form><div class="chips">${quick}</div><div class="grid cols-3">${cards}</div><div class="page-tools"><a class="btn primary" href="${opts.add||'#add/listing'}">＋ ${esc(opts.addLabel||'Публикувай')}</a><a class="btn" href="#add/question">Не намираш? Задай въпрос</a></div></div></div>`;
  }


  function masters(){
    const groups=['Цялостни ремонти','Бани и плочки','ВиК','Електро','Покриви','Шпакловка и боядисване','Дограма и врати','Климатици','Друга ремонтна услуга'];
    const chips=groups.map(name=>name==='Друга ремонтна услуга'
      ? `<a class="master-tile" href="#add/listing?category=${encodeURIComponent('Услуги')}&other=1&family=${encodeURIComponent('Майстори, ремонти и дом')}">${esc(name)}</a>`
      : `<a class="master-tile" href="${serviceResultsHref(name)}">${esc(name)}</a>`).join('');
    const chooseBase=`#service-group?group=${encodeURIComponent('Майстори, ремонти и дом')}&mode=add`;
    const seekPaint=`#results?context=${encodeURIComponent('Услуги')}&group=${encodeURIComponent('Шпакловка и боядисване')}&detail=listing&owner=Listings&type=${encodeURIComponent('Търси')}`;
    const active=`<div class="result-list">${demoRow('Предлагам ВиК услуги в Лом','Ремонти, монтаж и аварийни посещения.','Предлагам услуга','#detail/listing?record=listing-vik','ВиК')}${demoRow('Търся изпълнител за шпакловка и боядисване','Търсене на местен изпълнител за ремонтна задача.','Търся изпълнител',seekPaint,'Лом')}</div>`;
    const firms=`${demoRow('Местна фирма за ремонти','Ремонти и услуги за дома с директни контакти.','Фирма','#detail/firm?record=firm-repairs','Лом')}`;
    const questions=`${demoRow('Къде в Лом мога да намеря добър ВиК майстор?','Въпрос към местната общност.','Въпрос','#detail/question?record=question-community','Общност')}`;
    return `<div class="page masters-page">${pageHead('Майстори и ремонти','Намери подходяща ремонтна услуга или публикувай какво ти трябва.','Услуги')}<div class="shell"><form class="search-box masters-search" data-page-search><input name="q" aria-label="Търсене на майстор" placeholder="Какъв майстор или ремонт търсиш?"><button>Търси</button></form><div class="master-tiles" id="category-subcategories">${chips}</div><div class="masters-primary-actions"><a class="btn primary" href="${chooseBase}&type=${encodeURIComponent('Търси')}">Търся изпълнител</a><a class="btn" href="${chooseBase}&type=${encodeURIComponent('Дава')}">Предлагам услуга</a></div><section class="masters-content-section"><div class="section-head"><div><h2>Активни предложения и търсения</h2><p>Актуални предложения за услуги и заявки от хора, които търсят изпълнител.</p></div><a href="#obyavi">Всички →</a></div>${active}</section><section class="masters-content-section"><div class="section-head"><div><h2>Местни фирми</h2><p>Местни фирми и майстори за ремонти и услуги за дома.</p></div><a href="#firmi">Всички →</a></div>${firms}</section><section class="masters-question-fallback"><h3>Последни въпроси</h3><p>Не намираш необходимото? Виж въпросите или попитай общността.</p>${questions}<a class="btn soft" href="#add/question?category=${encodeURIComponent('Майстори и ремонти')}">Задай въпрос</a></section><details class="qa-adapter qa-only"><summary>Техническа структура</summary><p>Проверка на маршрутите и съвместимостта без промяна на production договорите.</p></details></div></div>`;
  }

  function services(){
    const quick=['ВиК','Електро','Почистване на дом','Автосервиз','Хамали','Кетъринг'];
    const displayFamilies=[...serviceFamilies.map(f=>[...f]),['Друга услуга']];
    const familyHref=(family,i)=>i===0?'#maistori':i===displayFamilies.length-1?`#add/listing?category=${encodeURIComponent('Услуги')}&other=1`:`#service-group?group=${encodeURIComponent(family[0])}`;
    const desktop=displayFamilies.map((family,i)=>`<article class="service-family-card"><div class="icon">${icons[i%icons.length]||'•'}</div><h3>${esc(family[0])}</h3>${family.length>1?`<div class="sublist">${family.slice(1,5).map(x=>`<span>${esc(x)}</span>`).join('')}</div>`:'<p>Избери най-близката група и опиши точната услуга.</p>'}<a class="family-open" href="${familyHref(family,i)}">${i===0?'Майстори и ремонти →':i===displayFamilies.length-1?'Опиши друга услуга →':'Разгледай →'}</a></article>`).join('');
    const mobile=displayFamilies.map((family,i)=>`<details class="service-family-accordion" ${i===0?'open':''}><summary>${esc(family[0])}</summary><div>${family.slice(1,5).map(x=>`<span>${esc(x)}</span>`).join('')}<a href="${familyHref(family,i)}">${i===displayFamilies.length-1?'Опиши услугата':'Отвори групата'} →</a></div></details>`).join('');
    return `<div class="page services-page">${pageHead('Услуги','Намери конкретна услуга в Лом.','Обяви и услуги')}<div class="shell"><form class="search-box services-search" data-page-search><input name="q" aria-label="Търсене" placeholder="Каква услуга търсиш?"><button>Търси</button></form><div class="service-quick"><strong>Често търсени</strong><div class="service-quick-scroll">${quick.map(x=>`<a class="chip" href="${serviceResultsHref(x)}">${esc(x)}</a>`).join('')}</div></div><div class="service-family-desktop">${desktop}</div><div class="service-family-mobile">${mobile}</div><div class="page-tools service-fallback"><a class="btn" href="#add/question">Не намираш услугата? Задай въпрос</a></div></div></div>`;
  }

  function serviceGroup(query){
    const name=query.get('group')||'';
    const family=serviceFamilies.find(f=>f[0]===name);
    if(!family) return staticPage('Услугата не е намерена','Избери друга група услуги.');
    const addMode=query.get('mode')==='add';
    const intent=query.get('type')||'';
    const items=family.slice(1).map((item,i)=>{
      const href=addMode
        ? PopitaiStage2Contracts.contextualAddUrl({context:'Услуги',group:item,owner:'Listings',type:intent})
        : serviceResultsHref(item);
      return `<a class="family-card" href="${href}"><div class="icon">${icons[i%icons.length]}</div><h3>${esc(item)}</h3><p>${addMode?'Избери тази конкретна услуга.':'Разгледай подходящите предложения.'}</p><small>${addMode?'Избери →':'Виж резултатите →'}</small></a>`;
    }).join('');
    const modeNotice=addMode?`<div class="notice ok"><strong>Избери конкретна услуга</strong><p>${intent==='Търси'?'След избора ще продължиш като „Търся изпълнител“.':'След избора ще продължиш като „Предлагам услуга“.'}</p></div><details class="qa-adapter qa-only"><summary>Техническа проверка</summary><p>Family-level Add остава choose-first; persisted type се предава без промяна.</p></details>`:'';
    const footer=addMode
      ? `<a class="btn" href="#service-group?group=${encodeURIComponent(name)}">← Към групата</a>`
      : `<a class="btn primary" href="#service-group?group=${encodeURIComponent(name)}&mode=add&type=${encodeURIComponent('Дава')}">Предлагам услуга</a><a class="btn" href="#service-group?group=${encodeURIComponent(name)}&mode=add&type=${encodeURIComponent('Търси')}">Търся изпълнител</a><a class="btn soft" href="#uslugi">← Всички услуги</a>`;
    return `<div class="page">${pageHead(name,addMode?'Избери конкретната услуга за публикуване.':'Избери конкретната услуга, която търсиш.','Услуги')}<div class="shell">${modeNotice}<div class="grid cols-3">${items}</div><div class="page-tools">${footer}</div></div></div>`;
  }

  function work(){return familyPage('Работа','Първо избери широка област, после конкретната професия.',workGroups,{placeholder:'Напр. шофьор, строителство, продавач…',context:'Работа',quick:workGroups.slice(0,5),add:PopitaiStage2Contracts.listingAddUrl({category:'Работа',type:'Предлага работа'}),addLabel:'Добави обява за работа'});}

  function properties(){
    const labels={'Продава имот':'Продава','Отдава под наем':'Отдава под наем','Търси за купуване':'Купува','Търси под наем':'Търси под наем'};
    return `<div class="page">${pageHead('Имоти','Първо избери намерението, после вида имот.','Обяви и услуги')}<div class="shell"><div class="tabs">${Object.entries(labels).map(([type,label])=>`<button class="tab ${type===window.propertyType?'active':''}" type="button" data-property-type="${esc(type)}">${esc(label)}</button>`).join('')}</div><div class="grid cols-4">${propertyKinds.map(x=>`<a class="family-card" data-property-kind="${esc(x)}" href="${propertyResultsHref(x)}"><div class="icon">🏠</div><h3>${x}</h3><p>Резултати за избраното намерение.</p></a>`).join('')}</div><div class="page-tools"><a class="btn primary" data-property-add href="${PopitaiStage2Contracts.listingAddUrl({category:'Имоти',type:window.propertyType})}">＋ Добави имот</a></div></div></div>`;
  }

  function goods(){return familyPage('Купува и продава','Стоките са групирани широко; конкретното се намира с търсене и филтри.',goodsGroups,{placeholder:'Какво купуваш или продаваш?',quick:goodsGroups.slice(0,4),context:'Купува и продава',add:'#add/listing',addLabel:'Добави обява'});}

  function auto(){
    const quick=[
      {label:'Автомобили',href:resultHref('Автомобили','Автомобили и джипове')},
      {label:'Части и гуми',href:resultHref('Автомобили','Части, гуми и аксесоари')},
      {label:'Автосервиз',href:serviceResultsHref('Автосервиз')},
      {label:'Диагностика',href:serviceResultsHref('Диагностика')},
      {label:'Пътна помощ',href:serviceResultsHref('Пътна помощ')}
    ];
    return familyPage('Автомобили','Купи или продай МПС, намери части или избери автомобилна услуга.',autoGroups,{placeholder:'Напр. автомобил, гуми, диагностика…',quick,context:'Автомобили',hrefBuilder:name=>name==='Автомобилни услуги'?'#service-group?group='+encodeURIComponent('Автомобилни услуги'):resultHref('Автомобили',name),notice:'<div class="notice">Автомобилните услуги са достъпни от същия раздел за услуги.</div>',add:PopitaiStage2Contracts.listingAddUrl({category:'Автомобили и МПС'}),addLabel:'Добави обява'});
  }

  function animals(){return familyPage('Животни','Осиновяване, изгубени/намерени и допустими обяви за стоки за животни.',animalGroups,{placeholder:'Осиновяване, изгубено животно, стоки…',quick:animalGroups,context:'Животни',notice:'<div class="notice">Избери най-подходящата група за обявата за животни.</div><details class="qa-adapter"><summary>QA: техническа бележка</summary><p>Discovery контекстът остава UX слой и не се persist-ва като нова backend подкатегория.</p></details>',add:PopitaiStage2Contracts.listingAddUrl({category:'Животни'}),addLabel:'Добави обява'});}

  function shops(){return familyPage('Магазини','Намери местен магазин по вид или по това, което търсиш.',shopGroups,{placeholder:'Какъв магазин търсиш?',context:'Магазини',owner:'Shops',resultDetail:'shop',quick:shopGroups.slice(0,4),add:'#add/shop',addLabel:'Добави магазин'});}
  function restaurants(){return familyPage('Заведения','Ресторанти, кафенета, пицарии, сладкарници и храна за вкъщи.',restaurantGroups,{placeholder:'Ресторант, кафе, пица, доставка…',context:'Заведения',owner:'Firms',resultDetail:'firm',quick:restaurantGroups.slice(0,5),add:'#add/firm?category=Заведения',addLabel:'Добави заведение'});}
  function health(){return familyPage('Здраве и частни лекари','Намери лекар, специалист, стоматолог или ветеринар. Проверената справочна информация остава в Инфо Лом.',healthGroups,{placeholder:'Лекар, специалист, стоматолог…',context:'Здраве и лекари',owner:'Health/Info',resultDetail:'health',quick:healthGroups,add:'#add/health',addLabel:'Добави лекар / практика'});}

  Object.assign(window,{home,hub,familyPage,masters,services,serviceGroup,work,properties,goods,auto,animals,shops,restaurants,health});
})();
