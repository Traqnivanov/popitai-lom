'use strict';

(() => {
  const contract=window.PopitaiStage2Contracts;
  if(!contract) return;

  function escapeOption(value=''){
    return String(value)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('"','&quot;');
  }

  function optionHtml(values,current=''){
    return '<option value="">Избери</option>'+values.map(value=>
      `<option value="${escapeOption(value)}" ${value===current?'selected':''}>${escapeOption(value)}</option>`
    ).join('');
  }

  function listingHints(category,type,subcategory){
    if(category==='Услуги') {
      return type==='Търси'
        ? ['Напр. Търся изпълнител за конкретна услуга в Лом','Опиши какво трябва да се направи, район, срок и важни условия.']
        : ['Напр. Предлагам конкретна услуга в Лом','Опиши какво извършваш, район, срокове и важни условия.'];
    }
    if(category==='Работа') {
      return type==='Търси работа'
        ? ['Напр. Търся работа като шофьор в Лом','Опиши опит, квалификация, наличност и каква работа търсиш.']
        : ['Напр. Търсим шофьор за доставки в Лом','Опиши длъжност, график, изисквания и условия.'];
    }
    if(category==='Имоти') return ['Напр. Двустаен апартамент в Лом','Опиши вида на имота, район, състояние и важни условия за сделката.'];
    if(category==='Автомобили и МПС') {
      return subcategory==='Части, гуми и аксесоари'
        ? ['Напр. Комплект зимни гуми за автомобил','Опиши състояние, размер/съвместимост и важни детайли.']
        : ['Напр. Автомобил в Лом','Опиши марка, модел, година, състояние и важни подробности.'];
    }
    if(category==='Животни') {
      if(subcategory==='Осиновяване / търси дом') return ['Напр. Котка търси дом в Лом','Опиши животното, възраст, характер и условията за осиновяване.'];
      if(subcategory==='Изгубени') return ['Напр. Изгубено куче в Лом','Опиши кога и къде е изгубено, отличителни белези и контакт.'];
      if(subcategory==='Намерени') return ['Напр. Намерено куче в Лом','Опиши кога и къде е намерено и отличителните белези.'];
      return ['Напр. Храна или аксесоар за домашен любимец','Опиши стоката, състоянието и важните подробности.'];
    }
    return ['Напр. Продавам запазен велосипед в Лом','Опиши състояние, размери, важни особености и условия.'];
  }

  function syncListingForm({preserve=true}={}){
    const category=document.getElementById('listing-category');
    const subcategory=document.getElementById('listing-subcategory');
    const subcategoryField=document.getElementById('listing-subcategory-field');
    const type=document.getElementById('listing-type');
    if(!category||!subcategory||!subcategoryField||!type) return;

    const categoryValue=category.value;
    const previousSubcategory=preserve?subcategory.value:'';
    const subcategories=contract.listingSubcategories(categoryValue);
    const nextSubcategory=subcategories.includes(previousSubcategory)?previousSubcategory:'';

    subcategory.innerHTML=optionHtml(subcategories,nextSubcategory);
    subcategory.value=nextSubcategory;
    subcategoryField.hidden=!subcategories.length;
    subcategory.disabled=!subcategories.length;
    subcategory.required=Boolean(subcategories.length);

    const previousType=preserve?type.value:'';
    const allowedTypes=contract.listingTypes(categoryValue,nextSubcategory);
    const forcedType=categoryValue==='Животни'?(contract.animalTypeBySubcategory[nextSubcategory]||''):'';
    const nextType=forcedType||(allowedTypes.includes(previousType)?previousType:'');

    type.innerHTML=optionHtml(allowedTypes,nextType);
    type.value=nextType;

    const animalWarning=document.getElementById('animal-warning');
    if(animalWarning) animalWarning.hidden=categoryValue!=='Животни';

    const form=category.closest('form');
    const title=form?.querySelector('input[type="text"]');
    const description=form?.querySelector('textarea');
    const hints=listingHints(categoryValue,type.value,nextSubcategory);
    if(title&&!title.value) title.placeholder=hints[0];
    if(description&&!description.value) description.placeholder=hints[1];
  }

  function syncQuestionHints(){
    const form=document.querySelector('[data-proto-form][data-form-kind="question"]');
    if(!form) return;
    const category=form.querySelector('select');
    const title=form.querySelector('input[type="text"]');
    const description=form.querySelector('textarea');
    if(!category||!title||!description) return;

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
    const pair=examples[category.value]||['Напр. Кой може да помогне с това в Лом?','Опиши ясно какво търсиш и какъв отговор би ти бил полезен.'];
    if(!title.value) title.placeholder=pair[0];
    if(!description.value) description.placeholder=pair[1];
  }

  document.addEventListener('change',event=>{
    if(event.target.id==='listing-category') syncListingForm({preserve:false});
    if(event.target.id==='listing-subcategory'||event.target.id==='listing-type') syncListingForm({preserve:true});
    if(event.target.closest?.('[data-proto-form][data-form-kind="question"]')) syncQuestionHints();

    const form=event.target.closest?.('[data-proto-form]');
    if(form) form.dataset.dirty='true';
  });

  document.addEventListener('input',event=>{
    const form=event.target.closest?.('[data-proto-form]');
    if(form) form.dataset.dirty='true';
  });

  document.addEventListener('click',event=>{
    const cancel=event.target.closest?.('[data-proto-form] a[href="#home"]');
    if(cancel){
      const form=cancel.closest('[data-proto-form]');
      if(form?.dataset.dirty==='true'&&form.dataset.submitted!=='true'){
        const shouldClose=window.confirm('Има неизпратени данни. Затварянето ще ги изчисти. Да продължа ли?');
        if(!shouldClose) event.preventDefault();
      }
    }

    const share=event.target.closest?.('[data-demo-share]');
    if(share){
      const message=share.closest('.share-menu')?.querySelector('.share-demo-message');
      const messages={
        native:'На телефон ще се отвори системното меню за споделяне.',
        facebook:'Facebook ще използва постоянния адрес и неговия преглед при споделяне.',
        copy:'Постоянният линк е копиран. (Прототип — няма реално копиране.)'
      };
      if(message) message.textContent=messages[share.dataset.demoShare]||'Готово за споделяне.';
    }

    const action=event.target.closest?.('[data-demo-report],[data-demo-correction],[data-demo-inquiry],[data-demo-site],[data-demo-answer],[data-demo-official],[data-demo-event-info]');
    if(action){
      const message=action.closest('.detail-action')?.querySelector('.action-demo-message');
      let text='';
      if(action.matches('[data-demo-report]')) text='Сигналът се изпраща за преглед според правилата за този тип съдържание.';
      if(action.matches('[data-demo-correction]')) text='Корекцията е за фактическа грешка и се изпраща за проверка.';
      if(action.matches('[data-demo-inquiry]')) text='Запитването е налично само когато профилът има такъв канал за контакт.';
      if(action.matches('[data-demo-site]')) text='Сайтът се показва само когато профилът има публичен уеб адрес.';
      if(action.matches('[data-demo-answer]')) text='Формата за отговор е водещото действие при въпрос.';
      if(action.matches('[data-demo-official]')) text='Отваря се официалният публичен източник на конкретния запис в Инфо Лом.';
      if(action.matches('[data-demo-event-info]')) text='Дата, час и място са водещите данни за събитието.';
      if(message) message.textContent=text;
    }
  });

  document.addEventListener('submit',event=>{
    const form=event.target.closest?.('[data-proto-form]');
    if(!form) return;
    queueMicrotask(()=>{
      if(form.dataset.submitted!=='true') return;
      form.dataset.dirty='false';
      if(['shop','health'].includes(form.dataset.formKind)){
        const message=form.querySelector('.form-message');
        [...form.children].forEach(child=>{
          if(child!==message) child.hidden=true;
        });
      }
    });
  });
})();
