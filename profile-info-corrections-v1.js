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
      .profile-info-grid textarea{min-height:86px;resize:vertical}
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
    heading.innerHTML="<h2>Моите предложения и сигнали</h2>";

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
      <h3>${esc(s.data?.name || s.entry_type || "Предложение")}</h3>
      <p class="profile-info-meta">${esc(s.category)} → ${esc(s.subcategory)} · ${esc(fmt(s.created_at))}</p>
      ${needs?`<div class="profile-info-reason"><strong>Причина от администратора:</strong><br>${esc(s.admin_note||"Няма посочена причина.")}</div>`:""}
      ${needs?`<div class="profile-info-grid">
        ${fields.map(([k,v])=>`<label>${esc(k)}
          ${String(v??"").length>80
            ? `<textarea data-field="${esc(k)}">${esc(v)}</textarea>`
            : `<input data-field="${esc(k)}" value="${esc(v)}">`}
        </label>`).join("")}
      </div>
      <button class="profile-info-save" type="button" data-resubmit-submission>Изпрати отново</button>
      <p class="profile-info-msg" data-msg></p>`:
      `<div class="profile-info-meta">Статусът се обновява автоматично след админ преглед.</div>`}
    </article>`;
  }

  function reportCard(r){
    const needs=r.status==="needs_info";
    return `<article class="profile-info-card" data-own-report="${esc(r.id)}">
      <span class="profile-info-status${needs?' warn':''}">${esc(STATUS[r.status]||r.status)}</span>
      <h3>Сигнал за грешка</h3>
      <p class="profile-info-meta">${esc(r.category)} → ${esc(r.subcategory)} · ${esc(fmt(r.created_at))}</p>
      <div class="profile-info-meta" style="white-space:pre-wrap">${esc(r.description)}</div>
      ${needs?`<div class="profile-info-reason"><strong>Администраторът иска:</strong><br>${esc(r.admin_note||"Допълнителна информация.")}</div>
      <div class="profile-info-grid">
        <label>Допълнение
          <textarea data-report-extra placeholder="Напиши липсващата информация или добави по-точен източник…"></textarea>
        </label>
      </div>
      <button class="profile-info-save" type="button" data-resubmit-report>Изпрати допълнението</button>
      <p class="profile-info-msg" data-msg></p>`:
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
    list.querySelectorAll("[data-resubmit-submission]").forEach(btn=>{
      btn.addEventListener("click",async()=>{
        const card=btn.closest("[data-own-submission]");
        const msg=card.querySelector("[data-msg]");
        const id=card.dataset.ownSubmission;
        const fields={};
        card.querySelectorAll("[data-field]").forEach(el=>fields[el.dataset.field]=el.value.trim());

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
        const extra=card.querySelector("[data-report-extra]").value.trim();

        if(!extra){
          msg.textContent="Напиши допълнителната информация.";
          msg.className="profile-info-msg error";
          return;
        }

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