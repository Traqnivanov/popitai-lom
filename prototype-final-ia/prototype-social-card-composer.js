'use strict';

(function(){
  const escapeHtml = (value='') => window.esc ? window.esc(String(value)) : String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  const iconPaths = {
    pipe:'<path d="M5 6h6v4H8v4h8v4h3"/><path d="M16 12h3v6"/><path d="M4 4h8"/>',
    utensils:'<path d="M7 4v7M4 4v4a3 3 0 0 0 6 0V4M7 11v9"/><path d="M16 4v16M16 4c3 2 4 5 4 8h-4"/>',
    briefcase:'<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M9 7V5h6v2M3 12h18M10 12v2h4v-2"/>',
    home:'<path d="m3 11 9-7 9 7"/><path d="M5 10v10h14V10M9 20v-6h6v6"/>',
    car:'<path d="M5 16h14l-1.5-6h-11z"/><path d="M7 10 9 6h6l2 4M4 16v3M20 16v3"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/>',
    paw:'<circle cx="7" cy="8" r="2"/><circle cx="17" cy="8" r="2"/><circle cx="5" cy="13" r="2"/><circle cx="19" cy="13" r="2"/><path d="M8 18c0-3 2-5 4-5s4 2 4 5c0 2-2 3-4 3s-4-1-4-3Z"/>',
    wrench:'<path d="M14 6a4 4 0 0 0-5 5L3 17l4 4 6-6a4 4 0 0 0 5-5l-3 3-3-3 2-4Z"/>',
    store:'<path d="M4 9h16l-2-5H6Z"/><path d="M5 9v11h14V9M9 20v-6h6v6"/>',
    health:'<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6Z"/>',
    document:'<path d="M6 3h9l3 3v15H6Z"/><path d="M15 3v4h4M9 11h6M9 15h6"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 14h3M13 14h3M8 17h3"/>',
    bubble:'<path d="M4 5h16v11H9l-5 4Z"/><path d="M8 9h8M8 12h6"/>',
    building:'<path d="M4 20h16M6 20V9M18 20V9M3 9h18L12 4Z"/><path d="M9 12v5M12 12v5M15 12v5"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>'
  };

  function iconSvg(name){
    const body = iconPaths[name] || iconPaths.info;
    return `<svg class="sc-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${body}</svg>`;
  }

  const compositions = {
    listing:'listing', firm:'profile', shop:'profile', health:'profile', article:'editorial', publication:'editorial', event:'event', question:'public', info:'public'
  };

  const scenarios = {
    listing:{
      vik:{contentType:'Обява',title:'Предлагам ВиК ремонти в Лом',category:'Услуги',discovery:'ВиК',visualTheme:'water',label:'УСЛУГА · ВИК',icon:'pipe',accent:'#2b78b8',accentSoft:'#8bc6df',facebookText:'Търсите ВиК помощ в Лом? Вижте подробностите в обявата.',metaDesc:'ВиК ремонти и аварийни услуги в Лом и региона.'},
      catering:{contentType:'Обява',title:'Кетъринг в Лом',category:'Услуги',discovery:'Кетъринг',visualTheme:'food',label:'УСЛУГА · КЕТЪРИНГ',icon:'utensils',accent:'#b8832f',accentSoft:'#ead5a1',facebookText:'Търсите кетъринг за повод в Лом? Вижте предложението и подробностите.',metaDesc:'Кетъринг услуга в Лом и региона с подробности в обявата.'},
      work:{contentType:'Обява',title:'Търси се продавач-консултант в Лом',category:'Работа',discovery:'Търговия и продажби',visualTheme:'work',label:'РАБОТА',icon:'briefcase',accent:'#8c6427',accentSoft:'#dfc28d',facebookText:'Нова възможност за работа в Лом — вижте условията в обявата.',metaDesc:'Обява за работа в Лом с позиция и основна информация.'},
      property:{contentType:'Обява',title:'Двустаен апартамент в Лом',category:'Имоти',discovery:'Апартамент',visualTheme:'home',label:'ИМОТИ · ПРОДАВА',icon:'home',accent:'#356f5a',accentSoft:'#9ccab8',facebookText:'Разгледайте обява за двустаен апартамент в Лом.',metaDesc:'Имотна обява в Лом с основните публични детайли.'},
      auto:{contentType:'Обява',title:'Авточасти в Лом',category:'Автомобили и МПС',discovery:'Авточасти',visualTheme:'auto',label:'АВТОМОБИЛИ',icon:'car',accent:'#485f7b',accentSoft:'#aebed1',facebookText:'Търсите авточасти в Лом? Вижте конкретната обява.',metaDesc:'Автомобилна обява в Лом с конкретното предложение.'}
    },
    firm:{default:{contentType:'Профил',title:'Иванов Ремонти — Лом',category:'Майстори и ремонти',discovery:'Ремонти',visualTheme:'repairs',label:'МЕСТНА ФИРМА',icon:'wrench',accent:'#a87928',accentSoft:'#ddc38f',facebookText:'Вижте местния фирмен профил и услугите в Лом.',metaDesc:'Местен фирмен профил с услуги, район и контакти.',mediaType:'лого или основна снимка'}},
    shop:{default:{contentType:'Профил',title:'Магазин в Лом',category:'Хранителни',discovery:'Хранителни стоки',visualTheme:'shop',label:'МАГАЗИН',icon:'store',accent:'#8c5b37',accentSoft:'#d8b69d',facebookText:'Вижте какво предлага този местен магазин в Лом.',metaDesc:'Местен магазин в Лом с категория и публично описание.'}},
    health:{default:{contentType:'Профил',title:'Кардиолог в Лом',category:'Здраве',discovery:'Кардиолог',visualTheme:'health',label:'ЗДРАВЕ',icon:'health',accent:'#2d7083',accentSoft:'#9ed0d8',facebookText:'Търсите кардиолог в Лом? Вижте публичната информация за профила.',metaDesc:'Здравен профил в Лом с публично допустима информация.'}},
    article:{pension:{contentType:'Редакционно съдържание',title:'Как да се пенсираш в Лом',category:'Статия',discovery:'Документи и институции',visualTheme:'documents',label:'ПРАКТИЧНО РЪКОВОДСТВО',icon:'document',accent:'#9b772d',accentSoft:'#e3cf9d',facebookText:'Предстои ви пенсиониране? Вижте какви документи са необходими и къде се подават в Лом.',metaDesc:'Документи, стъпки и полезна местна информация на едно място.'}},
    publication:{default:{contentType:'Редакционно съдържание',title:'Местна актуализация в Лом',category:'Публикация',discovery:'Обща местна тема',visualTheme:'local',label:'АКТУАЛНО В ЛОМ',icon:'info',accent:'#3d6484',accentSoft:'#aec7d8',facebookText:'Ето какво е важно по тази местна тема в момента.',metaDesc:'Местна публикация от Попитай.Лом с конкретна самостоятелна цел.',mediaType:'одобрена снимка от публикацията'}},
    event:{default:{contentType:'Събитие',title:'Събитие в Лом',category:'Събития',discovery:'Местно събитие',visualTheme:'event',label:'СЪБИТИЕ',icon:'calendar',accent:'#7b4f80',accentSoft:'#c8a9ca',facebookText:'Предстои местно събитие в Лом — вижте актуалните подробности.',metaDesc:'Публично събитие в Лом с актуалната информация.',mediaType:'одобрен афиш или основна снимка'}},
    question:{default:{contentType:'Обществена информация',title:'Къде да намеря добър ВиК майстор?',category:'Майстори и ремонти',discovery:'ВиК',visualTheme:'question',label:'ВЪПРОС ОТ ЛОМ',icon:'bubble',accent:'#4b6d90',accentSoft:'#b4c9dc',facebookText:'Имате ли препоръка за добър ВиК майстор в Лом?',metaDesc:'Вижте отговорите от общността в Попитай.Лом.'}},
    info:{municipality:{contentType:'Обществена информация',title:'Община Лом',category:'Институции',discovery:'Институции',visualTheme:'institution',label:'ПРОВЕРЕНА ИНФОРМАЦИЯ',icon:'building',accent:'#526789',accentSoft:'#bac5d6',facebookText:'Търсите контакт или услуга на Община Лом? Вижте проверената информация.',metaDesc:'Проверена информация за Община Лом с източник и последна проверка.'}}
  };

  const defaultScenarioKeys = {listing:'vik',article:'pension',info:'municipality'};
  const fallbackTitles = {listing:'Обява в Лом',firm:'Местна фирма в Лом',shop:'Магазин в Лом',health:'Здравен профил в Лом',article:'Практично ръководство за Лом',publication:'Местна публикация',event:'Събитие в Лом',question:'Въпрос от Лом',info:'Проверена информация за Лом'};

  function currentQuery(){
    const raw=(location.hash.split('?')[1]||'').trim();
    return new URLSearchParams(raw);
  }

  function scenarioFor(kind,query){
    const group=scenarios[kind]||{};
    const key=query.get('demo')||defaultScenarioKeys[kind]||'default';
    return group[key]||group.default||Object.values(group)[0]||{};
  }

  function controlledFallback(kind,scenario,c){
    const exact=(scenario.discovery||'').trim();
    const category=(scenario.category||'').trim();
    if(exact) return `${exact} в Лом`;
    if(category) return `${category} в Лом`;
    return (c?.heading||'').trim() || fallbackTitles[kind] || 'Попитай.Лом';
  }

  function inputFor(kind,c,query){
    const scenario=scenarioFor(kind,query);
    const mediaAvailable=query.get('media')==='real';
    const title=(scenario.title||c?.heading||controlledFallback(kind,scenario,c)).trim() || controlledFallback(kind,scenario,c);
    return {
      contentType:scenario.contentType||kind,
      title,
      category:scenario.category||'',
      discovery:scenario.discovery||'',
      visualTheme:scenario.visualTheme||'generic',
      icon:scenario.icon||'info',
      label:scenario.label||String(scenario.contentType||kind).toLocaleUpperCase('bg-BG'),
      accent:scenario.accent||'#315e88',
      accentSoft:scenario.accentSoft||'#b9cad8',
      mediaAvailable,
      mediaType:scenario.mediaType||'одобрена снимка от записа',
      location:'Лом',
      publicApprovedShareEligible:true,
      facebookText:scenario.facebookText||'',
      metaDesc:scenario.metaDesc||c?.desc||'',
      titleSource:scenario.title?'контролирани данни на конкретния пример':(c?.heading?'реалното заглавие на съдържанието':'контролиран fallback'),
      composition:compositions[kind]||'public'
    };
  }

  function modeFor(input,query){
    const forced=query.get('image');
    if(['real','template','lom'].includes(forced)) return forced;
    if(input.mediaAvailable) return 'real';
    if(input.visualTheme&&input.visualTheme!=='none') return 'template';
    return 'lom';
  }

  function motifMarkup(input){
    return `<div class="sc-symbol" aria-hidden="true">${iconSvg(input.icon)}</div>`;
  }

  function ogImage(input,mode){
    const real = mode==='real';
    const lom = mode==='lom';
    const modeLabel=real?'Стъпка 1 — реална одобрена медия':lom?'Стъпка 3 — общ fallback':'Стъпка 2 — тематичен шаблон';
    const mediaClass=real?' sc-media-slot':lom?' sc-lom':' sc-template';
    return `<div class="sc-og-wrap"><div class="sc-og-head"><strong>og:image · 1200 × 630</strong><span>${modeLabel}</span></div><div class="sc-og sc-comp-${escapeHtml(input.composition)} sc-theme-${escapeHtml(input.visualTheme)}${mediaClass}" data-image-level="${mode}" data-composition="${escapeHtml(input.composition)}" data-theme="${escapeHtml(input.visualTheme)}" style="--sc-accent:${escapeHtml(input.accent)};--sc-accent-soft:${escapeHtml(input.accentSoft)}"><div class="sc-content"><span class="sc-label">${escapeHtml(input.label)}</span><strong class="sc-title">${escapeHtml(input.title)}</strong>${motifMarkup(input)}<span class="sc-brand">Попитай.Лом</span></div></div></div>`;
  }

  function metadata(input){
    return `<div class="sc-meta" aria-label="Open Graph metadata визуализация"><small>TRAQNIVANOV.GITHUB.IO · ПОПИТАЙ.ЛОМ</small><strong>${escapeHtml(input.title)}</strong><p>${escapeHtml(input.metaDesc)}</p></div>`;
  }

  function facebookText(input){
    if(!input.facebookText) return '';
    return `<aside class="sc-facebook-text"><strong>Примерен Facebook текст — незадължителен</strong><p>${escapeHtml(input.facebookText)}</p><small>Този текст се пише от човека, който споделя. Попитай.Лом не го контролира автоматично.</small></aside>`;
  }

  function exampleLinks(kind){
    const base=`#detail/${kind}?share=eligible`;
    if(kind==='listing') return [['ВиК',`${base}&demo=vik`],['Кетъринг',`${base}&demo=catering`],['Работа',`${base}&demo=work`],['Имоти',`${base}&demo=property`],['Автомобили',`${base}&demo=auto`]];
    if(kind==='article') return [['Пенсиониране',`${base}&demo=pension&media=none`]];
    if(kind==='publication') return [['С медия',`${base}&media=real`],['Без медия',`${base}&media=none`]];
    if(kind==='event') return [['С афиш',`${base}&media=real`],['Без афиш',`${base}&media=none`]];
    if(kind==='firm') return [['Профил с медия',`${base}&media=real`]];
    if(kind==='health') return [['Лекар без снимка',`${base}&media=none`]];
    if(kind==='info') return [['Община Лом',`${base}&demo=municipality`]];
    return [['Пример',base]];
  }

  function qaPanel(kind,input,mode){
    const links=exampleLinks(kind).map(([label,href])=>`<a class="btn soft" href="${href}">${escapeHtml(label)}</a>`).join('');
    return `<details class="qa-social-note sc-qa"><summary>Social Card Composer / QA</summary><p><strong>Composer input:</strong> contentType=${escapeHtml(input.contentType)} · category=${escapeHtml(input.category||'—')} · discovery=${escapeHtml(input.discovery||'—')} · theme=${escapeHtml(input.visualTheme)} · location=${escapeHtml(input.location)} · approved/share-eligible=${input.publicApprovedShareEligible?'да':'не'}.</p><p><strong>Източник на заглавието:</strong> ${escapeHtml(input.titleSource)}. Заглавието не се генерира от свободен текст.</p><p><strong>Image hierarchy:</strong> approved media → thematic template → Lom panorama fallback. Текущ режим: ${escapeHtml(mode)}. При режим real прототипът използва абстрактен слот вместо измислена снимка/лице; production трябва да постави реалната одобрена ${escapeHtml(input.mediaType)}.</p><p><strong>Production boundary:</strong> това доказва UX композицията, но не доказва crawlable Open Graph delivery. JavaScript симулация след зареждане не е достатъчна за Facebook crawler.</p><div class="page-tools"><a class="btn soft" href="#detail/${escapeHtml(kind)}?share=eligible&image=real">Стъпка 1</a><a class="btn soft" href="#detail/${escapeHtml(kind)}?share=eligible&image=template">Стъпка 2</a><a class="btn soft" href="#detail/${escapeHtml(kind)}?share=eligible&image=lom">Стъпка 3</a></div><div class="page-tools">${links}</div></details>`;
  }

  function injectStyles(){
    if(document.getElementById('prototype-social-card-composer-styles')) return;
    const style=document.createElement('style');
    style.id='prototype-social-card-composer-styles';
    style.textContent=`
      .social-card-composer{margin-top:22px}.social-card-composer>h3{margin-bottom:8px}.sc-facebook-text{margin:0 0 14px;padding:14px 16px;border:1px solid #d9e2ec;border-radius:14px;background:#fff}.sc-facebook-text strong{display:block;color:#183957}.sc-facebook-text p{margin:6px 0}.sc-facebook-text small{color:#64748b}.sc-og-wrap{max-width:980px}.sc-og-head{display:flex;justify-content:space-between;gap:12px;align-items:center;margin:8px 0;color:#52657b}.sc-og-head strong{color:#163a60}.sc-og{position:relative;aspect-ratio:1200/630;overflow:hidden;border-radius:18px;border:1px solid #cad6e2;background:#112f50;color:#fff;box-shadow:0 10px 30px rgba(15,40,71,.12)}.sc-og::before,.sc-og::after{content:"";position:absolute;pointer-events:none}.sc-content{position:relative;z-index:2;height:100%;padding:8.5%;display:grid;align-content:center;gap:16px}.sc-label{font-size:clamp(.72rem,1.4vw,1rem);font-weight:900;letter-spacing:.12em}.sc-title{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;max-width:76%;font-size:clamp(2rem,5vw,4rem);line-height:1.03;letter-spacing:-.025em}.sc-brand{position:absolute;right:5%;bottom:6%;padding:8px 13px;border-radius:999px;border:1px solid #ffffff66;background:#0d2745cc;font-weight:900;font-size:clamp(.7rem,1.5vw,1rem)}.sc-symbol{position:absolute;right:8%;top:15%;width:22%;aspect-ratio:1;border-radius:30%;display:grid;place-items:center;color:#0f2847;background:var(--sc-accent-soft);border:6px solid #ffffff36;box-shadow:0 18px 55px #0002}.sc-icon{width:58%;height:58%;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.sc-template{background:#14385f}.sc-comp-listing{background:linear-gradient(125deg,#0f3157 0 55%,var(--sc-accent) 100%)}.sc-comp-listing::before{right:-7%;top:-16%;width:42%;aspect-ratio:1;border:2px solid #ffffff2b;border-radius:50%;box-shadow:0 0 0 46px #ffffff0b,0 0 0 92px #ffffff08}.sc-comp-listing::after{left:0;bottom:0;width:38%;height:8px;background:var(--sc-accent-soft)}.sc-comp-profile{background:linear-gradient(90deg,#f7f9fc 0 32%,#10365c 32% 100%);color:#fff}.sc-comp-profile::before{left:0;top:0;bottom:0;width:10px;background:var(--sc-accent)}.sc-comp-profile .sc-label,.sc-comp-profile .sc-title{margin-left:28%}.sc-comp-profile .sc-symbol{left:6%;right:auto;top:25%;width:19%;background:var(--sc-accent-soft);border-color:#ffffff}.sc-comp-profile::after{right:-8%;bottom:-20%;width:38%;aspect-ratio:1;border-radius:50%;background:var(--sc-accent);opacity:.18}.sc-comp-editorial{background:#f7f2e7;color:#123553}.sc-comp-editorial::before{left:0;top:0;width:100%;height:18px;background:var(--sc-accent)}.sc-comp-editorial::after{right:-5%;top:13%;width:36%;height:70%;background:repeating-linear-gradient(135deg,transparent 0 16px,var(--sc-accent-soft) 16px 18px);opacity:.55}.sc-comp-editorial .sc-brand{background:#123553;color:#fff}.sc-comp-editorial .sc-symbol{background:#fff;border-color:var(--sc-accent-soft);color:#123553}.sc-comp-event{background:#152b46}.sc-comp-event::before{inset:7%;border:2px solid var(--sc-accent-soft);border-radius:22px}.sc-comp-event::after{right:8%;top:8%;width:23%;height:13%;border-radius:15px 15px 0 0;background:var(--sc-accent)}.sc-comp-event .sc-symbol{right:11%;top:24%;border-radius:18px;background:#fff;color:#152b46}.sc-comp-public{background:linear-gradient(135deg,#edf4fa,#dce8f2);color:#173a5b}.sc-comp-public::before{left:0;top:0;bottom:0;width:18%;background:#173a5b}.sc-comp-public::after{right:7%;bottom:11%;width:18%;aspect-ratio:1;border:3px solid var(--sc-accent);border-radius:50%;opacity:.45}.sc-comp-public .sc-label,.sc-comp-public .sc-title{margin-left:12%}.sc-comp-public .sc-symbol{left:4%;right:auto;top:34%;width:12%;background:var(--sc-accent-soft);border-color:#fff}.sc-comp-public .sc-brand{background:#173a5b;color:#fff}.sc-theme-water::after{border-radius:50%}.sc-theme-food::after{background-image:radial-gradient(circle,var(--sc-accent-soft) 2px,transparent 2px);background-size:22px 22px;opacity:.22}.sc-theme-work::after{background:repeating-linear-gradient(90deg,transparent 0 38px,var(--sc-accent-soft) 38px 42px);opacity:.15}.sc-theme-home::after{clip-path:polygon(50% 0,100% 40%,100% 100%,0 100%,0 40%);background:var(--sc-accent-soft);opacity:.13}.sc-theme-auto::after{background:repeating-linear-gradient(160deg,transparent 0 28px,var(--sc-accent-soft) 28px 31px);opacity:.2}.sc-theme-health::after{background:radial-gradient(circle at 70% 45%,var(--sc-accent-soft) 0 14%,transparent 14% 20%,var(--sc-accent-soft) 20% 22%,transparent 22%);opacity:.38}.sc-theme-documents::after{background:linear-gradient(90deg,transparent 0 64%,var(--sc-accent-soft) 64% 66%,transparent 66% 70%,var(--sc-accent-soft) 70% 72%,transparent 72%);opacity:.28}.sc-media-slot{background:linear-gradient(135deg,#3d536a,#20364d)}.sc-media-slot::before{inset:0;background:repeating-linear-gradient(135deg,#ffffff08 0 18px,#ffffff12 18px 36px)}.sc-media-slot::after{right:6%;bottom:6%;width:28%;height:12%;border-radius:999px;background:var(--sc-accent);opacity:.4}.sc-lom{background:linear-gradient(#0d274599,#0d274599),url('../assets/lom-cover-share-1200x630.webp') center/cover no-repeat}.sc-lom::before{inset:0;background:linear-gradient(90deg,#0b2748cc 0 45%,transparent 78%)}.sc-lom .sc-symbol{background:#ffffffdf}.sc-meta{max-width:980px;padding:18px 20px;border:1px solid #cfd8e2;border-top:5px solid var(--gold,#c59a3d);border-radius:0 0 16px 16px;background:#fff;display:grid;gap:6px}.sc-meta small{color:#6a7786;letter-spacing:.04em}.sc-meta strong{font-size:1.35rem;color:#10365c}.sc-meta p{margin:0;color:#4f5f70}.sc-separation-note{max-width:980px;margin:10px 0 0;color:#607185}.sc-qa{max-width:980px}.sc-qa .page-tools{margin-top:10px}.social-card-composer [href*="demo="]{white-space:nowrap}
      @media(max-width:640px){.sc-og-head{align-items:flex-start;flex-direction:column}.sc-title{max-width:84%;font-size:clamp(1.55rem,8vw,2.5rem)}.sc-content{padding:9%}.sc-symbol{width:24%;right:6%;top:9%}.sc-comp-profile .sc-label,.sc-comp-profile .sc-title{margin-left:0;max-width:72%}.sc-comp-profile .sc-symbol{left:auto;right:6%;top:10%;width:24%}.sc-comp-public .sc-label,.sc-comp-public .sc-title{margin-left:0;max-width:76%}.sc-comp-public .sc-symbol{left:auto;right:6%;top:10%;width:22%}.sc-facebook-text,.sc-meta{padding:13px 14px}.sc-meta strong{font-size:1.1rem}}
    `;
    document.head.appendChild(style);
  }

  function render(kind,c){
    injectStyles();
    const query=currentQuery();
    const input=inputFor(kind,c,query);
    const mode=modeFor(input,query);
    return `<section class="social-preview-section social-card-composer" aria-label="Social Card Composer пример"><h3>Social Card Composer — UX пример, не production интеграция</h3>${facebookText(input)}${ogImage(input,mode)}${metadata(input)}<p class="sc-separation-note">`+
      `og:image е отделен 1200×630 asset. Заглавието, описанието и домейнът са отделни Open Graph metadata елементи. QA обясненията са извън картата.</p>${qaPanel(kind,input,mode)}</section>`;
  }

  window.PopitaiSocialCardComposer={render,inputFor,scenarioFor,modeFor,scenarios,compositions};
  window.socialPreview=render;
})();
