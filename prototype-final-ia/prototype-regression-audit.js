'use strict';

const assert=require('assert');
const fs=require('fs');
const vm=require('vm');

global.window=global;
global.location={hash:'#home'};
global.URLSearchParams=URLSearchParams;

for(const file of [
  'prototype-stage2-contracts.js',
  'prototype-core.js',
  'prototype-records.js',
  'prototype-social-card-composer.js',
  'prototype-marketplace-views.js',
  'prototype-content-views.js'
]){
  vm.runInThisContext(fs.readFileSync(`${__dirname}/${file}`,'utf8'),{filename:file});
}

const contracts=global.PopitaiStage2Contracts;
const records=global.PopitaiPrototypeRecords;
const social=global.PopitaiSocialCardComposer;

const shops=['Хранителни','Строителни','Техника','Мебели','Дрехи','Дом'];
for(const category of shops){
  const record=records.resultRecord({context:'Магазини',group:category,owner:'Shops',detailType:'shop'});
  assert.equal(record.contentType,'shop',`${category}: contentType`);
  assert.equal(record.owner,'Shops',`${category}: owner`);
  assert.equal(record.social.composition,'profile',`${category}: composition`);
  assert.equal(record.social.contentRole,'specialized',`${category}: contentRole`);
  assert.equal(record.actions.phone,true,`${category}: phone`);
  assert.equal(record.actions.correction,true,`${category}: correction`);
  assert.equal(record.actions.share,true,`${category}: share`);
}

assert(!contracts.activeServiceCanonical.includes('Авточасти'),'Авточасти must not be active for new Service');
assert(!contracts.listingSubcategories('Услуги').includes('Авточасти'),'Авточасти must not be offered by new Service select');
assert.equal(contracts.serviceCanonicalMap['Авточасти'],'Авточасти','legacy Авточасти mapping must remain');

const homeHtml=global.home();
assert(homeHtml.includes('href="#maistori"'),'Home must expose #maistori');
assert(global.services().includes('href="#maistori"'),'Services must expose #maistori');
assert.equal(typeof global.masters,'function','#maistori renderer must exist');
assert(global.masters().includes('Майстори и ремонти'),'Masters route content');
assert(homeHtml.indexOf('Въпроси от общността')>homeHtml.indexOf('Полезни статии'),'Home Q&A must follow Articles');

const themed=social.render(records.get('listing-vik').social);
assert(themed.includes('social-card-template-icon'),'Themed Social Card must render controlled icon holder');
assert(themed.includes('icons/briefcase-duotone.svg'),'Themed Social Card must use registry-backed SVG');
assert(!social.validate({...records.get('listing-vik').social,icon:'<svg onload=alert(1)>'}).ok,'arbitrary SVG/HTML icon must be rejected');

const approved=social.render(records.get('firm-repairs').social);
assert(approved.includes('social-card-approved-brand'),'Approved media must include separate brand area');
assert(approved.includes('Попитай.Лом'),'Approved media brand text');

const question=records.get('question-community');
const info=records.get('info-health');
assert.equal(question.social.contentRole,'community','Q&A role');
assert.equal(info.social.contentRole,'verified-information','Info role');
assert.notEqual(question.social.contentRole,info.social.contentRole,'Info and Q&A roles must differ');
assert(social.render(question.social).includes('data-content-role="community"'),'Q&A rendered role');
assert(social.render(info.social).includes('data-content-role="verified-information"'),'Info rendered role');

assert.equal(contracts.serviceFamilyNames.length,9,'nine service families');
for(const familyName of contracts.serviceFamilyNames){
  const family=global.serviceFamilies.find(item=>item[0]===familyName);
  assert(family,`${familyName}: family exists`);
  const familyAdd=contracts.contextualAddUrl({context:'Услуги',group:familyName,owner:'Listings'});
  assert(familyAdd.startsWith('#service-group?'),`${familyName}: choose-first route`);
  assert(familyAdd.includes('mode=add'),`${familyName}: add mode`);
  assert(!familyAdd.startsWith('#add/listing'),`${familyName}: family must not masquerade as leaf`);
  const leaf=family[1];
  const leafAdd=contracts.contextualAddUrl({context:'Услуги',group:leaf,owner:'Listings'});
  assert(leafAdd.startsWith('#add/listing?'),`${familyName}: concrete leaf opens listing form`);
  const addPage=global.serviceGroup(new URLSearchParams(`group=${encodeURIComponent(familyName)}&mode=add`));
  assert(addPage.includes('Избери конкретна услуга'),`${familyName}: honest choose-first UI`);
}


