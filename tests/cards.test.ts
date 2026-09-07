import { describe, expect, it } from "vitest";
import { loadCards, validateCards } from "../src/cards/loadCards";

const manifests = [
  {
    id: "number-impact",
    name: "数字冲击",
    version: "1.0.0",
    description: "强调明确数字",
    defaultDuration: 2.5,
    source: "Component.jsx",
    poster: "poster.svg",
    preview: "preview.webm",
    properties: [{ key: "value", label: "数字", type: "number", defaultValue: 20 }],
    mediaSlots: [],
  },
];

describe("card registry", () => {
  it("loads valid cards in stable id order", () => {
    expect(loadCards(manifests).map((card) => card.id)).toEqual(["number-impact"]);
  });

  it("reports duplicate ids and duplicate property keys", () => {
    const duplicate = {
      ...manifests[0],
      properties: [manifests[0].properties[0], manifests[0].properties[0]],
    };
    expect(validateCards([manifests[0], duplicate])).toEqual([
      "duplicate card id: number-impact",
      "number-impact: duplicate property key: value",
    ]);
  });
});
