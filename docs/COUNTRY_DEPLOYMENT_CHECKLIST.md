# Country deployment readiness

This checklist tracks rollout of the shared Skunkworks Horizon overlay.

The Shopify Dev Dashboard currently lists the following Skunkworks country stores:

| Country | Storefront / store reference | Current status | GitHub Environment | Ready for workflow |
| --- | --- | --- | --- | --- |
| South Africa | `store.skunkworks.africa` | Active | `south-africa` | Blocked: Theme Access token + unpublished Horizon theme ID required |
| Qatar | `shop.skunkworksqatar.com` | Active | `qatar` | Blocked: store identifier + Theme Access token + theme ID |
| Nigeria | Partner dashboard store | Active | `nigeria` | Blocked: store identifier + Theme Access token + theme ID |
| Australia | `store.skunkworksau.au` | Active | `australia` | Blocked: store identifier + Theme Access token + theme ID |
| Zimbabwe | Partner dashboard store | Active | `zimbabwe` | Blocked: store identifier + Theme Access token + theme ID |
| Malawi | Partner dashboard store | In development | `malawi` | Blocked: store identifier + Theme Access token + theme ID |
| Uganda | `store.skunkworks.ug` | In development | `uganda` | Blocked: store identifier + Theme Access token + theme ID |
| USA | `store.skunkworksus.com` | In development | `usa` | Blocked: store identifier + Theme Access token + theme ID |
| Portugal | Partner dashboard store | In development | `portugal` | Blocked: store identifier + Theme Access token + theme ID |
| Angola | Partner dashboard store | In development | `angola` | Blocked: store identifier + Theme Access token + theme ID |
| Namibia | Partner dashboard store | In development | `namibia` | Blocked: store identifier + Theme Access token + theme ID |
| Cameroon | Partner dashboard store | Pending transfer | `cameroon` | Blocked: transfer completion + store identifier + Theme Access token + theme ID |

## Required GitHub Environment secrets

Create the following secrets in each country environment:

- `SHOPIFY_FLAG_STORE`
- `SHOPIFY_CLI_THEME_TOKEN`
- `SHOPIFY_THEME_ID`

## Recommended rollout order

1. South Africa — reference implementation and first end-to-end validation.
2. Qatar, Nigeria, Australia, Zimbabwe — currently active country stores.
3. Malawi, Uganda, USA, Portugal, Angola, Namibia — development stores.
4. Cameroon — only after the pending transfer is complete.

## South Africa validation gate

Before deploying to any other country:

- Confirm the unpublished Horizon integration theme ID.
- Confirm Theme Access authentication works.
- Run the workflow for `south-africa` only.
- Verify the unpublished theme preview on desktop and mobile.
- Verify navigation, search, product pages, cart, drawers, dark mode, keyboard focus, and reduced motion.
- Confirm `config/settings_data.json` was preserved.
- Do not publish during this validation.

## Global release gate

After South Africa passes:

- Run each active country individually.
- Validate local navigation, local legal/footer content, currency display, and local product availability.
- Only then use the `all` target for future overlay releases.

## Catalogue note

Theme deployment does not synchronize product catalogues, pricing, inventory, or regional product eligibility. Those remain a separate workstream.
