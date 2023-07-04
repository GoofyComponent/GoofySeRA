import path from "path";
import react from "@vitejs/plugin-react";
import vitePluginFaviconsInject from "vite-plugin-favicons-inject";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    react(),
    vitePluginFaviconsInject("./src/assets/images/favicon.svg"),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
