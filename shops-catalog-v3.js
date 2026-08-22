(() => {
  "use strict";

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
  const phoneInput = document.getElementById("shopPhone");
  const client = window.PopitaiSupabase || null;

  const STORAGE_KEY = "popitai_magazini_cat";
  const allowedCats = ["food","construction","tech","furniture","clothes","home"];
  const savedCat = localStorage.getItem(STORAGE_KEY);
  let cat = allowedCats.includes(savedCat) ? savedCat : "food";
  let sub = "all";
  let currentUser = null;
  let shops = [];
  let loaded = false;

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

  function phoneDigits(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function phoneValidationMessage(value) {
    const normalized = String(value || "").trim();
    if (!normalized) return "";
    if (/\p{L}/u.test(normalized)) return "Телефонът не може да съдържа букви.";
    if (!/^[+\d\s().-]+$/.test(normalized)) return "Използвай само цифри, интервали, +, тирета или скоби.";
    if ((normalized.match(/\+/g) || []).length > 1 || (normalized.includes("+") && !normalized.startsWith("+"))) {
      return "Знакът + може да бъде само веднъж и в началото.";
    }

    const digits = phoneDigits(normalized);
    if (/^(\d)\1+$/.test(digits)) return "Въведи реален телефонен номер.";

    if (normalized.startsWith("+")) {
      if (!normalized.startsWith("+359")) return "Международният български номер трябва да започва с +359.";
      if (![11, 12].includes(digits.length)) return "След +359 трябва да има 8 или 9 цифри.";
      if (digits.charAt(3) === "0") return "След +359 не се изписва началната нула.";
      return "";
    }

    if (!digits.startsWith("0")) return "Българският номер трябва да започва с 0 или +359.";
    if (![9, 10].includes(digits.length)) return "Телефонът трябва да съдържа общо 9 или 10 цифри.";
    return "";
  }

  function ensurePhoneError() {
    if (!phoneInput) return null;
    let error = document.getElementById("shopPhoneError");
    if (error) return error;
    error = document.createElement("p");
    error.id = "shopPhoneError";
    error.className = "help";
    error.setAttribute("aria-live", "polite");
    phoneInput.insertAdjacentElement("afterend", error);
    const describedBy = new Set((phoneInput.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
    describedBy.add(error.id);
    phoneInput.setAttribute("aria-describedby", [...describedBy].join(" "));
    return error;
  }

  function validatePhone() {
    if (!phoneInput) return true;
    const error = ensurePhoneError();
    const message = phoneValidationMessage(phoneInput.value);
    if (error) {
      error.textContent = message;
      error.style.color = message ? "#b42318" : "";
      error.style.fontWeight = message ? "800" : "";
    }
    phoneInput.setAttribute("aria-invalid", String(Boolean(message)));
    phoneInput.style.borderColor = message ? "#b42318" : "";
    return !message;
  }

  function resetPhoneValidation() {
    if (!phoneInput) return;
    delete phoneInput.dataset.touched;
    phoneInput.removeAttribute("aria-invalid");
    phoneInput.style.borderColor = "";
    const error = document.getElementById("shopPhoneError");
    if (error) error.textContent = "";
  }

  function list() {
    const q = norm(search?.value);
    return shops.filter(shop =>
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

    if (!loaded) {
      count.textContent = "";
      root.innerHTML = '<div class="empty"><strong>Зареждане на магазините…</strong></div>';
      return;
    }

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

  async function loadShops() {
    if (!client) {
      loaded = true;
      if (root) root.innerHTML = '<div class="empty"><strong>Магазините не могат да се заредят.</strong></div>';
      return;
    }

    const { data, error } = await client
      .from("shops")
      .select("id,name,category,phone,address,working_hours,offer,tags,groups")
      .eq("status","approved")
      .order("created_at",{ascending:true});

    loaded = true;
    if (error) {
      console.warn("Магазини: публичните записи не се заредиха.", error);
      if (root) root.innerHTML = '<div class="empty"><strong>Магазините не могат да се заредят.</strong><br>Опитай отново след малко.</div>';
      count.textContent = "";
      return;
    }

    shops = (data || []).map(row => ({
      id: row.id,
      cat: row.category,
      name: row.name,
      kind: row.offer,
      address: row.address,
      phone: row.phone || "",
      hours: row.working_hours || "",
      tags: Array.isArray(row.tags) ? row.tags : [],
      groups: Array.isArray(row.groups) ? row.groups : []
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
    if (!validatePhone()) {
      phoneInput?.focus();
      return;
    }

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
      setFormStatus("Не успяхме да изпратим предложението. Провери данните и опитай отново.", true);
      return;
    }

    form.reset();
    resetPhoneValidation();
    if (categorySelect) categorySelect.value = cat;
    setFormStatus("Предложението е изпратено за проверка.");
  }

  phoneInput?.addEventListener("blur", () => {
    phoneInput.dataset.touched = "true";
    validatePhone();
  });
  phoneInput?.addEventListener("input", () => {
    if (phoneInput.dataset.touched === "true" || phoneInput.getAttribute("aria-invalid") === "true") {
      validatePhone();
    }
  });

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
  Promise.all([loadAuth(), loadShops()]);
})();