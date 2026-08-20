(() => {
  "use strict";

  const client = window.PopitaiSupabase;
  if (!client) return;

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));

  let currentUser = null;

  async function allowed() {
    const { data } = await client.auth.getUser();
    currentUser = data?.user || null;
    if (!currentUser) return false;
    const { data: profile } = await client
      .from("profiles")
      .select("role,is_blocked")
      .eq("id", currentUser.id)
      .maybeSingle();
    return ["admin", "moderator"].includes(profile?.role) && profile?.is_blocked !== true;
  }

  async function waitForMenu() {
    for (let i = 0; i < 40; i += 1) {
      const group = document.querySelector('.admin-menu [data-admin-menu-group-items="content"]');
      const content = document.querySelector(".admin-content");
      if (group && content) return true;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    return false;
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
    const { count, error } = await client.from("events")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");
    if (error) return;
    const badge = ensureButton()?.querySelector("[data-events-badge]");
    if (badge) {
      badge.textContent = String(count || 0);
      badge.hidden = (count || 0) === 0;
    }
  }

  const formatDate = (value) => {
    if (!value) return "Без посочена дата";
    try {
      return new Intl.DateTimeFormat("bg-BG", {
        day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
      }).format(new Date(value));
    } catch (_) {
      return "";
    }
  };

  function card(item) {
    const actions = item.status === "pending"
      ? `<div class="admin-record-actions">
          <button class="admin-action-approve" type="button" data-event-action="approve" data-id="${esc(item.id)}">Одобри</button>
          <button class="admin-action-delete" type="button" data-event-action="reject" data-id="${esc(item.id)}">Откажи</button>
        </div>`
      : item.status === "approved"
      ? `<div class="admin-record-actions"><button class="admin-action-hide" type="button" data-event-action="reject" data-id="${esc(item.id)}">Скрий</button></div>`
      : `<div class="admin-record-actions"><button class="admin-action-approve" type="button" data-event-action="approve" data-id="${esc(item.id)}">Одобри</button></div>`;

    return `<article class="admin-record">
      <h3>${esc(item.title)}</h3>
      <div class="admin-record-meta"><span class="admin-status ${item.status === "approved" ? "approved" : item.status === "rejected" ? "rejected" : ""}">${esc(item.status === "pending" ? "Чака одобрение" : item.status === "approved" ? "Публикуван" : item.status === "needs_changes" ? "За корекция" : "Отказан")}</span><span>${esc(formatDate(item.starts_at))}</span></div>
      <p>${esc(item.description)}</p>
      <p><strong>Място:</strong> ${esc(item.location || "—")}</p>
      ${item.moderation_note ? `<p><strong>Бележка:</strong> ${esc(item.moderation_note)}</p>` : ""}
      ${actions}
    </article>`;
  }

  async function open() {
    const content = document.querySelector(".admin-content");
    if (!content) return;

    document.querySelectorAll(".admin-menu button").forEach((button) => {
      button.classList.toggle("active", button.hasAttribute("data-events-admin"));
    });

    content.innerHTML = '<div class="block-heading"><h2>Събития</h2></div><p class="admin-panel-message" data-events-message hidden></p><div class="stack-list" data-events-list><article class="empty-card"><p>Зареждане…</p></article></div>';

    const { data, error } = await client.from("events")
      .select("id,title,description,location,starts_at,status,moderation_note,created_at")
      .order("created_at", { ascending: false });

    const list = content.querySelector("[data-events-list]");
    if (!list) return;
    if (error) {
      list.innerHTML = '<article class="empty-card"><p>Събитията не могат да се заредят.</p></article>';
      return;
    }

    const items = data || [];
    list.innerHTML = items.length ? items.map(card).join("") : '<article class="empty-card"><p>Няма предложени събития.</p></article>';
    wire(content);
  }

  function message(root, text, isError = false) {
    const box = root.querySelector("[data-events-message]");
    if (!box) return;
    box.textContent = text || "";
    box.hidden = !text;
    box.classList.toggle("error", isError);
  }

  function wire(root) {
    root.querySelectorAll("[data-event-action]").forEach((button) => {
      button.addEventListener("click", async () => {
        const id = button.dataset.id;
        const action = button.dataset.eventAction;
        if (!id) return;

        let note = "";
        if (action === "reject") {
          note = window.prompt("Причина за отказа/скриването:", "")?.trim() || "";
          if (!note) return;
        } else if (!window.confirm("Да се публикува това събитие?")) {
          return;
        }

        button.disabled = true;
        const status = action === "approve" ? "approved" : "rejected";
        const { error } = await client.from("events")
          .update({
            status,
            moderation_note: note,
            reviewed_by: currentUser.id,
            reviewed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq("id", id);

        if (error) {
          button.disabled = false;
          message(root, "Промяната не беше записана.", true);
          return;
        }

        await refreshCount();
        await open();
      });
    });
  }

  (async () => {
    if (!(await allowed())) return;
    if (!(await waitForMenu())) return;
    ensureButton();
    await refreshCount();
  })();
})();
