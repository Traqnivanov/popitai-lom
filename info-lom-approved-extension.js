(() => {
  "use strict";

  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const tel = v => `tel:${String(v).replace(/[^+\d]/g, "")}`;
  const fmt = v => v ? new Date(v).toLocaleDateString("bg-BG", {day:"numeric", month:"long", year:"numeric"}) : "";
  const slug = v => String(v || "").toLowerCase().replace(/[^a-z0-9а-я]+/gi, "-").replace(/^-+|-+$/g, "");

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
      if (entry.subcategory === "obshtina") return;
      const card = document.getElementById(`institucii-${slug(entry.subcategory)}`);
      if (!card) return;
      const d = entry.data || {};
      map.forEach(([key, icon, label, isLink]) => addMeta(card, key, icon, label, d[key], isLink));
    });
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
      section.innerHTML = `<div class="info-subsection-title"><h3>📦 Куриерски услуги</h3><span class="info-section-count">${courierEntries.length}</span></div><div class="info-directory-grid">${courierEntries.map(e => entryCard(e, e.entry_type === "locker" ? "Автомат / locker" : "Куриерски офис", providerActions(courierActions, e.name))).join("")}</div><div class="info-actions-row">${bgpost ? actionButton(bgpost) : ""}<button class="info-btn info-btn--add" type="button" onclick="window.InfoLom?.openSubmission('komunalni','kurieri','courier_point')">＋ Добави куриерска точка</button><button class="info-btn info-btn--signal" type="button" onclick="window.InfoLom?.openSignal('komunalni')">⚠ Сигнализирай за грешка</button></div>`;
      root.appendChild(section);
    }

    if (!document.getElementById("komunalni-internet-tv")) {
      const section = document.createElement("section");
      section.className = "info-subsection info-subsection--canonical";
      section.id = "komunalni-internet-tv";
      section.innerHTML = `<div class="info-subsection-title"><h3>🌐 Интернет и телевизия</h3><span class="info-section-count">${internetEntries.length}</span></div><div class="info-directory-grid">${internetEntries.map(e => entryCard(e, "Доставчик", providerActions(internetActions, e.name))).join("")}</div><div class="info-actions-row"><button class="info-btn info-btn--add" type="button" onclick="window.InfoLom?.openSubmission('komunalni','internet-tv','provider')">＋ Добави доставчик</button><button class="info-btn info-btn--signal" type="button" onclick="window.InfoLom?.openSignal('komunalni')">⚠ Сигнализирай за грешка</button></div>`;
      root.appendChild(section);
    }
  }

  async function initApprovedExtension() {
    if (!document.body?.dataset.infoPage) return;
    const c = await client();
    const [er, ar] = await Promise.all([
      c.from("info_entries").select("id,category,subcategory,entry_type,name,data,confirmed_at,confirmed_source,reliability_status").eq("publication_status", "published").order("category").order("created_at"),
      c.from("info_actions").select("category,subcategory,action_key,label,action_type,target,status,is_public,sort_order").eq("status", "active").eq("is_public", true).order("sort_order")
    ]);
    if (er.error) return;
    const entries = er.data || [];
    const actions = ar.data || [];
    enhanceInstitutions(entries);
    renderUtilities(entries, actions);
    if (location.hash) setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({behavior:"smooth", block:"start"}), 80);
  }

  window.addEventListener("DOMContentLoaded", () => setTimeout(initApprovedExtension, 900), {once:true});
})();
