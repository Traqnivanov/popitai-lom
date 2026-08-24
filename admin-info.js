(() => {
  "use strict";

  let client;
  let currentUser = null;
  let currentRole = null;
  let infoPendingCount = 0;

  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
  const fmt = v => v ? new Date(v).toLocaleString("bg-BG") : "";
  const nowIso = () => new Date().toISOString();
  const isModerator = () => currentRole === "moderator";

  const CATEGORY_LABELS = {
    zdrave:"Здраве",
    institucii:"Институции",
    transport:"Транспорт",
    obrazovanie:"Образование и култура",
    banki:"Банки и банкомати",
    komunalni:"Комунални и ежедневни услуги"
  };

  const SUBCATEGORY_LABELS = {
    bolnica:"Болница и лечебни заведения",
    lekari:"Лекари",
    apteki:"Аптеки",
    stomatolozi:"Стоматолози",
    veterinari:"Ветеринари",
    "vet-apteki":"Ветеринарни аптеки",
    laboratorii:"Лаборатории и диагностика",
    obshtina:"Община",
    policia:"Полиция",
    pojarna:"Пожарна",
    speshna:"Спешна помощ",
    vik:"ВиК",
    tok:"Електроенергия",
    avtobusi:"Автобуси",
    bdz:"ЖП / БДЖ",
    taksita:"Таксита",
    uchilishta:"Училища",
    "detski-gradini":"Детски градини",
    chitalishta:"Читалища",
    biblioteka:"Библиотека",
    muzei:"Музей",
    "shkoli-kursove":"Школи и курсове",
    ofisi:"Банкови офиси",
    bankomati:"Банкомати",
    "internet-tv":"Интернет и телевизия",
    kurieri:"Куриери",
    chistota:"Чистота и отпадъци"
  };

  const catLabel = v => CATEGORY_LABELS[v] || v || "";
  const subLabel = v => SUBCATEGORY_LABELS[v] || v || "";

  const PUBLICATION_LABELS = {
    published:"Публикуван",
    review:"За проверка",
    hidden:"Скрит"
  };

  const RELIABILITY_LABELS = {
    official:"Официално потвърден",
    strong:"Силно потвърден",
    secondary:"Вторичен източник",
    conflict:"Конфликт",
    unverified:"Непотвърден"
  };

  async function getClient(){
    if(window.PopitaiSupabase) return window.PopitaiSupabase;
    return new Promise(resolve => {
      const t = setInterval(() => {
        if(window.PopitaiSupabase){ clearInterval(t); resolve(window.PopitaiSupabase); }
      },50);
    });
  }

  async function allowed(){
    client = client || await getClient();
    const {data:u} = await client.auth.getUser();
    currentUser = u?.user || null;
    if(!currentUser) return false;
    const {data:p} = await client.from("profiles").select("role,is_blocked").eq("id",currentUser.id).maybeSingle();
    currentRole = p?.role || null;
    return ["admin","moderator"].includes(currentRole) && p?.is_blocked !== true;
  }

  function ensureModeratorReviewShortcut(){
    if(!isModerator()) return null;
    const reviewGroup=document.querySelector('.admin-menu [data-admin-menu-group-items="review"]');
    if(!reviewGroup) return null;
    let button=reviewGroup.querySelector("[data-info-moderator-review]");
    if(!button){
      button=document.createElement("button");
      button.type="button";
      button.dataset.infoModeratorReview="1";
      button.addEventListener("click",open);
      reviewGroup.appendChild(button);
    }
    return button;
  }

  function ensureButton(){
    const menu = document.querySelector(".admin-menu");
    if(!menu) return;
    let b = menu.querySelector("[data-info-admin]");
    if(!b){
      b = document.createElement("button");
      b.type = "button";
      b.dataset.infoAdmin = "1";
      b.addEventListener("click",open);
      (menu.querySelector('[data-admin-menu-group-items="content"]') || menu).appendChild(b);
    }
    if(isModerator()){
      b.textContent="Инфо Лом";
      b.dataset.infoPendingLabel="1";
      ensureModeratorReviewShortcut();
    }else if(!b.dataset.infoPendingLabel){
      b.textContent = "Инфо Лом";
    }
  }

  function pendingSubmissionQuery(){
    let q=client.from("info_submissions").select("id",{count:"exact",head:true}).eq("status","pending");
    if(isModerator()) q=q.neq("submitted_by",currentUser.id);
    return q;
  }

  function pendingReportQuery(){
    let q=client.from("info_error_reports").select("id",{count:"exact",head:true}).eq("status","pending");
    if(isModerator()) q=q.neq("reported_by",currentUser.id);
    return q;
  }

  async function refreshPendingIndicator(){
    try{
      client = client || await getClient();
      const [{count:subsCount,error:subsErr},{count:reportsCount,error:reportsErr}] = await Promise.all([
        pendingSubmissionQuery(),
        pendingReportQuery()
      ]);
      if(subsErr) throw subsErr;
      if(reportsErr) throw reportsErr;
      const pending = (subsCount||0) + (reportsCount||0);
      const b = document.querySelector(".admin-menu [data-info-admin]");
      if(b){
        if(isModerator()){
          b.textContent="Инфо Лом";
          b.dataset.infoPendingLabel="1";
          const review=ensureModeratorReviewShortcut();
          if(review){
            review.innerHTML=`Инфо Лом <span class="admin-badge">${pending}</span>`;
            review.hidden=pending<=0;
          }
        }else{
          b.textContent = pending ? `Инфо Лом (${pending})` : "Инфо Лом";
          b.dataset.infoPendingLabel = "1";
        }
      }
      injectPendingSummary(pending);
    }catch(err){ console.warn("Info pending indicator",err); }
  }

  function injectPendingSummary(pending){
    const box=document.querySelector(".admin-content");
    if(!box) return;

    const existing=box.querySelector("[data-info-pending-summary]");
    const onInfoPage=!!box.querySelector("#info-admin-list");
    const t=String(box.textContent||"").toLocaleLowerCase("bg");
    const isPendingView=t.includes("чакащи") || t.includes("съдържание за преглед");

    if(!pending || onInfoPage || !isPendingView){
      if(existing) existing.remove();
      return;
    }

    if(existing) return;

    const card=document.createElement("article");
    card.className="info-admin-pending-summary";
    card.dataset.infoPendingSummary="1";
    card.innerHTML=`<div><strong>Инфо Лом: ${pending} ${pending===1?"чакаща заявка":"чакащи заявки"}</strong><span>Има съдържание за проверка от екипа.</span></div><button type="button">Отвори Инфо Лом</button>`;
    card.querySelector("button")?.addEventListener("click",open);
    const empty=box.querySelector(".empty-card");
    if(empty) empty.before(card); else box.prepend(card);
  }

  function adminStyles(){
    if(document.getElementById("info-admin-v2-style")) return;
    const s = document.createElement("style");
    s.id = "info-admin-v2-style";
    s.textContent = `
      .info-admin-toolbar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
      .info-admin-toolbar button,.info-admin-toolbar a{padding:9px 12px;border:1px solid #d7dce3;border-radius:10px;background:#fff;color:#16233a;text-decoration:none;cursor:pointer}
      .info-admin-toolbar button.active{border-color:#1e5da8;background:#eef5ff}
      .info-admin-card{border:1px solid #dfe4ea;border-radius:14px;padding:14px;margin-bottom:12px;background:#fff}
      .info-admin-card h3{margin:0 0 6px;font-size:17px}
      .info-admin-meta{font-size:13px;color:#596579;margin:3px 0}
      .info-admin-box{background:#f7f9fc;border:1px solid #e4e8ef;border-radius:10px;padding:10px;margin-top:10px;white-space:pre-wrap;overflow-wrap:anywhere}
      .info-admin-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
      .info-admin-actions button{padding:9px 12px;border:0;border-radius:9px;cursor:pointer;font-weight:600}
      .info-admin-approve{background:#0d7a43;color:#fff}
      .info-admin-reject{background:#f5e7e7;color:#8f1f1f}
      .info-admin-secondary{background:#eaf1fb;color:#174d8d}
      .info-admin-review{margin-top:12px;padding:12px;border:1px solid #dce3eb;border-radius:12px;background:#fbfcfe}
      .info-admin-review label{display:block;margin:9px 0;font-size:13px;font-weight:600}
      .info-admin-review input,.info-admin-review select,.info-admin-review textarea{box-sizing:border-box;width:100%;padding:9px;border:1px solid #ccd3dc;border-radius:8px;margin-top:4px;font:inherit}
      .info-admin-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .info-admin-msg{margin-top:10px;font-size:13px}.info-admin-msg.ok{color:#0b6e3b}.info-admin-msg.error{color:#a11f1f}
      .info-admin-history{font-size:12px;margin-top:6px;color:#687386}
      .info-admin-fields{display:grid;gap:8px;margin-top:10px}
      .info-admin-field{display:grid;grid-template-columns:minmax(120px,180px) 1fr;gap:10px;padding:8px 10px;background:#f7f9fc;border:1px solid #e4e8ef;border-radius:9px}
      .info-admin-field strong{color:#24324a}.info-admin-field span{overflow-wrap:anywhere}
      .info-admin-pending-summary{display:flex;justify-content:space-between;align-items:center;gap:14px;border:1px solid #b9d1f2;background:#eef5ff;border-radius:14px;padding:14px 16px;margin-bottom:14px}
      .info-admin-pending-summary div{display:grid;gap:4px}.info-admin-pending-summary span{color:#52627a;font-size:13px}
      .info-admin-pending-summary button{border:0;border-radius:10px;padding:10px 13px;background:#1261d6;color:#fff;font-weight:700;cursor:pointer}
      @media(max-width:700px){.info-admin-grid{grid-template-columns:1fr}.info-admin-field{grid-template-columns:1fr}.info-admin-pending-summary{align-items:flex-start;flex-direction:column}}
    `;
    document.head.appendChild(s);
  }

  function syncPendingUi(count){
    infoPendingCount = Number(count || 0);
    ensureButton();

    const existing = document.querySelector("[data-info-global-pending]");
    if(infoPendingCount <= 0){
      existing?.remove();
      return;
    }

    if(existing){
      const title = existing.querySelector("[data-info-global-pending-title]");
      if(title) title.textContent = `Инфо Лом: ${infoPendingCount} чакаща${infoPendingCount === 1 ? "" : "и"} заявка${infoPendingCount === 1 ? "" : "и"}`;
    }
  }

  async function loadData(){
    let submissions=client.from("info_submissions").select("id,category,subcategory,entry_type,submitted_by,data,status,admin_note,created_at,reviewed_at,reviewed_by").eq("status","pending").order("created_at",{ascending:false});
    let reports=client.from("info_error_reports").select("id,entry_id,reported_by,category,subcategory,description,status,admin_note,created_at,reviewed_at,reviewed_by").eq("status","pending").order("created_at",{ascending:false});
    if(isModerator()){
      submissions=submissions.neq("submitted_by",currentUser.id);
      reports=reports.neq("reported_by",currentUser.id);
    }
    const [e,s,r] = await Promise.all([
      client.from("info_entries").select("id,category,subcategory,entry_type,name,data,publication_status,reliability_status,confirmed_at,confirmed_source,confirmation_note,updated_at").order("category").order("name"),
      submissions,
      reports
    ]);
    if(e.error) throw e.error; if(s.error) throw s.error; if(r.error) throw r.error;
    return {entries:e.data||[],subs:s.data||[],reports:r.data||[]};
  }

  function normalizeNzokValue(value){
    if(value === true || value === false) return value;
    const v = String(value ?? "").trim().toLowerCase();
    if(v === "да" || v === "yes" || v === "true" || v === "1") return true;
    if(v === "не" || v === "no" || v === "false" || v === "0") return false;
    return null;
  }

  function safeDataForNewEntry(raw){
    const src={...(raw||{})};
    ["mode","name","source","note","details","current_problem","proposed_value","field_type","target_kind","target_key","entry_id"].forEach(k=>delete src[k]);
    if(Object.prototype.hasOwnProperty.call(src,"nzok")){
      const normalizedNzok=normalizeNzokValue(src.nzok);
      if(normalizedNzok===null) delete src.nzok;
      else src.nzok=normalizedNzok;
    }
    return src;
  }

  async function insertHistory({entryId,fieldName,oldValue,newValue,reason,source}){
    const {error}=await client.from("info_entry_history").insert({
      entry_id:entryId,
      field_name:fieldName,
      old_value:oldValue==null?null:String(oldValue),
      new_value:newValue==null?null:String(newValue),
      changed_by:currentUser?.id||null,
      reason:String(reason||"Промяна от екипа"),
      source:String(source||"Проверка от екипа")
    });
    if(error) throw error;
  }

  async function markSubmission(id,status,adminNote){
    const {error}=await client.from("info_submissions").update({status,admin_note:adminNote||"",reviewed_at:nowIso(),reviewed_by:currentUser?.id||null}).eq("id",id);
    if(error) throw error;
    infoPendingCount = Math.max(0, infoPendingCount - 1);
    ensureButton();
  }

  async function markReport(id,status,adminNote){
    const {error}=await client.from("info_error_reports").update({status,admin_note:adminNote||"",reviewed_at:nowIso(),reviewed_by:currentUser?.id||null}).eq("id",id);
    if(error) throw error;
    infoPendingCount = Math.max(0, infoPendingCount - 1);
    ensureButton();
  }

  function reliabilityOptions(selected="strong"){
    return ["official","strong","secondary","conflict","unverified"].map(v=>`<option value="${esc(v)}"${v===selected?' selected':''}>${esc(RELIABILITY_LABELS[v] || v)}</option>`).join("");
  }

  function editableDataRows(data){
    const d=data||{};
    const keys=Object.keys(d).sort((a,b)=>a.localeCompare(b,"bg"));
    if(!keys.length)return '<p class="info-admin-meta">Няма допълнителни полета.</p>';
    return keys.map(key=>{
      const value=d[key];
      const shown=typeof value==="string"?value:JSON.stringify(value,null,2);
      if(key==="nzok"){
        const normalized=normalizeNzokValue(value);
        const selected=normalized===true?"yes":normalized===false?"no":"unknown";
        return `<label>${esc(humanLabel(key))}<select data-edit-data-key="${esc(key)}" data-edit-nzok="1"><option value="yes"${selected==="yes"?" selected":""}>Да</option><option value="no"${selected==="no"?" selected":""}>Не</option><option value="unknown"${selected==="unknown"?" selected":""}>Не знам</option></select></label>`;
      }
      return `<label>${esc(humanLabel(key))}<textarea rows="${String(shown).length>90?4:2}" data-edit-data-key="${esc(key)}">${esc(shown)}</textarea></label>`;
    }).join("");
  }

  function entryCard(x){
    return `<article class="info-admin-card" data-entry-card="${esc(x.id)}"><h3>${esc(x.name)}</h3><div class="info-admin-meta">${esc(catLabel(x.category))} · ${esc(subLabel(x.subcategory))}</div><div class="info-admin-meta">${esc(PUBLICATION_LABELS[x.publication_status] || x.publication_status)} · ${esc(RELIABILITY_LABELS[x.reliability_status] || x.reliability_status)}</div><div class="info-admin-history">Последна промяна: ${esc(fmt(x.updated_at))}</div><div class="info-admin-actions"><button type="button" class="info-admin-secondary" data-edit-entry="${esc(x.id)}">Редактирай</button>${x.publication_status==="hidden"?`<button type="button" class="info-admin-secondary" data-restore-entry="${esc(x.id)}">Върни</button>`:`<button type="button" class="info-admin-reject" data-remove-entry="${esc(x.id)}">Премахни</button>`}</div><div class="info-admin-review" data-edit-panel="${esc(x.id)}" hidden><div class="info-admin-grid"><label>Име<input data-edit-name value="${esc(x.name)}"></label><label>Публичен статус<select data-edit-publication><option value="published"${x.publication_status==="published"?" selected":""}>${esc(PUBLICATION_LABELS.published)}</option><option value="review"${x.publication_status==="review"?" selected":""}>${esc(PUBLICATION_LABELS.review)}</option><option value="hidden"${x.publication_status==="hidden"?" selected":""}>${esc(PUBLICATION_LABELS.hidden)}</option></select></label><label>Надеждност<select data-edit-reliability>${reliabilityOptions(x.reliability_status||"strong")}</select></label><label>Потвърден източник<input data-edit-source value="${esc(x.confirmed_source||"")}"></label></div><details class="info-admin-review" open><summary><strong>Данни на записа</strong></summary><div data-edit-data-fields>${editableDataRows(x.data)}</div></details><label>Причина за промяната *<input data-edit-reason placeholder="Напр. актуализиран телефон от официален източник"></label><label>Бележка за потвърждението<textarea rows="2" data-edit-confirmation-note>${esc(x.confirmation_note||"")}</textarea></label><div class="info-admin-box" data-edit-preview hidden></div><div class="info-admin-actions"><button type="button" class="info-admin-secondary" data-preview-entry="${esc(x.id)}">Преглед на промените</button><button type="button" class="info-admin-approve" data-save-entry="${esc(x.id)}">Запази промените</button></div><div class="info-admin-msg" data-msg></div></div></article>`;
  }

  function humanLabel(key){
    const labels={name:"Име",address:"Адрес",phone:"Телефон",working_hours:"Работно време",services:"Услуги / изследвания",specialty:"Специалност",facility:"Лечебно заведение / кабинет",facility_type:"Вид",nzok:"НЗОК",availability:"Денонощна / дежурна",source:"Източник / линк",note:"Бележка",details:"Допълнителна информация"};
    return labels[key] || key.replaceAll("_"," ");
  }

  function humanSubmissionFields(d){
    const hidden=new Set(["mode"]);
    const rows=Object.entries(d||{}).filter(([k,v])=>!hidden.has(k) && v!==null && v!==undefined && String(v).trim()!=="");
    if(!rows.length) return '<div class="info-admin-box">Няма въведени данни.</div>';
    return `<div class="info-admin-fields">${rows.map(([k,v])=>`<div class="info-admin-field"><strong>${esc(humanLabel(k))}</strong><span>${esc(typeof v==="object"?JSON.stringify(v):v)}</span></div>`).join("")}</div>`;
  }

  function submissionCard(x,entries){
    const d=x.data||{};
    const correction=d.mode==="correction"||x.entry_type==="correction";
    const selectedEntry=d.entry_id?entries.find(e=>e.id===d.entry_id):null;
    return `<article class="info-admin-card" data-submission-card="${esc(x.id)}"><h3>${esc(correction?(d.name||"Предложена корекция"):(d.name||"Нов предложен запис"))}</h3><div class="info-admin-meta">${esc(catLabel(x.category))} · ${esc(subLabel(x.subcategory))}</div><div class="info-admin-meta">Подадено: ${esc(fmt(x.created_at))}</div>${correction?`<div class="info-admin-box">Какво: ${esc(d.field_type||"друго")}\nСега: ${esc(d.current_problem||"")}\nПредложено: ${esc(d.proposed_value||"")}${d.source?`\nИзточник: ${esc(d.source)}`:""}${d.note?`\nБележка: ${esc(d.note)}`:""}</div>`:humanSubmissionFields(d)}<div class="info-admin-actions"><button type="button" class="info-admin-approve" data-sub-review="${esc(x.id)}">${correction?"Прегледай и приложи":"Прегледай и одобри"}</button><button type="button" class="info-admin-secondary" data-sub-return="${esc(x.id)}">Върни за корекция</button><button type="button" class="info-admin-reject" data-sub-reject="${esc(x.id)}">Отхвърли</button></div><div class="info-admin-review" data-sub-panel="${esc(x.id)}" hidden>${correction?`<div class="info-admin-grid"><label>Запис<select data-target-entry><option value="">Избери запис</option>${entries.filter(e=>e.category===x.category&&e.subcategory===x.subcategory).map(e=>`<option value="${esc(e.id)}"${selectedEntry?.id===e.id?' selected':''}>${esc(e.name)}</option>`).join("")}</select></label><label>Поле в data (JSON key)<input data-field-key value="${esc(["phone","address","working_hours"].includes(d.field_type)?d.field_type:"")}" placeholder="напр. phone, address, services"></label></div><label>Нова стойност<textarea rows="3" data-new-value>${esc(d.proposed_value||"")}</textarea></label><label>Причина<input data-reason value="${esc(d.current_problem||"Одобрена потребителска корекция")}"></label><label>Източник<input data-source value="${esc(d.source||"")}" placeholder="Официален източник / проверка"></label><label>Бележка от екипа<textarea rows="2" data-admin-note>${esc(d.note||"")}</textarea></label><div class="info-admin-actions"><button type="button" class="info-admin-approve" data-apply-correction="${esc(x.id)}">Потвърди промяната</button></div>`:`<div class="info-admin-grid"><label>Публичен статус<select data-publication><option value="published">${esc(PUBLICATION_LABELS.published)}</option><option value="review">${esc(PUBLICATION_LABELS.review)}</option><option value="hidden">${esc(PUBLICATION_LABELS.hidden)}</option></select></label><label>Надеждност<select data-reliability>${reliabilityOptions("strong")}</select></label></div><label>Потвърден източник *<input data-source value="${esc(d.source||"")}" placeholder="Официален източник / проверка"></label><label>Бележка от екипа<textarea rows="2" data-admin-note>${esc(d.note||"")}</textarea></label><div class="info-admin-actions"><button type="button" class="info-admin-approve" data-approve-add="${esc(x.id)}">Създай записа</button></div>`}<div class="info-admin-msg" data-msg></div></div></article>`;
  }

  function reportCard(x,entries){
    const related=x.entry_id?entries.find(e=>e.id===x.entry_id):null;
    return `<article class="info-admin-card" data-report-card="${esc(x.id)}"><h3>Сигнал за грешка</h3><div class="info-admin-meta">${esc(catLabel(x.category))} · ${esc(subLabel(x.subcategory))} · ${esc(fmt(x.created_at))}</div>${related?`<div class="info-admin-meta">Запис: <strong>${esc(related.name)}</strong></div>`:""}<div class="info-admin-box">${esc(x.description||"")}</div><div class="info-admin-actions"><button type="button" class="info-admin-secondary" data-report-review="${esc(x.id)}">Обработи</button><button type="button" class="info-admin-secondary" data-report-return="${esc(x.id)}">Поискай още информация</button><button type="button" class="info-admin-reject" data-report-reject="${esc(x.id)}">Отхвърли</button></div><div class="info-admin-review" data-report-panel="${esc(x.id)}" hidden><label>Свързан запис<select data-target-entry><option value="">Без промяна по запис</option>${entries.filter(e=>e.category===x.category&&(!x.subcategory||e.subcategory===x.subcategory)).map(e=>`<option value="${esc(e.id)}"${related?.id===e.id?' selected':''}>${esc(e.name)}</option>`).join("")}</select></label><div class="info-admin-grid"><label>Поле в data (по желание)<input data-field-key placeholder="напр. phone, address"></label><label>Нова стойност<input data-new-value></label></div><label>Причина / бележка<textarea rows="2" data-admin-note>${esc(x.description||"")}</textarea></label><label>Източник<input data-source placeholder="Официален източник / проверка"></label><div class="info-admin-actions"><button type="button" class="info-admin-approve" data-resolve-report="${esc(x.id)}">Маркирай като обработен</button></div><div class="info-admin-msg" data-msg></div></div></article>`;
  }

  function panelMsg(panel,text,ok=false){ const el=panel?.querySelector("[data-msg]"); if(!el)return; el.textContent=text; el.className=`info-admin-msg ${ok?"ok":"error"}`; }

  async function open(){
    if(!(await allowed())) return;
    adminStyles();
    const menu=document.querySelector(".admin-menu");
    menu?.querySelectorAll("button").forEach(b=>b.classList.toggle("active",b.dataset.infoAdmin==="1"||b.dataset.infoModeratorReview==="1"));
    const box=window.PopitaiAdminShell?.ensure?.("Инфо Лом") || document.querySelector("#admin-view-content");
    if(!box)return;
    box.innerHTML='<article class="empty-card"><p>Зареждане…</p></article>';
    try{ render(await loadData(),box); }catch(err){ console.error(err); box.innerHTML='<article class="empty-card"><p>Не успяхме да заредим данните.</p></article>'; }
  }

  function render(state,box){
    const {entries,subs,reports}=state;
    box.innerHTML=`<div class="info-admin-toolbar"><button type="button" data-tab="entries">Записи (${entries.length})</button><button type="button" data-tab="subs">Предложения (${subs.length})</button><button type="button" data-tab="reports">Сигнали (${reports.length})</button><a href="info.html" target="_blank" rel="noopener">Виж страницата</a></div><div id="info-admin-list"></div>`;
    const draw=tab=>{box.querySelectorAll("[data-tab]").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));const out=document.getElementById("info-admin-list");if(!out)return;if(tab==="entries"){out.innerHTML=`<div class="info-admin-toolbar"><input type="search" data-entry-search placeholder="Търси по име, адрес, телефон, раздел..."><select data-entry-category><option value="">Всички раздели</option>${[...new Set(entries.map(e=>e.category))].sort().map(v=>`<option value="${esc(v)}">${esc(catLabel(v))}</option>`).join("")}</select><select data-entry-status><option value="">Всички статуси</option><option value="published">Публикувани</option><option value="review">За проверка</option><option value="hidden">Скрити</option></select></div><div class="info-admin-meta" data-entry-count></div><div data-entry-groups></div>`;renderEntryGroups(out,entries);wireEntryFilters(out,entries);}else if(tab==="subs"){out.innerHTML=`<div class="stack-list">${subs.map(x=>submissionCard(x,entries)).join("")||'<article class="empty-card"><p>Няма чакащи предложения.</p></article>'}</div>`;wireSubmissions(out,state);}else{out.innerHTML=`<div class="stack-list">${reports.map(x=>reportCard(x,entries)).join("")||'<article class="empty-card"><p>Няма чакащи сигнали.</p></article>'}</div>`;wireReports(out,state);}};
    box.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>draw(b.dataset.tab)));
    box.querySelector('[data-tab="'+(subs.length?"subs":reports.length?"reports":"entries")+'"]')?.click();
  }

  function entrySearchText(entry){
    const flatData = JSON.stringify(entry.data || {});
    return [entry.name,catLabel(entry.category),subLabel(entry.subcategory),entry.category,entry.subcategory,entry.entry_type,flatData].join(" ").toLocaleLowerCase("bg");
  }

  function renderEntryGroups(root,allEntries){
    const search=(root.querySelector("[data-entry-search]")?.value||"").trim().toLocaleLowerCase("bg");
    const category=root.querySelector("[data-entry-category]")?.value||"";
    const status=root.querySelector("[data-entry-status]")?.value||"";
    const filtered=allEntries.filter(e=>{if(category&&e.category!==category)return false;if(status&&e.publication_status!==status)return false;if(search&&!entrySearchText(e).includes(search))return false;return true;});
    const count=root.querySelector("[data-entry-count]");if(count)count.textContent=`Показани ${filtered.length} от ${allEntries.length} записа`;
    const groupsRoot=root.querySelector("[data-entry-groups]");if(!groupsRoot)return;
    if(!filtered.length){groupsRoot.innerHTML='<article class="empty-card"><p>Няма намерени записи.</p></article>';return;}
    const byCategory=new Map();filtered.forEach(e=>{if(!byCategory.has(e.category))byCategory.set(e.category,[]);byCategory.get(e.category).push(e);});
    groupsRoot.innerHTML=[...byCategory.entries()].sort((a,b)=>catLabel(a[0]).localeCompare(catLabel(b[0]),"bg")).map(([category,items])=>`<details class="info-admin-group" ${search||category===root.querySelector("[data-entry-category]")?.value?"open":""}><summary><strong>${esc(catLabel(category))}</strong> <span>(${items.length})</span></summary><div class="stack-list">${items.map(entryCard).join("")}</div></details>`).join("");
    wireEntries(groupsRoot,{entries:allEntries});
  }

  function wireEntryFilters(root,entries){
    const rerender=()=>renderEntryGroups(root,entries);
    root.querySelector("[data-entry-search]")?.addEventListener("input",rerender);
    root.querySelector("[data-entry-category]")?.addEventListener("change",rerender);
    root.querySelector("[data-entry-status]")?.addEventListener("change",rerender);
  }

  async function removeEntrySafely(entry){
    const first=window.confirm(`Премахване на „${entry.name}“\n\nЗаписът ще бъде скрит от публичния сайт, но няма да бъде изтрит от Supabase и историята ще се запази.\n\nПродължавате ли?`);
    if(!first)return;
    const second=window.confirm(`Наистина ли искате да премахнете „${entry.name}“ от публичния сайт?`);if(!second)return;
    try{
      const oldStatus=entry.publication_status;
      const {error}=await client.from("info_entries").update({publication_status:"hidden",updated_by:currentUser?.id||null}).eq("id",entry.id);if(error)throw error;
      await insertHistory({entryId:entry.id,fieldName:"publication_status",oldValue:oldStatus,newValue:"hidden",reason:"Премахнато от публичния сайт от екипа",source:entry.confirmed_source||"Промяна от екипа"});
      await open();
    }catch(err){console.error(err);window.alert("Неуспешно премахване. Проверете записа преди повторен опит.");}
  }

  async function restoreEntry(entry){
    if(!window.confirm(`Да се върне „${entry.name}“ като публикуван запис?`))return;
    try{
      const {error}=await client.from("info_entries").update({publication_status:"published",updated_by:currentUser?.id||null}).eq("id",entry.id);if(error)throw error;
      await insertHistory({entryId:entry.id,fieldName:"publication_status",oldValue:"hidden",newValue:"published",reason:"Върнат в публичния сайт от екипа",source:entry.confirmed_source||"Промяна от екипа"});
      await open();
    }catch(err){console.error(err);window.alert("Неуспешно връщане на записа.");}
  }

  function parseEditedValue(text,original){
    const raw=String(text??"").trim();
    if(Array.isArray(original)||(original&&typeof original==="object")){try{return raw?JSON.parse(raw):(Array.isArray(original)?[]:{});}catch{throw new Error("Невалиден формат в едно от сложните полета.");}}
    if(typeof original==="boolean"){if(raw==="true"||raw==="Да")return true;if(raw==="false"||raw==="Не")return false;}
    if(typeof original==="number"&&raw!==""&&!Number.isNaN(Number(raw)))return Number(raw);
    return raw;
  }

  function collectEntryChanges(panel,entry){
    const changes=[];
    const next={name:panel.querySelector("[data-edit-name]")?.value.trim()||"",publication_status:panel.querySelector("[data-edit-publication]")?.value||entry.publication_status,reliability_status:panel.querySelector("[data-edit-reliability]")?.value||entry.reliability_status,confirmed_source:panel.querySelector("[data-edit-source]")?.value.trim()||"",confirmation_note:panel.querySelector("[data-edit-confirmation-note]")?.value.trim()||"",data:{...(entry.data||{})}};
    const add=(field,oldValue,newValue)=>{if(JSON.stringify(oldValue)!==JSON.stringify(newValue))changes.push({field,old:oldValue,new:newValue});};
    add("name",entry.name,next.name);add("publication_status",entry.publication_status,next.publication_status);add("reliability_status",entry.reliability_status,next.reliability_status);add("confirmed_source",entry.confirmed_source||"",next.confirmed_source);add("confirmation_note",entry.confirmation_note||"",next.confirmation_note);
    panel.querySelectorAll("[data-edit-data-key]").forEach(el=>{const key=el.dataset.editDataKey;const oldValue=entry.data?.[key];let newValue;if(key==="nzok"&&el.dataset.editNzok==="1"){if(el.value==="yes")newValue=true;else if(el.value==="no")newValue=false;else newValue=undefined;}else{newValue=parseEditedValue(el.value,oldValue);}if(JSON.stringify(oldValue)!==JSON.stringify(newValue)){if(newValue===undefined)delete next.data[key];else next.data[key]=newValue;changes.push({field:`data.${key}`,old:oldValue,new:newValue});}});
    return {next,changes};
  }

  function renderChangePreview(panel,changes){
    const box=panel.querySelector("[data-edit-preview]");if(!box)return;box.hidden=false;if(!changes.length){box.innerHTML="<strong>Няма промени.</strong>";return;}box.innerHTML=`<strong>Ще се променят ${changes.length} полета:</strong>`+changes.map(c=>`<div style="margin-top:8px"><b>${esc(c.field)}</b><br>Сега: ${esc(typeof c.old==="object"?JSON.stringify(c.old):c.old??"(празно)")}<br>Ново: ${esc(typeof c.new==="object"?JSON.stringify(c.new):c.new??"(празно)")}</div>`).join("");
  }

  async function saveEntryEdit(entry,panel){
    const reason=panel.querySelector("[data-edit-reason]")?.value.trim()||"";if(!reason){panelMsg(panel,"Попълнете причина за промяната.");return;}
    let collected;try{collected=collectEntryChanges(panel,entry);}catch(err){panelMsg(panel,err.message||"Невалидна стойност.");return;}
    const {next,changes}=collected;if(!changes.length){panelMsg(panel,"Няма направени промени.");return;}if(!next.name){panelMsg(panel,"Името не може да е празно.");return;}if(!next.confirmed_source){panelMsg(panel,"Попълнете потвърден източник.");return;}
    renderChangePreview(panel,changes);const summary=changes.map(c=>`${c.field}: ${typeof c.old==="object"?JSON.stringify(c.old):c.old??"(празно)"} → ${typeof c.new==="object"?JSON.stringify(c.new):c.new??"(празно)"}`).join("\n");if(!window.confirm(`Да се запишат тези промени?\n\n${summary}`))return;
    try{
      const {error}=await client.from("info_entries").update({name:next.name,data:next.data,publication_status:next.publication_status,reliability_status:next.reliability_status,confirmed_source:next.confirmed_source,confirmation_note:next.confirmation_note,confirmed_at:nowIso(),updated_by:currentUser?.id||null}).eq("id",entry.id);if(error)throw error;
      for(const c of changes){await insertHistory({entryId:entry.id,fieldName:c.field,oldValue:c.old==null?null:(typeof c.old==="string"?c.old:JSON.stringify(c.old)),newValue:c.new==null?null:(typeof c.new==="string"?c.new:JSON.stringify(c.new)),reason,source:next.confirmed_source});}
      panelMsg(panel,"Промените са записани и добавени в историята.",true);setTimeout(open,500);
    }catch(err){console.error(err);panelMsg(panel,"Грешка при записването. Проверете данните преди повторен опит.");}
  }

  function clearPanelMessage(panel){const msg=panel?.querySelector("[data-msg]");if(!msg)return;msg.textContent="";msg.classList.remove("ok");}

  function wireEntries(root,state){
    root.querySelectorAll("[data-edit-entry]").forEach(btn=>btn.addEventListener("click",()=>{const panel=root.querySelector(`[data-edit-panel="${CSS.escape(btn.dataset.editEntry)}"]`);if(panel)panel.hidden=!panel.hidden;}));
    root.querySelectorAll("[data-preview-entry]").forEach(btn=>btn.addEventListener("click",()=>{const entry=state.entries.find(e=>e.id===btn.dataset.previewEntry);const panel=btn.closest("[data-edit-panel]");if(!entry||!panel)return;try{renderChangePreview(panel,collectEntryChanges(panel,entry).changes);}catch(err){panelMsg(panel,err.message||"Невалидна стойност.");}}));
    root.querySelectorAll("[data-save-entry]").forEach(btn=>btn.addEventListener("click",()=>{const entry=state.entries.find(e=>e.id===btn.dataset.saveEntry);const panel=btn.closest("[data-edit-panel]");if(entry&&panel)saveEntryEdit(entry,panel);}));
    root.querySelectorAll("[data-remove-entry]").forEach(btn=>btn.addEventListener("click",()=>{const entry=state.entries.find(e=>e.id===btn.dataset.removeEntry);if(entry)removeEntrySafely(entry);}));
    root.querySelectorAll("[data-restore-entry]").forEach(btn=>btn.addEventListener("click",()=>{const entry=state.entries.find(e=>e.id===btn.dataset.restoreEntry);if(entry)restoreEntry(entry);}));
    root.querySelectorAll("[data-edit-panel]").forEach(panel=>{panel.querySelectorAll("input,textarea,select").forEach(el=>{el.addEventListener("input",()=>clearPanelMessage(panel));el.addEventListener("change",()=>clearPanelMessage(panel));});});
  }

  function wireSubmissions(root,state){
    root.querySelectorAll("[data-sub-review]").forEach(btn=>btn.addEventListener("click",()=>{const p=root.querySelector(`[data-sub-panel="${CSS.escape(btn.dataset.subReview)}"]`);if(p)p.hidden=!p.hidden;}));
    root.querySelectorAll("[data-sub-return]").forEach(btn=>btn.addEventListener("click",async()=>{const x=state.subs.find(s=>s.id===btn.dataset.subReturn);if(!x)return;const note=window.prompt("Какво трябва да се коригира?","")?.trim();if(!note)return;try{await markSubmission(x.id,"needs_correction",note);window.alert("Предложението е върнато за корекция.");await open();}catch(err){console.error(err);window.alert("Неуспешно връщане за корекция.");}}));
    root.querySelectorAll("[data-sub-reject]").forEach(btn=>btn.addEventListener("click",async()=>{const x=state.subs.find(s=>s.id===btn.dataset.subReject);if(!x)return;const note=window.prompt("Причина за отхвърляне:","")??"";if(!window.confirm("Сигурни ли сте, че искате да отхвърлите предложението?"))return;try{await markSubmission(x.id,"rejected",note);await open();}catch(err){console.error(err);window.alert("Неуспешно отхвърляне.");}}));
    root.querySelectorAll("[data-approve-add]").forEach(btn=>btn.addEventListener("click",async()=>{const x=state.subs.find(s=>s.id===btn.dataset.approveAdd),panel=btn.closest("[data-sub-panel]");if(!x||!panel)return;const source=panel.querySelector("[data-source]")?.value.trim()||"",publication=panel.querySelector("[data-publication]")?.value||"published",reliability=panel.querySelector("[data-reliability]")?.value||"strong",adminNote=panel.querySelector("[data-admin-note]")?.value.trim()||"",name=String(x.data?.name||"").trim();if(!name){panelMsg(panel,"Липсва име на записа.");return;}if(!source){panelMsg(panel,"Попълнете потвърден източник.");return;}if(!window.confirm(`Да се създаде запис „${name}“ със статус ${publication}?`))return;try{const payload={category:x.category,subcategory:x.subcategory,entry_type:x.entry_type,name,data:safeDataForNewEntry(x.data),publication_status:publication,reliability_status:reliability,confirmed_at:nowIso(),confirmed_source:source,confirmation_note:adminNote,created_by:currentUser?.id||null,updated_by:currentUser?.id||null};const {data:newRows,error}=await client.from("info_entries").insert(payload).select("id").limit(1);if(error)throw error;const newId=newRows?.[0]?.id;if(newId)await insertHistory({entryId:newId,fieldName:"record_created",oldValue:null,newValue:JSON.stringify(payload.data),reason:adminNote||"Одобрено потребителско предложение",source});await markSubmission(x.id,"approved",adminNote);panelMsg(panel,"Записът е създаден.",true);setTimeout(open,500);}catch(err){console.error(err);panelMsg(panel,"Грешка при създаването. Предложението не е маркирано като одобрено.");}}));
    root.querySelectorAll("[data-apply-correction]").forEach(btn=>btn.addEventListener("click",async()=>{const x=state.subs.find(s=>s.id===btn.dataset.applyCorrection),panel=btn.closest("[data-sub-panel]");if(!x||!panel)return;const entryId=panel.querySelector("[data-target-entry]")?.value||"",fieldKey=panel.querySelector("[data-field-key]")?.value.trim()||"",newValue=panel.querySelector("[data-new-value]")?.value.trim()??"",reason=panel.querySelector("[data-reason]")?.value.trim()||"Одобрена потребителска корекция",source=panel.querySelector("[data-source]")?.value.trim()||"",adminNote=panel.querySelector("[data-admin-note]")?.value.trim()||"";if(!entryId){panelMsg(panel,"Изберете запис.");return;}if(!/^[A-Za-z0-9_]+$/.test(fieldKey)){panelMsg(panel,"Полето трябва да е валиден JSON key, напр. phone или address.");return;}if(!source){panelMsg(panel,"Попълнете източник.");return;}const entry=state.entries.find(e=>e.id===entryId);if(!entry){panelMsg(panel,"Записът не е намерен.");return;}const oldValue=entry.data?.[fieldKey];if(!window.confirm(`Да се промени „${fieldKey}“ за „${entry.name}“?\n\nСтара стойност: ${oldValue??"(празно)"}\nНова стойност: ${newValue}`))return;try{const merged={...(entry.data||{}),[fieldKey]:newValue};const {error}=await client.from("info_entries").update({data:merged,updated_by:currentUser?.id||null}).eq("id",entryId);if(error)throw error;await insertHistory({entryId,fieldName:`data.${fieldKey}`,oldValue:oldValue==null?null:(typeof oldValue==="string"?oldValue:JSON.stringify(oldValue)),newValue,reason,source});await markSubmission(x.id,"approved",adminNote);panelMsg(panel,"Корекцията е приложена и записана в историята.",true);setTimeout(open,500);}catch(err){console.error(err);panelMsg(panel,"Грешка при прилагането. Проверете записа преди повторен опит.");}}));
  }

  function wireReports(root,state){
    root.querySelectorAll("[data-report-review]").forEach(btn=>btn.addEventListener("click",()=>{const p=root.querySelector(`[data-report-panel="${CSS.escape(btn.dataset.reportReview)}"]`);if(p)p.hidden=!p.hidden;}));
    root.querySelectorAll("[data-report-return]").forEach(btn=>btn.addEventListener("click",async()=>{const x=state.reports.find(r=>r.id===btn.dataset.reportReturn);if(!x)return;const note=window.prompt("Каква допълнителна информация е нужна?","")?.trim();if(!note)return;try{await markReport(x.id,"needs_info",note);window.alert("Поискана е допълнителна информация от подателя.");await open();}catch(err){console.error(err);window.alert("Неуспешно връщане към подателя.");}}));
    root.querySelectorAll("[data-report-reject]").forEach(btn=>btn.addEventListener("click",async()=>{const x=state.reports.find(r=>r.id===btn.dataset.reportReject);if(!x)return;const note=window.prompt("Причина / бележка:","")??"";if(!window.confirm("Да се отхвърли сигналът?"))return;try{await markReport(x.id,"rejected",note);await open();}catch(err){console.error(err);window.alert("Неуспешно отхвърляне.");}}));
    root.querySelectorAll("[data-resolve-report]").forEach(btn=>btn.addEventListener("click",async()=>{const x=state.reports.find(r=>r.id===btn.dataset.resolveReport),panel=btn.closest("[data-report-panel]");if(!x||!panel)return;const entryId=panel.querySelector("[data-target-entry]")?.value||"",fieldKey=panel.querySelector("[data-field-key]")?.value.trim()||"",newValue=panel.querySelector("[data-new-value]")?.value.trim()??"",adminNote=panel.querySelector("[data-admin-note]")?.value.trim()||"",source=panel.querySelector("[data-source]")?.value.trim()||"";try{if(entryId&&fieldKey){if(!/^[A-Za-z0-9_]+$/.test(fieldKey)){panelMsg(panel,"Невалиден JSON key.");return;}if(!source){panelMsg(panel,"За промяна по запис е нужен източник.");return;}const entry=state.entries.find(e=>e.id===entryId);if(!entry){panelMsg(panel,"Записът не е намерен.");return;}const oldValue=entry.data?.[fieldKey];if(!window.confirm(`Да се приложи промяна по „${entry.name}“ и да се затвори сигналът?`))return;const merged={...(entry.data||{}),[fieldKey]:newValue};const {error}=await client.from("info_entries").update({data:merged,updated_by:currentUser?.id||null}).eq("id",entryId);if(error)throw error;await insertHistory({entryId,fieldName:`data.${fieldKey}`,oldValue:oldValue==null?null:(typeof oldValue==="string"?oldValue:JSON.stringify(oldValue)),newValue,reason:adminNote||x.description||"Обработен сигнал за грешка",source});}else{if(!window.confirm("Да се маркира сигналът като обработен без промяна на публичен запис?"))return;}await markReport(x.id,"resolved",adminNote);panelMsg(panel,"Сигналът е обработен.",true);setTimeout(open,500);}catch(err){console.error(err);panelMsg(panel,"Грешка при обработването. Проверете дали записът е променен преди повторен опит.");}}));
  }

  async function waitForInfoButton(){
    for(let i=0;i<60;i+=1){
      if(ensureButton()) return true;
      await new Promise(resolve=>window.setTimeout(resolve,50));
    }
    return false;
  }

  function syncPendingSummary(){
    window.setTimeout(()=>{
      if(isModerator()){
        injectPendingSummary(infoPendingCount);
        return;
      }
      const label=document.querySelector("[data-info-admin]")?.textContent||"";
      const pending=Number((label.match(/\((\d+)\)/)||[])[1]||0);
      injectPendingSummary(pending);
    },80);
  }

  document.addEventListener("DOMContentLoaded",async()=>{
    if(!(await allowed())) return;
    if(!(await waitForInfoButton())) return;
    adminStyles();
    await refreshPendingIndicator();
    syncPendingSummary();

    document.addEventListener("click",event=>{
      if(event.target?.closest?.(".admin-menu button,[data-admin-view],[data-dashboard-target]")) syncPendingSummary();
    },true);
    window.addEventListener("popitai:admin-actionable-counts",syncPendingSummary);
  });
})();