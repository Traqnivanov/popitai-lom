const STATIC_SEARCH_RECORDS = [
  ...(window.PopitaiCategoryDictionary?.staticSearchRecords?.() || []),
  {"type": "Статия", "title": "Как да избереш майстор и да избегнеш неприятни изненади", "desc": "Практични проверки и ясни условия преди ремонт.", "url": "statia.html"}
];
const CATEGORY_ICON_META = {"Майстори и ремонти": {"className": "blue", "icon": "<path d=\"M14.7 6.3a4 4 0 0 0-5.4-5.4L7 3.2l3.8 3.8 2.3-2.3a4 4 0 0 0 1.6 1.6Z\"/><path d=\"M10.8 7 3 14.8a2.1 2.1 0 0 0 3 3L13.8 10\"/><path class=\"icon-accent\" d=\"m4 3 3 3-1.5 1.5-3-3L4 3Zm3 3 14 14\"/>"}, "Здраве и лекари": {"className": "mint", "icon": "<path d=\"M6 3v5a5 5 0 0 0 10 0V3\"/><path d=\"M4 3h2M16 3h2\"/><path d=\"M11 13v2a5 5 0 0 0 10 0v-1\"/><circle class=\"icon-accent\" cx=\"21\" cy=\"12\" r=\"2\"/>"}, "Автомобили": {"className": "slate", "icon": "<path d=\"m5 11 1.4-4A2 2 0 0 1 8.3 5h7.4a2 2 0 0 1 1.9 2l1.4 4\"/><rect x=\"3\" y=\"11\" width=\"18\" height=\"7\" rx=\"2\"/><path d=\"M6 18v2M18 18v2\"/><circle class=\"icon-accent\" cx=\"7.5\" cy=\"14.5\" r=\"1.2\"/><circle class=\"icon-accent\" cx=\"16.5\" cy=\"14.5\" r=\"1.2\"/>"}, "Магазини и покупки": {"className": "sand", "icon": "<path d=\"M6 8h12l1 13H5L6 8Z\"/><path class=\"icon-accent\" d=\"M9 9V6a3 3 0 0 1 6 0v3\"/>"}, "Заведения": {"className": "rose", "icon": "<path d=\"M5 3v7M2.5 3v4.5A2.5 2.5 0 0 0 5 10a2.5 2.5 0 0 0 2.5-2.5V3M5 10v11\"/><path class=\"icon-accent\" d=\"M17 3v18M14 3v6a3 3 0 0 0 3 3\"/>"}, "Работа и услуги": {"className": "violet", "icon": "<rect x=\"3\" y=\"7\" width=\"18\" height=\"13\" rx=\"2\"/><path d=\"M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18\"/><path class=\"icon-accent\" d=\"M10 12v3h4v-3\"/>"}, "Обяви": {"className": "teal", "icon": "<path d=\"M4 10v4M8 8.5v7M8 9l10-4v14L8 15Z\"/><path d=\"m8 15 2.5 5\"/><path class=\"icon-accent\" d=\"M20 8.5c1 .8 1.5 2 1.5 3.5S21 14.7 20 15.5\"/>"}, "Събития и град": {"className": "blue", "icon": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M8 3v4M16 3v4M3 10h18\"/><circle class=\"icon-accent\" cx=\"8\" cy=\"14\" r=\".7\"/><circle class=\"icon-accent\" cx=\"12\" cy=\"14\" r=\".7\"/><circle class=\"icon-accent\" cx=\"16\" cy=\"14\" r=\".7\"/><circle class=\"icon-accent\" cx=\"8\" cy=\"18\" r=\".7\"/><circle class=\"icon-accent\" cx=\"12\" cy=\"18\" r=\".7\"/><circle class=\"icon-accent\" cx=\"16\" cy=\"18\" r=\".7\"/>"}};
// APPROVED CATEGORY ICONS — 2026-08-05

const IVANOV_REMONTI = {
  id: "ivanov-remonti",
  type: "Фирма",
  title: "Иванов Ремонти Лом",
  name: "Иванов Ремонти Лом",
  category: "Майстори и ремонти",
  desc: "Довършителни работи, шпакловка, гипсокартон, боядисване, ВиК, електро и ремонти в Лом.",
  description: "Довършителни работи, шпакловка, гипсокартон, боядисване, ВиК, електро и ремонти в Лом.",
  phone: "",
  status: "promoted",
  promoted: true,
  url: "firma.html?id=d48cae4e-ea29-46fc-8bc0-24ebed828054"
};

