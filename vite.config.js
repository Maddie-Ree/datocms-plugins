import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // Ensures relative paths work in production
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        index: "index.html",  // ✅ Ensure index.html is processed
        main: "src/main.tsx", // ✅ Ensure main.tsx is bundled
      },
      output: {
        entryFileNames: "[name].js", // ✅ Generates index.js and main.js
      },
    },
  },
});
