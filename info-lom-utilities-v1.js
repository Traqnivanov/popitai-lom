(()=>{
"use strict";

/*
  SINGLE OWNER — Комунални и ежедневни услуги
  Единствено този файл рендерира [data-info-utilities-root].
  Запазва съществуващите CSS класове и визуалния дизайн.
*/

const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const tel=v=>`tel:${String(v||"").replace(/[^+\d]/g,"")}`;
const fmt=v=>v?new Date(v).toLocaleDateString("bg-BG",{day:"numeric",month:"long",year:"numeric"}):"";
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function client(){for(let i=0;i<80;i++){if(window.PopitaiSupabase)return window.PopitaiSupabase;await sleep(100)}return null}
function badge(s){return `<span class="info-path-badge">${esc(s)}</span>`}
function action(href,label,kind="primary",step="Директно",external=true){
  if(!href)return"";
  return `<a class="info-service-action info-service-action--${esc(kind)}" href="${esc(href)}"${external&&!href.startsWith("tel:")?' target="_blank" rel="noopener"':""}><span>${esc(label)}</span>${badge(step)}</a>`;
}

const OVERRIDES = {
  bulkyWaste: "https://lom.bg/section-232-content.html",
  cleanlinessInfo: "https://lom.bg/section-108-content.html",
  cleanlinessSignals: "https://lom.bg/section-387-content.html",
  boxnowTrack: "https://boxnow.bg/track"
};

function actionMap(actions){return Object.fromEntries((actions||[]).map(a=>[a.action_key,a]))}

function renderUtilities(am){
  const water = `<article class="info-service-panel info-service-panel--water" id="komunalni-vik">
    <div class="info-service-main"><div class="info-service-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8S5.5 10 5.5 15a6.5 6.5 0 0 0 13 0C18.5 10 12 2.8 12 2.8Z"/><path d="M9 15.3a3.2 3.2 0 0 0 3 2.2"/></svg></div><div><h3>Вода и ВиК в Лом</h3><p>Аварии, спиране на водата и денонощен телефон</p></div></div>
    <div class="info-service-highlight"><strong>Аварии 24/7</strong><span>0700 20 272 · опция 1</span></div>
    <div class="info-service-actions">${action(am.water_outages?.target,"Виж аварии и спирания","primary","1 стъпка")}${action(am.water_emergency_call?.target||"tel:070020272","Обади се за авария","secondary","Директно",false)}</div>
    ${am.water_contacts?`<a class="info-service-mini" href="${esc(am.water_contacts.target)}" target="_blank" rel="noopener">Всички контакти на ВиК Монтана</a>`:""}
    <div class="info-card-note"><strong>Самоотчет за Лом по Viber:</strong> 0889 129 789</div>
    <div class="info-enhance-trust">Официален източник: ВиК Монтана</div>
  </article>`;

  const power = `<article class="info-service-panel info-service-panel--power" id="komunalni-tok">
    <div class="info-service-main"><div class="info-service-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13.5 2-7 11h5L10.5 22l7-12h-5L13.5 2Z"/></svg></div><div><h3>Електроенергия в Лом</h3><p>Прекъсвания, денонощна линия и център в Лом</p></div></div>
    <div class="info-service-highlight"><strong>Център Лом</strong><span>ул. „Христо Ботев“ №13 · Пон.–Пет. 08:30–17:00</span></div>
    <div class="info-service-actions">${action(am.power_outages?.target||"https://info.ermzapad.bg/webint/vok/avplan.php","Провери прекъсване","primary","1 стъпка")}${action(am.power_info_call?.target||"tel:070010010","Обади се на Електрохолд","secondary","Директно",false)}</div>
    ${am.power_contacts?`<a class="info-service-mini" href="${esc(am.power_contacts.target)}" target="_blank" rel="noopener">Контакти и центрове на Електрохолд</a>`:""}
    <div class="info-enhance-trust">Официални източници: ЕРМ Запад / Електрохолд</div>
  </article>`;

  return `<div class="info-utility-grid">${water}${power}</div>`;
}

function norm(v){
  v=String(v||"").toLowerCase();
  if(v.includes("econt")||v.includes("еконт"))return"Еконт";
  if(v.includes("speedy")||v.includes("спиди"))return"Спиди";
  if(v.includes("box now")||v.includes("boxnow"))return"BOX NOW";
  if(v.includes("sameday")||v.includes("easybox"))return"Sameday";
  return String(v);
}

function courierSection(entries,am){
  const by={}; entries.forEach(e=>{const p=norm(e.data?.provider||e.name.split("—")[0]);(by[p]??=[]).push(e)});
  const cfg={
    "Еконт":{theme:"econt",logo:"assets/brands/econt.webp",actions:[["econt_track","Проследи пратка","Директно","primary"],["econt_offices","Всички офиси","1 стъпка","soft"]]},
    "Спиди":{theme:"speedy",actions:[["speedy_track","Проследи пратка","Директно","primary"],["speedy_offices","Всички офиси","1 стъпка","soft"]]},
    "BOX NOW":{theme:"boxnow",actions:[["boxnow_track","Проследи пратка","Директно","primary",OVERRIDES.boxnowTrack],["boxnow_locator","Намери автомат","1 стъпка","soft"]]},
    "Sameday":{theme:"sameday",actions:[]}
  };
  const order=["Еконт","Спиди","BOX NOW","Sameday"];
  const provider=p=>{
    const meta=cfg[p],arr=[...(by[p]||[])];
    if(p==="Спиди")arr.sort((a,b)=>(a.entry_type==="courier_office"?0:1)-(b.entry_type==="courier_office"?0:1));
    const co=arr.filter(e=>e.entry_type==="courier_office").length,cl=arr.filter(e=>e.entry_type==="locker").length;
    const count=[co&&`${co} ${co===1?"офис":"офиса"}`,cl&&`${cl} ${cl===1?"автомат":"автомата"}`].filter(Boolean).join(" + ");
    return `<article class="info-courier info-courier--${meta.theme}"><div class="info-courier-head"><div class="info-courier-title">${meta.logo?`<img src="${meta.logo}" alt="${esc(p)}" width="72" height="28" loading="lazy" decoding="async">`:""}<h3>${esc(p)}</h3></div><span>${esc(count)}</span></div>${meta.actions.length?`<div class="info-courier-actions">${meta.actions.map(([key,label,step,kind,override])=>action(override||am[key]?.target,label,kind,step,true)).join("")}</div>`:""}<div class="info-courier-locations">${arr.map(e=>{const d=e.data||{},locker=e.entry_type==="locker";return `<div class="info-courier-row${p==="Спиди"&&locker?" info-courier-row--locker":""}">${p==="Спиди"&&locker?"<small>Автомат 24/7</small>":""}<strong>${esc(e.name.replace(/^.*?—\s*/,""))}</strong>${d.address?`<span>${esc(d.address)}</span>`:""}${d.working_hours?`<span>${esc(d.working_hours)}</span>`:d.available_24_7?"<span>24/7</span>":""}${d.phone?`<a href="${esc(tel(d.phone))}">☎ ${esc(d.phone)} ${badge("Директно")}</a>`:""}</div>`}).join("")}</div></article>`;
  };
  return `<section class="info-subsection info-subsection--canonical" id="komunalni-kurieri"><div class="info-subsection-title"><h3>Куриерски услуги в Лом</h3><span class="info-section-count">${entries.length}</span></div><p class="info-courier-lead">Проследяване, офиси и автомати в Лом — с видим път до външните действия.</p><input class="info-local-filter info-courier-filter" type="search" placeholder="Търси фирма, офис или адрес…"><div class="info-courier-list">${order.filter(p=>by[p]?.length).map(provider).join("")}</div><div class="info-courier-post"><strong>Български пощи</strong><a href="institucii.html#institucii-poshta">Виж записа в „Институции“ →</a></div><div class="info-actions-row"><button class="info-btn info-btn--add" type="button" onclick="window.InfoLom?.openSubmission('komunalni','kurieri','courier_point')">＋ Добави куриерска точка</button></div></section>`;
}


const PAY_POINTS = [
  {operator:"EasyPay",address:'ул. „Дунавска“ №22',kind:"partner",hours:"Пон.–Пет. 08:30–12:00 и 13:00–18:00; Съб. 09:00–13:00"},
  {operator:"EasyPay",address:'ул. „Александър Стамболийски“ №4',kind:"partner",hours:"Пон.–Пет. 09:00–18:00; Съб. 09:00–13:00"},
  {operator:"EasyPay",address:'ул. „Дунавска“ №18',kind:"partner",hours:"Пон.–Пет. 08:30–17:00"},
  {operator:"EasyPay",address:'ул. „Цар Симеон“ №31',kind:"partner",hours:"Пон.–Пет. 08:30–13:00 и 13:30–18:00; Съб.–Нед. 09:00–14:00"},
  {operator:"EasyPay",address:'кв. Младеново, ул. „Софийска“ №56',kind:"partner",hours:"Пон.–Пет. 08:00–18:00; Съб. 08:00–12:00"},
  {operator:"EasyPay",address:'ул. „Хан Аспарух“ №13, T Market',kind:"own",hours:"Пон.–Съб. 08:00–20:00; Нед. 08:00–17:00",note:"Почивки: 12:00–12:30 и 15:00–15:30; в неделя 12:00–12:30."},
  {operator:"EasyPay",address:'кв. Садовете, ТЦ СБА',kind:"partner",hours:"Пон.–Пет. 08:30–16:30"},
  {operator:"EasyPay",address:'ул. „Славянска“ №92, офис 1',kind:"partner",hours:"Пон.–Пет. 09:00–18:00; Съб. 09:00–14:00"},
  {operator:"EasyPay",address:'ул. „Пристанищна“ №13, офис 3',kind:"partner",hours:"Пон.–Пет. 09:00–13:00 и 14:00–18:00; Съб. 09:00–13:00"},
  {operator:"EasyPay",address:'ул. „Цар Петър“ №1',kind:"partner",hours:"Пон.–Пет. 08:30–18:00; Съб.–Нед. 09:00–13:00"},
  {operator:"EasyPay",address:'ул. „Пристанищна“ №60',kind:"partner",hours:"Пон.–Нед. 08:00–20:00"},
  {operator:"EasyPay",address:'ул. „Дунавска“ №37',kind:"partner",hours:"Пон.–Пет. 08:30–17:30; Съб. 09:00–13:00"},
  {operator:"EasyPay",address:'ул. „Славянска“ №52, Център',kind:"partner",hours:"Вт.–Пет. 10:00–14:00 и 15:00–22:00; Съб.–Нед. 10:00–22:00"},
  {operator:"Български пощи",address:'пл. „Свобода“ №2',kind:"other",hours:"Пон.–Пет. 08:00–17:30 — непотвърдено"},
  {operator:"Български пощи",address:'ул. „Русенски лом“ №1',kind:"other",hours:"Пон.–Пет. 08:00–17:30 — непотвърдено"},
  {operator:"Банка ДСК",address:'ул. „Панайот Волов“ №1',kind:"bank",hours:"Пон.–Пет. 08:30–17:00",note:"За конкретното плащане проверете условията на доставчика."},
  {operator:"УниКредит Булбанк",address:'ул. „Дунавска“ №14',kind:"bank",hours:"Пон.–Пет. 08:30–17:00",note:"За конкретното плащане проверете условията на доставчика."}
];

function paymentSection(){
  const easy = PAY_POINTS.filter(p=>p.operator==="EasyPay");
  const post = PAY_POINTS.filter(p=>p.operator==="Български пощи");
  const banks = PAY_POINTS.filter(p=>p.kind==="bank");

  const locationRows = (items, operatorLabel) => items.map((p,i)=>`<article class="pay-place">
    <div class="pay-place-top">
      <span class="pay-place-index">${String(i+1).padStart(2,"0")}</span>
      <div class="pay-place-main">
        <strong>${esc(p.address)}</strong>
        <div class="pay-place-meta"><span>🕒</span><span>${p.hours?esc(p.hours):"Работно време: непотвърдено"}</span></div>
        ${p.note?`<small>${esc(p.note)}</small>`:""}
      </div>
      ${p.kind==="own"?'<span class="pay-own">Собствена каса</span>':""}
    </div>
  </article>`).join("");

  return `<section class="info-subsection info-subsection--canonical payments-section" id="komunalni-plashtania">
    <div class="payments-hero">
      <div>
        <div class="payments-kicker">Плащания в Лом</div>
        <h3>Плащания и каси в Лом</h3>
        <p>EasyPay, Български пощи или банкови каси.</p>
      </div>
    </div>

    <div class="pay-switcher" role="tablist" aria-label="Избери вид място за плащане">
      <button class="pay-switch active" type="button" data-pay-tab="easypay" aria-selected="true">
        <span class="pay-brand-slot"><img src="assets/brands/easypay-logo.webp" alt="EasyPay" width="48" height="48" loading="lazy" decoding="async"></span>
        <span class="pay-switch-copy"><strong>EasyPay</strong><small>${easy.length} точки в Лом</small></span>
        <span class="pay-switch-status">Показвам</span>
      </button>
      <button class="pay-switch" type="button" data-pay-tab="post" aria-selected="false">
        <span class="pay-brand-slot pay-brand-slot--icon" aria-hidden="true">✉</span>
        <span class="pay-switch-copy"><strong>Български пощи</strong><small>${post.length} точки в Лом</small></span>
        <span class="pay-switch-status">Виж</span>
      </button>
      <button class="pay-switch" type="button" data-pay-tab="banks" aria-selected="false">
        <span class="pay-brand-slot pay-brand-slot--icon" aria-hidden="true">🏦</span>
        <span class="pay-switch-copy"><strong>Банкови каси</strong><small>${banks.length} офиса в Лом</small></span>
        <span class="pay-switch-status">Виж</span>
      </button>
    </div>

    <section class="pay-results" data-pay-panel="easypay" data-pay-label="EasyPay">
      <div class="pay-results-sticky">
        <div class="pay-results-identity">
          <img src="assets/brands/easypay-logo.webp" alt="" width="30" height="30" loading="lazy" decoding="async">
          <div><strong>EasyPay</strong><small>${easy.length} точки в Лом</small></div>
        </div>
      </div>
      <div class="pay-list" data-pay-easypay-list>${locationRows(easy,"EasyPay")}</div>
    </section>

    <section class="pay-results" data-pay-panel="post" data-pay-label="Български пощи" hidden>
      <div class="pay-results-sticky">
        <div class="pay-results-identity">
          <span class="pay-results-icon" aria-hidden="true">✉</span>
          <div><strong>Български пощи</strong><small>${post.length} точки в Лом</small></div>
        </div>
      </div>
      <div class="pay-list">${locationRows(post,"Български пощи")}</div>
    </section>

    <section class="pay-results" data-pay-panel="banks" data-pay-label="Банкови каси" hidden>
      <div class="pay-results-sticky">
        <div class="pay-results-identity">
          <span class="pay-results-icon" aria-hidden="true">🏦</span>
          <div><strong>Банкови каси</strong><small>${banks.length} офиса в Лом</small></div>
        </div>
      </div>
      <div class="pay-list">${locationRows(banks,"Банкови каси")}</div>
    </section>

    <div class="pay-scroll-context" data-pay-scroll-context hidden aria-hidden="true">
      <div class="pay-scroll-context-inner">
        <span class="pay-scroll-context-brand" data-pay-scroll-brand></span>
        <div><strong data-pay-scroll-title>EasyPay</strong><small data-pay-scroll-count>${easy.length} точки в Лом</small></div>
      </div>
    </div>

    <div class="info-actions-row">
      <button class="info-btn info-btn--add" type="button" data-add-payment-point>＋ Добави каса / място за плащане</button>
    </div>
  </section>`;
}
function wirePayments(root){
  const tabs=[...root.querySelectorAll("[data-pay-tab]")];
  const panels=[...root.querySelectorAll("[data-pay-panel]")];
  const floater=root.querySelector("[data-pay-scroll-context]");
  const floatBrand=root.querySelector("[data-pay-scroll-brand]");
  const floatTitle=root.querySelector("[data-pay-scroll-title]");
  const floatCount=root.querySelector("[data-pay-scroll-count]");
  let activeKey="easypay";
  let raf=0;

  const meta={
    easypay:{title:"EasyPay",count:"13 точки в Лом",brand:'<img src="assets/brands/easypay-logo.webp" alt="" width="30" height="30">'},
    post:{title:"Български пощи",count:"2 точки в Лом",brand:"✉"},
    banks:{title:"Банкови каси",count:"2 офиса в Лом",brand:"🏦"}
  };

  function updateFloaterContent(){
    const m=meta[activeKey];
    if(!m||!floater)return;
    floatBrand.innerHTML=m.brand;
    floatBrand.classList.toggle("is-icon",activeKey!=="easypay");
    floatTitle.textContent=m.title;
    floatCount.textContent=m.count;
  }

  function updateFloater(){
    raf=0;
    if(!floater)return;
    const panel=root.querySelector(`[data-pay-panel="${activeKey}"]`);
    if(!panel||panel.hidden){floater.hidden=true;return;}

    const tools=document.querySelector(".info-page-tools");
    const toolsRect=tools?.getBoundingClientRect();
    const topEdge=Math.max(8,Math.round(toolsRect?.bottom||8)+6);
    floater.style.top=`${topEdge}px`;

    const r=panel.getBoundingClientRect();
    const paymentsSection=root.querySelector(".payments-section");
    const sectionRect=paymentsSection?.getBoundingClientRect();
    const insuranceSection=root.querySelector(".insurance-section");
    const insuranceRect=insuranceSection?.getBoundingClientRect();

    const insideActivePanel=r.top < topEdge && r.bottom > topEdge + 68;
    const insidePaymentsSection=!sectionRect || (sectionRect.top < topEdge && sectionRect.bottom > topEdge + 68);
    const beforeInsurance=!insuranceRect || insuranceRect.top > topEdge + 44;

    const shouldShow=insideActivePanel && insidePaymentsSection && beforeInsurance;
    floater.hidden=!shouldShow;
    floater.setAttribute("aria-hidden",shouldShow?"false":"true");
  }

  function scheduleFloater(){
    if(!raf)raf=requestAnimationFrame(updateFloater);
  }

  tabs.forEach(btn=>btn.addEventListener("click",()=>{
    activeKey=btn.dataset.payTab;
    tabs.forEach(x=>{
      const active=x===btn;
      x.classList.toggle("active",active);
      x.setAttribute("aria-selected",active?"true":"false");
      const state=x.querySelector(".pay-switch-status");
      if(state)state.textContent=active?"Показвам":"Виж";
    });
    panels.forEach(p=>p.hidden=p.dataset.payPanel!==activeKey);
    updateFloaterContent();
    scheduleFloater();
    const shown=panels.find(p=>!p.hidden);
    if(shown && window.innerWidth<760){
      setTimeout(()=>shown.scrollIntoView({behavior:"smooth",block:"start"}),60);
    }
  }));

  updateFloaterContent();
  window.addEventListener("scroll",scheduleFloater,{passive:true});
  window.addEventListener("resize",scheduleFloater,{passive:true});
  scheduleFloater();

  root.querySelector("[data-add-payment-point]")?.addEventListener("click",openPaymentSubmission);
}
function utilitiesModal(){
  return document.getElementById("info-modal");
}

function showUtilitiesModal(title,lead,body){
  const m=utilitiesModal();
  if(!m)return;
  m.querySelector("[data-modal-title]").textContent=title;
  m.querySelector("[data-modal-lead]").textContent=lead||"";
  m.querySelector("[data-modal-body]").innerHTML=body;
  m.hidden=false;
  document.body.style.overflow="hidden";
}

async function openPaymentSubmission(){
  const c=await client();
  if(!c)return;
  const {data:userData}=await c.auth.getUser();
  const user=userData?.user||null;

  if(!user){
    showUtilitiesModal(
      "Добави място за плащане",
      "Предложението се проверява преди публикуване.",
      '<div class="info-login-note">За да изпратиш предложение, първо <a href="vhod.html">влез в профила си</a>.</div>'
    );
    return;
  }

  showUtilitiesModal(
    "Добави каса / място за плащане",
    "Попълни само това, което знаеш.",
    `<form class="info-form payment-submit-form" id="payment-submit-form">
      <div class="info-field">
        <label>Име / оператор *</label>
        <input name="name" required maxlength="120" placeholder="напр. EasyPay">
      </div>
      <div class="info-field">
        <label>Адрес в Лом *</label>
        <input name="address" required maxlength="180" placeholder="улица и номер">
      </div>
      <div class="info-field">
        <label>Работно време — по желание</label>
        <input name="working_hours" maxlength="180" placeholder="напр. Пон.–Пет. 09:00–18:00">
      </div>
      <div class="info-field">
        <label>Какво може да се плаща — по желание</label>
        <input name="services" maxlength="300" placeholder="напр. битови сметки, преводи">
      </div>
      <div class="info-field">
        <label>Източник / линк — по желание</label>
        <input name="source" maxlength="500" placeholder="официална страница или друг източник">
      </div>
      <div class="info-form-status" aria-live="polite"></div>
      <button class="info-btn info-btn--primary" type="submit">Изпрати за проверка</button>
    </form>`
  );

  document.getElementById("payment-submit-form")?.addEventListener("submit",async ev=>{
    ev.preventDefault();
    const form=ev.currentTarget;
    const status=form.querySelector(".info-form-status");
    const fd=new FormData(form);
    const name=String(fd.get("name")||"").trim();
    const address=String(fd.get("address")||"").trim();

    if(!name||!address){
      status.className="info-form-status error";
      status.textContent="Попълни име и адрес.";
      return;
    }

    status.className="info-form-status";
    status.textContent="Изпращане…";

    const payload={
      category:"komunalni",
      subcategory:"plashtania",
      entry_type:"payment_point",
      submitted_by:user.id,
      data:{
        name,
        address,
        working_hours:String(fd.get("working_hours")||"").trim(),
        services:String(fd.get("services")||"").trim(),
        source:String(fd.get("source")||"").trim()
      },
      status:"pending"
    };

    const {error}=await c.from("info_submissions").insert(payload);
    if(error){
      status.className="info-form-status error";
      status.textContent="Не успяхме да изпратим. Опитай отново.";
      return;
    }

    status.className="info-form-status ok";
    status.textContent="Изпратено е за проверка.";
    form.querySelector('button[type="submit"]').disabled=true;
  });
}

const internetOrder=["NetSurf","A1","Vivacom","Yettel"];
const internetMeta={
  NetSurf:{theme:"netsurf",logo:"",logoAlt:"NetSurf"},
  A1:{theme:"a1",logo:"assets/brands/a1-logo.webp",logoAlt:"A1"},
  Vivacom:{theme:"vivacom",logo:"assets/brands/vivacom-logo.webp",logoAlt:"Vivacom"},
  Yettel:{theme:"yettel",logo:"assets/brands/yettel-logo.webp",logoAlt:"Yettel"}
};
const internetAudit={
  NetSurf:{primary:{key:"netsurf_coverage",label:"Виж покритието",fallback:"https://netsurf.bg/pokritie/",step:"Директно"},calls:[{key:"netsurf_lom_office_call",label:"Лом офис",phone:"0882991603",display:"0882 991 603"},{key:"netsurf_support_call",label:"Техническа поддръжка",phone:"0885250000",display:"0885 25 0000"}],callNote:"Поддръжка: опция 2 · текущият официален контактен номер е 0885 25 0000"},
  A1:{primary:{key:"a1_coverage",label:"Провери покритие",fallback:"https://www.a1.bg/fix-internet-pokritie",step:"1 стъпка"},secondary:{key:"a1_store_locator",label:"Виж A1 магазин",fallback:"https://www.a1.bg/nameri-a1-magazin",step:"1 стъпка"},calls:[{key:"a1_customer_call",label:"Обади се на A1",phone:"+35988123",display:"+359 88 123"}],callNote:"*88 от A1 номер · +359 88 123 от друг оператор",verifiedAddress:"ул. „Славянска“ №2, Лом",hoursNote:"Работното време се проверява в официалния A1 locator."},
  Vivacom:{primary:{key:"vivacom_coverage",label:"Провери покритие",fallback:"https://www.vivacom.bg/bg/fixed_services/check_address",step:"1 стъпка"},secondary:{key:"vivacom_store_locator",label:"Виж Vivacom магазин",fallback:"https://www.vivacom.bg/magazini",step:"1 стъпка"},calls:[{key:"vivacom_lom_office_call",label:"Лом офис",phone:"097161311",display:"0971 61 311"},{key:"vivacom_customer_call",label:"Обслужване",phone:"087123",display:"087 123"}],callNote:"123 от Vivacom · 087 123 от друг оператор",verifiedAddress:"ул. „Славянска“ №7В, Лом",verifiedHours:"Пон.–Пет. 09:00–18:30"},
  Yettel:{primary:{key:"yettel_services",label:"Интернет и TV",fallback:"https://www.yettel.bg/bg/tv-internet",step:"Директно"},secondary:{key:"yettel_store_locator",label:"Виж Yettel магазин",fallback:"https://www.yettel.bg/bg/eshop/store-locator",step:"1 стъпка"},calls:[{key:"yettel_customer_call",label:"Обади се на Yettel",phone:"089123",display:"089 123"}],callNote:"123 от Yettel · 089 123 от друг оператор",verifiedAddress:"ул. „Славянска“ №3, Лом",hoursNote:"Работното време се проверява в официалния Yettel locator."}
};
function stepBadge(label){return `<span class="internet-step">${esc(label)}</span>`}
function internetProvider(entry,actions){
  const d=entry.data||{},provider=d.provider||internetOrder.find(n=>String(entry.name||"").startsWith(n))||String(entry.name||"").split("–")[0].trim(),m=internetMeta[provider]||{theme:"neutral",logo:""},a=internetAudit[provider]||{};
  const logo=m.logo?`<img class="internet-logo" src="${esc(m.logo)}" alt="${esc(m.logoAlt||provider)}" loading="lazy" decoding="async">`:"";
  const address=a.verifiedAddress||d.address||"",hours=a.verifiedHours||((a.hoursNote)?"":(d.working_hours||""));
  const target=spec=>actions[spec.key]?.target||spec.fallback||"";
  const ptarget=spec=>actions[spec.key]?.target||`tel:${spec.phone}`;
  return `<article class="internet-provider internet-theme-${esc(m.theme)}"><div class="internet-head"><div class="internet-title">${logo}<div><div class="internet-tag">Доставчик</div><h3>${esc(entry.name)}</h3></div></div></div>${d.services?`<p class="internet-services">${esc(d.services)}</p>`:""}<div class="internet-details">${address?`<div><b>Адрес:</b> ${esc(address)}</div>`:""}${hours?`<div><b>Работно време:</b> ${esc(hours)}</div>`:""}</div><div class="internet-actions">${a.primary?`<a class="internet-action internet-primary" href="${esc(target(a.primary))}" target="_blank" rel="noopener"><span>${esc(a.primary.label)}</span>${stepBadge(a.primary.step)}</a>`:""}${a.secondary?`<a class="internet-action internet-secondary" href="${esc(target(a.secondary))}" target="_blank" rel="noopener"><span>${esc(a.secondary.label)}</span>${stepBadge(a.secondary.step)}</a>`:""}${(a.calls||[]).map((c,i)=>`<a class="internet-action internet-phone${i>0?" internet-phone-secondary":""}" href="${esc(ptarget(c))}"><span>${esc(c.label)} ${esc(c.display)}</span>${stepBadge("Директно")}</a>`).join("")}</div>${a.callNote?`<div class="internet-call-note">${esc(a.callNote)}</div>`:""}${a.hoursNote?`<div class="internet-data-note">${esc(a.hoursNote)}</div>`:""}${d.note&&!/телефон за ломския магазин|адресна проверка/i.test(d.note)?`<div class="internet-note">${esc(d.note)}</div>`:""}${entry.confirmed_at?`<div class="internet-trust">Последно потвърдено: ${esc(fmt(entry.confirmed_at))}${entry.confirmed_source?` · ${esc(entry.confirmed_source)}`:""}</div>`:""}</article>`;
}
function internetSection(entries,actions){
  entries.sort((a,b)=>internetOrder.indexOf(a.data?.provider)-internetOrder.indexOf(b.data?.provider));
  return `<section class="info-subsection info-subsection--canonical" id="komunalni-internet-tv"><div class="info-subsection-title"><h3>🌐 Интернет и телевизия в Лом</h3><span class="info-section-count">${entries.length}</span></div><p class="internet-section-lead">Покритие, местни контакти и услуги — без общи начални страници, когато има по-точна официална цел.</p><div class="internet-list">${entries.map(e=>internetProvider(e,actions)).join("")}</div><div class="info-actions-row"><button class="info-btn info-btn--add" type="button" onclick="window.InfoLom?.openSubmission('komunalni','internet-tv','provider')">＋ Добави доставчик</button></div></section>`;
}


function insuranceSection(){
  const offices = [
    {
      name:"ASSET INSURANCE",
      role:"Регионален представител — Лом",
      address:'ул. „Георги Манавски“ №19',
      phone1:"0884 062 207",
      tel1:"0884062207",
      phone2:"0888 913 139",
      tel2:"0888913139",
      hours:"Непотвърдено",
      sourceLabel:"Официален източник",
      sourceUrl:"https://assetins.bg/ofisi/",
      sourceText:"ASSET INSURANCE — офиси"
    },
    {
      name:"Амарант България",
      role:"Застрахователен брокер — Лом",
      address:'ул. „Цар Петър“ №1',
      phone1:"0971 61 111",
      tel1:"097161111",
      hours:"Пон.–Пет. 08:30–18:00; Съб. 09:00–14:00; Нед. затворено",
      sourceLabel:"Локално потвърждение",
      sourceText:"Google Business профил"
    },
    {
      name:"Мусала Иншурънс Брокер",
      role:"Застрахователен брокер — Лом",
      address:'ул. „Хан Аспарух“ №12',
      phone1:"087 799 9813",
      tel1:"0877999813",
      hours:"Пон.–Пет. 09:00–18:00; Съб. 09:00–13:00; Нед. затворено",
      sourceLabel:"Локално потвърждение",
      sourceText:"Google Business профил"
    },
    {
      name:"ТХИМ",
      role:"Застраховки МПС — Лом",
      address:'ул. „Цар Симеон“ №31',
      phone1:"087 756 0357",
      tel1:"0877560357",
      hours:"Пон.–Съб. 08:30–18:00; Нед. затворено",
      sourceLabel:"Локално потвърждение",
      sourceText:"Google Business профил"
    }
  ];

  const cards = offices.map((o,i)=>`<article class="insurance-office">
    <div class="insurance-office-head">
      <span class="insurance-number">${String(i+1).padStart(2,"0")}</span>
      <div class="insurance-office-title">
        <h4>${esc(o.name)}</h4>
        <p>${esc(o.role)}</p>
      </div>
      <span class="insurance-status">${esc(o.sourceLabel)}</span>
    </div>

    <div class="insurance-office-body">
      <div class="insurance-detail">
        <span class="insurance-detail-label">Адрес</span>
        <strong>${esc(o.address)}</strong>
      </div>
      <div class="insurance-detail">
        <span class="insurance-detail-label">Работно време</span>
        <strong>${esc(o.hours)}</strong>
      </div>
    </div>

    <div class="insurance-office-actions">
      <a class="insurance-call insurance-call--primary" href="tel:${esc(o.tel1)}">
        <span>${esc(o.phone1)}</span><small>Обади се · Директно</small>
      </a>
      ${o.phone2?`<a class="insurance-call" href="tel:${esc(o.tel2)}">
        <span>${esc(o.phone2)}</span><small>Обади се · Директно</small>
      </a>`:""}
    </div>

    <div class="insurance-office-source">
      <span>${esc(o.sourceText)}</span>
      ${o.sourceUrl?`<a href="${esc(o.sourceUrl)}" target="_blank" rel="noopener">Отвори източника</a>`:""}
    </div>
  </article>`).join("");

  return `<section class="info-subsection info-subsection--canonical insurance-section" id="komunalni-zastrahovki">
    <div class="insurance-head">
      <div class="insurance-head-main">
        <span class="insurance-kicker">Застраховки</span>
        <h3>Застрахователни офиси в Лом</h3>
        <p>Адрес, телефон и работно време на потвърдени локални офиси.</p>
      </div>
      <span class="insurance-count">${offices.length} офиса</span>
    </div>

    <div class="insurance-office-list">${cards}</div>

    <div class="info-actions-row">
      <button class="info-btn info-btn--add" type="button" data-add-insurance-office>＋ Добави застрахователен офис</button>
    </div>
  </section>`;
}
async function openInsuranceSubmission(){
  const c=await client();
  if(!c)return;
  const {data:userData}=await c.auth.getUser();
  const user=userData?.user||null;

  if(!user){
    showUtilitiesModal(
      "Добави застрахователен офис",
      "Предложението се проверява преди публикуване.",
      '<div class="info-login-note">За да изпратиш предложение, първо <a href="vhod.html">влез в профила си</a>.</div>'
    );
    return;
  }

  showUtilitiesModal(
    "Добави застрахователен офис",
    "Попълни само основното. Администратор ще провери данните.",
    `<form class="info-form insurance-submit-form" id="insurance-submit-form">
      <div class="info-field">
        <label>Име на офиса *</label>
        <input name="name" required maxlength="140" placeholder="напр. име на брокер или застраховател">
      </div>
      <div class="info-field">
        <label>Адрес в Лом *</label>
        <input name="address" required maxlength="180" placeholder="улица и номер">
      </div>
      <div class="info-field">
        <label>Телефон — по желание</label>
        <input name="phone" maxlength="40" inputmode="tel">
      </div>
      <div class="info-field">
        <label>Работно време — по желание</label>
        <input name="working_hours" maxlength="180">
      </div>
      <div class="info-field">
        <label>Източник / линк — по желание</label>
        <input name="source" maxlength="500">
      </div>
      <div class="info-form-status" aria-live="polite"></div>
      <button class="info-btn info-btn--primary" type="submit">Изпрати за проверка</button>
    </form>`
  );

  document.getElementById("insurance-submit-form")?.addEventListener("submit",async ev=>{
    ev.preventDefault();
    const form=ev.currentTarget;
    const status=form.querySelector(".info-form-status");
    const fd=new FormData(form);
    const name=String(fd.get("name")||"").trim();
    const address=String(fd.get("address")||"").trim();

    if(!name||!address){
      status.className="info-form-status error";
      status.textContent="Попълни име и адрес.";
      return;
    }

    status.className="info-form-status";
    status.textContent="Изпращане…";

    const payload={
      category:"komunalni",
      subcategory:"zastrahovki",
      entry_type:"insurance_office",
      submitted_by:user.id,
      data:{
        name,
        address,
        phone:String(fd.get("phone")||"").trim(),
        working_hours:String(fd.get("working_hours")||"").trim(),
        source:String(fd.get("source")||"").trim()
      },
      status:"pending"
    };

    const {error}=await c.from("info_submissions").insert(payload);
    if(error){
      status.className="info-form-status error";
      status.textContent="Не успяхме да изпратим. Опитай отново.";
      return;
    }

    status.className="info-form-status ok";
    status.textContent="Изпратено е за проверка.";
    form.querySelector('button[type="submit"]').disabled=true;
  });
}

async function init(){
  const root=document.querySelector("[data-info-utilities-root]"); if(!root)return;
  const c=await client(); if(!c){root.innerHTML='<p class="info-empty">Информацията не може да се зареди в момента.</p>';return;}
  const [er,ar]=await Promise.all([
    c.from("info_entries").select("category,subcategory,entry_type,name,data,confirmed_at,confirmed_source").eq("category","komunalni").eq("publication_status","published"),
    c.from("info_actions").select("subcategory,action_key,label,action_type,target,status,is_public,sort_order").eq("category","komunalni").eq("status","active").eq("is_public",true)
  ]);
  if(er.error||ar.error){root.innerHTML='<p class="info-empty">Информацията не може да се зареди в момента.</p>';return;}
  const entries=er.data||[],actions=actionMap(ar.data||[]);
  const couriers=entries.filter(e=>e.subcategory==="kurieri");
  const internet=entries.filter(e=>e.subcategory==="internet-tv");
  root.innerHTML=renderUtilities(actions)+courierSection(couriers,actions)+internetSection(internet,actions)+paymentSection()+insuranceSection();
  root.querySelector("[data-add-insurance-office]")?.addEventListener("click",openInsuranceSubmission);
  wirePayments(root);
  const filter=root.querySelector(".info-courier-filter");
  filter?.addEventListener("input",()=>{const q=filter.value.trim().toLowerCase();root.querySelectorAll(".info-courier").forEach(el=>el.hidden=!!q&&!el.textContent.toLowerCase().includes(q))});
}
window.addEventListener("DOMContentLoaded",init,{once:true});
})();