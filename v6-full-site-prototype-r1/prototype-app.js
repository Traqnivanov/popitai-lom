"use strict";

const moreToggle = document.getElementById("more-toggle");
const moreMenu = document.getElementById("more-menu");
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const mobileDrawer = document.getElementById("mobile-drawer");
const prototypeToolsToggle = document.getElementById("prototype-tools-toggle");
const prototypeToolsPanel = document.getElementById("prototype-tools-panel");
const roleSwitcher = document.getElementById("role-switcher");
const dataStateSelect = document.getElementById("data-state");
const addOptions = document.getElementById("add-options");
const shareContent = document.getElementById("share-content");
const confirmContent = document.getElementById("confirm-content");
const modalLayers = [addLayer, shareLayer, confirmLayer].filter(Boolean);
let modalReturnFocus = null;

function renderNotFound(){
  main.innerHTML = pageIntro("Не е намерено", "Тази прототипна страница не съществува", "Върни се към началото или използвай основната навигация.", button("Към началото", "home", "button button-primary"));
}

function closeMenus(){
  if (moreMenu) moreMenu.hidden = true;
  if (moreToggle) moreToggle.setAttribute("aria-expanded", "false");
  if (mobileDrawer) mobileDrawer.hidden = true;
  if (mobileMenuToggle) mobileMenuToggle.setAttribute("aria-expanded", "false");
}

function closeAllModals({restoreFocus=true}={}){
  modalLayers.forEach(layer => { layer.hidden = true; });
  document.body.classList.remove("modal-open");
  if (restoreFocus && modalReturnFocus && document.contains(modalReturnFocus)) {
    try { modalReturnFocus.focus({preventScroll:true}); } catch { modalReturnFocus.focus(); }
  }
  modalReturnFocus = null;
}

function openModal(layer, trigger){
  if (!layer) return;
  closeAllModals({restoreFocus:false});
  modalReturnFocus = trigger || document.activeElement;
  layer.hidden = false;
  document.body.classList.add("modal-open");
  const first = layer.querySelector("button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])");
  setTimeout(() => first?.focus(), 0);
}

function contextualAddOptions(){
  const r = routeInfo();
  const isHealth = r.path === "health-proposal" || r.parts[0] === "health-provider" || (r.parts[0] === "marketplace" && r.parts[1] === "services" && r.params.get("group") === "health") || (r.parts[0] === "info" && r.parts[1] === "health");
  const isShops = r.parts[0] === "shops" || r.parts[0] === "shop" || r.parts[0] === "shop-proposal";
  const base = [
    ["Добави обява", "Продажба, търсене, работа, имот или услуга", "listing-form"],
    ["Добави фирма", "Постоянен профил на местна фирма или доставчик", "firm-form"],
    ["Задай въпрос", "Потърси съвет, опит или препоръка", "ask"]
  ];
  if (isHealth) base.unshift(["Добави специалист или практика", "Предложението се проверява преди да стане част от здравния справочник", "health-proposal"]);
  if (isHealth) base.splice(1, 0, ["Публикувай или потърси здравна услуга", "Временна обява за предлагане или търсене на услуга", "listing-form?main=services&group=health"]);
  if (isShops) base.unshift(["Предложи магазин", "Предложението чака проверка преди публично показване", "shop-proposal"]);
  return base;
}

function renderAddOptions(){
  if (!addOptions) return;
  addOptions.innerHTML = contextualAddOptions().map(([title, text, route]) => `
    <button class="action-option" type="button" data-route="${esc(route)}">
      <strong>${esc(title)}</strong><span>${esc(text)}</span>
    </button>`).join("");
}

function openAdd(trigger){
  renderAddOptions();
  openModal(addLayer, trigger);
}

function safePrototypeUrl(route){
  const base = location.href.split("#")[0];
  return `${base}#/${route}`;
}

