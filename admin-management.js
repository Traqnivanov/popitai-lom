// Попитай.Лом — реален административен панел за Supabase
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

  const formatDate = (value) => {
    if (!value) return "";
    try {
      return new Intl.DateTimeFormat("bg-BG", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(value));
    } catch (_) {
      return "";
    }
  };

  const statusLabels = {
    pending: "Чака одобрение",
    approved: "Публикувано",
    rejected: "Скрито/отказано",
    needs_changes: "Върнато за корекция"
  };

  let currentUser = null;
  let currentProfile = null;
  let activeView = "dashboard";
  let dashboardCounts = null;

  function isAdminProfile() {
    return currentProfile?.role === "admin" && currentProfile?.is_blocked !== true;
  }

  function isModeratorProfile() {
    return currentProfile?.role === "moderator" && currentProfile?.is_blocked !== true;
  }

  function roleLabel(role) {
    return {
      admin: "Главен администратор",
      moderator: "Модератор",
      user: "Потребител"
    }[role] || "Потребител";
  }

  function userManagementActions(profile) {
    const isSelf = profile.id === currentUser?.id;
    const admin = isAdminProfile();

    if (isSelf) {
      return '<span class="admin-status approved">Твоят профил</span>';
    }

    if (profile.role === "admin") {
      return '<span class="admin-status approved">Защитен администратор</span>';
    }

    const actions = [];

    if (admin) {
      if (profile.role === "moderator") {
        actions.push(`<button class="admin-action-hide" data-admin-action="remove-moderator" data-id="${escapeHtml(profile.id)}">Премахни модератор</button>`);
      } else if (profile.role === "user" && !profile.is_blocked) {
        actions.push(`<button class="admin-action-secondary" data-admin-action="appoint-moderator" data-id="${escapeHtml(profile.id)}">Назначи за модератор</button>`);
      }
    }

    const canManageBlockedState = admin || profile.role === "user";
    if (canManageBlockedState) {
      actions.push(`<button class="${profile.is_blocked ? "admin-action-approve" : "admin-action-delete"}" data-admin-action="${profile.is_blocked ? "unblock" : "block"}" data-id="${escapeHtml(profile.id)}">${profile.is_blocked ? "Разблокирай" : "Блокирай"}</button>`);
    }

    return actions.join("") || `<span class="admin-status">${escapeHtml(roleLabel(profile.role))}</span>`;
  }

  const styles = document.createElement("style");
  styles.textContent = `
    .admin-menu button{display:flex;align-items:center;justify-content:space-between;gap:.6rem;width:100%}
    .admin-menu-group{display:grid;gap:4px;width:100%}
    .admin-menu-group+.admin-menu-group{padding-top:10px;border-top:1px solid #d9e2ef}
    .admin-menu-group-title{margin:0;padding:0 10px 4px;color:#687386;font-size:.72rem;font-weight:900;letter-spacing:.06em;text-transform:uppercase}
    .admin-menu-group-items{display:grid;gap:4px}
    .admin-badge{display:inline-flex;min-width:1.55rem;height:1.55rem;align-items:center;justify-content:center;border-radius:999px;background:#c62828;color:#fff;font-size:.76rem;font-weight:900;padding:0 .38rem}
    .admin-badge[hidden]{display:none}
    .admin-panel-message{padding:.85rem 1rem;border-radius:12px;background:#eef5ff;border:1px solid #c8daf5;color:#173d75;margin:0 0 1rem}
    .admin-panel-message.error{background:#fdecec;border-color:#efb2b2;color:#8a2020}
    .admin-record{padding:1rem;border:1px solid #d9e2ef;border-radius:16px;background:#fff;display:grid;gap:.72rem}
    .admin-record h3{margin:0;color:#061a38}
    .admin-record p{margin:0;white-space:pre-wrap}
    .admin-record-meta{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;color:#52627a;font-size:.86rem}
    .admin-status{display:inline-flex;padding:.26rem .6rem;border-radius:999px;background:#fff3cd;border:1px solid #efd37b;color:#6b4b00;font-weight:800}
    .admin-status.approved{background:#eaf8ef;border-color:#abd9ba;color:#176438}
    .admin-status.rejected{background:#fdecec;border-color:#efb2b2;color:#8a2020}
    .admin-status.needs_changes{background:#eef3ff;border-color:#b8c9ef;color:#234e9c}
    .admin-record-actions{display:flex;flex-wrap:wrap;gap:.55rem}
    .admin-record-actions button,.admin-record-actions a{border:0;border-radius:10px;padding:.62rem .82rem;font-weight:800;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center}
    .admin-action-approve{background:#176438;color:#fff}
    .admin-action-hide{background:#d49a13;color:#061a38}
    .admin-action-delete{background:#9f2d2d;color:#fff}
    .admin-action-secondary{background:#e9eef5;color:#173d75}
    .admin-action-preview{background:#173d75;color:#fff;border:1px solid #173d75}
    .admin-user-row{display:grid;grid-template-columns:1fr auto;gap:1rem;align-items:center}
    .admin-user-row small{display:block;color:#52627a;margin-top:.25rem}
    .admin-listing-description{padding:.75rem;background:#f8fafc;border-radius:10px;color:#26344d;line-height:1.55}
    .admin-listing-media{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:.6rem}
    .admin-listing-media a{display:block;aspect-ratio:1/1;border-radius:10px;overflow:hidden;border:1px solid #d9e2ef;background:#eef2f7}
    .admin-listing-media img{width:100%;height:100%;object-fit:cover;display:block}
    @media(max-width:720px){.admin-user-row{grid-template-columns:1fr}.admin-record-actions>*{flex:1;justify-content:center}.admin-listing-media{grid-template-columns:repeat(3,1fr)}}
  `;
  document.head.appendChild(styles);

  function setMessage(text, isError = false) {
    const message = $("#admin-panel-message");
    if (!message) return;
    message.textContent = text || "";
    message.hidden = !text;
    message.classList.toggle("error", isError);
  }

  function errorText(error, fallback = "Възникна проблем. Опитай отново.") {
    const message = String(error?.message || "").toLowerCase();
    if (message.includes("permission denied") || message.includes("row-level security")) {
      return "Липсва необходимо администраторско право. Провери дали последният SQL файл е изпълнен.";
    }
    if (message.includes("failed to fetch") || message.includes("network")) {
      return "Няма връзка със системата. Провери интернет връзката.";
    }
    return fallback;
  }

  function statusBadge(status) {
    return `<span class="admin-status ${escapeHtml(status)}">${escapeHtml(statusLabels[status] || status)}</span>`;
  }

  function mediaPublicUrl(path) {
    if (!path) return "";
    const { data } = client.storage.from(BUCKET).getPublicUrl(path);
    return data?.publicUrl || "";
  }

  async function attachListingMedia(items) {
    if (!items.length) return items;
    const ids = items.map((item) => item.id);
    const { data, error } = await client
      .from("media")
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

  function setupLayout() {
    const admin = isAdminProfile();
    const heroTitle = $(".page-hero h1");
    const heroText = $(".page-hero p");
    if (heroTitle) heroTitle.textContent = admin ? "Административен панел" : "Модераторски панел";
    if (heroText) {
      heroText.textContent = admin
        ? "Какво чака действие и управление на съдържанието."
        : "Какво чака действие в рамките на модераторските права.";
    }
    const topbarTitle = $(".admin-topbar-title");
    if (topbarTitle) topbarTitle.textContent = admin ? "Административен панел" : "Модераторски панел";
    document.title = `${admin ? "Административен" : "Модераторски"} панел | Попитай.Лом`;

    const testTools = $(".admin-test-tools");
    if (testTools) testTools.hidden = true;

    const stats = $(".admin-stats");
    if (stats) {
      stats.innerHTML = `
        <article><strong id="admin-users-count">0</strong><span>Потребители</span></article>
        <article><strong id="admin-pending-count">0</strong><span>Задачи за преглед</span></article>
        <article><strong id="admin-approved-questions-count">0</strong><span>Въпроси</span></article>
        <article><strong id="admin-approved-answers-count">0</strong><span>Отговори</span></article>`;
    }

    const menu = $(".admin-menu");
    if (menu) {
      menu.innerHTML = `
        <button class="admin-menu-home active" type="button" data-admin-view="dashboard"><span>Начало</span></button>
        <section class="admin-menu-group" data-admin-menu-group="review">
          <h2 class="admin-menu-group-title">
            <button class="admin-menu-group-toggle" type="button" data-admin-group-toggle="review">За преглед</button>
          </h2>
          <div class="admin-menu-group-items" data-admin-menu-group-items="review">
            <button type="button" data-admin-view="pending">Чакащи <span class="admin-badge" id="admin-menu-badge" hidden>0</span></button>
          </div>
        </section>
        <section class="admin-menu-group" data-admin-menu-group="content">
          <h2 class="admin-menu-group-title">
            <button class="admin-menu-group-toggle" type="button" data-admin-group-toggle="content">Съдържание</button>
          </h2>
          <div class="admin-menu-group-items" data-admin-menu-group-items="content">
            <button type="button" data-admin-view="questions">Публикувани въпроси</button>
            <button type="button" data-admin-view="answers">Публикувани отговори</button>
            <button type="button" data-admin-view="listings">Обяви</button>
            <button type="button" data-admin-view="hidden">Скрити/отказани</button>
          </div>
        </section>
        <section class="admin-menu-group" data-admin-menu-group="management">
          <h2 class="admin-menu-group-title">
            <button class="admin-menu-group-toggle" type="button" data-admin-group-toggle="management">Управление</button>
          </h2>
          <div class="admin-menu-group-items" data-admin-menu-group-items="management">
            <button type="button" data-admin-view="users">Потребители</button>
            ${admin ? '<button type="button" data-admin-view="contacts">Съобщения</button>' : ""}
          </div>
        </section>
        <div class="admin-menu-footer">
          <button class="admin-menu-collapse" type="button" data-admin-menu-collapse><span>← Свий менюто</span></button>
        </div>`;
    }

    const content = $(".admin-content");
    if (content) {
      content.innerHTML = `
        <div class="block-heading"><h2 id="admin-view-title">Начало</h2></div>
        <p class="admin-panel-message" id="admin-panel-message" hidden></p>
        <div id="admin-view-content" class="stack-list"><article class="empty-card"><p>Зареждане на задачите…</p></article></div>`;
    }

    document.addEventListener("click", handleClick);
    document.addEventListener("click", handleNavigationChrome, true);
    window.addEventListener("popitai:admin-actionable-counts", event => {
      dashboardCounts = event.detail || null;
      updateTopbarTasks(dashboardCounts);
      if (activeView === "dashboard") renderDashboard();
    });
    syncMobileNav("dashboard");
  }

  function updateTopbarTasks(detail) {
    const button = document.querySelector("[data-admin-topbar-tasks]");
    if (!button) return;
    const total = Number(detail?.total || 0);
    const counts = detail?.counts || {};
    const parts = [
      ["Фирми", counts.businesses],
      ["Обяви", counts.listings],
      ["Въпроси", counts.questions],
      ["Отговори", counts.answers],
      ["Магазини", counts.shops],
      ["Събития", counts.events],
      ["Сигнали", counts.reports],
      ["Инфо Лом", Number(counts.info_submissions || 0) + Number(counts.info_error_reports || 0)],
      ["Редакции", counts.user_content_edit_drafts],
      ["Разширени профили", counts.business_expanded_profile_drafts]
    ].filter(([, count]) => Number(count || 0) > 0);

    button.hidden = false;
    button.classList.toggle("has-tasks", total > 0);
    button.innerHTML = total > 0
      ? `<span class="admin-topbar-task-dot" aria-hidden="true"></span><strong>${total}</strong><span>за преглед</span>`
      : '<span>Няма чакащи задачи</span>';
    button.title = parts.length
      ? parts.map(([label,count]) => `${label}: ${count}`).join(" · ")
      : "Няма чакащи задачи";
    button.setAttribute("aria-label", total > 0
      ? `${total} задачи за преглед. ${button.title}`
      : "Няма чакащи задачи");
  }

  function syncMobileNav(tab) {
    document.querySelectorAll("[data-admin-mobile-tab]").forEach(button => {
      const active = button.dataset.adminMobileTab === tab;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
  }

  function setOpenGroup(name) {
    $$(".admin-menu-group").forEach(group => {
      group.classList.toggle("is-open", group.dataset.adminMenuGroup === name);
    });
  }

  function closeMobileMenu() {
    document.body.classList.remove("admin-mobile-menu-open");
    const trigger = $("[data-admin-mobile-menu]");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
    const overlay = $("[data-admin-mobile-overlay]");
    if (overlay) overlay.hidden = true;
  }

  function openMobileMenu(group = "") {
    if (group) setOpenGroup(group);
    document.body.classList.add("admin-mobile-menu-open");
    const trigger = $("[data-admin-mobile-menu]");
    if (trigger) trigger.setAttribute("aria-expanded", "true");
    const overlay = $("[data-admin-mobile-overlay]");
    if (overlay) overlay.hidden = false;
  }

  function handleNavigationChrome(event) {
    const groupToggle = event.target.closest("[data-admin-group-toggle]");
    if (groupToggle) {
      event.preventDefault();
      const group = groupToggle.closest(".admin-menu-group");
      const wasOpen = group?.classList.contains("is-open");
      $$(".admin-menu-group").forEach(item => item.classList.remove("is-open"));
      if (!wasOpen && group) group.classList.add("is-open");
      return;
    }

    if (event.target.closest("[data-admin-menu-collapse]")) {
      event.preventDefault();
      const collapsed = document.body.classList.toggle("admin-sidebar-collapsed");
      const collapseButton = document.querySelector("[data-admin-menu-collapse]");
      const label = collapseButton?.querySelector("span");
      if (label) label.textContent = collapsed ? "→ Меню" : "← Свий менюто";
      if (collapseButton) {
        collapseButton.title = collapsed ? "Разгъни менюто" : "Свий менюто";
        collapseButton.setAttribute("aria-label", collapsed ? "Разгъни менюто" : "Свий менюто");
      }
      try {
        sessionStorage.setItem("popitai-admin-sidebar-collapsed-v2", collapsed ? "1" : "0");
      } catch (_) {}
      return;
    }

    if (event.target.closest("[data-admin-mobile-menu]")) {
      event.preventDefault();
      if (document.body.classList.contains("admin-mobile-menu-open")) closeMobileMenu();
      else openMobileMenu();
      return;
    }

    if (event.target.closest("[data-admin-mobile-overlay]")) {
      closeMobileMenu();
      return;
    }

    const mobileTab = event.target.closest("[data-admin-mobile-tab]");
    if (mobileTab) {
      event.preventDefault();
      const tab = mobileTab.dataset.adminMobileTab;
      if (tab === "dashboard") {
        document.querySelector('[data-admin-view="dashboard"]')?.click();
        closeMobileMenu();
      } else if (tab === "review") {
        openMobileMenu("review");
      } else if (tab === "content") {
        openMobileMenu("content");
      } else {
        openMobileMenu("management");
      }
      return;
    }

    const menuButton = event.target.closest(".admin-menu button");
    if (menuButton && !menuButton.hasAttribute("data-admin-group-toggle") && !menuButton.hasAttribute("data-admin-menu-collapse")) {
      const group = menuButton.closest(".admin-menu-group");
      if (group?.dataset.adminMenuGroup) setOpenGroup(group.dataset.adminMenuGroup);
      if (!menuButton.hasAttribute("data-admin-view")) {
        activeView = "external";
        syncMobileNav(
          group?.dataset.adminMenuGroup === "review" ? "review" :
          group?.dataset.adminMenuGroup === "content" ? "content" : "menu"
        );
      }
      closeMobileMenu();
    }

    const dashboardOpen = event.target.closest("[data-dashboard-target]");
    if (dashboardOpen) {
      event.preventDefault();
      const selector = dashboardTargetSelector(dashboardOpen.dataset.dashboardTarget);
      const target = selector ? document.querySelector(selector) : null;
      if (target) target.click();
    }
  }

  function dashboardTargetSelector(key) {
    return {
      questions: '[data-admin-view="pending"]',
      answers: '[data-admin-view="pending"]',
      listings: '[data-admin-view="pending"]',
      businesses: '[data-business-view="businesses-pending"]',
      user_content_edit_drafts: '[data-user-edits-view]',
      business_expanded_profile_drafts: '[data-expanded-businesses-view]',
      shops: '[data-shops-review]',
      events: '[data-events-review]',
      reports: '[data-reports-admin]',
      info: '[data-info-moderator-review],[data-info-review-shortcut],[data-info-admin]'
    }[key] || "";
  }

  function renderDashboard() {
    const title = $("#admin-view-title");
    const container = $("#admin-view-content");
    if (!title || !container) return;
    title.textContent = "Какво има за преглед";

    const detail = dashboardCounts;
    const total = Number(detail?.total ?? $("#admin-pending-count")?.textContent ?? 0);
    const counts = detail?.counts || {};
    const tasks = [
      ["businesses", "Фирми", Number(counts.businesses || 0)],
      ["listings", "Обяви", Number(counts.listings || 0)],
      ["questions", "Въпроси", Number(counts.questions || 0)],
      ["answers", "Отговори", Number(counts.answers || 0)],
      ["shops", "Магазини", Number(counts.shops || 0)],
      ["events", "Събития", Number(counts.events || 0)],
      ["reports", "Сигнали", Number(counts.reports || 0)],
      ["info", "Инфо Лом", Number(counts.info_submissions || 0) + Number(counts.info_error_reports || 0)],
      ["user_content_edit_drafts", "Потребителски редакции", Number(counts.user_content_edit_drafts || 0)],
      ["business_expanded_profile_drafts", "Разширени профили", Number(counts.business_expanded_profile_drafts || 0)]
    ].filter(([, , count]) => count > 0);

    container.innerHTML = `
      <section class="admin-v2-dashboard">
        <div class="admin-v2-dashboard-summary">
          <strong>${total}</strong>
          <span>${total === 1 ? "задача чака преглед" : "задачи чакат преглед"}</span>
        </div>
        ${tasks.length ? `
          <div class="admin-v2-task-list">
            ${tasks.map(([key,label,count]) => `
              <div class="admin-v2-task-row">
                <strong>${escapeHtml(label)}</strong>
                <span class="admin-v2-task-count">${count}</span>
                <button class="admin-v2-task-open" type="button" data-dashboard-target="${escapeHtml(key)}">Прегледай</button>
              </div>`).join("")}
          </div>`
          : (dashboardCounts
            ? '<div class="admin-v2-no-tasks">Няма задачи за преглед.</div>'
            : '<article class="empty-card"><p>Зареждане на текущите задачи…</p></article>')}
      </section>`;
  }

  try {
    sessionStorage.removeItem("popitai-admin-sidebar-collapsed-v1");
    if (sessionStorage.getItem("popitai-admin-sidebar-collapsed-v2") === "1") {
      document.body.classList.add("admin-sidebar-collapsed");
      window.setTimeout(() => {
        const collapseButton = document.querySelector("[data-admin-menu-collapse]");
        const label = collapseButton?.querySelector("span");
        if (label) label.textContent = "→ Меню";
        if (collapseButton) {
          collapseButton.title = "Разгъни менюто";
          collapseButton.setAttribute("aria-label", "Разгъни менюто");
        }
      }, 0);
    }
  } catch (_) {}

  async function loadAuth() {
    const { data, error } = await client.auth.getUser();
    currentUser = error ? null : data?.user || null;
    if (!currentUser) return false;

    const { data: profile, error: profileError } = await client
      .from("profiles")
      .select("id, display_name, role, is_blocked")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (profileError || !profile) return false;
    currentProfile = profile;
    return ["admin", "moderator"].includes(profile.role) && !profile.is_blocked;
  }

  async function refreshCounts() {
    const pendingSources = [
      "questions",
      "answers",
      "businesses",
      "listings",
      "user_content_edit_drafts",
      "business_expanded_profile_drafts",
      "shops",
      "events",
      "reports"
    ];
    if (isAdminProfile()) pendingSources.push("info_submissions", "info_error_reports");

    const [users, approvedQuestions, approvedAnswers, pendingResults] = await Promise.all([
      client.from("profiles").select("id", { count: "exact", head: true }),
      client.from("questions").select("id", { count: "exact", head: true }).eq("status", "approved"),
      client.from("answers").select("id", { count: "exact", head: true }).eq("status", "approved"),
      Promise.all(pendingSources.map((table) => {
        const primaryKey = table === "business_expanded_profile_drafts" ? "business_id" : "id";
        return client.from(table).select(primaryKey, { count: "exact", head: true }).eq("status", "pending");
      }))
    ]);

    const countsBySource = new Map(pendingSources.map((table, index) => [table, pendingResults[index].count || 0]));
    let localPending = ["questions", "answers", "listings"]
      .reduce((total, table) => total + (countsBySource.get(table) || 0), 0);

    if (isModeratorProfile() && currentUser?.id) {
      const ownCoreResults = await Promise.all([
        client.from("questions").select("id", { count: "exact", head: true }).eq("status", "pending").eq("author_id", currentUser.id),
        client.from("answers").select("id", { count: "exact", head: true }).eq("status", "pending").eq("author_id", currentUser.id),
        client.from("listings").select("id", { count: "exact", head: true }).eq("status", "pending").or(`owner_id.eq.${currentUser.id},author_id.eq.${currentUser.id}`)
      ]);
      const ownFailed = ownCoreResults.some(result => result.error);
      if (!ownFailed) {
        localPending = Math.max(0, localPending - ownCoreResults.reduce((sum, result) => sum + (result.count || 0), 0));
      }
    }

    const pending = pendingResults.reduce((total, result) => total + (result.count || 0), 0);
    const failedSources = pendingSources.filter((_, index) => pendingResults[index].error);
    if (failedSources.length) {
      console.warn("Pending counts unavailable for:", failedSources.join(", "));
    }
    if ($("#admin-users-count")) $("#admin-users-count").textContent = String(users.count || 0);
    if (isAdminProfile() && $("#admin-pending-count")) $("#admin-pending-count").textContent = String(pending);
    if ($("#admin-approved-questions-count")) $("#admin-approved-questions-count").textContent = String(approvedQuestions.count || 0);
    if ($("#admin-approved-answers-count")) $("#admin-approved-answers-count").textContent = String(approvedAnswers.count || 0);

    const badge = $("#admin-menu-badge");
    if (badge) {
      badge.textContent = String(localPending);
      badge.hidden = localPending === 0;
    }
    if (isAdminProfile()) {
      document.title = pending > 0
        ? `(${pending}) Административен панел | Попитай.Лом`
        : "Административен панел | Попитай.Лом";
    }
  }

  function recordCard(item, type, mode) {
    const isListing = type === "listing";
    const isQuestion = type === "question";
    const ownModeratorContent = isModeratorProfile() && Boolean(currentUser?.id) && (
      isListing
        ? (item.owner_id === currentUser.id || item.author_id === currentUser.id)
        : item.author_id === currentUser.id
    );

    const title = isListing
      ? `${item.listing_type || ""} · ${item.title}`
      : isQuestion ? item.title : `Отговор към въпрос ${item.question_id}`;
    const text = isListing
      ? `${item.category || ""}${item.city ? " · " + item.city : ""}${item.phone ? " · " + item.phone : ""}`
      : isQuestion ? item.description : item.body;

    const viewLink = isQuestion && item.status === "approved"
      ? `<a class="admin-action-secondary" href="vapros.html?id=${encodeURIComponent(item.id)}" target="_blank" rel="noopener">Отвори</a>`
      : isListing
      ? `<a class="admin-action-preview" href="obqva.html?id=${encodeURIComponent(item.id)}" target="_blank" rel="noopener">Преглед на обявата</a>`
      : "";

    const listingDescription = isListing && item.description
      ? `<p class="admin-listing-description"><strong>Описание:</strong><br>${escapeHtml(item.description)}</p>`
      : "";

    const listingMedia = isListing && item._media?.length
      ? `<div class="admin-listing-media">${item._media.map((media) => {
          const url = mediaPublicUrl(media.storage_path);
          return url
            ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener" title="Отвори снимката"><img src="${escapeHtml(url)}" alt="${escapeHtml(item.title)}" loading="lazy"></a>`
            : "";
        }).join("")}</div>`
      : isListing
      ? '<p style="color:#8a2020;font-weight:700">Няма записани снимки към тази обява.</p>'
      : "";

    const extendedChecks = isListing && mode === "pending" ? `
      <div style="margin:10px 0;padding:10px;background:#f4f6fa;border-radius:8px;display:flex;flex-wrap:wrap;gap:10px">
        <label style="display:flex;align-items:center;gap:6px;font-size:13px;font-weight:700;cursor:pointer"><input type="checkbox" class="listing-ext-check" data-ext="is_urgent" data-id="${escapeHtml(item.id)}"> Спешно</label>
        <label style="display:flex;align-items:center;gap:6px;font-size:13px;font-weight:700;cursor:pointer"><input type="checkbox" class="listing-ext-check" data-ext="is_reduced" data-id="${escapeHtml(item.id)}"> Намалено</label>
        <label style="display:flex;align-items:center;gap:6px;font-size:13px;font-weight:700;cursor:pointer"><input type="checkbox" class="listing-ext-check" data-ext="is_boosted" data-id="${escapeHtml(item.id)}"> Горно позициониране</label>
        <label style="display:flex;align-items:center;gap:6px;font-size:13px;font-weight:700;cursor:pointer"><input type="checkbox" class="listing-ext-check" data-ext="is_highlighted" data-id="${escapeHtml(item.id)}"> Highlighted</label>
        <label style="display:flex;align-items:center;gap:6px;font-size:13px;font-weight:700;cursor:pointer"><input type="checkbox" class="listing-ext-check" data-ext="show_stats" data-id="${escapeHtml(item.id)}"> Статистики</label>
        <label style="display:flex;align-items:center;gap:6px;font-size:13px;font-weight:700;cursor:pointer"><input type="checkbox" class="listing-ext-check" data-ext="show_contact_buttons" data-id="${escapeHtml(item.id)}"> Плаващи бутони</label>
      </div>` : "";

    const extendedPublished = isListing && mode === "published" ? `
      <div style="margin:8px 0;font-size:12px;color:#59657a">
        ${item.is_urgent ? "🔴 Спешно " : ""}${item.is_boosted ? "⬆ Горно " : ""}${item.is_highlighted ? "✨ Highlighted " : ""}${item.show_contact_buttons ? "📞 Бутони " : ""}
      </div>` : "";

    let actions = "";
    if (ownModeratorContent) {
      actions = `${viewLink}<span class="admin-status">Собствено съдържание — без модераторски действия</span>`;
    } else if (mode === "pending") {
      actions = `${viewLink}
        <button class="admin-action-approve" data-admin-action="approve" data-type="${type}" data-id="${escapeHtml(item.id)}">Одобри</button>
        <button class="admin-action-hide" data-admin-action="changes" data-type="${type}" data-id="${escapeHtml(item.id)}">Върни за корекция</button>
        <button class="admin-action-delete" data-admin-action="reject" data-type="${type}" data-id="${escapeHtml(item.id)}">Откажи</button>
        <button class="admin-action-delete" data-admin-action="delete" data-type="${type}" data-id="${escapeHtml(item.id)}">Изтрий</button>`;
    } else if (mode === "published") {
      actions = `${viewLink}
        <button class="admin-action-hide" data-admin-action="hide" data-type="${type}" data-id="${escapeHtml(item.id)}">Скрий</button>
        <button class="admin-action-delete" data-admin-action="delete" data-type="${type}" data-id="${escapeHtml(item.id)}">Изтрий окончателно</button>`;
    } else {
      actions = `
        <button class="admin-action-approve" data-admin-action="restore" data-type="${type}" data-id="${escapeHtml(item.id)}">Публикувай отново</button>
        <button class="admin-action-delete" data-admin-action="delete" data-type="${type}" data-id="${escapeHtml(item.id)}">Изтрий окончателно</button>`;
    }

    const typeLabel = isListing ? "Обява" : isQuestion ? "Въпрос" : "Отговор";

    return `<article class="admin-record">
      <div class="admin-record-meta">${statusBadge(item.status)}<span>${formatDate(item.created_at)}</span><span>${typeLabel}</span></div>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(text)}</p>
      ${listingDescription}
      ${listingMedia}
      ${item.moderation_note ? `<p><strong>Бележка:</strong> ${escapeHtml(item.moderation_note)}</p>` : ""}
      ${extendedChecks}
      ${extendedPublished}
      <div class="admin-record-actions">${actions}</div>
    </article>`;
  }

  async function loadPending() {
    const [qResult, aResult, lResult] = await Promise.all([
      client.from("questions").select("id, title, description, status, moderation_note, created_at, author_id").eq("status", "pending").order("created_at", { ascending: false }),
      client.from("answers").select("id, question_id, body, status, moderation_note, created_at, author_id").eq("status", "pending").order("created_at", { ascending: false }),
      client.from("listings").select("id, title, description, category, listing_type, phone, city, status, moderation_note, created_at, owner_id, author_id").eq("status", "pending").order("created_at", { ascending: false })
    ]);
    if (qResult.error || aResult.error || lResult.error) throw qResult.error || aResult.error || lResult.error;

    const moderatorId = isModeratorProfile() ? currentUser?.id : null;
    const questions = (qResult.data || []).filter(item => !moderatorId || item.author_id !== moderatorId);
    const answers = (aResult.data || []).filter(item => !moderatorId || item.author_id !== moderatorId);
    const listings = (lResult.data || []).filter(item => !moderatorId || (item.owner_id !== moderatorId && item.author_id !== moderatorId));
    const listingItems = await attachListingMedia(listings);
    const queue = [
      ...questions.map((item) => ({ ...item, _type: "question" })),
      ...answers.map((item) => ({ ...item, _type: "answer" })),
      ...listingItems.map((item) => ({ ...item, _type: "listing" }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return queue.length
      ? queue.map((item) => recordCard(item, item._type, "pending")).join("")
      : '<article class="empty-card"><h3>Няма съдържание за преглед</h3><p>Всички нови въпроси, отговори и обяви са обработени.</p></article>';
  }

  async function loadPublished(type) {
    const table = type === "question" ? "questions" : "answers";
    const fields = type === "question"
      ? "id, title, description, status, moderation_note, created_at, author_id"
      : "id, question_id, body, status, moderation_note, created_at, author_id";
    const { data, error } = await client.from(table).select(fields).eq("status", "approved").order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).length
      ? data.map((item) => recordCard(item, type, "published")).join("")
      : `<article class="empty-card"><p>Няма публикувани ${type === "question" ? "въпроси" : "отговори"}.</p></article>`;
  }

  async function loadListingsAdmin(statusFilter = "approved") {
    const { data, error } = await client.from("listings")
      .select("id, title, description, category, listing_type, phone, city, status, moderation_note, created_at, owner_id, author_id, is_urgent, is_reduced, is_boosted, is_highlighted, show_stats, show_contact_buttons, expires_at")
      .eq("status", statusFilter)
      .order("created_at", { ascending: false });
    if (error) throw error;
    const items = await attachListingMedia(data || []);
    if (!items.length) return `<article class="empty-card"><p>Няма обяви.</p></article>`;
    return items.map(item => recordCard({ ...item, _type: "listing" }, "listing", statusFilter === "approved" ? "published" : "hidden")).join("");
  }

  async function loadHidden() {
    const [qResult, aResult, lResult] = await Promise.all([
      client.from("questions").select("id, title, description, status, moderation_note, created_at, author_id").in("status", ["rejected", "needs_changes"]).order("created_at", { ascending: false }),
      client.from("answers").select("id, question_id, body, status, moderation_note, created_at, author_id").in("status", ["rejected", "needs_changes"]).order("created_at", { ascending: false }),
      client.from("listings").select("id, title, description, category, listing_type, phone, city, status, moderation_note, created_at, owner_id, author_id").in("status", ["rejected", "needs_changes"]).order("created_at", { ascending: false })
    ]);
    if (qResult.error || aResult.error || lResult.error) throw qResult.error || aResult.error || lResult.error;
    const hiddenListings = await attachListingMedia(lResult.data || []);
    const records = [
      ...(qResult.data || []).map((item) => ({ ...item, _type: "question" })),
      ...(aResult.data || []).map((item) => ({ ...item, _type: "answer" })),
      ...hiddenListings.map((item) => ({ ...item, _type: "listing" }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return records.length
      ? records.map((item) => recordCard(item, item._type, "hidden")).join("")
      : '<article class="empty-card"><p>Няма скрито или отказано съдържание.</p></article>';
  }

  async function loadUsers() {
    const { data, error } = await client.from("profiles").select("id, display_name, role, is_blocked, created_at").order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((profile) => `
      <article class="admin-record admin-user-row">
        <div>
          <h3>${escapeHtml(profile.display_name)}</h3>
          <small>Роля: ${escapeHtml(roleLabel(profile.role))} · Регистрация: ${formatDate(profile.created_at)}</small>
        </div>
        <div class="admin-record-actions">${userManagementActions(profile)}</div>
      </article>
    `).join("") || '<article class="empty-card"><p>Няма потребители.</p></article>';
  }

  async function loadView(view = activeView) {
    activeView = view;
    const container = $("#admin-view-content");
    const title = $("#admin-view-title");
    if (!container || !title) return;

    const titles = {
      pending: "Чакащи за одобрение",
      questions: "Публикувани въпроси",
      answers: "Публикувани отговори",
      listings: "Обяви",
      hidden: "Скрити и отказани",
      users: "Потребители",
      contacts: "Съобщения от контактната форма"
    };
    title.textContent = titles[view] || titles.pending;
    container.innerHTML = '<article class="empty-card"><p>Зареждане…</p></article>';
    setMessage("");

    try {
      if (view === "dashboard") { renderDashboard(); return; }
      else if (view === "pending") container.innerHTML = await loadPending();
      else if (view === "questions") container.innerHTML = await loadPublished("question");
      else if (view === "answers") container.innerHTML = await loadPublished("answer");
      else if (view === "listings") container.innerHTML = await loadListingsAdmin();
      else if (view === "hidden") container.innerHTML = await loadHidden();
      else if (view === "users") container.innerHTML = await loadUsers();
      else if (view === "contacts" && isAdminProfile()) container.innerHTML = await loadContacts();
      else throw new Error("Нямаш достъп до този раздел.");
    } catch (error) {
      container.innerHTML = '<article class="empty-card"><p>Данните не могат да се заредят.</p></article>';
      setMessage(errorText(error), true);
    }
  }

  async function loadContacts() {
    const { data, error } = await client
      .from("contact_messages")
      .select("id, name, email, message, created_at, is_read")
      .order("created_at", { ascending: false });
    if (error) throw error;
    const items = data || [];
    if (!items.length) return '<article class="empty-card"><p>Няма получени съобщения.</p></article>';
    return items.map(item => `
      <article class="db-profile-item" style="border-left:3px solid ${item.is_read ? "#d7deea" : "#0b5fd7"}">
        <div class="db-moderation-meta">
          <span style="font-weight:800">${escapeHtml(item.name)}</span>
          <a href="mailto:${escapeHtml(item.email)}">${escapeHtml(item.email)}</a>
          <span>${formatDate(item.created_at)}</span>
        </div>
        <p style="margin:8px 0 0;white-space:pre-wrap">${escapeHtml(item.message)}</p>
        ${!item.is_read ? `<button type="button" style="margin-top:10px;padding:6px 14px;border:1px solid #d7deea;border-radius:8px;background:#fff;cursor:pointer;font-weight:800" onclick="markContactRead('${item.id}', this)">Маркирай като прочетено</button>` : ""}
      </article>`).join("");
  }

  window.markContactRead = async (id, btn) => {
    await client.from("contact_messages").update({ is_read: true }).eq("id", id);
    btn.closest("article").style.borderLeftColor = "#d7deea";
    btn.remove();
  };

  async function updateStatus(type, id, status, note = "", extFeatures = {}) {
    const table = type === "listing" ? "listings" : type === "question" ? "questions" : "answers";
    const updateData = {
      status,
      moderation_note: note,
      reviewed_by: currentUser.id,
      reviewed_at: new Date().toISOString(),
      ...extFeatures
    };
    return client.from(table).update(updateData).eq("id", id);
  }

  function getExtendedFeatures(id) {
    const checks = document.querySelectorAll(`.listing-ext-check[data-id="${id}"]`);
    const features = {};
    checks.forEach(c => { features[c.dataset.ext] = c.checked; });
    return features;
  }

  async function performAction(button) {
    const action = button.dataset.adminAction;
    const type = button.dataset.type;
    const id = button.dataset.id;
    const table = type === "listing" ? "listings" : type === "question" ? "questions" : "answers";
    let result;

    if (action === "approve" || action === "restore") {
      const extFeatures = type === "listing" ? getExtendedFeatures(id) : {};
      result = await updateStatus(type, id, "approved", "", extFeatures);
    } else if (action === "changes") {
      const note = window.prompt("Какво трябва да се коригира?")?.trim();
      if (!note) return;
      result = await updateStatus(type, id, "needs_changes", note);
    } else if (action === "reject") {
      const note = window.prompt("Причина за отказа:")?.trim();
      if (!note) return;
      result = await updateStatus(type, id, "rejected", note);
    } else if (action === "hide") {
      const note = window.prompt("Причина за скриването:", "Скрито от администратор")?.trim();
      if (!note) return;
      result = await updateStatus(type, id, "rejected", note);
    } else if (action === "delete") {
      const confirmed = window.confirm("Това ще изтрие съдържанието окончателно и не може да се върне. Продължаваш ли?");
      if (!confirmed) return;
      result = await client.from(table).delete().eq("id", id);
    } else if (action === "appoint-moderator" || action === "remove-moderator") {
      const enabled = action === "appoint-moderator";
      const promptText = enabled
        ? "Да назнача ли този потребител за модератор?"
        : "Да премахна ли модераторските права на този потребител?";
      if (!window.confirm(promptText)) return;
      result = await client.rpc("admin_set_moderator", {
        p_target_id: id,
        p_enabled: enabled
      });
    } else if (action === "block" || action === "unblock") {
      const blocked = action === "block";
      if (blocked && !window.confirm("Да блокирам ли този потребител?")) return;
      result = await client.rpc("staff_set_user_blocked", {
        p_target_id: id,
        p_blocked: blocked
      });
    } else {
      return;
    }

    if (result.error) {
      setMessage(errorText(result.error), true);
      return;
    }

    setMessage("Промяната е записана успешно.");
    await Promise.all([refreshCounts(), loadView(activeView)]);
  }

  async function handleClick(event) {
    const externalModuleButton = event.target.closest(".admin-menu button:not([data-admin-view]):not([data-admin-group-toggle]):not([data-admin-menu-collapse])");
    if (externalModuleButton) {
      activeView = "external";
      syncMobileNav(
        externalModuleButton.closest('[data-admin-menu-group="review"]') ? "review" :
        externalModuleButton.closest('[data-admin-menu-group="content"]') ? "content" : "menu"
      );
    }

    const viewButton = event.target.closest("[data-admin-view]");
    if (viewButton) {
      event.preventDefault();
      $$(".admin-menu button").forEach((item) => {
        if (!item.hasAttribute("data-admin-group-toggle") && !item.hasAttribute("data-admin-menu-collapse")) {
          item.classList.toggle("active", item === viewButton);
        }
      });
      if (viewButton.dataset.adminView === "dashboard") setOpenGroup("");
      syncMobileNav(
        viewButton.dataset.adminView === "dashboard" ? "dashboard" :
        viewButton.closest('[data-admin-menu-group="review"]') ? "review" :
        viewButton.closest('[data-admin-menu-group="content"]') ? "content" : "menu"
      );
      await loadView(viewButton.dataset.adminView);
      return;
    }

    const actionButton = event.target.closest("[data-admin-action]");
    if (!actionButton) return;
    event.preventDefault();
    actionButton.disabled = true;
    try {
      await performAction(actionButton);
    } finally {
      actionButton.disabled = false;
    }
  }

  async function init() {
    const staff = await loadAuth();
    setupLayout();
    if (!staff) {
      $("#admin-view-content").innerHTML = '<article class="empty-card"><h3>Нямаш достъп</h3><p>Страницата е само за администратори и модератори.</p></article>';
      $$(".admin-stats, .admin-menu").forEach((element) => { element.hidden = true; });
      return;
    }

    await refreshCounts();
    if (activeView === "dashboard") await loadView("dashboard");
    window.setInterval(async () => {
      await refreshCounts();
      if (activeView === "pending") await loadView("pending");
      if (activeView === "dashboard") renderDashboard();
    }, 60000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
