import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const cardsDir = path.join(root, "cards");
if (!fs.existsSync(cardsDir)) {
  console.error("cards directory is missing");
  process.exit(1);
}

const actual = fs.readdirSync(cardsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const errors = [];

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
  if (manifest.version !== pointer.version) errors.push(`${id}: manifest version does not match current.json`);
  for (const key of ["source"]) {
    if (!manifest[key] || !fs.existsSync(path.join(versionDir, manifest[key]))) {
      errors.push(`${id}: ${key} file is missing`);
    }
  }
  const keys = new Set();
  for (const property of manifest.properties ?? []) {
    if (keys.has(property.key)) errors.push(`${id}: duplicate property key: ${property.key}`);
    keys.add(property.key);
    if (!["text", "number", "color", "select", "boolean", "font", "image", "video"].includes(property.type)) {
      errors.push(`${id}: invalid property type: ${property.key}`);
    }
  }
  for (const slot of manifest.mediaSlots ?? []) {
    if (keys.has(slot.key)) errors.push(`${id}: duplicate media/property key: ${slot.key}`);
    keys.add(slot.key);
    if (!["image", "video"].includes(slot.type) || typeof slot.required !== "boolean") errors.push(`${id}: invalid media slot: ${slot.key}`);
  }
}

if (!actual.length) errors.push("no cards found");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`validated ${actual.length} cards`);