const CONSTRUCTION_SEARCH_STEMS = [
  // Общо ремонти — BG
  "строит", "ремонт", "майстор", "довършит", "баня", "бани",
  // Общо ремонти — Latin
  "stroit", "stroит", "remont", "maistor", "dovarshit", "banya",
  // Плочки/фаянс — BG
  "плоч", "фаянс", "теракот", "гранитогрес", "фугир",
  // Плочки/фаянс — Latin
  "ploch", "fayans", "terakot", "fugi",
  // ВиК — BG
  "вик", "водопровод", "канализац", "мивк", "сифон", "кран",
  "смесител", "тоалет", "душ", "вана", "бойлер", "тръб", "теч",
  // ВиК — Latin
  "vik", "vodoprovod", "kanalizac", "mivk", "sifon", "kran",
  "smesitel", "toalet", "dush", "vana", "boyler", "trub", "tech",
  // Електро — BG
  "електро", "електрик", "контакт", "ключ", "табло", "кабел",
  "осветлен", "лампа", "инсталац", "прекъсв",
  // Електро — Latin
  "elektro", "elektrik", "kontakt", "kliuch", "tablo", "kabel",
  "osvetlen", "lampa", "instalac", "prekusv",
  // Боядисване — BG
  "боядис", "боядж", "боя", "латекс", "грунд", "тапет", "акрил",
  // Боядисване — Latin
  "boyadis", "boya", "lateks", "grund", "tapet", "akril",
  // Шпакловка/мазилка — BG
  "шпакл", "мазил", "декоратив", "стукатур", "релеф",
  // Шпакловка/мазилка — Latin
  "shpakl", "mazil", "dekorativ", "stukatur",
  // Гипсокартон/GK — BG
  "гипсокартон", "окачен", "преграда", "звукоизол", "минерална",
  // Гипсокартон/GK — Latin + съкращения
  "gipsokarton", "gk", "гк", "okachen", "pregrada", "zvukoizol",
  // Обръщане/первази — BG
  "обръщ", "перваз", "рамк", "дограм", "прозорец", "врат", "каса",
  // Обръщане/первази — Latin
  "obrush", "pervaz", "ramk", "dograma", "prozorec", "vrat", "kasa",
  // Настилки — BG
  "настил", "ламинат", "паркет", "замазк",
  // Настилки — Latin
  "nastil", "laminat", "parket", "zamazk", "zamазk",
  // Покриви/фасади — BG
  "покрив", "фасад", "изолац", "тенекедж",
  // Покриви/фасади — Latin
  "pokriv", "fasad", "izolac", "tenekedzh",
  // Зидария/бетон — BG
  "зидар", "бетон", "тухл", "цимент", "вар",
  // Зидария/бетон — Latin
  "zidar", "beton", "tuhl", "tuhл", "ciment",
  // Санитария — BG
  "санитар", "фугиран",
  // Санитария — Latin
  "sanitar"
];

function normalizeSearchText(value) {
  return String(value || "")
    .toLocaleLowerCase("bg")
    .replace(/[–—_-]+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isConstructionQuery(value) {
  const query = normalizeSearchText(value);
  const priorityQuery = query
    .replace(/(^|\s)автомивк\p{L}*(?=\s|$)/gu, "$1")
    .replace(/(^|\s)avtomivk\p{L}*(?=\s|$)/gu, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return priorityQuery.length > 0 && CONSTRUCTION_SEARCH_STEMS.some(stem => priorityQuery.includes(stem));
}

function rankSearchRecords(query, records = getAllSearchRecords()) {
  const normalized = normalizeSearchText(query);
  const matches = normalized
    ? records.filter(item =>
        normalizeSearchText(`${item.title} ${item.desc} ${item.type}`).includes(normalized)
      )
    : [...records];

  if (!isConstructionQuery(query)) return matches;

  const withoutIvanov = matches.filter(item => item.id !== IVANOV_REMONTI.id);
  return [IVANOV_REMONTI, ...withoutIvanov];
}

const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[character]));
}

function getStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStored(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function categoryMeta(category) {
  return CATEGORY_ICON_META[category] || CATEGORY_ICON_META["Събития и град"];
}

function publicCategoryLabel(value, type = "") {
  return window.PopitaiCategoryDictionary?.publicLabel?.(value, type) || value || "";
}

function categoryIcon(category, className = "category-symbol") {
  const meta = categoryMeta(category);
  return `<span class="${className} ${className}--${meta.className}" aria-hidden="true"><svg viewBox="0 0 24 24">${meta.icon}</svg></span>`;
}

function formatDate(value) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("bg-BG", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function questionUrl(id) {
  return `vapros.html?id=${encodeURIComponent(id)}`;
}

function businessUrl(id) {
  return `firma.html?id=${encodeURIComponent(id)}`;
}

function firstImageMeta(item) {
  if (Array.isArray(item?.logo) && item.logo.length) return item.logo[0];
  if (Array.isArray(item?.images) && item.images.length) return item.images[0];
  return null;
}

function cardMediaSlot(item, className = "card-media-slot") {
  const image = firstImageMeta(item);
  const variant = image?.variants?.thumb || image?.variants?.medium || image?.variants?.large;
  if (!variant?.key) return "";
  return `
    <div class="${className}"
      data-media-key="${escapeHtml(variant.key)}"
      data-media-width="${escapeHtml(variant.width || "")}"
      data-media-height="${escapeHtml(variant.height || "")}"
      data-media-alt="${escapeHtml(image.caption || item.title || item.name || "")}">
    </div>`;
}

function renderStoredMedia(root = document) {
  if (window.PopitaiImages) {
    window.PopitaiImages.renderMediaSlots(root).catch(() => {});
  }
}

function getQuestions() {
  return getStored("popitaiQuestions", []);
}

function saveQuestions(items) {
  setStored("popitaiQuestions", items);
}

function getBusinesses() {
  return getStored("popitaiBusinesses", []);
}

function saveBusinesses(items) {
  setStored("popitaiBusinesses", items);
}

function getAllSearchRecords() {
  const dynamicQuestions = getQuestions().map(item => ({
    id: item.id,
    type: "Въпрос",
    title: item.title,
    desc: item.description,
    url: questionUrl(item.id)
  }));
  const dynamicBusinesses = getBusinesses().map(item => ({
    id: item.id,
    type: "Фирма",
    title: item.name,
    desc: item.description,
    url: businessUrl(item.id)
  }));
  return [IVANOV_REMONTI, ...STATIC_SEARCH_RECORDS, ...dynamicQuestions, ...dynamicBusinesses];
}

// Навигация
const siteHeader = qs("#site-header");
const menuButton = qs("#menu-button");
const mainNav = qs("#main-nav");
const backToTopButton = qs("#back-to-top");
const currentYear = qs("#current-year");

function setMenu(open) {
  if (!menuButton || !mainNav) return;
  mainNav.classList.toggle("open", open);
  menuButton.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
}

function updateScrollUi() {
  if (siteHeader) siteHeader.classList.toggle("scrolled", window.scrollY > 8);
  if (backToTopButton) backToTopButton.classList.toggle("visible", window.scrollY > 650);
}

if (currentYear) currentYear.textContent = new Date().getFullYear();
window.addEventListener("scroll", updateScrollUi, { passive: true });
updateScrollUi();

if (menuButton) menuButton.addEventListener("click", () => setMenu(!mainNav.classList.contains("open")));
if (backToTopButton) backToTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

document.addEventListener("click", (event) => {
  if (mainNav && menuButton && !mainNav.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

// Търсачка
const searchForm = qs("#search-form");
const searchInput = qs("#main-search");
const clearSearch = qs("#clear-search");
const suggestionsBox = qs("#search-suggestions");

function renderSuggestions(value) {
  if (!suggestionsBox) return;
  const query = value.trim().toLocaleLowerCase("bg");
  if (query.length < 2) {
    suggestionsBox.hidden = true;
    suggestionsBox.innerHTML = "";
    return;
  }

  const matches = rankSearchRecords(value).slice(0, 6);

  suggestionsBox.innerHTML = matches.map(item => `
    <button class="suggestion-item ${item.promoted ? "promoted-suggestion" : ""}" type="button" data-url="${escapeHtml(item.url)}">
      <span>
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(item.type)}</small>
      </span>
    </button>
  `).join("");
  suggestionsBox.hidden = matches.length === 0;
}

if (searchInput) {
  searchInput.addEventListener("input", () => {
    if (clearSearch) clearSearch.classList.toggle("visible", searchInput.value.trim().length > 0);
    renderSuggestions(searchInput.value);
  });
}

if (clearSearch && searchInput) {
  clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    clearSearch.classList.remove("visible");
    if (suggestionsBox) suggestionsBox.hidden = true;
    searchInput.focus();
  });
}

if (suggestionsBox) {
  suggestionsBox.addEventListener("click", (event) => {
    const button = event.target.closest("[data-url]");
    if (button) window.location.href = button.dataset.url;
  });
}

if (searchForm && searchInput) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (query) window.location.href = `tarsene.html?q=${encodeURIComponent(query)}`;
  });
}

