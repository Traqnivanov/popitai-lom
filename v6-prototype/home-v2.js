(() => {
  "use strict";

  const home = document.querySelector('[data-screen="home"]');
  if (!home) return;

  const svg = {
    construction: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 18.5 9.5M13 7l4 4M4 20l6.2-6.2M8.4 4.4l3.2 3.2-2.1 2.1L6.3 6.5 4.8 8 3 6.2l5.4-5.4L10.2 2.6 8.4 4.4Z"/><path d="m13.7 13.7 4.8 4.8a1.4 1.4 0 0 0 2-2l-4.8-4.8"/></svg>',
    health: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3Z"/></svg>',
    work: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></svg>',
    car: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 16-1.3-2.6a2 2 0 0 1 .2-2.2L6 8h12l2.1 3.2a2 2 0 0 1 .2 2.2L19 16"/><path d="M3 16h18v3a1 1 0 0 1-1 1h-2v-2H6v2H4a1 1 0 0 1-1-1v-3Z"/><circle cx="7" cy="14" r="1"/><circle cx="17" cy="14" r="1"/></svg>',
    shop: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h16l-1-5H5L4 9Z"/><path d="M5 9v11h14V9M9 20v-6h6v6"/><path d="M4 9a3 3 0 0 0 5 2 3 3 0 0 0 6 0 3 3 0 0 0 5-2"/></svg>',
    restaurant: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3v7M3 3v4a3 3 0 0 0 6 0V3M6 10v11M15 3v18M15 3c3 2 4 5 4 8h-4"/></svg>',
    business: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V8l8-5 8 5v13H4Z"/><path d="M8 21v-6h8v6M8 10h2M14 10h2"/></svg>',
    event: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M7 14h3M14 14h3M7 18h3"/></svg>'
  };

  function replaceIcon(node, icon, className = "home-v2-icon") {
    if (!node || !svg[icon]) return;
    node.classList.add(className);
    node.innerHTML = svg[icon];
  }

  function text(node, value) {
    if (node) node.textContent = value;
  }

  // Prototype controls belong to the review chrome, not the product hierarchy.
  const banner = document.querySelector(".prototype-banner");
  const switcher = document.querySelector(".prototype-switcher");
  if (banner && switcher && !banner.contains(switcher)) {
    banner.appendChild(switcher);
    switcher.classList.add("prototype-switcher--embedded");
    const strong = switcher.querySelector("strong");
    if (strong) strong.textContent = "Преглед:";
    const labels = {
      home: "Начало",
      category: "Категория",
      health: "Здраве",
      search: "Търсене",
      ask: "Попитай",
      states: "States"
    };
    switcher.querySelectorAll("[data-prototype-screen]").forEach((button) => {
      button.textContent = labels[button.dataset.prototypeScreen] || button.textContent;
    });
  }

  // Hero: one job — search. Remove the full-screen tutorial card.
  const hero = home.querySelector(".home-hero");
  const heroGrid = hero?.querySelector(".hero-grid");
  const heroCopy = hero?.querySelector(".hero-copy");
  const trustCard = hero?.querySelector(".trust-card");
  hero?.classList.add("home-v2-hero");
  heroGrid?.classList.add("home-v2-hero-grid");
  heroCopy?.classList.add("home-v2-hero-copy");
  trustCard?.remove();

  text(heroCopy?.querySelector(".eyebrow"), "Лом на едно място");
  text(heroCopy?.querySelector("h1"), "Какво търсиш в Лом?");
  text(heroCopy?.querySelector(":scope > p"), "Намери проверена информация, местни услуги, работа, имоти, фирми и полезни отговори — всичко за Лом на едно място.");

  const mainSearch = heroCopy?.querySelector(".main-search");
  mainSearch?.classList.add("home-v2-search");
  const homeSearch = mainSearch?.querySelector('input[type="search"]');
  if (homeSearch) homeSearch.placeholder = "Например: ВиК майстор, аптека, работа…";
  heroCopy?.querySelector(".hero-hints")?.classList.add("home-v2-hints");

  // Main category section comes immediately after Search.
  const quick = home.querySelector("#quick-title")?.closest(".section-block");
  quick?.classList.add("home-v2-main-categories");
  const quickEyebrow = quick?.querySelector(".section-head .eyebrow");
  if (quickEyebrow) quickEyebrow.hidden = true;
  text(quick?.querySelector("#quick-title"), "Основни категории");
  const allCategories = quick?.querySelector(".section-head .text-btn");
  text(allCategories, "Всички категории");
  allCategories?.classList.add("home-v2-all-categories");

  const shortcutCards = [...(quick?.querySelectorAll(".shortcut-card") || [])];
  const shortcutConfig = [
    ["construction", "Строителство и ремонти", "Майстори, ВиК, електро, покриви"],
    ["health", "Здраве и лекари", "Лекари, аптеки, лаборатории"],
    ["work", "Работа", "Обяви за работа в Лом"],
    ["car", "Автомобили", "Коли, сервизи, гуми, части"],
    ["business", "Имоти", "Продажби, наеми и търсене"],
    ["business", "Красота", "Фризьори, козметика, грижа"]
  ];
  shortcutCards.forEach((card, index) => {
    card.classList.add("home-v2-category-card");
    const [icon, title, desc] = shortcutConfig[index] || [];
    replaceIcon(card.querySelector(".shortcut-icon"), icon);
    text(card.querySelector("strong"), title);
    text(card.querySelector("small"), desc);
  });

  // Discover Lom: compact 2x2 navigation, not four tall promotional cards.
  const discover = home.querySelector(".discover-block");
  discover?.classList.add("home-v2-discover");
  const discoverEyebrow = discover?.querySelector(".section-head .eyebrow");
  if (discoverEyebrow) discoverEyebrow.hidden = true;
  text(discover?.querySelector("#discover-title"), "Открий в Лом");

  const discoverArticles = [...(discover?.querySelectorAll(".discover-grid > article") || [])];
  const discoverByTitle = new Map(discoverArticles.map((article) => [article.querySelector("strong")?.textContent.trim(), article]));
  const discoverOrder = ["Магазини", "Заведения", "Фирми", "Събития"];
  const discoverIcons = { Магазини: "shop", Заведения: "restaurant", Фирми: "business", Събития: "event" };
  const discoverDescriptions = {
    Магазини: "Местни магазини по категории",
    Заведения: "Заведения и местни препоръки",
    Фирми: "Постоянни местни профили",
    Събития: "Предстоящи одобрени събития"
  };
  const discoverGrid = discover?.querySelector(".discover-grid");
  discoverOrder.forEach((title) => {
    const article = discoverByTitle.get(title);
    if (!article) return;
    discoverGrid?.appendChild(article);
    article.classList.add("home-v2-discover-card");
    replaceIcon(article.querySelector(":scope > span"), discoverIcons[title]);
    text(article.querySelector("small"), discoverDescriptions[title]);
    const button = article.querySelector("button");
    if (button) {
      button.textContent = "→";
      button.classList.add("home-v2-card-arrow");
      button.setAttribute("aria-label", `Отвори ${title}`);
    }
    article.tabIndex = 0;
    article.setAttribute("role", "button");
    article.setAttribute("aria-label", `Отвори ${title}`);
    const activate = (event) => {
      if (event.type === "keydown" && !["Enter", " "].includes(event.key)) return;
      if (event.target.closest("button")) return;
      event.preventDefault();
      button?.click();
    };
    article.addEventListener("click", activate);
    article.addEventListener("keydown", activate);
  });

  // Verified Info + Community remain distinct but compact.
  const split = home.querySelector(".split-grid");
  split?.classList.add("home-v2-secondary-grid");
  const verified = split?.querySelector(".verified-panel");
  const community = split?.querySelector(".community-panel");
  verified?.classList.add("home-v2-verified");
  community?.classList.add("home-v2-community");

  text(verified?.querySelector(".panel-head .eyebrow"), "Инфо Лом");
  text(verified?.querySelector(".panel-head h2"), "Проверена информация");
  verified?.querySelector(".utility-list")?.classList.add("home-v2-utility-grid");

  const utilityCopy = [
    ["Здраве и лекари", "Лекари, аптеки, болница"],
    ["Институции", "Община, НОИ, полиция"],
    ["Транспорт", "Автогара, БДЖ, таксита"],
    ["Комунални", "Вода, ток, куриери"]
  ];
  [...(verified?.querySelectorAll(".utility-list button") || [])].forEach((button, index) => {
    button.classList.add("home-v2-utility-item");
    const [title, desc] = utilityCopy[index] || [];
    text(button.querySelector("strong"), title);
    text(button.querySelector("span"), desc);
  });

  const communityEyebrow = community?.querySelector(".eyebrow");
  if (communityEyebrow) communityEyebrow.hidden = true;
  text(community?.querySelector("h2"), "Въпроси и препоръки");
  const questionButton = community?.querySelector(".secondary-btn");
  text(questionButton, "Виж всички въпроси");

  // Add a stable class so CSS can target the complete V2 home without leaking to other screens.
  home.classList.add("home-v2-ready");
})();
