// Попитай.Лом — разширени фирмени профили: review queue + Admin access management
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
  let activeView = null;

  const isAdmin = () => currentRole === "admin";
  const isModerator = () => currentRole === "moderator";

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

  function ensureMenuButtons() {
    const review = $('.admin-menu [data-admin-menu-group-items="review"]');
    const management = $('.admin-menu [data-admin-menu-group-items="management"]');
    if (!review || !management) return false;

    let reviewButton = $("[data-expanded-businesses-view]", review);
    if (!reviewButton) {
      reviewButton = document.createElement("button");
      reviewButton.type = "button";
      reviewButton.dataset.expandedBusinessesView = "review";
      reviewButton.innerHTML = 'Разширени профили <span class="admin-badge" data-expanded-businesses-badge hidden>0</span>';
      review.append(reviewButton);
    }

    if (isAdmin()) {
      let accessButton = $("[data-expanded-access-view]", management);
      if (!accessButton) {
        accessButton = document.createElement("button");
        accessButton.type = "button";
        accessButton.dataset.expandedAccessView = "1";
        accessButton.textContent = "Разширен достъп на фирми";
        management.append(accessButton);
      }
    } else {
      $("[data-expanded-access-view]", management)?.remove();
    }

    return true;
  }

  async function waitForMenuButtons() {
    for (let i = 0; i < 60; i += 1) {
      if (ensureMenuButtons() && $("#admin-view-content")) return true;
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

  function setActiveButton(button) {
    document.querySelectorAll(".admin-menu button").forEach(item => item.classList.toggle("active", item === button));
  }

  async function fetchPendingReviewRows() {
    const { data: drafts, error: draftError } = await client
      .from("business_expanded_profile_drafts")
      .select("business_id, short_intro, website, services, service_area, work_hours, show_short_intro, show_website, show_services, show_service_area, show_work_hours, status, moderation_note, updated_at")
      .eq("status", "pending")
      .order("updated_at", { ascending: false });
    if (draftError) throw draftError;

    const businessIds = [...new Set((drafts || []).map(row => row.business_id).filter(Boolean))];
    if (!businessIds.length) return [];

    const { data: businesses, error: businessError } = await client
      .from("businesses")
      .select("id, owner_id, name, status, is_expanded, created_at")
      .in("id", businessIds);
    if (businessError) throw businessError;

    const businessById = new Map((businesses || []).map(row => [row.id, row]));
    return (drafts || [])
      .map(draft => ({ draft, business: businessById.get(draft.business_id) }))
      .filter(row => row.business)
      .filter(row => !(isModerator() && row.business.owner_id === currentUser?.id));
  }

  async function refreshReviewCount() {
    try {
      const rows = await fetchPendingReviewRows();
      const count = rows.length;
      const button = $("[data-expanded-businesses-view]");
      const badge = $("[data-expanded-businesses-badge]");
      if (badge) {
        badge.textContent = String(count);
        badge.hidden = count === 0;
      }
      if (button) button.hidden = count === 0;
      return count;
    } catch (error) {
      console.warn("Разширени профили: броячът не се зареди.", error);
      return null;
    }
  }

  function reviewCard(business, draft) {
    const canReview = business.is_expanded === true;
    return `<article class="admin-record">
      <div class="admin-record-meta"><span>Чака редакция</span><span>${escapeHtml(business.status || "")}</span></div>
      <h3>${escapeHtml(business.name)}</h3>
      ${draftDetails(draft)}
      <div class="admin-record-actions" style="margin-top:12px">
        ${business.is_expanded ? `<a class="admin-action-secondary" href="firma.html?id=${encodeURIComponent(business.id)}" target="_blank" rel="noopener">Публичен профил</a>` : ""}
        ${canReview ? `
          <button type="button" class="admin-action-approve" data-expanded-action="approve-draft" data-id="${escapeHtml(business.id)}">Одобри редакцията</button>
          <button type="button" class="admin-action-hide" data-expanded-action="return-draft" data-id="${escapeHtml(business.id)}">Върни за корекция</button>`
          : '<span class="admin-status">Разширеният достъп е изключен — редакцията изисква Admin проверка.</span>'}
      </div>
    </article>`;
  }

  async function loadReviewQueue() {
    activeView = "review";
    const title = "Чакащи редакции на разширени профили";
    const container = window.PopitaiAdminShell?.ensure?.(title) || $("#admin-view-content");
    const titleNode = $("#admin-view-title");
    if (titleNode) titleNode.textContent = title;
    if (!container) return;

    container.innerHTML = '<article class="empty-card"><p>Зареждане…</p></article>';
    setMessage("");

    try {
      const rows = await fetchPendingReviewRows();
      container.innerHTML = rows.length
        ? rows.map(row => reviewCard(row.business, row.draft)).join("")
        : '<article class="empty-card"><p>Няма чакащи редакции на разширени профили.</p></article>';
      await refreshReviewCount();
    } catch (error) {
      console.error(error);
      container.innerHTML = '<article class="empty-card"><p>Чакащите редакции не могат да се заредят.</p></article>';
      setMessage("Разширените профили не могат да се заредят.", true);
    }
  }

  function managementCard(item, ownerProfile, draft) {
    const ownerIsAdmin = ownerProfile?.role === "admin" && ownerProfile?.is_blocked !== true;
    const accessText = item.is_expanded ? "Разширен профил: включен" : "Разширен профил: изключен";
    const accessAction = ownerIsAdmin
      ? '<span style="font-weight:800;color:#176438">Автоматичен достъп за администраторска фирма</span>'
      : item.is_expanded
        ? `<button type="button" class="admin-action-hide" data-expanded-action="revoke" data-id="${escapeHtml(item.id)}">Отнеми разширения профил</button>`
        : `<button type="button" class="admin-action-approve" data-expanded-action="grant" data-id="${escapeHtml(item.id)}">Дай разширен профил</button>`;

    return `<article class="admin-record">
      <div class="admin-record-meta"><span>${escapeHtml(item.status || "")}</span><span>${escapeHtml(accessText)}</span></div>
      <h3>${escapeHtml(item.name)}</h3>
      <p><strong>Собственик:</strong> ${ownerIsAdmin ? "администратор" : "потребител"}</p>
      ${draft?.status === "pending" ? '<p class="admin-status">Има чакаща редакция — обработва се от „За преглед“.</p>' : ""}
      <div class="admin-record-actions" style="margin-top:12px">
        ${accessAction}
        ${item.is_expanded ? `<a class="admin-action-secondary" href="firma.html?id=${encodeURIComponent(item.id)}" target="_blank" rel="noopener">Публичен профил</a>` : ""}
      </div>
    </article>`;
  }

  async function loadAccessManagement() {
    if (!isAdmin()) return;
    activeView = "management";
    const title = "Разширен достъп на фирми";
    const container = window.PopitaiAdminShell?.ensure?.(title) || $("#admin-view-content");
    const titleNode = $("#admin-view-title");
    if (titleNode) titleNode.textContent = title;
    if (!container) return;

    container.innerHTML = '<article class="empty-card"><p>Зареждане…</p></article>';
    setMessage("");

    const { data: businesses, error: businessError } = await client
      .from("businesses")
      .select("id, owner_id, name, status, is_expanded, created_at")
      .order("created_at", { ascending: false });

    if (businessError) {
      container.innerHTML = '<article class="empty-card"><p>Фирмите не могат да се заредят.</p></article>';
      setMessage("Управлението на разширения достъп не може да се зареди.", true);
      return;
    }

    const rows = businesses || [];
    if (!rows.length) {
      container.innerHTML = '<article class="empty-card"><p>Няма фирми.</p></article>';
      return;
    }

    const ownerIds = [...new Set(rows.map(item => item.owner_id).filter(Boolean))];
    const businessIds = rows.map(item => item.id);
    const [profilesResult, draftsResult] = await Promise.all([
      ownerIds.length
        ? client.from("profiles").select("id, role, is_blocked").in("id", ownerIds)
        : Promise.resolve({ data: [], error: null }),
      businessIds.length
        ? client.from("business_expanded_profile_drafts").select("business_id,status").in("business_id", businessIds)
        : Promise.resolve({ data: [], error: null })
    ]);

    if (profilesResult.error || draftsResult.error) {
      setMessage("Част от данните за фирмите не могат да се заредят.", true);
    }

    const profilesById = new Map((profilesResult.data || []).map(row => [row.id, row]));
    const draftsByBusiness = new Map((draftsResult.data || []).map(row => [row.business_id, row]));
    container.innerHTML = rows
      .map(item => managementCard(item, profilesById.get(item.owner_id), draftsByBusiness.get(item.id)))
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
      result = await client.rpc("publish_business_expanded_profile_draft", { p_business_id: businessId });
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
    await refreshReviewCount();
    if (activeView === "management") await loadAccessManagement();
    else await loadReviewQueue();
  }

  async function init() {
    if (initialized) return;
    initialized = true;
    if (!(await authIsStaff())) return;
    if (!(await waitForMenuButtons())) return;
    await refreshReviewCount();

    document.addEventListener("click", async (event) => {
      const reviewButton = event.target.closest("[data-expanded-businesses-view]");
      if (reviewButton) {
        event.preventDefault();
        event.stopImmediatePropagation();
        setActiveButton(reviewButton);
        await loadReviewQueue();
        return;
      }

      const managementButton = event.target.closest("[data-expanded-access-view]");
      if (managementButton) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (!isAdmin()) return;
        setActiveButton(managementButton);
        await loadAccessManagement();
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