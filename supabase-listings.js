(() => {
  const ADMIN_ID = "598d6626-25ed-450f-87a9-e83f34f641c4";
  const BUCKET = "business-media";
  const MONTHLY_LIMIT = 5;

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

  async function attachListingMedia(items) {
    if (!items.length) return items;
    const ids = items.map((item) => item.id);
    const { data, error } = await client.from("media")
      .select("entity_id, storage_path, status, created_at")
      .eq("entity_type", "listing")
      .in("entity_id", ids)
      .order("created_at", { ascending: true });

    if (error) throw error;

    const grouped = new Map();
    (data || []).forEach((media) => {
      if (!grouped.has(media.entity_id)) grouped.set(media.entity_id, []);
      grouped.get(media.entity_id).push(media);
    });

    return items.map((item) => ({
      ...item,
      _media: grouped.get(item.id) || []
    }));
  }

  function humanError(err, fallback) {
    if (!err) return fallback;
    const m = err.message || "";
    if (m.includes("Достигнат е месечният лимит")) return m;
    if (m.includes("Избраната фирма не е твоя или не е одобрена")) return m;
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

  async function getOwnListingQuota() {
    const { data, error } = await client.rpc("get_own_listing_quota");
    if (error) throw error;
    return data || null;
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

    let listings;
    try {
      listings = await attachListingMedia(data || []);
    } catch (_) {
      listings = data || [];
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
    container.innerHTML = listings.map((item) => {
      const cover = item._media?.[0]?.storage_path
        ? publicUrl(item._media[0].storage_path)
        : "";
      return listingCard(item, cover);
    }).join("");
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

      filtered.sort((a, b) => {
        // Admin listings always stay first, regardless of the selected sort.
        if (a.owner_id === ADMIN_ID && b.owner_id !== ADMIN_ID) return -1;
        if (b.owner_id === ADMIN_ID && a.owner_id !== ADMIN_ID) return 1;

        if (sortVal === "price_asc") {
          return (a.price ?? 999999) - (b.price ?? 999999);
        }
        if (sortVal === "price_desc") {
          return (b.price ?? -1) - (a.price ?? -1);
        }
        if (a.is_boosted && !b.is_boosted) return -1;
        if (b.is_boosted && !a.is_boosted) return 1;
        return new Date(b.created_at) - new Date(a.created_at);
      });

      renderListings(filtered);
    }

    [search, typeFilter, subtypeFilter, sort].forEach(el => el?.addEventListener("input", applyFilters));
  }

  // ─── Add listing form ────────────────────────────────────────────────────────

  async function initListingForm() {
    const form = $("#listing-form");
    if (!form) return;

    const editId = new URLSearchParams(window.location.search).get("edit");
    const submitButton = form.querySelector('[type="submit"]');
    let editListing = null;
    let editDraft = null;
    let editMediaRows = [];
    const removedEditMediaIds = new Set();
    let editReady = !editId;

    function setFormLocked(locked) {
      form.querySelectorAll("input, select, textarea, button").forEach((control) => {
        control.disabled = locked;
      });
    }

    if (editId) {
      setFormLocked(true);
      if (submitButton) submitButton.textContent = "Зареждане…";
    }

    // Show the uploader with the correct role-specific limit.
    // Regular users: 6 images. Admin: the existing 20-image limit.
    const uploader = $("#listing-image-uploader");
    if (uploader) uploader.hidden = false;

    await getAuth();

    if (window.PopitaiImages?.setMaxFiles) {
      window.PopitaiImages.setMaxFiles("listing-image-uploader", isAdmin ? 20 : 6);
    }

    const publisherSection = $("#listing-publisher-section");
    const publisherSelect = $("#listing-publisher");
    const quotaInfo = $("#listing-quota-info");
    let listingQuota = null;

    function selectedQuota() {
      if (!listingQuota || !publisherSelect) return null;
      if (!publisherSelect.value) return listingQuota.personal || null;
      return (listingQuota.businesses || []).find(
        (business) => business.id === publisherSelect.value
      ) || null;
    }

    function updateQuotaInfo() {
      if (!quotaInfo || !publisherSelect || !listingQuota) return;
      const quota = selectedQuota();
      const label = publisherSelect.value ? "Фирмени обяви" : "Лични обяви";
      quotaInfo.textContent = quota
        ? `${label}: остават ${quota.remaining} от ${MONTHLY_LIMIT} за този месец.`
        : "";
    }

    if (authUser && !isAdmin && publisherSelect && publisherSection) {
      try {
        listingQuota = await getOwnListingQuota();
        publisherSelect.innerHTML = '<option value="">Лична обява</option>' +
          (listingQuota.businesses || []).map((business) =>
            `<option value="${escHtml(business.id)}">${escHtml(business.name)}</option>`
          ).join("");
        publisherSection.hidden = false;
        publisherSelect.addEventListener("change", updateQuotaInfo);
        updateQuotaInfo();
      } catch (_) {
        setMessage("Квотата за обяви не може да се зареди. Опитай отново.", "error");
        setFormLocked(true);
        return;
      }
    }

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

    if (isAdmin) {
      const btn = $("#listing-submit");
      if (btn) btn.textContent = "Публикувай обявата";
      const extSection = $("#listing-admin-extended");
      if (extSection) extSection.hidden = false;
    }

    function ensureEditMediaSection() {
      let section = $("#listing-edit-media");
      if (section || !uploader) return section;
      section = document.createElement("section");
      section.id = "listing-edit-media";
      section.hidden = true;
      section.innerHTML = `
        <h2 style="margin:0 0 12px">Текущи снимки</h2>
        <div data-listing-edit-media style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px"></div>`;
      uploader.insertAdjacentElement("beforebegin", section);
      return section;
    }

    function renderEditMedia() {
      const section = ensureEditMediaSection();
      const grid = section?.querySelector("[data-listing-edit-media]");
      if (!section || !grid) return;
      if (!editMediaRows.length) {
        section.hidden = true;
        grid.innerHTML = "";
        return;
      }
      grid.innerHTML = editMediaRows.map((row, index) => {
        const removed = removedEditMediaIds.has(row.id);
        const url = publicUrl(row.storage_path);
        return `<figure style="margin:0;position:relative;aspect-ratio:4/3;border-radius:10px;overflow:hidden;border:1px solid #d7deea;background:#eef2f7">
          <img src="${escHtml(url)}" alt="Снимка ${index + 1}" loading="lazy" style="width:100%;height:100%;object-fit:cover;opacity:${removed ? ".3" : "1"}">
          <button type="button" data-remove-listing-media="${escHtml(row.id)}" style="position:absolute;right:6px;top:6px;border:0;border-radius:8px;padding:6px 9px;background:${removed ? "#176438" : "#8a2020"};color:#fff;font-weight:800;cursor:pointer">${removed ? "Отмени" : "Премахни"}</button>
        </figure>`;
      }).join("");
      section.hidden = false;
    }

    async function loadEditMedia() {
      if (!editListing || isAdmin) return;
      const { data, error } = await client.from("media")
        .select("id, storage_path, status, created_at")
        .eq("entity_type", "listing")
        .eq("entity_id", editListing.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      editMediaRows = data || [];
      renderEditMedia();
    }

    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-remove-listing-media]");
      if (!button || !editId || isAdmin) return;
      const id = button.dataset.removeListingMedia;
      if (removedEditMediaIds.has(id)) removedEditMediaIds.delete(id);
      else removedEditMediaIds.add(id);
      renderEditMedia();
    });

    async function loadEditListing() {
      if (!editId) return true;

      if (!authUser) {
        setMessage("Трябва да влезеш в профила си, за да редактираш обявата.", "error");
        return false;
      }

      const { data: item, error } = await client.from("listings")
        .select("id, owner_id, author_id, business_id, title, category, subcategory, listing_type, description, price, price_negotiable, price_free, phone, city, street, status, is_owner_admin, is_urgent, is_reduced, is_boosted, is_highlighted, show_stats, show_contact_buttons")
        .eq("id", editId)
        .maybeSingle();

      if (error || !item) {
        setMessage("Обявата не може да се зареди. Формата остава заключена.", "error");
        return false;
      }

      if (item.owner_id !== authUser.id) {
        setMessage("Нямаш право да редактираш тази обява.", "error");
        return false;
      }

      editListing = item;

      if (!isAdmin && item.status === "approved") {
        const { data: draft } = await client.from("user_content_edit_drafts")
          .select("id, payload, new_media_ids, remove_media_ids, status, moderation_note")
          .eq("entity_type", "listing")
          .eq("entity_id", item.id)
          .eq("owner_id", authUser.id)
          .maybeSingle();
        editDraft = draft || null;
        (editDraft?.remove_media_ids || []).forEach((id) => removedEditMediaIds.add(id));
      }

      const source = editDraft?.payload || item;

      if (!isAdmin && publisherSelect) {
        if (item.business_id &&
            !Array.from(publisherSelect.options).some((option) => option.value === item.business_id)) {
          const { data: business } = await client.from("businesses")
            .select("id, name")
            .eq("id", item.business_id)
            .eq("owner_id", authUser.id)
            .maybeSingle();
          if (business) {
            publisherSelect.insertAdjacentHTML(
              "beforeend",
              `<option value="${escHtml(business.id)}">${escHtml(business.name)}</option>`
            );
          }
        }
        publisherSelect.value = item.business_id || "";
        updateQuotaInfo();
      }

      if ($("#listing-title")) $("#listing-title").value = source.title || "";
      if (catSelect) catSelect.value = source.category || "";
      updateTypeField();

      if (source.category === "Работа") {
        if ($("#listing-type-rabota-select")) $("#listing-type-rabota-select").value = source.listing_type || "";
      } else if (source.category === "Имоти") {
        if ($("#listing-type-imoti-select")) $("#listing-type-imoti-select").value = source.listing_type || "";
      } else if (typeStandard) {
        typeStandard.value = source.listing_type || "";
      }

      if ($("#listing-subcategory")) $("#listing-subcategory").value = source.subcategory || "";
      if ($("#listing-description")) $("#listing-description").value = source.description || "";
      if (priceInput) priceInput.value = source.price ?? "";
      if ($("#listing-price-negotiable")) $("#listing-price-negotiable").checked = source.price_negotiable === true;
      if ($("#listing-price-free")) $("#listing-price-free").checked = source.price_free === true;
      if ($("#listing-phone")) $("#listing-phone").value = source.phone || "";
      if ($("#listing-city")) $("#listing-city").value = source.city || "";
      if ($("#listing-street")) $("#listing-street").value = source.street || "";

      if (isAdmin) {
        if ($("#ext-is-urgent")) $("#ext-is-urgent").checked = item.is_urgent === true;
        if ($("#ext-is-reduced")) $("#ext-is-reduced").checked = item.is_reduced === true;
        if ($("#ext-is-boosted")) $("#ext-is-boosted").checked = item.is_boosted === true;
        if ($("#ext-is-highlighted")) $("#ext-is-highlighted").checked = item.is_highlighted === true;
        if ($("#ext-show-stats")) $("#ext-show-stats").checked = item.show_stats === true;
        if ($("#ext-show-contact-buttons")) $("#ext-show-contact-buttons").checked = item.show_contact_buttons === true;
      }

      priceInput?.dispatchEvent(new Event("input", { bubbles: true }));
      try {
        await loadEditMedia();
      } catch (_) {
        setMessage("Данните са заредени, но снимките не могат да се покажат.", "warning");
      }
      editReady = true;
      setFormLocked(false);
      if (publisherSelect) publisherSelect.disabled = true;
      if (submitButton) {
        submitButton.textContent = isAdmin ? "Запази и публикувай" : "Изпрати редакцията";
      }
      setMessage(
        editDraft?.status === "needs_changes"
          ? (editDraft.moderation_note ? `Редакцията е върната: ${editDraft.moderation_note}` : "Редакцията е върната за корекция.")
          : editDraft?.status === "pending"
          ? "Има изпратена редакция. Можеш да я коригираш и да я изпратиш отново."
          : "Редактираш съществуваща обява.",
        "warning"
      );
      return true;
    }

    if (editId && !(await loadEditListing())) return;

    function showSubmissionResult(title, text, listingId, isError = false) {
      form.innerHTML = `
        <section style="padding:24px;border:1px solid ${isError ? "#efb2b2" : "#abd9ba"};border-radius:16px;background:${isError ? "#fff5f5" : "#f2fbf5"}">
          <h2 style="margin:0 0 10px;color:${isError ? "#8a2020" : "#176438"}">${escHtml(title)}</h2>
          <p style="margin:0 0 18px;line-height:1.6">${escHtml(text)}</p>
          <div style="display:flex;flex-wrap:wrap;gap:10px">
            <a href="profil.html" style="padding:10px 16px;border-radius:10px;background:#061a38;color:#fff;text-decoration:none;font-weight:800">Моите обяви</a>
            <a href="obqva.html?id=${escHtml(listingId)}" style="padding:10px 16px;border-radius:10px;border:1px solid #b8c5d8;color:#173d75;text-decoration:none;font-weight:800">Преглед</a>
            ${isError ? `<a href="dobavi-obqva.html?edit=${escHtml(listingId)}" style="padding:10px 16px;border-radius:10px;border:1px solid #b8c5d8;color:#173d75;text-decoration:none;font-weight:800">Добави снимките отново</a>` : ""}
          </div>
        </section>`;
      form.scrollIntoView({ behavior: "smooth", block: "start" });
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

      if (editId && (!editReady || !editListing)) {
        setFormLocked(true);
        setMessage("Обявата не е заредена и не може да бъде записана.", "error");
        return;
      }

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

      // Редакциите не използват месечна квота. Новите обяви се
      // проверяват окончателно от защитения trigger в Supabase.
      if (!admin && !editId) {
        const quota = selectedQuota();
        if (!quota || quota.remaining <= 0) {
          setMessage(
            publisherSelect?.value
              ? `Достигнат е месечният лимит от ${MONTHLY_LIMIT} обяви за тази фирма.`
              : `Достигнат е месечният лимит от ${MONTHLY_LIMIT} лични обяви.`,
            "error"
          );
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

      const priceVal = $("#listing-price")?.value;
      const payload = {
        owner_id: user.id,
        author_id: user.id,
        business_id: admin ? null : (publisherSelect?.value || null),
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
        is_owner_admin: admin,
        is_urgent: admin ? ($("#ext-is-urgent")?.checked || false) : false,
        is_reduced: admin ? ($("#ext-is-reduced")?.checked || false) : false,
        is_boosted: admin ? ($("#ext-is-boosted")?.checked || false) : false,
        is_highlighted: admin ? ($("#ext-is-highlighted")?.checked || false) : false,
        show_stats: admin ? ($("#ext-show-stats")?.checked || false) : false,
        show_contact_buttons: admin ? ($("#ext-show-contact-buttons")?.checked || false) : false
      };

      let listing;
      let error;

      if (editId) {
        if (admin) {
          const updatePayload = { ...payload };
          delete updatePayload.owner_id;
          delete updatePayload.author_id;
          delete updatePayload.business_id;
          delete updatePayload.is_owner_admin;

          updatePayload.status = "approved";
          updatePayload.moderation_note = "";
          updatePayload.reviewed_by = null;
          updatePayload.reviewed_at = null;

          const result = await client.from("listings")
            .update(updatePayload)
            .eq("id", editId)
            .eq("owner_id", user.id)
            .select("id")
            .single();

          listing = result.data;
          error = result.error;
        } else if (editListing.status === "approved") {
          // Публикуваната версия остава видима; черновата се записва след снимките.
          listing = { id: editId };
          error = null;
        } else {
          const result = await client.rpc("resubmit_own_listing", {
            p_listing_id: editId,
            p_title: payload.title,
            p_category: payload.category,
            p_subcategory: payload.subcategory,
            p_listing_type: payload.listing_type,
            p_description: payload.description,
            p_price: payload.price,
            p_price_negotiable: payload.price_negotiable,
            p_price_free: payload.price_free,
            p_phone: payload.phone,
            p_city: payload.city,
            p_street: payload.street
          });

          listing = result.data ? { id: result.data } : null;
          error = result.error;
        }
      } else {
        const result = await client.from("listings").insert(payload).select("id").single();
        listing = result.data;
        error = result.error;
      }

      if (error || !listing) {
        setMessage(humanError(error, editId
          ? "Промените не бяха записани. Съществуващата обява не е дублирана."
          : "Обявата не беше записана. Провери данните."), "error");
        btn.disabled = false;
        btn.textContent = editId
          ? (admin ? "Запази и публикувай" : "Изпрати редакцията")
          : "Публикувай обявата";
        return;
      }

      // Снимки
      const uploadedPaths = [];
      const insertedMediaIds = [];
      try {
        setMessage("Качваме снимките…", "warning");
        const replacementIds = [...removedEditMediaIds];
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
            const { error: uploadError } = await client.storage.from(BUCKET).upload(
              path,
              prepared.blob,
              { cacheControl: "3600", contentType: mime, upsert: false }
            );

            if (uploadError) throw uploadError;
            uploadedPaths.push(path);

            const mediaResult = admin
              ? await client.from("media").insert({
                  owner_id: user.id,
                  entity_type: "listing",
                  entity_id: listing.id,
                  storage_path: path,
                  mime_type: mime,
                  size_bytes: prepared.blob.size,
                  status: "approved"
                })
              : await client.rpc("submit_own_listing_media", {
                  p_listing_id: listing.id,
                  p_storage_path: path,
                  p_mime_type: mime,
                  p_size_bytes: prepared.blob.size,
                  p_replace_media_ids: replacementIds
                });

            const mediaError = mediaResult.error;
            if (mediaError) {
              const { error: cleanupError } = await client.storage.from(BUCKET).remove([path]);
              if (cleanupError) console.error("Listing image cleanup failed:", cleanupError);
              throw mediaError;
            }
            if (!admin && mediaResult.data) insertedMediaIds.push(mediaResult.data);
          }
        }

        if (editId && !admin && editListing.status === "approved") {
          const removeApprovedIds = editMediaRows
            .filter((row) => row.status === "approved" && removedEditMediaIds.has(row.id))
            .map((row) => row.id);
          const keptDraftMediaIds = editMediaRows
            .filter((row) => row.status === "pending" && !removedEditMediaIds.has(row.id))
            .map((row) => row.id);
          const { data: draftResult, error: draftError } = await client.rpc("save_own_listing_edit_draft", {
            p_listing_id: editId,
            p_title: payload.title,
            p_category: payload.category,
            p_subcategory: payload.subcategory,
            p_listing_type: payload.listing_type,
            p_description: payload.description,
            p_price: payload.price,
            p_price_negotiable: payload.price_negotiable,
            p_price_free: payload.price_free,
            p_phone: payload.phone,
            p_city: payload.city,
            p_street: payload.street,
            p_new_media_ids: [...keptDraftMediaIds, ...insertedMediaIds],
            p_remove_media_ids: removeApprovedIds
          });
          if (draftError) throw draftError;
          const cleanupPaths = draftResult?.cleanup_paths || [];
          if (cleanupPaths.length) await client.storage.from(BUCKET).remove(cleanupPaths);
        } else if (editId && !admin) {
          for (const mediaId of removedEditMediaIds) {
            const { data: path, error: removeError } = await client.rpc("delete_own_listing_media", {
              p_media_id: mediaId
            });
            if (removeError) throw removeError;
            if (path) await client.storage.from(BUCKET).remove([path]);
          }
        }

        const successTitle = admin
          ? (editId ? "Промените са публикувани" : "Обявата е публикувана")
          : (editId ? "Редакцията е изпратена" : "Обявата е изпратена");
        const successText = admin
          ? "Записът е публикуван успешно."
          : "Записът чака преглед и одобрение от администратор.";
        showSubmissionResult(successTitle, successText, listing.id);
        return;
      } catch (imgErr) {
        console.error("Listing image upload failed:", imgErr);

        for (const mediaId of insertedMediaIds) {
          await client.rpc("delete_own_listing_media", { p_media_id: mediaId });
        }
        if (uploadedPaths.length) await client.storage.from(BUCKET).remove(uploadedPaths);

        if (editId && !admin && editListing.status === "approved") {
          setMessage("Редакцията не беше изпратена. Публикуваната обява не е променена.", "error");
          btn.disabled = false;
          btn.textContent = "Изпрати редакцията";
          return;
        }

        showSubmissionResult(
          "Обявата е записана, но снимките не се качиха",
          "Не изпращай формата повторно. Отвори редакцията и добави снимките отново.",
          listing.id,
          true
        );
        return;
      }
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
    let draftsByListing = new Map();

    if (!isAdmin) {
      const { data: drafts } = await client.from("user_content_edit_drafts")
        .select("entity_id, status, moderation_note")
        .eq("entity_type", "listing")
        .in("entity_id", items.map((item) => item.id))
        .in("status", ["pending", "needs_changes"]);
      draftsByListing = new Map((drafts || []).map((draft) => [draft.entity_id, draft]));
    }

    container.innerHTML = `
      <p style="margin:0 0 12px;font-size:13px;color:#59657a;font-weight:700">${activeCount} активни обяви</p>
      ${items.map(item => {
        const isExpired = item.expires_at && daysLeft(item.expires_at) === 0;
        const days = item.expires_at ? daysLeft(item.expires_at) : null;
        const statusLabels = { approved: "Активна", pending: "Чака одобрение", rejected: "Отказана", needs_changes: "Върната за корекция" };
        const statusColors = { approved: "#16a34a", pending: "#9a6700", rejected: "#b91c1c", needs_changes: "#1d4ed8" };
        const price = formatPrice(item);
        const editDraft = draftsByListing.get(item.id);
        const draftNotice = editDraft?.status === "pending"
          ? '<p style="margin:6px 0 0;font-size:13px;color:#9a6700;font-weight:800">Редакцията чака одобрение. Публикуваната обява остава видима.</p>'
          : editDraft?.status === "needs_changes"
          ? `<p style="margin:6px 0 0;font-size:13px;color:#b91c1c;font-weight:800">Редакцията е върната${editDraft.moderation_note ? ": " + escHtml(editDraft.moderation_note) : " за корекция."}</p>`
          : "";
        return `<article class="db-profile-item">
          <div class="db-moderation-meta">
            <span style="color:${isExpired ? "#b91c1c" : statusColors[item.status] || "#59657a"};font-weight:800">${isExpired ? "Изтекла" : statusLabels[item.status] || item.status}</span>
            <span>${formatDate(item.created_at)}</span>
            ${days !== null && !isExpired ? `<span style="color:${days < 7 ? "#b91c1c" : "#59657a"}">Изтича след ${days} дни</span>` : ""}
          </div>
          <h3 style="margin:4px 0"><a href="obqva.html?id=${escHtml(item.id)}">${escHtml(item.title)}</a></h3>
          <p style="margin:0;font-size:13px;color:#59657a">${escHtml(item.category)} · ${escHtml(item.listing_type || "")}${price ? " · " + escHtml(price) : ""}</p>
          ${item.moderation_note ? `<p style="margin:6px 0 0;font-size:13px;color:#b91c1c"><strong>Бележка:</strong> ${escHtml(item.moderation_note)}</p>` : ""}
          ${draftNotice}
          <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
            <a href="obqva.html?id=${escHtml(item.id)}" style="padding:6px 14px;border:1px solid #d7deea;border-radius:8px;font-size:13px;font-weight:700;color:#26344d;text-decoration:none">Преглед</a>
            ${!isExpired && ["approved", "pending", "needs_changes", "rejected"].includes(item.status) ? `<a href="dobavi-obqva.html?edit=${escHtml(item.id)}" style="padding:6px 14px;border:1px solid #d7deea;border-radius:8px;font-size:13px;font-weight:700;color:#26344d;text-decoration:none">Редактирай</a>` : ""}
            ${isExpired ? `<button onclick="renewListing('${escHtml(item.id)}', this)" style="padding:6px 14px;border:1px solid #0b5fd7;border-radius:8px;font-size:13px;font-weight:700;color:#0b5fd7;background:#fff;cursor:pointer">Поднови</button>` : ""}
          </div>
        </article>`;
      }).join("")}`;
  }

  window.renewListing = async (id, btn) => {
    btn.disabled = true;
    btn.textContent = "Изпращане…";
    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + 60);
    const { error } = await client.from("listings").update({
      status: "pending",
      expires_at: newExpiry.toISOString(),
      moderation_note: ""
    }).eq("id", id);
    if (error) {
      btn.textContent = "Грешка";
      btn.disabled = false;
    } else {
      btn.textContent = "Изпратена за преглед";
      btn.style.color = "#16a34a";
      btn.style.borderColor = "#16a34a";
    }
  };


  function setListingActionMessage(message, type = "info") {
    const messageEl = $("#listing-action-message");
    if (!messageEl) return;
    messageEl.textContent = message;
    messageEl.style.color = type === "error" ? "#b91c1c" : type === "success" ? "#166534" : "#59657a";
  }

  async function shareListing(item) {
    const url = window.location.href;
    const shareData = {
      title: item.title,
      text: `Обява в Попитай.Лом: ${item.title}`,
      url
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setListingActionMessage("Обявата е споделена.", "success");
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setListingActionMessage("Връзката е копирана.", "success");
        return;
      }

      window.prompt("Копирай връзката към обявата:", url);
    } catch (error) {
      if (error?.name !== "AbortError") {
        setListingActionMessage("Връзката не можа да бъде споделена.", "error");
      }
    }
  }

  function initListingDetailActions(item, id) {
    const shareButton = $("#listing-share-btn");
    const reportButton = $("#listing-report-toggle");
    const reportForm = $("#listing-report-form");
    const cancelButton = $("#listing-report-cancel");
    const reasonInput = $("#listing-report-reason");
    const reasonError = $("#listing-report-reason-error");

    shareButton?.addEventListener("click", () => shareListing(item));

    reportButton?.addEventListener("click", async () => {
      const { data } = await client.auth.getUser();
      if (!data?.user) {
        const messageEl = $("#listing-action-message");
        if (messageEl) {
          messageEl.innerHTML = 'За да подадеш сигнал, <a href="vhod.html">влез в профила си</a>.';
          messageEl.style.color = "#59657a";
        }
        return;
      }

      const shouldOpen = reportForm.hidden;
      reportForm.hidden = !shouldOpen;
      reportButton.setAttribute("aria-expanded", String(shouldOpen));
      if (shouldOpen) reasonInput?.focus();
    });

    cancelButton?.addEventListener("click", () => {
      reportForm.hidden = true;
      reportButton?.setAttribute("aria-expanded", "false");
      if (reasonError) reasonError.textContent = "";
    });

    reasonInput?.addEventListener("input", () => {
      if (reasonError) reasonError.textContent = "";
    });

    reportForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const reason = reasonInput.value.trim();

      if (reason.length < 10) {
        reasonError.textContent = "Опиши причината с поне 10 знака.";
        reasonInput.focus();
        return;
      }

      const submitButton = reportForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = "Изпращане…";
      setListingActionMessage("");

      const { data: authData } = await client.auth.getUser();
      if (!authData?.user) {
        setListingActionMessage("Сесията е изтекла. Влез отново и опитай пак.", "error");
        submitButton.disabled = false;
        submitButton.textContent = "Изпрати сигнала";
        return;
      }

      const { error } = await client.from("reports").insert({
        reporter_id: authData.user.id,
        target_type: "listing",
        target_id: id,
        reason
      });

      if (error) {
        setListingActionMessage("Сигналът не беше изпратен. Провери профила си и опитай отново.", "error");
        submitButton.disabled = false;
        submitButton.textContent = "Изпрати сигнала";
        return;
      }

      reportForm.hidden = true;
      reportButton.disabled = true;
      reportButton.textContent = "Сигналът е изпратен";
      reportButton.setAttribute("aria-expanded", "false");
      setListingActionMessage("Благодарим. Сигналът е изпратен за преглед.", "success");
    });
  }

  async function loadSimilarListings(item, id) {
    const section = $("#similar-listings");
    const list = $("#similar-listings-list");
    if (!section || !list || item.status !== "approved" || !item.category) return;

    const { data, error } = await client.from("listings")
      .select("id, owner_id, title, category, subcategory, listing_type, price, price_negotiable, price_free, price_old, currency, city, is_urgent, is_highlighted, is_reduced, is_boosted, is_owner_admin, created_at")
      .eq("status", "approved")
      .eq("category", item.category)
      .neq("id", id)
      .or("expires_at.is.null,expires_at.gt." + new Date().toISOString())
      .order("is_owner_admin", { ascending: false })
      .order("is_boosted", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(3);

    if (error || !data?.length) return;

    let listings = data;
    try {
      listings = await attachListingMedia(data);
    } catch (_) {
      listings = data;
    }

    list.innerHTML = listings.map((similarItem) => {
      const approvedCover = similarItem._media?.find((media) => media.status === "approved");
      return listingCard(similarItem, approvedCover?.storage_path ? publicUrl(approvedCover.storage_path) : "");
    }).join("");
    section.hidden = false;
  }

  async function loadListingDetail() {
    const container = $("#listing-detail");
    if (!container) return;

    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) { container.innerHTML = '<article class="empty-card"><p>Обявата не е намерена.</p></article>'; return; }

    const { data: item, error } = await client.from("listings")
      .select("id, owner_id, title, category, subcategory, listing_type, description, price, price_negotiable, price_free, price_old, currency, phone, city, street, status, is_urgent, is_highlighted, is_reduced, is_owner_admin, show_stats, view_count, created_at, expires_at, show_contact_buttons")
      .eq("id", id)
      .maybeSingle();

    if (error || !item) {
      container.innerHTML = '<article class="empty-card"><p>Обявата не е намерена или е изтекла.</p></article>';
      return;
    }

    let listingMedia = [];
    try {
      const [itemWithMedia] = await attachListingMedia([item]);
      listingMedia = itemWithMedia?._media || [];
    } catch (_) {
      listingMedia = [];
    }

    // Увеличаваме брояча само за публикувани обяви
    if (item.status === "approved") {
      client.rpc("increment_listing_views", { p_id: id });
    }

    const price = formatPrice(item);
    const badges = [
      item.is_urgent ? '<span class="listing-badge urgent">Спешно</span>' : "",
      item.is_reduced && item.price_old ? '<span class="listing-badge reduced">Намалено</span>' : ""
    ].filter(Boolean).join("");

    const days = item.expires_at ? daysLeft(item.expires_at) : null;
    const gallery = listingMedia.length
      ? `<section aria-label="Снимки към обявата" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin:18px 0 24px">
          ${listingMedia.map((media, index) => {
            const url = publicUrl(media.storage_path);
            return `<a href="${escHtml(url)}" target="_blank" rel="noopener" style="display:block;aspect-ratio:4/3;border-radius:12px;overflow:hidden;background:#eef2f7;border:1px solid #d7deea">
              <img src="${escHtml(url)}" alt="${escHtml(item.title)} – снимка ${index + 1}" loading="${index === 0 ? "eager" : "lazy"}" style="width:100%;height:100%;object-fit:cover;display:block">
            </a>`;
          }).join("")}
        </section>`
      : "";

    const previewNotice = item.status !== "approved"
      ? `<p style="margin:0 0 14px;padding:10px 12px;border-radius:10px;background:#fff3cd;border:1px solid #efd37b;color:#6b4b00;font-weight:800">Административен преглед: ${item.status === "pending" ? "чака одобрение" : item.status === "needs_changes" ? "върната за корекция" : "скрита/отказана"}.</p>`
      : "";

    container.innerHTML = `
      <article>
        <div style="margin-bottom:12px">
          <a href="obyavi.html" style="color:#59657a;font-size:13px">← Назад към обявите</a>
        </div>
        ${previewNotice}
        ${badges}
        <span class="listing-type-badge">${escHtml(item.listing_type || "")}</span>
        <h1 style="margin:8px 0 4px;font-size:24px">${escHtml(item.title)}</h1>
        <p style="margin:0 0 8px;color:#59657a;font-size:14px">${escHtml(item.category)}${item.subcategory ? " › " + escHtml(item.subcategory) : ""}</p>
        ${price ? `<p style="font-size:20px;font-weight:900;margin:0 0 12px">${item.price_old && item.is_reduced ? `<s style="color:#9aa3b0;font-weight:400;font-size:15px">${Number(item.price_old).toLocaleString("bg-BG")} евро</s> ` : ""}${escHtml(price)}</p>` : ""}
        <p style="margin:0 0 16px;color:#59657a;font-size:13px">${formatDate(item.created_at)}${item.city ? " · " + escHtml(item.city) : ""}${item.street ? ", " + escHtml(item.street) : ""}${days !== null ? " · Изтича след " + days + " дни" : ""}${item.show_stats && item.view_count ? " · 👁 " + item.view_count + " прегледа" : ""}</p>
        ${gallery}
        <div style="white-space:pre-wrap;line-height:1.7;margin-bottom:24px">${escHtml(item.description)}</div>
        ${item.status === "approved" ? `
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin:0 0 12px">
            <button id="listing-share-btn" type="button" style="padding:9px 16px;border:1px solid #0b5fd7;border-radius:9px;background:#fff;color:#0b5fd7;font-weight:800;cursor:pointer">Сподели</button>
            <button id="listing-report-toggle" type="button" aria-expanded="false" aria-controls="listing-report-form" style="padding:9px 16px;border:1px solid #d7deea;border-radius:9px;background:#fff;color:#26344d;font-weight:800;cursor:pointer">Подай сигнал</button>
          </div>
          <p id="listing-action-message" role="status" aria-live="polite" style="min-height:20px;margin:0 0 10px;font-size:14px"></p>
          <form id="listing-report-form" hidden novalidate style="margin:0 0 24px;padding:16px;border:1px solid #d7deea;border-radius:12px;background:#f8fafc">
            <label for="listing-report-reason" style="display:block;margin-bottom:7px;font-weight:800">Причина за сигнала</label>
            <textarea id="listing-report-reason" name="reason" minlength="10" maxlength="1000" required placeholder="Опиши накратко проблема с обявата." style="width:100%;min-height:110px;padding:10px 12px;border:1px solid #cbd5e1;border-radius:9px;resize:vertical;font:inherit"></textarea>
            <p id="listing-report-reason-error" class="field-error" role="alert" style="margin:6px 0 0"></p>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
              <button type="submit" class="primary-link-button" style="cursor:pointer">Изпрати сигнала</button>
              <button id="listing-report-cancel" type="button" style="padding:9px 16px;border:1px solid #d7deea;border-radius:9px;background:#fff;color:#26344d;font-weight:800;cursor:pointer">Отказ</button>
            </div>
          </form>` : ""}
        <a href="obyavi.html" style="color:#0b5fd7;font-size:14px">← Всички обяви</a>
      </article>
      <section id="similar-listings" hidden aria-labelledby="similar-listings-title" style="margin-top:36px">
        <h2 id="similar-listings-title" style="margin:0 0 16px">Подобни обяви</h2>
        <div id="similar-listings-list" class="listings-grid"></div>
      </section>`;

    if (item.status === "approved") {
      initListingDetailActions(item, id);
      loadSimilarListings(item, id);
    }

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
