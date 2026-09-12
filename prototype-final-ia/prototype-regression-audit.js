'use strict';

const assert=require('assert');
const fs=require('fs');
const vm=require('vm');
const path=require('path');
const root=__dirname;
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const exists=name=>fs.existsSync(path.join(root,name));

// Node-only regression audit. It is intentionally absent from index.html and never mutates runtime DOM.
global.window=global;
global.location={hash:'#home',search:''};
global.URLSearchParams=URLSearchParams;
global.document={getElementById(){return null},querySelector(){return null},querySelectorAll(){return []}};
global.CSS={escape:value=>String(value)};

for(const file of [
  'prototype-stage2-contracts.js',
  'prototype-core.js',
  'prototype-content-data.js',
  'prototype-icon-registry.js',
  'prototype-service-views.js',
  'prototype-marketplace-views.js',
  'prototype-home.js',
  'prototype-forms.js'
]) vm.runInThisContext(read(file),{filename:file});

const contracts=global.PopitaiStage2Contracts;
const forms=global.PopitaiFormOwners;
const services=global.PopitaiServiceViews;
const homeViews=global.PopitaiHomeViews;
const data=global.PopitaiContentData;

const index=read('index.html');
const app=read('app.js');
const interactions=read('prototype-interactions.js');
const formsSource=read('prototype-forms.js');
const validators=read('prototype-validators.js');
const contentViews=read('prototype-content-views.js');
const records=read('prototype-records.js');
const social=read('prototype-social-card-composer.js');
const runtimeJs=[
  'prototype-stage2-contracts.js','prototype-core.js','prototype-records.js','prototype-content-data.js',
  'prototype-social-card-composer.js','prototype-icon-registry.js','prototype-service-views.js','prototype-marketplace-views.js',
  'prototype-home.js','prototype-forms.js','prototype-content-views.js','prototype-validators.js',
  'prototype-interactions.js','app.js'
];

// 1. Runtime ownership: semantic owners only, no task patch chain and no QA runtime script.
for(const file of runtimeJs) assert(index.includes(`src="${file}"`),`${file}: runtime manifest`);
assert(!index.includes('prototype-regression-audit.js'),'regression audit must not load in runtime');
assert(!index.includes('prototype-task'),'task patch scripts must not load in runtime');
assert(!index.includes('prototype-master-order.js'),'legacy Home override must not load in runtime');
assert(!index.includes('prototype-stage2-interactions.js'),'legacy interactions owner must not load in runtime');
assert(!index.includes('prototype-remediation.css'),'legacy patch CSS name must not load in runtime');
for(const oldCss of ['prototype-master-order.css','prototype-task2.css','prototype-task3.css','prototype-task4.css','prototype-task6.css']) assert(!index.includes(oldCss),`${oldCss}: not runtime`);
for(const css of ['styles.css','prototype-components.css','prototype-home.css','prototype-services.css','prototype-results-forms.css','prototype-detail-share.css','prototype-favorites.css']) assert(index.includes(`href="${css}"`),`${css}: semantic CSS owner loaded`);

