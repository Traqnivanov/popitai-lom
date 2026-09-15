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
    'Къртене и извозване':Object.freeze({site:`${siteBase}demolition-debris.webp`,sharedKey:'demolition-debris'}),
    'Автосервиз':Object.freeze({site:`${siteBase}auto-service.webp`,sharedKey:'auto-service'}),
    'Диагностика':Object.freeze({site:`${siteBase}auto-diagnostics.webp`,sharedKey:'auto-diagnostics'}),
    'Гуми':Object.freeze({site:`${siteBase}tires.webp`,sharedKey:'tires'}),
    'Автоелектро и автоклиматици':Object.freeze({site:`${siteBase}auto-electrical-climate.webp`,sharedKey:'auto-electrical-climate'}),
    'Автомивка и детайлинг':Object.freeze({site:`${siteBase}car-wash-detailing.webp`,sharedKey:'car-wash-detailing'}),
    'Пътна помощ':Object.freeze({site:`${siteBase}roadside-assistance.webp`,sharedKey:'roadside-assistance'}),
    'Почистване':Object.freeze({site:`${siteBase}home-cleaning.webp`,sharedKey:'home-cleaning'}),
    'Пране на мека мебел и килими':Object.freeze({site:`${siteBase}upholstery-cleaning.webp`,sharedKey:'upholstery-cleaning'}),
    'Двор, градина и озеленяване':Object.freeze({site:`${siteBase}garden-landscaping.webp`,sharedKey:'garden-landscaping'}),
    'Борба с вредители':Object.freeze({site:`${siteBase}pest-control.webp`,sharedKey:'pest-control'}),
    'Товарен транспорт':Object.freeze({site:`${siteBase}cargo-transport.webp`,sharedKey:'cargo-transport'}),
    'Хамали и преместване':Object.freeze({site:`${siteBase}movers.webp`,sharedKey:'movers'}),
    'Доставки':Object.freeze({site:`${siteBase}delivery.webp`,sharedKey:'delivery'}),
    'Пътнически превоз':Object.freeze({site:`${siteBase}passenger-transport.webp`,sharedKey:'passenger-transport'}),
    'Красота и лична грижа':Object.freeze({site:`${siteBase}beauty-personal-care.webp`,sharedKey:'beauty-personal-care'}),
    'Фризьор и бръснар':Object.freeze({site:`${siteBase}hair-barber.webp`,sharedKey:'hair-barber'}),
    'Маникюр и педикюр':Object.freeze({site:`${siteBase}manicure-pedicure.webp`,sharedKey:'manicure-pedicure'}),
    'Козметика и грим':Object.freeze({site:`${siteBase}cosmetics-makeup.webp`,sharedKey:'cosmetics-makeup'}),
    'Немедицински масаж':Object.freeze({site:`${siteBase}nonmedical-massage.webp`,sharedKey:'nonmedical-massage'}),
    'Детегледачки':Object.freeze({site:`${siteBase}babysitting.webp`,sharedKey:'babysitting'}),
    'Грижа за възрастни':Object.freeze({site:`${siteBase}elder-care.webp`,sharedKey:'elder-care'}),
    'Помощ в дома':Object.freeze({site:`${siteBase}home-help.webp`,sharedKey:'home-help'}),
    'Гледане и разхождане на домашни любимци':Object.freeze({site:`${siteBase}pet-walking.webp`,sharedKey:'pet-walking'}),
    'Грижа и подстригване на домашни любимци':Object.freeze({site:`${siteBase}pet-grooming.webp`,sharedKey:'pet-grooming'})
  });
  const aliases=Object.freeze({
    'Майстори и ремонти':'Цялостни ремонти',
    'Домашна помощ':'Помощ в дома'
  });

  function resolve(name=''){
    const exact=String(name||'').trim();
    const canonical=aliases[exact]||exact;
    return accepted[canonical]||null;
  }
  // The raster set is retained only as historical review/social-theme evidence.
  // Owner rejected its use in site/mobile; site remains text-first until a
  // professional SVG system receives a separate explicit approval.
  function site(){
    return '';
  }
  function has(name=''){
    return Boolean(resolve(name));
  }

  window.PopitaiIconRegistry=Object.freeze({accepted,aliases,resolve,site,has});
})();
