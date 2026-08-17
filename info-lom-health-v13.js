(() => {
  "use strict";

  const q = (sel, root = document) => root.querySelector(sel);
  const qa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const norm = value => String(value || "")
    .toLocaleLowerCase("bg")
    .replace(/[„“"'’`]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  async function waitForClient(maxMs = 10000) {
    const start = Date.now();
    while (!window.PopitaiSupabase && Date.now() - start < maxMs) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return window.PopitaiSupabase || null;
  }

  function cleanAuditText() {
    qa('[data-info-category-root="zdrave"] .info-card-confirmed').forEach(el => {
      const text = String(el.textContent || "")
        .replace(/\s*[—–-]?\s*финален одит\b/gi, "")
        .replace(/\s{2,}/g, " ")
        .replace(/[—–-]\s*$/g, "")
        .trim();

      if (text && text !== el.textContent.trim()) {
        el.textContent = text;
      }
    });
  }

  function addPractice(card, practice) {
    if (!card || !practice || q(".health-doctor-practice", card)) return;

    const row = document.createElement("div");
    row.className = "health-doctor-practice";

    const icon = document.createElement("span");
    icon.textContent = "🏥";

    const text = document.createElement("span");
    text.textContent = practice;

    row.append(icon, text);

    const actions = q(".info-card-actions", card);
    card.insertBefore(row, actions || null);
  }

  async function addPractices() {
    const client = await waitForClient();
    if (!client) return;

    const { data, error } = await client
      .from("info_entries")
      .select("name,data")
      .eq("category", "zdrave")
      .eq("subcategory", "lekari")
      .eq("entry_type", "doctor")
      .eq("publication_status", "published");

    if (error || !Array.isArray(data)) return;

    const practices = new Map(
      data.map(entry => [
        norm(entry.name),
        entry?.data?.practice_name || entry?.data?.practice || ""
      ])
    );

    qa("#zdrave-lekari .info-card").forEach(card => {
      const name = q(".info-card-name", card)?.textContent?.trim() || "";
      const practice = practices.get(norm(name));
      if (practice) addPractice(card, practice);
    });
  }


  function ensureRoleStyles() {
    if (q("#health-doctor-role-style")) return;

    const style = document.createElement("style");
    style.id = "health-doctor-role-style";
    style.textContent = `
      #zdrave-lekari .health-doctor-role{
        display:inline-flex;
        align-items:center;
        width:max-content;
        max-width:100%;
        margin:0 0 8px;
        padding:5px 9px;
        border-radius:999px;
        background:#eaf4fb;
        color:#15517d;
        font-size:.72rem;
        line-height:1.2;
        font-weight:850;
        letter-spacing:.02em;
      }
      #zdrave-lekari .health-doctor-role--specialist{
        background:#f1ecfb;
        color:#5e3d91;
      }
      #zdrave-lekari .health-doctor-specialty{
        margin-top:5px;
        color:#536a7c;
        font-size:.84rem;
        line-height:1.35;
      }
      #zdrave-lekari .health-doctor-practice::before{
        content:"Практика:";
        font-weight:800;
        color:#40586c;
      }
      #zdrave-lekari .health-doctor-practice > span:first-child{
        display:none;
      }
      @media(max-width:760px){
        #zdrave-lekari .health-doctor-role{
          font-size:.7rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function getSpecialty(card) {
    for (const row of qa(".info-card-meta", card)) {
      const text = row.lastElementChild?.textContent?.trim() || "";
      if (/^Специалност:/i.test(text)) {
        return text.replace(/^Специалност:\s*/i, "").trim();
      }
    }
    return "";
  }

  function normalizeOplSpecialty(card) {
    for (const row of qa(".info-card-meta", card)) {
      const textEl = row.lastElementChild;
      const text = textEl?.textContent?.trim() || "";
      if (/^Специалност:/i.test(text) && /общопрактикуващ|ОПЛ/i.test(text)) {
        textEl.textContent = "Общопрактикуващ лекар (ОПЛ)";
        row.classList.add("health-doctor-specialty");
      }
    }
  }

  function addRoleLabels() {
    qa("#zdrave-lekari .info-card").forEach(card => {
      if (q(".health-doctor-role", card)) return;

      const specialty = getSpecialty(card);
      const isOpl = /общопрактикуващ|ОПЛ|личен лекар/i.test(specialty);

      const badge = document.createElement("div");
      badge.className = "health-doctor-role" + (isOpl ? "" : " health-doctor-role--specialist");
      badge.textContent = isOpl ? "Личен лекар" : (specialty || "Лекар специалист");

      const name = q(".info-card-name", card);
      if (name) {
        card.insertBefore(badge, name);
      } else {
        card.prepend(badge);
      }

      if (isOpl) normalizeOplSpecialty(card);
    });
  }

  async function run() {
    ensureRoleStyles();
    cleanAuditText();
    await addPractices();
    addRoleLabels();
    cleanAuditText();

    const root = q('[data-info-category-root="zdrave"]');
    if (!root) return;

    const observer = new MutationObserver(() => {
      cleanAuditText();
      addPractices();
      addRoleLabels();
    });

    observer.observe(root, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();
