// Попитай.Лом — реален административен панел за Supabase
(() => {
  const client = window.PopitaiSupabase;
  if (!client) return;

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
  let activeView = "pending";

  const styles = document.createElement("style");
  styles.textContent = `
    .admin-menu button{display:flex;align-items:center;justify-content:space-between;gap:.6rem;width:100%}
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
    .admin-user-row{display:grid;grid-template-columns:1fr auto;gap:1rem;align-items:center}
    .admin-user-row small{display:block;color:#52627a;margin-top:.25rem}
    @media(max-width:720px){.admin-user-row{grid-template-columns:1fr}.admin-record-actions>*{flex:1;justify-content:center}}
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

  function setupLayout() {
    const testTools = $(".admin-test-tools");
    if (testTools) testTools.hidden = true;

    const stats = $(".admin-stats");
    if (stats) {
      stats.innerHTML = `
        <article><strong id="admin-users-count">0</strong><span>Потребители</span></article>
        <article><strong id="admin-pending-count">0</strong><span>Чакащи</span></article>
        <article><strong id="admin-approved-questions-count">0</strong><span>Въпроси</span></article>
        <article><strong id="admin-approved-answers-count">0</strong><span>Отговори</span></article>`;
    }

    const menu = $(".admin-menu");
    if (menu) {
      menu.innerHTML = `
        <button class="active" type="button" data-admin-view="pending">Чакащи <span class="admin-badge" id="admin-menu-badge" hidden>0</span></button>
        <button type="button" data-admin-view="questions">Публикувани въпроси</button>
        <button type="button" data-admin-view="answers">Публикувани отговори</button>
        <button type="button" data-admin-view="hidden">Скрити/отказани</button>
        <button type="button" data-admin-view="users">Потребители</button>`;
    }

    const content = $(".admin-content");
    if (content) {
      content.innerHTML = `
        <div class="block-heading"><h2 id="admin-view-title">Чакащи за одобрение</h2></div>
        <p class="admin-panel-message" id="admin-panel-message" hidden></p>
        <div id="admin-view-content" class="stack-list"><article class="empty-card"><p>Зареждане…</p></article></div>`;
    }

    document.addEventListener("click", handleClick);
  }

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
    const [users, pendingQuestions, pendingAnswers, approvedQuestions, approvedAnswers] = await Promise.all([
      client.from("profiles").select("id", { count: "exact", head: true }),
      client.from("questions").select("id", { count: "exact", head: true }).eq("status", "pending"),
      client.from("answers").select("id", { count: "exact", head: true }).eq("status", "pending"),
      client.from("questions").select("id", { count: "exact", head: true }).eq("status", "approved"),
      client.from("answers").select("id", { count: "exact", head: true }).eq("status", "approved")
    ]);

    const pending = (pendingQuestions.count || 0) + (pendingAnswers.count || 0);
    if ($("#admin-users-count")) $("#admin-users-count").textContent = String(users.count || 0);
    if ($("#admin-pending-count")) $("#admin-pending-count").textContent = String(pending);
    if ($("#admin-approved-questions-count")) $("#admin-approved-questions-count").textContent = String(approvedQuestions.count || 0);
    if ($("#admin-approved-answers-count")) $("#admin-approved-answers-count").textContent = String(approvedAnswers.count || 0);

    const badge = $("#admin-menu-badge");
    if (badge) {
      badge.textContent = String(pending);
      badge.hidden = pending === 0;
    }
    document.title = pending > 0
      ? `(${pending}) Административен панел | Попитай.Лом`
      : "Административен панел | Попитай.Лом";
  }

  function recordCard(item, type, mode) {
    const isQuestion = type === "question";
    const title = isQuestion ? item.title : `Отговор към въпрос ${item.question_id}`;
    const text = isQuestion ? item.description : item.body;
    const viewLink = isQuestion && item.status === "approved"
      ? `<a class="admin-action-secondary" href="vapros.html?id=${encodeURIComponent(item.id)}" target="_blank" rel="noopener">Отвори</a>`
      : "";

    let actions = "";
    if (mode === "pending") {
      actions = `
        <button class="admin-action-approve" data-admin-action="approve" data-type="${type}" data-id="${escapeHtml(item.id)}">Одобри</button>
        <button class="admin-action-hide" data-admin-action="changes" data-type="${type}" data-id="${escapeHtml(item.id)}">Върни за корекция</button>
        <button class="admin-action-delete" data-admin-action="reject" data-type="${type}" data-id="${escapeHtml(item.id)}">Откажи</button>`;
    } else if (mode === "published") {
      actions = `${viewLink}
        <button class="admin-action-hide" data-admin-action="hide" data-type="${type}" data-id="${escapeHtml(item.id)}">Скрий</button>
        <button class="admin-action-delete" data-admin-action="delete" data-type="${type}" data-id="${escapeHtml(item.id)}">Изтрий окончателно</button>`;
    } else {
      actions = `
        <button class="admin-action-approve" data-admin-action="restore" data-type="${type}" data-id="${escapeHtml(item.id)}">Публикувай отново</button>
        <button class="admin-action-delete" data-admin-action="delete" data-type="${type}" data-id="${escapeHtml(item.id)}">Изтрий окончателно</button>`;
    }

    return `<article class="admin-record">
      <div class="admin-record-meta">${statusBadge(item.status)}<span>${formatDate(item.created_at)}</span><span>${isQuestion ? "Въпрос" : "Отговор"}</span></div>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(text)}</p>
      ${item.moderation_note ? `<p><strong>Бележка:</strong> ${escapeHtml(item.moderation_note)}</p>` : ""}
      <div class="admin-record-actions">${actions}</div>
    </article>`;
  }

  async function loadPending() {
    const [qResult, aResult] = await Promise.all([
      client.from("questions").select("id, title, description, status, moderation_note, created_at").eq("status", "pending").order("created_at", { ascending: false }),
      client.from("answers").select("id, question_id, body, status, moderation_note, created_at").eq("status", "pending").order("created_at", { ascending: false })
    ]);
    if (qResult.error || aResult.error) throw qResult.error || aResult.error;

    const queue = [
      ...(qResult.data || []).map((item) => ({ ...item, _type: "question" })),
      ...(aResult.data || []).map((item) => ({ ...item, _type: "answer" }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return queue.length
      ? queue.map((item) => recordCard(item, item._type, "pending")).join("")
      : '<article class="empty-card"><h3>Няма съдържание за преглед</h3><p>Всички нови въпроси и отговори са обработени.</p></article>';
  }

  async function loadPublished(type) {
    const table = type === "question" ? "questions" : "answers";
    const fields = type === "question"
      ? "id, title, description, status, moderation_note, created_at"
      : "id, question_id, body, status, moderation_note, created_at";
    const { data, error } = await client.from(table).select(fields).eq("status", "approved").order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).length
      ? data.map((item) => recordCard(item, type, "published")).join("")
      : `<article class="empty-card"><p>Няма публикувани ${type === "question" ? "въпроси" : "отговори"}.</p></article>`;
  }

  async function loadHidden() {
    const [qResult, aResult] = await Promise.all([
      client.from("questions").select("id, title, description, status, moderation_note, created_at").in("status", ["rejected", "needs_changes"]).order("created_at", { ascending: false }),
      client.from("answers").select("id, question_id, body, status, moderation_note, created_at").in("status", ["rejected", "needs_changes"]).order("created_at", { ascending: false })
    ]);
    if (qResult.error || aResult.error) throw qResult.error || aResult.error;
    const records = [
      ...(qResult.data || []).map((item) => ({ ...item, _type: "question" })),
      ...(aResult.data || []).map((item) => ({ ...item, _type: "answer" }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return records.length
      ? records.map((item) => recordCard(item, item._type, "hidden")).join("")
      : '<article class="empty-card"><p>Няма скрито или отказано съдържание.</p></article>';
  }

  async function loadUsers() {
    const { data, error } = await client.from("profiles").select("id, display_name, role, is_blocked, created_at").order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((profile) => {
      const isSelf = profile.id === currentUser.id;
      return `<article class="admin-record admin-user-row">
        <div><h3>${escapeHtml(profile.display_name)}</h3><small>Роля: ${escapeHtml(profile.role)} · Регистрация: ${formatDate(profile.created_at)}</small></div>
        <div class="admin-record-actions">
          ${isSelf ? '<span class="admin-status approved">Твоят профил</span>' : `<button class="${profile.is_blocked ? "admin-action-approve" : "admin-action-delete"}" data-admin-action="${profile.is_blocked ? "unblock" : "block"}" data-id="${escapeHtml(profile.id)}">${profile.is_blocked ? "Разблокирай" : "Блокирай"}</button>`}
        </div>
      </article>`;
    }).join("") || '<article class="empty-card"><p>Няма потребители.</p></article>';
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
      hidden: "Скрити и отказани",
      users: "Потребители"
    };
    title.textContent = titles[view] || titles.pending;
    container.innerHTML = '<article class="empty-card"><p>Зареждане…</p></article>';
    setMessage("");

    try {
      if (view === "pending") container.innerHTML = await loadPending();
      else if (view === "questions") container.innerHTML = await loadPublished("question");
      else if (view === "answers") container.innerHTML = await loadPublished("answer");
      else if (view === "hidden") container.innerHTML = await loadHidden();
      else if (view === "users") container.innerHTML = await loadUsers();
    } catch (error) {
      container.innerHTML = '<article class="empty-card"><p>Данните не могат да се заредят.</p></article>';
      setMessage(errorText(error), true);
    }
  }

  async function updateStatus(type, id, status, note = "") {
    const table = type === "question" ? "questions" : "answers";
    return client.from(table).update({
      status,
      moderation_note: note,
      reviewed_by: currentUser.id,
      reviewed_at: new Date().toISOString()
    }).eq("id", id);
  }

  async function performAction(button) {
    const action = button.dataset.adminAction;
    const type = button.dataset.type;
    const id = button.dataset.id;
    const table = type === "question" ? "questions" : "answers";
    let result;

    if (action === "approve" || action === "restore") {
      result = await updateStatus(type, id, "approved", "");
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
    } else if (action === "block" || action === "unblock") {
      const blocked = action === "block";
      if (blocked && !window.confirm("Да блокирам ли този потребител?")) return;
      result = await client.from("profiles").update({ is_blocked: blocked }).eq("id", id);
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
    const viewButton = event.target.closest("[data-admin-view]");
    if (viewButton) {
      event.preventDefault();
      $$("[data-admin-view]").forEach((item) => item.classList.toggle("active", item === viewButton));
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
    setupLayout();
    const staff = await loadAuth();
    if (!staff) {
      $("#admin-view-content").innerHTML = '<article class="empty-card"><h3>Нямаш достъп</h3><p>Страницата е само за администратори и модератори.</p></article>';
      $$(".admin-stats, .admin-menu").forEach((element) => { element.hidden = true; });
      return;
    }

    await Promise.all([refreshCounts(), loadView("pending")]);
    window.setInterval(async () => {
      await refreshCounts();
      if (activeView === "pending") await loadView("pending");
    }, 60000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
