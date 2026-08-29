(() => {
  "use strict";

  const businessRoot = document.querySelector("[data-category-businesses]");
  const questionRoot = document.querySelector("[data-category-questions]");
  const isEventsPage = questionRoot?.dataset.categoryQuestions === "Събития и град";
  if (!businessRoot && !questionRoot) return;

  const publicCategoryLabel = (value, type) =>
    window.PopitaiCategoryDictionary?.publicLabel?.(value, type) || value || "";

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));

  const formatDate = (value) => {
    if (!value) return "";
    try {
      return new Intl.DateTimeFormat("bg-BG", {
        day: "2-digit", month: "2-digit", year: "numeric"
      }).format(new Date(value));
    } catch (_) {
      return "";
    }
  };

  async function waitForClient() {
    if (window.PopitaiSupabase) return window.PopitaiSupabase;
    return new Promise((resolve, reject) => {
      let tries = 0;
      const timer = setInterval(() => {
        tries += 1;
        if (window.PopitaiSupabase) {
          clearInterval(timer);
          resolve(window.PopitaiSupabase);
        } else if (tries > 120) {
          clearInterval(timer);
          reject(new Error("Supabase client timeout"));
        }
      }, 50);
    });
  }

  function ensureEventsSection() {
    if (!isEventsPage || document.querySelector("[data-public-events]")) return;
    const grid = document.querySelector(".subcategory-grid");
    if (!grid) return;

    const section = document.createElement("section");
    section.className = "category-events-section";
    section.innerHTML = `
      <div class="block-heading spaced"><h2>Предстоящи събития</h2></div>
      <div class="stack-list" data-public-events>
        <article class="empty-card"><p>Зареждане на събитията…</p></article>
      </div>`;
    grid.insertAdjacentElement("afterend", section);

    const script = document.createElement("script");
    script.src = "events-public-v1.js?v=20260822-1833";
    script.defer = true;
    document.body.appendChild(script);
  }

  function businessCard(item) {
    const initial = esc(String(item.name || "Ф").trim().charAt(0).toUpperCase() || "Ф");
    return `<article class="business-list-card" data-business-id="${esc(item.id)}">
      <div class="firm-logo">${initial}</div>
      <div class="business-main">
        <div class="firm-title-row"><h3><a href="firma.html?id=${encodeURIComponent(item.id)}">${esc(item.name)}</a></h3></div>
        <span class="question-category">${esc(publicCategoryLabel(item.category, "business"))}</span>
        ${item.description ? `<p>${esc(item.description)}</p>` : ""}
        ${item.city ? `<p>📍 ${esc(item.city)}</p>` : ""}
        <div class="category-hub-actions">
          <a class="primary-link-button" href="firma.html?id=${encodeURIComponent(item.id)}">Виж профила</a>
          ${item.phone ? `<a href="tel:${esc(String(item.phone).replace(/[^\d+]/g, ""))}">Обади се</a>` : ""}
        </div>
      </div>
    </article>`;
  }

  function questionCard(item, answerCount) {
    return `<article class="compact-card dynamic-question-card" data-question-id="${esc(item.id)}">
      <div class="question-card-category-row"><span class="question-category">${esc(publicCategoryLabel(item.category, "question"))}</span></div>
      <h3><a href="vapros.html?id=${encodeURIComponent(item.id)}">${esc(item.title)}</a></h3>
      <p>${esc(item.description)}</p>
      <small>${formatDate(item.created_at)} · ${answerCount} ${answerCount === 1 ? "отговор" : "отговора"}</small>
    </article>`;
  }

  async function loadBusinesses(client) {
    if (!businessRoot) return;
    const category = businessRoot.dataset.categoryBusinesses || "";
    const limit = Math.max(1, Math.min(12, Number(businessRoot.dataset.limit || 6)));
    if (!category) return;

    businessRoot.innerHTML = '<article class="empty-card"><p>Зареждане на фирмите…</p></article>';

    const { data, error } = await client
      .from("businesses")
      .select("id,name,category,description,phone,city,status,created_at")
      .eq("status", "approved")
      .eq("category", category)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      businessRoot.innerHTML = '<article class="empty-card"><p>Фирмите не могат да се заредят в момента.</p><a href="firmi.html">Виж всички фирми</a></article>';
      return;
    }

    const items = data || [];
    businessRoot.innerHTML = items.length
      ? items.map(businessCard).join("")
      : '<article class="empty-card"><h3>Все още няма одобрени фирми тук</h3><p>Можеш да разгледаш общия каталог или да зададеш въпрос към хората от Лом.</p><a class="primary-link-button" href="firmi.html">Всички фирми</a></article>';
  }

  async function loadQuestions(client) {
    if (!questionRoot) return;
    const category = questionRoot.dataset.categoryQuestions || "";
    const limit = Math.max(1, Math.min(12, Number(questionRoot.dataset.limit || 4)));
    if (!category) return;

    questionRoot.innerHTML = '<article class="empty-card"><p>Зареждане на въпросите…</p></article>';

    const { data: questions, error } = await client
      .from("questions")
      .select("id,title,category,description,created_at,status")
      .eq("status", "approved")
      .eq("category", category)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      questionRoot.innerHTML = '<article class="empty-card"><p>Въпросите не могат да се заредят в момента.</p><a href="vaprosi.html">Виж всички въпроси</a></article>';
      return;
    }

    const items = questions || [];
    const counts = new Map();
    const ids = items.map((item) => item.id);

    if (ids.length) {
      const { data: answers } = await client
        .from("answers")
        .select("question_id")
        .eq("status", "approved")
        .in("question_id", ids);

      (answers || []).forEach((answer) => {
        counts.set(answer.question_id, (counts.get(answer.question_id) || 0) + 1);
      });
    }

    questionRoot.innerHTML = items.length
      ? items.map((item) => questionCard(item, counts.get(item.id) || 0)).join("")
      : '<article class="empty-card"><h3>Все още няма одобрени въпроси</h3><p>Задай въпрос и потърси препоръка от местната общност.</p><a class="primary-link-button" href="nov-vapros.html">Задай въпрос</a></article>';
  }

  ensureEventsSection();

  (async () => {
    try {
      const client = await waitForClient();
      await Promise.all([loadBusinesses(client), loadQuestions(client)]);
    } catch (error) {
      console.error("Category hub load error:", error);
      if (businessRoot) businessRoot.innerHTML = '<article class="empty-card"><p>Съдържанието не може да се зареди в момента.</p></article>';
      if (questionRoot) questionRoot.innerHTML = '<article class="empty-card"><p>Съдържанието не може да се зареди в момента.</p></article>';
    }
  })();
})();
