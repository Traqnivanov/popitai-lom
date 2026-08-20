(() => {
  "use strict";

  const client = window.PopitaiSupabase;
  if (!client) return;

  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[char]));

  const categoryLabels = {
    food:"Хранителни",
    construction:"Строителни",
    tech:"Техника",
    furniture:"Мебели",
    clothes:"Дрехи",
    home:"Дом"
  };

  const sourceLabels = {
    owner:"Собственик / управител",
    employee:"Служител",
    visitor:"Клиент / посетител",
    public:"Публичен източник",
    other:"Друго"
  };

  const statusLabels = {
    pending:"Чака одобрение",
    approved:"Публикуван",
    rejected:"Отказан",
    needs_changes:"За корекция"
  };

  let currentUser = null;

  const formatDate = value => {
    if (!value) return "";
    try {
      return new Intl.DateTimeFormat("bg-BG", {
        day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit"
      }).format(new Date(value));
    } catch (_) {
      return "";
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
    const { data: profile } = await client
      .from("profiles")
      .select("role,is_blocked")
      .eq("id", currentUser.id)
      .maybeSingle();
    return ["admin","moderator"].includes(profile?.role) && profile?.is_blocked !== true;
  }

  function ensureButton() {
    const group = document.querySelector('.admin-menu [data-admin-menu-group-items="content"]');
    if (!group) return null;
    let button = group.querySelector("[data-shops-admin]");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.dataset.shopsAdmin = "1";
      button.innerHTML = 'Магазини <span class="admin-badge" data-shops-badge hidden>0</span>';
      group.appendChild(button);
      button.addEventListener("click", open);
    }
    return button;
  }

  async function refreshCount() {
    const { count, error } = await client
      .from("shops")
      .select("id",{count:"exact",head:true})
      .eq("status","pending");
    if (error) {
      console.warn("Магазини: броячът не се зареди.", error);
      return;
    }
    const button = ensureButton();
    const badge = button?.querySelector("[data-shops-badge]");
    if (badge) {
      badge.textContent = String(count || 0);
      badge.hidden = (count || 0) === 0;
    }
  }

  function statusBadge(status) {
    const className = status === "approved" ? "approved" : status === "rejected" ? "rejected" : "";
    return `<span class="admin-status ${className}">${esc(statusLabels[status] || status)}</span>`;
  }

  function card(shop) {
    const pendingActions = shop.status === "pending" ? `
      <div class="admin-record-actions">
        <button class="admin-action-approve" type="button" data-shop-action="approve" data-id="${esc(shop.id)}">Одобри</button>
        <button class="admin-action-delete" type="button" data-shop-action="reject" data-id="${esc(shop.id)}">Откажи</button>
      </div>` : "";

    const approvedActions = shop.status === "approved" ? `
      <div class="admin-record-actions">
        <button class="admin-action-hide" type="button" data-shop-action="reject" data-id="${esc(shop.id)}">Скрий</button>
      </div>` : "";

    const rejectedActions = shop.status === "rejected" ? `
      <div class="admin-record-actions">
        <button class="admin-action-approve" type="button" data-shop-action="approve" data-id="${esc(shop.id)}">Одобри</button>
      </div>` : "";

    return `
      <article class="admin-record">
        <h3>${esc(shop.name)}</h3>
        <div class="admin-record-meta">
          ${statusBadge(shop.status)}
          <span>${esc(categoryLabels[shop.category] || shop.category)}</span>
          <span>${esc(formatDate(shop.created_at))}</span>
        </div>
        <p><strong>Телефон:</strong> ${esc(shop.phone || "—")}</p>
        <p><strong>Адрес:</strong> ${esc(shop.address)}</p>
        <p><strong>Работно време:</strong> ${esc(shop.working_hours || "—")}</p>
        <p><strong>Какво предлага:</strong> ${esc(shop.offer)}</p>
        <p><strong>Източник:</strong> ${esc(sourceLabels[shop.source_type] || shop.source_type)}${shop.source_details ? ` · ${esc(shop.source_details)}` : ""}</p>
        ${shop.moderation_note ? `<p><strong>Бележка:</strong> ${esc(shop.moderation_note)}</p>` : ""}
        ${pendingActions}${approvedActions}${rejectedActions}
      </article>`;
  }

  async function loadRows() {
    const { data, error } = await client
      .from("shops")
      .select("id,name,category,phone,address,working_hours,offer,source_type,source_details,status,moderation_note,created_at")
      .order("created_at",{ascending:false});
    if (error) throw error;
    return data || [];
  }

  async function open() {
    const content = document.querySelector(".admin-content");
    if (!content) return;

    document.querySelectorAll(".admin-menu button").forEach(button => {
      button.classList.toggle("active", button.hasAttribute("data-shops-admin"));
    });

    content.innerHTML = `
      <div class="block-heading"><h2>Магазини</h2></div>
      <p class="admin-panel-message" data-shops-message hidden></p>
      <div class="stack-list" data-shops-list><article class="empty-card"><p>Зареждане…</p></article></div>`;

    try {
      const rows = await loadRows();
      const list = content.querySelector("[data-shops-list]");
      if (!list) return;
      list.innerHTML = rows.length
        ? rows.map(card).join("")
        : '<article class="empty-card"><p>Няма предложения за магазини.</p></article>';
      wireActions(content);
    } catch (error) {
      console.error(error);
      const list = content.querySelector("[data-shops-list]");
      if (list) list.innerHTML = '<article class="empty-card"><p>Магазините не могат да се заредят.</p></article>';
    }
  }

  function message(root, text, isError = false) {
    const box = root.querySelector("[data-shops-message]");
    if (!box) return;
    box.textContent = text || "";
    box.hidden = !text;
    box.classList.toggle("error", isError);
  }

  function wireActions(root) {
    root.querySelectorAll("[data-shop-action]").forEach(button => {
      button.addEventListener("click", async () => {
        const id = button.dataset.id;
        const action = button.dataset.shopAction;
        if (!id) return;

        let note = "";
        if (action === "reject") {
          note = window.prompt("Причина за отказа/скриването:", "")?.trim() || "";
          if (!note) return;
        } else if (!window.confirm("Да се публикува този магазин?")) {
          return;
        }

        button.disabled = true;
        const status = action === "approve" ? "approved" : "rejected";
        const { error } = await client
          .from("shops")
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