# Попитай.Лом — exact inventory proposal — Дюнер Lab — 17.09.2026

Статус: **INTERIM PROPOSAL / WORK REVIEW PENDING / NO RECORD WRITE / NO RUNTIME OR PRODUCTION PERMISSION**

Контрол: `POPITAI_LOM_WORK_REVIEW_QUEUE.md` → `INTERIM-T006`.
Основа: `POPITAI_LOM_DINING_DIRECT_VERIFICATION_20260917.md` + действащ `content-inventory/schema.v1.json`.

## 1. Цел

Този документ предлага точния V1 inventory shape за `Дюнер Lab`, без да променя `content-inventory/records.v1.json`.

Причина за proposal-only режим: има силен first-party source за identity/address, но current hours са в конфликт със secondary Maps signal и current operational status/duplicate mapping още не са затворени.

## 2. Предложен canonical mapping

- `id`: `dining-doner-lab`
- `entity_type`: `dining`
- `public_name`: `Дюнер Lab`
- `canonical_owner.system`: `firms`
- `canonical_owner.collection`: `businesses`
- `canonical_owner.category`: `Заведения`
- `canonical_owner.canonical_record_id`: `null` до duplicate check срещу реалните Firms records

Това следва текущия V1 ownership contract за dining и не създава нов owner/schema.

## 3. Evidence classification

Предложение:

- `evidence_status`: `candidate_unverified`
- `publication_readiness`: `research_only`
- `owner_confirmed`: `false`

Причина: first-party site доказва конкретни полета, но record-level current operational status и duplicate/canonical mapping остават OPEN. Не се повишава целият record до public-ready само защото няколко полета са official.

## 4. Полета

### `address`

- value: `гр. Лом, ул. Дунавска 22`
- status: `official`
- source: `doner-lab-site`

Официалният собствен сайт идентифицира обекта като `Doner Lab • Лом` и публикува адреса.

### `hours`

- status: `conflict`
- first-party value: `Понеделник–Петък 11:00–18:00; Събота и Неделя затворено`
- secondary current signal: различни делнични часове, приблизително `09:30–15:30`
- sources: `doner-lab-site`, `doner-lab-maps-signal`

Не се избира автоматично нито едната стойност като доказано current truth. First-party value се запазва като first-party evidence, а конфликтът остава видим до currentness verification.

Не се предлага телефон, защото в текущия bounded evidence package няма достатъчно надежден direct телефонен source.

## 5. Source proposal

### `doner-lab-site`

- type: `official_site`
- url: `https://www.doner-lab.com/`
- checked_at: `2026-09-17`
- note: собствен сайт, идентифициращ Doner Lab в Лом; публикува адрес и работно време.

### `doner-lab-maps-signal`

- type: `secondary`
- checked_at: `2026-09-17`
- note: current Maps/business signal за същия адрес, но с различни делнични часове; използва се само за conflict/currentness signal, не като official field source.

## 6. Open fields / gates

Предложени `open_fields`:

- `current_active_status`
- `current_hours_resolution`
- `official_phone`
- `canonical_production_record_id`
- `duplicate_check`
- `claim_status`
- `approved_media`
- `last_verified_policy`

## 7. Prototype / production boundary

Предложение:

- `prototype.eligible`: `false`
- `prototype.selected`: `false`
- purpose: `Research only until current activity/hours conflict and duplicate mapping are explicitly resolved.`

Production:

- `production.write_allowed`: `false`
- gate: `Current activity verification + hours conflict resolution + duplicate check against existing Firms records + OWNER approval + Firms migration row.`

## 8. Proposed V1 record shape — NOT TO BE WRITTEN YET

```json
{
  "id": "dining-doner-lab",
  "entity_type": "dining",
  "public_name": "Дюнер Lab",
  "canonical_owner": {
    "system": "firms",
    "collection": "businesses",
    "category": "Заведения",
    "canonical_record_id": null
  },
  "evidence_status": "candidate_unverified",
  "publication_readiness": "research_only",
  "owner_confirmed": false,
  "fields": {
    "address": {
      "value": "гр. Лом, ул. Дунавска 22",
      "status": "official",
      "source_ids": ["doner-lab-site"]
    },
    "hours": {
      "value": {
        "official_site": "Понеделник–Петък 11:00–18:00; Събота и Неделя затворено",
        "secondary_current_signal": "делнични дни приблизително 09:30–15:30"
      },
      "status": "conflict",
      "source_ids": ["doner-lab-site", "doner-lab-maps-signal"],
      "note": "First-party and current secondary hours conflict; no silent reconciliation."
    }
  },
  "sources": [
    {
      "id": "doner-lab-site",
      "type": "official_site",
      "url": "https://www.doner-lab.com/",
      "checked_at": "2026-09-17",
      "note": "Own site identifying Doner Lab in Lom; source for address and published hours."
    },
    {
      "id": "doner-lab-maps-signal",
      "type": "secondary",
      "checked_at": "2026-09-17",
      "note": "Current Maps/business signal at the same address with conflicting weekday hours; activity/conflict evidence only."
    }
  ],
  "open_fields": [
    "current_active_status",
    "current_hours_resolution",
    "official_phone",
    "canonical_production_record_id",
    "duplicate_check",
    "claim_status",
    "approved_media",
    "last_verified_policy"
  ],
  "prototype": {
    "eligible": false,
    "selected": false,
    "purpose": "Research only until current activity/hours conflict and duplicate mapping are explicitly resolved."
  },
  "production": {
    "write_allowed": false,
    "gate": "Current activity verification + hours conflict resolution + duplicate check against existing Firms records + OWNER approval + Firms migration row."
  }
}
```

## 9. T006 verdict

**PROPOSAL COMPLETE / NO MACHINE-READABLE WRITE.**

Следващата задача не трябва да е import. Следва кратък audit на proposal-а срещу V1 validator rules + existing `records.v1.json` за ID/identity/duplicate collision. Само ако този audit мине и няма нов OWNER decision gap, може да се предложи отделна T007 write/no-write стъпка.
