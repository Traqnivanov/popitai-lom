(() => {
"use strict";

/*
  SINGLE OWNER:
  info-lom-transport-v1.js е единственият renderer на [data-info-transport-root].
  Старите info-lom.js / info-lom-canonical.js не се зареждат на тази страница.
*/

const esc = v => String(v ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const tel = v => `tel:${String(v).replace(/[^\d+]/g,"")}`;

const DATA = {
  bus: {
    title: "Автогара Лом",
    address: "ул. „Хан Аспарух“ №5, Лом",
    verified: "Потвърден адрес от официална публикация на Юнион Ивкони от 07.04.2026 г.",
    customerPhone: "0889 490 000",
    generalPhone: "02 989 0000",
    email: "support.bg@union-ivkoni.com",
    schedule: {
      source: "https://union-ivkoni.com/bg/news-53",
      lomToSofia: [
        {
          time: "06:50",
          route: "Лом → Сталийска махала → Расово → Монтана → Враца → Ботевград → София",
          note: "В София: Автогара Подуяне → Централна автогара"
        },
        {
          time: "16:00",
          route: "Лом → Вълчедръм → Монтана → Враца → Ботевград → София"
        }
      ],
      sofiaToLom: [
        {
          time: "07:00",
          route: "София → Ботевград → Враца → Монтана → Вълчедръм → Лом"
        },
        {
          time: "16:30",
          route: "София → Ботевград → Враца → Монтана → Расово → Сталийска махала → Лом"
        }
      ]
    },
    website: "https://union-ivkoni.com/bg/"
  },
  rail: {
    title: "ЖП гара Лом",
    address: "ул. „Пристанищна“ №43, Лом",
    phone: "0887 398 610",
    hours: "04:00–21:15",
    note: "Информация и продажба на билети на гарата.",
    timetable: "https://razpisanie.bdz.bg/bg",
    live: "https://live.bdz.bg/bg",
    stations: "https://www.bdz.bg/bg/a/gari"
  },
  taxis: [
    {
      name: "Експрес такси – Лом",
      phone: "0897 200 838",
      area: "Лом и района",
      note: "Публикуваме само текущия потвърден местен номер. Не добавяме непроверени таксита от каталози."
    }
  ]
};

function icon(kind){
  const icons = {
    bus:`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="15" rx="3"/><path d="M7.5 18v2M16.5 18v2M7.5 7h9M8 14h.01M16 14h.01"/></svg>`,
    rail:`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="3" width="12" height="14" rx="3"/><path d="M8 7h8M9 13h.01M15 13h.01M8 21l3-4M16 21l-3-4"/></svg>`,
    taxi:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 11l2-5h10l2 5M4 11h16v6H4zM7 17v2M17 17v2M8 14h.01M16 14h.01M9 6V4h6v2"/></svg>`
  };
  return icons[kind];
}

function action(href,label,step,primary=false){
  return `<a class="transport-action${primary?' transport-action--primary':''}" href="${esc(href)}"${href.startsWith("http")?' target="_blank" rel="noopener"':''}>
    <span>${esc(label)}</span><small>${esc(step)}</small>
  </a>`;
}

function busSection(){
  const b=DATA.bus;
  return `<section class="transport-section" id="transport-avtobusi">
    <div class="transport-section-head">
      <div><span class="transport-section-icon">${icon("bus")}</span><h2>Автогара и автобуси</h2></div>
      <span class="transport-status">Проверено</span>
    </div>

    <article class="transport-feature transport-feature--bus">
      <div class="transport-feature-title">
        <span class="transport-type">АВТОГАРА</span>
        <h3>${esc(b.title)}</h3>
        <p>${esc(b.address)}</p>
      </div>

      <div class="transport-schedule">
        <div class="transport-schedule-head">
          <div>
            <span class="transport-route-label">Актуално разписание</span>
            <strong>Лом ↔ София</strong>
          </div>
          <span class="transport-schedule-note">Провери отново преди пътуване</span>
        </div>

        <div class="transport-direction">
          <h4>Лом → София</h4>
          ${b.schedule.lomToSofia.map(x=>`<div class="transport-trip">
            <div class="transport-trip-time">${esc(x.time)}</div>
            <div class="transport-trip-main">
              <strong>${esc(x.route)}</strong>
              ${x.note?`<span>${esc(x.note)}</span>`:""}
            </div>
          </div>`).join("")}
        </div>

        <div class="transport-direction">
          <h4>София → Лом</h4>
          ${b.schedule.sofiaToLom.map(x=>`<div class="transport-trip">
            <div class="transport-trip-time">${esc(x.time)}</div>
            <div class="transport-trip-main">
              <strong>${esc(x.route)}</strong>
            </div>
          </div>`).join("")}
        </div>
      </div>

      <div class="transport-info-grid">
        <div><span>Билети</span><strong>Каса на Автогара Лом</strong></div>
        <div><span>Информация за пътуване</span><strong>${esc(b.customerPhone)}</strong></div>
        <div><span>Централен телефон</span><strong>${esc(b.generalPhone)}</strong></div>
        <div><span>E-mail</span><strong>${esc(b.email)}</strong></div>
      </div>

      <div class="transport-actions">
        ${action(tel(b.customerPhone),"Информация за пътуване","Директно",true)}
        ${action(b.schedule.source,"Линия Лом → София","Директно")}
        ${action(b.website,"Търси друго пътуване","1 стъпка")}
      </div>

      <div class="transport-trust">${esc(b.verified)} Разписанията могат да се променят — преди пътуване провери отново.</div>
    </article>
  </section>`;
}

function railSection(){
  const r=DATA.rail;
  return `<section class="transport-section" id="transport-bdz">
    <div class="transport-section-head">
      <div><span class="transport-section-icon">${icon("rail")}</span><h2>ЖП / БДЖ</h2></div>
      <span class="transport-status">Официално</span>
    </div>

    <article class="transport-feature transport-feature--rail">
      <div class="transport-feature-title">
        <span class="transport-type">ЖП ГАРА</span>
        <h3>${esc(r.title)}</h3>
        <p>${esc(r.address)}</p>
      </div>

      <div class="transport-rail-main">
        <div class="transport-big-contact">
          <span>Информация и билети на гарата</span>
          <a href="${esc(tel(r.phone))}">${esc(r.phone)}</a>
          <small>${esc(r.hours)}</small>
        </div>
        <div class="transport-rail-note">${esc(r.note)}</div>
      </div>

      <div class="transport-actions transport-actions--3">
        ${action(tel(r.phone),"Обади се на гара Лом","Директно",true)}
        ${action(r.timetable,"Провери разписание","1 стъпка")}
        ${action(r.live,"Виж движението на влаковете","1 стъпка")}
      </div>

      <div class="transport-trust">Телефонът и работното време са потвърдени в официалния списък на БДЖ. Адресът е потвърден в актуален документ на БДЖ за гара Лом.</div>
    </article>
  </section>`;
}

function taxiSection(){
  return `<section class="transport-section" id="transport-taksita">
    <div class="transport-section-head">
      <div><span class="transport-section-icon">${icon("taxi")}</span><h2>Таксита</h2></div>
      <span class="transport-status transport-status--local">Местен контакт</span>
    </div>

    <div class="transport-taxi-grid">
      ${DATA.taxis.map(t=>`<article class="transport-taxi-card">
        <span class="transport-type">ТАКСИ</span>
        <h3>${esc(t.name)}</h3>
        <p>${esc(t.area)}</p>
        <a class="transport-taxi-phone" href="${esc(tel(t.phone))}">${esc(t.phone)}</a>
        <div class="transport-actions">
          ${action(tel(t.phone),"Обади се","Директно",true)}
        </div>
        <div class="transport-trust">${esc(t.note)}</div>
      </article>`).join("")}
    </div>
  </section>`;
}

function render(){
  const root=document.querySelector("[data-info-transport-root]");
  if(!root) return;
  root.innerHTML = `<div class="transport-quick">
    <a href="#transport-avtobusi"><span>${icon("bus")}</span><strong>Автобус</strong><small>Автогара и линии</small></a>
    <a href="#transport-bdz"><span>${icon("rail")}</span><strong>Влак</strong><small>Разписание и гара</small></a>
    <a href="#transport-taksita"><span>${icon("taxi")}</span><strong>Такси</strong><small>Директен номер</small></a>
  </div>${busSection()}${railSection()}${taxiSection()}`;
}

function modalSetup(){
  const modal=document.getElementById("transport-modal");
  document.querySelector("[data-transport-signal]")?.addEventListener("click",()=>{if(modal) modal.hidden=false;});
  document.querySelectorAll("[data-transport-modal-close]").forEach(el=>el.addEventListener("click",()=>{if(modal) modal.hidden=true;}));
}

document.addEventListener("DOMContentLoaded",()=>{render();modalSetup();},{once:true});
})();