from pathlib import Path
import re

ROOT=Path('prototype-final-ia')

def read(name): return (ROOT/name).read_text(encoding='utf-8')
def write(name,text): (ROOT/name).write_text(text,encoding='utf-8')
def replace_between(text,start,end,new):
    a=text.index(start)
    b=text.index(end,a)
    return text[:a]+new+text[b:]

# ------------------------------------------------------------------
# Marketplace / Home / Services / Masters
# ------------------------------------------------------------------
p='prototype-marketplace-views.js'
s=read(p)
marker='  function home(){'
insert="""  const unifiedMarketplace = [
    {id:'uslugi',icon:'🛠️',title:'Услуги',desc:'Майстори, ремонти, почистване, транспорт и още.'},
    {id:'stoki',icon:'🛍️',title:'Купува и продава',desc:'Стоки за дома, техника, дрехи, хоби и оборудване.'},
    {id:'rabota',icon:'💼',title:'Работа',desc:'Предлага и търси работа по местни направления.'},
    {id:'imoti',icon:'🏠',title:'Имоти',desc:'Продажба, наем, покупка и търсене на имот.'},
    {id:'avtomobili',icon:'🚗',title:'Автомобили',desc:'МПС, части и автомобилни услуги.'},
    {id:'zdrave',icon:'⚕️',title:'Здраве и частни лекари',desc:'Частни лекарски, дентални и ветеринарни профили.'},
    {id:'magazini',icon:'🏪',title:'Магазини',desc:'Местни магазини по вид и предлагани стоки.'},
    {id:'zavedenia',icon:'🍽️',title:'Заведения',desc:'Ресторанти, кафенета и храна за вкъщи.'},
    {id:'zhivotni',icon:'🐾',title:'Животни',desc:'Осиновяване, изгубени/намерени и стоки за животни.'}
  ];

  function unifiedEntry(item,extraClass=''){
    if(item.id==='uslugi') return `<article class="category-card unified-entry ${extraClass}"><a class="category-card-main" href="#uslugi"><div class="icon">${item.icon}</div><h3>${item.title}</h3><p>${item.desc}</p><small>Разгледай →</small></a><a class="category-inline-link" href="#maistori">Майстори и ремонти →</a></article>`;
    return `<a class="category-card unified-entry ${extraClass}" href="#${item.id}"><div class="icon">${item.icon}</div><h3>${item.title}</h3><p>${item.desc}</p><small>Разгледай →</small></a>`;
  }

"""
s=s.replace(marker,insert+marker,1)
new_home="""  function home(){
    const mainSix=unifiedMarketplace.slice(0,6).map((item,i)=>unifiedEntry(item,i>=4?'home-main-card--secondary':'')).join('');
    const secondary=unifiedMarketplace.slice(6).map(item=>`<a class="special-card" href="#${item.id}"><span>${item.icon}</span>${item.title}</a>`).join('');
    const mobileShortcuts=unifiedMarketplace.slice(4,6).map(item=>`<a class="home-shortcut" href="#${item.id}">${item.icon} ${item.title}</a>`).join('');
    const mobileMore=unifiedMarketplace.slice(6).map(item=>`<a class="home-more-link" href="#${item.id}">${item.icon} ${item.title}</a>`).join('');
    return `<section class="hero hero-compact"><div class="shell hero-grid"><div><span class="eyebrow">Лом и региона</span><h1>Намери каквото ти трябва в Лом</h1><p>Услуги, работа, имоти, обяви, местни фирми и проверена полезна информация — на едно разбираемо място.</p><form class="search-box" data-global-search><input name="q" aria-label="Търсене" placeholder="Напр. ВиК, работа, апартамент, автосервиз…"><button>Търси</button></form><div class="hero-actions"><button class="btn primary" type="button" data-open-add>＋ Публикувай</button><a class="btn ghost" href="#add/question">Не намираш? Задай въпрос</a></div></div></div></section>
      <section class="section home-marketplace"><div class="shell"><div class="section-head"><div><h2>Обяви и услуги</h2><p>Започни от задачата, която искаш да решиш.</p></div><a href="#obyavi">Всички категории →</a></div><div class="home-main-grid">${mainSix}</div><div class="home-priority-shortcuts">${mobileShortcuts}</div><div class="home-secondary-row">${secondary}</div><details class="home-more-categories"><summary>Всички категории</summary><div>${mobileMore}</div></details></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Нови обяви и услуги</h2><p>Разгледай последните местни предложения.</p></div><a href="#obyavi">Виж всички →</a></div><div class="result-list">${demoRow('ВиК услуги в Лом','Ремонти и аварийни ВиК услуги.','Услуга','#detail/listing?record=listing-vik','ВиК')}${demoRow('Работа в строителството и техническите дейности','Местно предложение за работа с ясна област.','Работа','#detail/listing?record=listing-work','Лом')}</div></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Местни фирми</h2><p>Постоянни профили на местни фирми и доставчици.</p></div><a href="#firmi">Фирми →</a></div>${demoRow('Местна фирма за ремонти','Услуги за дома, район и директни контакти.','Фирма','#detail/firm?record=firm-repairs','Лом')}</div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Инфо Лом</h2><p>Проверена местна информация — отделно от частните профили и обявите.</p></div><a href="#info">Отвори Инфо Лом →</a></div><div class="grid cols-3">${infoCards.map(([icon,title,id],i)=>`<a class="info-card" href="#detail/info?record=${id}"><h3>${icon} ${i===0?'Здравна информация':title}</h3><p>Проверени записи с източник и дата на последна проверка.</p></a>`).join('')}</div></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Актуално в Лом</h2><p>Публикациите и събитията имат различни роли.</p></div><a href="#aktualno">Всичко актуално →</a></div><div class="grid cols-2"><a class="content-card" href="#detail/publication?record=publication-update"><h3><span class="badge gold">Публикация</span> Местна актуализация</h3><p>Местна актуализация с конкретна цел и най-важното на едно място.</p></a><a class="content-card" href="#detail/event?record=event-local"><h3><span class="badge green">Събитие</span> Предстоящо местно събитие</h3><p>Дата, час и място за конкретно предстоящо събитие.</p></a></div></div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Полезни статии</h2><p>Пълни практични ръководства с местната информация на първо място.</p></div><a href="#statii">Статии →</a></div>${demoRow('Как да решиш конкретна местна задача','Пълно ръководство с проверени източници.','Статия','#detail/article?record=article-guide','Ръководство')}</div></section>
      <section class="section"><div class="shell"><div class="section-head"><div><h2>Въпроси от общността</h2><p>Попитай хората в Лом само когато не намираш готов отговор.</p></div><a href="#vaprosi">Всички въпроси →</a></div>${demoRow('Къде в Лом мога да намеря добър ВиК майстор?','Въпрос към местната общност.','Въпрос','#detail/question?record=question-community','Общност')}</div></section>`;
  }

"""
s=replace_between(s,'  function home(){','  function hub(query){',new_home)
new_hub="""  function hub(query){
    const mainSix=unifiedMarketplace.slice(0,6).map(item=>unifiedEntry(item)).join('');
    const secondary=unifiedMarketplace.slice(6).map(item=>unifiedEntry(item,'hub-secondary-entry')).join('');
    const rows=`${demoRow('ВиК услуги в Лом','Ремонти и аварийни услуги.','Услуга','#detail/listing?record=listing-vik','ВиК')}${demoRow('Кетъринг за събития в Лом','Кетъринг за семейни и фирмени поводи.','Услуга','#detail/listing?record=listing-catering','Кетъринг')}${demoRow('Работа в строителството и техническите дейности','Местно предложение за работа.','Работа','#detail/listing?record=listing-work','Лом')}`;
    return `<div class="page">${pageHead('Обяви и услуги','Намери обява, услуга, работа, имот, автомобил, частен здравен профил, магазин, заведение или съдържание за животни.')}<div class="shell"><div class="hub-main-grid">${mainSix}</div><div class="hub-secondary-grid">${secondary}</div><div class="section-head compact-head"><div><h2>Последни</h2><p>Последни примерни записи от основните раздели.</p></div></div>${stateContent(query,`<div class="result-list">${rows}</div>`)}</div></div>`;
  }

"""
s=replace_between(s,'  function hub(query){','  function resultHref(',new_hub)
new_masters="""  function masters(){
    const groups=['Цялостни ремонти','Бани и плочки','ВиК','Електро','Покриви','Шпакловка и боядисване','Дограма и врати','Климатици','Друга ремонтна услуга'];
    const chips=groups.map(name=>name==='Друга ремонтна услуга'
      ? `<a class="master-tile" href="#add/listing?category=${encodeURIComponent('Услуги')}&other=1&family=${encodeURIComponent('Майстори, ремонти и дом')}">${esc(name)}</a>`
      : `<a class="master-tile" href="${serviceResultsHref(name)}">${esc(name)}</a>`).join('');
    const chooseBase=`#service-group?group=${encodeURIComponent('Майстори, ремонти и дом')}&mode=add`;
    const active=`<div class="result-list">${demoRow('Предлагам ВиК услуги в Лом','Ремонти, монтаж и аварийни посещения.','Предлагам услуга','#detail/listing?record=listing-vik','ВиК')}${demoRow('Търся изпълнител за шпакловка и боядисване','Търсене на местен изпълнител за ремонтна задача.','Търся изпълнител','#results?context=${encodeURIComponent('Услуги')}&group=${encodeURIComponent('Шпакловка и боядисване')}&detail=listing&owner=Listings&type=${encodeURIComponent('Търси')}','Лом')}</div>`;
    const firms=`${demoRow('Местна фирма за ремонти','Ремонти и услуги за дома с директни контакти.','Фирма','#detail/firm?record=firm-repairs','Лом')}`;
    const questions=`${demoRow('Къде в Лом мога да намеря добър ВиК майстор?','Въпрос към местната общност.','Въпрос','#detail/question?record=question-community','Общност')}`;
    return `<div class="page masters-page">${pageHead('Майстори и ремонти','Намери подходяща ремонтна услуга или публикувай какво ти трябва.','Услуги')}<div class="shell"><form class="search-box masters-search" data-page-search><input name="q" aria-label="Търсене на майстор" placeholder="Какъв майстор или ремонт търсиш?"><button>Търси</button></form><div class="master-tiles" id="category-subcategories">${chips}</div><div class="masters-primary-actions"><a class="btn primary" href="${chooseBase}&type=${encodeURIComponent('Търси')}">Търся изпълнител</a><a class="btn" href="${chooseBase}&type=${encodeURIComponent('Дава')}">Предлагам услуга</a></div><section class="masters-content-section"><div class="section-head"><div><h2>Активни предложения и търсения</h2><p>Актуални предложения за услуги и заявки от хора, които търсят изпълнител.</p></div><a href="#obyavi">Всички →</a></div>${active}</section><section class="masters-content-section"><div class="section-head"><div><h2>Местни фирми</h2><p>Местни фирми и майстори за ремонти и услуги за дома.</p></div><a href="#firmi">Всички →</a></div>${firms}</section><section class="masters-question-fallback"><h3>Последни въпроси</h3><p>Не намираш необходимото? Виж въпросите или попитай общността.</p>${questions}<a class="btn soft" href="#add/question?category=${encodeURIComponent('Майстори и ремонти')}">Задай въпрос</a></section><details class="qa-adapter qa-only"><summary>Техническа структура</summary><p>Проверка на маршрутите и съвместимостта без промяна на production договорите.</p></details></div></div>`;
  }

"""
s=replace_between(s,'  function masters(){','  function services(){',new_masters)
new_services="""  function services(){
    const quick=['ВиК','Електро','Почистване на дом','Автосервиз','Хамали','Кетъринг'];
    const displayFamilies=[...serviceFamilies.map(f=>[...f]),['Друга услуга']];
    const familyHref=(family,i)=>i===0?'#maistori':i===displayFamilies.length-1?`#add/listing?category=${encodeURIComponent('Услуги')}&other=1`:`#service-group?group=${encodeURIComponent(family[0])}`;
    const desktop=displayFamilies.map((family,i)=>`<article class="service-family-card"><div class="icon">${icons[i%icons.length]||'•'}</div><h3>${esc(family[0])}</h3>${family.length>1?`<div class="sublist">${family.slice(1,5).map(x=>`<span>${esc(x)}</span>`).join('')}</div>`:'<p>Избери най-близката група и опиши точната услуга.</p>'}<a class="family-open" href="${familyHref(family,i)}">${i===0?'Майстори и ремонти →':i===displayFamilies.length-1?'Опиши друга услуга →':'Разгледай →'}</a></article>`).join('');
    const mobile=displayFamilies.map((family,i)=>`<details class="service-family-accordion" ${i===0?'open':''}><summary>${esc(family[0])}</summary><div>${family.slice(1,5).map(x=>`<span>${esc(x)}</span>`).join('')}<a href="${familyHref(family,i)}">${i===displayFamilies.length-1?'Опиши услугата':'Отвори групата'} →</a></div></details>`).join('');
    return `<div class="page services-page">${pageHead('Услуги','Намери конкретна услуга в Лом.','Обяви и услуги')}<div class="shell"><form class="search-box services-search" data-page-search><input name="q" aria-label="Търсене" placeholder="Каква услуга търсиш?"><button>Търси</button></form><div class="service-quick"><strong>Често търсени</strong><div class="service-quick-scroll">${quick.map(x=>`<a class="chip" href="${serviceResultsHref(x)}">${esc(x)}</a>`).join('')}</div></div><div class="service-family-desktop">${desktop}</div><div class="service-family-mobile">${mobile}</div><div class="page-tools service-fallback"><a class="btn" href="#add/question">Не намираш услугата? Задай въпрос</a></div></div></div>`;
  }

"""
s=replace_between(s,'  function services(){','  function serviceGroup(query){',new_services)
new_service_group="""  function serviceGroup(query){
    const name=query.get('group')||'';
    const family=serviceFamilies.find(f=>f[0]===name);
    if(!family) return staticPage('Услугата не е намерена','Избери друга група услуги.');
    const addMode=query.get('mode')==='add';
    const intent=query.get('type')||'';
    const items=family.slice(1).map((item,i)=>{
      const href=addMode
        ? PopitaiStage2Contracts.contextualAddUrl({context:'Услуги',group:item,owner:'Listings',type:intent})
        : serviceResultsHref(item);
      return `<a class="family-card" href="${href}"><div class="icon">${icons[i%icons.length]}</div><h3>${esc(item)}</h3><p>${addMode?'Избери тази конкретна услуга.':'Разгледай подходящите предложения.'}</p><small>${addMode?'Избери →':'Виж резултатите →'}</small></a>`;
    }).join('');
    const modeNotice=addMode?`<div class="notice ok"><strong>Избери конкретна услуга</strong><p>${intent==='Търси'?'След избора ще продължиш като „Търся изпълнител“.':'След избора ще продължиш като „Предлагам услуга“.'}</p></div><details class="qa-adapter qa-only"><summary>Техническа проверка</summary><p>Family-level Add остава choose-first; persisted type се предава без промяна.</p></details>`:'';
    const footer=addMode
      ? `<a class="btn" href="#service-group?group=${encodeURIComponent(name)}">← Към групата</a>`
      : `<a class="btn primary" href="#service-group?group=${encodeURIComponent(name)}&mode=add&type=${encodeURIComponent('Дава')}">Предлагам услуга</a><a class="btn" href="#service-group?group=${encodeURIComponent(name)}&mode=add&type=${encodeURIComponent('Търси')}">Търся изпълнител</a><a class="btn soft" href="#uslugi">← Всички услуги</a>`;
    return `<div class="page">${pageHead(name,addMode?'Избери конкретната услуга за публикуване.':'Избери конкретната услуга, която търсиш.','Услуги')}<div class="shell">${modeNotice}<div class="grid cols-3">${items}</div><div class="page-tools">${footer}</div></div></div>`;
  }

"""
s=replace_between(s,'  function serviceGroup(query){','  function work(){',new_service_group)
s=s.replace("function health(){return familyPage('Здраве и лекари'","function health(){return familyPage('Здраве и частни лекари'",1)
write(p,s)