qsa("[data-search]").forEach(button => {
  button.addEventListener("click", () => {
    const query = button.dataset.search || "";
    window.location.href = `tarsene.html?q=${encodeURIComponent(query)}`;
  });
});

// Резултати
const resultsForm = qs("#results-search-form");
const resultsInput = qs("#results-search-input");
const resultsContainer = qs("#search-results");
const resultsCount = qs("#results-count");

function renderSearchResults(query) {
  if (!resultsContainer) return;
  const results = rankSearchRecords(query);

  if (resultsInput) resultsInput.value = query;
  if (resultsCount) resultsCount.textContent = `${results.length} резултата за „${query || "всички"}“`;

  resultsContainer.innerHTML = results.length
    ? results.map(item => `
      <article class="search-result-card">
        <span>${escapeHtml(item.type)}</span>
        <h2><a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a></h2>
        <p>${escapeHtml(item.desc)}</p>
        
      </article>`).join("")
    : `<article class="empty-card"><h2>Няма намерени резултати</h2><p>Опитай с по-кратка или различна дума.</p></article>`;
}

if (resultsContainer) {
  const query = new URLSearchParams(window.location.search).get("q") || "";
  renderSearchResults(query);
}

if (resultsForm && resultsInput) {
  resultsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = resultsInput.value.trim();
    history.replaceState(null, "", `tarsene.html?q=${encodeURIComponent(query)}`);
    renderSearchResults(query);
  });
}

// Реална регистрация и вход чрез Supabase
const supabaseClient = window.PopitaiSupabase || null;
let currentUser = null;

try {
  // Премахване на старите тестови профили, в които паролите се пазеха локално.
  localStorage.removeItem("popitaiUsers");
  localStorage.removeItem("popitaiCurrentUser");
} catch (_) {}

function setAuthMessage(selector, message, type = "warning") {
  const element = qs(selector);
  if (!element) return;
  if (window.PopitaiUi?.setFormMessage) {
    window.PopitaiUi.setFormMessage(element, message, type);
    return;
  }
  element.textContent = message;
  element.classList.remove("is-error", "is-success", "is-warning");
  element.classList.add(`is-${type}`);
}

function authErrorMessage(error, action = "login") {
  const message = String(error?.message || "").toLocaleLowerCase("en");
  const code = String(error?.code || "").toLocaleLowerCase("en");

  if (!navigator.onLine || message.includes("failed to fetch") || message.includes("network")) {
    return "Няма връзка със системата. Провери интернет връзката си и опитай отново.";
  }
  if (message.includes("invalid login credentials")) {
    return "Електронната поща или паролата не са правилни.";
  }
  if (message.includes("email not confirmed")) {
    return "Потвърди електронната си поща чрез съобщението, което ти изпратихме.";
  }
  if (message.includes("user already registered") || code.includes("user_already_exists")) {
    return "Вече има профил с тази електронна поща. Опитай да влезеш.";
  }
  if (message.includes("password") && (message.includes("least") || message.includes("weak"))) {
    return "Паролата трябва да съдържа поне 6 знака.";
  }
  if (message.includes("rate limit") || code.includes("rate_limit")) {
    return "Направени са твърде много опити. Изчакай малко и опитай отново.";
  }
  if (message.includes("invalid email")) {
    return "Въведи валиден адрес на електронна поща.";
  }

  return action === "register"
    ? "Не успяхме да създадем профила. Провери данните и опитай отново."
    : "Не успяхме да те впишем. Опитай отново след малко.";
}

function getDisplayName(user) {
  const metadataName = String(user?.user_metadata?.display_name || "").trim();
  if (metadataName) return metadataName;
  return String(user?.email || "Потребител").split("@")[0] || "Потребител";
}

