(() => {
  "use strict";

  const listRoot = document.querySelector("[data-events-list]");
  const addButton = document.querySelector("[data-events-add]");
  const modal = document.getElementById("event-add-modal");
  const form = document.getElementById("event-add-form");
  const statusBox = document.getElementById("event-add-status");
  if (!listRoot && !form) return;

  let client = null;
  let currentUser = null;

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));

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

  function formatDate(value) {
    if (!value) return "Дата предстои да бъде уточнена";
    try {
      return new Intl.DateTimeFormat("bg-BG", {
        day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
      }).format(new Date(value));
    } catch (_) {
      return "";
    }
  }

  function eventCard(item) {
    return `<article class="list-card">
      <div>
        <span class="question-category">Събитие</span>
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.description)}</p>
        <small>${esc(formatDate(item.starts_at))}${item.location ? ` · 📍 ${esc(item.location)}` : ""}</small>
      </div>
    </article>`;
  }

  async function loadEvents() {
    if (!listRoot) return;
    listRoot.innerHTML = '<article class="empty-card"><p>Зареждане на събитията…</p></article>';

    const now = new Date().toISOString();
    const { data, error } = await client
      .from("events")
      .select("id,title,description,location,starts_at,status,created_at")
      .eq("status", "approved")
      .or(`starts_at.is.null,starts_at.gte.${now}`)
      .order("starts_at", { ascending: true, nullsFirst: false })
      .limit(30);

    if (error) {
      console.error("Events load error:", error);
      listRoot.innerHTML = '<article class="empty-card"><p>Събитията не могат да се заредят в момента.</p></article>';
      return;
    }

    const items = data || [];
    listRoot.innerHTML = items.length
      ? items.map(eventCard).join("")
      : '<article class="empty-card"><h3>Няма публикувани предстоящи събития</h3><p>Когато има одобрено събитие, то ще се покаже тук.</p></article>';
  }

  function setStatus(text, isError = false) {
    if (!statusBox) return;
    statusBox.textContent = text || "";
    statusBox.style.color = isError ? "#8a2020" : "#176438";
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    setStatus("");
  }

  function openModal() {
    if (!modal || !currentUser) return;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    form?.querySelector("input,textarea")?.focus();
  }

  async function loadAuth() {
    const { data, error } = await client.auth.getUser();
    currentUser = error ? null : data?.user || null;
    if (addButton) addButton.hidden = !currentUser;
  }

  async function submitEvent(event) {
    event.preventDefault();
    if (!form || !client) return;

    const { data: authData } = await client.auth.getUser();
    currentUser = authData?.user || null;
    if (!currentUser) {
      setStatus("Влез в профила си, за да предложиш събитие.", true);
      if (addButton) addButton.hidden = true;
      return;
    }

    if (!form.reportValidity()) return;

    const fd = new FormData(form);
    const title = String(fd.get("title") || "").trim();
    const description = String(fd.get("description") || "").trim();
    const location = String(fd.get("location") || "").trim();
    const localStartsAt = String(fd.get("starts_at") || "").trim();

    if (title.length < 5 || title.length > 140) {
      setStatus("Заглавието трябва да е между 5 и 140 знака.", true);
      return;
    }
    if (description.length < 20 || description.length > 4000) {
      setStatus("Описанието трябва да е между 20 и 4000 знака.", true);
      return;
    }

    const startsAt = localStartsAt ? new Date(localStartsAt) : null;
    if (startsAt && Number.isNaN(startsAt.getTime())) {
      setStatus("Провери датата и часа на събитието.", true);
      return;
    }

    const submit = form.querySelector('button[type="submit"]');
    if (submit) submit.disabled = true;
    setStatus("Изпращане…");

    const { error } = await client.from("events").insert({
      author_id: currentUser.id,
      title,
      description,
      location,
      starts_at: startsAt ? startsAt.toISOString() : null,
      status: "pending"
    });

    if (submit) submit.disabled = false;
    if (error) {
      console.error("Event submit error:", error);
      setStatus("Събитието не беше изпратено. Провери данните и опитай отново.", true);
      return;
    }

    form.reset();
    setStatus("Събитието е изпратено за преглед.");
  }

  (async () => {
    try {
      client = await waitForClient();
      await Promise.all([loadAuth(), loadEvents()]);
      addButton?.addEventListener("click", openModal);
      form?.addEventListener("submit", submitEvent);
      modal?.querySelectorAll("[data-event-close]").forEach((button) => button.addEventListener("click", closeModal));
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal && !modal.hidden) closeModal();
      });
    } catch (error) {
      console.error("Events init error:", error);
      if (listRoot) listRoot.innerHTML = '<article class="empty-card"><p>Съдържанието не може да се зареди в момента.</p></article>';
    }
  })();
})();
