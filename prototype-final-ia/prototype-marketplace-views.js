'use strict';

(() => {
  function resultHref(context,name,resultDetail='listing',owner='Listings',type=''){
    const q=new URLSearchParams({context,group:name,detail:resultDetail,owner});
    if(type) q.set('type',type);
    return `#results?${q}`;
  }
  function familyPage(title,desc,groups,opts={}){
    const context=opts.context||title;
    const resultDetail=opts.resultDetail||'listing';
    const owner=opts.owner||'Listings';
    const resultFor=name=>opts.hrefBuilder?opts.hrefBuilder(name):resultHref(context,name,resultDetail,owner,opts.type||'');
    const quick=(opts.quick||groups.slice(0,6)).map(item=>{
      const label=typeof item==='string'?item:item.label;
      const href=typeof item==='string'?resultFor(item):item.href;
      return `<a class="chip" href="${href}">${esc(label)}</a>`;
    }).join('');
    const cards=groups.map((g,i)=>{
      const name=Array.isArray(g)?g[0]:g;
      const subs=Array.isArray(g)?g.slice(1):[];
      return `<a class="family-card" href="${resultFor(name)}"><div class="icon">${opts.icons?.[i]||icons[i%icons.length]}</div><h3>${esc(name)}</h3>${subs.length?`<div class="sublist">${subs.slice(0,4).map(s=>`<span>${esc(s)}</span>`).join('')}</div><small>Всички ${subs.length} →</small>`:`<p>Разгледай релевантните резултати.</p><small>Отвори →</small>`}</a>`;
    }).join('');
    return `<div class="page">${pageHead(title,desc,'Обяви и услуги')}<div class="shell">${opts.notice||''}<form class="search-box" data-page-search style="max-width:760px"><input name="q" aria-label="Търсене" placeholder="${esc(opts.placeholder||'Какво търсиш?')}"><button>Търси</button></form><div class="chips">${quick}</div><div class="grid cols-3">${cards}</div><div class="page-tools"><a class="btn primary" href="${opts.add||'#add/listing'}">＋ ${esc(opts.addLabel||'Публикувай')}</a><a class="btn" href="#add/question">Не намираш? Задай въпрос</a></div>${opts.after||''}</div></div>`;
  }

  function workRoute(query,patch={}){
    const next=new URLSearchParams(query||'');
    for(const [key,value] of Object.entries(patch)){
      if(value===null||value===undefined||value==='')next.delete(key);else next.set(key,value);
    }
    for(const key of [...next.keys()]) if(!['q','type','group'].includes(key)) next.delete(key);
    const encoded=next.toString();
    return `#rabota${encoded?`?${encoded}`:''}`;
  }
  function workTypeOf(item={}){return item.workType||item.listingType||item.listing_type||'';}
  function workGroupOf(item={}){return item.workGroup||item.group||item.discovery||'';}
  function workMatches(item,{q='',type='',group=''}={}){
    const itemType=workTypeOf(item),itemGroup=workGroupOf(item);
    if(type&&itemType!==type)return false;
    if(group&&itemGroup!==group)return false;
    if(!q)return true;
    const haystack=[item.title,item.description,item.meta,itemType,itemGroup].filter(Boolean).join(' ').toLocaleLowerCase('bg-BG');
    return haystack.includes(q.toLocaleLowerCase('bg-BG'));
  }
  function workRow(item){
    const itemType=workTypeOf(item),group=workGroupOf(item);
    const meta=[itemType,group,item.meta].filter(Boolean).filter((value,index,array)=>array.indexOf(value)===index).join(' · ');
    return window.PopitaiHomeViews.publicRow({...item,type:'Работа',meta});
  }
  function work(query=new URLSearchParams()){
    const type=['Предлага работа','Търси работа'].includes(query.get('type'))?query.get('type'):'';
    const group=workGroups.includes(query.get('group'))?query.get('group'):'';
    const q=(query.get('q')||'').trim();
    const all=Array.isArray(window.PopitaiApprovedContent?.workListings)?window.PopitaiApprovedContent.workListings.filter(Boolean):[];
    const filtered=all.filter(item=>workMatches(item,{q,type,group}));
    const returnHref=workRoute(query);
    const baseAddHref=PopitaiStage2Contracts.listingAddUrl({category:'Работа',discovery:group});
    const addHref=`${baseAddHref}${baseAddHref.includes('?')?'&':'?'}return=${encodeURIComponent(returnHref)}`;
    const typeTabs=[
      ['', 'Всички'],
      ['Предлага работа','Предлагат работа'],
      ['Търси работа','Търсят работа']
    ].map(([value,label])=>`<a class="tab ${type===value?'active':''}" href="${workRoute(query,{type:value})}">${label}</a>`).join('');
    const directionFilters=[['','Всички'],...workGroups.map(value=>[value,value])].map(([value,label])=>`<a class="chip ${group===value?'active':''}" href="${workRoute(query,{group:value})}">${esc(label)}</a>`).join('');
    const topAdd=filtered.length?`<div class="page-tools"><a class="btn primary" data-work-add href="${addHref}">＋ Добави обява</a></div>`:'';
    const resultContent=filtered.length
      ?`<div class="result-list">${filtered.map(workRow).join('')}</div>`
      :`<article class="empty-card"><h2>${all.length?'Няма обяви по избраните критерии':'Няма активни обяви за работа'}</h2><p>${all.length?'Промени търсенето или филтрите, за да видиш други активни обяви.':'В момента няма налични активни обяви в този раздел.'}</p><a class="btn primary" data-work-add href="${addHref}">＋ Добави обява</a></article>`;
    const directionControl=all.length?`<details class="work-direction-filter" data-work-groups><summary>Направление: ${esc(group||'Всички')}</summary><div class="chips">${directionFilters}</div></details>`:'';
    return `<div class="page work-list-page">${pageHead('Работа','Активните обяви за работа са на едно място.','Обяви и услуги')}<div class="shell"><form class="search-box" data-work-search style="max-width:760px"><input name="q" aria-label="Търсене в Работа" value="${esc(q)}" placeholder="Напр. шофьор, продавач, строителство…"><button>Търси</button></form><div class="tabs" aria-label="Тип обява за работа">${typeTabs}</div>${topAdd}${resultContent}${directionControl}</div></div>`;
  }
  function properties(){
    const labels={'Продава имот':'Продава','Отдава под наем':'Отдава под наем','Търси за купуване':'Купува','Търси под наем':'Търси под наем'};
    return `<div class="page">${pageHead('Имоти','Първо избери намерението, после вида имот.','Обяви и услуги')}<div class="shell"><div class="tabs">${Object.entries(labels).map(([type,label])=>`<button class="tab ${type===window.propertyType?'active':''}" type="button" data-property-type="${esc(type)}">${esc(label)}</button>`).join('')}</div><div class="grid cols-4">${propertyKinds.map(x=>`<a class="family-card" data-property-kind="${esc(x)}" href="${propertyResultsHref(x)}"><div class="icon">🏠</div><h3>${esc(x)}</h3><p>Резултати за избраното намерение.</p></a>`).join('')}</div><div class="page-tools"><a class="btn primary" data-property-add href="${PopitaiStage2Contracts.listingAddUrl({category:'Имоти',type:window.propertyType})}">＋ Добави имот</a></div></div></div>`;
  }
  function goods(){return familyPage('Купува и продава','Стоките са групирани широко; конкретното се намира с търсене и филтри.',goodsGroups,{placeholder:'Какво купуваш или продаваш?',quick:goodsGroups.slice(0,4),context:'Купува и продава',add:'#add/listing',addLabel:'Добави обява'});}
  function auto(){
    const quick=[{label:'Автомобили',href:resultHref('Автомобили','Автомобили и джипове')},{label:'Части и гуми',href:resultHref('Автомобили','Части, гуми и аксесоари')},{label:'Автосервиз',href:serviceResultsHref('Автосервиз')},{label:'Диагностика',href:serviceResultsHref('Диагностика')},{label:'Пътна помощ',href:serviceResultsHref('Пътна помощ')}];
    return familyPage('Автомобили','Купи или продай МПС, намери части или избери автомобилна услуга.',autoGroups,{placeholder:'Напр. автомобил, гуми, диагностика…',quick,context:'Автомобили',hrefBuilder:name=>name==='Автомобилни услуги'?'#service-group?group='+encodeURIComponent('Автомобилни услуги'):resultHref('Автомобили',name),notice:'<div class="notice">Автомобилните услуги са достъпни от същия раздел за услуги.</div>',add:PopitaiStage2Contracts.listingAddUrl({category:'Автомобили и МПС'}),addLabel:'Добави обява'});
  }
  function animals(){return familyPage('Животни','Осиновяване, изгубени/намерени и допустими обяви за стоки за животни.',animalGroups,{placeholder:'Осиновяване, изгубено животно, стоки…',quick:animalGroups,context:'Животни',notice:'<div class="notice">Избери най-подходящата група за обявата за животни.</div><details class="qa-adapter qa-only"><summary>Техническа бележка</summary><p>Discovery контекстът остава UX слой и не се persist-ва като нова backend подкатегория.</p></details>',add:PopitaiStage2Contracts.listingAddUrl({category:'Животни'}),addLabel:'Добави обява'});}
  function shops(){
    const data=window.PopitaiApprovedContent||{};
    const cards=(data.shops||[]).map(item=>`<article class="result-row"><div><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p><div class="result-meta"><span class="badge gold">${esc(item.meta)}</span></div></div>${item.phone?`<a class="btn soft" href="tel:${item.phone.replace(/[^\d+]/g,'')}">Обади се</a>`:''}</article>`).join('');
    const after=cards?`<section class="stage2-live-shops"><div class="section-head compact-head"><div><h2>Публични строителни магазини</h2><p>Потвърдени примери от текущия публичен каталог.</p></div></div><div class="result-list">${cards}</div></section>`:'';
    return familyPage('Магазини','Намери местен магазин по вид или по това, което търсиш.',shopGroups,{placeholder:'Какъв магазин търсиш?',context:'Магазини',owner:'Shops',resultDetail:'shop',quick:shopGroups.slice(0,4),add:'#add/shop',addLabel:'Добави магазин',after});
  }
  function restaurants(){return familyPage('Заведения','Ресторанти, кафенета, пицарии, сладкарници и храна за вкъщи.',restaurantGroups,{placeholder:'Ресторант, кафе, пица, доставка…',context:'Заведения',owner:'Firms',resultDetail:'firm',quick:restaurantGroups.slice(0,5),add:'#add/firm?category=Заведения',addLabel:'Добави заведение'});}
  function health(){return familyPage('Здраве и частни лекари','Намери лекар, специалист, стоматолог или ветеринар. Проверената справочна информация остава в Инфо Лом.',healthGroups,{placeholder:'Лекар, специалист, стоматолог…',context:'Здраве и лекари',owner:'Health/Info',resultDetail:'health',quick:healthGroups,add:'#add/health',addLabel:'Добави лекар / практика'});}

  Object.assign(window,{familyPage,work,properties,goods,auto,animals,shops,restaurants,health});
  window.PopitaiMarketplaceViews=Object.freeze({resultHref,familyPage,workRoute,workMatches,work,properties,goods,auto,animals,shops,restaurants,health});
})();
