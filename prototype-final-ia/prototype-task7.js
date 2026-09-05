'use strict';

(() => {
  const originalEditValue=window.editValue;
  const originalFormPage=window.formPage;
  const originalValidate=window.validatePrototypeForm;

  function cleanExampleValue(value=''){
    return String(value).replace(/^ПРОТОТИП\s*[—-]\s*/u,'');
  }

  if(typeof originalEditValue==='function'){
    window.editValue=(kind,label)=>cleanExampleValue(originalEditValue(kind,label));
  }

  if(typeof originalFormPage==='function'){
    window.formPage=(kind,query)=>originalFormPage(kind,query)
      .replaceAll('ПРОТОТИП — ','')
      .replace('Редакция на примерен запис.','Редактираш запис.')
      .replace('Това е прототип и не е създаден реален запис.','Формата е приключена и не може да бъде изпратена повторно.');
  }

  function byName(form,name){return form?.querySelector(`[name="${CSS.escape(name)}"]`)||null;}

  function setLimits(control,{minLength,maxLength}={}){
    if(!control) return;
    if(Number.isInteger(minLength)) control.minLength=minLength;
    if(Number.isInteger(maxLength)) control.maxLength=maxLength;
  }

  function applyFormParity(form){
    if(!form?.matches?.('[data-proto-form]')) return;
    const kind=form.dataset.formKind||'';

    if(kind==='listing'){
      setLimits(byName(form,'Заглавие'),{minLength:5,maxLength:120});
      setLimits(byName(form,'Описание'),{minLength:20,maxLength:5000});
    }
    if(kind==='firm'){
      setLimits(byName(form,'Име на фирмата'),{minLength:2,maxLength:120});
      setLimits(byName(form,'Описание'),{minLength:20,maxLength:5000});
      setLimits(byName(form,'Телефон'),{maxLength:24});
    }
    if(kind==='shop'){
      setLimits(byName(form,'Име на магазина'),{minLength:2,maxLength:120});
      setLimits(byName(form,'Адрес в Лом'),{minLength:3,maxLength:200});
      setLimits(byName(form,'Какво предлага'),{minLength:3,maxLength:500});
    }
    if(kind==='question'){
      setLimits(byName(form,'Заглавие на въпроса'),{minLength:10,maxLength:120});
      setLimits(byName(form,'Описание'),{minLength:20,maxLength:5000});
    }
  }

  function errorElement(control){
    const ids=(control?.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean);
    return ids.map(id=>document.getElementById(id)).find(el=>el?.classList.contains('field-error'))||null;
  }

  function setParityError(control,message=''){
    if(!control) return !message;
    if(message){
      control.setCustomValidity?.(message);
      control.setAttribute('aria-invalid','true');
      control.dataset.task7ParityError='true';
      control.dataset.task7ParityMessage=message;
      const error=errorElement(control);
      if(error) error.textContent=message;
      return false;
    }
    if(control.dataset.task7ParityError==='true'){
      const previous=control.dataset.task7ParityMessage||'';
      const current=control.validationMessage||'';
      const error=errorElement(control);
      if(!current||current===previous){
        control.setCustomValidity?.('');
        control.removeAttribute('aria-invalid');
      }
      if(error?.textContent===previous) error.textContent='';
      delete control.dataset.task7ParityError;
      delete control.dataset.task7ParityMessage;
    }
    return true;
  }

  function letters(value=''){
    return [...String(value)].filter(ch=>/\p{L}/u.test(ch));
  }

  function sensibleShortText(value,minLetters=2){
    const chars=letters(value);
    if(chars.length<minLetters) return false;
    return new Set(chars.map(ch=>ch.toLocaleLowerCase('bg-BG'))).size>=Math.min(3,minLetters);
  }

  function usefulText(value,minWords=2){
    const text=String(value||'').replace(/\s+/g,' ').trim();
    const words=text.match(/[\p{L}\p{N}]+/gu)||[];
    const alpha=letters(text).map(ch=>ch.toLocaleLowerCase('bg-BG'));
    if(words.length<minWords||new Set(alpha).size<3) return false;
    if(words.length===2&&words[0].toLocaleLowerCase('bg-BG')===words[1].toLocaleLowerCase('bg-BG')) return false;
    return true;
  }

  function obviousJunkText(value){
    const text=String(value||'').replace(/\s+/g,' ').trim();
    if(!text) return false;
    const compact=[...text.toLocaleLowerCase('bg-BG')].filter(ch=>/[\p{L}\p{N}]/u.test(ch));
    if(compact.length>=8&&new Set(compact).size<=2) return true;
    const words=text.toLocaleLowerCase('bg-BG').match(/[\p{L}\p{N}]+/gu)||[];
    return words.length>=2&&new Set(words).size===1;
  }

  function parityMessage(form,control){
    if(!form||!control) return '';
    const kind=form.dataset.formKind||'';
    const name=control.name||'';
    const value=String(control.value||'').trim();

    if(kind==='listing'&&name==='Описание'&&value){
      const words=value.match(/[\p{L}\p{N}]+/gu)||[];
      if(words.length<3) return 'Описанието трябва да съдържа поне 3 думи.';
    }

    if(kind==='firm'&&name==='Име на фирмата'&&value){
      if(!/\p{L}/u.test(value)) return 'Името трябва да съдържа поне една буква.';
      if(!/^[\p{L}\p{N}\s.,/&()'’+№-]+$/u.test(value)) return 'Използвай букви, цифри и обичайни знаци като тире, точка, / или &.';
      if(/([^\s])\1{7,}/iu.test(value)) return 'Името съдържа прекалено много еднакви знаци поред.';
    }

    if(kind==='shop'){
      if(name==='Име на магазина'&&value&&!sensibleShortText(value,2)) return 'Въведи разбираемо име на магазина.';
      if(name==='Адрес в Лом'&&value&&!sensibleShortText(value,2)) return 'Въведи разбираем адрес на магазина.';
      if(name==='Какво предлага'&&value&&!usefulText(value,2)) return 'Опиши с няколко думи какво реално предлага магазинът.';
    }

    if(kind==='health'){
      if(name==='Име на лекар / практика'&&value&&!sensibleShortText(value,2)) return 'Въведи разбираемо име на лекар или практика.';
      if(name==='Специалност / основна услуга'&&value&&!sensibleShortText(value,3)) return 'Въведи разбираема специалност или услуга.';
      if(name==='Адрес в Лом'&&value&&!sensibleShortText(value,3)) return 'Въведи разбираем адрес в Лом.';
      if(name==='Кратко описание'&&value&&!usefulText(value,2)) return 'Опиши с няколко думи полезната информация за практиката.';
    }

    if(kind==='question'&&(name==='Заглавие на въпроса'||name==='Описание')&&value&&obviousJunkText(value)){
      return `${name==='Заглавие на въпроса'?'Заглавието':'Описанието'} трябва да съдържа разбираем текст.`;
    }

    return '';
  }

  function validateParityForm(form,{focus=true}={}){
    applyFormParity(form);
    let firstInvalid=null;
    form.querySelectorAll('input,select,textarea').forEach(control=>{
      const message=parityMessage(form,control);
      if(message){
        setParityError(control,message);
        if(!firstInvalid) firstInvalid=control;
      }else{
        setParityError(control,'');
      }
    });
    if(firstInvalid&&focus){
      firstInvalid.focus({preventScroll:false});
      firstInvalid.scrollIntoView({block:'center',behavior:'smooth'});
    }
    return !firstInvalid;
  }

  if(typeof originalValidate==='function'){
    window.validatePrototypeForm=form=>{
      applyFormParity(form);
      const baseOk=originalValidate(form);
      const parityOk=validateParityForm(form,{focus:baseOk});
      return baseOk&&parityOk;
    };
  }

  function sanitizeRenderedCopy(){
    document.querySelectorAll('[data-proto-form]').forEach(form=>{
      applyFormParity(form);
      form.querySelectorAll('input[type="text"],textarea').forEach(control=>{
        const cleaned=cleanExampleValue(control.value);
        if(cleaned!==control.value) control.value=cleaned;
      });
    });

    document.querySelectorAll('.notice').forEach(note=>{
      note.innerHTML=note.innerHTML
        .replaceAll('ПРОТОТИП — ','')
        .replace('Редакция на примерен запис.','Редактираш запис.')
        .replace('Това е прототип и не е създаден реален запис.','Формата е приключена и не може да бъде изпратена повторно.');
    });
  }

  function sanitizeActionMessage(target){
    const contact=target?.closest?.('[data-demo-contact]');
    if(contact){
      queueMicrotask(()=>{
        const message=contact.parentElement?.querySelector('.contact-demo-message');
        if(message) message.textContent='Този пример не съдържа публикуван телефон или лични данни.';
      });
    }

    const share=target?.closest?.('[data-demo-share]');
    if(share){
      queueMicrotask(()=>{
        const message=share.closest('.share-drawer')?.querySelector('.share-demo-message');
        if(!message) return;
        const messages={
          native:'На телефон ще се отвори системното меню за споделяне.',
          facebook:'Facebook ще използва линка към тази страница.',
          copy:'Линкът към страницата е готов за копиране.'
        };
        message.textContent=messages[share.dataset.demoShare]||'Готово за споделяне.';
      });
    }

    const official=target?.closest?.('[data-demo-official]');
    if(official){
      queueMicrotask(()=>{
        const message=official.closest('.detail-action')?.querySelector('.action-demo-message');
        if(message) message.textContent='Официалният публичен източник ще се отвори от този бутон.';
      });
    }
  }

  document.addEventListener('focusout',event=>{
    const control=event.target.closest?.('[data-proto-form] input,[data-proto-form] textarea,[data-proto-form] select');
    if(!control) return;
    control.dataset.task7Touched='true';
    setParityError(control,parityMessage(control.closest('[data-proto-form]'),control));
  });

  document.addEventListener('input',event=>{
    const control=event.target.closest?.('[data-proto-form] input,[data-proto-form] textarea,[data-proto-form] select');
    if(!control||control.dataset.task7Touched!=='true') return;
    setParityError(control,parityMessage(control.closest('[data-proto-form]'),control));
  });

  document.addEventListener('change',event=>{
    const control=event.target.closest?.('[data-proto-form] select');
    if(!control||control.dataset.task7Touched!=='true') return;
    setParityError(control,parityMessage(control.closest('[data-proto-form]'),control));
  });

  document.addEventListener('click',event=>sanitizeActionMessage(event.target));
  document.addEventListener('submit',()=>queueMicrotask(sanitizeRenderedCopy));
  window.addEventListener('hashchange',()=>queueMicrotask(sanitizeRenderedCopy));

  sanitizeRenderedCopy();
})();
