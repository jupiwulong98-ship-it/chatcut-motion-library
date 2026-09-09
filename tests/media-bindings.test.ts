import { describe, expect, it } from "vitest";
import { cardProps, chatcutProperties } from "../src/cards/bindings";
import manifest from "../cards/tool-demo-scene/versions/1.0.0/manifest.json";
import type { CardManifest } from "../src/cards/types";

const card = manifest as CardManifest;
describe("native media bindings", () => {
  it("turns semantic media slots into native typed properties with empty defaults", () => {
    const schema = chatcutProperties(card);
    expect(schema.filter(p => p.type === "video").map(p => p.key)).toEqual(["screenVideo", "presenterVideo"]);
    expect(schema.find(p => p.key === "logoImage")).toMatchObject({ type: "image", defaultValue: "" });
    expect(new Set(schema.map(p => p.key)).size).toBe(schema.length);
    expect(card.mediaSlots.every(p => p.required)).toBe(true);
  });
  it("keeps all gallery media slots empty and preserves template defaults", () => {
    expect(cardProps(card)).toMatchObject({
      screenVideo: "", presenterVideo: "", logoImage: "", label1: "在线用",
    });
  });
});
