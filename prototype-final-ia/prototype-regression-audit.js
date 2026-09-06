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
const contentViews=fs.readFileSync(`${__dirname}/prototype-content-views.js`,'utf8');
const task2=fs.readFileSync(`${__dirname}/prototype-task2.js`,'utf8');
const task6=fs.readFileSync(`${__dirname}/prototype-task6.js`,'utf8');
const task7=fs.readFileSync(`${__dirname}/prototype-task7.js`,'utf8');
const task8=fs.readFileSync(`${__dirname}/prototype-task8-content.js`,'utf8');
const appJs=fs.readFileSync(`${__dirname}/app.js`,'utf8');
const indexHtml=fs.readFileSync(`${__dirname}/index.html`,'utf8');
const css=fs.readFileSync(`${__dirname}/prototype-remediation.css`,'utf8');
const readme=fs.readFileSync(`${__dirname}/README.md`,'utf8');

// A. Ownership: one Social Card renderer/CSS owner and one contextual Add owner.
const jsFiles=fs.readdirSync(__dirname).filter(name=>name.endsWith('.js')&&name!=='prototype-regression-audit.js');
const rendererOwners=jsFiles.filter(name=>fs.readFileSync(`${__dirname}/${name}`,'utf8').includes('window.PopitaiSocialCardComposer=Object.freeze'));
assert.deepEqual(rendererOwners,['prototype-social-card-composer.js']);
const cssFiles=fs.readdirSync(__dirname).filter(name=>name.endsWith('.css'));
const socialCssOwners=cssFiles.filter(name=>/(^|\n)\.social-card-preview\s*\{/m.test(fs.readFileSync(`${__dirname}/${name}`,'utf8')));
assert.deepEqual(socialCssOwners,['prototype-remediation.css']);
const addOwnerFiles=jsFiles.filter(name=>/function\s+contextualAddUrl\s*\(/.test(fs.readFileSync(`${__dirname}/${name}`,'utf8')));
assert.deepEqual(addOwnerFiles,['prototype-stage2-contracts.js']);
assert(contentViews.includes("PopitaiStage2Contracts.contextualAddUrl({context,group,owner,type:isService?'Дава':type})"));
assert(!contentViews.includes("const otherService=group==='Друга ремонтна услуга'||group==='Друга услуга'"));
assert(indexHtml.indexOf('prototype-social-card-composer.js')<indexHtml.indexOf('prototype-content-views.js'));
assert(indexHtml.indexOf('prototype-task8-content.js')<indexHtml.indexOf('app.js'));

// Shops 6/6 and legacy-only Autoparts behavior.
for(const category of ['Хранителни','Строителни','Техника','Мебели','Дрехи','Дом']){
  const rec=records.resultRecord({context:'Магазини',group:category,owner:'Shops',detailType:'shop'});
  assert.equal(rec.contentType,'shop',`${category}: contentType`);
  assert.equal(rec.owner,'Shops',`${category}: owner`);
  assert.equal(rec.social.composition,'profile');
  assert.equal(rec.social.contentRole,'specialized');
}
assert(!contracts.activeServiceCanonical.includes('Авточасти'));
assert(!contracts.listingSubcategories('Услуги').includes('Авточасти'));
assert.equal(contracts.serviceCanonicalMap['Авточасти'],'Авточасти');

// Social Card semantic states.
const themed=social.render(records.get('listing-vik').social);
assert(themed.includes('social-card-template-icon'));
assert(themed.includes('icons/briefcase-duotone.svg'));
assert(!social.validate({...records.get('listing-vik').social,icon:'<svg onload=alert(1)>'}).ok);
const approved=social.render(records.get('firm-repairs').social);
assert(approved.includes('social-card-approved-brand'));
assert(approved.includes('Попитай.Лом'));
assert.equal(records.get('question-community').social.contentRole,'community');
assert.equal(records.get('info-health').social.contentRole,'verified-information');
assert.equal(social.imageMode(records.get('publication-blocked').social),records.get('publication-blocked').social.mediaAvailable?'real':records.get('publication-blocked').social.visualTheme?'template':'lom');
assert.equal(social.render(records.get('publication-blocked').social),'');

// Service taxonomy: 9 structured families + explicit Other fallback; Masters exactly 9 groups.
assert.equal(contracts.serviceFamilyNames.length,9);
for(const familyName of contracts.serviceFamilyNames){
  const family=global.serviceFamilies.find(item=>item[0]===familyName);
  assert(family,`${familyName}: family exists`);
  const familyAdd=contracts.contextualAddUrl({context:'Услуги',group:familyName,owner:'Listings'});
  assert(familyAdd.startsWith('#service-group?'));
  assert(familyAdd.includes('mode=add'));
  const leafAdd=contracts.contextualAddUrl({context:'Услуги',group:family[1],owner:'Listings'});
  assert(leafAdd.startsWith('#add/listing?'));
  const choose=global.serviceGroup(new URLSearchParams(`group=${encodeURIComponent(familyName)}&mode=add&type=${encodeURIComponent('Дава')}`));
  assert(choose.includes('Избери конкретна услуга'),`${familyName}: choose-first`);
  assert(choose.includes('type='),`${familyName}: intent retained`);
}
const expectedMasterGroups=['Цялостни ремонти','Бани и плочки','ВиК','Електро','Покриви','Шпакловка и боядисване','Дограма и врати','Климатици','Друга ремонтна услуга'];
assert.deepEqual([...global.PopitaiStage2MasterGroups],expectedMasterGroups);
assert.deepEqual(global.serviceFamilies.find(row=>row[0]==='Майстори, ремонти и дом').slice(1),expectedMasterGroups);
assert.equal(global.PopitaiStage2ServiceFamilies.length,10);
assert(global.PopitaiStage2ServiceFamilies.includes('Друга услуга'));
const otherServiceAdd=contracts.contextualAddUrl({context:'Услуги',group:'Друга услуга',owner:'Listings',type:'Дава'});
assert(otherServiceAdd.includes('other=1'));
assert(otherServiceAdd.includes('type=%D0%94%D0%B0%D0%B2%D0%B0'));
const otherRepairAdd=contracts.contextualAddUrl({context:'Услуги',group:'Друга ремонтна услуга',owner:'Listings',type:'Търси'});
assert(otherRepairAdd.includes('other=1'));
assert(otherRepairAdd.includes(`family=${encodeURIComponent('Майстори, ремонти и дом')}`));
const mastersChoose=global.serviceGroup(new URLSearchParams(`group=${encodeURIComponent('Майстори, ремонти и дом')}&mode=add&type=${encodeURIComponent('Дава')}`));
for(const sub of expectedMasterGroups) assert(mastersChoose.includes(sub),`Masters choose-first: ${sub}`);
assert(!mastersChoose.includes('Монтажи и мебели'));
assert(!mastersChoose.includes('Къртене и извозване'));

// Home and main marketplace IA.
const home=global.home();
const hub=global.hub(new URLSearchParams());
const services=global.services();
const masters=global.masters();
for(const label of ['Услуги','Купува и продава','Работа','Имоти','Автомобили','Здраве и частни лекари','Магазини','Заведения','Животни']) assert(hub.includes(label),`hub ${label}`);
assert(!home.includes('href="#maistori"'),'Home must not restore standalone Masters shortcut');
assert(home.indexOf('Обяви и услуги')<home.indexOf('Последни обяви и услуги'));
assert(home.indexOf('Последни обяви и услуги')<home.indexOf('Инфо Лом'));
assert(home.indexOf('Инфо Лом')<home.indexOf('Местни фирми'));
assert(home.indexOf('Местни фирми')<home.indexOf('Полезни статии'));
assert(home.indexOf('Полезни статии')<home.indexOf('Не намери отговор? Попитай'));
assert(!home.includes('Актуално в Лом'),'Do not show Home Aktualno without verified content');
for(const family of [...contracts.serviceFamilyNames,'Друга услуга']) assert(services.includes(family),`service family ${family}`);
for(const sub of expectedMasterGroups) assert(masters.includes(sub),`masters ${sub}`);
assert(masters.indexOf('Активни предложения и търсения')<masters.indexOf('Местни фирми и майстори'));
assert(masters.indexOf('Местни фирми и майстори')<masters.indexOf('Задай въпрос'));

// B. End-to-end contextual paths, including canonical Results Add owner.
const vikResults=global.results(new URLSearchParams('context=%D0%A3%D1%81%D0%BB%D1%83%D0%B3%D0%B8&group=%D0%92%D0%B8%D0%9A&detail=listing&owner=Listings'));
assert(vikResults.includes('<h1>ВиК услуги в Лом</h1>'));
assert(vikResults.includes('Предлагам ВиК услуга'));
assert(vikResults.includes('Търся ВиК изпълнител'));
assert(vikResults.includes(contracts.contextualAddUrl({context:'Услуги',group:'ВиК',owner:'Listings',type:'Дава'})));
assert(vikResults.includes(contracts.contextualAddUrl({context:'Услуги',group:'ВиК',owner:'Listings',type:'Търси'})));
assert(forms.includes("{value:'Дава',label:'Предлагам услуга'}"));
assert(forms.includes("{value:'Търси',label:'Търся изпълнител'}"));
assert(forms.includes('service-context-summary'));
assert(forms.includes('Смени услугата'));
assert(forms.includes('other-service-text'));
assert(forms.includes('Каква услуга?'));
assert(interactions.includes("syncListingForm({preserve:false,resetDiscovery:true})"));

// Info Lom: six distinct routes/records/social contexts.
const infoHtml=global.info();
const infoIds=['info-health','info-institutions','info-transport','info-education','info-banks','info-utilities'];
const infoUrls=new Set();
for(const id of infoIds){
  assert(infoHtml.includes(`#detail/info?record=${id}`),`${id}: route`);
  const rec=records.get(id);
  assert(rec,`${id}: record`);
  assert.equal(rec.contentType,'info');
  assert.equal(rec.social.contentRole,'verified-information');
  assert.equal(rec.social.category,'Инфо Лом');
  assert(rec.social.discovery,`${id}: discovery`);
  infoUrls.add(rec.social.canonicalUrl);
  const detail=global.detail('info',new URLSearchParams(`record=${id}`));
  assert(detail.includes(rec.social.discovery),`${id}: distinct detail context`);
}
assert.equal(infoUrls.size,6);
assert(!infoHtml.includes('Полезни телефони'));

// Health: do not promise a generic health-service contract that production does not have.
const healthPage=global.health();
assert(healthPage.includes('Добави лекар / практика'));
assert(!healthPage.includes('Добави лекар / здравна услуга'));
assert(forms.includes("const healthOwnerTypes=['Лекар','Стоматолог','Ветеринар']"));
assert(forms.includes('Production contract — read-only verification'));
assert(forms.includes('по-широкият backend flow за здравна услуга остава OPEN/LOCKED'));

// C. Share/media: Share is inside overlay; blocked stays blocked.
const listingDetail=global.detail('listing',new URLSearchParams('record=listing-vik'));
assert(listingDetail.includes('data-open-share'));
assert(listingDetail.includes('data-share-overlay hidden'));
assert(listingDetail.indexOf('data-share-overlay')<listingDetail.indexOf('social-card-preview'));
assert(interactions.includes('data-open-share')&&interactions.includes('data-close-share'));
assert(css.includes('.share-overlay'));
assert(css.includes('align-items:flex-end'));

// Content truth and article actions: no fake current records; article keeps only approved Share + Favorites layer.
const currentHtml=global.current();
assert(currentHtml.includes('Няма актуално съдържание за показване'));
assert(!currentHtml.includes('Местна актуализация с конкретна цел'));
assert(!currentHtml.includes('12 септември'));
const articlesHtml=global.articles();
assert(articlesHtml.includes('Пенсиониране в Лом — къде се обслужвате и какво трябва да знаете'));
const pension=global.detail('article',new URLSearchParams('record=article-pension'));
assert(pension.includes('Ръководство · Попитай.Лом'));
assert(pension.includes('Проверено по данни на НОИ · септември 2026'));
assert(pension.includes('data-open-share'));
assert(!pension.includes('data-pension-helpful'));
assert(!pension.includes('data-pension-comments'));
assert(!pension.includes('Има промяна?'));
assert(!pension.includes('<h2>Коментари</h2>'));
assert(task8.includes("publications:Object.freeze([])"));
assert(task8.includes("events:Object.freeze([])"));
assert(readme.includes('APPROVED REQUIREMENT / IMPLEMENTATION OPEN'));
assert(readme.includes('comments system contract и реална comments реализация'));

// Favorites: prototype-only, no persistent storage, full approved coverage and no automatic Questions.
assert(task6.includes("const eligible=new Set(['listing','firm','shop','restaurant','health','event','publication','article','info'])"));
assert(task6.includes('const saved=new Map()'));
assert(task6.includes("storage:'session-memory-only'"));
assert(!/\blocalStorage\s*[.[]|\bsessionStorage\s*[.[]/.test(task6),'Favorites must not persist');
assert(task6.includes("type:'question'"));
assert(!task6.includes("eligible=new Set(['question'"));
assert(task6.includes("route.query.get('context')==='Заведения'"));
assert(task6.includes(".detail-page,.article-detail-page"));
assert(task6.includes("return 'restaurant'"));
assert(task6.includes("info={type:'restaurant'"));

// D. Forms safeguards.
for(const marker of ['function setLimits','control.minLength=minLength','function validateParityForm','function parityMessage','firstInvalid.focus']) assert(task7.includes(marker),`Task7: ${marker}`);
for(const marker of ['function validateFiles','maxBytes','allowed:new Set','function validatePriceState','function validateHealthPair','function validatePrototypeForm','beforeunload']) assert(interactions.includes(marker),`Interactions: ${marker}`);
assert(interactions.includes("eventTarget===free&&free.checked"));
assert(interactions.includes("eventTarget===negotiable&&negotiable.checked"));
assert(interactions.includes("eventTarget===price&&price.value.trim()"));

// E. Add modal accessibility contract.
assert(indexHtml.includes('id="add-layer" hidden'));
assert(indexHtml.includes('role="dialog" aria-modal="true" aria-labelledby="add-title"'));
assert(indexHtml.includes('data-close-add aria-label="Затвори"'));
for(const marker of ['let modalOpener=null','previousBodyOverflow','function setBackgroundInert','function focusableInModal','function trapModalFocus','document.body.style.overflow=\'hidden\'','setBackgroundInert(true)','setBackgroundInert(false)','modalOpener.focus','event.key===\'Escape\'']) assert(appJs.includes(marker),`Modal: ${marker}`);
assert(appJs.includes("if(event.target===addLayer)"));
assert(appJs.includes("if(event.shiftKey&&document.activeElement===first)"));
assert(appJs.includes("else if(!event.shiftKey&&document.activeElement===last)"));

// User view hides technical QA text by default.
assert(css.includes('.demo-label,.qa-adapter,.qa-only,.social-card-qa{display:none!important}'));
assert(css.includes('.qa-mode .qa-adapter'));

// Known example records still preserve exact descriptions through detail.
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

// F. Isolation.
const ownerCheckpoint='0b1492386b68b7f918685828c9fdd64079f24677';
const changed=execFileSync('git',['diff','--name-only',ownerCheckpoint,'HEAD'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
assert(changed.length>0,'Stage 2 diff must not be empty');
assert(changed.every(path=>path.startsWith('prototype-final-ia/')),`outside prototype-final-ia: ${changed.filter(path=>!path.startsWith('prototype-final-ia/')).join(', ')}`);
assert(!changed.some(path=>/(^|\/)(supabase|schema|migrations?|rls|rpc|content[-_ ]?master|locked)(\/|$)/i.test(path)));

console.log('prototype-regression-audit: PASS');
