import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    // Several suites dynamically import heavy server modules; the 5s default
    // is not enough for a cold transform cache on Windows.
    testTimeout: 20000,
  },
});