function openShare(trigger){
  const route = trigger.dataset.share || "home";
  const title = trigger.dataset.shareTitle || "Попитай.Лом";
  const url = safePrototypeUrl(route);
  if (shareContent) shareContent.innerHTML = `
    <div class="notice notice-info"><strong>Преглед на споделянето</strong>В истинския сайт се споделя публичният адрес само след като съдържанието е одобрено и има публична страница.</div>
    <div class="detail-block mt-16"><h3>${esc(title)}</h3><p class="muted">${esc(url)}</p></div>
    <div class="form-actions mt-16"><button class="button button-primary" type="button" data-action="copy-share" data-copy="${esc(url)}">Копирай линк</button><button class="button button-soft" type="button" data-close-modal>Затвори</button></div>`;
  openModal(shareLayer, trigger);
}

async function copyText(value){
  try {
    if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(value);
    else {
      const ta = document.createElement("textarea");
      ta.value = value; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
    }
    toast("Линкът е копиран.");
  } catch { toast("Копирането не е достъпно в този преглед. Линкът остава видим."); }
}

function refreshRoleUI(){
  document.querySelectorAll("[data-role]").forEach(btn => btn.classList.toggle("active", btn.dataset.role === state.role));
  if (dataStateSelect) dataStateSelect.value = state.dataState;
  renderAddOptions();
}

function updateActiveNavigation(){
  const r = routeInfo();
  const top = ({marketplace:"marketplace",listing:"marketplace","listing-form":"marketplace",firms:"firms",firm:"firms","firm-form":"firms",restaurants:"firms",info:"info","info-detail":"info","info-proposal":"info","health-provider":"marketplace","health-proposal":"marketplace",articles:"articles",article:"articles",questions:"questions",question:"questions",ask:"questions",events:"events",event:"events",profile:"profile",auth:"profile"})[r.parts[0]] || (r.parts[0] === "home" ? "home" : "");
  document.querySelectorAll(".desktop-nav .route-link, .mobile-bottom-nav .route-link").forEach(btn => {
    const active = btn.dataset.route === top;
    btn.classList.toggle("active", active);
    if (active) btn.setAttribute("aria-current", "page"); else btn.removeAttribute("aria-current");
  });
}

function render(){
  const r = routeInfo();
  closeMenus();
  switch (r.parts[0]) {
    case "": case "home": renderHome(); break;
    case "marketplace": renderMarketplace(); break;
    case "listing": renderListingDetail(r.parts[1]); break;
    case "listing-form": renderListingForm(); break;
    case "health-provider": renderHealthProvider(r.parts[1]); break;
    case "health-proposal": renderHealthProposal(); break;
    case "firms": renderFirms(); break;
    case "firm": renderFirmDetail(r.parts[1]); break;
    case "firm-form": renderFirmForm(); break;
    case "restaurants": renderRestaurants(); break;
    case "shops": renderShops(); break;
    case "shop": renderShopDetail(r.parts[1]); break;
    case "shop-proposal": renderShopProposal(); break;
    case "events": renderEvents(); break;
    case "event": renderEventDetail(r.parts[1]); break;
    case "info": renderInfo(); break;
    case "info-detail": renderInfoDetail(r.parts[1]); break;
    case "info-proposal": renderInfoProposal(); break;
    case "correction": renderCorrection(); break;
    case "articles": renderArticles(); break;
    case "article": renderArticle(r.parts[1]); break;
    case "questions": renderQuestions(); break;
    case "question": renderQuestion(r.parts[1]); break;
    case "ask": renderAsk(); break;
    case "search": renderSearch(); break;
    case "profile": renderProfile(); break;
    case "auth": renderAuth(r.parts[1] || "login"); break;
    case "offer-request": renderOfferRequest(); break;
    case "report": renderReport(); break;
    case "admin": renderAdmin(); break;
    case "contact": renderContact(); break;
    case "about": case "rules": case "privacy": case "terms": case "cookies": renderStaticPage(r.parts[0]); break;
    default: renderNotFound();
  }
  bindFormUX();
  updateActiveNavigation();
  refreshRoleUI();
  document.title = `${main.querySelector("h1")?.textContent || "Попитай.Лом"} | R1 прототип`;
}

