window.POPITAI_PROTO_DATA = {
  marketplace: [
    {key:"services",icon:"⌁",title:"Услуги",text:"Майстори, здраве, домашни, технически и професионални услуги."},
    {key:"vehicles",icon:"▱",title:"Автомобили",text:"Автомобили, части, сервизи, гуми, диагностика и пътна помощ."},
    {key:"work",icon:"▣",title:"Работа",text:"Предлагат работа и хора, които търсят работа в Лом и района."},
    {key:"property",icon:"⌂",title:"Имоти",text:"Продажби, наеми и търсене на имоти."},
    {key:"trade",icon:"⇄",title:"Купува и продава",text:"Стоки от електроника до дом, деца, мода, хоби и животни."}
  ],
  serviceGroups: [
    {key:"masters",icon:"◇",title:"Майстори и ремонти",text:"Ремонти, ВиК, електро, покриви и още.",leaves:["Цялостни ремонти","Бани и плочки","ВиК","Електро","Покриви","Боядисване","Дограма","Климатици"]},
    {key:"health",icon:"＋",title:"Здраве и грижа",text:"Проверени специалисти и отделно здравни услуги.",leaves:["Домашни здравни грижи","Медицинска сестра и манипулации","Рехабилитация и кинезитерапия","Физиотерапия","Психологическо консултиране","Логопед и специализирани терапии","Диетолог и хранителни консултации","Терапевтичен масаж и възстановяване","Грижа за възрастни и болни","Придружаване и помощ при лечение","Друга здравна услуга"]},
    {key:"home",icon:"⌂",title:"Домашни услуги",text:"Помощ за дома и ежедневната грижа.",leaves:["Домашна помощ","Грижа за деца, възрастни и домашни любимци"]},
    {key:"beauty",icon:"✦",title:"Красота и лична грижа",text:"Фризьори, козметични и лични услуги.",leaves:["Красота и лична грижа"]},
    {key:"tech",icon:"⌘",title:"Компютърни и технически услуги",text:"Компютри, телефони, настройки и техническа помощ.",leaves:["Компютърни и технически услуги"]},
    {key:"professional",icon:"▧",title:"Професионални услуги",text:"Професионална помощ, фото и видео.",leaves:["Професионални услуги","Фото и видео услуги"]},
    {key:"education",icon:"▤",title:"Обучение и уроци",text:"Частни уроци, подготовка и обучение.",leaves:["Обучение и уроци"]},
    {key:"transport",icon:"→",title:"Транспорт и доставки",text:"Превоз, преместване, доставки и логистика.",leaves:["Транспорт и доставки"]}
  ],
  autoLeaves:["Автомобили за продажба или търсене","Авточасти","Автосервизи","Диагностика","Гуми","Автомивки","Пътна помощ"],
  tradeLeaves:["Електроника","Дом и градина","Дрехи и обувки","Деца и бебета","Спорт и хоби","Животни","Друго"],
  infoFamilies:[
    {key:"health",icon:"＋",title:"Здраве",text:"Лекари, стоматолози, аптеки и здравна информация."},
    {key:"institutions",icon:"▦",title:"Институции",text:"Община, държавни и местни институции."},
    {key:"transport",icon:"→",title:"Транспорт",text:"Автогара, ЖП гара, таксита и полезни контакти."},
    {key:"education",icon:"▤",title:"Образование и култура",text:"Училища, детски градини, читалища и култура."},
    {key:"banks",icon:"€",title:"Банки и банкомати",text:"Банки, банкомати и платежни услуги."},
    {key:"utilities",icon:"⌁",title:"Комунални и ежедневни услуги",text:"Ток, вода, интернет, куриери и други ежедневни услуги."}
  ],
  listings:[
    {id:"l1",title:"Иванов Ремонти — цялостни ремонти",category:"Услуги",subcategory:"Цялостни ремонти",main:"services",group:"masters",type:"Предлага",price:"По оферта",city:"Лом",owner:"Иванов Ремонти",ownerType:"firm",admin:true,boosted:true,status:"approved",description:"Цялостни вътрешни ремонти, бани, шпакловка, боядисване и довършителни дейности.",phone:"0876 000 000",photos:6},
    {id:"l2",title:"Търся майстор за ремонт на покрив",category:"Услуги",subcategory:"Покриви",main:"services",group:"masters",type:"Търси",price:"Договаряне",city:"Лом",owner:"Потребител",status:"approved",description:"Търся оглед и оферта за частичен ремонт на покрив на къща.",phone:"0877 123 456",photos:2},
    {id:"l3",title:"Предлагам транспорт и преместване",category:"Услуги",subcategory:"Транспорт, преместване и доставки",main:"services",group:"transport",type:"Предлага",price:"От 30 €",city:"Лом и района",owner:"Потребител",status:"approved",description:"Транспорт на мебели и малки товари в Лом и област Монтана.",phone:"0888 234 567",photos:3},
    {id:"l4",title:"Volkswagen Golf 7, 2016",category:"Автомобили и МПС",subcategory:"",main:"vehicles",group:"vehicles",type:"Продава",price:"7 900 €",city:"Лом",owner:"Потребител",status:"approved",description:"Поддържан автомобил, валидни документи и обслужване.",phone:"0899 345 678",photos:6},
    {id:"l5",title:"Автодиагностика на място",category:"Услуги",subcategory:"Диагностика",main:"vehicles",group:"vehicles",type:"Предлага",price:"25 €",city:"Лом",owner:"Авто Сервиз Лом",ownerType:"firm",status:"approved",description:"Компютърна диагностика за леки автомобили.",phone:"0878 456 789",photos:2},
    {id:"l6",title:"Търсим продавач-консултант",category:"Работа",subcategory:"",main:"work",group:"work",type:"Предлага работа",price:"По договаряне",city:"Лом",owner:"Местен магазин",ownerType:"firm",status:"approved",description:"Пълен работен ден. Опитът е предимство, но не е задължителен.",phone:"0879 567 890",photos:1},
    {id:"l7",title:"Търся работа като шофьор",category:"Работа",subcategory:"",main:"work",group:"work",type:"Търси работа",price:"",city:"Лом",owner:"Потребител",status:"approved",description:"Имам категория B и C, търся постоянна работа в Лом или района.",phone:"0880 678 901",photos:0},
    {id:"l8",title:"Двустаен апартамент под наем",category:"Имоти",subcategory:"",main:"property",group:"property",type:"Отдава под наем",price:"250 € / месец",city:"Лом",owner:"Потребител",status:"approved",description:"Обзаведен двустаен апартамент близо до центъра.",phone:"0881 789 012",photos:6},
    {id:"l9",title:"Търся къща за купуване",category:"Имоти",subcategory:"",main:"property",group:"property",type:"Търси за купуване",price:"До 45 000 €",city:"Лом",owner:"Потребител",status:"approved",description:"Търся къща с двор в Лом, възможен е ремонт.",phone:"0882 890 123",photos:0},
    {id:"l10",title:"Продавам лаптоп Lenovo",category:"Електроника",subcategory:"",main:"trade",group:"trade",type:"Продава",price:"280 €",city:"Лом",owner:"Потребител",status:"approved",description:"Лаптоп в добро състояние, зарядно и чанта.",phone:"0883 901 234",photos:4},
    {id:"l11",title:"Детско колело — подарявам",category:"Деца и бебета",subcategory:"",main:"trade",group:"trade",type:"Дава",price:"Безплатно",city:"Лом",owner:"Потребител",status:"approved",description:"Запазено детско колело. Само лично предаване.",phone:"0884 012 345",photos:2},
    {id:"l12",title:"Домашни здравни грижи",category:"Услуги",subcategory:"Домашни здравни грижи",main:"services",group:"health",type:"Предлага",price:"По договаряне",city:"Лом",owner:"Потребител",status:"prototype-only",description:"Примерна временна здравна услуга в прототипа. Не е проверен медицински профил.",phone:"0885 123 450",photos:0}
  ],
  firms:[
    {id:"f1",name:"Иванов Ремонти",category:"Строителство и ремонти",city:"Лом",phone:"0876 000 000",address:"Лом и района",hours:"Пон–Съб: 08:00–18:00",description:"Цялостни ремонти и довършителни дейности.",expanded:true,admin:true,services:["Цялостни ремонти","Бани и плочки","Шпакловка и боядисване","ВиК и довършителни работи"],area:"Лом, Монтана и района",website:"ivanov-remonti.com",status:"approved"},
    {id:"f2",name:"Авто Сервиз Лом",category:"Автомобили",city:"Лом",phone:"0878 456 789",address:"гр. Лом",hours:"Пон–Пет: 09:00–18:00",description:"Автодиагностика и сервизни услуги.",expanded:false,status:"approved"},
    {id:"f3",name:"Фото Студио Дунав",category:"Професионални услуги",city:"Лом",phone:"0888 332 211",address:"Център, Лом",hours:"С предварително записване",description:"Фото и видео услуги за семейни и местни събития.",expanded:false,status:"approved"},
    {id:"f4",name:"Ресторант Дунав",category:"Заведения",city:"Лом",phone:"0877 222 333",address:"край Дунав, Лом",hours:"Всеки ден: 11:00–23:00",description:"Примерен ресторант за преглед на фирмения профил на заведение.",expanded:true,status:"approved",services:["Обяд","Вечеря","Събития"]}
  ],
  healthProviders:[
    {id:"h1",name:"Д-р Мария Иванова",kind:"Лекар",specialty:"Обща медицина",phone:"0971 00 001",address:"Лом",status:"confirmed",confirmed:"Последно потвърдено: примерна дата",source:"Health/Info owner"},
    {id:"h2",name:"Дентална практика Дунав",kind:"Стоматолог",specialty:"Обща стоматология",phone:"0971 00 002",address:"Лом",status:"confirmed",confirmed:"Последно потвърдено: примерна дата",source:"Health/Info owner"},
    {id:"h3",name:"Ветеринарен кабинет Лом",kind:"Ветеринар",specialty:"Ветеринарна медицина",phone:"0971 00 003",address:"Лом",status:"confirmed",confirmed:"Последно потвърдено: примерна дата",source:"Health/Info owner"}
  ],
  shops:[
    {id:"s1",name:"Хранителен магазин Център",category:"Хранителни",phone:"0877 101 101",address:"Лом",hours:"07:30–20:00",tags:["Хранителни стоки","Напитки"],status:"approved"},
    {id:"s2",name:"Строителен магазин Дунав",category:"Строителни",phone:"0877 202 202",address:"Лом",hours:"08:00–18:00",tags:["Строителни материали","Бои","Инструменти"],status:"approved"},
    {id:"s3",name:"Техника Лом",category:"Техника",phone:"0877 303 303",address:"Лом",hours:"09:00–18:30",tags:["Телефони","Електроника"],status:"approved"}
  ],
  events:[
    {id:"e1",title:"Градско културно събитие",date:"12 септември 2026",time:"18:30",place:"Лом",description:"Примерно одобрено предстоящо събитие за преглед на изгледа за събития.",status:"approved"},
    {id:"e2",title:"Детска работилница",date:"19 септември 2026",time:"11:00",place:"Лом",description:"Примерно събитие за семейства и деца.",status:"approved"}
  ],
  infoRecords:[
    {id:"i1",family:"institutions",title:"Община Лом",type:"Институция",phone:"0971 69 101",address:"ул. „Дунавска“ №12, Лом",hours:"Приемно време според официалния източник",source:"Официален източник",confirmed:"Последно потвърдено",status:"confirmed",description:"Централен контакт и основна информация за общината."},
    {id:"i2",family:"transport",title:"ЖП гара Лом",type:"Транспорт",phone:"",address:"ул. „Пристанищна“ 41, Лом",hours:"Провери актуалното разписание",source:"Официална/проверена информация",confirmed:"Последно потвърдено",status:"confirmed",description:"Местоположение и полезен вход към железопътния транспорт."},
    {id:"i3",family:"transport",title:"Автогара Лом",type:"Транспорт",phone:"",address:"Лом",hours:"Провери актуалното разписание",source:"Проверена информация",confirmed:"Последно потвърдено",status:"confirmed",description:"Автобусни връзки и оператори."},
    {id:"i4",family:"education",title:"Образование и култура в Лом",type:"Справочник",phone:"",address:"Лом",hours:"",source:"Проверени местни източници",confirmed:"Последно потвърдено",status:"confirmed",description:"Училища, детски градини, читалища и културни обекти."},
    {id:"i5",family:"banks",title:"Банки и банкомати",type:"Справочник",phone:"",address:"Лом",hours:"",source:"Проверени публични източници",confirmed:"Последно потвърдено",status:"confirmed",description:"Практичен справочник за банкови и платежни услуги."},
    {id:"i6",family:"utilities",title:"Комунални и ежедневни услуги",type:"Справочник",phone:"",address:"Лом",hours:"",source:"Официални и проверени източници",confirmed:"Последно потвърдено",status:"confirmed",description:"Ток, вода, интернет, куриери и ежедневни услуги."}
  ],
  articles:[
    {id:"a1",title:"Как да избереш майстор за ремонт",topic:"Ремонти",summary:"Практичен checklist преди оглед, оферта и започване на ремонт.",readiness:"ready",body:["Опиши ясно каква работа трябва да се извърши.","Сравни обхват, материали и срок, а не само крайна цена.","Уточни как се приемат допълнителни работи и кой доставя материалите."]},
    {id:"a2",title:"Как да подадеш сигнал до община или институция",topic:"Инфо Лом",summary:"Къде е официалната информация и как да подготвиш ясен сигнал.",readiness:"candidate",body:["Провери кой е правилният получател.","Опиши факта, мястото и какво очакваш като действие.","При нужда приложи снимки или документи, без излишни лични данни."]},
    {id:"a3",title:"Как да публикуваш добра обява",topic:"Обяви",summary:"Заглавие, снимки, цена и описание, които помагат на хората да разберат предложението.",readiness:"ready",body:["Използвай конкретно заглавие.","Добави ясни снимки и честно описание.","Посочи реална цена или че е по договаряне."]}
  ],
  questions:[
    {id:"q1",title:"Кой препоръчва добър електротехник в Лом?",category:"Майстори и ремонти",description:"Търся човек за преглед и подмяна на част от електрическата инсталация.",status:"approved",answers:[{author:"Мария",text:"Провери профилите и обявите в Майстори и ремонти и поискай оглед преди решение."},{author:"Петър",text:"Добре е да уточниш дали става дума за апартамент или къща и какъв е обхватът."}]},
    {id:"q2",title:"Има ли препоръки за транспорт при преместване?",category:"Транспорт и доставки",description:"Трябва ми транспорт за мебели в рамките на Лом.",status:"approved",answers:[]},
    {id:"q3",title:"Къде да проверя актуално работно време на институция?",category:"Инфо Лом",description:"Искам да съм сигурен, че информацията е актуална преди да тръгна.",status:"approved",answers:[{author:"Попитай.Лом",text:"Използвай Инфо Лом и гледай източника и „Последно потвърдено“. При съмнение предложи корекция."}]}
  ],
  profile: {
    name:"Тестов потребител",email:"test@example.com",
    listings:[{title:"Търся майстор за ремонт на покрив",status:"approved"},{title:"Продавам гардероб",status:"pending"},{title:"Търся транспорт",status:"needs_changes"}],
    firms:[{title:"Моя тестова фирма",status:"pending"}],
    questions:[{title:"Има ли препоръки за транспорт при преместване?",status:"approved"}],
    corrections:[{title:"Корекция на телефон в Инфо Лом",status:"pending"}]
  },
  adminCounts:{listings:3,firms:1,shops:1,info:2,reports:1,edits:2,expanded:1,events:0},
  adminQueue:[
    {id:"r-self",type:"Обява",title:"Моя обява — тест за self-moderation",owner:"Тестов потребител",selfOwned:true,status:"pending"},
    {id:"r1",type:"Обява",title:"Продавам диван",owner:"Чужд потребител",status:"pending"},
    {id:"r2",type:"Обява",title:"Предлагам домашна помощ",owner:"Чужд потребител",status:"pending"},
    {id:"r3",type:"Фирма",title:"Нова фирма в Лом",owner:"Чужд потребител",status:"pending"},
    {id:"r4",type:"Магазин",title:"Нов магазин",owner:"Чужд потребител",status:"pending"},
    {id:"r5",type:"Инфо Лом",title:"Предложена корекция",owner:"Чужд потребител",status:"pending"}
  ]
};