function updateAuthUi(user) {
  currentUser = user
    ? { id: user.id, name: getDisplayName(user), email: user.email || "" }
    : null;
  window.PopitaiAuthUser = user || null;

  qsa(".login-link").forEach(link => {
    link.href = user ? "profil.html" : "vhod.html";
    link.textContent = user ? "Профил" : "Вход";
  });

  const profileName = qs("#profile-name");
  const profileEmail = qs("#profile-email");
  const profileAvatar = qs("#profile-avatar");
  const profileLoginButton = document.querySelector('.profile-actions a[href="vhod.html"]');
  const logoutButton = qs("#logout-button");

  if (profileName && profileEmail && profileAvatar) {
    if (user) {
      const name = getDisplayName(user);
      profileName.textContent = name;
      profileEmail.textContent = user.email || "";
      profileAvatar.textContent = name.charAt(0).toUpperCase();
      if (profileLoginButton) profileLoginButton.hidden = true;
      if (logoutButton) logoutButton.hidden = false;
    } else {
      profileName.textContent = "Посетител";
      profileEmail.textContent = "Не си влязъл в профила си.";
      profileAvatar.textContent = "П";
      if (profileLoginButton) profileLoginButton.hidden = false;
      if (logoutButton) logoutButton.hidden = true;
    }
  }

  const profileQuestionsContainer = qs("#profile-questions");
  if (profileQuestionsContainer && !document.querySelector('script[src*="supabase-content"]')) {
    const ownQuestions = currentUser
      ? getQuestions().filter(item => item.author === currentUser.name)
      : [];
    renderQuestionContainer(profileQuestionsContainer, ownQuestions, false);
  }
}

async function loadAuthUser() {
  if (!supabaseClient) {
    updateAuthUi(null);
    if (qs("#profile-email")) {
      qs("#profile-email").textContent = "Връзката с профилната система временно не е налична.";
    }
    return null;
  }

  const { data, error } = await supabaseClient.auth.getUser();
  if (error) {
    updateAuthUi(null);
    return null;
  }

  updateAuthUi(data.user || null);
  return data.user || null;
}

const registerForm = qs("#register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async event => {
    event.preventDefault();
    const submitButton = registerForm.querySelector('[type="submit"]');

    if (!supabaseClient) {
      setAuthMessage("#register-message", "Регистрацията временно не е достъпна. Опитай отново след малко.", "error");
      return;
    }

    const displayName = qs("#register-name").value.trim();
    const email = qs("#register-email").value.trim().toLowerCase();
    const password = qs("#register-password").value;
    const passwordConfirm = qs("#register-password-confirm").value;

    if (password !== passwordConfirm) {
      setAuthMessage("#register-message", "Паролите не съвпадат.", "error");
      return;
    }

    submitButton.disabled = true;
    setAuthMessage("#register-message", "Създаваме профила…", "warning");

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: new URL("profil.html", window.location.href).href
      }
    });

    if (error) {
      setAuthMessage("#register-message", authErrorMessage(error, "register"), "error");
      submitButton.disabled = false;
      return;
    }

    registerForm.reset();
    if (data.session) {
      setAuthMessage("#register-message", "Профилът е създаден успешно. Пренасочваме те към профила…", "success");
      setTimeout(() => { window.location.href = "profil.html"; }, 800);
      return;
    }

    setAuthMessage(
      "#register-message",
      "Регистрацията е успешна. Изпратихме ти имейл — отвори го и потвърди профила си.",
      "success"
    );
    submitButton.disabled = false;
  });
}

document.querySelectorAll(".password-toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    if (!input) return;
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    btn.setAttribute("aria-label", show ? "Скрий паролата" : "Покажи паролата");
  });
});

const loginForm = qs("#login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async event => {
    event.preventDefault();
    const submitButton = loginForm.querySelector('[type="submit"]');

    if (!supabaseClient) {
      setAuthMessage("#login-message", "Входът временно не е достъпен. Опитай отново след малко.", "error");
      return;
    }

    const email = qs("#login-email").value.trim().toLowerCase();
    const password = qs("#login-password").value;

    submitButton.disabled = true;
    setAuthMessage("#login-message", "Проверяваме данните…", "warning");

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthMessage("#login-message", authErrorMessage(error, "login"), "error");
      submitButton.disabled = false;
      return;
    }

    updateAuthUi(data.user || null);
    setAuthMessage("#login-message", "Успешен вход. Пренасочваме те към профила…", "success");
    setTimeout(() => { window.location.href = "profil.html"; }, 600);
  });
}

// Забравена парола
const forgotForm = qs("#forgot-password-form");
if (forgotForm) {
  forgotForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (!supabaseClient) { setAuthMessage("#forgot-message", "Услугата временно не е достъпна.", "error"); return; }
    const submitButton = forgotForm.querySelector('[type="submit"]');
    const email = qs("#forgot-email").value.trim().toLowerCase();
    submitButton.disabled = true;
    setAuthMessage("#forgot-message", "Изпращаме линк…", "warning");
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: new URL("nova-parola.html", window.location.href).href
    });
    if (error) {
      setAuthMessage("#forgot-message", "Възникна грешка. Провери имейла и опитай отново.", "error");
      submitButton.disabled = false;
      return;
    }
    setAuthMessage("#forgot-message", "Изпратихме ти имейл с линк за нова парола.", "success");
    forgotForm.reset();
  });
}

// Нова парола (след reset линк)
const newPasswordForm = qs("#new-password-form");
if (newPasswordForm) {
  newPasswordForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (!supabaseClient) { setAuthMessage("#new-password-message", "Услугата временно не е достъпна.", "error"); return; }
    const submitButton = newPasswordForm.querySelector('[type="submit"]');
    const password = qs("#reset-password").value;
    const confirm = qs("#reset-password-confirm").value;
    if (password !== confirm) { setAuthMessage("#new-password-message", "Паролите не съвпадат.", "error"); return; }
    submitButton.disabled = true;
    setAuthMessage("#new-password-message", "Запазваме паролата…", "warning");
    const { error } = await supabaseClient.auth.updateUser({ password });
    if (error) {
      setAuthMessage("#new-password-message", "Линкът е изтекъл или невалиден. Поискай нов.", "error");
      submitButton.disabled = false;
      return;
    }
    setAuthMessage("#new-password-message", "Паролата е сменена. Пренасочваме те към профила…", "success");
    setTimeout(() => { window.location.href = "profil.html"; }, 1000);
  });
}

