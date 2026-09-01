(()=>{
  'use strict';

  const paymentData=[
    [
      ['ул. „Дунавска“ №22','Пон.–Пет. 08:30–12:00 и 13:00–18:00'],
      ['ул. „Александър Стамболийски“ №4','Пон.–Пет. 09:00–18:00'],
      ['ул. „Хан Аспарух“ №13, T Market','Собствен офис · работното време остава от проверения източник']
    ],
    [
      ['пл. „Свобода“ №2','Български пощи · работното време се показва от проверения запис'],
      ['ул. „Русенски лом“ №1','Български пощи · проверена местна точка']
    ],
    [
      ['Банка ДСК · ул. „Панайот Волов“ №1','За конкретното плащане се проверяват условията на доставчика'],
      ['УниКредит Булбанк · ул. „Дунавска“ №14','За конкретното плащане се проверяват условията на доставчика']
    ]
  ];

  const switches=[...document.querySelectorAll('.u9-switch')];
  const list=document.querySelector('#payments .u9-list');
  switches.forEach((button,index)=>button.addEventListener('click',()=>{
    switches.forEach((item,i)=>item.classList.toggle('active',i===index));
    if(!list) return;
    list.innerHTML=paymentData[index].map((row,i)=>`<div class="u9-row"><span class="u9-row-index">${String(i+1).padStart(2,'0')}</span><div><strong>${row[0]}</strong><span>${row[1]}</span></div></div>`).join('');
  }));

  let toast;
  function showMessage(){
    if(!toast){
      toast=document.createElement('div');
      toast.setAttribute('role','status');
      Object.assign(toast.style,{position:'fixed',left:'50%',bottom:'22px',transform:'translateX(-50%)',zIndex:'100',maxWidth:'min(92vw,520px)',padding:'11px 14px',borderRadius:'12px',background:'#0f2747',color:'#fff',fontWeight:'800',fontSize:'.78rem',boxShadow:'0 10px 28px rgba(15,39,71,.2)'});
      document.body.appendChild(toast);
    }
    toast.textContent='Прототип: в реалната версия това действие отваря проверения официален източник.';
    toast.hidden=false;
    clearTimeout(showMessage.timer);
    showMessage.timer=setTimeout(()=>{toast.hidden=true},2600);
  }

  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href="#"]');
    if(!link) return;
    event.preventDefault();
    showMessage();
  });
})();
