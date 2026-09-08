'use strict';

const assert=require('assert');
const fs=require('fs');
const vm=require('vm');
const crypto=require('crypto');
const path=require('path');
const root=__dirname;
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const formsSource=read('prototype-forms.js');
const interactionsSource=read('prototype-interactions.js');
const validatorsSource=read('prototype-validators.js');

const workGroups=['Строителство, ремонти и техници','Производство, склад и общи работници','Транспорт, шофьори и доставки','Търговия и продажби','Заведения, хотели и туризъм','Почистване, домашна помощ и грижи','Здраве, красота и социални дейности','Офис, администрация, IT и специалисти','Друга / сезонна работа'];
const fixtures={
  'listing:legacy-work-no-period':{'Заглавие':'Стара обява за работа','Категория':'Работа','Подкатегория / вид':'Транспорт, шофьори и доставки','Тип обява':'Предлага работа','Описание':'Стар запис за работа без период на възнаграждението.','Цена в евро':'900','Телефон':'0876 123 456','Град / район':'Лом','Улица (по желание)':''}
};

global.window=global;
global.workGroups=workGroups;
global.shopGroups=[];
global.serviceFamilies=[];
global.esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
global.pageHead=(title,desc)=>`<header><h1>${global.esc(title)}</h1><p>${global.esc(desc)}</p></header>`;
global.fieldRequired=()=>false;
global.editValue=(kind,label,record='')=>fixtures[`${kind}:${record}`]?.[label]??'';
global.PopitaiStage2Contracts={
  listingTypes(category){return category==='Работа'?['Предлага работа','Търси работа']:category==='Имоти'?['Продава имот','Отдава под наем','Търси за купуване','Търси под наем']:['Продава','Купува','Търси','Дава'];},
  listingSubcategories(category){return category==='Услуги'?['ВиК']:[];},
  serviceCanonical(value){return value==='ВиК'?'ВиК':'';},
  shopTagsForCategory(){return {primary:[],other:[]};},
  compatibilityAdapter({category='',type='',subcategory=''}){return {category,listing_type:type,subcategory:category==='Услуги'?subcategory:''};}
};
vm.runInThisContext(formsSource,{filename:'prototype-forms.js'});

const owners=global.PopitaiFormOwners;
assert.equal(owners.workCompensationLabel('Предлага работа'),'Предлагано възнаграждение в евро (по желание)');
assert.equal(owners.workCompensationLabel('Търси работа'),'Желано възнаграждение в евро (по желание)');
assert.deepEqual(owners.workCompensationPeriods.map(x=>x.label),['на час','на ден','на месец','за задача']);

let html=owners.formPage('listing',new URLSearchParams('category='+encodeURIComponent('Работа')+'&type='+encodeURIComponent('Предлага работа')));
assert(html.includes('Предлагано възнаграждение в евро (по желание)'),'offer Work label rendered');
assert(html.includes('id="work-compensation-period"'),'Work period select rendered');
assert(html.includes('name="work_period_prototype"'),'period explicitly prototype-only');
assert(html.includes('По договаряне'),'negotiable retained');
assert(html.includes('PRODUCTION PERSISTENCE APPROVAL REQUIRED'),'technical persistence marker exists');
assert(html.includes('compatibility adapter'),'technical note states period is not persisted through adapter');
assert(!html.includes('CV')&&!html.includes('Образование')&&!html.includes('Трудов договор'),'no new Work fields added');
html=owners.formPage('listing',new URLSearchParams('category='+encodeURIComponent('Работа')+'&type='+encodeURIComponent('Търси работа')));
assert(html.includes('Желано възнаграждение в евро (по желание)'),'seek Work label rendered');
html=owners.formPage('listing',new URLSearchParams('state=edit&record=legacy-work-no-period'));
assert(html.includes('data-work-period-legacy="true"'),'legacy Work edit is explicitly exempt until compensation is touched');
assert(html.includes('value="900"'),'legacy amount remains readable/editable');