// Смяна на парола от профила
const changePasswordForm = qs("#change-password-form");
if (changePasswordForm) {
  changePasswordForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (!supabaseClient) { setAuthMessage("#change-password-message", "Услугата временно не е достъпна.", "error"); return; }
    const submitButton = changePasswordForm.querySelector('[type="submit"]');
    const password = qs("#new-password").value;
    const confirm = qs("#new-password-confirm").value;
    if (password !== confirm) { setAuthMessage("#change-password-message", "Паролите не съвпадат.", "error"); return; }
    submitButton.disabled = true;
    setAuthMessage("#change-password-message", "Запазваме паролата…", "warning");
    const { error } = await supabaseClient.auth.updateUser({ password });
    if (error) {
      setAuthMessage("#change-password-message", "Грешка при смяната. Опитай отново.", "error");
      submitButton.disabled = false;
      return;
    }
    setAuthMessage("#change-password-message", "Паролата е сменена успешно.", "success");
    changePasswordForm.reset();
    submitButton.disabled = false;
  });
}

const logoutButton = qs("#logout-button");
if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    logoutButton.disabled = true;
    if (supabaseClient) await supabaseClient.auth.signOut();
    updateAuthUi(null);
    window.location.href = "index.html";
  });
}

if (supabaseClient) {
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    updateAuthUi(session?.user || null);
  });
}

loadAuthUser();

// Публикуване на въпрос
const newQuestionForm = qs("#new-question-form");
if (newQuestionForm) {
  const categoryFromUrl = new URLSearchParams(window.location.search).get("category");
  const categoryFromDictionary = window.PopitaiCategoryDictionary?.publicCategories?.find(
    item => item.id === categoryFromUrl
  );
  const questionCategoryValue = categoryFromDictionary?.values?.question || "";
  const questionCategorySelect = qs("#question-category");
  if (questionCategoryValue && questionCategorySelect &&
      Array.from(questionCategorySelect.options).some(option => option.value === questionCategoryValue)) {
    questionCategorySelect.value = questionCategoryValue;
  }
}

function questionCard(item, compact = false) {
  const answers = Array.isArray(item.answers) ? item.answers.length : 0;
  const testBadge = item.isTest ? '<span class="test-badge">ТЕСТ</span>' : "";
  const media = cardMediaSlot(item, compact ? "compact-card-media" : "question-list-media");
  const categoryLabel = publicCategoryLabel(item.category, "question");
  if (compact) {
    return `
      <article class="compact-card dynamic-question-card" data-question-id="${escapeHtml(item.id)}">
        ${media}
        <div class="question-card-category-row">
          ${categoryIcon(item.category, "category-symbol-small")}
          <span class="question-category">${escapeHtml(categoryLabel)}</span>
          ${testBadge}
        </div>
        <h3><a href="${questionUrl(item.id)}">${escapeHtml(item.title)}</a></h3>
        <p>${escapeHtml(item.description)}</p>
        <small>${answers} ${answers === 1 ? "отговор" : "отговора"}</small>
      </article>`;
  }
  return `
    <article class="list-card question-list-card dynamic-question-card" data-question-id="${escapeHtml(item.id)}">
      ${media}
      <div class="question-list-content">
        <div class="question-card-category-row">
          ${categoryIcon(item.category, "category-symbol-small")}
          <span class="question-category">${escapeHtml(categoryLabel)}</span>
          ${testBadge}
        </div>
        <h2><a href="${questionUrl(item.id)}">${escapeHtml(item.title)}</a></h2>
        <p>${escapeHtml(item.description)}</p>
        <small>Публикувано от ${escapeHtml(item.author || "Гост")} · ${formatDate(item.createdAt)}</small>
      </div>
      <div class="list-card-meta"><strong>${answers}</strong><span>${answers === 1 ? "отговор" : "отговора"}</span></div>
    </article>`;
}

function renderQuestionContainer(container, items, compact = false) {
  if (!container) return;
  if (!items.length) {
    container.innerHTML = `<article class="empty-card"><h3>Все още няма публикувани въпроси</h3><p>Публикувай реален въпрос или използвай административния тестов панел.</p><a class="primary-link-button" href="nov-vapros.html">Задай въпрос</a></article>`;
    return;
  }
  container.innerHTML = items.map(item => questionCard(item, compact)).join("");
  renderStoredMedia(container);
}

const questionsList = qs("#questions-list");
if (questionsList) renderQuestionContainer(questionsList, getQuestions(), false);

const homeQuestions = qs("#home-questions");
if (homeQuestions) renderQuestionContainer(homeQuestions, getQuestions().slice(0, 4), true);

qsa(".category-question-list").forEach(container => {
  const category = container.dataset.questionCategory;
  renderQuestionContainer(container, getQuestions().filter(item => item.category === category).slice(0, 4), true);
});

const profileQuestions = qs("#profile-questions");
if (profileQuestions && !qs('script[src*="supabase-content"]')) {
  const own = currentUser ? getQuestions().filter(item => item.author === currentUser.name) : [];
  renderQuestionContainer(profileQuestions, own, false);
}

// Филтри
qsa("[data-question-filter]").forEach(button => {
  button.addEventListener("click", () => {
    qsa("[data-question-filter]").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const mode = button.dataset.questionFilter;
    const filtered = getQuestions().filter(item => {
      const count = Array.isArray(item.answers) ? item.answers.length : 0;
      if (mode === "answered") return count > 0;
      if (mode === "unanswered") return count === 0;
      return true;
    });
    renderQuestionContainer(questionsList, filtered, false);
  });
});

