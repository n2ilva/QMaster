// Script to generate data/cards/category-tags.ts from data/cards/cards.json
// Run with: node scripts/gen-category-tags.js

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const cardsPath = path.join(root, 'data', 'cards', 'cards.json');
const outPath = path.join(root, 'data', 'cards', 'category-tags.ts');

const cards = JSON.parse(fs.readFileSync(cardsPath, 'utf8'));

const idx = {};
for (const c of cards) {
  const key = c.track + '|' + c.category;
  if (!idx[key]) idx[key] = [];
  if (Array.isArray(c.tags)) {
    for (const t of c.tags) {
      if (!idx[key].includes(t)) idx[key].push(t);
    }
  }
}

let out = "// Auto-generated from data/cards/cards.json. Do not edit manually.\n";
out += "// Regenerate with: node scripts/gen-category-tags.js\n\n";
out += "/** Maps 'track|category' to unique tags from all cards in that category. */\n";
out += "export const CATEGORY_TAGS_INDEX: Record<string, string[]> = {\n";
for (const [k, v] of Object.entries(idx)) {
  out += "  " + JSON.stringify(k) + ": " + JSON.stringify(v) + ",\n";
}
out += "};\n\n";
out += "export function getCategoryTags(track: string, category: string): string[] {\n";
out += "  return CATEGORY_TAGS_INDEX[`${track}|${category}`] ?? [];\n";
out += "}\n";

fs.writeFileSync(outPath, out, 'utf8');
console.log('Generated', Object.keys(idx).length, 'entries ->', outPath);
