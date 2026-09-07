import type { CardManifest } from "./types";
import { loadCards } from "./loadCards";

const modules = import.meta.glob("../../cards/*/versions/*/manifest.json", { eager: true, import: "default" });
export const cards = loadCards(Object.values(modules) as CardManifest[]);
