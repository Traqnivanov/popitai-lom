# Попитай.Лом — POST-MARKETPLACE REGRESSION

Статус: ACTIVE / READ-ONLY FIRST
Дата: 30.08.2026

Цел: след Marketplace V3 PRODUCTION PASS да се провери целият публичен сайт за regressions, несъответствия между раздели и остатъци от старата IA, без връщане назад и без промяна на LOCKED backend логика.

Приоритет на проверката:
1. canonical shell + 41 public pages;
2. navigation semantics и old `categories` остатъци;
3. основни форми и CTA owners;
4. Firms / Listings / Shops / Info Lom special owners;
5. различия между категории/раздели, които може да са пропуск, а не умишлена разлика;
6. desktop/mobile production verification;
7. безопасните presentation дефекти се поправят автономно; protected/risky/new business decision се спира преди промяна.

Първа потвърдена находка: `public-shell-manifest-v1.json` още съдържа legacy semantic key `categories`, въпреки че top-level `Категории` вече е премахнат от Marketplace V3. Production output е правилен само защото generator-ът временно мапва `categories` към `Обяви и услуги`. Следва да се премахне legacy semantic key от manifest/generator и да се добави regression guard, без промяна на live navigation output.
