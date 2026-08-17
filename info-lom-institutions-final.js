(() => {
  "use strict";

  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));
  const tel = value => `tel:${String(value || "").replace(/[^+\d]/g, "")}`;
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  function regionalIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V8l8-5 8 5v13"/><path d="M8 21v-6h8v6M9 10h.01M15 10h.01"/></svg>';
  }

  function emergencyIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h11v10H4z"/><path d="M15 10h3l2 3v4h-5zM7 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/><path d="M9.5 9v6M6.5 12h6"/></svg>';
  }

  function buildRegionalAdministrationCard(entry) {
    const d = entry.data || {};
    const address = d.address || 'пл. „Жеравица“ №1, Монтана';
    const phone = d.phone || '096 399 101';
    const email = d.email || 'montana@montana.government.bg';
    const hours = d.working_hours || '09:00–17:30';

    const article = document.createElement("article");
    article.className = "info-priority-card info-priority-card--regional";
    article.id = "institucii-oblastna";
    article.innerHTML = `
      <div class="info-priority-top">
        <div class="info-priority-icon">${regionalIcon()}</div>
        <div>
          <span class="info-priority-kicker">Областна администрация · Монтана</span>
          <h3>Областна администрация Монтана</h3>
          <p>Държавна собственост, регионално развитие и административни услуги на областно ниво. Обслужва и жители на Лом.</p>
        </div>
      </div>
      <div class="info-priority-facts">
        <div><strong>📍 ${esc(address)}</strong></div>
        <div>🕒 ${esc(hours)}</div>
        <div>☎ ${esc(phone)}</div>
      </div>
      <div class="info-priority-actions">
        <a class="info-priority-action info-priority-action--primary" href="${esc(tel(phone))}"><span>Обади се · ${esc(phone)}</span><small>Директно</small></a>
        <a class="info-priority-action info-priority-action--secondary" href="mailto:${esc(email)}"><span>Изпрати имейл</span><small>Директно</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://montanaoblast.egov.bg/wps/portal/district-montana/press-center/contacts" target="_blank" rel="noopener"><span>Официални контакти</span><small>Отвори сайт ↗</small></a>
      </div>
      <details class="info-priority-more">
        <summary>Кога е за Областната администрация</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Областно ниво</strong><span>Използвайте администрацията за услуги и въпроси от нейната компетентност, включително държавна собственост и регионално развитие.</span></div>
          <div class="info-priority-service"><strong>Ако въпросът е общински</strong><span>За местни данъци, гражданско състояние, строителство и услуги на Община Лом започнете от Община Лом, а не от Областната администрация.</span></div>
        </div>
      </details>
      <details class="info-priority-more">
        <summary>Преди да пътувам до Монтана</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Проверете точната услуга</strong><span>Първо се обадете на 096 399 101 или проверете официалния списък с административни услуги, за да знаете дали е нужно лично посещение.</span></div>
          <a class="info-priority-action info-priority-action--external" href="https://montanaoblast.egov.bg/wps/portal/district-montana/administrative-services/admin-services" target="_blank" rel="noopener"><span>Административни услуги</span><small>Отвори сайт ↗</small></a>
        </div>
      </details>
      <div class="info-priority-trust">Последно проверено: 17 август 2026 г. · Областна администрация Монтана / ИИСДА</div>`;
    return article;
  }

  function buildEmergencyMedicalCard(entry) {
    const d = entry.data || {};
    const address = d.address || 'Лом';
    const note = d.audit_note || 'ФСМП Лом е към ЦСМП Монтана. Няма отделен текущ официален телефон за филиала.';

    const article = document.createElement("article");
    article.className = "info-priority-card info-priority-card--emergency-medical";
    article.id = "institucii-speshna";
    article.innerHTML = `
      <div class="info-priority-top">
        <div class="info-priority-icon">${emergencyIcon()}</div>
        <div>
          <span class="info-priority-kicker">Спешна медицинска помощ</span>
          <h3>Филиал за спешна медицинска помощ – Лом</h3>
          <p>ФСМП Лом е част от ЦСМП – Монтана и работи в системата на спешната медицинска помощ.</p>
        </div>
      </div>
      <div class="info-priority-facts">
        <div><strong>📍 ${esc(address)}</strong></div>
        <div>🕒 Спешната помощ е с непрекъснат денонощен режим</div>
        <div>☎ При спешност: 112</div>
      </div>
      <div class="info-priority-actions">
        <a class="info-priority-action info-priority-action--danger" href="tel:112"><span>Спешна помощ · 112</span><small>Спешно</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://csmp-montana.com/%D1%84%D0%B8%D0%BB%D0%B8%D0%B0%D0%BB%D0%B8" target="_blank" rel="noopener"><span>Официален списък на филиалите</span><small>Отвори сайт ↗</small></a>
      </div>
      <div class="info-priority-note"><strong>Важно:</strong> ${esc(note)}</div>
      <details class="info-priority-more">
        <summary>Кога се използва 112</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Животозастрашаващо състояние</strong><span>При тежко внезапно състояние, сериозна травма, инцидент или друга непосредствена медицинска спешност се обадете на 112.</span></div>
          <div class="info-priority-service"><strong>Не търсим непотвърден местен номер</strong><span>Официалната страница на ЦСМП – Монтана посочва ФСМП Лом сред филиалите, но не публикува отделен телефон за него. Затова не показваме непотвърден номер.</span></div>
        </div>
      </details>
      <details class="info-priority-more">
        <summary>Какво е ФСМП Лом</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Част от ЦСМП – Монтана</strong><span>Центърът официално посочва филиали в Монтана, Лом, Берковица, Чипровци, Вълчедръм и Вършец.</span></div>
          <div class="info-priority-service"><strong>Денонощна система</strong><span>ЦСМП – Монтана работи в непрекъснат денонощен режим и организира спешните екипи за региона.</span></div>
        </div>
      </details>
      <div class="info-priority-trust">Последно проверено: 17 август 2026 г. · ЦСМП – Монтана</div>`;
    return article;
  }

  async function getClient() {
    if (window.PopitaiSupabase) return window.PopitaiSupabase;
    for (let i = 0; i < 100; i += 1) {
      await sleep(50);
      if (window.PopitaiSupabase) return window.PopitaiSupabase;
    }
    return null;
  }

  async function initFinalInstitutionCards() {
    for (let i = 0; i < 100; i += 1) {
      if (document.querySelector('[data-approved-priority-institutions]')) break;
      await sleep(75);
    }

    const stack = document.querySelector('[data-approved-priority-institutions]');
    const directory = document.querySelector('[data-info-category-root="institucii"] .info-institution-directory');
    if (!stack || !directory || stack.dataset.finalTwoApplied === "true") return;

    const client = await getClient();
    if (!client) return;

    const { data, error } = await client
      .from("info_entries")
      .select("category,subcategory,name,data,publication_status")
      .eq("category", "institucii")
      .eq("publication_status", "published")
      .in("subcategory", ["oblastna", "speshna"]);
    if (error) return;

    const entries = data || [];
    const regional = entries.find(e => e.subcategory === "oblastna");
    const emergency = entries.find(e => e.subcategory === "speshna");

    const oldRegional = document.getElementById("institucii-oblastna");
    const oldEmergency = document.getElementById("institucii-speshna");

    if (regional) {
      oldRegional?.remove();
      stack.appendChild(buildRegionalAdministrationCard(regional));
    }
    if (emergency) {
      oldEmergency?.remove();
      stack.appendChild(buildEmergencyMedicalCard(emergency));
    }

    stack.dataset.finalTwoApplied = "true";
    const count = directory.querySelector('.info-section-count');
    if (count) count.textContent = String(directory.querySelectorAll('.info-directory-grid > .info-card').length);

    if (location.hash === "#institucii-oblastna" || location.hash === "#institucii-speshna") {
      setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    }
  }

  window.addEventListener("DOMContentLoaded", initFinalInstitutionCards, { once: true });
})();
