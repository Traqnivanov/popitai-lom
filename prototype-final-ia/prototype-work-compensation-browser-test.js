'use strict';

(async()=>{
  const summary=document.getElementById('summary'),results=document.getElementById('results'),frame=document.getElementById('target');
  let passed=0,failed=0,win,doc;
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  function record(ok,label,detail=''){const li=document.createElement('li');li.className=ok?'ok':'fail';li.textContent=`${ok?'PASS':'FAIL'} — ${label}${detail?` — ${detail}`:''}`;results.append(li);ok?passed++:failed++;}
  function check(v,label,detail=''){record(Boolean(v),label,detail);return Boolean(v);}
  async function waitFor(fn,label,timeout=3500){const start=performance.now();while(performance.now()-start<timeout){if(fn())return true;await sleep(20);}record(false,label,'timeout');throw new Error(label);}
  async function load(width){frame.style.width=`${width}px`;const loaded=new Promise(r=>frame.addEventListener('load',r,{once:true}));frame.src='index.html#add/listing?category='+encodeURIComponent('Работа')+'&type='+encodeURIComponent('Предлага работа');await loaded;win=frame.contentWindow;doc=frame.contentDocument;await waitFor(()=>win.PopitaiRouter&&doc.querySelector('[data-proto-form]'),'runtime form bootstrap');await sleep(50);}
  async function nav(hash){win.PopitaiRouter.navigate(hash,{replace:true,skipGuard:true});await sleep(50);}
  function form(){return doc.querySelector('[data-proto-form]');}
  function setValue(selector,value,event='change'){const el=doc.querySelector(selector);if(!el)throw new Error(`missing ${selector}`);el.value=value;el.dispatchEvent(new win.Event(event,{bubbles:true,cancelable:true}));return el;}
  function setChecked(selector,value){const el=doc.querySelector(selector);if(!el)throw new Error(`missing ${selector}`);el.checked=value;el.dispatchEvent(new win.Event('change',{bubbles:true,cancelable:true}));return el;}
  function fillRequired(){const f=form();const title=f.querySelector('[name="Заглавие"]'),desc=f.querySelector('[name="Описание"]'),phone=f.querySelector('[name="Телефон"]'),terms=f.querySelector('#community-terms');if(title)title.value='Шофьор за доставки';if(desc)desc.value='Търсим човек за доставки и работа в Лом.';if(phone)phone.value='0876 123 456';if(terms)terms.checked=true;}
  function submit(){const f=form();f.dispatchEvent(new win.Event('submit',{bubbles:true,cancelable:true}));}
  function priceLabel(){return doc.querySelector('label[data-price-label]')?.textContent.trim()||'';}
  function periodOptions(){return [...doc.querySelectorAll('#work-compensation-period option')].filter(x=>x.value).map(x=>x.textContent.trim());}
  function optionLabels(){return [...doc.querySelectorAll('[data-price-option-items] label')].map(x=>x.textContent.trim().replace(/\s+/g,' '));}
  async function fresh(type='Предлага работа'){await nav('#add/listing?category='+encodeURIComponent('Работа')+'&type='+encodeURIComponent(type));}

  async function run(width,label){
    await load(width);
    check(Math.round(win.innerWidth)===width,`${label}: viewport`,`${Math.round(win.innerWidth)}px`);
    check(priceLabel()==='Предлагано възнаграждение в евро (по желание)',`${label}: offer compensation label`,priceLabel());
    check(JSON.stringify(periodOptions())===JSON.stringify(['на час','на ден','на месец','за задача']),`${label}: four Work periods`,periodOptions().join(' | '));
    check(Boolean(doc.querySelector('#price-negotiable')),`${label}: negotiable preserved`);
    check(!doc.querySelector('[data-work-persistence-note]')||win.getComputedStyle(doc.querySelector('[data-work-persistence-note]')).display==='none'||win.getComputedStyle(doc.querySelector('.qa-only')).display==='none',`${label}: persistence marker outside user screen`);

    const values=['hour','day','month','task'];
    for(const value of values){await fresh();setValue('#listing-price','25','input');setValue('#work-compensation-period',value);check(win.PopitaiValidators.validateWorkCompensation(form())===null,`${label}: amount + ${value} valid`);}

    await fresh();fillRequired();setValue('#listing-price','40','input');const preservedDesc=form().querySelector('[name="Описание"]').value;submit();await sleep(30);
    check(doc.activeElement?.id==='work-compensation-period',`${label}: amount without period focuses period`,doc.activeElement?.id||'');
    check(doc.querySelector('#work-compensation-period-error')?.textContent.includes('Избери период'),`${label}: amount without period error beside period`);
    check(doc.querySelector('#listing-price')?.value==='40'&&form().querySelector('[name="Описание"]')?.value===preservedDesc,`${label}: invalid submit preserves entered data`);

    await fresh();fillRequired();setValue('#work-compensation-period','day');submit();await sleep(30);
    check(doc.activeElement?.id==='listing-price',`${label}: period without amount focuses amount`,doc.activeElement?.id||'');
    check(doc.querySelector('#listing-price-error')?.textContent.includes('Въведи сума'),`${label}: period without amount error beside amount`);
    check(doc.querySelector('#work-compensation-period')?.value==='day',`${label}: period preserved after validation error`);

    await fresh();setValue('#listing-price','55','input');setValue('#work-compensation-period','month');setChecked('#price-negotiable',true);
    check(doc.querySelector('#listing-price')?.value===''&&doc.querySelector('#work-compensation-period')?.value==='',`${label}: negotiable clears amount and period`);
    check(doc.querySelector('#listing-price')?.disabled&&doc.querySelector('#work-compensation-period')?.disabled,`${label}: negotiable disables amount and period`);
    setChecked('#price-negotiable',false);check(!doc.querySelector('#listing-price')?.disabled&&!doc.querySelector('#work-compensation-period')?.disabled,`${label}: unchecking negotiable re-enables controls`);

    await fresh();setValue('#listing-price','60','input');setValue('#work-compensation-period','month');setValue('#listing-type','Търси работа');
    check(priceLabel()==='Желано възнаграждение в евро (по желание)',`${label}: seek compensation label`,priceLabel());
    check(doc.querySelector('#listing-price')?.value==='60'&&doc.querySelector('#work-compensation-period')?.value==='month',`${label}: type switch preserves amount and period`);
    setValue('#listing-type','Предлага работа');check(priceLabel()==='Предлагано възнаграждение в евро (по желание)',`${label}: label switches back without reset`);
    check(doc.querySelector('#listing-price')?.value==='60'&&doc.querySelector('#work-compensation-period')?.value==='month',`${label}: reverse type switch preserves values`);

    setValue('#listing-category','Имоти');check(doc.querySelector('[data-work-period-field]')?.hidden===true&&doc.querySelector('#work-compensation-period')?.value==='',`${label}: Work → property clears/hides period`);
    setValue('#listing-category','Работа');check(doc.querySelector('[data-work-period-field]')?.hidden===false&&doc.querySelector('#work-compensation-period')?.value==='',`${label}: returning to Work starts with clean period state`);

    win.PopitaiCore.editFixtures['listing:legacy-work-no-period']={'Заглавие':'Стара обява за работа','Категория':'Работа','Подкатегория / вид':'Транспорт, шофьори и доставки','Тип обява':'Предлага работа','Описание':'Стар запис за работа без период на възнаграждението.','Цена в евро':'900','Телефон':'0876 123 456','Град / район':'Лом','Улица (по желание)':''};
    await nav('#add/listing?state=edit&record=legacy-work-no-period');
    check(form()?.dataset.workPeriodLegacy==='true'&&doc.querySelector('#listing-price')?.value==='900'&&doc.querySelector('#work-compensation-period')?.value==='',`${label}: legacy Work edit opens without period`);
    const legacyTerms=doc.querySelector('#community-terms');if(legacyTerms)legacyTerms.checked=true;submit();await sleep(40);
    check(Boolean(doc.querySelector('[data-success-card]'))||win.location.hash.includes('state=success'),`${label}: unchanged legacy Work edit is not blocked by missing period`);

    const contexts=[
      ['Услуги','service','Цена в евро',['По договаряне','Цена след оглед/запитване']],
      ['Електроника','goods','Цена в евро',['По договаряне','Подарява (безплатно)']],
      ['Имоти','property','Цена / наем в евро',['По договаряне']],
      ['Автомобили и МПС','vehicle','Цена в евро',['По договаряне']],
      ['Животни','animal','Цена в евро',['По договаряне']]
    ];
    for(const [category,key,expectedLabel,opts] of contexts){await nav('#add/listing?category='+encodeURIComponent(category));const fieldset=doc.querySelector('[data-price-options]');check(fieldset?.dataset.priceContext===key&&priceLabel()===expectedLabel,`${label}: ${category} price context unchanged`);check(JSON.stringify(optionLabels())===JSON.stringify(opts),`${label}: ${category} price options unchanged`,optionLabels().join(' | '));check(doc.querySelector('[data-work-period-field]')?.hidden===true&&doc.querySelector('#work-compensation-period')?.disabled===true,`${label}: ${category} has no Work period UI`);}

    await nav('#rabota');const workPage=doc.querySelector('.work-list-page');check(Boolean(workPage),`${label}: accepted #rabota still renders`);check(!doc.querySelector('[data-work-groups]')&&doc.querySelectorAll('.work-list-page [data-work-add]').length===1,`${label}: accepted zero-record Work UX unchanged`);
    const tabs=[...doc.querySelectorAll('.work-list-page .tabs .tab')].map(x=>x.textContent.trim());check(JSON.stringify(tabs)===JSON.stringify(['Всички','Предлагат работа','Търсят работа']),`${label}: accepted Work type filters unchanged`);
  }

  try{await run(1280,'desktop');await run(390,'mobile 390px');}catch(error){record(false,'test runner completed',error?.message||String(error));}
  summary.textContent=failed?`FAIL ${failed} / ${passed+failed}`:`PASS ${passed} / ${passed}`;summary.className=failed?'fail':'ok';document.title=`${failed?'FAIL':'PASS'} — Stage 2 Work compensation browser QA`;
})();
