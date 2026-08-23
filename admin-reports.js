(() => {
  "use strict";

  const client = window.PopitaiSupabase;
  if (!client) return;

  let currentUser = null;
  let currentRole = null;
  const isModerator = () => currentRole === "moderator";

  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[char]));

  const targetLabels = {
    site: "Сайт",
    listing: "Обява",
    business: "Фирма",
    question: "Въпрос",
    answer: "Отговор",
    profile: "Профил"
  };

  function formatDate(value) {
    if (!value) return "";
    try {
      return new Intl.DateTimeFormat("bg-BG", {
        day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit"
      }).format(new Date(value));
    } catch (_) {
      return "";
    }
  }

  async function allowed() {
    const { data, error } = await client.auth.getUser();
    if (error) return false;
    currentUser = data?.user || null;
    if (!currentUser) return false;

    const { data: profile, error: profileError } = await client
      .from("profiles")
      .select("role,is_blocked")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (profileError) return false;
    currentRole = profile?.role || null;
    return ["admin","moderator"].includes(currentRole) && profile?.is_blocked !== true;
  }

  async function waitForAdminShell() {
    for (let i = 0; i < 50; i += 1) {
      const review = document.querySelector('.admin-menu [data-admin-menu-group-items="review"]');
      const content = document.querySelector(".admin-content");
      if (review && content) return { review, content };
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    return null;
  }

  function ensureButton() {
    const review = document.querySelector('.admin-menu [data-admin-menu-group-items="review"]');
    if (!review) return null;

    let button = review.querySelector("[data-reports-admin]");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.dataset.reportsAdmin = "1";
      button.innerHTML = 'Сигнали <span class="admin-badge" data-reports-badge hidden>0</span>';
      button.addEventListener("click", open);
      review.appendChild(button);
    }
    return button;
  }

  async function refreshCount() {
    let query = client.from("reports").select("id", { count:"exact", head:true }).eq("status", "pending");
    if (isModerator()) query = query.neq("reporter_id", currentUser.id);
    const { count, error } = await query;

    if (error) {
      console.warn("Сигнали: броячът не се зареди.", error);
      return;
    }

    const button = ensureButton();
    const badge = button?.querySelector("[data-reports-badge]");
    if (badge) {
      badge.textContent = String(count || 0);
      badge.hidden = (count || 0) === 0;
    }
    if (button) button.hidden = (count || 0) === 0;
  }

  function reportCard(report) {
    const target = targetLabels[report.target_type] || report.target_type || "Неуточнено";
    return `
      <article class="admin-record">
        <div class="admin-record-meta">
          <span class="admin-status">Чака преглед</span>
          <span>${esc(target)}</span>
          <span>${esc(formatDate(report.created_at))}</span>
        </div>
        <h3>Подаден сигнал</h3>
        <p class="admin-listing-description">${esc(report.reason || "")}</p>
        ${report.target_id ? `<p><strong>ID на свързания запис:</strong> ${esc(report.target_id)}</p>` : ""}
        <div class="admin-record-actions">
          <button class="admin-action-approve" type="button" data-report-action="resolve" data-id="${esc(report.id)}">Маркирай като обработен</button>
          <button class="admin-action-delete" type="button" data-report-action="reject" data-id="${esc(report.id)}">Отхвърли</button>
        </div>
      </article>`;
  }

  async function loadPending() {
    let query = client
      .from("reports")
      .select("id,reporter_id,target_type,target_id,reason,status,created_at")
      .eq("status", "pending")
      .order("created_at", { ascending:false });
    if (isModerator()) query = query.neq("reporter_id", currentUser.id);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  function setMessage(root, text, isError = false) {
    const box = root.querySelector("[data-reports-message]");
    if (!box) return;
    box.textContent = text || "";
    box.hidden = !text;
    box.classList.toggle("error", isError);
  }

  async function open() {
    const content = document.querySelector(".admin-content");
    if (!content) return;

    document.querySelectorAll(".admin-menu button").forEach(button => {
      button.classList.toggle("active", button.hasAttribute("data-reports-admin"));
    });

    content.innerHTML = `
      <div class="block-heading"><h2>Сигнали за преглед</h2></div>
      <p class="admin-panel-message" data-reports-message hidden></p>
      <div class="stack-list" data-reports-list><article class="empty-card"><p>Зареждане…</p></article></div>`;

    try {
      const rows = await loadPending();
      const list = content.querySelector("[data-reports-list]");
      if (!list) return;
      list.innerHTML = rows.length
        ? rows.map(reportCard).join("")
        : '<article class="empty-card"><p>Няма чакащи сигнали.</p></article>';
      wireActions(content);
    } catch (error) {
      console.error(error);
      const list = content.querySelector("[data-reports-list]");
      if (list) list.innerHTML = '<article class="empty-card"><p>Сигналите не могат да се заредят.</p></article>';
    }
  }

  function wireActions(root) {
    root.querySelectorAll("[data-report-action]").forEach(button => {
      button.addEventListener("click", async () => {
        const id = button.dataset.id;
        const action = button.dataset.reportAction;
        if (!id || !action) return;

        const question = action === "resolve"
          ? "Сигналът прегледан и обработен ли е?"
          : "Да се отхвърли ли този сигнал?";
        if (!window.confirm(question)) return;

        button.disabled = true;
        const status = action === "resolve" ? "approved" : "rejected";
        const { error } = await client
          .from("reports")
          .update({
            status,
            reviewed_by: currentUser.id,
            reviewed_at: new Date().toISOString()
          })
          .eq("id", id)
          .eq("status", "pending");

        if (error) {
          console.error(error);
          button.disabled = false;
          setMessage(root, "Промяната не беше записана.", true);
          return;
        }

        await refreshCount();
        await open();
      });
    });
  }

  async function init() {
    if (!(await allowed())) return;
    if (!(await waitForAdminShell())) return;
    ensureButton();
    await refreshCount();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once:true });
  } else {
    init();
  }
})();