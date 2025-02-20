import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  base: "", // Base URL for production builds
  server: {
    port: 3000, // Ensure the correct port for development
  },
  build: {
    outDir: "dist", // Output directory for production builds
    rollupOptions: {
      input: "index.html", // Entry point for the plugin
    },
  },
});

