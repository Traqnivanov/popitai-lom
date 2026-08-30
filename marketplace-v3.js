(() => {
  "use strict";

  const filename = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const MARKETPLACE_PAGES = new Set(["obyavi.html", "kategorii.html", "maistori.html", "avtomobili.html", "rabota.html", "dobavi-obqva.html"]);
  if (!MARKETPLACE_PAGES.has(filename)) return;

  const dictionary = window.PopitaiCategoryDictionary || {};
  const GROUPS = {
    maistori: {
      file: "maistori.html",
      label: "Майстори и ремонти",
      groupLabel: "Майстори и ремонти",
      storedCategory: "Услуги",
      values: groupValues("Майстори и ремонти")
    },
    avtomobili: {
      file: "avtomobili.html",
      label: "Автомобили",
      groupLabel: "Автомобилни услуги",
      storedCategory: "Услуги",
      values: groupValues("Автомобилни услуги"),
      vehicleLabel: "Автомобили за продажба или търсене"
    },
    uslugi: {
      file: "rabota.html",
      label: "Други услуги",
      groupLabel: "Общи услуги",
      storedCategory: "Услуги",
      values: groupValues("Общи услуги")
    }
  };

  const OTHER_SUBCATEGORIES = [
    "Електроника", "Дом и градина", "Дрехи и обувки", "Деца и бебета",
    "Спорт и хоби", "Животни", "Работа", "Имоти", "Друго"
  ];

  const PUBLIC_SERVICE_LABELS = new Map([
    ["Фото, видео и събитийни услуги", "Фото и видео"],
    ["Грижа за деца, възрастни и домашни любимци", "Грижа"]
  ]);

  const publicServiceLabel = (value) => PUBLIC_SERVICE_LABELS.get(value) || value;

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));

  function groupValues(label) {
    const group = (dictionary.serviceGroups || []).find((item) => item.label === label);
    return group ? [...group.values] : [];
  }

  function toUrl(file, values = {}) {
    const query = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).trim() !== "") query.set(key, value);
    });
    return `${file}${query.toString() ? `?${query.toString()}` : ""}`;
  }

  function setMeta(name, content) {
    const node = document.querySelector(`meta[name="${name}"]`);
    if (node) node.setAttribute("content", content);
  }

  function redirectLegacyCategories() {
    if (filename !== "kategorii.html") return false;
    const target = new URL("obyavi.html", window.location.href);
    params.forEach((value, key) => target.searchParams.set(key, value));
    target.hash = window.location.hash || "#marketplace-categories";
    window.location.replace(target.href);
    return true;
  }

  function categorySelectOptions() {
    return [
      ["", "Всички категории"],
      ["maistori", "Майстори и ремонти"],
      ["avtomobili", "Автомобили"],
      ["uslugi", "Други услуги"],
      ["other", "Други обяви"]
    ].map(([value, label]) => `<option value="${esc(value)}">${esc(label)}</option>`).join("");
  }

  function landingCategoryMarkup() {
    const otherUrl = (subcategory) => toUrl("obyavi.html", { main: "other", subcategory });
    const cards = [
      ["maistori.html", "Майстори и ремонти", "Бани, ВиК, електро, покриви, боядисване", "marketplace-category-card--priority"],
      ["avtomobili.html", "Автомобили", "Автомобили, части, сервизи, гуми и пътна помощ", "marketplace-category-card--priority"],
      ["rabota.html", "Други услуги", "Домашни, лични, технически и професионални услуги", "marketplace-category-card--priority"],
      [otherUrl("Дом и градина"), "Дом и градина", "Мебели, инструменти, двор и всичко за дома", "marketplace-category-card--accent"]
    ];
    const shortcuts = ["Електроника", "Имоти", "Работа"];
    const all = OTHER_SUBCATEGORIES.filter((category) => category !== "Дом и градина");

    return `<section class="marketplace-category-section" id="marketplace-categories" aria-labelledby="marketplace-categories-title">
      <h2 id="marketplace-categories-title">Какво търсиш?</h2>
      <p>Започни от най-полезните местни категории или отвори всички.</p>
      <div class="marketplace-priority-grid">
        ${cards.map(([href, title, text, cls]) => `<a class="marketplace-category-card ${cls}" href="${esc(href)}"><strong>${esc(title)}</strong><span>${esc(text)}</span></a>`).join("")}
      </div>
      <div class="marketplace-shortcuts">
        ${shortcuts.map((category) => `<a class="marketplace-shortcut" href="${esc(otherUrl(category))}">${esc(category)}</a>`).join("")}
      </div>
      <details class="marketplace-all-categories" id="marketplace-all-categories">
        <summary>Всички категории</summary>
        <div class="marketplace-all-categories-grid">
          ${all.map((category) => `<a class="marketplace-shortcut" href="${esc(otherUrl(category))}">${esc(category)}</a>`).join("")}
        </div>
      </details>
    </section>`;
  }

  function waitForListings(callback) {
    let tries = 0;
    const tick = () => {
      tries += 1;
      if (Array.isArray(window.__allListings) && document.querySelectorAll(".listing-cat-btn").length) {
        callback();
        return;
      }
      if (tries < 160) window.setTimeout(tick, 50);
    };
    tick();
  }

  function applyLandingStoredFilters() {
    const requestedMain = String(params.get("main") || "").trim();
    const requestedSubcategory = String(params.get("subcategory") || "").trim();
    const legacyCategory = String(params.get("category") || "").trim();
    const q = String(params.get("q") || "").trim();
    const search = document.getElementById("listings-search");
    if (search && q) {
      search.value = q;
      search.dispatchEvent(new Event("input", { bubbles: true }));
    }
    const storedCategory = requestedMain === "other" && OTHER_SUBCATEGORIES.includes(requestedSubcategory)
      ? requestedSubcategory
      : legacyCategory;
    if (storedCategory) {
      const button = Array.from(document.querySelectorAll(".listing-cat-btn")).find((node) => node.dataset.cat === storedCategory);
      button?.click();
    }
  }

  function decorateLandingCards() {
    const root = document.getElementById("listings-list");
    if (!root) return;
    const decorate = () => {
      root.querySelectorAll(".listing-card").forEach((card) => {
        const category = card.querySelector(".listing-category");
        const type = card.querySelector(".listing-type-badge");
        if (!category || !type) return;
        const raw = String(category.textContent || "").trim();
        if (!raw.startsWith("Услуги")) return;
        const storedSubcategory = raw.split("›").slice(1).join("›").trim();
        if (storedSubcategory) category.textContent = publicServiceLabel(storedSubcategory);
        type.textContent = String(type.textContent || "").trim() === "Търси" ? "Търси услуга" : "Предлага услуга";
      });
    };
    decorate();
    new MutationObserver(decorate).observe(root, { childList: true, subtree: true });
  }

  function initLanding() {
    document.body.classList.add("marketplace-v3", "marketplace-v3-landing");
    document.title = "Обяви и услуги | Попитай.Лом";
    setMeta("description", "Майстори, услуги, автомобили, имоти, работа и местни обяви в Лом — на едно място.");

    const hero = document.querySelector(".page-hero .section-container");
    if (hero) {
      hero.innerHTML = `<span class="section-kicker">Местният marketplace</span>
        <h1>Обяви и услуги</h1>
        <p>Майстори, услуги, автомобили, имоти, работа и местни обяви — на едно място.</p>
        <form class="marketplace-search" id="marketplace-search" role="search">
          <label class="sr-only" for="marketplace-query">Какво търсиш?</label>
          <input id="marketplace-query" type="search" autocomplete="off" placeholder="Какво търсиш?">
          <label class="sr-only" for="marketplace-category">Главна категория</label>
          <select id="marketplace-category" aria-label="Главна категория">${categorySelectOptions()}</select>
          <button type="submit">Търси</button>
        </form>
        <a class="primary-link-button marketplace-primary-cta" href="dobavi-obqva.html">Добави обява</a>`;
    }

    const section = document.querySelector(".content-section .section-container");
    const legacyCategories = document.getElementById("listing-categories");
    const filters = document.getElementById("listings-filters");
    const list = document.getElementById("listings-list");
    if (section && legacyCategories && !document.getElementById("marketplace-categories")) {
      legacyCategories.insertAdjacentHTML("beforebegin", landingCategoryMarkup());
    }
    if (filters && !filters.closest(".marketplace-advanced-filters")) {
      const details = document.createElement("details");
      details.className = "marketplace-advanced-filters";
      details.innerHTML = "<summary>Допълнителни филтри и сортиране</summary>";
      filters.insertAdjacentElement("beforebegin", details);
      details.appendChild(filters);
    }
    if (list && !document.querySelector(".marketplace-results-heading")) {
      list.insertAdjacentHTML("beforebegin", `<div class="marketplace-results-heading"><h2>Най-нови обяви и услуги</h2><p>Реални активни публикации от Лом и региона.</p></div>`);
    }

    const form = document.getElementById("marketplace-search");
    const qField = document.getElementById("marketplace-query");
    const mainField = document.getElementById("marketplace-category");
    if (qField) qField.value = String(params.get("q") || "");
    const requestedMain = String(params.get("main") || "");
    if (mainField && optionExists(mainField, requestedMain)) mainField.value = requestedMain;
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const q = String(qField?.value || "").trim();
      const main = String(mainField?.value || "");
      if (GROUPS[main]) {
        window.location.href = toUrl(GROUPS[main].file, { q });
        return;
      }
      const target = new URL("obyavi.html", window.location.href);
      if (q) target.searchParams.set("q", q);
      if (main === "other") {
        target.searchParams.set("main", "other");
        target.hash = "marketplace-all-categories";
      }
      window.location.href = target.href;
    });

    decorateLandingCards();
    waitForListings(applyLandingStoredFilters);
  }

  function currentThemeKey() {
    if (filename === "maistori.html") return "maistori";
    if (filename === "avtomobili.html") return "avtomobili";
    if (filename === "rabota.html") return "uslugi";
    return "";
  }

  function themeUrl(themeKey, changes = {}) {
    const urlParams = new URLSearchParams(window.location.search);
    ["subcategory", "intent", "view", "q"].forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        const value = changes[key];
        if (value) urlParams.set(key, value);
        else urlParams.delete(key);
      }
    });
    const qs = urlParams.toString();
    return `${GROUPS[themeKey].file}${qs ? `?${qs}` : ""}#marketplace-results`;
  }

  function markBlock(root, kind) {
    if (!root) return;
    root.dataset.marketplaceBlock = kind;
    const heading = root.previousElementSibling;
    if (heading?.classList.contains("block-heading")) heading.dataset.marketplaceHeading = kind;
  }

  function hideQuestions() {
    document.querySelectorAll("[data-category-questions]").forEach((root) => {
      root.dataset.marketplaceSecondary = "questions";
      const heading = root.previousElementSibling;
      if (heading?.classList.contains("block-heading")) heading.dataset.marketplaceSecondaryHeading = "questions";
    });
  }

  function addAutoVehicleCard(grid, themeKey) {
    if (themeKey !== "avtomobili" || !grid || grid.querySelector('[data-marketplace-vehicle-card="true"]')) return;
    const label = GROUPS.avtomobili.vehicleLabel;
    const wrapper = document.createElement("article");
    wrapper.className = "contextual-subcategory-item";
    wrapper.dataset.marketplaceVehicleCard = "true";
    wrapper.innerHTML = `<a class="subcategory-card" href="${esc(themeUrl(themeKey, { subcategory: label, intent: "", view: "" }))}"><strong>${esc(label)}</strong><span>Реални автомобилни обяви</span></a>`;
    grid.insertAdjacentElement("afterbegin", wrapper);
  }

  function rewriteSubcategoryCards(themeKey) {
    const grid = document.getElementById("category-subcategories");
    if (!grid) return;
    addAutoVehicleCard(grid, themeKey);
    grid.querySelectorAll(".contextual-subcategory-item").forEach((unit) => {
      const card = unit.querySelector(":scope > .subcategory-card");
      const storedLabel = String(card?.querySelector("strong")?.textContent || "").trim();
      if (!card || !storedLabel) return;
      card.dataset.marketplaceSubcategory = storedLabel;
      card.href = themeUrl(themeKey, { subcategory: storedLabel, intent: "", view: "" });
      const title = card.querySelector("strong");
      if (title) title.textContent = publicServiceLabel(storedLabel);
      const description = card.querySelector("span");
      if (description) description.textContent = "Обяви и фирмени профили";
    });
  }

  function buildThemeFilters(themeKey) {
    const grid = document.getElementById("category-subcategories");
    if (!grid || document.querySelector(".marketplace-filterbar")) return;
    const activeIntent = String(params.get("intent") || "");
    const activeView = String(params.get("view") || "");
    const items = [
      ["", "", "Всички"],
      ["offer", "", "Предлагат"],
      ["seek", "", "Търсят"],
      ["", "firms", "Фирми"]
    ];
    const bar = document.createElement("nav");
    bar.className = "marketplace-filterbar";
    bar.id = "marketplace-results";
    bar.setAttribute("aria-label", "Филтри на резултатите");
    bar.innerHTML = items.map(([intent, view, label]) => {
      const active = (intent === activeIntent && view === activeView) || (!intent && !view && !activeIntent && !activeView);
      return `<a class="${active ? "active" : ""}" href="${esc(themeUrl(themeKey, { intent, view }))}"${active ? ' aria-current="page"' : ""}>${esc(label)}</a>`;
    }).join("");
    const mobileExpand = grid.nextElementSibling?.classList.contains("category-mobile-expand") ? grid.nextElementSibling : null;
    (mobileExpand || grid).insertAdjacentElement("afterend", bar);
  }

  function configureThemeBlocks(themeKey) {
    const firmRoot = document.querySelector("[data-category-businesses]");
    const listingRoots = Array.from(document.querySelectorAll("[data-category-listings]"));
    markBlock(firmRoot, "firms");
    listingRoots.forEach((root) => markBlock(root, "listings"));
    hideQuestions();

    const firmHeading = firmRoot?.previousElementSibling;
    if (firmHeading?.querySelector("h2")) {
      firmHeading.querySelector("h2").innerHTML = `Фирмени профили <span class="marketplace-result-label">Фирма</span>`;
    }

    const view = String(params.get("view") || "");
    const intent = String(params.get("intent") || "");
    const subcategory = String(params.get("subcategory") || "");

    if (view === "firms") {
      listingRoots.forEach((root) => {
        root.hidden = true;
        if (root.previousElementSibling?.dataset.marketplaceHeading === "listings") root.previousElementSibling.hidden = true;
      });
      if (firmRoot) firmRoot.hidden = false;
      if (firmHeading) firmHeading.hidden = false;
      return;
    }

    if (intent && firmRoot) {
      firmRoot.hidden = true;
      if (firmHeading) firmHeading.hidden = true;
    }

    if (themeKey === "avtomobili" && subcategory) {
      const vehicleSelected = subcategory === GROUPS.avtomobili.vehicleLabel;
      listingRoots.forEach((root) => {
        const isVehicleRoot = Boolean(root.dataset.listingCategory);
        const shouldShow = vehicleSelected ? isVehicleRoot : !isVehicleRoot;
        root.hidden = !shouldShow;
        if (root.previousElementSibling?.dataset.marketplaceHeading === "listings") root.previousElementSibling.hidden = !shouldShow;
      });
    }
  }

  function findLegacyPromo(themeKey) {
    document.querySelectorAll(".content-section article.empty-card").forEach((card) => {
      const text = String(card.textContent || "");
      if ((themeKey === "avtomobili" && text.includes("Продаваш или купуваш автомобил")) ||
          (themeKey === "uslugi" && text.includes("Търсиш или предлагаш работа"))) {
        card.classList.add("marketplace-legacy-promo");
      }
    });
  }

  function initTheme() {
    const themeKey = currentThemeKey();
    if (!themeKey) return;
    const config = GROUPS[themeKey];
    document.body.classList.add("marketplace-v3", "marketplace-v3-theme", `marketplace-theme-${themeKey}`);

    const breadcrumbs = document.querySelector(".site-breadcrumbs ol");
    if (breadcrumbs?.children[1]) breadcrumbs.children[1].innerHTML = '<a href="obyavi.html">Обяви и услуги</a>';

    const heroContainer = document.querySelector(".page-hero .section-container");
    const actions = heroContainer?.querySelector(".public-stage4-actions");
    const requestedSubcategory = String(params.get("subcategory") || "").trim();
    const requestedIntent = String(params.get("intent") || "").trim();
    const addParams = { main: themeKey };
    if (requestedSubcategory) addParams.subcategory = requestedSubcategory;
    if (requestedIntent) addParams.intent = requestedIntent;
    if (actions) {
      actions.innerHTML = `<a class="primary-link-button marketplace-category-add" href="${esc(toUrl("dobavi-obqva.html", addParams))}">Добави обява</a>`;
    }

    const description = heroContainer?.querySelector("p");
    if (description && !document.querySelector(".marketplace-category-search")) {
      description.insertAdjacentHTML("afterend", `<form class="marketplace-search marketplace-category-search" role="search" action="${esc(config.file)}">
        <label class="sr-only" for="marketplace-category-query">Търси в категорията</label>
        <input id="marketplace-category-query" name="q" type="search" value="${esc(params.get("q") || "")}" placeholder="Търси в ${esc(config.label.toLowerCase())}">
        <input type="hidden" name="subcategory" value="${esc(requestedSubcategory)}">
        <button type="submit">Търси</button>
      </form>`);
    }

    rewriteSubcategoryCards(themeKey);
    buildThemeFilters(themeKey);
    configureThemeBlocks(themeKey);
    findLegacyPromo(themeKey);

    const activeCard = Array.from(document.querySelectorAll("#category-subcategories .subcategory-card")).find((card) =>
      String(card.dataset.marketplaceSubcategory || card.querySelector("strong")?.textContent || "").trim() === requestedSubcategory
    );
    activeCard?.setAttribute("aria-current", "page");
  }

  function deriveMainFromStorage(categoryValue, subcategoryValue) {
    if (categoryValue === "Услуги") {
      if (GROUPS.maistori.values.includes(subcategoryValue)) return "maistori";
      if (GROUPS.avtomobili.values.includes(subcategoryValue)) return "avtomobili";
      if (GROUPS.uslugi.values.includes(subcategoryValue)) return "uslugi";
    }
    if (categoryValue === "Автомобили и МПС") return "avtomobili";
    if (OTHER_SUBCATEGORIES.includes(categoryValue)) return "other";
    return "";
  }

  function deriveIntentFromStorage(categoryValue, typeValue) {
    if (categoryValue === "Работа") return typeValue === "Търси работа" ? "seek" : typeValue ? "offer" : "";
    if (categoryValue === "Имоти") return String(typeValue).startsWith("Търси") ? "seek" : typeValue ? "offer" : "";
    if (["Търси", "Купува"].includes(typeValue)) return "seek";
    if (["Продава", "Дава"].includes(typeValue)) return "offer";
    return "";
  }

  function getStoredType(categoryValue) {
    if (categoryValue === "Работа") return document.getElementById("listing-type-rabota-select")?.value || "";
    if (categoryValue === "Имоти") return document.getElementById("listing-type-imoti-select")?.value || "";
    return document.getElementById("listing-type")?.value || "";
  }

  function optionExists(select, value) {
    return Boolean(select) && Array.from(select.options).some((option) => option.value === value);
  }

  function setStoredSelect(select, value) {
    if (!select || !optionExists(select, value)) return false;
    if (select.value === value) return true;
    select.value = value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  function createFormFlow() {
    const form = document.getElementById("listing-form");
    if (!form || document.getElementById("marketplace-form-flow")) return null;
    const publisher = document.getElementById("listing-publisher-section");
    const titleLabel = form.querySelector('label[for="listing-title"]');
    const flow = document.createElement("section");
    flow.className = "marketplace-form-flow";
    flow.id = "marketplace-form-flow";
    flow.innerHTML = `<h2>Какво публикуваш?</h2>
      <p>Избери дали предлагаш или търсиш, после категория и подкатегория.</p>
      <div class="marketplace-intent-grid" role="radiogroup" aria-label="Предлагам или търся">
        <label class="marketplace-intent-option"><input type="radio" name="marketplace-intent" value="offer"><span>Предлагам</span></label>
        <label class="marketplace-intent-option"><input type="radio" name="marketplace-intent" value="seek"><span>Търся</span></label>
      </div>
      <label class="marketplace-field-label" for="marketplace-main-category">Главна категория</label>
      <select id="marketplace-main-category"><option value="">Избери категория</option>
        <option value="maistori">Майстори и ремонти</option>
        <option value="avtomobili">Автомобили</option>
        <option value="uslugi">Други услуги</option>
        <option value="other">Други обяви</option>
      </select>
      <div id="marketplace-subcategory-wrap" hidden>
        <label class="marketplace-field-label" for="marketplace-subcategory">Подкатегория</label>
        <select id="marketplace-subcategory"><option value="">Избери подкатегория</option></select>
      </div>
      <p class="marketplace-form-error" id="marketplace-form-error" role="alert" aria-live="polite"></p>`;
    if (publisher) publisher.insertAdjacentElement("afterend", flow);
    else titleLabel?.insertAdjacentElement("beforebegin", flow);
    return flow;
  }

  function hideStorageCategoryFields() {
    const pairs = [
      [document.querySelector('label[for="listing-category"]'), document.getElementById("listing-category")],
      [document.getElementById("listing-subcategory-field"), null]
    ];
    pairs.forEach(([a, b]) => { a?.classList.add("marketplace-storage-field"); b?.classList.add("marketplace-storage-field"); });
  }

  function updatePublicSubcategories(mainSelect, subSelect, wrap) {
    const main = mainSelect.value;
    let values = [];
    if (GROUPS[main]) values = [...GROUPS[main].values];
    if (main === "avtomobili") values.unshift(GROUPS.avtomobili.vehicleLabel);
    if (main === "other") values = [...OTHER_SUBCATEGORIES];
    if (!values.length) {
      wrap.hidden = true;
      subSelect.innerHTML = '<option value="">Избери подкатегория</option>';
      return;
    }
    const current = subSelect.value;
    subSelect.innerHTML = '<option value="">Избери подкатегория</option>' + values.map((value) => `<option value="${esc(value)}">${esc(publicServiceLabel(value))}</option>`).join("");
    wrap.hidden = false;
    if (values.includes(current)) subSelect.value = current;
  }

  function syncStorageFromPublic() {
    const main = document.getElementById("marketplace-main-category")?.value || "";
    const sub = document.getElementById("marketplace-subcategory")?.value || "";
    const intent = document.querySelector('input[name="marketplace-intent"]:checked')?.value || "";
    const category = document.getElementById("listing-category");
    const storedSub = document.getElementById("listing-subcategory");
    if (!category) return;

    let storedCategory = "";
    let storedSubcategory = "";
    if (main === "maistori" || main === "uslugi") {
      storedCategory = "Услуги";
      storedSubcategory = sub;
    } else if (main === "avtomobili") {
      if (sub === GROUPS.avtomobili.vehicleLabel) storedCategory = "Автомобили и МПС";
      else { storedCategory = "Услуги"; storedSubcategory = sub; }
    } else if (main === "other" && OTHER_SUBCATEGORIES.includes(sub)) {
      storedCategory = sub;
    }

    if (storedCategory && optionExists(category, storedCategory)) {
      setStoredSelect(category, storedCategory);
      if (storedCategory === "Услуги" && storedSubcategory && optionExists(storedSub, storedSubcategory)) setStoredSelect(storedSub, storedSubcategory);
      else if (storedSub && storedSub.value) { storedSub.value = ""; storedSub.dispatchEvent(new Event("change", { bubbles: true })); }
    } else if (!storedCategory) {
      category.value = "";
      category.dispatchEvent(new Event("change", { bubbles: true }));
    }

    if (!intent || !storedCategory) return;
    if (storedCategory === "Работа") {
      setStoredSelect(document.getElementById("listing-type-rabota-select"), intent === "seek" ? "Търси работа" : "Предлага работа");
      return;
    }
    if (storedCategory === "Имоти") {
      const field = document.getElementById("listing-type-imoti-select");
      const current = field?.value || "";
      const validForIntent = intent === "seek" ? current.startsWith("Търси") : ["Продава имот", "Отдава под наем"].includes(current);
      if (!validForIntent) setStoredSelect(field, intent === "seek" ? "Търси за купуване" : "Продава имот");
      return;
    }
    const field = document.getElementById("listing-type");
    const current = field?.value || "";
    if (storedCategory === "Услуги") {
      setStoredSelect(field, intent === "seek" ? "Търси" : "Продава");
    } else if (storedCategory === "Автомобили и МПС") {
      setStoredSelect(field, intent === "seek" ? "Купува" : "Продава");
    } else {
      const compatible = intent === "seek" ? ["Купува", "Търси"] : ["Продава", "Дава"];
      if (!compatible.includes(current)) setStoredSelect(field, intent === "seek" ? "Търси" : "Продава");
    }
  }

  function syncPublicFromStorage({ preferParams = false } = {}) {
    const mainSelect = document.getElementById("marketplace-main-category");
    const subSelect = document.getElementById("marketplace-subcategory");
    const wrap = document.getElementById("marketplace-subcategory-wrap");
    const category = document.getElementById("listing-category")?.value || "";
    const storedSub = document.getElementById("listing-subcategory")?.value || "";
    const storedType = getStoredType(category);
    if (!mainSelect || !subSelect || !wrap) return;

    let main = deriveMainFromStorage(category, storedSub);
    let intent = deriveIntentFromStorage(category, storedType);
    let sub = main === "other" ? category : storedSub;

    if (preferParams) {
      const requestedMain = String(params.get("main") || "");
      const requestedIntent = String(params.get("intent") || "");
      const requestedSub = String(params.get("subcategory") || "");
      if (requestedMain && optionExists(mainSelect, requestedMain)) main = requestedMain;
      if (["offer", "seek"].includes(requestedIntent)) intent = requestedIntent;
      if (requestedSub) sub = requestedSub;
    }

    mainSelect.value = main || "";
    updatePublicSubcategories(mainSelect, subSelect, wrap);
    if (sub && optionExists(subSelect, sub)) subSelect.value = sub;
    document.querySelectorAll('input[name="marketplace-intent"]').forEach((radio) => { radio.checked = radio.value === intent; });
  }

  function updateDetailedTypeVisibility() {
    const main = document.getElementById("marketplace-main-category")?.value || "";
    const sub = document.getElementById("marketplace-subcategory")?.value || "";
    const standardLabel = document.getElementById("listing-type-label");
    const standard = document.getElementById("listing-type");
    const jobs = document.getElementById("listing-type-rabota");
    const property = document.getElementById("listing-type-imoti");
    const serviceLike = main === "maistori" || main === "uslugi" || (main === "avtomobili" && sub && sub !== GROUPS.avtomobili.vehicleLabel);
    const jobsSelected = main === "other" && sub === "Работа";
    const propertySelected = main === "other" && sub === "Имоти";
    if (standardLabel) standardLabel.classList.toggle("marketplace-storage-field", serviceLike || jobsSelected || propertySelected);
    if (standard) standard.classList.toggle("marketplace-storage-field", serviceLike || jobsSelected || propertySelected);
    if (standardLabel && !serviceLike && main && !jobsSelected && !propertySelected) standardLabel.textContent = "Уточни типа на обявата";
    if (jobs && !jobs.hidden) jobs.querySelector("label")?.classList.add("marketplace-detail-type-label");
    if (property && !property.hidden) property.querySelector("label")?.classList.add("marketplace-detail-type-label");
  }

  function validatePublicFlow(event) {
    if (filename !== "dobavi-obqva.html" || params.has("edit")) return;
    const main = document.getElementById("marketplace-main-category")?.value || "";
    const intent = document.querySelector('input[name="marketplace-intent"]:checked')?.value || "";
    const subWrap = document.getElementById("marketplace-subcategory-wrap");
    const sub = document.getElementById("marketplace-subcategory")?.value || "";
    const error = document.getElementById("marketplace-form-error");
    let message = "";
    if (!intent) message = "Избери дали предлагаш или търсиш.";
    else if (!main) message = "Избери главна категория.";
    else if (subWrap && !subWrap.hidden && !sub) message = "Избери подкатегория.";
    if (!message) { if (error) error.textContent = ""; return; }
    event.preventDefault();
    event.stopImmediatePropagation();
    if (error) error.textContent = message;
    document.getElementById("marketplace-form-flow")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function initForm() {
    const form = document.getElementById("listing-form");
    if (!form) return;
    document.body.classList.add("marketplace-v3", "marketplace-v3-form");
    document.title = params.has("edit") ? document.title : "Добави обява | Обяви и услуги | Попитай.Лом";
    const crumb = document.querySelector(".site-breadcrumbs ol")?.children[1];
    if (crumb) crumb.innerHTML = '<a href="obyavi.html">Обяви и услуги</a>';
    createFormFlow();
    hideStorageCategoryFields();

    const mainSelect = document.getElementById("marketplace-main-category");
    const subSelect = document.getElementById("marketplace-subcategory");
    const wrap = document.getElementById("marketplace-subcategory-wrap");
    if (!mainSelect || !subSelect || !wrap) return;

    const wire = () => {
      mainSelect.addEventListener("change", () => {
        subSelect.value = "";
        updatePublicSubcategories(mainSelect, subSelect, wrap);
        syncStorageFromPublic();
        updateDetailedTypeVisibility();
      });
      subSelect.addEventListener("change", () => { syncStorageFromPublic(); updateDetailedTypeVisibility(); });
      document.querySelectorAll('input[name="marketplace-intent"]').forEach((radio) => radio.addEventListener("change", () => {
        syncStorageFromPublic();
        const error = document.getElementById("marketplace-form-error");
        if (error) error.textContent = "";
      }));
      const syncIntentFromDetailedType = () => {
        const category = document.getElementById("listing-category")?.value || "";
        const derived = deriveIntentFromStorage(category, getStoredType(category));
        const radio = derived ? document.querySelector(`input[name="marketplace-intent"][value="${derived}"]`) : null;
        if (radio && !radio.checked) radio.click();
      };
      document.getElementById("listing-type")?.addEventListener("change", syncIntentFromDetailedType);
      document.getElementById("listing-type-rabota-select")?.addEventListener("change", syncIntentFromDetailedType);
      document.getElementById("listing-type-imoti-select")?.addEventListener("change", syncIntentFromDetailedType);
      document.addEventListener("submit", validatePublicFlow, true);
    };

    if (params.has("edit")) {
      let tries = 0;
      const waitEdit = () => {
        tries += 1;
        const category = document.getElementById("listing-category");
        if ((category?.value && !category.disabled) || tries > 160) {
          syncPublicFromStorage();
          updateDetailedTypeVisibility();
          wire();
          return;
        }
        window.setTimeout(waitEdit, 50);
      };
      waitEdit();
    } else {
      syncPublicFromStorage({ preferParams: true });
      syncStorageFromPublic();
      updateDetailedTypeVisibility();
      wire();
    }
  }

  if (redirectLegacyCategories()) return;
  if (filename === "obyavi.html") initLanding();
  else if (["maistori.html", "avtomobili.html", "rabota.html"].includes(filename)) initTheme();
  else if (filename === "dobavi-obqva.html") initForm();
})();
