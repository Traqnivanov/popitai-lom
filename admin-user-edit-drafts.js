// Попитай.Лом — одобряване само на потребителски редакции
(() => {
  "use strict";

  const client = window.PopitaiSupabase;
  if (!client) return;

  const BUCKET = "business-media";
  const $ = (selector, root = document) => root.querySelector(selector);
  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  let initialized = false;
  let active = false;
  let currentUser = null;
  let currentRole = null;

  const isModerator = () => currentRole === "moderator";

  function setMessage(text, isError = false) {
    const box = $("#admin-panel-message");
    if (!box) return;
    box.textContent = text || "";
    box.hidden = !text;
    box.classList.toggle("error", isError);
  }

  function publicUrl(path) {
    if (!path) return "";
    return client.storage.from(BUCKET).getPublicUrl(path).data?.publicUrl || "";
  }

  async function authIsStaff() {
    const { data } = await client.auth.getUser();
    currentUser = data?.user || null;
    if (!currentUser) return false;
    const { data: profile } = await client.from("profiles")
      .select("role, is_blocked").eq("id", currentUser.id).maybeSingle();
    currentRole = profile?.role || null;
    return Boolean(profile && ["admin", "moderator"].includes(currentRole) && profile.is_blocked !== true);
  }

  function ensureMenuButton() {
    const review = $('.admin-menu [data-admin-menu-group-items="review"]');
    if (!review) return false;
    if ($("[data-user-edits-view]", review)) return true;
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.userEditsView = "true";
    button.innerHTML = 'Потребителски редакции <span class="admin-badge" data-user-edits-badge hidden>0</span>';
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

  function fieldRows(draft) {
    const payload = draft.payload || {};
    const fields = draft.entity_type === "business"
      ? [["Име", payload.name],["Категория", payload.category],["Телефон", payload.phone],["Описание", payload.description]]
      : [["Заглавие", payload.title],["Категория", payload.category],["Подкатегория", payload.subcategory],["Тип", payload.listing_type],["Описание", payload.description],["Цена", payload.price],["Телефон", payload.phone],["Град", payload.city],["Улица", payload.street]];
    return fields
      .filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== "")
      .map(([label, value]) => `<p style="margin:5px 0"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`)
      .join("");
  }

  function mediaPreview(rows) {
    if (!rows.length) return "";
    return `<section style="margin-top:12px"><p style="margin:0 0 8px;font-weight:800">Нови снимки</p><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px">${rows.map((row) => {
      const url = publicUrl(row.storage_path);
      return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener" style="display:block;aspect-ratio:1/1;border-radius:10px;overflow:hidden;border:1px solid #d7deea"><img src="${escapeHtml(url)}" alt="Нова снимка" loading="lazy" style="width:100%;height:100%;object-fit:cover"></a>`;
    }).join("")}</div></section>`;
  }

  function actionBlock(draft) {
    if (draft.status !== "pending") return "";
    const own = isModerator() && draft.owner_id === currentUser?.id;
    if (own) {
      return '<div class="admin-record-actions"><span class="admin-status">Твоя редакция — обработва се от друг Moderator или Admin</span></div>';
    }
    const hasPermanentMediaRemoval = (draft.remove_media_ids || []).length > 0;
    const approve = isModerator() && hasPermanentMediaRemoval
      ? '<span class="admin-status">Одобрението изисква Admin заради окончателно премахване на снимки</span>'
      : `<button class="admin-action-approve" data-user-edit-action="approve" data-id="${escapeHtml(draft.id)}">Одобри редакцията</button>`;
    return `<div class="admin-record-actions">${approve}<button class="admin-action-hide" data-user-edit-action="return" data-id="${escapeHtml(draft.id)}">Върни за корекция</button></div>`;
  }

  function card(draft, entity, mediaRows) {
    const typeLabel = draft.entity_type === "business" ? "Фирма" : "Обява";
    const title = entity?.name || entity?.title || "Редакция";
    const returned = draft.status === "needs_changes";
    return `<article class="admin-record">
      <div class="admin-record-meta"><span class="admin-status ${escapeHtml(draft.status)}">${returned ? "Върната за корекция" : "Чака одобрение"}</span><span>${typeLabel}</span></div>
      <h3>${escapeHtml(title)}</h3>
      <div style="padding:12px;border-radius:12px;background:#f8fafc">${fieldRows(draft)}</div>
      ${mediaPreview(mediaRows)}
      ${draft.remove_media_ids?.length ? `<p style="color:#8a2020;font-weight:800">Снимки за премахване: ${draft.remove_media_ids.length}</p>` : ""}
      ${draft.moderation_note ? `<p><strong>Бележка:</strong> ${escapeHtml(draft.moderation_note)}</p>` : ""}
      ${actionBlock(draft)}
    </article>`;
  }

  async function fetchDrafts() {
    const { data, error } = await client.from("user_content_edit_drafts")
      .select("id, owner_id, entity_type, entity_id, payload, new_media_ids, remove_media_ids, status, moderation_note, updated_at")
      .in("status", ["pending", "needs_changes"])
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async function refreshBadge() {
    try {
      const drafts = await fetchDrafts();
      const count = drafts.filter((draft) => draft.status === "pending" && !(isModerator() && draft.owner_id === currentUser?.id)).length;
      const badge = $("[data-user-edits-badge]");
      if (badge) {
        badge.textContent = String(count);
        badge.hidden = count === 0;
      }
    } catch (_) {}
  }

  async function loadView() {
    active = true;
    const title = $("#admin-view-title");
    const container = $("#admin-view-content");
    if (!title || !container) return;
    title.textContent = "Потребителски редакции";
    container.innerHTML = '<article class="empty-card"><p>Зареждане…</p></article>';
    setMessage("");

    try {
      const drafts = await fetchDrafts();
      if (!drafts.length) {
        container.innerHTML = '<article class="empty-card"><p>Няма потребителски редакции за преглед.</p></article>';
        await refreshBadge();
        return;
      }

      const businessIds = drafts.filter((d) => d.entity_type === "business").map((d) => d.entity_id);
      const listingIds = drafts.filter((d) => d.entity_type === "listing").map((d) => d.entity_id);
      const mediaIds = [...new Set(drafts.flatMap((d) => d.new_media_ids || []))];

      const [businessResult, listingResult, mediaResult] = await Promise.all([
        businessIds.length ? client.from("businesses").select("id, name").in("id", businessIds) : Promise.resolve({ data: [] }),
        listingIds.length ? client.from("listings").select("id, title").in("id", listingIds) : Promise.resolve({ data: [] }),
        mediaIds.length ? client.from("media").select("id, storage_path").in("id", mediaIds) : Promise.resolve({ data: [] })
      ]);

      const entities = new Map([
        ...(businessResult.data || []).map((row) => [`business:${row.id}`, row]),
        ...(listingResult.data || []).map((row) => [`listing:${row.id}`, row])
      ]);
      const mediaById = new Map((mediaResult.data || []).map((row) => [row.id, row]));

      container.innerHTML = drafts.map((draft) => card(
        draft,
        entities.get(`${draft.entity_type}:${draft.entity_id}`),
        (draft.new_media_ids || []).map((id) => mediaById.get(id)).filter(Boolean)
      )).join("");
      await refreshBadge();
    } catch (error) {
      container.innerHTML = '<article class="empty-card"><p>Редакциите не могат да се заредят.</p></article>';
      setMessage("Потребителските редакции не могат да се заредят.", true);
    }
  }

  async function performAction(button) {
    const id = button.dataset.id;
    if (button.dataset.userEditAction === "approve") {
      const { data, error } = await client.rpc("publish_user_content_edit_draft", { p_draft_id: id });
      if (error) throw error;
      const paths = data?.cleanup_paths || [];
      if (paths.length) await client.storage.from(BUCKET).remove(paths);
      setMessage("Редакцията е одобрена.");
    } else {
      const note = window.prompt("Какво трябва да се коригира?")?.trim();
      if (!note) return;
      const { error } = await client.rpc("return_user_content_edit_draft", { p_draft_id: id, p_note: note });
      if (error) throw error;
      setMessage("Редакцията е върната за корекция.");
    }
    await loadView();
  }

  async function init() {
    if (initialized || !(await authIsStaff())) return;
    initialized = true;
    if (!(await waitForMenuButton())) return;

    document.addEventListener("click", async (event) => {
      const menuButton = event.target.closest(".admin-menu button");
      if (menuButton && !menuButton.matches("[data-user-edits-view]")) active = false;

      const view = event.target.closest("[data-user-edits-view]");
      if (view) {
        event.preventDefault();
        event.stopImmediatePropagation();
        document.querySelectorAll(".admin-menu button").forEach((button) => button.classList.toggle("active", button === view));
        await loadView();
        return;
      }

      const action = event.target.closest("[data-user-edit-action]");
      if (!action) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      action.disabled = true;
      try {
        await performAction(action);
      } catch (error) {
        setMessage(error?.message || "Промяната не беше записана.", true);
      } finally {
        action.disabled = false;
      }
    }, true);

    await refreshBadge();
    window.setInterval(async () => {
      await refreshBadge();
      if (active) await loadView();
    }, 60000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();