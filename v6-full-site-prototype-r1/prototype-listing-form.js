"use strict";

(function(){
  function choiceId(name,index){return `simple-${name}-${index}`}
  function choice(name,value,title,text,index,checked=false){
    const id=choiceId(name,index);
    return `<div class="choice"><input id="${id}" name="${esc(name)}" type="radio" value="${esc(value)}" ${checked?"checked":""} required><label for="${id}"><strong>${esc(title)}</strong>${text?`<small>${esc(text)}</small>`:""}</label></div>`;
  }
  function selected(form,name){return form.querySelector(`[name="${CSS.escape(name)}"]:checked`)?.value||""}
  function setHidden(form,name,value){const el=form.elements[name];if(el)el.value=value||""}
  function existingKind(existing,mainPref){return existing?.main||mainPref||""}
  function initialAction(existing,kind,intent,leaf){
    if(existing?.type)return existing.type;
    if(!intent)return "";
    if(kind==="services")return intent==="seek"?"Търси":"Предлага";
    if(kind==="work")return intent==="seek"?"Търси работа":"Предлага работа";
    if(kind==="property")return intent==="seek"?"Търси под наем":"Продава имот";
    if(kind==="trade")return intent==="seek"?"Купува":"Продава";
    if(kind==="vehicles"){
      if(leaf==="Автомобили за продажба или търсене")return intent==="seek"?"Купува":"Продава";
      return intent==="seek"?"Търси":"Предлага";
    }
    return "";
  }
  function kindChoices(current){
    const rows=[
      ["services","Услуга","Майстор, здраве, домашна или друга услуга"],
      ["vehicles","Автомобили","Автомобил, части или автомобилна услуга"],
      ["work","Работа","Предлагаш работа или търсиш работа"],
      ["property","Имот","Продажба, наем или търсене на имот"],
      ["trade","Стока","Купуваш, продаваш или подаряваш"]
    ];
    return rows.map((x,i)=>choice("simple_kind",x[0],x[1],x[2],i,current===x[0])).join("");
  }
  function actionChoices(kind,current,leaf){
    let rows=[];
    if(kind==="services")rows=[["Предлага","Предлагам услуга","Имаш услуга, която можеш да извършиш"],["Търси","Търся услуга","Търсиш човек или фирма за конкретна услуга"]];
    if(kind==="work")rows=[["Предлага работа","Предлагам работа","Търсиш човек за работа"],["Търси работа","Търся работа","Търсиш работа за себе си"]];
    if(kind==="property")rows=[["Продава имот","Продавам имот","Къща, апартамент, земя или друг имот"],["Отдава под наем","Отдавам под наем","Предлагаш имот под наем"],["Търси под наем","Търся под наем","Търсиш имот за наемане"],["Търси за купуване","Търся да купя","Търсиш имот за покупка"]];
    if(kind==="trade")rows=[["Продава","Продавам","Предлагаш стока за продажба"],["Купува","Търся да купя","Търсиш конкретна стока"],["Дава","Подарявам","Даваш стоката безплатно"]];
    if(kind==="vehicles"){
      if(leaf==="Автомобили за продажба или търсене")rows=[["Продава","Продавам автомобил","Предлагаш автомобил за продажба"],["Купува","Търся автомобил","Търсиш автомобил за покупка"]];
      else if(leaf)rows=[["Предлага","Предлагам тази услуга","Предлагаш автомобилна услуга"],["Търси","Търся тази услуга","Търсиш автомобилна услуга"]];
    }
    return rows.map((x,i)=>choice("simple_action",x[0],x[1],x[2],i,current===x[0])).join("");
  }
  function serviceStep(groupValue,leafValue,actionValue){
    const groupOptions=D.serviceGroups.map(g=>({value:g.key,label:g.title}));
    const group=D.serviceGroups.find(g=>g.key===groupValue);
    const leafOptions=group?.leaves||[];
    const otherHealth=groupValue==="health"&&leafValue==="Друга здравна услуга";
    return `<div class="form-section"><h3>2. Уточни услугата</h3><p class="muted">Не е нужно да знаеш вътрешните категории на сайта — избери най-близкото описание.</p><div class="choice-grid">${actionChoices("services",actionValue,leafValue)}</div><div class="form-grid mt-16">${selectField("Каква услуга е?","simple_group",groupOptions,groupValue,{required:true,full:true,placeholder:"Избери вид услуга"})}${groupValue?selectField("Уточни услугата","simple_leaf",leafOptions,leafValue,{required:true,full:true,placeholder:"Избери конкретна услуга"}):""}${otherHealth?field("Каква точно е здравната услуга?","custom_service_name",{required:true,min:3,full:true,placeholder:"Например: домашна смяна на превръзка"}):""}</div></div>`;
  }
  function vehicleStep(leafValue,actionValue){
    return `<div class="form-section"><h3>2. Какво точно публикуваш?</h3><div class="form-grid">${selectField("Автомобил или автомобилна услуга","simple_leaf",D.autoLeaves,leafValue,{required:true,full:true,placeholder:"Избери"})}</div>${leafValue?`<div class="choice-grid mt-16">${actionChoices("vehicles",actionValue,leafValue)}</div>`:""}</div>`;
  }
  function workStep(actionValue){return `<div class="form-section"><h3>2. Какво искаш да направиш?</h3><div class="choice-grid">${actionChoices("work",actionValue,"")}</div></div>`}
  function propertyStep(actionValue){return `<div class="form-section"><h3>2. Какво искаш да направиш?</h3><div class="choice-grid">${actionChoices("property",actionValue,"")}</div></div>`}
  function tradeStep(leafValue,actionValue){
    return `<div class="form-section"><h3>2. Уточни обявата</h3><div class="choice-grid">${actionChoices("trade",actionValue,leafValue)}</div><div class="form-grid mt-16">${selectField("Каква стока е?","simple_leaf",D.tradeLeaves,leafValue,{required:true,full:true,placeholder:"Избери категория"})}</div></div>`;
  }
  function classificationReady(form){
    const kind=selected(form,"simple_kind"),action=selected(form,"simple_action");
    if(!kind||!action)return false;
    if(kind==="services")return Boolean(form.elements.simple_group?.value&&form.elements.simple_leaf?.value);
    if(kind==="vehicles"||kind==="trade")return Boolean(form.elements.simple_leaf?.value);
    return true;
  }
  function summaryText(form){
    const kind=selected(form,"simple_kind"),action=selected(form,"simple_action"),group=form.elements.simple_group?.value||"",leaf=form.elements.simple_leaf?.value||"";
    const kindLabel=listingPublicMain(kind);
    const groupLabel=D.serviceGroups.find(x=>x.key===group)?.title||"";
    return [action,kindLabel,groupLabel,leaf].filter(Boolean).join(" → ");
  }
  function technicalIntent(action){return /Търси|Купува/.test(action)?"seek":"offer"}
  function refreshSimpleListing(form,{preserveAction=true}={}){
    const kind=selected(form,"simple_kind");
    const currentAction=preserveAction?selected(form,"simple_action"):"";
    const groupValue=form.elements.simple_group?.value||form.dataset.prefGroup||"";
    const leafValue=form.elements.simple_leaf?.value||form.dataset.prefLeaf||"";
    const step=document.getElementById("simple-listing-step2");
    if(!step)return;
    let html=`<div class="notice notice-info"><strong>Първо избери какво публикуваш.</strong>След това ще покажем само нужните въпроси.</div>`;
    if(kind==="services")html=serviceStep(groupValue,leafValue,currentAction||form.dataset.prefAction||"");
    if(kind==="vehicles")html=vehicleStep(leafValue,currentAction||form.dataset.prefAction||"");
    if(kind==="work")html=workStep(currentAction||form.dataset.prefAction||"");
    if(kind==="property")html=propertyStep(currentAction||form.dataset.prefAction||"");
    if(kind==="trade")html=tradeStep(leafValue,currentAction||form.dataset.prefAction||"");
    step.innerHTML=html;
    const action=selected(form,"simple_action");
    const group=form.elements.simple_group?.value||"";
    const leaf=form.elements.simple_leaf?.value||"";
    setHidden(form,"main",kind);
    setHidden(form,"service_group",kind==="services"?group:"");
    setHidden(form,"leaf",leaf);
    setHidden(form,"technical_type",action);
    setHidden(form,"technical_intent",technicalIntent(action));
    const ready=classificationReady(form);
    const details=document.getElementById("simple-listing-details");
    const summary=document.getElementById("simple-listing-summary");
    if(details)details.hidden=!ready;
    if(summary){summary.hidden=!ready;summary.innerHTML=ready?`<strong>Ти избра:</strong> ${esc(summaryText(form))}`:""}
    const freeRow=document.getElementById("simple-free-row");if(freeRow)freeRow.hidden=kind!=="trade";
    const priceLabel=document.getElementById("simple-price-label");if(priceLabel)priceLabel.textContent=kind==="work"?"Възнаграждение в евро (по желание)":"Цена в евро (по желание)";
    form.dataset.prefGroup="";form.dataset.prefLeaf="";form.dataset.prefAction="";
    bindFormUX();
  }
  function bindSimpleListing(form){
    if(form.dataset.simpleBound)return;
    form.dataset.simpleBound="1";
    form.addEventListener("change",e=>{
      if(!["simple_kind","simple_action","simple_group","simple_leaf"].includes(e.target.name))return;
      if(e.target.name==="simple_kind"){
        form.dataset.prefGroup="";form.dataset.prefLeaf="";form.dataset.prefAction="";
        refreshSimpleListing(form,{preserveAction:false});
      }else if(e.target.name==="simple_group"){
        form.dataset.prefLeaf="";
        const action=selected(form,"simple_action");
        form.dataset.prefAction=action;
        refreshSimpleListing(form,{preserveAction:true});
      }else if(e.target.name==="simple_leaf"&&selected(form,"simple_kind")==="vehicles"){
        form.dataset.prefAction="";
        refreshSimpleListing(form,{preserveAction:false});
      }else refreshSimpleListing(form,{preserveAction:true});
    });
  }

  window.renderListingForm=function renderListingForm(){
    const r=routeInfo(),editId=r.params.get("edit"),existing=editId?D.listings.find(x=>x.id===editId):null;
    const mainPref=existingKind(existing,r.params.get("main")||"");
    const groupPref=existing?.group||r.params.get("group")||"";
    const leafPref=existing?publicSubcategory(existing.subcategory||existing.category):r.params.get("leaf")||"";
    const intentPref=existing?(/Търси|Купува/.test(existing.type)?"seek":"offer"):(r.params.get("intent")||"");
    const actionPref=initialAction(existing,mainPref,intentPref,leafPref);
    const quota=isAdmin()?`<p class="muted small"><strong>Admin:</strong> публикацията може да се публикува директно според защитените правила.</p>`:`<p class="muted small">До 5 нови лични обяви за календарен месец. Редакцията не използва нова квота.</p>`;
    const adminExtras=isAdmin()?`<details class="form-section"><summary><strong>Администраторски опции</strong></summary><div class="grid grid-2 mt-16"><label class="check-row"><input type="checkbox" name="urgent"> Спешно</label><label class="check-row"><input type="checkbox" name="reduced"> Намалено</label><label class="check-row"><input type="checkbox" name="boosted"> Горно позициониране</label><label class="check-row"><input type="checkbox" name="highlight"> Открояване</label><label class="check-row"><input type="checkbox" name="stats"> Статистики</label><label class="check-row"><input type="checkbox" name="floating"> Плаващи контактни бутони</label></div></details>`:"";
    main.innerHTML=pageIntro("Обяви и услуги",existing?"Редактирай обявата":"Публикувай обява",existing?"Промени само необходимото. Редакцията не създава нова обява.":"Избери какво публикуваш. Ще ти покажем само полетата, които са нужни.")+`<section class="section"><div class="shell form-wrap">${crumb([["Обяви и услуги","marketplace"],[existing?"Редактирай":"Публикувай обява",""]])}<div class="form-card">${quota}<form class="proto-form" data-form="listing" data-edit-id="${esc(editId||"")}" data-pref-group="${esc(groupPref)}" data-pref-leaf="${esc(leafPref)}" data-pref-action="${esc(actionPref)}"><input type="hidden" name="main" value="${esc(mainPref)}"><input type="hidden" name="service_group" value="${esc(groupPref)}"><input type="hidden" name="leaf" value="${esc(leafPref)}"><input type="hidden" name="technical_type" value="${esc(actionPref)}"><input type="hidden" name="technical_intent" value="${esc(intentPref)}"><fieldset class="field field-full"><legend>1. Какво публикуваш? *</legend><p class="muted small">Избери най-близкото. Няма грешен технически термин, който трябва да знаеш.</p><div class="choice-grid">${kindChoices(mainPref)}</div><small class="field-error" data-error-for="simple_kind"></small></fieldset><div id="simple-listing-step2" class="mt-16"></div><div id="simple-listing-summary" class="notice notice-ok mt-16" hidden></div><div id="simple-listing-details" hidden><div class="form-section"><h3>3. Опиши обявата</h3><div class="form-grid">${field("Заглавие","title",{required:true,min:5,max:120,full:true,value:existing?.title||"",placeholder:"Например: Търся помощ за почистване на апартамент"})}${field("Описание","description",{textarea:true,required:true,min:20,full:true,value:existing?.description||"",placeholder:"Напиши най-важното, което другият човек трябва да знае"})}<div class="field"><label id="simple-price-label" for="f-price">Цена в евро (по желание)</label><input id="f-price" name="price" type="number" min="0" step="0.01" placeholder="0.00"><small class="field-error" data-error-for="price"></small></div><div class="field"><label>Условия</label><label class="check-row"><input type="checkbox" name="negotiable"> Договаряне</label><label class="check-row" id="simple-free-row" hidden><input type="checkbox" name="free"> Подарява / безплатно</label></div>${field("Телефон","phone",{required:true,type:"tel",value:existing?.phone||"",placeholder:"0... или +359..."})}${field("Град / район","city",{required:true,min:2,value:existing?.city||"Лом"})}${field("Улица (по желание)","street",{full:true,placeholder:"Само ако е полезно за обявата"})}<div class="field field-full"><label for="listing-photos">Снимки (по желание)</label><div class="photo-drop"><input id="listing-photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple><strong>Добави до 6 снимки</strong><br><small>В прототипа файловете не се качват никъде.</small><div class="photo-preview" id="listing-photo-preview"></div></div></div></div></div><details class="form-section"><summary><strong>Публикувай от името на фирма (по желание)</strong></summary><div class="form-grid mt-16">${selectField("Кой публикува?","publisher",["Лична обява","Моя одобрена фирма"],existing?.ownerType==="firm"?"Моя одобрена фирма":"Лична обява",{required:true,full:true})}</div></details>${adminExtras}<label class="check-row field-full"><input type="checkbox" name="consent" required> Прочетох и приемам правилата за публикуване.</label><div class="form-actions"><button class="button button-outline" type="button" data-route="marketplace">Отказ</button><button class="button button-primary" type="submit">${isAdmin()?"Публикувай":existing?"Запази промените":"Изпрати за преглед"}</button></div></div></form></div></div></section>`;
    const form=document.querySelector('form[data-form="listing"]');
    if(!form)return;
    bindSimpleListing(form);
    refreshSimpleListing(form,{preserveAction:true});
    bindFormUX();
    setTimeout(()=>{if(document.contains(form))refreshSimpleListing(form,{preserveAction:true})},40);
  };
})();
