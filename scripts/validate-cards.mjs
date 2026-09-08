import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const cardsDir = path.join(root, "cards");
const expected = [
  "broll-takeover",
  "keyword-impact",
  "logo-wall",
  "number-impact",
  "result-compare",
  "screen-focus-callout",
  "tag-list",
  "template-wall",
];

if (!fs.existsSync(cardsDir)) {
  console.error("cards directory is missing");
  process.exit(1);
}

const actual = fs.readdirSync(cardsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const errors = [];
if (JSON.stringify(actual) !== JSON.stringify(expected)) {
  errors.push(`expected exactly 8 card ids, got: ${actual.join(", ") || "none"}`);
}

for (const id of actual) {
  const pointerFile = path.join(cardsDir, id, "current.json");
  if (!fs.existsSync(pointerFile)) {
    errors.push(`${id}: current.json is missing`);
    continue;
  }
  const pointer = JSON.parse(fs.readFileSync(pointerFile, "utf8"));
  const versionDir = path.join(cardsDir, id, "versions", pointer.version);
  const manifestFile = path.join(versionDir, "manifest.json");
  if (!fs.existsSync(manifestFile)) {
    errors.push(`${id}: manifest for ${pointer.version} is missing`);
    continue;
  }
  const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
  if (manifest.id !== id) errors.push(`${id}: manifest id mismatch`);
  for (const key of ["source"]) {
    if (!manifest[key] || !fs.existsSync(path.join(versionDir, manifest[key]))) {
      errors.push(`${id}: ${key} file is missing`);
    }
  }
  const keys = new Set();
  for (const property of manifest.properties ?? []) {
    if (keys.has(property.key)) errors.push(`${id}: duplicate property key: ${property.key}`);
    keys.add(property.key);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`validated ${actual.length} cards`);
