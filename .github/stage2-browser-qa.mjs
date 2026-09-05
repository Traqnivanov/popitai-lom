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
const dialogs=[];
page.on('dialog',async dialog=>{
  dialogs.push({type:dialog.type(),message:dialog.message()});
  await dialog.accept();
});
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
    const text=document.body.innerText.toLowerCase();
    const needles=['прототипен запис','пример — не е реално съдържание','open/locked','canonical','discovery','persist','production owner','qa:'];
    return needles.filter(x=>text.includes(x));
  });
  check(name,bad.length===0,bad.join(', '));
}
async function text(){return page.evaluate(()=>document.body.innerText);}

try{
  await viewport(1440,1000);
  await go('#home');
  const homeH1=await page.$eval('h1',el=>el.textContent.trim());
  const homeText=await text();
  check('desktop Home H1',homeH1==='Намери каквото ти трябва в Лом',homeH1);
  for(const label of ['Обяви и услуги','Последни обяви и услуги','Инфо Лом','Местни фирми','Полезни статии','Не намери отговор? Попитай']) check(`desktop Home section ${label}`,homeText.includes(label));
  check('desktop Home hides Aktualno without verified content',!homeText.includes('Актуално в Лом'));
  check('desktop Home shows pension guide',homeText.includes('Пенсиониране в Лом — къде се обслужвате и какво трябва да знаете'));
  await noOverflow('desktop Home no horizontal overflow');
  await noTechNoise('desktop Home hides technical noise');
  await page.screenshot({path:'qa-artifacts/desktop-home.png',fullPage:true});

  await page.click('.add-top');
  await page.waitForFunction(()=>!document.getElementById('add-layer')?.hidden);
  check('Add modal opens',await page.evaluate(()=>!document.getElementById('add-layer').hidden));
  check('Add modal focus enters dialog',await page.evaluate(()=>document.getElementById('add-layer')?.contains(document.activeElement)));
  await page.keyboard.press('Escape');
  check('Add modal Escape closes',await page.evaluate(()=>document.getElementById('add-layer').hidden));
  check('Add modal focus returns',await page.evaluate(()=>document.activeElement?.classList.contains('add-top')));

  await go('#obyavi');
  const hubText=await text();
  for(const label of ['Услуги','Купува и продава','Работа','Имоти','Автомобили','Здраве и частни лекари','Магазини','Заведения','Животни']) check(`hub entry ${label}`,hubText.includes(label));
  await noOverflow('desktop Hub no horizontal overflow');

  await go('#uslugi');
  const serviceText=await text();
  for(const label of ['Майстори, ремонти и дом','Почистване и поддръжка','Автомобилни услуги','Транспорт, преместване и доставки','Красота и лична грижа','Грижа за хора и животни','Обучение, уроци и спорт','Техника, дигитални и професионални услуги','Събития и творчески услуги','Друга услуга']) check(`service family ${label}`,serviceText.includes(label));

  await go('#maistori');
  const mastersText=await text();
  check('Masters only two main intents',mastersText.includes('Търся изпълнител')&&mastersText.includes('Предлагам услуга')&&!mastersText.includes('Намери майстор'));
  check('Masters active section visible',mastersText.includes('Активни предложения и търсения'));
  check('Masters firms section visible',mastersText.includes('Местни фирми и майстори'));
  await page.screenshot({path:'qa-artifacts/desktop-maistori.png',fullPage:true});

  await go('#results?context=%D0%A3%D1%81%D0%BB%D1%83%D0%B3%D0%B8&group=%D0%92%D0%B8%D0%9A&detail=listing&owner=Listings');
  const resultsText=await text();
  const resultsH1=await page.$eval('h1',el=>el.textContent.trim());
  check('Results H1',resultsH1==='ВиК услуги в Лом',resultsH1);
  check('Results offer/seek actions',resultsText.includes('Предлагам ВиК услуга')&&resultsText.includes('Търся ВиК изпълнител'));
  check('Results no selected context block',!resultsText.includes('Избран контекст'));
  check('Results filters and sort',resultsText.includes('Филтри')&&resultsText.includes('Сортиране'));

  await go('#add/listing?category=%D0%A3%D1%81%D0%BB%D1%83%D0%B3%D0%B8&subcategory=%D0%92%D0%B8%D0%9A&type=%D0%94%D0%B0%D0%B2%D0%B0');
  const addState=await page.evaluate(()=>({
    text:document.body.innerText,
    category:document.querySelector('#listing-category')?.value,
    sub:document.querySelector('#listing-subcategory')?.value,
    type:document.querySelector('#listing-type')?.value
  }));
  check('Service Add context once',addState.text.includes('Услуги → ВиК')&&addState.text.includes('Смени услугата'));
  check('Service Add persisted mapping',addState.category==='Услуги'&&addState.sub==='ВиК'&&addState.type==='Дава',JSON.stringify(addState));
  await page.select('#listing-category','Работа');
  await new Promise(r=>setTimeout(r,80));
  const changed=await page.evaluate(()=>({
    sub:document.querySelector('#listing-subcategory')?.value,
    disabled:document.querySelector('#listing-subcategory')?.disabled,
    discovery:document.querySelector('[data-proto-form]')?.dataset.discoveryContext||'',
    contextHidden:document.querySelector('.service-context-summary')?.hidden,
    dirty:document.querySelector('[data-proto-form]')?.dataset.dirty
  }));
  check('Category change clears old service context',changed.sub===''&&changed.disabled===true&&changed.discovery===''&&changed.contextHidden===true,JSON.stringify(changed));
  check('Category change marks dirty',changed.dirty==='true',changed.dirty||'');

  const dialogCount=dialogs.length;
  await page.evaluate(()=>{location.hash='#home';});
  await new Promise(r=>setTimeout(r,150));
  check('Dirty hash navigation asks confirmation',dialogs.length>dialogCount,JSON.stringify(dialogs.slice(dialogCount)));
  check('Accepted dirty navigation reaches Home',await page.evaluate(()=>location.hash==='#home'),await page.evaluate(()=>location.hash));

  await go('#add/listing?category=%D0%A3%D1%81%D0%BB%D1%83%D0%B3%D0%B8&subcategory=%D0%92%D0%B8%D0%9A&type=%D0%94%D0%B0%D0%B2%D0%B0');
  await page.click('[data-proto-form] button[type="submit"]');
  await new Promise(r=>setTimeout(r,80));
  check('Empty form submit blocked',await page.evaluate(()=>!document.querySelector('[data-success-card]')));
  check('Validation focuses first invalid field',await page.evaluate(()=>document.activeElement?.matches?.('[data-proto-form] input,[data-proto-form] select,[data-proto-form] textarea')));
  await page.evaluate(()=>{const f=document.querySelector('[data-proto-form]');if(f)f.dataset.dirty='false';});

  await go('#detail/listing?record=listing-vik');
  await page.waitForSelector('[data-open-share]');
  await page.click('[data-open-share]');
  const shareOpen=await page.evaluate(()=>!document.querySelector('[data-share-overlay]')?.hidden);
  const socialInside=await page.evaluate(()=>Boolean(document.querySelector('[data-share-overlay]:not([hidden]) .social-card-preview')));
  check('Detail Share opens',shareOpen);
  check('Social Preview is inside opened Share',socialInside);
  await page.screenshot({path:'qa-artifacts/desktop-detail-share.png',fullPage:false});
  await page.keyboard.press('Escape');
  check('Detail Share Escape closes',await page.evaluate(()=>document.querySelector('[data-share-overlay]')?.hidden===true));
  check('Detail Share returns focus',await page.evaluate(()=>document.activeElement?.matches?.('[data-open-share]')));

  await page.waitForSelector('[data-favorite-toggle]');
  await page.click('[data-favorite-toggle]');
  await page.waitForSelector('.favorite-login-note');
  check('Logged-out Favorite asks login',await page.evaluate(()=>document.querySelector('.favorite-login-note')?.innerText.includes('Влез')));
  await go('#profile');
  await page.waitForSelector('[data-favorite-demo-login]');
  await page.click('[data-favorite-demo-login]');
  check('Prototype login switches state',await page.evaluate(()=>Boolean(document.querySelector('[data-favorite-demo-logout]'))));
  await go('#detail/listing?record=listing-vik');
  await page.waitForSelector('[data-favorite-toggle]');
  await page.click('[data-favorite-toggle]');
  await go('#profile');
  check('Saved item appears in Profile',await page.evaluate(()=>document.body.innerText.includes('Запазени')&&!document.body.innerText.includes('Нямаш запазени записи')));

  await go('#statii');
  check('Articles include pension guide',await page.evaluate(()=>document.body.innerText.includes('Пенсиониране в Лом — къде се обслужвате и какво трябва да знаете')));
  await go('#detail/article?record=article-pension');
  await page.click('[data-pension-helpful]');
  check('Article Helpful toggles',await page.evaluate(()=>document.querySelector('[data-pension-helpful]')?.getAttribute('aria-pressed')==='true'));
  await page.click('[data-pension-comments]');
  check('Article Comments focuses field',await page.evaluate(()=>document.activeElement?.id==='pension-comment'));
  await page.click('[data-open-share]');
  check('Article Share opens',await page.evaluate(()=>!document.querySelector('[data-share-overlay]')?.hidden));
  await page.keyboard.press('Escape');

  await go('#aktualno');
  const aktualnoText=await text();
  check('Aktualno honest empty state',aktualnoText.includes('Няма актуално съдържание за показване'));
  check('Aktualno no fake publication/event',!aktualnoText.includes('12 септември')&&!aktualnoText.includes('Местна актуализация с конкретна цел'));

  await viewport(390,844);
  const mobileRoutes=[
    ['Home','#home'],
    ['Hub','#obyavi'],
    ['Services','#uslugi'],
    ['Masters','#maistori'],
    ['Results','#results?context=%D0%A3%D1%81%D0%BB%D1%83%D0%B3%D0%B8&group=%D0%92%D0%B8%D0%9A&detail=listing&owner=Listings'],
    ['Add','#add/listing?category=%D0%A3%D1%81%D0%BB%D1%83%D0%B3%D0%B8&subcategory=%D0%92%D0%B8%D0%9A&type=%D0%94%D0%B0%D0%B2%D0%B0'],
    ['Detail','#detail/listing?record=listing-vik'],
    ['Pension','#detail/article?record=article-pension']
  ];
  for(const [name,hash] of mobileRoutes){
    await go(hash);
    await noOverflow(`390px ${name} no horizontal overflow`);
    const navVisible=await page.evaluate(()=>getComputedStyle(document.querySelector('.mobile-bottom')).display!=='none');
    check(`390px ${name} bottom nav visible`,navVisible);
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

fs.writeFileSync('qa-artifacts/report.json',JSON.stringify({results,failures,dialogs},null,2));
if(failures.length){
  console.error(`BROWSER_QA_FAIL ${failures.length}`);
  process.exit(1);
}
console.log(`BROWSER_QA_PASS ${results.length}`);
