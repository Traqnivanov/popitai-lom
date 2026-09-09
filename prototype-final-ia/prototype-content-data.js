'use strict';

(() => {
  const PROTOTYPE_URL='https://traqnivanov.github.io/popitai-lom/prototype-final-ia/';
  const detailHref=(contentType,id)=>`#detail/${contentType}?record=${encodeURIComponent(id)}`;
  const contentRoleByType=Object.freeze({listing:'marketplace',firm:'profile',shop:'specialized',article:'editorial'});
  function detailRecord({id,contentType,title,description='',body='',rows=[],actions={},category='',discovery='',icon='services',accent='blue',mediaAvailable=false}){
    const pageDescription=description||body||'Публичен запис в Попитай.Лом.';
    return Object.freeze({
      id,contentType,contentRole:contentRoleByType[contentType]||'marketplace',owner:'',pageTitle:title,pageDescription,heading:title,body:body||description,
      rows:Object.freeze(rows),actions:Object.freeze(actions),special:'',qaNotes:Object.freeze([]),addContext:null,addUrl:'',
      social:Object.freeze({
        contentType,contentRole:contentRoleByType[contentType]||'marketplace',title,description:pageDescription,category,discovery,
        visualTheme:[category,discovery].filter(Boolean).join(' · '),icon,accent,mediaAvailable:Boolean(mediaAvailable),mediaType:mediaAvailable?'approved-photo':'',
        canonicalUrl:`${PROTOTYPE_URL}${detailHref(contentType,id)}`,location:'Лом',shareEligible:true,
        facebookText:'Текстът над споделения линк се пише от човека, който споделя.',composition:contentType==='article'?'editorial':contentType==='listing'?'marketplace':'profile'
      })
    });
  }

  const listingTvId='listing-97f0a906-2836-484d-856f-a57bdfba5424';
  const firmIvanovId='firm-d48cae4e-ea29-46fc-8bc0-24ebed828054';
  const articleMasterGuideId='article-master-guide';
  const shopDreamColorsId='shop-dream-colors';
  const shopDartonId='shop-darton';
  const shopTanyaId='shop-tanya-ivanova';

  const detailRecords=Object.freeze({
    [listingTvId]:detailRecord({
      id:listingTvId,contentType:'listing',title:'TELEVIZOR',description:'Електроника · Продава',
      body:'Публична обява за телевизор в Лом. Детайлът остава вътре в Stage 2 safety прототипа.',
      rows:[['Категория','Електроника'],['Тип','Продава'],['Цена','333 евро'],['Район','Лом']],actions:{share:true,report:true},category:'Електроника',discovery:'Телевизор',icon:'services',accent:'blue'
    }),
    [firmIvanovId]:detailRecord({
      id:firmIvanovId,contentType:'firm',title:'Иванов Ремонти Лом',
      description:'Шпакловка, боядисване, гипсокартон и ВиК услуги в Лом и региона. 23 години опит, фиксирана цена по договор и писмена гаранция.',
      body:'Местен фирмен профил за ремонтни дейности в Лом и региона.',
      rows:[['Категория','Майстори и ремонти'],['Район','Лом']],actions:{phone:true,inquiry:true,share:true,report:true},category:'Майстори и ремонти',discovery:'Ремонти',icon:'repairs',accent:'gold',mediaAvailable:true
    }),
    [articleMasterGuideId]:detailRecord({
      id:articleMasterGuideId,contentType:'article',title:'Как да избереш майстор и да избегнеш неприятни изненади',
      description:'Проверки, въпроси и ясни условия преди започване на ремонта.',
      body:'Практично ръководство за избор на майстор, ясни условия, проверка на обхвата и избягване на недоразумения преди ремонта.',
      rows:[['Вид','Ръководство'],['Тема','Дом и ремонт']],actions:{share:true},category:'Статии',discovery:'Дом и ремонт',icon:'articles',accent:'blue'
    }),
    [shopDreamColorsId]:detailRecord({
      id:shopDreamColorsId,contentType:'shop',title:'Дрийм Колорс',description:'Бои, мазилки и материали за довършителни работи',
      body:'Местен магазин за бои, мазилки и материали за довършителни работи.',rows:[['Категория','Строителни'],['Адрес','ул. „Георги Манафски“ 19, Лом']],actions:{share:true,correction:true},category:'Магазини',discovery:'Строителни',icon:'services',accent:'gold'
    }),
    [shopDartonId]:detailRecord({
      id:shopDartonId,contentType:'shop',title:'Дартон / Магазин за бани',description:'Бани, санитария и обзавеждане',
      body:'Местен магазин за бани, санитария и обзавеждане.',rows:[['Категория','Строителни'],['Адрес','ул. „Славянска“ 126, Лом'],['Телефон','0895 793 130']],actions:{phone:true,share:true,correction:true},category:'Магазини',discovery:'Строителни',icon:'services',accent:'gold'
    }),
    [shopTanyaId]:detailRecord({
      id:shopTanyaId,contentType:'shop',title:'ЕТ „Таня Иванова“',description:'Строителни материали, железария, ВиК и обзавеждане',
      body:'Местен магазин за строителни материали, железария, ВиК и обзавеждане.',rows:[['Категория','Строителни'],['Адрес','ул. „Цар Симеон“ 110, Лом'],['Телефон','0886 552 618']],actions:{phone:true,share:true,correction:true},category:'Магазини',discovery:'Строителни',icon:'services',accent:'gold'
    })
  });

  const pensionArticle=Object.freeze({
    title:'Пенсиониране в Лом — къде се обслужвате и какво трябва да знаете',
    description:'Къде се обслужвате в Лом, кога се налага Монтана и какво е добре да подготвите за пенсиониране.',
    type:'Статия',meta:'Пенсии · Ръководство',href:'#detail/article?record=article-pension'
  });
  const approved=Object.freeze({
    latest:Object.freeze([Object.freeze({title:'TELEVIZOR',description:'Електроника · Продава',type:'Обява',meta:'333 евро · Лом',href:detailHref('listing',listingTvId)})]),
    firms:Object.freeze([Object.freeze({title:'Иванов Ремонти Лом',description:'Шпакловка, боядисване, гипсокартон и ВиК услуги в Лом и региона. 23 години опит, фиксирана цена по договор и писмена гаранция.',type:'Фирма',meta:'Майстори и ремонти · Лом',href:detailHref('firm',firmIvanovId)})]),
    masterFirms:Object.freeze([Object.freeze({title:'Иванов Ремонти Лом',description:'Шпакловка, боядисване, гипсокартон и ВиК услуги в Лом и региона. 23 години опит, фиксирана цена по договор и писмена гаранция.',type:'Фирма',meta:'Майстори и ремонти · Лом',href:detailHref('firm',firmIvanovId)})]),
    masterActivity:Object.freeze([]),
    shops:Object.freeze([
      Object.freeze({title:'Дрийм Колорс',description:'Бои, мазилки и материали за довършителни работи',meta:'ул. „Георги Манафски“ 19, Лом',href:detailHref('shop',shopDreamColorsId)}),
      Object.freeze({title:'Дартон / Магазин за бани',description:'Бани, санитария и обзавеждане',meta:'ул. „Славянска“ 126, Лом',phone:'0895 793 130',href:detailHref('shop',shopDartonId)}),
      Object.freeze({title:'ЕТ „Таня Иванова“',description:'Строителни материали, железария, ВиК и обзавеждане',meta:'ул. „Цар Симеон“ 110, Лом',phone:'0886 552 618',href:detailHref('shop',shopTanyaId)})
    ]),
    articles:Object.freeze([
      Object.freeze({title:'Как да избереш майстор и да избегнеш неприятни изненади',description:'Проверки, въпроси и ясни условия преди започване на ремонта.',type:'Статия',meta:'Дом и ремонт',href:detailHref('article',articleMasterGuideId)}),
      pensionArticle
    ]),
    publications:Object.freeze([]),events:Object.freeze([]),questions:Object.freeze([])
  });
  const pension=Object.freeze({
    article:pensionArticle,
    social:Object.freeze({contentType:'article',contentRole:'editorial',title:pensionArticle.title,description:pensionArticle.description,category:'Статии',discovery:'Пенсии',visualTheme:'Статии · Пенсии',icon:'articles',accent:'blue',mediaAvailable:false,mediaType:'',canonicalUrl:'https://traqnivanov.github.io/popitai-lom/prototype-final-ia/#detail/article?record=article-pension',location:'Лом',shareEligible:true,facebookText:'Текстът над споделения линк се пише от човека, който споделя.',composition:'editorial'})
  });
  window.PopitaiApprovedContent=approved;
  window.PopitaiContentData=Object.freeze({approved,pension,detailRecords});
})();
