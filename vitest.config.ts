import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      // Next's "server-only" guard is meaningless under vitest — stub it.
      "server-only": path.resolve(__dirname, "src/__tests__/server-only-stub.ts"),
      "@": path.resolve(__dirname, "src"),
    },
  },
});
