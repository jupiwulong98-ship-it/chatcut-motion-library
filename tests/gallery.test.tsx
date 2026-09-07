// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../src/App";

describe("motion card gallery", () => {
  it("shows eight manual preview buttons and no ChatCut write action", () => {
    render(<App />);
    expect(screen.getAllByRole("button", { name: "播放预览" })).toHaveLength(8);
    expect(screen.queryByText("添加到 ChatCut")).not.toBeInTheDocument();
    expect(document.querySelectorAll("video")).toHaveLength(0);
  });

  it("plays only after the preview button is clicked", () => {
    render(<App />);
    const firstPreview = screen.getAllByTestId("card-preview")[0];
    expect(firstPreview).toHaveAttribute("data-playing", "false");
    fireEvent.click(screen.getAllByRole("button", { name: "播放预览" })[0]);
    expect(firstPreview).toHaveAttribute("data-playing", "true");
  });
});
