(() => {
  "use strict";

  const listingRoots = Array.from(document.querySelectorAll("[data-category-listings]"));
  const mobilePriorityGrids = Array.from(document.querySelectorAll(".subcategory-grid[data-mobile-priority]"));
  if (!listingRoots.length && !mobilePriorityGrids.length) return;

  const ADMIN_ID = "598d6626-25ed-450f-87a9-e83f34f641c4";
  const pageParams = new URLSearchParams(window.location.search);
  const pageFile = (window.location.pathname.split("/").pop() || "").toLowerCase();
  const marketplaceTheme = ["maistori.html", "avtomobili.html", "rabota.html"].includes(pageFile);
  const AUTO_VEHICLE_LABEL = "Автомобили за продажба или търсене";

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));

  function formatPrice(item) {
    if (item.price_free) return "Подарява";
    if (item.price_negotiable) return "Договаряне";
    if (item.price == null) return "";
    const eur = Number(item.price).toLocaleString("bg-BG") + " евро";
    const bgn = (Number(item.price) * 1.95583).toFixed(2).replace(".", ",") + " лв.";
    return `${eur} / ${bgn}`;
  }

  function formatDate(value) {
    if (!value) return "";
    try {
      return new Intl.DateTimeFormat("bg-BG", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
    } catch (_) {
      return "";
    }
  }

  async function waitForClient() {
    if (window.PopitaiSupabase) return window.PopitaiSupabase;
    return new Promise((resolve, reject) => {
      let tries = 0;
      const timer = setInterval(() => {
        tries += 1;
        if (window.PopitaiSupabase) {
          clearInterval(timer);
          resolve(window.PopitaiSupabase);
        } else if (tries > 120) {
          clearInterval(timer);
          reject(new Error("Supabase client timeout"));
        }
      }, 50);
    });
  }

  function serviceGroupValues(label) {
    const dictionary = window.PopitaiCategoryDictionary;
    if (!dictionary || !label) return [];
    const group = (dictionary.serviceGroups || []).find((item) => item.label === label);
    return group ? [...group.values] : [];
  }

  function publicListingType(item) {
    if (item.category === "Услуги") return item.listing_type === "Търси" ? "Търси услуга" : "Предлага услуга";
    return item.listing_type || "Обява";
  }

  function publicCategory(item) {
    if (item.category === "Услуги" && item.subcategory) return item.subcategory;
    return item.subcategory ? `${item.category} › ${item.subcategory}` : item.category;
  }

  function listingCard(item) {
    const price = formatPrice(item);
    const badges = [
      item.is_urgent ? '<span class="category-listing-badge category-listing-badge--urgent">Спешно</span>' : "",
      item.is_highlighted ? '<span class="category-listing-badge">Препоръчано</span>' : ""
    ].filter(Boolean).join("");

    return `<article class="category-listing-card${item.is_highlighted ? " category-listing-card--highlighted" : ""}">
      <div class="category-listing-topline">
        <span class="category-listing-type">${esc(publicListingType(item))}</span>
        ${badges}
      </div>
      <h3><a href="obqva.html?id=${encodeURIComponent(item.id)}">${esc(item.title)}</a></h3>
      <p class="category-listing-category">${esc(publicCategory(item))}</p>
      ${price ? `<p class="category-listing-price">${esc(price)}</p>` : ""}
      <div class="category-listing-meta">
        ${item.city ? `<span>📍 ${esc(item.city)}</span>` : ""}
        ${item.created_at ? `<span>${esc(formatDate(item.created_at))}</span>` : ""}
      </div>
    </article>`;
  }

  function emptyState(root) {
    const message = root.dataset.emptyMessage || "Все още няма активни обяви тук.";
    const href = root.dataset.emptyHref || "obyavi.html";
    const label = root.dataset.emptyLabel || "Разгледай всички обяви";
    root.innerHTML = `<article class="empty-card category-listings-state">
      <h3>Няма активни обяви</h3>
      <p>${esc(message)}</p>
      <a class="primary-link-button" href="${esc(href)}">${esc(label)}</a>
    </article>`;
  }

  function errorState(root) {
    root.innerHTML = `<article class="empty-card category-listings-state">
      <h3>Обявите не могат да се заредят</h3>
      <p>Опитай отново. Останалото съдържание на страницата е достъпно.</p>
      <button class="secondary-link-button" type="button" data-category-listings-retry>Опитай отново</button>
    </article>`;
  }

  function marketplaceFilters(root, groupValues) {
    if (!marketplaceTheme) return { q: "", subcategory: "", intent: "", filtered: false, validSubcategory: true };
    const q = String(pageParams.get("q") || "").trim().slice(0, 120);
    const requestedSubcategory = String(pageParams.get("subcategory") || "").trim();
    const intent = ["offer", "seek"].includes(pageParams.get("intent")) ? pageParams.get("intent") : "";
    let subcategory = "";
    let validSubcategory = true;

    if (root.dataset.serviceGroup && requestedSubcategory) {
      if (groupValues.includes(requestedSubcategory)) subcategory = requestedSubcategory;
      else if (requestedSubcategory === AUTO_VEHICLE_LABEL && pageFile === "avtomobili.html") validSubcategory = false;
      else validSubcategory = false;
    }

    if (root.dataset.listingCategory && requestedSubcategory && pageFile === "avtomobili.html") {
      validSubcategory = requestedSubcategory === AUTO_VEHICLE_LABEL;
    }

    return { q, subcategory, intent, filtered: Boolean(q || requestedSubcategory || intent), validSubcategory };
  }

  async function loadRoot(client, root) {
    const serviceGroup = String(root.dataset.serviceGroup || "").trim();
    const listingCategory = String(root.dataset.listingCategory || "").trim();
    const groupValues = serviceGroupValues(serviceGroup);
    const filters = marketplaceFilters(root, groupValues);
    const requestedLimit = Number(root.dataset.limit || 4);
    const limit = marketplaceTheme ? (filters.filtered ? 24 : 12) : Math.max(1, Math.min(6, requestedLimit));

    if (serviceGroup && !groupValues.length) {
      errorState(root);
      return;
    }
    if (!serviceGroup && !listingCategory) return;
    if (!filters.validSubcategory) {
      root.innerHTML = "";
      emptyState(root);
      return;
    }

    root.innerHTML = '<article class="empty-card category-listings-state"><p>Зареждане на обявите…</p></article>';

    let query = client.from("listings")
      .select("id,owner_id,title,category,subcategory,listing_type,price,price_negotiable,price_free,city,is_urgent,is_highlighted,is_boosted,is_owner_admin,created_at,expires_at")
      .eq("status", "approved")
      .or("expires_at.is.null,expires_at.gt." + new Date().toISOString());

    if (serviceGroup) {
      query = query.eq("category", "Услуги").in("subcategory", groupValues);
      if (filters.subcategory) query = query.eq("subcategory", filters.subcategory);
      if (filters.intent === "seek") query = query.eq("listing_type", "Търси");
      if (filters.intent === "offer") query = query.neq("listing_type", "Търси");
    } else {
      query = query.eq("category", listingCategory);
      if (filters.intent === "seek") query = query.in("listing_type", ["Купува", "Търси"]);
      if (filters.intent === "offer") query = query.in("listing_type", ["Продава", "Дава"]);
    }

    if (filters.q) query = query.ilike("title", `%${filters.q}%`);

    const { data, error } = await query
      .order("is_owner_admin", { ascending: false })
      .order("is_boosted", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      errorState(root);
      return;
    }

    const items = data || [];
    items.sort((a, b) => {
      if (a.owner_id === ADMIN_ID && b.owner_id !== ADMIN_ID) return -1;
      if (b.owner_id === ADMIN_ID && a.owner_id !== ADMIN_ID) return 1;
      if (a.is_boosted && !b.is_boosted) return -1;
      if (b.is_boosted && !a.is_boosted) return 1;
      return new Date(b.created_at) - new Date(a.created_at);
    });

    root.innerHTML = items.length ? items.map(listingCard).join("") : "";
    if (!items.length) emptyState(root);
  }

  function setupRetry(root) {
    root.addEventListener("click", async (event) => {
      const retry = event.target.closest("[data-category-listings-retry]");
      if (!retry) return;
      try {
        const client = await waitForClient();
        await loadRoot(client, root);
      } catch (_) {
        errorState(root);
      }
    });
  }

  function setupMobilePriorityGrid(grid, index) {
    const units = Array.from(grid.children).filter((element) => element.matches(".subcategory-card, .contextual-subcategory-item"));
    const priority = String(grid.dataset.mobilePriority || "")
      .split("|")
      .map((value) => value.trim())
      .filter(Boolean);
    if (!units.length || !priority.length) return;

    if (!grid.id) grid.id = `category-subcategories-${index + 1}`;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-mobile-expand secondary-link-button";
    button.textContent = "Всички услуги";
    button.setAttribute("aria-controls", grid.id);
    button.setAttribute("aria-expanded", "false");
    button.hidden = true;
    grid.insertAdjacentElement("afterend", button);

    const media = window.matchMedia("(max-width: 720px)");
    let expanded = false;

    function unitCard(unit) {
      if (unit.matches(".subcategory-card")) return unit;
      return unit.querySelector(":scope > .subcategory-card");
    }

    function unitLabel(unit) {
      return String(unitCard(unit)?.querySelector("strong")?.textContent || "").trim();
    }

    function sync() {
      if (!media.matches) {
        units.forEach((unit) => { unit.hidden = false; unit.style.order = ""; });
        button.hidden = true;
        return;
      }
      units.forEach((unit, unitIndex) => {
        const label = unitLabel(unit);
        const priorityIndex = priority.indexOf(label);
        unit.style.order = String(priorityIndex >= 0 ? priorityIndex : 100 + unitIndex);
        unit.hidden = !expanded && priorityIndex < 0;
      });
      button.hidden = false;
      button.setAttribute("aria-expanded", String(expanded));
      button.textContent = expanded ? "Покажи по-малко" : "Всички услуги";
    }

    button.addEventListener("click", () => { expanded = !expanded; sync(); });
    if (media.addEventListener) media.addEventListener("change", sync);
    else media.addListener(sync);
    sync();
  }

  mobilePriorityGrids.forEach(setupMobilePriorityGrid);
  listingRoots.forEach(setupRetry);

  if (!listingRoots.length) return;
  (async () => {
    try {
      const client = await waitForClient();
      await Promise.all(listingRoots.map((root) => loadRoot(client, root)));
    } catch (error) {
      console.error("Category listings load error:", error);
      listingRoots.forEach(errorState);
    }
  })();
})();