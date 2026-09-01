(() => {
  "use strict";

  const home = document.querySelector('[data-screen="home"]');
  if (!home) return;

  if (!document.querySelector('link[data-home-v2-content]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "home-v2-content.css?v=20260901-guides-routing";
    link.dataset.homeV2Content = "1";
    document.head.appendChild(link);
  }

  const svg = {
    construction: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 18.5 9.5M13 7l4 4M4 20l6.2-6.2M8.4 4.4l3.2 3.2-2.1 2.1L6.3 6.5 4.8 8 3 6.2l5.4-5.4L10.2 2.6 8.4 4.4Z"/><path d="m13.7 13.7 4.8 4.8a1.4 1.4 0 0 0 2-2l-4.8-4.8"/></svg>',
    health: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3Z"/></svg>',
    work: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></svg>',
    car: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 16-1.3-2.6a2 2 0 0 1 .2-2.2L6 8h12l2.1 3.2a2 2 0 0 1 .2 2.2L19 16"/><path d="M3 16h18v3a1 1 0 0 1-1 1h-2v-2H6v2H4a1 1 0 0 1-1-1v-3Z"/><circle cx="7" cy="14" r="1"/><circle cx="17" cy="14" r="1"/></svg>',
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-8 9 8v10h-6v-6H9v6H3V11Z"/></svg>',
    beauty: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c2.5 3.1 3.8 5.6 3.8 7.6A3.8 3.8 0 0 1 12 14.4a3.8 3.8 0 0 1-3.8-3.8C8.2 8.6 9.5 6.1 12 3Z"/><path d="M5 21c1.5-3.2 3.8-4.8 7-4.8s5.5 1.6 7 4.8"/></svg>',
    shop: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h16l-1-5H5L4 9Z"/><path d="M5 9v11h14V9M9 20v-6h6v6"/><path d="M4 9a3 3 0 0 0 5 2 3 3 0 0 0 6 0 3 3 0 0 0 5-2"/></svg>',
    restaurant: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3v7M3 3v4a3 3 0 0 0 6 0V3M6 10v11M15 3v18M15 3c3 2 4 5 4 8h-4"/></svg>',
    business: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V8l8-5 8 5v13H4Z"/><path d="M8 21v-6h8v6M8 10h2M14 10h2"/></svg>',
    event: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M7 14h3M14 14h3M7 18h3"/></svg>',
    verified: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>'
  };

  const icon = (name) => `<span class="home-v2-icon">${svg[name] || svg.business}</span>`;
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));

  // Review chrome is not product navigation.
  const banner = document.querySelector(".prototype-banner");
  const switcher = document.querySelector(".prototype-switcher");
  if (banner && switcher && !banner.contains(switcher)) banner.appendChild(switcher);
  switcher?.classList.add("prototype-switcher--embedded");
  const switcherStrong = switcher?.querySelector("strong");
  if (switcherStrong) switcherStrong.textContent = "Преглед:";
  const switcherLabels = {home:"Начало",category:"Категория",health:"Здраве",search:"Търсене",ask:"Попитай",states:"Състояния"};
  switcher?.querySelectorAll("[data-prototype-screen]").forEach((button) => {
    button.textContent = switcherLabels[button.dataset.prototypeScreen] || button.textContent;
  });

  home.innerHTML = `
    <div class="hero home-hero home-v2-hero">
      <div class="container home-v2-hero-grid">
        <div class="hero-copy home-v2-hero-copy">
          <span class="eyebrow">Лом на едно място</span>
          <h1 id="home-title">Какво търсиш в Лом?</h1>
          <p>Намери проверена информация, местни услуги, работа, имоти, фирми и полезни отговори — всичко за Лом на едно място.</p>
          <form class="main-search home-v2-search" id="home-v2-search" role="search">
            <label class="sr-only" for="home-v2-query">Търси в Попитай.Лом</label>
            <span class="search-icon" aria-hidden="true">⌕</span>
            <input id="home-v2-query" type="search" placeholder="Например: ВиК майстор, аптека, работа…">
            <button type="submit">Търси</button>
          </form>
          <div class="hero-hints home-v2-hints" aria-label="Примерни търсения">
            <button type="button" data-v2-query="ВиК майстор">ВиК майстор</button>
            <button type="button" data-v2-query="аптека Лом">Аптека</button>
            <button type="button" data-v2-query="работа Лом">Работа</button>
          </div>
        </div>
      </div>
    </div>

    <div class="container content-stack home-v2-content">
      <section class="section-block home-v2-main-categories" aria-labelledby="home-v2-categories-title">
        <div class="section-head"><h2 id="home-v2-categories-title">Основни категории</h2><button class="home-v2-all-categories text-btn" type="button" data-v2-route="all-categories">Всички категории</button></div>
        <div class="shortcut-grid">
          <button class="shortcut-card featured home-v2-category-card" type="button" data-v2-base="category">${icon("construction")}<strong>Строителство и ремонти</strong><small>Майстори, ВиК, електро, покриви</small></button>
          <button class="shortcut-card health home-v2-category-card" type="button" data-v2-base="health">${icon("health")}<strong>Здраве и лекари</strong><small>Лекари, аптеки, лаборатории</small></button>
          <button class="shortcut-card home-v2-category-card" type="button" data-v2-category="Работа">${icon("work")}<strong>Работа</strong><small>Обяви за работа в Лом</small></button>
          <button class="shortcut-card home-v2-category-card" type="button" data-v2-category="Автомобили">${icon("car")}<strong>Автомобили</strong><small>Коли, сервизи, гуми, части</small></button>
          <button class="shortcut-card desktop-extra home-v2-category-card" type="button" data-v2-category="Имоти">${icon("home")}<strong>Имоти</strong><small>Продажби, наеми и търсене</small></button>
          <button class="shortcut-card desktop-extra home-v2-category-card" type="button" data-v2-category="Красота">${icon("beauty")}<strong>Красота</strong><small>Фризьори, козметика, грижа</small></button>
        </div>
      </section>

      <section class="section-block home-v2-discover" aria-labelledby="home-v2-discover-title">
        <div class="section-head"><h2 id="home-v2-discover-title">Открий в Лом</h2></div>
        <div class="discover-grid">
          <button class="home-v2-discover-card" type="button" data-v2-directory="shops">${icon("shop")}<span><strong>Магазини</strong><small>Местни магазини по категории</small></span><b aria-hidden="true">→</b></button>
          <button class="home-v2-discover-card" type="button" data-v2-directory="restaurants">${icon("restaurant")}<span><strong>Заведения</strong><small>Заведения и местни препоръки</small></span><b aria-hidden="true">→</b></button>
          <button class="home-v2-discover-card" type="button" data-v2-directory="firms">${icon("business")}<span><strong>Фирми</strong><small>Постоянни местни профили</small></span><b aria-hidden="true">→</b></button>
          <button class="home-v2-discover-card" type="button" data-v2-directory="events">${icon("event")}<span><strong>Събития</strong><small>Предстоящи одобрени събития</small></span><b aria-hidden="true">→</b></button>
        </div>
      </section>

      <section class="verified-panel home-v2-verified" aria-labelledby="home-v2-info-title">
        <div class="panel-head"><span class="verified-dot">${svg.verified}</span><div><span class="eyebrow">Инфо Лом</span><h2 id="home-v2-info-title">Проверена информация</h2></div></div>
        <div class="utility-list home-v2-utility-grid">
          <button class="home-v2-utility-item" type="button" data-v2-base="health"><strong>Здраве и лекари</strong><span>Лекари, аптеки, болница</span></button>
          <button class="home-v2-utility-item" type="button" data-v2-info="institutions"><strong>Институции</strong><span>Община, НОИ, полиция</span></button>
          <button class="home-v2-utility-item" type="button" data-v2-info="transport"><strong>Транспорт</strong><span>Автогара, БДЖ, таксита</span></button>
          <button class="home-v2-utility-item" type="button" data-v2-info="utilities"><strong>Комунални</strong><span>Вода, ток, куриери</span></button>
        </div>
      </section>

      <section class="home-v2-guides" aria-labelledby="home-v2-guides-title">
        <div class="home-v2-guides-head"><div><h2 id="home-v2-guides-title">Полезни ръководства</h2><p>Стъпки, документи и местни действия — обяснени ясно.</p></div><button class="home-v2-guides-all" type="button" data-v2-route="all-guides">Всички статии</button></div>
        <div class="home-v2-guide-list">
          <button class="home-v2-guide-card" type="button" data-v2-article="pension"><span class="guide-kicker">Институции</span><strong>Как да се пенсионираш в Лом</strong><small>Какво да провериш, какви документи да подготвиш и къде се подава.</small><span class="guide-arrow" aria-hidden="true">→</span></button>
          <button class="home-v2-guide-card" type="button" data-v2-article="id-card"><span class="guide-kicker">Документи</span><strong>Как се подменя лична карта в Лом</strong><small>Подготовка, подаване и къде да провериш актуалния прием.</small><span class="guide-arrow" aria-hidden="true">→</span></button>
          <button class="home-v2-guide-card" type="button" data-v2-article="signal"><span class="guide-kicker">Институции</span><strong>Как да подадеш сигнал до община или институция</strong><small>Към кого да се обърнеш и как да подготвиш сигнала.</small><span class="guide-arrow" aria-hidden="true">→</span></button>
        </div>
      </section>

      <section class="community-panel home-v2-community" aria-labelledby="home-v2-community-title">
        <h2 id="home-v2-community-title">Въпроси и препоръки</h2>
        <div class="mini-question"><span>Строителство</span><strong>Кой препоръчва добър майстор за баня?</strong><small>Примерен canonical въпрос</small></div>
        <div class="mini-question"><span>Автомобили</span><strong>Къде в Лом правят добра диагностика?</strong><small>Примерен canonical въпрос</small></div>
        <button class="secondary-btn" type="button" data-v2-route="questions">Виж всички въпроси</button>
      </section>
    </div>`;
  home.classList.add("home-v2-ready");

  const main = document.getElementById("main-content");
  let dynamic = document.getElementById("home-v2-dynamic-screen");
  if (!dynamic) {
    dynamic = document.createElement("section");
    dynamic.id = "home-v2-dynamic-screen";
    dynamic.className = "screen home-v2-dynamic-screen";
    main?.appendChild(dynamic);
  }

  const allCategories = [
    "Строителство и ремонти","Здраве и лекари","Работа","Автомобили","Имоти","Красота","Дом и градина","Магазини","Заведения и храна","Електроника","Деца и бебета","Животни","Мода","Спорт и хоби","Други услуги","Други обяви"
  ];

  const categoryConfigs = {
    "Работа": {desc:"Обяви за работа в Лом — предложения и търсене на работа.",chips:["Всички","Предлага работа","Търси работа"],cards:[["Обява","Предлага работа — пример","Активна публикация от Listings owner."],["Обява","Търси работа — пример","Активна публикация от Listings owner."]]},
    "Автомобили": {desc:"Автомобили, сервизи, гуми, части и пътна помощ в Лом.",chips:["Всички","Автомобили","Сервизи","Гуми","Части","Пътна помощ"],cards:[["Фирма","Автосервиз — пример","Постоянен фирмен профил."],["Обява","Автомобил — пример","Активна автомобилна обява."]]},
    "Имоти": {desc:"Продажби, наеми и търсене на имоти в Лом и региона.",chips:["Всички","Продава","Отдава","Търси под наем","Търси за купуване"],cards:[["Обява","Апартамент — пример","Активна обява за имот."],["Обява","Търси имот — пример","Активна заявка за търсене."]]},
    "Красота": {desc:"Фризьори, козметични услуги и местни профили в Лом.",chips:["Всички","Фризьори","Козметика","Маникюр","Грижа"],cards:[["Фирма","Салон — пример","Постоянен местен профил."],["Обява","Услуга — пример","Активна публикация, когато owner правилата го позволяват."]]},
    "Дом и градина": {desc:"Обяви и услуги за дома, двора и градината.",chips:["Всички","Мебели","Инструменти","Двор и градина"],cards:[["Обява","Дом и градина — пример","Активна публикация от Listings owner."]]},
    "Електроника": {desc:"Техника и електроника — продава, купува и търси.",chips:["Всички","Телефони","Компютри","Техника"],cards:[["Обява","Електроника — пример","Активна публикация от Listings owner."]]},
    "Деца и бебета": {desc:"Обяви за детски и бебешки стоки.",chips:["Всички","Детски стоки","Бебешки стоки"],cards:[["Обява","Деца и бебета — пример","Активна публикация от Listings owner."]]},
    "Животни": {desc:"Местни обяви и услуги, свързани с животни.",chips:["Всички","Обяви","Услуги"],cards:[["Обява","Животни — пример","Активна публикация от Listings owner."]]},
    "Мода": {desc:"Дрехи, обувки и аксесоари в местните обяви.",chips:["Всички","Дрехи","Обувки","Аксесоари"],cards:[["Обява","Мода — пример","Активна публикация от Listings owner."]]},
    "Спорт и хоби": {desc:"Спорт, свободно време и хоби обяви.",chips:["Всички","Спорт","Хоби"],cards:[["Обява","Спорт и хоби — пример","Активна публикация от Listings owner."]]},
    "Други услуги": {desc:"Услуги, които не попадат в специализираните групи.",chips:["Всички","Предлага","Търси"],cards:[["Обява","Друга услуга — пример","Активна публикация от Listings owner."]]},
    "Други обяви": {desc:"Останалите местни обяви в ясна обща група.",chips:["Всички","Продава","Купува","Търси"],cards:[["Обява","Друга обява — пример","Активна публикация от Listings owner."]]}
  };

  const directoryConfigs = {
    shops:{title:"Магазини",kicker:"Открий в Лом",desc:"Местни магазини, подредени по реални специализирани категории.",chips:["Строителни","Хранителни","Техника","Дом"],cards:[["Магазин","Строителни магазини","Специализиран Shops owner."],["Магазин","Хранителни магазини","Проверени местни профили."],["Магазин","Техника и електроника","Местни търговски обекти."]]},
    restaurants:{title:"Заведения и храна",kicker:"Открий в Лом",desc:"Местни заведения като постоянни профили, без отделен дублиращ owner.",chips:["Ресторанти","Кафенета","Бързо хранене"],cards:[["Фирмен профил","Ресторант — пример","Заведенията използват Firms owner."],["Препоръки","Какво препоръчват хората","Community мнението остава отделно от фирмения профил."]]},
    firms:{title:"Фирми",kicker:"Открий в Лом",desc:"Постоянни местни бизнес профили по категории.",chips:["Всички","Строителство","Автомобили","Красота","Услуги"],cards:[["Фирма","Иванов Ремонти","Пример за постоянен фирмен профил в релевантна категория."],["Фирма","Местна фирма — пример","Постоянен профил от Firms owner."]]},
    events:{title:"Събития",kicker:"Открий в Лом",desc:"Само одобрени предстоящи събития. Няма измислен public Add flow.",chips:["Предстоящи","Култура","Спорт","Общност"],cards:[["Събитие","Предстоящо събитие — пример","Одобрено публично събитие с дата и място."],["Информация","Няма публикувани?","Показва се честен empty state, а не фалшиво съдържание."]]}
  };

  const infoConfigs = {
    institutions:{title:"Институции",desc:"Проверени местни институции и актуални контакти от Info owner.",chips:["Община","Полиция","НОИ","Пожарна","Спешна помощ"],cards:[["Проверена информация","Община Лом","Адрес, контакти и прием се показват от актуалния Info запис."],["Проверена информация","НОИ","Актуалният контакт и прием се вземат от authoritative Info owner."],["Проверена информация","Полиция","Текущите контакти и услуги не се дублират в статии."]]},
    transport:{title:"Транспорт",desc:"Автогара, БДЖ и таксита с проверени текущи данни.",chips:["Автобуси","БДЖ","Таксита"],cards:[["Проверена информация","Автогара","Текущите данни идват от Info owner."],["Проверена информация","ЖП гара Лом","Текущите данни идват от Info owner."],["Местен транспорт","Таксита","Показват се само наличните проверени записи."]]},
    utilities:{title:"Комунални",desc:"Ток, вода, интернет, куриери и важни местни услуги.",chips:["ВиК","Ток","Интернет и ТВ","Куриери","Чистота"],cards:[["Проверена информация","ВиК","Аварийни и текущи контакти се вземат от Info owner."],["Проверена информация","Електроснабдяване","Точните актуални контакти не се hardcode-ват в Home или статия."],["Услуга","Куриери","Показват се наличните валидирани местни записи."]]}
  };

  const articles = {
    pension:{title:"Как да се пенсионираш в Лом",kicker:"Практическо ръководство",intro:"Подготовката за пенсиониране е по-лесна, когато разделиш процеса на проверка на правото, подготовка на документите, подаване и проследяване. Точните условия винаги се сверяват с действащите правила на НОИ.",sections:[
      ["1. Започни с проверка на стажа и правото","Преди да събираш документи, провери какъв осигурителен стаж е отчетен и дали има периоди, които липсват или трябва да се доказват. Във финалното ръководство Попитай.Лом няма да изписва наизуст възраст и стаж, защото тези условия се променят и зависят от конкретния вид пенсия — ще води към актуалния официален източник."],
      ["2. Подготви документите според твоя случай","Обичайно ще ти трябва документ за самоличност и документите, които НОИ изисква за периоди или обстоятелства, които не са налични в регистрите. При различни случаи списъкът е различен, затова страницата трябва да показва ясен checklist и да отличава задължителното от това, което се иска само при нужда."],
      ["3. Провери къде и как се подава","Заявлението се подава по реда на съответната услуга на НОИ. За Лом ръководството трябва да показва отделна актуална Info карта с местния контакт, прием и начин за проверка — без адресът и работното време да се копират като вечен текст в статията."],
      ["4. След подаването","НОИ преглежда данните и при необходимост може да поиска допълнителни документи. Ръководството трябва да обяснява какво следва, как човек да пази входящите документи и откъде да провери официална информация за движението на преписката."],
      ["5. Преди посещение в Лом","Провери актуалния прием, контакт и евентуални промени в обслужването. Тези динамични данни принадлежат на Инфо Лом, а статията обяснява процеса и води към тях."]
    ],owner:"НОИ / официални източници + Инфо Лом за местните актуални контакти"},
    "id-card":{title:"Как се подменя лична карта в Лом",kicker:"Практическо ръководство",intro:"Една добра страница трябва да ти каже какво да подготвиш, къде да провериш текущия прием и какво се случва след подаването — без да дублира променливи телефони и работно време.",sections:[["1. Провери основанието и срока","Причината за подмяната определя какво трябва да подготвиш. Финалната версия ще сверява условията с официалните правила на МВР."],["2. Подготви необходимото","Страницата ще разделя основните документи от допълнителните, които са нужни само при определени случаи."],["3. Къде в Лом","Актуалният местен адрес, контакт и прием трябва да се показват от проверения Info запис за полицията/личните документи, не като дублиран текст в статията."],["4. След подаването","Ръководството ще обяснява как се получава документът и къде се проверява актуалната официална информация."]],owner:"МВР + Инфо Лом за местния актуален контакт"},
    signal:{title:"Как да подадеш сигнал до община или институция",kicker:"Практическо ръководство",intro:"Полезният сигнал е конкретен: какъв е проблемът, къде е, кога е установен и какво може да се провери. Ръководството помага първо да избереш правилната институция.",sections:[["1. Определи кой отговаря за проблема","Преди изпращане провери дали въпросът е към общината, комунален оператор, полиция или друга институция."],["2. Опиши случая ясно","Посочи място, дата, конкретен проблем и приложи снимки или документи само когато са полезни и подходящи."],["3. Използвай официалния канал","Текущият телефон, имейл, форма или прием се взема от проверения Info owner. Статията не поддържа собствено копие на тези променливи данни."],["4. Запази доказателство за подаването","Когато каналът дава входящ номер или потвърждение, запази го, за да можеш да проследиш сигнала."]],owner:"Съответната институция + Инфо Лом за текущия местен канал"}
  };

  function hideDynamic() {
    dynamic.classList.remove("active");
  }

  function showBase(name) {
    hideDynamic();
    const control = document.querySelector(`[data-prototype-screen="${name}"]`);
    control?.click();
  }

  function setDynamic(title, kicker, desc, body) {
    document.querySelectorAll("[data-screen]").forEach((screen) => screen.classList.remove("active"));
    dynamic.innerHTML = `<div class="home-v2-dynamic-hero"><div class="container"><button class="home-v2-back" type="button" data-v2-back>← Начало</button><span class="dynamic-kicker">${esc(kicker)}</span><h1 tabindex="-1">${esc(title)}</h1><p>${esc(desc)}</p></div></div><div class="home-v2-dynamic-body">${body}</div>`;
    dynamic.classList.add("active");
    document.querySelectorAll(".desktop-nav .active,.mobile-bottom-nav .active,.prototype-switcher .active").forEach((node) => node.classList.remove("active"));
    window.scrollTo({top:0,behavior:"smooth"});
    requestAnimationFrame(() => dynamic.querySelector("h1")?.focus({preventScroll:true}));
  }

  function cardsMarkup(cards = []) {
    return `<div class="home-v2-dynamic-grid">${cards.map(([label,title,desc]) => `<article class="home-v2-dynamic-card"><span class="dynamic-label">${esc(label)}</span><h2>${esc(title)}</h2><p>${esc(desc)}</p><button type="button" data-v2-demo-action>Отвори →</button></article>`).join("")}</div>`;
  }

  function showCategory(name) {
    if (name === "Строителство и ремонти") return showBase("category");
    if (name === "Здраве и лекари") return showBase("health");
    if (name === "Магазини") return showDirectory("shops");
    if (name === "Заведения и храна") return showDirectory("restaurants");
    const config = categoryConfigs[name] || {desc:`Разглеждане на ${name.toLocaleLowerCase("bg-BG")} в общия V6 category shell.`,chips:["Всички"],cards:[["Категория",name,"Тук ще се показват само резултатите от правилния owner за тази категория."]]};
    const body = `<div class="home-v2-dynamic-chips">${config.chips.map((chip) => `<span>${esc(chip)}</span>`).join("")}</div>${cardsMarkup(config.cards)}<div class="home-v2-dynamic-actions"><button class="primary" type="button" data-v2-open-add>Добави</button><button class="secondary" type="button" data-v2-open-ask>Попитай Лом</button></div>`;
    setDynamic(name,"Категория",config.desc,body);
  }

  function showAllCategories() {
    const body = `<div class="home-v2-all-grid">${allCategories.map((name) => `<button class="home-v2-all-category" type="button" data-v2-category="${esc(name)}">${esc(name)}</button>`).join("")}</div>`;
    setDynamic("Всички категории","Категории","Избери тема и продължи към правилния тип съдържание — обяви, фирми, проверена информация или специализиран owner.",body);
  }

  function showDirectory(key) {
    const config = directoryConfigs[key];
    if (!config) return;
    const body = `<div class="home-v2-dynamic-chips">${config.chips.map((chip) => `<span>${esc(chip)}</span>`).join("")}</div>${cardsMarkup(config.cards)}`;
    setDynamic(config.title,config.kicker,config.desc,body);
  }

  function showInfo(key) {
    const config = infoConfigs[key];
    if (!config) return;
    const body = `<div class="home-v2-dynamic-chips">${config.chips.map((chip) => `<span>${esc(chip)}</span>`).join("")}</div>${cardsMarkup(config.cards)}<p class="home-v2-prototype-note">Prototype: тук не са hardcode-нати реални телефони, адреси или часове. В production те идват от актуалния verified Info owner.</p>`;
    setDynamic(config.title,"Инфо Лом",config.desc,body);
  }

  function showQuestions() {
    const body = `${cardsMarkup([["Строителство","Кой препоръчва добър майстор за баня?","Canonical Q&A center с одобрени community отговори."],["Автомобили","Къде в Лом правят добра диагностика?","Community мнение, отделено от проверените факти."],["Здраве","Къде има опит с конкретна услуга?","Мненията не се представят като verified медицински факт."]])}<div class="home-v2-dynamic-actions"><button class="primary" type="button" data-v2-open-ask>Задай въпрос</button></div>`;
    setDynamic("Въпроси и препоръки","Общност","Практически местен опит и препоръки, ясно отделени от проверената информация.",body);
  }

  function showGuides() {
    const body = `<div class="home-v2-guide-list">${Object.entries(articles).map(([key,article]) => `<button class="home-v2-guide-card" type="button" data-v2-article="${esc(key)}"><span class="guide-kicker">${esc(article.kicker)}</span><strong>${esc(article.title)}</strong><small>${esc(article.intro)}</small><span class="guide-arrow" aria-hidden="true">→</span></button>`).join("")}</div><p class="home-v2-prototype-note">Production правило: на Home, в Search и за официално споделяне се показват само ръководства със статус ПРОВЕРЕНО ГОТОВО.</p>`;
    setDynamic("Статии и ръководства","Полезно знание","Практически обяснения, които водят към актуалните местни owners вместо да дублират променливи факти.",body);
  }

  function showArticle(key) {
    const article = articles[key];
    if (!article) return;
    const sections = article.sections.map(([heading,text]) => `<h2>${esc(heading)}</h2><p>${esc(text)}</p>`).join("");
    const body = `<article class="home-v2-article"><div class="home-v2-article-meta"><span>${esc(article.kicker)}</span><span>Лом</span><span>V6 prototype</span></div><p>${esc(article.intro)}</p>${sections}<div class="home-v2-source-box"><strong>Актуални данни и източник</strong><p>${esc(article.owner)}. Променливите местни контакти, адреси и прием не се копират като вечен текст в статията.</p></div><div class="home-v2-article-share"><button class="share-primary" type="button" data-v2-share>Сподели</button><button class="share-copy" type="button" data-v2-copy>Копирай линк</button></div><p class="home-v2-prototype-note" data-v2-article-status>Това е визуален пример на пълната структура. Преди production публикуване съдържанието минава B4 проверка за точност, официални източници, freshness, SEO и local value.</p></article>`;
    setDynamic(article.title,"Статия / ръководство","Практическо обяснение с връзка към актуалната местна информация.",body);
  }

  function doSearch(query) {
    const value = String(query || "").trim();
    const title = document.getElementById("search-title");
    if (title && value) title.textContent = `Резултати за „${value}“`;
    const searchInput = document.querySelector('[data-screen="search"] input[type="search"]');
    if (searchInput) searchInput.value = value;
    showBase("search");
  }

  home.addEventListener("submit", (event) => {
    if (event.target.id !== "home-v2-search") return;
    event.preventDefault();
    doSearch(document.getElementById("home-v2-query")?.value);
  });

  home.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.v2Base) return showBase(button.dataset.v2Base);
    if (button.dataset.v2Category) return showCategory(button.dataset.v2Category);
    if (button.dataset.v2Directory) return showDirectory(button.dataset.v2Directory);
    if (button.dataset.v2Info) return showInfo(button.dataset.v2Info);
    if (button.dataset.v2Article) return showArticle(button.dataset.v2Article);
    if (button.dataset.v2Query) return doSearch(button.dataset.v2Query);
    if (button.dataset.v2Route === "all-categories") return showAllCategories();
    if (button.dataset.v2Route === "all-guides") return showGuides();
    if (button.dataset.v2Route === "questions") return showQuestions();
  });

  dynamic.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.hasAttribute("data-v2-back")) return showBase("home");
    if (button.dataset.v2Category) return showCategory(button.dataset.v2Category);
    if (button.dataset.v2Article) return showArticle(button.dataset.v2Article);
    if (button.hasAttribute("data-v2-open-ask")) return showBase("ask");
    if (button.hasAttribute("data-v2-open-add")) return document.querySelector("[data-open-add]")?.click();
    if (button.hasAttribute("data-v2-share") || button.hasAttribute("data-v2-copy")) {
      const status = dynamic.querySelector("[data-v2-article-status]");
      if (status) status.textContent = "Prototype: в production този бутон споделя един canonical Попитай.Лом URL само след като ръководството е ПРОВЕРЕНО ГОТОВО.";
      return;
    }
    if (button.hasAttribute("data-v2-demo-action")) {
      const card = button.closest(".home-v2-dynamic-card");
      const title = card?.querySelector("h2,h3")?.textContent || "този запис";
      button.textContent = `Prototype: ${title}`;
    }
  });

  // If the regular prototype navigation is used while a V2 dynamic destination is open,
  // hide the V2 destination first so two screens can never render at once.
  document.addEventListener("click", (event) => {
    if (!dynamic.classList.contains("active")) return;
    const standard = event.target.closest("[data-prototype-screen],[data-screen-target]");
    if (standard && !dynamic.contains(standard)) hideDynamic();
  }, true);
})();