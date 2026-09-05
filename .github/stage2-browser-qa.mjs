import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const base='http://127.0.0.1:8000/prototype-final-ia/index.html';
const chrome=process.env.CHROME_PATH;
if(!chrome) throw new Error('CHROME_PATH missing');
fs.mkdirSync('qa-artifacts',{recursive:true});
const browser=await puppeteer.launch({headless:true,executablePath:chrome,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage();
const results=[];
const failures=[];
function check(name,ok,detail=''){
  results.push({name,ok,detail});
  console.log(`${ok?'PASS':'FAIL'} ${name}${detail?` — ${detail}`:''}`);
  if(!ok) failures.push(name+(detail?`: ${detail}`:''));
}
async function viewport(width,height){await page.setViewport({width,height,deviceScaleFactor:1});}
async function go(hash){
  await page.goto(base+hash,{waitUntil:'networkidle0',timeout:30000});
  await new Promise(r=>setTimeout(r,120));
}
async function noOverflow(name){
  const data=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,innerWidth:window.innerWidth}));
  check(name,data.scrollWidth<=data.innerWidth+1,`${data.scrollWidth}/${data.innerWidth}`);
}
async function noTechNoise(name){
  const bad=await page.evaluate(()=>{
    const text=document.body.innerText;
    return ['ПРОТОТИПЕН ЗАПИС','ПРИМЕР — НЕ Е РЕАЛНО СЪДЪРЖАНИЕ','OPEN/LOCKED','canonical','discovery','persist','production owner','QA:'].filter(x=>text.toLowerCase().includes(x.toLowerCase()));
  });
  check(name,bad.length===0,bad.join(', '));
}

