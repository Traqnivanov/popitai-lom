(() => {
  "use strict";

  const CATEGORY_LABELS = {
    zdrave: "Здраве",
    institucii: "Институции",
    transport: "Транспорт",
    obrazovanie: "Образование и култура",
    banki: "Банки и банкомати",
    komunalni: "Комунални и ежедневни услуги"
  };

  const SECTION_CONFIG = {
    zdrave: [
      ["bolnica","Болница и медицински центрове",["medical_center","hospital_department"],[["Добави медицински център","medical_center"],["Добави медицинска услуга / отделение","hospital_department"]]],
      ["lekari","Лекари",["doctor"],[["Добави лекар","doctor"]]],
      ["apteki","Аптеки",["pharmacy"],[["Добави аптека","pharmacy"]]],
      ["stomatolozi","Стоматолози",["dentist"],[["Добави стоматолог","dentist"]]],
      ["veterinari","Ветеринари",["vet"],[["Добави ветеринар","vet"]]],
      ["vet-apteki","Ветеринарни аптеки",["vet_pharmacy"],[["Добави ветеринарна аптека","vet_pharmacy"]]],
      ["laboratorii","Лаборатории и диагностика",["laboratory"],[["Добави лаборатория","laboratory"]]]
    ],
    transport: [
      ["avtobusi","Автобуси",["bus_info"],[]],
      ["bdz","ЖП / БДЖ",["train_station"],[]],
      ["taksita","Таксита",["taxi"],[["Добави такси","taxi"]]]
    ],
    obrazovanie: [
      ["uchilishta","Училища",["school"],[["Добави училище","school"]]],
      ["detski-gradini","Детски градини",["kindergarten"],[["Добави детска градина","kindergarten"]]],
      ["chitalishta","Читалища",["community_center"],[]],
      ["biblioteka","Библиотека",["library"],[]],
      ["muzei","Музей",["museum"],[]],
      ["shkoli-kursove","Школи / курсове",["course","education_center"],[]]
    ],
    banki: [
      ["ofisi","Банкови офиси",["bank_office"],[]],
      ["bankomati","Банкомати",["atm"],[["Добави банкомат","atm"]]]
    ]
  };

  let allEntries = [];
  let allActions = [];
  let currentUser = null;

  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]));
  const fmt = iso => iso ? new Date(iso).toLocaleDateString("bg-BG", {day:"numeric",month:"long",year:"numeric"}) : "";
  const first = (...vals) => vals.find(v => v !== null && v !== undefined && String(v).trim() !== "");
  const telTarget = phone => `tel:${String(phone).replace(/[^+\d]/g,"")}`;

  async function waitClient(){
    if (window.PopitaiSupabase) return window.PopitaiSupabase;
    return new Promise(resolve => {
      const timer = setInterval(() => {
        if (window.PopitaiSupabase){ clearInterval(timer); resolve(window.PopitaiSupabase); }
      }, 50);
    });
  }

  function labelForType(type){
    const labels = {
      medical_center:"Лечебно заведение", hospital_department:"Отделение", doctor:"Лекар", pharmacy:"Аптека", dentist:"Стоматолог", vet:"Ветеринар", vet_pharmacy:"Ветеринарна аптека", laboratory:"Лаборатория / диагностика",
      institution:"Институция", municipality:"Община", police:"Полиция", fire_service:"Пожарна", emergency:"Спешна помощ",
      school:"Училище", kindergarten:"Детска градина", community_center:"Читалище", library:"Библиотека", museum:"Музей", course:"Школа / курс", education_center:"Образователен център",
      train_station:"ЖП", bus_info:"Автобуси", taxi:"Такси", bank_office:"Банков офис", atm:"Банкомат", utility:"Градска услуга"
    };
    return labels[type] || "Полезна информация";
  }

  function meta(text, icon="•"){
    if (!text) return "";
    return `<div class="info-card-meta"><span aria-hidden="true">${icon}</span><span>${esc(text)}</span></div>`;
  }

  function phoneButtons(data){
    const values = [];
    [data.phone,data.phone_primary,data.phone_secondary,data.mobile,data.gsm,data.telephone].forEach(v => { if(v) values.push(v); });
    if (Array.isArray(data.phones)) values.push(...data.phones);
    const seen = new Set();
    return values.flatMap(v => String(v).split(/[;,]/)).map(v=>v.trim()).filter(Boolean).filter(v=>{const k=v.replace(/\s/g,"");if(seen.has(k))return false;seen.add(k);return true;}).slice(0,3).map(v=>`<a class="info-btn info-btn--call" href="${esc(telTarget(v))}">☎ ${esc(v)}</a>`).join("");
  }

  function publicDataRows(entry){
    const d = entry.data || {};
    const rows = [];
    const add=(label,val,icon="•")=>{if(val!==undefined&&val!==null&&String(val).trim()!=="") rows.push(meta(`${label}: ${val}`,icon));};
    add("Адрес", first(d.address,d.location),"📍");
    add("Специалност", d.specialty,"•");
    add("Директор", d.director,"👤");
    add("Председател", d.chairperson,"👤");
    add("Секретар", d.secretary,"👤");
    add("Работно време", first(d.working_hours,d.work_hours),"🕒");
    add("Приемно време", d.reception_hours,"🕒");
    add("E-mail", first(d.email,d.official_email),"✉");
    add("Услуги", d.services,"•");
    add("Дейности", first(d.activities,d.activity),"•");
    add("Обучение", d.training,"•");
    add("Към", d.parent_organization,"•");
    add("24/7", first(d.available_24_7,d.atm_24_7,d.digital_zone),"✓");
    add("Внасяне", first(d.deposit,d.atm_deposit),"✓");
    if (d.nzok) rows.push(meta("Работи с НЗОК","✓"));
    return rows.join("");
  }

  function card(entry){
    const d = entry.data || {};
    const note = first(d.note,d.notes,d.description,d.registration,d.confirmation_note);
    const phone = phoneButtons(d);
    const website = first(d.public_url,d.website,d.official_site,d.official_page);
    return `<article class="info-card" data-entry-id="${esc(entry.id)}">
      <div class="info-card-type">${esc(labelForType(entry.entry_type))}</div>
      <div class="info-card-name">${esc(entry.name)}</div>
      ${publicDataRows(entry)}
      ${note ? `<div class="info-card-note">${esc(note)}</div>` : ""}
      ${(phone || website) ? `<div class="info-card-actions">${phone}${website ? `<a class="info-btn" href="${esc(website)}" target="_blank" rel="noopener">Официална страница</a>`:""}</div>` : ""}
      ${entry.confirmed_at ? `<div class="info-card-confirmed">Последно потвърдено: ${esc(fmt(entry.confirmed_at))}${entry.confirmed_source ? ` · ${esc(entry.confirmed_source)}`:""}</div>`:""}
    </article>`;
  }

  function actionsFor(category, subcategory){
    return allActions.filter(a=>a.category===category && a.subcategory===subcategory && a.is_public!==false && a.status==="active").sort((a,b)=>(a.sort_order||100)-(b.sort_order||100));
  }

  function actionLinks(category, subcategory){
    const actions = actionsFor(category,subcategory);
    if(!actions.length) return "";
    return `<div class="info-wide-actions">${actions.map(a=>`<a class="info-action-link" href="${esc(a.target)}"${a.action_type==="url"?' target="_blank" rel="noopener"':''}>${esc(a.label)}</a>`).join("")}</div>`;
  }

  function addButtons(category, subcategory, buttons){
    if(!buttons?.length) return "";
    return `<div class="info-actions-row">${buttons.map(([label,type])=>`<button class="info-btn info-btn--add" type="button" data-info-add="${esc(type)}" data-info-category="${esc(category)}" data-info-subcategory="${esc(subcategory)}">＋ ${esc(label)}</button>`).join("")}</div>`;
  }

  function renderConfiguredCategory(category){
    const root = document.querySelector(`[data-info-category-root="${category}"]`);
    if(!root) return;
    const categoryEntries = allEntries.filter(e=>e.category===category);
    const sections = SECTION_CONFIG[category] || [];
    root.innerHTML = sections.map(([sub,label,types,buttons])=>{
      const items = categoryEntries.filter(e=>e.subcategory===sub || types.includes(e.entry_type));
      return `<section class="info-subsection" id="${category}-${sub}">
        <div class="info-subsection-title"><h3>${esc(label)}</h3><span class="info-section-count">${items.length ? `${items.length} записа`:""}</span></div>
        ${actionLinks(category,sub)}
        <div class="info-cards">${items.length ? items.map(card).join("") : `<p class="info-empty">Няма публикувана потвърдена информация в момента.</p>`}</div>
        ${addButtons(category,sub,buttons)}
      </section>`;
    }).join("");
  }

  function institutionGroup(entry){
    const d=entry.data||{};
    return first(d.group,d.type,d.institution_type,entry.subcategory,"Други");
  }

  function renderInstitutions(){
    const root=document.querySelector('[data-info-category-root="institucii"]');
    if(!root)return;
    const entries=allEntries.filter(e=>e.category==="institucii");
    if(!entries.length){root.innerHTML='<section class="info-subsection"><p class="info-empty">Няма публикувана информация.</p></section>';return;}
    const preferred=["obshtina","speshni","policia","darzhavni","komunalni","drugi"];
    const groups=new Map();
    entries.forEach(e=>{const key=e.subcategory||"drugi";if(!groups.has(key))groups.set(key,[]);groups.get(key).push(e);});
    const ordered=[...groups.keys()].sort((a,b)=>{const ia=preferred.indexOf(a),ib=preferred.indexOf(b);return (ia<0?99:ia)-(ib<0?99:ib)||a.localeCompare(b,"bg");});
    root.innerHTML=ordered.map(key=>`<section class="info-subsection" id="institucii-${esc(key)}"><div class="info-subsection-title"><h3>${esc(groupTitle(key))}</h3><span class="info-section-count">${groups.get(key).length} записа</span></div><div class="info-cards">${groups.get(key).map(card).join("")}</div></section>`).join("");
  }

  function groupTitle(key){
    const m={obshtina:"Община и общински услуги",speshni:"Спешни и важни контакти",policia:"Полиция и сигурност",darzhavni:"Държавни служби",komunalni:"Комунални услуги",drugi:"Други институции",ap:"Администрация",socialni:"Социални услуги",zdrave:"Здравна администрация"};
    return m[key] || key.replaceAll("_"," ").replace(/^./,x=>x.toUpperCase());
  }

  function renderUtilities(){
    const root=document.querySelector('[data-info-category-root="komunalni"]');
    if(!root)return;
    const cards=[
      ["💧","Вода и ВиК","Аварии, контакти и услуги за Лом","vik"],
      ["⚡","Електроенергия","Прекъсвания, контакти и услуги за Лом","tok"],
      ["🗑️","Чистота и отпадъци","Сигнали, чистота и едрогабаритни отпадъци","chistota"]
    ];
    const utilEntries=allEntries.filter(e=>e.category==="komunalni");
    root.innerHTML=`<div class="info-utility-grid">${cards.map(([icon,title,desc,sub])=>{
      const own=utilEntries.filter(e=>e.subcategory===sub);
      return `<article class="info-utility-card" id="komunalni-${sub}"><h3>${icon} ${esc(title)}</h3><p>${esc(desc)}</p>${actionLinks("komunalni",sub)}${own.length?`<div class="info-cards">${own.map(card).join("")}</div>`:""}</article>`;
    }).join("")}</div>`;
  }

  function renderAll(){
    renderConfiguredCategory("zdrave");
    renderInstitutions();
    renderConfiguredCategory("transport");
    renderConfiguredCategory("obrazovanie");
    renderConfiguredCategory("banki");
    renderUtilities();
    wireButtons();
  }

  function wireButtons(){
    document.querySelectorAll("[data-info-add]").forEach(btn=>btn.addEventListener("click",()=>openSubmission(btn.dataset.infoCategory,btn.dataset.infoSubcategory,btn.dataset.infoAdd)));
    document.querySelectorAll("[data-info-signal]").forEach(btn=>btn.addEventListener("click",()=>openSignal(btn.dataset.infoSignal||"")));
  }

  function modal(){ return document.getElementById("info-modal"); }
  function showModal(title, lead, body){
    const m=modal(); if(!m)return;
    m.querySelector("[data-modal-title]").textContent=title;
    m.querySelector("[data-modal-lead]").textContent=lead||"";
    m.querySelector("[data-modal-body]").innerHTML=body;
    m.hidden=false; document.body.style.overflow="hidden";
  }
  function closeModal(){ const m=modal(); if(!m)return; m.hidden=true; document.body.style.overflow=""; }

  function loginMessage(){ return `<div class="info-login-note">За да изпратиш предложение или сигнал, първо <a href="vhod.html">влез в профила си</a>. Информацията никога не се публикува автоматично.</div>`; }

  function openSubmission(category,subcategory,type){
    if(!currentUser){showModal("Предложи информация","Всичко минава през проверка от администратор.",loginMessage());return;}
    const title=`Предложи: ${CATEGORY_LABELS[category]||category}`;
    showModal(title,"Изпрати само това, което знаеш. Администратор ще го провери преди публикуване.",`<form class="info-form" id="info-submit-form">
      <input type="hidden" name="category" value="${esc(category)}"><input type="hidden" name="subcategory" value="${esc(subcategory)}"><input type="hidden" name="entry_type" value="${esc(type)}">
      <div class="info-field"><label>Име / обект *</label><input name="name" required maxlength="180"></div>
      <div class="info-field"><label>Телефон, адрес или друга полезна информация *</label><textarea name="details" required maxlength="1800"></textarea></div>
      <div class="info-field"><label>Източник / линк — по желание</label><input name="source" maxlength="500"></div>
      <div class="info-form-status" aria-live="polite"></div><button class="info-btn info-btn--primary" type="submit">Изпрати за проверка</button>
    </form>`);
    document.getElementById("info-submit-form")?.addEventListener("submit",submitProposal);
  }

  function openSignal(category=""){
    if(!currentUser){showModal("Сигнализирай за грешка","Сигналът отива само до администратора.",loginMessage());return;}
    const choices=allEntries.filter(e=>!category||e.category===category).map(e=>`<option value="${esc(e.id)}">${esc(CATEGORY_LABELS[e.category]||e.category)} — ${esc(e.name)}</option>`).join("");
    showModal("Сигнализирай за грешка","Посочи кой запис е грешен и каква е правилната информация.",`<form class="info-form" id="info-error-form">
      <div class="info-field"><label>Запис</label><select name="entry_id"><option value="">Обща грешка / не намирам записа</option>${choices}</select></div>
      <div class="info-field"><label>Какво е грешно? *</label><textarea name="description" required maxlength="1800"></textarea></div>
      <div class="info-field"><label>Правилна информация / източник — по желание</label><textarea name="correct_info" maxlength="1800"></textarea></div>
      <input type="hidden" name="category" value="${esc(category)}"><div class="info-form-status" aria-live="polite"></div><button class="info-btn info-btn--primary" type="submit">Изпрати сигнала</button>
    </form>`);
    document.getElementById("info-error-form")?.addEventListener("submit",submitError);
  }

  async function submitProposal(ev){
    ev.preventDefault(); const form=ev.currentTarget, status=form.querySelector(".info-form-status"), fd=new FormData(form); const client=await waitClient();
    status.className="info-form-status";status.textContent="Изпращане…";
    const payload={category:fd.get("category"),subcategory:fd.get("subcategory"),entry_type:fd.get("entry_type"),submitted_by:currentUser.id,data:{name:String(fd.get("name")||"").trim(),details:String(fd.get("details")||"").trim(),source:String(fd.get("source")||"").trim()},status:"pending"};
    const {error}=await client.from("info_submissions").insert(payload);
    if(error){status.className="info-form-status error";status.textContent="Не успяхме да изпратим. Опитай отново.";return;}
    status.className="info-form-status ok";status.textContent="Изпратено е за проверка. Нищо не е публикувано автоматично.";form.querySelector("button[type=submit]").disabled=true;
  }

  async function submitError(ev){
    ev.preventDefault(); const form=ev.currentTarget,status=form.querySelector(".info-form-status"),fd=new FormData(form),client=await waitClient();
    const id=String(fd.get("entry_id")||""); const entry=allEntries.find(e=>e.id===id); const correct=String(fd.get("correct_info")||"").trim();
    const description=`${String(fd.get("description")||"").trim()}${correct?`\nПравилна информация / източник: ${correct}`:""}`;
    status.className="info-form-status";status.textContent="Изпращане…";
    const {error}=await client.from("info_error_reports").insert({entry_id:id||null,reported_by:currentUser.id,description,category:entry?.category||String(fd.get("category")||""),subcategory:entry?.subcategory||"",status:"pending"});
    if(error){status.className="info-form-status error";status.textContent="Не успяхме да изпратим. Опитай отново.";return;}
    status.className="info-form-status ok";status.textContent="Сигналът е изпратен за проверка.";form.querySelector("button[type=submit]").disabled=true;
  }

  async function init(){
    if(!document.querySelector("[data-info-page]"))return;
    const client=await waitClient();
    const {data:userData}=await client.auth.getUser(); currentUser=userData?.user||null;
    const [entriesRes,actionsRes]=await Promise.all([
      client.from("info_entries").select("id,category,subcategory,entry_type,name,data,publication_status,reliability_status,confirmed_at,confirmed_source").eq("publication_status","published").order("category").order("created_at"),
      client.from("info_actions").select("category,subcategory,action_key,label,action_type,target,status,is_public,sort_order").eq("status","active").eq("is_public",true).order("sort_order")
    ]);
    allEntries=entriesRes.data||[]; allActions=actionsRes.data||[];
    if(entriesRes.error){document.querySelectorAll("[data-info-category-root]").forEach(x=>x.innerHTML='<div class="info-loading">Информацията не може да се зареди в момента.</div>');return;}
    renderAll();
    const m=modal();m?.querySelectorAll("[data-modal-close]").forEach(x=>x.addEventListener("click",closeModal));document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!m?.hidden)closeModal();});
    if(location.hash){setTimeout(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({behavior:"smooth",block:"start"}),120);}
  }

  window.InfoLom={openSubmission,openSignal};
  document.addEventListener("DOMContentLoaded",init);
})();