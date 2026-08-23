(() => {
  "use strict";

  let client = null;
  const root = document.getElementById("profile-corrections");
  if (!root) return;

  async function getClient() {
    if (window.PopitaiSupabase) return window.PopitaiSupabase;
    return new Promise((resolve, reject) => {
      let tries = 0;
      const timer = window.setInterval(() => {
        tries += 1;
        if (window.PopitaiSupabase) {
          window.clearInterval(timer);
          resolve(window.PopitaiSupabase);
        } else if (tries >= 120) {
          window.clearInterval(timer);
          reject(new Error("Supabase client timeout"));
        }
      }, 50);
    });
  }

  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[char]));

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

  function obviousJunkText(value) {
    const text = String(value || "").replace(/\s+/g, " ").trim();
    if (!text) return false;
    const compact = [...text.toLocaleLowerCase("bg-BG")].filter(ch => /[\p{L}\p{N}]/u.test(ch));
    if (compact.length >= 8 && new Set(compact).size <= 2) return true;
    const words = text.toLocaleLowerCase("bg-BG").match(/[\p{L}\p{N}]+/gu) || [];
    return words.length >= 2 && new Set(words).size === 1;
  }

  function validateText(value, min, max, label) {
    const text = String(value || "").trim();
    if (!text) return `Попълни ${label}.`;
    if (text.length < min) return `${label[0].toUpperCase()}${label.slice(1)} трябва да е поне ${min} знака.`;
    if (text.length > max) return `${label[0].toUpperCase()}${label.slice(1)} може да е най-много ${max} знака.`;
    if (obviousJunkText(text)) return `${label[0].toUpperCase()}${label.slice(1)} трябва да съдържа разбираем текст.`;
    return "";
  }

  function setFieldError(field, message) {
    const error = field.closest("label")?.querySelector("[data-correction-error]");
    if (error) error.textContent = message || "";
    if (message) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
    return !message;
  }

  function questionCard(item) {
    return `<article class="db-profile-item profile-correction-card" data-correction-type="question" data-id="${esc(item.id)}">
      <div class="db-moderation-meta"><span class="db-status-badge needs_changes">Нужна е корекция</span><span>${esc(formatDate(item.created_at))}</span></div>
      <h3>Въпрос: ${esc(item.title)}</h3>
      ${item.moderation_note ? `<p><strong>Бележка от администратора:</strong> ${esc(item.moderation_note)}</p>` : ""}
      <form class="content-form" data-correction-form novalidate>
        <label>Заглавие
          <input name="title" value="${esc(item.title)}" minlength="10" maxlength="120" required>
          <span class="form-message field-error" data-correction-error aria-live="polite"></span>
        </label>
        <label>Описание
          <textarea name="description" rows="5" minlength="20" maxlength="5000" required>${esc(item.description)}</textarea>
          <span class="form-message field-error" data-correction-error aria-live="polite"></span>
        </label>
        <button class="form-submit" type="submit">Изпрати отново за одобрение</button>
        <p class="form-message" data-correction-message aria-live="polite"></p>
      </form>
    </article>`;
  }

  function answerCard(item) {
    return `<article class="db-profile-item profile-correction-card" data-correction-type="answer" data-id="${esc(item.id)}">
      <div class="db-moderation-meta"><span class="db-status-badge needs_changes">Нужна е корекция</span><span>${esc(formatDate(item.created_at))}</span></div>
      <h3>Отговор към въпрос</h3>
      ${item.moderation_note ? `<p><strong>Бележка от администратора:</strong> ${esc(item.moderation_note)}</p>` : ""}
      <form class="content-form" data-correction-form novalidate>
        <label>Отговор
          <textarea name="body" rows="5" minlength="3" maxlength="5000" required>${esc(item.body)}</textarea>
          <span class="form-message field-error" data-correction-error aria-live="polite"></span>
        </label>
        <button class="form-submit" type="submit">Изпрати отново за одобрение</button>
        <p class="form-message" data-correction-message aria-live="polite"></p>
      </form>
    </article>`;
  }

  function wireField(field, validate) {
    if (!field) return;
    field.addEventListener("blur", () => {
      field.dataset.touched = "true";
      setFieldError(field, validate());
    });
    field.addEventListener("input", () => {
      if (field.dataset.touched === "true" || field.getAttribute("aria-invalid") === "true") {
        setFieldError(field, validate());
      }
    });
  }

  function wireCard(card) {
    const form = card.querySelector("[data-correction-form]");
    if (!form) return;
    const type = card.dataset.correctionType;
    const id = card.dataset.id;
    const message = form.querySelector("[data-correction-message]");

    const validators = type === "question"
      ? [
          [form.elements.title, () => validateText(form.elements.title.value, 10, 120, "заглавие")],
          [form.elements.description, () => validateText(form.elements.description.value, 20, 5000, "описание")]
        ]
      : [[form.elements.body, () => validateText(form.elements.body.value, 3, 5000, "отговор")]];

    validators.forEach(([field, validate]) => wireField(field, validate));

    form.addEventListener("submit", async event => {
      event.preventDefault();
      let firstInvalid = null;
      validators.forEach(([field, validate]) => {
        field.dataset.touched = "true";
        if (!setFieldError(field, validate()) && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const button = form.querySelector('[type="submit"]');
      button.disabled = true;
      if (message) {
        message.textContent = "Изпращаме корекцията…";
        message.className = "form-message warning";
      }

      const payload = type === "question"
        ? {
            title: form.elements.title.value.trim(),
            description: form.elements.description.value.trim(),
            status: "pending",
            moderation_note: null,
            reviewed_by: null,
            reviewed_at: null
          }
        : {
            body: form.elements.body.value.trim(),
            status: "pending",
            moderation_note: null,
            reviewed_by: null,
            reviewed_at: null
          };

      const table = type === "question" ? "questions" : "answers";
      const { error } = await client.from(table).update(payload).eq("id", id).eq("status", "needs_changes");

      if (error) {
        console.error("Correction resubmit error:", error);
        if (message) {
          message.textContent = "Корекцията не беше изпратена. Опитай отново.";
          message.className = "form-message error";
        }
        button.disabled = false;
        return;
      }

      card.innerHTML = `<div class="db-moderation-meta"><span class="db-status-badge">Чака одобрение</span></div><h3>Корекцията е изпратена</h3><p>Съдържанието е изпратено отново и чака преглед от администратор.</p>`;
      if (!root.querySelector("[data-correction-form]")) {
        window.setTimeout(() => {
          root.innerHTML = '<article class="empty-card"><p>Нямаш съдържание, върнато за корекция.</p></article>';
        }, 1200);
      }
    });
  }

  async function init() {
    root.innerHTML = '<article class="empty-card"><p>Проверка за върнато съдържание…</p></article>';

    try {
      client = client || await getClient();
    } catch (error) {
      console.error("Profile corrections Supabase init error:", error);
      root.innerHTML = '<article class="empty-card"><p>Върнатото за корекция съдържание не може да се зареди.</p></article>';
      return;
    }

    const { data: authData, error: authError } = await client.auth.getUser();
    const user = authError ? null : authData?.user;
    if (!user) {
      root.innerHTML = '<article class="empty-card"><p>Влез в профила си, за да видиш върнатото за корекция съдържание.</p></article>';
      return;
    }

    const { data: profile } = await client.from("profiles").select("is_blocked").eq("id", user.id).maybeSingle();
    if (profile?.is_blocked === true) {
      root.innerHTML = '<article class="empty-card"><p>Профилът е ограничен и не може да изпраща корекции.</p></article>';
      return;
    }

    const [questionsResult, answersResult] = await Promise.all([
      client.from("questions")
        .select("id,title,description,status,moderation_note,created_at")
        .eq("author_id", user.id)
        .eq("status", "needs_changes")
        .order("created_at", { ascending:false }),
      client.from("answers")
        .select("id,question_id,body,status,moderation_note,created_at")
        .eq("author_id", user.id)
        .eq("status", "needs_changes")
        .order("created_at", { ascending:false })
    ]);

    if (questionsResult.error || answersResult.error) {
      console.error("Profile corrections load error:", questionsResult.error || answersResult.error);
      root.innerHTML = '<article class="empty-card"><p>Върнатото за корекция съдържание не може да се зареди.</p></article>';
      return;
    }

    const questions = questionsResult.data || [];
    const answers = answersResult.data || [];
    const html = [
      ...questions.map(questionCard),
      ...answers.map(answerCard)
    ].join("");

    root.innerHTML = html || '<article class="empty-card"><p>Нямаш съдържание, върнато за корекция.</p></article>';
    root.querySelectorAll(".profile-correction-card").forEach(wireCard);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once:true });
  } else {
    init();
  }
})();
