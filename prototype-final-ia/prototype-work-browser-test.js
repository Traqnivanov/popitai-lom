'use strict';

(async()=>{
  const summary=document.getElementById('summary');
  const results=document.getElementById('results');
  const frame=document.getElementById('target');
  let passed=0,failed=0,win=null,doc=null;
  const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  function record(ok,label,detail=''){
    const li=document.createElement('li');li.className=ok?'ok':'fail';li.textContent=`${ok?'PASS':'FAIL'} — ${label}${detail?` — ${detail}`:''}`;results.append(li);if(ok)passed++;else failed++;
  }
  function check(value,label,detail=''){record(Boolean(value),label,detail);return Boolean(value);}
  async function waitFor(test,label,timeout=3000){const start=performance.now();while(performance.now()-start<timeout){if(test())return true;await sleep(20);}record(false,label,'timeout');throw new Error(label);}
  async function load(width){
    frame.style.width=`${width}px`;
    const loaded=new Promise(resolve=>frame.addEventListener('load',resolve,{once:true}));
    frame.src='index.html#rabota';
    await loaded;win=frame.contentWindow;doc=frame.contentDocument;
    await waitFor(()=>Boolean(win.PopitaiRouter&&doc.querySelector('.work-list-page')),'runtime Work route bootstrap');
    await sleep(50);
  }
  async function waitHash(predicate,label){await waitFor(()=>predicate(win.location.hash),label);await sleep(40);}
  function click(selector,text=''){
    const items=[...doc.querySelectorAll(selector)];const el=text?items.find(x=>x.textContent.trim()===text):items[0];if(!el)throw new Error(`missing ${selector} ${text}`);el.click();return el;
  }
  function setValue(selector,value,event='change'){
    const el=doc.querySelector(selector);if(!el)throw new Error(`missing ${selector}`);el.value=value;el.dispatchEvent(new win.Event(event,{bubbles:true,cancelable:true}));return el;
  }
  async function run(width,label){
    await load(width);
    check(Math.round(win.innerWidth)===width,`${label}: viewport width`,`${Math.round(win.innerWidth)}px`);
    check(win.location.hash==='#rabota',`${label}: direct #rabota opening`);
    check(!doc.querySelector('.work-list-page .family-card'),`${label}: no 9-card intermediate screen`);
    check(Boolean(doc.querySelector('[data-work-search]')),`${label}: Work search visible`);
    const tabs=[...doc.querySelectorAll('.work-list-page .tabs .tab')].map(x=>x.textContent.trim());
    check(JSON.stringify(tabs)===JSON.stringify(['Всички','Предлагат работа','Търсят работа']),`${label}: exactly three compact filters`,tabs.join(' | '));
    check(doc.querySelectorAll('[data-work-add]').length===1,`${label}: one top Add button`);
    check(doc.body.textContent.includes('Няма активни обяви за работа'),`${label}: honest empty state`);
    check(!/известия|уведомления/i.test(doc.querySelector('.work-list-page')?.textContent||''),`${label}: no notification feature`);
    check(doc.querySelectorAll('[data-work-groups] .chip').length===10,`${label}: professional directions kept as compact filters`);

    // Search updates the same Work list route.
    const search=doc.querySelector('[data-work-search]');
    search.querySelector('input[name="q"]').value='шофьор';
    search.dispatchEvent(new win.Event('submit',{bubbles:true,cancelable:true}));
    await waitHash(hash=>hash.startsWith('#rabota?')&&decodeURIComponent(hash).includes('q=шофьор'),`${label}: search route`);
    check(doc.querySelector('[data-work-search] input').value==='шофьор',`${label}: search value survives render`);

    // Type filter preserves search context.
    click('.work-list-page .tabs .tab','Предлагат работа');
    await waitHash(hash=>decodeURIComponent(hash).includes('type=Предлага+работа')||decodeURIComponent(hash).includes('type=Предлага работа'),`${label}: offer filter route`);
    check(doc.querySelector('.work-list-page .tabs .tab.active')?.textContent.trim()==='Предлагат работа',`${label}: offer filter active`);

    // Add opens the existing unified Listing form, with both Work types and a Work direction field.
    const resultsHash=win.location.hash;
    click('[data-work-add]');
    await waitHash(hash=>hash.startsWith('#add/listing?'),`${label}: Add opens Listing form`);
    check(doc.querySelector('#listing-category')?.value==='Работа',`${label}: Listing category is Work`);
    const typeValues=[...doc.querySelectorAll('#listing-type option')].map(x=>x.value).filter(Boolean);
    check(JSON.stringify(typeValues)===JSON.stringify(['Предлага работа','Търси работа']),`${label}: Add supports both Work types`,typeValues.join(' | '));
    const direction=doc.querySelector('#listing-subcategory');
    check(Boolean(direction)&&!direction.disabled&&!direction.closest('.field')?.hidden,`${label}: professional direction is a visible existing form field`);
    check(direction?.closest('.field')?.querySelector('label')?.textContent.trim()==='Професионално направление',`${label}: Work direction label`);
    check([...direction.options].filter(x=>x.value).length===9,`${label}: all nine directions are choices, not entry cards`);
    setValue('#listing-type','Предлага работа');check(doc.querySelector('#listing-type').value==='Предлага работа',`${label}: can choose offer type`);
    setValue('#listing-type','Търси работа');check(doc.querySelector('#listing-type').value==='Търси работа',`${label}: can choose seek type`);
    setValue('#listing-subcategory','Транспорт, шофьори и доставки');
    check(doc.querySelector('#listing-subcategory')?.value==='Транспорт, шофьори и доставки',`${label}: direction remains selected after real change event`);
    check(doc.querySelector('[data-proto-form]')?.dataset.discoveryContext==='Транспорт, шофьори и доставки',`${label}: direction updates UX discovery context`);

    // Scoped technical regression: switching category away/back keeps Work field usable.
    setValue('#listing-category','Имоти');
    check(doc.querySelector('#listing-subcategory-field')?.hidden===true,`${label}: direction field hides outside Work/Services`);
    setValue('#listing-category','Работа');
    check(doc.querySelector('#listing-subcategory-field')?.hidden===false&&!doc.querySelector('#listing-subcategory')?.disabled,`${label}: direction field returns on Work category`);
    check([...doc.querySelectorAll('#listing-subcategory option')].filter(x=>x.value).length===9,`${label}: directions repopulate after category round-trip`);

    // Cancel returns to exact Work result/search/filter context supplied by Add.
    const cancel=[...doc.querySelectorAll('.form-actions a')].find(x=>x.textContent.trim()==='Отказ');
    check(Boolean(cancel),`${label}: form has Cancel return action`);
    cancel?.click();
    await waitHash(hash=>hash===resultsHash,`${label}: return to exact Work results context`);

    // QA-only records exercise filtering/search without shipping simulated runtime content.
    win.PopitaiApprovedContent={...(win.PopitaiApprovedContent||{}),workListings:[
      {title:'Шофьор за доставки',description:'Работа в Лом',workType:'Предлага работа',workGroup:'Транспорт, шофьори и доставки',href:'#detail/listing?record=qa-work-1'},
      {title:'Продавач-консултант',description:'Магазин в Лом',workType:'Предлага работа',workGroup:'Търговия и продажби',href:'#detail/listing?record=qa-work-2'},
      {title:'Търся работа като шофьор',description:'Категория B',workType:'Търси работа',workGroup:'Транспорт, шофьори и доставки',href:'#detail/listing?record=qa-work-3'}
    ]};
    win.PopitaiRouter.navigate('#rabota',{replace:true,skipGuard:true});await sleep(50);
    check(doc.querySelectorAll('.work-list-page .result-row').length===3,`${label}: all active QA records shown directly`);
    click('.work-list-page .tabs .tab','Предлагат работа');await sleep(50);
    check(doc.querySelectorAll('.work-list-page .result-row').length===2,`${label}: offer filter filters records`);
    click('.work-list-page .tabs .tab','Търсят работа');await sleep(50);
    check(doc.querySelectorAll('.work-list-page .result-row').length===1,`${label}: seek filter filters records`);
    click('.work-list-page .tabs .tab','Всички');await sleep(40);
    const qform=doc.querySelector('[data-work-search]');qform.querySelector('input').value='продавач';qform.dispatchEvent(new win.Event('submit',{bubbles:true,cancelable:true}));await sleep(50);
    check(doc.querySelectorAll('.work-list-page .result-row').length===1,`${label}: search filters active records`);
    win.PopitaiRouter.navigate('#rabota',{replace:true,skipGuard:true});await sleep(40);
    click('[data-work-groups] .chip','Транспорт, шофьори и доставки');await sleep(50);
    check(doc.querySelectorAll('.work-list-page .result-row').length===2,`${label}: direction filter filters active records`);

    // Add from a direction keeps direction in the form and browser Back returns to the list.
    const filteredHash=win.location.hash;click('[data-work-add]');await sleep(50);
    check(doc.querySelector('#listing-subcategory')?.value==='Транспорт, шофьори и доставки',`${label}: Add carries selected direction into unified form`);
    win.history.back();await waitHash(hash=>hash===filteredHash,`${label}: browser Back returns to Work results`);
  }

  try{
    await run(1280,'desktop');
    await run(390,'mobile 390px');
  }catch(error){record(false,'test runner completed',error?.message||String(error));}
  summary.textContent=failed?`FAIL ${failed} / ${passed+failed}`:`PASS ${passed} / ${passed}`;
  summary.className=failed?'fail':'ok';
  document.title=`${failed?'FAIL':'PASS'} — Stage 2 Work UX browser QA`;
})();
