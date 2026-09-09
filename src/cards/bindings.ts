import type { CardManifest, CardProperty } from "./types";

// ChatCut accepts image/video editable properties rather than a mediaSlots argument.
export function chatcutProperties(card: CardManifest): CardProperty[] {
  return [...card.properties, ...card.mediaSlots.map(slot => ({
    key: slot.key, label: slot.label, type: slot.type, defaultValue: "",
  }))];
}
// The gallery always previews the generic template with empty media slots.
export function cardProps(card: CardManifest) {
  return Object.fromEntries(chatcutProperties(card).map(p => [p.key, p.defaultValue]));
}
