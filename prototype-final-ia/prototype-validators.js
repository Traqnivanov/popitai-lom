'use strict';

(() => {
  function errorElement(control){
    const ids=(control?.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean);
    return ids.map(id=>document.getElementById(id)).find(el=>el?.classList.contains('field-error'))||null;
  }
  function setError(control,message=''){
    if(!control) return;
    control.setCustomValidity?.(message);
    if(message) control.setAttribute('aria-invalid','true'); else control.removeAttribute('aria-invalid');
    const error=errorElement(control); if(error) error.textContent=message;
  }
  function labelText(control){
    const id=control?.id;
    const label=id?document.querySelector(`label[for="${CSS.escape(id)}"]`):null;
    return label?.textContent?.trim()||control?.name||'полето';
  }
  function phoneMessage(value){
    const normalized=String(value||'').trim();
    if(!normalized) return '';
    if(/\p{L}/u.test(normalized)) return 'Телефонът не може да съдържа букви.';
    if(!/^[+\d\s().-]+$/.test(normalized)) return 'Използвай само цифри, интервали, +, тирета или скоби.';
    if((normalized.match(/\+/g)||[]).length>1||(normalized.includes('+')&&!normalized.startsWith('+'))) return 'Знакът + може да бъде само веднъж и в началото.';
    const digits=normalized.replace(/\D/g,'');
    if(/^(\d)\1+$/.test(digits)) return 'Въведи реален телефонен номер.';
    if(normalized.startsWith('+')){
      if(!normalized.startsWith('+359')) return 'Международният български номер трябва да започва с +359.';
      if(![11,12].includes(digits.length)) return 'След +359 трябва да има 8 или 9 цифри.';
      if(digits.charAt(3)==='0') return 'След +359 не се изписва началната нула.';
      return '';
    }
    if(!digits.startsWith('0')) return 'Българският номер трябва да започва с 0 или +359.';
    if(![9,10].includes(digits.length)) return 'Телефонът трябва да съдържа общо 9 или 10 цифри.';
    return '';
  }
  function baseMessage(control){
    if(!control||control.disabled||control.type==='file') return '';
    const raw=control.type==='checkbox'?(control.checked?'1':''):String(control.value||'');
    const value=raw.trim();
    if(control.required&&!value) return control.type==='checkbox'?'Потвърди, че приемаш правилата.':`Попълни „${labelText(control)}“.`;
    if(value&&control.minLength>0&&value.length<control.minLength) return `„${labelText(control)}“ трябва да е поне ${control.minLength} знака.`;
    if(value&&control.maxLength>0&&value.length>control.maxLength) return `„${labelText(control)}“ може да е най-много ${control.maxLength} знака.`;
    if(value&&control.type==='number'){
      const n=Number(value); if(!Number.isFinite(n)) return 'Въведи валидно число.';
      if(control.min!==''&&n<Number(control.min)) return `Стойността не може да е под ${control.min}.`;
      if(control.max!==''&&n>Number(control.max)) return `Стойността не може да е над ${control.max}.`;
    }
    if(value&&control.type==='tel') return phoneMessage(value);
    return '';
  }
  function letters(value=''){return [...String(value)].filter(ch=>/\p{L}/u.test(ch));}
  function sensibleShortText(value,minLetters=2){const chars=letters(value);return chars.length>=minLetters&&new Set(chars.map(ch=>ch.toLocaleLowerCase('bg-BG'))).size>=Math.min(3,minLetters);}
  function usefulText(value,minWords=2){const text=String(value||'').replace(/\s+/g,' ').trim();const words=text.match(/[\p{L}\p{N}]+/gu)||[];const alpha=letters(text).map(ch=>ch.toLocaleLowerCase('bg-BG'));return words.length>=minWords&&new Set(alpha).size>=3&&!(words.length===2&&words[0].toLocaleLowerCase('bg-BG')===words[1].toLocaleLowerCase('bg-BG'));}
  function obviousJunkText(value){const text=String(value||'').replace(/\s+/g,' ').trim();if(!text)return false;const compact=[...text.toLocaleLowerCase('bg-BG')].filter(ch=>/[\p{L}\p{N}]/u.test(ch));if(compact.length>=8&&new Set(compact).size<=2)return true;const words=text.toLocaleLowerCase('bg-BG').match(/[\p{L}\p{N}]+/gu)||[];return words.length>=2&&new Set(words).size===1;}
  function byName(form,name){return form?.querySelector(`[name="${CSS.escape(name)}"]`)||null;}

  const validatorsByOwner=Object.freeze({
    listing(form,control){
      const name=control.name||'', value=String(control.value||'').trim();
      if(name==='Описание'&&value&&(value.match(/[\p{L}\p{N}]+/gu)||[]).length<3) return 'Описанието трябва да съдържа поне 3 думи.';
      if(name==='Тип обява'&&form.dataset.formMode!=='edit'&&form.querySelector('#listing-category')?.value==='Услуги'&&value!=='Дава') return 'Новите услуги се публикуват само като „Предлагам услуга“.';
      return '';
    },
    firm(form,control){
      const name=control.name||'', value=String(control.value||'').trim();
      if(name==='Име на фирмата'&&value){
        if(!/\p{L}/u.test(value)) return 'Името трябва да съдържа поне една буква.';
        if(!/^[\p{L}\p{N}\s.,/&()'’+№-]+$/u.test(value)) return 'Използвай букви, цифри и обичайни знаци като тире, точка, / или &.';
        if(/([^\s])\1{7,}/iu.test(value)) return 'Името съдържа прекалено много еднакви знаци поред.';
      }
      return '';
    },
    shop(form,control){
      const name=control.name||'', value=String(control.value||'').trim();
      if(name==='Име на магазина'&&value&&!sensibleShortText(value,2)) return 'Въведи разбираемо име на магазина.';
      if(name==='Адрес в Лом'&&value&&!sensibleShortText(value,2)) return 'Въведи разбираем адрес на магазина.';
      if(name==='Какво предлага'&&value&&!usefulText(value,2)) return 'Опиши с няколко думи какво реално предлага магазинът.';
      return '';
    },
    health(form,control){
      const name=control.name||'', value=String(control.value||'').trim();
      if(name==='Име на лекар / практика'&&value&&!sensibleShortText(value,2)) return 'Въведи разбираемо име на лекар или практика.';
      if(name==='Специалност / основна услуга'&&value&&!sensibleShortText(value,3)) return 'Въведи разбираема специалност или услуга.';
      if(name==='Адрес в Лом'&&value&&!sensibleShortText(value,3)) return 'Въведи разбираем адрес в Лом.';
      if(name==='Кратко описание'&&value&&!usefulText(value,2)) return 'Опиши с няколко думи полезната информация за практиката.';
      return '';
    },
    question(form,control){
      const name=control.name||'', value=String(control.value||'').trim();
      if((name==='Заглавие на въпроса'||name==='Описание')&&value&&obviousJunkText(value)) return `${name==='Заглавие на въпроса'?'Заглавието':'Описанието'} трябва да съдържа разбираем текст.`;
      return '';
    }
  });

  function ownerMessage(form,control){return validatorsByOwner[form?.dataset.formKind]?.(form,control)||'';}
  function validateHealthPair(form,force=false){
    if(form?.dataset.formKind!=='health') return null;
    const phone=form.querySelector('#health-phone'), address=form.querySelector('#health-address');
    if(!phone||!address) return null;
    const missing=!phone.value.trim()&&!address.value.trim();
    if(missing&&force){const msg='Въведи поне телефон или адрес.';setError(phone,msg);setError(address,msg);return phone;}
    if(!missing){if(errorElement(phone)?.textContent==='Въведи поне телефон или адрес.')setError(phone,'');if(errorElement(address)?.textContent==='Въведи поне телефон или адрес.')setError(address,'');}
    return null;
  }
  const workAmountNeedsPeriod='Избери период за въведеното възнаграждение.';
  const workPeriodNeedsAmount='Въведи сума за избрания период или избери „По договаряне“.';
  function clearWorkPairError(control,message){if(errorElement(control)?.textContent===message)setError(control,'');}
  function validateWorkCompensation(form){
    if(form?.dataset.formKind!=='listing'||form.querySelector('#listing-category')?.value!=='Работа') return null;
    const price=form.querySelector('#listing-price'),period=form.querySelector('#work-compensation-period'),negotiable=form.querySelector('#price-negotiable');
    if(!price||!period)return null;
    const amount=price.value.trim(),unit=period.value,legacy=form.dataset.formMode==='edit'&&form.dataset.workPeriodLegacy==='true';
    if(negotiable?.checked){clearWorkPairError(price,workPeriodNeedsAmount);clearWorkPairError(period,workAmountNeedsPeriod);return null;}
    if(amount&&!unit&&!legacy){setError(period,workAmountNeedsPeriod);clearWorkPairError(price,workPeriodNeedsAmount);return period;}
    if(!amount&&unit){setError(price,workPeriodNeedsAmount);clearWorkPairError(period,workAmountNeedsPeriod);return price;}
    clearWorkPairError(price,workPeriodNeedsAmount);clearWorkPairError(period,workAmountNeedsPeriod);return null;
  }
  function validatePrice(form){
    if(form?.dataset.formKind!=='listing') return null;
    const price=form.querySelector('#listing-price'), negotiable=form.querySelector('#price-negotiable'), free=form.querySelector('#price-free'), onRequest=form.querySelector('#price-on-request'), error=document.getElementById('price-state-error');
    let message='';
    if(free?.checked&&negotiable?.checked) message='„Подарява“ и „По договаряне“ не могат да са активни едновременно.';
    else if(onRequest?.checked&&negotiable?.checked) message='„Цена след оглед/запитване“ и „По договаряне“ не могат да са активни едновременно.';
    else if(free?.checked&&onRequest?.checked) message='Избери само едно условие за цена.';
    else if(free?.checked&&price?.value.trim()) message='При „Подарява“ цената трябва да е празна.';
    else if(onRequest?.checked&&price?.value.trim()) message='При „Цена след оглед/запитване“ цената трябва да е празна.';
    if(error) error.textContent=message;
    return message?(free||onRequest||negotiable):null;
  }
  function validateControl(form,control){
    const message=baseMessage(control)||ownerMessage(form,control);
    setError(control,message); return message;
  }
  function validateForm(form,{uploadValidator=null}={}){
    let first=null;
    form.querySelectorAll('input,select,textarea').forEach(control=>{const message=validateControl(form,control);if(message&&!first)first=control;});
    first=first||validateHealthPair(form,true)||validateWorkCompensation(form)||validatePrice(form)||(uploadValidator?.(form)||null);
    const msg=form.querySelector('.form-message');
    if(first){if(msg)msg.innerHTML='<div class="notice danger"><strong>Провери отбелязаните полета.</strong> Въведеното остава във формата.</div>';first.focus?.({preventScroll:false});first.scrollIntoView?.({block:'center',behavior:'smooth'});return false;}
    if(msg)msg.textContent=''; return true;
  }
  function legacyServiceEditAllowed({category,type,mode}){return mode==='edit'&&category==='Услуги'&&type==='Търси';}

  window.PopitaiValidators=Object.freeze({validatorsByOwner,validateForm,validateControl,setError,errorElement,phoneMessage,validateHealthPair,validateWorkCompensation,legacyServiceEditAllowed});
})();
