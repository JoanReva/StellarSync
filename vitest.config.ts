import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom", // Simula un DOM para las pruebas
    globals: true, // Habilita métodos globales como describe, it, etc.
  },
});