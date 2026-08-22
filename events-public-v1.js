(() => {
  "use strict";

  const root = document.querySelector("[data-public-events]");
  if (!root) return;

  const client = window.PopitaiSupabase || null;

  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));

  function formatDate(value) {
    if (!value) return "Дата предстои да бъде уточнена";
    try {
      return new Intl.DateTimeFormat("bg-BG", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(value));
    } catch (_) {
      return "Дата предстои да бъде уточнена";
    }
  }

  function emptyState() {
    root.innerHTML = `
      <article class="empty-card">
        <h3>Няма публикувани предстоящи събития</h3>
        <p>Когато има одобрено събитие, то ще се появи тук.</p>
        <a class="primary-link-button" href="nov-vapros.html?category=sabitiya">Задай въпрос за събитие</a>
      </article>`;
  }

  function errorState() {
    root.innerHTML = `
      <article class="empty-card">
        <h3>Събитията не могат да се заредят</h3>
        <p>Опитай отново след малко.</p>
      </article>`;
  }

  function card(item) {
    return `
      <article class="list-card event-public-card">
        <div class="question-list-content">
          <span class="question-category">Събитие</span>
          <h3>${esc(item.title)}</h3>
          <p>${esc(item.description)}</p>
          <div class="db-moderation-meta">
            <strong>${esc(formatDate(item.starts_at))}</strong>
            <span>${esc(item.location)}</span>
          </div>
        </div>
      </article>`;
  }

  async function load() {
    if (!client) {
      errorState();
      return;
    }

    const now = new Date().toISOString();
    const { data, error } = await client
      .from("events")
      .select("id,title,description,location,starts_at")
      .eq("status", "approved")
      .or(`starts_at.is.null,starts_at.gte.${now}`)
      .order("starts_at", { ascending: true, nullsFirst: false });

    if (error) {
      console.warn("Събития: публичният списък не се зареди.", error);
      errorState();
      return;
    }

    const rows = data || [];
    if (!rows.length) {
      emptyState();
      return;
    }

    root.innerHTML = rows.map(card).join("");
  }

  load();
})();
