// Попитай.Лом — управление на фирми в административния панел
(() => {
  const client = window.PopitaiSupabase;
  if (!client) return;

  const BUCKET = "business-media";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  let currentUser = null;
  let currentProfile = null;
  let activeBusinessView = null;

  function isAdminProfile() {
    return currentProfile?.role === "admin" && currentProfile?.is_blocked !== true;
  }

  function isModeratorProfile() {
    return currentProfile?.role === "moderator" && currentProfile?.is_blocked !== true;
  }

  function isOwnBusiness(item) {
    return Boolean(item?.owner_id && currentUser?.id && item.owner_id === currentUser.id);
  }

  const labels = {
    pending: "Чака одобрение",
    approved: "Публикувана",
    rejected: "Скрита/отказана",
    needs_changes: "Върната за корекция"
  };

  function formatDate(value) {
    try {
      return new Intl.DateTimeFormat("bg-BG", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      }).format(new Date(value));
    } catch (_) { return ""; }
  }

  function formatBytes(bytes) {
    const value = Number(bytes || 0);
    if (!value) return "";
    if (value < 1024 * 1024) return `${Math.max(1, Math.round(value / 1024))} KB`;
    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  }

  function setMessage(text, error = false) {
    const element = $("#admin-panel-message");
    if (!element) return;
    element.textContent = text || "";
    element.hidden = !text;
    element.classList.toggle("error", error);
  }

  function mediaRole(path) {
    const value = String(path || "");
    if (value.includes("/logo/")) return "logo";
    if (value.includes("/gallery/")) return "gallery";
    return "other";
  }

  function publicMediaUrl(path) {
    if (!path) return "";
    const { data } = client.storage.from(BUCKET).getPublicUrl(path);
    return data?.publicUrl || "";
  }

  function mediaPreview(rows = []) {
    if (!rows.length) {
      return '<div class="admin-business-media"><strong>Качени изображения:</strong> няма</div>';
    }

    const sortedRows = [...rows].sort((a, b) => {
      const roleOrder = { logo: 0, gallery: 1, other: 2 };
      return roleOrder[mediaRole(a.storage_path)] - roleOrder[mediaRole(b.storage_path)];
    });

    const images = sortedRows.map((row, index) => {
      const role = mediaRole(row.storage_path);
      const roleLabel = role === "logo" ? "Лого" : role === "gallery" ? `Снимка ${index + 1}` : "Изображение";
      const url = publicMediaUrl(row.storage_path);
      const details = [roleLabel, formatBytes(row.size_bytes)].filter(Boolean).join(" · ");

      if (!url) return "";
      return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener" title="Отвори изображението" style="display:block;width:150px;text-decoration:none;color:inherit">
        <img src="${escapeHtml(url)}" alt="${escapeHtml(roleLabel)}" loading="lazy" decoding="async" style="display:block;width:150px;height:110px;object-fit:cover;border-radius:12px;border:1px solid #d6dfec;background:#f3f6fa">
        <small style="display:block;margin-top:6px;font-weight:700">${escapeHtml(details)}</small>
      </a>`;
    }).filter(Boolean).join("");

    return `<section class="admin-business-media" style="margin:18px 0">
      <h4 style="margin:0 0 10px">Качени изображения (${rows.length})</h4>
      <div style="display:flex;flex-wrap:wrap;gap:12px">${images}</div>
      <p style="margin:10px 0 0;font-size:.92rem">Натисни върху снимка, за да я прегледаш в пълен размер преди одобрение.</p>
    </section>`;
  }

  function businessCard(item, mode, mediaRows = []) {
    const ownModeratorBusiness = isModeratorProfile() && isOwnBusiness(item);
    const permanentDeleteButton = isAdminProfile()
      ? `<button class="admin-action-delete" data-business-action="delete" data-id="${escapeHtml(item.id)}">Изтрий окончателно</button>`
      : "";

    let actions = "";
    if (ownModeratorBusiness) {
      actions = '<span class="admin-status">Собствено съдържание — без модераторски действия</span>';
    } else if (mode === "pending") {
      actions = `
        <button class="admin-action-approve" data-business-action="approve" data-id="${escapeHtml(item.id)}">Одобри</button>
        <button class="admin-action-hide" data-business-action="changes" data-id="${escapeHtml(item.id)}">Върни за корекция</button>
        <button class="admin-action-delete" data-business-action="reject" data-id="${escapeHtml(item.id)}">Откажи</button>`;
    } else if (mode === "published") {
      actions = `
        <a class="admin-action-secondary" href="firma.html?id=${encodeURIComponent(item.id)}" target="_blank" rel="noopener">Отвори</a>
        <button class="admin-action-hide" data-business-action="hide" data-id="${escapeHtml(item.id)}">Скрий</button>
        ${permanentDeleteButton}`;
    } else {
      actions = `
        <button class="admin-action-approve" data-business-action="restore" data-id="${escapeHtml(item.id)}">Публикувай отново</button>
        ${permanentDeleteButton}`;
    }

    return `<article class="admin-record">
      <div class="admin-record-meta"><span class="admin-status ${escapeHtml(item.status)}">${escapeHtml(labels[item.status] || item.status)}</span><span>${formatDate(item.created_at)}</span><span>Фирма</span></div>
      <h3>${escapeHtml(item.name)}</h3>
      <p><strong>Категория:</strong> ${escapeHtml(item.category)}</p>
      <p>${escapeHtml(item.description)}</p>
      ${item.phone ? `<p><strong>Телефон:</strong> ${escapeHtml(item.phone)}</p>` : ""}
      ${item.moderation_note ? `<p><strong>Бележка:</strong> ${escapeHtml(item.moderation_note)}</p>` : ""}
      ${mediaPreview(mediaRows)}
      <div class="admin-record-actions">${actions}</div>
    </article>`;
  }

  async function authIsStaff() {
    const { data, error } = await client.auth.getUser();
    currentUser = error ? null : data?.user || null;
    if (!currentUser) return false;
    const { data: profile } = await client.from("profiles").select("role, is_blocked").eq("id", currentUser.id).maybeSingle();
    currentProfile = profile || null;
    return Boolean(profile && ["admin", "moderator"].includes(profile.role) && !profile.is_blocked);
  }

  async function refreshBusinessCounts() {
    let pendingQuery = client.from("businesses").select("id", { count: "exact", head: true }).eq("status", "pending");
    if (isModeratorProfile() && currentUser?.id) pendingQuery = pendingQuery.neq("owner_id", currentUser.id);

    const [pending, approved] = await Promise.all([
      pendingQuery,
      client.from("businesses").select("id", { count: "exact", head: true }).eq("status", "approved")
    ]);

    const pendingCount = pending.count || 0;
    const approvedCount = approved.count || 0;

    const badge = $("#admin-businesses-badge");
    if (badge) {
      badge.textContent = String(pendingCount);
      badge.hidden = pendingCount === 0;
    }
    const pendingButton = document.querySelector('[data-business-view="businesses-pending"]');
    if (pendingButton) pendingButton.hidden = pendingCount === 0;
    if ($("#admin-businesses-count")) $("#admin-businesses-count").textContent = String(approvedCount);
  }

  async function loadBusinesses(view) {
    activeBusinessView = view;
    const title = $("#admin-view-title");
    const container = $("#admin-view-content");
    if (!title || !container) return;

    const config = {
      "businesses-pending": { title: "Чакащи фирми", mode: "pending", filter: ["pending"] },
      "businesses-approved": { title: "Публикувани фирми", mode: "published", filter: ["approved"] },
      "businesses-hidden": { title: "Скрити и отказани фирми", mode: "hidden", filter: ["rejected", "needs_changes"] }
    }[view];
    if (!config) return;

    title.textContent = config.title;
    container.innerHTML = '<article class="empty-card"><p>Зареждане…</p></article>';
    setMessage("");

    let query = client
      .from("businesses")
      .select("id, name, category, description, phone, status, moderation_note, created_at, owner_id")
      .order("created_at", { ascending: false });

    query = config.filter.length === 1
      ? query.eq("status", config.filter[0])
      : query.in("status", config.filter);

    if (config.mode === "pending" && isModeratorProfile() && currentUser?.id) {
      query = query.neq("owner_id", currentUser.id);
    }

    const { data, error } = await query;
    if (error) {
      container.innerHTML = '<article class="empty-card"><p>Фирмите не могат да се заредят.</p></article>';
      setMessage("Възникна проблем при зареждането на фирмите.", true);
      return;
    }

    const businesses = data || [];
    if (!businesses.length) {
      container.innerHTML = '<article class="empty-card"><p>Няма фирми в тази секция.</p></article>';
      return;
    }

    const businessIds = businesses.map((item) => item.id);
    const { data: media, error: mediaError } = await client
      .from("media")
      .select("id, entity_id, storage_path, mime_type, size_bytes, status, created_at")
      .eq("entity_type", "business")
      .in("entity_id", businessIds)
      .order("created_at", { ascending: true });

    const mediaByBusiness = new Map();
    if (!mediaError) {
      (media || []).forEach((row) => {
        const rows = mediaByBusiness.get(row.entity_id) || [];
        rows.push(row);
        mediaByBusiness.set(row.entity_id, rows);
      });
    } else {
      setMessage("Фирмите са заредени, но изображенията не могат да се покажат.", true);
    }

    container.innerHTML = businesses
      .map((item) => businessCard(item, config.mode, mediaByBusiness.get(item.id) || []))
      .join("");
  }

  async function updateBusiness(id, status, note = "") {
    return client.from("businesses").update({
      status,
      moderation_note: note,
      reviewed_by: currentUser.id,
      reviewed_at: new Date().toISOString()
    }).eq("id", id);
  }

  async function performAction(button) {
    const action = button.dataset.businessAction;
    const id = button.dataset.id;
    let result;

    if (["approve", "restore"].includes(action)) {
      result = await updateBusiness(id, "approved", "");
    } else if (action === "changes") {
      const note = window.prompt("Какво трябва да се коригира?")?.trim();
      if (!note) return;
      result = await updateBusiness(id, "needs_changes", note);
    } else if (action === "reject") {
      const note = window.prompt("Причина за отказа:")?.trim();
      if (!note) return;
      result = await updateBusiness(id, "rejected", note);
    } else if (action === "hide") {
      const note = window.prompt("Причина за скриването:", "Скрита от администратор")?.trim();
      if (!note) return;
      result = await updateBusiness(id, "rejected", note);
    } else if (action === "delete") {
      if (!isAdminProfile()) {
        setMessage("Окончателното изтриване е само за администратор.", true);
        return;
      }
      if (!window.confirm("Фирмата ще бъде изтрита окончателно. Продължаваш ли?")) return;
      result = await client.from("businesses").delete().eq("id", id);
    } else {
      return;
    }

    if (result.error) {
      setMessage("Промяната не беше записана.", true);
      return;
    }

    setMessage("Промяната е записана успешно.");
    await Promise.all([refreshBusinessCounts(), loadBusinesses(activeBusinessView)]);
  }

  function addBusinessControls() {
    const menu = $(".admin-menu");
    if (!menu || $("[data-business-view]")) return;

    const review = menu.querySelector('[data-admin-menu-group-items="review"]');
    const content = menu.querySelector('[data-admin-menu-group-items="content"]');
    if (!review || !content) return;

    const pending = document.createElement("button");
    pending.type = "button";
    pending.dataset.businessView = "businesses-pending";
    pending.innerHTML = 'Чакащи фирми <span class="admin-badge" id="admin-businesses-badge" hidden>0</span>';
    review.appendChild(pending);

    const approved = document.createElement("button");
    approved.type = "button";
    approved.dataset.businessView = "businesses-approved";
    approved.textContent = "Публикувани фирми";
    content.appendChild(approved);

    const hidden = document.createElement("button");
    hidden.type = "button";
    hidden.dataset.businessView = "businesses-hidden";
    hidden.textContent = "Скрити фирми";
    content.appendChild(hidden);

    const stats = $(".admin-stats");
    if (stats && !$("#admin-businesses-count")) {
      stats.insertAdjacentHTML("beforeend", '<article><strong id="admin-businesses-count">0</strong><span>Фирми</span></article>');
    }
  }

  async function waitForCoreMenu() {
    for (let i = 0; i < 60; i += 1) {
      const review = document.querySelector('.admin-menu [data-admin-menu-group-items="review"]');
      const content = document.querySelector('.admin-menu [data-admin-menu-group-items="content"]');
      if (review && content && document.querySelector("#admin-view-content")) return true;
      await new Promise(resolve => window.setTimeout(resolve, 50));
    }
    return false;
  }

  async function init() {
    if (!(await authIsStaff())) return;
    if (!(await waitForCoreMenu())) return;
    addBusinessControls();
    await refreshBusinessCounts();

    document.addEventListener("click", async (event) => {
      const menuButton = event.target.closest(".admin-menu button");
      if (menuButton && !menuButton.matches("[data-business-view]")) activeBusinessView = null;

      const viewButton = event.target.closest("[data-business-view]");
      if (viewButton) {
        event.preventDefault();
        event.stopImmediatePropagation();
        $$(".admin-menu button").forEach((item) => item.classList.toggle("active", item === viewButton));
        await loadBusinesses(viewButton.dataset.businessView);
        return;
      }

      const actionButton = event.target.closest("[data-business-action]");
      if (!actionButton) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      actionButton.disabled = true;
      try { await performAction(actionButton); }
      finally { actionButton.disabled = false; }
    }, true);

    window.setInterval(async () => {
      await refreshBusinessCounts();
      if (activeBusinessView === "businesses-pending") await loadBusinesses(activeBusinessView);
    }, 60000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
