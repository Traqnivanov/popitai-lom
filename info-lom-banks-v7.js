(() => {
  "use strict";

  const offices = [
    {bank:"УниКредит Булбанк",address:'ул. „Дунавска“ №14, Лом',hours:'Пон.–Пет. 08:30–17:00',phone:'0971 68 762',url:'https://www.unicreditbulbank.bg/',status:'strong'},
    {bank:"Банка ДСК",address:'ул. „Панайот Волов“ №1, Лом',hours:'Пон.–Пет. 08:30–17:00',phone:'0700 10 375',url:'https://dskbank.bg/',status:'strong'},
    {bank:"Пощенска банка",address:'ул. „Дунавска“ №18, Лом',hours:'Пон.–Пет. 08:30–17:00',phone:'0971 68 410',url:'https://www.postbank.bg/Contacts/Network',status:'official',note:'Дигитална зона 24/7 и ATM с депозитна функция.'},
    {bank:"ЦКБ",address:'ул. „Дунавска“ №18, Лом',hours:'Пон.–Пет. 08:30–12:30 и 13:30–17:00',phone:'0971 60 219',url:'https://www.ccbank.bg/bg/klonova-mreja',status:'official'},
    {bank:"ОББ",address:'ул. „Славянска“ №38, Лом',hours:'Пон.–Пет. 08:30–17:00',phone:'0700 11 717',url:'https://ubb.bg/offices',status:'strong'}
  ];

  const networks = [
    {key:'ubb',name:'ОББ',url:'https://ubb.bg/offices',items:[
      {address:'ул. „Славянска“ №38',place:'клон ОББ',devices:2},
      {address:'ул. „Хан Аспарух“ №13',place:'T MARKET / супермаркет',devices:2},
      {address:'ул. „Дунавска“ №65',place:'магазин „Дилема“',devices:1}
    ]},
    {key:'unicredit',name:'УниКредит Булбанк',url:'https://www.unicreditbulbank.bg/',items:[
      {address:'ул. „Дунавска“ №14',place:'до банковия офис',devices:1,always:true},
      {address:'ул. „Добруджа“ №21А',place:'кв. Младеново / супермаркет',devices:1,always:true},
      {address:'ул. „Крум Пастърмаджиев“ №7',place:'търговски обект',devices:1,always:true},
      {address:'ул. „Трети март“ №2А',place:'търговски обект',devices:1}
    ]},
    {key:'dsk',name:'Банка ДСК',url:'https://dskbank.bg/',items:[
      {address:'ул. „Панайот Волов“ №1',place:'до банковия офис',devices:1,always:true},
      {address:'ул. „Георги Манафски“ №17',place:'външен банкомат',devices:1,always:true},
      {address:'ул. „Каблешков“ №2',place:'района на МБАЛ / медицински център',devices:1,always:true}
    ]},
    {key:'postbank',name:'Пощенска банка',url:'https://www.postbank.bg/Contacts/Network',items:[
      {address:'ул. „Дунавска“ №18',place:'дигитална зона към клона',devices:1,always:true,deposit:true,official:true}
    ]},
    {key:'iab',name:'Интернешънъл Асет Банк',url:'https://www.iabank.bg/',items:[
      {address:'ул. „Славянска“ №13',place:'финансова институция',devices:1}
    ]},
    {key:'ccb',name:'ЦКБ',url:'https://www.ccbank.bg/bg/klonova-mreja',items:[
      {address:'ул. „Дунавска“ №18',place:'до офис ЦКБ',devices:1}
    ]}
  ];

  const atms = networks.flatMap(n => n.items.map((item, index) => ({
    ...item,
    bank: n.name,
    bankKey: n.key,
    bankUrl: n.url,
    id: `${n.key}-${index + 1}`
  })));

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const tel = value => `tel:${String(value || '').replace(/[^+\d]/g,'')}`;

  function bankTheme(name){
    const n = String(name || '').toLowerCase();
    if (n.includes('обб')) return 'ubb';
    if (n.includes('дск')) return 'dsk';
    if (n.includes('уникредит')) return 'unicredit';
    if (n.includes('пощенска')) return 'postbank';
    if (n.includes('цкб')) return 'ccb';
    if (n.includes('интернешънъл асет')) return 'iab';
    return 'neutral';
  }

  function deviceText(n){
    return n === 1 ? "1 банкомат на адреса" : `${n} банкомата на адреса`;
  }

  function atmCard(a){
    const icon = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4" width="17" height="16" rx="2"/><path d="M7 8h10M8 13h8M8 16h5"/></svg>';
    return `<article class="bank-v5-card bank-v5-card--atm bank-v6-theme--${esc(bankTheme(a.bank))}" data-bank-key="${esc(a.bankKey)}">
      <div class="bank-v5-card-top">
        <div class="bank-v5-kind">
          <span class="bank-v5-kind-icon">${icon}</span>
          <span><small>БАНКОМАТ</small><strong>${esc(a.bank)}</strong></span>
        </div>
        ${a.devices > 1 ? `<span class="bank-v5-count">${esc(deviceText(a.devices))}</span>` : '<span class="bank-v5-count">1 устройство</span>'}
      </div>
      <div class="bank-v5-address">
        <span class="bank-v5-pin" aria-hidden="true">⌖</span>
        <h3>${esc(a.address)}</h3>
      </div>
      <p class="bank-v5-place">${esc(a.place)}</p>
      <div class="bank-v5-tags">
        ${a.always ? '<span>24/7</span>' : ''}
        ${a.deposit ? '<span class="bank-v5-tag--good">Внасяне</span>' : ''}
        ${a.official ? '<span class="bank-v5-tag--good">Официално</span>' : ''}
      </div>
      <a class="bank-v5-link" href="${esc(a.bankUrl)}" target="_blank" rel="noopener">
        <span>Провери при банката</span><strong aria-hidden="true">↗</strong>
      </a>
    </article>`;
  }

  function officeCard(o){
    const icon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h18M5 9v9m4-9v9m6-9v9m4-9v9M3 20h18M12 3l9 5H3l9-5Z"/></svg>';
    return `<article class="bank-v5-card bank-v5-card--office bank-v6-theme--${esc(bankTheme(o.bank))}">
      <div class="bank-v5-card-top">
        <div class="bank-v5-kind">
          <span class="bank-v5-kind-icon">${icon}</span>
          <span><small>БАНКОВ ОФИС</small><strong>${esc(o.bank)}</strong></span>
        </div>
        <span class="bank-v5-count">${o.status === 'official' ? 'Официално' : 'Потвърдено'}</span>
      </div>
      <div class="bank-v5-address">
        <span class="bank-v5-pin" aria-hidden="true">⌖</span>
        <h3>${esc(o.address)}</h3>
      </div>
      <div class="bank-v5-office-meta">
        <span>🕒 ${esc(o.hours)}</span>
        <span>☎ ${esc(o.phone)}</span>
      </div>
      ${o.note ? `<div class="bank-v5-note">${esc(o.note)}</div>` : ''}
      <div class="bank-v5-actions">
        <a class="bank-v5-call" href="${esc(tel(o.phone))}">Обади се</a>
        <a class="bank-v5-link" href="${esc(o.url)}" target="_blank" rel="noopener">
          <span>Официална страница</span><strong aria-hidden="true">↗</strong>
        </a>
      </div>
    </article>`;
  }

  function markup(){
    const networkChips = networks.map(n => {
      const devices = n.items.reduce((sum, x) => sum + x.devices, 0);
      return `<button type="button" data-bank-filter="${esc(n.key)}"><span>${esc(n.name)}</span><b>${devices}</b></button>`;
    }).join('');

    return `<div class="bank-v5-shell" data-bank-v6>
      <section class="bank-v5-panel" id="banki-bankomati" data-bank-v6-panel="atms">
        <div class="bank-v5-hero">
          <div class="bank-v5-hero-copy">
            <span class="bank-v5-eyebrow">БЪРЗО НАМИРАНЕ</span>
            <h2>Банкомати в Лом</h2>
            <p>Адресът е водещ. Банката е показана ясно като собственик на устройството.</p>
          </div>
          <div class="bank-v5-statline">
            <div><strong>15</strong><span>банкомата</span></div><i></i>
            <div><strong>13</strong><span>адреса</span></div><i></i>
            <div><strong>6</strong><span>банки</span></div>
          </div>
        </div>
        <div class="bank-v5-filterbar">
          <span>Филтър</span>
          <div class="bank-v5-filters">
            <button class="active" type="button" data-bank-filter="all"><span>Всички</span><b>15</b></button>
            ${networkChips}
          </div>
        </div>
        <div class="bank-v5-grid">${atms.map(atmCard).join('')}</div>
        <div class="bank-v5-trust"><span>✓</span><p><strong>Само проверими данни.</strong> Ако 24/7 или внасяне не са надеждно потвърдени, не ги отбелязваме.</p></div>
        <div class="info-actions-row">
          <button class="info-btn info-btn--add" type="button" onclick="window.InfoLom?.openSubmission('banki','bankomati','atm')">＋ Добави банкомат</button>
          <button class="info-btn info-btn--signal" type="button" onclick="window.InfoLom?.openSignal('banki')">⚠ Сигнализирай за грешка</button>
        </div>
      </section>
      <section class="bank-v5-panel" id="banki-ofisi" data-bank-v6-panel="offices" hidden>
        <div class="bank-v5-hero bank-v5-hero--office">
          <div class="bank-v5-hero-copy">
            <span class="bank-v5-eyebrow">ОБСЛУЖВАНЕ НА ГИШЕ</span>
            <h2>Банкови офиси в Лом</h2>
            <p>Тук са само офисите. Банкоматите са отделно, за да няма смесване.</p>
          </div>
          <div class="bank-v5-statline bank-v5-statline--single"><div><strong>5</strong><span>офиса</span></div></div>
        </div>
        <div class="bank-v5-grid">${offices.map(officeCard).join('')}</div>
        <div class="info-actions-row">
          <button class="info-btn info-btn--signal" type="button" onclick="window.InfoLom?.openSignal('banki')">⚠ Сигнализирай за грешка</button>
        </div>
      </section>
    </div>`;
  }

  function showPanel(root, type, updateHash=true){
    const panel = root.querySelector(`[data-bank-v6-panel="${type}"]`);
    if (!panel) return;
    root.querySelectorAll('[data-bank-v6-panel]').forEach(p => p.hidden = p !== panel);
    document.querySelectorAll('.info-page-subnav a').forEach(a => {
      const active = (type === 'atms' && a.getAttribute('href') === '#banki-bankomati') ||
                     (type === 'offices' && a.getAttribute('href') === '#banki-ofisi');
      a.classList.toggle('active', active);
      if (active) a.setAttribute('aria-current','page');
      else a.removeAttribute('aria-current');
    });
    if (updateHash) history.replaceState(null, '', type === 'atms' ? '#banki-bankomati' : '#banki-ofisi');
    window.scrollTo({top: Math.max(0, root.getBoundingClientRect().top + window.scrollY - 118), behavior:'smooth'});
  }

  function bind(root){
    document.querySelectorAll('.info-page-subnav a[href="#banki-bankomati"], .info-page-subnav a[href="#banki-ofisi"]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        showPanel(root, a.getAttribute('href') === '#banki-ofisi' ? 'offices' : 'atms');
      });
    });
    root.querySelectorAll('[data-bank-filter]').forEach(btn => btn.addEventListener('click', () => {
      const key = btn.dataset.bankFilter;
      root.querySelectorAll('[data-bank-filter]').forEach(b => b.classList.toggle('active', b === btn));
      root.querySelectorAll('[data-bank-key]').forEach(card => {
        card.hidden = key !== 'all' && card.dataset.bankKey !== key;
      });
    }));
  }

  function init(){
    if (document.body?.dataset.infoCategoryPage !== "banki") return;
    const root = document.querySelector('[data-info-banks-root]');
    if (!root) return;
    root.innerHTML = markup();
    bind(root);
    showPanel(root, location.hash === '#banki-ofisi' ? 'offices' : 'atms', false);
  }

  window.addEventListener("DOMContentLoaded", init, {once:true});
})();
