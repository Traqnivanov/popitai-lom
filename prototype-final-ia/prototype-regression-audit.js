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
  'prototype-marketplace-views.js'
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
  assert(addPage.includes('Първо избери конкретна услуга'),`${familyName}: honest choose-first UI`);
}

console.log('prototype-regression-audit: PASS');
