// Попитай.Лом — фирмените профили на текущия потребител
(() => {
  const client = window.PopitaiSupabase;
  if (!client) return;

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const labels = {
    pending: "Чака преглед",
    approved: "Одобрена",
    rejected: "Отказана/скрита",
    needs_changes: "Върната за корекция"
  };

  function injectStyles() {
    if (document.querySelector("#profile-business-styles")) return;

    const style = document.createElement("style");
    style.id = "profile-business-styles";
    style.textContent = `
      #profile-businesses {
        display: grid;
        gap: 16px;
      }

      .profile-business-card {
        position: relative;
        overflow: hidden;
        padding: 20px;
        background: #fff;
        border: 1px solid #dce3ee;
        border-left: 5px solid #a9b4c4;
        border-radius: 16px;
        box-shadow: 0 8px 26px rgba(20, 45, 85, 0.07);
      }

      .profile-business-card[data-status="pending"] { border-left-color: #d99a19; }
      .profile-business-card[data-status="approved"] { border-left-color: #2f8f57; }
      .profile-business-card[data-status="needs_changes"] { border-left-color: #c43d32; }
      .profile-business-card[data-status="rejected"] { border-left-color: #8c2b25; }

      .profile-business-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 10px 14px;
        margin-bottom: 16px;
      }

      .profile-business-date {
        color: #59657a;
        font-size: 14px;
        font-weight: 700;
      }

      .profile-business-status {
        display: inline-flex;
        align-items: center;
        min-height: 34px;
        padding: 7px 12px;
        border: 1px solid transparent;
        border-radius: 999px;
        font-size: 15px;
        font-weight: 900;
        line-height: 1.15;
        letter-spacing: 0.01em;
      }

      .profile-business-status--pending {
        color: #754900;
        background: #fff4d6;
        border-color: #efc260;
      }

      .profile-business-status--approved {
        color: #17653a;
        background: #e8f7ed;
        border-color: #91d1a8;
      }

      .profile-business-status--needs_changes {
        color: #9d281f;
        background: #fff0ed;
        border-color: #e7a39b;
      }

      .profile-business-status--rejected {
        color: #7c211c;
        background: #f9e9e8;
        border-color: #dda09c;
      }

      .profile-business-card h3 {
        margin: 0 0 12px;
        color: #172033;
        font-size: clamp(22px, 4.5vw, 28px);
        line-height: 1.2;
      }

      .profile-business-card p {
        margin: 9px 0;
      }

      .profile-business-note {
        margin-top: 15px;
        padding: 14px;
        color: #6f211b;
        background: #fff5f3;
        border: 1px solid #efc0bb;
        border-radius: 12px;
        line-height: 1.55;
      }

      .profile-business-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 17px;
      }

      .profile-business-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 42px;
        padding: 9px 15px;
        color: #0b5fd7;
        background: #eef4ff;
        border: 1px solid #bfd3f4;
        border-radius: 11px;
        text-decoration: none;
        font-weight: 800;
      }

      .profile-business-link:hover,
      .profile-business-link:focus-visible {
        color: #fff;
        background: #0b5fd7;
        outline: none;
      }

      @media (max-width: 560px) {
        .profile-business-card { padding: 17px; }
        .profile-business-meta { align-items: flex-start; }
        .profile-business-status { font-size: 15px; }
      }
    `;
    document.head.appendChild(style);
  }

  function formatDate(value) {
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
  }

  function ensureSection() {
    let container = document.querySelector("#profile-businesses");
    if (container) return container;

    const questions = document.querySelector("#profile-questions");
    if (!questions) return null;

    const heading = document.createElement("div");
    heading.className = "block-heading spaced";
    heading.innerHTML = "<h2>Моите фирми</h2>";

    container = document.createElement("div");
    container.id = "profile-businesses";
    container.className = "stack-list";
    container.innerHTML = '<article class="empty-card"><p>Зареждане на фирмените профили…</p></article>';

    questions.insertAdjacentElement("afterend", heading);
    heading.insertAdjacentElement("afterend", container);
    return container;
  }

  function businessCard(item) {
    const note = item.moderation_note?.trim();
    const needsAttention = ["needs_changes", "rejected"].includes(item.status);
    const expandedEditLink = item.is_expanded === true
      ? `<a class="profile-business-link" href="razshiren-profil.html?id=${encodeURIComponent(item.id)}">Редактирай разширения профил</a>`
      : "";
    const safeStatus = ["pending", "approved", "rejected", "needs_changes"].includes(item.status)
      ? item.status
      : "pending";

    return `<article class="profile-business-card" data-status="${escapeHtml(safeStatus)}">
      <div class="profile-business-meta">
        <span class="profile-business-status profile-business-status--${escapeHtml(safeStatus)}">${escapeHtml(labels[item.status] || item.status)}</span>
        <span class="profile-business-date">${escapeHtml(formatDate(item.created_at))}</span>
      </div>
      <h3>${escapeHtml(item.name)}</h3>
      <p><strong>Категория:</strong> ${escapeHtml(item.category)}</p>
      ${needsAttention && note ? `<div class="profile-business-note"><strong>Бележка от администратора:</strong><br>${escapeHtml(note)}</div>` : ""}
      ${item.status === "pending" ? '<p>Профилът чака административен преглед.</p>' : ""}
      ${item.status === "approved" ? '<p>Профилът е публикуван.</p>' : ""}
      <div class="profile-business-actions">
        ${expandedEditLink}
        <a class="profile-business-link" href="firma.html?id=${encodeURIComponent(item.id)}">Преглед</a>
      </div>
    </article>`;
  }

  async function loadBusinesses() {
    injectStyles();

    const container = ensureSection();
    if (!container) return;

    const { data: authData, error: authError } = await client.auth.getUser();
    const user = authError ? null : authData?.user || null;

    if (!user) {
      container.innerHTML = '<article class="empty-card"><p>Влез в профила си, за да видиш своите фирми.</p></article>';
      return;
    }

    const { data, error } = await client
      .from("businesses")
      .select("id, name, category, status, moderation_note, created_at, updated_at, is_expanded")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      container.innerHTML = '<article class="empty-card"><p>Фирмените профили не могат да се заредят.</p></article>';
      return;
    }

    const items = data || [];
    container.innerHTML = items.length
      ? items.map(businessCard).join("")
      : '<article class="empty-card"><p>Все още нямаш добавени фирми.</p><a class="primary-link-button" href="dobavi-firma.html">Добави фирма</a></article>';
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadBusinesses, { once: true });
  } else {
    loadBusinesses();
  }

  client.auth.onAuthStateChange(() => loadBusinesses());
})();
