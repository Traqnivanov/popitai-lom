(() => {
  const ADMIN_ID = "598d6626-25ed-450f-87a9-e83f34f641c4";
  const BUCKET = "business-media";
  const MAX_LISTINGS = 5;

  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return document.querySelectorAll(sel); }

  function escHtml(v) {
    return String(v ?? "")
      .replaceAll("&","&amp;").replaceAll("<","&lt;")
      .replaceAll(">","&gt;").replaceAll('"',"&quot;");
  }

  function formatPrice(item) {
    if (item.price_free) return "Подарява";
    if (item.price_negotiable) return "Договаряне";
    if (item.price != null) {
      const eur = Number(item.price).toLocaleString("bg-BG") + " евро";
      const bgn = (Number(item.price) * 1.95583).toFixed(2).replace(".", ",") + " лв.";
      return `${eur} / ${bgn}`;
    }
    return "";
  }

  function formatDate(iso) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("bg-BG", { day:"numeric", month:"long", year:"numeric" });
  }

  function daysLeft(iso) {
    if (!iso) return null;
    const diff = new Date(iso) - new Date();
    return Math.max(0, Math.ceil(diff / 86400000));
  }

  function publicUrl(path) {
    if (!path) return "";
    const { data } = client.storage.from(BUCKET).getPublicUrl(path);
    return data?.publicUrl || "";
  }

  function humanError(err, fallback) {
    if (!err) return fallback;
    const m = err.message || "";
    if (m.includes("new row violates")) return "Не отговаря на изискванията. Провери данните.";
    return fallback;
  }

  function setMessage(msg, type = "info") {
    const el = $("#listing-message");
    if (!el) return;
    el.textContent = msg;
    el.className = "form-message " + type;
  }

  let client;
  let authUser = null;
  let isAdmin = false;

  async function waitForClient() {
    return new Promise(resolve => {
      if (window.PopitaiSupabase) return resolve(window.PopitaiSupabase);
      const t = setInterval(() => {
        if (window.PopitaiSupabase) { clearInterval(t); resolve(window.PopitaiSupabase); }
      }, 50);
    });
  }

  async function getAuth() {
    const { data } = await client.auth.getUser();
    authUser = data?.user || null;
    isAdmin = authUser?.id === ADMIN_ID;
  }

  // ─── Listing card ───────────────────────────────────────────────────────────

  function listingCard(item, coverUrl = "") {
    const price = formatPrice(item);
    const badges = [
      item.is_urgent ? '<span class="listing-badge urgent">Спешно</span>' : "",
      item.is_highlighted ? '<span class="listing-badge highlighted">Препоръчано</span>' : "",
      item.is_reduced && item.price_old ? `<span class="listing-badge reduced">Намалено</span>` : ""
    ].filter(Boolean).join("");

    return `<article class="listing-card${item.is_highlighted ? " listing-card--highlighted" : ""}">
      ${coverUrl ? `<a href="obqva.html?id=${escHtml(item.id)}" class="listing-card-cover">
        <img src="${escHtml(coverUrl)}" alt="${escHtml(item.title)}" loading="lazy">
      </a>` : ""}
      <div class="listing-card-body">
        ${badges}
        <span class="listing-type-badge">${escHtml(item.listing_type || "")}</span>
        <h3><a href="obqva.html?id=${escHtml(item.id)}">${escHtml(item.title)}</a></h3>
        <p class="listing-category">${escHtml(item.category)}${item.subcategory ? " › " + escHtml(item.subcategory) : ""}</p>
        ${price ? `<p class="listing-price">${item.price_old && item.is_reduced ? `<s>${Number(item.price_old).toLocaleString("bg-BG")} лв.</s> ` : ""}${escHtml(price)}</p>` : ""}
        ${item.city ? `<p class="listing-location">📍 ${escHtml(item.city)}</p>` : ""}
        <p class="listing-date">${formatDate(item.created_at)}</p>
      </div>
    </article>`;
  }

  // ─── Load listings list ──────────────────────────────────────────────────────

  async function loadListings() {
    const container = $("#listings-list");
    if (!container) return;

    await getAuth();

    let query = client.from("listings")
      .select("id, owner_id, title, category, subcategory, listing_type, price, price_negotiable, price_free, price_old, currency, city, is_urgent, is_highlighted, is_reduced, is_boosted, is_owner_admin, created_at")
      .eq("status", "approved")
      .or("expires_at.is.null,expires_at.gt." + new Date().toISOString())
      .order("is_owner_admin", { ascending: false })
      .order("is_boosted", { ascending: false })
      .order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      container.innerHTML = '<article class="empty-card"><p>Обявите не могат да се заредят.</p></article>';
      return;
    }

    let listings = data || [];

    // Зареждаме cover снимките
    if (listings.length) {
      const ids = listings.map(l => l.id);
      const { data: mediaData } = await client.from("media")
        .select("entity_id, storage_path")
        .eq("entity_type", "listing")
        .in("entity_id", ids)
        .eq("status", "approved")
        .order("created_at", { ascending: true });

      const coverMap = {};
      (mediaData || []).forEach(m => {
        if (!coverMap[m.entity_id]) coverMap[m.entity_id] = m.storage_path;
      });

      listings = listings.map(l => ({ ...l, _coverUrl: coverMap[l.id] ? publicUrl(coverMap[l.id]) : "" }));
    }

    // Admin обявите на Иванов Ремонти винаги първи
    listings.sort((a, b) => {
      if (a.owner_id === ADMIN_ID && b.owner_id !== ADMIN_ID) return -1;
      if (b.owner_id === ADMIN_ID && a.owner_id !== ADMIN_ID) return 1;
      if (a.is_boosted && !b.is_boosted) return -1;
      if (b.is_boosted && !a.is_boosted) return 1;
      return new Date(b.created_at) - new Date(a.created_at);
    });

    window.__allListings = listings;
    renderListings(listings);
    initFilters(listings);
  }

  function renderListings(listings) {
    const container = $("#listings-list");
    if (!container) return;
    if (!listings.length) {
      container.innerHTML = '<article class="empty-card"><p>Няма намерени обяви.</p></article>';
      return;
    }
    container.innerHTML = listings.map(item => listingCard(item, item._coverUrl || "")).join("");
  }

  function initFilters(allListings) {
    const search = $("#listings-search");
    const typeFilter = $("#listings-type-filter");
    const sort = $("#listings-sort");
    const catBtns = document.querySelectorAll(".listing-cat-btn");
    const subtypeRow = $("#listings-subtype-row");
    const subtypeFilter = $("#listings-subtype-filter");
    const typeRow = $("#listings-type-row");

    const SUBTYPES = {
      "Работа": ["Предлага работа", "Търси работа"],
      "Имоти": ["Продава имот", "Отдава под наем", "Търси под наем", "Търси за купуване"]
    };

    let activeCat = "";

    catBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        catBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeCat = btn.dataset.cat || "";

        // Показваме подтипове за Работа и Имоти
        if (SUBTYPES[activeCat]) {
          subtypeFilter.innerHTML = `<option value="">Всички</option>` +
            SUBTYPES[activeCat].map(s => `<option value="${s}">${s}</option>`).join("");
          subtypeRow.hidden = false;
          if (typeRow) typeRow.hidden = true;
        } else {
          subtypeRow.hidden = true;
          if (typeRow) typeRow.hidden = false;
        }

        applyFilters();
      });
    });

    function applyFilters() {
      const q = (search?.value || "").toLowerCase();
      const type = typeFilter?.value || "";
      const subtype = subtypeFilter?.value || "";
      const sortVal = sort?.value || "newest";

      let filtered = allListings.filter(item => {
        if (activeCat && item.category !== activeCat) return false;
        if (subtype && item.listing_type !== subtype) return false;
        if (!subtype && type && item.listing_type !== type) return false;
        if (q && !item.title.toLowerCase().includes(q) && !(item.subcategory || "").toLowerCase().includes(q)) return false;
        return true;
      });

      if (sortVal === "price_asc") filtered.sort((a, b) => (a.price ?? 999999) - (b.price ?? 999999));
      else if (sortVal === "price_desc") filtered.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
      else {
        filtered.sort((a, b) => {
          if (a.owner_id === ADMIN_ID && b.owner_id !== ADMIN_ID) return -1;
          if (b.owner_id === ADMIN_ID && a.owner_id !== ADMIN_ID) return 1;
          if (a.is_boosted && !b.is_boosted) return -1;
          if (b.is_boosted && !a.is_boosted) return 1;
          return new Date(b.created_at) - new Date(a.created_at);
        });
      }

      renderListings(filtered);
    }

    [search, typeFilter, subtypeFilter, sort].forEach(el => el?.addEventListener("input", applyFilters));
  }

  // ─── Add listing form ────────────────────────────────────────────────────────

  async function initListingForm() {
    const form = $("#listing-form");
    if (!form) return;

    // Show image uploader
    const uploader = $("#listing-image-uploader");
    if (uploader) {
      uploader.hidden = false;
      uploader.dataset.maxFiles = isAdmin ? "20" : "6";
    }

    // Изчакваме PopitaiImages да се зареди
    await new Promise(resolve => {
      if (window.PopitaiImages) return resolve();
      const t = setInterval(() => { if (window.PopitaiImages) { clearInterval(t); resolve(); } }, 50);
      setTimeout(resolve, 3000);
    });
    if (window.PopitaiImages?.init) window.PopitaiImages.init();

    await getAuth();

    // Live EUR → BGN калкулатор
    const priceInput = $("#listing-price");
    const priceBgn = $("#listing-price-bgn");
    const EUR_TO_BGN = 1.95583;
    priceInput?.addEventListener("input", () => {
      const val = parseFloat(priceInput.value);
      if (priceBgn) {
        priceBgn.textContent = val > 0
          ? `≈ ${(val * EUR_TO_BGN).toFixed(2)} лв.`
          : "";
      }
    });

    // Динамичен тип обява спрямо категория
    const catSelect = $("#listing-category");
    const typeStandard = $("#listing-type");
    const typeRabota = $("#listing-type-rabota");
    const typeImoti = $("#listing-type-imoti");

    function updateTypeField() {
      const cat = catSelect?.value || "";
      if (cat === "Работа") {
        typeStandard.hidden = true; typeStandard.required = false;
        typeRabota.hidden = false;
        typeImoti.hidden = true;
      } else if (cat === "Имоти") {
        typeStandard.hidden = true; typeStandard.required = false;
        typeRabota.hidden = true;
        typeImoti.hidden = false;
      } else {
        typeStandard.hidden = false; typeStandard.required = true;
        typeRabota.hidden = true;
        typeImoti.hidden = true;
      }
    }

    catSelect?.addEventListener("change", updateTypeField);
    updateTypeField();

    // Edit mode
    const editId = new URLSearchParams(window.location.search).get("edit");
    let editMode = false;
    let editData = null;

    if (editId) {
      const { data } = await client.from("listings").select("*").eq("id", editId).maybeSingle();
      if (data && (data.owner_id === authUser?.id || data.author_id === authUser?.id || isAdmin)) {
        editMode = true;
        editData = data;
        const set = (id, val) => { const el = $(id); if (el) el.value = val ?? ""; };
        set("#listing-title", data.title);
        set("#listing-subcategory", data.subcategory);
        set("#listing-description", data.description);
        set("#listing-price", data.price);
        set("#listing-phone", data.phone);
        set("#listing-city", data.city);
        set("#listing-street", data.street);
        if (catSelect) { catSelect.value = data.category; catSelect.dispatchEvent(new Event("change")); }
        window.setTimeout(() => {
          if (data.category === "Работа") { const el = $("#listing-type-rabota-select"); if (el) el.value = data.listing_type; }
          else if (data.category === "Имоти") { const el = $("#listing-type-imoti-select"); if (el) el.value = data.listing_type; }
          else { const el = $("#listing-type"); if (el) el.value = data.listing_type; }
        }, 100);
        if ($("#listing-price-negotiable")) $("#listing-price-negotiable").checked = data.price_negotiable;
        if ($("#listing-price-free")) $("#listing-price-free").checked = data.price_free;
        if (data.price) { const bgn = $("#listing-price-bgn"); if (bgn) bgn.textContent = `≈ ${(data.price * 1.95583).toFixed(2)} лв.`; }
        const hero = document.querySelector(".page-hero h1");
        if (hero) hero.textContent = "Редактирай обява";
        const heroP = document.querySelector(".page-hero p");
        if (heroP) heroP.textContent = "Промените ще бъдат прегледани преди публикуване.";
      }
    }

    if (isAdmin) {
      const btn = $("#listing-submit");
      if (btn) btn.textContent = editMode ? "Запази промените" : "Публикувай обявата";
      const extSection = $("#listing-admin-extended");
      if (extSection) {
        extSection.hidden = false;
        if (editData) {
          if ($("#ext-is-urgent")) $("#ext-is-urgent").checked = editData.is_urgent;
          if ($("#ext-is-reduced")) $("#ext-is-reduced").checked = editData.is_reduced;
          if ($("#ext-is-boosted")) $("#ext-is-boosted").checked = editData.is_boosted;
          if ($("#ext-is-highlighted")) $("#ext-is-highlighted").checked = editData.is_highlighted;
          if ($("#ext-show-stats")) $("#ext-show-stats").checked = editData.show_stats;
          if ($("#ext-show-contact-buttons")) $("#ext-show-contact-buttons").checked = editData.show_contact_buttons;
        }
      }
    } else if (editMode) {
      const btn = $("#listing-submit");
      if (btn) btn.textContent = "Изпрати за преглед";
    }

    // Live duplicate check
    const titleInput = $("#listing-title");
    let dupTimer;
    titleInput?.addEventListener("input", () => {
      clearTimeout(dupTimer);
      dupTimer = setTimeout(() => checkDuplicate(titleInput.value.trim()), 600);
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = "Изпращане…";
      setMessage("", "");

      const { data: authData } = await client.auth.getUser();
      const user = authData?.user || null;
      if (!user) {
        setMessage("Трябва да влезеш в профила си.", "error");
        btn.disabled = false;
        btn.textContent = isAdmin ? "Публикувай обявата" : "Публикувай обявата";
        return;
      }

      const admin = user.id === ADMIN_ID;

      // Лимит 5 за потребители
      if (!admin) {
        const { count } = await client.from("listings")
          .select("id", { count: "exact", head: true })
          .eq("owner_id", user.id)
          .eq("status", "approved");
        if ((count || 0) >= MAX_LISTINGS) {
          setMessage(`Достигнат е лимитът от ${MAX_LISTINGS} активни обяви.`, "error");
          btn.disabled = false;
          btn.textContent = "Публикувай обявата";
          return;
        }
      }

      const cat = $("#listing-category")?.value || "";
      let listingType = "";
      if (cat === "Работа") {
        listingType = $("#listing-type-rabota-select")?.value || "Предлага работа";
      } else if (cat === "Имоти") {
        listingType = $("#listing-type-imoti-select")?.value || "Продава имот";
      } else {
        listingType = $("#listing-type")?.value || "";
      }

      const editIdSubmit = new URLSearchParams(window.location.search).get("edit");

      const priceVal = $("#listing-price")?.value;
      const payload = {
        currency: "евро",
        title: $("#listing-title")?.value.trim(),
        category: $("#listing-category")?.value,
        subcategory: $("#listing-subcategory")?.value.trim() || "",
        listing_type: listingType,
        description: $("#listing-description")?.value.trim(),
        price: priceVal ? parseFloat(priceVal) : null,
        price_negotiable: $("#listing-price-negotiable")?.checked || false,
        price_free: $("#listing-price-free")?.checked || false,
        phone: $("#listing-phone")?.value.trim(),
        city: $("#listing-city")?.value.trim(),
        street: $("#listing-street")?.value.trim() || "",
        status: admin ? "approved" : "pending",
        is_urgent: admin ? ($("#ext-is-urgent")?.checked || false) : false,
        is_reduced: admin ? ($("#ext-is-reduced")?.checked || false) : false,
        is_boosted: admin ? ($("#ext-is-boosted")?.checked || false) : false,
        is_highlighted: admin ? ($("#ext-is-highlighted")?.checked || false) : false,
        show_stats: admin ? ($("#ext-show-stats")?.checked || false) : false,
        show_contact_buttons: admin ? ($("#ext-show-contact-buttons")?.checked || false) : false
      };

      let listing, error;

      if (editIdSubmit) {
        // UPDATE
        const { data, error: upErr } = await client.from("listings")
          .update(payload)
          .eq("id", editIdSubmit)
          .select("id").single();
        listing = data; error = upErr;
      } else {
        // INSERT
        const insertPayload = { ...payload, owner_id: user.id, author_id: user.id, is_owner_admin: admin };
        const { data, error: inErr } = await client.from("listings")
          .insert(insertPayload).select("id").single();
        listing = data; error = inErr;
      }
      if (error || !listing) {
        setMessage(humanError(error, "Обявата не беше записана. Провери данните."), "error");
        btn.disabled = false;
        btn.textContent = "Публикувай обявата";
        return;
      }

      // Снимки
      try {
        setMessage("Качваме снимките…", "warning");
        if (window.PopitaiImages?.commit) {
          const imgs = await window.PopitaiImages.commit("listing-image-uploader", "listing", listing.id);
          // Upload images using business-image infrastructure
          for (const item of imgs) {
            const variant = item.variants?.large || item.variants?.medium || item.variants?.thumb;
            if (!variant?.key) continue;
            const db = await openImgDb();
            const prepared = await getImgFromDb(db, variant.key);
            if (!prepared?.blob) continue;
            const mime = prepared.mime || prepared.blob.type || "image/webp";
            const ext = mime === "image/png" ? "png" : mime === "image/jpeg" ? "jpg" : "webp";
            const path = `${user.id}/${listing.id}/gallery/${item.id}.${ext}`;
            await client.storage.from(BUCKET).upload(path, prepared.blob, { cacheControl: "3600", contentType: mime, upsert: false });
            await client.from("media").insert({
              owner_id: user.id, entity_type: "listing", entity_id: listing.id,
              storage_path: path, mime_type: mime, size_bytes: prepared.blob.size, status: "approved"
            });
          }
        }
        form.reset();
        btn.textContent = "Публикувай обявата";
        setMessage(
          editIdSubmit
            ? (admin ? "Промените са запазени." : "Промените са изпратени и чакат одобрение.")
            : (admin ? "Обявата е публикувана." : "Обявата е изпратена и чака одобрение."),
          "success"
        );
      } catch (imgErr) {
        setMessage("Обявата е записана, но снимките не се качиха.", "error");
      }

      btn.disabled = false;
    }, true);
  }

  function openImgDb() {
    return new Promise((res, rej) => {
      const r = indexedDB.open("popitaiMediaDB", 1);
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }

  function getImgFromDb(db, key) {
    return new Promise((res, rej) => {
      const tx = db.transaction("media", "readonly");
      const r = tx.objectStore("media").get(key);
      r.onsuccess = () => res(r.result || null);
      r.onerror = () => rej(r.error);
      tx.oncomplete = () => db.close();
    });
  }

  async function checkDuplicate(title) {
    const warning = $("#listing-duplicate-warning");
    if (!warning || title.length < 5) { if (warning) warning.hidden = true; return; }

    const { data } = await client.from("listings")
      .select("id, title")
      .eq("status", "approved")
      .ilike("title", `%${title.substring(0, 20)}%`)
      .limit(3);

    if (data && data.length > 0) {
      warning.textContent = `⚠ Намерена е подобна обява: „${data[0].title}"`;
      warning.hidden = false;
    } else {
      warning.hidden = true;
    }
  }

  async function loadProfileListings() {
    const container = $("#profile-listings");
    if (!container) return;

    await getAuth();
    if (!authUser) {
      container.innerHTML = '<article class="empty-card"><p>Влез в профила си, за да видиш обявите си.</p></article>';
      return;
    }

    const { data, error } = await client.from("listings")
      .select("id, title, category, listing_type, price, price_negotiable, price_free, currency, status, moderation_note, expires_at, created_at, owner_id, author_id")
      .or(`owner_id.eq.${authUser.id},author_id.eq.${authUser.id}`)
      .order("created_at", { ascending: false });

    if (error) {
      container.innerHTML = '<article class="empty-card"><p>Обявите не могат да се заредят.</p></article>';
      return;
    }

    const items = data || [];
    if (!items.length) {
      container.innerHTML = '<article class="empty-card"><p>Все още нямаш добавени обяви. <a href="dobavi-obqva.html">Добави обява</a></p></article>';
      return;
    }

    const activeCount = items.filter(i => i.status === "approved").length;

    container.innerHTML = `
      <p style="margin:0 0 12px;font-size:13px;color:#59657a;font-weight:700">${activeCount} активни от ${MAX_LISTINGS} позволени</p>
      ${items.map(item => {
        const days = item.expires_at ? daysLeft(item.expires_at) : null;
        const statusLabels = { approved: "Активна", pending: "Чака одобрение", rejected: "Отказана", needs_changes: "Върната за корекция" };
        const statusColors = { approved: "#16a34a", pending: "#9a6700", rejected: "#b91c1c", needs_changes: "#1d4ed8" };
        const price = formatPrice(item);
        return `<article class="db-profile-item">
          <div class="db-moderation-meta">
            <span style="color:${statusColors[item.status] || "#59657a"};font-weight:800">${statusLabels[item.status] || item.status}</span>
            <span>${formatDate(item.created_at)}</span>
            ${days !== null ? `<span style="color:${days < 7 ? "#b91c1c" : "#59657a"}">Изтича след ${days} дни</span>` : ""}
          </div>
          <h3 style="margin:4px 0"><a href="obqva.html?id=${escHtml(item.id)}">${escHtml(item.title)}</a></h3>
          <p style="margin:0;font-size:13px;color:#59657a">${escHtml(item.category)} · ${escHtml(item.listing_type || "")}${price ? " · " + escHtml(price) : ""}</p>
          ${item.moderation_note ? `<p style="margin:6px 0 0;font-size:13px;color:#b91c1c"><strong>Бележка:</strong> ${escHtml(item.moderation_note)}</p>` : ""}
          <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
            <a href="obqva.html?id=${escHtml(item.id)}" style="padding:6px 14px;border:1px solid #d7deea;border-radius:8px;font-size:13px;font-weight:700;color:#26344d;text-decoration:none">Преглед</a>
            ${item.status === "approved" || item.status === "needs_changes" ? `<a href="dobavi-obqva.html?edit=${escHtml(item.id)}" style="padding:6px 14px;border:1px solid #d7deea;border-radius:8px;font-size:13px;font-weight:700;color:#26344d;text-decoration:none">Редактирай</a>` : ""}
          </div>
        </article>`;
      }).join("")}`;
  }

  async function loadListingDetail() {
    const container = $("#listing-detail");
    if (!container) return;

    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) { container.innerHTML = '<article class="empty-card"><p>Обявата не е намерена.</p></article>'; return; }

    const { data: item, error } = await client.from("listings")
      .select("id, owner_id, title, category, subcategory, listing_type, description, price, price_negotiable, price_free, price_old, currency, phone, city, street, is_urgent, is_highlighted, is_reduced, is_owner_admin, created_at, expires_at")
      .eq("id", id)
      .maybeSingle();

    if (error || !item) {
      container.innerHTML = '<article class="empty-card"><p>Обявата не е намерена или е изтекла.</p></article>';
      return;
    }

    const price = formatPrice(item);
    const badges = [
      item.is_urgent ? '<span class="listing-badge urgent">Спешно</span>' : "",
      item.is_reduced && item.price_old ? '<span class="listing-badge reduced">Намалено</span>' : ""
    ].filter(Boolean).join("");

    const days = item.expires_at ? daysLeft(item.expires_at) : null;

    // Снимки
    const { data: mediaData } = await client.from("media")
      .select("storage_path")
      .eq("entity_type", "listing")
      .eq("entity_id", id)
      .eq("status", "approved")
      .order("created_at", { ascending: true });

    const images = (mediaData || []).map(m => publicUrl(m.storage_path)).filter(Boolean);

    const galleryHtml = images.length ? `
      <div style="margin-bottom:20px">
        ${images.length > 0 ? `<img src="${escHtml(images[0])}" alt="${escHtml(item.title)}" style="width:100%;max-height:420px;object-fit:cover;border-radius:12px;margin-bottom:10px">` : ""}
        ${images.length > 1 ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px">
          ${images.slice(1).map(url => `<img src="${escHtml(url)}" alt="" loading="lazy" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:8px">`).join("")}
        </div>` : ""}
      </div>` : "";

    container.innerHTML = `
      <article>
        <div style="margin-bottom:12px">
          <a href="obyavi.html" style="color:#59657a;font-size:13px">← Назад към обявите</a>
        </div>
        ${badges}
        <span class="listing-type-badge">${escHtml(item.listing_type || "")}</span>
        <h1 style="margin:8px 0 4px;font-size:24px">${escHtml(item.title)}</h1>
        <p style="margin:0 0 8px;color:#59657a;font-size:14px">${escHtml(item.category)}${item.subcategory ? " › " + escHtml(item.subcategory) : ""}</p>
        ${price ? `<p style="font-size:20px;font-weight:900;margin:0 0 12px">${item.price_old && item.is_reduced ? `<s style="color:#9aa3b0;font-weight:400;font-size:15px">${Number(item.price_old).toLocaleString("bg-BG")} евро</s> ` : ""}${escHtml(price)}</p>` : ""}
        <p style="margin:0 0 16px;color:#59657a;font-size:13px">${formatDate(item.created_at)}${item.city ? " · " + escHtml(item.city) : ""}${item.street ? ", " + escHtml(item.street) : ""}${days !== null ? " · Изтича след " + days + " дни" : ""}</p>
        ${galleryHtml}
        <div style="white-space:pre-wrap;line-height:1.7;margin-bottom:24px">${escHtml(item.description)}</div>
        <a href="obyavi.html" style="color:#0b5fd7;font-size:14px">← Всички обяви</a>
      </article>`;

    // Контактен панел
    const panel = $("#listing-contact-panel");
    const phoneEl = $("#listing-detail-phone");
    const cityEl = $("#listing-detail-city");
    const callBtn = $("#listing-call-btn");
    if (panel && item.phone) {
      phoneEl.textContent = item.phone;
      phoneEl.href = `tel:${item.phone.replace(/\s/g, "")}`;
      if (callBtn) callBtn.href = `tel:${item.phone.replace(/\s/g, "")}`;
      if (cityEl) cityEl.textContent = [item.city, item.street].filter(Boolean).join(", ");
      panel.hidden = false;
    }

    // Title
    document.title = `${item.title} | Попитай.Лом`;

    // Плаващи бутони ако show_contact_buttons или owner е admin
    if (item.show_contact_buttons || item.is_owner_admin) {
      const phone = item.phone?.replace(/\s/g, "") || "";
      const viber = `viber://chat?number=359${phone.replace(/^0/, "")}`;

      const nav = document.createElement("nav");
      nav.className = "expanded-mobile-actions";
      nav.id = "listing-float-actions";
      nav.innerHTML = `
        <a href="tel:${phone}" class="expanded-mobile-call" aria-label="Обади се" title="Обади се">
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        </a>
        <a href="${viber}" class="expanded-mobile-inquiry" aria-label="Запитване" title="Запитване в Viber">
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </a>`;

      const mobileNav = document.querySelector(".mobile-bottom-nav");
      (mobileNav || document.body.lastElementChild)?.insertAdjacentElement("beforebegin", nav);
      document.body.classList.add("has-expanded-business-profile");
    }
  }

  // ─── Boot ────────────────────────────────────────────────────────────────────

  waitForClient().then(c => {
    client = c;
    if ($("#listings-list")) loadListings();
    if ($("#listing-form")) initListingForm();
    if ($("#listing-detail")) loadListingDetail();
    if ($("#profile-listings")) loadProfileListings();
  });

})();
