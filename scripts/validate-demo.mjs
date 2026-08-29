import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('demo.css', 'utf8');
const js = fs.readFileSync('demo.js', 'utf8');

const failures = [];
const requireText = (source, text, message) => {
  if (!source.includes(text)) failures.push(message);
};

requireText(html, 'meta name="color-scheme" content="light dark"', 'HTML must advertise light/dark color-scheme support.');
requireText(html, 'prefers-color-scheme: light', 'HTML must provide a light browser theme-color.');
requireText(html, 'prefers-color-scheme: dark', 'HTML must provide a dark browser theme-color.');
requireText(html, 'class="skip-link"', 'HTML must keep the skip-to-content link.');
requireText(css, '--bg: #ffffff;', 'Light mode must use a white canvas token.');
requireText(css, '--fg: #000000;', 'Light mode must use a black foreground token.');
requireText(css, '@media (prefers-color-scheme: dark)', 'CSS must respond to the browser dark preference.');
requireText(css, ':focus-visible', 'CSS must retain visible keyboard focus styles.');
requireText(css, '@media (prefers-reduced-motion: reduce)', 'CSS must respect reduced-motion preferences.');
requireText(js, 'prefers-color-scheme: dark', 'JavaScript theme status must use the browser preference, not a manual toggle.');

const hexValues = [...css.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((match) => match[0].toLowerCase());
const allowedHex = new Set(['#fff', '#ffffff', '#000', '#000000']);
const invalidHex = [...new Set(hexValues.filter((value) => !allowedHex.has(value)))];
if (invalidHex.length) failures.push(`Non-monochrome hex colors found: ${invalidHex.join(', ')}`);

if (failures.length) {
  console.error('Adaptive monochrome demo validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Adaptive monochrome demo validation passed.');
console.log(`Checked ${hexValues.length} explicit hex color references; all are black or white.`);
