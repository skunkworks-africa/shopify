# Skunkworks Africa Shopify Theme

Source-controlled Skunkworks Africa commerce layer for Shopify Horizon.

## Brand contract

| Role | Token | Value |
| --- | --- | --- |
| Ink / primary text | `--swa-ink` | `#03033A` |
| Primary interaction | `--swa-blue` | `#1E6BD0` |
| Signal / focus accent | `--swa-orange` | `#F24208` |
| Canvas | `--swa-white` | `#FFFFFF` |
| Secondary surface | `--swa-off-white` | `#F7F9FC` |
| Graphite | `--swa-graphite` | `#15171A` |
| Border / steel | `--swa-steel` | `#D8DEE8` |
| Muted / slate | `--swa-slate` | `#5A6472` |

Dark surfaces use `#070B1A`, `#101A30`, `#2D3A51`, and `#F2F6FB` from the canonical Skunkworks design system.

## Typography

- Body: Open Sans
- Display/headings: Inter
- Controls: inherit the body font

## Accessibility contract

- Skunk Blue on white and white on Skunk Blue meet WCAG AA for normal text.
- Signal Orange is not paired with white normal-sized text because that combination is below 4.5:1.
- Signal Orange is used for focus, status, and brand accents; Ink Navy is used when normal text sits on orange.
- Focus-visible states use a 3px Signal Orange ring.
- `prefers-reduced-motion` is respected.

## Architecture

This repository tracks the Skunkworks-specific files layered on top of Shopify Horizon rather than vendoring upstream Horizon wholesale. The Shopify unpublished Horizon copy remains the integration target and source of upstream theme files.

Tracked overlay files:

- `assets/skunkworks-africa-theme.css`
- `assets/skunkworks-africa-dark.css`
- `config/settings_data.json`
- `layout/theme.liquid`

## Deployment policy

1. Develop on a feature branch.
2. Apply and validate against an **unpublished** Shopify theme only.
3. Review the change set and run CodeRabbit.
4. Preview/test navigation, search, product pages, cart, drawers, responsive layouts, keyboard focus, dark mode, and reduced motion.
5. Publish only after an explicit production approval step.

The Shopify MAIN theme is never a direct development write target.
