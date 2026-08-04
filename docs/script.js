const STATIC_SEARCH_RECORDS = [{"type": "Категория", "title": "Майстори и ремонти", "desc": "Ремонти, ВиК, електро, покриви, дограма и услуги за дома.", "url": "maistori.html"}, {"type": "Категория", "title": "Здраве и лекари", "desc": "Лекари, стоматолози, аптеки и здравни услуги.", "url": "zdrave.html"}, {"type": "Категория", "title": "Автомобили", "desc": "Сервизи, гуми, части, автомивки и пътна помощ.", "url": "avtomobili.html"}, {"type": "Категория", "title": "Магазини и покупки", "desc": "Местни магазини, материали, техника и покупки.", "url": "magazini.html"}, {"type": "Категория", "title": "Заведения", "desc": "Ресторанти, кафенета, пицарии и доставки.", "url": "zavedenia.html"}, {"type": "Категория", "title": "Работа и услуги", "desc": "Работа и услуги, предлагани от местни хора.", "url": "rabota.html"}, {"type": "Категория", "title": "Обяви", "desc": "Купува, продава, подарява, наема и търси.", "url": "obyavi.html"}, {"type": "Категория", "title": "Събития и град", "desc": "Събития, институции и полезна градска информация.", "url": "sabitiya.html"}, {"type": "Статия", "title": "Как да избереш майстор и да избегнеш неприятни изненади", "desc": "Практични проверки и ясни условия преди ремонт.", "url": "statia.html"}];
const CATEGORY_META = {"Майстори и ремонти": {"slug": "maistori", "className": "blue", "icon": "<path d=\"M14.7 6.3a4 4 0 0 0-5-5L7.4 3.6l3 3 2.3-2.3a4 4 0 0 0 2 2Z\"/><path d=\"m5 10 9 9a2.1 2.1 0 0 0 3-3l-9-9\"/><path d=\"m3 21 5.5-5.5\"/>"}, "Здраве и лекари": {"slug": "zdrave", "className": "mint", "icon": "<path d=\"M8 2h8\"/><path d=\"M12 2v20\"/><path d=\"M2 12h20\"/>"}, "Автомобили": {"slug": "avtomobili", "className": "slate", "icon": "<path d=\"M3 14h18\"/><path d=\"M5 14l1.5-4.5A2 2 0 0 1 8.4 8h7.2a2 2 0 0 1 1.9 1.5L19 14\"/><path d=\"M6 18h.01M18 18h.01\"/><path d=\"M4 14v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3\"/>"}, "Магазини и покупки": {"slug": "magazini", "className": "sand", "icon": "<path d=\"M6 7h12l-1 12H7L6 7Z\"/><path d=\"M9 7a3 3 0 1 1 6 0\"/>"}, "Заведения": {"slug": "zavedenia", "className": "rose", "icon": "<path d=\"M5 3v8M8 3v8M5 7h3M6.5 11v10\"/><path d=\"M14 3v18M14 3c2.5 0 4 2 4 4s-1.5 4-4 4\"/>"}, "Работа и услуги": {"slug": "rabota", "className": "violet", "icon": "<path d=\"M3 8h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z\"/><path d=\"M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2\"/><path d=\"M3 13h18\"/>"}, "Обяви": {"slug": "obyavi", "className": "teal", "icon": "<path d=\"M3 11v2M7 9.5v5\"/><path d=\"M7 10l10-4v12l-10-4Z\"/><path d=\"M7 14l2.2 5\"/>"}, "Събития и град": {"slug": "sabitiya", "className": "blue", "icon": "<path d=\"M8 2v4M16 2v4\"/><rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M3 10h18M8 14h3M8 18h8\"/>"}};

const IVANOV_REMONTI = {
  id: "ivanov-remonti",
  type: "Фирма",
  title: "Ivanov-Remonti",
  name: "Ivanov-Remonti",
  category: "Майстори и ремонти",
  desc: "Строителни и ремонтни услуги в Лом.",
  description: "Строителни и ремонтни услуги в Лом.",
  phone: "",
  status: "promoted",
  promoted: true,
  url: "firma.html?id=ivanov-remonti"
};

const CONSTRUCTION_SEARCH_STEMS = [
  "строит", "ремонт", "майстор", "баня", "бани", "плоч", "фаянс",
  "теракот", "гранитогрес", "вик", "водопровод", "канализац",
  "електро", "електрик", "покрив", "дограма", "боядис", "боядж",
  "шпакл", "мазил", "гипсокартон", "изолац", "фасад", "зидар",
  "бетон", "къртен", "събар", "настил", "ламинат", "паркет",
  "замазк", "кофраж", "арматур", "тухл", "комин", "тенекедж",
  "цимент", "вар", "пясък", "лепило", "санитария", "фугиран"
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
  return query.length > 0 && CONSTRUCTION_SEARCH_STEMS.some(stem => query.includes(stem));
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
  return CATEGORY_META[category] || CATEGORY_META["Събития и град"];
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
        <small>${item.promoted ? "Промотиран профил" : escapeHtml(item.type)}</small>
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
      <article class="search-result-card ${item.promoted ? "promoted-search-result" : ""}">
        <span>${item.promoted ? "Промотиран профил" : escapeHtml(item.type)}</span>
        <h2><a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a></h2>
        <p>${escapeHtml(item.desc)}</p>
        ${item.promoted ? '<small class="promotion-note">Показва се с приоритет при търсене на строителни и ремонтни услуги.</small>' : ""}
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

// Регистрация и вход – само местен тест
const registerForm = qs("#register-form");
if (registerForm) {
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const users = getStored("popitaiUsers", []);
    const email = qs("#register-email").value.trim().toLowerCase();
    if (users.some(user => user.email === email)) {
      qs("#register-message").textContent = "Вече има профил с тази електронна поща.";
      return;
    }
    const user = {
      name: qs("#register-name").value.trim(),
      email,
      password: qs("#register-password").value
    };
    users.push(user);
    setStored("popitaiUsers", users);
    setStored("popitaiCurrentUser", { name: user.name, email: user.email });
    qs("#register-message").textContent = "Профилът е създаден в тестовия браузър.";
    setTimeout(() => window.location.href = "profil.html", 600);
  });
}

