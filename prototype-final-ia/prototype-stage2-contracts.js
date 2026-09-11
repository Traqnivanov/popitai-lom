'use strict';

(() => {
  const SERVICE_OFFER_TYPE='Дава';

  const serviceCanonicalMap=Object.freeze({
    'Цялостни ремонти':'Цялостни ремонти',
    'Бани и плочки':'Бани и плочки',
    'ВиК':'ВиК',
    'Електро':'Електро',
    'Покриви':'Покриви',
    'Шпакловка и боядисване':'Боядисване',
    'Шпакловка / гипсокартон / боядисване':'Боядисване',
    'Дограма и врати':'Дограма',
    'Климатици':'Климатици',
    'Отопление и климатици':'Климатици',
    'Монтажи и мебели':'Цялостни ремонти',
    'Къртене и извозване':'Цялостни ремонти',
    'Почистване на дом':'Домашна помощ',
    'Офиси и входове':'Домашна помощ',
    'Мека мебел и килими':'Домашна помощ',
    'Пране на мека мебел / килими':'Домашна помощ',
    'Пране на мека мебел и килими':'Домашна помощ',
    'Двор и градина':'Домашна помощ',
    'Озеленяване':'Домашна помощ',
    'Борба с вредители':'Домашна помощ',
    'Домашна помощ':'Домашна помощ',
    'Помощ в дома':'Домашна помощ',
    'Автосервиз':'Автосервизи',
    'Диагностика':'Диагностика',
    'Гуми':'Гуми',
    'Авточасти':'Авточасти',
    'Автоелектро и автоклиматици':'Автосервизи',
    'Автомивка и детайлинг':'Автомивки',
    'Пътна помощ':'Пътна помощ',
    'Товарен транспорт':'Транспорт, преместване и доставки',
    'Хамали':'Транспорт, преместване и доставки',
    'Преместване':'Транспорт, преместване и доставки',
    'Доставки':'Транспорт, преместване и доставки',
    'Бус и камион':'Транспорт, преместване и доставки',
    'Транспорт с бус / камион':'Транспорт, преместване и доставки',
    'Фризьор и бръснар':'Красота и грижа',
    'Маникюр и педикюр':'Красота и грижа',
    'Козметични услуги':'Красота и грижа',
    'Грим':'Красота и грижа',
    'Козметика и грим':'Красота и грижа',
    'Немедицински масаж':'Красота и грижа',
    'Детегледачки':'Грижа за деца, възрастни и домашни любимци',
    'Грижа за възрастни':'Грижа за деца, възрастни и домашни любимци',
    'Домашни помощници':'Домашна помощ',
    'Гледане на любимци':'Грижа за деца, възрастни и домашни любимци',
    'Разходка на кучета':'Грижа за деца, възрастни и домашни любимци',
    'Груминг':'Грижа за деца, възрастни и домашни любимци',
    'Гледане и разхождане на домашни любимци':'Грижа за деца, възрастни и домашни любимци',
    'Грижа и подстригване на домашни любимци':'Грижа за деца, възрастни и домашни любимци',
    'Частни уроци':'Обучение и уроци',
    'Езици':'Обучение и уроци',
    'Шофьорски курсове':'Обучение и уроци',
    'Професионално обучение':'Обучение и уроци',
    'Компютърни курсове':'Обучение и уроци',
    'Спорт и танци':'Обучение и уроци',
    'Уроци':'Обучение и уроци',
    'Уроци и курсове':'Обучение и уроци',
    'Компютри и лаптопи':'Компютърни и технически услуги',
    'Компютри / лаптопи':'Компютърни и технически услуги',
    'Телефони и електроника':'Компютърни и технически услуги',
    'Телефони / електроника':'Компютърни и технически услуги',
    'IT':'Компютърни и технически услуги',
    'Сайтове':'Компютърни и технически услуги',
    'IT и сайтове':'Компютърни и технически услуги',
    'Дизайн':'Професионални услуги',
    'Счетоводство':'Професионални услуги',
    'Правни услуги':'Професионални услуги',
    'Преводи':'Професионални услуги',
    'Ремонт на техника':'Компютърни и технически услуги',
    'Фото':'Фото, видео и събитийни услуги',
    'Видео':'Фото, видео и събитийни услуги',
    'DJ и музика':'Фото, видео и събитийни услуги',
    'Декорация':'Фото, видео и събитийни услуги',
    'Кетъринг':'Фото, видео и събитийни услуги',
    'Организация на събития':'Фото, видео и събитийни услуги',
    'Фото и видео':'Фото, видео и събитийни услуги'
  });

  const serviceEntryVariants=Object.freeze({
    'Почистване':Object.freeze(['Почистване на дом','Офиси и входове']),
    'Двор, градина и озеленяване':Object.freeze(['Двор и градина','Озеленяване']),
    'Помощ в дома':Object.freeze(['Домашна помощ','Домашни помощници']),
    'Хамали и преместване':Object.freeze(['Хамали','Преместване']),
    'Козметика и грим':Object.freeze(['Козметични услуги','Грим']),
    'Уроци и курсове':Object.freeze(['Уроци','Езици','Професионално обучение','Компютърни курсове']),
    'Ремонт на техника':Object.freeze(['Компютри / лаптопи','Телефони / електроника']),
    'ИТ, сайтове и дизайн':Object.freeze(['IT','Сайтове','Дизайн']),
    'Фото и видео':Object.freeze(['Фото','Видео'])
  });

  const serviceSimpleAliasMap=Object.freeze({
    'Шпакловка и боядисване':'Шпакловка / гипсокартон / боядисване',
    'Климатици':'Отопление и климатици',
    'Мека мебел и килими':'Пране на мека мебел и килими',
    'Пране на мека мебел / килими':'Пране на мека мебел и килими',
    'Транспорт с бус / камион':'Товарен транспорт',
    'Бус и камион':'Товарен транспорт',
    'Фризьор / бръснар':'Фризьор и бръснар',
    'Маникюр / педикюр':'Маникюр и педикюр',
    'Гледане на любимци':'Гледане и разхождане на домашни любимци',
    'Разходка на кучета':'Гледане и разхождане на домашни любимци',
    'Груминг':'Грижа и подстригване на домашни любимци',
    'Частни уроци':'Уроци и курсове',
    'Компютри и лаптопи':'Ремонт на техника',
    'Телефони и електроника':'Ремонт на техника',
    'IT и сайтове':'ИТ, сайтове и дизайн',
    'Организация и помощ за събития':'Организация на събития'
  });

  const serviceVisibleEntryByAlias=Object.freeze({
    ...serviceSimpleAliasMap,
    ...Object.fromEntries(Object.entries(serviceEntryVariants).flatMap(([entry,variants])=>variants.map(variant=>[variant,entry])))
  });
  const serviceSearchAliases=Object.freeze(Object.keys(serviceVisibleEntryByAlias));

  const activeServiceCanonical=Object.freeze([
    'Цялостни ремонти','Бани и плочки','ВиК','Електро','Покриви','Боядисване','Дограма','Климатици',
    'Автосервизи','Диагностика','Гуми','Автомивки','Пътна помощ','Домашна помощ','Красота и грижа',
    'Компютърни и технически услуги','Фото, видео и събитийни услуги','Професионални услуги','Обучение и уроци',
    'Грижа за деца, възрастни и домашни любимци','Транспорт, преместване и доставки'
  ]);

  const serviceFamilyNames=Object.freeze([
    'Майстори, ремонти и дом',
    'Почистване и поддръжка',
    'Автомобилни услуги',
    'Транспорт, преместване и доставки',
    'Красота и лична грижа',
    'Грижа за хора и животни',
    'Обучение, уроци и спорт',
    'Техника, дигитални и професионални услуги',
    'Събития и творчески услуги'
  ]);

  const discoveryGroups=Object.freeze({
    'Работа':Object.freeze([
      'Строителство, ремонти и техници','Производство, склад и общи работници','Транспорт, шофьори и доставки',
      'Търговия и продажби','Заведения, хотели и туризъм','Почистване, домашна помощ и грижи',
      'Здраве, красота и социални дейности','Офис, администрация, IT и специалисти','Друга / сезонна работа'
    ]),
    'Имоти':Object.freeze([
      'Апартамент','Къща / етаж','Парцел','Земеделска земя','Гараж / паркомясто','Бизнес имот','Склад / производствен имот','Друго'
    ]),
    'Автомобили и МПС':Object.freeze([
      'Автомобили и джипове','Мотоциклети и ATV','Бусове и камиони','Агро/строителна техника',
      'Ремаркета, каравани и други','Части, гуми и аксесоари'
    ]),
    'Животни':Object.freeze(['Осиновяване / търси дом','Изгубени','Намерени','Стоки за животни'])
  });

  const animalSuggestedTypeByDiscovery=Object.freeze({
    'Осиновяване / търси дом':'Дава',
    'Изгубени':'Търси',
    'Намерени':'Търси'
  });

  const goodsCategoryByDiscovery=Object.freeze({
    'Електроника и телефони':'Електроника',
    'Дом и градина':'Дом и градина',
    'Дрехи, обувки и аксесоари':'Дрехи и обувки',
    'Деца и бебета':'Деца и бебета',
    'Спорт, хоби и книги':'Спорт и хоби',
    'Инструменти и оборудване':'Дом и градина',
    'Друго':'Друго'
  });

  const shopTagsByCategory=Object.freeze({
    'Хранителни':Object.freeze(['Хранителни стоки','Месо и месни продукти','Млечни продукти','Плодове и зеленчуци','Напитки','Готова храна']),
    'Строителни':Object.freeze(['Строителни материали','Железария и метали','Бои и покрития','Плочки и настилки','Санитария и ВиК','Инструменти и машини']),
    'Техника':Object.freeze(['Техника','Електроника','Телефони и аксесоари','Бяла техника','Черна техника','Сервиз']),
    'Мебели':Object.freeze(['Мебели','Обзавеждане','Домашни потреби']),
    'Дрехи':Object.freeze(['Дрехи','Обувки','Бельо','Модни аксесоари','Парфюмерия и козметика','Детски стоки']),
    'Дом':Object.freeze(['Домашни потреби','Подаръци и сувенири','Цветя','Градина и земеделие','Храни и стоки за животни','Разнообразни стоки'])
  });

  const shopTags=Object.freeze(Array.from(new Set(Object.values(shopTagsByCategory).flat())));
  const shopLegacyAliases=Object.freeze({
    'Месо':'Месо и месни продукти','Месни продукти':'Месо и месни продукти','Месо и сирена':'Месо и месни продукти',
    'Сирене':'Млечни продукти','Кашкавал':'Млечни продукти','Кисело мляко':'Млечни продукти',
    'Бързо хранене':'Готова храна','Готвени ястия':'Готова храна',
    'Латекс':'Бои и покрития','Мазилки':'Бои и покрития','Декоративни покрития':'Бои и покрития','Автобои':'Бои и покрития',
    'Метали':'Железария и метали','Метални изделия':'Железария и метали','Железария':'Железария и метали',
    'Бани':'Санитария и ВиК','Смесители':'Санитария и ВиК','Санитария':'Санитария и ВиК','ВиК':'Санитария и ВиК',
    'Плочки':'Плочки и настилки','Ламинат':'Плочки и настилки',
    'Фуражи':'Храни и стоки за животни','Храни за любимци':'Храни и стоки за животни','Животни':'Храни и стоки за животни',
    'Подаръци':'Подаръци и сувенири','Сувенири':'Подаръци и сувенири'
  });

  function listingSubcategories(category){
    return category==='Услуги'?[...activeServiceCanonical]:[];
  }

  // Persisted compatibility remains broad because legacy records can contain "Търси".
  // New service create routes are constrained separately by listingAddUrl/contextualAddUrl.
  function listingTypes(category){
    if(category==='Работа') return ['Предлага работа','Търси работа'];
    if(category==='Имоти') return ['Продава имот','Отдава под наем','Търси под наем','Търси за купуване'];
    return ['Продава','Купува','Търси','Дава'];
  }

  function serviceCanonical(discovery){
    return serviceCanonicalMap[discovery]||(activeServiceCanonical.includes(discovery)?discovery:'');
  }

  function serviceVisibleEntry(discovery){
    return serviceVisibleEntryByAlias[discovery]||discovery;
  }

  function serviceVariants(discovery){
    return serviceEntryVariants[discovery]||Object.freeze([]);
  }

  function serviceCanonicals(discovery){
    const variants=serviceVariants(discovery);
    const values=(variants.length?variants:[discovery]).map(serviceCanonical).filter(Boolean);
    return [...new Set(values)];
  }

  function shopTagsForCategory(category){
    const primary=[...(shopTagsByCategory[category]||[])];
    const primarySet=new Set(primary);
    return {primary,other:shopTags.filter(tag=>!primarySet.has(tag))};
  }

  function compatibilityAdapter({category='',discovery='',type='',subcategory=''}){
    if(category==='Услуги'){
      return {category,subcategory:serviceCanonical(discovery)||subcategory||'',listing_type:type||''};
    }
    return {category,subcategory:'',listing_type:type||''};
  }

  function listingAddUrl({category='',subcategory='',type='',discovery=''}={}){
    const q=new URLSearchParams();
    const createType=category==='Услуги'?SERVICE_OFFER_TYPE:type;
    if(category) q.set('category',category);
    if(category==='Услуги'&&subcategory) q.set('subcategory',subcategory);
    if(createType) q.set('type',createType);
    if(discovery) q.set('discovery',discovery);
    return `#add/listing${q.size?`?${q}`:''}`;
  }

  function otherServiceAddUrl({family=''}={}){
    const q=new URLSearchParams({category:'Услуги',other:'1',type:SERVICE_OFFER_TYPE});
    if(family) q.set('family',family);
    return `#add/listing?${q}`;
  }

  function contextualAddUrl({context='',group='',owner='Listings',type=''}={}){
    if(owner==='Shops') return `#add/shop${group?`?category=${encodeURIComponent(group)}`:''}`;
    if(owner==='Health/Info') return `#add/health${group?`?type=${encodeURIComponent(group)}`:''}`;
    if(context==='Заведения') return '#add/firm?category=Заведения';
    if(owner==='Firms') return '#add/firm';

    if(context==='Услуги'){
      if(group==='Друга ремонтна услуга') return otherServiceAddUrl({family:'Майстори, ремонти и дом'});
      if(group==='Друга услуга') return otherServiceAddUrl();
      if(serviceFamilyNames.includes(group)){
        const q=new URLSearchParams({group,mode:'add',type:SERVICE_OFFER_TYPE});
        return `#service-group?${q}`;
      }
      const visibleEntry=serviceVisibleEntry(group);
      if(serviceEntryVariants[visibleEntry]?.length&&group===visibleEntry){
        const q=new URLSearchParams({group:visibleEntry,mode:'add',type:SERVICE_OFFER_TYPE});
        return `#service-entry?${q}`;
      }
      return listingAddUrl({
        category:'Услуги',
        subcategory:serviceCanonical(group),
        type:SERVICE_OFFER_TYPE,
        discovery:group
      });
    }
    if(context==='Работа') return listingAddUrl({category:'Работа',type:type||'Предлага работа',discovery:group});
    if(context==='Имоти') return listingAddUrl({category:'Имоти',type:type||'Продава имот',discovery:group});
    if(context==='Купува и продава') return listingAddUrl({category:goodsCategoryByDiscovery[group]||'Друго',discovery:group});
    if(context==='Автомобили'){
      if(group==='Автомобилни услуги') return '#uslugi';
      return listingAddUrl({category:'Автомобили и МПС',discovery:group});
    }
    if(context==='Животни'){
      return listingAddUrl({category:'Животни',type:animalSuggestedTypeByDiscovery[group]||'',discovery:group});
    }
    return listingAddUrl({category:context,discovery:group,type});
  }

  window.PopitaiStage2Contracts=Object.freeze({
    SERVICE_OFFER_TYPE,
    serviceCanonicalMap,
    serviceEntryVariants,
    serviceSearchAliases,
    activeServiceCanonical,
    serviceFamilyNames,
    discoveryGroups,
    animalSuggestedTypeByDiscovery,
    goodsCategoryByDiscovery,
    shopTags,
    shopTagsByCategory,
    shopLegacyAliases,
    listingSubcategories,
    listingTypes,
    serviceCanonical,
    serviceVisibleEntry,
    serviceVariants,
    serviceCanonicals,
    shopTagsForCategory,
    compatibilityAdapter,
    listingAddUrl,
    contextualAddUrl,
    serviceMappingCoverage:Object.keys(serviceCanonicalMap).filter(key=>key!=='Авточасти').length
  });
})();
