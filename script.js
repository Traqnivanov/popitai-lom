
const searchRecords = [{"type": "Категория", "title": "Майстори и ремонти", "desc": "Ремонти, ВиК, електро, покриви, дограма и други услуги за дома.", "url": "maistori.html"}, {"type": "Категория", "title": "Здраве и лекари", "desc": "Лекари, стоматолози, аптеки и здравни услуги в Лом.", "url": "zdrave.html"}, {"type": "Категория", "title": "Автомобили", "desc": "Сервизи, гуми, части, автомивки и пътна помощ.", "url": "avtomobili.html"}, {"type": "Категория", "title": "Магазини и покупки", "desc": "Местни магазини, материали, техника, мебели и ежедневни покупки.", "url": "magazini.html"}, {"type": "Категория", "title": "Заведения", "desc": "Ресторанти, кафенета, пицарии, сладкарници и доставки.", "url": "zavedenia.html"}, {"type": "Категория", "title": "Работа и услуги", "desc": "Обяви за работа и услуги, предлагани от местни хора.", "url": "rabota.html"}, {"type": "Категория", "title": "Обяви", "desc": "Купува, продава, подарява, наема и търси.", "url": "obyavi.html"}, {"type": "Категория", "title": "Събития и град", "desc": "Събития, институции, полезни телефони и градска информация.", "url": "sabitiya.html"}, {"type": "Въпрос", "title": "Кой препоръчва добър майстор за ремонт на баня?", "desc": "Търся човек за цялостен ремонт на малка баня в Лом.", "url": "vapros.html"}, {"type": "Въпрос", "title": "Кой зъболекар в Лом работи добре с деца?", "desc": "Търся внимателен специалист за първо посещение на дете.", "url": "vapros.html"}, {"type": "Въпрос", "title": "Къде правят качествена диагностика на автомобил?", "desc": "Търся сервиз с добра диагностика и коректно отношение.", "url": "vapros.html"}, {"type": "Въпрос", "title": "Има ли свободни места за продавач-консултант?", "desc": "Интересувам се от работа на пълен ден в Лом.", "url": "vapros.html"}, {"type": "Въпрос", "title": "Къде има добри строителни материали на нормални цени?", "desc": "Търся плочки, лепила и санитария.", "url": "vapros.html"}, {"type": "Въпрос", "title": "Кое заведение е подходящо за семеен празник?", "desc": "Търся спокойно място за около 15 души.", "url": "vapros.html"}, {"type": "Фирма", "title": "Иванов Ремонти", "desc": "Цялостни ремонти, бани, боядисване и довършителни работи.", "url": "firma.html"}, {"type": "Фирма", "title": "Автосервиз Север", "desc": "Диагностика, ходова част, масла и сезонно обслужване.", "url": "firma.html"}, {"type": "Фирма", "title": "Дентално студио Лом", "desc": "Профилактика, лечение и детска стоматология.", "url": "firma.html"}, {"type": "Фирма", "title": "Дом и Стил", "desc": "Материали за ремонт, инструменти и домашни потреби.", "url": "firma.html"}, {"type": "Статия", "title": "Как да избереш майстор и да избегнеш неприятни изненади", "desc": "Проверки, въпроси и ясни условия преди започване на ремонта.", "url": "statia.html"}, {"type": "Статия", "title": "Кои документи да поискаш при наемане на услуга", "desc": "Кратък списък, който помага да защитиш интереса си.", "url": "statia.html"}, {"type": "Статия", "title": "Как бързо да намериш работно време и телефон", "desc": "Практичен начин за проверка на местни услуги и институции.", "url": "statia.html"}];

const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[character]));
}

