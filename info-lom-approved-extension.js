(() => {
  "use strict";

  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const tel = v => `tel:${String(v).replace(/[^+\d]/g, "")}`;
  const fmt = v => v ? new Date(v).toLocaleDateString("bg-BG", {day:"numeric", month:"long", year:"numeric"}) : "";
  const slug = v => String(v || "").toLowerCase().replace(/[^a-z0-9а-я]+/gi,"-").replace(/^-+|-+$/g,"");
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  async function client() {
    if (window.PopitaiSupabase) return window.PopitaiSupabase;
    return new Promise(resolve => {
      const timer = setInterval(() => {
        if (window.PopitaiSupabase) {
          clearInterval(timer);
          resolve(window.PopitaiSupabase);
        }
      }, 50);
    });
  }

  async function waitForCanonicalRender() {
    for (let i = 0; i < 80; i += 1) {
      const utilitiesReady = document.querySelector('[data-info-category-root="komunalni"] .info-utility-grid');
      const institutionsReady = document.querySelector('[data-info-category-root="institucii"] .info-institution-directory');
      if (utilitiesReady && institutionsReady) return true;
      await sleep(100);
    }
    return false;
  }

  function addMeta(card, key, icon, label, value, isLink = false) {
    if (!card || value === undefined || value === null || String(value).trim() === "") return;
    if (card.querySelector(`[data-approved-extra="${CSS.escape(key)}"]`)) return;
    const row = document.createElement("div");
    row.className = "info-card-meta";
    row.dataset.approvedExtra = key;
    const shown = isLink
      ? `<a href="${esc(value)}" target="_blank" rel="noopener">${esc(label)}</a>`
      : `${label ? `${esc(label)}: ` : ""}${esc(value)}`;
    row.innerHTML = `<span>${esc(icon)}</span><span>${shown}</span>`;
    const note = card.querySelector(".info-card-note");
    const actions = card.querySelector(".info-card-actions");
    if (note) note.before(row);
    else if (actions) actions.before(row);
    else card.appendChild(row);
  }

  function enhanceInstitutions(entries) {
    const map = [
      ["directions", "•", "За какво", false],
      ["emergency", "☎", "Спешно", false],
      ["phone_director", "☎", "Директор", false],
      ["phone_posrednichestvo", "☎", "Посредничество", false],
      ["phone_nachalnik", "☎", "Началник", false],
      ["phone_cao", "☎", "ЦАО", false],
      ["phone_hrani", "☎", "Храни", false],
      ["phone_zhivotni", "☎", "Животни", false],
      ["phone_rastitelna", "☎", "Растителна защита", false],
      ["phone_izun", "☎", "Извън работно време", false],
      ["phone_med_expertiza", "☎", "Медицинска експертиза", false],
      ["phone_national", "☎", "Национален телефон", false],
      ["phone_montana", "☎", "Монтана", false],
      ["phone_signali", "☎", "Сигнали", false],
      ["phone_goryasht", "☎", "Горещ телефон", false],
      ["viber", "☎", "Viber", false],
      ["viber_lom", "☎", "Viber Лом", false],
      ["phone_note", "•", "Уточнение за телефона", false],
      ["telk_lom", "•", "ТЕЛК Лом", false],
      ["working_hours_montana", "🕒", "Работно време Монтана", false],
      ["email_montana", "✉", "E-mail Монтана", false],
      ["address_sgkk", "📍", "СГКК Монтана", false],
      ["online", "↗", "Онлайн услуги", true]
    ];

    entries.filter(e => e.category === "institucii").forEach(entry => {
      if (["obshtina", "policia", "noi"].includes(entry.subcategory)) return;
      const card = document.getElementById(`institucii-${slug(entry.subcategory)}`);
      if (!card) return;
      const d = entry.data || {};
      map.forEach(([key, icon, label, isLink]) => addMeta(card, key, icon, label, d[key], isLink));
    });
  }

  function institutionAction(action, kind = "primary", step = "Директно") {
    if (!action) return "";
    const external = action.action_type === "url";
    return `<a class="info-priority-action info-priority-action--${esc(kind)}" href="${esc(action.target)}"${external ? ' target="_blank" rel="noopener"' : ""}><span>${esc(action.label)}</span><small>${esc(step)}</small></a>`;
  }

  function actionMap(actions, subcategory) {
    return Object.fromEntries(actions.filter(a => a.category === "institucii" && a.subcategory === subcategory).map(a => [a.action_key, a]));
  }

  function institutionTrust(entry) {
    if (!entry?.confirmed_at) return "";
    return `<div class="info-priority-trust">Последно потвърдено: ${esc(fmt(entry.confirmed_at))}${entry.confirmed_source ? ` · ${esc(entry.confirmed_source)}` : ""}</div>`;
  }

  function priorityIcon(kind) {
    const icons = {
      municipality: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10h18M5 10v8m4-8v8m6-8v8m4-8v8M3 20h18M12 3l9 5H3l9-5Z"/></svg>',
      police: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.7 2.8 8.2 7 10 4.2-1.8 7-5.3 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/></svg>',
      noi: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h11l3 3v15H5V3Z"/><path d="M16 3v4h4M8 11h8M8 15h8M8 19h5"/></svg>'
    };
    return icons[kind] || "";
  }

  function renderPriorityInstitutions(entries, actions) {
    const root = document.querySelector('[data-info-category-root="institucii"]');
    const directory = root?.querySelector('.info-institution-directory');
    if (!root || !directory || root.querySelector('[data-approved-priority-institutions]')) return;

    const municipality = entries.find(e => e.category === "institucii" && e.subcategory === "obshtina");
    const police = entries.find(e => e.category === "institucii" && e.subcategory === "policia");
    const noi = entries.find(e => e.category === "institucii" && e.subcategory === "noi");
    if (!municipality || !police || !noi) return;

    const md = municipality.data || {};
    const pd = police.data || {};
    const nd = noi.data || {};
    const ma = actionMap(actions, "obshtina");
    const pa = actionMap(actions, "policia");
    const na = actionMap(actions, "noi");

    const counters = Array.isArray(md.cao?.counters) ? md.cao.counters : [];
    const depLabels = {
      CAO: "Административно обслужване",
      grazhdansko: "Гражданско състояние и адресна регистрация",
      MDT: "Местни данъци и такси",
      ustroystvo: "Строителство, имоти, кадастър и екология",
      arhitekt: "Главен архитект",
      obshtinska_sobstvenost: "Общинска собственост, поръчки и проекти",
      socialni: "Социални дейности и програми за заетост",
      obrazovanie_kultura: "Образование, култура и спорт",
      finansi: "Финанси / счетоводство",
      signali: "Сигнали към общината"
    };
    const departments = Object.entries(md.departments || {}).map(([key, value]) => `<div class="info-priority-list-row"><strong>${esc(depLabels[key] || key)}</strong><span>${esc(value)}</span></div>`).join("");
    const counterRows = counters.map(c => `<div class="info-priority-counter"><div><strong>${esc(c.desk)} · ${esc(c.service)}</strong><small>${esc(md.cao?.floor || "ет. 1")} · ЦАО</small></div>${c.phone ? `<a href="${esc(tel(c.phone))}">${esc(c.phone)}</a>` : ""}</div>`).join("");

    const localServices = Array.isArray(pd.local_services) ? pd.local_services : [];
    const policeServices = localServices.map(service => `<div class="info-priority-service"><strong>${esc(service.split(" — ")[0])}</strong><span>${esc(service)}</span></div>`).join("");

    const ro = nd.regional_office || {};
    const wrap = document.createElement("div");
    wrap.className = "info-priority-stack";
    wrap.dataset.approvedPriorityInstitutions = "true";
    wrap.innerHTML = `
      <article class="info-priority-card info-priority-card--municipality" id="institucii-obshtina">
        <div class="info-priority-top"><div class="info-priority-icon">${priorityIcon("municipality")}</div><div><span class="info-priority-kicker">Основна местна администрация</span><h3>Община Лом</h3><p>Документи, местни данъци, гражданско състояние, строителство и сигнали.</p></div></div>
        <div class="info-priority-facts"><div><strong>📍 ${esc(md.address || "")}</strong></div><div>🕒 ${esc(md.working_hours || md.cao?.working_hours || "")}</div><div>☎ Централа: ${esc(md.phone || "")}</div></div>
        <div class="info-priority-actions">${institutionAction(ma.obshtina_cao_call, "primary")}${institutionAction(ma.obshtina_signals_call, "secondary")}${institutionAction(ma.obshtina_services, "soft")}</div>
        ${md.signals?.phone_24_7 ? `<div class="info-priority-note">Денонощен втори телефон за сигнали: <a href="${esc(tel(md.signals.phone_24_7))}">${esc(md.signals.phone_24_7)}</a>. ${esc(md.phonebook_note || "")}</div>` : ""}
        ${md.mayor?.name ? `<details class="info-priority-more"><summary>Кмет и прием на граждани</summary><div class="info-priority-service"><strong>Кмет · ${esc(md.mayor.name)}</strong><span>Прием: ${esc(md.mayor.reception || "")}${md.mayor.booking_phone ? ` · записване на <a href="${esc(tel(md.mayor.booking_phone))}">${esc(md.mayor.booking_phone)}</a>` : ""}</span></div></details>` : ""}
        ${counterRows ? `<details class="info-priority-more"><summary>Гишета в Центъра за административно обслужване</summary><div class="info-priority-counter-list">${counterRows}</div>${md.cao?.working_hours ? `<p class="info-priority-help">ЦАО работи ${esc(md.cao.working_hours)}${md.cao.appointment_required === false ? " и не е необходимо предварително записване" : ""}.</p>` : ""}</details>` : ""}
        ${departments ? `<details class="info-priority-more"><summary>Други отдели и контакти</summary><div class="info-priority-list">${departments}</div></details>` : ""}
        ${institutionTrust(municipality)}
      </article>

      <article class="info-priority-card info-priority-card--police" id="institucii-policia">
        <div class="info-priority-top"><div class="info-priority-icon">${priorityIcon("police")}</div><div><span class="info-priority-kicker">Местно районно управление</span><h3>Полиция · РУ Лом</h3><p>Спешност, връзка с районното управление и прием на граждани.</p></div></div>
        <div class="info-priority-facts"><div><strong>📍 ${esc(pd.address || "")}</strong></div><div>🕒 ${esc(pd.working_hours || "")}</div></div>
        <div class="info-priority-actions">${institutionAction(pa.police_112, "danger")}${institutionAction(pa.police_lom_223, "primary")}${institutionAction(pa.police_lom_225, "secondary")}${institutionAction(pa.police_official_page, "soft")}</div>
        <details class="info-priority-more"><summary>Услуги и звена в РУ Лом</summary><div class="info-priority-services">${policeServices}${pd.head?.name ? `<div class="info-priority-service"><strong>Началник · ${esc(pd.head.name)}</strong><span>Прием на граждани: ${esc(pd.head.reception || "")}${pd.head.phone ? ` · <a href="${esc(tel(pd.head.phone))}">${esc(pd.head.phone)}</a>` : ""}</span></div>` : ""}</div></details>
        ${pd.montana_note ? `<details class="info-priority-more"><summary>Кога се ходи в Монтана</summary><div class="info-priority-regional"><p>${esc(pd.montana_note)}</p></div></details>` : ""}
        ${institutionTrust(police)}
      </article>

      <article class="info-priority-card info-priority-card--noi" id="institucii-noi">
        <div class="info-priority-top"><div class="info-priority-icon">${priorityIcon("noi")}</div><div><span class="info-priority-kicker">Пенсионно обслужване в Лом</span><h3>НОИ · офис Лом</h3></div></div>
        <div class="info-priority-facts"><div><strong>📍 ${esc(nd.address || "")}</strong></div><div>🕒 ${esc(nd.working_hours || "")}</div><div>• Услуга: ${esc(nd.service || "Пенсионно обслужване")}</div></div>
        <div class="info-priority-actions">${institutionAction(na.noi_lom_call, "primary")}${institutionAction(na.noi_e_services, "soft")}${institutionAction(na.noi_national_call, "secondary")}</div>
        ${ro.name ? `<details class="info-priority-more"><summary>ТП НОИ Монтана · за други услуги</summary><div class="info-priority-regional"><p><strong>📍 ${esc(ro.address || "")}</strong></p><p>🕒 ${esc(ro.working_hours || "")}</p>${ro.pensions_phone ? `<p>☎ Приемна „Пенсии“: <a href="${esc(tel(ro.pensions_phone))}">${esc(ro.pensions_phone)}</a></p>` : ""}${ro.email ? `<p>✉ ${esc(ro.email)}</p>` : ""}${nd.phone_national_alt ? `<p>☎ Алтернативен национален номер: <a href="${esc(tel(nd.phone_national_alt))}">${esc(nd.phone_national_alt)}</a></p>` : ""}</div></details>` : ""}
        ${institutionTrust(noi)}
      </article>`;

    const oldMunicipality = document.getElementById("institucii-obshtina");
    const oldPolice = document.getElementById("institucii-policia");
    const oldNoi = document.getElementById("institucii-noi");
    directory.before(wrap);
    oldMunicipality?.remove();
    oldPolice?.remove();
    oldNoi?.remove();

    const remainingCards = directory.querySelectorAll('.info-directory-grid > .info-card').length;
    const count = directory.querySelector('.info-section-count');
    if (count) count.textContent = String(remainingCards);
  }

  function actionButton(action) {
    const external = action.action_type === "url";
    return `<a class="info-action-link" href="${esc(action.target)}"${external ? ' target="_blank" rel="noopener"' : ""}>${esc(action.label)}</a>`;
  }

  function entryCard(entry, type, actions = []) {
    const d = entry.data || {};
    const rows = [];
    const row = (icon, value) => {
      if (value !== undefined && value !== null && String(value).trim() !== "") rows.push(`<div class="info-card-meta"><span>${icon}</span><span>${esc(value)}</span></div>`);
    };
    row("📍", d.address);
    row("🕒", d.working_hours);
    row("•", d.services ? `Услуги: ${d.services}` : "");
    if (d.available_24_7) row("🌙", "24/7");
    if (d.phone) row("☎", d.phone);
    if (d.support_phone) row("☎", `Техническа помощ: ${d.support_phone}`);
    const note = d.note ? `<div class="info-card-note">${esc(d.note)}</div>` : "";
    const buttons = [];
    if (d.phone) buttons.push(`<a class="info-btn info-btn--call" href="${esc(tel(d.phone))}">☎ ${esc(d.phone)}</a>`);
    if (d.public_url) buttons.push(`<a class="info-btn" href="${esc(d.public_url)}" target="_blank" rel="noopener">Официална страница</a>`);
    actions.forEach(a => buttons.push(actionButton(a)));
    return `<article class="info-card info-card--compact"><div class="info-card-type">${esc(type)}</div><div class="info-card-name">${esc(entry.name)}</div>${rows.join("")}${note}${buttons.length ? `<div class="info-card-actions">${buttons.join("")}</div>` : ""}${entry.confirmed_at ? `<div class="info-card-confirmed">Последно потвърдено: ${esc(fmt(entry.confirmed_at))}${entry.confirmed_source ? ` · ${esc(entry.confirmed_source)}` : ""}</div>` : ""}</article>`;
  }

  function providerActions(actions, name) {
    if (name.startsWith("Еконт")) return actions.filter(a => a.action_key.startsWith("econt_"));
    if (name.startsWith("Спиди")) return actions.filter(a => a.action_key.startsWith("speedy_"));
    if (name.startsWith("BOX NOW")) return actions.filter(a => a.action_key.startsWith("boxnow_"));
    if (name.startsWith("NetSurf")) return actions.filter(a => a.action_key === "netsurf_coverage");
    if (name.startsWith("A1")) return actions.filter(a => a.action_key === "a1_coverage");
    if (name.startsWith("Vivacom")) return actions.filter(a => a.action_key === "vivacom_coverage");
    if (name.startsWith("Yettel")) return actions.filter(a => a.action_key === "yettel_services");
    return [];
  }

  function addSignalButton(card) {
    if (!card || card.querySelector("[data-approved-subsignal]")) return;
    const wrap = document.createElement("div");
    wrap.className = "info-actions-row";
    wrap.dataset.approvedSubsignal = "true";
    wrap.innerHTML = '<button class="info-btn info-btn--signal" type="button" onclick="window.InfoLom?.openSignal(\'komunalni\')">⚠ Сигнализирай за грешка</button>';
    card.appendChild(wrap);
  }

  function renderUtilities(entries, actions) {
    const root = document.querySelector('[data-info-category-root="komunalni"]');
    if (!root) return;

    ["vik", "tok", "chistota"].forEach(sub => addSignalButton(document.getElementById(`komunalni-${sub}`)));

    const oldGlobal = root.querySelector(":scope > .info-actions-row--utility");
    if (oldGlobal) oldGlobal.remove();

    const courierEntries = entries.filter(e => e.category === "komunalni" && e.subcategory === "kurieri");
    const internetEntries = entries.filter(e => e.category === "komunalni" && e.subcategory === "internet-tv");
    const courierActions = actions.filter(a => a.category === "komunalni" && a.subcategory === "kurieri");
    const internetActions = actions.filter(a => a.category === "komunalni" && a.subcategory === "internet-tv");

    if (!document.getElementById("komunalni-kurieri")) {
      const bgpost = courierActions.find(a => a.action_key === "bgpost_record");
      const section = document.createElement("section");
      section.className = "info-subsection info-subsection--canonical";
      section.id = "komunalni-kurieri";
      section.innerHTML = `<div class="info-subsection-title"><h3>Куриерски услуги</h3><span class="info-section-count">${courierEntries.length}</span></div><div class="info-directory-grid">${courierEntries.map(e => entryCard(e, e.entry_type === "locker" ? "Автомат / locker" : "Куриерски офис", providerActions(courierActions, e.name))).join("")}</div><div class="info-actions-row">${bgpost ? actionButton(bgpost) : ""}<button class="info-btn info-btn--add" type="button" onclick="window.InfoLom?.openSubmission('komunalni','kurieri','courier_point')">＋ Добави куриерска точка</button><button class="info-btn info-btn--signal" type="button" onclick="window.InfoLom?.openSignal('komunalni')">⚠ Сигнализирай за грешка</button></div>`;
      root.appendChild(section);
    }

    if (!document.getElementById("komunalni-internet-tv")) {
      const section = document.createElement("section");
      section.className = "info-subsection info-subsection--canonical";
      section.id = "komunalni-internet-tv";
      section.innerHTML = `<div class="info-subsection-title"><h3>Интернет и телевизия</h3><span class="info-section-count">${internetEntries.length}</span></div><div class="info-directory-grid">${internetEntries.map(e => entryCard(e, "Доставчик", providerActions(internetActions, e.name))).join("")}</div><div class="info-actions-row"><button class="info-btn info-btn--add" type="button" onclick="window.InfoLom?.openSubmission('komunalni','internet-tv','provider')">＋ Добави доставчик</button><button class="info-btn info-btn--signal" type="button" onclick="window.InfoLom?.openSignal('komunalni')">⚠ Сигнализирай за грешка</button></div>`;
      root.appendChild(section);
    }
  }

  async function initApprovedExtension() {
    if (!document.body?.dataset.infoPage) return;
    await waitForCanonicalRender();
    const c = await client();
    const [er, ar] = await Promise.all([
      c.from("info_entries").select("id,category,subcategory,entry_type,name,data,confirmed_at,confirmed_source,reliability_status").eq("publication_status", "published").order("category").order("created_at"),
      c.from("info_actions").select("category,subcategory,action_key,label,action_type,target,status,is_public,sort_order").eq("status", "active").eq("is_public", true).order("sort_order")
    ]);
    if (er.error) return;
    const entries = er.data || [];
    const actions = ar.data || [];
    renderPriorityInstitutions(entries, actions);
    enhanceInstitutions(entries);
    renderUtilities(entries, actions);
    if (location.hash) setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({behavior:"smooth", block:"start"}), 80);
  }

  window.addEventListener("DOMContentLoaded", initApprovedExtension, {once:true});
})();
