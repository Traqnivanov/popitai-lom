(()=>{
  'use strict';

  const paymentData=[
    [
      {address:'ул. „Дунавска“ №22',meta:'Пон.–Пет. 08:30–12:00 и 13:00–18:00; Съб. 09:00–13:00'},
      {address:'ул. „Александър Стамболийски“ №4',meta:'Пон.–Пет. 09:00–18:00; Съб. 09:00–13:00'},
      {address:'ул. „Дунавска“ №18',meta:'Пон.–Пет. 08:30–17:00'},
      {address:'ул. „Цар Симеон“ №31',meta:'Пон.–Пет. 08:30–13:00 и 13:30–18:00; Съб.–Нед. 09:00–14:00'},
      {address:'кв. Младеново, ул. „Софийска“ №56',meta:'Пон.–Пет. 08:00–18:00; Съб. 08:00–12:00'},
      {address:'ул. „Хан Аспарух“ №13, T Market',meta:'Пон.–Съб. 08:00–20:00; Нед. 08:00–17:00',note:'Собствена каса'},
      {address:'кв. Садовете, ТЦ СБА',meta:'Пон.–Пет. 08:30–16:30'},
      {address:'ул. „Славянска“ №92, офис 1',meta:'Пон.–Пет. 09:00–18:00; Съб. 09:00–14:00'},
      {address:'ул. „Пристанищна“ №13, офис 3',meta:'Пон.–Пет. 09:00–13:00 и 14:00–18:00; Съб. 09:00–13:00'},
      {address:'ул. „Цар Петър“ №1',meta:'Пон.–Пет. 08:30–18:00; Съб.–Нед. 09:00–13:00'},
      {address:'ул. „Пристанищна“ №60',meta:'Пон.–Нед. 08:00–20:00'},
      {address:'ул. „Дунавска“ №37',meta:'Пон.–Пет. 08:30–17:30; Съб. 09:00–13:00'},
      {address:'ул. „Славянска“ №52, Център',meta:'Вт.–Пет. 10:00–14:00 и 15:00–22:00; Съб.–Нед. 10:00–22:00'}
    ],
    [
      {address:'пл. „Свобода“ №2',meta:'Пон.–Пет. 08:00–17:30 · непотвърдено'},
      {address:'ул. „Русенски лом“ №1',meta:'Пон.–Пет. 08:00–17:30 · непотвърдено'}
    ],
    [
      {address:'Банка ДСК · ул. „Панайот Волов“ №1',meta:'Пон.–Пет. 08:30–17:00'},
      {address:'УниКредит Булбанк · ул. „Дунавска“ №14',meta:'Пон.–Пет. 08:30–17:00'}
    ]
  ];

  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const list=document.getElementById('payment-list');
  const switches=[...document.querySelectorAll('[data-pay-tab]')];
  let activePaymentIndex=0;

  function renderPayments(index){
    if(!list) return;
    const rows=paymentData[index]||[];
    list.innerHTML=rows.map((row,i)=>{
      const meta=row.note?`${row.meta} · ${row.note}`:row.meta;
      return `<div class="u10-row"><span class="u10-row-index">${String(i+1).padStart(2,'0')}</span><div class="u10-row-copy"><strong>${escapeHtml(row.address)}</strong><span>${escapeHtml(meta)}</span></div></div>`;
    }).join('');
  }

  function flattenFreshStickers(){
    document.querySelectorAll('.u10-service-title .u10-sticker,.u10-provider-head .u10-sticker,.u10-insurance-head .u10-sticker').forEach(sticker=>{
      const text=(sticker.textContent||'').trim();
      const provider=sticker.closest('.u10-provider-head');
      const insurance=sticker.closest('.u10-insurance-head');
      if(provider&&text==='Местен доставчик'){
        const p=provider.querySelector('p');
        if(p&&!p.textContent.includes(text)) p.textContent=`${text} · ${p.textContent}`;
      }else if(provider&&text==='Автомати 24/7'){
        const p=provider.querySelector('p');
        if(p&&!p.textContent.includes('24/7')) p.textContent=`${p.textContent} · автомати 24/7`;
      }else if(insurance&&text){
        const p=insurance.querySelector('p');
        if(p&&!p.textContent.includes(text)) p.textContent=`${p.textContent} · ${text}`;
      }
      sticker.remove();
    });
  }

  const paymentsSection=document.getElementById('payments');
  const paymentSwitches=document.querySelector('.u10-switches');
  const subnav=document.querySelector('.u10-subnav');
  const couriersSection=document.getElementById('couriers');
  const scrollMeta=[
    {title:'EasyPay',count:'13 точки в Лом',brand:'<img src="../assets/brands/easypay-logo.webp" alt="" width="30" height="30">'},
    {title:'Български пощи',count:'2 пощенски каси',brand:'✉'},
    {title:'Банкови каси',count:'2 банкови офиса',brand:'🏦'}
  ];
  let floater=null;
  let floaterBrand=null;
  let floaterTitle=null;
  let floaterCount=null;
  let floaterRaf=0;

  function createPaymentFloater(){
    if(!paymentsSection||!paymentSwitches||floater) return;
    floater=document.createElement('div');
    floater.setAttribute('data-u10-pay-scroll-context','');
    floater.setAttribute('aria-hidden','true');
    floater.innerHTML='<span data-u10-pay-scroll-brand></span><span><strong data-u10-pay-scroll-title></strong><small data-u10-pay-scroll-count></small></span>';
    Object.assign(floater.style,{
      position:'fixed',left:'50%',transform:'translateX(-50%)',zIndex:'55',width:'min(520px,calc(100% - 28px))',
      padding:'9px 12px',border:'1px solid rgba(15,39,71,.12)',borderRadius:'14px',background:'rgba(255,255,255,.98)',
      boxShadow:'0 8px 24px rgba(16,35,63,.13)',alignItems:'center',gap:'10px',pointerEvents:'none',display:'none'
    });
    floaterBrand=floater.querySelector('[data-u10-pay-scroll-brand]');
    floaterTitle=floater.querySelector('[data-u10-pay-scroll-title]');
    floaterCount=floater.querySelector('[data-u10-pay-scroll-count]');
    Object.assign(floaterBrand.style,{width:'36px',height:'36px',flex:'0 0 36px',borderRadius:'10px',background:'#f5f7fa',display:'grid',placeItems:'center',overflow:'hidden',fontWeight:'900'});
    const copy=floaterTitle.parentElement;
    Object.assign(copy.style,{minWidth:'0',display:'flex',flexDirection:'column',gap:'1px'});
    Object.assign(floaterTitle.style,{fontSize:'.84rem',lineHeight:'1.15',color:'#10233f'});
    Object.assign(floaterCount.style,{fontSize:'.69rem',lineHeight:'1.2',color:'#6f7d8e'});
    document.body.appendChild(floater);
    updatePaymentFloaterContent();
    schedulePaymentFloater();
  }

  function updatePaymentFloaterContent(){
    if(!floater) return;
    const meta=scrollMeta[activePaymentIndex]||scrollMeta[0];
    floaterBrand.innerHTML=meta.brand;
    floaterTitle.textContent=meta.title;
    floaterCount.textContent=meta.count;
  }

  function updatePaymentFloater(){
    floaterRaf=0;
    if(!floater||!paymentsSection||!paymentSwitches) return;
    const subnavRect=subnav?.getBoundingClientRect();
    const topEdge=(subnavRect?.bottom||72)+8;
    const switchRect=paymentSwitches.getBoundingClientRect();
    const sectionRect=paymentsSection.getBoundingClientRect();
    const couriersRect=couriersSection?.getBoundingClientRect();
    const insidePayments=sectionRect.top<topEdge&&sectionRect.bottom>topEdge+76;
    const tabsHaveScrolledAway=switchRect.bottom<topEdge;
    const beforeCouriers=!couriersRect||couriersRect.top>topEdge+44;
    const shouldShow=insidePayments&&tabsHaveScrolledAway&&beforeCouriers;
    floater.style.top=`${Math.round(topEdge)}px`;
    floater.style.display=shouldShow?'flex':'none';
    floater.setAttribute('aria-hidden',shouldShow?'false':'true');
  }

  function schedulePaymentFloater(){
    if(!floaterRaf) floaterRaf=requestAnimationFrame(updatePaymentFloater);
  }

  switches.forEach((button,index)=>button.addEventListener('click',()=>{
    activePaymentIndex=index;
    switches.forEach((item,i)=>{
      const active=i===index;
      item.classList.toggle('active',active);
      item.setAttribute('aria-selected',active?'true':'false');
    });
    renderPayments(index);
    updatePaymentFloaterContent();
    schedulePaymentFloater();
  }));
  renderPayments(0);
  flattenFreshStickers();
  createPaymentFloater();
  addEventListener('scroll',schedulePaymentFloater,{passive:true});
  addEventListener('resize',schedulePaymentFloater,{passive:true});

  const navLinks=[...document.querySelectorAll('.u10-subnav a[href^="#"]')];
  const sections=navLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  function setActive(id,shouldCenter=true){
    navLinks.forEach(link=>{
      const active=link.getAttribute('href')===`#${id}`;
      link.classList.toggle('active',active);
      link.style.background=active?'#e6f2fb':'#f3f7fb';
      link.style.color=active?'#0d6ea8':'#284a68';
      if(active){
        link.setAttribute('aria-current','true');
        if(shouldCenter) link.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'});
      }else link.removeAttribute('aria-current');
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
  setActive(location.hash.replace('#','')||'water',false);

  const toast=document.getElementById('u10-toast');
  if(toast){
    Object.assign(toast.style,{position:'fixed',left:'50%',bottom:'96px',transform:'translateX(-50%)',zIndex:'120',width:'min(92vw,520px)',padding:'11px 14px',borderRadius:'13px',background:'#0f2747',color:'#fff',fontWeight:'800',fontSize:'.76rem',lineHeight:'1.4',boxShadow:'0 10px 28px rgba(15,39,71,.2)'});
  }
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
