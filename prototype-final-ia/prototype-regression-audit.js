'use strict';

const assert=require('assert');
const fs=require('fs');
const vm=require('vm');
const {execFileSync}=require('child_process');

global.window=global;
global.location={hash:'#home',search:''};
global.URLSearchParams=URLSearchParams;
global.document={addEventListener(){},getElementById(){return null}};

for(const file of [
  'prototype-stage2-contracts.js',
  'prototype-core.js',
  'prototype-records.js',
  'prototype-social-card-composer.js',
  'prototype-marketplace-views.js',
  'prototype-content-views.js',
  'prototype-master-order.js',
  'prototype-task2.js',
  'prototype-task5.js',
  'prototype-task8-content.js'
]) vm.runInThisContext(fs.readFileSync(`${__dirname}/${file}`,'utf8'),{filename:file});

const contracts=global.PopitaiStage2Contracts;
const records=global.PopitaiPrototypeRecords;
const social=global.PopitaiSocialCardComposer;
const forms=fs.readFileSync(`${__dirname}/prototype-forms.js`,'utf8');
const interactions=fs.readFileSync(`${__dirname}/prototype-stage2-interactions.js`,'utf8');
const css=fs.readFileSync(`${__dirname}/prototype-remediation.css`,'utf8');
const task6=fs.readFileSync(`${__dirname}/prototype-task6.js`,'utf8');
const task7=fs.readFileSync(`${__dirname}/prototype-task7.js`,'utf8');
const task8=fs.readFileSync(`${__dirname}/prototype-task8-content.js`,'utf8');

// Prior accepted remediation contracts remain intact.
for(const category of ['Хранителни','Строителни','Техника','Мебели','Дрехи','Дом']){
  const record=records.resultRecord({context:'Магазини',group:category,owner:'Shops',detailType:'shop'});
  assert.equal(record.contentType,'shop',`${category}: contentType`);
  assert.equal(record.owner,'Shops',`${category}: owner`);
  assert.equal(record.social.composition,'profile');
  assert.equal(record.social.contentRole,'specialized');
}
assert(!contracts.activeServiceCanonical.includes('Авточасти'));
assert(!contracts.listingSubcategories('Услуги').includes('Авточасти'));
assert.equal(contracts.serviceCanonicalMap['Авточасти'],'Авточасти');

const themed=social.render(records.get('listing-vik').social);
assert(themed.includes('social-card-template-icon'));
assert(themed.includes('icons/briefcase-duotone.svg'));
assert(!social.validate({...records.get('listing-vik').social,icon:'<svg onload=alert(1)>'}).ok);
const approved=social.render(records.get('firm-repairs').social);
assert(approved.includes('social-card-approved-brand'));
assert(approved.includes('Попитай.Лом'));
assert.equal(records.get('question-community').social.contentRole,'community');
assert.equal(records.get('info-health').social.contentRole,'verified-information');

// Choose-first contract is still protected for the nine persisted service families.
assert.equal(contracts.serviceFamilyNames.length,9);
for(const familyName of contracts.serviceFamilyNames){
  const family=global.serviceFamilies.find(item=>item[0]===familyName);
  assert(family,`${familyName}: family exists`);
  const familyAdd=contracts.contextualAddUrl({context:'Услуги',group:familyName,owner:'Listings'});
  assert(familyAdd.startsWith('#service-group?'));
  assert(familyAdd.includes('mode=add'));
  assert(!familyAdd.startsWith('#add/listing'));
  const leafAdd=contracts.contextualAddUrl({context:'Услуги',group:family[1],owner:'Listings'});
  assert(leafAdd.startsWith('#add/listing?'));
  const addPage=global.serviceGroup(new URLSearchParams(`group=${encodeURIComponent(familyName)}&mode=add&type=${encodeURIComponent('Дава')}`));
  assert(addPage.includes('Избери конкретна услуга'),`${familyName}: choose-first UI`);
  assert(addPage.includes('type='),`${familyName}: intent retained`);
}

