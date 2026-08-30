(() => {
  "use strict";

  const MIN_QUERY_LENGTH = 2;
  const REMOTE_LIMIT = 20;
  const SUGGESTION_LIMIT = 6;
  const DEBOUNCE_MS = 250;

  const GROUP_LABELS = Object.freeze({
    "Категория": "Категории",
    "Фирма": "Фирми",
    "Обява": "Обяви",
    "Въпрос": "Въпроси",
    "Статия": "Статии",
    "Проверена информация": "Проверена информация"
  });

  const GROUP_ORDER = Object.freeze([
    "Категория", "Фирма", "Обява", "Въпрос", "Статия", "Проверена информация"
  ]);

  const ARTICLE_RECORDS = Object.freeze([
    Object.freeze({
      id: "article:choose-contractor",
      type: "Статия",
      title: "Как да избереш майстор и да избегнеш неприятни изненади",
      desc: "Практични проверки и ясни условия преди ремонт.",
      url: "statia.html"
    })
  ]);

  const VERIFIED_INFO_RECORDS = Object.freeze([
    Object.freeze({
      id: "info:home",
      type: "Проверена информация",
      title: "Инфо Лом",
      desc: "Проверени контакти и полезна градска информация за Лом.",
      url: "info.html"
    }),
    Object.freeze({
      id: "info:health",
      type: "Проверена информация",
      title: "Здраве — проверена информация",
      desc: "Болница, лекари, зъболекари, стоматолози, аптеки, спешна и здравна информация.",
      url: "zdrave.html"
    }),
    Object.freeze({
      id: "info:institutions",
      type: "Проверена информация",
      title: "Институции — проверена информация",
      desc: "Община, полиция, административни услуги и официални контакти.",
      url: "institucii.html"
    }),
    Object.freeze({
      id: "info:transport",
      type: "Проверена информация",
      title: "Транспорт — проверена информация",
      desc: "Автогара, автобуси, БДЖ, ЖП гара и таксита в Лом.",
      url: "transport.html"
    }),
    Object.freeze({
      id: "info:education",
      type: "Проверена информация",
      title: "Образование и култура — проверена информация",
      desc: "Училища, образование, културни места и полезни контакти.",
      url: "obrazovanie-kultura.html"
    }),
    Object.freeze({
      id: "info:banks",
      type: "Проверена информация",
      title: "Банки и банкомати — проверена информация",
      desc: "Банки, банкомати, ATM и банкови услуги в Лом.",
      url: "banki.html"
    }),
    Object.freeze({
      id: "info:utilities",
      type: "Проверена информация",
      title: "Комунални услуги — проверена информация",
      desc: "Вода, ток, чистота, интернет, куриери и аварийни контакти.",
      url: "komunalni.html"
    })
  ]);

  function normalizeSearchText(value) {
    return String(value || "")
      .toLocaleLowerCase("bg")
      .replace(/[–—_-]+/g, " ")
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[character]));
  }

  function truncate(value, max = 220) {
    const text = String(value || "").replace(/\s+/g, " ").trim();
    return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
  }

  function recordMatches(query, record) {
    const tokens = normalizeSearchText(query).split(" ").filter(Boolean);
    if (!tokens.length) return true;
    const haystack = normalizeSearchText(`${record.title || ""} ${record.desc || ""} ${record.type || ""}`);
    return tokens.every((token) => haystack.includes(token));
  }

  function protectedPriorityRecord(query) {
    if (typeof window.rankSearchRecords !== "function") return null;
    try {
      const ranked = window.rankSearchRecords(query, []);
      return Array.isArray(ranked)
        ? ranked.find((item) => item?.id === "ivanov-remonti") || null
        : null;
    } catch (_) {
      return null;
    }
  }

  function canonicalIvanovRecord() {
    return protectedPriorityRecord("ремонт");
  }

  function rankRecords(query, records) {
    const matches = records.filter((record) => recordMatches(query, record));
    const protectedRecord = protectedPriorityRecord(query);
    if (!protectedRecord) return matches;
    return [
      protectedRecord,
      ...matches.filter((record) => record.id !== protectedRecord.id && record.url !== protectedRecord.url)
    ];
  }

  function dedupeRecords(records) {
    const seen = new Set();
    const result = [];
    records.forEach((record) => {
      if (!record?.url || !record?.title) return;
      const key = `${record.type || ""}|${record.url}`;
      if (seen.has(key)) return;
      seen.add(key);
      result.push(record);
    });
    return result;
  }

  function categoryRecords() {
    const dictionary = window.PopitaiCategoryDictionary;
    if (!dictionary) return [];

    const records = (dictionary.staticSearchRecords?.() || []).map((record, index) => ({
      ...record,
      id: `category:${dictionary.publicCategories?.[index]?.id || index}`
    }));

    const targetIds = ["maistori", "avtomobili", "rabota"];
    (dictionary.listingCategories || []).forEach((value) => {
      records.push({
        id: `listing-category:${value}`,
        type: "Категория",
        title: value,
        desc: "Категория в „Всички обяви“.",
        url: "obyavi.html"
      });
    });

    (dictionary.serviceGroups || []).forEach((group, index) => {
      const target = (dictionary.publicCategories || []).find((item) => item.id === targetIds[index]);
      if (!target) return;
      (group.values || []).forEach((value) => {
        records.push({
          id: `subcategory:${value}`,
          type: "Категория",
          title: value,
          desc: `Подкатегория в „${target.label}“.`,
          url: target.route
        });
      });
    });

    return records;
  }

  function staticRecords() {
    return dedupeRecords([
      canonicalIvanovRecord(),
      ...categoryRecords(),
      ...ARTICLE_RECORDS,
      ...VERIFIED_INFO_RECORDS
    ].filter(Boolean));
  }

  function publicCategoryLabel(value, type) {
    return window.PopitaiCategoryDictionary?.publicLabel?.(value, type) || String(value || "");
  }

  function businessRecord(item) {
    const category = publicCategoryLabel(item.category, "business");
    return {
      id: `business:${item.id}`,
      type: "Фирма",
      title: item.name,
      desc: truncate([category, item.city, item.description].filter(Boolean).join(" · ")),
      url: `firma.html?id=${encodeURIComponent(item.id)}`
    };
  }

  function questionRecord(item) {
    const category = publicCategoryLabel(item.category, "question");
    return {
      id: `question:${item.id}`,
      type: "Въпрос",
      title: item.title,
      desc: truncate([category, item.description].filter(Boolean).join(" · ")),
      url: `vapros.html?id=${encodeURIComponent(item.id)}`
    };
  }

  function listingRecord(item) {
    const taxonomy = item.subcategory
      ? `${item.category} › ${item.subcategory}`
      : item.category;
    return {
      id: `listing:${item.id}`,
      type: "Обява",
      title: item.title,
      desc: truncate([item.listing_type, taxonomy, item.city, item.description].filter(Boolean).join(" · ")),
      url: `obqva.html?id=${encodeURIComponent(item.id)}`
    };
  }

  function longestToken(query) {
    return normalizeSearchText(query)
      .split(" ")
      .filter((token) => token.length >= MIN_QUERY_LENGTH)
      .sort((a, b) => b.length - a.length)[0] || "";
  }

  function withAbort(builder, signal) {
    return signal && typeof builder.abortSignal === "function"
      ? builder.abortSignal(signal)
      : builder;
  }

  async function fetchRemoteRecords(query, signal) {
    const client = window.PopitaiSupabase;
    const token = longestToken(query);
    if (!client || !token) return { records: [], partialError: !client };

    const pattern = `%${token}%`;
    const now = new Date().toISOString();

    const businessQuery = withAbort(
      client.from("businesses")
        .select("id,name,category,description,city,created_at")
        .eq("status", "approved")
        .or(`name.ilike.${pattern},description.ilike.${pattern},category.ilike.${pattern},city.ilike.${pattern}`)
        .order("created_at", { ascending: false })
        .limit(REMOTE_LIMIT),
      signal
    );

    const questionQuery = withAbort(
      client.from("questions")
        .select("id,title,category,description,created_at")
        .eq("status", "approved")
        .or(`title.ilike.${pattern},description.ilike.${pattern},category.ilike.${pattern}`)
        .order("created_at", { ascending: false })
        .limit(REMOTE_LIMIT),
      signal
    );

    const listingQuery = withAbort(
      client.from("listings")
        .select("id,title,category,subcategory,listing_type,description,city,created_at")
        .eq("status", "approved")
        .or(`expires_at.is.null,expires_at.gt.${now}`)
        .or(`title.ilike.${pattern},description.ilike.${pattern},category.ilike.${pattern},subcategory.ilike.${pattern},listing_type.ilike.${pattern},city.ilike.${pattern}`)
        .order("created_at", { ascending: false })
        .limit(REMOTE_LIMIT),
      signal
    );

    const settled = await Promise.allSettled([businessQuery, questionQuery, listingQuery]);
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    const records = [];
    let partialError = false;

    settled.forEach((result, index) => {
      if (result.status !== "fulfilled" || result.value?.error) {
        partialError = true;
        return;
      }
      const data = result.value?.data || [];
      if (index === 0) records.push(...data.map(businessRecord));
      if (index === 1) records.push(...data.map(questionRecord));
      if (index === 2) records.push(...data.map(listingRecord));
    });

    return { records: dedupeRecords(records), partialError };
  }

  async function searchRecords(query, signal) {
    const staticItems = staticRecords();
    if (normalizeSearchText(query).length < MIN_QUERY_LENGTH) {
      return { records: [], partialError: false };
    }
    const remote = await fetchRemoteRecords(query, signal);
    const combined = dedupeRecords([...staticItems, ...remote.records]);
    return { records: rankRecords(query, combined), partialError: remote.partialError };
  }

  function ensureStyles() {
    if (document.querySelector("#public-search-stage2-style")) return;
    const style = document.createElement("style");
    style.id = "public-search-stage2-style";
    style.textContent = `
      .search-result-group{display:grid;gap:12px;margin:24px 0 0}
      .search-result-group:first-child{margin-top:0}
      .search-result-group-title{margin:0;font-size:1.05rem;color:#334155}
      .search-result-card h3{margin:7px 0 8px;font-size:1.1rem}
      .search-result-card h3 a{color:inherit}
      .search-status-card{padding:16px 18px;border:1px solid #dfe6ef;border-radius:14px;background:#f8fafc;color:#475569}
      .search-status-card.is-error{border-color:#f1c7c7;background:#fff7f7;color:#8a2d2d}
      .suggestion-status{padding:12px 14px;color:#64748b;font-size:.9rem}
    `;
    document.head.appendChild(style);
  }

  function groupOrder(query) {
    return protectedPriorityRecord(query)
      ? ["Фирма", "Категория", "Обява", "Въпрос", "Статия", "Проверена информация"]
      : GROUP_ORDER;
  }

  function renderGroupedResults(container, query, records, partialError) {
    if (!container) return;

    if (!records.length) {
      container.innerHTML = `
        <article class="empty-card">
          <h2>Няма намерени резултати</h2>
          <p>Опитай с по-кратка или различна дума.</p>
        </article>`;
      return;
    }

    const groups = new Map();
    records.forEach((record) => {
      if (!groups.has(record.type)) groups.set(record.type, []);
      groups.get(record.type).push(record);
    });

    const warning = partialError
      ? `<article class="search-status-card is-error"><strong>Част от публичните резултати временно не могат да се заредят.</strong> Показваме наличните проверени резултати.</article>`
      : "";

    const sections = groupOrder(query)
      .filter((type) => groups.get(type)?.length)
      .map((type) => {
        const groupId = `search-group-${GROUP_ORDER.indexOf(type) >= 0 ? GROUP_ORDER.indexOf(type) : 99}`;
        return `
        <section class="search-result-group" aria-labelledby="${groupId}">
          <h2 class="search-result-group-title" id="${groupId}">${escapeHtml(GROUP_LABELS[type] || type)}</h2>
          ${groups.get(type).map((item) => `
            <article class="search-result-card">
              <span>${escapeHtml(item.type)}</span>
              <h3><a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a></h3>
              <p>${escapeHtml(item.desc || "")}</p>
            </article>`).join("")}
        </section>`;
      }).join("");

    container.innerHTML = warning + sections;
  }

  function renderSuggestionState(container, message, isError = false) {
    if (!container) return;
    container.innerHTML = `<div class="suggestion-status${isError ? " is-error" : ""}">${escapeHtml(message)}</div>`;
    container.hidden = false;
  }

  function renderSuggestions(container, records) {
    if (!container) return;
    const visible = records.slice(0, SUGGESTION_LIMIT);
    container.innerHTML = visible.map((item) => `
      <button class="suggestion-item ${item.promoted ? "promoted-suggestion" : ""}" type="button" data-url="${escapeHtml(item.url)}">
        <span>
          <strong>${escapeHtml(item.title)}</strong>
          <small>${escapeHtml(item.type)}</small>
        </span>
      </button>`).join("");
    container.hidden = visible.length === 0;
  }

  function initHomeSearch() {
    const form = document.querySelector("#search-form");
    const input = document.querySelector("#main-search");
    const clear = document.querySelector("#clear-search");
    const suggestions = document.querySelector("#search-suggestions");
    if (!form || !input || !suggestions) return;

    let timer = null;
    let controller = null;
    let requestId = 0;

    const hideSuggestions = () => {
      suggestions.hidden = true;
      suggestions.innerHTML = "";
    };

    input.addEventListener("input", () => {
      if (clear) clear.classList.toggle("visible", input.value.trim().length > 0);
      clearTimeout(timer);
      controller?.abort();

      const query = input.value.trim();
      if (normalizeSearchText(query).length < MIN_QUERY_LENGTH) {
        hideSuggestions();
        return;
      }

      const currentRequest = ++requestId;
      timer = window.setTimeout(async () => {
        controller = new AbortController();
        renderSuggestionState(suggestions, "Търсене…");
        try {
          const result = await searchRecords(query, controller.signal);
          if (currentRequest !== requestId || controller.signal.aborted) return;
          renderSuggestions(suggestions, result.records);
          if (!result.records.length && result.partialError) {
            renderSuggestionState(suggestions, "Търсенето временно не е достъпно.", true);
          }
        } catch (error) {
          if (error?.name === "AbortError") return;
          if (currentRequest !== requestId) return;
          renderSuggestionState(suggestions, "Търсенето временно не е достъпно.", true);
        }
      }, DEBOUNCE_MS);
    });

    clear?.addEventListener("click", () => {
      requestId += 1;
      clearTimeout(timer);
      controller?.abort();
      input.value = "";
      clear.classList.remove("visible");
      hideSuggestions();
      input.focus();
    });

    suggestions.addEventListener("click", (event) => {
      const button = event.target.closest("[data-url]");
      if (button?.dataset.url) window.location.href = button.dataset.url;
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = input.value.trim();
      if (normalizeSearchText(query).length >= MIN_QUERY_LENGTH) {
        window.location.href = `tarsene.html?q=${encodeURIComponent(query)}`;
      }
    });
  }

  function initResultsSearch() {
    const form = document.querySelector("#results-search-form");
    const input = document.querySelector("#results-search-input");
    const container = document.querySelector("#search-results");
    const count = document.querySelector("#results-count");
    if (!form || !input || !container) return;

    container.setAttribute("aria-live", "polite");
    let controller = null;
    let requestId = 0;

    async function run(query) {
      const normalized = normalizeSearchText(query);
      input.value = query;
      controller?.abort();
      const currentRequest = ++requestId;

      if (normalized.length < MIN_QUERY_LENGTH) {
        if (count) count.textContent = "Въведи поне 2 знака за търсене.";
        container.innerHTML = '<article class="empty-card"><h2>Какво търсиш?</h2><p>Напиши поне 2 знака, например „автосервиз“, „работа“ или „шпакловка“.</p></article>';
        return;
      }

      controller = new AbortController();
      if (count) count.textContent = `Търсене за „${query}“…`;
      container.innerHTML = '<article class="search-status-card"><strong>Търсене…</strong> Проверяваме публичните категории и одобреното съдържание.</article>';

      try {
        const result = await searchRecords(query, controller.signal);
        if (currentRequest !== requestId || controller.signal.aborted) return;
        if (count) count.textContent = `${result.records.length} резултата за „${query}“`;
        renderGroupedResults(container, query, result.records, result.partialError);
      } catch (error) {
        if (error?.name === "AbortError") return;
        if (currentRequest !== requestId) return;
        if (count) count.textContent = `Търсенето за „${query}“ не успя.`;
        container.innerHTML = '<article class="search-status-card is-error"><h2>Търсенето временно не е достъпно</h2><p>Опитай отново след малко или разгледай категориите.</p></article>';
      }
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = input.value.trim();
      history.replaceState(null, "", `tarsene.html?q=${encodeURIComponent(query)}`);
      run(query);
    });

    const initialQuery = new URLSearchParams(window.location.search).get("q") || "";
    run(initialQuery);
  }

  function enhanceSearchPageCopy() {
    const results = document.querySelector("#search-results");
    if (!results) return;
    const heroText = document.querySelector(".page-hero .section-container > p");
    if (heroText) {
      heroText.textContent = "Резултати от категории, фирми, обяви, въпроси, статии и проверена информация.";
    }
    const actions = document.querySelector(".search-empty-actions");
    if (actions && !actions.querySelector('[href="dobavi-obqva.html"]')) {
      const link = document.createElement("a");
      link.className = "secondary-link-button";
      link.href = "dobavi-obqva.html";
      link.textContent = "Добави обява";
      actions.insertBefore(link, actions.lastElementChild || null);
    }
  }

  function init() {
    if (window.PopitaiAuthoritativeSearchStage2Initialized) return;
    window.PopitaiAuthoritativeSearchStage2Initialized = true;
    window.PopitaiSearchStage2Guard?.restore?.();
    ensureStyles();
    enhanceSearchPageCopy();
    initHomeSearch();
    initResultsSearch();
  }

  const guard = window.PopitaiSearchStage2Guard;
  if (guard?.domReady || document.readyState === "complete") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  }
})();
