import type { CardManifest } from "./types";

export function validateCards(cards: CardManifest[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const card of cards) {
    if (ids.has(card.id)) errors.push(`duplicate card id: ${card.id}`);
    ids.add(card.id);

    const keys = new Set<string>();
    for (const property of card.properties) {
      if (keys.has(property.key)) errors.push(`${card.id}: duplicate property key: ${property.key}`);
      keys.add(property.key);
    }
  }

  return errors;
}

export function loadCards(input: unknown[]): CardManifest[] {
  const cards = input as CardManifest[];
  const errors = validateCards(cards);
  if (errors.length) throw new Error(errors.join("\n"));
  return cards.slice().sort((a, b) => a.id.localeCompare(b.id));
}
