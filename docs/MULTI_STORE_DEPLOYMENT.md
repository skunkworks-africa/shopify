# Multi-store Horizon deployment

This repository is the Skunkworks Africa overlay for Shopify Horizon. The overlay is intentionally incomplete and must be applied to a complete unpublished Horizon theme in each target store.

## Deployment model

- `main` remains the canonical Skunkworks overlay.
- Country stores use protected GitHub Environments.
- The deployment workflow pulls each store's unpublished Horizon integration theme, overlays the tracked Skunkworks files, validates the result, and pushes back to that same unpublished theme.
- The workflow never publishes the live theme.
- `config/settings_data.json` is excluded by default so country-specific Theme Editor settings are preserved.

## GitHub Environments

Create these environments:

- south-africa
- qatar
- nigeria
- australia
- zimbabwe
- malawi
- uganda
- usa
- portugal
- angola
- namibia
- cameroon

Each environment needs these secrets:

- `SHOPIFY_FLAG_STORE` — the store's `.myshopify.com` domain or Shopify CLI-compatible store identifier.
- `SHOPIFY_CLI_THEME_TOKEN` — Theme Access password or supported Admin API token.
- `SHOPIFY_THEME_ID` — ID or exact name of the unpublished Horizon integration theme for that store.

Use environment protection rules where appropriate so production-facing deployments require approval.

## Running a deployment

Run **Deploy Horizon overlay to country stores** from GitHub Actions.

Choose one target country or `all`.

Leave **sync_settings_data** disabled for normal deployments. Enable it only when intentionally replacing Theme Editor settings across stores.

## Safety controls

- No automatic publishing.
- No direct write to the Shopify MAIN theme.
- `--nodelete` prevents the incomplete overlay repo from deleting upstream Horizon files.
- `--strict` requires Shopify Theme Check to pass before push.
- The overlay validation workflow still runs independently on pull requests and feature branches.

## Catalogue synchronization

Theme deployment and catalogue synchronization are separate concerns.

The existing `skunkworks-africa/skunkworks-africa-sync` repository currently imports Axiz product data into a single Shopify store. It should be modernized separately before it is used as the global product synchronization layer.
