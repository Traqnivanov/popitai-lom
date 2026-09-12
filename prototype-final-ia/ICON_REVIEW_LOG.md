# Попитай.Лом — ICON REVIEW LOG

Статус: **OWNER-APPROVED PROCESS / ACTIVE IN TOM SANDBOX / WORK REVIEW PENDING**  
Контрол: `POPITAI_LOM_TOM_CONTROL.md` + `prototype-final-ia/ICON_EXECUTION_CONTRACT.md`

## Цел

Този файл е компактният оперативен регистър за индивидуалните icon tasks.

**Една икона = един ред.**  
Нормалният жизнен цикъл на една икона НЕ създава отделен голям TOM decision и отделен WR запис за всяка корекция/приемане.

Същият ред се обновява до текущото състояние на иконата.

Пълен TOM decision / WR запис се прави само когато има поне едно от следните:

- ново или променено общо правило;
- нова/спорна semantic концепция, която не е вече OWNER-approved;
- изключение от `ICON_EXECUTION_CONTRACT.md`;
- конфликт между договори/accepted assets;
- RED-ZONE/LOCKED риск;
- сериозен QA/control failure;
- решение, което засяга повече от конкретната една икона.

Обикновени корекции като цвят, safe margin, crop, alpha, размер, малък технически детайл или повторен render по вече одобрена концепция се пазят в същия ред и не пораждат нов тежък control record, освен ако корекцията не променя общото правило.

## Минимален запис

| Task | Икона | Semantic concept | Current OWNER verdict | Current status | Evidence / asset | Кратка бележка |
| --- | --- | --- | --- | --- | --- | --- |
| `TOM1-T001` | Къртене и извозване | Професионален demolition hammer + счупена зидария + малко строителни отломки; без truck | `ACCEPTED` | ACCEPTED / MASTER + DERIVATIVES READY | `popitai_lom_kurtene_izvozvane_MASTER_1024.png`; `popitai_lom_kurtene_izvozvane_SITE_128.webp`; `popitai_lom_kurtene_izvozvane_SOCIAL_512.webp` | OWNER прие MASTER и двата договорени derivative assets. MASTER: exact 1024×1024 PNG RGBA, real alpha, transparent corners, no crop, dark cable/rubber preserved, no visible black/white halo. SITE: exact 128×128 WebP RGBA/alpha. SOCIAL: exact 512×512 WebP RGBA/alpha. Няма 256 px или друг междинен размер; няма нов render/redesign. |
| `TOM1-T002` | Цялостни ремонти / Майстори и ремонти | SHARED broad-renovation asset: ясен 3D вътрешен ъгъл/част от стая в ремонт, две стени + под, с чук и бояджийски валяк; без demolition/rubble и без house/property silhouette | `ACCEPTED` | ACCEPTED / MASTER + DERIVATIVES READY | `popitai_lom_cqlostni_remonti_MASTER_1024.png`; `popitai_lom_cqlostni_remonti_SITE_128.webp`; `popitai_lom_cqlostni_remonti_SOCIAL_512.webp` | OWNER прие визуалната и семантичната посока. MASTER: exact 1024×1024 PNG RGBA, true alpha, transparent corners, no crop, occupied area 70.5% width / 75% height, safe margins 14.75% left/right and 12.5% top/bottom. По заключения pipeline са произведени без redraw exact SITE 128×128 WebP RGBA/alpha и SOCIAL 512×512 WebP RGBA/alpha; и двата минават strict technical QA. Asset-ът е SHARED за `Цялостни ремонти` и `Майстори и ремонти`. |
| `TOM1-T004` | Пране на мека мебел и килими | Професионален extractor + прозрачна extraction nozzle върху тапицирана мебел + видим килим/почистена зона; ясно пране/екстракция, не обикновено прахосмукиране | `ACCEPTED` | ACCEPTED / MASTER + DERIVATIVES READY | `popitai_lom_prane_mebel_kilimi_MASTER_1024.png`; `popitai_lom_prane_mebel_kilimi_SITE_128.webp`; `popitai_lom_prane_mebel_kilimi_SOCIAL_512.webp` | OWNER прие визуалната посока и MASTER-а. MASTER е exact 1024×1024 PNG RGBA с true alpha, transparent corners, ~75% occupied area и 12.5–12.8% safe margins. SITE 128×128 и SOCIAL 512×512 са произведени директно от accepted MASTER без redraw; и двата минават strict technical QA. |

## Правило за обновяване

След всеки реален OWNER verdict TOM обновява **същия ред**:

- `CORRECTION REQUIRED` → остава OPEN и се записва само текущата необходима корекция;
- `REJECTED` → отбелязва се rejected/current next action;
- `ACCEPTED` → статусът става ACCEPTED и се добавя точният asset/evidence reference, когато е наличен.

Не се пази дълъг дневник на всяка междинна генерация, ако тя не е дала OWNER verdict или ново контролно решение.

## Скорост срещу проследимост

Целта е да пазим отговорите на пет въпроса и нищо излишно:

1. Коя икона е това?
2. Какъв concept е разрешен?
3. Какво е последното OWNER решение?
4. Какъв е текущият статус?
5. Къде е доказателството/asset-ът?

Ако TOM установи, че дори този модел може да бъде опростен без загуба на доказуемост, се прилага `PROCESS OPTIMIZATION SIGNAL` от `POPITAI_LOM_TOM_CONTROL.md` преди промяна на процеса.
