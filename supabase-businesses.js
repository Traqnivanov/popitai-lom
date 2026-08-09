// Попитай.Лом — фирмени профили и изображения чрез Supabase
(() => {
  const client = window.PopitaiSupabase;
  if (!client) return;

  const BUCKET = "business-media";
  const IMAGE_DB = "popitaiMediaDB";
  const IMAGE_STORE = "media";
  const $ = (selector, root = document) => root.querySelector(selector);
  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const statusLabels = {
    pending: "Чака преглед",
    approved: "Публикувана",
    rejected: "Отказана/скрита",
    needs_changes: "Нужна е корекция"
  };

  function setMessage(text, type = "warning") {
    const element = $("#company-message");
    if (!element) return;
    element.textContent = text;
    element.classList.remove("is-error", "is-success", "is-warning");
    element.classList.add(`is-${type}`);
  }

  function humanError(error, fallback) {
    const message = String(error?.message || "").toLowerCase();
    if (!navigator.onLine || message.includes("failed to fetch") || message.includes("network")) {
      return "Няма връзка със системата. Провери интернет връзката и опитай отново.";
    }
    if (message.includes("row-level security") || message.includes("permission denied") || message.includes("not authorized")) {
      return "Нямаш разрешение за това действие. Провери дали си влязъл в профила си.";
    }
    if (message.includes("bucket not found")) {
      return "Хранилището за снимки не е намерено.";
    }
    return fallback;
  }

  function initials(name) {
    return String(name || "Ф")
      .trim()
      .charAt(0)
      .toUpperCase() || "Ф";
  }

  const LOGO_COLORS = [
    { bg: "#e8f0fe", color: "#1967d2" },
    { bg: "#fce8e6", color: "#c5221f" },
    { bg: "#e6f4ea", color: "#137333" },
    { bg: "#fef7e0", color: "#b06000" },
    { bg: "#f3e8fd", color: "#7b1fa2" },
    { bg: "#e8f5e9", color: "#2e7d32" },
    { bg: "#fff3e0", color: "#e65100" },
    { bg: "#e3f2fd", color: "#1565c0" },
  ];

  function logoColor(name) {
    const code = String(name || "").charCodeAt(0) || 0;
    return LOGO_COLORS[code % LOGO_COLORS.length];
  }

  function showImageUploaders() {
    [$("#company-logo-uploader"), $("#company-gallery-uploader")]
      .filter(Boolean)
      .forEach((element) => { element.hidden = false; });
    $("#company-images-notice")?.remove();
  }

  function openImageDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(IMAGE_DB, 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Снимката не може да бъде прочетена."));
    });
  }

  async function getPreparedImage(key) {
    const database = await openImageDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(IMAGE_STORE, "readonly");
      const request = transaction.objectStore(IMAGE_STORE).get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error("Снимката не може да бъде прочетена."));
      transaction.oncomplete = () => database.close();
    });
  }

  function preferredVariant(item) {
    if (item.role === "logo") {
      return item.variants?.medium || item.variants?.thumb || item.variants?.large || null;
    }
    return item.variants?.large || item.variants?.medium || item.variants?.thumb || null;
  }

  function fileExtension(mime) {
    if (mime === "image/png") return "png";
    if (mime === "image/jpeg") return "jpg";
    return "webp";
  }

  async function uploadPreparedImages(userId, businessId, items) {
    if (!items.length) return;

    const uploadedPaths = [];
    const mediaRows = [];

    try {
      for (const item of items) {
        const variant = preferredVariant(item);
        if (!variant?.key) continue;

        const prepared = await getPreparedImage(variant.key);
        if (!prepared?.blob) throw new Error("Обработената снимка липсва.");

        const role = item.role === "logo" ? "logo" : "gallery";
        const mime = prepared.mime || variant.mime || prepared.blob.type || "image/webp";
        const path = `${userId}/${businessId}/${role}/${item.id}.${fileExtension(mime)}`;

        const { error: uploadError } = await client.storage
          .from(BUCKET)
          .upload(path, prepared.blob, {
            cacheControl: "3600",
            contentType: mime,
            upsert: false
          });

        if (uploadError) throw uploadError;
        uploadedPaths.push(path);
        mediaRows.push({
          owner_id: userId,
          entity_type: "business",
          entity_id: businessId,
          storage_path: path,
          mime_type: mime,
          size_bytes: prepared.blob.size,
          status: "pending"
        });
      }

      if (mediaRows.length) {
        const { error: mediaError } = await client.from("media").insert(mediaRows);
        if (mediaError) throw mediaError;
      }
    } catch (error) {
      if (uploadedPaths.length) {
        await client.storage.from(BUCKET).remove(uploadedPaths);
      }
      throw error;
    }
  }

  function publicMediaUrl(path) {
    if (!path) return "";
    const { data } = client.storage.from(BUCKET).getPublicUrl(path);
    return data?.publicUrl || "";
  }

  function mediaRole(path) {
    if (String(path).includes("/logo/")) return "logo";
    if (String(path).includes("/gallery/")) return "gallery";
    return "other";
  }

  async function collectFormImages(businessId) {
    if (!window.PopitaiImages?.commit) return [];
    const [logos, gallery] = await Promise.all([
      window.PopitaiImages.commit("company-logo-uploader", "business", businessId),
      window.PopitaiImages.commit("company-gallery-uploader", "business", businessId)
    ]);
    return [...logos, ...gallery];
  }

  async function checkIsAdmin(userId) {
    const { data, error } = await client
      .from("profiles")
      .select("role, is_blocked")
      .eq("id", userId)
      .maybeSingle();
    if (error || !data) return false;
    return data.role === "admin" && data.is_blocked !== true;
  }

  function expandedSectionsValues() {
    return {
      short_intro: $("#expanded-short-intro")?.value.trim() || "",
      website: $("#expanded-website")?.value.trim() || "",
      services: ($("#expanded-services")?.value || "").split(/\r?\n/).map(v => v.trim()).filter(Boolean),
      service_area: $("#expanded-service-area")?.value.trim() || "",
      work_hours: $("#expanded-work-hours")?.value.trim() || "",
      show_short_intro: $("#expanded-show-short-intro")?.checked || false,
      show_website: $("#expanded-show-website")?.checked || false,
      show_services: $("#expanded-show-services")?.checked || false,
      show_service_area: $("#expanded-show-service-area")?.checked || false,
      show_work_hours: $("#expanded-show-work-hours")?.checked || false,
    };
  }

  async function initCompanyForm() {
    const form = $("#company-form");
    if (!form) return;

    showImageUploaders();

    // Проверка за admin при зареждане — показва разширените секции
    const { data: sessionData } = await client.auth.getUser();
    const sessionUser = sessionData?.user || null;
    let formIsAdmin = false;
    if (sessionUser) {
      formIsAdmin = await checkIsAdmin(sessionUser.id);
      if (formIsAdmin) {
        const expandedSections = $("#admin-expanded-sections");
        if (expandedSections) expandedSections.hidden = false;
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) submitBtn.textContent = "Публикувай фирмата";
      }
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();

      const button = form.querySelector('[type="submit"]');
      button.disabled = true;
      setMessage("Записваме фирмата…", "warning");

      const { data: authData, error: authError } = await client.auth.getUser();
      const user = authError ? null : authData?.user || null;
      if (!user) {
        setMessage("Трябва да влезеш в профила си, преди да добавиш фирма.", "error");
        button.disabled = false;
        return;
      }

      const name = $("#company-name")?.value.trim() || "";
      const category = $("#company-category")?.value || "";
      const phone = $("#company-phone")?.value.trim() || "";
      const city = $("#company-city")?.value.trim() || "";
      const address = $("#company-address")?.value.trim() || "";
      const working_hours = $("#company-working-hours")?.value.trim() || "";
      const description = $("#company-description")?.value.trim() || "";

      if (name.length < 2 || name.length > 120) {
        setMessage("Името на фирмата трябва да е между 2 и 120 знака.", "error");
        button.disabled = false;
        return;
      }
      if (!category) {
        setMessage("Избери категория.", "error");
        button.disabled = false;
        return;
      }
      if (description.length < 20) {
        setMessage("Описанието трябва да съдържа поне 20 знака.", "error");
        button.disabled = false;
        return;
      }

      const isAdmin = await checkIsAdmin(user.id);

      const { data: business, error } = await client.from("businesses").insert({
        owner_id: user.id,
        name,
        category,
        phone,
        city,
        address,
        working_hours,
        description,
        status: isAdmin ? "approved" : "pending",
        is_expanded: isAdmin ? true : false
      }).select("id").single();

      if (error || !business) {
        setMessage(humanError(error, "Фирмата не беше изпратена. Провери данните и опитай отново."), "error");
        button.disabled = false;
        return;
      }

      // За admin — запис на разширения профил
      if (isAdmin) {
        const exp = expandedSectionsValues();
        await client.rpc("save_staff_owned_business_expanded_profile", {
          p_business_id: business.id,
          p_short_intro: exp.short_intro,
          p_website: exp.website,
          p_services: exp.services,
          p_service_area: exp.service_area,
          p_work_hours: exp.work_hours,
          p_show_short_intro: exp.show_short_intro,
          p_show_website: exp.show_website,
          p_show_services: exp.show_services,
          p_show_service_area: exp.show_service_area,
          p_show_gallery: true,
          p_show_work_hours: exp.show_work_hours
        });
      }

      try {
        setMessage("Фирмата е записана. Качваме логото и снимките…", "warning");
        const images = await collectFormImages(business.id);
        await uploadPreparedImages(user.id, business.id, images);
        form.reset();
        if (isAdmin) {
          setMessage("Готово. Фирмата е публикувана.", "success");
        } else {
          setMessage("Готово. Фирмата и снимките са изпратени и чакат одобрение от администратор.", "success");
        }
      } catch (imageError) {
        setMessage(
          humanError(imageError, "Фирмата е изпратена, но снимките не се качиха. Не изпращай фирмата повторно."),
          "error"
        );
      }

      button.disabled = false;
    }, true);
  }

  function businessCard(item, logoUrl = "") {
    const logo = logoUrl
      ? `<img src="${escapeHtml(logoUrl)}" alt="Лого на ${escapeHtml(item.name)}" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">`
      : escapeHtml(initials(item.name));
    const lc = logoColor(item.name);
    const logoStyle = logoUrl ? "" : `background:${lc.bg};color:${lc.color}`;

    return `<article class="business-list-card" data-business-id="${escapeHtml(item.id)}">
      <div class="firm-logo" style="${logoStyle}">${logo}</div>
      <div class="business-main">
        <div class="firm-title-row"><h2><a href="firma.html?id=${encodeURIComponent(item.id)}">${escapeHtml(item.name)}</a></h2></div>
        <span class="question-category">${escapeHtml(item.category)}</span>
        <p>${escapeHtml(item.description)}</p>
        ${item.phone ? `<p><strong>Телефон:</strong> ${escapeHtml(item.phone)}</p>` : ""}
      </div>
    </article>`;
  }

  async function loadApprovedBusinesses() {
    const containers = [
      { element: $("#businesses-list"), limit: null },
      { element: $("#home-businesses"), limit: 3 }
    ].filter(({ element }) => element);
    if (!containers.length) return;

    try { localStorage.removeItem("popitaiBusinesses"); } catch (_) {}

    const { data, error } = await client
      .from("businesses")
      .select("id, owner_id, name, category, description, phone, status, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      const message = `<article class="empty-card empty-card-wide"><h2>Фирмите не могат да се заредят</h2><p>${escapeHtml(humanError(error, "Опитай отново след малко."))}</p></article>`;
      containers.forEach(({ element }) => { element.innerHTML = message; });
      return;
    }

    const OWNER_ID = "598d6626-25ed-450f-87a9-e83f34f641c4";

    const businesses = data || [];
    // Фирмите на собственика винаги са на първите позиции
    const owned = businesses.filter(b => b.owner_id === OWNER_ID);
    const others = businesses.filter(b => b.owner_id !== OWNER_ID);
    const sorted = [...owned, ...others];
    if (!sorted.length) {
      const message = '<article class="empty-card empty-card-wide"><h2>Все още няма одобрени фирми</h2><p>Новите профили се показват след преглед от администратор.</p><a class="primary-link-button" href="dobavi-firma.html">Добави първата фирма</a></article>';
      containers.forEach(({ element }) => { element.innerHTML = message; });
      return;
    }

    const ids = sorted.map((item) => item.id);
    const { data: media } = await client
      .from("media")
      .select("entity_id, storage_path, created_at")
      .eq("entity_type", "business")
      .eq("status", "approved")
      .in("entity_id", ids)
      .order("created_at", { ascending: true });

    const logoByBusiness = new Map();
    (media || []).forEach((item) => {
      if (mediaRole(item.storage_path) === "logo" && !logoByBusiness.has(item.entity_id)) {
        logoByBusiness.set(item.entity_id, publicMediaUrl(item.storage_path));
      }
    });

    containers.forEach(({ element, limit }) => {
      const visibleBusinesses = limit ? sorted.slice(0, limit) : sorted;
      element.innerHTML = visibleBusinesses
        .map((item) => businessCard(item, logoByBusiness.get(item.id) || ""))
        .join("");
    });
  }

  function renderBusinessMedia(item, rows) {
    const logoRow = rows.find((row) => mediaRole(row.storage_path) === "logo");
    const galleryRows = rows.filter((row) => mediaRole(row.storage_path) === "gallery");

    const fallbackLogo = $("#business-detail-logo");
    const logoContainer = $("#business-detail-logo-image");
    if (logoRow && logoContainer) {
      const url = publicMediaUrl(logoRow.storage_path);
      logoContainer.innerHTML = `<img src="${escapeHtml(url)}" alt="Лого на ${escapeHtml(item.name)}" decoding="async" style="width:100%;height:100%;object-fit:cover;border-radius:inherit">`;
      logoContainer.hidden = false;
      if (fallbackLogo) fallbackLogo.hidden = true;
    }

    const gallery = $("#business-gallery");
    if (!gallery) return;
    if (!galleryRows.length) {
      gallery.hidden = true;
      gallery.innerHTML = "";
      return;
    }

    const galleryItems = galleryRows.map((row, index) => ({
      url: publicMediaUrl(row.storage_path),
      alt: `Снимка на ${item.name} ${index + 1}`
    }));

    if (window.PopitaiImages?.renderRemoteGallery) {
      window.PopitaiImages.renderRemoteGallery(gallery, galleryItems, { altPrefix: item.name });
      return;
    }

    gallery.innerHTML = galleryItems.map((image, index) => `
      <span class="media-gallery-item${index === 0 ? " is-featured" : ""}">
        <img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.alt)}" loading="lazy" decoding="async">
      </span>`).join("");
    gallery.hidden = false;
  }

  async function loadBusinessDetail() {
    const nameElement = $("#business-detail-name");
    if (!nameElement) return;

    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) return;

    const { data: item, error } = await client
      .from("businesses")
      .select("id, owner_id, name, category, description, phone, city, address, working_hours, status, moderation_note, created_at")
      .eq("id", id)
      .maybeSingle();

    const card = $("#business-detail-card");
    const notFound = $("#business-not-found");
    const contactPanel = $("#business-contact-panel");

    if (error || !item) {
      nameElement.textContent = "Фирмата не е намерена";
      if (card) card.hidden = true;
      if (contactPanel) contactPanel.hidden = true;
      if (notFound) notFound.hidden = false;
      return;
    }

    document.title = `${item.name} | Попитай.Лом`;
    nameElement.textContent = item.name;
    if ($("#business-detail-summary")) $("#business-detail-summary").textContent = item.description;

    // Лого с динамичен цвят
    const logoEl = $("#business-detail-logo");
    if (logoEl) {
      logoEl.textContent = initials(item.name);
      const lc = logoColor(item.name);
      logoEl.style.background = lc.bg;
      logoEl.style.color = lc.color;
    }

    // Категория таг
    const catTag = $("#business-detail-category-tag");
    if (catTag && item.category) {
      catTag.textContent = item.category;
      catTag.hidden = false;
    }

    if ($("#business-detail-description")) $("#business-detail-description").textContent = item.description;

    // Бутони
    const actionButtons = $("#business-action-buttons");
    if (actionButtons) {
      actionButtons.innerHTML = "";
      if (item.phone) {
        const callBtn = document.createElement("a");
        callBtn.href = `tel:${item.phone.replace(/\s+/g, "")}`;
        callBtn.className = "expanded-action-primary";
        callBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="width:17px;height:17px;flex-shrink:0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.64 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.55 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg><span>Обади се</span>`;
        actionButtons.append(callBtn);

        const viberBtn = document.createElement("a");
        viberBtn.href = `viber://chat?number=359${item.phone.replace(/^0/, "").replace(/\s+/g, "")}`;
        viberBtn.className = "expanded-action-secondary";
        viberBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" style="width:17px;height:17px;flex-shrink:0"><path d="M12.013 2C7.313 2 3.013 5.8 3.013 10.8c0 2.8 1.3 5.3 3.4 7l-.4 3.1 3.1-1c.9.3 1.9.5 2.9.5 4.7 0 9-3.8 9-8.8S16.713 2 12.013 2zm2.8 12.1c-.3.8-1.5 1.5-2.1 1.5-.1 0-.3 0-.4-.1-.4-.1-1-.4-2.5-1.8-1.3-1.2-2.1-2.6-2.3-3.1-.2-.4-.1-.7.1-.9l.6-.7c.2-.2.2-.4.1-.6l-.9-2.1c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.7.7-.9 1.6-.5 2.6.8 2.2 2.3 4.1 4.2 5.4 1 .7 2.4 1.4 3.4 1.4.4 0 1.2-.1 1.8-.8.3-.3.4-.7.3-1z"/></svg><span>Запитване</span>`;
        actionButtons.append(viberBtn);
      }
    }

    // Контакти вдясно
    const phone = $("#business-detail-phone");
    if (phone) {
      phone.textContent = item.phone || "Не е посочен";
      phone.href = item.phone ? `tel:${item.phone.replace(/\s+/g, "")}` : "#";
    }

    const cityRow = $("#business-detail-city-row");
    const cityEl = $("#business-detail-city");
    if (cityRow && cityEl && item.city) {
      cityEl.textContent = item.city;
      cityRow.hidden = false;
    }

    const addressRow = $("#business-detail-address-row");
    const addressEl = $("#business-detail-address");
    if (addressRow && addressEl && item.address) {
      addressEl.textContent = item.address;
      addressRow.hidden = false;
    }

    const hoursRow = $("#business-detail-hours-row");
    const hoursEl = $("#business-detail-hours");
    if (hoursRow && hoursEl && item.working_hours) {
      hoursEl.textContent = item.working_hours;
      hoursRow.hidden = false;
    }

    const { data: mediaRows } = await client
      .from("media")
      .select("storage_path, created_at")
      .eq("entity_type", "business")
      .eq("entity_id", item.id)
      .order("created_at", { ascending: true });
    renderBusinessMedia(item, mediaRows || []);

    if (card) card.hidden = false;
    if (contactPanel) contactPanel.hidden = false;
    if (notFound) notFound.hidden = true;
  }

  function init() {
    initCompanyForm();
    loadApprovedBusinesses();
    loadBusinessDetail();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
