# Public IA Stage 4 contextual recovery — owner decisions

Date: 2026-08-30
Status: **APPROVED OWNER DECISIONS**

These decisions resolve the two owner-held items in `PUBLIC_IA_STAGE4_CONTEXTUAL_RECOVERY_MATRIX.md`.

## Decision 1 — repair taxonomy label

Approved: **1A — keep `Боядисване`**.

- `Боядисване` remains the exact canonical Stage 1 listing subcategory.
- Do not rename stored taxonomy to `Боядисване и шпакловка`.
- Existing backend validation, dictionary values and matching remain unchanged.

## Decision 2 — `Предложи услуга` prefill semantics

Approved: **2A — prefill category + exact subcategory only; do not preselect a listing type**.

For the visible action `Предложи услуга`:

- open the existing `dobavi-obqva.html` form;
- prefill `category=Услуги`;
- prefill the exact canonical `subcategory` from the thematic context;
- leave the existing `listing_type` choice to the user;
- do not invent a new listing type;
- do not change backend category/type validation.

For `Търся изпълнител` / `Търся услуга`, the already-valid existing type `Търси` may be prefilled together with the same canonical category/subcategory context.

## Remaining held item

`Добави събитие` remains absent unless a real approved public event submission/moderation owner is positively proven or separately approved. This does not block the rest of contextual recovery.