try{
  await viewport(1440,1000);
  await go('#home');
  const home=await page.evaluate(()=>({
    h1:document.querySelector('h1')?.textContent?.trim(),
    text:document.body.innerText,
    sections:[...document.querySelectorAll('h2')].map(x=>x.textContent.trim())
  }));
  check('desktop home H1',home.h1==='Намери каквото ти трябва в Лом',home.h1||'');
  for(const label of ['Обяви и услуги','Последни обяви и услуги','Инфо Лом','Местни фирми','Полезни статии','Не намери отговор? Попитай']) check(`desktop Home section: ${label}`,home.text.includes(label));
  check('desktop Home hides Aktualno without verified content',!home.text.includes('Актуално в Лом'));
  check('desktop Home contains verified pension article',home.text.includes('Пенсиониране в Лом — къде се обслужвате и какво трябва да знаете'));
  await noOverflow('desktop Home no horizontal overflow');
  await noTechNoise('desktop Home normal mode technical noise hidden');
  await page.screenshot({path:'qa-artifacts/desktop-home.png',fullPage:true});

  const opener=await page.$('.add-top');
  await opener.click();
  await page.waitForFunction(()=>!document.getElementById('add-layer')?.hidden);
  check('Add modal opens',await page.evaluate(()=>!document.getElementById('add-layer').hidden));
  check('Add modal receives focus',await page.evaluate(()=>document.getElementById('add-layer')?.contains(document.activeElement)));
  await page.keyboard.press('Escape');
  check('Add modal Escape closes',await page.evaluate(()=>document.getElementById('add-layer').hidden));
  check('Add modal returns focus to opener',await page.evaluate(()=>document.activeElement?.classList.contains('add-top')));

  await go('#obyavi');
  const hubText=await page.evaluate(()=>document.body.innerText);
  for(const label of ['Услуги','Купува и продава','Работа','Имоти','Автомобили','Здраве и частни лекари','Магазини','Заведения','Животни']) check(`hub entry ${label}`,hubText.includes(label));
  await noOverflow('desktop hub no horizontal overflow');

  await go('#uslugi');
  const serviceText=await page.evaluate(()=>document.body.innerText);
  for(const label of ['Майстори, ремонти и дом','Почистване и поддръжка','Автомобилни услуги','Транспорт, преместване и доставки','Красота и лична грижа','Грижа за хора и животни','Обучение, уроци и спорт','Техника, дигитални и професионални услуги','Събития и творчески услуги','Друга услуга']) check(`service family ${label}`,serviceText.includes(label));

  await go('#maistori');
  const mastersText=await page.evaluate(()=>document.body.innerText);
  check('Masters has two primary intents',mastersText.includes('Търся изпълнител')&&mastersText.includes('Предлагам услуга')&&!mastersText.includes('Намери майстор'));
  check('Masters active section visible',mastersText.includes('Активни предложения и търсения'));
  check('Masters firms section visible',mastersText.includes('Местни фирми и майстори'));
  await page.screenshot({path:'qa-artifacts/desktop-maistori.png',fullPage:true});

  await go('#results?context=%D0%A3%D1%81%D0%BB%D1%83%D0%B3%D0%B8&group=%D0%92%D0%B8%D0%9A&detail=listing&owner=Listings');
  const res=await page.evaluate(()=>({h1:document.querySelector('h1')?.textContent?.trim(),text:document.body.innerText,rows:document.querySelectorAll('.result-row').length}));
  check('Results H1',res.h1==='ВиК услуги в Лом',res.h1||'');
  check('Results distinct offer/seek actions',res.text.includes('Предлагам ВиК услуга')&&res.text.includes('Търся ВиК изпълнител'));
  check('Results no selected-context block',!res.text.includes('Избран контекст'));
  check('Results has filters/sort',res.text.includes('Филтри')&&res.text.includes('Сортиране'));

  await go('#add/listing?category=%D0%A3%D1%81%D0%BB%D1%83%D0%B3%D0%B8&subcategory=%D0%92%D0%B8%D0%9A&type=%D0%94%D0%B0%D0%B2%D0%B0');
  const addState=await page.evaluate(()=>({text:document.body.innerText,category:document.querySelector('#listing-category')?.value,sub:document.querySelector('#listing-subcategory')?.value,type:document.querySelector('#listing-type')?.value,discovery:document.querySelector('[data-proto-form]')?.dataset.discoveryContext||''}));
  check('Service Add context',addState.text.includes('Услуги → ВиК')&&addState.text.includes('Смени услугата'));
  check('Service Add persisted UI mapping',addState.category==='Услуги'&&addState.sub==='ВиК'&&addState.type==='Дава');
  await page.select('#listing-category','Работа');
  await new Promise(r=>setTimeout(r,80));
  const changed=await page.evaluate(()=>({sub:document.querySelector('#listing-subcategory')?.value,disabled:document.querySelector('#listing-subcategory')?.disabled,discovery:document.querySelector('[data-proto-form]')?.dataset.discoveryContext||'',contextHidden:document.querySelector('.service-context-summary')?.hidden}));
  check('Category change clears old service context',changed.sub===''&&changed.disabled===true&&changed.discovery===''&&changed.contextHidden===true,JSON.stringify(changed));

  await go('#add/listing?category=%D0%A3%D1%81%D0%BB%D1%83%D0%B3%D0%B8&subcategory=%D0%92%D0%B8%D0%9A&type=%D0%94%D0%B0%D0%B2%D0%B0');
  await page.click('[data-proto-form] button[type="submit"]');
  await new Promise(r=>setTimeout(r,60));
  check('Empty form submit blocked',await page.evaluate(()=>!document.querySelector('[data-success-card]')));
  check('Validation focuses first invalid field',await page.evaluate(()=>document.activeElement?.matches?.('[data-proto-form] input,[data-proto-form] select,[data-proto-form] textarea')));

  await go('#detail/listing?record=listing-vik');
  await page.waitForSelector('[data-open-share]');
  await page.click('[data-open-share]');
  check('Share drawer opens',await page.evaluate(()=>!document.querySelector('[data-share-overlay]')?.hidden));
  check('Social Preview only inside opened Share',await page.evaluate(()=>!!document.querySelector('[data-share-overlay]:not([hidden]) .social-card-preview')));
  await page.screenshot({path:'qa-artifacts/desktop-detail-share.png',fullPage:false});
  await page.keyboard.press('Escape');
  check('Share Escape closes',await page.evaluate(()=>document.querySelector('[data-share-overlay]')?.hidden===true));
  check('Share returns focus',await page.evaluate(()=>document.activeElement?.matches?.('[data-open-share]')));

  await page.waitForSelector('[data-favorite-toggle]');
  await page.click('[data-favorite-toggle]');
  await page.waitForSelector('.favorite-login-note');
  check('Logged-out favorite asks for login',await page.evaluate(()=>document.querySelector('.favorite-login-note')?.innerText.includes('Влез')));
  await go('#profile');
  await page.click('[data-favorite-demo-login]');
  check('Prototype login switches profile state',await page.evaluate(()=>!!document.querySelector('[data-favorite-demo-logout]')));
  await go('#detail/listing?record=listing-vik');
  await page.waitForSelector('[data-favorite-toggle]');
  await page.click('[data-favorite-toggle]');
  await go('#profile');
  check('Saved item appears in profile',await page.evaluate(()=>document.body.innerText.includes('Запазени')&&!document.body.innerText.includes('Нямаш запазени записи')));

  await go('#statii');
  check('Articles include pension guide',await page.evaluate(()=>document.body.innerText.includes('Пенсиониране в Лом — къде се обслужвате и какво трябва да знаете')));
  await go('#detail/article?record=article-pension');
  await page.click('[data-pension-helpful]');
  check('Article Helpful toggles',await page.evaluate(()=>document.querySelector('[data-pension-helpful]')?.getAttribute('aria-pressed')==='true'));
  await page.click('[data-pension-comments]');
  check('Article Comments action focuses comment field',await page.evaluate(()=>document.activeElement?.id==='pension-comment'));
  await page.click('[data-open-share]');
  check('Article Share opens',await page.evaluate(()=>!document.querySelector('[data-share-overlay]')?.hidden));
  await page.keyboard.press('Escape');

  await go('#aktualno');
  const currentText=await page.evaluate(()=>document.body.innerText);
  check('Aktualno honest empty state',currentText.includes('Няма актуално съдържание за показване'));
  check('Aktualno has no fake publication/event',!currentText.includes('12 септември')&&!currentText.includes('Местна актуализация с конкретна цел'));

  await viewport(390,844);
  for(const [name,hash] of [
    ['Home','#home'],['Hub','#obyavi'],['Services','#uslugi'],['Masters','#maistori'],
    ['Results','#results?context=%D0%A3%D1%81%D0%BB%D1%83%D0%B3%D0%B8&group=%D0%92%D0%B8%D0%9A&detail=listing&owner=Listings'],
    ['Add','#add/listing?category=%D0%A3%D1%81%D0%B3%D0%B8&subcategory=%D0%92%D0%B8%D0%9A&type=%D0%94%D0%B0%D0%B2%D0%B0'],
    ['Detail','#detail/listing?record=listing-vik'],['Pension','#detail/article?record=article-pension']
  ]){
    await go(hash);
    await noOverflow(`390px ${name} no horizontal overflow`);
    check(`390px ${name} bottom nav visible`,await page.evaluate(()=>getComputedStyle(document.querySelector('.mobile-bottom')).display!=='none'));
  }
  await go('#home');
  await page.screenshot({path:'qa-artifacts/mobile-390-home.png',fullPage:true});
  await go('#maistori');
  await page.screenshot({path:'qa-artifacts/mobile-390-maistori.png',fullPage:true});
  await go('#detail/article?record=article-pension');
  await page.screenshot({path:'qa-artifacts/mobile-390-pension.png',fullPage:true});
} finally {
  await browser.close();
}
fs.writeFileSync('qa-artifacts/report.json',JSON.stringify({results,failures},null,2));
if(failures.length){
  console.error(`BROWSER_QA_FAIL ${failures.length}`);
  process.exit(1);
}
console.log(`BROWSER_QA_PASS ${results.length}`);