const loginForm = qs("#login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const users = getStored("popitaiUsers", []);
    const email = qs("#login-email").value.trim().toLowerCase();
    const password = qs("#login-password").value;
    const user = users.find(item => item.email === email && item.password === password);
    if (!user) {
      qs("#login-message").textContent = "Невалидна електронна поща или парола.";
      return;
    }
    setStored("popitaiCurrentUser", { name: user.name, email: user.email });
    qs("#login-message").textContent = "Успешен вход.";
    setTimeout(() => window.location.href = "profil.html", 500);
  });
}

const currentUser = getStored("popitaiCurrentUser", null);
if (qs("#profile-name") && currentUser) {
  qs("#profile-name").textContent = currentUser.name;
  qs("#profile-email").textContent = currentUser.email;
  qs("#profile-avatar").textContent = currentUser.name.charAt(0).toUpperCase();
}

const logoutButton = qs("#logout-button");
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("popitaiCurrentUser");
    window.location.reload();
  });
}

// Публикуване на въпрос
const newQuestionForm = qs("#new-question-form");
if (newQuestionForm) {
  const categoryFromUrl = new URLSearchParams(window.location.search).get("category");
  const categoryFromSlug = Object.entries(CATEGORY_META).find(([, meta]) => meta.slug === categoryFromUrl);
  if (categoryFromSlug && qs("#question-category")) qs("#question-category").value = categoryFromSlug[0];

  newQuestionForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = newQuestionForm.querySelector('[type="submit"]');
    submitButton.disabled = true;
    qs("#new-question-message").textContent = "Подготовяне на публикацията…";

    try {
      const storedQuestions = getQuestions();
      const user = getStored("popitaiCurrentUser", { name: "Гост" });
      const id = `q-${Date.now()}`;
      const images = window.PopitaiImages
        ? await window.PopitaiImages.commit("question-image-uploader", "question", id)
        : [];

      storedQuestions.unshift({
        id,
        title: qs("#question-title").value.trim(),
        category: qs("#question-category").value,
        description: qs("#question-description").value.trim(),
        author: user.name,
        createdAt: new Date().toISOString(),
        answers: [],
        helpful: 0,
        isTest: false,
        images
      });
      saveQuestions(storedQuestions);
      qs("#new-question-message").textContent = "Въпросът и снимките са публикувани в тестовата версия.";
      setTimeout(() => window.location.href = questionUrl(id), 500);
    } catch (error) {
      qs("#new-question-message").textContent = error instanceof Error
        ? error.message
        : "Публикуването не успя.";
      submitButton.disabled = false;
    }
  });
}

function questionCard(item, compact = false) {
  const answers = Array.isArray(item.answers) ? item.answers.length : 0;
  const testBadge = item.isTest ? '<span class="test-badge">ТЕСТ</span>' : "";
  const media = cardMediaSlot(item, compact ? "compact-card-media" : "question-list-media");
  if (compact) {
    return `
      <article class="compact-card dynamic-question-card" data-question-id="${escapeHtml(item.id)}">
        ${media}
        <div class="question-card-category-row">
          ${categoryIcon(item.category, "category-symbol-small")}
          <span class="question-category">${escapeHtml(item.category)}</span>
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
          <span class="question-category">${escapeHtml(item.category)}</span>
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
if (profileQuestions) {
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

  const meta = categoryMeta(question.category);
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
  qs("#question-hero-category").innerHTML = `${categoryIcon(question.category)}<span>${escapeHtml(question.category)}</span>${question.isTest ? '<span class="test-badge">ТЕСТ</span>' : ""}`;
  const categoryLink = qs("#question-category-link");
  categoryLink.href = `${meta.slug}.html`;
  categoryLink.textContent = question.category;

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
      const user = getStored("popitaiCurrentUser", { name: "Гост" });
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
      qs("#answer-message").textContent = "Отговорът е добавен към правилния въпрос.";
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
  return `
    <article class="business-list-card" data-business-id="${escapeHtml(item.id)}">
      ${media || `<div class="firm-logo">${escapeHtml(initials || "Ф")}</div>`}
      <div class="business-main">
        <div class="firm-title-row">
          <h2><a href="${businessUrl(item.id)}">${escapeHtml(item.name)}</a></h2>
          <span class="pending-badge ${item.promoted ? "promoted-badge" : ""}">${item.promoted ? "ПРОМОТИРАН" : (item.isTest ? "ТЕСТ" : "Чака преглед")}</span>
        </div>
        <span class="question-category">${escapeHtml(item.category)}</span>
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
      qs("#company-message").textContent = "Фирмата и снимките са записани със статус „Чака преглед“.";
      setTimeout(() => window.location.href = businessUrl(id), 500);
    } catch (error) {
      qs("#company-message").textContent = error instanceof Error
        ? error.message
        : "Профилът не можа да бъде записан.";
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
  qs("#business-detail-category").textContent = item.category;
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
    if (message) message.textContent = "Формулярът работи в местната тестова версия.";
    form.reset();
  });
});
