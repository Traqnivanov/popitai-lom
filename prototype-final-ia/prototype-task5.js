'use strict';

(() => {
  const approved = Object.freeze({
    latest: Object.freeze([
      Object.freeze({
        title:'TELEVIZOR',
        description:'Електроника · Продава',
        type:'Обява',
        meta:'333 евро · Лом',
        href:'https://traqnivanov.github.io/popitai-lom/obqva.html?id=97f0a906-2836-484d-856f-a57bdfba5424'
      })
    ]),
    firms: Object.freeze([
      Object.freeze({
        title:'Иванов Ремонти Лом',
        description:'Шпакловка, боядисване, гипсокартон и ВиК услуги в Лом и региона. 23 години опит, фиксирана цена по договор и писмена гаранция.',
        type:'Фирма',
        meta:'Майстори и ремонти · Лом',
        href:'https://traqnivanov.github.io/popitai-lom/firma.html?id=d48cae4e-ea29-46fc-8bc0-24ebed828054'
      })
    ]),
    masterFirms: Object.freeze([
      Object.freeze({
        title:'Иванов Ремонти Лом',
        description:'Шпакловка, боядисване, гипсокартон и ВиК услуги в Лом и региона. 23 години опит, фиксирана цена по договор и писмена гаранция.',
        type:'Фирма',
        meta:'Майстори и ремонти · Лом',
        href:'https://traqnivanov.github.io/popitai-lom/firma.html?id=d48cae4e-ea29-46fc-8bc0-24ebed828054'
      })
    ]),
    masterActivity: Object.freeze([]),
    shops: Object.freeze([
      Object.freeze({title:'Дрийм Колорс',description:'Бои, мазилки и материали за довършителни работи',meta:'ул. „Георги Манафски“ 19, Лом'}),
      Object.freeze({title:'Дартон / Магазин за бани',description:'Бани, санитария и обзавеждане',meta:'ул. „Славянска“ 126, Лом',phone:'0895 793 130'}),
      Object.freeze({title:'ЕТ „Таня Иванова“',description:'Строителни материали, железария, ВиК и обзавеждане',meta:'ул. „Цар Симеон“ 110, Лом',phone:'0886 552 618'})
    ]),
    articles: Object.freeze([
      Object.freeze({
        title:'Как да избереш майстор и да избегнеш неприятни изненади',
        description:'Проверки, въпроси и ясни условия преди започване на ремонта.',
        type:'Статия',
        meta:'Дом и ремонт',
        href:'https://traqnivanov.github.io/popitai-lom/statia.html'
      })
    ]),
    publications: Object.freeze([]),
    events: Object.freeze([]),
    questions: Object.freeze([])
  });

  window.PopitaiApprovedContent = approved;

  const publicRow = item => window.PopitaiStage2MasterOrder?.publicRow?.(item) || '';

  window.firms = function firms(query){
    const rows=approved.firms.map(publicRow).join('');
    const body=rows || '<article class="empty-card"><p>Няма публикувани фирмени профили за показване.</p></article>';
    return `<div class="page">${pageHead('Фирми','Постоянни местни профили. Фирмата не е обява.')}<div class="shell"><div class="page-tools"><a class="btn primary" href="#add/firm">＋ Добави фирма</a></div><div class="section-head" style="margin-top:24px"><div><h2>Фирмени профили</h2><p>Услуги, район и директни контакти.</p></div></div>${stateContent(query,`<div class="result-list">${body}</div>`)}</div></div>`;
  };

  window.current = function current(){
    const items=[...approved.publications,...approved.events];
    const content=items.length
      ? `<div class="result-list">${items.map(publicRow).join('')}</div>`
      : '<article class="empty-card"><h2>Няма актуално съдържание за показване</h2><p>В момента няма потвърдена публикация или предстоящо събитие за този изглед.</p></article>';
    return `<div class="page">${pageHead('Актуално','Местни публикации и предстоящи събития на едно място.')}<div class="shell">${content}</div></div>`;
  };

  window.articles = function articles(){
    const rows=approved.articles.map(publicRow).join('');
    return `<div class="page">${pageHead('Статии','Пълни практични ръководства с местната информация на първо място.')}<div class="shell"><div class="result-list">${rows || '<article class="empty-card"><p>Няма публикувани статии за показване.</p></article>'}</div></div></div>`;
  };

  window.questions = function questions(){
    return `<div class="page">${pageHead('Въпроси','Помощ от общността, когато няма готов отговор.')}<div class="shell"><div class="page-tools"><a class="btn primary" href="#add/question">＋ Задай въпрос</a></div><article class="empty-card" style="margin-top:18px"><h2>Все още няма одобрени въпроси</h2><p>Задай въпрос, когато не намираш готов отговор в услугите, обявите или Инфо Лом.</p></article></div></div>`;
  };

  const previousShops=window.shops;
  window.shops = function shops(){
    const base=typeof previousShops==='function'?previousShops():'';
    const cards=approved.shops.map(item=>`<article class="result-row"><div><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p><div class="result-meta"><span class="badge gold">${esc(item.meta)}</span></div></div>${item.phone?`<a class="btn soft" href="tel:${item.phone.replace(/[^\d+]/g,'')}">Обади се</a>`:''}</article>`).join('');
    if(!base||!cards) return base;
    return base.replace('</div></div>','<section class="stage2-live-shops"><div class="section-head compact-head"><div><h2>Публични строителни магазини</h2><p>Потвърдени примери от текущия публичен каталог.</p></div></div><div class="result-list">'+cards+'</div></section></div></div>');
  };
})();
