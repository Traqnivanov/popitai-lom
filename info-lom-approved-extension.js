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
      if (["obshtina", "policia", "noi", "dsp"].includes(entry.subcategory)) return;
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

  function socialIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.1-7-10.2A4.8 4.8 0 0 1 13.3 7 4.8 4.8 0 0 1 21 10.8C21 16.9 12 21 12 21Z"/><path d="M12 8.5v6M9 11.5h6"/></svg>';
  }

  function buildSocialAssistanceCard(data, confirmedAt, confirmedSource) {
    const address = data.address || 'ул. „Пристанищна“ 52, Лом';
    const phone = data.phone || "0971 60 283";
    const email = data.email || "dsp-lom@asp.government.bg";
    const director = data.director || "Жанета Младенова";
    const date = confirmedAt
      ? new Date(confirmedAt).toLocaleDateString("bg-BG", {day:"numeric", month:"long", year:"numeric"})
      : "17 август 2026 г.";

    const article = document.createElement("article");
    article.className = "info-priority-card";
    article.id = "institucii-socialno-podpomagane";
    article.dataset.socialPriority = "true";

    article.innerHTML = `
      <div class="info-priority-top">
        <div class="info-priority-icon">${socialIcon()}</div>
        <div>
          <span class="info-priority-kicker">Местна социална служба</span>
          <h3>Дирекция „Социално подпомагане“ – Лом</h3>
          <p>Социални и семейни помощи, хора с увреждания, социални услуги и закрила на детето.</p>
        </div>
      </div>

      <div class="info-priority-facts">
        <div><strong>📍 ${esc(address)}</strong></div>
        <div>🕒 09:00–17:30</div>
        <div>☎ Основен контакт: ${esc(phone)}</div>
      </div>

      <div class="info-priority-actions">
        <a class="info-priority-action info-priority-action--primary" href="${esc(tel(phone))}">
          <span>Обади се · ${esc(phone)}</span><small>Директно</small>
        </a>
        <a class="info-priority-action info-priority-action--secondary" href="mailto:${esc(email)}">
          <span>Изпрати имейл</span><small>Директно</small>
        </a>
        <a class="info-priority-action info-priority-action--external" href="https://asp.government.bg/bg/kontakti/teritorialni-strukturi/" target="_blank" rel="noopener">
          <span>Официални контакти</span><small>Отвори сайт ↗</small>
        </a>
      </div>

      <div class="info-priority-note">
        <strong>Закрила на детето:</strong> за сигнал, молба или консултация за дете и семейство използвайте контакта на дирекцията. При непосредствена опасност — 112.
      </div>

      <details class="info-priority-more">
        <summary>Социални и семейни помощи</summary>
        <div class="info-priority-services">
          <div class="info-priority-service">
            <strong>Къде в Лом</strong>
            <span>Дирекция „Социално подпомагане“ – Лом, ул. „Пристанищна“ №52. Основен телефон: 0971 60 283. Актуалният публичен указател на АСП не публикува отделен телефон или стая за отдел „Социална закрила“, затова използвайте този местен контакт.</span>
          </div>
          <div class="info-priority-service">
            <strong>Кой отдел</strong>
            <span>Отдел „Социална закрила“ работи по социални помощи, семейни помощи за деца и целевата помощ за отопление.</span>
          </div>

          <details class="info-priority-more">
            <summary>Семейни помощи за деца</summary>
            <div class="info-priority-services">
              <div class="info-priority-service"><strong>Къде подавате в Лом</strong><span>На ул. „Пристанищна“ №52 в Дирекция „Социално подпомагане“ – Лом, ако това е дирекцията по настоящия адрес на семейството.</span></div>
              <div class="info-priority-service"><strong>Какво може да заявите</strong><span>Помощи при бременност, раждане, отглеждане на дете, близнаци, осиновяване, месечни помощи за деца и помощи за деца с увреждания – според конкретния случай.</span></div>
              <div class="info-priority-service"><strong>Как се подава</strong><span>Със заявление-декларация по образец и нужните документи за конкретната помощ. Може на място, по пощата или по разрешен електронен ред.</span></div>
              <div class="info-priority-service"><strong>Важно за 2026 г.</strong><span>Не всички семейни помощи имат доходен критерий. АСП публикува отделни условия и размери за всеки вид помощ, затова не ги смесваме в една обща сума.</span></div>
              <a class="info-priority-action info-priority-action--external" href="https://asp.government.bg/bg/deynosti/sotsialno-podpomagane/semeyni-pomoshti/" target="_blank" rel="noopener"><span>Условия и размери за 2026 г.</span><small>Отвори сайт ↗</small></a>
            </div>
          </details>

          <details class="info-priority-more">
            <summary>Социални помощи</summary>
            <div class="info-priority-services">
              <div class="info-priority-service"><strong>Къде в Лом</strong><span>Дирекция „Социално подпомагане“ – Лом, ул. „Пристанищна“ №52.</span></div>
              <div class="info-priority-service"><strong>Какво да направите</strong><span>Обадете се на 0971 60 283 или посетете дирекцията и опишете случая си. Така ще ви насочат към точния вид помощ и нужния образец.</span></div>
              <div class="info-priority-service"><strong>Защо не показваме един списък с документи</strong><span>Документите зависят от конкретната помощ и от обстоятелствата на лицето или семейството. Един общ списък би могъл да ви подведе.</span></div>
              <a class="info-priority-action info-priority-action--external" href="https://asp.government.bg/bg/deynosti/sotsialno-podpomagane/sotsialni-pomoshti/" target="_blank" rel="noopener"><span>Официални социални помощи</span><small>Отвори сайт ↗</small></a>
            </div>
          </details>

          <details class="info-priority-more">
            <summary>Помощ за отопление · сезон 2026/2027</summary>
            <div class="info-priority-services">
              <div class="info-priority-service"><strong>Къде подавате в Лом</strong><span>В Дирекция „Социално подпомагане“ – Лом, ул. „Пристанищна“ №52, или по разрешените дистанционни начини.</span></div>
              <div class="info-priority-service"><strong>Как се подава</strong><span>На място, чрез лицензиран пощенски оператор, чрез Системата за сигурно електронно връчване, с квалифициран електронен подпис или на служебния имейл dsp-lom@asp.government.bg.</span></div>
              <div class="info-priority-service"><strong>Размер за сезон 2026/2027</strong><span>64,39 евро месечно за 5 месеца, общо 321,95 евро за периода 1 ноември 2026 г. – 31 март 2027 г.</span></div>
              <div class="info-priority-service"><strong>Какво става след заявлението</strong><span>До 20 дни социален работник извършва социална анкета и изготвя доклад; след това се издава заповед за отпускане или отказ.</span></div>
              <a class="info-priority-action info-priority-action--external" href="https://asp.government.bg/bg/deynosti/sotsialno-podpomagane/otpuskane-na-celeva-pomosh-za-otoplenie-za-otoplitelen-sezon-2026-2027-g/" target="_blank" rel="noopener"><span>Отопление 2026/2027</span><small>Отвори сайт ↗</small></a>
            </div>
          </details>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Хора с увреждания и социални услуги</summary>
        <div class="info-priority-services">
          <div class="info-priority-service">
            <strong>Кой отдел в Лом</strong>
            <span>В Дирекция „Социално подпомагане“ – Лом има отдел „Индивидуална оценка на хора с увреждания и социални услуги“. Актуален отделен публичен телефон за него не е публикуван, затова започнете от 0971 60 283 или от ул. „Пристанищна“ №52.</span>
          </div>

          <details class="info-priority-more">
            <summary>Индивидуална оценка на потребностите</summary>
            <div class="info-priority-services">
              <div class="info-priority-service"><strong>Къде в Лом</strong><span>Дирекция „Социално подпомагане“ – Лом, ул. „Пристанищна“ №52.</span></div>
              <div class="info-priority-service"><strong>Какво носите</strong><span>Заявление-декларация, формуляр за самооценка и медицински документи или ТЕЛК/НЕЛК, когато са приложими.</span></div>
              <div class="info-priority-service"><strong>Как може да подадете</strong><span>Лично, по пощата с обратна разписка, чрез ССЕВ, по имейл на dsp-lom@asp.government.bg или чрез упълномощено лице.</span></div>
              <div class="info-priority-service"><strong>Ако не можете да посетите дирекцията</strong><span>При доказана с медицински документ необходимост документите могат да бъдат приети и в дома на човека с увреждане.</span></div>
              <div class="info-priority-service"><strong>Срок</strong><span>Индивидуалната оценка се изготвя до края на месеца, следващ месеца на подаване на документите.</span></div>
              <a class="info-priority-action info-priority-action--external" href="https://asp.government.bg/bg/deynosti/podkrepa-na-horata-s-uvrezhdaniya/individualna-otsenka-na-potrebnostite/" target="_blank" rel="noopener"><span>Формуляри за оценката</span><small>Отвори сайт ↗</small></a>
            </div>
          </details>

          <details class="info-priority-more">
            <summary>Финансова подкрепа при увреждане</summary>
            <div class="info-priority-services">
              <div class="info-priority-service"><strong>Къде започвате в Лом</strong><span>На ул. „Пристанищна“ №52 или на 0971 60 283. Ако имате ТЕЛК/НЕЛК, кажете това още при първия контакт.</span></div>
              <div class="info-priority-service"><strong>За какво може да ви насочат</strong><span>Месечна финансова подкрепа, целеви помощи, лична помощ и други мерки според индивидуалната оценка и приложимите условия.</span></div>
              <div class="info-priority-service"><strong>Защо не даваме една обща сума</strong><span>Размерът и правото зависят от вида и степента на увреждането и от конкретната подкрепа.</span></div>
              <a class="info-priority-action info-priority-action--external" href="https://asp.government.bg/bg/deynosti/podkrepa-na-horata-s-uvrezhdaniya/pravo-na-mesechna-finansova-podkrepa/" target="_blank" rel="noopener"><span>Месечна финансова подкрепа</span><small>Отвори сайт ↗</small></a>
            </div>
          </details>

          <details class="info-priority-more">
            <summary>Насочване към социална услуга</summary>
            <div class="info-priority-services">
              <div class="info-priority-service"><strong>Как заявявате в Лом</strong><span>Може устно на място, по телефон на 0971 60 283, писмено или електронно до Дирекция „Социално подпомагане“ – Лом.</span></div>
              <div class="info-priority-service"><strong>Какво следва</strong><span>Социален работник уточнява нуждите ви и изготвя предварителна оценка за насочване към подходяща социална услуга.</span></div>
              <div class="info-priority-service"><strong>Срокове</strong><span>До 3 работни дни след заявеното желание социален работник съгласува среща; предварителната оценка за насочване се изготвя до 20 дни.</span></div>
              <div class="info-priority-service"><strong>Конкретна услуга в Лом</strong><span>В актуалния регистър на АКСУ има лицензирана услуга „Общностна работа“ в Лом на ул. „Даме Груев“ №1, СУ „Отец Паисий“, тел. 0988 960 901. Тя е отделен доставчик, не е офис на Дирекция „Социално подпомагане“.</span></div>
              <a class="info-priority-action info-priority-action--external" href="https://aksu.government.bg/soczialni-uslugi/obsthnostna-rabota/" target="_blank" rel="noopener"><span>Лицензирани услуги · АКСУ</span><small>Отвори сайт ↗</small></a>
            </div>
          </details>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Закрила на детето</summary>
        <div class="info-priority-services">
          <div class="info-priority-service">
            <strong>Има отдел „Закрила на детето“ в Лом</strong>
            <span>АСП потвърждава действащ отдел „Закрила на детето“ към Дирекция „Социално подпомагане“ – Лом. В актуалния публичен указател не е публикуван отделен текущ телефон и адрес на отдела, затова за сигнали и консултации използвайте официалния контакт на дирекцията: ул. „Пристанищна“ №52, тел. 0971 60 283, dsp-lom@asp.government.bg.</span>
          </div>

          <details class="info-priority-more">
            <summary>Сигнал за дете в риск или насилие</summary>
            <div class="info-priority-services">
              <div class="info-priority-service"><strong>Ако има непосредствена опасност</strong><span>Обадете се на 112.</span></div>
              <div class="info-priority-service"><strong>Ако няма непосредствена опасност</strong><span>Подайте сигнал до Дирекция „Социално подпомагане“ – Лом на 0971 60 283, на място на ул. „Пристанищна“ №52 или писмено/по имейл на dsp-lom@asp.government.bg.</span></div>
              <div class="info-priority-service"><strong>Кой може да подаде сигнал</strong><span>Самото дете, родител, близък, друг гражданин, училище, лекар, полиция или друга институция.</span></div>
              <div class="info-priority-service"><strong>Допълнителен национален канал</strong><span>116 111 – Национална телефонна линия за деца за сигнали, консултация и подкрепа.</span></div>
              <div class="info-priority-service"><strong>Какво следва</strong><span>Отдел „Закрила на детето“ прави проучване и оценка и определя необходимите мерки според риска за детето.</span></div>
            </div>
          </details>

          <details class="info-priority-more">
            <summary>Подкрепа за дете и семейство</summary>
            <div class="info-priority-services">
              <div class="info-priority-service"><strong>Кога да се обърнете</strong><span>При риск за детето, насилие или неглижиране, сериозни затруднения в грижата, нужда от психологическа/социална подкрепа или насочване към услуга.</span></div>
              <div class="info-priority-service"><strong>Къде в Лом</strong><span>Започнете от Дирекция „Социално подпомагане“ – Лом, ул. „Пристанищна“ №52, тел. 0971 60 283.</span></div>
              <div class="info-priority-service"><strong>Каква помощ може да се организира</strong><span>Консултация, социална подкрепа, насочване към психологическа или педагогическа услуга и координация с други институции според случая.</span></div>
            </div>
          </details>

          <details class="info-priority-more">
            <summary>Приемна грижа и осиновяване</summary>
            <div class="info-priority-services">
              <div class="info-priority-service"><strong>Ако искате информация за приемна грижа</strong><span>Свържете се с местния отдел „Закрила на детето“ чрез основния контакт на дирекцията – 0971 60 283.</span></div>
              <div class="info-priority-service"><strong>Ако искате да кандидатствате за осиновител</strong><span>Дирекцията участва в социалното проучване и насочва към правилната процедура. Започнете с контакт с Дирекция „Социално подпомагане“ – Лом.</span></div>
            </div>
          </details>
        </div>
      </details>

      <div class="info-priority-faq-general">
        <a class="info-priority-action info-priority-action--external" href="https://asp.government.bg/bg/administrativni-uslugi-glavni/faq/" target="_blank" rel="noopener"><span class="info-faq-label"><span class="info-faq-label--mobile">Въпроси и отговори · АСП<small>Помощи · увреждания · деца · социални услуги</small></span><span class="info-faq-label--desktop">Често задавани въпроси към АСП<small>Социални и семейни помощи, отопление, права на хора с увреждания, ТЕЛК, лична помощ, социални услуги, осиновяване, приемна грижа и закрила на детето.</small></span></span><small>Отвори сайт ↗</small></a>
      </div>

      <details class="info-priority-more">
        <summary>Още информация за дирекцията</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Директор · ${esc(director)}</strong><span>Дирекция „Социално подпомагане“ – Лом.</span></div>
          <div class="info-priority-service"><strong>Работно време</strong><span>09:00–17:30. В официалния административен регистър е посочен непрекъсваем режим на обслужване с 30-минутна обедна почивка между 12:00 и 14:00.</span></div>
          <div class="info-priority-service"><strong>Имейл</strong><span>${esc(email)}</span></div>
          <div class="info-priority-service"><strong>Не знаете кой отдел ви трябва?</strong><span>Обадете се на 0971 60 283 и кажете конкретния случай. Това е по-сигурно от използване на стари отделни телефони, които не са публикувани в текущия официален указател.</span></div>
        </div>
      </details>

      <div class="info-priority-trust">Последно потвърдено: ${esc(date)}${confirmedSource ? ` · ${esc(confirmedSource)}` : " · Агенция за социално подпомагане"}</div>
    `;
    return article;
  }

  function renderPriorityInstitutions(entries, actions) {
    const root = document.querySelector('[data-info-category-root="institucii"]');
    const directory = root?.querySelector('.info-institution-directory');
    if (!root || !directory || root.querySelector('[data-approved-priority-institutions]')) return;

    const municipality = entries.find(e => e.category === "institucii" && e.subcategory === "obshtina");
    const police = entries.find(e => e.category === "institucii" && e.subcategory === "policia");
    const noi = entries.find(e => e.category === "institucii" && e.subcategory === "noi");
    const dsp = entries.find(e => e.category === "institucii" && e.subcategory === "dsp");
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
    const oldDsp = document.getElementById("institucii-dsp");

    directory.before(wrap);
    oldMunicipality?.remove();
    oldPolice?.remove();
    oldNoi?.remove();

    if (dsp) {
      const dspCard = buildSocialAssistanceCard(dsp.data || {}, dsp.confirmed_at, dsp.confirmed_source);
      wrap.appendChild(dspCard);
      oldDsp?.remove();
    }

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
