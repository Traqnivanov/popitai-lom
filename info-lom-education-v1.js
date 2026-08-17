(() => {
"use strict";

/*
  SINGLE OWNER
  Този файл е единственият renderer на [data-info-education-root].
  Не се зареждат info-lom.js и info-lom-canonical.js на тази локална версия.
*/

const DATA = {
  schools: [
    {name:'Първо основно училище „Никола Първанов“ – Лом', address:'ул. „Филип Тотю“ №14, Лом', phones:['0971 66 545','0879 357 032','0894 472 689'], email:'info-1203512@edu.mon.bg', director:'Христина Христова', url:'https://ounikolapurvanov-lom.com/'},
    {name:'Второ ОУ „Константин Фотинов“ – Лом', address:'ул. „Хаджи Димитър“ №28, Лом', phones:['0971 79 425'], email:'info-1209002@edu.mon.bg', director:'Ани Филинова', url:'https://ou-fotinov.org/'},
    {name:'IV ОУ „Христо Ботев“ – Лом', address:'кв. Младеново, ул. „Софийска“ №56, Лом', phones:['0971 66 548','0878 722 921'], email:'info-1209004@edu.mon.bg', director:'Дафинка Борисова', url:'https://oubotev.eu/'},
    {name:'СУ „Отец Паисий“ – Лом', address:'ул. „Даме Груев“ №1, Лом', phones:['0971 66 547','0888 826 734'], email:'info-1209003@edu.mon.bg', director:'Виктория Владимирова', url:'https://www.souop-lom.com/'},
    {name:'СУ „Димитър Маринов“ – Лом', address:'ул. „Дунавска“ №67, Лом', phones:['0894 472 694'], email:'info-1209005@edu.mon.bg', extraEmail:'info@sudm-lom.bg', director:'Десислава Александрова', url:'https://sudm-lom.bg/', badge:'НОВО'},
    {name:'Профилирана гимназия „Найден Геров“ – Лом', address:'ул. „Дунавска“ №67, Лом', phones:['0971 79 866','0888 652 998'], email:'info-1209006@edu.mon.bg', url:'https://gymnasium-lom.com/', note:'Данните за директора са в повторна проверка и затова не се показват.'},
    {name:'Професионална гимназия по производствени технологии – Лом', address:'ул. „Генерал Владимир Заимов“ №8, Лом', phones:['0971 60 350','0971 60 351','0888 984 896'], email:'pgpt@pgptlom.com', director:'инж. Илина Кръстева', url:'https://pgptlom.com/'},
    {name:'Професионална гимназия по хранене и земеделие „Дмитрий Иванович Менделеев“ – Лом', address:'ул. „Славянска“ №148, Лом', phones:['0878 849 450'], email:'info-1202036@edu.mon.bg', director:'Захари Замфиров'}
  ],
  kindergartens: [
    {name:'ДГ №1 „Снежанка“', address:'ул. „Дунавска“ №69, Лом', phones:['0893 697 127'], email:'info-1201325@edu.mon.bg', director:'Зорница Любенова'},
    {name:'ДГ №2 „Червената шапчица“', address:'ул. „Бозвели“ №30, Лом', phones:['0893 697 128'], director:'Зоя Златанова', note:'Телефонът е актуализиран по страницата на Община Лом.'},
    {name:'ДГ №3 „Звездица“', address:'ул. „Черковна“ №14, Лом', phones:['0893 697 129'], director:'Ваня Първанова', note:'Телефонът е актуализиран по страницата на Община Лом.'},
    {name:'ДГ №6 „Виктория Пишурка“', address:'ул. „Райко Даскалов“ №2, Лом', phones:['0893 697 131'], director:'Диана Петрова-Младенова'},
    {name:'ДГ №7 „Калинка“', address:'ул. „Филип Тотю“ №14А, Лом', phones:['0893 697 130'], director:'Евелинка Петрова', note:'Телефонът е актуализиран по страницата на Община Лом.'},
    {name:'ДГ №12 „Звънче“', address:'ул. „Славянска“ №69, Лом', phones:['0971 66 391','0899 111 029'], email:'info-1201332@edu.mon.bg', director:'Анжела Борисова-Атанасова', url:'https://zvanchelom.eu/', note:'Пазим потвърдените текущи контакти от Supabase; страницата на общината съдържа различен номер и остава за повторна проверка.'},
    {name:'ДГ №14 „Пчелица“', address:'ул. „Софийска“ №85, Лом', phones:['0893 697 135'], email:'info-1201335@edu.mon.bg', director:'Евелина Савеклиева', note:'Общината публикува сходен номер с различен код; показан е потвърденият текущ номер от базата до окончателен RECHECK.'}
  ],
  communityCenters: [
    {name:'НЧ „Постоянство-1856“ – Лом', address:'ул. „Славянска“ №1, Лом', phones:['0971 66 471','0971 66 472','0878 354 177'], email:'postoianstvo@mail.bg', url:'https://postoianstvo1856.com/', extra:'Библиотека, театър, фолклорни и вокални формации, школа по изкуства, литературна дейност.', historic:true, historicYear:'1856', historicTitle:'Едно от първите български читалища', historicText:'Културната му история започва с читалищната дейност на Кръстьо Пишурка в Лом още през 1848 г. Самото НЧ „Постоянство“ е основано през 1856 г. и е сред най-старите културни институции в България.'},
    {name:'НЧ „23 Септември 1960“ – Лом', address:'ул. „Хаджи Димитър“ №166, Лом', phones:['0893 612 061','0892 980 358'], email:'septemvri_ch@abv.bg', extra:'Библиотека, фолклорни танцови състави и културни прояви.'},
    {name:'НЧ „Виделина 1926“', address:'кв. Моминброд, ул. „Дружба“ №2, Лом', phones:['0877 479 996'], email:'majserafimova@abv.bg', note:'Наименованието остава отбелязано за проверка заради историческо разминаване в регистрите.'},
    {name:'НЧ „Събуждане-1899“', address:'кв. Младеново, ул. „Софийска“ №56, Лом', phones:['0892 097 073']}
  ],
  library: [
    {name:'Ломска читалищна библиотека', parent:'към НЧ „Постоянство 1856“ – Лом', address:'ул. „Славянска“ №1, Лом', phones:['0971 66 472'], email:'biblioteka_lom@abv.bg', url:'https://postoianstvo1856.com/biblioteka/', extra:'Общодостъпна библиотека и библиотечно-библиографски информационен център.', note:'Работно време не се показва, защото няма достатъчно актуално официално потвърждение.', badge:'НОВО'}
  ],
  museum: [
    {name:'Исторически музей – Лом', address:'ул. „Еремия Българов“ №6, Лом', phones:['0971 66 069'], email:'muzei_lom@abv.bg', hours:'Пон.–Пет. 08:30–12:30 и 13:00–17:00 · Съб.–Нед. почивни дни', url:'https://muzei-lom.com/kontakti/', extra:'Исторически музей на град Лом с постоянни експозиции и културно-исторически фонд.', badge:'НОВО'}
  ],
  courses: [
    {name:'Детско-юношеска театрална школа', parent:'НЧ „Постоянство 1856“ – Лом', address:'ул. „Славянска“ №1, Лом', phones:['0971 66 471','0878 354 177'], email:'postoianstvo@mail.bg', url:'https://postoianstvo1856.com/sastavi/detsko-yunosheska-teatralna-shkola.html', extra:'Детско и младежко театрално обучение и сценична дейност.'},
    {name:'Школа по изкуства „Проф. Йордан Гаврилов“', parent:'НЧ „Постоянство 1856“ – Лом', address:'ул. „Славянска“ №1, Лом', phones:['0971 66 471','0878 354 177'], email:'postoianstvo@mail.bg', url:'https://postoianstvo1856.com/shkola-po-izkustva-prof-yordan-gavrilov/', extra:'Музикален и балетен отдел; класове по пиано и китара.'},
    {name:'Училища ЕВРОПА – Лом', address:'ул. „Славянска“ №7, ет. 2, Лом', phones:['0878 502 178','0896 69 55 77'], email:'euroschoollom@abv.bg', url:'https://europeschools.net/branch/lom/', extra:'Английски език за деца, ученици и възрастни; немски; руски; целогодишни и интензивни курсове.'}
  ]
};

const SECTIONS = [
  ['uchilishta','Училища',DATA.schools,'school'],
  ['detski-gradini','Детски градини',DATA.kindergartens,'kindergarten'],
  ['chitalishta','Читалища',DATA.communityCenters,'community'],
  ['biblioteka','Библиотека',DATA.library,'library'],
  ['muzei','Музей',DATA.museum,'museum'],
  ['shkoli-kursove','Школи / курсове',DATA.courses,'course']
];

const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tel = p => `tel:${String(p).replace(/[^\d+]/g,'')}`;

function icon(type){
  const map = {
    school:'🎓', kindergarten:'◉', community:'⌂', library:'▤', museum:'⌂', course:'✦'
  };
  return map[type] || '•';
}

function card(item,type){
  const phones = (item.phones||[]).map(p=>`<a class="edu-phone" href="${esc(tel(p))}">${esc(p)}</a>`).join('');
  return `<article class="edu-card edu-card--${esc(type)}${item.historic?' edu-card--historic':''}">
    <div class="edu-card-top">
      <span class="edu-icon" aria-hidden="true">${icon(type)}</span>
      <div class="edu-title-wrap">
        <div class="edu-kicker">${esc(type==='kindergarten'?'ДЕТСКА ГРАДИНА':type==='community'?'ЧИТАЛИЩЕ':type==='library'?'БИБЛИОТЕКА':type==='museum'?'МУЗЕЙ':type==='course'?'ШКОЛА / КУРС':'УЧИЛИЩЕ')}</div>
        <h3>${esc(item.name)}</h3>
        ${item.parent?`<p class="edu-parent">${esc(item.parent)}</p>`:''}
      </div>
      ${item.badge?`<span class="edu-new">${esc(item.badge)}</span>`:''}
    </div>
    ${item.historic?`<div class="edu-historic">
      <div class="edu-historic-year">${esc(item.historicYear)}</div>
      <div class="edu-historic-copy">
        <strong>${esc(item.historicTitle)}</strong>
        <span>${esc(item.historicText)}</span>
      </div>
    </div>`:''}
    <div class="edu-meta">
      <div><span>📍</span><strong>${esc(item.address)}</strong></div>
      ${item.director?`<div><span>👤</span><span>Директор: ${esc(item.director)}</span></div>`:''}
      ${item.hours?`<div><span>🕒</span><span>${esc(item.hours)}</span></div>`:''}
      ${phones?`<div><span>☎</span><span class="edu-phone-list">${phones}</span></div>`:''}
      ${item.email?`<div><span>✉</span><a href="mailto:${esc(item.email)}">${esc(item.email)}</a></div>`:''}
      ${item.extraEmail?`<div><span>✉</span><a href="mailto:${esc(item.extraEmail)}">${esc(item.extraEmail)}</a></div>`:''}
    </div>
    ${item.extra?`<p class="edu-extra">${esc(item.extra)}</p>`:''}
    ${item.note?`<div class="edu-note">${esc(item.note)}</div>`:''}
    <div class="edu-actions">
      ${item.phones?.[0]?`<a class="edu-action edu-action--primary" href="${esc(tel(item.phones[0]))}"><span>Обади се</span><small>Директно</small></a>`:''}
      ${item.url?`<a class="edu-action" href="${esc(item.url)}" target="_blank" rel="noopener"><span>Официална страница</span><small>Директно ↗</small></a>`:''}
    </div>
  </article>`;
}

function render(){
  const root = document.querySelector('[data-info-education-root]');
  if(!root) return;
  root.innerHTML = SECTIONS.map(([id,title,items,type])=>`
    <section class="edu-section" id="obrazovanie-${esc(id)}">
      <div class="edu-section-head">
        <h2>${esc(title)}</h2>
        <span>${items.length} ${items.length===1?'запис':'записа'}</span>
      </div>
      <div class="edu-grid">${items.map(x=>card(x,type)).join('')}</div>
    </section>`).join('');
}

function modalSetup(){
  const modal=document.getElementById('education-modal');
  document.querySelector('[data-education-signal]')?.addEventListener('click',()=>{if(modal) modal.hidden=false;});
  document.querySelectorAll('[data-education-modal-close]').forEach(el=>el.addEventListener('click',()=>{if(modal) modal.hidden=true;}));
}

document.addEventListener('DOMContentLoaded',()=>{render();modalSetup();},{once:true});
})();