(() => {
  "use strict";

  const staticShops = [
    {cat:"food",name:"Жизел",kind:"Хранителен магазин",address:"ул. „Пристанищна“ 60, Лом",phone:"",hours:"",tags:["Хранителни стоки","Напитки","Ежедневни покупки"]},
    {cat:"food",name:"МОЯТ МАГАЗИН",kind:"Хранителен магазин",address:"ул. „Александър Стамболийски“ 41, Лом",phone:"0877 274 244",hours:"Всеки ден 07:30–20:00",tags:["Хранителни стоки","Месо и сирена","Плодове и зеленчуци","Готвени ястия"]},
    {cat:"food",name:"МОЯТ МАГАЗИН",kind:"Хранителен магазин",address:"ул. „Трети март“ 2А, Лом",phone:"0879 955 024",hours:"Всеки ден 07:00–22:00",tags:["Хранителни стоки","Месо и сирена","Плодове и зеленчуци","Готвени ястия"]},
    {cat:"food",name:"T MARKET Лом",kind:"Супермаркет",address:"ул. „Хан Аспарух“ 13, Лом",phone:"0700 701 71",hours:"Всеки ден 08:00–22:00",tags:["Хранителни стоки","Супермаркет"]},
    {cat:"food",name:"Lidl Лом",kind:"Супермаркет",address:"ул. „Пристанищна“ 41А, Лом",phone:"",hours:"Вт–Сб 08:30–20:30 · Нед 09:30–20:30",tags:["Хранителни стоки","Супермаркет"]},
    {cat:"food",name:"Вирея 1 / Близнаците",kind:"Хранителен магазин",address:"ул. „Цар Петър“ 12А, Лом",phone:"",hours:"",tags:["Хранителни стоки"]},
    {cat:"food",name:"Вирея 3 / Близнаците",kind:"Хранителен магазин",address:"ул. „Пристанищна“ 15, Лом",phone:"",hours:"",tags:["Хранителни стоки"]},
    {cat:"food",name:"Вирея 4 / Близнаците",kind:"Хранителен магазин",address:"ул. „Добруджа“ 23А, Лом",phone:"",hours:"",tags:["Хранителни стоки"]},
    {cat:"food",name:"Дунавци мес",kind:"Магазин за месо",address:"ул. „Славянска“ 124, Лом",phone:"",hours:"",tags:["Месо","Месни продукти"]},
    {cat:"food",name:"Бозмов",kind:"Фирмен магазин за месо",address:"ул. „Георги Кирков“ 2, Лом",phone:"",hours:"",tags:["Месо","Месни продукти"]},
    {cat:"food",name:"Моят Магазин „Народен“",kind:"Хранителен магазин",address:"ул. „Неофит Бозвели“ 37, Лом",phone:"",hours:"",tags:["Хранителни стоки","Бързо хранене"]},
    {cat:"food",name:"Милккомм",kind:"Мандра за млечни продукти",address:"ул. „Никола Бозвели“ 30, Лом",phone:"",hours:"",tags:["Млечни продукти","Кисело мляко","Сирене","Кашкавал"]},

    {cat:"construction",name:"Строймаркет Орбита",kind:"Строителни материали и железария",address:"ул. „Славянска“ 67, Лом",phone:"",hours:"",tags:["Строителни материали","Железария"],groups:["materials","metal"]},
    {cat:"construction",name:"Строймаркет Орбита",kind:"Строителни материали и санитария",address:"ул. „Крум Пастърмаджиев“ 7, Лом",phone:"",hours:"",tags:["Строителни материали","Санитария"],groups:["materials","bath"]},
    {cat:"construction",name:"ЕТ „Таня Иванова“",kind:"Строителни материали, железария, ВиК и обзавеждане",address:"ул. „Цар Симеон“ 110, Лом",phone:"0886 552 618",hours:"",tags:["Железария","ВиК","Бои","Плочки","Ламинат","Санитария"],groups:["materials","metal","paint","bath"]},
    {cat:"construction",name:"Colors / Колорс Георгиеви",kind:"Бои, латекси и декоративни покрития",address:"ул. „Славянска“ 58, Лом",phone:"0887 479 108",hours:"",tags:["Латекс","Бои","Декоративни покрития","Автобои"],groups:["paint"]},
    {cat:"construction",name:"Дартон / Магазин за бани",kind:"Бани, санитария и обзавеждане",address:"ул. „Славянска“ 126, Лом",phone:"0895 793 130",hours:"",tags:["Санитария","Бани","Смесители"],groups:["bath","materials"]},
    {cat:"construction",name:"Борислав Борисов – ББ",kind:"Метали, метални изделия, железария и строителни материали",address:"ул. „Крали Марко“ 4, Лом",phone:"0971 66 862",hours:"",tags:["Метали","Метални изделия","Железария","Строителни материали"],groups:["metal","materials"]},
    {cat:"construction",name:"Дрийм Колорс",kind:"Бои, мазилки и материали за довършителни работи",address:"ул. „Георги Манафски“ 19, Лом",phone:"",hours:"",tags:["Бои","Мазилки","Довършителни материали"],groups:["paint","materials"]},
    {cat:"construction",name:"Дилеро",kind:"Строителен магазин",address:"ул. „Цар Симеон“ 38, Лом",phone:"",hours:"",tags:["Строителни материали"],groups:["materials"]},

    {cat:"tech",name:"TechnoArena Лом",kind:"Техника и електроника",address:"ул. „Хан Аспарух“ 6, Лом",phone:"0877 073 777",hours:"Пн–Пт 09:00–18:00",tags:["Техника","Електроника"]},
    {cat:"tech",name:"ОТП ФОРУМ ЛОМ / ФОРУМ АУТЛЕТ",kind:"Техника и електроника",address:"ул. „Славянска“ 64, Лом",phone:"0971 65 151",hours:"Пн–Пт 09:30–18:30 · Сб–Нед почивни дни",tags:["Техника","Електроника","За дома"]},
    {cat:"tech",name:"Джиесемите / П енд М Трейдинг",kind:"Телефони и електроника",address:"ул. „Борил“ 2, Лом",phone:"0879 966 677",hours:"",tags:["Телефони","Аксесоари","Електроника"]},
    {cat:"tech",name:"МИКРОТЕХ – Росен Георгиев",kind:"Черна и бяла техника",address:"ул. „Пристанищна“ 2, Лом",phone:"0971 66 893",hours:"",tags:["Бяла техника","Черна техника","Сервиз"]},

    {cat:"furniture",name:"Мебелна къща Мура – Славянска",kind:"Мебели и обзавеждане",address:"ул. „Славянска“ 66, Лом",phone:"0888 729 620",hours:"Пн–Пт 09:00–18:00 · Сб 09:00–13:00",tags:["Мебели","Обзавеждане"]},
    {cat:"furniture",name:"Мебелна къща Мура – Хан Аспарух",kind:"Мебели и обзавеждане",address:"ул. „Хан Аспарух“ 6, Лом",phone:"0885 714 677",hours:"",tags:["Мебели","Обзавеждане"]},
    {cat:"furniture",name:"Майстора и Маргарита – Лом",kind:"Мебели и обзавеждане",address:"ул. „Людовико Миланези“ 9, промишлена зона, Лом",phone:"0898 610 841",hours:"",tags:["Мебели","Обзавеждане"]},

    {cat:"clothes",name:"Pepco Лом",kind:"Дрехи и стоки за дома",address:"ул. „Пристанищна“ 41, Лом",phone:"",hours:"",tags:["Дрехи","Дом","Деца"]},
    {cat:"clothes",name:"FLAIR Lom",kind:"Дрехи и обувки",address:"ул. „Славянска“ 8, Лом",phone:"0877 714 959",hours:"Пн–Пт 09:00–19:00 · Сб 09:00–15:00",tags:["Дрехи","Обувки"]},
    {cat:"clothes",name:"Магазин за дрехи „Веси“",kind:"Дрехи",address:"ул. „Славянска“ 13, Лом",phone:"0876 800 039",hours:"",tags:["Дрехи"]},
    {cat:"clothes",name:"Блян",kind:"Парфюмерия и бельо",address:"ул. „Славянска“ 44, Лом",phone:"",hours:"",tags:["Парфюмерия","Козметика","Бельо"]},

    {cat:"home",name:"WangFa Mall",kind:"Домашни и разнообразни стоки",address:"ул. „Хаджи Димитър“ 24, Лом",phone:"0896 881 788",hours:"",tags:["Домашни потреби","Разнообразни стоки"]},
    {cat:"home",name:"Океан от любов",kind:"Цветя, подаръци, козметика и сувенири",address:"ул. „Хан Аспарух“ 11, Лом",phone:"0889 032 734",hours:"",tags:["Цветя","Подаръци","Сувенири","Козметика"]},
    {cat:"home",name:"STOP&SHOP",kind:"Магазин с разнообразни стоки",address:"Център, Лом",phone:"",hours:"",tags:["Разнообразни стоки"]},
    {cat:"home",name:"ЕТ Колос",kind:"Градинска техника и машини",address:"ул. „Людовико Миланези“ 15, Лом",phone:"0888 351 135",hours:"",tags:["Градинска техника","Машини","Инструменти"]},
    {cat:"home",name:"Агро Център",kind:"Стоки за градина и земеделие",address:"Младеново, Лом",phone:"",hours:"",tags:["Градина","Земеделие"]},
    {cat:"home",name:"Фуражи и храни за любимци",kind:"Специализиран магазин",address:"ул. „Славянска“ 158, Лом",phone:"",hours:"",tags:["Фуражи","Храни за любимци","Животни"]}
  ];

  const root = document.getElementById("shops-catalog-root");
  const search = document.getElementById("search");
  const count = document.getElementById("count");
  const tabs = [...document.querySelectorAll(".tab")];
  const subs = document.getElementById("subs");
  const subBtns = [...document.querySelectorAll(".sub")];
  const pk = document.getElementById("pk");
  const pt = document.getElementById("pt");
  const pc = document.getElementById("pc");
  const addBtn = document.getElementById("addBtn");
  const modal = document.getElementById("addModal");
  const form = document.getElementById("addForm");
  const addTitle = document.getElementById("addTitle");
  const addStatus = document.getElementById("addStatus");
  const categorySelect = document.getElementById("shopCategory");
  const client = window.PopitaiSupabase || null;

  const STORAGE_KEY = "popitai_magazini_cat";
  const allowedCats = ["food","construction","tech","furniture","clothes","home"];
  const savedCat = localStorage.getItem(STORAGE_KEY);
  let cat = allowedCats.includes(savedCat) ? savedCat : "food";
  let sub = "all";
  let currentUser = null;
  let approvedShops = [];

  const meta = {
    food:["Хранителни","Хранителни магазини в Лом","Супермаркети и местни хранителни магазини."],
    construction:["Строителни","Строителни магазини в Лом","Материали, железария, метали, бои, санитария и обзавеждане за ремонт."],
    tech:["Техника","Магазини за техника в Лом","Електроника, телефони, бяла и черна техника."],
    furniture:["Мебели","Мебелни магазини в Лом","Мебели, обзавеждане и решения за дома."],
    clothes:["Дрехи","Магазини за дрехи в Лом","Дрехи, обувки, бельо и аксесоари."],
    home:["Дом","Магазини за дома в Лом","Домашни потреби, подаръци, градина и специализирани стоки."]
  };

  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[char]));
  const norm = value => String(value || "").toLocaleLowerCase("bg-BG").replace(/\s+/g," ").trim();
  const shopKey = item => `${norm(item.name)}|${norm(item.address)}`;

  function allShops() {
    const seen = new Set();
    return [...staticShops, ...approvedShops].filter(item => {
      const key = shopKey(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function list() {
    const q = norm(search?.value);
    return allShops().filter(shop =>
      shop.cat === cat &&
      (cat !== "construction" || sub === "all" || (shop.groups || []).includes(sub)) &&
      (!q || norm([shop.name,shop.kind,shop.address,shop.phone,shop.hours,...(shop.tags || [])].join(" ")).includes(q))
    );
  }

  function render() {
    if (!root || !search || !count || !pk || !pt || !pc || !subs) return;
    const currentMeta = meta[cat];
    pk.textContent = currentMeta[0];
    pt.textContent = currentMeta[1];
    pc.textContent = currentMeta[2];
    document.getElementById("shops-panel")?.setAttribute("aria-labelledby", `tab-${cat}`);
    subs.hidden = cat !== "construction";
    if (addBtn) addBtn.textContent = `＋ Добави ${currentMeta[0].toLocaleLowerCase("bg-BG")} магазин`;

    const rows = list();
    count.textContent = rows.length ? `${rows.length} обекта` : "";

    if (!rows.length) {
      root.innerHTML = '<div class="empty"><strong>Няма резултат.</strong><br>Промени търсенето или филтъра.</div>';
      return;
    }

    root.innerHTML = rows.map(shop => `
      <article class="card">
        <div class="card-top"><h3>${esc(shop.name)}</h3></div>
        <p class="kind">${esc(shop.kind)}</p>
        <div class="meta">
          ${shop.address ? `<div>📍 ${esc(shop.address)}</div>` : ""}
          ${shop.phone ? `<div>☎ ${esc(shop.phone)}</div>` : ""}
          ${shop.hours ? `<div>🕒 ${esc(shop.hours)}</div>` : ""}
        </div>
        ${(shop.tags || []).length ? `<div class="tags">${shop.tags.map(tag => `<span class="tag">${esc(tag)}</span>`).join("")}</div>` : ""}
        <div class="actions">
          ${shop.phone ? `<a class="act primary" href="tel:${esc(shop.phone.replace(/[^\d+]/g,""))}">Обади се</a>` : ""}
        </div>
      </article>
    `).join("");
  }

  function setFormStatus(message, isError = false) {
    if (!addStatus) return;
    addStatus.textContent = message || "";
    addStatus.classList.toggle("show", Boolean(message));
    addStatus.style.background = isError ? "#fdecec" : "#eef5ff";
    addStatus.style.color = isError ? "#8a2020" : "#305d8d";
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    setFormStatus("");
  }

  function openModal() {
    if (!modal || !form || !currentUser) return;
    const currentMeta = meta[cat];
    if (addTitle) addTitle.textContent = `Добави ${currentMeta[0].toLocaleLowerCase("bg-BG")} магазин`;
    if (categorySelect) categorySelect.value = cat;
    setFormStatus("");
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    form.querySelector("input,select,textarea")?.focus();
  }

  async function loadApprovedShops() {
    if (!client) return;
    const { data, error } = await client
      .from("shops")
      .select("id,name,category,phone,address,working_hours,offer")
      .eq("status","approved")
      .order("created_at",{ascending:true});

    if (error) {
      console.warn("Магазини: публичните предложения не се заредиха.", error);
      return;
    }

    approvedShops = (data || []).map(row => ({
      id: row.id,
      cat: row.category,
      name: row.name,
      kind: row.offer,
      address: row.address,
      phone: row.phone || "",
      hours: row.working_hours || "",
      tags: []
    }));
    render();
  }

  async function loadAuth() {
    if (!client || !addBtn) return;
    addBtn.hidden = true;
    const { data, error } = await client.auth.getUser();
    currentUser = error ? null : data?.user || null;
    addBtn.hidden = !currentUser;
  }

  async function submitShop(event) {
    event.preventDefault();
    if (!client || !form) return;

    const { data: authData } = await client.auth.getUser();
    currentUser = authData?.user || null;
    if (!currentUser) {
      setFormStatus("Влез в профила си, за да добавиш магазин.", true);
      if (addBtn) addBtn.hidden = true;
      return;
    }

    if (!form.reportValidity()) return;

    const fd = new FormData(form);
    const payload = {
      submitted_by: currentUser.id,
      name: String(fd.get("name") || "").trim(),
      category: String(fd.get("category") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      address: String(fd.get("address") || "").trim(),
      working_hours: String(fd.get("working_hours") || "").trim(),
      offer: String(fd.get("offer") || "").trim(),
      source_type: String(fd.get("source_type") || "").trim(),
      source_details: String(fd.get("source_details") || "").trim(),
      status: "pending"
    };

    const submit = form.querySelector('button[type="submit"]');
    if (submit) submit.disabled = true;
    setFormStatus("Изпращане…");

    const { error } = await client.from("shops").insert(payload);
    if (submit) submit.disabled = false;

    if (error) {
      console.error("Магазини: грешка при изпращане.", error);
      setFormStatus("Не успяхме да изпратим предложението. Опитай отново.", true);
      return;
    }

    form.reset();
    if (categorySelect) categorySelect.value = cat;
    setFormStatus("Предложението е изпратено за проверка.");
  }

  tabs.forEach(button => {
    if (!button.hasAttribute("aria-selected")) button.setAttribute("aria-selected","false");
    button.addEventListener("click", () => {
      cat = button.dataset.cat;
      sub = "all";
      localStorage.setItem(STORAGE_KEY, cat);
      tabs.forEach(item => item.setAttribute("aria-selected", item === button ? "true" : "false"));
      subBtns.forEach(item => item.setAttribute("aria-selected", item.dataset.sub === "all" ? "true" : "false"));
      if (search) search.value = "";
      render();
      requestAnimationFrame(() => button.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"}));
    });
  });

  subBtns.forEach(button => button.addEventListener("click", () => {
    sub = button.dataset.sub;
    subBtns.forEach(item => item.setAttribute("aria-selected", item === button ? "true" : "false"));
    render();
  }));

  search?.addEventListener("input", render);
  addBtn?.addEventListener("click", openModal);
  form?.addEventListener("submit", submitShop);
  modal?.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", closeModal));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal && !modal.hidden) closeModal();
  });

  tabs.forEach(item => item.setAttribute("aria-selected", item.dataset.cat === cat ? "true" : "false"));
  const activeTab = tabs.find(item => item.dataset.cat === cat);
  requestAnimationFrame(() => activeTab?.scrollIntoView({block:"nearest",inline:"center"}));

  render();
  Promise.all([loadAuth(), loadApprovedShops()]);
})();