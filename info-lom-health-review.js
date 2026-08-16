(function () {
  'use strict';

  function q(sel, root=document){ return root.querySelector(sel); }
  function qa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  function splitPhones(text){
    if(!text) return [];
    return String(text)
      .split(/\s*\/\s*|\s*,\s*|\s*;\s*/)
      .map(x => x.trim())
      .filter(Boolean);
  }

  function cleanTel(phone){
    return phone.replace(/[^\d+]/g,'');
  }

  function enhancePetyaYonova(){
    qa('.info-card, .info-health-card, article, section').forEach(card => {
      const txt = card.textContent || '';
      if(!/Петя Йонова/i.test(txt)) return;

      const phoneLinks = qa('a[href^="tel:"]', card);
      phoneLinks.forEach(link => {
        const label = (link.textContent || '').trim();
        const phones = splitPhones(label);
        if(phones.length < 2) return;

        const wrap = document.createElement('div');
        wrap.className = 'health-review-phone-row';

        phones.forEach(p => {
          const a = document.createElement('a');
          a.className = link.className || 'info-phone';
          a.href = 'tel:' + cleanTel(p);
          a.textContent = '☎ ' + p;
          wrap.appendChild(a);
        });

        link.replaceWith(wrap);
      });
    });
  }

  function enhanceRamus(){
    qa('.info-card, .info-health-card, article, section').forEach(card => {
      const txt = card.textContent || '';
      if(!/РАМУС|RAMUS/i.test(txt)) return;
      if(/Дунавска\s*22/i.test(txt) && /0877\s*546\s*388/i.test(txt)) return;

      const target = q('.info-card-body, .info-health-card-body, .info-card-main', card) || card;
      const block = document.createElement('div');
      block.className = 'health-review-ramus';
      block.innerHTML = `
        <div class="health-review-meta">📍 ул. Дунавска 22, Лом</div>
        <a class="health-review-call" href="tel:0877546388">☎ 0877 546 388</a>
      `;

      const official = qa('a', target).find(a => /официална страница|официален сайт/i.test(a.textContent || ''));
      if(official && official.parentNode) {
        official.parentNode.insertBefore(block, official);
      } else {
        target.appendChild(block);
      }
    });
  }



  function buildHealthFinder(){
    if(q('.health-finder')) return;

    const hero = q('.info-page-hero');
    const tools = q('.info-page-tools');
    if(!hero || !tools) return;

    const finder = document.createElement('section');
    finder.className = 'health-finder';
    finder.setAttribute('aria-label','Бърз избор в раздел Здраве');
    finder.innerHTML = `
      <div class="health-finder-inner">
        <div class="health-finder-head">
          <span>БЪРЗ ДОСТЪП</span>
          <h2>Какво търсите?</h2>
          <p>Изберете и отидете директно до нужната информация.</p>
        </div>

        <div class="health-finder-grid">
          <a class="health-finder-item health-finder-item--hospital" href="#zdrave-bolnica">
            <span class="health-finder-icon" aria-hidden="true">🏥</span>
            <span class="health-finder-copy"><strong>Болница</strong><small>Прием · контакти · отделения</small></span>
            <span class="health-finder-arrow" aria-hidden="true">›</span>
          </a>

          <a class="health-finder-item health-finder-item--doctor" href="#zdrave-lekari">
            <span class="health-finder-icon" aria-hidden="true">👨‍⚕️</span>
            <span class="health-finder-copy"><strong>Лекар</strong><small>Име · специалност · НЗОК</small></span>
            <span class="health-finder-arrow" aria-hidden="true">›</span>
          </a>

          <a class="health-finder-item health-finder-item--pharmacy" href="#zdrave-apteki">
            <span class="health-finder-icon" aria-hidden="true">💊</span>
            <span class="health-finder-copy"><strong>Аптека</strong><small>Адрес · телефон · НЗОК</small></span>
            <span class="health-finder-arrow" aria-hidden="true">›</span>
          </a>

          <a class="health-finder-item health-finder-item--dentist" href="#zdrave-stomatolozi">
            <span class="health-finder-icon" aria-hidden="true">🦷</span>
            <span class="health-finder-copy"><strong>Стоматолог</strong><small>Зъболекари · контакти</small></span>
            <span class="health-finder-arrow" aria-hidden="true">›</span>
          </a>

          <a class="health-finder-item health-finder-item--vet" href="#zdrave-veterinari">
            <span class="health-finder-icon" aria-hidden="true">🐾</span>
            <span class="health-finder-copy"><strong>Ветеринар</strong><small>Кабинети · телефони</small></span>
            <span class="health-finder-arrow" aria-hidden="true">›</span>
          </a>

          <a class="health-finder-item health-finder-item--lab" href="#zdrave-laboratorii">
            <span class="health-finder-icon" aria-hidden="true">🧪</span>
            <span class="health-finder-copy"><strong>Лаборатория</strong><small>Изследвания · манипулации</small></span>
            <span class="health-finder-arrow" aria-hidden="true">›</span>
          </a>
        </div>

        <a class="health-finder-minor" href="#zdrave-vet-apteki">
          <span>Ветеринарни аптеки</span><span aria-hidden="true">→</span>
        </a>
      </div>
    `;
    hero.insertAdjacentElement('afterend', finder);
  }

  function frameHealthSections(){
    const config = {
      'zdrave-bolnica': ['БОЛНИЦА','Прием · контакти · отделения','🏥'],
      'zdrave-lekari': ['ЛЕКАРИ','Търсене по име и специалност','👨‍⚕️'],
      'zdrave-apteki': ['АПТЕКИ','Адреси · телефони · НЗОК','💊'],
      'zdrave-stomatolozi': ['СТОМАТОЛОЗИ','Зъболекари · контакти · НЗОК','🦷'],
      'zdrave-veterinari': ['ВЕТЕРИНАРИ','Кабинети · телефони · услуги','🐾'],
      'zdrave-vet-apteki': ['ВЕТЕРИНАРНИ АПТЕКИ','Потвърдени обекти и контакти','🐾'],
      'zdrave-laboratorii': ['ЛАБОРАТОРИИ И ДИАГНОСТИКА','Изследвания · манипулации · контакти','🧪']
    };

    Object.entries(config).forEach(([id, meta]) => {
      const section = document.getElementById(id);
      if(!section || section.classList.contains('health-section-shell')) return;

      section.classList.add('health-section-shell', `health-section-shell--${id.replace('zdrave-','')}`);

      const currentTitle = q('.info-subsection-title', section);
      if(currentTitle){
        currentTitle.classList.add('health-section-title');
        const h = q('h2,h3,h4', currentTitle);
        if(h){
          h.innerHTML = `<span class="health-section-title-icon" aria-hidden="true">${meta[2]}</span><span>${h.textContent}</span>`;
        }
        if(!q('.health-section-kicker', currentTitle)){
          const info = document.createElement('div');
          info.className = 'health-section-kicker';
          info.innerHTML = `<strong>${meta[0]}</strong><span>${meta[1]}</span>`;
          currentTitle.prepend(info);
        }
      }

      const filter = q('.info-local-filter', section);
      if(filter && !filter.closest('.health-search-box')){
        const box = document.createElement('div');
        box.className = 'health-search-box';
        const label = document.createElement('label');
        label.textContent = id === 'zdrave-stomatolozi' ? 'Намерете стоматолог' :
                            id === 'zdrave-apteki' ? 'Намерете аптека' :
                            id === 'zdrave-lekari' ? 'Намерете лекар' :
                            id === 'zdrave-veterinari' ? 'Намерете ветеринар' :
                            'Търсене в този раздел';
        label.appendChild(filter.cloneNode(true));
        box.appendChild(label);
        filter.replaceWith(box);
        const input = q('input', box);
        // restore filter behaviour after cloning
        input?.addEventListener('input',()=>{
          const grid = box.nextElementSibling;
          if(!grid) return;
          const needle=input.value.trim().toLowerCase();
          [...grid.children].forEach(card=>card.hidden=!!needle&&!card.textContent.toLowerCase().includes(needle));
        });
      }
    });
  }

  function polishHealthNavigation(){
    const nav = q('.info-page-subnav');
    if(nav && !nav.closest('.health-sticky-nav')){
      const wrap = document.createElement('div');
      wrap.className = 'health-sticky-nav';
      nav.parentNode.insertBefore(wrap, nav);
      wrap.appendChild(nav);
    }
  }

  function prioritizeHospitalContacts(){
    const cards = qa('.info-health-main-card, .info-health-entity, .info-card, article');
    const card = cards.find(el => /МБАЛ Св\.\s*Николай Чудотворец/i.test(el.textContent || ''));
    if(!card) return;

    const registry = qa('a,button', card).find(el => /Регистратура\s*0971\s*60\s*061/i.test(el.textContent || ''));
    const central = qa('a,button', card).find(el => /Централа\s*0971\s*60\s*051/i.test(el.textContent || ''));
    if(!registry || !central || !registry.parentElement || registry.parentElement !== central.parentElement) return;

    const parent = registry.parentElement;
    if(parent.firstElementChild !== registry){
      parent.insertBefore(registry, central);
    }
  }

  function addHospitalAdmission(){
    if(q('.health-review-admission')) return;

    const headings = qa('h2,h3,h4');
    const unitsHeading = headings.find(h => /Отделения и звена към МБАЛ/i.test(h.textContent || ''));
    if(!unitsHeading || !unitsHeading.parentElement) return;

    const block = document.createElement('section');
    block.className = 'health-review-admission';
    block.setAttribute('aria-label', 'Прием в болницата');
    block.innerHTML = `
      <div class="health-review-admission-topline">
        <div>
          <span class="health-review-admission-kicker">ВАЖНО ЗА ПАЦИЕНТИ</span>
          <h3>Прием в болницата</h3>
        </div>
        <a class="health-review-admission-call" href="tel:097160061">☎ 0971 60 061</a>
      </div>

      <div class="health-review-admission-quick">
        <div class="is-urgent"><strong>Спешни болни</strong><span>Прием денонощно</span></div>
        <div><strong>Първо посещение</strong><span>Приемно-консултативен блок / Регистратура</span></div>
        <div><strong>Хоспитализация</strong><span>С направление от ЦСМП, личен лекар, специалист или друга болница; възможен е и личен избор.</span></div>
      </div>

      <details class="health-review-admission-details">
        <summary>Подробности за приема</summary>
        <div class="health-review-admission-details-body">
          <p><strong>Постъпване:</strong> с направление за хоспитализация от Центъра за спешна медицинска помощ, личен лекар, специалист от диагностично-консултативен или медицински център, от друга болница или по личен избор.</p>
          <p><strong>При първо посещение:</strong> пациентът се насочва към Приемно-консултативния блок с Регистратура, където получава пълна информация за хоспитализацията.</p>
          <p><strong>Спешни случаи:</strong> болницата приема денонощно спешно болни.</p>
          <p><strong>НЗОК:</strong> болницата има договор с Националната здравноосигурителна каса.</p>
          <a class="health-review-admission-official"
             href="https://www.mballom.bg/%D0%9F%D0%BE%D0%BB%D0%B5%D0%B7%D0%BD%D0%BE/%D0%9F%D0%BE%D0%BB%D0%B5%D0%B7%D0%BD%D0%B0-%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8F-%D0%BF%D1%80%D0%B8-%D0%BF%D1%80%D0%B8%D0%B5%D0%BC/p20"
             target="_blank" rel="noopener">Официална информация за приема</a>
        </div>
      </details>
    `;

    unitsHeading.parentElement.insertBefore(block, unitsHeading);
  }

  function collapseHospitalUnits(){
    qa('h2,h3,h4').forEach(h => {
      if(!/Отделения и звена към МБАЛ/i.test(h.textContent || '')) return;
      if(q('.health-review-priority-units', h.parentElement || document)) return;

      const container = h.parentElement;
      if(!container) return;

      const list = h.nextElementSibling;
      if(!list || !list.children || !list.children.length) return;

      const items = Array.from(list.children);
      const pick = (pattern) => items.find(el => pattern.test(el.textContent || ''));

      // Priority is based on broad patient relevance + verified 24h diagnostic/admission activity
      // on the official hospital pages. Intensive care is critical clinically, but is not usually
      // a first-navigation destination for a patient/relative.
      const wanted = [
        pick(/вътрешни болести/i),
        pick(/(?:^|\s)хирургия(?:\s|$)/i),
        pick(/педиатрия/i)
      ].filter(Boolean);

      const priority = Array.from(new Set(wanted));
      for (const item of items) {
        if(priority.length >= 3) break;
        if(!priority.includes(item)) priority.push(item);
      }

      const remaining = items.filter(item => !priority.includes(item));

      const section = document.createElement('div');
      section.className = 'health-review-priority-units';

      const title = document.createElement('div');
      title.className = 'health-review-priority-units-title';
      title.innerHTML = `<h3>Ключови отделения</h3><span>3 видими</span>`;
      section.appendChild(title);

      const visible = document.createElement('div');
      visible.className = 'health-review-priority-units-list';
      priority.forEach(item => visible.appendChild(item));
      section.appendChild(visible);

      if(remaining.length){
        const details = document.createElement('details');
        details.className = 'health-review-units';

        const summary = document.createElement('summary');
        summary.innerHTML = `<span>Виж всички отделения и звена</span><strong>+${remaining.length}</strong>`;
        details.appendChild(summary);

        const restList = list.cloneNode(false);
        remaining.forEach(item => restList.appendChild(item));
        details.appendChild(restList);
        section.appendChild(details);
      }

      h.replaceWith(section);
      list.remove();
    });
  }


  function enhanceOtherMedicalCenters(){
    const title = qa('h3,h4').find(h => /Други лечебни заведения/i.test(h.textContent || ''));
    if(!title || q('.health-other-frame')) return;
    const oldGrid = title.nextElementSibling;
    if(!oldGrid) return;

    const frame = document.createElement('section');
    frame.className = 'health-other-frame';
    frame.innerHTML = `
      <div class="health-other-frame-head">
        <span>ИЗВЪНБОЛНИЧНА ПОМОЩ В ЛОМ</span>
        <h3>Други лечебни заведения</h3>
        <p>Най-полезното отпред, подробностите при разгъване.</p>
      </div>
      <div class="health-other-list">

        <article class="health-center-card health-center-card--priority health-center-card--dkc">
          <div class="health-center-top">
            <div>
              <span class="health-center-type">ДИАГНОСТИЧНО-КОНСУЛТАТИВЕН ЦЕНТЪР</span>
              <h4>ДКЦ 1 – Лом</h4>
            </div>
          </div>

          <div class="health-center-essentials">
            <div>📍 <span>ул. „Тодор Каблешков“ №2</span></div>
            <div>📞 <a href="tel:+35997166152">0971 66 152</a></div>
            <div>🏥 <span>Общинско лечебно заведение</span></div>
          </div>

          <div class="health-center-highlight">
            <strong>ЛКК 2025:</strong>
            <span>Обща · АГ · нервни болести · хирургия</span>
          </div>

          <div class="dkc-front">
            <div class="dkc-front-title">Актуална услуга</div>
            <div class="dkc-service-feature">
              <strong>Солна стая / халотерапия</strong>
              <span>Записване: <a href="tel:+35997166152">0971 66 152</a></span>
            </div>
          </div>

          <details class="health-center-more">
            <summary>ЛКК и услуги</summary>
            <div class="dkc-detail-body">
              <div class="dkc-lkk-grid">
                <span>Обща ЛКК</span>
                <span>АГ ЛКК</span>
                <span>ЛКК по нервни болести</span>
                <span>Хирургична ЛКК</span>
              </div>
              <p class="dkc-simple-note">За информация и записване: <a href="tel:+35997166152">0971 66 152</a>.</p>
            </div>
          </details>

          <details class="health-center-more">
            <summary>Източници и регистрация</summary>
            <div class="dkc-detail-body dkc-source-compact">
              <p><strong>ЕИК:</strong> 130053522</p>
              <p>Източници: Община Лом, РЗИ – Монтана и публичната страница на ДКЦ 1.</p>
            </div>
          </details>
        </article>

        <article class="health-center-card health-center-card--hipokrat">
          <div class="health-center-top">
            <div>
              <span class="health-center-type">МЕДИЦИНСКИ ЦЕНТЪР</span>
              <h4>МЦ „Хипократ 53“</h4>
            </div>
            <span class="health-center-status">потвърдено</span>
          </div>

          <div class="health-center-essentials">
            <div>📍 <span>ул. „Петър Берковски“ №3</span></div>
            <div>🏥 <span>Специализирана извънболнична медицинска помощ</span></div>
            <div>📞 <a href="tel:+35997166911">0971 66 911*</a></div>
          </div>

          <div class="health-center-highlight">
            <strong>ЛКК 2025:</strong><span>Обща ЛКК</span>
          </div>

          <div class="hipokrat-front">
            <div class="hipokrat-front-title">Основни направления</div>
            <div class="hipokrat-chips" aria-label="Основни медицински направления">
              <span>Детски болести</span>
              <span>Вътрешни болести</span>
              <span>Кардиология</span>
              <span>Ендокринология</span>
              <span>Хирургия</span>
              <span>АГ</span>
            </div>

            <div class="hipokrat-front-title hipokrat-front-title--secondary">Диагностика и възстановяване</div>
            <div class="hipokrat-diagnostics">
              <span>Клинична лаборатория</span>
              <span>Образна диагностика</span>
              <span>Физиотерапия и рехабилитация</span>
            </div>
          </div>

          <details class="health-center-more hipokrat-doctors">
            <summary>Лични лекари / ОПЛ</summary>
            <div class="hipokrat-detail-body">
              <div class="hipokrat-doctor-list">
                <div><strong>д-р Любомил Йонков Петров</strong><span>общопрактикуващ лекар</span></div>
                <div><strong>д-р Людмил Иванов Опров</strong><span>общопрактикуващ лекар</span></div>
                <div><strong>д-р Людмила Христова Георгиева</strong><span>общопрактикуващ лекар</span></div>
              </div>
              <p class="hipokrat-contact-note">📞 Общ контакт на практиката: <a href="tel:+35997166911">0971 66 911*</a></p>
            </div>
          </details>

          <details class="health-center-more hipokrat-services">
            <summary>Виж всички кабинети и дейности</summary>
            <div class="hipokrat-detail-body">
              <div class="hipokrat-service-grid">
                <span>Детски болести</span>
                <span>Вътрешни болести</span>
                <span>Обща хирургия</span>
                <span>Акушерство и гинекология</span>
                <span>Урология</span>
                <span>Пулмология</span>
                <span>Ендокринология</span>
                <span>Кардиология</span>
                <span>Неврология</span>
                <span>УНГ</span>
                <span>Очни болести</span>
                <span>Кожни болести</span>
                <span>Гастроентерология</span>
                <span>Ортопедия и травматология</span>
                <span>Инфекциозни болести</span>
                <span>Психиатрична помощ</span>
                <span>Клинична лаборатория</span>
                <span>Образна диагностика / рентгенология</span>
                <span>Физиотерапия и рехабилитация</span>
                <span>Анестезиология и реанимация</span>
              </div>
            </div>
          </details>

          <details class="health-center-more hipokrat-sources">
            <summary>Източници и регистрация</summary>
            <div class="hipokrat-detail-body hipokrat-source-compact">
              <p><strong>Рег. №:</strong> 1224131001</p>
              <p>Източници: РЗИ – Монтана, НЗОК и регистърни данни.</p>
              <p class="hipokrat-star-note"><strong>*</strong> Телефонът е от вторични/по-стари медицински източници.</p>
            </div>
          </details>
        </article>

        <article class="health-center-card health-center-card--zdrave">
          <div class="health-center-top">
            <div>
              <span class="health-center-type">МЕДИЦИНСКИ ЦЕНТЪР</span>
              <h4>МЦ „Здраве“ – Лом</h4>
            </div>
          </div>

          <div class="health-center-essentials">
            <div>📍 <span>ул. „Панайот Волов“ №6</span></div>
            <div>🏥 <span>Специализирана извънболнична медицинска помощ</span></div>
          </div>

          <div class="zdrave-front">
            <div class="zdrave-front-title">Специалисти</div>

            <div class="zdrave-doctor">
              <div>
                <span>Кардиология</span>
                <strong>д-р Николай Жиков</strong>
              </div>
              <a href="tel:+359888130572">📞 0888 130 572</a>
            </div>

            <div class="zdrave-doctor">
              <div>
                <span>Ендокринология</span>
                <strong>д-р Милена Евтимова</strong>
              </div>
              <a href="tel:+359887399990">📞 0887 399 990</a>
            </div>
          </div>

          <details class="health-center-more">
            <summary>Направления и дейности</summary>
            <div class="zdrave-detail-body">
              <div class="zdrave-service-grid">
                <span>Кардиология</span>
                <span>Ендокринология</span>
                <span>Диагностика</span>
                <span>Лечение и наблюдение</span>
                <span>Профилактика</span>
                <span>Насочване за консултативна и болнична помощ</span>
              </div>
            </div>
          </details>

          <details class="health-center-more">
            <summary>Източници и регистрация</summary>
            <div class="zdrave-detail-body zdrave-source-compact">
              <p><strong>Рег. №:</strong> 1224131004</p>
              <p>Източници: РЗИ – Монтана и НЗОК/регистърни данни.</p>
            </div>
          </details>
        </article>

      </div>`;
    title.replaceWith(frame);
    oldGrid.remove();

    const hospitalSection = frame.closest('#zdrave-bolnica');
    if(hospitalSection){
      hospitalSection.insertAdjacentElement('afterend', frame);
    }
  }


  function splitHospitalAndOtherCenters(){
    const hospital = document.getElementById('zdrave-bolnica');
    if(!hospital || hospital.dataset.splitCenters === 'true') return;

    let other = q('.health-other-frame', hospital);
    if(other){
      qa('.health-center-card, .info-card', other).forEach(card => {
        if(/МБАЛ\s+Св\.\s*Николай\s+Чудотворец/i.test(card.textContent || '')) card.remove();
      });
      hospital.insertAdjacentElement('afterend', other);
      other.classList.add('health-other-frame--separate');
      hospital.dataset.splitCenters = 'true';
      return;
    }

    const title = qa('.info-group-title,h3,h4', hospital)
      .find(el => /Други лечебни заведения/i.test(el.textContent || ''));
    if(!title) return;

    const grid = title.nextElementSibling;
    if(!grid) return;

    qa('.info-card,article', grid).forEach(card => {
      if(/МБАЛ\s+Св\.\s*Николай\s+Чудотворец/i.test(card.textContent || '')) card.remove();
    });

    const section = document.createElement('section');
    section.className = 'health-other-frame health-other-frame--separate';
    section.setAttribute('aria-label','Други лечебни заведения');

    const head = document.createElement('div');
    head.className = 'health-other-frame-head';
    head.innerHTML = `
      <span>ИЗВЪНБОЛНИЧНА ПОМОЩ В ЛОМ</span>
      <h3>Други лечебни заведения</h3>
      <p>ДКЦ и медицински центрове — отделно от МБАЛ.</p>
    `;
    section.appendChild(head);

    const body = document.createElement('div');
    body.className = 'health-other-original-grid';
    body.appendChild(grid);
    section.appendChild(body);

    title.remove();
    hospital.insertAdjacentElement('afterend', section);
    hospital.dataset.splitCenters = 'true';
  }


  function finalizeHealthArchitecture(){
    const body = document.body;
    if(!body || body.dataset.healthArchitecture === 'v16') return;
    body.dataset.healthArchitecture = 'v16';
    body.classList.add('health-final-architecture');

    const root = document.querySelector('[data-info-category-root="zdrave"]');
    if(!root) return;

    /* Keep only the page hero as the "Здраве" owner. Remove/hide duplicated generic title blocks. */
    document.querySelectorAll('.info-page-title,.info-category-title,.info-section-hero').forEach(el=>{
      const txt=(el.textContent||'').trim().toLowerCase();
      if(txt==='здраве' || txt.startsWith('здраве ')) el.classList.add('health-duplicate-heading');
    });

    /* A single mobile-first entry point directly after the hero. */
    let finder = document.querySelector('.health-entry-final');
    if(!finder){
      finder=document.createElement('nav');
      finder.className='health-entry-final';
      finder.setAttribute('aria-label','Бърз достъп до здравна информация');
      finder.innerHTML=`
        <div class="health-entry-final-head">
          <span>БЪРЗ ДОСТЪП</span>
          <h2>Какво търсите?</h2>
        </div>
        <div class="health-entry-final-grid">
          <a href="#zdrave-bolnica" data-health-jump="zdrave-bolnica"><strong>Болница</strong><small>Прием · контакти · отделения</small></a>
          <a href="#zdrave-lekari" data-health-jump="zdrave-lekari"><strong>Лекар</strong><small>Име · специалност · НЗОК</small></a>
          <a href="#zdrave-apteki" data-health-jump="zdrave-apteki"><strong>Аптека</strong><small>Адрес · телефон · НЗОК</small></a>
          <a href="#zdrave-stomatolozi" data-health-jump="zdrave-stomatolozi"><strong>Стоматолог</strong><small>Контакти · НЗОК · БЗС</small></a>
          <a href="#zdrave-veterinari" data-health-jump="zdrave-veterinari"><strong>Ветеринар</strong><small>Кабинети · телефони</small></a>
          <a href="#zdrave-laboratorii" data-health-jump="zdrave-laboratorii"><strong>Лаборатория</strong><small>Изследвания · диагностика</small></a>
        </div>
        <a class="health-entry-final-minor" href="#zdrave-vet-apteki">Ветеринарни аптеки →</a>
      `;

      const hero = document.querySelector('.info-hero,.info-page-hero,.page-hero,header.hero');
      const rootParent = root.parentElement;
      if(hero && hero.parentElement) hero.insertAdjacentElement('afterend',finder);
      else if(rootParent) rootParent.insertBefore(finder,root);
    }

    /* Remove older duplicate quick-access widgets if present. */
    document.querySelectorAll('.health-finder,.health-quick-access,.health-entry-point').forEach(el=>{
      if(el!==finder) el.remove();
    });

    /* Give every main section a stable role. */
    const labels={
      'zdrave-bolnica':['БОЛНИЦА','Болница','Прием, контакти, отделения и лечебни заведения'],
      'zdrave-lekari':['ЛЕКАРИ','Лекари','Лични лекари и специалисти'],
      'zdrave-apteki':['АПТЕКИ','Аптеки','Адреси, телефони и НЗОК'],
      'zdrave-stomatolozi':['СТОМАТОЛОЗИ','Стоматолози','Зъболекари и контакти'],
      'zdrave-veterinari':['ВЕТЕРИНАРИ','Ветеринари','Кабинети и контакти'],
      'zdrave-vet-apteki':['ВЕТЕРИНАРНИ АПТЕКИ','Ветеринарни аптеки','Потвърдени обекти и контакти'],
      'zdrave-laboratorii':['ЛАБОРАТОРИИ','Лаборатории и диагностика','Изследвания и манипулации']
    };

    Object.entries(labels).forEach(([id,[eyebrow,title,desc]])=>{
      const sec=document.getElementById(id);
      if(!sec) return;
      sec.classList.add('health-main-section','health-main-section--final');
      let head=sec.querySelector(':scope > .health-main-final-head');
      if(!head){
        head=document.createElement('div');
        head.className='health-main-final-head';
        head.innerHTML=`<span>${eyebrow}</span><h2>${title}</h2><p>${desc}</p>`;
        sec.insertBefore(head,sec.firstChild);
      }
      /* Hide generic duplicated generated headings inside the same section. */
      sec.querySelectorAll(':scope > .info-subsection-title,:scope > .health-section-head').forEach(x=>x.classList.add('health-generated-heading-hidden'));
    });

    /* "Other medical facilities" must remain a separate peer after Hospital. */
    const hospital=document.getElementById('zdrave-bolnica');
    const other=document.querySelector('.health-other-frame--separate,.health-other-frame');
    if(hospital && other && other.parentElement===hospital){
      hospital.insertAdjacentElement('afterend',other);
    }
    if(other){
      other.classList.add('health-other-final');
      const oldHead=other.querySelector('.health-other-frame-head');
      if(oldHead){
        oldHead.innerHTML=`
          <span>ДРУГИ ЛЕЧЕБНИ ЗАВЕДЕНИЯ</span>
          <h2>Медицински центрове в Лом</h2>
          <p>Всеки център е отделно лечебно заведение.</p>
        `;
      }
    }

    /* Secondary horizontal navigation remains, but visually secondary. */
    document.querySelectorAll('.info-subnav,.info-anchor-nav,.health-subnav').forEach(nav=>nav.classList.add('health-secondary-nav'));

    /* Smooth but exact in-page jumps. */
    document.querySelectorAll('[data-health-jump]').forEach(a=>{
      if(a.dataset.wired==='1') return;
      a.dataset.wired='1';
      a.addEventListener('click',ev=>{
        const id=a.getAttribute('href')?.slice(1);
        const target=id && document.getElementById(id);
        if(target){
          ev.preventDefault();
          target.scrollIntoView({behavior:'smooth',block:'start'});
          history.replaceState(null,'',`#${id}`);
        }
      });
    });
  }


  function finalizeHealthNavigationV17(){
    const root=document.querySelector('[data-info-category-root="zdrave"]');
    if(!root) return;

    document.body.dataset.healthNavigation='v17';

    /* Keep ONE quick-access block only */
    const blocks=[
      ...document.querySelectorAll('.health-entry-final,.health-finder,.health-quick-access,.health-entry-point')
    ];

    let primary=document.querySelector('.health-entry-final');

    if(!primary){
      primary=document.createElement('nav');
      primary.className='health-entry-final health-entry-final--v17';
      primary.setAttribute('aria-label','Бърз достъп до здравна информация');
      primary.innerHTML=`
        <div class="health-entry-final-head">
          <span>БЪРЗ ДОСТЪП</span>
          <h2>Какво търсите?</h2>
        </div>
        <div class="health-entry-final-grid">
          <a href="#zdrave-bolnica" data-health-jump="zdrave-bolnica"><strong>Болница</strong><small>Прием · контакти · отделения</small></a>
          <a href="#zdrave-lekari" data-health-jump="zdrave-lekari"><strong>Лекар</strong><small>Име · специалност · НЗОК</small></a>
          <a href="#zdrave-apteki" data-health-jump="zdrave-apteki"><strong>Аптека</strong><small>Адрес · телефон · НЗОК</small></a>
          <a href="#zdrave-stomatolozi" data-health-jump="zdrave-stomatolozi"><strong>Стоматолог</strong><small>Контакти · НЗОК · БЗС</small></a>
          <a href="#zdrave-veterinari" data-health-jump="zdrave-veterinari"><strong>Ветеринар</strong><small>Кабинети · телефони</small></a>
          <a href="#zdrave-laboratorii" data-health-jump="zdrave-laboratorii"><strong>Лаборатория</strong><small>Изследвания · диагностика</small></a>
        </div>
        <a class="health-entry-final-minor" href="#zdrave-vet-apteki">Ветеринарни аптеки →</a>
      `;
      const anchor=document.querySelector('.info-subnav,.info-anchor-nav,.health-subnav');
      if(anchor?.parentElement) anchor.parentElement.insertBefore(primary,anchor);
      else root.parentElement?.insertBefore(primary,root);
    }

    document.querySelectorAll('.health-finder,.health-quick-access,.health-entry-point').forEach(el=>{
      if(el!==primary) el.remove();
    });

    /* If duplicate V16 quick-access accidentally exists twice, keep first only */
    const finals=[...document.querySelectorAll('.health-entry-final')];
    finals.slice(1).forEach(el=>el.remove());

    /* Secondary horizontal nav: useful only after entry */
    document.querySelectorAll('.info-subnav,.info-anchor-nav,.health-subnav').forEach(nav=>{
      nav.classList.add('health-secondary-nav','health-secondary-nav--v17');
      nav.querySelectorAll('a[href^="#"]').forEach(a=>{
        const id=a.getAttribute('href')?.slice(1);
        if(id && document.getElementById(id)) a.dataset.healthDirect='1';
      });
    });

    /* Direct jumps */
    document.querySelectorAll('[data-health-jump],[data-health-direct="1"]').forEach(a=>{
      if(a.dataset.v17wired==='1') return;
      a.dataset.v17wired='1';
      a.addEventListener('click',ev=>{
        const href=a.getAttribute('href')||'';
        if(!href.startsWith('#')) return;
        const target=document.getElementById(href.slice(1));
        if(!target) return;
        ev.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
        history.replaceState(null,'',href);
      });
    });

    /* Shared task shortcut if present */
    document.querySelectorAll('a,button').forEach(el=>{
      const t=(el.textContent||'').trim().toLowerCase();
      if(t.includes('спешна медицинска информация')){
        if(el.tagName==='A'){
          el.setAttribute('href','zdrave.html#zdrave-bolnica');
        }else{
          el.dataset.healthEmergency='1';
          if(el.dataset.v17emergency!=='1'){
            el.dataset.v17emergency='1';
            el.addEventListener('click',()=>{ location.href='zdrave.html#zdrave-bolnica'; });
          }
        }
      }
    });

    /* If page opened with an anchor, land directly after render */
    if(location.hash){
      const target=document.getElementById(location.hash.slice(1));
      if(target && !document.body.dataset.healthInitialJump){
        document.body.dataset.healthInitialJump='1';
        setTimeout(()=>target.scrollIntoView({behavior:'auto',block:'start'}),80);
      }
    }
  }

  function markSecondaryPhones(){
    qa('.info-card, .info-health-card, article').forEach(card => {
      const txt = card.textContent || '';
      const confirmed = /Вторичен телефон|Вторичен източник/i.test(txt);
      if(!confirmed) return;

      qa('a[href^="tel:"]', card).forEach(a => {
        if(!/\*$/.test((a.textContent || '').trim())) {
          a.textContent = (a.textContent || '').trim() + ' *';
        }
      });

      if(!q('.health-review-secondary-note', card)){
        const note = document.createElement('div');
        note.className = 'health-review-secondary-note';
        note.textContent = '* Телефон от вторичен източник';
        const footer = q('.info-card-confirmed, .info-card-footer, .info-health-confirmed', card);
        if(footer && footer.parentNode) footer.parentNode.insertBefore(note, footer);
        else card.appendChild(note);
      }
    });
  }

  function markConflicts(){
    qa('.info-card, .info-health-card, article').forEach(card => {
      const txt = card.textContent || '';
      if(!/разминаване|конфликт/i.test(txt)) return;
      card.classList.add('health-review-conflict');
    });
  }

  function removeDuplicateSectionSignals(){
    qa('.info-section-wrap section, [data-info-category-root] section').forEach(section => {
      // Keep the global bottom signal block.
      if(section.classList.contains('info-bottom-signal')) return;
      qa('button,a', section).forEach(el => {
        if(/Сигнализирай за грешка/i.test(el.textContent || '')) {
          const row = el.closest('.info-section-actions, .info-actions, .info-card-actions, .info-add-row');
          if(row){
            // Remove only the signal control, preserve "Добави..."
            el.remove();
            if(row.children.length === 0) row.remove();
          } else {
            el.remove();
          }
        }
      });
    });
  }

  function run(){
    finalizeHealthNavigationV17();
    finalizeHealthArchitecture();
    buildHealthFinder();
    polishHealthNavigation();
    prioritizeHospitalContacts();
    addHospitalAdmission();
    collapseHospitalUnits();
    enhanceOtherMedicalCenters();
    enhancePetyaYonova();
    enhanceRamus();
    markSecondaryPhones();
    markConflicts();
    frameHealthSections();
    splitHospitalAndOtherCenters();
    removeDuplicateSectionSignals();
  }

  document.addEventListener('DOMContentLoaded', () => {
    run();
    let rounds = 0;
    const timer = setInterval(() => {
      run();
      rounds++;
      if(rounds > 12) clearInterval(timer);
    }, 500);
  });
})();
