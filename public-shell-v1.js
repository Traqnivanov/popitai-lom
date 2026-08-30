(() => {
  "use strict";

  const file = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const marketplaceFiles = new Set(["obyavi.html", "obqva.html", "dobavi-obqva.html", "maistori.html", "avtomobili.html", "rabota.html", "kategorii.html"]);
  const firmFiles = new Set(["firmi.html", "firma.html", "dobavi-firma.html", "razshiren-profil.html"]);
  const infoFiles = new Set(["info.html", "zdrave.html", "transport.html", "institucii.html", "komunalni.html", "obrazovanie-kultura.html", "banki.html"]);
  const articleFiles = new Set(["statii.html", "statia.html"]);
  const moreFiles = new Set(["vaprosi.html", "vapros.html", "nov-vapros.html", "sabitiya.html", "za-nas.html", "pravila.html", "kontakti.html"]);

  const icon = {
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-8 9 8v10h-6v-6H9v6H3V11Z"/></svg>',
    listings: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10a2 2 0 0 1 2 2v14H5V6a2 2 0 0 1 2-2Z"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>',
    add: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    info: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></svg>',
    profile: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>'
  };

  function activeClass(active) {
    return active ? ' class="active" aria-current="page"' : "";
  }

  function ensureV3Styles() {
    if (document.querySelector('link[data-marketplace-v3="styles"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "marketplace-v3.css?v=20260830-v3";
    link.dataset.marketplaceV3 = "styles";
    document.head.appendChild(link);
  }

  function loadMarketplaceV3() {
    if (!["obyavi.html", "kategorii.html", "maistori.html", "avtomobili.html", "rabota.html", "dobavi-obqva.html"].includes(file)) return;
    if (document.querySelector('script[data-marketplace-v3="app"]')) return;
    const script = document.createElement("script");
    script.src = "marketplace-v3.js?v=20260830-v3";
    script.dataset.marketplaceV3 = "app";
    document.head.appendChild(script);
  }

  function patchPrimaryNavigation() {
    const primary = document.querySelector(".main-nav-primary");
    if (!primary) return;
    const activeHome = file === "index.html" || file === "";
    const activeMarketplace = marketplaceFiles.has(file);
    const activeFirms = firmFiles.has(file);
    const activeInfo = infoFiles.has(file);
    const activeArticles = articleFiles.has(file);
    const activeProfile = file === "profil.html";
    const activeMore = moreFiles.has(file);

    primary.innerHTML = `<a${activeClass(activeHome)} href="index.html">Начало</a>
      <a${activeClass(activeMarketplace)} href="obyavi.html">Обяви и услуги</a>
      <a${activeClass(activeFirms)} href="firmi.html">Фирми</a>
      <a${activeClass(activeInfo)} href="info.html">Инфо Лом</a>
      <a${activeClass(activeArticles)} href="statii.html">Статии</a>
      <details class="public-more${activeMore ? " active" : ""}">
        <summary${activeMore ? ' aria-current="page"' : ""}>Още</summary>
        <div class="public-more-menu">
          <a href="vaprosi.html">Въпроси</a>
          <a href="sabitiya.html">Събития</a>
          <a href="za-nas.html">За сайта</a>
          <a href="pravila.html">Правила</a>
          <a href="kontakti.html">Контакти</a>
        </div>
      </details>
      <a${activeClass(activeProfile)} href="profil.html">Профил</a>`;

    const oldExtra = document.querySelector(".main-nav-extra");
    if (oldExtra) oldExtra.hidden = true;
  }

  function patchMobileNavigation() {
    const nav = document.querySelector(".mobile-bottom-nav");
    if (!nav) return;
    const marketActive = marketplaceFiles.has(file);
    const infoActive = infoFiles.has(file);
    nav.innerHTML = `<a${activeClass(file === "index.html" || file === "")} href="index.html">${icon.home}<span>Начало</span></a>
      <a${activeClass(marketActive)} href="obyavi.html">${icon.listings}<span>Обяви</span></a>
      <button class="mobile-add public-add-trigger" type="button" aria-label="Добави" aria-haspopup="dialog" aria-expanded="false" aria-controls="public-add-sheet">${icon.add}<span>Добави</span></button>
      <a${activeClass(infoActive)} href="info.html">${icon.info}<span>Инфо</span></a>
      <a${activeClass(file === "profil.html")} href="profil.html">${icon.profile}<span>Профил</span></a>`;
  }

  function patchAddSheetOrder() {
    const options = document.querySelector("#public-add-sheet .public-add-options");
    if (!options) return;
    const nodes = Array.from(options.children);
    const listing = nodes.find((node) => node.getAttribute("href")?.includes("dobavi-obqva.html"));
    const business = nodes.find((node) => node.getAttribute("href")?.includes("dobavi-firma.html"));
    const question = nodes.find((node) => node.getAttribute("href")?.includes("nov-vapros.html"));
    [listing, business, question].forEach((node) => { if (node) options.appendChild(node); });
    nodes.filter((node) => ![listing, business, question].includes(node)).forEach((node) => options.appendChild(node));
  }

  function patchFooter() {
    document.querySelectorAll('.site-footer a[href="kategorii.html"]').forEach((link) => {
      link.href = "obyavi.html";
      link.textContent = "Обяви и услуги";
    });
  }

  function patchShell() {
    ensureV3Styles();
    patchPrimaryNavigation();
    patchMobileNavigation();
    patchAddSheetOrder();
    patchFooter();
    loadMarketplaceV3();
  }

  patchShell();

  const sheet = document.getElementById("public-add-sheet");
  if (!sheet) return;
  const triggers = Array.from(document.querySelectorAll(".public-add-trigger"));
  const closeButton = sheet.querySelector(".public-add-close");
  const menu = document.getElementById("main-nav");
  const menuButton = document.getElementById("menu-button");
  let returnFocus = null;

  const focusable = () => Array.from(sheet.querySelectorAll('a[href],button:not([disabled]):not([hidden])')).filter((el) => !el.hidden && el.offsetParent !== null);
  function closeMenu() {
    if (!menu || !menuButton) return;
    menu.classList.remove("open");
    menuButton.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }
  function setTriggerExpanded(value) { triggers.forEach((el) => el.setAttribute("aria-expanded", String(value))); }
  function openSheet(trigger) {
    closeMenu();
    returnFocus = trigger || document.activeElement;
    sheet.hidden = false;
    document.body.classList.add("public-add-open");
    setTriggerExpanded(true);
    requestAnimationFrame(() => (focusable()[0] || closeButton)?.focus());
  }
  function closeSheet() {
    if (sheet.hidden) return;
    sheet.hidden = true;
    document.body.classList.remove("public-add-open");
    setTriggerExpanded(false);
    const target = returnFocus;
    returnFocus = null;
    target?.focus?.();
  }
  triggers.forEach((trigger) => trigger.addEventListener("click", () => openSheet(trigger)));
  closeButton?.addEventListener("click", closeSheet);
  sheet.addEventListener("click", (event) => { if (event.target === sheet) closeSheet(); });
  sheet.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { event.preventDefault(); closeSheet(); return; }
    if (event.key !== "Tab") return;
    const items = focusable();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  menu?.querySelectorAll("a[href]").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu?.classList.contains("open")) { closeMenu(); menuButton?.focus(); }
    if (event.key === "Escape") document.querySelector(".public-more[open]")?.removeAttribute("open");
  }, { capture: true });
  document.addEventListener("click", (event) => {
    const more = document.querySelector(".public-more[open]");
    if (more && !more.contains(event.target)) more.removeAttribute("open");
  });

  const shopAction = sheet.querySelector('[data-public-special-action="shop"]');
  const shopOwner = document.getElementById("addBtn");
  if (shopAction && shopOwner) {
    const sync = () => { shopAction.hidden = shopOwner.hidden; };
    sync();
    new MutationObserver(sync).observe(shopOwner, { attributes: true, attributeFilter: ["hidden"] });
    shopAction.addEventListener("click", () => { closeSheet(); if (!shopOwner.hidden) shopOwner.click(); });
  }
  const healthAction = sheet.querySelector('[data-public-special-action="health"]');
  const healthOwner = document.querySelector(".health-hero-add");
  healthAction?.addEventListener("click", () => { closeSheet(); healthOwner?.click(); });
})();