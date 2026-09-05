'use strict';

(() => {
  const eligible=new Set(['listing','firm','shop','restaurant','health','event','publication','article','info']);
  const saved=new Map();
  let loggedIn=false;
  let message='';

  const typeLabels={listing:'Обяви и услуги',firm:'Фирми',shop:'Магазини',restaurant:'Заведения',health:'Health профили',event:'Събития',publication:'Публикации',article:'Статии',info:'Инфо Лом'};

  function inferFromHref(href=''){
    const value=String(href);
    if(/detail\/question|vapros\.html/i.test(value)) return {type:'question',key:value};
    if(/detail\/firm|firma\.html/i.test(value)) return {type:'firm',key:value};
    if(/detail\/shop|magazini\.html/i.test(value)) return {type:'shop',key:value};
    if(/detail\/health|zdrave-i-lekari\.html/i.test(value)) return {type:'health',key:value};
    if(/detail\/event|sabitiya\.html/i.test(value)) return {type:'event',key:value};
    if(/detail\/publication/i.test(value)) return {type:'publication',key:value};
    if(/detail\/article|statia\.html/i.test(value)) return {type:'article',key:value};
    if(/detail\/info|info\.html/i.test(value)) return {type:'info',key:value};
    return {type:'listing',key:value||location.hash};
  }

  function titleFor(node){
    return node?.querySelector?.('h1,h2,h3,strong')?.textContent?.trim() || 'Запазен запис';
  }

  function makeButton({type,key,title}){
    const button=document.createElement('button');
    button.type='button';
    button.className='favorite-heart';
    button.dataset.favoriteToggle='true';
    button.dataset.favoriteType=type;
    button.dataset.favoriteKey=key;
    button.dataset.favoriteTitle=title;
    button.setAttribute('aria-label',saved.has(key)?'Премахни от любими':'Добави в любими');
    button.setAttribute('aria-pressed',String(saved.has(key)));
    button.textContent=saved.has(key)?'♥':'♡';
    return button;
  }

  function augmentRows(root=document){
    root.querySelectorAll('.result-row').forEach((row,index)=>{
      if(row.querySelector('[data-favorite-toggle]')) return;
      const link=row.querySelector('a[href]');
      let info=inferFromHref(link?.getAttribute('href')||'');
      if(location.hash.startsWith('#magazini')&&!link?.getAttribute('href')?.startsWith('#detail')) info={type:'shop',key:`shop:${titleFor(row)}:${index}`};
      if(!eligible.has(info.type)) return;
      row.classList.add('favorite-card-host');
      row.append(makeButton({type:info.type,key:info.key||`${info.type}:${titleFor(row)}:${index}`,title:titleFor(row)}));
    });
  }

  function augmentInfo(root=document){
    root.querySelectorAll('a.info-card[href*="#detail/info"]').forEach(anchor=>{
      if(anchor.parentElement?.classList.contains('favorite-info-wrap')) return;
      const href=anchor.getAttribute('href')||'';
      const wrap=document.createElement('div');
      wrap.className='favorite-info-wrap';
      anchor.before(wrap);
      wrap.append(anchor);
      wrap.append(makeButton({type:'info',key:href,title:titleFor(anchor)}));
    });
  }

  function augmentDetail(root=document){
    const page=root.querySelector('.detail-page');
    if(!page) return;
    const path=parseHash().path;
    const type=path.split('/')[1]||'listing';
    const button=page.querySelector('.favorite-pending');
    if(!button||!eligible.has(type)) return;
    const key=location.hash||`${type}:${titleFor(page)}`;
    button.classList.remove('favorite-pending');
    button.removeAttribute('aria-disabled');
    button.removeAttribute('title');
    button.dataset.favoriteToggle='true';
    button.dataset.favoriteType=type;
    button.dataset.favoriteKey=key;
    button.dataset.favoriteTitle=titleFor(page);
    button.setAttribute('aria-pressed',String(saved.has(key)));
    button.textContent=saved.has(key)?'Премахни от любими':'Добави в любими';
  }

  function groupsHtml(){
    if(!saved.size) return '<article class="empty-card"><h2>Нямаш запазени записи</h2><p>Когато добавиш нещо в любими, ще се появи тук по вид съдържание.</p></article>';
    const groups=new Map();
    [...saved.values()].forEach(item=>{
      if(!groups.has(item.type)) groups.set(item.type,[]);
      groups.get(item.type).push(item);
    });
    return [...groups.entries()].map(([type,items])=>`<section class="saved-group"><h2>${esc(typeLabels[type]||type)}</h2><div class="result-list">${items.map(item=>`<article class="result-row"><div><h3>${esc(item.title)}</h3><p>${esc(typeLabels[item.type]||item.type)}</p></div><button class="btn soft" type="button" data-favorite-remove="${esc(item.key)}">Премахни</button></article>`).join('')}</div></section>`).join('');
  }

  function profileMarkup(){
    if(!loggedIn){
      return `<div class="page favorites-profile" data-favorites-profile>${pageHead('Профил','Влез, за да виждаш собственото съдържание и запазените записи.')}<div class="shell"><article class="profile-card"><h2>Не си влязъл в профила си</h2><p>За да използваш „Любими“, е необходим профил.</p><button class="btn primary" type="button" data-favorite-demo-login>Вход</button></article><section class="saved-section"><h2>Запазени</h2><p>След вход тук се показват запазените записи, групирани по вид.</p></section><p class="favorite-session-note">В този прототип няма реален вход и няма постоянно съхранение.</p></div></div>`;
    }
    return `<div class="page favorites-profile" data-favorites-profile>${pageHead('Профил','Твоето съдържание и запазените записи.')}<div class="shell"><article class="profile-card"><h2>Профил</h2><p>Демонстрационно състояние след вход.</p><button class="btn soft" type="button" data-favorite-demo-logout>Изход</button></article><section class="saved-section"><div class="section-head"><div><h2>Запазени</h2><p>Групирани по вид съдържание.</p></div></div>${groupsHtml()}</section><p class="favorite-session-note">Запазването е само за текущата отворена сесия на прототипа и не се записва в Supabase.</p></div></div>`;
  }

  function renderProfileIfNeeded(){
    if(parseHash().path!=='profile') return false;
    const main=document.getElementById('app-main');
    if(!main) return false;
    if(!main.querySelector('[data-favorites-profile]')) main.innerHTML=profileMarkup();
    return true;
  }

  function refresh(){
    if(renderProfileIfNeeded()) return;
    augmentRows();
    augmentInfo();
    augmentDetail();
  }

  document.addEventListener('click',event=>{
    const login=event.target.closest('[data-favorite-demo-login]');
    if(login){loggedIn=true;document.getElementById('app-main').innerHTML=profileMarkup();return;}
    const logout=event.target.closest('[data-favorite-demo-logout]');
    if(logout){loggedIn=false;saved.clear();document.getElementById('app-main').innerHTML=profileMarkup();return;}
    const remove=event.target.closest('[data-favorite-remove]');
    if(remove){saved.delete(remove.dataset.favoriteRemove);document.getElementById('app-main').innerHTML=profileMarkup();return;}
    const toggle=event.target.closest('[data-favorite-toggle]');
    if(!toggle) return;
    if(!loggedIn){
      message='Влез в профила си, за да добавяш в любими.';
      let note=document.querySelector('.favorite-login-note');
      if(!note){note=document.createElement('div');note.className='favorite-login-note';document.body.append(note);}
      note.innerHTML=`<span>${esc(message)}</span><a href="#profile">Към профила</a>`;
      return;
    }
    const key=toggle.dataset.favoriteKey;
    if(saved.has(key)) saved.delete(key);
    else saved.set(key,{key,type:toggle.dataset.favoriteType,title:toggle.dataset.favoriteTitle});
    refresh();
  });

  const observer=new MutationObserver(()=>queueMicrotask(refresh));
  const main=document.getElementById('app-main');
  if(main) observer.observe(main,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>queueMicrotask(refresh));
  window.PopitaiFavoritesPrototype=Object.freeze({eligible,storage:'session-memory-only'});
  queueMicrotask(refresh);
})();
