import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const files = {
  landing: 'sections/skunkworks-landing.liquid',
  results: 'sections/skunkworks-search-results.liquid',
  css: 'assets/skunkworks-landing.css',
  search: 'assets/skunkworks-search.js',
  darkTheme: 'assets/skunkworks-africa-dark.css',
  header: 'sections/header.liquid',
  headerLogo: 'blocks/_header-logo.liquid',
  layout: 'layout/theme.liquid',
  settingsData: 'config/settings_data.json',
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
assert.match(source.css, /@media \(prefers-color-scheme: dark\)/);
assert.match(source.darkTheme, /@media \(prefers-color-scheme: dark\)/);
assert.match(source.layout, /<meta name="color-scheme" content="light dark">/);
assert.match(source.layout, /<meta name="theme-color" content="#070b1a" media="\(prefers-color-scheme: dark\)">/);
assert.match(source.layout, /skunkworks-africa-dark\.css[^\n]+prefers-color-scheme: dark/);
assert.match(source.landing, /"id": "theme_mode"/);
assert.match(source.landing, /"type": "color_scheme"/);
assert.match(source.landing, /swa-landing--adaptive/);
assert.match(source.landing, /color-.*section\.settings\.color_scheme/);
assert.match(source.css, /--swa-bg:\s*#ffffff/i);
assert.match(source.css, /--swa-fg:\s*#000000/i);
assert.match(source.css, /--swa-bg:\s*#000000/i);
assert.match(source.css, /--swa-fg:\s*#ffffff/i);
assert.match(source.css, /--swa-ink:\s*var\(--swa-fg\)/i);
assert.doesNotMatch(source.css, /#03033a|#1e6bd0|#f24208/i, 'Landing CSS must not restore the legacy accent palette');

const h1Count = (source.landing.match(/<h1\b/g) || []).length;
assert.equal(h1Count, 1, 'Landing section must render one H1');
assert.doesNotMatch(source.header, /<h1 class="visually-hidden">{{ shop\.name }}<\/h1>/, 'Header must not add a second homepage H1');
assert.match(source.headerLogo, /href="https:\/\/skunkworks\.africa\/"/, 'Global header logo must link to the corporate homepage');
assert.doesNotMatch(source.headerLogo, /href="https:\/\/www\.skunkworks\.africa\//, 'Header logo must avoid the redirecting www host');
assert.match(source.settingsData, /"logo":\s*"shopify:\/\/shop_images\/shopify-logo\.png"/, 'Header must use the full company wordmark');

console.log('Shopify overlay validation passed.');
console.log('Validated JSON templates, Liquid contracts, predictive-search safety, accessibility hooks, and brand tokens.');
