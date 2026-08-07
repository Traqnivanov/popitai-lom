// Попитай.Лом — редактиране и повторно изпращане на върната фирма
(() => {
  "use strict";

  const businessId = new URLSearchParams(window.location.search).get("edit");
  if (!businessId) return;

  const client = window.PopitaiSupabase;
  const form = document.querySelector("#company-form");
  if (!client || !form) return;

  const BUCKET = "business-media";
  const IMAGE_DB = "popitaiMediaDB";
  const IMAGE_STORE = "media";
  const fields = {
    name: document.querySelector("#company-name"),
    category: document.querySelector("#company-category"),
    phone: document.querySelector("#company-phone"),
    description: document.querySelector("#company-description")
  };
  const button = form.querySelector('[type="submit"]');
  const message = document.querySelector("#company-message");

  let currentUser = null;
  let currentProfile = null;
  let currentBusiness = null;
  let mediaRows = [];
  const removedMediaIds = new Set();

  form.dataset.businessEditMode = "true";
  document.body.classList.add("business-edit-mode");

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const style = document.createElement("style");
  style.textContent = `
    .business-edit-media { margin: 24px 0 18px; }
    .business-edit-media[hidden] { display: none !important; }
    .business-edit-media h2 { margin: 0 0 12px; font-size: 20px; }
    .business-edit-media-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 12px;
    }
    .business-edit-media-item {
      position: relative;
      overflow: hidden;
      margin: 0;
      aspect-ratio: 4 / 3;
      background: #eef2f7;
      border: 1px solid #d7deea;
      border-radius: 12px;
    }
    .business-edit-media-item[data-role="logo"] { aspect-ratio: 1 / 1; }
    .business-edit-media-item img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .business-edit-media-item.is-removed img { opacity: .28; }
    .business-edit-media-item.is-removed::after {
      content: "Ще бъде премахната";
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      padding: 12px;
      color: #7a1f1a;
      background: rgba(255,255,255,.72);
      text-align: center;
      font-weight: 900;
    }
    .business-edit-media-label {
      position: absolute;
      left: 7px;
      bottom: 7px;
      z-index: 2;
      padding: 4px 7px;
      color: #fff;
      background: rgba(17, 24, 39, 0.78);
      border-radius: 999px;
      font-size: 12px;
      font-weight: 800;
    }
    .business-edit-media-remove {
      position: absolute;
      top: 7px;
      right: 7px;
      z-index: 3;
      min-height: 34px;
      padding: 6px 9px;
      color: #fff;
      background: rgba(122, 31, 26, .92);
      border: 0;
      border-radius: 9px;
      font-weight: 900;
      cursor: pointer;
    }
    .business-edit-media-item.is-removed .business-edit-media-remove {
      color: #172033;
      background: #fff;
      border: 1px solid #aeb7c5;
    }
    .business-edit-media-error { margin: 0; color: #b42318; font-weight: 700; }
    .business-edit-add-heading { margin: 22px 0 8px; font-size: 20px; }
  `;
  document.head.appendChild(style);

  function setMessage(text, type = "warning") {
    if (!message) return;
    message.textContent = text;
    message.classList.remove("is-error", "is-success", "is-warning");
    if (text) message.classList.add(`is-${type}`);
  }

  function editErrorText(error) {
    const text = String(error?.message || "").toLowerCase();
    if (!navigator.onLine || text.includes("failed to fetch") || text.includes("network")) {
      return "Няма връзка със системата. Провери интернет връзката и опитай отново.";
    }
    if (text.includes("function public.resubmit_own_business") || error?.code === "PGRST202") {
      return "Повторното изпращане още не е активирано в системата.";
    }
    if (text.includes("row-level security") || text.includes("permission denied") || error?.code === "42501") {
      return "Нямаш разрешение да изпратиш тази корекция.";
    }
    if (error?.code === "23514" || error?.code === "22023") {
      return error?.message || "Едно от полетата не отговаря на правилата.";
    }
    return "Корекциите не бяха изпратени. Опитай отново.";
  }

  function ensureMediaSection() {
    let section = document.querySelector("#business-edit-media");
    if (section || !button) return section;

    section = document.createElement("section");
    section.id = "business-edit-media";
    section.className = "business-edit-media";
    section.hidden = true;
    section.innerHTML = `
      <h2>Текущи снимки</h2>
      <div class="business-edit-media-grid" data-business-edit-media-grid></div>
    `;
    const logoUploader = document.querySelector("#company-logo-uploader");
    (logoUploader || button).insertAdjacentElement("beforebegin", section);
    return section;
  }

  function setPageForEditing() {
    document.title = "Редактирай фирма | Попитай.Лом";
    const heroTitle = document.querySelector(".page-hero h1");
    const heroText = document.querySelector(".page-hero p");
    if (heroTitle) heroTitle.textContent = "Редактирай фирма";
    if (heroText) heroText.textContent = "Поправи данните и ги изпрати отново за преглед.";
    if (button) button.textContent = "Изпрати отново за преглед";

    const logoHeading = document.querySelector("#company-logo-uploader h2");
    const galleryHeading = document.querySelector("#company-gallery-uploader h2");
    if (logoHeading) logoHeading.textContent = "Смени логото (по желание)";
    if (galleryHeading) galleryHeading.textContent = "Добави нови снимки (по желание)";
    ensureMediaSection();
  }

  function publicMediaUrl(path) {
    if (!path) return "";
    const { data } = client.storage.from(BUCKET).getPublicUrl(path);
    return data?.publicUrl || "";
  }

  function mediaRole(path) {
    return String(path).includes("/logo/") ? "logo" : "gallery";
  }

  function renderBusinessMedia() {
    const section = ensureMediaSection();
    const grid = section?.querySelector("[data-business-edit-media-grid]");
    if (!section || !grid || !currentBusiness) return;

    if (!mediaRows.length) {
      section.hidden = true;
      grid.innerHTML = "";
      return;
    }

    let galleryIndex = 0;
    const rows = [...mediaRows].sort((a, b) => {
      return Number(mediaRole(a.storage_path) !== "logo") - Number(mediaRole(b.storage_path) !== "logo");
    });

    grid.innerHTML = rows.map((row) => {
      const role = mediaRole(row.storage_path);
      if (role === "gallery") galleryIndex += 1;
      const url = publicMediaUrl(row.storage_path);
      const alt = role === "logo"
        ? `Лого на ${currentBusiness.name}`
        : `Снимка на ${currentBusiness.name} ${galleryIndex}`;
      const removed = removedMediaIds.has(row.id);

      return `<figure class="business-edit-media-item${removed ? " is-removed" : ""}" data-role="${role}" data-media-id="${escapeHtml(row.id)}">
        <img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async">
        ${role === "logo" ? '<span class="business-edit-media-label">Лого</span>' : ""}
        <button class="business-edit-media-remove" type="button" data-remove-media="${escapeHtml(row.id)}">${removed ? "Отмени" : "Премахни"}</button>
      </figure>`;
    }).join("");
    section.hidden = false;
  }

  async function loadBusinessMedia() {
    const section = ensureMediaSection();
    const grid = section?.querySelector("[data-business-edit-media-grid]");
    if (!section || !grid || !currentBusiness) return;

    const { data, error } = await client
      .from("media")
      .select("id, owner_id, storage_path, created_at")
      .eq("entity_type", "business")
      .eq("entity_id", currentBusiness.id)
      .order("created_at", { ascending: true });

    if (error) {
      section.hidden = false;
      grid.innerHTML = '<p class="business-edit-media-error">Снимките не могат да се заредят.</p>';
      return;
    }

    mediaRows = data || [];
    renderBusinessMedia();
  }

  document.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove-media]");
    if (!removeButton) return;
    const mediaId = removeButton.dataset.removeMedia;
    if (!mediaId) return;

    if (removedMediaIds.has(mediaId)) removedMediaIds.delete(mediaId);
    else removedMediaIds.add(mediaId);
    renderBusinessMedia();
  });

  function refreshFieldUi() {
    Object.values(fields).forEach((field) => {
      if (!field) return;
      const eventName = field.tagName === "SELECT" ? "change" : "input";
      field.dispatchEvent(new Event(eventName, { bubbles: true }));
    });
  }

  function validateFields() {
    Object.values(fields).forEach((field) => field?.dispatchEvent(new Event("blur")));
    const firstInvalid = form.querySelector(".is-invalid");
    if (firstInvalid) {
      firstInvalid.focus();
      return false;
    }

    const name = fields.name?.value.trim() || "";
    const category = fields.category?.value || "";
    const phone = fields.phone?.value.trim() || "";
    const description = fields.description?.value.trim() || "";
    if (name.length < 2 || name.length > 120 || !category || !phone || description.length < 20) {
      setMessage("Провери отбелязаните полета. Данните ти са запазени.", "error");
      return false;
    }
    return true;
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

  async function collectNewImages() {
    if (!window.PopitaiImages?.commit) return [];
    const [logos, gallery] = await Promise.all([
      window.PopitaiImages.commit("company-logo-uploader", "business", currentBusiness.id),
      window.PopitaiImages.commit("company-gallery-uploader", "business", currentBusiness.id)
    ]);
    return [...logos, ...gallery];
  }

  function enforceImageLimits(items) {
    if (currentProfile?.role === "admin") return "";

    const newLogos = items.filter((item) => item.role === "logo").length;
    const newGallery = items.filter((item) => item.role !== "logo").length;
    const keptLogos = newLogos > 0
      ? 0
      : mediaRows.filter((row) => mediaRole(row.storage_path) === "logo" && !removedMediaIds.has(row.id)).length;
    const keptGallery = mediaRows.filter((row) => mediaRole(row.storage_path) === "gallery" && !removedMediaIds.has(row.id)).length;

    if (newLogos + keptLogos > 1) return "За фирмения профил може да има само едно лого.";
    if (newGallery + keptGallery > 6) return "Фирменият профил може да има най-много 6 снимки.";
    return "";
  }

  async function uploadNewImages(items) {
    const uploadedPaths = [];
    const insertedIds = [];

    try {
      for (const item of items) {
        const variant = preferredVariant(item);
        if (!variant?.key) continue;
        const prepared = await getPreparedImage(variant.key);
        if (!prepared?.blob) throw new Error("Обработената снимка липсва.");

        const role = item.role === "logo" ? "logo" : "gallery";
        const mime = prepared.mime || variant.mime || prepared.blob.type || "image/webp";
        const path = `${currentUser.id}/${currentBusiness.id}/${role}/${item.id}.${fileExtension(mime)}`;
        const { error: uploadError } = await client.storage.from(BUCKET).upload(path, prepared.blob, {
          cacheControl: "3600",
          contentType: mime,
          upsert: false
        });
        if (uploadError) throw uploadError;
        uploadedPaths.push(path);

        const { data: media, error: mediaError } = await client.from("media").insert({
          owner_id: currentUser.id,
          entity_type: "business",
          entity_id: currentBusiness.id,
          storage_path: path,
          mime_type: mime,
          size_bytes: prepared.blob.size,
          status: "pending"
        }).select("id").single();
        if (mediaError || !media) throw mediaError || new Error("Снимката не беше записана.");
        insertedIds.push(media.id);
      }
      return { uploadedPaths, insertedIds };
    } catch (error) {
      if (insertedIds.length) await client.from("media").delete().in("id", insertedIds);
      if (uploadedPaths.length) await client.storage.from(BUCKET).remove(uploadedPaths);
      throw error;
    }
  }

  async function rollbackNewImages(uploaded) {
    if (!uploaded) return;
    if (uploaded.insertedIds.length) await client.from("media").delete().in("id", uploaded.insertedIds);
    if (uploaded.uploadedPaths.length) await client.storage.from(BUCKET).remove(uploaded.uploadedPaths);
  }

  async function removeSelectedMedia(newItems) {
    const ids = new Set(removedMediaIds);
    if (newItems.some((item) => item.role === "logo")) {
      mediaRows
        .filter((row) => mediaRole(row.storage_path) === "logo")
        .forEach((row) => ids.add(row.id));
    }

    for (const mediaId of ids) {
      const { data: path, error } = await client.rpc("delete_own_business_media", {
        p_media_id: mediaId
      });
      if (error) throw error;
      if (path) await client.storage.from(BUCKET).remove([path]);
    }
  }

  async function resubmitBusiness() {
    return client.rpc("resubmit_own_business", {
      p_business_id: currentBusiness.id,
      p_name: fields.name.value.trim(),
      p_category: fields.category.value,
      p_phone: fields.phone.value.trim(),
      p_description: fields.description.value.trim()
    });
  }

  function finishSuccess() {
    setMessage("Готово. Фирмата отново чака преглед.", "success");
    if (button) {
      button.textContent = "Изпратена";
      button.disabled = true;
    }
    window.setTimeout(() => { window.location.href = "profil.html"; }, 900);
  }

  async function loadBusiness() {
    setPageForEditing();
    if (button) button.disabled = true;
    setMessage("Зареждаме фирмата…", "warning");

    const { data: authData, error: authError } = await client.auth.getUser();
    currentUser = authError ? null : authData?.user || null;
    if (!currentUser) {
      setMessage("Влез в профила си, за да редактираш фирмата.", "error");
      return;
    }

    const [{ data, error }, { data: profile }] = await Promise.all([
      client
        .from("businesses")
        .select("id, owner_id, name, category, phone, description, status")
        .eq("id", businessId)
        .eq("owner_id", currentUser.id)
        .maybeSingle(),
      client
        .from("profiles")
        .select("role, is_blocked")
        .eq("id", currentUser.id)
        .maybeSingle()
    ]);
    currentProfile = profile || null;

    if (error || !data) {
      setMessage("Фирмата не може да се зареди.", "error");
      return;
    }
    if (currentProfile?.is_blocked) {
      setMessage("Профилът е ограничен и не може да изпраща корекции.", "error");
      return;
    }
    if (data.status === "pending") {
      setMessage("Фирмата вече е изпратена и чака преглед.", "success");
      window.setTimeout(() => { window.location.href = "profil.html"; }, 900);
      return;
    }
    if (data.status !== "needs_changes") {
      setMessage("Тази фирма не чака корекция.", "error");
      return;
    }

    currentBusiness = data;
    fields.name.value = data.name || "";
    fields.category.value = data.category || "";
    fields.phone.value = data.phone || "";
    fields.description.value = data.description || "";

    refreshFieldUi();
    window.setTimeout(refreshFieldUi, 300);
    await loadBusinessMedia();
    setMessage("");
    if (button) button.disabled = false;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (!currentUser || !currentBusiness) {
      setMessage("Фирмата още не е заредена.", "error");
      return;
    }
    if (!validateFields()) return;

    if (button) button.disabled = true;
    setMessage("Подготвяме корекциите…", "warning");

    let newItems = [];
    let uploaded = null;
    try {
      newItems = await collectNewImages();
      const limitError = enforceImageLimits(newItems);
      if (limitError) throw new Error(limitError);

      uploaded = await uploadNewImages(newItems);
      const { error } = await resubmitBusiness();
      if (error) throw error;
      await removeSelectedMedia(newItems);
      finishSuccess();
    } catch (error) {
      if (uploaded) await rollbackNewImages(uploaded);
      const exactMessage = String(error?.message || "");
      setMessage(exactMessage.startsWith("Фирменият профил") || exactMessage.startsWith("За фирмения профил")
        ? exactMessage
        : editErrorText(error), "error");
      if (button) button.disabled = false;
    }
  }, true);

  loadBusiness();
})();
