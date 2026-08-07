// Попитай.Лом — окончателно публично показване само на одобрени отговори
(() => {
  const client = window.PopitaiSupabase;
  const answersList = document.querySelector("#answers-list");
  const answersCount = document.querySelector("#answers-count");
  const questionId = new URLSearchParams(window.location.search).get("id");

  if (!client || !answersList || !questionId) return;

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const formatDate = (value) => {
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
  };

  async function renderApprovedAnswers() {
    // Старите тестови записи не трябва повече да управляват страницата.
    try {
      localStorage.removeItem("popitaiQuestions");
    } catch (_) {}

    const { data, error } = await client
      .from("answers")
      .select("id, body, created_at, status")
      .eq("question_id", questionId)
      .eq("status", "approved")
      .order("created_at", { ascending: true });

    if (error) {
      answersList.innerHTML = '<article class="empty-card"><p>Отговорите временно не могат да се заредят.</p></article>';
      if (answersCount) answersCount.textContent = "0 отговора";
      return;
    }

    const approved = (data || []).filter((item) => item.status === "approved");
    if (answersCount) {
      answersCount.textContent = `${approved.length} ${approved.length === 1 ? "отговор" : "отговора"}`;
    }

    answersList.innerHTML = approved.length
      ? approved.map((answer) => `
        <article class="answer-card" data-approved-answer="${escapeHtml(answer.id)}">
          <div class="author-row">
            <div class="avatar">П</div>
            <div><strong>Член на общността</strong><span>${formatDate(answer.created_at)}</span></div>
          </div>
          <p>${escapeHtml(answer.body)}</p>
        </article>`).join("")
      : '<article class="empty-card"><p>Все още няма одобрени отговори.</p></article>';
  }

  renderApprovedAnswers();
  // Повторна проверка след приключване на всички стари скриптове и кеширани обработчици.
  window.setTimeout(renderApprovedAnswers, 400);
  window.setTimeout(renderApprovedAnswers, 1200);
})();
