import { readFileSync } from "node:fs";

const allowed = new Set(["Development","Basic","Grow","Advanced","Plus"]);
const string = (value, name) => {
  if (typeof value !== "string" || !value) throw new Error(`Invalid ${name}`);
  return value;
};

export function validateRegionalStores(manifest) {
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) throw new Error("Invalid registry");
  if (!Array.isArray(manifest.stores) || manifest.stores.length === 0) throw new Error("Missing stores");
  if (manifest.autoDeployEnabled !== false) throw new Error("Automation must stay disabled until authentication and staged rollouts are verified");

  const countries = new Set(), domains = new Set();
  for (const store of manifest.stores) {
    if (!store || typeof store !== "object" || Array.isArray(store)) throw new Error("Invalid store");
    const country = string(store.country, "country");
    const identifier = string(store.shopifyIdentifier, "Shopify domain");
    const desiredDomain = string(store.desiredMyshopifyDomain, "desired Shopify domain");
    if (!/^[a-z]+$/.test(country)) throw new Error("Invalid country");
    if (countries.has(country)) throw new Error("Duplicate country: " + country);
    countries.add(country);
    if (!/^[a-z0-9-]+[.]myshopify[.]com$/.test(identifier)) throw new Error("Invalid Shopify domain");
    if (domains.has(identifier)) throw new Error("Duplicate Shopify domain");
    domains.add(identifier);
    if (desiredDomain !== `skunkworks-${country}.myshopify.com`) throw new Error("Naming standard mismatch");
    if (!allowed.has(store.plan)) throw new Error("Unknown plan: " + country);
    if (!["not_configured","staged","verified"].includes(store.themeSyncStatus)) throw new Error("Invalid sync status");
  }
  return manifest.stores.length;
}

const manifest = JSON.parse(readFileSync(new URL("../registry/regional-stores.json", import.meta.url), "utf8"));
const count = validateRegionalStores(manifest);
console.log(`Verified ${count} unique regional stores; deployments disabled safely.`);
