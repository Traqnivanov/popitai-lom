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

  function home(){
    return `<section class="hero"><div class="shell hero-grid"><div><span class="eyebrow">Лом и региона</span><h1>Намери каквото ти трябва в Лом</h1><p>Услуги, работа, имоти, обяви, местни фирми и проверена полезна информация — на едно разбираемо място.</p><form class="search-box" data-global-search><input name="q" aria-label="Търсене" placeholder="Напр. ВиК, работа, апартамент, автосервиз…"><button>Търси</button></form><div class="hero-actions"><button class="btn primary" type="button" data-open-add>＋ Публикувай</button><a class="btn ghost" href="#add/question">Не намираш? Задай въпрос</a></div></div><aside class="hero-side"><strong>Как работи</strong><ul><li>Първо търсиш по задача.</li><li>После публикуваш през правилната система.</li><li>Въпросът е резервната стъпка, ако няма готов отговор.</li></ul></aside></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Обяви и услуги</h2><p>Шест основни задачи, без да те затрупваме с всички подкатегории.</p></div><a href="#obyavi">Всички →</a></div><div class="grid cols-3">${marketplace.map(card).join('')}</div><div class="section-head compact-head"><div><h2>Местни специализирани раздели</h2><p>Магазини, заведения и здравни профили.</p></div></div><div class="special-grid">${specialist.map(x=>`<a class="special-card" href="#${x.id}"><span>${x.icon}</span>${x.title}</a>`).join('')}</div></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Инфо Лом</h2><p>Проверена местна информация — отделно от обявите и услугите.</p></div><a href="#info">Отвори Инфо Лом →</a></div><div class="grid cols-3">${infoCards.map(([icon,title,id])=>`<a class="info-card" href="#detail/info?record=${id}"><h3>${icon} ${title}</h3><p>Проверени записи с източник и дата на последна проверка.</p></a>`).join('')}</div></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Нови обяви и услуги</h2><p>Примерни records, които запазват контекста до detail.</p></div><a href="#obyavi">Виж всички →</a></div><div class="result-list">${demoRow('ВиК услуга — примерен резултат','Пази ВиК до detail, Social Card и Add.','Услуга','#detail/listing?record=listing-vik','Услуги')}${demoRow('Примерна обява за работа','Пази работната област до формата.','Работа','#detail/listing?record=listing-work','Предлага работа')}</div></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Актуално в Лом</h2><p>Публикации и събития са различни типове.</p></div><a href="#aktualno">Всичко актуално →</a></div><div class="grid cols-2"><a class="content-card" href="#detail/publication?record=publication-update"><span class="demo-label">ПРОТОТИП</span><h3><span class="badge gold">Публикация</span> Местна актуализация</h3><p>Публикацията има собствена причина и е толкова дълга, колкото е нужно.</p></a><a class="content-card" href="#detail/event?record=event-local"><span class="demo-label">ПРОТОТИП</span><h3><span class="badge green">Събитие</span> Предстоящо местно събитие</h3><p>В реалния сайт се показват само одобрени текущи и предстоящи събития.</p></a></div></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Местни фирми</h2><p>Постоянни профили, различни от конкретните обяви.</p></div><a href="#firmi">Фирми →</a></div>${demoRow('Ремонтна фирма — демо','Постоянен профил с услуги, район и контакти.','Фирма','#detail/firm?record=firm-repairs','Майстори')}</div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Полезни статии</h2><p>Пълни практични ръководства с местната информация на първо място.</p></div><a href="#statii">Статии →</a></div>${demoRow('Как да решиш конкретна местна задача','Пълно ръководство с проверени източници.','Статия','#detail/article?record=article-guide','Ръководство')}</div></section>`;
  }

  function hub(query){
    const rows=`${demoRow('ВиК — пример','Точният контекст се запазва.','Услуга','#detail/listing?record=listing-vik','Услуги')}${demoRow('Кетъринг — пример','Exact discovery остава видим, canonical mapping е отделен.','Услуга','#detail/listing?record=listing-catering','Услуги')}${demoRow('Работа — пример','Избраната работна област се пази.','Работа','#detail/listing?record=listing-work','Работа')}`;
    return `<div class="page">${pageHead('Обяви и услуги','Намери обява, услуга, работа, имот, автомобил или друго на едно място.')}<div class="shell"><div class="grid cols-3">${marketplace.map(card).join('')}</div><div class="section-head compact-head"><div><h2>Още местни раздели</h2><p>Магазини, заведения и здравни профили са на един клик.</p></div></div><div class="special-grid">${specialist.map(x=>`<a class="special-card" href="#${x.id}"><span>${x.icon}</span>${x.title}</a>`).join('')}</div><div class="section-head compact-head"><div><h2>Последни</h2><p>Примерни записи — не са реални обяви.</p></div></div>${stateContent(query,`<div class="result-list">${rows}</div>`)}</div></div>`;
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

  function services(){
    const quick=['ВиК','Електро','Цялостни ремонти','Почистване на дом','Автосервиз','Кетъринг'];
    const cards=serviceFamilies.map((family,i)=>`<a class="family-card" href="#service-group?group=${encodeURIComponent(family[0])}"><div class="icon">${icons[i%icons.length]}</div><h3>${esc(family[0])}</h3><div class="sublist">${family.slice(1,5).map(s=>`<span>${esc(s)}</span>`).join('')}</div><small>Всички ${family.length-1} →</small></a>`).join('');
    return `<div class="page">${pageHead('Услуги','Търси по конкретна задача. Подробните услуги се показват след избора на група.','Обяви и услуги')}<div class="shell"><form class="search-box" data-page-search style="max-width:760px"><input name="q" aria-label="Търсене" placeholder="Напр. ВиК, почистване, автосервиз, хамали…"><button>Търси</button></form><div class="chips">${quick.map(x=>`<a class="chip" href="${serviceResultsHref(x)}">${esc(x)}</a>`).join('')}</div><div class="grid cols-3">${cards}</div><div class="page-tools"><a class="btn primary" href="${PopitaiStage2Contracts.listingAddUrl({category:'Услуги'})}">＋ Предложи или потърси услуга</a><a class="btn" href="#add/question">Не намираш? Задай въпрос</a></div></div></div>`;
  }

  function serviceGroup(query){
    const name=query.get('group')||'';
    const family=serviceFamilies.find(f=>f[0]===name);
    if(!family) return staticPage('Услугата не е намерена','Избери друга група услуги.');
    const items=family.slice(1).map((item,i)=>`<a class="family-card" href="${serviceResultsHref(item)}"><div class="icon">${icons[i%icons.length]}</div><h3>${esc(item)}</h3><p>Разгледай подходящите обяви и предложения.</p><small>Виж резултатите →</small></a>`).join('');
    const add=PopitaiStage2Contracts.contextualAddUrl({context:'Услуги',group:name,owner:'Listings'});
    return `<div class="page">${pageHead(name,'Избери конкретната услуга, която търсиш.','Услуги')}<div class="shell"><div class="grid cols-3">${items}</div><div class="page-tools"><a class="btn primary" href="${add}">＋ Публикувай услуга в тази група</a><a class="btn" href="#uslugi">← Всички услуги</a></div></div></div>`;
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
    return familyPage('Автомобили','Купи или продай МПС, намери части или избери автомобилна услуга.',autoGroups,{placeholder:'Напр. автомобил, гуми, диагностика…',quick,context:'Автомобили',hrefBuilder:name=>name==='Автомобилни услуги'?'#service-group?group='+encodeURIComponent('Автомобилни услуги'):resultHref('Автомобили',name),notice:'<div class="notice">Автомобилните услуги водят към същия каноничен service discovery слой.</div>',add:PopitaiStage2Contracts.listingAddUrl({category:'Автомобили и МПС'}),addLabel:'Добави обява'});
  }

  function animals(){return familyPage('Животни','Осиновяване, изгубени/намерени и допустими обяви за стоки за животни.',animalGroups,{placeholder:'Осиновяване, изгубено животно, стоки…',quick:animalGroups,context:'Животни',notice:'<div class="notice"><strong>Discovery контекстът остава UX контекст.</strong> Не се представя като нова persisted подкатегория.</div>',add:PopitaiStage2Contracts.listingAddUrl({category:'Животни'}),addLabel:'Добави обява'});}

  function shops(){return familyPage('Магазини','Намери местен магазин по вид или по това, което търсиш.',shopGroups,{placeholder:'Какъв магазин търсиш?',context:'Магазини',owner:'Shops',resultDetail:'shop',quick:shopGroups.slice(0,4),add:'#add/shop',addLabel:'Добави магазин'});}
  function restaurants(){return familyPage('Заведения','Ресторанти, кафенета, пицарии, сладкарници и храна за вкъщи.',restaurantGroups,{placeholder:'Ресторант, кафе, пица, доставка…',context:'Заведения',owner:'Firms',resultDetail:'firm',quick:restaurantGroups.slice(0,5),add:'#add/firm?category=Заведения',addLabel:'Добави заведение'});}
  function health(){return familyPage('Здраве и лекари','Намери лекар, специалист, стоматолог или ветеринар. Проверената справочна информация остава в Инфо Лом.',healthGroups,{placeholder:'Лекар, специалист, стоматолог…',context:'Здраве и лекари',owner:'Health/Info',resultDetail:'health',quick:healthGroups,add:'#add/health',addLabel:'Добави лекар / практика'});}

  Object.assign(window,{home,hub,familyPage,services,serviceGroup,work,properties,goods,auto,animals,shops,restaurants,health});
})();