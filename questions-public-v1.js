(() => {
  "use strict";

  const root = document.querySelector("[data-public-questions-list]");
  if (!root) return;

  const filterButtons = [...document.querySelectorAll("[data-public-question-filter]")];
  const client = window.PopitaiSupabase || null;
  const PAGE_SIZE = 20;

  const PUBLIC_LABELS = {
    "Работа и услуги": "Услуги",
    "Събития и град": "Събития"
  };

  const CATEGORY_HREFS = {
    "Майстори и ремонти": "maistori.html",
    "Здраве и лекари": "zdrave-i-lekari.html",
    "Автомобили": "avtomobili.html",
    "Магазини и покупки": "magazini.html",
    "Заведения": "zavedenia.html",
    "Работа и услуги": "rabota.html",
    "Обяви": "obyavi.html",
    "Събития и град": "sabitiya.html"
  };

  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));

  const formatDate = value => {
    if (!value) return "";
    try {
      return new Intl.DateTimeFormat("bg-BG", {
        day: "2-digit", month: "2-digit", year: "numeric"
      }).format(new Date(value));
    } catch (_) {
      return "";
    }
  };

  let questions = [];
  let answerCounts = new Map();
  let currentFilter = "all";
  let visibleCount = PAGE_SIZE;

  function publicLabel(category) {
    return PUBLIC_LABELS[category] || category || "";
  }

  function filteredQuestions() {
    return questions.filter(item => {
      const count = answerCounts.get(item.id) || 0;
      if (currentFilter === "answered") return count > 0;
      if (currentFilter === "unanswered") return count === 0;
      return true;
    });
  }

  function questionCard(item) {
    const count = answerCounts.get(item.id) || 0;
    const category = publicLabel(item.category);
    const href = CATEGORY_HREFS[item.category] || "kategorii.html";
    return `
      <article class="list-card question-list-card dynamic-question-card" data-question-id="${esc(item.id)}">
        <div class="question-list-content">
          <div class="question-card-category-row">
            <a class="question-category" href="${esc(href)}">${esc(category)}</a>
          </div>
          <h2><a href="vapros.html?id=${encodeURIComponent(item.id)}">${esc(item.title)}</a></h2>
          <p>${esc(item.description)}</p>
          <small>${formatDate(item.created_at)}</small>
        </div>
        <div class="list-card-meta"><strong>${count}</strong><span>${count === 1 ? "отговор" : "отговора"}</span></div>
      </article>`;
  }

  function render() {
    const filtered = filteredQuestions();
    if (!filtered.length) {
      root.innerHTML = `
        <article class="empty-card">
          <h2>${currentFilter === "all" ? "Все още няма одобрени въпроси" : "Няма въпроси с този филтър"}</h2>
          <p>${currentFilter === "all" ? "Задай въпрос и потърси помощ или препоръка от хората в Лом." : "Избери друг филтър или задай нов въпрос."}</p>
          <a class="primary-link-button" href="nov-vapros.html">Задай въпрос</a>
        </article>`;
      return;
    }

    const visible = filtered.slice(0, visibleCount);
    root.innerHTML = visible.map(questionCard).join("");

    if (visible.length < filtered.length) {
      const more = document.createElement("button");
      more.type = "button";
      more.className = "primary-link-button";
      more.textContent = `Покажи още (${filtered.length - visible.length})`;
      more.addEventListener("click", () => {
        visibleCount += PAGE_SIZE;
        render();
      });
      root.appendChild(more);
    }
  }

  async function load() {
    if (!client) {
      root.innerHTML = '<article class="empty-card"><h2>Въпросите не могат да се заредят</h2><p>Опитай отново след малко.</p></article>';
      return;
    }

    const [{ data: questionRows, error }, { data: answers }] = await Promise.all([
      client
        .from("questions")
        .select("id,title,category,description,created_at,status")
        .eq("status", "approved")
        .order("created_at", { ascending: false }),
      client
        .from("answers")
        .select("question_id")
        .eq("status", "approved")
    ]);

    if (error) {
      console.warn("Въпроси: публичният списък не се зареди.", error);
      root.innerHTML = '<article class="empty-card"><h2>Въпросите не могат да се заредят</h2><p>Опитай отново след малко.</p></article>';
      return;
    }

    questions = questionRows || [];
    answerCounts = new Map();
    (answers || []).forEach(answer => {
      answerCounts.set(answer.question_id, (answerCounts.get(answer.question_id) || 0) + 1);
    });
    render();
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.publicQuestionFilter || "all";
      visibleCount = PAGE_SIZE;
      filterButtons.forEach(item => item.classList.toggle("active", item === button));
      render();
    });
  });

  load();
})();