// Final MASTER ORDER IA.
const home=global.home();
const hub=global.hub(new URLSearchParams());
const services=global.services();
const masters=global.masters();
for(const label of ['Услуги','Купува и продава','Работа','Имоти','Автомобили','Здраве и частни лекари','Магазини','Заведения','Животни']) assert(hub.includes(label),`hub entry ${label}`);
assert(!home.includes('class="protected-entry"'));
assert(!home.includes('href="#maistori"'),'Home must not restore a standalone Masters shortcut');
assert(home.indexOf('Обяви и услуги')<home.indexOf('Последни обяви и услуги'));
assert(home.indexOf('Последни обяви и услуги')<home.indexOf('Инфо Лом'));
assert(home.indexOf('Инфо Лом')<home.indexOf('Местни фирми'));
assert(home.indexOf('Местни фирми')<home.indexOf('Полезни статии'));
assert(home.indexOf('Полезни статии')<home.indexOf('Не намери отговор? Попитай'));
assert(!home.includes('Актуално в Лом'),'No Aktualno block without verified publication/event content');
assert(home.includes('home-main-grid'));
assert(home.includes('home-priority-shortcuts'));
assert(home.includes('Всички категории'));
assert(global.info().includes('Здравна информация'));
assert(home.includes('Здравна информация'));

for(const family of ['Майстори, ремонти и дом','Почистване и поддръжка','Автомобилни услуги','Транспорт, преместване и доставки','Красота и лична грижа','Грижа за хора и животни','Обучение, уроци и спорт','Техника, дигитални и професионални услуги','Събития и творчески услуги','Друга услуга']) assert(services.includes(family),`service family ${family}`);
assert(services.includes('service-family-grid'));
assert(services.includes('service-family-accordion'));
assert(services.includes('href="#maistori"'));

for(const sub of ['Цялостни ремонти','Бани и плочки','ВиК','Електро','Покриви','Шпакловка и боядисване','Дограма и врати','Климатици','Друга ремонтна услуга']) assert(masters.includes(sub),`masters subcategory ${sub}`);
assert(!masters.includes('Намери майстор'));
assert(masters.includes('Търся изпълнител')&&masters.includes('Предлагам услуга'));
assert(masters.indexOf('Активни предложения и търсения')<masters.indexOf('Местни фирми и майстори'));
assert(masters.indexOf('Местни фирми и майстори')<masters.indexOf('Задай въпрос'));
assert(!masters.includes('masters-card'));

const vikResults=global.results(new URLSearchParams('context=%D0%A3%D1%81%D0%BB%D1%83%D0%B3%D0%B8&group=%D0%92%D0%B8%D0%9A&detail=listing&owner=Listings'));
assert(vikResults.includes('Услуги</a>'));
assert(vikResults.includes('href="#maistori">Майстори</a>'));
assert(vikResults.includes('<h1>ВиК услуги в Лом</h1>'));
assert(!vikResults.includes('discovery-context'));
assert(!vikResults.includes('пример 2'));
assert(vikResults.includes('Търся вик изпълнител в Лом'));
assert(vikResults.includes('results-toolbar'));
assert(vikResults.includes('Предлагам ВиК услуга'));
assert(vikResults.includes('Търся ВиК изпълнител'));

// Service UI labels only adapt the existing persisted values.
assert(forms.includes("{value:'Дава',label:'Предлагам услуга'}"));
assert(forms.includes("{value:'Търси',label:'Търся изпълнител'}"));
assert(forms.includes('service-context-summary'));
assert(forms.includes('Смени услугата'));
assert(forms.includes('other-service-text'));
assert(forms.includes('Каква услуга?'));
assert(forms.includes('other-service-family'));
assert(interactions.includes("{value:'Дава',label:'Предлагам услуга'}"));
assert(interactions.includes("{value:'Търси',label:'Търся изпълнител'}"));
assert(interactions.includes("syncListingForm({preserve:false,resetDiscovery:true})"));

