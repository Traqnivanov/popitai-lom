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
    ['Автомобилни услуги','Автосервиз','Диагностика','Гуми','Автоелектро и автоклиматици','Автомивка и detailing','Пътна помощ'],
    ['Транспорт, преместване и доставки','Товарен транспорт','Хамали','Преместване','Доставки','Бус и камион'],
    ['Красота и лична грижа','Фризьор и бръснар','Маникюр и педикюр','Козметични услуги','Грим','Немедицински масаж'],
    ['Грижа за хора и животни','Детегледачки','Грижа за възрастни','Домашни помощници','Гледане на любимци','Разходка на кучета','Grooming'],
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
    if(state==='loading') return `<div class="state-box"><strong>Зареждане…</strong>Показва се стабилен loading state без стар интерфейс под него.</div>`;
    if(state==='empty') return `<div class="state-box"><strong>Няма резултати</strong>Промени филтъра или публикувай, ако имаш подходящо съдържание.</div>`;
    if(state==='error') return `<div class="state-box"><strong>Не успяхме да заредим съдържанието</strong><p>Данните не се заменят с фалшиви записи.</p><button class="btn" type="button" onclick="location.hash=location.hash.replace('?state=error','')">Опитай отново</button></div>`;
    return normal;
  }

  function home() {
    return `<section class="hero"><div class="shell hero-grid"><div><span class="eyebrow">Лом и региона</span><h1>Намери каквото ти трябва в Лом</h1><p>Услуги, работа, имоти, обяви, местни фирми и проверена полезна информация — на едно разбираемо място.</p><form class="search-box" data-global-search><input name="q" aria-label="Търсене" placeholder="Напр. ВиК, работа, апартамент, автосервиз…"><button>Търси</button></form><div class="hero-actions"><button class="btn primary" type="button" data-open-add>＋ Публикувай</button><a class="btn ghost" href="#add/question">Не намираш? Задай въпрос</a></div></div><aside class="hero-side"><strong>Как работи</strong><ul><li>Първо търсиш по задача.</li><li>После публикуваш в правилния owner flow.</li><li>Въпросът е fallback, ако няма готов отговор.</li></ul></aside></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Обяви и услуги</h2><p>Шест основни marketplace задачи, без да те затрупваме с цялата taxonomy.</p></div><a href="#obyavi">Всички →</a></div><div class="grid cols-3">${marketplace.map(card).join('')}</div></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Местни специализирани раздели</h2><p>Съществуващите owners остават отделни, но са лесно откриваеми.</p></div></div><div class="special-grid">${specialist.map(x=>`<a class="special-card" href="#${x.id}"><span>${x.icon}</span>${x.title}</a>`).join('')}</div></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Инфо Лом</h2><p>Проверена местна информация — отделно от marketplace съдържанието.</p></div><a href="#info">Отвори Инфо Лом →</a></div><div class="grid cols-3">${['Здраве','Транспорт','Институции','Образование','Комунални услуги','Полезни телефони'].map((x,i)=>`<a class="info-card" href="#info"><h3>${['⚕️','🚌','🏛️','🎓','💡','☎️'][i]} ${x}</h3><p>Проверени записи с източник и дата на последна проверка.</p></a>`).join('')}</div></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Нови обяви и услуги</h2><p>В production тук идват само реални публични записи от техния owner.</p></div><a href="#obyavi">Виж всички →</a></div><div class="result-list">${demoRow('ВиК услуга — примерен резултат','Показва как изглежда услуга без да твърди, че реален човек я предлага.','Услуга','#detail/listing','Услуги')}${demoRow('Примерна обява за работа','Демонстрация на резултат с тип „Предлага работа“.','Работа','#detail/listing','Предлага работа')}</div></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Актуално в Лом</h2><p>Публикации и събития са различни типове, но се откриват на едно място.</p></div><a href="#aktualno">Всичко актуално →</a></div><div class="grid cols-2"><a class="content-card" href="#detail/publication"><span class="demo-label">ПРОТОТИП</span><h3><span class="badge gold">Публикация</span> Кратка местна актуализация</h3><p>Публикацията има една конкретна причина да съществува и може да води към друг owner.</p></a><a class="content-card" href="#detail/event"><span class="demo-label">ПРОТОТИП</span><h3><span class="badge green">Събитие</span> Предстоящо местно събитие</h3><p>В production се показват само реални approved и текущи/предстоящи събития.</p></a></div></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Местни фирми</h2><p>Постоянни профили, различни от конкретните обяви.</p></div><a href="#firmi">Фирми →</a></div><div class="grid cols-3">${['Ремонтна фирма — демо','Автосервиз — демо','Местна услуга — демо'].map(x=>`<a class="content-card" href="#detail/firm"><span class="demo-label">ПРОТОТИП</span><h3>${x}</h3><p>Показва Firm profile result без фалшив рейтинг или популярност.</p></a>`).join('')}</div></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Полезни статии</h2><p>Пълни local-first ръководства, не кратки публикации.</p></div><a href="#statii">Статии →</a></div><div class="grid cols-2"><a class="content-card" href="#detail/article"><span class="demo-label">ПРОТОТИП</span><h3>Как да решиш местна административна задача</h3><p>Пример за структура: местен процес → подготовка → изключения → източници.</p></a><a class="content-card" href="#detail/article"><span class="demo-label">ПРОТОТИП</span><h3>Практично ръководство за местна услуга</h3><p>Статията решава задачата докрай и може да сочи към правилния owner.</p></a></div></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Въпроси от общността</h2><p>Помощ, когато няма готов отговор.</p></div><a href="#vaprosi">Въпроси →</a></div>${demoRow('Къде в Лом мога да намеря…?','Примерен community въпрос. Не е verified Info факт.','Въпрос','#detail/question','Без фалшив брой отговори')}</div></section>`;
  }

  function hub(query) {
    const rows = `${demoRow('Примерна обява за услуга','Резултат от Listings owner.','Услуга')}${demoRow('Примерен предмет за продажба','Резултат от Listings owner.','Купува и продава')}${demoRow('Примерна позиция за работа','Резултат от Listings owner.','Работа')}`;
    return `<div class="page">${pageHead('Обяви и услуги','Един общ вход за marketplace задачите, без да смесваме lifecycle owners.')}<div class="shell"><div class="grid cols-3">${marketplace.map(card).join('')}</div><div class="section-head" style="margin-top:28px"><div><h2>Специализирани местни раздели</h2><p>Откриват се от същия hub, но запазват собствения си owner.</p></div></div><div class="special-grid">${specialist.map(x=>`<a class="special-card" href="#${x.id}"><span>${x.icon}</span>${x.title}</a>`).join('')}</div><div class="section-head" style="margin-top:32px"><div><h2>Последни резултати</h2><p>Примерни записи само за проверка на композицията.</p></div></div>${stateContent(query,`<div class="result-list">${rows}</div>`)}</div></div>`;
  }

  function familyPage(title, desc, groups, opts={}) {
    const quick = (opts.quick||groups.slice(0,6)).map(x=>`<a class="chip" href="#${opts.resultRoute||'detail/listing'}">${esc(x)}</a>`).join('');
    const cards = groups.map((g,i)=>{
      const name = Array.isArray(g)?g[0]:g;
      const subs = Array.isArray(g)?g.slice(1):[];
      return `<a class="family-card" href="#${opts.resultRoute||'detail/listing'}"><div class="icon">${opts.icons?.[i]||icons[i%icons.length]}</div><h3>${esc(name)}</h3>${subs.length?`<div class="sublist">${subs.slice(0,4).map(s=>`<span>${esc(s)}</span>`).join('')}</div><small>Всички ${subs.length} →</small>`:`<p>Разгледай релевантните резултати.</p><small>Отвори →</small>`}</a>`;
    }).join('');
    return `<div class="page">${pageHead(title,desc,'Обяви и услуги')}<div class="shell">${opts.notice||''}<form class="search-box" data-page-search style="max-width:760px"><input name="q" aria-label="Търсене" placeholder="${esc(opts.placeholder||'Какво търсиш?')}"><button>Търси</button></form><div class="chips">${quick}</div><div class="grid cols-3">${cards}</div><div class="page-tools"><a class="btn primary" href="${opts.add||'#add/listing'}">＋ ${esc(opts.addLabel||'Публикувай')}</a><a class="btn" href="#add/question">Не намираш? Задай въпрос</a></div></div></div>`;
  }

  function services(){return familyPage('Услуги','Търси по конкретна задача. Пълната taxonomy се показва след избора, не наведнъж.',serviceFamilies,{placeholder:'Напр. ВиК, почистване, автосервиз, хамали…',quick:['ВиК','Електро','Ремонти','Почистване','Автосервиз','Транспорт'],add:'#add/listing',addLabel:'Предложи или потърси услуга'});}
  function work(){return familyPage('Работа','Първо избери широка област, после конкретната професия.',workGroups,{placeholder:'Напр. шофьор, строителство, продавач…',quick:['Строителство','Шофьори','Търговия','Заведения','Производство'],addLabel:'Добави обява за работа'});}
  function properties(){return `<div class="page">${pageHead('Имоти','Първо избери намерението, после вида имот.','Обяви и услуги')}<div class="shell"><div class="tabs">${['Продава','Отдава под наем','Купува','Търси под наем'].map((x,i)=>`<button class="tab ${i===0?'active':''}" type="button" data-demo-tab>${x}</button>`).join('')}</div><div class="grid cols-4">${propertyKinds.map(x=>`<a class="family-card" href="#detail/listing"><div class="icon">🏠</div><h3>${x}</h3><p>Резултати за избраното намерение.</p></a>`).join('')}</div><div class="page-tools"><a class="btn primary" href="#add/listing">＋ Добави имот</a></div></div></div>`;}
  function goods(){return familyPage('Купува и продава','Стоките са групирани широко; конкретното се намира с търсене и подкатегории.',goodsGroups,{placeholder:'Какво купуваш или продаваш?',quick:['Телефони','Дом и градина','Дрехи','Инструменти'],addLabel:'Добави обява'});}
  function auto(){return familyPage('Автомобили','МПС, части и услуги са един тематичен вход, но не един datastore.',autoGroups,{placeholder:'Напр. автомобил, гуми, диагностика…',quick:['Автомобили','Гуми','Части','Диагностика','Пътна помощ'],notice:'<div class="notice">„Автомобилни услуги“ води към същите Service records от „Услуги“ — не се създава дублирана taxonomy.</div>',addLabel:'Добави обява'});}
  function animals(){return familyPage('Животни','Без платена продажба на живи животни на първия етап.',animalGroups,{placeholder:'Осиновяване, изгубено животно, стоки…',quick:['Кучета','Котки','Птици','Селскостопански'],notice:'<div class="notice danger"><strong>Платена продажба на живи животни не е налична.</strong> Ветеринарите са в „Здраве“, а гледането/grooming — в „Услуги“.</div>',addLabel:'Добави допустима обява'});}
  function shops(){return familyPage('Магазини','Специализиран Shop owner с шест широки семейства и по-конкретни tags.',shopGroups,{placeholder:'Какъв магазин търсиш?',quick:shopGroups.slice(0,4),resultRoute:'detail/firm',add:'#add/shop',addLabel:'Добави магазин',notice:'<div class="owner-box"><strong>Owner:</strong> Shops. Generic Listing/Firm flow не заобикаля специализирания Shop flow.</div>'});}
  function restaurants(){return familyPage('Заведения','Заведенията са фирмени профили с категория „Заведения“.',restaurantGroups,{placeholder:'Ресторант, кафе, пица, доставка…',quick:restaurantGroups.slice(0,5),resultRoute:'detail/firm',add:'#add/firm',addLabel:'Добави заведение',notice:'<div class="owner-box"><strong>Owner:</strong> Firms → категория „Заведения“. Няма втори restaurant datastore.</div>'});}
  function health(){return familyPage('Здраве и лекари','Частни практики през specialized Health flow; verified здравната информация остава в Инфо Лом.',healthGroups,{placeholder:'Лекар, специалист, стоматолог…',quick:healthGroups,resultRoute:'detail/health',add:'#add/health',addLabel:'Добави лекар / здравна услуга',notice:'<div class="owner-box"><strong>Owner:</strong> Health/Info. Generic medical listings не се използват.</div>'});}

  function info(){return `<div class="page">${pageHead('Инфо Лом','Проверена местна информация с източник и дата на последна проверка.')}<div class="shell"><div class="grid cols-3">${['Здраве','Транспорт','Институции','Образование','Комунални услуги','Полезни телефони'].map((x,i)=>`<a class="info-card" href="#detail/info"><h3>${['⚕️','🚌','🏛️','🎓','💡','☎️'][i]} ${x}</h3><p>Verified directory surface. Community мнението не става verified факт.</p></a>`).join('')}</div><div class="notice" style="margin-top:16px">Прототипът не измисля реални телефони, адреси или работно време. В production те идват само от проверения Info owner.</div></div></div>`;}
  function firms(query){return `<div class="page">${pageHead('Фирми','Постоянни местни профили. Фирмата не е обява.')}<div class="shell"><div class="page-tools"><a class="btn primary" href="#add/firm">＋ Добави фирма</a></div><div class="section-head" style="margin-top:24px"><div><h2>Фирмени профили</h2><p>Без фалшиви оценки и popularity.</p></div></div>${stateContent(query,`<div class="result-list">${demoRow('Фирма за ремонти — демо','Постоянен профил с услуги, район и контакти.','Фирма','#detail/firm','Майстори')}${demoRow('Местен сервиз — демо','Постоянен Firm profile, който може да се открива и през Автомобили.','Фирма','#detail/firm','Автомобили')}</div>`)}</div></div>`;}
  function current(){return `<div class="page">${pageHead('Актуално','Публикации и събития в един discovery surface, но с различни owner-и.')}<div class="shell"><div class="grid cols-2"><a class="content-card" href="#detail/publication"><span class="demo-label">ПРОТОТИП</span><h3><span class="badge gold">Публикация</span> Кратка местна актуализация</h3><p>Admin-only editorial authoring concept. Може да сочи към Article, Info, Listing, Firm, Event или Question.</p></a><a class="content-card" href="#detail/event"><span class="demo-label">ПРОТОТИП</span><h3><span class="badge green">Събитие</span> Предстоящо събитие</h3><p>Събитията остават при съществуващия Event owner. Няма public Add Event.</p></a></div><div class="notice" style="margin-top:16px">В production приключило събитие не се представя като предстоящо. Pending/hidden съдържание не е shareable.</div></div></div>`;}
  function articles(){return `<div class="page">${pageHead('Статии','Пълни практични local-first ръководства.')}<div class="shell"><div class="result-list">${demoRow('Как да решиш конкретна местна задача','Пълно ръководство: какво се прави в Лом, подготовка, изключения и проверени източници.','Статия','#detail/article','Ръководство')}${demoRow('Практично ръководство за местна услуга','Демонстрира дългосрочен SEO asset, не кратка публикация.','Статия','#detail/article','Local-first')}</div></div></div>`;}
  function questions(){return `<div class="page">${pageHead('Въпроси','Community помощ, когато няма готов отговор.')}<div class="shell"><div class="page-tools"><a class="btn primary" href="#add/question">＋ Задай въпрос</a></div><div class="result-list" style="margin-top:18px">${demoRow('Къде мога да намеря…?','Примерен въпрос. Community отговорът не се представя като verified Info.','Въпрос','#detail/question','Общност')}</div></div></div>`;}

  function detail(kind){
    const map={
      listing:['Обява — прототипен детайл','Обява','Listings','Състояние, описание, цена и public контакт според реалния Listing owner.'],
      firm:['Фирма — прототипен профил','Фирма','Firms','Постоянен профил със запазената граница между базов и разширен профил.'],
      article:['Статия — прототип','Статия','Editorial/Articles','Пълно local-first ръководство с проверени източници.'],
      publication:['Публикация — прототип','Публикация','Publications','Кратка конкретна местна актуализация; Admin-only authoring при launch.'],
      event:['Събитие — прототип','Събитие','Events','Само approved и текущо/предстоящо събитие в production.'],
      question:['Въпрос — прототип','Въпрос','Questions','Community знание, не verified Info.'],
      health:['Здравен профил — прототип','Здраве','Health/Info','Specialized Health owner, не generic listing.'],
      info:['Инфо Лом — прототипен запис','Инфо','Info Lom','Verified record с източник и freshness.']
    };
    const [title,type,owner,desc]=map[kind]||map.listing;
    const gallery = ['listing','firm'].includes(kind)?`<div class="gallery-demo"><div>Примерна медия</div><div>Снимка</div><div>Снимка</div></div>`:'';
    const sideAction = kind==='event'?'<div class="notice">Няма public Add Event.</div>':kind==='publication'?'<div class="admin-note">Публикацията се създава от Admin editorial flow при launch.</div>':kind==='info'?'<div class="notice ok">Проверено по owner source · примерен state, не реален факт.</div>':'<button class="btn primary" type="button">Основно действие</button>';
    return `<div class="page">${pageHead(title,desc)}<div class="shell detail"><article class="detail-main"><span class="demo-label">ПРОТОТИПЕН ЗАПИС — НЕ Е РЕАЛНО СЪДЪРЖАНИЕ</span><h2>${type}: пример за цялостен detail екран</h2>${gallery}<p>Този екран проверява информационната йерархия и правилния owner destination. Не съдържа измислен рейтинг, популярност или реални контактни данни.</p><h3>Описание</h3><p>${desc}</p><h3>Следваща стъпка</h3><p>Действията се определят от lifecycle owner-а, а не от това през коя категория е намерен записът.</p></article><aside class="detail-side"><div class="kv"><strong>Тип</strong><span>${type}</span></div><div class="kv"><strong>Owner</strong><span>${owner}</span></div><div class="kv"><strong>Статус</strong><span>Публичен prototype state</span></div><div style="margin-top:16px">${sideAction}</div></aside></div></div>`;
  }

  const formConfig={
    listing:{title:'Добави обява',owner:'Listings',note:'Същият owner form обслужва стоки, услуги, работа, имоти, автомобили и допустимите обяви за животни.',fields:[['Заглавие','text'],['Категория','select'],['Подкатегория / вид','select'],['Тип обява','select'],['Описание','textarea'],['Цена','number'],['Телефон','tel'],['Град / район','text']]},
    firm:{title:'Добави фирма',owner:'Firms',note:'Постоянен профил. Не се превръща автоматично в Listing.',fields:[['Име на фирмата','text'],['Категория','select'],['Телефон','tel'],['Кратко описание','textarea']]},
    shop:{title:'Добави магазин',owner:'Shops',note:'Специализираният Shop flow остава отделен.',fields:[['Име на магазина','text'],['Категория','select'],['Телефон','tel'],['Адрес','text'],['Работно време','text'],['Какво предлага','textarea']]},
    health:{title:'Добави лекар / здравна услуга',owner:'Health/Info',note:'Specialized Health submission. Generic medical listing не се използва.',fields:[['Тип','select'],['Име','text'],['Специалност / услуга','text'],['Телефон','tel'],['Адрес / кабинет','text'],['Източник / уточнение','textarea']]},
    question:{title:'Задай въпрос',owner:'Questions',note:'Q&A е fallback, когато няма готов отговор.',fields:[['Категория','select'],['Заглавие на въпроса','text'],['Подробности','textarea']]}
  };

  function formPage(kind,query){
    const c=formConfig[kind]||formConfig.listing;
    const state=query.get('state');
    const edit=state==='edit';
    if(state==='pending') return `<div class="page">${pageHead(c.title,'Prototype pending state.')}<div class="shell form-wrap"><div class="notice"><strong>Изпратено за преглед.</strong> Последната одобрена публична версия остава видима там, където owner flow го изисква.</div></div></div>`;
    if(state==='success') return `<div class="page">${pageHead(c.title,'Prototype success state.')}<div class="shell form-wrap"><div class="notice ok"><strong>Успешно изпратено.</strong> Това е само prototype state — няма реален backend write.</div><a class="btn" href="#home" style="margin-top:14px">Към началото</a></div></div>`;
    const fields=c.fields.map(([label,type],i)=>{
      if(type==='textarea') return `<div class="field"><label>${label}</label><textarea rows="5" ${i<2?'required':''} placeholder="Прототипно поле"></textarea><span class="help">Въведеното не се изпраща никъде.</span></div>`;
      if(type==='select') return `<div class="field"><label>${label}</label><select ${i<2?'required':''}><option value="">Избери</option><option>Примерна стойност</option><option>Друго</option></select></div>`;
      return `<div class="field"><label>${label}</label><input type="${type}" ${i<2?'required':''} placeholder="${type==='tel'?'0876 123 456':'Прототипно поле'}"></div>`;
    }).join('');
    const animalWarning=kind==='listing'?'<div class="notice danger">При категория „Животни“ платена продажба на живи животни не се предлага. Достъпни са осиновяване, изгубени/намерени и стоки.</div>':'';
    return `<div class="page">${pageHead(edit?`Редактирай — ${c.title}`:c.title,'Content-complete prototype form.')}<div class="shell form-wrap"><div class="owner-box"><strong>Owner:</strong> ${c.owner}. ${c.note}</div>${animalWarning}<form class="proto-form" data-proto-form novalidate>${fields}<div class="field"><label><input type="checkbox" required> Приемам правилата на общността</label></div><div class="form-actions"><button class="btn primary" type="submit">${edit?'Изпрати редакцията':'Изпрати за преглед'}</button><a class="btn" href="#home">Отказ</a></div><div class="form-message" aria-live="polite"></div></form></div></div>`;
  }

  function staticPage(title,text){return `<div class="page">${pageHead(title,text)}<div class="shell"><div class="content-card"><p>${esc(text)}</p><p>Този екран е включен, за да няма навигационен линк към несвързан placeholder.</p></div></div></div>`;}

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
    else if(path.startsWith('detail/')) html=detail(path.split('/')[1]);
    else if(path.startsWith('add/')) html=formPage(path.split('/')[1],query);
    else if(path==='about') html=staticPage('За сайта','Попитай.Лом е местен портал за намиране, публикуване и community помощ.');
    else if(path==='rules') html=staticPage('Правила','Прототипът показва destination, без да копира целия production rules документ.');
    else if(path==='contacts') html=staticPage('Контакти','Контактният екран е отделен и не се смесва с marketplace owners.');
    else if(path==='profile') html=staticPage('Профил','Профилът е естественото място за собствено съдържание, редакции и statuses.');
    else html=staticPage('Страницата не е намерена','Този prototype route не съществува.');
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
      msg.innerHTML='<div class="notice ok"><strong>Prototype success:</strong> няма реален backend write. Формата демонстрира success state.</div>';
    }
  });
  window.addEventListener('hashchange',()=>{closeAdd();render();});
  if(!location.hash) location.hash='#home'; else render();
})();
