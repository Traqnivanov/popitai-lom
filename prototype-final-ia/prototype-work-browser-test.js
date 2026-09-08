'use strict';

(async()=>{
  const summary=document.getElementById('summary'),results=document.getElementById('results'),frame=document.getElementById('target');
  let passed=0,failed=0,win,doc;
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  function record(ok,label,detail=''){const li=document.createElement('li');li.className=ok?'ok':'fail';li.textContent=`${ok?'PASS':'FAIL'} — ${label}${detail?` — ${detail}`:''}`;results.append(li);ok?passed++:failed++;}
  function check(v,label,detail=''){record(Boolean(v),label,detail);return Boolean(v);}
  async function waitFor(fn,label,timeout=3000){const start=performance.now();while(performance.now()-start<timeout){if(fn())return;await sleep(20);}throw new Error(`${label} timeout`);}
  async function load(width){frame.style.width=`${width}px`;const loaded=new Promise(r=>frame.addEventListener('load',r,{once:true}));frame.src='index.html#rabota';await loaded;win=frame.contentWindow;doc=frame.contentDocument;await waitFor(()=>win.PopitaiRouter&&doc.querySelector('.work-list-page'),'Work bootstrap');await sleep(40);}
  async function settle(){await sleep(60);}
  function visible(el){if(!el||el.hidden)return false;const s=win.getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&s.opacity!=='0'&&el.getClientRects().length>0;}
  function visibleAdds(){return [...doc.querySelectorAll('.work-list-page a,.work-list-page button')].filter(el=>visible(el)&&el.textContent.replace(/\s+/g,' ').includes('Добави обява'));}
  function before(a,b){return Boolean(a&&b&&(a.compareDocumentPosition(b)&win.Node.DOCUMENT_POSITION_FOLLOWING));}
  function click(selector,text=''){const els=[...doc.querySelectorAll(selector)],el=text?els.find(x=>x.textContent.trim()===text):els[0];if(!el)throw new Error(`missing ${selector} ${text}`);el.click();return el;}
  async function run(width,label){
    await load(width);
    check(Math.round(win.innerWidth)===width,`${label}: viewport`,`${Math.round(win.innerWidth)}px`);
    check(win.location.hash==='#rabota',`${label}: direct Work route`);
    check(!doc.querySelector('.work-list-page .family-card'),`${label}: no 9-card intermediate screen`);
    const search=doc.querySelector('[data-work-search]'),tabsBox=doc.querySelector('.work-list-page .tabs'),empty=doc.querySelector('.work-list-page .empty-card');
    const tabs=[...doc.querySelectorAll('.work-list-page .tabs .tab')].map(x=>x.textContent.trim());
    check(Boolean(search),`${label}: search visible`);
    check(JSON.stringify(tabs)===JSON.stringify(['Всички','Предлагат работа','Търсят работа']),`${label}: exactly three type filters`,tabs.join(' | '));
    check(before(doc.querySelector('.work-list-page h1'),search)&&before(search,tabsBox)&&before(tabsBox,empty),`${label}: title → search → types → empty state`);
    check(visibleAdds().length===1,`${label}: one visible Add CTA with zero records`,String(visibleAdds().length));
    check(Boolean(empty?.querySelector('[data-work-add]')),`${label}: zero-record Add is inside empty state`);
    check(!doc.querySelector('[data-work-groups]'),`${label}: directions hidden with zero available records`);
    check(!/известия|уведомления/i.test(doc.querySelector('.work-list-page')?.textContent||''),`${label}: no notifications`);

    win.PopitaiApprovedContent={...(win.PopitaiApprovedContent||{}),workListings:[
      {title:'Шофьор за доставки',description:'Работа в Лом',workType:'Предлага работа',workGroup:'Транспорт, шофьори и доставки',href:'#detail/listing?record=qa-work-1'},
      {title:'Продавач-консултант',description:'Магазин в Лом',workType:'Предлага работа',workGroup:'Търговия и продажби',href:'#detail/listing?record=qa-work-2'},
      {title:'Търся работа като шофьор',description:'Категория B',workType:'Търси работа',workGroup:'Транспорт, шофьори и доставки',href:'#detail/listing?record=qa-work-3'}
    ]};
    win.PopitaiRouter.render();await settle();
    check(doc.querySelectorAll('.work-list-page .result-row').length===3,`${label}: results shown directly`);
    check(visibleAdds().length===1,`${label}: one visible Add CTA with results`,String(visibleAdds().length));
    check(Boolean(doc.querySelector('.work-list-page .page-tools [data-work-add]')),`${label}: result-state Add is with upper controls`);
    let groups=doc.querySelector('[data-work-groups]'),list=doc.querySelector('.work-list-page .result-list');
    check(groups?.tagName==='DETAILS'&&!groups.open,`${label}: direction control compact and closed`);
    check(groups?.querySelector('summary')?.textContent.trim()==='Направление: Всички',`${label}: direction summary defaults to All`);
    check(before(list,groups),`${label}: results precede expanded directions`);
    check([...groups.querySelectorAll('.chip')].filter(visible).length===0,`${label}: directions not permanently expanded`);
    if(width===390)check([...groups.querySelectorAll('.chip')].filter(visible).length===0,`${label}: no mobile direction-chip wall`);

    click('.work-list-page .tabs .tab','Предлагат работа');await settle();
    check(doc.querySelectorAll('.work-list-page .result-row').length===2,`${label}: offer filter works`);
    click('.work-list-page .tabs .tab','Търсят работа');await settle();
    check(doc.querySelectorAll('.work-list-page .result-row').length===1,`${label}: seek filter works`);
    click('.work-list-page .tabs .tab','Всички');await settle();
    const qform=doc.querySelector('[data-work-search]');qform.querySelector('input').value='няма-такъв-запис';qform.dispatchEvent(new win.Event('submit',{bubbles:true,cancelable:true}));await settle();
    check(doc.querySelectorAll('.work-list-page .result-row').length===0,`${label}: search can filter to zero`);
    check(visibleAdds().length===1&&Boolean(doc.querySelector('.empty-card [data-work-add]'))&&!doc.querySelector('.page-tools [data-work-add]'),`${label}: filtered-zero has one Add inside empty state`);
    groups=doc.querySelector('[data-work-groups]');check(before(doc.querySelector('.empty-card'),groups),`${label}: filtered-zero empty state precedes directions`);

    win.PopitaiRouter.navigate('#rabota',{replace:true,skipGuard:true});await settle();groups=doc.querySelector('[data-work-groups]');groups.open=true;
    click('[data-work-groups] .chip','Транспорт, шофьори и доставки');await settle();
    check(doc.querySelectorAll('.work-list-page .result-row').length===2,`${label}: direction filter works`);
    check(doc.querySelector('[data-work-groups] summary')?.textContent.trim()==='Направление: Транспорт, шофьори и доставки',`${label}: selected direction summarized compactly`);
    check(!doc.querySelector('[data-work-groups]')?.open,`${label}: direction filter closes after route render`);

    const filteredHash=win.location.hash;click('[data-work-add]');await settle();
    check(doc.querySelector('#listing-category')?.value==='Работа',`${label}: Add opens unified Work Listing form`);
    check(JSON.stringify([...doc.querySelectorAll('#listing-type option')].map(x=>x.value).filter(Boolean))===JSON.stringify(['Предлага работа','Търси работа']),`${label}: both Work types remain`);
    check(doc.querySelector('#listing-subcategory')?.value==='Транспорт, шофьори и доставки',`${label}: selected direction reaches form`);
    check(doc.querySelector('#listing-subcategory')?.closest('.field')?.querySelector('label')?.textContent.trim()==='Професионално направление',`${label}: Work direction form field unchanged`);
    win.history.back();await waitFor(()=>win.location.hash===filteredHash,`${label}: Back returns to Work context`);await settle();
  }

  try{await run(1280,'desktop');await run(390,'mobile 390px');}
  catch(error){record(false,'test runner completed',error?.message||String(error));}
  summary.textContent=failed?`FAIL ${failed} / ${passed+failed}`:`PASS ${passed} / ${passed}`;
  summary.className=failed?'fail':'ok';document.title=`${failed?'FAIL':'PASS'} — Stage 2 Work UX browser QA`;
})();
