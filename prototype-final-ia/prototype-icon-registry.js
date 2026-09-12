'use strict';

(() => {
  const siteBase='icon-review-assets/site/';
  const accepted=Object.freeze({
    'Цялостни ремонти':Object.freeze({site:`${siteBase}full-renovation.webp`,sharedKey:'full-renovation'}),
    'Бани и плочки':Object.freeze({site:`${siteBase}bathroom-tiles.webp`,sharedKey:'bathroom-tiles'}),
    'ВиК':Object.freeze({site:`${siteBase}plumbing.webp`,sharedKey:'plumbing'}),
    'Електро':Object.freeze({site:`${siteBase}electrical.webp`,sharedKey:'electrical'}),
    'Покриви':Object.freeze({site:`${siteBase}roofing.webp`,sharedKey:'roofing'}),
    'Шпакловка / гипсокартон / боядисване':Object.freeze({site:`${siteBase}wall-finishing.webp`,sharedKey:'wall-finishing'}),
    'Дограма и врати':Object.freeze({site:`${siteBase}joinery.webp`,sharedKey:'joinery'}),
    'Отопление и климатици':Object.freeze({site:`${siteBase}heating-cooling.webp`,sharedKey:'heating-cooling'}),
    'Монтажи и мебели':Object.freeze({site:`${siteBase}furniture-assembly.webp`,sharedKey:'furniture-assembly'}),
    'Къртене и извозване':Object.freeze({site:`${siteBase}demolition-debris.webp`,sharedKey:'demolition-debris'})
  });
  const aliases=Object.freeze({
    'Майстори и ремонти':'Цялостни ремонти'
  });

  function resolve(name=''){
    const exact=String(name||'').trim();
    const canonical=aliases[exact]||exact;
    return accepted[canonical]||null;
  }
  function site(name=''){
    return resolve(name)?.site||'';
  }
  function has(name=''){
    return Boolean(resolve(name));
  }

  window.PopitaiIconRegistry=Object.freeze({accepted,aliases,resolve,site,has});
})();
