import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StartScreen } from "../src/components/Screens/StartScreen";

describe("StartScreen", () => {
  it("should move keyboard focus to the start button when mounted", () => {
    render(<StartScreen onStart={vi.fn()} />);

    const startButton = screen.getByRole("button", { name: /start/i });

    expect(document.activeElement).toBe(startButton);
  });
});