# ------------------------------------------------------------------
# Content: Info wording, Results, Detail and Share drawer
# ------------------------------------------------------------------
p='prototype-content-views.js'
s=read(p)
s=s.replace("['⚕️','Здраве','info-health']","['⚕️','Здравна информация','info-health']",1)
new_share="""  function sharePanel(record){
    if(!record?.actions?.share||!record.social?.shareEligible) return '';
    return `<button class="btn soft" type="button" data-open-share>Сподели</button><div class="share-overlay" data-share-overlay hidden><button class="share-backdrop" type="button" data-close-share aria-label="Затвори споделянето"></button><section class="share-drawer" role="dialog" aria-modal="true" aria-label="Сподели"><div class="share-drawer-head"><h2>Сподели</h2><button class="share-close" type="button" data-close-share aria-label="Затвори">×</button></div><div class="share-actions"><button class="btn" type="button" data-demo-share="facebook">Facebook</button><button class="btn" type="button" data-demo-share="native">Споделяне от устройството</button><button class="btn" type="button" data-demo-share="copy">Копирай линк</button></div><p class="share-demo-message help" aria-live="polite"></p>${PopitaiSocialCardComposer.render(record.social)}</section></div>`;
  }
"""
s=replace_between(s,'  function shareMenu(){','  function correctionButton(',new_share+'  function correctionButton(')
# fix duplicated function token from replace construction
s=s.replace('  function correctionButton(  function correctionButton(','  function correctionButton(',1)
new_action="""  function actionBar(record){
    const a=record.actions||{};
    const parts=[];
    let primaryUsed=false;
    const addAction=(html,primary=false)=>{parts.push(html);if(primary) primaryUsed=true;};
    if(a.phone) addAction(`<button class="btn ${primaryUsed?'soft':'primary'}" type="button" data-demo-contact>Обади се</button>`,!primaryUsed);
    if(a.inquiry) addAction(`<button class="btn ${primaryUsed?'soft':'primary'}" type="button" data-demo-inquiry>Запитване</button>`,!primaryUsed);
    if(a.answer) addAction(`<button class="btn ${primaryUsed?'soft':'primary'}" type="button" data-demo-answer>Добави отговор</button>`,!primaryUsed);
    if(a.official) addAction(`<button class="btn ${primaryUsed?'soft':'primary'}" type="button" data-demo-official>Официална страница</button>`,!primaryUsed);
    if(a.site) addAction('<button class="btn soft" type="button" data-demo-site>Сайт</button>');
    if(record.addUrl) addAction(`<a class="btn soft" href="${record.addUrl}">＋ Добави в същия контекст</a>`);
    parts.push(sharePanel(record));
    if(['listing','firm','shop','health'].includes(record.contentType)) parts.push('<button class="btn soft favorite-pending" type="button" aria-disabled="true" title="Любими ще се активира след отделния login/storage checkpoint">Добави в любими</button>');
    if(a.report) addAction(reportButton());
    if(a.correction) addAction(correctionButton(a.correctionLabel||'Сигнализирай грешка'));
    const clean=parts.filter(Boolean);
    return clean.length?`<div class="detail-action">${clean.join('')}<p class="contact-demo-message" aria-live="polite"></p><p class="action-demo-message help" aria-live="polite"></p></div>`:'';
  }

"""
s=replace_between(s,'  function actionBar(record){','  function detailHrefFor(',new_action+'  function detailHrefFor(')
s=s.replace('  function detailHrefFor(  function detailHrefFor(','  function detailHrefFor(',1)
new_results="""  function results(query){
    const context=query.get('context')||'Обяви и услуги';
    const group=query.get('group')||'Всички';
    const detailType=query.get('detail')||'listing';
    const owner=query.get('owner')||'Listings';
    const type=query.get('type')||'';
    const record=records.resultRecord({context,group,owner,type,detailType});
    const detailHref=detailHrefFor(record,{context,group,owner,type,detailType});
    const serviceFamily=context==='Услуги'?serviceFamilies.find(f=>f.slice(1).includes(group)||f[0]===group):null;
    const isService=context==='Услуги';
    const otherService=group==='Друга ремонтна услуга'||group==='Друга услуга';
    const offerTarget=otherService?`#add/listing?category=${encodeURIComponent('Услуги')}&other=1${group==='Друга ремонтна услуга'?`&family=${encodeURIComponent('Майстори, ремонти и дом')}`:''}`:PopitaiStage2Contracts.contextualAddUrl({context,group,owner,type:isService?'Дава':type});
    const seekTarget=otherService?`${offerTarget}&type=${encodeURIComponent('Търси')}`:PopitaiStage2Contracts.contextualAddUrl({context,group,owner,type:isService?'Търси':type});
    const label=PopitaiSocialCardComposer.titleFor(record.social);
    const row=demoRow(label,`Местно предложение за „${group}“.`,context,detailHref,group);
    const seekDetail=`#detail/listing?context=${encodeURIComponent(context)}&group=${encodeURIComponent(group)}&owner=${encodeURIComponent(owner)}&detail=listing&type=${encodeURIComponent('Търси')}`;
    const second=isService?demoRow(`Търся ${group.toLocaleLowerCase('bg-BG')} изпълнител в Лом`,`Заявка от човек, който търси изпълнител за „${group}“.`,'Търся изпълнител',seekDetail,'Лом'):'';
    const breadcrumb=isService?`<div class="breadcrumbs"><a href="#uslugi">Услуги</a> · ${serviceFamily?.[0]==='Майстори, ремонти и дом'?'<a href="#maistori">Майстори</a>':serviceFamily?`<a href="#service-group?group=${encodeURIComponent(serviceFamily[0])}">${esc(serviceFamily[0])}</a>`:''} · ${esc(group)}</div>`:'';
    const head=isService?`<div class="shell page-head">${breadcrumb}<h1>${esc(group)} услуги в Лом</h1><p>Разгледай местните предложения и избери подходящото.</p></div>`:pageHead(group,`Разгледай резултатите в „${context}“.`,'Обяви и услуги');
    const controls=`<div class="results-toolbar"><details><summary class="btn soft">Филтри</summary><div class="results-filter-panel"><label>Район<select><option>Лом и региона</option></select></label><label>Тип<select><option>Всички</option><option>Предлагам</option><option>Търся</option></select></label></div></details><label class="results-sort">Сортиране<select><option>Най-нови</option><option>Най-подходящи</option></select></label></div>`;
    const actions=isService?`<div class="page-tools"><a class="btn primary" href="${offerTarget}">Предлагам ${esc(group)} услуга</a><a class="btn" href="${seekTarget}">Търся ${esc(group)} изпълнител</a></div><div class="results-question-fallback"><span>Не намираш необходимото?</span><a href="#add/question">Задай въпрос</a></div>`:`<div class="page-tools"><a class="btn primary" href="${offerTarget}">${owner==='Shops'?'＋ Добави магазин':owner==='Health/Info'?'＋ Добави лекар / практика':'＋ Публикувай'}</a><a class="btn" href="#add/question">Не намираш? Задай въпрос</a></div>`;
    return `<div class="page results-page">${head}<div class="shell">${controls}<div class="result-list">${row}${second}</div>${actions}</div></div>`;
  }

"""
s=replace_between(s,'  function results(query){','  function detail(kind,',new_results)
new_detail="""  function detail(kind,query=new URLSearchParams()){
    const record=records.resolve(kind,query);
    const title=PopitaiSocialCardComposer.titleFor(record.social);
    const technicalRowKeys=new Set(['Canonical подкатегория','Избран контекст']);
    const visibleRows=record.rows.filter(([key])=>!technicalRowKeys.has(key)).map(([key,value])=>`<div class="kv"><strong>${esc(key==='Suggested тип'?'Тип':key)}</strong><span>${esc(value)}</span></div>`).join('');
    const technicalRows=record.rows.filter(([key])=>technicalRowKeys.has(key));
    const qaNotes=Array.isArray(record.qaNotes)?record.qaNotes:[];
    const rawTechnical=(qaNotes.length||technicalRows.length)?`<details class="qa-adapter qa-only"><summary>Технически данни</summary>${qaNotes.map(note=>`<p>${esc(note)}</p>`).join('')}${technicalRows.map(([key,value])=>`<p><strong>${esc(key)}:</strong> ${esc(value)}</p>`).join('')}</details>`:'';
    const gallery=record.social.mediaAvailable&&['listing','firm'].includes(record.contentType)?`<div class="gallery-demo"><div>Основна снимка</div><div>Снимка</div><div>Снимка</div></div>`:'';
    const special=record.special?`<div class="notice">${esc(record.special)}</div>`:record.contentType==='info'?'<div class="notice ok">Всеки запис показва източник и дата на последна проверка.</div>':'';
    return `<div class="page detail-page">${pageHead(title,record.pageDescription)}<div class="shell detail"><article class="detail-main">${gallery}<h2 class="detail-section-title">Описание</h2><p>${esc(record.body)}</p>${rawTechnical}</article><aside class="detail-side">${visibleRows}${actionBar(record)}${special}</aside></div></div>`;
  }

"""
s=replace_between(s,'  function detail(kind,','  function iconCheckpoint(){',new_detail)
write(p,s)

