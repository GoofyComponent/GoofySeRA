import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import vitePluginFaviconsInject from "vite-plugin-favicons-inject";
import htmlPlugin from "vite-plugin-html-config";

const htmlPluginOpt = {
  title: "SeRA Dashboard",
};

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    react(),
    vitePluginFaviconsInject("./src/assets/images/favicon.svg"),
    htmlPlugin(htmlPluginOpt),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
