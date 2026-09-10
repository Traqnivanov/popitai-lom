'use strict';

(() => {
  const records=window.PopitaiPrototypeRecords;
  const data=window.PopitaiContentData;
  const favoriteEligible=new Set(['listing','firm','shop','restaurant','health','event','publication','article','info']);
  const favoriteBlockedRecords=new Set(['publication-blocked']);
  const favoriteBlockedStates=new Set(['pending','private','rejected','removed']);
  function knownRecord(id){return data.detailRecords?.[id]||records.get(id);}

  function info(){
    const items=[['⚕️','Здравна информация','info-health'],['🏛️','Институции','info-institutions'],['🚌','Транспорт','info-transport'],['🎓','Образование и култура','info-education'],['🏦','Банки и банкомати','info-banks'],['⚡','Комунални услуги','info-utilities']];
    return `<div class="page">${pageHead('Инфо Лом','Проверена местна информация с източник и дата на последна проверка.')}<div class="shell"><div class="grid cols-3">${items.map(([icon,title,id])=>`<a class="info-card" href="#detail/info?record=${id}"><h3>${icon} ${title}</h3><p>Проверени записи с източник и дата на последна проверка.</p></a>`).join('')}</div></div></div>`;
  }
  function firms(query){
    const rows=(data.approved.firms||[]).map(window.PopitaiHomeViews.publicRow).join('');
    const body=rows||'<article class="empty-card"><p>Няма публикувани фирмени профили за показване.</p></article>';
    return `<div class="page">${pageHead('Фирми','Постоянни местни профили. Фирмата не е обява.')}<div class="shell"><div class="page-tools"><a class="btn primary" href="#add/firm">＋ Добави фирма</a></div><div class="section-head" style="margin-top:24px"><div><h2>Фирмени профили</h2><p>Услуги, район и директни контакти.</p></div></div>${stateContent(query,`<div class="result-list">${body}</div>`)}</div></div>`;
  }
  function current(){
    const items=[...(data.approved.publications||[]),...(data.approved.events||[])];
    const content=items.length?`<div class="result-list">${items.map(window.PopitaiHomeViews.publicRow).join('')}</div>`:'<article class="empty-card"><h2>Няма актуално съдържание за показване</h2><p>В момента няма потвърдена публикация или предстоящо събитие за този изглед.</p></article>';
    return `<div class="page">${pageHead('Актуално','Местни публикации и предстоящи събития на едно място.')}<div class="shell">${content}</div></div>`;
  }
  function articles(){
    const rows=(data.approved.articles||[]).map(window.PopitaiHomeViews.publicRow).join('');
    return `<div class="page">${pageHead('Статии','Пълни практични ръководства с местната информация на първо място.')}<div class="shell"><div class="result-list">${rows||'<article class="empty-card"><p>Няма публикувани статии за показване.</p></article>'}</div></div></div>`;
  }
  function questions(){
    const items=data.approved.questions||[];
    const body=items.length?`<div class="result-list" style="margin-top:18px">${items.map(window.PopitaiHomeViews.publicRow).join('')}</div>`:'<article class="empty-card" style="margin-top:18px"><h2>Все още няма одобрени въпроси</h2><p>Задай въпрос, когато не намираш готов отговор в услугите, обявите или Инфо Лом.</p></article>';
    return `<div class="page">${pageHead('Въпроси','Помощ от общността, когато няма готов отговор.')}<div class="shell"><div class="page-tools"><a class="btn primary" href="#add/question">＋ Задай въпрос</a></div>${body}</div></div>`;
  }

  function sharePanel(record){
    if(!record?.actions?.share||!record.social?.shareEligible)return '';
    return `<button class="btn soft" type="button" data-open-share>Сподели</button><div class="share-overlay" data-share-overlay hidden><button class="share-backdrop" type="button" data-close-share aria-label="Затвори споделянето"></button><section class="share-drawer" role="dialog" aria-modal="true" aria-label="Сподели" tabindex="-1"><div class="share-drawer-head"><h2>Сподели</h2><button class="share-close" type="button" data-close-share aria-label="Затвори">×</button></div><div class="share-actions"><button class="btn" type="button" data-demo-share="facebook">Facebook</button><button class="btn" type="button" data-demo-share="native">Споделяне от устройството</button><button class="btn" type="button" data-demo-share="copy">Копирай линк</button></div><p class="share-demo-message help" aria-live="polite"></p>${PopitaiSocialCardComposer.render(record.social)}</section></div>`;
  }
  function favoriteTypeFor(record){
    if(record?.contentType==='firm'&&record?.addContext?.context==='Заведения')return 'restaurant';
    return record?.contentType||'';
  }
  function favoriteTitleFor(record){return PopitaiSocialCardComposer.titleFor(record?.social)||record?.heading||record?.pageTitle||'Запис';}
  function bookmarkSvg(){return '<svg class="favorite-bookmark-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 4.75A1.75 1.75 0 0 1 8.75 3h6.5A1.75 1.75 0 0 1 17 4.75v15l-5-3-5 3v-15Z"/></svg>';}
  function favoriteControl(record,detailHref,query=new URLSearchParams()){
    const type=favoriteTypeFor(record),state=query.get('state')||'';
    if(!record?.id||!favoriteEligible.has(type)||favoriteBlockedRecords.has(record.id)||favoriteBlockedStates.has(state))return '';
    const title=favoriteTitleFor(record),key=`${type}:${record.id}`;
    return `<button class="btn soft favorite-save" type="button" data-favorite-toggle data-favorite-type="${esc(type)}" data-favorite-record-id="${esc(record.id)}" data-favorite-key="${esc(key)}" data-favorite-title="${esc(title)}" data-favorite-href="${esc(detailHref)}" aria-pressed="false" aria-label="Запази „${esc(title)}“">${bookmarkSvg()}<span data-favorite-label>Запази</span></button>`;
  }
  function utilityRow(record,detailHref,query=new URLSearchParams()){
    const save=favoriteControl(record,detailHref,query),share=sharePanel(record);
    if(!save&&!share)return '';
    return `<div class="detail-utility-actions" data-favorite-utility aria-label="Полезни действия">${save}${share}<span class="sr-only" data-favorite-live aria-live="polite"></span></div>`;
  }
  function actionLink(value,label,className){
    if(typeof value!=='string'||!value.trim())return '';
    return `<a class="btn ${className}" href="${esc(value)}">${label}</a>`;
  }
  function actionBar(record,{detailHref='',query=new URLSearchParams(),includeUtility=true}={}){
    const a=record.actions||{},primary=[],trust=[];let primaryUsed=false;
    const addPrimary=html=>{primary.push(html);primaryUsed=true;};
    if(a.phone){
      const klass=primaryUsed?'soft':'primary';
      addPrimary(actionLink(a.phone,'Обади се',klass)||`<button class="btn ${klass}" type="button" data-demo-contact>Обади се</button>`);
    }
    if(a.inquiry){
      const klass=primaryUsed?'soft':'primary';
      addPrimary(actionLink(a.inquiry,'Запитване',klass)||`<button class="btn ${klass}" type="button" data-demo-inquiry>Запитване</button>`);
    }
    if(a.answer)addPrimary(`<button class="btn ${primaryUsed?'soft':'primary'}" type="button" data-demo-answer>Добави отговор</button>`);
    if(a.official)addPrimary(`<button class="btn ${primaryUsed?'soft':'primary'}" type="button" data-demo-official>Официална страница</button>`);
    if(a.site)primary.push(actionLink(a.site,'Сайт','soft')||'<button class="btn soft" type="button" data-demo-site>Сайт</button>');
    if(a.report)trust.push('<button class="btn soft" type="button" data-demo-report>Подай сигнал</button>');
    if(a.correction)trust.push(`<button class="btn soft" type="button" data-demo-correction>${esc(a.correctionLabel||'Сигнализирай грешка')}</button>`);
    const utility=includeUtility?utilityRow(record,detailHref,query):'';
    if(!primary.length&&!utility&&!trust.length)return '';
    return `<div class="detail-action">${primary.length?`<div class="detail-primary-actions">${primary.join('')}</div>`:''}${utility}${trust.length?`<div class="detail-trust-actions">${trust.join('')}</div>`:''}<p class="contact-demo-message" aria-live="polite"></p><p class="action-demo-message help" aria-live="polite"></p></div>`;
  }
  function detailHrefFor(record,{context,group,owner,type,detailType}){
    if(knownRecord(record.id))return `#detail/${record.contentType}?record=${encodeURIComponent(record.id)}`;
    const q=new URLSearchParams({context,group,owner,detail:detailType});if(type)q.set('type',type);return `#detail/${record.contentType}?${q}`;
  }
  function stableDetailHref(record,kind,query=new URLSearchParams()){
    if(record?.id==='article-pension'||knownRecord(record?.id))return `#detail/${kind}?record=${encodeURIComponent(record.id)}`;
    const clean=new URLSearchParams();
    for(const key of ['context','group','owner','type']){const value=query.get(key);if(value)clean.set(key,value);}
    const encoded=clean.toString();
    return `#detail/${kind}${encoded?`?${encoded}`:''}`;
  }
  function approvedRecordForItem(item){
    const href=String(item?.href||'');
    const match=href.match(/^#detail\/([^?]+)\?record=([^&]+)$/);
    if(!match)return null;
    const kind=match[1],id=decodeURIComponent(match[2]),record=data.detailRecords?.[id]||null;
    return record?.contentType===kind?record:null;
  }
  function recordRow(record,label){
    const row=(record?.rows||[]).find(entry=>Array.isArray(entry)&&entry[0]===label);
    return row?String(row[1]??''):'';
  }
  function listingResultMatch(record,{context,group,type}){
    if(record?.contentType!=='listing')return false;
    const category=recordRow(record,'Категория'),listingType=recordRow(record,'Тип');
    if(type&&listingType!==type)return false;
    if(context==='Купува и продава'){
      const categoryForGroup=PopitaiStage2Contracts.goodsCategoryByDiscovery[group]||'';
      return Boolean(categoryForGroup)&&category===categoryForGroup;
    }
    if(context==='Услуги'){
      const canonical=PopitaiStage2Contracts.serviceCanonical(group),subcategory=recordRow(record,'Подкатегория')||recordRow(record,'Подкатегория / вид');
      return category==='Услуги'&&Boolean(canonical)&&subcategory===canonical;
    }
    if(context==='Имоти')return category==='Имоти'&&record.social?.discovery===group;
    if(context==='Автомобили')return category==='Автомобили и МПС'&&record.social?.discovery===group;
    if(context==='Животни')return category==='Животни'&&record.social?.discovery===group;
    return false;
  }
  function resultRecordMatches(record,{context,group,owner,type,detailType}){
    if(!record||record.contentType!==detailType)return false;
    if(owner==='Listings')return listingResultMatch(record,{context,group,type});
    if(owner==='Shops')return context==='Магазини'&&record.contentType==='shop'&&record.social?.category==='Магазини'&&record.social?.discovery===group;
    if(owner==='Firms')return context==='Заведения'&&record.contentType==='firm'&&record.social?.category==='Заведения'&&record.social?.discovery===group;
    if(owner==='Health/Info')return context==='Здраве и лекари'&&record.contentType==='health'&&record.social?.category==='Здраве и лекари'&&record.social?.discovery===group;
    return false;
  }
  function approvedResultItems(owner){
    if(owner==='Shops')return data.approved.shops||[];
    if(owner==='Firms')return data.approved.firms||[];
    if(owner==='Health/Info')return data.approved.health||[];
    return data.approved.latest||[];
  }
  function results(query){
    const context=query.get('context')||'Обяви и услуги',group=query.get('group')||'Всички',detailType=query.get('detail')||'listing',owner=query.get('owner')||'Listings',type=query.get('type')||'',isService=context==='Услуги';
    const serviceFamily=isService?serviceFamilies.find(f=>f.slice(1).includes(group)||f[0]===group):null;
    const offerTarget=PopitaiStage2Contracts.contextualAddUrl({context,group,owner,type:isService?'Дава':type});
    const matched=approvedResultItems(owner).filter(item=>resultRecordMatches(approvedRecordForItem(item),{context,group,owner,type,detailType}));
    const resultBody=matched.length?matched.map(window.PopitaiHomeViews.publicRow).join(''):'<article class="empty-card"><h2>Няма активни предложения</h2><p>В момента няма публикувани активни предложения в този раздел.</p></article>';
    const breadcrumb=isService?`<div class="breadcrumbs"><a href="#uslugi">Услуги</a> · ${serviceFamily?.[0]==='Майстори, ремонти и дом'?'<a href="#maistori">Майстори</a>':serviceFamily?`<a href="#service-group?group=${encodeURIComponent(serviceFamily[0])}">${esc(serviceFamily[0])}</a>`:''} · ${esc(group)}</div>`:'';
    const head=isService?`<div class="shell page-head">${breadcrumb}<h1>${esc(group)} услуги в Лом</h1><p>Разгледай местните предложения и избери подходящото.</p></div>`:pageHead(group,`Разгледай резултатите в „${context}“.`,'Обяви и услуги');
    const controls=isService?`<div class="results-toolbar"><details><summary class="btn soft">Филтри</summary><div class="results-filter-panel"><label>Район<select><option>Лом и региона</option></select></label></div></details><label class="results-sort">Сортиране<select><option>Най-нови</option><option>Най-подходящи</option></select></label></div>`:`<div class="results-toolbar"><details><summary class="btn soft">Филтри</summary><div class="results-filter-panel"><label>Район<select><option>Лом и региона</option></select></label><label>Тип<select><option>Всички</option><option>Предлагам</option><option>Търси</option></select></label></div></details><label class="results-sort">Сортиране<select><option>Най-нови</option><option>Най-подходящи</option></select></label></div>`;
    const actions=isService?`<div class="page-tools"><a class="btn primary" href="${offerTarget}">Предлагам ${esc(group)} услуга</a></div><div class="results-question-fallback"><span>Не намираш необходимото?</span><a href="#add/question">Задай въпрос</a></div>`:`<div class="page-tools"><a class="btn primary" href="${offerTarget}">${owner==='Shops'?'＋ Добави магазин':owner==='Health/Info'?'＋ Добави лекар / практика':'＋ Публикувай'}</a><a class="btn" href="#add/question">Не намираш? Задай въпрос</a></div>`;
    return `<div class="page results-page">${head}<div class="shell">${controls}<div class="result-list">${stateContent(query,resultBody)}</div>${actions}</div></div>`;
  }

  function pensionDetail(query=new URLSearchParams()){
    const a=data.pension.article;
    const record={id:'article-pension',contentType:'article',heading:a.title,pageTitle:a.title,actions:{share:true},social:data.pension.social};
    const utility=utilityRow(record,'#detail/article?record=article-pension',query);
    return `<div class="page article-detail-page">${pageHead(a.title,a.description,'Статии · Пенсии')}${utility?`<div class="shell detail-early-utility">${utility}</div>`:''}<div class="shell article-detail-shell">
      <div class="notice ok"><strong>Ръководство · Попитай.Лом</strong><p>Проверено по данни на НОИ · септември 2026</p></div>
      <section class="content-card article-detail-section"><h2>НОИ в Лом</h2><h3>Офис НОИ · Лом</h3><p><strong>Пенсионно обслужване</strong></p><div class="kv"><strong>Адрес</strong><span>ул. „Георги Манафски“ №19</span></div><div class="kv"><strong>Приемно време</strong><span>Четвъртък · 09:00–16:00 ч.</span></div><div class="kv"><strong>Телефон</strong><span>0882 91 23 84</span></div><p>Добре е да носите лична карта и наличните документи за трудов и осигурителен стаж. При конкретен пенсионен случай служителите ще ви кажат какво още е необходимо.</p></section>
      <section class="content-card article-detail-section"><h2>Кога се налага посещение в Монтана</h2><p>ТП НОИ – Монтана се посещава, когато услугата не се извършва в офиса в Лом или случаят трябва да бъде поет от специализиран отдел.</p><ul><li>болнични и краткосрочни плащания;</li><li>обезщетения за безработица;</li><li>осигурителен архив;</li><li>друг специализиран случай, за който НОИ ви насочи.</li></ul><div class="kv"><strong>Адрес</strong><span>бул. „Трети март“ №76</span></div><div class="kv"><strong>Работно време</strong><span>08:00–16:30 ч.</span></div><div class="kv"><strong>Пенсии</strong><span>096 39 41 37</span></div></section>
      <section class="content-card article-detail-section"><h2>Кога можете да се пенсионирате</h2><p>По общия ред трябва едновременно да имате необходимата възраст и осигурителен стаж.</p><div class="kv"><strong>Жени · 2026 г.</strong><span>62 г. и 6 месеца + 36 г. и 10 месеца осигурителен стаж</span></div><div class="kv"><strong>Мъже · 2026 г.</strong><span>64 г. и 9 месеца + 39 г. и 10 месеца осигурителен стаж</span></div><p><strong>От 2027 г.</strong> необходимият стаж достига 37 години за жените и 40 години за мъжете. След това стажът остава същият, а възрастта продължава да се променя по законовия график.</p></section>
      <section class="content-card article-detail-section"><h2>Какво да подготвите</h2><ul><li>заявление УП-1;</li><li>трудова или служебна книжка;</li><li>осигурителна книжка, ако е приложимо;</li><li>документи за липсващи периоди от стажа;</li><li>други удостоверения, ако бъдат поискани за конкретния случай.</li></ul><p>Ако имате стар или непълен трудов стаж, проверете документите си предварително.</p></section>
      <section class="content-card article-detail-section"><h2>Важен срок</h2><p>Ако заявлението и необходимите документи бъдат подадени до <strong>2 месеца след придобиване на правото на пенсия</strong>, пенсията се отпуска от датата, на която правото е възникнало. При по-късно подаване — от датата на заявлението.</p></section>
      <section class="content-card article-detail-section"><h2>Ако не можете да отидете лично</h2><p>Заявлението може да бъде подадено и чрез упълномощено лице или по електронен път според изискванията на НОИ.</p></section>
      <div class="notice"><strong>Източник</strong><p>Национален осигурителен институт (НОИ). Условията са за пенсия за осигурителен стаж и възраст по общия ред; при специални случаи правилата и документите могат да бъдат различни.</p></div></div></div>`;
  }

  function detailMedia(record,title){
    const logo=record?.media?.logo||'',images=Array.isArray(record?.media?.images)?record.media.images:[];
    const items=[];
    if(logo)items.push(`<div><img src="${esc(logo)}" alt="Лого на ${esc(title)}" loading="lazy" style="width:100%;height:100%;min-height:110px;object-fit:contain;border-radius:13px;background:#fff"></div>`);
    for(const [index,url] of images.entries())items.push(`<div><img src="${esc(url)}" alt="Снимка ${index+1} към ${esc(title)}" loading="lazy" style="width:100%;height:100%;min-height:110px;object-fit:cover;border-radius:13px"></div>`);
    return items.length?`<div class="gallery-demo" aria-label="Снимки">${items.join('')}</div>`:'';
  }
  function detailSections(record){
    const sections=Array.isArray(record?.sections)?record.sections:[];
    return sections.map(section=>`<section class="content-card article-detail-section"><h2>${esc(section.title)}</h2><p style="white-space:pre-line">${esc(section.body)}</p></section>`).join('');
  }
  function detail(kind,query=new URLSearchParams()){
    if(kind==='article'&&query.get('record')==='article-pension')return pensionDetail(query);
    const requested=query.get('record'),requestedRecord=requested?knownRecord(requested):null;
    if(requested&&(!requestedRecord||requestedRecord.contentType!==kind))return staticPage('Записът не е намерен','Този публичен запис не съществува или вече не е достъпен.');
    const record=requestedRecord||records.resolve(kind,query),title=PopitaiSocialCardComposer.titleFor(record.social),technicalKeys=new Set(['Canonical подкатегория','Избран контекст']);
    const visibleRows=record.rows.filter(([key,value])=>!technicalKeys.has(key)&&String(value??'').trim()).map(([key,value])=>`<div class="kv"><strong>${esc(key==='Suggested тип'?'Тип':key)}</strong><span style="white-space:pre-line">${esc(value)}</span></div>`).join('');
    const technicalRows=record.rows.filter(([key])=>technicalKeys.has(key)),qaNotes=Array.isArray(record.qaNotes)?record.qaNotes:[];
    const rawTechnical=(qaNotes.length||technicalRows.length)?`<details class="qa-adapter qa-only"><summary>Технически данни</summary>${qaNotes.map(note=>`<p>${esc(note)}</p>`).join('')}${technicalRows.map(([key,value])=>`<p><strong>${esc(key)}:</strong> ${esc(value)}</p>`).join('')}</details>`:'';
    const gallery=detailMedia(record,title),description=String(record.body||'').trim()?`<section><h2 class="detail-section-title">Описание</h2><p style="white-space:pre-line">${esc(record.body)}</p></section>`:'',sections=detailSections(record);
    const special=record.special?`<div class="notice">${esc(record.special)}</div>`:record.contentType==='info'?'<div class="notice ok">Всеки запис показва източник и дата на последна проверка.</div>':'';
    const detailHref=stableDetailHref(record,kind,query),earlyUtility=['article','publication','event'].includes(record.contentType),utility=earlyUtility?utilityRow(record,detailHref,query):'',actions=actionBar(record,{detailHref,query,includeUtility:!earlyUtility});
    return `<div class="page detail-page">${pageHead(title,record.pageDescription)}${utility?`<div class="shell detail-early-utility">${utility}</div>`:''}<div class="shell detail"><article class="detail-main">${gallery}${description}${sections}${rawTechnical}</article><aside class="detail-side">${visibleRows}${actions}${special}</aside></div></div>`;
  }
  function iconCheckpoint(){
    const candidates=[
      {label:'Доставки',file:'delivery.webp',key:'delivery',reason:'Бус, пратки и товарна количка',avoid:'да не се бърка с хамали или общ товарен транспорт'},
      {label:'Товарен транспорт',file:'cargo-transport.webp',key:'cargo',reason:'Товарен камион с укрепена стока',avoid:'да не се използва за пътна помощ'},
      {label:'Домашна помощ',file:'home-help.webp',key:'home-help',reason:'Подредено домашно бельо и ключ',avoid:'да не изглежда като професионално почистване'},
      {label:'Автомобилна диагностика',file:'auto-diagnostics.webp',key:'diagnostics',reason:'Диагностичен скенер и OBD конектор',avoid:'да не изглежда като телефон или общ автосервиз'},
      {label:'Борба с вредители',file:'pest-control.webp',key:'pest-control',reason:'Професионална пръскачка и вредител',avoid:'да не изглежда като градинско поливане'},
      {label:'Почистване на дом',file:'home-cleaning.webp',key:'home-cleaning',reason:'Кофа, моп, препарат и микрофибърна кърпа',avoid:'да не изглежда като хотелска количка или пране на мека мебел'},
      {label:'Монтажи и мебели',file:'furniture-assembly.webp',key:'assembly',reason:'Монтаж на мебелен елемент с винтоверт',avoid:'да не изглежда като общ електроинструмент'},
      {label:'ВиК',file:'plumbing.webp',key:'plumbing',reason:'Тръбна връзка и спирателен кран',avoid:'да не се използва като общ знак за всички ремонти'},
      {label:'Бани и плочки',file:'bathroom-tiles.webp',key:'bathroom-tiles',reason:'Вана, керамични плочки и маламашка',avoid:'да не изглежда като обща ВиК услуга'},
      {label:'Електро',file:'electrical.webp',key:'electrical',reason:'Професионален мултиметър и измервателни сонди',avoid:'да не изглежда като електроника или автодиагностика'},
      {label:'Покриви',file:'roofing.webp',key:'roofing',reason:'Червени керемиди, комин, обшивка и отделна керемида',avoid:'да не изглежда като зидария, мазилка или общ знак за имот'},
      {label:'Шпакловка, гипсокартон и боядисване',file:'wall-finishing.webp',key:'wall-finishing',reason:'Гипсокартонена фуга, шпакла и валяк',avoid:'да не изглежда като само боядисване'},
      {label:'Дограма и врати',file:'joinery.webp',key:'joinery',reason:'PVC прозорец и входна врата',avoid:'да не изглежда като общ знак за къща или имот'},
      {label:'Отопление и климатици',file:'heating-cooling.webp',key:'heating-cooling',reason:'Климатик, радиатор и двоен температурен контрол',avoid:'да не изглежда като само охлаждане или само отопление'}
    ];
    const siteIcon=(item,className)=>`<span class="${className}" aria-hidden="true"><img src="icon-review-assets/site/${item.file}" alt="" width="128" height="128"></span>`;
    const socialIcon=item=>`<img class="icon-social-art" src="icon-review-assets/social/${item.file}" alt="" width="512" height="512" aria-hidden="true">`;
    const sizeProof=item=>`<div class="icon-size-ladder" aria-label="${item.label} при 64, 48 и 24 пиксела"><span class="icon-pixel-sample sample-64"><img src="icon-review-assets/site/${item.file}" alt=""></span><span class="icon-pixel-sample sample-48"><img src="icon-review-assets/site/${item.file}" alt=""></span><span class="icon-pixel-sample sample-24"><img src="icon-review-assets/site/${item.file}" alt=""></span><small>64 · 48 · 24 px</small></div>`;
    const socialExamples=[
      {...candidates.find(item=>item.key==='plumbing'),eyebrow:'УСЛУГА · ВИК',title:'ВиК специалист в Лом'},
      {...candidates.find(item=>item.key==='diagnostics'),eyebrow:'АВТОУСЛУГА · ДИАГНОСТИКА',title:'Автомобилна диагностика в Лом'},
      {...candidates.find(item=>item.key==='delivery'),eyebrow:'УСЛУГА · ДОСТАВКИ',title:'Доставка в Лом и региона'},
      {...candidates.find(item=>item.key==='home-cleaning'),eyebrow:'УСЛУГА · ПОЧИСТВАНЕ',title:'Почистване на дом в Лом'},
      {...candidates.find(item=>item.key==='roofing'),eyebrow:'РЕМОНТ · ПОКРИВИ',title:'Ремонт на покрив в Лом'},
      {...candidates.find(item=>item.key==='wall-finishing'),eyebrow:'РЕМОНТ · СТЕНИ',title:'Шпакловка и боядисване в Лом'},
      {...candidates.find(item=>item.key==='joinery'),eyebrow:'РЕМОНТ · ДОГРАМА',title:'Дограма и врати в Лом'},
      {...candidates.find(item=>item.key==='heating-cooling'),eyebrow:'УСЛУГА · КЛИМАТ',title:'Отопление и климатици в Лом'}
    ];
    return `<div class="page icon-system-page">${pageHead('Икони — контролиран Work 2 checkpoint','Четиринадесет semantic assets са приети от owner и се проверяват заедно на desktop, 390 px и 24–64 px. Това не е одобрение на целия комплект.')}<div class="shell"><div class="icon-system-boundary"><strong>Нищо тук не заменя иконите в сайта.</strong><span>Production, Supabase и Stage 3 не са променяни. Всеки следващ знак чака отделно owner решение.</span></div><section aria-labelledby="icon-review-title"><div class="section-head"><div><h2 id="icon-review-title">Desktop и малки размери</h2><p>Оценяваме разпознаваемостта, не красотата на големия оригинал.</p></div></div><div class="icon-candidate-grid">${candidates.map(item=>`<article class="icon-candidate-card" data-icon-key="${item.key}"><span class="icon-candidate-status">ПРИЕТО · WORK 2</span><div class="icon-candidate-head">${siteIcon(item,'icon-candidate-emblem')}<div><h3>${item.label}</h3><p>${item.reason}</p></div></div>${sizeProof(item)}<small><strong>Да не се бърка:</strong> ${item.avoid}.</small></article>`).join('')}</div></section><section class="icon-mobile-review" aria-labelledby="icon-mobile-title"><div class="section-head"><div><h2 id="icon-mobile-title">Mobile симулация · 390 px</h2><p>Това е плътността на реален category списък: 56 px знак, винаги с видим текст.</p></div></div><div class="icon-mobile-device"><div class="icon-mobile-toolbar"><strong>Услуги в Лом</strong><span>390 px</span></div><div class="icon-mobile-list">${candidates.map(item=>`<article>${siteIcon(item,'icon-mobile-emblem')}<div><strong>${item.label}</strong><span>${item.reason}</span></div><b aria-hidden="true">›</b></article>`).join('')}</div></div></section><section class="icon-social-review" aria-labelledby="icon-social-title"><div class="section-head"><div><h2 id="icon-social-title">Social карта без одобрена снимка</h2><p>Използва отделен по-голям оптимизиран вариант от същата тема; не уголемява малкия site файл.</p></div></div><div class="icon-social-grid">${socialExamples.map(item=>`<article class="icon-social-card icon-social-card--raster" data-icon-key="${item.key}" aria-label="Social пример за ${item.label}"><div class="icon-social-copy"><span>${item.eyebrow}</span><strong>${item.title}</strong><small>Лом и региона</small></div>${socialIcon(item)}<b>Попитай.Лом</b></article>`).join('')}</div></section><div class="icon-system-decision"><strong>Правило за следващата стъпка</strong><p>Не изработваме механично 59 различни картинки. Собствен leaf знак има само когато family знакът би бил неточен; дългите филтри остават с видим текст. Одобрена медия → точна leaf тема → family/category → Lom fallback.</p></div></div></div>`;
  }

  Object.assign(window,{info,firms,current,articles,questions,results,detail,iconCheckpoint});
  window.PopitaiContentViews=Object.freeze({info,firms,current,articles,questions,results,detail,iconCheckpoint});
})();