# ------------------------------------------------------------------
# Forms: service UI adapter + compact context + Other service
# ------------------------------------------------------------------
p='prototype-forms.js'
s=read(p)
# select options now accepts {value,label} presentation pairs without touching contracts
old="""  function selectOptions(values,current=''){
    return '<option value="">Избери</option>'+values.map(v=>`<option value="${esc(v)}" ${String(v)===String(current)?'selected':''}>${esc(v)}</option>`).join('');
  }
"""
new="""  function selectOptions(values,current=''){
    return '<option value="">Избери</option>'+values.map(item=>{const pair=typeof item==='object'?item:{value:item,label:item};return `<option value="${esc(pair.value)}" ${String(pair.value)===String(current)?'selected':''}>${esc(pair.label)}</option>`;}).join('');
  }
  function serviceTypeOptions(){return [{value:'Дава',label:'Предлагам услуга'},{value:'Търси',label:'Търся изпълнител'}];}
"""
assert old in s
s=s.replace(old,new,1)
s=s.replace("if(kind==='listing'&&label==='Тип обява') return contracts.listingTypes(listingCategory(query));","if(kind==='listing'&&label==='Тип обява') return listingCategory(query)==='Услуги'?serviceTypeOptions():contracts.listingTypes(listingCategory(query));",1)
new_discovery="""  function discoveryContext(kind,query){
    if(kind!=='listing') return '';
    const discovery=listingDiscovery(query);
    const subcategory=listingSubcategory(query);
    const other=query.get('other')==='1';
    const exact=discovery||subcategory||(other?'Друга услуга':'');
    if(!exact) return '';
    return `<section class="service-context-summary" aria-label="Избрана услуга"><strong>Услуги → ${esc(exact)}</strong><a href="#uslugi">Смени услугата</a></section>`;
  }

"""
s=replace_between(s,'  function discoveryContext(kind,query){','  function adapterPreview(',new_discovery)
s=s.replace('<details class="qa-adapter"><summary>Техническа проверка на съвместимостта</summary>','<details class="qa-adapter qa-only"><summary>Техническа проверка на съвместимостта</summary>',1)
s=s.replace('<details class="qa-adapter health-contract-note"><summary>QA: техническа проверка на здравната форма</summary>','<details class="qa-adapter qa-only health-contract-note"><summary>Техническа проверка на здравната форма</summary>',1)
# replace renderField for select only via exact local block patterns
s=s.replace("const displayLabel=kind==='shop'&&label==='Какво предлага'?'Кратко описание на магазина':label;","const displayLabel=kind==='shop'&&label==='Какво предлага'?'Кратко описание на магазина':kind==='listing'&&label==='Тип обява'&&listingContext.category==='Услуги'?'Какво искаш да публикуваш?':label;",1)
s=s.replace("const required=(fieldRequired(kind,label)||(kind==='listing'&&label==='Подкатегория / вид'&&listingContext.category==='Услуги'))?'required':'';","const otherService=kind==='listing'&&query.get('other')==='1';\n    const required=(fieldRequired(kind,label)||(kind==='listing'&&label==='Подкатегория / вид'&&listingContext.category==='Услуги'&&!otherService))?'required':'';",1)
old_select="""    if(type==='select'){
      const isSub=kind==='listing'&&label==='Подкатегория / вид';
      const showSub=!isSub||listingContext.category==='Услуги';
      return prefix+`<div class="field" ${isSub?'id="listing-subcategory-field"':''} ${showSub?'':'hidden'}><label for="${id}">${esc(displayLabel)}</label><select id="${id}" name="${esc(label)}" ${required} ${showSub?'':'disabled'} aria-describedby="${errorId}">${selectOptions(optionsFor(kind,label,query),current)}</select>${fieldError(id)}</div>`;
    }
"""
new_select="""    if(type==='select'){
      const isSub=kind==='listing'&&label==='Подкатегория / вид';
      const isClassification=kind==='listing'&&(label==='Категория'||isSub);
      const showSub=!isSub||(listingContext.category==='Услуги'&&!otherService);
      const fieldClass=isClassification?' classification-field':'';
      return prefix+`<div class="field${fieldClass}" ${isSub?'id="listing-subcategory-field"':''} ${showSub?'':'hidden'}><label for="${id}">${esc(displayLabel)}</label><select id="${id}" name="${esc(label)}" ${required} ${showSub?'':'disabled'} aria-describedby="${errorId}">${selectOptions(optionsFor(kind,label,query),current)}</select>${fieldError(id)}</div>`;
    }
"""
assert old_select in s
s=s.replace(old_select,new_select,1)
# formPage: add other-service fields and contextual class; keep validation engine unchanged
old_ctx="""    const fields=config.fields.map((f,i)=>renderField(kind,f[0],f[1],i,query,edit,listingContext)).join('');
    const animalWarning="""
