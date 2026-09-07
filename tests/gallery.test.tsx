// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "../src/App";

describe("motion card gallery", () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  });
  it("shows eight manual preview buttons and no ChatCut write action", () => {
    render(<App />);
    expect(screen.getAllByRole("button", { name: "播放预览" })).toHaveLength(8);
    expect(screen.queryByText("添加到 ChatCut")).not.toBeInTheDocument();
    for (const video of document.querySelectorAll("video")) expect(video.autoplay).toBe(false);
  });

  it("plays only after the preview button is clicked", () => {
    render(<App />);
    const firstVideo = document.querySelector("video") as HTMLVideoElement;
    expect(firstVideo.controls).toBe(false);
    fireEvent.click(screen.getAllByRole("button", { name: "播放预览" })[0]);
    expect(firstVideo.controls).toBe(true);
  });
});
