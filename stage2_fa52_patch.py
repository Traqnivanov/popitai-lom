from pathlib import Path

def replace(path, old, new):
    p=Path(path)
    text=p.read_text()
    if old not in text:
        raise SystemExit(f'missing expected snippet in {path}: {old[:120]!r}')
    p.write_text(text.replace(old,new,1))

market='prototype-final-ia/prototype-marketplace-views.js'
old="""    const qa=`<details class=\"qa-adapter\"><summary>QA: структура на раздела</summary><p>Техническата проверка потвърждава, че съществуващите фирмени профили, обяви и въпроси остават при досегашните си production owners. Този presentation cleanup не променя маршрутите или договорите им.</p></details>`;\n    return `<div class=\"page\">${pageHead('Майстори и ремонти','Ремонти, ВиК, електро, покриви, дограма и други услуги за дома.','Обяви и услуги')}<div class=\"shell\"><div class=\"page-tools\"><a class=\"btn primary\" href=\"#category-subcategories\">Намери майстор</a><a class=\"btn\" href=\"#add/firm?category=Майстори%20и%20ремонти\">Добави фирма</a><a class=\"btn\" href=\"#add/question?category=Майстори%20и%20ремонти\">Задай въпрос</a></div><div id=\"category-subcategories\" class=\"grid cols-3\">${cards}</div>${qa}</div></div>`;"""
new="""    const visibleSections=`<div class=\"grid cols-3 masters-owner-summary\"><article class=\"content-card\"><h3>Местни фирми</h3><p>Разгледай местни фирми за ремонти и услуги за дома.</p><a class=\"btn soft\" href=\"#firmi\">Всички фирми</a></article><article class=\"content-card\"><h3>Активни предложения и търсения</h3><p>Виж актуални предложения за услуги и заявки от хора, които търсят изпълнител.</p><a class=\"btn soft\" href=\"#obyavi\">Всички обяви</a></article><article class=\"content-card\"><h3>Последни въпроси</h3><p>Виж въпросите на хората от Лом за майстори, ремонти и препоръки.</p><a class=\"btn soft\" href=\"#vaprosi\">Всички въпроси</a></article></div>`;\n    const qa=`<details class=\"qa-adapter\"><summary>QA: структура на раздела</summary><p>Техническата проверка потвърждава, че съществуващите фирмени профили, обяви и въпроси остават при досегашните си production owners. Този presentation cleanup не променя маршрутите или договорите им.</p></details>`;\n    return `<div class=\"page\">${pageHead('Майстори и ремонти','Ремонти, ВиК, електро, покриви, дограма и други услуги за дома.','Обяви и услуги')}<div class=\"shell\"><div class=\"page-tools\"><a class=\"btn primary\" href=\"#category-subcategories\">Намери майстор</a><a class=\"btn\" href=\"#add/firm?category=Майстори%20и%20ремонти\">Добави фирма</a><a class=\"btn\" href=\"#add/question?category=Майстори%20и%20ремонти\">Задай въпрос</a></div><div id=\"category-subcategories\" class=\"grid cols-3\">${cards}</div>${visibleSections}${qa}</div></div>`;"""
replace(market,old,new)

content='prototype-final-ia/prototype-content-views.js'
replace(content,"<p>Кратка местна актуализация с най-важното на едно място.</p>","<p>Местна актуализация с конкретна цел и най-важното на едно място.</p>")
old="""    const technicalPattern=/(protected|owner|canonical|discovery|persist|open\\s*\\/\\s*locked|production contract|backend|social card|detail|fallback|qa)/i;\n    const visibleRows=record.rows.filter(([key])=>!technicalPattern.test(key)).map(([key,value])=>`<div class=\"kv\"><strong>${esc(key==='Suggested тип'?'Тип':key)}</strong><span>${esc(value)}</span></div>`).join('');\n    const technicalRows=record.rows.filter(([key])=>technicalPattern.test(key));\n    const bodyIsTechnical=technicalPattern.test(record.body||'');\n    const publicBody=bodyIsTechnical?`${title} — примерна информация за Лом и региона.`:record.body;\n    const pageTitle=technicalPattern.test(record.pageTitle||'')?title:record.pageTitle;\n    const gallery=['listing','firm'].includes(record.contentType)?`<div class=\"gallery-demo\"><div>Основна снимка</div><div>Снимка</div><div>Снимка</div></div>`:'';\n    const rawTechnical=(bodyIsTechnical||technicalRows.length)?`<details class=\"qa-adapter\"><summary>QA: технически данни на примера</summary>${bodyIsTechnical?`<p>${esc(record.body)}</p>`:''}${technicalRows.map(([key,value])=>`<p><strong>${esc(key)}:</strong> ${esc(value)}</p>`).join('')}</details>`:'';\n    const specialIsTechnical=technicalPattern.test(record.special||'');\n    const special=record.special?(specialIsTechnical?`<details class=\"qa-adapter\"><summary>QA: допълнителна техническа бележка</summary><p>${esc(record.special)}</p></details>`:`<div class=\"notice\">${esc(record.special)}</div>`):record.contentType==='info'?'<div class=\"notice ok\">Всеки реален Info Lom запис показва източник и дата на последна проверка.</div>':'';"""
new="""    const technicalRowKeys=new Set(['Canonical подкатегория']);\n    const visibleRows=record.rows.filter(([key])=>!technicalRowKeys.has(key)).map(([key,value])=>`<div class=\"kv\"><strong>${esc(key==='Suggested тип'?'Тип':key)}</strong><span>${esc(value)}</span></div>`).join('');\n    const technicalRows=record.rows.filter(([key])=>technicalRowKeys.has(key));\n    const publicBody=record.body;\n    const pageTitle=record.pageTitle;\n    const gallery=['listing','firm'].includes(record.contentType)?`<div class=\"gallery-demo\"><div>Основна снимка</div><div>Снимка</div><div>Снимка</div></div>`:'';\n    const qaNotes=Array.isArray(record.qaNotes)?record.qaNotes:[];\n    const rawTechnical=(qaNotes.length||technicalRows.length)?`<details class=\"qa-adapter\"><summary>QA: технически данни на примера</summary>${qaNotes.map(note=>`<p>${esc(note)}</p>`).join('')}${technicalRows.map(([key,value])=>`<p><strong>${esc(key)}:</strong> ${esc(value)}</p>`).join('')}</details>`:'';\n    const special=record.special?`<div class=\"notice\">${esc(record.special)}</div>`:record.contentType==='info'?'<div class=\"notice ok\">Всеки реален Info Lom запис показва източник и дата на последна проверка.</div>':'';"""
replace(content,old,new)

