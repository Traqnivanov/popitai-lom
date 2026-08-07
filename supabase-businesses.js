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
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "Ф";
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

  async function initCompanyForm() {
    const form = $("#company-form");
    if (!form) return;

    showImageUploaders();

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();

      const button = form.querySelector('[type="submit"]');
      button.disabled = true;
      setMessage("Изпращаме фирмата за преглед…", "warning");

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

      const { data: business, error } = await client.from("businesses").insert({
        owner_id: user.id,
        name,
        category,
        phone,
        address: "",
        description,
        status: "pending"
      }).select("id").single();

      if (error || !business) {
        setMessage(humanError(error, "Фирмата не беше изпратена. Провери данните и опитай отново."), "error");
        button.disabled = false;
        return;
      }

      try {
        setMessage("Фирмата е записана. Качваме логото и снимките…", "warning");
        const images = await collectFormImages(business.id);
        await uploadPreparedImages(user.id, business.id, images);
        form.reset();
        setMessage("Готово. Фирмата и снимките са изпратени и чакат одобрение от администратор.", "success");
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

    return `<article class="business-list-card" data-business-id="${escapeHtml(item.id)}">
      <div class="firm-logo">${logo}</div>
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
      .select("id, name, category, description, phone, status, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      const message = `<article class="empty-card empty-card-wide"><h2>Фирмите не могат да се заредят</h2><p>${escapeHtml(humanError(error, "Опитай отново след малко."))}</p></article>`;
      containers.forEach(({ element }) => { element.innerHTML = message; });
      return;
    }

    const businesses = data || [];
    if (!businesses.length) {
      const message = '<article class="empty-card empty-card-wide"><h2>Все още няма одобрени фирми</h2><p>Новите профили се показват след преглед от администратор.</p><a class="primary-link-button" href="dobavi-firma.html">Добави първата фирма</a></article>';
      containers.forEach(({ element }) => { element.innerHTML = message; });
      return;
    }

    const ids = businesses.map((item) => item.id);
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
      const visibleBusinesses = limit ? businesses.slice(0, limit) : businesses;
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
      .select("id, owner_id, name, category, description, phone, address, status, moderation_note, created_at")
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
    if ($("#business-detail-logo")) $("#business-detail-logo").textContent = initials(item.name);
    if ($("#business-detail-category")) $("#business-detail-category").textContent = item.category;
    if ($("#business-detail-description")) $("#business-detail-description").textContent = item.description;

    const status = $("#business-detail-status");
    if (status) {
      status.textContent = statusLabels[item.status] || item.status;
      status.className = item.status === "approved" ? "approved-badge" : "pending-badge";
    }

    const phone = $("#business-detail-phone");
    if (phone) {
      phone.textContent = item.phone || "Не е посочен";
      phone.href = item.phone ? `tel:${item.phone.replace(/\s+/g, "")}` : "#";
    }

    const statusText = contactPanel?.querySelector("p:nth-of-type(2)");
    if (statusText) statusText.innerHTML = `<strong>Статус</strong><br>${escapeHtml(statusLabels[item.status] || item.status)}`;

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
