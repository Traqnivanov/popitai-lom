// Попитай.Лом — администраторско управление на разширени фирмени профили
(() => {
  "use strict";

  const client = window.PopitaiSupabase;
  if (!client) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  let currentUser = null;
  let currentRole = null;
  let initialized = false;

  function isAdmin() {
    return currentRole === "admin";
  }

  function isModerator() {
    return currentRole === "moderator";
  }

  function setMessage(text, isError = false) {
    const box = $("#admin-panel-message");
    if (!box) return;
    box.textContent = text || "";
    box.hidden = !text;
    box.classList.toggle("error", isError);
  }

  function formatDate(value) {
    if (!value) return "";
    try {
      return new Intl.DateTimeFormat("bg-BG", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      }).format(new Date(value));
    } catch (_) {
      return "";
    }
  }

  async function authIsStaff() {
    const { data, error } = await client.auth.getUser();
    currentUser = error ? null : data?.user || null;
    if (!currentUser) return false;

    const { data: profile, error: profileError } = await client
      .from("profiles")
      .select("role, is_blocked")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (profileError || !profile) return false;
    currentRole = profile.role;
    return ["admin", "moderator"].includes(profile.role) && profile.is_blocked !== true;
  }

  function ensureMenuButton() {
    const review = $('.admin-menu [data-admin-menu-group-items="review"]');
    if (!review) return false;
    if ($("[data-expanded-businesses-view]", review)) return true;

    const button = document.createElement("button");
    button.type = "button";
    button.dataset.expandedBusinessesView = "true";
    button.textContent = "Разширени профили";
    review.append(button);
    return true;
  }

  async function waitForMenuButton() {
    for (let i = 0; i < 60; i += 1) {
      if (ensureMenuButton()) return true;
      await new Promise(resolve => window.setTimeout(resolve, 50));
    }
    return false;
  }

  function draftDetails(draft) {
    if (!draft) return "";

    const fields = [
      ["Кратко представяне", draft.short_intro],
      ["Сайт", draft.website],
      ["Услуги", Array.isArray(draft.services) ? draft.services.join(", ") : ""],
      ["Район", draft.service_area],
      ["Работно време", draft.work_hours]
    ].filter(([, value]) => String(value || "").trim());

    const visible = [
      draft.show_short_intro ? "Кратко представяне" : "",
      draft.show_website ? "Сайт" : "",
      draft.show_services ? "Услуги" : "",
      draft.show_service_area ? "Район" : "",
      draft.show_work_hours ? "Работно време" : ""
    ].filter(Boolean);

    return `
      <div style="margin-top:12px;padding:12px;border:1px solid #d7deea;border-radius:12px;background:#f8fafc">
        <p style="margin:0 0 8px"><strong>Редакция на разширения профил:</strong> ${escapeHtml(draft.status || "")}${draft.updated_at ? ` · ${escapeHtml(formatDate(draft.updated_at))}` : ""}</p>
        ${draft.moderation_note ? `<p style="margin:0 0 8px"><strong>Бележка:</strong> ${escapeHtml(draft.moderation_note)}</p>` : ""}
        ${fields.map(([label, value]) => `<p style="margin:4px 0"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`).join("")}
        <p style="margin:8px 0 0"><strong>Избрано за публично показване:</strong> ${escapeHtml(visible.join(", ") || "няма")}</p>
      </div>`;
  }

  function businessCard(item, ownerProfile, draft) {
    const ownerIsAdmin = ownerProfile?.role === "admin" && ownerProfile?.is_blocked !== true;
    const ownedByCurrentUser = item.owner_id === currentUser?.id;
    const accessText = item.is_expanded ? "Разширен профил: включен" : "Разширен профил: изключен";

    let accessAction = "";
    if (ownerIsAdmin) {
      accessAction = '<span style="font-weight:800;color:#176438">Автоматичен достъп за администраторска фирма</span>';
    } else if (isAdmin()) {
      accessAction = item.is_expanded
        ? `<button type="button" class="admin-action-hide" data-expanded-action="revoke" data-id="${escapeHtml(item.id)}">Отнеми разширения профил</button>`
        : `<button type="button" class="admin-action-approve" data-expanded-action="grant" data-id="${escapeHtml(item.id)}">Дай разширен профил</button>`;
    } else {
      accessAction = '<span class="admin-status">Разширеният достъп се управлява само от Admin</span>';
    }

    let draftActions = "";
    if (draft?.status === "pending" && item.is_expanded) {
      if (isModerator() && ownedByCurrentUser) {
        draftActions = '<span class="admin-status">Твоя редакция — трябва да бъде обработена от друг Moderator или Admin</span>';
      } else {
        draftActions = `
          <button type="button" class="admin-action-approve" data-expanded-action="approve-draft" data-id="${escapeHtml(item.id)}">Одобри редакцията</button>
          <button type="button" class="admin-action-hide" data-expanded-action="return-draft" data-id="${escapeHtml(item.id)}">Върни за корекция</button>`;
      }
    }

    return `<article class="admin-record">
      <div class="admin-record-meta">
        <span>${escapeHtml(item.status || "")}</span>
        <span>${escapeHtml(accessText)}</span>
      </div>
      <h3>${escapeHtml(item.name)}</h3>
      <p><strong>Собственик:</strong> ${ownerIsAdmin ? "администратор" : ownedByCurrentUser && isModerator() ? "модератор (твоя фирма)" : "потребител"}</p>
      ${draftDetails(draft)}
      <div class="admin-record-actions" style="margin-top:12px">
        ${accessAction}
        ${item.is_expanded ? `<a class="admin-action-secondary" href="firma.html?id=${encodeURIComponent(item.id)}" target="_blank" rel="noopener">Публичен профил</a>` : ""}
        ${draftActions}
      </div>
    </article>`;
  }

  async function loadExpandedBusinesses() {
    const title = $("#admin-view-title");
    const container = $("#admin-view-content");
    if (!title || !container) return;

    title.textContent = "Разширени фирмени профили";
    container.innerHTML = '<article class="empty-card"><p>Зареждане…</p></article>';
    setMessage("");

    const { data: businesses, error: businessError } = await client
      .from("businesses")
      .select("id, owner_id, name, status, is_expanded, created_at")
      .order("created_at", { ascending: false });

    if (businessError) {
      container.innerHTML = '<article class="empty-card"><p>Фирмите не могат да се заредят.</p></article>';
      setMessage("Разширените профили не могат да се заредят.", true);
      return;
    }

    const rows = businesses || [];
    if (!rows.length) {
      container.innerHTML = '<article class="empty-card"><p>Няма фирми.</p></article>';
      return;
    }

    const ownerIds = [...new Set(rows.map((item) => item.owner_id).filter(Boolean))];
    const businessIds = rows.map((item) => item.id);

    const [profilesResult, draftsResult] = await Promise.all([
      ownerIds.length
        ? client.from("profiles").select("id, role, is_blocked").in("id", ownerIds)
        : Promise.resolve({ data: [], error: null }),
      businessIds.length
        ? client.from("business_expanded_profile_drafts")
            .select("business_id, short_intro, website, services, service_area, work_hours, show_short_intro, show_website, show_services, show_service_area, show_work_hours, status, moderation_note, updated_at")
            .in("business_id", businessIds)
        : Promise.resolve({ data: [], error: null })
    ]);

    if (profilesResult.error || draftsResult.error) {
      setMessage("Част от данните за разширените профили не могат да се заредят.", true);
    }

    const profilesById = new Map((profilesResult.data || []).map((row) => [row.id, row]));
    const draftsByBusiness = new Map((draftsResult.data || []).map((row) => [row.business_id, row]));

    container.innerHTML = rows
      .map((item) => businessCard(item, profilesById.get(item.owner_id), draftsByBusiness.get(item.id)))
      .join("");
  }

  async function performAction(button) {
    const action = button.dataset.expandedAction;
    const businessId = button.dataset.id;
    if (!action || !businessId) return;

    let result;

    if (action === "grant" || action === "revoke") {
      if (!isAdmin()) {
        setMessage("Само Admin може да дава или отнема разширен достъп.", true);
        return;
      }
      const enable = action === "grant";
      const promptText = enable
        ? "Да се даде ли разширен профил на тази фирма?"
        : "Да се отнеме ли разширеният профил? Данните ще се запазят, но няма да се показват като разширен профил.";
      if (!window.confirm(promptText)) return;

      result = await client.rpc("admin_set_business_expanded_access", {
        p_business_id: businessId,
        p_enabled: enable
      });
    } else if (action === "approve-draft") {
      if (!window.confirm("Да се публикува ли тази редакция на разширения профил?")) return;
      result = await client.rpc("publish_business_expanded_profile_draft", {
        p_business_id: businessId
      });
    } else if (action === "return-draft") {
      const note = window.prompt("Какво трябва да се коригира?")?.trim();
      if (!note) return;
      result = await client.rpc("return_business_expanded_profile_draft", {
        p_business_id: businessId,
        p_moderation_note: note
      });
    } else {
      return;
    }

    if (result.error) {
      setMessage(result.error.message || "Промяната не може да се запише.", true);
      return;
    }

    setMessage("Промяната е записана успешно.");
    await loadExpandedBusinesses();
  }

  async function init() {
    if (initialized) return;
    initialized = true;

    if (!(await authIsStaff())) return;

    if (!(await waitForMenuButton())) return;

    document.addEventListener("click", async (event) => {
      const viewButton = event.target.closest("[data-expanded-businesses-view]");
      if (viewButton) {
        event.preventDefault();
        event.stopImmediatePropagation();
        document.querySelectorAll(".admin-menu button").forEach((item) => item.classList.toggle("active", item === viewButton));
        await loadExpandedBusinesses();
        return;
      }

      const actionButton = event.target.closest("[data-expanded-action]");
      if (!actionButton) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      actionButton.disabled = true;
      try {
        await performAction(actionButton);
      } finally {
        actionButton.disabled = false;
      }
    }, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();