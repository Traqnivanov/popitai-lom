'use strict';

(async()=>{
  const summary=document.getElementById('summary');
  const results=document.getElementById('results');
  const frame=document.getElementById('target');
  const params=new URLSearchParams(location.search);
  const requestedWidth=Math.max(320,Math.min(1600,Number(params.get('width')||1280)));
  frame.style.width=`${requestedWidth}px`;
  frame.style.height='844px';

  let passed=0,failed=0,win=null,doc=null,confirmQueue=[],confirmCalls=0,mainObserver=null,mainMutations=0;
  const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  function record(ok,label,detail=''){
    const li=document.createElement('li');
    li.className=ok?'ok':'fail';
    li.textContent=`${ok?'PASS':'FAIL'} — ${label}${detail?` — ${detail}`:''}`;
    results.append(li);if(ok)passed+=1;else failed+=1;
  }
  function check(condition,label,detail=''){record(Boolean(condition),label,detail);return Boolean(condition);}
  async function waitFor(test,label,timeout=2500){
    const start=performance.now();
    while(performance.now()-start<timeout){if(test())return true;await sleep(20);}
    record(false,label,'timeout');throw new Error(label);
  }
  function hookConfirm(){
    win.confirm=()=>{confirmCalls+=1;return confirmQueue.length?Boolean(confirmQueue.shift()):true;};
  }
  function setConfirm(...answers){confirmQueue=[...answers];}
  function observeMain(){
    mainObserver?.disconnect();mainMutations=0;
    const main=doc.getElementById('app-main');
    mainObserver=new win.MutationObserver(entries=>{mainMutations+=entries.filter(entry=>entry.target===main&&entry.type==='childList').length;});
    mainObserver.observe(main,{childList:true});
  }
  function resetMainMutations(){mainMutations=0;}
  async function settle(){await sleep(60);}
  async function load(hash='#home'){
    const loaded=new Promise(resolve=>frame.addEventListener('load',resolve,{once:true}));
    frame.src=`index.html${hash}`;
    await loaded;win=frame.contentWindow;doc=frame.contentDocument;hookConfirm();
    await waitFor(()=>Boolean(win.PopitaiRouter&&win.PopitaiInteractions),'runtime bootstrap');
    observeMain();
  }
  async function reload(){
    const loaded=new Promise(resolve=>frame.addEventListener('load',resolve,{once:true}));
    win.location.reload();await loaded;win=frame.contentWindow;doc=frame.contentDocument;hookConfirm();
    await waitFor(()=>Boolean(win.PopitaiRouter&&win.PopitaiInteractions),'runtime reload');
    observeMain();
  }
  function input(selector,value,eventType='input'){
    const el=doc.querySelector(selector);if(!el)throw new Error(`missing ${selector}`);
    if(el.type==='checkbox'||el.type==='radio')el.checked=Boolean(value);else el.value=value;
    el.dispatchEvent(new win.Event(eventType,{bubbles:true,cancelable:true}));
    return el;
  }
  async function waitHash(hash,label){
    await waitFor(()=>win.location.hash===hash&&!win.PopitaiRouter.getState().restoring,label);
    await settle();
  }

  try{
    await load('#home');
    const router=win.PopitaiRouter;
    check(Math.round(win.innerWidth)===requestedWidth,'target viewport width',`${Math.round(win.innerWidth)}px`);
    check(router.getState().hash==='#home','initial route is canonical #home');
    check(router.canonicalHash('')==='#home','empty deep-link canonicalizes to #home');
    check(!win.PopitaiInteractions.activeDirtyForm(),'initial render has no dirty form');
    check(confirmCalls===0,'bootstrap/hydration does not invoke dirty guard');

    const formHash=router.canonicalHash(`#add/listing?${new URLSearchParams({category:'Услуги',subcategory:'ВиК',type:'Дава',discovery:'ВиК'})}`);
    const beforeFormLength=win.history.length;
    resetMainMutations();router.navigate(formHash);await settle();
    check(win.location.hash===formHash,'contextual form route opens canonically');
    check(win.history.length===beforeFormLength+1,'internal accepted route creates one history entry');
    check(mainMutations===1,'internal navigation renders exactly once',`mutations=${mainMutations}`);

    let form=doc.querySelector('[data-proto-form]');
    check(Boolean(form),'listing form is active');
    check(form?.dataset.dirty==='false'&&form?.dataset.submitted==='false','fresh form starts clean and active');
    check(!win.PopitaiInteractions.activeDirtyForm(),'programmatic form hydration stays clean');
    check(doc.querySelector('[name="Заглавие"]')?.placeholder==='Напр. Предлагам ВиК в Лом','placeholder keeps ВиК capitalization');
    check([...doc.querySelectorAll('[data-price-option-items] label')].map(x=>x.textContent.trim()).join(' | ')==='По договаряне | Цена след оглед/запитване','approved Service price context is unchanged');
    check(!doc.getElementById('price-free'),'approved Service price context still has no „Подарява“');

    let title=input('[name="Заглавие"]','Променена ВиК услуга');
    check(form.dataset.dirty==='true','real control change marks form dirty');
    const beforeUnload=new win.Event('beforeunload',{cancelable:true});
    win.dispatchEvent(beforeUnload);
    check(beforeUnload.defaultPrevented,'beforeunload protects a dirty form');

    const cancelLink=doc.querySelector('.form-actions a[href="#home"]');
    const cancelHash=win.location.hash,cancelLength=win.history.length,cancelConfirmStart=confirmCalls;
    setConfirm(false);resetMainMutations();cancelLink.click();
    await waitFor(()=>confirmCalls===cancelConfirmStart+1,'internal Cancel guard fired');await settle();
    check(win.location.hash===cancelHash,'internal Cancel rejection keeps current route');
    check(win.history.length===cancelLength,'internal Cancel rejection creates no history entry');
    check(mainMutations===0,'internal Cancel rejection does not rerender',`mutations=${mainMutations}`);
    check(doc.querySelector('[name="Заглавие"]')?.value==='Променена ВиК услуга','internal Cancel rejection preserves entered value');
    check(win.PopitaiInteractions.activeDirtyForm()===form,'dirty state remains active after rejected leave');

    const acceptLength=win.history.length,acceptConfirmStart=confirmCalls;
    setConfirm(true);resetMainMutations();cancelLink.click();
    await waitHash('#home','internal Cancel accepted navigation');
    check(confirmCalls===acceptConfirmStart+1,'internal Cancel acceptance asks once');
    check(win.history.length===acceptLength+1,'accepted internal leave adds exactly one history entry');
    check(mainMutations===1,'accepted internal leave renders once',`mutations=${mainMutations}`);
    check(!win.PopitaiInteractions.activeDirtyForm(),'accepted leave clears stale dirty state');

    const cleanBackConfirmStart=confirmCalls;
    resetMainMutations();win.history.back();await waitHash(formHash,'clean browser Back to form');
    check(confirmCalls===cleanBackConfirmStart,'clean browser Back has no dirty prompt');
    check(mainMutations===1,'clean browser Back renders once',`mutations=${mainMutations}`);
    form=doc.querySelector('[data-proto-form]');
    check(form?.dataset.dirty==='false','Back-rendered form starts clean');

    title=input('[name="Заглавие"]','Пази ме при Back');form=title.closest('form');
    const backCancelLength=win.history.length,backCancelConfirmStart=confirmCalls;
    setConfirm(false);resetMainMutations();win.history.back();
    await waitFor(()=>confirmCalls===backCancelConfirmStart+1&&win.location.hash===formHash&&!win.PopitaiRouter.getState().restoring,'browser Back cancel restored form');await settle();
    check(win.history.length===backCancelLength,'browser Back cancel does not duplicate history');
    check(mainMutations===0,'browser Back cancel does not rerender form',`mutations=${mainMutations}`);
    check(doc.querySelector('[name="Заглавие"]')?.value==='Пази ме при Back','browser Back cancel preserves entered value');
    check(win.PopitaiInteractions.activeDirtyForm()===form,'browser Back cancel keeps dirty guard active');

    const backAcceptConfirmStart=confirmCalls;
    setConfirm(true);resetMainMutations();win.history.back();await waitHash('#home','browser Back accepted');
    check(confirmCalls===backAcceptConfirmStart+1,'browser Back acceptance asks once');
    check(mainMutations===1,'browser Back acceptance renders once',`mutations=${mainMutations}`);
    check(!win.PopitaiInteractions.activeDirtyForm(),'browser Back acceptance clears dirty state');

    const forwardConfirmStart=confirmCalls;
    resetMainMutations();win.history.forward();await waitHash(formHash,'browser Forward one-press');
    check(confirmCalls===forwardConfirmStart,'Forward to clean form has no prompt');
    check(mainMutations===1,'Forward one-press reaches form with one render',`mutations=${mainMutations}`);
    check(doc.querySelector('[data-proto-form]')?.dataset.dirty==='false','Forward-rendered form is clean');

    const questionHash=router.canonicalHash('#add/question');
    resetMainMutations();router.navigate(questionHash);await settle();
    check(win.location.hash===questionHash,'clean form can navigate to question form');
    check(mainMutations===1,'question navigation renders once',`mutations=${mainMutations}`);

    const questionForm=doc.querySelector('[data-proto-form][data-form-kind="question"]');
    input('[name="Заглавие на въпроса"]','Къде има добра услуга в Лом?');
    input('[name="Категория"]','Обяви','change');
    input('[name="Описание"]','Търся конкретна местна препоръка и полезна информация.');
    input('#community-terms',true,'change');
    check(questionForm.dataset.dirty==='true','valid question becomes dirty before submit');

    const submitLength=win.history.length,submitConfirmStart=confirmCalls;
    resetMainMutations();questionForm.requestSubmit();
    const successHash=router.canonicalHash('#add/question?state=success');
    await waitHash(successHash,'success route replacement');
    check(questionForm.dataset.submitted==='true'&&questionForm.dataset.dirty==='false','successful submit marks old form submitted and clears dirty');
    check(!doc.querySelector('[data-proto-form]'),'success state removes active form');
    const successCard=doc.querySelector('[data-success-card]');
    check(Boolean(successCard),'success state renders dedicated success card');
    check(doc.activeElement===successCard,'success state receives focus');
    check(win.history.length===submitLength,'success replaces current history entry instead of pushing');
    check(mainMutations===1,'success lifecycle rerenders exactly once',`mutations=${mainMutations}`);
    check(confirmCalls===submitConfirmStart,'successful submit does not invoke dirty guard');
    check(!doc.querySelector('button[type="submit"]'),'success state has no submit control');

    const repeatHash=win.location.hash;
    questionForm.dispatchEvent(new win.Event('submit',{bubbles:true,cancelable:true}));await settle();
    check(win.location.hash===repeatHash&&!doc.querySelector('[data-proto-form]'),'detached old form cannot repeat-submit');

    const reloadLength=win.history.length;
    await reload();
    check(win.location.hash===successHash,'refresh preserves success route');
    check(win.history.length===reloadLength,'refresh does not create a success history entry');
    check(!doc.querySelector('[data-proto-form]'),'refresh of success route stays inactive');
    check(doc.activeElement===doc.querySelector('[data-success-card]'),'refreshed success state restores focus to success card');
    check(!win.PopitaiInteractions.activeDirtyForm(),'success refresh has no stale dirty guard');

    const successBackConfirmStart=confirmCalls;
    resetMainMutations();win.history.back();await waitHash(formHash,'Back from success one-press');
    check(confirmCalls===successBackConfirmStart,'Back from success has no stale guard');
    check(mainMutations===1,'Back from success renders previous route once',`mutations=${mainMutations}`);

    resetMainMutations();win.history.forward();await waitHash(successHash,'Forward to success one-press');
    check(mainMutations===1,'Forward one-press restores success state once',`mutations=${mainMutations}`);
    check(!doc.querySelector('[data-proto-form]'),'Forward-restored success state remains inactive');

    const staleGuardStart=confirmCalls;
    router.navigate('#home');await settle();
    check(confirmCalls===staleGuardStart,'navigation after success has no stale dirty prompt');
    check(win.location.hash==='#home','navigation after success works normally');
  }catch(error){
    record(false,'test runner completed',error?.message||String(error));
  }finally{
    mainObserver?.disconnect();
    summary.textContent=failed?`FAIL ${failed} / ${passed+failed}`:`PASS ${passed} / ${passed}`;
    summary.className=failed?'fail':'ok';
    document.title=`${failed?'FAIL':'PASS'} — Stage 2 dirty/history/success browser QA`;
  }
})();
