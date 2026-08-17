(() => {
  "use strict";

  /*
    Финален публичен слой за секция „Лекари“.
    Данните идват от Supabase. Тук има само UX подреждане и публично почистване.
  */

  const q = (sel, root = document) => root.querySelector(sel);
  const qa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const norm = value => String(value || "")
    .toLocaleLowerCase("bg")
    .replace(/[„“"'’`]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  function isOplCard(card) {
    const text = norm(card.textContent);
    return (
      text.includes("общопрактикуващ лекар") ||
      text.includes("личен лекар") ||
      text.includes(" / опл") ||
      text.includes("специалност: опл")
    );
  }

  function doctorName(card) {
    return q(".info-card-name", card)?.textContent?.trim() || "";
  }

  function ensureDoctorStyles() {
    if (q("#health-doctors-final-style")) return;

    const style = document.createElement("style");
    style.id = "health-doctors-final-style";
    style.textContent = `
      #zdrave-bolnica,
      #zdrave-lekari,
      #zdrave-apteki,
      #zdrave-stomatolozi,
      #zdrave-veterinari,
      #zdrave-vet-apteki,
      #zdrave-laboratorii{
        scroll-margin-top:205px;
      }

      #zdrave-lekari .health-doctors-final{
        margin-top:14px;
      }
      #zdrave-lekari .health-doctors-toolbar{
        display:flex;
        flex-wrap:wrap;
        align-items:center;
        gap:10px;
        margin:0 0 16px;
        padding:12px;
        border:1px solid rgba(24,78,116,.12);
        border-radius:16px;
        background:#f8fbfd;
      }
      #zdrave-lekari .health-doctors-search{
        flex:1 1 250px;
        min-width:0;
        border:1px solid rgba(24,78,116,.18);
        border-radius:12px;
        background:#fff;
        padding:10px 12px;
        font:inherit;
      }
      #zdrave-lekari .health-doctors-tabs{
        display:flex;
        flex-wrap:wrap;
        gap:6px;
      }
      #zdrave-lekari .health-doctors-tab{
        border:1px solid rgba(24,78,116,.16);
        border-radius:999px;
        background:#fff;
        color:#24485f;
        padding:8px 11px;
        font:inherit;
        font-size:.82rem;
        font-weight:700;
        cursor:pointer;
      }
      #zdrave-lekari .health-doctors-tab.is-active{
        background:#173e5c;
        color:#fff;
        border-color:#173e5c;
      }
      #zdrave-lekari .health-doctor-group{
        margin:0 0 18px;
        padding:14px;
        border:1px solid rgba(24,78,116,.10);
        border-radius:18px;
        background:#fbfdff;
      }
      #zdrave-lekari .health-doctor-group-head{
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:12px;
        margin-bottom:12px;
      }
      #zdrave-lekari .health-doctor-group-head h3{
        margin:0;
        color:#173e5c;
        font-size:1.08rem;
      }
      #zdrave-lekari .health-doctor-group-head p{
        margin:4px 0 0;
        color:#6b7d8d;
        font-size:.8rem;
      }
      #zdrave-lekari .health-doctor-group-count{
        flex:0 0 auto;
        border-radius:999px;
        background:#eaf4fb;
        color:#15517d;
        padding:5px 9px;
        font-size:.72rem;
        font-weight:800;
      }
      #zdrave-lekari .health-doctor-grid{
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:10px;
      }
      #zdrave-lekari .health-doctor-grid > .info-card{
        margin:0;
        min-width:0;
      }
      #zdrave-lekari .health-doctor-practice{
        display:flex;
        gap:8px;
        margin-top:7px;
        color:#536a7c;
        font-size:.86rem;
        line-height:1.4;
      }

      @media(max-width:760px){
        #zdrave-bolnica,
        #zdrave-lekari,
        #zdrave-apteki,
        #zdrave-stomatolozi,
        #zdrave-veterinari,
        #zdrave-vet-apteki,
        #zdrave-laboratorii{
          scroll-margin-top:155px;
        }
        #zdrave-lekari .health-doctors-toolbar{
          padding:10px;
        }
        #zdrave-lekari .health-doctors-search{
          flex-basis:100%;
        }
        #zdrave-lekari .health-doctor-group{
          padding:11px;
          border-radius:15px;
        }
        #zdrave-lekari .health-doctor-grid{
          grid-template-columns:1fr;
          gap:8px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  async function waitForClient(maxMs = 8000) {
    const start = Date.now();
    while (!window.PopitaiSupabase && Date.now() - start < maxMs) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return window.PopitaiSupabase || null;
  }

  async function fetchDoctorPractices() {
    const client = await waitForClient();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from("info_entries")
        .select("name,data")
        .eq("category", "zdrave")
        .eq("subcategory", "lekari")
        .eq("entry_type", "doctor")
        .eq("publication_status", "published");

      if (error || !Array.isArray(data)) return null;

      return new Map(
        data
          .map(entry => [norm(entry.name), entry?.data?.practice || ""])
          .filter(([, practice]) => practice)
      );
    } catch {
      return null;
    }
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

  function cleanPublicHealthNotes() {
    qa('[data-info-category-root="zdrave"] .info-card-confirmed').forEach(el => {
      const original = el.textContent || "";
      const cleaned = original
        .replace(/\s*[—-]\s*финален одит\b/gi, "")
        .replace(/\s{2,}/g, " ")
        .trim();

      if (cleaned !== original.trim()) {
        el.textContent = cleaned;
      }
    });
  }

  function makeGroup(type, title, description, cards) {
    const group = document.createElement("section");
    group.className = "health-doctor-group";
    group.dataset.doctorGroup = type;

    const head = document.createElement("div");
    head.className = "health-doctor-group-head";
    head.innerHTML = `
      <div>
        <h3>${title}</h3>
        <p>${description}</p>
      </div>
      <span class="health-doctor-group-count">${cards.length}</span>
    `;

    const grid = document.createElement("div");
    grid.className = "health-doctor-grid";
    cards.forEach(card => grid.appendChild(card));

    group.append(head, grid);
    return group;
  }

  function applyFilter(wrapper, query, tab) {
    const needle = norm(query);

    qa(".health-doctor-group", wrapper).forEach(group => {
      const groupType = group.dataset.doctorGroup;
      const allowedByTab = tab === "all" || tab === groupType;
      let visible = 0;

      qa(".info-card", group).forEach(card => {
        const matchesSearch = !needle || norm(card.textContent).includes(needle);
        const show = allowedByTab && matchesSearch;
        card.hidden = !show;
        if (show) visible++;
      });

      group.hidden = !allowedByTab || visible === 0;

      const count = q(".health-doctor-group-count", group);
      if (count) count.textContent = String(visible);
    });
  }

  async function organizeDoctors() {
    const section = q("#zdrave-lekari");
    if (!section || section.dataset.healthDoctorsFinal === "1") return false;

    const source = q(".info-cards", section);
    if (!source) return false;

    const cards = qa(".info-card", source);
    if (!cards.length) return false;

    /*
      Важно: първо изчакваме Supabase и практиките.
      Предишната версия можеше да подреди картите преди клиентът да е готов
      и после да не направи втори опит за практиките.
    */
    const practices = await fetchDoctorPractices();
    if (practices === null) return false;

    cards.forEach(card => {
      const practice = practices.get(norm(doctorName(card)));
      if (practice) addPractice(card, practice);
    });

    const oplCards = cards.filter(isOplCard);
    const specialistCards = cards.filter(card => !isOplCard(card));

    const wrapper = document.createElement("div");
    wrapper.className = "health-doctors-final";

    const toolbar = document.createElement("div");
    toolbar.className = "health-doctors-toolbar";
    toolbar.innerHTML = `
      <input
        class="health-doctors-search"
        type="search"
        placeholder="Търси по име, специалност или практика"
        aria-label="Търси лекар"
      >
      <div class="health-doctors-tabs" role="group" aria-label="Вид лекар">
        <button class="health-doctors-tab is-active" type="button" data-doctor-tab="all">Всички</button>
        <button class="health-doctors-tab" type="button" data-doctor-tab="opl">Лични лекари / ОПЛ</button>
        <button class="health-doctors-tab" type="button" data-doctor-tab="specialist">Специалисти</button>
      </div>
    `;

    wrapper.appendChild(toolbar);
    wrapper.appendChild(
      makeGroup(
        "opl",
        "Лични лекари / ОПЛ",
        "Общопрактикуващи лекари и практики в Лом.",
        oplCards
      )
    );
    wrapper.appendChild(
      makeGroup(
        "specialist",
        "Лекари специалисти",
        "Специалисти с потвърдени публични контакти.",
        specialistCards
      )
    );

    source.replaceWith(wrapper);
    section.dataset.healthDoctorsFinal = "1";

    const search = q(".health-doctors-search", wrapper);
    let activeTab = "all";

    search?.addEventListener("input", () => {
      applyFilter(wrapper, search.value, activeTab);
    });

    qa("[data-doctor-tab]", wrapper).forEach(button => {
      button.addEventListener("click", () => {
        activeTab = button.dataset.doctorTab || "all";

        qa("[data-doctor-tab]", wrapper).forEach(b => {
          b.classList.toggle("is-active", b === button);
        });

        applyFilter(wrapper, search?.value || "", activeTab);
      });
    });

    applyFilter(wrapper, "", "all");
    cleanPublicHealthNotes();
    return true;
  }

  function runUntilReady() {
    ensureDoctorStyles();

    let rounds = 0;
    const attempt = async () => {
      cleanPublicHealthNotes();
      const done = await organizeDoctors();
      rounds += 1;

      if (!done && rounds < 30) {
        setTimeout(attempt, 350);
      } else {
        cleanPublicHealthNotes();
      }
    };

    attempt();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runUntilReady, { once: true });
  } else {
    runUntilReady();
  }
})();
