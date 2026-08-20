(()=>{"use strict";

const data=[
/* Хранителни */
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

/* Строителни */
{cat:"construction",name:"Строймаркет Орбита",kind:"Строителни материали и железария",address:"ул. „Славянска“ 67, Лом",phone:"",hours:"",tags:["Строителни материали","Железария"],groups:["materials","metal"]},
{cat:"construction",name:"Строймаркет Орбита",kind:"Строителни материали и санитария",address:"ул. „Крум Пастърмаджиев“ 7, Лом",phone:"",hours:"",tags:["Строителни материали","Санитария"],groups:["materials","bath"]},
{cat:"construction",name:"ЕТ „Таня Иванова“",kind:"Строителни материали, железария, ВиК и обзавеждане",address:"ул. „Цар Симеон“ 110, Лом",phone:"0886 552 618",hours:"",tags:["Железария","ВиК","Бои","Плочки","Ламинат","Санитария"],groups:["materials","metal","paint","bath"]},
{cat:"construction",name:"Colors / Колорс Георгиеви",kind:"Бои, латекси и декоративни покрития",address:"ул. „Славянска“ 58, Лом",phone:"0887 479 108",hours:"",tags:["Латекс","Бои","Декоративни покрития","Автобои"],groups:["paint"]},
{cat:"construction",name:"Дартон / Магазин за бани",kind:"Бани, санитария и обзавеждане",address:"ул. „Славянска“ 126, Лом",phone:"0895 793 130",hours:"",tags:["Санитария","Бани","Смесители"],groups:["bath","materials"]},
{cat:"construction",name:"Борислав Борисов – ББ",kind:"Метали, метални изделия, железария и строителни материали",address:"ул. „Крали Марко“ 4, Лом",phone:"0971 66 862",hours:"",tags:["Метали","Метални изделия","Железария","Строителни материали"],groups:["metal","materials"]},
{cat:"construction",name:"Дрийм Колорс",kind:"Бои, мазилки и материали за довършителни работи",address:"ул. „Георги Манафски“ 19, Лом",phone:"",hours:"",tags:["Бои","Мазилки","Довършителни материали"],groups:["paint","materials"]},
{cat:"construction",name:"Дилеро",kind:"Строителен магазин",address:"ул. „Цар Симеон“ 38, Лом",phone:"",hours:"",tags:["Строителни материали"],groups:["materials"]},

/* Техника */
{cat:"tech",name:"TechnoArena Лом",kind:"Техника и електроника",address:"ул. „Хан Аспарух“ 6, Лом",phone:"0877 073 777",hours:"Пн–Пт 09:00–18:00",tags:["Техника","Електроника"]},
{cat:"tech",name:"ОТП ФОРУМ ЛОМ / ФОРУМ АУТЛЕТ",kind:"Техника и електроника",address:"ул. „Славянска“ 64, Лом",phone:"0971 65 151",hours:"Пн–Пт 09:30–18:30 · Сб–Нед почивни дни",tags:["Техника","Електроника","За дома"]},
{cat:"tech",name:"Джиесемите / П енд М Трейдинг",kind:"Телефони и електроника",address:"ул. „Борил“ 2, Лом",phone:"0879 966 677",hours:"",tags:["Телефони","Аксесоари","Електроника"]},
{cat:"tech",name:"МИКРОТЕХ – Росен Георгиев",kind:"Черна и бяла техника",address:"ул. „Пристанищна“ 2, Лом",phone:"0971 66 893",hours:"",tags:["Бяла техника","Черна техника","Сервиз"]},

/* Мебели */
{cat:"furniture",name:"Мебелна къща Мура – Славянска",kind:"Мебели и обзавеждане",address:"ул. „Славянска“ 66, Лом",phone:"0888 729 620",hours:"Пн–Пт 09:00–18:00 · Сб 09:00–13:00",tags:["Мебели","Обзавеждане"]},
{cat:"furniture",name:"Мебелна къща Мура – Хан Аспарух",kind:"Мебели и обзавеждане",address:"ул. „Хан Аспарух“ 6, Лом",phone:"0885 714 677",hours:"",tags:["Мебели","Обзавеждане"]},
{cat:"furniture",name:"Майстора и Маргарита – Лом",kind:"Мебели и обзавеждане",address:"ул. „Людовико Миланези“ 9, промишлена зона, Лом",phone:"0898 610 841",hours:"",tags:["Мебели","Обзавеждане"]},

/* Дрехи */
{cat:"clothes",name:"Pepco Лом",kind:"Дрехи и стоки за дома",address:"ул. „Пристанищна“ 41, Лом",phone:"",hours:"",tags:["Дрехи","Дом","Деца"]},
{cat:"clothes",name:"FLAIR Lom",kind:"Дрехи и обувки",address:"ул. „Славянска“ 8, Лом",phone:"0877 714 959",hours:"Пн–Пт 09:00–19:00 · Сб 09:00–15:00",tags:["Дрехи","Обувки"]},
{cat:"clothes",name:"Магазин за дрехи „Веси“",kind:"Дрехи",address:"ул. „Славянска“ 13, Лом",phone:"0876 800 039",hours:"",tags:["Дрехи"]},
{cat:"clothes",name:"Блян",kind:"Парфюмерия и бельо",address:"ул. „Славянска“ 44, Лом",phone:"",hours:"",tags:["Парфюмерия","Козметика","Бельо"]},

/* Дом и специализирани */
{cat:"home",name:"WangFa Mall",kind:"Домашни и разнообразни стоки",address:"ул. „Хаджи Димитър“ 24, Лом",phone:"0896 881 788",hours:"",tags:["Домашни потреби","Разнообразни стоки"]},
{cat:"home",name:"Океан от любов",kind:"Цветя, подаръци, козметика и сувенири",address:"ул. „Хан Аспарух“ 11, Лом",phone:"0889 032 734",hours:"",tags:["Цветя","Подаръци","Сувенири","Козметика"]},
{cat:"home",name:"STOP&SHOP",kind:"Магазин с разнообразни стоки",address:"Център, Лом",phone:"",hours:"",tags:["Разнообразни стоки"]},
{cat:"home",name:"ЕТ Колос",kind:"Градинска техника и машини",address:"ул. „Людовико Миланези“ 15, Лом",phone:"0888 351 135",hours:"",tags:["Градинска техника","Машини","Инструменти"]},
{cat:"home",name:"Агро Център",kind:"Стоки за градина и земеделие",address:"Младеново, Лом",phone:"",hours:"",tags:["Градина","Земеделие"]},
{cat:"home",name:"Фуражи и храни за любимци",kind:"Специализиран магазин",address:"ул. „Славянска“ 158, Лом",phone:"",hours:"",tags:["Фуражи","Храни за любимци","Животни"]}
];

const root=document.getElementById("shops-catalog-root");
const search=document.getElementById("search");
const count=document.getElementById("count");
const tabs=[...document.querySelectorAll(".tab")];
const subs=document.getElementById("subs");
const subBtns=[...document.querySelectorAll(".sub")];
const pk=document.getElementById("pk"),pt=document.getElementById("pt"),pc=document.getElementById("pc"),addBtn=document.getElementById("addBtn");
const STORAGE_KEY="popitai_magazini_cat";
const allowedCats=["food","construction","tech","furniture","clothes","home"];
const savedCat=localStorage.getItem(STORAGE_KEY);
let cat=allowedCats.includes(savedCat)?savedCat:"food",sub="all";

if(addBtn) addBtn.hidden=true;

const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=s=>String(s||"").toLocaleLowerCase("bg-BG").trim();

const meta={
food:["Хранителни","Хранителни магазини в Лом","Супермаркети и местни хранителни магазини."],
construction:["Строителни","Строителни магазини в Лом","Материали, железария, метали, бои, санитария и обзавеждане за ремонт."],
tech:["Техника","Магазини за техника в Лом","Електроника, телефони, бяла и черна техника."],
furniture:["Мебели","Магазини за мебели в Лом","Мебели и обзавеждане за дома."],
clothes:["Дрехи","Магазини за дрехи в Лом","Облекло, обувки и модни стоки."],
home:["Дом","Магазини за дома и специализирани магазини в Лом","Домашни потреби, подаръци, градина и други практични местни магазини."]
};

function list(){
  const q=norm(search.value);
  return data.filter(s =>
    s.cat===cat &&
    (cat!=="construction" || sub==="all" || (s.groups||[]).includes(sub)) &&
    (!q || norm([s.name,s.kind,s.address,s.phone,s.hours,...(s.tags||[])].join(" ")).includes(q))
  );
}

function render(){
  const m=meta[cat];
  pk.textContent=m[0]; pt.textContent=m[1]; pc.textContent=m[2];
  document.getElementById("shops-panel")?.setAttribute("aria-labelledby",`tab-${cat}`);
  subs.hidden=cat!=="construction";
  const r=list();
  count.textContent=r.length?`${r.length} обекта`:"";

  if(!r.length){
    root.innerHTML='<div class="empty"><strong>Няма резултат.</strong><br>Промени търсенето или филтъра.</div>';
    return;
  }

  root.innerHTML=r.map(s=>`
    <article class="card">
      <div class="card-top"><h3>${esc(s.name)}</h3></div>
      <p class="kind">${esc(s.kind)}</p>
      <div class="meta">
        ${s.address?`<div>📍 ${esc(s.address)}</div>`:""}
        ${s.phone?`<div>☎ ${esc(s.phone)}</div>`:""}
        ${s.hours?`<div>🕒 ${esc(s.hours)}</div>`:""}
      </div>
      <div class="tags">${(s.tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join("")}</div>
      <div class="actions">
        ${s.phone?`<a class="act primary" href="tel:${esc(s.phone.replace(/[^\d+]/g,""))}">Обади се</a>`:""}
      </div>
    </article>
  `).join("");
}

tabs.forEach(b=>{
  if(!b.hasAttribute("aria-selected")) b.setAttribute("aria-selected","false");
  b.addEventListener("click",()=>{
    cat=b.dataset.cat; sub="all";
    localStorage.setItem(STORAGE_KEY,cat);
    tabs.forEach(x=>x.setAttribute("aria-selected",x===b?"true":"false"));
    subBtns.forEach(x=>x.setAttribute("aria-selected",x.dataset.sub==="all"?"true":"false"));
    search.value="";
    render();
    requestAnimationFrame(()=>b.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"}));
  });
});

subBtns.forEach(b=>b.addEventListener("click",()=>{
  sub=b.dataset.sub;
  subBtns.forEach(x=>x.setAttribute("aria-selected",x===b?"true":"false"));
  render();
}));

search.addEventListener("input",render);

tabs.forEach(x=>x.setAttribute("aria-selected",x.dataset.cat===cat?"true":"false"));
const activeTab=tabs.find(x=>x.dataset.cat===cat);
requestAnimationFrame(()=>activeTab?.scrollIntoView({block:"nearest",inline:"center"}));
render();
})();