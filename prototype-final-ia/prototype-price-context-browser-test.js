'use strict';

(async()=>{
  const resultList=document.getElementById('results');
  const summary=document.querySelector('[data-test-summary]');
  const frame=document.getElementById('app-frame');
  let passed=0,failed=0;
  const record=(ok,label,detail='')=>{
    const li=document.createElement('li');li.className=ok?'pass':'fail';li.textContent=`${ok?'PASS':'FAIL'} — ${label}${detail?` — ${detail}`:''}`;resultList.append(li);
    if(ok)passed++;else failed++;
  };
  const check=(condition,label,detail='')=>record(Boolean(condition),label,detail);
  const waitFor=async(test,timeout=8000)=>{const start=Date.now();while(Date.now()-start<timeout){if(test())return true;await new Promise(r=>setTimeout(r,50));}return false;};
  const labels=doc=>[...doc.querySelectorAll('[data-price-option-items] label')].map(x=>x.textContent.trim());
  const checkedCount=doc=>doc.querySelectorAll('[data-price-option-items] input:checked').length;

  try{
    const params=new URLSearchParams({category:'Услуги',subcategory:'ВиК',type:'Дава',discovery:'ВиК'});
    frame.src=`index.html#add/listing?${params}`;
    await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('iframe load timeout')),10000);frame.addEventListener('load',()=>{clearTimeout(timer);resolve();},{once:true});});
    const ready=await waitFor(()=>frame.contentDocument?.querySelector('#listing-category')&&frame.contentWindow?.PopitaiInteractions);
    check(ready,'реалният runtime се зареди в iframe');
    if(!ready)throw new Error('runtime not ready');

    const win=frame.contentWindow,doc=frame.contentDocument;
    const form=doc.querySelector('[data-proto-form][data-form-kind="listing"]');
    const category=doc.getElementById('listing-category');
    const price=doc.getElementById('listing-price');
    const type=doc.getElementById('listing-type');
    const typeField=doc.querySelector('[data-listing-type-field]');
    const subcategory=doc.getElementById('listing-subcategory');
    const subcategoryField=doc.getElementById('listing-subcategory-field');
    const setCategory=value=>{category.value=value;category.dispatchEvent(new win.Event('change',{bubbles:true}));};
    const fireChange=control=>control.dispatchEvent(new win.Event('change',{bubbles:true}));

    check(form?.dataset.discoveryContext==='ВиК','Service discovery context е зареден');
    check(type?.value==='Дава','Service create type е Дава');
    check(typeField?.hidden===true,'Service type selector е непубличен');
    check(labels(doc).join('|')==='По договаряне|Цена след оглед/запитване','Services показва точните price controls',labels(doc).join(' | '));
    check(!doc.getElementById('price-free'),'Services няма „Подарява“');
    check(Boolean(doc.getElementById('price-on-request')),'Services има „Цена след оглед/запитване“');

    price.value='125';
    const onRequest=doc.getElementById('price-on-request');onRequest.checked=true;fireChange(onRequest);
    check(price.value===''&&price.disabled,'„Цена след оглед/запитване“ чисти и блокира numeric price');

    setCategory('Електроника');
    check(form.dataset.discoveryContext==='','ръчната смяна чисти discovery context');
    check(doc.querySelector('.service-context-summary')?.hidden===true,'ръчната смяна скрива стария Service summary');
    check(subcategory.disabled&&subcategoryField.hidden,'не-Service категорията изключва Service подкатегорията');
    check(typeField.hidden===false&&type.value==='','типът става нормален и се изчиства извън Services');
    check(labels(doc).join('|')==='По договаряне|Подарява (безплатно)','вещите показват „По договаряне“ + „Подарява“',labels(doc).join(' | '));
    check(!doc.getElementById('price-on-request'),'вещите не наследяват Service „Цена след оглед/запитване“');
    check(price.value===''&&!price.disabled&&checkedCount(doc)===0,'смяната към вещи нулира price value/flags');

    const free=doc.getElementById('price-free');price.value='88';free.checked=true;fireChange(free);
    check(price.value===''&&price.disabled,'„Подарява“ чисти и блокира numeric price');
    setCategory('Работа');
    check(!doc.getElementById('price-free')&&!doc.getElementById('price-on-request'),'Работа няма неподходящи inherited controls');
    check(labels(doc).join('|')==='По договаряне','Работа има само „По договаряне“');
    check(doc.querySelector('[data-price-label]')?.textContent.trim()==='Възнаграждение в евро','Работа използва контекстен price label');
    check(price.value===''&&!price.disabled&&checkedCount(doc)===0,'смяната към Работа нулира price state');

    for(const [value,label,expectedLabel] of [
      ['Имоти','Имоти','Цена / наем в евро'],
      ['Автомобили и МПС','Автомобили','Цена в евро'],
      ['Животни','Животни','Цена в евро']
    ]){
      setCategory(value);
      check(!doc.getElementById('price-free'),`${label} няма „Подарява“`);
      check(!doc.getElementById('price-on-request'),`${label} няма Service price-on-request`);
      check(labels(doc).join('|')==='По договаряне',`${label} има само „По договаряне“`);
      check(doc.querySelector('[data-price-label]')?.textContent.trim()===expectedLabel,`${label} има правилен price label`);
      check(price.value===''&&!price.disabled&&checkedCount(doc)===0,`${label} започва с чист price state`);
    }

    const goods=['Електроника','Дом и градина','Дрехи и обувки','Деца и бебета','Спорт и хоби','Друго'];
    for(const value of goods){setCategory(value);check(Boolean(doc.getElementById('price-free')),`${value}: „Подарява“ е налично само като вещ`);}

    setCategory('Услуги');
    check(typeField.hidden===true&&type.value==='Дава','връщане към Services скрива type и възстановява само Дава');
    check(!doc.getElementById('price-free')&&Boolean(doc.getElementById('price-on-request')),'връщане към Services възстановява Service price controls');
    check(price.value===''&&!price.disabled&&checkedCount(doc)===0,'връщане към Services остава с чист price state');

    summary.textContent=failed?`FAIL ${failed} / PASS ${passed}`:`PASS ${passed} / ${passed}`;
    summary.className=failed?'fail':'pass';
    document.title=failed?`FAIL — Stage 2 price-context browser QA`:`PASS — Stage 2 price-context browser QA`;
  }catch(error){
    record(false,'browser test изпълнение',error?.message||String(error));
    summary.textContent=`FAIL ${failed} / PASS ${passed}`;summary.className='fail';document.title='FAIL — Stage 2 price-context browser QA';
  }
})();