records='prototype-final-ia/prototype-records.js'
replace(records,"      special:spec.special||'',\n      addContext:addContext?Object.freeze({...addContext}):null,","      special:spec.special||'',\n      qaNotes:Object.freeze(spec.qaNotes||[]),\n      addContext:addContext?Object.freeze({...addContext}):null,")
replacements={
"body:'Примерна услуга, която пази exact discovery „Кетъринг“, докато compatibility adapter показва текущата canonical подкатегория.',":"body:'Кетъринг за семейни тържества, фирмени събития и други поводи в Лом и региона.',\n      qaNotes:['Избраният контекст „Кетъринг“ се запазва по пътя, а compatibility mapping-ът остава отделна техническа проверка.'],",
"pageTitle:'Почистване — title fallback QA',heading:'',\n      body:'Този запис умишлено няма собствено заглавие. Реалният render route трябва да покаже „Почистване в Лом“ и в detail, и в Social Card.',":"pageTitle:'Почистване — примерен резултат',heading:'',\n      body:'Почистване на домове и малки обекти в Лом и региона.',\n      qaNotes:['Записът е без собствено title, за да се проверява fallback заглавието „Почистване в Лом“ в detail и Social Card.'],",
"body:'Примерната обява пази избраната работна област до detail и формата.',":"body:'Обява за работа в строителството и техническите дейности в Лом с ясно посочена област и основни условия.',\n      qaNotes:['Избраната работна област се запазва до detail и формата.'],",
"body:'Намерението и видът имот се запазват до detail и contextual Add.',":"body:'Обява за продажба на апартамент в Лом с основна информация за имота и условията.',\n      qaNotes:['Намерението и видът имот се запазват до detail и contextual Add.'],",
"body:'Точният discovery избор остава видим до detail и формата.',":"body:'Обява за автомобил или джип в Лом с основни данни за превозното средство и състоянието му.',\n      qaNotes:['Точният discovery избор остава видим до detail и формата.'],",
"body:'Discovery „Осиновяване / търси дом“ остава видим, без да се представя като нова persisted подкатегория.',":"body:'Обява за животно, което търси дом в Лом, с най-важната информация за осиновяване.',\n      qaNotes:['Discovery „Осиновяване / търси дом“ остава видим, без да се представя като нова persisted подкатегория.'],",
"body:'Production submission contract позволява лекар/медицинска практика, стоматолог/дентална практика или ветеринар/кабинет. Общ backend тип „здравна услуга“ не се обещава.',":"body:'Профил на лекар специалист в Лом с основна специалност, контакт и местна информация.',\n      qaNotes:['Submission contract-ът поддържа лекар/медицинска практика, стоматолог/дентална практика и ветеринар/кабинет; по-широката „здравна услуга“ остава отделна OPEN тема.'],"
}
for a,b in replacements.items(): replace(records,a,b)

audit='prototype-final-ia/prototype-regression-audit.js'
replace(audit,"  'prototype-marketplace-views.js'\n]){","  'prototype-marketplace-views.js',\n  'prototype-content-views.js'\n]){")
replace(audit,"assert(addPage.includes('Първо избери конкретна услуга'),`${familyName}: honest choose-first UI`);","assert(addPage.includes('Избери конкретна услуга'),`${familyName}: honest choose-first UI`);")
marker="\nconsole.log('prototype-regression-audit: PASS');\n"
extra=r'''
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
'''
p=Path(audit)
text=p.read_text()
if marker not in text: raise SystemExit('audit marker missing')
p.write_text(text.replace(marker,'\n'+extra+marker,1))