const mastersHtml=global.masters();
for(const [heading,href] of [
  ['Местни фирми','#firmi'],
  ['Активни предложения и търсения','#obyavi'],
  ['Последни въпроси','#vaprosi']
]){
  assert(mastersHtml.includes(`<h3>${heading}</h3>`),`#maistori visible block: ${heading}`);
  assert(mastersHtml.includes(`href="${href}"`),`#maistori route for ${heading}`);
}

const currentHtml=global.current();
assert(currentHtml.includes('Местна актуализация с конкретна цел и най-важното на едно място.'),'publication wording must preserve independent purpose');
assert(!currentHtml.includes('Кратка местна актуализация'),'publication must not be defined as necessarily short');

const detailDescriptions={
  'listing-catering':'Кетъринг за семейни тържества, фирмени събития и други поводи в Лом и региона.',
  'listing-work':'Обява за работа в строителството и техническите дейности в Лом с ясно посочена област и основни условия.',
  'listing-property':'Обява за продажба на апартамент в Лом с основна информация за имота и условията.',
  'listing-auto':'Обява за автомобил или джип в Лом с основни данни за превозното средство и състоянието му.',
  'listing-animal':'Обява за животно, което търси дом в Лом, с най-важната информация за осиновяване.',
  'health-doctor':'Профил на лекар специалист в Лом с основна специалност, контакт и местна информация.'
};
for(const [id,description] of Object.entries(detailDescriptions)){
  const record=records.get(id);
  assert.equal(record.body,description,`${id}: concrete public description`);
  const html=global.detail(record.contentType,new URLSearchParams(`record=${encodeURIComponent(id)}`));
  assert(html.includes(description),`${id}: detail renders concrete public description`);
  assert(!html.includes(`${social.titleFor(record.social)} — примерна информация за Лом и региона.`),`${id}: no automatic generic fallback`);
  assert(record.qaNotes.length>0,`${id}: technical evidence retained separately`);
  for(const note of record.qaNotes){
    const escaped=global.esc(note);
    const noteIndex=html.indexOf(escaped);
    const detailsStart=html.lastIndexOf('<details class="qa-adapter">',noteIndex);
    const detailsEnd=html.indexOf('</details>',detailsStart);
    assert(noteIndex>=0&&detailsStart>=0&&detailsEnd>noteIndex,`${id}: QA note remains inside closed details`);
  }
}
assert(!global.detail('listing',new URLSearchParams('record=listing-cleaning')).includes('title fallback QA'),'QA title must not be public');

const {execFileSync}=require('child_process');
const baseSha='fa52dc8b89006b7978e266dd846786e1a858a17f';
const changed=execFileSync('git',['diff','--name-only',baseSha,'HEAD'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
const allowedChanged=new Set([
  'prototype-final-ia/prototype-content-views.js',
  'prototype-final-ia/prototype-marketplace-views.js',
  'prototype-final-ia/prototype-records.js',
  'prototype-final-ia/prototype-regression-audit.js'
]);
assert(changed.length===4,'atomic remediation must change exactly four prototype files');
assert(changed.every(path=>allowedChanged.has(path)),`unexpected changed path: ${changed.join(', ')}`);
for(const protectedPath of ['prototype-final-ia/prototype-stage2-contracts.js','prototype-final-ia/prototype-forms.js']) assert(!changed.includes(protectedPath),`${protectedPath} must remain unchanged`);
assert(!changed.some(path=>/(^|\/)(supabase|schema|migrations?|rls|rpc|content[-_ ]?master|locked)(\/|$)/i.test(path)),'no backend, Supabase, Master or LOCKED path may change');

console.log('prototype-regression-audit: PASS');
