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
      if (["obshtina", "policia", "noi", "dsp", "pojarna", "byuro-truda", "rzok", "sud", "prokuratura", "imoten-registur", "osz", "kadastur", "vik", "tok", "nap", "poshta", "rzi", "odbh", "kzp", "riosv"].includes(entry.subcategory)) return;
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


  function fireIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.2 2.8c.5 3-1.9 4.2-1.1 6.4.5 1.3 1.8 1.7 2.4 3 .7 1.5.2 3.7-1.3 4.6 0-1.9-1.2-2.8-2.3-3.9.3 2.4-2.9 3.6-2.9 6.1 0 1.7 1.6 3 4 3 4.2 0 7-2.5 7-6.1 0-3.2-2.1-5.1-5.8-8.4.1 1.8-.5 3-1.5 3.7.2-3.3-1.3-5.6-3.5-7.2.4 2.2-.7 3.7-2 5.4C3.9 11.7 4 13.9 4 15.2"/></svg>';
  }

  function employmentIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6V4h6v2M4 8h16v11H4V8Z"/><path d="M4 12h16M10 12v2h4v-2"/></svg>';
  }

  function healthInsuranceIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Z"/><path d="M12 8v6M9 11h6"/></svg>';
  }

  function buildFireServiceCard(entry) {
    const article = document.createElement("article");
    article.className = "info-priority-card info-priority-card--fire";
    article.id = "institucii-pojarna";
    article.innerHTML = `
      <div class="info-priority-top">
        <div class="info-priority-icon">${fireIcon()}</div>
        <div>
          <span class="info-priority-kicker">Пожарна и аварийна безопасност</span>
          <h3>РС „Пожарна безопасност и защита на населението“ – Лом</h3>
          <p>При пожар, авария или непосредствена опасност първото действие е 112. Местният телефон е за връзка със службата и административни въпроси.</p>
        </div>
      </div>
      <div class="info-priority-facts">
        <div><strong>📍 ул. „Христо Ботев“ №9, Лом</strong></div>
        <div>🕒 Административно обслужване: Пон.–Пет. 08:30–17:30</div>
        <div>☎ Служба Лом: 0971 66 304</div>
      </div>
      <div class="info-priority-actions">
        <a class="info-priority-action info-priority-action--danger" href="tel:112"><span>Пожар / авария · 112</span><small>Спешно</small></a>
        <a class="info-priority-action info-priority-action--primary" href="tel:097166304"><span>РС ПБЗН Лом · 0971 66 304</span><small>Директно</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://www.mvr.bg/montana/%D0%BE%D0%B1%D1%89%D0%B5%D1%81%D1%82%D0%B2%D0%B5%D0%BD-%D1%80%D0%B5%D0%B4-%D0%B8-%D1%81%D0%B8%D0%B3%D1%83%D1%80%D0%BD%D0%BE%D1%81%D1%82/%D0%BF%D0%BE%D0%B6%D0%B0%D1%80%D0%BD%D0%B0-%D0%B1%D0%B5%D0%B7%D0%BE%D0%BF%D0%B0%D1%81%D0%BD%D0%BE%D1%81%D1%82-%D0%B8-%D0%B7%D0%B0%D1%89%D0%B8%D1%82%D0%B0-%D0%BD%D0%B0-%D0%BD%D0%B0%D1%81%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%D1%82%D0%BE/%D1%80%D1%81-%D0%BF%D0%B1%D0%B7%D0%BD---%D0%BB%D0%BE%D0%BC" target="_blank" rel="noopener"><span>Официална страница</span><small>Отвори сайт ↗</small></a>
      </div>
      <div class="info-priority-note"><strong>Важно:</strong> номер 0971 66 304 не замества 112 при текущ пожар, авария или опасност.</div>
      <details class="info-priority-more">
        <summary>Началник и прием на граждани</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>ВПД началник · гл. инспектор Милен Янакиев</strong><span>Приемен ден: вторник, 11:00–12:00.</span></div>
          <div class="info-priority-service"><strong>Телефон за началника</strong><span><a href="tel:097166303">0971 66 303</a></span></div>
        </div>
      </details>
      <details class="info-priority-more">
        <summary>Административни въпроси</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Къде в Лом</strong><span>Административното обслужване на РСПБЗН Лом е на ул. „Христо Ботев“ №9.</span></div>
          <div class="info-priority-service"><strong>Кога</strong><span>Понеделник–петък, 08:30–17:30, без прекъсване.</span></div>
          <div class="info-priority-service"><strong>Преди посещение</strong><span>За конкретен документ или процедура първо се обадете на 0971 66 304, за да потвърдите какво е необходимо.</span></div>
        </div>
      </details>
      <div class="info-priority-trust">Последно проверено: 17 август 2026 г. · МВР / РДПБЗН Монтана</div>`;
    return article;
  }

  function buildEmploymentOfficeCard(entry) {
    const article = document.createElement("article");
    article.className = "info-priority-card info-priority-card--employment";
    article.id = "institucii-byuro-truda";
    article.innerHTML = `
      <div class="info-priority-top">
        <div class="info-priority-icon">${employmentIcon()}</div>
        <div>
          <span class="info-priority-kicker">Работа и регистрация</span>
          <h3>Дирекция „Бюро по труда“ – Лом</h3>
          <p>Регистрация като търсещ работа, трудово посредничество, свободни места, програми за заетост и обучение.</p>
        </div>
      </div>
      <div class="info-priority-facts">
        <div><strong>📍 пл. „Свобода“ №6, Лом</strong></div>
        <div>🕒 08:30–17:00</div>
        <div>☎ Информация: 0971 60 195</div>
      </div>
      <div class="info-priority-actions">
        <a class="info-priority-action info-priority-action--primary" href="tel:097160195"><span>Информация · 0971 60 195</span><small>Директно</small></a>
        <a class="info-priority-action info-priority-action--secondary" href="tel:097160190"><span>Друг местен контакт · 0971 60 190</span><small>Директно</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://iisda.government.bg/adm_services/services/service_provision/38218" target="_blank" rel="noopener"><span>Регистрация като търсещ работа</span><small>Отвори сайт ↗</small></a>
      </div>

      <div class="info-priority-note"><strong>Ако сте останали без работа и искате обезщетение:</strong> регистрацията е в Бюрото по труда, но правото и плащането на обезщетението са от НОИ. За да не губите период от обезщетението, НОИ посочва регистрация в Агенцията по заетостта до 7 работни дни от прекратяване на осигуряването.</div>

      <details class="info-priority-more">
        <summary>Регистрация като търсещ работа</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Къде в Лом</strong><span>ДБТ Лом, пл. „Свобода“ №6. Регистрацията е по постоянен или настоящ адрес и може да бъде само в едно Бюро по труда.</span></div>
          <div class="info-priority-service"><strong>На място</strong><span>Заявлението-декларация може да бъде изготвено с помощта на трудов посредник. При подаване на място регистрацията се извършва в момента на подаването.</span></div>
          <div class="info-priority-service"><strong>Други начини</strong><span>Заявлението може да се подаде и електронно по реда на електронното управление или чрез лицензиран пощенски оператор.</span></div>
          <div class="info-priority-service"><strong>Какво получавате</strong><span>Регистрационна карта с регистрационен номер, контакт с трудов посредник и действията/сроковете по вашия план.</span></div>
          <a class="info-priority-action info-priority-action--external" href="https://iisda.government.bg/adm_services/services/service_provision/38218" target="_blank" rel="noopener"><span>Точни условия за регистрация</span><small>Отвори сайт ↗</small></a>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Търся работа</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Трудов посредник</strong><span>След регистрация Бюрото по труда ви информира и насочва към подходящи свободни места според профила и възможностите ви.</span></div>
          <div class="info-priority-service"><strong>Обучения и програми</strong><span>Безработни лица могат да бъдат включвани в програми и мерки за заетост и обучение при действащи условия и свободни места.</span></div>
          <div class="info-priority-service"><strong>Не чакайте само обява</strong><span>Ако имате конкретна професия, квалификация или ограничение за пътуване, кажете го на посредника, за да получите по-точно насочване.</span></div>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Обезщетение за безработица · важно разграничение</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Бюрото по труда</strong><span>Регистрира ви като безработно/търсещо работа лице и може да приеме хартиено заявление за обезщетение.</span></div>
          <div class="info-priority-service"><strong>НОИ</strong><span>Преценява правото, размера и изплаща паричното обезщетение за безработица.</span></div>
          <div class="info-priority-service"><strong>Срок, който е важно да знаете</strong><span>За изплащане от датата на прекратяване НОИ изисква регистрация в Агенцията по заетостта до 7 работни дни и заявление за обезщетение в тримесечен срок.</span></div>
          <a class="info-priority-action info-priority-action--external" href="https://www.nssi.bg/fizicheski-lica/po-bg-zakonodatelstvo/pri-bezrabotitsa/" target="_blank" rel="noopener"><span>Обезщетение за безработица · НОИ</span><small>Отвори сайт ↗</small></a>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Работодатели</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Свободно работно място</strong><span>Работодател може да заяви в Бюрото по труда свободно място и изискванията към кандидатите.</span></div>
          <div class="info-priority-service"><strong>Програми и мерки</strong><span>За субсидирана заетост, обучения и действащи мерки попитайте ДБТ Лом какво е отворено към момента.</span></div>
          <a class="info-priority-action info-priority-action--external" href="https://iisda.government.bg/adm_services/services/service_provision/44802" target="_blank" rel="noopener"><span>Заявяване на свободно работно място</span><small>Отвори сайт ↗</small></a>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Още контакти</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Мобилен контакт</strong><span><a href="tel:0882824943">0882 824 943</a></span></div>
          <div class="info-priority-service"><strong>Имейл в държавния административен регистър</strong><span><a href="mailto:bt508@mbox.contact.bg">bt508@mbox.contact.bg</a></span></div>
          <div class="info-priority-service"><strong>Достъпност</strong><span>В държавния административен регистър е отбелязан осигурен достъп за хора с увреждания.</span></div>
        </div>
      </details>
      <div class="info-priority-trust">Последно проверено: 17 август 2026 г. · Административен регистър / Агенция по заетостта</div>`;
    return article;
  }

  function buildHealthInsuranceCard(entry) {
    const article = document.createElement("article");
    article.className = "info-priority-card info-priority-card--health-insurance";
    article.id = "institucii-rzok";
    article.innerHTML = `
      <div class="info-priority-top">
        <div class="info-priority-icon">${healthInsuranceIcon()}</div>
        <div>
          <span class="info-priority-kicker">Здравноосигурителни услуги в Лом</span>
          <h3>РЗОК Монтана · офис Лом</h3>
          <p>Местен офис на Районната здравноосигурителна каса за въпроси и обслужване по здравноосигурителни права и документи.</p>
        </div>
      </div>
      <div class="info-priority-facts">
        <div><strong>📍 ул. „Стефчо Хаджийски“, сградата на Поликлиниката, Лом</strong></div>
        <div>🕒 08:30–17:00</div>
        <div>☎ Офис Лом: 0971 66 555</div>
      </div>
      <div class="info-priority-actions">
        <a class="info-priority-action info-priority-action--primary" href="tel:097166555"><span>Офис Лом · 0971 66 555</span><small>Директно</small></a>
        <a class="info-priority-action info-priority-action--secondary" href="tel:080014800"><span>НЗОК за граждани · 0800 14 800</span><small>Директно</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://www.nhif.bg/bg/rzok/montana" target="_blank" rel="noopener"><span>Официални контакти РЗОК Монтана</span><small>Отвори сайт ↗</small></a>
      </div>

      <details class="info-priority-more">
        <summary>Здравноосигурителна книжка</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Къде се издава</strong><span>Здравноосигурителните книжки се предоставят чрез РЗОК според районната каса, с която работи постоянно избраният ви личен лекар.</span></div>
          <div class="info-priority-service"><strong>Ако личният ви лекар е в област Монтана</strong><span>Преди посещение се обадете на офис Лом – 0971 66 555 – за да потвърдите дали конкретното издаване/подмяна се извършва на място и какво трябва да носите.</span></div>
          <div class="info-priority-service"><strong>При изгубена книжка</strong><span>Подаването е до директора на РЗОК, на чиято територия работи постоянно избраният ви личен лекар.</span></div>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Европейска здравноосигурителна карта · ЕЗОК</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Не тръгвайте автоматично към офис Лом</strong><span>НЗОК посочва подаване онлайн през електронното управление или на гише в определените пунктове за заявления за ЕЗОК.</span></div>
          <div class="info-priority-service"><strong>Какво да направите</strong><span>Отворете официалната страница за ЕЗОК и изберете онлайн подаване или проверете актуалния списък с пунктове.</span></div>
          <a class="info-priority-action info-priority-action--external" href="https://www.nhif.bg/bg/people/ezok" target="_blank" rel="noopener"><span>ЕЗОК · подаване и информация</span><small>Отвори сайт ↗</small></a>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Лекарства, протоколи и медицински изделия</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>При лечение с протокол</strong><span>Процедурата започва от лекуващия лекар/лечебното заведение според изискванията на НЗОК. Ако не знаете дали трябва да посещавате РЗОК, първо се обадете на офис Лом.</span></div>
          <div class="info-priority-service"><strong>Помощни средства и медицински изделия</strong><span>Част от процедурите се обработват от РЗОК, но зависят от издаденото електронно решение/протокол. Проверете конкретния случай преди посещение.</span></div>
          <a class="info-priority-action info-priority-action--external" href="https://www.nhif.bg/bg/people/get_medicamentation/steps" target="_blank" rel="noopener"><span>Лекарства и протоколи · стъпки</span><small>Отвори сайт ↗</small></a>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Кога да звъннете първо</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Офис Лом · 0971 66 555</strong><span>Когато имате конкретен документ, протокол или въпрос дали услугата се извършва на място в Лом.</span></div>
          <div class="info-priority-service"><strong>НЗОК · 0800 14 800</strong><span>За обща информация за здравноосигурителни права и когато не сте сигурни към коя РЗОК/офис да се обърнете.</span></div>
        </div>
      </details>
      <div class="info-priority-trust">Последно проверено: 17 август 2026 г. · НЗОК / РЗОК Монтана</div>`;
    return article;
  }


  function courtIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h16M6 9v8m4-8v8m4-8v8m4-8v8M3 19h18M12 3l8 4H4l8-4Z"/></svg>';
  }

  function prosecutionIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M7 6h10M5 9l-3 5h6L5 9Zm14 0-3 5h6l-3-5ZM8 21h8"/></svg>';
  }

  function registryIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h11l3 3v15H5V3Z"/><path d="M16 3v4h4M8 11h8M8 15h8M8 19h5"/></svg>';
  }

  function buildDistrictCourtCard(entry) {
    const article = document.createElement("article");
    article.className = "info-priority-card info-priority-card--court";
    article.id = "institucii-sud";
    article.innerHTML = `
      <div class="info-priority-top">
        <div class="info-priority-icon">${courtIcon()}</div>
        <div>
          <span class="info-priority-kicker">Съдебна палата · Лом</span>
          <h3>Районен съд – Лом</h3>
          <p>Граждански и наказателни дела, заявления и молби, съдебно изпълнение, свидетелство за съдимост и електронен достъп до дела.</p>
        </div>
      </div>
      <div class="info-priority-facts">
        <div><strong>📍 пл. „Свобода“ №8, Лом</strong></div>
        <div>☎ Централа: 0971 68 101</div>
        <div>✉ Регистратура: edelivery@rclom.org</div>
      </div>
      <div class="info-priority-actions">
        <a class="info-priority-action info-priority-action--primary" href="tel:097168101"><span>Обади се · 0971 68 101</span><small>Директно</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://lom-rs.justice.bg/bg" target="_blank" rel="noopener"><span>Официален сайт на съда</span><small>Отвори сайт ↗</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://ecase.justice.bg/Case" target="_blank" rel="noopener"><span>Провери съдебно дело</span><small>Отвори сайт ↗</small></a>
      </div>

      <details class="info-priority-more">
        <summary>Подаване на молба, жалба или документ</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>На място в Лом</strong><span>Документите за Районен съд – Лом се подават в Съдебната палата на пл. „Свобода“ №8. Ако не сте сигурни в кое деловодство, започнете от регистратурата или централния телефон.</span></div>
          <div class="info-priority-service"><strong>По електронна поща</strong><span>Официалният сайт посочва edelivery@rclom.org за електронно подписани документи по граждански и наказателни дела. Препоръчителният формат е PDF.</span></div>
          <div class="info-priority-service"><strong>Важно</strong><span>При заявления и молби за издаване на документи съдът изрично препоръчва да посочите телефон за контакт.</span></div>
          <a class="info-priority-action info-priority-action--secondary" href="mailto:edelivery@rclom.org"><span>Пиши до регистратурата</span><small>Директно</small></a>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Кое деловодство ми трябва</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Граждански дела</strong><span>gd@rclom.org — граждански дела, включително семейни и други граждански производства.</span></div>
          <div class="info-priority-service"><strong>Наказателни дела</strong><span>nd@rclom.org — наказателно деловодство.</span></div>
          <div class="info-priority-service"><strong>Съдебно изпълнение</strong><span>sid@rclom.org — изпълнително деловодство. Службата е в същата сграда, на първия етаж.</span></div>
          <div class="info-priority-service"><strong>Ако не знаете</strong><span>Не изпращайте документа на случаен имейл — обадете се на 0971 68 101 или използвайте регистратурата.</span></div>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Проверка на дело и електронен достъп</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Публична проверка</strong><span>В Единния портал за електронно правосъдие може да търсите дела по съд, номер, година и други критерии.</span></div>
          <div class="info-priority-service"><strong>Ако сте страна по дело</strong><span>С регистриран профил и разрешен достъп може да виждате електронната папка и документите по делото.</span></div>
          <a class="info-priority-action info-priority-action--external" href="https://ecase.justice.bg/Case" target="_blank" rel="noopener"><span>Търсене на дело · ЕПЕП</span><small>Отвори сайт ↗</small></a>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Свидетелство за съдимост</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Електронно</strong><span>Официалният сайт на съда насочва към електронно свидетелство за съдимост за лица, които отговарят на условията за услугата и разполагат с необходимата електронна идентификация.</span></div>
          <div class="info-priority-service"><strong>Ако не можете електронно</strong><span>Обадете се на 0971 68 101, за да потвърдите къде и как се подава заявлението на място в Лом.</span></div>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Какво още има в Районния съд</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Съдебно-изпълнителна служба</strong><span>Намира се в Съдебната палата, пл. „Свобода“ №8, на първия етаж.</span></div>
          <div class="info-priority-service"><strong>Район на действие</strong><span>Районният съд обслужва Лом и още общини от съдебния район; за конкретна подсъдност проверете преди подаване.</span></div>
        </div>
      </details>
      <div class="info-priority-trust">Последно проверено: 17 август 2026 г. · Районен съд – Лом / Единен портал за електронно правосъдие</div>`;
    return article;
  }

  function buildProsecutionCard(entry) {
    const article = document.createElement("article");
    article.className = "info-priority-card info-priority-card--prosecution";
    article.id = "institucii-prokuratura";
    article.innerHTML = `
      <div class="info-priority-top">
        <div class="info-priority-icon">${prosecutionIcon()}</div>
        <div>
          <span class="info-priority-kicker">Местно териториално отделение</span>
          <h3>Прокуратура · Териториално отделение – Лом</h3>
          <p>Жалби и сигнали за престъпления, информация по преписки и услуги на прокуратурата.</p>
        </div>
      </div>
      <div class="info-priority-facts">
        <div><strong>📍 пл. „Свобода“ №8, Лом</strong></div>
        <div>🕒 08:30–17:00</div>
        <div>☎ 0971 66 902</div>
      </div>
      <div class="info-priority-actions">
        <a class="info-priority-action info-priority-action--primary" href="tel:097166902"><span>ТО Лом · 0971 66 902</span><small>Директно</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://prb.bg/rplom/" target="_blank" rel="noopener"><span>Официална страница · Лом</span><small>Отвори сайт ↗</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://e-services.prb.bg/epob-ui/" target="_blank" rel="noopener"><span>Електронни услуги на ПРБ</span><small>Отвори сайт ↗</small></a>
      </div>

      <details class="info-priority-more">
        <summary>Подаване на жалба или сигнал</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Къде в Лом</strong><span>Териториално отделение – Лом към Районна прокуратура – Монтана, пл. „Свобода“ №8.</span></div>
          <div class="info-priority-service"><strong>За какво</strong><span>Жалби, сигнали и други съобщения за данни за престъпление и за защита на права в рамките на правомощията на прокуратурата.</span></div>
          <div class="info-priority-service"><strong>Не подавайте анонимно, ако очаквате обратна връзка</strong><span>Самата прокуратура предупреждава, че липсата на коректни имена, адрес и контакт може да доведе до третиране на сигнала като анонимен.</span></div>
          <a class="info-priority-action info-priority-action--external" href="https://e-services.prb.bg/epob-ui/" target="_blank" rel="noopener"><span>Подай/провери електронна услуга</span><small>Отвори сайт ↗</small></a>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Домашно насилие или нарушена заповед за защита</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>При непосредствена опасност</strong><span>112.</span></div>
          <div class="info-priority-service"><strong>Кога прокуратурата е правилният адрес</strong><span>При данни за престъпление, включително при неизпълнение на съдебна заповед за защита или когато насилието включва престъпни действия.</span></div>
          <div class="info-priority-service"><strong>Кога съдът е важен</strong><span>Молбата за съдебна защита от домашно насилие се подава до районния съд по компетентност. За Лом съдът е на същия адрес — пл. „Свобода“ №8.</span></div>
          <a class="info-priority-action info-priority-action--external" href="https://prb.bg/rplom/bg/za-grazhdanite/informacija-za-lica-postradali-ot-domashno-nasilie-zakana-s-ubijstvo-ili-narushena-zapoved-za-zashtita-ot-domashno-nasilie" target="_blank" rel="noopener"><span>Помощ при домашно насилие</span><small>Отвори сайт ↗</small></a>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Проверка на преписка</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Онлайн</strong><span>Порталът на прокуратурата позволява проверка по номер на преписка или регистрационен номер на жалба/сигнал.</span></div>
          <div class="info-priority-service"><strong>Стари преписки от ТО Лом</strong><span>Порталът дава специално указание за търсене на преписки от трансформирани прокуратури/териториални отделения.</span></div>
          <a class="info-priority-action info-priority-action--external" href="https://e-services.prb.bg/epob-ui/" target="_blank" rel="noopener"><span>Провери преписка</span><small>Отвори сайт ↗</small></a>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Други услуги</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Удостоверения</strong><span>Порталът на ПРБ предлага електронни услуги, включително за удостоверения за неприключени наказателни производства и за изтърпяно наказание.</span></div>
          <div class="info-priority-service"><strong>Имейл</strong><span>Актуалната контактна страница на ТО Лом насочва към общия имейл на Районна прокуратура – Монтана: rp_mon@mon.prb.bg.</span></div>
        </div>
      </details>
      <div class="info-priority-trust">Последно проверено: 17 август 2026 г. · Прокуратура на Република България</div>`;
    return article;
  }

  function buildPropertyRegistryCard(entry) {
    const article = document.createElement("article");
    article.className = "info-priority-card info-priority-card--registry";
    article.id = "institucii-imoten-registur";
    article.innerHTML = `
      <div class="info-priority-top">
        <div class="info-priority-icon">${registryIcon()}</div>
        <div>
          <span class="info-priority-kicker">Имотен регистър · местна служба</span>
          <h3>Служба по вписванията – Лом</h3>
          <p>Вписвания за имоти, удостоверения и преписи от Имотния регистър, както и справки за вписани актове.</p>
        </div>
      </div>
      <div class="info-priority-facts">
        <div><strong>📍 пл. „Свобода“ №8, Лом</strong></div>
        <div>☎ Служба Лом: 0971 66 079</div>
        <div>☎ Информационен център АВ: 0700 121 07</div>
      </div>
      <div class="info-priority-actions">
        <a class="info-priority-action info-priority-action--primary" href="tel:097166079"><span>Служба Лом · 0971 66 079</span><small>Директно</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://portal.registryagency.bg/bg/home-pr" target="_blank" rel="noopener"><span>Имотен регистър · услуги</span><small>Отвори сайт ↗</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://www.registryagency.bg/bg/kontakti/kontakti-imoten-registar/" target="_blank" rel="noopener"><span>Официални контакти</span><small>Отвори сайт ↗</small></a>
      </div>

      <details class="info-priority-more">
        <summary>Какво се прави в Службата по вписванията</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Вписвания по имоти</strong><span>Службата по вписванията обслужва вписванията в Имотния регистър за имотите в нейния район.</span></div>
          <div class="info-priority-service"><strong>Удостоверения и преписи</strong><span>През Имотния регистър се заявяват удостоверения за имот за определен период, заверени/незаверени преписи и други услуги според конкретния документ.</span></div>
          <div class="info-priority-service"><strong>Ако не знаете коя услуга ви трябва</strong><span>Преди посещение се обадете на 0971 66 079 или на информационния център 0700 121 07.</span></div>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Справка за имот или вписан документ</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Онлайн справки</strong><span>Единният портал предлага справки чрез отдалечен достъп за лице, имот и документ. За част от услугите е нужна регистрация и електронна идентификация.</span></div>
          <div class="info-priority-service"><strong>Коя служба е компетентна</strong><span>Има безплатна публична справка „Служба по вписванията по местонахождение на имота“, ако не сте сигурни дали имотът попада към Лом.</span></div>
          <a class="info-priority-action info-priority-action--external" href="https://portal.registryagency.bg/bg/home-pr" target="_blank" rel="noopener"><span>Отвори Имотния регистър</span><small>Отвори сайт ↗</small></a>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Удостоверение или препис</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Удостоверение за имот</strong><span>В портала има електронна услуга за удостоверение за имот за определен период.</span></div>
          <div class="info-priority-service"><strong>Препис от вписан акт</strong><span>Може да се заявява заверен или незаверен препис според условията на Имотния регистър.</span></div>
          <div class="info-priority-service"><strong>За конкретен нотариален акт/вписване</strong><span>Ако не знаете точния вид заявление, първо уточнете със Служба по вписванията – Лом, за да не подадете грешна услуга.</span></div>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Информационен център на Агенцията по вписванията</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>0700 121 07</strong><span>За въпроси относно регистрите и електронните услуги. Официално обявено работно време: делнични дни 09:00–17:30.</span></div>
          <div class="info-priority-service"><strong>Кога е по-полезен от местната служба</strong><span>При проблем с електронния портал, достъп, електронна услуга или общ въпрос за Имотния регистър.</span></div>
        </div>
      </details>
      <div class="info-priority-trust">Последно проверено: 17 август 2026 г. · Агенция по вписванията / ЕПЗЕУ</div>`;
    return article;
  }


  function agricultureIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21V9M12 13c-4 0-7-2-8-6 4 0 7 2 8 6Zm0 3c4 0 7-2 8-6-4 0-7 2-8 6Z"/><path d="M12 9c0-3 1.5-5 4-6"/></svg>';
  }

  function cadastreIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/></svg>';
  }

  function waterIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11Z"/><path d="M9 15c.7 1.3 1.7 2 3 2"/></svg>';
  }

  function electricityIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-7 12h6l-1 8 7-12h-6l1-8Z"/></svg>';
  }

  function revenueIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4V5Z"/><path d="M8 9h8M8 13h5M16 16h.01"/></svg>';
  }

  function buildAgricultureOfficeCard(entry) {
    const article = document.createElement("article");
    article.className = "info-priority-card info-priority-card--agriculture";
    article.id = "institucii-osz";
    article.innerHTML = `
      <div class="info-priority-top">
        <div class="info-priority-icon">${agricultureIcon()}</div>
        <div>
          <span class="info-priority-kicker">Местна земеделска служба</span>
          <h3>Общинска служба по земеделие – Лом</h3>
          <p>Земеделски земи, договори за наем и аренда, масиви за ползване, регистри и административни услуги на ОСЗ.</p>
        </div>
      </div>
      <div class="info-priority-facts">
        <div><strong>📍 ул. „Панайот Волов“ №1, Лом</strong></div>
        <div>☎ 0971 66 025</div>
        <div>✉ oszg-lom@net-surf.net</div>
      </div>
      <div class="info-priority-actions">
        <a class="info-priority-action info-priority-action--primary" href="tel:097166025"><span>ОСЗ Лом · 0971 66 025</span><small>Директно</small></a>
        <a class="info-priority-action info-priority-action--secondary" href="mailto:oszg-lom@net-surf.net"><span>Пиши до ОСЗ Лом</span><small>Директно</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://www.mzh.government.bg/ODZ-Montana/bg/Structure/OSZ.aspx" target="_blank" rel="noopener"><span>Официални контакти</span><small>Отвори сайт ↗</small></a>
      </div>

      <details class="info-priority-more">
        <summary>Земеделски земи и договори</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Договори за наем и аренда</strong><span>ОСЗ приема и регистрира договори за ползване на земеделски земи при приложимите процедури. За участие в масиви за ползване има отделни срокове и образци за съответната стопанска година.</span></div>
          <div class="info-priority-service"><strong>Масиви за ползване</strong><span>За землищата в община Лом ОД „Земеделие“ публикува заповеди, регистри, карти и протоколи по чл. 37в.</span></div>
          <a class="info-priority-action info-priority-action--external" href="https://www.mzh.government.bg/odz-montana/bg/Polzvane/Proceduri_37v_25-26/Lom_37v_25-26.aspx" target="_blank" rel="noopener"><span>Масиви за ползване · Лом</span><small>Отвори сайт ↗</small></a>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Собственик или ползвател на земеделска земя</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Ако сте собственик</strong><span>За процедурите по ползване на земеделски земи има декларации и регистри според конкретното основание и стопанската година.</span></div>
          <div class="info-priority-service"><strong>Ако сте ползвател</strong><span>Може да има заявление и изискване за регистрирани договори преди участие в процедура по разпределение на масиви.</span></div>
          <div class="info-priority-service"><strong>Преди подаване</strong><span>Обадете се на 0971 66 025 и кажете землището и какво искате да направите, защото документите зависят от конкретната процедура.</span></div>
          <a class="info-priority-action info-priority-action--external" href="https://www.mzh.government.bg/odz-montana/bg/polzvane.aspx" target="_blank" rel="noopener"><span>Образци и актуални процедури</span><small>Отвори сайт ↗</small></a>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Началник и местен контакт</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Началник · Теменужка Миланова</strong><span>Посочена в актуалния официален списък на ОСЗ в област Монтана.</span></div>
          <div class="info-priority-service"><strong>Адрес</strong><span>гр. Лом, ул. „Панайот Волов“ №1.</span></div>
          <div class="info-priority-service"><strong>Телефон</strong><span><a href="tel:097166025">0971 66 025</a></span></div>
        </div>
      </details>
      <div class="info-priority-trust">Последно проверено: 17 август 2026 г. · ОД „Земеделие“ – Монтана / МЗХ</div>`;
    return article;
  }

  function buildCadastreCard(entry) {
    const article = document.createElement("article");
    article.className = "info-priority-card info-priority-card--cadastre";
    article.id = "institucii-kadastur";
    article.innerHTML = `
      <div class="info-priority-top">
        <div class="info-priority-icon">${cadastreIcon()}</div>
        <div>
          <span class="info-priority-kicker">Кадастър · Лом и Монтана</span>
          <h3>Кадастър за имоти в Лом</h3>
          <p>За официалната кадастрална карта и услуги на АГКК компетентната служба е СГКК – Монтана; част от общинските кадастрални справки се предоставят и от Община Лом.</p>
        </div>
      </div>
      <div class="info-priority-facts">
        <div><strong>📍 СГКК Монтана: пл. „Жеравица“ №3, ет. 3</strong></div>
        <div>☎ СГКК Монтана: 096 305 822</div>
        <div>📍 Община Лом: ул. „Дунавска“ №12</div>
      </div>
      <div class="info-priority-actions">
        <a class="info-priority-action info-priority-action--primary" href="tel:096305822"><span>СГКК Монтана · 096 305 822</span><small>Директно</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://kais.cadastre.bg/" target="_blank" rel="noopener"><span>КАИС · кадастрална карта и услуги</span><small>Отвори сайт ↗</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://www.cadastre.bg/contacts/sgkk-montana" target="_blank" rel="noopener"><span>Официални контакти СГКК</span><small>Отвори сайт ↗</small></a>
      </div>

      <details class="info-priority-more">
        <summary>Трябва ми скица, схема или услуга от АГКК</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Официална кадастрална карта</strong><span>За услуги по кадастралната карта и кадастралните регистри използвайте КАИС или СГКК – Монтана.</span></div>
          <div class="info-priority-service"><strong>За имот в Лом</strong><span>Не е нужно първо да търсите случаен местен офис. Проверете имота в КАИС и при нужда се свържете със СГКК – Монтана.</span></div>
          <a class="info-priority-action info-priority-action--external" href="https://kais.cadastre.bg/" target="_blank" rel="noopener"><span>Отвори КАИС</span><small>Отвори сайт ↗</small></a>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Какво мога да направя в Община Лом</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Общински услуги „Кадастър“</strong><span>Община Лом публикува услуги за справки от кадастъра, удостоверения за факти и обстоятелства по териториално и селищно устройство и промени в разписния списък към кадастрален план.</span></div>
          <div class="info-priority-service"><strong>Важно разграничение</strong><span>Тези общински услуги не са автоматично същото като издаване на скица/схема от действащата кадастрална карта на АГКК.</span></div>
          <a class="info-priority-action info-priority-action--external" href="https://www.lom.bg/section-132-content.html" target="_blank" rel="noopener"><span>Общински услуги „Кадастър“</span><small>Отвори сайт ↗</small></a>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Не знам към кого да се обърна</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>За кадастрална карта, идентификатор, скица/схема</strong><span>Започнете от КАИС / СГКК – Монтана.</span></div>
          <div class="info-priority-service"><strong>За общински кадастрален план или местно удостоверение</strong><span>Започнете от Община Лом, ул. „Дунавска“ №12, тел. 0971 69 101.</span></div>
        </div>
      </details>
      <div class="info-priority-trust">Последно проверено: 17 август 2026 г. · АГКК / Община Лом</div>`;
    return article;
  }

  function buildWaterUtilityInstitutionCard(entry) {
    const article = document.createElement("article");
    article.className = "info-priority-card info-priority-card--water";
    article.id = "institucii-vik";
    article.innerHTML = `
      <div class="info-priority-top">
        <div class="info-priority-icon">${waterIcon()}</div>
        <div>
          <span class="info-priority-kicker">Водоснабдяване · област Монтана</span>
          <h3>„ВиК“ ООД – Монтана · услуги за Лом</h3>
          <p>Аварии, нарушено водоподаване, сметки и клиентски въпроси за потребителите в Лом.</p>
        </div>
      </div>
      <div class="info-priority-facts">
        <div><strong>☎ 0700 20 272</strong></div>
        <div>🌙 Аварии: опция 1 · денонощно</div>
        <div>🕒 Клиентски център: 08:00–17:00</div>
      </div>
      <div class="info-priority-actions">
        <a class="info-priority-action info-priority-action--danger" href="tel:070020272"><span>Авария · 0700 20 272</span><small>Опция 1</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://www.vikmontana.com/bg/messages/breakdown.html?region_id=&sub_region_id=" target="_blank" rel="noopener"><span>Провери аварии</span><small>Отвори сайт ↗</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://www.vikmontana.com/" target="_blank" rel="noopener"><span>Провери сметка</span><small>Отвори сайт ↗</small></a>
      </div>
      <div class="info-priority-note"><strong>За Лом:</strong> операторът публикува отделни съобщения при нарушено водоподаване в града. За текуща авария първо използвайте денонощния телефон или страницата с аварии.</div>

      <details class="info-priority-more">
        <summary>Авария или липса на вода</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Телефон</strong><span>0700 20 272 → опция 1 от гласовото меню, денонощно.</span></div>
          <div class="info-priority-service"><strong>Преди да звъните</strong><span>Проверете страницата със съобщения за аварии — ВиК Монтана публикува и конкретни съобщения за Лом.</span></div>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Сметка, въпрос или консултация</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Център за обслужване на клиенти</strong><span>0700 20 272 → опции 2 и 3. Приемно време 08:00–17:00 без прекъсване в делнични дни.</span></div>
          <div class="info-priority-service"><strong>Онлайн сметка</strong><span>На официалния сайт има проверка на сметка за физически и юридически лица.</span></div>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Самоотчет на водомер</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>По снимка</strong><span>ВиК Монтана публикува Viber номера 0889 465 402 и 0886 854 503 за изпращане на снимка на водомера, придружена от номер на водомера или абонатен номер.</span></div>
          <div class="info-priority-service"><strong>Важно</strong><span>Тези Viber номера са за самоотчет със снимка, не за въпроси и жалби.</span></div>
          <a class="info-priority-action info-priority-action--external" href="https://www.vikmontana.com/bg/instruktsii-za-samootchet.html" target="_blank" rel="noopener"><span>Инструкции за самоотчет</span><small>Отвори сайт ↗</small></a>
        </div>
      </details>
      <div class="info-priority-trust">Последно проверено: 17 август 2026 г. · „ВиК“ ООД – Монтана</div>`;
    return article;
  }

  function buildElectricityCard(entry) {
    const article = document.createElement("article");
    article.className = "info-priority-card info-priority-card--electricity";
    article.id = "institucii-tok";
    article.innerHTML = `
      <div class="info-priority-top">
        <div class="info-priority-icon">${electricityIcon()}</div>
        <div>
          <span class="info-priority-kicker">Електроенергия · местен клиентски център</span>
          <h3>Електрохолд / ЕРМ Запад – Лом</h3>
          <p>Местен клиентски център в Лом, аварии и прекъсвания, сметки и клиентски услуги.</p>
        </div>
      </div>
      <div class="info-priority-facts">
        <div><strong>📍 ул. „Христо Ботев“ №13, Лом</strong></div>
        <div>🕒 Пон.–Пет. 08:30–17:00</div>
        <div>☎ 0700 10 010</div>
      </div>
      <div class="info-priority-actions">
        <a class="info-priority-action info-priority-action--danger" href="tel:070010010"><span>Нямам ток · 0700 10 010</span><small>24/7</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://electrohold.bg/bg/kontakti/kontakti-electrohold/" target="_blank" rel="noopener"><span>Клиентски център Лом</span><small>Отвори сайт ↗</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://electrohold.bg/bg/za-nas/etichni-principi/energien-ombudsman/" target="_blank" rel="noopener"><span>Какво да правя без ток</span><small>Отвори сайт ↗</small></a>
      </div>

      <details class="info-priority-more">
        <summary>Нямам електрозахранване</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Първо</strong><span>Проверете дали има ток в съседните обекти и дали предпазителите във вашето табло са включени.</span></div>
          <div class="info-priority-service"><strong>Ако причината не е във вашия имот</strong><span>Обадете се на 0700 10 010 — линията приема сигнали за аварии и прекъсвания денонощно.</span></div>
          <div class="info-priority-service"><strong>Планирано или текущо прекъсване</strong><span>ЕРМ Запад публикува онлайн информация за текущи и планирани прекъсвания и очаквано възстановяване.</span></div>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Кога да посетя центъра в Лом</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Адрес</strong><span>ул. „Христо Ботев“ №13, Лом.</span></div>
          <div class="info-priority-service"><strong>Работно време</strong><span>Понеделник–петък, 08:30–17:00.</span></div>
          <div class="info-priority-service"><strong>Преди посещение</strong><span>За конкретна услуга, договор, сметка или промяна по партида е разумно първо да потвърдите необходимите документи на 0700 10 010.</span></div>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Прекъсване за неплатена сметка</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Проверете фактурата и задълженията</strong><span>Електрохолд посочва, че при просрочие може да има временно прекъсване след уведомяване.</span></div>
          <div class="info-priority-service"><strong>За възстановяване</strong><span>Необходимо е да се уредят просрочените задължения и приложимата такса за възстановяване. При затруднение може да се заяви разсрочено плащане.</span></div>
          <a class="info-priority-action info-priority-action--external" href="https://electrohold.bg/bg/sales/chesto-zadavani-vprosi-elektro/" target="_blank" rel="noopener"><span>Прекъсване и възстановяване</span><small>Отвори сайт ↗</small></a>
        </div>
      </details>
      <div class="info-priority-trust">Последно проверено: 17 август 2026 г. · Електрохолд / ЕРМ Запад</div>`;
    return article;
  }

  function buildRevenueAgencyCard(entry) {
    const article = document.createElement("article");
    article.className = "info-priority-card info-priority-card--revenue";
    article.id = "institucii-nap";
    article.innerHTML = `
      <div class="info-priority-top">
        <div class="info-priority-icon">${revenueIcon()}</div>
        <div>
          <span class="info-priority-kicker">НАП · обслужване за област Монтана</span>
          <h3>НАП · за жители на Лом</h3>
          <p>В официалните контакти на НАП за област Монтана е публикуван офис в Монтана. За много услуги първо използвайте ПИК/електронните услуги или информационния център, за да не пътувате излишно.</p>
        </div>
      </div>
      <div class="info-priority-facts">
        <div><strong>📍 Офис Монтана: ул. „Любен Каравелов“ №11</strong></div>
        <div>🕒 Пон.–Пет. 09:00–17:30</div>
        <div>☎ Информационен център: 0700 18 700</div>
      </div>
      <div class="info-priority-actions">
        <a class="info-priority-action info-priority-action--primary" href="tel:070018700"><span>НАП · 0700 18 700</span><small>Директно</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://portal.nra.bg/" target="_blank" rel="noopener"><span>Електронни услуги · НАП</span><small>Отвори сайт ↗</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://nra.bg/wps/wcm/connect/nra.bg25863/agency/site/kontakti/Montana/Montana" target="_blank" rel="noopener"><span>Офис Монтана · контакти</span><small>Отвори сайт ↗</small></a>
      </div>
      <div class="info-priority-note"><strong>За Лом:</strong> в актуалните официални контакти на НАП не е публикуван отделен офис в Лом. Преди пътуване до Монтана проверете дали услугата може да се извърши онлайн.</div>

      <details class="info-priority-more">
        <summary>Първо провери дали може онлайн</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>ПИК / електронен портал</strong><span>Много справки и услуги за физически лица и фирми могат да се използват през електронния портал на НАП.</span></div>
          <div class="info-priority-service"><strong>Ако не знаете услугата</strong><span>Обадете се на 0700 18 700 и кажете точно какво искате да направите, преди да пътувате до Монтана.</span></div>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Кога се ходи в офис Монтана</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Адрес</strong><span>гр. Монтана, ул. „Любен Каравелов“ №11.</span></div>
          <div class="info-priority-service"><strong>Работно време</strong><span>Понеделник–петък, 09:00–17:30.</span></div>
          <div class="info-priority-service"><strong>Местен телефон</strong><span>096 390 212 е публикуван на официалната контактна страница на НАП за офиса в Монтана.</span></div>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Важно разграничение · местни данъци</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Данък имот, данък МПС, такса смет</strong><span>Това са местни данъци и такси и за Лом се обслужват от Община Лом, а не от НАП.</span></div>
          <div class="info-priority-service"><strong>НАП</strong><span>Обслужва държавни данъци, осигуровки, декларации и други приходни задължения по компетентност.</span></div>
        </div>
      </details>
      <div class="info-priority-trust">Последно проверено: 17 август 2026 г. · НАП</div>`;
    return article;
  }


  function postIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v12H3V6Z"/><path d="m4 7 8 6 8-6"/></svg>';
  }

  function healthInspectorateIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Z"/><path d="M12 8v6M9 11h6"/></svg>';
  }

  function foodSafetyIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4v7c0 2 1.2 3 3 3s3-1 3-3V4M7 4v17M14 4v8c0 1.5 1 2.5 2.5 2.5S19 13.5 19 12V4M16.5 14.5V21"/></svg>';
  }

  function consumerIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>';
  }

  function environmentIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4c-8 0-14 4-14 10 0 3.3 2.7 6 6 6 6 0 9-7 8-16Z"/><path d="M5 21c2-5 6-8 11-11"/></svg>';
  }

  function buildPostOfficeCard(entry) {
    const article = document.createElement("article");
    article.className = "info-priority-card info-priority-card--post";
    article.id = "institucii-poshta";
    article.innerHTML = `
      <div class="info-priority-top">
        <div class="info-priority-icon">${postIcon()}</div>
        <div>
          <span class="info-priority-kicker">Пощенски услуги · Лом</span>
          <h3>„Български пощи“ – Лом</h3>
          <p>Писма и колети, препоръчани пратки, парични преводи и други услуги в местните пощенски станции.</p>
        </div>
      </div>
      <div class="info-priority-facts">
        <div><strong>📍 Лом Ц 3600 · пл. „Свобода“ №2</strong></div>
        <div>📍 Лом 3601 / 3602 · ул. „Русенски лом“ №1</div>
        <div>☎ Национален контакт: *7678 / 02 962 50 50</div>
      </div>
      <div class="info-priority-actions">
        <a class="info-priority-action info-priority-action--primary" href="tel:*7678"><span>Български пощи · *7678</span><small>Директно</small></a>
        <a class="info-priority-action info-priority-action--secondary" href="tel:029625050"><span>02 962 50 50</span><small>Директно</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://www.bgpost.bg/" target="_blank" rel="noopener"><span>Официален сайт</span><small>Отвори сайт ↗</small></a>
      </div>

      <details class="info-priority-more">
        <summary>Коя поща в Лом</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Централна поща · 3600</strong><span>пл. „Свобода“ №2. Адресът е потвърден в официални документи на „Български пощи“.</span></div>
          <div class="info-priority-service"><strong>Други станции</strong><span>В текущите данни за Лом са посочени и пощенски станции 3601 и 3602 на ул. „Русенски лом“ №1.</span></div>
          <div class="info-priority-service"><strong>Работно време</strong><span>Не го показваме като фиксирано, защото не намерихме достатъчно надежден актуален официален график за всяка отделна станция. Преди специално посещение проверете по телефона.</span></div>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Пратка, писмо или колет</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Изпращане</strong><span>За писма, препоръчани пратки и колети започнете от удобната пощенска станция в Лом.</span></div>
          <div class="info-priority-service"><strong>Проследяване</strong><span>За пратки с номер използвайте официалната услуга за проследяване на „Български пощи“.</span></div>
          <a class="info-priority-action info-priority-action--external" href="https://www.bgpost.bg/parceltracking" target="_blank" rel="noopener"><span>Проследи пратка</span><small>Отвори сайт ↗</small></a>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>EMS / международна пратка</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>EMS контакт</strong><span>*6666 / 0700 19 666.</span></div>
          <div class="info-priority-service"><strong>Преди изпращане</strong><span>Проверете ограниченията, допустимото съдържание и цената според държавата и вида на пратката.</span></div>
        </div>
      </details>
      <div class="info-priority-trust">Последно проверено: 17 август 2026 г. · „Български пощи“</div>`;
    return article;
  }

  function buildHealthInspectorateCard(entry) {
    const article = document.createElement("article");
    article.className = "info-priority-card info-priority-card--rzi";
    article.id = "institucii-rzi";
    article.innerHTML = `
      <div class="info-priority-top">
        <div class="info-priority-icon">${healthInspectorateIcon()}</div>
        <div>
          <span class="info-priority-kicker">РЗИ Монтана · важни услуги за Лом</span>
          <h3>РЗИ Монтана · ТЕЛК и здравен контрол за Лом</h3>
          <p>В Лом няма постоянен офис на РЗИ, но има ТЕЛК към МБАЛ „Св. Николай Чудотворец“. За медицинската експертиза документите и справките минават през РКМЕ към РЗИ – Монтана.</p>
        </div>
      </div>
      <div class="info-priority-facts">
        <div><strong>📍 ТЕЛК Лом: ул. „Тодор Каблешков“ №2</strong></div>
        <div>☎ ТЕЛК 1211: 0971 60 051</div>
        <div>☎ РКМЕ Монтана: 096 38 83 19 / 096 39 17 12</div>
      </div>
      <div class="info-priority-actions">
        <a class="info-priority-action info-priority-action--primary" href="tel:097160051"><span>ТЕЛК Лом · 0971 60 051</span><small>Директно</small></a>
        <a class="info-priority-action info-priority-action--secondary" href="tel:096388319"><span>РКМЕ · 096 38 83 19</span><small>Директно</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://bg.rzi-montana.org/index.php/2020-07-15-18-39-38" target="_blank" rel="noopener"><span>ТЕЛК / РКМЕ · официално</span><small>Отвори сайт ↗</small></a>
      </div>

      <details class="info-priority-more">
        <summary>ТЕЛК Лом</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Комисия</strong><span>ТЕЛК 1211 към МБАЛ „Св. Николай Чудотворец“ – Лом.</span></div>
          <div class="info-priority-service"><strong>Адрес</strong><span>гр. Лом, ул. „Тодор Каблешков“ №2.</span></div>
          <div class="info-priority-service"><strong>Телефон</strong><span><a href="tel:097160051">0971 60 051</a>.</span></div>
          <div class="info-priority-service"><strong>Важно</strong><span>Не смесваме телефона на ТЕЛК с РКМЕ. РКМЕ е картотеката към РЗИ – Монтана и обслужва подаване/справки по медицинската експертиза.</span></div>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Документи и справка за медицинска експертиза</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>РКМЕ Монтана</strong><span>пл. „Жеравица“ №3, ет. 1, ст. 106. Работно време с граждани: 08:30–17:00 без прекъсване.</span></div>
          <div class="info-priority-service"><strong>Телефони 08:30–16:00</strong><span>096 38 83 19 и 096 39 17 12.</span></div>
          <div class="info-priority-service"><strong>Телефон 16:00–17:00</strong><span>096 38 83 14.</span></div>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Здравен сигнал или друг въпрос към РЗИ</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>РЗИ Монтана</strong><span>За здравен контрол и сигнали използвайте официалните контакти на инспекцията. В текущата база е потвърден телефон за сигнали 096 391 711.</span></div>
          <a class="info-priority-action info-priority-action--external" href="https://bg.rzi-montana.org/" target="_blank" rel="noopener"><span>РЗИ Монтана · официален сайт</span><small>Отвори сайт ↗</small></a>
        </div>
      </details>
      <div class="info-priority-trust">Последно проверено: 17 август 2026 г. · РЗИ Монтана</div>`;
    return article;
  }

  function buildFoodSafetyCard(entry) {
    const article = document.createElement("article");
    article.className = "info-priority-card info-priority-card--food-safety";
    article.id = "institucii-odbh";
    article.innerHTML = `
      <div class="info-priority-top">
        <div class="info-priority-icon">${foodSafetyIcon()}</div>
        <div>
          <span class="info-priority-kicker">БАБХ · област Монтана</span>
          <h3>ОДБХ Монтана · за Лом</h3>
          <p>Сигнали и административни въпроси за храни, животни, ветеринарен контрол и растителна защита. Няма постоянен офис ОДБХ в Лом.</p>
        </div>
      </div>
      <div class="info-priority-facts">
        <div><strong>📍 ул. „Юлиус Ирасек“ №4, Монтана</strong></div>
        <div>☎ ЦАО: 096 300 202</div>
        <div>☎ Горещ телефон БАБХ: 0700 122 99</div>
      </div>
      <div class="info-priority-actions">
        <a class="info-priority-action info-priority-action--primary" href="tel:070012299"><span>Сигнал · 0700 122 99</span><small>Директно</small></a>
        <a class="info-priority-action info-priority-action--secondary" href="tel:096300202"><span>ОДБХ Монтана · 096 300 202</span><small>Директно</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://bfsa.egov.bg/" target="_blank" rel="noopener"><span>БАБХ · официален сайт</span><small>Отвори сайт ↗</small></a>
      </div>

      <details class="info-priority-more">
        <summary>Кой телефон ми трябва</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Храни</strong><span>096 301 038.</span></div>
          <div class="info-priority-service"><strong>Животни / ветеринарен контрол</strong><span>096 300 204.</span></div>
          <div class="info-priority-service"><strong>Растителна защита</strong><span>096 305 411.</span></div>
          <div class="info-priority-service"><strong>Център за административно обслужване</strong><span>096 300 202.</span></div>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Сигнал за опасна храна или проблем с животно</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Горещ телефон</strong><span>0700 122 99 — БАБХ приема сигнали и предложения на националната линия.</span></div>
          <div class="info-priority-service"><strong>При спешен риск за хора/животни</strong><span>При непосредствена опасност използвайте и 112 според характера на случая.</span></div>
          <div class="info-priority-service"><strong>Електронно</strong><span>Сигнали и заявления могат да се подават и по официалните електронни канали на БАБХ.</span></div>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Преди да пътувам до Монтана</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>За Лом няма постоянен офис</strong><span>Първо се обадете на правилното направление и попитайте дали е необходимо посещение или може да подадете документ/сигнал дистанционно.</span></div>
        </div>
      </details>
      <div class="info-priority-trust">Последно проверено: 17 август 2026 г. · БАБХ / ОДБХ Монтана</div>`;
    return article;
  }

  function buildConsumerProtectionCard(entry) {
    const article = document.createElement("article");
    article.className = "info-priority-card info-priority-card--consumer";
    article.id = "institucii-kzp";
    article.innerHTML = `
      <div class="info-priority-top">
        <div class="info-priority-icon">${consumerIcon()}</div>
        <div>
          <span class="info-priority-kicker">Защита на потребителите</span>
          <h3>КЗП · за потребители от Лом</h3>
          <p>Жалби и сигнали срещу търговци, проблеми с покупки, услуги, гаранции и други потребителски права. Няма офис на КЗП в Лом.</p>
        </div>
      </div>
      <div class="info-priority-facts">
        <div><strong>📍 Регионален център: пл. „Жеравица“ №1, ет. 8, ст. 803, Монтана</strong></div>
        <div>☎ 096 300 586</div>
        <div>☎ Национален телефон: 0700 111 22</div>
      </div>
      <div class="info-priority-actions">
        <a class="info-priority-action info-priority-action--primary" href="tel:070011122"><span>КЗП · 0700 111 22</span><small>Директно</small></a>
        <a class="info-priority-action info-priority-action--secondary" href="tel:096300586"><span>Монтана · 096 300 586</span><small>Директно</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://kzp.bg/" target="_blank" rel="noopener"><span>КЗП · официален сайт</span><small>Отвори сайт ↗</small></a>
      </div>

      <details class="info-priority-more">
        <summary>Имам проблем с търговец</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Преди жалба</strong><span>Съберете касова бележка/фактура, договор, гаранция, кореспонденция и данни за търговеца. Това помага жалбата да бъде разгледана по конкретен случай.</span></div>
          <div class="info-priority-service"><strong>КЗП</strong><span>Подходяща е при нарушени потребителски права — например спор по покупка, услуга, рекламация, гаранция или нелоялна търговска практика.</span></div>
          <a class="info-priority-action info-priority-action--external" href="https://kzp.bg/bg/podavane-na-zhalba-signal" target="_blank" rel="noopener"><span>Подай жалба / сигнал</span><small>Отвори сайт ↗</small></a>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Искам да подам лично</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Регионален център Монтана</strong><span>пл. „Жеравица“ №1, ет. 8, стая 803.</span></div>
          <div class="info-priority-service"><strong>Телефон</strong><span>096 300 586.</span></div>
          <div class="info-priority-service"><strong>За Лом</strong><span>Преди пътуване проверете дали жалбата може да бъде подадена електронно.</span></div>
        </div>
      </details>
      <div class="info-priority-trust">Последно проверено: 17 август 2026 г. · Комисия за защита на потребителите</div>`;
    return article;
  }

  function buildEnvironmentInspectorateCard(entry) {
    const article = document.createElement("article");
    article.className = "info-priority-card info-priority-card--environment";
    article.id = "institucii-riosv";
    article.innerHTML = `
      <div class="info-priority-top">
        <div class="info-priority-icon">${environmentIcon()}</div>
        <div>
          <span class="info-priority-kicker">Околна среда · област Монтана</span>
          <h3>РИОСВ – Монтана · за Лом</h3>
          <p>Сигнали за замърсяване, отпадъци, вода, въздух, защитени зони и нарушения на екологичното законодателство. Няма постоянен офис в Лом.</p>
        </div>
      </div>
      <div class="info-priority-facts">
        <div><strong>📍 ул. „Юлиус Ирасек“ №4, ет. 3, Монтана</strong></div>
        <div>☎ Зелен телефон в работно време: 096 300 960</div>
        <div>🌙 Извън работно време: 0882 001 498</div>
      </div>
      <div class="info-priority-actions">
        <a class="info-priority-action info-priority-action--primary" href="tel:096300960"><span>Зелен телефон · 096 300 960</span><small>Директно</small></a>
        <a class="info-priority-action info-priority-action--danger" href="tel:0882001498"><span>Извън работно време · 0882 001 498</span><small>Сигнал</small></a>
        <a class="info-priority-action info-priority-action--external" href="https://www.riosv-montana.com/kontakti" target="_blank" rel="noopener"><span>Подай сигнал / контакти</span><small>Отвори сайт ↗</small></a>
      </div>

      <details class="info-priority-more">
        <summary>Какъв сигнал е за РИОСВ</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Замърсяване</strong><span>Сигнали за замърсяване на околната среда, нарушения на екологичното законодателство и аварийни ситуации.</span></div>
          <div class="info-priority-service"><strong>Води</strong><span>РИОСВ посочва, че при замърсяване на воден обект може да се сигнализира инспекцията и Басейнова дирекция „Дунавски район“.</span></div>
          <div class="info-priority-service"><strong>Отпадъци / въздух / защитени територии</strong><span>Инспекцията има отделни направления за отпадъци и почви, въздух, води, оценки и защитени зони.</span></div>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Кой телефон според случая</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>В работно време</strong><span>096 300 960.</span></div>
          <div class="info-priority-service"><strong>Извън работно време</strong><span>0882 001 498.</span></div>
          <div class="info-priority-service"><strong>Опазване на водите</strong><span>096 300 964.</span></div>
          <div class="info-priority-service"><strong>Отпадъци и почви</strong><span>096 300 965.</span></div>
          <div class="info-priority-service"><strong>Защитени зони / оценки</strong><span>096 300 963 / 096 300 964 според направлението.</span></div>
        </div>
      </details>

      <details class="info-priority-more">
        <summary>Преди да пътувам до Монтана</summary>
        <div class="info-priority-services">
          <div class="info-priority-service"><strong>Сигнал</strong><span>В повечето случаи започнете по телефон или електронната форма. Физическо посещение не е първата стъпка.</span></div>
          <div class="info-priority-service"><strong>Административна услуга</strong><span>РИОСВ публикува отделни услуги, срокове, такси и образци; проверете точната услуга преди подаване.</span></div>
        </div>
      </details>
      <div class="info-priority-trust">Последно проверено: 17 август 2026 г. · РИОСВ – Монтана</div>`;
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
    const fire = entries.find(e => e.category === "institucii" && e.subcategory === "pojarna");
    const employment = entries.find(e => e.category === "institucii" && e.subcategory === "byuro-truda");
    const rzok = entries.find(e => e.category === "institucii" && e.subcategory === "rzok");
    const court = entries.find(e => e.category === "institucii" && e.subcategory === "sud");
    const prosecution = entries.find(e => e.category === "institucii" && e.subcategory === "prokuratura");
    const propertyRegistry = entries.find(e => e.category === "institucii" && e.subcategory === "imoten-registur");
    const agriculture = entries.find(e => e.category === "institucii" && e.subcategory === "osz");
    const cadastre = entries.find(e => e.category === "institucii" && e.subcategory === "kadastur");
    const water = entries.find(e => e.category === "institucii" && e.subcategory === "vik");
    const electricity = entries.find(e => e.category === "institucii" && e.subcategory === "tok");
    const nap = entries.find(e => e.category === "institucii" && e.subcategory === "nap");
    const post = entries.find(e => e.category === "institucii" && e.subcategory === "poshta");
    const rzi = entries.find(e => e.category === "institucii" && e.subcategory === "rzi");
    const odbh = entries.find(e => e.category === "institucii" && e.subcategory === "odbh");
    const kzp = entries.find(e => e.category === "institucii" && e.subcategory === "kzp");
    const riosv = entries.find(e => e.category === "institucii" && e.subcategory === "riosv");
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
    const oldFire = document.getElementById("institucii-pojarna");
    const oldEmployment = document.getElementById("institucii-byuro-truda");
    const oldRzok = document.getElementById("institucii-rzok");
    const oldCourt = document.getElementById("institucii-sud");
    const oldProsecution = document.getElementById("institucii-prokuratura");
    const oldPropertyRegistry = document.getElementById("institucii-imoten-registur");
    const oldAgriculture = document.getElementById("institucii-osz");
    const oldCadastre = document.getElementById("institucii-kadastur");
    const oldWater = document.getElementById("institucii-vik");
    const oldElectricity = document.getElementById("institucii-tok");
    const oldNap = document.getElementById("institucii-nap");
    const oldPost = document.getElementById("institucii-poshta");
    const oldRzi = document.getElementById("institucii-rzi");
    const oldOdbh = document.getElementById("institucii-odbh");
    const oldKzp = document.getElementById("institucii-kzp");
    const oldRiosv = document.getElementById("institucii-riosv");

    directory.before(wrap);
    oldMunicipality?.remove();
    oldPolice?.remove();
    oldNoi?.remove();

    if (dsp) {
      const dspCard = buildSocialAssistanceCard(dsp.data || {}, dsp.confirmed_at, dsp.confirmed_source);
      wrap.appendChild(dspCard);
      oldDsp?.remove();
    }

    if (fire) {
      wrap.appendChild(buildFireServiceCard(fire));
      oldFire?.remove();
    }

    if (employment) {
      wrap.appendChild(buildEmploymentOfficeCard(employment));
      oldEmployment?.remove();
    }

    if (rzok) {
      wrap.appendChild(buildHealthInsuranceCard(rzok));
      oldRzok?.remove();
    }

    if (court) {
      wrap.appendChild(buildDistrictCourtCard(court));
      oldCourt?.remove();
    }

    if (prosecution) {
      wrap.appendChild(buildProsecutionCard(prosecution));
      oldProsecution?.remove();
    }

    if (propertyRegistry) {
      wrap.appendChild(buildPropertyRegistryCard(propertyRegistry));
      oldPropertyRegistry?.remove();
    }

    if (agriculture) {
      wrap.appendChild(buildAgricultureOfficeCard(agriculture));
      oldAgriculture?.remove();
    }

    if (cadastre) {
      wrap.appendChild(buildCadastreCard(cadastre));
      oldCadastre?.remove();
    }

    if (water) {
      wrap.appendChild(buildWaterUtilityInstitutionCard(water));
      oldWater?.remove();
    }

    if (electricity) {
      wrap.appendChild(buildElectricityCard(electricity));
      oldElectricity?.remove();
    }

    if (nap) {
      wrap.appendChild(buildRevenueAgencyCard(nap));
      oldNap?.remove();
    }

    if (post) {
      wrap.appendChild(buildPostOfficeCard(post));
      oldPost?.remove();
    }

    if (rzi) {
      wrap.appendChild(buildHealthInspectorateCard(rzi));
      oldRzi?.remove();
    }

    if (odbh) {
      wrap.appendChild(buildFoodSafetyCard(odbh));
      oldOdbh?.remove();
    }

    if (kzp) {
      wrap.appendChild(buildConsumerProtectionCard(kzp));
      oldKzp?.remove();
    }

    if (riosv) {
      wrap.appendChild(buildEnvironmentInspectorateCard(riosv));
      oldRiosv?.remove();
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
