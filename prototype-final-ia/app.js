(() => {
  'use strict';

  const main = document.getElementById('app-main');
  const addLayer = document.getElementById('add-layer');

  const marketplace = [
    {id:'uslugi', icon:'🛠️', title:'Услуги', desc:'Майстори, почистване, транспорт, техника, грижи и още.'},
    {id:'stoki', icon:'🛍️', title:'Купува и продава', desc:'Стоки за дома, техника, дрехи, хоби и оборудване.'},
    {id:'rabota', icon:'💼', title:'Работа', desc:'Предлага и търси работа по ясни местни направления.'},
    {id:'imoti', icon:'🏠', title:'Имоти', desc:'Продажба, наем, покупка и търсене на имот.'},
    {id:'avtomobili', icon:'🚗', title:'Автомобили', desc:'МПС, части и автомобилни услуги на едно място.'},
    {id:'zhivotni', icon:'🐾', title:'Животни', desc:'Осиновяване, изгубени/намерени и стоки за животни.'}
  ];

  const specialist = [
    {id:'magazini',icon:'🏪',title:'Магазини'},
    {id:'zavedenia',icon:'🍽️',title:'Заведения'},
    {id:'zdrave',icon:'⚕️',title:'Здраве и лекари'}
  ];

  const serviceFamilies = [
    ['Майстори, ремонти и дом','Цялостни ремонти','Бани и плочки','ВиК','Електро','Покриви','Шпакловка и боядисване','Дограма и врати','Климатици','Монтажи и мебели','Къртене и извозване'],
    ['Почистване и поддръжка','Почистване на дом','Офиси и входове','Мека мебел и килими','Двор и градина','Озеленяване','Борба с вредители','Домашна помощ'],
    ['Автомобилни услуги','Автосервиз','Диагностика','Гуми','Автоелектро и автоклиматици','Автомивка и детайлинг','Пътна помощ'],
    ['Транспорт, преместване и доставки','Товарен транспорт','Хамали','Преместване','Доставки','Бус и камион'],
    ['Красота и лична грижа','Фризьор и бръснар','Маникюр и педикюр','Козметични услуги','Грим','Немедицински масаж'],
    ['Грижа за хора и животни','Детегледачки','Грижа за възрастни','Домашни помощници','Гледане на любимци','Разходка на кучета','Груминг'],
    ['Обучение, уроци и спорт','Частни уроци','Езици','Шофьорски курсове','Професионално обучение','Компютърни курсове','Спорт и танци'],
    ['Техника, дигитални и професионални услуги','Компютри и лаптопи','Телефони и електроника','IT и сайтове','Дизайн','Счетоводство','Правни услуги','Преводи'],
    ['Събития и творчески услуги','Фото','Видео','DJ и музика','Декорация','Кетъринг','Организация на събития']
  ];

  const workGroups = ['Строителство, ремонти и техници','Производство, склад и общи работници','Транспорт, шофьори и доставки','Търговия и продажби','Заведения, хотели и туризъм','Почистване, домашна помощ и грижи','Здраве, красота и социални дейности','Офис, администрация, IT и специалисти','Друга / сезонна работа'];
  const propertyKinds = ['Апартамент','Къща / етаж','Парцел','Земеделска земя','Гараж / паркомясто','Бизнес имот','Склад / производствен имот','Друго'];
  const goodsGroups = ['Електроника и телефони','Дом и градина','Дрехи, обувки и аксесоари','Деца и бебета','Спорт, хоби и книги','Инструменти и оборудване','Друго'];
  const autoGroups = ['Автомобили и джипове','Мотоциклети и ATV','Бусове и камиони','Агро/строителна техника','Ремаркета, каравани и други','Части, гуми и аксесоари','Автомобилни услуги'];
  const animalGroups = ['Осиновяване / търси дом','Изгубени','Намерени','Стоки за животни'];
  const shopGroups = ['Хранителни','Строителни','Техника','Мебели','Дрехи','Дом'];
  const restaurantGroups = ['Ресторанти','Кафенета','Пицарии','Бързо хранене','Сладкарници','Доставка / за вкъщи'];
  const healthGroups = ['Лекари','Лични лекари','Специалисти','Стоматолози','Ветеринари'];

  const icons = ['🔧','🧹','🚘','🚚','✂️','🤝','🎓','💻','📷'];

  function parseHash() {
    const raw = (location.hash || '#home').slice(1);
    const [pathRaw, queryRaw=''] = raw.split('?');
    return { path: pathRaw || 'home', query: new URLSearchParams(queryRaw) };
  }

  function routeLink(id) { return `#${id}`; }
  function ownerLabel(value) { return ({Listings:'Обяви',Firms:'Фирми',Shops:'Магазини','Health/Info':'Здраве / Инфо Лом',Events:'Събития',Publications:'Публикации',Questions:'Въпроси','Info Lom':'Инфо Лом','Editorial/Articles':'Статии'})[value] || value; }
  function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

  function card(item) {
    return `<a class="category-card" href="${routeLink(item.id)}"><div class="icon">${item.icon}</div><h3>${item.title}</h3><p>${item.desc}</p><small>Разгледай →</small></a>`;
  }

  function pageHead(title, desc, crumbs='Начало') {
    return `<div class="shell page-head"><div class="breadcrumbs"><a href="#home">Начало</a> · ${crumbs === 'Начало' ? esc(title) : `${esc(crumbs)} · ${esc(title)}`}</div><h1>${esc(title)}</h1><p>${esc(desc)}</p></div>`;
  }

  function demoRow(title, desc, type='Обява', href='#detail/listing', extra='Лом') {
    return `<article class="result-row"><div><span class="demo-label">ПРОТОТИПЕН ЗАПИС</span><h3>${esc(title)}</h3><p>${esc(desc)}</p><div class="result-meta"><span class="badge">${esc(type)}</span><span class="badge gold">${esc(extra)}</span></div></div><a class="btn soft" href="${href}">Отвори</a></article>`;
  }

  function stateContent(query, normal) {
    const state = query.get('state');
    if(state==='loading') return `<div class="state-box"><strong>Зареждане…</strong>Показва се стабилно състояние за зареждане без стар интерфейс под него.</div>`;
    if(state==='empty') return `<div class="state-box"><strong>Няма резултати</strong>Промени филтъра или публикувай, ако имаш подходящо съдържание.</div>`;
    if(state==='error') return `<div class="state-box"><strong>Не успяхме да заредим съдържанието</strong><p>Данните не се заменят с фалшиви записи.</p><button class="btn" type="button" onclick="location.hash=location.hash.replace('?state=error','')">Опитай отново</button></div>`;
    return normal;
  }

  function home() {
    return `<section class="hero"><div class="shell hero-grid"><div><span class="eyebrow">Лом и региона</span><h1>Намери каквото ти трябва в Лом</h1><p>Услуги, работа, имоти, обяви, местни фирми и проверена полезна информация — на едно разбираемо място.</p><form class="search-box" data-global-search><input name="q" aria-label="Търсене" placeholder="Напр. ВиК, работа, апартамент, автосервиз…"><button>Търси</button></form><div class="hero-actions"><button class="btn primary" type="button" data-open-add>＋ Публикувай</button><a class="btn ghost" href="#add/question">Не намираш? Задай въпрос</a></div></div><aside class="hero-side"><strong>Как работи</strong><ul><li>Първо търсиш по задача.</li><li>После публикуваш през правилната система.</li><li>Въпросът е резервната стъпка, ако няма готов отговор.</li></ul></aside></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Обяви и услуги</h2><p>Шест основни задачи, без да те затрупваме с всички подкатегории.</p></div><a href="#obyavi">Всички →</a></div><div class="grid cols-3">${marketplace.map(card).join('')}</div></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Местни специализирани раздели</h2><p>Съществуващите системи остават отделни, но са лесно откриваеми.</p></div></div><div class="special-grid">${specialist.map(x=>`<a class="special-card" href="#${x.id}"><span>${x.icon}</span>${x.title}</a>`).join('')}</div></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Инфо Лом</h2><p>Проверена местна информация — отделно от обявите и услугите.</p></div><a href="#info">Отвори Инфо Лом →</a></div><div class="grid cols-3">${['Здраве','Транспорт','Институции','Образование','Комунални услуги','Полезни телефони'].map((x,i)=>`<a class="info-card" href="#info"><h3>${['⚕️','🚌','🏛️','🎓','💡','☎️'][i]} ${x}</h3><p>Проверени записи с източник и дата на последна проверка.</p></a>`).join('')}</div></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Нови обяви и услуги</h2><p>В реалния сайт тук идват само действително публикувани записи от съответната система.</p></div><a href="#obyavi">Виж всички →</a></div><div class="result-list">${demoRow('ВиК услуга — примерен резултат','Показва как изглежда услуга без да твърди, че реален човек я предлага.','Услуга','#detail/listing','Услуги')}${demoRow('Примерна обява за работа','Демонстрация на резултат с тип „Предлага работа“.','Работа','#detail/listing','Предлага работа')}</div></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Актуално в Лом</h2><p>Публикации и събития са различни типове, но се откриват на едно място.</p></div><a href="#aktualno">Всичко актуално →</a></div><div class="grid cols-2"><a class="content-card" href="#detail/publication"><span class="demo-label">ПРОТОТИП</span><h3><span class="badge gold">Публикация</span> Кратка местна актуализация</h3><p>Публикацията има една конкретна причина да съществува и може да води към друг раздел.</p></a><a class="content-card" href="#detail/event"><span class="demo-label">ПРОТОТИП</span><h3><span class="badge green">Събитие</span> Предстоящо местно събитие</h3><p>В реалния сайт се показват само одобрени текущи и предстоящи събития.</p></a></div></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Местни фирми</h2><p>Постоянни профили, различни от конкретните обяви.</p></div><a href="#firmi">Фирми →</a></div><div class="grid cols-3">${['Ремонтна фирма — демо','Автосервиз — демо','Местна услуга — демо'].map(x=>`<a class="content-card" href="#detail/firm"><span class="demo-label">ПРОТОТИП</span><h3>${x}</h3><p>Показва фирмен профил без фалшив рейтинг или популярност.</p></a>`).join('')}</div></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Полезни статии</h2><p>Пълни практични ръководства с местната информация на първо място, не кратки публикации.</p></div><a href="#statii">Статии →</a></div><div class="grid cols-2"><a class="content-card" href="#detail/article"><span class="demo-label">ПРОТОТИП</span><h3>Как да решиш местна административна задача</h3><p>Пример за структура: местен процес → подготовка → изключения → източници.</p></a><a class="content-card" href="#detail/article"><span class="demo-label">ПРОТОТИП</span><h3>Практично ръководство за местна услуга</h3><p>Статията решава задачата докрай и може да сочи към правилния раздел.</p></a></div></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Въпроси от общността</h2><p>Помощ, когато няма готов отговор.</p></div><a href="#vaprosi">Въпроси →</a></div>${demoRow('Къде в Лом мога да намеря…?','Примерен въпрос от общността. Не е проверен факт от Инфо Лом.','Въпрос','#detail/question','Без фалшив брой отговори')}</div></section>`;
  }

  function hub(query) {
    const rows = `${demoRow('Примерна обява за услуга','Кратко описание на услугата, район и основна информация.','Услуга')}${demoRow('Примерен предмет за продажба','Заглавие, състояние и цена се виждат още в списъка.','Купува и продава')}${demoRow('Примерна позиция за работа','Тип работа и най-важните условия са видими без излишни стъпки.','Работа')}`;
    return `<div class="page">${pageHead('Обяви и услуги','Намери обява, услуга, работа, имот, автомобил или друго на едно място.')}<div class="shell"><div class="grid cols-3">${marketplace.map(card).join('')}</div><div class="section-head compact-head"><div><h2>Още местни раздели</h2><p>Магазини, заведения и здравни услуги са на един клик разстояние.</p></div></div><div class="special-grid">${specialist.map(x=>`<a class="special-card" href="#${x.id}"><span>${x.icon}</span>${x.title}</a>`).join('')}</div><div class="section-head compact-head"><div><h2>Последни</h2><p>Примерни карти за визуална проверка — не са реални обяви.</p></div></div>${stateContent(query,`<div class="result-list">${rows}</div>`)}</div></div>`;
  }

  function familyPage(title, desc, groups, opts={}) {
    const context = opts.context || title;
    const resultHref = (name) => `#results?context=${encodeURIComponent(context)}&group=${encodeURIComponent(name)}&detail=${encodeURIComponent(opts.resultDetail||'listing')}&owner=${encodeURIComponent(opts.owner||'Listings')}`;
    const quick = (opts.quick||groups.slice(0,6)).map(x=>`<a class="chip" href="${resultHref(x)}">${esc(x)}</a>`).join('');
    const cards = groups.map((g,i)=>{
      const name = Array.isArray(g)?g[0]:g;
      const subs = Array.isArray(g)?g.slice(1):[];
      return `<a class="family-card" href="${resultHref(name)}"><div class="icon">${opts.icons?.[i]||icons[i%icons.length]}</div><h3>${esc(name)}</h3>${subs.length?`<div class="sublist">${subs.slice(0,4).map(s=>`<span>${esc(s)}</span>`).join('')}</div><small>Всички ${subs.length} →</small>`:`<p>Разгледай релевантните резултати.</p><small>Отвори →</small>`}</a>`;
    }).join('');
    return `<div class="page">${pageHead(title,desc,'Обяви и услуги')}<div class="shell">${opts.notice||''}<form class="search-box" data-page-search style="max-width:760px"><input name="q" aria-label="Търсене" placeholder="${esc(opts.placeholder||'Какво търсиш?')}"><button>Търси</button></form><div class="chips">${quick}</div><div class="grid cols-3">${cards}</div><div class="page-tools"><a class="btn primary" href="${opts.add||'#add/listing'}">＋ ${esc(opts.addLabel||'Публикувай')}</a><a class="btn" href="#add/question">Не намираш? Задай въпрос</a></div></div></div>`;
  }

  function services(){return familyPage('Услуги','Търси по конкретна задача. Всички подкатегории се показват след избора, не наведнъж.',serviceFamilies,{placeholder:'Напр. ВиК, почистване, автосервиз, хамали…',quick:['ВиК','Електро','Ремонти','Почистване','Автосервиз','Транспорт'],context:'Услуги',add:'#add/listing?category=Услуги',addLabel:'Предложи или потърси услуга'});}
  function work(){return familyPage('Работа','Първо избери широка област, после конкретната професия.',['Строителство, ремонти и техници','Производство, склад и общи работници','Транспорт, шофьори и доставки','Търговия и продажби','Заведения, хотели и туризъм','Почистване, домашна помощ и грижи','Здраве, красота и социални дейности','Офис, администрация, IT и специалисти','Друга / сезонна работа'],{placeholder:'Напр. шофьор, строителство, продавач…',context:'Работа',quick:['Строителство','Шофьори','Търговия','Заведения','Производство'],add:'#add/listing?category=Работа&type=Предлага работа',addLabel:'Добави обява за работа'});}
  function properties(){return `<div class="page">${pageHead('Имоти','Първо избери намерението, после вида имот.','Обяви и услуги')}<div class="shell"><div class="tabs">${['Продава','Отдава под наем','Купува','Търси под наем'].map((x,i)=>`<button class="tab ${i===0?'active':''}" type="button" data-demo-tab>${x}</button>`).join('')}</div><div class="grid cols-4">${propertyKinds.map(x=>`<a class="family-card" href="#results?context=Имоти&group=${encodeURIComponent(x)}&detail=listing&owner=Listings"><div class="icon">🏠</div><h3>${x}</h3><p>Резултати за избраното намерение.</p></a>`).join('')}</div><div class="page-tools"><a class="btn primary" href="#add/listing?category=Имоти&type=Продава имот">＋ Добави имот</a></div></div></div>`;}
  function goods(){return familyPage('Купува и продава','Стоките са групирани широко; конкретното се намира с търсене и подкатегории.',goodsGroups,{placeholder:'Какво купуваш или продаваш?',quick:['Телефони','Дом и градина','Дрехи','Инструменти'],context:'Купува и продава',add:'#add/listing',addLabel:'Добави обява'});}
  function auto(){return familyPage('Автомобили','Купи или продай МПС, намери части или избери автомобилна услуга.',autoGroups,{placeholder:'Напр. автомобил, гуми, диагностика…',quick:['Автомобили','Гуми','Части','Диагностика','Пътна помощ'],context:'Автомобили',notice:'<div class="notice">Търсиш сервиз, гуми, диагностика или пътна помощ? Същите услуги се намират и през „Услуги“.</div>',add:'#add/listing?category=Автомобили и МПС',addLabel:'Добави обява'});}
  function animals(){return familyPage('Животни','Без платена продажба на живи животни на първия етап.',animalGroups,{placeholder:'Осиновяване, изгубено животно, стоки…',quick:['Кучета','Котки','Птици','Селскостопански'],context:'Животни',notice:'<div class="notice danger"><strong>Платена продажба на живи животни не е налична.</strong> Ветеринарите са в „Здраве“, а гледането и грумингът — в „Услуги“.</div>',add:'#add/listing?category=Животни',addLabel:'Добави допустима обява'});}
  function shops(){return familyPage('Магазини','Намери местен магазин по вид или по това, което търсиш.',shopGroups,{placeholder:'Какъв магазин търсиш?',context:'Магазини',owner:'Shops',resultDetail:'firm',quick:shopGroups.slice(0,4),add:'#add/shop',addLabel:'Добави магазин'});}
  function restaurants(){return familyPage('Заведения','Ресторанти, кафенета, пицарии, сладкарници и храна за вкъщи.',restaurantGroups,{placeholder:'Ресторант, кафе, пица, доставка…',context:'Заведения',owner:'Firms',resultDetail:'firm',quick:restaurantGroups.slice(0,5),add:'#add/firm?category=Заведения',addLabel:'Добави заведение'});}
  function health(){return familyPage('Здраве и лекари','Намери лекар, специалист, стоматолог или ветеринар. Проверената справочна информация остава в Инфо Лом.',healthGroups,{placeholder:'Лекар, специалист, стоматолог…',context:'Здраве и лекари',owner:'Health/Info',resultDetail:'health',quick:healthGroups,add:'#add/health',addLabel:'Добави лекар / здравна услуга'});}

  function info(){return `<div class="page">${pageHead('Инфо Лом','Проверена местна информация с източник и дата на последна проверка.')}<div class="shell"><div class="grid cols-3">${['Здраве','Транспорт','Институции','Образование','Комунални услуги','Полезни телефони'].map((x,i)=>`<a class="info-card" href="#detail/info"><h3>${['⚕️','🚌','🏛️','🎓','💡','☎️'][i]} ${x}</h3><p>Контакти, работно време, услуги, източник и последна проверка.</p></a>`).join('')}</div></div></div>`;}

  function firms(query){return `<div class="page">${pageHead('Фирми','Постоянни местни профили. Фирмата не е обява.')}<div class="shell"><div class="page-tools"><a class="btn primary" href="#add/firm">＋ Добави фирма</a></div><div class="section-head" style="margin-top:24px"><div><h2>Фирмени профили</h2><p>Без фалшиви оценки и популярност.</p></div></div>${stateContent(query,`<div class="result-list">${demoRow('Фирма за ремонти — демо','Постоянен профил с услуги, район и контакти.','Фирма','#detail/firm','Майстори')}${demoRow('Местен сервиз — демо','Постоянен фирмен профил, който може да се открива и през „Автомобили“.','Фирма','#detail/firm','Автомобили')}</div>`)}</div></div>`;}
  function current(){return `<div class="page">${pageHead('Актуално','Кратки местни публикации и предстоящи събития на едно място.')}<div class="shell"><div class="grid cols-2"><a class="content-card" href="#detail/publication"><span class="demo-label">ПРИМЕР</span><h3><span class="badge gold">Публикация</span> Кратка местна актуализация</h3><p>Една конкретна промяна, полезно съобщение или местна тема — кратко и ясно.</p><small class="card-link">Прочети →</small></a><a class="content-card" href="#detail/event"><span class="demo-label">ПРИМЕР</span><h3><span class="badge green">Събитие</span> Предстоящо местно събитие</h3><p>При реален запис тук се виждат най-важните дата, час и място.</p><small class="card-link">Виж събитието →</small></a></div></div></div>`;}

  function articles(){return `<div class="page">${pageHead('Статии','Пълни практични ръководства с местната информация на първо място.')}<div class="shell"><div class="result-list">${demoRow('Как да решиш конкретна местна задача','Пълно ръководство: какво се прави в Лом, подготовка, изключения и проверени източници.','Статия','#detail/article','Ръководство')}${demoRow('Практично ръководство за местна услуга','Демонстрира дългосрочно полезно съдържание за търсачки, не кратка публикация.','Статия','#detail/article','Местната информация първо')}</div></div></div>`;}
  function questions(){return `<div class="page">${pageHead('Въпроси','Помощ от общността, когато няма готов отговор.')}<div class="shell"><div class="page-tools"><a class="btn primary" href="#add/question">＋ Задай въпрос</a></div><div class="result-list" style="margin-top:18px">${demoRow('Къде мога да намеря…?','Примерен въпрос. Отговорът от общността не се представя като проверена информация.','Въпрос','#detail/question','Общност')}</div></div></div>`;}

  function results(query){
    const context=query.get('context')||'Обяви и услуги';
    const group=query.get('group')||'Всички';
    const detailType=query.get('detail')||'listing';
    const owner=query.get('owner')||'Listings';
    const addTarget = owner==='Shops'?'#add/shop':owner==='Firms'?'#add/firm':owner==='Health/Info'?'#add/health':`#add/listing?category=${encodeURIComponent(context)}&subcategory=${encodeURIComponent(group)}`;
    const noun = owner==='Shops'?'магазини':owner==='Firms'?'профили':owner==='Health/Info'?'здравни профили':'обяви';
    return `<div class="page">${pageHead(group,`Разгледай ${noun} в „${context}“.`,'Обяви и услуги')}<div class="shell"><div class="result-list">${demoRow(`${group} — пример 1`,`Най-важната информация се вижда още в списъка.`,context,`#detail/${detailType}`,'Пример')}${demoRow(`${group} — пример 2`,`Втори примерен запис за проверка на плътността и подредбата.`,context,`#detail/${detailType}`,'Пример')}</div><div class="page-tools"><a class="btn primary" href="${addTarget}">＋ Публикувай в тази категория</a><a class="btn" href="#add/question">Не намираш? Задай въпрос</a></div></div></div>`;
  }

  function detail(kind){
    const map={
      listing:{title:'Примерна обява',type:'Обява',desc:'Публичната обява показва най-важното без излишни технически подробности.',heading:'Примерно заглавие на обява',body:'Тук стои ясно описание на предложението, състоянието или търсенето. Реалният запис показва само данните, които потребителят е публикувал.',rows:[['Категория','Услуги'],['Район','Лом'],['Цена','По договаряне']],contact:true},
      firm:{title:'Примерен фирмен профил',type:'Фирма',desc:'Постоянен профил с услуги, район, контакти и работно време.',heading:'Примерен местен фирмен профил',body:'Профилът представя фирмата постоянно, а конкретните обяви остават отделни.',rows:[['Категория','Майстори и ремонти'],['Район','Лом'],['Работно време','Показва се при реален запис']],contact:true},
      article:{title:'Примерна статия',type:'Статия',desc:'Пълно практично ръководство с местната информация на първо място.',heading:'Как да решиш конкретна задача в Лом',body:'Статията започва с практичната местна стъпка, след това дава подготовка, важни изключения и проверени източници.',rows:[['Вид','Ръководство'],['Фокус','Лом и региона'],['Източници','Посочват се в реалната статия']]},
      publication:{title:'Примерна публикация',type:'Публикация',desc:'Кратка конкретна местна актуализация.',heading:'Кратка местна актуализация',body:'Публикацията има една ясна причина да съществува и може да води към статия, Инфо Лом, обява, фирма, събитие или въпрос.',rows:[['Вид','Публикация'],['Тема','Местна актуализация']]},
      event:{title:'Примерно събитие',type:'Събитие',desc:'Предстоящо местно събитие с ясни дата, час и място.',heading:'Предстоящо местно събитие',body:'При реален запис тук се показват описанието, организаторът и само актуалната публична информация.',rows:[['Дата и час','Показват се при реален запис'],['Място','Показва се при реален запис']]},
      question:{title:'Примерен въпрос',type:'Въпрос',desc:'Помощ от общността, когато няма готов отговор.',heading:'Къде в Лом мога да намеря…?',body:'Отговорите от общността са ясно различени от проверената информация в Инфо Лом.',rows:[['Категория','Общност'],['Отговори','Показват се само реалните']]},
      health:{title:'Примерен здравен профил',type:'Здраве',desc:'Лекар, специалист, стоматолог или ветеринар в специализирания здравен раздел.',heading:'Примерен здравен профил',body:'При реален запис тук се виждат специалност, кабинет, публичен контакт и последно потвърдена информация.',rows:[['Тип','Специалист'],['Район','Лом'],['Последно потвърдено','Показва се при реален запис']],contact:true},
      info:{title:'Примерен запис в Инфо Лом',type:'Инфо',desc:'Проверена местна справочна информация с източник и последна проверка.',heading:'Примерен справочен запис',body:'При реален запис тук се показват точният контакт, работното време, услугите, източникът и датата на последна проверка.',rows:[['Източник','Показва се при реален запис'],['Последно проверено','Показва се при реален запис']]}
    };
    const c=map[kind]||map.listing;
    const gallery = ['listing','firm'].includes(kind)?`<div class="gallery-demo"><div>Основна снимка</div><div>Снимка</div><div>Снимка</div></div>`:'';
    const rows=c.rows.map(([k,v])=>`<div class="kv"><strong>${esc(k)}</strong><span>${esc(v)}</span></div>`).join('');
    const contact=c.contact?`<button class="btn primary" type="button" data-demo-contact>Покажи контакт</button><p class="contact-demo-message" aria-live="polite"></p>`:'';
    const special=kind==='event'?'<div class="notice">Публично се показват само текущи и предстоящи събития.</div>':kind==='publication'?'<div class="admin-note">Публична форма за добавяне на публикация няма.</div>':kind==='info'?'<div class="notice ok">Всеки реален запис показва източник и дата на последна проверка.</div>':'';
    return `<div class="page">${pageHead(c.title,c.desc)}<div class="shell detail"><article class="detail-main"><span class="demo-label">ПРИМЕР — НЕ Е РЕАЛНО СЪДЪРЖАНИЕ</span><h2>${esc(c.heading)}</h2>${gallery}<h3>Описание</h3><p>${esc(c.body)}</p></article><aside class="detail-side">${rows}<div class="detail-action">${contact}${special}</div></aside></div></div>`;
  }

  const listingCategories=['Електроника','Дом и градина','Дрехи и обувки','Деца и бебета','Спорт и хоби','Автомобили и МПС','Животни','Работа','Имоти','Услуги','Друго'];
  const formConfig={
    listing:{title:'Добави обява',subtitle:'Публикувай продажба, търсене, работа, имот или услуга.',owner:'Listings',fields:[['Заглавие','text'],['Категория','select'],['Подкатегория / вид','select'],['Тип обява','select'],['Описание','textarea'],['Цена','number'],['Телефон','tel'],['Град / район','text']]},
    firm:{title:'Добави фирма',subtitle:'Създай постоянен профил на местна фирма или доставчик.',owner:'Firms',fields:[['Име на фирмата','text'],['Категория','select'],['Телефон','tel'],['Кратко описание','textarea']]},
    shop:{title:'Добави магазин',subtitle:'Предложи местен магазин за преглед и публикуване.',owner:'Shops',fields:[['Име на магазина','text'],['Категория','select'],['Телефон','tel'],['Адрес','text'],['Работно време','text'],['Какво предлага','textarea']]},
    health:{title:'Добави лекар / здравна услуга',subtitle:'Предложи лекар, специалист, стоматолог или ветеринар.',owner:'Health/Info',fields:[['Тип','select'],['Име','text'],['Специалност / услуга','text'],['Телефон','tel'],['Адрес / кабинет','text'],['Източник / уточнение','textarea']]},
    question:{title:'Задай въпрос',subtitle:'Попитай общността, ако не намираш готов отговор.',owner:'Въпроси',fields:[['Категория','select'],['Заглавие на въпроса','text'],['Подробности','textarea']]}
  };

  function selectOptions(values,current=''){
    return `<option value="">Избери</option>`+values.map(v=>`<option value="${esc(v)}" ${String(v)===String(current)?'selected':''}>${esc(v)}</option>`).join('');
  }

  function optionsFor(kind,label,query){
    if(kind==='listing' && label==='Категория') return listingCategories;
    if(kind==='listing' && label==='Подкатегория / вид'){
      const cat=query.get('category')||'';
      if(cat==='Услуги') return serviceFamilies.flatMap(x=>x.slice(1));
      if(cat==='Имоти') return propertyKinds;
      if(cat==='Животни') return animalGroups;
      if(cat==='Автомобили и МПС') return autoGroups;
      return ['Друго'];
    }
    if(kind==='listing' && label==='Тип обява'){
      const cat=query.get('category')||'';
      if(cat==='Работа') return ['Предлага работа','Търси работа'];
      if(cat==='Имоти') return ['Продава имот','Отдава под наем','Търси под наем','Търси за купуване'];
      if(cat==='Животни') return ['Осиновяване','Изгубено','Намерено','Стоки за животни'];
      return ['Продава','Купува','Търси','Дава'];
    }
    if(kind==='shop' && label==='Категория') return shopGroups;
    if(kind==='health' && label==='Тип') return healthGroups;
    if(kind==='firm' && label==='Категория') return ['Майстори и ремонти','Автомобили','Заведения','Работа и услуги','Здраве и лекари'];
    if(kind==='question' && label==='Категория') return [...marketplace.map(x=>x.title),...specialist.map(x=>x.title),'Инфо Лом','Събития и град'];
    return ['Примерна стойност','Друго'];
  }

  function currentForField(kind,label,query){
    if(kind!=='listing') return label==='Категория'?query.get('category')||'':'';
    if(label==='Категория') return query.get('category')||'';
    if(label==='Подкатегория / вид') return query.get('subcategory')||'';
    if(label==='Тип обява') return query.get('type')||'';
    return '';
  }

  function formPage(kind,query){
    const c=formConfig[kind]||formConfig.listing;
    const state=query.get('state');
    const edit=state==='edit';
    if(state==='pending') return `<div class="page">${pageHead(c.title,'Изпратено е за преглед.')}<div class="shell form-wrap"><div class="notice"><strong>Чака преглед.</strong> Ще стане публично след одобрение според правилата за този тип съдържание.</div></div></div>`;
    if(state==='success') return `<div class="page">${pageHead(c.title,'Успешно изпращане.')}<div class="shell form-wrap"><div class="notice ok"><strong>Успешно изпратено.</strong> Това е прототип и не е създаден реален запис.</div><a class="btn" href="#home" style="margin-top:14px">Към началото</a></div></div>`;
    const fields=c.fields.map(([label,type],i)=>{
      const current=currentForField(kind,label,query);
      if(type==='textarea') return `<div class="field"><label>${esc(label)}</label><textarea rows="5" ${i<2?'required':''} placeholder="Опиши най-важното ясно и конкретно"></textarea></div>`;
      if(type==='select') return `<div class="field"><label>${esc(label)}</label><select ${i<2?'required':''} ${kind==='listing'&&label==='Категория'?'id="listing-category"':''} ${kind==='listing'&&label==='Подкатегория / вид'?'id="listing-subcategory"':''} ${kind==='listing'&&label==='Тип обява'?'id="listing-type"':''}>${selectOptions(optionsFor(kind,label,query),current)}</select></div>`;
      const placeholder=type==='tel'?'Напр. 0876 123 456':label==='Заглавие'?'Напр. Боядисване на апартаменти в Лом':label==='Град / район'?'Лом':'';
      return `<div class="field"><label>${esc(label)}</label><input type="${type}" ${i<2?'required':''} placeholder="${esc(placeholder)}"></div>`;
    }).join('');
    const animalVisible=kind==='listing' && query.get('category')==='Животни';
    const animalWarning=kind==='listing'?`<div class="notice danger" id="animal-warning" ${animalVisible?'':'hidden'}><strong>За живи животни:</strong> платена продажба не се предлага. Достъпни са осиновяване, изгубени/намерени и стоки.</div>`:'';
    return `<div class="page">${pageHead(edit?`Редактирай — ${c.title}`:c.title,c.subtitle)}<div class="shell form-wrap">${animalWarning}<form class="proto-form" data-proto-form data-form-kind="${kind}" novalidate>${fields}<div class="field check-field"><label><input type="checkbox" required> Приемам правилата на общността</label></div><div class="form-actions"><button class="btn primary" type="submit">${edit?'Изпрати редакцията':'Изпрати за преглед'}</button><a class="btn" href="#home">Отказ</a></div><div class="form-message" aria-live="polite"></div></form></div></div>`;
  }

  function staticPage(title,text){return `<div class="page">${pageHead(title,text)}<div class="shell"><div class="content-card"><p>${esc(text)}</p><p>Съдържанието тук ще използва действащите текстове и правила при реалната интеграция.</p></div></div></div>`;}

  function render(){
    const {path,query}=parseHash();
    let html='';
    if(path==='home') html=home();
    else if(path==='obyavi') html=hub(query);
    else if(path==='uslugi') html=services();
    else if(path==='rabota') html=work();
    else if(path==='imoti') html=properties();
    else if(path==='stoki') html=goods();
    else if(path==='avtomobili') html=auto();
    else if(path==='zhivotni') html=animals();
    else if(path==='magazini') html=shops();
    else if(path==='zavedenia') html=restaurants();
    else if(path==='zdrave') html=health();
    else if(path==='firmi') html=firms(query);
    else if(path==='info') html=info();
    else if(path==='aktualno') html=current();
    else if(path==='statii') html=articles();
    else if(path==='vaprosi') html=questions();
    else if(path==='results') html=results(query);
    else if(path.startsWith('detail/')) html=detail(path.split('/')[1]);
    else if(path.startsWith('add/')) html=formPage(path.split('/')[1],query);
    else if(path==='about') html=staticPage('За сайта','Попитай.Лом е местен портал за намиране, публикуване и помощ от общността.');
    else if(path==='rules') html=staticPage('Правила','Прототипът показва правилната крайна страница, без да копира целия документ с действащите правила.');
    else if(path==='contacts') html=staticPage('Контакти','Контактният екран е отделен и не се смесва със системите за обяви и услуги.');
    else if(path==='profile') html=staticPage('Профил','Профилът е естественото място за собствено съдържание, редакции и статуси.');
    else html=staticPage('Страницата не е намерена','Този прототипен адрес не съществува.');
    main.innerHTML=html;
    main.focus({preventScroll:true});
    updateNav(path);
    window.scrollTo({top:0,behavior:'instant'});
  }

  function updateNav(path){
    const top=path.split('/')[0];
    document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('active',a.dataset.nav===top || (a.dataset.nav==='obyavi' && ['uslugi','rabota','imoti','stoki','avtomobili','zhivotni','magazini','zavedenia','zdrave'].includes(top))));
  }

  function openAdd(){addLayer.hidden=false;document.body.style.overflow='hidden';addLayer.querySelector('button')?.focus();}
  function closeAdd(){addLayer.hidden=true;document.body.style.overflow='';}

  document.addEventListener('click',e=>{
    if(e.target.closest('[data-open-add]')) openAdd();
    if(e.target.closest('[data-close-add]')) closeAdd();
    if(e.target===addLayer) closeAdd();
    const tab=e.target.closest('[data-demo-tab]');
    if(tab){tab.parentElement.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));tab.classList.add('active');}
    const contact=e.target.closest('[data-demo-contact]');
    if(contact){const msg=contact.parentElement.querySelector('.contact-demo-message');if(msg) msg.textContent='Прототипът не съдържа реален телефон или лични данни.';}
  });
  document.addEventListener('change',e=>{
    if(e.target.id==='listing-category'){
      const cat=e.target.value;
      const warn=document.getElementById('animal-warning');
      if(warn) warn.hidden=cat!=='Животни';
      const sub=document.getElementById('listing-subcategory');
      const type=document.getElementById('listing-type');
      if(sub){
        const vals=cat==='Услуги'?serviceFamilies.flatMap(x=>x.slice(1)):cat==='Имоти'?propertyKinds:cat==='Животни'?animalGroups:cat==='Автомобили и МПС'?autoGroups:['Друго'];
        sub.innerHTML=selectOptions(vals,'');
      }
      if(type){
        const vals=cat==='Работа'?['Предлага работа','Търси работа']:cat==='Имоти'?['Продава имот','Отдава под наем','Търси под наем','Търси за купуване']:cat==='Животни'?['Осиновяване','Изгубено','Намерено','Стоки за животни']:['Продава','Купува','Търси','Дава'];
        type.innerHTML=selectOptions(vals,'');
      }
    }
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!addLayer.hidden)closeAdd();});
  document.addEventListener('submit',e=>{
    if(e.target.matches('[data-global-search],[data-page-search]')){
      e.preventDefault();
      const q=new FormData(e.target).get('q')?.toString().toLocaleLowerCase('bg-BG').trim()||'';
      const route = /ви[кk]|елект|ремонт|почиств|хамал|транспорт|сервиз|гуми/.test(q)?'uslugi':/работ|шофьор|продавач/.test(q)?'rabota':/апартамент|къща|имот|парцел|наем/.test(q)?'imoti':/кола|автомоб|част/.test(q)?'avtomobili':/кот|куче|живот/.test(q)?'zhivotni':q?'obyavi':'obyavi';
      location.hash=`#${route}`;
      return;
    }
    if(e.target.matches('[data-proto-form]')){
      e.preventDefault();
      const msg=e.target.querySelector('.form-message');
      if(!e.target.checkValidity()){
        msg.innerHTML='<div class="notice danger"><strong>Провери задължителните полета.</strong> Въведеното остава във формата.</div>';
        e.target.reportValidity();
        return;
      }
      msg.innerHTML='<div class="notice ok"><strong>Успешно прототипно изпращане:</strong> няма реален запис в системата. Формата демонстрира успешно състояние.</div>';
    }
  });
  window.addEventListener('hashchange',()=>{closeAdd();render();});
  if(!location.hash) location.hash='#home'; else render();
})();