// Детайл на въпрос
function renderQuestionDetail() {
  if (document.querySelector('script[data-popitai-supabase-content]')) return;
  const titleEl = qs("#question-detail-title");
  if (!titleEl) return;

  const id = new URLSearchParams(window.location.search).get("id");
  const questions = getQuestions();
  const question = questions.find(item => String(item.id) === String(id));
  const detailCard = qs("#question-detail-card");
  const notFound = qs("#question-not-found");
  const answerArea = qs("#question-answer-area");

  if (!question) {
    titleEl.textContent = "Въпросът не е намерен";
    qs("#question-detail-summary").textContent = "";
    if (detailCard) detailCard.hidden = true;
    if (notFound) notFound.hidden = false;
    if (answerArea) answerArea.hidden = true;
    return;
  }

  const categoryInfo = window.PopitaiCategoryDictionary?.categoryForValue?.("question", question.category);
  const categoryLabel = publicCategoryLabel(question.category, "question");
  document.title = `${question.title} | Попитай.Лом`;
  titleEl.textContent = question.title;
  qs("#question-detail-summary").textContent = question.description;
  qs("#question-detail-description").textContent = question.description;
  if (window.PopitaiImages) {
    window.PopitaiImages.renderGallery(
      qs("#question-gallery"),
      question.images || [],
      { altPrefix: question.title }
    ).catch(() => {});
  }
  qs("#question-author-name").textContent = question.author || "Гост";
  qs("#question-author-avatar").textContent = (question.author || "Г").charAt(0).toUpperCase();
  qs("#question-created-at").textContent = formatDate(question.createdAt);
  qs("#question-hero-category").innerHTML = `${categoryIcon(question.category)}<span>${escapeHtml(categoryLabel)}</span>${question.isTest ? '<span class="test-badge">ТЕСТ</span>' : ""}`;
  const categoryLink = qs("#question-category-link");
  categoryLink.href = categoryInfo?.route || "kategorii.html";
  categoryLink.textContent = categoryLabel;

  const answers = Array.isArray(question.answers) ? question.answers : [];
  const answersList = qs("#answers-list");
  const answersCount = qs("#answers-count");
  if (answersCount) answersCount.textContent = `${answers.length} ${answers.length === 1 ? "отговор" : "отговора"}`;
  if (answersList) {
    answersList.innerHTML = answers.length
      ? answers.map(answer => `
        <article class="answer-card">
          <div class="author-row">
            <div class="avatar">${escapeHtml((answer.author || "Г").charAt(0).toUpperCase())}</div>
            <div><strong>${escapeHtml(answer.author || "Гост")}</strong><span>${formatDate(answer.createdAt)}</span></div>
          </div>
          <p>${escapeHtml(answer.text)}</p>
        </article>`).join("")
      : '<article class="empty-card"><p>Все още няма отговори.</p></article>';
  }

  const answerForm = qs("#answer-form");
  if (answerForm) {
    answerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = qs("#answer-text").value.trim();
      if (!text) return;
      const user = (currentUser || { name: "Гост" });
      const all = getQuestions();
      const target = all.find(item => String(item.id) === String(id));
      if (!target) return;
      if (!Array.isArray(target.answers)) target.answers = [];
      target.answers.push({
        id: `a-${Date.now()}`,
        text,
        author: user.name,
        createdAt: new Date().toISOString()
      });
      saveQuestions(all);
      qs("#answer-message").textContent = "Благодарим! Отговорът е изпратен за преглед и ще се появи след одобрение от администратор.";
      qs("#answer-text").value = "";
      renderQuestionDetail();
    }, { once: true });
  }

  const shareButton = qs("#question-share-button");
  if (shareButton) {
    shareButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        shareButton.textContent = "Адресът е копиран";
      } catch {
        shareButton.textContent = "Копирай адреса от браузъра";
      }
    });
  }
}

renderQuestionDetail();

// Фирми
function businessCard(item) {
  const initials = item.name.split(/\s+/).slice(0,2).map(word => word.charAt(0)).join("").toUpperCase();
  const media = cardMediaSlot(item, "business-card-media");
  const categoryLabel = publicCategoryLabel(item.category, "business");
  return `
    <article class="business-list-card" data-business-id="${escapeHtml(item.id)}">
      ${media || `<div class="firm-logo">${escapeHtml(initials || "Ф")}</div>`}
      <div class="business-main">
        <div class="firm-title-row">
          <h2><a href="${businessUrl(item.id)}">${escapeHtml(item.name)}</a></h2>
          <span class="pending-badge ${item.promoted ? "promoted-badge" : ""}">${item.promoted ? "ПРОМОТИРАН" : (item.isTest ? "ТЕСТ" : "Чака преглед")}</span>
        </div>
        <span class="question-category">${escapeHtml(categoryLabel)}</span>
        <p>${escapeHtml(item.description)}</p>
        <div class="firm-footer"><span>Без измислена оценка</span><a href="${businessUrl(item.id)}">Виж профила</a></div>
      </div>
    </article>`;
}

function renderBusinesses(container, items, limit = null) {
  if (!container) return;
  const data = limit ? items.slice(0, limit) : items;
  if (!data.length) {
    container.innerHTML = `<article class="empty-card empty-card-wide"><h3>Все още няма добавени фирми</h3><p>Добави реален профил или използвай тестовия панел.</p><a class="primary-link-button" href="dobavi-firma.html">Добави фирма</a></article>`;
    return;
  }
  container.innerHTML = data.map(businessCard).join("");
  renderStoredMedia(container);
}

renderBusinesses(qs("#businesses-list"), [IVANOV_REMONTI, ...getBusinesses()]);
renderBusinesses(qs("#home-businesses"), getBusinesses(), 3);

