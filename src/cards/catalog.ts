import type { CardManifest } from "./types";
import { loadCards } from "./loadCards";

const manifests = import.meta.glob("../../cards/*/versions/*/manifest.json", { eager: true, import: "default" });
const pointers = import.meta.glob("../../cards/*/current.json", { eager: true, import: "default" }) as Record<string, { version: string }>;

const currentCards = Object.entries(manifests).flatMap(([path, manifest]) => {
  const match = path.match(/cards\/([^/]+)\/versions\/([^/]+)\/manifest\.json$/);
  if (!match) return [];
  const [, id, version] = match;
  const pointer = pointers[`../../cards/${id}/current.json`];
  return pointer?.version === version ? [manifest as CardManifest] : [];
});

export const cards = loadCards(currentCards);
