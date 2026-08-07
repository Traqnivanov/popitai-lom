// Попитай.Лом — лека основа за разширени фирмени профили
(() => {
  "use strict";

  const nameElement = document.querySelector("#business-detail-name");
  const businessId = new URLSearchParams(window.location.search).get("id");
  if (!nameElement || !businessId) return;

  const EMPTY_PROFILE_DATA = Object.freeze({
    shortIntro: "",
    website: "",
    services: [],
    serviceArea: "",
    workHours: "",
    beforeAfter: []
  });

  let initialized = false;
  let galleryObserver = null;

  function wait(milliseconds) {
    return new Promise(resolve => window.setTimeout(resolve, milliseconds));
  }

  async function waitForSupabaseClient() {
    for (let attempt = 0; attempt < 20; attempt += 1) {
      if (window.PopitaiSupabase) return window.PopitaiSupabase;
      await wait(100);
    }
    return null;
  }

  function element(tag, className = "", text = "") {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function validWebsite(value) {
    if (!value) return "";
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch (_) {
      return "";
    }
  }

  function currentPhoneHref() {
    const phone = document.querySelector("#business-detail-phone");
    const href = phone?.getAttribute("href") || "";
    return href.startsWith("tel:") ? href : "";
  }

  function addAction(container, label, href, className, options = {}) {
    if (!container || !href) return null;
    const link = element("a", className, label);
    link.href = href;
    if (options.external) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    container.append(link);
    return link;
  }

  function createSection(id, title, className = "") {
    const section = element("section", `expanded-profile-section expanded-deferred-section ${className}`.trim());
    section.id = id;
    section.hidden = true;
    section.append(element("h2", "", title));
    return section;
  }

  function renderTextList(section, values) {
    const items = (values || []).map(value => String(value || "").trim()).filter(Boolean);
    if (!section || !items.length) return;
    const list = element("ul", "expanded-profile-list");
    items.forEach(value => list.append(element("li", "", value)));
    section.append(list);
    section.hidden = false;
  }

  function syncGalleryAndCover() {
    const gallery = document.querySelector("#business-gallery");
    const galleryHeading = document.querySelector("#expanded-gallery-heading");
    const firstImage = gallery?.querySelector("img");
    const hasGallery = Boolean(firstImage?.src) && !gallery.hidden;

    if (galleryHeading) galleryHeading.hidden = !hasGallery;
    if (!hasGallery) return;

    gallery.querySelectorAll("img").forEach(image => {
      image.loading = "lazy";
      image.decoding = "async";
      image.removeAttribute("fetchpriority");
    });

    const heroContainer = document.querySelector("#business-page-hero .section-container");
    if (!heroContainer) return;

    let cover = document.querySelector("#expanded-business-cover");
    if (!cover) {
      cover = element("div", "expanded-business-cover");
      cover.id = "expanded-business-cover";
      cover.setAttribute("aria-hidden", "true");
      cover.append(document.createElement("img"));
      heroContainer.prepend(cover);
    }

    const coverImage = cover.querySelector("img");
    const source = firstImage.currentSrc || firstImage.src;
    if (coverImage && coverImage.src !== source) {
      coverImage.src = source;
      coverImage.alt = "";
      coverImage.loading = "eager";
      coverImage.decoding = "async";
      coverImage.fetchPriority = "high";
    }
  }

  function createDesktopActions(data) {
    const heroContainer = document.querySelector("#business-page-hero .section-container");
    if (!heroContainer || document.querySelector("#expanded-business-actions")) return;

    const actions = element("nav", "expanded-profile-actions");
    actions.id = "expanded-business-actions";
    actions.setAttribute("aria-label", "Действия за фирмата");

    addAction(actions, "Обади се", currentPhoneHref(), "expanded-action-primary");
    addAction(actions, "Поискай оферта", "#expanded-contact", "expanded-action-secondary");
    addAction(actions, "Сайт", validWebsite(data.website), "expanded-action-secondary", { external: true });

    if (actions.children.length) heroContainer.append(actions);
  }

  function createMobileActions() {
    if (document.querySelector("#expanded-mobile-actions")) return;

    const actions = element("nav", "expanded-mobile-actions");
    actions.id = "expanded-mobile-actions";
    actions.setAttribute("aria-label", "Бързи действия");

    addAction(actions, "Обади се", currentPhoneHref(), "expanded-mobile-call");
    addAction(actions, "Запитване", "#expanded-contact", "expanded-mobile-inquiry");

    if (!actions.children.length) return;
    const mobileNav = document.querySelector(".mobile-bottom-nav");
    (mobileNav || document.body.lastElementChild)?.insertAdjacentElement("beforebegin", actions);
  }

  function prepareContentSections(data) {
    const card = document.querySelector("#business-detail-card");
    const description = document.querySelector("#business-detail-description");
    const gallery = document.querySelector("#business-gallery");
    if (!card || !description || !gallery) return;

    card.classList.add("expanded-profile-card");

    const intro = createSection("expanded-short-intro", "Кратко представяне");
    const introText = String(data.shortIntro || "").trim();
    if (introText) {
      intro.append(element("p", "", introText));
      intro.hidden = false;
    }
    gallery.insertAdjacentElement("beforebegin", intro);

    const services = createSection("expanded-services", "Услуги");
    renderTextList(services, data.services);
    gallery.insertAdjacentElement("beforebegin", services);

    const area = createSection("expanded-service-area", "Район на работа");
    const areaText = String(data.serviceArea || "").trim();
    if (areaText) {
      area.append(element("p", "", areaText));
      area.hidden = false;
    }
    gallery.insertAdjacentElement("beforebegin", area);

    const galleryHeading = element("h2", "expanded-gallery-heading", "Галерия");
    galleryHeading.id = "expanded-gallery-heading";
    galleryHeading.hidden = true;
    gallery.insertAdjacentElement("beforebegin", galleryHeading);
    gallery.classList.add("expanded-deferred-section");

    const beforeAfter = createSection("expanded-before-after", "Преди и след", "expanded-before-after");
    const pairs = Array.isArray(data.beforeAfter) ? data.beforeAfter : [];
    if (pairs.length) {
      const grid = element("div", "expanded-before-after-grid");
      pairs.forEach(pair => {
        const item = element("article", "expanded-before-after-item");
        [[pair.before, "Преди"], [pair.after, "След"]].forEach(([src, label]) => {
          if (!src) return;
          const figure = element("figure");
          const image = document.createElement("img");
          image.src = src;
          image.alt = label;
          image.loading = "lazy";
          image.decoding = "async";
          figure.append(image, element("figcaption", "", label));
          item.append(figure);
        });
        if (item.children.length) grid.append(item);
      });
      if (grid.children.length) {
        beforeAfter.append(grid);
        beforeAfter.hidden = false;
      }
    }
    gallery.insertAdjacentElement("afterend", beforeAfter);
  }

  function prepareContact(data) {
    const panel = document.querySelector("#business-contact-panel");
    if (!panel) return;

    panel.id = "expanded-contact";
    panel.classList.add("expanded-contact-panel", "expanded-deferred-section");

    const hours = String(data.workHours || "").trim();
    const heading = panel.querySelector("h2");
    if (heading) heading.textContent = hours ? "Контакти и работно време" : "Контакти";

    if (hours && !panel.querySelector("[data-expanded-work-hours]")) {
      const row = element("p");
      row.dataset.expandedWorkHours = "true";
      row.append(element("strong", "", "Работно време"), document.createElement("br"), document.createTextNode(hours));
      const reportLink = panel.querySelector('a[href="signal.html"]');
      panel.insertBefore(row, reportLink || null);
    }
  }

  function observeGallery() {
    const gallery = document.querySelector("#business-gallery");
    if (!gallery || galleryObserver) return;
    galleryObserver = new MutationObserver(syncGalleryAndCover);
    galleryObserver.observe(gallery, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["hidden", "src"]
    });
    syncGalleryAndCover();
  }

  async function isExpandedBusiness() {
    const client = await waitForSupabaseClient();
    if (!client) return false;

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const { data, error } = await client
        .from("businesses")
        .select("id, is_expanded")
        .eq("id", businessId)
        .maybeSingle();

      if (!error && data?.is_expanded === true) return true;
      if (!error && data?.is_expanded === false) return false;
      if (attempt === 0) await wait(700);
    }

    return false;
  }

  async function loadPublishedProfile() {
    const client = await waitForSupabaseClient();
    if (!client) return EMPTY_PROFILE_DATA;

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const { data, error } = await client
        .from("business_expanded_profiles")
        .select([
          "short_intro",
          "website",
          "services",
          "service_area",
          "work_hours",
          "show_short_intro",
          "show_website",
          "show_services",
          "show_service_area",
          "show_work_hours"
        ].join(", "))
        .eq("business_id", businessId)
        .maybeSingle();

      if (!error) {
        if (!data) return EMPTY_PROFILE_DATA;
        return {
          shortIntro: data.show_short_intro ? String(data.short_intro || "").trim() : "",
          website: data.show_website ? String(data.website || "").trim() : "",
          services: data.show_services && Array.isArray(data.services) ? data.services : [],
          serviceArea: data.show_service_area ? String(data.service_area || "").trim() : "",
          workHours: data.show_work_hours ? String(data.work_hours || "").trim() : "",
          beforeAfter: []
        };
      }

      if (attempt === 0) await wait(700);
    }

    return EMPTY_PROFILE_DATA;
  }

  function waitForBusinessContent() {
    return new Promise(resolve => {
      let observer = null;
      let timeoutId = null;
      let settled = false;

      const finish = value => {
        if (settled) return;
        settled = true;
        observer?.disconnect();
        if (timeoutId) window.clearTimeout(timeoutId);
        resolve(value);
      };

      const ready = () => {
        const name = nameElement.textContent.trim();
        if (!name || name === "Зареждане…" || name === "Фирмата не е намерена") return false;
        finish(true);
        return true;
      };

      observer = new MutationObserver(ready);
      observer.observe(nameElement, { childList: true, characterData: true, subtree: true });
      timeoutId = window.setTimeout(() => finish(false), 5000);
      ready();
    });
  }

  async function initialize() {
    if (initialized) return;

    const contentReady = await waitForBusinessContent();
    if (!contentReady) return;

    const expanded = await isExpandedBusiness();
    if (!expanded) return;

    const data = await loadPublishedProfile();
    initialized = true;
    document.body.classList.add("has-expanded-business-profile");
    document.querySelector("#business-page-hero")?.classList.add("expanded-business-hero");

    createDesktopActions(data);
    prepareContentSections(data);
    prepareContact(data);
    createMobileActions();
    observeGallery();
  }

  initialize();
})();