const companyForm = qs("#company-form");
if (companyForm) {
  companyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = companyForm.querySelector('[type="submit"]');
    submitButton.disabled = true;
    qs("#company-message").textContent = "Обработване на фирмения профил…";

    try {
      const businesses = getBusinesses();
      const id = `b-${Date.now()}`;
      const [logo, images] = window.PopitaiImages
        ? await Promise.all([
            window.PopitaiImages.commit("company-logo-uploader", "business-logo", id),
            window.PopitaiImages.commit("company-gallery-uploader", "business", id)
          ])
        : [[], []];

      businesses.unshift({
        id,
        name: qs("#company-name").value.trim(),
        category: qs("#company-category").value,
        phone: qs("#company-phone").value.trim(),
        description: qs("#company-description").value.trim(),
        status: "pending",
        createdAt: new Date().toISOString(),
        isTest: false,
        logo,
        images
      });
      saveBusinesses(businesses);
      qs("#company-message").textContent = "Благодарим! Фирменият профил и снимките са изпратени за преглед и ще се появят след одобрение от администратор.";
      setTimeout(() => window.location.href = businessUrl(id), 500);
    } catch (error) {
      qs("#company-message").textContent = error instanceof Error
        ? error.message
        : "Не успяхме да изпратим фирмения профил. Провери данните и опитай отново.";
      submitButton.disabled = false;
    }
  });
}

function renderBusinessDetail() {
  const nameEl = qs("#business-detail-name");
  if (!nameEl) return;
  const id = new URLSearchParams(window.location.search).get("id");
  const item = String(id) === IVANOV_REMONTI.id
    ? IVANOV_REMONTI
    : getBusinesses().find(business => String(business.id) === String(id));
  if (!item) {
    nameEl.textContent = "Фирмата не е намерена";
    qs("#business-detail-summary").textContent = "";
    qs("#business-detail-card").hidden = true;
    qs("#business-contact-panel").hidden = true;
    qs("#business-not-found").hidden = false;
    return;
  }
  const initials = item.name.split(/\s+/).slice(0,2).map(word => word.charAt(0)).join("").toUpperCase();
  document.title = `${item.name} | Попитай.Лом`;
  nameEl.textContent = item.name;
  qs("#business-detail-summary").textContent = item.description;
  qs("#business-detail-description").textContent = item.description;
  qs("#business-detail-category").textContent = publicCategoryLabel(item.category, "business");
  qs("#business-detail-logo").textContent = initials || "Ф";
  if (window.PopitaiImages) {
    const logoMeta = Array.isArray(item.logo) ? item.logo[0] : null;
    if (logoMeta) {
      window.PopitaiImages.renderLogo(
        qs("#business-detail-logo-image"),
        logoMeta,
        item.name
      ).then(rendered => {
        if (rendered) qs("#business-detail-logo").hidden = true;
      }).catch(() => {});
    }
    window.PopitaiImages.renderGallery(
      qs("#business-gallery"),
      item.images || [],
      { altPrefix: item.name }
    ).catch(() => {});
  }
  qs("#business-detail-status").textContent = item.promoted
    ? "ПРОМОТИРАН ПРОФИЛ"
    : (item.isTest ? "ТЕСТОВ ПРОФИЛ" : "Чака преглед");
  const phone = qs("#business-detail-phone");
  phone.textContent = item.phone || "Не е посочен";
  phone.href = item.phone ? `tel:${item.phone.replace(/\s+/g, "")}` : "#";
}

renderBusinessDetail();

// Административен панел и тестови записи
function renderAdminQuestions() {
  const container = qs("#admin-questions");
  if (!container) return;
  const items = getQuestions();
  if (!items.length) {
    container.innerHTML = '<article class="empty-card"><p>Няма публикувани въпроси.</p></article>';
    return;
  }
  container.innerHTML = items.map(item => `
    <article class="list-card admin-question-row" data-question-id="${escapeHtml(item.id)}">
      <div>
        <span class="question-category">${escapeHtml(item.category)}</span>
        <h2><a href="${questionUrl(item.id)}">${escapeHtml(item.title)}</a></h2>
        <p>${escapeHtml(item.description)}</p>
      </div>
      <button class="delete-question" type="button">Изтрий</button>
    </article>`).join("");

  qsa(".delete-question", container).forEach(button => {
    button.addEventListener("click", () => {
      const card = button.closest("[data-question-id]");
      const id = card.dataset.questionId;
      saveQuestions(getQuestions().filter(item => String(item.id) !== String(id)));
      if (window.PopitaiImages) window.PopitaiImages.deleteEntity(id).catch(() => {});
      renderAdminQuestions();
      updateAdminCounts();
    });
  });
}

function updateAdminCounts() {
  if (qs("#admin-users-count")) qs("#admin-users-count").textContent = getStored("popitaiUsers", []).length;
  if (qs("#admin-questions-count")) qs("#admin-questions-count").textContent = getQuestions().length;
}

renderAdminQuestions();
updateAdminCounts();

const seedButton = qs("#seed-test-data");
if (seedButton) {
  seedButton.addEventListener("click", () => {
    const now = Date.now();
    const realQuestions = getQuestions().filter(item => !item.isTest);
    const tests = [
      {
        id: `test-q-${now}-1`,
        title: "[ТЕСТ] Как се отваря отделният въпрос?",
        category: "Майстори и ремонти",
        description: "Този запис проверява дали се отваря правилната страница за конкретния въпрос.",
        author: "Тестов потребител",
        createdAt: new Date().toISOString(),
        answers: [],
        isTest: true
      },
      {
        id: `test-q-${now}-2`,
        title: "[ТЕСТ] Работи ли отделният отговор?",
        category: "Здраве и лекари",
        description: "Добави отговор тук и провери дали не се появява към друг въпрос.",
        author: "Тестов потребител",
        createdAt: new Date().toISOString(),
        answers: [],
        isTest: true
      },
      {
        id: `test-q-${now}-3`,
        title: "[ТЕСТ] Филтриране по категория",
        category: "Автомобили",
        description: "Този въпрос трябва да се вижда само в категория Автомобили.",
        author: "Тестов потребител",
        createdAt: new Date().toISOString(),
        answers: [],
        isTest: true
      }
    ];
    saveQuestions([...tests, ...realQuestions]);

    const realBusinesses = getBusinesses().filter(item => !item.isTest);
    saveBusinesses([
      {
        id: `test-b-${now}-1`,
        name: "[ТЕСТ] Фирмен профил",
        category: "Майстори и ремонти",
        phone: "0000000000",
        description: "Тестов профил само за проверка на навигацията.",
        status: "pending",
        createdAt: new Date().toISOString(),
        isTest: true
      },
      ...realBusinesses
    ]);

    qs("#test-data-message").textContent = "Тестовите записи са добавени само в този браузър.";
    renderAdminQuestions();
    updateAdminCounts();
  });
}

