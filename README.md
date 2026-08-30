# Skunkworks Africa Shopify Theme

Source-controlled Skunkworks Africa commerce layer for Shopify Horizon.

## Canonical design contract

The visual source of truth is [skunkworks-africa/www](https://github.com/skunkworks-africa/www). The Shopify overlay follows the same adaptive monochrome system.

| Role | Light mode | Dark mode |
| --- | --- | --- |
| Page canvas | `#FFFFFF` | `#000000` |
| Page text | `#000000` | `#FFFFFF` |
| Muted text | `rgb(0 0 0 / 66%)` | `rgb(255 255 255 / 72%)` |
| Divider | `rgb(0 0 0 / 16%)` | `rgb(255 255 255 / 18%)` |
| Header/footer shell | `#000000` | `#FFFFFF` |
| Shell text | `#FFFFFF` | `#000000` |
| Radius | `12px–20px` | `12px–20px` |

## Typography

- Body, headings, controls: Inter with Segoe UI/Roboto/system fallbacks
- Display headings: tightly tracked, balanced, responsive
- Body copy: 1.6 line-height and readable measure

## Accessibility contract

- Black/white foreground pairs provide maximum contrast.
- Keyboard focus uses a visible 3px current-color outline.
- Hero media and content remain visible without JavaScript.
- `prefers-reduced-motion` is respected.
- Theme Editor media, overlay, mobile art direction, and block controls remain upstream Horizon responsibilities.

## Architecture

This repository tracks Skunkworks-specific files layered on top of Shopify Horizon rather than vendoring upstream Horizon wholesale. The Shopify unpublished Horizon copy remains the integration target and source of upstream theme files.

Tracked overlay files:

- `assets/skunkworks-africa-theme.css`
- `assets/skunkworks-africa-dark.css`
- `assets/skunkworks-landing.css`
- `assets/skunkworks-search.js`
- `config/settings_data.json`
- `layout/theme.liquid`
- `blocks/text.liquid`
- `sections/skunkworks-landing.liquid`
- `sections/skunkworks-search-results.liquid`
- `sections/header.liquid` (removes Horizon's duplicate hidden homepage H1)
- `blocks/_header-logo.liquid` (routes the global logo to the corporate homepage)
- `templates/index.json`
- `templates/search.json`

The repository is intentionally an overlay, not a complete Horizon checkout. Run
`scripts/validate-shopify-overlay.mjs` for repository-level validation and run
Shopify Theme Check against the complete unpublished Horizon theme before publication.

The hero implementation remains compatible with Horizon's image/video slots, custom mobile media, responsive heights, overlays, blurred reflection, section links, block layouts, entrance motion, and reduced-motion fallback. Styling uses Shopify's semantic `--color-*` variables so Theme Editor scheme changes remain live and upstream Horizon sections can continue to receive updates.

Text blocks inherit the parent section/group scheme by default. Merchants may opt into a block-specific Shopify colour scheme or a fixed background. Adaptive backgrounds use a tint of `--color-foreground-rgb`, preserving contrast in light, dark, and custom schemes.

## Deployment policy

1. Develop on a feature branch.
2. Apply and validate against an **unpublished** Shopify theme only.
3. Review the change set and run CodeRabbit.
4. Preview/test navigation, search, product pages, cart, drawers, responsive layouts, keyboard focus, dark mode, and reduced motion.
5. Publish only after an explicit production approval step.

The Shopify MAIN theme is never a direct development write target.
