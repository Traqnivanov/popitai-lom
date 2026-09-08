'use strict';

const assert=require('assert');
const fs=require('fs');
const vm=require('vm');
const crypto=require('crypto');
const path=require('path');
const root=__dirname;
const read=name=>fs.readFileSync(path.join(root,name),'utf8');

const workGroups=[
  'Строителство, ремонти и техници','Производство, склад и общи работници','Транспорт, шофьори и доставки',
  'Търговия и продажби','Заведения, хотели и туризъм','Почистване, домашна помощ и грижи',
  'Здраве, красота и социални дейности','Офис, администрация, IT и специалисти','Друга / сезонна работа'
];

global.window=global;
global.URLSearchParams=URLSearchParams;
global.workGroups=workGroups;
global.icons=['x'];
global.propertyKinds=[];
global.goodsGroups=[];
global.autoGroups=[];
global.animalGroups=[];
global.shopGroups=[];
global.restaurantGroups=[];
global.healthGroups=[];
global.serviceFamilies=[];
global.esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
global.pageHead=(title,desc)=>`<header><h1>${global.esc(title)}</h1><p>${global.esc(desc)}</p></header>`;
global.propertyResultsHref=()=> '#results';
global.serviceResultsHref=()=> '#results';
global.fieldRequired=()=>false;
global.editValue=()=>'';
global.PopitaiStage2Contracts={
  listingAddUrl({category='',type='',discovery=''}={}){const q=new URLSearchParams();if(category)q.set('category',category);if(type)q.set('type',type);if(discovery)q.set('discovery',discovery);return `#add/listing${q.size?`?${q}`:''}`;},
  listingTypes(category){return category==='Работа'?['Предлага работа','Търси работа']:['Продава','Купува','Търси','Дава'];},
  listingSubcategories(category){return category==='Услуги'?['ВиК']:[];},
  serviceCanonical(value){return value==='ВиК'?'ВиК':'';},
  shopTagsForCategory(){return {primary:[],other:[]};},
  compatibilityAdapter({category='',type=''}){return {category,subcategory:'',listing_type:type};}
};
global.PopitaiHomeViews={publicRow:item=>`<article class="result-row"><h3>${global.esc(item.title||'')}</h3><p>${global.esc(item.meta||'')}</p></article>`};
global.PopitaiApprovedContent={};

vm.runInThisContext(read('prototype-marketplace-views.js'),{filename:'prototype-marketplace-views.js'});
vm.runInThisContext(read('prototype-forms.js'),{filename:'prototype-forms.js'});

const marketplace=global.PopitaiMarketplaceViews;
const forms=global.PopitaiFormOwners;
const app=read('app.js');
const interactions=read('prototype-interactions.js');
const formSource=read('prototype-forms.js');