function applyFirmFilter(){
  const root = document.getElementById("firm-results"); if (!root) return;
  const q = (document.getElementById("firm-search")?.value || "").trim().toLocaleLowerCase("bg-BG");
  const active = document.querySelector("[data-firm-category].active")?.dataset.firmCategory || "all";
  const rows = D.firms.filter(f => (active === "all" || f.category === active) && (!q || [f.name,f.category,f.description,f.city].join(" ").toLocaleLowerCase("bg-BG").includes(q)));
  root.innerHTML = rows.length ? `<div class="result-list">${[...rows].sort((a,b)=>Number(b.admin)-Number(a.admin)).map(firmCard).join("")}</div>` : `<div class="empty-state"><h2>Няма фирми с този филтър</h2><p>Промени търсенето или категорията.</p></div>`;
}

function applyShopFilter(){
  const root = document.getElementById("shop-results"); if (!root) return;
  const q = (document.getElementById("shop-search")?.value || "").trim().toLocaleLowerCase("bg-BG");
  const active = document.querySelector("[data-shop-category].active")?.dataset.shopCategory || "Всички";
  const rows = D.shops.filter(s => (active === "Всички" || s.category === active) && (!q || [s.name,s.category,s.address,...s.tags].join(" ").toLocaleLowerCase("bg-BG").includes(q)));
  root.innerHTML = rows.length ? `<div class="result-list">${rows.map(shopCard).join("")}</div>` : `<div class="empty-state"><h2>Няма магазини с този филтър</h2><p>Промени търсенето или категорията.</p></div>`;
}

function applyQuestionFilter(){
  const root = document.getElementById("question-results"); if (!root) return;
  const q = (document.getElementById("question-search")?.value || "").trim().toLocaleLowerCase("bg-BG");
  const rows = D.questions.filter(x => !q || [x.title,x.description,x.category].join(" ").toLocaleLowerCase("bg-BG").includes(q));
  root.innerHTML = rows.length ? rows.map(questionCard).join("") : `<div class="empty-state"><h2>Няма подобен въпрос</h2><p>Можеш да зададеш нов въпрос към общността.</p><button class="button button-primary" data-route="ask?q=${encodeURIComponent(q)}">Задай въпрос</button></div>`;
}

function applyInfoFilter(){
  const input = document.getElementById("info-search"); if (!input) return;
  const list = input.closest(".shell")?.querySelector(".result-list"); if (!list) return;
  const q = input.value.trim().toLocaleLowerCase("bg-BG");
  const family = routeInfo().parts[1];
  const rows = D.infoRecords.filter(x => x.family === family && (!q || [x.title,x.description,x.type,x.address].join(" ").toLocaleLowerCase("bg-BG").includes(q)));
  list.innerHTML = rows.length ? rows.map(infoRecordCard).join("") : `<div class="empty-state"><h2>Няма съвпадение</h2><p>Промени търсенето.</p></div>`;
}

