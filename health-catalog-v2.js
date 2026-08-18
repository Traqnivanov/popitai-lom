(() => {
  "use strict";

  const root = document.getElementById("health-results");
  if (!root) return;

  const buttons = [...document.querySelectorAll("[data-health-filter]")];
  const heading = document.getElementById("health-result-heading");
  const count = document.getElementById("health-result-count");
  const miniSearch = document.getElementById("health-mini-search");

  const FILTER_LABELS = {
    doctors: "Лекари",
    gp: "Лични лекари",
    specialists: "Специалисти",
    dentists: "Стоматолози",
    vets: "Ветеринари"
  };

  let activeFilter = "doctors";
  let allCards = [];

  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[ch]));

  const norm = value => String(value ?? "")
    .toLocaleLowerCase("bg-BG")
    .replace(/\s+/g, " ")
    .trim();

  const first = (...values) =>
    values.find(v => v !== null && v !== undefined && String(v).trim() !== "");

  const phoneTarget = value =>
    `tel:${String(value || "").replace(/[^\d+]/g, "")}`;

  function reliability(entry){
    const s = entry.reliability_status;
    if (s === "official") return { label:"официален", safe:true };
    if (s === "strong") return { label:"потвърден", safe:true };
    if (s === "secondary") return { label:"за проверка", safe:false };
    if (s === "conflict") return { label:"има разминаване", safe:false };
    return { label:"", safe:false };
  }

  function isGP(specialty){
    const s = norm(specialty);
    return s.includes("общопрактикуващ") ||
           s.includes("опл") ||
           s.includes("личен лекар");
  }

  function splitLocation(location){
    const text = String(location || "").trim();
    if (!text) return { facility:"", address:"" };

    const match = text.match(/^(.+?),\s*((?:ул\.|бул\.|пл\.|ж\.к\.|кв\.).+)$/i);
    return match
      ? { facility:match[1].trim(), address:match[2].trim() }
      : { facility:text, address:"" };
  }

  function auditSaysOldAddress(d){
    const note = norm(d.audit_note);
    return note.includes("стар адрес") && note.includes("само в историята");
  }

  function safeAddress(entry,d){
    if (entry.reliability_status === "conflict") return "";
    if (auditSaysOldAddress(d)) return "";
    if (d.address) return d.address;
    return splitLocation(d.location).address || "";
  }

  function facilityFromData(d){
    if (d.practice_name) return d.practice_name;
    return splitLocation(d.location).facility || "";
  }

  function doctorCard(entry){
    const d = entry.data || {};
    const specialty = first(d.specialty,"Лекар");
    return {
      kind:isGP(specialty) ? "gp" : "specialist",
      name:entry.name,
      specialty,
      facility:facilityFromData(d),
      department:"",
      phone:first(d.phone,Array.isArray(d.phones) ? d.phones[0] : ""),
      address:safeAddress(entry,d),
      note:d.phone_note || "",
      reliability:reliability(entry),
      infoAnchor:"zdrave-lekari"
    };
  }

  function dentistCard(entry){
    const d = entry.data || {};
    const conflict = entry.reliability_status === "conflict";
    return {
      kind:"dentist",
      name:entry.name,
      specialty:first(d.specialty,"Стоматолог"),
      facility:d.practice_name || "",
      department:"",
      phone:first(d.phone,Array.isArray(d.phones) ? d.phones[0] : ""),
      address:safeAddress(entry,d),
      note:conflict ? "Има разминаване в източниците за адреса." : (d.audit_note || ""),
      reliability:reliability(entry),
      infoAnchor:"zdrave-stomatolozi"
    };
  }

  function vetCard(entry){
    const d = entry.data || {};
    return {
      kind:"vet",
      name:entry.name,
      specialty:first(d.specialty,"Ветеринарна услуга"),
      facility:facilityFromData(d),
      department:"",
      phone:first(d.phone,Array.isArray(d.phones) ? d.phones[0] : ""),
      address:safeAddress(entry,d),
      note:auditSaysOldAddress(d)
        ? "В базата има стар адрес, който не се показва като актуален."
        : (d.audit_note || ""),
      reliability:reliability(entry),
      infoAnchor:"zdrave-veterinari"
    };
  }

  function hospitalDoctors(entry){
    const d = entry.data || {};
    if (!d.doctors) return [];

    return String(d.doctors)
      .split(/[,;]\s*/)
      .map(x => x.trim())
      .filter(Boolean)
      .map(name => ({
        kind:"specialist",
        name,
        specialty:entry.name,
        facility:"МБАЛ „Св. Николай Чудотворец“ – Лом",
        department:entry.name,
        phone:first(d.phone,""),
        address:"ул. Тодор Каблешков 2, Лом",
        note:d.internal_phone ? `Вътрешен телефон на отделението: ${d.internal_phone}` : "",
        reliability:reliability(entry),
        infoAnchor:"zdrave-bolnica"
      }));
  }

  function centerDoctors(entry){
    const d = entry.data || {};
    if (!Array.isArray(d.linked_doctors)) return [];

    return d.linked_doctors.map(doctor => ({
      kind:isGP(doctor.specialty) ? "gp" : "specialist",
      name:doctor.name,
      specialty:doctor.specialty || "Лекар",
      facility:entry.name,
      department:"",
      phone:doctor.phone || "",
      address:d.address || "",
      note:"",
      reliability:reliability(entry),
      infoAnchor:"zdrave-bolnica"
    }));
  }

  function dedupe(cards){
    const map = new Map();

    for (const card of cards){
      const key = `${norm(card.name)}|${norm(card.specialty)}`;
      if (!key.replace("|","")) continue;

      if (!map.has(key)){
        map.set(key,card);
        continue;
      }

      const score = x =>
        (x.facility ? 5 : 0) +
        (x.phone ? 4 : 0) +
        (x.address ? 3 : 0) +
        (x.department ? 1 : 0) +
        (x.reliability?.safe ? 2 : 0);

      if (score(card) > score(map.get(key))) map.set(key,card);
    }

    return [...map.values()].sort((a,b) => a.name.localeCompare(b.name,"bg"));
  }

  async function waitClient(){
    if (window.PopitaiSupabase) return window.PopitaiSupabase;

    return new Promise((resolve,reject) => {
      let tries = 0;
      const timer = setInterval(() => {
        tries++;
        if (window.PopitaiSupabase){
          clearInterval(timer);
          resolve(window.PopitaiSupabase);
        } else if (tries > 120){
          clearInterval(timer);
          reject(new Error("Supabase client timeout"));
        }
      },50);
    });
  }

  function currentCards(){
    const term = norm(miniSearch?.value);
    let cards;

    if (activeFilter === "doctors"){
      cards = allCards.filter(c => c.kind === "gp" || c.kind === "specialist");
    } else if (activeFilter === "gp"){
      cards = allCards.filter(c => c.kind === "gp");
    } else if (activeFilter === "specialists"){
      cards = allCards.filter(c => c.kind === "specialist");
    } else if (activeFilter === "dentists"){
      cards = allCards.filter(c => c.kind === "dentist");
    } else {
      cards = allCards.filter(c => c.kind === "vet");
    }

    if (term){
      cards = cards.filter(c =>
        norm([c.name,c.specialty,c.facility,c.department,c.address].join(" "))
          .includes(term)
      );
    }

    return cards;
  }

  function cardHtml(card){
    const badge =
      card.kind === "gp" ? "Личен лекар" :
      card.kind === "specialist" ? "Специалист" :
      card.kind === "dentist" ? "Стоматолог" :
      "Ветеринар";

    const facility = card.facility
      ? `<div>🏥 <strong>${esc(card.facility)}</strong></div>`
      : "";

    const department =
      card.department && norm(card.department) !== norm(card.specialty)
        ? `<div>Отделение: ${esc(card.department)}</div>`
        : "";

    const address = card.address
      ? `<div>📍 ${esc(card.address)}</div>`
      : "";

    const rel = card.reliability?.label
      ? `<div>${card.reliability.safe ? "✓" : "!"} ${esc(card.reliability.label)}</div>`
      : "";

    const phone = card.phone
      ? `<a class="health-call" href="${esc(phoneTarget(card.phone))}">Обади се · ${esc(card.phone)}</a>`
      : "";

    return `<article class="health-card">
      <div class="health-card-top">
        <h3 class="health-card-name">${esc(card.name)}</h3>
        <span class="health-card-badge">${esc(badge)}</span>
      </div>
      <p class="health-card-specialty">${esc(card.specialty)}</p>
      <div class="health-card-meta">
        ${facility}
        ${department}
        ${address}
        ${rel}
      </div>
      ${card.note ? `<p class="health-card-note">${esc(card.note)}</p>` : ""}
      <div class="health-card-actions">
        ${phone}
        <a class="health-info-link" href="zdrave.html#${esc(card.infoAnchor)}">Подробности</a>
      </div>
    </article>`;
  }

  function render(){
    const cards = currentCards();

    heading.textContent = FILTER_LABELS[activeFilter] || "Здраве";
    count.textContent = `${cards.length} ${cards.length === 1 ? "резултат" : "резултата"}`;

    root.innerHTML = cards.length
      ? cards.map(cardHtml).join("")
      : `<div class="health-status">Няма намерени публикувани записи за този избор.</div>`;
  }

  buttons.forEach(button => {
    button.addEventListener("click",() => {
      activeFilter = button.dataset.healthFilter;
      buttons.forEach(b =>
        b.setAttribute("aria-selected",String(b === button))
      );
      render();
    });
  });

  miniSearch?.addEventListener("input",render);

  (async () => {
    try{
      const client = await waitClient();
      const { data,error } = await client
        .from("info_entries")
        .select("id,category,subcategory,entry_type,name,data,publication_status,reliability_status,confirmed_at")
        .eq("category","zdrave")
        .eq("publication_status","published")
        .in("entry_type",[
          "doctor",
          "dentist",
          "vet",
          "hospital_department",
          "medical_center"
        ]);

      if (error) throw error;

      const cards = [];

      for (const entry of data || []){
        if (entry.entry_type === "doctor") cards.push(doctorCard(entry));
        else if (entry.entry_type === "dentist") cards.push(dentistCard(entry));
        else if (entry.entry_type === "vet") cards.push(vetCard(entry));
        else if (entry.entry_type === "hospital_department") cards.push(...hospitalDoctors(entry));
        else if (entry.entry_type === "medical_center") cards.push(...centerDoctors(entry));
      }

      allCards = dedupe(cards);
      render();
    } catch (err){
      console.error("Health catalog load error:",err);
      root.innerHTML = `<div class="health-status">Не успяхме да заредим резултатите. Опитай отново след малко.</div>`;
      count.textContent = "";
    }
  })();
})();