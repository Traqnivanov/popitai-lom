(() => {
  "use strict";

  const CATEGORY = "zdrave";
  const SECTION_LABELS = {
    lekari: "Лекари",
    apteki: "Аптеки",
    stomatolozi: "Стоматолози",
    veterinari: "Ветеринари",
    "vet-apteki": "Ветеринарни аптеки",
    laboratorii: "Лаборатории и диагностика"
  };

  const ADD_CONFIG = {
    doctor: {
      title: "Добави лекар",
      fields: [
        ["name","Име на лекаря","text",true],
        ["specialty","Специалност","text",true],
        ["facility","Лечебно заведение / кабинет","text",false],
        ["phone","Телефон","tel",false],
        ["address","Адрес","text",false],
        ["working_hours","Приемно / работно време","text",false],
        ["nzok","Работи с НЗОК","select",false]
      ]
    },
    pharmacy: {
      title: "Добави аптека",
      fields: [
        ["name","Име на аптеката","text",true],
        ["address","Адрес","text",true],
        ["phone","Телефон","tel",false],
        ["working_hours","Работно време","text",false],
        ["nzok","Работи с НЗОК","select",false],
        ["availability","Денонощна / дежурна","text",false]
      ]
    },
    dentist: {
      title: "Добави стоматолог",
      fields: [
        ["name","Име на стоматолога","text",true],
        ["facility","Кабинет / практика","text",false],
        ["address","Адрес","text",false],
        ["phone","Телефон","tel",false],
        ["working_hours","Работно време","text",false],
        ["nzok","Работи с НЗОК","select",false]
      ]
    },
    vet: {
      title: "Добави ветеринар",
      fields: [
        ["name","Име / кабинет","text",true],
        ["address","Адрес","text",false],
        ["phone","Телефон","tel",false],
        ["working_hours","Работно време","text",false],
        ["services","Услуги","text",false]
      ]
    },
    vet_pharmacy: {
      title: "Добави ветеринарна аптека",
      fields: [
        ["name","Име","text",true],
        ["address","Адрес","text",true],
        ["phone","Телефон","tel",false],
        ["working_hours","Работно време","text",false],
        ["services","Продукти / услуги","text",false]
      ]
    },
    laboratory: {
      title: "Добави лаборатория",
      fields: [
        ["name","Име","text",true],
        ["address","Адрес","text",true],
        ["phone","Телефон","tel",false],
        ["working_hours","Работно време","text",false],
        ["services","Изследвания / диагностика","text",false],
        ["nzok","Работи с НЗОК","select",false]
      ]
    },
    medical_center: {
      title: "Добави лечебно заведение",
      fields: [
        ["name","Име на лечебното заведение","text",true],
        ["facility_type","Вид","text",true],
        ["address","Адрес","text",true],
        ["phone","Основен телефон","tel",false],
        ["working_hours","Работно време","text",false],
        ["services","Основни услуги","text",false]
      ]
    }
  };

  const OFFICIAL_HEALTH_ACTIONS = {
    bolnica: [
      ["Търси болница / клинична пътека по НЗОК", "https://services.nhif.bg/references/lists/hospital.xhtml"]
    ],
    lekari: [
      ["Търси общопрактикуващ лекар по НЗОК", "https://services.nhif.bg/references/lists/opl.xhtml"],
      ["Търси лекар специалист по НЗОК", "https://services.nhif.bg/references/lists/specialists.xhtml"],
      ["Търси високоспециализирана дейност по НЗОК", "https://services.nhif.bg/references/lists/hss.xhtml"]
    ],
    apteki: [
      ["Търси аптека по НЗОК", "https://services.nhif.bg/references/lists/pharmacies.xhtml"]
    ],
    stomatolozi: [
      ["Търси стоматолог по НЗОК", "https://services.nhif.bg/references/lists/dentists.xhtml"],
      ["Провери лекар по дентална медицина в регистъра на БЗС", "https://bzs.bg/register/"]
    ]
  };

  const CORRECTION_TYPES = [
    ["phone","Телефон"],
    ["address","Адрес"],
    ["working_hours","Работно / приемно време"],
    ["doctor","Лекар / специалист"],
    ["service","Услуга / отделение"],
    ["lkk","ЛКК"],
    ["other","Друго"]
  ];

  let cachedUser;
  let cachedEntries;

  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));

  async function getClient(){
    if(window.PopitaiSupabase) return window.PopitaiSupabase;
    return new Promise(resolve => {
      const t=setInterval(()=>{
        if(window.PopitaiSupabase){clearInterval(t);resolve(window.PopitaiSupabase);}
      },50);
    });
  }

  async function getUser(){
    if(cachedUser !== undefined) return cachedUser;
    const client=await getClient();
    const {data}=await client.auth.getUser();
    cachedUser=data?.user || null;
    return cachedUser;
  }

  async function getHealthEntries(){
    if(cachedEntries) return cachedEntries;
    const client=await getClient();
    const {data,error}=await client
      .from("info_entries")
      .select("id,subcategory,entry_type,name,data")
      .eq("category",CATEGORY)
      .eq("publication_status","published")
      .order("name");
    if(error) throw error;
    cachedEntries=data || [];
    return cachedEntries;
  }

  function modal(){
    return document.getElementById("info-modal");
  }

  function showModal(title, lead, body){
    const m=modal();
    if(!m) return;
    m.querySelector("[data-modal-title]").textContent=title;
    m.querySelector("[data-modal-lead]").textContent=lead || "";
    m.querySelector("[data-modal-body]").innerHTML=body;
    m.hidden=false;
    document.body.style.overflow="hidden";
    m.querySelector("[data-modal-body] input, [data-modal-body] select, [data-modal-body] textarea")?.focus();
  }

  function loginBody(){
    return `<div class="health-action-login">
      <p>За изпращане на предложение е нужен профил.</p>
      <a class="info-btn info-btn--primary" href="vhod.html">Вход</a>
    </div>`;
  }

  async function ensureUser(title){
    const user=await getUser();
    if(user) return user;
    showModal(title,"Предложението се изпраща само за администраторска проверка.",loginBody());
    return null;
  }

  function sourceField(){
    return `<details class="health-action-more">
      <summary>Добави източник или бележка</summary>
      <div class="health-action-more-body">
        <label class="health-action-field">Източник / линк
          <input name="source" type="url" inputmode="url" maxlength="500" placeholder="https://…">
        </label>
        <label class="health-action-field">Допълнителна бележка
          <textarea name="note" maxlength="1000" rows="3"></textarea>
        </label>
      </div>
    </details>`;
  }

  function fieldHtml([name,label,type,required]){
    if(type==="select"){
      return `<label class="health-action-field">${esc(label)}${required?" *":""}
        <select name="${esc(name)}"${required?" required":""}>
          <option value="">Избери</option>
          <option value="Да">Да</option>
          <option value="Не">Не</option>
          <option value="Не знам">Не знам</option>
        </select>
      </label>`;
    }
    return `<label class="health-action-field">${esc(label)}${required?" *":""}
      <input name="${esc(name)}" type="${esc(type)}"${required?" required":""} maxlength="220">
    </label>`;
  }

  async function openAdd(type, subcategory){
    const cfg=ADD_CONFIG[type];
    if(!cfg) return;
    if(!await ensureUser(cfg.title)) return;

    showModal(
      cfg.title,
      "Попълни само това, което знаеш. Нищо не се публикува автоматично.",
      `<form class="health-action-form" data-health-add-form>
        <input type="hidden" name="entry_type" value="${esc(type)}">
        <input type="hidden" name="subcategory" value="${esc(subcategory)}">
        <div class="health-action-fields">
          ${cfg.fields.map(fieldHtml).join("")}
        </div>
        ${sourceField()}
        <div class="health-action-status" aria-live="polite"></div>
        <button class="info-btn info-btn--primary health-action-submit" type="submit">Изпрати за проверка</button>
      </form>`
    );

    document.querySelector("[data-health-add-form]")?.addEventListener("submit", submitAdd);
  }

  async function submitAdd(ev){
    ev.preventDefault();
    const form=ev.currentTarget;
    const status=form.querySelector(".health-action-status");
    const fd=new FormData(form);
    const user=await getUser();
    if(!user) return;

    const data={mode:"add"};
    for(const [key,value] of fd.entries()){
      if(["entry_type","subcategory"].includes(key)) continue;
      const clean=String(value||"").trim();
      if(clean) data[key]=clean;
    }

    status.textContent="Изпращане…";
    status.className="health-action-status";

    const client=await getClient();
    const {error}=await client.from("info_submissions").insert({
      category:CATEGORY,
      subcategory:String(fd.get("subcategory")||""),
      entry_type:String(fd.get("entry_type")||""),
      submitted_by:user.id,
      data,
      status:"pending"
    });

    if(error){
      status.textContent="Не успяхме да изпратим. Опитай отново.";
      status.className="health-action-status error";
      return;
    }
    status.textContent="Изпратено е за проверка.";
    status.className="health-action-status ok";
    form.querySelector('button[type="submit"]').disabled=true;
  }

  function correctionTypeOptions(){
    return CORRECTION_TYPES.map(([v,l])=>`<option value="${v}">${l}</option>`).join("");
  }

  function correctionFields(target){
    return `<div class="health-action-target">
      <small>Корекция за</small>
      <strong>${esc(target.name)}</strong>
      ${target.meta ? `<span>${esc(target.meta)}</span>` : ""}
    </div>
    <label class="health-action-field">Какво искате да коригирате? *
      <select name="field_type" required data-health-correction-type>
        <option value="">Избери</option>
        ${correctionTypeOptions()}
      </select>
    </label>
    <div class="health-action-dynamic" data-health-correction-dynamic hidden>
      <label class="health-action-field">Какво е грешно сега? *
        <textarea name="current_problem" required maxlength="1000" rows="3"></textarea>
      </label>
      <label class="health-action-field">Каква е правилната информация? *
        <textarea name="proposed_value" required maxlength="1200" rows="3"></textarea>
      </label>
      ${sourceField()}
    </div>`;
  }

  function wireCorrectionReveal(form){
    const select=form.querySelector("[data-health-correction-type]");
    const dynamic=form.querySelector("[data-health-correction-dynamic]");
    select?.addEventListener("change",()=>{
      dynamic.hidden=!select.value;
    });
  }

  async function openCenterCorrection(target){
    if(!await ensureUser("Предложи корекция")) return;

    showModal(
      "Предложи корекция",
      "Избери какво е неточно и напиши правилната информация.",
      `<form class="health-action-form" data-health-correction-form>
        <input type="hidden" name="target_kind" value="facility">
        <input type="hidden" name="target_key" value="${esc(target.key)}">
        <input type="hidden" name="target_name" value="${esc(target.name)}">
        <input type="hidden" name="subcategory" value="bolnica">
        ${correctionFields(target)}
        <div class="health-action-status" aria-live="polite"></div>
        <button class="info-btn info-btn--primary health-action-submit" type="submit">Изпрати за проверка</button>
      </form>`
    );

    const form=document.querySelector("[data-health-correction-form]");
    wireCorrectionReveal(form);
    form?.addEventListener("submit", submitCorrection);
  }

  async function openListCorrection(subcategory){
    if(!await ensureUser("Предложи корекция")) return;

    let entries=[];
    try{
      const all=await getHealthEntries();
      entries=all.filter(e=>e.subcategory===subcategory || sectionMatchesType(subcategory,e.entry_type));
    }catch{
      showModal("Предложи корекция","Не успяхме да заредим записите.","<p>Опитай отново след малко.</p>");
      return;
    }

    const listId=`health-records-${subcategory}`;
    showModal(
      "Предложи корекция",
      `Раздел: ${SECTION_LABELS[subcategory] || subcategory}`,
      `<form class="health-action-form" data-health-list-correction-form>
        <input type="hidden" name="target_kind" value="entry">
        <input type="hidden" name="subcategory" value="${esc(subcategory)}">

        <label class="health-action-field">Намери запис
          <input type="search" data-health-record-search placeholder="Напиши име…">
        </label>

        <label class="health-action-field">Кой запис искате да коригирате? *
          <select name="entry_id" required data-health-record-select>
            <option value="">Избери</option>
            ${entries.map(e=>`<option value="${esc(e.id)}" data-name="${esc(e.name.toLocaleLowerCase("bg"))}">${esc(e.name)}</option>`).join("")}
          </select>
        </label>

        <div data-health-list-correction-fields hidden>
          ${correctionFields({name:"Избраният запис"})}
        </div>

        <div class="health-action-status" aria-live="polite"></div>
        <button class="info-btn info-btn--primary health-action-submit" type="submit">Изпрати за проверка</button>
      </form>`
    );

    const form=document.querySelector("[data-health-list-correction-form]");
    const search=form?.querySelector("[data-health-record-search]");
    const select=form?.querySelector("[data-health-record-select]");
    const fields=form?.querySelector("[data-health-list-correction-fields]");
    const targetBox=fields?.querySelector(".health-action-target strong");

    search?.addEventListener("input",()=>{
      const q=search.value.trim().toLocaleLowerCase("bg");
      [...select.options].forEach((opt,i)=>{
        if(i===0) return;
        opt.hidden=q && !String(opt.textContent||"").toLocaleLowerCase("bg").includes(q);
      });
    });

    select?.addEventListener("change",()=>{
      const entry=entries.find(e=>e.id===select.value);
      fields.hidden=!entry;
      if(entry && targetBox) targetBox.textContent=entry.name;
    });

    wireCorrectionReveal(form);
    form?.addEventListener("submit", submitCorrection);
  }

  function sectionMatchesType(sub,type){
    const m={
      lekari:["doctor"],
      apteki:["pharmacy"],
      stomatolozi:["dentist"],
      veterinari:["vet"],
      "vet-apteki":["vet_pharmacy"],
      laboratorii:["laboratory"]
    };
    return (m[sub]||[]).includes(type);
  }

  async function submitCorrection(ev){
    ev.preventDefault();
    const form=ev.currentTarget;
    const fd=new FormData(form);
    const status=form.querySelector(".health-action-status");
    const user=await getUser();
    if(!user) return;

    let entryName=String(fd.get("target_name")||"").trim();
    if(fd.get("entry_id")){
      try{
        const entries=await getHealthEntries();
        entryName=entries.find(e=>e.id===fd.get("entry_id"))?.name || entryName;
      }catch{}
    }

    const data={
      mode:"correction",
      target_kind:String(fd.get("target_kind")||""),
      target_key:String(fd.get("target_key")||""),
      entry_id:String(fd.get("entry_id")||""),
      name:entryName,
      field_type:String(fd.get("field_type")||""),
      current_problem:String(fd.get("current_problem")||"").trim(),
      proposed_value:String(fd.get("proposed_value")||"").trim(),
      source:String(fd.get("source")||"").trim(),
      note:String(fd.get("note")||"").trim()
    };

    status.textContent="Изпращане…";
    status.className="health-action-status";
    const client=await getClient();
    const {error}=await client.from("info_submissions").insert({
      category:CATEGORY,
      subcategory:String(fd.get("subcategory")||""),
      entry_type:"correction",
      submitted_by:user.id,
      data,
      status:"pending"
    });

    if(error){
      status.textContent="Не успяхме да изпратим. Опитай отново.";
      status.className="health-action-status error";
      return;
    }
    status.textContent="Корекцията е изпратена за проверка.";
    status.className="health-action-status ok";
    form.querySelector('button[type="submit"]').disabled=true;
  }

  function actionRow(buttons, extraClass=""){
    const row=document.createElement("div");
    row.className=`health-section-actions ${extraClass}`.trim();
    buttons.forEach(b=>row.appendChild(b));
    return row;
  }

  function correctionButton(label="✏️ Предложи корекция"){
    const b=document.createElement("button");
    b.type="button";
    b.className="info-btn health-correction-btn";
    b.textContent=label;
    return b;
  }

  function addOfficialHealthActions(){
    Object.entries(OFFICIAL_HEALTH_ACTIONS).forEach(([sub, actions])=>{
      const section=document.getElementById(`zdrave-${sub}`);
      if(!section || section.querySelector(":scope > .health-official-actions")) return;

      const box=document.createElement("div");
      box.className="health-official-actions";
      box.setAttribute("aria-label","Официални справки");
      box.innerHTML=`<div class="health-official-actions-title">Официални справки</div><div class="health-official-actions-links"></div>`;
      const links=box.querySelector(".health-official-actions-links");

      actions.forEach(([label,url])=>{
        const a=document.createElement("a");
        a.className="info-btn health-official-link";
        a.href=url;
        a.target="_blank";
        a.rel="noopener";
        a.textContent=label;
        links.appendChild(a);
      });

      const heading=section.querySelector(".info-subsection-title") || section.firstElementChild;
      if(heading?.nextSibling) section.insertBefore(box, heading.nextSibling);
      else section.prepend(box);
    });
  }

  function addCenterButtons(){
    const targets=[
      {
        key:"mbal-sv-nikolay",
        name:'МБАЛ „Св. Николай Чудотворец“ – Лом',
        find:()=>[...document.querySelectorAll("#zdrave-bolnica article,.hospital-feature,.info-card")].find(x=>/МБАЛ.*Николай Чудотворец/i.test(x.textContent||""))
      },
      {
        key:"dkc-1-lom",
        name:"ДКЦ 1 – Лом",
        meta:'ул. „Тодор Каблешков“ №2',
        find:()=>document.querySelector(".health-center-card--dkc")
      },
      {
        key:"hipokrat-53",
        name:'МЦ „Хипократ 53“',
        meta:'ул. „Петър Берковски“ №3',
        find:()=>document.querySelector(".health-center-card--hipokrat")
      },
      {
        key:"mc-zdrave-lom",
        name:'МЦ „Здраве“ – Лом',
        meta:'ул. „Панайот Волов“ №6',
        find:()=>document.querySelector(".health-center-card--zdrave")
      }
    ];

    targets.forEach(target=>{
      const card=target.find();
      if(!card || card.querySelector(":scope > .health-facility-correction")) return;
      const b=correctionButton();
      b.addEventListener("click",()=>openCenterCorrection(target));
      const row=actionRow([b],"health-facility-correction");
      card.appendChild(row);
    });
  }

  function addSectionButtons(){
    Object.keys(SECTION_LABELS).forEach(sub=>{
      const section=document.getElementById(`zdrave-${sub}`);
      if(!section || section.querySelector(":scope > .health-list-actions")) return;

      // Existing "Добави..." stays; this row adds one correction control for the whole list.
      const b=correctionButton();
      b.addEventListener("click",()=>openListCorrection(sub));
      section.appendChild(actionRow([b],"health-list-actions"));
    });
  }

  function interceptHealthAddButtons(){
    document.addEventListener("click",ev=>{
      const btn=ev.target.closest('[data-info-add][data-info-category="zdrave"]');
      if(!btn) return;
      ev.preventDefault();
      ev.stopImmediatePropagation();
      openAdd(btn.dataset.infoAdd,btn.dataset.infoSubcategory);
    },true);
  }

  function relabelMedicalCenterAdd(){
    document.querySelectorAll('#zdrave-bolnica [data-info-add="medical_center"]').forEach(btn=>{
      btn.textContent="＋ Добави лечебно заведение";
    });
    // This is too granular for the public first version; keep it out of the action row.
    document.querySelectorAll('#zdrave-bolnica [data-info-add="hospital_department"]').forEach(btn=>{
      btn.hidden=true;
      btn.setAttribute("aria-hidden","true");
    });
  }

  function mount(){
    addOfficialHealthActions();
    addCenterButtons();
    addSectionButtons();
    relabelMedicalCenterAdd();
  }

  document.addEventListener("DOMContentLoaded",()=>{
    interceptHealthAddButtons();
    mount();
    let n=0;
    const timer=setInterval(()=>{
      mount();
      if(++n>14) clearInterval(timer);
    },500);
  });
})();