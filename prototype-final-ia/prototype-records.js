'use strict';

(() => {
  const contracts=window.PopitaiStage2Contracts;
  const BASE_URL='https://traqnivanov.github.io/popitai-lom/prototype-final-ia/';

  const compositionByType=Object.freeze({
    listing:'marketplace',
    firm:'profile',
    shop:'profile',
    health:'profile',
    article:'editorial',
    publication:'editorial',
    event:'event',
    question:'community',
    info:'community'
  });

  const contentRoleByType=Object.freeze({
    listing:'marketplace',
    firm:'profile',
    shop:'specialized',
    health:'specialized',
    article:'editorial',
    publication:'editorial',
    event:'event',
    question:'community',
    info:'verified-information'
  });

  const descriptionByType=Object.freeze({
    listing:'Обява или услуга в Лом и региона с точен избран контекст.',
    firm:'Местен фирмен профил с услуги, район и директни контакти.',
    shop:'Местен магазин в Лом с категория и публично безопасно описание.',
    health:'Здравен профил в Лом с консервативен публичен преглед.',
    article:'Практично ръководство от Попитай.Лом.',
    publication:'Местна публикация от Попитай.Лом с конкретна самостоятелна цел.',
    event:'Дата, място и най-важното за текущото публично събитие.',
    question:'Въпрос и отговори от общността в Попитай.Лом.',
    info:'Проверена информация за Лом с източник и последна проверка.'
  });

  function canonicalUrl(kind,id){
    return `${BASE_URL}#detail/${encodeURIComponent(kind)}?record=${encodeURIComponent(id)}`;
  }

  function social({
    id,contentType,title='',description='',category='',discovery='',visualTheme='',
    icon='',accent='blue',mediaAvailable=false,mediaType='',location='Лом',
    shareEligible=true,facebookText='',composition='',contentRole=''
  }){
    return Object.freeze({
      contentType,
      contentRole:contentRole||contentRoleByType[contentType]||'marketplace',
      title,
      description:description||descriptionByType[contentType]||'',
      category,
      discovery,
      visualTheme,
      icon,
      accent,
      mediaAvailable:Boolean(mediaAvailable),
      mediaType,
      canonicalUrl:canonicalUrl(contentType,id),
      location,
      shareEligible:Boolean(shareEligible),
      facebookText:facebookText||'Текстът над споделения линк се пише от човека, който споделя.',
      composition:composition||compositionByType[contentType]||'community'
    });
  }

  function record(spec){
    const id=spec.id;
    const contentType=spec.contentType;
    const addContext=spec.addContext||null;
    const addUrl=addContext&&contracts?.contextualAddUrl?contracts.contextualAddUrl(addContext):'';
    return Object.freeze({
      id,
      contentType,
      contentRole:spec.contentRole||contentRoleByType[contentType]||'marketplace',
      owner:spec.owner||(addContext?.owner||''),
      pageTitle:spec.pageTitle||spec.heading||'Примерен запис',
      pageDescription:spec.pageDescription||descriptionByType[contentType]||'',
      heading:spec.heading||spec.title||'',
      body:spec.body||'',
      rows:Object.freeze(spec.rows||[]),
      actions:Object.freeze(spec.actions||{}),
      special:spec.special||'',
      qaNotes:Object.freeze(spec.qaNotes||[]),
      addContext:addContext?Object.freeze({...addContext}):null,
      addUrl,
      social:social({...spec,id,contentType,title:spec.title??spec.heading??''})
    });
  }

  const fixed=Object.freeze({
    'listing-vik':record({
      id:'listing-vik',contentType:'listing',title:'Предлагам ВиК услуги в Лом',
      pageTitle:'ВиК — примерен резултат',heading:'Предлагам ВиК услуги в Лом',
      body:'ВиК ремонти и аварийни услуги в Лом и региона.',
      category:'Услуги',discovery:'ВиК',visualTheme:'Услуги · ВиК',icon:'services',accent:'blue',
      rows:[['Категория','Услуги'],['Избран контекст','ВиК'],['Canonical подкатегория','ВиК'],['Район','Лом']],
      actions:{phone:true,share:true,report:true},
      addContext:{context:'Услуги',group:'ВиК',owner:'Listings'}
    }),
    'listing-catering':record({
      id:'listing-catering',contentType:'listing',title:'Кетъринг в Лом',
      pageTitle:'Кетъринг — примерен резултат',heading:'Кетъринг в Лом',
      body:'Кетъринг за семейни тържества, фирмени събития и други поводи в Лом и региона.',
      qaNotes:['Избраният контекст „Кетъринг“ се запазва по пътя, а compatibility mapping-ът остава отделна техническа проверка.'],
      category:'Услуги',discovery:'Кетъринг',visualTheme:'Услуги · Кетъринг',icon:'services',accent:'gold',
      rows:[['Категория','Услуги'],['Избран контекст','Кетъринг'],['Canonical подкатегория','Фото, видео и събитийни услуги'],['Район','Лом']],
      actions:{phone:true,share:true,report:true},
      addContext:{context:'Услуги',group:'Кетъринг',owner:'Listings'}
    }),
    'listing-cleaning':record({
      id:'listing-cleaning',contentType:'listing',title:'',
      pageTitle:'Почистване — примерен резултат',heading:'',
      body:'Почистване на домове и малки обекти в Лом и региона.',
      qaNotes:['Записът е без собствено title, за да се проверява fallback заглавието „Почистване в Лом“ в detail и Social Card.'],
      category:'Услуги',discovery:'Почистване',visualTheme:'Услуги · Почистване',icon:'services',accent:'teal',
      rows:[['Категория','Услуги'],['Избран контекст','Почистване'],['Район','Лом']],
      actions:{share:true},
      addContext:{context:'Услуги',group:'Почистване',owner:'Listings'}
    }),
    'listing-work':record({
      id:'listing-work',contentType:'listing',title:'Работа — строителство и техници в Лом',
      pageTitle:'Работа — примерен резултат',heading:'Работа — строителство и техници в Лом',
      body:'Обява за работа в строителството и техническите дейности в Лом с ясно посочена област и основни условия.',
      qaNotes:['Избраната работна област се запазва до detail и формата.'],
      category:'Работа',discovery:'Строителство, ремонти и техници',visualTheme:'Работа · строителство',icon:'services',accent:'blue',
      rows:[['Категория','Работа'],['Област','Строителство, ремонти и техници'],['Тип','Предлага работа']],
      actions:{share:true,report:true},
      addContext:{context:'Работа',group:'Строителство, ремонти и техници',owner:'Listings',type:'Предлага работа'}
    }),
    'listing-property':record({
      id:'listing-property',contentType:'listing',title:'Продава се апартамент в Лом',
      pageTitle:'Имоти — примерен резултат',heading:'Продава се апартамент в Лом',
      body:'Обява за продажба на апартамент в Лом с основна информация за имота и условията.',
      qaNotes:['Намерението и видът имот се запазват до detail и contextual Add.'],
      category:'Имоти',discovery:'Апартамент',visualTheme:'Имоти · Апартамент',icon:'services',accent:'blue',
      rows:[['Категория','Имоти'],['Намерение','Продава имот'],['Вид имот','Апартамент']],
      actions:{share:true,report:true},
      addContext:{context:'Имоти',group:'Апартамент',owner:'Listings',type:'Продава имот'}
    }),
    'listing-auto':record({
      id:'listing-auto',contentType:'listing',title:'Автомобили и джипове в Лом',
      pageTitle:'Автомобили — примерен резултат',heading:'Автомобили и джипове в Лом',
      body:'Обява за автомобил или джип в Лом с основни данни за превозното средство и състоянието му.',
      qaNotes:['Точният discovery избор остава видим до detail и формата.'],
      category:'Автомобили и МПС',discovery:'Автомобили и джипове',visualTheme:'Автомобили · МПС',icon:'cars',accent:'blue',
      rows:[['Категория','Автомобили и МПС'],['Избран контекст','Автомобили и джипове']],
      actions:{share:true,report:true},
      addContext:{context:'Автомобили',group:'Автомобили и джипове',owner:'Listings'}
    }),
    'listing-animal':record({
      id:'listing-animal',contentType:'listing',title:'Животно търси дом в Лом',
      pageTitle:'Животни — примерен резултат',heading:'Животно търси дом в Лом',
      body:'Обява за животно, което търси дом в Лом, с най-важната информация за осиновяване.',
      qaNotes:['Discovery „Осиновяване / търси дом“ остава видим, без да се представя като нова persisted подкатегория.'],
      category:'Животни',discovery:'Осиновяване / търси дом',visualTheme:'Животни · Осиновяване',icon:'animals',accent:'green',
      rows:[['Категория','Животни'],['Избран контекст','Осиновяване / търси дом'],['Suggested тип','Дава']],
      actions:{share:true,report:true},
      addContext:{context:'Животни',group:'Осиновяване / търси дом',owner:'Listings'}
    }),
    'firm-repairs':record({
      id:'firm-repairs',contentType:'firm',title:'Примерен местен фирмен профил',
      pageTitle:'Примерен фирмен профил',heading:'Примерен местен фирмен профил',
      body:'Постоянен фирмен профил, отделен от конкретните обяви.',
      category:'Майстори и ремонти',discovery:'',visualTheme:'Фирма · ремонти',icon:'repairs',accent:'gold',
      mediaAvailable:true,mediaType:'approved-logo-or-photo',
      rows:[['Категория','Майстори и ремонти'],['Район','Лом']],
      actions:{phone:true,inquiry:true,share:true,report:true},
      addContext:{context:'Фирми',group:'',owner:'Firms'}
    }),
    'shop-food':record({
      id:'shop-food',contentType:'shop',title:'Хранителен магазин в Лом',
      pageTitle:'Магазин — примерен резултат',heading:'Хранителен магазин в Лом',
      body:'Публично безопасен примерен магазин с ясна категория.',
      category:'Хранителни',discovery:'Хранителни',visualTheme:'Магазини · Хранителни',icon:'services',accent:'gold',
      rows:[['Категория','Хранителни'],['Район','Лом']],
      actions:{phone:true,correction:true,share:true},
      addContext:{context:'Магазини',group:'Хранителни',owner:'Shops'}
    }),
    'health-doctor':record({
      id:'health-doctor',contentType:'health',title:'Примерен лекар — специалист в Лом',
      pageTitle:'Здравен профил — пример',heading:'Примерен лекар — специалист в Лом',
      body:'Профил на лекар специалист в Лом с основна специалност, контакт и местна информация.',
      qaNotes:['Submission contract-ът поддържа лекар/медицинска практика, стоматолог/дентална практика и ветеринар/кабинет; по-широката „здравна услуга“ остава отделна OPEN тема.'],
      category:'Здраве и лекари',discovery:'Специалисти',visualTheme:'Здраве · Специалист',icon:'health',accent:'teal',
      rows:[['Тип','Лекар / медицинска практика'],['Специалност','Примерна специалност'],['Район','Лом']],
      actions:{phone:true,correction:true,share:true},
      addContext:{context:'Здраве и лекари',group:'Специалисти',owner:'Health/Info'}
    }),
    'article-guide':record({
      id:'article-guide',contentType:'article',title:'Как да решиш конкретна задача в Лом',
      pageTitle:'Примерна статия',heading:'Как да решиш конкретна задача в Лом',
      body:'Пълно практично ръководство с местната информация на първо място.',
      category:'Статии',discovery:'Практично ръководство',visualTheme:'Статии · Ръководство',icon:'articles',accent:'blue',
      rows:[['Вид','Ръководство'],['Фокус','Лом и региона']],actions:{share:true}
    }),
    'publication-update':record({
      id:'publication-update',contentType:'publication',title:'Местна актуализация',
      pageTitle:'Примерна публикация',heading:'Местна актуализация',
      body:'Публикацията има конкретна самостоятелна цел и няма фиксирана максимална дължина.',
      category:'Публикации',discovery:'Местна актуализация',visualTheme:'Публикации · Актуално',icon:'publications',accent:'gold',
      mediaAvailable:true,mediaType:'approved-publication-photo',
      rows:[['Вид','Публикация'],['Тема','Местна актуализация']],actions:{share:true}
    }),
    'publication-blocked':record({
      id:'publication-blocked',contentType:'publication',title:'Публикация — непубличен пример',
      pageTitle:'Blocked Share QA',heading:'Публикация — непубличен пример',
      body:'Този mock record е изрично shareEligible=false.',
      category:'Публикации',discovery:'QA blocked',visualTheme:'Публикации · QA',icon:'publications',accent:'gold',
      shareEligible:false,rows:[['Share eligibility','blocked']],actions:{share:true}
    }),
    'event-local':record({
      id:'event-local',contentType:'event',title:'Предстоящо местно събитие',
      pageTitle:'Примерно събитие',heading:'Предстоящо местно събитие',
      body:'Публично се показва текущо или предстоящо одобрено събитие.',
      category:'Събития',discovery:'Предстоящо',visualTheme:'Събитие · Лом',icon:'publications',accent:'green',
      rows:[['Дата и час','12 септември · 18:00'],['Място','Лом']],actions:{share:true},
      special:'Публично се показват само текущи и предстоящи събития.'
    }),
    'question-community':record({
      id:'question-community',contentType:'question',title:'Къде в Лом мога да намеря добър ВиК майстор?',
      pageTitle:'Примерен въпрос',heading:'Къде в Лом мога да намеря добър ВиК майстор?',
      body:'Отговорите от общността са различени от проверената информация в Инфо Лом.',
      category:'Въпроси',discovery:'Майстори и ремонти',visualTheme:'Общност · Въпрос',icon:'services',accent:'blue',
      rows:[['Категория','Майстори и ремонти']],actions:{answer:true,share:true,report:true}
    }),
    'info-health':record({
      id:'info-health',contentType:'info',title:'Здраве — Инфо Лом',
      pageTitle:'Инфо Лом — Здраве',heading:'Здраве — Инфо Лом',
      body:'Проверена справочна информация за здравни записи, отделна от частните обяви и услуги.',
      category:'Инфо Лом',discovery:'Здраве',visualTheme:'Инфо Лом · Здраве',icon:'health',accent:'teal',
      rows:[['Раздел','Здраве'],['Източник','Показва се при реален запис'],['Последно проверено','Показва се при реален запис']],
      actions:{official:true,correction:true,share:true}
    }),
    'info-institutions':record({
      id:'info-institutions',contentType:'info',title:'Институции — Инфо Лом',
      pageTitle:'Инфо Лом — Институции',heading:'Институции — Инфо Лом',
      body:'Проверена справочна информация за институции.',
      category:'Инфо Лом',discovery:'Институции',visualTheme:'Инфо Лом · Институции',icon:'services',accent:'blue',
      rows:[['Раздел','Институции'],['Източник','Показва се при реален запис'],['Последно проверено','Показва се при реален запис']],
      actions:{official:true,correction:true,share:true}
    }),
    'info-transport':record({
      id:'info-transport',contentType:'info',title:'Транспорт — Инфо Лом',
      pageTitle:'Инфо Лом — Транспорт',heading:'Транспорт — Инфо Лом',
      body:'Проверена справочна информация за транспорт.',
      category:'Инфо Лом',discovery:'Транспорт',visualTheme:'Инфо Лом · Транспорт',icon:'cars',accent:'blue',
      rows:[['Раздел','Транспорт'],['Източник','Показва се при реален запис'],['Последно проверено','Показва се при реален запис']],
      actions:{official:true,correction:true,share:true}
    }),
    'info-education':record({
      id:'info-education',contentType:'info',title:'Образование и култура — Инфо Лом',
      pageTitle:'Инфо Лом — Образование и култура',heading:'Образование и култура — Инфо Лом',
      body:'Проверена справочна информация за образование и култура.',
      category:'Инфо Лом',discovery:'Образование и култура',visualTheme:'Инфо Лом · Образование и култура',icon:'articles',accent:'blue',
      rows:[['Раздел','Образование и култура'],['Източник','Показва се при реален запис'],['Последно проверено','Показва се при реален запис']],
      actions:{official:true,correction:true,share:true}
    }),
    'info-banks':record({
      id:'info-banks',contentType:'info',title:'Банки и банкомати — Инфо Лом',
      pageTitle:'Инфо Лом — Банки и банкомати',heading:'Банки и банкомати — Инфо Лом',
      body:'Проверена справочна информация за банки и банкомати.',
      category:'Инфо Лом',discovery:'Банки и банкомати',visualTheme:'Инфо Лом · Банки и банкомати',icon:'services',accent:'gold',
      rows:[['Раздел','Банки и банкомати'],['Източник','Показва се при реален запис'],['Последно проверено','Показва се при реален запис']],
      actions:{official:true,correction:true,share:true}
    }),
    'info-utilities':record({
      id:'info-utilities',contentType:'info',title:'Комунални услуги — Инфо Лом',
      pageTitle:'Инфо Лом — Комунални услуги',heading:'Комунални услуги — Инфо Лом',
      body:'Проверена справочна информация за комунални услуги.',
      category:'Инфо Лом',discovery:'Комунални услуги',visualTheme:'',
      icon:'utilities',accent:'teal',
      rows:[['Раздел','Комунални услуги'],['Източник','Показва се при реален запис'],['Последно проверено','Показва се при реален запис']],
      actions:{official:true,correction:true,share:true}
    })
  });

  const defaults=Object.freeze({
    listing:'listing-vik',
    firm:'firm-repairs',
    shop:'shop-food',
    health:'health-doctor',
    article:'article-guide',
    publication:'publication-update',
    event:'event-local',
    question:'question-community',
    info:'info-health'
  });

  function idForContext(context,group,owner,type=''){
    if(context==='Услуги'&&group==='ВиК') return 'listing-vik';
    if(context==='Услуги'&&group==='Кетъринг') return 'listing-catering';
    if(context==='Работа'&&group==='Строителство, ремонти и техници'&&(!type||type==='Предлага работа')) return 'listing-work';
    if(context==='Имоти'&&group==='Апартамент'&&(!type||type==='Продава имот')) return 'listing-property';
    if(context==='Автомобили'&&group==='Автомобили и джипове') return 'listing-auto';
    if(context==='Животни'&&group==='Осиновяване / търси дом') return 'listing-animal';
    if((owner==='Shops'||context==='Магазини')&&group==='Хранителни') return 'shop-food';
    if((owner==='Health/Info'||context==='Здраве и лекари')&&['Специалисти','Лекари'].includes(group)) return 'health-doctor';
    return '';
  }

  function syntheticFromContext({context='Обяви и услуги',group='Всички',owner='Listings',type='',detailType='listing'}={}){
    const isShop=owner==='Shops'||context==='Магазини'||detailType==='shop';
    const contentType=isShop?'shop':detailType==='firm'?'firm':detailType==='health'?'health':'listing';
    const id=`synthetic-${encodeURIComponent(context)}-${encodeURIComponent(group)}-${encodeURIComponent(type||'default')}`;
    const category=context==='Автомобили'?'Автомобили и МПС':context;
    const title=`${group} в Лом`;
    const actions=isShop
      ? {phone:true,correction:true,share:true}
      : {share:true,report:true};
    return record({
      id,contentType,title,pageTitle:`${group} — примерен резултат`,heading:title,
      body:`Контролираният mock record пази избрания контекст „${group}“ до detail, Social Card и Add.`,
      category,discovery:group,visualTheme:`${context} · ${group}`,icon:'services',accent:'blue',
      rows:[['Категория',category],['Избран контекст',group],...(type?[['Тип',type]]:[])],
      actions,
      addContext:{context,group,owner,type}
    });
  }

  function get(id){return fixed[id]||null;}

  function resolve(kind,query=new URLSearchParams()){
    const requested=query.get('record');
    if(requested&&fixed[requested]) return fixed[requested];
    const context=query.get('context')||'';
    const group=query.get('group')||'';
    const owner=query.get('owner')||'Listings';
    const type=query.get('type')||'';
    if(context&&group){
      const known=idForContext(context,group,owner,type);
      if(known) return fixed[known];
      return syntheticFromContext({context,group,owner,type,detailType:kind});
    }
    return fixed[defaults[kind]||defaults.listing];
  }

  function resultRecord({context,group,owner='Listings',type='',detailType='listing'}){
    const known=idForContext(context,group,owner,type);
    return known?fixed[known]:syntheticFromContext({context,group,owner,type,detailType});
  }

  window.PopitaiPrototypeRecords=Object.freeze({
    fixed,
    defaults,
    get,
    resolve,
    resultRecord,
    idForContext,
    canonicalUrl,
    compositionByType,
    contentRoleByType,
    infoIds:Object.freeze(['info-health','info-institutions','info-transport','info-education','info-banks','info-utilities'])
  });
})();