// Direct Work list: no 9-card intermediate screen and no simulated runtime records.
let html=marketplace.work(new URLSearchParams());
assert(html.includes('data-work-search'),'Work has direct search');
assert(!html.includes('family-card'),'Work has no intermediate family cards');
assert.deepEqual([...html.matchAll(/class="tab[^>]*>([^<]+)<\/a>/g)].map(x=>x[1]),['Всички','Предлагат работа','Търсят работа']);
assert.equal((html.match(/data-work-add/g)||[]).length,1,'one top Add button');
assert(html.includes('Няма активни обяви за работа'),'honest empty state');
assert(!/извест|уведом/i.test(html),'no notification feature');
for(const group of workGroups)assert(html.includes(group),`${group}: direction filter retained`);

// QA-only injected records verify type/direction/search filtering without shipping fake content.
global.PopitaiApprovedContent={workListings:[
  {title:'Шофьор за доставки',description:'Работа в Лом',workType:'Предлага работа',workGroup:'Транспорт, шофьори и доставки'},
  {title:'Продавач-консултант',description:'Магазин в Лом',workType:'Предлага работа',workGroup:'Търговия и продажби'},
  {title:'Търся работа като шофьор',description:'Категория B',workType:'Търси работа',workGroup:'Транспорт, шофьори и доставки'}
]};
html=marketplace.work(new URLSearchParams('type='+encodeURIComponent('Предлага работа')));
assert.equal((html.match(/class="result-row"/g)||[]).length,2,'offer filter returns two QA fixtures');
html=marketplace.work(new URLSearchParams('type='+encodeURIComponent('Търси работа')));
assert.equal((html.match(/class="result-row"/g)||[]).length,1,'seek filter returns one QA fixture');
html=marketplace.work(new URLSearchParams('q='+encodeURIComponent('продавач')));
assert.equal((html.match(/class="result-row"/g)||[]).length,1,'search filters Work rows');
html=marketplace.work(new URLSearchParams('group='+encodeURIComponent('Транспорт, шофьори и доставки')));
assert.equal((html.match(/class="result-row"/g)||[]).length,2,'direction filter works');

// Existing Listing form remains the owner. Work direction reuses the existing classification field.
const returnRoute='#rabota?type='+encodeURIComponent('Търси работа')+'&group='+encodeURIComponent('Транспорт, шофьори и доставки');
const workForm=forms.formPage('listing',new URLSearchParams('category='+encodeURIComponent('Работа')+'&discovery='+encodeURIComponent('Транспорт, шофьори и доставки')+'&return='+encodeURIComponent(returnRoute)));
assert(workForm.includes('Професионално направление'),'Work form labels existing classification field clearly');
assert(workForm.includes('id="listing-subcategory"'),'existing Listing classification control reused');
assert(workForm.includes('Транспорт, шофьори и доставки'),'direction prefilled/available');
assert(workForm.includes('Предлага работа')&&workForm.includes('Търси работа'),'both Work listing types are explicit');
assert(workForm.includes(`href="${returnRoute.replaceAll('&','&amp;')}"`)||workForm.includes(`href="${returnRoute}"`),'Cancel returns to Work results context');
assert(!workForm.includes('Услуги → Транспорт, шофьори и доставки'),'Work never inherits Service discovery summary');

// No persistence-contract change: adapter still keeps non-Service subcategory empty.
const adapted=global.PopitaiStage2Contracts.compatibilityAdapter({category:'Работа',discovery:'Транспорт, шофьори и доставки',type:'Предлага работа',subcategory:'Транспорт, шофьори и доставки'});
assert.equal(adapted.subcategory,'','Work UX direction does not invent a persisted subcategory contract');

// Router/search wiring and delegated form interaction stay in existing owners.
assert(app.includes("if(path==='rabota') return work(query);"),'router passes Work query');
assert(app.includes("'[data-work-search]'"),'router owns Work search navigation');
assert(interactions.includes("subs=categoryValue==='Работа'?workGroups:contracts.listingSubcategories(categoryValue)"),'interaction owner keeps Work directions selectable');
assert(interactions.includes("categoryValue==='Услуги'||categoryValue==='Работа'"),'classification remains visible for Work');
assert(interactions.includes("subcategoryLabel.textContent=categoryValue==='Работа'?'Професионално направление':'Подкатегория / вид'"),'dynamic label is correct');
assert(interactions.includes("form.dataset.discoveryContext=target.value||''"),'manual Work direction updates UX discovery context');

// FORM PRICE CONTEXT block must remain byte-identical to the independently approved parent.
const start=formSource.indexOf('  const goodsPriceCategories=');
const end=formSource.indexOf('  function attributesFor',start);
assert(start>=0&&end>start,'price context block found');
const priceHash=crypto.createHash('sha256').update(formSource.slice(start,end)).digest('hex');
assert.equal(priceHash,'5b023a5ca319a009aa526d71825c336ce9c0667589173f518b5a0bc05948f3ab','approved FORM PRICE CONTEXT block unchanged');

console.log('prototype Work UX regression audit: ok');
