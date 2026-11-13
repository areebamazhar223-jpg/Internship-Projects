
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    css: true,
    clearMocks: true,
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (
            id.includes("recharts") ||
            id.includes("d3-") ||
            id.includes("date-fns")
          ) {
            return "charts";
          }

          if (
            id.includes("react") ||
            id.includes("react-dom") ||
            id.includes("react-router")
          ) {
            return "react";
          }

          if (id.includes("lucide-react")) {
            return "icons";
          }
        },
      },
    },
  },
});
