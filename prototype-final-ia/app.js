'use strict';

(() => {
  const main=document.getElementById('app-main');
  let lastRenderedHash=location.hash||'#home';

  function viewFor(path,query){
    if(path==='home') return home();
    if(path==='obyavi') return hub(query);
    if(path==='uslugi') return services();
    if(path==='maistori') return masters();
    if(path==='service-group') return serviceGroup(query);
    if(path==='rabota') return work();
    if(path==='imoti') return properties();
    if(path==='stoki') return goods();
    if(path==='avtomobili') return auto();
    if(path==='zhivotni') return animals();
    if(path==='magazini') return shops();
    if(path==='zavedenia') return restaurants();
    if(path==='zdrave') return health();
    if(path==='firmi') return firms(query);
    if(path==='info') return info();
    if(path==='aktualno') return current();
    if(path==='statii') return articles();
    if(path==='vaprosi') return questions();
    if(path==='results') return results(query);
    if(path==='visual-icons') return iconCheckpoint();
    if(path.startsWith('detail/')) return detail(path.split('/')[1],query);
    if(path.startsWith('add/')) return formPage(path.split('/')[1],query);
    if(path==='about') return staticPage('За сайта','Попитай.Лом е местен портал за намиране, публикуване и помощ от общността.');
    if(path==='rules') return staticPage('Правила','Правилата на общността определят какво съдържание може да се публикува и как се преглежда.');
    if(path==='contacts') return staticPage('Контакти','Свържи се с екипа на Попитай.Лом по въпроси за сайта или съдържанието.');
    if(path==='profile') return window.PopitaiInteractions?.profileMarkup?.()||staticPage('Профил','Тук се намират собственото съдържание, редакциите и статусите му.');
    return staticPage('Страницата не е намерена','Този адрес не съществува.');
  }
  function updateNav(path){
    const top=path.split('/')[0];
    document.querySelectorAll('[data-nav]').forEach(link=>{
      link.classList.toggle('active',link.dataset.nav===top||(link.dataset.nav==='obyavi'&&['uslugi','service-group','maistori','rabota','imoti','stoki','avtomobili','zhivotni','magazini','zavedenia','zdrave'].includes(top)));
    });
  }
  function render(){
    const {path,query}=parseHash();
    main.innerHTML=viewFor(path,query);
    updateNav(path);
    window.PopitaiInteractions?.afterRender?.(path,query);
    main.focus({preventScroll:true});
    window.scrollTo({top:0,behavior:'instant'});
  }
  function handleHashChange(){
    const nextHash=location.hash||'#home';
    if(window.PopitaiInteractions&&!window.PopitaiInteractions.beforeRouteChange(nextHash,lastRenderedHash)){
      history.replaceState(null,'',lastRenderedHash);return;
    }
    window.PopitaiInteractions?.closeTransient?.();
    render();
    lastRenderedHash=location.hash||'#home';
  }

  window.addEventListener('hashchange',handleHashChange);
  window.PopitaiRouter=Object.freeze({render,viewFor});
  if(!location.hash) location.hash='#home';
  else {render();lastRenderedHash=location.hash;}
})();
