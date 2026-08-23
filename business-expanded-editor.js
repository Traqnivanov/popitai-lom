// Попитай.Лом — редактор за първия пакет на разширения фирмен профил
(() => {
  "use strict";

  const businessId = new URLSearchParams(window.location.search).get("id");
  const client = window.PopitaiSupabase;
  const form = document.querySelector("#expanded-profile-form");
  const state = document.querySelector("#expanded-editor-state");
  const note = document.querySelector("#expanded-editor-note");
  const businessName = document.querySelector("#expanded-editor-business-name");
  const submitButton = document.querySelector("#expanded-editor-submit");

  if (!client || !form || !state || !businessName || !submitButton) return;

  const controls = {
    shortIntro: document.querySelector("#expanded-short-intro"),
    website: document.querySelector("#expanded-website"),
    services: document.querySelector("#expanded-services"),
    serviceArea: document.querySelector("#expanded-service-area"),
    workHours: document.querySelector("#expanded-work-hours"),
    showShortIntro: document.querySelector("#expanded-show-short-intro"),
    showWebsite: document.querySelector("#expanded-show-website"),
    showServices: document.querySelector("#expanded-show-services"),
    showServiceArea: document.querySelector("#expanded-show-service-area"),
    showWorkHours: document.querySelector("#expanded-show-work-hours")
  };

  const basic = {
    name: document.querySelector("#exp-name"),
    category: document.querySelector("#exp-category"),
    phone: document.querySelector("#exp-phone"),
    city: document.querySelector("#exp-city"),
    address: document.querySelector("#exp-address"),
    description: document.querySelector("#exp-description")
  };

  const BUCKET = "business-media";
  const IMAGE_DB = "popitaiMediaDB";
  const IMAGE_STORE = "media";
  let mediaRows = [];
  const removedMediaIds = new Set();
  let currentUserRole = "user";
  let currentUserIsAdmin = false;
  let currentUserIsModerator = false;

  function publicMediaUrl(path) {
    if (!path) return "";
    const { data } = client.storage.from(BUCKET).getPublicUrl(path);
    return data?.publicUrl || "";
  }

  function mediaRole(path) {
    return String(path).includes("/logo/") ? "logo" : "gallery";
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  }

  function renderCurrentMedia() {
    const container = document.querySelector("#exp-media-current");
    if (!container || !mediaRows.length) return;

    let gi = 0;
    container.innerHTML = `
      <p style="margin:0 0 10px;font-weight:800">Текущи снимки</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:10px">
        ${mediaRows.map(row => {
          const role = mediaRole(row.storage_path);
          if (role === "gallery") gi++;
          const removed = removedMediaIds.has(row.id);
          const removeButton = currentUserIsModerator ? "" : `<button type="button" data-remove-media="${escapeHtml(row.id)}" style="position:absolute;top:6px;right:6px;padding:5px 8px;background:rgba(122,31,26,.9);color:#fff;border:0;border-radius:8px;font-weight:900;cursor:pointer">${removed?"Отмени":"Премахни"}</button>`;
          return `<figure style="position:relative;margin:0;aspect-ratio:${role==="logo"?"1/1":"4/3"};background:#eef2f7;border:1px solid #d7deea;border-radius:10px;overflow:hidden${removed?";opacity:.35":""}">
            <img src="${escapeHtml(publicMediaUrl(row.storage_path))}" style="width:100%;height:100%;object-fit:cover" loading="lazy">
            ${role==="logo"?'<span style="position:absolute;left:6px;bottom:6px;padding:3px 7px;background:rgba(17,24,39,.75);color:#fff;border-radius:999px;font-size:11px;font-weight:800">Лого</span>':""}
            ${removeButton}
          </figure>`;
        }).join("")}
      </div>`;

    container.querySelectorAll("[data-remove-media]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.removeMedia;
        if (removedMediaIds.has(id)) removedMediaIds.delete(id);
        else removedMediaIds.add(id);
        renderCurrentMedia();
      });
    });
  }

  async function loadCurrentMedia(bId) {
    const { data } = await client
      .from("media")
      .select("id, storage_path, created_at")
      .eq("entity_type", "business")
      .eq("entity_id", bId)
      .order("created_at", { ascending: true });
    mediaRows = data || [];
    renderCurrentMedia();
  }

  async function removeSelectedMedia(newItems) {
    const ids = new Set(removedMediaIds);
    if (newItems.some(i => i.role === "logo")) {
      mediaRows.filter(r => mediaRole(r.storage_path) === "logo").forEach(r => ids.add(r.id));
    }
    for (const mediaId of ids) {
      const { data: path, error } = await client.rpc("delete_own_business_media", { p_media_id: mediaId });
      if (error) throw error;
      if (path) await client.storage.from(BUCKET).remove([path]);
    }
  }

  function openImageDatabase() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(IMAGE_DB, 1);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function getPreparedImage(key) {
    const db = await openImageDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IMAGE_STORE, "readonly");
      const req = tx.objectStore(IMAGE_STORE).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
    });
  }

  function preferredVariant(item) {
    if (item.role === "logo") return item.variants?.medium || item.variants?.thumb || item.variants?.large || null;
    return item.variants?.large || item.variants?.medium || item.variants?.thumb || null;
  }

  function fileExtension(mime) {
    if (mime === "image/png") return "png";
    if (mime === "image/jpeg") return "jpg";
    return "webp";
  }

  async function uploadNewImages(userId, bId, items) {
    for (const item of items) {
      const variant = preferredVariant(item);
      if (!variant?.key) continue;
      const prepared = await getPreparedImage(variant.key);
      if (!prepared?.blob) throw new Error("Обработената снимка липсва.");
      const role = item.role === "logo" ? "logo" : "gallery";
      const mime = prepared.mime || variant.mime || prepared.blob.type || "image/webp";
      const path = `${userId}/${bId}/${role}/${item.id}.${fileExtension(mime)}`;
      const { error: upErr } = await client.storage.from(BUCKET).upload(path, prepared.blob, { cacheControl: "3600", contentType: mime, upsert: false });
      if (upErr) throw upErr;
      const { error: dbErr } = await client.from("media").insert({
        owner_id: userId, entity_type: "business", entity_id: bId,
        storage_path: path, mime_type: mime, size_bytes: prepared.blob.size, status: "approved"
      });
      if (dbErr) throw dbErr;
    }
  }

  async function collectNewImages(bId) {
    if (!window.PopitaiImages?.commit) return [];
    const [logos, gallery] = await Promise.all([
      window.PopitaiImages.commit("exp-logo-uploader", "business", bId),
      window.PopitaiImages.commit("exp-gallery-uploader", "business", bId)
    ]);
    return [...logos, ...gallery];
  }

  const errors = {
    shortIntro: document.querySelector("#expanded-short-intro-error"),
    website: document.querySelector("#expanded-website-error"),
    services: document.querySelector("#expanded-services-error"),
    serviceArea: document.querySelector("#expanded-service-area-error"),
    workHours: document.querySelector("#expanded-work-hours-error")
  };

  const sectionRules = [
    { value: controls.shortIntro, toggle: controls.showShortIntro, error: errors.shortIntro, label: "кратко представяне" },
    { value: controls.website, toggle: controls.showWebsite, error: errors.website, label: "адрес на сайта" },
    { value: controls.services, toggle: controls.showServices, error: errors.services, label: "поне една услуга" },
    { value: controls.serviceArea, toggle: controls.showServiceArea, error: errors.serviceArea, label: "район на работа" },
    { value: controls.workHours, toggle: controls.showWorkHours, error: errors.workHours, label: "работно време" }
  ];

  let loadedBusiness = null;

  function setState(message, type = "") {
    state.textContent = message || "";
    state.hidden = !message;
    state.classList.remove("is-error", "is-success");
    if (type) state.classList.add(`is-${type}`);
  }

  function clearErrors() {
    Object.values(errors).forEach((element) => {
      if (element) element.textContent = "";
    });
    Object.values(controls).forEach((element) => element?.removeAttribute("aria-invalid"));
  }

  function websiteIsValid(value) {
    if (!value) return true;
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  }

  function validateSection(rule) {
    if (!rule.value || !rule.toggle || !rule.error) return true;

    const value = rule.value.value.trim();
    let message = "";
    if (rule.toggle.checked && !value) {
      message = `За да публикуваш секцията, въведи ${rule.label}.`;
    } else if (rule.value === controls.website && value && !websiteIsValid(value)) {
      message = "Адресът трябва да започва с http:// или https://.";
    }

    rule.error.textContent = message;
    if (message) rule.value.setAttribute("aria-invalid", "true");
    else rule.value.removeAttribute("aria-invalid");
    return !message;
  }

  function validateForm() {
    return sectionRules.map(validateSection).every(Boolean);
  }

  function servicesFromTextarea() {
    return controls.services.value
      .split(/\r?\n/)
      .map((value) => value.trim())
      .filter(Boolean);
  }

  function setValues(data = {}) {
    controls.shortIntro.value = data.short_intro || "";
    controls.website.value = data.website || "";
    controls.services.value = Array.isArray(data.services) ? data.services.join("\n") : "";
    controls.serviceArea.value = data.service_area || "";
    controls.workHours.value = data.work_hours || "";
    controls.showShortIntro.checked = data.show_short_intro === true;
    controls.showWebsite.checked = data.show_website === true;
    controls.showServices.checked = data.show_services === true;
    controls.showServiceArea.checked = data.show_service_area === true;
    controls.showWorkHours.checked = data.show_work_hours === true;
  }

  function setReadOnly(readOnly) {
    Object.values(controls).forEach((element) => {
      if (element) element.disabled = readOnly;
    });
    submitButton.disabled = readOnly;
  }

  function showModerationState(draft) {
    note.hidden = true;
    note.textContent = "";

    if (currentUserIsAdmin) {
      setReadOnly(false);
      if (draft) {
        setState("Има непубликувани промени от предишното изпращане. Натисни „Запази промените“, за да ги публикуваш.");
      } else {
        setState("");
      }
      return;
    }

    if (draft?.status === "pending") {
      setReadOnly(false);
      setState("Промените чакат одобрение. Можеш да ги редактираш и да ги изпратиш отново. Публикуваната версия остава видима.", "success");
      return;
    }

    if (draft?.status === "needs_changes" && draft.moderation_note?.trim()) {
      note.textContent = `Какво трябва да се коригира: ${draft.moderation_note.trim()}`;
      note.hidden = false;
    }

    setReadOnly(false);
    setState("");
  }

  async function loadEditor() {
    if (!businessId) {
      setState("Липсва фирма за редактиране.", "error");
      return;
    }

    const { data: authData, error: authError } = await client.auth.getUser();
    const user = authError ? null : authData?.user || null;
    if (!user) {
      setState("Влез в профила си, за да редактираш фирмата.", "error");
      return;
    }

    const [businessResult, profileResult] = await Promise.all([
      client
        .from("businesses")
        .select("id, owner_id, name, status, is_expanded")
        .eq("id", businessId)
        .eq("owner_id", user.id)
        .maybeSingle(),
      client
        .from("profiles")
        .select("role, is_blocked")
        .eq("id", user.id)
        .maybeSingle()
    ]);

    const business = businessResult.data;
    const businessError = businessResult.error;

    if (businessError || !business) {
      setState("Фирмата не може да се зареди или не е твоя.", "error");
      return;
    }
    if (profileResult.error || !profileResult.data) {
      setState("Правата за редактиране не могат да се проверят.", "error");
      return;
    }
    if (business.is_expanded !== true) {
      setState("Тази фирма няма разширен профил.", "error");
      return;
    }

    currentUserRole = profileResult.data.role || "user";
    const activeProfile = profileResult.data.is_blocked !== true;
    currentUserIsAdmin = currentUserRole === "admin" && activeProfile;
    currentUserIsModerator = currentUserRole === "moderator" && activeProfile;
    loadedBusiness = business;
    businessName.textContent = business.name;
    submitButton.textContent = currentUserIsAdmin ? "Запази промените" : "Изпрати за одобрение";

    const fields = "short_intro, website, services, service_area, work_hours, show_short_intro, show_website, show_services, show_service_area, show_work_hours";
    const [draftResult, publishedResult] = await Promise.all([
      client
        .from("business_expanded_profile_drafts")
        .select(`${fields}, status, moderation_note`)
        .eq("business_id", businessId)
        .maybeSingle(),
      client
        .from("business_expanded_profiles")
        .select(fields)
        .eq("business_id", businessId)
        .maybeSingle()
    ]);

    if (draftResult.error || publishedResult.error) {
      setState("Данните на разширения профил не могат да се заредят.", "error");
      return;
    }

    const source = draftResult.data || publishedResult.data || {};
    setValues(source);

    const { data: biz } = await client.from("businesses")
      .select("name, category, phone, city, address, description")
      .eq("id", businessId).maybeSingle();
    if (biz) {
      if (basic.name) basic.name.value = biz.name || "";
      if (basic.category) basic.category.value = biz.category || "";
      if (basic.phone) basic.phone.value = biz.phone || "";
      if (basic.city) basic.city.value = biz.city || "";
      if (basic.address) basic.address.value = biz.address || "";
      if (basic.description) basic.description.value = biz.description || "";
    }

    await loadCurrentMedia(businessId);
    form.hidden = false;
    showModerationState(draftResult.data);
  }

  sectionRules.forEach((rule) => {
    rule.value?.addEventListener("input", () => validateSection(rule));
    rule.toggle?.addEventListener("change", () => validateSection(rule));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!loadedBusiness) return;

    clearErrors();
    if (!validateForm()) {
      setState("Поправи отбелязаните полета.", "error");
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    submitButton.disabled = true;
    setState(currentUserIsAdmin ? "Запазваме промените…" : "Изпращаме промените…");

    if (basic.name && currentUserIsAdmin) {
      const { error: bizErr } = await client.from("businesses").update({
        name: basic.name.value.trim(),
        category: basic.category?.value || "",
        phone: basic.phone?.value.trim() || "",
        city: basic.city?.value.trim() || "",
        address: basic.address?.value.trim() || "",
        description: basic.description?.value.trim() || ""
      }).eq("id", loadedBusiness.id);
      if (bizErr) {
        setState("Основните данни не можаха да се запазят: " + (bizErr.message || ""), "error");
        submitButton.disabled = false;
        return;
      }

      try {
        const { data: authD } = await client.auth.getUser();
        const uid = authD?.user?.id;
        if (uid) {
          const newImgs = await collectNewImages(loadedBusiness.id);
          await removeSelectedMedia(newImgs);
          await uploadNewImages(uid, loadedBusiness.id, newImgs);
        }
      } catch (imgErr) {
        setState("Снимките не се качиха: " + (imgErr.message || ""), "error");
        submitButton.disabled = false;
        return;
      }
    }

    const saveFunction = currentUserIsAdmin
      ? "save_staff_owned_business_expanded_profile"
      : "save_own_business_expanded_profile_draft";
    const { error } = await client.rpc(saveFunction, {
      p_business_id: loadedBusiness.id,
      p_short_intro: controls.shortIntro.value.trim(),
      p_website: controls.website.value.trim(),
      p_services: servicesFromTextarea(),
      p_service_area: controls.serviceArea.value.trim(),
      p_work_hours: controls.workHours.value.trim(),
      p_show_short_intro: controls.showShortIntro.checked,
      p_show_website: controls.showWebsite.checked,
      p_show_services: controls.showServices.checked,
      p_show_service_area: controls.showServiceArea.checked,
      p_show_gallery: true,
      p_show_work_hours: controls.showWorkHours.checked
    });

    if (error) {
      setState(error.message || "Промените не могат да се изпратят.", "error");
      submitButton.disabled = false;
      return;
    }

    setReadOnly(false);
    note.hidden = true;
    setState("");

    const successMsg = currentUserIsAdmin
      ? "Промените са запазени и публикувани."
      : "Промените са записани и чакат одобрение. Публикуваната версия остава видима.";

    let inlineMsg = submitButton.nextElementSibling;
    if (!inlineMsg || !inlineMsg.classList.contains("expanded-inline-success")) {
      inlineMsg = document.createElement("p");
      inlineMsg.className = "expanded-inline-success";
      inlineMsg.style.cssText = "margin:0;color:#17653a;font-weight:800;font-size:15px";
      submitButton.insertAdjacentElement("afterend", inlineMsg);
    }
    inlineMsg.textContent = successMsg;
    inlineMsg.hidden = false;

    submitButton.textContent = "Запазено ✓";
    submitButton.disabled = true;

    window.setTimeout(() => {
      submitButton.textContent = currentUserIsAdmin ? "Запази промените" : "Изпрати за одобрение";
      submitButton.disabled = false;
      inlineMsg.hidden = true;
    }, 4000);
  });

  loadEditor();
})();