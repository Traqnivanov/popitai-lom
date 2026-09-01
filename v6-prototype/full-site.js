(() => {
  "use strict";

  const app = document.getElementById("app");
  const addSheet = document.getElementById("add-sheet");
  const toast = document.getElementById("toast");
  const drawer = document.getElementById("mobile-drawer");
  const menuTrigger = document.getElementById("menu-trigger");

  const icons = {
    home: '<svg viewBox="0 0 24 24"><path d="m3 11 9-8 9 8v10h-6v-6H9v6H3V11Z"/></svg>',
    list: '<svg viewBox="0 0 24 24"><path d="M7 4h10a2 2 0 0 1 2 2v14H5V6a2 2 0 0 1 2-2Z"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></svg>',
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    tools: '<svg viewBox="0 0 24 24"><path d="m14 6 4-4 4 4-4 4M10 18l-4 4-4-4 4-4"/><path d="M15 9 9 15M9 4l11 11M4 9l11 11"/></svg>',
    health: '<svg viewBox="0 0 24 24"><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3Z"/></svg>',
    briefcase: '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2"/></svg>',
    car: '<svg viewBox="0 0 24 24"><path d="m5 16-1-4 2-5h12l2 5-1 4"/><path d="M4 16v3h3v-2h10v2h3v-3M6 12h12"/><circle cx="7" cy="14" r="1"/><circle cx="17" cy="14" r="1"/></svg>',
    house: '<svg viewBox="0 0 24 24"><path d="m3 11 9-8 9 8v10H3V11Z"/><path d="M9 21v-6h6v6"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z"/><path d="m19 17 .8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17Z"/></svg>',
    garden: '<svg viewBox="0 0 24 24"><path d="M12 21V10"/><path d="M12 14c-5 0-8-3-8-8 5 0 8 3 8 8ZM12 10c0-4 3-7 7-7 0 4-3 7-7 7Z"/></svg>',
    shop: '<svg viewBox="0 0 24 24"><path d="M4 9v11h16V9M3 9l2-5h14l2 5"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 20v-6h6v6"/></svg>',
    food: '<svg viewBox="0 0 24 24"><path d="M6 3v8M3 3v5c0 2 1 3 3 3s3-1 3-3V3M6 11v10M15 3v18M15 3c4 1 5 4 5 7h-5"/></svg>',
    chip: '<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 1v5M15 1v5M9 18v5M15 18v5M1 9h5M1 15h5M18 9h5M18 15h5M10 10h4v4h-4z"/></svg>',
    baby: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M9 11h.01M15 11h.01M9 15c2 2 4 2 6 0M8 4c1-2 3-3 5-2"/></svg>',
    paw: '<svg viewBox="0 0 24 24"><path d="M8 12c-3 2-4 5-2 7 2 2 4 0 6 0s4 2 6 0c2-2 1-5-2-7-3-2-5-2-8 0Z"/><circle cx="6" cy="8" r="2"/><circle cx="10" cy="5" r="2"/><circle cx="14" cy="5" r="2"/><circle cx="18" cy="8" r="2"/></svg>',
    shirt: '<svg viewBox="0 0 24 24"><path d="m8 4-5 3 3 5 2-1v10h8V11l2 1 3-5-5-3c-1 2-7 2-8 0Z"/></svg>',
    sport: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 4 4 3 4-3M4 10l4 3-2 5M20 10l-4 3 2 5M8 13h8M10 20l2-4 2 4"/></svg>',
    more: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>',
    building: '<svg viewBox="0 0 24 24"><path d="M4 21V8l8-5 8 5v13H4Z"/><path d="M9 21v-5h6v5M8 10h2M14 10h2"/></svg>',
    calendar: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M7 14h3M14 14h3M7 18h3"/></svg>',
    institution: '<svg viewBox="0 0 24 24"><path d="M3 9h18M5 9v9M9 9v9M15 9v9M19 9v9M3 21h18M12 3 3 7h18l-9-4Z"/></svg>',
    transport: '<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="16" rx="3"/><path d="M8 19v2M16 19v2M7 8h10M8 14h.01M16 14h.01"/></svg>',
    school: '<svg viewBox="0 0 24 24"><path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 11v5c4 3 8 3 12 0v-5M22 9v6"/></svg>',
    bank: '<svg viewBox="0 0 24 24"><path d="M3 9h18M5 9v9M10 9v9M14 9v9M19 9v9M2 21h20M12 3 2 7h20L12 3Z"/></svg>',
    utility: '<svg viewBox="0 0 24 24"><path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z"/></svg>',
    chat: '<svg viewBox="0 0 24 24"><path d="M4 4h16v12H9l-5 4V4Z"/><path d="M8 9h8M8 12h5"/></svg>',
    article: '<svg viewBox="0 0 24 24"><path d="M6 3h9l3 3v15H6V3Z"/><path d="M14 3v4h4M9 11h6M9 15h6"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><path d="M5 3h4l2 5-3 2c2 4 4 6 8 8l2-3 5 2v4c0 1-1 2-2 2C11 23 1 13 1 5c0-1 1-2 2-2h2Z"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2"/></svg>',
    share: '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.5 10.5 7-4M8.5 13.5l7 4"/></svg>',
    flag: '<svg viewBox="0 0 24 24"><path d="M5 22V3M5 4h12l-2 4 2 4H5"/></svg>',
    edit: '<svg viewBox="0 0 24 24"><path d="m4 20 4-1 11-11-3-3L5 16l-1 4ZM14 6l3 3"/></svg>'
  };

  const categories = [
    ["construction","Строителство и ремонти","Майстори, ВиК, електро, покриви","tools"],
    ["health","Здраве и лекари","Лекари, аптеки, лаборатории","health"],
    ["work","Работа","Обяви за работа в Лом","briefcase"],
    ["cars","Автомобили","Коли, сервизи, гуми, части","car"],
    ["property","Имоти","Продажби, наеми и търсене","house"],
    ["beauty","Красота","Фризьори, козметика и грижа","sparkle"],
    ["home-garden","Дом и градина","Дом, двор, обзавеждане","garden"],
    ["shops","Магазини","Местни магазини по категории","shop"],
    ["restaurants","Заведения и храна","Заведения, храна и препоръки","food"],
    ["electronics","Електроника","Техника и електроника","chip"],
    ["kids","Деца и бебета","Детски стоки и услуги","baby"],
    ["animals","Животни","Домашни любимци и обяви","paw"],
    ["fashion","Мода","Дрехи, обувки и аксесоари","shirt"],
    ["sport","Спорт и хоби","Спорт, хоби и свободно време","sport"],
    ["services","Други услуги","Местни услуги извън основните групи","building"],
    ["other","Други обяви","Останалите обяви в marketplace","more"]
  ];

  const infoFamilies = [
    ["health","Здраве","Болница, лекари, аптеки","health"],
    ["institutions","Институции","Община, НОИ, полиция","institution"],
    ["transport","Транспорт","Автогара, БДЖ, таксита","transport"],
    ["education","Образование и култура","Училища и културни места","school"],
    ["banks","Банки и банкомати","Банки, ATM и услуги","bank"],
    ["utilities","Комунални услуги","Вода, ток, куриери, интернет","utility"]
  ];

  const guides = [
    ["pension","Институции","Как да се пенсионираш в Лом","Какво да провериш, какви документи да подготвиш и къде се подава."],
    ["id-card","Институции","Как се подменя лична карта в Лом","Стъпките, документите и връзката към актуалната официална информация."],
    ["signal","Институции","Как да подадеш сигнал до община или институция","Кога, къде и как да опишеш проблема, за да бъде разгледан."],
    ["master","Строителство","Как да избереш майстор и оферта","Какво да провериш преди уговорка, плащане и започване."],
    ["water","Комунални","Какво да направиш при проблем с вода или ток","Къде е актуалният официален контакт и каква информация да подготвиш."],
    ["school","Образование","Записване на дете в детска градина или училище","Процесът и връзките към актуалните местни източници."]
  ];

  let currentRoute = "home";
  let context = {};
  let toastTimer = null;

  function icon(name) { return icons[name] || icons.more; }
  function iconBox(name) { return `<span class="icon-box">${icon(name)}</span>`; }
  function esc(value) { return String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[ch]); }

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3200);
  }

  function closeModal() { addSheet.hidden = true; document.body.style.overflow = ""; }
  function openModal() { addSheet.hidden = false; document.body.style.overflow = "hidden"; addSheet.querySelector("button")?.focus(); }
  function closeDrawer() { drawer.hidden = true; menuTrigger.setAttribute("aria-expanded", "false"); }

  function updateStaticIcons() {
    document.querySelectorAll("[data-icon]").forEach(el => { el.innerHTML = icon(el.dataset.icon); });
  }

  function activeNav() {
    const group = currentRoute === "home" ? "home" :
      ["marketplace","categories","category","listing-detail","form-listing"].includes(currentRoute) ? "marketplace" :
      ["firms","firm-detail","form-firm","restaurants"].includes(currentRoute) ? "firms" :
      ["info","info-detail","health","form-health","correction"].includes(currentRoute) ? "info" :
      ["articles","article-detail"].includes(currentRoute) ? "articles" :
      currentRoute === "profile" || currentRoute === "auth" ? "profile" : "";
    document.querySelectorAll("[data-nav]").forEach(btn => btn.classList.toggle("active", btn.dataset.nav === group));
    document.querySelectorAll("[data-mobile-nav]").forEach(btn => btn.classList.toggle("active", btn.dataset.mobileNav === group));
  }

  function breadcrumbs(items) {
    return `<div class="container breadcrumbs"><button type="button" data-route="home">Начало</button>${items.map((item, i) => `<span>›</span>${i === items.length - 1 ? `<strong>${esc(item.label)}</strong>` : `<button type="button" data-route="${esc(item.route)}">${esc(item.label)}</button>`}`).join("")}</div>`;
  }

  function pageHead(kicker, title, description, actions = "") {
    return `<section class="page-head"><div class="container page-head-row"><div><span class="kicker">${esc(kicker)}</span><h1>${esc(title)}</h1><p>${esc(description)}</p></div>${actions ? `<div class="page-actions">${actions}</div>` : ""}</div></section>`;
  }

  function homePage() {
    const priority = categories.slice(0,4).map(([id,title,desc,ic],i) => {
      const route = id === "health" ? "health" : "category";
      return `<button class="category-card ${i===0?"featured":""} ${id==="health"?"health":""}" type="button" data-route="${route}" data-category="${id}">${iconBox(ic)}<strong>${title}</strong><small>${desc}</small></button>`;
    }).join("");
    const discover = [
      ["shops","Магазини","Местни магазини по категории","shop"],
      ["restaurants","Заведения","Заведения и местни препоръки","food"],
      ["firms","Фирми","Постоянни местни профили","building"],
      ["events","Събития","Предстоящи одобрени събития","calendar"]
    ].map(([route,title,desc,ic]) => `<button class="discover-card" type="button" data-route="${route}">${iconBox(ic)}<div><strong>${title}</strong><small>${desc}</small></div><span class="card-arrow">→</span></button>`).join("");
    const info = infoFamilies.map(([id,title,desc]) => `<button class="info-card" type="button" data-route="${id === "health" ? "health" : "info-detail"}" data-info="${id}"><strong>${title}</strong><small>${desc}</small></button>`).join("");
    const guideCards = guides.slice(0,3).map(([id,topic,title,desc]) => `<button class="guide-card" type="button" data-route="article-detail" data-article="${id}"><span class="topic">${topic}</span><h3>${title}</h3><p>${desc}</p></button>`).join("");
    return `<div class="page home-page">
      <section class="hero"><div class="container hero-grid"><div><span class="kicker">Лом на едно място</span><h1>Какво търсиш в Лом?</h1><p>Намери проверена информация, местни услуги, работа, имоти, фирми и полезни отговори — всичко за Лом на едно място.</p><form class="search-box" data-search-form><input type="search" name="q" placeholder="Например: ВиК майстор, НОИ, работа, аптека..." aria-label="Търси в Попитай.Лом"><button type="submit">Търси</button></form><div class="hints"><button type="button" data-search-query="ВиК майстор">ВиК майстор</button><button type="button" data-search-query="аптека Лом">Аптека</button><button type="button" data-search-query="работа Лом">Работа</button></div></div><aside class="hero-side"><strong>Едно търсене, правилният източник</strong><p>Проверени градски факти, местни доставчици, обяви, въпроси и ръководства остават различни типове съдържание, но се намират от едно място.</p></aside></div></section>
      <section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Бърз старт</span><h2>Основни категории</h2></div><button class="text-button" type="button" data-route="categories">Всички категории →</button></div><div class="category-grid home-priority">${priority}</div></div></section>
      <section class="section soft"><div class="container"><div class="section-head"><div><span class="eyebrow">Местни места и профили</span><h2>Открий в Лом</h2></div></div><div class="discover-grid">${discover}</div></div></section>
      <section class="section"><div class="container"><div class="info-panel"><div class="info-panel-head"><span class="verified-mark">${icon("check")}</span><div><span class="eyebrow">Инфо Лом</span><h2>Проверена информация</h2></div></div><div class="info-grid">${info}</div><div style="margin-top:15px"><button class="text-button" type="button" data-route="info">Всичко в Инфо Лом →</button></div></div></div></section>
      <section class="section soft"><div class="container"><div class="section-head"><div><span class="eyebrow">Стъпка по стъпка</span><h2>Полезни ръководства</h2></div><button class="text-button" type="button" data-route="articles">Всички статии →</button></div><div class="guide-grid">${guideCards}</div></div></section>
      <section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Въпроси и препоръки</span><h2>Полезно от хората в Лом</h2></div><button class="text-button" type="button" data-route="questions">Всички въпроси →</button></div><div class="community-list"><button class="community-row" type="button" data-route="question-detail" data-question="master"><div class="body"><span class="badge">Строителство</span><strong>Кой препоръчва добър майстор за баня?</strong><small>4 одобрени отговора</small></div><span class="card-arrow">→</span></button><button class="community-row" type="button" data-route="question-detail" data-question="cars"><div class="body"><span class="badge">Автомобили</span><strong>Къде в Лом правят добра диагностика?</strong><small>3 одобрени отговора</small></div><span class="card-arrow">→</span></button></div></div></section>
    </div>`;
  }

  function categoriesPage() {
    const cards = categories.map(([id,title,desc,ic]) => {
      const route = id === "health" ? "health" : id === "shops" ? "shops" : id === "restaurants" ? "restaurants" : "category";
      return `<button class="category-card" type="button" data-route="${route}" data-category="${id}">${iconBox(ic)}<strong>${title}</strong><small>${desc}</small></button>`;
    }).join("");
    return `<div class="page">${breadcrumbs([{label:"Всички категории",route:"categories"}])}${pageHead("16 тематични входа","Всички категории","Избери какво ти трябва. Категорията е тема — резултатите идват от правилния реален owner: обяви, фирми, проверена информация, магазини или общност.")}<section class="section"><div class="container"><div class="category-grid">${cards}</div></div></section></div>`;
  }

  const categoryMeta = {
    construction:{title:"Строителство и ремонти",desc:"Намери майстор, фирма или активна обява за ремонт в Лом.",subs:["Цялостни ремонти","Бани и плочки","ВиК","Електро","Покриви","Боядисване","Дограма","Климатици"],owner:"Firms + Listings"},
    work:{title:"Работа",desc:"Предложения и търсене на работа в Лом. Данните остават в Listings owner.",subs:["Предлага работа","Търси работа"],owner:"Listings"},
    cars:{title:"Автомобили",desc:"Коли, авточасти и местни автомобилни услуги.",subs:["Автомобили","Авточасти","Автосервизи","Диагностика","Гуми","Автомивки","Пътна помощ"],owner:"Listings + relevant Firms"},
    property:{title:"Имоти",desc:"Продажба, наем и търсене на имоти в Лом.",subs:["Продава","Отдава под наем","Търси под наем","Търси за купуване"],owner:"Listings"},
    beauty:{title:"Красота",desc:"Местни услуги, профили и обяви за красота и грижа.",subs:["Фризьори","Козметика","Маникюр","Грижа"],owner:"Firms + Listings"},
    "home-garden":{title:"Дом и градина",desc:"Обяви и услуги за дома, двора и обзавеждането.",subs:["Мебели","Двор","Домашна помощ","Други"],owner:"Listings"},
    electronics:{title:"Електроника",desc:"Техника и електроника за продажба или търсене.",subs:["Телефони","Компютри","Телевизори","Друга техника"],owner:"Listings"},
    kids:{title:"Деца и бебета",desc:"Стоки и полезно местно съдържание за деца и бебета.",subs:["Детски стоки","Дрехи","Колички","Други"],owner:"Listings"},
    animals:{title:"Животни",desc:"Обяви, услуги и полезни местни връзки за домашни любимци.",subs:["Домашни любимци","Храна и аксесоари","Грижа"],owner:"Listings + Health where factual"},
    fashion:{title:"Мода",desc:"Дрехи, обувки и аксесоари.",subs:["Дрехи","Обувки","Аксесоари"],owner:"Listings"},
    sport:{title:"Спорт и хоби",desc:"Спорт, хоби и свободно време.",subs:["Спорт","Хоби","Свободно време"],owner:"Listings"},
    services:{title:"Други услуги",desc:"Местни услуги извън основните специализирани групи.",subs:["Домашна помощ","Технически услуги","Фото и видео","Професионални услуги","Обучение","Транспорт и доставки"],owner:"Listings + relevant Firms"},
    other:{title:"Други обяви",desc:"Останалите marketplace обяви, които не попадат в специализираните групи.",subs:["Друго","Подарява","Търси"],owner:"Listings"}
  };

  function categoryPage(id) {
    const meta = categoryMeta[id] || {title:"Категория",desc:"Тематичен V6 вход към релевантното съдържание.",subs:["Всички"],owner:"Owner-aware"};
    const isConstruction = id === "construction";
    const ownerRows = isConstruction ? `<div class="result-section-title"><h2>Местни изпълнители</h2><span class="badge priority">Firms owner</span></div><div class="result-list"><article class="result-card"><div class="logo">ИР</div><div class="body"><div class="badges"><span class="badge verified">Проверен профил</span><span class="badge priority">Защитен приоритет</span></div><h3>Иванов Ремонти</h3><p>Релевантен пример за protected provider ordering вътре в реалния Construction candidate set.</p></div><div class="actions"><button type="button" data-route="firm-detail">Виж профила</button><button type="button" data-action="call">Обади се</button></div></article></div>` : "";
    return `<div class="page">${breadcrumbs([{label:"Обяви и услуги",route:"marketplace"},{label:meta.title,route:"category"}])}${pageHead("Категория",meta.title,meta.desc,`<button class="primary" type="button" data-route="form-listing" data-prefill-category="${id}">+ Добави обява</button><button class="secondary" type="button" data-route="form-question" data-prefill-category="${id}">Попитай Лом</button>`)}<section class="section"><div class="container two-column"><div><form class="search-box" data-search-form><input type="search" name="q" placeholder="Търси в ${esc(meta.title)}"><button>Намери</button></form><div class="subcategory-grid">${meta.subs.map(s=>`<button type="button" data-action="filter">${esc(s)}</button>`).join("")}</div><div class="filter-row"><button class="active" type="button">Всички</button><button type="button">Предлагат</button><button type="button">Търсят</button><button type="button">Фирми</button></div>${ownerRows}<div class="result-section-title"><h2>Активни резултати</h2><span class="badge">${esc(meta.owner)}</span></div><div class="result-list"><article class="result-card"><div class="logo">О</div><div class="body"><div class="badges"><span class="badge">Одобрена обява</span></div><h3>${isConstruction ? "Ремонт на баня и полагане на плочки" : `Примерен резултат в ${esc(meta.title)}`}</h3><p>Статичен prototype запис за проверка на общата карта, owner labels и действия.</p></div><div class="actions"><button type="button" data-route="listing-detail">Виж обявата</button></div></article><article class="result-card"><div class="logo">Т</div><div class="body"><div class="badges"><span class="badge">Търси</span></div><h3>${isConstruction ? "Търся майстор за малък ВиК ремонт" : `Търсене в ${esc(meta.title)}`}</h3><p>Втори пример, който показва Offer/Seek presentation без нов backend owner.</p></div><div class="actions"><button type="button" data-route="listing-detail">Виж обявата</button></div></article></div></div><aside><div class="side-card"><span class="eyebrow">Owner boundary</span><h3>${esc(meta.owner)}</h3><p>Категорията организира съдържанието по тема, но записът остава в своя authoritative owner.</p></div><div class="side-card"><span class="eyebrow">Полезно</span><h3>Свързано ръководство</h3><p>Ръководствата обясняват процеса, без да копират променливи verified facts.</p><button class="text-button" type="button" data-route="articles">Виж ръководствата →</button></div></aside></div></section></div>`;
  }

  function marketplacePage() {
    const groups = [
      ["construction","Майстори и ремонти","8 подкатегории за ремонтни услуги"],
      ["cars","Автомобили","Коли, части и автомобилни услуги"],
      ["services","Други услуги","Домашна помощ, технически и професионални услуги"],
      ["other","Други обяви","Електроника, имоти, работа, деца, спорт и още"]
    ];
    return `<div class="page">${breadcrumbs([{label:"Обяви и услуги",route:"marketplace"}])}${pageHead("Marketplace","Обяви и услуги","Търси, предлагай или търси нещо конкретно. Един публичен marketplace вход, без конкурентно второ дърво „Категории“.",`<button class="primary" type="button" data-route="form-listing">+ Добави обява</button>`)}<section class="section"><div class="container"><form class="search-box" data-search-form><input type="search" name="q" placeholder="Какво търсиш? Услуга, работа, имот, автомобил..."><button>Търси</button></form><div class="section-head" style="margin-top:34px"><div><span class="eyebrow">4 главни групи</span><h2>Избери посока</h2></div><button class="text-button" data-route="categories">Всички 16 теми →</button></div><div class="market-grid">${groups.map(([id,title,desc],i)=>`<button class="market-card" type="button" data-route="category" data-category="${id}"><span class="number">${i+1}</span><strong>${title}</strong><small>${desc}</small></button>`).join("")}</div><div class="result-section-title"><h2>Нови активни обяви</h2><span class="badge">approved + active</span></div><div class="result-list"><article class="result-card"><div class="logo">О</div><div class="body"><span class="badge">Предлага</span><h3>Ремонт и боядисване — примерна обява</h3><p>Лом · добавена наскоро</p></div><div class="actions"><button data-route="listing-detail">Виж обявата</button></div></article><article class="result-card"><div class="logo">Р</div><div class="body"><span class="badge">Работа</span><h3>Търси се помощник — примерен запис</h3><p>Работа остава Listings-owned.</p></div><div class="actions"><button data-route="listing-detail">Виж обявата</button></div></article></div></div></section></div>`;
  }

  function listingDetailPage() {
    return `<div class="page">${breadcrumbs([{label:"Обяви и услуги",route:"marketplace"},{label:"Обява",route:"listing-detail"}])}${pageHead("Одобрена обява","Ремонт на баня и полагане на плочки","Примерна public detail страница, която показва owner-native действия и share/report позицията.")}<section class="section"><div class="container detail-layout"><div><article class="detail-card"><div class="badges"><span class="badge verified">Публична</span><span class="badge">Предлага услуга</span></div><h2>Ремонт на баня и полагане на плочки</h2><p>Извършвам ремонтни дейности в Лом и района. Текстът е prototype пример, не реална оферта.</p><div class="detail-meta"><div class="meta-box"><small>Цена</small><strong>По договаряне</strong></div><div class="meta-box"><small>Район</small><strong>Лом</strong></div><div class="meta-box"><small>Категория</small><strong>Строителство и ремонти</strong></div><div class="meta-box"><small>Статус</small><strong>Одобрена / активна</strong></div></div><div class="detail-actions"><button class="primary" data-action="call">Обади се</button><button class="secondary" data-action="share">Сподели</button><button class="secondary" data-route="report">Докладвай</button></div></article></div><aside><div class="side-card"><span class="eyebrow">Същата тема</span><h3>Намери още</h3><button class="text-button" data-route="category" data-category="construction">Строителство и ремонти →</button></div><div class="side-card"><span class="eyebrow">Статус</span><p>Pending/private/rejected обява няма публичен share CTA. Тук е показан public approved пример.</p></div></aside></div></section></div>`;
  }

  function firmsPage() {
    return `<div class="page">${breadcrumbs([{label:"Фирми",route:"firms"}])}${pageHead("Местни доставчици","Фирми","Постоянни одобрени профили на местни фирми и доставчици.",`<button class="primary" data-route="form-firm">+ Добави фирма</button>`)}<section class="section"><div class="container"><form class="search-box" data-search-form><input name="q" placeholder="Търси фирма, услуга или име"><button>Търси</button></form><div class="filter-row"><button class="active">Всички</button><button>Строителство</button><button>Красота</button><button>Автомобили</button><button>Заведения</button></div><div class="result-section-title"><h2>Местни профили</h2><span class="badge verified">approved Firms</span></div><div class="result-list"><article class="result-card"><div class="logo">ИР</div><div class="body"><div class="badges"><span class="badge verified">Проверен профил</span><span class="badge priority">Защитен приоритет при релевантност</span></div><h3>Иванов Ремонти</h3><p>Цялостни ремонти, шпакловка, боядисване и довършителни дейности.</p></div><div class="actions"><button data-route="firm-detail">Виж профила</button><button data-action="call">Обади се</button></div></article><article class="result-card"><div class="logo">М</div><div class="body"><span class="badge">Фирма</span><h3>Местен бизнес — prototype</h3><p>Пример за стандартен Firms card.</p></div><div class="actions"><button data-route="firm-detail">Виж профила</button></div></article></div></div></section></div>`;
  }

  function firmDetailPage() {
    return `<div class="page">${breadcrumbs([{label:"Фирми",route:"firms"},{label:"Иванов Ремонти",route:"firm-detail"}])}${pageHead("Фирмен профил","Иванов Ремонти","Representative V6 expanded-profile presentation. Реалните production данни остават при Firms owner.")}<section class="section"><div class="container detail-layout"><div><article class="detail-card"><div class="badges"><span class="badge verified">Одобрен профил</span></div><h2>Кратко представяне</h2><p>Тук стои approved short intro. V6 не премахва съществуващите expanded sections, а ги подрежда в единен detail layout.</p><div class="detail-actions"><button class="primary" data-action="call">Обади се</button><button class="secondary" data-action="contact">Оферта</button><button class="secondary" data-action="site">Сайт</button><button class="secondary" data-action="share">Сподели</button></div></article><article class="detail-card"><h2>Услуги</h2><div class="subcategory-grid"><button>Цялостни ремонти</button><button>Шпакловка</button><button>Боядисване</button><button>Довършителни дейности</button></div></article><article class="detail-card"><h2>Галерия</h2><div class="upload-box">Prototype място за текущата фирмена галерия / „Преди и след“ според approved profile data.</div></article></div><aside><div class="side-card"><span class="eyebrow">Контакти</span><h3>Лом и района</h3><p>Телефон, работно време и сайт се показват само ако owner record ги има и разрешава.</p></div><div class="side-card"><button class="text-button" data-route="category" data-category="construction">Виж още в Строителство →</button><button class="text-button" data-route="report">Докладвай проблем →</button></div></aside></div></section></div>`;
  }

  function infoPage() {
    const cards = infoFamilies.map(([id,title,desc,ic])=>`<button class="category-card" type="button" data-route="${id==="health"?"health":"info-detail"}" data-info="${id}">${iconBox(ic)}<strong>${title}</strong><small>${desc}</small></button>`).join("");
    return `<div class="page">${breadcrumbs([{label:"Инфо Лом",route:"info"}])}${pageHead("Проверено за града","Инфо Лом","Проверени контакти и полезна градска информация. Шестте одобрени семейства остават видими и равнопоставени.")}<section class="section"><div class="container"><div class="category-grid">${cards}</div><div class="inline-note" style="margin-top:22px">Точните телефони, адреси, работно време, служители и други променливи факти се показват от authoritative Info owner с source/freshness, а не се копират в статичен V6 код.</div></div></section></div>`;
  }

  function infoDetailPage(id) {
    const map = Object.fromEntries(infoFamilies.map(x=>[x[0],x]));
    const [,title,desc,ic] = map[id] || infoFamilies[1];
    const examples = {
      institutions:["Община Лом","НОИ / пенсионно осигуряване","Полиция","Пожарна и спешни контакти"],
      transport:["Автогара","БДЖ / ЖП гара","Таксита","Транспортни контакти"],
      education:["Училища","Детски градини","Читалища и библиотека","Музеи и културни места"],
      banks:["Банкови офиси","Банкомати","Работно време и услуги"],
      utilities:["ВиК","Електроразпределение","Интернет и TV","Куриери и ежедневни услуги"]
    };
    return `<div class="page">${breadcrumbs([{label:"Инфо Лом",route:"info"},{label:title,route:"info-detail"}])}${pageHead("Проверена информация",title,desc,`<button class="secondary" data-route="correction" data-info="${id}">Предложи корекция</button>`)}<section class="section"><div class="container two-column"><div><div class="result-list">${(examples[id]||[title]).map((x,i)=>`<article class="result-card"><div class="logo" style="background:#167c63">${icon(ic)}</div><div class="body"><div class="badges"><span class="badge verified">Потвърдено</span>${i===0?'<span class="badge">официален/strong source</span>':''}</div><h3>${x}</h3><p>Representative verified Info row. Точните текущи стойности идват от Info owner.</p></div><div class="actions"><button data-action="info-open">Виж информацията</button></div></article>`).join("")}</div></div><aside><div class="side-card"><span class="eyebrow">Доверие</span><div class="trust-box"><strong>Източник + потвърждение</strong>Публичният detail показва кога и от какъв тип източник е потвърдена информацията.</div></div><div class="side-card"><span class="eyebrow">Свързано ръководство</span><button class="text-button" data-route="article-detail" data-article="pension">Как да се пенсионираш в Лом →</button></div></aside></div></section></div>`;
  }

  function healthPage() {
    return `<div class="page">${breadcrumbs([{label:"Инфо Лом",route:"info"},{label:"Здраве и лекари",route:"health"}])}${pageHead("Здраве — specialized owner","Здраве и лекари","Същият V6 category shell, но с verified Health/Info owner и по-строги trust/freshness правила.",`<button class="primary" data-route="form-health">Предложи лекар или практика</button><button class="secondary" data-route="correction" data-info="health">Предложи корекция</button>`)}<section class="section"><div class="container"><form class="search-box" data-search-form><input name="q" placeholder="Търси лекар, аптека, стоматолог, лаборатория..."><button>Намери</button></form><div class="filter-row"><button class="active">Всички</button><button>Болница</button><button>Лекари</button><button>Аптеки</button><button>Стоматолози</button><button>Ветеринари</button><button>Лаборатории</button></div><div class="result-section-title"><h2>Проверени резултати</h2><span class="badge verified">published + trust/freshness</span></div><div class="result-list"><article class="result-card"><div class="logo" style="background:#167c63">+</div><div class="body"><div class="badges"><span class="badge verified">Потвърдено</span><span class="badge">Лекар</span></div><h3>Примерен лекар / практика</h3><p>Специалност · Лом · точните contact facts идват от Health/Info owner.</p></div><div class="actions"><button data-action="info-open">Виж информацията</button></div></article><article class="result-card"><div class="logo" style="background:#167c63">А</div><div class="body"><span class="badge verified">Потвърдено</span><h3>Аптека — prototype result</h3><p>Работно време и телефон се квалифицират по B3 freshness.</p></div><div class="actions"><button data-action="info-open">Виж информацията</button></div></article></div></div></section></div>`;
  }

  function shopsPage() {
    return `<div class="page">${breadcrumbs([{label:"Открий в Лом",route:"home"},{label:"Магазини",route:"shops"}])}${pageHead("Specialized owner","Магазини","Местни магазини по категории. Shop proposal остава Shop-owned.",`<button class="primary" data-route="form-shop">Предложи магазин</button>`)}<section class="section"><div class="container"><div class="filter-row"><button class="active">Всички</button><button>Хранителни</button><button>Строителни</button><button>Техника</button><button>Други</button></div><div class="result-list" style="margin-top:20px"><article class="result-card"><div class="logo">М</div><div class="body"><span class="badge verified">Одобрен магазин</span><h3>Местен магазин — prototype</h3><p>Категория · Лом · owner-native контакти.</p></div><div class="actions"><button data-action="shop-open">Виж магазина</button></div></article></div></div></section></div>`;
  }

  function restaurantsPage() {
    return `<div class="page">${breadcrumbs([{label:"Открий в Лом",route:"home"},{label:"Заведения",route:"restaurants"}])}${pageHead("Firms-owned discovery","Заведения","Местни заведения и профили. Restaurant presentation използва Firms owner, не нов отделен backend.")}<section class="section"><div class="container"><div class="result-list"><article class="result-card"><div class="logo">З</div><div class="body"><span class="badge verified">Одобрен профил</span><h3>Заведение — prototype</h3><p>Местен Firms-owned ресторант/заведение.</p></div><div class="actions"><button data-route="firm-detail">Виж профила</button></div></article></div><div class="side-card" style="margin-top:18px"><span class="eyebrow">Общност</span><h3>Търсиш препоръка?</h3><button class="text-button" data-route="questions">Виж въпросите за заведения →</button></div></div></section></div>`;
  }

  function eventsPage() {
    return `<div class="page">${breadcrumbs([{label:"Събития",route:"events"}])}${pageHead("Какво предстои","Събития","Само одобрени текущи/предстоящи събития. В initial V6 няма public Event create owner.",`<button class="secondary" data-route="form-question" data-prefill-category="events">Попитай за събитие</button>`)}<section class="section"><div class="container"><div class="result-list"><article class="result-card"><div class="logo">${icon("calendar")}</div><div class="body"><div class="badges"><span class="badge verified">Одобрено</span><span class="badge">Предстоящо</span></div><h3>Местно събитие — prototype</h3><p>Дата · място · актуално owner състояние.</p></div><div class="actions"><button data-action="event-open">Виж събитието</button><button data-action="share">Сподели</button></div></article></div><div class="inline-note" style="margin-top:18px"><strong>Няма „Добави събитие“.</strong> Ако няма намерено събитие, потребителят може да попита общността. Нов Event submission owner изисква отделно одобрение.</div></div></section></div>`;
  }

  function articlesPage() {
    return `<div class="page">${breadcrumbs([{label:"Статии",route:"articles"}])}${pageHead("Полезни ръководства","Статии и ръководства","Процеси и обяснения. Променливите факти остават при authoritative Info/owner records.")}<section class="section"><div class="container"><div class="guide-grid">${guides.map(([id,topic,title,desc])=>`<button class="guide-card" data-route="article-detail" data-article="${id}"><span class="topic">${topic}</span><h3>${title}</h3><p>${desc}</p></button>`).join("")}</div><div class="inline-note" style="margin-top:22px">Prototype заглавие не означава автоматично `ПРОВЕРЕНО ГОТОВО`. Production Search/share eligibility се включва само след B4 readiness gate.</div></div></section></div>`;
  }

  function articleDetailPage(id) {
    const item = guides.find(x=>x[0]===id) || guides[0];
    const [guideId,topic,title,desc] = item;
    const pension = guideId === "pension";
    const body = pension ? `<p>Това ръководство показва как трябва да изглежда пълната статия: обяснява процеса стъпка по стъпка, а текущите телефони, адреси и работно време не се копират като вечни факти.</p><h2>1. Провери дали покриваш условията</h2><p>Преди подаване се проверяват възрастта, осигурителният стаж и конкретното основание. Финалната production статия трябва да стъпи върху актуални официални източници.</p><h2>2. Подготви документите</h2><p>Статията обяснява какъв тип документи обичайно се подготвят и кои липси трябва да се изяснят. Точният списък се сверява с текущия официален owner.</p><h2>3. Намери актуалната информация за НОИ</h2><p>Адресът, телефонът, работното време и текущите действия се вземат от проверения запис в Инфо Лом.</p><button class="primary" data-route="info-detail" data-info="institutions">Виж проверената информация за институциите</button><h2>4. След подаването</h2><p>Ръководството обяснява какво следва, как да пазиш входящи документи и кога да провериш статуса.</p>` : `<p>${desc}</p><h2>Какво трябва да знаеш</h2><p>Тук ще бъде пълното редакционно ръководство, проверено срещу authoritative owner-и преди production readiness.</p><h2>Следващо действие</h2><p>Вместо да дублира променливи факти, статията води към правилната проверена информация, категория или общностен въпрос.</p>`;
    return `<div class="page">${breadcrumbs([{label:"Статии",route:"articles"},{label:title,route:"article-detail"}])}${pageHead(topic,title,desc)}<section class="section"><div class="container detail-layout"><article class="detail-card article-body">${body}</article><aside><div class="side-card"><span class="prototype-only">PROTOTYPE CANDIDATE</span><h3 style="margin-top:12px">Readiness</h3><p>Официален Share се показва само след `ПРОВЕРЕНО ГОТОВО` + canonical public URL.</p><button class="secondary full" data-action="share-guide">Сподели</button></div><div class="side-card"><span class="eyebrow">Свързано</span><button class="text-button" data-route="questions">Въпроси и препоръки →</button></div></aside></div></section></div>`;
  }

  function questionsPage() {
    return `<div class="page">${breadcrumbs([{label:"Въпроси",route:"questions"}])}${pageHead("Общността","Въпроси и препоръки","Съвет, опит и местни препоръки. Въпросите допълват търсенето, но не заменят verified facts или marketplace.",`<button class="primary" data-route="form-question">Задай въпрос</button>`)}<section class="section"><div class="container"><div class="filter-row"><button class="active">Всички</button><button>Строителство</button><button>Автомобили</button><button>Здраве</button><button>Заведения</button></div><div class="community-list" style="margin-top:20px"><button class="community-row" data-route="question-detail" data-question="master"><div class="body"><div class="badges"><span class="badge">Строителство</span><span class="badge verified">4 одобрени отговора</span></div><strong>Кой препоръчва добър майстор за баня?</strong><small>Canonical public question</small></div><span class="card-arrow">→</span></button><button class="community-row" data-route="question-detail" data-question="cars"><div class="body"><div class="badges"><span class="badge">Автомобили</span><span class="badge verified">3 одобрени отговора</span></div><strong>Къде в Лом правят добра диагностика?</strong><small>Canonical public question</small></div><span class="card-arrow">→</span></button><button class="community-row" data-route="question-detail" data-question="empty"><div class="body"><div class="badges"><span class="badge">Услуги</span><span class="badge pending">Без одобрен отговор</span></div><strong>Има ли препоръка за преместване в Лом?</strong><small>Exact unanswered canonical can remain discoverable to prevent duplicates.</small></div><span class="card-arrow">→</span></button></div></div></section></div>`;
  }

  function questionDetailPage(id) {
    const empty = id === "empty";
    return `<div class="page">${breadcrumbs([{label:"Въпроси",route:"questions"},{label:"Въпрос",route:"question-detail"}])}${pageHead("Canonical Q&A",empty?"Има ли препоръка за преместване в Лом?":"Кой препоръчва добър майстор за баня?","Публичният canonical въпрос държи одобрените отговори и share destination.")}<section class="section"><div class="container detail-layout"><div><article class="detail-card"><div class="badges"><span class="badge">Строителство</span><span class="badge verified">Одобрен въпрос</span></div><p>Търся личен опит и препоръки. Prototype текст за interaction review.</p><div class="detail-actions"><button class="primary" data-action="answer">Отговори</button><button class="secondary" data-action="share">Сподели</button><button class="secondary" data-route="report">Докладвай</button></div></article>${empty?'<div class="empty-state" style="margin-top:14px"><h3>Все още няма одобрен отговор</h3><p>Можеш да добавиш отговор. Той ще следва real moderation flow.</p></div>':`<div class="result-section-title"><h2>Одобрени отговори</h2></div><div class="result-list"><article class="result-card"><div class="logo">П</div><div class="body"><span class="badge verified">Одобрен отговор</span><p>Примерен полезен community отговор. Не се представя като verified factual authority.</p></div></article><article class="result-card"><div class="logo">Л</div><div class="body"><span class="badge verified">Одобрен отговор</span><p>Втори примерен отговор за card/spacing review.</p></div></article></div>`}</div><aside><div class="side-card"><span class="eyebrow">Свързано</span><button class="text-button" data-route="category" data-category="construction">Строителство и ремонти →</button><button class="text-button" data-route="article-detail" data-article="master">Как да избереш майстор →</button></div></aside></div></section></div>`;
  }

  function searchPage() {
    const q = context.q || "ВиК майстор";
    const state = context.searchState || "success";
    const stateControls = `<div class="filter-row"><button class="${state==="success"?"active":""}" data-search-state="success">Резултати</button><button class="${state==="partial"?"active":""}" data-search-state="partial">Partial</button><button class="${state==="empty"?"active":""}" data-search-state="empty">No result</button><button class="${state==="offline"?"active":""}" data-search-state="offline">Offline</button><button class="${state==="error"?"active":""}" data-search-state="error">Error</button></div>`;
    let content = "";
    if (state === "empty") content = `<div class="empty-state"><h2>Не намерихме достатъчно точен резултат</h2><p>След пълния owner plan и fallback можеш да попиташ хората в Лом.</p><button class="primary" data-route="form-question" data-prefill-query="${esc(q)}">Попитай Лом</button></div>`;
    else if (state === "offline") content = `<div class="state-box pending"><h2>Няма връзка</h2><p>Показваме ясно offline състояние и не твърдим, че няма резултати.</p></div>`;
    else if (state === "error") content = `<div class="state-box error"><h2>Търсенето не можа да завърши</h2><p>Пробвай отново. Не превръщаме owner failure във false no-result.</p></div>`;
    else content = `${state==="partial"?'<div class="state-box pending"><strong>Частични резултати</strong><p>Един owner не отговори навреме. Показваме валидното, без false empty.</p></div>':''}<div class="search-group"><div class="search-group-head">${icon("building")}<h2>Фирми</h2></div><button class="search-result" data-route="firm-detail"><span class="mini-icon">${icon("tools")}</span><span class="body"><strong>Иванов Ремонти</strong><small>Релевантен provider result · Лом</small></span><span>→</span></button></div><div class="search-group"><div class="search-group-head">${icon("list")}<h2>Обяви</h2></div><button class="search-result" data-route="listing-detail"><span class="mini-icon">${icon("list")}</span><span class="body"><strong>ВиК ремонт — активна обява</strong><small>Approved + active Listing</small></span><span>→</span></button></div><div class="search-group"><div class="search-group-head">${icon("chat")}<h2>Въпроси</h2></div><button class="search-result" data-route="question-detail" data-question="master"><span class="mini-icon">${icon("chat")}</span><span class="body"><strong>Кой препоръчва добър майстор?</strong><small>Community opinion — отделен trust class</small></span><span>→</span></button></div>`;
    return `<div class="page">${breadcrumbs([{label:"Търсене",route:"search"}])}${pageHead("Search V6","Резултати за „${q}“","Един вход, owner-aware резултати и ясни trust групи.")}<section class="section"><div class="container"><form class="search-box" data-search-form><input name="q" value="${esc(q)}"><button>Търси</button></form><div class="prototype-only" style="margin-top:17px">PROTOTYPE STATE SWITCHER</div>${stateControls}<div style="margin-top:23px">${content}</div></div></section></div>`;
  }

  function profilePage() {
    return `<div class="page">${breadcrumbs([{label:"Профил",route:"profile"}])}${pageHead("Личен профил","Моят профил","Едно място за собственото съдържание, статуси, корекции и действия.")}<section class="section"><div class="container two-column"><div><article class="detail-card"><div class="profile-head"><div class="avatar">П</div><div><h2 style="margin:0">Потребител — prototype</h2><p style="margin:4px 0 0">signed-in@example.com</p></div></div><div class="detail-actions"><button class="secondary" data-route="auth">Вход / auth states</button><button class="secondary" data-action="logout">Изход</button></div></article><div class="tabs" style="margin-top:20px"><button class="active">Моите обяви</button><button>Моите фирми</button><button>Моите въпроси</button><button>Корекции</button></div><div class="profile-stack"><article class="profile-row"><div class="body"><div class="badges"><span class="badge pending">Чака преглед</span></div><strong>Моя обява — prototype</strong><small>Статусът е видим; няма public Share преди approval.</small></div><button class="secondary" data-route="form-listing">Редактирай</button></article><article class="profile-row"><div class="body"><div class="badges"><span class="badge error">Нужна корекция</span></div><strong>Върнат въпрос — prototype</strong><small>Причината и resubmit action са ясни.</small></div><button class="secondary" data-route="form-question">Коригирай</button></article><article class="profile-row"><div class="body"><div class="badges"><span class="badge verified">Публикувана фирма</span></div><strong>Моя фирма — prototype</strong><small>Owner-native edit/status action.</small></div><button class="secondary" data-route="form-firm">Редактирай</button></article></div></div><aside><div class="side-card"><h3>Бързи действия</h3><button class="text-button" data-route="form-listing">Добави обява →</button><button class="text-button" data-route="form-firm">Добави фирма →</button><button class="text-button" data-route="form-question">Задай въпрос →</button><button class="text-button" data-route="report">Подай сигнал →</button></div></aside></div></section></div>`;
  }

  function authPage() {
    return `<div class="page">${breadcrumbs([{label:"Профил",route:"profile"},{label:"Вход",route:"auth"}])}${pageHead("Достъп","Вход в Попитай.Лом","Auth surface е част от целия interface review, защото Add/Health/Shop submit могат да изискват sign-in.")}<section class="section"><div class="narrow"><div class="form-shell"><div class="tabs"><button class="active">Вход</button><button>Регистрация</button><button>Забравена парола</button></div><div class="field"><label>Имейл</label><input type="email" placeholder="name@example.com"></div><div class="field"><label>Парола</label><input type="password" placeholder="••••••••"></div><button class="primary full" data-action="login">Вход</button><p class="owner-note">Prototype — не изпраща реални данни. Production auth остава при текущия owner.</p></div></div></section></div>`;
  }

  function formStateBox(type) {
    if (context.formState !== "pending") return "";
    const messages = {
      listing:"Обявата е изпратена за преглед. Публично споделяне ще е достъпно едва след одобрение.",
      firm:"Фирменият профил е изпратен за преглед. Публичният profile/share идва след approval.",
      question:"Въпросът е изпратен за преглед. След одобрение ще има canonical public destination.",
      health:"Предложението е изпратено за одобрение. Ще се публикува само след преглед.",
      shop:"Предложението за магазин е изпратено за проверка.",
      correction:"Корекцията е изпратена за проверка. Публичният факт не се променя директно.",
      report:"Сигналът е изпратен за преглед."
    };
    return `<div class="state-box pending" style="margin-bottom:18px"><span class="badge pending">PENDING</span><h2 style="margin-top:10px">Изпратено</h2><p>${messages[type]||"Изпратено за преглед."}</p><button class="secondary" type="button" data-route="profile">Към профила</button></div>`;
  }

  function formPage(type) {
    const pending = formStateBox(type);
    if (type === "listing") return `<div class="page">${breadcrumbs([{label:"Обяви и услуги",route:"marketplace"},{label:"Добави обява",route:"form-listing"}])}${pageHead("Публикувай","Добави обява","V6 presentation на съществуващия protected Listing owner — без промяна на quota/moderation/storage semantics.")}<section class="section"><div class="narrow">${pending}<form class="form-shell" data-demo-form="listing"><div class="form-section"><h2>1. Какво искаш?</h2><div class="choice-grid"><button type="button" class="active">Предлагам</button><button type="button">Търся</button></div></div><div class="form-section"><h2>2. Категория</h2><div class="field-grid"><div class="field"><label>Главна група</label><select><option>Майстори и ремонти</option><option>Автомобили</option><option>Други услуги</option><option>Други обяви</option></select></div><div class="field"><label>Подкатегория</label><select><option>ВиК</option><option>Боядисване</option><option>Покриви</option></select></div></div><p class="owner-note">Работа и Имоти показват собствените си protected type options, когато са избрани.</p></div><div class="form-section"><h2>3. Детайли</h2><div class="field"><label>Заглавие</label><input required minlength="5" maxlength="120" placeholder="Например: ВиК ремонти в Лом"></div><div class="field"><label>Описание</label><textarea required minlength="20" placeholder="Опиши подробно..."></textarea></div><div class="field-grid"><div class="field"><label>Цена в евро</label><input type="number" min="0" placeholder="0.00"></div><div class="field"><label>Телефон</label><input type="tel" required placeholder="0876 123 456"></div><div class="field"><label>Град / район</label><input value="Лом"></div><div class="field"><label>Улица (по желание)</label><input placeholder="ул. ..."></div></div><label class="check-row"><input type="checkbox"> Договаряне</label><label class="check-row"><input type="checkbox"> Подарява (безплатно)</label></div><div class="form-section"><h2>4. Снимки</h2><div class="upload-box">Избери до 6 снимки · първата е главна · JPG/PNG/WebP</div></div><label class="check-row"><input type="checkbox" required> Прочетох и приемам правилата на общността.</label><div class="form-actions"><button class="primary" type="submit">Изпрати за преглед</button><button class="secondary" type="button" data-route="marketplace">Отказ</button></div></form></div></section></div>`;
    if (type === "firm") return `<div class="page">${breadcrumbs([{label:"Фирми",route:"firms"},{label:"Добави фирма",route:"form-firm"}])}${pageHead("Местен бизнес","Добави фирма","Създай основен профил чрез existing Firms owner. Защитените expanded права не се разширяват.")}<section class="section"><div class="narrow">${pending}<form class="form-shell" data-demo-form="firm"><div class="field-grid"><div class="field full-span"><label>Име на фирмата</label><input required></div><div class="field"><label>Категория</label><select required><option>Избери</option><option>Строителство</option><option>Красота</option><option>Автомобили</option></select></div><div class="field"><label>Телефон</label><input type="tel" required></div><div class="field"><label>Град (по желание)</label><input placeholder="Лом"></div><div class="field"><label>Адрес (по желание)</label><input></div><div class="field full-span"><label>Работно време (по желание)</label><input placeholder="Пон–Пет: 8:00–18:00"></div><div class="field full-span"><label>Описание</label><textarea required></textarea></div></div><div class="form-section"><h2>Лого и снимки</h2><div class="field-grid"><div class="upload-box">Лого · до 1 файл</div><div class="upload-box">Галерия · до 6 снимки</div></div></div><p class="owner-note">Admin-only expanded profile controls не се показват на normal user.</p><button class="primary" type="submit">Изпрати за преглед</button></form></div></section></div>`;
    if (type === "question") return `<div class="page">${breadcrumbs([{label:"Въпроси",route:"questions"},{label:"Задай въпрос",route:"form-question"}])}${pageHead("Участвай","Задай въпрос","Опиши ясно какво търсиш. Преди нов canonical въпрос target B5 проверява за дубликат/alias.")}<section class="section"><div class="narrow">${pending}<form class="form-shell" data-demo-form="question"><div class="field"><label>Заглавие на въпроса</label><input required minlength="10" maxlength="120" value="${esc(context.prefillQuery||"")}" placeholder="Например: Кой препоръчва добър електротехник?"></div><div class="field"><label>Категория</label><select required><option>${esc(context.prefillCategory||"Избери категория")}</option><option>Строителство</option><option>Автомобили</option><option>Здраве</option></select></div><div class="field"><label>Описание</label><textarea required minlength="20" placeholder="Добави подробности..."></textarea></div><div class="state-box" style="margin-bottom:14px"><strong>Duplicate/canonical gate</strong><p>При сходен одобрен въпрос първо показваме съществуващия canonical резултат, вместо да създаваме копие.</p></div><label class="check-row"><input type="checkbox" required> Приемам правилата на общността.</label><button class="primary" type="submit">Изпрати за преглед</button></form></div></section></div>`;
    if (type === "health") return `<div class="page">${breadcrumbs([{label:"Здраве и лекари",route:"health"},{label:"Предложи",route:"form-health"}])}${pageHead("Specialized submission","Предложи лекар или практика","Това не създава Firm или Listing. Submit изисква sign-in и отива към Health/Info pending owner.")}<section class="section"><div class="narrow">${pending}<form class="form-shell" data-demo-form="health"><div class="state-box"><strong>Изисква вход</strong><p>Prototype показва auth boundary. В production safe form context се запазва, когато owner implementation го позволява.</p></div><div class="choice-grid" style="margin:18px 0"><button type="button" class="active">Лекар</button><button type="button">Стоматолог</button><button type="button">Ветеринар</button></div><div class="field"><label>Име</label><input required></div><div class="field"><label>Специалност</label><input></div><div class="field-grid"><div class="field"><label>Телефон</label><input type="tel"></div><div class="field"><label>Адрес</label><input></div></div><div class="field"><label>Допълнителна информация / източник</label><textarea></textarea></div><button class="primary" type="submit">Изпрати за одобрение</button></form></div></section></div>`;
    if (type === "shop") return `<div class="page">${breadcrumbs([{label:"Магазини",route:"shops"},{label:"Предложи магазин",route:"form-shop"}])}${pageHead("Shop owner","Предложи магазин","Specialized Shop proposal. Не се пренасочва към generic Firm create.")}<section class="section"><div class="narrow">${pending}<form class="form-shell" data-demo-form="shop"><div class="field"><label>Име на магазина</label><input required></div><div class="field"><label>Категория</label><select required><option>Избери</option><option>Хранителни</option><option>Строителни</option><option>Техника</option></select></div><div class="field-grid"><div class="field"><label>Телефон</label><input type="tel"></div><div class="field"><label>Адрес</label><input></div></div><div class="field"><label>Допълнителни тагове / информация</label><textarea></textarea></div><button class="primary" type="submit">Изпрати за проверка</button><p class="owner-note">Dirty close/back в реалния Shop modal изисква confirmation.</p></form></div></section></div>`;
    return "";
  }

  function correctionPage() {
    return `<div class="page">${breadcrumbs([{label:"Инфо Лом",route:"info"},{label:"Предложи корекция",route:"correction"}])}${pageHead("Проверка на факт","Предложи корекция","Корекцията посочва конкретния запис/поле и не презаписва директно публичната проверена информация.")}<section class="section"><div class="narrow">${formStateBox("correction")}<form class="form-shell" data-demo-form="correction"><div class="field"><label>Запис</label><input value="${esc(context.info||"Инфо Лом запис")}" readonly></div><div class="field"><label>Какво е неточно?</label><select><option>Телефон</option><option>Адрес</option><option>Работно време</option><option>Друга информация</option></select></div><div class="field"><label>Предложена корекция</label><textarea required></textarea></div><div class="field"><label>Източник / доказателство (когато е нужно)</label><input placeholder="Официален сайт, документ или пояснение"></div><button class="primary" type="submit">Изпрати за проверка</button></form></div></section></div>`;
  }

  function reportPage() {
    return `<div class="page">${breadcrumbs([{label:"Подай сигнал",route:"report"}])}${pageHead("Сигнал","Докладвай проблем","Report flow е различен от factual Info correction.")}<section class="section"><div class="narrow">${formStateBox("report")}<form class="form-shell" data-demo-form="report"><div class="field"><label>Какъв е проблемът?</label><select><option>Неподходящо съдържание</option><option>Грешна информация</option><option>Спам</option><option>Друг проблем</option></select></div><div class="field"><label>Описание</label><textarea required></textarea></div><button class="primary" type="submit">Изпрати сигнал</button></form></div></section></div>`;
  }

  function simplePage(type) {
    const data = {
      about:["За Попитай.Лом","Местен продукт за Лом, който свързва проверена информация, услуги, обяви и общност, без да смесва owner-ите."],
      rules:["Правила на общността","Тук остава public rules surface. V6 interface го свързва с формите и moderation states."],
      contact:["Контакти","Контактният екран остава вторична, но ясно достъпна част от глобалната навигация."]
    }[type];
    return `<div class="page">${breadcrumbs([{label:data[0],route:type}])}${pageHead("Попитай.Лом",data[0],data[1])}<section class="section"><div class="narrow"><article class="detail-card"><h2>${data[0]}</h2><p>${data[1]}</p><p>Този screen е включен в full-site prototype, за да не се губят secondary navigation destinations при новия shell.</p></article></div></section></div>`;
  }

  function render() {
    let html = "";
    if (currentRoute === "home") html = homePage();
    else if (currentRoute === "categories") html = categoriesPage();
    else if (currentRoute === "marketplace") html = marketplacePage();
    else if (currentRoute === "category") html = categoryPage(context.category || "construction");
    else if (currentRoute === "listing-detail") html = listingDetailPage();
    else if (currentRoute === "firms") html = firmsPage();
    else if (currentRoute === "firm-detail") html = firmDetailPage();
    else if (currentRoute === "info") html = infoPage();
    else if (currentRoute === "info-detail") html = infoDetailPage(context.info || "institutions");
    else if (currentRoute === "health") html = healthPage();
    else if (currentRoute === "shops") html = shopsPage();
    else if (currentRoute === "restaurants") html = restaurantsPage();
    else if (currentRoute === "events") html = eventsPage();
    else if (currentRoute === "articles") html = articlesPage();
    else if (currentRoute === "article-detail") html = articleDetailPage(context.article || "pension");
    else if (currentRoute === "questions") html = questionsPage();
    else if (currentRoute === "question-detail") html = questionDetailPage(context.question || "master");
    else if (currentRoute === "search") html = searchPage();
    else if (currentRoute === "profile") html = profilePage();
    else if (currentRoute === "auth") html = authPage();
    else if (currentRoute === "form-listing") html = formPage("listing");
    else if (currentRoute === "form-firm") html = formPage("firm");
    else if (currentRoute === "form-question") html = formPage("question");
    else if (currentRoute === "form-health") html = formPage("health");
    else if (currentRoute === "form-shop") html = formPage("shop");
    else if (currentRoute === "correction") html = correctionPage();
    else if (currentRoute === "report") html = reportPage();
    else if (["about","rules","contact"].includes(currentRoute)) html = simplePage(currentRoute);
    else html = homePage();
    app.innerHTML = html;
    activeNav();
    updateStaticIcons();
  }

  function navigate(route, data = {}) {
    currentRoute = route;
    context = {...data};
    closeModal();
    closeDrawer();
    document.querySelector(".more-nav[open]")?.removeAttribute("open");
    render();
    window.scrollTo({top:0,behavior:"instant"});
    requestAnimationFrame(() => app.focus({preventScroll:true}));
  }

  document.addEventListener("click", (event) => {
    const openAdd = event.target.closest("[data-open-add]");
    if (openAdd) { openModal(); return; }
    const close = event.target.closest("[data-close-modal]");
    if (close || event.target === addSheet) { closeModal(); return; }

    const query = event.target.closest("[data-search-query]");
    if (query) { navigate("search", {q:query.dataset.searchQuery}); return; }

    const state = event.target.closest("[data-search-state]");
    if (state) { context.searchState = state.dataset.searchState; render(); return; }

    const route = event.target.closest("[data-route]");
    if (route) {
      const data = {};
      if (route.dataset.category) data.category = route.dataset.category;
      if (route.dataset.info) data.info = route.dataset.info;
      if (route.dataset.article) data.article = route.dataset.article;
      if (route.dataset.question) data.question = route.dataset.question;
      if (route.dataset.prefillCategory) data.prefillCategory = route.dataset.prefillCategory;
      if (route.dataset.prefillQuery) data.prefillQuery = route.dataset.prefillQuery;
      navigate(route.dataset.route, data);
      return;
    }

    const choice = event.target.closest(".choice-grid button");
    if (choice) { choice.parentElement.querySelectorAll("button").forEach(btn=>btn.classList.toggle("active",btn===choice)); return; }
    const filter = event.target.closest(".filter-row button");
    if (filter) { filter.parentElement.querySelectorAll("button").forEach(btn=>btn.classList.toggle("active",btn===filter)); showToast(`Prototype filter: ${filter.textContent.trim()}`); return; }
    const sub = event.target.closest("[data-action='filter']");
    if (sub) { showToast(`Prototype subcategory: ${sub.textContent.trim()}`); return; }

    const action = event.target.closest("[data-action]");
    if (action) {
      const messages = {
        call:"Prototype: owner-native телефонен action.",
        contact:"Prototype: owner-native контакт / оферта.",
        site:"Prototype: отваря сайта само ако Firms owner има валиден URL.",
        share:"Prototype: Share е активен само за public canonical content.",
        "share-guide":"Това е candidate guide. Production Share се активира само след `ПРОВЕРЕНО ГОТОВО`.",
        answer:"Prototype: отговорът минава през Q&A owner и moderation.",
        logout:"Prototype: logout state — няма реална auth заявка.",
        login:"Prototype: няма реална auth заявка.",
        "info-open":"Prototype: verified detail показва source, last confirmed и freshness.",
        "shop-open":"Prototype: Shop detail остава при Shops owner.",
        "event-open":"Prototype: Event detail използва текущия approved Event owner."
      };
      showToast(messages[action.dataset.action] || `Prototype action: ${action.dataset.action}`);
    }
  });

  document.addEventListener("submit", (event) => {
    const search = event.target.closest("[data-search-form]");
    if (search) {
      event.preventDefault();
      const q = new FormData(search).get("q") || "";
      navigate("search", {q:String(q).trim() || "ВиК майстор"});
      return;
    }
    const form = event.target.closest("[data-demo-form]");
    if (form) {
      event.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      context.formState = "pending";
      render();
      window.scrollTo({top:0,behavior:"smooth"});
    }
  });

  menuTrigger.addEventListener("click", () => {
    const open = drawer.hidden;
    drawer.hidden = !open;
    menuTrigger.setAttribute("aria-expanded", String(open));
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") { closeModal(); closeDrawer(); document.querySelector(".more-nav[open]")?.removeAttribute("open"); }
  });

  updateStaticIcons();
  render();
})();
