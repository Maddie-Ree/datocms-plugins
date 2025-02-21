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
    emptyOutDir: true, // Clears the dist folder before building
    rollupOptions: {
      input: "index.html", // ✅ Ensures index.html is included in the build
    },
  },
});
