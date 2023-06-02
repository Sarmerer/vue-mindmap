import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },

    extensions: [".mjs", ".cjs", ".js", ".vue", ".jsx", ".json"],
  },

  build: {
    outDir: "docs",
  },

  base: "/vue-mindmap/",
});
