import { beforeEach, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "../src/components/Common/ErrorBoundary";
import { useI18nStore } from "../src/store/useI18nStore";

const ThrowError = () => {
  throw new Error("Test error");
};

describe("ErrorBoundary", () => {
  beforeEach(() => {
    useI18nStore.setState({ language: "en" });
  });

  it("should display fallback UI when a child throws an error", () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Oops! Something went wrong./i).textContent).toContain("Oops! Something went wrong.");
  });

  it("should display fallback UI in Spanish", () => {
    useI18nStore.setState({ language: "es" });

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByRole("button", { name: "Reiniciar juego" })).toBeTruthy();
  });
});