const clearButton = qs("#clear-test-data");
if (clearButton) {
  clearButton.addEventListener("click", () => {
    saveQuestions(getQuestions().filter(item => !item.isTest));
    saveBusinesses(getBusinesses().filter(item => !item.isTest));
    qs("#test-data-message").textContent = "Тестовите записи са изчистени. Реалните записи са запазени.";
    renderAdminQuestions();
    updateAdminCounts();
  });
}

// Контактни форми
qsa(".simple-contact-form").forEach(form => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = qs(".form-message", form);
    if (message) message.textContent = "Благодарим! Формулярът е приет. Възможно е обработката да се забави, докато сайтът е в процес на разработка.";
    form.reset();
  });
});

// SITE STATUS AND ERROR SYSTEM — 2026-08-05
(() => {
  const MESSAGES = {
    offline: 'Няма връзка с интернет. Провери връзката си и опитай отново.',
    server: 'В момента не успяваме да се свържем със системата. Моля, опитай след малко.',
    generic: 'Извиняваме се — нещо не се получи. Попитай.Лом все още се разработва. Опитай отново след малко.',
    permission: 'Нямаш достъп до тази страница.',
    blocked: 'Този профил е временно ограничен. Свържи се с администратора за повече информация.',
    image: 'Снимката не може да бъде качена. Използвай JPG, PNG или WebP до 10 MB.',
    required: 'Моля, попълни това поле.',
    pending: 'Благодарим! Съдържанието е изпратено за преглед и ще се появи след одобрение от администратор.'
  };

  function ensureToastRegion() {
    let region = document.querySelector('.site-toast-region');
    if (!region) {
      region = document.createElement('div');
      region.className = 'site-toast-region';
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      document.body.appendChild(region);
    }
    return region;
  }

  function showToast(message, type = 'warning', title = '') {
    const region = ensureToastRegion();
    const toast = document.createElement('div');
    toast.className = 'site-toast';
    toast.dataset.type = type;

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Затвори');
    closeButton.textContent = '×';

    const textWrap = document.createElement('div');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title;
      textWrap.appendChild(strong);
    }
    const span = document.createElement('span');
    span.textContent = message;
    textWrap.appendChild(span);

    toast.append(closeButton, textWrap);
    closeButton.addEventListener('click', () => toast.remove());
    region.appendChild(toast);
    setTimeout(() => toast.remove(), 7000);
  }

  function setFormMessage(target, message, type = 'warning') {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;
    element.textContent = message;
    element.classList.remove('is-error', 'is-success', 'is-warning');
    element.classList.add(`is-${type}`);
  }

  function insertDevelopmentBanner() {
    if (sessionStorage.getItem('popitaiDevBannerClosed') === '1') return;
    if (document.querySelector('.site-status-banner')) return;

    const banner = document.createElement('div');
    banner.className = 'site-status-banner';

    const message = document.createElement('span');
    const strong = document.createElement('strong');
    strong.textContent = 'Попитай.Лом е в процес на разработка. ';
    message.append(
      strong,
      document.createTextNode('Възможно е някои функции временно да не работят. Благодарим за разбирането.')
    );

    const closeButton = document.createElement('button');
    closeButton.className = 'site-status-close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Затвори съобщението');
    closeButton.textContent = '×';

    banner.append(message, closeButton);
    document.body.prepend(banner);
    closeButton.addEventListener('click', () => {
      sessionStorage.setItem('popitaiDevBannerClosed', '1');
      banner.remove();
    });
  }

  function improveValidationMessages() {
    document.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('invalid', () => {
        if (field.validity.valueMissing) field.setCustomValidity(MESSAGES.required);
        else if (field.validity.typeMismatch) field.setCustomValidity('Моля, въведи валидни данни.');
        else if (field.validity.tooShort) field.setCustomValidity(`Моля, въведи поне ${field.minLength} знака.`);
        else field.setCustomValidity('Моля, провери това поле.');
      });
      field.addEventListener('input', () => field.setCustomValidity(''));
      field.addEventListener('change', () => field.setCustomValidity(''));
    });
  }

  window.PopitaiUi = { showToast, setFormMessage, messages: MESSAGES };

  window.addEventListener('offline', () => showToast(MESSAGES.offline, 'error', 'Няма интернет'));
  window.addEventListener('online', () => showToast('Връзката с интернет е възстановена.', 'success', 'Отново си онлайн'));
  const isAdminWorkspace = () => document.body?.classList?.contains('admin-panel-v2');

  window.addEventListener('unhandledrejection', () => {
    if (isAdminWorkspace()) return;
    showToast(MESSAGES.generic, 'error', 'Възникна проблем');
  });
  window.addEventListener('error', event => {
    if (isAdminWorkspace()) return;
    if (event.target !== window) showToast(MESSAGES.generic, 'error', 'Възникна проблем');
  }, true);

  document.addEventListener('DOMContentLoaded', () => {
    insertDevelopmentBanner();
    improveValidationMessages();
    if (!navigator.onLine) showToast(MESSAGES.offline, 'error', 'Няма интернет');
  });
})();

