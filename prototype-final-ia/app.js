'use strict';

(() => {
  const main=document.getElementById('app-main');
  const ROUTE_INDEX_KEY='popitaiStage2RouteIndex';
  let restoringHistory=false;
  let lastRenderedHash='#home';
  let currentIndex=0;

  function canonicalHash(raw=location.hash){
    const value=String(raw||'').trim();
    if(!value||value==='#')return '#home';
    const body=value.startsWith('#')?value.slice(1):value;
    const splitAt=body.indexOf('?');
    const pathRaw=splitAt===-1?body:body.slice(0,splitAt);
    const queryRaw=splitAt===-1?'':body.slice(splitAt+1);
    const route=(pathRaw||'home').replace(/^\/+/, '')||'home';
    const query=new URLSearchParams(queryRaw);
    const normalized=query.toString();
    return `#${route}${normalized?`?${normalized}`:''}`;
  }
  function routeIndex(state=history.state){
    const value=state?.[ROUTE_INDEX_KEY];
    return Number.isInteger(value)?value:null;
  }
  function routeState(index){return {...(history.state||{}),[ROUTE_INDEX_KEY]:index};}

  function viewFor(path,query){
    if(path==='home') return home();
    if(path==='obyavi') return hub(query);
    if(path==='uslugi') return services();
    if(path==='maistori') return masters();
    if(path==='service-group') return serviceGroup(query);
    if(path==='rabota') return work(query);
    if(path==='imoti') return properties();
    if(path==='stoki') return goods();
    if(path==='avtomobili') return auto();
    if(path==='zhivotni') return animals();
    if(path==='magazini') return shops();
    if(path==='zavedenia') return restaurants();
    if(path==='zdrave') return health();
    if(path==='firmi') return firms(query);
    if(path==='info') return info();
    if(path==='aktualno') return current();
    if(path==='statii') return articles();
    if(path==='vaprosi') return questions();
    if(path==='results') return results(query);
    if(path==='visual-icons') return iconCheckpoint();
    if(path.startsWith('detail/')) return detail(path.split('/')[1],query);
    if(path.startsWith('add/')) return formPage(path.split('/')[1],query);
    if(path==='about') return staticPage('За сайта','Попитай.Лом е местен портал за намиране, публикуване и помощ от общността.');
    if(path==='rules') return staticPage('Правила','Правилата на общността определят какво съдържание може да се публикува и как се преглежда.');
    if(path==='contacts') return staticPage('Контакти','Свържи се с екипа на Попитай.Лом по въпроси за сайта или съдържанието.');
    if(path==='profile') return window.PopitaiInteractions?.profileMarkup?.()||staticPage('Профил','Тук се намират собственото съдържание, редакциите и статусите му.');
    return staticPage('Страницата не е намерена','Този адрес не съществува.');
  }
  function updateNav(path){
    const top=path.split('/')[0];
    document.querySelectorAll('[data-nav]').forEach(link=>{
      link.classList.toggle('active',link.dataset.nav===top||(link.dataset.nav==='obyavi'&&['uslugi','service-group','maistori','rabota','imoti','stoki','avtomobili','zhivotni','magazini','zavedenia','zdrave'].includes(top)));
    });
  }
  function render(){
    const {path,query}=parseHash();
    main.innerHTML=viewFor(path,query);
    updateNav(path);
    window.PopitaiInteractions?.afterRender?.(path,query);
    const successCard=query.get('state')==='success'?main.querySelector('[data-success-card],.form-wrap .notice.ok'):null;
    if(successCard){successCard.tabIndex=-1;successCard.dataset.successCard='';}
    (successCard||main).focus({preventScroll:true});
    window.scrollTo({top:0,behavior:'instant'});
  }
  function commitRenderedRoute(nextHash){
    lastRenderedHash=nextHash;
    window.PopitaiInteractions?.closeTransient?.();
    render();
  }
  function canLeave(nextHash){
    return !window.PopitaiInteractions||window.PopitaiInteractions.beforeRouteChange(nextHash,lastRenderedHash)!==false;
  }
  function navigate(target,{replace=false,skipGuard=false}={}){
    const nextHash=canonicalHash(target);
    if(nextHash===lastRenderedHash)return true;
    if(!skipGuard&&!canLeave(nextHash))return false;
    if(replace){
      history.replaceState(routeState(currentIndex),'',nextHash);
    }else{
      currentIndex+=1;
      history.pushState(routeState(currentIndex),'',nextHash);
    }
    commitRenderedRoute(nextHash);
    return true;
  }
  function completeSubmittedForm(){
    const route=parseHash();
    if(!route.path.startsWith('add/'))return false;
    const query=new URLSearchParams(route.query);
    query.set('state','success');
    const target=`#${route.path}?${query}`;
    return navigate(target,{replace:true,skipGuard:true});
  }
  function handlePopState(event){
    if(restoringHistory){
      restoringHistory=false;
      const restored=routeIndex(event.state);
      if(restored!==null)currentIndex=restored;
      return;
    }
    const nextHash=canonicalHash(location.hash);
    if(nextHash===lastRenderedHash){
      const sameIndex=routeIndex(event.state);
      if(sameIndex!==null)currentIndex=sameIndex;
      if(location.hash!==nextHash)history.replaceState(routeState(currentIndex),'',nextHash);
      return;
    }
    const nextIndex=routeIndex(event.state);
    if(!canLeave(nextHash)){
      if(nextIndex!==null&&nextIndex!==currentIndex){
        restoringHistory=true;
        history.go(currentIndex-nextIndex);
      }else{
        history.replaceState(routeState(currentIndex),'',lastRenderedHash);
      }
      return;
    }
    if(nextIndex!==null)currentIndex=nextIndex;
    if(location.hash!==nextHash)history.replaceState(routeState(currentIndex),'',nextHash);
    commitRenderedRoute(nextHash);
  }
  function handleRouteClick(event){
    if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const link=event.target.closest?.('a[href]');
    if(!link||link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;
    const href=link.getAttribute('href')||'';
    if(href==='#app-main'){
      event.preventDefault();
      main.focus({preventScroll:true});
      main.scrollIntoView({block:'start'});
      return;
    }
    if(!href.startsWith('#'))return;
    event.preventDefault();
    navigate(href);
  }
  function handleSubmittedForm(event){
    const workSearch=event.target.closest?.('[data-work-search]');
    if(workSearch){
      event.preventDefault();
      const route=parseHash();if(route.path!=='rabota')return;
      const query=new URLSearchParams(route.query),q=new FormData(workSearch).get('q')?.toString().trim()||'';
      if(q)query.set('q',q);else query.delete('q');
      navigate(`#rabota${query.size?`?${query}`:''}`);
      return;
    }
    const form=event.target.closest?.('[data-proto-form]');
    if(!form||form.dataset.submitted!=='true')return;
    completeSubmittedForm();
  }
  function getState(){return Object.freeze({index:currentIndex,hash:lastRenderedHash,restoring:restoringHistory});}

  const initialHash=canonicalHash(location.hash);
  const initialIndex=routeIndex();
  currentIndex=initialIndex===null?0:initialIndex;
  history.replaceState(routeState(currentIndex),'',initialHash);
  lastRenderedHash=initialHash;

  document.addEventListener('click',handleRouteClick,true);
  document.addEventListener('submit',handleSubmittedForm);
  window.addEventListener('popstate',handlePopState);
  window.PopitaiRouter=Object.freeze({render,viewFor,navigate,canonicalHash,getState});
  render();
})();
