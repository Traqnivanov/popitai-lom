'use strict';

(() => {
  const pensionArticle=Object.freeze({
    title:'Пенсиониране в Лом — къде се обслужвате и какво трябва да знаете',
    description:'Къде се обслужвате в Лом, кога се налага Монтана и какво е добре да подготвите за пенсиониране.',
    type:'Статия',meta:'Пенсии · Ръководство',href:'#detail/article?record=article-pension'
  });
  const approved=Object.freeze({
    latest:Object.freeze([Object.freeze({title:'TELEVIZOR',description:'Електроника · Продава',type:'Обява',meta:'333 евро · Лом',href:'https://traqnivanov.github.io/popitai-lom/obqva.html?id=97f0a906-2836-484d-856f-a57bdfba5424'})]),
    firms:Object.freeze([Object.freeze({title:'Иванов Ремонти Лом',description:'Шпакловка, боядисване, гипсокартон и ВиК услуги в Лом и региона. 23 години опит, фиксирана цена по договор и писмена гаранция.',type:'Фирма',meta:'Майстори и ремонти · Лом',href:'https://traqnivanov.github.io/popitai-lom/firma.html?id=d48cae4e-ea29-46fc-8bc0-24ebed828054'})]),
    masterFirms:Object.freeze([Object.freeze({title:'Иванов Ремонти Лом',description:'Шпакловка, боядисване, гипсокартон и ВиК услуги в Лом и региона. 23 години опит, фиксирана цена по договор и писмена гаранция.',type:'Фирма',meta:'Майстори и ремонти · Лом',href:'https://traqnivanov.github.io/popitai-lom/firma.html?id=d48cae4e-ea29-46fc-8bc0-24ebed828054'})]),
    masterActivity:Object.freeze([]),
    shops:Object.freeze([
      Object.freeze({title:'Дрийм Колорс',description:'Бои, мазилки и материали за довършителни работи',meta:'ул. „Георги Манафски“ 19, Лом'}),
      Object.freeze({title:'Дартон / Магазин за бани',description:'Бани, санитария и обзавеждане',meta:'ул. „Славянска“ 126, Лом',phone:'0895 793 130'}),
      Object.freeze({title:'ЕТ „Таня Иванова“',description:'Строителни материали, железария, ВиК и обзавеждане',meta:'ул. „Цар Симеон“ 110, Лом',phone:'0886 552 618'})
    ]),
    articles:Object.freeze([
      Object.freeze({title:'Как да избереш майстор и да избегнеш неприятни изненади',description:'Проверки, въпроси и ясни условия преди започване на ремонта.',type:'Статия',meta:'Дом и ремонт',href:'https://traqnivanov.github.io/popitai-lom/statia.html'}),
      pensionArticle
    ]),
    publications:Object.freeze([]),events:Object.freeze([]),questions:Object.freeze([])
  });
  const pension=Object.freeze({
    article:pensionArticle,
    social:Object.freeze({contentType:'article',contentRole:'editorial',title:pensionArticle.title,description:pensionArticle.description,category:'Статии',discovery:'Пенсии',visualTheme:'Статии · Пенсии',icon:'articles',accent:'blue',mediaAvailable:false,mediaType:'',canonicalUrl:'https://traqnivanov.github.io/popitai-lom/prototype-final-ia/#detail/article?record=article-pension',location:'Лом',shareEligible:true,facebookText:'Текстът над споделения линк се пише от човека, който споделя.',composition:'editorial'})
  });
  window.PopitaiApprovedContent=approved;
  window.PopitaiContentData=Object.freeze({approved,pension});
})();