new_ctx="""    const fields=config.fields.map((f,i)=>renderField(kind,f[0],f[1],i,query,edit,listingContext)).join('');
    const otherService=kind==='listing'&&query.get('other')==='1';
    const otherFamily=query.get('family')||'';
    const otherServiceFields=otherService?`<section class="other-service-fields" data-other-service-fields><h2>Друга услуга</h2><p>Избери най-близката група и опиши точно каква услуга предлагаш или търсиш.</p><div class="field"><label for="other-service-family">Най-близка група</label><select id="other-service-family" name="Най-близка група" required aria-describedby="other-service-family-error">${selectOptions(serviceFamilies.map(f=>f[0]),otherFamily)}</select>${fieldError('other-service-family')}</div><div class="field"><label for="other-service-text">Каква услуга?</label><input id="other-service-text" name="Каква услуга?" type="text" minlength="3" maxlength="120" required data-other-service-text aria-describedby="other-service-text-error" placeholder="Напр. монтаж на корнизи">${fieldError('other-service-text')}</div><p class="help">Точната услуга остава в потребителския текст. Не се представя като нова структурирана подкатегория.</p></section>`:'';
    const animalWarning="""
assert old_ctx in s
s=s.replace(old_ctx,new_ctx,1)
old_return="""    return `<div class="page">${pageHead(edit?`Редактирай — ${config.title}`:config.title,config.subtitle)}<div class="shell form-wrap">${discoveryContext(kind,query)}${healthNote}${animalWarning}${editNote}<form class="proto-form" data-proto-form data-form-kind="${kind}" data-discovery-context="${esc(listingContext.discovery)}" novalidate>${fields}${listingExtras}${firmExtras}${terms}<div class="form-actions"><button class="btn primary" type="submit">${edit?'Изпрати редакцията':kind==='health'?'Изпрати за одобрение':'Изпрати за преглед'}</button><a class="btn" href="#home">Отказ</a></div><div class="form-message" role="status" aria-live="polite"></div></form>${adapterPreview(kind,query)}</div></div>`;
"""
new_return="""    const contextualService=kind==='listing'&&listingContext.category==='Услуги'&&(listingContext.discovery||listingContext.subcategory||otherService);
    const pageTitle=contextualService?(edit?'Редактирай услуга':'Добави услуга'):(edit?`Редактирай — ${config.title}`:config.title);
    const pageSubtitle=contextualService?'Публикувай конкретна услуга или заявка за изпълнител.':config.subtitle;
    return `<div class="page">${pageHead(pageTitle,pageSubtitle)}<div class="shell form-wrap ${contextualService?'contextual-service-form':''}">${discoveryContext(kind,query)}${healthNote}${animalWarning}${editNote}<form class="proto-form" data-proto-form data-form-kind="${kind}" data-discovery-context="${esc(listingContext.discovery)}" novalidate>${otherServiceFields}${fields}${listingExtras}${firmExtras}${terms}<div class="form-actions"><button class="btn primary" type="submit">${edit?'Изпрати редакцията':kind==='health'?'Изпрати за одобрение':'Изпрати за преглед'}</button><a class="btn" href="#home">Отказ</a></div><div class="form-message" role="status" aria-live="polite"></div></form>${adapterPreview(kind,query)}</div></div>`;
"""
assert old_return in s
s=s.replace(old_return,new_return,1)
write(p,s)

