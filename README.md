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
- `config/settings_data.json`
- `layout/theme.liquid`

The hero implementation remains compatible with Horizon's image/video slots, custom mobile media, responsive heights, overlays, blurred reflection, section links, block layouts, entrance motion, and reduced-motion fallback. Styling is applied through the adapter CSS so the upstream section can continue to receive Shopify updates.

## Deployment policy

1. Develop on a feature branch.
2. Apply and validate against an **unpublished** Shopify theme only.
3. Review the change set and run CodeRabbit.
4. Preview/test navigation, search, product pages, cart, drawers, responsive layouts, keyboard focus, dark mode, and reduced motion.
5. Publish only after an explicit production approval step.

The Shopify MAIN theme is never a direct development write target.