const contexts={
  'Услуги':{key:'service',label:'Цена в евро',options:['По договаряне','Цена след оглед/запитване']},
  'Електроника':{key:'goods',label:'Цена в евро',options:['По договаряне','Подарява (безплатно)']},
  'Имоти':{key:'property',label:'Цена / наем в евро',options:['По договаряне']},
  'Автомобили и МПС':{key:'vehicle',label:'Цена в евро',options:['По договаряне']},
  'Животни':{key:'animal',label:'Цена в евро',options:['По договаряне']}
};
for(const [category,expected] of Object.entries(contexts)){
  const context=owners.listingPriceContext(category);
  assert.equal(context.key,expected.key,`${category}: key unchanged`);
  assert.equal(context.label,expected.label,`${category}: label unchanged`);
  assert.deepEqual(context.options.map(x=>x.label),expected.options,`${category}: options unchanged`);
}
const start=formsSource.indexOf('  const goodsPriceCategories=');
const end=formsSource.indexOf('  function attributesFor',start);
assert(start>=0&&end>start,'approved price-context block found');
assert.equal(crypto.createHash('sha256').update(formsSource.slice(start,end)).digest('hex'),'5b023a5ca319a009aa526d71825c336ce9c0667589173f518b5a0bc05948f3ab','non-Work FORM PRICE CONTEXT block byte-identical');

const errorNode=()=>({textContent:'',classList:{contains:value=>value==='field-error'}});
const errors={price:errorNode(),period:errorNode()};
global.CSS={escape:value=>String(value)};
global.document={
  getElementById(id){return id==='listing-price-error'?errors.price:id==='work-compensation-period-error'?errors.period:null;},
  querySelector(){return null;}
};
vm.runInThisContext(validatorsSource,{filename:'prototype-validators.js'});
function control(id,value='',checked=false){return {id,value,checked,disabled:false,type:id==='price-negotiable'?'checkbox':id==='listing-price'?'number':'select',name:id,setCustomValidity(msg){this.validityMessage=msg;},setAttribute(){},removeAttribute(){},getAttribute(name){return name==='aria-describedby'?`${id}-error`:'';}};}
const price=control('listing-price','100'),period=control('work-compensation-period',''),neg=control('price-negotiable','',false),category=control('listing-category','Работа');
const fakeForm={dataset:{formKind:'listing',formMode:'create',workPeriodLegacy:'false'},querySelector(selector){return {'#listing-price':price,'#work-compensation-period':period,'#price-negotiable':neg,'#listing-category':category}[selector]||null;}};
assert.equal(global.PopitaiValidators.validateWorkCompensation(fakeForm),period,'amount without period targets period');
assert(errors.period.textContent.includes('Избери период'),'amount-without-period error is beside period');
price.value='';period.value='day';assert.equal(global.PopitaiValidators.validateWorkCompensation(fakeForm),price,'period without amount targets amount');
assert(errors.price.textContent.includes('Въведи сума'),'period-without-amount error is beside amount');
price.value='100';period.value='month';assert.equal(global.PopitaiValidators.validateWorkCompensation(fakeForm),null,'amount + period valid');
price.value='900';period.value='';fakeForm.dataset.formMode='edit';fakeForm.dataset.workPeriodLegacy='true';assert.equal(global.PopitaiValidators.validateWorkCompensation(fakeForm),null,'legacy Work edit without period remains valid until compensation is touched');
neg.checked=true;fakeForm.dataset.workPeriodLegacy='false';assert.equal(global.PopitaiValidators.validateWorkCompensation(fakeForm),null,'negotiable is valid without amount/period');

assert(interactionsSource.includes("label.textContent=category==='Работа'?formOwners.workCompensationLabel(type):context.label"),'type change updates only Work compensation label');
assert(interactionsSource.includes("if(target===neg&&neg?.checked){price.value='';if(period)period.value='';price.disabled=true;if(period)period.disabled=true"),'Work negotiable clears/disables amount and period');
assert(interactionsSource.includes("if(target===price&&price.value.trim()){if(neg)neg.checked=false"),'entering Work amount clears negotiable');
assert(interactionsSource.includes("if(target===period){if(period?.value&&neg)neg.checked=false"),'period interaction clears negotiable state');
assert(interactionsSource.includes("form.dataset.workPeriodLegacy='false'"),'editing compensation/category removes legacy exemption');
assert(!/description.*work_period|work_period.*description/i.test(interactionsSource),'period is never packed into description');

console.log('prototype Work compensation regression audit: ok');