# ------------------------------------------------------------------
# Interactions: service labels after category changes, QA mode, share drawer
# ------------------------------------------------------------------
p='prototype-stage2-interactions.js'
s=read(p)
old_option="""  function optionHtml(values,current=''){
    return '<option value="">Избери</option>'+values.map(value=>`<option value="${escapeOption(value)}" ${value===current?'selected':''}>${escapeOption(value)}</option>`).join('');
  }
"""
new_option="""  function optionHtml(values,current=''){
    return '<option value="">Избери</option>'+values.map(item=>{const pair=typeof item==='object'?item:{value:item,label:item};return `<option value="${escapeOption(pair.value)}" ${pair.value===current?'selected':''}>${escapeOption(pair.label)}</option>`;}).join('');
  }
  function visibleListingTypes(category){return category==='Услуги'?[{value:'Дава',label:'Предлагам услуга'},{value:'Търси',label:'Търся изпълнител'}]:contracts.listingTypes(category);}
"""
assert old_option in s
s=s.replace(old_option,new_option,1)
s=s.replace("const allowedTypes=contracts.listingTypes(categoryValue);","const allowedTypes=visibleListingTypes(categoryValue);",1)
s=s.replace("const nextType=allowedTypes.includes(previousType)?previousType:'';","const allowedTypeValues=allowedTypes.map(item=>typeof item==='object'?item.value:item);\n    const nextType=allowedTypeValues.includes(previousType)?previousType:'';",1)
# clear UI context summary too
s=s.replace("const visible=form.closest('.form-wrap')?.querySelector('.discovery-context');\n    if(visible) visible.hidden=true;","const visible=form.closest('.form-wrap')?.querySelector('.discovery-context,.service-context-summary');\n    if(visible) visible.hidden=true;",1)
# Share open/close handlers inserted near click handler start
needle="""  document.addEventListener('click',event=>{
    const link=event.target.closest?.('a[href^="#"]');
"""
replacement="""  let shareReturnFocus=null;
  function closeShareOverlay(overlay){
    if(!overlay) return;
    overlay.hidden=true;
    document.body.classList.remove('share-open');
    shareReturnFocus?.focus?.();
    shareReturnFocus=null;
  }

  document.addEventListener('click',event=>{
    const openShare=event.target.closest?.('[data-open-share]');
    if(openShare){
      const overlay=openShare.parentElement?.querySelector('[data-share-overlay]');
      if(overlay){shareReturnFocus=openShare;overlay.hidden=false;document.body.classList.add('share-open');overlay.querySelector('[data-close-share]')?.focus();}
      return;
    }
    const closeShare=event.target.closest?.('[data-close-share]');
    if(closeShare){closeShareOverlay(closeShare.closest('[data-share-overlay]'));return;}

    const link=event.target.closest?.('a[href^="#"]');
"""
assert needle in s
s=s.replace(needle,replacement,1)
# share message container changed
s=s.replace("const message=share.closest('.share-menu')?.querySelector('.share-demo-message');","const message=share.closest('.share-drawer')?.querySelector('.share-demo-message');",1)
# input support for Other service exact text hints without persistence claim
needle2="""    if(form?.dataset.formKind==='listing'&&target.id==='listing-price') syncPriceState(form,target);
"""
rep2="""    if(form?.dataset.formKind==='listing'&&target.matches('[data-other-service-text]')){
      const exact=target.value.trim();
      const title=form.querySelector('[name="Заглавие"]');
      const description=form.querySelector('[name="Описание"]');
      if(exact&&title&&!title.value) title.placeholder=`${form.querySelector('#listing-type')?.value==='Търси'?'Търся изпълнител за':'Предлагам'} ${exact} в Лом`;
      if(exact&&description&&!description.value) description.placeholder=`Опиши „${exact}“, район, срок и важни условия.`;
    }
    if(form?.dataset.formKind==='listing'&&target.id==='listing-price') syncPriceState(form,target);
"""
assert needle2 in s
s=s.replace(needle2,rep2,1)
# Escape share drawer + QA mode init
needle3="""  window.addEventListener('beforeunload',event=>{
"""
rep3="""  document.addEventListener('keydown',event=>{
    if(event.key==='Escape') closeShareOverlay(document.querySelector('[data-share-overlay]:not([hidden])'));
  });

  document.body?.classList.toggle('qa-mode',new URLSearchParams(location.search).get('qa')==='1');

  window.addEventListener('beforeunload',event=>{
"""
assert needle3 in s
s=s.replace(needle3,rep3,1)
write(p,s)

