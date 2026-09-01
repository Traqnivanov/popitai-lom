(()=>{
  'use strict';

  function targetFor(el){
    if(!el) return null;
    const info=el.getAttribute('data-info');
    const route=el.getAttribute('data-route');
    if(info!=='utilities' || route!=='info-detail') return null;
    const text=(el.textContent||'').toLowerCase();
    if(text.includes('вода')) return 'utilities-v9.html#water';
    if(text.includes('ток')) return 'utilities-v9.html#power';
    if(text.includes('куриер')) return 'utilities-v9.html#couriers';
    if(text.includes('интернет')) return 'utilities-v9.html#internet';
    return 'utilities-v9.html';
  }

  document.addEventListener('click',event=>{
    const el=event.target.closest('[data-route="info-detail"][data-info="utilities"]');
    const target=targetFor(el);
    if(!target) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.href=target;
  },true);
})();
