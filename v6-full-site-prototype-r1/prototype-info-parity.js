"use strict";

(function(){
  const I = window.POPITAI_PROTO_INFO;
  if (!I) return;

  function callButton(phone,label="Обади се") {
    return phone ? `<button class="button button-primary" type="button" data-action="call" data-phone="${esc(phone)}">${esc(label)}</button>` : "";
  }

  function correctionButton(target) {
    return `<button class="button button-outline" type="button" data-route="correction?target=${encodeURIComponent(target)}&owner=info">Предложи корекция</button>`;
  }

  function external(url,label) {
    return url ? `<a class="button button-outline" href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>` : "";
  }

  function facts(rows) {
    return `<div class="facts">${rows.filter(x=>x[1]).map(([label,value])=>`<div class="fact"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join("")}</div>`;
  }

  function infoPanel(title,body,actions="",badge="Проверена информация") {
    return `<article class="detail-block"><div class="flex"><span class="badge badge-ok">${esc(badge)}</span></div><h3>${esc(title)}</h3>${body}${actions?`<div class="form-actions mt-16">${actions}</div>`:""}</article>`;
  }

  function contactRows(item) {
    const phones = item.phones || (item.phone ? [item.phone] : []);
    return facts([
      ["Адрес",item.address],
      ["Телефон",phones.join(" · ")],
      ["E-mail",item.email],
      ["Директор",item.director],
      ["Работно време",item.hours]
    ]) + (item.extra?`<p>${esc(item.extra)}</p>`:"") + (item.note?`<div class="notice notice-warn mt-12"><strong>Бележка за проверка</strong>${esc(item.note)}</div>`:"") + (item.url?`<div class="mt-12">${external(item.url,"Официална страница")}</div>`:"");
  }

  function sectionList(title,items) {
    return `<section class="section-tight"><div class="section-head"><div><h2>${esc(title)}</h2><p>${items.length} ${items.length===1?"запис":"записа"}</p></div></div><div class="result-list">${items.map(item=>`<article class="result-card"><div><div class="verified">✓ Проверена / контролирана информация</div><h3>${esc(item.name)}</h3>${contactRows(item)}</div><div class="result-actions">${item.phones?.[0]?callButton(item.phones[0]):""}${correctionButton(item.name)}</div></article>`).join("")}</div></section>`;
  }

  function renderTransportParity() {
    const t=I.transport;
    const busBody=`${facts([["Адрес",t.bus.address],["Информация за пътуване",t.bus.phone],["Централен телефон",t.bus.generalPhone],["E-mail",t.bus.email]])}<div class="notice notice-info mt-12"><strong>${esc(t.bus.verified)}</strong>Провери разписанието отново преди пътуване.</div><div class="mt-16"><h4>Показани направления</h4><div class="result-list">${t.bus.trips.map(x=>`<div class="notice"><strong>${esc(x.direction)} · ${esc(x.time)}</strong>${esc(x.route)}${x.note?`<br><small>${esc(x.note)}</small>`:""}</div>`).join("")}</div></div>`;
    const railBody=`${facts([["Адрес",t.rail.address],["Телефон",t.rail.phone],["Работно време",t.rail.hours]])}<p>${esc(t.rail.note)}</p>`;
    const taxiBody=`<div class="result-list">${t.taxis.map(x=>`<article class="result-card"><div><h3>${esc(x.name)}</h3>${facts([["Телефон",x.phone],["Район",x.area]])}<p>${esc(x.note)}</p></div><div class="result-actions">${callButton(x.phone)}</div></article>`).join("")}</div><div class="notice notice-warn mt-16"><strong>„Добави такси“ още не се връща</strong>По-старият общ Info слой е имал такова действие, но текущият специализиран Transport owner не го показва. До изрично authority решение прототипът не измисля формата.</div>`;

    main.innerHTML=pageIntro("Инфо Лом","Транспорт","Автогара, железопътен транспорт и проверени местни такси — разделени ясно по задача.")+`<section class="section"><div class="shell">${crumb([["Инфо Лом","info"],["Транспорт",""]])}${infoPanel(t.bus.title,busBody,callButton(t.bus.phone,"Информация за пътуване")+external(t.bus.sourceUrl,"Официален източник")+correctionButton(t.bus.title))}${infoPanel(t.rail.title,railBody,callButton(t.rail.phone)+external(t.rail.timetable,"Разписание БДЖ")+external(t.rail.live,"Движение на влаковете")+correctionButton(t.rail.title))}${infoPanel("Таксита в Лом",taxiBody,correctionButton("Таксита в Лом"))}</div></section>`;
  }

  function renderEducationParity() {
    const e=I.education;
    main.innerHTML=pageIntro("Инфо Лом","Образование и култура","Училища, детски градини, читалища, библиотека, музей и школи — с реалния обхват на специализирания owner.")+`<section class="section"><div class="shell">${crumb([["Инфо Лом","info"],["Образование и култура",""]])}<div class="notice notice-info"><strong>Пълен content inventory</strong>Тук са 24-те структурирани записа от текущия специализиран Education owner. Непотвърдените детайли се маркират, а не се представят като сигурни.</div><div class="mt-16">${sectionList("Училища",e.schools)}${sectionList("Детски градини",e.kindergartens)}${sectionList("Читалища",e.communityCenters)}${sectionList("Библиотека",e.library)}${sectionList("Музей",e.museum)}${sectionList("Школи и курсове",e.courses)}</div><div class="notice notice-warn"><strong>Формите за ново училище/детска градина остават блокирани за решение</strong>Legacy слой има такива действия, но current specialized renderer ги няма. Не ги възстановяваме по предположение.</div></div></section>`;
  }

  function atmCard(a) {
    return `<article class="result-card"><div><div class="verified">${a.official?"✓ Официално":"Банкомат"}</div><h3>${esc(a.bank)}</h3>${facts([["Адрес",a.address],["Място",a.place],["Устройства",String(a.devices)]])}<div class="tag-row">${a.always?'<span class="badge badge-ok">24/7</span>':""}${a.deposit?'<span class="badge badge-ok">Внасяне</span>':""}</div></div></article>`;
  }

  function renderBanksParity() {
    const b=I.banks;
    const atmDevices=b.atms.reduce((sum,x)=>sum+Number(x.devices||0),0);
    main.innerHTML=pageIntro("Инфо Лом","Банки и банкомати","Банкоматите и банковите офиси са отделни, за да се намира точната задача бързо.")+`<section class="section"><div class="shell">${crumb([["Инфо Лом","info"],["Банки и банкомати",""]])}<div class="section-head"><div><h2>Банкомати</h2><p>${atmDevices} устройства · ${b.atms.length} адреса в review data</p></div><button class="button button-primary" type="button" data-route="info-proposal?type=atm">Добави банкомат</button></div><div class="result-list">${b.atms.map(atmCard).join("")}</div><div class="divider"></div><div class="section-head"><div><h2>Банкови офиси</h2><p>${b.offices.length} офиса</p></div></div><div class="result-list">${b.offices.map(o=>`<article class="result-card"><div><div class="verified">${esc(o.status)}</div><h3>${esc(o.name)}</h3>${facts([["Адрес",o.address],["Работно време",o.hours],["Телефон",o.phone]])}${o.note?`<p>${esc(o.note)}</p>`:""}</div><div class="result-actions">${callButton(o.phone)}${external(o.url,"Официална страница")}${correctionButton(o.name)}</div></article>`).join("")}</div></div></section>`;
  }

  function renderUtilitiesParity() {
    const u=I.utilities;
    const paymentGroups=[...new Set(u.payments.map(x=>x.operator))];
    main.innerHTML=pageIntro("Инфо Лом","Комунални и ежедневни услуги","Вода, ток, куриери, плащания, интернет/TV и застраховки — пълната структура на специализирания owner.")+`<section class="section"><div class="shell">${crumb([["Инфо Лом","info"],["Комунални и ежедневни услуги",""]])}
      <div class="grid grid-2">
        ${infoPanel(u.water.title,`${facts([["Аварии 24/7",`${u.water.phone} · ${u.water.phoneNote}`],["Самоотчет по Viber",u.water.viber],["Източник",u.water.source]])}`,callButton(u.water.phone,"Обади се за авария"))}
        ${infoPanel(u.power.title,`${facts([["Център Лом",u.power.address],["Работно време",u.power.hours],["Телефон",u.power.phone],["Източник",u.power.source]])}`,callButton(u.power.phone,"Обади се на Електрохолд"))}
      </div>
      <div class="divider"></div>
      <div class="section-head"><div><h2>Куриерски услуги</h2><p>${u.courierProviders.join(" · ")}</p></div><button class="button button-primary" data-route="info-proposal?type=courier">Добави куриерска точка</button></div><div class="notice notice-info"><strong>Динамични записи</strong>Конкретните офиси и автомати идват от публикуваните Info записи. Офлайн R1 не измисля адреси. Показваме provider структурата и реалния Add flow.</div><div class="tag-row mt-12">${u.courierProviders.map(x=>`<span class="badge badge-blue">${esc(x)}</span>`).join("")}</div>
      <div class="divider"></div>
      <div class="section-head"><div><h2>Плащания и каси</h2><p>${u.payments.length} места в owner review data</p></div><button class="button button-primary" data-route="info-proposal?type=payment">Добави каса / място за плащане</button></div>${paymentGroups.map(operator=>`<section class="section-tight"><h3>${esc(operator)}</h3><div class="result-list">${u.payments.filter(x=>x.operator===operator).map(x=>`<article class="result-card"><div><h4>${esc(x.address)}</h4><p>${esc(x.hours)}</p>${x.note?`<small>${esc(x.note)}</small>`:""}</div></article>`).join("")}</div></section>`).join("")}
      <div class="divider"></div>
      <div class="section-head"><div><h2>Интернет и телевизия</h2><p>Покритие, местни контакти и официални действия</p></div><button class="button button-primary" data-route="info-proposal?type=internet">Добави доставчик</button></div><div class="notice notice-info"><strong>Динамичен каталог</strong>Публикуваните provider записи идват от Info данните. По-долу са само потвърдените provider метаданни, използвани от current owner.</div><div class="result-list mt-12">${u.internetProviders.map(x=>`<article class="result-card"><div><h3>${esc(x.name)}</h3>${facts([["Адрес",x.address],["Работно време",x.hours],["Телефон",x.phone],["Лом офис",x.lomPhone]])}${x.note?`<p>${esc(x.note)}</p>`:""}</div><div class="result-actions">${callButton(x.lomPhone||x.phone)}</div></article>`).join("")}</div>
      <div class="divider"></div>
      <div class="section-head"><div><h2>Застрахователни офиси</h2><p>${u.insurance.length} локални записа</p></div><button class="button button-primary" data-route="info-proposal?type=insurance">Добави застрахователен офис</button></div><div class="result-list">${u.insurance.map(x=>`<article class="result-card"><div><div class="verified">${esc(x.source)}</div><h3>${esc(x.name)}</h3><p>${esc(x.role)}</p>${facts([["Адрес",x.address],["Телефон",x.phones.join(" · ")],["Работно време",x.hours]])}</div><div class="result-actions">${callButton(x.phones[0])}${correctionButton(x.name)}</div></article>`).join("")}</div>
    </div></section>`;
  }

  function renderInstitutionsParity() {
    const ins=I.institutions;
    main.innerHTML=pageIntro("Инфо Лом","Институции","Община, спешни и държавни служби — без измисляне на динамични записи в офлайн прототипа.")+`<section class="section"><div class="shell">${crumb([["Инфо Лом","info"],["Институции",""]])}<div class="notice notice-info"><strong>Част от каталога е динамичен</strong>${esc(ins.dynamicNote)}</div><div class="result-list mt-16">${ins.highlighted.map(x=>`<article class="result-card"><div><div class="verified">✓ ${esc(x.confirmed)}</div><h3>${esc(x.name)}</h3>${facts([["Адрес",x.address],["Телефон",x.phone],["E-mail",x.email],["Работно време",x.hours]])}${x.note?`<p>${esc(x.note)}</p>`:""}<div class="info-source">Източник: ${esc(x.source)}</div></div><div class="result-actions">${callButton(x.phone)}${correctionButton(x.name)}</div></article>`).join("")}</div><div class="notice notice-warn mt-16"><strong>Няма публична „Добави институция“ форма</strong>Текущият specialized owner използва проверени записи и correction/signal инфраструктура.</div></div></section>`;
  }

  const originalRenderInfo = window.renderInfo || renderInfo;
  window.renderInfo = function renderInfoParity(){
    const family=routeInfo().parts[1];
    if(!family) return originalRenderInfo();
    if(family==="health") return renderInfoHealth();
    if(family==="transport") return renderTransportParity();
    if(family==="education") return renderEducationParity();
    if(family==="banks") return renderBanksParity();
    if(family==="utilities") return renderUtilitiesParity();
    if(family==="institutions") return renderInstitutionsParity();
    return originalRenderInfo();
  };

  const proposalConfigs = {
    atm:{title:"Добави банкомат",lead:"Предложи банкомат за проверка преди публикуване.",back:"info/banks",fields:()=>`${field("Банка / оператор","name",{required:true,min:2})}${field("Адрес в Лом","address",{required:true,min:3})}${field("Място / ориентир (по желание)","place",{placeholder:"напр. до банков офис или в магазин"})}${field("24/7 / внасяне / уточнения","details",{textarea:true,full:true})}${field("Източник / линк (по желание)","source",{full:true})}`},
    courier:{title:"Добави куриерска точка",lead:"Предложи офис или автомат за проверка.",back:"info/utilities",fields:()=>`${field("Куриерска фирма","name",{required:true,min:2})}${field("Адрес в Лом","address",{required:true,min:3})}${selectField("Вид","kind",["Офис","Автомат / шкафче"],"",{required:true})}${field("Работно време / 24/7 (по желание)","hours",{})}${field("Източник / линк (по желание)","source",{full:true})}`},
    internet:{title:"Добави доставчик",lead:"Предложи интернет/TV доставчик за проверка.",back:"info/utilities",fields:()=>`${field("Име на доставчика","name",{required:true,min:2})}${field("Местен адрес (по желание)","address",{})}${field("Телефон (по желание)","phone",{type:"tel"})}${field("Какво предлага","services",{textarea:true,required:true,min:10,full:true})}${field("Източник / линк (по желание)","source",{full:true})}`},
    payment:{title:"Добави каса / място за плащане",lead:"Попълни само това, което знаеш. Предложението чака проверка.",back:"info/utilities",fields:()=>`${field("Име / оператор","name",{required:true,min:2})}${field("Адрес в Лом","address",{required:true,min:3})}${field("Работно време (по желание)","hours",{})}${field("Какво може да се плаща (по желание)","services",{textarea:true,full:true})}${field("Източник / линк (по желание)","source",{full:true})}`},
    insurance:{title:"Добави застрахователен офис",lead:"Предложи локален офис за проверка преди публикуване.",back:"info/utilities",fields:()=>`${field("Име на офиса","name",{required:true,min:2})}${field("Адрес в Лом","address",{required:true,min:3})}${field("Телефон (по желание)","phone",{type:"tel"})}${field("Работно време (по желание)","hours",{})}${field("Източник / линк (по желание)","source",{full:true})}`}
  };

  window.renderInfoProposal = function renderInfoProposal(){
    const type=routeInfo().params.get("type")||"";
    const config=proposalConfigs[type];
    if(!config)return renderNotFound();
    main.innerHTML=pageIntro("Инфо Лом",config.title,config.lead)+`<section class="section"><div class="shell form-wrap"><div class="form-card"><div class="notice notice-info"><strong>Публикуване след проверка</strong>Това е prototype симулация на съществуващия специализиран Info submission flow. Няма реален запис към Supabase.</div><form class="form-grid proto-form mt-16" data-form="info-proposal" data-info-type="${esc(type)}" data-back-route="${esc(config.back)}">${config.fields()}<div class="form-actions"><button class="button button-outline" type="button" data-route="${esc(config.back)}">Отказ</button><button class="button button-primary" type="submit">Изпрати за проверка</button></div></form></div></div></section>`;
    bindFormUX();
  };

  const baseSubmit = window.submitForm || submitForm;
  window.submitForm = async function submitFormWithInfoProposal(form){
    if(form?.dataset?.form!=="info-proposal") return baseSubmit(form);
    if(form.dataset.submitting==="true")return;
    if(!validateForm(form))return;
    if(!requireSignIn("info-proposal",form))return;
    setSubmitting(form,true);
    clearFormStatus(form);
    await new Promise(resolve=>setTimeout(resolve,260));
    if(state.dataState==="offline"||state.dataState==="error"){
      showFormStatus(form,"Не успяхме да изпратим","Данните са запазени. Провери връзката и опитай отново.");
      setSubmitting(form,false);
      state.dirty=true;
      return;
    }
    state.dirty=false;
    const back=form.dataset.backRoute||"info";
    successScreen("Предложението е изпратено за проверка","Нищо не е публикувано автоматично. Специализираният Info поток трябва да потвърди данните преди публично показване.",back,"Към раздела");
  };
})();
