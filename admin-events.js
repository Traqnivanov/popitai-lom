(() => {
  "use strict";

  const client = window.PopitaiSupabase;
  if (!client) return;

  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[char]));

  const statusLabels = {
    pending:"Чака одобрение",
    approved:"Публикувано",
    rejected:"Отказано",
    needs_changes:"За корекция"
  };

  let currentUser = null;

  const formatDate = value => {
    if (!value) return "—";
    try {
      return new Intl.DateTimeFormat("bg-BG", {
        day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit"
      }).format(new Date(value));
    } catch (_) {
      return "—";
    }
  };

  async function waitForMenu() {
    for (let i = 0; i < 40; i += 1) {
      const menu = document.querySelector('.admin-menu [data-admin-menu-group-items="content"]');
      const content = document.querySelector(".admin-content");
      if (menu && content) return { menu, content };
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    return null;
  }

  async function allowed() {
    const { data } = await client.auth.getUser();
    currentUser = data?.user || null;
    if (!currentUser) return false;

    const { data: profile, error } = await client
      .from("profiles")
      .select("role,is_blocked")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (error) return false;
    return ["admin","moderator"].includes(profile?.role) && profile?.is_blocked !== true;
  }

  function ensureButton() {
    const group = document.querySelector('.admin-menu [data-admin-menu-group-items="content"]');
    if (!group) return null;

    let button = group.querySelector("[data-events-admin]");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.dataset.eventsAdmin = "1";
      button.innerHTML = 'Събития <span class="admin-badge" data-events-badge hidden>0</span>';
      group.appendChild(button);
      button.addEventListener("click", open);
    }
    return button;
  }

  async function refreshCount() {
    const { count, error } = await client
      .from("events")
      .select("id", { count:"exact", head:true })
      .eq("status", "pending");

    if (error) {
      console.warn("Събития: броячът не се зареди.", error);
      return;
    }

    const badge = ensureButton()?.querySelector("[data-events-badge]");
    if (!badge) return;
    badge.textContent = String(count || 0);
    badge.hidden = (count || 0) === 0;
  }

  function statusBadge(status) {
    const className = status === "approved" ? "approved" : status === "rejected" ? "rejected" : "";
    return `<span class="admin-status ${className}">${esc(statusLabels[status] || status)}</span>`;
  }

  function card(event) {
    const moderationActions = event.status === "pending" ? `
      <button class="admin-action-approve" type="button" data-event-action="approve" data-id="${esc(event.id)}">Одобри</button>
      <button class="admin-action-delete" type="button" data-event-action="reject" data-id="${esc(event.id)}">Откажи</button>` : event.status === "approved" ? `
      <button class="admin-action-hide" type="button" data-event-action="reject" data-id="${esc(event.id)}">Скрий</button>` : `
      <button class="admin-action-approve" type="button" data-event-action="approve" data-id="${esc(event.id)}">Одобри</button>`;

    return `
      <article class="admin-record">
        <h3>${esc(event.title)}</h3>
        <div class="admin-record-meta">
          ${statusBadge(event.status)}
          <span>${esc(formatDate(event.starts_at))}</span>
          <span>${esc(event.location || "Без посочено място")}</span>
        </div>
        ${event.description ? `<p>${esc(event.description)}</p>` : ""}
        ${event.moderation_note ? `<p><strong>Бележка:</strong> ${esc(event.moderation_note)}</p>` : ""}
        <div class="admin-record-actions">
          ${moderationActions}
          <button class="admin-action-delete" type="button" data-event-action="delete" data-id="${esc(event.id)}">Изтрий</button>
        </div>
      </article>`;
  }

  async function loadRows() {
    const { data, error } = await client
      .from("events")
      .select("id,title,description,location,starts_at,status,moderation_note,created_at")
      .order("created_at", { ascending:false });
    if (error) throw error;
    return data || [];
  }

  function message(root, text, isError = false) {
    const box = root.querySelector("[data-events-message]");
    if (!box) return;
    box.textContent = text || "";
    box.hidden = !text;
    box.classList.toggle("error", isError);
  }

  async function open() {
    const content = document.querySelector(".admin-content");
    if (!content) return;

    document.querySelectorAll(".admin-menu button").forEach(button => {
      button.classList.toggle("active", button.hasAttribute("data-events-admin"));
    });

    content.innerHTML = `
      <div class="block-heading"><h2>Събития</h2></div>
      <p class="admin-panel-message" data-events-message hidden></p>
      <div class="stack-list" data-events-list><article class="empty-card"><p>Зареждане…</p></article></div>`;

    try {
      const rows = await loadRows();
      const list = content.querySelector("[data-events-list]");
      if (!list) return;
      list.innerHTML = rows.length
        ? rows.map(card).join("")
        : '<article class="empty-card"><p>Няма подадени събития.</p></article>';
      wireActions(content);
    } catch (error) {
      console.error(error);
      const list = content.querySelector("[data-events-list]");
      if (list) list.innerHTML = '<article class="empty-card"><p>Събитията не могат да се заредят.</p></article>';
    }
  }

  function wireActions(root) {
    root.querySelectorAll("[data-event-action]").forEach(button => {
      button.addEventListener("click", async () => {
        const id = button.dataset.id;
        const action = button.dataset.eventAction;
        if (!id || !action) return;

        if (action === "delete") {
          if (!window.confirm("Да се изтрие това събитие окончателно?")) return;
          button.disabled = true;
          const { error } = await client.from("events").delete().eq("id", id);
          if (error) {
            console.error(error);
            button.disabled = false;
            message(root, "Събитието не беше изтрито.", true);
            return;
          }
          await refreshCount();
          await open();
          return;
        }

        let note = "";
        if (action === "reject") {
          note = window.prompt("Причина за отказа/скриването:", "")?.trim() || "";
          if (!note) return;
        } else if (!window.confirm("Да се публикува това събитие?")) {
          return;
        }

        button.disabled = true;
        const status = action === "approve" ? "approved" : "rejected";
        const { error } = await client
          .from("events")
          .update({
            status,
            moderation_note: note,
            reviewed_by: currentUser.id,
            reviewed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq("id", id);

        if (error) {
          console.error(error);
          button.disabled = false;
          message(root, "Промяната не беше записана.", true);
          return;
        }

        await refreshCount();
        await open();
      });
    });
  }

  async function init() {
    if (!(await allowed())) return;
    const ready = await waitForMenu();
    if (!ready) return;
    ensureButton();
    await refreshCount();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once:true });
  } else {
    init();
  }
})();