function getStored(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function setStored(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

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

if (menuButton) {
  menuButton.addEventListener("click", () => setMenu(!mainNav.classList.contains("open")));
}

if (backToTopButton) {
  backToTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

document.addEventListener("click", (event) => {
  if (mainNav && menuButton && !mainNav.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

// Главна търсачка
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

  const matches = searchRecords
    .filter(item => `${item.title} ${item.desc} ${item.type}`.toLocaleLowerCase("bg").includes(query))
    .slice(0, 6);

  suggestionsBox.innerHTML = matches.map(item => `
    <button class="suggestion-item" type="button" data-url="${escapeHtml(item.url)}" data-value="${escapeHtml(item.title)}">
      <span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.type)}</small></span>
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

// Страница с резултати
const resultsForm = qs("#results-search-form");
const resultsInput = qs("#results-search-input");
const resultsContainer = qs("#search-results");
const resultsCount = qs("#results-count");

function renderSearchResults(query) {
  if (!resultsContainer) return;
  const normalized = query.trim().toLocaleLowerCase("bg");
  const results = normalized
    ? searchRecords.filter(item => `${item.title} ${item.desc} ${item.type}`.toLocaleLowerCase("bg").includes(normalized))
    : searchRecords;

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

// Регистрация и вход
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
    qs("#register-message").textContent = "Профилът е създаден. Пренасочване...";
    setTimeout(() => window.location.href = "profil.html", 700);
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
if (qs("#profile-name")) {
  if (currentUser) {
    qs("#profile-name").textContent = currentUser.name;
    qs("#profile-email").textContent = currentUser.email;
    qs("#profile-avatar").textContent = currentUser.name.charAt(0).toUpperCase();
  }
}

const logoutButton = qs("#logout-button");
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("popitaiCurrentUser");
    window.location.reload();
  });
}

// Нов въпрос
const newQuestionForm = qs("#new-question-form");
if (newQuestionForm) {
  const categoryFromUrl = new URLSearchParams(window.location.search).get("category");
  if (categoryFromUrl) {
    const match = {"maistori": "Майстори и ремонти", "zdrave": "Здраве и лекари", "avtomobili": "Автомобили", "magazini": "Магазини и покупки", "zavedenia": "Заведения", "rabota": "Работа и услуги", "obyavi": "Обяви", "sabitiya": "Събития и град"}[categoryFromUrl];
    if (match) qs("#question-category").value = match;
  }

  newQuestionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const storedQuestions = getStored("popitaiQuestions", []);
    const user = getStored("popitaiCurrentUser", { name: "Гост" });
    storedQuestions.unshift({
      id: Date.now(),
      title: qs("#question-title").value.trim(),
      category: qs("#question-category").value,
      description: qs("#question-description").value.trim(),
      author: user.name,
      createdAt: new Date().toISOString()
    });
    setStored("popitaiQuestions", storedQuestions);
    qs("#new-question-message").textContent = "Въпросът е публикуван.";
    setTimeout(() => window.location.href = "vaprosi.html", 600);
  });
}

function renderStoredQuestions(containerSelector, admin = false) {
  const container = qs(containerSelector);
  if (!container) return;
  const storedQuestions = getStored("popitaiQuestions", []);
  if (!storedQuestions.length) return;

  container.innerHTML = storedQuestions.map(item => `
    <article class="${admin ? "list-card" : "list-card question-list-card"}" data-question-id="${item.id}">
      <div>
        <span class="question-category">${escapeHtml(item.category)}</span>
        <h2><a href="vapros.html">${escapeHtml(item.title)}</a></h2>
        <p>${escapeHtml(item.description)}</p>
        <small>Публикувано от ${escapeHtml(item.author)}</small>
      </div>
      ${admin ? '<button class="delete-question" type="button">Изтрий</button>' : '<div class="list-card-meta"><strong>0</strong><span>отговора</span></div>'}
    </article>
  `).join("");
}

renderStoredQuestions("#questions-list");
renderStoredQuestions("#profile-questions");
renderStoredQuestions("#admin-questions", true);

qsa(".delete-question").forEach(button => {
  button.addEventListener("click", () => {
    const card = button.closest("[data-question-id]");
    const id = Number(card.dataset.questionId);
    const remaining = getStored("popitaiQuestions", []).filter(item => item.id !== id);
    setStored("popitaiQuestions", remaining);
    card.remove();
    const count = qs("#admin-questions-count");
    if (count) count.textContent = remaining.length;
  });
});

// Административни броячи
if (qs("#admin-users-count")) qs("#admin-users-count").textContent = getStored("popitaiUsers", []).length;
if (qs("#admin-questions-count")) qs("#admin-questions-count").textContent = getStored("popitaiQuestions", []).length;

// Отговор и фирмен формуляр
const answerForm = qs("#answer-form");
if (answerForm) {
  answerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    qs("#answer-message").textContent = "Отговорът е добавен в местната версия.";
    qs("#answer-text").value = "";
  });
}

const companyForm = qs("#company-form");
if (companyForm) {
  companyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    qs("#company-message").textContent = "Фирмата е изпратена за преглед.";
    companyForm.reset();
  });
}

qsa(".simple-contact-form").forEach(form => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = qs(".form-message", form);
    if (message) message.textContent = "Съобщението е прието в местната версия.";
    form.reset();
  });
});
