// Попитай.Лом — въпроси, отговори и модерация чрез Supabase
(() => {
  const supabase = window.PopitaiSupabase;
  if (!supabase) return;

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
  const formatDate = (value) => {
    if (!value) return "";
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

  const statusLabels = {
    pending: "Чака одобрение",
    approved: "Одобрено",
    rejected: "Отказано",
    needs_changes: "Нужна е корекция"
  };

  const style = document.createElement("style");
  style.textContent = `
    .db-status-badge{display:inline-flex;align-items:center;gap:.35rem;padding:.28rem .62rem;border-radius:999px;font-size:.78rem;font-weight:800;background:#fff3cd;color:#6b4b00;border:1px solid #efd37b}
    .db-status-badge.approved{background:#eaf8ef;color:#176438;border-color:#abd9ba}
    .db-status-badge.rejected{background:#fdecec;color:#8a2020;border-color:#efb2b2}
    .db-status-badge.needs_changes{background:#eef3ff;color:#234e9c;border-color:#b8c9ef}
    .db-moderation-card{padding:1rem;border:1px solid #d9e2ef;border-radius:16px;background:#fff;display:grid;gap:.75rem}
    .db-moderation-card h3{margin:0;color:#061a38}
    .db-moderation-meta{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;font-size:.88rem;color:#52627a}
    .db-moderation-actions{display:flex;flex-wrap:wrap;gap:.55rem}
    .db-moderation-actions button{border:0;border-radius:10px;padding:.62rem .85rem;font-weight:800;cursor:pointer}
    .db-approve{background:#176438;color:#fff}.db-changes{background:#d49a13;color:#061a38}.db-reject{background:#9f2d2d;color:#fff}
    .db-inline-notice{padding:.8rem 1rem;border-radius:12px;background:#eef5ff;border:1px solid #c8daf5;color:#173d75;margin:0 0 1rem}
    .db-profile-item{padding:1rem;border:1px solid #d9e2ef;border-radius:14px;background:#fff;display:grid;gap:.5rem}
    .db-profile-item h3{margin:0}.db-profile-item p{margin:0;color:#52627a}
  `;
  document.head.appendChild(style);

  let authUser = null;
  let authProfile = null;
  let approvedQuestions = [];
  let answerCounts = new Map();

  function setMessage(selector, text, type = "warning") {
    const element = qs(selector);
    if (!element) return;
    element.textContent = text;
    element.classList.remove("is-error", "is-success", "is-warning");
    element.classList.add(`is-${type}`);
  }

  function errorText(error, fallback) {
    const message = String(error?.message || "").toLowerCase();
    if (!navigator.onLine || message.includes("failed to fetch") || message.includes("network")) {
      return "Няма връзка със системата. Провери интернет връзката си и опитай отново.";
    }
    if (message.includes("row-level security") || message.includes("permission denied")) {
      return "Нямаш разрешение за това действие. Провери дали си влязъл в профила си.";
    }
    return fallback;
  }

  async function loadAuthContext() {
    const { data, error } = await supabase.auth.getUser();
    authUser = error ? null : (data?.user || null);
    authProfile = null;

    if (authUser) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, display_name, role, is_blocked")
        .eq("id", authUser.id)
        .maybeSingle();
      authProfile = profile || null;
    }

    return { user: authUser, profile: authProfile };
  }

  const authReady = loadAuthContext();

  function questionCard(question, compact = false) {
    const count = answerCounts.get(question.id) || 0;
    const titleTag = compact ? "h3" : "h2";
    const cardClass = compact
      ? "compact-card dynamic-question-card"
      : "list-card question-list-card dynamic-question-card";
    const innerClass = compact ? "" : "question-list-content";
    const content = `
      <div class="question-card-category-row">
        <span class="question-category">${escapeHtml(question.category)}</span>
      </div>
      <${titleTag}><a href="vapros.html?id=${encodeURIComponent(question.id)}">${escapeHtml(question.title)}</a></${titleTag}>
      <p>${escapeHtml(question.description)}</p>
      <small>${formatDate(question.created_at)} · ${count} ${count === 1 ? "отговор" : "отговора"}</small>`;

    if (compact) return `<article class="${cardClass}" data-question-id="${escapeHtml(question.id)}">${content}</article>`;
    return `<article class="${cardClass}" data-question-id="${escapeHtml(question.id)}"><div class="${innerClass}">${content}</div><div class="list-card-meta"><strong>${count}</strong><span>${count === 1 ? "отговор" : "отговора"}</span></div></article>`;
  }

  function renderQuestionList(container, questions, compact = false) {
    if (!container) return;
    if (!questions.length) {
      container.innerHTML = `<article class="empty-card"><h3>Все още няма одобрени въпроси</h3><p>Новите въпроси се показват след преглед от администратор.</p><a class="primary-link-button" href="nov-vapros.html">Задай въпрос</a></article>`;
      return;
    }
    container.innerHTML = questions.map((item) => questionCard(item, compact)).join("");
  }

  async function loadApprovedQuestions() {
    const hasQuestionContainers = qs("#questions-list") || qs("#home-questions") || qs(".category-question-list");
    if (!hasQuestionContainers) return;

    const [{ data: questions, error }, { data: answers }] = await Promise.all([
      supabase
        .from("questions")
        .select("id, title, category, description, created_at, status")
        .eq("status", "approved")
        .order("created_at", { ascending: false }),
      supabase
        .from("answers")
        .select("id, question_id")
        .eq("status", "approved")
    ]);

    if (error) {
      const container = qs("#questions-list") || qs("#home-questions");
      if (container) container.innerHTML = `<article class="empty-card"><h3>Въпросите не могат да се заредят</h3><p>${escapeHtml(errorText(error, "Опитай отново след малко."))}</p></article>`;
      return;
    }

    approvedQuestions = questions || [];
    answerCounts = new Map();
    (answers || []).forEach((answer) => {
      answerCounts.set(answer.question_id, (answerCounts.get(answer.question_id) || 0) + 1);
    });

    renderQuestionList(qs("#questions-list"), approvedQuestions, false);
    renderQuestionList(qs("#home-questions"), approvedQuestions.slice(0, 4), true);
    qsa(".category-question-list").forEach((container) => {
      const category = container.dataset.questionCategory;
      renderQuestionList(container, approvedQuestions.filter((item) => item.category === category).slice(0, 4), true);
    });

    qsa("[data-question-filter]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        qsa("[data-question-filter]").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        const mode = button.dataset.questionFilter;
        const filtered = approvedQuestions.filter((item) => {
          const count = answerCounts.get(item.id) || 0;
          if (mode === "answered") return count > 0;
          if (mode === "unanswered") return count === 0;
          return true;
        });
        renderQuestionList(qs("#questions-list"), filtered, false);
      }, true);
    });
  }

  async function initQuestionForm() {
    const form = qs("#new-question-form");
    if (!form) return;

    const uploader = qs("#question-image-uploader");
    if (uploader) {
      uploader.hidden = true;
      const notice = document.createElement("p");
      notice.className = "db-inline-notice";
      notice.textContent = "Снимките ще бъдат активирани в следващия етап. В момента се изпраща текстът на въпроса.";
      uploader.insertAdjacentElement("afterend", notice);
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();

      const submitButton = form.querySelector('[type="submit"]');
      submitButton.disabled = true;
      setMessage("#new-question-message", "Изпращаме въпроса за одобрение…", "warning");

      await authReady;
      if (!authUser) {
        setMessage("#new-question-message", "Трябва да влезеш в профила си, преди да зададеш въпрос.", "error");
        submitButton.disabled = false;
        return;
      }
      if (authProfile?.is_blocked) {
        setMessage("#new-question-message", "Профилът е ограничен и не може да изпраща съдържание.", "error");
        submitButton.disabled = false;
        return;
      }

      const isAdmin = authProfile?.role === "admin" && authProfile?.is_blocked !== true;

      const payload = {
        author_id: authUser.id,
        title: qs("#question-title")?.value.trim(),
        category: qs("#question-category")?.value,
        description: qs("#question-description")?.value.trim(),
        status: isAdmin ? "approved" : "pending"
      };

      const { error } = await supabase.from("questions").insert(payload);
      if (error) {
        setMessage("#new-question-message", errorText(error, "Не успяхме да изпратим въпроса. Провери данните и опитай отново."), "error");
        submitButton.disabled = false;
        return;
      }

      form.reset();
      setMessage("#new-question-message", isAdmin
        ? "Готово. Въпросът е публикуван."
        : "Готово. Въпросът е изпратен и чака одобрение от администратор.", "success");
      submitButton.disabled = false;
    }, true);
  }

  async function loadQuestionDetail() {
    const title = qs("#question-detail-title");
    if (!title) return;

    await authReady;
    const id = new URLSearchParams(window.location.search).get("id");
    const detailCard = qs("#question-detail-card");
    const notFound = qs("#question-not-found");
    const answerArea = qs("#question-answer-area");

    if (!id) {
      title.textContent = "Въпросът не е намерен";
      if (detailCard) detailCard.hidden = true;
      if (notFound) notFound.hidden = false;
      if (answerArea) answerArea.hidden = true;
      return;
    }

    const { data: question, error } = await supabase
      .from("questions")
      .select("id, author_id, title, category, description, status, moderation_note, created_at")
      .eq("id", id)
      .maybeSingle();

    if (error || !question) {
      title.textContent = "Въпросът не е намерен";
      if (detailCard) detailCard.hidden = true;
      if (notFound) notFound.hidden = false;
      if (answerArea) answerArea.hidden = true;
      return;
    }

    document.title = `${question.title} | Попитай.Лом`;
    title.textContent = question.title;
    if (qs("#question-detail-summary")) qs("#question-detail-summary").textContent = question.description;
    if (qs("#question-detail-description")) qs("#question-detail-description").textContent = question.description;
    if (qs("#question-author-name")) qs("#question-author-name").textContent = "Член на общността";
    if (qs("#question-author-avatar")) qs("#question-author-avatar").textContent = "П";
    if (qs("#question-created-at")) qs("#question-created-at").textContent = formatDate(question.created_at);
    if (qs("#question-hero-category")) {
      qs("#question-hero-category").innerHTML = `<span>${escapeHtml(question.category)}</span>${question.status !== "approved" ? `<span class="db-status-badge ${escapeHtml(question.status)}">${escapeHtml(statusLabels[question.status] || question.status)}</span>` : ""}`;
    }
    if (qs("#question-category-link")) {
      qs("#question-category-link").textContent = question.category;
    }

    const { data: answers, error: answersError } = await supabase
      .from("answers")
      .select("id, body, created_at")
      .eq("question_id", question.id)
      .eq("status", "approved")
      .order("created_at", { ascending: true });

    const answersList = qs("#answers-list");
    const answersCount = qs("#answers-count");
    if (!answersError) {
      const items = answers || [];
      if (answersCount) answersCount.textContent = `${items.length} ${items.length === 1 ? "отговор" : "отговора"}`;
      if (answersList) {
        answersList.innerHTML = items.length
          ? items.map((answer) => `<article class="answer-card"><div class="author-row"><div class="avatar">П</div><div><strong>Член на общността</strong><span>${formatDate(answer.created_at)}</span></div></div><p>${escapeHtml(answer.body)}</p></article>`).join("")
          : '<article class="empty-card"><p>Все още няма одобрени отговори.</p></article>';
      }
    }

    const answerForm = qs("#answer-form");
    if (answerForm) {
      if (question.status !== "approved") {
        answerForm.hidden = true;
      } else {
        answerForm.addEventListener("submit", async (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
          const button = answerForm.querySelector('[type="submit"]');
          button.disabled = true;
          setMessage("#answer-message", "Изпращаме отговора за одобрение…", "warning");

          await authReady;
          if (!authUser) {
            setMessage("#answer-message", "Трябва да влезеш в профила си, преди да отговориш.", "error");
            button.disabled = false;
            return;
          }

          const body = qs("#answer-text")?.value.trim();
          const { error: insertError } = await supabase.from("answers").insert({
            question_id: question.id,
            author_id: authUser.id,
            body,
            status: "pending"
          });

          if (insertError) {
            setMessage("#answer-message", errorText(insertError, "Не успяхме да изпратим отговора. Опитай отново."), "error");
            button.disabled = false;
            return;
          }

          answerForm.reset();
          setMessage("#answer-message", "Отговорът е изпратен и чака одобрение от администратор.", "success");
          button.disabled = false;
        }, true);
      }
    }
  }

  function moderationCard(item, type) {
    const isQuestion = type === "question";
    const title = isQuestion ? item.title : `Отговор към въпрос ${item.question_id}`;
    const text = isQuestion ? item.description : item.body;
    return `<article class="db-moderation-card" data-moderation-type="${type}" data-moderation-id="${escapeHtml(item.id)}">
      <div class="db-moderation-meta"><span class="db-status-badge ${escapeHtml(item.status)}">${escapeHtml(statusLabels[item.status] || item.status)}</span><span>${formatDate(item.created_at)}</span></div>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(text)}</p>
      ${item.moderation_note ? `<p><strong>Бележка:</strong> ${escapeHtml(item.moderation_note)}</p>` : ""}
      <div class="db-moderation-actions">
        <button class="db-approve" type="button" data-moderation-action="approved">Одобри</button>
        <button class="db-changes" type="button" data-moderation-action="needs_changes">Върни за корекция</button>
        <button class="db-reject" type="button" data-moderation-action="rejected">Откажи</button>
      </div>
    </article>`;
  }

  async function initAdminPanel() {
    const container = qs("#admin-questions");
    if (!container) return;

    await authReady;
    const staff = authProfile && ["admin", "moderator"].includes(authProfile.role) && !authProfile.is_blocked;
    const testTools = qs(".admin-test-tools");
    if (testTools) testTools.hidden = true;

    if (!staff) {
      container.innerHTML = '<article class="empty-card"><h3>Нямаш достъп</h3><p>Тази страница е само за администратори и модератори.</p></article>';
      qsa(".admin-stats, .admin-menu").forEach((element) => { element.hidden = true; });
      return;
    }

    const [{ data: questions, error: qError }, { data: answers, error: aError }] = await Promise.all([
      supabase
        .from("questions")
        .select("id, title, description, status, moderation_note, created_at")
        .neq("status", "approved")
        .order("created_at", { ascending: false }),
      supabase
        .from("answers")
        .select("id, question_id, body, status, created_at")
        .neq("status", "approved")
        .order("created_at", { ascending: false })
    ]);

    if (qError || aError) {
      container.innerHTML = `<article class="empty-card"><h3>Данните не могат да се заредят</h3><p>${escapeHtml(errorText(qError || aError, "Опитай отново след малко."))}</p></article>`;
      return;
    }

    const queue = [
      ...(questions || []).map((item) => ({ ...item, _type: "question" })),
      ...(answers || []).map((item) => ({ ...item, _type: "answer" }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    container.innerHTML = queue.length
      ? queue.map((item) => moderationCard(item, item._type)).join("")
      : '<article class="empty-card"><h3>Няма съдържание за преглед</h3><p>Всички въпроси и отговори са обработени.</p></article>';

    const heading = container.previousElementSibling?.querySelector("h2");
    if (heading) heading.textContent = "Чакащи въпроси и отговори";

    const [{ count: usersCount }, { count: pendingCount }] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("questions").select("id", { count: "exact", head: true }).eq("status", "pending")
    ]);
    if (qs("#admin-users-count")) qs("#admin-users-count").textContent = String(usersCount || 0);
    if (qs("#admin-questions-count")) qs("#admin-questions-count").textContent = String(pendingCount || 0);

    container.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-moderation-action]");
      if (!button) return;
      event.preventDefault();
      event.stopImmediatePropagation();

      const card = button.closest("[data-moderation-type]");
      const type = card.dataset.moderationType;
      const id = card.dataset.moderationId;
      const status = button.dataset.moderationAction;
      let note = "";
      if (status !== "approved") {
        note = window.prompt(status === "rejected" ? "Причина за отказа:" : "Какво трябва да се коригира:") || "";
        if (!note.trim()) return;
      }

      qsa("button", card).forEach((item) => { item.disabled = true; });
      const table = type === "question" ? "questions" : "answers";
      const { error } = await supabase
        .from(table)
        .update({
          status,
          moderation_note: note.trim(),
          reviewed_by: authUser.id,
          reviewed_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) {
        window.alert(errorText(error, "Промяната не беше записана."));
        qsa("button", card).forEach((item) => { item.disabled = false; });
        return;
      }

      card.remove();
      if (!container.querySelector("[data-moderation-type]")) {
        container.innerHTML = '<article class="empty-card"><h3>Няма съдържание за преглед</h3><p>Всички въпроси и отговори са обработени.</p></article>';
      }
    }, true);
  }

  async function loadProfileQuestions() {
    const container = qs("#profile-questions");
    if (!container) return;

    container.innerHTML = '<article class="empty-card"><p>Зареждане на въпросите…</p></article>';

    await authReady;
    if (!authUser) {
      container.innerHTML = '<article class="empty-card"><p>Влез в профила си, за да видиш въпросите си.</p></article>';
      return;
    }

    const { data, error } = await supabase
      .from("questions")
      .select("id, title, description, status, moderation_note, created_at")
      .eq("author_id", authUser.id)
      .order("created_at", { ascending: false });

    if (error) {
      container.innerHTML = `<article class="empty-card"><p>${escapeHtml(errorText(error, "Въпросите ти не могат да се заредят."))}</p></article>`;
      return;
    }

    const questions = data || [];
    container.innerHTML = questions.length
      ? questions.map((item) => `<article class="db-profile-item">
          <div class="db-moderation-meta"><span class="db-status-badge ${escapeHtml(item.status)}">${escapeHtml(statusLabels[item.status] || item.status)}</span><span>${formatDate(item.created_at)}</span></div>
          <h3>${item.status === "approved" ? `<a href="vapros.html?id=${encodeURIComponent(item.id)}">${escapeHtml(item.title)}</a>` : escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
          ${item.moderation_note ? `<p><strong>Бележка от администратора:</strong> ${escapeHtml(item.moderation_note)}</p>` : ""}
        </article>`).join("")
      : '<article class="empty-card"><p>Все още нямаш изпратени въпроси.</p></article>';
  }

  Promise.allSettled([
    initQuestionForm(),
    loadApprovedQuestions(),
    loadQuestionDetail(),
    initAdminPanel(),
    loadProfileQuestions()
  ]).catch(() => {});
})();