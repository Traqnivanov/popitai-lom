'use strict';

(() => {
  const contract=window.PopitaiStage2Contracts;
  if(!contract) return;

  function optionHtml(values,current=''){
    return '<option value="">Избери</option>'+values.map(v=>`<option value="${String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;')}" ${v===current?'selected':''}>${v}</option>`).join('');
  }

  function syncListingForm({preserve=true}={}){
    const category=document.getElementById('listing-category');
    const sub=document.getElementById('listing-subcategory');
    const field=document.getElementById('listing-subcategory-field');
    const type=document.getElementById('listing-type');
    if(!category||!sub||!field||!type) return;

    const cat=category.value;
    const oldSub=preserve?sub.value:'';
    const subs=contract.listingSubcategories(cat);
    const nextSub=subs.includes(oldSub)?oldSub:'';
    sub.innerHTML=optionHtml(subs,nextSub);
    sub.value=nextSub;
    field.hidden=!subs.length;
    sub.disabled=!subs.length;
    sub.required=Boolean(subs.length);

    const oldType=preserve?type.value:'';
    const types=contract.listingTypes(cat,nextSub);
    const forced=cat==='Животни'?(contract.animalTypeBySubcategory[nextSub]||''):'';
    const nextType=forced||(types.includes(oldType)?oldType:'');
    type.innerHTML=optionHtml(types,nextType);
    type.value=nextType;

    const warning=document.getElementById('animal-warning');
    if(warning) warning.hidden=cat!=='Животни';

    const form=category.closest('form');
    const title=form?.querySelector('input[type="text"]');
    const description=form?.querySelector('textarea');
    const hints=(()=>{
      if(cat==='Услуги') return type.value==='Търси'?['Напр. Търся изпълнител за конкретна услуга в Лом','Опиши какво трябва да се направи, район, срок и важни условия.']:['Напр. Предлагам конкретна услуга в Лом','Опиши какво извършваш, район, срокове и важни условия.'];
      if(cat==='Работа') return type.value==='Търси работа'?['Напр. Търся работа като шофьор в Лом','Опиши опит, квалификация, наличност и каква работа търсиш.']:['Напр. Търсим шофьор за доставки в Лом','Опиши длъжност, график, изисквания и условия.'];
      if(cat==='Имоти') return ['Напр. Двустаен апартамент в Лом','Опиши вида на имота, район, състояние и важни условия за сделката.'];
      if(cat==='Автомобили и МПС') return nextSub==='Части, гуми и аксесоари'?['Напр. Комплект зимни гуми за автомобил','Опиши състояние, размер/съвместимост и важни детайли.']:['Напр. Автомобил в Лом','Опиши марка, модел, година, състояние и важни подробности.'];
      if(cat==='Животни') return nextSub==='Осиновяване / търси дом'?['Напр. Котка търси дом в Лом','Опиши животното, възраст, характер и условията за осиновяване.']:nextSub==='Изгубени'?['Напр. Изгубено куче в Лом','Опиши кога и къде е изгубено, отличителни белези и контакт.']:nextSub==='Намерени'?['Напр. Намерено куче в Лом','Опиши кога и къде е намерено и отличителните белези.']:['Напр. Храна или аксесоар за домашен любимец','Опиши стоката, състоянието и важните подробности.'];
      return ['Напр. Продавам запазен велосипед в Лом','Опиши състояние, размери, важни особености и условия.'];
    })();
    if(title&&!title.value) title.placeholder=hints[0];
    if(description&&!description.value) description.placeholder=hints[1];
  }

  function syncQuestionHints(){
    const form=document.querySelector('[data-proto-form][data-form-kind="question"]');
    if(!form) return;
    const select=form.querySelector('select');
    const title=form.querySelector('input[type="text"]');
    const description=form.querySelector('textarea');
    if(!select||!title||!description) return;
    const examples={
      'Майстори и ремонти':['Напр. Кой препоръчва добър ВиК майстор в Лом?','Опиши какъв ремонт или майстор търсиш, къде е обектът и какво е важно за теб.'],
      'Здраве и лекари':['Напр. Кой кардиолог в Лом бихте препоръчали?','Опиши какъв лекар или здравна информация търсиш. Не публикувай чувствителни лични медицински данни.'],
      'Автомобили':['Напр. Кой автосервиз в Лом препоръчвате?','Опиши автомобила, проблема или услугата, която търсиш.'],
      'Магазини и покупки':['Напр. Къде в Лом мога да намеря този продукт?','Опиши какво търсиш и какви условия са важни.'],
      'Заведения':['Напр. Къде в Лом има добра храна за вкъщи?','Опиши какъв тип заведение или услуга търсиш.'],
      'Работа и услуги':['Напр. Кой предлага почистване на апартамент в Лом?','Опиши конкретната услуга, срок и район.'],
      'Обяви':['Напр. Някой предлага ли това в Лом?','Опиши какво търсиш или искаш да намериш.'],
      'Събития и град':['Напр. Какво се случва в Лом този уикенд?','Опиши каква местна информация или събитие търсиш.']
    };
    const pair=examples[select.value]||['Напр. Кой може да помогне с това в Лом?','Опиши ясно какво търсиш и какъв отговор би ти бил полезен.'];
    if(!title.value) title.placeholder=pair[0];
    if(!description.value) description.placeholder=pair[1];
  }

  function syncResultsAddTarget(){
    const raw=(location.hash||'').slice(1);
    const [path,queryString='']=raw.split('?');
    if(path!=='results') return;
    const q=new URLSearchParams(queryString);
    if(q.get('context')!=='Услуги') return;
    const discovery=q.get('group')||'';
    const canonical=contract.serviceCanonical(discovery);
    if(!canonical) return;
    const primary=document.querySelector('.page-tools a.btn.primary');
    if(!primary) return;
    const params=new URLSearchParams({category:'Услуги',subcategory:canonical});
    primary.setAttribute('href',`#add/listing?${params}`);
    primary.dataset.discoveryService=discovery;
    primary.dataset.canonicalService=canonical;
  }

  function syncAfterRender(){queueMicrotask(()=>{syncListingForm({preserve:true});syncQuestionHints();syncResultsAddTarget();});}

  document.addEventListener('change',e=>{
    if(e.target.id==='listing-category') syncListingForm({preserve:false});
    if(e.target.id==='listing-subcategory'||e.target.id==='listing-type') syncListingForm({preserve:true});
    if(e.target.closest?.('[data-proto-form][data-form-kind="question"]')) syncQuestionHints();
  });

  document.addEventListener('input',e=>{
    const form=e.target.closest?.('[data-proto-form]');
    if(form) form.dataset.dirty='true';
  });
  document.addEventListener('change',e=>{
    const form=e.target.closest?.('[data-proto-form]');
    if(form) form.dataset.dirty='true';
  });

  document.addEventListener('click',e=>{
    const cancel=e.target.closest?.('[data-proto-form] a[href="#home"]');
    if(cancel){
      const form=cancel.closest('[data-proto-form]');
      if(form?.dataset.dirty==='true'&&form.dataset.submitted!=='true'&&!window.confirm('Има неизпратени данни. Затварянето ще ги изчисти. Да продължа ли?')) e.preventDefault();
    }

    const share=e.target.closest?.('[data-demo-share]');
    if(share){
      const box=share.closest('.share-menu')?.querySelector('.share-demo-message');
      const messages={native:'На телефон ще се отвори системното меню за споделяне.',facebook:'Facebook ще използва постоянния URL и неговия social preview.',copy:'Постоянният линк е копиран. (Прототип — няма реално копиране.)'};
      if(box) box.textContent=messages[share.dataset.demoShare]||'Готово за споделяне.';
    }

    const action=e.target.closest?.('[data-demo-report],[data-demo-correction],[data-demo-inquiry],[data-demo-site],[data-demo-answer],[data-demo-official],[data-demo-event-info]');
    if(action){
      const box=action.closest('.detail-action')?.querySelector('.action-demo-message');
      let text='';
      if(action.matches('[data-demo-report]')) text='Сигналът е вторично действие и се изпраща към приложимия moderation/report flow.';
      if(action.matches('[data-demo-correction]')) text='Корекцията е за фактическа грешка и използва специализирания correction flow.';
      if(action.matches('[data-demo-inquiry]')) text='Запитването е налично само когато профилът има такъв канал за контакт.';
      if(action.matches('[data-demo-site]')) text='Сайтът се показва само когато профилът има публичен уеб адрес.';
      if(action.matches('[data-demo-answer]')) text='Формата за отговор е водещото действие при въпрос.';
      if(action.matches('[data-demo-official]')) text='Отваря се официалният публичен източник на конкретния Info Lom запис.';
      if(action.matches('[data-demo-event-info]')) text='Дата, час и място са водещите данни за събитието.';
      if(box) box.textContent=text;
    }
  });

  document.addEventListener('submit',e=>{
    const form=e.target.closest?.('[data-proto-form]');
    if(!form) return;
    queueMicrotask(()=>{
      if(form.dataset.submitted!=='true') return;
      form.dataset.dirty='false';
      if(['shop','health'].includes(form.dataset.formKind)){
        const message=form.querySelector('.form-message');
        [...form.children].forEach(child=>{if(child!==message) child.hidden=true;});
      }
    });
  });

  window.addEventListener('hashchange',syncAfterRender);
  syncAfterRender();
})();
