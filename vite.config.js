import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

export default defineConfig({
  plugins: [reactRefresh()],
  base: "./", // Ensures correct relative paths in production
  server: {
    port: 3000, 
  },
  build: {
    outDir: "dist", 
    rollupOptions: {
      input: "src/main.tsx", // Ensure main.tsx is bundled correctly
      output: {
        entryFileNames: "main.js", // Ensures main.tsx compiles to main.js
      },
    },
  },
});
