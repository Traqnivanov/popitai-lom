(() => {
  "use strict";

  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const fmt = v => v ? new Date(v).toLocaleDateString("bg-BG", {day:"numeric", month:"long", year:"numeric"}) : "";
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  async function client(){
    if (window.PopitaiSupabase) return window.PopitaiSupabase;
    for(let i=0;i<80;i+=1){
      if(window.PopitaiSupabase) return window.PopitaiSupabase;
      await sleep(100);
    }
    return null;
  }

  const order=["NetSurf","A1","Vivacom","Yettel"];
  const meta={
    NetSurf:{theme:"netsurf",logo:"",logoAlt:"NetSurf"},
    A1:{theme:"a1",logo:"assets/brands/a1-logo.webp",logoAlt:"A1"},
    Vivacom:{theme:"vivacom",logo:"assets/brands/vivacom-logo.webp",logoAlt:"Vivacom"},
    Yettel:{theme:"yettel",logo:"assets/brands/yettel-logo.webp",logoAlt:"Yettel"}
  };

  const audit={
    NetSurf:{
      primary:{key:"netsurf_coverage",label:"Виж покритието",fallback:"https://netsurf.bg/pokritie/",step:"Директно"},
      calls:[
        {key:"netsurf_lom_office_call",label:"Лом офис",phone:"0882991603",display:"0882 991 603"},
        {key:"netsurf_support_call",label:"Техническа поддръжка",phone:"0885250000",display:"0885 25 0000"}
      ],
      callNote:"Поддръжка: опция 2 · текущият официален контактен номер е 0885 25 0000"
    },
    A1:{
      primary:{key:"a1_coverage",label:"Провери покритие",fallback:"https://www.a1.bg/fix-internet-pokritie",step:"1 стъпка"},
      secondary:{key:"a1_store_locator",label:"Виж A1 магазин",fallback:"https://www.a1.bg/nameri-a1-magazin",step:"1 стъпка"},
      calls:[{key:"a1_customer_call",label:"Обади се на A1",phone:"+35988123",display:"+359 88 123"}],
      callNote:"*88 от A1 номер · +359 88 123 от друг оператор",
      verifiedAddress:"ул. „Славянска“ №2, Лом",
      hoursNote:"Работното време се проверява в официалния A1 locator."
    },
    Vivacom:{
      primary:{key:"vivacom_coverage",label:"Провери покритие",fallback:"https://www.vivacom.bg/bg/fixed_services/check_address",step:"1 стъпка"},
      secondary:{key:"vivacom_store_locator",label:"Виж Vivacom магазин",fallback:"https://www.vivacom.bg/magazini",step:"1 стъпка"},
      calls:[
        {key:"vivacom_lom_office_call",label:"Лом офис",phone:"097161311",display:"0971 61 311"},
        {key:"vivacom_customer_call",label:"Обслужване",phone:"087123",display:"087 123"}
      ],
      callNote:"123 от Vivacom · 087 123 от друг оператор",
      verifiedAddress:"ул. „Славянска“ №7В, Лом",
      verifiedHours:"Пон.–Пет. 09:00–18:30"
    },
    Yettel:{
      primary:{key:"yettel_services",label:"Интернет и TV",fallback:"https://www.yettel.bg/bg/tv-internet",step:"Директно"},
      secondary:{key:"yettel_store_locator",label:"Виж Yettel магазин",fallback:"https://www.yettel.bg/bg/eshop/store-locator",step:"1 стъпка"},
      calls:[{key:"yettel_customer_call",label:"Обади се на Yettel",phone:"089123",display:"089 123"}],
      callNote:"123 от Yettel · 089 123 от друг оператор",
      verifiedAddress:"ул. „Славянска“ №3, Лом",
      hoursNote:"Работното време се проверява в официалния Yettel locator."
    }
  };

  function actionMap(actions){ return Object.fromEntries(actions.map(a=>[a.action_key,a])); }
  function stepBadge(label){ return `<span class="internet-step">${esc(label)}</span>`; }
  function actionTarget(spec, actions){ return actions[spec.key]?.target || spec.fallback || ""; }
  function phoneTarget(spec, actions){ return actions[spec.key]?.target || `tel:${spec.phone}`; }

  function renderProvider(entry, actions){
    const d=entry.data||{};
    const provider=d.provider || order.find(n=>String(entry.name||"").startsWith(n)) || String(entry.name||"").split("–")[0].trim();
    const m=meta[provider]||{theme:"neutral",logo:""};
    const a=audit[provider]||{};
    const logo=m.logo?`<img class="internet-logo" src="${esc(m.logo)}" alt="${esc(m.logoAlt||provider)}" loading="lazy" decoding="async">`:"";
    const address=a.verifiedAddress||d.address||"";
    const hours=a.verifiedHours||((a.hoursNote)?"":(d.working_hours||""));
    const trust=entry.confirmed_at?`<div class="internet-trust">Последно потвърдено: ${esc(fmt(entry.confirmed_at))}${entry.confirmed_source?` · ${esc(entry.confirmed_source)}`:""}</div>`:"";
    return `<article class="internet-provider internet-theme-${esc(m.theme)}">
      <div class="internet-head"><div class="internet-title">${logo}<div><div class="internet-tag">Доставчик</div><h3>${esc(entry.name)}</h3></div></div></div>
      ${d.services?`<p class="internet-services">${esc(d.services)}</p>`:""}
      <div class="internet-details">${address?`<div><b>Адрес:</b> ${esc(address)}</div>`:""}${hours?`<div><b>Работно време:</b> ${esc(hours)}</div>`:""}</div>
      <div class="internet-actions">
        ${a.primary?`<a class="internet-action internet-primary" href="${esc(actionTarget(a.primary,actions))}" target="_blank" rel="noopener"><span>${esc(a.primary.label)}</span>${stepBadge(a.primary.step)}</a>`:""}
        ${a.secondary?`<a class="internet-action internet-secondary" href="${esc(actionTarget(a.secondary,actions))}" target="_blank" rel="noopener"><span>${esc(a.secondary.label)}</span>${stepBadge(a.secondary.step)}</a>`:""}
        ${(a.calls||[]).map((c,i)=>`<a class="internet-action internet-phone${i>0?" internet-phone-secondary":""}" href="${esc(phoneTarget(c,actions))}"><span>${esc(c.label)} ${esc(c.display)}</span>${stepBadge("Директно")}</a>`).join("")}
      </div>
      ${a.callNote?`<div class="internet-call-note">${esc(a.callNote)}</div>`:""}
      ${a.hoursNote?`<div class="internet-data-note">${esc(a.hoursNote)}</div>`:""}
      ${d.note && !/телефон за ломския магазин|адресна проверка/i.test(d.note)?`<div class="internet-note">${esc(d.note)}</div>`:""}
      ${trust}
    </article>`;
  }

  async function run(){
    if(!document.body?.dataset.infoPage) return;
    let section=null;
    for(let i=0;i<80;i+=1){
      section=document.getElementById("komunalni-internet-tv");
      if(section) break;
      await sleep(100);
    }
    if(!section || section.dataset.v13Applied==="true") return;
    const c=await client();
    if(!c) return;
    const [er,ar]=await Promise.all([
      c.from("info_entries").select("id,name,data,confirmed_at,confirmed_source").eq("category","komunalni").eq("subcategory","internet-tv").eq("publication_status","published"),
      c.from("info_actions").select("action_key,target,status,is_public").eq("category","komunalni").eq("subcategory","internet-tv").eq("status","active").eq("is_public",true)
    ]);
    if(er.error||ar.error) return;
    const entries=(er.data||[]).sort((a,b)=>order.indexOf(a.data?.provider)-order.indexOf(b.data?.provider));
    const actions=actionMap(ar.data||[]);
    section.dataset.v13Applied="true";
    section.innerHTML=`<div class="info-subsection-title"><h3>🌐 Интернет и телевизия</h3><span class="info-section-count">${entries.length}</span></div>
      <p class="internet-section-lead">Покритие, местни контакти и услуги — без общи начални страници, когато има по-точна официална цел.</p>
      <div class="internet-list">${entries.map(e=>renderProvider(e,actions)).join("")}</div>
      <div class="info-actions-row"><button class="info-btn info-btn--add" type="button" onclick="window.InfoLom?.openSubmission('komunalni','internet-tv','provider')">＋ Добави доставчик</button><button class="info-btn info-btn--signal" type="button" onclick="window.InfoLom?.openSignal('komunalni')">⚠ Сигнализирай за грешка</button></div>`;
  }

  window.addEventListener("DOMContentLoaded",()=>setTimeout(run,0),{once:true});
})();
