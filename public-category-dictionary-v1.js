(() => {
  "use strict";

  const SERVICE_SUBCATEGORIES = Object.freeze([
    "Цялостни ремонти",
    "Бани и плочки",
    "ВиК",
    "Електро",
    "Покриви",
    "Боядисване",
    "Дограма",
    "Климатици",
    "Автосервизи",
    "Диагностика",
    "Гуми",
    "Авточасти",
    "Автомивки",
    "Пътна помощ",
    "Домашна помощ",
    "Красота и грижа",
    "Компютърни и технически услуги",
    "Фото, видео и събитийни услуги",
    "Професионални услуги",
    "Обучение и уроци",
    "Грижа за деца, възрастни и домашни любимци",
    "Транспорт, преместване и доставки"
  ]);

  const SERVICE_GROUPS = Object.freeze([
    Object.freeze({ label: "Майстори и ремонти", values: Object.freeze(SERVICE_SUBCATEGORIES.slice(0, 8)) }),
    Object.freeze({ label: "Автомобилни услуги", values: Object.freeze(SERVICE_SUBCATEGORIES.slice(8, 14)) }),
    Object.freeze({ label: "Други услуги", values: Object.freeze(SERVICE_SUBCATEGORIES.slice(14)) })
  ]);

  const PUBLIC_CATEGORIES = Object.freeze([
    Object.freeze({
      id: "maistori", label: "Майстори и ремонти", searchLabel: "Майстори и ремонти",
      description: "Ремонти, ВиК, електро, покриви, дограма и услуги за дома.", route: "maistori.html",
      values: Object.freeze({ business: "Майстори и ремонти", question: "Майстори и ремонти" })
    }),
    Object.freeze({
      id: "zdrave", label: "Здраве и лекари", searchLabel: "Здраве и лекари",
      description: "Лекари, стоматолози, аптеки и здравни услуги.", route: "zdrave-i-lekari.html",
      values: Object.freeze({ business: "Здраве и лекари", question: "Здраве и лекари" })
    }),
    Object.freeze({
      id: "avtomobili", label: "Автомобили", searchLabel: "Автомобили",
      description: "Сервизи, гуми, части, автомивки и пътна помощ.", route: "avtomobili.html",
      values: Object.freeze({ business: "Автомобили", question: "Автомобили" })
    }),
    Object.freeze({
      id: "magazini", label: "Магазини и покупки", searchLabel: "Магазини и покупки",
      description: "Местни магазини, материали, техника и покупки.", route: "magazini.html",
      values: Object.freeze({ business: "Магазини и покупки", question: "Магазини и покупки" })
    }),
    Object.freeze({
      id: "zavedenia", label: "Заведения", searchLabel: "Заведения",
      description: "Ресторанти, кафенета, пицарии и доставки.", route: "zavedenia.html",
      values: Object.freeze({ business: "Заведения", question: "Заведения" })
    }),
    Object.freeze({
      id: "uslugi", label: "Услуги", searchLabel: "Услуги",
      description: "Услуги, предлагани от местни хора и фирми.", route: "rabota.html",
      values: Object.freeze({ business: "Работа и услуги", question: "Работа и услуги", listing: "Услуги" })
    }),
    Object.freeze({
      id: "obyavi", label: "Обяви", navigationLabel: "Всички обяви", searchLabel: "Обяви",
      description: "Купува, продава, подарява, наема и търси.", route: "obyavi.html",
      values: Object.freeze({ question: "Обяви" })
    }),
    Object.freeze({
      id: "sabitiya", label: "Събития", searchLabel: "Събития",
      description: "Предстоящи и актуални събития в Лом.", route: "sabitiya.html",
      values: Object.freeze({ question: "Събития и град" })
    })
  ]);

  const LISTING_CATEGORIES = Object.freeze([
    "Електроника", "Дом и градина", "Дрехи и обувки", "Деца и бебета", "Спорт и хоби",
    "Автомобили и МПС", "Животни", "Работа", "Имоти", "Услуги", "Друго"
  ]);

  const BUSINESS_CATEGORY_IDS = Object.freeze(["maistori", "zdrave", "avtomobili", "magazini", "zavedenia", "uslugi"]);
  const byId = new Map(PUBLIC_CATEGORIES.map((item) => [item.id, item]));

  function categoryForValue(type, value) {
    const normalized = String(value || "").trim();
    if (!normalized) return null;
    return PUBLIC_CATEGORIES.find((item) => item.values?.[type] === normalized) || null;
  }

  function publicLabel(value, type = "") {
    const normalized = String(value || "").trim();
    if (!normalized) return "";
    if (type) return categoryForValue(type, normalized)?.label || normalized;
    return PUBLIC_CATEGORIES.find((item) => Object.values(item.values || {}).includes(normalized))?.label || normalized;
  }

  function staticSearchRecords() {
    return PUBLIC_CATEGORIES.map((item) => ({
      type: "Категория",
      title: item.searchLabel || item.label,
      desc: item.description,
      url: item.route
    }));
  }

  function listingSubcategories(category) {
    return category === "Услуги" ? [...SERVICE_SUBCATEGORIES] : [];
  }

  function isValidListingSubcategory(category, subcategory) {
    const cat = String(category || "").trim();
    const sub = String(subcategory || "").trim();
    if (cat === "Услуги") return SERVICE_SUBCATEGORIES.includes(sub);
    return sub === "";
  }

  function replaceOptions(select, items, placeholder) {
    if (!select) return;
    const current = select.value;
    select.replaceChildren();
    const first = document.createElement("option");
    first.value = "";
    first.textContent = placeholder;
    select.appendChild(first);
    items.forEach(({ value, label }) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      select.appendChild(option);
    });
    if (Array.from(select.options).some((option) => option.value === current)) select.value = current;
  }

  function populateCategorySelect(select) {
    const source = select?.dataset.popitaiCategorySource;
    if (!select || !source) return;

    if (source === "listing") {
      replaceOptions(select, LISTING_CATEGORIES.map((value) => ({ value, label: value })), "Избери категория");
      return;
    }

    const categories = source === "business"
      ? BUSINESS_CATEGORY_IDS.map((id) => byId.get(id)).filter(Boolean)
      : PUBLIC_CATEGORIES;

    replaceOptions(
      select,
      categories.map((item) => ({ value: item.values?.[source], label: item.label })).filter((item) => item.value),
      source === "business" ? "Избери" : "Избери категория"
    );
  }

  function populateServiceSubcategorySelect(select) {
    if (!select) return;
    select.replaceChildren();
    const first = document.createElement("option");
    first.value = "";
    first.textContent = "Избери подкатегория";
    select.appendChild(first);

    SERVICE_GROUPS.forEach((group) => {
      const optgroup = document.createElement("optgroup");
      optgroup.label = group.label;
      group.values.forEach((value) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        optgroup.appendChild(option);
      });
      select.appendChild(optgroup);
    });
  }

  function syncPublicCategoryLabels() {
    document.querySelectorAll(".question-category").forEach((element) => {
      const current = String(element.textContent || "").trim();
      const label = publicLabel(current);
      if (label && label !== current) element.textContent = label;
    });

    ["#business-detail-category-tag", "#business-detail-category"].forEach((selector) => {
      const element = document.querySelector(selector);
      if (!element) return;
      const current = String(element.textContent || "").trim();
      const label = publicLabel(current, "business");
      if (label && label !== current) element.textContent = label;
    });

    const filter = document.querySelector("#businesses-category-filter");
    if (filter) {
      Array.from(filter.options).forEach((option) => {
        if (!option.value) return;
        const label = publicLabel(option.value, "business");
        if (label && option.textContent !== label) option.textContent = label;
      });
    }
  }

  function observePublicCategoryLabels() {
    const targets = [
      document.querySelector("#businesses-list"),
      document.querySelector("#home-businesses"),
      document.querySelector("#business-detail-category-tag"),
      document.querySelector("#business-detail-category"),
      document.querySelector("#businesses-category-filter")
    ].filter(Boolean);

    syncPublicCategoryLabels();
    if (!targets.length) return;

    let queued = false;
    const scheduleSync = () => {
      if (queued) return;
      queued = true;
      queueMicrotask(() => {
        queued = false;
        syncPublicCategoryLabels();
      });
    };

    const observer = new MutationObserver(scheduleSync);
    targets.forEach((target) => observer.observe(target, { childList: true, subtree: true }));
  }

  function setupListingSubcategoryField() {
    const category = document.querySelector("#listing-category");
    const subcategory = document.querySelector("#listing-subcategory");
    const field = document.querySelector("#listing-subcategory-field");
    if (!category || !subcategory || !field) return;

    populateServiceSubcategorySelect(subcategory);
    const editId = new URLSearchParams(window.location.search).get("edit");

    function sync({ userChanged = false } = {}) {
      const services = category.value === "Услуги";
      field.hidden = !services;
      subcategory.disabled = !services;
      subcategory.required = services;

      if (!services) {
        subcategory.value = "";
        delete subcategory.dataset.legacyBlankAllowed;
      } else if (userChanged) {
        delete subcategory.dataset.legacyBlankAllowed;
      }
    }

    category.addEventListener("change", () => sync({ userChanged: true }));
    subcategory.addEventListener("change", () => { delete subcategory.dataset.legacyBlankAllowed; });
    sync();

    if (!editId) return;
    const submit = document.querySelector("#listing-submit");
    if (!submit) return;

    const editIsLoaded = () => {
      const label = String(submit.textContent || "").trim();
      return !submit.disabled && (label === "Изпрати редакцията" || label === "Запази и публикувай");
    };

    const captureLoadedEdit = () => {
      sync();
      if (category.value === "Услуги" && !subcategory.value) {
        subcategory.dataset.legacyBlankAllowed = "true";
        subcategory.required = false;
      }
    };

    const observer = new MutationObserver(() => {
      if (!editIsLoaded()) return;
      captureLoadedEdit();
      observer.disconnect();
    });
    observer.observe(submit, { attributes: true, childList: true, characterData: true, subtree: true, attributeFilter: ["disabled"] });

    window.setTimeout(() => {
      if (!editIsLoaded()) return;
      captureLoadedEdit();
      observer.disconnect();
    }, 0);
  }

  function initDomBindings() {
    document.querySelectorAll("select[data-popitai-category-source]").forEach(populateCategorySelect);
    setupListingSubcategoryField();
    observePublicCategoryLabels();
  }

  const api = Object.freeze({
    publicCategories: PUBLIC_CATEGORIES,
    listingCategories: LISTING_CATEGORIES,
    serviceSubcategories: SERVICE_SUBCATEGORIES,
    serviceGroups: SERVICE_GROUPS,
    categoryForValue,
    publicLabel,
    staticSearchRecords,
    listingSubcategories,
    isValidListingSubcategory
  });

  window.PopitaiCategoryDictionary = api;

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initDomBindings, { once: true });
  else initDomBindings();
})();