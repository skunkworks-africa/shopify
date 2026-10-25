import { readFileSync } from "node:fs";
const manifest = JSON.parse(readFileSync(new URL("../config/regional-stores.json", import.meta.url),"utf8"));
const allowed = new Set(["Development","Basic","Grow","Advanced","Plus"]);
if (!Array.isArray(manifest.stores) || manifest.stores.length===0) throw new Error("Missing stores");
const countries = new Set(), domains = new Set();
for (const store of manifest.stores) {
  if (!/^[a-z]+$/.test(store.country)) throw new Error("Invalid country");
  if (countries.has(store.country)) throw new Error("Duplicate country: "+store.country);
  countries.add(store.country);
  if (!/^[a-z0-9-]+[.]myshopify[.]com$/.test(store.shopifyIdentifier)) throw new Error("Invalid Shopify domain");
  if (domains.has(store.shopifyIdentifier)) throw new Error("Duplicate Shopify domain");
  domains.add(store.shopifyIdentifier);
  if (store.desiredMyshopifyDomain !== `skunkworks-${store.country}.myshopify.com`) throw new Error("Naming standard mismatch");
  if (!allowed.has(store.plan)) throw new Error("Unknown plan: "+store.country);
  if (store.themeSyncStatus !== "not_configured" && store.themeSyncStatus !== "staged" && store.themeSyncStatus !== "verified") throw new Error("Invalid sync status");
}
if (manifest.autoDeployEnabled !== false) throw new Error("Automation must stay disabled until authentication and staged rollouts are verified");
console.log(`Verified ${manifest.stores.length} unique regional stores; deployments disabled safely.`);
