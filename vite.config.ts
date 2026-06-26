import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, type PluginOption } from "vite";
import visualizer from "vite-bundle-analyzer";

const analyze = process.env.ANALYZE === "true";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    analyze && visualizer(),
  ].filter(Boolean) as PluginOption[],
  server: {
    proxy: {
      "/graphql": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/upload": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
