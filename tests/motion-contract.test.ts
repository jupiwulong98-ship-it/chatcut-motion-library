import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ids = [
  "keyword-impact",
  "logo-wall",
  "number-impact",
  "tag-list",
  "screen-focus-callout",
  "template-wall",
  "result-compare",
  "broll-takeover",
];

describe("ChatCut motion card contract", () => {
  it("contains exactly the eight approved cards", () => {
    const actual = fs.readdirSync(path.resolve("cards"), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
    expect(actual).toEqual(ids.slice().sort());
  });

  it.each(ids)("%s uses the inline ChatCut JSX contract", (id) => {
    const source = fs.readFileSync(path.resolve("cards", id, "versions/1.0.0/Component.jsx"), "utf8");
    expect(source).toContain("const Component");
    expect(source).toContain("item.props");
    expect(source).not.toMatch(/^\s*import\s/m);
    expect(source).not.toContain("export default");
  });
});