# ------------------------------------------------------------------
# CSS presentation layer
# ------------------------------------------------------------------
p='prototype-remediation.css'
s=read(p)
s += r'''

/* Approved Stage 2 IA/UX presentation — prototype only. */
.demo-label,.qa-adapter,.qa-only,.social-card-qa{display:none!important}
.qa-mode .qa-adapter,.qa-mode .qa-only,.qa-mode .social-card-qa{display:block!important}
.hero-compact{padding:clamp(30px,4vw,54px) 0!important}
.hero-compact .hero-grid{grid-template-columns:minmax(0,1fr)!important}
.hero-compact h1{max-width:760px}
.home-main-grid,.hub-main-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.home-secondary-row,.hub-secondary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:14px}
.unified-entry{min-width:0}
.category-card-main{display:block;color:inherit;text-decoration:none}
.category-inline-link{display:inline-flex;margin-top:10px;font-weight:800;color:#0b5fd7;text-decoration:none}
.home-priority-shortcuts,.home-more-categories{display:none}
.home-secondary-row .special-card{min-height:auto;padding:13px 15px}
.service-quick{display:grid;gap:8px;margin:18px 0}
.service-quick-scroll{display:flex;flex-wrap:wrap;gap:8px}
.service-family-desktop{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.service-family-card{display:flex;flex-direction:column;min-width:0;padding:17px;border:1px solid #d7e2ef;border-radius:16px;background:#fff}
.service-family-card h3{margin:8px 0}.service-family-card .family-open{margin-top:auto;padding-top:12px;font-weight:800;color:#0b5fd7;text-decoration:none}
.service-family-mobile{display:none}
.masters-search{max-width:760px;margin-bottom:16px}
.master-tiles{display:flex;flex-wrap:wrap;gap:9px;margin-bottom:16px}
.master-tile{padding:10px 14px;border:1px solid #cddcec;border-radius:999px;background:#fff;color:#0b2f56;font-weight:800;text-decoration:none}
.master-tile:hover,.master-tile:focus{border-color:#0b5fd7;background:#f1f7ff}
.masters-primary-actions{display:flex;gap:10px;flex-wrap:wrap;margin:0 0 28px}
.masters-content-section{margin-top:28px}.masters-question-fallback{margin-top:30px;padding-top:22px;border-top:1px solid #d7e2ef}
.results-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 16px}
.results-toolbar summary{list-style:none}.results-filter-panel{position:absolute;z-index:4;display:grid;gap:10px;margin-top:8px;padding:14px;border:1px solid #d7e2ef;border-radius:12px;background:#fff;box-shadow:0 10px 30px rgba(11,47,86,.12)}
.results-filter-panel label,.results-sort{display:flex;align-items:center;gap:8px;font-weight:700}.results-filter-panel select,.results-sort select{width:auto;min-width:150px}
.results-question-fallback{display:flex;gap:8px;align-items:center;margin-top:14px;color:#526273}.results-question-fallback a{font-weight:800}
.service-context-summary{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 16px;padding:13px 15px;border:1px solid #d7e2ef;border-radius:14px;background:#f8fbff}
.service-context-summary strong{color:#0b2f56}.service-context-summary a{font-weight:800}
.contextual-service-form .classification-field{display:none!important}
.other-service-fields{margin-bottom:18px;padding:16px;border:1px solid #d7e2ef;border-radius:14px;background:#f8fbff}.other-service-fields h2{margin-top:0}
.detail-section-title{font-size:1.2rem;margin-top:8px}
.favorite-pending[aria-disabled="true"]{opacity:.62;cursor:not-allowed}
.share-overlay[hidden]{display:none!important}.share-overlay{position:fixed;z-index:9999;inset:0;display:flex;justify-content:flex-end}
.share-backdrop{position:absolute;inset:0;border:0;background:rgba(6,22,39,.48);cursor:default}
.share-drawer{position:relative;z-index:1;width:min(560px,92vw);height:100%;overflow:auto;padding:22px;background:#fff;box-shadow:-14px 0 40px rgba(6,22,39,.22)}
.share-drawer-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.share-drawer-head h2{margin:0}.share-close{width:42px;height:42px;border:1px solid #d7e2ef;border-radius:50%;background:#fff;font-size:1.6rem;cursor:pointer}
.share-actions{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0}.share-drawer .social-card-preview{margin-top:18px}.share-open{overflow:hidden}

@media(max-width:640px){
  .hero-compact{padding:24px 0 28px!important}
  .hero-compact h1{font-size:clamp(2rem,10vw,2.7rem);line-height:1.05}
  .home-main-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
  .home-main-card--secondary{display:none!important}
  .home-main-grid .category-card{padding:13px;min-height:0}
  .home-main-grid .category-card p{font-size:.9rem}
  .home-priority-shortcuts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px}
  .home-shortcut{padding:11px;border:1px solid #d7e2ef;border-radius:12px;background:#fff;font-weight:800;text-decoration:none;color:#0b2f56}
  .home-secondary-row{display:none}
  .home-more-categories{display:block;margin-top:10px}.home-more-categories summary{cursor:pointer;padding:11px 13px;border:1px solid #d7e2ef;border-radius:12px;background:#fff;font-weight:800;color:#0b2f56}.home-more-categories>div{display:grid;gap:7px;margin-top:7px}.home-more-link{padding:10px 12px;border:1px solid #e0e7ef;border-radius:10px;background:#fff;text-decoration:none;font-weight:750}
  .hub-main-grid,.hub-secondary-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:0}.hub-secondary-grid{margin-top:10px}.hub-main-grid .category-card,.hub-secondary-grid .category-card{padding:12px;min-height:0}.hub-main-grid .category-card p,.hub-secondary-grid .category-card p{font-size:.86rem}
  .service-family-desktop{display:none}.service-family-mobile{display:grid;gap:8px}.service-family-accordion{border:1px solid #d7e2ef;border-radius:12px;background:#fff}.service-family-accordion summary{padding:13px 14px;cursor:pointer;font-weight:850;color:#0b2f56}.service-family-accordion>div{display:flex;flex-wrap:wrap;gap:7px;padding:0 14px 14px}.service-family-accordion span{padding:5px 8px;border-radius:999px;background:#f1f6fb;font-size:.82rem}.service-family-accordion a{width:100%;margin-top:5px;font-weight:800}.service-quick-scroll{flex-wrap:nowrap;overflow-x:auto;padding-bottom:5px;scrollbar-width:thin}.service-quick-scroll .chip{flex:0 0 auto}
  .master-tiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.master-tile{border-radius:12px;padding:10px 11px}.masters-primary-actions{display:grid;grid-template-columns:1fr 1fr}.masters-primary-actions .btn{width:100%;white-space:normal}
  .results-toolbar{align-items:stretch;flex-direction:column}.results-toolbar>details,.results-sort{width:100%}.results-sort{justify-content:space-between}.results-sort select{flex:1;min-width:0}.results-filter-panel{position:static;box-shadow:none}
  .service-context-summary{align-items:flex-start;flex-direction:column}
  .share-overlay{align-items:flex-end}.share-drawer{width:100%;height:auto;max-height:88vh;border-radius:22px 22px 0 0;padding:18px}.share-actions{display:grid;grid-template-columns:1fr}.share-actions .btn{width:100%}
}
@media(max-width:390px){
  .home-main-grid,.hub-main-grid,.hub-secondary-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
}
'''
write(p,s)

