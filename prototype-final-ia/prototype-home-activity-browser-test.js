'use strict';

(() => {
  const views=window.PopitaiHomeViews;
  const now=new Date('2026-09-09T12:00:00+03:00');
  const isoDaysAgo=days=>new Date(now.getTime()-days*86400000).toISOString();
  const isoDaysAhead=days=>new Date(now.getTime()+days*86400000).toISOString();
  const base=()=>({latest:[],publications:[],articles:[],events:[]});
  const fixtures={
    today:()=>({...base(),latest:[{id:'listing-1',contentType:'listing',publishedAt:now.toISOString(),status:'approved',visibility:'public'}],articles:[{id:'article-1',contentType:'article',approvedAt:now.toISOString(),status:'approved',visibility:'public'}],events:[{id:'event-1',contentType:'event',startsAt:now.toISOString(),status:'approved',visibility:'public'}]}),
    week:()=>({...base(),publications:[{id:'publication-1',contentType:'publication',publishedAt:isoDaysAgo(1),status:'approved',visibility:'public'}]}),
    useful:()=>({...base(),latest:[{id:'undated',contentType:'listing',status:'approved',visibility:'public'}]}),
    guards:()=>({...base(),latest:[
      {id:'duplicate',contentType:'listing',publishedAt:now.toISOString(),status:'approved',visibility:'public'},
      {id:'duplicate',contentType:'listing',publishedAt:now.toISOString(),status:'approved',visibility:'public'},
      {id:'future',contentType:'listing',publishedAt:isoDaysAhead(1),status:'approved',visibility:'public'},
      {id:'invalid',contentType:'listing',publishedAt:'not-a-date',status:'approved',visibility:'public'},
      {id:'pending',contentType:'listing',publishedAt:now.toISOString(),status:'pending',visibility:'public'},
      {id:'private',contentType:'listing',publishedAt:now.toISOString(),status:'approved',visibility:'private'}
    ]})
  };
  function render(name){
    const model=views.activityModel(fixtures[name](),now);
    document.getElementById('result').innerHTML=views.activityMarkup(model);
    document.getElementById('evidence').textContent=JSON.stringify({case:name,mode:model.mode,title:model.title,metrics:model.metrics.map(item=>({key:item.key||'',label:item.label,count:item.count??null,href:item.href}))},null,2);
    document.querySelectorAll('[data-case]').forEach(button=>button.classList.toggle('active',button.dataset.case===name));
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-case]');
    if(button)render(button.dataset.case);
  });
  render('today');
})();
