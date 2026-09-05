'use strict';

(() => {
  const main=document.getElementById('app-main');
  const addLayer=document.getElementById('add-layer');
  const backgroundSelectors=['.site-header','.prototype-strip','#app-main','.site-footer','.mobile-bottom'];
  let lastRenderedHash=location.hash||'#home';
  let modalOpener=null;
  let previousBodyOverflow='';

  function render(){
    const {path,query}=parseHash();
    let html='';
    if(path==='home') html=home();
    else if(path==='obyavi') html=hub(query);
    else if(path==='uslugi') html=services();
    else if(path==='maistori') html=masters();
    else if(path==='service-group') html=serviceGroup(query);
    else if(path==='rabota') html=work();
    else if(path==='imoti') html=properties();
    else if(path==='stoki') html=goods();
    else if(path==='avtomobili') html=auto();
    else if(path==='zhivotni') html=animals();
    else if(path==='magazini') html=shops();
    else if(path==='zavedenia') html=restaurants();
    else if(path==='zdrave') html=health();
    else if(path==='firmi') html=firms(query);
    else if(path==='info') html=info();
    else if(path==='aktualno') html=current();
    else if(path==='statii') html=articles();
    else if(path==='vaprosi') html=questions();
    else if(path==='results') html=results(query);
    else if(path==='visual-icons') html=iconCheckpoint();
    else if(path.startsWith('detail/')) html=detail(path.split('/')[1],query);
    else if(path.startsWith('add/')) html=formPage(path.split('/')[1],query);
    else if(path==='about') html=staticPage('За сайта','Попитай.Лом е местен портал за намиране, публикуване и помощ от общността.');
    else if(path==='rules') html=staticPage('Правила','Правилата на общността определят какво съдържание може да се публикува и как се преглежда.');
    else if(path==='contacts') html=staticPage('Контакти','Свържи се с екипа на Попитай.Лом по въпроси за сайта или съдържанието.');
    else if(path==='profile') html=staticPage('Профил','Тук се намират собственото съдържание, редакциите и статусите му.');
    else html=staticPage('Страницата не е намерена','Този адрес не съществува.');

    main.innerHTML=html;
    main.focus({preventScroll:true});
    updateNav(path);
    window.scrollTo({top:0,behavior:'instant'});
  }

  function updateNav(path){
    const top=path.split('/')[0];
    document.querySelectorAll('[data-nav]').forEach(link=>{
      link.classList.toggle('active',link.dataset.nav===top||(link.dataset.nav==='obyavi'&&['uslugi','service-group','maistori','rabota','imoti','stoki','avtomobili','zhivotni','magazini','zavedenia','zdrave'].includes(top)));
    });
  }

  function setBackgroundInert(value){
    backgroundSelectors.forEach(selector=>{
      const element=document.querySelector(selector);
      if(!element) return;
      element.inert=value;
      if(value) element.setAttribute('aria-hidden','true');
      else element.removeAttribute('aria-hidden');
    });
  }

  function focusableInModal(){
    return [...addLayer.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')]
      .filter(element=>!element.hidden&&element.getClientRects().length>0);
  }

  function openAdd(opener){
    if(!addLayer.hidden) return;
    modalOpener=opener instanceof HTMLElement?opener:document.activeElement;
    previousBodyOverflow=document.body.style.overflow;
    addLayer.hidden=false;
    document.body.style.overflow='hidden';
    setBackgroundInert(true);
    const focusables=focusableInModal();
    (focusables[0]||addLayer.querySelector('.modal-card'))?.focus();
  }

  function closeAdd({restoreFocus=true}={}){
    if(addLayer.hidden) return;
    addLayer.hidden=true;
    setBackgroundInert(false);
    document.body.style.overflow=previousBodyOverflow;
    if(restoreFocus&&modalOpener instanceof HTMLElement&&document.contains(modalOpener)){
      modalOpener.focus({preventScroll:true});
    }
    modalOpener=null;
  }

  function trapModalFocus(event){
    if(addLayer.hidden||event.key!=='Tab') return;
    const focusables=focusableInModal();
    if(!focusables.length){
      event.preventDefault();
      addLayer.querySelector('.modal-card')?.focus();
      return;
    }
    const first=focusables[0];
    const last=focusables.at(-1);
    if(event.shiftKey&&document.activeElement===first){
      event.preventDefault();
      last.focus();
    }else if(!event.shiftKey&&document.activeElement===last){
      event.preventDefault();
      first.focus();
    }
  }

  document.addEventListener('click',event=>{
    const opener=event.target.closest('[data-open-add]');
    if(opener){
      event.preventDefault();
      openAdd(opener);
      return;
    }
    if(event.target.closest('[data-close-add]')){
      closeAdd();
      return;
    }
    if(event.target===addLayer){
      closeAdd();
      return;
    }

    const propertyTab=event.target.closest('[data-property-type]');
    if(propertyTab){
      window.propertyType=propertyTab.dataset.propertyType||window.propertyType;
      propertyTab.parentElement.querySelectorAll('.tab').forEach(tab=>tab.classList.toggle('active',tab===propertyTab));
      document.querySelectorAll('[data-property-kind]').forEach(card=>{
        card.href=propertyResultsHref(card.dataset.propertyKind||'');
      });
      const add=document.querySelector('[data-property-add]');
      if(add) add.href=PopitaiStage2Contracts.listingAddUrl({category:'Имоти',type:window.propertyType});
    }

    const contact=event.target.closest('[data-demo-contact]');
    if(contact){
      const msg=contact.parentElement.querySelector('.contact-demo-message');
      if(msg) msg.textContent='Прототипът не съдържа реален телефон или лични данни.';
    }
  });

  document.addEventListener('keydown',event=>{
    if(!addLayer.hidden){
      if(event.key==='Escape'){
        event.preventDefault();
        closeAdd();
        return;
      }
      trapModalFocus(event);
    }
  });

  document.addEventListener('submit',event=>{
    if(event.target.matches('[data-global-search],[data-page-search]')){
      event.preventDefault();
      const q=new FormData(event.target).get('q')?.toString().toLocaleLowerCase('bg-BG').trim()||'';
      const serviceMatch=serviceSearchMatch(q);
      if(serviceMatch){
        location.hash=serviceResultsHref(serviceMatch);
        return;
      }
      const route=/работ|шофьор|продавач/.test(q)?'rabota':/апартамент|къща|имот|парцел|наем/.test(q)?'imoti':/кола|автомоб|част/.test(q)?'avtomobili':/кот|куче|живот/.test(q)?'zhivotni':'obyavi';
      location.hash=`#${route}`;
      return;
    }

    if(event.target.matches('[data-proto-form]')){
      event.preventDefault();
      const form=event.target;
      if(form.dataset.submitted==='true') return;
      const valid=window.validatePrototypeForm?window.validatePrototypeForm(form):form.checkValidity();
      if(!valid) return;

      form.dataset.submitted='true';
      form.dataset.dirty='false';
      const submit=form.querySelector('button[type="submit"]');
      if(submit) submit.disabled=true;
      const kind=form.dataset.formKind;
      const title=kind==='health'?'Изпратено за одобрение.':'Успешно изпратено за преглед.';
      form.innerHTML=`<div class="notice ok" tabindex="-1" data-success-card><strong>${title}</strong><p>Това е прототип и не е създаден реален запис. Повторен submit от същия lifecycle не е възможен.</p><a class="btn" href="#home">Към началото</a></div>`;
      form.querySelector('[data-success-card]')?.focus();
    }
  });

  function handleHashChange(){
    const nextHash=location.hash||'#home';
    if(window.confirmPrototypeNavigation&&!window.confirmPrototypeNavigation(nextHash,lastRenderedHash)){
      history.replaceState(null,'',lastRenderedHash);
      return;
    }
    closeAdd({restoreFocus:false});
    render();
    lastRenderedHash=location.hash||'#home';
  }

  window.addEventListener('hashchange',handleHashChange);
  window.PopitaiPrototypeModal=Object.freeze({openAdd,closeAdd});

  if(!location.hash) location.hash='#home';
  else {
    render();
    lastRenderedHash=location.hash;
  }
})();