document.addEventListener("click", e => {
  const routeEl = e.target.closest("[data-route]");
  if (routeEl) { e.preventDefault(); navigate(routeEl.dataset.route); return; }

  const close = e.target.closest("[data-close-modal]");
  if (close) { closeAllModals(); return; }

  const add = e.target.closest(".add-trigger");
  if (add) { openAdd(add); return; }

  const share = e.target.closest("[data-share]");
  if (share) { openShare(share); return; }

  const filter = e.target.closest("[data-filter-route]");
  if (filter) {
    const base = filter.dataset.filterRoute;
    const mode = filter.dataset.filter;
    if (mode === "all") navigate(base);
    else navigate(`${base}${base.includes("?") ? "&" : "?"}show=${encodeURIComponent(mode)}`);
    return;
  }

  const role = e.target.closest("[data-role]");
  if (role && roleSwitcher?.contains(role)) { state.role = role.dataset.role; saveState(); render(); return; }

  const ptab = e.target.closest("[data-profile-tab]");
  if (ptab) { state.profileTab = ptab.dataset.profileTab; saveState(); renderProfile(); refreshRoleUI(); return; }

  const atab = e.target.closest("[data-admin-tab]");
  if (atab) { state.adminTab = atab.dataset.adminTab; saveState(); renderAdmin(); refreshRoleUI(); return; }

  const fcat = e.target.closest("[data-firm-category]");
  if (fcat) { document.querySelectorAll("[data-firm-category]").forEach(x=>x.classList.toggle("active",x===fcat)); applyFirmFilter(); return; }

  const scat = e.target.closest("[data-shop-category]");
  if (scat) { document.querySelectorAll("[data-shop-category]").forEach(x=>x.classList.toggle("active",x===scat)); applyShopFilter(); return; }

  const action = e.target.closest("[data-action]");
  if (!action) return;
  switch (action.dataset.action) {
    case "retry": state.dataState = "loaded"; saveState(); render(); break;
    case "call": toast(`Симулация: обаждане до ${action.dataset.phone || "публичния номер"}.`); break;
    case "website": toast("Симулация: отваряне на публичния сайт на фирмата."); break;
    case "copy-share": copyText(action.dataset.copy || ""); break;
    case "logout": state.role = "guest"; saveState(); renderProfile(); refreshRoleUI(); break;
    case "profile-edit": toast("В реалния поток бутонът отваря правилния екран за редакция. Прототипът не променя статуса."); break;
    case "review-open": toast("Симулация: отворен е прегледът на записа без промяна на данните."); break;
    case "review-approve": toast("Симулация: Одобрено. Няма реален запис в базата."); break;
    case "review-return": toast("Симулация: Върнато за корекция. Няма реален запис в базата."); break;
    case "review-hide": toast("Симулация: Скрито/отказано чрез обратимо модераторско действие."); break;
    case "admin-hard-delete": if (isAdmin()) toast("Окончателното изтриване е действие само за администратор и е изключено в прототипа."); else toast("Окончателното изтриване е само за администратор."); break;
    case "admin-manage-roles": case "admin-expanded": case "admin-system": toast("Администраторска функция — без реална промяна в прототипа."); break;
  }
});

document.addEventListener("submit", e => {
  const form = e.target.closest("form[data-form]");
  if (!form) return;
  e.preventDefault();
  submitForm(form);
});

document.addEventListener("input", e => {
  if (e.target.id === "firm-search") applyFirmFilter();
  if (e.target.id === "shop-search") applyShopFilter();
  if (e.target.id === "question-search") applyQuestionFilter();
  if (e.target.id === "info-search") applyInfoFilter();
});

moreToggle?.addEventListener("click", () => {
  const open = moreMenu.hidden;
  moreMenu.hidden = !open;
  moreToggle.setAttribute("aria-expanded", String(open));
});

mobileMenuToggle?.addEventListener("click", () => {
  const open = mobileDrawer.hidden;
  mobileDrawer.hidden = !open;
  mobileMenuToggle.setAttribute("aria-expanded", String(open));
});

prototypeToolsToggle?.addEventListener("click", () => {
  const open = prototypeToolsPanel.hidden;
  prototypeToolsPanel.hidden = !open;
  prototypeToolsToggle.setAttribute("aria-expanded", String(open));
});

dataStateSelect?.addEventListener("change", () => {
  state.dataState = dataStateSelect.value;
  saveState();
  render();
});

document.getElementById("reset-prototype")?.addEventListener("click", () => {
  localStorage.removeItem(STORAGE);
  Object.assign(state, {role:"guest", dataState:"loaded", profileTab:"summary", adminTab:"dashboard", submissions:[], dirty:false, lastFocus:null});
  render();
  toast("Прототипът е нулиран.");
});

modalLayers.forEach(layer => layer.addEventListener("mousedown", e => { if (e.target === layer) closeAllModals(); }));

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    if (modalLayers.some(x => !x.hidden)) { closeAllModals(); return; }
    if (!mobileDrawer?.hidden || !moreMenu?.hidden) { closeMenus(); return; }
  }
  if (e.key === "Tab") {
    const layer = modalLayers.find(x => !x.hidden);
    if (!layer) return;
    const focusable = [...layer.querySelectorAll("button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])")].filter(x => x.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length-1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

window.addEventListener("hashchange", () => { closeAllModals({restoreFocus:false}); render(); });
window.addEventListener("beforeunload", e => { if (state.dirty) { e.preventDefault(); e.returnValue = ""; } });

if (!location.hash) history.replaceState(null, "", "#/home");
render();
