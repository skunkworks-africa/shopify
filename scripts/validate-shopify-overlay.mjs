import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const files = {
  landing: 'sections/skunkworks-landing.liquid',
  results: 'sections/skunkworks-search-results.liquid',
  css: 'assets/skunkworks-landing.css',
  search: 'assets/skunkworks-search.js',
  header: 'sections/header.liquid',
  index: 'templates/index.json',
  searchTemplate: 'templates/search.json'
};

const source = Object.fromEntries(
  await Promise.all(Object.entries(files).map(async ([key, path]) => [key, await readFile(path, 'utf8')]))
);

const index = JSON.parse(source.index);
const searchTemplate = JSON.parse(source.searchTemplate);
assert.equal(index.sections.skunkworks_landing.type, 'skunkworks-landing');
assert.equal(searchTemplate.sections.skunkworks_search.type, 'skunkworks-search-results');

for (const [key, value] of Object.entries(source)) {
  assert.doesNotMatch(value, /shpat_|shpca_|x-shopify-access-token|admin[_-]?api[_-]?token/i, `${key} must not contain Shopify credentials`);
}

assert.match(source.landing, /{% schema %}/);
assert.match(source.landing, /form 'customer'/);
assert.match(source.landing, /action="{{ routes\.search_url }}"/);
assert.match(source.landing, /name="type" value="product,page,article"/);
assert.match(source.results, /paginate search\.results by section\.settings\.results_per_page/);
assert.match(source.results, /result\.object_type == 'product'/);
assert.match(source.search, /search\/suggest\.json/);
assert.match(source.search, /AbortController/);
assert.match(source.search, /aria-activedescendant/);
assert.match(source.search, /event\.key === 'Escape'/);
assert.doesNotMatch(source.search, /\.innerHTML\s*=/, 'Predictive search must not inject HTML');
assert.match(source.css, /prefers-reduced-motion/);
assert.match(source.css, /--swa-ink:\s*#03033a/i);
assert.match(source.css, /--swa-blue:\s*#1e6bd0/i);
assert.match(source.css, /--swa-orange:\s*#f24208/i);

const h1Count = (source.landing.match(/<h1\b/g) || []).length;
assert.equal(h1Count, 1, 'Landing section must render one H1');
assert.doesNotMatch(source.header, /<h1 class="visually-hidden">{{ shop\.name }}<\/h1>/, 'Header must not add a second homepage H1');

console.log('Shopify overlay validation passed.');
console.log('Validated JSON templates, Liquid contracts, predictive-search safety, accessibility hooks, and brand tokens.');
