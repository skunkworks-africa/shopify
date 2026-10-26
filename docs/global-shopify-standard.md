# Global Shopify standardization and staged theme synchronization

Status: **audit complete / production synchronization NOT enabled** (2026-10-25).

## Authority and separation

- `shopify.skunkworks.africa` documents the Shopify master.
- `skunkworks-africa/shopify` is currently an **overlay** on Shopify Horizon, not a complete standalone theme.
- `theme.skunkworks.africa` handles non-Shopify corporate sites. It is **not** the Shopify deployment source.
- `admin.skunkworks.africa` is the intended private management surface; it is not currently provisioning Shopify access in this repository.

## Store audit

`config/regional-stores.json` captures the 16 Shopify-connected countries, their Shopify **account identifiers** (which can differ from publicly visible primary domains), live theme families and proposed consistent naming. Existing `myshopify.com` identifiers must remain recorded even after an alias or store URL changes.

`desiredMyshopifyDomain` is a **target**, not a domain reserved or confirmed available. Shopify allows limited manual changes to `myshopify.com` names via Admin > Settings > Domains; Shopify explicitly limits changing names on development stores (see docs). Existing development-store IDs must not be assumed renameable. Existing externally-facing custom domains should remain primary.

Relevant docs:
- https://help.shopify.com/en/manual/intro-to-shopify/initial-setup/setup-business-settings
- https://help.shopify.com/en/manual/domains/domain-type/change-primary-domain
- https://shopify.dev/docs/storefronts/themes/tools/theme-access
- https://shopify.dev/docs/api/shopify-cli/theme/theme-push

## Production rollout gates

1. **Master source:** make a complete and valid, licensed Horizon-based Shopify theme artifact. The current repository overlay cannot be installed directly into fresh stores, and its `config/settings_data.json` contains store-specific state.
2. **Country overrides:** isolate locale, translations, homepage content, menus, policies, images, payment and pricing settings. Never overwrite regional merchants' settings or Shopify transactional records in theme deployments.
3. **Authorization:** install Shopify Theme Access on each store and provision a unique theme token. Store tokens in encrypted GitHub Actions secrets or a vault; never place tokens or merchant data in this public repository.
4. **Unpublished staging:** create a verified, full base theme per store and apply the overlay to the unpublished theme. In particular Qatar's live Flora theme, and Malawi/USA custom `liquid/main` builds, need explicit migration tests before adopting Horizon.
5. **Tests:** run Shopify Theme Check, mobile and desktop smoke checks, keyboard navigation, language and search checks, cart and checkout readiness, analytics, and post-deployment visual checks.
6. **Safe global automation:** only after authentication, preview QA, rollback snapshots, and regional config separation have all passed, enable per-region staging fanout on new master commits, then publish via a separate controlled release workflow.
7. **Audit:** log theme versions, domain identifiers, the deployment SHA, test results, and rollback target for every store.

The registry's `autoDeployEnabled=false` is intentional: the repository currently cannot safely sync to all live themes, and the ChatGPT Shopify connector does not permit publishing live themes. No live themes or store domains should be changed by this PR.