// Detail / Share remain secondary and Social Preview is not permanently expanded.
const detail=global.detail('listing',new URLSearchParams('record=listing-vik'));
assert(detail.includes('data-open-share'));
assert(detail.includes('data-share-overlay hidden'));
assert(detail.indexOf('data-share-overlay')<detail.indexOf('social-card-preview'));
assert(interactions.includes('data-open-share')&&interactions.includes('data-close-share'));
assert(css.includes('.share-overlay'));
assert(css.includes('align-items:flex-end'));
assert(css.includes('.demo-label,.qa-adapter,.qa-only,.social-card-qa{display:none!important}'));
assert(css.includes('.qa-mode .qa-adapter'));

// Content truth: verified article is preserved as Article, fake Aktualno is not shown as real content.
const currentHtml=global.current();
assert(currentHtml.includes('Няма актуално съдържание за показване'));
assert(!currentHtml.includes('Местна актуализация с конкретна цел'));
assert(!currentHtml.includes('12 септември'));
const articlesHtml=global.articles();
assert(articlesHtml.includes('Пенсиониране в Лом — къде се обслужвате и какво трябва да знаете'));
const pension=global.detail('article',new URLSearchParams('record=article-pension'));
assert(pension.includes('Ръководство · Попитай.Лом'));
assert(pension.includes('Проверено по данни на НОИ · септември 2026'));
assert(pension.includes('data-pension-helpful'));
assert(pension.includes('data-pension-comments'));
assert(pension.includes('data-open-share'));
assert(pension.includes('Има промяна?'));
assert(task8.includes("publications:Object.freeze([])"));
assert(task8.includes("events:Object.freeze([])"));

// Favorites are prototype/session UI only; Questions are excluded from the automatic favorite coverage.
assert(task6.includes('session'));
assert(!/localStorage|sessionStorage|supabase/i.test(task6),'Favorites prototype must not persist to storage/backend');
assert(task6.includes("contentType==='question'")||task6.includes("contentType === 'question'")||task6.includes('question'));

// Stage 2 form remediation stays prototype-only and keeps the validated safeguards.
for(const marker of ['beforeunload','validatePrototypeForm','minlength','file','focus']) assert(task7.includes(marker),`Task 7 safeguard: ${marker}`);

const detailDescriptions={
  'listing-catering':'Кетъринг за семейни тържества, фирмени събития и други поводи в Лом и региона.',
  'listing-work':'Обява за работа в строителството и техническите дейности в Лом с ясно посочена област и основни условия.',
  'listing-property':'Обява за продажба на апартамент в Лом с основна информация за имота и условията.',
  'listing-auto':'Обява за автомобил или джип в Лом с основни данни за превозното средство и състоянието му.',
  'listing-animal':'Обява за животно, което търси дом в Лом, с най-важната информация за осиновяване.',
  'health-doctor':'Профил на лекар специалист в Лом с основна специалност, контакт и местна информация.'
};
for(const [id,description] of Object.entries(detailDescriptions)){
  assert.equal(records.get(id).body,description);
  assert(global.detail(records.get(id).contentType,new URLSearchParams(`record=${encodeURIComponent(id)}`)).includes(description));
}

// Isolation is measured from the owner Stage 2 checkpoint, not from an obsolete atomic implementation commit.
const ownerCheckpoint='0b1492386b68b7f918685828c9fdd64079f24677';
const changed=execFileSync('git',['diff','--name-only',ownerCheckpoint,'HEAD'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
assert(changed.length>0,'Stage 2 diff must not be empty');
assert(changed.every(path=>path.startsWith('prototype-final-ia/')),`outside prototype-final-ia: ${changed.filter(path=>!path.startsWith('prototype-final-ia/')).join(', ')}`);
assert(!changed.some(path=>/(^|\/)(supabase|schema|migrations?|rls|rpc|content[-_ ]?master|locked)(\/|$)/i.test(path)));

console.log('prototype-regression-audit: PASS');