const ownershipMarkers={
  PopitaiHomeViews:'prototype-home.js',
  PopitaiServiceViews:'prototype-service-views.js',
  PopitaiMarketplaceViews:'prototype-marketplace-views.js',
  PopitaiContentViews:'prototype-content-views.js',
  PopitaiFormOwners:'prototype-forms.js',
  PopitaiValidators:'prototype-validators.js',
  PopitaiInteractions:'prototype-interactions.js',
  PopitaiRouter:'app.js',
  PopitaiContentData:'prototype-content-data.js',
  PopitaiSocialCardComposer:'prototype-social-card-composer.js'
};
for(const [marker,owner] of Object.entries(ownershipMarkers)){
  const owners=runtimeJs.filter(file=>read(file).includes(`window.${marker}=Object.freeze`));
  assert.deepEqual(owners,[owner],`${marker}: one owner`);
}
assert.equal(runtimeJs.filter(file=>/function\s+home\s*\(/.test(read(file))).length,1,'one Home function owner');
assert.equal(runtimeJs.filter(file=>/function\s+contextualAddUrl\s*\(/.test(read(file))).length,1,'one discovery/Add mapping owner');
assert.deepEqual(runtimeJs.filter(file=>read(file).includes('document.addEventListener')).sort(),['app.js','prototype-interactions.js'].sort(),'document listeners limited to router + interactions owners');
assert(!runtimeJs.some(file=>read(file).includes('MutationObserver')),'no runtime MutationObserver patching');
assert(app.includes("window.addEventListener('popstate',handlePopState)"),'router owns popstate lifecycle');
assert(!app.includes("window.addEventListener('hashchange'"),'router does not duplicate history with hashchange lifecycle');
assert(interactions.includes('function afterRender'),'interactions are attached to explicit render lifecycle');

// 2. Offer-only service creation, including hostile/legacy input normalization.
assert.equal(contracts.SERVICE_OFFER_TYPE,'Дава');
assert.equal(services.structuredFamilies.reduce((sum,family)=>sum+family.length-1,0),45,'Services exposes exactly 45 consolidated entries');
assert.equal(services.familyNames.length,9,'Services keeps exactly nine families');
assert(!services.services().includes('Друга услуга'),'generic other service is not a visible family card');
assert.equal(contracts.serviceVisibleEntry('Офиси и входове'),'Почистване');
assert.equal(contracts.serviceVisibleEntry('Преместване'),'Хамали и преместване');
assert.equal(contracts.serviceVisibleEntry('Домашни помощници'),'Помощ в дома');
assert.deepEqual(contracts.serviceVariants('Фото и видео'),['Фото','Видео']);
assert(contracts.serviceCanonicals('ИТ, сайтове и дизайн').includes('Компютърни и технически услуги'));
assert(contracts.serviceCanonicals('ИТ, сайтове и дизайн').includes('Професионални услуги'));
assert.equal(services.searchMatch('офиси'),'Офиси и входове','old exact intent remains searchable');
assert.equal(services.searchMatch('разходка'),'Разходка на кучета','legacy runtime label remains searchable');
assert(contracts.contextualAddUrl({context:'Услуги',group:'Почистване',owner:'Listings'}).startsWith('#service-entry?'),'merged entry requires exact choice before Add');
const cleaningChooser=services.serviceEntry(new URLSearchParams(`group=${encodeURIComponent('Почистване')}`));
assert(cleaningChooser.includes('Почистване на дом')&&cleaningChooser.includes('Офиси и входове'),'merged cleaning entry exposes exact filters');
assert(cleaningChooser.includes('<h1>Почистване</h1>'),'exact-choice page keeps the selected visible entry as its title');
assert(!cleaningChooser.includes('<div class="icon">'),'exact-choice page does not invent or reuse a misleading unapproved icon');
const cleaningDiscoveries=[...cleaningChooser.matchAll(/href="([^"]*discovery=[^"]+)"/g)].map(match=>new URLSearchParams(match[1].split('?')[1]).get('discovery'));
assert.deepEqual(cleaningDiscoveries,['Почистване на дом','Офиси и входове'],'broad merged label is not persisted as an exact service');
const officeAdd=contracts.contextualAddUrl({context:'Услуги',group:'Офиси и входове',owner:'Listings'});
assert.equal(new URLSearchParams(officeAdd.split('?')[1]).get('discovery'),'Офиси и входове','exact alias remains visible in Add context');
assert.equal((services.masters().match(/class="master-chip"/g)||[]).length,10,'Masters exposes the ten approved repair entries');
const automotiveBrowse=services.serviceGroup(new URLSearchParams(`group=${encodeURIComponent('Автомобилни услуги')}`));
assert.equal((automotiveBrowse.match(/class="service-card-icon"/g)||[]).length,6,'Automotive browse exposes the six owner-approved icons');
for(const label of ['Автосервиз','Диагностика','Гуми','Автоелектро и автоклиматици','Автомивка и детайлинг','Пътна помощ']){
  assert(services.iconAsset(label),`${label}: exact approved icon mapping`);
}
const automotiveAdd=services.serviceGroup(new URLSearchParams(`group=${encodeURIComponent('Автомобилни услуги')}&mode=add&type=${encodeURIComponent('Дава')}`));
assert(!automotiveAdd.includes('service-card-icon'),'Automotive Add mode remains text-only');
const cleaningBrowse=services.serviceGroup(new URLSearchParams(`group=${encodeURIComponent('Почистване и поддръжка')}`));
assert.equal((cleaningBrowse.match(/class="service-card-icon"/g)||[]).length,4,'Cleaning browse exposes the four owner-approved icons');
for(const label of ['Почистване','Пране на мека мебел и килими','Двор, градина и озеленяване','Борба с вредители']){
  assert(services.iconAsset(label),`${label}: exact approved icon mapping`);
}
const cleaningAdd=services.serviceGroup(new URLSearchParams(`group=${encodeURIComponent('Почистване и поддръжка')}&mode=add&type=${encodeURIComponent('Дава')}`));
assert(!cleaningAdd.includes('service-card-icon'),'Cleaning Add mode remains text-only');
const encodedSeek=encodeURIComponent('Търси');
const encodedOffer=encodeURIComponent('Дава');
for(const target of [
  contracts.contextualAddUrl({context:'Услуги',group:'ВиК',owner:'Listings',type:'Търси'}),
  contracts.contextualAddUrl({context:'Услуги',group:'Автомобилни услуги',owner:'Listings',type:'Търси'}),
  contracts.contextualAddUrl({context:'Услуги',group:'Друга услуга',owner:'Listings',type:'Търси'}),
  contracts.listingAddUrl({category:'Услуги',subcategory:'ВиК',type:'Търси',discovery:'ВиК'})
]){
  assert(!target.includes(encodedSeek),`no service create seek route: ${target}`);
  assert(target.includes(encodedOffer)||target.includes('type=%D0%94%D0%B0%D0%B2%D0%B0'),`offer-only route: ${target}`);
}
for(const family of contracts.serviceFamilyNames){
  const browse=services.serviceGroup(new URLSearchParams(`group=${encodeURIComponent(family)}`));
  const add=services.serviceGroup(new URLSearchParams(`group=${encodeURIComponent(family)}&mode=add&type=${encodedSeek}`));
  assert(browse.includes('Предлагам услуга'),`${family}: offer CTA`);
  assert(!browse.includes('Търся изпълнител'),`${family}: no seek CTA`);
  assert(!add.includes('Търся изпълнител'),`${family}: add choose-first offer only`);
  assert(!add.includes(encodedSeek),`${family}: no encoded seek path`);
}
assert(!services.services().includes('Търся изпълнител'));
assert(!services.masters().includes('Търся изпълнител'));

const hostileCreate=forms.formPage('listing',new URLSearchParams(`category=${encodeURIComponent('Услуги')}&subcategory=${encodeURIComponent('ВиК')}&type=${encodedSeek}&discovery=${encodeURIComponent('ВиК')}`));
assert(hostileCreate.includes('id="listing-type"'));
assert(hostileCreate.includes('value="Дава" selected'),'service create source-level type is Dava');
assert(hostileCreate.includes('data-listing-type-field hidden'),'service create type selector stays non-public but can switch context safely');
assert(!hostileCreate.includes('Търся изпълнител'),'service create has no seek choice');
const legacyEdit=forms.formPage('listing',new URLSearchParams('state=edit&record=legacy-service-seek'));
assert(legacyEdit.includes('value="Търси" selected'),'legacy seek value remains editable');
assert(legacyEdit.includes('Търся изпълнител (стар запис)'),'legacy compatibility is labeled, not exposed as new flow');
assert(legacyEdit.includes('data-form-mode="edit"'));
assert(validators.includes("mode==='edit'&&category==='Услуги'&&type==='Търси'"),'validator retains legacy edit allowance');

// Static pages expose their description once through the shared page head.
const staticDescription='Попитай.Лом е местен портал за намиране, публикуване и помощ от общността.';
const staticHtml=global.staticPage('За сайта',staticDescription);
assert.equal((staticHtml.match(new RegExp(staticDescription.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))||[]).length,1,'static page description is rendered once');
assert(!staticHtml.includes('content-card'),'static page does not add an empty duplicate content card');

// 2b. Price context is category-aware; free is goods-only and service pricing has its own controls.
const servicePrice=forms.listingPriceContext('Услуги');
assert.deepEqual(servicePrice.options.map(x=>x.label),['По договаряне','Цена след оглед/запитване']);
assert(!servicePrice.options.some(x=>x.id==='price-free'),'services never expose free');
for(const category of ['Работа','Имоти','Автомобили и МПС','Животни']){
  const ctx=forms.listingPriceContext(category);
  assert(!ctx.options.some(x=>x.id==='price-free'),`${category}: no inherited free option`);
}
for(const category of ['Електроника','Дом и градина','Дрехи и обувки','Деца и бебета','Спорт и хоби','Друго']){
  const ctx=forms.listingPriceContext(category);
  assert(ctx.options.some(x=>x.id==='price-free'),`${category}: goods can be free`);
}
assert(!index.includes('prototype-price-context-browser-test.html'),'price browser QA page must not load in runtime');
assert(!index.includes('prototype-price-context-browser-test.js'),'price browser QA script must not load in runtime');

// 3. Persisted validators remain owner-specific.
for(const owner of ['listing','firm','shop','health','question']) assert(new RegExp(`\\b${owner}\\(form,control\\)`).test(validators),`${owner}: persisted validator`);
assert(validators.includes('validatorsByOwner=Object.freeze'));
assert(interactions.includes('validators.validateForm'),'interactions delegates form validation');
assert(!interactions.includes('function validateForm'),'interactions does not own persisted validators');

// 4. Locked IA/content parity.
assert.equal(homeViews.marketplaceEntries.length,9,'nine marketplace entrances');
assert.equal(homeViews.infoEntries.length,6,'Home Info Lom exactly six');
assert.deepEqual(data.approved.publications,[],'no fake current publication');
assert.deepEqual(data.approved.events,[],'no fake current event');
const homeHtml=homeViews.home();
assert(!homeHtml.includes('Актуално в Лом'),'Home hides Aktualno without real content');
assert(homeHtml.indexOf('home-marketplace')<homeHtml.indexOf('Последни обяви и услуги'));
assert(homeHtml.indexOf('Последни обяви и услуги')<homeHtml.indexOf('home-info'));
assert(homeHtml.indexOf('home-info')<homeHtml.indexOf('Местни фирми'));
assert(homeHtml.indexOf('Местни фирми')<homeHtml.lastIndexOf('Полезни статии'));
assert(homeHtml.lastIndexOf('Полезни статии')<homeHtml.indexOf('Не намери отговор? Попитай'));
assert(data.approved.articles.some(item=>item.href==='#detail/article?record=article-pension'),'pension article consolidated into data layer');
for(const id of ['info-health','info-institutions','info-transport','info-education','info-banks','info-utilities']) assert(contentViews.includes(`'${id}'`),`${id}: Info Lom route source`);
assert(contentViews.includes("function current()"),'Publications/Events current view stays separate');
assert(contentViews.includes("function articles()"),'Article view stays separate');
assert(contentViews.includes("function questions()"),'Question view stays separate');

// 5. Social/share contract stays single-owner and guarded by eligibility.
assert(social.includes('function render(rawInput)'));
assert(social.includes('if(!input.shareEligible) return'));
assert(contentViews.includes("if(!record?.actions?.share||!record.social?.shareEligible)return ''"));
assert(records.includes("'publication-blocked':record"),'blocked share fixture remains available');
assert(records.includes("infoIds:Object.freeze(['info-health','info-institutions','info-transport','info-education','info-banks','info-utilities'])"));

// 6. Dirty/history/success lifecycle stays explicit, single-owner and repeat-submit safe.
for(const needle of ['function activeDirtyForm','function confirmLeave','form.dataset.submitted','form.dataset.dirty','function trapFocus','modalOpener','shareReturnFocus','augmentFavorites','favoriteLoggedIn']) assert(interactions.includes(needle),needle);
assert(interactions.includes("if(form.dataset.submitted==='true')return"),'repeat submit blocked before lifecycle handoff');
assert(interactions.includes("form.dataset.dirty='false'"),'successful submit clears dirty before route replacement');
assert(interactions.includes('function routeTo(target)'),'interaction-triggered routes delegate to router');
assert(!/location\.hash\s*=/.test(interactions),'interactions do not create raw hash history entries');
for(const needle of ['function canonicalHash','function navigate','function handlePopState','history.pushState','history.replaceState','history.go','function completeSubmittedForm']) assert(app.includes(needle),needle);
assert(app.includes("document.addEventListener('click',handleRouteClick,true)"),'router guards internal hash navigation before browser history changes');
assert(app.includes("document.addEventListener('submit',handleSubmittedForm)"),'router owns success route replacement after validated submit');
assert(interactions.includes("if(!form.dataset.dirty)form.dataset.dirty='false'")&&interactions.includes("if(!form.dataset.submitted)form.dataset.submitted='false'"),'render lifecycle initializes forms clean and active without source hydration events');
assert(app.includes("successCard.tabIndex=-1;successCard.dataset.successCard=''"),'success route creates an explicit focus target');
assert(interactions.includes("title.placeholder='Напр. Предлагам ВиК в Лом'"),'ВиК placeholder correction is lifecycle-owned and exact');
assert(!interactions.includes('firstInvalid'),'first-error focus state belongs to validators, not interactions');
assert(validators.includes('first.focus?.({preventScroll:false})'),'validator owns first-error focus');
assert(exists('prototype-lifecycle-browser-test.html'),'lifecycle browser QA page exists');
assert(exists('prototype-lifecycle-browser-test.js'),'lifecycle browser QA script exists');
assert(!index.includes('prototype-lifecycle-browser-test.html'),'lifecycle browser QA page must not load in runtime');
assert(!index.includes('prototype-lifecycle-browser-test.js'),'lifecycle browser QA script must not load in runtime');

console.log('prototype regression audit: ok');