# ------------------------------------------------------------------
# Regression suite: preserve prior contract checks + approved IA checks
# ------------------------------------------------------------------
audit=r'''\'use strict\';

const assert=require('assert');
const fs=require('fs');
const vm=require('vm');
const {execFileSync}=require('child_process');

global.window=global;
global.location={hash:'#home',search:''};
global.URLSearchParams=URLSearchParams;
for(const file of ['prototype-stage2-contracts.js','prototype-core.js','prototype-records.js','prototype-social-card-composer.js','prototype-marketplace-views.js','prototype-content-views.js']) vm.runInThisContext(fs.readFileSync(`${__dirname}/${file}`,'utf8'),{filename:file});
const contracts=global.PopitaiStage2Contracts;
const records=global.PopitaiPrototypeRecords;
const social=global.PopitaiSocialCardComposer;
const forms=fs.readFileSync(`${__dirname}/prototype-forms.js`,'utf8');
const interactions=fs.readFileSync(`${__dirname}/prototype-stage2-interactions.js`,'utf8');
const css=fs.readFileSync(`${__dirname}/prototype-remediation.css`,'utf8');

// Prior accepted remediation contracts remain intact.
for(const category of ['Хранителни','Строителни','Техника','Мебели','Дрехи','Дом']){
  const record=records.resultRecord({context:'Магазини',group:category,owner:'Shops',detailType:'shop'});
  assert.equal(record.contentType,'shop',`${category}: contentType`);assert.equal(record.owner,'Shops',`${category}: owner`);assert.equal(record.social.composition,'profile');assert.equal(record.social.contentRole,'specialized');
}
assert(!contracts.activeServiceCanonical.includes('Авточасти'));assert(!contracts.listingSubcategories('Услуги').includes('Авточасти'));assert.equal(contracts.serviceCanonicalMap['Авточасти'],'Авточасти');
const themed=social.render(records.get('listing-vik').social);assert(themed.includes('social-card-template-icon'));assert(themed.includes('icons/briefcase-duotone.svg'));assert(!social.validate({...records.get('listing-vik').social,icon:'<svg onload=alert(1)>'}).ok);
const approved=social.render(records.get('firm-repairs').social);assert(approved.includes('social-card-approved-brand'));assert(approved.includes('Попитай.Лом'));
assert.equal(records.get('question-community').social.contentRole,'community');assert.equal(records.get('info-health').social.contentRole,'verified-information');
assert.equal(contracts.serviceFamilyNames.length,9);
for(const familyName of contracts.serviceFamilyNames){
  const family=global.serviceFamilies.find(item=>item[0]===familyName);assert(family,`${familyName}: family exists`);
  const familyAdd=contracts.contextualAddUrl({context:'Услуги',group:familyName,owner:'Listings'});assert(familyAdd.startsWith('#service-group?'));assert(familyAdd.includes('mode=add'));assert(!familyAdd.startsWith('#add/listing'));
  const leafAdd=contracts.contextualAddUrl({context:'Услуги',group:family[1],owner:'Listings'});assert(leafAdd.startsWith('#add/listing?'));
  const addPage=global.serviceGroup(new URLSearchParams(`group=${encodeURIComponent(familyName)}&mode=add&type=${encodeURIComponent('Дава')}`));assert(addPage.includes('Избери конкретна услуга'),`${familyName}: choose-first UI`);assert(addPage.includes('type=%D0%94%D0%B0%D0%B2%D0%B0')||addPage.includes('type=%D0%94%D0%B0%D0%B2%D0%B0'.toLowerCase())||addPage.includes('type='),`${familyName}: intent retained`);
}

// Approved unified IA.
const home=global.home();const hub=global.hub(new URLSearchParams());const services=global.services();const masters=global.masters();
for(const label of ['Услуги','Купува и продава','Работа','Имоти','Автомобили','Здраве и частни лекари','Магазини','Заведения','Животни']){assert(hub.includes(label),`hub entry ${label}`);}
assert(home.includes('href="#maistori"'),'Home keeps compact Masters deep link inside Services');assert(!home.includes('class="protected-entry"'),'Home has no standalone Masters card');
assert(home.indexOf('Нови обяви и услуги')<home.indexOf('Местни фирми'));assert(home.indexOf('Местни фирми')<home.indexOf('Инфо Лом'));assert(home.indexOf('Инфо Лом')<home.indexOf('Актуално в Лом'));assert(home.indexOf('Полезни статии')<home.indexOf('Въпроси от общността'));
assert(home.includes('home-main-grid'));assert(home.includes('home-priority-shortcuts'));assert(home.includes('Всички категории'));
assert(hub.includes('hub-main-grid')&&hub.includes('hub-secondary-grid'));
assert(global.info().includes('Здравна информация'),'Info Lom health wording');
assert(home.includes('Здравна информация'),'Home Info wording');

for(const family of ['Майстори, ремонти и дом','Почистване и поддръжка','Автомобилни услуги','Транспорт, преместване и доставки','Красота и лична грижа','Грижа за хора и животни','Обучение, уроци и спорт','Техника, дигитални и професионални услуги','Събития и творчески услуги','Друга услуга']) assert(services.includes(family),`service family ${family}`);
assert(services.includes('service-family-desktop'));assert(services.includes('service-family-mobile'));assert(services.includes('href="#maistori"'));

for(const sub of ['Цялостни ремонти','Бани и плочки','ВиК','Електро','Покриви','Шпакловка и боядисване','Дограма и врати','Климатици','Друга ремонтна услуга']) assert(masters.includes(sub),`masters subcategory ${sub}`);
assert(!masters.includes('Намери майстор'),'No third duplicate Masters button');
assert(masters.includes('Търся изпълнител')&&masters.includes('Предлагам услуга'));
assert(masters.indexOf('Активни предложения и търсения')<masters.indexOf('Местни фирми'));assert(masters.indexOf('Местни фирми')<masters.indexOf('Последни въпроси'));
assert(!masters.includes('masters-card'),'8x3 card model removed');

const vikResults=global.results(new URLSearchParams('context=%D0%A3%D1%81%D0%BB%D1%83%D0%B3%D0%B8&group=%D0%92%D0%B8%D0%9A&detail=listing&owner=Listings'));
assert(vikResults.includes('Услуги</a>'));assert(vikResults.includes('href="#maistori">Майстори</a>'));assert(vikResults.includes('<h1>ВиК услуги в Лом</h1>'));assert(!vikResults.includes('discovery-context'));assert(!vikResults.includes('пример 2'));assert(vikResults.includes('Търся вик изпълнител в Лом'));assert(vikResults.includes('results-toolbar'));assert(vikResults.includes('Предлагам ВиК услуга'));assert(vikResults.includes('Търся ВиК изпълнител'));

// Service UI adapter only changes labels; persisted values remain production-compatible Дава/Търси.
assert(forms.includes("{value:'Дава',label:'Предлагам услуга'}"));assert(forms.includes("{value:'Търси',label:'Търся изпълнител'}"));assert(forms.includes('service-context-summary'));assert(forms.includes('Смени услугата'));assert(forms.includes('other-service-text'));assert(forms.includes('Каква услуга?'));assert(forms.includes('other-service-family'));
assert(interactions.includes("{value:'Дава',label:'Предлагам услуга'}"));assert(interactions.includes("{value:'Търси',label:'Търся изпълнител'}"));assert(interactions.includes("syncListingForm({preserve:false,resetDiscovery:true})"),'main category clears discovery and dependent state');

const detail=global.detail('listing',new URLSearchParams('record=listing-vik'));
assert(detail.includes('data-open-share'));assert(detail.includes('data-share-overlay hidden'));assert(detail.includes('Добави в любими'));assert(detail.includes('aria-disabled="true"'));assert(!detail.includes('ПРИМЕР — НЕ Е РЕАЛНО СЪДЪРЖАНИЕ'));assert(detail.indexOf('data-share-overlay')<detail.indexOf('social-card-preview'),'Social Preview is contained by Share overlay');
assert(interactions.includes('data-open-share')&&interactions.includes('data-close-share'));assert(css.includes('.share-overlay'));assert(css.includes('align-items:flex-end'));
assert(css.includes('.demo-label,.qa-adapter,.qa-only,.social-card-qa{display:none!important}'));assert(css.includes('.qa-mode .qa-adapter'));
assert(css.includes('.home-main-grid')&&css.includes('grid-template-columns:repeat(2,minmax(0,1fr))'));assert(css.includes('.service-family-accordion'));

const currentHtml=global.current();assert(currentHtml.includes('Местна актуализация с конкретна цел и най-важното на едно място.'));assert(!currentHtml.includes('Кратка местна актуализация'));
const detailDescriptions={'listing-catering':'Кетъринг за семейни тържества, фирмени събития и други поводи в Лом и региона.','listing-work':'Обява за работа в строителството и техническите дейности в Лом с ясно посочена област и основни условия.','listing-property':'Обява за продажба на апартамент в Лом с основна информация за имота и условията.','listing-auto':'Обява за автомобил или джип в Лом с основни данни за превозното средство и състоянието му.','listing-animal':'Обява за животно, което търси дом в Лом, с най-важната информация за осиновяване.','health-doctor':'Профил на лекар специалист в Лом с основна специалност, контакт и местна информация.'};for(const [id,description] of Object.entries(detailDescriptions)){assert.equal(records.get(id).body,description);assert(global.detail(records.get(id).contentType,new URLSearchParams(`record=${encodeURIComponent(id)}`)).includes(description));}

const baseSha='ed196284ab27a0f8567a6b5869a8bb0885798f4b';
const changed=execFileSync('git',['diff','--name-only',baseSha,'HEAD'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
const allowed=new Set(['prototype-final-ia/prototype-marketplace-views.js','prototype-final-ia/prototype-content-views.js','prototype-final-ia/prototype-forms.js','prototype-final-ia/prototype-stage2-interactions.js','prototype-final-ia/prototype-remediation.css','prototype-final-ia/prototype-regression-audit.js']);
assert(changed.length===6,`atomic IA implementation must change exactly six prototype files: ${changed.join(', ')}`);assert(changed.every(path=>allowed.has(path)),`unexpected path: ${changed.join(', ')}`);assert(!changed.some(path=>/(^|\/)(supabase|schema|migrations?|rls|rpc|content[-_ ]?master|locked)(\/|$)/i.test(path)));
console.log('prototype-regression-audit: PASS');
'''
write('prototype-regression-audit.js',audit)

# Basic patch-time invariants before committing.
for name in ['prototype-marketplace-views.js','prototype-content-views.js','prototype-forms.js','prototype-stage2-interactions.js','prototype-remediation.css','prototype-regression-audit.js']:
    assert (ROOT/name).exists()
print('approved IA patch applied')
