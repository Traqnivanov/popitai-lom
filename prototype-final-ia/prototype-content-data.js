'use strict';

(() => {
  const PROTOTYPE_URL='https://traqnivanov.github.io/popitai-lom/prototype-final-ia/';
  const MEDIA_BASE='https://dfhukfnuxkynjlxcprbc.supabase.co/storage/v1/object/public/business-media/';
  const detailHref=(contentType,id)=>`#detail/${contentType}?record=${encodeURIComponent(id)}`;
  const mediaUrl=path=>`${MEDIA_BASE}${path}`;
  const contentRoleByType=Object.freeze({listing:'marketplace',firm:'profile',shop:'specialized',article:'editorial'});
  const freezeSections=sections=>Object.freeze(sections.filter(section=>section?.title&&section?.body).map(section=>Object.freeze({title:String(section.title),body:String(section.body)})));
  const freezeMedia=media=>Object.freeze({
    logo:media?.logo?String(media.logo):'',
    images:Object.freeze(Array.isArray(media?.images)?media.images.filter(Boolean).map(String):[])
  });
  function detailRecord({id,contentType,title,description='',body='',rows=[],sections=[],actions={},category='',discovery='',icon='services',accent='blue',location='',media={},shareEligible=false}){
    const pageDescription=String(description||body||'').trim();
    const mediaData=freezeMedia(media);
    return Object.freeze({
      id,contentType,contentRole:contentRoleByType[contentType]||'marketplace',owner:'',pageTitle:title,pageDescription,heading:title,body:String(body||''),
      rows:Object.freeze(rows.filter(row=>Array.isArray(row)&&row.length>=2&&String(row[1]??'').trim())),sections:freezeSections(sections),media:mediaData,
      actions:Object.freeze(actions),special:'',qaNotes:Object.freeze([]),addContext:null,addUrl:'',
      social:Object.freeze({
        contentType,contentRole:contentRoleByType[contentType]||'marketplace',title,description:pageDescription,category,discovery,
        visualTheme:[category,discovery].filter(Boolean).join(' · '),icon,accent,mediaAvailable:false,mediaType:'',
        canonicalUrl:`${PROTOTYPE_URL}${detailHref(contentType,id)}`,location,shareEligible:Boolean(shareEligible),
        facebookText:'Текстът над споделения линк се пише от човека, който споделя.',composition:contentType==='article'?'editorial':contentType==='listing'?'marketplace':'profile'
      })
    });
  }

  const listingTvId='97f0a906-2836-484d-856f-a57bdfba5424';
  const firmIvanovId='d48cae4e-ea29-46fc-8bc0-24ebed828054';
  const articleMasterGuideId='statia.html';
  const shopDreamColorsId='ca9a5f06-0bac-4844-8a10-30643c69e963';
  const shopDartonId='9fdd2829-edc2-4c0f-8b1d-703410a60338';
  const shopTanyaId='87fafa9a-7f7d-4d5c-a733-948bd295b964';

  const detailRecords=Object.freeze({
    [listingTvId]:detailRecord({
      id:listingTvId,contentType:'listing',title:'TELEVIZOR',description:'PRODAVAM TV SAMSUNG MN DOBUR',body:'PRODAVAM TV SAMSUNG MN DOBUR',
      rows:[['Категория','Електроника'],['Тип','Продава'],['Цена','333 евро'],['Телефон','0876 936 184'],['Град','г лом'],['Адрес','геориги спасосв']],
      actions:{phone:'tel:0876936184',inquiry:'viber://chat?number=359876936184',share:true,report:true},category:'Електроника',discovery:'Телевизор',icon:'services',accent:'blue',location:'г лом',shareEligible:true,
      media:{images:[
        mediaUrl('598d6626-25ed-450f-87a9-e83f34f641c4/97f0a906-2836-484d-856f-a57bdfba5424/gallery/upload-a3ce19ae-4289-405b-adaa-66096d8b8818.webp'),
        mediaUrl('598d6626-25ed-450f-87a9-e83f34f641c4/97f0a906-2836-484d-856f-a57bdfba5424/gallery/upload-881a6fea-66f7-4cc6-b685-0a37bd4c16bc.webp'),
        mediaUrl('598d6626-25ed-450f-87a9-e83f34f641c4/97f0a906-2836-484d-856f-a57bdfba5424/gallery/upload-b768870e-8e18-4478-bc90-8e07b7640345.webp'),
        mediaUrl('598d6626-25ed-450f-87a9-e83f34f641c4/97f0a906-2836-484d-856f-a57bdfba5424/gallery/upload-1c82ee68-bb62-4188-a401-2e7ed6f1f4f5.webp')
      ]}
    }),
    [firmIvanovId]:detailRecord({
      id:firmIvanovId,contentType:'firm',title:'Иванов Ремонти Лом',
      description:'Шпакловка, боядисване, гипсокартон и ВиК услуги в Лом и региона. 23 години опит, фиксирана цена по договор и писмена гаранция.',
      body:'Шпакловка, боядисване, гипсокартон и ВиК услуги в Лом и региона. 23 години опит, фиксирана цена по договор и писмена гаранция.',
      sections:[{title:'Кратко представяне',body:'Довършителни ремонти в Лом и региона — 23 години опит.Работа с отговорност и без скрито\nЛично водя всеки обект — сам или с проверени хора, работата винаги е под мой контрол. Стая или цял апартамент, знаеш кой е в дома ти.\nЗа мен няма малки и големи клиенти — всеки заслужава същото внимание.'}],
      rows:[['Категория','Майстори и ремонти'],['Телефон','0876 936 184'],['Град','г лом'],['Адрес','геориги спасосв'],['Работно време','Понеделник – Събота: 08:00 – 19:00\nНеделя: 09:00 – 16:00']],
      actions:{phone:'tel:0876936184',inquiry:'viber://chat?number=359876936184',report:true},category:'Майстори и ремонти',discovery:'Ремонти',icon:'repairs',accent:'gold',location:'г лом',
      media:{
        logo:mediaUrl('598d6626-25ed-450f-87a9-e83f34f641c4/d48cae4e-ea29-46fc-8bc0-24ebed828054/logo/upload-f429d620-55cc-4368-8b2d-945b425661af.webp'),
        images:[
          mediaUrl('598d6626-25ed-450f-87a9-e83f34f641c4/d48cae4e-ea29-46fc-8bc0-24ebed828054/gallery/upload-02a0afdf-e75c-4b98-9b7c-6ef4af72532d.webp'),
          mediaUrl('598d6626-25ed-450f-87a9-e83f34f641c4/d48cae4e-ea29-46fc-8bc0-24ebed828054/gallery/upload-5ca20e66-1505-40bb-8698-c384130bb78f.webp'),
          mediaUrl('598d6626-25ed-450f-87a9-e83f34f641c4/d48cae4e-ea29-46fc-8bc0-24ebed828054/gallery/upload-b9933dfd-e6c4-457a-b269-3e7eee1bd1c4.webp'),
          mediaUrl('598d6626-25ed-450f-87a9-e83f34f641c4/d48cae4e-ea29-46fc-8bc0-24ebed828054/gallery/upload-e57e0788-068e-4dc8-a23b-e51cba400f21.webp'),
          mediaUrl('598d6626-25ed-450f-87a9-e83f34f641c4/d48cae4e-ea29-46fc-8bc0-24ebed828054/gallery/upload-f4a1700e-2dd1-4159-a321-b30bc0eb710b.webp'),
          mediaUrl('598d6626-25ed-450f-87a9-e83f34f641c4/d48cae4e-ea29-46fc-8bc0-24ebed828054/gallery/upload-8cefd180-d8d6-40df-8039-bb828ab638a4.webp'),
          mediaUrl('598d6626-25ed-450f-87a9-e83f34f641c4/d48cae4e-ea29-46fc-8bc0-24ebed828054/gallery/upload-762b795a-d716-4b9c-af44-eae84b855f23.webp'),
          mediaUrl('598d6626-25ed-450f-87a9-e83f34f641c4/d48cae4e-ea29-46fc-8bc0-24ebed828054/gallery/upload-28f0bcc6-6027-4481-93e9-b7db7bd5bfff.webp'),
          mediaUrl('598d6626-25ed-450f-87a9-e83f34f641c4/d48cae4e-ea29-46fc-8bc0-24ebed828054/gallery/upload-22cc7840-95ae-4338-9b32-02472a29cbef.webp'),
          mediaUrl('598d6626-25ed-450f-87a9-e83f34f641c4/d48cae4e-ea29-46fc-8bc0-24ebed828054/gallery/upload-74142a04-12c8-420d-ae8d-45e1c7ddd2e0.webp'),
          mediaUrl('598d6626-25ed-450f-87a9-e83f34f641c4/d48cae4e-ea29-46fc-8bc0-24ebed828054/gallery/upload-d2060947-2262-4f28-8c18-959be890c836.webp'),
          mediaUrl('598d6626-25ed-450f-87a9-e83f34f641c4/d48cae4e-ea29-46fc-8bc0-24ebed828054/gallery/upload-6deb7d80-9242-4f44-967f-000c6c08a10a.webp'),
          mediaUrl('598d6626-25ed-450f-87a9-e83f34f641c4/d48cae4e-ea29-46fc-8bc0-24ebed828054/gallery/upload-65757371-5d52-478f-8031-97cd4de1e1ea.webp'),
          mediaUrl('598d6626-25ed-450f-87a9-e83f34f641c4/d48cae4e-ea29-46fc-8bc0-24ebed828054/gallery/upload-f0c64554-ec4b-4678-a648-a45de7246398.webp'),
          mediaUrl('598d6626-25ed-450f-87a9-e83f34f641c4/d48cae4e-ea29-46fc-8bc0-24ebed828054/gallery/upload-5593b3bf-58f5-46a8-92c8-4cd6b7e07003.webp')
        ]
      }
    }),
    [articleMasterGuideId]:detailRecord({
      id:articleMasterGuideId,contentType:'article',title:'Как да избереш майстор и да избегнеш неприятни изненади',
      description:'Практичен списък за проверка преди започване на ремонт.',
      body:'Добрият избор започва с ясна задача, писмена оферта и проверка на предишни обекти.',
      sections:[
        {title:'1. Опиши точно работата',body:'Запиши какво трябва да се направи, какви материали очакваш и какъв е ориентировъчният срок.'},
        {title:'2. Поискай подробна оферта',body:'Трудът и материалите трябва да бъдат описани отделно. Уточни какво не е включено.'},
        {title:'3. Провери реални препоръки',body:'Търси мнения от хора, които действително са използвали услугата.'},
        {title:'4. Не плащай всичко предварително',body:'Раздели плащането на разумни етапи, свързани със завършена работа.'}
      ],
      rows:[['Тема','Дом и ремонт']],actions:{},category:'Дом и ремонт',discovery:'Ремонт',icon:'articles',accent:'blue',location:'Лом'
    }),
    [shopDreamColorsId]:detailRecord({
      id:shopDreamColorsId,contentType:'shop',title:'Дрийм Колорс',description:'Бои, мазилки и материали за довършителни работи',
      rows:[['Категория','Строителни'],['Адрес','ул. „Георги Манафски“ 19, Лом'],['Предлага','Бои, Мазилки, Лепила и шпакловки, Инструменти и консумативи']],
      actions:{},category:'Магазини',discovery:'Строителни',icon:'services',accent:'gold',location:'Лом'
    }),
    [shopDartonId]:detailRecord({
      id:shopDartonId,contentType:'shop',title:'Дартон / Магазин за бани',description:'Бани, санитария и обзавеждане',
      rows:[['Категория','Строителни'],['Адрес','ул. „Славянска“ 126, Лом'],['Телефон','0895 793 130'],['Предлага','Санитария, Смесители, Бани, Обзавеждане за баня']],
      actions:{phone:'tel:0895793130'},category:'Магазини',discovery:'Строителни',icon:'services',accent:'gold',location:'Лом'
    }),
    [shopTanyaId]:detailRecord({
      id:shopTanyaId,contentType:'shop',title:'ЕТ „Таня Иванова“',description:'Строителни материали, железария, ВиК и обзавеждане',
      rows:[['Категория','Строителни'],['Адрес','ул. „Цар Симеон“ 110, Лом'],['Телефон','0886 552 618'],['Предлага','Строителни материали, Железария, ВиК, Обзавеждане']],
      actions:{phone:'tel:0886552618'},category:'Магазини',discovery:'Строителни',icon:'services',accent:'gold',location:'Лом'
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
