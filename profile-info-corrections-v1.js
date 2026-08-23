(() => {
  "use strict";

  let client=null;
  let user=null;

  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[ch]));

  const fmt = value => value ? new Date(value).toLocaleString("bg-BG") : "";

  const STATUS = {
    pending:"Чака админ преглед",
    approved:"Одобрено",
    rejected:"Отхвърлено",
    needs_correction:"Нужна корекция",
    resolved:"Обработен",
    dismissed:"Отхвърлен",
    reviewed:"Прегледан",
    needs_info:"Нужна допълнителна информация"
  };

  const CATEGORY_LABELS={
    zdrave:"Здраве",institucii:"Институции",transport:"Транспорт",
    obrazovanie:"Образование и култура",banki:"Банки и банкомати",
    komunalni:"Комунални и ежедневни услуги"
  };

  const SUBCATEGORY_LABELS={
    bolnica:"Болница",lekari:"Лекари",apteki:"Аптеки",stomatolozi:"Стоматолози",
    veterinari:"Ветеринари","vet-apteki":"Ветеринарни аптеки",laboratorii:"Лаборатории",
    obshtina:"Община",policia:"Полиция",pojarna:"Пожарна",speshna:"Спешна помощ",
    vik:"ВиК",tok:"Електроенергия",avtobusi:"Автобуси",bdz:"ЖП / БДЖ",taksita:"Таксита",
    uchilishta:"Училища","detski-gradini":"Детски градини",chitalishta:"Читалища",
    biblioteka:"Библиотека",muzei:"Музей","shkoli-kursove":"Школи и курсове",
    ofisi:"Банкови офиси",bankomati:"Банкомати","internet-tv":"Интернет и телевизия",
    kurieri:"Куриери",chistota:"Чистота и отпадъци",obshto:"Общо"
  };

  const FIELD_LABELS={
    name:"Име / обект",details:"Полезна информация",source:"Източник / линк",phone:"Телефон",
    address:"Адрес",current_problem:"Какво е грешно",proposed_value:"Правилна информация",
    note:"Бележка",working_hours:"Работно време",services:"Услуги",specialty:"Специалност"
  };

  const catLabel=value=>CATEGORY_LABELS[value]||value||"";
  const subLabel=value=>SUBCATEGORY_LABELS[value]||value||"";
  const fieldLabel=key=>FIELD_LABELS[key]||String(key||"").replaceAll("_"," ");

  function hasUsefulText(value){
    const text=String(value||"").replace(/\s+/g," ").trim();
    const words=text.match(/[\p{L}\p{N}]+/gu)||[];
    const letters=[...text.toLocaleLowerCase("bg-BG")].filter(ch=>/\p{L}/u.test(ch));
    const distinctLetters=new Set(letters).size;
    if(words.length<2||distinctLetters<4) return false;
    if(words.length===2&&words[0].toLocaleLowerCase("bg-BG")===words[1].toLocaleLowerCase("bg-BG")) return false;
    return true;
  }

  function validPhone(value){
    const text=String(value||"").trim();
    return /^\+?[\d\s().-]{7,20}$/.test(text)&&text.replace(/\D/g,"").length>=7&&text.replace(/\D/g,"").length<=15;
  }

  function validUrl(value){
    try{
      const url=new URL(String(value||"").trim());
      return url.protocol==="http:"||url.protocol==="https:";
    }catch{return false;}
  }

  function fieldMessage(key,value){
    const text=String(value??"").trim();
    const required=["name","details","current_problem","proposed_value"].includes(key);
    if(!text) return required?`Попълни „${fieldLabel(key)}“.`:"";
    if(key==="phone"&&!validPhone(text)) return "Въведи валиден телефонен номер.";
    if(["source","url","website","public_url"].includes(key)&&!validUrl(text)&&!hasUsefulText(text)) return "Въведи пълен линк или ясен източник.";
    if(["details","current_problem","proposed_value","note"].includes(key)&&!hasUsefulText(text)) return `Добави достатъчно ясна информация в „${fieldLabel(key)}“.`;
    if(key==="name"){
      const letters=[...text].filter(ch=>/\p{L}/u.test(ch));
      if(letters.length<2||new Set(letters.map(ch=>ch.toLocaleLowerCase("bg-BG"))).size<2) return "Въведи разбираемо име на обекта.";
    }
    return "";
  }

  function setFieldError(field,message){
    if(!field) return;
    const error=field.parentElement?.querySelector("[data-field-error]");
    if(error) error.textContent=message;
    if(message) field.setAttribute("aria-invalid","true"); else field.removeAttribute("aria-invalid");
  }

  function validateField(field){
    const key=field?.dataset.field;
    if(!key) return true;
    const message=fieldMessage(key,field.value);
    setFieldError(field,message);
    return !message;
  }

  async function getClient(){
    if(window.PopitaiSupabase) return window.PopitaiSupabase;
    return new Promise((resolve,reject)=>{
      let tries=0;
      const timer=setInterval(()=>{
        tries++;
        if(window.PopitaiSupabase){
          clearInterval(timer);
          resolve(window.PopitaiSupabase);
        }else if(tries>120){
          clearInterval(timer);
          reject(new Error("Supabase client timeout"));
        }
      },50);
    });
  }

  function ensureStyles(){
    if(document.getElementById("profile-info-corrections-style")) return;
    const s=document.createElement("style");
    s.id="profile-info-corrections-style";
    s.textContent=`
      .profile-info-list{display:grid;gap:12px}
      .profile-info-card{border:1px solid #dfe6ef;border-radius:14px;padding:14px;background:#fff}
      .profile-info-card h3{margin:0 0 6px;font-size:17px}
      .profile-info-meta{font-size:13px;color:#68768a;margin:3px 0}
      .profile-info-status{display:inline-flex;margin:4px 0 8px;padding:4px 8px;border-radius:999px;background:#eef5ff;color:#0b5fd7;font-size:12px;font-weight:900}
      .profile-info-status.warn{background:#fff1d6;color:#824d00}
      .profile-info-reason{margin:10px 0;padding:10px;border-left:4px solid #d98300;background:#fff8e8;border-radius:8px}
      .profile-info-grid{display:grid;gap:9px;margin-top:10px}
      .profile-info-grid label{display:grid;gap:4px;font-weight:700}
      .profile-info-grid input,.profile-info-grid textarea{box-sizing:border-box;width:100%;border:1px solid #cbd4df;border-radius:10px;padding:10px;font:inherit}
      .profile-info-grid [aria-invalid="true"]{border-color:#b42318;box-shadow:0 0 0 2px rgba(180,35,24,.10)}
      .profile-info-grid textarea{min-height:86px;resize:vertical}
      .profile-info-field-error{min-height:0;margin:0;color:#a11f1f;font-size:12px;font-weight:700}
      .profile-info-save{margin-top:10px;border:0;border-radius:10px;padding:10px 13px;background:#1261d6;color:#fff;font:inherit;font-weight:800;cursor:pointer}
      .profile-info-save[disabled]{opacity:.6;cursor:wait}
      .profile-info-msg{margin-top:8px;font-size:13px;font-weight:700}
      .profile-info-msg.ok{color:#08713d}.profile-info-msg.error{color:#a11f1f}
    `;
    document.head.appendChild(s);
  }

  function ensureSection(){
    let list=document.getElementById("profile-info-submissions");
    if(list) return list;

    const passwordHeading=[...document.querySelectorAll(".block-heading h2")]
      .find(h=>h.textContent.trim()==="Смяна на парола");
    const block=passwordHeading?.closest(".block-heading");
    if(!block) return null;

    const heading=document.createElement("div");
    heading.className="block-heading spaced";
    heading.innerHTML="<h2>Моите предложения и сигнали за Инфо Лом</h2>";

    list=document.createElement("div");
    list.id="profile-info-submissions";
    list.className="profile-info-list";
    list.innerHTML='<article class="empty-card"><p>Зареждане…</p></article>';

    block.before(heading,list);
    return list;
  }

  function primitiveFields(data){
    const d=data||{};
    return Object.entries(d).filter(([k,v]) =>
      !["mode","submitted_from"].includes(k) &&
      (typeof v==="string" || typeof v==="number" || typeof v==="boolean" || v==null)
    );
  }

  function submissionCard(s){
    const needs=s.status==="needs_correction";
    const fields=primitiveFields(s.data);
    return `<article class="profile-info-card" data-own-submission="${esc(s.id)}">
      <span class="profile-info-status${needs?' warn':''}">${esc(STATUS[s.status]||s.status)}</span>
      <h3>${esc(s.data?.name || "Предложение")}</h3>
      <p class="profile-info-meta">${esc(catLabel(s.category))}${s.subcategory?` → ${esc(subLabel(s.subcategory))}`:""} · ${esc(fmt(s.created_at))}</p>
      ${needs?`<div class="profile-info-reason"><strong>Причина от администратора:</strong><br>${esc(s.admin_note||"Няма посочена причина.")}</div>`:""}
      ${needs?`<div class="profile-info-grid">
        ${fields.map(([k,v])=>`<label>${esc(fieldLabel(k))}
          ${String(v??"").length>80
            ? `<textarea data-field="${esc(k)}">${esc(v)}</textarea>`
            : `<input data-field="${esc(k)}" value="${esc(v)}">`}
          <span class="profile-info-field-error" data-field-error aria-live="polite"></span>
        </label>`).join("")}
      </div>
      <button class="profile-info-save" type="button" data-resubmit-submission>Изпрати отново</button>
      <p class="profile-info-msg" data-msg aria-live="polite"></p>`:
      `<div class="profile-info-meta">Статусът се обновява автоматично след админ преглед.</div>`}
    </article>`;
  }

  function reportCard(r){
    const needs=r.status==="needs_info";
    return `<article class="profile-info-card" data-own-report="${esc(r.id)}">
      <span class="profile-info-status${needs?' warn':''}">${esc(STATUS[r.status]||r.status)}</span>
      <h3>Сигнал за грешка</h3>
      <p class="profile-info-meta">${esc(catLabel(r.category))}${r.subcategory?` → ${esc(subLabel(r.subcategory))}`:""} · ${esc(fmt(r.created_at))}</p>
      <div class="profile-info-meta" style="white-space:pre-wrap">${esc(r.description)}</div>
      ${needs?`<div class="profile-info-reason"><strong>Администраторът иска:</strong><br>${esc(r.admin_note||"Допълнителна информация.")}</div>
      <div class="profile-info-grid">
        <label>Допълнение
          <textarea data-report-extra aria-describedby="profile-report-extra-${esc(r.id)}" placeholder="Напиши липсващата информация или добави по-точен източник…"></textarea>
          <span class="profile-info-field-error" id="profile-report-extra-${esc(r.id)}" data-report-extra-error aria-live="polite"></span>
        </label>
      </div>
      <button class="profile-info-save" type="button" data-resubmit-report>Изпрати допълнението</button>
      <p class="profile-info-msg" data-msg aria-live="polite"></p>`:
      `<div class="profile-info-meta">Статусът се обновява автоматично след админ преглед.</div>`}
    </article>`;
  }

  async function load(){
    client=client||await getClient();
    const {data:u,error:uErr}=await client.auth.getUser();
    if(uErr) throw uErr;
    user=u?.user||null;

    const list=ensureSection();
    if(!list) return;

    if(!user){
      list.innerHTML='<article class="empty-card"><p>Влез в профила си, за да виждаш предложенията и сигналите си.</p></article>';
      return;
    }

    const [subs,reports]=await Promise.all([
      client.from("info_submissions")
        .select("id,category,subcategory,entry_type,data,status,admin_note,created_at,reviewed_at")
        .eq("submitted_by",user.id)
        .order("created_at",{ascending:false}),
      client.from("info_error_reports")
        .select("id,category,subcategory,description,status,admin_note,created_at,reviewed_at")
        .eq("reported_by",user.id)
        .order("created_at",{ascending:false})
    ]);

    if(subs.error) throw subs.error;
    if(reports.error) throw reports.error;

    const all=[
      ...(subs.data||[]).map(x=>({kind:"submission",created_at:x.created_at,data:x})),
      ...(reports.data||[]).map(x=>({kind:"report",created_at:x.created_at,data:x}))
    ].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));

    list.innerHTML=all.length
      ? all.map(x=>x.kind==="submission"?submissionCard(x.data):reportCard(x.data)).join("")
      : '<article class="empty-card"><p>Все още нямаш предложения или сигнали към Инфо Лом.</p></article>';

    bind(list);
  }

  function bind(list){
    list.querySelectorAll("[data-field]").forEach(field=>{
      field.addEventListener("blur",()=>{field.dataset.touched="true";validateField(field);});
      field.addEventListener("input",()=>{if(field.dataset.touched==="true"||field.getAttribute("aria-invalid")==="true") validateField(field);});
    });

    list.querySelectorAll("[data-report-extra]").forEach(field=>{
      const validate=()=>{
        const value=field.value.trim();
        const message=!value?"Напиши допълнителната информация.":!hasUsefulText(value)&&!validUrl(value)&&!validPhone(value)?"Добави ясна информация, телефон или пълен линк към източник.":"";
        const error=field.parentElement?.querySelector("[data-report-extra-error]");
        if(error) error.textContent=message;
        if(message) field.setAttribute("aria-invalid","true"); else field.removeAttribute("aria-invalid");
        return !message;
      };
      field._validateInfoExtra=validate;
      field.addEventListener("blur",()=>{field.dataset.touched="true";validate();});
      field.addEventListener("input",()=>{if(field.dataset.touched==="true"||field.getAttribute("aria-invalid")==="true") validate();});
    });

    list.querySelectorAll("[data-resubmit-submission]").forEach(btn=>{
      btn.addEventListener("click",async()=>{
        const card=btn.closest("[data-own-submission]");
        const msg=card.querySelector("[data-msg]");
        const id=card.dataset.ownSubmission;
        const fields={};
        let firstInvalid=null;
        card.querySelectorAll("[data-field]").forEach(el=>{
          el.dataset.touched="true";
          if(!validateField(el)&&!firstInvalid) firstInvalid=el;
          fields[el.dataset.field]=el.value.trim();
        });
        if(firstInvalid){firstInvalid.focus();return;}

        btn.disabled=true;
        msg.textContent="";
        try{
          const {data:row,error:readErr}=await client.from("info_submissions")
            .select("data,status")
            .eq("id",id)
            .single();
          if(readErr) throw readErr;
          if(row.status!=="needs_correction") throw new Error("Record is not returned");

          const nextData={...(row.data||{}),...fields};
          if(JSON.stringify(nextData)===JSON.stringify(row.data||{})){
            msg.textContent="Промени поне едно поле според бележката на администратора.";
            msg.className="profile-info-msg error";
            return;
          }
          const {error}=await client.from("info_submissions")
            .update({data:nextData,status:"pending"})
            .eq("id",id);
          if(error) throw error;

          msg.textContent="Корекцията е изпратена отново за админ преглед.";
          msg.className="profile-info-msg ok";
          setTimeout(load,700);
        }catch(err){
          console.error(err);
          msg.textContent="Неуспешно повторно изпращане.";
          msg.className="profile-info-msg error";
        }finally{
          btn.disabled=false;
        }
      });
    });

    list.querySelectorAll("[data-resubmit-report]").forEach(btn=>{
      btn.addEventListener("click",async()=>{
        const card=btn.closest("[data-own-report]");
        const msg=card.querySelector("[data-msg]");
        const id=card.dataset.ownReport;
        const extraField=card.querySelector("[data-report-extra]");
        extraField.dataset.touched="true";
        if(!extraField._validateInfoExtra?.()){extraField.focus();return;}
        const extra=extraField.value.trim();

        btn.disabled=true;
        msg.textContent="";
        try{
          const {data:row,error:readErr}=await client.from("info_error_reports")
            .select("description,status")
            .eq("id",id)
            .single();
          if(readErr) throw readErr;
          if(row.status!=="needs_info") throw new Error("Report is not returned");

          const description=`${row.description}\n\nДопълнение от подателя:\n${extra}`;
          const {error}=await client.from("info_error_reports")
            .update({description,status:"pending"})
            .eq("id",id);
          if(error) throw error;

          msg.textContent="Допълнението е изпратено за админ преглед.";
          msg.className="profile-info-msg ok";
          setTimeout(load,700);
        }catch(err){
          console.error(err);
          msg.textContent="Неуспешно изпращане на допълнението.";
          msg.className="profile-info-msg error";
        }finally{
          btn.disabled=false;
        }
      });
    });
  }

  window.addEventListener("load",()=>{
    ensureStyles();
    load().catch(err=>{
      console.error("Profile info correction flow",err);
      const list=ensureSection();
      if(list) list.innerHTML='<article class="empty-card"><p>Неуспешно зареждане на предложенията и сигналите.</p></article>';
    });
  },{once:true});
})();