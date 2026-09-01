(()=>{
  'use strict';

  const paymentData=[
    [
      {address:'ул. „Дунавска“ №22',meta:'Пон.–Пет. 08:30–12:00 и 13:00–18:00; Съб. 09:00–13:00'},
      {address:'ул. „Александър Стамболийски“ №4',meta:'Пон.–Пет. 09:00–18:00; Съб. 09:00–13:00'},
      {address:'ул. „Дунавска“ №18',meta:'Пон.–Пет. 08:30–17:00'},
      {address:'ул. „Цар Симеон“ №31',meta:'Пон.–Пет. 08:30–13:00 и 13:30–18:00; Съб.–Нед. 09:00–14:00'},
      {address:'кв. Младеново, ул. „Софийска“ №56',meta:'Пон.–Пет. 08:00–18:00; Съб. 08:00–12:00'},
      {address:'ул. „Хан Аспарух“ №13, T Market',meta:'Пон.–Съб. 08:00–20:00; Нед. 08:00–17:00',badge:'Собствена каса',badgeClass:'source'},
      {address:'кв. Садовете, ТЦ СБА',meta:'Пон.–Пет. 08:30–16:30'},
      {address:'ул. „Славянска“ №92, офис 1',meta:'Пон.–Пет. 09:00–18:00; Съб. 09:00–14:00'},
      {address:'ул. „Пристанищна“ №13, офис 3',meta:'Пон.–Пет. 09:00–13:00 и 14:00–18:00; Съб. 09:00–13:00'},
      {address:'ул. „Цар Петър“ №1',meta:'Пон.–Пет. 08:30–18:00; Съб.–Нед. 09:00–13:00'},
      {address:'ул. „Пристанищна“ №60',meta:'Пон.–Нед. 08:00–20:00'},
      {address:'ул. „Дунавска“ №37',meta:'Пон.–Пет. 08:30–17:30; Съб. 09:00–13:00'},
      {address:'ул. „Славянска“ №52, Център',meta:'Вт.–Пет. 10:00–14:00 и 15:00–22:00; Съб.–Нед. 10:00–22:00'}
    ],
    [
      {address:'пл. „Свобода“ №2',meta:'Пон.–Пет. 08:00–17:30',badge:'Непотвърдено',badgeClass:'neutral'},
      {address:'ул. „Русенски лом“ №1',meta:'Пон.–Пет. 08:00–17:30',badge:'Непотвърдено',badgeClass:'neutral'}
    ],
    [
      {address:'Банка ДСК · ул. „Панайот Волов“ №1',meta:'Пон.–Пет. 08:30–17:00'},
      {address:'УниКредит Булбанк · ул. „Дунавска“ №14',meta:'Пон.–Пет. 08:30–17:00'}
    ]
  ];

  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const list=document.getElementById('payment-list');
  const switches=[...document.querySelectorAll('[data-pay-tab]')];

  function renderPayments(index){
    if(!list) return;
    const rows=paymentData[index]||[];
    list.innerHTML=rows.map((row,i)=>`<div class="u10-row"><span class="u10-row-index">${String(i+1).padStart(2,'0')}</span><div class="u10-row-copy"><strong>${escapeHtml(row.address)}</strong><span>${escapeHtml(row.meta)}</span></div>${row.badge?`<span class="u10-sticker ${escapeHtml(row.badgeClass||'neutral')}">${escapeHtml(row.badge)}</span>`:''}</div>`).join('');
  }

  switches.forEach((button,index)=>button.addEventListener('click',()=>{
    switches.forEach((item,i)=>{
      const active=i===index;
      item.classList.toggle('active',active);
      item.setAttribute('aria-selected',active?'true':'false');
    });
    renderPayments(index);
  }));
  renderPayments(0);

  const navLinks=[...document.querySelectorAll('.u10-subnav a[href^="#"]')];
  const sections=navLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  function setActive(id){
    navLinks.forEach(link=>{
      const active=link.getAttribute('href')===`#${id}`;
      link.classList.toggle('active',active);
      if(active){link.setAttribute('aria-current','true');link.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'});}else link.removeAttribute('aria-current');
    });
  }
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(visible) setActive(visible.target.id);
    },{rootMargin:'-125px 0px -55% 0px',threshold:[0,.12,.3]});
    sections.forEach(section=>observer.observe(section));
  }
  navLinks.forEach(link=>link.addEventListener('click',()=>setActive(link.getAttribute('href').slice(1))));
  setActive(location.hash.replace('#','')||'water');

  const toast=document.getElementById('u10-toast');
  function showMessage(message){
    if(!toast) return;
    toast.textContent=message;
    toast.hidden=false;
    clearTimeout(showMessage.timer);
    showMessage.timer=setTimeout(()=>{toast.hidden=true},2600);
  }
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href="#"]');
    if(!link) return;
    event.preventDefault();
    showMessage('Прототип: в реалната версия действието отваря проверения официален източник.');
  });
})();
