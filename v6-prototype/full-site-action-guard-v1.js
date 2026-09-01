(function(){
'use strict';
var toast=document.getElementById('toast');
var timer=null;
if(!toast)return;
function show(message){toast.textContent=message;toast.hidden=false;clearTimeout(timer);timer=setTimeout(function(){toast.hidden=true;},3200);}
var messages={
  'Избери снимки':'Прототип: тук се отваря изборът на снимки. В този преглед не се качват реални файлове.',
  'Избери лого':'Прототип: тук се избира логото. В този преглед не се качват реални файлове.',
  'Намери':'Прототип: търсенето остава в текущия раздел и показва само релевантните резултати.',
  'Търси':'Прототип: търсенето показва релевантните резултати според текущия раздел.',
  'Обади се':'Прототип: в живия сайт бутонът използва публикувания телефон на записа.',
  'Поискай оферта':'Прототип: тук се отваря одобреният контактен поток за фирмата.',
  'Сайт':'Прототип: бутонът се показва само когато има публикуван адрес на сайт.',
  'Сподели':'Прототип: споделя се само публичният каноничен адрес на страницата.',
  'Докладвай':'Прототип: тук се отваря формата за сигнал за конкретния запис.',
  'Статистики':'Прототип: тук се зареждат реалните аналитични данни. Не показваме измислени числа.',
  'Виж профила':'Прототип: този примерен втори фирмен профил няма отделна демонстрационна страница.'
};
document.addEventListener('click',function(event){
  var button=event.target.closest('#app button');
  if(!button)return;
  if(button.type==='submit'||button.hasAttribute('data-route')||button.hasAttribute('data-action')||button.hasAttribute('data-functional-action')||button.hasAttribute('data-functional-tab')||button.hasAttribute('data-v6-intent'))return;
  var text=(button.textContent||'').trim();
  if(!messages[text])return;
  event.preventDefault();
  event.stopImmediatePropagation();
  show(messages[text]);
},true);
})();