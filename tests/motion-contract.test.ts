import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ids = fs.readdirSync(path.resolve("cards"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

describe("ChatCut motion card contract", () => {
  it("contains the established cards and the complete V3 benchmark set", () => {
    expect(ids).toHaveLength(20);
    expect(ids).toEqual(expect.arrayContaining([
      "tool-demo-scene", "result-compare", "tag-list",
      "category-card-scene", "chapter-neon-title", "proof-split-scene",
      "screen-pip-scene", "process-map-scene", "result-gallery-scene",
    ]));
  });

  it.each(ids)("%s uses the inline ChatCut JSX contract", (id) => {
    const pointer = JSON.parse(fs.readFileSync(path.resolve("cards", id, "current.json"), "utf8"));
    const source = fs.readFileSync(path.resolve("cards", id, `versions/${pointer.version}/Component.jsx`), "utf8");
    expect(source).toContain("const Component");
    expect(source).toContain("item.props");
    expect(source).not.toMatch(/^\s*import\s/m);
    expect(source).not.toContain("export default");
    expect(source).not.toMatch(/p\.[A-Za-z0-9_]+\s*(?:\|\||\?\?)\s*["'\d]/);
  });
});
