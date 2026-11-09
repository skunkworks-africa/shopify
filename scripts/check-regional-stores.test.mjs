import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateRegionalStores } from "./check-regional-stores.mjs";

const valid = () => JSON.parse(readFileSync(new URL("../registry/regional-stores.json", import.meta.url), "utf8"));

test("regional registry accepts the audited string identifiers", () => {
  assert.equal(validateRegionalStores(valid()), 16);
});

test("regional registry rejects array-wrapped duplicate keys", () => {
  for (const [property, value] of [["country", ["africa"]], ["shopifyIdentifier", ["xeb3ed-i7.myshopify.com"]]]) {
    const manifest = valid();
    manifest.stores[1][property] = value;
    assert.throws(() => validateRegionalStores(manifest), /Invalid/);
  }
});
