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
| `TOM1-T001` | Къртене и извозване | Професионален demolition hammer + счупена зидария + малко строителни отломки; без truck | `CORRECTION REQUIRED` | OPEN / correction cycle | първи candidate предоставен в chat; final asset още няма | Концепцията е запазена. Нужно: exact 1024×1024 PNG, true alpha transparency, повтарящ се dark-blue/gold brand language; първият candidate е 1536×1536 RGB без alpha и с доминиращо жълто. |

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
