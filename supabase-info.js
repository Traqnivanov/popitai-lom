(() => {
  "use strict";
  const ADMIN_ID = "598d6626-25ed-450f-87a9-e83f34f641c4";

  function escH(v) {
    return String(v ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
  }

  function fmtDate(iso) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("bg-BG", { day:"numeric", month:"long", year:"numeric" });
  }

  function metaRow(icon, text) {
    if (!text) return "";
    const icons = {
      pin: '<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
      clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      phone: '<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.07 4.18 2 2 0 0 1 5.08 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.91 9.6a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
      info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    };
    return `<div class="info-card-meta">${icons[icon] || icons.info}${escH(text)}</div>`;
  }

  function phoneBtn(phone) {
    if (!phone) return "";
    const clean = phone.replace(/\s/g, "");
    return `<div class="info-card-phone"><a href="tel:${escH(clean)}"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.07 4.18 2 2 0 0 1 5.08 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.91 9.6a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>Обади се</a></div>`;
  }

  function confirmedLine(entry) {
    const date = entry.confirmed_at ? fmtDate(entry.confirmed_at) : null;
    if (!date) return "";
    return `<div class="info-card-confirmed">Последно потвърдено: ${date}${entry.confirmed_source ? " · " + escH(entry.confirmed_source) : ""}</div>`;
  }

  // ── Render функции по тип ──────────────────────────────────────────────────

  function renderMedicalCenter(entry) {
    const d = entry.data || {};
    return `<div class="info-card info-card--institution">
      <div class="info-card-type">Лечебно заведение</div>
      <div class="info-card-name">${escH(entry.name)}</div>
      ${metaRow("pin", d.address)}
      ${d.phone ? phoneBtn(d.phone) : ""}
      ${d.registration ? `<div class="info-card-meta" style="font-size:11px">${escH(d.registration)}</div>` : ""}
      ${confirmedLine(entry)}
    </div>`;
  }

  function renderDepartment(entry) {
    const d = entry.data || {};
    const doctors = Array.isArray(d.doctors) ? d.doctors.join(", ") : d.doctors || "";
    return `<div class="info-card info-card--department">
      <div class="info-card-type">Отделение</div>
      <div class="info-card-name">${escH(entry.name)}</div>
      ${d.internal_phone ? metaRow("phone", `вътр. ${d.internal_phone}`) : ""}
      ${d.location ? metaRow("info", d.location) : ""}
      ${doctors ? `<div class="info-card-meta"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>${escH(doctors)}</div>` : ""}
      ${d.services ? `<div class="info-card-meta">${escH(d.services)}</div>` : ""}
      ${confirmedLine(entry)}
    </div>`;
  }

  function renderDoctor(entry) {
    const d = entry.data || {};
    return `<div class="info-card info-card--doctor">
      <div class="info-card-type">Лекар</div>
      <div class="info-card-name">${escH(entry.name)}</div>
      ${d.specialty ? `<div class="info-card-specialty">${escH(d.specialty)}</div>` : ""}
      ${metaRow("pin", d.location || d.address)}
      ${d.phone ? phoneBtn(d.phone) : ""}
      ${d.phone_secondary ? `<div class="info-card-secondary">* Телефонът е от вторичен източник</div>` : ""}
      ${confirmedLine(entry)}
    </div>`;
  }

  function renderPharmacy(entry) {
    const d = entry.data || {};
    return `<div class="info-card info-card--pharmacy">
      <div class="info-card-type">Аптека</div>
      <div class="info-card-name">${escH(entry.name)}</div>
      ${d.operator && d.operator !== entry.name ? `<div class="info-card-meta" style="font-size:12px;color:#9aa3b0">Оператор: ${escH(d.operator)}</div>` : ""}
      ${metaRow("pin", d.address)}
      ${metaRow("clock", d.working_hours)}
      ${d.phone ? phoneBtn(d.phone) : ""}
      ${d.nzok ? `<span class="info-card-nzok">✓ НЗОК</span>` : ""}
      ${d.phone_secondary ? `<div class="info-card-secondary">* Телефонът е от вторичен източник</div>` : ""}
      ${confirmedLine(entry)}
    </div>`;
  }

  function renderDentist(entry) {
    const d = entry.data || {};
    return `<div class="info-card info-card--dentist">
      <div class="info-card-type">Стоматолог</div>
      <div class="info-card-name">${escH(entry.name)}</div>
      ${d.specialty ? `<div class="info-card-specialty">${escH(d.specialty)}</div>` : ""}
      ${d.practice_name ? `<div class="info-card-meta" style="font-size:12px;color:#9aa3b0">${escH(d.practice_name)}</div>` : ""}
      ${metaRow("pin", d.address)}
      ${d.phone ? phoneBtn(d.phone) : ""}
      ${d.phone_secondary ? `<div class="info-card-secondary">* Телефонът е от вторичен източник</div>` : ""}
      ${entry.reliability_status === "conflict" ? `<div class="info-card-secondary">⚠ Има разминаване между източници — за проверка</div>` : ""}
      ${confirmedLine(entry)}
    </div>`;
  }

  function renderVet(entry) {
    const d = entry.data || {};
    return `<div class="info-card info-card--vet">
      <div class="info-card-type">Ветеринар</div>
      <div class="info-card-name">${escH(entry.name)}</div>
      ${metaRow("pin", d.address)}
      ${metaRow("clock", d.working_hours)}
      ${d.phone ? phoneBtn(d.phone) : ""}
      ${d.emergency ? `<div class="info-card-meta" style="color:#dc2626;font-weight:700">🚨 Приема спешни случаи</div>` : ""}
      ${d.animals ? `<div class="info-card-meta">${escH(d.animals)}</div>` : ""}
      ${confirmedLine(entry)}
    </div>`;
  }

  function renderVetPharmacy(entry) {
    const d = entry.data || {};
    return `<div class="info-card info-card--vet-pharmacy">
      <div class="info-card-type">Ветеринарна аптека</div>
      <div class="info-card-name">${escH(entry.name)}</div>
      ${metaRow("pin", d.address)}
      ${metaRow("clock", d.working_hours)}
      ${d.phone ? phoneBtn(d.phone) : ""}
      ${d.consultation ? `<div class="info-card-meta">Ветеринарна консултация: ${escH(d.consultation)}</div>` : ""}
      ${confirmedLine(entry)}
    </div>`;
  }

  function renderLaboratory(entry) {
    const d = entry.data || {};
    return `<div class="info-card info-card--laboratory">
      <div class="info-card-type">Лаборатория / Диагностика</div>
      <div class="info-card-name">${escH(entry.name)}</div>
      ${metaRow("pin", d.address)}
      ${metaRow("clock", d.working_hours)}
      ${d.phone ? phoneBtn(d.phone) : ""}
      ${d.services ? `<div class="info-card-meta">${escH(d.services)}</div>` : ""}
      ${d.nzok ? `<span class="info-card-nzok">✓ НЗОК</span>` : ""}
      ${confirmedLine(entry)}
    </div>`;
  }

  function renderEntry(entry) {
    switch (entry.entry_type) {
      case "medical_center": return renderMedicalCenter(entry);
      case "hospital_department": return renderDepartment(entry);
      case "doctor": return renderDoctor(entry);
      case "pharmacy": return renderPharmacy(entry);
      case "dentist": return renderDentist(entry);
      case "vet": return renderVet(entry);
      case "vet_pharmacy": return renderVetPharmacy(entry);
      case "laboratory": return renderLaboratory(entry);
      default: return "";
    }
  }

  // ── Секции ────────────────────────────────────────────────────────────────

  const ZDRAVE_SECTIONS = [
    {
      id: "bolnica",
      label: "Болница и медицински центрове",
      types: ["medical_center", "hospital_department"],
      addBtns: [
        { label: "Добави медицински център", type: "medical_center" },
        { label: "Добави медицинска услуга / отделение", type: "hospital_department" },
      ]
    },
    {
      id: "lekari",
      label: "Лекари",
      types: ["doctor"],
      addBtns: [{ label: "Добави лекар", type: "doctor" }]
    },
    {
      id: "apteki",
      label: "Аптеки",
      types: ["pharmacy"],
      addBtns: [
        { label: "Добави аптека", type: "pharmacy" },
        { label: "Добави информация за аптека", type: "pharmacy_info" },
      ]
    },
    {
      id: "stomatolozi",
      label: "Стоматолози",
      types: ["dentist"],
      addBtns: [{ label: "Добави стоматолог", type: "dentist" }]
    },
    {
      id: "veterinari",
      label: "Ветеринари",
      types: ["vet"],
      addBtns: [
        { label: "Добави ветеринар", type: "vet" },
        { label: "Добави информация за ветеринарен кабинет", type: "vet_info" },
      ]
    },
    {
      id: "vet-apteki",
      label: "Ветеринарни аптеки",
      types: ["vet_pharmacy"],
      addBtns: [
        { label: "Добави ветеринарна аптека", type: "vet_pharmacy" },
        { label: "Добави информация", type: "vet_pharmacy_info" },
      ]
    },
    {
      id: "laboratorii",
      label: "Лаборатории и диагностика",
      types: ["laboratory"],
      addBtns: [{ label: "Добави лаборатория", type: "laboratory" }]
    },
  ];

  function sectionHtml(section, entries, isLoggedIn) {
    const items = entries.filter(e => section.types.includes(e.entry_type));
    const cardsHtml = items.length
      ? items.map(renderEntry).join("")
      : `<p class="info-empty">Все още няма информация в тази секция.</p>`;

    const addBtns = isLoggedIn
      ? section.addBtns.map(b =>
          `<button class="add-btn" onclick="openSubmitForm('zdrave', '${b.type}')">
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>${escH(b.label)}
          </button>`
        ).join("")
      : "";

    return `<section class="info-section" id="${section.id}">
      <div class="info-section-title"><h2>${section.label}</h2></div>
      <div class="info-cards">${cardsHtml}</div>
      ${addBtns ? `<div class="info-section-actions">${addBtns}</div>` : ""}
    </section><hr class="info-divider">`;
  }

  // ── Init ──────────────────────────────────────────────────────────────────

  async function waitForClient() {
    return new Promise(resolve => {
      if (window.PopitaiSupabase) return resolve(window.PopitaiSupabase);
      const t = setInterval(() => { if (window.PopitaiSupabase) { clearInterval(t); resolve(window.PopitaiSupabase); } }, 50);
    });
  }

  async function initZdrave() {
    const container = document.getElementById("info-zdrave-container");
    if (!container) return;

    const client = await waitForClient();
    const { data: authData } = await client.auth.getUser();
    const userId = authData?.user?.id || null;
    const isLoggedIn = !!userId;

    const { data, error } = await client.from("info_entries")
      .select("id, name, entry_type, data, publication_status, reliability_status, confirmed_at, confirmed_source")
      .eq("category", "zdrave")
      .eq("publication_status", "published")
      .order("created_at", { ascending: true });

    if (error) {
      container.innerHTML = `<div class="info-section"><p class="info-empty">Информацията не може да се зареди в момента.</p></div>`;
      return;
    }

    const entries = data || [];
    container.innerHTML = ZDRAVE_SECTIONS.map(s => sectionHtml(s, entries, isLoggedIn)).join("");
  }

  // ── Глобални функции ──────────────────────────────────────────────────────

  window.openSubmitForm = (category, type) => {
    // TODO: отваря модален диалог за предложение
    alert("Формата за добавяне ще бъде добавена скоро.");
  };

  window.openSignalForm = () => {
    // TODO: отваря форма за сигнал за грешка
    alert("Формата за сигнал ще бъде добавена скоро.");
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("info-zdrave-container")) initZdrave();
  });

})();
